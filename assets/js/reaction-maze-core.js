/* Reaction Maze / Reakció-labirintus. Original Apache-2.0 educational game engine.
   Fictional game effects and recipes are not laboratory instructions. No dependencies. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.ReactionMazeCore=api;})(typeof window!=='undefined'?window:null,function(){
'use strict';
const W=19,H=13,MAX_INV=12;
const RECIPES=[
 {id:'H2O',symbol:'H₂O',atoms:{H:2,O:1},name:['Víz','Wasser','Water'],explain:['2 H + O: játékon belüli atom-egyesítés, nem valódi laboratóriumi szintézis.','2 H + O: Atomkombination im Spiel, keine echte Synthese.','2 H + O: a game abstraction, not a real synthesis.']},
 {id:'CO2',symbol:'CO₂',atoms:{C:1,O:2},name:['Szén-dioxid','Kohlendioxid','Carbon dioxide'],explain:['A CO₂ egy szén- és két oxigénatomból áll.','CO₂ enthält ein Kohlenstoff- und zwei Sauerstoffatome.','CO₂ contains one carbon atom and two oxygen atoms.']},
 {id:'NaOH',symbol:'NaOH',atoms:{Na:1,O:1,H:1},name:['Nátrium-hidroxid','Natriumhydroxid','Sodium hydroxide'],explain:['HCl + NaOH → NaCl + H₂O (közömbösítés).','HCl + NaOH → NaCl + H₂O (Neutralisation).','HCl + NaOH → NaCl + H₂O (neutralization).']},
 {id:'HCl',symbol:'HCl',atoms:{H:1,Cl:1},name:['Hidrogén-klorid','Chlorwasserstoff','Hydrogen chloride'],explain:['A HCl vizes oldata sósav; a játék savsugara szemléltetés.','HCl in Wasser ist Salzsäure; der Strahl ist fiktiv.','HCl in water forms hydrochloric acid; the beam is fictional.']},
 {id:'AL',symbol:'Al + ★',atoms:{Al:2},needsActivator:true,name:['Szimulált redukció','Simulierte Reduktion','Simulated reduction'],explain:['A ★ kitalált játékaktivátor; ez NEM valódi termitrecept.','★ ist ein fiktiver Spielaktivator, KEIN Thermitrezept.','★ is a fictional game activator, NOT a real thermite recipe.']},
 {id:'K2S',symbol:'K₂S',atoms:{K:2,S:1},name:['Kálium-szulfid','Kaliumsulfid','Potassium sulfide'],explain:['A kálium-szulfid képlete K₂S, nem KS. A csapadékképzés játékmodell.','Kaliumsulfid ist K₂S, nicht KS; Fällung ist vereinfacht.','Potassium sulfide is K₂S, not KS; precipitation is simplified.']}
];
const STAGES=[
 {name:['Tűzfaló','Feuerfresser','Fire Eater'],type:'fire',speed:0.55,count:1,description:['Vízsugarat használj, és kerüld a lángnyomokat.','Nutze Wasser; meide Flammenspuren.','Use water; avoid flame trails.']},
 {name:['Szikra-Gólem','Funken-Golem','Spark Golem'],type:'spark',speed:0.8,count:1,description:['CO₂-töltet kell; a víz felerősíti a szikrát.','CO₂ hilft; Wasser verstärkt den Funken.','Use CO₂; water empowers the spark.']},
 {name:['Sav-nyálka','Säureschleim','Acid Slime'],type:'acid',speed:1.05,count:2,description:['NaOH-töltettel közömbösítsd a savas nyálkát.','Neutralisiere mit NaOH.','Neutralize with a NaOH charge.']},
 {name:['Kristály-rém','Kristallschreck','Crystal Wraith'],type:'alkaline',speed:0.85,count:2,description:['HCl-töltettel semlegesítsd a lúgos csapdákat.','Neutralisiere Laugenfallen mit HCl.','Use HCl to neutralize alkaline traps.']},
 {name:['Rozsda-Kolosszus','Rostkoloss','Rust Colossus'],type:'rust',speed:1.55,count:1,description:['Al + ★ a kizárólag játékbeli aktivátorral.','Al + ★ mit fiktivem Spielaktivator.','Al + ★ with a fictional game activator.']},
 {name:['Nehézfém-Árnyék','Schwermetallschatten','Heavy-metal Shade'],type:'heavy',speed:0.70,count:2,description:['K₂S-töltettel szilárdítsd meg az árnyakat.','Verwende K₂S gegen die Schatten.','Use K₂S charges against the shades.']}
];
const QUIZZES={
H:[['Mi a hidrogén vegyjele?','Was ist das Symbol für Wasserstoff?','What is the symbol for hydrogen?',['H','He','Hg','Ho'],0],['Hány protonja van a hidrogénnek?','Wie viele Protonen hat Wasserstoff?','How many protons does hydrogen have?',['2','8','1','6'],2]],
O:[['Mi az oxigén rendszáma?','Welche Ordnungszahl hat Sauerstoff?','What is the atomic number of oxygen?',['6','7','8','16'],2],['Melyik az oxigén vegyjele?','Was ist das Symbol für Sauerstoff?','What is the symbol for oxygen?',['O','Os','Au','Ox'],0]],
C:[['Milyen elem a C?','Welches Element ist C?','Which element is C?',['Kalcium','Szén','Réz','Klór'],1],['Hány proton van a szén atommagjában?','Wie viele Protonen hat Kohlenstoff?','How many protons does carbon have?',['8','12','6','4'],2]],
Na:[['Mi a nátrium vegyjele?','Welches Symbol hat Natrium?','What is sodium’s symbol?',['N','Na','Ni','Ne'],1],['Melyik elem rendszáma 11?','Welches Element hat die Ordnungszahl 11?','Which element has atomic number 11?',['Na','Mg','K','Ca'],0]],
Cl:[['Melyik a klór vegyjele?','Was ist das Symbol für Chlor?','What is chlorine’s symbol?',['C','Cl','Ca','Cr'],1],['Melyik csoportba tartozik a klór?','Zu welcher Gruppe gehört Chlor?','Which group contains chlorine?',['Nemesgáz','Halogén','Alkálifém','Alkáliföldfém'],1]],
Al:[['Melyik a alumínium vegyjele?','Welches Symbol hat Aluminium?','What is the symbol for aluminum?',['Au','Ag','Al','Am'],2],['Mi az alumínium rendszáma?','Welche Ordnungszahl hat Aluminium?','What is aluminum’s atomic number?',['12','13','14','26'],1]],
K:[['Mi a kálium vegyjele?','Was ist das Symbol für Kalium?','What is potassium’s symbol?',['K','P','Ca','Kr'],0],['Mi a kálium rendszáma?','Welche Ordnungszahl hat Kalium?','What is potassium’s atomic number?',['11','17','19','20'],2]],
S:[['Melyik elem vegyjele S?','Welches Element ist S?','Which element has symbol S?',['Szilícium','Kén','Nátrium','Szelén'],1],['Mi a kén rendszáma?','Welche Ordnungszahl hat Schwefel?','What is sulfur’s atomic number?',['8','14','16','18'],2]],
Ca:[['Mi a kalcium vegyjele?','Was ist das Symbol für Calcium?','What is calcium’s symbol?',['C','Ca','Cl','Cu'],1]],
Fe:[['Mi a vas vegyjele?','Was ist das Symbol für Eisen?','What is the symbol for iron?',['F','Fe','Fr','Fl'],1]]
};
// Scientific quiz facts: isotope mass numbers refer to the most abundant natural isotope.
const QUIZ_FACTS={
 H:[1,1,1,1,'He',['hidrogén','Wasserstoff','hydrogen']],
 O:[8,2,16,16,'F',['oxigén','Sauerstoff','oxygen']],
 C:[6,2,14,12,'N',['szén','Kohlenstoff','carbon']],
 Na:[11,3,1,23,'Mg',['nátrium','Natrium','sodium']],
 Cl:[17,3,17,35,'Ar',['klór','Chlor','chlorine']],
 Al:[13,3,13,27,'Si',['alumínium','Aluminium','aluminum']],
 K:[19,4,1,39,'Ca',['kálium','Kalium','potassium']],
 S:[16,3,16,32,'Cl',['kén','Schwefel','sulfur']],
 Ca:[20,4,2,40,'Sc',['kalcium','Calcium','calcium']],
 Fe:[26,4,8,56,'Co',['vas','Eisen','iron']]
};
const QUIZ_SYMBOLS=['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Fe','Co','Cu'];
function numberChoices(n,min=1,max=150){const out=[String(n)];for(let delta=1;out.length<4&&delta<15;delta++)for(const candidate of [n+delta,n-delta])if(candidate>=min&&candidate<=max&&out.length<4)out.push(String(candidate));return out;}
function optionQuestion(prompt,options,correct){return [prompt[0],prompt[1],prompt[2],options,options.indexOf(String(correct))];}
for(const [sym,[z,period,group,isotope,next,names]] of Object.entries(QUIZ_FACTS)){
 const opts=n=>numberChoices(n);
 const symbolOpts=[sym,...QUIZ_SYMBOLS.filter(x=>x!==sym).slice(z%10,z%10+3)];
 const nextOpts=[next,...QUIZ_SYMBOLS.filter(x=>x!==next&&x!==sym).slice(z%8,z%8+3)];
 QUIZZES[sym].push(
 optionQuestion(['Mennyi a(z) '+names[0]+' rendszáma?','Welche Ordnungszahl hat '+names[1]+'?','What is the atomic number of '+names[2]+'?'],opts(z),z),
 optionQuestion(['Mi a(z) '+names[0]+' vegyjele?','Welches Symbol hat '+names[1]+'?','What is the symbol for '+names[2]+'?'],symbolOpts,sym),
 optionQuestion(['Melyik periódusban található a(z) '+names[0]+'?','In welcher Periode steht '+names[1]+'?','Which period contains '+names[2]+'?'],numberChoices(period,1,7),period),
 optionQuestion(['Hányadik IUPAC-csoportban van a(z) '+names[0]+'?','Welche IUPAC-Gruppennummer hat '+names[1]+'?','What is the IUPAC group number of '+names[2]+'?'],numberChoices(group,1,18),group),
 optionQuestion(['Melyik tömegszámú természetes izotópja a leggyakoribb a(z) '+names[0]+' elemnek?','Welche Massenzahl hat das häufigste natürliche Isotop von '+names[1]+'?','What is the mass number of the most abundant natural isotope of '+names[2]+'?'],opts(isotope),isotope),
 optionQuestion(['Melyik elem következik a(z) '+names[0]+' után rendszám szerint?','Welches Elementsymbol folgt nach '+names[1]+' nach Ordnungszahl?','Which element symbol follows '+names[2]+' by atomic number?'],nextOpts,next),
 optionQuestion(['Hány elektronja van egy semleges '+sym+'-atomnak?','Wie viele Elektronen hat ein neutrales '+sym+'-Atom?','How many electrons does a neutral '+sym+' atom have?'],opts(z),z)
 );
}

const TYPES=['fire','spark','acid','alkaline','rust','heavy'];
function random(seed){let x=(seed||1)>>>0;return function(){x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
const key=(x,y)=>x+','+y;
function inside(x,y){return x>=0&&x<W&&y>=0&&y<H;}
function open(s,x,y){return inside(x,y)&&s.grid[y][x]==='.';}
function neighbors(x,y){return [[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([a,b])=>inside(a,b));}
function distances(grid,x,y){const seen=new Map([[key(x,y),0]]),q=[[x,y]];for(let i=0;i<q.length;i++){const [a,b]=q[i],d=seen.get(key(a,b));for(const [nx,ny] of neighbors(a,b)){const k=key(nx,ny);if(grid[ny][nx]!=='.'||seen.has(k))continue;seen.set(k,d+1);q.push([nx,ny]);}}return seen;}
function generate(stage,seed){
 const rnd=random(seed),grid=Array.from({length:H},()=>Array(W).fill('#'));
 const stack=[[1,1]];grid[1][1]='.';while(stack.length){const [x,y]=stack[stack.length-1];const opts=[[2,0],[-2,0],[0,2],[0,-2]].filter(([dx,dy])=>inside(x+dx,y+dy)&&grid[y+dy][x+dx]==='#'&&x+dx>0&&y+dy>0&&x+dx<W-1&&y+dy<H-1);if(!opts.length){stack.pop();continue;}const [dx,dy]=opts[Math.floor(rnd()*opts.length)];grid[y+dy/2][x+dx/2]='.';grid[y+dy][x+dx]='.';stack.push([x+dx,y+dy]);}
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(grid[y][x]==='#'&&rnd()<0.23&&((grid[y][x-1]==='.'&&grid[y][x+1]==='.')||(grid[y-1][x]==='.'&&grid[y+1][x]==='.')))grid[y][x]='.';
 let floors=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(grid[y][x]==='.')floors.push({x,y});
 const gen=floors.slice().sort((a,b)=>(Math.abs(a.x-9)+Math.abs(a.y-6))-(Math.abs(b.x-9)+Math.abs(b.y-6)))[0];
 const dist=distances(grid,1,1);
 const exit=floors.slice().sort((a,b)=>(dist.get(key(b.x,b.y))||0)-(dist.get(key(a.x,a.y))||0))[0];
 // A few removable walls, retaining a route between the spawn, ion generator and exit.
 const safe=(x,y)=>!((x<=2&&y<=2)||(x===gen.x&&y===gen.y)||(x===exit.x&&y===exit.y));
 for(const p of floors.slice().sort(()=>rnd()-.5)){if(rnd()>0.095||!safe(p.x,p.y))continue;grid[p.y][p.x]='%';const d=distances(grid,1,1);if(!d.has(key(gen.x,gen.y))||!d.has(key(exit.x,exit.y)))grid[p.y][p.x]='.';}
 floors=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(grid[y][x]==='.')floors.push({x,y});
 const d=distances(grid,1,1),reachable=floors.filter(p=>d.has(key(p.x,p.y)));
 const reserved=new Set([key(1,1),key(gen.x,gen.y),key(exit.x,exit.y)]);
 const enemyPositions=reachable.filter(p=>((d.get(key(p.x,p.y))||0)>9)&&!reserved.has(key(p.x,p.y))).sort((a,b)=>(d.get(key(b.x,b.y))||0)-(d.get(key(a.x,a.y))||0));
 const enemies=[];for(let i=0;i<STAGES[stage].count;i++){const pos=enemyPositions.find(p=>!reserved.has(key(p.x,p.y)))||exit;reserved.add(key(pos.x,pos.y));enemies.push({id:i,x:pos.x,y:pos.y,type:STAGES[stage].type,alive:true,clock:0,dir:i%4,boost:0});}
 const useful=RECIPES[stage].atoms,choices=[];
 for(const [sym,n] of Object.entries(useful))for(let i=0;i<n*(STAGES[stage].count+3);i++)choices.push(sym);
 const decoys=['Ca','Fe',...(stage>0?Object.keys(RECIPES[stage-1].atoms):['C','Na'])];
 for(const sym of decoys)choices.push(sym);
 const pickupPositions=reachable.filter(p=>!reserved.has(key(p.x,p.y))).sort(()=>rnd()-.5);
 const atoms=[];choices.forEach((sym,i)=>{const pos=pickupPositions[i%pickupPositions.length];if(pos)atoms.push({id:i,x:pos.x,y:pos.y,sym});});
 const activator=stage===4?pickupPositions.find(p=>!atoms.some(a=>a.x===p.x&&a.y===p.y))||gen:null;
 return {grid,gen:{x:gen.x,y:gen.y},exit:{x:exit.x,y:exit.y},enemies,atoms,activator:activator?{x:activator.x,y:activator.y}:null,rnd};
}
function createLevel(stage=0,upgrades=null,seed=null){
 if(!Number.isInteger(stage)||stage<0||stage>=STAGES.length)throw Error('Stage out of range');
 const g=generate(stage,seed===null?20261104+stage*113:seed),inv={},ammo={};const stats={attempts:0,correct:0,missed:0,crafted:0,detonations:0,defeated:0,purged:0};
 return {stage,grid:g.grid,gen:g.gen,exit:g.exit,enemies:g.enemies,atoms:g.atoms,activator:g.activator,rnd:g.rnd,inv,ammo,stats,player:{x:1,y:1,hp:3,shield:upgrades?.shield||0},upgrades:{range:upgrades?.range||0,flask:upgrades?.flask||0,catalyst:upgrades?.catalyst||0,shield:0},bombs:[],waves:[],hazards:[],bonuses:[],pending:null,completed:false,failed:false,generatorTimer:10,elapsed:0,events:[]};
}
function countInv(inv){return Object.values(inv).reduce((a,b)=>a+b,0);}
function questionFor(state,sym){
 const pool=QUIZZES[sym]||QUIZZES.H,history=state.quizSeen||(state.quizSeen={}),seen=history[sym]||(history[sym]=[]);
 if(seen.length>=pool.length)seen.length=0;
 const available=pool.map((_,i)=>i).filter(i=>!seen.includes(i));
 const sourceIndex=available[Math.floor(state.rnd()*available.length)];seen.push(sourceIndex);
 const original=pool[sourceIndex],order=original[3].map((_,i)=>i);
 for(let i=order.length-1;i>0;i--){const j=Math.floor(state.rnd()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 const options=order.map(i=>original[3][i]),correct=order.indexOf(original[4]);
 const question=[original[0],original[1],original[2],options,correct];
 question.sourceIndex=sourceIndex;question.optionOrder=order;
 return question;
}
function collect(state){if(state.pending||state.failed||state.completed)return null;const p=state.player;
 if(state.activator&&p.x===state.activator.x&&p.y===state.activator.y){state.activator=null;state.inv.ACT=(state.inv.ACT||0)+1;state.events.push({type:'activator'});}
 const j=state.atoms.findIndex(a=>a.x===p.x&&a.y===p.y);if(j<0)return null;
 if(countInv(state.inv)>=MAX_INV){state.events.push({type:'full'});return null;}
 const atom=state.atoms.splice(j,1)[0];const q=questionFor(state,atom.sym);state.pending={sym:atom.sym,question:q};state.events.push({type:'quiz',sym:atom.sym});return state.pending;
}
function answer(state,index){const p=state.pending;if(!p)return null;
 const ok=Number.isInteger(index)&&index===p.question[4];state.stats.attempts++;if(ok){state.stats.correct++;state.inv[p.sym]=(state.inv[p.sym]||0)+1;}else{state.stats.missed++;}state.pending=null;state.events.push({type:ok?'correct':'wrong',sym:p.sym});return {ok,sym:p.sym,correct:p.question[4]};}
function canWalk(state,x,y){return open(state,x,y)&&!state.bombs.some(b=>b.x===x&&b.y===y);}
function move(state,dx,dy){if(state.pending||state.failed||state.completed||Math.abs(dx)+Math.abs(dy)!==1)return false;const p=state.player,nx=p.x+dx,ny=p.y+dy;if(!canWalk(state,nx,ny))return false;p.x=nx;p.y=ny;collect(state);for(const b of state.bonuses){if(b.x===nx&&b.y===ny){if(b.type==='shield')p.shield++;else state.upgrades[b.type]=Math.min(3,(state.upgrades[b.type]||0)+1);state.events.push({type:'upgrade',kind:b.type});}}state.bonuses=state.bonuses.filter(b=>b.x!==nx||b.y!==ny);return true;}
function craft(state,recipeId){const idx=RECIPES.findIndex(r=>r.id===recipeId);if(idx<0||idx>state.stage)return 'locked';const r=RECIPES[idx];if(Object.entries(r.atoms).some(([sym,n])=>(state.inv[sym]||0)<n))return 'missing';if(r.needsActivator&&!(state.inv.ACT>0))return 'activator';for(const [sym,n] of Object.entries(r.atoms))state.inv[sym]-=n;if(r.needsActivator)state.inv.ACT--;state.ammo[recipeId]=(state.ammo[recipeId]||0)+1;state.stats.crafted++;state.events.push({type:'craft',recipe:recipeId});return 'ok';}
function place(state,recipeId){if(state.failed||state.completed||state.pending)return 'blocked';if(!(state.ammo[recipeId]>0))return 'empty';if(state.bombs.length>=1+state.upgrades.flask)return 'limit';const {x,y}=state.player;if(state.bombs.some(b=>b.x===x&&b.y===y))return 'occupied';state.ammo[recipeId]--;state.bombs.push({x,y,recipe:recipeId,fuse:Math.max(1.0,2.55-.25*state.upgrades.catalyst),id:state.elapsed+state.bombs.length/100});state.events.push({type:'placed'});return 'ok';}
function beam(state,b){const cells=[{x:b.x,y:b.y}],broken=[];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])for(let i=1;i<=2+state.upgrades.range;i++){const x=b.x+dx*i,y=b.y+dy*i;if(!inside(x,y))break;const tile=state.grid[y][x];if(tile==='#')break;cells.push({x,y});if(tile==='%'){broken.push({x,y});break;}}return {cells,broken};}
function damage(state){if(state.failed)return;if(state.player.shield>0){state.player.shield--;state.events.push({type:'shield'});return;}state.player.hp=Math.max(0,state.player.hp-1);state.events.push({type:'hurt'});if(!state.player.hp){state.failed=true;state.events.push({type:'failed'});}}
function strike(state,b){const result=beam(state,b),now=state.elapsed,combo=state.waves.some(w=>w.cells.some(c=>result.cells.some(v=>v.x===c.x&&v.y===c.y)));state.stats.detonations++;state.waves.push({cells:result.cells,ttl:combo?0.95:0.7,recipe:b.recipe,combo});for(const p of result.broken){state.grid[p.y][p.x]='.';if(state.rnd()<0.42){const kinds=['range','flask','catalyst','shield'];state.bonuses.push({x:p.x,y:p.y,type:kinds[Math.floor(state.rnd()*kinds.length)]});}}
 for(const a of state.enemies){if(!a.alive)continue;if(!result.cells.some(c=>c.x===a.x&&c.y===a.y))continue;const target=RECIPES[state.stage].id;if(b.recipe===target){a.alive=false;state.stats.defeated++;state.events.push({type:'defeated'});}else if(a.type==='spark'&&b.recipe==='H2O'){a.boost=8;state.events.push({type:'empowered'});}else if(a.type==='heavy'){const spot=neighbors(a.x,a.y).find(([x,y])=>canWalk(state,x,y)&&!state.enemies.some(e=>e.alive&&e.x===x&&e.y===y));if(spot&&state.enemies.length<5){state.enemies.push({id:state.enemies.length,x:spot[0],y:spot[1],type:'heavy',alive:true,clock:0,dir:0,boost:0});state.events.push({type:'split'});}}}
 for(const h of state.hazards)if(result.cells.some(c=>c.x===h.x&&c.y===h.y)&&((b.recipe==='H2O'&&h.type==='flame')||(b.recipe==='NaOH'&&h.type==='acid')||(b.recipe==='HCl'&&h.type==='alkaline')))h.ttl=0;
 if(b.recipe==='H2O')for(const c of result.cells)state.hazards.push({x:c.x,y:c.y,type:'wet',ttl:2.0});
 if(result.cells.some(c=>c.x===state.player.x&&c.y===state.player.y))damage(state);
 for(const other of state.bombs)if(other!==b&&result.cells.some(c=>c.x===other.x&&c.y===other.y))other.fuse=0;
 state.events.push({type:'detonation',combo});return result;
}
function enemyStep(state,enemy){if(!enemy.alive)return;const p=state.player;const moves=neighbors(enemy.x,enemy.y).filter(([x,y])=>canWalk(state,x,y)&&!state.enemies.some(a=>a!==enemy&&a.alive&&a.x===x&&a.y===y));
 if(!moves.length)return;
 const chasing=Math.abs(enemy.x-p.x)+Math.abs(enemy.y-p.y)<(enemy.type==='rust'?5:8);
 moves.sort((a,b)=>((Math.abs(a[0]-p.x)+Math.abs(a[1]-p.y))-(Math.abs(b[0]-p.x)+Math.abs(b[1]-p.y))));
 let next=chasing?moves[0]:moves[Math.floor(state.rnd()*moves.length)];
 if(enemy.type==='spark'&&state.rnd()<0.12){const far=state.enemies.filter(e=>e.alive&&e!==enemy);const candidates=neighbors(enemy.x,enemy.y).filter(([x,y])=>canWalk(state,x,y)&&!far.some(e=>e.x===x&&e.y===y));if(candidates.length)next=candidates[Math.floor(state.rnd()*candidates.length)];}
 const [oldx,oldy]=[enemy.x,enemy.y];enemy.x=next[0];enemy.y=next[1];
 if(['fire','acid','alkaline','spark'].includes(enemy.type))state.hazards.push({x:oldx,y:oldy,type:enemy.type==='fire'?'flame':enemy.type,ttl:enemy.type==='fire'?2.5:3.5});
 if(enemy.type==='acid'&&state.rnd()<0.22){const weak=neighbors(enemy.x,enemy.y).filter(([x,y])=>state.grid[y][x]==='%');if(weak.length){const [wx,wy]=weak[0];state.grid[wy][wx]='.';state.events.push({type:'eroded'});}}
 if(enemy.x===p.x&&enemy.y===p.y&&(!state.hitCooldown||state.hitCooldown<=0)){if(enemy.type==='rust'){state.player.hp=0;state.failed=true;state.events.push({type:'failed'});}else damage(state);state.hitCooldown=1.6;}
}
function tick(state,dt){if(state.failed||state.completed||state.pending)return;dt=Math.min(.08,Math.max(0,dt));state.elapsed+=dt;state.hitCooldown=Math.max(0,(state.hitCooldown||0)-dt);
 for(const h of state.hazards)h.ttl-=dt;state.hazards=state.hazards.filter(h=>h.ttl>0);
 for(const wave of state.waves)wave.ttl-=dt;state.waves=state.waves.filter(w=>w.ttl>0);
 // Fuse expiry can cause a real same-frame chain reaction; remove each detonated charge exactly once.
 for(const b of state.bombs)b.fuse-=dt;
 let loops=0;while(loops++<20){const at=state.bombs.findIndex(b=>b.fuse<=0);if(at<0)break;const [b]=state.bombs.splice(at,1);strike(state,b);}
 for(const enemy of state.enemies){if(!enemy.alive)continue;enemy.clock+=dt;enemy.boost=Math.max(0,enemy.boost-dt);const interval=Math.max(.22,STAGES[state.stage].speed-(enemy.boost>0?.3:0));if(enemy.clock>=interval){enemy.clock=0;enemyStep(state,enemy);}}
 const touching=state.enemies.find(e=>e.alive&&e.x===state.player.x&&e.y===state.player.y);
 if(state.hitCooldown<=0&&(state.hazards.some(h=>h.x===state.player.x&&h.y===state.player.y&&h.type!=='wet')||touching)){if(touching?.type==='rust'){state.player.hp=0;state.failed=true;state.events.push({type:'failed'});}else damage(state);state.hitCooldown=1.6;}
 // Safe periodic ion generator: after missed quizzes/expended charges a new quiz-able atom becomes available.
 state.generatorTimer-=dt;if(state.generatorTimer<=0){state.generatorTimer=8;const syms=Object.keys(RECIPES[state.stage].atoms);const sym=syms[Math.floor(state.rnd()*syms.length)];const pos=[state.gen,...neighbors(state.gen.x,state.gen.y).map(([x,y])=>({x,y}))].find(p=>open(state,p.x,p.y)&&!(p.x===state.player.x&&p.y===state.player.y)&&!state.atoms.some(a=>a.x===p.x&&a.y===p.y));if(pos){state.atoms.push({id:state.elapsed,x:pos.x,y:pos.y,sym});state.events.push({type:'generated',sym});}}
}
function finish(state){if(state.failed||state.completed||state.pending||state.enemies.some(e=>e.alive))return false;if(state.player.x!==state.exit.x||state.player.y!==state.exit.y)return false;state.completed=true;state.events.push({type:'completed'});return true;}
function purge(state,sym){if(!(state.inv[sym]>0))return false;state.inv[sym]--;state.stats.purged++;state.events.push({type:'purged',sym});if(sym==='Na'&&state.hazards.some(h=>h.type==='wet'&&h.x===state.player.x&&h.y===state.player.y)){damage(state);state.events.push({type:'sodiumWater'});}return true;}
return{W,H,MAX_INV,RECIPES,STAGES,QUIZZES,createLevel,questionFor,collect,answer,move,craft,place,beam,tick,finish,purge,damage,countInv};
});
