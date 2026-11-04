/* 외부 전송 없는 기능·학습 자료 검색. 생성형 AI 답변이 아닙니다. */
(() => {
 'use strict';
 const features=[
  {title:'기출문제 · 연도 선택',words:'기출 문제풀이 문제풀기 시험 회차 최신 연도 2022 2023 2024 2025 2026 cbt',text:'문제 풀이에서 연도를 고르면 수록된 회차를 반복해서 풀 수 있어요. 최신 기준 문제부터 시작해 보세요.',href:'#quiz'},
  {title:'산성비 · 키워드 게임',words:'산성비 게임 타자 재미 피곤 쉬기 휴식',text:'90초 동안 단서를 보고 답을 고르는 키워드 복습이에요. 계산·명령어는 기출과 핵심정리로 보충하세요.',href:'#game'},
  {title:'핵심정리 · 개념과 계산',words:'핵심정리 이론 개념 계산 서브넷 공부 암기 정리',text:'개념·포트·계산·명령어를 단원별로 볼 수 있어요. 기출에서 헷갈린 부분을 찾아보세요.',href:'#theory'},
  {title:'오늘의 학습',words:'오늘의학습 오늘 복습 추천 매일 오분 5분 시작',text:'키워드와 문제를 짧게 풀고, 기억 상태에 따라 다시 복습해요.',href:'#daily/5'},
  {title:'오답노트',words:'오답 틀린 틀렸 다시 복습 해설',text:'틀린 문제와 미응답을 모아 다시 풀 수 있어요.',href:'#wrong'},
  {title:'시험 자료 · 파일 추가',words:'파일 넣기 추가 업로드 드래그 드롭 hwp pdf 자료 원본',text:'파일을 끌어 놓아 이 브라우저에 보관해요. 파일 보관만으로 자동 채점 문제가 만들어지지는 않아요.',href:'#materials'},
  {title:'키워드 암기 · 문제 예시',words:'키워드 카드 단서 암기 예시',text:'단서를 보고 답을 떠올린 뒤, 문제 예시와 판별 근거를 펼쳐보세요.',href:'#keywords'},
  {title:'명령어 노트',words:'명령어 윈도우 리눅스 linux windows 옵션',text:'Windows·Linux 명령어를 목적과 옵션으로 검색해요.',href:'#commands'},
  {title:'학습 설정',words:'설정 테마 색 배경 화이트 블랙 다크 날짜 시험일 디데이 dday 내보내기 가져오기 백업',text:'시험일·화면 테마를 바꾸고 학습 기록을 내보내거나 가져올 수 있어요.',settings:true},
  {title:'학습 계획',words:'계획 플랜 일주일 7일 2주 14일 순서 전략',text:'기출 풀이 → 오답 재시험 → 해당 핵심정리 순서로 공부해 보세요. 날짜별 계획도 확인할 수 있어요.',href:'#plan'}
 ];
 const norm=s=>String(s).normalize('NFKC').toLowerCase().replace(/\s+/g,'');
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function search(query,data={}){
  const q=norm(query).slice(0,160);if(!q)return [];
  if(q.includes('산성비')&&/만|점수|비중|효과/.test(q))return [{title:'산성비만으로 준비해도 될까요?',text:'자료 검토에서 산성비 단서만으로 정답 근거를 확인한 문제는 2026년 200문항 중 44개(22%)였어요. 실제 시험 비중이나 예상 점수가 아니에요. 기출과 핵심정리를 함께 사용해 보세요.',href:'#quiz/current'},features[2]];
  const matches=features.map(f=>({item:f,score:f.words.split(' ').reduce((n,w)=>n+(q.includes(norm(w))?(w.length>=3?3:1):0),0)})).filter(x=>x.score>0);
  for(const k of data.keywords||[]){const answer=norm(k.answer),cue=norm(k.cue);if((answer.length>=2&&q.includes(answer))||(q.length>=2&&(answer.includes(q)||cue.includes(q))))matches.push({item:{title:k.answer,text:`${k.cue} · ${k.hint}`,href:'#keywords',term:k.answer},score:8});}
  for(const c of data.commands||[]){const name=String(c.command).split(' ')[0];if(name.length>=2&&q.includes(norm(name)))matches.push({item:{title:c.command,text:`${c.purpose} · ${c.hint||''}`,href:'#commands',term:name},score:9});}
  return matches.sort((a,b)=>b.score-a.score).slice(0,4).map(x=>x.item);
 }
 function mount(){
  const holder=document.createElement('div');holder.innerHTML=`<button class="helper-launch" type="button" aria-haspopup="dialog" aria-controls="feature-helper" aria-expanded="false"><span aria-hidden="true">⌕</span> 공부 도우미</button><dialog id="feature-helper" class="feature-helper" aria-labelledby="helper-title"><div class="helper-heading"><div><h2 id="helper-title">어떤 기능을 찾으세요?</h2><p>사이트 안에서 찾는 공부 도우미</p></div><button type="button" data-helper-close aria-label="공부 도우미 닫기">×</button></div><div class="helper-shortcuts">${['기출 어디 있어?','산성비만 해도 돼?','테마 바꾸기'].map(t=>`<button type="button" data-helper-prompt="${t}">${t}</button>`).join('')}</div><form class="helper-form"><label class="sr-only" for="helper-input">찾는 기능이나 학습 용어</label><input id="helper-input" maxlength="160" placeholder="기출, 오답, ipconfig…" autocomplete="off"><button class="button primary" type="submit">찾기</button></form><p class="helper-notice">AI 채팅이 아닌 기능·용어 검색이에요. 입력은 저장하거나 외부로 전송하지 않아요.</p><div class="helper-results" aria-live="polite" aria-atomic="true"></div></dialog>`;document.body.append(holder);
  const launch=holder.querySelector('.helper-launch'),dialog=holder.querySelector('dialog'),input=holder.querySelector('input'),results=holder.querySelector('.helper-results');
  function render(query){const found=search(query,window.STUDY_DATA);results.innerHTML=query?`<p class="helper-query">“${esc(query)}” 검색 결과</p>`:'';results.innerHTML+=found.length?found.map(r=>`<article><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p>${r.settings?'<button type="button" class="text-button" data-helper-settings>설정 열기 →</button>':`<a class="text-button" href="${r.href}" ${r.term?`data-helper-term="${esc(r.term)}"`:''}>${r.term?'관련 자료':'기능'} 열기 →</a>`}</article>`).join(''):`<p>${query?'일치하는 기능을 찾지 못했어요. 아래 메뉴에서 골라보세요.':'찾고 싶은 기능을 입력하거나 위 질문을 눌러보세요.'}</p><div class="helper-menu">${features.slice(0,8).map(f=>`<a href="${f.href}">${f.title}</a>`).join('')}</div>`;}
  function close(){dialog.close();launch.setAttribute('aria-expanded','false');launch.focus();}
  launch.addEventListener('click',()=>{input.value='';render('');dialog.showModal();dialog.scrollTop=0;launch.setAttribute('aria-expanded','true');input.focus();});
  dialog.addEventListener('close',()=>launch.setAttribute('aria-expanded','false'));
  dialog.addEventListener('click',e=>{const b=e.target.closest('[data-helper-close],[data-helper-prompt],[data-helper-settings],a');if(!b)return;if(b.hasAttribute('data-helper-close'))close();else if(b.dataset.helperPrompt){input.value=b.dataset.helperPrompt;render(input.value);}else if(b.hasAttribute('data-helper-settings')){close();document.querySelector('#settings-button').click();}else if(b.tagName==='A'){const term=b.dataset.helperTerm;close();if(term||b.getAttribute('href')==='#quiz'){e.preventDefault();document.dispatchEvent(new CustomEvent('study-helper-search',{detail:{view:b.getAttribute('href').slice(1),term:term||''}}));}}});
  holder.querySelector('form').addEventListener('submit',e=>{e.preventDefault();render(input.value.trim());});
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'&&!document.querySelector('dialog[open]')){e.preventDefault();launch.click();}});
  setInterval(()=>{launch.hidden=!!window.KeywordGame?.isPlaying();},1000);render('');
 }
 window.FeatureHelper={search,mount};
})();
