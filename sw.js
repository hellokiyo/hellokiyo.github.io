/* 배포 시 VERSION을 변경하세요. 사용자 학습 기록은 CacheStorage와 별개입니다. */
const VERSION='network-notes-pwa-v3';
const BASE=new URL('./',self.location.href);
const FILES=['./','index.html','manifest.webmanifest','README.md','SITE-GUIDE.md',
 'assets/network/styles.css','assets/network/mobile.css','assets/network/keyword-game.css',
 'assets/network/study-data.js','assets/network/questions.js','assets/network/latest-paper.js',
 'assets/network/review-core.js','assets/network/daily-study.js','assets/network/core.js',
 'assets/network/materials-store.js','assets/network/public-materials.js','assets/network/materials-page.js',
 'assets/network/keyword-game.js','assets/network/app.js','assets/network/pwa.js',
 'assets/network/favicon.svg','assets/network/icon-192.png','assets/network/icon-512.png','assets/network/icon-maskable.png',
 'materials/files/network-2026-04-a.hwp'];
const URLS=FILES.map(p=>new URL(p,BASE).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(VERSION);
 await cache.addAll(URLS.map(url=>new Request(url,{cache:'reload'})));
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('network-notes-pwa-')&&key!==VERSION)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('message',event=>{if(event.data?.type==='APPLY_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==BASE.origin)return;
 // 이 앱의 명시적 리소스만 처리합니다. 다른 기존 HTML 페이지는 건드리지 않습니다.
 if(!URLS.includes(url.href))return;
 event.respondWith((async()=>{
  const cache=await caches.open(VERSION),cached=await cache.match(event.request);
  if(cached)return cached;
  const response=await fetch(event.request);if(response.ok)await cache.put(event.request,response.clone());return response;
 })());
});
