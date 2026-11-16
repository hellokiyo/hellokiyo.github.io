/* 시험 선택과 콘텐츠 준비 중인 시험의 공통 셸. 학습 기록은 읽거나 쓰지 않습니다.
   query의 exam으로 작업 공간을 고정하고 시험 전환은 문서를 다시 열어 모듈 상태를 섞지 않습니다. */
(function (root) {
  "use strict";
  const { exams, categories, filter: filterExams } = root.ExamCatalog;
  let selectedCategory = "전체";
  const features = [
    ["sources", "기출 자료", "연도와 개정 기준으로 원문 출처를 찾아요."],
    ["quiz", "문제 풀이", "연도와 회차를 골라 반복해서 풀어요."],
    ["daily", "오늘의 학습", "짧게 풀고 기억이 남았는지 확인해요."],
    ["wrong", "오답노트", "이 시험에서 틀린 문제만 다시 확인해요."],
    ["theory", "핵심정리", "문제와 연결되는 개념을 읽어요."],
    ["keywords", "키워드 암기", "짧은 단서로 핵심 용어를 떠올려요."],
    ["game", "키워드 산성비", "검수된 키워드로 가볍게 복습해요."],
  ];
  function resolve(search) {
    const id = new URLSearchParams(search).get("exam");
    return exams.find((exam) => exam.id === id) || exams[0];
  }
  function entry(examId) {
    return `?exam=${encodeURIComponent(examId)}#dashboard`;
  }
  function cards(list) {
    return list
      .map(
        (exam) =>
          `<article class="panel exam-card"><span class="label-tag">${exam.category} · ${exam.ready ? exam.status : "기초 연습 가능"}</span><h2>${exam.name}</h2><p>${exam.description}</p><p class="fine-print">기출 출처 ${root.EXAM_PAPER_SOURCES?.records.filter((row) => row.certificationId === exam.id).length || 0}회차 · 원문/답안 확인은 별도</p><a class="button ${exam.ready ? "primary" : "secondary"}" href="${entry(exam.id)}" aria-label="${exam.name} 공부 시작하기">공부 시작하기 →</a></article>`,
      )
      .join("");
  }
  function selection() {
    selectedCategory = "전체";
    return `<div class="page-heading"><div><h1>어떤 시험을 공부할까요?</h1><p>시험을 선택하면 문제풀이·오늘의 학습·산성비·오답노트를 이용할 수 있어요.</p></div></div><div class="exam-tools"><label for="exam-search">시험 이름 검색</label><input type="search" id="exam-search" placeholder="리눅스, 정보보안, CCNA…" maxlength="100" autocomplete="off"><div class="exam-categories" role="group" aria-label="시험 분야">${["전체", ...categories].map((category) => `<button type="button" class="filter ${category === "전체" ? "active" : ""}" data-exam-category="${category}" aria-pressed="${category === "전체"}">${category}</button>`).join("")}</div></div><p id="exam-results-count" class="fine-print" role="status">${exams.length}개 시험 · 학습 가능 ${exams.length}개 · 실제 기출 수록 1개</p><div class="exam-grid" id="exam-results">${cards(exams)}</div><p class="inline-note">기존 네트워크관리사 기록은 그대로 유지돼요. 시험마다 학습과 게임 기록이 따로 저장돼요. 다른 시험은 자체 기초 연습부터 제공하며 실제 기출과 구분합니다.</p>`;
  }
  function refreshSelection() {
    const input = document.querySelector("#exam-search");
    if (!input) return;
    const list = filterExams(input.value, selectedCategory);
    document.querySelector("#exam-results").innerHTML = list.length
      ? cards(list)
      : '<p class="inline-note">찾는 시험이 없어요. 이름을 짧게 입력하거나 분야를 ‘전체’로 바꿔 보세요.</p>';
    document.querySelector("#exam-results-count").textContent =
      `${list.length}개 시험 · 학습 가능 ${list.filter((exam) => exam.learningReady).length}개`;
    document.querySelectorAll("[data-exam-category]").forEach((button) => {
      const active = button.dataset.examCategory === selectedCategory;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }
  if (typeof document !== "undefined") {
    // 문서 수명의 이벤트 위임. 화면 재진입 때 검색은 초기화하며 리스너를 중복 등록하지 않습니다.
    document.addEventListener("input", (event) => {
      if (event.target.id === "exam-search") refreshSelection();
    });
    document.addEventListener("click", (event) => {
      const category = event.target.closest("[data-exam-category]");
      if (category) {
        selectedCategory = category.dataset.examCategory;
        refreshSelection();
      }
    });
  }
  function shell(exam, choosing = false) {
    document.body.classList.toggle("exam-selecting", choosing);
    document.body.classList.toggle(
      "exam-pending",
      !exam.ready && !root.ExamPractice?.profiles[exam.id] && !choosing,
    );
    document.querySelector(".brand small").textContent = choosing ? "시험별 공부방" : exam.name;
    document.querySelector(".breadcrumb strong").textContent = choosing ? "시험 선택" : exam.name;
    document.querySelector(".breadcrumb").lastChild.textContent = choosing
      ? ""
      : ` · ${exam.stage}`;
    document.querySelector("#exam-switch").hidden = choosing;
    document.querySelector('a[href="docs/study/exam-guide.md"]').hidden = !exam.ready || choosing;
    // 계획 이름은 제공되는 공통 14일 연습 화면과 일치시킵니다.
    document.querySelectorAll('[data-view="plan"]').forEach((link) => {
      const label = Array.from(link.childNodes).find(
        (node) => node.nodeType === 3 && node.textContent.trim(),
      );
      if (label) label.textContent = exam.learningReady ? " 14일 학습 계획" : " 학습 계획";
    });
  }
  function mountPending() {
    const exam = resolve(location.search);
    const main = document.querySelector("#main");
    // 본문 이동을 화면 경로로 해석하지 않습니다. 이 리스너는 문서 수명 동안 유지합니다.
    document.addEventListener("click", (event) => {
      if (event.target.closest('a[href="#main"]')) {
        event.preventDefault();
        main.focus();
        main.scrollIntoView({ block: "start" });
      }
    });
    const names = {
      ...Object.fromEntries(features.map(([id, name]) => [id, name])),
      commands: "명령어 노트",
      materials: "시험 자료",
      plan: "학습 계획",
      help: "사용법",
    };
    function render() {
      const route = location.hash.slice(1).split("/")[0] || "exams";
      const choosing = route === "exams";
      shell(exam, choosing);
      document.querySelectorAll("[data-view]").forEach((link) => {
        const active = link.dataset.view === route;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
      root.PaperSourcesPage.unmount();
      if (choosing) main.innerHTML = selection();
      else if (route === "sources") root.PaperSourcesPage.mount({ main, exam });
      else {
        const title =
          route === "dashboard" ? `${exam.name} 공부방` : names[route] || `${exam.name} 공부방`;
        main.innerHTML = `<div class="page-heading"><div><h1>${title}</h1><p>${exam.name} · ${exam.stage}</p></div></div><section class="panel"><span class="label-tag">자료 준비 중 · 등록 문제 0개</span><h2>이 시험의 학습 자료를 준비하고 있어요</h2><a class="button primary" href="#sources">연도별 기출 자료 보기 →</a><p>공식 자료와 이용 조건을 확인하고 문제·정답·해설을 검수한 뒤 학습을 열겠습니다. 다른 시험의 문제나 기록을 대신 보여주지 않아요.</p><a class="text-button" href="${exam.sourceUrl}" target="_blank" rel="noopener">${exam.name} 공식 안내·자료 확인 ↗</a>${exam.id === "ccna" ? '<p class="fine-print">실제 시험 덤프는 제공하지 않습니다. 공식 출제범위에 맞는 자체 연습과 실습 자료를 준비합니다.</p>' : ""}${exam.id === "surveying-geospatial-engineer" ? '<p class="fine-print">웹 학습은 실제 측량장비를 다루는 실습을 대신하지 않습니다.</p>' : ""}</section>${route === "dashboard" ? `<div class="exam-grid">${features.map(([id, name, description]) => `<article class="panel"><h2>${name}</h2><p>${description}</p><a class="text-button" href="#${id}">준비 현황 보기 →</a></article>`).join("")}</div>` : '<p class="inline-note">이 기능은 검수된 학습 자료가 등록되면 사용할 수 있어요.</p><a class="button secondary" href="#dashboard">공부방 홈으로 →</a>'}`;
      }
      document.title = `${choosing ? "시험 선택" : exam.name} · 합격루틴`;
      document.querySelector("#save-status").textContent = "학습 자료 준비 중";
      document.querySelector("#keyword-count").textContent = "0";
      document.querySelector("#wrong-count").textContent = "0";
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    window.addEventListener("hashchange", render);
    render();
  }
  root.ExamWorkspace = { exams, resolve, entry, selection, shell, mountPending };
  if (typeof module !== "undefined") module.exports = root.ExamWorkspace;
})(typeof window !== "undefined" ? window : globalThis);
