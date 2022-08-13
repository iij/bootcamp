FROM golang:1.19 AS builder
LABEL maintainer="jo7oem@ume-ch.net"

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG ja_JP.UTF-8

ENV GOPATH /go/src
ENV GO111MODULE=off

RUN apt-get update && \
    apt-get install -y locales && \
    ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    sed -i -E "s/# (${LANG})/\1/" /etc/locale.gen && \
    locale-gen && \
    apt-get install -y curl wget tzdata file locales bash-completion && \
    apt-get install -y vim-nox vim-snippets emacs-nox nano && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ADD ./samples ${GOPATH}/samples/
ADD ./go_tutorial ${GOPATH}/go_tutorial
WORKDIR ${GOPATH}
