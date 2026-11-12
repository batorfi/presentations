// Slide 7 — Why we need to go beyond vibe coding. Content from the Notion page "07 – Why we need to go beyond vibe coding".
// One stage, four beats (step n reveals beat n): 0 the Karpathy quote alone (it fades out at the next press), 1 the review-less vibe loop with the pro's and con's of vibe coding,
// 2 floor vs ceiling (agentic engineering), 3 spec-driven development flow with the closing line. Earlier beats stay, dimmed.
(function () {
  const QUOTE = "There’s a new kind of coding I call “vibe coding”, where you fully give in to the vibes, embrace exponentials, and forget that the code even exists.";

  // The vibe loop: five steps, a return path along the bottom, and a ghost "Review" node the dot passes straight through.
  const NODES = ["Describe", "Generate", "Run", "Paste the error", "Accept"];
  const loopSvg = `<svg viewBox="0 112 1680 294" class="p1-bv-loopsvg" aria-hidden="true">
    <defs><marker id="p1bvA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="p1-bv-ah"/></marker></defs>
    <path id="p1bvPath" class="p1-bv-ret" d="M1520 170 V350 H160 V170" marker-end="url(#p1bvA)"/>
    ${NODES.map((n, i) => `<g transform="translate(${30 + i * 340} 122)"><rect width="260" height="96" rx="16" class="p1-bv-node"/><text x="130" y="58" text-anchor="middle" class="p1-bv-nt">${n}</text></g>
      ${i < 4 ? `<path d="M${296 + i * 340} 170 H${364 + i * 340}" class="p1-bv-arr" marker-end="url(#p1bvA)"/>` : ""}`).join("")}
    <g transform="translate(710 302)"><rect width="260" height="96" rx="16" class="p1-bv-ghost"/><text x="130" y="58" text-anchor="middle" class="p1-bv-gt">Review</text></g>
    <path d="M730 322 L950 378 M950 322 L730 378" class="p1-bv-cross"/>
    <circle r="12" class="p1-bv-dotm"><animateMotion dur="8s" repeatCount="indefinite" path="M160 170 H1520 V350 H160 V170"/></circle>
  </svg>`;

  // Floor and ceiling.
  const ceilHtml = `<div class="p1-bv-fc">
      <div class="p1-bv-card is-floor"><div class="p1-bv-tag">FLOOR · vibe coding</div><p>“You don’t know how your system works, and you don’t look.”</p></div>
      <svg viewBox="0 0 120 120" class="p1-bv-rise" aria-hidden="true"><path d="M14 98 L100 22" class="p1-bv-riseline"/><path d="M78 20 H102 V44" class="p1-bv-risehead"/></svg>
      <div class="p1-bv-card is-ceil"><div class="p1-bv-tag">CEILING · agentic engineering</div><p>“You know how your system works so well that you don’t have to look.”</p></div>
    </div>`;

  // Spec-driven development flow, generic.
  const STEPS = ["Principles", "Specify", "Plan", "Tasks", "Implement", "Verify"];
  const sddHtml = `<div class="p1-bv-sddh">Specifications become executable</div>
    <svg viewBox="0 0 1170 170" class="p1-bv-flow" aria-hidden="true">
      <defs><marker id="p1bvB" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="p1-bv-ah"/></marker></defs>
      ${STEPS.map((s, i) => `<g transform="translate(${i * 200} 8)"><rect width="168" height="74" rx="14" class="p1-bv-fb${i === 0 ? " is-once" : ""}"/><text x="84" y="47" text-anchor="middle" class="p1-bv-ft">${s}</text></g>${i < 5 ? `<path d="M${170 + i * 200} 45 H${198 + i * 200}" class="p1-bv-arr" marker-end="url(#p1bvB)"/>` : ""}`).join("")}
      <path d="M1084 90 V138 H884 V92" class="p1-bv-ret" marker-end="url(#p1bvB)"/>
      <text x="984" y="164" text-anchor="middle" class="p1-bv-rt">repeat until it converges</text>
      <circle r="9" class="p1-bv-dotm"><animateMotion dur="6s" repeatCount="indefinite" path="M0 45 H1168" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/></circle>
    </svg>
    <div class="p1-bv-chips"><span class="p1-bv-chip">spec.md</span><span class="p1-bv-chip">plan.md</span><span class="p1-bv-chip">tasks.md</span><span class="p1-bv-chipcap">lives in the repository</span></div>
    <p class="p1-bv-sum">For decades, code was king and specifications were scaffolding, discarded once the real work of coding began. Spec-driven development flips this: specifications become executable and directly generate working implementations instead of only guiding them.</p>`;

  Deck.slide({
    id: "beyond-vibe",
    section: "why",
    title: "Why we need to go beyond vibe coding",
    navTitle: "Beyond vibe coding",
    className: "p1-bv",
    steps: 3, // step n reveals beat n; beat 0 is visible at once
    html: `
    <div class="p1-bv-stage" data-anim="fade">
      <blockquote class="p1-bv-q"><p>${QUOTE}</p><footer>Andrej Karpathy · 2025-02-02</footer></blockquote>
      <div class="p1-bv-main">
        <div class="p1-bv-loop">${loopSvg}<div class="p1-bv-loopcap">The loop has no review step</div></div>
        <div class="p1-bv-cols">
          <div class="p1-bv-vc"><div class="p1-bv-vctag">Vibe coding</div>
            <div class="p1-bv-vcin">
              <div class="p1-bv-pros"><h4>Pro’s</h4><ul><li>Idea to demo in minutes</li><li>Anyone can build</li><li>Cheap throwaway experiments</li></ul></div>
              <div class="p1-bv-cons"><h4>Con’s</h4>
                <div class="p1-bv-tiles">
                  <div class="p1-bv-tile"><b><span data-count="45">45</span>%</b><span>of AI-generated code tasks introduced vulnerabilities<small>Veracode, 2025-07</small></span></div>
                  <div class="p1-bv-tile"><b><span data-count="65">65</span>%</b><span>of 1,400+ vibe-coded production apps had security issues<small>Escape.tech, 2025-10</small></span></div>
                  <div class="p1-bv-tile"><b><span data-count="20">20</span>%</b><span>of generated samples recommended packages that do not exist<small>Larson and Nesbitt, 2025-04</small></span></div>
                  <div class="p1-bv-tile"><b><span data-count="3.2" data-dec="1">3.2</span>%</b><span>of AI-assisted commits leaked secrets, versus 1.5% baseline<small>GitGuardian, 2026-03</small></span></div>
                  <div class="p1-bv-tile"><b><span data-count="19">19</span>%</b><span>slower, while feeling faster<small>METR, 2025-07</small></span></div>
                  <div class="p1-bv-tile"><b><span data-count="69">69</span></b><span>vulnerabilities in 15 apps built with five AI tools<small>Tenzai, 2025-12</small></span></div>
                </div>
                <ul class="p1-bv-plain"><li>Nobody owns the code</li><li>No spec, no tests, no trace: the intent lives in a chat</li></ul>
              </div>
            </div>
          </div>
          <div class="p1-bv-rc">
            <div class="p1-bv-pane p1-bv-ceil">${ceilHtml}</div>
            <div class="p1-bv-pane p1-bv-sdd">${sddHtml}</div>
          </div>
        </div>
      </div>
    </div>`,
    onStep(step) { sync(step); },
    notes: "Beat 0: Karpathy's quote, 2025-02-02, shown alone; it leaves at the next press. Beat 1: in practice the loop is: describe what you want, the AI generates it, you run it, paste the error back and accept, often without reading the diff. The defining trait is the missing review (Simon Willison: building software with an LLM without reviewing the code it writes). Test: could you explain exactly what the code does? Pro's are speed, a low barrier and cheap experiments, fine for low-stakes prototypes. Con's, six tiles: Veracode 2025-07, 45% of AI-generated code tasks introduced vulnerabilities; Escape.tech 2025-10, 65% of 1,400+ vibe-coded production apps had security issues and 58% at least one critical; slopsquatting, 20% of 576,000 generated samples recommended packages that do not exist (Larson and Nesbitt 2025-04); GitGuardian 2026-03, 3.2% of AI-assisted commits leaked secrets versus 1.5% baseline; METR 2025-07, experienced developers were 19% slower yet felt faster; Tenzai 2025-12, 69 vulnerabilities in 15 apps from five AI tools. Also: nobody owns the code; no spec, tests or trace. Worst figures come from ungoverned setups. Beat 2: IndyDevDan: vibe coding is the floor, agentic engineering the ceiling. You know how your system works so well that you do not have to look. Beat 3: spec-driven development makes this repeatable: specifications become executable; principles once, then specify, plan, tasks, implement, verify, repeat until it converges; spec.md, plan.md and tasks.md live in the repository; for decades specs were scaffolding discarded once coding began, now they directly generate the implementation. It works for greenfield, exploration and brownfield. Next: what is an AI software factory.",
  });

  const reduce = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let prev = 0;
  function countUp(root) {
    root.querySelectorAll("[data-count]").forEach((el) => {
      const to = +el.dataset.count, dec = +(el.dataset.dec || 0);
      if (reduce()) { el.textContent = to.toFixed(dec); return; }
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / 900);
        el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dec);
        if (k < 1) requestAnimationFrame(tick);
      };
      el.textContent = 0;
      requestAnimationFrame(tick);
    });
  }
  // Step n = beat n: classes is-s1..is-sN accumulate so earlier beats stay in place.
  function sync(step) {
    const root = document.querySelector(".p1-bv");
    if (!root) return;
    // Leaving the slide: keep the last beat in place so it does not snap back to beat 0 during the exit transition.
    if (Deck.state.index !== Deck.slides.findIndex((d) => d.id === "beyond-vibe")) return;
    const cur = typeof step === "number" ? step : Deck.state.step || 0;
    for (let i = 1; i <= 3; i++) root.classList.toggle("is-s" + i, cur >= i);
    root.dataset.beat = cur;
    if (cur === 1 && prev !== 1) countUp(root);
    prev = cur;
  }
  Deck.on("slidechange", () => sync());
  Deck.on("stepchange", ({ step }) => sync(step));
  Deck.on("ready", () => sync(0));
})();
