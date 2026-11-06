const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const html=read('index.html'),app=read('assets/js/app-core.js');
const family=require('../assets/js/material-families.js');
const hunt=require('../assets/js/element-hunt-expansion.js');
const discovery=require('../assets/js/chemistry-discovery.js');
const reactivity=require('../assets/js/acid-material-explorer.js');
const engine=require('../assets/js/acid-base.js');
const elements=JSON.parse(html.match(/<script id="element-data" type="application\/json">([^<]+)<\/script>/)[1]);
const extra=JSON.parse(app.match(/materials\.push\(\.\.\.(\[[\s\S]*?\])\);/)[1]);
const baseline=[{hu:'Víz',category:'molecule'},{hu:'Konyhasó',category:'so'},{hu:'Kristálycukor',category:'szerves'},{hu:'Szőlőcukor',category:'szerves'},{hu:'Ecet (ecetsav)',category:'keverek'},{hu:'Szódabikarbóna',category:'so'},{hu:'Etanol',category:'szerves'},{hu:'Szén-dioxid',category:'gaz'},{hu:'Koffein',category:'szerves'},{hu:'Metán',category:'gaz'},{hu:'Hidrogén-peroxid',category:'szerves'},{hu:'Grafit',category:'halozat'}];baseline.forEach(m=>m.description=['Alapleírás','Grundbeschreibung']);
test('68 materials have a named chemical family and adjacent sorted relatives',()=>{
 const list=baseline.concat(extra);assert.equal(list.length,68);
 assert.ok(list.every(x=>family.family(x)!=='other'));
 const sorted=family.sort(list.map((m,i)=>({m,i})));
 const names=sorted.map(x=>x.m.hu);
 assert.equal(names.indexOf('Etán')+1,names.indexOf('Propán'));
 assert.equal(names.indexOf('Grafit')+1,names.indexOf('Gyémánt'));
 assert.equal(names.indexOf('Metanol')+1,names.indexOf('Etanol'));
});
test('all material families have trilingual descriptions and advanced notes',()=>{
 const list=baseline.concat(extra);
 for(const m of list)for(const lang of ['hu','de','en']){
  const d=family.detail(m,lang);
  assert.ok(d.title&&d.general&&d.specific, m.hu+' '+lang);
 }
 assert.ok(discovery.insight({f:'Au'}));
});
test('100 unique grounded Element Hunt questions include four distinct answers',()=>{
 const qs=hunt.build(elements,100);assert.equal(qs.length,100);
 for(const lang of [0,1,2])assert.equal(new Set(qs.map(q=>q.q[lang])).size,100);
 for(const q of qs){assert.ok(q.opts.includes(q.a));assert.equal(new Set(q.opts).size,4);assert.equal(q.q.length,3);assert.equal(q.why.length,3)}
});
test('acid and material cases preserve important chemistry distinctions',()=>{
 assert.equal(reactivity.lookup('HCl','Au').level,'none');
 assert.equal(reactivity.lookup('HCl','Zn').gas,'H₂');
 assert.equal(reactivity.lookup('HCl','CaCO3').gas,'CO₂');
 assert.equal(reactivity.lookup('HNO3','Cu').level,'conditional');
 assert.equal(reactivity.lookup('HCl','Ag'),null);
});
test('expanded acid/base titration remains browser-side and numerically consistent',()=>{
 for(const reagent of ['HBr','HCOOH','C3H6O3','C3H6O2','LiOH','CH3NH2','C5H5N'])assert.ok(engine.reagents[reagent]);
 const x=engine.solve({analyte:'HCOOH',titrant:'LiOH',analyteM:0.1,titrantM:0.1,analyteMl:25,addedMl:25});
 assert.ok(Number.isFinite(x.pH));
 const inv=engine.solveForPH({analyte:'HCOOH',titrant:'LiOH',analyteM:0.1,titrantM:0.1,analyteMl:25},7);
 assert.equal(inv.reachable,true);assert.ok(Math.abs(inv.pH-7)<1e-3);
});
test('new scripts load before app-core and UI has hidden science section',()=>{
 const appPos=html.indexOf('src="assets/js/app-core.js?v=2.10.1"');
 for(const script of ['material-families.js','element-hunt-expansion.js','chemistry-discovery.js']){
  const pos=html.indexOf(script);assert.ok(pos>=0&&pos<appPos,script);
 }
 assert.match(html,/id="abScienceDetails"/);assert.match(html,/id="abReactionExplorer"/);
 assert.ok(html.includes('acid-material-explorer.js'));assert.ok(html.includes('Beta 0.2112'));
});
