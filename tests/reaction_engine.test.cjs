const {test}=require('node:test');
const assert=require('node:assert/strict');
const engine=require('../assets/js/reaction-engine.js');
test('five legacy laboratory equations use shared catalog',()=>{
 for(const id of ['water','carbon','methane','neutral','rust']){
  const model=engine.model(id);assert(model,id);assert.equal(engine.check(id,model.solution).ok,true,id);
  assert.equal(engine.analyze(id,model.solution).balanced,true,id);
 }
});
test('new Quest reactions conserve atoms and charge',()=>{
 for(const id of ['limestone','limewater','peroxide','silver','complex']){
  const model=engine.model(id);assert(model);assert.equal(engine.check(id,model.solution).ok,true,id);
  assert.equal(engine.analyze(id,model.solution).balanced,true,id);
 }
});
test('wrong chemical products are rejected even when atoms balance',()=>{
 assert.equal(engine.check('neutral',[1,1,1,1],['HCl','NaOH'],['H2','O2']).reason,'wrong-reaction');
 assert.equal(engine.check('neutral',[1,1,1,1],['HCl','CO2'],['NaCl','H2O']).ok,false);
});
test('wrong coefficients, nonpositive values, and unknown reactions are rejected',()=>{
 assert.equal(engine.check('methane',[1,1,1,1]).ok,false);
 assert.equal(engine.check('neutral',[0,1,1,1]).ok,false);
 assert.equal(engine.check('neutral',[1.5,1,1,1]).ok,false);
 assert.equal(engine.check('missing',[1]).ok,false);
});
test('ionic reactions conserve total electric charge',()=>{
 for(const id of ['complex','silver']){const m=engine.model(id);const x=engine.check(id,m.solution);assert.equal(x.ok,true);assert.equal(x.left.charge,x.right.charge)}
});
