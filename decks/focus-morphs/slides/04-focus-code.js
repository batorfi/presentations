Deck.slide({
  id: "focus-code",
  section: "focus",
  title: "Focus: lines of code or text",
  html: `
    <p class="s-kicker">data-focus-items · data-focus-from</p>
    <h2 class="s-title">Explain code line by line</h2>
    <div class="demo-focus-split">
      <div class="demo-code" data-step="1" data-anim="up" data-focus data-focus-from="2" data-focus-items=".ln" data-focus-release>
        <div class="ln"><span class="c">// a gate holds the lane until a person decides</span></div>
        <div class="ln"><span class="k">const</span> gate = lane.<span class="f">next</span>();</div>
        <div class="ln"><span class="k">await</span> gate.<span class="f">waitForDecision</span>();</div>
        <div class="ln"><span class="k">if</span> (gate.move === <span class="s">"approve"</span>) lane.<span class="f">advance</span>();</div>
        <div class="ln"><span class="f">record</span>(gate, { by: gate.decidedBy });</div>
      </div>
      <div class="s-stack" data-step="1" data-anim="fade" data-delay="200">
        <div class="s-card"><h3>Combine with steps</h3>
          <p>Step 1 brings the code in. <code>data-focus-from="2"</code> starts the line-by-line focus at step 2.</p></div>
        <div class="s-card"><h3>Pick your own points</h3>
          <p><code>data-focus-items=".ln"</code> chooses what counts as a point — here, one line each.</p></div>
      </div>
    </div>
  `,
  notes: "Step 1 shows the code, steps 2-6 focus each line, step 7 releases.",
});
