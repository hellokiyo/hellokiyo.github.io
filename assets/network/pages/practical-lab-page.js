/* 가상 실험실 UI. PracticalLab이 상태/검사를 담당하며 입력은 이 탭의 메모리에만 있습니다.
   가상 startup 저장도 브라우저 새로고침 시 초기화됩니다. 실제 VM·네트워크 실행은 없습니다. */
(function (root) {
  "use strict";
  function create({ main, engine, esc, enabled = true }) {
    let router = engine.initial(),
      windows = {},
      cables = { a: Array(8).fill(""), b: Array(8).fill("") };
    let tab = "windows",
      end = "a",
      cableKind = "straight",
      selectedColor = engine.colors[0],
      history = [],
      results = null,
      message = "",
      resultsStale = false;
    const windowsUI = root.LabWindows.create({
      engine,
      esc,
      onApply(value) {
        windows = value;
        resultsStale = Boolean(results);
        message = "가상 어댑터에 적용했어요. 실습 테스트에서 조건을 확인하세요.";
      },
    });
    const wireMime = "application/x-study-wire";
    let dropTarget = null;
    function windowsPanel() {
      return windowsUI.render();
    }
    function routerPanel() {
      const saved = engine.sameConfig(router.startup, router.running);
      return `<div class="lab-device-status"><span>모드</span><strong>${esc(engine.prompt(router))}</strong><span class="${saved ? "lab-pass" : "lab-miss"}">${router.pending ? "저장 확인 대기" : saved ? "현재 구성 저장됨" : "현재 구성 미저장"}</span></div><div class="lab-window-title">Router Emulator를 본뜬 학습 콘솔 · 부분 명령 지원</div><pre id="lab-console" class="lab-console" aria-live="polite">${esc(history.join("\n") || "가상 라우터 준비 완료. ? 로 지원 명령을 확인하세요.")}</pre><form id="lab-router-form" class="lab-command"><label for="lab-command">${esc(engine.prompt(router))}</label><input id="lab-command" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="180" placeholder="명령 입력 후 Enter"><button type="submit" class="button primary">실행</button></form><p class="fine-print">이 콘솔은 JS 상태만 바꿉니다. ping·장비 연결·실제 링크·파일 명령은 실행하지 않습니다. copy 명령 뒤에는 저장 파일 확인에 Enter를 누르세요. reload는 가상 재시작입니다. 오타/미완성 명령은 IOS 형태 오류로 표시합니다.</p>`;
    }
    function cablePanel() {
      return `<div class="lab-window-title">가상 케이블 작업대 · ${cableKind === "straight" ? "직결" : "교차"} 예제</div><p>색을 핀으로 드래그하세요. 꽂힌 선끼리는 드래그해서 위치를 바꿀 수 있어요. 휴대폰에서는 색 선택 → 핀 터치도 가능합니다. 금속 접점이 보이고 걸쇠는 뒤, 케이블은 아래일 때 왼쪽이1번입니다.</p><div class="filter-group" aria-label="케이블 과제 선택"><button type="button" class="filter ${cableKind === "straight" ? "active" : ""}" data-lab-cable-kind="straight" aria-pressed="${cableKind === "straight"}">직결</button><button type="button" class="filter ${cableKind === "cross" ? "active" : ""}" data-lab-cable-kind="cross" aria-pressed="${cableKind === "cross"}">교차</button></div><p class="fine-print">직결은 같은 표준끼리, 교차는 A/B 표준을 양쪽에 씁니다. Auto MDI-X 장비의 자동 보정과 별개로 과제의 결선 지시를 따르세요.</p><details><summary>표준 색 순서 확인</summary><p>T568A: ${engine.colorsA.join(" · ")}</p><p>T568B: ${engine.colors.join(" · ")}</p></details><div class="filter-group">${["a", "b"].map((side) => `<button type="button" class="filter ${end === side ? "active" : ""}" data-lab-end="${side}">커넥터 ${side.toUpperCase()}</button>`).join("")}</div><div class="lab-palette">${engine.colors.map((color, i) => `<button type="button" class="${selectedColor === color ? "is-selected" : ""}" data-lab-color="${i}" draggable="true" title="핀으로 드래그하거나 선택하세요" aria-pressed="${selectedColor === color}"><i class="lab-color-${i}" aria-hidden="true"></i>${esc(color)}</button>`).join("")}</div><div class="practical-pins lab-connectors">${cables[end].map((color, i) => `<button type="button" data-lab-pin="${i}" draggable="${Boolean(color)}" aria-label="${end.toUpperCase()} ${i + 1}번 핀 ${color || "빈칸"}"><b>${i + 1}</b><i class="lab-color-${engine.colors.indexOf(color)}" aria-hidden="true"></i><span>${esc(color || "선택")}</span></button>`).join("")}</div><p>A: ${esc(cables.a.map((color) => color || "＿").join(" · "))}</p><p>B: ${esc(cables.b.map((color) => color || "＿").join(" · "))}</p><p class="fine-print">색 배치 확인 모형입니다. 압착·접촉 불량·길이·통신 품질은 실물로 확인해야 합니다.</p>`;
    }
    function render() {
      if (!enabled) {
        main.innerHTML =
          '<section class="panel"><h1>네트워크관리사 2급 전용 실험실</h1><a href="#exams">시험 선택 →</a></section>';
        return;
      }
      main.innerHTML = `<div class="page-heading"><div><h1>가상 실기 실험실</h1><p>설정하고 → 확인하고 → 저장하고 → 실습 테스트</p></div><a class="button secondary" href="#practical">따라하기·로드맵</a></div><p class="inline-note">자체 제작한 브라우저 시뮬레이터입니다. 실제 Windows VM·공식 시험 프로그램이 아니며, PC 설정은 바뀌지 않습니다. 가상 장비 상태는 새로고침하면 초기화됩니다.</p><div class="lab-shell"><section class="panel lab-desktop"><header class="lab-toolbar"><strong>실습 장비 · 실행 중</strong><button type="button" class="text-button" id="lab-reset">가상 장비 초기화</button></header><nav class="lab-apps" aria-label="실험실 앱">${[
        ["windows", "Windows 설정"],
        ["router", "라우터 콘솔"],
        ["cable", "케이블 작업대"],
      ]
        .map(
          ([id, label]) =>
            `<button type="button" class="${tab === id ? "active" : ""}" data-lab-tab="${id}" aria-pressed="${tab === id}">${label}</button>`,
        )
        .join(
          "",
        )}</nav><div class="lab-surface">${tab === "windows" ? windowsPanel() : tab === "router" ? routerPanel() : cablePanel()}<p id="lab-status" role="status">${esc(message)}</p></div></section><aside class="panel lab-mission"><span class="label-tag">자체 예제 · 공식 점수 아님</span><h2>오늘의 실습 과제</h2><details open><summary>설정할 값 보기</summary><p>Windows: IP .10 / 마스크 255.255.255.0 / 게이트웨이 .1 / DNS .2<br>모두 192.168.10.x 대역입니다.</p><p>라우터: FastEthernet0/0에 192.168.10.1/24, 포트 켜기. 목적지192.168.20.0/24의 다음 홉192.168.10.2. 확인 후 가상 startup에 저장.</p><p>케이블: ${cableKind === "straight" ? "직결 · 양끝 같은 표준" : "교차 · 양끝 A/B 표준"}. 실물 연습은 별도로 합니다.</p></details><button type="button" id="lab-test" class="button primary full">실습 테스트 →</button><div class="lab-results" role="status">${results ? `${resultsStale ? '<p class="lab-stale">설정이 변경됐습니다. 다시 테스트하세요. 아래는 이전 결과입니다.</p>' : ""}<h3>${results.filter((result) => result.ok).length} / ${results.length} 조건 확인</h3>${results.map((result) => `<article class="lab-result-row ${result.ok ? "lab-pass" : "lab-miss"}"><strong>${result.ok ? "✓" : "○"} ${esc(result.label)}</strong><p>${esc(result.detail)}</p>${!result.ok ? `<button type="button" class="text-button" data-lab-tab="${result.target}">해당 설정으로 이동 →</button>` : ""}</article>`).join("")}` : "설정을 바꾼 뒤 테스트 버튼을 눌러 확인하세요."}</div><p class="fine-print">검사는 지정한 예제 값과 가상 저장 여부만 봅니다. 실제 장비 통신·공식 채점·합격 점수를 의미하지 않습니다.</p></aside></div>`;
    }
    function handleClick(target) {
      if (!enabled) return false;
      if (windowsUI.handleClick(target)) {
        render();
        return true;
      }
      if (target.dataset.labTab && ["windows", "router", "cable"].includes(target.dataset.labTab)) {
        tab = target.dataset.labTab;
        message = "";
        render();
        return true;
      }
      if (["straight", "cross"].includes(target.dataset.labCableKind)) {
        cableKind = target.dataset.labCableKind;
        resultsStale = Boolean(results);
        render();
        return true;
      }
      if (target.dataset.labEnd && ["a", "b"].includes(target.dataset.labEnd)) {
        end = target.dataset.labEnd;
        render();
        return true;
      }
      if (target.dataset.labColor !== undefined) {
        const color = engine.colors[Number(target.dataset.labColor)];
        if (color) {
          selectedColor = color;
          render();
        }
        return true;
      }
      if (target.dataset.labPin !== undefined) {
        const pin = Number(target.dataset.labPin);
        if (Number.isInteger(pin) && pin >= 0 && pin < 8) {
          cables[end][pin] = selectedColor;
          resultsStale = Boolean(results);
          message = `${end.toUpperCase()} ${pin + 1}번 핀에 ${selectedColor} 배치`;
          render();
        }
        return true;
      }
      if (target.id === "lab-test") {
        results = engine.inspect(router, windows, cables, cableKind);
        resultsStale = false;
        render();
        return true;
      }
      if (target.id === "lab-reset") {
        router = engine.initial();
        end = "a";
        cableKind = "straight";
        selectedColor = engine.colors[0];
        windows = {};
        windowsUI.reset();
        cables = { a: Array(8).fill(""), b: Array(8).fill("") };
        history = [];
        results = null;
        resultsStale = false;
        message = "가상 장비만 초기화했어요. 학습 기록은 그대로입니다.";
        render();
        return true;
      }
      return false;
    }
    function handleSubmit(event) {
      if (!enabled) return false;
      const windowsResult = windowsUI.handleSubmit(event, main);
      if (windowsResult) {
        if (windowsResult === "render") render();
        return true;
      }
      if (event.target.id === "lab-router-form") {
        event.preventDefault();
        const input = main.querySelector("#lab-command").value.slice(0, 180),
          before = engine.prompt(router),
          result = engine.run(router, input);
        const changed = JSON.stringify(router) !== JSON.stringify(result.state);
        router = result.state;
        history.push(`${before} ${input}`, result.output);
        history = history.slice(-100);
        if (changed) resultsStale = Boolean(results);
        message =
          result.errorKind === "unsupported"
            ? "시뮬레이터 미구현 명령은 실기 오답으로 판정하지 않습니다."
            : result.errorKind
              ? "명령 오류: 설정은 바뀌지 않았어요. 프롬프트·철자·필수 값을 확인하세요."
              : "";
        render();
        const console = main.querySelector("#lab-console");
        console.scrollTop = console.scrollHeight;
        main.querySelector("#lab-command").focus({ preventScroll: true });
        return true;
      }
      return false;
    }
    function handleChange(event) {
      if (enabled && windowsUI.handleChange(event, main)) {
        render();
        return true;
      }
      return false;
    }
    function handleDrag(event) {
      if (!enabled || tab !== "cable") return false;
      const pin = event.target.closest?.("[data-lab-pin]"),
        colorButton = event.target.closest?.("[data-lab-color]");
      if (event.type === "dragstart") {
        if (!event.dataTransfer || (!pin && !colorButton)) return false;
        const color = pin
          ? cables[end][Number(pin.dataset.labPin)]
          : engine.colors[Number(colorButton.dataset.labColor)];
        if (!engine.colors.includes(color)) return false;
        event.dataTransfer.setData(
          wireMime,
          JSON.stringify({ color, source: pin ? { end, pin: Number(pin.dataset.labPin) } : null }),
        );
        event.dataTransfer.effectAllowed = pin ? "move" : "copy";
        return true;
      }
      if (event.type === "dragend") {
        dropTarget?.classList.remove("is-drop-target");
        dropTarget = null;
        return true;
      }
      if (!pin || !Array.from(event.dataTransfer?.types || []).includes(wireMime)) return false;
      if (event.type === "dragover") {
        event.preventDefault();
        if (dropTarget !== pin) dropTarget?.classList.remove("is-drop-target");
        dropTarget = pin;
        pin.classList.add("is-drop-target");
        return true;
      }
      if (event.type === "dragleave") {
        pin.classList.remove("is-drop-target");
        return true;
      }
      if (event.type === "drop") {
        event.preventDefault();
        dropTarget?.classList.remove("is-drop-target");
        dropTarget = null;
        let payload;
        try {
          const raw = event.dataTransfer.getData(wireMime);
          if (raw.length > 300) return true;
          payload = JSON.parse(raw);
        } catch {
          return true;
        }
        const placed = engine.placeWire(cables, payload, end, Number(pin.dataset.labPin));
        if (placed.changed) {
          cables = placed.cables;
          resultsStale = Boolean(results);
          message = `${end.toUpperCase()} ${Number(pin.dataset.labPin) + 1}번 핀에 ${payload.color} 배치`;
          render();
        }
        return true;
      }
      return false;
    }
    return { render, handleClick, handleSubmit, handleChange, handleDrag };
  }
  root.PracticalLabPage = { create };
})(typeof window !== "undefined" ? window : globalThis);
