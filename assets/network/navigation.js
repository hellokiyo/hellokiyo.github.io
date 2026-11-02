(function(root){
 'use strict';
 const MARK='passRoutineNav';
 function create(win,render){
  let last=null,returning=false;
  const hash=()=>win.location.hash||'#dashboard';
  const mark=home=>({...win.history.state,[MARK]:home?'home':'page'});
  function refresh(){returning=false;const next=hash();if(next!==last){last=next;render();}}
  function init(){
   const target=hash();
   if(!win.history.state?.[MARK]){
    win.history.replaceState(mark(true),'','#dashboard');
    if(target!=='#dashboard')win.history.pushState(mark(false),'',target);
   }
   win.addEventListener('popstate',refresh);win.addEventListener('hashchange',refresh);refresh();
  }
  function go(target){
   if(typeof target!=='string'||!/^#[a-z]+(?:\/[a-z0-9-]+)?$/.test(target))return;
   if(target===hash())return;
   if(target==='#dashboard'&&win.history.state?.[MARK]==='page'){
    if(!returning){returning=true;win.history.back();}return;
   }
   if(hash()==='#dashboard'&&win.history.state?.[MARK]==='home')win.history.pushState(mark(false),'',target);
   else win.history.replaceState(mark(target==='#dashboard'),'',target);
   refresh();
  }
  return {init,go};
 }
 const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AppNavigation=api;
})(typeof window!=='undefined'?window:globalThis);
