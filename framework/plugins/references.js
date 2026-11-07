/* References — sources, readings, videos, repos and related material for a deck.
 * Three parts: a generated slide (categories stacked vertically), an overlay that also works on a phone, and
 * citation markers [n] that any slide element can carry. Offline: no fonts, libraries or requests.
 *
 *   <script src="../../references/adlc.js"></script>               <!-- the list (data), before the deck config -->
 *   <script src="../../framework/plugins/references.js"></script>
 *   Deck.configure({ references: "adlc" })                          <!-- slug in window.DeckReferences, or the object -->
 *   <span data-ref="graphrag">…text…</span>                        <!-- on a slide: adds a clickable marker [n] -->
 *   Deck.referencesSlide({ section: "close" })                      <!-- slide(s) from the list; long lists continue on more slides -->
 *
 * Data shape (text is a string or { en, hu }):
 *   window.DeckReferences["adlc"] = { title, categories: [{ id, label, icon?, items: [{ id, title, desc, url, placeholder? }] }] }
 * Category ids with a built-in icon: sources readings videos repos tools other.
 * Opens with Shift+R, the right-click menu, a click on a marker or the "Links" button of the slide. Esc or Shift+R closes.
 * The overlay lists the items cited on the current slide first ("This slide"), copies all links, exports Markdown.
 * API: Deck.references.open(id?) / close() / toggle() / markdown() / items */
(function () {
  "use strict";
  const resolve = (c) => (typeof c === "string" ? (window.DeckReferences || {})[c] : c);
  const L = (x, lang) => (x == null ? "" : typeof x === "string" ? x : x[lang] || x.en || "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const host = (u) => String(u || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const safe = (u) => (/^https?:\/\//i.test(u) ? u : "#");
  const T = {
    en: { title: "References", kicker: "Sources and further reading", close: "Close", all: "All", slide: "This slide", copy: "Copy all links", copied: "Copied ✓", md: "Export Markdown",
      cited: "Cited on", more: "continued", ph: "Placeholder", open: "Open", links: "Links", none: "No references in this deck yet." },
    hu: { title: "Hivatkozások", kicker: "Források és további olvasnivaló", close: "Bezár", all: "Mind", slide: "Ez a dia", copy: "Linkek másolása", copied: "Másolva ✓", md: "Markdown export",
      cited: "Hivatkozva itt", more: "folytatás", ph: "Helyőrző", open: "Megnyitás", links: "Linkek", none: "Ebben a prezentációban még nincs hivatkozás." },
  };
  const ICON = {
    sources: '<path d="M6 3.5h8l4 4V20.5H6z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h6"/>',
    readings: '<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5v13c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/>',
    videos: '<rect x="3" y="5.5" width="18" height="13" rx="3"/><path d="M10.5 9.5v5l4.5-2.5z"/>',
    repos: '<path d="M8.5 8L4 12l4.5 4M15.5 8L20 12l-4.5 4M13.5 6l-3 12"/>',
    tools: '<path d="M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>',
    other: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  };
  const ico = (n, s = 26) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n] || ICON.other}</svg>`;

  // flat list with a stable number per item: the order of the data
  function flatten(R) {
    const items = [];
    (R.categories || []).forEach((c) => (c.items || []).forEach((it) => items.push(Object.assign({ n: items.length + 1, cat: c }, it))));
    return items;
  }

  // ---------- slides generated from the list ----------
  Deck.referencesSlide = (o = {}) => {
    const R = resolve(o.references || Deck.config?.references);
    if (!R) { console.warn("referencesSlide: no list (set Deck.configure({ references }) before the slide files)"); return; }
    const lang = o.lang || "en", t = T[lang], perRow = o.perRow || 3, maxRows = o.maxRows || 3;
    const all = flatten(R), numOf = new Map(all.map((i) => [i.id, i.n]));
    // bands: one band per row of up to perRow cards; a category continues on the next band or slide
    const bands = [];
    (R.categories || []).forEach((c) => {
      const items = c.items || [];
      for (let i = 0; i < items.length; i += perRow) bands.push({ cat: c, items: items.slice(i, i + perRow), first: i === 0 });
    });
    const pages = [];
    for (let i = 0; i < bands.length; i += maxRows) pages.push(bands.slice(i, i + maxRows));
    if (!pages.length) pages.push([]);
    pages.forEach((page, pi) => {
      const card = (it) => `<a class="ref-card" href="${esc(safe(it.url))}" target="_blank" rel="noopener" data-ref-card="${esc(it.id)}">
          <span class="ref-n">${numOf.get(it.id)}</span>
          <b class="ref-t">${esc(L(it.title, lang))}</b>
          <span class="ref-d">${esc(L(it.desc, lang))}</span>
          <span class="ref-u">${it.placeholder ? `<em>${esc(t.ph)}</em> ` : ""}${esc(host(it.url))}</span></a>`;
      const rows = page.map((b, bi) => `<div class="ref-band" data-anim="up" data-delay="${bi * 120}">
          <div class="ref-cat">${ico(b.cat.icon || b.cat.id, 30)}<span>${esc(L(b.cat.label, lang))}${b.first ? "" : ` <small>(${esc(t.more)})</small>`}</span></div>
          <div class="ref-row" style="--cols:${perRow}">${b.items.map(card).join("")}</div></div>`).join("");
      Deck.slide({
        id: (o.id || "references") + (pi ? "-" + (pi + 1) : ""), section: o.section || "close",
        title: (o.title || L(R.title, lang) || t.title) + (pages.length > 1 ? ` ${pi + 1}/${pages.length}` : ""), navTitle: o.navTitle || t.title, className: "ref-slide",
        html: `<div class="ref-head"><p class="s-kicker" data-anim="fade">${esc(o.kicker || t.kicker)}</p>
            <button class="ref-all" data-ref-open="" type="button">${esc(t.links)} · Shift+R</button></div>
          <div class="ref-bands">${rows || `<p class="s-body">${esc(t.none)}</p>`}</div>`,
        notes: o.notes || "References for this session. The same list opens on any device from the right-click menu or Shift+R, and every card is a link in the published deck.",
      });
    });
  };

  const style = document.createElement("style");
  style.textContent = `
.ref-mark{all:unset;box-sizing:border-box;cursor:pointer;display:inline-block;margin-left:.3em;padding:0 .38em;font:700 .56em/1.55 var(--deck-font-mono);vertical-align:.45em;border-radius:6px;background:var(--deck-accent-subtle);color:var(--deck-accent);border:1px solid color-mix(in srgb,var(--deck-accent) 40%,transparent)}
.ref-mark:hover,.ref-mark:focus-visible{background:var(--deck-accent);color:var(--deck-on-accent)}.ref-mark:focus-visible{outline:3px solid var(--deck-focus);outline-offset:2px}
.ref-slide .ref-bands{display:flex;flex-direction:column;gap:22px;margin-top:6px}
.ref-band{display:grid;grid-template-columns:230px minmax(0,1fr);gap:28px;align-items:stretch;padding-top:18px;border-top:2px solid var(--deck-border)}
.ref-cat{display:flex;align-items:center;gap:14px;color:var(--deck-accent);font:700 30px/1.15 var(--deck-font-display)}
.ref-cat span{color:var(--deck-text);padding-top:2px}.ref-cat small{font:500 20px var(--deck-font-sans);color:var(--deck-muted)}.ref-cat svg{flex:none}
.ref-row{display:grid;grid-template-columns:repeat(var(--cols,3),minmax(0,1fr));gap:20px}
.ref-card{position:relative;display:flex;flex-direction:column;gap:6px;padding:18px 22px 16px 22px;border-radius:18px;background:var(--deck-raised);border:1px solid var(--deck-border);text-decoration:none;color:inherit;min-height:176px}
.ref-card:hover,.ref-card:focus-visible{border-color:var(--deck-accent)}.ref-card:focus-visible{outline:3px solid var(--deck-focus);outline-offset:3px}
.ref-n{position:absolute;right:16px;top:14px;font:700 18px var(--deck-font-mono);color:var(--deck-muted)}
.ref-t{font:700 27px/1.28 var(--deck-font-display);padding-right:34px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ref-d{font-size:21px;line-height:1.35;color:var(--deck-text-2);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.ref-u{margin-top:auto;font:500 18px var(--deck-font-mono);color:var(--deck-accent);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ref-u em{font-style:normal;font-weight:700;color:var(--deck-warn,var(--deck-muted));border:1px solid currentColor;border-radius:6px;padding:0 6px;margin-right:6px}
.ref-head{display:flex;align-items:baseline;justify-content:space-between;gap:24px}.ref-head .s-kicker{margin:0}
.ref-all{all:unset;box-sizing:border-box;cursor:pointer;font:600 18px var(--deck-font-mono);color:var(--deck-muted);padding:4px 10px;border-radius:8px}
.ref-all:hover,.ref-all:focus-visible{color:var(--deck-accent)}.ref-all:focus-visible{outline:3px solid var(--deck-focus)}

.ref{position:fixed;inset:0;z-index:100000;display:none;font-family:var(--deck-font-sans);color:var(--deck-text);font-size:17px;line-height:1.5;-webkit-text-size-adjust:100%}
.ref.is-open{display:block}.ref *{box-sizing:border-box}
.ref-scrim{position:absolute;inset:0;background:color-mix(in srgb,var(--deck-rail) 64%,transparent);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:refFade .3s both}
.ref-panel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(980px,calc(100vw - 32px));height:min(820px,calc(100vh - 32px));height:min(820px,calc(100dvh - 32px));display:flex;flex-direction:column;
 background:var(--deck-bg);border:1px solid var(--deck-border);border-radius:24px;box-shadow:var(--deck-shadow-menu);overflow:hidden;animation:refIn .4s var(--deck-ease-out,ease) both;outline:0}
.ref-bar{display:flex;align-items:center;gap:12px;padding:14px 22px;border-bottom:1px solid var(--deck-border);background:var(--deck-raised)}
.ref-bar-t{font:600 13px var(--deck-font-sans);letter-spacing:.14em;text-transform:uppercase;color:var(--deck-accent)}
.ref-bar-r{margin-left:auto;display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.ref-btn{display:inline-flex;align-items:center;gap:8px;font:600 15px var(--deck-font-sans);color:var(--deck-text);background:var(--deck-bg);border:1px solid var(--deck-border-strong);border-radius:999px;padding:8px 16px;cursor:pointer;white-space:nowrap}
.ref-btn:hover{border-color:var(--deck-accent);color:var(--deck-accent)}.ref-btn:focus-visible{outline:3px solid var(--deck-focus);outline-offset:2px}
.ref-btn[aria-pressed="true"]{background:var(--deck-accent-subtle);border-color:var(--deck-accent);color:var(--deck-accent)}.ref-x{padding:6px 14px;font-size:22px;line-height:1}
.ref-body{flex:1;overflow-y:auto;padding:8px 32px 40px;scroll-behavior:smooth}
.ref-sec{margin-top:26px}.ref-sec h2{display:flex;align-items:center;gap:12px;margin:0 0 6px;font:700 13px var(--deck-font-sans);letter-spacing:.14em;text-transform:uppercase;color:var(--deck-accent)}
.ref-sec h2::after{content:"";flex:1;height:1px;background:var(--deck-border)}
.ref-item{display:grid;grid-template-columns:34px minmax(0,1fr);gap:4px 14px;padding:14px 14px;margin:0 -14px;border-radius:14px;text-decoration:none;color:inherit;border:1px solid transparent}
.ref-item:hover{background:var(--deck-raised)}.ref-item:focus-visible{outline:3px solid var(--deck-focus);outline-offset:-3px}
.ref-item.is-hit{background:var(--deck-accent-subtle);border-color:color-mix(in srgb,var(--deck-accent) 45%,transparent);animation:refPulse 1.6s ease-out 1}
.ref-item>*{grid-column:2}.ref-item .n{grid-column:1;grid-row:1/5;font:700 15px var(--deck-font-mono);color:var(--deck-muted);padding-top:3px}
.ref-item b{font:700 20px/1.25 var(--deck-font-display)}.ref-item span.d{color:var(--deck-text-2)}
.ref-item .u{font:500 14.5px var(--deck-font-mono);color:var(--deck-accent);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ref-item .u em{font-style:normal;font-weight:700;color:var(--deck-warn,var(--deck-muted));border:1px solid currentColor;border-radius:6px;padding:0 6px;margin-right:6px}
.ref-item .c{font-size:13.5px;color:var(--deck-muted)}.ref-item .c button{all:unset;cursor:pointer;color:var(--deck-accent);text-decoration:underline;text-underline-offset:2px;margin-right:8px}
.ref-item .c button:focus-visible{outline:2px solid var(--deck-focus)}
.ref-empty{margin:40px 0;color:var(--deck-muted)}
@keyframes refIn{from{opacity:0;transform:translate(-50%,-47%) scale(.97)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
@keyframes refFade{from{opacity:0}to{opacity:1}}@keyframes refPulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--deck-accent) 50%,transparent)}100%{box-shadow:0 0 0 14px transparent}}
@media (max-width:860px){.ref-panel{left:0;top:0;transform:none;width:100vw;height:100vh;height:100dvh;border-radius:0;border:0;animation:refFade .25s both}
 .ref-bar{padding:10px 14px;flex-wrap:wrap}.ref-body{padding:4px 18px 40px}}
@media (prefers-reduced-motion:reduce){.ref *,.ref-panel{animation:none!important;transition:none!important}}
[data-reduced-motion] .ref *,[data-reduced-motion] .ref-panel{animation:none!important;transition:none!important}
`;
  document.head.append(style);

  Deck.on("ready", () => {
    const R = resolve(Deck.config?.references);
    if (!R) return;
    const lang = (() => { try { return localStorage.getItem("deck.speaker.lang") === "hu" ? "hu" : "en"; } catch (_) { return "en"; } })();
    const t = T[lang], items = flatten(R), byId = new Map(items.map((i) => [i.id, i]));
    if (items.some((i) => i.placeholder)) console.warn("references: the list still contains placeholder entries");
    let open = false, onlySlide = false, hit = "", lastFocus = null;

    // which slides cite which item (data-ref="a,b" anywhere on a slide)
    const cites = new Map(); // id -> [slide index]
    Deck.slides.forEach((s, si) => {
      const el = Deck.slideEl(si);
      if (!el) return;
      el.querySelectorAll("[data-ref]").forEach((m) => {
        const ids = m.dataset.ref.split(/[\s,]+/).filter(Boolean);
        ids.forEach((id) => { if (!byId.has(id)) { console.warn(`references: unknown id "${id}" on slide ${si + 1}`); return; } if (!(cites.get(id) || []).includes(si)) cites.set(id, [...(cites.get(id) || []), si]); });
        m.insertAdjacentHTML("beforeend", ids.filter((id) => byId.has(id)).map((id) => `<button class="ref-mark" type="button" data-ref-open="${esc(id)}" aria-label="${esc(t.title)} ${byId.get(id).n}: ${esc(L(byId.get(id).title, lang))}">${byId.get(id).n}</button>`).join(""));
      });
    });
    const here = () => items.filter((i) => (cites.get(i.id) || []).includes(Deck.state.index));

    const root = document.createElement("div");
    root.className = "ref"; root.setAttribute("data-ref-root", "");
    document.body.append(root);

    function itemHtml(it) {
      const s = (cites.get(it.id) || []).map((si) => `<button type="button" data-ref-go="${si}">${si + 1}</button>`).join("");
      return `<a class="ref-item${it.id === hit ? " is-hit" : ""}" id="ref-${esc(it.id)}" href="${esc(safe(it.url))}" target="_blank" rel="noopener">
        <span class="n">${it.n}</span><b>${esc(L(it.title, lang))}</b>
        <span class="d">${esc(L(it.desc, lang))}</span>
        <span class="u">${it.placeholder ? `<em>${esc(t.ph)}</em>` : ""}${esc(host(it.url))}</span>
        ${s ? `<span class="c">${esc(t.cited)}: ${s}</span>` : ""}</a>`;
    }
    function render() {
      const cur = here();
      const list = onlySlide ? cur : items;
      const sections = (R.categories || []).map((c) => {
        const its = list.filter((i) => i.cat === c);
        return its.length ? `<section class="ref-sec"><h2>${ico(c.icon || c.id, 18)}${esc(L(c.label, lang))}</h2>${its.map(itemHtml).join("")}</section>` : "";
      }).join("");
      root.innerHTML = `
        <div class="ref-scrim" data-ref-do="close"></div>
        <section class="ref-panel" role="dialog" aria-modal="true" aria-label="${esc(t.title)}" tabindex="-1">
          <header class="ref-bar"><span class="ref-bar-t">${esc(L(R.title, lang) || t.title)}</span>
            <div class="ref-bar-r">
              ${cur.length ? `<button class="ref-btn" data-ref-do="filter" aria-pressed="${onlySlide}">${esc(t.slide)} (${cur.length})</button>` : ""}
              <button class="ref-btn" data-ref-do="copy">${esc(t.copy)}</button>
              <button class="ref-btn" data-ref-do="md">${esc(t.md)}</button>
              <button class="ref-btn ref-x" data-ref-do="close" aria-label="${esc(t.close)}">×</button></div></header>
          <div class="ref-body">${sections || `<p class="ref-empty">${esc(t.none)}</p>`}</div>
        </section>`;
    }
    const focusables = () => [...root.querySelectorAll("a[href],button")].filter((el) => el.offsetParent !== null);
    function show(id) {
      hit = id && byId.has(id) ? id : "";
      onlySlide = false;
      if (!open) { open = true; lastFocus = document.activeElement; Deck.pushLayer("references", hide); Deck.keyTrap = trap; }
      render();
      root.classList.add("is-open");
      const target = hit && root.querySelector("#ref-" + CSS.escape(hit));
      if (target) { target.scrollIntoView({ block: "center" }); target.focus({ preventScroll: true }); }
      else (root.querySelector(".ref-x") || root).focus({ preventScroll: true });
    }
    function hide() {
      if (!open) return;
      open = false; hit = "";
      root.classList.remove("is-open");
      Deck.popLayer("references");
      if (Deck.keyTrap === trap) Deck.keyTrap = null;
      try { lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); } catch (_) {}
    }
    const toggle = () => (open ? hide() : show());
    function trap(e) {
      if (!open || e.ctrlKey || e.metaKey || e.altKey || e.key === "Tab") return false;
      (root.querySelector(".ref-x") || root).focus({ preventScroll: true });
      return true;
    }
    function markdown() {
      const out = [`# ${L(R.title, lang) || t.title}`, ""];
      (R.categories || []).forEach((c) => {
        if (!(c.items || []).length) return;
        out.push(`## ${L(c.label, lang)}`, "");
        c.items.forEach((i) => out.push(`- [${L(i.title, lang)}](${i.url})${L(i.desc, lang) ? " — " + L(i.desc, lang) : ""}`));
        out.push("");
      });
      return out.join("\n");
    }
    async function copyAll(btn) {
      const text = items.map((i) => `${L(i.title, lang)}\n${i.url}`).join("\n\n");
      try { await navigator.clipboard.writeText(text); }
      catch (_) { const ta = document.createElement("textarea"); ta.value = text; document.body.append(ta); ta.select(); try { document.execCommand("copy"); } catch (__) {} ta.remove(); }
      const old = btn.textContent; btn.textContent = t.copied; setTimeout(() => (btn.textContent = old), 1400);
    }
    function download() {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([markdown()], { type: "text/markdown;charset=utf-8" }));
      a.download = "references.md";
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }

    root.addEventListener("click", (e) => {
      const go = e.target.closest("[data-ref-go]");
      if (go) { e.preventDefault(); e.stopPropagation(); const i = +go.dataset.refGo; hide(); Deck.go(i, 0); return; }
      const b = e.target.closest("[data-ref-do]");
      if (!b) return;
      const a = b.dataset.refDo;
      if (a === "close") hide();
      else if (a === "filter") { onlySlide = !onlySlide; hit = ""; render(); root.querySelector('[data-ref-do="filter"]').focus(); }
      else if (a === "copy") copyAll(b);
      else if (a === "md") download();
    });
    root.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Escape") { e.preventDefault(); hide(); }
      else if ((e.key === "R") && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); hide(); }
      else if (e.key === "Tab") {
        const f = focusables(); if (!f.length) return;
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); }
      }
    });
    root.addEventListener("focusout", (e) => { if (open && !e.relatedTarget) setTimeout(() => open && !root.contains(document.activeElement) && (root.querySelector(".ref-x") || root).focus({ preventScroll: true }), 0); });
    // markers on slides and the "Links" button open the overlay; a click on a marker must not advance the slide
    document.addEventListener("click", (e) => {
      if (root.contains(e.target)) return;
      const m = e.target.closest("[data-ref-open]");
      if (m) { e.preventDefault(); e.stopPropagation(); show(m.dataset.refOpen); }
    }, true);
    Deck.addKeys(["Shift+r"], toggle, "References: sources, readings, videos, repos", "References");
    Deck.references = { open: show, close: hide, toggle, markdown, items, get isOpen() { return open; } };
  });
})();
