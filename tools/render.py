"""Centre CAD renders on a square, all at the same size (owner, 2026-11-27: "object should be
centered, goes for all images"). Runs on your computer, never on the site. Needs Pillow
(pip install Pillow), like tools/art.py.

    python tools/render.py assets/images/parametric-funnel/funnel-render.png
    python tools/render.py assets/images/*.png          (several at once)

For each render it:
  1. finds the part: every pixel that differs clearly from the background colour (read from the
     four corners). Soft ground shadows are lighter than that, so they don't pull the centre off
  2. puts the part in the middle of a square, its longer side 70% of the square, so every project
     looks the same size and the 4:3 crops on Home never cut it (README, "Add a project")
  3. fills the rest with the same background colour, so white renders stay white, grey stay grey
  4. never enlarges: a small render gets a smaller square instead of a blurry big one
  5. writes a 512 px copy next to it (<name>-small.png) for the carousel and the project list.
     A 1600 px picture shrunk to a 200 px sheet while it spins looks jagged ("pixelly") on thin
     parts like the funnel's spout; a copy already near the size it's shown at stays smooth

The render is overwritten (git keeps the old one). It prints the two lines for data/projects.json.
"""
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is missing: pip install Pillow")

FILL = 0.70        # the part's longer side, as a share of the square
MAX_SIDE = 1600    # the square never gets bigger than this (README: renders are 1600 x 1600)
SMALL_SIDE = 512   # the carousel copy: about twice the biggest sheet, so it's sharp on phones too
THRESHOLD = 60     # how different from the background a pixel must be to count as the part (0-255)


def background(image):
    """The median of the four corner pixels: the backdrop colour."""
    w, h = image.size
    corners = [image.getpixel(p) for p in ((2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3))]
    return tuple(sorted(c[i] for c in corners)[1] for i in range(3))  # middle-ish value per channel


def part_box(image, bg):
    """The smallest box around every pixel that differs from the background by more than THRESHOLD."""
    # For each pixel: the biggest difference over R, G and B. point() turns it into black/white,
    # and getbbox() finds the white area: no numpy needed
    channels = [band.point(lambda v, b=b: 255 if abs(v - b) > THRESHOLD else 0)
                for band, b in zip(image.split(), bg)]
    mask = channels[0]
    for other in channels[1:]:
        mask = Image.composite(mask, other, mask)   # white where any channel is white
    return mask.getbbox()


def centre(path):
    image = Image.open(path).convert("RGB")
    bg = background(image)
    box = part_box(image, bg)
    if not box:
        print(f"  skipped  {path}: no part found (is the background one plain colour?)")
        return
    left, top, right, bottom = box
    part_w, part_h = right - left, bottom - top
    # The square: big enough that the part's longer side is FILL of it, at most MAX_SIDE, and never
    # so big that the part would have to be enlarged
    side = min(MAX_SIDE, round(max(part_w, part_h) / FILL))
    scale = min(1.0, side * FILL / max(part_w, part_h))
    if scale < 1:
        image = image.resize((round(image.width * scale), round(image.height * scale)), Image.LANCZOS)
        left, top, part_w, part_h = (round(v * scale) for v in (left, top, part_w, part_h))
    square = Image.new("RGB", (side, side), bg)
    # Paste the WHOLE render (shadow included) so the part's middle lands on the square's middle
    square.paste(image, (side // 2 - (left + part_w // 2), side // 2 - (top + part_h // 2)))
    square.save(path, optimize=True)

    small = square.resize((SMALL_SIDE, SMALL_SIDE), Image.LANCZOS) if side > SMALL_SIDE else square
    small_path = path.with_name(path.stem + "-small" + path.suffix)
    small.save(small_path, optimize=True)
    print(f"  centred  {path.as_posix()}  ({side} x {side}, background {bg})")
    print(f'    "image": "{path.as_posix()}",  "thumb": "{small_path.as_posix()}",')


def main():
    files = [Path(arg) for arg in sys.argv[1:] if not arg.startswith("-")]
    if not files:
        sys.exit("Usage: python tools/render.py assets/images/<id>/<render>.png")
    for path in files:
        if path.stem.endswith("-small"):
            continue                                # never re-process a carousel copy
        centre(path)


if __name__ == "__main__":
    main()
