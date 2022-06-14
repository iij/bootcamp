import unittest
from fastapi.testclient import TestClient
from . import challenge

client = TestClient(challenge.app)


class ApiTestCase(unittest.TestCase):
    # このテストは変更せず、テストが通るように"challenge.py"を改修しよう
    def test_success(self):
        # 初期値を確認
        res = client.get("/")
        data = res.json()
        self.assertEqual(data, {"current_number": 0})

        # 加算を確認
        res = client.get("/add/123")
        data = res.json()
        self.assertEqual(data, {"current_number": 123})

        # 減算を確認
        res = client.get("/sub/13")
        data = res.json()
        self.assertEqual(data, {"current_number": 110})

        # 乗算を確認
        res = client.get("/mul/5")
        data = res.json()
        self.assertEqual(data, {"current_number": 550})

        # 除算を確認
        res = client.get("/div/275")
        data = res.json()
        self.assertEqual(data, {"current_number": 2})

    # 以下、加減乗除を行うAPIを作成するため、各エンドポイントの動作をテストしていこう
    def test_tdd1(self):
        res = client.get("/mul/5")
        status = res.status_code
        self.assertEqual(200, status)
