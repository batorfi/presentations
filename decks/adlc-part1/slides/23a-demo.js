// Slide 24 — Demo: context engineering for a brownfield code base. Spec: Notion "24 – Demo" (author's layout, 2026-11-22):
// big DEMO header, the three demos under it, below that the flow input → techniques → grounded context.
// File is named 23a so the later slide files keep their names; presentation order is the <script> order in index.html.
(() => {
  const GRAPH = `<svg class="p24-svg" viewBox="0 0 420 150" aria-hidden="true">
    <g class="p24-ed"><line x1="60" y1="75" x2="150" y2="30"/><line x1="60" y1="75" x2="150" y2="120"/><line x1="150" y1="30" x2="250" y2="75"/><line x1="150" y1="120" x2="250" y2="75"/><line x1="250" y1="75" x2="350" y2="35"/><line x1="250" y1="75" x2="350" y2="115"/><line x1="150" y1="30" x2="150" y2="120"/></g>
    <g class="p24-nd"><circle cx="60" cy="75" r="16"/><circle cx="150" cy="30" r="14"/><circle cx="150" cy="120" r="14"/><circle class="p24-nd-pulse" cx="250" cy="75" r="18"/><circle cx="350" cy="35" r="14"/><circle cx="350" cy="115" r="14"/></g></svg>`;
  const WIKI = `<svg class="p24-svg" viewBox="0 0 420 150" aria-hidden="true">
    <g class="p24-ed2"><line x1="130" y1="43" x2="160" y2="70"/><line x1="270" y1="70" x2="290" y2="43"/><line x1="170" y1="96" x2="150" y2="100"/><line x1="240" y1="96" x2="280" y2="106"/></g>
    <g class="p24-pg"><rect x="20" y="20" width="110" height="46" rx="8"/><rect x="160" y="50" width="110" height="46" rx="8"/><rect x="290" y="20" width="110" height="46" rx="8"/><rect x="90" y="100" width="110" height="40" rx="8"/><rect x="250" y="106" width="110" height="38" rx="8"/></g>
    <g class="p24-md"><text x="34" y="48">.md</text><text x="174" y="78">.md</text><text x="304" y="48">.md</text><text x="104" y="126">.md</text><text x="264" y="130">.md</text></g></svg>`;
  const PIPS = Array.from({ length: 8 }, (_, i) => `<i class="${i < 6 ? "is-on" : ""}"></i>`).join("");
  Deck.slide({
    id: "demo",
    section: "building",
    title: "Context engineering demo",
    className: "p24-s",
    html: `
      <div class="p24">
        <h2 class="p24-head" data-anim="up">DEMO</h2>
        <div class="p24-demos">
          <div class="p24-d" data-step="1" data-anim="up"><span class="p24-live">LIVE</span><i class="p24-n">1</i><div><b>Graphify hosted service</b><span>Live in the browser</span></div></div>
          <div class="p24-d" data-step="1" data-anim="up" data-delay="150"><span class="p24-live">LIVE</span><i class="p24-n">2</i><div><b>Cursor IDE</b><span>With the graphify toolchain scaffolded</span></div></div>
          <div class="p24-d" data-step="1" data-anim="up" data-delay="300"><span class="p24-live">LIVE</span><i class="p24-n">3</i><div><b>NDAC OKF bundle</b><span>Built from the CUDO documentation corpus</span></div></div>
        </div>
        <div class="p24-flow">
          <div class="p24-in" data-step="2" data-anim="right">
            <div class="p24-c"><div class="p24-lab">Input</div><h3>Code base</h3><p>The existing repositories</p></div>
            <div class="p24-c"><div class="p24-lab">Input</div><h3>Documentation</h3><p>The existing documentation corpus</p></div>
          </div>
          <div class="p24-arr" data-step="3" data-anim="fade"><i></i></div>
          <div class="p24-eng" data-step="3" data-anim="up">
            <div class="p24-c p24-t1"><div class="p24-lab">Technique 1</div><h3>Graphify the code base</h3><p>Turns code, docs and images into a queryable knowledge graph of entities and relations.</p>${GRAPH}<ul class="p24-pts"><li>Key nodes and communities</li><li>A report on the structure</li><li>Agents query the graph</li></ul></div>
            <div class="p24-c p24-t2"><div class="p24-lab">Technique 2</div><h3>Build an LLM wiki</h3><p>Linked markdown pages from code and docs, in Google's Open Knowledge Format (OKF).</p>${WIKI}<ul class="p24-pts"><li>A bundle is a folder of .md files</li><li>Only the type field is required</li><li>Vendor-neutral, no SDK needed</li></ul></div>
          </div>
          <div class="p24-arr" data-step="4" data-anim="fade"><i></i></div>
          <div class="p24-c p24-out" data-step="4" data-anim="zoom"><div class="p24-lab">Result</div><h3>Grounded context</h3><p>The foundation for the ADLC pipeline of your AI factory</p><div class="p24-pips" aria-hidden="true">${PIPS}</div></div>
        </div>
      </div>`,
    notes: "Demo: context engineering for a brownfield code base. Message: do your context engineering homework before building your own ADLC workflows. Three live demos: (1) the Graphify hosted service in the browser, (2) the Cursor IDE with the graphify toolchain scaffolded, (3) an NDAC OKF bundle built from the CUDO documentation corpus. Flow: the existing code base and documentation go in; two techniques, graphifying the code base and building an LLM wiki from code and documentation; Graphify builds a queryable knowledge graph from code, docs and images (key nodes, communities, a report; agents query the graph instead of raw files). OKF is Google Cloud's open Open Knowledge Format of June 2026, formalizing the LLM wiki pattern: a bundle is a folder of markdown files, only the type field is required, vendor-neutral. The result is grounded context for the ADLC pipeline of the custom AI factory. Clicks: 1 demos, 2 inputs, 3 techniques, 4 result.",
  });
})();
