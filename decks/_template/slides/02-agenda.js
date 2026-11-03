// PATTERN: agenda — a list that focuses one item per press (data-focus), released at the end.
// TODO: one <li> per section of the talk, in order.
Deck.slide({
  id: "agenda",
  section: "opening",
  title: "Agenda",
  html: `
    <h2 class="s-title">What we will cover</h2>
    <ul class="s-list s-body" data-focus data-focus-release>
      <li>First topic — the question it answers</li>
      <li>Second topic — the question it answers</li>
      <li>Third topic — the question it answers</li>
    </ul>
  `,
  notes: "Walk through the agenda in 30 seconds; say what the audience will be able to do afterwards.",
});
