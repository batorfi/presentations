/* Timer — the length of the talk, counted down in the header with a ring that shows how much is left.
 *   P          start · pause · resume
 *   Shift+P    stop (hides the timer)
 *   R          restart from the full length
 * The length (minutes) is set in the right-click menu (setting timerMinutes) or by Deck.configure({ timer: { minutes: 50 } }).
 * The ring turns amber for the last 20 % and red for the last 5 %; past zero it counts the overrun in red.
 * A running timer survives a reload. */
(function () {
  "use strict";
  const KEY = "deck.timer";
  const R = 18, C = 2 * Math.PI * R; // ring radius and circumference (viewBox 44)

  Deck.on("ready", () => {
    const { h } = Deck.helpers;
    const slot = Deck.el.titlebar.querySelector(".deck-tb-timer");
    if (!slot) return;
    // When the title bar is hidden (title slides) a compact chip keeps the clock visible.
    const chip = h("div", { class: "deck-tb-timer deck-timer-float", hidden: true });
    Deck.el.stage.append(chip);

    const html = `<svg viewBox="0 0 44 44" aria-hidden="true"><circle class="trk" cx="22" cy="22" r="${R}"/><circle class="arc" cx="22" cy="22" r="${R}" stroke-dasharray="${C.toFixed(2)}"/></svg><span class="t">--:--</span><span class="st" aria-hidden="true"></span>`;
    for (const el of [slot, chip]) { el.innerHTML = html; el.setAttribute("role", "timer"); }
    const parts = [slot, chip].map((el) => ({ el, arc: el.querySelector(".arc"), t: el.querySelector(".t"), st: el.querySelector(".st") }));

    // state: idle | running | paused. total/left in ms; endAt is the wall-clock end while running.
    let s = { status: "idle", total: 0, left: 0, endAt: 0 };
    try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v && v.status && v.status !== "idle") s = v; } catch (_) {}
    let timerId = 0, lastText = "";

    const minutes = () => Math.max(1, Math.round(+Deck.settings.timerMinutes || Deck.config?.timer?.minutes || 60));
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (_) {} };
    const remaining = () => (s.status === "running" ? s.endAt - Date.now() : s.left);

    function fmt(ms) {
      const over = ms < 0;
      const v = over ? Math.floor(Math.abs(ms) / 1000) : Math.ceil(ms / 1000);
      const hh = Math.floor(v / 3600), mm = Math.floor((v % 3600) / 60), ss = v % 60;
      const body = hh ? `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}` : `${mm}:${String(ss).padStart(2, "0")}`;
      return (over ? "−" : "") + body;
    }

    function render() {
      const ms = remaining();
      const frac = s.total ? Math.max(0, Math.min(1, ms / s.total)) : 0;
      const level = ms < 0 ? "over" : frac <= 0.05 ? "crit" : frac <= 0.2 ? "warn" : "ok";
      const text = fmt(ms);
      const show = s.status !== "idle";
      const titlebarHidden = Deck.el.titlebar.classList.contains("is-hidden");
      parts.forEach((p, i) => {
        p.el.hidden = !show || (i === 1 && !titlebarHidden);
        if (!show) return;
        p.el.dataset.level = level;
        p.el.dataset.status = s.status;
        // The ring drains clockwise from full; an overrun shows a full red ring.
        p.arc.style.strokeDashoffset = String(C * (1 - (ms < 0 ? 1 : frac)));
        if (text !== lastText) p.t.textContent = text;
        p.st.textContent = s.status === "paused" ? "paused" : "";
        p.el.setAttribute("aria-label", `Time left ${text}${s.status === "paused" ? ", paused" : ""}`);
      });
      lastText = text;
    }

    function loop() {
      clearInterval(timerId);
      timerId = s.status === "running" ? setInterval(render, 250) : 0;
      render();
    }
    function change(next) { s = Object.assign(s, next); save(); loop(); Deck.emit("timer", { status: s.status }); }

    function start() {
      const total = minutes() * 60000;
      change({ status: "running", total, left: total, endAt: Date.now() + total });
    }
    function pause() { if (s.status === "running") change({ status: "paused", left: s.endAt - Date.now() }); }
    function resume() { if (s.status === "paused") change({ status: "running", endAt: Date.now() + s.left }); }
    function toggle() { s.status === "idle" ? start() : s.status === "running" ? pause() : resume(); }
    function stop() { change({ status: "idle", left: 0, endAt: 0 }); }
    function restart() { start(); }
    /** Add (or remove) minutes: the length setting, and the running clock too. */
    function adjust(min) {
      const m = Math.max(1, Math.min(240, minutes() + min));
      Deck.setSetting("timerMinutes", m);
      if (s.status !== "idle") {
        const d = (m * 60000) - s.total;
        change({ total: m * 60000, ...(s.status === "running" ? { endAt: s.endAt + d } : { left: s.left + d }) });
      }
    }

    // Keep the ring and chip right when slides switch between a visible and a hidden title bar.
    new MutationObserver(render).observe(Deck.el.titlebar, { attributes: true, attributeFilter: ["class"] });
    Deck.on("settings", ({ key }) => key === "timerMinutes" && s.status === "idle" && render());
    document.addEventListener("visibilitychange", render);

    Deck.tools.timer = {
      get status() { return s.status; },
      get minutes() { return minutes(); },
      get left() { return remaining(); },
      start, pause, resume, toggle, stop, restart, adjust, presets: [20, 30, 45, 50, 60, 90],
    };
    Deck.addKeys(["p"], toggle, "Timer: start · pause · resume", "Timer");
    Deck.addKeys(["Shift+p"], stop, "Timer: stop", "Timer");
    Deck.addKeys(["r"], restart, "Timer: restart", "Timer");
    loop();
  });
})();
