const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const source=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=source('assets/js/app-core.js');
const html=source('index.html');
const css=source('assets/css/discovery.css');
const discovery=source('assets/js/chemistry-discovery.js');
const related=require('../assets/js/material-learning.js');
const fam=require('../assets/js/material-families.js');
test('detail appears directly after the selected material card, not below all family tiles',()=>{
 assert.match(app,/b\.after\(detail\)/);
 assert.match(app,/selectedButton\.after\(detail\)/);
 assert.doesNotMatch(app.slice(app.indexOf('function renderMaterials(){'),app.indexOf('function showMaterial(){')),/tiles\.after\(detail\)/);
 assert.match(css,/\.material-family-tiles > #materialDetail/);
 assert.match(css,/grid-column:1\/-1/);
});
test('curated related compounds have grounded structural comparisons',()=>{
 for(const [a,b] of [['Etán','Etén'],['Etén','Etin'],['Metanol','Etanol'],['Grafit','Gyémánt'],['Konyhasó','Szódabikarbóna'],['Polietilén','PVC']]){
  const c=related.matchPair(a,b);assert.ok(c,a+' vs '+b);
  for(const language of ['hu','de','en'])assert.ok(c.difference[['hu','de','en'].indexOf(language)]);
  assert.ok([a,b].includes(c.answer));
 }
 assert.match(related.info({hu:'Etán'},{hu:'Etén'},'hu').difference,/kettős/);
});
test('related compounds are ranked ahead of unrelated materials',()=>{
 const materials=[{hu:'Etán',category:'szerves'},{hu:'Aceton',category:'szerves'},{hu:'Etén',category:'szerves'},{hu:'Etin',category:'szerves'},{hu:'Víz',category:'molecule'}];
 const opts=related.related(materials[0],materials);
 assert.equal(opts[0].hu,'Etén');
 assert.equal(opts[1].hu,'Etin');
});
test('prediction feedback only appears after selecting one of two answers',()=>{
 const code=source('assets/js/material-learning.js');
 assert.match(code,/feedback\.hidden=true/);
 assert.match(code,/feedback\.hidden=false/);
 assert.match(code,/answer===p\.answer/);
 assert.match(code,/setAttribute\('aria-pressed'/);
});
test('original scientific data, offline hosting and legacy modules remain intact',()=>{
 assert.match(app,/function importLibrary\(/);
 assert.match(app,/function activateMaterialModel\(/);
 assert.match(app,/window\.ChemistryMaterialLearning\.renderMaterial/);
 assert.match(discovery,/const recommended=window\.ChemistryMaterialLearning\?\.related/);
 assert.match(html,/Beta 2\.9\.3/);
 const appPosition=html.indexOf('app-core.js?v=2.9.4');
 assert.ok(html.indexOf('material-learning.js?v=2.9.4')<appPosition);
 assert.ok(html.indexOf('chemistry-discovery.js?v=2.9.4')<appPosition);
});
