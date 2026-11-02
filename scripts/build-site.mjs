#!/usr/bin/env node
// Builds the public website with Quartz.
//
//  1. Runs the friendly check (warnings only — never stops the build).
//  2. Copies content/ to .build/content and, in that copy only:
//       - regenerates the Overview pages,
//       - adds a property table and a "Connections" section to every note
//         (both directions, computed fresh — even if `npm run sync` was not run),
//       - adds "Also known as" lines so search finds alternative names,
//       - creates placeholder pages for links to notes that don't exist yet,
//       - adds tags (type/…, category/…) for filtering.
//     Your Obsidian vault is never modified.
//  3. Fetches the pinned Quartz version into .quartz/, enables fuzzy search,
//     and builds the site into public/.
//
// Usage: node scripts/build-site.mjs [--serve] [--skip-quartz]

import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"
import yaml from "js-yaml"
import { ROOT, CONTENT, loadKB, loadConfig, computeAuto, asList, wl, key, insightBadges, fillTokens } from "./lib/kb.mjs"

const serve = process.argv.includes("--serve")
const skipQuartz = process.argv.includes("--skip-quartz")
const cfg = loadConfig()
const repoUrl = process.env.SITE_REPO_URL || cfg.repoUrl
const baseUrl = process.env.SITE_BASE_URL || cfg.baseUrl
// The repository is private: public "suggest" links go to e-mail, not to issue forms.
const contactUrl = process.env.SITE_CONTACT_URL || cfg.contactUrl
const projectUrl = process.env.SITE_PROJECT_URL || cfg.projectUrl
const mailto = (subject) => `${contactUrl}?subject=${encodeURIComponent(subject)}`
const BUILD = path.join(ROOT, ".build", "content")
const QUARTZ = path.join(ROOT, ".quartz")
const env = { ...process.env, SITE_REPO_URL: repoUrl, SITE_BASE_URL: baseUrl, SITE_CONTACT_URL: contactUrl, SITE_PROJECT_URL: projectUrl, SITE_TITLE: cfg.title }
const run = (cmd, cwd = ROOT) => execSync(cmd, { cwd, stdio: "inherit", env })

// 1. Check (never fails)
try { run("node scripts/validate.mjs") } catch { /* warnings only */ }

// 2. Prepare the copy
fs.rmSync(path.join(ROOT, ".build"), { recursive: true, force: true })
fs.cpSync(CONTENT, BUILD, { recursive: true, filter: (src) => !/[\\/](Templates|\.obsidian|\.trash)([\\/]|$)/.test(path.relative(ROOT, src)) })
run(`node scripts/generate-overviews.mjs --out "${path.join(BUILD, "Overviews")}"`)

const kb = loadKB()
const { schema } = kb
const auto = computeAuto(kb)
const slugTag = (s) => key(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
const fmt = (v) =>
  asList(v)
    .map((x) => (typeof x === "string" && /^https?:\/\//.test(x) ? `[${x.replace(/^https?:\/\//, "").replace(/\/$/, "").slice(0, 60)}](${x})` : String(x)))
    .join(", ")
    .replace(/\|/g, "\\|")
const LABEL = { student: "Student", project: "Project", portfolio: "Portfolio", studio: "Studio", year: "Year", location: "Location", typology: "Typology", category: "Category", unit: "Unit", calculation: "How it is calculated", origin: "Origin", standard: "Standard", platform: "Platform", developer: "Developer", url: "Website", license: "Licence", status: "Status", number: "Number", group: "Group", summary: "Summary", hero_image: "Image", posters: "Posters", kind: "Kind", speaker: "Speaker", affiliation: "Affiliation", date: "Date", locator: "Where in the source", confidence: "Confidence", reviewed_by: "Reviewed by", architect: "Architect", stage: "Stage", site_area: "Site area", floor_area: "Floor area", certifications: "Certifications" }
// Fields shown elsewhere on the page (not in the property table)
const HIDDEN = new Set(["aliases", "portfolio_pdf", "statement", "source_type", "evidence_status", "quote_type", "relevance", "posters", "hero_image"])
// How the statement was recorded, in the wording of Edition 1.0
const recorded = (d) => {
  if (key(d.quote_type ?? "") === "verbatim") return "Verbatim quote"
  const t = key(d.source_type ?? "")
  return t === "student" ? "As reported by the student" : t === "expert" ? "Paraphrased from the lecture" : t === "external" ? "Paraphrased from the publication" : ""
}

let count = 0
for (const n of kb.notes) {
  const target = path.join(BUILD, n.rel)
  if (!fs.existsSync(target)) continue
  let body = n.body.replaceAll("{{repo}}", repoUrl).replaceAll("{{contact}}", contactUrl).replaceAll("{{project}}", projectUrl)
  body = fillTokens(kb, body)
  let d = { ...n.data }
  if (n.type) {
    const def = schema.types[n.type]
    // property table
    const rows = (def.fields ?? [])
      .filter((f) => !HIDDEN.has(f) && d[f] !== undefined && d[f] !== null && d[f] !== "")
      .map((f) => `| ${LABEL[f] ?? f} | ${fmt(d[f])} |`)
    const aliases = asList(d.aliases).filter((a) => typeof a === "string")
    let top = `> [!info] ${def.label}${d.status ? ` · ${d.status}` : ""}\n> ${def.description}\n\n`
    if (n.type === "insight") {
      const badges = insightBadges(d)
      if (badges) top += `${badges} · [[Evidence status|What do these labels mean?]]\n\n`
      if (d.statement) top += `> ${String(d.statement).trim().replace(/\r?\n/g, " ")}\n${recorded(d) ? `>\n> — *${recorded(d)}*\n` : ""}\n`
    }
    if (rows.length) top += `| | |\n| --- | --- |\n${rows.join("\n")}\n\n`
    if (aliases.length) top += `*Also known as:* ${aliases.join(" · ")}\n\n`
    if (n.type === "case-study" && d.portfolio) top += `**[📖 Open the portfolio](${d.portfolio})**\n\n`
    if (n.type === "reference" && d.url) top += `**[🌐 Open the project website](${d.url})**\n\n`

    // connections, both directions
    const lines = []
    for (const r of schema.relations) {
      if (r.from === n.type) {
        const names = (n.links[r.field] ?? []).map((l) => l.note?.name ?? l.name)
        if (names.length) lines.push(`- **${r.label}:** ${names.map(wl).join(", ")}`)
      }
      if (r.to === n.type) {
        const names = (auto.get(n)[r.auto] ?? []).filter((x) => kb.find(x)?.type === r.from)
        if (names.length) lines.push(`- **${r.auto_label}:** ${names.map(wl).join(", ")}`)
      }
    }
    for (const dr of schema.derived ?? []) if (dr.on === n.type) {
      const names = auto.get(n)[dr.auto] ?? []
      if (names.length) lines.push(`- **${dr.label}:** ${names.map(wl).join(", ")}`)
    }
    const merged = new Map()
    for (const l of lines) {
      const m = l.match(/^- \*\*(.+?):\*\* (.*)$/)
      merged.set(m[1], [...new Set([...(merged.get(m[1]) ?? []), ...m[2].split(", ")])])
    }
    const connections = merged.size ? `\n\n## Connections\n\n${[...merged].map(([k, v]) => `- **${k}:** ${v.join(", ")}`).join("\n")}\n` : ""
    const edit = `\n\n---\n*Something wrong or missing? [Suggest a correction](${mailto("Rethinking Logistics – correction: " + n.name)})*\n`
    // Strategy pages: list items that are just an insight link get its badges and source
    if (n.type === "strategy") {
      body = body.replace(/^- \[\[([^\]|#]+)\]\]\s*$/gm, (m, name) => {
        const t = kb.find(name)
        if (t?.type !== "insight") return m
        const src = t.links.source?.[0]?.note
        const by = src ? ` — ${src.data.speaker ? `${src.data.speaker}, ` : ""}[[${src.name}|${src.data.title ?? src.name}]]` : ""
        return `- [[${t.name}]] ${insightBadges(t.data)}${by}`
      })
    }
    body = top + body.trim() + connections + edit

    // frontmatter for Quartz: drop relation fields, add tags
    for (const k of Object.keys(d)) if (k.startsWith("auto_")) delete d[k]
    for (const r of schema.relations) if (r.from === n.type) delete d[r.field]
    // todo/… tags are working notes for editors, not shown on the site
    const tags = new Set(asList(d.tags).map(String).filter((t) => !t.startsWith("todo/")))
    tags.add(`type/${n.type}`)
    for (const c of asList(d.category)) tags.add(`category/${slugTag(c)}`)
    for (const p of asList(d.platform)) if (n.type === "tool") tags.add(`platform/${slugTag(p)}`)
    d.tags = [...tags]
    d.title ??= n.name
    count++
  }
  if (n.error) d = { title: n.name }
  fs.writeFileSync(target, `---\n${yaml.dump(d, { lineWidth: -1 })}---\n\n${body}`)
}

// placeholder pages for links that point nowhere yet
let stubs = 0
const made = new Set()
for (const n of kb.notes) for (const r of schema.relations.filter((r) => r.from === n.type)) {
  for (const l of n.links[r.field] ?? []) {
    if (l.note || made.has(key(l.name))) continue
    made.add(key(l.name))
    const def = schema.types[r.to]
    const mentions = kb.notes.filter((x) => Object.values(x.links).some((ls) => ls.some((y) => key(y.name) === key(l.name))))
    const safe = l.name.replace(/[\\/:*?"<>|]/g, "-")
    fs.mkdirSync(path.join(BUILD, def.folder), { recursive: true })
    fs.writeFileSync(
      path.join(BUILD, def.folder, `${safe}.md`),
      `---\ntitle: ${JSON.stringify(l.name)}\ntags: [placeholder, type/${r.to}]\n---\n\n> [!todo] Not documented yet\n> This ${def.label.toLowerCase()} is mentioned in the knowledge base, but nobody has written its page yet. [Suggest it](${mailto("Rethinking Logistics – new page: " + l.name)}).\n\n**Mentioned in:** ${mentions.map((m) => wl(m.name)).join(", ")}\n`,
    )
    stubs++
  }
}
console.log(`Prepared ${count} pages (+${stubs} placeholder pages) in .build/content`)
if (skipQuartz) process.exit(0)

// 3. Quartz
const marker = path.join(QUARTZ, ".quartz-version")
if (!fs.existsSync(marker) || fs.readFileSync(marker, "utf8").trim() !== cfg.quartzVersion) {
  console.log(`Fetching Quartz ${cfg.quartzVersion} …`)
  fs.rmSync(QUARTZ, { recursive: true, force: true })
  run(`git clone --depth 1 --branch ${cfg.quartzVersion} https://github.com/jackyzha0/quartz.git .quartz`)
  run("npm ci --no-audit --no-fund", QUARTZ)
  fs.writeFileSync(marker, cfg.quartzVersion)
}
fs.copyFileSync(path.join(ROOT, "site", "quartz.config.ts"), path.join(QUARTZ, "quartz.config.ts"))
fs.copyFileSync(path.join(ROOT, "site", "quartz.layout.ts"), path.join(QUARTZ, "quartz.layout.ts"))
fs.copyFileSync(path.join(ROOT, "site", "custom.scss"), path.join(QUARTZ, "quartz", "styles", "custom.scss"))

// Fuzzy search: accent-insensitive, sound-alike matching (small typos), substring matching in titles,
// and partial matches when not every word is found.
const searchFile = path.join(QUARTZ, "quartz", "components", "scripts", "search.inline.ts")
let s = fs.readFileSync(searchFile, "utf8")
if (!s.includes("/* fuzzy-search */")) {
  s = s
    .replace("  encode: encoder,", '  /* fuzzy-search */ encoder: "LatinExtra",')
    .replace(/field: "title",\s*tokenize: "forward"/, 'field: "title",\n        tokenize: "full"')
    .replace(/field: "tags",\s*tokenize: "forward"/, 'field: "tags",\n        tokenize: "full"')
    .replace(/limit: numSearchResults,\s*index: \["title", "content"\],/, 'limit: numSearchResults,\n        suggest: true,\n        index: ["title", "content"],')
  if (!s.includes('encoder: "LatinExtra"')) console.warn("⚠️  Could not enable fuzzy search (Quartz search code changed) — normal search is used.")
  fs.writeFileSync(searchFile, s)
}

run(`npx quartz build -d "${BUILD}" -o "${path.join(ROOT, "public")}"${serve ? " --serve" : ""}`, QUARTZ)
