/* Chemistry Lab 0.2116: interactive water state-change teaching view.
 * Schematic 3D projection, NOT a quantum or molecular-dynamics solver.
 * Static-hosting compatible; no external libraries. Apache-2.0.
 */
(()=>{'use strict';
if(typeof document==='undefined'||!window.ChemistryWaterPhaseEngine)return;
const engine=window.ChemistryWaterPhaseEngine, $=id=>document.getElementById(id);
const ids=['densitySection','densityViewCompare','densityViewPhase','densityPhasePanel',
 'phaseTemperature','phaseTemperatureValue','phaseCanvas','phaseState','phaseDensity',
 'phaseVolume','phaseExplanation','phaseCaution','phasePressure','phaseTitle','phaseMoleculeNote'];
if(ids.some(id=>!$(id)))return;
const i18n={
hu:{
 compare:'Sűrűség összehasonlítása',phase:'Hőmérséklet és halmazállapot',
 title:'A víz halmazállapota',temp:'Hőmérséklet (°C)',pressure:'Nyomás: 1 atm (állandó)',
 phases:['Jég · szilárd','Víz · folyékony','Vízgőz · gáz'],
 melting:'Olvadás vagy fagyás · jég + víz',boiling:'Forrás vagy lecsapódás · víz + vízgőz',
 status:'Halmazállapot',density:'Sűrűség',volume:'100 g víz térfogata',
 unknown:'Nem adható meg egyetlen érték: két állapot is jelen lehet.',
 molecule:'Ugyanazok a H₂O-molekulák maradnak; az elrendezésük és mozgásuk változik.',
 caution:'Ez NEM kvantumfizikai vagy molekuladinamikai szimuláció. A mozgás, a részecskék mérete és a gázhoz használt nagyítás szemléltető; a kockák NEM azonos méretarányú térfogatot mutatnak. Az értékek 1 atm-ra vonatkozó közelítések.',
 explanations:{
  solid:'A jég rendezett, nyitott szerkezetű. A részecskék a helyük körül rezegnek. Azonos tömegnél a jég valamivel több helyet foglal, mint a folyékony víz.',
  melting:'0 °C-on jég és folyékony víz együtt is jelen lehet. A hőmérséklet önmagában nem mondja meg, mennyi olvadt meg; ehhez a bevitt hő is kell.',
  liquid:'A folyékony víz molekulái egymás közelében vannak, és egymás mellett mozognak. A víz a jégnél kissé sűrűbb.',
  boiling:'100 °C-on folyadék és gőz együtt is jelen lehet. A forrás közben bevitt energia a halmazállapot-változáshoz kell; pusztán a hőmérséklet nem határozza meg a gőz részarányát.',
  gas:'A vízgőzben a molekulák sokkal távolabb vannak egymástól és gyorsabban mozognak. Ugyanannyi víz sokkal nagyobb térfogatot foglal el 1 atm nyomáson.'
 }},
de:{
 compare:'Dichte vergleichen',phase:'Temperatur und Aggregatzustand',
 title:'Aggregatzustände des Wassers',temp:'Temperatur (°C)',pressure:'Druck: 1 atm (konstant)',
 phases:['Eis · fest','Wasser · flüssig','Wasserdampf · gasförmig'],
 melting:'Schmelzen oder Gefrieren · Eis + Wasser',boiling:'Sieden oder Kondensieren · Wasser + Dampf',
 status:'Aggregatzustand',density:'Dichte',volume:'Volumen von 100 g Wasser',
 unknown:'Kein eindeutiger Wert: beide Phasen können gleichzeitig vorkommen.',
 molecule:'Die H₂O-Moleküle bleiben gleich. Nur Anordnung und Bewegung ändern sich.',
 caution:'KEINE quantenphysikalische oder molekulardynamische Simulation. Bewegung, Teilchengröße und die Vergrößerung des Gases sind schematisch. Die Kästen zeigen KEINE maßstabsgetreuen Volumina. Näherungswerte für 1 atm.',
 explanations:{
 solid:'Eis hat ein offenes, geordnetes Gefüge. Die Moleküle schwingen am Platz. Die gleiche Masse benötigt etwas mehr Volumen als flüssiges Wasser.',
 melting:'Bei 0 °C können Eis und flüssiges Wasser zusammen vorkommen. Die Temperatur allein verrät nicht, welcher Anteil bereits geschmolzen ist.',
 liquid:'In flüssigem Wasser sind Moleküle nah beieinander und bewegen sich gegeneinander. Flüssiges Wasser ist etwas dichter als Eis.',
 boiling:'Bei 100 °C können Flüssigkeit und Wasserdampf nebeneinander existieren. Während des Siedens wird Wärme für den Phasenübergang benötigt. Der Dampfanteil folgt nicht aus der Temperatur allein.',
 gas:'Im Wasserdampf sind Moleküle weit voneinander entfernt und bewegen sich schnell. Dieselbe Wassermasse benötigt bei 1 atm viel mehr Raum.'
 }},
en:{
 compare:'Compare densities',phase:'Temperature and states of matter',
 title:'States of water',temp:'Temperature (°C)',pressure:'Pressure: 1 atm (constant)',
 phases:['Ice · solid','Water · liquid','Water vapour · gas'],
 melting:'Melting or freezing · ice + water',boiling:'Boiling or condensation · water + vapour',
 status:'State of matter',density:'Density',volume:'Volume of 100 g of water',
 unknown:'No single value: two phases may be present together.',
 molecule:'The H₂O molecules remain the same. Their arrangement and motion change.',
 caution:'NOT a quantum-physics or molecular-dynamics simulation. Motion, particle size, and gas magnification are schematic. The boxes do NOT show volumes to a common scale. Values approximate at 1 atm.',
 explanations:{
 solid:'Ice has an open, ordered structure. Molecules vibrate in place. At equal mass, ice occupies slightly more volume than liquid water.',
 melting:'At 0 °C, ice and liquid water may coexist. Temperature alone does not show how much has melted: transferred heat also matters.',
 liquid:'Liquid water molecules are close together and move past one another. Liquid water is slightly denser than ice.',
 boiling:'At 100 °C, liquid and vapour may coexist. Added heat can drive the phase transition; temperature alone does not determine how much vapour is present.',
 gas:'Water vapour molecules are much farther apart and move rapidly. At 1 atm, the same mass of water occupies a much larger volume.'
 }}
};
const language=()=>['hu','de','en'].find(x=>$(x)?.classList.contains('active'))||'hu';
const canvas=$('phaseCanvas'),ctx=canvas.getContext('2d');
let view='compare',lastTemperature=20,lastFrame=0,frameId=null;
const format=(n,d=3)=>n.toLocaleString(language()==='de'?'de-DE':language()==='hu'?'hu-HU':'en-US',{maximumFractionDigits:d});
function current(){return engine.phaseAt(Number($('phaseTemperature').value));}
function show(viewName){
 view=viewName==='phase'?'phase':'compare';
 const panel=$('densitySection');panel.dataset.densityView=view;
 $('densityPhasePanel').hidden=view!=='phase';
 $('densityViewCompare').setAttribute('aria-pressed',String(view==='compare'));
 $('densityViewPhase').setAttribute('aria-pressed',String(view==='phase'));
 if(view==='phase'){update();start();}
 else{stop();window.ChemistryDensityLab?.render?.();}
}
function pointProject(p,w,h){
 const xx=(p.x-.5),yy=(p.y-.5),zz=(p.z-.5);
 return {x:w*.5+(xx-zz)*w*.34,y:h*.54+(xx+zz)*h*.115-yy*h*.64,z:p.z};
}
function line(from,to,w,h){const a=pointProject(from,w,h),b=pointProject(to,w,h);ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);}
function draw(millis=0){
 if(view!=='phase'||!ctx)return;
 const state=current(),phase=state.phase, w=canvas.width,h=canvas.height;
 ctx.fillStyle='#0b2032';ctx.fillRect(0,0,w,h);
 const edges=[[[0,0,0],[1,0,0]],[[0,0,0],[0,1,0]],[[0,0,0],[0,0,1]],[[1,0,0],[1,1,0]],[[1,0,0],[1,0,1]],[[0,1,0],[1,1,0]],[[0,1,0],[0,1,1]],[[0,0,1],[1,0,1]],[[0,0,1],[0,1,1]],[[1,1,0],[1,1,1]],[[1,0,1],[1,1,1]],[[0,1,1],[1,1,1]]];
 ctx.strokeStyle='#8bcbe3';ctx.globalAlpha=.48;ctx.lineWidth=1.5;ctx.beginPath();
 for(const [a,b] of edges)line({x:a[0],y:a[1],z:a[2]},{x:b[0],y:b[1],z:b[2]},w,h);
 ctx.stroke();ctx.globalAlpha=1;
 const pts=engine.molecules(phase,millis).map(p=>({...p,screen:pointProject(p,w,h)})).sort((a,b)=>b.z-a.z);
 for(const p of pts){
  const {x,y}=p.screen;
  const size=p.part==='gas'?4.5:5.3;
  const color=p.part==='solid'?'#9bdfff':p.part==='gas'?'#92e8b8':'#71c5ff';
  ctx.fillStyle='rgba(245,250,255,.94)';
  ctx.beginPath();ctx.arc(x-size*.6,y+size*.8,Math.max(1.35,size*.42),0,Math.PI*2);
  ctx.arc(x+size*.6,y+size*.8,Math.max(1.35,size*.42),0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
  ctx.strokeStyle='#16455e';ctx.lineWidth=.8;ctx.stroke();
 }
 const label=i18n[language()];
 ctx.fillStyle='#c9eafa';ctx.font='600 15px system-ui';ctx.fillText(label.phases[phase==='gas'||phase==='boiling'?2:phase==='solid'||phase==='melting'?0:1],18,28);
 ctx.fillStyle='#93b7c9';ctx.font='12px system-ui';ctx.fillText('H₂O  ·  '+state.schematicMolecules+' ×',18,h-16);
}
function update(){
 const s=current(),tr=i18n[language()];
 lastTemperature=s.temperature;
 $('phaseTemperatureValue').textContent=s.temperature+' °C';
 $('phaseState').textContent=s.phase==='melting'?tr.melting:s.phase==='boiling'?tr.boiling:tr.phases[['solid','liquid','gas'].indexOf(s.phase)];
 $('phaseDensity').textContent=s.density===null?'—':format(s.density,s.phase==='gas'?7:5)+' g/cm³';
 $('phaseVolume').textContent=s.volumeCm3===null?'—':s.volumeCm3<1000?format(s.volumeCm3,1)+' cm³':format(s.volumeLitres,1)+' L';
 $('phaseExplanation').textContent=tr.explanations[s.phase];
 $('phaseCoexistence').hidden=!s.coexistence;
 $('phaseCoexistence').textContent=tr.unknown;
 for(const id of ['solid','liquid','gas'])$('phaseBadge'+id).classList.toggle('active',s.phase===id||s.phase==='melting'&&(id==='solid'||id==='liquid')||s.phase==='boiling'&&(id==='liquid'||id==='gas'));
 draw(lastFrame);
}
function localize(){
 const tr=i18n[language()];
 $('densityViewCompare').textContent=tr.compare;$('densityViewPhase').textContent=tr.phase;
 $('phaseTitle').textContent=tr.title;$('phaseTemperatureLabel').textContent=tr.temp;
 $('phasePressure').textContent=tr.pressure;
 $('phaseStateLabel').textContent=tr.status;$('phaseDensityLabel').textContent=tr.density;
 $('phaseVolumeLabel').textContent=tr.volume;
 $('phaseMoleculeNote').textContent=tr.molecule;$('phaseCaution').textContent=tr.caution;
 for(const [i,id] of ['solid','liquid','gas'].entries())$('phaseBadge'+id).textContent=tr.phases[i];
 for(const t of [-15,0,20,100,120])$('phasePreset'+String(t).replace('-','M')).textContent=t+' °C';
 update();
}
function start(){
 if(frameId!==null)return;
 const tick=now=>{
  frameId=null;
  if(view!=='phase'||document.hidden)return;
  lastFrame=now;
  draw(now);
  frameId=requestAnimationFrame(tick);
 };
 if(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)frameId=requestAnimationFrame(tick);
 else draw(0);
}
function stop(){if(frameId!==null)cancelAnimationFrame(frameId);frameId=null;}
$('densityViewCompare').addEventListener('click',()=>show('compare'));
$('densityViewPhase').addEventListener('click',()=>show('phase'));
$('phaseTemperature').addEventListener('input',update);
for(const t of [-15,0,20,100,120]){
 $('phasePreset'+String(t).replace('-','M')).addEventListener('click',()=>{
  $('phaseTemperature').value=String(t);update();
 });
}
for(const lang of ['hu','de','en'])$(lang)?.addEventListener('click',()=>queueMicrotask(localize));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(view==='phase')start();});
localize();
window.ChemistryWaterPhase={showComparison:()=>show('compare'),showPhase:()=>show('phase'),getSnapshot:current,update};
})();
