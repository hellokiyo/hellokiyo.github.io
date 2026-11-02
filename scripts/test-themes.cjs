const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(saved,dark=false,fail=false){
 const inputs=['system','light','dark','warm','sage'].map(value=>({value,checked:false,addEventListener(n,f){this.change=f;}})),status={textContent:''},html={dataset:{},style:{}},storage={value:saved},media={matches:dark,addEventListener(n,f){this.change=f;}};
 const document={readyState:'complete',documentElement:html,querySelector:s=>s==='#theme-status'?status:null,querySelectorAll:()=>inputs};
 const c={window:{document,localStorage:{getItem:()=>storage.value,setItem:(k,v)=>{if(fail)throw Error('blocked');storage.value=v;}},matchMedia:()=>media}};
 vm.runInNewContext(fs.readFileSync('assets/network/themes.js','utf8'),c);
 return {html,storage,media,status,choose(value){const input=inputs.find(i=>i.value===value);input.checked=true;input.change();}};
}
test('기본은 화이트이며 이전 화이트·블랙 선택을 유지한다',()=>{
 assert.equal(setup(null,true).html.dataset.theme,'light');assert.equal(setup('dark').html.dataset.theme,'dark');assert.equal(setup('light',true).html.dataset.theme,'light');assert.equal(setup('invalid').html.dataset.theme,'light');
});
test('시스템 테마만 OS 변경을 실시간으로 따른다',()=>{
 const g=setup('system',true);assert.equal(g.html.dataset.theme,'dark');g.media.matches=false;g.media.change();assert.equal(g.html.dataset.theme,'light');
 g.choose('warm');g.media.matches=true;g.media.change();assert.equal(g.html.dataset.theme,'warm');assert.equal(g.storage.value,'warm');
});
test('베이지·그린 설정은 저장하고 새로고침 후 복원한다',()=>{
 for(const theme of ['warm','sage']){const g=setup(null);g.choose(theme);const next=setup(g.storage.value,true);assert.equal(next.html.dataset.theme,theme);assert.equal(next.html.style.colorScheme,'light');}
});
test('저장 불가 환경에서도 선택은 적용하고 상태를 안내한다',()=>{
 const g=setup(null,false,true);g.choose('sage');assert.equal(g.html.dataset.theme,'sage');assert.match(g.status.textContent,/저장하지 못했습니다/);
});
