const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto').webcrypto;
const helpers=require('../assets/network/materials-store.js');
const script=fs.readFileSync(path.join(__dirname,'../assets/network/materials-page.js'),'utf8');

class FakeNode{
  constructor(){this.listeners=new Map();this.innerHTML='';this.textContent='';this.value='';this.disabled=false;this.open=false;this.classes=new Set();this.classList={add:x=>this.classes.add(x),remove:x=>this.classes.delete(x)};}
  addEventListener(type,fn,options={}){if(!this.listeners.has(type))this.listeners.set(type,[]);this.listeners.get(type).push({fn,signal:options.signal});}
  emit(type,event={}){for(const listener of this.listeners.get(type)||[])if(!listener.signal?.aborted)listener.fn(event);}
  setAttribute(name,value){this[name]=String(value);}
  getAttribute(name){return this[name]??null;}
  replaceChildren(...children){this.children=children;this.innerHTML='';this.textContent='';}
  showModal(){this.open=true;}
  close(){this.open=false;this.emit('close');}
  click(){this.clicked=true;}
  append(){}
  remove(){}
}
function fixture({pending=false,publicItems=[],initial=[]}={}){
  const nodes=new Map(),root=new FakeNode(),doc=new FakeNode(),saved=[...initial],saveCalls=[],toasts=[];
  const node=selector=>{if(!nodes.has(selector))nodes.set(selector,new FakeNode());return nodes.get(selector);};
  root.querySelector=node;
  doc.createElement=()=>new FakeNode();doc.body=new FakeNode();doc.baseURI='http://127.0.0.1:4173/';
  let resolveInitial;
  const initialPromise=pending?new Promise(resolve=>{resolveInitial=resolve;}):Promise.resolve([...saved]);
  let lists=0;
  const adapter={...helpers,list:()=>++lists===1?initialPromise:Promise.resolve([...saved]),save:async record=>{helpers.validateFile({name:record.filename,size:record.size});saveCalls.push(record);const i=saved.findIndex(r=>r.id===record.id);if(i<0)saved.push(record);else saved[i]=record;return record;},remove:async id=>{const i=saved.findIndex(r=>r.id===id);if(i>=0)saved.splice(i,1);}};
  const context={window:{StudyMaterialsStore:adapter,PUBLIC_MATERIALS:publicItems,crypto},document:doc,crypto,Blob,TextDecoder,URL,AbortController,Intl,Date,setTimeout,clearTimeout,console};
  vm.createContext(context);vm.runInContext(script,context);
  context.window.StudyMaterialsPage.mount({root,toast:message=>toasts.push(message),confirmAction:()=>{}});
  return {doc,root,node,saved,saveCalls,toasts,resolveInitial,unmount:()=>context.window.StudyMaterialsPage.unmount()};
}
function uploadFile(name,content='문제 내용'){
  const blob=new Blob([content],{type:'text/html'});
  return {name,size:blob.size,type:blob.type,lastModified:1,arrayBuffer:()=>blob.arrayBuffer()};
}
function dragEvent(files=[],types=['Files']){return {dataTransfer:{types,files,dropEffect:'unmodified'},prevented:false,preventDefault(){this.prevented=true;}};}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
async function until(predicate){const deadline=Date.now()+900;while(!predicate()){if(Date.now()>deadline)throw new Error('자료 이벤트 처리가 900ms 안에 완료되지 않았습니다.');await tick();}}
async function ready(f){await until(()=>!f.node('#materials-file-input').disabled);}
async function completeUpload(f){await until(()=>!f.node('#materials-file-input').disabled&&/저장했습니다|건너뛰었습니다|실패/.test(f.node('#materials-upload-status').textContent));}

test('파일 dragover만 브라우저 기본 열기를 막고 복사를 표시',async()=>{
  const f=fixture();await ready(f);
  const ordinary=dragEvent([],['text/plain']);f.doc.emit('dragover',ordinary);assert.equal(ordinary.prevented,false);assert.equal(ordinary.dataTransfer.dropEffect,'unmodified');
  const file=dragEvent();f.doc.emit('dragover',file);assert.equal(file.prevented,true);assert.equal(file.dataTransfer.dropEffect,'copy');
  f.doc.emit('dragenter',dragEvent());assert.equal(f.node('#materials-dropzone').classes.has('drag-active'),true);
  f.doc.emit('dragleave',dragEvent());assert.equal(f.node('#materials-dropzone').classes.has('drag-active'),false);f.unmount();
});
test('실제 drop 이벤트가 Blob·회차 메타데이터를 저장 어댑터로 전달',async()=>{
  const f=fixture();await ready(f);const file=uploadFile('2026년정기제04회네트워크관리사2급필기 - 0.hwp','hwp bytes');const event=dragEvent([file]);f.doc.emit('drop',event);await completeUpload(f);
  assert.equal(event.prevented,true);assert.equal(f.saveCalls.length,1);const r=f.saved[0];assert.equal(r.title,'2026년 정기 제4회 네트워크관리사 2급 필기');assert.equal(r.year,2026);assert.equal(r.round,4);assert.equal(r.kind,'필기');assert.equal(r.filename,file.name);assert.equal(r.mime,'application/x-hwp');assert.equal(r.blob.type,'application/x-hwp');assert.equal(await r.blob.text(),'hwp bytes');assert.match(r.digest,/^[a-f0-9]{64}$/);assert.ok(f.node('#materials-results').innerHTML.includes('2026년 정기 제4회'));f.unmount();
});
test('지원하지 않는 HTML drop은 저장하지 않고 실패 사유 표시',async()=>{
  const f=fixture();await ready(f);const event=dragEvent([uploadFile('문제.html','<script>alert(1)</script>')]);f.doc.emit('drop',event);await completeUpload(f);assert.equal(event.prevented,true);assert.equal(f.saveCalls.length,0);assert.match(f.node('#materials-upload-status').textContent,/실패 1개/);assert.ok(!f.node('#materials-results').innerHTML.includes('<script>'));f.unmount();
});
test('동일 내용 파일을 다시 drop하면 해시로 중복 저장을 건너뜀',async()=>{
  const f=fixture();await ready(f);const file=uploadFile('문제.txt','same content');f.doc.emit('drop',dragEvent([file]));await completeUpload(f);assert.equal(f.saveCalls.length,1);
  f.doc.emit('drop',dragEvent([uploadFile('다른이름.txt','same content')]));await completeUpload(f);assert.equal(f.saveCalls.length,1);assert.match(f.node('#materials-upload-status').textContent,/중복 1개/);f.unmount();
});
test('초기 저장 목록 로딩 중 drop을 저장하지 않고 게시 버튼도 잠금',async()=>{
  const publicRecord={id:'old',title:'공개 자료',filename:'old.pdf',size:3,year:2026,round:3,kind:'필기',addedAt:'2026-10-01T00:00:00Z',url:'materials/files/old.pdf'};
  const f=fixture({pending:true,publicItems:[publicRecord]});assert.equal(f.node('[data-material-action="publish"]').disabled,true);const event=dragEvent([uploadFile('문제.txt')]);f.doc.emit('drop',event);await tick();await tick();assert.equal(event.prevented,true);assert.equal(f.saveCalls.length,0);f.resolveInitial([]);await ready(f);assert.equal(f.node('[data-material-action="publish"]').disabled,false);f.unmount();
});
test('페이지를 떠나면 document drop 리스너가 중단됨',async()=>{
  const f=fixture();await ready(f);f.unmount();const event=dragEvent([uploadFile('나중자료.txt')]);f.doc.emit('drop',event);await tick();assert.equal(event.prevented,false);assert.equal(f.saveCalls.length,0);
});

