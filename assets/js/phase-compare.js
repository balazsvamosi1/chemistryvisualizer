/* Chemistry Lab 0.2117 – dual-material temperature / phase discovery.
 * Drawn dots are equal-mass portions of a sample, NOT literal molecules.
 * Responsive, dependency-free, 1 atm classroom illustration. Apache-2.0. */
(()=>{'use strict';
if(typeof document==='undefined'||!window.ChemistryPhaseCompareEngine)return;
const engine=window.ChemistryPhaseCompareEngine,$=id=>document.getElementById(id);
const required=['densityViewCompare','densityViewPhase','densityPhasePanel','phaseMaterialA','phaseMaterialB',
 'phaseRange','phaseTemperature','phaseTemperatureValue','phaseCanvasA','phaseCanvasB'];
if(required.some(id=>!$(id)))return;
const locales={
hu:{
 compare:'Sűrűség összehasonlítása',phase:'Hőmérséklet és halmazállapot',
 title:'Két anyag halmazállapotának összehasonlítása',
 pressure:'Nyomás: 1 atm (állandó) · két darab 100 g-os minta',
 matA:'Első anyag',matB:'Második anyag',range:'Hőmérsékleti tartomány',
 temp:'Közös hőmérséklet',state:'Halmazállapot',density:'Sűrűség',
 volume:'100 g térfogata',melt:'Olvadáspont',boil:'Forráspont',
 states:{solid:'Szilárd',liquid:'Folyékony',gas:'Gáz',melting:'Olvadás / fagyás',boiling:'Forrás / lecsapódás',subliming:'Szublimáció / lerakódás',softening:'Lágyulás / olvadási tartomány',unmodeled:'Ezen a tartományon kívül nincs megbízható modell'},
 jumps:{room:'20 °C · szobahő',melt:'olvad / szublimál',boil:'forr'},
 presets:'Ajánlott párok',bar:'Relatív térfogat',unknown:'Nem adható meg megbízható érték',
 noLiquid:'1 atm-on nincs folyékony fázis',mixture:'Keverék: nincs egyetlen pontos forráspont',
 variable:'Ezen a hőmérsékleten a gáz összetétele változhat; megbízható sűrűség nem számítható.',
 summary:(a,b,t)=>a+' és '+b+' · '+t+' °C · mindkettő 100 g',
 transition:'Az átmenetnél a két halmazállapot együtt is jelen lehet. A részarány nem határozható meg csupán a hőmérsékletből, ezért a sűrűség és a térfogat nincs számszerűsítve.',
 notes:{
 solid:'Rendezettebb, helyhez kötöttebb szerkezet; a jelölések nem valódi atomhelyek.',
 liquid:'A részek egymás közelében vannak, de elmozdulhatnak egymáshoz képest.',
 gas:'A minta sokkal nagyobb térfogatot foglal el; a képen a nagyítás szemléltető.',
 melting:'Olvadás / fagyás határán vagyunk. Nincs megadva, mekkora rész olvadt meg.',
 boiling:'Forrás / lecsapódás határán vagyunk. A hőközlés dönt a fázisarányról.',
 subliming:'A CO₂ 1 atm-on nem alakul át folyadékká: szárazjégből közvetlenül gáz lesz.',
 softening:'A paraffinviasz többféle szénhidrogén keveréke, ezért tartományban olvad.',
 unmodeled:'Ebben a magas hőmérséklet-tartományban nem adunk meg kitalált halmazállapotot vagy sűrűséget.'
 },
 caution:'7–8. osztályos szemléltető modell, NEM kvantumfizikai vagy molekuladinamikai szimuláció. A 72 pont egyenként azonos tömegrészt jelöl, nem egy-egy atomot. A kockák mérete szélsőséges különbségnél a láthatóság kedvéért minimumra korlátozott; a térfogatsáv és a számok mutatják a valódi arányt. A szilárd és folyékony sűrűségek közelítő referenciaértékek, nem teljes hőtágulási modell. A gázokra az ideális gáztörvényt alkalmazzuk, ahol ez értelmezhető.',
 scale:'Tartományt válthatsz, vagy a két anyag olvadásához és forrásához ugorhatsz.',
 molecule:'A minták ugyanakkora, 100 g-os tömeget jelölnek. A részecskekép csak szemléltető elrendezés; a tényleges térfogatkülönbséget a sáv és a kiírt adatok mutatják.'
},
de:{
 compare:'Dichte vergleichen',phase:'Temperatur und Aggregatzustand',
 title:'Zwei Stoffe: Aggregatzustände vergleichen',
 pressure:'Druck: 1 atm (konstant) · zwei Proben zu je 100 g',
 matA:'Erster Stoff',matB:'Zweiter Stoff',range:'Temperaturbereich',
 temp:'Gemeinsame Temperatur',state:'Aggregatzustand',density:'Dichte',
 volume:'Volumen von 100 g',melt:'Schmelzpunkt',boil:'Siedepunkt',
 states:{solid:'Fest',liquid:'Flüssig',gas:'Gas',melting:'Schmelzen / Erstarren',boiling:'Sieden / Kondensieren',subliming:'Sublimieren / Resublimieren',softening:'Schmelzbereich',unmodeled:'Keine verlässliche Modellvorhersage für diesen Bereich'},
 jumps:{room:'20 °C · Raumtemperatur',melt:'schmilzt / sublimiert',boil:'siedet'},
 presets:'Empfohlene Vergleiche',bar:'Relatives Volumen',unknown:'Kein verlässlicher Zahlenwert',
 noLiquid:'Bei 1 atm keine flüssige Phase',mixture:'Gemisch: kein einzelner genauer Siedepunkt',
 variable:'Die Gaszusammensetzung kann hier variieren, deshalb keine verlässliche Dichteangabe.',
 summary:(a,b,t)=>a+' und '+b+' · '+t+' °C · je 100 g',
 transition:'An der Übergangstemperatur können zwei Phasen gleichzeitig vorkommen. Die Anteile sind aus der Temperatur allein nicht bekannt; daher bleiben Dichte und Volumen ohne Zahlenwert.',
 notes:{
 solid:'Geordnetere, festere Struktur: keine echten Atomkoordinaten.',
 liquid:'Die Teilchen liegen nah beieinander und können aneinander vorbeigleiten.',
 gas:'Die Probe benötigt viel mehr Volumen. Die Vergrößerung der Darstellung ist schematisch.',
 melting:'Schmelz- oder Erstarrungspunkt. Der bereits geschmolzene Anteil ist nicht bekannt.',
 boiling:'Siede- oder Kondensationspunkt. Zugeführte Wärme bestimmt den Phasenanteil.',
 subliming:'CO₂ wird bei 1 atm nicht flüssig. Trockeneis geht direkt in Gas über.',
 softening:'Paraffinwachs ist ein Gemisch verschiedener Kohlenwasserstoffe und schmilzt in einem Temperaturbereich.',
 unmodeled:'Für diesen hohen Temperaturbereich werden keine erfundenen Phasen oder Dichten angezeigt.'
 },
 caution:'Ein Modell für Klasse 7–8, KEINE quantenphysikalische oder molekulardynamische Simulation. Jeder der 72 Punkte steht für eine gleiche Massenportion, nicht für ein Atom. Bei sehr großen Unterschieden wird die Würfelgröße für die Sichtbarkeit begrenzt. Die Balken und Zahlen zeigen das Verhältnis. Fest-/Flüssigdichten sind Näherungswerte, keine exakte Wärmeausdehnung. Gase werden, soweit geeignet, idealisiert berechnet.',
 scale:'Bereich wählen oder zu den Phasenübergängen der beiden Stoffe springen.',
 molecule:'Beide Proben haben 100 g Masse. Das Teilchenbild ist schematisch; Balken und Werte zeigen die Volumenverhältnisse.'
},
en:{
 compare:'Compare densities',phase:'Temperature and states of matter',
 title:'Compare two substances and their states',
 pressure:'Pressure: 1 atm (constant) · two 100 g samples',
 matA:'First substance',matB:'Second substance',range:'Temperature range',
 temp:'Shared temperature',state:'State of matter',density:'Density',
 volume:'Volume of 100 g',melt:'Melting point',boil:'Boiling point',
 states:{solid:'Solid',liquid:'Liquid',gas:'Gas',melting:'Melting / freezing',boiling:'Boiling / condensation',subliming:'Sublimation / deposition',softening:'Melting range',unmodeled:'No reliable prediction in this range'},
 jumps:{room:'20 °C · room temperature',melt:'melts / sublimes',boil:'boils'},
 presets:'Suggested comparisons',bar:'Relative volume',unknown:'No reliable numerical value',
 noLiquid:'No liquid phase at 1 atm',mixture:'Mixture: no single precise boiling point',
 variable:'Gas composition changes with temperature; reliable density cannot be calculated.',
 summary:(a,b,t)=>a+' and '+b+' · '+t+' °C · 100 g each',
 transition:'Two phases can coexist at the transition. Temperature alone cannot tell us their proportions, so no unique density or volume is assigned.',
 notes:{
 solid:'More ordered, constrained arrangement; not actual atomic coordinates.',
 liquid:'The particles stay near one another but move past each other.',
 gas:'The sample occupies much more volume. The drawing uses schematic magnification.',
 melting:'At melting / freezing, we do not know the fraction that has changed phase.',
 boiling:'At boiling / condensation, heat transfer determines the fraction of each phase.',
 subliming:'CO₂ has no liquid phase at 1 atm: dry ice converts directly to gas.',
 softening:'Paraffin wax is a mixture of hydrocarbons and melts over a range.',
 unmodeled:'No invented state or density is given for this high-temperature regime.'
 },
 caution:'Grades 7–8 illustration, NOT a quantum or molecular-dynamics simulation. Each of the 72 dots represents an equal mass portion, not one atom. For extreme volume ratios the smaller cube has a minimum visible size. The bars and numbers show the true ratio. Solid and liquid densities are approximate reference values, not an exact thermal-expansion model. Gases use the ideal gas approximation where appropriate.',
 scale:'Choose a range or jump to either substance’s melting or boiling point.',
 molecule:'Both samples have the same 100 g mass. The dot pattern is schematic; the bars and labels show the actual volume relationship.'
}};
const lang=()=>['hu','de','en'].find(x=>$(x)?.classList.contains('active'))||'hu';
const tr=()=>locales[lang()],li=()=>['hu','de','en'].indexOf(lang()),format=(v,d=2)=>v.toLocaleString(lang()==='en'?'en-US':lang()==='de'?'de-DE':'hu-HU',{maximumFractionDigits:d});
let mode='compare',raf=null,lastTime=0,activePreset=0;
const selectA=$('phaseMaterialA'),selectB=$('phaseMaterialB'),slider=$('phaseTemperature'),range=$('phaseRange'),canvases=[$('phaseCanvasA'),$('phaseCanvasB')];
function snapshots(){return engine.compare(selectA.value,selectB.value,Number(slider.value));}
function rangeFor(value){
 if(value<=150)return 'low';
 if(value<=600)return 'mid';
 return 'high';
}
const rangeLimits={low:150,mid:600,high:3200};
function adjustTemperature(value){
 const t=Math.max(engine.MIN_T,Math.min(engine.MAX_T,Math.round(value)));
 range.value=rangeFor(t);
 slider.max=String(rangeLimits[range.value]);
 slider.value=String(t);
 render();
}
function populateSelectors(){
 for(const [select,defaultId] of [[selectA,'water'],[selectB,'ethanol']]){
  const old=select.value||defaultId;select.replaceChildren();
  for(const m of engine.MATERIALS){
   const option=document.createElement('option');option.value=m.id;option.textContent=m.labels[li()];select.add(option);
  }
  select.value=old;
 }
}
function boundInfo(sample,kind){
 const m=sample.material;
 if(kind==='melt'){
  if(m.sublimation!==null)return '~'+format(m.sublimation,1)+' °C · '+tr().states.subliming;
  if(m.meltingRange)return format(m.meltingRange[0],0)+'–'+format(m.meltingRange[1],0)+' °C';
  return format(m.melt,2)+' °C';
 }
 if(m.sublimation!==null)return tr().noLiquid;
 if(m.meltingRange)return tr().mixture;
 return format(m.boil,2)+' °C';
}
function goToTransition(index,kind){
 const m=engine.material(index===0?selectA.value:selectB.value);
 const temperature=kind==='melt'?(m.sublimation??(m.meltingRange?m.meltingRange[0]:m.melt)):m.boil;
 if(temperature===null)return;
 adjustTemperature(temperature);
}
function updateJumps(){
 $('phaseJumpRoom').textContent=tr().jumps.room;
 for(const [index,suffix] of [[0,'A'],[1,'B']]){
  const m=engine.material(index===0?selectA.value:selectB.value);
  const short=suffix+' · ';
  const melt=m.sublimation??(m.meltingRange?m.meltingRange[0]:m.melt);
  const btnM=$('phaseJump'+suffix+'Melt'),btnB=$('phaseJump'+suffix+'Boil');
  btnM.disabled=melt===null;
  btnM.textContent=short+tr().jumps.melt+(melt===null?'':' '+format(melt,0)+'°');
  btnB.disabled=m.boil===null;
  btnB.textContent=short+tr().jumps.boil+(m.boil===null?'':' '+format(m.boil,0)+'°');
 }
}
function formatVolume(sample){
 if(sample.volumeCm3===null)return tr().unknown;
 return sample.volumeCm3>=1000?format(sample.volumeLitres,3)+' L':format(sample.volumeCm3,2)+' cm³';
}
function formatDensity(sample){
 if(sample.density===null)return tr().unknown;
 const n=sample.density;
 return format(n,n<.01?8:4)+' g/cm³';
}
function explain(sample){
 let note=tr().notes[sample.phase];
 if(sample.id==='carbonDioxide')note+=' '+tr().notes.subliming;
 if(sample.id==='paraffin')note+=' '+tr().notes.softening;
 if(sample.id==='sulfur'&&sample.phase==='gas')note+=' '+tr().variable;
 return note;
}
function labelResults(sample,suffix,maxVolume){
 const tx=tr(),m=sample.material;
 $('phaseMaterialTitle'+suffix).textContent=m.labels[li()];
 $('phaseState'+suffix).textContent=tx.states[sample.phase];
 $('phaseDensity'+suffix).textContent=formatDensity(sample);
 $('phaseVolume'+suffix).textContent=formatVolume(sample);
 $('phaseMelt'+suffix).textContent=boundInfo(sample,'melt');
 $('phaseBoil'+suffix).textContent=boundInfo(sample,'boil');
 $('phaseExplanation'+suffix).textContent=explain(sample);
 const badge=$('phaseBadges'+suffix);
 badge.replaceChildren();
 const kinds=sample.phase==='melting'||sample.phase==='softening'?['solid','liquid']:
  sample.phase==='boiling'?['liquid','gas']:sample.phase==='subliming'?['solid','gas']:[sample.phase];
 for(const phase of kinds){
  const el=document.createElement('span');el.className='active';el.textContent=tx.states[phase];badge.append(el);
 }
 $('phaseBarTitle'+suffix).textContent=tx.bar;
 const frac=sample.volumeCm3===null||maxVolume===0?0:sample.volumeCm3/maxVolume;
 $('phaseBarValue'+suffix).textContent=sample.volumeCm3===null?'—':format(frac*100,frac<.01?3:1)+'%';
 $('phaseBarFill'+suffix).style.width=(frac===0?0:Math.max(1,frac*100))+'%';
 $('phaseBarFill'+suffix).style.backgroundColor=m.color;
}
function drawCube(ctx,sample,zoom,ms){
 const w=ctx.canvas.width,h=ctx.canvas.height;
 ctx.fillStyle='#0c2133';ctx.fillRect(0,0,w,h);
 const point=p=>{
  const x=(p.x-.5)*zoom,y=(p.y-.5)*zoom,z=(p.z-.5)*zoom;
  return {x:w*.5+(x-z)*w*.34,y:h*.54+(x+z)*h*.11-y*h*.75};
 };
 const edges=[[[0,0,0],[1,0,0]],[[0,0,0],[0,1,0]],[[0,0,0],[0,0,1]],[[1,0,0],[1,1,0]],[[1,0,0],[1,0,1]],[[0,1,0],[1,1,0]],[[0,1,0],[0,1,1]],[[0,0,1],[1,0,1]],[[0,0,1],[0,1,1]],[[1,1,0],[1,1,1]],[[1,0,1],[1,1,1]],[[0,1,1],[1,1,1]]];
 ctx.strokeStyle='#78bfdc';ctx.lineWidth=1.4;ctx.globalAlpha=.8;ctx.beginPath();
 for(const [a,b] of edges){
  const p=point({x:a[0],y:a[1],z:a[2]}),q=point({x:b[0],y:b[1],z:b[2]});
  ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
 }ctx.stroke();ctx.globalAlpha=1;
 const particles=engine.particles(sample,ms).map(p=>({...p,screen:point(p)})).sort((a,b)=>b.z-a.z);
 for(const part of particles){
  const p=part.screen;
  const rad=part.part==='gas'?3.6:4.3;
  ctx.beginPath();ctx.arc(p.x,p.y,rad,0,Math.PI*2);
  ctx.fillStyle=part.part==='gas'?'#9fe4c2':part.part==='solid'?'#bee4ef':sample.material.color;
  ctx.globalAlpha=part.part==='unknown'?.25:.9;ctx.fill();ctx.globalAlpha=1;
  ctx.strokeStyle='#10354d';ctx.lineWidth=.65;ctx.stroke();
 }
 // Always mark that the same mass is visualized on both sides.
 ctx.fillStyle='#c4e7f3';ctx.font='600 13px system-ui';
 ctx.fillText('100 g',14,22);
 if(sample.volumeCm3!==null&&zoom<=.251){
  ctx.fillStyle='#ffdca1';ctx.font='11px system-ui';ctx.fillText('×  '+(lang()==='en'?'schematic zoom':'nagyítás / Zoom'),14,h-14);
 }
}
function render(){
 if(mode!=='phase')return;
 const c=snapshots(),volumes=[c.left.volumeCm3,c.right.volumeCm3].filter(Number.isFinite),maxVolume=Math.max(0,...volumes);
 $('phaseTemperatureValue').textContent=c.temperature+' °C';
 $('phaseCompareSummary').textContent=tr().summary(c.left.material.labels[li()],c.right.material.labels[li()],c.temperature);
 for(const [sample,suffix] of [[c.left,'A'],[c.right,'B']])labelResults(sample,suffix,maxVolume);
 const special=[c.left,c.right].filter(s=>s.coexistence).map(s=>s.material.labels[li()]+': '+tr().states[s.phase]);
 $('phaseCoexistence').textContent=special.length?special.join(' · ')+' — '+tr().transition:'';
 updateJumps();
 draw(lastTime);
}
function draw(ms=0){
 if(mode!=='phase')return;
 const c=snapshots(),v=Math.max(c.left.volumeCm3||0,c.right.volumeCm3||0);
 for(const [i,s] of [c.left,c.right].entries()){
  const cv=canvases[i],ctx=cv.getContext('2d');if(!ctx)continue;
  const ratio=s.volumeCm3===null||v===0?.72:Math.cbrt(s.volumeCm3/v);
  const zoom=Math.max(.25,Math.min(1,ratio));
  drawCube(ctx,s,zoom,ms);
 }
}
function stop(){if(raf!==null)cancelAnimationFrame(raf);raf=null;}
function start(){
 if(raf!==null)return;
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){draw(0);return;}
 let previous=-1000;
 function step(now){
  if(mode!=='phase'||document.hidden){raf=null;return;}
  if(now-previous>=90){lastTime=now;draw(now);previous=now;}
  raf=requestAnimationFrame(step);
 }
 raf=requestAnimationFrame(step);
}
function show(value){
 mode=value==='phase'?'phase':'compare';
 $('densitySection').dataset.densityView=mode;
 $('densityPhasePanel').hidden=mode!=='phase';
 $('densityViewPhase').setAttribute('aria-pressed',String(mode==='phase'));
 $('densityViewCompare').setAttribute('aria-pressed',String(mode==='compare'));
 if(mode==='phase'){render();start();}
 else {stop();window.ChemistryDensityLab?.render?.();}
}
function renderPresets(){
 const host=$('phaseComparePresets');host.replaceChildren();
 for(const [i,p] of engine.PRESETS.entries()){
  const b=document.createElement('button');b.type='button';
  b.textContent=engine.material(p.a).labels[li()]+' / '+engine.material(p.b).labels[li()];
  b.title=p.t+' °C';
  b.classList.toggle('active',i===activePreset);
  b.addEventListener('click',()=>applyPreset(i));
  host.append(b);
 }
}
function applyPreset(index){
 const p=engine.PRESETS[index];if(!p)throw new RangeError('Unknown preset');
 activePreset=index;selectA.value=p.a;selectB.value=p.b;
 adjustTemperature(p.t);renderPresets();
}
function localize(){
 populateSelectors();
 const tx=tr();
 $('densityViewCompare').textContent=tx.compare;$('densityViewPhase').textContent=tx.phase;
 $('phaseTitle').textContent=tx.title;$('phasePressure').textContent=tx.pressure;
 for(const key of ['temp','range']){
  $('phase'+(key==='temp'?'Temperature':'Range')+'Label').textContent=tx[key];
 }
 $('phaseMaterialALabel').textContent=tx.matA;$('phaseMaterialBLabel').textContent=tx.matB;
 $('phaseScaleNote').textContent=tx.scale;
 $('phaseCaution').textContent=tx.caution;$('phaseMoleculeNote').textContent=tx.molecule;
 for(const side of ['A','B'])for(const key of ['state','density','volume','melt','boil']){
  $('phase'+key[0].toUpperCase()+key.slice(1)+'Label'+side).textContent=tx[key];
 }
 renderPresets();render();
}
$('densityViewCompare').addEventListener('click',()=>show('compare'));
$('densityViewPhase').addEventListener('click',()=>show('phase'));
selectA.addEventListener('change',()=>{activePreset=-1;renderPresets();render();});
selectB.addEventListener('change',()=>{activePreset=-1;renderPresets();render();});
slider.addEventListener('input',render);
range.addEventListener('change',()=>{
 const prev=Number(slider.value);slider.max=String(rangeLimits[range.value]);
 if(prev>Number(slider.max))slider.value=slider.max;
 render();
});
$('phaseJumpRoom').addEventListener('click',()=>adjustTemperature(20));
for(const [side,index] of [['A',0],['B',1]]){
 $('phaseJump'+side+'Melt').addEventListener('click',()=>goToTransition(index,'melt'));
 $('phaseJump'+side+'Boil').addEventListener('click',()=>goToTransition(index,'boil'));
}
for(const key of ['hu','de','en'])$(key)?.addEventListener('click',()=>queueMicrotask(localize));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(mode==='phase')start();});
populateSelectors();localize();show('compare');
window.ChemistryPhaseCompare={showComparison:()=>show('compare'),showPhase:()=>show('phase'),getSnapshot:snapshots,
 select:(a,b,t)=>{
  if(!engine.material(a)||!engine.material(b)||!Number.isFinite(t))return false;
  selectA.value=a;selectB.value=b;adjustTemperature(t);show('phase');return true;
 },setTemperature:adjustTemperature,applyPreset};
})();
