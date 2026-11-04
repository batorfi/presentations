Deck.slide({
  id: "compare-plans", section: "compare", title: "Comparison · option cards", className: "pt-s",
  
  html: `
    <div class="pt-stage"><div class="pt-plans"><div class="pt-plan" data-anim="up" data-delay="0"><span class="tag s-chip">Option 1</span><h3>Pilot</h3><p class="for">Prove the idea with one team.</p><ul><li>One team, one use case</li><li>Light guardrails</li><li>Weekly check-in</li><li class="no">Shared platform</li><li class="no">Training programme</li></ul><div class="eff"><span>Effort</span><span class="pt-pips"><i class="on"></i><i class=""></i><i class=""></i></span></div></div><div class="pt-plan is-rec" data-anim="up" data-delay="150"><span class="tag s-pill is-ok">Recommended</span><h3>Guided rollout</h3><p class="for">Grow from pilot to several teams.</p><ul><li>Six teams, shared platform</li><li>Spec templates and rules</li><li>Training series</li><li>Metrics from day one</li></ul><div class="eff"><span>Effort</span><span class="pt-pips"><i class="on"></i><i class="on"></i><i class=""></i></span></div></div><div class="pt-plan" data-anim="up" data-delay="300"><span class="tag s-chip">Option 3</span><h3>Full programme</h3><p class="for">Change how the whole org builds.</p><ul><li>All teams, all products</li><li>Governance and audit</li><li>Dedicated platform team</li><li>Role and process redesign</li></ul><div class="eff"><span>Effort</span><span class="pt-pips"><i class="on"></i><i class="on"></i><i class="on"></i></span></div></div></div></div>
    <p class="pt-use" data-anim="fade" data-delay="700"><b>Use when</b>you recommend one of three. The recommended card is raised and glows softly; the others stay calm.</p>
`,
  notes: "Three option cards with a recommendation. Replace feature lists; keep four bullets or fewer.",
});
