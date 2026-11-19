# Phase 8 — System layer: problem statements, investor metrics and the kb-update package

> Part of [PLAN.md](PLAN.md). Proposal for review with Lukáš; nothing in this file is implemented until approved.

**Inputs:** `import/import_value-translation-gap.md` (ULI + Ilora; already drafted on branch `add/value-translation-gap`, uncommitted), `import/kb-update/` (UPGRADE-PLAN, 10 sources, 19 insights, 1 challenge, 4 metrics, 2 reference projects, "Common misreading" snippet).

## Why
The knowledge base documents the design level (15 spatial challenges). The final report argues that the main obstacle is the system around design: short investment horizon, speculative development for an unknown tenant, split incentive, certificates met on paper. This phase adds that system level so that every claim in the report traces to a note.

## Key idea: problem statements are the system level
UPGRADE-PLAN §9 asks for option A (insights only) or B (`level: design | system` on challenges). Recommended instead: **C — the new Problem statement type is the system layer.** Challenges stay spatial ("what to design"); problem statements hold the non-spatial causes ("why good design does not get built") and link down to challenges, metrics, trade-offs and insights. In the Extended Double Diamond this is the problem-framing stage, before challenges. No change to the challenge type, one new type, one overview, one entry on the home page.

## 1. Problem statements (7 notes, flat, descriptive names)
The single note "The value–performance translation gap" is removed; its main text and the translation-chain table become the intro of the generated overview `Overviews/Problem statements`.

| # | Note | Main evidence |
|---|---|---|
| 1 | Savings reach the tenant, costs stay with the owner | ULI split incentive; Under triple-net…; Energy is 1% of a company's budget; Transport is half the supply-chain cost…; kb-update 14–16 (labour-to-rent, vacancy, Savills); metrics Operating expense ratio, Labour-to-rent cost ratio, Staff turnover and replacement cost |
| 2 | The return on quality is hypothetical for new buildings | ULI premiums (4 insights); kb-update 13 (IPUT ~10 %), 18 (Target Zero cost uplift); Certificates are a language for banks; The real green lever…; metrics Green rent premium, Rent premium for quality, Green valuation premium, Void period |
| 3 | Built to be sold: the short investment horizon | kb-update 1, 2, 3, 10, 17 (partner estimates, Clarion spread); Lease length is the hidden design brief; challenge Designing for an unknown tenant; metric Oversizing ratio |
| 4 | Certificates can be met without meeting their intention | kb-update 11, 12 (Schweber & Haroglu, biodiversity review); Sustainability arrives as a minimum…; A greenwash premium…; Measure it or you're just claiming it; "Common misreading" sections |
| 5 | Owners lack the data to manage performance | ULI data insights (2); The real energy breakthrough is building management data; Rethink the normalising unit per typology; metric Whole-building energy data coverage |
| 6 | Trade-offs cross the line between design and value | the 4 value trade-offs (clear height, NOI per m², green rent premium, daylight) |
| 7 | Warehouses are valued as assets, not as places | Architects design assets…; Investors chase tenant credit…; We can price carbon, not nature; kb-update 7, 8 (partners on city negotiations) |

Each note: problem text (from the packages, meaning unchanged), linked insights with statements, metrics, trade-offs, sources, and its evidence gaps. Challenges and domains are derived through shared metrics (sync), not chosen by hand. Home page: new entry "Through problems — for developers and investors".

## 2. kb-update content
- **Sources (10 → 9 published):** biodiversity review and PERE interview keep "to be completed" for missing authors/date (not guessed). Partner feedback source: see question Q2.
- **Insights (19):** 1–6 and 10 get `confidence: "check — unverified partner estimate"` (existing vocabulary); 4 gets `draft: true` until permission; 19 (own analysis) is not an insight — the generated Evidence gaps page already computes it (Ecological connectivity: 2 projects, no tool), and the Common misreading section links there. 5, 6 → Land take challenge; 9 → no links, relevance 1.
- **Challenge:** Designing for an unknown tenant (ambitions via its field; "Related challenges" as body links). Metrics that inform it get the challenge in their `challenges` field (source side): Oversizing ratio, Space utilisation, Adaptability, Embodied carbon intensity, Land take.
- **Metrics (4):** Labour-to-rent cost ratio, Staff turnover and replacement cost → Economy; Oversizing ratio → Logistics operations; Rent premium for quality → see Q3 (overlaps Green rent premium).
- **Reference projects:** Bestseller Logistics Centre North (C.F. Møller, published facts only). Speculative big-box baseline → see Q4.
- **Common misreading:** optional section in the challenge template; filled for Habitat loss and cut ecological corridors and Designing for an unknown tenant.
- **Trade-off:** new "Green quantity against green continuity" (green area ratio vs ecological connectivity), backed by the biodiversity review.

## 3. Evidence gaps through properties
New optional field `evidence_gaps` (list of short sentences) on any note; the Evidence gaps overview collects them in a section "Reported gaps", linked to the note. Used for: oversizing (no tool, no measured case), certification intention (no tool checks it), staff turnover (no European data), and the 3 ULI gaps (benchmarks, pricing nature, US units). Ecological connectivity is already computed.

## 4. Not in this phase
- Ambition "Long-term value and quality that pays back": not added. Ambitions are taken from how students framed their briefs; the economic metrics connect through problem statements instead.
- Release as Edition 1.1, changelog, Zenodo: see Q5 (release work moved to spect-community/www).
- "Differing national norms": no input material yet.

## Questions for Lukáš
1. Approve option C (problem statements as the system layer) and the 7 names?
2. Partner feedback: attribute to named partners or to "industry partners"? Source `kind` has lecture | questionnaire | publication — add `meeting`, or use `lecture`?
3. Rent premium for quality vs Green rent premium: merge into one metric (IPUT ~10 % and the Dutch survey as two reported values), or keep both (quality/amenities vs certification)?
4. Speculative big-box baseline: the reference type is "a built or planned project", and the note has no values yet. Hold as `draft: true` until a specification exists, or skip?
5. Reciprocal link Bestseller West → North: links are entered once on the source side. Add a `related_projects` relation (reference → reference) so it appears automatically, or just a body link in North only?
6. Edition 1.1: CLAUDE.md requires the wording "Edition 1.0". Keep 1.0 with a changelog, or move to 1.1 (then the wording rule and About pages change)?
7. Insight 4 (services oversized by up to 50 %): stays unpublished until the partner confirms — OK?

## Verification
`npm run sync && npm run validate` (no broken links, number check), local Quartz build, diagram shows the Problem statements node, overviews Problem statements / Trade-offs / Evidence gaps render the new content, home counts updated.
