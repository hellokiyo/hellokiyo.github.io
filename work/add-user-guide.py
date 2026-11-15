from pathlib import Path
Path('assets/network/pages/user-guide-page.js').write_text('''/* 처음 사용하는 사람을 위한 정적 사용법. 로그인·외부 요청·새 저장소를 만들지 않습니다. */
(function (root) {
  "use strict";
  function render() {
    return `<div class="page-heading"><div><h1>처음이라면? 1분 사용법</h1><p>하나만 골라 시작해도 괜찮아요.</p></div></div>
      <section class="panel guide-welcome"><span class="label-tag">이렇게 하면 돼요</span><h2>풀고 → 이유를 보고 → 다시 풀어요</h2><p>이곳은 네트워크관리사 2급 시험을 연습하는 공부방이에요. 가입하거나 로그인할 필요가 없어요.</p><a class="button primary" href="#daily/5">딱 5분만 시작하기 →</a></section>
      <div class="guide-grid">
        <section class="panel"><h2>① 문제를 골라요</h2><p><strong>문제 풀이</strong>를 열고 연도와 회차를 골라요. 처음에는 최신 회차부터 해 보세요.</p><p>짧게 하고 싶으면 <strong>10문제 연습</strong>, 기억을 꺼내 보고 싶으면 <strong>오늘의 학습</strong>을 골라요.</p><a class="text-button" href="#quiz">문제 고르러 가기 →</a></section>
        <section class="panel"><h2>② 답과 이유를 봐요</h2><p>보기를 하나 누른 뒤 <strong>정답 확인</strong> 또는 <strong>정답과 이유 확인</strong>을 눌러요. 실전 연습은 제출한 뒤에 답을 볼 수 있어요.</p><p>왜 그런지 어렵다면 <strong>핵심정리</strong>의 그림을 보세요. 명령어는 <strong>명령어 노트</strong>에서 찾아요.</p><a class="text-button" href="#theory">그림으로 이해하기 →</a></section>
        <section class="panel"><h2>③ 틀린 것을 다시 풀어요</h2><p><strong>오답노트</strong>에 틀린 것이 모여요. ‘오늘의 학습’, ‘기출문제’처럼 어디에서 틀렸는지도 골라 볼 수 있어요.</p><p>오늘의 학습에서 맞혔어도 찍었다면 <strong>헷갈림</strong>을 눌러요. 정답을 알고 이유도 알면 <strong>기억남</strong>을 눌러요.</p><a class="text-button" href="#wrong">오답노트 보기 →</a></section>
      </div>
      <section class="panel guide-questions"><h2>이럴 때는 이렇게!</h2>
        <details><summary>‘모름 · 헷갈림 · 기억남’은 뭐예요?</summary><p><strong>모름:</strong> 다시 연습하고 싶어요. <strong>헷갈림:</strong> 아직 확실하지 않아요. <strong>기억남:</strong> 답과 이유를 알고 있어요.</p><p>틀린 답은 확인하는 순간 오답노트에 들어가요. 틀렸는데 기억남을 눌러도 없어지지 않아요. 나중에 맞히고 기억남을 고르면 오늘의 학습 목록에서 빠져요.</p></details>
        <details><summary>오늘의 학습을 계속하고 싶어요.</summary><p>이번 묶음이 끝나면 <strong>추가 학습</strong>을 눌러요. ‘모름’이나 틀린 문제는 같은 묶음에서 한 번 더 나올 수 있어요.</p></details>
        <details><summary>산성비는 뭐예요?</summary><p>90초 동안 떨어지는 단서를 보고 답을 맞히는 게임이에요. 끝나면 <strong>정답 목록</strong>을 열어 틀린 답과 내가 고른 답을 보세요.</p><p>게임 점수는 시험 점수가 아니에요. 계산 문제와 긴 문제는 기출·핵심정리로도 연습해요.</p><a href="#game" class="text-button">산성비 해 보기 →</a></details>
        <details><summary>내가 푼 기록은 어디에 있어요?</summary><p>지금 쓰는 브라우저에 저장돼요. 다른 휴대폰이나 다른 주소로 열면 기록이 다르게 보일 수 있어요.</p><p>소중한 기록은 톱니바퀴 <strong>설정 → 학습 기록 내보내기</strong>로 파일에 담아 두세요. 개인 문제지 파일은 이 기록 파일에 들어가지 않아요.</p></details>
        <details><summary>문제지 파일을 넣으면 바로 문제가 생기나요?</summary><p>아니요. <strong>시험 자료</strong>에 넣으면 원본 파일을 보관하는 거예요. HWP나 PDF가 자동으로 풀 수 있는 문제로 바뀌지는 않아요.</p><a href="#materials" class="text-button">시험 자료 보기 →</a></details>
        <details><summary>화면 색이나 시험 날짜는 어디서 바꿔요?</summary><p>화면 위의 톱니바퀴 <strong>설정</strong>을 눌러요. 시험 날짜를 저장하거나 화이트·블랙 등 색을 고를 수 있어요.</p><button type="button" class="text-button" data-settings>설정 열기 →</button></details>
        <details><summary>공부 도우미가 AI인가요?</summary><p>지금은 사이트 안의 기능과 용어를 찾아주는 검색 도우미예요. 자유롭게 대답하는 AI는 아직 연결되어 있지 않아요.</p></details>
      </section><p class="fine-print">모르는 문제는 해설의 확인 상태도 보세요. 일부 기출은 상세 해설이 부족하거나 공식 정답 대조가 끝나지 않았어요.</p><a class="button secondary" href="#dashboard">홈으로 →</a>`;
  }
  const api = { render };
  root.UserGuidePage = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
''',encoding='utf-8')
p=Path('assets/network/app.js');s=p.read_text(encoding='utf-8').replace('      "daily",','      "daily",\n      "help",',1).replace('      dashboard,','      help: () => { main.innerHTML = window.UserGuidePage.render(); },\n      dashboard,',1).replace('        dashboard: "학습 현황",','        help: "사용법",\n        dashboard: "학습 현황",',1)
needle='    if (\n      target.tagName === "A"'
insert='''    // 본문 안 이동은 앱 경로로 처리하지 않아 해시 라우팅이 그림 링크를 삼키지 않게 합니다.
    if (target.dataset.scrollTarget) {
      const destination = document.getElementById(target.dataset.scrollTarget);
      if (destination) {
        event.preventDefault();
        destination.setAttribute("tabindex", "-1");
        destination.focus({ preventScroll: true });
        destination.scrollIntoView({ block: "start" });
      }
      return;
    }
'''
s=s.replace(needle,insert+needle,1);p.write_text(s,encoding='utf-8')
p=Path('assets/network/pages/home-pages.js');s=p.read_text(encoding='utf-8').replace(' <section class="home-hero"',' <p class="guide-entry">처음 왔나요? <a href="#help">1분 사용법부터 보기 →</a></p>\n <section class="home-hero"',1);p.write_text(s,encoding='utf-8')
p=Path('assets/network/pages/reference-pages.js');s=p.read_text(encoding='utf-8').replace('      const section = D.sections.find','      const compactMenu = !!window.matchMedia?.("(max-width: 1024px)").matches;\n      const section = D.sections.find',1).replace('<div class="reader-layout"><nav class="reader-nav"','<div class="reader-layout"><details class="reader-menu" ${compactMenu ? "" : "open"}><summary>목차 · ${esc(section.title)}</summary><nav class="reader-nav"',1).replace('</nav><article class="reader">','</nav></details><article class="reader">',1);p.write_text(s,encoding='utf-8')
p=Path('assets/network/ui/theory-visuals.js');s=p.read_text(encoding='utf-8').replace('href="#theory-text" class=', 'href="#theory-text" data-scroll-target="theory-text" class=');p.write_text(s,encoding='utf-8')
p=Path('assets/network/ui/feature-helper.js');s=p.read_text(encoding='utf-8').replace('  const features = [','  const features = [\n    { title: "처음이라면? 1분 사용법", words: "사용법 매뉴얼 설명서 도움 처음 시작 어떻게", text: "문제 고르기부터 오답 복습까지, 쉬운 말로 따라 해 보세요.", href: "#help" },',1);p.write_text(s,encoding='utf-8')
p=Path('assets/network/css/theory-visuals.css');s=p.read_text(encoding='utf-8');s+='''
.reader-menu { min-width:0; }
.reader-menu > summary { cursor:pointer; padding:12px; border:1px solid var(--line); border-radius:10px; font-size:13px; line-height:1.6; overflow-wrap:anywhere; }
.reader-menu .reader-nav { margin-top:12px; }
.guide-entry { margin: 8px 0 18px; color:var(--muted); font-size:13px; }
.guide-entry a { color:var(--green); font-weight:700; text-decoration:underline; text-underline-offset:3px; }
.guide-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr)); gap:16px; }
.guide-welcome { margin-bottom:20px; }
.guide-grid .panel { margin:0; }
.guide-welcome p,.guide-grid p,.guide-questions p { line-height:1.85; }
.guide-questions { margin-top:20px; }
.guide-questions details { border-top:1px solid var(--line); padding:16px 0; }
.guide-questions summary { cursor:pointer; line-height:1.7; font-weight:600; }
.theory-visual { container-type:inline-size; }
@container (max-width:600px) {
 .concept-flow { grid-template-columns:1fr; }
 .concept-flow .concept-cell:not(:last-child)::after { content:"↓"; right:50%; top:auto; bottom:-20px; }
}
''';p.write_text(s,encoding='utf-8')
p=Path('index.html');s=p.read_text(encoding='utf-8').replace('    <script defer src="assets/network/app.js">','    <script defer src="assets/network/ui/theory-visuals.js"></script>\n    <script defer src="assets/network/pages/user-guide-page.js"></script>\n    <script defer src="assets/network/app.js">',1).replace('    <link rel="stylesheet" href="assets/network/css/reference.css"','    <link rel="stylesheet" href="assets/network/css/theory-visuals.css">\n    <link rel="stylesheet" href="assets/network/css/reference.css"',1).replace('v22','v23');p.write_text(s,encoding='utf-8')
p=Path('sw.js');s=p.read_text(encoding='utf-8').replace('v22','v23').replace("'assets/network/app.js'","'assets/network/ui/theory-visuals.js','assets/network/pages/user-guide-page.js','assets/network/css/theory-visuals.css','assets/network/app.js'");p.write_text(s,encoding='utf-8')
