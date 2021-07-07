FROM golang:1.16.5 AS builder
LABEL maintainer="s.k.noe@hinoshiba.com"

ENV GOPATH /go/src
ENV GO111MODULE=off

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
