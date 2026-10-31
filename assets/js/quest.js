/* Chemistry Quest: original, dependency-free canvas platform game. MIT. */
(()=>{'use strict';
const $=id=>document.getElementById(id), cv=$('questCanvas'),ctx=cv.getContext('2d'),W=960,H=480;
const words={
hu:{subtitle:'Kémiai platformkaland · két pálya',move:'A/D vagy nyilak: mozgás · W/Space: ugrás · E: készítés / használat',health:'Élet',atoms:'Atomok',craft:'Készítés / Használat',level:'Pálya',goal1:'1. pálya: H₂O készítés, tűzlény kioltása, oxigénrejtvény',goal2:'2. pálya: CO₂ készítés, mozgó tűzrobot legyőzése',need1:'Víz: 2 H + 1 O',need2:'Szén-dioxid: 1 C + 2 O',missing1:'Gyűjts 2 H és 1 O atomot.',missing2:'Gyűjts 1 C és 2 O atomot.',made1:'Elkészült a víz! Menj közel a tűzlényhez és nyomj E-t.',made2:'Elkészült a CO₂! A mozgó tűzrobot közelében nyomj E-t.',enemy1:'A tűzlény elállja az utat! Víz kell a kioltásához.',enemy2:'A tűzrobot mozog! CO₂-vel lehet ártalmatlanítani.',hit:'Veszély! Vigyázz az akadályokra.',splash1:'A tűzlény kialudt!',splash2:'A tűzrobot semlegesítve!',gate:'Az ajtó még zárva: teljesítsd a küldetést.',quiz:'Mennyi az oxigén rendszáma?',wrong:'Nem helyes. Nézd meg a periódusos rendszerben.',correct:'Helyes! Oxigén: 8.',win1:'ELSŐ PÁLYA TELJESÍTVE! Következik a tűzrobot.',win2:'KÉT PÁLYA TELJESÍTVE! A labor biztonságban.',next:'Következő pálya ▶',restart:'Újrakezdés',collect:'Összegyűjtve',science:'A játékbeli crafting leegyszerűsített, nem valódi reakciószimuláció.'},
de:{subtitle:'Chemie-Plattformabenteuer · zwei Level',move:'A/D oder Pfeile: laufen · W/Leertaste: springen · E: bauen / verwenden',health:'Leben',atoms:'Atome',craft:'Bauen / Verwenden',level:'Level',goal1:'Level 1: H₂O bauen, Feuerwesen löschen, Sauerstoffrätsel',goal2:'Level 2: CO₂ bauen, beweglichen Feuerroboter besiegen',need1:'Wasser: 2 H + 1 O',need2:'Kohlendioxid: 1 C + 2 O',missing1:'Sammle 2 H und 1 O.',missing2:'Sammle 1 C und 2 O.',made1:'Wasser fertig! Gehe zum Feuerwesen und drücke E.',made2:'CO₂ fertig! Gehe zum Feuerroboter und drücke E.',enemy1:'Das Feuerwesen blockiert den Weg. Wasser wird benötigt.',enemy2:'Der Feuerroboter bewegt sich! Verwende CO₂.',hit:'Vorsicht! Hindernisse.',splash1:'Feuerwesen gelöscht!',splash2:'Feuerroboter neutralisiert!',gate:'Die Tür ist noch geschlossen.',quiz:'Welche Ordnungszahl hat Sauerstoff?',wrong:'Nicht richtig. Schau im Periodensystem nach.',correct:'Richtig! Sauerstoff: 8.',win1:'LEVEL 1 GESCHAFFT! Jetzt der Feuerroboter.',win2:'BEIDE LEVEL GESCHAFFT!',next:'Nächstes Level ▶',restart:'Neustart',collect:'Gesammelt',science:'Crafting ist vereinfacht und keine echte Reaktionssimulation.'},
en:{subtitle:'Chemistry platform adventure · two levels',move:'A/D or arrows: move · W/Space: jump · E: craft / use',health:'Health',atoms:'Atoms',craft:'Craft / Use',level:'Level',goal1:'Level 1: craft H₂O, extinguish fire creature, oxygen puzzle',goal2:'Level 2: craft CO₂, defeat a moving fire robot',need1:'Water: 2 H + 1 O',need2:'Carbon dioxide: 1 C + 2 O',missing1:'Collect 2 H and 1 O.',missing2:'Collect 1 C and 2 O.',made1:'Water crafted! Approach the fire creature and press E.',made2:'CO₂ crafted! Approach the moving fire robot and press E.',enemy1:'The fire creature blocks the way. Use water.',enemy2:'The fire robot moves! Use CO₂.',hit:'Watch out for hazards!',splash1:'Fire creature extinguished!',splash2:'Fire robot neutralized!',gate:'Door locked. Complete the mission.',quiz:'What is oxygen’s atomic number?',wrong:'Not correct. Check the periodic table.',correct:'Correct! Oxygen: 8.',win1:'LEVEL ONE COMPLETE! The fire robot awaits.',win2:'BOTH LEVELS COMPLETE!',next:'Next level ▶',restart:'Restart',collect:'Collected',science:'In-game crafting is simplified; this is not a real chemical reaction simulation.'}};
const tr=k=>(words[typeof lang==='string'&&words[lang]?lang:'hu'])[k]||k;
const basePlatforms=[{x:0,y:425,w:350,h:55},{x:390,y:425,w:330,h:55},{x:760,y:425,w:390,h:55},{x:1190,y:425,w:450,h:55},{x:1680,y:425,w:560,h:55}];
const ledges1=[[165,340,140],[460,331,145],[680,280,140],[910,343,150],[1120,305,120],[1380,325,145],[1630,306,145],[1865,337,145]];
const ledges2=[[180,340,135],[445,303,135],[680,342,145],[930,283,150],[1170,340,140],[1400,293,150],[1650,337,145],[1850,287,155]];
const levels=[
{pickups:[['H',205,302],['H',492,290],['O',952,306],['H',1408,290],['O',1664,270]],ledges:ledges1,hazards:[{x:820,y:406,w:48,h:19},{x:1500,y:406,w:45,h:19}],boss:{x:1990,y:388,w:32,h:37,min:1930,max:2050,speed:40},formula:'H₂O',requirements:{H:2,O:1},quiz:true},
{pickups:[['O',212,301],['C',490,265],['O',970,245],['C',1420,256],['O',1690,300]],ledges:ledges2,hazards:[{x:810,y:405,w:58,h:20},{x:1310,y:405,w:50,h:20},{x:1790,y:405,w:45,h:20}],boss:{x:1850,y:388,w:44,h:37,min:1740,max:2040,speed:125},formula:'CO₂',requirements:{C:1,O:2},quiz:false}
];
let level=0,player,inventory,items,boss,water,quizSolved,quizActive,completed,keys={},jumpBuffer=0,coyote=0,elapsed=0,lastTime=0,camera=0,invulnerable=0,shotTimer=0,shotStart=null,shotTarget=null,notice='',frameId=0;
let pendingAtom=null, lastQuestion=-1, nextLevelCountdown=0,craftOpen=false,selectedRecipe='';
const atomQuestions={
 H:[
 {hu:['Mi a hidrogén vegyjele?', 'H','He','O'],de:['Was ist das Symbol für Wasserstoff?','H','He','O'],en:['What is the symbol for hydrogen?','H','He','O']},
 {hu:['Hány protonja van a hidrogénnek?','1','2','8'],de:['Wie viele Protonen hat Wasserstoff?','1','2','8'],en:['How many protons does hydrogen have?','1','2','8']},
 {hu:['Melyik állítás igaz a hidrogénre?','Nemfém','Nemesgáz','Alkálifém'],de:['Welche Aussage über Wasserstoff ist richtig?','Nichtmetall','Edelgas','Alkalimetall'],en:['Which statement about hydrogen is correct?','Nonmetal','Noble gas','Alkali metal']}
 ],
 O:[
 {hu:['Mennyi az oxigén rendszáma?','8','6','12'],de:['Wie lautet die Ordnungszahl von Sauerstoff?','8','6','12'],en:['What is the atomic number of oxygen?','8','6','12']},
 {hu:['Hány vegyértékelektronja van az oxigénnek?','6','2','8'],de:['Wie viele Valenzelektronen hat Sauerstoff?','6','2','8'],en:['How many valence electrons does oxygen have?','6','2','8']},
 {hu:['Mi a közönséges oxigéngáz képlete?','O₂','O₃','H₂O'],de:['Wie lautet die Formel des gewöhnlichen Sauerstoffgases?','O₂','O₃','H₂O'],en:['What is the formula of ordinary oxygen gas?','O₂','O₃','H₂O']}
 ],
 C:[
 {hu:['Mennyi a szén rendszáma?','6','8','12'],de:['Wie lautet die Ordnungszahl von Kohlenstoff?','6','8','12'],en:['What is the atomic number of carbon?','6','8','12']},
 {hu:['Hány vegyértékelektronja van a szénnek?','4','2','6'],de:['Wie viele Valenzelektronen hat Kohlenstoff?','4','2','6'],en:['How many valence electrons does carbon have?','4','2','6']},
 {hu:['Melyik anyag tartalmaz kizárólag szénatomokat?','Gyémánt','Víz','Konyhasó'],de:['Welcher Stoff besteht nur aus Kohlenstoff?','Diamant','Wasser','Kochsalz'],en:['Which substance is made entirely of carbon?','Diamond','Water','Table salt']}
 ]};
const quizLanguage=()=>typeof lang==='string'&&['hu','de','en'].includes(lang)?lang:'hu';

const gate={x:2130,y:338,w:33,h:87};
const quiz=$('questQuiz')||document.createElement('div');quiz.id='questQuiz';quiz.className='quest-quiz';quiz.hidden=true;cv.insertAdjacentElement('beforebegin',quiz);
const craftMenu=document.createElement('div');craftMenu.id='questCraftMenu';craftMenu.className='quest-quiz';craftMenu.hidden=true;cv.insertAdjacentElement('beforebegin',craftMenu);
const recipes=[{id:'H2O',formula:'H₂O',atoms:{H:2,O:1},level:0},{id:'CO2',formula:'CO₂',atoms:{C:1,O:2},level:1},{id:'O2',formula:'O₂',atoms:{O:2},level:-1}];
function makeCraftMenu(){craftMenu.replaceChildren();const title=document.createElement('strong');title.textContent=({hu:'Melyik molekulát készíted?',de:'Welches Molekül möchtest du herstellen?',en:'Which molecule do you want to craft?'})[quizLanguage()];craftMenu.append(title);
 const select=document.createElement('select');select.id='questRecipeSelect';select.style.cssText='display:block;margin:12px 0;width:100%;padding:10px;background:#172e47;color:#fff;border:1px solid #70b9d8;border-radius:6px';
 for(const r of recipes){const opt=document.createElement('option');opt.value=r.id;opt.textContent=r.formula+' — '+Object.entries(r.atoms).map(([a,n])=>n+' '+a).join(' + ');select.append(opt)}
 select.value=selectedRecipe||levels[level].formula.replaceAll('₂','2').replaceAll('₃','3');craftMenu.append(select);
 const controls=document.createElement('div');controls.className='quest-options';const confirm=document.createElement('button');confirm.textContent=({hu:'Elkészítés',de:'Herstellen',en:'Craft'})[quizLanguage()];confirm.onclick=()=>{selectedRecipe=select.value;craftOpen=false;craftMenu.hidden=true;craft(selectedRecipe);cv.focus({preventScroll:true})};const cancel=document.createElement('button');cancel.textContent=({hu:'Mégse',de:'Abbrechen',en:'Cancel'})[quizLanguage()];cancel.onclick=closeCraft;controls.append(confirm,cancel);craftMenu.append(controls);}
function openCraft(){if(quizActive||completed)return;craftOpen=true;makeCraftMenu();craftMenu.hidden=false;craftMenu.querySelector('select').focus({preventScroll:true})}
function closeCraft(){craftOpen=false;craftMenu.hidden=true;cv.focus({preventScroll:true})}
const next=document.createElement('button');next.id='questNext';next.hidden=true;next.type='button';next.style.margin='12px 4px';cv.insertAdjacentElement('afterend',next);next.onclick=()=>loadLevel(1);
function say(s){notice=s;$('questMessage').textContent=s}
function loadLevel(n){level=n;let data=levels[level];player={x:50,y:380,vx:0,vy:0,w:25,h:36,ground:false,hp:3};inventory={H:0,O:0,C:0};items=data.pickups.map(([s,x,y])=>({s,x,y,taken:false}));boss={...data.boss,dir:1,alive:true};water=false;quizSolved=!data.quiz;quizActive=false;completed=false;camera=0;elapsed=0;invulnerable=0;jumpBuffer=0;coyote=0;shotTimer=0;pendingAtom=null;nextLevelCountdown=0;next.hidden=true;quiz.hidden=true;craftOpen=false;craftMenu.hidden=true;selectedRecipe='';keys={};say(tr('move'));hud()}
function hud(){const k=String(level+1);$('questHealth').textContent='♥ '+tr('health')+': '+player.hp+'/3';$('questInventory').textContent=tr('atoms')+': H × '+inventory.H+' | O × '+inventory.O+' | C × '+inventory.C+(water?' | '+levels[level].formula+' ✓':'');$('questGoal').textContent=tr('goal'+k);$('questRecipe').textContent=tr('need'+k)+' · '+tr('science')}
function craft(recipeId){if(completed||quizActive)return;const rec=recipes.find(r=>r.id===recipeId);if(!rec)return;
 if(water){say(tr('made'+(level+1)));return}
 if(rec.level!==level){say(({hu:'Ezen a pályán ez nem a megfelelő küldetésmolekula.',de:'Das ist nicht das benötigte Missionsmolekül für dieses Level.',en:'This is not the mission molecule for this level.'})[quizLanguage()]);return}
 if(Object.entries(rec.atoms).some(([symbol,count])=>inventory[symbol]<count)){say(tr('missing'+(level+1)));return}
 const atoms=level===0?[{id:'a',s:'O'},{id:'b',s:'H'},{id:'c',s:'H'}]:[{id:'a',s:'C'},{id:'b',s:'O'},{id:'c',s:'O'}];
 const bonds=level===0?[{a:'a',b:'b',order:1,kind:'covalent'},{a:'a',b:'c',order:1,kind:'covalent'}]:[{a:'a',b:'b',order:2,kind:'covalent'},{a:'a',b:'c',order:2,kind:'covalent'}];
 if(window.ChemistryEngine){const result=window.ChemistryEngine.analyze(atoms,bonds);if(result.issues?.length){say('Chemistry validation failed');return}}
 Object.entries(rec.atoms).forEach(([symbol,count])=>inventory[symbol]-=count);water=true;say(tr('made'+(level+1)));hud();}
function action(){if(completed||quizActive)return;if(craftOpen){closeCraft();return}
 const dx=boss.x+boss.w/2-(player.x+player.w/2),dy=boss.y+boss.h/2-(player.y+player.h/2);
 if(boss.alive&&Math.hypot(dx,dy)<125){if(!water){say(tr('missing'+(level+1)));openCraft();return}boss.alive=false;shotTimer=.5;shotStart={x:player.x+12,y:player.y+15};shotTarget={x:boss.x+boss.w/2,y:boss.y+boss.h/2};say(tr('splash'+(level+1)));hud();return}
 openCraft();}
function askAtomQuestion(atom){
 if(quizActive||completed)return;
 pendingAtom=atom;quizActive=true;craftOpen=false;craftMenu.hidden=true;keys={};jumpBuffer=0;quiz.hidden=false;quiz.replaceChildren();
 const pool=atomQuestions[atom.s],options=pool.map((_,i)=>i).filter(i=>i!==lastQuestion);
 const idx=options[Math.floor(Math.random()*options.length)] ?? Math.floor(Math.random()*pool.length);
 lastQuestion=idx;
 const q=pool[idx][quizLanguage()];
 const title=document.createElement('strong');title.textContent=atom.s+' · '+q[0];quiz.append(title);
 const answers=[q[1],q[2],q[3]].map((text,i)=>({text,correct:i===0}));
 for(let i=answers.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[answers[i],answers[j]]=[answers[j],answers[i]]}
 const buttons=document.createElement('div');buttons.className='quest-options';quiz.append(buttons);
 for(const answer of answers){
  const b=document.createElement('button');b.textContent=answer.text;
  b.onclick=()=>{
   if(!answer.correct){say(tr('wrong'));b.disabled=true;b.style.opacity='.5';return}
   atom.taken=true;inventory[atom.s]++;if(atom.s==='O')quizSolved=true;
   pendingAtom=null;quizActive=false;quiz.hidden=true;say(tr('collect')+': '+atom.s+' ✓');hud();
  };
  buttons.append(b);
 }
 say(atom.s+' · '+q[0]);
}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function damage(){if(invulnerable>0)return;invulnerable=1.5;player.hp--;say(tr('hit'));if(player.hp<=0){player.hp=3;player.x=50;player.y=365;player.vy=0}hud()}
function physics(dt){if(completed){if(level===0&&nextLevelCountdown>0){nextLevelCountdown-=dt;if(nextLevelCountdown<=0)loadLevel(1)}return}if(quizActive||craftOpen)return;elapsed+=dt;invulnerable=Math.max(0,invulnerable-dt);shotTimer=Math.max(0,shotTimer-dt);jumpBuffer=Math.max(0,jumpBuffer-dt);coyote=Math.max(0,coyote-dt);
const direction=(keys.left?-1:0)+(keys.right?1:0);player.vx=direction*230;
if(jumpBuffer>0&&(player.ground||coyote>0)){player.vy=-530;player.ground=false;coyote=0;jumpBuffer=0}
let oldY=player.y;player.x=Math.max(0,Math.min(2200-player.w,player.x+player.vx*dt));player.vy=Math.min(750,player.vy+1000*dt);player.y+=player.vy*dt;
let landed=false;const all=basePlatforms.concat(levels[level].ledges.map(([x,y,w])=>({x,y,w,h:17})));
// ONE-WAY COLLISION: the character can jump through ledges and land on top.
for(const p of all){if(player.vy>=0&&oldY+player.h<=p.y+6&&player.y+player.h>=p.y&&player.x+player.w>p.x+3&&player.x<p.x+p.w-3){player.y=p.y-player.h;player.vy=0;landed=true}}
if(landed){player.ground=true;coyote=.11}else if(player.ground){player.ground=false;coyote=.11}
if(jumpBuffer>0&&player.ground){player.vy=-530;player.ground=false;coyote=0;jumpBuffer=0}
if(player.y>500){damage();player.x=65;player.y=350;player.vy=0}
for(const atom of items)if(!atom.taken&&Math.hypot(atom.x-(player.x+12),atom.y-(player.y+16))<45){askAtomQuestion(atom);break}
for(const h of levels[level].hazards)if(overlap(player,h)){damage();player.vy=-240;player.x-=player.vx>=0?25:-25}
if(boss.alive){boss.x+=boss.dir*boss.speed*dt;if(boss.x<boss.min||boss.x>boss.max){boss.x=Math.min(boss.max,Math.max(boss.min,boss.x));boss.dir*=-1}if(overlap(player,boss)){damage()}}
// Atom questions pause the game and grant the collected atom only after the correct answer.
if(boss.alive&&player.x>boss.x-37&&player.x<boss.x+boss.w+20){player.x=boss.x-37;if(Math.floor(elapsed*2)%3===0)say(tr('enemy'+(level+1)))}
if(player.x>gate.x-50){if(water&&quizSolved&&!boss.alive){completed=true;next.hidden=level!==0;next.textContent=tr('next');nextLevelCountdown=level===0?3.0:0;say(tr('win'+(level+1)));if(level===1)try{localStorage.setItem('chemistryQuestWon','yes')}catch{}}else{player.x=gate.x-50;say(tr('gate'))}}
camera=Math.max(0,Math.min(1280,player.x-270))}
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h))}
function draw(){ctx.imageSmoothingEnabled=false;const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,level===0?'#08172b':'#24142c');bg.addColorStop(1,level===0?'#263958':'#453045');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);for(let i=0;i<85;i++)rect(((i*173)%2600-camera*.22)%1100,15+(i*79)%255,2,2,'#7e94b0');for(let i=0;i<22;i++){let x=i*120-camera*.45;rect(x,180+i%4*12,80,260,'#172540');rect(x+15,205+i%4*12,8,10,'#42687e')}
ctx.save();ctx.translate(-Math.floor(camera),0);
for(const p of basePlatforms.concat(levels[level].ledges.map(([x,y,w])=>({x,y,w,h:17})))){rect(p.x,p.y,p.w,p.h,'#314965');rect(p.x,p.y,p.w,7,'#62c1a1');for(let x=p.x+8;x<p.x+p.w-5;x+=23)rect(x,p.y+12,12,4,'#26344f')}
for(const h of levels[level].hazards){rect(h.x,h.y,h.w,h.h,'#ec6545');for(let i=0;i<h.w;i+=12){ctx.fillStyle='#f8c064';ctx.beginPath();ctx.moveTo(h.x+i,h.y);ctx.lineTo(h.x+i+6,h.y-12);ctx.lineTo(h.x+i+12,h.y);ctx.fill()}}
for(const a of items){if(a.taken)continue;const y=a.y+Math.sin(elapsed*3+a.x)*4;ctx.shadowBlur=12;ctx.shadowColor=a.s==='O'?'#f46965':a.s==='C'?'#9dd0b1':'#d4eeff';ctx.fillStyle=a.s==='O'?'#ff766d':a.s==='C'?'#99b9a4':'#d4eaff';ctx.beginPath();ctx.arc(a.x,y,16,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#183047';ctx.font='bold 19px monospace';ctx.textAlign='center';ctx.fillText(a.s,a.x,y+6)}
if(boss.alive){const bx=Math.round(boss.x),by=Math.round(boss.y);rect(bx+5,by+12,boss.w-10,boss.h-12,'#ff824e');rect(bx+9,by+23,5,5,'#261b31');rect(bx+boss.w-15,by+23,5,5,'#261b31');ctx.fillStyle='#ffdc78';ctx.beginPath();ctx.moveTo(bx+boss.w/2,by-13+4*Math.sin(elapsed*10));ctx.lineTo(bx,by+20);ctx.lineTo(bx+boss.w,by+20);ctx.fill();if(level===1){rect(bx+2,by+12,boss.w-4,8,'#d8524b');rect(bx+boss.w/2-3,by+19,6,7,'#fff5a1')}}
if(shotTimer>0&&shotStart&&shotTarget)for(let i=0;i<12;i++){let t=i/11;ctx.fillStyle=i%2?'#7bd5ff':'#d2f5ff';ctx.beginPath();ctx.arc(shotStart.x+(shotTarget.x-shotStart.x)*t,shotStart.y+(shotTarget.y-shotStart.y)*t+Math.sin(elapsed*40+i)*3,3.5,0,Math.PI*2);ctx.fill()}
rect(gate.x,gate.y,gate.w,gate.h,water&&quizSolved&&!boss.alive?'#60e9b4':'#ff9c7e');rect(gate.x+8,gate.y+7,18,66,'#16263e');rect(gate.x+12,gate.y+30,10,10,water&&quizSolved&&!boss.alive?'#60e9b4':'#f06a60');
const x=Math.round(player.x),y=Math.round(player.y);if(invulnerable<.02||Math.floor(elapsed*12)%2===0){rect(x+6,y,13,6,'#ffe2b1');rect(x+3,y+6,19,13,'#78d8f4');rect(x+7,y+9,12,5,'#1b3048');rect(x+2,y+19,23,13,'#f2bc6d');rect(x+7,y+21,11,8,'#8ce4e1');rect(x+4,y+32,7,5,'#e1edff');rect(x+16,y+32,7,5,'#e1edff')}
ctx.restore();ctx.font='bold 13px monospace';ctx.fillStyle='#d8eaff';ctx.textAlign='left';ctx.fillText('SECTOR '+String(level+1).padStart(2,'0')+' · CHEMISTRY QUEST',20,26);
if(completed){rect(185,162,590,120,'#102e41');ctx.fillStyle='#b5ffda';ctx.font='bold 23px monospace';ctx.textAlign='center';ctx.fillText(tr('win'+(level+1)),480,225)}}
function tick(time){const dt=Math.min(.033,(time-lastTime)/1000||.016);lastTime=time;if(!$('gameSection').classList.contains('hidden')){physics(dt);draw()}frameId=requestAnimationFrame(tick)}
const bind={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
document.addEventListener('keydown',e=>{if($('gameSection').classList.contains('hidden'))return;if(/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)){if(e.code==='Escape'&&craftOpen)closeCraft();if(e.code==='KeyE'&&craftOpen){e.preventDefault();craftMenu.querySelector('.quest-options button').click()}return}if(quizActive||craftOpen){if(e.code==='Escape'&&craftOpen)closeCraft();return}if(bind[e.code])keys[bind[e.code]]=true;if(['ArrowUp','Space','KeyW'].includes(e.code)){jumpBuffer=.16;e.preventDefault()}if(e.code==='KeyE'&&!e.repeat){e.preventDefault();action()}if(['ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault()});
document.addEventListener('keyup',e=>{if(bind[e.code])keys[bind[e.code]]=false});window.addEventListener('blur',()=>keys={});
for(const [id,key] of [['questLeft','left'],['questRight','right']]){const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();keys[key]=true;b.setPointerCapture(e.pointerId)});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>keys[key]=false)}
$('questJump').onclick=()=>jumpBuffer=.16;$('questCraft').onclick=()=>{if(craftOpen)closeCraft();else openCraft()};$('questRestart').onclick=()=>loadLevel(level);$('questMute').onclick=()=>{$('questMute').textContent=$('questMute').textContent==='♫'?'♪':'♫'};
function localize(){$('questSubtitle').textContent=tr('subtitle');$('questCraftLabel').textContent=tr('craft');$('questInstructions').textContent=tr('move');$('questRestart').title=tr('restart');if(!next.hidden)next.textContent=tr('next');if(craftOpen)makeCraftMenu();hud();if(quizActive&&pendingAtom){quiz.firstChild.textContent=pendingAtom.s+' · '+quiz.firstChild.textContent.split(' · ').slice(1).join(' · ')}}
function show(){tab='quest';for(const id of ['periodSection','moleculeSection','huntSection','materialsSection','physicsSection','specSection','reactionSection','atomDetail']){const e=$(id);if(e)e.classList.add('hidden')}for(const b of document.querySelectorAll('.tabs button'))b.classList.remove('active');$('gameTab').classList.add('active');$('gameSection').classList.remove('hidden');localize();cv.focus({preventScroll:true})}
$('gameTab').onclick=show;document.querySelectorAll('.tabs button:not(#gameTab)').forEach(e=>e.addEventListener('click',()=>{$('gameSection').classList.add('hidden');keys={}},true));
window.ChemQuest={localize,reset:()=>loadLevel(0),craft:openCraft,debug:()=>({level:level+1,inventory:{...inventory},crafted:water,quizSolved,completed,bossAlive:boss.alive,player:{...player}}),jump:()=>jumpBuffer=.16};loadLevel(0);localize();frameId=requestAnimationFrame(tick);
})();
