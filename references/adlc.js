/* Reference list for the ADLC webinar series, part 1. Public once the deck is published.
 * Six bands of up to three cards = two reference slides. Titles stay on one line, descriptions on two. */
window.DeckReferences = window.DeckReferences || {};
window.DeckReferences["adlc"] = {
  title: "ADLC webinar series: references",
  categories: [
    { id: "readings", label: "Concepts and levels", items: [
      { id: "c1", title: "Willison: The five levels", desc: "Shapiro's levels of AI-assisted development.", url: "https://simonwillison.net/2026/Jan/28/the-five-levels/" },
      { id: "c2", title: "Willison: Vibe coding", desc: "Not all AI-assisted programming is vibe coding.", url: "https://simonwillison.net/2025/Mar/19/vibe-coding/" },
      { id: "c3", title: "Agentic engineering", desc: "Practitioner definition of agentic engineering.", url: "https://agenticengineer.com/what-is-agentic-engineering" }
    ] },
    { id: "sources", label: "Evidence and risk", items: [
      { id: "e1", title: "METR developer study", desc: "Randomized trial on experienced developers (2025).", url: "https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/" },
      { id: "e3", title: "CSA: vibe coding security", desc: "Security figures on AI-generated code.", url: "https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-generated-code-security-vibe-coding-202/" }
    ] },
    { id: "tools", label: "Spec-driven development", items: [
      { id: "t1", title: "Spec-driven development", desc: "Spec Kit how-to for the spec-first workflow.", url: "https://github.github.io/spec-kit/how-to/sdd.html" },
      { id: "t2", title: "Spec Kit repository", desc: "Toolkit and README for spec-driven work.", url: "https://github.com/github/spec-kit" }
    ] },
    { id: "repos", label: "Open standards", items: [
      { id: "s1", title: "MCP specification", desc: "Open protocol connecting agents to tools and data.", url: "https://modelcontextprotocol.io/specification" },
      { id: "s2", title: "AGENTS.md", desc: "Open format for project instructions to agents.", url: "https://agents.md/" },
      { id: "s3", title: "Agent Skills", desc: "Open format for reusable skills (SKILL.md).", url: "https://agentskills.io/" }
    ] },
    { id: "other", label: "Industry practice", items: [
      { id: "i1", title: "StrongDM software factory", desc: "A team running a software factory in practice.", url: "https://simonwillison.net/2026/Feb/7/software-factory" },
      { id: "i2", title: "Spotify background agent", desc: "First-party write-up of a background coding agent.", url: "https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1" },
      { id: "i4", title: "Stanford Law on trust", desc: "Who is accountable for agent-made software?", url: "https://law.stanford.edu/2026/02/08/built-by-agents-tested-by-agents-trusted-by-whom/" }
    ] },
    { id: "models", label: "Models and benchmarks", items: [
      { id: "m1", title: "Model Stack tier list", desc: "Frontier, workhorse, lightweight. Changes often.", url: "https://agenticengineer.com/model-stack" },
      { id: "m2", title: "SWE-bench Pro 2026", desc: "Coding-agent benchmark results (CodingFleet).", url: "https://codingfleet.com/blog/swe-bench-pro-leaderboard-2026/" },
      { id: "m3", title: "Vals AI: SWE-bench", desc: "Independent runs on real engineering tasks.", url: "https://www.vals.ai/benchmarks/swebench" }
    ] }
  ],
};
