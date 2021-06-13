package http

import (
	"os"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"sync"
	"bufio"
	"bytes"
	"context"
)

type ResponseWriter interface {
	Write([]byte) (int, error)
}

type Server struct {
	http.Server

	ctx        context.Context
	ctx_cancel context.CancelFunc
	ctx_mtx    *sync.Mutex
}

func newServer(addr string, h http.Handler) *Server {
	s := new(Server)
	s.Addr = addr
	s.Handler = h
	s.ctx_mtx = new(sync.Mutex)

	s.updateContextTree(nil)
	return s
}

func (self *Server) updateContextTree(b_ctx context.Context) {
	self.ctx_mtx.Lock()
	defer self.ctx_mtx.Unlock()

	if b_ctx == nil {
		b_ctx = context.Background()
	}
	if self.ctx != nil {
		self.ctx_cancel()
		self.ctx_cancel = nil
		self.ctx = nil
	}
	ctx, cancel := context.WithCancel(b_ctx)
	self.ctx = ctx
	self.ctx_cancel = cancel
}

func (self *Server) zakoListenAndServe() error {
	addr := self.Addr
	if addr == "" {
		addr = ":http"
	}
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}
	defer ln.Close()

	return self.Serve(ln)
}

func (self *Server) errlog(f string, vals ...interface{}) {
	fmt.Fprintf(os.Stdout, f, vals...)
}

func (self *Server) Serve(l net.Listener) error {
	type rcv struct {
		con net.Conn
		err error
	}

	rcv_ch := make(chan *rcv)
	go func() {
		for {
			con, err := l.Accept()
			select {
			case <- self.ctx.Done():
				return
			case rcv_ch <- &rcv{con: con, err: err}:
			}
		}
	}()

	for {
		select {
		case <- self.ctx.Done():
			return nil
		case rcv := <- rcv_ch:
			func() {
				if rcv.err != nil {
					self.errlog("zakohttp: %s", rcv.err)
					return
				}

				con_r := bufio.NewReader(rcv.con)
				con_w := bufio.NewWriter(rcv.con)
				req, err := http.ReadRequest(con_r)
				if err != nil {
					self.errlog("zakohttp: %s", rcv.err)
					return
				}

				fmt.Println(req.RequestURI)

				w := new(writer)
				w.Write([]byte("HTTP/1.1 200 OK\n\n"))
				defaultServeMux.ServeHTTP(w, req)

				r := bufio.NewReader(w.buffer())
				resp, err := http.ReadResponse(r, req)
				if err != nil {
					self.errlog("zakohttp: %s", err)
					return
				}
				w.Write([]byte("\n"))
				resp.Write(con_w)

				con_w.Flush()
				rcv.con.Close()
			}()
		}
	}
}

type writer struct {
	b  bytes.Buffer
}

func (self *writer) Header() http.Header { //nop
	return make(http.Header)
}

func (self *writer) Write(bs []byte) (int, error) {
	return self.b.Write(bs)
}

func (self *writer) WriteHeader(statusCode int) { //nop
	return
}

func (self *writer) buffer() *bytes.Buffer {
	return &(self.b)
}

type ServeMux struct {
	sm *http.ServeMux
}

func (self *ServeMux) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	self.sm.ServeHTTP(w, r)
}

func (self *ServeMux) HandleFunc(p string, h func(http.ResponseWriter, *http.Request)) {
	self.sm.HandleFunc(p, h)
}

var defaultServeMux *ServeMux
func init() {
	defaultServeMux = &ServeMux{sm: http.DefaultServeMux}
}

type Request struct {
	org *http.Request
}

func asZakoRequest(req *http.Request) *Request {
	return &Request{org: req}
}

func (self *Request) Method() string {
	if self.org == nil {
		return ""
	}
	return self.org.Method
}

func (self *Request) URL() *url.URL {
	if self.org == nil {
		return &url.URL{}
	}
	return self.org.URL
}

func (self *Request) Proto() string {
	if self.org == nil {
		return ""
	}
	return self.org.Proto
}

func (self *Request) RequestURI() string {
	if self.org == nil {
		return ""
	}
	return self.org.RequestURI
}

func HandleFunc(p string, h func(ResponseWriter, *Request)) {
	if h == nil {
		panic("zakohttp: nil handler")
	}

	h_wrapper := func(r_w http.ResponseWriter, req *http.Request){
		h(r_w, asZakoRequest(req))
	}
	defaultServeMux.HandleFunc(p, h_wrapper)
}

func ListenAndServe(addr string, h http.Handler) error {
	s := newServer(addr, h)
	return s.zakoListenAndServe()
}
