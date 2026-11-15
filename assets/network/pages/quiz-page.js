/* 기출/자체 문제풀이 컨트롤러: 회차 필터·답안·채점·오답 연결. 저장 스키마는 core가 검증합니다. */
(() => {
  "use strict";
  function create({
    B,
    P,
    A,
    Q,
    C,
    R,
    W,
    main,
    getState,
    getNavigation,
    getView,
    persist,
    toast,
    heading,
    empty,
    esc,
    $,
    confirmAction,
    onResult,
    onWrongChange,
  }) {
    let paperYear = String(A.years[0]),
      currentPapersOnly = false;
    function latestPaperCard() {
      return P
        ? `<section class="panel latest-paper"><span class="label-tag">최신 회차 · ${esc(P.date)} · A형</span><h2>${esc(P.title)}</h2><p>원문 순서와 보기 고정 · 같은 문제를 반복해서 암기하세요.</p><p class="muted">현재 ${P.questions.length}/50문항 · ${esc(P.answerStatus)}${P.pendingNumbers.length ? `<br>${P.pendingNumbers.join("·")}번은 표 지문 확인 중이며 채점 대상에서 제외했습니다.` : ""}</p><div class="score-actions"><button class="button primary" data-start="paper">최신 회차 풀어보기 →</button><a class="button secondary" href="materials/files/network-2026-04-a.hwp" download>원본 시험지 ↓</a><a class="text-button" href="${esc(P.source)}" target="_blank" rel="noopener">공식 출처 ↗</a></div></section>`
        : "";
    }
    function paperLibrary() {
      return `<section class="panel paper-library" aria-labelledby="paper-library-title"><div class="paper-library-heading"><div><h2 id="paper-library-title">연도별 기출문제</h2><p>최근 5년 · ${A.papers.length}회차 · ${A.papers.reduce((n, p) => n + p.questions.length, 0)}문항</p></div><label class="paper-year-label" for="paper-year">연도<select id="paper-year" aria-label="기출 연도 선택"><option value="all" ${paperYear === "all" ? "selected" : ""}>전체 연도</option>${A.years.map((y) => `<option value="${y}" ${paperYear === String(y) ? "selected" : ""}>${y}년</option>`).join("")}</select></label></div><label class="paper-current-filter"><input type="checkbox" id="paper-current-only" ${currentPapersOnly ? "checked" : ""}>2025.08 개정 이후만 보기</label><div id="paper-rounds">${paperRounds()}</div>${(window.PENDING_PAPERS || []).length ? `<details class="paper-pending"><summary>원본 확보 대기 ${(window.PENDING_PAPERS || []).length}회차</summary><p>다운로드 응답을 확인하지 못한 회차는 채점 문제에 포함하지 않았습니다.</p>${window.PENDING_PAPERS.map((p) => `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title.replace("네트워크관리사 2급 필기 기출문제 및 CBT ", ""))} · 원문 자료실 ↗</a>`).join("")}</details>` : ""}<p class="paper-source-note">2025.08.01부터 Windows Server 2022 기준으로 변경되었습니다. 이전 회차의 운영체제 문제는 당시 기준입니다. <a href="https://exam.icqa.or.kr/cn/board/notice/463" target="_blank" rel="noopener">출제기준 안내 ↗</a></p></section>`;
    }
    function paperRounds() {
      const papers = A.filter(paperYear, currentPapersOnly);
      return papers.length
        ? `<div class="paper-round-grid">${papers.map((p) => `<article class="paper-round"><div class="paper-round-top"><span>${esc(p.date)}</span><span class="paper-standard ${p.previousStandard ? "previous" : ""}">${p.previousStandard ? "이전 출제기준" : "개정 이후"}</span></div><h3>${p.year}년 ${p.round}회${p.id === P.id ? " · 최신" : ""}</h3><p>${p.questions.length}문항 · 원문·보기 순서 고정</p><button class="button ${p.id === P.id ? "primary" : "secondary"} full" data-start="paper" data-paper="${esc(p.id)}" aria-label="${p.year}년 ${p.round}회 풀기">풀어보기 →</button><div class="paper-links"><a href="${esc(p.original)}" download>원본 ${p.id === P.id ? "HWP" : "PDF"} ↓</a><a href="${esc(p.source)}" target="_blank" rel="noopener">${esc(p.sourceName)} 출처 ↗</a></div></article>`).join("")}</div>`
        : empty("해당 회차가 없어요.", "다른 연도를 선택하거나 개정 이후 필터를 해제하세요.");
    }
    function paperOf(value) {
      return A.get(value?.paperId) || A.forIds(value?.ids) || P;
    }
    function questionFigures(q) {
      return (q.images || [])
        .map(
          (src, i) =>
            `<figure class="paper-figure"><img src="${esc(src)}" alt="원문 ${q.number}번의 표·그림 ${i + 1}"><figcaption>원문 표·그림 · ${q.number}번</figcaption></figure>`,
        )
        .join("");
    }
    function paperNote(q) {
      const p = A.forIds([q.id]);
      return p
        ? `<p class="paper-question-note">${p.year}년 ${p.round}회 · ${esc(p.answerStatus)}${p.previousStandard ? " · 이전 출제기준" : ""}</p>`
        : "";
    }
    // 문제풀이 진입: 회차 선택과 자체 연습을 구분합니다.
    function quizLanding() {
      const state = getState();

      main.innerHTML =
        heading(
          "PRACTICE MAKES PROGRESS",
          "아는 것을, 맞히는 힘으로.",
          "학습 가이드 기반 자체 제작 문제입니다. 공식 기출이 아니에요.",
        ) +
        `<div class="paper-discovery"><div><strong>2022~2026년 기출이 준비돼 있어요</strong><p>아래에서 연도를 선택하고 원하는 회차를 풀어보세요.</p></div><button class="button secondary" id="find-past-papers">연도별 기출 찾기 ↓</button></div>` +
        latestPaperCard() +
        paperLibrary() +
        `<div class="quiz-modes"><article class="mode-card"><span class="label-tag">10 QUESTIONS</span><h3>10문제 연습</h3><p>시간 제한 없음 · 문제별 해설</p><button class="button primary" data-start="quick">빠른 연습 시작 →</button></article><article class="mode-card"><span class="label-tag">50 MINUTES</span><h3>50문제 실전</h3><p>50분 제한 · 제출 후 일괄 채점</p><button class="button primary" data-start="exam">실전 연습 시작 →</button></article><article class="mode-card"><span class="label-tag">REVIEW</span><h3>오답 다시 풀기</h3><p>${state.wrong.length}문제 · 맞히면 오답에서 제외</p><button class="button secondary" data-start="wrong" ${state.wrong.length ? "" : "disabled"}>오답 다시 풀기 ↺</button></article></div><section class="panel"><div class="section-heading"><h2>나의 최근 연습</h2><span class="quiz-status">자체 연습 ${B.length}문항 · 기출 회차 별도</span></div>${
          state.records.length
            ? `<div class="table-wrap"><table><thead><tr><th>날짜</th><th>연습 방식</th><th>정답</th><th>점수</th></tr></thead><tbody>${state.records
                .slice(-8)
                .reverse()
                .map(
                  (r) =>
                    `<tr><td>${esc(new Date(r.at).toLocaleDateString("ko-KR"))}</td><td>${modeName(r.mode, r)}</td><td>${r.correct} / ${r.total}</td><td>${r.score}점</td></tr>`,
                )
                .join("")}</tbody></table></div>`
            : '<p class="section-description">첫 연습을 마치면 이곳에 기록이 쌓여요.</p>'
        }</section>`;
    }
    function modeName(mode, value = getState().session) {
      return mode === "paper"
        ? `${paperOf(value).title.replace(" 네트워크관리사 2급 필기", "")} 반복 풀이`
        : { exam: "실전 연습", quick: "빠른 연습", wrong: "오답노트" }[mode] || "연습";
    }
    function startQuiz(mode, paperId = P.id) {
      const state = getState();

      const paper = A.get(paperId);
      if (mode === "paper" && !paper) {
        toast("회차를 찾을 수 없어요.");
        return;
      }
      const ids =
        mode === "paper"
          ? paper.questions.map((q) => q.id)
          : C.shuffle(mode === "wrong" ? Q.filter((q) => state.wrong.includes(q.id)) : B)
              .slice(0, mode === "exam" ? 50 : mode === "quick" ? 10 : Q.length)
              .map((q) => q.id);
      if (!ids.length) {
        toast("아직 오답이 없어요. 먼저 문제를 풀어 보세요.");
        return;
      }
      state.session = {
        mode,
        ...(mode === "paper" ? { paperId: paper.id } : {}),
        ids,
        index: 0,
        answers: {},
        checked: [],
        startedAt: Date.now(),
        endsAt: mode === "exam" ? Date.now() + 50 * 60 * 1000 : null,
      };
      state.lastResult = null;
      persist();
      if (location.hash !== "#quiz") getNavigation().go("#quiz");
      else renderQuiz();
    }
    function remaining(session) {
      return Math.max(0, Math.ceil((session.endsAt - Date.now()) / 1000));
    }
    function timeString(seconds) {
      return (
        String(Math.floor(seconds / 60)).padStart(2, "0") +
        ":" +
        String(seconds % 60).padStart(2, "0")
      );
    }
    function renderQuiz() {
      const state = getState();

      if (!state.session) {
        if (state.lastResult) renderResult();
        else quizLanding();
        return;
      }
      const s = state.session;
      if (s.mode === "exam" && remaining(s) <= 0) {
        finishQuiz(true);
        return;
      }
      const q = Q.find((q) => q.id === s.ids[s.index]),
        answer = s.answers[q.id],
        checked = s.checked.includes(q.id);
      main.innerHTML =
        heading(
          "PRACTICE SESSION",
          modeName(s.mode),
          s.mode === "exam"
            ? "실전 연습 중에는 정답이 표시되지 않아요. 모든 답안을 확인하고 제출하세요."
            : "답을 선택한 뒤 확인하면 해설을 읽을 수 있어요.",
        ) +
        `<div class="quiz-layout"><section class="question-box"><div class="quiz-meta"><span>${esc(q.category)} <span style="margin-left:12px">${s.index + 1} / ${s.ids.length}</span></span>${s.mode === "exam" ? `<span class="timer" id="quiz-timer" aria-label="남은 시간">${timeString(remaining(s))}</span>` : "<span>시간 제한 없음</span>"}</div><h2 style="white-space:pre-line">${q.number ? `[원문 ${q.number}번] ` : ""}${esc(q.question)}</h2>${paperNote(q)}${questionFigures(q)}<div class="answers" role="group" aria-label="답안 선택">${q.options.map((option, i) => `<button type="button" class="answer ${answer === i ? "selected" : ""} ${checked && i === q.answer ? "correct" : ""} ${checked && answer === i && i !== q.answer ? "incorrect" : ""}" data-answer="${i}" aria-pressed="${answer === i}" ${checked ? "disabled" : ""}><span>${i + 1}</span>${esc(option)}</button>`).join("")}</div>${checked ? `<div class="explanation" role="status"><strong>${answer === q.answer ? "✓ 정답입니다." : "다시 기억해 두세요."} 정답 ${q.answer + 1}번 · ${esc(q.options[q.answer])}</strong><p>${esc(q.explanation)}</p></div>` : ""}<div class="quiz-controls"><button class="button secondary" data-question="${s.index - 1}" ${s.index === 0 ? "disabled" : ""}>← 이전</button>${s.mode !== "exam" && !checked ? `<button class="button primary" id="check-answer" ${answer === undefined ? "disabled" : ""}>정답 확인</button>` : ""}<button class="button ${s.mode === "exam" || checked ? "primary" : "secondary"}" data-question="${s.index + 1}" ${s.index === s.ids.length - 1 ? "disabled" : ""}>다음 →</button></div></section><aside class="question-map"><h3>문제 이동</h3><div class="map-grid">${s.ids.map((id, i) => `<button type="button" class="map-button ${s.answers[id] !== undefined ? "answered" : ""} ${i === s.index ? "current" : ""}" data-question="${i}" aria-label="${i + 1}번 문제${s.answers[id] !== undefined ? ", 답안 선택됨" : ""}" ${i === s.index ? 'aria-current="step"' : ""}>${i + 1}</button>`).join("")}</div><p>색칠된 번호는 답안을 선택한 문제입니다.<br>선택 ${Object.keys(s.answers).length} / ${s.ids.length}</p><button class="button primary full" id="submit-quiz">제출하고 채점</button><button class="text-button full" style="margin-top:12px" id="discard-quiz">이 연습 그만두기</button></aside></div><p class="timer-note">답안과 진행 상황은 자동 저장됩니다.${s.mode === "exam" ? " 다른 메뉴를 보거나 창을 닫아도 시험 시간은 계속 흐릅니다." : ""}</p>`;
    }
    // 채점·오답 저장은 여기서 끝내며 화면 모듈은 점수를 임의 변경하지 않습니다.
    function finishQuiz(auto = false) {
      const state = getState();

      if (!state.session) return;
      const s = state.session;
      let correct = 0;
      for (const id of s.ids) {
        const q = Q.find((q) => q.id === id);
        R.review(
          state.adaptive,
          q,
          {
            correct: s.answers[id] === q.answer,
            rating: s.answers[id] === q.answer ? "remember" : "unknown",
          },
          state.examDate,
        );
        if (s.answers[id] === q.answer) correct++;
        recordQuizWrong(s, id, s.answers[id] === q.answer);
      }
      state.lastResult = { ...s, finishedAt: Date.now() };
      state.records.push({
        mode: s.mode,
        ...(s.mode === "paper" ? { paperId: paperOf(s).id } : {}),
        score: Math.round((correct / s.ids.length) * 100),
        total: s.ids.length,
        correct,
        at: new Date().toISOString(),
      });
      state.records = state.records.slice(-30);
      state.session = null;
      persist();
      if (auto) toast("50분이 지나 답안을 자동 제출했어요.");
      if (getView() === "quiz") renderResult();
    }
    function renderResult() {
      const state = getState();

      const r = state.lastResult;
      if (!r) {
        quizLanding();
        return;
      }
      const correct = r.ids.filter(
          (id) => Q.find((q) => q.id === id).answer === r.answers[id],
        ).length,
        score = Math.round((correct / r.ids.length) * 100);
      main.innerHTML =
        heading(
          "SESSION COMPLETE",
          "오늘의 연습을 마쳤어요.",
          "맞힌 문제보다, 다음에 맞힐 문제를 하나 더 기억해요.",
        ) +
        `<section class="score-card"><span class="pill">${modeName(r.mode, r)} · ${r.ids.length}문항</span><div class="big-score">${score}<small style="font-size:20px">점</small></div><h2>${score >= 80 ? "잘 쌓이고 있어요. 이 감각을 이어가세요." : "오답의 이유를 알면 다음 점수가 달라져요."}</h2><p>${correct}문제 정답 · ${r.ids.length - correct}문제 오답/미응답<br>${r.mode === "paper" ? `${r.ids.length}문항 기준 · ${esc(paperOf(r).answerStatus)}` : "자체 연습 점수이며 실제 합격을 보장하지 않습니다."}</p><div class="score-actions">${r.mode === "paper" ? `<button class="button primary" data-start="paper" data-paper="${esc(paperOf(r).id)}">같은 회차 다시 풀기 ↺</button>` : ""}<button class="button secondary" id="new-quiz">다른 문제로 연습 →</button><a class="button secondary" href="#wrong">오답장 보기 ↗</a></div></section><div class="section-heading"><h2>문항별 해설</h2><span class="quiz-status">틀린 문제는 오답장에 저장됐어요.</span></div>${r.ids
          .map((id, i) => {
            const q = Q.find((q) => q.id === id),
              a = r.answers[id],
              right = a === q.answer;
            return `<details class="review-item"><summary>${right ? "✓" : "○"} ${i + 1}. ${esc(q.question)}</summary><div class="review-detail">${paperNote(q)}${questionFigures(q)}내 답: ${a === undefined ? "미응답" : `${a + 1}번 · ${esc(q.options[a])}`}<br><strong>정답: ${q.answer + 1}번 · ${esc(q.options[q.answer])}</strong><p>${esc(q.explanation)}</p><button class="text-button" data-wrong-toggle="${id}">${state.wrong.includes(id) ? "✓ 오답장에 저장됨 · 제외하기" : "복습을 위해 오답장에 추가"}</button></div></details>`;
          })
          .join("")}`;
      onResult();
    }
    function recordQuizWrong(session, id, correct) {
      const state = getState();

      if (session.mode === "wrong") {
        if (correct) W.remove(state, id);
        return;
      }
      W.update(state, session.mode === "paper" ? "past" : "practice", id, correct);
    }

    // Filters belong to this page; route aliases only choose a preset.
    function filterCurrent() {
      paperYear = "all";
      currentPapersOnly = true;
    }
    function filterAll() {
      paperYear = "all";
      currentPapersOnly = false;
    }
    function handleChange(event) {
      if (event.target.id === "paper-year") {
        paperYear = event.target.value;
        $("#paper-rounds").innerHTML = paperRounds();
      }
      if (event.target.id === "paper-current-only") {
        currentPapersOnly = event.target.checked;
        $("#paper-rounds").innerHTML = paperRounds();
      }
    }
    function handleClick(target) {
      const state = getState();
      if (target.id === "find-past-papers") {
        const year = $("#paper-year");
        year.scrollIntoView({ block: "center", behavior: "smooth" });
        year.focus({ preventScroll: true });
        return;
      }
      if (target.dataset.start) {
        const mode = target.dataset.start,
          paperId = target.dataset.paper || P.id;
        if (state.session)
          confirmAction(
            "진행 중인 연습이 있어요.",
            "기존 연습을 그만두고 새로 시작할까요? 기존 답안은 채점되지 않습니다.",
            () => startQuiz(mode, paperId),
          );
        else startQuiz(mode, paperId);
      }
      if (target.dataset.answer !== undefined && state.session) {
        const s = state.session,
          q = s.ids[s.index];
        if (!s.checked.includes(q)) {
          s.answers[q] = Number(target.dataset.answer);
          persist();
          renderQuiz();
        }
      }
      if (target.dataset.question !== undefined && state.session) {
        const index = Number(target.dataset.question);
        if (index >= 0 && index < state.session.ids.length) {
          state.session.index = index;
          persist();
          renderQuiz();
        }
      }
      if (target.id === "check-answer" && state.session) {
        const s = state.session,
          id = s.ids[s.index];
        if (s.answers[id] !== undefined && !s.checked.includes(id)) {
          s.checked.push(id);
          recordQuizWrong(s, id, s.answers[id] === Q.find((q) => q.id === id).answer);
          persist();
          renderQuiz();
        }
      }
      if (target.id === "submit-quiz" && state.session) {
        const s = state.session,
          n = s.ids.length - Object.keys(s.answers).length;
        confirmAction(
          "답안을 제출할까요?",
          n
            ? `아직 ${n}문제를 풀지 않았어요. 미응답은 오답으로 처리됩니다.`
            : "모든 답안이 선택되었습니다. 제출 후 점수와 해설을 확인할 수 있어요.",
          () => finishQuiz(),
        );
      }
      if (target.id === "discard-quiz")
        confirmAction(
          "이 연습을 그만둘까요?",
          "현재 답안은 채점되지 않습니다. 완료된 학습 기록은 유지됩니다.",
          () => {
            state.session = null;
            persist();
            quizLanding();
          },
        );
      if (target.id === "new-quiz") {
        state.lastResult = null;
        persist();
        quizLanding();
      }
      if (target.dataset.removeWrong) {
        W.remove(state, target.dataset.removeWrong);
        persist();
        onWrongChange();
      }
      if (target.dataset.wrongToggle) {
        if (state.wrong.includes(target.dataset.wrongToggle))
          W.remove(state, target.dataset.wrongToggle);
        else
          W.update(
            state,
            target.dataset.wrongToggle.startsWith("nw2-") ? "past" : "practice",
            target.dataset.wrongToggle,
            false,
          );
        persist();
        target.textContent = state.wrong.includes(target.dataset.wrongToggle)
          ? "✓ 오답장에 저장됨 · 제외하기"
          : "복습을 위해 오답장에 추가";
      }
    }
    function tick() {
      const state = getState();
      if (state.session?.mode !== "exam") return;
      const left = remaining(state.session);
      if (left <= 0) {
        finishQuiz(true);
        return;
      }
      const timer = $("#quiz-timer");
      if (timer) {
        timer.textContent = timeString(left);
        timer.classList.toggle("urgent", left <= 300);
      }
    }

    return {
      renderQuiz,
      quizLanding,
      startQuiz,
      modeName,
      paperNote,
      questionFigures,
      recordQuizWrong,
      handleClick,
      handleChange,
      filterCurrent,
      filterAll,
      tick,
    };
  }
  window.QuizPage = { create };
})();
