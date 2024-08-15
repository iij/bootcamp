import unittest
from unittest import mock
from fastapi.testclient import TestClient
from . import challenge

client = TestClient(challenge.app)


class ApiTestCase(unittest.TestCase):
    def test_get_index(self):
        # "/"のパスでアクセスして実行するAPIのテストをしよう
        pass

    def test_get_echo_test(self):
        # 〇〇の値でレスポンスが変わる、"/echo/〇〇"のAPIをテストしよう
        pass

    def test_get_gacha(self):
        # 確率でレスポンスが変動する"/gacha"のAPIをテストしよう
        # 関数"challenge._exec_gacha"は、返り値が不定のため、この関数の返り値を固定してみよう
        # 参考URL: https://docs.python.org/ja/3/library/unittest.mock.html
        # `with mock.patch.object(パッケージ, "関数名", return_value="返り値")`
        pass
