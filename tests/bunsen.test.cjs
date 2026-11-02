const test=require('node:test');
const assert=require('node:assert/strict');
const {samples,appearance}=require('../assets/js/bunsen.js');
test('gas valve controls whether any flame is shown',()=>{
 assert.equal(appearance({gas:false,air:90,sample:'Na'}).lit,false);
 assert.equal(appearance({gas:true,air:90,sample:'none'}).lit,true);
});
test('air collar selects luminous vs nonluminous flame',()=>{
 assert.equal(appearance({gas:true,air:0}).mode,'luminous');
 assert.equal(appearance({gas:true,air:100}).mode,'nonluminous');
 assert.equal(appearance({gas:true,air:37}).mode,'transition');
 assert.equal(appearance({gas:true,air:38}).mode,'transition');
});
test('seven curated metal-ion flame tests have distinct educational colours',()=>{
 for(const id of ['Li','Na','K','Ca','Sr','Ba','Cu']){
  assert.match(samples[id].hex,/^#[0-9a-f]{6}$/i);
  assert.match(appearance({gas:true,air:75,sample:id}).color,/^#[0-9a-f]{6}$/i);
 }
 assert.notEqual(samples.Na.hex,samples.Ba.hex);
 assert.notEqual(samples.Cu.hex,samples.Li.hex);
});
test('air and unknown sample values do not break the model',()=>{
 assert.equal(appearance({gas:true,air:150}).air,100);
 assert.equal(appearance({gas:true,air:-50}).air,0);
 assert.equal(appearance({gas:true,sample:'unlisted'}).sample,'none');
});

test('air adjustment changes flame width and height continuously',()=>{
 const low=appearance({gas:true,air:0});
 const middle=appearance({gas:true,air:50});
 const high=appearance({gas:true,air:100});
 assert(low.width>middle.width&&middle.width>high.width);
 assert(low.height>middle.height&&middle.height>high.height);
 assert.notEqual(low.color,high.color);
});
test('burning magnesium is distinguished from a conventional salt flame test',()=>{
 const model=appearance({gas:true,air:65,sample:'Mg'});
 assert.equal(model.color,appearance({gas:true,air:65,sample:'none'}).color);
 assert.equal(model.kind,'combustion');
 assert.equal(model.sparks,true);
 assert.equal(appearance({gas:true,air:65,sample:'Fe'}).kind,'sparks');
});
test('extended flame sample catalogue includes additional metals',()=>{
 for(const symbol of ['Rb','Cs','B','In','Zn','Mg','Al','Fe']){
  assert(samples[symbol],symbol);
  assert(appearance({gas:true,sample:symbol}).lit);
 }
});

test('each Bunsen sample has a scientifically classified equation',()=>{
 const {equations}=require('../assets/js/bunsen.js');
 for(const sample of Object.keys(samples)){
  assert(equations[sample],sample);
  assert(equations[sample].lines.length>0,sample);
 }
 assert.equal(equations.Mg.lines[0],'2 Mg + O₂ → 2 MgO');
 assert.equal(equations.Al.lines[0],'4 Al + 3 O₂ → 2 Al₂O₃');
 assert.equal(equations.Fe.lines[0],'3 Fe + 2 O₂ → Fe₃O₄');
 assert.equal(equations.Na.type,'emission');
 assert.equal(equations.B.type,'compound');
});

test('air transition is smooth at the former 38-percent cutoff',()=>{
 const a=appearance({gas:true,air:37,gasFlow:65}),b=appearance({gas:true,air:38,gasFlow:65});
 assert.equal(a.mode,'transition');assert.equal(b.mode,'transition');
 assert(Math.abs(a.blueShare-b.blueShare)<0.025);
 assert(Math.abs(a.height-b.height)<=1);
});
test('gas flow independently changes flame height while air regulates combustion',()=>{
 const low=appearance({gas:true,air:65,gasFlow:15});
 const high=appearance({gas:true,air:65,gasFlow:90});
 assert(high.height>low.height+70);
 assert.equal(low.mode,high.mode);
 assert.equal(appearance({gas:true,air:65,gasFlow:0}).lit,false);
});
test('emission is species-aware and avoids misleading one-line color assignments',()=>{
 const {emissionData,equations}=require('../assets/js/bunsen.js');
 assert(emissionData.Ca.emitter.includes('CaOH'));
 assert(emissionData.Ba.emitter.includes('Ba⁺'));
 assert(emissionData.Cu.emitter.includes('CuCl'));
 assert(emissionData.K.lines.includes(766.5));
 assert.deepEqual(equations.Na.lines,['X + energia → X*','X* → X + hν']);
});
