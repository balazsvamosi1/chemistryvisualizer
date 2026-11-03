/* Single source of truth for navigation across legacy and modular tabs. */
(function(){
'use strict';
if(typeof document==='undefined')return;
const panels={periodTab:'periodSection',moleculeTab:'moleculeSection',reactionTab:'reactionSection',huntTab:'huntSection',materialsTab:'materialsSection',bunsenTab:'bunsenSection',stoichTab:'stoichSection',acidBaseTab:'acidBaseSection',physicsTab:'physicsSection',specTab:'specSection',curriculumTab:'curriculumSection',gameTab:'gameSection'};
const $=id=>document.getElementById(id),tabs=Object.keys(panels).filter(id=>$(id)&&$(id).getAttribute('style')!=='display:none!important');
let selected='periodTab';
const footer=document.createElement('nav');footer.className='chem-bottom-tabs';footer.setAttribute('aria-label','Lab view switcher');const prev=document.createElement('button'),next=document.createElement('button'),name=document.createElement('span');
prev.type=next.type='button';prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label','Previous laboratory');next.setAttribute('aria-label','Next laboratory');footer.append(prev,name,next);document.body.append(footer);
function enforce(){
 for(const [id,section] of Object.entries(panels)){
  const panel=$(section);if(panel)panel.classList.toggle('hidden',id!==selected);
  $(id)?.classList.toggle('active',id===selected);
 }
 const detail=$('atomDetail');if(selected!=='periodTab')detail?.classList.add('hidden');
 const node=$(selected);name.textContent=node?.textContent.trim()||'';
 const idx=tabs.indexOf(selected);prev.disabled=idx<=0;next.disabled=idx<0||idx>=tabs.length-1;
}
function activate(id,scroll=true){if(!panels[id]||!$(panels[id]))return;selected=id;enforce();requestAnimationFrame(enforce);if(scroll){const section=$(panels[id]);section?.scrollIntoView({behavior:'auto',block:'start'})}}
for(const id of tabs){$(id).addEventListener('click',()=>{selected=id;queueMicrotask(()=>activate(id))})}
prev.addEventListener('click',()=>{let id=tabs[tabs.indexOf(selected)-1];if(id)$(id).click()});next.addEventListener('click',()=>{let id=tabs[tabs.indexOf(selected)+1];if(id)$(id).click()});
document.addEventListener('click',e=>{if(e.target.closest('.tabs > button'))return;const nav=e.target.closest('#curriculumOpen, #questNext');if(nav)requestAnimationFrame(enforce)});
window.ChemistryNavigation={activate,refresh:enforce};
enforce();
})();
