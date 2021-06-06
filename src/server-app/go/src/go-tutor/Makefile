D=docker
IMAGE_NAME=go-tour
CONTAINER_NAME=go-tour

SRCS := $(shell find . -type f)
export http_proxy
export https_proxy

all: build run ## exec "build" and "run"
build: $(SRCS) ## build to all container
ifeq ($(http_proxy), )
ifeq ($(https_proxy), )
	$(D) image build -t $(IMAGE_NAME) .
else
	$(D) image build --build-arg https_proxy=$(https_proxy) -t $(IMAGE_NAME) .
endif
else
ifeq ($(https_proxy), )
	$(D) image build --build-arg http_proxy=$(http_proxy) -t $(IMAGE_NAME) .
else
	$(D) image build --build-arg http_proxy=$(http_proxy) --build-arg https_proxy=$(https_proxy) -t $(IMAGE_NAME) .
endif
endif

run: $(SRCS) ## start up to all container
	$(D) run --name $(CONTAINER_NAME) --rm -it $(IMAGE_NAME) /bin/bash

stop: $(SRCS) ## down to to all container
	$(D) stop $(CONTAINER_NAME)

.PHONY: clean
clean: ## stop container and cleanup data
	$(D) rmi $(IMAGE_NAME)

.PHONY: help
	all: help
help: ## help
	@awk -F ':|##' '/^[^\t].+?:.*?##/ {\
		printf "\033[36m%-30s\033[0m %s\n", $$1, $$NF \
	}' $(MAKEFILE_LIST)
