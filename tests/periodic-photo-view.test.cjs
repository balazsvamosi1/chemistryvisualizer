/* Photo view integration checks: validate the optional module without a browser runtime. */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('original periodic table and atom detail remain intact',()=>{
 const html=read('index.html');
 assert.match(html,/id="ptable"/);assert.match(html,/id="atomDetail"/);
 assert.match(html,/id="periodTab"/);assert.match(html,/periodic-photo-view\.js/);
 assert.match(html,/periodic-photo-data\.js/);assert.match(html,/periodic-photo-view\.css/);
});
test('optional photo module reuses classic selection and search rendering',()=>{
 const js=read('assets/js/periodic-photo-view.js');
 assert.match(js,/original\.click\(\)/);
 assert.match(js,/renderTable=function\(\)/);
 assert.match(js,/sessionStorage/);
 assert.match(js,/MutationObserver/);
 assert.match(js,/loading='lazy'|loading='eager'|loading="lazy"|im\.loading='lazy'/);
 assert.match(js,/aria-pressed/);
});
test('all 118 elements are mapped and unknown photos have no false sample',()=>{
 const html=read('index.html');
 const raw=html.match(/<script id="element-data" type="application\/json">([\s\S]*?)<\/script>/);
 assert.ok(raw);
 const elements=JSON.parse(raw[1]);
 assert.equal(elements.length,118);
 const src=read('assets/js/periodic-photo-data.js');
 const match=src.match(/Object\.freeze\((\{.*\})\);/s);
 assert.ok(match);
 const photos=JSON.parse(match[1]);
 assert.equal(Object.keys(photos).length,118);
 for(const e of elements)assert.ok(photos[e.z],'No mapping: '+e.z);
 for(const p of Object.values(photos))if(!p.url)assert.equal(p.attribution,'');
});
