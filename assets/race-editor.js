(() => {
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
    ["category", "组别 / 距离"],
    ["location", "地点"],
    ["signup", "预计报名时间"],
    ["official", "报名渠道 / 官网名称"],
    ["url", "报名官网链接"],
  ];
  let edits = {};
  let ready = Promise.resolve();

  ready = fetch("./state.json", { cache: "no-store" })
    .then((response) => response.ok ? response.json() : {})
    .then((state) => {
      edits = state.raceEdits && typeof state.raceEdits === "object" ? state.raceEdits : {};
      try {
        const appState = JSON.parse(localStorage.getItem("wamiao_state_v2") || "{}");
        if (appState.raceEdits && typeof appState.raceEdits === "object") edits = { ...edits, ...appState.raceEdits };
        const cached = JSON.parse(localStorage.getItem(EDITS_KEY) || "{}");
        edits = { ...cached, ...edits };
      } catch {}
      localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
    })
    .catch(() => {});

  function valueFor(race, key, fallback = "") {
    const value = edits[race]?.[key];
    return value == null ? fallback : value;
  }

  function setText(element, text) {
    if (element && element.textContent !== String(text ?? "")) element.textContent = text ?? "";
  }

  function selectedRaceId() {
    return document.querySelector(".race-card.selected[data-race-id]")?.dataset.raceId || "";
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
        button.hidden = !localStorage.getItem(TOKEN_KEY) || !window.__wamiaoRaceStateReady;
        button.addEventListener("click", () => openEditor(selectedRaceId() || panel.dataset.raceId));
        sticky.append(button);
      }
      const button = panel.querySelector(".race-edit-btn");
      if (button) {
        const hidden = !localStorage.getItem(TOKEN_KEY) || !window.__wamiaoRaceStateReady;
        if (button.hidden !== hidden) button.hidden = hidden;
      }
    }
  }

  function parseDateRange(value) {
    const iso = [...String(value || "").matchAll(/(\d{4})-(\d{2})-(\d{2})/g)];
    if (iso.length) return { start: iso[0][0], end: iso[1]?.[0] || iso[0][0] };
    const first = String(value || "").match(/(\d{1,2})月\s*(\d{1,2})日?/);
    if (!first) return { start: "", end: "" };
    const year = "2027";
    const date = (month, day) => `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const tail = String(value).slice(first.index + first[0].length);
    const explicit = tail.match(/(\d{1,2})月\s*(\d{1,2})日?/);
    const short = tail.match(/[–—~至/／]\s*(\d{1,2})日?/);
    const month = explicit ? Number(explicit[1]) : Number(first[1]);
    const lastDay = explicit ? Number(explicit[2]) : short ? Number(short[1]) : Number(first[2]);
    return { start: date(Number(first[1]), Number(first[2])), end: date(month, lastDay) };
  }

  function openEditor(raceId) {
    if (!localStorage.getItem(TOKEN_KEY) || !window.__wamiaoRaceStateReady) return;
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
    const roleLabel = document.createElement("label");
    roleLabel.textContent = "计划角色";
    const roleSelect = document.createElement("select");
    ["首选", "备选1", "备选2", "备选3"].forEach((choice) => {
      const option = document.createElement("option");
      option.value = choice;
      option.textContent = choice;
      roleSelect.append(option);
    });
    const roleValue = valueFor(raceId, "role", base.role);
    if (![...roleSelect.options].some((option) => option.value === roleValue)) {
      const current = document.createElement("option");
      current.value = roleValue;
      current.textContent = `${roleValue}（当前值）`;
      roleSelect.append(current);
    }
    roleSelect.value = roleValue;
    inputs.role = roleSelect;
    roleLabel.append(roleSelect);
    form.append(roleLabel);
    const typeLabel = document.createElement("label");
    typeLabel.textContent = "赛事类型";
    const typeSelect = document.createElement("select");
    ["越野", "全马", "半马", "铁三", "其他"].forEach((choice) => {
      const option = document.createElement("option");
      option.value = choice;
      option.textContent = choice;
      typeSelect.append(option);
    });
    const typeValue = valueFor(raceId, "type", base.type === "UTMB" ? "越野" : base.type);
    if (![...typeSelect.options].some((option) => option.value === typeValue)) {
      const current = document.createElement("option");
      current.value = typeValue;
      current.textContent = `${typeValue}（当前值）`;
      typeSelect.append(current);
    }
    typeSelect.value = typeValue;
    inputs.type = typeSelect;
    typeLabel.append(typeSelect);
    form.append(typeLabel);
    const dateLabel = document.createElement("label");
    dateLabel.textContent = "比赛日期范围（留空保留原日期）";
    const dateRange = parseDateRange(valueFor(raceId, "date", base.date));
    const dateInputs = document.createElement("div");
    dateInputs.className = "race-date-range";
    const dateFrom = document.createElement("input");
    dateFrom.type = "date";
    dateFrom.setAttribute("aria-label", "比赛开始日期");
    dateFrom.value = dateRange.start;
    const dateTo = document.createElement("input");
    dateTo.type = "date";
    dateTo.setAttribute("aria-label", "比赛结束日期");
    dateTo.value = dateRange.end;
    dateInputs.append(dateFrom, dateTo);
    dateLabel.append(dateInputs);
    form.append(dateLabel);
    inputs.dateFrom = dateFrom;
    inputs.dateTo = dateTo;
    fields.forEach(([key, labelText]) => {
      const label = document.createElement("label");
      label.textContent = labelText;
      const input = document.createElement("input");
      input.type = key === "url" ? "url" : "text";
      input.placeholder = key === "url" ? "https://example.com" : "";
      input.value = valueFor(raceId, key, existing[key] ?? base[key] ?? "");
      input.autocomplete = "off";
      inputs[key] = input;
      label.append(input);
      form.append(label);
    });
    const status = document.createElement("p");
    status.className = "race-editor-status";
    const actions = document.createElement("footer");
    actions.className = "race-editor-actions";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "取消";
    const save = document.createElement("button");
    save.type = "submit";
    save.className = "save";
    save.textContent = "保存";
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
      next.role = inputs.role.value;
      next.type = inputs.type.value;
      if (inputs.dateFrom.value && inputs.dateTo.value) {
        if (inputs.dateTo.value < inputs.dateFrom.value) {
          status.textContent = "结束日期不能早于开始日期。";
          return;
        }
        next.date = `${inputs.dateFrom.value} – ${inputs.dateTo.value}`;
      } else if (inputs.dateFrom.value || inputs.dateTo.value) {
        status.textContent = "请同时选择开始和结束日期。";
        return;
      } else {
        next.date = valueFor(raceId, "date", base.date);
      }
      fields.forEach(([key]) => { next[key] = inputs[key].value.trim(); });
      if (!next.name) { status.textContent = "赛事名称不能为空。"; return; }
      save.disabled = true;
      status.textContent = "正在保存到本机…";
      edits = { ...edits, [raceId]: next };
      try {
        if (typeof window.__wamiaoSetRaceEdits !== "function" || !window.__wamiaoRaceStateReady) {
          throw new Error("参赛计划保存模块尚未就绪，请刷新页面后重试。");
        }
        localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
        window.__wamiaoSetRaceEdits(edits);
        refresh();
        status.textContent = "已保存到本机，正在后台同步…";
        window.setTimeout(dismiss, 700);
      } catch (error) {
        status.textContent = error.message || "保存失败，请重试。";
        save.disabled = false;
      }
    });
  }

  let refreshScheduled = false;
  const scheduleRefresh = () => {
    if (refreshScheduled) return;
    refreshScheduled = true;
    window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          refreshScheduled = false;
          refresh();
        });
      });
    });
  };
  const containsRaceStructure = (node) => node.nodeType === Node.ELEMENT_NODE && (
    node.matches(".race-card, .detail-panel") || node.querySelector(".race-card, .detail-panel")
  );
  const observer = new MutationObserver((records) => {
    const raceUiChanged = records.some((record) => {
      if (record.type === "attributes") {
        return record.target.matches(".race-card");
      }
      return record.target instanceof Element &&
        record.target.closest(".race-card, .detail-panel") ||
        [...record.addedNodes, ...record.removedNodes].some(containsRaceStructure);
    });
    if (raceUiChanged) scheduleRefresh();
  });
  observer.observe(document.querySelector("#root") || document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
  document.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(".race-card")) {
      scheduleRefresh();
    }
  }, true);
  ready.then(scheduleRefresh);
})();
