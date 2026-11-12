// Slide 9 — What is an AI software factory? One living picture in six beats (step n reveals beat n):
// 0 the definition, 1 one factory (the 12-gate line, agents, independent judges), 2 people decide at every gate + the orchestrator,
// 3 the engine room (knowledge base, specs, record, durable store, models, control room), 4 the factory on many hosts (local, on-prem, cloud),
// 5 many factories per engineer and many engineers per product. Content from the Notion page "09 – What is an AI software factory?".
// All art is inline SVG (SMIL + CSS keyframes), no libraries, offline-safe. Colours come from --deck-* tokens in deck.css (p1-af-*).
(function () {
  // ---------- geometry of the line ----------
  const GATES = [["Roadmap"], ["Concept"], ["Architecture"], ["Experience"], ["Specification"], ["Plan"], ["Implement"], ["Code", "review"], ["UI", "review"], ["Verify"], ["Docs"], ["Merge"]];
  const JUDGED = [2, 3, 7, 8, 9], IFACE = [3, 8];
  const PHASES = [["PROGRAM", 0, 0], ["CONTRACT · what to build", 1, 5], ["BUILD AND PROVE", 6, 9], ["RELEASE", 10, 11]];
  const gx = (i) => 76 + i * (1528 / 11);
  const gyAt = (x) => 360 + 30 * Math.sin(((x - 76) / 1528) * 2 * Math.PI);
  const f1 = (n) => Math.round(n * 10) / 10;

  // sampled polyline for the conveyor, with cumulative length so the work item can pause exactly at each gate
  const STEP = 4, X0 = 40, X1 = 1640;
  const pts = [];
  for (let x = X0; x <= X1; x += STEP) pts.push([x, gyAt(x)]);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[cum.length - 1];
  const fracAt = (x) => { const k = (x - X0) / STEP, i = Math.floor(k), r = k - i; return ((cum[i] + (cum[Math.min(i + 1, cum.length - 1)] - cum[i]) * r)) / total; };
  const lineD = "M" + pts.map((p) => f1(p[0]) + " " + f1(p[1])).join(" L");

  // timeline of the work item (seconds): travel, pause at every gate (judged gates wait longer), then reset
  let t = 0;
  const K = [[0, 0]], TL = [];
  GATES.forEach((_, i) => {
    t += i === 0 ? 0.7 : 0.9; K.push([t, fracAt(gx(i))]);
    const a = t;
    t += i === 7 ? 2.8 : JUDGED.includes(i) ? 1.9 : i === 11 ? 1.5 : 1.1; K.push([t, fracAt(gx(i))]);
    TL.push([a, t]);
  });
  t += 0.8; K.push([t, 1]); t += 0.9; K.push([t, 1]);
  const D = t, tn = (s) => f1((s / D) * 1000) / 1000;
  const kp = K.map((k) => k[1].toFixed(4)).join(";"), kt = K.map((k) => tn(k[0])).join(";");
  // discrete on/off window
  const win = (s, e, extra = "") => `<animate attributeName="opacity" calcMode="discrete" values="0;1;0" keyTimes="0;${tn(s)};${tn(e)}" dur="${D}s" repeatCount="indefinite" ${extra}/>`;
  const LABELS = [["intent", 0, TL[1][1]], ["design", TL[1][1], TL[3][1]], ["spec", TL[3][1], TL[4][1]], ["plan", TL[4][1], TL[5][1]], ["code", TL[5][1], TL[8][1]], ["verified", TL[8][1], D]];
  const labelAnim = (s, e) => (s === 0
    ? `<animate attributeName="opacity" calcMode="discrete" values="1;0" keyTimes="0;${tn(e)}" dur="${D}s" repeatCount="indefinite"/>`
    : e >= D ? `<animate attributeName="opacity" calcMode="discrete" values="0;1" keyTimes="0;${tn(s)}" dur="${D}s" repeatCount="indefinite"/>`
      : win(s, e));

  const U = (id, x, y, w, h, cls, extra = "") => `<use href="#p1af-${id}" x="${f1(x)}" y="${f1(y)}" width="${w}" height="${h}" class="${cls}" ${extra}/>`;

  // ---------- shared symbols and gradients ----------
  const defs = `<svg class="p1-af-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
    <symbol id="p1af-person" viewBox="0 0 40 48"><circle cx="20" cy="13" r="9"/><path d="M3 47C3 31 11 26 20 26s17 5 17 21z"/></symbol>
    <symbol id="p1af-bot" viewBox="0 0 44 50"><rect x="19" y="1" width="6" height="10" rx="3"/><rect x="4" y="10" width="36" height="30" rx="11"/><circle cx="15" cy="25" r="4.5" style="fill:var(--deck-raised)"/><circle cx="29" cy="25" r="4.5" style="fill:var(--deck-raised)"/><rect x="12" y="42" width="20" height="7" rx="3.5"/></symbol>
    <symbol id="p1af-shield" viewBox="0 0 44 50"><path d="M22 2 40 9v14c0 12-8 20-18 25C12 43 4 35 4 23V9z"/><path d="M13 25l7 7 12-14" style="fill:none;stroke:var(--deck-raised)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="p1af-lock" viewBox="0 0 30 36"><rect x="3" y="15" width="24" height="19" rx="5"/><path d="M8 15v-4a7 7 0 0 1 14 0v4" style="fill:none;stroke:currentColor" stroke-width="4"/></symbol>
    <symbol id="p1af-db" viewBox="0 0 40 48"><path d="M3 10v28c0 5 8 8 17 8s17-3 17-8V10c0 5-8 8-17 8S3 15 3 10z"/><ellipse cx="20" cy="10" rx="17" ry="7" style="stroke:var(--deck-raised)" stroke-width="2"/></symbol>
    <symbol id="p1af-cloud" viewBox="0 0 200 110"><path d="M42 102C10 102 0 70 26 60 20 30 56 14 76 30 88 4 132 4 142 36c30-8 54 18 38 38 20 12 6 28-20 28z"/></symbol>
    <symbol id="p1af-bolt" viewBox="0 0 24 32"><path d="M14 1 2 18h8l-3 13L22 12h-8z"/></symbol>
    <radialGradient id="p1afOrb" cx=".35" cy=".3" r=".8"><stop offset="0" style="stop-color:var(--deck-raised)"/><stop offset="1" style="stop-color:var(--deck-muted)"/></radialGradient>
    <radialGradient id="p1afGlow" cx=".5" cy=".5" r=".5"><stop offset="0" style="stop-color:var(--deck-accent);stop-opacity:.55"/><stop offset="1" style="stop-color:var(--deck-accent);stop-opacity:0"/></radialGradient>
    <marker id="p1afA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" class="af-ah"/></marker>
    <marker id="p1afAw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" class="af-ahw"/></marker>
  </defs></svg>`;

  // a small factory: a curved line with five stations and one capsule travelling along it (used on hosts and workshops)
  const MF = "M8 40 C34 40 36 14 64 14 S102 44 132 22";
  const miniFactory = `<symbol id="p1af-minif" viewBox="0 0 140 56"><path d="${MF}" class="af-mf-l"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${[8, 38, 66, 98, 132][i]}" cy="${[40, 28, 14, 36, 22][i]}" r="6" class="af-mf-n"/>`).join("")}<circle r="6.5" class="af-mf-c"><animateMotion dur="5s" repeatCount="indefinite" path="${MF}"/></circle></symbol>`;

  // ---------- scene B: one factory ----------
  const phaseZones = PHASES.map(([name, a, b], k) => {
    const l = a === 0 ? gx(0) - 60 : (gx(a - 1) + gx(a)) / 2 + 4, r = b === 11 ? gx(11) + 60 : (gx(b) + gx(b + 1)) / 2 - 4;
    return `<rect x="${f1(l)}" y="124" width="${f1(r - l)}" height="396" rx="38" class="af-zone ${k % 2 ? "is-b" : ""}"/>
      <text x="${f1((l + r) / 2)}" y="104" text-anchor="middle" class="af-phase">${name}</text><path d="M${f1(l + 14)} 114H${f1(r - 14)}" class="af-brk"/>`;
  }).join("");

  const nodes = GATES.map((g, i) => {
    const x = gx(i), y = gyAt(x), j = JUDGED.includes(i), q = IFACE.includes(i);
    const label = g.length === 1 ? `<text x="${f1(x)}" y="${f1(y + 56)}" text-anchor="middle" class="af-gl">${g[0]}</text>`
      : `<text text-anchor="middle" class="af-gl"><tspan x="${f1(x)}" y="${f1(y + 56)}">${g[0]}</tspan><tspan x="${f1(x)}" y="${f1(y + 80)}">${g[1]}</tspan></text>`;
    return `<g class="af-gate"><circle cx="${f1(x)}" cy="${f1(y)}" r="32" class="af-nglow"/>${j ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="28" class="af-njr"/>` : ""}<circle cx="${f1(x)}" cy="${f1(y)}" r="19" class="af-node${q ? " is-dash" : ""}"/>${label}</g>`;
  }).join("");

  const judges = JUDGED.map((i) => {
    const x = gx(i), y = gyAt(x), [a, b] = TL[i];
    return `<g class="af-judge"><path d="M${f1(x)} ${f1(y - 70)}V${f1(y - 34)}" class="af-jl"/>${U("bot", x - 22, y - 120, 44, 50, "af-jd")}${U("shield", x + 8, y - 96, 26, 30, "af-jd2")}
      <g><circle cx="${f1(x + 30)}" cy="${f1(y - 112)}" r="13" class="af-ok"/><path d="M${f1(x + 24)} ${f1(y - 112)}l4 4 8-9" class="af-okc"/>${win(a + 0.5, b - 0.1)}</g></g>`;
  }).join("");

  const people = GATES.map((_, i) => {
    const x = gx(i), y = gyAt(x), [a, b] = TL[i];
    return `<g class="af-person"><path d="M${f1(x)} 208V${f1(y - 34)}" class="af-stem"/>${U("person", x - 19, 154, 38, 46, "af-pe")}
      <circle cx="${f1(x)}" cy="176" r="30" class="af-pring">${win(a, b - 0.5).replace("<animate", "<animate")}</circle>
      <g><circle cx="${f1(x + 24)}" cy="160" r="13" class="af-ok"/><path d="M${f1(x + 18)} 160l4 4 8-9" class="af-okc"/>${win(b - 0.6, b + 0.2)}</g></g>`;
  }).join("");
  const rev = (() => {
    const [a] = TL[7], x6 = gx(6), x7 = gx(7);
    return `<g class="af-rev"><path d="M${f1(x7)} ${f1(gyAt(x7) - 26)}C${f1(x7 - 20)} ${f1(gyAt(x7) - 66)} ${f1(x6 + 20)} ${f1(gyAt(x6) - 66)} ${f1(x6)} ${f1(gyAt(x6) - 28)}" class="af-revp" marker-end="url(#p1afAw)"/><text x="${f1((x6 + x7) / 2)}" y="${f1(gyAt(x6) - 74)}" text-anchor="middle" class="af-revt">revise</text>${win(a + 0.2, a + 1.5)}</g>`;
  })();

  const capsule = `<g class="af-cap"><animateMotion dur="${D}s" repeatCount="indefinite" calcMode="linear" keyPoints="${kp}" keyTimes="${kt}" path="${lineD}"/>
    <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.01;${tn(D - 1.7)};${tn(D - 0.9)};1" dur="${D}s" repeatCount="indefinite"/>
    <circle r="26" class="af-cglow"/><circle r="12" class="af-capc"/>
    ${LABELS.map(([l, s, e]) => `<g opacity="0">${labelAnim(s, e)}<rect x="-${l.length * 6.4 + 12}" y="-60" width="${l.length * 12.8 + 24}" height="30" rx="15" class="af-pill"/><text x="0" y="-38" text-anchor="middle" class="af-pt">${l}</text></g>`).join("")}</g>`;

  const rail = `<g class="af-orch"><rect x="76" y="18" width="1528" height="48" rx="24" class="af-rail"/><text x="112" y="51" class="af-rt">Orchestrator · ordinary code, decides what happens next, never what gets approved</text>
    <rect x="1394" y="26" width="190" height="32" rx="16" class="af-planner"/><text x="1489" y="49" text-anchor="middle" class="af-pl">planner · drafts</text>
    ${[0, 1, 2].map((k) => `<circle r="6" class="af-rd"><animateMotion dur="7s" begin="-${k * 2.3}s" repeatCount="indefinite" path="M1140 42H1370"/></circle>`).join("")}</g>`;

  const bots = [["research", 700], ["design", 910], ["build", 1120], ["document", 1330]];
  const band = `<g class="af-band"><rect x="60" y="640" width="1560" height="108" rx="54" class="af-bandr"/><text x="104" y="704" class="af-bt">Agents do the work</text>
    ${bots.map(([n, x]) => `${U("bot", x - 22, 652, 44, 50, "af-ag")}<text x="${x}" y="734" text-anchor="middle" class="af-bc">${n}</text>`).join("")}
    ${[3, 7, 10].map((i, k) => { const x = f1(gx(i)), y0 = f1(gyAt(gx(i)) + 100); return `<path d="M${x} ${y0}V640" class="af-artl"/><circle cx="${x}" r="7" class="af-art"><animate attributeName="cy" values="636;${y0}" dur="3s" begin="${k * 0.7}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.95;0" dur="3s" begin="${k * 0.7}s" repeatCount="indefinite"/></circle>`; }).join("")}</g>`;

  const never = `<g class="af-never">${U("bot", 1210, 520, 44, 50, "af-ag")}<path d="M1266 545H1336" class="af-nl"/><path d="M1289 528l24 34M1313 528l-24 34" class="af-nx"/>${U("bot", 1346, 520, 44, 50, "af-jd")}${U("shield", 1374, 546, 24, 28, "af-jd2")}<text x="1300" y="606" text-anchor="middle" class="af-nt">never the same agent</text></g>`;
  const legend = `<g class="af-legend"><circle cx="82" cy="548" r="11" class="af-node is-dash" style="stroke-width:3"/><text x="106" y="556" class="af-lg">dashed: interface work only</text><circle cx="82" cy="584" r="11" class="af-node"/><circle cx="82" cy="584" r="15" class="af-njr"/><text x="106" y="592" class="af-lg">double ring: judged gate</text></g>`;
  const rule = `<text class="af-rule"><tspan x="780" y="552" text-anchor="middle">Nothing moves forward on its own.</tspan><tspan x="780" y="584" text-anchor="middle">A missing person never approves.</tspan></text>`;

  const sceneB = `<svg viewBox="0 0 1680 780" class="p1-af-svg" aria-hidden="true">
    <g class="af-fac">
      ${phaseZones}
      <path d="${lineD}" class="af-line-g"/><path d="${lineD}" class="af-line"/><path d="${lineD}" class="af-flow"/>
      <g class="af-l-people">${people}${rev}</g>
      <g class="af-l-judges af-fine">${judges}${never}</g>
      <g class="af-l-band af-fine">${band}</g>
      ${nodes}
      <g class="af-l-rail">${rail}</g>
      <g class="af-fine af-l-legend">${legend}</g><g class="af-fine af-l-rule">${rule}</g>
      ${capsule}
    </g>
    ${engineRoom()}
  </svg>`;

  // ---------- engine room (beat 3): the other key parts around the shrunken line ----------
  function engineRoom() {
    const kn = [[70, 250, 12], [150, 215, 9], [235, 255, 14], [285, 330, 9], [200, 330, 11], [105, 340, 9], [60, 430, 11], [155, 440, 13], [250, 460, 10], [305, 540, 8], [195, 545, 11], [95, 545, 9]];
    const ke = [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [0, 5], [5, 6], [4, 7], [6, 7], [7, 8], [3, 8], [8, 9], [7, 10], [10, 11], [6, 11], [1, 4]];
    const knowledge = `<g class="af-e af-e-kn" style="--d:.9s"><g transform="translate(0 -30)">${ke.map(([a, b]) => `<path d="M${kn[a][0]} ${kn[a][1]}L${kn[b][0]} ${kn[b][1]}" class="af-kne"/>`).join("")}
      ${kn.map(([x, y, r], k) => `<circle cx="${x}" cy="${y}" r="${r}" class="af-knn"/>`).join("")}
      <circle cx="195" cy="330" r="11" class="af-knnew"/><circle cx="195" cy="330" r="11" class="af-knring"/></g>
      <text x="180" y="578" text-anchor="middle" class="af-et">Knowledge base</text><text x="180" y="608" text-anchor="middle" class="af-es">context in, learnings back</text></g>`;
    const sheets = [["Constitution", 0], ["Spec", 1], ["Plan", 2], ["Tasks", 3]].map(([n, k]) => `<g transform="translate(${1440 + k * 12} ${210 + k * 62}) rotate(${-4 + k * 2.6})"><rect width="190" height="74" rx="14" class="af-sheet"/><path d="M18 24h110M18 42h150M18 58h80" class="af-sline"/><text x="18" y="22" class="af-sn" style="display:none">${n}</text></g>`).join("");
    const specs = `<g class="af-e af-e-sp" style="--d:1.3s">${sheets}<text x="1540" y="606" text-anchor="middle" class="af-et">Specs in the repository</text><text x="1540" y="636" text-anchor="middle" class="af-es">intent lives beside the code</text></g>`;
    const record = `<g class="af-e af-e-rec" style="--d:1.7s"><path d="M80 705C140 670 190 740 250 705S360 670 420 705 520 740 560 705" class="af-recw"/><path d="M80 705C140 670 190 740 250 705S360 670 420 705 520 740 560 705" class="af-recd"/>
      ${[0, 1, 2, 3].map((k) => `<circle r="7" class="af-recdot"><animateMotion dur="6s" begin="-${k * 1.5}s" repeatCount="indefinite" path="M560 705C520 740 460 670 420 705S310 740 250 705 140 670 80 705"/></circle>`).join("")}
      <text x="320" y="652" text-anchor="middle" class="af-et">The record</text><text x="320" y="758" text-anchor="middle" class="af-es">who, what, why: one stream</text></g>`;
    const store = `<g class="af-e af-e-store" style="--d:1.7s">${U("db", 702, 672, 46, 56, "af-st")}<text x="725" y="652" text-anchor="middle" class="af-et">Durable store</text><text x="725" y="758" text-anchor="middle" class="af-es">survives a crash</text></g>`;
    const models = `<g class="af-e af-e-mod" style="--d:2.1s">${[0, 1, 2, 3, 4].map((k) => `<circle cx="${930 + k * 52}" cy="706" r="21" class="af-orb${k === 1 ? " is-act" : ""}"/>`).join("")}
      ${U("cloud", 1230, 672, 78, 44, "af-cl-dash")}<path d="M1190 706H1226" class="af-dash"/>
      <text x="1060" y="652" text-anchor="middle" class="af-et">Models</text><text x="1150" y="758" text-anchor="middle" class="af-es">local by default, cloud by policy</text></g>`;
    const control = `<g class="af-e af-e-ctl" style="--d:2.5s"><rect x="700" y="14" width="230" height="104" rx="26" class="af-console"/>${U("person", 730, 36, 36, 44, "af-pe")}${U("person", 783, 36, 36, 44, "af-pe")}${U("person", 836, 36, 36, 44, "af-pe")}
      <path d="M730 98H872" class="af-inbox"/><circle cx="890" cy="98" r="7" class="af-inbdot"/>
      <text x="962" y="64" class="af-et" style="text-anchor:start">Control room</text><text x="962" y="96" class="af-es" style="text-anchor:start">everything that needs you, one place</text>
      <path d="M815 120V190" class="af-ctlink"/><circle r="6" class="af-ctdot"><animateMotion dur="3s" repeatCount="indefinite" path="M815 120V190"/></circle></g>`;
    const orch = `<g class="af-e af-e-orch" style="--d:.4s"><text x="340" y="130" class="af-et" style="text-anchor:start">Orchestrator</text><text x="340" y="162" class="af-es" style="text-anchor:start">plain code decides what happens next</text>
      <rect x="1100" y="124" width="262" height="36" rx="18" class="af-planner"/><text x="1231" y="149" text-anchor="middle" class="af-pl">planner (LLM) drafts</text></g>`;
    const links = `<g class="af-e af-e-links" style="--d:1.1s">
      <path d="M330 340C350 340 356 370 372 380" class="af-lk"/><circle r="5" class="af-lkd"><animateMotion dur="2.4s" repeatCount="indefinite" path="M372 380C356 370 350 340 330 340"/></circle>
      <path d="M338 300C350 300 356 330 372 340" class="af-lk"/><circle r="5" class="af-lkd"><animateMotion dur="2.4s" begin="-1.2s" repeatCount="indefinite" path="M338 300C350 300 356 330 372 340"/></circle>
      <path d="M1356 380C1372 380 1384 330 1432 300" class="af-lk"/><circle r="5" class="af-lkd2"><animateMotion dur="2.8s" repeatCount="indefinite" path="M1356 380C1372 380 1384 330 1432 300"/></circle>
      <path d="M700 628C700 640 700 646 700 652" class="af-lk"/></g>`;
    return `<g class="af-room">${links}${orch}${knowledge}${specs}${record}${store}${models}${control}</g>`;
  }

  // ---------- scene C: hosts ----------
  const sceneC = `<svg viewBox="0 0 1680 780" class="p1-af-svg" aria-hidden="true">
    <path d="M840 120C760 190 420 210 270 318" class="af-lk"/><circle r="7" class="af-lkd"><animateMotion dur="4s" repeatCount="indefinite" path="M840 120C760 190 420 210 270 318"/></circle>
    <path d="M840 120V318" class="af-lk"/><circle r="7" class="af-lkd"><animateMotion dur="3s" begin="-1s" repeatCount="indefinite" path="M840 120V318"/></circle>
    <path d="M840 120C920 190 1260 200 1400 300" class="af-lk"/><circle r="7" class="af-lkd af-wake"><animateMotion dur="4s" begin="-2s" repeatCount="indefinite" path="M840 120C920 190 1260 200 1400 300"/></circle>
    <rect x="700" y="14" width="280" height="104" rx="26" class="af-console"/>${U("person", 744, 36, 36, 44, "af-pe")}${U("person", 802, 36, 36, 44, "af-pe")}${U("person", 860, 36, 36, 44, "af-pe")}<path d="M744 98H900" class="af-inbox"/>
    <text x="1010" y="64" class="af-et" style="text-anchor:start">Control room</text><text x="1010" y="96" class="af-es" style="text-anchor:start">people decide here, from anywhere</text>
    <g class="af-prov">${U("cloud", 60, 14, 270, 150, "af-cl-dash")}<text x="195" y="96" text-anchor="middle" class="af-es" style="font-weight:700;fill:var(--deck-text-2)">Model providers</text>
      <path d="M195 170V312" class="af-dash" marker-end="url(#p1afA)"/><text x="215" y="236" class="af-es" style="text-anchor:start">judges only, by policy</text></g>
    <g class="af-refd"><rect x="1370" y="30" width="250" height="40" rx="20" class="af-ref"/><text x="1495" y="58" text-anchor="middle" class="af-ref-t">reference design</text></g>

    <g class="af-host h1"><rect x="80" y="330" width="380" height="214" rx="28" class="af-dev"/><path d="M50 544H490L470 574H70z" class="af-devb"/>
      ${U("minif", 110, 350, 316, 126, "af-mfu")}${[0, 1, 2, 3].map((k) => `<circle cx="${150 + k * 44}" cy="504" r="12" class="af-orb${k === 0 ? " is-act" : ""}"/>`).join("")}${U("lock", 396, 494, 28, 33, "af-lk-ic")}
      <text x="270" y="632" text-anchor="middle" class="af-loc">LOCAL</text><text x="270" y="664" text-anchor="middle" class="af-es">code never leaves the machine</text></g>
    <g class="af-refuse"><path d="M486 430H622" class="af-dash-r" marker-end="url(#p1afAw)"/><circle cx="554" cy="430" r="19" class="af-xc"/><path d="M546 422l16 16M562 422l-16 16" class="af-xx"/></g>

    <g class="af-host h2"><rect x="650" y="316" width="290" height="244" rx="34" class="af-dev"/>
      ${[0, 1, 2, 3].map((k) => `<rect x="672" y="${338 + k * 52}" width="246" height="40" rx="20" class="af-slot${k > 1 ? " is-empty" : ""}"/>${k < 2 ? U("minif", 704, 336 + k * 52, 150, 48, "af-mfu") : ""}<circle cx="896" cy="${358 + k * 52}" r="6" class="af-led${k > 1 ? " is-off" : ""}"/>`).join("")}
      ${[0, 1, 2].map((k) => `<circle cx="990" cy="${372 + k * 62}" r="24" class="af-orb${k === 1 ? " is-act" : ""}"/>`).join("")}
      <text x="840" y="632" text-anchor="middle" class="af-loc">ON-PREM</text><text x="840" y="664" text-anchor="middle" class="af-es">team server, inside the network</text></g>

    <g class="af-host h3"><g class="af-sleepable">${U("cloud", 1170, 290, 460, 258, "af-cl-host")}${U("minif", 1290, 350, 220, 88, "af-mfu")}${[0, 1, 2].map((k) => `<circle cx="${1340 + k * 44}" cy="496" r="13" class="af-orb${k === 0 ? " is-act" : ""}"/>`).join("")}</g>
      <g class="af-zzz"><text x="1560" y="334" class="af-z1">z</text><text x="1582" y="312" class="af-z2">z</text><text x="1608" y="288" class="af-z3">Z</text></g>
      <text x="1400" y="632" text-anchor="middle" class="af-loc">CLOUD</text><text x="1400" y="664" text-anchor="middle" class="af-es">your account, paid only while working</text></g>

    <g class="af-mover">${U("minif", 0, 0, 120, 48, "af-mfu")}</g>
    <text x="840" y="742" text-anchor="middle" class="af-cap2 c1">Placement is a person's decision, checked against policy, models, capacity and cost.</text>
    <text x="840" y="742" text-anchor="middle" class="af-cap2 c2">A waiting gate costs nothing: the cloud host sleeps until a person decides.</text>
    <text x="840" y="742" text-anchor="middle" class="af-cap2 c3">Factories move between hosts. Decisions stay with people.</text>
  </svg>`;

  // ---------- scene D: many factories per engineer, many engineers per product ----------
  const lanes = [0, 1, 2].map((k) => {
    const y = 168 + k * 150;
    return `<g class="af-lane l${k}"><text x="64" y="${y + 6}" class="af-ln">Factory ${k + 1}</text>
      <rect x="50" y="${y + 18}" width="470" height="84" rx="42" class="af-lane-r"/>${U("minif", 78, y + 28, 400, 64, "af-mfu")}
      <g class="af-st-work">${U("bolt", 560, y + 36, 24, 32, "af-bolt")}<text x="594" y="${y + 66}" class="af-ssl">working</text></g>
      <g class="af-st-wait"><circle cx="572" cy="${y + 52}" r="16" class="af-waitc"/><text x="572" y="${y + 60}" text-anchor="middle" class="af-waitq">!</text><text x="598" y="${y + 66}" class="af-ssl">waits</text></g>
      </g>`;
  }).join("");
  const eng = [[905, 190], [1075, 150], [1245, 126], [1415, 150], [1585, 190]];
  const engineers = eng.map(([x, y], k) => `<g class="af-eng e${k}"><circle cx="${x}" cy="${y}" r="62" class="af-swirl"/><circle cx="${x}" cy="${y}" r="46" class="af-engc"/>${U("person", x - 18, y - 24, 36, 44, "af-pe")}
      ${U("lock", x + 26, y + 20, 20, 24, "af-lk-ic")}
      <g class="af-orbit" style="transform-origin:${x}px ${y}px;animation-duration:${9 + k * 1.3}s"><circle cx="${x + 62}" cy="${y}" r="7" class="af-orb2"/><circle cx="${x - 62}" cy="${y}" r="5" class="af-orb2"/></g>
      <path d="M${x} ${y + 62}V410" class="af-tl tl${k}"/></g>`).join("");
  const sceneD = `<svg viewBox="0 0 1680 780" class="p1-af-svg" aria-hidden="true">
    <rect x="10" y="20" width="750" height="672" rx="52" class="af-ws"/>
    ${U("person", 44, 42, 38, 46, "af-pe")}<text x="102" y="72" class="af-et" style="text-anchor:start">One engineer</text><text x="102" y="102" class="af-es" style="text-anchor:start">three factories, one shared model pool</text>
    <g class="af-inboxg"><text x="600" y="60" class="af-es" style="text-anchor:end;font-weight:700">Needs you</text>${[0, 1, 2].map((k) => `<circle cx="${628 + k * 30}" cy="52" r="10" class="af-ib ib${k}"/>`).join("")}</g>
    ${lanes}
    ${[0, 1, 2].map((k) => `<circle cx="722" cy="${220 + k * 150}" r="22" class="af-orb${k === 1 ? " is-act" : ""}"/>`).join("")}
    <text x="385" y="652" text-anchor="middle" class="af-es" style="font-weight:700;fill:var(--deck-text-2)">While one waits for a person, another uses the machine</text>

    <text x="1235" y="46" text-anchor="middle" class="af-et" style="fill:var(--deck-text-2)">A team of five, one product</text>
    <rect x="800" y="410" width="870" height="282" rx="80" class="af-team"/>
    <path d="M846 446v36M846 446a10 10 0 1 0 .01 0M846 482a10 10 0 1 0 .01 0M846 462c18 0 30-6 30-20" class="af-git"/><text x="896" y="470" class="af-et" style="text-anchor:start">Team space · a shared git repository</text>
    ${[[975, "Claims", "who builds what"], [1235, "Team knowledge", "shared, curated"], [1495, "Reviews", "between engineers"]].map(([cx, n, s], k) => `<g class="af-tile t${k}">
       ${k === 0 ? `<path d="M${cx - 16} 532v52M${cx - 16} 534h38l-8 14 8 14h-38" class="af-flag"/>` : k === 1 ? `<g class="af-kmini"><circle cx="${cx - 18}" cy="548" r="7"/><circle cx="${cx + 14}" cy="538" r="9"/><circle cx="${cx + 2}" cy="572" r="8"/><path d="M${cx - 18} 548L${cx + 14} 538L${cx + 2} 572z"/></g>` : `<circle cx="${cx}" cy="558" r="26" class="af-rvc"/><path d="M${cx - 11} 558l8 8 14-16" class="af-rvk"/>`}
       <text x="${cx}" y="622" text-anchor="middle" class="af-tn">${n}</text><text x="${cx}" y="650" text-anchor="middle" class="af-es">${s}</text></g>`).join("")}
    ${engineers}
    <g class="af-overlap"><rect x="1030" y="326" width="260" height="44" rx="22" class="af-ovb"/><circle cx="1056" cy="348" r="15" class="af-ovc"/><text x="1056" y="356" text-anchor="middle" class="af-ovx">!</text><text x="1082" y="356" class="af-ovt">overlap, seen early</text></g>
    <g class="af-revtok"><circle r="17" class="af-tok"><animateMotion dur="16s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;.22;.45;1" path="M905 252V430H1415V252"/></circle></g>
    <g class="af-revtok2"><circle r="17" class="af-tok2"><animateMotion dur="16s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;.5;.73;1" path="M1415 252V430H905V252"/></circle></g>
    <text x="840" y="750" text-anchor="middle" class="af-close">Many factories per engineer. Many engineers per product. Every gate still has a person.</text>
  </svg>`;

  const DEF = `<div class="p1-af-def"><div class="p1-af-kick">An AI software factory is</div>
      <p class="p1-af-sent"><span class="ph p0">a system where </span><span class="ph p1 c-ag">agents do the work</span><span class="ph p2">, </span><span class="ph p3 c-jd">independent judges check it</span><span class="ph p4">, </span><span class="ph p5 c-pe">a person decides at every gate</span><span class="ph p6">, and everything is </span><span class="ph p7 c-rec">durable and recorded</span><span class="ph p8">, </span><span class="ph p9 c-own">owned by the team</span><span class="ph p10">.</span></p>
      <div class="p1-af-strip">
        <div class="sq q1"><i>“a system of agents plus code”</i><b>IndyDevDan</b></div>
        <div class="sq q2"><i>“a repeatable delivery system”</i><b>Sonar</b></div>
        <div class="sq q3"><i>“engineers move up a level to design and operate the system itself”</i><b>Cortex</b></div>
      </div></div>`;

  Deck.slide({
    id: "ai-factory",
    section: "what",
    title: "What is an AI software factory?",
    navTitle: "AI software factory",
    className: "p1-af",
    steps: 5, // step n reveals beat n; beat 0 is visible at once
    html: `${defs}<svg width="0" height="0" class="p1-af-defs" aria-hidden="true"><defs>${miniFactory}</defs></svg>
    <div class="p1-af-stage">
      ${DEF}
      <div class="p1-af-head"><span class="h1">Agents work</span><i></i><span class="h2">Judges check</span><i></i><span class="h3">People decide</span><i></i><span class="h4">Everything recorded</span></div>
      <div class="p1-af-scene sB">${sceneB}</div>
      <div class="p1-af-scene sC">${sceneC}</div>
      <div class="p1-af-scene sD">${sceneD}</div>
    </div>`,
    onStep(step) { sync(step); },
    notes: "Beat 0: the definition. An AI software factory is a system where agents do the work, independent judges check it, a person decides at every gate, and everything is durable, recorded and owned by the team. It is drawn from a reference design of a factory; three public voices point the same way: IndyDevDan, a system of agents plus code (check his exact wording in the video of 2026-08-03 before quoting), Sonar, a repeatable delivery system where people define intent, constraints, acceptance criteria and approval policies, and Cortex, an organisational system where engineers move up a level to design and operate the system. Beat 1: one factory. A piece of work travels twelve gates in four phases: program, contract, build and prove, release. Producer agents do the work; independent judges check it at the five judged gates (architecture, experience design, code review, UI review, verification); documentation has no judge. Experience design and UI review apply only to interface work. A judge never reviews its own work and always runs on the strongest model. Beat 2: a person decides at every gate; nothing moves forward on its own and a missing person, a crash, a clock or a closed browser never approves anything. The orchestrator is ordinary code that decides what happens next; its planner, an LLM, only drafts roadmaps and work plans, labelled as drafts. Beat 3: the engine room. The knowledge base is an LLM-written, engineer-curated wiki, context and never authority; specs, plans and tasks live in the repository next to the code; the record is one stream of events with a cause and an actor, the source for the live view, audits, metrics and replay; the durable store means a crash interrupts work but never loses it; models are local by default and cloud only by policy; the control room is the one place where everything that needs a person arrives. Beat 4: the same factory can run on a local machine, a team server inside the network or a cloud machine in your own account. Placement is a person's decision with a fit check on policy, models, capacity and cost; a local-only factory can only run on the local host; a rented host can sleep while factories wait for people and wakes on a decision; a factory can move between hosts without losing a step or approving anything. This is a reference design; the single machine is the default. Beat 5: many factories per engineer: one lane per factory, one feature at a time, parallelism happens between factories; several factories share one machine's model pool and a fair scheduler, so while one waits for a person another uses the machine and the person's attention becomes the limit. A team of five engineers builds one product; each keeps their own workshop and decides only their own gates. They meet in a team space, a shared git repository, not a server: claims show who builds what so overlaps are visible early, team knowledge is shared, and reviews between engineers can be required before a merge. The team space coordinates and never decides anyone's gate. Next: the ADLC defined.",
  });

  const reduce = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let prev = -1;
  function sync(step) {
    const root = document.querySelector(".p1-af");
    if (!root) return;
    // leaving the slide: keep the last beat so it does not snap back during the exit transition
    if (Deck.state.index !== Deck.slides.findIndex((d) => d.id === "ai-factory")) return;
    const cur = typeof step === "number" ? step : Deck.state.step || 0;
    for (let i = 1; i <= 5; i++) root.classList.toggle("is-s" + i, cur >= i);
    root.classList.add("is-in");
    root.dataset.beat = cur;
    // restart the line's work item when the one-factory scene opens, and the host loop when the hosts open
    if (!reduce() && cur !== prev) {
      const svg = (s) => root.querySelector(s + " svg");
      if (cur === 1) svg(".sB")?.setCurrentTime?.(0);
      if (cur === 4) svg(".sC")?.setCurrentTime?.(0);
      if (cur === 5) svg(".sD")?.setCurrentTime?.(0);
      const rs = root.classList; rs.remove("run4", "run5"); void root.offsetWidth;
      if (cur === 4) rs.add("run4"); if (cur === 5) rs.add("run5");
    }
    prev = cur;
  }
  Deck.on("slidechange", () => sync());
  Deck.on("stepchange", ({ step }) => sync(step));
  Deck.on("ready", () => sync(0));
})();
