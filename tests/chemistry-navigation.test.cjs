const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../assets/js/chemistry-navigation.js'),'utf8');
class Element{
 constructor(id=''){this.id=id;this.textContent=id;this.listeners={};this.dataset={};this.set=new Set(['hidden']);this.classList={add:k=>this.set.add(k),remove:k=>this.set.delete(k),contains:k=>this.set.has(k),toggle:(k,on)=>{if(on===undefined)on=!this.set.has(k);on?this.set.add(k):this.set.delete(k);return on}}}
 addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}
 click(){for(const cb of this.listeners.click||[])cb({target:this})}
 append(...values){this.children=(this.children||[]).concat(values)}
 getAttribute(name){return this.id==='reactionTab'&&name==='style'?'display:none!important':null}
 setAttribute(){}
 scrollIntoView(){}
}
test('Bunsen and other laboratories never remain simultaneously visible',()=>{
 const panels={homeTab:'homeSection',periodTab:'periodSection',moleculeTab:'moleculeSection',reactionTab:'reactionSection',huntTab:'huntSection',materialsTab:'materialsSection',densityTab:'densitySection',bunsenTab:'bunsenSection',stoichTab:'stoichSection',acidBaseTab:'acidBaseSection',physicsTab:'physicsSection',specTab:'specSection',curriculumTab:'curriculumSection',gameTab:'gameSection'};
 const nodes={};for(const [k,v] of Object.entries(panels)){nodes[k]=new Element(k);nodes[v]=new Element(v)}nodes.atomDetail=new Element('atomDetail');for(const l of ['hu','de','en'])nodes[l]=new Element(l);
 let footer;
 const document={getElementById:id=>nodes[id]||null,createElement:()=>new Element(),querySelector:()=>null,body:{append:el=>footer=el},addEventListener:()=>{}};
 const window={};vm.runInNewContext(source,{document,window,queueMicrotask:fn=>fn(),requestAnimationFrame:fn=>fn()});
 assert.equal(nodes.homeSection.classList.contains('hidden'),false);
 assert.equal(nodes.periodSection.classList.contains('hidden'),true);
 for(const tab of ['homeTab','bunsenTab','acidBaseTab','densityTab','curriculumTab','gameTab','periodTab']){
  nodes[tab].click();
  const visible=Object.values(panels).filter(section=>!nodes[section].classList.contains('hidden'));
  assert.deepEqual(visible,tab==='moleculeTab'?[panels.moleculeTab,panels.reactionTab]:[panels[tab]]);
 }
 assert(footer);assert.equal(footer.children.length,3);
});
