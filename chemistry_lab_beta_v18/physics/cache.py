"""Licensed-source-aware local molecular data caching (Python standard library)."""
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from datetime import datetime, timezone
import json, os, re, tempfile, threading

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / 'cache'
PUBCHEM = CACHE / 'pubchem'
MODELS = CACHE / 'models'
PUBCHEM.mkdir(parents=True, exist_ok=True)
MODELS.mkdir(parents=True, exist_ok=True)
LOCK = threading.RLock()
# Built-in allowlist protects against untrusted URLs, remote path traversal, or accidental download of different model licenses.
MODELS_ALLOWLIST = {
 'mace-mp-0b2-small': {'url':'https://huggingface.co/mace-foundations/mace-mp-0/resolve/main/mace-mp-0b2-small.model','license':'MIT', 'use':'materials (not validated for molecular stability)', 'max_bytes': 150_000_000},
}
DEFAULT_NAMES = ['water','methane','carbon dioxide','ammonia','ethanol','acetic acid','glucose','hydrogen peroxide','benzene','acetone','formaldehyde','hydrogen chloride']

def safe_name(name):
 if not isinstance(name,str) or not 1<=len(name)<=80 or not re.fullmatch(r'[a-zA-Z0-9 +,().-]+', name):
  raise ValueError('Use an English chemical name (max 80 characters; ASCII)')
 return name.strip()

def slug(name):
 return re.sub(r'[^a-z0-9]+','_',safe_name(name).lower()).strip('_')

def _get_json(url):
 req=Request(url,headers={'User-Agent':'ChemistryLab/1.5 (educational open chemistry cache)','Accept':'application/json'})
 with urlopen(req,timeout=17) as resp:
  if int(resp.headers.get('Content-Length','0'))>3_000_000: raise ValueError('Response too large')
  raw=resp.read(3_000_001)
  if len(raw)>3_000_000: raise ValueError('Response too large')
  return json.loads(raw)

def _atom_bonds(data):
 compounds=data.get('PC_Compounds') or []
 if not compounds:return None
 compound=compounds[0]; atom_data=compound.get('atoms',{}); aids=atom_data.get('aid',[])
 # PubChem atomic numbers in element field
 elements=atom_data.get('element',[])
 if len(aids)!=len(elements):return None
 coords=compound.get('coords') or []
 conformers=(coords[0].get('conformers') or []) if coords else []
 conf=conformers[0] if conformers else {}
 xs,ys,zs=conf.get('x',[]),conf.get('y',[]),conf.get('z',[])
 items=[]
 for i,(aid,z) in enumerate(zip(aids,elements)):
  at={'id':aid,'atomic_number':z}
  if i<len(xs) and i<len(ys):at['x']=xs[i];at['y']=ys[i];at['z']=zs[i] if i<len(zs) else 0
  items.append(at)
 bonds=compound.get('bonds') or {}
 links=[{'a':a,'b':b,'order':t} for a,b,t in zip(bonds.get('aid1',[]),bonds.get('aid2',[]),bonds.get('order',[]))]
 return {'atoms':items,'bonds':links,'geometry':'3d' if zs else ('2d' if xs else 'none')}

def load(name):
 f=PUBCHEM/(slug(name)+'.json')
 if not f.is_file():return None
 return json.loads(f.read_text(encoding='utf-8'))

def fetch_pubchem(name,force=False):
 name=safe_name(name); cache_path=PUBCHEM/(slug(name)+'.json')
 with LOCK:
  if cache_path.exists() and not force:return json.loads(cache_path.read_text(encoding='utf-8'))
 path=quote(name,safe='')
 base=f'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{path}'
 props=_get_json(base+'/property/MolecularFormula,MolecularWeight,CanonicalSMILES,IUPACName/JSON')
 prop=(props.get('PropertyTable',{}).get('Properties') or [None])[0]
 if not prop:raise ValueError('No PubChem compound matched')
 cid=prop['CID']
 # Use CID for the structure to avoid matching a different synonym or compound.
 s3=None
 try:s3=_atom_bonds(_get_json(f'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/record/JSON?record_type=3d'))
 except (HTTPError,URLError,ValueError,KeyError,TimeoutError):pass
 if not s3:
  try:s3=_atom_bonds(_get_json(f'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/record/JSON?record_type=2d'))
  except (HTTPError,URLError,ValueError,KeyError,TimeoutError):pass
 record={'name':name,'cid':cid,'formula':prop.get('MolecularFormula'),'molecular_weight':prop.get('MolecularWeight'),
 'smiles':prop.get('ConnectivitySMILES') or prop.get('CanonicalSMILES') or prop.get('SMILES'),
 'iupac':prop.get('IUPACName'),'structure':s3,
 'source':'PubChem PUG REST','source_url':f'https://pubchem.ncbi.nlm.nih.gov/compound/{cid}',
 'retrieved_at':datetime.now(timezone.utc).isoformat(),
 'data_status':'reference structural data; no thermodynamic or kinetic stability conclusion',
 'data_rights':'PubChem NCBI public data; record-specific third-party rights may apply; verify before redistribution'}
 with LOCK:
  with tempfile.NamedTemporaryFile(mode='w',encoding='utf-8',dir=PUBCHEM,delete=False) as tmp:
   json.dump(record,tmp,ensure_ascii=False,indent=2);tmpname=tmp.name
  os.replace(tmpname,cache_path)
 return record

def list_cache():
 result=[]
 for path in sorted(PUBCHEM.glob('*.json')):
  try:
   item=json.loads(path.read_text(encoding='utf-8'))
   result.append({'name':item['name'],'cid':item['cid'],'formula':item.get('formula'),'has_structure':bool(item.get('structure')),'geometry':(item.get('structure') or {}).get('geometry')})
  except (ValueError,KeyError):continue
 return result

def model_status():
 return [{'id':key,'license':spec['license'],'use':spec['use'],'downloaded':(MODELS/(key+'.model')).is_file(),
 'bytes':(MODELS/(key+'.model')).stat().st_size if (MODELS/(key+'.model')).is_file() else 0} for key,spec in MODELS_ALLOWLIST.items()]

def download_model(model_id):
 if model_id not in MODELS_ALLOWLIST:raise ValueError('Model is not in MIT allowlist')
 spec=MODELS_ALLOWLIST[model_id]; target=MODELS/(model_id+'.model')
 if target.is_file():return {'downloaded':True,'bytes':target.stat().st_size,'cached':True}
 req=Request(spec['url'],headers={'User-Agent':'ChemistryLab/1.5'})
 filename=None; total=0
 try:
  with urlopen(req,timeout=40) as resp:
   if int(resp.headers.get('Content-Length','0'))>spec['max_bytes']:raise ValueError('Model exceeds size limit')
   with tempfile.NamedTemporaryFile(dir=MODELS,delete=False) as tmp:
    filename=tmp.name
    while True:
     data=resp.read(1024*1024)
     if not data:break
     total+=len(data)
     if total>spec['max_bytes']:raise ValueError('Model exceeds size limit')
     tmp.write(data)
  if total<1_000_000: raise ValueError('Incomplete checkpoint or unsuitable download response')
  os.replace(filename,target)
 except Exception:
  if filename:Path(filename).unlink(missing_ok=True)
  raise
 return {'downloaded':True,'bytes':total,'cached':False,'license':'MIT','inference_ready':False}
