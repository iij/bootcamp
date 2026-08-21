from fastapi.testclient import TestClient
from . import challenge

client = TestClient(challenge.app)


def test_get_index():
    # "/"のパスでアクセスして実行するAPIのテストをしよう
    pass


def test_get_echo():
    # 〇〇の値でレスポンスが変わる、"/echo/〇〇"のAPIをテストしよう
    pass
