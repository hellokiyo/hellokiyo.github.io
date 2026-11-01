const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const core=require('../assets/network/core.js');
const context={window:{}};vm.createContext(context);
for(const file of ['study-data','questions','latest-paper'])vm.runInContext(fs.readFileSync(`assets/network/${file}.js`,'utf8'),context);
const {LATEST_PAPER:p,STUDY_QUESTIONS:base,STUDY_DATA:data}=context.window;
const all=[...base,...p.questions];
test('최신 회차는 확인한 원문만 제공하고 미확인 지문을 제외한다',()=>{
 assert.equal(base.length,72);assert.equal(p.questions.length,47);
 assert.deepEqual(Array.from(p.pendingNumbers),[23,28,39]);
 const numbers=p.questions.map(q=>q.number);
 for(let n=1;n<=50;n++)assert.equal(numbers.includes(n),![23,28,39].includes(n));
 for(const q of p.questions){assert.equal(q.options.length,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.explanation.length>10);}
 assert.ok(p.questions[1].question.includes('최대 유효 홉 수는 15'));
 assert.equal(new Set(all.map(q=>q.id)).size,all.length);
 assert.match(p.answerStatus,/공식 정답표 미확인/);
});
test('최신 회차 진행·답안·오답·완료 기록이 새로고침 후에도 복원된다',()=>{
 const ids=p.questions.map(q=>q.id),id=ids[8];
 const session={mode:'paper',ids,index:8,answers:{[id]:1},checked:[id],startedAt:123};
 const state=core.cleanState({session,wrong:[id],lastResult:{...session,finishedAt:456},records:[{mode:'paper',correct:30,total:47,score:64,at:'2026-11-01T00:00:00Z'}]},data,all);
 assert.equal(state.session.mode,'paper');assert.deepEqual(Array.from(state.session.ids),Array.from(ids));
 assert.equal(state.session.index,8);assert.equal(state.session.answers[id],1);
 assert.deepEqual(state.session.checked,[id]);assert.deepEqual(state.wrong,[id]);
 assert.equal(state.lastResult.finishedAt,456);assert.equal(state.records[0].mode,'paper');
});
