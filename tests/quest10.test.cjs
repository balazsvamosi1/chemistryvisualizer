const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
function boot(){
 const nodes=new Map();function fake(id){if(!nodes.has(id)){const obj={id,hidden:false,textContent:'',className:'',style:{},value:'',classList:{contains:()=>false,add(){},remove(){}},children:[],append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},insertAdjacentElement(){},addEventListener(){},setAttribute(){},setPointerCapture(){},focus(){},getContext(){return {createLinearGradient(){return {addColorStop(){}}},fillRect(){},beginPath(){},arc(){},fill(){},save(){},restore(){},translate(){},fillText(){}}}};nodes.set(id,obj)}return nodes.get(id)}
 const document={hidden:false,activeElement:{tagName:'CANVAS'},getElementById:fake,createElement:()=>fake('generated_'+Math.random()),querySelectorAll:()=>[],addEventListener(){}};
 const sandbox={document,window:{addEventListener(){},ChemistryEngine:{analyze(){return {issues:[]}}}},lang:'hu',tab:'',requestAnimationFrame(){},setTimeout(){},Math,console};vm.createContext(sandbox);
 const code=fs.readFileSync(path.join(__dirname,'../assets/js/quest.js'),'utf8');vm.runInContext(code,sandbox);return {q:sandbox.window.ChemQuest,dom:document};
}
test('all 10 levels have the required recipes and can resolve their objectives',()=>{
 const {q}=boot(); const recipes=[['H2O',{H:2,O:1},['wood_fire']],['CO2',{C:1,O:2},['wood_fire','electric_fire']],['H2',{H:2},['rust_knight']],['NaOH',{Na:1,O:1,H:1},['acid_slime']],['HCl',{H:1,Cl:1},['limestone_wall']],['NH3',{N:1,H:3},['copper_guard']],['NaCl',{Na:3,Cl:3},['ice_shield','electrolyte_bridge','silver_sensor']],['CaOH2',{Ca:1,O:2,H:2},['co2_ghost']],['H2O2',{H:2,O:2},['spore_colony']],['CH4',{C:1,H:4,O:4},['cryogenic_armor','cryogenic_acid','cryogenic_core']]];
 recipes.forEach(([id,atoms,targets],idx)=>{
  q.test.loadLevel(idx);assert.equal(q.debug().level,idx+1);
  q.test.setInventory(atoms);
  if(idx===6){for(let i=0;i<3;i++)assert.equal(q.test.craft('NaCl'),true)}
  else if(idx===9){assert.equal(q.test.craft('O2'),true);assert.equal(q.test.craft('O2'),true);assert.equal(q.test.craft('CH4'),true)}
  else assert.equal(q.test.craft(id),true);
  targets.forEach(type=>{const key=idx===1&&type==='wood_fire'?'H2O':idx===9&&type==='cryogenic_armor'?'HCl':idx===9&&type==='cryogenic_acid'?'NaOH':id; q.test.resolve(type,key)});
  assert(q.debug().targets.every(x=>!x.alive),`level ${idx+1} objectives unresolved`);
  q.test.complete();assert.equal(q.debug().completed,true,`level ${idx+1} exit not opened`);
 });
});
test('wrong ammo does not defeat electric fire and fire damage works',()=>{const {q}=boot();q.test.loadLevel(1);q.test.resolve('electric_fire','H2O');assert.equal(q.debug().targets.find(t=>t.type==='electric_fire').alive,true);assert.equal(q.debug().player.hp,2)});
test('atom cannot be collected without correct answer',()=>{const {q}=boot();const before=q.debug().inventory.H;q.test.setPlayer(160,278,true);q.test.advance(.016);assert.equal(q.debug().inventory.H,before);q.test.answerCorrect();assert.equal(q.debug().inventory.H,before+1)});
