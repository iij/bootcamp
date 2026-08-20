from fastapi.testclient import TestClient
from ..exercise2 import challenge

client = TestClient(challenge.app)


def test_get_index():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json() == {"message": "hello world"}


def test_get_echo():
    res = client.get("/echo/hoge")
    assert res.status_code == 200
    assert res.json() == {"message": "got the message: hoge"}
