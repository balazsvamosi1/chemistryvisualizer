const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const G=require('../assets/js/reaction-maze-core.js');
const Assessment=require('../assets/js/game-assessment.js');
const repoFile=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');

test('all maze element quizzes contain at least eight sound single-answer questions',()=>{
 for(const [sym,questions] of Object.entries(G.QUIZZES)){
  assert.ok(questions.length>=8,sym);
  for(const q of questions){assert.equal(q[3].length,4,sym);assert.equal(new Set(q[3]).size,4,sym);assert.ok(q[4]>=0&&q[4]<4,sym);}
 }
});
test('maze quiz questions do not repeat before bank exhaustion and answer positions vary',()=>{
 const s=G.createLevel(0),seen=new Set(),positions=new Set(),pool=G.QUIZZES.O;
 for(let i=0;i<pool.length;i++){const q=G.questionFor(s,'O');assert.ok(!seen.has(q.sourceIndex));seen.add(q.sourceIndex);positions.add(q[4]);assert.equal(q[3][q[4]],pool[q.sourceIndex][3][pool[q.sourceIndex][4]]);}
 assert.equal(seen.size,pool.length);assert.ok(positions.size>=2);
});
test('maze wrong first answer consumes the atom, even with randomized choices',()=>{
 const s=G.createLevel(1),a=s.atoms[0];s.player.x=a.x;s.player.y=a.y;const q=G.collect(s);assert.ok(q);
 assert.equal(G.answer(s,(q.question[4]+1)%4).ok,false);
 assert.equal(s.inv[a.sym]||0,0);
 assert.equal(s.atoms.find(x=>x.id===a.id),undefined);
});
test('catalyst does not modify enemy movement interval',()=>{
 const code=repoFile('assets/js/reaction-maze-core.js');
 assert.ok(code.includes("Math.max(.22,STAGES[state.stage].speed-(enemy.boost>0?.3:0))"));
 assert.ok(!code.includes("STAGES[state.stage].speed-(enemy.boost>0?.3:0)-state.upgrades.catalyst"));
 assert.ok(repoFile('assets/js/reaction-maze.js').includes("state.upgrades.catalyst*.025"));
});
test('shared assessment separates three games and does not grade empty attempts',()=>{
 Assessment.clear();assert.equal(Assessment.stats('hunt').quizAccuracy,null);
 assert.equal(Assessment.record('maze','quizCorrect'),true);
 assert.equal(Assessment.record('maze','quizWrong'),true);
 assert.equal(Assessment.record('hunt','quizCorrect'),true);
 assert.equal(Assessment.record('quest','stagesCompleted'),true);
 assert.equal(Assessment.record('maze','invalid'),false);
 assert.equal(Assessment.stats('maze').quizAccuracy,50);
 assert.equal(Assessment.stats('maze').quizAttempts,2);
 assert.equal(Assessment.stats('hunt').quizAccuracy,100);
 assert.equal(Assessment.stats('quest').stagesCompleted,1);
 Assessment.clear();assert.equal(Assessment.stats('maze').quizAttempts,0);
});
function boot(){
 const nodes=new Map();let seq=0;
 function el(id){
  if(!nodes.has(id)){
   const node={id,hidden:false,textContent:'',style:{},value:'',children:[],
    classList:{contains(){return false},add(){},remove(){}},
    append(...v){this.children.push(...v)},replaceChildren(...v){this.children=v},
    insertAdjacentElement(){},addEventListener(){},setAttribute(){},setPointerCapture(){},focus(){},
    getContext(){return {createLinearGradient(){return {addColorStop(){}}},fillRect(){},beginPath(){},arc(){},fill(){},save(){},restore(){},translate(){},fillText(){}}}
   };
   nodes.set(id,node);
  }
  return nodes.get(id);
 }
 const document={hidden:false,activeElement:{tagName:'CANVAS'},getElementById:el,createElement:()=>el('_'+seq++),querySelectorAll:()=>[],addEventListener(){}};
 const events=[],context={document,window:{ChemistryEngine:{analyze(){return {issues:[]}}},ChemistryGameAssessment:{record:(...v)=>events.push(v)},addEventListener(){}},lang:'hu',requestAnimationFrame(){},setTimeout(){},Math,console};
 vm.createContext(context);vm.runInContext(repoFile('assets/js/quest.js'),context);
 return {quest:context.window.ChemQuest,events,el};
}
test('Quest enters a persistent game-over state and restarts only on request',()=>{
 const {quest,events}=boot();quest.test.loadLevel(0);
 const hazard=quest.debug().obstacles[0];
 for(let i=0;i<3;i++){quest.test.setPlayer(hazard.x+10,390,true);quest.test.advance(1.6);}
 assert.equal(quest.debug().player.hp,0);
 assert.equal(quest.debug().gameOver,true);
 assert.ok(events.some(([id,k])=>id==='quest'&&k==='defeats'));
 quest.test.advance(2);assert.equal(quest.debug().player.hp,0);
 quest.test.loadLevel(0);assert.equal(quest.debug().gameOver,false);assert.equal(quest.debug().player.hp,3);
});
test('assessment scripts and its Academy panel are loaded from GitHub Pages assets',()=>{
 const html=repoFile('index.html');
 for(const v of ['id="gameAssessment"','assets/js/game-assessment.js','assets/css/game-assessment.css'])assert.ok(html.includes(v));
 assert.ok(repoFile('assets/js/app-core.js').includes("record('hunt'"));
 assert.ok(repoFile('assets/js/reaction-maze.js').includes("record('maze'"));
 assert.ok(repoFile('assets/js/quest.js').includes("record('quest'"));
});
