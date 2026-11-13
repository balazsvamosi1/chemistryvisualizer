/* Chemistry Lab — six mini games sharing validated lab engines; no extra services. */
(function(){
'use strict';
if(typeof document==='undefined')return;
const $=id=>document.getElementById(id);
const root=$('miniGamesSection'),catalog=$('miniGameCatalog'),stage=$('miniGameStage');
if(!root||!catalog||!stage)return;
const languages=['hu','de','en'];
const locale=()=>languages.find(x=>$(x)?.classList.contains('active'))||'hu';
const index=()=>languages.indexOf(locale());
const w=(hu,de,en)=>[hu,de,en][index()];
const say=a=>Array.isArray(a)?a[index()]:a;
const el=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n};
const btn=(value,fn,cls)=>{const n=el('button',cls,value);n.type='button';if(fn)n.addEventListener('click',fn);return n};
const add=(parent,...children)=>{parent.append(...children);return parent};
const recordKey='chemistryMiniGamesBestV1';
const gameData=[
 {id:'elements',icon:'◈',title:['Elemvadászat','Elementjagd','Element Hunt'],desc:['Ismerd fel a valódi elemmintákat fotókról.','Erkenne Elemente auf echten Probenfotos.','Recognise elements from photographs.'],lab:'periodSection'},
 {id:'molecule',icon:'⬡',title:['Molekulaküldetés','Molekülmission','Molecule Mission'],desc:['Állíts össze atomokat, és készíts helyes kötéseket.','Verbinde Atome mit der richtigen Bindungsordnung.','Connect atoms using the correct bonds.'],lab:'moleculeSection'},
 {id:'density',icon:'▣',title:['Úszik vagy elsüllyed?','Schwimmt oder sinkt?','Float or Sink?'],desc:['Jósolj az anyagok sűrűsége alapján, majd ellenőrizd.','Triff eine Vorhersage anhand der Dichte.','Predict how materials behave in water.'],lab:'densitySection'},
 {id:'phase',icon:'◉',title:['Halmazállapot-kihívás','Aggregatzustands-Mission','State of Matter'],desc:['Állítsd be a megfelelő hőmérsékletet.','Stelle die richtige Temperatur ein.','Find temperatures for the target phase.'],lab:'densitySection'},
 {id:'flame',icon:'♨',title:['Lángdetektív','Flammen-Detektiv','Flame Detective'],desc:['Ismerj fel ismeretlen elemeket a lángszínükből.','Erkenne unbekannte Proben an der Flammenfarbe.','Identify samples by their flame colour.'],lab:'bunsenSection'},
 {id:'acid',icon:'⚗',title:['pH-küldetés','pH-Mission','pH Mission'],desc:['Cseppenként semlegesíts virtuális oldatokat.','Neutralisiere Lösungen durch Titration.','Neutralise virtual solutions using titration.'],lab:'acidBaseSection'}
];
const elements=JSON.parse($('element-data').textContent);
const elementByZ=z=>elements.find(e=>e.z===z);
const state={game:null,round:0,score:0,tries:0,solved:false,completed:false};
const BANK={
 elements:[{z:16,choices:[16,29,79]},{z:29,choices:[26,29,13]},{z:79,choices:[79,47,50]},{z:26,choices:[26,30,16]}],
 molecule:[{formula:'H₂O',name:['vizet','Wasser','water'],center:'O',outer:['H','H'],order:1},{formula:'CO₂',name:['szén-dioxidot','Kohlenstoffdioxid','carbon dioxide'],center:'C',outer:['O','O'],order:2},{formula:'NH₃',name:['ammóniát','Ammoniak','ammonia'],center:'N',outer:['H','H','H'],order:1},{formula:'CH₄',name:['metánt','Methan','methane'],center:'C',outer:['H','H','H','H'],order:1}],
 density:['wood','iron','ice','aluminum'],
 phase:[{id:'water',goal:'solid',start:20,min:-30,max:120},{id:'ethanol',goal:'gas',start:20,min:-140,max:130},{id:'iron',goal:'liquid',start:1000,min:1000,max:3000},{id:'oxygen',goal:'gas',start:-200,min:-230,max:-150}],
 flame:[{id:'Na',choices:['Na','K','Li']},{id:'Ba',choices:['Ba','Cu','Ca']},{id:'Cu',choices:['Cu','B','In']},{id:'K',choices:['K','Li','Ca']}],
 acid:[{analyte:'HCl',titrant:'NaOH',analyteM:.1,titrantM:.1,analyteMl:25},{analyte:'HNO3',titrant:'KOH',analyteM:.1,titrantM:.1,analyteMl:20},{analyte:'NaOH',titrant:'HCl',analyteM:.05,titrantM:.1,analyteMl:30},{analyte:'HBr',titrant:'NaOH',analyteM:.1,titrantM:.05,analyteMl:15}]
};
const goalCount=4;
function best(){
 try{const v=JSON.parse(localStorage.getItem(recordKey)||'{}');return v&&typeof v==='object'?v:{}}catch{return{}}
}
function storeBest(id,score){
 try{const v=best();v[id]=Math.max(score,Number(v[id])||0);localStorage.setItem(recordKey,JSON.stringify(v))}catch{}
}
function gameLabel(id){return say(gameData.find(g=>g.id===id)?.title||[id,id,id])}
function renderCatalog(){
 $('miniGamesTab').textContent=w('Mini-játékok','Minispiele','Mini-games');
 $('miniGamesTitle').textContent=w('Mini-játékok','Minispiele','Mini-games');
 $('miniGameIntro').textContent=w('Hat rövid kémiai kihívás a meglévő laborok számításaival. Válassz játékot!','Sechs kurze Chemie-Herausforderungen auf Basis der Laborberechnungen.','Six short chemistry challenges using the lab simulation engines.');
 catalog.replaceChildren();
 const saved=best();
 for(const g of gameData){
  const card=el('article','mg-card'),symbol=el('div','mg-card-icon',g.icon);
  const title=el('h3','',say(g.title));
  const desc=el('p','',say(g.desc));
  const record=el('small','mg-progress',saved[g.id]!=null?w('Rekord: ','Rekord: ','Best: ')+saved[g.id]+'/'+goalCount:w('Még nincs eredmény','Noch kein Ergebnis','No score yet'));
  card.append(symbol,title,desc,record,btn(w('Játék indítása','Spiel starten','Start game'),()=>open(g.id),'mg-go'));
  catalog.append(card);
 }
}
function feedback(box,message,kind){
 box.textContent=message;box.dataset.kind=kind||'info';
}
function start(id){
 if(!Object.hasOwn(BANK,id))return;
 state.game=id;state.round=0;state.score=0;state.completed=false;
 renderRound();
}
function open(id){
 start(id);
 const tab=$('miniGamesTab');if(tab)tab.click();
 window.ChemistryNavigation?.activate('miniGamesTab',false);
 requestAnimationFrame(()=>root.scrollIntoView({behavior:'smooth',block:'start'}));
}
function close(){
 state.game=null;state.completed=false;
 stage.hidden=true;catalog.hidden=false;renderCatalog();
}
function roundScaffold(description,tip){
 stage.hidden=false;catalog.hidden=true;stage.replaceChildren();
 const header=el('div','mg-game-head');
 header.append(el('h3','',gameLabel(state.game)),el('span','mg-progress',w('Feladat ','Aufgabe ','Round ')+(state.round+1)+'/'+goalCount+' · '+w('Pont ','Punkte ','Points ')+state.score));
 stage.append(header);
 const area=el('div','mg-area');
 area.append(el('p','mg-question',description));
 if(tip)area.append(el('p','mg-sub',tip));
 const message=el('div','mg-message',w('Próbáld ki a feladatot!','Probiere es aus!','Try the challenge!'));message.setAttribute('role','status');message.setAttribute('aria-live','polite');
 const footer=el('div','mg-controls');
 footer.append(btn(w('← Játékok','← Spiele','← Games'),close));
 stage.append(area,message,footer);
 return{area,message,footer};
}
function pass(ui,explanation){
 if(state.solved)return;
 state.solved=true;
 if(state.tries===0)state.score++;
 feedback(ui.message,w('Sikerült! ','Geschafft! ','Success! ')+explanation,'good');
 ui.footer.append(btn(state.round===goalCount-1?w('Eredmény','Ergebnis','Results'):w('Következő feladat →','Nächste Aufgabe →','Next round →'),()=>{
  if(state.round===goalCount-1){summary();return}
  state.round++;renderRound();
 },'mg-action'));
}
function fail(ui,hint){
 if(state.solved)return;
 state.tries++;
 feedback(ui.message,hint,'try');
}
function summary(){
 state.completed=true;
 storeBest(state.game,state.score);
 const saved=best();
 const ui=roundScaffold(w('Küldetés teljesítve!','Mission abgeschlossen!','Mission complete!'),null);
 ui.area.append(el('div','mg-question',state.score+'/'+goalCount+' '+w('pont első próbálkozásból','Punkte beim ersten Versuch','first-try points')));
 ui.area.append(el('p','mg-sub',w('Saját rekord: ','Persönlicher Rekord: ','Personal best: ')+saved[state.game]+'/'+goalCount));
 ui.footer.append(btn(w('Új játék','Erneut spielen','Play again'),()=>start(state.game),'mg-action'));
}
function renderRound(){
 state.tries=0;state.solved=false;
 if(state.game==='elements')elementRound();
 else if(state.game==='molecule')moleculeRound();
 else if(state.game==='density')densityRound();
 else if(state.game==='phase')phaseRound();
 else if(state.game==='flame')flameRound();
 else if(state.game==='acid')acidRound();
}
function elementRound(){
 const challenge=BANK.elements[state.round],e=elementByZ(challenge.z);
 const ui=roundScaffold(w('Melyik elemet látod a fényképen?','Welches Element zeigt das Foto?','Which element is shown in the photo?'),w('Nézd meg a mintát, majd válassz vegyjelet.','Betrachte die Probe und wähle ein Elementsymbol.','Study the sample, then pick its symbol.'));
 const frame=el('div','mg-photo'),meta=window.ChemistryElementPhotos?.[e.z];
 if(meta?.url){
  const img=el('img');img.alt=w('Ismeretlen elemminta','Unbekannte Elementprobe','Unknown element sample');img.src=meta.url;img.loading='lazy';img.referrerPolicy='no-referrer';img.addEventListener('error',()=>{img.hidden=true;frame.append(el('p','mg-sub',w('A fotó nem érhető el.','Foto nicht verfügbar.','Image unavailable.')))});frame.append(img);
 }else frame.append(el('p','mg-sub',w('A fotó jelenleg nem érhető el.','Foto nicht verfügbar.','Image unavailable.')));
 ui.area.append(frame);
 const options=el('div','mg-options');
 for(const z of challenge.choices){
  const other=elementByZ(z);
  options.append(btn(other.s+' · '+other[locale()],()=>{
   if(state.solved)return;
   if(z===e.z){
    pass(ui,w('Ez a(z) ','Das ist ','This is ')+e[locale()]+' ('+e.s+').');
    if(meta?.attribution)frame.append(el('p','mg-credit',meta.attribution));
   }else fail(ui,w('Nem ez az elem. Figyeld meg a mintát!','Nicht dieses Element. Schau dir die Probe genau an.','Not that element. Look closely at the sample.'));
  }));
 }
 ui.area.append(options);
}
function moleculeRound(){
 const challenge=BANK.molecule[state.round];
 const ui=roundScaffold(w('Építsd fel: ','Baue: ','Build: ')+challenge.formula,w('Adj hozzá atomokat, jelölj ki két atomot egy kötéshez, és válaszd ki a kötésrendet.','Füge Atome hinzu, verbinde jeweils zwei Atome und wähle die Bindungsordnung.','Add atoms, click two atoms to bond them, and choose the bond order.'));
 const board=el('div','mg-molecule-board');
 const atoms=[],bonds=[];
 let chosen=-1,order=1;
 const choose=el('div','mg-atom-add');
 const pool=[...new Set([challenge.center,...challenge.outer])];
 for(const symbol of pool)choose.append(btn('+ '+symbol,()=>{if(state.solved||atoms.length>=6)return;atoms.push({id:atoms.length,s:symbol});chosen=-1;draw()}));
 const menu=el('div','mg-bond-menu');
 const orderLabel=el('label','',w('Kötésrend: ','Bindungsordnung: ','Bond order: '));
 const select=el('select');select.setAttribute('aria-label',w('Kötésrend','Bindungsordnung','Bond order'));
 for(const [value,title] of [[1,w('1 – egyszeres','1 – Einfach','1 – single')],[2,w('2 – kettős','2 – Doppel','2 – double')],[3,w('3 – hármas','3 – Dreifach','3 – triple')]]){
  const o=el('option','',title);o.value=String(value);select.append(o);
 }
 select.addEventListener('change',()=>{order=Number(select.value)});
 orderLabel.append(select);
 menu.append(orderLabel,btn(w('Visszavonás','Rückgängig','Undo'),()=>{
  if(state.solved)return;
  if(bonds.length)bonds.pop();
  else atoms.pop();
  chosen=-1;draw();
 }),btn(w('Törlés','Alles löschen','Clear'),()=>{if(state.solved)return;atoms.length=0;bonds.length=0;chosen=-1;draw()}));
 const check=btn(w('Molekula ellenőrzése','Molekül prüfen','Check molecule'),()=>{
  if(state.solved)return;
  const expectedAtoms=[challenge.center,...challenge.outer].sort().join(',');
  const actualAtoms=atoms.map(a=>a.s).sort().join(',');
  const norm=(a,b,n)=>[a,b].sort().join('-')+':'+n;
  const expectBonds=challenge.outer.map(s=>norm(challenge.center,s,challenge.order)).sort().join(',');
  const actualBonds=bonds.map(b=>norm(atoms[b.a].s,atoms[b.b].s,b.n)).sort().join(',');
  const analysis=window.ChemistryMoleculeLearning?.analyze({atoms:atoms.map(a=>({id:a.id+1,s:a.s})),bonds:bonds.map(b=>({a:b.a+1,b:b.b+1,order:b.n,kind:'covalent'}))});
  if(expectedAtoms===actualAtoms&&actualBonds===expectBonds&&(!analysis||analysis.components===1)){
   pass(ui,w('A megfelelő atomok között helyes kötések vannak.','Die richtigen Atome sind korrekt verbunden.','The right atoms have the correct bonds.'));
  }else fail(ui,w('Még nem helyes az atomszám vagy a kötések. Nézd meg a képletet!','Atomzahl oder Bindungen stimmen noch nicht. Prüfe die Formel.','Check the atom counts and the bonds against the target formula.'));
 },'mg-action');
 function positions(){
  return atoms.map((a,i)=>{
   if(i===0)return{x:50,y:50};
   const count=atoms.length-1,angle=-Math.PI/2+2*Math.PI*(i-1)/Math.max(1,count);
   return{x:50+33*Math.cos(angle),y:50+35*Math.sin(angle)};
  });
 }
 function draw(){
  board.replaceChildren();const pos=positions();const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');
  for(const b of bonds){
   const a=pos[b.a],c=pos[b.b];if(!a||!c)continue;
   const len=Math.hypot(c.x-a.x,c.y-a.y)||1,offX=-(c.y-a.y)/len*.8,offY=(c.x-a.x)/len*.8;
   for(let i=0;i<b.n;i++){
    const f=i-(b.n-1)/2;
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',String(a.x+offX*f));line.setAttribute('y1',String(a.y+offY*f));line.setAttribute('x2',String(c.x+offX*f));line.setAttribute('y2',String(c.y+offY*f));line.setAttribute('stroke','#91dffc');line.setAttribute('stroke-width','.7');
    svg.append(line);
   }
  }
  board.append(svg);
  for(let i=0;i<atoms.length;i++){
   const a=atoms[i],n=btn(a.s,()=>{
    if(state.solved)return;
    if(chosen<0){chosen=i;draw();return}
    if(chosen===i){chosen=-1;draw();return}
    const existing=bonds.find(b=>(b.a===chosen&&b.b===i)||(b.a===i&&b.b===chosen));
    if(existing)existing.n=order;else bonds.push({a:chosen,b:i,n:order});
    chosen=-1;draw();
   },'mg-node'+(chosen===i?' chosen':''));
   n.style.left=pos[i].x+'%';n.style.top=pos[i].y+'%';
   n.setAttribute('aria-label',a.s+' '+(i+1));board.append(n);
  }
 }
 draw();
 ui.area.append(choose,menu,board,check);
}
function densityRound(){
 const id=BANK.density[state.round],engine=window.ChemistryDensityEngine,m=engine?.material(id);
 if(!m)return;
 const ui=roundScaffold(w('Mi történik ezzel az anyaggal a vízben?','Was passiert mit diesem Stoff in Wasser?','What happens to this material in water?'),w('Az átlagos sűrűséget hasonlítsd a víz sűrűségéhez.','Vergleiche seine mittlere Dichte mit Wasser.','Compare its bulk density with water.'));
 const title=el('h3','',m.labels[index()]);ui.area.append(title);
 const tank=el('div','mg-tank'),block=el('div','mg-specimen',m.labels[index()].split(' ')[0]);block.style.background=m.color;
 tank.append(block,el('span','mg-tank-text','H₂O'));ui.area.append(tank);
 const options=el('div','mg-options');const actual=engine.waterResult(id);
 for(const type of ['floats','sinks']){
  options.append(btn(type==='floats'?w('Úszik','Schwimmt','Floats'):w('Elsüllyed','Sinkt','Sinks'),()=>{
   if(state.solved)return;
   block.classList.remove('floats','sinks');block.classList.add(actual);
   const explanation=m.rho.toPrecision(3)+' g/cm³ '+w('az anyag sűrűsége; a vízé kb. 0,998 g/cm³.','ist die Dichte des Stoffs; Wasser: ca. 0,998 g/cm³.','is the material density; water is approximately 0.998 g/cm³.');
   if(type===actual)pass(ui,explanation);
   else fail(ui,w('Ellenőrizd a két sűrűséget! ','Vergleiche die Dichten! ','Compare the densities! ')+explanation);
  }));
 }
 ui.area.append(options);
}
function phaseRound(){
 const q=BANK.phase[state.round],engine=window.ChemistryPhaseCompareEngine,m=engine?.material(q.id);
 if(!m)return;
 const phases={solid:[w('szilárd','fest','solid')],liquid:[w('folyékony','flüssig','liquid')],gas:[w('gáz','gasförmig','gas')]};
 const goal=phases[q.goal][0];
 const ui=roundScaffold(w('Állítsd elő a(z) ','Erzeuge den Zustand ','Create the ')+goal+' '+w('halmazállapotot: ','für: ','state for: ')+m.labels[index()],w('1 atm nyomáson a meglévő labor hőmérsékletmodelljét használjuk.','Bei 1 atm verwenden wir das Temperaturmodell des Labors.','At 1 atm, this uses the existing lab model.'));
 const row=el('div','mg-slider-row'),slider=el('input','mg-thermometer');
 slider.type='range';slider.min=String(q.min);slider.max=String(q.max);slider.step='1';slider.value=String(q.start);
 slider.setAttribute('aria-label',w('Hőmérséklet Celsius fokban','Temperatur in Grad Celsius','Temperature in degrees Celsius'));
 const amount=el('span','mg-value');row.append(slider,amount);
 const sample=el('div','mg-particles');for(let i=0;i<27;i++)sample.append(el('i'));
 const live=el('p','mg-sub');
 function update(){
  const value=Number(slider.value),res=engine.state(q.id,value);
  amount.textContent=value+' °C';
  sample.className='mg-particles '+(res.phase==='solid'||res.phase==='melting'?'solid':res.phase==='liquid'||res.phase==='boiling'?'liquid':'gas');
  live.textContent=w('Aktuális állapot: ','Aktueller Zustand: ','Current state: ')+({solid:w('szilárd','fest','solid'),liquid:w('folyékony','flüssig','liquid'),gas:w('gáz','gasförmig','gas'),melting:w('olvadás','Schmelzen','melting'),boiling:w('forrás','Sieden','boiling'),subliming:w('szublimálás','Sublimation','subliming'),softening:w('lágyulás','Erweichen','softening')}[res.phase]||res.phase);
 }
 slider.addEventListener('input',update);update();
 const check=btn(w('Állapot ellenőrzése','Zustand prüfen','Check state'),()=>{
  const s=engine.state(q.id,Number(slider.value));
  if(s.phase===q.goal)pass(ui,w('A hőmérséklet megfelelő ehhez a halmazállapothoz.','Die Temperatur passt zum Zielzustand.','This temperature gives the target state.'));
  else fail(ui,w('Próbálj másik hőmérsékletet!','Versuche eine andere Temperatur.','Try another temperature.'));
 },'mg-action');
 ui.area.append(row,sample,live,check);
}
function flameRound(){
 const q=BANK.flame[state.round],science=window.BunsenScience;
 const ui=roundScaffold(w('Melyik elem lángját látod?','Welches Element färbt die Flamme?','Which element colours this flame?'),w('A lángszín oktatási közelítés; a minták valódi azonosításához további vizsgálat is szükséges.','Die Flammenfarbe ist schematisch; eine echte Probe braucht weitere Analysen.','The flame colour is illustrative; real samples require additional tests.'));
 const appearance=science?.appearance({gas:true,gasFlow:65,air:85,sample:q.id})||{color:'#e6bd71'};
 const scene=el('div','mg-flame-scene'),flame=el('div','mg-flame-fire'),nozzle=el('div','mg-flame-nozzle');
 flame.style.setProperty('--flame',appearance.color);scene.append(flame,nozzle);ui.area.append(scene);
 const options=el('div','mg-options');
 for(const id of q.choices){
  const name=science.samples[id][locale()];
  options.append(btn(name+' ('+id+')',()=>{
   if(state.solved)return;
   if(id===q.id)pass(ui,w('A szín ehhez a mintához tartozik: ','Diese Flammenfarbe gehört zu: ','The sample is: ')+name+'.');
   else fail(ui,w('Figyeld meg ismét a láng színét!','Achte noch einmal auf die Flammenfarbe.','Look at the flame colour again.'));
  }));
 }
 ui.area.append(options);
}
function acidRound(){
 const q=BANK.acid[state.round],engine=window.AcidBaseEngine;
 const ui=roundScaffold(w('Semlegesítsd az oldatot!','Neutralisiere die Lösung!','Neutralise the solution!'),w('Cél: pH 6,5–7,5. A titrálóoldatot 0,1 ml pontossággal adagolhatod. Csak virtuális kísérlet, 25 °C-on.','Ziel: pH 6,5–7,5. Dosierung in 0,1-ml-Schritten, virtuell bei 25 °C.','Target: pH 6.5–7.5. Dose in 0.1 mL steps, virtually at 25 °C.'));
 ui.area.append(el('p','mg-sub',q.analyte+' ('+q.analyteM+' mol/L; '+q.analyteMl+' mL) + '+q.titrant+' ('+q.titrantM+' mol/L)'));
 const beaker=el('div','mg-beaker'),ph=el('strong');
 beaker.append(ph);ui.area.append(beaker);
 const tools=el('div','mg-tools');
 const slide=el('input');slide.type='range';slide.min='0';slide.max='60';slide.step='.1';slide.value='0';slide.setAttribute('aria-label',w('Adagolt titrálóoldat ml-ben','Zugegebenes Volumen in ml','Titrant added in mL'));
 const number=el('input');number.type='number';number.min='0';number.max='60';number.step='.1';number.value='0';number.setAttribute('aria-label',w('Adagolt ml','Zugegebene ml','Added mL'));
 const doseLabel=el('p','mg-sub');
 let dose=0;
 function setDose(value){
  dose=Math.round(Math.min(60,Math.max(0,Number(value)||0))*10)/10;
  slide.value=String(dose);number.value=dose.toFixed(1);
  const r=engine.solve({...q,addedMl:dose});
  ph.textContent='pH '+r.pH.toFixed(2);
  beaker.style.setProperty('--liquid',r.pH<6.5?'#e99948b5':r.pH>7.5?'#5a92f1b5':'#48ce94b5');
  doseLabel.textContent=w('Adagolt mennyiség: ','Zugegebene Menge: ','Amount added: ')+dose.toFixed(1)+' mL';
 }
 slide.addEventListener('input',()=>setDose(slide.value));number.addEventListener('input',()=>setDose(number.value));
 tools.append(btn('−1 mL',()=>setDose(dose-1)),btn('−0.1',()=>setDose(dose-.1)),number,btn('+0.1',()=>setDose(dose+.1)),btn('+1 mL',()=>setDose(dose+1)));
 setDose(0);
 const check=btn(w('pH ellenőrzése','pH prüfen','Check pH'),()=>{
  const value=engine.solve({...q,addedMl:dose}).pH;
  if(value>=6.5&&value<=7.5)pass(ui,w('A kiválasztott mennyiséggel közel semleges az oldat.','Die Lösung ist mit dieser Menge annähernd neutral.','The chosen dose makes the solution approximately neutral.'));
  else fail(ui,value<6.5?w('Az oldat túl savas.','Die Lösung ist noch zu sauer.','The solution is too acidic.'):w('Az oldat túl lúgos.','Die Lösung ist zu alkalisch.','The solution is too alkaline.'));
 },'mg-action');
 ui.area.append(slide,tools,doseLabel,check);
}
const linkTargets=[
 {panel:'periodSection',games:['elements']},
 {panel:'moleculeSection',games:['molecule']},
 {panel:'densitySection',games:['density','phase']},
 {panel:'bunsenSection',games:['flame']},
 {panel:'acidBaseSection',games:['acid']}
];
const linkWidgets=[];
function installLinks(){
 for(const target of linkTargets){
  const panel=$(target.panel);if(!panel)continue;
  const row=el('div','mg-lab-links');const heading=el('span');
  row.append(heading);
  const buttons=target.games.map(id=>{const b=btn('',()=>open(id));row.append(b);return{id,b}});
  panel.prepend(row);linkWidgets.push({heading,buttons});
 }
}
function localizeLinks(){
 for(const item of linkWidgets){
  item.heading.textContent=w('Játékos gyakorlás:','Spielerisch üben:','Game practice:');
  for(const {id,b} of item.buttons)b.textContent=w('Játék: ','Spiel: ','Play: ')+gameLabel(id)+' ↗';
 }
}
for(const language of languages)$(language)?.addEventListener('click',()=>queueMicrotask(()=>{
 renderCatalog();localizeLinks();
 if(state.game){if(state.completed)summary();else renderRound()}
}));
installLinks();localizeLinks();renderCatalog();close();
window.ChemistryMiniGames=Object.freeze({open,close,games:gameData.map(g=>g.id)});
})();
