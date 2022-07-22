#!/bin/bash

# chrome と angular が入ったimageを作るためのスクリプトです。

export DOCKER_BUILDKIT=1
docker build \
  --file=Dockerfile \
  -t "bootcamp-angular" \
  .

docker run -it --rm -v "$(pwd)":/app -p 4200:4200 bootcamp-angular bash
