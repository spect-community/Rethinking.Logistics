# Phase 0 — Repository consistency

> Part of [PLAN.md](../PLAN.md). Read PLAN.md first (goal, branching, wording rules); do not start a later phase before this one is approved.

Portfolio PDFs and the review notes are **intended to be public** (students consented). The repository should say so consistently.

1. Remove `portfolios/` from `.gitignore`; keep the PDFs and `portfolios/_review-notes.md` tracked.
2. `_review-notes.md`: remove the "(private — not published)" heading text and the sentence saying the folder is excluded from Git and the website.
3. `README.md`: remove "Repository: private" and "kept in this private repository, never published on the website"; describe `portfolios/` as the public archive of student portfolios.
4. Optionally link each case study to its PDF in `portfolios/` next to the existing heyzine `portfolio:` URL.
5. `content/.smart-env/` (Obsidian Smart Connections cache) is tracked by mistake: `git rm -r --cached content/.smart-env` and add it to `.gitignore`.
6. Licence: replace `LICENSE.md` with content **CC BY 4.0** (`content/`, `portfolios/`) + **MIT** (`scripts/`, `site/`, `schema/`, `.github/`). Note that student work and posters remain © their authors, published with their consent.
7. Remove the site-wide banner "All entries are drafts… being reviewed by the studio tutors"; add the Edition 1.0 line to README.

**Done when:** README, `.gitignore`, review notes and licence agree with each other; the local preview shows no draft banner.
