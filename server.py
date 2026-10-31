"""Chemistry Lab 1.5 — localhost-only API and static server. Python 3.10+, stdlib only."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
from physics.cache import load, fetch_pubchem, list_cache, model_status, download_model, DEFAULT_NAMES
import json, os, argparse, threading
from physics import nist

ROOT=Path(__file__).resolve().parent
os.chdir(ROOT)
SYNC_LOCK=threading.Lock()
SYNC_STATE_LOCK=threading.Lock()
def sync_snapshot():
 with SYNC_STATE_LOCK:
  return {**SYNC, 'errors':list(SYNC['errors'])}
SYNC={'running':False,'done':0,'total':0,'errors':[]}

def sync_worker(names):
 global SYNC
 try:
  for name in names:
   try:fetch_pubchem(name)
   except Exception as exc:
    with SYNC_STATE_LOCK:SYNC['errors'].append({'name':name,'message':str(exc)[:160]})
   with SYNC_STATE_LOCK:SYNC['done']+=1
 finally:
  with SYNC_STATE_LOCK:SYNC['running']=False
  SYNC_LOCK.release()

class Handler(SimpleHTTPRequestHandler):
 def reply(self,status,obj):
  data=json.dumps(obj,ensure_ascii=False).encode('utf-8')
  self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Content-Length',str(len(data)));self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(data)
 def do_GET(self):
  u=urlsplit(self.path)
  if u.path=='/api/nist/status':return self.reply(200,nist.summary())
  if u.path=='/api/nist/element':
   try:return self.reply(200,nist.read(int(parse_qs(u.query).get('z',['0'])[0])))
   except (ValueError,IndexError) as exc:return self.reply(400,{'error':str(exc)})
  if u.path=='/api/physics/status':return self.reply(200,{'cache':list_cache(),'models':model_status(),'sync':sync_snapshot(),'backend':'reference data + model checkpoint cache; no energy/stability inference'})
  if u.path=='/api/physics/molecule':
   name=parse_qs(u.query).get('name',[''])[0]
   try:
    record=load(name)
    return self.reply(200,{'found':bool(record),'record':record})
   except ValueError as exc:return self.reply(400,{'error':str(exc)})
  return super().do_GET()
 def do_POST(self):
  u=urlsplit(self.path)
  if u.path not in ('/api/physics/sync','/api/physics/models','/api/nist/sync'):return self.reply(404,{'error':'Not found'})
  try:
   length=int(self.headers.get('Content-Length','0'))
   if not 0<=length<=8192:raise ValueError('Invalid request size')
   payload=json.loads(self.rfile.read(length)) if length else {}
   if not isinstance(payload,dict):raise ValueError('Expected JSON object')
   if u.path=='/api/nist/sync':
    z=int(payload.get('z',0))
    if not 1<=z<=118:raise ValueError('Z must be 1–118')
    return self.reply(200,nist.sync(z))
   if u.path=='/api/physics/sync':
    names=payload.get('names',DEFAULT_NAMES)
    if not isinstance(names,list) or not 1<=len(names)<=30:raise ValueError('1–30 names required')
    from physics.cache import safe_name
    names=[safe_name(n) for n in names]
    if not SYNC_LOCK.acquire(False):return self.reply(409,{'error':'Synchronization already running'})
    with SYNC_STATE_LOCK:SYNC.update({'running':True,'done':0,'total':len(names),'errors':[]})
    threading.Thread(target=sync_worker,args=(names,),daemon=True).start()
    return self.reply(202,{'started':True,'total':len(names)})
   if u.path=='/api/physics/models':
    # Deliberately synchronous and opt-in; operator must click the download button.
    return self.reply(200,download_model(payload.get('id')))
  except Exception as exc:return self.reply(400,{'error':str(exc)[:220]})

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8000)
 args=parser.parse_args()
 print(f'Chemistry Lab Beta 1.5: http://127.0.0.1:{args.port}/',flush=True)
 httpd=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
 try:httpd.serve_forever()
 except KeyboardInterrupt:pass
 finally:httpd.server_close()
