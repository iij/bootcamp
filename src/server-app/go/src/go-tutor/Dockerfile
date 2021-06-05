FROM golang:1.12

ADD . /go/src/localhost/

ENV GO111MODULE=on
RUN apt-get -y update \
  && apt-get -y upgrade \
  && apt-get -y install vim-nox emacs-nox curl sqlite3 locales

ENV LANG=ja_JP.UTF-8
RUN echo "ja_JP UTF-8" > /etc/locale.gen
RUN locale-gen
