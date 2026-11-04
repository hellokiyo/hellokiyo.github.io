/* 브라우저 안에서만 보관하는 최근 7일 활성 시간. 성적 예측에 사용하지 않습니다. */
(() => {
 'use strict';
 const KEY='network-study-coach:v1',MODES=['game','theory','past','practice','daily','keywords','commands','wrong'];
 const localDay=t=>{const d=new Date(t);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
 function clean(raw,now=Date.now()){
  const days={};for(let i=0;i<7;i++){const d=new Date(now);d.setDate(d.getDate()-i);const key=localDay(d);const row=raw?.days?.[key]||{};days[key]=Object.fromEntries(MODES.map(m=>[m,Math.min(86400,Math.max(0,Number(row[m])||0))]));}
  const ids=raw?.dismissed?.day===localDay(now)&&Array.isArray(raw.dismissed.ids)?raw.dismissed.ids.filter(x=>typeof x==='string').slice(0,10):[];
  return {days,dismissed:{day:localDay(now),ids}};
 }
 function choose(data,sessionTheory=0){
  const totals=Object.fromEntries(MODES.map(m=>[m,Object.values(data.days).reduce((sum,d)=>sum+(d[m]||0),0)]));
  const total=Object.values(totals).reduce((a,b)=>a+b,0);
  if(sessionTheory>=900)return {id:'theory-break',title:'잠깐, 산성비로 기억을 꺼내볼까요?',body:'핵심정리를 15분 이상 보고 있어요. 원한다면 짧은 퀴즈로 전환해 보세요.',reason:'계속 읽기보다 답을 떠올리는 시간을 섞어보자는 제안이에요. 피로도를 측정한 것은 아니며, 산성비는 5분 복습용으로 권해요.',href:'#game',label:'산성비로 짧게 복습'};
  if(total>=600&&totals.game>=300&&totals.game/total>=.6)return {id:'game-balance',title:'키워드는 익숙해졌나요? 기출에도 적용해 봐요.',body:`최근 7일 활성 학습 시간의 ${Math.round(totals.game/total*100)}%가 산성비예요. 이번엔 기출 한 회차나 핵심정리를 살펴보세요.`,reason:'자료 검토에서 산성비 단서만으로 정답 근거를 확인한 문제는 2026년 200문항 중 44개(22%)였어요. 계산·명령어·긴 보기는 기출과 핵심정리로 보충해요. 실제 시험 비중이나 예상 점수가 아니에요.',href:'#quiz/current',label:'최신 기출 풀어보기',secondary:['#theory','핵심정리 보기']};
  if(total>=600&&totals.past/total>=.65)return {id:'past-balance',title:'반복한 문제, 이유까지 설명할 수 있나요?',body:'최근 학습이 기출에 집중되어 있어요. 헷갈린 개념을 핵심정리에서 확인해 보세요.',reason:'이전 기출에 핵심정리를 더했을 때, 2026년 문제의 정답 근거 충족도가 평균 76점에서 88점으로 늘었어요. 개인의 성적 상승을 뜻하지 않아요.',href:'#theory',label:'핵심정리로 이유 확인'};
  return {id:'start',title:'기출로 확인하고, 모르는 개념만 보충해요.',body:'기출을 푼 뒤 틀린 부분의 핵심정리를 찾아보세요. 산성비는 짧은 키워드 복습으로 활용해요.',reason:'2026년 1~4회 자료 검토에서 기출+핵심정리는 평균 88점 분량의 정답 근거를 담고 있었어요. 실제 예상 점수가 아닌 자료 범위 비교예요.',href:'#quiz/current',label:'최신 기출 풀어보기',secondary:['#theory','핵심정리 보기']};
 }
 const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function markup(p){return `<section class="study-coach" aria-label="다음 학습 제안"><div class="coach-eyebrow">다음 공부, 이렇게 해볼까요?<button type="button" data-coach-dismiss="${p.id}" aria-label="이 제안 오늘 숨기기">×</button></div><h2>${esc(p.title)}</h2><p>${esc(p.body)}</p><div class="coach-actions"><a class="button secondary" href="${p.href}">${p.label} →</a>${p.secondary?`<a class="text-button" href="${p.secondary[0]}">${p.secondary[1]}</a>`:''}</div><p class="coach-reason"><b>추천 이유</b> ${esc(p.reason)}</p><details class="coach-evidence"><summary>숫자의 근거와 계산 기준 보기</summary><p>2026년 1~4회 200문항을 수동 검토했어요. 2026년 기출을 학습 원천에서 제외하고, 충분한 정답 근거를 확인한 문항만 2점으로 환산했어요.</p><table><caption>자료 충족도 환산점 · 실제 응시 성적 아님</caption><thead><tr><th scope="col">자료</th><th scope="col">1회</th><th scope="col">2회</th><th scope="col">3회</th><th scope="col">4회</th><th scope="col">평균</th></tr></thead><tbody><tr><th scope="row">산성비</th><td>30</td><td>22</td><td>16</td><td>20</td><td>22</td></tr><tr><th scope="row">핵심정리</th><td>68</td><td>70</td><td>66</td><td>66</td><td>67.5</td></tr><tr><th scope="row">이전 기출</th><td>80</td><td>82</td><td>78</td><td>64</td><td>76</td></tr><tr><th scope="row">기출+정리</th><td>90</td><td>92</td><td>90</td><td>80</td><td>88</td></tr></tbody></table><p>산성비 44/200문항 = 22%. 전체 콘텐츠 기준이며 한 번의 이용 효과가 아니에요. 단일 검토자의 수동 판정이고, 4회차는 공식 대조 전 학습용 정답 기준이에요. 이용 비율은 이 브라우저에서 기록한 최근 7일 활성 시간이며, 새 기록부터 집계해요. 추천 기준(산성비 60%·기출 65%, 누적 10분 이상)은 서비스 운영 규칙이며 학습 효과 실험값이 아니에요.</p><a href="STUDY-PLAN-7-DAYS.md" download>전체 31개 조합·7일 계획 내려받기 ↓</a></details></section>`;}
 function mount({root,getMode,getView}){
  let data;try{data=clean(JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{data=clean({});}
  let last=Date.now(),lastAction=last,mode=getMode(),theoryRun=0;
  function save(){try{localStorage.setItem(KEY,JSON.stringify(data));}catch{}}
  function draw(){
   const view=getView();let host=root.querySelector('[data-study-coach]');
   const target=view==='game'?root.querySelector('#rain-result:not([hidden])'):view==='quiz'?root.querySelector('.score-card'):null;
   if(!['dashboard','theory'].includes(view)&&!target){host?.remove();return;}
   const p=choose(data,theoryRun);if(view!=='dashboard'&&p.id==='start'){host?.remove();return;}
   if(data.dismissed.ids?.includes(p.id)){host?.remove();return;}
   if(!host){host=document.createElement('div');host.dataset.studyCoach='';if(target)target.append(host);else if(view==='dashboard')root.querySelector('.home-pulse').after(host);else root.append(host);}
   if(host.dataset.recommendation!==p.id){host.dataset.recommendation=p.id;host.innerHTML=markup(p);}
  }
  function tick(){const now=Date.now(),next=getMode(),delta=Math.min(15,Math.max(0,(now-last)/1000));data=clean(data,now);
   if(MODES.includes(mode)&&document.visibilityState==='visible'&&document.hasFocus()&&now-lastAction<120000){data.days[localDay(now)][mode]+=delta;if(mode==='theory')theoryRun+=delta;save();}
   if(next!=='theory')theoryRun=0;mode=next;last=now;draw();
  }
  function route(){tick();lastAction=Date.now();draw();}
  ['pointerdown','keydown','scroll','touchstart'].forEach(e=>document.addEventListener(e,()=>{lastAction=Date.now();},{passive:true,capture:true}));
  document.addEventListener('visibilitychange',()=>{tick();last=Date.now();});
  root.addEventListener('click',e=>{const b=e.target.closest('[data-coach-dismiss]');if(b){data.dismissed.ids=[...(data.dismissed.ids||[]),b.dataset.coachDismiss];save();draw();}});
  setInterval(tick,15000);window.addEventListener('pagehide',tick);
  return {route,refresh:tick,reset(){data=clean({});theoryRun=0;last=lastAction=Date.now();save();draw();}};
 }
 window.StudyCoach={mount,choose,clean,markup};
})();
