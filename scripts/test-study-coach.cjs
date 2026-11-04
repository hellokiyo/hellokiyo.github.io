const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const context={window:{}};vm.runInNewContext(fs.readFileSync('assets/network/study-coach.js','utf8'),context);
const C=context.window.StudyCoach;
const data=(values)=>({days:{today:values},dismissed:{ids:[]}});
test('기록이 적을 때 이용 성향을 단정하지 않는다',()=>{
 assert.equal(C.choose(data({game:599})).id,'start');
 assert.equal(C.choose(data({game:600})).id,'game-balance');
 assert.equal(C.choose(data({game:600,past:401})).id,'start');
});
test('장시간 읽기와 기출 집중을 서로 다른 다음 행동으로 안내한다',()=>{
 assert.equal(C.choose(data({theory:900}),900).href,'#game');
 assert.equal(C.choose(data({past:650,theory:350})).href,'#theory');
 assert.equal(C.choose(data({past:649,theory:351})).id,'start');
});
test('최근 7일만 유지하고 손상된 시간과 오래된 숨김을 복구한다',()=>{
 const now=new Date(2026,10,5,12).getTime(),d=C.clean({days:{'2026-11-05':{game:-5,theory:'bad',past:100},'2026-10-01':{game:9000}},dismissed:{day:'2026-10-01',ids:['start']}},now);
 assert.equal(Object.keys(d.days).length,7);assert.equal(d.days['2026-10-01'],undefined);assert.equal(d.days['2026-11-05'].game,0);assert.equal(d.days['2026-11-05'].theory,0);assert.equal(d.days['2026-11-05'].past,100);assert.equal(d.dismissed.ids.length,0);
});
test('추천의 숫자는 저장한 감사 결과와 일치하고 한계를 명시한다',()=>{
 const audit=JSON.parse(fs.readFileSync('audits/2026-feature-combinations.json','utf8'));
 const game=audit.combinations.find(x=>x.features.join()==='G');assert.equal(game.questions.reduce((a,b)=>a+b,0),44);assert.equal(game.average,22);
 const combo=audit.combinations.find(x=>x.features.join()==='T,F');assert.equal(combo.average,88);
 const html=C.markup(C.choose(data({game:600})));assert.match(html,/44개\(22%\)/);assert.match(html,/실제 시험 비중이나 예상 점수가 아니/);assert.match(html,/공식 대조 전/);
});
test('짧은 게임·일시정지·비활성·라우트 이동의 활성 시간만 반영한다',()=>{
 let now=new Date(2026,10,5,12).getTime(),mode=null,interval,visible='visible',focus=true;const listeners={},saved={};
 const doc={get visibilityState(){return visible;},hasFocus:()=>focus,addEventListener:(k,fn)=>listeners[k]=fn};
 const root={querySelector:()=>null,addEventListener(){}};
 const win={addEventListener(){}};
 vm.runInNewContext(fs.readFileSync('assets/network/study-coach.js','utf8'),{window:win,document:doc,Date:class extends Date{static now(){return now;}},localStorage:{getItem:k=>saved[k],setItem:(k,v)=>saved[k]=v},setInterval:fn=>interval=fn});
 const coach=win.StudyCoach.mount({root,getMode:()=>mode,getView:()=> 'daily'});
 mode='game';coach.refresh();now+=8000;mode=null;coach.refresh();
 const read=()=>JSON.parse(saved['network-study-coach:v1']).days['2026-11-05'];assert.equal(read().game,8);
 now+=15000;interval();assert.equal(read().game,8);
 mode='theory';coach.route();now+=15000;interval();assert.equal(read().theory,15);
 focus=false;now+=15000;interval();assert.equal(read().theory,15);
 focus=true;visible='hidden';now+=15000;interval();assert.equal(read().theory,15);
 visible='visible';now+=130000;interval();assert.equal(read().theory,15);
 listeners.scroll();now+=15000;interval();assert.equal(read().theory,30);
});
