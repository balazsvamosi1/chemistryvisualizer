/* Reaction Maze UI — original Apache-2.0, runs locally on GitHub Pages. */
(()=>{'use strict';
if(typeof document==='undefined'||!window.ReactionMazeCore)return;
const G=window.ReactionMazeCore,$=id=>document.getElementById(id),cv=$('mazeCanvas');if(!cv)return;
const ctx=cv.getContext('2d'),TILE=36,COL=G.W,ROW=G.H;cv.width=COL*TILE;cv.height=ROW*TILE;
const lang=()=>['hu','de','en'].find(k=>$(k)?.classList.contains('active'))||'hu';
const li=()=>({hu:0,de:1,en:2}[lang()]||0);
const T={
hu:{name:'Reakció-labirintus',subtitle:'Hatpályás taktikai kémiakaland · kvízes atomgyűjtés',start:'Új játék',restart:'Pálya újraindítása',next:'Következő pálya',instructions:'Nyilak / WASD: mozgás · C: szintézis · Space / E: töltet lerakása · 1–6: recept · P: atom ürítése',quiz:'Atomkvíz: csak az első jó válaszért jár atom!',inventory:'Reaktor',recipe:'Recept',craft:'⚗ Szintézis (C)',drop:'◉ Töltet (Space)',purge:'Ürítés',shield:'Védelem',life:'Élet',charges:'Töltetek',ready:'Kész',missing:'Hiányzó atom',bad:'Hibás válasz: az atom eltűnt!',good:'Helyes válasz: atom megszerezve!',level:'Pálya',goal:'Cél: semlegesítsd az anomáliákat, majd érd el a kijáratot.',complete:'Pálya kész! A kijáratot elérted.',over:'A robot megsérült. Indítsd újra a pályát!',all:'Mind a hat pálya teljesítve!',nocharge:'Nincs elkészített töltet.',nocraft:'Hiányzó atomok a recepthez.',noslot:'Nincs hely új töltetnek.',charge:'Időzített töltet elhelyezve. Menekülj fedezékbe!',full:'A reaktor megtelt (12 atom). Üríts egy atomot!',generator:'A központi iongenerátor új atomot bocsátott ki.',misfire:'Rossz ellenszer: az anomália ellenállt.',activator:'Játékaktivátor felvéve.',range:'Nyomásfokozó',flask:'Többkamrás lombik',catalyst:'Katalizátor',help:'Pajzs',atom:'Atom',score:'Kvíz',levelinfo:'Az ellenfelet csak a megfelelő töltet semlegesíti. A robbanás téged is eltalálhat.',science:'A reakciósugarak és atomgyűjtés stilizált játékmechanikák, nem valódi kémiai eljárások.',answer:'Válasz',again:'Újrakezdés',reagent:'Ellenszer'},
de:{name:'Reaktionslabyrinth',subtitle:'Sechs taktische Chemie-Level · Atome über Quiz sammeln',start:'Neues Spiel',restart:'Level neu starten',next:'Nächstes Level',instructions:'Pfeile / WASD: laufen · C: Synthese · Leertaste / E: Ladung · 1–6: Rezept · P: Atom entsorgen',quiz:'Atom-Quiz: nur der erste richtige Versuch zählt!',inventory:'Reaktor',recipe:'Rezept',craft:'⚗ Synthese (C)',drop:'◉ Ladung (Leertaste)',purge:'Entsorgen',shield:'Schutz',life:'Leben',charges:'Ladungen',ready:'Fertig',missing:'Fehlende Atome',bad:'Falsche Antwort: Atom verschwunden!',good:'Richtig: Atom aufgenommen!',level:'Level',goal:'Neutralisiere die Anomalien und erreiche den Ausgang.',complete:'Level geschafft!',over:'Roboter beschädigt. Starte das Level neu!',all:'Alle sechs Level geschafft!',nocharge:'Keine fertige Ladung.',nocraft:'Atome fehlen für dieses Rezept.',noslot:'Kein Platz für weitere Ladungen.',charge:'Ladung platziert. Geh in Deckung!',full:'Reaktor voll (12 Atome)!',generator:'Ionengenerator produziert neue Atome.',misfire:'Falsche Ladung: Anomalie widersteht.',activator:'Fiktiven Spielaktivator gesammelt.',range:'Druckverstärker',flask:'Mehrkammerkolben',catalyst:'Katalysator',help:'Schutz',atom:'Atom',score:'Quiz',levelinfo:'Nur die passende Ladung besiegt diesen Gegner. Die Explosion kann dich treffen.',science:'Strahlen und Atomsammeln sind fiktive Spielmechaniken, keine echten chemischen Verfahren.',answer:'Antwort',again:'Neustart',reagent:'Gegenmittel'},
en:{name:'Reaction Maze',subtitle:'Six tactical chemistry stages · quiz-based atom pickup',start:'New game',restart:'Restart stage',next:'Next stage',instructions:'Arrows / WASD: move · C: synthesize · Space / E: place charge · 1–6: recipe · P: purge atom',quiz:'Atom quiz: only the first correct answer earns the atom!',inventory:'Reactor',recipe:'Recipe',craft:'⚗ Synthesize (C)',drop:'◉ Place charge (Space)',purge:'Purge',shield:'Shield',life:'Health',charges:'Charges',ready:'Ready',missing:'Missing atoms',bad:'Wrong answer: atom disappeared!',good:'Correct: atom collected!',level:'Stage',goal:'Neutralize the anomalies, then reach the exit.',complete:'Stage cleared!',over:'Robot damaged. Restart this stage!',all:'All six stages complete!',nocharge:'No prepared charge.',nocraft:'Not enough atoms for this recipe.',noslot:'No room for another charge.',charge:'Charge placed. Take cover!',full:'Reactor full (12 atoms). Purge an atom!',generator:'Ion generator released new atoms.',misfire:'Wrong countermeasure: enemy resisted.',activator:'Fictional game activator collected.',range:'Pressure booster',flask:'Multi-flask',catalyst:'Catalyst',help:'Shield',atom:'Atom',score:'Quiz',levelinfo:'Only the matching recipe defeats each anomaly. Your own blast can hit you.',science:'Beams and atom pickups are stylized gameplay, not real chemical procedures.',answer:'Answer',again:'Restart',reagent:'Countermeasure'}
};
const t=k=>T[lang()][k]||T.hu[k]||k;
const modeColor={fire:'#ff8b49',spark:'#f5e269',acid:'#b2ff81',alkaline:'#9bc7ff',rust:'#c99a82',heavy:'#c9adf5'};
const atomColor={H:'#e8f9ff',O:'#f68c83',C:'#93b6cc',Na:'#f4bf92',Cl:'#a9ed93',Al:'#b5bcce',K:'#bfa2f4',S:'#f4e17e',Ca:'#e5b8f8',Fe:'#b89e86'};
let state=G.createLevel(),selected=G.RECIPES[0].id,held={},moving=0,moveAcc=0,last=0,quizShown=null,notification='',notificationTime=0,roundFinished=false;
const $make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
const say=(msg)=>{notification=msg;notificationTime=5;};
function reset(stage=state.stage,keepUpgrades=false){state=G.createLevel(stage,keepUpgrades?{...state.upgrades,shield:state.player.shield}:null);selected=G.RECIPES[stage].id;roundFinished=false;quizShown=null;const quiz=$('mazeQuiz');quiz.hidden=true;quiz.replaceChildren();say(G.STAGES[stage].description[li()]);sync();render();}
const choose=(id)=>{selected=id;sync();};
function currentRecipe(){return G.RECIPES.find(r=>r.id===selected);}
function parts(r){return Object.entries(r.atoms).map(([k,n])=>n+'×'+k).join(' + ')+(r.needsActivator?' + ★':'');}
function remaining(){return state.enemies.filter(e=>e.alive).length;}
function sync(){
 const stage=G.STAGES[state.stage],r=currentRecipe();
 $('mazeTitle').textContent=t('name');$('mazeSubtitle').textContent=t('subtitle');$('mazeInstructions').textContent=t('instructions');$('mazeStart').textContent=t('restart');$('mazeCraft').textContent=t('craft');$('mazePlace').textContent=t('drop');$('mazePurge').textContent=t('purge');
 $('mazeHUD').textContent=t('level')+' '+(state.stage+1)+'/6 · '+stage.name[li()]+' · '+t('life')+' '+state.player.hp+'/3 · '+t('shield')+' '+state.player.shield+' · '+t('score')+' '+state.stats.correct+'/'+state.stats.attempts+' · '+t('charges')+' '+state.bombs.length+'/'+(1+state.upgrades.flask);
 const inv=Object.entries(state.inv).filter(([,n])=>n>0).map(([k,n])=>k+':'+n).join('  ·  ')||'—';
 $('mazeInventory').textContent=t('inventory')+' ('+G.countInv(state.inv)+'/'+G.MAX_INV+'): '+inv;
 $('mazeHint').textContent=t('goal')+' '+stage.description[li()]+'  '+t('reagent')+': '+G.RECIPES[state.stage].symbol+' ('+parts(G.RECIPES[state.stage])+') · '+remaining()+' '+(lang()==='hu'?'anomália':lang()==='de'?'Anomalien':'anomalies');
 $('mazeInfo').textContent=r.symbol+' = '+parts(r)+' · '+(state.ammo[r.id]||0)+' '+t('ready')+' · '+r.explain[li()];
 const select=$('mazeRecipe');select.replaceChildren();for(let i=0;i<=state.stage;i++){const rec=G.RECIPES[i],o=$make('option','',rec.symbol+' · '+rec.name[li()]);o.value=rec.id;select.append(o);}select.value=selected;
 const purge=$('mazePurgeAtom');purge.replaceChildren();for(const [sym,n] of Object.entries(state.inv))if(n>0&&sym!=='ACT'){const o=$make('option','',sym+' ×'+n);o.value=sym;purge.append(o);}
 $('mazePurge').disabled=!purge.children.length;
 $('mazePlace').disabled=!(state.ammo[selected]>0)||state.pending||state.failed||state.completed;
 $('mazeNext').hidden=!state.completed;$('mazeNext').textContent=state.stage===5?t('all'):t('next');
 $('mazeNotice').textContent=notification||t('levelinfo');
 $('mazeNote').textContent=t('science');
}
function quiz(){
 const pending=state.pending,host=$('mazeQuiz');if(!pending){host.hidden=true;quizShown=null;return;}if(quizShown===pending)return;quizShown=pending;host.hidden=false;host.replaceChildren();
 const question=$make('h3','',t('quiz'));host.append(question,$make('p','',pending.question[li()]));
 const grid=$make('div','maze-answers');host.append(grid);
 // Chemistry vocabulary shown in the language the player selected.
 const translated={
 C:{hu:['Kalcium','Szén','Réz','Klór'],de:['Calcium','Kohlenstoff','Kupfer','Chlor'],en:['Calcium','Carbon','Copper','Chlorine']},
 Cl:{hu:['Nemesgáz','Halogén','Alkálifém','Alkáliföldfém'],de:['Edelgas','Halogen','Alkalimetall','Erdalkalimetall'],en:['Noble gas','Halogen','Alkali metal','Alkaline earth metal']},
 S:{hu:['Szilícium','Kén','Nátrium','Szelén'],de:['Silicium','Schwefel','Natrium','Selen'],en:['Silicon','Sulfur','Sodium','Selenium']}
 };
 let options=pending.question[3];const qidx=G.QUIZZES[pending.sym]?.indexOf(pending.question)||0;
 if(translated[pending.sym]&&((pending.sym==='C'&&qidx===0)||(pending.sym==='Cl'&&qidx===1)||(pending.sym==='S'&&qidx===0)))options=translated[pending.sym][lang()];
 options.forEach((item,i)=>{const b=$make('button','',item);b.type='button';b.onclick=()=>{const result=G.answer(state,i);host.hidden=true;quizShown=null;say(result.ok?t('good'):t('bad'));sync();render();};grid.append(b);});
}
function doMove(dx,dy){if(!G.move(state,dx,dy))return;quiz();if(G.finish(state)){say(state.stage===5?t('all'):t('complete'));roundFinished=true;}sync();render();}
function synth(){const result=G.craft(state,selected);say(result==='ok'?t('ready')+' '+currentRecipe().symbol:result==='activator'?t('activator')+' ★':t('nocraft'));sync();}
function charge(){const result=G.place(state,selected);say(result==='ok'?t('charge'):result==='limit'?t('noslot'):t('nocharge'));sync();}
function purge(){const sym=$('mazePurgeAtom').value;if(sym&&G.purge(state,sym)){say(t('purge')+': '+sym);sync();}}
function next(){if(state.completed&&state.stage<5)reset(state.stage+1,true);else if(state.completed)reset(0);else reset(state.stage);}
function draw(){
 if(!$('mazeSection')||$('mazeSection').classList.contains('hidden'))return;
 const W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a1724';ctx.fillRect(0,0,W,H);
 const cell=(x,y,color)=>{ctx.fillStyle=color;ctx.fillRect(x*TILE+1,y*TILE+1,TILE-2,TILE-2);};
 for(let y=0;y<ROW;y++)for(let x=0;x<COL;x++){const type=state.grid[y][x],ox=x*TILE,oy=y*TILE;
 if(type==='#'){ctx.fillStyle='#344b66';ctx.fillRect(ox,oy,TILE,TILE);ctx.fillStyle='#4d6c88';ctx.fillRect(ox+3,oy+3,TILE-6,5);ctx.fillStyle='#21364c';ctx.fillRect(ox+3,oy+TILE-7,TILE-6,5);}
 else if(type==='%'){cell(x,y,'#705f87');ctx.strokeStyle='#ded0f6';ctx.beginPath();ctx.moveTo(ox+8,oy+5);ctx.lineTo(ox+16,oy+18);ctx.lineTo(ox+10,oy+29);ctx.moveTo(ox+16,oy+18);ctx.lineTo(ox+28,oy+14);ctx.stroke();}
 else{cell(x,y,(x+y)%2?'#142737':'#112331');}}
 const text=(s,x,y,size=17,color='#fff')=>{ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold '+size+'px system-ui';ctx.fillText(s,(x+.5)*TILE,(y+.5)*TILE);};
 cell(state.gen.x,state.gen.y,'#234b60');text('◎',state.gen.x,state.gen.y,27,'#80e9fb');
 cell(state.exit.x,state.exit.y,remaining()===0?'#205f45':'#4c4858');text('⇥',state.exit.x,state.exit.y,28,remaining()===0?'#a3ffbe':'#9b92a2');
 if(state.activator)text('★',state.activator.x,state.activator.y,25,'#ffce64');
 for(const a of state.atoms){ctx.beginPath();ctx.arc((a.x+.5)*TILE,(a.y+.5)*TILE,13,0,Math.PI*2);ctx.fillStyle='#283b50';ctx.fill();ctx.strokeStyle=atomColor[a.sym]||'#fff';ctx.lineWidth=2;ctx.stroke();text(a.sym,a.x,a.y,14,atomColor[a.sym]||'#fff');}
 for(const b of state.bonuses)text({range:'↗',flask:'▣',catalyst:'✦',shield:'⬡'}[b.type],b.x,b.y,24,'#8bf7db');
 for(const h of state.hazards){ctx.globalAlpha=Math.min(.75,.25+h.ttl/5);cell(h.x,h.y,{flame:'#ff7436',acid:'#75de5e',alkaline:'#7baafa'}[h.type]||'#f6b881');ctx.globalAlpha=1;}
 for(const b of state.bombs){ctx.beginPath();ctx.arc((b.x+.5)*TILE,(b.y+.5)*TILE,11+2*Math.sin(performance.now()/120),0,Math.PI*2);ctx.fillStyle='#ffc45c';ctx.fill();text('●',b.x,b.y,14,'#4d2c15');}
 for(const w of state.waves){ctx.globalAlpha=Math.max(.18,Math.min(.8,w.ttl));for(const c of w.cells)cell(c.x,c.y,w.combo?'#fff1ac':{H2O:'#5bbcf5',CO2:'#d0f5f8',NaOH:'#c0f18a',HCl:'#ed89b9',AL:'#ff9a4d',K2S:'#ba9de6'}[w.recipe]||'#ffd18d');ctx.globalAlpha=1;}
 for(const e of state.enemies){if(!e.alive)continue;const centerX=(e.x+.5)*TILE,centerY=(e.y+.5)*TILE;ctx.fillStyle=modeColor[e.type];ctx.beginPath();ctx.arc(centerX,centerY,13,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#162130';ctx.lineWidth=2;ctx.stroke();text({fire:'♨',spark:'ϟ',acid:'≈',alkaline:'◇',rust:'▣',heavy:'◈'}[e.type],e.x,e.y,20,'#11202a');}
 const {x,y}=state.player;ctx.fillStyle='#a7e7ff';ctx.fillRect(x*TILE+6,y*TILE+4,TILE-12,TILE-8);ctx.fillStyle='#123047';ctx.fillRect(x*TILE+9,y*TILE+12,TILE-18,7);ctx.fillStyle='#86e5ee';ctx.fillRect(x*TILE+11,y*TILE+14,5,4);ctx.fillRect(x*TILE+20,y*TILE+14,5,4);
 if(state.completed||state.failed){ctx.fillStyle='#061322bb';ctx.fillRect(0,0,W,H);ctx.fillStyle='#d9f4fa';ctx.textAlign='center';ctx.font='bold 28px system-ui';ctx.fillText(state.completed?(state.stage===5?t('all'):t('complete')):t('over'),W/2,H/2);}
}
const handleKey=(code)=>{if(['ArrowUp','KeyW'].includes(code))return doMove(0,-1);if(['ArrowDown','KeyS'].includes(code))return doMove(0,1);if(['ArrowLeft','KeyA'].includes(code))return doMove(-1,0);if(['ArrowRight','KeyD'].includes(code))return doMove(1,0);if(code==='KeyC')return synth();if(['Space','KeyE'].includes(code))return charge();if(code==='KeyP')return purge();if(/^Digit[1-6]$/.test(code)){const r=G.RECIPES[Number(code.slice(-1))-1];if(r&&G.RECIPES.indexOf(r)<=state.stage)choose(r.id);}};
document.addEventListener('keydown',e=>{if($('mazeSection').classList.contains('hidden')||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 if(state.pending){if(/^Digit[1-4]$/.test(e.code)){e.preventDefault();$('mazeQuiz').querySelectorAll('.maze-answers button')[Number(e.code.slice(-1))-1]?.click();}return;}
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();handleKey(e.code);});
const controls={'mazeUp':[0,-1],'mazeDown':[0,1],'mazeLeft':[-1,0],'mazeRight':[1,0]};for(const [id,[dx,dy]] of Object.entries(controls)){const b=$(id);if(!b)continue;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);held[id]=[dx,dy];doMove(dx,dy);});for(const end of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(end,()=>{delete held[id];});}
$('mazeStart').onclick=()=>reset(state.stage);$('mazeCraft').onclick=synth;$('mazePlace').onclick=charge;$('mazePurge').onclick=purge;$('mazeNext').onclick=next;$('mazeRecipe').onchange=e=>choose(e.target.value);
let swipe=null;cv.addEventListener('pointerdown',e=>{swipe={x:e.clientX,y:e.clientY};});cv.addEventListener('pointerup',e=>{if(!swipe)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe=null;if(Math.max(Math.abs(dx),Math.abs(dy))<15)return;Math.abs(dx)>Math.abs(dy)?doMove(Math.sign(dx),0):doMove(0,Math.sign(dy));});
function frame(now){let dt=Math.min(.08,(now-last)/1000||.016);last=now;requestAnimationFrame(frame);if($('mazeSection').classList.contains('hidden')||document.hidden)return;
 if(!state.pending&&!state.completed&&!state.failed){moveAcc+=dt;const heldDir=Object.values(held)[0];if(heldDir&&moveAcc>Math.max(.09,.17-state.upgrades.catalyst*.025)){moveAcc=0;doMove(...heldDir);}G.tick(state,dt);if(G.finish(state)){say(t('complete'));roundFinished=true;}}
 const events=state.events.splice(0);for(const event of events){if(event.type==='generated')say(t('generator')+' '+event.sym);else if(event.type==='full')say(t('full'));else if(event.type==='empowered'||event.type==='split')say(t('misfire'));else if(event.type==='failed')say(t('over'));else if(event.type==='defeated')say(t('reagent')+' ✓');else if(event.type==='upgrade')say(t(event.kind==='shield'?'help':event.kind));else if(event.type==='activator')say(t('activator'));}
 notificationTime=Math.max(0,notificationTime-dt);if(!notificationTime)notification='';sync();draw();quiz();
}
for(const k of ['hu','de','en'])$(k)?.addEventListener('click',()=>queueMicrotask(()=>{sync();if(state.pending){quizShown=null;quiz();}}));
window.ReactionMazeGame={reset,choose,getState:()=>state,move:doMove,craft:synth,place:charge,advance:next};
reset(0);requestAnimationFrame(frame);
})();