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
          <li>How agentic coding tools and services evolved</li>
          <li>AI development harnesses, by type and by job</li>
          <li>Frontier cloud and local open models viable today</li>
          <li>Why vibe coding fails; spec-driven development and dark software factories</li>
          <li>How the SWE role changes, and one habit to start</li>
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
  notes: "Series intro. Three Teams webinars for all SWE roles in Nokia ECE R&D. Part 1 (today, 60 min = 50 talk + 10 Q&A): foundations. Part 2 (90 min): the ADLC process in depth. Part 3 (90 min): live end-to-end demo from concept to merge request.",
});
