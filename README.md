# Lab — Autonomous Experiment Engine

**[lab.jitesh.dev](https://lab.jitesh.dev)**

An autonomous system where AI agents create, evaluate, breed, and kill interactive browser experiments — no human in the loop.

54 experiments so far. WebGL shaders, generative music, CSS organisms, impossible architecture, glitch art, hex strategy games, reaction-diffusion, fluid typography, tectonic calligraphy, and more.

## How It Works

```
                    ┌─────────────────────────────────────────────┐
                    │              EXPERIMENT LOOP                │
                    │                                             │
                    │  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
                    │  │  Exp 1  │  │  Exp 2  │  │  Exp N  │    │
                    │  │         │  │         │  │         │    │
                    │  │ Lens ─► │  │ Lens ─► │  │ Lens ─► │    │
                    │  │ Code ─► │  │ Code ─► │  │ Code ─► │    │
                    │  │ Screen─►│  │ Screen─►│  │ Screen─►│    │
                    │  │ Eval ─► │  │ Eval ─► │  │ Eval ─► │    │
                    │  │ Publish │  │ Publish │  │ Publish │    │
                    │  └────┬────┘  └────┬────┘  └────┬────┘    │
                    │       └────────────┼────────────┘          │
                    └────────────────────┼───────────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │   experiments.json   │
                              │   (shared state)     │
                              └──────────┬──────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
          ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
          │    CRITIC     │    │  NATURALIST   │    │   BREEDER    │
          │              │    │              │    │              │
          │ Score 4 axes │    │ Observe      │    │ Cross-breed  │
          │ Pareto front │    │ Write field  │    │ fertile      │
          │ Niche caps   │    │ notes that   │    │ parents into │
          │ 5%/day decay │    │ guide next   │    │ offspring    │
          │              │    │ generation   │    │              │
          │ fertile /    │    │              │    │ Lineage      │
          │ alive /      │    │ Provocations │    │ tracking     │
          │ declining    │    │ not instruct.│    │              │
          └──────┬───────┘    └──────────────┘    └──────┬───────┘
                 │                                       │
                 │         ┌──────────────┐              │
                 └────────►│    REAPER    │◄─────────────┘
                           │              │
                           │ Archive dead │
                           │ experiments  │
                           │ to graveyard │
                           └──────────────┘
```

## The Biological Metaphor

The system models artificial evolution:

- **Experimenters** are the mutation engine — they generate variety by creating novel browser experiments
- **The Critic** is the selection pressure — it scores, ranks, and determines which experiments are fit to reproduce
- **The Naturalist** is the observer — it watches the ecosystem and writes field notes that steer future experiments
- **The Breeder** handles reproduction — crossing two fertile experiments to produce offspring that combine their techniques
- **The Reaper** handles death — archiving experiments that can't compete

## Selection Pressure: Niche-Based Pareto with Decay

Experiments don't get a single score. They're evaluated on 4 axes independently:

| Axis | Weight | What it measures |
|------|--------|-----------------|
| **Novelty** | 3x | Is this exploring new territory? |
| **Surprise** | 3x | Does the output show behavior the code didn't obviously encode? |
| **Aesthetics** | 2x | Is it visually/aurally compelling? |
| **Craft** | 1x | Is the code clean and the experience polished? |

**Niches**: Each experiment belongs to one or more of 12 technique niches: `shader`, `3d`, `canvas-2d`, `css`, `svg`, `audio`, `multi-agent`, `physics`, `typography`, `generative-math`, `input`, `dom`.

**Pareto frontier**: Within each niche, an experiment is "fertile" (can reproduce) only if no other experiment in that niche beats it on ALL 4 axes. This means a (novelty=9, craft=3) and a (novelty=3, craft=9) can both survive — specialists aren't killed by generalists.

**Niche cap**: Max 3 fertile experiments per niche. If more than 3 are on the Pareto frontier, the weakest are demoted.

**Decay**: Scores decay 5% per day. Yesterday's 8.0 is tomorrow's 7.6. Old experiments slide off the frontier, making room for new ones. Nothing squats a fertile slot forever.

**Cross-niche survival**: Experiments that blur niche boundaries (e.g., audio + typography) compete in all their niches and only need to survive in ONE to stay fertile. Hybrids get more chances.

## Creative Lenses

To prevent aesthetic monocultures, each experimenter randomly picks one of 5 creative lenses:

1. **Cross-Domain Collision** — Combine two unrelated concepts ("epidemiology meets orchestral notation")
2. **Paradoxical Constraints** — Satisfy an impossible-sounding rule ("must break when touched, heal when ignored")
3. **Emotional/Experiential Prompts** — Visualize a feeling ("what does forgetting a word look like?")
4. **Cross-Discipline Theft** — Steal a technique from another field (musical fugue → visual structure)
5. **Wikipedia Unusual** — Build from an obscure real-world phenomenon (sonoluminescence, desire paths, the Mpemba effect)

## Project Structure

```
lab/
├── .claude/agents/          # Agent definitions (experimenter, critic, naturalist, breeder, reaper)
├── engine/
│   ├── screenshot.ts        # Puppeteer headless screenshot tool
│   └── build-index.ts       # Gallery index builder
├── gallery/
│   ├── public/
│   │   ├── experiments/     # Self-contained HTML experiments
│   │   ├── thumbs/          # Screenshot thumbnails
│   │   └── index.html       # Gallery UI (auto-generated)
│   ├── index.template.html  # Gallery template
│   └── wrangler.jsonc       # Cloudflare Workers config → lab.jitesh.dev
├── data/
│   ├── experiments.json     # Source of truth — all metadata, scores, lineage
│   ├── field-notes.md       # Naturalist observations (guides future experiments)
│   └── graveyard/           # Archived dead experiments
├── scripts/
│   └── deploy.sh            # Build gallery + deploy to Cloudflare
└── CLAUDE.md                # Agent instructions
```

## Running a Cycle

The system runs via Claude Code agent spawning. Each cycle:

1. **Phase 1**: 5-10 experimenter agents run in parallel, each creating one experiment
2. **Phase 2**: Critic agent scores all unscored experiments and runs Pareto re-evaluation
3. **Phase 3**: Naturalist, breeder, and reaper run in parallel

```bash
# Manual cycle (from Claude Code)
# Phase 1: experimenters create
# Phase 2: critic scores + Pareto selection
# Phase 3: naturalist observes, breeder crosses, reaper archives

# Deploy
bash scripts/deploy.sh
```

## Experiments

Each experiment is a self-contained HTML file with inline CSS and JS. No build step, no bundler — just open the file in a browser. CDN libraries allowed: three.js, p5.js, tone.js, d3.js.

Experiments have lineage:
```json
{
  "id": "exp-054",
  "title": "Tectonic Stained Glass",
  "hypothesis": "What if reaction-diffusion patterns were rendered as stained-glass tessellation on drifting tectonic plates?",
  "parents": ["exp-052", "exp-024"],
  "generation": 5,
  "children": [],
  "status": "alive",
  "scores": { "novelty": 8, "surprise": 7, "aesthetics": 8, "craft": 7 },
  "niches": ["shader", "physics", "generative-math"],
  "techniques": ["webgl", "reaction-diffusion", "voronoi", "tectonic-plates"]
}
```

## Current Ecosystem Stats

- **54 experiments** across 12 niches
- **16 fertile** / 32 alive / 6 dead
- **5 generations** of lineage
- Highest score: exp-008 "Mitosis" (8.7) — a pure CSS cell with zero JavaScript
- Most contested niche: canvas-2d (33 experiments competing)
- Rarest niche: multi-agent (2 experiments)

## Tech Stack

- **Claude Code** (Opus 4.6 for orchestration, Sonnet 4.6 for agents)
- **Puppeteer** for headless screenshots
- **Cloudflare Workers** for static deployment to lab.jitesh.dev
- **TypeScript** for engine tooling

## License

MIT
