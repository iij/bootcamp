#!/bin/bash
if [ $# -ne 2 ]; then
  echo "Usage: $0 <id> <name> <count>"
  exit 1
fi

curl -XPOST -v -H "Content-Type: application/json" "http://localhost:8080/api/goods" \
  -d "{\"name\":\"${1}\",\"count\":${2}}"