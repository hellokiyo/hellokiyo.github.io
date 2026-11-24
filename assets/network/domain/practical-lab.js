/* 브라우저 실습 장비의 순수 상태 전이·과제 검사. OS/셸/네트워크를 실행하지 않습니다.
   Cisco 전체 문법이 아닌 아래 학습용 부분집합만 처리합니다. 저장은 가상 startup 구성입니다. */
(function (root) {
  "use strict";
  const empty = () => ({
    hostname: "Router",
    interfaces: {
      "FastEthernet0/0": { ip: "", mask: "", enabled: false },
      "FastEthernet0/1": { ip: "", mask: "", enabled: false },
      "Serial2/0": { ip: "", mask: "", enabled: false },
    },
    routes: [],
  });
  const copy = (value) => JSON.parse(JSON.stringify(value));
  function initial() {
    return { mode: "user", selected: null, running: empty(), startup: null, pending: null };
  }
  function validIp(value) {
    return (
      /^\d{1,3}(\.\d{1,3}){3}$/.test(value) && value.split(".").every((part) => Number(part) <= 255)
    );
  }
  function validMask(value) {
    if (!validIp(value)) return false;
    const bits = value
      .split(".")
      .map((part) => Number(part).toString(2).padStart(8, "0"))
      .join("");
    return /^1*0*$/.test(bits);
  }
  function ipNumber(value) {
    return value.split(".").reduce((number, part) => number * 256 + Number(part), 0) >>> 0;
  }
  function subnetInfo(ip, mask) {
    if (!validIp(ip) || !validMask(mask)) return null;
    const address = ipNumber(ip),
      bits = ipNumber(mask),
      network = (address & bits) >>> 0;
    const broadcast = (network | ~bits) >>> 0;
    return { address, network, broadcast, prefix: bits.toString(2).replace(/0/g, "").length };
  }
  // 이 모형은 일반 Ethernet 호스트(/1~30)를 연습합니다. /31 P2P·/32는 별도 범위입니다.
  function addressIssue(ip, mask) {
    const subnet = subnetInfo(ip, mask);
    if (!subnet) return "format";
    if (subnet.prefix < 1 || subnet.prefix > 30) return "unsupported-prefix";
    const first = Number(ip.split(".")[0]);
    if (first === 0 || first === 127 || first >= 224) return "scope";
    return subnet.address === subnet.network || subnet.address === subnet.broadcast ? "host" : null;
  }
  function prompt(state) {
    if (state.pending) return "[startup-config]";
    return (
      state.running.hostname +
      (state.mode === "user"
        ? ">"
        : state.mode === "config"
          ? "(config)#"
          : state.mode === "dhcp"
            ? "(dhcp-config)#"
            : state.mode === "line"
              ? "(config-line)#"
              : state.mode === "interface"
                ? "(config-if)#"
                : "#")
    );
  }
  function grammar(mode) {
    const show = [
      ["show", "ip", "interface", "brief"],
      ["show", "ip", "route"],
      ["show", "interfaces"],
    ];
    const exec = [...show, ["enable"], ["exit"], ["disable"]];
    if (mode === "user") return exec;
    if (mode === "privileged")
      return [
        ...exec,
        ["configure", "terminal"],
        ["show", "users"],
        ["show", "running-config"],
        ["show", "startup-config"],
        ["copy", "running-config", "startup-config"],
        ["write", "memory"],
        ["reload"],
      ];
    if (mode === "config")
      return [
        ["interface", "<interface>"],
        ["line", "vty", "<start>", "<end>"],
        ["hostname", "<name>"],
        ["ip", "dhcp", "pool", "<name>"],
        ["no", "ip", "dhcp", "pool", "<name>"],
        ["ip", "route", "<network>", "<mask>", "<next-hop>"],
        ["no", "ip", "route", "<network>", "<mask>", "<next-hop>"],
        ["end"],
        ["exit"],
      ];
    if (mode === "line")
      return [["password", "<value>"], ["login"], ["no", "login"], ["end"], ["exit"]];
    if (mode === "dhcp")
      return [
        ["network", "<network>", "<mask>"],
        ["default-router", "<address>"],
        ["dns-server", "<address>"],
        ["end"],
        ["exit"],
      ];
    return [
      ["ip", "address", "<address>", "<mask>"],
      ["ip", "address", "<address>", "<mask>", "secondary"],
      ["no", "ip", "address"],
      ["shutdown"],
      ["no", "shutdown"],
      ["description", "<text...>"],
      ["no", "description"],
      ["end"],
      ["exit"],
    ];
  }
  const argument = (value) => value?.startsWith("<");
  function parseCommand(command, mode) {
    const words = command.split(" ");
    if (mode === "privileged" && command.toLowerCase() === "wr") return { command: "write memory" };
    let candidates = grammar(mode),
      canonical = [];
    for (let index = 0; index < words.length; index++) {
      const word = words[index].toLowerCase();
      candidates = candidates.filter(
        (rule) => argument(rule[index]) || rule[index]?.startsWith(word),
      );
      if (!candidates.length)
        return {
          errorKind: "invalid",
          position: words.slice(0, index).join(" ").length + (index ? 1 : 0),
        };
      const exact = candidates.filter((rule) => !argument(rule[index]) && rule[index] === word);
      if (exact.length) candidates = exact;
      const literals = [
        ...new Set(candidates.map((rule) => rule[index]).filter((value) => !argument(value))),
      ];
      if (literals.length > 1) return { errorKind: "ambiguous" };
      const token = candidates[0][index];
      if (token === "<text...>") {
        canonical.push(words.slice(index).join(" "));
        return { command: canonical.join(" ") };
      }
      canonical.push(argument(token) ? words[index] : token);
    }
    return candidates.some((rule) => rule.length === words.length)
      ? { command: canonical.join(" ") }
      : { errorKind: "incomplete" };
  }
  function commandHelp(command, mode) {
    const stem = command.slice(0, -1),
      words = stem.trim() ? stem.trim().toLowerCase().split(/\s+/) : [];
    const next = /\s$/.test(stem) || !words.length,
      position = next ? words.length : words.length - 1;
    const options = grammar(mode)
      .filter((rule) =>
        words
          .slice(0, position)
          .every((word, index) => argument(rule[index]) || rule[index]?.startsWith(word)),
      )
      .map((rule) => rule[position] || "<cr>")
      .filter((word) => next || argument(word) || word.startsWith(words.at(-1)));
    return [...new Set(options)].join("\n") || "% No matching command in this mode.";
  }
  function run(source, input) {
    const state = copy(source),
      raw = String(input).trim().replace(/\s+/g, " ");
    const done = (output = "", errorKind = null) => ({ state, output, errorKind });
    if (input === "\u0003") {
      state.pending = null;
      return done("^C");
    }
    if (state.pending) {
      if (!raw || raw === "startup-config") {
        state.startup = copy(state.running);
        state.pending = null;
        return done("Building configuration...\n[OK]");
      }
      state.pending = null;
      return done("% This model stores only startup-config. Copy cancelled.", "unsupported");
    }
    if (!raw) return done();
    if (raw.endsWith("?") || raw.toLowerCase() === "help")
      return done(commandHelp(raw.toLowerCase() === "help" ? "?" : raw, state.mode));
    if (/^(ping|traceroute|router|access-list|vlan|crypto|debug)(\s|$)/i.test(raw))
      return done(
        "[시뮬레이터 미구현] 이 명령의 장비 동작은 재현하지 않습니다. 실제 IOS의 오답이라는 뜻은 아닙니다.",
        "unsupported",
      );
    if (/^do\s/i.test(raw) && ["config", "interface", "line", "dhcp"].includes(state.mode)) {
      const result = run({ ...state, mode: "privileged" }, raw.slice(3));
      result.state.mode = state.mode;
      result.state.selected = state.selected;
      return result;
    }
    const parsed = parseCommand(raw, state.mode);
    if (parsed.errorKind) {
      if (parsed.errorKind === "incomplete") return done("% Incomplete command.", "incomplete");
      if (parsed.errorKind === "ambiguous")
        return done(`% Ambiguous command: "${raw}"`, "ambiguous");
      return done(
        " ".repeat(prompt(source).length + 1 + parsed.position) +
          "^\n% Invalid input detected at '^' marker.",
        "invalid",
      );
    }
    const command = parsed.command,
      lower = command.toLowerCase();
    if (lower === "enable") {
      state.mode = "privileged";
      return done();
    }
    if (lower === "configure terminal") {
      state.mode = "config";
      return done("Enter configuration commands, one per line. End with CNTL/Z.");
    }
    if (lower === "end") {
      state.mode = "privileged";
      state.selected = null;
      state.selectedLine = null;
      state.selectedPool = null;
      return done();
    }
    if (lower === "disable") {
      state.mode = "user";
      return done();
    }
    if (lower === "exit") {
      state.mode = ["interface", "line", "dhcp"].includes(state.mode)
        ? "config"
        : state.mode === "config"
          ? "privileged"
          : "user";
      state.selected = null;
      state.selectedLine = null;
      state.selectedPool = null;
      return done();
    }
    if (lower === "reload") {
      state.running = state.startup ? copy(state.startup) : empty();
      state.mode = "user";
      state.selected = null;
      return done("가상 장비를 재시작했습니다. 저장하지 않은 설정은 사라집니다.");
    }
    if (lower === "copy running-config startup-config") {
      state.pending = { kind: "copy" };
      return done("Destination filename [startup-config]?");
    }
    if (lower === "write memory") {
      state.startup = copy(state.running);
      return done("Building configuration...\n[OK]");
    }
    const configText = (value) =>
      `hostname ${value.hostname}\n` +
      Object.entries(value.interfaces)
        .map(
          ([name, value]) =>
            `interface ${name}\n ${value.description ? `description ${value.description}\n ` : ""}${value.ip ? `ip address ${value.ip} ${value.mask}` : "no ip address"}\n ${value.enabled ? "no shutdown" : "shutdown"}${(value.secondary || []).map((item) => `\n ip address ${item.ip} ${item.mask} secondary`).join("")}`,
        )
        .join("\n") +
      "\n" +
      value.routes
        .map((route) => `ip route ${route.network} ${route.mask} ${route.nextHop}`)
        .join("\n") +
      Object.entries(value.lines || {})
        .map(
          ([range, line]) =>
            `\nline vty ${range}\n${line.password ? " password [학습 입력값 숨김]" : " no password"}\n ${line.login ? "login" : "no login"}`,
        )
        .join("") +
      Object.entries(value.dhcpPools || {})
        .map(
          ([name, pool]) =>
            `\nip dhcp pool ${name}${pool.network ? `\n network ${pool.network} ${pool.mask}` : ""}${pool.router ? `\n default-router ${pool.router}` : ""}${pool.dns ? `\n dns-server ${pool.dns}` : ""}`,
        )
        .join("");
    if (lower === "show users")
      return done(
        "Line       User       Host(s)       Idle       Location\n* 0 con 0             idle          00:00:00\n[학습 모형: 현재 콘솔만 표시하며 실제 원격 접속은 없습니다.]",
      );
    if (lower === "show running-config") return done(configText(state.running));
    if (lower === "show startup-config")
      return done(state.startup ? configText(state.startup) : "startup-config is not present");
    if (lower === "show ip interface brief" || lower === "show interfaces")
      return done(
        "Interface              IP-Address        Status (학습 모형)\n" +
          Object.entries(state.running.interfaces)
            .map(
              ([name, value]) =>
                `${name}  ${value.ip || "unassigned"}  ${value.enabled ? "enabled (물리 링크 미구현)" : "administratively down"}`,
            )
            .join("\n"),
      );
    if (lower === "show ip route")
      return done(
        state.running.routes.length
          ? state.running.routes
              .map(
                (route) =>
                  `S ${route.network} mask ${route.mask} via ${route.nextHop} (가상 설정 목록)`,
              )
              .join("\n")
          : "등록된 정적 경로가 없습니다. 실제 도달 가능성/라우팅 프로토콜은 시뮬레이션하지 않습니다.",
      );
    // DHCP는 설정 상태만 보관합니다. 주소를 임대하거나 실제 패킷을 보내지 않습니다.
    const poolCommand = command.match(/^(no )?ip dhcp pool (\S+)$/i);
    if (poolCommand) {
      const name = poolCommand[2];
      state.running.dhcpPools ||= {};
      if (poolCommand[1]) {
        delete state.running.dhcpPools[name];
      } else {
        state.running.dhcpPools[name] ||= { network: "", mask: "", router: "", dns: "" };
        state.selectedPool = name;
        state.mode = "dhcp";
      }
      return done();
    }
    if (state.mode === "dhcp" && state.selectedPool) {
      const pool = state.running.dhcpPools[state.selectedPool];
      const networkCommand = command.match(/^network (\S+) (\S+)$/i);
      if (networkCommand) {
        const subnet = subnetInfo(networkCommand[1], networkCommand[2]);
        if (!subnet || subnet.address !== subnet.network)
          return done("% Inconsistent network address and mask.", "invalid-value");
        if (subnet.prefix < 1 || subnet.prefix > 30)
          return done("[시뮬레이터 범위] DHCP 예제는 /1~30만 다룹니다.", "unsupported");
        pool.network = networkCommand[1];
        pool.mask = networkCommand[2];
        return done();
      }
      const option = command.match(/^(default-router|dns-server) (\S+)$/i);
      if (option) {
        if (!validIp(option[2])) return done("% Invalid IPv4 address.", "invalid-value");
        pool[option[1].toLowerCase() === "default-router" ? "router" : "dns"] = option[2];
        return done();
      }
    }
    const line = command.match(/^line vty (\d+) (\d+)$/i);
    if (line) {
      const first = Number(line[1]),
        last = Number(line[2]);
      if (first > last || first < 0 || last > 15)
        return done("% Invalid VTY range.", "invalid-value");
      state.running.lines ||= {};
      state.selectedLine = `${first} ${last}`;
      state.running.lines[state.selectedLine] ||= { password: "", login: false };
      state.mode = "line";
      return done();
    }
    if (state.mode === "line" && state.selectedLine) {
      const value = state.running.lines[state.selectedLine];
      if (lower.startsWith("password ")) {
        value.password = command.slice(9);
        return done();
      }
      if (["login", "no login"].includes(lower)) {
        value.login = lower === "login";
        return done();
      }
    }
    const int = command.match(/^interface (.+)$/i);
    if (int) {
      const name = int[1].match(/^(?:fastethernet|fa|f)(0\/[01])$/i);
      const serial = /^(?:serial|s)2\/0$/i.test(int[1]);
      if (!name && !serial)
        return done("% Invalid interface type and number for this model.", "invalid-value");
      state.selected = serial ? "Serial2/0" : "FastEthernet" + name[1];
      state.mode = "interface";
      return done();
    }
    const hostname = command.match(/^hostname (.+)$/i);
    if (hostname) {
      if (!/^[a-zA-Z][a-zA-Z0-9-]{0,30}$/.test(hostname[1]))
        return done("% Invalid hostname.", "invalid-value");
      state.running.hostname = hostname[1];
      return done();
    }
    const route = command.match(/^(no )?ip route (\S+) (\S+) (\S+)$/i);
    if (route) {
      if (!validIp(route[2]) || !validMask(route[3]) || !validIp(route[4]))
        return done("% Invalid IPv4 address or mask.", "invalid-value");
      const number = (ip) =>
        ip.split(".").reduce((result, octet) => (result * 256 + Number(octet)) >>> 0, 0);
      if ((number(route[2]) & number(route[3])) >>> 0 !== number(route[2]))
        return done("% Inconsistent address and mask.", "invalid-value");
      state.running.routes = state.running.routes.filter(
        (item) => item.network !== route[2] || item.mask !== route[3] || item.nextHop !== route[4],
      );
      if (!route[1])
        state.running.routes.push({ network: route[2], mask: route[3], nextHop: route[4] });
      return done();
    }
    if (state.mode === "interface" && state.selected) {
      const value = state.running.interfaces[state.selected],
        address = command.match(/^ip address (\S+) (\S+)( secondary)?$/i);
      if (address) {
        const issue = addressIssue(address[1], address[2]);
        if (issue === "unsupported-prefix")
          return done(
            "[시뮬레이터 범위] 이 Ethernet 예제는 /1~30만 다룹니다. /31 P2P·/32의 유효성을 오답으로 판정하지 않습니다.",
            "unsupported",
          );
        if (issue) return done("% Bad mask or invalid host IPv4 address.", "invalid-value");
        const next = subnetInfo(address[1], address[2]);
        const overlap = Object.entries(state.running.interfaces).some(([name, configured]) => {
          if (name === state.selected || !configured.ip) return false;
          return [
            { ip: configured.ip, mask: configured.mask },
            ...(configured.secondary || []),
          ].some((item) => {
            const existing = subnetInfo(item.ip, item.mask);
            return (
              existing && next.network <= existing.broadcast && existing.network <= next.broadcast
            );
          });
        });
        if (overlap) return done("% Address overlaps with another interface.", "invalid-value");
        if (address[3]) {
          if (!value.ip) return done("% Configure a primary address first.", "invalid-value");
          if (value.ip === address[1])
            return done("% Address is already primary.", "invalid-value");
          value.secondary = (value.secondary || []).filter((item) => item.ip !== address[1]);
          value.secondary.push({ ip: address[1], mask: address[2] });
        } else {
          value.ip = address[1];
          value.mask = address[2];
        }
        return done();
      }
      if (lower === "no ip address") {
        value.ip = "";
        value.mask = "";
        delete value.secondary;
        return done();
      }
      if (["no shutdown", "shutdown"].includes(lower)) {
        value.enabled = lower !== "shutdown";
        return done();
      }
      if (lower === "no description") {
        delete value.description;
        return done();
      }
      if (lower.startsWith("description ")) {
        value.description = command.slice(12);
        return done();
      }
    }
    return done("[시뮬레이터 미구현] 실제 IOS와 구별해 주세요.", "unsupported");
  }
  function sameConfig(left, right) {
    if (!left || !right) return false;
    const canonical = (value) =>
      JSON.stringify({
        hostname: value.hostname,
        interfaces: Object.entries(value.interfaces)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([name, port]) => [
            name,
            port.ip,
            port.mask,
            Boolean(port.enabled),
            port.description || "",
            (port.secondary || []).map((item) => item.ip + " " + item.mask).sort(),
          ]),
        lines: Object.entries(value.lines || {})
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([range, line]) => [range, line.password, line.login]),
        dhcpPools: Object.entries(value.dhcpPools || {})
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([name, pool]) => [name, pool.network, pool.mask, pool.router, pool.dns]),
        routes: value.routes
          .map((route) => [route.network, route.mask, route.nextHop].join(" "))
          .sort(),
      });
    return canonical(left) === canonical(right);
  }
  const colors = ["흰주", "주", "흰초", "파", "흰파", "초", "흰갈", "갈"];
  const colorsA = ["흰초", "초", "흰주", "파", "흰파", "주", "흰갈", "갈"];
  function cableCheck(cables, kind = "straight") {
    const same = (values, expected) => expected.every((color, index) => values?.[index] === color);
    if (kind === "cross")
      return (
        (same(cables.a, colorsA) && same(cables.b, colors)) ||
        (same(cables.a, colors) && same(cables.b, colorsA))
      );
    if (kind !== "straight") return false;
    return (
      (same(cables.a, colors) && same(cables.b, colors)) ||
      (same(cables.a, colorsA) && same(cables.b, colorsA))
    );
  }
  function inspect(router, windows, cables, cableKind = "straight") {
    const int = router.running.interfaces["FastEthernet0/0"];
    const observed = [
      `적용 IP ${windows.ip || "미설정"} / 마스크 ${windows.mask || "미설정"} / 게이트웨이 ${windows.gateway || "미설정"} / DNS ${windows.dns || "미설정"} · 자동 할당 여부와 부모 창 적용을 확인하세요.`,
      `현재 ${int.ip || "미설정"} / ${int.mask || "미설정"} · show ip interface brief로 포트와 주소를 확인하세요.`,
      `현재 ${int.enabled ? "활성화" : "관리상 비활성화"} · interface 모드에서 no shutdown 후 조회하세요.`,
      `등록 경로 ${router.running.routes.length}개 · show ip route로 목적지·마스크·다음 홉을 대조하세요.`,
      router.pending
        ? "저장 확인 대기 중입니다. Enter로 대상 파일명을 확인하세요."
        : router.startup
          ? "저장본과 현재 구성이 다릅니다. 마지막 수정 후 다시 저장하세요."
          : "저장본이 없습니다. privileged 모드에서 copy running-config startup-config를 입력하세요.",
      ["a", "b"]
        .map(
          (side) =>
            `${side.toUpperCase()} ${
              colors
                .map((color, index) => (cables[side]?.[index] === color ? null : index + 1))
                .filter(Boolean)
                .join(", ") || "없음"
            }번`,
        )
        .join(" / ") + " 핀을 다시 확인하세요. 금속 접점이 보이는 방향을 기준으로 비교합니다.",
    ];
    return [
      {
        label: "Windows: IP·마스크·게이트웨이·DNS를 적용",
        ok:
          windows.ipMode !== "auto" &&
          windows.dnsMode !== "auto" &&
          windows.ip === "192.168.10.10" &&
          windows.mask === "255.255.255.0" &&
          windows.gateway === "192.168.10.1" &&
          windows.dns === "192.168.10.2",
      },
      {
        label: "라우터: FastEthernet0/0에 192.168.10.1/24 설정",
        ok: int.ip === "192.168.10.1" && int.mask === "255.255.255.0",
      },
      { label: "라우터: 해당 포트 no shutdown", ok: int.enabled },
      {
        label: "라우터: 192.168.20.0/24 → 다음 홉 192.168.10.2",
        ok: router.running.routes.some(
          (item) =>
            item.network === "192.168.20.0" &&
            item.mask === "255.255.255.0" &&
            item.nextHop === "192.168.10.2",
        ),
      },
      {
        label: "라우터: 현재 구성을 startup-config에 저장",
        ok: sameConfig(router.startup, router.running),
      },
      {
        label:
          cableKind === "cross"
            ? "케이블: 양 끝을 T568A/T568B로 교차 배치"
            : "케이블: 양 끝을 같은 표준으로 직결 배치",
        ok: cableCheck(cables, cableKind),
      },
    ].map((result, index) => ({
      ...result,
      target: index === 0 ? "windows" : index === 5 ? "cable" : "router",
      detail: result.ok
        ? "예제 조건과 일치합니다."
        : index === 5
          ? (cableKind === "cross"
              ? "교차는 한쪽 T568A, 반대쪽 T568B입니다. "
              : "직결은 양쪽 모두 T568A 또는 모두 T568B입니다. ") +
            "A: " +
            (cables.a || []).map((color) => color || "빈칸").join(" · ") +
            " / B: " +
            (cables.b || []).map((color) => color || "빈칸").join(" · ")
          : observed[index],
    }));
  }
  function placeWire(source, payload, targetEnd, targetPin) {
    const unchanged = (reason) => ({ cables: copy(source), changed: false, reason });
    if (
      !payload ||
      !["a", "b"].includes(targetEnd) ||
      !Number.isInteger(targetPin) ||
      targetPin < 0 ||
      targetPin > 7 ||
      !colors.includes(payload.color)
    )
      return unchanged("invalid");
    const cables = copy(source),
      origin = payload.source;
    if (origin) {
      if (
        !["a", "b"].includes(origin.end) ||
        !Number.isInteger(origin.pin) ||
        origin.pin < 0 ||
        origin.pin > 7 ||
        source[origin.end][origin.pin] !== payload.color
      )
        return unchanged("stale");
      if (origin.end === targetEnd && origin.pin === targetPin) return unchanged("same");
      cables[origin.end][origin.pin] = cables[targetEnd][targetPin];
    }
    cables[targetEnd][targetPin] = payload.color;
    return { cables, changed: true };
  }
  const api = {
    initial,
    run,
    prompt,
    validIp,
    validMask,
    subnetInfo,
    addressIssue,
    sameConfig,
    inspect,
    colors,
    colorsA,
    cableCheck,
    placeWire,
    parseCommand,
  };
  root.PracticalLab = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
