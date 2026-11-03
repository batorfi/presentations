/* Storyline — G (or O) opens the whole flow, grouped by section, to jump to any slide.
 * Arrows move, Enter jumps, typing a number then Enter jumps to that slide, Esc closes. */
(function () {
  "use strict";
  Deck.on("ready", () => {
    const { h, $$ } = Deck.helpers;
    const esc = Deck.escapeHtml;
    const modal = h("div", { class: "deck-modal deck-storyline", hidden: true, role: "dialog", "aria-label": "Storyline" });
    Deck.el.ui.append(modal);

    let open = false;
    let sel = 0;
    let typed = "";

    function render() {
      const secs = Deck.sections();
      const cur = Deck.state.index;
      modal.innerHTML = `
        <div class="deck-panel deck-story-panel">
          <div class="deck-story-head">
            <div>
              <h2>${esc(Deck.config.title || "Storyline")}</h2>
              <p class="deck-panel-sub">${Deck.slides.length} slides · ${secs.length} sections · type a number and press Enter to jump</p>
            </div>
            <div class="deck-story-typed" aria-live="polite"></div>
          </div>
          <div class="deck-story-grid" style="--cols:${Math.min(secs.length, 4)}">
            ${secs
              .map(
                (s, si) => `
              <section class="deck-story-sec${s.slides.includes(cur) ? " is-current" : ""}">
                <header><span class="deck-story-num">${String(si + 1).padStart(2, "0")}</span>${esc(s.label || "—")}</header>
                <ol>${s.slides
                  .map(
                    (i) => `<li><button data-index="${i}" class="${i < cur ? "is-done" : i === cur ? "is-current" : ""}">
                      <span class="n">${i + 1}</span><span class="t">${esc(Deck.slides[i].title)}</span>
                    </button></li>`
                  )
                  .join("")}</ol>
              </section>`
              )
              .join("")}
          </div>
        </div>`;
      highlight();
    }
    function highlight() {
      $$("button[data-index]", modal).forEach((b) => b.classList.toggle("is-selected", +b.dataset.index === sel));
      modal.querySelector(`button[data-index="${sel}"]`)?.scrollIntoView({ block: "nearest" });
      modal.querySelector(".deck-story-typed").textContent = typed ? `→ ${typed}` : "";
    }

    function show() {
      if (open) return hide();
      open = true;
      sel = Deck.state.index;
      typed = "";
      render();
      modal.hidden = false;
      Deck.pushLayer("storyline", hide);
      Deck.animate(modal.firstElementChild, "zoom", "in", { duration: 260 });
    }
    function hide() {
      if (!open) return;
      open = false;
      modal.hidden = true;
      Deck.popLayer("storyline");
      if (Deck.keyTrap === trap) Deck.keyTrap = null;
    }
    function jump(i) {
      hide();
      Deck.go(i, 0);
    }

    function sectionStep(dir) {
      const secs = Deck.sections();
      const si = secs.findIndex((s) => s.slides.includes(sel));
      const target = secs[Math.max(0, Math.min(secs.length - 1, si + dir))];
      if (target) sel = target.slides[0];
    }

    function trap(e) {
      if (!open) return false;
      const n = Deck.slides.length;
      if (/^[0-9]$/.test(e.key)) {
        typed = (typed + e.key).slice(-3);
        if (+typed >= 1 && +typed <= n) sel = +typed - 1;
      } else if (e.key === "Backspace") typed = typed.slice(0, -1);
      else if (e.key === "ArrowDown") sel = Math.min(n - 1, sel + 1);
      else if (e.key === "ArrowUp") sel = Math.max(0, sel - 1);
      else if (e.key === "ArrowRight") sectionStep(1);
      else if (e.key === "ArrowLeft") sectionStep(-1);
      else if (e.key === "Home") sel = 0;
      else if (e.key === "End") sel = n - 1;
      else if (e.key === "Enter" || e.key === " ") return jump(sel), true;
      else if (e.key === "g" || e.key === "o") return hide(), true;
      else return false;
      highlight();
      return true;
    }

    modal.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-index]");
      if (b) jump(+b.dataset.index);
      else if (e.target === modal) hide();
    });
    modal.addEventListener("pointermove", (e) => {
      const b = e.target.closest("button[data-index]");
      if (b && +b.dataset.index !== sel) {
        sel = +b.dataset.index;
        highlight();
      }
    });

    const toggle = () => {
      show();
      if (open) Deck.keyTrap = trap;
    };
    Deck.storyline = { show: toggle, hide, get open() { return open; } };
    Deck.addKeys(["g", "o"], toggle, "Storyline: jump to a slide", "Navigate");
  });
})();
