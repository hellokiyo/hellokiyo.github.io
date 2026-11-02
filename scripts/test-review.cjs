const test=require('node:test'),assert=require('node:assert/strict'),R=require('../assets/network/review-core'),C=require('../assets/network/core'),fs=require('node:fs'),vm=require('node:vm');
const c={window:{}};vm.createContext(c);for(const n of ['study-data','questions','latest-paper'])vm.runInContext(fs.readFileSync(`assets/network/${n}.js`,'utf8'),c);
const D=c.window.STUDY_DATA,Q=[...c.window.STUDY_QUESTIONS,...c.window.LATEST_PAPER.questions],items=R.catalog(D,Q),item=items[0];
test('기억남은 1·3·7일로 증가, 모름·헷갈림은 다음날',()=>{
 const a=R.clean({},items);R.review(a,item,{correct:true,rating:'remember'},'', '2026-11-01');assert.equal(a.entries.k0.nextReviewAt,'2026-11-02');
 R.review(a,item,{correct:true,rating:'remember'},'', '2026-11-02');assert.equal(a.entries.k0.nextReviewAt,'2026-11-05');
 R.review(a,item,{correct:true,rating:'remember'},'', '2026-11-05');assert.equal(a.entries.k0.nextReviewAt,'2026-11-12');
 R.review(a,item,{correct:true,rating:'unsure'},'', '2026-11-12');assert.equal(a.entries.k0.nextReviewAt,'2026-11-13');assert.equal(a.entries.k0.consecutiveCorrect,0);
 R.review(a,item,{correct:false,rating:'unknown'},'', '2026-11-13');assert.equal(a.entries.k0.nextReviewAt,'2026-11-14');assert.ok(R.weak(a.entries.k0));
});
test('시험 전날 상한·시험일 변경 재계산·시험 후 지속 사용',()=>{
 const a=R.clean({},items);for(const day of ['2026-11-01','2026-11-02','2026-11-05','2026-11-12'])R.review(a,item,{correct:true,rating:'remember'},'2026-11-14',day);
 assert.equal(a.entries.k0.nextReviewAt,'2026-11-13');R.reschedule(a,'2026-12-01','2026-11-12');assert.equal(a.entries.k0.nextReviewAt,'2026-11-26');
 R.review(a,item,{correct:true,rating:'remember'},'2026-11-14','2026-11-15');assert.ok(a.entries.k0.nextReviewAt>'2026-11-15');
});
test('복습 기한·기존 오답 우선, 단원 교차, 한 번에 제한된 양만',()=>{
 const a=R.clean({},items);R.review(a,items[10],{correct:false,rating:'unknown'},'', '2026-11-01');
 const result=R.select(items,a,[items[11].id],5,'2026-11-03');assert.equal(result[0].id,items[10].id);assert.equal(result[1].id,items[11].id);assert.equal(result.length,5);assert.equal(new Set(result.map(i=>i.id)).size,5);
 const mixed=R.select(items,R.clean({},items),[],10,'2026-11-03');assert.ok(mixed[0].category!==mixed[1].category);
 assert.ok(R.select(items,a,[],10,'2026-11-03',item.category).every(i=>i.category===item.category));
});
test('기존 기록 보존과 새 복습 데이터 왕복·알 수 없는 ID 제거',()=>{
 const a=R.clean({},items);R.review(a,item,{correct:true,rating:'unsure',note:'내 설명',responseTime:1234},'2026-11-14','2026-11-03');a.entries.bad={};
 const before={examDate:'2026-11-14',mastered:['k0'],wrong:['q1'],read:['0'],plans:[0],adaptive:a,session:{mode:'paper',ids:Q.slice(-50).map(q=>q.id),index:3,answers:{},checked:[],startedAt:1}};
 const after=C.cleanState(JSON.parse(JSON.stringify(before)),D,Q);assert.deepEqual(after.mastered,['k0']);assert.deepEqual(after.wrong,['q1']);assert.equal(after.session.ids.length,50);assert.equal(after.session.index,3);assert.equal(after.adaptive.entries.k0.note,'내 설명');assert.equal(after.adaptive.entries.k0.responseTime,1234);assert.equal(Object.keys(after.adaptive.entries).length,1);
});
test('자정·DST와 무관한 날짜 계산 및 11일 계획 단계',()=>{
 assert.equal(R.days('2026-11-03','2026-11-14'),11);assert.equal(R.plus('2026-12-31',1),'2027-01-01');assert.equal(R.plan('2026-11-14','2026-11-03').title,'전체 범위 학습');assert.equal(R.plan('2026-11-14','2026-11-08').title,'기억 강화');assert.equal(R.plan('2026-11-14','2026-11-10').title,'실전 적응');assert.equal(R.plan('2026-11-14','2026-11-13').title,'최종 복습');
});
test('복습 상태·오늘 세션은 새로고침 이후에도 유지된다',()=>{
 const a=R.clean({},items);a.session={queue:['k0','q1','k0'],index:1,selected:2,revealed:true,note:'저장 중인 설명',intro:false,minutes:5,startedAt:100,questionAt:200,results:[{id:'k0',correct:false,rating:'unknown'}],retried:['k0']};
 const b=R.clean(JSON.parse(JSON.stringify(a)),items);assert.deepEqual(b.session,a.session);
});
