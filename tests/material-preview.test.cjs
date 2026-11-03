const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const html=read('index.html'),app=read('assets/js/app-core.js'),learning=read('assets/js/material-learning.js');
const preview=require('../assets/js/material-preview.js');
const materialSource=app.slice(app.indexOf('const materialStructures=')+'const materialStructures='.length);
const models=JSON.parse(materialSource.slice(0,materialSource.indexOf(';\n')));
test('all 68 built-in models are valid and produce drawable geometry',()=>{
 for(let i=0;i<68;i++){
  const model=models[i];assert.ok(model,'material '+i);
  assert.ok(preview.valid(model),'valid material '+i);
  const g=preview.geometry(model);assert.ok(g&&g.atoms.length>0);
  assert.ok(g.atoms.every(a=>Number.isFinite(a.x)&&Number.isFinite(a.y)));
 }
});
test('invalid or missing models are safely described instead of crashing',()=>{
 assert.equal(preview.valid(null),false);
 assert.equal(preview.geometry(null),null);
 assert.equal(preview.valid({atoms:[['O',Infinity,0]],edges:[]}),false);
});
test('viewer has pointer, touch, zoom, keyboard and accessible structure controls',()=>{
 const src=read('assets/js/material-preview.js');
 for(const key of ['pointerdown','pointermove','pointerup','pointercancel','wheel','keydown'])
  assert.ok(src.includes("addEventListener('"+key+"'"),key);
 assert.match(src,/touchAction='none'/);
 assert.match(src,/tabindex:'0'/);
 assert.match(src,/role:'img'/);
 assert.match(src,/aria-label/);
});
test('material details and paired learning both receive true catalogue models',()=>{
 assert.match(app,/ChemistryMaterialPreview\.render\(preview,model,lang/);
 assert.match(app,/return i<0\?null:materialModel\(i\)/);
 assert.match(learning,/previewApi\.render\(view,model,lang/);
 assert.match(learning,/if\(rendered===2\)diff\.append\(structures\)/);
});
test('language changes, search, family switching retain stable detail node and navigation',()=>{
 assert.match(app,/if\(!detail\)\{detail=document\.createElement\('div'/);
 assert.match(app,/grid\.after\(existingDetail\)/);
 assert.match(app,/grid\.replaceChildren\(draft\)/);
 assert.match(app,/ChemistryNavigation\.activate\('moleculeTab',false\)/);
 assert.match(app,/const query=search\.value/);
 assert.match(app,/if\(materialDetailVisible&&!detail\.hidden\)showMaterial\(\)/);
});
test('new assets are cache-busted and loaded before main application code',()=>{
 assert.match(html,/Beta 2\.9\.8/);
 const appIndex=html.indexOf('app-core.js?v=2.9.8');
 assert.ok(appIndex>0);
 assert.ok(html.indexOf('material-preview.js?v=2.9.8')<appIndex);
 assert.ok(html.indexOf('material-learning.js?v=2.9.8')<appIndex);
});
