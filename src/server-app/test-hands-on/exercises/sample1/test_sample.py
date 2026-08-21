from .sample import f


def test_equivalence_partitioning():
    # 有効同値のテスト
    assert f(10) is True
    assert f(50) is True
    assert f(90) is True

    # 無効同値のテスト
    assert f(-500) is False
    assert f(-10) is False
    assert f(110) is False
    assert f(500) is False


def test_boundary_value():
    # 下限の境界値
    assert f(-1) is False
    assert f(0) is True

    # 上限の境界値
    assert f(100) is True
    assert f(101) is False
