#!/usr/bin/env python
import sys
import os
import time

import redis

os.environ['PYTHONUNBUFFERED'] = '1'

HOST = os.environ['REDIS_PORT_6379_TCP_ADDR']
PORT = os.environ['REDIS_PORT_6379_TCP_PORT']
DB = 2

r = redis.Redis(host=HOST, port=PORT, db=DB, decode_responses=True)
r.flushall()

# 1 秒おきに 10 件のログを、expire 15秒で書き出す
print('output logs...')
for i in range(10):
    r.set(time.asctime(), 'log %02d' % i, ex=15)
    print(i)
    time.sleep(1)

# 1 秒おきに DB 内容を表示して、expire される様子を確かめる
print("\nchecking...")
time.sleep(1)
for i in range(14):
    print(r.keys('*'))
    time.sleep(1)

sys.exit(0)
