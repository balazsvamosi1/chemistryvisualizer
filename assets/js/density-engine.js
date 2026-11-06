/* Chemistry Lab Density Lab 0.2106. Apache-2.0. Pure mathematics and curated teaching data. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.ChemistryDensityEngine=api;})(typeof window!=='undefined'?window:null,function(){
'use strict';
// Values are illustrative reference densities in g/cm³, not a thermodynamic equation-of-state.
// OpenStax Chemistry, §1.4 https://openstax.org/books/chemistry/pages/1-4-measurements
// NIST measurement school, density at 20°C: https://www.nist.gov/system/files/documents/iaao/Mass_Francisco-Garcia.pdf
const MATERIALS=Object.freeze([
 {id:'water',rho:0.998,phase:'liquid',structure:'liquid',condition:'20°C',labels:['Víz','Wasser','Water'],color:'#58c5f5'},
 {id:'ice',rho:0.917,phase:'solid',structure:'ice',condition:'0°C',labels:['Jég','Eis','Ice'],color:'#b6e9fa'},
 {id:'air',rho:0.00120,phase:'gas',structure:'gas',condition:'20°C, 1 atm',labels:['Száraz levegő','Trockene Luft','Dry air'],color:'#97bbec'},
 {id:'ethanol',rho:0.789,phase:'liquid',structure:'liquid',condition:'20°C',labels:['Etanol','Ethanol','Ethanol'],color:'#ae9af2'},
 {id:'aluminum',rho:2.70,phase:'solid',structure:'fcc',condition:'20°C',labels:['Alumínium','Aluminium','Aluminium'],color:'#c8d2df'},
 {id:'iron',rho:7.87,phase:'solid',structure:'bcc',condition:'20°C',labels:['Vas','Eisen','Iron'],color:'#b9a19a'},
 {id:'copper',rho:8.96,phase:'solid',structure:'fcc',condition:'20°C',labels:['Réz','Kupfer','Copper'],color:'#ee9d70'},
 {id:'gold',rho:19.30,phase:'solid',structure:'fcc',condition:'20°C',labels:['Arany','Gold','Gold'],color:'#f5d66c'},
 {id:'salt',rho:2.16,phase:'solid',structure:'ionic',condition:'20°C',labels:['Kősó (NaCl)','Steinsalz (NaCl)','Rock salt (NaCl)'],color:'#d0e8ff'},
 {id:'wood',rho:0.50,phase:'solid',structure:'porous',condition:'száraz, változó / trocken, variabel / dry, variable',labels:['Fenyőfa (példa)','Kiefernholz (Beispiel)','Pine wood (example)'],color:'#c6a078'}
]);
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
  let seed=id==='air'?47:id==='water'?183:701;
  const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const count=m.phase==='gas'?26:85;
  for(let i=0;i<count;i++)add(.08+.84*rand(),.08+.84*rand(),.08+.84*rand(),i%4===0?1:0);
 }
 return out;
}
return Object.freeze({MATERIALS,material,compute,dimensions,particles,waterResult});
});
