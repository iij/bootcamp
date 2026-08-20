from unittest import mock
from fastapi.testclient import TestClient
from . import challenge

client = TestClient(challenge.app)


def test_get_gacha():
    # 確率でレスポンスが変動する"/gacha"のAPIをテストしよう
    # 関数"challenge._exec_gacha"は、返り値が不定のため、この関数の返り値を固定してみよう
    # 参考URL: https://docs.python.org/ja/3/library/unittest.mock.html
    # `with mock.patch.object(パッケージ, "関数名", return_value="返り値")`
    pass
