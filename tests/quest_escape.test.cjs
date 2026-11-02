const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const engine=require('../assets/js/reaction-engine.js');
function boot(){
 let seq=0;const nodes=new Map();
 function el(id){if(!nodes.has(id))nodes.set(id,{id,hidden:false,textContent:'',style:{},value:'1',children:[],attributes:{},classList:{contains:()=>false,add(){},remove(){}},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},insertAdjacentElement(){},addEventListener(){},setAttribute(k,v){this.attributes[k]=v},setPointerCapture(){},focus(){},getContext(){return{createLinearGradient(){return{addColorStop(){}}},fillRect(){},beginPath(){},arc(){},fill(){},save(){},restore(){},translate(){},fillText(){},ellipse(){}}}});return nodes.get(id)}
 const document={hidden:false,activeElement:{tagName:'CANVAS'},getElementById:el,createElement:()=>el('generated-'+seq++),querySelectorAll:()=>[],addEventListener(){}};
 const context={document,window:{ChemistryEngine:{analyze(){return{issues:[]}}},ReactionEngine:engine,addEventListener(){}},lang:'hu',tab:'',localStorage:{setItem(){},getItem(){return'0'}},requestAnimationFrame(){},setTimeout(){},Math,console};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js/quest.js'),'utf8'),context);
 return {quest:context.window.ChemQuest,context,el};
}
test('ten stages are numbered 1-1 to 2-5',()=>{
 const {quest}=boot();const stages=Array.from({length:10},(_,i)=>quest.test.stageCode(i));
 assert.deepEqual(stages,['1-1','1-2','1-3','1-4','1-5','2-1','2-2','2-3','2-4','2-5']);
});
test('moving smaller enemies unlock on stage 1-5 and all subsequent stages',()=>{
 const {quest}=boot();
 for(let i=0;i<10;i++){quest.test.loadLevel(i);assert.equal(quest.debug().minions.length,i>=4?2:0,'stage '+i)}
});
test('eleven ammunition types have curated balanced preparation equations',()=>{
 for(const recipe of ['H2O','CO2','H2','NaOH','HCl','NH3','NaCl','CaOH2','H2O2','CH4','O2']){
  const id=engine.craftReactions[recipe];assert(id,recipe);
  const m=engine.model(id);assert(m,recipe);
  assert.equal(engine.check(id,m.solution).ok,true,recipe);
  assert.equal(engine.check(id,m.solution.map((x,i)=>i===0?x+1:x)).ok,false,'invalid coefficients '+recipe);
 }
});
test('level four crafting presents a reaction challenge before consuming ingredients',()=>{
 const {quest}=boot();quest.test.loadLevel(3);quest.test.setInventory({Na:1,O:1,H:1});
 assert.equal(quest.test.startCraftReaction('NaOH'),true);
 assert.equal(quest.debug().inventory.Na,1);
 assert.equal(quest.debug().arsenal.NaOH,0);
});
