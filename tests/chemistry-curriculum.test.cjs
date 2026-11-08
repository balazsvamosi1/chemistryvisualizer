const test=require('node:test');const assert=require('node:assert/strict');const academy=require('../assets/js/chemistry-curriculum.js');
const bun=require('../assets/js/bunsen-education.js');
test('academy has 13 topics including four ungraded density activities',()=>{
 assert.equal(academy.topics.length,13);
 assert.equal(academy.topics.reduce((n,t)=>n+t.lesson.length,0),49);
 assert.equal(academy.topics.reduce((n,t)=>n+t.bank.length,0),84);
 for(const level of bun.levels){
  const topic=academy.topics.find(x=>x.id==='bunsen-'+level);
  assert(topic);assert.equal(topic.lesson.length,6);assert.equal(topic.bank.length,16);
  for(const q of topic.bank)assert(q.lessonIndex>=0&&q.lessonIndex<topic.lesson.length);
 }
 for(const topic of academy.topics){
  for(const l of topic.lesson)for(const locale of academy.locales)assert(l[locale].length>30);
  for(const q of topic.bank)for(const locale of academy.locales){
   assert(q.q[locale].length>10);assert.equal(q.choices[locale].length,3);
  }
 }
});
test('academy grading preserves selected answer when choices shuffle',()=>{
 for(const topic of academy.topics){
  if(topic.id==='density')continue;
  const set=academy.session(topic.id,true,()=>.26);
  assert.equal(set.length,topic.id.startsWith('bunsen-')?10:4);
  assert.equal(academy.grade(set,set.map(q=>q.answer)).percent,100);
  assert.equal(academy.grade(set,set.map(q=>(q.answer+1)%3)).percent,0);
  for(const q of set){
   const original=topic.bank.find(x=>x.id===q.id);
   for(const locale of academy.locales)assert.equal(q.choices[locale][q.answer],original.choices[locale][original.answer]);
  }
 }
});
test('full exam covers all topics in 14 questions and randomizes order',()=>{
 const a=academy.session('all',true,()=>.16),b=academy.session('all',true,()=>.83);
 assert.equal(a.length,14);assert.equal(b.length,14);
 assert.notDeepEqual(a.map(q=>q.id+'-'+q.answer),b.map(q=>q.id+'-'+q.answer));
 assert.equal(new Set(a.map(q=>q.topic)).size,12);assert(!a.some(q=>q.topic==='density'));
 for(const q of a)assert(academy.topics.some(t=>t.id===q.topic&&t.lesson[q.lessonIndex]));
});
test('individual practice includes six Bunsen items or three other items',()=>{
 for(const topic of academy.topics){
  if(topic.id==='density')continue;
  const set=academy.session(topic.id,false,()=>.73);
  assert.equal(set.length,topic.id.startsWith('bunsen-')?6:3);
  for(const q of set)for(const locale of academy.locales)assert(q.choices[locale][q.answer]);
 }
});

test('density lessons are educational discovery activities, never part of graded question sets',()=>{
 const density=academy.topics.find(x=>x.id==='density');
 assert(density);
 assert.equal(density.tab,'densityTab');
 assert.equal(density.lesson.length,4);
 assert.equal(density.bank.length,0);
 assert.equal(academy.densityActivities.length,4);
 for(const [index,activity] of academy.densityActivities.entries()){
  assert.equal(typeof activity.scenario.quantity,'number');
  assert(['mass','volume'].includes(activity.scenario.mode));
  assert(['cube','cuboid'].includes(activity.scenario.shape));
  for(const language of academy.locales){
   assert(density.lesson[index][language].length>50,language);
   assert(activity.prompt[language].length>35,language);
   assert(activity.explanation[language].length>60,language);
  }
 }
 assert.deepEqual(academy.session('density',false),[]);
 assert.deepEqual(academy.session('density',true),[]);
 assert(!academy.session('all',true,()=>.2).some(q=>q.topic==='density'));
});
