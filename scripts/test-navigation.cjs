const test=require('node:test'),assert=require('node:assert/strict');
const nav=require('../assets/network/navigation.js');
function browser(hash=''){
 const entries=[{hash,state:null}],events={};let index=0;
 const win={location:{hash},addEventListener:(n,f)=>events[n]=f};
 function sync(){win.location.hash=entries[index].hash;}
 win.history={get state(){return entries[index].state;},get length(){return entries.length;},replaceState(state,_,hash){entries[index]={state,hash};sync();},pushState(state,_,hash){entries.splice(++index);entries.push({state,hash});sync();},back(){if(index){index--;sync();events.popstate();events.hashchange();}},forward(){if(index<entries.length-1){index++;sync();events.popstate();events.hashchange();}}};return win;
}
test('메뉴 반복 이동은 방문기록 한 칸 사용, 뒤로 홈·앞으로 마지막 화면',()=>{
 const win=browser();let renders=0;const n=nav.create(win,()=>renders++);n.init();n.go('#keywords');n.go('#game');n.go('#quiz');assert.equal(win.history.length,2);win.history.back();assert.equal(win.location.hash,'#dashboard');win.history.forward();assert.equal(win.location.hash,'#quiz');assert.equal(renders,6);n.go('#dashboard');assert.equal(win.location.hash,'#dashboard');
});
test('직접 링크와 재실행은 홈 기반을 중복 생성하지 않는다',()=>{
 const win=browser('#theory/2');const n=nav.create(win,()=>{});n.init();assert.equal(win.location.hash,'#theory/2');assert.equal(win.history.length,2);nav.create(win,()=>{}).init();assert.equal(win.history.length,2);n.go('javascript:bad');assert.equal(win.location.hash,'#theory/2');
});
test('카드 높이의 그리드 영역은 실제 높이보다 작지 않다',()=>{
 const {span}=require('../assets/network/keyword-layout.js');for(const height of [120,187.5,400,760])for(const gap of [12,16,24]){const rows=span(height,gap);assert.ok(rows+(rows-1)*gap>=height);}
});
