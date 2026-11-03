const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const html=read('index.html'),js=read('assets/js/acid-base.js'),css=read('assets/css/acid-base.css'),engine=require('../assets/js/acid-base.js');
test('the existing color pH scale is keyboard and pointer accessible',()=>{
 assert.match(html,/id="abInteractiveScale" role="slider" tabindex="0"/);
 assert.match(html,/id="abPhMarker"/);
 assert.match(html,/id="abActualMarker"/);
 assert.match(html,/id="abScaleReadout"/);
 assert.doesNotMatch(html,/id="abTargetSlider"/);
 for(const e of ['pointerdown','pointermove','pointerup','keydown'])assert.ok(js.includes("scale.addEventListener('"+e+"'"));
 assert.match(css,/#abInteractiveScale\{touch-action:none/);
});
test('target value is synchronized and reverse-solved on release',()=>{
 assert.match(js,/function syncTargetUI\(number\)/);
 assert.match(js,/scale\.releasePointerCapture\(e\.pointerId\);runTarget\(\)/);
 assert.match(js,/syncTargetUI\(value\);\s*runTarget\(\)/);
 assert.match(js,/aria-valuenow/);
});
test('color scale visually distinguishes target from actual pH',()=>{
 assert.match(js,/\$\('abActualMarker'\)\.style\.left/);
 assert.match(js,/\$\('abPhMarker'\)\.style\.left/);
 assert.match(js,/\$\('abScaleReadout'\)\.textContent/);
});
test('reverse target pH calculation remains physically consistent',()=>{
 const opts={analyte:'HCl',titrant:'NaOH',analyteM:0.1,titrantM:0.1,analyteMl:25};
 for(const ph of [3,5,7,9,11]){const r=engine.solveForPH(opts,ph);assert.equal(r.reachable,true);assert.ok(Math.abs(engine.solve({...opts,addedMl:r.addedMl}).pH-ph)<1e-3)}
 assert.equal(engine.solveForPH(opts,14).reachable,false);
});
