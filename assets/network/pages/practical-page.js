/* 실기 입문 화면: 날짜별 로드맵·자체 예제·입력 순서 연습.
   PracticalStudy는 원본, getState/persist는 저장 소유자입니다. OS/장비/외부 프로그램을 실행하지 않습니다. */
(function (root) {
  "use strict";
  function create({ data, main, getState, persist, esc, C, enabled = true }) {
    let currentTask = null,
      index = 0,
      passed = new Set();
    const progress = () => data.clean(getState().practicalStudy);
    const link = (source) =>
      `<a class="text-button" href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.title)} ↗</a>`;
    function landing() {
      currentTask = null;
      if (!enabled) {
        main.innerHTML =
          '<section class="panel"><h1>네트워크관리사 2급 실기 준비</h1><p>시험 선택에서 네트워크관리사 2급을 선택해 주세요.</p><a href="#exams">시험 선택 →</a></section>';
        return;
      }
      const saved = progress(),
        days = C.daysUntil(saved.examDate);
      main.innerHTML = `<div class="page-heading"><div><h1>네트워크관리사 2급 실기 준비</h1><p>어떤 프로그램인지부터, 한 단계씩 직접 따라가요.</p></div><span class="quiz-status">${days > 0 ? `D−${days}` : days === 0 ? "시험 당일" : "일정 다시 확인"}</span></div><section class="panel"><span class="label-tag">직접 조작하기</span><h2>가상 실기 실험실</h2><p>Windows 설정창·라우터 콘솔·케이블 작업대를 직접 조작하고 실습 테스트로 확인해요.</p><a href="#lab" class="button primary">가상 실험실 열기 →</a></section><section class="panel practical-intro"><span class="label-tag">처음이라면 여기부터</span><h2>마우스 설정과 라우터 명령을 나누어 연습해요</h2><p><strong>Windows 설정은 실습용 에뮬레이터</strong>, <strong>라우터 명령은 Router Emulator</strong>에서 연습합니다. 케이블은 실제 도구로 손에 익혀야 해요.</p><p>아래는 자체 제작한 따라하기입니다. 실제 시험 화면·전체 에뮬레이터·공식 기출이 아닙니다. 이 페이지에서 PC 설정은 바뀌지 않아요.</p><div class="score-actions">${link(data.sources.gui)}${link(data.sources.router)}</div><p class="fine-print">공식 안내는 Windows Server 2022 출제기준과 기존 실기 에뮬레이터 방식 유지를 설명합니다. 실제 문제·메뉴·저장 지시를 우선하세요. ${link(data.sources.standard)}</p></section><section class="panel"><div class="section-heading"><h2>실기까지의 로드맵</h2><span>${saved.completed.length} / ${data.tasks.length} 예제 자가체크</span></div><form id="practical-date-form" class="practical-date"><label for="practical-date">내 실기 응시일<input id="practical-date" type="date" required value="${esc(saved.examDate)}"></label><button class="button secondary" type="submit">일정 저장</button></form><p class="fine-print">사용자가 알려 준 응시일 기준입니다. 공식 정기시험 일정이라고 표시하지 않습니다. 날짜를 바꿔도 아래 기본 학습 구간은 유지돼요.</p><div class="practical-roadmap">${data.roadmap
        .map(
          (phase) =>
            `<article class="practical-phase ${C.localDate() >= phase.from && C.localDate() <= phase.to ? "is-current" : ""}"><small>${phase.from.slice(5)} ~ ${phase.to.slice(5)}</small><h3>${esc(phase.title)}</h3><p>${esc(phase.goal)}</p><div>${phase.taskIds
              .slice(0, 3)
              .map(
                (id) =>
                  `<button type="button" class="text-button" data-practical-task="${id}">${esc(data.tasks.find((t) => t.id === id).title)} →</button>`,
              )
              .join("")}</div></article>`,
        )
        .join(
          "",
        )}</div></section><div class="section-heading"><h2>따라하기 예제</h2><span>하루 한두 개씩 반복</span></div><div class="practical-tasks">${data.tasks.map((task) => `<article class="panel"><span class="label-tag">${task.kind === "cli" ? "명령 직접 입력" : task.kind === "fields" ? "설정 칸 직접 입력" : "그림·순서 안내"} · 약 ${task.minutes}분</span><h3>${esc(task.title)}</h3><p>${esc(task.goal)}</p><p class="fine-print">${saved.completed.includes(task.id) ? "✓ 예제 복습 완료 · 실제 도구에서 다시 연습해요" : "미완료 · 화면 안내부터 시작해요"}</p><button type="button" class="button ${saved.completed.includes(task.id) ? "secondary" : "primary"}" data-practical-task="${task.id}">따라하기 ${saved.completed.includes(task.id) ? "다시 시작" : "시작"} →</button></article>`).join("")}</div><section class="panel"><h2>매일 60분이라면</h2><p>10분: 어제 막힌 순서 → 30분: 실제 도구로 오늘 예제 → 10분: 화면을 덮고 재현 → 10분: 케이블·단답·서브넷.</p><p>마지막 주에는 공식 도구로 80분 시간을 재고 연습하세요. 이 사이트의 완료 표시는 실기 점수나 합격 예상치가 아닙니다. 계정·서비스·보안 설정 등 여기에 없는 항목도 공식 연습 자료로 보충해야 합니다.</p><a class="text-button" href="#theory/10">기존 실기 명령·체크리스트 보기 →</a> ${link(data.sources.exam)}</section>`;
    }
    function cableDiagram() {
      const pins = [
        ["흰/주", "#ef9c49"],
        ["주", "#ee8a24"],
        ["흰/초", "#76a94d"],
        ["파", "#478ad1"],
        ["흰/파", "#478ad1"],
        ["초", "#76a94d"],
        ["흰/갈", "#966c4b"],
        ["갈", "#966c4b"],
      ];
      return `<figure class="practical-cable"><figcaption>T568B · 왼쪽 1 → 오른쪽 8 · 방향을 먼저 확인</figcaption><div class="practical-pins">${pins.map(([name, color], pin) => `<div><b>${pin + 1}</b><i style="background:${name.startsWith("흰") ? `linear-gradient(90deg,#fff 50%,${color} 50%)` : color}"></i><small>${name}</small></div>`).join("")}</div><p>흰주 · 주 · 흰초 · 파 · 흰파 · 초 · 흰갈 · 갈</p></figure>`;
    }
    function renderStep() {
      const task = currentTask,
        step = task.steps[index],
        needsCheck = Boolean(step.command || step.fields),
        ready = !needsCheck || passed.has(index);
      const stepsOverview = `<ol class="practical-step-map" aria-label="따라하기 전체 순서">${task.steps.map((item, position) => `<li ${position === index ? 'aria-current="step"' : ""} class="${position < index ? "is-earlier" : ""}"><span>${position + 1}</span>${esc(item.title)}</li>`).join("")}</ol>`;
      main.innerHTML = `<div class="page-heading"><div><h1>${esc(task.title)}</h1><p>${esc(task.goal)}</p></div><span class="quiz-status">${index + 1} / ${task.steps.length}단계</span></div>${stepsOverview}<section class="question-box practical-step"><span class="label-tag">사이트 안의 자체 따라하기 · 실제 설정 실행 아님</span><h2>${index + 1}. ${esc(step.title)}</h2><p>${esc(step.action)}</p>${step.why ? `<div class="practical-meaning"><h3>왜 이걸 하나요?</h3><p>${esc(step.why)}</p><p class="fine-print">${esc(step.term)}</p></div>` : ""}${step.command ? `<div class="practical-terminal"><div>이번에 입력할 명령 · 화면 예시</div><pre>${esc(step.prompt)} <strong>${esc(step.command)}</strong></pre>${step.after ? `<div class="practical-output-label">입력 뒤 보이는 모습 · 예시</div><pre class="practical-output">${esc(step.after)}</pre>` : ""}</div>${step.notice ? `<p class="practical-observe"><strong>여기를 보세요</strong> ${esc(step.notice)}</p>` : ""}<form id="practical-command-form"><label for="practical-command">연습 입력 · 프롬프트를 빼고 명령만 적으세요</label><input id="practical-command" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="180" placeholder="위 명령을 직접 입력" required><button class="button secondary" type="submit">명령 확인</button></form>` : ""}${step.fields ? `<form id="practical-fields-form" class="practical-window"><div class="practical-window-title">인터넷 프로토콜 버전 4 속성 · 학습용 모형</div><p>다음 IP 주소 및 DNS 서버 주소 사용</p>${step.fields.map((field, i) => `<label for="practical-field-${i}">${esc(field.label)}<input id="practical-field-${i}" type="text" inputmode="decimal" autocomplete="off" required maxlength="30" placeholder="${esc(field.label)}"></label>`).join("")}<button type="submit" class="button secondary">예제 값 확인</button></form>` : ""}${step.cable ? cableDiagram() : ""}<p id="practical-feedback" class="practical-feedback" role="status">${passed.has(index) ? "✓ 이 단계의 예제 입력을 확인했어요." : ""}</p><aside class="practical-check"><strong>다음으로 가기 전 확인</strong><p>${esc(step.check)}</p></aside><div class="quiz-controls"><button type="button" class="button secondary" data-practical-step="${index - 1}" ${index === 0 ? "disabled" : ""}>← 이전</button>${index < task.steps.length - 1 ? `<button type="button" class="button primary" id="practical-next" data-practical-step="${index + 1}" ${ready ? "" : "disabled"}>다음 단계 →</button>` : `<button type="button" class="button primary" id="practical-complete" ${ready ? "" : "disabled"}>예제 복습 완료 ✓</button>`}</div>${step.command ? '<p class="fine-print">출력은 설명용 예시이며 이 입력칸은 명령 확인용입니다. <a href="#lab">실험실 콘솔에서 직접 실행하기 →</a></p>' : ""}<p class="fine-print">완료는 자가체크예요. 실제 공식 도구에서 같은 순서를 한 번 더 해 보세요.</p><button type="button" class="text-button" data-practical-home>로드맵으로</button><div>${link(data.sources[task.source])}${task.kind === "cli" ? link(data.sources.ios) : ""}</div></section>`;
    }
    function handleClick(target) {
      if (!enabled) return false;
      if (target.dataset.practicalTask) {
        currentTask = data.tasks.find((t) => t.id === target.dataset.practicalTask);
        if (currentTask) {
          index = 0;
          passed = new Set();
          renderStep();
          root.PageUI?.focusQuestion?.(main);
        }
        return true;
      }
      if (target.hasAttribute?.("data-practical-home")) {
        landing();
        return true;
      }
      if (target.dataset.practicalStep !== undefined && currentTask) {
        const next = Number(target.dataset.practicalStep),
          step = currentTask.steps[index];
        if (
          Number.isInteger(next) &&
          next >= 0 &&
          next < currentTask.steps.length &&
          next <= index + 1 &&
          (next <= index || (!step.command && !step.fields) || passed.has(index))
        ) {
          index = next;
          renderStep();
          root.PageUI?.focusQuestion?.(main);
        }
        return true;
      }
      if (target.id === "practical-complete" && currentTask) {
        const step = currentTask.steps[index];
        if (
          index !== currentTask.steps.length - 1 ||
          ((step.command || step.fields) && !passed.has(index))
        )
          return true;
        const value = progress();
        value.completed = [...new Set([...value.completed, currentTask.id])];
        getState().practicalStudy = value;
        persist();
        landing();
        return true;
      }
      return false;
    }
    function handleSubmit(event) {
      if (!enabled) return false;
      const id = event.target.id;
      if (id === "practical-date-form") {
        event.preventDefault();
        const value = main.querySelector("#practical-date").value;
        if (C.validDate(value)) {
          getState().practicalStudy = { ...progress(), examDate: value };
          persist();
          landing();
        }
        return true;
      }
      if (!currentTask || !["practical-command-form", "practical-fields-form"].includes(id))
        return false;
      event.preventDefault();
      const step = currentTask.steps[index];
      const correct =
        id === "practical-command-form"
          ? data.commandMatches(main.querySelector("#practical-command").value, step)
          : step.fields.every(
              (field, i) =>
                main.querySelector(`#practical-field-${i}`).value.trim() === field.value,
            );
      main.querySelector("#practical-feedback").textContent = correct
        ? "✓ 이 단계의 예제 입력을 확인했어요. 다음으로 넘어가세요."
        : "다시 확인해요. 위 예제와 입력 순서·숫자를 비교해 보세요.";
      if (correct) {
        passed.add(index);
        const next = main.querySelector("#practical-next, #practical-complete");
        next.disabled = false;
        next.focus({ preventScroll: true });
      }
      return true;
    }
    return { render: landing, handleClick, handleSubmit };
  }
  root.PracticalPage = { create };
})(typeof window !== "undefined" ? window : globalThis);
