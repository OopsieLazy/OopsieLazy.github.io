# MyWeb: Personal Portfolio

A portfolio for CAD, code, art, and film work. It is planned around a pixel-art Renaissance museum you can walk through.
Plain HTML, CSS, and JavaScript, with no framework and no build step.

## Run it locally

From the project folder:

```
python -m http.server 8000
```

Then open http://localhost:8000/.
Use a local server rather than double-clicking the file, because JS modules (Phase 3) only load over `http://`.

## Project layout

| File | Purpose |
|---|---|
| `css/styles.css` | Shared header, footer, design tokens and base styles |
| `css/cardyles.css` | The Blueprint trading card (About's profile card). Wrap each card in a `.card-holder` |
| `art.html` + `css/artyles.css` + `js/artcript.js` | Browse Art as a masonry grid (D49): bare, uncropped photos in three packed columns with a caption under each (R4e), photography split into areas (`"area"` in the JSON), built from `data/art.json`; visitors drag photos (or Alt + arrow keys) to reorder, Shuffle and Reset |
| `tools/art.py` | Run on your computer, not the site: lists the photos in `assets/images/art/` in `data/art.json` and strips their location data (see Add art) |
| `code.html` + `css/codyles.css` + `js/codcript.js` | Code Portfolio: every project a library catalog card, built from `data/code.json` (add one entry to add a project; `"featured": true` puts it in the top row, `"handWritten": true` stamps it, `"source": null` marks a private repo). All the page's sizes are tokens at the top of `codyles.css` |
| `contact.html` + `css/contyles.css` + `js/contcript.js` | Contact & Résumé as a drawing title block: email with a Copy button, résumé PDF download |
| `aboutme.html` + `css/aboutyles.css` | About page, laid out like an encyclopedia biography (fill in the `<!-- CONTENT -->` slots) |
| `index.html` + `css/homyles.css` + `js/homcript.js` | Home page: a masonry mosaic of CAD projects and photos, mixed; titles fade in on hover or focus (Home's `<main>` is wider: 80rem) |
| `data/projects.json` | Every project, written once. The home catalog and the CAD page entries are built from it |
| `js/datacript.js` | Shared helpers that load the JSON and build elements safely (home and CAD page) |
| `projects.html` + `css/projyles.css` + `js/projcript.js` + `js/sectcript.js` | CAD portfolio: the 3D carousel and side popup, then one entry per project (`projects.html#<id>`) |
| `assets/images/` | All images |
| `thelab.html` | Laboratory experiment (notebook-on-desk design) |
| `PLAN.md` | Roadmap, task breakdown, architecture decisions |
| `TODO.md` | One-screen action list, rebuilt from PLAN.md by the `todo-list` skill (`.claude/skills/`) |
| `REFERENCES.md` | Design reference notes (dazprojects, SPELUNKR): what we take and what we don't |
| `CLAUDE.md` | Instructions for the AI assistant |

## Add a project

Add one object to `data/projects.json`: the home catalog builds its tile and the CAD page builds its entry:

- `id`: lowercase-kebab-case, unique. It's the link anchor, `projects.html#bridge-guitar`; a bad or clashing id still shows the entry but gets no link (the console says why)
- `name`, `image` (path in `assets/images/`), `alt`, `type` (e.g. `"Part · 3D print"`), `year`
- `featured`: `true` marks a highlight (the Home card stack used it until O4; kept for later)
- Optional: `tool`, `description`, `flavor`, `stats` (`iterations`, `parts`, `printHours`, `difficulty` 1–5)
- Optional: `writeup`, the longer story on the CAD page, as a list of paragraphs: `"writeup": ["First paragraph.", "Second paragraph."]`
- Optional: `images`, the pictures in the CAD page's gallery (D33). Each one is `{ "src", "alt", "kind", "caption" }`, where `kind` is `"cad"` or `"photo"` (it sets the tag in the corner). The first one shows first; thumbnails appear once there are two or more. `image` stays the single cover used on Home and the cards. New photos go in a folder per project: `assets/images/<id>/`.
- Picture sizes: the frames are 4:3 (Home rows) and square (Home grid, CAD page, thumbnails), and pictures fill them with `object-fit: cover`, which crops evenly and never stretches. So export every render and photo **square, 1600 × 1600 px**, with the part centred inside the middle 75% (a 4:3 crop trims 12.5% off the top and bottom). Renders as PNG, ideally with a transparent background; photos as JPEG at about 80% quality, with location data stripped.

JSON is strict: double quotes only, a comma between items but **not after the last one**, and no comments. If the catalog goes blank, the browser console (F12) says why.

## Add art

1. Put the photos in `assets/images/art/`. Name them like `journal-3-page-5.jpg` or `harbour-2025.jpg`: a name starting with `journal` goes on the Art journals wall, anything else on Photography, and a 4-digit year becomes the label's year.
2. Run `python tools/art.py` (once before: `pip install Pillow`). It strips EXIF/GPS (phone photos carry the place they were taken), turns photos upright, shrinks anything over 2000 px, renames files to lowercase-kebab-case and adds each new photo to `data/art.json`. `--dry-run` shows what it would do.
3. In `data/art.json`, fix each new piece's `title`, `detail` (e.g. `"page 5"`) and `alt` (search for `TODO`: alt text describes what's in the picture). Each photo shows whole, in its own shape: nothing is cropped.
   Optional `"area": "Nature"` (or Architecture, Portraits, any name) puts a photo under that area's heading on the Photography wall. Areas appear in the order they first occur in the file, each with its own grid; from two areas up, a jump list links to each. Photos without an area share one grid with no heading.
4. Commit the photos and `art.json` together. The placeholders disappear as soon as one real piece exists.

The order in `art.json` is the order on the page, until a visitor drags photos around (remembered on their device only; Reset brings yours back).

## Add About photos

1. Put the photos in `assets/images/about/` (the hero is shown wide, about 21:9; the row photos at 4:3).
2. Run `python tools/art.py --clean assets/images/about`. It strips EXIF/GPS, turns them upright, shrinks and renames them like the art photos, and prints each file's `width="…" height="…"`.
3. In `aboutme.html`, replace each `assets/images/placeholder.svg` with your file, paste its width and height, and write the `alt` text (the `CONTENT` comments say which photo goes where).

## Contact sheet files

The contact page's title block exists twice as a file in `assets/docs/`, and **both must be made again after changing any text on `contact.html`**:

- `contact-sheet.png`: a picture of the card exactly as it looks on screen (Day theme, 2× sharp). Dragging the card onto the desktop (Chrome and Edge) saves this one, because a picture shows a thumbnail there (D30).
- `contact-sheet.pdf`: the card printed, with clickable links. The keyboard "Save" link gives this one.

**The PNG**, with DevTools:
1. Serve the site (`python -m http.server 8000`), open `contact.html` and set the lantern to **Day**.
2. Press F12, then Ctrl+Shift+M (device toolbar). Choose *Responsive*, width **1280**, and set **DPR** to **2** (in the toolbar's ⋮ menu, "Add device pixel ratio" if it's hidden).
3. In the Elements panel, right-click `<article … id="contact-sheet">` → **Capture node screenshot**.
4. Save it over `assets/docs/contact-sheet.png`.

**The PDF**, in Git Bash from the repo root (`pwd -W` gives Edge a full Windows path; a relative one can fail):

```
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --no-pdf-header-footer --print-to-pdf="$(pwd -W)/assets/docs/contact-sheet.pdf" http://localhost:8000/contact.html
```

Or open the page, press Ctrl+P and choose "Save as PDF": the print stylesheet gives the same single sheet. Both files show your email as plain text: bots that read files can pick it up from the PDF more easily than from the page.

## How this project is built

I'm learning web development by building this site, working with Claude Code as both instructor and pair programmer.

Each task follows the same cycle:
plan → build (by Claude or by me) → review → commit.
As on a professional team, work happens on feature branches and reaches `main` only through a reviewed pull request.

- `PLAN.md`: the roadmap, task breakdown, and why each architecture decision was made.
- `TODO.md`: what to do next and who does it. Don't edit it by hand: change PLAN.md, then ask Claude to "rebuild the to-do list".
- `CLAUDE.md`: the rules the AI follows in this project (teach as it goes, small tasks, I make all commits).

## License

- **Code** (HTML, CSS, JavaScript, config): [MIT](LICENSE). Feel free to learn from it and reuse it.
- **Content**: everything in `assets/` (CAD renders, artwork, photography, video) and the site's written text (bio, project descriptions) is © 2026 OopsieLazy, **all rights reserved**. Please don't reuse it without permission.
- **Fonts** in `assets/fonts/` (Cinzel, Instrument Sans, JetBrains Mono, Silkscreen) belong to their authors and are used under the [SIL Open Font License 1.1](https://openfontlicense.org). Each font's license is next to it.
