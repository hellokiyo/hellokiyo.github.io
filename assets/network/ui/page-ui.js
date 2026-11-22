/* 공통 화면 출력: HTML 이스케이프·페이지 제목·빈 상태. 학습 상태/저장소를 소유하지 않습니다.
   heading/empty의 action 인자는 호출부가 만든 HTML만 받습니다. 사용자 문자열은 escapeHTML로 정제합니다. */
(function (root) {
  "use strict";
  const escapeHTML = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  function heading(kicker, title, description, extra = "", practiceOnly = false) {
    const titles = {
      "KEYWORD FLASHCARDS": "키워드 암기",
      "COMMAND REFERENCE": "명령어 노트",
      "CORE CONCEPTS": "핵심정리",
      "14-DAY STUDY PLAN": "14일 학습 계획",
      "PRACTICE MAKES PROGRESS": "문제 풀이",
      "REVIEW YOUR MISTAKES": "오답노트",
      "SESSION COMPLETE": "채점 결과",
    };
    const descriptions = {
      "KEYWORD FLASHCARDS": "단서를 암기하고, 문제 예시에서 어떻게 쓰이는지 확인하세요.",
      "COMMAND REFERENCE": "목적 · 명령어 · 옵션을 함께 확인하세요.",
      "CORE CONCEPTS": "시험에 필요한 개념과 계산을 정리했습니다.",
      "14-DAY STUDY PLAN": "하루 한 주제씩 완료 체크하세요.",
      "PRACTICE MAKES PROGRESS": "수록된 기출 · 회차별 반복 풀이와 오답 복습",
      "REVIEW YOUR MISTAKES": "다시 맞힌 문제는 오답노트에서 제외됩니다.",
      "SESSION COMPLETE": "틀린 문제와 미응답은 오답노트에 저장됩니다.",
    };
    return `<div class="page-heading"><div><h1>${practiceOnly && kicker === "COMMAND REFERENCE" ? "명령어·표현 노트" : titles[kicker] || title}</h1><p>${practiceOnly && kicker === "PRACTICE MAKES PROGRESS" ? "자체 제작 기초 연습 · 해설 확인과 반복 복습" : practiceOnly && kicker === "CORE CONCEPTS" ? "자체 기초 연습과 연결된 개념 정리입니다. 시험 전 범위를 대신하지 않습니다." : descriptions[kicker] || description}</p></div>${extra}</div>`;
  }
  function empty(title, description, action = "") {
    return `<div class="empty-state"><h2>${title}</h2><p>${description}</p>${action}</div>`;
  }
  // 재렌더링으로 누른 버튼이 사라져도 번호판이 아닌 새 문제를 읽기 시작합니다.
  function focusQuestion(container) {
    const question = container.querySelector(".question-box, .daily-question");
    if (!question) return;
    question.setAttribute("tabindex", "-1");
    question.focus({ preventScroll: true });
    question.scrollIntoView({ block: "start", behavior: "instant" });
  }
  const api = { escapeHTML, heading, empty, focusQuestion };
  root.PageUI = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
