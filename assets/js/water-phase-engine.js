/* Chemistry Lab 0.2116: water phase-change teaching model, pressure fixed at 1 atm.
 * No molecular dynamics or quantum simulation. Apache-2.0.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.ChemistryWaterPhaseEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const ATM=101325, R=8.314462618, M=18.01528, SAMPLE_G=100;
const LIQUID=[
 [0,.99984],[4,1],[20,.9982],[40,.9922],[60,.9832],[80,.9718],[99,.959]
];
function liquidDensity(t){
 if(t<=0)return LIQUID[0][1];
 if(t>=99)return LIQUID.at(-1)[1];
 for(let i=1;i<LIQUID.length;i++){
  if(t<=LIQUID[i][0]){
   const [a,da]=LIQUID[i-1],[b,db]=LIQUID[i];
   return da+(db-da)*(t-a)/(b-a);
  }
 }
 return LIQUID.at(-1)[1];
}
function vaporDensity(t){return M*ATM/(R*(t+273.15))/1e6;}
function phaseAt(temperature){
 if(!Number.isFinite(temperature)||temperature< -30||temperature>120)
  throw new RangeError('Temperature must be between -30 and 120 °C');
 const phase=temperature<0?'solid':temperature===0?'melting':temperature<100?'liquid':temperature===100?'boiling':'gas';
 const rho=phase==='solid'?.917:phase==='liquid'?liquidDensity(temperature):phase==='gas'?vaporDensity(temperature):null;
 return Object.freeze({
  temperature,phase,pressureAtm:1,density:Rho(rho),
  sampleMassGrams:SAMPLE_G,volumeCm3:rho===null?null:SAMPLE_G/rho,
  volumeLitres:rho===null?null:SAMPLE_G/rho/1000,
  freezingPoint:0,boilingPoint:100,
  coexistence:phase==='melting'||phase==='boiling',
  schematicMolecules:72
 });
}
function Rho(n){return n===null?null:Number(n.toPrecision(8));}
function halton(n,b){let f=1,v=0;while(n){f/=b;v+=f*(n%b);n=Math.floor(n/b);}return v;}
function molecules(phase,time=0){
 if(!['solid','liquid','gas','melting','boiling'].includes(phase))throw new RangeError('Unknown phase');
 return Array.from({length:72},(_,i)=>{
  let part=phase;
  if(phase==='melting')part=i<36?'solid':'liquid';
  if(phase==='boiling')part=i<36?'liquid':'gas';
  let x,y,z;
  if(part==='solid'){
   const a=i%4,b=Math.floor(i/4)%4,c=Math.floor(i/16);
   x=.13+a*.237+((b+c)%2)*.024;
   y=.13+b*.237;z=.12+c*.18;
   x+=Math.sin(time*.0018+i*2.15)*.0025;
   y+=Math.cos(time*.0015+i*1.51)*.0025;
  }else if(part==='liquid'){
   // closer together, mobile, irregular packing; never literal interatomic distances
   x=.2+.6*halton(i+7,2)+.018*Math.sin(time*.0018+i*2.3);
   y=.2+.6*halton(i+7,3)+.018*Math.cos(time*.002+i*1.7);
   z=.2+.6*halton(i+7,5)+.018*Math.sin(time*.0021+i*1.1);
  }else{
   const speed=time*.00009;
   x=.06+.88*((halton(i+7,2)+speed*(.65+(i%5)*.12))%1);
   y=.06+.88*((halton(i+7,3)+speed*(.5+(i%7)*.08))%1);
   z=.06+.88*((halton(i+7,5)+speed*(.55+(i%3)*.16))%1);
  }
  return {x,y,z,part};
 });
}
return Object.freeze({phaseAt,liquidDensity,vaporDensity,molecules,SAMPLE_G});
});
