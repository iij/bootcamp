#!/usr/bin/env python
import sys
import os
from pathlib import Path

import redis

HOST = os.environ['REDIS_PORT_6379_TCP_ADDR']
PORT = os.environ['REDIS_PORT_6379_TCP_PORT']
DB = 1

r = redis.Redis(host=HOST, port=PORT, db=DB, decode_responses=True)

file = Path('/etc/passwd')
with file.open() as f:
    for line in f:
        s = line.strip().split(':')
        r.hmset(s[0], { 'user': s[0], 'passwd': s[1], 'uid': s[2], 'gid': s[3], 'desc': s[4], 'home': s[5], 'shell': s[6] })

for key in r.scan_iter():
    if r.type(key) == 'hash':
        print(key, r.hgetall(key))

sys.exit(0)
