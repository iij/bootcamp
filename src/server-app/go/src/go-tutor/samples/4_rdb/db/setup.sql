DROP TABLE users;

CREATE TABLE users (
  id integer PRIMARY KEY AUTOINCREMENT,
  name text
);

INSERT INTO users (name) VALUES ("hogehoge");
INSERT INTO users (name) VALUES ("fugafuga");
