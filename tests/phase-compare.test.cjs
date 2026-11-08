const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const E=require('../assets/js/phase-compare-engine.js');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
test('eleven scientific classroom materials have three-language names',()=>{
 assert.equal(E.MATERIALS.length,11);assert.equal(E.PRESETS.length,8);
 for(const m of E.MATERIALS){
  assert.equal(m.labels.length,3);
  assert(m.labels.every(x=>x.length>=3));
  assert(m.solidDensity>0);
 }
 for(const p of E.PRESETS)assert(E.material(p.a)&&E.material(p.b));
});
test('water melts and boils with transition density deliberately undefined',()=>{
 for(const [t,p] of [[-15,'solid'],[0,'melting'],[4,'liquid'],[20,'liquid'],[100,'boiling'],[120,'gas']])
  assert.equal(E.state('water',t).phase,p);
 assert.equal(E.state('water',0).density,null);
 assert.equal(E.state('water',100).volumeCm3,null);
 assert(E.state('water',4).density>E.state('water',20).density);
 assert(E.state('water',120).volumeLitres>150);
 assert(E.state('water',-10).volumeCm3>E.state('water',20).volumeCm3);
});
test('metal temperature transitions and same-mass comparison',()=>{
 const p=E.compare('lead','aluminum',400);
 assert.equal(p.left.phase,'liquid');
 assert.equal(p.right.phase,'solid');
 assert.equal(p.left.massGrams,100);assert.equal(p.right.massGrams,100);
 assert.equal(E.state('mercury',20).phase,'liquid');
 assert.equal(E.state('aluminum',660).phase,'melting');
 assert.equal(E.state('iron',1538).phase,'melting');
 assert.equal(E.state('iron',3000).phase,'gas');
});
test('cryogenic oxygen and nitrogen transitions',()=>{
 assert.equal(E.state('oxygen',-220).phase,'solid');
 assert.equal(E.state('oxygen',-200).phase,'liquid');
 assert.equal(E.state('oxygen',-100).phase,'gas');
 assert.equal(E.state('nitrogen',-220).phase,'solid');
 assert.equal(E.state('nitrogen',-200).phase,'liquid');
 assert.equal(E.state('nitrogen',-100).phase,'gas');
});
test('carbon dioxide sublimates at atmospheric pressure and never becomes liquid',()=>{
 for(const t of [-230,-100])assert.equal(E.state('carbonDioxide',t).phase,'solid');
 for(const t of [-79,-78])assert.equal(E.state('carbonDioxide',t).phase,'subliming');
 for(const t of [-30,0,100,500])assert.equal(E.state('carbonDioxide',t).phase,'gas');
 assert.equal(E.material('carbonDioxide').boil,null);
 assert.equal(E.state('carbonDioxide',-78).density,null);
});
test('paraffin has melting range and no single invented boiling point',()=>{
 assert.equal(E.state('paraffin',20).phase,'solid');
 for(const t of [47,55,65])assert.equal(E.state('paraffin',t).phase,'softening');
 assert.equal(E.state('paraffin',100).phase,'liquid');
 assert.equal(E.state('paraffin',400).phase,'unmodeled');
 assert.equal(E.state('paraffin',400).density,null);
 assert.equal(E.material('paraffin').boil,null);
});
test('gas density follows ideal gas where molar mass is defined',()=>{
 assert(E.state('oxygen',20).density>E.state('nitrogen',20).density);
 assert(E.state('oxygen',250).density<E.state('oxygen',20).density);
 assert(E.state('oxygen',20).volumeCm3<E.state('nitrogen',20).volumeCm3);
 assert.equal(E.state('sulfur',500).density,null);
 assert.equal(E.state('sulfur',500).phase,'gas');
});
test('mass, pressure and boundary invariants and valid temperature limits',()=>{
 for(const t of [-230,-200,-100,0,20,600,1500,3200]){
  const p=E.compare('water','mercury',t);
  for(const x of [p.left,p.right]){
   assert.equal(x.massGrams,100);
   assert.equal(x.pressureAtm,1);
   if(x.coexistence)assert.equal(x.density,null);
  }
 }
 assert.throws(()=>E.state('water',-231),RangeError);
 assert.throws(()=>E.state('water',3201),RangeError);
 assert.throws(()=>E.state('invalid',20),RangeError);
});
test('same count bounded schematic markers in both visualisation boxes',()=>{
 for(const id of ['water','iron','oxygen','carbonDioxide','paraffin']){
  for(const t of [-200,20,400]){
   const points=E.particles(E.state(id,t),2000);
   assert.equal(points.length,72);
   assert(points.every(p=>[p.x,p.y,p.z].every(v=>v>=0&&v<=1)));
  }
 }
 assert.notDeepEqual(E.particles(E.state('oxygen',20),0),E.particles(E.state('oxygen',20),1000));
});
test('two distinct phase panels, both materials, localized view and no scorekeeping',()=>{
 const html=read('index.html'),js=read('assets/js/phase-compare.js'),density=read('assets/js/density-lab.js');
 for(const id of ['phaseMaterialA','phaseMaterialB','phaseCanvasA','phaseCanvasB','phaseRange','phaseJumpAMelt','phaseJumpBBoil','phaseComparePresets'])
  assert(html.includes('id="'+id+'"'));
 assert(!html.includes('src="assets/js/water-phase.js'));
 assert(html.includes('phase-compare-engine.js?v=0.2117'));
 assert(html.includes('phase-compare.js?v=0.2117'));
 assert(js.includes('ChemistryPhaseCompare={showComparison:'));
 assert(density.includes('window.ChemistryPhaseCompare?.showComparison?.()'));
 for(const s of ['Hőmérséklet és halmazállapot','Temperatur und Aggregatzustand','Temperature and states of matter'])assert(js.includes(s));
 assert(!js.includes('ChemistryLearningProgress'));
});
