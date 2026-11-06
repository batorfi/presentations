/* QR code — a slide element that turns a link into a scannable code, drawn as inline SVG. Fully offline: the code is
 * computed in the browser (no library, no network), so it works from file:// and on GitHub Pages alike.
 *
 *   <div class="s-qr" data-qr="https://example.com/feedback" data-label="Scan to share feedback"></div>
 *
 *   data-qr="…"            the text to encode: a link, plain text, "mailto:a@b.c", "WIFI:T:WPA;S:name;P:pass;;" …  (required)
 *   data-label="…"         line shown above or beside the code (optional)
 *   data-caption="…"       small line under the code; default is the link without "https://" (data-caption="" hides it)
 *   data-size="460"        width of the code in px (default 460; keep ≥ 360 for a projector across a room)
 *   data-ecc="M"           error correction L / M / Q / H (default M; higher survives dirt and glare but makes a denser code)
 *   data-style="square|rounded|dots"   module shape (default square: the most reliable for scanners)
 *   data-layout="stack|side"   label above the code (default) or to its left
 *   data-anim / data-step      work on the element like on any other (e.g. data-anim="zoom")
 *
 * The code is always dark modules on a light card (a scanner needs that contrast, also in the dark theme).
 * Override with --deck-qr-ink / --deck-qr-paper in deck.css if you must; keep the contrast high.
 * API: Deck.qr.svg(text, { ecc, style, quiet }) → svg string · Deck.qr.matrix(text, ecc) → { size, version, get(x, y) }
 *      Deck.qr.render(el) draws or redraws an .s-qr element after you changed its data-* attributes. */
(function () {
  "use strict";

  // ===================== QR encoder (byte mode, versions 1–40, error correction L/M/Q/H) =====================
  const ECC_PER_BLOCK = [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  ];
  const NUM_BLOCKS = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
  ];
  const ECC_IDX = { L: 0, M: 1, Q: 2, H: 3 };
  const ECC_FORMAT = [1, 0, 3, 2]; // format bits for L, M, Q, H

  const rawModules = (v) => {
    let r = (16 * v + 128) * v + 64;
    if (v >= 2) { const a = Math.floor(v / 7) + 2; r -= (25 * a - 10) * a - 55; if (v >= 7) r -= 36; }
    return r;
  };
  const dataCodewords = (v, e) => Math.floor(rawModules(v) / 8) - ECC_PER_BLOCK[e][v] * NUM_BLOCKS[e][v];

  function gfMul(x, y) {
    let z = 0;
    for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((y >>> i) & 1) * x; }
    return z;
  }
  function rsDivisor(deg) {
    const r = new Array(deg).fill(0); r[deg - 1] = 1;
    let root = 1;
    for (let i = 0; i < deg; i++) {
      for (let j = 0; j < deg; j++) { r[j] = gfMul(r[j], root); if (j + 1 < deg) r[j] ^= r[j + 1]; }
      root = gfMul(root, 2);
    }
    return r;
  }
  function rsRemainder(data, div) {
    const r = new Array(div.length).fill(0);
    for (const b of data) {
      const f = b ^ r.shift();
      r.push(0);
      div.forEach((c, i) => { r[i] ^= gfMul(c, f); });
    }
    return r;
  }

  function utf8(s) { return Array.from(new TextEncoder().encode(s)); }

  function encode(text, eccLetter) {
    const e = ECC_IDX[(eccLetter || "M").toUpperCase()];
    if (e === undefined) throw new Error("ecc must be L, M, Q or H");
    const bytes = utf8(String(text));
    // smallest version that fits
    let ver = 0, capBits = 0;
    for (let v = 1; v <= 40; v++) {
      capBits = dataCodewords(v, e) * 8;
      const need = 4 + (v <= 9 ? 8 : 16) + bytes.length * 8;
      if (need <= capBits) { ver = v; break; }
    }
    if (!ver) throw new Error("text is too long for a QR code");
    // bit stream
    const bits = [];
    const put = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    put(4, 4); put(bytes.length, ver <= 9 ? 8 : 16);
    bytes.forEach((b) => put(b, 8));
    put(0, Math.min(4, capBits - bits.length));
    put(0, (8 - (bits.length % 8)) % 8);
    for (let pad = 0xec; bits.length < capBits; pad ^= 0xec ^ 0x11) put(pad, 8);
    const data = [];
    for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2));

    // error correction + interleave
    const nb = NUM_BLOCKS[e][ver], eccLen = ECC_PER_BLOCK[e][ver];
    const raw = Math.floor(rawModules(ver) / 8);
    const shortCount = nb - (raw % nb), shortLen = Math.floor(raw / nb);
    const div = rsDivisor(eccLen);
    const blocks = [];
    for (let i = 0, k = 0; i < nb; i++) {
      const dat = data.slice(k, k + shortLen - eccLen + (i < shortCount ? 0 : 1));
      k += dat.length;
      const ecc = rsRemainder(dat, div);
      if (i < shortCount) dat.push(0);
      blocks.push(dat.concat(ecc));
    }
    const all = [];
    for (let i = 0; i < blocks[0].length; i++)
      blocks.forEach((b, j) => { if (i !== shortLen - eccLen || j >= shortCount) all.push(b[i]); });

    // matrix
    const size = ver * 4 + 17;
    const mod = Array.from({ length: size }, () => new Array(size).fill(false));
    const fn = Array.from({ length: size }, () => new Array(size).fill(false));
    const setF = (x, y, dark) => { mod[y][x] = dark; fn[y][x] = true; };
    for (let i = 0; i < size; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }
    const finder = (cx, cy) => {
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy)), x = cx + dx, y = cy + dy;
        if (x >= 0 && x < size && y >= 0 && y < size) setF(x, y, d !== 2 && d !== 4);
      }
    };
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    const align = [];
    if (ver > 1) {
      const n = Math.floor(ver / 7) + 2, step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
      align.push(6);
      for (let pos = size - 7; align.length < n; pos -= step) align.splice(1, 0, pos);
    }
    align.forEach((cy, i) => align.forEach((cx, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === align.length - 1) || (i === align.length - 1 && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setF(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }));
    const drawFormat = (mask) => {
      const d = (ECC_FORMAT[e] << 3) | mask;
      let r = d;
      for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
      const bits15 = ((d << 10) | r) ^ 0x5412, bit = (i) => ((bits15 >>> i) & 1) !== 0;
      for (let i = 0; i <= 5; i++) setF(8, i, bit(i));
      setF(8, 7, bit(6)); setF(8, 8, bit(7)); setF(7, 8, bit(8));
      for (let i = 9; i < 15; i++) setF(14 - i, 8, bit(i));
      for (let i = 0; i < 8; i++) setF(size - 1 - i, 8, bit(i));
      for (let i = 8; i < 15; i++) setF(8, size - 15 + i, bit(i));
      setF(8, size - 8, true);
    };
    drawFormat(0);
    if (ver >= 7) {
      let r = ver;
      for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1f25);
      const bits18 = (ver << 12) | r;
      for (let i = 0; i < 18; i++) {
        const b = ((bits18 >>> i) & 1) !== 0, a = size - 11 + (i % 3), c = Math.floor(i / 3);
        setF(a, c, b); setF(c, a, b);
      }
    }
    // data bits in the zigzag order
    let bi = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
        const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
        if (!fn[y][x] && bi < all.length * 8) { mod[y][x] = ((all[bi >>> 3] >>> (7 - (bi & 7))) & 1) !== 0; bi++; }
      }
    }
    // choose the mask with the lowest penalty
    const MASKS = [
      (x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
      (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
      (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0, (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
    ];
    const apply = (m) => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASKS[m](x, y)) mod[y][x] = !mod[y][x]; };
    const penalty = () => {
      let p = 0;
      const lines = [];
      for (let y = 0; y < size; y++) lines.push(mod[y].map(Number));
      for (let x = 0; x < size; x++) lines.push(mod.map((r) => +r[x]));
      for (const ln of lines) {
        let run = 1;
        for (let i = 1; i <= size; i++) {
          if (i < size && ln[i] === ln[i - 1]) run++;
          else { if (run >= 5) p += 3 + run - 5; run = 1; }
        }
        const s = ln.join("");
        for (const pat of ["10111010000", "00001011101"]) for (let i = s.indexOf(pat); i >= 0; i = s.indexOf(pat, i + 1)) p += 40;
      }
      for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) {
        const c = mod[y][x];
        if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) p += 3;
      }
      let dark = 0;
      for (const r of mod) for (const c of r) if (c) dark++;
      p += Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10;
      return p;
    };
    let best = 0, bestP = Infinity;
    for (let m = 0; m < 8; m++) {
      apply(m); drawFormat(m);
      const p = penalty();
      if (p < bestP) { bestP = p; best = m; }
      apply(m);
    }
    apply(best); drawFormat(best);
    return { size, version: ver, ecc: Object.keys(ECC_IDX)[e], get: (x, y) => x >= 0 && y >= 0 && x < size && y < size && mod[y][x] };
  }

  // ===================== SVG =====================
  function svg(text, o = {}) {
    const m = encode(text, o.ecc), q = o.quiet == null ? 4 : o.quiet, n = m.size + q * 2, style = o.style || "square";
    let d = "";
    const inFinder = (x, y) => (x < 8 && y < 8) || (x >= m.size - 8 && y < 8) || (x < 8 && y >= m.size - 8);
    for (let y = 0; y < m.size; y++) for (let x = 0; x < m.size; x++) {
      if (!m.get(x, y)) continue;
      const X = x + q, Y = y + q;
      if (style === "dots" && !inFinder(x, y)) d += `M${X + 0.5} ${Y + 0.5}m-.42 0a.42.42 0 1 0 .84 0a.42.42 0 1 0 -.84 0z`;
      else if (style === "rounded" && !inFinder(x, y)) d += `M${X + 0.2} ${Y}h.6a.2.2 0 0 1 .2.2v.6a.2.2 0 0 1 -.2.2h-.6a.2.2 0 0 1 -.2-.2v-.6a.2.2 0 0 1 .2-.2z`;
      else d += `M${X} ${Y}h1v1h-1z`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="${style === "square" ? "crispEdges" : "geometricPrecision"}" role="img"><rect width="${n}" height="${n}" fill="var(--deck-qr-paper, #fff)"/><path d="${d}" fill="var(--deck-qr-ink, #000)"/></svg>`;
  }

  // ===================== slide element =====================
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function render(el) {
    const d = el.dataset, text = d.qr || "";
    const size = Math.max(160, Math.min(900, +d.size || 460));
    let code;
    try {
      if (!text) throw new Error("data-qr is empty");
      code = svg(text, { ecc: d.ecc || "M", style: d.style });
    } catch (err) {
      el.innerHTML = `<div class="qr-err">QR code: ${esc(err.message)}</div>`;
      return;
    }
    const caption = d.caption != null ? d.caption : text.replace(/^https?:\/\//, "").replace(/\/$/, "");
    el.classList.toggle("is-side", d.layout === "side");
    el.innerHTML =
      (d.label ? `<div class="qr-label">${esc(d.label)}</div>` : "") +
      `<div class="qr-col"><div class="qr-card" style="width:${size}px;height:${size}px">${code}</div>` +
      (caption ? `<div class="qr-cap">${esc(caption)}</div>` : "") + `</div>`;
    const s = el.querySelector("svg");
    s.setAttribute("aria-label", "QR code" + (d.label ? ": " + d.label : "") + ", links to " + text);
  }

  const style = document.createElement("style");
  style.textContent = `
.s-qr{display:inline-flex;flex-direction:column;align-items:center;gap:28px;text-align:center}
.s-qr.is-side{flex-direction:row;gap:56px;text-align:left}
.qr-label{font:700 var(--deck-fs-h3, 40px)/1.2 var(--deck-font-display);color:var(--deck-text);max-width:760px}
.s-qr.is-side .qr-label{max-width:620px}
.qr-col{display:flex;flex-direction:column;align-items:center;gap:20px}
.qr-card{box-sizing:border-box;border-radius:var(--deck-radius-lg, 20px);overflow:hidden;background:var(--deck-qr-paper, #fff);
 box-shadow:var(--deck-shadow-menu, 0 12px 40px rgba(0,0,0,.25));border:1px solid var(--deck-border)}
.qr-card svg{display:block;width:100%;height:100%}
.qr-cap{font:600 28px/1.25 var(--deck-font-mono, monospace);color:var(--deck-text-2);letter-spacing:.01em;max-width:900px;overflow-wrap:anywhere}
.qr-err{color:var(--deck-danger);font:600 24px var(--deck-font-sans)}`;
  document.head.append(style);

  Deck.qr = { svg, matrix: encode, render };
  Deck.on("ready", () => {
    for (let i = 0; i < Deck.slides.length; i++) for (const el of Deck.slideEl(i).querySelectorAll(".s-qr[data-qr]")) render(el);
  });
})();
