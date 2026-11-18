"""Record the HTML workflows into the static site's root.

From the worktree, with ffmpeg on PATH:
    python3 -m venv tools/.venv
    tools/.venv/bin/pip install playwright==1.65.2
    tools/.venv/bin/python -m playwright install chromium --only-shell
    tools/.venv/bin/python tools/video-src/record.py

Pass one or more scene slugs to regenerate a subset. Open scene.html?scene=files
in a browser to watch the animated source at its native dimensions.
"""

import argparse
import asyncio
from base64 import b64decode
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.parse import urlencode

from playwright.async_api import async_playwright


SOURCE = Path(__file__).resolve().parent
SITE = SOURCE.parent.parent
FPS = 30
SECONDS = 5
VIEWPORT = {"width": 1280, "height": 800}
SCENES = (
    "files", "borrowing-base", "ineligible", "template", "sign-off",
    "amended-clause", "agreements", "deadlines", "copilot",
)


async def encode(page, video):
    client = await page.context.new_cdp_session(page)
    encoder = await asyncio.create_subprocess_exec(
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "png", "-i", "-",
        "-an", "-c:v", "libx264", "-threads", "2", "-preset", "slow",
        "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        str(video), stdin=asyncio.subprocess.PIPE,
    )
    try:
        for frame in range(FPS * SECONDS):
            await page.evaluate("t => window.renderFrame(t)", frame / FPS)
            shot = await client.send("Page.captureScreenshot", {"format": "png", "optimizeForSpeed": True})
            encoder.stdin.write(b64decode(shot["data"]))
            await encoder.stdin.drain()
    finally:
        encoder.stdin.close()
        await encoder.wait()
    if encoder.returncode:
        raise RuntimeError(f"ffmpeg failed encoding {video.name}")


async def record(browser, slug, limit):
    async with limit:
        page = await browser.new_page(viewport=VIEWPORT, device_scale_factor=1)
        try:
            query = urlencode({"scene": slug, "capture": 1})
            await page.goto(f"{(SOURCE / 'scene.html').as_uri()}?{query}")
            await page.evaluate("document.fonts.ready")
            with TemporaryDirectory(dir=SITE, prefix=".record-") as temporary:
                video = Path(temporary) / f"feat-{slug}.mp4"
                poster = video.with_suffix(".jpg")
                await encode(page, video)
                snapshot = await asyncio.create_subprocess_exec(
                    "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                    "-ss", "3.4", "-i", str(video), "-frames:v", "1",
                    "-q:v", "2", str(poster),
                )
                if await snapshot.wait():
                    raise RuntimeError(f"ffmpeg failed extracting {poster.name}")
                print(f"{video.name}  {video.stat().st_size:,} bytes", flush=True)
                video.replace(SITE / video.name)
                poster.replace(SITE / poster.name)
        finally:
            await page.close()


async def main(slugs):
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        try:
            limit = asyncio.Semaphore(3)
            await asyncio.gather(*(record(browser, slug, limit) for slug in slugs))
        finally:
            await browser.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("slugs", nargs="*", metavar="SCENE")
    args = parser.parse_args()
    unknown = set(args.slugs) - set(SCENES)
    if unknown:
        parser.error("Unknown scene(s): " + ", ".join(sorted(unknown)))
    asyncio.run(main(list(dict.fromkeys(args.slugs)) or SCENES))
