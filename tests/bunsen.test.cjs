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
