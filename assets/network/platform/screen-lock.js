/* 간단한 정적 화면 가림막. 서버 인증/파일 접근 제어가 아닙니다.
   한국 날짜(YYMMDD)를 매일 계산하므로 비밀 비밀번호로 취급하지 않습니다.
   탭의 sessionStorage에 통과 표시만 저장하며 학습 기록에는 접근하지 않습니다.
   한국 자정/탭 복귀 시 어제의 통과 상태를 만료합니다. 기기 시계에 의존합니다. */
(function (root) {
  "use strict";
  const storageKey = "study-screen-unlocked:v2";
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  const koreaOffset = 9 * 60 * 60 * 1000;
  // 기기의 표시 시간대와 무관하게 한국 표준시(UTC+9)의 날짜를 사용합니다.
  function dateCode(now = new Date()) {
    const shifted = new Date(now.getTime() + koreaOffset);
    if (!Number.isFinite(shifted.getTime())) return "";
    return (
      String(shifted.getUTCFullYear()).slice(-2) +
      String(shifted.getUTCMonth() + 1).padStart(2, "0") +
      String(shifted.getUTCDate()).padStart(2, "0")
    );
  }
  function matchesCode(value, now = new Date()) {
    return typeof value === "string" && /^[0-9]{6}$/.test(value) && value === dateCode(now);
  }
  function hasPass(storage, now = new Date()) {
    try {
      return Boolean(dateCode(now)) && storage.getItem(storageKey) === dateCode(now);
    } catch {
      return false;
    }
  }
  function untilMidnight(now = new Date()) {
    const milliseconds = now.getTime();
    return (
      (Math.floor((milliseconds + koreaOffset) / dayMilliseconds) + 1) * dayMilliseconds -
      koreaOffset -
      milliseconds
    );
  }
  let expiryTimer,
    unlockedDate = "";
  function scheduleExpiry() {
    root.clearTimeout(expiryTimer);
    expiryTimer = root.setTimeout(checkDate, Math.max(1, untilMidnight() + 20));
  }
  function checkDate() {
    if (!unlockedDate) return;
    if (unlockedDate !== dateCode()) lock();
    else scheduleExpiry();
  }
  const document = root.document;
  function show() {
    if (!document || document.getElementById("screen-lock")) return;
    document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
    const section = document.createElement("section");
    section.id = "screen-lock";
    section.innerHTML = `<form class="screen-lock-card" id="screen-lock-form"><span class="label-tag">합격루틴 · 화면 잠금</span><h1>입장 코드를 입력해 주세요</h1><p>한국 시간의 오늘 날짜를 숫자 6자리(YYMMDD)로 입력해요.</p><label for="screen-lock-code">입장 코드</label><input id="screen-lock-code" name="entry-code" type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="off" required aria-describedby="screen-lock-feedback"><p id="screen-lock-feedback" role="status" aria-live="polite"></p><button type="submit" class="button primary full">공부 화면 열기 →</button><small>간단한 화면 가림막입니다. 공개 파일의 접근을 막는 보안 기능은 아니에요.</small></form>`;
    document.body.appendChild(section);
    const input = section.querySelector("input");
    section.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!matchesCode(input.value)) {
        section.querySelector("[role=status]").textContent =
          "코드가 맞지 않아요. 숫자 6자리를 확인해 주세요.";
        input.value = "";
        input.focus({ preventScroll: true });
        return;
      }
      try {
        root.sessionStorage.setItem(storageKey, dateCode());
      } catch {}
      unlockedDate = dateCode();
      scheduleExpiry();
      input.value = "";
      document.documentElement.removeAttribute("data-screen-locked");
      section.remove();
      document.querySelector("#main")?.focus({ preventScroll: true });
    });
    input.focus({ preventScroll: true });
  }
  function lock() {
    if (!document) return;
    root.clearTimeout(expiryTimer);
    unlockedDate = "";
    try {
      root.sessionStorage.removeItem(storageKey);
    } catch {}
    document.documentElement.setAttribute("data-screen-locked", "");
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", show, { once: true });
    else show();
  }
  const api = { dateCode, matchesCode, hasPass, untilMidnight, lock };
  root.ScreenLock = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!document) return;
  let passed = false;
  try {
    passed = hasPass(root.sessionStorage);
  } catch {}
  if (!passed) lock();
  else {
    unlockedDate = dateCode();
    scheduleExpiry();
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) checkDate();
  });
  root.addEventListener("focus", checkDate);
  document.addEventListener("click", (event) => {
    if (event.target.closest?.("[data-screen-lock]")) {
      event.preventDefault();
      lock();
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
