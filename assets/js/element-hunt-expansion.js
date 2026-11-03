/* Chemistry Lab — original element hunt factual question generator, Apache-2.0.
   Builds 100 unique, fact-checked prompts from the local 118-element periodic table. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.ElementHuntExpansion=api;
})(typeof window!=='undefined'?window:null,function(){
'use strict';
const period=z=>z<=2?1:z<=10?2:z<=18?3:z<=36?4:z<=54?5:z<=86?6:7;
const families={alkali:['alkálifém','Alkalimetall','alkali metal'],earth:['alkáliföldfém','Erdalkalimetall','alkaline-earth metal'],transition:['átmenetifém','Übergangsmetall','transition metal'],halogen:['halogén','Halogen','halogen'],noble:['nemesgáz','Edelgas','noble gas'],metalloid:['félfém','Halbmetall','metalloid']};
function build(elements,count=100){
 if(!Array.isArray(elements)||elements.length<100)throw Error('periodic-table-required');
 const byZ=[...elements].sort((a,b)=>a.z-b.z),result=[];
 for(let i=0;i<count;i++){
  const a=byZ[(i*37+4)%byZ.length],p=period(a.z),family=families[a.cat];
  // Five question styles: atomic number, symbol/name, period, next element, group+period.
  let kind=i%5;if(kind===3&&a.z===1)kind=0;
  if(kind===4&&(!family||['lanth','act'].includes(a.cat)))kind=2;
  const previous=byZ.find(e=>e.z===a.z-1);
  let q;
  if(kind===0)q=[`Melyik elem rendszáma ${a.z}?`,`Welches Element hat die Ordnungszahl ${a.z}?`,`Which element has atomic number ${a.z}?`];
  if(kind===1)q=[`Melyik elem vegyjele tartozik ehhez a névhez: ${a.hu}?`,`Welches Symbol gehört zu ${a.de}?`,`Which symbol belongs to ${a.en}?`];
  if(kind===2)q=[`Melyik ${a.z} rendszámú elem található a ${p}. periódusban?`,`Welches Element mit der Ordnungszahl ${a.z} steht in Periode ${p}?`,`Which element with atomic number ${a.z} belongs to period ${p}?`];
  if(kind===3)q=[`Melyik elem követi a(z) ${previous.hu} (${previous.s}) elemet rendszám szerint?`,`Welches Element folgt auf ${previous.de} (${previous.s})?`,`Which element comes directly after ${previous.en} (${previous.s}) by atomic number?`];
  if(kind===4)q=[`Melyik ${a.z} rendszámú elem ${family[0]} a ${p}. periódusban?`,`Welches Element mit Ordnungszahl ${a.z} ist ein ${family[1]} in Periode ${p}?`,`Which element with atomic number ${a.z} is a ${family[2]} in period ${p}?`];
  const valid=x=>x.z!==a.z&&(kind===2?period(x.z)!==p:kind===4?(x.cat!==a.cat||period(x.z)!==p):true);
  const pool=byZ.filter(valid).sort((x,y)=>Math.abs(x.z-a.z)-Math.abs(y.z-a.z)||x.z-y.z);
  const distractors=[];for(const item of pool){if(distractors.length===3)break;if(!distractors.some(x=>x.s===item.s))distractors.push(item)}
  if(distractors.length<3)throw Error('insufficient-distractors');
  const opts=[a.s,...distractors.map(x=>x.s)];
  // Rotate the choices deterministically so the correct answer is not always first.
  const shift=i%4;const rotated=opts.slice(shift).concat(opts.slice(0,shift));
  const why=[`${a.hu} (${a.s}): rendszám ${a.z}, ${p}. periódus.`,`${a.de} (${a.s}): Ordnungszahl ${a.z}, Periode ${p}.`,`${a.en} (${a.s}): atomic number ${a.z}, period ${p}.`];
  result.push({q,a:a.s,opts:rotated,why,generated:true,kind,sourceZ:a.z});
 }
 return result;
}
return Object.freeze({build,period});
});
