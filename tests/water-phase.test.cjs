const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const E=require('../assets/js/water-phase-engine.js');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
test('temperature/phase transitions correctly bracket ice, liquid, vapour at 1 atm',()=>{
 for(const [t,phase] of [[-30,'solid'],[-15,'solid'],[0,'melting'],[4,'liquid'],[20,'liquid'],[99,'liquid'],[100,'boiling'],[120,'gas']]){
  const s=E.phaseAt(t);
  assert.equal(s.phase,phase);
  assert.equal(s.pressureAtm,1);
  assert.equal(s.sampleMassGrams,100);
  assert.equal(s.schematicMolecules,72);
 }
 assert.throws(()=>E.phaseAt(-31),RangeError);
 assert.throws(()=>E.phaseAt(121),RangeError);
 assert.throws(()=>E.phaseAt(Number.NaN),RangeError);
});
test('water at 4°C is densest locally, ice less dense and gas much more dilute',()=>{
 const ice=E.phaseAt(-10),cold=E.phaseAt(4),room=E.phaseAt(20),hot=E.phaseAt(99),vapor=E.phaseAt(120);
 assert(Math.abs(ice.density-.917)<.005);
 assert(cold.density>room.density&&room.density>hot.density);
 assert(Math.abs(room.density-.9982)<.0003);
 assert(hot.density>.95&&hot.density<.97);
 assert(vapor.density>.0005&&vapor.density<.0006);
 assert(ice.volumeCm3>room.volumeCm3);
 assert(vapor.volumeCm3>room.volumeCm3*1400);
 assert(vapor.volumeLitres>150);
});
test('temperature alone must not prescribe a mass fraction at phase boundaries',()=>{
 for(const t of [0,100]){
  const s=E.phaseAt(t);
  assert.equal(s.coexistence,true);
  assert.equal(s.density,null);
  assert.equal(s.volumeCm3,null);
  assert.equal(s.volumeLitres,null);
 }
});
test('exactly 72 H₂O markers in all states and bounded coordinates',()=>{
 for(const phase of ['solid','melting','liquid','boiling','gas']){
  for(const t of [0,1000,5000]){
   const points=E.molecules(phase,t);
   assert.equal(points.length,72);
   assert(points.every(p=>p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1&&p.z>=0&&p.z<=1));
  }
 }
 assert(E.molecules('solid',2000).every(p=>p.part==='solid'));
 assert(E.molecules('gas',2000).every(p=>p.part==='gas'));
 assert.equal(E.molecules('melting',2000).filter(p=>p.part==='solid').length,36);
 assert.equal(E.molecules('boiling',2000).filter(p=>p.part==='gas').length,36);
 assert.notDeepEqual(E.molecules('gas',0),E.molecules('gas',3000));
});
test('phase view stays separate, localizable and does not modify Density scientific comparison',()=>{
 const html=read('index.html'),js=read('assets/js/water-phase.js'),densityJs=read('assets/js/density-lab.js');
 for(const id of ['densityViewCompare','densityViewPhase','phaseTemperature','phaseCanvas','phasePressure','phaseCaution','phasePreset0','phasePreset100'])
  assert(html.includes('id="'+id+'"'),id);
 assert(html.includes('water-phase-engine.js?v=0.2116'));
 assert(html.includes('water-phase.js?v=0.2116'));
 assert(js.includes("showComparison:()=>show('compare')"));
 assert(js.includes('getSnapshot:current'));
 assert(densityJs.includes('window.ChemistryWaterPhase?.showComparison?.()'));
 for(const term of ['Hőmérséklet és halmazállapot','Temperatur und Aggregatzustand','Temperature and states of matter'])
  assert(js.includes(term),term);
 assert(!js.includes('ChemistryLearningProgress'));
});
