const test=require('node:test');const assert=require('node:assert/strict');const academy=require('../assets/js/chemistry-curriculum.js');
test('ten cross-lab topics and 30 lessons with trilingual descriptions',()=>{
 assert.equal(academy.topics.length,10);
 for(const topic of academy.topics){assert.equal(topic.lesson.length,3);assert.equal(topic.bank.length,4);
  for(const lesson of topic.lesson)for(const locale of academy.locales)assert(lesson[locale].length>40);
  for(const q of topic.bank){assert(q.lessonIndex>=0&&q.lessonIndex<topic.lesson.length);for(const locale of academy.locales){assert(q.q[locale].length>10);assert.equal(q.choices[locale].length,3)}}
 }
});
test('grade uses randomized answer positions correctly in all topics',()=>{
 for(const topic of academy.topics){const qs=academy.session(topic.id,true,()=>.26);
 assert.equal(qs.length,4);assert.equal(academy.grade(qs,qs.map(q=>q.answer)).percent,100);
 assert.equal(academy.grade(qs,qs.map(q=>(q.answer+1)%3)).percent,0)}
});
test('cross-topic exams sample 12 questions and preserve lesson targets',()=>{
 const a=academy.session('all',true,()=>.16),b=academy.session('all',true,()=>.83);
 assert.equal(a.length,12);assert.equal(b.length,12);assert.notDeepEqual(a.map(q=>q.id+'-'+q.answer),b.map(q=>q.id+'-'+q.answer));
 for(const q of a)assert(academy.topics.some(t=>t.id===q.topic&&t.lesson[q.lessonIndex]));assert.equal(new Set(a.map(q=>q.topic)).size,10);
});
test('individual practice selects three questions with localized matching answers',()=>{
 for(const topic of academy.topics){const questions=academy.session(topic.id,false,()=>.73);assert.equal(questions.length,3);
 for(const q of questions)for(const locale of academy.locales)assert(q.choices[locale][q.answer]);}
});
