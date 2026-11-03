const test=require('node:test');const assert=require('node:assert/strict');const api=require('../assets/js/molecule-learning.js');
const atoms=s=>s.map((v,i)=>({id:i,s:v}));const bond=(a,b,order=1)=>({a,b,order,kind:'covalent'});
test('water composition and molar mass',()=>{const x=api.analyze({atoms:atoms(['O','H','H']),bonds:[bond(0,1),bond(0,2)]});assert.equal(x.formula,'H2O');assert.ok(Math.abs(x.mass-18.015)<0.02);assert.equal(x.components,1);assert.equal(x.incomplete,0)});
test('carbon dioxide double bonds',()=>{const x=api.analyze({atoms:atoms(['O','C','O']),bonds:[bond(0,1,2),bond(1,2,2)]});assert.equal(x.formula,'CO2');assert.equal(x.incomplete,0);assert.equal(x.exceeded,0)});
test('incomplete methane reports missing explicit H',()=>{const x=api.analyze({atoms:atoms(['C','H']),bonds:[bond(0,1)]});assert.equal(x.incomplete,1)});
test('noncovalent ionic adjacency is not interpreted as a covalent bond',()=>{const x=api.analyze({atoms:atoms(['Na','Cl']),bonds:[{a:0,b:1,order:1,kind:'ionic'}]});assert.equal(x.components,2);assert.ok(x.errors.includes('noncovalent'))});
test('empty model is safe',()=>assert.equal(api.analyze({atoms:[],bonds:[]}).empty,true));
