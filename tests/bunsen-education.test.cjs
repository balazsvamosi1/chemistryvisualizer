const test=require('node:test');const assert=require('node:assert/strict');
const education=require('../assets/js/bunsen-education.js');
for(const level of education.levels){
 test('P2 '+level+': multilingual lessons and test bank',()=>{
  assert.equal(education.lesson[level].length,3);
  assert.equal(education.questions(level,true).length,6);
  assert.equal(education.questions(level,false).length,4);
  for(const lesson of education.lesson[level])for(const locale of ['hu','de','en'])assert(lesson[locale].length>30);
  for(const item of education.bank[level]){
   assert(Number.isInteger(item.answer)&&item.answer>=0&&item.answer<3);
   for(const locale of ['hu','de','en']){assert(item.q[locale]);assert.equal(item.choices[locale].length,3)}
  }
 });
 test('P2 '+level+': grade correct and incorrect submissions',()=>{
  const qs=education.questions(level,true);
  const right=education.grade(qs,qs.map(q=>q.answer));
  assert.deepEqual({correct:right.correct,total:right.total,percent:right.percent},{correct:6,total:6,percent:100});
  const wrong=education.grade(qs,qs.map(q=>(q.answer+1)%3));
  assert.equal(wrong.correct,0);assert.equal(wrong.percent,0);assert.equal(wrong.errors.length,6);
 });
}
