#!/usr/bin/env python3
"""Smoke-test a deck in headless Chrome: walks every slide and step, reports console/page errors and
slides whose content overflows the 1920x1080 stage, and optionally saves a screenshot per slide.

  python3 tools/smoke-test.py decks/adlc-part1 [--shots /tmp/shots] [--chrome /usr/bin/google-chrome]

Needs: pip install playwright (and a Chrome/Chromium; Playwright's own browser works if installed).
Exit code 0 = clean, 1 = problems found."""
import argparse, asyncio, pathlib, sys
from playwright.async_api import async_playwright

async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("deck")
    ap.add_argument("--shots")
    ap.add_argument("--chrome")
    ap.add_argument("--settle", type=int, default=900, help="ms to wait after each navigation")
    a = ap.parse_args()
    url = (pathlib.Path(a.deck).resolve() / "index.html").as_uri()
    problems = []
    async with async_playwright() as p:
        kw = {"executable_path": a.chrome} if a.chrome else {}
        b = await p.chromium.launch(args=["--no-sandbox"], **kw)
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        pg.on("pageerror", lambda e: problems.append(f"page error: {e}"))
        pg.on("console", lambda m: m.type in ("error", "warning") and problems.append(f"console {m.type}: {m.text}"))
        await pg.goto(url)
        await pg.wait_for_function("document.body.classList.contains('deck-ready')")
        n = await pg.evaluate("Deck.slides.length")
        print(f"{url}\n{n} slides")
        if a.shots:
            pathlib.Path(a.shots).mkdir(parents=True, exist_ok=True)
        for i in range(n):
            await pg.evaluate(f"Deck.go({i}, 0)")
            await pg.wait_for_timeout(a.settle)
            info = await pg.evaluate("""() => { const i = Deck.state.index, el = Deck.slideEl(i), s = Deck.slides[i];
              return { id: el.dataset.id, title: s.title, steps: Deck.stepCount(i), over: el.scrollHeight - el.clientHeight, overX: el.scrollWidth - el.clientWidth } }""")
            for st in range(info["steps"]):
                await pg.keyboard.press("ArrowRight")
                await pg.wait_for_timeout(350)
            flag = ""
            if info["over"] > 2 or info["overX"] > 2:
                flag = f"  OVERFLOW y={info['over']} x={info['overX']}"
                problems.append(f"slide {i + 1} ({info['id']}) content overflows the slide{flag}")
            print(f"{i + 1:>3} {info['id']:<24} steps={info['steps']}{flag}")
            if a.shots:
                await pg.screenshot(path=str(pathlib.Path(a.shots) / f"{i + 1:02d}-{info['id']}.png"))
        await b.close()
    print("\nPROBLEMS:" if problems else "\nclean")
    for x in problems:
        print(" -", x)
    sys.exit(1 if problems else 0)

asyncio.run(main())
