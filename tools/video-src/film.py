"""Build the homepage film and its poster with the dependencies from record.py.

    tools/.venv/bin/python tools/video-src/film.py

To preview the source, serve the repository root and open tools/video-src/film.html
at a 1536x864 CSS viewport. Capture paints that layout at 1.25 device pixels per
CSS pixel, so Chromium draws the type, rules and pointer directly at 1920x1080.
"""

import subprocess
from struct import unpack
from pathlib import Path
from tempfile import TemporaryDirectory

from playwright.sync_api import sync_playwright

SOURCE = Path(__file__).resolve().parent
SITE = SOURCE.parent.parent
FFMPEG = ["ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error", "-y"]


def build(directory):
    video = directory / "lumient-film.mp4"
    poster = directory / "lumient-film-poster.jpg"
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(args=["--allow-file-access-from-files"])
        page = browser.new_page(viewport={"width": 1536, "height": 864}, device_scale_factor=1.25)
        page.goto(f"{(SOURCE / 'film.html').as_uri()}?capture")
        page.evaluate("window.filmReady")
        frames, fps, poster_frame = page.evaluate("[frameCount, fps, posterFrame]")
        with subprocess.Popen([
            *FFMPEG, "-f", "image2pipe", "-framerate", str(fps), "-c:v", "png", "-i", "-",
            "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p",
            "-movflags", "+faststart", str(video),
        ], stdin=subprocess.PIPE) as encoder:
            for frame in range(frames):
                page.evaluate("frame => drawFrame(frame)", frame)
                shot = page.screenshot(type="png", scale="device")
                if frame == 0 and unpack(">II", shot[16:24]) != (1920, 1080):
                    raise RuntimeError("Expected a 1920x1080 device-pixel capture")
                encoder.stdin.write(shot)
            encoder.stdin.close()
            if encoder.wait():
                raise RuntimeError("Film encoding failed")
        browser.close()
    subprocess.run([
        *FFMPEG, "-ss", str(poster_frame / fps), "-i", str(video), "-frames:v", "1",
        "-q:v", "2", str(poster),
    ], check=True)
    for asset in (video, poster):
        print(f"{asset.name}  {asset.stat().st_size:,} bytes")
        asset.replace(SITE / asset.name)


if __name__ == "__main__":
    with TemporaryDirectory(dir=SITE, prefix=".film-") as temporary:
        build(Path(temporary))
