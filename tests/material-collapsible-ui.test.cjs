const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('assets/js/app-core.js'),css=read('assets/css/discovery.css'),html=read('index.html');
const render=app.slice(app.indexOf('function renderMaterials(){'),app.indexOf('\nfunction showMaterial(){'));
test('material categories render as selectable square periodic-table family cells',()=>{
 assert.match(render,/className='material-family-cell'/);
 assert.doesNotMatch(render,/material-family-code/);
 assert.doesNotMatch(render,/familyCodes=/);
 assert.match(render,/cell\.append\(short,count\)/);
 assert.match(render,/document\.createElement\('button'\)/);
 assert.match(css,/#materialsSection \.material-family-cell\{/);
 assert.match(css,/aspect-ratio:1\/1/);
 assert.match(css,/grid-template-columns:repeat\(6,minmax\(0,1fr\)\)/);
});
test('only one expanded family is displayed below the square category grid',()=>{
 assert.match(app,/let activeMaterialFamily=null/);
 assert.match(render,/activeMaterialFamily=wasOpen\?null:key/);
 assert.match(render,/grid\.insertBefore\(expandedArea,familyCells\[afterRow\]\|\|null\)/);
 assert.match(render,/Math\.ceil\(\(activeCellIndex\+1\)\/columns\)\*columns/);
 assert.match(render,/className='material-family-expanded'/);
});
test('selected material detail opens inline rather than at bottom of library',()=>{
 assert.match(render,/button\.after\(detail\)/);
 assert.match(render,/selected\.after\(detail\)/);
 assert.doesNotMatch(render,/scrollIntoView/);
});
test('redundant material type filters are absent, while search and JSON data handling remain',()=>{
 assert.doesNotMatch(html,/id="materialFilters"/);
 assert.doesNotMatch(html,/id="materialFilterSummary"/);
 assert.match(html,/id="materialSearch"/);
 assert.match(html,/id="materialImportSummary"/);
 assert.match(app,/function importLibrary\(/);
 assert.match(app,/function activateMaterialModel\(/);
});
test('material expansion and scientific learning are still connected',()=>{
 assert.match(app,/window\.ChemistryDiscovery\.renderMaterial/);
 assert.match(app,/window\.ChemistryMaterialLearning\.renderMaterial/);
 assert.match(html,/Beta 2\.9\.7/);
});

test('material detail is reattached before switching family and after rebuilding',()=>{
 assert.match(render,/grid\.after\(existingDetail\)/);
 assert.match(render,/grid\.after\(detail\)/);
 assert.match(render,/if\(!detail\)\{detail=document\.createElement\('div'\)/);
 assert.match(render,/const draft=document\.createDocumentFragment\(\)/);
 assert.match(render,/grid\.replaceChildren\(draft\)/);
});
test('interactive material models synchronize with modern tab navigation',()=>{
 assert.match(app,/ChemistryNavigation\?\.activate/);
 assert.match(app,/ChemistryNavigation\.activate\('moleculeTab',false\)/);
 assert.match(app,/centerPreset\(key\)/);
});
