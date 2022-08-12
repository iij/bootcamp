FROM golang:1.19 AS builder
LABEL maintainer="jo7oem@ume-ch.net"

ENV GOPATH /go/src

ENV LANG ja_JP.UTF-8
ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && \
    apt install -y curl wget tzdata file locales && \
    apt install -y vim-nox emacs-nox nano && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* && \
    ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    locale-gen ja_JP.UTF-8

ADD ./samples ${GOPATH}/samples/
ADD ./go_tutorial ${GOPATH}/go_tutorial
WORKDIR ${GOPATH}
