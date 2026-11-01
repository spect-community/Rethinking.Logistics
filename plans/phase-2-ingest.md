# Phase 2 — Ingest sources and insights

> Part of [PLAN.md](../PLAN.md). Read PLAN.md first (goal, branching, wording rules); do not start a later phase before this one is approved.

**Inputs:** `import/handbook-claims.md`, `import/lectures.csv`, `import/private/transcripts/raw/`, `import/questionnaires.csv`

Input: `import/handbook-claims.md` (Google Doc export) and `import/lectures.csv` (see *Inputs*).

0. `scripts/convert-transcripts.mjs` (or a Python script): convert raw Teams transcripts (`import/private/transcripts/raw/`, .docx or .vtt) to `import/private/transcripts/md/` as `[hh:mm:ss] Speaker: text`, one file per lecture; file name = `transcript` column in `lectures.csv`. Keep the raw files; the conversion must be repeatable.
1. `scripts/import-insights.mjs`: parse the export into one note per claim in `content/Insights/`. File name = short title (≤ 80 characters, unique). Keep the original text in `statement`, the doc's confidence tag in `confidence`, and the lecture locator in `locator`.
2. Create one `content/Sources/` note per lecture (18) and per questionnaire set; link each insight to its source.
3. Every imported insight gets `evidence_status: open-for-review`. Items from the doc's "Fact-check: do not print as they stand" section and items marked ⚠ get `evidence_status: disputed` and a short note on what needs checking — they stay visible, clearly marked.
4. Speaker attribution: name + affiliation from `lectures.csv`; `quote_type: paraphrase` unless verbatim with timestamp.

**Done when:** count of insight notes = count of claims in the export (report any skipped with reason in `import/import-log.md`); every insight has a source and an evidence status.
