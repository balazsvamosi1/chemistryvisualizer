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
  chooseA:'Első anyag',chooseB:'Második anyag',density:'Sűrűség',materialMass:'Tömeg',materialVolume:'Térfogat',dimensions:'Méretek',condition:'Referenciaállapot',molarMass:'Moláris tömeg (gáz)',groupNames:["Szilárd anyagok","Folyadékok","Gázok"],gasInfo:"A gázoknál 20 °C-on és 1 atmoszféra nyomáson azonos térfogatban közel ugyanannyi részecske található. A sűrűségkülönbség fő oka a részecskék eltérő tömege. A gázok modelljében ezért hasonló számú molekula látszik, nem több „golyó” a nehezebb gázban.",gasCaution:"A gázok sűrűségét közelítő ideálisgáz-modell adja 20 °C-on, 1 atm mellett; a valós gázok kissé eltérhetnek. Az ólom mérgező, a gázok belélegzése veszélyes lehet: a példák kizárólag virtuálisak.",
  formula:'Sűrűség = tömeg / térfogat',meterMass:'A tömegek összehasonlítása',meterVolume:'A térfogatok összehasonlítása',ofLargest:' a nagyobbikhoz viszonyítva',summaryMass:'Azonos térfogat mellett a(z) ',summaryMassEnd:'-szor akkora tömegű, mint a(z) ',summaryVolume:'Azonos tömeg mellett a(z) ',summaryVolumeEnd:'-szor akkora térfogatú, mint a(z) ',summaryEqual:'A két anyag tömege és térfogata megegyezik a kiválasztott összehasonlításban.',eqVolume:'Azonos térfogat mellett a nagyobb sűrűségű anyag nehezebb.',eqMass:'Azonos tömeg mellett a kisebb sűrűségű anyag több helyet foglal.',equal:'A két anyag sűrűsége egyenlő.',times:'-szer akkora a sűrűsége, mint a(z) ',drag:'Forgasd a modellt egérrel vagy ujjal. Billentyűzeten a nyilakkal is lehet forgatni.',notScale:'A testek egymáshoz viszonyított mérete a térfogatkülönbséget mutatja. Nagyon nagy eltérésnél a kisebb test minimális rajzméretet kap; a pontos arányt a sáv és a számok jelzik. A részecskék nem méretarányosak.',
  schematic:'Minden jel sok valódi részecskét képvisel. A jelek száma a tömeggel és térfogattal arányosan változik; a rajzolt méret nem méretarányos. A sűrűséget a részecskék száma ÉS az egyes részecskék tömege határozza meg.',particleMarks:'Részecskejelek',mark:'jel',perMark:'1 jel körülbelül',mol:'mol',singleMass:'Egy részecske tömege',atomicUnit:'u',woodNote:'Fa: a jelek a sejtszerkezetet szemléltetik, nem molekulákat.',minimumNote:'Legalább egy jel látható a nagyon kis mennyiségeknél.',mixedNote:'A gázokat más nagyítással ábrázoljuk: a gáz és a szilárd/folyékony anyag jeleinek száma közvetlenül nem összehasonlítható.',
  source:'Szilárd anyagok: RSC és PubChem referencia-sűrűségek. Gázok: ideálisgáz-számítás (20 °C, 1 atm). A fa sűrűsége nedvességfüggő; itt nincs hőmérséklet- vagy nyomásszimuláció.',
  compare:'Próbáld ki',preset1:'Víz és jég',preset2:'Víz és alumínium',preset3:'Vas és réz',preset4:'Levegő és víz',preset5:"Ólom és alumínium",preset6:"Magnézium és ólom",preset7:"Hélium és szén-dioxid",preset8:"Grafit és gyémánt",preset9:"Hidrogén és kén-hexafluorid",
  structure:'Mit mutat a részecskekép?',struct:{
   fcc:'Egyszerűsített lapközepes köbös (FCC) fémrács: a fématomok rendezett helyeken helyezkednek el.',
   bcc:'Egyszerűsített térközepes köbös (BCC) rács: ilyen a szobahőmérsékletű tiszta vas.',
   ionic:'Váltakozó Na⁺ és Cl⁻ ionokból álló kristályrács szemléltetése; nem különálló NaCl-molekulák.',
   ice:'Nyitott hidrogénkötéses háló szemléltetése. Ezért a jég sűrűsége kisebb a folyékony vízénél.',
   liquid:'Rendezetlen, egymás közelében lévő molekulák. A részecskék valójában folyamatosan mozognak.',
   gas:'Gázmolekulák messze egymástól. A valódi távolságok és a mozgás nem méretarányosak.',
   porous:'Fa: sejtfalak és üregek leegyszerűsített képe. A fa nem egyetlen homogén kristály.',
   hcp:"Hatszöges, szorosan illeszkedő rétegek (HCP) egyszerűsített fémrácsa.",layered:"Grafit: szénatomokból álló rétegek, amelyek között nagyobb a távolság; ez nem molekularács.",diamond:"Gyémánt: háromdimenziós, tetraéderes szénatomháló szemléltetése."
  },
  water:'Vízben',floats:'úszna (átlagos sűrűsége kisebb a vízénél)',sinks:'elsüllyedne (átlagos sűrűsége nagyobb a vízénél)',dissolves:'oldódhat, ezért a süllyedés önmagában nem jó példa',notApplicable:'folyadékra vagy gázra nem ilyen egyszerűen értelmezhető',
  caveat:'Az ábrák oktatási modellek, nem molekuladinamikai szimulációk vagy pontos kristályszerkezeti koordináták.'
 },
 de:{
  title:'Dichte – wie viel steckt im gleichen Raum?',intro:'Vergleiche zwei Stoffe. Ändere die Masse oder das Volumen und sieh dir ein vereinfachtes Modell des inneren Aufbaus an.',
  mode:'Vergleich',volume:'Gleiches Volumen',mass:'Gleiche Masse',shape:'Körperform',cube:'Würfel',cuboid:'Quader',quantityVolume:'Gemeinsames Volumen',quantityMass:'Gemeinsame Masse',particles:'Teilchenmodell anzeigen',
  chooseA:'Erster Stoff',chooseB:'Zweiter Stoff',density:'Dichte',materialMass:'Masse',materialVolume:'Volumen',dimensions:'Abmessungen',condition:'Referenzzustand',molarMass:'Molare Masse (Gas)',groupNames:["Feststoffe","Flüssigkeiten","Gase"],gasInfo:"Bei gleicher Temperatur (20 °C) und gleichem Druck (1 atm) enthalten gleiche Gasvolumina ungefähr gleich viele Teilchen. Unterschiedliche Dichten entstehen vor allem durch unterschiedliche Teilchenmassen. Darum zeigt die Grafik nicht einfach mehr Teilchen im schwereren Gas.",gasCaution:"Gasdichten sind idealisierte Näherungen bei 20 °C und 1 atm; reale Gase können abweichen. Blei ist giftig und das Einatmen von Gasen kann gefährlich sein: nur virtuelle Beispiele.",
  formula:'Dichte = Masse / Volumen',meterMass:'Massen vergleichen',meterVolume:'Volumen vergleichen',ofLargest:' relativ zum größeren Wert',summaryMass:'Bei gleichem Volumen hat ',summaryMassEnd:'-mal so viel Masse wie ',summaryVolume:'Bei gleicher Masse braucht ',summaryVolumeEnd:'-mal so viel Volumen wie ',summaryEqual:'Beide Stoffe haben bei dieser Einstellung die gleiche Masse und das gleiche Volumen.',eqVolume:'Bei gleichem Volumen hat der dichtere Stoff mehr Masse.',eqMass:'Bei gleicher Masse braucht der Stoff mit kleinerer Dichte mehr Platz.',equal:'Die beiden Stoffe haben die gleiche Dichte.',times:'-mal so dicht wie ',
  drag:'Mit Maus oder Finger drehen. Mit den Pfeiltasten geht es ebenfalls.',notScale:'Die Körpergrößen zeigen den Volumenunterschied. Bei sehr großen Unterschieden bleibt der kleinere Körper mindestens sichtbar. Balken und Zahlen zeigen das genaue Verhältnis; Teilchen sind nicht maßstabsgetreu.',
  schematic:'Jedes Symbol steht für sehr viele Teilchen. Die Anzahl der Symbole verändert sich proportional zur Stoffmenge; die Größen sind nicht maßstabsgetreu. Sowohl die Anzahl als auch die Masse der Teilchen bestimmen die Dichte.',particleMarks:'Teilchensymbole',mark:'Symbole',perMark:'1 Symbol entspricht ungefähr',mol:'mol',singleMass:'Masse eines Teilchens',atomicUnit:'u',woodNote:'Holz: Symbole für die Zellstruktur, keine einzelnen Moleküle.',minimumNote:'Mindestens ein Symbol bleibt bei kleinen Mengen sichtbar.',mixedNote:'Gase haben eine andere Vergrößerung: Teilchensymbole für Gas und feste/flüssige Stoffe sind nicht direkt vergleichbar.',
  source:'Feststoffe: RSC/PubChem-Referenzwerte. Gase: ideales Gasgesetz (20 °C, 1 atm). Holzdichte hängt von Holzart und Feuchte ab; keine variable Temperatur- oder Drucksimulation.',
  compare:'Beispiele',preset1:'Wasser und Eis',preset2:'Wasser und Aluminium',preset3:'Eisen und Kupfer',preset4:'Luft und Wasser',preset5:"Blei und Aluminium",preset6:"Magnesium und Blei",preset7:"Helium und Kohlenstoffdioxid",preset8:"Graphit und Diamant",preset9:"Wasserstoff und Schwefelhexafluorid",
  structure:'Was zeigt das Teilchenbild?',struct:{
   fcc:'Vereinfachtes kubisch-flächenzentriertes Metallgitter (FCC) mit regelmäßigen Atompositionen.',
   bcc:'Vereinfachtes kubisch-raumzentriertes Gitter (BCC), wie es reines Eisen bei Raumtemperatur hat.',
   ionic:'Abwechselnde Na⁺- und Cl⁻-Ionen im Kristallgitter; keine einzelnen NaCl-Moleküle.',
   ice:'Schematisches offenes Wasserstoffbrückennetz; Eis ist deshalb weniger dicht als flüssiges Wasser.',
   liquid:'Ungeordnete Moleküle nah beieinander. In Wirklichkeit bewegen sie sich ständig.',
   gas:'Gasmoleküle weit voneinander entfernt; Abstände und Bewegung sind nicht maßstabsgetreu.',
   porous:'Holz: vereinfachte Zellwände und Hohlräume; kein einzelner homogener Kristall.',
   hcp:"Vereinfachte hexagonal dichteste Kugelpackung (HCP) im Metall.",layered:"Graphit: Schichten aus Kohlenstoffatomen mit größeren Abständen zwischen den Schichten; kein Molekülgitter.",diamond:"Diamant: schematisches dreidimensionales tetraedrisches Netz aus Kohlenstoffatomen."
  },
  water:'In Wasser',floats:'würde schwimmen (mittlere Dichte kleiner als Wasser)',sinks:'würde sinken (mittlere Dichte größer als Wasser)',dissolves:'kann sich auflösen, daher ist Sinken kein gutes Beispiel',notApplicable:'für Flüssigkeiten oder Gase nicht so einfach vergleichbar',
  caveat:'Didaktische Modelle, keine Molekulardynamik oder exakten Kristallkoordinaten.'
 },
 en:{
  title:'Density – what fits into the same space?',intro:'Compare two materials. Change mass or volume, then look inside a simplified model of their particle arrangements.',
  mode:'Compare',volume:'Same volume',mass:'Same mass',shape:'Solid shape',cube:'Cube',cuboid:'Rectangular prism',quantityVolume:'Shared volume',quantityMass:'Shared mass',particles:'Show particle structures',
  chooseA:'First material',chooseB:'Second material',density:'Density',materialMass:'Mass',materialVolume:'Volume',dimensions:'Dimensions',condition:'Reference conditions',molarMass:'Molar mass (gas)',groupNames:["Solids","Liquids","Gases"],gasInfo:"At the same temperature (20 °C) and pressure (1 atm), equal volumes of gases contain approximately equal numbers of particles. Their different densities mainly reflect different particle masses, so the heavier gas is not drawn with more particles.",gasCaution:"Gas densities are ideal-gas estimates at 20 °C and 1 atm; real gases differ slightly. Lead is toxic and inhaling gases can be hazardous: virtual examples only.",
  formula:'Density = mass / volume',meterMass:'Compare masses',meterVolume:'Compare volumes',ofLargest:' of the larger value',summaryMass:'With equal volume, ',summaryMassEnd:' times the mass of ',summaryVolume:'With equal mass, ',summaryVolumeEnd:' times the volume of ',summaryEqual:'Both materials have the same mass and volume in this comparison.',eqVolume:'For the same volume, the denser material has more mass.',eqMass:'For the same mass, the less dense material occupies more space.',equal:'These materials have the same density.',times:' times as dense as ',
  drag:'Drag with mouse or finger to rotate; arrow keys also rotate.',notScale:'Relative cube sizes show volume differences. For extreme ratios, the smaller object stays minimally visible. Bars and values give the exact ratio; individual particles are not to scale.',
  schematic:'Each symbol stands for many real particles. Symbol counts change in proportion to the amount of substance; sizes are not to scale. Both the number and mass of particles determine density.',particleMarks:'Particle symbols',mark:'symbols',perMark:'1 symbol represents about',mol:'mol',singleMass:'Mass of one particle',atomicUnit:'u',woodNote:'Wood: symbols depict cell structure, not individual molecules.',minimumNote:'At least one symbol stays visible for tiny quantities.',mixedNote:'Gases use a different magnification: you cannot compare gas symbols directly with solid/liquid symbols.',
  source:'Solids: RSC/PubChem reference densities. Gases: ideal gas law (20 °C, 1 atm). Wood depends on species and moisture; no temperature or pressure changes are simulated.',
  compare:'Try these',preset1:'Water and ice',preset2:'Water and aluminium',preset3:'Iron and copper',preset4:'Air and water',preset5:"Lead and aluminium",preset6:"Magnesium and lead",preset7:"Helium and carbon dioxide",preset8:"Graphite and diamond",preset9:"Hydrogen and sulfur hexafluoride",
  structure:'What does the particle view show?',struct:{
   fcc:'Simplified face-centered cubic (FCC) metal lattice with ordered atomic positions.',
   bcc:'Simplified body-centered cubic (BCC) lattice, as for pure iron at room temperature.',
   ionic:'Alternating Na⁺ and Cl⁻ ions in a crystal lattice, not individual NaCl molecules.',
   ice:'Schematic open hydrogen-bond network. Ice has lower density than liquid water.',
   liquid:'Disordered, closely spaced molecules, which are actually constantly moving.',
   gas:'Widely separated gas molecules; true spacing and movement are not to scale.',
   porous:'Wood: simplified cell walls and voids, not one uniform crystal.',
   hcp:"Simplified hexagonal close-packed (HCP) metal layers.",layered:"Graphite: layered carbon atom networks, with wider spacing between layers; not individual molecules.",diamond:"Diamond: schematic three-dimensional tetrahedral carbon atom network."
  },
  water:'In water',floats:'would float (average density lower than water)',sinks:'would sink (average density higher than water)',dissolves:'may dissolve, so sinking is not a useful comparison',notApplicable:'not as straightforward for liquids or gases',
  caveat:'Teaching illustrations only, not molecular dynamics or exact crystallographic coordinates.'
 }
};
const ui={section:$('densitySection'),mode:$('densityMode'),shape:$('densityShape'),slider:$('densityQuantity'),display:$('densityQuantityValue'),
 A:$('densityMaterialA'),B:$('densityMaterialB'),particles:$('densityParticles'),
 canvases:[$('densityCanvasA'),$('densityCanvasB')],outputs:[$('densityResultA'),$('densityResultB')]};
const pose={yaw:-.58,pitch:.32};let comparison,particleDisplay;
const number=(n,max=2)=>new Intl.NumberFormat(lang()==='de'?'de-DE':lang()==='hu'?'hu-HU':'en-US',{maximumFractionDigits:max}).format(n);
// All material labels and selected values use g/cm³, including small gas densities.
function densityCm3(rho){return number(rho,rho<.0001?8:rho<.01?7:3)+' g/cm³';}
function densityString(rho){return densityCm3(rho)+(rho<.01?' ('+number(rho*1000,3)+' g/L)':'');}
function massString(mass){return mass>=1000?number(mass/1000,3)+' kg':number(mass,3)+' g';}
function volumeString(volume){return volume>=1000000?number(volume/1000000,3)+' m³':volume>=1000?number(volume/1000,3)+' L':number(volume,2)+' cm³';}
function project(x,y,z,w,h,scale,dx,dy,dz){
 x=(x-.5)*dx;y=(y-.5)*dy;z=(z-.5)*dz;
 const a=x*Math.cos(pose.yaw)-z*Math.sin(pose.yaw),b=x*Math.sin(pose.yaw)+z*Math.cos(pose.yaw);
 const v=y*Math.cos(pose.pitch)-b*Math.sin(pose.pitch),depth=y*Math.sin(pose.pitch)+b*Math.cos(pose.pitch);
 return {x:w/2+a*scale,y:h/2-v*scale,z:depth};
}
function draw(canvas,body,showParticles,plan){
 const rect=canvas.getBoundingClientRect(),w=Math.max(230,rect.width||320),h=282,dpr=Math.min(2,window.devicePixelRatio||1);
 canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
 const ctx=canvas.getContext('2d');if(!ctx)return;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 ctx.fillStyle='#0b2032';ctx.fillRect(0,0,w,h);
 const dims=comparison.shape==='cuboid'?[1.36,.85,.87]:[1,1,1];
// Each sample shares the same physical volume scale; keep very small specimens visible.
const largestVolume=Math.max(comparison.left.volume,comparison.right.volume);
const relative=Math.max(0.15,Math.cbrt(body.volume/largestVolume));
// Fixed reference at 1000 g or 1000 cm³ makes the slider visibly resize the specimens.
const sliderScale=Math.cbrt(comparison.quantity/Number(ui.slider.max||5000));
// No clamping at the high end: doubling the displayed volume must always
// enlarge every linear dimension by cubeRoot(2). Maximum slider value fits canvas.
const s=Math.min(w/(dims[0]*1.85),h/(dims[1]*1.8))*1.38*relative*sliderScale;
 const v=[];for(let z=0;z<2;z++)for(let y=0;y<2;y++)for(let x=0;x<2;x++)v.push(project(x,y,z,w,h,s,...dims));
 const faces=[[0,1,3,2],[4,5,7,6],[0,1,5,4],[2,3,7,6],[0,2,6,4],[1,3,7,5]].map(p=>({p,depth:p.reduce((s,i)=>s+v[i].z,0)/4})).sort((a,b)=>a.depth-b.depth);
 ctx.fillStyle='rgba(85,157,205,.19)';
 for(const {p} of faces){ctx.beginPath();p.forEach((i,j)=>j?ctx.lineTo(v[i].x,v[i].y):ctx.moveTo(v[i].x,v[i].y));ctx.closePath();ctx.fill();}
 if(showParticles){
  const material=body.material,p=engine.particleMarkers(material.id,plan.count);
  const sorted=p.map(a=>({...project(a.x,a.y,a.z,w,h,s,...dims),type:a.type})).sort((a,b)=>a.z-b.z);
  const base=material.color;
  for(const atom of sorted){
   const r=(material.structure==='gas'?5.0:material.structure==='ionic'?6.7:5.8)*Math.min(1,Math.max(.55,relative));
   if(material.structure==='gas'){
    // Molecular icons are schematic; each point represents one molecule, not one atom.
    const n=material.atoms||1;
    const dots=n===1?[[0,0]]:n===2?[[-3,0],[3,0]]:n===3?[[-5,0],[0,0],[5,0]]:
      n===5?[[0,0],[-4,-4],[4,-4],[-4,4],[4,4]]:
      [[0,0],[-6,0],[6,0],[0,-6],[0,6],[-4,-4],[4,4]];
    for(const [dx,dy] of dots){
     ctx.beginPath();ctx.arc(atom.x+dx,atom.y+dy,n===1?r:r*.58,0,2*Math.PI);
     ctx.fillStyle=base;ctx.globalAlpha=.9;ctx.fill();ctx.globalAlpha=1;
     ctx.strokeStyle='#072238';ctx.lineWidth=.75;ctx.stroke();
    }
    continue;
   }
   if(material.id==='water'||material.id==='ice'){
    // One symbol depicts one H2O molecule, with two H lobes and one O centre.
    ctx.beginPath();ctx.arc(atom.x-3,atom.y+3,Math.max(1.5,r*.36),0,2*Math.PI);
    ctx.arc(atom.x+3,atom.y+3,Math.max(1.5,r*.36),0,2*Math.PI);
    ctx.fillStyle='#f7f8fa';ctx.fill();
    ctx.beginPath();ctx.arc(atom.x,atom.y,r*.72,0,2*Math.PI);
    ctx.fillStyle=base;ctx.fill();ctx.strokeStyle='#072238';ctx.lineWidth=.8;ctx.stroke();
    continue;
   }
   if(material.structure==='ionic'){
    // One symbol represents a NaCl formula unit: paired Na+ and Cl- ions.
    ctx.beginPath();ctx.arc(atom.x-2.8,atom.y,r*.62,0,2*Math.PI);
    ctx.fillStyle='#96caed';ctx.fill();
    ctx.beginPath();ctx.arc(atom.x+2.8,atom.y,r*.78,0,2*Math.PI);
    ctx.fillStyle='#f0b979';ctx.fill();
    ctx.strokeStyle='#072238';ctx.lineWidth=.8;ctx.stroke();
    continue;
   }
   ctx.beginPath();ctx.arc(atom.x,atom.y,r,0,2*Math.PI);
   ctx.fillStyle=base;ctx.globalAlpha=.83+Math.min(.14,(atom.z+1)/9);ctx.fill();ctx.globalAlpha=1;
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
 particleDisplay=engine.particlePlan(comparison);
 const qtyLabel=$( 'densityQuantityLabel' );qtyLabel.textContent=p==='volume'?s.quantityVolume:s.quantityMass;
 const volumes=[comparison.left.volume,comparison.right.volume],masses=[comparison.left.mass,comparison.right.mass];
 const values=p==='volume'?masses:volumes,maxValue=Math.max(...values),minValue=Math.min(...values);
 const larger=values[0]>=values[1]?comparison.left:comparison.right;
 const smaller=values[0]>=values[1]?comparison.right:comparison.left;
 const comparisonRatio=maxValue/minValue;
 const headline=$('densityComparisonLead');
 headline.textContent=Math.abs(comparisonRatio-1)<1e-10?s.summaryEqual:
   (p==='volume'?s.summaryMass:s.summaryVolume)+larger.material.labels[li()]+' '+number(comparisonRatio,2)+
   (p==='volume'?s.summaryMassEnd:s.summaryVolumeEnd)+smaller.material.labels[li()]+'.';
 ui.display.textContent=number(v,0)+(p==='volume'?' cm³':' g');
 comparison&&[comparison.left,comparison.right].forEach((body,i)=>{
  const d=body.dimensions.map(x=>number(x,2)).join(' × '),info=[
   [s.density,densityString(body.density)],
   [s.materialMass,massString(body.mass)],
   [s.materialVolume,volumeString(body.volume)],
   [s.dimensions,d+' cm'],
   [s.condition,body.material.condition]
  ];
  if(body.material.phase==='gas'&&Number.isFinite(body.material.molarMass))
   info.push([s.molarMass,number(body.material.molarMass,3)+' g/mol']);
  // Keep a constant density visible next to the chosen material, independent
  // of the mass/volume slider. It is also present in every dropdown option.
  $('densitySelected'+(i===0?'A':'B')).textContent='ρ = '+densityCm3(body.density);
  const result=ui.outputs[i];result.replaceChildren();
  for(const [name,value] of info){const row=document.createElement('div'),a=document.createElement('span'),b=document.createElement('strong');row.className='density-stat';a.textContent=name;b.textContent=value;row.append(a,b);result.append(row);}
  // A bar of equal full width represents the larger sample's mass or volume.
  // This is not an atom-count visualization: chemical identity and packing both matter.
  const tag=i===0?'A':'B',measured=values[i],fraction=measured/maxValue,percent=fraction*100;
  $('densityMeterTitle'+tag).textContent=p==='volume'?s.meterMass:s.meterVolume;
  const fill=$('densityMeterFill'+tag);
  fill.style.width=Math.max(.8,percent).toFixed(3)+'%';
  fill.style.backgroundColor=body.material.color;
  fill.setAttribute('aria-valuenow',percent.toFixed(2));
  $('densityMeterValue'+tag).textContent=(p==='volume'?massString(body.mass):volumeString(body.volume))+' · '+number(percent,2)+'%'+s.ofLargest;
  const specimen=i===0?particleDisplay.left:particleDisplay.right;
  const markerInfo=$('densityParticleInfo'+tag);
  const details=specimen.category==='structure'?
    s.woodNote:
    s.perMark+' '+number(specimen.perMarker,specimen.perMarker<.01?5:3)+' '+s.mol+
    ' · '+s.singleMass+': '+number(body.material.molarMass,3)+' '+s.atomicUnit;
  markerInfo.textContent=s.particleMarks+': '+specimen.count+' '+s.mark+' · '+details+
    (specimen.approximate?' · '+s.minimumNote:'');
  markerInfo.setAttribute('data-markers',String(specimen.count));
  draw(ui.canvases[i],body,ui.particles.checked,specimen);
 });
 const explanation=$('densityExplanation');explanation.replaceChildren();
 const heading=document.createElement('strong');heading.textContent=s.formula;explanation.append(heading);
 const p1=document.createElement('p');p1.textContent=p==='volume'?s.eqVolume:s.eqMass;explanation.append(p1);
 const same=Math.abs(comparison.densityRatio-1)<1e-12;
 const denser=comparison.left.density>=comparison.right.density?comparison.left:comparison.right,less=comparison.left.density>=comparison.right.density?comparison.right:comparison.left;
 const ratio=document.createElement('p');ratio.textContent=same?s.equal:denser.material.labels[li()]+' '+number(denser.density/less.density,1)+s.times+less.material.labels[li()]+'.';explanation.append(ratio);
 const note=document.createElement('p');note.className='density-scale-note';note.textContent=s.notScale;explanation.append(note);
 if(particleDisplay.left.category!==particleDisplay.right.category){
  const warning=document.createElement('p');warning.className='density-scale-note';warning.textContent=s.mixedNote;
  explanation.append(warning);
 }
 if(comparison.left.material.phase==='gas'||comparison.right.material.phase==='gas'){
  const gasNote=document.createElement('p');gasNote.className='density-gas-note';gasNote.textContent=s.gasInfo;explanation.append(gasNote);
 }
 const caution=document.getElementById('densityCaution');
 if(caution)caution.textContent=s.gasCaution;
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
 ...Array.from({length:9},(_,i)=>['densityPreset'+(i+1),s['preset'+(i+1)]])])$(id).textContent=value;
 for(const [i,select] of [ui.A,ui.B].entries()){
  const value=select.value;select.replaceChildren();
  // School-friendly grouping keeps a 27-material catalogue easy to browse.
  for(const [groupIndex,phase] of ['solid','liquid','gas'].entries()){
   const group=document.createElement('optgroup');
   group.label=s.groupNames[groupIndex];
   for(const material of engine.MATERIALS.filter(m=>m.phase===phase)){
    const option=document.createElement('option');
    option.value=material.id;option.textContent=material.labels[li()]+' · ρ = '+densityCm3(material.rho);
    group.append(option);
   }
   select.append(group);
  }
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
const presets=[['water','ice'],['water','aluminum'],['iron','copper'],['air','water'],['lead','aluminum'],['magnesium','lead'],['helium','carbonDioxide'],['graphite','diamond'],['hydrogen','sulfurHexafluoride']];
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
