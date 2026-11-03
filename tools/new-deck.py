#!/usr/bin/env python3
"""Create a new deck from decks/_template.

  python3 tools/new-deck.py my-deck --title "My deck" [--prefix md] [--minutes 45] [--no-landing] [--description "…"]

Copies decks/_template to decks/<slug>, replaces {{TITLE}} / {{MINUTES}} and the tpl- class prefix, drops TEMPLATE.md,
and adds a card for the deck to the root index.html. Prints the next steps."""
import argparse, html, pathlib, re, shutil, sys

root = pathlib.Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument("slug", help="folder name under decks/, lowercase letters, digits and dashes")
ap.add_argument("--title", help="deck title (default: the slug, capitalised)")
ap.add_argument("--prefix", help="CSS class prefix (default: initials of the slug)")
ap.add_argument("--minutes", type=int, default=45)
ap.add_argument("--description", default="Work in progress.")
ap.add_argument("--no-landing", action="store_true", help="do not add a card to the root index.html")
a = ap.parse_args()

if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", a.slug) or a.slug.startswith("_"):
    sys.exit("slug must be lowercase letters, digits and single dashes, e.g. adlc-part2")
src, dst = root / "decks" / "_template", root / "decks" / a.slug
if dst.exists():
    sys.exit(f"decks/{a.slug} already exists")
title = a.title or a.slug.replace("-", " ").capitalize()
prefix = a.prefix or "".join(w[0] for w in a.slug.split("-")) or "d"
if not re.fullmatch(r"[a-z][a-z0-9]*", prefix):
    sys.exit("prefix must be lowercase letters/digits, starting with a letter")

shutil.copytree(src, dst)
(dst / "TEMPLATE.md").unlink()
js_title = title.replace("\\", "\\\\").replace('"', '\\"')          # inside a "…" JavaScript string
h_title = html.escape(title, quote=False).replace("`", "&#96;").replace("${", "&#36;{")   # inside HTML (also inside a JS template)
for f in dst.rglob("*"):
    if f.suffix in (".html", ".js", ".css", ".md") and f.is_file():
        t = f.read_text()
        t = re.sub(r'(title: )"\{\{TITLE\}\}"', lambda m: m.group(1) + '"' + js_title + '"', t)   # JS string contexts
        t = t.replace("{{TITLE}}", title if f.suffix == ".md" else h_title)                       # everything else is HTML text
        t = t.replace("tpl-", prefix + "-")
        if f.name == "index.html":
            t = re.sub(r"timer: \{ minutes: \d+ \}", f"timer: {{ minutes: {a.minutes} }}", t)
        f.write_text(t)

if not a.no_landing:
    land = root / "index.html"
    card = f'    <a class="card" href="decks/{a.slug}/"><b>{html.escape(title)}</b><span>{html.escape(a.description)}</span></a>\n'
    t = land.read_text()
    land.write_text(t.replace("  </main>", card + "  </main>", 1))

print(f"Created decks/{a.slug}  (title: {title!r}, class prefix: {prefix}-, timer: {a.minutes} min)")
print("""Next:
  1. Fill decks/%(s)s/BRIEF.md (audience, goal, outline) — with the author.
  2. Turn the outline into slides: edit/duplicate/delete decks/%(s)s/slides/*.js and keep the <script> list in index.html in order.
  3. Set sections + logo in decks/%(s)s/index.html.
  4. python3 tools/smoke-test.py decks/%(s)s --shots /tmp/shots
  5. Remove TODOs/placeholders:  grep -rn "TODO\\|s-placeholder" decks/%(s)s""" % {"s": a.slug})
