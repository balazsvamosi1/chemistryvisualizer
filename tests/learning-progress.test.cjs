const test=require('node:test'),assert=require('node:assert/strict');
const p=require('../assets/js/learning-progress.js');
test('competency categories and correct proportions',()=>{
 p.clear();
 assert.equal(p.record('atoms',true,'academy'),true);
 assert.equal(p.record('hunt',false,'hunt'),true);
 assert.equal(p.stats('atoms').total,2);
 assert.equal(p.stats('atoms').correct,1);
 assert.equal(p.stats('atoms').accuracy,50);
 assert.equal(p.record('unknown',false),false);
 assert.equal(p.record('atoms','true'),false);
 assert.equal(p.stats('atoms').total,2);
 p.clear();
});
test('weak topics only after three attempts; no previous result left after clear',()=>{
 p.clear();for(let i=0;i<3;i++)p.record('stoich',false);
 assert.ok(p.weak().includes('stoich'));assert.equal(p.snapshot().history.length,3);
 p.clear();assert.equal(p.stats('stoich').accuracy,null);assert.equal(p.snapshot().history.length,0);
});
test('academy topics normalize to seven science competencies',()=>{
 assert.equal(p.normalize('bunsen-upper'),'experiments');
 assert.equal(p.normalize('quest'),'reactions');
 assert.equal(p.normalize('bonds'),'bonds');
});
