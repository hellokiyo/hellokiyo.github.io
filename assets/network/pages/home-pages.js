/* 홈·계획 화면: 공통 학습 상태는 getState로 읽고 저장은 앱 이벤트가 담당합니다. */
(() => {
  "use strict";
  function create({
    D,
    P,
    A,
    R,
    C,
    W,
    items,
    main,
    getState,
    heading,
    esc,
    modeName,
    getStage = () => "written",
  }) {
    function practicalHero() {
      const value = window.PracticalStudy.clean(getState().practicalStudy);
      const days = C.daysUntil(value.examDate);
      return `<section class="home-hero"><div class="home-hero-copy"><span class="hero-chip">네트워크관리사 2급 실기 · ${esc(value.examDate)} · ${days > 0 ? `D−${days}` : "일정 확인"}</span><h2>프로그램을 열고,<br>한 단계씩 따라 해요.</h2><p>Windows 설정 · 라우터 명령 · 케이블 실물 연습<br>처음 시작부터 남은 기간 로드맵까지</p><div class="hero-actions"><a class="button primary" href="#practical">실기 준비 시작 →</a><a class="button secondary" href="#lab">가상 실험실 열기 →</a></div></div></section>`;
    }
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
        p = R.plan(
          state.examDate,
          undefined,
          D.certificationId ? { practiceMinutes: D.keywords.length, basicOnly: true } : undefined,
        );
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
        p = R.plan(
          state.examDate,
          undefined,
          D.certificationId ? { practiceMinutes: D.keywords.length, basicOnly: true } : undefined,
        ),
        current = state.session,
        resume = state.adaptive.session,
        tasks = state.routines[C.localDate()] || [],
        plan = D.plan[todayPlan()],
        practiceOnly = !P,
        latest = P ? A.get(P.id) : null,
        practicalReady =
          !D.certificationId && Boolean(window.PracticalStudy) && getStage() === "practical";
      if (practicalReady) {
        main.innerHTML = `<div class="page-heading"><div><h1>네트워크관리사 2급 실기</h1><p>설정·명령 입력·케이블 작업 연습</p></div></div>${practicalHero()}<p class="inline-note">실기는 직접 조작하는 연습입니다. 객관식 기출·오답·암기는 상단의 <strong>필기</strong>로 전환하세요. 실험실 결과는 필기 성적이나 오답노트에 섞이지 않습니다.</p>`;
        return;
      }
      main.innerHTML = `<div class="home-greeting"><div><span class="home-eyebrow">${practicalReady ? "네트워크관리사 2급 실기" : esc(D.examName || "네트워크관리사 2급 필기")}</span><h1>오늘의 시험 공부</h1><p>${practicalReady ? "따라하기 · 실기 로드맵 · 직접 연습" : `${practiceOnly ? "기초 연습" : "기출 풀이"} · 오답 복습 · 핵심정리`}</p></div>${practicalReady ? `<a class="home-dday" href="#practical"><span>실기까지</span><strong>D−${Math.max(0, C.daysUntil(window.PracticalStudy.clean(getState().practicalStudy).examDate))}</strong></a>` : `<button class="home-dday" data-settings aria-label="시험일 설정 · ${dday()}"><span>시험까지</span><strong>${dday()}</strong></button>`}</div>
 <p class="guide-entry">처음 왔나요? <a href="#help">1분 사용법부터 보기 →</a></p>
 ${practicalReady ? practicalHero() : ` <section class="home-hero" aria-labelledby="hero-title"><div class="home-hero-copy"><span class="hero-chip">${latest ? `${latest.year}년 ${esc(latest.label || `${latest.round}회`)} · 최신 기출 ${P.questions.length}문항` : `자체 기초 연습 ${D.keywords.length}문항`}</span><h2 id="hero-title">${practiceOnly ? "문제를 풀고," : "기출을 풀고,"}<br>틀린 이유를 확인해요.</h2><p>문제를 풀면 오답노트에 자동으로 모여요.<br>헷갈린 개념은 핵심정리에서 확인하세요.</p><div class="hero-actions"><a class="button primary" href="${practiceOnly ? "#quiz" : "#quiz/current"}">${practiceOnly ? "기초 문제 풀기" : "최신 기출 풀기"} →</a><a class="button secondary" href="${resume ? "#daily" : "#daily/5"}">${resume ? "오늘의 학습 이어서" : "5분 복습"}</a></div></div></section>`}
 ${practiceOnly ? '<p class="inline-note">자체 제작 기초 연습입니다. 실제 기출과 시험 전 범위를 대체하지 않습니다.</p>' : ""}
 ${practicalReady ? '<details class="home-written-review"><summary>필기 복습 도구 <small>기출 · 오답 · 핵심정리</small></summary>' : ""}
 <div class="home-pulse" aria-label="나의 복습 현황"><div><strong>${a.due}</strong><span>오늘 복습</span></div><div><strong>${a.recent === null ? "—" : a.recent + "%"}</strong><span>최근 정답률</span></div><div><strong>${a.streak}<small>일</small></strong><span>연속 학습</span></div></div>
 ${current ? `<a class="home-resume" href="#quiz"><span class="home-tile-icon">${homeIcon("check")}</span><span><strong>풀던 문제 이어서</strong><small>${modeName(current.mode)} · ${current.index + 1} / ${current.ids.length}</small></span><b aria-hidden="true">→</b></a>` : ""}
 <section class="home-paths" aria-labelledby="home-path-title"><div class="home-section-heading"><h2 id="home-path-title">${practicalReady ? "필기 복습" : "어떤 공부를 할까요?"}</h2><span>나에게 맞는 속도로</span></div><div class="home-card-grid">
 <a class="home-study-card tone-green" href="#quiz"><span class="home-tile-icon">${homeIcon("check")}</span><span class="home-card-tag">${practiceOnly ? "기초 연습" : "최신 기출"}</span><h3>${practiceOnly ? "문제풀이" : "기출문제"}</h3><p>${practiceOnly ? `자체 제작 ${D.keywords.length}문항<br>해설을 보고 같은 문제 반복하기` : `${A.years[A.years.length - 1]}~${A.years[0]}년 기출<br>연도를 골라 같은 회차 반복하기`}</p><span class="home-card-go">${practiceOnly ? "문제 풀기" : "연도 선택하고 풀기"} <b aria-hidden="true">↗</b></span></a>
 <a class="home-study-card tone-lilac" href="#game"><span class="home-tile-icon">${homeIcon("bolt")}</span><span class="home-card-tag">90초 챌린지</span><h3>산성비</h3><p>떨어지는 단서를 맞혀보세요.<br>산성비로 키워드 순발력 쌓기</p><span class="home-card-go">산성비 시작 <b aria-hidden="true">↗</b></span></a>
 <a class="home-study-card tone-peach" href="#wrong"><span class="home-tile-icon">${homeIcon("retry")}</span><span class="home-card-tag">복습</span><h3>오답노트</h3><p>${W.count(state) ? `${W.count(state)}개 오답이 기다리고 있어요.` : "아직 모인 오답이 없어요."}<br>해설을 보고 다시 맞혀보세요.</p><span class="home-card-go">오답 복습 <b aria-hidden="true">↗</b></span></a>
 <a class="home-study-card tone-blue" href="#theory"><span class="home-tile-icon">${homeIcon("book")}</span><span class="home-card-tag">이론 · 계산</span><h3>핵심정리</h3><p>${practiceOnly ? "문제와 연결된 개념을 한곳에" : "개념·포트·계산을 한곳에"}<br>핵심 이론 ${D.sections.length}단원</p><span class="home-card-go">핵심 확인 <b aria-hidden="true">↗</b></span></a>
 </div></section>
 <section class="home-library" aria-labelledby="library-title"><div class="home-section-heading"><h2 id="library-title">필요할 때 찾아보기</h2></div><div class="home-library-grid">${[
   ["keywords", "book", "키워드 암기", `${D.keywords.length}개 카드·문제 예시`],
   [
     "commands",
     "terminal",
     practiceOnly ? "명령어·표현 노트" : "명령어 노트",
     `${D.commands.length}개 항목·검색과 복사`,
   ],
   ["materials", "folder", "시험 자료", "기출 원본·내 자료"],
   ["plan", "calendar", "학습 계획", "남은 기간에 맞춰"],
 ]
   .map(
     ([path, icon, title, sub]) =>
       `<a href="#${path}"><span class="home-tile-icon">${homeIcon(icon)}</span><span><strong>${title}</strong><small>${sub}</small></span><b aria-hidden="true">›</b></a>`,
   )
   .join("")}</div></section>
 <section class="panel home-progress"><div class="home-section-heading"><h2>오늘의 작은 목표</h2><span>${tasks.length} / 3 완료</span></div>${["키워드 10개 암기", practiceOnly ? "명령어·핵심 표현 복습" : "명령어와 옵션 복습", "10문제 풀고 오답 확인"].map((t, i) => `<div class="routine-row"><input class="routine-check" type="checkbox" id="routine-${i}" data-routine="${i}" ${tasks.includes(i) ? "checked" : ""}><label for="routine-${i}" class="${tasks.includes(i) ? "routine-complete" : ""}">${t}</label></div>`).join("")}<a class="today-study" href="#${plan.view}">오늘의 추천 · ${esc(plan.title)} →</a></section>${practicalReady ? "</details>" : ""}`;
    }
    // 학습 계획: 시험일까지 남은 날짜와 체크 상태를 화면에 투영합니다.
    function renderPlan() {
      const state = getState();
      const practicalNotice =
        !D.certificationId && window.PracticalStudy
          ? '<p class="inline-note">이 페이지는 필기 14일 계획입니다. <a href="#practical">실기 따라하기·응시일까지의 로드맵 →</a></p>'
          : "";

      const completed = state.plans.length,
        day = todayPlan();
      main.innerHTML =
        heading(
          "14-DAY STUDY PLAN",
          "하루 한 주제, 2주를 단단하게.",
          "하루 2~3시간 기준. 시간이 적다면 S영역과 오답 복습부터 챙겨요.",
          `<button class="button secondary" data-settings>${dday()} ↗</button>`,
        ) +
        practicalNotice +
        dailyCard() +
        `<p class="inline-note">${D.certificationId ? "기초 개념 확인 → 짧은 문제풀이 → 오답 복습. 14일 계획은 서비스 연습 순서이며 시험 전 범위 완주 계획이 아닙니다." : "복습 20분 → 주제 학습 40~60분 → 문제 풀이 40~50분 → 오답 20~40분"}</p><div class="plan-header"><h2 style="font-size:15px;margin:0">나의 학습 진도</h2><span class="quiz-status">${completed} / 14일 완료 · ${Math.round((completed / 14) * 100)}%</span></div><div class="progress-track"><div style="width:${(completed / 14) * 100}%"></div></div><p class="results-meta">${state.examDate ? "시험일 " + esc(state.examDate) + " · 날짜에 맞춘 추천 학습일을 표시해요." : "시험일을 설정하지 않으면 첫 미완료 학습일을 추천해요."}</p><div class="plan-list">${D.plan.map((p) => `<article class="plan-row ${state.plans.includes(p.day) ? "done" : ""} ${day === p.day ? "today" : ""}"><div class="plan-day">DAY ${String(p.day + 1).padStart(2, "0")}<br><small>D−${14 - p.day}</small></div><div class="plan-content"><h3><a href="#${p.view}">${esc(p.title)}</a>${day === p.day ? '<span class="today-tag">추천</span>' : ""}</h3><p>${esc(p.description)}</p></div><input type="checkbox" class="routine-check" data-plan="${p.day}" aria-label="Day ${p.day + 1} 학습 완료" ${state.plans.includes(p.day) ? "checked" : ""}></article>`).join("")}</div>`;
    }

    return { dashboard, renderPlan };
  }
  window.HomePages = { create };
})();
