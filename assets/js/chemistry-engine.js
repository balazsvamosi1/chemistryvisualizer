/* Chemistry Lab educational geometry & valence engine. Copyright 2026 Chemistry Lab contributors.
   Apache-2.0. Not a quantum chemistry or thermodynamics solver. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.ChemistryEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const typical={H:1,C:4,N:3,O:2,F:1,Cl:1,Br:1,I:1};
 const valence={H:1,C:4,N:5,O:6,F:7,Cl:7,Br:7,I:7,P:5,S:6};
 const electronegativity={H:2.20,C:2.55,N:3.04,O:3.44,F:3.98,Cl:3.16,Br:2.96,I:2.66,S:2.58,P:2.19,Na:0.93,K:0.82,Mg:1.31,Ca:1.00,Fe:1.83,Cu:1.90};
 const metallic=new Set(['Li','Be','Na','Mg','Al','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Rb','Sr','Ag','Cd','In','Sn','Cs','Ba','Pt','Au','Hg','Pb']);
 const vec=(x,y,z)=>({x,y,z});
 function buildGraph(atoms,bonds){
  const ids=new Map(atoms.map((a,i)=>[a.id,i]));
  const adj=atoms.map(()=>[]);
  for(const b of bonds){let i=ids.get(b.a),j=ids.get(b.b);if(i===undefined||j===undefined||i===j)continue;
   adj[i].push({i:j,order:Number(b.order)||1,kind:b.kind||'covalent'});
   adj[j].push({i,order:Number(b.order)||1,kind:b.kind||'covalent'});
  }
  return adj;
 }
 function classifyBond(a,b,kind){
  if(kind==='ionic')return {type:'ionic',delta:null};
  if(kind==='metallic')return {type:'metallic',delta:null};
  if(metallic.has(a)&&metallic.has(b))return {type:'metallic',delta:null};
  if(metallic.has(a)!==metallic.has(b))return {type:'ionic-possible',delta:null};
  const ea=electronegativity[a],eb=electronegativity[b];
  if(ea===undefined||eb===undefined)return {type:'unknown',delta:null};
  const delta=Math.abs(ea-eb);return {type:delta<0.4?'nonpolar-covalent':'polar-covalent',delta:+delta.toFixed(2)};
 }
 function analyze(atoms,bonds){
  const adj=buildGraph(atoms,bonds),issues=[],centers=[];
  for(let i=0;i<atoms.length;i++){
    let symbol=atoms[i].s,connections=adj[i].filter(e=>e.kind==='covalent');
    let order=connections.reduce((n,e)=>n+e.order,0);
    let target=typical[symbol];
    let electrons=valence[symbol];
    let inferredLone=electrons===undefined?null:Math.max(0,Math.floor((electrons-order)/2));
    if(target!==undefined&&order>target)issues.push({code:'overbonded',index:i,element:symbol,order,target});
    if(target!==undefined&&order<target)issues.push({code:'unsaturated',index:i,element:symbol,missing:target-order});
    // Educational VSEPR: central atom + attached atoms + expected lone pairs.
    let domains=connections.length+(inferredLone||0);
    let geometry='unknown',angle=null;
    if(connections.length>=2){
      if(connections.length===2&&domains===2){geometry='linear';angle=180}
      else if(domains===3&&connections.length===3){geometry='trigonal-planar';angle=120}
      else if(domains===3&&connections.length===2){geometry='bent';angle=120}
      else if(domains===4&&connections.length===4){geometry='tetrahedral';angle=109.47}
      else if(domains===4&&connections.length===3){geometry='trigonal-pyramidal';angle=107}
      else if(domains===4&&connections.length===2){geometry='bent';angle=104.5}
    }
    if(connections.length>=2)centers.push({index:i,element:symbol,neighbors:connections.map(x=>x.i),geometry,approxAngle:angle,domains,lonePairs:inferredLone});
  }
  const edges=bonds.map(b=>{
    const a=atoms.find(a=>a.id===b.a),c=atoms.find(a=>a.id===b.b);
    return a&&c?{a:a.s,b:c.s,...classifyBond(a.s,c.s,b.kind),order:b.order||1}:null;
  }).filter(Boolean);
  const validity=issues.some(x=>x.code==='overbonded')?'invalid':issues.some(x=>x.code==='unsaturated')?'incomplete':'plausible';
  return {validity,issues,centers,edges,atoms:atoms.length,bonds:bonds.length};
 }
 function suggestedHydrogens(atoms,bonds){
  const adj=buildGraph(atoms,bonds),suggestions=[];
  atoms.forEach((a,i)=>{let target=typical[a.s];if(target===undefined||a.s==='H')return;
   const connections=adj[i]; if(connections.some(e=>e.kind!=='covalent'))return;
   const sum=connections.reduce((n,e)=>n+e.order,0);let missing=Math.max(0,target-sum);
   // Explicit opt-in and a narrow scope: ordinary neutral C/N/O/H examples only.
   if(['C','N','O'].includes(a.s)&&missing>0&&missing<=4)suggestions.push({id:a.id,count:missing});
  });return suggestions;
 }
 function referenceGeometry(atoms,bonds){
  const adj=buildGraph(atoms,bonds),n=atoms.length,center=adj.findIndex(x=>x.length===n-1);
  if(center<0||n>5)return null;
  const syms=atoms.map(a=>a.s),has=(s,q)=>syms.filter(x=>x===s).length===q;
  const r=atoms.map(()=>vec(0,0,0)),neighbors=adj[center].map(x=>x.i);
  if(n===3&&has('O',1)&&has('H',2)&&atoms[center].s==='O'){
   // Bent at 104.5° around oxygen.
   const half=104.5*Math.PI/360;
   r[neighbors[0]]=vec(-Math.sin(half),-Math.cos(half),0);
   r[neighbors[1]]=vec(Math.sin(half),-Math.cos(half),0);return r;
  }
  if(n===3&&has('C',1)&&has('O',2)&&atoms[center].s==='C'){
   r[neighbors[0]]=vec(-1.16,0,0);r[neighbors[1]]=vec(1.16,0,0);return r;
  }
  if(n===5&&has('C',1)&&has('H',4)&&atoms[center].s==='C'){
   [[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]].forEach((v,i)=>{r[neighbors[i]]=vec(...v.map(t=>t*.64))});return r;
  }
  if(n===4&&has('N',1)&&has('H',3)&&atoms[center].s==='N'){
   r[center]=vec(0,0,.35);
   neighbors.forEach((j,k)=>{let a=k*2*Math.PI/3;r[j]=vec(Math.cos(a)*.94,Math.sin(a)*.94,-.25)});return r;
  }
  return null;
 }
 return Object.freeze({analyze,suggestedHydrogens,referenceGeometry,classifyBond,buildGraph});
});
