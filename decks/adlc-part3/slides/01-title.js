// Slide 1 — Title page. Spec: Notion "01 – Title page" (Part 3 – Slides). Series name, title, presenter, role, duration; edge-branches background in the right quarter.
Deck.slide({
  id: "title",
  section: "opening",
  title: "Practical Spec-Driven Development",
  navTitle: "Title",
  titlebar: false,
  className: "p3-title-slide",
  background: "edge-branches",
  html: `
    <p class="s-kicker" data-anim="fade">ADLC webinar series · Part 3</p>
    <h1 class="s-title p3-title" data-anim="up" data-delay="150"><span class="p3-title-em">Practical Spec-Driven Development</span></h1>
    <p class="p3-sub" data-anim="up" data-delay="300">Modern Software Engineering with Agentic Development Lifecycle Management</p>
    <div class="p3-title-meta" data-anim="up" data-delay="450">
      <div class="p3-presenter" data-speaker-open><b>Zsolt Bátorfi</b><span>Senior AI architect</span></div>
      <div class="p3-pill">90 minutes</div>
    </div>
    <div class="s-qr p3-title-qr" data-anim="zoom" data-delay="800" data-qr="https://batorfi.github.io/presentations/decks/adlc-part3/" data-label="Scan to follow along" data-caption="" data-size="180" data-layout="side"></div>
  `,
  notes: "Title page. ADLC webinar series, Part 3: Practical Spec-Driven Development. Presenter: Zsolt Bátorfi, senior AI architect. 90 minutes. The QR code opens the live deck on GitHub Pages.",
});
