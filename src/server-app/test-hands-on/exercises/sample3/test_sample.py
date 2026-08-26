from unittest import mock
from . import sample


def test_rock_paper_scissors():
    # あいこのテスト
    with mock.patch.object(sample, "_my_shoot", return_value="rock"):
        assert sample.rock_paper_scissors("rock") == 0

    # 勝利のテスト
    with mock.patch.object(sample, "_my_shoot", return_value="scissors"):
        assert sample.rock_paper_scissors("rock") == 1

    # 敗北のテスト
    with mock.patch.object(sample, "_my_shoot", return_value="paper"):
        assert sample.rock_paper_scissors("rock") == -1
