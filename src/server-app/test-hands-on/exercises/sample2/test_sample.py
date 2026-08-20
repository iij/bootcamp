from fastapi.testclient import TestClient
from . import sample

client = TestClient(sample.app)


def test_api():
    res = client.get("/hello")

    status = res.status_code
    data = res.json()

    assert status == 200
    assert data == {"response": "hello"}
