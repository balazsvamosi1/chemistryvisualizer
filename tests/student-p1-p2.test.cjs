const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const Molecule=require('../assets/js/molecule-learning.js'),Core=require('../assets/js/reaction-maze-core.js');
test('molar mass answer is hidden until a nonempty answer is checked',()=>{
 const code=read('assets/js/molecule-learning.js');
 assert(!code.includes("output.append(el('p',result.mass.toFixed(2)+' g/mol'))"));
 assert(code.includes('check.addEventListener(\'click\''));
 assert(code.includes('details.textContent=t.calculation'));
 assert(code.includes("raw===''"));
 const w=Molecule.analyze({atoms:[{id:1,s:'O'},{id:2,s:'H'},{id:3,s:'H'}],bonds:[]});
 assert(Math.abs(w.mass-18.015)<.001);
});
function questBoot(){
 const nodes=new Map();let i=0;
 const el=id=>{if(!nodes.has(id))nodes.set(id,{id,hidden:false,textContent:'',value:'',style:{},children:[],classList:{contains(){return false},add(){},remove(){}},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},insertAdjacentElement(){},addEventListener(){},setAttribute(){},setPointerCapture(){},focus(){},getContext(){return{createLinearGradient(){return{addColorStop(){}}},fillRect(){},beginPath(){},arc(){},fill(){},save(){},restore(){},translate(){},fillText(){}}}});return nodes.get(id)};
 const document={hidden:false,activeElement:{tagName:'CANVAS'},getElementById:el,createElement:()=>el('fake-'+(i++)),querySelectorAll:()=>[],addEventListener(){}};
 const sandbox={document,window:{addEventListener(){},ChemistryEngine:{analyze(){return{issues:[]}}}},lang:'hu',requestAnimationFrame(){},setTimeout(){},Math,console};
 vm.runInNewContext(read('assets/js/quest.js'),sandbox);return sandbox.window.ChemQuest;
}
test('Quest stage restart clears previous charge inventory',()=>{
 const q=questBoot();q.test.loadLevel(3);q.test.setAmmo('H2O',4);
 assert.equal(q.debug().arsenal.H2O,4);
 q.test.loadLevel(3);
 assert.equal(q.debug().arsenal.H2O,0);
 q.test.loadLevel(1);assert.equal(q.debug().arsenal.H2O,1);
});
function mazeBoot(){
 const nodes=new Map();let i=0;
 const el=id=>{if(!nodes.has(id))nodes.set(id,{id,children:[],hidden:false,textContent:'',value:'',style:{},options:[],classList:{contains(c){return id==='mazeSection'&&c==='hidden'||id==='hu'&&c==='active'},add(){},remove(){}},
  append(...x){this.children.push(...x);if(this.id==='mazeRecipe'||this.id==='mazePurgeAtom')this.options=this.children},
  replaceChildren(...x){this.children=[...x];if(this.id==='mazeRecipe'||this.id==='mazePurgeAtom')this.options=this.children},
  setAttribute(){},addEventListener(){},setPointerCapture(){},
  getContext(){return{clearRect(){},fillRect(){},beginPath(){},arc(){},fill(){},stroke(){},fillText(){},strokeRect(){},moveTo(){},lineTo(){},save(){},restore(){}}}});return nodes.get(id)};
 const document={hidden:false,activeElement:{tagName:'CANVAS'},getElementById:el,createElement:()=>el('new-'+(++i)),addEventListener(){}};
 const events=[],sandbox={document,window:{ReactionMazeCore:Core,ChemistryGameAssessment:{record:(...v)=>events.push(v)}},requestAnimationFrame(){},performance:{now(){return 0}},queueMicrotask(){},Math,console};
 vm.runInNewContext(read('assets/js/reaction-maze.js'),sandbox);
 return {game:sandbox.window.ReactionMazeGame,el,events};
}
test('missing maze atoms do not count as incorrect chemistry work',()=>{
 const {game,events}=mazeBoot();game.craft();
 assert.equal(events.some(([g,e])=>g==='maze'&&e==='craftWrong'),false);
});
test('maze shows correct answer and concept explanation after wrong choice',()=>{
 const {game,el}=mazeBoot(),s=game.getState();
 s.grid[1][2]='.';s.atoms=[{id:1000,x:2,y:1,sym:'O'}];
 game.move(1,0);const correct=s.pending.question[4],buttons=el('mazeQuiz').children[2].children;
 buttons[(correct+1)%4].onclick();
 assert.equal(s.stats.missed,1);
 assert(el('mazeNotice').textContent.includes('Helyes válasz:'));
});
test('mobile game board is scrollable at readable size',()=>{
 const html=read('index.html'),css=read('assets/css/reaction-maze.css');
 assert(html.includes('maze-canvas-scroll'));assert(css.includes('width:684px!important'));
 assert(css.includes('touch-action:pan-x'));
});
test('academy exposes guided mode and tracks assessed competencies',()=>{
 const src=read('assets/js/chemistry-curriculum.js');
 assert(src.includes('renderGuided(content)'));assert(src.includes('ChemistryLearningProgress?.record'));
 assert(read('index.html').includes('assets/js/learning-progress.js'));
});
