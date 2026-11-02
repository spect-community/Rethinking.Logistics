#!/usr/bin/env node
// Builds the pages in content/Overviews/ from note properties.
// Usage: node scripts/generate-overviews.mjs [--out DIR]

import fs from "node:fs"
import path from "node:path"
import { CONTENT, loadKB, computeAuto, ofType, wl, asList, section, loadConfig, insightBadges } from "./lib/kb.mjs"

const args = process.argv.slice(2)
const oi = args.indexOf("--out")
const OUT = oi >= 0 ? path.resolve(args[oi + 1]) : path.join(CONTENT, "Overviews")
const cfg = loadConfig()
const kb = loadKB()
const auto = computeAuto(kb)
const A = (n, f) => auto.get(n)?.[f] ?? []
const challenges = ofType(kb, "challenge")
const metrics = ofType(kb, "metric")
const tools = ofType(kb, "tool")
const cases = ofType(kb, "case-study")
const refs = ofType(kb, "reference")
const ambitions = ofType(kb, "ambition")

const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim() || "—"
const links = (names) => (names.length ? names.map(wl).join(", ") : "—")
const linked = (n, f) => (n.links[f] ?? []).map((l) => l.note?.name ?? l.name)
const table = (head, rows) =>
  [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n")
const groupBy = (list, f) => {
  const m = new Map()
  for (const x of list) {
    const k = (typeof f === "function" ? f(x) : x.data[f]) || "Uncategorised"
    for (const kk of asList(k)) {
      if (!m.has(kk)) m.set(kk, [])
      m.get(kk).push(x)
    }
  }
  return [...m.entries()].sort((a, b) => (a[0] === "Uncategorised") - (b[0] === "Uncategorised") || a[0].localeCompare(b[0]))
}
const page = (title, description, body) => `---
title: ${title}
description: ${JSON.stringify(description)}
---

> [!abstract] Generated page
> ${description} Rebuilt automatically from the properties of all notes — edit the notes, not this page.

${body.trim()}
`
const pages = {}

// ── Ambitions ────────────────────────────────────────────────────────────────
{
  let body = "From each broad ambition to the design challenges that serve it, and the student projects and strategies that pursue it — directly or through those challenges.\n\n"
  body += table(
    ["Ambition", "In short", "Challenges", "Case studies", "Strategies"],
    ambitions.map((a) => [wl(a.name), esc(a.data.summary), links(A(a, "auto_challenges")), String(A(a, "auto_case_studies").length), links(A(a, "auto_strategies"))]),
  ) + "\n"
  pages["Ambitions overview"] = page("Ambitions overview", "Ambitions → challenges → case studies and strategies.", body)
}

// ── Challenge map ────────────────────────────────────────────────────────────
{
  let body = "From each design challenge to the metrics that inform the decision, the tools that can calculate them, and the student projects that did it.\n\n"
  for (const c of challenges) {
    const ms = A(c, "auto_metrics").map((n) => kb.find(n)).filter(Boolean)
    body += `## ${wl(c.name)}\n\n`
    if (linked(c, "ambitions").length) body += `*Serves the ambition:* ${links(linked(c, "ambitions"))}\n\n`
    if (!ms.length) body += "*No metrics linked yet.*\n\n"
    else
      body += table(
        ["Metric", "How it is calculated", "Tools", "Case studies"],
        ms.map((m) => [wl(m.name), esc(m.data.calculation), links(A(m, "auto_tools")), String(A(m, "auto_case_studies").length)]),
      ) + "\n\n"
    body += `**Case studies:** ${links(A(c, "auto_case_studies"))}\n\n`
  }
  pages["Challenge map"] = page("Challenge map", "Design challenges → metrics → tools → case studies.", body)
}

// ── Metric catalogue ─────────────────────────────────────────────────────────
{
  let body = `**${metrics.length} metrics**, grouped by category. *Origin* says whether students defined the metric themselves, adapted it, or took it from a standard such as BREEAM, LEED or DGNB.\n\n`
  for (const [cat, list] of groupBy(metrics, "category")) {
    body += `## ${cat}\n\n` + table(
      ["Metric", "Unit", "How it is calculated", "Tools", "Used in", "Origin"],
      list.map((m) => [wl(m.name), esc(m.data.unit), esc(m.data.calculation), links(A(m, "auto_tools")), String(A(m, "auto_case_studies").length), esc([m.data.origin, m.data.standard].filter(Boolean).join(" · "))]),
    ) + "\n\n"
  }
  pages["Metric catalogue"] = page("Metric catalogue", "All metrics with their unit and calculation method.", body)
}

// ── Tool directory ───────────────────────────────────────────────────────────
{
  let body = `**${tools.length} tools.** *Used in* counts the case studies in which the tool was actually used.\n\n`
  for (const [cat, list] of groupBy(tools, "category")) {
    body += `## ${cat}\n\n` + table(
      ["Tool", "Platform", "Metrics it can calculate", "Used in"],
      list.map((t) => [wl(t.name), esc(t.data.platform), links(linked(t, "metrics")), A(t, "auto_case_studies").length ? links(A(t, "auto_case_studies")) : "—"]),
    ) + "\n\n"
  }
  pages["Tool directory"] = page("Tool directory", "Tools by category, what they calculate and where they were used.", body)
}

// ── Case studies ─────────────────────────────────────────────────────────────
{
  const rows = cases.map((c) => [wl(c.name), esc(c.data.project), esc(c.data.location), esc(c.data.typology), links(linked(c, "tools")), String(linked(c, "metrics").length)])
  const usage = tools.map((t) => [t, A(t, "auto_case_studies").length]).filter(([, n]) => n).sort((a, b) => b[1] - a[1])
  const body = `${table(["Case study", "Project", "Location", "Typology", "Tools used", "# metrics"], rows)}

## Tool use across the studio

${usage.length ? table(["Tool", "Case studies"], usage.map(([t, n]) => [wl(t.name), String(n)])) : "*No tools linked yet.*"}

Case studies without any linked tool: **${cases.filter((c) => !linked(c, "tools").length).length} of ${cases.length}** — their metrics were estimated by hand, taken from literature, or not quantified.
`
  pages["Case studies overview"] = page("Case studies overview", "All student projects at a glance, and which tools they used.", body)
}

// ── Reference projects ─────────────────────────────────────────────────────
{
  const rows = refs.map((r) => [wl(r.name), esc(r.data.developer), esc(r.data.location), esc(r.data.year), esc(r.data.stage), esc(r.data.typology), String(linked(r, "metrics").length)])
  const body = refs.length
    ? `Built or planned logistics projects from practice, outside the studio. Figures are as published by the developer, the architect or a cited source.

${table(["Reference project", "Developer", "Location", "Year", "Stage", "Typology", "# metrics"], rows)}
`
    : "*No reference projects yet.*"
  pages["Reference projects overview"] = page("Reference projects overview", "Logistics projects from practice at a glance.", body)
}

// ── Trade-offs ───────────────────────────────────────────────────────────────
{
  let body = "Design decisions are trade-offs between metrics. These are the ones the students identified.\n\n"
  for (const c of cases) {
    const t = section(c.body, "Trade-offs")
    if (t) body += `## ${wl(c.name)}\n\n${t}\n\n`
  }
  pages["Trade-offs"] = page("Trade-offs", "Conflicts between metrics found in the student projects.", body)
}

// ── Evidence gaps ────────────────────────────────────────────────────────────
{
  const noTool = metrics.filter((m) => A(m, "auto_case_studies").length && !A(m, "auto_tools").length)
  const unusedTools = tools.filter((t) => !A(t, "auto_case_studies").length)
  const noCase = challenges.filter((c) => !A(c, "auto_case_studies").length)
  const missing = new Map()
  for (const n of kb.notes) for (const [f, ls] of Object.entries(n.links)) for (const l of ls) if (!l.note) {
    if (!missing.has(l.name)) missing.set(l.name, [])
    missing.get(l.name).push(n.name)
  }
  const list = (arr, fn) => (arr.length ? arr.map(fn).join("\n") : "- *none*")
  const body = `## Metrics used by students but not linked to any tool

These were estimated by hand, taken from literature or left unquantified. Each one is an opportunity: which tool *could* calculate it?

${list(noTool, (m) => `- ${wl(m.name)} — used in ${A(m, "auto_case_studies").length} case stud${A(m, "auto_case_studies").length === 1 ? "y" : "ies"}`)}

## Tools not yet used in any case study

${list(unusedTools, (t) => `- ${wl(t.name)} — can calculate: ${links(linked(t, "metrics"))}`)}

## Challenges without a case study

${list(noCase, (c) => `- ${wl(c.name)}`)}

## Linked but not written yet

${list([...missing.entries()], ([name, from]) => `- ${wl(name)} — mentioned in ${from.map(wl).join(", ")}`)}
`
  pages["Evidence gaps"] = page("Evidence gaps", "Where the chain from tool to metric to decision is incomplete.", body)
}

// ── Strategies ───────────────────────────────────────────────────────────────
{
  const strategies = ofType(kb, "strategy").sort((a, b) => (a.data.number ?? 99) - (b.data.number ?? 99))
  const intro = `Five integration approaches synthesised from the student projects of the *Rethinking.Logistics* studio and the expert lectures. Each strategy page links its projects, metrics, trade-offs, evidence gaps and expert insights; every number traces to a linked note.

![[Rethinking.Logistics – Bridging Academia and Industry.jpg]]

![[Methodology.jpg]]

![[Typologies.jpg]]
`
  const body = strategies.length
    ? intro + "\n## The five strategies\n\n" + table(["#", "Strategy", "In short", "Projects"], strategies.map((x) => [String(x.data.number ?? ""), wl(x.name), esc(x.data.summary), links(linked(x, "case_studies"))]))
    : intro + "\n*No strategies yet.*"
  pages["Strategies"] = page("Strategies", "The five strategies and the student projects behind them.", body)
}

// ── Insights ─────────────────────────────────────────────────────────────────
{
  const insights = ofType(kb, "insight")
  const src = (i) => (i.links.source ?? []).map((l) => l.note?.name ?? l.name)
  const about = (i) => [...linked(i, "challenges"), ...linked(i, "metrics"), ...linked(i, "case_studies")]
  const body = insights.length
    ? `**${insights.length} insights** — atomic statements by experts, students and publications. Each carries who made it and where its evidence stands; see [[Evidence status]].

` +
      table(["Insight", "Statement", "Labels", "Source", "About"], insights.map((i) => [wl(i.name), esc(i.data.statement), insightBadges(i.data) || "—", links(src(i)), links(about(i))]))
    : "*No insights yet.* Statements from the expert lectures, student questionnaires and publications will be listed here, each with its evidence status — see [[Evidence status]]."
  pages["Insights overview"] = page("Insights overview", "All insights with who made them and where their evidence stands.", body)
}

// ── Index ────────────────────────────────────────────────────────────────────
pages["index"] = page("Overviews", "Views computed from all notes.", `**At a glance:** ${ambitions.length} ambitions · ${challenges.length} challenges · ${metrics.length} metrics · ${tools.length} tools · ${cases.length} case studies · ${refs.length} reference projects

| Page | Answers |
| --- | --- |
| [[Ambitions overview]] | *What should logistics architecture achieve, and which challenges serve each aim?* |
| [[Challenge map]] | *For my design challenge — what should I measure, and with which tool?* |
| [[Metric catalogue]] | *How is a metric calculated, and who used it?* |
| [[Tool directory]] | *What can a tool calculate, and in which projects was it used?* |
| [[Case studies overview]] | *What did the students design, and which tools did they use?* |
| [[Reference projects overview]] | *Which projects from practice show these approaches built?* |
| [[Trade-offs]] | *Which metrics pull against each other?* |
| [[Evidence gaps]] | *Where is the evidence chain incomplete?* |
| [[Strategies]] | *Which integration approaches does the studio propose, and what is the evidence?* |
| [[Insights overview]] | *What did experts, students and publications say — and has it been reviewed?* |
`)

fs.mkdirSync(OUT, { recursive: true })
for (const [name, text] of Object.entries(pages)) fs.writeFileSync(path.join(OUT, `${name}.md`), text)
console.log(`Wrote ${Object.keys(pages).length} overview pages`)
