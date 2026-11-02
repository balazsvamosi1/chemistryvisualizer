const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

function boot(){
 const nodes=new Map();let counter=0;
 function el(id){
  if(!nodes.has(id))nodes.set(id,{
   id,hidden:false,textContent:'',value:'',style:{},children:[],attributes:{},
   classList:{contains:()=>false,add(){},remove(){}},
   append(...a){this.children.push(...a)},replaceChildren(...a){this.children=a},
   insertAdjacentElement(){},addEventListener(){},focus(){},setPointerCapture(){},
   setAttribute(k,v){this.attributes[k]=v},
   getContext(){return{createLinearGradient(){return{addColorStop(){}}},fillRect(){},beginPath(){},arc(){},fill(){},save(){},restore(){},translate(){},fillText(){}}}
  });
  return nodes.get(id);
 }
 const document={hidden:false,activeElement:{tagName:'CANVAS'},getElementById:el,createElement:()=>el('generated-'+counter++),querySelectorAll:()=>[],addEventListener(){}};
 const context={document,window:{addEventListener(){},ChemistryEngine:{analyze(){return{issues:[]}}}},lang:'hu',tab:'',requestAnimationFrame(){},setTimeout(){},Math,console};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js/quest.js'),'utf8'),context);
 return {context,quest:context.window.ChemQuest,el};
}
test('all ten stage science explanations have distinct Hungarian, German and English content',()=>{
 const {context,quest,el}=boot();
 for(let index=0;index<10;index++){
  quest.test.loadLevel(index);
  const texts=[];
  for(const language of ['hu','de','en']){
   context.lang=language;quest.localize();
   const fact=quest.test.levelFact();
   assert(fact.length>20,language+' stage '+index);
   assert(el('questRecipe').textContent.includes(fact));
   texts.push(fact);
  }
  assert.equal(new Set(texts).size,3,'missing stage localization '+index);
 }
});
test('every collectible atom has seven translated question types and localized answer choices',()=>{
 const {context,quest}=boot();
 for(const symbol of ['H','O','C','N','Na','Cl','Ca','S','Mg','Cu','Ag']){
  const pool=quest.test.questionPool(symbol);
  assert.equal(pool.length,7,symbol);
  for(const item of pool){
   for(const language of ['hu','de','en']){
    assert(item.q[language]&&item.q[language].length>8,symbol+' '+language);
    for(const answer of [item.a,...item.bad]){
     context.lang=language;
     const shown=typeof answer==='string'?answer:answer[language];
     assert(shown&&shown.length>0,symbol+' missing answer '+language);
    }
   }
  }
 }
});
test('enemy and obstacle names are translated, without exposing code identifiers',()=>{
 const {context,quest}=boot();
 for(const type of ['wood_fire','electric_fire','acid_slime','co2_ghost','cryogenic_core']){
  const names=[];
  for(const l of ['hu','de','en']){context.lang=l;names.push(quest.test.targetName(type));}
  assert.equal(new Set(names).size,3,type);
  assert(!names.includes(type));
 }
});
