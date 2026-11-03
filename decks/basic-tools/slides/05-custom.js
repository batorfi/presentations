// A custom visual driven by JavaScript hooks: steps move a token through gates.
// Hooks: setup (once), onEnter, onStep(step, dir, ctx), onLeave; ctx.play() runs a tracked animation.
(function () {
  const GATES = ["Concept", "Architecture", "Specification", "Code review", "Merge"];
  const L = 60, R = 1680 - 60; // track ends inside the 1680 px content width
  const x = (i) => L + ((R - L) * (i + 0.5)) / GATES.length;

  function render(ctx, step, animate) {
    const token = ctx.$(".lane-token");
    const fill = ctx.$(".lane-fill");
    const target = step === 0 ? L - 40 : x(Math.min(step, GATES.length) - 1);
    const progress = step === 0 ? 0 : (target - L) / (R - L);
    // Move from wherever the element is now (even mid-animation) to the new state.
    const move = (el, to) => {
      const from = getComputedStyle(el).transform;
      el.getAnimations().forEach((a) => a.cancel());
      el.style.transform = to;
      if (animate) ctx.play(el, [{ transform: from }, { transform: to }], { duration: 650, easing: "cubic-bezier(0.65,0,0.35,1)", fill: "none" });
    };
    move(token, `translate3d(${target}px,0,0)`);
    move(fill, `scaleX(${progress})`);
    ctx.$$(".lane-gate").forEach((g, i) => {
      g.classList.toggle("is-passed", i < step - 1);
      g.classList.toggle("is-waiting", i === step - 1);
    });
    const status = ctx.$(".lane-status");
    status.innerHTML =
      step === 0
        ? `<span class="s-pill">Press → to walk the lane</span>`
        : step > GATES.length
        ? `<span class="s-pill is-ok">✓ Merged</span>`
        : `<span class="s-pill is-wait">● Waiting at ${GATES[step - 1]}</span>`;
  }

  Deck.slide({
    id: "custom",
    section: "custom",
    title: "Custom visuals with hooks",
    steps: GATES.length + 1,
    html: `
      <h2 class="s-title">Any visual, driven by the same steps</h2>
      <p class="s-lead">This lane is plain HTML moved by a few lines of JavaScript in <code>onStep</code>.</p>
      <div class="lane">
        <div class="lane-track"></div>
        <div class="lane-fill"></div>
        ${GATES.map((g, i) => `<div class="lane-gate" style="left:${x(i)}px">${i + 1}<span>${g}</span></div>`).join("")}
        <div class="lane-token"></div>
        <div class="lane-status"></div>
      </div>
    `,
    onEnter(ctx) {
      render(ctx, ctx.step, false);
    },
    onStep(step, dir, ctx) {
      render(ctx, step, dir !== "jump");
    },
  });
})();
