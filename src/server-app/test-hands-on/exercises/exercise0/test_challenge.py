from .challenge import hello


def test_success():
    assert hello() == "hello iij-bootcamp"
