Deck.slide({
  id: "evolution-stairs", section: "flow", title: "Evolution · maturity steps", className: "pt-s",
  
  html: `
    <div class="pt-stage"><div class="pt-stairs"><div class="pt-steps"><div class="pt-step" style="--h:260px;--t:10%" data-anim="rise" data-delay="0"><div class="no">1</div><h3>Ad hoc</h3><p>Individuals experiment with their own prompts.</p></div><div class="pt-step" style="--h:355px;--t:30%" data-anim="rise" data-delay="140"><div class="no">2</div><h3>Assisted</h3><p>Shared tools help with single tasks.</p></div><div class="pt-step" style="--h:450px;--t:50%" data-anim="rise" data-delay="280"><div class="no">3</div><h3>Guided</h3><p>Specs and rules steer the agent.</p></div><div class="pt-step inv" style="--h:545px;--t:70%" data-anim="rise" data-delay="420"><div class="no">4</div><h3>Orchestrated</h3><p>Several agents work in a managed flow.</p></div><div class="pt-step inv" style="--h:640px;--t:90%" data-anim="rise" data-delay="560"><div class="no">5</div><h3>Autonomous</h3><p>Agents deliver within clear limits.</p></div></div><div class="pt-hop" aria-hidden="true">↑</div></div></div>
    <p class="pt-use" data-anim="fade" data-delay="700"><b>Use when</b>something matures through clear levels. Each step is a different capability, not just “more”.</p>
`,
  notes: "Maturity stairs. The marker climbs the levels and resets; swap in the real levels.",
});
