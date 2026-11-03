const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../assets/js/acid-base.js'),'utf8');
const split=source.indexOf("\n(function(){\n'use strict';if(typeof document");
assert(split>0,'missing UI module');
const engine={exports:{}};vm.runInNewContext(source.slice(0,split),{module:engine});
class Mock{
 constructor(id){this.id=id;this.value='';this.textContent='';this.options=[];this.style={};this.dataset={};this.listeners={};this.classList={contains:()=>false,add(){},remove(){}};}
 addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}
 fire(k,val){if(val!==undefined)this.value=String(val);for(const fn of this.listeners[k]||[])fn({target:this})}
 replaceChildren(){this.options=[]}append(n){this.options.push(n)}
 getBoundingClientRect(){return{width:640}}
 setAttribute(k,v){this[k]=v}
 getContext(){return{setTransform(){},clearRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},fillText(){},arc(){},fill(){}}}
}
function mount(){
 const nodes={},el=id=>nodes[id]??(nodes[id]=new Mock(id));
 for(const [k,v] of Object.entries({abanalyte:'HCl',abtitrant:'NaOH',abindicator:'bromothymol',abanalyteM:'0.1',abtitrantM:'0.1',abvolume:'25',abadded:'0'}))el(k).value=v;
 const document={getElementById:el,createElement:k=>new Mock(k),querySelectorAll:()=>[]},window={AcidBaseEngine:engine.exports};
 vm.runInNewContext(source.slice(split),{document,window,devicePixelRatio:1,queueMicrotask:fn=>fn(),requestAnimationFrame:fn=>fn()});
 return el;
}
test('titration slider and +/- controls update calculation and visible colour',()=>{
 const $=mount(),c0=$('abLiquid').style.background;
 assert.match($('abPH').textContent,/1\.00/);
 $('abDosePlus').fire('click');assert.equal(Number($('abadded').value),1);
 $('abDoseSlider').fire('input','25');assert.equal(Number($('abadded').value),25);assert.match($('abPH').textContent,/7\.00/);
 assert.notEqual($('abLiquid').style.background,c0);assert.equal(Number($('abDoseSlider').value),25);
 $('abDoseMinus').fire('click');assert.equal(Number($('abadded').value),24);
 $('abDoseReset').fire('click');assert.equal(Number($('abadded').value),0);
});
test('switching to a base selects compatible acid titrant automatically',()=>{
 const $=mount();$('abanalyte').fire('input','NH3');
 assert.equal($('abtitrant').value,'HCl');assert.match($('abPH').textContent,/11\./);
 $('abEqButton').fire('click');assert.equal(Number($('abadded').value),25);
});
