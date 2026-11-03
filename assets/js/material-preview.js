/* Chemistry Lab — interactive educational 2D structural previews.
   Original Apache-2.0; no runtime dependencies; never implies quantum-accurate geometry. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.ChemistryMaterialPreview=api;
})(typeof window!=='undefined'?window:null,function(){
'use strict';
const NS='http://www.w3.org/2000/svg';
const ui={
 hu:{preview:'Interaktív szerkezeti előnézet',hint:'Húzd az ábrát az eltoláshoz, görgővel nagyíthatsz. A szerkezet 2D, sematikus.',zoomIn:'Nagyítás',zoomOut:'Kicsinyítés',reset:'Alaphelyzet',unavailable:'Ehhez az anyaghoz még nincs szerkezeti modell.'},
 de:{preview:'Interaktive Strukturvorschau',hint:'Ziehen zum Verschieben, Mausrad zum Zoomen. Schematisches 2D-Modell.',zoomIn:'Vergrößern',zoomOut:'Verkleinern',reset:'Ansicht zurücksetzen',unavailable:'Für diesen Stoff gibt es noch kein Strukturmodell.'},
 en:{preview:'Interactive structure preview',hint:'Drag to pan, scroll to zoom. Schematic 2D structure.',zoomIn:'Zoom in',zoomOut:'Zoom out',reset:'Reset view',unavailable:'No structural model available for this material yet.'}
};
const colors={H:'#dbe7f2',C:'#45586c',N:'#4c99df',O:'#e36a6a',S:'#dfbd51',P:'#e5a764',Cl:'#72c878',F:'#67c8b3',Br:'#b77b68',I:'#a87be2',Na:'#917edb',K:'#977fdf',Ca:'#98b8bd',Mg:'#95b4d6',Fe:'#b3a19a',Cu:'#d59a68',Au:'#e2c45e',Ag:'#cad0de',Si:'#b5af96'};
function valid(model){
 return !!model&&Array.isArray(model.atoms)&&model.atoms.length>0&&model.atoms.length<=250&&
 model.atoms.every(a=>Array.isArray(a)&&typeof a[0]==='string'&&a.length>=3&&Number.isFinite(Number(a[1]))&&Number.isFinite(Number(a[2])))&&
 Array.isArray(model.edges)&&model.edges.every(e=>Array.isArray(e)&&Number.isInteger(Number(e[0]))&&Number.isInteger(Number(e[1]))&&
 Number(e[0])>=0&&Number(e[1])>=0&&Number(e[0])<model.atoms.length&&Number(e[1])<model.atoms.length);
}
function geometry(model){
 if(!valid(model))return null;
 const xs=model.atoms.map(a=>Number(a[1])),ys=model.atoms.map(a=>Number(a[2]));
 const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const w=Math.max(1,maxX-minX),h=Math.max(1,maxY-minY),span=Math.max(w,h,95);
 const scale=Math.min(480/(w+20),245/(h+20),2.6);
 const atoms=model.atoms.map(a=>({symbol:a[0],x:(Number(a[1])-(minX+maxX)/2)*scale+300,y:(Number(a[2])-(minY+maxY)/2)*scale+145}));
 return {atoms,edges:model.edges.map(e=>({a:Number(e[0]),b:Number(e[1]),order:Math.max(1,Math.min(3,Number(e[2])||1))})),span};
}
function make(tag,attributes={},content){
 const node=document.createElementNS(NS,tag);
 for(const [key,value] of Object.entries(attributes))node.setAttribute(key,String(value));
 if(content!==undefined)node.textContent=content;
 return node;
}
function render(host,model,locale='hu',options={}){
 const l=ui[locale]||ui.hu,g=geometry(model);
 const frame=document.createElement('div');frame.className='material-2d-viewer';host.append(frame);
 if(options.title!==false){const title=document.createElement('strong');title.textContent=options.label||l.preview;frame.append(title)}
 if(!g){const notice=document.createElement('p');notice.textContent=l.unavailable;frame.append(notice);return {available:false,frame}}
 const svg=make('svg',{viewBox:'0 0 600 290',role:'img','aria-label':options.label||l.preview,tabindex:'0'});
 svg.classList.add('material-structure-svg');
 const stage=make('g');svg.append(stage);
 const bg=make('rect',{x:'0',y:'0',width:'600',height:'290',fill:'transparent'});stage.append(bg);
 for(const edge of g.edges){
  const a=g.atoms[edge.a],b=g.atoms[edge.b],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;
  const nx=-dy/d*5,ny=dx/d*5;
  const offsets=edge.order===1?[0]:edge.order===2?[-1,1]:[-1,0,1];
  for(const offset of offsets)stage.append(make('line',{x1:a.x+nx*offset,y1:a.y+ny*offset,x2:b.x+nx*offset,y2:b.y+ny*offset,stroke:'#a9c8d8','stroke-width':2.4,'stroke-linecap':'round'}));
 }
 for(const atom of g.atoms){
  const circle=make('circle',{cx:atom.x,cy:atom.y,r:15,fill:colors[atom.symbol]||'#91aecc',stroke:'#e1f2fb','stroke-width':1.5});
  const label=make('text',{x:atom.x,y:atom.y+5,'text-anchor':'middle','font-family':'system-ui,sans-serif','font-size':atom.symbol.length>1?12:14,'font-weight':'700',fill:atom.symbol==='H'?'#26394c':'#112334'},atom.symbol);
  stage.append(circle,label);
 }
 frame.append(svg);
 const controls=document.createElement('div');controls.className='material-preview-controls';
 let scale=1,panX=0,panY=0,drag=null;
 const apply=()=>stage.setAttribute('transform',`translate(${panX} ${panY}) translate(300 145) scale(${scale}) translate(-300 -145)`);
 const zoom=direction=>{scale=Math.max(.55,Math.min(4,scale*direction));apply()};
 const addButton=(label,action,icon)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',label);button.textContent=icon;button.addEventListener('click',action);controls.append(button)};
 addButton(l.zoomOut,()=>zoom(.8),'−');
 addButton(l.reset,()=>{scale=1;panX=0;panY=0;apply()},'↺');
 addButton(l.zoomIn,()=>zoom(1.25),'+');
 frame.append(controls);
 const hint=document.createElement('small');hint.textContent=l.hint;frame.append(hint);
 svg.style.touchAction='none';
 svg.addEventListener('pointerdown',event=>{if(event.button!==0&&event.pointerType==='mouse')return;drag={id:event.pointerId,x:event.clientX,y:event.clientY};svg.setPointerCapture?.(event.pointerId)});
 svg.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const bounds=svg.getBoundingClientRect();const k=bounds.width?600/bounds.width:1;panX+=(event.clientX-drag.x)*k;panY+=(event.clientY-drag.y)*k;drag.x=event.clientX;drag.y=event.clientY;apply()});
 const stop=event=>{if(drag&&drag.id===event.pointerId){drag=null;if(svg.hasPointerCapture?.(event.pointerId))svg.releasePointerCapture(event.pointerId)}};
 svg.addEventListener('pointerup',stop);svg.addEventListener('pointercancel',stop);
 svg.addEventListener('wheel',event=>{event.preventDefault();zoom(event.deltaY>0?.9:1.1)},{passive:false});
 svg.addEventListener('keydown',event=>{const deltas={ArrowLeft:[-14,0],ArrowRight:[14,0],ArrowUp:[0,-14],ArrowDown:[0,14]};if(event.key in deltas){event.preventDefault();panX+=deltas[event.key][0];panY+=deltas[event.key][1];apply()}else if(event.key==='+'||event.key==='='){event.preventDefault();zoom(1.25)}else if(event.key==='-'){event.preventDefault();zoom(.8)}else if(event.key==='Home'){event.preventDefault();scale=1;panX=panY=0;apply()}});
 return {available:true,frame,reset:()=>{scale=1;panX=panY=0;apply()}};
}
return Object.freeze({render,geometry,valid});
});
