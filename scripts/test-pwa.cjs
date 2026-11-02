const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('PWA 리소스·상대 경로·아이콘 크기',()=>{
 const m=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));assert.equal(m.scope,'./');assert.equal(m.start_url,'./#dashboard');assert.equal(m.display,'standalone');
 for(const i of m.icons){const b=fs.readFileSync(i.src),size=Number(i.sizes.split('x')[0]);assert.equal(b.readUInt32BE(16),size);assert.equal(b.readUInt32BE(20),size);}
 const source=fs.readFileSync('sw.js','utf8'),names=[...source.matchAll(/'((?:assets|materials)\/[^']+)'/g)].map(m=>m[1]);for(const n of names)assert.ok(fs.existsSync(n),n);
});
test('캐시 설치·오프라인 응답·안전한 업데이트 및 범위 격리',async()=>{
 const events={},db=new Map(),base='https://example.com/study/',cache={addAll:async requests=>{for(const r of requests)db.set(r.url,{ok:true,body:r.url});},match:async r=>db.get(r.url),put:async(r,v)=>db.set(r.url,v)};let skipped=0,claimed=0,network=0,deleted=[];
 const self={location:{href:base+'sw.js'},addEventListener:(n,f)=>events[n]=f,clients:{claim:async()=>claimed++},skipWaiting:()=>skipped++};
 const context={self,URL,Request,caches:{open:async()=>cache,keys:async()=>['network-notes-pwa-old','unrelated-cache'],delete:async key=>deleted.push(key)},fetch:async()=>{network++;throw Error('offline');}};
 vm.runInNewContext(fs.readFileSync('sw.js','utf8'),context);
 let promise;events.install({waitUntil:p=>promise=p});await promise;assert.ok(db.has(base+'index.html'));assert.equal(skipped,0);
 events.activate({waitUntil:p=>promise=p});await promise;assert.equal(claimed,1);assert.deepEqual(deleted,['network-notes-pwa-old']);
 const req={method:'GET',url:base+'assets/network/questions.js'};events.fetch({request:req,respondWith:p=>promise=p});assert.equal((await promise).body,req.url);assert.equal(network,0);
 let intercepted=false;events.fetch({request:{method:'GET',url:'https://example.com/other.html'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
 events.message({data:{type:'APPLY_UPDATE'}});assert.equal(skipped,1);
});
