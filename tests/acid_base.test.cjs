const test=require('node:test');
const assert=require('node:assert/strict');
const acid=require('../assets/js/acid-base.js');
const close=(a,b,tolerance=0.03)=>assert(Math.abs(a-b)<tolerance,`pH ${a}, expected ${b}`);
test('strong acid and strong base pH at 25 C',()=>{
 close(acid.solve({analyte:'HCl',titrant:'NaOH',addedMl:0}).pH,1);
 close(acid.solve({analyte:'NaOH',titrant:'HCl',addedMl:0}).pH,13);
});
test('strong acid/strong base equivalence at 25 mL and pH 7',()=>{
 const r=acid.solve({analyte:'HCl',titrant:'NaOH',addedMl:25});
 assert.equal(r.equivalenceMl,25);close(r.pH,7);
});
test('weak acetic acid starting pH, half equivalence and basic equivalence',()=>{
 close(acid.solve({analyte:'CH3COOH',titrant:'NaOH',addedMl:0}).pH,2.875);
 close(acid.solve({analyte:'CH3COOH',titrant:'NaOH',addedMl:12.5}).pH,4.745);
 close(acid.solve({analyte:'CH3COOH',titrant:'NaOH',addedMl:25}).pH,8.722);
});
test('ammonia titration has basic start and acidic equivalence',()=>{
 close(acid.solve({analyte:'NH3',titrant:'HCl',addedMl:0}).pH,11.125);
 close(acid.solve({analyte:'NH3',titrant:'HCl',addedMl:25}).pH,5.278);
});
test('curve increases for acid titrated with base',()=>{
 const samples=acid.curve({analyte:'HCl',titrant:'NaOH'},121);
 assert.equal(samples.length,121);
 assert(samples[0].pH<samples[60].pH&&samples[60].pH<samples[120].pH);
});
test('opposite acid/base pair and input validation',()=>{
 assert.throws(()=>acid.solve({analyte:'HCl',titrant:'HNO3'}));
 assert.throws(()=>acid.solve({analyte:'HCl',titrant:'NaOH',analyteM:0}));
 assert.throws(()=>acid.solve({analyte:'NH3',titrant:'HCl',addedMl:-2}));
});
test('indicator ranges and color responses',()=>{
 assert.equal(acid.indicatorColor(2,'methylOrange'),acid.indicators.methylOrange.acid);
 assert.equal(acid.indicatorColor(11,'phenolphthalein'),acid.indicators.phenolphthalein.base);
});
