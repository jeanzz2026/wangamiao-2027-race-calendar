(() => {
  const API = "https://api.github.com/repos/jeanzz2026/wangamiao-2027-race-calendar/contents/state.json";
  const TOKEN_KEY = "wamiao_gh_token";
  const EDITS_KEY = "wamiao_race_edits_v1";
  const raceIds = {
    "Vibram香港100": "hk100", "广州100越野赛": "gz100", "深圳100越野赛": "sz100",
    "高黎贡超级山径赛 by UTMB": "glg", "兰州马拉松": "lanzhou", "青岛马拉松": "qingdao",
    "长春马拉松": "changchun", "大连马拉松": "dalian", "无锡马拉松": "wuxi",
    "厦门马拉松": "xiamen", "崇礼168超级越野赛": "chongli", "野性祁连越野跑": "qilian",
    "武隆国际越野赛": "wulong", "四姑娘山云间花径越野跑": "siguniang",
    "宁海越野赛（非UTMB）": "ninghai", "济州岛 by UTMB": "jeju", "云丘山 by UTMB": "yunqiu",
    "武功山越野赛": "wugong", "TransLantau by UTMB（大屿山）": "lantau",
    "凯乐石莫干山跑山赛": "mogan", "阳朔100国际越野赛": "yangshuo",
  };
  const fields = [
    ["name", "赛事名称"],
    ["role", "计划角色"],
    ["type", "赛事类型"],
    ["date", "比赛日期"],
    ["category", "组别 / 距离"],
    ["location", "地点"],
    ["signup", "预计报名时间"],
    ["official", "报名渠道 / 官网名称"],
    ["url", "报名官网链接"],
  ];
  let edits = {};
  let sha = "";
  let ready = Promise.resolve();

  const decode = (value) => decodeURIComponent(escape(atob(value.replace(/\s/g, ""))));
  const encode = (value) => btoa(unescape(encodeURIComponent(value)));
  const headers = (token) => ({ Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" });

  ready = fetch("./state.json", { cache: "no-store" })
    .then((response) => response.ok ? response.json() : {})
    .then((state) => {
      edits = state.raceEdits && typeof state.raceEdits === "object" ? state.raceEdits : {};
      try {
        const cached = JSON.parse(localStorage.getItem(EDITS_KEY) || "{}");
        edits = { ...cached, ...edits };
      } catch {}
      localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
    })
    .catch(() => {});

  // Keep race edits when the calendar's normal autosave writes placements/training data.
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof Request ? input.url : "";
    const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
    if (method === "PUT" && url.includes("/contents/state.json") && init?.body) {
      await ready;
      try {
        const payload = JSON.parse(init.body);
        const state = JSON.parse(decode(payload.content));
        payload.content = encode(JSON.stringify({ ...state, raceEdits: edits }, null, 2));
        init = { ...init, body: JSON.stringify(payload) };
      } catch {}
    }
    return nativeFetch(input, init);
  };

  function valueFor(race, key, fallback = "") {
    const value = edits[race]?.[key];
    return value == null ? fallback : value;
  }

  function setText(element, text) {
    if (element && element.textContent !== String(text ?? "")) element.textContent = text ?? "";
  }

  function paintRace(raceId) {
    if (!raceId) return;
    const edit = edits[raceId];
    if (!edit) return;
    document.querySelectorAll(`[data-race-id="${CSS.escape(raceId)}"]`).forEach((card) => {
      const heading = card.querySelector("h3");
      const top = card.querySelector(".card-top");
      const line = card.querySelector("p");
      const category = card.querySelector("small");
      setText(heading, edit.name);
      setText(top?.children[0], edit.role);
      setText(top?.children[1], edit.type);
      setText(line, `${edit.date} · ${edit.location}`);
      setText(category, edit.category);
      card.classList.toggle("is-primary", String(edit.role || "").startsWith("首选"));
      card.classList.toggle("is-utmb", edit.type === "UTMB");
    });
    const panel = document.querySelector(`.detail-panel[data-race-id="${CSS.escape(raceId)}"]`);
    if (!panel) return;
    const role = panel.querySelector(".detail-role span");
    const type = panel.querySelector(".detail-role b");
    const title = panel.querySelector(".detail-sticky > h2");
    setText(role, edit.role);
    setText(type, edit.type);
    setText(title, edit.name);
    const details = panel.querySelectorAll("dl dd");
    [edit.date, edit.category, edit.location, edit.signup].forEach((text, index) => {
      setText(details[index], text);
    });
    const link = panel.querySelector(".official-link");
    const note = panel.querySelector(".official-note");
    if (edit.url) {
      if (link) {
        if (link.getAttribute("href") !== edit.url) link.href = edit.url;
        const small = link.querySelector("small");
        setText(small, edit.official);
      } else if (note) {
        const anchor = document.createElement("a");
        anchor.className = "official-link";
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
        anchor.href = edit.url;
        anchor.append("访问报名官网 ↗ ");
        const small = document.createElement("small");
        small.textContent = edit.official;
        anchor.append(small);
        note.replaceWith(anchor);
      }
    } else if (link) {
      const replacement = document.createElement("div");
      replacement.className = "official-note";
      const label = document.createElement("b");
      label.textContent = "报名渠道";
      const text = document.createElement("span");
      text.textContent = edit.official;
      replacement.append(label, text);
      link.replaceWith(replacement);
    } else if (note?.querySelector("span")) {
      setText(note.querySelector("span"), edit.official);
    }
  }

  function refresh() {
    document.querySelectorAll(".race-card").forEach((card) => {
      const heading = card.querySelector("h3");
      const id = card.dataset.raceId || raceIds[heading?.textContent?.trim()];
      if (id && card.dataset.raceId !== id) card.dataset.raceId = id;
      paintRace(id);
    });
    const panel = document.querySelector(".detail-panel");
    const selected = document.querySelector(".race-card.selected[data-race-id]");
    if (panel && selected && panel.dataset.raceId !== selected.dataset.raceId) panel.dataset.raceId = selected.dataset.raceId;
    if (panel?.dataset.raceId) paintRace(panel.dataset.raceId);
    if (panel) {
      const sticky = panel.querySelector(".detail-sticky");
      if (sticky && !sticky.querySelector(".race-edit-btn")) {
        const button = document.createElement("button");
        button.className = "race-edit-btn";
        button.type = "button";
        button.textContent = "编辑赛事详情";
        button.hidden = !localStorage.getItem(TOKEN_KEY);
        button.addEventListener("click", () => openEditor(panel.dataset.raceId));
        sticky.append(button);
      }
      const button = panel.querySelector(".race-edit-btn");
      if (button) {
        const hidden = !localStorage.getItem(TOKEN_KEY);
        if (button.hidden !== hidden) button.hidden = hidden;
      }
    }
  }

  async function getCloud(token) {
    const response = await nativeFetch(`${API}?ref=main`, { headers: headers(token), cache: "no-store" });
    if (!response.ok) throw new Error(`读取云端失败（HTTP ${response.status}）`);
    const file = await response.json();
    sha = file.sha;
    return JSON.parse(decode(file.content));
  }

  async function saveCloud(token) {
    let state = await getCloud(token);
    state.raceEdits = edits;
    const put = () => nativeFetch(API, {
      method: "PUT",
      headers: { ...headers(token), "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Update race details", content: encode(JSON.stringify(state, null, 2)), branch: "main", sha }),
    });
    let response = await put();
    if (response.status === 409) {
      state = await getCloud(token);
      state.raceEdits = edits;
      response = await put();
    }
    if (!response.ok) throw new Error(`云端保存失败（HTTP ${response.status}）`);
  }

  function openEditor(raceId) {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    const existing = edits[raceId] || {};
    const card = document.querySelector(`.race-card[data-race-id="${CSS.escape(raceId)}"]`);
    const panel = document.querySelector(`.detail-panel[data-race-id="${CSS.escape(raceId)}"]`);
    const base = {
      name: card?.querySelector("h3")?.textContent || panel?.querySelector("h2")?.textContent || "",
      role: card?.querySelector(".card-top span")?.textContent || panel?.querySelector(".detail-role span")?.textContent || "",
      type: card?.querySelector(".card-top b")?.textContent || panel?.querySelector(".detail-role b")?.textContent || "",
      date: panel?.querySelectorAll("dl dd")[0]?.textContent || "",
      category: panel?.querySelectorAll("dl dd")[1]?.textContent || card?.querySelector("small")?.textContent || "",
      location: panel?.querySelectorAll("dl dd")[2]?.textContent || "",
      signup: panel?.querySelectorAll("dl dd")[3]?.textContent || "",
      official: panel?.querySelector(".official-link small")?.textContent || panel?.querySelector(".official-note span")?.textContent || "",
      url: panel?.querySelector(".official-link")?.href || "",
    };
    const overlay = document.createElement("div");
    overlay.className = "race-editor-overlay";
    const form = document.createElement("form");
    form.className = "race-editor-modal";
    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.textContent = "编辑赛事详情";
    const close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", "关闭");
    close.textContent = "×";
    header.append(title, close);
    form.append(header);
    const inputs = {};
    fields.forEach(([key, labelText]) => {
      const label = document.createElement("label");
      label.textContent = labelText;
      const input = document.createElement("input");
      input.type = "text";
      input.value = valueFor(raceId, key, existing[key] ?? base[key] ?? "");
      input.autocomplete = "off";
      inputs[key] = input;
      label.append(input);
      form.append(label);
    });
    const status = document.createElement("p");
    status.className = "race-editor-status";
    const actions = document.createElement("footer");
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "取消";
    const save = document.createElement("button");
    save.type = "submit";
    save.className = "save";
    save.textContent = "保存并同步";
    actions.append(cancel, save);
    form.append(status, actions);
    overlay.append(form);
    document.body.append(overlay);
    const dismiss = () => overlay.remove();
    close.addEventListener("click", dismiss);
    cancel.addEventListener("click", dismiss);
    overlay.addEventListener("click", (event) => { if (event.target === overlay) dismiss(); });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) { status.textContent = "请先连接 GitHub 登录。"; return; }
      const next = {};
      fields.forEach(([key]) => { next[key] = inputs[key].value.trim(); });
      if (!next.name) { status.textContent = "赛事名称不能为空。"; return; }
      save.disabled = true;
      status.textContent = "正在保存到 GitHub…";
      edits = { ...edits, [raceId]: next };
      try {
        await saveCloud(token);
        localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
        refresh();
        status.textContent = "已保存并同步 ✓";
        window.setTimeout(dismiss, 700);
      } catch (error) {
        status.textContent = error.message || "保存失败，请重试。";
        save.disabled = false;
      }
    });
  }

  const observer = new MutationObserver(refresh);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  ready.then(refresh);
  window.setInterval(refresh, 1200);
})();
