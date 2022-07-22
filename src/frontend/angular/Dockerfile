# syntax = docker/dockerfile:experimental

ARG NODE_VERSION=12.16.3

FROM node:16.7-buster as node
ENV LANG=en_US.UTF-8
WORKDIR /app


FROM node as chrome-installed
# hadolint ignore=DL3008
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
               libxshmfence1 \
               libappindicator1 \
               fonts-liberation \
               libappindicator3-1 \
               libasound2 \
               libatk-bridge2.0-0 \
               libdrm2 \
               libgbm1 \
               libgtk-3-0 \
               libnspr4 \
               libnss3 \
               libx11-xcb1 \
               libxcb-dri3-0 \
               libxss1 \
               libxtst6 \
               xdg-utils \
               ca-certificates \
               wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN wget --no-check-certificate https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && dpkg -i google-chrome*.deb \
    && rm google-chrome-stable_current_amd64.deb


FROM chrome-installed as runtime
# hadolint ignore=DL3008
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        vim \
        emacs \
        nano \
        curl \
        git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

FROM runtime as pre-install
# hadolint ignore=DL3016
RUN npm install -g @angular/cli

FROM pre-install
