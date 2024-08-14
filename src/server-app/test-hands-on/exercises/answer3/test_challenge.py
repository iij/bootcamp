import unittest
from fastapi.testclient import TestClient
from . import challenge

client = TestClient(challenge.app)


class ApiTestCase(unittest.TestCase):
    def test_success(self):
        res = client.get("/")
        self.assertEqual(res.json(), {"current_number": 0})
        res = client.get("/add/123")
        self.assertEqual(res.json(), {"current_number": 123})
        res = client.get("/sub/13")
        self.assertEqual(res.json(), {"current_number": 110})
        res = client.get("/mul/5")
        self.assertEqual(res.json(), {"current_number": 550})
        res = client.get("/div/275")
        self.assertEqual(res.json(), {"current_number": 2})

        client.get("/sub/2")

    def test_tdd(self):
        res = client.get("/")
        data = res.json()
        self.assertEqual(data, {"current_number": 0})

        res = client.get("/add/10")
        data = res.json()
        self.assertEqual(data, {"current_number": 10})

        res = client.get("/sub/5")
        data = res.json()
        self.assertEqual(data, {"current_number": 5})

        res = client.get("/mul/3")
        data = res.json()
        self.assertEqual(data, {"current_number": 15})

        res = client.get("/div/5")
        data = res.json()
        self.assertEqual(data, {"current_number": 3})
