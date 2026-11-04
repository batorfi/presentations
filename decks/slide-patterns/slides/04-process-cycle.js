Deck.slide({
  id: "process-cycle", section: "flow", title: "Process · cycle", className: "pt-s",
  
  html: `
    <div class="pt-split"><div data-anim="fade"><svg class="s-svg" viewBox="0 0 700 700" width="700" height="700" role="img" >
  <circle class="pt-edge pt-orbit-ring" cx="350" cy="350" r="250" stroke-dasharray="4 16" style="stroke-width:4"/>
  <g class="pt-orbit"><circle cx="350" cy="100" r="11" fill="var(--deck-accent)" style="filter:drop-shadow(0 0 8px var(--deck-accent))"/></g>
  <g data-anim="zoom" data-delay="200"><circle class="pt-node pt-hl4" style="--i:0" cx="350" cy="100" r="74"/><text class="pt-node-t pt-hl4" style="--i:0" x="350" y="110" text-anchor="middle">Plan</text></g><g data-anim="zoom" data-delay="320"><circle class="pt-node pt-hl4" style="--i:1" cx="600" cy="350" r="74"/><text class="pt-node-t pt-hl4" style="--i:1" x="600" y="360" text-anchor="middle">Build</text></g><g data-anim="zoom" data-delay="440"><circle class="pt-node pt-hl4" style="--i:2" cx="350" cy="600" r="74"/><text class="pt-node-t pt-hl4" style="--i:2" x="350" y="610" text-anchor="middle">Verify</text></g><g data-anim="zoom" data-delay="560"><circle class="pt-node pt-hl4" style="--i:3" cx="100" cy="350" r="74"/><text class="pt-node-t pt-hl4" style="--i:3" x="100" y="360" text-anchor="middle">Learn</text></g>
  <text class="pt-display" x="350" y="345" text-anchor="middle" style="font-size:44px;font-family:var(--deck-font-display)">Agentic loop</text>
  <text class="pt-cap" x="350" y="388" text-anchor="middle">repeat for every slice</text></svg></div><div class="pt-legend"><div class="pt-leg pt-hl4 pt-on-bd" style="--i:0" data-anim="right" data-delay="400"><i class="pt-hl4 pt-on-bg" style="--i:0">1</i><div><h3>Plan</h3><p>Pick the next smallest slice and define done.</p></div></div><div class="pt-leg pt-hl4 pt-on-bd" style="--i:1" data-anim="right" data-delay="520"><i class="pt-hl4 pt-on-bg" style="--i:1">2</i><div><h3>Build</h3><p>Agent drafts, engineer steers.</p></div></div><div class="pt-leg pt-hl4 pt-on-bd" style="--i:2" data-anim="right" data-delay="640"><i class="pt-hl4 pt-on-bg" style="--i:2">3</i><div><h3>Verify</h3><p>Tests, checks and review produce evidence.</p></div></div><div class="pt-leg pt-hl4 pt-on-bd" style="--i:3" data-anim="right" data-delay="760"><i class="pt-hl4 pt-on-bg" style="--i:3">4</i><div><h3>Learn</h3><p>Capture what worked; update the rules.</p></div></div></div></div>
    <p class="pt-use" data-anim="fade" data-delay="700"><b>Use when</b>the work repeats and learning feeds the next round. The orbiting dot shows the direction of travel.</p>
`,
  notes: "Cycle: four phases, one orbit. The dot and the highlight stay in sync.",
});
