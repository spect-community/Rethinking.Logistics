#!/usr/bin/env python3
"""Convert raw MS Teams transcripts (.docx or .vtt) to plain Markdown.

Input:  import/private/transcripts/raw/   (kept unchanged)
Output: import/private/transcripts/md/    one file per lecture, lines "[hh:mm:ss] Speaker: text"

The output file name is the `transcript_file_name` column of import/lectures.csv,
matched by the two-digit lecture number at the start of the raw file name.
Only the Python standard library is used. Safe to run again: output is rewritten.

Usage: python scripts/convert-transcripts.py
"""

import csv
import html
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "import" / "private" / "transcripts" / "raw"
OUT = ROOT / "import" / "private" / "transcripts" / "md"
LECTURES = ROOT / "import" / "lectures.csv"

TIME = re.compile(r"^(?:(\d+):)?(\d{1,2}):(\d{2})$")


def hhmmss(t: str) -> str:
    m = TIME.match(t.strip())
    if not m:
        return t.strip()
    h, mm, ss = m.group(1) or "0", m.group(2), m.group(3)
    return f"{int(h):02d}:{int(mm):02d}:{int(ss):02d}"


def docx_lines(path: Path):
    xml = zipfile.ZipFile(path).read("word/document.xml").decode("utf-8")
    xml = re.sub(r"<w:drawing>.*?</w:drawing>", "", xml, flags=re.S)
    speaker = "Unknown"
    for para in re.findall(r"<w:p[ >].*?</w:p>", xml, flags=re.S):
        # split the paragraph into segments at line breaks, keeping text runs
        tokens = re.findall(r"<w:t[^>]*>([^<]*)</w:t>|(<w:br/>)", para)
        segments, cur = [], []
        for text, br in tokens:
            if br:
                segments.append("".join(cur))
                cur = []
            else:
                cur.append(html.unescape(text))
        segments.append("".join(cur))
        segments = [s for s in segments if s.strip()]
        if len(segments) < 2:
            continue
        head = segments[0].strip()
        m = re.match(r"^(.*?)\s*((?:\d+:)?\d{1,2}:\d{2})$", head)
        if not m:
            continue
        if m.group(1).strip():
            speaker = m.group(1).strip()
        text = " ".join(s.strip() for s in segments[1:])
        yield hhmmss(m.group(2)), speaker, text


def vtt_lines(path: Path):
    block = []
    for line in path.read_text(encoding="utf-8-sig").splitlines() + [""]:
        if line.strip():
            block.append(line)
            continue
        if block and "-->" in "".join(block):
            i = next(k for k, l in enumerate(block) if "-->" in l)
            start = block[i].split("-->")[0].strip().split(".")[0]
            body = " ".join(block[i + 1 :])
            m = re.match(r"<v ([^>]+)>(.*?)(?:</v>)?$", body)
            speaker, text = (m.group(1), m.group(2)) if m else ("Unknown", body)
            yield hhmmss(start), speaker.strip(), re.sub(r"<[^>]+>", "", text).strip()
        block = []


def main() -> int:
    names = {}
    with open(LECTURES, encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            names[row["lecture_id"].zfill(2)] = row["transcript_file_name"].strip()
    OUT.mkdir(parents=True, exist_ok=True)
    done = set()
    for path in sorted(RAW.iterdir()):
        if path.suffix.lower() not in (".docx", ".vtt"):
            continue
        num = re.match(r"\s*(\d{1,2})", path.name)
        if not num or num.group(1).zfill(2) not in names:
            print(f"skipped (no lecture number): {path.name}")
            continue
        lid = num.group(1).zfill(2)
        lines = list(docx_lines(path) if path.suffix.lower() == ".docx" else vtt_lines(path))
        target = OUT / names[lid]
        target.write_text(
            f"<!-- converted from {path.name} -->\n\n" + "\n".join(f"[{t}] {s}: {x}" for t, s, x in lines) + "\n",
            encoding="utf-8",
        )
        done.add(lid)
        print(f"{lid}: {len(lines):5d} lines -> {target.name}")
    missing = sorted(set(names) - done)
    if missing:
        print("no raw transcript for lecture(s): " + ", ".join(missing))
    return 0


if __name__ == "__main__":
    sys.exit(main())
