/* Chemistry Lab: quantitative chemistry for secondary education. Apache-2.0. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.StoichiometryEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const masses={H:1.008,He:4.0026,Li:6.94,Be:9.0122,B:10.81,C:12.011,N:14.007,O:15.999,F:18.998,Ne:20.180,Na:22.990,Mg:24.305,Al:26.982,Si:28.085,P:30.974,S:32.06,Cl:35.45,Ar:39.948,K:39.098,Ca:40.078,Cr:51.996,Mn:54.938,Fe:55.845,Co:58.933,Ni:58.693,Cu:63.546,Zn:65.38,Br:79.904,Ag:107.8682,I:126.904,Ba:137.327,Pb:207.2};
 const subs={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
 function parseFormula(input){
  const source=String(input||'').trim().replace(/[₀-₉]/g,c=>subs[c]);
  if(!source||source.length>100||/[^A-Za-z0-9()]/.test(source))throw Error('invalid-formula');
  let i=0;
  function number(){const start=i;while(/[0-9]/.test(source[i]||''))i++;const num=start===i?1:Number(source.slice(start,i));if(!Number.isSafeInteger(num)||num<1||num>10000)throw Error('invalid-count');return num}
  function group(depth){if(depth>10)throw Error('too-deep');const out={};let tokens=0;
   while(i<source.length&&source[i]!==')'){
    let counts;
    if(source[i]==='('){i++;counts=group(depth+1);if(source[i]!==')')throw Error('unclosed-group');i++;}
    else {const match=/^[A-Z][a-z]?/.exec(source.slice(i));if(!match||!(match[0] in masses))throw Error('unknown-element');i+=match[0].length;counts={[match[0]]:1}}
    const mult=number();for(const [atom,count] of Object.entries(counts)){out[atom]=(out[atom]||0)+count*mult;if(out[atom]>1e6)throw Error('too-many-atoms')}tokens++;
   }
   if(!tokens)throw Error('empty-group');return out;
  }
  const atoms=group(0);if(i!==source.length)throw Error('unmatched-parenthesis');return atoms;
 }
 function molarMass(formula){const atomCounts=parseFormula(formula);return Object.entries(atomCounts).reduce((sum,[k,n])=>sum+masses[k]*n,0)}
 function positive(v,name){const n=Number(v);if(!Number.isFinite(n)||n<=0)throw Error('invalid-'+name);return n}
 function molesFromMass(formula,grams){return positive(grams,'mass')/molarMass(formula)}
 function massFromMoles(formula,moles){return positive(moles,'moles')*molarMass(formula)}
 function molarity(moles,liters){return positive(moles,'moles')/positive(liters,'volume')}
 function requiredMass(formula,molPerL,liters){return positive(molPerL,'concentration')*positive(liters,'volume')*molarMass(formula)}
 function dilution(c1,v1,c2){return positive(c1,'concentration')*positive(v1,'volume')/positive(c2,'concentration')}
 function reactionYield(id,reagentIndex,grams,productIndex,reactionEngine){
  const model=reactionEngine?.model(id);if(!model)throw Error('unknown-reaction');
  const catalog=reactionEngine.catalog[id],nr=catalog.reactants.length,np=catalog.products.length;
  if(!Number.isInteger(reagentIndex)||reagentIndex<0||reagentIndex>=nr||!Number.isInteger(productIndex)||productIndex<0||productIndex>=np)throw Error('invalid-index');
  const reactant=catalog.reactants[reagentIndex],product=catalog.products[productIndex];
  const reactionMoles=positive(grams,'mass')/speciesMass(reactionEngine.species[reactant])/model.solution[reagentIndex];
  const outputMoles=reactionMoles*model.solution[nr+productIndex];
  return{moles:outputMoles,grams:outputMoles*speciesMass(reactionEngine.species[product]),formula:reactionEngine.species[product].formula};
 }
 function speciesMass(s){if(!s?.atoms)throw Error('unknown-species');return Object.entries(s.atoms).reduce((n,[k,c])=>{if(!(k in masses))throw Error('unknown-element');return n+masses[k]*c},0)}
 return Object.freeze({masses,parseFormula,molarMass,molesFromMass,massFromMoles,molarity,requiredMass,dilution,reactionYield});
});
(function(){
 'use strict';
 if(typeof document==='undefined')return;
 const $=id=>document.getElementById(id),tab=$('stoichTab'),section=$('stoichSection');
 if(!tab||!section||!window.StoichiometryEngine)return;
 const api=window.StoichiometryEngine,rx=window.ReactionEngine;
 const dictionaries={
 hu:{title:'Mol és sztöchiometria labor',intro:'Anyagmennyiség, moláris tömeg, oldatkoncentráció és reakciós anyagmérleg.',formula:'Kémiai képlet',grams:'Tömeg (g)',moles:'Anyagmennyiség (mol)',volume:'Oldattérfogat (L)',concentration:'Koncentráció (mol/L)',calculate:'Számítás',mass:'Moláris tömeg és anyagmennyiség',solution:'Oldat és hígítás',reaction:'Reakciós sztöchiometria',reactant:'Kiindulási anyag',product:'Termék',equation:'Reakció',result:'Eredmény',invalid:'Ellenőrizd a képletet és a pozitív számértékeket.',note:'A számítások ideális, tiszta anyagokra és teljes reakcióra vonatkoznak. A reakció tényleges lefolyása, a hozam, a körülmények és az oldat térfogatváltozása külön vizsgálatot igényel.',massCalc:'Moláris tömeg és molszám',solutionCalc:'Mólos koncentráció a megadott tömegből',yieldCalc:'Elméleti terméktömeg'},
 de:{title:'Mol- und Stöchiometrie-Labor',intro:'Stoffmenge, molare Masse, Konzentration und Reaktionsstöchiometrie.',formula:'Chemische Formel',grams:'Masse (g)',moles:'Stoffmenge (mol)',volume:'Lösungsvolumen (L)',concentration:'Konzentration (mol/L)',calculate:'Berechnen',mass:'Molare Masse und Stoffmenge',solution:'Lösungen und Verdünnung',reaction:'Reaktionsstöchiometrie',reactant:'Edukt',product:'Produkt',equation:'Reaktion',result:'Ergebnis',invalid:'Formel und positive Werte überprüfen.',note:'Berechnungen gelten für reine Stoffe und vollständige Reaktion. Reaktionsbedingungen, Ausbeute und Volumenänderungen müssen separat betrachtet werden.',massCalc:'Molare Masse und Stoffmenge',solutionCalc:'Molare Konzentration aus der Masse',yieldCalc:'Theoretische Produktmasse'},
 en:{title:'Mole and Stoichiometry Lab',intro:'Amount of substance, molar mass, solution concentration and reaction stoichiometry.',formula:'Chemical formula',grams:'Mass (g)',moles:'Amount (mol)',volume:'Solution volume (L)',concentration:'Concentration (mol/L)',calculate:'Calculate',mass:'Molar mass and amount',solution:'Solutions and dilution',reaction:'Reaction stoichiometry',reactant:'Reactant',product:'Product',equation:'Reaction',result:'Result',invalid:'Check the formula and positive numeric inputs.',note:'Calculations assume pure substances and full reaction conversion. Actual reaction conditions, yield and solution volume changes require separate treatment.',massCalc:'Molar mass and moles',solutionCalc:'Molar concentration from mass',yieldCalc:'Theoretical product mass'}};
 const lang=()=>['hu','de','en'].find(k=>$(k)?.classList.contains('active'))||'hu',tr=k=>dictionaries[lang()][k]||k;
 const mode=$('stoichMode'),formula=$('stoichFormula'),mass=$('stoichMass'),vol=$('stoichVolumeInput'),reaction=$('stoichReaction'),react=$('stoichReactant'),product=$('stoichProduct'),out=$('stoichOutput');
 const ids=['water','carbon','methane','neutral','rust','limestone','limewater','peroxide'];
 function setReactionParts(){const m=rx.model(reaction.value);if(!m)return;react.replaceChildren();product.replaceChildren();for(let i=0;i<m.parts.length;i++){const opt=document.createElement('option');opt.textContent=m.parts[i];opt.value=String(i);if(m.side[i]<0)react.append(opt);else product.append(opt)}}
 for(const id of ids){if(!rx?.model(id))continue;const option=document.createElement('option');option.value=id;option.textContent=rx.model(id).parts.map((p,i)=>(i&&rx.model(id).side[i]!==rx.model(id).side[i-1]?' → ':i?' + ':'')+p).join('');reaction.append(option)}
 reaction.onchange=setReactionParts;setReactionParts();
 function update(){for(const item of ['title','intro','grams','volume','result','note'])$('stoich'+item[0].toUpperCase()+item.slice(1)).textContent=tr(item);
  $('stoichFormulaLabel').textContent=tr('formula');const modes=['massCalc','solutionCalc','yieldCalc'];[...mode.options].forEach((opt,i)=>opt.textContent=tr(modes[i]));
  $('stoichCalculate').textContent=tr('calculate');
  $('stoichReactionFields').hidden=mode.value!=='yield';
  $('stoichFormulaFields').hidden=mode.value==='yield';
  $('stoichVolumeFields').hidden=mode.value!=='solution';
  $('stoichReactantLabel').textContent=tr('reactant');$('stoichProductLabel').textContent=tr('product');$('stoichReactionLabel').textContent=tr('equation');
 }
 function calculate(){try{
  const g=Number(mass.value),v=Number(vol.value),fmt=formula.value.trim();let result;
  if(mode.value==='mass'){const M=api.molarMass(fmt),n=api.molesFromMass(fmt,g);result='M = '+M.toFixed(3)+' g/mol; n = '+n.toPrecision(5)+' mol';}
  else if(mode.value==='solution'){const M=api.molarMass(fmt),n=api.molesFromMass(fmt,g),c=api.molarity(n,v);result='M = '+M.toFixed(3)+' g/mol; n = '+n.toPrecision(5)+' mol; c = '+c.toPrecision(5)+' mol/L';}
  else{const model=rx.model(reaction.value),index=Number(react.value),prodIndex=Number(product.value)-model.side.filter(x=>x<0).length;const answer=api.reactionYield(reaction.value,index,g,prodIndex,rx);result=answer.formula+': '+answer.moles.toPrecision(5)+' mol; '+answer.grams.toPrecision(5)+' g';}
  out.textContent=result;out.dataset.status='ok';
 }catch(err){out.textContent=tr('invalid')+' ('+err.message+')';out.dataset.status='error'}}
 tab.addEventListener('click',()=>{document.querySelectorAll('main > section').forEach(el=>el.classList.add('hidden'));document.querySelectorAll('.tabs > button').forEach(el=>el.classList.remove('active'));section.classList.remove('hidden');tab.classList.add('active');update()});
 $('stoichCalculate').addEventListener('click',calculate);mode.addEventListener('change',update);
 for(const l of ['hu','de','en'])$(l)?.addEventListener('click',update);
 mode.value='mass';update();
})();
