const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const index=read('index.html'),nav=read('assets/js/chemistry-navigation.js'),ui=read('assets/js/reaction-maze.js');
test('second game is separate and original Chemistry Quest remains',()=>{
 assert.match(index,/id="gameTab"/);
 assert.match(index,/id="gameSection"/);
 assert.match(index,/id="mazeTab"/);
 assert.match(index,/id="mazeSection"/);
 assert.match(nav,/gameTab:'gameSection',mazeTab:'mazeSection'/);
});
test('all linked maze assets exist',()=>{
 for(const file of ['assets/css/reaction-maze.css','assets/js/reaction-maze-core.js','assets/js/reaction-maze.js']){
  assert.ok(fs.existsSync(path.resolve(__dirname,'..',file)));
  assert.ok(index.includes(file));
 }
});
test('canvas quiz, crafting, restart and mobile controls are wired',()=>{
 for(const id of ['mazeCanvas','mazeQuiz','mazeRecipe','mazeCraft','mazePlace','mazeStart','mazeNext','mazeUp','mazeDown','mazeLeft','mazeRight','mazePurge','mazePurgeAtom']){
  assert.ok(index.includes('id="'+id+'"'),id);
 }
 assert.match(ui,/G\.answer\(state,i\)/);
 assert.match(ui,/G\.craft\(state,selected\)/);
 assert.match(ui,/G\.place\(state,selected\)/);
 assert.match(ui,/requestAnimationFrame\(frame\)/);
});
test('maze uses no external dependency or CDN',()=>{
 assert.doesNotMatch(read('assets/js/reaction-maze-core.js'),/https?:\/\/|importScripts\(/);
});
