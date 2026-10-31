const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
function boot(){
 const nodes=new Map();let counter=0;function fake(id){if(!nodes.has(id)){const el={id,textContent:'',className:'',hidden:false,style:{},children:[],attributes:{},classList:{contains:()=>false,add(){},remove(){}},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},setAttribute(k,v){this.attributes[k]=v},insertAdjacentElement(){},addEventListener(){},focus(){},getContext(){return {createLinearGradient(){return {addColorStop(){}}},fillRect(){},beginPath(){},arc(){},fill(){},save(){},restore(){},translate(){},fillText(){}}}};nodes.set(id,el)}return nodes.get(id)}
 const document={hidden:false,activeElement:{tagName:'CANVAS'},getElementById:fake,createElement:()=>fake('generated_'+counter++),querySelectorAll:()=>[],addEventListener(){}};
 const context={document,window:{addEventListener(){},ChemistryEngine:{analyze(){return {issues:[]}}}},lang:'hu',tab:'',requestAnimationFrame(){},setTimeout(){},Math,console};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js/quest.js'),'utf8'),context);return {q:context.window.ChemQuest,dom:document};
}
test('arsenal slots update on craft and ammo change, and clicking selects weapon',()=>{
 const {q,dom}=boot();q.test.loadLevel(1);let bar=dom.getElementById('questArsenal');assert(bar.children.length>=2);
 q.test.setInventory({C:1,O:2});assert.equal(q.test.craft('CO2'),true);
 let co2=bar.children.find(e=>e.children.some(c=>c.textContent==='CO₂'));assert(co2);assert(co2.children.some(c=>c.textContent==='×1'));assert.equal(co2.attributes['aria-pressed'],'true');
 q.test.setAmmo('H2O',3);let water=bar.children.find(e=>e.children.some(c=>c.textContent==='H₂O'));water.onclick();assert.equal(q.debug().selected,'H2O');water=bar.children.find(e=>e.children.some(c=>c.textContent==='H₂O'));co2=bar.children.find(e=>e.children.some(c=>c.textContent==='CO₂'));assert.equal(water.attributes['aria-pressed'],'true');assert.equal(co2.attributes['aria-pressed'],'false');
 q.test.setAmmo('H2O',0);assert(bar.children.find(e=>e.children.some(c=>c.textContent==='H₂O')).children.some(c=>c.textContent==='×0'));
});
test('HUD has no duplicate container and late recipes unlock as levels progress',()=>{const {q,dom}=boot();const bar=dom.getElementById('questArsenal');const first=bar.children.length;q.test.loadLevel(9);assert(bar.children.length>first);assert(bar.children.some(e=>e.children.some(c=>c.textContent==='CH₄')));assert(bar.children.some(e=>e.children.some(c=>c.textContent==='O₂')))});
