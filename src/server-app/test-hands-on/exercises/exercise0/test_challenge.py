import unittest
from .challenge import hello


class HelloTestCase(unittest.TestCase):
    def test_success(self):
        self.assertEqual(hello(), "hello iij-bootcamp")
