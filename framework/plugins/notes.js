/* Notes board — N opens a canvas of uniform sticky notes for Q&A, audience feedback and follow-ups.
 * Enter = new note (and, while typing, save + next), drag to arrange, drop into a lane to sort,
 * export everything as one Markdown file. Notes are kept in this browser, per deck; nothing leaves it.
 * Config: Deck.configure({ notes: { lanes: ["Questions", "Feedback", "Follow-ups"] } }) */
(function () {
  "use strict";
  Deck.on("ready", () => {
    const esc = Deck.escapeHtml;
    const CW = 1624, NW = 240, NH = 180, GAP = 16, HEAD = 64, GRID = 8, MAX_LANES = 5;
    const COLORS = 4; // c0 amber · c1 blue · c2 green · c3 purple
    const KEY = "deck.notes.v1:" + location.pathname;
    const cfgLanes = Array.isArray(Deck.config?.notes?.lanes) && Deck.config.notes.lanes.length ? Deck.config.notes.lanes.slice(0, MAX_LANES) : ["Questions", "Feedback", "Follow-ups"];

    // ---------- state ----------
    let S = { lanes: cfgLanes.map(String), notes: [], seq: 1 };
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "null");
      if (v && Array.isArray(v.lanes) && Array.isArray(v.notes)) S = Object.assign(S, v);
    } catch (_) {}
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {} };
    const undo = [];
    const snap = () => { undo.push(JSON.stringify(S)); if (undo.length > 40) undo.shift(); };
    const doUndo = () => {
      const p = undo.pop();
      if (!p) return;
      S = JSON.parse(p); sel = null; save(); render();
    };

    let open = false, sel = null, editing = null, active = 0, armClear = 0;
    const byId = (id) => S.notes.find((n) => n.id === id);
    const laneW = () => CW / S.lanes.length;
    const laneOf = (n) => Math.max(0, Math.min(S.lanes.length - 1, Math.floor((n.x + NW / 2) / laneW())));
    const snapv = (v) => Math.round(v / GRID) * GRID;
    const rot = (id) => ((id * 37) % 5 - 2) * 0.45; // −0.9° … +0.9°, stable per note
    const hhmm = (t) => new Date(t).toTimeString().slice(0, 5);

    // ---------- DOM ----------
    const style = document.createElement("style");
    style.textContent = `
.nb-panel{display:flex;flex-direction:column;width:1680px;height:920px;max-width:1680px;max-height:920px;padding:28px 28px 24px;overflow:hidden}
.nb-head{display:flex;align-items:center;gap:20px;margin:0 0 18px}
.nb-head h2{margin:0;font-size:40px}.nb-head .deck-panel-sub{margin:6px 0 0;font-size:19px}
.nb-actions{margin-left:auto;display:flex;gap:8px;flex-wrap:nowrap;align-items:center}
.nb-btn{font:600 17px var(--deck-font-sans);color:var(--deck-text);background:var(--deck-bg);border:1px solid var(--deck-border-strong);border-radius:var(--deck-radius-pill);padding:8px 16px;cursor:pointer;white-space:nowrap}
.nb-btn:hover{border-color:var(--deck-accent);color:var(--deck-accent)}.nb-btn.is-primary{background:var(--deck-accent);border-color:var(--deck-accent);color:var(--deck-bg)}
.nb-btn.is-danger{border-color:var(--deck-danger);color:var(--deck-danger)}.nb-btn:focus-visible{outline:3px solid var(--deck-focus);outline-offset:2px}
.nb-board{position:relative;flex:1;overflow-y:auto;overflow-x:hidden;border:1px solid var(--deck-border);border-radius:var(--deck-radius);background:var(--deck-bg)}
.nb-canvas{position:relative;width:${CW}px;min-height:100%}
.nb-lane{position:absolute;top:0;bottom:0;border-right:1px dashed var(--deck-border-strong)}.nb-lane:last-child{border-right:0}
.nb-lane.is-active{background:color-mix(in srgb,var(--deck-accent) 6%,transparent)}
.nb-lh{display:flex;align-items:center;gap:10px;height:${HEAD - 12}px;padding:0 18px;margin-top:6px;cursor:pointer;color:var(--deck-text-2);font:700 21px var(--deck-font-sans);letter-spacing:.04em;text-transform:uppercase}
.nb-lh .k{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:8px;border:1px solid var(--deck-border-strong);font-size:16px;color:var(--deck-muted)}
.nb-lane.is-active .nb-lh{color:var(--deck-accent)}.nb-lane.is-active .nb-lh .k{border-color:var(--deck-accent);color:var(--deck-accent)}
.nb-lh .c{margin-left:auto;font-weight:600;color:var(--deck-muted)}
.nb-lh input{font:inherit;text-transform:inherit;letter-spacing:inherit;color:var(--deck-text);background:var(--deck-raised);border:1px solid var(--deck-accent);border-radius:8px;padding:2px 8px;width:70%}
.nb-empty{position:absolute;left:0;right:0;top:300px;text-align:center;color:var(--deck-muted);font-size:24px;pointer-events:none}
.nb-note{position:absolute;width:${NW}px;height:${NH}px;box-sizing:border-box;padding:14px 16px 10px;border-radius:6px;border:1px solid;display:flex;flex-direction:column;cursor:grab;user-select:none;touch-action:none;
 box-shadow:0 1px 1px rgba(0,0,0,.08),0 8px 18px -6px rgba(0,0,0,.28);transform:rotate(var(--rot,0deg));transition:box-shadow .15s,opacity .2s}
.nb-note.c0{background:var(--deck-wait-bg);border-color:var(--deck-wait)}.nb-note.c1{background:var(--deck-info-bg);border-color:var(--deck-info)}
.nb-note.c2{background:var(--deck-ok-bg);border-color:var(--deck-ok)}.nb-note.c3{background:var(--deck-delegated-bg);border-color:var(--deck-delegated)}
.nb-note.is-sel{outline:3px solid var(--deck-accent);outline-offset:2px;z-index:5}.nb-note.is-drag{cursor:grabbing;z-index:9;box-shadow:0 18px 34px -8px rgba(0,0,0,.4);transition:none}
.nb-note.is-done .nb-txt{padding-right:30px}.nb-note.is-done{opacity:.55}.nb-note.is-done::after{content:"✓";position:absolute;right:10px;top:6px;font:800 26px var(--deck-font-sans);color:var(--deck-ok)}
.nb-txt,.nb-note textarea{flex:1;min-height:0;color:var(--deck-text);font-family:var(--deck-font-sans);font-weight:600;line-height:1.22;white-space:pre-wrap;word-break:break-word;overflow:hidden}
.nb-note textarea{width:100%;box-sizing:border-box;resize:none;border:0;outline:0;background:transparent;padding:0;user-select:text;cursor:text;overflow:auto}
.nb-foot{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:6px;font:600 14px var(--deck-font-sans);color:var(--deck-text-2);white-space:nowrap}
.nb-src{overflow:hidden;text-overflow:ellipsis;opacity:.85}
.nb-note:hover .nb-src,.nb-note.is-sel .nb-src{opacity:0}.nb-tools{position:absolute;right:8px;bottom:6px;display:flex;gap:2px;opacity:0;transition:opacity .15s;}.nb-note:hover .nb-tools,.nb-note.is-sel .nb-tools{opacity:1}
.nb-tools button{font:700 17px var(--deck-font-sans);width:28px;height:28px;border-radius:50%;border:0;background:rgba(255,255,255,.4);color:var(--deck-text);cursor:pointer}
.nb-tools button:hover{background:var(--deck-text);color:var(--deck-bg)}
@media (prefers-reduced-motion:reduce){.nb-note,.nb-tools{transition:none}}
[data-reduced-motion] .nb-note,[data-reduced-motion] .nb-tools{transition:none}`;
    document.head.append(style);

    const modal = document.createElement("div");
    modal.className = "deck-modal deck-notes";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-label", "Notes board");
    modal.innerHTML = `<div class="deck-panel nb-panel">
      <div class="nb-head"><div><h2>Notes board</h2><p class="deck-panel-sub nb-sub"></p></div>
        <div class="nb-actions">
          <button class="nb-btn is-primary" data-act="new">+ Note</button>
          <button class="nb-btn" data-act="lane+" title="Add a lane">+ Lane</button>
          <button class="nb-btn" data-act="lane-" title="Remove the last lane (must be empty)">− Lane</button>
          <button class="nb-btn" data-act="undo" title="Ctrl/⌘+Z or U">Undo</button>
          <button class="nb-btn" data-act="md">Export .md</button>
          <button class="nb-btn" data-act="copy">Copy .md</button>
          <button class="nb-btn is-danger" data-act="clear">Clear all</button>
          <button class="nb-btn" data-act="close">Close</button>
        </div></div>
      <div class="nb-board"><div class="nb-canvas"></div></div></div>`;
    Deck.el.ui.append(modal);
    const board = modal.querySelector(".nb-board");
    const canvas = modal.querySelector(".nb-canvas");
    const sub = modal.querySelector(".nb-sub");

    // ---------- rendering ----------
    function fit(el) {
      const sizes = [34, 28, 24, 21, 18, 16];
      for (const s of sizes) {
        el.style.fontSize = s + "px";
        if (el.scrollHeight <= el.clientHeight + 1) return;
      }
    }
    function noteHtml(n) {
      const title = Deck.slides[n.slide]?.title || "";
      return `<div class="nb-note c${n.color || 0}${n.done ? " is-done" : ""}${sel === n.id ? " is-sel" : ""}" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px;--rot:${rot(n.id)}deg">
        <div class="nb-txt">${esc(n.text)}</div>
        <div class="nb-foot"><span class="nb-src">${String(n.slide + 1).padStart(2, "0")} · ${esc(title)} · ${hhmm(n.t)}</span>
          <span class="nb-tools"><button data-a="done" title="Answered / done">✓</button><button data-a="col" title="Colour">●</button><button data-a="del" title="Delete">×</button></span></div></div>`;
    }
    function render() {
      const L = S.lanes, w = laneW();
      const counts = L.map((_, i) => S.notes.filter((n) => laneOf(n) === i).length);
      const maxB = S.notes.reduce((m, n) => Math.max(m, n.y + NH + 40), 0);
      canvas.style.height = Math.max(maxB, 700) + "px";
      canvas.innerHTML =
        L.map((name, i) => `<div class="nb-lane${i === active ? " is-active" : ""}" data-lane="${i}" style="left:${i * w}px;width:${w}px">
          <div class="nb-lh" data-lh="${i}" title="Click: new notes land here · double-click: rename"><span class="k">${i + 1}</span><span class="nm">${esc(name)}</span><span class="c">${counts[i]}</span></div></div>`).join("") +
        (S.notes.length ? "" : `<div class="nb-empty">Press Enter to add the first note · keys 1–${L.length} choose its lane</div>`) +
        S.notes.map(noteHtml).join("");
      canvas.querySelectorAll(".nb-txt").forEach(fit);
      sub.textContent = `${S.notes.length} note${S.notes.length === 1 ? "" : "s"} · Enter adds · drag to sort · double-click edits`;
      modal.querySelector('[data-act="clear"]').textContent = armClear ? "Sure? Clear all" : "Clear all";
    }

    // ---------- creating / editing ----------
    function freeSpot(lane) {
      const w = laneW(), cols = Math.max(1, Math.floor((w - GAP) / (NW + GAP)));
      for (let r = 0; r < 40; r++)
        for (let c = 0; c < cols; c++) {
          const x = Math.round(lane * w + GAP + c * (NW + GAP)), y = HEAD + r * (NH + GAP);
          if (!S.notes.some((n) => Math.abs(n.x - x) < 24 && Math.abs(n.y - y) < 24)) return [x, y];
        }
      return [Math.round(lane * w + GAP), HEAD];
    }
    function addNote(lane = active) {
      snap();
      const [x, y] = freeSpot(lane);
      const n = { id: S.seq++, text: "", x, y, color: lane % COLORS, done: false, slide: Deck.state.index, t: Date.now() };
      S.notes.push(n);
      sel = n.id; save(); render(); edit(n.id);
      board.scrollTop = Math.max(0, y - 120);
    }
    function edit(id) {
      const n = byId(id);
      const el = canvas.querySelector(`.nb-note[data-id="${id}"]`);
      if (!n || !el) return;
      editing = id;
      const box = el.querySelector(".nb-txt");
      const ta = document.createElement("textarea");
      ta.value = n.text; ta.maxLength = 400; ta.style.fontSize = "24px"; ta.setAttribute("aria-label", "Note text");
      box.replaceWith(ta);
      ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
      let done = false;
      const finish = (next) => {
        if (done) return; done = true;
        editing = null;
        const v = ta.value.trim();
        if (v !== n.text) { if (n.text) snap(); n.text = v; }
        if (!v) S.notes = S.notes.filter((x) => x.id !== id);
        save(); render();
        if (next && v) addNote(laneOf(n));
      };
      ta.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); finish(true); }
        else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); finish(false); }
        else if (e.key === "Tab") { e.preventDefault(); finish(false); }
      });
      ta.addEventListener("blur", () => finish(false));
      ta.addEventListener("pointerdown", (e) => e.stopPropagation());
    }
    function renameLane(i) {
      const el = canvas.querySelector(`[data-lh="${i}"] .nm`);
      if (!el) return;
      const inp = document.createElement("input");
      inp.value = S.lanes[i]; inp.maxLength = 28; inp.setAttribute("aria-label", "Lane name");
      el.replaceWith(inp); inp.focus(); inp.select();
      let done = false;
      const finish = (ok) => { if (done) return; done = true; const v = inp.value.trim(); if (ok && v && v !== S.lanes[i]) { snap(); S.lanes[i] = v; save(); } render(); };
      inp.addEventListener("keydown", (e) => { e.stopPropagation(); if (e.key === "Enter") finish(true); else if (e.key === "Escape") finish(false); });
      inp.addEventListener("blur", () => finish(true));
    }

    // ---------- drag ----------
    let drag = null;
    canvas.addEventListener("pointerdown", (e) => {
      if (e.button) return;
      const btn = e.target.closest("button[data-a]");
      const el = e.target.closest(".nb-note");
      if (!el) { if (!e.target.closest(".nb-lh")) { sel = null; canvas.querySelectorAll(".is-sel").forEach((x) => x.classList.remove("is-sel")); } return; }
      const id = +el.dataset.id;
      if (btn) return; // handled on click
      if (editing && editing !== id) document.activeElement?.blur?.();
      sel = id;
      canvas.querySelectorAll(".is-sel").forEach((x) => x.classList.remove("is-sel"));
      el.classList.add("is-sel");
      const n = byId(id);
      const scale = canvas.getBoundingClientRect().width / CW || 1;
      drag = { id, el, n, sx: e.clientX, sy: e.clientY, ox: n.x, oy: n.y, scale, moved: false, pid: e.pointerId };
      el.setPointerCapture?.(e.pointerId);
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.pid) return;
      const dx = (e.clientX - drag.sx) / drag.scale, dy = (e.clientY - drag.sy) / drag.scale;
      if (!drag.moved && Math.hypot(dx, dy) < 4) return;
      if (!drag.moved) { drag.moved = true; snap(); drag.el.classList.add("is-drag"); }
      drag.n.x = Math.max(0, Math.min(CW - NW, drag.ox + dx));
      drag.n.y = Math.max(HEAD - 8, drag.oy + dy);
      drag.el.style.left = drag.n.x + "px"; drag.el.style.top = drag.n.y + "px";
      const li = laneOf(drag.n);
      canvas.querySelectorAll(".nb-lane").forEach((l, i) => l.classList.toggle("is-active", i === li));
      const r = board.getBoundingClientRect();
      if (e.clientY > r.bottom - 50) board.scrollTop += 14; else if (e.clientY < r.top + 50) board.scrollTop -= 14;
    });
    const endDrag = (e) => {
      if (!drag || (e && e.pointerId !== drag.pid)) return;
      const d = drag; drag = null;
      if (d.moved) { d.n.x = Math.max(0, Math.min(CW - NW, snapv(d.n.x))); d.n.y = Math.max(HEAD, snapv(d.n.y)); active = laneOf(d.n); save(); render(); }
    };
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    canvas.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-a]");
      const el = e.target.closest(".nb-note");
      if (b && el) {
        const n = byId(+el.dataset.id);
        snap();
        if (b.dataset.a === "done") n.done = !n.done;
        else if (b.dataset.a === "col") n.color = ((n.color || 0) + 1) % COLORS;
        else if (b.dataset.a === "del") { S.notes = S.notes.filter((x) => x !== n); sel = null; }
        save(); render(); return;
      }
      const lh = e.target.closest("[data-lh]");
      if (lh && !e.target.closest("input")) { active = +lh.dataset.lh; canvas.querySelectorAll(".nb-lane").forEach((l, i) => l.classList.toggle("is-active", i === active)); }
    });
    canvas.addEventListener("dblclick", (e) => {
      const el = e.target.closest(".nb-note");
      if (el && !el.querySelector("textarea")) return edit(+el.dataset.id);
      const lh = e.target.closest("[data-lh]");
      if (lh) renameLane(+lh.dataset.lh);
    });

    // ---------- export ----------
    function markdown() {
      const day = new Date().toISOString().slice(0, 10);
      const out = [`# ${Deck.config?.title || document.title || "Presentation"} – notes (${day})`, ""];
      S.lanes.forEach((name, i) => {
        const ns = S.notes.filter((n) => laneOf(n) === i).sort((a, b) => a.y - b.y || a.x - b.x);
        if (!ns.length) return;
        out.push(`## ${name} (${ns.length})`, "");
        for (const n of ns) {
          const lines = n.text.split("\n");
          const ref = `_(slide ${n.slide + 1} · ${Deck.slides[n.slide]?.title || ""} · ${hhmm(n.t)})_`;
          out.push(`- [${n.done ? "x" : " "}] ${lines[0]}${lines.length === 1 ? " " + ref : ""}`);
          lines.slice(1).forEach((l, k) => out.push(`  ${l}${k === lines.length - 2 ? " " + ref : ""}`));
        }
        out.push("");
      });
      if (out.length === 2) out.push("_No notes._", "");
      return out.join("\n");
    }
    function download() {
      const slug = (location.pathname.split("/").filter(Boolean).slice(-2, -1)[0] || "deck").replace(/[^\w-]+/g, "-");
      const blob = new Blob([markdown()], { type: "text/markdown;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${slug}-notes-${new Date().toISOString().slice(0, 10)}.md`;
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }
    async function copy(btn) {
      const text = markdown();
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement("textarea"); ta.value = text; document.body.append(ta); ta.select();
        try { document.execCommand("copy"); } catch (__) {} ta.remove();
      }
      const old = btn.textContent; btn.textContent = "Copied ✓"; setTimeout(() => (btn.textContent = old), 1400);
    }

    // ---------- buttons ----------
    modal.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-act]");
      if (!b) { if (e.target === modal) hide(); return; }
      const a = b.dataset.act;
      if (a !== "clear" && armClear) { armClear = 0; render(); }
      if (a === "new") addNote();
      else if (a === "lane+") { if (S.lanes.length < MAX_LANES) { snap(); S.lanes.push("Lane " + (S.lanes.length + 1)); save(); render(); } }
      else if (a === "lane-") {
        const last = S.lanes.length - 1;
        if (last > 0 && !S.notes.some((n) => laneOf(n) === last)) { snap(); S.lanes.pop(); active = Math.min(active, S.lanes.length - 1); save(); render(); }
      }
      else if (a === "undo") doUndo();
      else if (a === "md") download();
      else if (a === "copy") copy(b);
      else if (a === "clear") {
        if (!armClear) { armClear = setTimeout(() => { armClear = 0; render(); }, 3000); render(); }
        else { clearTimeout(armClear); armClear = 0; snap(); S.notes = []; sel = null; save(); render(); }
      }
      else if (a === "close") hide();
    });

    // ---------- keys while the board is open ----------
    function trap(e) {
      if (!open) return false;
      if (e.ctrlKey || e.metaKey || e.altKey) {
        if ((e.key === "z" || e.key === "Z") && !e.shiftKey) { doUndo(); return true; }
        return false; // browser shortcuts keep working
      }
      const k = e.key;
      if (k === "n" || k === "N") { hide(); return true; }
      if (k === "Enter") { if (sel && byId(sel) && e.shiftKey) edit(sel); else addNote(); return true; }
      if (k === "Delete" || k === "Backspace") { if (sel) { snap(); S.notes = S.notes.filter((x) => x.id !== sel); sel = null; save(); render(); } return true; }
      if (/^[1-5]$/.test(k) && +k <= S.lanes.length) { active = +k - 1; render(); return true; }
      if (k === "Tab") { active = (active + (e.shiftKey ? S.lanes.length - 1 : 1)) % S.lanes.length; render(); return true; }
      if (k === "u" || k === "U") { doUndo(); return true; }
      if (k === "e" || k === "E") { download(); return true; }
      if (k === " " && sel) { const n = byId(sel); if (n) { snap(); n.done = !n.done; save(); render(); } return true; }
      if (k.startsWith("Arrow") && sel) {
        const n = byId(sel); if (!n) return true;
        snap();
        const d = { ArrowLeft: [-GRID * 2, 0], ArrowRight: [GRID * 2, 0], ArrowUp: [0, -GRID * 2], ArrowDown: [0, GRID * 2] }[k];
        n.x = Math.max(0, Math.min(CW - NW, n.x + d[0])); n.y = Math.max(HEAD, n.y + d[1]);
        save(); render(); return true;
      }
      return true; // swallow everything else so the slide underneath never moves
    }

    function show() {
      if (open) return;
      open = true; armClear = 0;
      if (active >= S.lanes.length) active = 0;
      Deck.tools?.off?.();
      render();
      modal.hidden = false;
      Deck.pushLayer("notes", hide);
      Deck.keyTrap = trap;
      Deck.animate?.(modal.firstElementChild, "zoom", "in", { duration: 220 });
    }
    function hide() {
      if (!open) return;
      document.activeElement?.blur?.();
      open = false; editing = null;
      modal.hidden = true;
      Deck.popLayer("notes");
      if (Deck.keyTrap === trap) Deck.keyTrap = null;
    }
    const toggle = () => (open ? hide() : show());
    Deck.notes = {
      toggle, show, hide, markdown, get open() { return open; },
      get count() { return S.notes.length; },
      add(text, lane = 0) { snap(); const [x, y] = freeSpot(lane); S.notes.push({ id: S.seq++, text: String(text), x, y, color: lane % COLORS, done: false, slide: Deck.state.index, t: Date.now() }); save(); if (open) render(); },
    };
    Deck.addKeys(["n"], toggle, "Notes board: Q&A, feedback, follow-ups", "Notes");
  });
})();
