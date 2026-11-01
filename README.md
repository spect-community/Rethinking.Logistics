# Rethinking.Logistics

**Evidence-based design in logistics architecture.** A knowledge base that links design **challenges** to the **metrics** that inform decisions, the **tools** that calculate them, and **case studies** — student projects from the *Rethinking.Logistics* studio at ARCHIP Prague (2026).

**Edition 1.0** — the knowledge base is complete and open for expert review: every statement carries its evidence status, and experts are invited to confirm or correct it.

```
Case study ──uses──▶ Tool ──calculates──▶ Metric ──informs decisions on──▶ Challenge
```

- **Authoring:** Obsidian — open the `content/` folder as a vault.
- **Website:** Quartz static site on GitHub Pages at <https://logistics.spect.cz>, rebuilt on every push. Project page: <https://spect.cz/projects/rethinking-logistics/>.
- **Repository:** public, in the [SPECT Community](https://github.com/spect-community) organisation.
- **Contributions:** members use GitHub issue forms → review → automatic pull request. The public website links to e-mail (`contactUrl` in `site.config.json`).

## Simple by design

- **No IDs.** A note's file name is its title; its folder is its type (`Challenges/`, `Metrics/`, `Tools/`, `Case studies/`).
- **No allowed-value lists.** Any value you type is accepted; new categories simply become new groups.
- **Nothing blocks the build.** The check only warns. Links to notes that don't exist yet get a placeholder page.
- **Links are entered once.** `npm run sync` (and GitHub, on every push) writes the reverse links into the other notes as `auto_…` properties — never edit those by hand.

| Entered in… | Property | Written automatically into… |
| --- | --- | --- |
| Case study | `challenges`, `metrics`, `tools` | `auto_case_studies` on challenges, metrics, tools |
| Tool | `metrics` | `auto_tools` on metrics |
| Metric | `challenges` | `auto_metrics` (and `auto_tools`) on challenges |

The structure is described in `schema/schema.yml`.

## Repository layout

```
content/            Obsidian vault = website content (About, Challenges, Metrics, Tools, Case studies, Overviews, Templates, Attachments)
schema/schema.yml   note types, their properties and relations
scripts/            sync.mjs · validate.mjs · generate-overviews.mjs · build-site.mjs · issue-to-note.mjs
site/               Quartz configuration, layout and styles
.github/            issue forms and workflows
portfolios/         public archive of student portfolios (PDF), published with the students' consent
```

## Working locally

Node.js 22+ and Git.

```bash
npm install
npm run sync       # write reverse links (auto_ properties)
npm run validate   # friendly check, warnings only
npm run preview    # build and serve at http://localhost:8080
```

## Search

The website search is patched at build time to be fuzzy: it ignores accents, matches parts of words and tolerates small typos (FlexSearch `LatinExtra` encoder, full tokenisation of titles, partial-match suggestions).

## Publishing

The site is served from the custom domain `logistics.spect.cz` (DNS: `CNAME logistics → spect-community.github.io`). The domain is set in `SITE_BASE_URL` in `.github/workflows/deploy.yml` and `baseUrl` in `site.config.json`, and in **Settings → Pages → Custom domain**.

One-time repository settings:

1. **Settings → Pages → Source: GitHub Actions**, custom domain `logistics.spect.cz`, **Enforce HTTPS**.
2. **Settings → Actions → General → Workflow permissions:** *Read and write* + *Allow GitHub Actions to create and approve pull requests*.
3. **Actions → Set up labels → Run workflow** (creates the labels the forms use).

## Licence

Content (`content/`, `portfolios/`) is licensed under **CC BY 4.0**; code (`scripts/`, `site/`, `schema/`, `.github/`) under **MIT**. Student work and posters remain © their authors and are published with their consent. See `LICENSE.md`.
