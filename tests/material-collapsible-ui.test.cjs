const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('assets/js/app-core.js'),css=read('assets/css/discovery.css'),html=read('index.html');
const list=app.slice(app.indexOf('function renderMaterials(){'),app.indexOf('\nfunction showMaterial(){'));
test('family headings are accessible, keyboard-operated native details',()=>{
 assert.match(list,/document\.createElement\('details'\)/);
 assert.match(list,/document\.createElement\('summary'\)/);
 assert.match(list,/family\.className='material-family-group'/);
});
test('families start collapsed; open state is retained during rerenders',()=>{
 assert.match(list,/family\.open=Boolean\(query\)\|\|materialOpenFamilies\.has\(key\)/);
 assert.match(app,/const materialOpenFamilies=new Set\(\)/);
});
test('card details stay inside their selected family, without auto-scroll',()=>{
 assert.match(list,/tiles\.after\(detail\)/);
 assert.doesNotMatch(list,/scrollIntoView/);
 assert.match(list,/if\(materialDetailVisible&&items\.some/);
});
test('only one material selection is shown at a time',()=>{
 assert.match(list,/container\.querySelectorAll\('\.materialTile'\)/);
 assert.match(list,/button\.classList\.toggle\('selected',active\)/);
});
test('search expands only matching families without persisting all groups',()=>{
 assert.match(list,/if\(!query\)materialOpenFamilies\.add\(key\)/);
 assert.match(list,/if\(!visible\.length\)/);
});
test('all prior material features remain present',()=>{
 assert.match(app,/function importLibrary\(/);
 assert.match(app,/function showMaterial\(/);
 assert.match(app,/function activateMaterialModel\(/);
 assert.match(app,/window\.ChemistryDiscovery\.renderMaterial/);
 assert.match(css,/#materialsSection \.material-family-tiles/);
 assert.match(html,/Beta 2\.9\.1/);
});
