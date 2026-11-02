/* Chemistry Lab: Bunsen burner and flame tests, educational model. Apache-2.0. */
(function(root,factory){
 const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.BunsenScience=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const samples={
 none:{hex:'#6cbbff',intensity:0,nm:null,hu:'Nincs minta',de:'Keine Probe',en:'No sample'},
 Li:{hex:'#d9264e',intensity:0.88,nm:670.8,hu:'Lítium',de:'Lithium',en:'Lithium'},
 Na:{hex:'#ffd338',intensity:1,nm:589.3,hu:'Nátrium',de:'Natrium',en:'Sodium'},
 K:{hex:'#ba89ed',intensity:.58,nm:404.4,hu:'Kálium',de:'Kalium',en:'Potassium'},
 Ca:{hex:'#ef6c39',intensity:.85,nm:null,hu:'Kalcium',de:'Calcium',en:'Calcium'},
 Sr:{hex:'#d91d45',intensity:.9,nm:null,hu:'Stroncium',de:'Strontium',en:'Strontium'},
 Ba:{hex:'#92d747',intensity:.82,nm:null,hu:'Bárium',de:'Barium',en:'Barium'},
 Cu:{hex:'#20bd98',intensity:.82,nm:null,hu:'Réz',de:'Kupfer',en:'Copper'}
 };
 function appearance({gas=false,air=50,sample='none'}={}){
  const oxygen=Math.max(0,Math.min(100,Number(air)||0)),s=samples[sample]||samples.none;
  if(!gas)return{lit:false,mode:'off',color:'#465464',inner:'#465464',height:0,sample:sample in samples?sample:'none'};
  const luminous=oxygen<38,base=luminous?'#ffc94b':'#68b9ff',inner=luminous?'#ffeeb1':'#d3eeff';
  const test=sample!=='none'&&s.intensity>.1;
  return{lit:true,mode:luminous?'luminous':'nonluminous',color:test?s.hex:base,inner:test?s.hex:inner,height:luminous?106:140,sample:sample in samples?sample:'none',air:oxygen};
 }
 return Object.freeze({samples,appearance});
});
(function(){
 'use strict';
 const $=id=>document.getElementById(id),tab=$('bunsenTab'),section=$('bunsenSection');
 if(!tab||!section||!window.BunsenScience)return;
 const science=window.BunsenScience;
 const labels={
 hu:{title:'Bunsen-égő és lángfestés',intro:'Ismerd meg az égő részeit, majd vizsgáld meg a fémionok jellegzetes lángszíneit.',gas:'Gázcsap',air:'Levegőszabályozó gyűrű',sample:'Vizsgált fémion',off:'Elzárva',on:'Nyitva',mode:'Láng típusa',bright:'Világító, sárgás láng – kevés levegő',blue:'Nem világító, kék láng – több levegő',unlit:'Nincs láng',color:'Megfigyelhető lángszín',note:'Oktatási szimuláció: nem vegyszereket égetünk el. A színpróbában jellemzően fémsók gerjesztett atomjai/ionjai bocsátanak ki fényt. A láng színe és intenzitása koncentrációtól, hőmérséklettől, aniontól és szennyeződéstől is függ. A nátrium nyomnyi jelenléte elfedhet más színeket.',parts:'Az égő részei',tube:'Égőcső',collar:'Állítható levegőgyűrű',holes:'Levegőnyílások',inlet:'Gázbevezető csonk',base:'Talp',tip:'Lángzónák: a belső kúpban még nem teljes az égés, a külső zónában több az oxigén.',noSample:'Alapláng',wavelength:'Jellemző spektrumvonal'},
 de:{title:'Bunsenbrenner und Flammenfärbung',intro:'Lerne die Teile des Brenners kennen und untersuche typische Flammenfarben von Metallionen.',gas:'Gashahn',air:'Luftregulierring',sample:'Metallion der Probe',off:'Geschlossen',on:'Geöffnet',mode:'Flammenart',bright:'Leuchtende gelbliche Flamme – wenig Luft',blue:'Nichtleuchtende blaue Flamme – mehr Luft',unlit:'Keine Flamme',color:'Beobachtete Flammenfarbe',note:'Didaktische Simulation: Es werden keine Chemikalien verbrannt. Bei der Flammenprobe emittieren angeregte Atome/Ionen aus Metallsalzen Licht. Farbe und Intensität hängen auch von Konzentration, Temperatur, Anion und Verunreinigungen ab. Schon Natriumspuren können andere Farben überdecken.',parts:'Teile des Brenners',tube:'Brennerrohr',collar:'Verstellbarer Luftregulierring',holes:'Luftöffnungen',inlet:'Gasanschluss',base:'Standfuß',tip:'Flammenzonen: Im inneren Kegel ist die Verbrennung noch unvollständig; außen steht mehr Sauerstoff zur Verfügung.',noSample:'Grundflamme',wavelength:'Typische Spektrallinie'},
 en:{title:'Bunsen Burner and Flame Tests',intro:'Explore the burner components and observe characteristic flame-test colours of metal ions.',gas:'Gas valve',air:'Adjustable air collar',sample:'Metal ion sample',off:'Closed',on:'Open',mode:'Flame type',bright:'Luminous yellowish flame – low air supply',blue:'Non-luminous blue flame – greater air supply',unlit:'No flame',color:'Observed flame colour',note:'Educational simulation: no chemicals are actually burned. In flame tests, excited atoms/ions from metal salts emit light. Colour and intensity also depend on concentration, temperature, counterion and contamination. Trace sodium can mask other colours.',parts:'Burner parts',tube:'Barrel',collar:'Adjustable collar',holes:'Air holes',inlet:'Gas inlet',base:'Base',tip:'Flame zones: combustion remains incomplete in the inner cone; the outer region has greater oxygen availability.',noSample:'Base flame',wavelength:'Characteristic spectral line'}
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
  for(const name of ['tube','collar','holes','inlet','base']){const item=$('bunsenPart'+name);item.textContent=tr(name);item.style.fontWeight=selectedPart===name?'bold':'normal';item.style.cursor='pointer';item.setAttribute('tabindex','0');item.setAttribute('role','button');item.setAttribute('aria-pressed',String(selectedPart===name));} $('bunsenPartDetail').textContent=tr(selectedPart);
  const opts=$('bunsenSample').options;
  for(const option of opts){option.textContent=science.samples[option.value]?.[lang()]||option.value}
  $('bunsenMode').textContent=tr('mode')+': '+tr(!a.lit?'unlit':a.mode==='luminous'?'bright':'blue');
  $('bunsenColour').textContent=tr('color')+': '+(state.sample==='none'?tr('noSample'):science.samples[state.sample][lang()]);
  const line=science.samples[state.sample]?.nm;
  $('bunsenSpectrum').textContent=line?tr('wavelength')+': ≈ '+line+' nm':'';
  const outer=$('bunsenFlameOuter'),inner=$('bunsenFlameInner');
  outer.setAttribute('fill',a.color);inner.setAttribute('fill',a.inner);
  outer.style.opacity=a.lit?'.86':'0';inner.style.opacity=a.lit?(a.mode==='luminous'?'.52':'.87'):'0';
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
