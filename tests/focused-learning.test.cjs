const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const ab=require('../assets/js/acid-base.js');
function setup(analyte,titrant){return{analyte,titrant,analyteM:0.1,titrantM:0.1,analyteMl:25}}
test('strong acid/base reverse pH 7 returns equivalence at 25mL',()=>{const r=ab.solveForPH(setup('HCl','NaOH'),7);assert.equal(r.reachable,true);assert.ok(Math.abs(r.addedMl-25)<1e-4);assert.ok(Math.abs(r.pH-7)<1e-4)});
test('reverse solver works below equivalence',()=>{const o=setup('HCl','NaOH'),r=ab.solveForPH(o,3);assert.equal(r.reachable,true);assert.ok(r.addedMl<25);assert.ok(Math.abs(ab.solve({...o,addedMl:r.addedMl}).pH-3)<1e-4)});
test('reverse solver works for weak acid',()=>{const r=ab.solveForPH(setup('CH3COOH','NaOH'),7);assert.equal(r.reachable,true);assert.ok(Math.abs(r.pH-7)<1e-4)});
test('reverse solver works in descending pH for weak base',()=>{const r=ab.solveForPH(setup('NH3','HCl'),7);assert.equal(r.reachable,true);assert.ok(Math.abs(r.pH-7)<1e-4)});
test('unreachable pH is explicit',()=>{const r=ab.solveForPH(setup('HCl','NaOH'),14);assert.equal(r.reachable,false);assert.ok(r.endPH<14)});
test('invalid pH is rejected',()=>{assert.throws(()=>ab.solveForPH(setup('HCl','NaOH'),-0.1));assert.throws(()=>ab.solveForPH(setup('HCl','NaOH'),14.1))});
test('pH target, three-choice prediction and result view are wired',()=>{const html=read('index.html'),js=read('assets/js/acid-base.js');for(const id of ['abTargetPH','abTargetSolve','abTargetResult','abMissionPredict','abMissionPredictBase','abMissionPredictNeutral','abMissionTry','abMissionNext']){assert.match(html,new RegExp('id="'+id+'"'));assert.ok(js.includes(id))}});
test('burner part labels sit adjacent to SVG',()=>{const html=read('index.html');assert.ok(html.indexOf('class="bunsen-diagram-parts"')>html.indexOf('id="bunsenSvg"'));assert.ok(html.indexOf('class="bunsen-diagram-parts"')<html.indexOf('id="bunsenZone"'))});
test('navigation supports four learning areas',()=>{const js=read('assets/js/chemistry-navigation.js');for(const name of ['explore','experiment','learn','advanced'])assert.ok(js.includes("key:'"+name+"'"))});
