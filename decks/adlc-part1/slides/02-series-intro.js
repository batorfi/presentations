// Slide 2 — Webinar series intro: three panes, Part 1 highlighted. Content from the Notion series page.
Deck.slide({
  id: "series-intro",
  section: "opening",
  title: "Introducing the ADLC webinar series",
  navTitle: "Series intro",
  html: `
    <p class="s-kicker" data-anim="fade">ADLC webinar series</p>
    <h2 class="s-title" data-anim="up" data-delay="100">Introducing the ADLC webinar series</h2>
    <div class="p1-series">
      <section class="p1-pane is-current" data-anim="up" data-delay="350">
        <header><span class="p1-pane-no">Part 1</span><span class="p1-pane-dur">60 min</span></header>
        <h3>Foundations: where agentic engineering is heading</h3>
        <ul>
          <li>Why "AI writes the code" is not enough: beyond vibe coding to specs</li>
          <li>What an AI software factory is, and how the ADLC defines it</li>
          <li>The landscape: harnesses, closed and open models, local dev machines</li>
          <li>The engineer's role: leaving the loop and owning delivery</li>
          <li>Building your own ADLC pipeline, starting from a brownfield code base</li>
        </ul>
        <span class="p1-pane-tag">Today</span>
      </section>
      <section class="p1-pane" data-anim="up" data-delay="550">
        <header><span class="p1-pane-no">Part 2</span><span class="p1-pane-dur">90 min</span></header>
        <h3>The ADLC process: stages, skills and human gates</h3>
        <ul>
          <li>The stages of the ADLC process</li>
          <li>Agent skills applied at each stage</li>
          <li>Human gates that keep accountability in place</li>
          <li>Context for greenfield and brownfield work</li>
          <li>Golden skill set, tooling, best practices, resources</li>
        </ul>
      </section>
      <section class="p1-pane" data-anim="up" data-delay="750">
        <header><span class="p1-pane-no">Part 3</span><span class="p1-pane-dur">90 min</span></header>
        <h3>Live end-to-end demo: from concept to merge request</h3>
        <ul>
          <li>Assembling context for spec-driven implementation</li>
          <li>The constitution as the key frame of the flow</li>
          <li>A full speckit run: specification, plan, tasks</li>
          <li>Live implementation, code review, E2E verification</li>
          <li>Documentation with techwriter skills, MR/PR content</li>
        </ul>
      </section>
    </div>`,
  notes: "Series intro. Three Teams webinars for all SWE roles in Nokia ECE R&D. Part 1 (today, 60 min = 50 talk + 10 Q&A): foundations in five chapters: why we must go beyond vibe coding, what an AI software factory and the ADLC are, the landscape of harnesses, models and dev machines, the engineer's role (leaving the loop, owning delivery), and how to build your own pipeline, starting from a brownfield code base. It closes with key takeaways, Q&A and references. Part 2 (90 min): the ADLC process in depth. Part 3 (90 min): live end-to-end demo from concept to merge request.",
});
