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
 assert.equal(appearance({gas:true,air:37}).mode,'luminous');
 assert.equal(appearance({gas:true,air:38}).mode,'nonluminous');
});
test('seven curated metal-ion flame tests have distinct educational colours',()=>{
 for(const id of ['Li','Na','K','Ca','Sr','Ba','Cu']){
  assert.match(samples[id].hex,/^#[0-9a-f]{6}$/i);
  assert.equal(appearance({gas:true,air:75,sample:id}).color,samples[id].hex);
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
 assert.equal(model.color,'#ffffff');
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
