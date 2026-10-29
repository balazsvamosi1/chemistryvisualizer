
(function(){
const $id=id=>document.getElementById(id);
const local=(hu,de)=>lang==='hu'?hu:de;
const detail=$id('atomDetail');
$id('closeAtom').addEventListener('click',()=>{detail.classList.add('hidden');$id('periodSection').scrollIntoView({behavior:'smooth',block:'start'})});
// The original click handler selects the element, then bubble opens the details.
$id('ptable').addEventListener('click',ev=>{
 if(ev.target.closest('button.tile')){detail.classList.remove('hidden');requestAnimationFrame(()=>detail.scrollIntoView({behavior:'smooth',block:'nearest'}));}
});
// Keep existing reaction engine mounted inside the molecule editor, never on top of the table.
const oldRender=render;render=function(){oldRender();$id('reactionSection').classList.remove('hidden');$id('moleculeSection').classList.toggle('hidden',tab!=='molecule');$id('atomDetail').classList.toggle('hidden',tab!=='period'||detail.dataset.open!=='true');renderInspector()};
$id('ptable').addEventListener('click',ev=>{if(ev.target.closest('button.tile'))detail.dataset.open='true'});
$id('closeAtom').addEventListener('click',()=>detail.dataset.open='false');
// The additional tutorial is driven by the actual molecule graph (not a made-up bond energy).
const electronegativity={H:2.20,Li:.98,Be:1.57,B:2.04,C:2.55,N:3.04,O:3.44,F:3.98,Na:.93,Mg:1.31,Al:1.61,Si:1.90,P:2.19,S:2.58,Cl:3.16,K:.82,Ca:1.00,Br:2.96,I:2.66};
const outer={H:1,He:2,Li:1,Be:2,B:3,C:4,N:5,O:6,F:7,Ne:8,Na:1,Mg:2,Al:3,Si:4,P:5,S:6,Cl:7,Ar:8,K:1,Ca:2,Br:7,I:7};
function htm(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderInspector(){
 const box=$id('moleculeInspector');if(!box)return;
 const atomCount=molAtoms.length,bondCount=molBonds.length;
 let heading=local('Miért jön létre a kötés?','Warum entsteht die Bindung?');
 let items=molAtoms.slice(0,12).map((a,i)=>{
 const val=outer[a.s],used=molBonds.filter(b=>b.a===a.id||b.b===a.id).reduce((n,b)=>n+b.order,0);
 const known=val!==undefined,nonbond=known?Math.max(0,val-used):null;
 const needed=a.s==='H'?2:8;
 const target=known?(val-used+2*used):null;
 const label=known?`${local('Vegyértékelektron','Valenzelektronen')}: ${val}; ${local('kötő elektronpár','bindendes Elektronenpaar')}: ${used}; ${local('becsült nemkötő elektron','geschätzte nichtbindende Elektronen')}: ${nonbond}.`:local('Összetett vegyértékű elem: a modell nem dönt.','Komplexe Valenz: das Modell entscheidet nicht.');
 const check=known?(target===needed?'✓ '+local('Duett/oktett teljesül','Duett/Oktett erfüllt'):target<needed?local('Nem teljes a külső héj ebben a szerkezetben','Außenschale in dieser Struktur nicht voll'):local('Egyszerű oktettszabály itt nem elegendő','Einfache Oktettregel reicht hier nicht')):'';
 return `<p><b>${htm(a.s)} #${i+1}</b> — ${label} <br><small>${check}</small></p>`}).join('');
 let bondList=molBonds.slice(0,12).map(b=>{let a=molAtoms.find(x=>x.id===b.a),c=molAtoms.find(x=>x.id===b.b);if(!a||!c)return '';let en=electronegativity[a.s],en2=electronegativity[c.s],delta=en!==undefined&&en2!==undefined?Math.abs(en-en2):null;return `<p><b>${a.s}—${c.s}</b> · ${b.order} ${local('közös elektronpár','gemeinsame Elektronenpaare')}${delta===null?'':` · Δχ = ${delta.toFixed(2)} (${delta<.4?local('apoláris jelleg','unpolar'):delta<1.7?local('poláris jelleg','polar'):local('erősen poláris jelleg','stark polar')})`}</p>`}).join('');
 box.innerHTML=`<div class="inspector-card"><h3>01 · ${heading}</h3><div class="science-visual"><span>e⁻</span> ⇄ <span>e⁻</span></div><p>${local('A kovalens kötés közös elektronpárhoz és kedvezőbb energiájú elektronállapothoz kapcsolódik. A kötés létrejötte nem pusztán egy szabad elektron meglététől függ.','Eine kovalente Bindung beruht auf gemeinsamen Elektronenpaaren und energetisch günstigeren Zuständen. Nicht nur freie Elektronen entscheiden.')}</p></div><div class="inspector-card"><h3>02 · ${local('Elektronmérleg','Elektronenbilanz')}</h3>${items||`<p>${local('Válassz egy példát vagy helyezz el atomokat.','Wähle ein Beispiel oder platziere Atome.')}</p>`}</div><div class="inspector-card"><h3>03 · ${local('Kötéselemzés','Bindungsanalyse')}</h3>${bondList||`<p>${local('Kapcsolj össze két atomot a kötések vizsgálatához.','Verbinde zwei Atome, um Bindungen zu untersuchen.')}</p>`}<p>${local('A Δχ csak iránymutatás; a kötés jellege nem dönthető el egyetlen határértékből.','Δχ ist nur ein Richtwert; Bindungstypen haben keine starre Grenze.')}</p></div><div class="inspector-card"><h3>04 · ${local('Energetikai értelmezés','Energetische Deutung')}</h3><p>${local('A kötések kialakításakor energia szabadulhat fel, a felbontásukhoz energiát kell befektetni. Reakciónál a teljes energiamérleg mindkét folyamatból áll.','Bei der Bindungsbildung kann Energie freiwerden, beim Trennen muss Energie zugeführt werden. Die Reaktionsenergie ergibt sich aus beiden Anteilen.')}</p><p>${local('Nem számolunk ab initio pályaenergiákat vagy pontos reakcióentalpiát.','Keine ab-initio-Orbitalenergien oder exakten Reaktionsenthalpien berechnet.')}</p></div>`;
}
const originalUpdate=updateMolStatus;updateMolStatus=function(){originalUpdate();renderInspector()};
const playButton=document.createElement('button');playButton.id='loadReactant';
$id('reactionBridge').append(playButton);
function relabel(){playButton.textContent=local('Reagens betöltése a szerkesztőbe ↗','Edukt in den Editor laden ↗')}
relabel();
$id('hu').addEventListener('click',relabel);$id('de').addEventListener('click',relabel);
playButton.onclick=()=>{
 const r=reactionData[reactionIndex],m=balanceData[r.id];
 const formulaToPreset={'H₂':'H2','O₂':'O2','CH₄':'CH4','HCl':'HCl','H₂O':'H2O'};
 let choice=m.parts.find((x,i)=>m.side[i]<0&&presetData[formulaToPreset[x]]);
 if(!choice){bondMessage=local('Ehhez a reagenshez nincs kész 2D sablon; a reakcióegyenlet ettől még megvizsgálható.','Für dieses Edukt gibt es noch keine 2D-Vorlage. Die Reaktionsgleichung bleibt verfügbar.');updateMolStatus();return}
 $id('presets').value=formulaToPreset[choice];$id('presets').dispatchEvent(new Event('change'));
 $id('molCanvas').scrollIntoView({behavior:'smooth',block:'center'});
};
// Change tab handlers to keep the viewer closed unless clicked again.
for(const name of ['periodTab','moleculeTab','huntTab','materialsTab']){
 $id(name).addEventListener('click',()=>{if(name!=='periodTab'){detail.dataset.open='false';detail.classList.add('hidden')}else{detail.classList.add('hidden')}});
}
renderInspector();
})();

// Beta 1.0: element-aware orbital occupancy and a conservative educational validator.
const v09OrbitalOrder=[[1,'s',2],[2,'s',2],[2,'p',6],[3,'s',2],[3,'p',6],[4,'s',2],[3,'d',10],[4,'p',6],[5,'s',2],[4,'d',10],[5,'p',6],[6,'s',2],[4,'f',14],[5,'d',10],[6,'p',6],[7,'s',2],[5,'f',14],[6,'d',10],[7,'p',6]];
function orbitalConfiguration(z){let remaining=z,list=[];for(const [n,l,max] of v09OrbitalOrder){if(remaining<=0)break;let electrons=Math.min(max,remaining);list.push({n,l,electrons});remaining-=electrons}
 // Ground-state exceptions shown explicitly where included.
 const exceptions={24:{'4s':1,'3d':5},29:{'4s':1,'3d':10},42:{'5s':1,'4d':5},47:{'5s':1,'4d':10},79:{'6s':1,'5d':10}};
 if(exceptions[z])for(const item of list){let key=item.n+item.l;if(exceptions[z][key]!=null)item.electrons=exceptions[z][key]}
 return list.filter(x=>x.electrons>0)}
function quantumOrbitalsFor(z){let occ=orbitalConfiguration(z),nodes=[];for(const o of occ){let cap={s:1,p:3,d:5,f:7}[o.l],remaining=o.electrons;for(let m=0;m<cap;m++){let count=Math.min(2,Math.max(0,remaining)); // redistribute below according to Hund's rule
 count=(o.electrons>cap?1+(m<o.electrons-cap?1:0):(m<o.electrons?1:0));if(count)nodes.push({...o,m,count})}}return nodes}
const q09Cache=new Map();
function seededRandom(seed){let x=seed>>>0;return()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296}}
function q09Points(z){if(q09Cache.has(z))return q09Cache.get(z);const orbitals=quantumOrbitalsFor(z),rng=seededRandom(z*92821+723),out=[];
 const active=orbitals.slice(-Math.min(orbitals.length,9));let per=Math.floor(1800/Math.max(1,active.length));
 for(let oi=0;oi<active.length;oi++){let o=active[oi];for(let i=0;i<per;i++){
  let theta=rng()*Math.PI*2,phi=Math.acos(2*rng()-1),rad=Math.pow(rng(),.45),x,y,zz,sgn=1;
  let shell=.20+o.n*.113;
  if(o.l==='s'){x=Math.sin(phi)*Math.cos(theta)*rad;y=Math.sin(phi)*Math.sin(theta)*rad;zz=Math.cos(phi)*rad}
  else if(o.l==='p'){let lobe=rng()<.5?-1:1,shape=.22+.78*Math.pow(rng(),.6);sgn=lobe;
   const along=lobe*(.10+shape*.85),spread=(1-shape)*.35;let a=(rng()-.5)*spread,b=(rng()-.5)*spread;
   if(o.m===0){x=along;y=a;zz=b}else if(o.m===1){x=a;y=along;zz=b}else{x=a;y=b;zz=along}}
  else{let a=Math.sin(phi)*Math.cos(theta),b=Math.sin(phi)*Math.sin(theta),c=Math.cos(phi);let density=o.l==='d'?Math.abs(a*b)+Math.abs(b*c)+Math.abs(c*a):Math.abs(a*b*c)*3;if(rng()>Math.min(1,.17+density*1.6))continue;x=a*rad;y=b*rad;zz=c*rad;sgn=(a*b*c)>=0?1:-1}
  let opacity=.11+.18*(o.count/2);out.push({x:x*shell,y:y*shell,z:zz*shell,l:o.l,sgn,opacity});
 }}q09Cache.set(z,out);return out}
quantumFrame=function(){const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);if(cv.width!==Math.round(r.width*d)||cv.height!==Math.round(r.height*d)){cv.width=Math.round(r.width*d);cv.height=Math.round(r.height*d)}ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,r.width,r.height);
 const z=selected,cx=r.width/2,cy=r.height/2+11,R=Math.min(r.width,r.height)*.45*zoom;
 ctx.globalCompositeOperation='lighter';for(const q of q09Points(z)){let [x,y,depth]=project(q.x*R,q.y*R,q.z*R);let alpha=Math.min(.65,q.opacity*(.65+depth/R));let color=q.l==='s'?'91,234,211':q.l==='p'?(q.sgn>0?'68,172,255':'171,116,245'):q.l==='d'?'255,185,104':'244,119,181';ctx.fillStyle=`rgba(${color},${alpha})`;ctx.beginPath();ctx.arc(cx+x,cy+y,q.l==='s'?2.2:2.6,0,Math.PI*2);ctx.fill()}
 ctx.globalCompositeOperation='source-over';ctx.fillStyle='#ffc67b';ctx.beginPath();ctx.arc(cx,cy,Math.max(3,6*zoom),0,Math.PI*2);ctx.fill();
 ctx.textAlign='center';ctx.fillStyle='#b8cce0';ctx.font='11px system-ui';ctx.fillText(lang==='hu'?'Szemléltető s/p/d/f orbitálalakok, NEM pontos sűrűség':'Schematische s/p/d/f Orbitale, KEINE exakte Dichte',cx,r.height-15);if(playing)rotY+=.0011};
function renderOrbitalLegend(){const e=elements[selected-1],cfg=orbitalConfiguration(e.z),legend=$('orbitalLegend');legend.classList.toggle('hidden',atomVisualMode!=='quantum');if(atomVisualMode==='quantum'){legend.textContent=cfg.map(o=>o.n+o.l+superscript(o.electrons)).join(' ')+' · '+(lang==='hu'?'Elektronkonfiguráció (oktatási közelítés)':'Elektronenkonfiguration (Lehrmodell)')}}
function superscript(n){return String(n).replace(/[0-9]/g,x=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(x)])}
const originalSetAtomMode09=setAtomMode;setAtomMode=function(v){originalSetAtomMode09(v);renderOrbitalLegend()};
const originalRender09=render;render=function(){originalRender09();renderOrbitalLegend();renderValidator09()};

const v09Capacity={H:1,C:4,N:3,O:2,F:1,Cl:1,Br:1,I:1,Si:4};
const v09EN={H:2.20,C:2.55,N:3.04,O:3.44,F:3.98,Cl:3.16,Br:2.96,I:2.66,Si:1.90};
const v09Metal=new Set(['Li','Na','K','Mg','Ca','Al','Fe','Cu','Zn','Ag','Au','Ti','Ni','Co']);
function v09Types(a,b){if(v09Metal.has(a)&&v09Metal.has(b))return ['metal','fémes kölcsönhatás: rácsmodell szükséges','metallische Wechselwirkung: Gittermodell nötig'];if(v09Metal.has(a)||v09Metal.has(b))return ['ionic','lehetséges ionos jelleg; töltés- és rácsmodell szükséges','möglicher ionischer Charakter; Ladungs- und Gittermodell nötig'];const d=(v09EN[a]!=null&&v09EN[b]!=null)?Math.abs(v09EN[a]-v09EN[b]):null;return ['covalent',d==null?'kovalens jelleg (Δχ nem ismert)':(d<.4?'apoláris kovalens':'poláris kovalens')+' (Δχ='+d.toFixed(2)+')',d==null?'kovalenter Charakter (Δχ unbekannt)':(d<.4?'unpolar kovalent':'polar kovalent')+' (Δχ='+d.toFixed(2)+')']}
function validateGraph09(atoms,bonds){if(!atoms.length)return {level:'empty',issues:[],details:[],complete:false};const issues=[],details=[],degree=new Map(atoms.map(a=>[a.id,0]));
 for(const b of bonds){if(b.kind)continue;if(!degree.has(b.a)||!degree.has(b.b)||b.a===b.b||![1,2,3].includes(b.order))issues.push('invalid-edge');else {degree.set(b.a,degree.get(b.a)+b.order);degree.set(b.b,degree.get(b.b)+b.order)}}
 let unsupported=false,invalid=false,incomplete=false;
 for(const a of atoms){let used=degree.get(a.id),cap=v09Capacity[a.s];if(cap==null){unsupported=true;details.push({s:a.s,used,cap:null})}else{details.push({s:a.s,used,cap});if(used>cap){invalid=true;issues.push(a.s+': '+used+' > '+cap)}else if(used<cap)incomplete=true}}
 for(const b of bonds){const a=atoms.find(x=>x.id===b.a),c=atoms.find(x=>x.id===b.b);if(a&&c&&v09Types(a.s,c.s)[0]!=='covalent')unsupported=true}
 if(issues.length)invalid=true;return {level:invalid?'invalid':unsupported?'unknown':incomplete?'incomplete':'plausible',issues,details,complete:!invalid&&!unsupported&&!incomplete}}
// Exact simple graph matching; atom counts and bond orders must match, not just molecular formulas.
function sameGraph09(a1,b1,a2,b2){if(a1.length!==a2.length||b1.length!==b2.length)return false;if(a1.length>32)return false;const sig=(a,b)=>a.map(x=>[x.s,b.filter(y=>y.a===x.id||y.b===x.id).map(y=>y.order).sort().join('')].join(':')).sort().join('|');if(sig(a1,b1)!==sig(a2,b2))return false;
 const key=(x,y)=>x<y?x+','+y:y+','+x;const edgeMap=new Map(b2.map(b=>[key(b.a,b.b),b.order]));const srcMap=new Map(b1.map(b=>[key(b.a,b.b),b.order]));const used=new Set(),map=new Map();
 const sorted=a1.slice().sort((a,b)=>b1.filter(y=>y.a===b.id||y.b===b.id).length-b1.filter(y=>y.a===a.id||y.b===a.id).length);
 function search(i){if(i===sorted.length)return true;const a=sorted[i];const need=b1.filter(b=>b.a===a.id||b.b===a.id).map(b=>b.order).sort().join('');for(const b of a2){if(used.has(b.id)||b.s!==a.s||b2.filter(x=>x.a===b.id||x.b===b.id).map(x=>x.order).sort().join('')!==need)continue;let ok=true;for(const [sid,tid] of map)if((srcMap.get(key(a.id,sid))||0)!==(edgeMap.get(key(b.id,tid))||0)){ok=false;break}if(!ok)continue;map.set(a.id,b.id);used.add(b.id);if(search(i+1))return true;map.delete(a.id);used.delete(b.id)}return false}return search(0)}
function currentPreset09(){for(const [name,p] of Object.entries(presetData)){let a=p.atoms.map((x,i)=>({id:i+1,s:x[0]})),b=p.edges.map(x=>({a:x[0]+1,b:x[1]+1,order:x[2]}));if(sameGraph09(molAtoms,molBonds,a,b))return name}return null}
const knownProduct09={H2O:['water','methane','neutral'],CO2:['carbon','methane'],CH4:[],NH3:[],O2:[],N2:[],H2:[],HCl:[],H2O2:[],C2H4:[],C2H2:[],C2H6:[],C2H5OH:[],CH3COOH:[],C6H12O6:[]};
function renderValidator09(){const root=$('validatorPanel');if(!root)return;const v=validateGraph09(molAtoms,molBonds);const tr=(a,b)=>lang==='hu'?a:b;
 if(v.level==='empty'){root.innerHTML='<h3>⚗ '+tr('Szerkezetvizsgáló és reakcióegyenlet','Strukturprüfung und Reaktionsgleichung')+'</h3><p class="vsmall">'+tr('Építs egy molekulát. Itt azonnal megjelenik az ellenőrzés, a kötések típusa és az ismert képződési reakció.','Baue ein Molekül. Hier erscheinen Validierung, Bindungstypen und bekannte Bildungsreaktionen.')+'</p>';return}
 const label={invalid:tr('Nem megfelelő egyszerű szerkezet','Im einfachen Modell ungültig'),incomplete:tr('Hiányos szerkezet / lehetséges gyök','Unvollständige Struktur / mögliches Radikal'),unknown:tr('Nem ellenőrizhető ezzel a modellel','Mit diesem Modell nicht überprüfbar'),plausible:tr('Egyszerű vegyértékszabályok szerint megfelelő','Nach einfachen Valenzregeln plausibel')}[v.level];
 let html='<h3>⚗ '+tr('Szerkezetvizsgáló és reakcióegyenlet','Strukturprüfung und Reaktionsgleichung')+'</h3><div class="vstatus '+(v.level==='plausible'?'vok':v.level==='invalid'?'vbad':'vmaybe')+'">'+label+'</div>';
 html+='<div class="vrows">'+v.details.slice(0,20).map(x=>'<span>'+x.s+' · '+tr('kötésrend','Bindungsordnung')+' '+x.used+'/'+(x.cap??'?')+'</span>').join('')+'</div>';
 if(v.issues.length)html+='<p class="vbad">'+v.issues.join('; ')+'</p>';
 const types=[...new Set(molBonds.map(b=>{let a=molAtoms.find(x=>x.id===b.a),c=molAtoms.find(x=>x.id===b.b);if(!a||!c)return '';const t=v09Types(a.s,c.s);return a.s+'–'+c.s+': '+t[lang==='hu'?1:2]}))];
 html+='<p><b>'+tr('Kötéstípusok','Bindungstypen')+':</b> '+(types.length?types.join(' · '):'—')+'</p>';
 let preset=v.complete?currentPreset09():null;let matching=preset?(knownProduct09[preset]||[]):[];
 if(matching.length){html+='<div class="vEquation">'+matching.map(id=>reactionData.find(r=>r.id===id).eq).join('<br>')+'</div><p class="vsmall">'+tr('Ezek ismert reakciók, amelyek termékei között szerepel a felépített szerkezet. A rendezett egyenletek nem garantálják, hogy a reakció spontán vagy biztonságosan végbemegy.','Bekannte Reaktionen mit diesem Molekül als Produkt. Ausgeglichene Gleichungen garantieren keine spontane oder sichere Reaktion.')+'</p><div class="vrows">'+matching.map(id=>'<button class="v09LoadReaction" data-rxn="'+id+'">▶ '+tr('Reakció megvizsgálása','Reaktion ansehen')+' · '+reactionData.find(r=>r.id===id)[lang]+'</button>').join('')+'</div>'}
 else html+='<div class="vEquation">'+tr('Ehhez a felépített szerkezethez nincs hitelesített reakcióegyenlet a könyvtárban.','Für diese Struktur ist keine geprüfte Reaktionsgleichung in der Bibliothek vorhanden.')+'</div>';
 html+='<p class="vsmall">'+tr('A validátor csak egyszerű semleges kovalens molekulák kötésrendjét ellenőrzi. Nem számít töltést, rezonanciát, spinállapotot, kötési energiát vagy reakciókinetikát. Fémekhez, ionos vegyületekhez és átmenetifémekhez más modell szükséges.','Der Validator prüft nur Bindungsordnungen einfacher neutraler kovalenter Moleküle. Keine Berechnung von Ladung, Resonanz, Spin, Bindungsenergie oder Kinetik. Metalle und Ionenverbindungen benötigen andere Modelle.')+'</p>';
 root.innerHTML=html;root.querySelectorAll('.v09LoadReaction').forEach(btn=>btn.onclick=()=>{let idx=reactionData.findIndex(x=>x.id===btn.dataset.rxn);if(idx>=0){reactionIndex=idx;$('reactionSelect').selectedIndex=idx;reactionSelection();$('reactionSection').scrollIntoView({behavior:'smooth',block:'start'})}})}
const oldMolStatus09=updateMolStatus;updateMolStatus=function(){oldMolStatus09();renderValidator09()};
// Refresh when the currently selected element or UI language changes.
renderOrbitalLegend();renderValidator09();
