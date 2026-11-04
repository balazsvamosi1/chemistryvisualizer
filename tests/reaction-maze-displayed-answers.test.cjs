/* P0 regression: validate ACTUAL displayed answer labels vs engine acceptance in HU/DE/EN.
 * Original test code, Apache-2.0. */
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const G=require('../assets/js/reaction-maze-core.js');
const uiCode=fs.readFileSync(path.join(__dirname,'../assets/js/reaction-maze.js'),'utf8');
function boot(language){
 const nodes=new Map(),callbacks=[];
 function elem(id){
  if(!nodes.has(id)){
   const n={id,children:[],hidden:false,textContent:'',value:'',style:{},disabled:false,
    options:[],attributes:{},classList:{contains(c){return id==='mazeSection'&&c==='hidden'||id===language&&c==='active'},add(){},remove(){}},
    append(...a){this.children.push(...a);if(this.id==='mazeRecipe'||this.id==='mazePurgeAtom')this.options=this.children},
    replaceChildren(...a){this.children=[...a];if(this.id==='mazeRecipe'||this.id==='mazePurgeAtom')this.options=this.children},
    setAttribute(k,v){this.attributes[k]=v},addEventListener(k,fn){this['on'+k]=fn},
    setPointerCapture(){},getContext(){return {clearRect(){},fillRect(){},beginPath(){},arc(){},fill(){},stroke(){},fillText(){},strokeRect(){},moveTo(){},lineTo(){},save(){},restore(){}}},querySelectorAll(selector){return selector==='.maze-answers button'?this.children[2]?.children||[]:[]}
   };
   nodes.set(id,n);
  }
  return nodes.get(id);
 }
 const document={hidden:false,getElementById:elem,createElement:(tag)=>elem('generated-'+(++seq)),addEventListener(){},activeElement:{tagName:'CANVAS'}};
 let seq=0;
 const assessment=[];
 const window={ReactionMazeCore:G,ChemistryGameAssessment:{record:(...a)=>assessment.push(a)}};
 const context={document,window,requestAnimationFrame:()=>{},performance:{now:()=>0},queueMicrotask:()=>{},Math,console};
 vm.createContext(context);vm.runInContext(uiCode,context);
 return {game:window.ReactionMazeGame,nodes,assessment};
}
const labels={
 C:{0:{hu:['Kalcium','Szén','Réz','Klór'],de:['Calcium','Kohlenstoff','Kupfer','Chlor'],en:['Calcium','Carbon','Copper','Chlorine']}},
 Cl:{1:{hu:['Nemesgáz','Halogén','Alkálifém','Alkáliföldfém'],de:['Edelgas','Halogen','Alkalimetall','Erdalkalimetall'],en:['Noble gas','Halogen','Alkali metal','Alkaline earth metal']}},
 S:{0:{hu:['Szilícium','Kén','Nátrium','Szelén'],de:['Silicium','Schwefel','Natrium','Selen'],en:['Silicon','Sulfur','Sodium','Selenium']}}
};
for(const [symbol,questionIds] of Object.entries(labels))for(const sourceIndex of Object.keys(questionIds).map(Number))for(const language of ['hu','de','en']){
 test('displayed '+symbol+' question '+sourceIndex+' agrees with scoring in '+language,()=>{
  let observedOrderings=new Set();
  for(let cycle=0;cycle<24;cycle++){
   const {game,nodes,assessment}=boot(language);
   const s=game.getState();
   s.grid[1][2]='.';s.atoms=[{id:'target',x:2,y:1,sym:symbol}];
   s.quizSeen={[symbol]:G.QUIZZES[symbol].map((_,i)=>i).filter(i=>i!==sourceIndex)};
   let seed=cycle+1;s.rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
   game.move(1,0);
   const question=s.pending?.question;assert.ok(question,'quiz appears');assert.equal(question.sourceIndex,sourceIndex);
   const buttons=nodes.get('mazeQuiz').children[2]?.children;
   assert.equal(buttons?.length,4);
   const originals=questionIds[sourceIndex][language];
   const shown=buttons.map(b=>b.textContent);
   const mapped=question.optionOrder.map(i=>originals[i]);
   assert.deepEqual(shown,mapped,'display must follow shuffled source-index permutation');
   const rightSource=G.QUIZZES[symbol][sourceIndex][4];
   const expected=originals[rightSource];
   const rightIndex=shown.indexOf(expected);
   assert.equal(rightIndex,question[4],'rendered correct label must match engine index');
   observedOrderings.add(question[4]);
   if(cycle%2===0){
    buttons[rightIndex].onclick();
    assert.equal(s.inv[symbol],1,'correct visible text must give atom');
    assert.equal(s.stats.correct,1);
    assert.deepEqual(assessment.at(-1),['maze','quizCorrect']);
   }else{
    const wrong=(rightIndex+1)%4;
    buttons[wrong].onclick();
    assert.equal(s.inv[symbol]||0,0,'wrong visible text must not give atom');
    assert.equal(s.stats.missed,1);
    assert.equal(s.atoms.some(a=>a.id==='target'),false,'atom must disappear after incorrect first answer');
    assert.deepEqual(assessment.at(-1),['maze','quizWrong']);
   }
  }
  assert.ok(observedOrderings.size>=3,'multiple placements of correct answer exercised');
 });
}
