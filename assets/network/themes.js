(function(root){
 'use strict';
 const MODES=['system','light','dark','warm','sage'];
 function resolve(preference,dark){return preference==='system'?(dark?'dark':'light'):MODES.includes(preference)?preference:'light';}
 const api={resolve};if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(!root.document)return;
 const doc=root.document,key='network-notes:theme',media=root.matchMedia?root.matchMedia('(prefers-color-scheme: dark)'):null;
 let preference='light';try{const saved=root.localStorage.getItem(key);if(MODES.includes(saved))preference=saved;}catch{}
 const names={system:'시스템 설정',light:'화이트',dark:'블랙',warm:'웜 베이지',sage:'소프트 그린'};
 function apply(){
  const actual=resolve(preference,!!media?.matches);doc.documentElement.dataset.theme=actual;doc.documentElement.dataset.themePreference=preference;
  doc.documentElement.style.colorScheme=actual==='dark'?'dark':'light';
  const meta=doc.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',{light:'#ffffff',dark:'#151719',warm:'#f6f0e5',sage:'#eef4e9'}[actual]);
  doc.querySelectorAll('input[name="display-theme"]').forEach(input=>input.checked=input.value===preference);
  const status=doc.querySelector('#theme-status');if(status)status.textContent=preference==='system'?`시스템 설정을 따르는 중 · 현재 ${names[actual]}`:`${names[preference]} 적용 중 · 이 브라우저에 저장됩니다.`;
 }
 function bind(){
  doc.querySelectorAll('input[name="display-theme"]').forEach(input=>input.addEventListener('change',()=>{
   if(!input.checked||!MODES.includes(input.value))return;preference=input.value;apply();
   try{root.localStorage.setItem(key,preference);}catch{const status=doc.querySelector('#theme-status');if(status)status.textContent=names[preference]+' 적용 중 · 설정을 저장하지 못했습니다.';}
  }));apply();
 }
 apply();
 if(media?.addEventListener)media.addEventListener('change',()=>{if(preference==='system')apply();});else if(media?.addListener)media.addListener(()=>{if(preference==='system')apply();});
 if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
 root.ThemeSettings=api;
})(typeof window!=='undefined'?window:globalThis);
