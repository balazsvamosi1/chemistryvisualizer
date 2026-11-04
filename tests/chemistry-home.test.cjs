const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const source=read('assets/js/chemistry-home.js');
function boot(){
 let language='hu',counter=0;
 const names=['homeTab','homeSection','hu','de','en','periodTab','moleculeTab','materialsTab','bunsenTab','stoichTab','acidBaseTab','curriculumTab','gameTab','mazeTab','physicsTab','specTab'];
 const nodes={};
 function element(id='new-'+counter++){
  return {id,textContent:'',className:'',children:[],listeners:{},type:'',classList:{contains(c){return c==='active'&&id===language;}},
   append(...values){this.children.push(...values)},replaceChildren(...values){this.children=[...values]},
   addEventListener(name,cb){(this.listeners[name]||=[]).push(cb)},
   click(){for(const cb of this.listeners.click||[])cb()},
   setAttribute(){}};
 }
 for(const id of names)nodes[id]=element(id);
 const routes=[];for(const id of names)if(id.endsWith('Tab'))nodes[id].click=()=>routes.push(id);
 const doc={getElementById:id=>nodes[id]||null,createElement:tag=>element(tag)};
 const win={ChemistryNavigation:{activate:id=>routes.push('nav:'+id)}};
 vm.runInNewContext(source,{document:doc,window:win,queueMicrotask:fn=>fn()});
 const walk=n=>[n,...n.children.flatMap(walk)];
 return {nodes,routes,walk,setLanguage(value){language=value;win.ChemistryHome.render();},win};
}
test('new home page is the initial view and is in the main navigation',()=>{
 const html=read('index.html'),nav=read('assets/js/chemistry-navigation.js');
 assert.match(html,/<button class="active" id="homeTab"/);
 assert.match(html,/id="homeSection"/);
 assert.match(html,/id="periodSection"/);
 assert.match(html,/assets\/js\/chemistry-home\.js\?v=0\.2105/);
 assert.match(html,/assets\/css\/chemistry-home\.css\?v=0\.2105/);
 assert.match(nav,/selected='homeTab'/);
 assert.match(nav,/homeTab:'homeSection'/);
});
test('home explains scope and limitations in all three languages',()=>{
 const {nodes,walk,setLanguage}=boot();
 const examples={hu:['Fedezd fel a kémiát!','Mire nem való?','Nem valódi laboratórium'],de:['Entdecke die Chemie!','Wofür ist es nicht gedacht?','Kein echtes Labor'],en:['Explore chemistry!','What is it not for?','Not a real laboratory']};
 for(const language of ['hu','de','en']){
  setLanguage(language);
  const txt=walk(nodes.homeSection).map(x=>x.textContent).join(' | ');
  for(const fragment of examples[language])assert(txt.includes(fragment),language+': '+fragment);
  assert.equal(walk(nodes.homeSection).filter(n=>n.className==='home-card').length,11);
 }
});
test('direct home buttons open their corresponding existing tabs',()=>{
 const {nodes,walk,routes}=boot();
 const buttons=walk(nodes.homeSection).filter(n=>n.className==='home-open');
 assert.equal(buttons.length,11);
 buttons.forEach(button=>button.click());
 const names=['periodTab','moleculeTab','materialsTab','bunsenTab','stoichTab','acidBaseTab','curriculumTab','gameTab','mazeTab','physicsTab','specTab'];
 assert.deepEqual(routes.filter(x=>x.endsWith('Tab')&&!x.startsWith('nav:')),names);
 assert.deepEqual(routes.filter(x=>x.startsWith('nav:')),names.map(x=>'nav:'+x));
});
