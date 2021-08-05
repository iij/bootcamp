package http

import (
	"net/http"
	"net/url"
)

type Request struct {
	org *http.Request

	Method     string
	URL        *url.URL
	Proto      string
	RequestURI string
}

func conv2ZakoRequest(req *http.Request) *Request {
	if req == nil {
		return &Request{URL: new(url.URL)}
	}
	return &Request{
		org: req,
		Method: req.Method,
		URL: req.URL,
		Proto: req.Proto,
		RequestURI: req.RequestURI,
	}
}
