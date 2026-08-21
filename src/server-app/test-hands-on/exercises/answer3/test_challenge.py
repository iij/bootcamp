from unittest import mock
from fastapi.testclient import TestClient
from ..exercise3 import challenge

client = TestClient(challenge.app)


def test_get_gacha():
    with mock.patch.object(challenge, "_exec_gacha", return_value=True):
        res = client.get("/gacha")
        assert res.status_code == 200
        assert res.json() == {"message": "you win"}

    with mock.patch.object(challenge, "_exec_gacha", return_value=False):
        res = client.get("/gacha")
        assert res.status_code == 200
        assert res.json() == {"message": "you lose"}
