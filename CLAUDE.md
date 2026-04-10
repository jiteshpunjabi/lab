# Lab — Autonomous Experiment Engine

Agents autonomously create, evaluate, and evolve interactive browser experiments. The system uses Claude Code agent teams for parallel experiment generation and selection pressure.

## Agent Types (in .claude/agents/)

- **experimenter** — creates novel HTML experiments with a perception-action loop (write → screenshot → evaluate → iterate)
- **critic** — scores experiments on novelty, surprise, aesthetics, craft
- **naturalist** — observes ecosystem patterns, writes field notes that guide future experiments
- **breeder** — cross-breeds successful (fertile) experiments into offspring
- **reaper** — archives low-scoring and broken experiments

## Structure

- `data/experiments.json` — source of truth for all experiment metadata (never delete entries, only update status)
- `data/field-notes.md` — naturalist observations that guide experiment creation
- `gallery/public/experiments/` — published experiment HTML files (self-contained, inline JS/CSS)
- `gallery/public/thumbs/` — screenshot thumbnails (PNG, named by experiment ID)
- `data/graveyard/` — archived dead experiments
- `gallery/index.template.html` — gallery template (do NOT edit public/index.html directly)

## Key Commands

- Screenshot: `npx tsx engine/screenshot.ts <html-path> [output-png-path]`
- Deploy: `bash scripts/deploy.sh` (rebuilds gallery index from template + deploys to lab.jitesh.dev)

## Rules

- Never delete entries from `experiments.json` — only update `status` field
- Always preserve lineage data (`parents`, `generation`, `children`)
- Experiments must be self-contained HTML (inline JS/CSS, CDN libs only)
- When reading/writing experiments.json, be careful of concurrent access from other teammates
- After modifying experiments or gallery files, run `bash scripts/deploy.sh`

## Experiment ID Assignment

Read `data/experiments.json`, find the highest numeric ID (e.g., exp-005 → 5), increment by 1, zero-pad to 3 digits.

## Experiment Schema

```json
{
  "id": "exp-001",
  "title": "string",
  "hypothesis": "What if...",
  "parents": [],
  "generation": 1,
  "children": [],
  "born_at": "ISO8601",
  "status": "alive|fertile|declining|dead",
  "score": null,
  "scores": {"novelty": null, "surprise": null, "aesthetics": null, "craft": null},
  "niches": ["shader", "canvas-2d"],
  "review": null,
  "techniques": [],
  "reaped_at": null
}
```

## Selection Pressure

The critic uses **niche-based Pareto selection with decay**:
- 4 axes scored separately (novelty, surprise, aesthetics, craft) — no single composite determines fate
- Experiments belong to 1+ niches: shader, 3d, canvas-2d, css, svg, audio, multi-agent, physics, typography, generative-math, input, dom
- Max 3 fertile per niche; Pareto-non-dominated within each niche are fertile
- Experiments that blur niche boundaries compete in all their niches, fertile if non-dominated in ANY
- Scores decay 5% per day — old experiments drift off the frontier, making room for new ones
