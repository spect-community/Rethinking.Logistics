# Rethinking Logistics – instructions for Claude

Knowledge base (Obsidian vault in `content/`, Quartz site at logistics.spect.cz) being finished as **Edition 1.0**. Maintainer: Lukáš (writes in Slovak; repository content and public text are in English).

## Plan
- Plan: `PLAN.md` (always) + only the current phase file in `plans/`. Read them and `schema/schema.yml` at the start of each session; do one phase per session.
- Start each phase by proposing the steps; wait for approval before changing files.
- After a phase is approved, mark it `done` in the PLAN.md table and add one line to its log.

## Git
- Work only on branch `edition-1.0`. Never commit to or push `main`; never run the *Deploy website* workflow.
- Small, descriptive commits; one phase = one PR into `edition-1.0`.

## Knowledge base rules (from README)
- No IDs: file name = title, folder = type. Links are entered once, on the source side.
- Never edit `auto_` fields by hand. After changes run `npm run sync && npm run validate`; preview with `npm run preview`.
- Never invent note names when linking — link only to notes that exist.
- Never change the meaning of a statement; edits are limited to spelling and splitting compound claims.
- Every number on a strategy page must trace to a case study, metric or insight note.

## Inputs
- Inputs are in `import/` (see `plans/inputs.md`). `import/private/` is never committed or published.

## Wording
- Use "Edition 1.0", "Open for expert review", "as reported by the student", "paraphrased from the lecture".
- Never use "draft", "beta", "working edition" or "unverified" in content or on the site.
- Public text: English, accessible, PR-oriented; diplomatic framing (e.g. "where current standards limit the approach").

## Checkpoints
- Stop after each phase, and after each curation batch in Phase 3, and summarise what changed (files, counts, open questions) for review before continuing.
