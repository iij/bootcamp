FROM ubuntu:20.04
LABEL maintainer="s.k.noe@hinoshiba.com"

ENV GOVERSION 1.16.5

ENV GOROOT /opt/go
ENV GOPATH /go/src
ENV GO111MODULE=on

ENV LANG ja_JP.UTF-8
ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && \
    apt install -y curl wget tzdata language-pack-ja-base language-pack-ja && \
    apt-get -y install vim-nox emacs-nox curl sqlite3 locales && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* && \
    ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    locale-gen ja_JP.UTF-8

RUN cd /opt && wget -nv --show-progress --progress=bar:force:noscroll https://golang.org/dl/go${GOVERSION}.linux-amd64.tar.gz && \
    tar zxf go${GOVERSION}.linux-amd64.tar.gz && rm go${GOVERSION}.linux-amd64.tar.gz && \
    ln -s /opt/go/bin/go /usr/bin/ && \
    mkdir -p ${GOPATH} && \
    mkdir /.cache && \
    chmod 777 /.cache

ADD ./samples /go/src/samples/
WORKDIR ${GOPATH}/samples/
