/* Chemistry Lab 2.7.0 — original educational module, Apache-2.0.
   No third-party chemistry code or external service is loaded. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.ChemistryMoleculeLearning=api;})(typeof window!=='undefined'?window:null,function(){
'use strict';
const atomic={H:1,C:12.011,N:14.007,O:15.999,F:18.998,P:30.974,S:32.06,Cl:35.45,Br:79.904,I:126.904,Na:22.99,Mg:24.305,Fe:55.845,Cu:63.546};
const expected={H:1,C:4,N:3,O:2,F:1,Cl:1,Br:1,I:1};
function analyze(graph){
 const atoms=graph?.atoms||[],bonds=graph?.bonds||[],errors=[];
 if(!atoms.length)return{empty:true,errors:[],formula:'',mass:null,components:0,counts:{}};
 const byId=new Map(atoms.map(a=>[a.id,a]));const counts={};const degree=new Map(atoms.map(a=>[a.id,0]));const edges=new Map(atoms.map(a=>[a.id,[]]));
 for(const a of atoms)counts[a.s]=(counts[a.s]||0)+1;
 for(const b of bonds){if(!byId.has(b.a)||!byId.has(b.b)){errors.push('dangling');continue}
  if(b.kind&&b.kind!=='covalent'){errors.push('noncovalent');continue}
  if(!Number.isInteger(b.order)||b.order<1||b.order>3){errors.push('bondorder');continue}
  degree.set(b.a,degree.get(b.a)+b.order);degree.set(b.b,degree.get(b.b)+b.order);
  edges.get(b.a).push(b.b);edges.get(b.b).push(b.a);
 }
 let incomplete=0,exceeded=0;for(const a of atoms){const n=expected[a.s];if(n!==undefined){if(degree.get(a.id)>n)exceeded++;else if(degree.get(a.id)<n)incomplete++}}
 let components=0;const seen=new Set();for(const a of atoms){if(seen.has(a.id))continue;components++;const stack=[a.id];while(stack.length){const id=stack.pop();if(seen.has(id))continue;seen.add(id);stack.push(...edges.get(id).filter(x=>!seen.has(x)))}}
 const order=counts.C?['C','H']:['H'];const keys=[...new Set([...order,...Object.keys(counts).sort()])].filter(k=>counts[k]);
 const formula=keys.map(k=>k+(counts[k]===1?'':counts[k])).join('');
 const mass=Object.entries(counts).every(([k])=>atomic[k]!==undefined)?Object.entries(counts).reduce((s,[k,n])=>s+atomic[k]*n,0):null;
 return{formula,mass,counts,components,incomplete,exceeded,errors,atoms:atoms.length,bonds:bonds.length};
}
return{analyze};
});
(function(){
'use strict';if(typeof document==='undefined')return;
const host=document.getElementById('moleculeLearningPanel');if(!host)return;
const tr={
hu:{title:'Molekulák vizsgálata · tanulói műhely',intro:'Építs molekulát, majd vizsgáld meg a képletet, a moláris tömeget és a kötések telítettségét.',check:'Molekula elemzése',question:'Mennyi a felépített részecske moláris tömege (g/mol)?',verify:'Válasz ellenőrzése',empty:'Először építs molekulát a fenti szerkesztőben.',non:'Nem kovalens kapcsolatot is találtam; az eredmény csak összetételvizsgálat.',incomplete:'Lehetséges hiányzó kötések vagy implicit hidrogének. A telítettség nem bizonyítja a molekula stabilitását.',exceeded:'A megadott egyszerű vegyértékmodellben túl sok kötés szerepel.',components:'Különálló kapcsolt részek',correct:'Helyes.',wrong:'Nem egyezik. Ellenőrizd az atomtömegek összegét.',limit:'Oktatási ellenőrzés: nem kvantumkémiai vagy teljes szerkezetvalidáció.',unsupported:'Egyes atomtömegek hiányoznak a helyi táblából.'},
de:{title:'Molekülanalyse · Lernwerkstatt',intro:'Baue ein Molekül und untersuche Summenformel, molare Masse und Bindungen.',check:'Molekül analysieren',question:'Wie groß ist die molare Masse (g/mol)?',verify:'Antwort prüfen',empty:'Baue zuerst ein Molekül im Editor.',non:'Nichtkovalente Verbindung vorhanden; nur die Zusammensetzung wird ausgewertet.',incomplete:'Möglicherweise fehlende Bindungen oder implizite Wasserstoffatome. Das beweist keine Stabilität.',exceeded:'Zu viele Bindungen für das vereinfachte Valenzmodell.',components:'Getrennte Komponenten',correct:'Richtig.',wrong:'Nicht korrekt. Addiere die Atommassen erneut.',limit:'Didaktisches Modell, keine quantenchemische oder vollständige Strukturvalidierung.',unsupported:'Einige Atommassen fehlen in der lokalen Tabelle.'},
en:{title:'Molecule analysis · learning workshop',intro:'Build a molecule, then explore its formula, molar mass and bond counts.',check:'Analyze molecule',question:'What is the molar mass (g/mol)?',verify:'Check answer',empty:'Build a molecule in the editor above first.',non:'Non-covalent link found; only composition is evaluated.',incomplete:'Possible missing bonds or implicit hydrogens. This does not establish stability.',exceeded:'Too many bonds under the simplified valence model.',components:'Disconnected components',correct:'Correct.',wrong:'Not quite. Add up the atomic masses again.',limit:'Educational model, not quantum chemistry or complete structure validation.',unsupported:'Some atomic masses are missing from the local table.'}};
const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};let result=null;
function language(){return ['hu','de','en'].find(k=>document.getElementById(k)?.classList.contains('active'))||'hu'}
function render(){const t=tr[language()];host.replaceChildren();host.append(el('h3',t.title),el('p',t.intro));const b=el('button',t.check);b.type='button';host.append(b);const output=el('div');host.append(output);
b.addEventListener('click',()=>{result=window.ChemistryMoleculeLearning.analyze(window.ChemistryMoleculeSnapshot?.());output.replaceChildren();if(result.empty){output.append(el('p',t.empty));return}
output.append(el('p',result.formula+' · '+t.components+': '+result.components));if(result.mass!==null){output.append(el('p',result.mass.toFixed(2)+' g/mol'));const question=el('label',t.question+' '),answer=el('input');answer.type='number';answer.step='0.01';answer.setAttribute('aria-label',t.question);question.append(answer);output.append(question);const check=el('button',t.verify),feedback=el('p');output.append(check,feedback);check.addEventListener('click',()=>{const n=Number(answer.value);feedback.textContent=answer.value.trim()!==''&&Number.isFinite(n)&&Math.abs(n-result.mass)<=0.1?t.correct:t.wrong})}else output.append(el('p',t.unsupported));
if(result.errors.includes('noncovalent'))output.append(el('p',t.non));if(result.incomplete)output.append(el('p',t.incomplete+' ('+result.incomplete+')'));if(result.exceeded)output.append(el('p',t.exceeded+' ('+result.exceeded+')'));output.append(el('small',t.limit))});
}
render();for(const id of ['hu','de','en'])document.getElementById(id)?.addEventListener('click',()=>queueMicrotask(render));
})();
