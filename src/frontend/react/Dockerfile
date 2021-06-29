FROM node:16.3.0
RUN apt update \
    && apt install vim emacs -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN npx create-react-app app --template typescript
WORKDIR /app/
