#!/usr/bin/env python3
"""Pull blog HTML + images from ishwar.dev into blog-content.jsx."""

import html
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMG_DIR = ROOT / "assets" / "images" / "blog"
IMG_DIR.mkdir(parents=True, exist_ok=True)

SLUG_TO_FILE = {
    "lets-be-more-agentic-shall-we": "agentic.md",
    "introducing-vx-engine": "vx-engine.md",
    "indias-tech-gap-a-reality-check-on-where-we-actually-stand-against-usa-and-china-%f0%9f%87%ae%f0%9f%87%b3-vs-%f0%9f%87%ba%f0%9f%87%b8-vs-%f0%9f%87%a8%f0%9f%87%b3": "tech-gap.md",
    "we-code-to-get-things-done": "learn-to-code.md",
    "from-network-tab-to-mcp-4-step-playbook": "mcp-playbook.md",
    "setting-up-my-terminal-%f0%9f%96%a5%ef%b8%8f%e2%9a%a1": "terminal.md",
    "why-dont-they-teach-software-engineering-like-this-in-college": "college-se.md",
}

downloaded: dict[str, str] = {}


def local_image(url: str) -> str:
    url = html.unescape(url.split("?")[0])
    if url in downloaded:
        return downloaded[url]
    if not url.startswith("https://ishwar.dev/wp-content/uploads/"):
        return url
    name = re.sub(r"[^a-zA-Z0-9._-]", "-", url.rsplit("/", 1)[-1])
    dest = IMG_DIR / name
    if not dest.exists():
        urllib.request.urlretrieve(url, dest)
        print(f"downloaded {name}")
    rel = f"assets/images/blog/{name}"
    downloaded[url] = rel
    return rel


def rewrite_content(content: str) -> str:
    content = html.unescape(content)

    def repl_src(m: re.Match[str]) -> str:
        return f'src="{local_image(m.group(1))}"'

    content = re.sub(
        r'src="(https://ishwar\.dev/wp-content/uploads/[^"]+)"', repl_src, content
    )
    content = re.sub(r'\sclass="[^"]*"', "", content)
    content = re.sub(r'\sstyle="[^"]*"', "", content)
    content = re.sub(r'srcset="[^"]*"', "", content)
    content = re.sub(r"<figure[^>]*>", "<figure>", content)
    return content.strip()


def main() -> None:
    req = urllib.request.Request(
        "https://ishwar.dev/wp-json/wp/v2/posts?per_page=100",
        headers={"User-Agent": "Mozilla/5.0"},
    )
    with urllib.request.urlopen(req) as r:
        posts = json.load(r)

    blog_entries: dict[str, str] = {}
    for p in posts:
        f = SLUG_TO_FILE.get(p["slug"])
        if not f:
            continue
        blog_entries[f] = rewrite_content(p["content"]["rendered"])

    out = ROOT / "blog-content.jsx"
    lines = [
        "// Auto-generated blog HTML from ishwar.dev — run scripts/import-blogs.py to refresh",
        "",
        "const BLOG_CONTENT = {",
    ]
    for f, c in blog_entries.items():
        esc = c.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
        lines.append(f'  "{f}": `{esc}`,')
    lines.extend(["};", "", "Object.assign(window, { BLOG_CONTENT });"])
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {out} ({len(blog_entries)} posts)")


if __name__ == "__main__":
    main()
