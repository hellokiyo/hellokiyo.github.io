/* 키워드 산성비: 학습 기록과 분리된 브라우저 로컬 게임. */
(() => {
 'use strict';
 const KEY='network-keyword-rain:v1';
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normalize=s=>String(s).normalize('NFKC').toLowerCase().replace(/[\s·.,()（）_\-]/g,'');
 let dispose=()=>{},active=false;
 function mount({root,onFinish=()=>{},onActivity=()=>{},onReview=()=>{}}){
  dispose();
  const controller=new AbortController(),opts={signal:controller.signal},data=window.STUDY_DATA.keywords;
  let timer=null,playing=false,paused=false,score=0,combo=0,maxCombo=0,lives=3,correct=0,total=0,remaining=90000,deadline=0,duration=10000,last=0,bag=[],current=null,choices=[],review=[],attempts=[],mode='choice',best={};
  try{const stored=JSON.parse(localStorage.getItem(KEY)||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))best=stored;}catch{}
  const badges=[[1000,'집중 도전자'],[2500,'키워드 고수'],[5000,'회상 마스터'],[8000,'번개 챔피언']];
  const record=m=>Number.isFinite(best[m])?Math.max(0,Math.floor(best[m])):0;
  const lifetime=()=>Number.isFinite(best.totalGP)&&best.totalGP>=0?Math.floor(best.totalGP):0;
  const $=s=>root.querySelector(s);
  root.innerHTML=`<div class="page-heading"><div><h1>키워드 산성비</h1><p>단서가 바닥에 닿기 전에 정답을 맞히세요.</p></div><a class="button secondary" href="#keywords">키워드 복습 →</a></div>
  <section class="rain-shell"><div class="rain-hud"><div>게임 포인트<strong id="rain-score">0</strong></div><div>남은 시간<strong id="rain-time">90초</strong></div><div>방어력<strong id="rain-lives">♥ ♥ ♥</strong></div><div>연속 정답<strong id="rain-combo">0</strong></div></div>
  <div class="rain-arena" id="rain-arena"><div class="rain-grid" aria-hidden="true"></div><div class="rain-intro" id="rain-intro"><span class="label-tag">90초 키워드 챌린지</span><h2>기억을 꺼내는 속도</h2><p>키워드 하나, 정답 하나.<br>맞히면 다음 문제, 놓치면 방어력 −1.<br>5문제마다 낙하 속도가 빨라집니다.</p><label>풀이 방식 <select id="rain-mode"><option value="choice">4지선다 · 숫자 1~4</option><option value="type">정답 직접 입력</option></select></label><p class="fine-print">직접 입력은 카드의 정답 표기를 기준으로 합니다.<br>영문 대소문자와 공백·하이픈은 구분하지 않습니다.</p><button class="button primary" id="rain-start">게임 시작 →</button><p id="rain-best" class="muted"></p></div><div class="rain-drop" id="rain-drop" hidden><span id="rain-category"></span><h2 id="rain-cue"></h2></div><div class="rain-floor" aria-hidden="true">NETWORK DEFENSE LINE</div></div>
  <div class="rain-answer-zone" id="rain-zone" hidden><div id="rain-choices" class="rain-choices"></div><form id="rain-form" hidden><label class="sr-only" for="rain-input">키워드 정답</label><input id="rain-input" autocomplete="off" maxlength="200" placeholder="정답 입력 후 Enter"><button class="button primary" type="submit">확인 ↵</button></form><div class="rain-tools"><button class="text-button" id="rain-pause">일시정지</button><button class="text-button" id="rain-skip">모르겠어요 · 방어력 −1</button><button class="text-button" id="rain-end">게임 종료</button></div></div><p id="rain-feedback" class="rain-feedback" role="status" aria-live="polite">90초 · 방어력 3개 · 정답률과 게임 포인트를 따로 집계 · 최고 기록은 5문항부터</p></section><section id="rain-result" hidden></section><section class="panel rain-collection" id="rain-collection" aria-label="모드별 한 판 최고 기록 배지"></section>`;
  function collection(){$('#rain-collection').innerHTML=`<div class="section-heading"><h2>한 판 최고 기록 배지</h2></div>${[['choice','4지선다'],['type','직접 입력']].map(([m,label])=>{const gp=record(m),nextBadge=badges.find(([n])=>gp<n);return `<section class="rain-badge-mode"><h3>${label} <small>최고 ${gp.toLocaleString()} GP</small></h3><div class="rain-badges">${badges.map(([n,title])=>`<span class="rain-badge ${gp>=n?'earned':''}">${gp>=n?'✓':'○'} ${title}<small>한 판 ${n.toLocaleString()} GP</small></span>`).join('')}</div><p>${nextBadge?`${nextBadge[1]}까지 최고 기록을 ${(nextBadge[0]-gp).toLocaleString()} GP 더 높여보세요.`:'이 모드의 최고 기록 배지를 모두 획득했어요!'}</p></section>`;}).join('')}<p class="fine-print">각 모드에서 5문항 이상 도전한 한 판 최고 점수로만 획득해요. 여러 판의 점수는 합산하지 않아요. 기존 최고 기록도 반영됩니다. GP는 게임 기록이며 시험 실력을 뜻하지 않아요.</p><p class="fine-print">활동 기록 · 누적 ${lifetime().toLocaleString()} GP (배지 조건에 미포함)</p>`;}

  collection();
  function showBest(){ $('#rain-best').textContent=`최고 포인트 · 선택 ${Number(best.choice)||0} GP / 입력 ${Number(best.type)||0} GP`; }
  showBest();
  function hud(){ $('#rain-score').textContent=score.toLocaleString();$('#rain-time').textContent=Math.ceil(remaining/1000)+'초';$('#rain-lives').textContent='♥ '.repeat(lives)+'♡ '.repeat(3-lives);$('#rain-combo').textContent=combo; }
  function next(now){
   if(!bag.length)bag=window.StudyCore.shuffle(data);
   current=bag.pop();duration=Math.max(4200,10000-Math.floor(correct/5)*900);deadline=now+duration;
   $('#rain-cue').textContent=current.cue;$('#rain-category').textContent=current.category;$('#rain-drop').style.transform='translateY(0px)';
   const others=[...new Set(data.map(k=>k.answer))].filter(a=>normalize(a)!==normalize(current.answer));
   choices=window.StudyCore.shuffle([current.answer,...window.StudyCore.shuffle(others).slice(0,3)]);
   $('#rain-choices').innerHTML=choices.map((a,i)=>`<button type="button" class="rain-option" data-rain-answer="${i}"><b>${i+1}</b>${escape(a)}</button>`).join('');
   $('#rain-input').value='';
  }
  function finish(reason){
   if(!playing)return;
   playing=false;active=false;clearInterval(timer);timer=null;$('#rain-arena').hidden=true;$('#rain-drop').hidden=true;$('#rain-zone').hidden=true;$('#rain-intro').hidden=true;
   const accuracy=total?Math.round(correct/total*100):0,eligible=total>=5,previous=record(mode),newBest=eligible&&score>previous,oldGP=lifetime();if(eligible)best[mode]=Math.max(previous,score);best.totalGP=oldGP+score;const unlocked=eligible?badges.filter(([n])=>previous<n&&record(mode)>=n):[];let saved=true;try{localStorage.setItem(KEY,JSON.stringify(best));}catch{saved=false;}
   $('#rain-result').hidden=false;
   $('#rain-result').innerHTML=`<section class="panel rain-result"><span class="label-tag">${escape(reason)}</span><h2>정답률 ${accuracy}%</h2><p><strong>${score.toLocaleString()} GP${newBest?' · 새로운 최고 기록!':''}</strong> · 게임 포인트</p><p>정답 ${correct} / ${total} · 최고 연속 정답 ${maxCombo} · ${mode==='choice'?'4지선다':'직접 입력'}</p>${unlocked.length?`<p class="rain-unlocked">${mode==='choice'?'4지선다':'직접 입력'} 새 배지 획득 · ${unlocked.map(([,title])=>escape(title)).join(' · ')}</p>`:''}<p>${!eligible?'5문항 이상 도전하면 최고 포인트 기록에 반영됩니다.':''} ${saved?'이번 GP가 누적 포인트에 저장되었습니다.':'포인트를 저장하지 못했습니다. 이 화면을 닫으면 기록이 사라질 수 있습니다.'}</p><button class="button primary" id="rain-restart">다시 도전 ↺</button><details class="rain-answer-list"><summary><span><strong>정답 목록</strong><small>오답 ${total-correct} · 정답 ${correct}</small></span><span class="rain-list-action">목록 열기 <span aria-hidden="true">⌄</span></span></summary><div class="rain-review-tools" aria-label="정답 목록 필터"><button type="button" class="filter active" data-rain-filter="wrong" aria-pressed="true">오답만 ${total-correct}</button><button type="button" class="filter" data-rain-filter="all" aria-pressed="false">전체 ${total}</button></div><div id="rain-review-list">${reviewMarkup(true)}</div></details><a class="text-button" href="#keywords">전체 키워드 암기 →</a></section>`;
   $('#rain-collection').hidden=false;collection();
   $('#rain-feedback').textContent=reason;hud();onFinish();
  }
  function reviewMarkup(onlyWrong){
   const rows=attempts.map((k,i)=>({...k,number:i+1})).filter(k=>!onlyWrong||!k.correct);
   return rows.length?rows.map(k=>`<article class="rain-review ${k.correct?'is-correct':'is-wrong'}"><div class="rain-review-heading"><span class="rain-result-badge ${k.correct?'correct':'wrong'}">${k.correct?'정답':k.reason==='timeout'?'오답 · 시간 초과':k.reason==='skip'?'오답 · 건너뜀':'오답'}</span><span class="category">${k.number}번</span></div><strong>${escape(k.cue)}</strong><p class="rain-my-answer">내 답 · ${k.selected===null?(k.reason==='timeout'?'미응답 (시간 초과)':'모르겠어요 (건너뜀)'):escape(k.selected)}</p><p class="rain-right-answer">정답 · ${escape(k.answer)}</p><small>${escape(k.hint)}</small></article>`).join(''):`<p class="rain-list-empty">${attempts.length?'오답이 없어요. 전체를 누르면 맞힌 문제도 확인할 수 있어요.':'아직 답을 판정한 문제가 없습니다.'}</p>`;
  }
  function resolve(right,now,selected=null,reason='wrong'){
   total++;onReview(current.id,right);
   attempts.push({id:current.id,cue:current.cue,answer:current.answer,hint:current.hint,selected,reason,correct:right});
   if(right){correct++;combo++;maxCombo=Math.max(maxCombo,combo);score+=100+Math.min(combo-1,10)*10;$('#rain-feedback').textContent=`정답! ${current.answer} · ${combo}연속 · +${100+Math.min(combo-1,10)*10} GP`;}
   else{combo=0;lives--;if(!review.some(k=>k.id===current.id))review.push(current);$('#rain-feedback').textContent=`오답${reason==='timeout'?' · 시간 초과':reason==='skip'?' · 건너뜀':''}! 정답은 ${current.answer} · ${current.hint}`;}
   hud();if(lives<=0)finish('방어선이 무너졌어요. 다시 도전하세요!');else next(now);
  }
  function tick(){
   if(!playing||paused)return;
   const now=performance.now();remaining=Math.max(0,remaining-(now-last));last=now;
   if(remaining<=0){finish('90초 챌린지 완료');return;}
   if(now>=deadline){resolve(false,now,null,'timeout');return;}
   const distance=Math.max(0,$('#rain-arena').clientHeight-$('#rain-drop').offsetHeight-34);
   $('#rain-drop').style.transform=`translateY(${Math.max(0,1-(deadline-now)/duration)*distance}px)`;hud();
  }
  function start(){
   $('#rain-arena').hidden=false;mode=$('#rain-mode').value;score=combo=maxCombo=correct=total=0;lives=3;remaining=90000;bag=[];review=[];attempts=[];paused=false;playing=true;active=true;$('#rain-collection').hidden=true;
   $('#rain-intro').hidden=true;$('#rain-result').hidden=true;$('#rain-drop').hidden=false;$('#rain-zone').hidden=false;$('#rain-choices').hidden=mode!=='choice';$('#rain-form').hidden=mode!=='type';$('#rain-pause').textContent='일시정지';
   $('#rain-feedback').textContent='시작! 떨어지는 단서의 정답을 맞히세요.';last=performance.now();next(last);hud();clearInterval(timer);timer=setInterval(tick,50);if(mode==='type')$('#rain-input').focus();onActivity();
  }
  function pause(){if(!playing)return;const now=performance.now();if(!paused){tick();if(!playing)return;paused=true;last=now;$('#rain-drop').hidden=true;$('#rain-choices').hidden=true;$('#rain-form').hidden=true;$('#rain-pause').textContent='계속하기';$('#rain-feedback').textContent='일시정지 · 계속하기를 누르면 재개합니다.';}else{deadline+=now-last;last=now;paused=false;$('#rain-drop').hidden=false;$('#rain-choices').hidden=mode!=='choice';$('#rain-form').hidden=mode!=='type';$('#rain-pause').textContent='일시정지';if(mode==='type')$('#rain-input').focus();}active=playing&&!paused;onActivity();}
  root.addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b)return;
   if(b.dataset.rainFilter){const onlyWrong=b.dataset.rainFilter==='wrong';$('#rain-review-list').innerHTML=reviewMarkup(onlyWrong);root.querySelectorAll('[data-rain-filter]').forEach(button=>{const selected=button===b;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));});return;}
   if(b.id==='rain-start')start();
   if(b.id==='rain-restart'){$('#rain-arena').hidden=false;score=combo=0;lives=3;remaining=90000;hud();$('#rain-result').hidden=true;$('#rain-intro').hidden=false;$('#rain-feedback').textContent='90초 · 방어력 3개 · 정답률과 게임 포인트를 따로 집계 · 최고 기록은 5문항부터';showBest(); }
   if(b.id==='rain-pause')pause();
   if(b.id==='rain-end'&&playing)finish('게임 종료');
   if(b.id==='rain-skip'&&playing&&!paused){const id=current.id;tick();if(playing&&id===current.id)resolve(false,performance.now(),null,'skip');}
   if(b.dataset.rainAnswer!==undefined&&playing&&!paused){const id=current.id,number=Number(b.dataset.rainAnswer);tick();if(playing&&id===current.id&&Number.isInteger(number)&&number>=0&&number<choices.length)resolve(choices[number]===current.answer,performance.now(),`${number+1}번 · ${choices[number]}`);}
  },opts);
  $('#rain-form').addEventListener('submit',e=>{e.preventDefault();if(!playing||paused)return;const value=$('#rain-input').value.trim().slice(0,200);if(!value)return;const id=current.id;tick();if(playing&&id===current.id)resolve(normalize(value)===normalize(current.answer),performance.now(),value);},opts);
  document.addEventListener('keydown',e=>{if(!playing||paused||mode!=='choice'||e.repeat||e.ctrlKey||e.altKey||e.metaKey||!/^([1-4])$/.test(e.key))return;e.preventDefault();$(`[data-rain-answer="${Number(e.key)-1}"]`).click();},opts);
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing&&!paused)pause();},opts);
  dispose=()=>{playing=false;active=false;clearInterval(timer);controller.abort();};
 }
 window.KeywordGame={mount,unmount:()=>dispose(),isPlaying:()=>active};
})();
