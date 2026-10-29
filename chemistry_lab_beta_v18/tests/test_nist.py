import unittest
from physics.nist import parse_asd,summary,filename
class NISTTests(unittest.TestCase):
 def test_parse(self):
  self.assertEqual(parse_asd('Wavelength | Intensity\n 589.0000 | 500\n589.6000 | 200\n'),[589.0,589.6])
 def test_reject_outside_visible(self):
  self.assertEqual(parse_asd('120.02 | 10\n900.45 | 20'),[])
 def test_bounds(self):
  with self.assertRaises(ValueError):filename(119)
 def test_total(self):
  self.assertEqual(summary()['total_elements'],118)
