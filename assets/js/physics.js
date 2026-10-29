/* Additive physics module. No invasive changes to existing Chemistry Lab state. */
(()=>{'use strict';const $=id=>document.getElementById(id);let selected=null,az=0.2,el=0.3,scale=1;let active=false;
const esc=s=>String(s??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const physicsTab=$('physicsTab'),section=$('physicsSection');if(!physicsTab||!section)return;
const legacyTabs=['periodTab','moleculeTab','huntTab','materialsTab','reactionTab'];
function activate(){document.querySelectorAll('main > section').forEach(x=>x.classList.add('hidden'));document.querySelectorAll('.tabs > button').forEach(x=>x.classList.remove('active'));section.classList.remove('hidden');physicsTab.classList.add('active');active=true;draw();}
physicsTab.addEventListener('click',activate);
legacyTabs.forEach(id=>$(id)?.addEventListener('click',()=>{active=false;section.classList.add('hidden');physicsTab.classList.remove('active')},true));
function status(s){$('physicsSyncStatus').textContent=s;}
async function api(path,method,body){const result=await fetch(path,{method:method||'GET',headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});const obj=await result.json();if(!result.ok)throw Error(obj.error||'HTTP '+result.status);return obj;}
async function refresh(){try{const d=await api('/api/physics/status');$('physicsList').replaceChildren();d.cache.forEach(c=>{const b=document.createElement('button');b.textContent=c.formula?`${c.name} · ${c.formula}`:c.name;b.onclick=()=>openRecord(c.name);$('physicsList').append(b)});$('physicsModels').textContent=d.models.map(m=>`${m.id} · ${m.license} · ${m.downloaded?'cache: '+(m.bytes/1e6).toFixed(1)+' MB':'nincs letöltve'}`).join(' | ');status(d.sync.running?`Letöltés: ${d.sync.done}/${d.sync.total}`:`Cache: ${d.cache.length} anyag. ${d.sync.errors.length?'Hibák: '+d.sync.errors.map(x=>x.name).join(', '):''}`);return d;}catch(e){status('API nem elérhető. Indítsd: python3 server.py · '+e.message);return null;}}
async function openRecord(name){try{const d=await api('/api/physics/molecule?name='+encodeURIComponent(name));if(!d.found){status('Nincs cache-ben: '+name+'. Előbb töltsd le.');return;}selected=d.record;az=0.2;el=0.3;scale=1;$('physicsRecordTitle').textContent=selected.iupac||selected.name;$('physicsRecord').textContent=`Képlet: ${selected.formula||'—'}
Moláris tömeg: ${selected.molecular_weight??'—'} g/mol
PubChem CID: ${selected.cid}
SMILES: ${selected.smiles||'—'}
Szerkezet: ${selected.structure?.geometry||'nem áll rendelkezésre'}
Forrás: ${selected.source_url}

Értelmezés: referencia-geometria; stabilitás, kötésenergia és reakciókinetika NINCS kiszámolva.`;draw()}catch(e){status(e.message)}}
$('physicsLookup').onclick=()=>openRecord($('physicsName').value);
$('physicsSync').onclick=async()=>{try{await api('/api/physics/sync','POST',{});status('Letöltés indult. PubChem internetkapcsolat szükséges.');let count=0;const tick=async()=>{const d=await refresh();if(d?.sync?.running&&++count<240)setTimeout(tick,1500);else if(d?.cache?.length&&!selected)openRecord(d.cache[0].name)};setTimeout(tick,400)}catch(e){status(e.message)}};
$('physicsDownloadModel').onclick=async()=>{if(!confirm('MIT MACE modell letöltése (~68 MB)? A számítási motor még nincs aktiválva.'))return;status('MACE modell letöltése…');try{await api('/api/physics/models','POST',{id:'mace-mp-0b2-small'});await refresh();status('MACE modell a helyi cache-ben. Inference egyelőre nincs.')}catch(e){status('Letöltési hiba: '+e.message)}};
$('physicsResetCamera').onclick=()=>{az=.2;el=.3;scale=1;draw()};
const canvas=$('physicsCanvas'),ctx=canvas.getContext('2d');let dragging=false,lastX=0,lastY=0;
canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointermove',e=>{if(!dragging)return;az+=(e.clientX-lastX)*.009;el+=(e.clientY-lastY)*.009;el=Math.max(-1.5,Math.min(1.5,el));lastX=e.clientX;lastY=e.clientY;draw()});canvas.addEventListener('wheel',e=>{e.preventDefault();scale=Math.max(.3,Math.min(3,scale*(e.deltaY>0?.9:1.1)));draw()},{passive:false});
const colors={1:'#f4f6fa',6:'#677486',7:'#5a93e6',8:'#f04459',9:'#7add80',15:'#ffa347',16:'#ffe263',17:'#66da9c'};
function draw(){if(!active)return;let w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#091527';ctx.fillRect(0,0,w,h);let S=selected?.structure;if(!S||!S.atoms?.length){ctx.fillStyle='#9bb6d1';ctx.font='16px sans-serif';ctx.fillText('Válassz egy cache-elt, szerkezettel rendelkező anyagot',35,h/2);return}let atoms=S.atoms.filter(a=>typeof a.x==='number'),mx=atoms.reduce((n,a)=>n+a.x,0)/atoms.length,my=atoms.reduce((n,a)=>n+a.y,0)/atoms.length,mz=atoms.reduce((n,a)=>n+(a.z||0),0)/atoms.length;
let rotate=a=>{let x=a.x-mx,y=a.y-my,z=(a.z||0)-mz;let xx=x*Math.cos(az)-z*Math.sin(az),zz=x*Math.sin(az)+z*Math.cos(az);return{x:xx,y:y*Math.cos(el)-zz*Math.sin(el),z:y*Math.sin(el)+zz*Math.cos(el)}};
let points=atoms.map(a=>({...a,...rotate(a)})),maxR=Math.max(1,...points.map(a=>Math.hypot(a.x,a.y)));let f=Math.min(85,(Math.min(w,h)*.36/maxR))*scale, idx=new Map(points.map(a=>[a.id,a]));const proj=a=>({x:w/2+a.x*f,y:h/2-a.y*f});ctx.lineCap='round';for(const bond of S.bonds||[]){let a=idx.get(bond.a),b=idx.get(bond.b);if(!a||!b)continue;let p=proj(a),q=proj(b);ctx.strokeStyle='#a8bacc';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}points.sort((a,b)=>a.z-b.z).forEach(a=>{let p=proj(a),radius=Math.max(6,11+(a.z/maxR)*1.8);ctx.beginPath();ctx.fillStyle=colors[a.atomic_number]||'#caa3d9';ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffffff77';ctx.lineWidth=1.3;ctx.stroke()});ctx.fillStyle='#89a9bf';ctx.font='12px sans-serif';ctx.fillText(S.geometry==='3d'?'PubChem 3D referencia-geometria':'Szemléltető 2D koordináták térben forgatva',12,h-12)}
refresh();})();
