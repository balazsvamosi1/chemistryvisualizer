"""P0 structural and concurrency regression checks."""
import sys, unittest, threading
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import server

ROOT=Path(__file__).resolve().parents[1]
class P0Tests(unittest.TestCase):
 def test_metal_categories(self):
  src=(ROOT/'assets/js/app-core.js').read_text()
  self.assertIn("'post','lanth','act'",src)
  self.assertNotIn("'post','lanthanide','actinide'",src)
 def test_ammonia_is_molecular(self):
  self.assertIn('"f":"NH₃","type":"molecule"',(ROOT/'assets/js/app-core.js').read_text())
 def test_snapshot_is_detached(self):
  with server.SYNC_STATE_LOCK:
   server.SYNC.update(running=True,done=1,total=2,errors=[{'name':'test'}])
  snap=server.sync_snapshot()
  with server.SYNC_STATE_LOCK:server.SYNC['errors'].append({'name':'after'})
  self.assertEqual(len(snap['errors']),1)
 def test_concurrent_reads_and_writes(self):
  def writer():
   for i in range(500):
    with server.SYNC_STATE_LOCK:server.SYNC['errors'].append({'i':i});server.SYNC['done']=i
  thread=threading.Thread(target=writer);thread.start()
  for i in range(500):
   snap=server.sync_snapshot()
   self.assertIsInstance(snap['errors'],list)
  thread.join()
 def test_hidden_canvas_throttling(self):
  for filename in ['app-core.js','viewer-3d.js','quest.js']:
   self.assertIn('document.hidden',(ROOT/'assets/js'/filename).read_text())
 def test_quest_test_surface(self):
  src=(ROOT/'assets/js/quest.js').read_text()
  for phrase in ('setPlayer:','setInventory:','setBoss:','loadLevel,complete:'):
   self.assertIn(phrase,src)
if __name__=='__main__':unittest.main()
