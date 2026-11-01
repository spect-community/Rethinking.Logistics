# Phase 3 — Curation (Claude, in batches)

> Part of [PLAN.md](../PLAN.md). Read PLAN.md first (goal, branching, wording rules); do not start a later phase before this one is approved.

**Inputs:** output of Phase 2 (insight and source notes)

Process insights in batches of ~50 with structured output written to frontmatter. For each insight:

1. **Deduplicate**: merge near-identical statements; keep all sources on the merged note.
2. **Link**: assign challenges, metrics and case studies **only** from existing notes; never invent a note name. A link needs a one-line justification recorded in `import/curation-log.md`.
3. **Score relevance** 1–3 to the knowledge base (3 = directly informs a metric or decision). Relevance 1 stays in the base but is excluded from strategy pages.
4. **Flag** contradictions between insights and implausible numbers → `evidence_status: disputed` + reason.
5. Never change the meaning of a statement; edits limited to spelling and splitting compound claims.

Human check: Lukáš reviews a random 10 % sample per batch; if the error rate is above ~10 %, the batch is redone with corrected instructions.

**Done when:** all insights have relevance and links (or an explicit "no link" note); curation log complete; sample checks recorded.
