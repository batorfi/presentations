// Slide 12 — skeleton. Content, visuals and animation are designed in a working session.
Deck.slide({
  id: "model-providers",
  section: "landscape",
  title: "Closed and open model providers",
  html: `
    <h2 class="s-title">Closed and open model providers</h2>
    <div class="s-placeholder">
      <b>Slide 12 · content to be designed together</b>
      <span class="p1-outline">Which frontier cloud and local open models are viable for engineering work as of October 2026.</span>
    </div>
  `,
  notes: "Which frontier cloud and local open models are viable for engineering work as of October 2026. [Reuse KILN's model-landscape.md (October 2026).]\n\nBackground material, source: Model Stack (Model Tier List), Agentic Engineer, https://agenticengineer.com/model-stack\n- Run by IA3 Dark Factory; pipelines of agents and code track model releases, independent benchmarks and pricing across providers, and keep a sourced changelog.\n- Models are grouped into three tiers: frontier, workhorse, lightweight. Idea: use the right model for the specific engineering task, not frontier prices for every task.\n- Build a stack, do not pick one model: \"Combine compute, don't select compute.\" Compare capability and token prices, consider latency, shortlist to balance performance, speed and cost.\nTier list as shown on the page (agenticengineer.com/model-stack, \"Last run 2d ago\"; prices are in/out as displayed, unit not stated on the screenshot; NEW = flagged new):\nSOTA, frontier ceiling\n- S+: Gemini 4 Carbon $2/$10 (NEW); Claude Opus 5.5 $4/$20; GPT-6 Astra $10/$50; Claude Sonnet 5.5 $2/$10; GPT-6.1 Sol $2/$10\n- S: Gemini 4 Argon $4/$20; Muse Wonder $4/$20; GPT-6.1 Terra $1/$5 (NEW); Claude Fable 5.1 $10/$50; Kimi K3.1 Pro $2/$10\nWORKHORSE, daily 90%\n- A: Claude Haiku 5.5 $0.10/$0.50; Grok 4.7 $2/$6; DeepSeek V4.1 Flash 1017 $0.30/$1.20; GLM-5.3 $1.40/$4.40; Muse Spark 1.3 $1.25/$4.25; Gemini 3.8 Flash $1.50/$7.50; MiMo-V2.6-Pro $0.435/$0.87; Ling 3.1 Flash 1019 $0.30/$0.90; MiniMax M3.1 Flash $0.15/$0.60; Qwen3.8-2.4T-A95B $2/$6\n- B: Gemini 3.1 Pro $2/$12; GPT-6 Luna $0.10/$0.50; GLM-5.3-Flash $0.15/$0.50; MiMo-V2.6-Flash $0.14/$0.28; Mistral Large 4 Preview $1.36/$4.18; DeepSeek V4 Pro 0813 $1.32/$3.96; MiniMax-M3 $0.60/$2.40; Beam 1.0 $0.70/$2.10; Gemini 3.5 Flash-Lite $0.30/$2.50\nLIGHTWEIGHT, own your compute (free, open weights to run yourself)\n- C: Qwen3.8-Flash-Next; Qwen3.8-27B; Nemotron 3.5 Super VL; Nemotron 3.5 Bolt 74B-A9B; Muse Glimmer; Qwen3.6-35B-A3B; Gemma 4 31B; Nemotron 3.5 Lightning\n- D: Gemma 4 12B; Qwen3.5-4B; gpt-oss-20b; MiMo-V2.6-Distill-Qwen-9B (NEW)",
});
