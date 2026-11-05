// Slide 6 — Evolution of AI coding tools: a big-picture timeline with four lanes (IDE assistants, closed harnesses, open harnesses,
// deals and signals). Elastic time axis (2019–2022 compressed, 2025–2026 get the room). Revealed era by era: step n shows era n+1,
// earlier eras fade. Content from the Notion page "06 – Evolution of AI coding tools". Dates are approximate (month level); the
// layout of the pills is computed once, the first time the slide is shown.
(function () {
  // [year, month, day?] -> label. Era is derived from the year.
  const LANES = [
    { id: "ide", name: "IDE assistants", items: [
      [2019, 7, "Deep TabNine"], [2021, 6, "Copilot preview"], [2023, 3, "Cursor"],
      [2024, 11, "Windsurf · Cascade"], [2025, 2, "Copilot agent mode"], [2025, 7, "Kiro"], [2025, 10.9, "Cursor 2.0"],
      [2025, 11.6, "Antigravity"], [2026, 3, "Composer 2"], [2026, 5.6, "Antigravity 2.0"], [2026, 6, "Devin Desktop"] ] },
    { id: "closed", name: "Closed harnesses", items: [
      [2024, 3.4, "Devin demo"], [2025, 2.8, "Claude Code"], [2025, 5.5, "Codex cloud"], [2025, 6.8, "Gemini CLI"],
      [2025, 11, "Claude Code $1B"], [2026, 2, "Codex app"], [2026, 5.5, "Grok Build beta"], [2026, 6.6, "Antigravity CLI"] ] },
    { id: "open", name: "Open harnesses", items: [
      [2024, 11.8, "MCP"], [2025, 4.5, "Codex CLI"], [2025, 7, "Qwen Code"], [2025, 8.3, "Pi · AGENTS.md"],
      [2026, 1, "Kimi Code"], [2026, 4, "Goose → Linux Fdn"], [2026, 7.5, "Grok Build open"], [2026, 8.4, "DeepSeek Harness"], [2026, 10, "Pi 1.0"] ] },
    { id: "deal", name: "Deals and signals", items: [
      [2024, 4, "Cognition $2B"], [2025, 2.1, "“vibe coding”"], [2025, 7, "Windsurf split"], [2025, 11.4, "Cursor $29.3B"],
      [2025, 12.1, "Anthropic buys Bun"], [2026, 3.6, "OpenAI buys Astral"], [2026, 4.3, "Earendil buys Pi"], [2026, 4.7, "SpaceX–Cursor option"], [2026, 8.5, "SpaceX closes Cursor"] ] },
  ];
  const ERAS = [
    { name: "Autocomplete", from: 2019, to: 2023, w: 170 },
    { name: "Chat", from: 2023, to: 2024, w: 110 },
    { name: "Agents enter the IDE", from: 2024, to: 2025, w: 210 },
    { name: "Terminal agents everywhere", from: 2025, to: 2026, w: 540 },
    { name: "Consolidation · command centers", from: 2026, to: 2026.9, w: 440 },
  ];
  const X0 = 210, TODAY = 2026 + 10.1 / 12 - 0.0;
  const year = (y, m) => y + (m - 1) / 12;
  function xOf(t) {
    let acc = X0;
    for (let i = 0; i < ERAS.length; i++) {
      const e = ERAS[i];
      if (t < e.to || i === ERAS.length - 1) return acc + ((Math.min(t, e.to) - e.from) / (e.to - e.from)) * e.w;
      acc += e.w;
    }
  }
  const eraOf = (y) => (y < 2023 ? 0 : y < 2024 ? 1 : y < 2025 ? 2 : y < 2026 ? 3 : 4);

  Deck.slide({
    id: "evolution",
    section: "why",
    title: "Evolution of AI coding tools",
    className: "p1-ev",
    steps: 4, // step n reveals era n + 1; the first era is visible at once
    html: `
    <div class="p1-ev-chart" data-anim="up" data-delay="150"></div>`,
    onStep(step) { sync(step); },
    notes: "Big-picture timeline in four lanes: IDE assistants, closed harnesses, open harnesses, and deals and signals. Revealed era by era, earlier eras fade. Eras: autocomplete (to 2022), chat (2023), agents enter the IDE (2024), terminal agents everywhere (2025), consolidation and command centers (2026). Highlights: Copilot preview 2021-06; Cursor 2023-03; Windsurf Cascade 2024-11; MCP 2024-11; Claude Code 2025-02; Codex CLI 2025-04; Kiro 2025-07; Cursor 2.0 and Composer 2025-10; Antigravity 2025-11; Cursor valued at 29.3B 2025-11; Anthropic buys Bun 2025-12; Antigravity 2.0 and CLI 2026-05/06; Grok Build beta 2026-05 and open source 2026-07; Windsurf becomes Devin Desktop 2026-06; SpaceX closes Cursor at 60B 2026-08; DeepSeek harness 2026-08; Pi 1.0 2026-10.",
  });

  let built = false;
  function textWidth(ctx, s) { return Math.ceil(ctx.measureText(s).width) + 30; }

  function build() {
    const root = document.querySelector(".p1-ev-chart");
    if (!root || built) return;
    built = true;
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = `600 20px ${getComputedStyle(root).fontFamily}`;
    const RIGHT = 1680, ROW = 37;
    let html = "";
    // era chips and year labels
    let acc = X0;
    ERAS.forEach((e, i) => {
      html += `<div class="p1-ev-era" data-era="${i}" style="left:${acc}px;width:${e.w - 6}px">${e.name}</div>`;
      acc += e.w;
    });
    [[2019, "≤2022"], [2023, "2023"], [2024, "2024"], [2025, "2025"], [2026, "2026"]].forEach(([y, l]) => {
      const era = eraOf(y);
      html += `<div class="p1-ev-yr" data-era="${era}" style="left:${xOf(y) + 4}px">${l}</div><div class="p1-ev-vline" data-era="${era}" style="left:${xOf(y)}px"></div>`;
    });
    // lane layout: each pill goes into the nearest free row above or below the lane line, on the right or left of its dot
    let top = 92;
    const lanes = LANES.map((lane) => {
      const placed = [], stems = [];
      const out = lane.items.map(([y, m, label]) => {
        const px = xOf(year(y, m)), w = textWidth(ctx, label);
        const cands = [];
        for (let r = 0; r < 8; r++) for (const dir of [1, -1]) for (const side of [1, -1]) {
          const left = side === 1 ? px - 12 : px + 12 - w;
          if (left < X0 - 10 || left + w > RIGHT) continue;
          const y0 = dir === 1 ? 18 + r * ROW : -(18 + (r + 1) * ROW) + 6;
          cands.push({ r, dir, side, left, y0, cost: r * 10 + (dir === -1 ? 3 : 0) + (side === -1 ? 1 : 0) });
        }
        cands.sort((a, b) => a.cost - b.cost);
        const overlap = (a, b, pad) => a.l < b.r + pad && a.r > b.l - pad && a.t < b.b && a.b > b.t;
        for (const pad of [8, 3, 0]) {
          for (const c of cands) {
            const rect = { l: c.left, r: c.left + w, t: c.y0, b: c.y0 + 34 };
            const stem = { l: px - 1, r: px + 1, t: c.dir === 1 ? 0 : rect.b, b: c.dir === 1 ? rect.t : 0 };
            if (placed.some((q) => overlap(q, rect, pad))) continue;
            placed.push(rect); stems.push(stem);
            return { px, w, label, c, rect, era: eraOf(y), stem };
          }
        }
        return { px, w, label, c: cands[0], rect: { l: cands[0].left, t: cands[0].y0 }, era: eraOf(y), stem: null };
      });
      const minT = Math.min(0, ...out.map((o) => o.rect.t)), maxB = Math.max(18, ...out.map((o) => o.rect.t + 34));
      const info = { lane, out, top, line: top - minT + 6, h: maxB - minT + 22 };
      top += info.h + 4;
      return info;
    });
    let stemsHtml = "", dotsHtml = "", pillsHtml = "";
    lanes.forEach(({ lane, out, line, top: t0, h }) => {
      html += `<div class="p1-ev-lane is-${lane.id}" style="top:${t0}px;height:${h}px"><span class="p1-ev-ln" style="top:${line - t0 - 22}px">${lane.name}</span><i class="p1-ev-line" style="top:${line - t0 - 2}px"></i></div>`;
      out.forEach((o) => {
        const c = o.c, yy = line + c.y0, sTop = c.dir === 1 ? line : line + c.y0 + 34, sH = c.dir === 1 ? c.y0 : -c.y0 - 34;
        const k = `is-${lane.id}" data-era="${o.era}`;
        stemsHtml += `<i class="p1-ev-stem ${k}" style="left:${o.px}px;top:${sTop}px;height:${Math.max(0, sH)}px"></i>`;
        dotsHtml += `<i class="p1-ev-dot ${k}" style="left:${o.px}px;top:${line - 9}px"></i>`;
        pillsHtml += `<span class="p1-ev-pill ${k}" style="left:${c.left}px;top:${yy}px">${o.label}</span>`;
      });
    });
    html += stemsHtml + dotsHtml + pillsHtml;
    html += `<div class="p1-ev-today" style="left:${xOf(TODAY)}px;height:${top - 120}px"><b>TODAY</b></div>`;
    root.innerHTML = html;
    root.style.setProperty("--ev-h", top + "px");
    sync();
  }

  // Step n = era n + 1 is current; earlier eras fade, later ones wait.
  function sync(step) {
    const root = document.querySelector(".p1-ev");
    if (!root) return;
    const cur = typeof step === "number" ? step + 0 : Deck.state.index === Deck.slides.findIndex((d) => d.id === "evolution") ? Deck.state.step || 0 : 0;
    const era = Math.min(4, cur);
    root.dataset.era = era;
    root.querySelectorAll("[data-era]").forEach((el) => {
      const e = +el.dataset.era;
      el.classList.toggle("is-cur", e === era);
      el.classList.toggle("is-past", e < era);
      el.classList.toggle("is-next", e > era);
    });
    root.querySelector(".p1-ev-today")?.classList.toggle("is-on", era === 4);
  }
  Deck.on("slidechange", () => { (document.fonts?.ready || Promise.resolve()).then(() => { build(); sync(); }); });
  Deck.on("stepchange", ({ step }) => sync(step));
  Deck.on("ready", () => { (document.fonts?.ready || Promise.resolve()).then(() => { build(); sync(); }); });
})();
