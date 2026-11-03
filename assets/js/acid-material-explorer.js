/* Chemistry Lab — qualitative acid/material reactivity explorer; Apache-2.0.
   Curated educational cases, NOT a physical rate or lab safety simulator. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.AcidMaterialReactivity=api;})(typeof window!=='undefined'?window:null,function(){
'use strict';
const cases=[
 {acid:'HCl',material:'Au',level:'none',eq:null,gas:null,
  title:['Miért marad meg az arany?','Warum bleibt Gold erhalten?','Why does gold remain?'],
  note:['A nem oxidáló sósav önmagában normál körülmények között nem oldja az aranyat. Az arany feloldása speciális oxidáló és komplexképző kémiai környezetet igényelhet; ilyen rendszerek veszélyes gázokat fejleszthetnek.','Nichtoxidierende Salzsäure allein löst Gold gewöhnlich nicht. Besondere oxidierende und komplexbildende Systeme können Gold lösen, sind aber gefährlich.','Non-oxidizing hydrochloric acid alone does not normally dissolve gold. Special oxidizing and complexing environments can dissolve it but may generate dangerous gases.']},
 {acid:'HNO3',material:'Au',level:'none',eq:null,gas:null,title:['Még az oxidáló sav sem mindig elég','Auch oxidierende Säure reicht nicht immer','Even an oxidizing acid may not suffice'],note:['A salétromsav önmagában általában nem oldja az aranyat. Az oxidációs és komplexképzési feltételek együtt számítanak.','Salpetersäure allein löst Gold gewöhnlich nicht. Oxidation und Komplexbildung wirken zusammen.','Nitric acid alone generally does not dissolve gold; oxidation and complex formation both matter.']},
 {acid:'CH3COOH',material:'Au',level:'none',eq:null,gas:null,title:['Az ecet nem aranyoldószer','Essig löst Gold nicht','Vinegar is not a gold solvent'],note:['Az ecetsav vizes oldata nem oldja érdemben a tiszta aranyat szokásos körülmények között.','Wässrige Essigsäure löst reines Gold unter üblichen Bedingungen nicht nennenswert.','Dilute aqueous acetic acid does not appreciably dissolve pure gold under ordinary conditions.']},
 {acid:'HCl',material:'Zn',level:'gas',eq:'Zn + 2 HCl → ZnCl₂ + H₂ ↑',gas:'H₂',title:['Hidrogénbuborékok képződhetnek','Wasserstoffblasen können entstehen','Hydrogen bubbles may form'],note:['A cink reakcióba léphet a savval: cinkionok és gyúlékony hidrogéngáz keletkeznek. A buborék nem forrás.','Zink kann mit der Säure reagieren; Zinkionen und entzündlicher Wasserstoff entstehen. Blasen bedeuten nicht Sieden.','Zinc can react with acid, producing zinc ions and flammable hydrogen gas. Bubbling is not boiling.']},
 {acid:'HCl',material:'Mg',level:'gas',eq:'Mg + 2 HCl → MgCl₂ + H₂ ↑',gas:'H₂',title:['A magnézium reakcióképes fém','Magnesium ist reaktiv','Magnesium is reactive'],note:['A magnézium savval hidrogént fejleszthet. A tényleges sebesség függ a felülettől és a körülményektől.','Magnesium kann mit Säure Wasserstoff bilden. Die Reaktionsgeschwindigkeit hängt von der Oberfläche und den Bedingungen ab.','Magnesium may release hydrogen in acid; observed rate depends on surface and conditions.']},
 {acid:'HCl',material:'Fe',level:'gas',eq:'Fe + 2 HCl → FeCl₂ + H₂ ↑',gas:'H₂',title:['A vas is reagálhat','Auch Eisen reagiert','Iron can react too'],note:['Az egyszerűsített egyenlet vas(II)-klorid és hidrogén képződését mutatja, de az oxidáció, a bevonat és a körülmények befolyásolják a folyamatot.','Vereinfacht entstehen Eisen(II)-chlorid und Wasserstoff; Oberflächenzustand und Bedingungen sind wichtig.','The simplified reaction forms iron(II) chloride and hydrogen; surface coatings and conditions affect it.']},
 {acid:'HCl',material:'Cu',level:'none',eq:null,gas:null,title:['Miért nem pezseg úgy a réz?','Warum blubbert Kupfer nicht genauso?','Why does copper not bubble the same way?'],note:['Tiszta réz és levegőtől elzárt, nem oxidáló híg sósav között rendszerint nincs jelentős hidrogénfejlődés. Oxigén vagy oxidáló közeg módosíthatja a képet.','Reines Kupfer gibt mit nichtoxidierender verdünnter Salzsäure normalerweise kaum Wasserstoff ab; Sauerstoff oder Oxidationsmittel ändern die Bedingungen.','Pure copper does not normally release much hydrogen in non-oxidizing dilute hydrochloric acid; oxygen or oxidants can change the situation.']},
 {acid:'HNO3',material:'Cu',level:'conditional',eq:null,gas:null,title:['Oxidáció – nem egyszerű hidrogénfejlődés','Oxidation statt einfacher Wasserstoffbildung','Oxidation, not simple hydrogen evolution'],note:['A salétromsav oxidáló sav: rézzel reakcióba léphet, és a körülményektől függően mérgező nitrogén-oxidok képződhetnek. Ez nem otthoni kísérlet.','Salpetersäure ist oxidierend und kann Kupfer unter Bildung giftiger Stickoxide angreifen; kein Heimexperiment.','Nitric acid can oxidize copper and may generate toxic nitrogen oxides depending on conditions. Not a home experiment.']},
 {acid:'HCl',material:'CaCO3',level:'gas',eq:'CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂ ↑',gas:'CO₂',title:['A mészkő pezseghet','Kalkstein kann schäumen','Limestone may fizz'],note:['A karbonát savval CO₂-t fejleszt; ez eltér a sav és az aktív fém által fejlesztett hidrogéntől.','Carbonat gibt CO₂ ab; das ist nicht derselbe Gasbildungstyp wie Wasserstoff an reaktiven Metallen.','Carbonate releases carbon dioxide, unlike hydrogen generated when acid reacts with some reactive metals.']},
 {acid:'CH3COOH',material:'NaHCO3',level:'gas',eq:'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂ ↑',gas:'CO₂',title:['Ecet és hidrogén-karbonát','Essigsäure und Hydrogencarbonat','Vinegar and bicarbonate'],note:['A jól ismert pezsgés oka a CO₂ gáz felszabadulása; a reakció nem bizonyítja az oldat végső pH-ját önmagában.','Das Sprudeln kommt von CO₂; daraus allein folgt nicht der endgültige pH-Wert.','Fizzing comes from CO₂; it does not by itself determine the final pH.']},
 {acid:'HCOOH',material:'CaCO3',level:'gas',eq:'CaCO₃ + 2 HCOOH → Ca(HCOO)₂ + H₂O + CO₂ ↑',gas:'CO₂',title:['Gyenge sav is reagálhat karbonáttal','Auch schwache Säuren reagieren mit Carbonaten','Weak acids can react with carbonates'],note:['A gyenge sav nem azt jelenti, hogy semmivel sem reagál; a karbonát sav hatására szén-dioxidot fejleszthet.','Schwach heißt nicht reaktionslos: Carbonate können CO₂ freisetzen.','Weak does not mean unreactive: carbonates can release CO₂ in acid.']},
 {acid:'CH3COOH',material:'Cu',level:'conditional',eq:null,gas:null,title:['A felület és az oxigén is számít','Oberfläche und Sauerstoff zählen','Surface and oxygen matter'],note:['Az ecetsav önmagában nem okoz általában gyors hidrogénfejlődést a rézen. Levegő jelenlétében hosszabb idő alatt rézvegyületek kialakulhatnak.','Essigsäure allein führt meist nicht zu schneller Wasserstoffbildung an Kupfer; in Luft können längerfristig Kupferverbindungen entstehen.','Acetic acid alone does not normally cause rapid hydrogen release from copper; in air, copper compounds may form over time.']}
];
const acids=[['HCl','Sósav','Salzsäure','Hydrochloric acid'],['HNO3','Salétromsav','Salpetersäure','Nitric acid'],['CH3COOH','Ecetsav','Essigsäure','Acetic acid'],['HCOOH','Hangyasav','Ameisensäure','Formic acid']];
const materials=[['Au','Arany','Gold','Gold'],['Zn','Cink','Zink','Zinc'],['Mg','Magnézium','Magnesium','Magnesium'],['Fe','Vas','Eisen','Iron'],['Cu','Réz','Kupfer','Copper'],['CaCO3','Mészkő / kalcium-karbonát','Kalkstein / Calciumcarbonat','Limestone / calcium carbonate'],['NaHCO3','Szódabikarbóna','Natron','Baking soda']];
function lookup(acid,material){return cases.find(x=>x.acid===acid&&x.material===material)||null}
return Object.freeze({lookup,cases,acids,materials});
});
(function(){
'use strict';if(typeof document==='undefined')return;
const box=document.getElementById('abReactionExplorer'),api=window.AcidMaterialReactivity;if(!box||!api)return;
const labels={hu:{title:'Mi történik, ha a sav anyaghoz ér?',intro:'Válassz savat és anyagot. Figyeld meg a várható folyamatot – szemléltető, nem valódi reakciósebesség-szimuláció.',acid:'Sav',material:'Anyag',explore:'Felfedezés',none:'Nincs jelentős reakció a megadott egyszerű körülmények között.',gas:'Gáz képződhet',conditional:'A körülményektől függő reakció',missing:'Ehhez a párhoz még nincs megbízhatóan modellezett eset – ez nem jelenti azt, hogy nem reagálnak!',explain:'Miért történik ez?',warning:'Elméleti szemléltetés. Ne keverj vegyszereket a program alapján; egyes reakciók veszélyesek.'},
de:{title:'Was geschieht, wenn Säure auf Stoff trifft?',intro:'Säure und Material auswählen. Qualitative Darstellung, keine echte Reaktionskinetik.',acid:'Säure',material:'Material',explore:'Entdecken',none:'Unter den vereinfachten Bedingungen keine wesentliche Reaktion.',gas:'Gasbildung möglich',conditional:'Bedingungsabhängige Reaktion',missing:'Diese Kombination ist nicht modelliert – das bedeutet nicht, dass sie nicht reagieren kann.',explain:'Warum geschieht das?',warning:'Nur theoretische Darstellung. Chemikalien nicht anhand der Simulation mischen; manche Reaktionen sind gefährlich.'},
en:{title:'What happens when acid meets a material?',intro:'Choose an acid and a material. Qualitative demonstration, not a real reaction-rate simulation.',acid:'Acid',material:'Material',explore:'Explore',none:'No substantial reaction in the stated simplified conditions.',gas:'Gas may form',conditional:'Condition-dependent reaction',missing:'This pair is not modeled; that does not mean it cannot react.',explain:'Why does this happen?',warning:'Conceptual illustration only. Never mix chemicals based on this simulator; some reactions are hazardous.'}};
const lang=()=>['hu','de','en'].find(x=>document.getElementById(x)?.classList.contains('active'))||'hu';
const h=(tag,content)=>{const e=document.createElement(tag);if(content!==undefined)e.textContent=content;return e};
const acid=h('select'),material=h('select'),result=h('div');acid.id='abReactionAcid';material.id='abReactionMaterial';result.id='abReactionResult';
const heading=h('h3'),intro=h('p'),grid=h('div'),acidLabel=h('label'),materialLabel=h('label'),button=h('button'),safe=h('small');
grid.className='ab-reaction-controls';result.className='ab-reaction-result';
acidLabel.append(acid);materialLabel.append(material);grid.append(acidLabel,materialLabel);button.type='button';
box.append(heading,intro,grid,button,result,safe);
function options(el,source,l){const prev=el.value;el.replaceChildren();for(const a of source){const o=h('option',a[l==='hu'?1:l==='de'?2:3]);o.value=a[0];el.append(o)}if(source.some(x=>x[0]===prev))el.value=prev}
function update(){
 const l=lang(),t=labels[l],i=l==='hu'?0:l==='de'?1:2;
 heading.textContent=t.title;intro.textContent=t.intro;acidLabel.firstChild?.nodeType===3&&(acidLabel.firstChild.textContent=t.acid+' ');
 materialLabel.firstChild?.nodeType===3&&(materialLabel.firstChild.textContent=t.material+' ');
 options(acid,api.acids,l);options(material,api.materials,l);button.textContent=t.explore;safe.textContent=t.warning;
}
acidLabel.insertBefore(document.createTextNode(''),acid);materialLabel.insertBefore(document.createTextNode(''),material);
function simulate(){
 const l=lang(),i=l==='hu'?0:l==='de'?1:2,t=labels[l],r=api.lookup(acid.value,material.value);
 result.replaceChildren();
 if(!r){result.append(h('p',t.missing));result.dataset.reaction='missing';return}
 result.dataset.reaction=r.level;
 const title=h('strong',r.title[i]),status=h('p',t[r.level]||r.level),reactor=h('div');reactor.className='ab-reaction-visual';
 const label=h('span',r.gas?'↑ '+r.gas:r.level==='none'?'—':'?');label.className='ab-reaction-gas';reactor.append(label);
 result.append(title,status,reactor);
 if(r.eq)result.append(h('p',r.eq));
 const detail=h('details'),summary=h('summary',t.explain),explanation=h('p',r.note[i]);detail.append(summary,explanation);result.append(detail);
}
button.addEventListener('click',simulate);
for(const id of ['hu','de','en'])document.getElementById(id)?.addEventListener('click',()=>queueMicrotask(()=>{update();if(result.childNodes.length)simulate()}));
update();acid.value='HCl';material.value='Au';simulate();
})();
