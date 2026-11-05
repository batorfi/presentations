/* Shared tool bookkeeping: tools register under Deck.tools; body.tool-active is set while any is on. */
(function () {
  "use strict";
  Deck.tools = {
    update() {
      const any = ["laser", "draw", "highlighter", "lens", "spotlight"].some((n) => Deck.tools[n] && Deck.tools[n].active);
      document.body.classList.toggle("tool-active", any);
    },
    /** [ and ] resize whichever sizeable tool (lens, spotlight or highlighter) is on. */
    resize(factor) {
      const t = ["lens", "spotlight", "highlighter"].map((n) => Deck.tools[n]).find((x) => x && x.active);
      if (t) t.resize(factor);
    },
    /** Named colours for menus: [name, value] from the theme's --deck-palette. */
    palette() {
      const names = ["Red", "Amber", "Teal", "Blue", "Violet", "Ink", "White"];
      return Deck.helpers.cssList("--deck-palette").map((v, i) => [names[i] || v, v]);
    },
  };
})();
