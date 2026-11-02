const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),R=require('../assets/network/review-core');
function setup(presetMinutes=null){
 const items=[{id:'k0',category:'A',question:'Q0',options:['A0','A1','A2','A3'],answer:0,explanation:'설명 0',cue:'단서 0',concept:'A0'},{id:'q1',category:'B',question:'Q1',options:['B0','B1','B2','B3'],answer:1,explanation:'설명 1'}];
 const state={adaptive:R.clean({},items),wrong:[],examDate:'2026-11-14'},nodes={},events={};let saves=0;
 const root={innerHTML:'',querySelector:s=>nodes[s]??={value:s==='#daily-minutes'?'5':s==='#daily-category'?'전체':'',textContent:''},addEventListener:(n,f)=>events[n]=f};
 const c={window:{ReviewCore:R,scrollTo(){}},AbortController,setInterval:()=>1,clearInterval(){},Date};vm.runInNewContext(fs.readFileSync('assets/network/daily-study.js','utf8'),c);
 c.window.DailyStudy.mount({root,state,items,save:()=>saves++,toast(){},presetMinutes});
 return {state,root,nodes,events,get saves(){return saves;},click:(id,dataset={})=>events.click({target:{closest:()=>({id,dataset})}})};
}
test('답안 확인·기억 평가 순서 준수와 중복 집계 방지',()=>{
 const g=setup();g.click('daily-start');g.click('daily-recall');assert.doesNotMatch(g.root.innerHTML,/정답입니다/);
 g.click('',{dailyRate:'remember'});assert.equal(g.state.adaptive.session.index,0);
 g.click('',{dailyAnswer:'0'});g.click('daily-check');assert.match(g.root.innerHTML,/정답입니다/);assert.equal(Object.keys(g.state.adaptive.entries).length,0);
 g.root.querySelector('#daily-note').value='내가 설명한 이유';g.click('',{dailyRate:'unsure'});assert.equal(g.state.adaptive.entries.k0.note,'내가 설명한 이유');assert.equal(g.state.adaptive.entries.k0.studyCount,1);
});
test('모름은 당일 한 번 재출제하고 두 번째 오답도 무한 반복하지 않는다',()=>{
 const g=setup();g.click('daily-start');g.click('daily-recall');
 for(let n=0;n<3;n++){g.click('',{dailyAnswer:'0'});g.click('daily-check');g.root.querySelector('#daily-note').value='';g.click('',{dailyRate:'unknown'});}
 assert.equal(g.state.adaptive.session.queue.filter(id=>id==='k0').length,2);
 assert.equal(g.state.adaptive.entries.k0.studyCount,2);assert.ok(g.state.wrong.includes('q1'));
});
test('첫 학습 항목의 자기 설명 초안도 평가 전에 저장한다',()=>{
 const g=setup();g.click('daily-start');g.click('daily-recall');g.events.input({target:{id:'daily-note',value:'설명 초안'}});assert.equal(g.state.adaptive.session.note,'설명 초안');assert.ok(g.saves>0);
});
test('홈 배너의 5분 바로 시작은 설정 없이 세션을 만들고 진행 중 세션을 보존한다',()=>{
 const g=setup(5);assert.equal(g.state.adaptive.session.minutes,5);assert.equal(g.state.adaptive.session.intro,true);assert.match(g.root.innerHTML,/먼저 핵심 개념/);assert.doesNotMatch(g.root.innerHTML,/id="daily-start"/);
});
