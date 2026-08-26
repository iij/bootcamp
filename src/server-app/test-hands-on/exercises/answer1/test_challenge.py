import pytest
from ..exercise1.challenge import apply


# 境界値のテスト
def test_boundary_value():
    assert apply(9) == "not accepted"
    assert apply(10) == "accepted"

    assert apply(100) == "accepted"
    assert apply(101) == "not accepted"


# 同値クラスのテスト
def test_equivalence_partitioning():
    assert apply(-10) == "not accepted"
    assert apply(0) == "not accepted"
    assert apply(5) == "not accepted"

    assert apply(20) == "accepted"
    assert apply(50) == "accepted"
    assert apply(90) == "accepted"

    assert apply(105) == "not accepted"
    assert apply(110) == "not accepted"
    assert apply(200) == "not accepted"


# 例外処理のテスト
def test_catch_typeerror():
    with pytest.raises(TypeError):
        apply("hoge")
    with pytest.raises(TypeError):
        apply(123.456)
