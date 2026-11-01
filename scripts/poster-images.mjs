#!/usr/bin/env node
// Web images of the exhibition posters for the strategy pages.
//
// Reads import/posters.csv (poster_title, file, …) and writes one JPG per poster to
// content/img/posters/<poster title>.jpg — at most 1600 px wide and 400 kB.
// Source files are the PNG sheets in import/posters/ (not committed). Run again
// when higher-resolution sheets arrive; existing images are overwritten.
//
// Uses `sharp` from the Quartz install (.quartz/node_modules); run `npm run build`
// once first if .quartz/ is missing.
//
// Usage: node scripts/poster-images.mjs

import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import { ROOT, CONTENT } from "./lib/kb.mjs"

const require = createRequire(path.join(ROOT, ".quartz", "package.json"))
const sharp = require("sharp")
const SRC = path.join(ROOT, "import", "posters")
const OUT = path.join(CONTENT, "img", "posters")
const MAX_W = 1600
const MAX_BYTES = 400 * 1024

const parseCsv = (text) => {
  const rows = []
  let row = [], cell = "", q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ } else if (c === '"') q = false; else cell += c }
    else if (c === '"') q = true
    else if (c === ",") { row.push(cell); cell = "" }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); cell = ""; if (row.some(Boolean)) rows.push(row); row = [] }
    else cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  const [h, ...r] = rows
  return r.map((x) => Object.fromEntries(h.map((k, i) => [k.trim(), (x[i] ?? "").trim()])))
}
export const posterFileName = (title) =>
  title.split(";")[0].replace(/[:?*"<>|#^\[\]\\/]/g, "").replace(/\s+/g, " ").trim() + (title.includes(";") ? " (group)" : "") + ".jpg"

const posters = parseCsv(fs.readFileSync(path.join(ROOT, "import", "posters.csv"), "utf8").replace(/^﻿/, ""))
fs.mkdirSync(OUT, { recursive: true })
for (const p of posters) {
  const src = path.join(SRC, p.file)
  if (!fs.existsSync(src)) { console.log(`missing source: ${p.file}`); continue }
  const out = path.join(OUT, posterFileName(p.poster_title))
  let q = 82, buf
  do {
    buf = await sharp(src, { limitInputPixels: false }).resize({ width: MAX_W, withoutEnlargement: true }).jpeg({ quality: q, mozjpeg: true }).toBuffer()
    q -= 6
  } while (buf.length > MAX_BYTES && q > 30)
  fs.writeFileSync(out, buf)
  console.log(`${path.basename(out)} — ${Math.round(buf.length / 1024)} kB${p.resolution !== "full" ? " (from preview)" : ""}`)
}
