// Slide 5 — three challenges for R&D teams building their own AI software factory, with lessons learned.
// Bands, no steps; calm ambient motion. Wording agreed in the working session; no product names, no figures.
Deck.slide({
  id: "challenge",
  section: "why",
  title: "The challenge",
  className: "p1-ch",
  html: `
    <h2 class="p1-ch-head" data-anim="fade">Three challenges for every R&amp;D team building its own AI software factory</h2>
    <div class="p1-ch-bands">

      <section class="p1-ch-band p1-ch-b1" data-anim="up" data-delay="200">
        <div class="p1-ch-ico">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="54" class="p1-ch-ring"/>
            <path class="p1-ch-pulse" d="M18 62 H40 L48 38 L62 84 L72 62 H88"/>
            <path class="p1-ch-pulse2" d="M96 62 H102"/>
          </svg>
          <span class="p1-ch-no">1</span>
        </div>
        <div class="p1-ch-main">
          <h3>Design for interruption</h3>
          <p>Agents run for hours on machines that sleep, crash and restart.</p>
          <div class="p1-ch-chips"><span>Trust</span><span>Control</span></div>
        </div>
        <div class="p1-ch-learn">
          <div class="p1-ch-lh">What building a factory taught us</div>
          <p>Kill it at any step: nothing may be lost, nothing approved by accident</p>
          <p>A restart must not raise false alarms about what is loaded</p>
          <p>A timeout ends a step, never a gate</p>
        </div>
      </section>

      <section class="p1-ch-band p1-ch-b2" data-anim="up" data-delay="450">
        <div class="p1-ch-ico">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="54" class="p1-ch-ring"/>
            <rect x="30" y="38" width="60" height="44" rx="10" class="p1-ch-blk"/>
            <path d="M18 60 H102" class="p1-ch-lane"/>
            <circle cx="30" cy="60" r="6" class="p1-ch-dotm"/>
          </svg>
          <span class="p1-ch-no">2</span>
        </div>
        <div class="p1-ch-main">
          <h3>Treat models as replaceable workers</h3>
          <p>Local models differ and hallucinate, so own where they run and who judges.</p>
          <div class="p1-ch-chips"><span>Ownership</span></div>
        </div>
        <div class="p1-ch-learn">
          <div class="p1-ch-lh">What building a factory taught us</div>
          <p>Tool calling, context and speed differ per model</p>
          <p>A real model invented a tool that did not exist</p>
          <p>Size hardware and time for real runs, not demos</p>
        </div>
      </section>

      <section class="p1-ch-band p1-ch-b3" data-anim="up" data-delay="700">
        <div class="p1-ch-ico">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="54" class="p1-ch-ring"/>
            <path d="M60 34 l16 16 l-16 16 l-16 -16z" class="p1-ch-gate"/>
            <path d="M44 50 L28 84 M76 50 L92 84 M60 66 V88" class="p1-ch-link"/>
            <circle cx="28" cy="86" r="7" class="p1-ch-node p1-ch-n1"/>
            <circle cx="60" cy="90" r="7" class="p1-ch-node p1-ch-n2"/>
            <circle cx="92" cy="86" r="7" class="p1-ch-node p1-ch-n3"/>
          </svg>
          <span class="p1-ch-no">3</span>
        </div>
        <div class="p1-ch-main">
          <h3>Build the factory like a product</h3>
          <p>Shared rules and knowledge across the team, and a factory that is itself verified.</p>
          <div class="p1-ch-chips"><span>Collaboration</span></div>
        </div>
        <div class="p1-ch-learn">
          <div class="p1-ch-lh">What building a factory taught us</div>
          <p>One constitution and one flow for every engineer's factory</p>
          <p>A keeper curates the knowledge and flags what is stale</p>
          <p>A failing test suite passed silently because an exit code was swallowed</p>
        </div>
      </section>

    </div>`,
  notes: "Three challenges for R&D teams building their own AI software factory, each with lessons learned. 1) Design for interruption: agents run for hours on machines that sleep, crash and restart; test by killing at any step; a timeout ends a step, never a gate. 2) Treat models as replaceable workers: local models differ and hallucinate; own where they run and who judges; size hardware and time for real runs. 3) Build the factory like a product: one constitution and flow for every engineer's factory, curated knowledge, and a factory that is itself verified. Chips link back to the four problems: Trust, Control, Ownership, Collaboration. Earlier on this slide: AI can now write most of a feature; what it cannot do is be accountable for it.",
});
