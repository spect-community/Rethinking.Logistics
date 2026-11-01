# PLAN — Rethinking Logistics Edition 1.0

Implementation plan for closing the *Rethinking.Logistics* project (Ramboll Foundation grant) in this repository. Claude Code: read this file and `schema/schema.yml` before every phase, keep the existing principles from `README.md` (no IDs, folder = type, links entered once, `auto_` fields written by `npm run sync`, nothing blocks the build).

How to use this plan: this file holds what applies to **every** phase. Each phase has its own file in `plans/`. In a Claude Code session read **this file + the one phase file** you are working on — nothing else from `plans/` is needed.

## Phases

| # | Phase | File | Status |
| --- | --- | --- | --- |
| 0 | Repository consistency | [plans/phase-0-consistency.md](plans/phase-0-consistency.md) | todo |
| 1 | Schema extension | [plans/phase-1-schema.md](plans/phase-1-schema.md) | todo |
| 2 | Ingest sources and insights | [plans/phase-2-ingest.md](plans/phase-2-ingest.md) | todo |
| 3 | Curation (in batches) | [plans/phase-3-curation.md](plans/phase-3-curation.md) | todo |
| 4 | Five strategies | [plans/phase-4-strategies.md](plans/phase-4-strategies.md) | todo |
| 5 | Edition 1.0 framing | [plans/phase-5-framing.md](plans/phase-5-framing.md) | todo |
| 6 | QA (before release) | [plans/phase-6-qa.md](plans/phase-6-qa.md) | todo |
| 7 | Export and release | [plans/phase-7-release.md](plans/phase-7-release.md) | todo |

Inputs Lukáš provides: [plans/inputs.md](plans/inputs.md). When a phase is approved, set its status to `done` here and add one line to the log below.

## Goal

Publish the knowledge base as a **finished Edition 1.0** (our work is done) in which every expert or student statement carries an explicit **evidence status** (the ball is with the experts). Add **5 strategies** as first-class notes and export them for the project page on spect.cz.

| Grant deliverable | Where it lives after this plan |
| --- | --- |
| D1 Performance Assessment Handbook | This knowledge base, Edition 1.0 (Challenges, Metrics, Tools, Case studies, Insights) |
| D2 Strategies Catalogue | `content/Strategies/` (source of truth) → exported to `spect-community/www` at `/projects/rethinking-logistics/strategies/` |
| D5 Open-access resources | Website + GitHub release archived on Zenodo with DOI |

## Branching (applies to every phase)

- **All changes happen on the branch `edition-1.0`**, created from `main`. Nothing is committed to `main` until the release in Phase 7.
- Each phase is a separate PR **into `edition-1.0`** (or a sub-branch `edition-1.0/phase-N` merged into it).
- `deploy.yml` publishes only on push to `main`, so the live site stays unchanged during the work. Do **not** run *Deploy website* manually (`workflow_dispatch`) from the branch.
- Check-only workflow (`check.yml`) runs on PRs — use it for feedback.
- Contributions arriving through issue forms open PRs against `main` in the meantime: merge them into `main` as usual and rebase / merge `main` into `edition-1.0` before release.
- Preview the branch locally with `npm run preview`.
- Release = merge `edition-1.0` into `main` (triggers deploy) + tag `v1.0.0`.

## Wording rules (apply everywhere)

- The edition is **"Edition 1.0"** — never "draft", "beta" or "working edition".
- Statement-level status uses **"Open for expert review"** — never "unverified".
- Student numbers are **"as reported by the student"**. Lecture statements are **"paraphrased from the lecture"** unless a verbatim timestamped quote exists.
- Funder-facing and public text: English, PR-oriented, accessible; diplomatic framing.

---

## Decisions needed from Lukáš

1. Whether lecturers are named per insight or only per lecture (depends on `lectures.csv` consent column).
2. Final strategy names (English), highlight choice and approval of each strategy text.
3. Whether `verified` survives as an editorial value next to `published`.

## Log

- (date) — phase N done: one-line summary
