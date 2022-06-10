import unittest
from ..exercise1.challenge import apply


class ApplyTestCase(unittest.TestCase):
    # 境界値のテスト
    def test_boundary_value(self):
        self.assertEqual(apply(9), 'not accepted')
        self.assertEqual(apply(10), 'accepted')

        self.assertEqual(apply(100), 'accepted')
        self.assertEqual(apply(101), 'not accepted')

    # 同値クラスのテスト
    def test_equivalence_partitioning(self):
        self.assertEqual(apply(-10), 'not accepted')
        self.assertEqual(apply(0), 'not accepted')
        self.assertEqual(apply(5), 'not accepted')

        self.assertEqual(apply(20), 'accepted')
        self.assertEqual(apply(50), 'accepted')
        self.assertEqual(apply(90), 'accepted')

        self.assertEqual(apply(105), 'not accepted')
        self.assertEqual(apply(110), 'not accepted')
        self.assertEqual(apply(200), 'not accepted')

    # 例外処理のテスト
    def test_catch_typeerror(self):
        with self.assertRaises(TypeError):
            apply('hoge')
        with self.assertRaises(TypeError):
            apply(123.456)
