"""NIST ASD neutral atom line cache. On-demand and bulk support; no invented spectral data."""
from pathlib import Path
import json, re, csv, io, time, urllib.request, urllib.parse
ROOT=Path(__file__).resolve().parent.parent
CACHE=ROOT/'cache'/'nist';CACHE.mkdir(parents=True,exist_ok=True)
ELEMENTS=json.loads((ROOT/'assets/data/elements.json').read_text())
BASE='https://physics.nist.gov/cgi-bin/ASD/lines1.pl'
def filename(z):
 z=int(z)
 if not 1<=z<=118:raise ValueError('Z must be 1–118')
 return CACHE/f'{z:03d}.json'
def read(z):
 p=filename(z)
 if not p.exists():return {'z':int(z),'status':'not_cached','lines':[]}
 return json.loads(p.read_text())
def summary():
 ok=0;empty=0;failed=0
 for z in range(1,119):
  a=read(z)
  if a['status']=='ok':ok+=1
  elif a['status']=='no_lines':empty+=1
  elif a['status']=='error':failed+=1
 return {'total_elements':118,'cached_with_lines':ok,'cached_no_visible_lines':empty,'failed':failed,'pending':118-ok-empty-failed}
def parse_asd(raw):
 """Parse text/CSV or HTML-rendered ASCII NIST output; reject ambiguous numbers."""
 from html import unescape
 raw=unescape(raw)
 lines=[]
 for row in raw.splitlines():
  row=re.sub(r'<[^>]+>',' ',row)
  if not ('|' in row or ',' in row or '\t' in row):continue
  cells=[v.strip(' "=') for v in re.split(r'[|\t,]',row)]
  # First wavelength-looking column, not intensity or term metadata.
  # NIST tabular output commonly begins with observed wavelength then Ritz wavelength.
  matches=[]
  for cell in cells[:3]:
   m=re.fullmatch(r'[<>]?\s*(\d{3}\.\d{1,5})\s*[?*+:]?',cell)
   if m:
    val=float(m.group(1))
    if 380<=val<=750:matches.append(val)
  if matches:lines.append(round(matches[0],4))
 return sorted(set(lines))[:5000]
def sync(z):
 z=int(z); element=ELEMENTS[z-1]; spectrum=element['s']+' I'
 params={'spectra':spectrum,'limits_type':'0','low_w':'380','upp_w':'750','unit':'1','submit':'Retrieve Data','de':'0','I_scale_type':'1','format':'3','line_out':'0','remove_js':'on','show_obs_wl':'1','show_ritz_wl':'0','show_av':'0','show_intens':'1','output':'0','page_size':'5000'}
 url=BASE+'?'+urllib.parse.urlencode(params)
 # NIST result format occasionally changes: parsing failure is explicitly an error, not an empty spectrum.
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'ChemistryLab/1.8 (+local research application)','Accept':'text/plain,text/html'})
  with urllib.request.urlopen(req,timeout=25) as response:
   raw=response.read(2_000_000).decode('utf-8','replace')
  if any(word in raw.lower() for word in ['invalid spectrum','invalid input','error 403','too many requests']):raise ValueError('NIST response error')
  lines=parse_asd(raw)
  if not lines:
   # Cannot distinguish no spectral lines vs parser change in every response. Preserve unverified status.
   status='unverified_empty'
  else:status='ok'
  result={'z':z,'symbol':element['s'],'status':status,'lines':lines,'source':'NIST ASD neutral atom ('+spectrum+')','url':url,'fetched_utc':int(time.time()),'unit':'nm','window_nm':[380,750], 'intensity_status':'not_calibrated'}
 except Exception as exc:
  result={'z':z,'symbol':element['s'],'status':'error','lines':[],'error':str(exc)[:180],'source':'NIST ASD','url':url,'fetched_utc':int(time.time())}
 filename(z).write_text(json.dumps(result,ensure_ascii=False,indent=2))
 return result

if __name__=='__main__':
 import argparse
 parser=argparse.ArgumentParser(description='Cache NIST ASD visible neutral-atom lines for 1–118. Requires internet.');parser.add_argument('--all',action='store_true');parser.add_argument('--z',type=int);parser.add_argument('--delay',type=float,default=1.5);args=parser.parse_args()
 if not args.all and args.z is None:parser.error('Choose --all or --z N')
 for i,z in enumerate(range(1,119) if args.all else [args.z]):
  if i:time.sleep(max(1.0,args.delay))
  record=sync(z);print(z,record['status'],len(record['lines']),flush=True)
 print(summary())
