
// Beta 1.3: standalone software-rendered interactive 3D, no network dependency.
(function(){
const editor=document.getElementById('molCanvas');
if(!editor)return;
const panel=document.createElement('section');panel.id='view3DPanel';
panel.innerHTML='<div class="view3d-toolbar"><h3 id="model3DTitle">3D molekulanézet</h3><button id="model3DBall" class="active" type="button">Golyó–pálcika</button><button id="model3DSpace" type="button">Térkitöltő</button><button id="model3DReset" type="button">↺</button></div><canvas id="mol3D" aria-label="Forgatható 3D molekulamodell"></canvas><div id="model3DMeta"></div><p id="model3DNote"></p>';
editor.parentNode.appendChild(panel);
const cvs=document.getElementById('mol3D'),ctx=cvs.getContext('2d');
let yaw=-0.55,pitch=0.28,zoom=1.0,drag=false,px=0,py=0,display='ball',lastGraph='',coordinates=[];
const colors={H:'#eaf6ff',C:'#647d97',O:'#ff6469',N:'#5b93ff',S:'#ebcb55',P:'#f5a45c',Cl:'#89d975',F:'#b0e86f',Br:'#b8785a',I:'#9a79d8',Na:'#baa0ea',Fe:'#c9a176'};
const radius={H:12,C:19,N:18,O:18,F:17,Cl:22,S:23,P:22,Na:24,Fe:24};
const vec=(x,y,z)=>({x,y,z});
const length=v=>Math.hypot(v.x,v.y,v.z)||1;
const sub=(a,b)=>vec(a.x-b.x,a.y-b.y,a.z-b.z);
const norm=v=>{let l=length(v);return vec(v.x/l,v.y/l,v.z/l)};
function buildCoordinates(){
 const nodes=molAtoms,edges=molBonds;const n=nodes.length;
 if(!n)return [];
 const reference=window.ChemistryEngine?.referenceGeometry(nodes,edges);
 if(reference)return reference;
 const adjacency=Array.from({length:n},()=>[]);let ids=new Map(nodes.map((a,i)=>[a.id,i]));
 edges.forEach(b=>{let u=ids.get(b.a),v=ids.get(b.b);if(u===undefined||v===undefined||u===v)return;adjacency[u].push(v);adjacency[v].push(u)});
 let result=nodes.map((a,i)=>vec((a.x||0)/90,(a.y||0)/90,Math.sin(i*2.39996)*0.45));
 // Exact educational reference geometries for small molecular families.
 const elements=nodes.map(a=>a.s),central=nodes.findIndex((a,i)=>adjacency[i].length===n-1);
 const has=(s,num)=>elements.filter(x=>x===s).length===num;
 if(central>=0&&n===3&&has('O',1)&&has('H',2)){
   const h=adjacency[central];result[central]=vec(0,0,0);result[h[0]]=vec(-0.79,-0.61,0);result[h[1]]=vec(0.79,-0.61,0);return result;
 }
 if(central>=0&&n===5&&has('C',1)&&has('H',4)){
   const v=[[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]];result[central]=vec(0,0,0);adjacency[central].forEach((j,k)=>result[j]=vec(...v[k].map(x=>x*.64)));return result;
 }
 if(central>=0&&n===4&&has('N',1)&&has('H',3)){
   result[central]=vec(0,0,.35);adjacency[central].forEach((j,k)=>{let t=k*2*Math.PI/3;result[j]=vec(Math.cos(t)*.94,Math.sin(t)*.94,-.25)});return result;
 }
 if(central>=0&&n===3&&has('C',1)&&has('O',2)){
   result[central]=vec(0,0,0);adjacency[central].forEach((j,k)=>result[j]=vec(k?1.16:-1.16,0,0));return result;
 }
 // General-purpose topology-dependent approximate 3D layout (not energy minimization).
 // Start from 2D structural template and relax bonded distances / excluded-volume repulsion.
 const cx=result.reduce((a,v)=>a+v.x,0)/n,cy=result.reduce((a,v)=>a+v.y,0)/n;
 result.forEach((r,i)=>{r.x-=cx;r.y-=cy;r.z=Math.sin(i*2.39996)*(.22+Math.min(.35,adjacency[i].length*.08))});
 for(let step=0;step<100;step++){
   let delta=result.map(()=>vec(0,0,0));
   for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
     let d=sub(result[i],result[j]),dist=length(d),linked=adjacency[i].includes(j),target=linked?1.15:1.5;
     if(!linked&&dist>target)continue;
     let force=(target-dist)*(linked?.13:.045);let dir=norm(d);
     delta[i].x+=dir.x*force;delta[i].y+=dir.y*force;delta[i].z+=dir.z*force;
     delta[j].x-=dir.x*force;delta[j].y-=dir.y*force;delta[j].z-=dir.z*force;
   }
   result.forEach((r,i)=>{r.x+=delta[i].x;r.y+=delta[i].y;r.z+=delta[i].z});
 }
 return result;
}
function project(v,w,h,scale){
 let x=v.x*Math.cos(yaw)+v.z*Math.sin(yaw),z=-v.x*Math.sin(yaw)+v.z*Math.cos(yaw);
 let y=v.y*Math.cos(pitch)-z*Math.sin(pitch),depth=v.y*Math.sin(pitch)+z*Math.cos(pitch);
 let perspective=3.8/(3.8+depth*.12);
 return {x:w/2+x*scale*perspective,y:h/2+y*scale*perspective,z:depth,p:perspective};
}
function sphere(x,y,r,color){
 const g=ctx.createRadialGradient(x-r*.32,y-r*.37,r*.05,x,y,r);
 g.addColorStop(0,'#fff');g.addColorStop(.14,color);g.addColorStop(.65,color);g.addColorStop(1,'#111c2d');
 ctx.beginPath();ctx.arc(x,y,Math.max(2,r),0,Math.PI*2);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#ffffff55';ctx.lineWidth=1;ctx.stroke();
}
function render3D(){
 if(document.hidden||cvs.getClientRects().length===0){setTimeout(()=>requestAnimationFrame(render3D),250);return}
 const rect=cvs.getBoundingClientRect();if(rect.width<50){setTimeout(()=>requestAnimationFrame(render3D),250);return}
 const dpr=Math.min(window.devicePixelRatio||1,2),w=rect.width,h=rect.height;
 if(cvs.width!==Math.round(w*dpr)||cvs.height!==Math.round(h*dpr)){cvs.width=Math.round(w*dpr);cvs.height=Math.round(h*dpr)}
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const key=JSON.stringify([molAtoms.map(a=>[a.id,a.s,a.x,a.y]),molBonds.map(b=>[b.a,b.b,b.order,b.kind])]);
 if(key!==lastGraph){coordinates=buildCoordinates();lastGraph=key;updateLabels()}
 const maxR=Math.max(1,...coordinates.map(p=>Math.hypot(p.x,p.y,p.z)));
 const scale=Math.min(w,h)*.36*zoom/(maxR+.5);
 let pts=coordinates.map(p=>project(p,w,h,scale));
 let index=new Map(molAtoms.map((a,i)=>[a.id,i]));
 let objects=[];
 for(const b of molBonds){let i=index.get(b.a),j=index.get(b.b);if(i===undefined||j===undefined)continue;objects.push({type:'bond',z:(pts[i].z+pts[j].z)/2,i,j,b})}
 molAtoms.forEach((a,i)=>objects.push({type:'atom',z:pts[i].z,i,a}));
 objects.sort((a,b)=>b.z-a.z);
 for(const o of objects){
   if(o.type==='bond'){
     if(display==='space')continue;
     const a=pts[o.i],b=pts[o.j],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;
     const nx=-dy/len,ny=dx/len,order=o.b.kind?1:Math.min(3,o.b.order||1);
     ctx.save();ctx.strokeStyle=o.b.kind?(o.b.kind==='metallic'?'#ffca74':'#d5a2ff'):'#b5ddec';ctx.lineWidth=Math.max(2,5*Math.min(a.p,b.p));ctx.lineCap='round';ctx.setLineDash(o.b.kind?[5,6]:[]);
     for(let k=0;k<order;k++){let offset=(k-(order-1)/2)*5;ctx.beginPath();ctx.moveTo(a.x+nx*offset,a.y+ny*offset);ctx.lineTo(b.x+nx*offset,b.y+ny*offset);ctx.stroke()}ctx.restore();
   } else {
     let p=pts[o.i],sym=o.a.s,r=(radius[sym]||19)*(display==='space'?2.0:1)*p.p;
     sphere(p.x,p.y,Math.min(44,r),colors[sym]||'#b9b6b4');
     if(display==='ball'){ctx.font='bold 12px system-ui';ctx.fillStyle=sym==='H'?'#1b3449':'#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(sym,p.x,p.y)}
   }
 }
 if(molAtoms.length===0){ctx.fillStyle='#9bb9ca';ctx.textAlign='center';ctx.font='14px system-ui';ctx.fillText(document.documentElement.lang==='de'?'Baue oder lade ein Molekül':'Építs vagy tölts be egy molekulát',w/2,h/2)}
 setTimeout(()=>requestAnimationFrame(render3D),95);
}
function updateLabels(){
 let de=document.documentElement.lang==='de',material=typeof currentMaterialModel!=='undefined'&&currentMaterialModel;
 document.getElementById('model3DTitle').textContent=de?'Interaktive 3D-Struktur':'Interaktív 3D szerkezet';
 document.getElementById('model3DBall').textContent=de?'Kugel-Stab':'Golyó–pálcika';
 document.getElementById('model3DSpace').textContent=de?'Kalotten':'Térkitöltő';
 document.getElementById('model3DMeta').textContent=(de?'Atome: ':'Atomok: ')+molAtoms.length+' · '+(de?'Verbindungen: ':'Kapcsolatok: ')+molBonds.length;
 let type=material?.kind;
 const exact=molAtoms.length&&((molAtoms.length===3&&molAtoms.some(a=>a.s==='O')&&molAtoms.filter(a=>a.s==='H').length===2)||(molAtoms.length===5&&molAtoms.some(a=>a.s==='C')&&molAtoms.filter(a=>a.s==='H').length===4)||(molAtoms.length===4&&molAtoms.some(a=>a.s==='N')&&molAtoms.filter(a=>a.s==='H').length===3)||(molAtoms.length===3&&molAtoms.some(a=>a.s==='C')&&molAtoms.filter(a=>a.s==='O').length===2));
 let description=type&&type!=='molecule'?(de?'Schematischer Ausschnitt eines Gitters oder Polymers; keine einzelne Molekülgeometrie.':'Rács vagy polimer szemléltető részlete; nem önálló molekula térszerkezete.'):(exact?(de?'Geometrie nach bekannten Molekülformen (schematische Bindungslängen).':'Ismert molekulageometria alapján (szemléltető kötéshosszak).'):(de?'Geschätzte 3D-Anordnung, keine quantenchemische Optimierung.':'Becsült 3D elrendezés, nem kvantumkémiai geometriaoptimalizálás.'));
 document.getElementById('model3DNote').textContent=(de?'Ziehen: drehen · Mausrad/Zweifingergeste: zoomen. ':'Húzás: forgatás · Görgő/kétujjas mozdulat: nagyítás. ')+description;
}
function button(id,fn){document.getElementById(id).addEventListener('click',fn)}
button('model3DBall',()=>{display='ball';document.getElementById('model3DBall').classList.add('active');document.getElementById('model3DSpace').classList.remove('active')});
button('model3DSpace',()=>{display='space';document.getElementById('model3DSpace').classList.add('active');document.getElementById('model3DBall').classList.remove('active')});
button('model3DReset',()=>{yaw=-.55;pitch=.28;zoom=1});
cvs.addEventListener('pointerdown',e=>{drag=true;px=e.clientX;py=e.clientY;cvs.setPointerCapture(e.pointerId)});
cvs.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-px)*.009;pitch=Math.max(-1.5,Math.min(1.5,pitch+(e.clientY-py)*.009));px=e.clientX;py=e.clientY});
cvs.addEventListener('pointerup',()=>drag=false);cvs.addEventListener('pointercancel',()=>drag=false);
cvs.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.4,Math.min(3.5,zoom*Math.exp(-e.deltaY*.001)))},{passive:false});
let touches=null;cvs.addEventListener('touchmove',e=>{if(e.touches.length!==2)return;let d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(touches)zoom=Math.max(.4,Math.min(3.5,zoom*d/touches));touches=d},{passive:true});cvs.addEventListener('touchend',()=>{touches=null});
updateLabels();requestAnimationFrame(render3D);
})();
