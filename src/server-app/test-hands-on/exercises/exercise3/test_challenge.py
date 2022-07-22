import unittest
from fastapi.testclient import TestClient
from . import challenge

client = TestClient(challenge.app)


class ApiTestCase(unittest.TestCase):
    # このテストは変更せず、テストが通るように"challenge.py"を改修しよう
    # 仕様通りにAPIを作成すると、このテストは通るようになるよ
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

    # 以下、加減乗除を行うAPIを作成するため、加算⇒減算⇒乗算⇒除算の順に動作をテストしていこう
    def test_tdd(self):
        res = client.get("/")
        data = res.json()
        self.assertEqual(data, {"current_number": 0})

        res = client.get("/add/10")
        data = res.json()
        self.assertEqual(data, {"current_number": 10})
