/* Single source of truth for navigation across legacy and modular tabs. */
(function(){
'use strict';
if(typeof document==='undefined')return;
const panels={homeTab:'homeSection',periodTab:'periodSection',moleculeTab:'moleculeSection',reactionTab:'reactionSection',huntTab:'huntSection',materialsTab:'materialsSection',densityTab:'densitySection',bunsenTab:'bunsenSection',stoichTab:'stoichSection',acidBaseTab:'acidBaseSection',physicsTab:'physicsSection',specTab:'specSection',curriculumTab:'curriculumSection',miniGamesTab:'miniGamesSection',gameTab:'gameSection',mazeTab:'mazeSection'};
const $=id=>document.getElementById(id),tabs=Object.keys(panels).filter(id=>$(id)&&$(id).getAttribute('style')!=='display:none!important');
let selected='homeTab';
let visibleGroup='explore';
const groupDefinitions=[
 {key:'explore',items:['periodTab','moleculeTab','materialsTab','densityTab','homeTab']},
 {key:'experiment',items:['bunsenTab','stoichTab','acidBaseTab','physicsTab']},
 {key:'learn',items:['curriculumTab','miniGamesTab','gameTab','mazeTab']},
 {key:'advanced',items:['specTab']}
];
const groupNames={
 hu:{explore:'Felfedezés',experiment:'Kísérletek',learn:'Tanulás és játék',advanced:'Haladó'},
 de:{explore:'Entdecken',experiment:'Experimente',learn:'Lernen & Spielen',advanced:'Erweitert'},
 en:{explore:'Explore',experiment:'Experiments',learn:'Learn & Play',advanced:'Advanced'}
};
const navLang=()=>['hu','de','en'].find(k=>$(k)?.classList.contains('active'))||'hu';
const quick=document.createElement('nav');quick.className='chem-quick-nav';quick.setAttribute('aria-label','Learning areas');
const quickButtons=new Map();
for(const group of groupDefinitions){
 const button=document.createElement('button');button.type='button';button.dataset.navgroup=group.key;
 button.addEventListener('click',()=>{
  const first=group.items.find(id=>tabs.includes(id));if(first)$(first).click();
 });
 quick.append(button);quickButtons.set(group.key,button);
}
const topTabs=document.querySelector('.tabs');topTabs?.parentElement?.insertBefore(quick,topTabs);

const footer=document.createElement('nav');footer.className='chem-bottom-tabs';footer.setAttribute('aria-label','Lab view switcher');const prev=document.createElement('button'),next=document.createElement('button'),name=document.createElement('span');
prev.type=next.type='button';prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label','Previous laboratory');next.setAttribute('aria-label','Next laboratory');footer.append(prev,name,next);document.body.append(footer);
function enforce(){
 for(const [id,section] of Object.entries(panels)){
  const panel=$(section);if(panel && !(id==='huntTab'&&panel.parentElement?.id==='curriculumSection'))panel.classList.toggle('hidden',id!==selected&&!(id==='reactionTab'&&selected==='moleculeTab'));
  $(id)?.classList.toggle('active',id===selected);
 }
 const activeGroup=groupDefinitions.find(g=>g.items.includes(selected))?.key;
 visibleGroup=activeGroup||visibleGroup;
 const shown=new Set(groupDefinitions.find(g=>g.key===visibleGroup)?.items||[]);
 for(const id of tabs)$(id).hidden=!shown.has(id);
 for(const group of groupDefinitions){const button=quickButtons.get(group.key);if(!button)continue;
  button.textContent=groupNames[navLang()][group.key];button.setAttribute('aria-current',String(group.key===activeGroup));
 }
 const activeTab=$(selected);
 if(activeTab&&topTabs&&topTabs.contains(activeTab)){
  // Keep the current lab in view without moving the whole page.
  const left=activeTab.offsetLeft, right=left+activeTab.offsetWidth;
  if(left<topTabs.scrollLeft)topTabs.scrollLeft=left-10;
  else if(right>topTabs.scrollLeft+topTabs.clientWidth)topTabs.scrollLeft=right-topTabs.clientWidth+10;
 }
 const detail=$('atomDetail');if(selected!=='periodTab')detail?.classList.add('hidden');
 const node=$(selected);name.textContent=node?.textContent.trim()||'';
 const idx=tabs.indexOf(selected);prev.disabled=idx<=0;next.disabled=idx<0||idx>=tabs.length-1;
}
function activate(id,scroll=true){if(!panels[id]||!$(panels[id]))return;selected=id;enforce();requestAnimationFrame(enforce);if(scroll){const section=$(panels[id]);section?.scrollIntoView({behavior:'auto',block:'start'})}}
for(const id of tabs){$(id).addEventListener('click',()=>{selected=id;queueMicrotask(()=>activate(id))})}
prev.addEventListener('click',()=>{let id=tabs[tabs.indexOf(selected)-1];if(id)$(id).click()});next.addEventListener('click',()=>{let id=tabs[tabs.indexOf(selected)+1];if(id)$(id).click()});
document.addEventListener('click',e=>{if(e.target.closest('.tabs > button'))return;const nav=e.target.closest('#curriculumOpen, #questNext');if(nav)requestAnimationFrame(enforce)});
for(const lang of ['hu','de','en'])$(lang)?.addEventListener('click',()=>{queueMicrotask(enforce);requestAnimationFrame(enforce)});
window.ChemistryNavigation={activate,refresh:enforce};
enforce();
})();
