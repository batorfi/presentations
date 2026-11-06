/* Speaker card — a responsive profile of the presenter that the audience can open from the published deck.
 * Opens from: a click on the presenter's name (any element with data-speaker-open), the key I, the right-click menu,
 * the link  …/deck/#bio  and the closing slide made by Deck.speakerSlide(). Offline: no fonts, libraries or requests.
 *
 *   <script src="../../speakers/zsolt-batorfi.js"></script>          <!-- the profile (public data), before the deck config -->
 *   <script src="../../framework/plugins/qr.js"></script>             <!-- needed for the QR codes -->
 *   <script src="../../framework/plugins/speaker.js"></script>
 *   Deck.configure({ speaker: "zsolt-batorfi" })                      <!-- slug in window.DeckSpeakers, or the profile object -->
 *   <div class="p1-presenter" data-speaker-open>…the name on the title slide…</div>
 *   Deck.speakerSlide({ section: "close" })                           <!-- optional: an "About the speaker" slide from the same data -->
 *
 * The card is drawn outside the scaled 1920×1080 stage, so on a phone it is a real mobile page. The front shows the
 * business card (identity, links, save contact); "QR codes" flips it over; Shift+I (or the button) opens contact mode:
 * big full-screen codes for the end of the session. EN/HU toggle when the profile has Hungarian text.
 * Email, phone and WhatsApp are shown only after a tap. Everything in the profile is public once the deck is published.
 * Profile shape: see speakers/zsolt-batorfi.js (text is a string or { en, hu }). Esc or I closes; Shift+I = contact mode.
 * API: Deck.speaker.open() / close() / toggle() / contactMode() / vcard() / lang */
(function () {
  "use strict";
  const initial = location.hash + " " + location.search; // read before the router rewrites the hash
  const wantsBio = /(^|[#/?&\s])bio(\b|$)/.test(initial);
  const resolve = (c) => (typeof c === "string" ? (window.DeckSpeakers || {})[c] : c);
  const L = (x, lang) => (x == null ? "" : typeof x === "string" ? x : x[lang] || x.en || "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const T = {
    en: { about: "About the speaker", save: "Save contact", qr: "QR codes", back: "Back to card", cm: "Contact mode", close: "Close", link: "Copy link", copied: "Copied ✓",
      now: "Right now", comp: "Key competencies", career: "Career", rec: "Recognition", talks: "Talks and appearances", certs: "Certifications", edu: "Education",
      tap: "Tap to show", stay: "Let’s stay in touch", vcard: "Save my contact", linkedin: "LinkedIn", github: "GitHub", whatsapp: "WhatsApp", email: "Email", phone: "Mobile",
      connect: "Connect", open: "Open", scanhint: "Scan with your phone camera" },
    hu: { about: "Az előadóról", save: "Névjegy mentése", qr: "QR-kódok", back: "Vissza a névjegyhez", cm: "Kapcsolat mód", close: "Bezár", link: "Link másolása", copied: "Másolva ✓",
      now: "Jelenleg", comp: "Fő kompetenciák", career: "Pályafutás", rec: "Elismerések", talks: "Előadások, szereplések", certs: "Tanúsítványok", edu: "Tanulmányok",
      tap: "Koppints a megjelenítéshez", stay: "Maradjunk kapcsolatban", vcard: "Névjegyem mentése", linkedin: "LinkedIn", github: "GitHub", whatsapp: "WhatsApp", email: "E-mail", phone: "Mobil",
      connect: "Kapcsolódj", open: "Megnyitás", scanhint: "Olvasd be a telefon kamerájával" },
  };
  const ICON = {
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="3"/><path d="M11 18.5h2"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8.5 9.5h7M8.5 12.5h4.5"/>',
    code: '<path d="M8.5 8L4 12l4.5 4M15.5 8L20 12l-4.5 4M13.5 6l-3 12"/>',
    down: '<path d="M12 4v11M7.5 11L12 15.5 16.5 11M5 19.5h14"/>',
  };
  const ico = (n) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

  const find = (P, type) => (P.contacts || []).find((c) => c.type === type);
  function vcard(P, compact) {
    const v = (s) => String(s).replace(/([,;\\])/g, "\\$1");
    const li = find(P, "linkedin"), gh = find(P, "github"), em = find(P, "email"), ph = find(P, "phone");
    const rows = ["BEGIN:VCARD", "VERSION:3.0", `N:${v(P.last)};${v(P.first)};;;`, `FN:${v(P.first + " " + P.last)}`];
    if (P.org) rows.push(`ORG:${v(P.org)}`);
    if (P.role) rows.push(`TITLE:${v(L(P.role, "en"))}`);
    if (ph) rows.push(`TEL;TYPE=CELL:${ph.value}`);
    if (em) rows.push(`EMAIL;TYPE=INTERNET:${em.value}`);
    if (li) rows.push(`URL:${li.url}`);
    if (gh && !compact) rows.push(`URL:${gh.url}`);
    rows.push("END:VCARD");
    return rows.join(compact ? "\n" : "\r\n") + (compact ? "" : "\r\n");
  }
  const qrSvg = (text, ecc) => (window.Deck && Deck.qr ? Deck.qr.svg(text, { ecc: ecc || "M", quiet: 3 }) : "");
  const waUrl = (c) => "https://wa.me/" + String(c.value).replace(/[^\d]/g, "");
  const initials = (P) => (P.first[0] + P.last[0]).toUpperCase();

  // ---------- closing slide generated from the same data ----------
  Deck.speakerSlide = (o = {}) => {
    const P = resolve(o.speaker || Deck.config?.speaker);
    if (!P) { console.warn("speakerSlide: no profile (set Deck.configure({ speaker }) before the slide files)"); return; }
    const lang = o.lang || "en", t = T[lang], li = find(P, "linkedin");
    const chips = (P.competencies || []).slice(0, o.chips || 6).map((c) => `<span class="spk-chip">${esc(L(c, lang))}</span>`).join("");
    Deck.slide({
      id: o.id || "about-speaker", section: o.section || "close", title: o.title || t.about, navTitle: o.navTitle || "Speaker", className: "spk-slide",
      html: `<p class="s-kicker" data-anim="fade">${esc(o.kicker || t.about)}</p>
        <div class="spk-sl-grid">
          <div class="spk-sl-main">
            <div class="spk-sl-id" data-anim="up" data-speaker-open>${P.photo ? `<img class="spk-mono spk-mono-l" src="${esc(P.photo)}" alt="">` : `<div class="spk-mono spk-mono-l" aria-hidden="true">${esc(initials(P))}</div>`}
              <div><h2 class="s-title spk-sl-name"><b>${esc(P.first + " " + P.last)}</b></h2><p class="spk-sl-role">${esc(L(P.role, lang))} · ${esc(P.org || "")}</p></div></div>
            <p class="spk-sl-intro" data-anim="up" data-delay="150">${esc(L(P.intro, lang))}</p>
            <div class="spk-chips" data-anim="up" data-delay="300">${chips}</div>
            <p class="spk-sl-hint" data-anim="fade" data-delay="500">${esc(o.hint || "Tap my name on the first slide of this deck for the full profile, or open the link with #bio.")}</p>
          </div>
          <div class="spk-sl-qrs">
            ${li ? `<div class="s-qr" data-anim="zoom" data-delay="250" data-qr="${esc(li.url)}" data-label="${esc(t.linkedin)}" data-caption="" data-size="250"></div>` : ""}
            <div class="s-qr" data-anim="zoom" data-delay="400" data-qr="${esc(vcard(P, true))}" data-ecc="L" data-label="${esc(t.vcard)}" data-caption="" data-size="250"></div>
          </div>
        </div>`,
      notes: o.notes || "About the speaker. The two codes: LinkedIn, and a contact card the phone can save. Tapping the name opens the full profile.",
    });
  };

  const style = document.createElement("style");
  style.textContent = `
[data-speaker-open]{cursor:pointer}
[data-speaker-open]:hover b,[data-speaker-open]:focus-visible b,[data-speaker-open]:hover .spk-sl-name{text-decoration:underline;text-decoration-color:var(--deck-accent);text-underline-offset:.18em;text-decoration-thickness:3px}
[data-speaker-open] b::after{content:" ↗";color:var(--deck-accent);font-weight:400;font-size:.62em;vertical-align:.12em}
[data-speaker-open]:focus-visible{outline:3px solid var(--deck-focus);outline-offset:6px;border-radius:8px}
.spk{position:fixed;inset:0;z-index:100000;display:none;font-family:var(--deck-font-sans);color:var(--deck-text);font-size:17px;line-height:1.5;-webkit-text-size-adjust:100%}
.spk.is-open{display:block}
.spk *{box-sizing:border-box}
.spk-scrim{position:absolute;inset:0;background:color-mix(in srgb,var(--deck-rail) 64%,transparent);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:spkFade .3s both}
.spk-panel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(1180px,calc(100vw - 32px));height:min(820px,calc(100vh - 32px));height:min(820px,calc(100dvh - 32px));display:flex;flex-direction:column;
 background:var(--deck-bg);border:1px solid var(--deck-border);border-radius:24px;box-shadow:var(--deck-shadow-menu);overflow:hidden;animation:spkIn .42s var(--deck-ease-out,ease) both;outline:0}
.spk-bar{display:flex;align-items:center;gap:12px;padding:14px 22px;border-bottom:1px solid var(--deck-border);background:var(--deck-raised)}
.spk-bar-t{font:600 13px var(--deck-font-sans);letter-spacing:.14em;text-transform:uppercase;color:var(--deck-accent)}
.spk-bar-r{margin-left:auto;display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.spk-btn{display:inline-flex;align-items:center;gap:8px;font:600 15px var(--deck-font-sans);color:var(--deck-text);background:var(--deck-bg);border:1px solid var(--deck-border-strong);border-radius:999px;padding:8px 16px;cursor:pointer;text-decoration:none;white-space:nowrap}
.spk-btn:hover{border-color:var(--deck-accent);color:var(--deck-accent)}.spk-btn:focus-visible,.spk-ct:focus-visible{outline:3px solid var(--deck-focus);outline-offset:2px}
.spk-btn.is-primary{background:var(--deck-accent);border-color:var(--deck-accent);color:var(--deck-on-accent)}.spk-btn.is-primary:hover{background:var(--deck-accent-hover);color:var(--deck-on-accent)}
.spk-btn[aria-pressed="true"]{background:var(--deck-accent-subtle);border-color:var(--deck-accent);color:var(--deck-accent)}
.spk-x{padding:6px 14px;font-size:22px;line-height:1}
.spk-body{flex:1;overflow-y:auto;display:grid;grid-template-columns:400px minmax(0,1fr);align-items:start;scroll-behavior:smooth}
.spk-side{position:sticky;top:0;padding:28px 0 28px 28px}
.spk-flip{perspective:1500px}
.spk-card{display:grid;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.2,.8,.2,1);transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))}
.spk-flip.is-flipped .spk-card{transform:rotateX(var(--rx,0deg)) rotateY(calc(180deg + var(--ry,0deg)))}
.spk-face{grid-area:1/1;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:var(--deck-raised);border:1px solid var(--deck-border);border-radius:22px;padding:30px 26px 26px;box-shadow:0 18px 44px -18px rgba(0,0,0,.35);overflow:hidden;position:relative}
.spk-face::before{content:"";position:absolute;left:0;right:0;top:0;height:7px;background:linear-gradient(90deg,var(--deck-accent),var(--deck-info))}
.spk-back{transform:rotateY(180deg)}
.spk-mono{width:92px;height:92px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,var(--deck-accent),var(--deck-accent-hover));color:var(--deck-on-accent);font:700 36px var(--deck-font-display);letter-spacing:.02em;box-shadow:0 10px 24px -10px var(--deck-accent)}
img.spk-mono{object-fit:cover;background:var(--deck-surface-2,transparent)}
.spk-mono-l{width:120px;height:120px;font-size:46px}
.spk-name{font:700 30px/1.15 var(--deck-font-display);margin:16px 0 4px}
.spk-role{margin:0;font-weight:600;color:var(--deck-text)}.spk-org,.spk-lang{margin:2px 0 0;color:var(--deck-text-2);font-size:15px}
.spk-contacts{list-style:none;margin:20px 0 18px;padding:0;display:grid;gap:8px}
.spk-ct{display:flex;align-items:center;gap:12px;width:100%;padding:9px 12px;border-radius:14px;border:1px solid var(--deck-border);background:var(--deck-bg);color:var(--deck-text);font:inherit;text-align:left;text-decoration:none;cursor:pointer;transition:border-color .15s,transform .15s}
.spk-ct:hover{border-color:var(--deck-accent);transform:translateX(3px)}
.spk-ct i{flex:none;width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:var(--deck-accent-subtle);color:var(--deck-accent)}
.spk-ct b{display:block;font-weight:600;font-size:15px;line-height:1.2}.spk-ct small{display:block;color:var(--deck-text-2);font-size:13.5px;overflow-wrap:anywhere}
.spk-actions{display:flex;gap:8px;flex-wrap:wrap}
.spk-back h3{margin:6px 0 14px;font:700 20px var(--deck-font-display)}
.spk-qrs{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px}
.spk-qrs figure,.spk-cm-grid figure{margin:0;text-align:center}
.spk-qrs figcaption{font:600 13.5px var(--deck-font-sans);margin-top:6px;color:var(--deck-text-2)}
.spk-qr{border-radius:12px;overflow:hidden;border:1px solid var(--deck-border);background:#fff;line-height:0}.spk-qr svg{width:100%;height:auto;display:block}
.spk-main{padding:34px 40px 56px 36px;min-width:0}
.spk-sec{margin:0 0 30px;animation:spkUp .55s var(--deck-ease-out,ease) both;animation-delay:calc(var(--i,0) * 80ms + 160ms)}
.spk-sec h3{display:flex;align-items:center;gap:12px;margin:0 0 12px;font:600 13px var(--deck-font-sans);letter-spacing:.14em;text-transform:uppercase;color:var(--deck-accent)}
.spk-sec h3::after{content:"";flex:1;height:1px;background:var(--deck-border)}
.spk-intro{font:400 24px/1.42 var(--deck-font-display);margin:0;color:var(--deck-text)}
.spk-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}.spk-list li{position:relative;padding-left:22px}
.spk-list li::before{content:"";position:absolute;left:2px;top:.62em;width:9px;height:9px;border-radius:50%;background:var(--deck-accent)}
.spk-chips{display:flex;flex-wrap:wrap;gap:8px}
.spk-chip{display:inline-block;padding:6px 14px;border-radius:999px;background:var(--deck-accent-subtle);color:var(--deck-text);border:1px solid color-mix(in srgb,var(--deck-accent) 35%,transparent);font-size:15px;font-weight:500;animation:spkPop .45s var(--deck-ease-out,ease) both;animation-delay:calc(var(--k,0) * 45ms + 300ms)}
.spk-chip.is-plain{background:var(--deck-raised);border-color:var(--deck-border)}
.spk-tl{list-style:none;margin:0;padding:0 0 0 22px;position:relative}
.spk-tl::before{content:"";position:absolute;left:5px;top:8px;bottom:8px;width:2px;background:linear-gradient(var(--deck-accent),var(--deck-border));transform-origin:top;animation:spkLine .9s .3s both}
.spk-tl li{position:relative;display:grid;grid-template-columns:104px minmax(0,1fr);gap:14px;padding:6px 0 14px}
.spk-tl li::before{content:"";position:absolute;left:-22px;top:12px;width:12px;height:12px;border-radius:50%;background:var(--deck-bg);border:3px solid var(--deck-accent)}
.spk-tl li:first-child::before{background:var(--deck-accent)}
.spk-tl time{font:600 13.5px var(--deck-font-mono);color:var(--deck-text-2);padding-top:3px}
.spk-tl b{font-weight:700}.spk-tl p{margin:2px 0 0;color:var(--deck-text-2);font-size:15px}
.spk-cm{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;gap:2.2vh;padding:4vh 4vw;text-align:center;background:var(--deck-rail);color:var(--deck-on-rail);animation:spkFade .35s both;overflow:auto}
.spk.is-cm .spk-cm{display:flex}.spk.is-cm .spk-panel,.spk.is-cm .spk-scrim{display:none}
.spk-cm h2{margin:0;font:700 clamp(30px,6vh,60px)/1.1 var(--deck-font-display)}
.spk-cm p{margin:0;color:var(--deck-muted-on-rail);font-size:clamp(16px,2.6vh,24px)}
.spk-cm-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:3vw 2.6vw;margin-top:1.5vh}
.spk-cm-grid .spk-qr{width:min(21vw,36vh);min-width:150px;border:0;border-radius:18px;box-shadow:0 20px 50px -20px #000;animation:spkPop .5s var(--deck-ease-out,ease) both;animation-delay:calc(var(--k,0) * 90ms + 200ms)}
.spk-cm-grid figcaption{margin-top:1.2vh;font:600 clamp(16px,2.6vh,26px) var(--deck-font-sans);color:var(--deck-on-rail)}
.spk-cm .spk-btn{position:absolute;right:24px;top:20px;background:transparent;color:var(--deck-on-rail);border-color:var(--deck-muted-on-rail)}
@keyframes spkIn{from{opacity:0;transform:translate(-50%,-47%) scale(.97)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
@keyframes spkFade{from{opacity:0}to{opacity:1}}@keyframes spkUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes spkPop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}@keyframes spkLine{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@media (max-width:860px){
 .spk-panel{left:0;top:0;transform:none;width:100vw;height:100vh;height:100dvh;border-radius:0;border:0;animation:spkFade .25s both}
 .spk-bar{padding:10px 14px;flex-wrap:wrap}.spk-body{display:block}.spk-side{position:static;padding:18px 16px 0}
 .spk-main{padding:24px 18px 48px}.spk-intro{font-size:21px}.spk-tl li{grid-template-columns:86px minmax(0,1fr)}
 .spk-cm .spk-btn{position:static;align-self:flex-end}.spk-cm-grid .spk-qr{width:min(40vw,26vh)}}
@media (prefers-reduced-motion:reduce){.spk *,.spk-panel{animation:none!important;transition:none!important}}
[data-reduced-motion] .spk *,[data-reduced-motion] .spk-panel{animation:none!important;transition:none!important}
.spk-slide .spk-sl-grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:80px;align-items:center;margin-top:12px}
.spk-sl-id{display:flex;align-items:center;gap:36px;margin-bottom:28px}.spk-sl-name{margin:0;font-size:72px}
.spk-sl-role{margin:6px 0 0;font-size:32px;color:var(--deck-text-2)}.spk-sl-intro{font-size:30px;line-height:1.4;margin:0 0 26px;max-width:1040px}
.spk-slide .spk-chip{font-size:24px;padding:8px 20px;animation:none}.spk-sl-hint{margin:30px 0 0;font-size:24px;color:var(--deck-muted)}
.spk-sl-qrs{display:flex;flex-direction:column;gap:30px;align-items:center}.spk-sl-qrs .qr-label{font-size:30px}`;
  document.head.append(style);

  Deck.on("ready", () => {
    const P = resolve(Deck.config?.speaker);
    if (!P) return;
    const hasHu = !!(P.intro && P.intro.hu);
    let lang = "en";
    try { const s = localStorage.getItem("deck.speaker.lang"); if (s === "hu" && hasHu) lang = "hu"; } catch (_) {}
    const revealed = new Set();
    let open = false, flipped = false, lastFocus = null;

    const root = document.createElement("div");
    root.className = "spk";
    root.setAttribute("data-spk-root", "");
    document.body.append(root);

    const contactRows = (t) => (P.contacts || []).map((c, i) => {
      const meta = {
        linkedin: { icon: "link", label: t.linkedin, sub: t.connect, href: c.url },
        github: { icon: "code", label: t.github, sub: String(c.url || "").replace(/^https?:\/\//, ""), href: c.url },
        email: { icon: "mail", label: t.email, hide: true, value: c.value, href: "mailto:" + c.value },
        phone: { icon: "phone", label: t.phone, hide: true, value: c.value, href: "tel:" + String(c.value).replace(/[^\d+]/g, "") },
        whatsapp: { icon: "chat", label: t.whatsapp, hide: true, value: "+" + String(c.value).replace(/[^\d]/g, ""), href: c.type === "whatsapp" ? waUrl(c) : "" },
      }[c.type];
      if (!meta) return "";
      if (meta.hide && !revealed.has(i)) return `<li><button class="spk-ct" data-spk="reveal" data-i="${i}"><i>${ico(meta.icon)}</i><span><b>${meta.label}</b><small>${t.tap}</small></span></button></li>`;
      const ext = meta.href.startsWith("http") ? ' target="_blank" rel="noopener"' : "";
      return `<li><a class="spk-ct" data-i="${i}" href="${esc(meta.href)}"${ext}><i>${ico(meta.icon)}</i><span><b>${meta.label}</b><small>${esc(meta.value || meta.sub)}</small></span></a></li>`;
    }).join("");

    const qrFigures = (t, withCaption = true) => {
      const li = find(P, "linkedin"), wa = find(P, "whatsapp"), gh = find(P, "github");
      const items = [[t.vcard, vcard(P, true), "L"], li && [t.linkedin, li.url], wa && [t.whatsapp, waUrl(wa)], gh && [t.github, gh.url]].filter(Boolean);
      return items.map((it, k) => `<figure style="--k:${k}"><div class="spk-qr" role="img" aria-label="QR: ${esc(it[0])}">${qrSvg(it[1], it[2])}</div>${withCaption ? `<figcaption>${esc(it[0])}</figcaption>` : ""}</figure>`).join("");
    };

    function render() {
      const t = T[lang], name = P.first + " " + P.last, canQr = !!(window.Deck && Deck.qr);
      const sec = (i, title, body) => (body ? `<section class="spk-sec" style="--i:${i}"><h3>${title}</h3>${body}</section>` : "");
      const list = (a) => (a && a.length ? `<ul class="spk-list">${a.map((x) => `<li>${esc(L(x, lang))}</li>`).join("")}</ul>` : "");
      const chips = (a, cls = "") => (a && a.length ? `<div class="spk-chips">${a.map((x, k) => `<span class="spk-chip ${cls}" style="--k:${k}">${esc(L(x, lang))}</span>`).join("")}</div>` : "");
      const tl = P.career && P.career.length ? `<ol class="spk-tl">${P.career.map((r) => `<li><time>${esc(r.period)}</time><div><b>${esc(r.org)}</b> · ${esc(L(r.title, lang))}${r.note ? `<p>${esc(L(r.note, lang))}</p>` : ""}</div></li>`).join("")}</ol>` : "";
      root.innerHTML = `
        <div class="spk-scrim" data-spk="close"></div>
        <section class="spk-panel" role="dialog" aria-modal="true" aria-label="${esc(t.about)}" tabindex="-1">
          <header class="spk-bar"><span class="spk-bar-t">${esc(t.about)}</span>
            <span class="spk-bar-r">
              ${hasHu ? `<button class="spk-btn" data-spk="lang" data-l="en" aria-pressed="${lang === "en"}">EN</button><button class="spk-btn" data-spk="lang" data-l="hu" aria-pressed="${lang === "hu"}">HU</button>` : ""}
              <button class="spk-btn" data-spk="copylink">${ico("link")}${esc(t.link)}</button>
              ${canQr ? `<button class="spk-btn" data-spk="cm">${esc(t.cm)}</button>` : ""}
              <button class="spk-btn spk-x" data-spk="close" aria-label="${esc(t.close)}">×</button>
            </span></header>
          <div class="spk-body">
            <aside class="spk-side"><div class="spk-flip${flipped ? " is-flipped" : ""}"><div class="spk-card">
              <div class="spk-face spk-front"${flipped ? " inert" : ""}>
                ${P.photo ? `<img class="spk-mono" src="${esc(P.photo)}" alt="">` : `<div class="spk-mono" aria-hidden="true">${esc(initials(P))}</div>`}
                <h2 class="spk-name">${esc(name)}</h2>
                <p class="spk-role">${esc(L(P.role, lang))}</p>
                <p class="spk-org">${esc(P.org || "")}${P.location ? " · " + esc(L(P.location, lang)) : ""}</p>
                ${P.languages ? `<p class="spk-lang">${esc(L(P.languages, lang))}</p>` : ""}
                <ul class="spk-contacts">${contactRows(t)}</ul>
                <div class="spk-actions"><button class="spk-btn is-primary" data-spk="save">${ico("down")}${esc(t.save)}</button>${canQr ? `<button class="spk-btn" data-spk="flip">${esc(t.qr)} ↻</button>` : ""}</div>
              </div>
              <div class="spk-face spk-back"${flipped ? "" : " inert"}>
                <h3>${esc(t.scanhint)}</h3>
                <div class="spk-qrs">${canQr ? qrFigures(t) : ""}</div>
                <div class="spk-actions"><button class="spk-btn" data-spk="flip">↻ ${esc(t.back)}</button><button class="spk-btn" data-spk="cm">${esc(t.cm)}</button></div>
              </div>
            </div></div></aside>
            <main class="spk-main">
              ${sec(0, esc(name), `<p class="spk-intro">${esc(L(P.intro, lang))}</p>`)}
              ${sec(1, t.now, list(P.now))}
              ${sec(2, t.comp, chips(P.competencies))}
              ${sec(3, t.career, tl)}
              ${sec(4, t.rec, list(P.recognition))}
              ${sec(5, t.talks, list(P.talks))}
              ${sec(6, t.certs, chips(P.certifications, "is-plain"))}
              ${sec(7, t.edu, list(P.education))}
            </main>
          </div>
        </section>
        <section class="spk-cm" role="dialog" aria-modal="true" aria-label="${esc(t.cm)}">
          <button class="spk-btn" data-spk="cmclose">${esc(t.close)}</button>
          <h2>${esc(t.stay)}</h2><p>${esc(name)} · ${esc(L(P.role, lang))}${P.org ? ", " + esc(P.org) : ""}</p>
          <div class="spk-cm-grid">${canQr ? qrFigures(t) : ""}</div><p>${esc(t.scanhint)}</p>
        </section>`;
    }

    function focusables() {
      const scope = root.classList.contains("is-cm") ? root.querySelector(".spk-cm") : root.querySelector(".spk-panel");
      return [...scope.querySelectorAll("a[href],button,[tabindex]:not([tabindex='-1'])")].filter((el) => !el.closest("[inert]") && el.offsetParent !== null);
    }
    function focusFirst() {
      const scope = root.classList.contains("is-cm") ? root.querySelector(".spk-cm") : root.querySelector(".spk-panel");
      (scope.querySelector(".spk-x, .spk-cm .spk-btn") || scope).focus({ preventScroll: true });
    }
    function show() {
      if (open) return;
      open = true; lastFocus = document.activeElement;
      render();
      root.classList.add("is-open");
      Deck.pushLayer("speaker", hide);
      Deck.keyTrap = trap;
      focusFirst();
    }
    function hide() {
      if (!open) return;
      open = false;
      root.classList.remove("is-open", "is-cm");
      Deck.popLayer("speaker");
      if (Deck.keyTrap === trap) Deck.keyTrap = null;
      try { lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); } catch (_) {}
    }
    const toggle = () => (open ? hide() : show());
    function contactMode(on = true) {
      if (!(window.Deck && Deck.qr)) return;
      if (!open) show();
      root.classList.toggle("is-cm", on);
      focusFirst();
    }
    // swallow slide keys while open when focus is outside the card
    function trap(e) {
      if (!open || e.ctrlKey || e.metaKey || e.altKey || e.key === "Tab") return false;
      focusFirst();
      return true;
    }

    function download() {
      const blob = new Blob([vcard(P, false)], { type: "text/vcard;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = (P.first + "-" + P.last).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z-]+/g, "-") + ".vcf";
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }
    async function copyLink(btn) {
      const url = location.href.split("#")[0].split("?")[0] + "#bio";
      try { await navigator.clipboard.writeText(url); }
      catch (_) { const ta = document.createElement("textarea"); ta.value = url; document.body.append(ta); ta.select(); try { document.execCommand("copy"); } catch (__) {} ta.remove(); }
      const old = btn.innerHTML; btn.textContent = T[lang].copied; setTimeout(() => (btn.innerHTML = old), 1400);
    }

    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-spk]");
      if (!b) return;
      const a = b.dataset.spk;
      if (a === "close") hide();
      else if (a === "lang") { lang = b.dataset.l; try { localStorage.setItem("deck.speaker.lang", lang); } catch (_) {} const y = root.querySelector(".spk-body").scrollTop; render(); root.querySelector(".spk-body").scrollTop = y; root.querySelector(`[data-spk="lang"][data-l="${lang}"]`).focus(); }
      else if (a === "save") download();
      else if (a === "copylink") copyLink(b);
      else if (a === "flip") {
        flipped = !flipped;
        const wrap = root.querySelector(".spk-flip");
        wrap.classList.toggle("is-flipped", flipped);
        root.querySelector(".spk-front").toggleAttribute("inert", flipped);
        root.querySelector(".spk-back").toggleAttribute("inert", !flipped);
        setTimeout(() => (root.querySelector(flipped ? ".spk-back .spk-btn" : ".spk-front .spk-btn.is-primary") || root).focus({ preventScroll: true }), 360);
      }
      else if (a === "reveal") {
        revealed.add(+b.dataset.i);
        root.querySelector(".spk-contacts").innerHTML = contactRows(T[lang]);
        (root.querySelector(`.spk-ct[data-i="${b.dataset.i}"]`) || root).focus();
      }
      else if (a === "cm") contactMode(true);
      else if (a === "cmclose") { root.classList.remove("is-cm"); focusFirst(); }
    });
    // keys inside the card never reach the slide deck; Esc and I close, Shift+I = contact mode, Tab stays inside
    root.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Escape") { e.preventDefault(); if (root.classList.contains("is-cm")) { root.classList.remove("is-cm"); focusFirst(); } else hide(); }
      else if ((e.key === "i" || e.key === "I") && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); if (e.shiftKey) contactMode(!root.classList.contains("is-cm")); else hide(); }
      else if (e.key === "Tab") {
        const f = focusables(); if (!f.length) return;
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); }
      }
    });
    // card tilt following the pointer (desktop only)
    root.addEventListener("pointermove", (e) => {
      const w = e.target.closest && e.target.closest(".spk-flip");
      if (!w || e.pointerType === "touch" || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
      const r = w.getBoundingClientRect();
      w.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 7 + "deg");
      w.style.setProperty("--rx", (0.5 - (e.clientY - r.top) / r.height) * 5 + "deg");
    });
    root.addEventListener("pointerleave", () => root.querySelectorAll(".spk-flip").forEach((w) => { w.style.setProperty("--ry", "0deg"); w.style.setProperty("--rx", "0deg"); }), true);
    root.addEventListener("focusout", (e) => { if (open && !e.relatedTarget) setTimeout(() => open && !root.contains(document.activeElement) && focusFirst(), 0); });

    // entry points: the name (any element with data-speaker-open), keyboard on that element, the key I, the #bio link
    document.querySelectorAll("[data-speaker-open]").forEach((el) => { el.setAttribute("role", "button"); el.setAttribute("tabindex", "0"); el.setAttribute("aria-haspopup", "dialog"); el.setAttribute("aria-label", T[lang].about + ": " + P.first + " " + P.last); });
    document.addEventListener("click", (e) => { if (root.contains(e.target)) return; if (e.target.closest("[data-speaker-open]")) { e.preventDefault(); show(); } });
    document.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("[data-speaker-open]")) { e.preventDefault(); e.stopPropagation(); show(); }
    }, true);
    Deck.addKeys(["i"], toggle, "Speaker card: bio and contact", "Speaker");
    Deck.addKeys(["Shift+i"], () => contactMode(!root.classList.contains("is-cm") || !open), "Speaker contact mode: big QR codes", "Speaker");
    Deck.speaker = { open: show, close: hide, toggle, contactMode, vcard: () => vcard(P, false), get lang() { return lang; }, get isOpen() { return open; } };
    if (wantsBio) setTimeout(show, 400);
  });
})();
