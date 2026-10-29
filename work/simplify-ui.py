from pathlib import Path
import re
root=Path.cwd()
p=root/'assets/network/app.js'
s=p.read_text(encoding='utf-8-sig')
start=s.index('function networkArt()')
end=s.index('function searchBar(',start)
s=s[:start]+'''function dashboard(){
 const done=state.mastered.length,best=bestScore(),plan=D.plan[todayPlan()],tasks=state.routines[C.localDate()]||[],current=state.session;
 main.innerHTML=heading('','학습 현황','오늘 할 공부를 선택하세요.',`<button class="button secondary" data-settings>${dday()} · 시험일 설정</button>`)+
 (current?`<div class="session-banner"><span>진행 중인 ${current.mode==='exam'?'실전 연습':'문제 풀이'}</span><a class="button primary" href="#quiz">이어서 풀기 →</a></div>`:'')+
 `<div class="exam-summary"><div><span>키워드 암기</span><strong>${done}<small> / ${D.keywords.length}</small></strong></div><div><span>최고 점수</span><strong>${best===null?'—':best}<small>${best===null?'':'점'}</small></strong></div><div><span>남은 오답</span><strong>${state.wrong.length}<small>문제</small></strong></div><div><span>학습 계획</span><strong>${state.plans.length}<small> / 14일</small></strong></div></div>
 <section class="study-launch"><a href="#keywords"><strong>키워드 암기</strong><span>${D.keywords.length-done}개 미암기</span><b aria-hidden="true">→</b></a><a href="#commands"><strong>명령어 노트</strong><span>Windows · Linux · 설정</span><b aria-hidden="true">→</b></a><a href="#quiz"><strong>문제 풀이</strong><span>10문제 연습 · 50분 실전</span><b aria-hidden="true">→</b></a><a href="#wrong"><strong>오답 복습</strong><span>${state.wrong.length}문제 다시 풀기</span><b aria-hidden="true">→</b></a></section>
 <section class="panel routine-panel"><div class="section-heading"><h2>오늘 할 일</h2><a href="#plan">14일 계획 →</a></div>${['키워드 10개 암기','명령어와 옵션 복습','10문제 풀고 오답 확인'].map((t,i)=>`<div class="routine-row"><input class="routine-check" type="checkbox" id="routine-${i}" data-routine="${i}" ${tasks.includes(i)?'checked':''}><label for="routine-${i}" class="${tasks.includes(i)?'routine-complete':''}">${t}</label><small>${[10,15,15][i]}분</small></div>`).join('')}<a class="today-study" href="#${plan.view}">추천 · Day ${plan.day+1} <strong>${esc(plan.title)}</strong> →</a></section>`;
}
'''+s[end:]
s=s.replace("function heading(kicker,title,description,extra=''){return `<div class=\"page-heading\"><div><div class=\"eyebrow\">${kicker}</div><h1>${title}</h1><p>${description}</p></div>${extra}</div>`;}","""function heading(kicker,title,description,extra=''){
 const labels={KEYWORD_FLASHCARDS:'키워드 암기'};
 const titles={'KEYWORD FLASHCARDS':'키워드 암기','COMMAND REFERENCE':'명령어 노트','CORE CONCEPTS':'핵심 이론','14-DAY STUDY PLAN':'14일 학습 계획','PRACTICE MAKES PROGRESS':'문제 풀이','REVIEW YOUR MISTAKES':'오답 복습','SESSION COMPLETE':'채점 결과'};
 const descriptions={'KEYWORD FLASHCARDS':'단서를 읽고 정답을 떠올려 보세요.','COMMAND REFERENCE':'목적 · 명령어 · 옵션을 함께 확인하세요.','CORE CONCEPTS':'시험에 필요한 개념과 계산을 정리했습니다.','14-DAY STUDY PLAN':'하루 한 주제씩 완료 체크하세요.','PRACTICE MAKES PROGRESS':'자체 제작 72문항 · 정답과 해설 제공','REVIEW YOUR MISTAKES':'다시 맞힌 문제는 오답장에서 제외됩니다.','SESSION COMPLETE':'틀린 문제와 미응답은 오답장에 저장됩니다.'};
 return `<div class="page-heading"><div><h1>${titles[kicker]||title}</h1><p>${descriptions[kicker]||description}</p></div>${extra}</div>`;
}""")
s=s.replace(" const labels={KEYWORD_FLASHCARDS:'키워드 암기'};\n",'')
s=s.replace("storageOK?'이 브라우저에 자동 저장'","storageOK?'자동 저장'")
s=s.replace('<div class="note">단어 하나만 보고 고르기보다 질문의 방향과 ‘옳지 않은 것’ 조건을 먼저 확인하세요.</div>','')
s=s.replace('<span class="small-label">${k.id.replace(\'k\',\'\').padStart(2,\'0\')} / KEYWORD</span>','<span class="card-index">${String(Number(k.id.slice(1))+1).padStart(2,\'0\')}</span>')
s=s.replace('정답 떠올린 뒤 확인하기 <span>↗</span>','정답 보기')
s=s.replace("open?'정답 떠올린 뒤 확인하기 ↗':k.answer","open?'정답 보기':k.answer")
s=s.replace('○ 암기 체크','암기 체크')
s=s.replace('<div class="note">학습용 예시입니다. 삭제·종료·계정·네트워크 변경 명령은 실습 환경에서 사용하세요.</div>','<p class="inline-note">변경·삭제 명령은 실습 환경에서 사용하세요.</p>')
s=s.replace('<div class="note">정답 번호보다 판단 근거를 기억하세요. 실전 연습은 제출 후 해설을, 빠른 연습은 문제별 해설을 확인할 수 있어요.</div>','')
s=s.replace('<div class="note">매일 20분 복습 → 40~60분 주제 학습 → 40~50분 문제 풀이 → 20~40분 오답 정리</div>','<p class="inline-note">복습 20분 → 주제 학습 40~60분 → 문제 풀이 40~50분 → 오답 20~40분</p>')
s=s.replace('가볍게 10문제','10문제 연습').replace('실전처럼 50문제','50문제 실전').replace('틀린 문제 다시','오답 다시 풀기')
s=s.replace('부담 없이 감각을 확인해요.<br>정답 확인 후 해설을 바로 읽을 수 있어요.','시간 제한 없음 · 문제별 해설')
s=s.replace('50분 타이머와 함께 연습해요.<br>제출하거나 시간이 끝나면 자동 채점해요.','50분 제한 · 제출 후 일괄 채점')
s=s.replace('오답장에 모인 ${state.wrong.length}문제.<br>다시 맞힌 문제는 오답장에서 제외돼요.','${state.wrong.length}문제 · 맞히면 오답에서 제외')
p.write_text(s,encoding='utf-8')
p=root/'index.html';s=p.read_text(encoding='utf-8-sig')
s=s.replace('<small>NETWORK STUDY NOTES</small>','<small>네트워크관리사 2급</small>')
s=s.replace('<div class="sidebar-label">MY STUDY SPACE</div>','')
s=s.replace(' 학습 대시보드</a>',' 학습 현황</a>')
s=re.sub(r'<div class="sidebar-bottom">.*?</div>', '<div class="sidebar-bottom"><a href="README.md" download="README.md">전체 가이드 내려받기 ↓</a></div>',s)
s=s.replace('<div class="breadcrumb">자격증 학습 <span>/</span> <strong>네트워크관리사 2급</strong></div>','<div class="breadcrumb"><strong>네트워크관리사 2급</strong> · 필기</div>')
s=s.replace('이 브라우저에 자동 저장','자동 저장')
s=re.sub(r'<footer class="footer">.*?</footer>','<footer class="footer">개인 학습용 · 연습 문제는 공식 기출이 아닙니다.</footer>',s)
p.write_text(s,encoding='utf-8')
