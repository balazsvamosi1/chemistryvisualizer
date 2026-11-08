/* Chemistry Lab 0.2117 | 1 atm, classroom-focused phase comparison.
 * Source values near normal conditions: RSC element tables, PDG ethanol,
 * PubChem paraffin, Air Liquide CO2, and original water model.
 * These are pedagogical approximations, NOT a thermodynamic equation of state.
 * Apache-2.0. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.ChemistryPhaseCompareEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const P=101325,R=8.314462618, SAMPLE_MASS=100,MIN_T=-230,MAX_T=3200;
const definitions=[
 ['water',['Víz (H₂O)','Wasser (H₂O)','Water (H₂O)'],18.01528,0,100,.917,.9982,'molecular','#71c5ff'],
 ['ethanol',['Etanol','Ethanol','Ethanol'],46.06844,-114.1,78.29,.94,.7893,'molecular','#b6dbff'],
 ['mercury',['Higany (Hg)','Quecksilber (Hg)','Mercury (Hg)'],200.592,-38.829,356.619,14.2,13.5336,'metal','#a9bfd0'],
 ['aluminum',['Alumínium (Al)','Aluminium (Al)','Aluminium (Al)'],26.98154,660.323,2519,2.7,2.375,'metal','#c4d7e9'],
 ['iron',['Vas (Fe)','Eisen (Fe)','Iron (Fe)'],55.845,1538,2861,7.87,6.98,'metal','#b9bbcc'],
 ['lead',['Ólom (Pb)','Blei (Pb)','Lead (Pb)'],207.2,327.462,1749,11.34,10.66,'metal','#b1bac8'],
 ['oxygen',['Oxigén (O₂)','Sauerstoff (O₂)','Oxygen (O₂)'],31.998,-218.79,-182.962,1.426,1.141,'diatomic','#e5a9b0'],
 ['nitrogen',['Nitrogén (N₂)','Stickstoff (N₂)','Nitrogen (N₂)'],28.0134,-210,-195.795,1.026,.808,'diatomic','#a9b6ed'],
 ['carbonDioxide',['Szén-dioxid (CO₂)','Kohlendioxid (CO₂)','Carbon dioxide (CO₂)'],44.0095,null,null,1.56,null,'triatomic','#e5c3ab'],
 ['sulfur',['Kén (S)','Schwefel (S)','Sulfur (S)'],null,115.21,444.61,2.07,1.80,'variable','#e6d36f'],
 ['paraffin',['Paraffin (viasz)','Paraffinwachs','Paraffin wax'],null,null,null,.90,.77,'mixture','#e6d29c']
];
const MATERIALS=Object.freeze(definitions.map(([id,labels,molarMass,melt,boil,solidDensity,liquidDensity,structure,color])=>
 Object.freeze({
 id,labels:Object.freeze(labels),molarMass,melt,boil,solidDensity,liquidDensity,structure,color,
 sublimation:id==='carbonDioxide'?-78.5:null,
 meltingRange:id==='paraffin'?Object.freeze([47,65]):null,
 // Range of paraffin mixtures, not a fixed substance or single boiling point.
 stableLiquidTo:id==='paraffin'?330:null
 })));
const material=id=>MATERIALS.find(m=>m.id===id)||null;
const waterLiquid=[[0,.99984],[4,1],[20,.9982],[40,.9922],[60,.9832],[80,.9718],[99,.959]];
function interpolate(points,t){
 if(t<=points[0][0])return points[0][1];
 for(let i=1;i<points.length;i++)if(t<=points[i][0]){
  const [a,v]=points[i-1],[b,w]=points[i];
  return v+(w-v)*(t-a)/(b-a);
 }
 return points.at(-1)[1];
}
function gasDensity(molarMass,t){
 if(!(molarMass>0))return null; // variable sulphur vapour, mixed paraffin
 return P*molarMass/(R*(t+273.15)*1e6); // g/cm³; ideal gas only
}
function state(id,temperature){
 const m=material(id);
 if(!m)throw new RangeError('Unknown substance: '+id);
 if(!Number.isFinite(temperature)||temperature<MIN_T||temperature>MAX_T)
  throw new RangeError('Temperature outside supported −230…3200 °C range');
 let phase,transition=null;
 // Temperatures on the slider are whole numbers. Phase boundaries rounded
 // to the nearest degree for teaching, while metadata retains measured values.
 const near=(v)=>v!==null&&Math.abs(temperature-v)<=.5;
 if(m.sublimation!==null){
  phase=near(m.sublimation)?'subliming':temperature<m.sublimation?'solid':'gas';
  if(phase==='subliming')transition='sublimation';
 }else if(m.meltingRange){
  phase=temperature<m.meltingRange[0]?'solid':
    temperature<=m.meltingRange[1]?'softening':
    temperature<=m.stableLiquidTo?'liquid':'unmodeled';
  if(phase==='softening')transition='range';
 }else{
  const melt=Math.round(m.melt),boil=Math.round(m.boil);
  if(temperature===melt){phase='melting';transition='melting';}
  else if(temperature===boil){phase='boiling';transition='boiling';}
  else phase=temperature<melt?'solid':temperature<boil?'liquid':'gas';
 }
 let density=null;
 if(phase==='solid')density=m.solidDensity;
 if(phase==='liquid')density=m.id==='water'?interpolate(waterLiquid,temperature):m.liquidDensity;
 if(phase==='gas')density=gasDensity(m.molarMass,temperature);
 const volume=density===null?null:SAMPLE_MASS/density;
 return Object.freeze({
  id,temperature,material:m,phase,transition,density:density===null?null:Number(density.toPrecision(8)),
  volumeCm3:volume===null?null:Number(volume.toPrecision(9)),
  volumeLitres:volume===null?null:Number((volume/1000).toPrecision(9)),
  massGrams:SAMPLE_MASS,pressureAtm:1,
  meltingPoint:m.melt,boilingPoint:m.boil,sublimationPoint:m.sublimation,
  meltingRange:m.meltingRange,coexistence:['melting','boiling','subliming','softening'].includes(phase),
  schematicMolecules:72
 });
}
function compare(left,right,temperature){
 return Object.freeze({left:state(left,temperature),right:state(right,temperature),temperature});
}
function halton(n,b){let f=1,v=0;while(n){f/=b;v+=f*(n%b);n=Math.floor(n/b);}return v;}
function particles(sample,time=0){
 const phase=sample.phase,kind=sample.material.structure;
 const animate=phase==='solid'?.0035:phase==='liquid'?.017:phase==='gas'?.04:.007;
 // On two-phase boundaries the 50:50 drawing is ICONOGRAPHIC ONLY: the
 // phase fraction is unknown from temperature alone, and density stays null.
 return Array.from({length:72},(_,i)=>{
  let part=phase;
  if(phase==='melting'||phase==='softening')part=i<36?'solid':'liquid';
  else if(phase==='boiling'||phase==='subliming')part=i<36?(phase==='subliming'?'solid':'liquid'):'gas';
  else if(phase==='unmodeled')part='unknown';
  let x,y,z;
  if(part==='solid'){
   x=.12+(i%4)*.245;
   y=.12+(Math.floor(i/4)%4)*.245;
   z=.10+Math.floor(i/16)*.186;
   if(kind==='molecular')x+=Math.floor(i/16)%2*.015;
   x+=animate*Math.sin(time*.002+i*1.7);
  }else if(part==='liquid'){
   x=.18+.64*halton(i+11,2)+animate*Math.sin(time*.001+i*2);
   y=.18+.64*halton(i+11,3)+animate*Math.cos(time*.0015+i);
   z=.18+.64*halton(i+11,5);
  }else{
   x=.07+.86*((halton(i+11,2)+time*.000075*(.5+i%7*.07))%1);
   y=.07+.86*((halton(i+11,3)+time*.00006*(.4+i%5*.09))%1);
   z=.07+.86*((halton(i+11,5)+time*.000065*(.6+i%4*.08))%1);
  }
  return {x:Math.max(0,Math.min(1,x)),y:Math.max(0,Math.min(1,y)),z:Math.max(0,Math.min(1,z)),part,kind};
 });
}
const PRESETS=Object.freeze([
 Object.freeze({a:'water',b:'ethanol',t:20}),
 Object.freeze({a:'water',b:'mercury',t:20}),
 Object.freeze({a:'aluminum',b:'lead',t:400}),
 Object.freeze({a:'oxygen',b:'carbonDioxide',t:-100}),
 Object.freeze({a:'nitrogen',b:'oxygen',t:-200}),
 Object.freeze({a:'lead',b:'aluminum',t:660}),
 Object.freeze({a:'sulfur',b:'paraffin',t:60}),
 Object.freeze({a:'iron',b:'aluminum',t:1500})
]);
return Object.freeze({MATERIALS,PRESETS,material,state,compare,particles,gasDensity,MIN_T,MAX_T,SAMPLE_MASS});
});
