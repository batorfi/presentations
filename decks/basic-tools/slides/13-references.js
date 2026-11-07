Deck.slide({
  id: "references-demo",
  section: "tools",
  title: "References",
  html: `
    <h2 class="s-title">Cite a source on the slide</h2>
    <div class="s-stack" style="margin-top:36px;max-width:1200px">
      <p class="s-body">Add <code>data-ref="r1"</code> to any element and a small marker appears next to it<span data-ref="r1"></span>.</p>
      <p class="s-body" data-step="1">Click the marker, press <b>Shift+R</b> or use the right-click menu: the full list opens, with this slide's items first<span data-ref="s1,v1"></span>.</p>
      <p class="s-body" data-step="2">The last slides list everything by category: sources, readings, videos and repositories.</p>
    </div>
  `,
  steps: 2,
  notes: "Demo list with placeholder entries (references/demo.js). In a real deck, each id points to an entry in references/<slug>.js.",
});
Deck.referencesSlide({ section: "tools", id: "references-demo-list" });
