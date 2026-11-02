const test=require('node:test');const assert=require('node:assert/strict');
const education=require('../assets/js/bunsen-education.js');
for(const level of education.levels){
 test('P2 '+level+': multilingual lessons and test bank',()=>{
  assert.equal(education.lesson[level].length,6);
  assert.equal(education.questions(level,true,()=>0.42).length,10);
  assert.equal(education.questions(level,false,()=>0.42).length,6);
  for(const lesson of education.lesson[level])for(const locale of ['hu','de','en'])assert(lesson[locale].length>30);
  assert.equal(education.bank[level].length,16);
  for(const item of education.bank[level]){
   assert(Number.isInteger(item.answer)&&item.answer>=0&&item.answer<3);
   for(const locale of ['hu','de','en']){assert(item.q[locale]);assert.equal(item.choices[locale].length,3)}
  }
 });
 test('P2 '+level+': grade correct and incorrect submissions',()=>{
  const qs=education.questions(level,true,()=>0.42);
  const right=education.grade(qs,qs.map(q=>q.answer));
  assert.deepEqual({correct:right.correct,total:right.total,percent:right.percent},{correct:10,total:10,percent:100});
  const wrong=education.grade(qs,qs.map(q=>(q.answer+1)%3));
  assert.equal(wrong.correct,0);assert.equal(wrong.percent,0);assert.equal(wrong.errors.length,10);
 });
}

test('P2 randomization keeps question and answer meaning consistent across translations',()=>{
 const h=education.questions('upper',true,()=>0.12);
 const b=education.questions('upper',true,()=>0.81);
 assert.equal(h.length,10);
 assert.notDeepEqual(h.map(q=>q.q.hu+'|'+q.answer),b.map(q=>q.q.hu+'|'+q.answer));
 for(const item of h){assert.equal(item.choices.hu.length,3);assert.equal(item.choices.de.length,3);assert.equal(item.choices.en.length,3);
 assert(Number.isInteger(item.lessonIndex));assert(item.lessonIndex>=0&&item.lessonIndex<education.lesson.upper.length)}
});
