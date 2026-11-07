Deck.slide({
  id: "adr", section: "engineering", title: "ADR · a decision on one page", className: "p3-s",
  html: `<div class="p3-stage"><div class="p3-adr" data-anim="up">
  <div class="p3-adr-head"><code>ADR-000</code><h3>Short title of the decision</h3><span>Accepted</span><time>YYYY-MM-DD</time></div>
  <div class="p3-adr-grid">
    <div class="p3-adr-left"><div data-anim="fade" data-delay="200"><h4>Context</h4><p>Two or three sentences on the situation, the constraint and the question that forced a decision.</p></div>
      <div class="p3-adr-dec" data-anim="up" data-delay="450"><h4>Decision</h4>We will do Option B, because it fits the constraint.</div></div>
    <div class="p3-adr-right"><div data-anim="fade" data-delay="300"><h4>Options considered</h4><div class="p3-opts"><div class="p3-opt"><b>Option A</b>Simple to start, harder to scale.<em>Rejected</em></div><div class="p3-opt is-pick"><b>Option B</b>Balanced effort and flexibility.<em>Chosen</em></div><div class="p3-opt"><b>Option C</b>Most flexible, most work.<em>Rejected</em></div></div></div>
      <div data-anim="fade" data-delay="600"><h4>Consequences</h4><div class="p3-cons"><ul class="up"><li>A benefit we gain</li><li>A second benefit</li></ul><ul class="down"><li>A cost we accept</li><li>A risk to watch</li></ul></div></div></div>
  </div></div></div><p class="p3-use" data-anim="fade" data-delay="500"><b>Use it for</b> recording why a choice was made. One page: context, options, decision, consequences.</p>`,
  notes: "Architecture decision record: context, options, decision and consequences on one page. Sample text only.",
});
