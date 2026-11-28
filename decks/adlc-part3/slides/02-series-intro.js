// Slide 2 — Webinar series intro: three panes, Part 1 highlighted. Content from the Notion series page.
Deck.slide({
  id: "series-intro",
  section: "opening",
  title: "Introducing the ADLC webinar series",
  navTitle: "Series intro",
  html: `
    <p class="s-kicker" data-anim="fade">ADLC webinar series</p>
    <h2 class="s-title" data-anim="up" data-delay="100">Introducing the ADLC webinar series</h2>
    <div class="p3-series">
      <section class="p3-pane" data-anim="up" data-delay="350">
        <header><span class="p3-pane-no">Part 1</span><span class="p3-pane-dur">60 min</span></header>
        <h3>Foundations: where agentic engineering is heading</h3>
        <ul>
          <li>Why "AI writes the code" is not enough: beyond vibe coding to specs</li>
          <li>What an AI software factory is, and how the ADLC defines it</li>
          <li>The landscape: harnesses, closed and open models, local dev machines</li>
          <li>The engineer's role: leaving the loop and owning delivery</li>
          <li>Building your own ADLC pipeline, starting from a brownfield code base</li>
        </ul>
      </section>
      <section class="p3-pane" data-anim="up" data-delay="550">
        <header><span class="p3-pane-no">Part 2</span><span class="p3-pane-dur">90 min</span></header>
        <h3>The ADLC process: stages, skills and human gates</h3>
        <ul>
          <li>The stages of the ADLC process</li>
          <li>Agent skills applied at each stage</li>
          <li>Human gates that keep accountability in place</li>
          <li>Context for greenfield and brownfield work</li>
          <li>Golden skill set, tooling, best practices, resources</li>
        </ul>
      </section>
      <section class="p3-pane is-current" data-anim="up" data-delay="750">
        <header><span class="p3-pane-no">Part 3</span><span class="p3-pane-dur">90 min</span></header>
        <h3>Practical spec-driven development: from concept to merge request</h3>
        <ul>
          <li>Assembling context for spec-driven implementation</li>
          <li>The constitution as the key frame of the flow</li>
          <li>A full speckit run: specification, plan, tasks</li>
          <li>Live implementation, code review, E2E verification</li>
          <li>Documentation with techwriter skills, MR/PR content</li>
        </ul>
        <span class="p3-pane-tag">Today</span>
      </section>
    </div>`,
  notes: "Series intro. Three Teams webinars for all SWE roles in Nokia ECE R&D. Part 3 (today, 90 min): practical spec-driven development, a live end-to-end run that adds a feature to an existing code base, from concept to a merge request. Parts 1 (foundations) and 2 (the ADLC process) are the background. The speaker notes for this slide are a draft; refine them once the Part 3 content is specified.",
});
