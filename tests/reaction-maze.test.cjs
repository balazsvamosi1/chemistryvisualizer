const test=require('node:test');
const assert=require('node:assert/strict');
const G=require('../assets/js/reaction-maze-core.js');
const reachable=s=>{const q=[[1,1]],seen=new Set(['1,1']);for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){const k=a+','+b;if(a>0&&a<G.W&&b>0&&b<G.H&&s.grid[b][a]==='.'&&!seen.has(k)){seen.add(k);q.push([a,b]);}}}return seen;};
for(let level=0;level<6;level++)test('stage '+(level+1)+' includes reachable generator and exit',()=>{
 const s=G.createLevel(level),seen=reachable(s);
 assert.ok(seen.has(s.gen.x+','+s.gen.y));
 assert.ok(seen.has(s.exit.x+','+s.exit.y));
 assert.ok(s.atoms.length>0);
 assert.equal(s.enemies.length,G.STAGES[level].count);
});
test('wrong answer permanently removes the atom and grants no inventory',()=>{
 const s=G.createLevel(0),atom=s.atoms[0];s.player.x=atom.x;s.player.y=atom.y;
 const pending=G.collect(s);assert.ok(pending);
 assert.equal(s.atoms.some(a=>a.id===atom.id),false);
 const result=G.answer(s,(pending.question[4]+1)%4);
 assert.equal(result.ok,false);assert.equal(s.inv[atom.sym]||0,0);
 assert.equal(s.stats.missed,1);assert.equal(s.pending,null);
 assert.equal(G.collect(s),null);
});
test('correct first answer earns one atom',()=>{
 const s=G.createLevel(0),atom=s.atoms[0];s.player.x=atom.x;s.player.y=atom.y;
 const pending=G.collect(s);const result=G.answer(s,pending.question[4]);
 assert.equal(result.ok,true);assert.equal(s.inv[atom.sym],1);assert.equal(s.stats.correct,1);
});
test('correct H2O recipe consumes 2 H + 1 O only',()=>{
 const s=G.createLevel(0);s.inv.H=2;s.inv.O=1;s.inv.C=1;
 assert.equal(G.craft(s,'H2O'),'ok');assert.equal(s.ammo.H2O,1);
 assert.equal(s.inv.H,0);assert.equal(s.inv.O,0);assert.equal(s.inv.C,1);
});
test('recipe cannot craft without all atoms',()=>{
 const s=G.createLevel(0);s.inv.H=1;s.inv.O=1;assert.equal(G.craft(s,'H2O'),'missing');
});
test('later recipes locked until their stage',()=>assert.equal(G.craft(G.createLevel(0),'CO2'),'locked'));
test('fictional activator required for stage five, no real thermite recipe included',()=>{
 const s=G.createLevel(4);s.inv.Al=2;
 assert.equal(G.craft(s,'AL'),'activator');s.inv.ACT=1;assert.equal(G.craft(s,'AL'),'ok');
});
test('K2S is 2 potassium plus 1 sulfur',()=>{
 assert.deepEqual(G.RECIPES[5].atoms,{K:2,S:1});
});
test('blast stops at solid wall',()=>{
 const s=G.createLevel(0);s.grid[5][5]='.';s.grid[5][6]='#';
 const cells=G.beam(s,{x:5,y:5}).cells;
 assert.ok(!cells.some(c=>c.x===6&&c.y===5));
});
test('time bomb hits player standing on own charge',()=>{
 const s=G.createLevel(0);s.ammo.H2O=1;assert.equal(G.place(s,'H2O'),'ok');
 for(let i=0;i<40;i++)G.tick(s,.08);
 assert.equal(s.player.hp,2);assert.equal(s.stats.detonations,1);
});
test('correct recipe eliminates the matching anomaly',()=>{
 const s=G.createLevel(0),enemy=s.enemies[0];
 s.player.x=enemy.x;s.player.y=enemy.y;s.bombs=[{x:enemy.x,y:enemy.y,recipe:'H2O',fuse:0}];
 G.tick(s,.08);assert.equal(enemy.alive,false);
});
test('wrong recipe does not eliminate enemy',()=>{
 const s=G.createLevel(1),enemy=s.enemies[0];
 s.bombs=[{x:enemy.x,y:enemy.y,recipe:'H2O',fuse:0}];
 G.tick(s,.08);assert.equal(enemy.alive,true);assert.ok(enemy.boost>0);
});
test('explosion triggers second bomb immediately by chain reaction',()=>{
 const s=G.createLevel(0);s.grid[1][2]='.';
 s.bombs=[{x:1,y:1,recipe:'H2O',fuse:0},{x:2,y:1,recipe:'H2O',fuse:20}];
 G.tick(s,.08);assert.equal(s.bombs.length,0);assert.equal(s.stats.detonations,2);
});
test('completed stage requires enemy defeat and reaching exit',()=>{
 const s=G.createLevel(0);s.player.x=s.exit.x;s.player.y=s.exit.y;
 assert.equal(G.finish(s),false);s.enemies.forEach(e=>e.alive=false);
 assert.equal(G.finish(s),true);
});
test('ion generator periodically replaces scarce atoms',()=>{
 const s=G.createLevel(0);s.atoms=[];s.generatorTimer=.01;
 G.tick(s,.08);assert.ok(s.atoms.length>0);
});
test('inventory caps at 12 entries',()=>{
 const s=G.createLevel(0);s.inv.H=12;
 const atom=s.atoms[0];s.player.x=atom.x;s.player.y=atom.y;
 assert.equal(G.collect(s),null);assert.ok(s.atoms.some(a=>a.id===atom.id));
});
test('purging unwanted atom returns capacity',()=>{
 const s=G.createLevel(0);s.inv.Na=2;
 assert.equal(G.purge(s,'Na'),true);assert.equal(s.inv.Na,1);
});

test('H2O discharge leaves temporary harmless wet tiles',()=>{
 const s=G.createLevel(0);
 s.bombs=[{x:s.player.x,y:s.player.y,recipe:'H2O',fuse:0}];
 G.tick(s,.08);
 assert.ok(s.hazards.some(h=>h.type==='wet'));
 const hp=s.player.hp;G.tick(s,.08);assert.equal(s.player.hp,hp);
});
test('purging sodium on wet tile causes an adverse reaction',()=>{
 const s=G.createLevel(0);s.inv.Na=1;
 s.hazards=[{x:s.player.x,y:s.player.y,type:'wet',ttl:2}];
 assert.equal(G.purge(s,'Na'),true);assert.equal(s.player.hp,2);
});
test('rust colossus collision is lethal',()=>{
 const s=G.createLevel(4),e=s.enemies[0];
 s.player.x=e.x;s.player.y=e.y;
 G.tick(s,.08);assert.equal(s.failed,true);assert.equal(s.player.hp,0);
});
