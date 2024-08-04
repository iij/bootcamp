#!/bin/bash
if [ $# -ne 3 ]; then
  echo "Usage: $0 <id> <name> <count>"
  exit 1
fi

curl -XPUT -v -H "Content-Type: application/json"  "http://localhost:8080/api/goods/${1}" \
  -d "{\"name\":\"${2}\",\"count\":${3}}"