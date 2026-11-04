/* Chemistry Lab 0.2104: local competency progress (Apache-2.0). */
(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.ChemistryLearningProgress=api;})(typeof window!=='undefined'?window:null,function(root){
'use strict';
const KEY='chemistryCompetenciesV1',IDS=['atoms','bonds','stoich','reactions','experiments','acids','materials'];
const LABELS={
 hu:{title:'Kompetencia szerinti fejlődés',intro:'Helyben tárolt gyakorlási adatok, nem iskolai jegyek. A feladatok még nem mérik minden témában a tartós tudást.',topics:['Elemfelismerés','Molekulák és kötések','Sztöchiometria','Reakcióismeret','Kísérletek értelmezése','Savak és bázisok','Anyagismeret'],attempt:'próbálkozás',empty:'Még nincs adat',review:'Ismétlendő:',clear:'Kompetenciaadatok törlése'},
 de:{title:'Kompetenzentwicklung',intro:'Lokal gespeicherte Übungsdaten, keine Schulnoten. Dauerhaftes Wissen wird noch nicht für alle Themen geprüft.',topics:['Elemente erkennen','Moleküle und Bindungen','Stöchiometrie','Reaktionen','Experimente verstehen','Säuren und Basen','Stoffkunde'],attempt:'Versuche',empty:'Noch keine Daten',review:'Wiederholen:',clear:'Kompetenzdaten löschen'},
 en:{title:'Competency progress',intro:'Locally stored practice results, not school grades. Long-term understanding is not yet measured in every topic.',topics:['Element recognition','Molecules and bonding','Stoichiometry','Reactions','Interpreting experiments','Acids and bases','Materials'],attempt:'attempts',empty:'No attempts yet',review:'Review:',clear:'Clear competency data'}
};
function fresh(){return{version:1,skills:Object.fromEntries(IDS.map(id=>[id,{correct:0,total:0}])),history:[]};}
function valid(data){return data?.version===1&&data.skills&&IDS.every(id=>Number.isSafeInteger(data.skills[id]?.correct)&&Number.isSafeInteger(data.skills[id]?.total)&&data.skills[id].correct>=0&&data.skills[id].correct<=data.skills[id].total)&&Array.isArray(data.history);}
let state=fresh();try{const v=root?.localStorage?.getItem(KEY);if(v){const s=JSON.parse(v);if(valid(s))state={...s,history:s.history.slice(-50)};}}catch{}
function normalize(id){if(IDS.includes(id))return id;if(id==='hunt')return 'atoms';if(id==='quest'||id==='maze')return 'reactions';if(id==='physics'||id==='speculative'||id==='bunsen'||String(id).startsWith('bunsen-'))return 'experiments';return null;}
function store(){try{root?.localStorage?.setItem(KEY,JSON.stringify(state));}catch{}}
function snapshot(){return JSON.parse(JSON.stringify(state));}
function stats(id){const k=normalize(id),s=state.skills[k];return s?{...s,accuracy:s.total?Math.round(100*s.correct/s.total):null}:null;}
function record(id,correct,source='academy'){
 const k=normalize(id);if(!k||typeof correct!=='boolean')return false;
 const s=state.skills[k];s.total++;if(correct)s.correct++;
 state.history.push({topic:k,correct,source:String(source).slice(0,32),time:Date.now()});state.history=state.history.slice(-50);
 store();render();return true;
}
function weak(){return IDS.filter(id=>{const s=state.skills[id];return s.total>=3&&s.correct/s.total<.75;}).sort((a,b)=>state.skills[a].correct/state.skills[a].total-state.skills[b].correct/state.skills[b].total);}
function clear(){state=fresh();store();render();}
function language(){if(typeof document==='undefined')return 'hu';return ['hu','de','en'].find(id=>document.getElementById(id)?.classList.contains('active'))||'hu';}
function render(){
 if(typeof document==='undefined')return;
 const host=document.getElementById('learningProgress');if(!host)return;
 const tr=LABELS[language()];host.replaceChildren();
 const heading=document.createElement('h3');heading.textContent=tr.title;host.append(heading);
 const intro=document.createElement('p');intro.textContent=tr.intro;host.append(intro);
 const list=document.createElement('div');list.className='competency-grid';host.append(list);
 IDS.forEach((id,i)=>{const s=stats(id),item=document.createElement('div');item.className='competency-item';
  const name=document.createElement('strong');name.textContent=tr.topics[i];item.append(name);
  const value=document.createElement('span');value.textContent=s.total?s.correct+'/'+s.total+' ('+s.accuracy+'%) · '+s.total+' '+tr.attempt:tr.empty;item.append(value);
  list.append(item);
 });
 const weakIds=weak();if(weakIds.length){const hint=document.createElement('p');hint.textContent=tr.review+' '+weakIds.map(id=>tr.topics[IDS.indexOf(id)]).join(', ');host.append(hint);}
 const button=document.createElement('button');button.type='button';button.textContent=tr.clear;button.addEventListener('click',()=>{if(typeof root?.confirm==='function'&&!root.confirm(tr.clear+'?'))return;clear();});host.append(button);
}
if(root?.addEventListener){
 root.addEventListener('chemistry:lab-result',event=>{const d=event.detail;if(d?.topic&&typeof d.correct==='boolean')record(d.topic,d.correct,'lab');});
 root.addEventListener('chemistry:game-assessment',event=>{const d=event.detail;if(!d)return;const isRight=/Correct$/.test(d.event),isWrong=/Wrong$/.test(d.event);if(!isRight&&!isWrong)return;
  const kind=d.event.startsWith('quiz')?'atoms':d.event.startsWith('reaction')?'reactions':'bonds';record(kind,isRight,d.id);
 });
}
if(typeof document!=='undefined'){const init=()=>{render();for(const id of ['hu','de','en'])document.getElementById(id)?.addEventListener('click',()=>queueMicrotask(render));};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();}
return Object.freeze({record,stats,snapshot,weak,clear,normalize});
});
