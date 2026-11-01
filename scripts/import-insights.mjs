#!/usr/bin/env node
// Imports the claim bank (import/handbook-claims.md, a Google Doc export) into
// one Insight note per claim, plus one Source note per lecture and publication.
//
//  Part 4 (lectures)  → source_type: expert,   source = lecture (from import/lectures.csv)
//  Part 5 (supplement) → source_type: external, source = first linked publication
//  Part 6 (fact-check) → evidence_status: disputed + what needs checking (refuted or
//                        unverifiable items); confirmed items get a note only
//  ⚠ sensitive         → written to import/private/held-insights/ (git-ignored: neither in the
//                        public repository nor on the website) until cleared with the speaker
//
// Statements are copied unchanged (Markdown escapes removed). A log of counts,
// skips and discrepancies is written to import/import-log.md.
//
// Usage: node scripts/import-insights.mjs [--force]
//   Refuses to run when content/Insights already holds notes, unless --force
//   (which overwrites notes of the same name — curation edits would be lost).

import fs from "node:fs"
import path from "node:path"
import { ROOT, CONTENT, key } from "./lib/kb.mjs"

const force = process.argv.includes("--force")
const IMPORT = path.join(ROOT, "import")
const INSIGHTS = path.join(CONTENT, "Insights")
const SOURCES = path.join(CONTENT, "Sources")
const HELD = path.join(IMPORT, "private", "held-insights")
const TRANSCRIPTS = path.join(IMPORT, "private", "transcripts", "md")

const existing = fs.existsSync(INSIGHTS) ? fs.readdirSync(INSIGHTS).filter((f) => f.endsWith(".md")) : []
if (existing.length && !force) {
  console.error(`content/Insights already has ${existing.length} notes. Re-run with --force to overwrite them (curation edits would be lost).`)
  process.exit(1)
}

// ── helpers ──────────────────────────────────────────────────────────────────
const unescape = (s) => s.replace(/\\([~+&=#_*\[\]().!<>|-])/g, "$1").replace(/\s+$/g, "").trim()
const q = (s) => JSON.stringify(s)
const fileSafe = (s) =>
  unescape(s)
    .replace(/⚠\s*sensitive/g, "")
    .replace(/:\s*/g, " – ")
    .replace(/\/(?=m²|yr)/g, " per ")
    .replace(/[\\/]/g, "-")
    .replace(/[?*"<>|#^\[\]]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[ .]+$/, "")
    .trim()
const short = (s, n = 80) => {
  if (s.length <= n) return s
  const cut = s.slice(0, n - 1)
  return cut.slice(0, cut.lastIndexOf(" ") > 40 ? cut.lastIndexOf(" ") : cut.length).replace(/[ ,;–-]+$/, "") + "…"
}
const used = new Map()
const uniqueName = (base, suffix) => {
  let name = short(base)
  if (used.has(key(name))) name = short(base, 80 - suffix.length - 3) + ` (${suffix})`
  let i = 2
  while (used.has(key(name))) name = short(base, 72) + ` (${suffix} ${i++})`
  used.set(key(name), true)
  return name
}
const yamlList = (k, xs) => (xs.length ? `${k}:\n${xs.map((x) => `  - ${q(x)}`).join("\n")}` : `${k}: []`)
const parseCsv = (text) => {
  const rows = []
  let row = [], cell = "", inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') inQ = false
      else cell += c
    } else if (c === '"') inQ = true
    else if (c === ",") { row.push(cell); cell = "" }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++
      row.push(cell); cell = ""
      if (row.some((x) => x !== "")) rows.push(row)
      row = []
    } else cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  const [head, ...rest] = rows
  return rest.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? "").trim()])))
}
const norm = (s) => key(s).replace(/[^a-z0-9]+/g, " ").trim()

// ── inputs ───────────────────────────────────────────────────────────────────
const doc = fs.readFileSync(path.join(IMPORT, "handbook-claims.md"), "utf8").replace(/\r\n/g, "\n")
const lines = doc.split("\n")
const lectures = parseCsv(fs.readFileSync(path.join(IMPORT, "lectures.csv"), "utf8").replace(/^﻿/, ""))
const lectureById = Object.fromEntries(lectures.map((l) => [l.lecture_id.padStart(2, "0"), l]))
const part = (title) => lines.findIndex((l) => l.startsWith(`# Part ${title}`))
const P4 = part("4"), P5 = part("5"), P6 = part("6")

// ── fact-check (Part 6) ──────────────────────────────────────────────────────
const factCheck = {}
for (const l of lines.slice(P6)) {
  const m = l.match(/^\|\s*(\d+)\s*\|(.*?)\|(.*)\|\s*$/)
  if (m) factCheck[m[1]] = { claim: unescape(m[2]), verdict: unescape(m[3]) }
}
// Claims the fact-check refers to (by claim title, as in the export).
// Disputed: refuted or unverifiable. Confirmed: checked and found correct or close.
const DISPUTED = {
  "13.5 Gt/yr, and where it actually sits": "1",
  "Fastest-growing segment in real estate": "2",
  "78% of land already altered": "4",
  "The lilac vs the oak": "5",
  "2027–2030: whole-life carbon becomes mandatory": "6",
  "Last mile is shortest but costliest": "7",
  "Construction traffic dwarfs parcel traffic": "7",
  "Copenhagen's liveability worth EUR 5bn GDP": "8",
  "E-commerce is not the main occupier — and is shrinking": "9",
  "Manufacturing take-up more than doubled": "9",
  "4.7% vs 8–9% vs 14–15%": "10",
  "The best logistics building he knows is a 1970s brick shed": "11",
  "A view raises memory by 10–25%": "12",
  "Daylight buys 18% productivity, retail 15–40%": "12",
}
const CONFIRMED = {
  "Efficiency has hit a plateau at 1.5": "3",
  "Netherlands has had carbon limits since 2018": "6",
  "Production wants low, distribution wants high — for energy reasons": "13",
  "Czech height limits are quietly repelling investment": "13",
  "Vacancy: 5.5% average, but zero in Munich and Hamburg": "14",
  "Yields: 8% then 3.5% then 5%, now flat": "14",
  "Investment is a EUR 40bn market, three-quarters European": "14",
  "BNG used outside Britain, as a design instrument": "15",
}

// ── parse claims ─────────────────────────────────────────────────────────────
function parseClaims(from, to, onHeading) {
  const out = []
  let cur = null
  for (let i = from; i < to; i++) {
    const l = lines[i]
    if (/^##\s/.test(l)) { onHeading(l, i); cur = null; continue }
    const m = l.match(/^- \*\*(.+?)\*\*(?:\s+—\s+(.*))?\s*$/)
    if (m) {
      cur = { title: unescape(m[1]), text: m[2] ?? "", sub: {}, line: i + 1, ctx: onHeading.ctx?.() }
      out.push(cur)
      continue
    }
    if (!cur) continue
    const s = l.match(/^\s+- \*([^*]+):\*\s*(.*)$/)
    if (s) cur.sub[s[1].trim()] = s[2].trim()
    else if (l.trim() && !/^\s+-/.test(l) && !Object.keys(cur.sub).length) cur.text += " " + l.trim()
  }
  return out
}

let lectureId = null
const lectureMeta = {}
const lectureHeading = (l, i) => {
  const m = l.match(/^## Lecture (\d+)/)
  lectureId = m ? m[1] : null
  if (lectureId) {
    const spine = lines.slice(i, i + 12).find((x) => x.startsWith("**Spine:**"))
    const speakerLine = lines.slice(i, i + 4).find((x) => /^\*\*Speakers?:\*\*/.test(x))
    lectureMeta[lectureId] = { heading: l.replace(/^## /, ""), spine: spine ? unescape(spine.replace("**Spine:**", "")) : "", speakerLine: speakerLine ? unescape(speakerLine.split("**File:**")[0].replace(/^\*\*Speakers?:\*\*/, "")) : "" }
  }
}
lectureHeading.ctx = () => lectureId
let theme = null
const themeHeading = (l) => { theme = l.replace(/^##\s+/, "") }
themeHeading.ctx = () => theme

const lectureClaims = parseClaims(P4, P5, lectureHeading)
const supplementClaims = parseClaims(P5, P6, themeHeading)

// ── sources ──────────────────────────────────────────────────────────────────
fs.mkdirSync(SOURCES, { recursive: true })
fs.mkdirSync(INSIGHTS, { recursive: true })
fs.mkdirSync(HELD, { recursive: true })
const sourceName = {}
const log = { skipped: [], notes: [], sensitive: [], disputed: [], confirmed: [], verbatim: [], quoteChecks: {} }

const isoDate = (s) => {
  const m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/)
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : ""
}
for (const [id, l] of Object.entries(lectureById)) {
  const name = fileSafe(l.title)
  sourceName[id] = name
  const meta = lectureMeta[id]
  if (meta?.speakerLine) log.notes.push(`Lecture ${id}: lectures.csv gives "${l.speaker}, ${l.affiliation}"; the export gives "${meta.speakerLine.trim()}". The CSV is used.`)
  const named = key(l.consent_to_be_named) === "yes"
  fs.writeFileSync(
    path.join(SOURCES, `${name}.md`),
    `---
title: ${q(l.title)}
kind: lecture
speaker: ${q(named ? l.speaker : "")}
affiliation: ${q(l.affiliation)}
date: ${isoDate(l.date)}
url: ${q(l.video_recording_url)}
status: published
aliases: []
---

Lecture ${Number(id)} of the *Rethinking.Logistics* expert lecture series at ARCHIP, ${l.date.split(",")[0].trim()}.

## About this source

${meta?.spine ? meta.spine + "\n\n*Summary paraphrased from the lecture.*" : "*No summary yet.*"}
`,
  )
}
const publications = new Map()
const linkRe = /\[([^\]]+)\]\(([^)\s]+)\)/g
for (const c of supplementClaims) {
  const links = [...(c.sub.Source ?? "").matchAll(linkRe)].map((m) => ({ text: unescape(m[1]), url: m[2] }))
  c.links = links
  if (!links.length) continue
  const first = links[0]
  if (!publications.has(first.url)) {
    let name = short(fileSafe(first.text), 80)
    while ([...publications.values()].some((p) => key(p.name) === key(name))) name = short(name, 74) + " (2)"
    publications.set(first.url, { name, text: first.text })
  }
  c.sourceName = publications.get(first.url).name
}
for (const [url, p] of publications) {
  fs.writeFileSync(
    path.join(SOURCES, `${p.name}.md`),
    `---
title: ${q(p.text)}
kind: publication
speaker: ""
affiliation: ""
date:
url: ${q(url)}
status: published
aliases: []
---

## About this source

External publication cited in the public-domain supplement of the claim bank.
`,
  )
}

// ── transcripts (for checking quotes only) ───────────────────────────────────
const transcript = {}
for (const [id, l] of Object.entries(lectureById)) {
  const f = path.join(TRANSCRIPTS, l.transcript_file_name)
  if (fs.existsSync(f)) transcript[id] = norm(fs.readFileSync(f, "utf8").replace(/^\[[^\]]*\] [^:]*: /gm, ""))
}

// ── insights ─────────────────────────────────────────────────────────────────
const tagsOf = (c) => {
  const t = (c.sub.Tags ?? "").split("·")[0]
  return t.split(",").map((x) => unescape(x).trim().toLowerCase()).filter(Boolean).map((x) => `topic/${x.replace(/\s+/g, "-")}`)
}
const confidenceOf = (c) => {
  const m = (c.sub.Tags ?? "").match(/\*Confidence:\*\s*(.*)$/)
  return m ? unescape(m[1].replace(/\*\*/g, "")).replace(/\s+/g, " ") : ""
}
const stripQuote = (s) => unescape(s).replace(/^["“]|["”]$/g, "")
let written = 0

function writeInsight(c, opts) {
  const sensitive = /⚠\s*sensitive/.test(c.title)
  const cleanTitle = c.title.replace(/\s*⚠\s*sensitive/, "").trim()
  const name = uniqueName(fileSafe(cleanTitle), opts.suffix)
  let statement = unescape(c.text)
  let quoteType = "paraphrase"
  const quote = c.sub.Quote ? stripQuote(c.sub.Quote) : ""
  if (!statement) {
    if (!quote) { log.skipped.push(`line ${c.line}: "${c.title}" — no statement and no quote`); return }
    statement = quote
    quoteType = "verbatim"
    if (!sensitive) log.verbatim.push(name)
  }
  const fcKey = Object.keys(DISPUTED).find((k) => k === cleanTitle)
  const okKey = Object.keys(CONFIRMED).find((k) => k === cleanTitle)
  const evidence = fcKey ? "disputed" : "open-for-review"
  let body = ""
  if (quote && quoteType === "paraphrase") body += `## Quote\n\n> "${quote}"\n\n`
  if (fcKey) {
    const fc = factCheck[DISPUTED[fcKey]]
    body += `## What needs checking\n\nA verification pass against public sources (claim bank, fact-check item ${DISPUTED[fcKey]}) found:\n\n${fc.verdict}\n\n`
    if (!sensitive) log.disputed.push(`${name} — fact-check item ${DISPUTED[fcKey]}`)
  } else if (okKey) {
    const fc = factCheck[CONFIRMED[okKey]]
    body += `## Externally checked\n\nA verification pass against public sources (claim bank, fact-check item ${CONFIRMED[okKey]}) found:\n\n${fc.verdict}\n\n`
    if (!sensitive) log.confirmed.push(`${name} — fact-check item ${CONFIRMED[okKey]}`)
  }
  const confidence = confidenceOf(c)
  if (/^check/i.test(confidence)) body += `## Transcription\n\nThe number or wording may have been garbled in the transcript, or the speaker hedged it (${confidence.replace(/^check\s*—?\s*/i, "") || "no reason given"}). To be checked against the recording.\n\n`
  if (opts.kind === "external" && c.links?.length > 1) body += `## Further sources\n\n${c.links.slice(1).map((l) => `- [${l.text}](${l.url})`).join("\n")}\n\n`
  if (sensitive) log.sensitive.push(name)
  if (quote && opts.lectureId && transcript[opts.lectureId] !== undefined) {
    const qc = (log.quoteChecks[opts.lectureId] ??= { found: 0, total: 0 })
    qc.total++
    const words = norm(quote).split(" ").slice(0, 8).join(" ")
    if (words && transcript[opts.lectureId].includes(words)) qc.found++
  }
  const fm = [
    "---",
    `statement: ${q(statement)}`,
    `source_type: ${opts.kind === "lecture" ? "expert" : "external"}`,
    `locator: ${q(c.sub.Where ? unescape(c.sub.Where) : "")}`,
    `quote_type: ${quoteType}`,
    `evidence_status: ${evidence}`,
    `confidence: ${q(confidence)}`,
    `reviewed_by: ""`,
    ...(sensitive ? ["held: \"⚠ sensitive in the claim bank — clear with the speaker, then move to content/Insights/\""] : []),
    `aliases: []`,
    yamlList("tags", tagsOf(c)),
    `source: ${q(opts.source ? `[[${opts.source}]]` : "")}`,
    "challenges: []",
    "metrics: []",
    "case_studies: []",
    "---",
    "",
  ].join("\n")
  fs.writeFileSync(path.join(sensitive ? HELD : INSIGHTS, `${name}.md`), fm + body.trimEnd() + "\n")
  written++
}

for (const c of lectureClaims) {
  if (!c.ctx || !lectureById[c.ctx]) { log.skipped.push(`line ${c.line}: "${c.title}" — lecture ${c.ctx} not in lectures.csv`); continue }
  writeInsight(c, { kind: "lecture", source: sourceName[c.ctx], suffix: `L${c.ctx}`, lectureId: c.ctx })
}
for (const c of supplementClaims) {
  if (!c.sourceName) { log.skipped.push(`line ${c.line}: "${c.title}" — no source link`); continue }
  writeInsight(c, { kind: "external", source: c.sourceName, suffix: "ext" })
}

// ── log ──────────────────────────────────────────────────────────────────────
const total = lectureClaims.length + supplementClaims.length
const perLecture = Object.entries(Object.groupBy(lectureClaims, (c) => c.ctx)).sort(([a], [b]) => a.localeCompare(b)).map(([id, cs]) => `| ${id} | ${lectureById[id]?.speaker ?? "?"} | ${cs.length} | ${transcript[id] !== undefined ? `${log.quoteChecks[id]?.found ?? 0} of ${log.quoteChecks[id]?.total ?? 0}` : "no transcript"} |`)
const report = `# Import log — claim bank → insights

Generated by \`scripts/import-insights.mjs\` on ${new Date().toISOString().slice(0, 10)}.

## Counts

| | Count |
| --- | --- |
| Claims in Part 4 (lectures) | ${lectureClaims.length} |
| Claims in Part 5 (public-domain supplement) | ${supplementClaims.length} |
| **Claims in the export** | **${total}** |
| **Insight notes written** | **${written}** |
| Skipped | ${log.skipped.length} |
| Source notes: lectures | ${Object.keys(lectureById).length} |
| Source notes: publications | ${publications.size} |
| Held back (⚠ sensitive → \`import/private/held-insights/\`) | ${log.sensitive.length} |
| \`evidence_status: disputed\` (fact-check) | ${log.disputed.length} |
| Confirmed by the fact-check (note added) | ${log.confirmed.length} |
| Statement is the verbatim quote (no paraphrase in the export) | ${log.verbatim.length} |

The export's own introduction says "626 claims" for Part 4; the file contains ${lectureClaims.length}.

## Per lecture

Quotes found = the first eight words of the export's quote appear in the converted transcript (a check of the export, not of the speaker).

| Lecture | Speaker (lectures.csv) | Claims | Quotes found in transcript |
| --- | --- | --- | --- |
${perLecture.join("\n")}

## Skipped

${log.skipped.length ? log.skipped.map((x) => `- ${x}`).join("\n") : "None."}

## Disputed (from Part 6)

${log.disputed.map((x) => `- ${x}`).join("\n")}

## Confirmed by the fact-check

${log.confirmed.map((x) => `- ${x}`).join("\n")}

## Held back — ⚠ sensitive

${log.sensitive.length} insights were written to \`import/private/held-insights/\` (git-ignored), not to the knowledge base: they are neither in the public repository nor on the website. Their titles are listed only in that folder. To publish one after clearing it with the speaker, remove its \`held\` line and move it to \`content/Insights/\`.

## Statement taken from the quote

${log.verbatim.map((x) => `- ${x}`).join("\n")}

## Discrepancies between lectures.csv and the export

${log.notes.map((x) => `- ${x}`).join("\n")}
`
fs.writeFileSync(path.join(IMPORT, "import-log.md"), report)
console.log(`Claims: ${total} · insights written: ${written} · skipped: ${log.skipped.length} · sources: ${Object.keys(lectureById).length} lectures + ${publications.size} publications`)
console.log(`Held back (sensitive): ${log.sensitive.length} · disputed: ${log.disputed.length} · confirmed: ${log.confirmed.length} · verbatim: ${log.verbatim.length}`)
