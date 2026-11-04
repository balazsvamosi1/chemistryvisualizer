/* Regression tests: arcade map geometry, distant atom respawn, recoverable activator.
 * Original Apache-2.0 test code, static GitHub Pages compatible. */
const test=require('node:test'),assert=require('node:assert/strict');
const G=require('../assets/js/reaction-maze-core.js');
function reachable(s){const queue=[[1,1]],seen=new Set(['1,1']);for(let i=0;i<queue.length;i++){const [x,y]=queue[i];for(const [a,b] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){const k=a+','+b;if(a<1||a>=G.W-1||b<1||b>=G.H-1||s.grid[b][a]!=='.'||seen.has(k))continue;seen.add(k);queue.push([a,b]);}}return seen;}
function loops(s){let vertices=0,degrees=0,junctions=0;for(let y=1;y<G.H-1;y++)for(let x=1;x<G.W-1;x++){if(s.grid[y][x]!=='.')continue;vertices++;const degree=[[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([a,b])=>s.grid[b]?.[a]==='.').length;degrees+=degree;if(degree>=3)junctions++;}return{vertices,junctions,cycles:degrees/2-vertices+1};}
for(let level=0;level<6;level++){
 test('stage '+(level+1)+' is a connected arcade maze with loops and junctions',()=>{
  const s=G.createLevel(level),walk=reachable(s),m=loops(s);
  assert.ok(m.vertices>=100,'enough floor spaces');
  assert.ok(m.junctions>=15,'multiple strategic intersections');
  assert.ok(m.cycles>=8,'many alternate routes instead of tree-only maze');
  assert.equal(walk.size,m.vertices,'no isolated floor cells');
  assert.ok(walk.has(s.gen.x+','+s.gen.y));
  assert.ok(walk.has(s.exit.x+','+s.exit.y));
  for(const a of s.atoms)assert.ok(walk.has(a.x+','+a.y));
  for(const e of s.enemies)assert.ok(walk.has(e.x+','+e.y));
  if(s.activator)assert.ok(walk.has(s.activator.x+','+s.activator.y));
 });
}
test('a wrong first answer never awards its atom; it respawns on a different corridor after a delay',()=>{
 const s=G.createLevel(0,null,777),a=s.atoms[0],old={x:a.x,y:a.y,sym:a.sym};
 s.player.x=a.x;s.player.y=a.y;const pending=G.collect(s);
 assert.ok(pending);assert.equal(G.answer(s,(pending.question[4]+1)%4).ok,false);
 assert.equal(s.inv[a.sym]||0,0);assert.ok(!s.atoms.some(x=>x.id===a.id));
 assert.equal(s.atomRespawns.length,1);s.player.x=1;s.player.y=1;s.player.shield=100;
 const initialNextId=s.nextAtomId;
 for(let i=0;i<190;i++)G.tick(s,.08);
 const appeared=s.atoms.find(x=>x.id>=initialNextId&&x.sym===old.sym&&Math.abs(x.x-old.x)+Math.abs(x.y-old.y)>=5);
 assert.ok(appeared,'lost atom should spawn remotely instead of its old tile');
 assert.equal(s.atomRespawns.length,0);
});
test('correctly picked-up atoms also reappear in a new location, not immediately at the old spot',()=>{
 const s=G.createLevel(0,null,111),a=s.atoms[0],origin={x:a.x,y:a.y,sym:a.sym};
 s.player.x=a.x;s.player.y=a.y;const q=G.collect(s);
 assert.equal(G.answer(s,q.question[4]).ok,true);
 assert.equal(s.inv[a.sym],1);assert.equal(s.atomRespawns.length,1);
 s.player.x=1;s.player.y=1;s.player.shield=100;
 const id=s.nextAtomId;
 for(let i=0;i<190;i++)G.tick(s,.08);
 assert.ok(s.atoms.some(x=>x.id>=id&&x.sym===origin.sym&&Math.abs(x.x-origin.x)+Math.abs(x.y-origin.y)>=5));
});
test('generator distributes atoms onto distant free corridor tiles',()=>{
 const s=G.createLevel(0,null,33);s.atoms=[];s.generatorTimer=.01;
 G.tick(s,.08);
 assert.ok(s.atoms.length>=1);
 const a=s.atoms.at(-1);
 assert.ok(s.grid[a.y][a.x]==='.');
 assert.ok(Math.abs(a.x-s.gen.x)+Math.abs(a.y-s.gen.y)>=5);
 assert.ok(a.x!==s.player.x||a.y!==s.player.y);
});
test('stage five restores a wasted fictional activator at another reachable location',()=>{
 const s=G.createLevel(4,null,550),old={...s.activator};
 s.player.x=old.x;s.player.y=old.y;
 G.collect(s);assert.equal(s.inv.ACT,1);assert.equal(s.activator,null);
 s.inv.Al=2;assert.equal(G.craft(s,'AL'),'ok');
 s.player.x=1;s.player.y=1;s.player.shield=100;
 assert.equal(G.place(s,'AL'),'ok');
 // Force a harmless miss, keeping the enemy alive.
 s.bombs[0].fuse=0;G.tick(s,.08);
 assert.ok(s.enemies.some(e=>e.alive));
 for(let i=0;i<220;i++)G.tick(s,.08);
 assert.ok(s.activator,'another activator must appear after the missed charge');
 assert.ok(Math.abs(old.x-s.activator.x)+Math.abs(old.y-s.activator.y)>=5);
 assert.ok(reachable(s).has(s.activator.x+','+s.activator.y));
 s.player.x=s.activator.x;s.player.y=s.activator.y;
 G.collect(s);assert.equal(s.inv.ACT,1);
 s.inv.Al=2;assert.equal(G.craft(s,'AL'),'ok','player can craft a second charge without restarting the stage');
});
