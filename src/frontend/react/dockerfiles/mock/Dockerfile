FROM node:14.6.0-slim

WORKDIR /mock

RUN npm install -g json-server
COPY ./db.json /mock

CMD ["json-server", "--watch", "db.json", "-p", "5000", "--host", "0.0.0.0"]
