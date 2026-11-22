/* 설정과 기록 백업/복원. DOM은 공통 다이얼로그, 데이터 검증은 core/게임 모듈에 위임합니다. */
(() => {
  "use strict";
  function create({
    certificationId = "network",
    gameStorageKey = "network-keyword-rain:v1",
    C,
    D,
    Q,
    R,
    $,
    getState,
    setState,
    getView,
    persist,
    route,
    toast,
    onReset,
  }) {
    function openSettings() {
      $("#exam-date").value = getState().examDate;
      $("#settings-dialog").showModal();
    }
    function confirmAction(title, message, action) {
      $("#confirm-title").textContent = title;
      $("#confirm-message").textContent = message;
      const dialog = $("#confirm-dialog");
      $("#confirm-ok").onclick = () => {
        dialog.close();
        action();
      };
      $("#confirm-cancel").onclick = () => dialog.close();
      dialog.showModal();
    }

    function handleClick(target) {
      if (target.matches("[data-settings],#settings-button")) {
        openSettings();
        return;
      }
      if (target.hasAttribute("data-close")) {
        $("#settings-dialog").close();
        return;
      }
      if (target.id === "reset-progress")
        confirmAction(
          "학습 기록을 초기화할까요?",
          "키워드·북마크·오답·진도·연습 기록·진행 중인 답안이 지워집니다. 필요하면 먼저 기록을 내보내 주세요.",
          () => {
            onReset();
            $("#settings-dialog").close();
            route();
            toast("학습 기록을 초기화했어요.");
          },
        );
      if (target.id === "export-progress") {
        const blob = new Blob(
            [
              JSON.stringify(
                {
                  app: "network-notes",
                  ...getState(),
                  certificationId,
                  gameProgress: window.KeywordGame.exportProgress(gameStorageKey),
                },
                null,
                2,
              ),
            ],
            { type: "application/json" },
          ),
          url = URL.createObjectURL(blob),
          a = document.createElement("a");
        a.href = url;
        a.download = certificationId + "-study-" + C.localDate() + ".json";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast("학습 기록 파일을 내보냈어요.");
      }
    }
    function handleSubmit(event) {
      if (event.target.id === "settings-form") {
        event.preventDefault();
        const state = getState();
        state.examDate = $("#exam-date").value;
        R.reschedule(state.adaptive, state.examDate);
        persist();
        $("#settings-dialog").close();
        if (["dashboard", "plan"].includes(getView())) route();
        toast("시험 날짜를 저장했어요.");
      }
    }
    $("#import-progress").addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        if (file.size > 2 * 1024 * 1024) throw new Error("파일은 2MB 이하로 선택해 주세요.");
        const source = JSON.parse(await file.text());
        if (source.app !== "network-notes" || source.version !== 1)
          throw new Error("합격루틴의 기록 파일을 선택해 주세요.");
        if ((source.certificationId || "network") !== certificationId)
          throw new Error("현재 시험의 기록 파일을 선택해 주세요.");
        const imported = C.cleanState(source, D, Q);
        confirmAction(
          "학습 기록을 가져올까요?",
          "이 파일의 기록으로 현재 브라우저의 학습 기록을 덮어씁니다.",
          () => {
            const gameSaved = window.KeywordGame.importProgress(
              source.gameProgress,
              gameStorageKey,
            );
            setState(imported);
            persist();
            $("#settings-dialog").close();
            route();
            toast(
              gameSaved
                ? "학습·게임 기록을 가져왔어요."
                : "학습 기록을 가져왔지만 게임 기록은 저장하지 못했어요.",
            );
          },
        );
      } catch (error) {
        toast(error.message || "기록을 읽지 못했어요.");
      }
      event.target.value = "";
    });

    return { openSettings, confirmAction, handleClick, handleSubmit };
  }
  window.SettingsController = { create };
})();
