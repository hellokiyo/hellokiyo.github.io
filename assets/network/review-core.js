(function(root){
 'use strict';
 const DEFAULT_EXAM='2026-11-14',DAY=86400000;
 const dateKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 function valid(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T00:00:00');return !isNaN(d)&&dateKey(d)===s;}
 function plus(s,n){const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return dateKey(d);}
 function days(a,b){const parts=s=>s.split('-').map(Number);const [y,m,d]=parts(a),[Y,M,D]=parts(b);return Math.round((Date.UTC(Y,M-1,D)-Date.UTC(y,m-1,d))/DAY);}
 function catalog(data,questions){return [...data.keywords.map(k=>({id:k.id,category:k.category,question:k.example.question,options:k.example.options,answer:k.example.answer,explanation:k.example.explanation,cue:k.cue,concept:k.answer,trap:k.example.trap})),...questions];}
 const count=v=>Number.isSafeInteger(v)&&v>=0?Math.min(v,1000000):0;
 function clean(raw,items){
  const ids=new Set(items.map(i=>i.id)),entries={},s=raw&&typeof raw==='object'?raw:{};
  for(const [id,e] of Object.entries(s.entries||{})){if(!ids.has(id)||!e||typeof e!=='object')continue;entries[id]={studyCount:count(e.studyCount),correctCount:count(e.correctCount),wrongCount:count(e.wrongCount),consecutiveCorrect:count(e.consecutiveCorrect),lastStudiedAt:valid(e.lastStudiedAt)?e.lastStudiedAt:null,nextReviewAt:valid(e.nextReviewAt)?e.nextReviewAt:null,memoryRating:['remember','unsure','unknown'].includes(e.memoryRating)?e.memoryRating:'unknown',interval:count(e.interval),responseTime:Number.isFinite(e.responseTime)?Math.max(0,Math.min(e.responseTime,3600000)):null,note:typeof e.note==='string'?e.note.slice(0,500):'',answerHistory:Array.isArray(e.answerHistory)?e.answerHistory.filter(h=>h&&valid(h.date)&&typeof h.correct==='boolean').slice(-30).map(h=>({date:h.date,correct:h.correct,rating:['remember','unsure','unknown'].includes(h.rating)?h.rating:'unknown'})):[]};}
  const result={version:1,entries,session:null,lastResult:null,days:{}};
  for(const [d,n] of Object.entries(s.days||{}))if(valid(d))result.days[d]=count(n);
  if(s.lastResult&&valid(s.lastResult.date))result.lastResult={date:s.lastResult.date,total:count(s.lastResult.total),correct:count(s.lastResult.correct)};
  const a=s.session;
  if(a&&Array.isArray(a.queue)&&a.queue.length<=80&&a.queue.every(id=>ids.has(id))){
   const queue=a.queue.slice(),index=Math.min(count(a.index),queue.length),item=items.find(i=>i.id===queue[index]);
   const selected=Number.isInteger(a.selected)&&item&&a.selected>=0&&a.selected<item.options.length?a.selected:null;
   result.session={queue,index,selected,revealed:a.revealed===true&&selected!==null,note:typeof a.note==='string'?a.note.slice(0,500):'',intro:a.intro===true,minutes:[0,5,12,25].includes(a.minutes)?a.minutes:12,startedAt:Number.isFinite(a.startedAt)?a.startedAt:Date.now(),questionAt:Number.isFinite(a.questionAt)?a.questionAt:Date.now(),results:Array.isArray(a.results)?a.results.filter(r=>r&&ids.has(r.id)&&typeof r.correct==='boolean'&&['remember','unsure','unknown'].includes(r.rating)).slice(0,80).map(r=>({id:r.id,correct:r.correct,rating:r.rating})):[],retried:Array.isArray(a.retried)?[...new Set(a.retried.filter(id=>ids.has(id)))]:[]};
  }
  return result;
 }
 function weak(e){return !!e&&(e.wrongCount>=2||(e.studyCount>=3&&e.correctCount/e.studyCount<.6)||(e.studyCount>0&&e.memoryRating!=='remember'));}
 function review(state,item,{correct,rating,responseTime=null,note},examDate,today=dateKey()){
  const old=state.entries[item.id]||{},history=old.answerHistory||[],streak=correct&&rating==='remember'?count(old.consecutiveCorrect)+1:0;
  let interval=streak===0?1:streak===1?1:streak===2?3:Math.min(21,Math.max(7,(old.interval||3)*2));
  if((old.wrongCount||0)>=(old.correctCount||0)+2)interval=Math.min(interval,3);
  const next=plus(today,interval),cap=valid(examDate)?plus(examDate,-1):null;
  state.entries[item.id]={studyCount:count(old.studyCount)+1,correctCount:count(old.correctCount)+(correct?1:0),wrongCount:count(old.wrongCount)+(correct?0:1),consecutiveCorrect:streak,lastStudiedAt:today,nextReviewAt:cap&&cap>today&&next>cap?cap:next,memoryRating:rating,interval,responseTime,note:typeof note==='string'?note.slice(0,500):old.note||'',answerHistory:[...history,{date:today,correct:!!correct,rating}].slice(-30)};
  state.days[today]=(state.days[today]||0)+1;
  return state.entries[item.id];
 }
 function reschedule(state,examDate,today=dateKey()){
  for(const e of Object.values(state.entries)){if(!e.lastStudiedAt)continue;const next=plus(e.lastStudiedAt,e.interval||1),cap=valid(examDate)?plus(examDate,-1):null;e.nextReviewAt=cap&&cap>today&&next>cap?cap:next;}
 }
 function select(items,state,wrong=[],limit=12,today=dateKey(),category='전체'){
  const ranked=items.filter(i=>category==='전체'||i.category===category).map((item,index)=>{const e=state.entries[item.id];return {item,index,rank:e?.nextReviewAt&&e.nextReviewAt<=today?0:weak(e)||wrong.includes(item.id)?1:!e?2:3,date:e?.nextReviewAt||''};}).sort((a,b)=>a.rank-b.rank||a.date.localeCompare(b.date)||a.index-b.index);
  // Priority tiers are preserved; categories alternate within each tier.
  const output=[];
  for(let rank=0;rank<4;rank++){let group=ranked.filter(r=>r.rank===rank);while(group.length){const previous=output.at(-1)?.category;let n=group.findIndex(r=>r.item.category!==previous);if(n<0)n=0;output.push(group.splice(n,1)[0].item);}}
  return output.slice(0,limit);
 }
 function summary(state,items,today=dateKey()){
  const entries=Object.values(state.entries),recent=entries.flatMap(e=>e.answerHistory).filter(h=>days(h.date,today)>=0&&days(h.date,today)<7);
  let streak=0,d=state.days[today]?today:plus(today,-1);while(state.days[d]){streak++;d=plus(d,-1);}
  return {due:entries.filter(e=>e.nextReviewAt&&e.nextReviewAt<=today).length,weak:entries.filter(weak).length,learned:entries.length,total:items.length,recent:recent.length?Math.round(recent.filter(h=>h.correct).length/recent.length*100):null,streak,today:state.days[today]||0};
 }
 function plan(examDate,today=dateKey()){
  const left=valid(examDate)?days(today,examDate):null;
  return left===null?{title:'시험일을 정하고 복습 시작',goal:'복습할 키워드와 오답을 먼저 확인하세요.'}:left<0?{title:'시험 이후에도 기억 유지',goal:'기한이 지난 복습부터 가볍게 이어가세요.'}:left===0?{title:'시험 당일 · 익숙한 내용 확인',goal:'남은 오답과 포트·명령어만 짧게 확인하세요.'}:left<=2?{title:'최종 복습',goal:'오답·핵심 키워드·서브넷·명령어를 확인하세요.'}:left<=4?{title:'실전 적응',goal:'50분 실전 풀이 후 취약한 단원을 복습하세요.'}:left<=7?{title:'기억 강화',goal:'복습 기한이 지난 문제와 혼합 문제를 풀어보세요.'}:{title:'전체 범위 학습',goal:'핵심 개념을 익히고 첫 인출 연습으로 취약 개념을 찾으세요.'};
 }
 const api={DEFAULT_EXAM,dateKey,plus,days,catalog,clean,review,reschedule,select,summary,plan,weak};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;root.ReviewCore=api;
})(typeof window!=='undefined'?window:globalThis);
