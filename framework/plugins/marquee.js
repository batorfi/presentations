/* Marquee — a large headline that scrolls sideways at a pace a person can read.
 *
 *   <div class="s-marquee" data-size="xl" data-wpm="120">Agents write the code. Engineers own the outcome.</div>
 *
 *   data-size="s|m|l|xl"        text size: 56 / 88 / 136 / 208 px (default m)
 *   data-wpm="120"              reading pace in words per minute (default 120). The speed follows from the text, so a long
 *                               headline is never faster than a short one. It is kept between 60 and 260 px/s, so even a huge headline stays easy to follow.
 *   data-width="60%"            width of the visible window: any CSS length ("900px", "50%"), or "bleed" for the full
 *                               stage width. Default: the width of the container.
 *   data-height="200px"         height of the window (default: fits the text)
 *   data-align="center"         place a narrower window in the middle (default: left)
 *   data-direction="ltr"        scroll to the right (default: to the left)
 *   data-gap="2"                space between repeats, in em (default 2)
 *   data-fade="none"            hard edges instead of soft fades
 *   class="is-rail|is-accent"   dark band with light text / accent coloured text
 *
 * It loops without a seam, starts from the first word whenever its slide is shown, and runs only while its slide is on
 * screen. The motion is a transform animation (compositor only). With reduced motion it shows the text still, wrapped.
 * Deck.marquee.speeds() reports the pace of each marquee on the current slide (for checking). */
(function () {
  "use strict";

  Deck.on("ready", () => {
    const list = [];
    for (let i = 0; i < Deck.slides.length; i++) {
      for (const el of Deck.slideEl(i).querySelectorAll(".s-marquee")) {
        const text = el.textContent.replace(/\s+/g, " ").trim();
        el.textContent = "";
        el.setAttribute("role", "text");
        el.setAttribute("aria-label", text);
        const track = document.createElement("div");
        track.className = "s-marquee-track";
        el.append(track);
        const m = { slide: i, el, text, track, anim: null, words: Math.max(1, text.split(" ").length), speed: 0 };
        if (el.dataset.width && el.dataset.width !== "bleed") el.style.width = el.dataset.width;
        if (el.dataset.height) el.style.height = el.dataset.height;
        if (el.dataset.align === "center") el.style.marginInline = "auto";
        if (el.dataset.gap) el.style.setProperty("--marquee-gap", `${+el.dataset.gap}em`);
        list.push(m);
      }
    }
    if (!list.length) return;

    const reduced = () => Deck.context(Deck.state.index).reduced();

    const item = (m, hidden) => {
      const s = document.createElement("span");
      s.className = "s-marquee-item";
      s.textContent = m.text;
      if (hidden) s.setAttribute("aria-hidden", "true");
      return s;
    };

    function stop(m) {
      if (m.anim) { try { m.anim.cancel(); } catch (_) {} m.anim = null; }
    }

    /** (Re)build and start one marquee. Needs its slide on screen to measure. */
    function layout(m) {
      stop(m);
      const { el, track } = m;
      if (el.dataset.width === "bleed") {
        const cs = getComputedStyle(Deck.slideEl(m.slide));
        el.style.width = "auto";
        el.style.marginInline = `${-parseFloat(cs.paddingLeft)}px ${-parseFloat(cs.paddingRight)}px`;
        el.style.borderRadius = "0";
        el.style.maxWidth = "none";
      }
      track.replaceChildren(item(m, false));
      el.classList.toggle("is-static", reduced());
      if (reduced()) return; // text is shown still, wrapped
      const first = track.firstChild;
      const itemW = first.offsetWidth, winW = el.clientWidth;
      if (!itemW || !winW) return;
      const gap = parseFloat(getComputedStyle(first).paddingRight) || 0;
      const wpm = +el.dataset.wpm || 120;
      const speed = Math.min(260, Math.max(60, (itemW - gap) / ((m.words * 60) / wpm))); // px per second
      m.speed = speed;
      for (let k = 0, n = Math.ceil(winW / itemW) + 1; k < n; k++) track.append(item(m, true));
      const dur = (itemW / speed) * 1000;
      m.anim = track.animate(
        [{ transform: "translate3d(0,0,0)" }, { transform: `translate3d(${-itemW}px,0,0)` }],
        { duration: dur, iterations: Infinity, easing: "linear", direction: el.dataset.direction === "ltr" ? "reverse" : "normal" }
      );
    }

    const current = () => list.filter((m) => m.slide === Deck.state.index);
    const refresh = () => { for (const m of list) m.slide === Deck.state.index ? layout(m) : stop(m); };

    Deck.on("slidechange", refresh);
    Deck.on("resize", () => current().forEach(layout));
    Deck.on("settings", ({ key }) => key === "reducedMotion" && current().forEach(layout));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => current().forEach(layout));
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => current().forEach((m) => m.anim && layout(m)));
      list.forEach((m) => ro.observe(m.el));
    }
    Deck.marquee = { speeds: () => current().map((m) => Math.round(m.speed)) };
  });
})();
