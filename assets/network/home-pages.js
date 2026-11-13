/* 홈·계획 화면: 공통 학습 상태는 getState로 읽고 저장은 앱 이벤트가 담당합니다. */
(() => {
  "use strict";
  function create({ D, P, A, R, C, W, items, main, getState, heading, esc, modeName }) {
    function dday() {
      const state = getState();

      const d = C.daysUntil(state.examDate);
      return d === null ? "D-DAY 설정" : d > 0 ? "D−" + d : d === 0 ? "D-DAY" : "시험일 지남";
    }
    function todayPlan() {
      const state = getState();

      const days = C.daysUntil(state.examDate);
      if (days !== null && days >= 1 && days <= 14) return 14 - days;
      if (days === 0) return 13;
      const next = D.plan.find((p) => !state.plans.includes(p.day));
      return next ? next.day : 13;
    }
    function dailyCard() {
      const state = getState();

      const a = R.summary(state.adaptive, items),
        p = R.plan(state.examDate);
      return `<section class="panel daily-launch"><span class="label-tag">${dday()} · ${esc(p.title)}</span><h2>${a.today ? "오늘도 학습 중 · " + a.today + "회 회상" : "오늘은 무엇을 공부할까요?"}</h2><p>${esc(p.goal)}</p><div class="daily-metrics"><span>복습 <b>${a.due}</b>개</span><span>취약 <b>${a.weak}</b>개</span><span>최근 정답률 <b>${a.recent === null ? "—" : a.recent + "%"}</b></span><span>연속 학습 <b>${a.streak}</b>일</span></div><p>학습한 항목 ${a.learned} / ${a.total} · ${Math.round((a.learned / a.total) * 100)}% · ${state.adaptive.lastResult?.date === C.localDate() ? "오늘의 학습 완료 ✓" : "한 번에 5~20문항, 무리 없이 이어가세요."}</p><a class="button primary full" href="#daily">${state.adaptive.session ? "오늘의 학습 이어서" : "오늘의 학습 시작"} →</a></section>`;
    }
    function homeIcon(name) {
      const paths = {
        book: '<path d="M4 5c3-1 5-1 8 1 3-2 5-2 8-1v15c-3-1-5-1-8 1-3-2-5-2-8-1zM12 6v15"/>',
        bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
        check:
          '<rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 3h6v4H9zM9 12l2 2 4-4M9 18h6"/>',
        retry: '<path d="M4 10a8 8 0 1 1 .8 7M4 4v6h6M12 8v5l3 2"/>',
        terminal:
          '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3M13 15h4"/>',
        folder: '<path d="M3 7V5h7l2 3h9v12H3z"/>',
        calendar:
          '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v5M17 3v5M3 11h18M8 15h2M14 15h2"/>',
      };
      return `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.book}</svg>`;
    }
    // 홈: 주 행동은 최신 기출, 보조 행동은 짧은 복습입니다.
    function dashboard() {
      const state = getState();

      const a = R.summary(state.adaptive, items),
        p = R.plan(state.examDate),
        current = state.session,
        resume = state.adaptive.session,
        tasks = state.routines[C.localDate()] || [],
        plan = D.plan[todayPlan()];
      main.innerHTML = `<div class="home-greeting"><div><span class="home-eyebrow">네트워크관리사 2급 필기</span><h1>오늘의 시험 공부</h1><p>기출 풀이 · 오답 복습 · 핵심정리</p></div><button class="home-dday" data-settings aria-label="시험일 설정 · ${dday()}"><span>시험까지</span><strong>${dday()}</strong></button></div>
 <section class="home-hero" aria-labelledby="hero-title"><div class="home-hero-copy"><span class="hero-chip">${A.get(P.id).year}년 ${A.get(P.id).round}회 · 최신 기출 ${P.questions.length}문항</span><h2 id="hero-title">기출을 풀고,<br>틀린 이유를 확인해요.</h2><p>문제를 풀면 오답노트에 자동으로 모여요.<br>헷갈린 개념은 핵심정리에서 확인하세요.</p><div class="hero-actions"><a class="button primary" href="#quiz/current">최신 기출 풀기 →</a><a class="button secondary" href="${resume ? "#daily" : "#daily/5"}">${resume ? "오늘의 학습 이어서" : "5분 복습"}</a></div></div></section>
 <div class="home-pulse" aria-label="나의 복습 현황"><div><strong>${a.due}</strong><span>오늘 복습</span></div><div><strong>${a.recent === null ? "—" : a.recent + "%"}</strong><span>최근 정답률</span></div><div><strong>${a.streak}<small>일</small></strong><span>연속 학습</span></div></div>
 ${current ? `<a class="home-resume" href="#quiz"><span class="home-tile-icon">${homeIcon("check")}</span><span><strong>풀던 문제 이어서</strong><small>${modeName(current.mode)} · ${current.index + 1} / ${current.ids.length}</small></span><b aria-hidden="true">→</b></a>` : ""}
 <section class="home-paths" aria-labelledby="home-path-title"><div class="home-section-heading"><h2 id="home-path-title">어떤 공부를 할까요?</h2><span>나에게 맞는 속도로</span></div><div class="home-card-grid">
 <a class="home-study-card tone-green" href="#quiz"><span class="home-tile-icon">${homeIcon("check")}</span><span class="home-card-tag">최신 기출</span><h3>기출문제</h3><p>2022~2026년 기출<br>연도를 골라 같은 회차 반복하기</p><span class="home-card-go">연도 선택하고 풀기 <b aria-hidden="true">↗</b></span></a>
 <a class="home-study-card tone-lilac" href="#game"><span class="home-tile-icon">${homeIcon("bolt")}</span><span class="home-card-tag">90초 챌린지</span><h3>산성비</h3><p>떨어지는 단서를 맞혀보세요.<br>산성비로 키워드 순발력 쌓기</p><span class="home-card-go">산성비 시작 <b aria-hidden="true">↗</b></span></a>
 <a class="home-study-card tone-peach" href="#wrong"><span class="home-tile-icon">${homeIcon("retry")}</span><span class="home-card-tag">복습</span><h3>오답노트</h3><p>${W.count(state) ? `${W.count(state)}개 오답이 기다리고 있어요.` : "아직 모인 오답이 없어요."}<br>해설을 보고 다시 맞혀보세요.</p><span class="home-card-go">오답 복습 <b aria-hidden="true">↗</b></span></a>
 <a class="home-study-card tone-blue" href="#theory"><span class="home-tile-icon">${homeIcon("book")}</span><span class="home-card-tag">이론 · 계산</span><h3>핵심정리</h3><p>개념·포트·계산을 한곳에<br>필기 핵심 이론 ${D.sections.length}단원</p><span class="home-card-go">핵심 확인 <b aria-hidden="true">↗</b></span></a>
 </div></section>
 <section class="home-library" aria-labelledby="library-title"><div class="home-section-heading"><h2 id="library-title">필요할 때 찾아보기</h2></div><div class="home-library-grid">${[
   ["keywords", "book", "키워드 암기", "54개 카드·문제 예시"],
   ["commands", "terminal", "명령어 노트", "Windows · Linux"],
   ["materials", "folder", "시험 자료", "기출 원본·내 자료"],
   ["plan", "calendar", "학습 계획", "남은 기간에 맞춰"],
 ]
   .map(
     ([path, icon, title, sub]) =>
       `<a href="#${path}"><span class="home-tile-icon">${homeIcon(icon)}</span><span><strong>${title}</strong><small>${sub}</small></span><b aria-hidden="true">›</b></a>`,
   )
   .join("")}</div></section>
 <section class="panel home-progress"><div class="home-section-heading"><h2>오늘의 작은 목표</h2><span>${tasks.length} / 3 완료</span></div>${["키워드 10개 암기", "명령어와 옵션 복습", "10문제 풀고 오답 확인"].map((t, i) => `<div class="routine-row"><input class="routine-check" type="checkbox" id="routine-${i}" data-routine="${i}" ${tasks.includes(i) ? "checked" : ""}><label for="routine-${i}" class="${tasks.includes(i) ? "routine-complete" : ""}">${t}</label></div>`).join("")}<a class="today-study" href="#${plan.view}">오늘의 추천 · ${esc(plan.title)} →</a></section>`;
    }
    // 학습 계획: 시험일까지 남은 날짜와 체크 상태를 화면에 투영합니다.
    function renderPlan() {
      const state = getState();

      const completed = state.plans.length,
        day = todayPlan();
      main.innerHTML =
        heading(
          "14-DAY STUDY PLAN",
          "하루 한 주제, 2주를 단단하게.",
          "하루 2~3시간 기준. 시간이 적다면 S영역과 오답 복습부터 챙겨요.",
          `<button class="button secondary" data-settings>${dday()} ↗</button>`,
        ) +
        dailyCard() +
        `<p class="inline-note">복습 20분 → 주제 학습 40~60분 → 문제 풀이 40~50분 → 오답 20~40분</p><div class="plan-header"><h2 style="font-size:15px;margin:0">나의 학습 진도</h2><span class="quiz-status">${completed} / 14일 완료 · ${Math.round((completed / 14) * 100)}%</span></div><div class="progress-track"><div style="width:${(completed / 14) * 100}%"></div></div><p class="results-meta">${state.examDate ? "시험일 " + esc(state.examDate) + " · 날짜에 맞춘 추천 학습일을 표시해요." : "시험일을 설정하지 않으면 첫 미완료 학습일을 추천해요."}</p><div class="plan-list">${D.plan.map((p) => `<article class="plan-row ${state.plans.includes(p.day) ? "done" : ""} ${day === p.day ? "today" : ""}"><div class="plan-day">DAY ${String(p.day + 1).padStart(2, "0")}<br><small>D−${14 - p.day}</small></div><div class="plan-content"><h3><a href="#${p.view}">${esc(p.title)}</a>${day === p.day ? '<span class="today-tag">추천</span>' : ""}</h3><p>${esc(p.description)}</p></div><input type="checkbox" class="routine-check" data-plan="${p.day}" aria-label="Day ${p.day + 1} 학습 완료" ${state.plans.includes(p.day) ? "checked" : ""}></article>`).join("")}</div>`;
    }

    return { dashboard, renderPlan };
  }
  window.HomePages = { create };
})();
