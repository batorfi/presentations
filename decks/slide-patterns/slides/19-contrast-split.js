Deck.slide({
  id: "contrast-split", section: "compare", title: "Contrast · before / after", className: "pt-s",
  
  html: `
    <div class="pt-stage" data-anim="fade"><div class="pt-ba"><div class="pt-pane before"><h3>Before</h3><div class="row"><div class="it"><b>1</b>Tickets wait in queues between hand-offs.</div><div class="it"><b>2</b>Context lives in people’s heads.</div><div class="it"><b>3</b>Quality is checked at the end.</div></div></div><div class="pt-pane after"><h3>After</h3><div class="row"><div class="it"><b>1</b>A spec flows to an agent draft in minutes.</div><div class="it"><b>2</b>Context is versioned next to the code.</div><div class="it"><b>3</b>Checks run on every change.</div></div></div><div class="pt-handle"></div></div></div>
    <p class="pt-use" data-anim="fade" data-delay="700"><b>Use when</b>a change replaces an old way with a new one. The divider sweeps across so the eye compares the same slots.</p>
`,
  notes: "Before/after wipe. Both panes use identical slots so each pair of ideas lines up.",
});
