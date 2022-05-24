FROM golang:latest

RUN apt-get update && apt-get install -y python3-pip vim
RUN mkdir /work
WORKDIR /work

ENV no_proxy 127.0.0.1,localhost
