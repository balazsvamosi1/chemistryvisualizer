/* Chemistry Lab Density Lab UI 0.2106. Apache-2.0. Self-contained Canvas 2D, no network APIs. */
(()=>{'use strict';
if(typeof document==='undefined'||!window.ChemistryDensityEngine)return;
const engine=window.ChemistryDensityEngine, $=id=>document.getElementById(id);
const ids=['densitySection','densityTab','densityMode','densityShape','densityQuantity','densityQuantityValue','densityMaterialA','densityMaterialB','densityParticles','densityCanvasA','densityCanvasB','densityResultA','densityResultB','densityExplanation'];
if(ids.some(id=>!$(id)))return;
const lang=()=>['hu','de','en'].find(id=>$(id)?.classList.contains('active'))||'hu';
const li=()=>['hu','de','en'].indexOf(lang());
const strings={
 hu:{
  title:'Sűrűség – mi fér el ugyanakkora helyen?',intro:'Hasonlíts össze két anyagot. Változtasd a tömeget vagy a térfogatot, majd nézd meg az anyagok belső szerkezetének egyszerűsített modelljét.',
  mode:'Összehasonlítás',volume:'Azonos térfogat',mass:'Azonos tömeg',shape:'Test alakja',cube:'Kocka',cuboid:'Téglatest',quantityVolume:'Közös térfogat',quantityMass:'Közös tömeg',particles:'Részecskeszerkezet megjelenítése',
  chooseA:'Első anyag',chooseB:'Második anyag',density:'Sűrűség',materialMass:'Tömeg',materialVolume:'Térfogat',dimensions:'Méretek',condition:'Referenciaállapot',
  formula:'Sűrűség = tömeg / térfogat',eqVolume:'Azonos térfogat mellett a nagyobb sűrűségű anyag nehezebb.',eqMass:'Azonos tömeg mellett a kisebb sűrűségű anyag több helyet foglal.',equal:'A két anyag sűrűsége egyenlő.',times:'-szer akkora a sűrűsége, mint a(z) ',drag:'Forgasd a modellt egérrel vagy ujjal. Billentyűzeten a nyilakkal is lehet forgatni.',notScale:'A két ábra NEM méretarányos. A pontos méretek és tömegek a számoknál láthatók.',
  schematic:'A részecskék száma és mérete csak szemléltetés: nem a kocka valódi atomszámát vagy a valós távolságokat mutatja. A sűrűség függ a részecskék tömegétől ÉS térbeli elrendezésétől.',
  source:'Tájékoztató értékek: OpenStax Chemistry és NIST; a fa sűrűsége típustól és nedvességtől függ. Az adatokat nem hőmérséklet-változási szimuláció számítja.',
  compare:'Próbáld ki',preset1:'Víz és jég',preset2:'Víz és alumínium',preset3:'Vas és réz',preset4:'Levegő és víz',
  structure:'Mit mutat a részecskekép?',struct:{
   fcc:'Egyszerűsített lapközepes köbös (FCC) fémrács: a fématomok rendezett helyeken helyezkednek el.',
   bcc:'Egyszerűsített térközepes köbös (BCC) rács: ilyen a szobahőmérsékletű tiszta vas.',
   ionic:'Váltakozó Na⁺ és Cl⁻ ionokból álló kristályrács szemléltetése; nem különálló NaCl-molekulák.',
   ice:'Nyitott hidrogénkötéses háló szemléltetése. Ezért a jég sűrűsége kisebb a folyékony vízénél.',
   liquid:'Rendezetlen, egymás közelében lévő molekulák. A részecskék valójában folyamatosan mozognak.',
   gas:'Gázmolekulák messze egymástól. A valódi távolságok és a mozgás nem méretarányosak.',
   porous:'Fa: sejtfalak és üregek leegyszerűsített képe. A fa nem egyetlen homogén kristály.'
  },
  water:'Vízben',floats:'úszna (átlagos sűrűsége kisebb a vízénél)',sinks:'elsüllyedne (átlagos sűrűsége nagyobb a vízénél)',dissolves:'oldódhat, ezért a süllyedés önmagában nem jó példa',notApplicable:'folyadékra vagy gázra nem ilyen egyszerűen értelmezhető',
  caveat:'Az ábrák oktatási modellek, nem molekuladinamikai szimulációk vagy pontos kristályszerkezeti koordináták.'
 },
 de:{
  title:'Dichte – wie viel steckt im gleichen Raum?',intro:'Vergleiche zwei Stoffe. Ändere die Masse oder das Volumen und sieh dir ein vereinfachtes Modell des inneren Aufbaus an.',
  mode:'Vergleich',volume:'Gleiches Volumen',mass:'Gleiche Masse',shape:'Körperform',cube:'Würfel',cuboid:'Quader',quantityVolume:'Gemeinsames Volumen',quantityMass:'Gemeinsame Masse',particles:'Teilchenmodell anzeigen',
  chooseA:'Erster Stoff',chooseB:'Zweiter Stoff',density:'Dichte',materialMass:'Masse',materialVolume:'Volumen',dimensions:'Abmessungen',condition:'Referenzzustand',
  formula:'Dichte = Masse / Volumen',eqVolume:'Bei gleichem Volumen hat der dichtere Stoff mehr Masse.',eqMass:'Bei gleicher Masse braucht der Stoff mit kleinerer Dichte mehr Platz.',equal:'Die beiden Stoffe haben die gleiche Dichte.',times:'-mal so dicht wie ',
  drag:'Mit Maus oder Finger drehen. Mit den Pfeiltasten geht es ebenfalls.',notScale:'Die beiden Bilder sind NICHT maßstabsgetreu. Die echten Abmessungen stehen bei den Zahlen.',
  schematic:'Teilchenzahl und Teilchengröße sind schematisch. Sie zeigen weder die reale Atomzahl noch echte Abstände. Die Dichte hängt von der Masse der Teilchen UND ihrer räumlichen Anordnung ab.',
  source:'Näherungswerte aus OpenStax Chemistry und NIST; Holzdichte hängt von Holzart und Feuchte ab. Keine Berechnung veränderlicher Temperaturen.',
  compare:'Beispiele',preset1:'Wasser und Eis',preset2:'Wasser und Aluminium',preset3:'Eisen und Kupfer',preset4:'Luft und Wasser',
  structure:'Was zeigt das Teilchenbild?',struct:{
   fcc:'Vereinfachtes kubisch-flächenzentriertes Metallgitter (FCC) mit regelmäßigen Atompositionen.',
   bcc:'Vereinfachtes kubisch-raumzentriertes Gitter (BCC), wie es reines Eisen bei Raumtemperatur hat.',
   ionic:'Abwechselnde Na⁺- und Cl⁻-Ionen im Kristallgitter; keine einzelnen NaCl-Moleküle.',
   ice:'Schematisches offenes Wasserstoffbrückennetz; Eis ist deshalb weniger dicht als flüssiges Wasser.',
   liquid:'Ungeordnete Moleküle nah beieinander. In Wirklichkeit bewegen sie sich ständig.',
   gas:'Gasmoleküle weit voneinander entfernt; Abstände und Bewegung sind nicht maßstabsgetreu.',
   porous:'Holz: vereinfachte Zellwände und Hohlräume; kein einzelner homogener Kristall.'
  },
  water:'In Wasser',floats:'würde schwimmen (mittlere Dichte kleiner als Wasser)',sinks:'würde sinken (mittlere Dichte größer als Wasser)',dissolves:'kann sich auflösen, daher ist Sinken kein gutes Beispiel',notApplicable:'für Flüssigkeiten oder Gase nicht so einfach vergleichbar',
  caveat:'Didaktische Modelle, keine Molekulardynamik oder exakten Kristallkoordinaten.'
 },
 en:{
  title:'Density – what fits into the same space?',intro:'Compare two materials. Change mass or volume, then look inside a simplified model of their particle arrangements.',
  mode:'Compare',volume:'Same volume',mass:'Same mass',shape:'Solid shape',cube:'Cube',cuboid:'Rectangular prism',quantityVolume:'Shared volume',quantityMass:'Shared mass',particles:'Show particle structures',
  chooseA:'First material',chooseB:'Second material',density:'Density',materialMass:'Mass',materialVolume:'Volume',dimensions:'Dimensions',condition:'Reference conditions',
  formula:'Density = mass / volume',eqVolume:'For the same volume, the denser material has more mass.',eqMass:'For the same mass, the less dense material occupies more space.',equal:'These materials have the same density.',times:' times as dense as ',
  drag:'Drag with mouse or finger to rotate; arrow keys also rotate.',notScale:'The two drawings are NOT to scale. Actual dimensions are shown in the measurements.',
  schematic:'Particle counts and sizes are schematic, not the real number of atoms or distances. Density depends on BOTH particle mass and spatial arrangement.',
  source:'Approximate reference values from OpenStax Chemistry and NIST. Wood varies with species and moisture. No temperature-change physics is simulated.',
  compare:'Try these',preset1:'Water and ice',preset2:'Water and aluminium',preset3:'Iron and copper',preset4:'Air and water',
  structure:'What does the particle view show?',struct:{
   fcc:'Simplified face-centered cubic (FCC) metal lattice with ordered atomic positions.',
   bcc:'Simplified body-centered cubic (BCC) lattice, as for pure iron at room temperature.',
   ionic:'Alternating Na⁺ and Cl⁻ ions in a crystal lattice, not individual NaCl molecules.',
   ice:'Schematic open hydrogen-bond network. Ice has lower density than liquid water.',
   liquid:'Disordered, closely spaced molecules, which are actually constantly moving.',
   gas:'Widely separated gas molecules; true spacing and movement are not to scale.',
   porous:'Wood: simplified cell walls and voids, not one uniform crystal.'
  },
  water:'In water',floats:'would float (average density lower than water)',sinks:'would sink (average density higher than water)',dissolves:'may dissolve, so sinking is not a useful comparison',notApplicable:'not as straightforward for liquids or gases',
  caveat:'Teaching illustrations only, not molecular dynamics or exact crystallographic coordinates.'
 }
};
const ui={section:$('densitySection'),mode:$('densityMode'),shape:$('densityShape'),slider:$('densityQuantity'),display:$('densityQuantityValue'),
 A:$('densityMaterialA'),B:$('densityMaterialB'),particles:$('densityParticles'),
 canvases:[$('densityCanvasA'),$('densityCanvasB')],outputs:[$('densityResultA'),$('densityResultB')]};
const pose={yaw:-.58,pitch:.32},cached={};let comparison;
const number=(n,max=2)=>new Intl.NumberFormat(lang()==='de'?'de-DE':lang()==='hu'?'hu-HU':'en-US',{maximumFractionDigits:max}).format(n);
function densityString(rho){return number(rho,rho<.01?5:3)+' g/cm³';}
function massString(mass){return mass>=1000?number(mass/1000,3)+' kg':number(mass,3)+' g';}
function volumeString(volume){return volume>=1000000?number(volume/1000000,3)+' m³':volume>=1000?number(volume/1000,3)+' L':number(volume,2)+' cm³';}
function project(x,y,z,w,h,scale,dx,dy,dz){
 x=(x-.5)*dx;y=(y-.5)*dy;z=(z-.5)*dz;
 const a=x*Math.cos(pose.yaw)-z*Math.sin(pose.y),b=x*Math.sin(pose.yaw)+z*Math.cos(pose.yaw);
 const v=y*Math.cos(pose.pitch)-b*Math.sin(pose.pitch),depth=y*Math.sin(pose.pitch)+b*Math.cos(pose.pitch);
 return {x:w/2+a*scale,y:h/2-v*scale,z:depth,debugA:a,debugB:b,debugW:w,debugScale:scale,debugYaw:pose.yaw};
}
function draw(canvas,body,showParticles){
 const rect=canvas.getBoundingClientRect(),w=Math.max(230,rect.width||320),h=282,dpr=Math.min(2,window.devicePixelRatio||1);
 canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
 const ctx=canvas.getContext('2d');if(!ctx)return;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 ctx.fillStyle='#0b2032';ctx.fillRect(0,0,w,h);
 const dims=comparison.shape==='cuboid'?[1.36,.85,.87]:[1,1,1];
// Each sample shares the same physical volume scale; keep very small specimens visible.
const largestVolume=Math.max(comparison.left.volume,comparison.right.volume);
const relative=Math.max(0.15,Math.cbrt(body.volume/largestVolume));
const s=Math.min(w/(dims[0]*1.85),h/(dims[1]*1.8))*1.45*relative;
 const v=[];for(let z=0;z<2;z++)for(let y=0;y<2;y++)for(let x=0;x<2;x++)v.push(project(x,y,z,w,h,s,...dims));
 canvas.setAttribute('data-density-debug',JSON.stringify({volume:body.volume,relative,s,dims,first:v[0],last:v[7]}));
 const faces=[[0,1,3,2],[4,5,7,6],[0,1,5,4],[2,3,7,6],[0,2,6,4],[1,3,7,5]].map(p=>({p,depth:p.reduce((s,i)=>s+v[i].z,0)/4})).sort((a,b)=>a.depth-b.depth);
 ctx.fillStyle='rgba(85,157,205,.19)';
 for(const {p} of faces){ctx.beginPath();p.forEach((i,j)=>j?ctx.lineTo(v[i].x,v[i].y):ctx.moveTo(v[i].x,v[i].y));ctx.closePath();ctx.fill();}
 if(showParticles){
  const material=body.material,p=cached[material.id]||(cached[material.id]=engine.particles(material.id));
  const sorted=p.map(a=>({...project(a.x,a.y,a.z,w,h,s,...dims),type:a.type})).sort((a,b)=>a.z-b.z);
  const base=material.color;
  for(const atom of sorted){
   const r=(material.structure==='gas'?6.1:material.structure==='ionic'?6.7:5.8)*Math.min(1,Math.max(.55,relative));
   ctx.beginPath();ctx.arc(atom.x,atom.y,r,0,2*Math.PI);
   ctx.fillStyle=material.structure==='ionic'&&atom.type===1?'#f0b979':base;ctx.globalAlpha=.83+Math.min(.14,(atom.z+1)/9);ctx.fill();ctx.globalAlpha=1;
   ctx.strokeStyle='#072238';ctx.lineWidth=1.25;ctx.stroke();
  }
 }else{
  ctx.fillStyle=body.material.color;ctx.globalAlpha=.28;
  for(const {p} of faces.slice(-3)){ctx.beginPath();p.forEach((i,j)=>j?ctx.lineTo(v[i].x,v[i].y):ctx.moveTo(v[i].x,v[i].y));ctx.closePath();ctx.fill();}
  ctx.globalAlpha=1;
 }
 const edges=[[0,1],[1,3],[3,2],[2,0],[4,5],[5,7],[7,6],[6,4],[0,4],[1,5],[2,6],[3,7]];
 ctx.strokeStyle='#e2f6ff';ctx.lineWidth=2.6;ctx.globalAlpha=1;
 for(const [a,b] of edges){ctx.beginPath();ctx.moveTo(v[a].x,v[a].y);ctx.lineTo(v[b].x,v[b].y);ctx.stroke();}
 ctx.globalAlpha=1;
}
function waterWord(id,s){const state=engine.waterResult(id);return state==='floats'?s.floats:state==='sinks'?s.sinks:state==='dissolves'?s.dissolves:s.notApplicable;}
function render(){
 const s=strings[lang()],p=ui.mode.value==='mass'?'mass':'volume',v=Number(ui.slider.value),a=ui.A.value,b=ui.B.value,shape=ui.shape.value;
 comparison=engine.compute(a,b,p,v,shape);
 const qtyLabel=$( 'densityQuantityLabel' );qtyLabel.textContent=p==='volume'?s.quantityVolume:s.quantityMass;
 ui.display.textContent=number(v,0)+(p==='volume'?' cm³':' g');
 comparison&&[comparison.left,comparison.right].forEach((body,i)=>{
  const d=body.dimensions.map(x=>number(x,2)).join(' × '),info=[
   [s.density,densityString(body.density)],
   [s.materialMass,massString(body.mass)],
   [s.materialVolume,volumeString(body.volume)],
   [s.dimensions,d+' cm'],
   [s.condition,body.material.condition]
  ];
  const result=ui.outputs[i];result.replaceChildren();
  for(const [name,value] of info){const row=document.createElement('div'),a=document.createElement('span'),b=document.createElement('strong');row.className='density-stat';a.textContent=name;b.textContent=value;row.append(a,b);result.append(row);}
  draw(ui.canvases[i],body,ui.particles.checked);
 });
 const explanation=$('densityExplanation');explanation.replaceChildren();
 const heading=document.createElement('strong');heading.textContent=s.formula;explanation.append(heading);
 const p1=document.createElement('p');p1.textContent=p==='volume'?s.eqVolume:s.eqMass;explanation.append(p1);
 const same=Math.abs(comparison.densityRatio-1)<1e-12;
 const denser=comparison.left.density>=comparison.right.density?comparison.left:comparison.right,less=comparison.left.density>=comparison.right.density?comparison.right:comparison.left;
 const ratio=document.createElement('p');ratio.textContent=same?s.equal:denser.material.labels[li()]+' '+number(denser.density/less.density,1)+s.times+less.material.labels[li()]+'.';explanation.append(ratio);
 const note=document.createElement('p');note.className='density-scale-note';note.textContent=s.notScale;explanation.append(note);
 $('densityStructureA').textContent=s.struct[comparison.left.material.structure];
 $('densityStructureB').textContent=s.struct[comparison.right.material.structure];
 $('densityWaterA').textContent=s.water+': '+waterWord(a,s);
 $('densityWaterB').textContent=s.water+': '+waterWord(b,s);
}
function localize(){
 const s=strings[lang()];$('densityTab').textContent=lang()==='hu'?'Sűrűség':lang()==='de'?'Dichte':'Density';
 for(const [id,v] of [
 ['densityTitle',s.title],['densityIntro',s.intro],['densityModeLabel',s.mode],['densityShapeLabel',s.shape],
 ['densityLabelA',s.chooseA],['densityLabelB',s.chooseB],['densityParticlesLabel',s.particles],
 ['densityCompareTitle',s.compare],['densityDragHint',s.drag],['densitySchematic',s.schematic],['densitySource',s.source],
 ['densityStructureTitleA',s.structure],['densityStructureTitleB',s.structure],['densityDisclaimer',s.caveat]
 ])$(id).textContent=v;
 for(const [id,value] of [['densityVolumeOption',s.volume],['densityMassOption',s.mass],['densityCubeOption',s.cube],['densityCuboidOption',s.cuboid],
 ['densityPreset1',s.preset1],['densityPreset2',s.preset2],['densityPreset3',s.preset3],['densityPreset4',s.preset4]])$(id).textContent=value;
 for(const [i,select] of [ui.A,ui.B].entries()){
  const value=select.value;select.replaceChildren();
  for(const material of engine.MATERIALS){const option=document.createElement('option');option.value=material.id;option.textContent=material.labels[li()];select.append(option);}
  select.value=engine.material(value)?value:(i===0?'water':'aluminum');
 }
 ui.canvases.forEach((canvas,i)=>canvas.setAttribute('aria-label',(i===0?s.chooseA:s.chooseB)+' – '+s.drag));
 render();
}
function changedMode(){
 const isMass=ui.mode.value==='mass',oldValue=Number(ui.slider.value);
 ui.slider.min=isMass?'10':'100';ui.slider.max='5000';ui.slider.step=isMass?'10':'100';
 ui.slider.value=isMass?'1000':'1000';render();
}
for(const input of [ui.mode,ui.shape,ui.A,ui.B,ui.particles])input.addEventListener('change',input===ui.mode?changedMode:render);
ui.slider.addEventListener('input',render);
const presets=[['water','ice'],['water','aluminum'],['iron','copper'],['air','water']];
presets.forEach(([a,b],i)=>$('densityPreset'+(i+1)).addEventListener('click',()=>{ui.A.value=a;ui.B.value=b;render();}));
for(const canvas of ui.canvases){
 let dragging=false,lastX=0,lastY=0;
 canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!dragging)return;pose.yaw+=(e.clientX-lastX)*.011;pose.pitch=Math.max(-1.12,Math.min(1.12,pose.pitch+(e.clientY-lastY)*.008));lastX=e.clientX;lastY=e.clientY;render();});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>dragging=false);
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();pose.yaw+=(e.key==='ArrowLeft'?-0.12:e.key==='ArrowRight'?.12:0);pose.pitch=Math.max(-1.12,Math.min(1.12,pose.pitch+(e.key==='ArrowUp'?.12:e.key==='ArrowDown'?-0.12:0)));render();});
}
$('densityTab').addEventListener('click',()=>{
 requestAnimationFrame(()=>{render();requestAnimationFrame(render);});
});
if(typeof ResizeObserver!=='undefined'){
 const observer=new ResizeObserver(()=>{if(!ui.section.classList.contains('hidden'))render();});
 ui.canvases.forEach(canvas=>observer.observe(canvas));
}
window.addEventListener('resize',()=>{if(!ui.section.classList.contains('hidden'))render();});
for(const id of ['hu','de','en'])$(id)?.addEventListener('click',()=>queueMicrotask(localize));
localize();
window.ChemistryDensityLab={render,localize,getComparison:()=>comparison};
})();
