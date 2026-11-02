const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function setup(){
 let now=0,interval,clears=0;const handlers={},docHandlers={},nodes={};
 const node=s=>nodes[s]??=( {textContent:'',innerHTML:'',hidden:false,style:{},value:s==='#rain-mode'?'choice':'',clientHeight:380,offsetHeight:90,focus(){},addEventListener(type,fn){handlers[s+type]=fn;}} );
 const root={querySelector:node,addEventListener:(type,fn)=>handlers[type]=fn};
 const keywords=Array.from({length:5},(_,i)=>({id:'k'+i,cue:'cue'+i,answer:'answer'+i,category:'category',hint:'hint'+i}));
 const storage={};const context={window:{STUDY_DATA:{keywords},StudyCore:{shuffle:a=>[...a]}},document:{addEventListener:(type,fn)=>docHandlers[type]=fn},localStorage:{getItem:k=>storage[k],setItem:(k,v)=>storage[k]=v},performance:{now:()=>now},AbortController,setInterval:fn=>(interval=fn,1),clearInterval:()=>{clears++;interval=null;}};
 vm.runInNewContext(fs.readFileSync('assets/network/keyword-game.js','utf8'),context);context.window.KeywordGame.mount({root});
 return {node,storage,context,click:(id,dataset={})=>handlers.click({target:{closest:()=>({id,dataset})}}),advance:ms=>{now+=ms;interval?.();},submit:value=>{node('#rain-input').value=value;handlers['#rain-formsubmit']({preventDefault(){}});},get clears(){return clears;}};
}
test('정답 점수·오답 복습·종료·다시 시작',()=>{
 const g=setup();g.click('rain-start');g.click('',{rainAnswer:'0'});assert.equal(g.node('#rain-score').textContent,'100');
 g.click('rain-skip');assert.match(g.node('#rain-feedback').textContent,/answer3/);
 g.click('rain-end');assert.match(g.node('#rain-result').innerHTML,/cue3/);assert.match(g.node('#rain-result').innerHTML,/정답률 50%/);assert.match(g.node('#rain-result').innerHTML,/100 GP/);
 assert.equal(Object.values(g.storage).length,0);assert.doesNotMatch(g.node('#rain-result').innerHTML,/새로운 최고 기록/);
 g.click('rain-restart');g.click('rain-start');assert.equal(g.node('#rain-score').textContent,'0');
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
