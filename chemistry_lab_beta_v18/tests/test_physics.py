import sys, unittest, tempfile, json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from physics.cache import slug,safe_name,MODELS_ALLOWLIST,_atom_bonds,DEFAULT_NAMES
class PhysicsTests(unittest.TestCase):
 def test_safe(self):
  self.assertEqual(slug('Acetic Acid'),'acetic_acid')
  for val in ['../etc/passwd','https://evil.tld','', '🚫']:
   with self.assertRaises(ValueError):safe_name(val)
 def test_allowlist(self):
  self.assertEqual(set(MODELS_ALLOWLIST),{'mace-mp-0b2-small'})
  self.assertTrue(all(m['license']=='MIT' and m['url'].startswith('https://huggingface.co/mace-foundations/') for m in MODELS_ALLOWLIST.values()))
 def test_geometry(self):
  data={'PC_Compounds':[{'atoms':{'aid':[1,2],'element':[8,1]},'coords':[{'conformers':[{'x':[0,1],'y':[0,0],'z':[0,1]}]}],'bonds':{'aid1':[1],'aid2':[2],'order':[1]}}]}
  r=_atom_bonds(data)
  self.assertEqual(r['geometry'],'3d');self.assertEqual(len(r['bonds']),1);self.assertEqual(len(r['atoms']),2)
 def test_defaults(self):self.assertGreaterEqual(len(DEFAULT_NAMES),10)
if __name__=='__main__':unittest.main()
