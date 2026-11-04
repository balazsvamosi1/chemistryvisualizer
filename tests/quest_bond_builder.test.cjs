const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
function boot(){
 let counter=0;const nodes=new Map();
 function node(id){if(!nodes.has(id))nodes.set(id,{id,hidden:false,textContent:'',style:{},value:'1',classList:{contains:()=>false,add(){},remove(){}},children:[],append(...v){this.children.push(...v)},replaceChildren(...v){this.children=v},insertAdjacentElement(){},addEventListener(){},setAttribute(){},setPointerCapture(){},focus(){},getContext(){return {createLinearGradient(){return {addColorStop(){}}},fillRect(){},beginPath(){},arc(){},fill(){},save(){},restore(){},translate(){},fillText(){}}}});return nodes.get(id)}
 const document={hidden:false,activeElement:{tagName:'CANVAS'},getElementById:node,createElement:()=>node('_'+counter++),querySelectorAll:()=>[],addEventListener(){}};
 const context={document,window:{ChemistryEngine:require('../assets/js/chemistry-engine.js'),addEventListener(){}},lang:'hu',requestAnimationFrame(){},setTimeout(){},Math,console};vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js/quest.js'),'utf8'),context);
 return context.window.ChemQuest;
}
const bonds=(...triples)=>triples.map(([a,b,order])=>({a,b,order}));
test('valid H2O and CO2 molecular graphs; incorrect bond orders rejected',()=>{
 const q=boot();
 assert.equal(q.test.builderGraph('H2O',q.test.referenceGraph('H2O')),true);
 assert.equal(q.test.builderGraph('CO2',q.test.referenceGraph('CO2')),true);
 assert.equal(q.test.builderGraph('CO2',bonds([0,1,1],[0,2,1])),false);
});
test('equivalent atom order accepted, duplicated and missing bonds rejected',()=>{
 const q=boot();const ref=q.test.referenceGraph('CH4');
 assert.equal(q.test.builderGraph('CH4',ref.slice().reverse()),true);
 assert.equal(q.test.builderGraph('CH4',[ref[0],ref[0],ref[2],ref[3]]),false);
 assert.equal(q.test.builderGraph('H2O',[{a:0,b:1,order:1}]),false);
});
test('hydrogen peroxide requires single oxygen-oxygen bond',()=>{
 const q=boot();const graph=q.test.referenceGraph('H2O2');
 assert.equal(q.test.builderGraph('H2O2',graph),true);
 assert.equal(q.test.builderGraph('H2O2',graph.map((b,i)=>i===0?{...b,order:2}:b)),false);
});
test('first two levels simple crafting and level three workbench UI',()=>{
 const q=boot();q.test.setInventory({H:2,O:1});assert.equal(q.test.craft('H2O'),true);
 q.test.loadLevel(2);assert.equal(q.debug().arsenal.H2O,0);q.test.setInventory({H:2,O:1});q.craft('H2O');
 assert.equal(q.debug().arsenal.H2O,0);
 assert.equal(q.test.craft('H2O'),true);
});
