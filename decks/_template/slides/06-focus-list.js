// PATTERN: a numbered process — each press focuses the next step while the others recede.
// data-focus="reveal" keeps future items hidden until their turn.
Deck.slide({
  id: "focus-list",
  section: "core",
  title: "A process, step by step",
  html: `
    <h2 class="s-title">How it works, one step at a time</h2>
    <ol class="s-list s-body" data-focus="reveal" data-focus-release>
      <li><b>Specify</b> — what we want</li>
      <li><b>Delegate</b> — who or what does it</li>
      <li><b>Verify</b> — how we know it is right</li>
      <li><b>Own</b> — who is accountable</li>
    </ol>
  `,
  notes: "One sentence per step; pause on the last before releasing.",
});
