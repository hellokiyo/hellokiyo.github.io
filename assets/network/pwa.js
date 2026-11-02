(() => {
 'use strict';let installEvent=null,registration=null;
 const $=s=>document.querySelector(s),button=$('#pwa-install'),help=$('#pwa-help'),status=$('#pwa-offline'),banner=$('#pwa-banner');
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 function installHelp(){
  if(standalone()){help.textContent='홈 화면 앱으로 실행 중입니다.';button.hidden=true;return;}
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  help.textContent=ios?'iPhone: Safari의 공유 메뉴 → 홈 화면에 추가를 선택하세요.':'휴대폰 브라우저 메뉴에서 앱 설치 또는 홈 화면에 추가를 선택하세요. 설치 버튼은 브라우저가 지원할 때만 표시됩니다.';
 }
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;button.hidden=standalone();});
 window.addEventListener('appinstalled',()=>{installEvent=null;button.hidden=true;help.textContent='설치되었습니다. 홈 화면에서 네트워크 노트를 열어보세요.';});
 button.addEventListener('click',async()=>{if(!installEvent)return;const e=installEvent;installEvent=null;button.hidden=true;await e.prompt();await e.userChoice;});
 function updateBanner(worker){
  if(!worker)return;banner.hidden=false;banner.innerHTML='<span>새 학습 자료가 준비되었습니다. 답안을 저장한 뒤 업데이트하세요.</span><button type="button" class="button secondary" id="apply-update">지금 업데이트</button><button type="button" class="text-button" id="later-update">나중에</button>';
  $('#apply-update').onclick=()=>{worker.postMessage({type:'APPLY_UPDATE'});};$('#later-update').onclick=()=>{banner.hidden=true;};
 }
 if('serviceWorker'in navigator&&window.isSecureContext){
  status.textContent='오프라인 학습 파일을 준비하고 있습니다.';
  navigator.serviceWorker.register(new URL('../../sw.js',document.currentScript.src),{updateViaCache:'none'}).then(reg=>{
   registration=reg;updateBanner(reg.waiting);
   reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'){if(navigator.serviceWorker.controller)updateBanner(reg.waiting);else status.textContent='오프라인 학습 준비 완료 · 핵심 문제와 이론을 저장했습니다.';}if(worker.state==='redundant')status.textContent='오프라인 파일 준비에 실패했습니다. 연결 후 새로고침해 주세요.';});});
   navigator.serviceWorker.ready.then(()=>{status.textContent='오프라인 학습 준비 완료 · 핵심 문제와 이론을 저장했습니다.';});
   reg.update().catch(()=>{});
  }).catch(()=>{status.textContent='오프라인 파일을 준비하지 못했습니다. 온라인에서는 계속 학습할 수 있습니다.';});
  let reloading=false;const hadController=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(hadController&&!reloading){reloading=true;location.reload();}});
 }else status.textContent='설치·오프라인 학습은 HTTPS 사이트 또는 localhost에서 사용할 수 있습니다.';
 const themeButton=$('#theme-toggle');
 function theme(value){document.documentElement.dataset.theme=value;themeButton.textContent=value==='dark'?'밝은 화면으로 변경':'어두운 화면으로 변경';}
 let saved;try{saved=localStorage.getItem('network-notes:theme');}catch{}
 theme(saved==='dark'?'dark':'light');
 themeButton.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';theme(next);try{localStorage.setItem('network-notes:theme',next);}catch{}});
 installHelp();
 // 앱을 닫은 상태의 예약 알림은 서버 없이 제공하지 않습니다.
})();
