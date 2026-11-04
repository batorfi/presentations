// Slide 4 — living system map: SWEs, parallel ADLC pipelines with human gates, worker/judge agents, local/hybrid/cloud LLMs.
// Generated look: one seamless 24 s CSS loop, no steps. Spec: Notion "04 – From ideas through specs to MR".
Deck.slide({
  id: "ideas-to-mr",
  section: "why",
  title: "From ideas through specs to MR",
  className: "p1-fac",
  html: `
      <svg class="p1f-svg" viewBox="0 0 1680 848" role="img" aria-label="AI software factory: SWEs orchestrate parallel ADLC pipelines with human gates, worker and judge agents, backed by local, hybrid and cloud LLMs">
      <defs></defs>
      <rect x="0" y="0" width="1680" height="64" rx="16" class="p1f-strip"/>
      <text x="24" y="42" class="p1f-t p1f-b">Shared context</text>
      <rect x="220" y="12" width="104" height="40" rx="20" class="p1f-chip"/><text x="272.0" y="40" text-anchor="middle" class="p1f-t">Team</text>
      <rect x="336" y="12" width="132" height="40" rx="20" class="p1f-chip"/><text x="402.0" y="40" text-anchor="middle" class="p1f-t">Feature</text>
      <rect x="480" y="12" width="148" height="40" rx="20" class="p1f-chip"/><text x="554.0" y="40" text-anchor="middle" class="p1f-t">Personal</text>
      <path d="M950 32 l14 -14 l14 14 l-14 14z" class="p1f-gate p1f-leg"/><text x="988" y="41" class="p1f-t">Human gate</text>
      <circle cx="1160" cy="32" r="14" class="p1f-w"/><text x="1184" y="41" class="p1f-t">Worker agent</text>
      <circle cx="1388" cy="32" r="14" class="p1f-j"/><text x="1412" y="41" class="p1f-t">Judge agent</text>
      <text x="345" y="100" text-anchor="middle" class="p1f-t p1f-hd">Idea</text>
      <text x="550" y="100" text-anchor="middle" class="p1f-t p1f-hd">Specification</text>
      <text x="755" y="100" text-anchor="middle" class="p1f-t p1f-hd">Plan &amp; tasks</text>
      <text x="960" y="100" text-anchor="middle" class="p1f-t p1f-hd">Implementation</text>
      <text x="1165" y="100" text-anchor="middle" class="p1f-t p1f-hd">Review</text>
      <text x="1370" y="100" text-anchor="middle" class="p1f-t p1f-hd">Verification</text>
      <text x="1575" y="100" text-anchor="middle" class="p1f-t p1f-hd">Merge request</text>
      <path d="M24 64 V484" class="p1f-spine"/>
      <path d="M24 166 H90" class="p1f-spine"/>
      <path d="M24 325 H90" class="p1f-spine"/>
      <path d="M24 484 H90" class="p1f-spine"/>
      <g transform="translate(0,166)" data-d="0" data-ly="166" class="p1f-lane">
      <rect x="250" y="-48" width="1430" height="96" rx="20" class="p1f-lanebg"/>
      <path d="M345 0 H1575" class="p1f-track"/>
      <path d="M447.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g0"/>
      <circle cx="447.5" cy="0" r="20" class="p1f-gring p1f-gr0" data-cx="447.5"/>
      <path d="M652.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g1"/>
      <circle cx="652.5" cy="0" r="20" class="p1f-gring p1f-gr1" data-cx="652.5"/>
      <path d="M857.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g2"/>
      <circle cx="857.5" cy="0" r="20" class="p1f-gring p1f-gr2" data-cx="857.5"/>
      <path d="M1062.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g3"/>
      <circle cx="1062.5" cy="0" r="20" class="p1f-gring p1f-gr3" data-cx="1062.5"/>
      <path d="M1267.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g4"/>
      <circle cx="1267.5" cy="0" r="20" class="p1f-gring p1f-gr4" data-cx="1267.5"/>
      <path d="M1472.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g5"/>
      <circle cx="1472.5" cy="0" r="20" class="p1f-gring p1f-gr5" data-cx="1472.5"/>
      <circle cx="345" cy="0" r="9" class="p1f-pk"/>
      </g>
      <g transform="translate(0,272)" data-d="-6" data-ly="272" class="p1f-lane">
      <rect x="250" y="-48" width="1430" height="96" rx="20" class="p1f-lanebg"/>
      <path d="M345 0 H1575" class="p1f-track"/>
      <path d="M447.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g0"/>
      <circle cx="447.5" cy="0" r="20" class="p1f-gring p1f-gr0" data-cx="447.5"/>
      <path d="M652.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g1"/>
      <circle cx="652.5" cy="0" r="20" class="p1f-gring p1f-gr1" data-cx="652.5"/>
      <path d="M857.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g2"/>
      <circle cx="857.5" cy="0" r="20" class="p1f-gring p1f-gr2" data-cx="857.5"/>
      <path d="M1062.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g3"/>
      <circle cx="1062.5" cy="0" r="20" class="p1f-gring p1f-gr3" data-cx="1062.5"/>
      <path d="M1267.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g4"/>
      <circle cx="1267.5" cy="0" r="20" class="p1f-gring p1f-gr4" data-cx="1267.5"/>
      <path d="M1472.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g5"/>
      <circle cx="1472.5" cy="0" r="20" class="p1f-gring p1f-gr5" data-cx="1472.5"/>
      <circle cx="345" cy="0" r="9" class="p1f-pk"/>
      </g>
      <g transform="translate(0,378)" data-d="-12" data-ly="378" class="p1f-lane">
      <rect x="250" y="-48" width="1430" height="96" rx="20" class="p1f-lanebg"/>
      <path d="M345 0 H1575" class="p1f-track"/>
      <path d="M447.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g0"/>
      <circle cx="447.5" cy="0" r="20" class="p1f-gring p1f-gr0" data-cx="447.5"/>
      <path d="M652.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g1"/>
      <circle cx="652.5" cy="0" r="20" class="p1f-gring p1f-gr1" data-cx="652.5"/>
      <path d="M857.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g2"/>
      <circle cx="857.5" cy="0" r="20" class="p1f-gring p1f-gr2" data-cx="857.5"/>
      <path d="M1062.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g3"/>
      <circle cx="1062.5" cy="0" r="20" class="p1f-gring p1f-gr3" data-cx="1062.5"/>
      <path d="M1267.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g4"/>
      <circle cx="1267.5" cy="0" r="20" class="p1f-gring p1f-gr4" data-cx="1267.5"/>
      <path d="M1472.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g5"/>
      <circle cx="1472.5" cy="0" r="20" class="p1f-gring p1f-gr5" data-cx="1472.5"/>
      <circle cx="345" cy="0" r="9" class="p1f-pk"/>
      </g>
      <g transform="translate(0,484)" data-d="-18" data-ly="484" class="p1f-lane">
      <rect x="250" y="-48" width="1430" height="96" rx="20" class="p1f-lanebg"/>
      <path d="M345 0 H1575" class="p1f-track"/>
      <path d="M447.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g0"/>
      <circle cx="447.5" cy="0" r="20" class="p1f-gring p1f-gr0" data-cx="447.5"/>
      <path d="M652.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g1"/>
      <circle cx="652.5" cy="0" r="20" class="p1f-gring p1f-gr1" data-cx="652.5"/>
      <path d="M857.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g2"/>
      <circle cx="857.5" cy="0" r="20" class="p1f-gring p1f-gr2" data-cx="857.5"/>
      <path d="M1062.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g3"/>
      <circle cx="1062.5" cy="0" r="20" class="p1f-gring p1f-gr3" data-cx="1062.5"/>
      <path d="M1267.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g4"/>
      <circle cx="1267.5" cy="0" r="20" class="p1f-gring p1f-gr4" data-cx="1267.5"/>
      <path d="M1472.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g5"/>
      <circle cx="1472.5" cy="0" r="20" class="p1f-gring p1f-gr5" data-cx="1472.5"/>
      <circle cx="345" cy="0" r="9" class="p1f-pk"/>
      </g>
      <path d="M550 532 V580 H350 V716" class="p1f-bus"/>
      <path d="M755 532 V592 H480 V716" class="p1f-bus"/>
      <path d="M960 532 V604 H610 V716" class="p1f-bus"/>
      <path d="M1165 532 V580 H1060 V716" class="p1f-bus"/>
      <path d="M1370 532 V592 H1448 V716" class="p1f-bus"/>
      <g transform="translate(0,166)" data-d="0" data-ly="166" class="p1f-lane">
      <circle r="6" class="p1f-dot p1f-dw p1f-d1" data-i="1" data-ex="350" data-ey="580"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d2" data-i="2" data-ex="480" data-ey="592"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d3" data-i="3" data-ex="610" data-ey="604"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d4" data-i="4" data-ex="1060" data-ey="580"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d5" data-i="5" data-ex="1448" data-ey="592"/>
      <circle cx="345" cy="0" r="30" class="p1f-halo p1f-hx p1f-h0" data-cx="345"/><circle cx="345" cy="0" r="22" class="p1f-idea"/><path d="M345 -12 l3.5 8.5 l8.5 3.5 l-8.5 3.5 l-3.5 8.5 l-3.5 -8.5 l-8.5 -3.5 l8.5 -3.5z" class="p1f-star"/>
      <circle cx="550" cy="0" r="50" class="p1f-halo p1f-hj p1f-h1" data-cx="550"/><g transform="translate(523,0) scale(0.85)"><circle r="20" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g><g transform="translate(577,0) scale(0.85)"><circle r="20" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="755" cy="0" r="36" class="p1f-halo p1f-hw p1f-h2" data-cx="755"/><g transform="translate(755,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="960" cy="0" r="36" class="p1f-halo p1f-hw p1f-h3" data-cx="960"/><g transform="translate(960,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="1165" cy="0" r="36" class="p1f-halo p1f-hj p1f-h4" data-cx="1165"/><g transform="translate(1165,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="1370" cy="0" r="36" class="p1f-halo p1f-hj p1f-h5" data-cx="1370"/><g transform="translate(1370,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <rect x="1533" y="-28" width="84" height="56" rx="14" class="p1f-halo p1f-hm p1f-h6" data-cx="1575"/><rect x="1540" y="-23" width="70" height="46" rx="11" class="p1f-mr"/><text x="1575" y="9" text-anchor="middle" class="p1f-t p1f-b p1f-mrt">MR</text>
      </g>
      <g transform="translate(0,272)" data-d="-6" data-ly="272" class="p1f-lane">
      <circle r="6" class="p1f-dot p1f-dw p1f-d1" data-i="1" data-ex="350" data-ey="580"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d2" data-i="2" data-ex="480" data-ey="592"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d3" data-i="3" data-ex="610" data-ey="604"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d4" data-i="4" data-ex="1060" data-ey="580"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d5" data-i="5" data-ex="1448" data-ey="592"/>
      <circle cx="345" cy="0" r="30" class="p1f-halo p1f-hx p1f-h0" data-cx="345"/><circle cx="345" cy="0" r="22" class="p1f-idea"/><path d="M345 -12 l3.5 8.5 l8.5 3.5 l-8.5 3.5 l-3.5 8.5 l-3.5 -8.5 l-8.5 -3.5 l8.5 -3.5z" class="p1f-star"/>
      <circle cx="550" cy="0" r="50" class="p1f-halo p1f-hj p1f-h1" data-cx="550"/><g transform="translate(523,0) scale(0.85)"><circle r="20" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g><g transform="translate(577,0) scale(0.85)"><circle r="20" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="755" cy="0" r="36" class="p1f-halo p1f-hw p1f-h2" data-cx="755"/><g transform="translate(755,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="960" cy="0" r="36" class="p1f-halo p1f-hw p1f-h3" data-cx="960"/><g transform="translate(960,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="1165" cy="0" r="36" class="p1f-halo p1f-hj p1f-h4" data-cx="1165"/><g transform="translate(1165,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="1370" cy="0" r="36" class="p1f-halo p1f-hj p1f-h5" data-cx="1370"/><g transform="translate(1370,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <rect x="1533" y="-28" width="84" height="56" rx="14" class="p1f-halo p1f-hm p1f-h6" data-cx="1575"/><rect x="1540" y="-23" width="70" height="46" rx="11" class="p1f-mr"/><text x="1575" y="9" text-anchor="middle" class="p1f-t p1f-b p1f-mrt">MR</text>
      </g>
      <g transform="translate(0,378)" data-d="-12" data-ly="378" class="p1f-lane">
      <circle r="6" class="p1f-dot p1f-dw p1f-d1" data-i="1" data-ex="350" data-ey="580"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d2" data-i="2" data-ex="480" data-ey="592"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d3" data-i="3" data-ex="610" data-ey="604"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d4" data-i="4" data-ex="1060" data-ey="580"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d5" data-i="5" data-ex="1448" data-ey="592"/>
      <circle cx="345" cy="0" r="30" class="p1f-halo p1f-hx p1f-h0" data-cx="345"/><circle cx="345" cy="0" r="22" class="p1f-idea"/><path d="M345 -12 l3.5 8.5 l8.5 3.5 l-8.5 3.5 l-3.5 8.5 l-3.5 -8.5 l-8.5 -3.5 l8.5 -3.5z" class="p1f-star"/>
      <circle cx="550" cy="0" r="50" class="p1f-halo p1f-hj p1f-h1" data-cx="550"/><g transform="translate(523,0) scale(0.85)"><circle r="20" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g><g transform="translate(577,0) scale(0.85)"><circle r="20" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="755" cy="0" r="36" class="p1f-halo p1f-hw p1f-h2" data-cx="755"/><g transform="translate(755,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="960" cy="0" r="36" class="p1f-halo p1f-hw p1f-h3" data-cx="960"/><g transform="translate(960,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="1165" cy="0" r="36" class="p1f-halo p1f-hj p1f-h4" data-cx="1165"/><g transform="translate(1165,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="1370" cy="0" r="36" class="p1f-halo p1f-hj p1f-h5" data-cx="1370"/><g transform="translate(1370,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <rect x="1533" y="-28" width="84" height="56" rx="14" class="p1f-halo p1f-hm p1f-h6" data-cx="1575"/><rect x="1540" y="-23" width="70" height="46" rx="11" class="p1f-mr"/><text x="1575" y="9" text-anchor="middle" class="p1f-t p1f-b p1f-mrt">MR</text>
      </g>
      <g transform="translate(0,484)" data-d="-18" data-ly="484" class="p1f-lane">
      <circle r="6" class="p1f-dot p1f-dw p1f-d1" data-i="1" data-ex="350" data-ey="580"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d2" data-i="2" data-ex="480" data-ey="592"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d3" data-i="3" data-ex="610" data-ey="604"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d4" data-i="4" data-ex="1060" data-ey="580"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d5" data-i="5" data-ex="1448" data-ey="592"/>
      <circle cx="345" cy="0" r="30" class="p1f-halo p1f-hx p1f-h0" data-cx="345"/><circle cx="345" cy="0" r="22" class="p1f-idea"/><path d="M345 -12 l3.5 8.5 l8.5 3.5 l-8.5 3.5 l-3.5 8.5 l-3.5 -8.5 l-8.5 -3.5 l8.5 -3.5z" class="p1f-star"/>
      <circle cx="550" cy="0" r="50" class="p1f-halo p1f-hj p1f-h1" data-cx="550"/><g transform="translate(523,0) scale(0.85)"><circle r="20" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g><g transform="translate(577,0) scale(0.85)"><circle r="20" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="755" cy="0" r="36" class="p1f-halo p1f-hw p1f-h2" data-cx="755"/><g transform="translate(755,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="960" cy="0" r="36" class="p1f-halo p1f-hw p1f-h3" data-cx="960"/><g transform="translate(960,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="1165" cy="0" r="36" class="p1f-halo p1f-hj p1f-h4" data-cx="1165"/><g transform="translate(1165,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="1370" cy="0" r="36" class="p1f-halo p1f-hj p1f-h5" data-cx="1370"/><g transform="translate(1370,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <rect x="1533" y="-28" width="84" height="56" rx="14" class="p1f-halo p1f-hm p1f-h6" data-cx="1575"/><rect x="1540" y="-23" width="70" height="46" rx="11" class="p1f-mr"/><text x="1575" y="9" text-anchor="middle" class="p1f-t p1f-b p1f-mrt">MR</text>
      </g>
      <path d="M150 166 H250" class="p1f-link"/>
      <circle cx="120" cy="166" r="38" class="p1f-avring" data-d="0" data-cx="120" data-cy="166"/>
      <circle cx="120" cy="166" r="30" class="p1f-av"/><circle cx="120" cy="158" r="9" class="p1f-avg"/><path d="M104 184 a16 14 0 0 1 32 0" class="p1f-avg2"/>
      <text x="120" y="234" text-anchor="middle" class="p1f-t p1f-b">SWE 1</text>
      <path d="M200 272 H250" class="p1f-link"/>
      <path d="M200 378 H250" class="p1f-link"/>
      <path d="M150 325 H200 M200 272 V378" class="p1f-link"/>
      <circle cx="120" cy="325" r="38" class="p1f-avring" data-d="-6" data-cx="120" data-cy="325"/>
      <circle cx="120" cy="325" r="38" class="p1f-avring" data-d="-12" data-cx="120" data-cy="325"/>
      <circle cx="120" cy="325" r="30" class="p1f-av"/><circle cx="120" cy="317" r="9" class="p1f-avg"/><path d="M104 343 a16 14 0 0 1 32 0" class="p1f-avg2"/>
      <text x="120" y="393" text-anchor="middle" class="p1f-t p1f-b">SWE 2</text>
      <path d="M150 484 H250" class="p1f-link"/>
      <circle cx="120" cy="484" r="38" class="p1f-avring" data-d="-18" data-cx="120" data-cy="484"/>
      <circle cx="120" cy="484" r="30" class="p1f-av"/><circle cx="120" cy="476" r="9" class="p1f-avg"/><path d="M104 502 a16 14 0 0 1 32 0" class="p1f-avg2"/>
      <text x="120" y="552" text-anchor="middle" class="p1f-t p1f-b">SWE 3</text>
      <circle r="5" class="p1f-kdot" data-cy="166" data-k="0"/>
      <circle r="5" class="p1f-kdot" data-cy="325" data-k="1"/>
      <circle r="5" class="p1f-kdot" data-cy="484" data-k="2"/>
      <g class="p1f-blk p1f-blkL"><rect x="250" y="716" width="460" height="132" rx="20" class="p1f-blkbg"/><text x="480.0" y="772" text-anchor="middle" class="p1f-t p1f-b">Local / on-premise LLMs</text>
      <circle cx="420.0" cy="810" r="7" class="p1f-led" data-ph="-0.0"/>
      <circle cx="450.0" cy="810" r="7" class="p1f-led" data-ph="-1.3"/>
      <circle cx="480.0" cy="810" r="7" class="p1f-led" data-ph="-2.6"/>
      <circle cx="510.0" cy="810" r="7" class="p1f-led" data-ph="-3.9000000000000004"/>
      <circle cx="540.0" cy="810" r="7" class="p1f-led" data-ph="-5.2"/>
      </g>
      <g class="p1f-blk p1f-blkH"><rect x="734" y="716" width="460" height="132" rx="20" class="p1f-blkbg"/><text x="964.0" y="772" text-anchor="middle" class="p1f-t p1f-b">Hybrid LLMs</text>
      <circle cx="904.0" cy="810" r="7" class="p1f-led" data-ph="-0.7"/>
      <circle cx="934.0" cy="810" r="7" class="p1f-led" data-ph="-2.0"/>
      <circle cx="964.0" cy="810" r="7" class="p1f-led" data-ph="-3.3"/>
      <circle cx="994.0" cy="810" r="7" class="p1f-led" data-ph="-4.6000000000000005"/>
      <circle cx="1024.0" cy="810" r="7" class="p1f-led" data-ph="-5.9"/>
      </g>
      <g class="p1f-blk p1f-blkC"><rect x="1218" y="716" width="460" height="132" rx="20" class="p1f-blkbg"/><text x="1448.0" y="772" text-anchor="middle" class="p1f-t p1f-b">Cloud LLMs</text>
      <circle cx="1388.0" cy="810" r="7" class="p1f-led" data-ph="-1.4"/>
      <circle cx="1418.0" cy="810" r="7" class="p1f-led" data-ph="-2.7"/>
      <circle cx="1448.0" cy="810" r="7" class="p1f-led" data-ph="-4.0"/>
      <circle cx="1478.0" cy="810" r="7" class="p1f-led" data-ph="-5.300000000000001"/>
      <circle cx="1508.0" cy="810" r="7" class="p1f-led" data-ph="-6.6"/>
      </g>
      </svg>
  `,
  notes: "Living picture of an AI software factory. SWEs orchestrate, decide and review; each can drive several ADLC pipelines. Every stage boundary is a human gate: work stops until a person decides. Worker agents build, judge agents review and verify, on different models. Models run local, hybrid or cloud. Team, feature and personal knowledge flow in as context. High-level only; the stages are detailed later in the series.",
});

(function () {
  var T = 24, C = [345, 550, 755, 960, 1165, 1370, 1575], G = [447.5, 652.5, 857.5, 1062.5, 1267.5, 1472.5], A = [0.3, 3.7, 7.1, 10.5, 13.9, 17.3, 20.7], BY = 716;
  function ip(p, t) { if (t <= p[0][0]) return p[0][1]; for (var i = 1; i < p.length; i++) { if (t <= p[i][0]) { var a = p[i-1], b = p[i], k = (t - a[0]) / ((b[0] - a[0]) || 1); return a[1] + (b[1] - a[1]) * k; } } return p[p.length-1][1]; }
  function ie(p, t) { if (t <= p[0][0]) return p[0][1]; for (var i = 1; i < p.length; i++) { if (t <= p[i][0]) { var a = p[i-1], b = p[i], k = (t - a[0]) / ((b[0] - a[0]) || 1); k = k * k * (3 - 2 * k); return a[1] + (b[1] - a[1]) * k; } } return p[p.length-1][1]; }
  var pkX = [[0, 0]], pkO = [[0, 0]];
  for (var i = 0; i < 7; i++) {
    var x = C[i] - C[0];
    pkX.push([A[i], x]); pkO.push([A[i], 1]);
    if (i < 6) { var gx = G[i] - C[0]; pkX.push([A[i] + 1.2, x], [A[i] + 1.7, gx], [A[i] + 2.9, gx]); pkO.push([A[i] + 1.2, 1], [A[i] + 1.7, 1], [A[i] + 2.9, 1]); }
  }
  pkX.push([A[6] + 1.8, C[6] - C[0]], [A[6] + 2.3, C[6] - C[0]], [A[6] + 2.8, 0], [T, 0]);
  pkO.push([A[6] + 1.8, 1], [A[6] + 2.3, 0], [T, 0]);
  var avO = [[0, 0]], avS = [[0, 1]];
  for (i = 0; i < 6; i++) { var h = A[i] + 2.65; avO.push([h, 0], [h + .1, .95], [h + .7, 0]); avS.push([h, 1], [h + .1, 1.08], [h + .7, 1.3]); }
  avO.push([T, 0]); avS.push([T, 1.3]);
  function svgEl() { return document.querySelector(".p1f-svg"); }
  function sc(el, s) { var cx = +el.getAttribute("data-cx"); el.setAttribute("transform", "translate(" + cx + " 0) scale(" + s + ") translate(" + (-cx) + " 0)"); }
  function frame(now, svg) {
    var t = now / 1000, q = function (s) { return svg.querySelectorAll(s); };
    q(".p1f-lane").forEach(function (g) {
      var tl = (((t - (+g.getAttribute("data-d"))) % T) + T) % T, ly = +g.getAttribute("data-ly");
      var pk = g.querySelector(".p1f-pk");
      if (pk) { pk.setAttribute("transform", "translate(" + ie(pkX, tl) + " 0)"); pk.style.opacity = ip(pkO, tl); }
      for (var i = 0; i < 7; i++) g.querySelectorAll(".p1f-h" + i).forEach(function (el) {
        var s = A[i];
        el.style.opacity = ip([[0,0],[s,0],[s+.25,.9],[s+1,.6],[s+1.3,0],[T,0]], tl);
        sc(el, ip([[0,.85],[s,.85],[s+.25,1.05],[s+1,1.15],[s+1.3,1.3],[T,1.3]], tl));
      });
      for (i = 0; i < 6; i++) {
        var hh = A[i] + 1.7, gt = g.querySelector(".p1f-g" + i), gr = g.querySelector(".p1f-gr" + i);
        if (gt) { var k = ip([[0,0],[hh,0],[hh+.2,1],[hh+1,1],[hh+1.3,0],[T,0]], tl); gt.style.fill = k < .02 ? "" : "color-mix(in srgb, var(--deck-wait) " + Math.round(k * 100) + "%, var(--deck-raised))"; }
        if (gr) { gr.style.opacity = ip([[0,0],[hh+.95,0],[hh+1.05,.9],[hh+1.6,0],[T,0]], tl); sc(gr, ip([[0,1],[hh+.95,1],[hh+1.05,1.1],[hh+1.6,2.2],[T,2.2]], tl)); }
      }
      g.querySelectorAll(".p1f-dot").forEach(function (d) {
        var i = +d.getAttribute("data-i"), ex = +d.getAttribute("data-ex"), ey = +d.getAttribute("data-ey") - ly, by = BY - ly;
        var s = A[i] + .3, e = A[i] + 1.5;
        d.style.opacity = ip([[0,0],[s,0],[s+.1,1],[e-.1,1],[e,0],[T,0]], tl);
        var f = ip([[0,0],[s,0],[s+.1,.03],[e-.1,.97],[e,1],[T,1]], tl);
        var l1 = ey, l2 = Math.abs(ex - C[i]), l3 = by - ey, L = l1 + l2 + l3, p = f * L, x = C[i], y;
        if (p <= l1) y = p; else if (p <= l1 + l2) { y = ey; x = C[i] + (ex - C[i]) * (p - l1) / l2; } else { x = ex; y = ey + (p - l1 - l2); }
        d.setAttribute("cx", x); d.setAttribute("cy", y);
      });
    });
    q(".p1f-avring").forEach(function (el) {
      var tl = (((t - (+el.getAttribute("data-d"))) % T) + T) % T;
      el.style.opacity = ip(avO, tl);
      var cx = +el.getAttribute("data-cx"), cy = +el.getAttribute("data-cy"), s = ip(avS, tl);
      el.setAttribute("transform", "translate(" + cx + " " + cy + ") scale(" + s + ") translate(" + (-cx) + " " + (-cy) + ")");
    });
    q(".p1f-kdot").forEach(function (d) {
      var cy = +d.getAttribute("data-cy"), k = +d.getAttribute("data-k"), tl = ((t + k * 2.6) % 8 + 8) % 8;
      d.style.opacity = ip([[0,0],[.5,0],[.9,1],[2.6,1],[3,0],[8,0]], tl);
      var f = ip([[0,0],[.5,0],[.9,.04],[2.6,.96],[3,1],[8,1]], tl), l1 = cy - 64, l2 = 66, p = f * (l1 + l2);
      if (p <= l1) { d.setAttribute("cx", 24); d.setAttribute("cy", 64 + p); } else { d.setAttribute("cx", 24 + p - l1); d.setAttribute("cy", cy); }
    });
    q(".p1f-led").forEach(function (d) { d.style.opacity = ip([[0,.25],[2,1],[4,.25],[8,.25]], ((t - (+d.getAttribute("data-ph"))) % 8 + 8) % 8); });
  }
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function loop(now) {
    var svg = svgEl();
    if (svg) { var sl = svg.closest(".deck-slide"); if (sl && !sl.classList.contains("deck-hidden")) { if (still) { frame(9000, svg); return; } frame(now, svg); } }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
