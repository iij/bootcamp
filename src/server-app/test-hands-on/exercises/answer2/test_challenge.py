import unittest
from unittest import mock
from fastapi.testclient import TestClient
from ..exercise2 import challenge

client = TestClient(challenge.app)


class ApplyTestCase(unittest.TestCase):
    def test_get_index(self):
        res = client.get("/")
        status = res.status_code
        data = res.json()
        self.assertEqual(status, 200)
        self.assertEqual(data, {"message": "hello world"})

    def test_get_echo_test(self):
        res = client.get("/echo/hoge")
        status = res.status_code
        data = res.json()
        self.assertEqual(status, 200)
        self.assertEqual(data, {"message": "got the message: hoge"})


    def test_get_gacha(self):
        with mock.patch.object(challenge, '_exec_gacha', return_value=True):
            res = client.get("/gacha")
            status = res.status_code
            data = res.json()
            self.assertEqual(status, 200)
            self.assertEqual(data, {"message": "you win"})

        with mock.patch.object(challenge, '_exec_gacha', return_value=False):
            res = client.get("/gacha")
            status = res.status_code
            data = res.json()
            self.assertEqual(status, 200)
            self.assertEqual(data, {"message": "you lose"})
