/* Acid–base laboratory: monoprotic strong and weak acids/bases, charge-balance pH solver. Apache-2.0. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.AcidBaseEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const Kw=1e-14;
const reagents={
 HCl:{type:'strong-acid',hu:'Sósav (HCl)',de:'Salzsäure (HCl)',en:'Hydrochloric acid (HCl)'},
 HNO3:{type:'strong-acid',hu:'Salétromsav (HNO₃)',de:'Salpetersäure (HNO₃)',en:'Nitric acid (HNO₃)'},
 NaOH:{type:'strong-base',hu:'Nátrium-hidroxid (NaOH)',de:'Natronlauge (NaOH)',en:'Sodium hydroxide (NaOH)'},
 KOH:{type:'strong-base',hu:'Kálium-hidroxid (KOH)',de:'Kalilauge (KOH)',en:'Potassium hydroxide (KOH)'},
 CH3COOH:{type:'weak-acid',ka:1.8e-5,hu:'Ecetsav (CH₃COOH)',de:'Essigsäure (CH₃COOH)',en:'Acetic acid (CH₃COOH)'},
 NH3:{type:'weak-base',kb:1.8e-5,hu:'Ammónia (NH₃)',de:'Ammoniak (NH₃)',en:'Ammonia (NH₃)'}
};
function positive(n,name,allowZero=false){n=Number(n);if(!Number.isFinite(n)||n<0||(!allowZero&&n===0))throw Error('invalid-'+name);return n}
function solve({analyte='HCl',analyteM=0.1,analyteMl=25,titrant='NaOH',titrantM=0.1,addedMl=0,temperature=25}={}){
 const a=reagents[analyte],t=reagents[titrant];if(!a||!t)throw Error('unknown-reagent');
 if((a.type.includes('acid')&&t.type.includes('acid'))||(a.type.includes('base')&&t.type.includes('base')))throw Error('opposite-reagents-required');
 const ca=positive(analyteM,'analyte-concentration'),ct=positive(titrantM,'titrant-concentration');
 const va=positive(analyteMl,'analyte-volume'),vb=positive(addedMl,'added-volume',true);
 if(ca>10||ct>10||va>2000||vb>5000)throw Error('out-of-range');
 if(temperature!==25)throw Error('model-25C-only');
 const L=(va+vb)/1000,na=ca*va/1000,nb=ct*vb/1000;
 let strongAcid=0,strongBase=0,weakAcid=0,weakBase=0,ka=0,kb=0;
 for(const [r,n] of [[a,na],[t,nb]]){
 if(r.type==='strong-acid')strongAcid+=n/L;
 else if(r.type==='strong-base')strongBase+=n/L;
 else if(r.type==='weak-acid'){weakAcid+=n/L;ka=r.ka}
 else if(r.type==='weak-base'){weakBase+=n/L;kb=r.kb}
 }
 // Cation - anion + [H+] - [OH-] = 0; includes weak acid anions and conjugate acid cations.
 function charge(ph){const h=Math.pow(10,-ph),oh=Kw/h;
 const anion=weakAcid*(ka/(ka+h));
 const conjugateAcid=weakBase*(h/(h+Kw/kb));
 return strongBase+conjugateAcid+h-strongAcid-anion-oh;
 }
 let lo=-2,hi=16;
 for(let i=0;i<100;i++){const mid=(lo+hi)/2;if(charge(mid)>0)lo=mid;else hi=mid}
 const pH=(lo+hi)/2;
 return{pH,equivalenceMl:ca*va/ct,addedMl:vb,analyte,titrant,temperature:25,acidic:pH<6.95,relativeH:Math.pow(10,-pH)};
}
function curve(options={},points=121){const p=positive(points,'points');if(!Number.isInteger(p)||p<2||p>1001)throw Error('invalid-points');const eq=solve({...options,addedMl:0}).equivalenceMl;const end=Math.max(eq*2,1);return Array.from({length:p},(_,i)=>solve({...options,addedMl:end*i/(p-1)}))}
const indicators={
 methylOrange:{hu:'Metilnarancs',de:'Methylorange',en:'Methyl orange',range:[3.1,4.4],acid:'#ea343b',base:'#f5cf31'},
 bromothymol:{hu:'Brómtimolkék',de:'Bromthymolblau',en:'Bromothymol blue',range:[6.0,7.6],acid:'#f4cd40',base:'#267bdb'},
 phenolphthalein:{hu:'Fenolftalein',de:'Phenolphthalein',en:'Phenolphthalein',range:[8.2,10],acid:'#e8f2f9',base:'#ed3c9c'}
};
function indicatorColor(ph,id){const x=indicators[id];if(!x)throw Error('unknown-indicator');if(ph<=x.range[0])return x.acid;if(ph>=x.range[1])return x.base;return x.acid+' → '+x.base}
return Object.freeze({reagents,indicators,solve,curve,indicatorColor});
});
(function(){
'use strict';if(typeof document==='undefined')return;
const $=id=>document.getElementById(id),tab=$('acidBaseTab'),section=$('acidBaseSection');if(!tab||!section||!window.AcidBaseEngine)return;
const engine=window.AcidBaseEngine;
const labels={
 hu:{title:'Sav–bázis labor és titrálás',intro:'Savas és lúgos oldatok pH-ja, indikátorok és titrálási görbe.',analyte:'Vizsgált oldat',analyteM:'Koncentráció (mol/L)',volume:'Kezdeti térfogat (mL)',titrant:'Titrálóoldat',titrantM:'Titrálóoldat koncentrációja (mol/L)',added:'Hozzáadott titrálóoldat (mL)',indicator:'Indikátor',eq:'Egyenértékpont térfogata',ph:'Számított pH',notice:'25 °C-on, ideális oldatban; monoprotikus savak és egyértékű bázisok modellje. Az aktivitás, hőmérséklet, ionerősség és térfogatkontrakció hatását nem számítjuk. Az indikátorszín közelítő.',error:'Hibás bemeneti érték vagy nem megfelelő sav–bázis pár.',reset:'Egyenértékpont',graph:'Titrálási görbe',indicatorShade:'Indikátorszín'},
 de:{title:'Säure–Base-Labor und Titration',intro:'pH von Säuren und Basen, Indikatoren und Titrationskurven.',analyte:'Probelösung',analyteM:'Konzentration (mol/L)',volume:'Anfangsvolumen (mL)',titrant:'Maßlösung',titrantM:'Konzentration der Maßlösung (mol/L)',added:'Zugegebenes Volumen (mL)',indicator:'Indikator',eq:'Äquivalenzvolumen',ph:'Berechneter pH',notice:'Ideales Modell bei 25 °C für einprotonige Säuren und einwertige Basen. Aktivität, Temperatur-, Ionenstärke- und Volumenkontraktionseffekte fehlen. Indikatorfarben sind Näherungen.',error:'Ungültige Eingabe oder kein passendes Säure–Base-Paar.',reset:'Äquivalenzpunkt',graph:'Titrationskurve',indicatorShade:'Indikatorfarbe'},
 en:{title:'Acid–Base Laboratory and Titration',intro:'Acid/base pH, indicators and interactive titration curves.',analyte:'Analyte solution',analyteM:'Concentration (mol/L)',volume:'Initial volume (mL)',titrant:'Titrant',titrantM:'Titrant concentration (mol/L)',added:'Added titrant (mL)',indicator:'Indicator',eq:'Equivalence volume',ph:'Calculated pH',notice:'Ideal model at 25 °C for monoprotic acids and monovalent bases. Activity, temperature, ionic strength and volume contraction are not modeled. Indicator colors are approximate.',error:'Invalid values or incompatible acid/base selection.',reset:'Equivalence point',graph:'Titration curve',indicatorShade:'Indicator color'}
};
const lang=()=>['hu','de','en'].find(k=>$(k)?.classList.contains('active'))||'hu',tr=k=>labels[lang()][k];
const visuals={
 hu:{title:'Így változik az oldat',acid:'Savas oldat',neutral:'Semleges körüli pH',base:'Lúgos oldat',before:'Egyenértékpont előtt',at:'Egyenértékpont közelében',after:'Egyenértékpont után',info:'A pohár színe az indikátor szemléltető színe; a pH-skála nem egy indikátor színskálája.',drops:'Titrálóoldat hozzáadása'},
 de:{title:'So verändert sich die Lösung',acid:'Saure Lösung',neutral:'Etwa neutraler pH',base:'Basische Lösung',before:'Vor dem Äquivalenzpunkt',at:'Nahe Äquivalenzpunkt',after:'Nach dem Äquivalenzpunkt',info:'Die Becherfarbe illustriert den Indikator; die pH-Skala ist keine Indikator-Farbskala.',drops:'Maßlösung zugeben'},
 en:{title:'Watch the solution change',acid:'Acidic solution',neutral:'Near neutral pH',base:'Basic solution',before:'Before equivalence',at:'Near equivalence',after:'After equivalence',info:'The beaker shows illustrative indicator colour; the pH scale is not a single indicator colour scale.',drops:'Adding titrant'}
};
function updateVisual(result,color){
 const V=visuals[lang()],ratio=result.equivalenceMl>0?result.addedMl/result.equivalenceMl:0,degree=Math.max(0,Math.min(1,ratio/2));
 $('abVisualTitle').textContent=V.title;
 $('abVisualPhase').textContent=(result.pH<6.5?V.acid:result.pH>7.5?V.base:V.neutral)+' · '+(ratio<.98?V.before:ratio>1.02?V.after:V.at)+' · pH '+result.pH.toFixed(2);
 $('abVisualLegend').textContent=V.info;
 $('abPhMarker').style.left=(Math.max(0,Math.min(14,result.pH))/14*100)+'%';
 $('abPhMarker').setAttribute('aria-label','pH '+result.pH.toFixed(2));
 $('abLiquid').style.background=color.includes(' → ')?'linear-gradient(90deg,'+color.split(' → ').join(',')+')':color;
 $('abLiquid').style.height=(33+Math.round(degree*40))+'%';
 $('abBuretteFill').style.height=Math.round((1-degree)*73)+'%';
 $('abDrop').style.opacity=result.addedMl>0?'1':'0.25';
}
function blendHex(a,b,t){const A=a.match(/[\da-f]{2}/gi).map(v=>parseInt(v,16)),B=b.match(/[\da-f]{2}/gi).map(v=>parseInt(v,16));return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*Math.max(0,Math.min(1,t))).toString(16).padStart(2,'0')).join('')}
function displayedIndicator(ph,id){const ind=engine.indicators[id];if(!ind)return '#777';const start=ind.range[0],end=ind.range[1];return blendHex(ind.acid,ind.base,(ph-start)/(end-start))}
function syncDoseSlider(){const value=Math.max(0,Number($('abadded').value)||0),options=read();let eq=25;try{eq=engine.solve({...options,addedMl:0}).equivalenceMl}catch{}const range=Math.max(10,Math.ceil(Math.max(eq*2,value)/5)*5);$('abDoseSlider').max=String(Math.min(5000,range));$('abDoseSlider').value=String(value)}
function setDose(amount){$('abadded').value=Math.max(0,Math.min(5000,Math.round(amount*10)/10));update()}
function autoCompatible(changed){const a=engine.reagents[$('abanalyte').value],t=engine.reagents[$('abtitrant').value];if(!a||!t||a.type.includes('acid')!==t.type.includes('acid'))return;if(changed==='analyte')$('abtitrant').value=a.type.includes('acid')?'NaOH':'HCl';else $('abanalyte').value=t.type.includes('acid')?'NaOH':'HCl'}
const fields=['analyte','analyteM','volume','titrant','titrantM','added','indicator'];
const select=(id,map)=>{const el=$('ab'+id);el.replaceChildren();for(const [k,val] of Object.entries(map)){const o=document.createElement('option');o.value=k;o.textContent=val[lang()]||k;el.append(o)}};
const form={analyte:'HCl',analyteM:0.1,analyteMl:25,titrant:'NaOH',titrantM:0.1,addedMl:0};
select('analyte',engine.reagents);select('titrant',engine.reagents);select('indicator',engine.indicators);
$('abanalyte').value='HCl';$('abtitrant').value='NaOH';$('abindicator').value='bromothymol';
function read(){return{analyte:$('abanalyte').value,titrant:$('abtitrant').value,analyteM:Number($('abanalyteM').value),titrantM:Number($('abtitrantM').value),analyteMl:Number($('abvolume').value),addedMl:Number($('abadded').value)}}
function draw(series,current){const canvas=$('abCanvas'),rect=canvas.getBoundingClientRect(),w=Math.max(320,Math.floor(rect.width||640)),h=300;canvas.width=w*devicePixelRatio;canvas.height=h*devicePixelRatio;const ctx=canvas.getContext('2d');ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);ctx.clearRect(0,0,w,h);
 const left=42,right=w-14,top=16,bottom=h-34,maxX=series[series.length-1].addedMl||1;
 ctx.strokeStyle='#7793a4';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(left,top);ctx.lineTo(left,bottom);ctx.lineTo(right,bottom);ctx.stroke();
 for(const ph of [0,2,4,6,8,10,12,14]){const y=bottom-ph/14*(bottom-top);ctx.fillStyle='#b5d2df';ctx.font='12px sans-serif';ctx.fillText(String(ph),11,y+4);ctx.strokeStyle='#27475c';ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke()}
 const xy=r=>[left+(r.addedMl/maxX)*(right-left),bottom-Math.max(0,Math.min(14,r.pH))/14*(bottom-top)];
 ctx.beginPath();ctx.lineWidth=3;ctx.strokeStyle='#6ad9cf';series.forEach((r,i)=>{const [x,y]=xy(r);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();
 const [x,y]=xy(current);ctx.fillStyle='#ffd46e';ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();ctx.font='12px sans-serif';ctx.fillText(maxX.toFixed(1)+' mL',right-55,h-7);
}
function localize(){const save={a:$('abanalyte').value,t:$('abtitrant').value,i:$('abindicator').value};select('analyte',engine.reagents);select('titrant',engine.reagents);select('indicator',engine.indicators);$('abanalyte').value=save.a;$('abtitrant').value=save.t;$('abindicator').value=save.i;
 $('abTitle').textContent=tr('title');$('abIntro').textContent=tr('intro');$('abNotice').textContent=tr('notice');$('abGraphLabel').textContent=tr('graph');
 for(const key of fields)$('abLabel'+key).textContent=tr(key);
 $('abEqButton').textContent=tr('reset');$('abDoseSliderLabel').textContent=tr('added');update();}
function update(){try{const opts=read(),result=engine.solve(opts);let series=engine.curve(opts);if(opts.addedMl>series[series.length-1].addedMl){const end=opts.addedMl*1.05;series=Array.from({length:121},(_,i)=>engine.solve({...opts,addedMl:end*i/120}))}const color=engine.indicatorColor(result.pH,$('abindicator').value);
 $('abPH').textContent=tr('ph')+': '+result.pH.toFixed(2);$('abEq').textContent=tr('eq')+': '+result.equivalenceMl.toFixed(2)+' mL';
 const indicatorShade=displayedIndicator(result.pH,$('abindicator').value);
 $('abIndicatorColor').style.background=indicatorShade;
 $('abStatus').textContent=tr('indicatorShade')+': '+engine.indicators[$('abindicator').value][lang()];
 $('abStatus').dataset.state='ok';updateVisual(result,indicatorShade);syncDoseSlider();draw(series,result);
 }catch(e){$('abPH').textContent='—';$('abEq').textContent='—';$('abStatus').textContent=tr('error');$('abStatus').dataset.state='error'}}
for(const key of fields)$('ab'+key).addEventListener('input',()=>{if(key==='analyte'||key==='titrant')autoCompatible(key);update()});
$('abDoseSlider').addEventListener('input',e=>setDose(Number(e.target.value)));
$('abDoseMinus').addEventListener('click',()=>setDose((Number($('abadded').value)||0)-1));
$('abDosePlus').addEventListener('click',()=>setDose((Number($('abadded').value)||0)+1));
$('abDoseReset').addEventListener('click',()=>setDose(0));
$('abEqButton').addEventListener('click',()=>{try{const value=engine.solve({...read(),addedMl:0}).equivalenceMl;$('abadded').value=value;update()}catch{update()}});
tab.addEventListener('click',()=>{document.querySelectorAll('main > section').forEach(n=>n.classList.add('hidden'));document.querySelectorAll('.tabs > button').forEach(n=>n.classList.remove('active'));section.classList.remove('hidden');tab.classList.add('active');localize()});
for(const l of ['hu','de','en'])$(l)?.addEventListener('click',()=>{queueMicrotask(localize);requestAnimationFrame(localize)});
localize();
})();
