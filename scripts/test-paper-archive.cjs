const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const context={window:{}};vm.createContext(context);
for(const name of ['study-data','questions','latest-paper','past-papers','paper-archive'])vm.runInContext(fs.readFileSync(`assets/network/${name}.js`,'utf8'),context);
const w=context.window,A=w.PaperArchive.create(w.LATEST_PAPER,w.PAST_PAPERS),Q=[...w.STUDY_QUESTIONS,...A.papers.flatMap(p=>p.questions)],core=require('../assets/network/core.js');
test('최근 5개 연도·최신 회차 우선·개정 경계 및 누락 회차를 명시한다',()=>{
 assert.deepEqual(Array.from(A.years),[2026,2025,2024,2023,2022]);assert.equal(A.papers[0].id,'nw2-2026-04-a');assert.equal(A.papers.length,17);assert.equal(A.papers.flatMap(p=>p.questions).length,850);
 assert.equal(A.filter('2026').length,4);assert.equal(A.filter('2025').length,4);assert.equal(A.filter('all',true).length,6);assert.equal(A.filter('2024',true).length,0);
 assert.ok(A.get('nw2-2025-02').previousStandard);assert.ok(!A.get('nw2-2025-03').previousStandard);
 assert.equal(w.PENDING_PAPERS.length,3);assert.ok(w.PENDING_PAPERS.every(p=>/20240825|20230820|20220227/.test(p.title.replace(/\D/g,''))));
});
test('모든 회차의 50문항·보기·정답·원본·그림·ID 무결성',()=>{
 assert.equal(new Set(Q.map(q=>q.id)).size,Q.length);
 for(const p of A.papers){assert.equal(p.questions.length,50,p.id);assert.ok(fs.existsSync(p.original));assert.deepEqual(Array.from(p.questions,q=>q.number),Array.from({length:50},(_,i)=>i+1));
  for(const q of p.questions){assert.equal(q.options.length,4);assert.ok(q.options.every(o=>o.length>0));assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert.ok(q.question.length>5);assert.ok(!/[❶❷❸❹]/.test(q.question+q.options.join('')));for(const im of q.images||[])assert.ok(fs.existsSync(im),im);}
 }
 const audit=JSON.parse(fs.readFileSync('audits/paper-import.json','utf8'));assert.equal(audit.length,16);for(const row of audit){assert.equal(row.questions,50);assert.equal(row.answerTableMatched,true);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(row.sourceFile)).digest('hex'),row.sha256);}
 const cached=JSON.parse(fs.readFileSync('sw.js','utf8').match(/const PAPER_FILES=(\[[^;]+\]);/)[1]);for(const p of w.PAST_PAPERS){assert.ok(cached.includes(p.original));for(const q of p.questions)for(const im of q.images)assert.ok(cached.includes(im));}
});
test('이전 회차의 답안·오답·결과·회차명이 재실행·내보내기 후 유지된다',()=>{
 const p=A.get('nw2-2025-03'),ids=Array.from(p.questions,q=>q.id),id=ids[23],s={mode:'paper',paperId:p.id,ids,index:23,answers:{[id]:1},checked:[id],startedAt:123};
 const data=core.cleanState(JSON.parse(JSON.stringify({session:s,lastResult:{...s,finishedAt:456},wrong:[id],records:[{mode:'paper',paperId:p.id,score:80,correct:40,total:50,at:'2026-11-03T00:00:00Z'}]})),w.STUDY_DATA,Q);
 assert.equal(data.session.paperId,p.id);assert.equal(data.session.index,23);assert.equal(data.session.answers[id],1);assert.equal(data.lastResult.paperId,p.id);assert.equal(data.records[0].paperId,p.id);assert.deepEqual(data.wrong,[id]);assert.equal(A.forIds(data.session.ids).id,p.id);
 // Existing latest-paper sessions did not store paperId; IDs still identify them.
 assert.equal(A.forIds([w.LATEST_PAPER.questions[0].id]).id,w.LATEST_PAPER.id);
});
test('핵심정리 우선순위와 바로가기가 개정 이후 기출부터 안내한다',()=>{
 const section=w.STUDY_DATA.sections[0];assert.match(section.html,/2025년 3회차 이후 문제부터 풀고/);assert.match(section.html,/그다음 이전 회차/);assert.match(section.html,/#quiz\/current/);
 assert.match(fs.readFileSync('assets/network/app.js','utf8'),/data-paper="\$\{esc\(paperOf\(r\)\.id\)\}"/);
});
