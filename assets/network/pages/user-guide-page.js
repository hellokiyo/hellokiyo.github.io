/* 처음 사용하는 사람을 위한 정적 사용법. 로그인·외부 요청·새 저장소를 만들지 않습니다. */
(function (root) {
  "use strict";
  function render(practiceOnly = false, hasPapers = !practiceOnly) {
    return `<div class="page-heading"><div><h1>처음이라면? 1분 사용법</h1><p>하나만 골라 시작해도 괜찮아요.</p></div></div>
      <section class="panel guide-welcome"><span class="label-tag">이렇게 하면 돼요</span><h2>풀고 → 이유를 보고 → 다시 풀어요</h2><p>${practiceOnly && !hasPapers ? "선택한 시험의 자체 기초 문제를 연습하는 공부방이에요. 실제 기출이나 시험 전 범위를 대신하지 않아요." : "선택한 시험의 기출을 풀고 복습하는 공부방이에요."} 가입하거나 로그인할 필요가 없어요.</p><a class="button primary" href="#daily/5">딱 5분만 시작하기 →</a></section>
      <div class="guide-grid">
        <section class="panel"><h2>① 문제를 골라요</h2><p>${practiceOnly && !hasPapers ? "<strong>문제 풀이</strong>를 열고 10문제 연습이나 시간 제한 기초 연습을 골라요. 현재 기출 출처 링크와 풀 수 있는 자체 문제는 서로 달라요." : "<strong>문제 풀이</strong>를 열고 연도와 회차를 골라요. 처음에는 최신 회차부터 해 보세요."}</p><p>짧게 하고 싶으면 <strong>10문제 연습</strong>, 기억을 꺼내 보고 싶으면 <strong>오늘의 학습</strong>을 골라요.</p><a class="text-button" href="#quiz">문제 고르러 가기 →</a></section>
        <section class="panel"><h2>② 답과 이유를 봐요</h2><p>보기를 하나 누른 뒤 <strong>정답 확인</strong> 또는 <strong>정답과 이유 확인</strong>을 눌러요. 실전 연습은 제출한 뒤에 답을 볼 수 있어요.</p><p>왜 그런지 어렵다면 <strong>핵심정리</strong>에서 ${practiceOnly ? "개념과 설명을 읽어보세요." : "그림을 보세요."} 명령어는 <strong>명령어 노트</strong>에서 찾아요.</p><a class="text-button" href="#theory">${practiceOnly ? "개념 확인하기" : "그림으로 이해하기"} →</a></section>
        <section class="panel"><h2>③ 틀린 것을 다시 풀어요</h2><p><strong>오답노트</strong>에 틀린 것이 모여요. ‘오늘의 학습’, ‘${practiceOnly ? "자체 문제풀이" : "기출문제"}’처럼 어디에서 틀렸는지도 골라 볼 수 있어요.</p><p>오늘의 학습에서 맞혔어도 찍었다면 <strong>헷갈림</strong>을 눌러요. 정답을 알고 이유도 알면 <strong>기억남</strong>을 눌러요.</p><a class="text-button" href="#wrong">오답노트 보기 →</a></section>
      </div>
      <section class="panel guide-questions"><h2>이럴 때는 이렇게!</h2><details><summary>중요한 문제만 저장하고 다시 풀고 싶어요.</summary><p>문제에서 <strong>☆ 이 문제 북마크</strong>를 눌러요. <strong>문제 선택으로 → 내게 맞춰 풀기 → 학습 상태 → 북마크만</strong>을 고르면 저장한 문제만 나와요. 채점 뒤 <strong>이 문제들 다시 풀기</strong>는 같은 문제를 다시 보여 줘요.</p><a class="text-button" href="#quiz/setup">맞춤 연습 열기 →</a></details>
        <details><summary>‘모름 · 헷갈림 · 기억남’은 뭐예요?</summary><p><strong>모름:</strong> 다시 연습하고 싶어요. <strong>헷갈림:</strong> 아직 확실하지 않아요. <strong>기억남:</strong> 답과 이유를 알고 있어요.</p><p>틀린 답은 확인하는 순간 오답노트에 들어가요. 틀렸는데 기억남을 눌러도 없어지지 않아요. 나중에 맞히고 기억남을 고르면 오늘의 학습 목록에서 빠져요.</p></details>
        <details><summary>오늘의 학습을 계속하고 싶어요.</summary><p>이번 묶음이 끝나면 <strong>추가 학습</strong>을 눌러요. ‘모름’이나 틀린 문제는 같은 묶음에서 한 번 더 나올 수 있어요.</p></details>
        <details><summary>산성비는 뭐예요?</summary><p>90초 동안 떨어지는 단서를 보고 답을 맞히는 게임이에요. 끝나면 <strong>정답 목록</strong>을 열어 틀린 답과 내가 고른 답을 보세요.</p><p>게임 점수는 시험 점수가 아니에요. 계산 문제와 긴 문제는 문제풀이·핵심정리로도 연습해요.</p><a href="#game" class="text-button">산성비 해 보기 →</a></details>
        <details><summary>내가 푼 기록은 어디에 있어요?</summary><p>지금 쓰는 브라우저에 저장돼요. 시험별로 따로 저장되며 다른 휴대폰이나 다른 주소로 열면 기록이 다르게 보일 수 있어요.</p><p>소중한 기록은 톱니바퀴 <strong>설정 → 학습 기록 내보내기</strong>로 파일에 담아 두세요. 개인 문제지 파일은 이 기록 파일에 들어가지 않아요.</p></details>
        <details><summary>문제지 파일을 넣으면 바로 문제가 생기나요?</summary><p>아니요. <strong>시험 자료</strong>에 넣으면 원본 파일을 보관하는 거예요. HWP나 PDF가 자동으로 풀 수 있는 문제로 바뀌지는 않아요.</p><a href="#materials" class="text-button">시험 자료 보기 →</a></details>
        <details><summary>화면 색이나 시험 날짜는 어디서 바꿔요?</summary><p>화면 위의 톱니바퀴 <strong>설정</strong>을 눌러요. 시험 날짜를 저장하거나 화이트·블랙 등 색을 고를 수 있어요.</p><button type="button" class="text-button" data-settings>설정 열기 →</button></details>
        <details><summary>공부 도우미가 AI인가요?</summary><p>지금은 사이트 안의 기능과 용어를 찾아주는 검색 도우미예요. 자유롭게 대답하는 AI는 아직 연결되어 있지 않아요.</p></details>
      </section><p class="fine-print">모르는 문제는 해설의 확인 상태도 보세요. ${practiceOnly ? "현재 연습 점수는 공식 시험 성적이나 합격 예상 점수가 아니에요. 시험 전 범위와 실제 기출은 별도로 준비해야 해요." : "일부 기출은 상세 해설이 부족하거나 공식 정답 대조가 끝나지 않았어요."}</p><a class="button secondary" href="#dashboard">홈으로 →</a> <a class="text-button" href="docs/guides/quick-start.md" download="합격루틴-쉬운사용법.md">짧은 설명서 내려받기 ↓</a>`;
  }
  const api = { render };
  root.UserGuidePage = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
