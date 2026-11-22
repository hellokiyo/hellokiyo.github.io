/* Windows 네트워크 설정을 닮은 학습용 창. 실제 Windows API를 호출하지 않습니다.
   connections→adapter→IPv4의 편집 초안과 적용된 설정을 분리해 취소 동작을 보존합니다. */
(function (root) {
  "use strict";
  function create({ esc, engine, onApply }) {
    const fields = [
      ["ip", "IP 주소"],
      ["mask", "서브넷 마스크"],
      ["gateway", "기본 게이트웨이"],
      ["dns", "기본 설정 DNS 서버"],
    ];
    const defaults = () => ({
      ip: "",
      mask: "",
      gateway: "",
      dns: "",
      ipMode: "auto",
      dnsMode: "auto",
    });
    let stage = "connections",
      applied = defaults(),
      pending = defaults(),
      draft = defaults(),
      selected = "ipv4";
    function reset() {
      stage = "connections";
      applied = defaults();
      pending = defaults();
      draft = defaults();
      selected = "ipv4";
    }
    function addressField(id, label) {
      const values = (draft[id] || "").split("."),
        disabled = (id === "dns" ? draft.dnsMode : draft.ipMode) === "auto";
      return `<div class="win-address-row"><span>${label}:</span><div class="win-address" role="group" aria-label="${label}">${Array.from({ length: 4 }, (_, index) => `${index ? '<span aria-hidden="true">.</span>' : ""}<input id="lab-${id}-${index}" data-win-field="${id}" data-win-octet="${index}" aria-label="${label} ${index + 1}번째 옥텟" inputmode="numeric" autocomplete="off" maxlength="3" value="${esc(values[index] || "")}" ${disabled ? "disabled" : ""}>`).join("")}</div></div>`;
    }
    function title(text, closeAction) {
      return `<header class="win-title"><span>▣ ${text}</span><button type="button" data-win-action="${closeAction}" aria-label="${text} 닫기">×</button></header>`;
    }
    function render() {
      if (stage === "connections")
        return `<div class="win-workspace"><div class="win-explorer-bar">제어판 › 네트워크 및 인터넷 › 네트워크 연결</div><h3>네트워크 연결</h3><button type="button" class="win-adapter-tile" data-win-action="properties"><span class="win-network-icon" aria-hidden="true">▣</span><span><strong>이더넷</strong><small>학습 네트워크<br>가상 Ethernet 어댑터</small></span></button><div class="win-actions"><button type="button" data-win-action="properties">이 연결의 속성 보기</button></div><p class="fine-print">① 이더넷 선택 → ② 속성 → ③ IPv4 → 속성. 학습용 화면이며 실제 제어판이 아닙니다.</p></div>`;
      if (stage === "adapter")
        return `<section class="win-dialog" aria-label="이더넷 속성">${title("이더넷 속성", "cancel")}<div class="win-tabs"><span class="is-active">네트워킹</span></div><div class="win-dialog-body"><p>연결에 사용할 장치:</p><div class="win-device">가상 Ethernet 어댑터</div><p>이 연결에 다음 항목 사용:</p><div class="win-components">${[
          ["client", "Microsoft 네트워크용 클라이언트"],
          ["sharing", "Microsoft 네트워크용 파일 및 프린터 공유"],
          ["qos", "QoS 패킷 스케줄러"],
          ["ipv4", "인터넷 프로토콜 버전 4(TCP/IPv4)"],
          ["ipv6", "인터넷 프로토콜 버전 6(TCP/IPv6)"],
        ]
          .map(
            ([id, label]) =>
              `<button type="button" class="${selected === id ? "is-selected" : ""}" data-win-component="${id}" aria-pressed="${selected === id}"><span aria-hidden="true">☑</span> ${label}</button>`,
          )
          .join(
            "",
          )}</div><div class="win-actions"><button type="button" data-win-action="ipv4">속성(R)...</button></div><p class="fine-print">이번 모형은 TCP/IPv4 속성만 편집합니다. 나머지 구성 요소의 설정은 재현하지 않습니다.</p></div><footer class="win-actions"><button type="button" data-win-action="commit-close">확인</button><button type="button" data-win-action="cancel">취소</button><button type="button" data-win-action="apply">적용(A)</button></footer></section>`;
      return `<section class="win-dialog" aria-label="IPv4 속성">${title("인터넷 프로토콜 버전 4(TCP/IPv4) 속성", "cancel-ipv4")}<div class="win-tabs"><span class="is-active">일반</span></div><form id="lab-windows-form" novalidate><div class="win-dialog-body"><p>IP 주소를 자동으로 할당받거나 네트워크 관리자에게 받은 주소를 직접 입력할 수 있습니다.</p><label class="win-radio"><input type="radio" name="win-ip-mode" value="auto" ${draft.ipMode === "auto" ? "checked" : ""}>자동으로 IP 주소 받기(O)</label><label class="win-radio"><input id="win-ip-manual" type="radio" name="win-ip-mode" value="manual" ${draft.ipMode === "manual" ? "checked" : ""}>다음 IP 주소 사용(S)</label><fieldset class="win-address-fields" ${draft.ipMode === "auto" ? "disabled" : ""}>${fields
        .slice(0, 3)
        .map(([id, label]) => addressField(id, label))
        .join(
          "",
        )}</fieldset><label class="win-radio"><input type="radio" name="win-dns-mode" value="auto" ${draft.dnsMode === "auto" ? "checked" : ""}>자동으로 DNS 서버 주소 받기(B)</label><label class="win-radio"><input id="win-dns-manual" type="radio" name="win-dns-mode" value="manual" ${draft.dnsMode === "manual" ? "checked" : ""}>다음 DNS 서버 주소 사용(E)</label><fieldset class="win-address-fields" ${draft.dnsMode === "auto" ? "disabled" : ""}>${addressField("dns", "기본 설정 DNS 서버")}</fieldset><p id="win-error" role="alert"></p><p class="fine-print">실제 Windows의 대체 DNS·고급 옵션은 이번 모형에서 다루지 않습니다.</p></div><footer class="win-actions"><button type="submit">확인</button><button type="button" data-win-action="cancel-ipv4">취소</button></footer></form></section>`;
    }
    function read(main) {
      const value = { ...draft };
      for (const [id] of fields) {
        const parts = Array.from({ length: 4 }, (_, index) =>
          main.querySelector(`#lab-${id}-${index}`).value.trim(),
        );
        value[id] = parts.every((part) => !part) ? "" : parts.join(".");
      }
      value.ipMode = main.querySelector("#win-ip-manual").checked ? "manual" : "auto";
      value.dnsMode = main.querySelector("#win-dns-manual").checked ? "manual" : "auto";
      return value;
    }
    function handleClick(target) {
      if (target.dataset.winComponent) {
        selected = target.dataset.winComponent;
        return true;
      }
      const action = target.dataset.winAction;
      if (!action) return false;
      if (action === "properties") {
        stage = "adapter";
        pending = { ...applied };
        selected = "ipv4";
      } else if (action === "ipv4") {
        if (selected !== "ipv4") return true;
        draft = { ...pending };
        stage = "ipv4";
      } else if (action === "cancel-ipv4") {
        draft = { ...pending };
        stage = "adapter";
      } else if (action === "cancel") {
        pending = { ...applied };
        draft = { ...applied };
        stage = "connections";
      } else if (action === "apply" || action === "commit-close") {
        applied = { ...pending };
        onApply({ ...applied });
        if (action === "commit-close") stage = "connections";
      } else return false;
      return true;
    }
    function handleChange(event, main) {
      if (stage !== "ipv4" || !["win-ip-mode", "win-dns-mode"].includes(event.target.name))
        return false;
      draft = read(main);
      return true;
    }
    function handleSubmit(event, main) {
      if (stage !== "ipv4" || event.target.id !== "lab-windows-form") return null;
      event.preventDefault();
      const value = read(main);
      const valid =
        (value.ipMode === "auto" ||
          (engine.validIp(value.ip) &&
            engine.validMask(value.mask) &&
            (!value.gateway || engine.validIp(value.gateway)))) &&
        (value.dnsMode === "auto" || !value.dns || engine.validIp(value.dns));
      if (!valid) {
        main.querySelector("#win-error").textContent =
          "IP 주소 또는 서브넷 마스크가 올바르지 않습니다. 각 옥텟(0~255)과 마스크를 확인하세요.";
        return "error";
      }
      pending = value;
      draft = { ...value };
      stage = "adapter";
      return "render";
    }
    return { render, reset, handleClick, handleChange, handleSubmit };
  }
  root.LabWindows = { create };
  if (typeof module !== "undefined" && module.exports) module.exports = root.LabWindows;
})(typeof window !== "undefined" ? window : globalThis);
