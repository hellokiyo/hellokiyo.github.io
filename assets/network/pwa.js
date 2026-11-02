(() => {
 'use strict';let installEvent=null,registration=null,applying=false;
 const $=s=>document.querySelector(s),button=$('#pwa-install'),help=$('#pwa-help'),status=$('#pwa-offline'),banner=$('#pwa-banner');
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 function installHelp(){
  if(standalone()){help.textContent='홈 화면 앱으로 실행 중입니다.';button.hidden=true;return;}
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  help.textContent=ios?'iPhone: Safari의 공유 메뉴 → 홈 화면에 추가를 선택하세요.':'휴대폰 브라우저 메뉴에서 앱 설치 또는 홈 화면에 추가를 선택하세요. 설치 버튼은 브라우저가 지원할 때만 표시됩니다.';
 }
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;button.hidden=standalone();});
 window.addEventListener('appinstalled',()=>{installEvent=null;button.hidden=true;help.textContent='설치되었습니다. 홈 화면에서 합격루틴를 열어보세요.';});
 button.addEventListener('click',async()=>{if(!installEvent)return;const e=installEvent;installEvent=null;button.hidden=true;await e.prompt();await e.userChoice;});
 function updateBanner(worker){
  if(!worker)return;banner.hidden=false;banner.innerHTML='<span>새 학습 자료가 준비되었습니다. 답안을 저장한 뒤 업데이트하세요.</span><button type="button" class="button secondary" id="apply-update">지금 업데이트</button><button type="button" class="text-button" id="later-update">나중에</button>';
  $('#apply-update').onclick=()=>requestRefresh(()=>{applying=true;worker.postMessage({type:'APPLY_UPDATE'});});$('#later-update').onclick=()=>{banner.hidden=true;};
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
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(applying&&!reloading){reloading=true;location.reload();}else if(hadController){showReloadBanner();}});
 }else status.textContent='설치·오프라인 학습은 HTTPS 사이트 또는 localhost에서 사용할 수 있습니다.';
 installHelp();
 function requestRefresh(action){if(window.StudyApp)window.StudyApp.requestRefresh(action);else action();}
 function showReloadBanner(){banner.hidden=false;banner.innerHTML='<span>새 버전을 사용할 수 있습니다. 저장 후 화면을 새로 불러오세요.</span><button type="button" class="button secondary" id="reload-app">새로 불러오기</button>';$('#reload-app').onclick=()=>requestRefresh(()=>location.reload());}
 const updateButton=document.createElement('button');updateButton.type='button';updateButton.className='button secondary full';updateButton.textContent='최신 화면 불러오기';
 status.after(updateButton);
 async function refreshLatest(){
  updateButton.disabled=true;
  try{
   if(!navigator.onLine)throw Error('offline');
   if(registration){
    await registration.update();
    const worker=registration.installing;
    if(worker)await new Promise((resolve,reject)=>{
     const timer=setTimeout(()=>{worker.removeEventListener('statechange',check);reject(Error('timeout'));},20000);
     function check(){if(worker.state==='installed'||worker.state==='activated'){clearTimeout(timer);worker.removeEventListener('statechange',check);resolve();}else if(worker.state==='redundant'){clearTimeout(timer);worker.removeEventListener('statechange',check);reject(Error('install'));}}
     worker.addEventListener('statechange',check);check();
    });
    if(registration.waiting){applying=true;registration.waiting.postMessage({type:'APPLY_UPDATE'});return;}
   }
   location.reload();
  }catch{status.textContent='새 파일을 가져오지 못했습니다. 연결을 확인하고 다시 시도하세요. 저장한 학습은 계속할 수 있습니다.';}
  finally{updateButton.disabled=false;}
 }
 updateButton.addEventListener('click',()=>requestRefresh(refreshLatest));
 let lastCheck=0;
 function checkUpdate(){if(!registration||!navigator.onLine||document.visibilityState==='hidden'||Date.now()-lastCheck<60000)return;lastCheck=Date.now();registration.update().then(()=>updateBanner(registration.waiting)).catch(()=>{});}
 window.addEventListener('online',checkUpdate);window.addEventListener('focus',checkUpdate);document.addEventListener('visibilitychange',checkUpdate);
 // 앱을 닫은 상태의 예약 알림은 서버 없이 제공하지 않습니다.
})();
