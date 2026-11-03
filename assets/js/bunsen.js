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
 const emissionData={
 Li:{emitter:'Li (atom)',lines:[670.8],note:{hu:'A vörös 670,8 nm-es Li-atomvonal jellegzetes.',de:'Die rote Li-Atomlinie bei 670,8 nm ist charakteristisch.',en:'The red 670.8 nm Li atomic line is characteristic.'}},
 Na:{emitter:'Na (atom)',lines:[589.0,589.6],note:{hu:'A nátrium erős sárga D-kettőse; a nyomnyi nátrium is elfedhet más lángszíneket.',de:'Das starke gelbe Natrium-D-Dublett; selbst Spuren können andere Farben überdecken.',en:'The intense yellow sodium D doublet; traces can mask other flame colours.'}},
 K:{emitter:'K (atom)',lines:[404.4,766.5,769.9],note:{hu:'A 404,4 nm-es ibolya vonal látható; a 766,5 és 769,9 nm-es vonalak a látható vörös szélén/közeli infravörösben vannak, nem ezek adják közvetlenül a lila szín teljes magyarázatát.',de:'404,4 nm liegt im Violett. Die Linien bei 766,5 und 769,9 nm liegen am Rand des sichtbaren Rots/im nahen Infrarot; sie erklären die Gesamtfarbe nicht allein.',en:'404.4 nm lies in violet; the strong 766.5 and 769.9 nm lines are at the edge of visible red/in the near infrared and do not alone explain the observed lilac colour.'}},
 Rb:{emitter:'Rb (atom)',lines:[420.2],note:{hu:'Példa látható rubídium-atomvonalra; a láng több vonalat bocsát ki.',de:'Beispiel einer sichtbaren Rubidium-Atomlinie; das Flammenspektrum enthält weitere Linien.',en:'Example visible rubidium atomic line; the flame emits multiple lines.'}},
 Cs:{emitter:'Cs (atom)',lines:[455.5],note:{hu:'Példa látható cézium-atomvonalra, nem teljes színmodell.',de:'Beispiel einer sichtbaren Cäsium-Atomlinie, kein vollständiges Farbmodell.',en:'Example visible caesium atomic line, not a complete colour model.'}},
 Ca:{emitter:'Ca / CaOH (atom és molekuláris komponensek)',lines:[643.9,646.3,649.4],note:{hu:'A kalciumatom vörös vonalai mellett CaOH molekuláris emisszió is hozzájárulhat a narancsvörös lánghoz.',de:'Neben roten Ca-Atomlinien kann die molekulare Emission von CaOH zur orangeroten Flamme beitragen.',en:'Alongside red Ca atomic lines, molecular CaOH emission may contribute to the orange-red flame.'}},
 Sr:{emitter:'Sr / SrOH (atom és molekuláris komponensek)',lines:[640.8,650.4,661.7],note:{hu:'Több stroncium-atomvonal és molekuláris emisszió is közrejátszhat.',de:'Mehrere Sr-Atomlinien und molekulare Emissionen können zur Farbe beitragen.',en:'Multiple Sr atomic lines and molecular emission may contribute to the colour.'}},
 Ba:{emitter:'Ba⁺ / Ba-tartalmú molekulák',lines:[455.4,493.4],note:{hu:'A Ba⁺ kék spektrumvonalai nem magyarázzák önmagukban a sárgászöld lángot; a vegyületfüggő molekuláris emisszió is fontos.',de:'Die blauen Ba⁺-Linien erklären die gelbgrüne Flamme nicht allein; verbindungsabhängige molekulare Emissionen sind wichtig.',en:'Blue Ba⁺ lines do not alone explain the yellow-green flame; compound-dependent molecular emission matters.'}},
 Cu:{emitter:'Cu / CuCl és más rézvegyületek',lines:[510.6,515.3,521.8],note:{hu:'A réz színe erősen vegyületfüggő; CuCl és más rézvegyületek molekuláris emissziója jelentős lehet.',de:'Kupferfarben sind stark verbindungsabhängig; CuCl und andere Kupferverbindungen können molekular emittieren.',en:'Copper colour strongly depends on the compound; CuCl and other copper species may emit molecular bands.'}},
 In:{emitter:'In (atom)',lines:[451.1],note:{hu:'Egy jellegzetes kék indium-atomvonal példája.',de:'Beispiel einer charakteristischen blauen Indium-Atomlinie.',en:'Example characteristic blue indium atomic line.'}},
 Zn:{emitter:'Zn és vegyületfüggő emisszió',lines:[],note:{hu:'A cink lángszíne gyenge vagy bizonytalan; nem állítunk egyetlen meghatározó spektrumvonalat.',de:'Die Zink-Flammenfärbung ist schwach oder unsicher; keine einzelne dominante Linie wird behauptet.',en:'Zinc flame colour is faint or uncertain; no single dominant line is asserted.'}}
 };
 for(const [id,entry] of Object.entries(emissionData)){
  equations[id]={type:'emission',emitter:entry.emitter,spectrum:entry.lines,
   lines:['X + energia → X*','X* → X + hν'],
   explain:entry.note};
 }
 const flameTestIds=['Li','Na','K','Rb','Cs','Ca','Sr','Ba','Cu','B','In','Zn'];
 const metalIds=['Mg','Al','Fe'];
 function combustionProfile(id){
  if(id==='Mg')return{kind:'bright',oxidation:'2 Mg + O₂ → 2 MgO',barrier:false};
  if(id==='Al')return{kind:'passivated',oxidation:'4 Al + 3 O₂ → 2 Al₂O₃',barrier:true};
  if(id==='Fe')return{kind:'sparks',oxidation:'3 Fe + 2 O₂ → Fe₃O₄',barrier:false};
  return null;
 }
 function flameTest({sample='none',concentration=75,contamination=0}={}){
  const id=flameTestIds.includes(sample)?sample:'none';
  const amount=Math.max(0,Math.min(100,Number(concentration)||0))/100;
  const pollution=Math.max(0,Math.min(100,Number(contamination)||0))/100;
  // Deliberately qualitative RGB visibility model; no spectral radiance calculation.
  const intensity=id==='none'?0:Math.min(1,amount*(samples[id].intensity||.5));
  const sodiumMask=Math.min(1,pollution*2.2);
  return{sample:id,visibility:intensity,sodiumMask,dominant:id,contaminationBlend:sodiumMask};
 }
 function identifySpectrum(id){
  const entry=emissionData[id];
  return entry?{id,emitter:entry.emitter,wavelengths:entry.lines.slice()}:null;
 }
 function interpolate(a,b,t){return Math.round(a+(b-a)*t)}
 function mixColor(a,b,t){
  const aa=a.slice(1).match(/../g).map(v=>parseInt(v,16)),bb=b.slice(1).match(/../g).map(v=>parseInt(v,16));
  return '#'+aa.map((v,i)=>interpolate(v,bb[i],t).toString(16).padStart(2,'0')).join('');
 }
 function appearance({gas=false,gasFlow=65,air=50,sample='none',sampleStrength=1}={}){
  const airLevel=Math.max(0,Math.min(100,Number(air)||0)),flow=Math.max(0,Math.min(100,Number(gasFlow)||0));
  const key=Object.hasOwn(samples,sample)?sample:'none',entry=samples[key],burning=entry.kind==='combustion',sparks=entry.kind==='sparks';
  const fraction=airLevel/100,flowFraction=flow/100;
  const blueShare=Math.max(0,Math.min(1,(fraction-.10)/.70));
  // Smooth combustion transition; fuel flow is the primary flame-size control.
  const base=mixColor('#ffc230','#398fff',blueShare),core=mixColor('#ffe9a0','#67baff',blueShare);
  if(!gas||flow===0)return{lit:false,mode:'off',color:'#465464',inner:'#465464',height:0,width:0,glow:0,sparks:false,sample:key,air:airLevel,gasFlow:flow,blueShare:0,coreOpacity:0};
  const showSample=key!=='none'&&!burning&&!sparks;
  const color=showSample?mixColor(base,entry.hex,(.45+.55*blueShare)*Math.max(0,Math.min(1,Number(sampleStrength)||0))):base;
  const height=Math.round(42+118*flowFraction-15*fraction);
  const width=Math.round(16+37*flowFraction-17*fraction);
  const mode=blueShare<.15?'luminous':blueShare>.85?'nonluminous':'transition';
  return{lit:true,mode,color,inner:showSample?mixColor(core,'#70c7ff',.5):core,height,width,
   glow:showSample?(.26+.45*entry.intensity):(.55-.30*blueShare),
   sparks:burning||sparks,sample:key,air:airLevel,gasFlow:flow,blueShare,
   coreOpacity:.15+.78*blueShare,kind:entry.kind||'flame'};
 }
 return Object.freeze({samples,equations,emissionData,flameTestIds,metalIds,combustionProfile,flameTest,identifySpectrum,appearance,mixColor});
});
(function(){
 'use strict';
 if(typeof document==='undefined')return;
 const $=id=>document.getElementById(id),tab=$('bunsenTab'),section=$('bunsenSection');
 if(!tab||!section||!window.BunsenScience)return;
 const science=window.BunsenScience;
 const labels={
 hu:{title:'Bunsen-égő és lángfestés',intro:'Ismerd meg az égő részeit, majd vizsgáld meg a fémionok jellegzetes lángszíneit.',gas:'Gázcsap',air:'Levegőszabályozó gyűrű',sample:'Vizsgált anyag / elem',off:'Elzárva',on:'Nyitva',mode:'Alapláng (minta nélkül)',gasFlow:'Gázáramlás',transition:'Átmeneti láng – részben nyitott levegő',emitter:'Lehetséges fénykibocsátó részecskék',spectrum:'Példa spektrumvonalak (nem teljes színmagyarázat)',bright:'Világító, sárgás láng – kevés levegő',blue:'Nem világító, kék láng – több levegő',unlit:'Nincs láng',color:'A minta által okozott lángszín',note:'Oktatási szimuláció: nem vegyszereket égetünk el. A színpróbában jellemzően fémsók gerjesztett atomjai/ionjai bocsátanak ki fényt. A láng színe és intenzitása koncentrációtól, hőmérséklettől, aniontól és szennyeződéstől is függ. A nátrium nyomnyi jelenléte elfedhet más színeket.',parts:'Az égő részei',tube:'Égőcső',collar:'Állítható levegőgyűrű',holes:'Levegőnyílások',inlet:'Gázbevezető csonk',base:'Talp',tip:'Lángzónák: a kék láng belső kúpja kevésbé oxidáló, a külső zónában több az oxigén. A láng tényleges méretét a gázáramlás is befolyásolja; az alak szemléltető.',noSample:'Alapláng',wavelength:'Jellemző spektrumvonal'},
 de:{title:'Bunsenbrenner und Flammenfärbung',intro:'Lerne die Teile des Brenners kennen und untersuche typische Flammenfarben von Metallionen.',gas:'Gashahn',air:'Luftregulierring',sample:'Probe / Element',off:'Geschlossen',on:'Geöffnet',mode:'Grundflamme (ohne Probe)',gasFlow:'Gasdurchfluss',transition:'Übergangsflamme – Luft teilweise offen',emitter:'Mögliche lichtemittierende Teilchen',spectrum:'Beispiel-Spektrallinien (keine vollständige Farberklärung)',bright:'Leuchtende gelbliche Flamme – wenig Luft',blue:'Nichtleuchtende blaue Flamme – mehr Luft',unlit:'Keine Flamme',color:'Flammenfärbung durch die Probe',note:'Didaktische Simulation: Es werden keine Chemikalien verbrannt. Bei der Flammenprobe emittieren angeregte Atome/Ionen aus Metallsalzen Licht. Farbe und Intensität hängen auch von Konzentration, Temperatur, Anion und Verunreinigungen ab. Schon Natriumspuren können andere Farben überdecken.',parts:'Teile des Brenners',tube:'Brennerrohr',collar:'Verstellbarer Luftregulierring',holes:'Luftöffnungen',inlet:'Gasanschluss',base:'Standfuß',tip:'Flammenzonen: Der innere Kegel ist weniger oxidierend, außen ist mehr Sauerstoff verfügbar. Die tatsächliche Flammengröße hängt auch vom Gasdurchfluss ab; die Darstellung ist schematisch.',noSample:'Grundflamme',wavelength:'Typische Spektrallinie'},
 en:{title:'Bunsen Burner and Flame Tests',intro:'Explore the burner components and observe characteristic flame-test colours of metal ions.',gas:'Gas valve',air:'Adjustable air collar',sample:'Sample / element',off:'Closed',on:'Open',mode:'Base flame (without sample)',gasFlow:'Gas flow',transition:'Transition flame – partially open air',emitter:'Possible light-emitting species',spectrum:'Example spectral lines (not a full colour model)',bright:'Luminous yellowish flame – low air supply',blue:'Non-luminous blue flame – greater air supply',unlit:'No flame',color:'Sample-induced flame colour',note:'Educational simulation: no chemicals are actually burned. In flame tests, excited atoms/ions from metal salts emit light. Colour and intensity also depend on concentration, temperature, counterion and contamination. Trace sodium can mask other colours.',parts:'Burner parts',tube:'Barrel',collar:'Adjustable collar',holes:'Air holes',inlet:'Gas inlet',base:'Base',tip:'Flame zones: the inner cone is less oxidizing, while the outer region has more oxygen. Actual flame size also depends on gas flow; the shape is illustrative.',noSample:'Base flame',wavelength:'Characteristic spectral line'}
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
 const sampleColors={
 hu:{Li:'kárminvörös',Na:'intenzív sárga',K:'halványlila',Rb:'vöröses-ibolya',Cs:'kékes-ibolya',Ca:'téglavörös / narancsvörös',Sr:'élénkvörös',Ba:'sárgászöld',Cu:'kékeszöld',B:'zöld',In:'indigókék',Zn:'gyenge kékeszöld',Mg:'külön fehér égés',Al:'külön fehér égés',Fe:'narancssárga szikrák'},
 de:{Li:'karminrot',Na:'intensiv gelb',K:'blassviolett',Rb:'rötlich-violett',Cs:'blauviolett',Ca:'ziegelrot / orangerot',Sr:'kräftig rot',Ba:'gelbgrün',Cu:'blaugrün',B:'grün',In:'indigoblau',Zn:'schwach blaugrün',Mg:'separate weiße Verbrennung',Al:'separate weiße Verbrennung',Fe:'orangegelbe Funken'},
 en:{Li:'carmine red',Na:'intense yellow',K:'pale violet',Rb:'reddish violet',Cs:'blue violet',Ca:'brick red / orange-red',Sr:'bright red',Ba:'yellow-green',Cu:'blue-green',B:'green',In:'indigo blue',Zn:'faint blue-green',Mg:'separate white combustion',Al:'separate white combustion',Fe:'orange-yellow sparks'}
 };
 const auditText={
 hu:{
  safety:'Ez a szimuláció NEM helyettesíti a valódi Bunsen-égővel, tanári felügyelettel végzett laboratóriumi gyakorlást. A színek szemléltető RGB-közelítések: a látható szín függ a sótól, a kibocsátó atomoktól/ionoktól/molekuláktól, a koncentrációtól, a hőmérséklettől, a szennyeződéstől és a megfigyelési körülményektől. Az égő kezelése, a gyújtás és a biztonságos munkavégzés csak valós gyakorlatban sajátítható el.',
  hot:'A legforróbb terület közelítő helye: a kék láng belső kúpjának csúcsa fölött. Nem hőmérsékletmérés.',
  spectrum:'Az RGB-lángszín illusztráció; NEM a felsorolt spektrumvonalakból számított szín. A vonalintenzitások és a molekuláris sávok nincsenek modellezve.',
  x:'A gerjesztési séma X jelölése itt az emissziót okozó részecskét jelenti, amely atom, ion vagy molekula is lehet. A felsorolt részecskék lehetséges hozzájárulók, nem minden mintában kizárólagos kibocsátók.',
  noZone:'A jelölés csak kialakult, kék jellegű láng esetén értelmezhető.'
 },
 de:{
  safety:'Diese Simulation ersetzt NICHT das praktische Arbeiten mit einem echten Bunsenbrenner unter Aufsicht einer Lehrkraft. Die Farben sind illustrative RGB-Näherungen: Sie hängen vom Salz, den emittierenden Atomen/Ionen/Molekülen, Konzentration, Temperatur, Verunreinigungen und Beobachtungsbedingungen ab. Anzünden, Handhabung und sichere Laborarbeit lassen sich nur praktisch erlernen.',
  hot:'Ungefähre heißeste Zone: knapp oberhalb der Spitze des inneren blauen Kegels. Keine Temperaturmessung.',
  spectrum:'Die RGB-Flammenfarbe ist illustrativ und wird NICHT aus den angezeigten Spektrallinien berechnet. Linienintensitäten und Molekülbanden werden nicht modelliert.',
  x:'X im Anregungsschema bezeichnet die emittierende Spezies: Atom, Ion oder Molekül. Die genannten Spezies sind mögliche Beiträge, nicht zwangsläufig die einzigen.',
  noZone:'Diese Markierung ist nur bei einer ausgeprägten blauen Flamme sinnvoll.'
 },
 en:{
  safety:'This simulation does NOT replace hands-on practice with a real Bunsen burner under teacher supervision. Colours are illustrative RGB approximations: they depend on the salt, emitting atoms/ions/molecules, concentration, temperature, contamination and viewing conditions. Ignition, handling and safe laboratory practice require real instruction.',
  hot:'Approximate hottest region: just above the tip of the inner blue cone. Not a temperature measurement.',
  spectrum:'The RGB flame colour is illustrative, NOT calculated from the listed spectral lines. Line intensities and molecular bands are not modelled.',
  x:'X in the excitation schematic means an emitting species, which may be an atom, ion or molecule. Listed species are possible contributors, not necessarily the only emitters.',
  noZone:'This marker applies only when a distinct blue flame cone is present.'
 }
 };
 const partDetails={
 hu:{tube:'Az égőcsőben a gáz és a beáramló levegő keveréke felfelé halad.',collar:'A forgatható gyűrű szabályozza, mennyi levegő jut az égőcsőbe.',holes:'A levegőnyílásokon keresztül jut be az égéshez szükséges oxigént tartalmazó levegő.',inlet:'A gázbevezető csonk csatlakozik a gázellátáshoz.',base:'A nehéz talp tartja stabilan az égőt.'},
 de:{tube:'Im Brennerrohr strömt das Gemisch aus Gas und zugeführter Luft nach oben.',collar:'Der drehbare Ring regelt die Luftzufuhr in das Brennerrohr.',holes:'Durch die Luftöffnungen strömt sauerstoffhaltige Luft ein.',inlet:'Der Gasanschluss verbindet den Brenner mit der Gasversorgung.',base:'Der schwere Standfuß sorgt für Stabilität.'},
 en:{tube:'The gas and incoming air mixture travels upward through the barrel.',collar:'Rotating the collar adjusts how much air enters the burner.',holes:'Oxygen-containing air enters through these openings.',inlet:'The gas inlet connects the burner to its gas supply.',base:'The heavy base keeps the burner upright.'}
 };
 const state={gas:false,gasFlow:65,air:60,sample:'none'};let selectedPart='tube';
 let mode='flame',ignited=false,loopLoaded=false,concentration=75,contamination=0,contaminationEnabled=false;
 let spectralZoom=false;
 const extraText={
 hu:{zoomIn:'Nátrium D-kettős nagyítása (586–592 nm)',zoomOut:'Teljes látható tartomány',contaminationToggle:'Szennyeződés szimulálása (opcionális)',cleanDone:'A szennyeződést eltávolítottad. A kiválasztott minta tiszta lángszíne látható.',flame:'Lángfestés',metal:'Fémek égése',ignite:'Gyújtás',extinguish:'Láng eloltása',load:'Mintahurok a lángba',clean:'Hurok tisztítása',loaded:'A minta a lángban van.',unloaded:'Tiszta mintahurok – válassz mintát, majd helyezd a lángba.',concentration:'Mintakoncentráció',contamination:'Nátriumszennyezés',metalNote:'Magnézium: intenzív fehér égés. Alumínium: oxidrétege gátolja az égést, finom por másképp viselkedik. Vas: szemcséi izzó szikrákat adhatnak. A modell nem gyakorlati kísérleti útmutató.',spectrum:'Szemléltető vonalspektrum',unknown:'Ismeretlen minta azonosítása',check:'Ellenőrzés',newSample:'Új minta',right:'Helyes azonosítás.',wrong:'Nem egyezik. Vizsgáld meg újra a vonalakat.',ready:'Gyújtás előtt nyisd a gázcsapot és a levegőnyílásokat mérsékelten.',safety:'A gázcsap nyitott, de a láng nincs meggyújtva. A valós laborban ez veszélyes állapot!'},
 de:{zoomIn:'Natrium-D-Dublett vergrößern (586–592 nm)',zoomOut:'Gesamten sichtbaren Bereich anzeigen',contaminationToggle:'Verunreinigung simulieren (optional)',cleanDone:'Verunreinigung entfernt. Die reine Flammenfarbe der Probe ist sichtbar.',flame:'Flammenprobe',metal:'Metallverbrennung',ignite:'Zünden',extinguish:'Flamme löschen',load:'Probenöse in die Flamme',clean:'Öse reinigen',loaded:'Die Probe befindet sich in der Flamme.',unloaded:'Saubere Öse: Probe auswählen und in die Flamme führen.',concentration:'Probenkonzentration',contamination:'Natriumverunreinigung',metalNote:'Magnesium: intensive weiße Verbrennung. Aluminium: die Oxidschicht hemmt die Verbrennung; feines Pulver verhält sich anders. Eisen: glühende Partikel können Funken erzeugen. Kein praktisches Experimentierprotokoll.',spectrum:'Illustratives Linienspektrum',unknown:'Unbekannte Probe erkennen',check:'Prüfen',newSample:'Neue Probe',right:'Richtig erkannt.',wrong:'Stimmt nicht. Betrachte die Linien erneut.',ready:'Vor dem Zünden Gaszufuhr und Luftzufuhr passend einstellen.',safety:'Gaszufuhr ist offen, aber die Flamme brennt nicht. Im echten Labor ist das gefährlich!'},
 en:{zoomIn:'Zoom Na D doublet (586–592 nm)',zoomOut:'Show full visible range',contaminationToggle:'Simulate contamination (optional)',cleanDone:'Contamination removed. The pure flame colour of the selected sample is visible.',flame:'Flame tests',metal:'Metal combustion',ignite:'Ignite',extinguish:'Extinguish',load:'Place test loop in flame',clean:'Clean test loop',loaded:'The sample is in the flame.',unloaded:'Clean test loop: select a sample and place it in the flame.',concentration:'Sample concentration',contamination:'Sodium contamination',metalNote:'Magnesium: intense white combustion. Aluminium: its oxide layer inhibits burning; fine powder behaves differently. Iron particles can produce incandescent sparks. Not a practical experimental procedure.',spectrum:'Illustrative line spectrum',unknown:'Identify an unknown sample',check:'Check',newSample:'New sample',right:'Correct identification.',wrong:'Not quite. Inspect the lines again.',ready:'Set gas and air supply appropriately before ignition.',safety:'Gas is open but the burner is unlit. This is dangerous in a real laboratory!'}
 };
 const ex=k=>extraText[lang()][k];
 function chooseSample(id){const allowed=mode==='metal'?science.metalIds:science.flameTestIds;return allowed.includes(id)?id:'none'}
 function rebuildSamples(){const sel=$('bunsenSample'),selected=chooseSample(state.sample);sel.replaceChildren();const ids=mode==='metal'?science.metalIds:['none',...science.flameTestIds];for(const key of ids){const opt=document.createElement('option');opt.value=key;opt.textContent=science.samples[key][lang()];sel.append(opt)}state.sample=ids.includes(selected)?selected:ids[0];sel.value=state.sample}
 function renderSpectrum(){
  const svg=$('bunsenSpectrumSvg');while(svg.firstChild)svg.removeChild(svg.firstChild);
  const target=mode==='flame'?state.sample:'none',spec=science.identifySpectrum(target);if(!spec)return;
  const ns='http://www.w3.org/2000/svg',mk=(tag,attrs,text)=>{const node=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));if(text!==undefined)node.textContent=text;svg.append(node);return node};
  const range=spectralZoom?[586,592]:[380,780],span=range[1]-range[0];
  mk('rect',{x:10,y:10,width:380,height:65,fill:'#0a1020'});
  for(let i=0;i<=5;i++){const nm=range[0]+span*i/5,x=10+380*i/5;mk('line',{x1:x,x2:x,y1:75,y2:80,stroke:'#a8cadd'});mk('text',{x,y:99,'text-anchor':i===0?'start':i===5?'end':'middle','font-size':11,fill:'#c5dcee'},nm.toFixed(spectralZoom?1:0))}
  for(const nm of spec.wavelengths.filter(n=>n>=range[0]&&n<=range[1])){const x=10+(nm-range[0])/span*380;
   mk('line',{x1:x,x2:x,y1:13,y2:73,stroke:nm<450?'#a084ff':nm<490?'#75adff':nm<530?'#40e9d0':nm<575?'#a7ee6b':nm<605?'#ffe65b':nm<645?'#ffa851':'#ff5b69','stroke-width':3});
  }
  mk('text',{x:389,y:111,'text-anchor':'end','font-size':10,fill:'#b6d3e3'},'nm');
 }

 const lang=()=>['hu','de','en'].find(id=>$(id)?.classList.contains('active'))||'hu';
 const tr=k=>labels[lang()][k]||k;
 function update(){
  const flame=science.flameTest({sample:state.sample,concentration,contamination:contaminationEnabled?contamination:0});
  const selected=mode==='metal'?state.sample:flame.dominant;
  const a=science.appearance({...state,gas:state.gas&&ignited,sample:selected,sampleStrength:flame.visibility}),svg=$('bunsenSvg');
  if(mode==='flame'&&flame.contaminationBlend>0&&a.lit){a.color=science.mixColor(a.color,science.samples.Na.hex,flame.contaminationBlend);a.glow=Math.max(a.glow,flame.contaminationBlend*.65)}
  $('bunsenModeFlame').textContent=ex('flame');$('bunsenModeMetal').textContent=ex('metal');
  $('bunsenModeFlame').setAttribute('aria-pressed',String(mode==='flame'));$('bunsenModeMetal').setAttribute('aria-pressed',String(mode==='metal'));
  $('bunsenIgnite').textContent=ex(ignited?'extinguish':'ignite');
  $('bunsenFlameTestControls').hidden=mode!=='flame';$('bunsenMetalControls').hidden=mode!=='metal';
  $('bunsenConcentrationLabel').textContent=ex('concentration')+': '+concentration+'%';
  $('bunsenContaminationToggleLabel').textContent=ex('contaminationToggle');
  $('bunsenContaminationToggle').checked=contaminationEnabled;
  $('bunsenContaminationSettings').hidden=!contaminationEnabled;
  $('bunsenContaminationLabel').textContent=ex('contamination')+': '+contamination+'%';
  $('bunsenLoop').textContent=ex('clean');
  $('bunsenLoop').hidden=!contaminationEnabled||contamination===0||state.sample==='none';
  $('bunsenLoopStatus').textContent=mode==='metal'?ex('metalNote'):contaminationEnabled&&contamination>0?ex('contamination')+': '+contamination+'%':'';
  $('bunsenMetalNote').textContent=ex('metalNote');
  $('bunsenSpectrumHeading').textContent=ex('spectrum');$('bunsenSpectrumZoom').textContent=ex(spectralZoom?'zoomOut':'zoomIn');
  $('bunsenGasWarning').textContent=state.gas&&!ignited?ex('safety'):'';

  $('bunsenGas').textContent=tr('gas')+': '+tr(state.gas?'on':'off');
  $('bunsenAirLabel').textContent=tr('air')+': '+state.air+'%';
  $('bunsenGasFlowLabel').textContent=tr('gasFlow')+': '+state.gasFlow+'%';
  $('bunsenSampleLabel').textContent=tr('sample');
  $('bunsenHeading').textContent=tr('title');$('bunsenIntro').textContent=tr('intro');
  $('bunsenPartsHeading').textContent=tr('parts');$('bunsenNote').textContent=tr('note');$('bunsenZone').textContent=tr('tip');
  for(const name of ['tube','collar','holes','inlet','base']){const item=$('bunsenPart'+name);item.textContent=tr(name);item.style.fontWeight=selectedPart===name?'bold':'normal';item.style.cursor='pointer';item.setAttribute('tabindex','0');item.setAttribute('role','button');item.setAttribute('aria-pressed',String(selectedPart===name));} $('bunsenPartDetail').textContent=partDetails[lang()][selectedPart];
  const opts=$('bunsenSample').options;
  for(const option of opts){option.textContent=science.samples[option.value]?.[lang()]||option.value}
  $('bunsenMode').textContent=tr('mode')+': '+tr(!a.lit?'unlit':a.mode==='luminous'?'bright':a.mode==='nonluminous'?'blue':'transition');
  $('bunsenColour').textContent=tr('color')+': '+(selected==='none'?tr('noSample'):(sampleColors[lang()][selected]||science.samples[selected][lang()]));
  const data=science.emissionData[selected];
  $('bunsenSpectrum').textContent=data?(tr('emitter')+': '+data.emitter+' | '+tr('spectrum')+': '+(data.lines.length?data.lines.join(', ')+' nm':'—')):'';
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
  const innerH=Math.round(a.height*(.22+.34*a.blueShare)),innerW=Math.round(half*(.74-.06*a.blueShare));
  const hotMarker=$('bunsenHotSpot'),hotLine=$('bunsenHotSpotLine');
  const showHotSpot=a.lit&&a.blueShare>.65&&selected==='none';
  const hotY=baseY-innerH-9;
  if(hotMarker){hotMarker.style.display=showHotSpot?'':'none';hotMarker.setAttribute('cy',String(hotY));}
  if(hotLine){hotLine.style.display=showHotSpot?'':'none';hotLine.setAttribute('d',`M ${center+7} ${hotY} L ${center+75} ${hotY-14}`);}
  inner.setAttribute('d',`M ${center},${baseY-innerH} Q ${center-innerW*.8},${baseY-innerH*.65} ${center-innerW},${baseY-10} Q ${center},${baseY+4} ${center+innerW},${baseY-10} Q ${center+innerW*.8},${baseY-innerH*.65} ${center},${baseY-innerH} Z`);
  outer.setAttribute('fill',a.color);
  inner.setAttribute('fill',a.inner);
  outer.style.opacity=a.lit?'1':'0';inner.style.opacity=a.lit?String(a.coreOpacity):'0';
  const glow=$('bunsenDynamicGlow');if(glow){glow.setAttribute('fill',a.color);glow.style.opacity=a.lit?String(a.glow):'0';glow.setAttribute('ry',String(a.height*.78));glow.setAttribute('cy',String(baseY-a.height*.47))}
  const sparks=$('bunsenSparks');if(sparks)sparks.style.display=a.lit&&a.sparks?'':'none';
  const metalGlow=$('bunsenMetalGlow'),metalFlame=$('bunsenMetalFlame'),metalSample=$('bunsenMetalSample');
  const separate=a.lit&&mode==='metal'&&['Mg','Al','Fe'].includes(state.sample);
  if(metalGlow){metalGlow.style.display=separate?'':'none';metalGlow.style.opacity=state.sample==='Al'?'0.25':'1'}
  if(metalFlame){metalFlame.style.display=separate?'':'none';metalFlame.style.opacity=state.sample==='Al'?'0.28':'1';metalFlame.setAttribute('fill',state.sample==='Fe'?'#ffba55':state.sample==='Mg'?'#ffffff':'#f0f5ff')}
  if(metalSample)metalSample.style.display=separate?'':'none';
  const warning=$('bunsenSampleNote');if(warning)warning.textContent=sampleNotes[lang()][a.kind==='combustion'?'combustion':a.kind==='sparks'?'sparks':a.kind==='compound'?'compound':a.kind==='faint'?'faint':'normal'];
  const equation=science.equations[selected]||science.equations.none;
  $('bunsenEquationTitle').textContent=equationLabels[lang()].equationTitle;
  $('bunsenEquationType').textContent=equationLabels[lang()][equation.type==='combustion'?'combustionType':equation.type==='base'?'fuelType':equation.type==='compound'?'compoundType':'emissionType'];
  $('bunsenEquations').replaceChildren();
  for(const line of equation.lines){const item=document.createElement('div');item.textContent=line;$('bunsenEquations').append(item)}
  $('bunsenEquationNote').textContent=equation.explain?.[lang()]||equationLabels[lang()][equation.type==='combustion'?'combustionInfo':'emissionInfo'];
  $('bunsenEmitterExplanation').textContent=equation.type==='emission'||equation.type==='compound'?auditText[lang()].x:'';
  $('bunsenSpectrumCaveat').textContent=selected!=='none'&&!['Mg','Al','Fe'].includes(selected)?auditText[lang()].spectrum:'';
  $('bunsenPracticeWarning').textContent=auditText[lang()].safety;
  $('bunsenHotSpotCaption').textContent=showHotSpot?auditText[lang()].hot:auditText[lang()].noZone;
  svg.classList.toggle('bunsen-burning',a.lit);
  svg.classList.toggle('bunsen-metal',a.lit&&a.sparks);
  svg.setAttribute('aria-label',tr('title'));
 }
 const open=()=>{document.querySelectorAll('main > section').forEach(n=>n.classList.add('hidden'));document.querySelectorAll('.tabs > button').forEach(n=>n.classList.remove('active'));section.classList.remove('hidden');tab.classList.add('active');update()};
 tab.addEventListener('click',open);
 $('bunsenGas').addEventListener('click',()=>{state.gas=!state.gas;if(!state.gas)ignited=false;update()});
 $('bunsenAir').addEventListener('input',e=>{state.air=Number(e.target.value);update()});
 $('bunsenGasFlow').addEventListener('input',e=>{state.gasFlow=Number(e.target.value);if(state.gasFlow===0)ignited=false;update()});
 $('bunsenSample').addEventListener('change',e=>{state.sample=e.target.value;loopLoaded=mode==='flame'&&state.sample!=='none';renderSpectrum();update()});
 ['hu','de','en'].forEach(id=>$(id)?.addEventListener('click',()=>update()));
 for(const name of ['tube','collar','holes','inlet','base']){const item=$('bunsenPart'+name);const select=()=>{selectedPart=name;update()};item.addEventListener('click',select);item.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select()}})}
 
 $('bunsenModeFlame').onclick=()=>{mode='flame';rebuildSamples();loopLoaded=state.sample!=='none';renderSpectrum();update()};
 $('bunsenModeMetal').onclick=()=>{mode='metal';loopLoaded=false;rebuildSamples();renderSpectrum();update()};
 $('bunsenIgnite').onclick=()=>{if(ignited){ignited=false}else if(state.gas&&state.gasFlow>0){ignited=true}update()};
 $('bunsenConcentration').oninput=e=>{concentration=Number(e.target.value);update()};
 $('bunsenContaminationToggle').onchange=e=>{contaminationEnabled=e.target.checked;contamination=0;$('bunsenContamination').value='0';update()};
 $('bunsenContamination').oninput=e=>{contamination=Number(e.target.value);update()};
 $('bunsenLoop').onclick=()=>{if(!contaminationEnabled)return;contamination=0;$('bunsenContamination').value='0';update();$('bunsenLoopStatus').textContent=ex('cleanDone')};
 $('bunsenSpectrumZoom').onclick=()=>{spectralZoom=!spectralZoom;renderSpectrum();update()};
 $('bunsenGas').addEventListener('click',()=>{if(!state.gas)ignited=false});
 window.BunsenLabControls={
  snapshot:()=>({gas:state.gas,ignited,air:state.air,gasFlow:state.gasFlow,mode,sample:state.sample,loopLoaded,concentration,contamination:contaminationEnabled?contamination:0,contaminationEnabled}),
  // Classroom task evaluation consumes the actual student-operated controls.
  refresh:()=>update()
 };
  $('bunsenAir').value=state.air;$('bunsenGasFlow').value=state.gasFlow;
 rebuildSamples();renderSpectrum();update();
})();
