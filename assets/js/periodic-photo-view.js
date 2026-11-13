/* Optional, isolated periodic photo view. No changes to the original element renderer. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const root=$('periodSection'), table=$('ptable'), detail=$('atomDetail');
if(!root||!table||!detail||!Array.isArray(window.elements)&&typeof elements==='undefined')return;
const photos=window.ChemistryElementPhotos||{};
const t={
 hu:{classic:'Klasszikus',photo:'Képes',note:'Valódi elemminták és jelölt illusztrációk. Képekhez internetkapcsolat szükséges. Vízszintesen görgethető.',missing:'Nincs hiteles kép',illustration:'Illusztráció',example:'Elemminta',source:'Kép forrása',offline:'A kép nem tölthető be',credit:'Fotó jóváírása'},
 de:{classic:'Klassisch',photo:'Mit Bildern',note:'Echte Elementproben und gekennzeichnete Illustrationen. Bilder benötigen Internet. Horizontal scrollen.',missing:'Kein belegtes Bild',illustration:'Illustration',example:'Elementprobe',source:'Bildquelle',offline:'Bild nicht verfügbar',credit:'Bildnachweis'},
 en:{classic:'Classic',photo:'Photos',note:'Real element samples and clearly marked illustrations. Photos require internet. Scroll horizontally.',missing:'No verified photo',illustration:'Illustration',example:'Element sample',source:'Image source',offline:'Image unavailable',credit:'Image attribution'}
};
const oldWrap=table.parentElement;
oldWrap.id='periodClassicWrap';
const switcher=document.createElement('div');switcher.className='period-view-switch';switcher.setAttribute('role','group');
const classic=document.createElement('button'),photo=document.createElement('button');
classic.type=photo.type='button';classic.id='periodClassicView';photo.id='periodPhotoView';
switcher.append(classic,photo);
const toolbar=root.querySelector('.toolbar');
toolbar.insertBefore(switcher,toolbar.querySelector('#search'));
const note=document.createElement('p');note.className='photo-overview-note';note.id='periodPhotoNote';
const photoWrap=document.createElement('div');photoWrap.id='photoWrap';photoWrap.className='photo-wrap';photoWrap.hidden=true;
const grid=document.createElement('div');grid.className='photo-grid';grid.id='photoGrid';photoWrap.append(grid);
oldWrap.after(note,photoWrap);
const info=document.createElement('div');info.id='periodPhotoDetail';info.hidden=true;
detail.querySelector('article.panel')?.insertBefore(info,$('basic'));
let view='classic';
try{view=sessionStorage.getItem('chemistry-period-view')==='photo'?'photo':'classic'}catch{}
function locale(){return ['hu','de','en'].includes(lang)?lang:'en'}
function word(k){return t[locale()][k]}
function matching(e){return !query||[e.z,e.s,e.hu,e.de,e.en||''].join(' ').toLocaleLowerCase().includes(query)}
function makeTile(e){
 const b=document.createElement('button');b.type='button';
 b.className='photo-tile'+(e.z===selected?' selected':'')+(matching(e)?'':' dim');
 b.style.cssText='--c:'+palette[e.cat]+';grid-column:'+e.g+';grid-row:'+e.r;
 b.setAttribute('aria-label',e.z+' '+e[locale()]+' ('+e.s+')');
 b.title=e.z+' · '+e[locale()];
 const head=document.createElement('div');head.className='photo-tile-head';
 const symbol=document.createElement('strong');symbol.textContent=e.s;
 const number=document.createElement('small');number.textContent=e.z;
 head.append(symbol,number);
 const name=document.createElement('span');name.className='photo-tile-name';name.textContent=e[locale()];
 b.append(head,name);
 const meta=photos[e.z]||{};
 if(meta.url){
  const im=document.createElement('img');im.className='photo-tile-image';im.alt='';
  im.loading='lazy';im.decoding='async';im.referrerPolicy='no-referrer';im.src=meta.url;
  const fail=()=>{im.hidden=true;const fall=document.createElement('div');fall.className='photo-tile-placeholder';fall.textContent=word('offline');b.append(fall)};
  im.addEventListener('error',fail,{once:true});b.append(im);
  if(meta.illustration){const badge=document.createElement('span');badge.className='photo-image-label';badge.textContent=word('illustration');b.append(badge)}
 }else{
  const missing=document.createElement('div');missing.className='photo-tile-placeholder';missing.textContent=word('missing');b.append(missing);
 }
 // Delegate to the unmodified table's selection handler and its detail popup.
 b.addEventListener('click',()=>{
  const original=Array.from(table.querySelectorAll('button.tile')).find(n=>Number(n.querySelector('.num')?.textContent)===e.z);
  if(original)original.click();
 });
 return b;
}
function renderPhoto(){
 if(view!=='photo')return;
 const frag=document.createDocumentFragment();
 for(const e of elements)frag.append(makeTile(e));
 grid.replaceChildren(frag);updateInfo();
}
function updateInfo(){
 info.replaceChildren();
 info.hidden=view!=='photo'||detail.classList.contains('hidden');
 if(view!=='photo')return;
 const e=elements[selected-1], meta=photos[e.z]||{};
 const container=document.createElement('div');container.className='photo-focus';
 if(meta.url){const im=document.createElement('img');im.alt=meta.title||e[locale()];im.loading='lazy';im.referrerPolicy='no-referrer';im.src=meta.url;container.append(im)}
 const text=document.createElement('div');
 const title=document.createElement('strong');title.textContent=meta.url?(meta.illustration?word('illustration'):word('example')):word('missing');text.append(title);
 const desc=document.createElement('p');desc.textContent=meta.url?(meta.title||e[locale()]):word('missing');text.append(desc);
 if(meta.url){
  const a=document.createElement('a');a.textContent=word('source');a.href=meta.url;a.target='_blank';a.rel='noopener noreferrer';text.append(a);
  const credit=document.createElement('p');credit.textContent=word('credit')+': '+(meta.attribution||'—');text.append(credit);
 }
 container.append(text);info.append(container);
}
function relabel(){
 classic.textContent=word('classic');photo.textContent=word('photo');
 classic.setAttribute('aria-pressed',String(view==='classic'));
 photo.setAttribute('aria-pressed',String(view==='photo'));
 note.textContent=word('note');
 note.hidden=view!=='photo';
 oldWrap.hidden=view!=='classic';photoWrap.hidden=view!=='photo';
 updateInfo();
}
function choose(next){
 view=next;try{sessionStorage.setItem('chemistry-period-view',view)}catch{}
 relabel();renderPhoto();
}
classic.addEventListener('click',()=>choose('classic'));
photo.addEventListener('click',()=>choose('photo'));
// The core language buttons re-render the periodic table, but this optional
// switcher is outside that renderer; refresh its labels on every language change.
for(const id of ['hu','de','en']){
 $(id)?.addEventListener('click',()=>queueMicrotask(relabel));
}
const previous=renderTable;
renderTable=function(){previous();if(view==='photo')renderPhoto()};
const observer=new MutationObserver(()=>{if(view==='photo')updateInfo()});
observer.observe(detail,{attributes:true,attributeFilter:['class'],subtree:false});
choose(view);
})();
