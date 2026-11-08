const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const E=require('../assets/js/density-engine.js'),read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
test('reference densities are positive, labeled and scientifically distinguished',()=>{
 assert.equal(E.MATERIALS.length,27);
 for(const m of E.MATERIALS){assert(m.rho>0,m.id);assert.equal(m.labels.length,3);assert(m.condition);}
 assert.equal(E.material('air').phase,'gas');assert.equal(E.material('iron').structure,'bcc');
 assert.equal(E.material('salt').structure,'ionic');assert.equal(E.material('aluminum').structure,'fcc');
 assert.equal(E.material('unknown'),null);
 assert.equal(E.MATERIALS.filter(m=>m.phase==='gas').length,10);
 for(const id of ['lead','magnesium','zinc','silver','tungsten','osmium','graphite','diamond','hydrogen','helium','nitrogen','oxygen','carbonDioxide','argon','methane','xenon','sulfurHexafluoride']) assert(E.material(id),id);
 assert.equal(E.material('osmium').rho,22.59);
 assert.equal(E.material('lead').rho,11.34);
 assert.equal(E.material('diamond').rho,3.513);
});
test('gas densities follow ideal-gas model at 20°C and 1 atm',()=>{
 const H=E.material('hydrogen'),He=E.material('helium'),CO2=E.material('carbonDioxide');
 assert(Math.abs(H.rho*1000-.083803)<.00001);
 assert(Math.abs(He.rho*1000-.166393)<.00001);
 assert(Math.abs(CO2.rho*1000-1.829528)<.00001);
 assert(CO2.rho>He.rho&&He.rho>H.rho);
 const a=E.compute('helium','carbonDioxide','volume',1000);
 assert(a.right.mass/a.left.mass>10);
 assert.equal(E.particles('helium').length,E.particles('carbonDioxide').length);
});
test('high-density metals and carbon allotropes are distinguishable',()=>{
 assert(E.compute('magnesium','lead','volume',1000).right.mass>11000);
 assert(E.compute('osmium','magnesium','mass',1000).left.volume<100);
 assert(E.material('diamond').rho>E.material('graphite').rho);
 assert.equal(E.material('lead').structure,'fcc');
 assert.equal(E.material('magnesium').structure,'hcp');
 assert.equal(E.material('graphite').structure,'layered');
});
test('classroom dots represent equal grams, not literal atoms',()=>{
 const c=E.compute('lead','aluminum','volume',5000);
 const p=E.teachingPlan(c);
 assert.equal(p.left.gramsPerMarker,p.right.gramsPerMarker);
 assert(p.left.count>=p.right.count*3.8&&p.left.count<=p.right.count*4.5,
  'Lead should visibly look denser than aluminium with identical sized dots');
 assert(c.left.density>c.right.density);
 const wood=E.teachingPlan(E.compute('wood','water','volume',5000));
 assert.equal(wood.left.gramsPerMarker,wood.right.gramsPerMarker);
});
test('same mass gives the same number of simple dots in differently sized boxes',()=>{
 const c=E.compute('lead','aluminum','mass',1000);
 const p=E.teachingPlan(c);
 assert.equal(p.left.count,p.right.count);
 assert(c.left.volume<c.right.volume);
});
test('larger specimens add simple dots, not change bulk density',()=>{
 const quantities=[100,500,1000,2500,5000];
 for(const pair of [['lead','aluminum'],['water','argon'],['water','wood']]){
  const plans=quantities.map(q=>E.teachingPlan(E.compute(pair[0],pair[1],'volume',q)));
  for(let i=1;i<plans.length;i++){
   assert(plans[i].left.count>=plans[i-1].left.count);
   assert(plans[i].right.count>=plans[i-1].right.count);
   assert.equal(plans[i].gramsPerMarker,plans[0].gramsPerMarker);
  }
  assert(plans.at(-1).left.count<=E.MAX_MARKERS);
  assert(plans.at(-1).right.count<=E.MAX_MARKERS);
 }
});
test('a shared deterministic dot grid is independent of material and bounded',()=>{
 for(const count of [1,15,90,180,250]){
  const a=E.teachingMarkers(count),b=E.teachingMarkers(count);
  assert.deepEqual(a,b);
  assert(a.every(point=>[point.x,point.y,point.z].every(v=>v>=0&&v<=1)));
  if(count>1)assert.deepEqual(a.slice(0,1),E.teachingMarkers(1));
 }
 assert.throws(()=>E.teachingMarkers(251));
});
test('proportional particle icons: water and lead have similar number density, not similar mass',()=>{
 const x=E.compute('water','lead','volume',1000);
 const p=E.particlePlan(x);
 assert(Math.abs(p.left.count-p.right.count)<=2,'Water molecules and Pb atoms should have comparable number density');
 assert(x.right.mass/x.left.mass>11);
 assert.equal(p.left.perMarker,p.right.perMarker);
 assert(Math.abs(p.left.moles-p.right.moles)<2);
 assert(p.left.particleCount>1e25);
 assert(p.right.particleCount>1e25);
});
test('increasing volume must increase icons; shared unit remains constant for a material pair',()=>{
 const a=E.particlePlan(E.compute('water','lead','volume',100));
 const b=E.particlePlan(E.compute('water','lead','volume',1000));
 const c=E.particlePlan(E.compute('water','lead','volume',5000));
 assert(a.left.count<b.left.count&&b.left.count<c.left.count);
 assert(a.right.count<b.right.count&&b.right.count<c.right.count);
 assert.equal(a.left.perMarker,b.left.perMarker);
 assert.equal(b.left.perMarker,c.left.perMarker);
 assert(c.left.count<=E.MAX_MARKERS);
});
test('bulk density never changes while volume and particle counts increase',()=>{
 for(const id of ['water','lead','helium','wood']){
  const series=[100,500,1000,2500,5000].map(q=>E.compute(id,id,'volume',q));
  for(let i=1;i<series.length;i++){
   assert.equal(series[i].left.density,series[0].left.density);
   assert(series[i].left.mass>series[i-1].left.mass);
   assert(series[i].left.volume>series[i-1].left.volume);
  }
 }
});
test('equal mass: molecular count depends on molar mass',()=>{
 const p=E.particlePlan(E.compute('water','lead','mass',1000));
 assert(p.left.count>p.right.count*7);
});
test('equal-volume gases have approximately equal molecule counts under the ideal gas model',()=>{
 const p=E.particlePlan(E.compute('helium','carbonDioxide','volume',1000));
 assert.equal(p.left.count,p.right.count);
 assert.equal(p.left.category,'gas');
 assert(p.left.perMarker<1);
});
test('water and argon use one common physical particle scale',()=>{
 const comparison=E.compute('water','argon','volume',5000),p=E.particlePlan(comparison);
 assert.equal(p.left.perMarker,p.right.perMarker);
 assert(p.left.count>80);
 assert.equal(p.right.count,1);
 assert(p.right.approximate);
 assert(p.right.equivalent<.5);
 assert(p.right.markerOpacity<=.32);
 assert(p.left.moles/p.right.moles>1300&&p.left.moles/p.right.moles<1400);
 assert(Math.abs(comparison.left.density/comparison.right.density-601)<3);
});
test('gas and condensed matter share the same moles-per-symbol scale',()=>{
 const p=E.particlePlan(E.compute('hydrogen','lead','volume',1000));
 assert.notEqual(p.left.category,p.right.category);
 assert.equal(p.left.perMarker,p.right.perMarker);
});
test('argon and helium show equal marker counts for equal gas volumes',()=>{
 const p=E.particlePlan(E.compute('argon','helium','volume',5000));
 assert.equal(p.left.perMarker,p.right.perMarker);
 assert.equal(p.left.count,p.right.count);
 assert(p.left.count>30);
});
test('representative particle positions are deterministic, bounded, and count-controlled',()=>{
 for(const id of ['water','lead','salt','diamond','helium','wood']){
  for(const n of [1,12,100,250]){
   const points=E.particleMarkers(id,n);
   assert.equal(points.length,n);
   assert.deepEqual(points,E.particleMarkers(id,n));
   assert(points.every(p=>[p.x,p.y,p.z].every(v=>v>=0&&v<=1)));
  }
 }
 assert.throws(()=>E.particleMarkers('lead',251));
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
 assert(nodes.get('densitySelectedA').textContent.includes('0,998 g/cm³'));
 assert(nodes.get('densitySelectedB').textContent.includes('2,7 g/cm³'));
 assert(nodes.get('densityMaterialA').children.some(group=>group.children.some(o=>o.textContent.includes('g/cm³'))));

 assert(nodes.get('densityParticleInfoA').textContent.includes('Szemléltető pontok'));
 assert(nodes.get('densityParticleInfoA').textContent.includes('1 pont ='));
 assert(!nodes.get('densityParticleInfoB').textContent.includes('mol'));
 assert(nodes.get('densityModelInfo').textContent.includes('NEM kvantumfizikai'));
 assert.equal(nodes.get('densityAdvanced').checked,false);
 nodes.get('densityPreset5').emit('click');
 const simple=win.ChemistryDensityLab.getDisplayPlan();
 assert(simple.left.count>simple.right.count*3.5);
 nodes.get('densityAdvanced').checked=true;nodes.get('densityAdvanced').emit('change');
 assert(nodes.get('densityParticleInfoA').textContent.includes('Részecskejelek'));
 assert(nodes.get('densityParticleInfoB').textContent.includes('mol'));
 assert(nodes.get('densityModelInfo').textContent.includes('nem kvantumfizikai'));
 nodes.get('densityMaterialA').value='water';nodes.get('densityMaterialB').value='aluminum';
 nodes.get('densityMaterialB').emit('change');
 assert.equal(nodes.get('densityMeterFillA').style.width,'36.963%');
 assert.equal(nodes.get('densityMeterFillB').style.width,'100.000%');
 assert(nodes.get('densityComparisonLead').textContent.includes('2,71'));
 nodes.get('densityMode').value='mass';nodes.get('densityMode').emit('change');
 result=win.ChemistryDensityLab.getComparison();
 assert.equal(result.left.mass,1000);assert.equal(result.right.mass,1000);
 assert.equal(nodes.get('densityMeterFillA').style.width,'100.000%');
 assert.equal(nodes.get('densityMeterFillB').style.width,'36.963%');
 assert(nodes.get('densityComparisonLead').textContent.includes('térfogatú'));
 nodes.get('densityPreset5').emit('click');
 assert.equal(win.ChemistryDensityLab.getComparison().left.id,'lead');
 nodes.get('densityPreset7').emit('click');
 assert.equal(win.ChemistryDensityLab.getComparison().left.id,'helium');
 assert.equal(win.ChemistryDensityLab.getComparison().right.id,'carbonDioxide');
 nodes.get('densityMaterialA').value='water';nodes.get('densityMaterialB').value='argon';
 nodes.get('densityMode').value='volume';nodes.get('densityMode').emit('change');
 assert(nodes.get('densityParticleInfoB').textContent.includes('Részecskejel-egyenérték'));
 assert(nodes.get('densityExplanation').children.some(child=>child.textContent?.includes('Közös részecskeszámskála')));
 assert(nodes.get('densityExplanation').children.some(child=>child.textContent?.includes('0,001661')));
 nodes.get('densityMaterialA').value='helium';nodes.get('densityMaterialB').value='carbonDioxide';
 nodes.get('densityMode').emit('change');
 assert.match(nodes.get('densitySelectedA').textContent,/0,00016\d+ g\/cm³/);
 assert(nodes.get('densitySelectedB').textContent.endsWith('g/cm³'));
 assert(nodes.get('densityExplanation').children.some(child=>child.className==='density-gas-note'));
 nodes.get('densityPreset1').emit('click');
 assert.equal(win.ChemistryDensityLab.getComparison().right.id,'ice');
 nodes.get('densityShape').value='cuboid';nodes.get('densityShape').emit('change');
 result=win.ChemistryDensityLab.getComparison();
 assert(Math.abs(result.left.dimensions.reduce((a,x)=>a*x,1)-result.left.volume)<1e-7);
 setLanguage('de');assert.equal(nodes.get('densityTab').textContent,'Dichte');
 assert(nodes.get('densityAdvancedLabel').textContent.includes('Erweitert'));
 setLanguage('en');assert.equal(nodes.get('densityTab').textContent,'Density');
 assert(nodes.get('densityAdvancedLabel').textContent.includes('Advanced'));
 nodes.get('densityAdvanced').checked=false;nodes.get('densityAdvanced').emit('change');
 assert(nodes.get('densityParticleInfoA').textContent.includes('Illustrative dots'));
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

test('Academy density lab bridge exposes scenario configuration while preserving standalone Explore mode',()=>{
 const js=read('assets/js/density-lab.js'),academy=read('assets/js/chemistry-curriculum.js');
 assert(js.includes('function configure(scenario)'));
 assert(js.includes('window.ChemistryDensityLab={render,localize,configure,'));
 assert(academy.includes("academyTopic('density','densityTab'"));
 assert(academy.includes("function renderDensityDiscovery(content)"));
 assert(academy.includes("function densityLabOpen()"));
 assert(!academy.includes("record('density'"));
});
