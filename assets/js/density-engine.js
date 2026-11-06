/* Chemistry Lab Density Lab 0.2106. Apache-2.0. Pure mathematics and curated teaching data. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.ChemistryDensityEngine=api;})(typeof window!=='undefined'?window:null,function(){
'use strict';
// Values are illustrative reference densities in g/cm³, not a thermodynamic equation-of-state.
// OpenStax Chemistry, §1.4 https://openstax.org/books/chemistry/pages/1-4-measurements
// NIST measurement school, density at 20°C: https://www.nist.gov/system/files/documents/iaao/Mass_Francisco-Garcia.pdf
// Gas estimates: ideal-gas law rho = pM/(RT), at 293.15 K and 101325 Pa.
// M is in g/mol and density is returned in g/cm³; approximation, not a real-gas EOS.
// RSC periodic table: https://periodic-table.rsc.org/
// PubChem elemental densities: https://pubchem.ncbi.nlm.nih.gov/periodic-table/density/
// Gas teaching reference: https://www.concoa.com/gas_reference
const idealGasDensity=molarMass=>101325*molarMass/(8.31446261815324*293.15*1e6);
const gas=(id,formula,molarMass,atoms,labels,color)=>({
 id,rho:idealGasDensity(molarMass),phase:'gas',structure:'gas',condition:'20°C, 1 atm',
 formula,molarMass,atoms,labels,color
});
const AVOGADRO=6.02214076e23;
const MOLAR_MASSES=Object.freeze({
 water:18.01528,ice:18.01528,ethanol:46.06844,
 aluminum:26.9815385,iron:55.845,copper:63.546,gold:196.96657,
 salt:58.44277,lead:207.2,magnesium:24.305,zinc:65.38,silver:107.8682,
 tungsten:183.84,osmium:190.23,graphite:12.011,diamond:12.011
});
// Wood is heterogeneous: it has no meaningful single particle molar mass.
const MATERIALS=Object.freeze([
 {id:'water',rho:0.998,phase:'liquid',structure:'liquid',condition:'20°C',labels:['Víz','Wasser','Water'],color:'#58c5f5'},
 {id:'ice',rho:0.917,phase:'solid',structure:'ice',condition:'0°C',labels:['Jég','Eis','Ice'],color:'#b6e9fa'},
 {id:'air',rho:0.00120,phase:'gas',structure:'gas',condition:'20°C, 1 atm',formula:'N₂ + O₂ + …',molarMass:28.96,atoms:0,labels:['Száraz levegő','Trockene Luft','Dry air'],color:'#97bbec'},
 {id:'ethanol',rho:0.789,phase:'liquid',structure:'liquid',condition:'20°C',labels:['Etanol','Ethanol','Ethanol'],color:'#ae9af2'},
 {id:'aluminum',rho:2.70,phase:'solid',structure:'fcc',condition:'20°C',labels:['Alumínium','Aluminium','Aluminium'],color:'#c8d2df'},
 {id:'iron',rho:7.87,phase:'solid',structure:'bcc',condition:'20°C',labels:['Vas','Eisen','Iron'],color:'#b9a19a'},
 {id:'copper',rho:8.96,phase:'solid',structure:'fcc',condition:'20°C',labels:['Réz','Kupfer','Copper'],color:'#ee9d70'},
 {id:'gold',rho:19.30,phase:'solid',structure:'fcc',condition:'20°C',labels:['Arany','Gold','Gold'],color:'#f5d66c'},
 {id:'salt',rho:2.16,phase:'solid',structure:'ionic',condition:'20°C',labels:['Kősó (NaCl)','Steinsalz (NaCl)','Rock salt (NaCl)'],color:'#d0e8ff'},
 {id:'wood',rho:0.50,phase:'solid',structure:'porous',condition:'száraz, változó / trocken, variabel / dry, variable',labels:['Fenyőfa (példa)','Kiefernholz (Beispiel)','Pine wood (example)'],color:'#c6a078'},
 // Familiar metals + high-density extremes and two carbon allotropes (approximate, at 20°C).
 {id:'lead',rho:11.34,phase:'solid',structure:'fcc',condition:'20°C',labels:['Ólom (Pb)','Blei (Pb)','Lead (Pb)'],color:'#a4aabb'},
 {id:'magnesium',rho:1.74,phase:'solid',structure:'hcp',condition:'20°C',labels:['Magnézium (Mg)','Magnesium (Mg)','Magnesium (Mg)'],color:'#d1e8ed'},
 {id:'zinc',rho:7.134,phase:'solid',structure:'hcp',condition:'20°C',labels:['Cink (Zn)','Zink (Zn)','Zinc (Zn)'],color:'#b1c5d5'},
 {id:'silver',rho:10.5,phase:'solid',structure:'fcc',condition:'20°C',labels:['Ezüst (Ag)','Silber (Ag)','Silver (Ag)'],color:'#f3f5fc'},
 {id:'tungsten',rho:19.3,phase:'solid',structure:'bcc',condition:'20°C',labels:['Volfrám (W)','Wolfram (W)','Tungsten (W)'],color:'#aebcc9'},
 {id:'osmium',rho:22.59,phase:'solid',structure:'hcp',condition:'20°C',labels:['Ozmium (Os)','Osmium (Os)','Osmium (Os)'],color:'#9bbee3'},
 {id:'graphite',rho:2.2,phase:'solid',structure:'layered',condition:'20°C',labels:['Grafit (C)','Graphit (C)','Graphite (C)'],color:'#8f9da9'},
 {id:'diamond',rho:3.513,phase:'solid',structure:'diamond',condition:'20°C',labels:['Gyémánt (C)','Diamant (C)','Diamond (C)'],color:'#b5ecff'},
 // Nine pure gases, at the same temperature and pressure, with comparable number density.
 gas('hydrogen','H₂',2.01588,2,['Hidrogén (H₂)','Wasserstoff (H₂)','Hydrogen (H₂)'],'#f6bd9f'),
 gas('helium','He',4.002602,1,['Hélium (He)','Helium (He)','Helium (He)'],'#ead1ff'),
 gas('nitrogen','N₂',28.0134,2,['Nitrogén (N₂)','Stickstoff (N₂)','Nitrogen (N₂)'],'#9ebdf4'),
 gas('oxygen','O₂',31.998,2,['Oxigén (O₂)','Sauerstoff (O₂)','Oxygen (O₂)'],'#f1a5a5'),
 gas('carbonDioxide','CO₂',44.0095,3,['Szén-dioxid (CO₂)','Kohlenstoffdioxid (CO₂)','Carbon dioxide (CO₂)'],'#ecc1a7'),
 gas('argon','Ar',39.948,1,['Argon (Ar)','Argon (Ar)','Argon (Ar)'],'#adf2d0'),
 gas('methane','CH₄',16.043,5,['Metán (CH₄)','Methan (CH₄)','Methane (CH₄)'],'#b6e2aa'),
 gas('xenon','Xe',131.293,1,['Xenon (Xe)','Xenon (Xe)','Xenon (Xe)'],'#e5aeed'),
 gas('sulfurHexafluoride','SF₆',146.055,7,['Kén-hexafluorid (SF₆)','Schwefelhexafluorid (SF₆)','Sulfur hexafluoride (SF₆)'],'#d9f2a1')
].map(m=>Object.freeze({...m,molarMass:m.molarMass??MOLAR_MASSES[m.id]??null})));

const IDS=new Set(MATERIALS.map(m=>m.id));
function material(id){return MATERIALS.find(m=>m.id===id)||null;}
function finitePositive(value){return typeof value==='number'&&Number.isFinite(value)&&value>0;}
function dimensions(volume,shape='cube'){
 if(!finitePositive(volume)||!['cube','cuboid'].includes(shape))throw new RangeError('Invalid volume or shape');
 const s=Math.cbrt(volume);
 return shape==='cube'?[s,s,s]:[s*1.6,s,s/1.6]; // aspect ratio changes, product remains V
}
function compute(leftId,rightId,mode='volume',quantity=1000,shape='cube'){
 if(!IDS.has(leftId)||!IDS.has(rightId))throw new RangeError('Unknown material');
 if(!['volume','mass'].includes(mode)||!finitePositive(quantity)||!['cube','cuboid'].includes(shape))throw new RangeError('Invalid comparison');
 const toBody=id=>{
  const m=material(id),volume=mode==='volume'?quantity:quantity/m.rho;
  const mass=mode==='volume'?m.rho*quantity:quantity;
  return {id,material:m,density:m.rho,mass,volume,dimensions:dimensions(volume,shape)};
 };
 const a=toBody(leftId),b=toBody(rightId);
 return {left:a,right:b,mode,quantity,shape,densityRatio:a.density/b.density,volumeRatio:a.volume/b.volume,massRatio:a.mass/b.mass};
}
function waterResult(id){
 const m=material(id);if(!m)return null;
 if(id==='salt')return 'dissolves';
 if(m.phase!=='solid')return 'not-applicable';
 return m.rho<0.998?'floats':m.rho>0.998?'sinks':'neutral';
}
// Deterministic positions illustrating arrangement, never used in density calculations.
// Each point is a pictogram; count/diameter is NOT proportional to true atomic number density.
function particles(id){
 const m=material(id);if(!m)throw new RangeError('Unknown material');
 const out=[];const add=(x,y,z,type=0)=>out.push({x,y,z,type});
 if(m.structure==='fcc'){
  // Show face-centred sites and corner sites in a schematic repeating cube.
  for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++){
   add(.12+a*.38,.12+b*.38,.12+c*.38,0);
   if(a<2&&b<2)add(.31+a*.38,.31+b*.38,.12+c*.38,0);
   if(a<2&&c<2)add(.31+a*.38,.12+b*.38,.31+c*.38,0);
   if(b<2&&c<2)add(.12+a*.38,.31+b*.38,.31+c*.38,0);
  }
 }else if(m.structure==='bcc'){
  for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++){
   add(.12+a*.38,.12+b*.38,.12+c*.38);
   if(a<2&&b<2&&c<2)add(.31+a*.38,.31+b*.38,.31+c*.38);
  }
 }else if(m.structure==='hcp'){
  // Close-packed, staggered hexagonal layers (schematic, not a crystallographic unit cell).
  for(let layer=0;layer<4;layer++)for(let row=0;row<4;row++)for(let col=0;col<4;col++)
   add(.12+col*.2+(row%2)*.075+(layer%2)*.03,.12+row*.22,.12+layer*.245);
 }else if(m.structure==='layered'){
  // Graphite: sheets with relatively larger gaps between layers.
  for(let layer=0;layer<3;layer++)for(let row=0;row<5;row++)for(let col=0;col<5;col++)
   if((col+row)%3!==0)add(.13+col*.18+(row%2)*.06,.12+row*.18,.14+layer*.36);
 }else if(m.structure==='diamond'){
  // Diamond: offset, interconnected tetrahedral network (schematic).
  for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let d=0;d<3;d++){
   add(.13+a*.34,.13+b*.34,.13+d*.34);
   if(a<2&&b<2&&d<2)add(.30+a*.34,.30+b*.34,.30+d*.34);
  }
 }else if(m.structure==='ionic'){
  for(let a=0;a<5;a++)for(let b=0;b<5;b++)for(let c=0;c<5;c++)add(.1+.2*a,.1+.2*b,.1+.2*c,(a+b+c)%2);
 }else if(m.structure==='ice'){
  // Open network: stylized H₂O centres, not crystallographic coordinates of ice Ih.
  for(let layer=0;layer<3;layer++)for(let row=0;row<4;row++)for(let col=0;col<4;col++)
   if((row+col+layer)%4!==0)add(.13+.24*col+(row%2)*.055,.13+row*.22,.16+layer*.33);
 }else if(m.structure==='porous'){
  for(let a=0;a<6;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++){
   if(a%3===2||b===2&&c%2===1)continue;
   add(.13+a*.13,.14+b*.21,.15+c*.23);
  }
 }else{
  let seed=Array.from(id).reduce((s,ch)=>(Math.imul(s,31)+ch.charCodeAt(0))>>>0,47);
  const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const count=m.phase==='gas'?26:85;
  for(let i=0;i<count;i++)add(.08+.84*rand(),.08+.84*rand(),.08+.84*rand(),i%4===0?1:0);
 }
 return out;
}

const MAX_MARKERS=250;
// Each dot represents a known (rounded) amount of substance, NOT one literal atom.
// Use one common legend scale within each phase class; gases need a microscope zoom.
function particleCategory(m){return m.phase==='gas'?'gas':m.id==='wood'?'structure':'condensed';}
function particleMoles(body){return body.material.molarMass?body.mass/body.material.molarMass:null;}
function niceScale(minimum){
 if(!(minimum>0))return 1;
 const exponent=Math.floor(Math.log10(minimum)),base=10**exponent;
 return [1,2,5,10].map(x=>x*base).find(x=>x>=minimum-1e-12)||10*base;
}
function particlePlan(comparison){
 const bodies=[comparison.left,comparison.right],plans={},scales={};
 for(const category of ['condensed','gas','structure']){
  const sameCategory=bodies.filter(b=>particleCategory(b.material)===category);
  if(!sameCategory.length)continue;
  const reference=Math.max(...sameCategory.map(b=>{
   const referenceMass=comparison.mode==='mass'?5000:5000*b.density;
   return category==='structure'?referenceMass/b.density/25:referenceMass/b.material.molarMass;
  }));
  // A single marker represents one or more moles, with a sensible rounded scale.
  // For wood the marker is a schematic cell feature per 25 cm³, not a molecule.
  scales[category]=niceScale(reference/MAX_MARKERS);
 }
 for(const body of bodies){
  const category=particleCategory(body.material);
  const units=category==='structure'?body.volume/25:particleMoles(body);
  const perMarker=scales[category];
  const exact=units/perMarker,rounded=Math.round(exact);
  const count=Math.min(MAX_MARKERS,Math.max(1,rounded));
  plans[body===comparison.left?'left':'right']={
   count,units,moles:particleMoles(body),perMarker,category,
   approximate:rounded===0,capped:rounded>MAX_MARKERS,
   // True particle count; UI formats in scientific notation instead of listing atoms.
   particleCount:particleMoles(body)===null?null:particleMoles(body)*AVOGADRO
  };
 }
 return Object.freeze({left:plans.left,right:plans.right,scales:Object.freeze(scales)});
}
function particleMarkers(id,count){
 const m=material(id);if(!m)throw new RangeError('Unknown material');
 if(!Number.isSafeInteger(count)||count<1||count>MAX_MARKERS)throw new RangeError('Invalid marker count');
 const structured=!['gas','liquid','porous'].includes(m.structure);
 const side=Math.ceil(Math.cbrt(count*1.28));
 const out=[];
 if(structured){
  const sites=[];
  for(let x=0;x<side;x++)for(let y=0;y<side;y++)for(let z=0;z<side;z++){
   const stagger=m.structure==='hcp'||m.structure==='layered'?((y+z)%2)*.25:0;
   const px=Math.min(.94,(x+.5+stagger)/side),py=(y+.5)/side,pz=(z+.5)/side;
   sites.push({x:px,y:py,z:pz,type:m.structure==='ionic'?(x+y+z)%2:0});
  }
  let state=Array.from(id).reduce((a,ch)=>(Math.imul(a,33)+ch.charCodeAt(0))>>>0,7)+count;
  for(let i=sites.length-1;i>0;i--){
   state=(Math.imul(state,1664525)+1013904223)>>>0;
   const j=state%(i+1);[sites[i],sites[j]]=[sites[j],sites[i]];
  }
  return sites.slice(0,count);
 }
 const halton=(n,base)=>{let f=1,result=0;while(n>0){f/=base;result+=f*(n%base);n=Math.floor(n/base);}return result;};
 const offset=Array.from(id).reduce((a,ch)=>a+ch.charCodeAt(0),0);
 for(let i=0;i<count;i++){
  const k=i+offset%113+1;
  out.push({x:.08+.84*halton(k,2),y:.08+.84*halton(k,3),z:.08+.84*halton(k,5),type:0});
 }
 return out;
}

return Object.freeze({MATERIALS,material,compute,dimensions,particles,waterResult,idealGasDensity,particlePlan,particleMarkers,particleMoles,AVOGADRO,MAX_MARKERS});
});
