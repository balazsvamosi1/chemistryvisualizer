/* Chemistry Lab material learning enhancements — original Apache-2.0, offline and GitHub Pages compatible. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.ChemistryMaterialLearning=api;})(typeof window!=='undefined'?window:null,function(){
'use strict';
const names={
 hu:{related:'Kapcsolódó anyagok – fedezd fel a különbséget!',compare:'Szerkezeti összehasonlítás',difference:'Mi változott?',relationship:'Miért rokonok?',prediction:'Először tippelj!',check:'Válasz ellenőrzése',correct:'Helyes! ',wrong:'Nem egészen. ',family:'Azonos anyagcsalád',more:'Válassz egy rokon anyagot az adatlap megnyitásához',generic:'A hasonlóság itt oktatási csoportosítást jelent, nem kiszámított molekuláris hasonlóságot.'},
 de:{related:'Verwandte Stoffe – entdecke den Unterschied!',compare:'Strukturvergleich',difference:'Was ist anders?',relationship:'Was verbindet sie?',prediction:'Erst eine Vermutung!',check:'Antwort prüfen',correct:'Richtig! ',wrong:'Noch nicht. ',family:'Gleiche Stofffamilie',more:'Wähle einen verwandten Stoff, um sein Datenblatt zu öffnen',generic:'Dies ist eine didaktische Gruppierung, keine berechnete Molekülähnlichkeit.'},
 en:{related:'Related materials – discover the difference!',compare:'Structure comparison',difference:'What changed?',relationship:'What makes them related?',prediction:'Predict first!',check:'Check answer',correct:'Correct! ',wrong:'Not quite. ',family:'Same material family',more:'Select a related material to open its details',generic:'Similarity here is an educational grouping, not a calculated molecular similarity score.'}
};
const comparisons=[
 {a:'Etán',b:'Etén',type:'bond',bondA:'C–C',bondB:'C=C',difference:['Az eténben a két szénatom közötti kötés kettős, az etánban egyszeres. Ez eltérő telítettséget és reakciókészséget eredményez.','Ethen besitzt eine C=C-Doppelbindung, Ethan eine C–C-Einfachbindung.','Ethene has a C=C double bond; ethane has a C–C single bond. This changes saturation and reactivity.'],question:['Melyik vegyület tartalmaz C=C kettős kötést?','Welche Verbindung hat eine C=C-Doppelbindung?','Which compound contains a C=C double bond?'],answer:'Etén'},
 {a:'Etén',b:'Etin',type:'bond',bondA:'C=C',bondB:'C≡C',difference:['Az eténben kettős, az etinben hármas szén–szén kötés található; mindkettő telítetlen szénhidrogén.','Ethen hat C=C, Ethin C≡C; beide sind ungesättigte Kohlenwasserstoffe.','Ethene has C=C while ethyne has C≡C. Both are unsaturated hydrocarbons.'],question:['Melyikben van hármas kötés?','Welche Verbindung besitzt eine Dreifachbindung?','Which has a triple bond?'],answer:'Etin'},
 {a:'Metán',b:'Etán',type:'size',difference:['Mindkettő alkán; az etán két szénatomot, a metán egyet tartalmaz.','Beides sind Alkane. Ethan hat zwei Kohlenstoffatome, Methan nur eines.','Both are alkanes. Ethane has two carbons and methane has one.'],question:['Melyikben van két szénatom?','Welches Molekül hat zwei C-Atome?','Which molecule has two carbon atoms?'],answer:'Etán'},
 {a:'Metanol',b:'Etanol',type:'chain',difference:['Mindkettő alkohol, de az etanolnak kettő, a metanolnak egy szénatomja van. A metanol mérgező; a hasonló szerkezet nem azonos élettani hatást jelent.','Beides sind Alkohole; Ethanol hat zwei C-Atome, Methanol eines. Methanol ist hochgiftig.','Both are alcohols, but ethanol has two carbons and methanol one. Methanol is highly toxic.'],question:['Melyik alkohol tartalmaz két szénatomot?','Welcher Alkohol enthält zwei Kohlenstoffatome?','Which alcohol has two carbon atoms?'],answer:'Etanol'},
 {a:'Grafit',b:'Gyémánt',type:'network',difference:['Mindkét anyag elemi szénből áll. A grafit réteges, a gyémánt háromdimenziós tetraéderes kovalens hálózattal rendelkezik.','Beide sind Kohlenstoff. Graphit bildet Schichten, Diamant ein tetraedrisches Raumnetz.','Both are carbon. Graphite has layered networks; diamond has a three-dimensional tetrahedral network.'],question:['Melyiknek van réteges szerkezete?','Welcher Stoff hat eine Schichtstruktur?','Which has a layered structure?'],answer:'Grafit'},
 {a:'Szén-monoxid',b:'Szén-dioxid',type:'formula',difference:['A CO-molekula egy, a CO₂ két oxigénatomot tartalmaz. A két gáz tulajdonságai és veszélyei nagyon különböznek.','CO hat ein Sauerstoffatom; CO₂ hat zwei. Die Eigenschaften unterscheiden sich stark.','CO has one oxygen atom; CO₂ has two. Their properties and hazards differ substantially.'],question:['Melyik molekulában van két oxigénatom?','Welches Molekül hat zwei Sauerstoffatome?','Which molecule has two oxygen atoms?'],answer:'Szén-dioxid'},
 {a:'Konyhasó',b:'Szódabikarbóna',type:'ions',difference:['Mindkettő nátriumot tartalmazó ionos só, de a konyhasó kloridiont, a szódabikarbóna hidrogén-karbonátiont tartalmaz.','Beide sind Natriumsalze; NaCl enthält Chlorid, NaHCO₃ Hydrogencarbonat.','Both are sodium salts; table salt has chloride, baking soda has bicarbonate.'],question:['Melyik só tartalmaz hidrogén-karbonátiont?','Welches Salz enthält Hydrogencarbonat?','Which salt contains bicarbonate?'],answer:'Szódabikarbóna'},
 {a:'Víz',b:'Hidrogén-peroxid',type:'bond',difference:['A víz H₂O, a hidrogén-peroxid H₂O₂. A peroxidban O–O kötés található, amely a vízben nincs jelen.','Wasser ist H₂O, Wasserstoffperoxid H₂O₂. Peroxid hat eine O–O-Bindung.','Water is H₂O while hydrogen peroxide is H₂O₂; peroxide has an O–O bond.'],question:['Melyikben van O–O kötés?','Welche Verbindung hat eine O–O-Bindung?','Which contains an O–O bond?'],answer:'Hidrogén-peroxid'},
 {a:'Kénsav',b:'Salétromsav',type:'acid',difference:['A kénsav H₂SO₄, a salétromsav HNO₃. A kénsav diprotikus, a salétromsav monoprotikus; mindkettő maró, de reakcióik eltérhetnek.','Schwefelsäure ist zweiprotonig, Salpetersäure einprotonig. Beide sind ätzend.','Sulfuric acid is diprotic, nitric acid monoprotic; both can be corrosive but react differently.'],question:['Melyik sav kétértékű?','Welche Säure ist zweiprotonig?','Which acid is diprotic?'],answer:'Kénsav'},
 {a:'Polietilén',b:'PVC',type:'polymer',difference:['Mindkettő polimer; a PVC ismétlődő egységeiben klóratom is található, míg a polietilén szénből és hidrogénből épül fel.','Beide sind Polymere. PVC enthält Chlor in den Wiederholungseinheiten, Polyethylen nicht.','Both are polymers. PVC has chlorine-containing repeating units, polyethylene does not.'],question:['Melyik polimer tartalmaz klórt a láncában?','Welches Polymer enthält Chlor?','Which polymer contains chlorine?'],answer:'PVC'}
];
const links={
 'Etán':['Metán','Etén','Etin'],
 'Etén':['Etán','Etin'],
 'Etin':['Etén','Etán'],
 'Metán':['Etán','Propán'],
 'Metanol':['Etanol','Glicerin'],
 'Etanol':['Metanol','Glicerin'],
 'Grafit':['Gyémánt'],
 'Gyémánt':['Grafit'],
 'Szén-monoxid':['Szén-dioxid'],
 'Szén-dioxid':['Szén-monoxid'],
 'Víz':['Hidrogén-peroxid'],
 'Hidrogén-peroxid':['Víz'],
 'Konyhasó':['Szódabikarbóna'],
 'Szódabikarbóna':['Konyhasó'],
 'Kénsav':['Salétromsav'],
 'Salétromsav':['Kénsav'],
 'Polietilén':['PVC'],
 'PVC':['Polietilén']
};
function matchPair(a,b){return comparisons.find(p=>(p.a===a&&p.b===b)||(p.b===a&&p.a===b))||null}
function related(item,all){const recommended=links[item.hu]||[];const a=all.filter(x=>x.hu!==item.hu&&recommended.includes(x.hu));const family=typeof window!=='undefined'?window.ChemistryMaterialFamilies:null;const group=family?.family(item);const others=all.filter(x=>x.hu!==item.hu&&!a.includes(x)&&(group?family.family(x)===group:x.category===item.category));return a.concat(others).slice(0,6)}
function info(item,other,lang='hu'){const p=matchPair(item.hu,other.hu);if(!p)return null;const i=lang==='de'?1:lang==='en'?2:0;return{difference:p.difference[i],question:p.question[i],answer:p.answer,type:p.type}}
function renderMaterial(item,host,all,selected,lang,onSelect){
 const l=names[lang]||names.hu,idx=lang==='de'?1:lang==='en'?2:0;
 const available=related(item,all),panel=document.createElement('section');panel.className='material-learning';
 const heading=document.createElement('h4');heading.textContent=l.related;panel.append(heading);
 const hint=document.createElement('p');hint.textContent=l.more;panel.append(hint);
 const recommendations=document.createElement('div');recommendations.className='material-recommendations';
 for(const other of available){const btn=document.createElement('button');btn.type='button';btn.textContent=(other[lang]||other.hu)+' · '+other.f;btn.addEventListener('click',()=>onSelect?.(all.indexOf(other)));recommendations.append(btn)}
 panel.append(recommendations);
 const paired=available.find(x=>matchPair(item.hu,x.hu));
 if(paired){
  const p=matchPair(item.hu,paired.hu);
  const diff=document.createElement('details');diff.className='material-difference';
  const summary=document.createElement('summary');summary.textContent=l.compare+': '+(item[lang]||item.hu)+' / '+(paired[lang]||paired.hu);diff.append(summary);
  const columns=document.createElement('div');columns.className='material-structure-compare';
  for(const m of [item,paired]){const col=document.createElement('div');const name=document.createElement('strong');name.textContent=m[lang]||m.hu;
   const formula=document.createElement('span');formula.textContent=m.f;col.append(name,formula);columns.append(col)}
  diff.append(columns);
  if(p.type==='bond'){
   const bonds=document.createElement('div');bonds.className='material-bond-compare';
   const symbols=[p.bondA,p.bondB];
   for(let index=0;index<2;index++){
    const bond=document.createElement('span');bond.textContent=symbols[index];bond.setAttribute('aria-label',index===0?'First molecule bond':'Second molecule bond');bonds.append(bond);
   }
   diff.append(bonds);
  }
  const q=document.createElement('p');q.textContent=l.prediction+' '+p.question[idx];diff.append(q);
  const opts=document.createElement('div');opts.className='material-prediction-buttons';let answer=null;
  const feedback=document.createElement('p');feedback.setAttribute('role','status');feedback.className='material-prediction-feedback';feedback.hidden=true;
  for(const key of [p.a,p.b]){const candidate=all.find(m=>m.hu===key);const btn=document.createElement('button');btn.type='button';btn.textContent=candidate?.[lang]||key;btn.addEventListener('click',()=>{answer=key;for(const b of opts.children)b.setAttribute('aria-pressed',String(b===btn));feedback.hidden=false;feedback.textContent=(answer===p.answer?l.correct:l.wrong)+p.difference[idx]});opts.append(btn)}
  diff.append(opts,feedback);
  panel.append(diff);
 }
 host.append(panel);
}
return Object.freeze({related,info,matchPair,renderMaterial});
});
