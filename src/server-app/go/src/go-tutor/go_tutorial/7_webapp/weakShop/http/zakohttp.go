package http

import (
	"os"
	"fmt"
	"net"
	"net/http"
	"sync"
	"bufio"
	"bytes"
	"context"
)

type ResponseWriter interface {
	Write([]byte) (int, error)
}

func HandleFunc(p string, h func(ResponseWriter, *Request)) {
	if h == nil {
		panic("zakohttp: nil handler")
	}

	handleFunc(p, h)
}

func ListenAndServe(addr string, h http.Handler) error {
	s := newServer(addr, h)
	return s.zakoListenAndServe()
}

type Server struct {
	http.Server
	l          net.Listener

	ctx        context.Context
	ctx_cancel context.CancelFunc
	ctx_mtx    *sync.Mutex
}

func (self *Server) Serve(l net.Listener) error {
	rcv_ch := make(chan *newconn)
	run_receiver(self.ctx, l, rcv_ch)

	for {
		select {
		case <- self.ctx.Done():
			return nil
		case rcv := <- rcv_ch:
			if rcv.err != nil {
				self.errlog("zakohttp: %s", rcv.err)
				continue
			}

			rw := rcv.con
			c := self.newConn(rw)
			c.serve(self.ctx)
		}
	}
}

func (self *Server) Close() error {
	self.ctx_cancel()
	return self.l.Close()
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

	return self.Serve(ln)
}

func (self *Server) errlog(f string, vals ...interface{}) {
	fmt.Fprintf(os.Stdout, f, vals...)
}

type newconn struct {
	con net.Conn
	err error
}

func run_receiver(ctx context.Context, l net.Listener, rcv_ch chan <- *newconn) {
	go func() {
		for {
			con, err := l.Accept()
			select {
			case <- ctx.Done():
				return
			case rcv_ch <- &newconn{con: con, err: err}:
			}
		}
	}()
}

type conn struct {
	srv *Server

	con net.Conn
	r   *bufio.Reader
	w   *bufio.Writer
}

func (self *Server) newConn(rw net.Conn) *conn {
	return &conn{
		srv: self,
		con: rw,
		r: bufio.NewReader(rw),
		w: bufio.NewWriter(rw),
	}
}

func (self *conn) serve(ctx context.Context) {
	defer self.con.Close()
	defer self.w.Flush()

	req, err := http.ReadRequest(self.r)
	if err != nil {
		self.srv.errlog("zakohttp: %s", err)
		return
	}

	w := newResponse()
	defaultServeMux.ServeHTTP(w, req)
	r := bufio.NewReader(w.buffer())
	resp, err := http.ReadResponse(r, req)
	if err != nil {
		self.srv.errlog("zakohttp: %s", err)
		return
	}
	resp.Write(self.w)
}

type response struct {
	b  bytes.Buffer
}

func newResponse() *response {
	self := new(response)
	self.Write([]byte("HTTP/1.1 200 OK\n\n"))
	return self
}

func (self *response) Header() http.Header { //nop
	return make(http.Header)
}

func (self *response) Write(bs []byte) (int, error) {
	return self.b.Write(bs)
}

func (self *response) WriteHeader(statusCode int) { //nop
	return
}

func (self *response) buffer() *bytes.Buffer {
	self.Write([]byte("\n"))
	return &(self.b)
}

type serveMux struct {
	sm *http.ServeMux
}

func (self *serveMux) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	self.sm.ServeHTTP(w, r)
}

func (self *serveMux) HandleFunc(p string, h func(http.ResponseWriter, *http.Request)) {
	self.sm.HandleFunc(p, h)
}

var defaultServeMux *serveMux
func init() {
	defaultServeMux = &serveMux{sm: http.DefaultServeMux}
}

func handleFunc(p string, h func(ResponseWriter, *Request)) {
	h_wrapper := func(r_w http.ResponseWriter, req *http.Request){
		h(r_w, conv2ZakoRequest(req))
	}
	defaultServeMux.HandleFunc(p, h_wrapper)
}
