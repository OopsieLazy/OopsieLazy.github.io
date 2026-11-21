"""Browse Art builder (R4, D42): turns the photos in assets/images/art/ into data/art.json.

Why this exists: GitHub Pages is a plain file server. A web page can't ask it "which files
are in this folder?", so the list of pieces has to be written down somewhere. This script
writes it for you, so adding art is:

    1. Drop photos into assets/images/art/
       Name them like  journal-3-page-5.jpg  or  harbour-2025.jpg
       (a name starting with "journal" goes on the Art journals wall, anything else on Photography;
        a 4-digit year in the name becomes the label's year)
    2. Run:  python tools/art.py        (needs Pillow once:  pip install Pillow)
    3. Open data/art.json and fix each new piece's title, detail and alt text
    4. Commit the photos and art.json together

What it does to each photo (and why):
  - Strips EXIF metadata: phone photos carry the GPS position where they were taken,
    plus the phone model and time. The repo is public, so that would publish your location.
    The XMP block (editing notes, camera, time) goes too.
  - KEEPS the colour profile (ICC). It isn't personal: it tells the browser which colour space the
    numbers are in. Phones and editors often save Display P3; without the profile a browser reads
    P3 numbers as plain sRGB and the photo looks duller and shifted (found 2026-11-20).
  - Turns the picture upright first (phones often store "rotate me" in EXIF instead).
  - Shrinks anything over MAX_SIDE pixels: a 12-megapixel photo is ~4 MB, far too heavy for a web page.
  - Records its width and height, so the page can reserve the space before it loads (no jumping).

It never touches a title, detail or alt text you've written. Entries whose file is gone are dropped,
and the placeholders are dropped as soon as one real piece exists.
Run with --dry-run to see what would change without writing anything.

Other photos (About, CAD): `python tools/art.py --clean assets/images/about` strips and shrinks
every photo in that folder the same way, and prints the width/height to paste into the HTML.
"""

import json
import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is missing. Install it once with:  pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent      # the repo folder (tools/ is one level down)
ART_DIR = ROOT / "assets" / "images" / "art"
DATA = ROOT / "data" / "art.json"
MAX_SIDE = 2000                                    # longest side in pixels after shrinking
JPEG_QUALITY = 85                                  # good quality, much smaller files
IMAGE_TYPES = {".jpg", ".jpeg", ".png", ".webp"}


def kebab(name):
    """'Harbour 2025 (1).JPG' -> 'harbour-2025-1': the repo's lowercase-kebab-case file rule."""
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def guess_label(stem):
    """'journal-3-page-5' -> ('Journal 3 page 5', None); 'harbour-2025' -> ('Harbour', 2025)."""
    year_match = re.search(r"(?:^|-)((?:19|20)\d\d)(?:-|$)", stem)
    year = int(year_match.group(1)) if year_match else None
    words = re.sub(r"(?:^|-)(?:19|20)\d\d(?=-|$)", "", stem).replace("-", " ").strip()
    return (words[:1].upper() + words[1:]) or stem, year


def clean_photo(path, dry_run):
    """Strip metadata, turn upright, shrink. Returns (final path, width, height)."""
    target = path.with_name(kebab(path.stem) + path.suffix.lower().replace(".jpeg", ".jpg"))
    with Image.open(path) as image:
        had_metadata = bool(image.info.get("exif")) or bool(image.getexif())
        colour_profile = image.info.get("icc_profile")  # read it now, from the original file
        upright = ImageOps.exif_transpose(image)       # apply the EXIF rotation to the pixels
        too_big = max(upright.size) > MAX_SIDE
        if too_big:
            upright.thumbnail((MAX_SIDE, MAX_SIDE))    # keeps the shape, only ever shrinks
        width, height = upright.size
    # Saved AFTER the `with` closes the original file: Windows won't overwrite a file that's still open.
    # (exif_transpose returned a separate, fully loaded copy, so the pixels are still here)
    if dry_run or not (had_metadata or too_big or target != path):
        return target, width, height
    # Saving a NEW image writes only what we pass: no exif= means no EXIF, no xmp= means no XMP.
    # icc_profile= puts back the one thing we want kept (None for photos that had none)
    if target.suffix == ".jpg":
        # A profile only fits the pixels it describes. convert("RGB") changes CMYK (some scanners)
        # or greyscale pixels into RGB, and their old profile would then be wrong: drop it for those
        rgb_profile = colour_profile if upright.mode in ("RGB", "RGBA") else None
        upright.convert("RGB").save(target, quality=JPEG_QUALITY, optimize=True, progressive=True,
                                    icc_profile=rgb_profile)
    else:
        upright.save(target, optimize=True, icc_profile=colour_profile)
    if target != path:
        path.unlink()                                  # the renamed copy replaces the original
    print(f"  cleaned  {target.name}  ({width} x {height}"
          f"{', metadata stripped' if had_metadata else ''}{', shrunk' if too_big else ''})")
    return target, width, height


def clean_folder(folder, dry_run):
    """--clean <folder>: the same strip/upright/shrink for photos that aren't art (About, CAD...).
    Writes no JSON; prints each size, because the HTML's width/height attributes need it."""
    folder = (ROOT / folder).resolve()
    if not folder.is_dir():
        sys.exit(f"No such folder: {folder}")
    for path in sorted(folder.iterdir()):
        if path.suffix.lower() in IMAGE_TYPES:
            final, width, height = clean_photo(path, dry_run)
            print(f"  {final.relative_to(ROOT).as_posix()}   width=\"{width}\" height=\"{height}\"")


def main():
    dry_run = "--dry-run" in sys.argv
    if "--clean" in sys.argv:
        args = sys.argv[sys.argv.index("--clean") + 1:]
        if not args or args[0].startswith("--"):
            sys.exit("Usage: python tools/art.py --clean assets/images/about")
        clean_folder(args[0], dry_run)
        return
    ART_DIR.mkdir(parents=True, exist_ok=True)
    pieces = json.loads(DATA.read_text(encoding="utf-8")) if DATA.exists() else []
    by_src = {piece["src"]: piece for piece in pieces}
    found = []

    for path in sorted(ART_DIR.iterdir()):
        if path.suffix.lower() not in IMAGE_TYPES:
            continue
        final, width, height = clean_photo(path, dry_run)
        src = final.relative_to(ROOT).as_posix()       # relative path with "/" (CLAUDE.md: relative links)
        found.append(src)
        if src in by_src:
            by_src[src].update(w=width, h=height)      # keep the owner's words, refresh only the size
            continue
        title, year = guess_label(final.stem)
        by_src[src] = {
            "id": final.stem, "kind": "journal" if final.stem.startswith("journal") else "photo",
            "src": src, "w": width, "h": height,
            "title": title, "detail": "", "year": year,
            "alt": f"TODO: describe {title}",          # alt text needs a human: what's IN the picture
        }
        print(f"  added    {src}  ->  \"{title}\"" + (f" ({year})" if year else ""))

    real_found = bool(found)
    kept = []
    for piece in by_src.values():
        if piece.get("placeholder"):
            if not real_found:
                kept.append(piece)                     # placeholders stay until real art exists
        elif piece["src"] in found or not piece["src"].startswith("assets/images/art/"):
            kept.append(piece)
        else:
            print(f"  dropped  {piece['src']}  (file is gone)")

    if dry_run:
        print(f"Dry run: {len(kept)} pieces would be listed. Nothing was written.")
        return
    # newline="\n": on Windows, Python would otherwise turn every \n into \r\n (CRLF), but the repo
    # stores LF (.gitattributes), so the file would look changed on every run
    DATA.write_text(json.dumps(kept, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
    todo = sum(1 for piece in kept if str(piece.get("alt", "")).startswith("TODO"))
    print(f"Wrote {DATA.relative_to(ROOT).as_posix()}: {len(kept)} pieces."
          + (f" {todo} still need a title check and alt text (search for TODO)." if todo else ""))


if __name__ == "__main__":
    main()
