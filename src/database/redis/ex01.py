#!/usr/bin/env python
import sys
import os
import re
from pathlib import Path

import redis

HOST = os.environ['REDIS_PORT_6379_TCP_ADDR']
PORT = os.environ['REDIS_PORT_6379_TCP_PORT']
DB = 0

r = redis.Redis(host=HOST, port=PORT, db=DB, decode_responses=True)
r.flushall()

file = Path('/etc/services')
with file.open() as f:
    for line in f:
        s = re.sub(r'#.*$', '', line).strip().split()
        if len(s) < 2: continue
        port = s.pop(1)
        r.lpush(port, *s)

for key in r.scan_iter():
    if r.type(key) == 'list':
        print(key, r.lrange(key, 0, 10))

sys.exit(0)
