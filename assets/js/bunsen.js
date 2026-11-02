/* Chemistry Lab: Bunsen burner and flame tests, educational model. Apache-2.0. */
(function(root,factory){
 const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.BunsenScience=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const samples={
 none:{hex:'#6cbbff',intensity:0,nm:null,kind:'base',hu:'Nincs minta',de:'Keine Probe',en:'No sample'},
 Li:{hex:'#f1254a',intensity:.92,nm:670.8,hu:'Lítium',de:'Lithium',en:'Lithium'},
 Na:{hex:'#ffe020',intensity:1,nm:589.3,hu:'Nátrium',de:'Natrium',en:'Sodium'},
 K:{hex:'#c68dff',intensity:.58,nm:404.4,hu:'Kálium',de:'Kalium',en:'Potassium'},
 Rb:{hex:'#d355b5',intensity:.75,nm:420.2,hu:'Rubídium',de:'Rubidium',en:'Rubidium'},
 Cs:{hex:'#7988ff',intensity:.8,nm:455.5,hu:'Cézium',de:'Cäsium',en:'Caesium'},
 Ca:{hex:'#ff6534',intensity:.85,nm:622,hu:'Kalcium',de:'Calcium',en:'Calcium'},
 Sr:{hex:'#ed2340',intensity:.92,nm:606,hu:'Stroncium',de:'Strontium',en:'Strontium'},
 Ba:{hex:'#9ee64c',intensity:.82,nm:524,hu:'Bárium',de:'Barium',en:'Barium'},
 Cu:{hex:'#10dfb3',intensity:.84,nm:null,hu:'Réz',de:'Kupfer',en:'Copper'},
 B:{hex:'#41ee67',intensity:.85,nm:null,kind:'compound',hu:'Bór (borát)',de:'Bor (Borat)',en:'Boron (borate)'},
 In:{hex:'#627aff',intensity:.76,nm:451,hu:'Indium',de:'Indium',en:'Indium'},
 Zn:{hex:'#b5f6cb',intensity:.5,nm:null,kind:'faint',hu:'Cink (gyenge)',de:'Zink (schwach)',en:'Zinc (faint)'},
 Mg:{hex:'#ffffff',intensity:1,nm:null,kind:'combustion',hu:'Magnézium égése',de:'Magnesiumverbrennung',en:'Burning magnesium'},
 Al:{hex:'#f6faff',intensity:.93,nm:null,kind:'combustion',hu:'Alumínium égése',de:'Aluminiumverbrennung',en:'Burning aluminium'},
 Fe:{hex:'#f8bd57',intensity:.92,nm:null,kind:'sparks',hu:'Vas szikrái',de:'Eisenfunken',en:'Iron sparks'}
 };
 const equations={
 none:{type:'base',lines:['CH₄ + 2 O₂ → CO₂ + 2 H₂O'],explain:{hu:'Egyszerűsített példa földgázra: a metán teljes égése. A tényleges égőgáz összetétele eltérhet.',de:'Vereinfachtes Erdgasbeispiel: vollständige Methanverbrennung. Das tatsächliche Brenngas kann anders zusammengesetzt sein.',en:'Simplified natural gas example: complete combustion of methane. Actual burner fuel may differ.'}},
 Mg:{type:'combustion',lines:['2 Mg + O₂ → 2 MgO']},
 Al:{type:'combustion',lines:['4 Al + 3 O₂ → 2 Al₂O₃']},
 Fe:{type:'combustion',lines:['3 Fe + 2 O₂ → Fe₃O₄'],explain:{hu:'Egyszerűsített termékmodell; vas égésekor többféle oxid is keletkezhet.',de:'Vereinfachtes Produktmodell; bei der Eisenverbrennung können verschiedene Oxide entstehen.',en:'Simplified product model; burning iron can produce several different oxides.'}},
 B:{type:'compound',lines:['B-tartalmú részecske + energia → gerjesztett részecske','Gerjesztett részecske → alapállapotú részecske + hν'],explain:{hu:'A zöld emissziót egyes bórtartalmú gázfázisú specieszek okozzák; nem egyszerűen szabad B-atomok.',de:'Die grüne Emission stammt von bestimmten borhaltigen Gasphasenspezies, nicht einfach von freien Boratomen.',en:'Green emission arises from particular boron-containing gas-phase species, not simply free boron atoms.'}}
 };
 for(const id of ['Li','Na','K','Rb','Cs','Ca','Sr','Ba','Cu','In','Zn']){
  const nm=samples[id].nm;
  equations[id]={type:'emission',lines:[id+' + energia → '+id+'*',id+'* → '+id+' + hν'+(nm?' (≈ '+nm+' nm)':'')],explain:{
   hu:'Sematikus gerjesztési és fénykibocsátási egyenlet: nem égési vagy sztöchiometriai reakció. A sókból képződő fényt kibocsátó részecskék összetétele változhat.',
   de:'Schematische Anregungs- und Emissionsgleichung, keine Verbrennungs- oder stöchiometrische Reaktion. Die emittierenden Spezies aus Salzen können variieren.',
   en:'Schematic excitation and light-emission equations, not combustion or stoichiometric reactions. Emitting species formed from salts can vary.'
  }};
 }
 function appearance({gas=false,air=50,sample='none'}={}){
  const airLevel=Math.max(0,Math.min(100,Number(air)||0));
  const key=Object.hasOwn(samples,sample)?sample:'none',s=samples[key],burning=s.kind==='combustion',sparks=s.kind==='sparks';
  if(!gas)return{lit:false,mode:'off',color:'#465464',inner:'#465464',height:0,width:0,glow:0,sparks:false,sample:key,air:airLevel};
  const luminous=airLevel<38,airFraction=airLevel/100;
  // The collar controls geometry and combustion characteristics continuously.
  const height=Math.round(105+69*airFraction);
  const width=Math.round(47-25*airFraction);
  const base=luminous?'#ffbe29':'#408fff',inner=luminous?'#ffec91':'#b5eaff';
  const special=key!=='none';
  return{lit:true,mode:luminous?'luminous':'nonluminous',color:(burning||sparks)?base:special?s.hex:base,
   inner:(burning||sparks)?inner:special?(luminous?'#ffdd8a':'#c2eaff'):inner,
   height,width,
   glow:(burning||sparks)?(luminous?.68:.23):special?(.40+.52*s.intensity):(luminous?.68:.23),
   sparks:burning||sparks,sample:key,air:airLevel,kind:s.kind||'flame'};
 }
 return Object.freeze({samples,equations,appearance});
});
(function(){
 'use strict';
 if(typeof document==='undefined')return;
 const $=id=>document.getElementById(id),tab=$('bunsenTab'),section=$('bunsenSection');
 if(!tab||!section||!window.BunsenScience)return;
 const science=window.BunsenScience;
 const labels={
 hu:{title:'Bunsen-égő és lángfestés',intro:'Ismerd meg az égő részeit, majd vizsgáld meg a fémionok jellegzetes lángszíneit.',gas:'Gázcsap',air:'Levegőszabályozó gyűrű',sample:'Vizsgált anyag / elem',off:'Elzárva',on:'Nyitva',mode:'Láng típusa',bright:'Világító, sárgás láng – kevés levegő',blue:'Nem világító, kék láng – több levegő',unlit:'Nincs láng',color:'Megfigyelhető lángszín',note:'Oktatási szimuláció: nem vegyszereket égetünk el. A színpróbában jellemzően fémsók gerjesztett atomjai/ionjai bocsátanak ki fényt. A láng színe és intenzitása koncentrációtól, hőmérséklettől, aniontól és szennyeződéstől is függ. A nátrium nyomnyi jelenléte elfedhet más színeket.',parts:'Az égő részei',tube:'Égőcső',collar:'Állítható levegőgyűrű',holes:'Levegőnyílások',inlet:'Gázbevezető csonk',base:'Talp',tip:'Lángzónák: a kék láng belső kúpja kevésbé oxidáló, a külső zónában több az oxigén. A láng tényleges méretét a gázáramlás is befolyásolja; az alak szemléltető.',noSample:'Alapláng',wavelength:'Jellemző spektrumvonal'},
 de:{title:'Bunsenbrenner und Flammenfärbung',intro:'Lerne die Teile des Brenners kennen und untersuche typische Flammenfarben von Metallionen.',gas:'Gashahn',air:'Luftregulierring',sample:'Probe / Element',off:'Geschlossen',on:'Geöffnet',mode:'Flammenart',bright:'Leuchtende gelbliche Flamme – wenig Luft',blue:'Nichtleuchtende blaue Flamme – mehr Luft',unlit:'Keine Flamme',color:'Beobachtete Flammenfarbe',note:'Didaktische Simulation: Es werden keine Chemikalien verbrannt. Bei der Flammenprobe emittieren angeregte Atome/Ionen aus Metallsalzen Licht. Farbe und Intensität hängen auch von Konzentration, Temperatur, Anion und Verunreinigungen ab. Schon Natriumspuren können andere Farben überdecken.',parts:'Teile des Brenners',tube:'Brennerrohr',collar:'Verstellbarer Luftregulierring',holes:'Luftöffnungen',inlet:'Gasanschluss',base:'Standfuß',tip:'Flammenzonen: Der innere Kegel ist weniger oxidierend, außen ist mehr Sauerstoff verfügbar. Die tatsächliche Flammengröße hängt auch vom Gasdurchfluss ab; die Darstellung ist schematisch.',noSample:'Grundflamme',wavelength:'Typische Spektrallinie'},
 en:{title:'Bunsen Burner and Flame Tests',intro:'Explore the burner components and observe characteristic flame-test colours of metal ions.',gas:'Gas valve',air:'Adjustable air collar',sample:'Sample / element',off:'Closed',on:'Open',mode:'Flame type',bright:'Luminous yellowish flame – low air supply',blue:'Non-luminous blue flame – greater air supply',unlit:'No flame',color:'Observed flame colour',note:'Educational simulation: no chemicals are actually burned. In flame tests, excited atoms/ions from metal salts emit light. Colour and intensity also depend on concentration, temperature, counterion and contamination. Trace sodium can mask other colours.',parts:'Burner parts',tube:'Barrel',collar:'Adjustable collar',holes:'Air holes',inlet:'Gas inlet',base:'Base',tip:'Flame zones: the inner cone is less oxidizing, while the outer region has more oxygen. Actual flame size also depends on gas flow; the shape is illustrative.',noSample:'Base flame',wavelength:'Characteristic spectral line'}
 };
 const sampleNotes={
 hu:{normal:'A színpróba egy kiválasztott vegyület közelítő emissziós színe; a mintát rendszerint tiszta, kék lángban vizsgálják.',compound:'Bórvegyületek (például borátok) zöld emissziója; a szín a vegyület típusától függ.',faint:'Cinknél a lángszín gyakran gyenge, nehezen különíthető el.',combustion:'Ez NEM hagyományos lángfestési próba: a fém égése rendkívül intenzív, széles spektrumú fehér fényt ad. Az égő magnéziumba nem szabad közvetlenül belenézni.',sparks:'Ez NEM szokványos fémion-lángfestés: a fémszemcsék izzása és oxidációja sárgás-narancs szikrákat eredményez.'},
 de:{normal:'Die Flammenprobe zeigt näherungsweise die Emission einer ausgewählten Verbindung; gewöhnlich wird in der sauberen blauen Flamme geprüft.',compound:'Borverbindungen (etwa Borate) emittieren grün; die Farbe hängt von der Verbindung ab.',faint:'Bei Zink ist die Flammenfärbung häufig schwach und schwer zu erkennen.',combustion:'KEINE klassische Flammenprobe: Das verbrennende Metall emittiert sehr intensives, breitbandiges weißes Licht. Nicht direkt in brennendes Magnesium blicken.',sparks:'KEINE übliche Ionen-Flammenprobe: Glühende und oxidierende Metallpartikel erzeugen gelb-orange Funken.'},
 en:{normal:'The flame test approximates emission from a selected compound; tests are generally performed in a clean blue flame.',compound:'Boron compounds (such as borates) give green emission; colour depends on the compound.',faint:'Zinc flame colour is often faint and difficult to distinguish.',combustion:'NOT a conventional flame test: burning metal emits extremely intense broadband white light. Do not look directly at burning magnesium.',sparks:'NOT a conventional metal-ion flame test: incandescent oxidizing metal particles produce yellow-orange sparks.'}
 };
 const equationLabels={
 hu:{equationTitle:'Kapcsolódó kémiai egyenlet',combustionType:'Égés / oxidáció',emissionType:'Gerjesztés és fénykibocsátás',compoundType:'Vegyület emissziója',fuelType:'Alapláng – gáz égése',combustionInfo:'Ez valódi kémiai átalakulás; a fém és az oxigén oxidot képez.',emissionInfo:'A színpróbánál az energiafelvételt és a fénykibocsátást szemléltetjük, nem kémiai égést.'},
 de:{equationTitle:'Zugehörige chemische Gleichung',combustionType:'Verbrennung / Oxidation',emissionType:'Anregung und Lichtemission',compoundType:'Emission einer Verbindung',fuelType:'Grundflamme – Brenngasverbrennung',combustionInfo:'Dies ist eine chemische Reaktion: Metall und Sauerstoff bilden ein Oxid.',emissionInfo:'Bei der Flammenprobe geht es um Anregung und Lichtemission, nicht um Verbrennung.'},
 en:{equationTitle:'Related chemical equation',combustionType:'Combustion / oxidation',emissionType:'Excitation and light emission',compoundType:'Emission from a compound',fuelType:'Base flame – fuel combustion',combustionInfo:'This is a chemical reaction: metal and oxygen form an oxide.',emissionInfo:'Flame tests illustrate excitation and photon emission, not combustion.'}
 };
 const partDetails={
 hu:{tube:'Az égőcsőben a gáz és a beáramló levegő keveréke felfelé halad.',collar:'A forgatható gyűrű szabályozza, mennyi levegő jut az égőcsőbe.',holes:'A levegőnyílásokon keresztül jut be az égéshez szükséges oxigént tartalmazó levegő.',inlet:'A gázbevezető csonk csatlakozik a gázellátáshoz.',base:'A nehéz talp tartja stabilan az égőt.'},
 de:{tube:'Im Brennerrohr strömt das Gemisch aus Gas und zugeführter Luft nach oben.',collar:'Der drehbare Ring regelt die Luftzufuhr in das Brennerrohr.',holes:'Durch die Luftöffnungen strömt sauerstoffhaltige Luft ein.',inlet:'Der Gasanschluss verbindet den Brenner mit der Gasversorgung.',base:'Der schwere Standfuß sorgt für Stabilität.'},
 en:{tube:'The gas and incoming air mixture travels upward through the barrel.',collar:'Rotating the collar adjusts how much air enters the burner.',holes:'Oxygen-containing air enters through these openings.',inlet:'The gas inlet connects the burner to its gas supply.',base:'The heavy base keeps the burner upright.'}
 };
 const state={gas:false,air:60,sample:'none'};let selectedPart='tube';
 const lang=()=>['hu','de','en'].find(id=>$(id)?.classList.contains('active'))||'hu';
 const tr=k=>labels[lang()][k]||k;
 function update(){
  const a=science.appearance(state),svg=$('bunsenSvg');
  $('bunsenGas').textContent=tr('gas')+': '+tr(state.gas?'on':'off');
  $('bunsenAirLabel').textContent=tr('air')+': '+state.air+'%';
  $('bunsenSampleLabel').textContent=tr('sample');
  $('bunsenHeading').textContent=tr('title');$('bunsenIntro').textContent=tr('intro');
  $('bunsenPartsHeading').textContent=tr('parts');$('bunsenNote').textContent=tr('note');$('bunsenZone').textContent=tr('tip');
  for(const name of ['tube','collar','holes','inlet','base']){const item=$('bunsenPart'+name);item.textContent=tr(name);item.style.fontWeight=selectedPart===name?'bold':'normal';item.style.cursor='pointer';item.setAttribute('tabindex','0');item.setAttribute('role','button');item.setAttribute('aria-pressed',String(selectedPart===name));} $('bunsenPartDetail').textContent=partDetails[lang()][selectedPart];
  const opts=$('bunsenSample').options;
  for(const option of opts){option.textContent=science.samples[option.value]?.[lang()]||option.value}
  $('bunsenMode').textContent=tr('mode')+': '+tr(!a.lit?'unlit':a.mode==='luminous'?'bright':'blue');
  $('bunsenColour').textContent=tr('color')+': '+(state.sample==='none'?tr('noSample'):science.samples[state.sample][lang()]);
  const line=science.samples[state.sample]?.nm;
  $('bunsenSpectrum').textContent=line?tr('wavelength')+': ≈ '+line+' nm':'';
  // The two visible ports open progressively as the collar rotates.
  // SVG is a frontal projection of a cylindrical ring: the moving ticks and
  // shutters illustrate rotation rather than claiming a literal 3D cutaway.
  const openness=Math.max(0,Math.min(1,state.air/100));
  const shift=openness*11;
  $('bunsenAirShutterLeft')?.setAttribute('transform',`translate(${-shift} 0)`);
  $('bunsenAirShutterRight')?.setAttribute('transform',`translate(${shift} 0)`);
  $('bunsenCollarMarkings')?.setAttribute('transform',`translate(${(openness-.5)*11} 0)`);
  $('bunsenCollarIndicator')?.setAttribute('transform',`translate(${openness*34} 0)`);
    const outer=$('bunsenFlameOuter'),inner=$('bunsenFlameInner');
  const tipY=195-a.height,half=a.width,baseY=199,center=218;
  // Dynamic paths: broad turbulent yellow safety flame vs narrow pointed blue flame.
  outer.setAttribute('d',`M ${center},${tipY} C ${center-half*.42},${tipY+a.height*.28} ${center-half*1.15},${tipY+a.height*.61} ${center-half},${baseY-21} Q ${center-half*.9},${baseY+8} ${center},${baseY+6} Q ${center+half*.9},${baseY+8} ${center+half},${baseY-21} C ${center+half*1.15},${tipY+a.height*.60} ${center+half*.42},${tipY+a.height*.28} ${center},${tipY} Z`);
  const innerH=Math.round(a.height*(a.mode==='nonluminous'?.53:.29)),innerW=Math.round(half*(a.mode==='nonluminous'?.68:.72));
  inner.setAttribute('d',`M ${center},${baseY-innerH} Q ${center-innerW*.8},${baseY-innerH*.65} ${center-innerW},${baseY-10} Q ${center},${baseY+4} ${center+innerW},${baseY-10} Q ${center+innerW*.8},${baseY-innerH*.65} ${center},${baseY-innerH} Z`);
  outer.setAttribute('fill',a.color);inner.setAttribute('fill',a.inner);
  outer.style.opacity=a.lit?'1':'0';inner.style.opacity=a.lit?(a.mode==='luminous'?'0.75':'0.95'):'0';
  const glow=$('bunsenDynamicGlow');if(glow){glow.setAttribute('fill',a.color);glow.style.opacity=a.lit?String(a.glow):'0';glow.setAttribute('ry',String(a.height*.78));glow.setAttribute('cy',String(baseY-a.height*.47))}
  const sparks=$('bunsenSparks');if(sparks)sparks.style.display=a.lit&&a.sparks?'':'none';
  const metalGlow=$('bunsenMetalGlow'),metalFlame=$('bunsenMetalFlame'),metalSample=$('bunsenMetalSample');
  const separate=a.lit&&['Mg','Al','Fe'].includes(state.sample);
  if(metalGlow)metalGlow.style.display=separate?'':'none';
  if(metalFlame){metalFlame.style.display=separate?'':'none';metalFlame.setAttribute('fill',state.sample==='Fe'?'#ffba55':state.sample==='Mg'?'#ffffff':'#f0f5ff')}
  if(metalSample)metalSample.style.display=separate?'':'none';
  const warning=$('bunsenSampleNote');if(warning)warning.textContent=sampleNotes[lang()][a.kind==='combustion'?'combustion':a.kind==='sparks'?'sparks':a.kind==='compound'?'compound':a.kind==='faint'?'faint':'normal'];
  const equation=science.equations[state.sample]||science.equations.none;
  $('bunsenEquationTitle').textContent=equationLabels[lang()].equationTitle;
  $('bunsenEquationType').textContent=equationLabels[lang()][equation.type==='combustion'?'combustionType':equation.type==='base'?'fuelType':equation.type==='compound'?'compoundType':'emissionType'];
  $('bunsenEquations').replaceChildren();
  for(const line of equation.lines){const item=document.createElement('div');item.textContent=line;$('bunsenEquations').append(item)}
  $('bunsenEquationNote').textContent=equation.explain?.[lang()]||equationLabels[lang()][equation.type==='combustion'?'combustionInfo':'emissionInfo'];
  svg.classList.toggle('bunsen-burning',a.lit);
  svg.classList.toggle('bunsen-metal',a.lit&&a.sparks);
  svg.setAttribute('aria-label',tr('title'));
 }
 const open=()=>{document.querySelectorAll('main > section').forEach(n=>n.classList.add('hidden'));document.querySelectorAll('.tabs > button').forEach(n=>n.classList.remove('active'));section.classList.remove('hidden');tab.classList.add('active');update()};
 tab.addEventListener('click',open);
 $('bunsenGas').addEventListener('click',()=>{state.gas=!state.gas;update()});
 $('bunsenAir').addEventListener('input',e=>{state.air=Number(e.target.value);update()});
 $('bunsenSample').addEventListener('change',e=>{state.sample=e.target.value;update()});
 ['hu','de','en'].forEach(id=>$(id)?.addEventListener('click',()=>update()));
 for(const name of ['tube','collar','holes','inlet','base']){const item=$('bunsenPart'+name);const select=()=>{selectedPart=name;update()};item.addEventListener('click',select);item.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select()}})}
 Object.keys(science.samples).forEach(key=>{const option=document.createElement('option');option.value=key;$('bunsenSample').append(option)});
 $('bunsenAir').value=state.air;$('bunsenSample').value=state.sample;update();
})();
