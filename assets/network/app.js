/* 앱 조립부: 상태·저장·내비게이션·페이지 간 이벤트를 연결합니다. 모듈 책임표는 docs/architecture.md 참고. */
(() => {
  "use strict";
  const examWorkspace = window.ExamWorkspace;
  if (!location.hash) history.replaceState(history.state, "", location.search + "#exams");
  const selectedExam = examWorkspace.resolve(location.search);
  const practicePack = window.ExamPractice.get(selectedExam);
  const gameStorageKey = practicePack
    ? `cert-game:${selectedExam.id}:v1`
    : "network-keyword-rain:v1";
  const D = practicePack?.data || window.STUDY_DATA,
    B = practicePack?.questions || window.STUDY_QUESTIONS,
    P = practicePack ? null : window.LATEST_PAPER,
    A = window.PaperArchive.create(P, practicePack ? [] : window.PAST_PAPERS),
    Q = [...B, ...A.papers.flatMap((p) => p.questions)],
    C = window.StudyCore;
  const W = window.WrongNotebook;
  const KEY = practicePack ? `cert-study:${selectedExam.id}:v1` : "network-notes:v1",
    R = window.ReviewCore,
    items = R.catalog(D, Q);
  try {
    const old = localStorage.getItem(KEY);
    if (old && !localStorage.getItem(KEY + ":before-adaptive"))
      localStorage.setItem(KEY + ":before-adaptive", old);
  } catch {}
  const $ = (selector, root = document) => root.querySelector(selector);
  const { escapeHTML: esc, empty } = window.PageUI;
  const heading = (kicker, title, description, extra) =>
    window.PageUI.heading(kicker, title, description, extra, Boolean(practicePack));
  const materialsStore = window.StudyMaterialsStore.forExam(selectedExam.id);
  let storageOK = true,
    state;
  try {
    state = C.cleanState(JSON.parse(localStorage.getItem(KEY) || "{}"), D, Q);
  } catch {
    state = C.cleanState({}, D, Q);
    storageOK = false;
  }
  if (!practicePack && !state.examDate) state.examDate = R.DEFAULT_EXAM;
  let filter = "전체",
    query = "",
    onlyUnlearned = false,
    toastTimer,
    currentView = "dashboard";
  const main = $("#main");
  let navigation;
  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      storageOK = false;
    }
    updateStorage();
    updateBadges();
  }
  function updateStorage() {
    const e = $("#save-status");
    e.textContent = storageOK ? "자동 저장" : "자동 저장 불가 · 기록 내보내기 권장";
    e.classList.toggle("storage-warning", !storageOK);
  }
  function updateBadges() {
    $("#keyword-count").textContent = D.keywords.length;
    $("#wrong-count").textContent = W.count(state);
  }
  function toast(message) {
    const t = $("#toast");
    t.textContent = message;
    t.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("visible"), 2800);
  }
  function toggle(list, value) {
    const i = list.indexOf(value);
    if (i < 0) list.push(value);
    else list.splice(i, 1);
  }
  // 경로 전환 전 각 페이지의 타이머/리스너/레이아웃 관찰자를 해제합니다.
  function route() {
    window.KeywordLayout?.unmount();
    window.DailyStudy?.unmount();
    window.KeywordGame?.unmount();
    window.StudyMaterialsPage?.unmount();
    window.PaperSourcesPage.unmount();
    const [view = "dashboard", id] = location.hash.slice(1).split("/");
    currentView = [
      "dashboard",
      "keywords",
      "commands",
      "theory",
      "quiz",
      "wrong",
      "plan",
      "materials",
      "game",
      "daily",
      "help",
      "exams",
      "sources",
    ].includes(view)
      ? view
      : "dashboard";
    filter = "전체";
    query = "";
    examWorkspace.shell(examWorkspace.resolve(location.search), currentView === "exams");
    if (currentView === "quiz" && id === "current") {
      quizPage.filterCurrent();
    }
    document.querySelectorAll("[data-view]").forEach((a) => {
      a.classList.toggle("active", a.dataset.view === currentView);
      if (a.dataset.view === currentView) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    ({
      sources: () =>
        window.PaperSourcesPage.mount({ main, exam: examWorkspace.resolve(location.search) }),
      exams: () => {
        main.innerHTML = examWorkspace.selection();
      },
      help: () => {
        main.innerHTML = window.UserGuidePage.render(Boolean(practicePack));
      },
      dashboard,
      keywords,
      commands,
      daily: () =>
        window.DailyStudy.mount({
          root: main,
          state,
          items,
          save: persist,
          toast,
          presetMinutes: id === "5" ? 5 : null,
          planOptions: practicePack ? { practiceMinutes: B.length, basicOnly: true } : undefined,
          onReview: (id, correct) => {
            W.update(state, "daily", id, correct);
            persist();
          },
        }),
      game: () =>
        window.KeywordGame.mount({
          keywords: D.keywords,
          storageKey: gameStorageKey,
          root: main,
          onFinish: () => {
            coach.refresh();
            helper.setGameActive(false);
          },
          onActivity: () => {
            coach.refresh();
            helper.setGameActive(window.KeywordGame.isPlaying());
          },
          onReview: (id, correct) => {
            W.update(state, "game", id, correct);
            persist();
          },
        }),
      theory: () => theory(id),
      quiz: renderQuiz,
      wrong: wrongView,
      plan: renderPlan,
      materials: () =>
        window.StudyMaterialsPage.mount({
          root: main,
          toast,
          confirmAction,
          store: materialsStore,
          publicMaterials: practicePack ? [] : window.PUBLIC_MATERIALS,
        }),
    })[currentView]();
    updateBadges();
    updateStorage();
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title =
      {
        exams: "시험 선택",
        sources: "기출 자료",
        help: "사용법",
        dashboard: "학습 현황",
        keywords: "키워드 암기",
        commands: "명령어 노트",
        theory: "핵심정리",
        quiz: "문제 풀이",
        wrong: "오답노트",
        plan: "14일 학습 계획",
        materials: "시험 자료",
        game: "키워드 산성비",
        daily: "오늘의 학습",
      }[currentView] + " · 합격루틴";
    coach.route();
    helper.setGameActive(window.KeywordGame.isPlaying());
  }
  async function copyCommand(id) {
    const c = D.commands.find((c) => c.id === id);
    try {
      if (navigator.clipboard && window.isSecureContext)
        await navigator.clipboard.writeText(c.command);
      else {
        const t = document.createElement("textarea");
        t.value = c.command;
        t.style.position = "fixed";
        t.style.opacity = "0";
        document.body.append(t);
        t.select();
        const ok = document.execCommand("copy");
        t.remove();
        if (!ok) throw new Error("copy");
      }
      toast("명령·설정을 복사했어요.");
    } catch {
      toast("복사할 수 없어요. 명령어 텍스트를 선택해 복사해 주세요.");
    }
  }
  document.addEventListener("click", (event) => {
    const target = event.target.closest("button,a");
    if (!target) return;
    if (target.getAttribute("href") === "#main") {
      event.preventDefault();
      main.focus();
      main.scrollIntoView();
      return;
    }
    // 본문 안 이동은 앱 경로로 처리하지 않아 해시 라우팅이 그림 링크를 삼키지 않게 합니다.
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
    if (
      target.tagName === "A" &&
      target.getAttribute("href")?.startsWith("#") &&
      !target.hasAttribute("download") &&
      !target.target &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.altKey &&
      (!event.button || event.button === 0)
    ) {
      event.preventDefault();
      if (target.hasAttribute("data-guide-link")) $("#settings-dialog").close();
      navigation.go(target.getAttribute("href"));
      return;
    }
    if (target.dataset.filter !== undefined) {
      filter = target.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((b) => {
        b.classList.toggle("active", b === target);
        b.setAttribute("aria-pressed", b === target ? "true" : "false");
      });
      currentView === "keywords" ? keywordResults() : commandResults();
    }
    if (target.id === "unlearned-toggle") {
      onlyUnlearned = !onlyUnlearned;
      target.classList.toggle("active", onlyUnlearned);
      target.setAttribute("aria-pressed", String(onlyUnlearned));
      keywordResults();
    }
    if (notebookPage.handle(target)) return;
    quizPage.handleClick(target);
    settings.handleClick(target);
    if (target.dataset.memory) {
      const k = D.keywords.find((k) => k.id === target.dataset.memory),
        rating = target.dataset.rating;
      R.review(
        state.adaptive,
        items.find((i) => i.id === k.id),
        { correct: rating === "remember", rating },
        state.examDate,
      );
      W.update(state, "keywords", k.id, rating === "remember");
      persist();
      target
        .closest(".memory-actions")
        .querySelectorAll("button")
        .forEach((b) => (b.disabled = true));
      toast("다음 복습 · " + state.adaptive.entries[k.id].nextReviewAt);
      return;
    }
    if (target.dataset.reveal) {
      const k = D.keywords.find((k) => k.id === target.dataset.reveal),
        open = target.getAttribute("aria-expanded") === "true";
      target.textContent = open ? "정답 보기" : "정답 접기";
      const answerBox = target.closest(".flash-card").querySelector(".keyword-answer");
      if (answerBox) answerBox.hidden = open;
      target.setAttribute("aria-expanded", String(!open));
      const ratings = target.closest(".flash-card").querySelector(".memory-actions");
      if (ratings) ratings.hidden = open;
    }
    if (target.dataset.master) {
      toggle(state.mastered, target.dataset.master);
      persist();
      $("#mastery-count").textContent = `암기 완료 ${state.mastered.length} / ${D.keywords.length}`;
      keywordResults();
    }
    if (target.dataset.copy) copyCommand(target.dataset.copy);
    if (target.dataset.read) {
      toggle(state.read, target.dataset.read);
      persist();
      theory(target.dataset.read);
    }
  });
  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.dataset.routine !== undefined) {
      const date = C.localDate();
      state.routines[date] ??= [];
      toggle(state.routines[date], Number(target.dataset.routine));
      persist();
      const label = $(`label[for="${target.id}"]`);
      if (label) label.classList.toggle("routine-complete", target.checked);
    }
    if (target.dataset.plan !== undefined) {
      toggle(state.plans, Number(target.dataset.plan));
      persist();
      renderPlan();
    }
  });
  document.addEventListener("input", (event) => {
    if (event.target.id === "search") {
      query = event.target.value;
      currentView === "keywords" ? keywordResults() : commandResults();
    }
  });
  document.addEventListener("change", (event) => quizPage.handleChange(event));
  document.addEventListener("submit", (event) => {
    settings.handleSubmit(event);
    if (event.target.id === "subnet-form") {
      event.preventDefault();
      const ip = $("#ip-input").value.trim(),
        prefix = Number($("#prefix-input").value);
      try {
        const r = C.subnet(ip, prefix);
        $("#subnet-result").innerHTML = `<div class="calc-results">${[
          ["네트워크 주소", r.network],
          ["서브넷 마스크", r.mask],
          ["브로드캐스트", r.broadcast],
          ["사용 가능한 호스트", r.hosts.toLocaleString() + "개"],
          ["사용 가능 범위", r.first + " ~ " + r.last],
        ]
          .map(
            ([label, value]) =>
              `<div class="calc-result"><span>${label}</span><strong>${esc(value)}</strong></div>`,
          )
          .join("")}</div><p class="fine-print">${esc(r.note)}</p>`;
      } catch (error) {
        $("#subnet-result").textContent = error.message;
      }
    }
  });
  navigation = window.AppNavigation.create(window, route);
  window.StudyApp = {
    requestRefresh(action) {
      persist();
      if (window.KeywordGame?.isPlaying())
        confirmAction(
          "지금 업데이트할까요?",
          "학습 답안과 기존 기록은 유지됩니다. 진행 중인 산성비 라운드는 종료되며 이번 라운드의 미적립 GP는 저장되지 않습니다.",
          action,
        );
      else action();
    },
  };
  setInterval(() => quizPage.tick(), 1000);
  const coach = window.StudyCoach.mount({
    basicOnly: Boolean(practicePack),
    storageKey: practicePack ? `cert-coach:${selectedExam.id}:v1` : "network-study-coach:v1",
    root: main,
    getView: () => currentView,
    getMode: () =>
      currentView === "game"
        ? window.KeywordGame.isPlaying()
          ? "game"
          : null
        : currentView === "quiz"
          ? state.session
            ? state.session.mode === "paper"
              ? "past"
              : "practice"
            : null
          : currentView,
  });
  document.addEventListener("study-helper-search", (e) => {
    const { view, term } = e.detail || {};
    if (view === "quiz") {
      quizPage.filterAll();
      navigation.go("#quiz");
      renderQuiz();
      return;
    }
    if (!["keywords", "commands"].includes(view) || typeof term !== "string") return;
    navigation.go("#" + view);
    query = term.slice(0, 160);
    $("#search").value = query;
    if (view === "keywords") keywordResults();
    else commandResults();
  });
  const helper = window.FeatureHelper.mount(D);
  const settings = window.SettingsController.create({
    certificationId: selectedExam.id,
    gameStorageKey,
    C,
    D,
    Q,
    R,
    $,
    getState: () => state,
    setState: (next) => {
      state = next;
    },
    getView: () => currentView,
    persist,
    route,
    toast,
    onReset: () => {
      state = C.cleanState({}, D, Q);
      coach.reset();
      persist();
    },
  });
  const { openSettings, confirmAction } = settings;
  const quizPage = window.QuizPage.create({
    practiceOnly: Boolean(practicePack),
    B,
    P,
    A,
    Q,
    C,
    R,
    W,
    main,
    getState: () => state,
    getNavigation: () => navigation,
    getView: () => currentView,
    persist,
    toast,
    heading,
    empty,
    esc,
    $,
    confirmAction,
    onResult: () => coach.refresh(),
    onWrongChange: () => wrongView(),
  });
  const {
    renderQuiz,
    quizLanding,
    startQuiz,
    modeName,
    paperNote,
    questionFigures,
    recordQuizWrong,
  } = quizPage;
  const { dashboard, renderPlan } = window.HomePages.create({
    D,
    P,
    A,
    R,
    C,
    W,
    items,
    main,
    getState: () => state,
    heading,
    esc,
    modeName,
  });
  // 가져오기·초기화 후에도 페이지는 getState로 최신 상태를 읽습니다.
  const { keywords, keywordResults, commands, commandResults, theory } =
    window.ReferencePages.create({
      D,
      getState: () => state,
      getUI: () => ({ filter, query, onlyUnlearned }),
      main,
      heading,
      empty,
      $,
      esc,
    });
  const notebookPage = window.WrongNotebookPage.create({
    getState: () => state,
    W,
    D,
    items,
    main,
    heading,
    empty,
    paperNote,
    questionFigures,
    esc,
    persist,
    toast,
  });
  const wrongView = () => notebookPage.render();
  updateBadges();
  updateStorage();
  navigation.init();
})();
