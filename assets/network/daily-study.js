(() => {
 'use strict';let dispose=()=>{};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function mount({root,state,items,save,toast,presetMinutes=null,onReview=()=>{}}){
  dispose();const R=window.ReviewCore,abort=new AbortController();let timer;
  const $=s=>root.querySelector(s),A=()=>state.adaptive;
  function setup(){
   const stats=R.summary(A(),items),plan=R.plan(state.examDate);
   root.innerHTML=`<div class="page-heading"><div><h1>오늘의 학습</h1><p>떠올리기 → 이유 확인 → 다음 복습 예약</p></div></div><section class="panel daily-setup"><span class="label-tag">${esc(plan.title)}</span><h2>오늘도 조금씩, 기억을 단단하게.</h2><p>${esc(plan.goal)}</p><p>복습 ${stats.due}개 · 취약 ${stats.weak}개 · 최근 정답률 ${stats.recent===null?'—':stats.recent+'%'}</p><label for="daily-minutes">학습 시간</label><select id="daily-minutes"><option value="5">5분 · 빠른 복습 (5문항)</option><option value="12" selected>12분 · 기본 학습 (12문항)</option><option value="25">25분 · 집중 학습 (20문항)</option><option value="0">자유 학습 (20문항)</option></select><label for="daily-category">학습 범위</label><select id="daily-category"><option>전체</option>${[...new Set(items.map(i=>i.category))].map(c=>`<option>${esc(c)}</option>`).join('')}</select><p class="fine-print">기한이 지난 복습 → 취약·오답 → 미학습 순서입니다. 혼합 학습은 단원을 번갈아 출제합니다. 시간은 권장 시간이며, 지나도 문제를 중단하지 않습니다.</p><button class="button primary full" id="daily-start">오늘의 학습 시작 →</button></section>`;
  }
  function start(){
   const minutes=Number($('#daily-minutes').value),limit=minutes===5?5:minutes===12?12:20,chosen=R.select(items,A(),state.wrong,limit,R.dateKey(),$('#daily-category').value);
   if(!chosen.length){toast('이 범위에 문제가 없습니다.');return;}
   A().session={queue:chosen.map(i=>i.id),index:0,selected:null,revealed:false,note:'',intro:true,minutes,startedAt:Date.now(),questionAt:Date.now(),results:[],retried:[]};save();render();
  }
  function render(){
   const s=A().session;if(!s){setup();return;}
   if(s.index>=s.queue.length){finish();return;}
   const q=items.find(i=>i.id===s.queue[s.index]);
   if(s.intro){
    const fresh=s.queue.map(id=>items.find(i=>i.id===id)).filter(i=>i.cue&&!A().entries[i.id]).slice(0,3);
    root.innerHTML=`<div class="page-heading"><div><h1>${s.minutes===12?'먼저 개념 3분':'먼저 핵심 개념'}</h1><p>새 개념을 확인한 뒤, 다음 화면에서 기억을 꺼내봅니다.</p></div></div><section class="panel">${fresh.length?fresh.map(i=>`<article class="daily-concept"><h2>${esc(i.cue)} → ${esc(i.concept)}</h2><p>${esc(i.explanation)}</p></article>`).join(''):'<h2>오늘은 기억 꺼내기부터</h2><p>복습할 문제와 취약한 개념이 준비되어 있습니다.</p>'}<p class="fine-print">12분 기준: 개념 3분 → 인출 4분 → 이유 설명 3분 → 놓친 내용 복습 2분. 학습 속도에 맞게 진행하세요.</p><button class="button primary" id="daily-recall">이제 가리고 떠올리기 →</button></section>`;return;
   }
   root.innerHTML=`<div class="page-heading"><div><h1>기억 꺼내기</h1><p>${s.index+1} / ${s.queue.length} · ${esc(q.category)}</p></div><span id="daily-clock" class="quiz-status"></span></div><div class="progress-track"><div style="width:${s.index/s.queue.length*100}%"></div></div><section class="panel daily-question"><span class="label-tag">${q.id.startsWith('nw2-')?esc(q.id.slice(4,8)+'년 '+Number(q.id.slice(9,11))+'회 기출'):'학습 가이드 기반 자체 연습'}${q.paperId&&q.paperId.slice(4,11)<'2025-03'?' · 이전 출제기준':''}</span><h2>${esc(q.question)}</h2>${(q.images||[]).map(src=>`<figure class="paper-figure"><img src="${esc(src)}" alt="문제의 원문 표·그림"></figure>`).join('')}<div class="answers" aria-label="답안 선택">${q.options.map((option,i)=>`<button class="answer ${s.selected===i?'selected':''} ${s.revealed&&i===q.answer?'correct':''}" data-daily-answer="${i}" ${s.revealed?'disabled':''}><span>${i+1}</span>${esc(option)}</button>`).join('')}</div>${s.revealed?`<div class="explanation"><strong>${s.selected===q.answer?'정답입니다.':'다시 기억해 두세요.'} 정답 ${q.answer+1}번</strong><p>${esc(q.explanation)}</p>${q.trap?`<p>구별할 점 · ${esc(q.trap)}</p>`:''}</div><label for="daily-note">왜 이 답일까요? 한 문장으로 설명해 보세요. (선택)</label><textarea id="daily-note" maxlength="500" placeholder="직접 설명하고 위 해설과 비교해 보세요. 자동 채점하지 않습니다.">${esc(s.note||A().entries[q.id]?.note||'')}</textarea><p>맞혔어도 찍었다면 ‘헷갈림’을 선택하세요.</p><div class="memory-actions"><button class="button secondary" data-daily-rate="unknown">모름 · 다시 연습</button><button class="button secondary" data-daily-rate="unsure">헷갈림 · 내일 복습</button><button class="button primary" data-daily-rate="remember">기억남 →</button></div>`:`<button class="button primary full" id="daily-check" ${s.selected===null?'disabled':''}>정답과 이유 확인</button>`}<button class="text-button" id="daily-finish">여기까지 학습 마치기</button></section>`;
   clock();
  }
  function clock(){const s=A().session,e=$('#daily-clock');if(!s||!e)return;const remaining=s.minutes*60-Math.floor((Date.now()-s.startedAt)/1000);e.textContent=s.minutes===0?'자유 학습':remaining>0?`권장 시간 ${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`:'권장 시간 완료 · 현재 문제를 마저 풀어도 됩니다.';}
  function finish(){
   const s=A().session;if(!s)return;const results=s.results,correct=results.filter(i=>i.correct).length;
   if(results.length)A().lastResult={date:R.dateKey(),total:results.length,correct};
   A().session=null;save();const weak=[...new Set(results.filter(i=>!i.correct||i.rating!=='remember').map(i=>i.id))];
   root.innerHTML=`<div class="page-heading"><div><h1>${results.length?'오늘도 기억을 쌓았어요.':'다음에 이어서 도전해 보세요.'}</h1><p>${results.length?'학습 결과와 복습 일정이 저장되었습니다.':'답을 확인하고 기억 정도를 평가하면 학습 기록이 쌓입니다.'}</p></div></div><section class="panel daily-result"><h2>${results.length?Math.round(correct/results.length*100)+'%':'—'}</h2><p>확인한 문항 ${results.length} · 정답 ${correct} · 기억이 약한 개념 ${weak.length}개</p>${weak.map(id=>{const q=items.find(i=>i.id===id);return `<article class="daily-concept"><strong>${esc(q.cue||q.question)}</strong><p>정답 · ${esc(q.options[q.answer])}</p><p>${esc(q.explanation)}</p><small>다음 복습 · ${A().entries[id].nextReviewAt}</small></article>`;}).join('')}<p>${results.length?'오늘의 학습 완료 ✓ · 다음 날에는 기한이 된 복습을 먼저 추천합니다.':''}</p><button class="button primary" id="daily-again">추가 학습</button><a class="button secondary" href="#dashboard">학습 현황 →</a></section>`;
  }
  root.addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b)return;
   if(b.id==='daily-start'){start();return;}
   if(b.id==='daily-again'){setup();return;}
   const s=A().session;if(!s)return;
   if(b.id==='daily-recall'){s.intro=false;s.questionAt=Date.now();save();render();return;}
   if(b.dataset.dailyAnswer!==undefined&&!s.revealed){s.selected=Number(b.dataset.dailyAnswer);save();render();return;}
   if(b.id==='daily-check'&&s.selected!==null){s.revealed=true;save();render();return;}
   if(b.dataset.dailyRate&&s.revealed){
    const q=items.find(i=>i.id===s.queue[s.index]),correct=s.selected===q.answer,rating=b.dataset.dailyRate;
    R.review(A(),q,{correct,rating,responseTime:Date.now()-s.questionAt,note:$('#daily-note').value},state.examDate);
    if(!q.id.startsWith('k')){if(!correct&&!state.wrong.includes(q.id))state.wrong.push(q.id);if(correct&&rating==='remember')state.wrong=state.wrong.filter(id=>id!==q.id);}
    onReview(q.id,correct&&rating==='remember');
    s.results.push({id:q.id,correct,rating});
    if((!correct||rating==='unknown')&&!s.retried.includes(q.id)){s.queue.push(q.id);s.retried.push(q.id);}
    s.index++;s.selected=null;s.revealed=false;s.note='';s.questionAt=Date.now();save();render();window.scrollTo({top:0,behavior:'instant'});return;
   }
   if(b.id==='daily-finish')finish();
  },{signal:abort.signal});
  root.addEventListener('input',e=>{if(e.target.id==='daily-note'){const s=A().session,q=s&&items.find(i=>i.id===s.queue[s.index]);if(q){s.note=e.target.value.slice(0,500);save();}}},{signal:abort.signal});
  timer=setInterval(clock,1000);dispose=()=>{clearInterval(timer);abort.abort();};
  if(A().session)render();else{setup();if(presetMinutes===5){$('#daily-minutes').value='5';start();}}
 }
 window.DailyStudy={mount,unmount:()=>dispose()};
})();
