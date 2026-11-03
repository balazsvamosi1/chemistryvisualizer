const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const file = p => fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const html = file('index.html');
const curriculum = file('assets/js/chemistry-curriculum.js');
const navigation = file('assets/js/chemistry-navigation.js');
const app = file('assets/js/app-core.js');

test('Element Hunt is an Academy activity, not a top-level tab',()=>{
  assert.match(html, /id="huntTab" style="display:none!important"/);
  assert.match(html, /id="curriculumhunt" type="button"/);
  assert.match(curriculum, /sec\.append\(hunt\)/);
  assert.match(navigation, /id==='huntTab'&&panel\.parentElement\?\.id==='curriculumSection'/);
});

test('Academy makes Hunt selectable and restores normal lesson content',()=>{
  assert.match(curriculum, /\['learn','practice','exam','hunt'\]/);
  assert.match(curriculum, /if\(mode==='hunt'\)\{content\.hidden=true/);
  assert.match(curriculum, /content\.hidden=false/);
  assert.match(curriculum, /if\(id==='huntSection'\)\{mode='hunt';reset\(\);return\}/);
});

test('Hunt preserves old engine and scores',()=>{
  assert.match(app, /let huntIndex=0,huntScore=0,huntAnswered=false/);
  assert.match(app, /function nextHunt\(\)/);
  assert.match(app, /if\(ok\)huntScore\+\+/);
});

test('Hunt has an English question and feedback instead of German fallback',()=>{
  assert.match(app, /Which element has atomic number 8\?/);
  assert.match(app, /lang==='en'\?2:1/);
  assert.match(app, /Correct answers:/);
  assert.match(app, /No time limit\. Choose an answer!/);
});
