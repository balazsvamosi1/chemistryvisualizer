const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const E=require('../assets/js/density-engine.js'),read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
test('reference densities are positive, labeled and scientifically distinguished',()=>{
 assert.equal(E.MATERIALS.length,10);
 for(const m of E.MATERIALS){assert(m.rho>0,m.id);assert.equal(m.labels.length,3);assert(m.condition);}
 assert.equal(E.material('air').phase,'gas');assert.equal(E.material('iron').structure,'bcc');
 assert.equal(E.material('salt').structure,'ionic');assert.equal(E.material('aluminum').structure,'fcc');
 assert.equal(E.material('unknown'),null);
});
test('same volume: 1 litre water vs aluminium, mass = density times volume',()=>{
 const x=E.compute('water','aluminum','volume',1000);
 assert.equal(x.left.volume,1000);assert.equal(x.right.volume,1000);
 assert.equal(x.left.mass,998);assert.equal(x.right.mass,2700);
 assert(Math.abs(x.densityRatio-(.998/2.7))<1e-12);
});
test('same mass: less dense samples occupy more space and shape keeps volume',()=>{
 const x=E.compute('air','copper','mass',1000,'cuboid');
 assert.equal(x.left.mass,1000);assert.equal(x.right.mass,1000);
 assert(x.left.volume>800000);assert(x.right.volume<112);
 for(const b of [x.left,x.right]){const d=b.dimensions;assert(Math.abs(d.reduce((a,v)=>a*v,1)/b.volume-1)<1e-10);}
});
test('cubes, cuboids and floating examples distinguish phases and solubility',()=>{
 assert.deepEqual(E.dimensions(125,'cube'),[5,5,5]);
 assert.equal(E.waterResult('ice'),'floats');
 assert.equal(E.waterResult('wood'),'floats');
 assert.equal(E.waterResult('iron'),'sinks');
 assert.equal(E.waterResult('salt'),'dissolves');
 assert.equal(E.waterResult('water'),'not-applicable');
 assert.throws(()=>E.compute('missing','water'));
 assert.throws(()=>E.compute('water','ice','volume',0));
 assert.throws(()=>E.dimensions(-1));
});
test('particle diagrams are deterministic, bounded, and not used in density calculation',()=>{
 for(const m of E.MATERIALS){
  const particles=E.particles(m.id);assert(particles.length>0,m.id);
  assert.deepEqual(particles,E.particles(m.id));
  for(const p of particles)assert([p.x,p.y,p.z].every(v=>v>=0&&v<=1),m.id);
 }
 const same=E.compute('water','water');
 assert.equal(same.left.mass,same.right.mass);
});
function bootUI(){
 const src=read('assets/js/density-lab.js'),html=read('index.html');
 const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
 const nodes=new Map(),events=[];
 let activeLang='hu';
 function create(id){
  const n={id,textContent:'',value:'',checked:false,min:'',max:'',step:'',width:400,height:282,
   listeners:{},children:[],style:{},classList:{contains:k=>k==='active'&&id===activeLang},
   addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)},
   emit(k,e={}){for(const fn of this.listeners[k]||[])fn(e);},
   replaceChildren(...a){this.children=[...a]},
   append(...a){this.children.push(...a)},
   setAttribute(){},setPointerCapture(){},
   getBoundingClientRect(){return{width:370,height:282}},
   getContext(){const c={setTransform(){},clearRect(){},fillRect(){},beginPath(){},closePath(){},fill(){},stroke(){},arc(){},moveTo(){},lineTo(){}};return c;}
  };return n;
 }
 for(const id of ids)nodes.set(id,create(id));
 nodes.get('densityMode').value='volume';nodes.get('densityShape').value='cube';
 nodes.get('densityQuantity').value='1000';nodes.get('densityParticles').checked=true;
 const doc={getElementById:id=>nodes.get(id)||null,createElement:tag=>create(tag)};
 const win={ChemistryDensityEngine:E,devicePixelRatio:1,addEventListener:(name,fn)=>events.push([name,fn])};
 vm.runInNewContext(src,{document:doc,window:win,queueMicrotask:fn=>fn(),requestAnimationFrame:fn=>fn(),Intl,Math});
 return{nodes,win,setLanguage:id=>{activeLang=id;nodes.get(id).emit('click');}};
}
test('browser UI boots without backend, renders both samples and reacts to controls',()=>{
 const {nodes,win,setLanguage}=bootUI();
 assert(win.ChemistryDensityLab,'Browser module did not initialize');
 let result=win.ChemistryDensityLab.getComparison();
 assert.equal(result.left.mass,998);assert.equal(result.right.mass,2700);
 assert(nodes.get('densityResultA').children.length>=5);
 nodes.get('densityMode').value='mass';nodes.get('densityMode').emit('change');
 result=win.ChemistryDensityLab.getComparison();
 assert.equal(result.left.mass,1000);assert.equal(result.right.mass,1000);
 nodes.get('densityPreset1').emit('click');
 assert.equal(win.ChemistryDensityLab.getComparison().right.id,'ice');
 nodes.get('densityShape').value='cuboid';nodes.get('densityShape').emit('change');
 result=win.ChemistryDensityLab.getComparison();
 assert(Math.abs(result.left.dimensions.reduce((a,x)=>a*x,1)-result.left.volume)<1e-7);
 setLanguage('de');assert.equal(nodes.get('densityTab').textContent,'Dichte');
 setLanguage('en');assert.equal(nodes.get('densityTab').textContent,'Density');
});
test('all density assets are local and the Explore navigation includes density',()=>{
 const html=read('index.html'),navigation=read('assets/js/chemistry-navigation.js'),home=read('assets/js/chemistry-home.js'),module=read('assets/js/density-lab.js');
 assert(html.includes('id="densitySection"')&&html.includes('id="densityTab"'));
 for(const file of ['assets/js/density-engine.js','assets/js/density-lab.js','assets/css/density-lab.css'])assert(html.includes(file));
 assert(navigation.includes("densityTab:'densitySection'"));
 assert(navigation.includes("'densityTab','homeTab'"));
 assert(home.includes("'densityTab'"));
 assert(!module.includes('fetch(')&&!module.includes('import('));
});
