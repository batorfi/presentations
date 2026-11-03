/* Typewriter — a paragraph types itself out character by character, with a cursor, like a person at a keyboard.
 * Meant for the one slide where the words are the message: a quote, a principle, a short statement.
 *
 *   <div class="s-typewriter" data-size="l" data-cps="16" data-width="62%">
 *     <p>Code is cheap now. **Judgement** is not.</p>
 *     <p>Write the second paragraph as another <p>.<br>Use a line break for a new line.</p>
 *     <cite>Someone Wise, Somewhere</cite>                          (optional attribution, typed last)
 *   </div>
 *
 *   data-size="s|m|l|xl"        text size 36 / 48 / 68 / 96 px (default m).  data-font-size="56" sets exact pixels.
 *   data-cps="16"               typing speed in characters per second (2 to 120, default 16)
 *   data-rhythm="steady"        an even pace (default "natural": small variation per key, longer pauses at commas,
 *                               full stops, line breaks and paragraphs; the same every time, so it can be rehearsed)
 *   data-width="62%"            width of the text panel: any CSS length (default 100%).  data-align="center" centres it
 *   data-text-align="center"    alignment of the text inside the panel (left, center, right)
 *   data-font="serif|sans|mono" typeface (default: the deck's display face). data-style="bar|panel|rail" frames it
 *   data-delay="400"            pause in ms after the slide has settled before the first key (default 300)
 *   data-cursor="bar|block|underscore|none"   cursor shape (default bar).  data-cursor-end="hide" removes it when done
 *   data-replay="off"           when the slide is shown again, show the finished text instead of typing it again
 *   data-skip="off"             do not let the next-key finish the typing early
 *
 * Inline emphasis: **double stars**, or <em>, <strong>, <b>, <i>, <mark>, <span class="…"> inside the text; the markup is
 * never typed as characters. An element that is <cite>, <footer> or class="s-tw-by" is the attribution.
 * Several typewriters on one slide type one after the other, each after its own data-delay.
 *
 * Keys: the next-key (→, space, Page Down, Enter) while typing finishes the text at once; the next press moves on.
 * Y types the slide's text again. Reduced motion shows the finished text immediately.
 *
 * How it works: the whole text is laid out from the start, the part not typed yet is just invisible, so nothing ever
 * reflows or jumps while typing. One timeline of key times is computed up front, so the speed does not depend on the
 * frame rate and skipping is instant. Screen readers get the full text. Deck.typewriter reports the state. */
(function () {
  "use strict";

  Deck.on("ready", () => {
    const found = [];
    for (let i = 0; i < Deck.slides.length; i++) for (const el of Deck.slideEl(i).querySelectorAll(".s-typewriter")) found.push([el, i]);
    if (!found.length) return;
    const { cssNumber } = Deck.helpers;
    const num = (v, d) => (Number.isFinite(+v) && v !== "" && v != null ? +v : d);
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const reduced = () => Deck.context(Deck.state.index).reduced();
    const BLOCK = /^(P|DIV|CITE|FOOTER|BLOCKQUOTE|LI|H[1-6]|FIGCAPTION)$/;

    // ---------- build: split every text node into "typed" and "not yet typed" ----------
    function build(el, slide) {
      const d = el.dataset;
      // **bold** shorthand
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const raw = [];
      while (walker.nextNode()) raw.push(walker.currentNode);
      for (const t of raw) {
        if (!t.data.includes("**")) continue;
        const frag = document.createDocumentFragment();
        t.data.split(/\*\*(.+?)\*\*/g).forEach((part, k) => {
          if (!part) return;
          if (k % 2) { const s = document.createElement("strong"); s.textContent = part; frag.append(s); }
          else frag.append(document.createTextNode(part));
        });
        t.replaceWith(frag);
      }
      // bare text with no block child counts as one paragraph
      if (![...el.children].some((c) => BLOCK.test(c.tagName))) {
        const p = document.createElement("p");
        p.append(...el.childNodes);
        el.append(p);
      }
      // wrap the typing structure; screen readers get the plain text instead
      const body = document.createElement("div");
      body.className = "s-tw-body";
      body.setAttribute("aria-hidden", "true");
      body.append(...el.childNodes);
      el.append(body);
      const plain = [...body.children].map((c) => c.textContent.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
      const sr = document.createElement("span");
      sr.className = "s-tw-sr";
      sr.textContent = plain;
      el.append(sr);
      for (const c of body.children) if (/^(CITE|FOOTER)$/.test(c.tagName) || c.classList.contains("s-tw-by")) c.classList.add("s-tw-by");

      // text nodes in order, normalised (whitespace collapsed, edges of a block or line trimmed); <br> are pauses
      const nodes = [];           // { node, rest, full, start, block }
      const marks = [];           // { at, kind } pauses inserted before character index `at`
      const blockOf = (n) => { for (let e = n.parentElement; e && e !== body; e = e.parentElement) if (e.parentElement === body) return e; return null; };
      const seq = [];
      const w = document.createTreeWalker(body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const n = w.currentNode;
        if (n.nodeType === 3) seq.push({ n, block: blockOf(n) });
        else if (n.tagName === "BR") seq.push({ br: true, block: blockOf(n) });
      }
      let count = 0, prevBlock = null;
      seq.forEach((it, i) => {
        if (it.br) { marks.push({ at: count, kind: "br" }); return; }
        const before = seq[i - 1], after = seq[i + 1];
        const startEdge = !before || before.br || before.block !== it.block;
        const endEdge = !after || after.br || after.block !== it.block;
        let text = it.n.data.replace(/\s+/g, " ");
        if (startEdge) text = text.replace(/^ /, "");
        if (endEdge) text = text.replace(/ $/, "");
        if (it.block !== prevBlock) { if (prevBlock) marks.push({ at: count, kind: it.block && it.block.classList.contains("s-tw-by") ? "by" : "para" }); prevBlock = it.block; }
        if (!text) { it.n.remove(); return; }
        nodes.push({ node: it.n, full: text, start: count, block: it.block });
        count += text.length;
      });
      for (const o of nodes) { o.node.data = ""; o.rest = document.createElement("span"); o.rest.className = "s-tw-rest"; o.rest.textContent = o.full; o.node.after(o.rest); }
      const caret = document.createElement("span");
      caret.className = "s-tw-caret";
      caret.setAttribute("aria-hidden", "true");
      el.append(caret);

      // style hooks
      el.dataset.cursor = d.cursor || "bar";
      if (d.size) el.dataset.size = d.size;
      if (d.fontSize) el.style.setProperty("--tw-size", `${+d.fontSize}px`);
      if (d.width) el.style.width = d.width;
      if (d.align === "center") el.style.marginInline = "auto";
      else if (d.align === "right") el.style.marginInlineStart = "auto";
      if (d.textAlign) el.style.textAlign = d.textAlign;

      return { el, slide, nodes, marks, total: count, caret, typed: 0, cur: 0, times: null, state: "idle", t0: 0, seen: false };
    }

    // ---------- the timeline: when each character is typed ----------
    function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
    function rng(seed) { let a = seed; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
    function timeline(m) {
      const d = m.el.dataset;
      const b = 1000 / clamp(num(d.cps, 16), 2, 120);
      const natural = d.rhythm !== "steady";
      const rand = rng(hash(m.nodes.map((n) => n.full).join("|")));
      const chars = m.nodes.map((n) => n.full).join("");
      const gap = new Map();
      for (const k of m.marks) gap.set(k.at, (gap.get(k.at) || 0) + (k.kind === "br" ? 9 : k.kind === "by" ? 18 : 14) * b);
      const t = new Float64Array(m.total);
      let now = 0;
      for (let i = 0; i < m.total; i++) {
        const c = chars[i], prev = chars[i - 1];
        let step = b;
        if (natural) {
          step = b * (c === " " ? 0.8 : 1) * (1 + (rand() - 0.5) * 0.7);
          if (rand() < 0.025) step += b * 3.5;           // a small hesitation
          if (prev === "," || prev === ";" || prev === ":") step += b * 3.5;
          else if (/[.!?]/.test(prev || "") && c === " ") step += b * 7;
          else if (prev === "…") step += b * 8;
          else if (prev === "—" || prev === "–") step += b * 3;
          if (gap.has(i)) step += gap.get(i);
        } else if (gap.has(i)) step += gap.get(i) * 0.5;
        now += Math.max(8, step);
        t[i] = now;
      }
      return t;
    }

    // ---------- render ----------
    function show(m, n) {
      n = clamp(n, 0, m.total);
      if (n === m.typed && m.drawn) return;
      m.drawn = true;
      m.typed = n;
      let cur = 0;
      for (let k = 0; k < m.nodes.length; k++) {
        const o = m.nodes[k];
        const len = clamp(n - o.start, 0, o.full.length);
        if (len !== o.len) {
          o.len = len;
          o.node.data = o.full.slice(0, len);
          o.rest.firstChild.data = o.full.slice(len);
        }
        if (o.start < n) cur = k; // the cursor follows the last typed character
      }
      place(m, cur);
    }
    /** The cursor is placed from the measured position of the last typed character, so it follows the text in every
     *  browser and across lines, whatever the markup around it. It lives in the panel and moves by transform only. */
    function place(m, cur) {
      const o = m.nodes[cur];
      if (!o) return;
      const r = document.createRange();
      let rect = null, atRight = true;
      if (m.typed > 0 && o.len > 0) {
        r.setStart(o.node, o.len - 1); r.setEnd(o.node, o.len);
        const rs = r.getClientRects(); rect = rs[rs.length - 1];
      } else if (o.rest.firstChild && o.rest.firstChild.data.length) {
        r.setStart(o.rest.firstChild, 0); r.setEnd(o.rest.firstChild, 1);
        rect = r.getClientRects()[0]; atRight = false;
      }
      if (!rect || (!rect.width && !rect.height)) return;
      const er = m.el.getBoundingClientRect(), sx = er.width / (m.el.offsetWidth || 1) || 1;
      const x = ((atRight ? rect.right : rect.left) - er.left) / sx - m.el.clientLeft;
      let y = (rect.top - er.top) / sx - m.el.clientTop, h = rect.height / sx;
      const c = m.caret.style;
      if (m.el.dataset.cursor === "underscore") { y += h - 0.12 * parseFloat(getComputedStyle(m.el).fontSize); c.height = ""; }
      else c.height = `${h}px`;
      c.transform = `translate3d(${x}px,${y}px,0)`;
    }
    function paint(m) { m.el.classList.toggle("is-typing", m.state === "typing"); m.el.classList.toggle("is-done", m.state === "done"); m.el.classList.toggle("is-waiting", m.state === "armed"); m.el.classList.toggle("is-last", running[running.length - 1] === m); }
    function finish(m) { show(m, m.total); m.state = "done"; m.seen = true; paint(m); }
    function reset(m) { m.state = "idle"; m.o = null; for (const o of m.nodes) o.len = -1; m.drawn = false; show(m, 0); paint(m); }

    // ---------- run ----------
    let running = [], raf = 0, queueIdx = 0, slideStart = 0;
    const list = [];
    function arm(index, delayExtra) {
      running = list.filter((m) => m.slide === index);
      for (const m of running) reset(m);
      queueIdx = 0;
      if (!running.length) return;
      if (reduced() || (running[0].el.dataset.replay === "off" && running.every((m) => m.seen))) { running.forEach(finish); return; }
      const settle = cssNumber("--deck-slide-ms", 700) * 0.85;
      slideStart = performance.now() + settle + (delayExtra || 0);
      startNext(slideStart);
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function startNext(at) {
      while (queueIdx < running.length) {
        const m = running[queueIdx];
        if (m.state === "done") { queueIdx++; continue; }
        m.times = m.times || timeline(m);
        m.t0 = at + num(m.el.dataset.delay, 300);
        m.state = "armed"; paint(m);
        return;
      }
    }
    function tick(now) {
      raf = 0;
      const m = running[queueIdx];
      if (!m) return;
      if (now >= m.t0) {
        if (m.state === "armed") { m.state = "typing"; paint(m); }
        const el = now - m.t0, t = m.times;
        let n = m.typed;
        while (n < m.total && t[n] <= el) n++;
        if (n !== m.typed) show(m, n);
        if (n >= m.total) {
          finish(m);
          queueIdx++;
          // the next typewriter starts after this one's last key
          startNext(now);
        }
      }
      raf = requestAnimationFrame(tick);
    }
    function complete() {
      let any = false;
      for (const m of running) if (m.state !== "done") { finish(m); any = true; }
      queueIdx = running.length;
      return any;
    }

    for (const [el, i] of found) list.push(build(el, i));
    const replace = () => running.forEach((m) => { m.drawn = false; show(m, m.typed); });
    Deck.on("resize", replace);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(replace);
    Deck.on("slidechange", ({ index }) => { if (raf) { cancelAnimationFrame(raf); raf = 0; } list.some((m) => m.slide === index) ? arm(index) : (running = []); });
    Deck.on("settings", ({ key }) => key === "reducedMotion" && complete());
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || Deck.hasLayer()) return;
      if (!["ArrowRight", " ", "PageDown", "ArrowDown", "Enter"].includes(e.key)) return;
      if (!running.some((m) => m.state !== "done" && m.el.dataset.skip !== "off")) return;
      complete();
      e.preventDefault(); e.stopImmediatePropagation();
    }, true);
    Deck.addKeys(["y"], () => arm(Deck.state.index, 0), "Type the text on this slide again", "Pictures");
    Deck.typewriter = {
      replay: () => arm(Deck.state.index, 0),
      complete,
      state: () => running.map((m) => ({ state: m.state, typed: m.typed, total: m.total, text: m.nodes.map((n) => n.node.data).join("") })),
    };
  });
})();
