/* Shared stoichiometry and curated reaction library. Original code, MIT. */
(function(root,factory){
 const engine=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=engine;
 if(root)root.ReactionEngine=engine;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const species={
 H2:{formula:'H₂',atoms:{H:2}}, O2:{formula:'O₂',atoms:{O:2}}, H2O:{formula:'H₂O',atoms:{H:2,O:1}},
 C:{formula:'C',atoms:{C:1}},CO2:{formula:'CO₂',atoms:{C:1,O:2}},
 CH4:{formula:'CH₄',atoms:{C:1,H:4}},HCl:{formula:'HCl(aq)',atoms:{H:1,Cl:1}},
 NaOH:{formula:'NaOH(aq)',atoms:{Na:1,O:1,H:1}},NaCl:{formula:'NaCl(aq)',atoms:{Na:1,Cl:1}},
 Fe:{formula:'Fe',atoms:{Fe:1}},Fe2O3:{formula:'Fe₂O₃',atoms:{Fe:2,O:3}},
 CaCO3:{formula:'CaCO₃',atoms:{Ca:1,C:1,O:3}},CaCl2:{formula:'CaCl₂',atoms:{Ca:1,Cl:2}},
 CaOH2:{formula:'Ca(OH)₂',atoms:{Ca:1,O:2,H:2}},H2O2:{formula:'H₂O₂',atoms:{H:2,O:2}},
 AgIon:{formula:'Ag⁺',atoms:{Ag:1},charge:1},ClIon:{formula:'Cl⁻',atoms:{Cl:1},charge:-1},
 AgCl:{formula:'AgCl(s)',atoms:{Ag:1,Cl:1}},
 CuIon:{formula:'Cu²⁺',atoms:{Cu:1},charge:2},NH3:{formula:'NH₃',atoms:{N:1,H:3}},
 CuAmine:{formula:'[Cu(NH₃)₄]²⁺',atoms:{Cu:1,N:4,H:12},charge:2}
 };
 const catalog={
 water:{reactants:['H2','O2'],products:['H2O'],solution:[2,1,2],kind:'chemical'},
 carbon:{reactants:['C','O2'],products:['CO2'],solution:[1,1,1],kind:'chemical'},
 methane:{reactants:['CH4','O2'],products:['CO2','H2O'],solution:[1,2,1,2],kind:'chemical',condition:'ignition'},
 neutral:{reactants:['HCl','NaOH'],products:['NaCl','H2O'],solution:[1,1,1,1],kind:'chemical',condition:'aqueous'},
 rust:{reactants:['Fe','O2'],products:['Fe2O3'],solution:[4,3,2],kind:'chemical'},
 limestone:{reactants:['CaCO3','HCl'],products:['CaCl2','H2O','CO2'],solution:[1,2,1,1,1],kind:'chemical'},
 limewater:{reactants:['CaOH2','CO2'],products:['CaCO3','H2O'],solution:[1,1,1,1],kind:'chemical'},
 peroxide:{reactants:['H2O2'],products:['H2O','O2'],solution:[2,2,1],kind:'chemical',condition:'catalyst'},
 silver:{reactants:['AgIon','ClIon'],products:['AgCl'],solution:[1,1,1],kind:'chemical',condition:'aqueous'},
 complex:{reactants:['CuIon','NH3'],products:['CuAmine'],solution:[1,4,1],kind:'chemical',condition:'aqueous'}
 };
 const wrongSides={
 reactants:[['H2O','CO2'],['HCl','CO2'],['O2','NaCl']],
 products:[['H2','O2'],['NaOH','H2O'],['CH4','O2']]
 };
 const clone=x=>JSON.parse(JSON.stringify(x));
 function model(id){const c=catalog[id];if(!c)return null;const keys=[...c.reactants,...c.products];return{...clone(c),parts:keys.map(k=>species[k].formula),side:keys.map((_,i)=>i<c.reactants.length?-1:1),atoms:keys.map(k=>clone(species[k].atoms))}}
 function counts(keys,coeffs){const result={};let charge=0;for(let i=0;i<keys.length;i++){const s=species[keys[i]];const coeff=coeffs[i];if(!s||!Number.isSafeInteger(coeff)||coeff<1||coeff>99)return null;for(const [atom,count] of Object.entries(s.atoms))result[atom]=(result[atom]||0)+count*coeff;charge+=(s.charge||0)*coeff}return{atoms:result,charge}}
 function same(a,b){return a&&b&&a.charge===b.charge&&Object.keys({...a.atoms,...b.atoms}).every(k=>(a.atoms[k]||0)===(b.atoms[k]||0))}
 function sameItems(a,b){return a.length===b.length&&a.slice().sort().every((k,i)=>k===b.slice().sort()[i])}
 function check(id,coefficients,reactants,products){
  const c=catalog[id];if(!c)return{ok:false,reason:'unknown'};
  const react=reactants||c.reactants,prod=products||c.products;
  if(!Array.isArray(react)||!Array.isArray(prod)||!sameItems(react,c.reactants)||!sameItems(prod,c.products))return{ok:false,reason:'wrong-reaction'};
  if(!Array.isArray(coefficients)||coefficients.length!==react.length+prod.length)return{ok:false,reason:'coefficients'};
  const left=counts(react,coefficients.slice(0,react.length));
  const right=counts(prod,coefficients.slice(react.length));
  if(!left||!right)return{ok:false,reason:'coefficients'};
  return{ok:!!same(left,right),reason:same(left,right)?'balanced':'unbalanced',left,right};
 }
 function analyze(id,values){
  const m=model(id);if(!m)return null;
  const c=catalog[id],coeffs=values||m.parts.map(()=>1),left=counts(c.reactants,coeffs.slice(0,c.reactants.length)),right=counts(c.products,coeffs.slice(c.reactants.length));
  const elements=[...new Set(Object.keys({...left?.atoms,...right?.atoms}))].sort();
  return{...check(id,coeffs),rows:elements.map(sym=>({sym,l:left.atoms[sym]||0,r:right.atoms[sym]||0,ok:(left.atoms[sym]||0)===(right.atoms[sym]||0)})),valid:!!left&&!!right,balanced:check(id,coeffs).ok,charge:{l:left?.charge,r:right?.charge}};
 }
 function sideOptions(id,side){const c=catalog[id];if(!c)return[];const correct=c[side];const options=[correct,...wrongSides[side].filter(x=>!sameItems(x,correct))];return options.map(keys=>({keys:keys.slice(),label:keys.map(k=>species[k].formula).join(' + ')}));}
 return Object.freeze({species,catalog,model,check,analyze,sideOptions});
});
