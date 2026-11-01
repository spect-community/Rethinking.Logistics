# Phase 1 — Schema extension

> Part of [PLAN.md](../PLAN.md). Read PLAN.md first (goal, branching, wording rules); do not start a later phase before this one is approved.

Add three note types to `schema/schema.yml` and templates to `content/Templates/`.

```yaml
  strategy:
    folder: Strategies
    label: Strategy
    plural: Strategies
    description: One of five integration approaches synthesised from the studio's student projects.
    fields: [number, group, summary, hero_image, posters, status, aliases]

  source:
    folder: Sources
    label: Source
    plural: Sources
    description: Where an insight comes from — an expert lecture, a student questionnaire, or an external publication.
    fields: [source_type, speaker, affiliation, date, url, status, aliases]   # source_type: lecture | questionnaire | publication

  insight:
    folder: Insights
    label: Insight
    plural: Insights
    description: One atomic statement made by an expert, a student or a publication, with its evidence status.
    fields: [statement, source_type, locator, quote_type, evidence_status, confidence, reviewed_by, aliases]
    # source_type: expert | student | external
    # locator: timestamp or transcript line / PDF page
    # quote_type: paraphrase | verbatim
    # evidence_status: open-for-review | expert-reviewed | disputed
```

New relations (entered once on the source side, reverse written by sync):

| from | field | to | auto |
| --- | --- | --- | --- |
| insight | `source` | source | `auto_insights` |
| insight | `challenges` / `metrics` / `case_studies` | challenge / metric / case-study | `auto_insights` |
| strategy | `case_studies` | case-study | `auto_strategies` |
| strategy | `challenges` / `metrics` | challenge / metric | `auto_strategies` |

Derived: `strategy.auto_insights` = insights linked to the strategy's case studies, challenges or metrics (via a `derived` entry; extend `scripts/sync.mjs` if two-hop paths over multiple fields are not yet supported).

Editorial `status` on existing notes: replace `draft` / `verified` by `published` for Edition 1.0 (keep `verified` as a second value only if the site displays it meaningfully). **Editorial status ≠ evidence status**: the first is about our editing (done), the second is about the claim (open for experts).

Site: render a coloured badge per `source_type` (expert / student / external) and per `evidence_status` on insight pages and in lists; add a legend page `About/Evidence status.md`.

**Done when:** `npm run sync && npm run validate && npm run preview` pass with the three empty folders and templates in place.
