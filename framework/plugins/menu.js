/* Right-click menu (navigation, tools, settings) and the ? keyboard help. */
(function () {
  "use strict";
  Deck.on("ready", () => {
    const { h, $$, clamp } = Deck.helpers;
    const esc = Deck.escapeHtml;
    const T = () => Deck.tools;

    // ---------------- context menu (screen space, normal UI size) ----------------
    const menu = h("div", { class: "deck-menu", hidden: true, role: "menu" });
    Deck.el.overlay.append(menu);
    let menuOpen = false;

    const swatches = (setting, current) =>
      `<div class="deck-menu-swatches">${T()
        .palette()
        .map(([name, v]) => `<button class="sw${v.toLowerCase() === (current || "").toLowerCase() ? " is-on" : ""}" style="--sw:${v}" data-set="${setting}" data-value="${v}" title="${name}" aria-label="${name}"></button>`)
        .join("")}</div>`;
    const seg = (setting, current, options) =>
      `<div class="deck-menu-seg">${options
        .map(([v, label]) => `<button class="${String(v) === String(current) ? "is-on" : ""}" data-set="${setting}" data-value="${v}">${label}</button>`)
        .join("")}</div>`;
    const item = (act, label, key, on) =>
      `<button class="deck-menu-item${on ? " is-on" : ""}" data-act="${act}" role="menuitem"><span class="chk">${on ? "✓" : ""}</span><span class="lbl">${label}</span>${key ? `<kbd>${key}</kbd>` : ""}</button>`;

    function renderMenu() {
      const s = Deck.settings;
      const laser = T().laser, draw = T().draw, tx = T().text, hl = T().highlighter, lens = T().lens, spot = T().spotlight;
      const inkColor = s.inkColor || Deck.helpers.cssList("--deck-ink-default")[0];
      const laserColor = s.laserColor || Deck.helpers.cssList("--deck-laser-default")[0];
      const dark = document.documentElement.dataset.theme === "dark";
      const lensW = s.lensWidth || lens.presets[s.lensSize] || lens.presets.m;
      const lensPreset = Object.entries(lens.presets).reduce((best, [k, v]) => (Math.abs(v - lensW) < Math.abs(lens.presets[best] - lensW) ? k : best), "m");
      const spotW = spot ? (s.spotWidth || spot.presets[s.spotSize] || spot.presets.m) : 0;
      const spotPreset = spot ? Object.entries(spot.presets).reduce((best, [k, v]) => (Math.abs(v - spotW) < Math.abs(spot.presets[best] - spotW) ? k : best), "m") : "m";
      menu.innerHTML = `
        <div class="deck-menu-head">${esc(String(Deck.state.index + 1))} / ${Deck.slides.length} · ${esc(Deck.slides[Deck.state.index].title)}</div>
        <div class="deck-menu-group">
          ${item("next", "Next", "→")}
          ${item("prev", "Previous", "←")}
          ${item("first", "First slide", "Home")}
          ${item("last", "Last slide", "End")}
          ${item("story", "Storyline…", "G")}
        </div>
        <div class="deck-menu-group">
          <div class="deck-menu-title">Tools</div>
          ${item("laser", "Laser pointer", "L", laser.active)}
          ${item("draw", "Draw", "D", draw.active)}
          ${seg("inkShape", s.inkShape, [["ellipse", "◯ 1"], ["rect", "▭ 2"], ["line", "╱ 3"], ["arrow", "→ 4"], ["curve", "↷ 5"]])}
          ${hl ? item("hl", "Highlighter", "H", hl.active) : ""}
          ${tx ? item("text", "Text", "A", tx.active) : ""}
          ${item("lens", "Zoom lens", "Z", lens.active)}
          ${spot ? item("spot", "Spotlight", "S", spot.active) : ""}
          ${item("clear", "Clear drawings", "X")}
        </div>
        <div class="deck-menu-group">
          <div class="deck-menu-title">Laser</div>
          ${swatches("laserColor", laserColor)}
          <div class="deck-menu-row"><span>Size</span>${seg("laserSize", s.laserSize, [["s", "S"], ["m", "M"], ["l", "L"]])}</div>
          <div class="deck-menu-row"><span>Trail</span>${seg("laserTrail", s.laserTrail, [[true, "On"], [false, "Off"]])}</div>
        </div>
        <div class="deck-menu-group">
          <div class="deck-menu-title">Drawing</div>
          ${swatches("inkColor", inkColor)}
          <div class="deck-menu-row"><span>Stroke</span>${seg("inkWidth", s.inkWidth, [["s", "Thin"], ["m", "Medium"], ["l", "Bold"]])}</div>
        </div>
        ${tx ? `<div class="deck-menu-group">
          <div class="deck-menu-title">Text</div>
          <div class="deck-menu-swatches">${tx.palette().map(([name, v]) => `<button class="sw${v.toLowerCase() === (s.txColor || tx.palette().find(([n]) => n === "Ink")?.[1] || tx.palette()[0][1]).toLowerCase() ? " is-on" : ""}" style="--sw:${v}" data-set="txColor" data-value="${v}" title="${name}" aria-label="${name}"></button>`).join("")}</div>
          <div class="deck-menu-row"><span>Size</span>${seg("txPreset", Object.entries(tx.presets).reduce((b, [k, v]) => (Math.abs(v - tx.size) < Math.abs(tx.presets[b] - tx.size) ? k : b), "m"), [["s", "S"], ["m", "M"], ["l", "L"], ["xl", "XL"]])}</div>
        </div>` : ""}
        ${hl ? `<div class="deck-menu-group">
          <div class="deck-menu-title">Highlighter</div>
          <div class="deck-menu-swatches">${hl.palette().map(([name, v]) => `<button class="sw${v.toLowerCase() === (s.hlColor || hl.palette()[0][1]).toLowerCase() ? " is-on" : ""}" style="--sw:${v}" data-set="hlColor" data-value="${v}" title="${name}" aria-label="${name}"></button>`).join("")}</div>
          <div class="deck-menu-row"><span>Width</span>${seg("hlWidth", s.hlWidth || "m", [["s", "S"], ["m", "M"], ["l", "L"]])}</div>
          <div class="deck-menu-row"><span>Strokes</span>${seg("hlMode", s.hlMode === "fade" ? "fade" : "keep", [["keep", "Keep"], ["fade", "Fade"]])}</div>
          <div class="deck-menu-row"><span>Toolbar</span>${seg("hlBar", s.hlBar || "auto", [["auto", "Touch"], ["always", "Always"], ["hidden", "Off"]])}</div>
        </div>` : ""}
        <div class="deck-menu-group">
          <div class="deck-menu-title">Zoom lens</div>
          <div class="deck-menu-row"><span>Size</span>${seg("lensPreset", lensPreset, [["s", "S"], ["m", "M"], ["l", "L"]])}</div>
          <div class="deck-menu-row"><span>Zoom</span>${seg("lensZoom", s.lensZoom, [[2, "2×"], [2.5, "2.5×"], [3, "3×"], [4, "4×"]])}</div>
        </div>
        ${spot ? `<div class="deck-menu-group">
          <div class="deck-menu-title">Spotlight</div>
          <div class="deck-menu-row"><span>Size</span>${seg("spotPreset", spotPreset, [["s", "S"], ["m", "M"], ["l", "L"]])}</div>
          <div class="deck-menu-row"><span>Shape</span>${seg("spotShape", spot.shapes.includes(s.spotShape) ? s.spotShape : "circle", [["circle", "Circle"], ["rect", "Rectangle"]])}</div>
          <div class="deck-menu-row"><span>Border</span>${seg("spotBorder", s.spotBorder === "static" ? "static" : "animated", [["animated", "Animated"], ["static", "Static"]])}</div>
          <div class="deck-menu-row"><span>Dimming</span>${seg("spotDim", s.spotDim || 0.7, [[0.5, "Light"], [0.7, "Medium"], [0.88, "Heavy"]])}</div>
        </div>` : ""}
        ${T().timer ? `<div class="deck-menu-group">
          <div class="deck-menu-title">Timer</div>
          <div class="deck-menu-row"><span>Length, min</span>${seg("timerPreset", T().timer.presets.includes(T().timer.minutes) ? T().timer.minutes : "", T().timer.presets.map((v) => [v, v]))}</div>
          <div class="deck-menu-row"><span>${T().timer.minutes} min</span><div class="deck-menu-seg"><button data-act="tm-5">− 5</button><button data-act="tm+5">+ 5</button></div></div>
          ${item("tstart", T().timer.status === "running" ? "Pause timer" : T().timer.status === "paused" ? "Resume timer" : "Start timer", "P")}
          ${item("trestart", "Restart timer", "R")}
          ${item("tstop", "Stop timer", "Shift+P")}
        </div>` : ""}
        <div class="deck-menu-group">
          <div class="deck-menu-title">View</div>
          <div class="deck-menu-row"><span>Theme</span>${seg("theme", dark ? "dark" : "light", [["light", "Light"], ["dark", "Dark"]])}</div>
          <div class="deck-menu-row"><span>Motion</span>${seg("reducedMotion", s.reducedMotion, [[false, "Full"], [true, "Reduced"]])}</div>
          ${Deck.background ? `<div class="deck-menu-row"><span>Background</span>${seg("backgroundMode", s.backgroundMode, [["on", "Animated"], ["still", "Still"], ["off", "Off"]])}</div>` : ""}
          ${Deck.countdown ? item("countdown", "Countdown screen", "K", Deck.countdown.isOpen) : ""}
          ${item("fullscreen", "Fullscreen", "F", !!(document.fullscreenElement || document.webkitFullscreenElement))}
          ${item("help", "Keyboard shortcuts", "?")}
        </div>`;
    }

    function openMenu(x, y) {
      renderMenu();
      menu.hidden = false;
      menuOpen = true;
      const r = menu.getBoundingClientRect();
      const left = clamp(x, 8, innerWidth - r.width - 8);
      const top = clamp(y, 8, innerHeight - r.height - 8);
      menu.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      Deck.pushLayer("menu", closeMenu);
    }
    function closeMenu() {
      menu.hidden = true;
      menuOpen = false;
      Deck.popLayer("menu");
    }

    const parse = (v) => (v === "true" ? true : v === "false" ? false : /^\d+(\.\d+)?$/.test(v) ? +v : v);
    menu.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.set) {
        const key = b.dataset.set, v = parse(b.dataset.value);
        if (key === "theme") Deck.setTheme(v);
        else if (key === "lensPreset") Deck.setSetting("lensWidth", T().lens.presets[v]);
        else if (key === "timerPreset") { Deck.setSetting("timerMinutes", +v); T().timer.adjust(0); }
        else if (key === "spotPreset") Deck.setSetting("spotWidth", T().spotlight.presets[v]);
        else if (key === "txPreset") T().text.setSize(T().text.presets[v]);
        else if (key === "inkShape") T().draw.pick(v);
        else Deck.setSetting(key, v);
        if (key === "inkColor" && !T().draw.active) T().draw.set(true);
        if (key === "hlColor" && !T().highlighter.active) T().highlighter.set(true);
        if (key === "txColor" && !T().text.active) T().text.set(true);
        renderMenu(); // stay open while adjusting settings
        return;
      }
      const act = b.dataset.act;
      if (act === "tm-5" || act === "tm+5") { T().timer.adjust(act === "tm-5" ? -5 : 5); renderMenu(); return; }
      closeMenu();
      ({
        next: () => Deck.next(),
        prev: () => Deck.prev(),
        first: () => Deck.first(),
        last: () => Deck.last(),
        story: () => Deck.storyline.show(),
        laser: () => T().laser.toggle(),
        draw: () => T().draw.toggle(),
        hl: () => T().highlighter.toggle(),
        text: () => T().text.toggle(),
        lens: () => T().lens.toggle(),
        spot: () => T().spotlight.toggle(),
        tstart: () => T().timer.toggle(),
        trestart: () => T().timer.restart(),
        tstop: () => T().timer.stop(),
        clear: () => T().draw.clear(),
        countdown: () => Deck.countdown.toggle(),
        fullscreen: () => Deck.toggleFullscreen(),
        help: () => toggleHelp(),
      })[act]?.();
    });

    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      openMenu(e.clientX, e.clientY);
    });
    window.addEventListener("pointerdown", (e) => {
      if (menuOpen && !menu.contains(e.target)) closeMenu();
    }, true);
    window.addEventListener("blur", () => menuOpen && closeMenu());

    // ---------------- keyboard help (scaled UI layer) ----------------
    const help = h("div", { class: "deck-modal deck-help", hidden: true, role: "dialog", "aria-label": "Keyboard shortcuts" });
    Deck.el.ui.append(help);
    const pretty = (k) =>
      ({ " ": "Space", "Shift+ ": "Shift+Space", ArrowRight: "→", ArrowLeft: "←", ArrowUp: "↑", ArrowDown: "↓", PageDown: "PgDn", PageUp: "PgUp", "Mod+z": "Ctrl/⌘+Z" }[k] || (k.length === 1 ? k.toUpperCase() : k));
    const ORDER = ["Navigate", "Tools", "Draw", "Highlighter", "Text", "Zoom lens", "Spotlight", "Timer", "View"];
    const order = (g) => (ORDER.indexOf(g) + 1 || 99);
    function renderHelp() {
      const groups = {};
      for (const k of Deck.keymap) (groups[k.group] ||= []).push(k);
      groups.View = (groups.View || []).concat([{ keys: ["Esc"], label: "Close popup / turn tools off" }, { keys: ["Right-click"], label: "Menu with settings" }]);
      help.innerHTML = `<div class="deck-panel deck-help-panel">
        <h2>Keyboard shortcuts</h2>
        <p class="deck-panel-sub">Settings you change are remembered in this browser.</p>
        <div class="deck-help-grid">${Object.entries(groups)
          .sort(([a], [b]) => order(a) - order(b))
          .map(([g, list]) => `<section><h3>${esc(g)}</h3><dl>${list
            .map((k) => `<dt>${k.keys.slice(0, 3).map((x) => `<kbd>${esc(pretty(x))}</kbd>`).join("")}</dt><dd>${esc(k.label)}</dd>`)
            .join("")}</dl></section>`)
          .join("")}</div></div>`;
    }
    function toggleHelp() {
      if (!help.hidden) {
        help.hidden = true;
        Deck.popLayer("help");
        return;
      }
      renderHelp();
      help.hidden = false;
      Deck.pushLayer("help", () => (help.hidden = true));
      Deck.animate(help.firstElementChild, "zoom", "in", { duration: 240 });
    }
    help.addEventListener("click", (e) => e.target === help && toggleHelp());
    Deck.addKeys(["?"], toggleHelp, "Keyboard shortcuts", "View");
    Deck.help = { toggle: toggleHelp };
  });
})();
