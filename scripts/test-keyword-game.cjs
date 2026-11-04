const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function setup(initial={},onReview=()=>{}){
 let now=0,interval,clears=0;const handlers={},docHandlers={},nodes={};
 const node=s=>nodes[s]??=( {textContent:'',innerHTML:'',hidden:false,style:{},value:s==='#rain-mode'?'choice':'',clientHeight:380,offsetHeight:90,focus(){},addEventListener(type,fn){handlers[s+type]=fn;}} );
 const root={querySelector:node,querySelectorAll:()=>[],addEventListener:(type,fn)=>handlers[type]=fn};
 const keywords=Array.from({length:5},(_,i)=>({id:'k'+i,cue:'cue'+i,answer:'answer'+i,category:'category',hint:'hint'+i}));
 const storage={...initial};const context={window:{STUDY_DATA:{keywords},StudyCore:{shuffle:a=>[...a]}},document:{addEventListener:(type,fn)=>docHandlers[type]=fn},localStorage:{getItem:k=>storage[k],setItem:(k,v)=>storage[k]=v},performance:{now:()=>now},AbortController,setInterval:fn=>(interval=fn,1),clearInterval:()=>{clears++;interval=null;}};
 vm.runInNewContext(fs.readFileSync('assets/network/keyword-game.js','utf8'),context);context.window.KeywordGame.mount({root,onReview});
 return {node,storage,context,click:(id,dataset={})=>handlers.click({target:{closest:()=>({id,dataset})}}),advance:ms=>{now+=ms;interval?.();},submit:value=>{node('#rain-input').value=value;handlers['#rain-formsubmit']({preventDefault(){}});},get clears(){return clears;}};
}
test('정답 점수·오답 복습·종료·다시 시작',()=>{
 const g=setup();g.click('rain-start');g.click('',{rainAnswer:'0'});assert.equal(g.node('#rain-score').textContent,'100');
 g.click('rain-skip');assert.match(g.node('#rain-feedback').textContent,/answer3/);
 g.click('rain-end');assert.match(g.node('#rain-result').innerHTML,/cue3/);assert.match(g.node('#rain-result').innerHTML,/정답률 50%/);assert.match(g.node('#rain-result').innerHTML,/100 GP/);
 assert.equal(JSON.parse(Object.values(g.storage)[0]).totalGP,100);assert.equal(JSON.parse(Object.values(g.storage)[0]).choice,undefined);assert.doesNotMatch(g.node('#rain-result').innerHTML,/새로운 최고 기록/);
 g.click('rain-restart');g.click('rain-start');assert.equal(g.node('#rain-score').textContent,'0');
});
test('선택한 오답과 정답, 시간 초과·건너뛰기를 문항별로 구분한다',()=>{
 const g=setup();g.click('rain-start');g.click('',{rainAnswer:'1'});g.advance(10001);g.click('rain-skip');
 const html=g.node('#rain-result').innerHTML;assert.match(html,/내 답 · 2번 · answer0/);assert.match(html,/정답 · answer4/);assert.match(html,/미응답 \(시간 초과\)/);assert.match(html,/모르겠어요 \(건너뜀\)/);
});
test('누적 GP는 배지를 열지 않고 중복 적립 없이 기존 최고 기록을 보존',()=>{
 const key='network-keyword-rain:v1',g=setup({[key]:JSON.stringify({choice:800,type:700,totalGP:400})});g.click('rain-start');g.click('',{rainAnswer:'0'});g.click('rain-end');
 assert.doesNotMatch(g.node('#rain-result').innerHTML,/새 배지 획득/);assert.doesNotMatch(g.node('#rain-collection').innerHTML,/rain-badge earned/);const saved=JSON.parse(g.storage[key]);assert.equal(saved.totalGP,500);assert.equal(saved.choice,800);assert.equal(saved.type,700);
 g.click('rain-end');assert.equal(JSON.parse(g.storage[key]).totalGP,500);
});
test('직접 입력한 답은 결과에서 안전하게 표시한다',()=>{
 const g=setup();g.node('#rain-mode').value='type';g.click('rain-start');g.submit('<img src=x>');g.click('rain-end');assert.match(g.node('#rain-result').innerHTML,/내 답 · &lt;img src=x&gt;/);assert.doesNotMatch(g.node('#rain-result').innerHTML,/<img src=x>/);
});
test('1개 정답·3개 오답은 25%이며 짧은 도전은 최고 기록으로 올리지 않는다',()=>{
 const g=setup();g.click('rain-start');g.click('',{rainAnswer:'0'});
 g.click('rain-skip');g.click('rain-skip');g.click('rain-skip');
 assert.match(g.node('#rain-result').innerHTML,/정답률 25%/);
 assert.match(g.node('#rain-result').innerHTML,/100 GP/);
 assert.doesNotMatch(g.node('#rain-result').innerHTML,/새로운 최고 기록/);
});
test('5문항 이상부터 최고 게임 포인트를 저장하고 정답률은 별도 표시한다',()=>{
 const g=setup();g.node('#rain-mode').value='type';g.click('rain-start');
 for(let i=4;i>=0;i--)g.submit('answer'+i);
 g.click('rain-end');assert.match(g.node('#rain-result').innerHTML,/정답률 100%/);
 assert.equal(JSON.parse(Object.values(g.storage)[0]).type,600);
});
test('일시정지 시간 제외·시간 초과 생명 감소·메뉴 이탈 정리',()=>{
 const g=setup();g.click('rain-start');g.advance(2000);g.click('rain-pause');g.advance(30000);assert.equal(g.node('#rain-time').textContent,'88초');
 g.click('rain-pause');g.advance(8001);assert.match(g.node('#rain-lives').textContent,/♡/);
 g.context.window.KeywordGame.unmount();const t=g.node('#rain-time').textContent;g.advance(10000);assert.equal(g.node('#rain-time').textContent,t);assert.ok(g.clears>0);
});
test('직접 입력은 대소문자·공백을 정규화한다',()=>{
 const g=setup();g.node('#rain-mode').value='type';g.click('rain-start');g.submit(' ANSWER 4 ');assert.equal(g.node('#rain-score').textContent,'100');
 g.advance(90001);assert.match(g.node('#rain-result').innerHTML,/90초 챌린지 완료/);
});

test('정답 목록은 기본 접힘·오답만 표시하며 전체로 전환할 수 있다',()=>{
 const g=setup();g.click('rain-start');g.click('',{rainAnswer:'0'});g.click('',{rainAnswer:'1'});g.click('rain-end');
 const html=g.node('#rain-result').innerHTML;assert.match(html,/<details class="rain-answer-list">/);assert.doesNotMatch(html,/<details class="rain-answer-list" open/);assert.match(html,/오답 1 · 정답 1/);assert.doesNotMatch(html,/rain-review is-correct/);assert.match(html,/rain-result-badge wrong/);
 g.click('',{rainFilter:'all'});assert.match(g.node('#rain-review-list').innerHTML,/rain-review is-correct/);assert.match(g.node('#rain-review-list').innerHTML,/rain-review is-wrong/);
 g.click('',{rainFilter:'wrong'});assert.doesNotMatch(g.node('#rain-review-list').innerHTML,/rain-review is-correct/);
});

test('정답·건너뜀·시간 초과 판정이 오답노트 연결로 즉시 전달된다',()=>{const events=[],g=setup({},(id,right)=>events.push({id,right}));g.click('rain-start');g.click('',{rainAnswer:'0'});g.click('rain-skip');g.advance(10001);assert.equal(events.length,3);assert.equal(events[0].right,true);assert.equal(events[1].right,false);assert.equal(events[2].right,false);assert.ok(events.every(e=>e.id.startsWith('k')));});

test('한 판 목표 달성으로 해당 모드 배지만 열리고 같은 점수에 재획득하지 않는다',()=>{const g=setup();g.node('#rain-mode').value='type';g.click('rain-start');for(let i=0;i<8;i++)g.submit('answer'+(4-i%5));g.click('rain-end');assert.match(g.node('#rain-result').innerHTML,/직접 입력 새 배지 획득 · 집중 도전자/);assert.equal(JSON.parse(Object.values(g.storage)[0]).type,1080);assert.equal((g.node('#rain-collection').innerHTML.match(/rain-badge earned/g)||[]).length,1);g.click('rain-restart');g.click('rain-start');for(let i=0;i<8;i++)g.submit('answer'+(4-i%5));g.click('rain-end');assert.doesNotMatch(g.node('#rain-result').innerHTML,/새 배지 획득/);});
