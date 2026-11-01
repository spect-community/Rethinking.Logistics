# Phase 7 — Export and release

> Part of [PLAN.md](../PLAN.md). Read PLAN.md first (goal, branching, wording rules); do not start a later phase before this one is approved.

**Inputs:** `import/metadata.yml`; the `spect-community/www` repository for the strategies export

0. Phase 6 (QA) passed and Lukáš approved the release.
1. `scripts/export-strategies.mjs` → `export/strategies/` with one Markdown file per strategy (frontmatter for the www site), poster images, and absolute deep links to `https://logistics.spect.cz/...`. Copy to `spect-community/www` manually or by PR.
2. Add `CITATION.cff` and `.zenodo.json` (title, authors, ARCHIP / SPECT, Ramboll Foundation funding, licence, keywords).
3. Merge `edition-1.0` into `main` (this deploys the site). Enable the GitHub–Zenodo integration; tag `v1.0.0` on `main` → GitHub release → Zenodo DOI. Put the DOI badge in README and the About page.
