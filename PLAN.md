# PLAN.md

Roadmap, task breakdown, and architecture decisions for the portfolio site.
Rule: each task should be small enough to review in one sitting and gets its own commit.
Each feature (1–3 tasks) is a branch plus a pull request into `main` (GitHub flow; see CLAUDE.md).
Keep this file under ~300 lines. When a phase is done, collapse it to a one-line summary.

Status key: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Vision

A minimalist, sleek portfolio that works on phones, desktops, and resized windows.
Its signature feature is a pixel-art **Renaissance museum** (Leonardo / Michelangelo style) that you walk through to reach each section.
The museum is an *extra layer*: every page can also be reached through normal nav links. This keeps the site usable by recruiters, screen readers, and search engines.
**Now:** a clean, working skeleton that's decent to hand out and easy to drop content into. The owner gathers the content separately; the look will change a lot once the museum arrives.
**Design identity** (the test for new ideas): a retro curiosity cabinet. Vintage Japanese colors, 70s stripes, pixel-art scientific objects (the orrery, the Da Vinci clock), and a museum to walk through.

## Site map

| Page | File (planned) | Phase |
|---|---|---|
| Home / museum entrance | `index.html` | 0, 4 |
| CAD Portfolio | `projects.html` | 1–3 |
| Code Portfolio | `code.html` | 2 |
| Browse Art (art journals + photography) | `art.html` | 2 |
| Filmography (replaces "Project Finder") | `film.html` | Later |
| About Me | `aboutme.html` | 2 |
| Contact & Résumé (info page) | `contact.html` | 2 |
| Contact form | inside `contact.html` | Later |
| The Laboratory | `thelab.html` (experiment for now) | Later |

---

## Roadmap at a glance (rebuilt 2026-11-07, D27)

The order we follow. Each step finishes before the next starts; only the drum's sprite art runs alongside.

| Step | Phase | What it gets you | Status |
|---|---|---|---|
| 1 | 0–1: Foundation, responsive shell | Clean repo, tokens, header, themes, carousel on phones | ✅ |
| 2 | 2: Content-ready templates | Every page exists, with its layout and `CONTENT` slots | ✅ |
| 3 | R: Refinement | Each page, from Home down, made to look like the finished portfolio; every leftover finished, filled or removed | frozen: owner content + X8 only |
| 4 | **L: Launch** | Live on GitHub Pages, ready to send to recruiters | ▶ now (2026-11-20) |
| 5 | 3: Project displays | Film strip, spin reel, grid, display switcher | after launch |
| 6 | 4: The museum | The walk-through signature feature | after launch |
| ∥ | Theme drum (1.14b–e) | Built 2026-11-08 (D35); replaced by a round Auto / Day / Night button in O1 (D51) | replaced |

**Launch freeze (owner, 2026-11-20, D47):** nothing new gets built until launch. Allowed: the Phase L tasks, X8 (one button class), R4e (the Art redesign, added by the owner on 2026-11-20, D48), bug fixes, and the owner's content. Everything else goes into Experiments, undated. Each PR stays at about 5 files or fewer (L1 touches all six pages for a line each, the one exception).

**Guardrail:** Phase R refines what exists; it doesn't add features. New ideas go into Experiments, undated. A Phase 3 or 4 item moves forward only when a page can't be finished without it (e.g. 3.10 for the CAD page) and the owner says so.

**Where does a note go?** Ask "which page is it about?"
- A page **not yet refined** → that page's R task, for its audit.
- A page **already refined** → Phase R's *Polish* line, done in one pass before launch.
- A **new idea** → Experiments, undated.
Each change still goes **works → right** (layout, keyboard, phones) **→ nice** (motion, polish).

## ▶ Where we left off (update at the end of every session)

*Last session: 2026-11-25*
- **Branch:** `feat/code-cards-polish` (uncommitted): O7a2 card fixes + bar B, the "No AI-made tells" list in CLAUDE.md. Dice rolls are paused at the owner's request (2026-11-10) until they say to roll.
- **O8 built + O8 v2** on `feat/code-cards-polish` (uncommitted): the full-screen forge workshop (header and title inside the frame, perspective side walls, outlines that hug each object), the parchment scroll in place of the flip cards, and the every-project table. Mocks: [wireframe](https://claude.ai/artifact/3RKeR2ZnZ7eZ3ARUJxtx2W), [scenes](https://claude.ai/artifact/Kj8djjEN1qZng1SK5Lz3Zx). Research (git-ignored): `references/reports/Pixel workshop scenes for Code page.md`, `references/reports/Free pixel sprites for workshop.md`.
- **Merged:** #45 O7a retro flip cards. #44 featured-cards drawer, CAD index, home order, pine footer (O4b, O4c, O2b; D52, D53). #43 header overhaul (O1, O2, O4). #42 lightbox + declutter (D50).
- **Git lesson (2026-11-24):** deleting a branch before its PR merged only deletes the pointer. The commits came back from the reflog with `git switch -c <branch> <sha>`.
- **Research:** `references/reports/Retro web design for Code page.md` (git-ignored): borrow early-web density, keep retro to one module; the technical instrument-panel look (2Advanced, Conspiracy, Theory7) suits the site.
- **Next:** the owner commits this branch. Then O8m the tower layouts (no sideways scroll on phones), O8n sprites the owner can repaint, O8f the night lab, O8g sound, O3, O5, O6.
- **Polish rule (owner, 2026-11-10):** each polish item gets a done definition first and at most two preview rounds.
- **Recruiting readiness:** résumé and real email are live. Blocking: not hosted; End Stop Cap and Latch Hinge stats are made up; Art is 56 placeholders. Each R task lists its page's content.
- **Owner habits:** end every PR with the full git command list (CLAUDE.md). After editing `contact.html` text, regenerate the contact-sheet PDF (README).
- **Merged so far:** #1 hygiene, #2–#10 and #14–#15 Phase 1, #11–#21 Phase 2, #22 CAD sheets, #23–#25 R1, #26–#31 R2 prep, résumé, page-top, thumbwheel, gallery, #32 R2d/R2e carousel and popup.
- **Design references:** notes in `REFERENCES.md` (dazprojects = the sleek benchmark, SPELUNKR = the retro-voice benchmark). Screenshots stay in the git-ignored `references/` folder. Delete the old backup bundle once happy.

## Phase 0: Foundation cleanup ✅

Done. Organized folders, URL-safe image names, `index.html`, relative links, a valid header, `.gitignore`, and 0 W3C errors.
Info notes left on purpose: the empty popup `<h2>` (JS fills it), the carousel `<section>` with no heading, and the `/>` in `thelab.html`.

## Phase 1: Responsive shell ✅

Done, closed 2026-11-04 (real-phone test and a Lighthouse accessibility run, both clear). PRs #2–#10, plus #14 and #15: design tokens and self-hosted fonts, the page skeleton and `.wrapper`, the adaptive header and footer, the dazprojects restyle with color bands and 70s stripes, three themes with the lantern picker, and the CAD carousel fitted to phones (popup, pause button, keyboard, frame-rate-independent spin, tilted ring). The reasons live in the decision log (D11–D24) and the merged PRs.
**QA checklist for every PR:** DevTools 320 / 375 / 768 / 1024 / 1440 px, drag-resize the window, Tab through with the keyboard, W3C validator.

**Parked from Phase 1:**

**Theme thumbwheel ✅ (frozen 2026-11-10).** 1.14b–e done in #29 and #31: a ridged drum under the logo that works as a smooth dimmer. The why is in D35–D38 and the comments in `themcript.js` and the THEME DIMMER section of `styles.css`.
- [-] **1.14c** Sprites: dropped with the drum (O1, D51). The theme button draws thin line icons (sun, moon, half circle) in the text colour.

**Polish** (done at the phase close): *(add refinements to finished features here)*
- [x] Theme lantern ran 8 px into the "CAD's Creations" `<h1>` between ~330 and 340 px wide (measured by sweeping every page 300–640 px; only this page). Fixed in `feat/cad-restyle`: on phones that heading keeps a lantern-sized gap.

## Phase 2: Content-ready templates ✅

Done 2026-11-06, PRs #11–#21. Every page now has its layout and `<!-- CONTENT -->` slots:
- **Home** (2.0a–c): the hero; projects written once in `data/projects.json` (D26); the card stack.
- **About** (2.1): an encyclopedia layout, with the card moved to the shared `cardyles.css`.
- **Contact** (2.2): a drawing title block. JS builds the email, adds a Copy button, and the card drags out as a PDF.
- **Code** (2.3): library catalog cards with status dots.
- **Art** (2.4): a salon hang, with the tilt tokens `--salon-tilt` / `--salon-nudge`.
- **CAD sections** (2.5): an index plus entries built from the JSON.

The reasons live in the merged PRs, D25–D26 and the code comments.

**Moved 2026-11-07:**
- 2.6 bold bands and 2.7 retro labels → R1 (site-wide decisions).
- 2.8 how to add content → R7.
- 2.9 CAD files → R2 (or after launch if the files aren't ready).
- The design pass became Phase R. Its first item, the CAD drawing sheets (#22), counts toward R2.

## Phase R: Refinement (before launch)

Goal (owner, 2026-11-07): go through the site page by page, from Home down, refining HTML, CSS and graphics until each page looks like the portfolio the owner needs. **Nothing ships untouched:** every placeholder, `#` link, test caption, made-up fact and parked block is **finished, filled or removed**.

**Every page goes through the same five steps:**
1. **Audit** (Claude). Screenshots in Day and Lantern at 320 / 768 / 1440 px, plus a list of every leftover on the page. Nothing changes yet.
2. **Owner's notes.** 3–5 things to change, and *finish / fill / remove* on each leftover.
3. **Previews.** Lettered options for each look change; the owner picks.
4. **Build.** Branch `feat/refine-<page>`, in PRs of 1–3 tasks (split a big page). Content the owner already has goes in now.
5. **Done** when the page meets the bar below. Tick it here.

**Page done bar:**
- No `#` links, placeholder images, test captions or made-up facts. Whatever isn't ready by launch is hidden or removed, not left visible.
- Every image has `alt` and `width` / `height`, and `loading="lazy"` below the fold. Each is compressed (WebP where it helps) and metadata-stripped (was 5.4). `width` / `height` let the browser reserve the space, so the page doesn't jump while loading, and phone photos carry GPS until stripped.
- The QA checklist (Phase 1) passes, contrast holds in all three themes, and the W3C validator shows 0 errors.
- `<!-- CONTENT -->` comments stay only where the owner fills in text later.

- [ ] **R1 Home + shared shell** (`index.html`). Built 2026-11-07/08 in R1a (shell: Lab hidden, footer, one spelling of "Contact and Resume"), the logo (S1, "ZN" in Sacramento as outlines), Home's first pass (H1, H4, H7, S5 `.retro-label`), the footer (D28) and R1b retro boxes (D29). Details: the merged PRs #23–#25 and the code comments. 2026-11-10: "you are here" nav marker (`aria-current`), and the card stack clears the theme wheel (`--stack-rise`).
  - **Owner content:** re-export the renders square on one background (biggest visual win); real stats for End Stop Cap and Latch Hinge, or the cards are trimmed to what's true.
- [ ] **R2 CAD Portfolio** (`projects.html`). Planned 2026-11-08 (owner), one PR each:
  - [x] **Contact card drags out as a PNG** (D30, `fix/contact-drag-png`). Sets up the picture method the kits reuse.
  - [x] **Whole boxes drag out** (2026-11-08, owner): Home boxes, featured cards and CAD entries, through `dragOutProject()` in `datacript.js`. Inner images and links get `draggable = false`, so a drag that starts on them moves the whole box. Drops the cover image until R2c adds kits. Trade-off: text inside a draggable box can't be selected with the mouse.
  - [x] **R2a Gallery** (D33, built 2026-11-09 in `feat/project-images`): `images[]` in `projects.json` (`src`, `alt`, `kind` "cad"/"photo", `caption`); sectcript's `buildGallery()` shows one big picture with its CAD/Photo tag and caption, plus 48px thumbnail buttons (`aria-pressed`) once there are two or more. `image` stays the cover for cards and boxes; a project without `images` falls back to it. New photos go in `assets/images/<id>/`.
  - [x] **Pictures fill their frames** (2026-11-09): `object-fit: cover` on Home and the CAD page (crops evenly, never stretches), and the picture sits 2px inside the dashed line (Home `padding: 2px`, CAD `calc(0.5rem + 2px)`), because at some widths the box lands between pixel rows and a picture filling it covered the top line. Best results: square 1600px exports with the part in the middle 75% (README).
  - [ ] **R2b Project pages** (D31; **after launch**, owner 2026-11-10): `sheet.html?id=<id>` + `sheetyles.css` / `sheetcript.js`, filled from the JSON, Wikipedia-style like About: infobox, Contents, Background · Design · Iterations · Printing · Result, Downloads, References. Home boxes and CAD entries link to it. Unknown id → "Project not found".
  - [ ] **R2c Kits** (D32; **after launch**, owner 2026-11-10): each project's box drags out as `<id>-kit.zip` (sheet PNG + PDF, manual, `files/`, `LICENSE.txt`), plus a "Download kit (.zip)" link for keyboards and other browsers. The drag code moves from `contcript.js` to `datacript.js`.
  - Done early (owner, in R1a): crop marks on **all four corners** of each entry image. One `::before` paints eight solid-gradient bars.
  - [x] **The owner's parked blocks** `.larger-projects` and `.item-image-block`: removed 2026-11-08 (find them with `git log -S larger-projects`), idea kept as 3.10 in Experiments (owner, 2026-11-08). The code stays in git history.
  - **Audit 2026-11-10** (Day and Night, 320 / 768 / 1440). Owner marks each *finish / fill / remove*. The owner opened the carousel and popup to changes (2026-11-10):
    - [x] **R2d Carousel look** (built 2026-11-10, D39; owner: "similar graphics/HUD as the projects below"). The ring is a sheet framed like the entries; each project is a small sheet with a crop-marked viewport and a DWG label; backs show blank paper; the phone fit math went from 68px to 104px sheets. Audit items, all fixed:
      - C1 6 of 9 figures are placeholders (one says "Coming soon"). Option: pull 3.2 forward so the ring shows only the real projects from `projects.json` (also fixes C2, and the titles stop living in two places).
      - C2 Bridge Guitar and Latch Hinge have no `data-title`, so their popup is only a picture.
      - C3 The back of the ring shows mirrored "Placeholder" text (`backface-visibility` is visible).
      - C4 Two looks mixed: grey render squares next to beige grid cards.
      - C5 Image zoom is tied to position (`nth-child(2–4)` scale 1.4 / 2.4): reorder or add a figure and the wrong picture zooms.
      - C6 About 150px empty above the ring and 200px below at 1440; Play spin floats alone at the top.
      - C7 At 320 the figures are 68px wide, too small to recognise a part.
    - [x] **R2e Popup** (built 2026-11-10; owner: "light summary, not the whole card"): DWG number, Close, title, type · year · tool, one sentence and "Full drawing ↓". The picture is on the front sheet and the stats in the full entry. Close and Escape glide the carousel back into view (on phones it used to land on "All projects"). Audit items, all fixed:
      - P1 Hard-coded Georgia and px sizes (20 / 14 / 13) instead of tokens; Close is a browser-default underlined serif.
      - P2 The slide animates `grid-template-rows`, which recalculates the layout every frame; `transition: all` on the figure images. Aim: `transform` + `opacity` only.
      - P3 Shows a title and one line, with no link to the project's full entry (or its R2b page later).
      - P4 Opening it doesn't move focus or tell a screen reader anything changed.
    - [x] **R2f Full picture in the popup** (owner, 2026-11-15): the picked project's first gallery picture, uncropped (`contain`) in a dashed viewport at the top of the popup, grown in with it; a link to the full-size file. Beside the ring the frame grows to fit the taller popup (`fitSheet()`, measured, eased; instant with reduced motion). Partly reverses R2e's "picture only on the sheet": the sheet crops it square.
    - **Page:** ~~G1 tab title "Projects"~~ → "CAD Portfolio · Zach Nott". G2 the intro is 14 lines on a phone (**owner's text**). ~~G3 empty 4th index cell~~ (`auto-fit`). ~~G4 leftover comment after `</html>`~~.
  - **Owner content** (✱ blocks launch): ✱ real stats for End Stop Cap and Latch Hinge (made up 2026-11-05); ✱ the intro paragraph and tab title; ✱ one square render each (same angle, same background); photos (hero, in use, close-up, scale, iteration lineup), EXIF/GPS stripped; write-up notes (problem, what changed per version, print settings); files to share; MakerWorld links; references.
  - **Quick, clean pictures** (owner, 2026-11-20: Fusion renders take too long, screenshots look rough). Skip the Render workspace: in the Design workspace use **File → Capture Image**, which saves the viewport at any size (1600 × 1600) with anti-aliasing and an optional transparent background, in seconds. For the same look every time: one camera (the ViewCube's Home view, or a saved Named View), one environment and visual style, grid and ground shadow off. A Render is only worth its time for one hero image.
  - **Which projects** (owner to list): 3–6 of the strongest beat many. Pick ones with a real problem, more than one version, and ideally a photo of the printed part. For each: name, year, what it does, versions, parts, print time, MakerWorld link. The 13 published designs (About, "Now") are the pool. (Claude can't see Fusion: there's no connector, so the list comes from the owner.)
  - **Kit rules:** metadata stripped (STEP headers can hold your user name and folder paths, 3MF holds slicer profiles); each kit under ~20 MB, since git keeps every version forever; bigger models link to MakerWorld instead.
- [ ] **R3 Code Portfolio** (`code.html`). Audited 2026-11-10 (Day and Night, 320 / 768 / 1440); the owner's calls are below.
  - [x] **Cards from the owner's GitHub** (owner's pick): MyWeb, INV.OS, GEX Terminal, AUDA in place of the two placeholders. One-liners, tools and statuses were drafted by Claude from each README and are marked `CONTENT` until the owner rewrites them.
  - [x] **Fixed:** MyWeb's Source link was a 404 (the repo is now `Project-Website`). Cards go two per row from 18rem, so a 768px tablet no longer shows one wide, empty card.
  - [x] **"You are here" in the nav** (all six pages): the current page's header and footer links carry `aria-current="page"` and get the hover look (D20). Screen readers say "current page".
  - [x] **`--step--2` token** (CSS tidy; owner handed it to Claude): one size for chips and tags in place of 0.7 / 0.75 / 0.78rem.
  - [x] **Fix (Home):** the card stack's back cards reached up to the theme wheel at 1920px+ (`translate`/`rotate` take no layout space). `--stack-rise` in `homyles.css` now reserves the room.
  - **Code catalog** (owner, 2026-11-10; D40), built 2026-11-10 on this branch (owner: finish before committing), preview A. Tested: open/close, Esc, focus moves to the back and back again, the hidden face is `inert`, no JS errors; 320 / 768 / 1440, Day and Night:
    - [x] **K6** Status colours (live green filled, in progress amber half, archived grey empty ring) as tokens, and every `codyles.css` value as a named token at the top of the file.
    - [x] **K7** `data/code.json` + `js/codcript.js` build the cards (like D26), every local and public project the owner keeps. Private repos get no Source link ("Private repo").
    - [x] **K8** Flip cards: small fronts (title + one line); click flips the card and grows it to two columns with the full entry; click or Esc flips back; reduced motion skips the spin.
    - [x] **K9** Featured row: bigger cards first (TTask, YouScape, GooeyThang, Voice Assistant and more, via `"featured": true`), optional "hand-written" stamp for projects from before AI (`"handWritten": true`).
    - [x] **K10** (owner, same day) Every card flips, Featured included (just bigger); a click anywhere on an open back flips it over again (links still work). **Paper look A** after previews A/B/C: cream card stock in both themes (`--color-cardstock`, `color-scheme: light` on the card), SVG grain, layered desk shadows, a slight tilt that straightens when opened. Two `@property` colours keep the punched hole and focus ring in the PAGE's colours. All values are tokens at the top of `codyles.css`.
  - **Owner content:** ✱ rewrite the intro and the drafted one-liners in your words; ✱ confirm each status; ✱ which projects are featured and which were written before AI; which projects to leave out; a README for AUDA; the Live link for this site after L3.
- [ ] **R4 Browse Art** (`art.html`). Audited 2026-11-15 (Day and Night, 360 / 800 / 1440). Layout works at every width; the content is all stand-in:
  - A1 ✱ 28 placeholder pieces (12 journal pages, 16 photos). Their titles and years ("Harbour 2025", "Lantern street 2024") are invented: made-up facts under the launch bar.
  - A2 ✱ the intro line is a placeholder.
  - A3 Images have no `width` / `height` or `loading="lazy"` (page done bar). Add them with the real files.
  - A4 Each frame links to the raw image file, which leaves the site in the same tab. Fine for now; a lightbox was cut (3.4).
  - A5 Look: gilded frames, tilt and grid-paper stand-ins are the most decorated page since the Sleek pass. The salon hang is the owner's pick (2.4), so it stays unless the owner says otherwise; real art will calm it down most.
  - **Owner's call (2026-11-15):** keep the salon frames, make them reorderable "like sliding tasks up and down a to-do list" (not a pinboard: the cork/linen prototype was declined), and build the wall from the photos as they're added (D42):
    - [x] **R4a** `data/art.json` + `js/artcript.js` build both walls; 8 labelled placeholders replace the 28 invented pieces (fixes A1's made-up facts, A3: `width`/`height`/`loading="lazy"` from the JSON). Each frame's wood and tilt are stamped from its number in the JSON, so they stay with the piece when moved.
    - [x] **R4b** `tools/art.py` (Python + Pillow, local only): photos in `assets/images/art/` → EXIF/GPS stripped, upright, ≤ 2000 px, kebab-case names → listed in `art.json`, keeping the owner's titles. Tested on a fake GPS-tagged phone photo: 0 metadata left.
    - [x] **R4c** Reordering: drag with mouse/pen, press-and-hold then drag on touch (a swipe still scrolls), Alt + arrow keys with a spoken position; Shuffle (Fisher-Yates) and Reset; the order is remembered per device (localStorage). FLIP animation, none with reduced motion.
  - [x] **R4d First photographs** (2026-11-20, `fix/art-photos`): three of the owner's photos of one female hairy woodpecker (owner: same bird, no red patch), titled from the pictures by Claude (*Looking Up*, *Among the Berries*, *Last Light*), 2026. The placeholders are gone, so the empty Art journals wall hides itself. Two bugs found while adding them:
    - `art.py` dropped the colour profile with the metadata. Two photos were Display P3, which a browser then reads as sRGB (duller, shifted). It now keeps the ICC profile (not personal) and still strips EXIF and XMP; it also writes `art.json` with LF endings, so a re-run changes nothing.
    - `sizeFor()` gave tall frames only below 0.7 (width ÷ height). 4:5 photos (0.8) got one cell, whose opening is landscape once the label takes its share, so they showed as a thin strip. Now every portrait photo is tall.
  - [~] **R4e Art redesign** (D48, in the launch scope). Research: `references/reports/Art page reference research.md` (git-ignored: it describes other people's sites). Previews with the real photos: A index grid (Bravo), B two-up wall (Wernli), C hung line (Kousmate). **Owner's pick: A** (2026-11-20). Three PRs:
    - [x] **R4e-1** `feat/art-redesign`: frames, mats, wood and tilt removed; bare uncropped photos in 3 columns (2 under 56rem, 1 under 37.5rem), a caption under each (title, then detail · year in mono capitals), always visible. Drag, Alt + arrows, Shuffle and Reset kept (D42). `--salon-tilt` / `--salon-nudge` removed.
    - [x] **R4e-2** `feat/art-areas` (owner: "nature, architecture, portraits, or broader ones as photography grows"; built 2026-11-21). Previews A headings / **B headings + jump list (owner's pick)** / C filter tabs. An optional `"area"` per photo in `art.json` (the three woodpeckers: Nature). Each area gets a quiet sub-heading with its count and its own grid, in the order areas first appear; photos without an area share a grid with no heading. A jump list of plain `#` links under the intro appears from 2 places up (so Back, bookmarks and shared links work with no code). Reordering stays inside one area; the saved order moved to `art-order-2`, keyed by wall. Tested with a scratch JSON of journals + 3 areas + an unnamed photo: walls, jump links, "3 photos" for screen readers, Alt + arrows and Reset.
      - Same branch, owner 2026-11-22 ("cleanly laid out chaotically", "nothing in the way", photos "full size"): **masonry** (D49), the page's `<main>` widened to 86rem like Home, Shuffle / Reset / the drag hint moved below the photos, and a heading that's the only one of its kind (one area, or one section) hidden from sight but kept for screen readers. Tested with scratch crops (3:2, 1:1, 16:9, 4:5, 2:3) at 1440 / 800 / 390: columns pack, order reads left to right, Alt + arrows still move and announce.
    - [x] **R4e-3** `feat/art-lightbox` (built 2026-11-23): a click opens the photo in a `<dialog>` on the page colour, with visible Previous / Next / Close, arrow keys and Esc; reduced motion respected. Follows the visitor's order across all areas, wraps at the ends, focus returns to the last photo shown, and Ctrl/Cmd-click still opens the file. A fourth photo (*In the Thicket*) went in on the same branch.
  - [x] **D Declutter** (owner, 2026-11-23, D50; merged in #42 with the lightbox). Analysis: `references/reports/Declutter reference analysis 2026-11-23.md` (git-ignored). D-a footer = outside links + © only (name, tagline, page list removed from all six pages). D-b CAD entries lose the double frame: the carousel is the one drawing sheet, entries get a hairline. D-c About's grey boxes: no code, they're the placeholder's loading surface and vanish with real photos (owner content). D-d theme drum narrower (`--drum-width` max(6rem, 8vw)), height kept. D-e Code cards: no resting shadow, sans titles, fainter rules. Also removed: the second "View projects" on Home (beside "All projects"). X8 still owns the four button looks (previews A/B/C shown 2026-11-23).
  - [ ] **O Overhaul** `feat/header-overhaul` (owner, 2026-11-23, D51: "the imagery and overall layout should look similar to" brittanybravo.com). Previews: `x9` (header A/B/C, Home and CAD mockups), `x10` (A1 split / **A2 name centred, links below** (recommended); stripe S1 thin edge / **S2 small mark under the name** (recommended) / S3 About only / S4 removed). The carousel stays (owner: "that's ma baby").
    - [x] **O1** Header (owner's pick A1, built 2026-11-23): "Zach Nott" (capitals from CSS) centred between CAD · Code · Art and About · Contact, no band or hairline; the current page is underlined. The drum became a 40px round button (left of the name on phones, right end on desktop) that cycles Auto → Day → Night; `themcript.js` went from 284 to ~70 lines and clears the drum's old saved level. The ZcN logo file stays in `assets/images/`. Tested: 1440 Day/Night, 390 (Menu open and closed), 320, three clicks, validator 0 errors.
    - [x] **O2** Stripe (owner's pick S2): a 48 × 4px five-stripe mark under the name (greys at Night); the edge band and its right-hand padding are gone, and About's popover now clears the gutter instead. Footer: muted text on the page colour under a hairline.
    - [x] **O2b** Footer (owner, 2026-11-24, pick E1 from previews `x12` A–D and `x13` E1–E4, D53): pine is back as a slim band (charcoal at Night), everything centred like the header: one row of links, then the © line with the five-stripe mark shrunk to the width of "Zach Nott" under it, so the band lost a row. Tokens `--color-band`, `--color-on-band`, `--stripe-mark` (the header's mark uses it too). Links get a white focus ring (gunjo fails on pine). Tested 1280 Day/Night, 390, 320, keyboard focus, validator 0 errors.
    - [ ] **O3** Headings in sans instead of Cinzel; X8 shared button, look A (pill, body sans).
    - [x] **O4** Home (built 2026-11-23): the hero, card stack and tile catalog are gone. One masonry mosaic of CAD projects and photos, mixed (project, photo, …), with even 16px gaps; no visible intro (the `<h1>` is screen-reader-only). Owner, same day, from the reference: "no text until the image is hovered", "crisp white borders in a mosaic style". So each title + meta fades in over a 62% dark veil on hover **or keyboard focus**; the words stay inside the link for screen readers. Art's grid got the same captions and gaps (touch visitors read them in the viewer). `enableMasonry` moved to `datacript.js` so both pages share it; Art photos got ids (`art.html#piece-…`) for Home's links. Home no longer loads `cardyles.css`. Tested at 1440 / 390 Day, focus on a tile, validator 0 errors.
    - [x] **O4b** `feat/home-cards-cad-index` (owner, 2026-11-24, D52): Home keeps the mixed mosaic. Above it, one quiet centred row: "Featured cards" and "CAD portfolio" (no section label or arrow, owner's second pass the same day; the `<h2>` is screen-reader-only). "Featured cards" slides the Blueprint card stack open in a drawer that pushes the mosaic down (a grid row animated 0fr → 1fr, `inert` while shut, Esc closes; it was a popover for one round). The stack turns like a wheel (Previous / Next / ← →, loops). The CAD page gets the old Home catalog as an index of clean tiles under the carousel ("All projects"; the write-ups' heading became "Details", and "↑ All projects" goes back to the tiles); a project with 2+ pictures gets ‹ › arrows that loop, like dazprojects. Every picture tile lifts on hover or focus: 3% bigger, 4px up, a soft shadow, with a smooth ease-out (`--lift`, `--lift-scale`, `--shadow-lift`, `--ease-smooth`; first 2px, then "smoother and less subtle"). Home's own top gap is 24px (owner: "the gap between the nav bar and the featured cards"); the other pages keep 60-80px for their titles.
    - [x] **O4c** Home order (owner, 2026-11-24: "a way to easily change order … that others can't change", "randomize token or hidden randomize button"): `data/home.json` with `"mode"` listed / mixed / random and an `"order"` list of ids; unlisted tiles follow in the mixed order, unknown ids are skipped with a console warning. `index.html?shuffle` is the owner's preview: a random order, printed in the console as paste-ready JSON. Tested in Node against the real `arrange()`: all modes, typos, duplicates, 24/24 orders reachable. Tested: pop-up opens and turns, arrows loop (scratch two-picture project), 1440 / 390, validator 0 errors.
    - [ ] **O5** CAD entries: big picture, underlined title, one credits line. The carousel keeps its spin, pause and popup and loses its frame.
    - [ ] **O6** Code, About and Contact: a light pass to match.
    - [ ] **O7 Code goes retro** (owner, 2026-11-24, after the deep research `references/reports/Retro web design for Code page.md`, git-ignored). Keep the page's layout, format and colours (featured row + catalog, cream cards, status dots); the retro comes from details. Small tasks, one look each, previews first:
      - [x] **O7a Retro flip cards** (owner's pick A "instrument panel"). Every card is a small window. A pine title bar holds the number and one control: "Flip" on the front, a 24px ✕ close box on the back (2Advanced). The status dots are lamps in a bezel ring, and the live one glows; the word always comes with the lamp (Conspiracy). Bevelled edges are real borders, light top-left and dark bottom-right (Cartoon Network); borders survive Windows High Contrast, shadows don't. A one-line readout of tools and year sits along the bottom of each front. WIP cards get a hazard-stripe trim. Fronts stay 6 whole ruled lines tall. The featured label became "Now featuring", not "Now building", because some featured projects are finished. Kept: the `No. 001` numbers, layout and colours. Tested: Day, Night, a card open with the close box focused, 390 / 320, validator 0 errors, security review clean.
      - [ ] **O7b List view** (the Pirate Bay table): a Cards / List switch (`aria-pressed`); List is one sortable table (Project · Status · Tools · Year · Links) that scrolls sideways on phones and announces "sorted by …". Recruiters scan a table fastest.
      - [ ] **O7c Map view (experiment)**: Space Jam's starfield with Obsidian's graph: each project is a star, and stars that share a language or tool are joined by lines, so the clusters show what you work in. Hover or focus a star to light up its neighbours. The layout settles once and then stays still (no endless orbit: WCAG 2.2.2, and the CAD carousel is the one thing that spins). Plain SVG and ~150 lines of JS, no library; every star is a link in Tab order; the cards stay the main view.
      - [x] **O7a2 Card fixes** (2026-11-25). The hazard trim moved under the title bar: at the bottom it covered the readout. The readout became two spans: the tools shrink to "…", the year never does (Stock Scraper's hidden year was 2025). The bevel swaps sides on press. Only featured cards keep the dark bar; the catalog's bars are pine-tinted (owner's pick B: 28 dark bars pulled the eye before the names). Tested: Day, Night, 390 / 320.
    - [ ] **O8 The workshop** (owner, 2026-11-25, after ashanand.dev and a portfolio wireframe; D54). The Code page is a pixel-art room: every object holds a "shelf" of projects, three lead elsewhere (3D printer to CAD, camera to Art, map to the table). Built in one PR:
      - [x] **O8a Data**: a `"shelf"` on every project in `code.json` (10 shelves, from the wireframe's mapping).
      - [x] **O8b The forge room** (`js/workcript.js`, owner's pick B with their 13 notes): 384 x 216 canvas at 2x-4x, never blurred. A stone wall, a bookshelf built into the wall with candles, a figurine and bottles, a barred window throwing striped light, a verdigris speaking horn beside it, a Middle-earth map (to the table), the site's blueprint, scales, a smith's rack, a lute, a lantern, herbs, a shield, a broom; on the bench an advanced rune tablet (a stone-cased PC with an LCD terminal) and dice; a sturdy lectern; an Elegoo Centauri Carbon with an A1 mini strapped on its roof (CAD); a bellows camera with its focusing cloth (Art); an anvil; the forge with a front and a side face, a brick stack and smoke; dark foreground shapes for depth. Light in three passes: day colours, a multiply for the time of day, then everything that gives light. The window follows the visitor's clock (dawn, day, dusk, night); `?sky=` previews. About 10 frames a second, paused off screen, a Pause button (WCAG 2.2.2), still under reduced motion.
      - [x] **O8c Click areas**: real buttons (shelves) and links (printer, camera, map) laid over the room in %, tags in Silkscreen, a swipeable list of the same objects on phones, Tab order top row first.
      - [x] **O8d Viewer**: the open shelf as a heading, its best project on the O7a index card (pine bar, lamp, hazard on WIP), the rest of the shelf beside it; `#p-<id>` links open a project.
      - [x] **O8e Every project** (absorbs O7b): one table sorted by column buttons (`aria-sort`), filtered by status; Shelf and Built with drop out on phones.
      - [x] **O8 retire the flip cards**: the flip, status key and section labels are gone (the labels were "eyebrows", an AI tell). Tested: Day, Night, dawn, dusk, `#p-inv-os`, 390 / 320, validator 0 errors.
      - [ ] **O8f Night lab** (owner: "forge day, lab night"): the Night theme shows the station lab instead of the forge, redrawn with the forge's depth and variation. Fix for "will the lab be too bright": build it dark-first, never as the day room darkened. Panels in dark gunmetal (nothing above ~70% lightness except light sources), the same three-pass light (a night multiply, then screens, strip lights and the fabricator as the only bright things), light sources under ~10% of the picture, a vignette into the band colour, and a check of the brightest pixels against the dark page.
      - [ ] **O8g Sound** (plan, not built): off by default, one visible Sound button (`aria-pressed`, remembered); nothing plays until it's pressed, so no autoplay and WCAG 1.4.2 never applies. Short, quiet sounds made in the browser with the Web Audio API (no files to license): a page turn (lectern), a horn note (voice), a lute pluck (audio), a printer beep (CAD), a shutter click (Art), a chest creak (early projects), a low forge crackle loop while the room is on screen. Volume capped low; muted when the tab is hidden.
      - [ ] **O8h Real screenshots**: add an `"image"` to projects in `code.json`; the viewer shows it beside the card when there is one.
    - [ ] **O8 v2 The full-screen workshop** (owner, 2026-11-25: "love this aesthetic, lock it in"; picks: scroll, inside the frame, perspective walls, pack recoloured). The look (warm stone, one window light, forge glow, day multiply, dark foreground) is locked; only the art source and the layout change:
      - [x] **O8i Full screen**: the room fills the window (`100dvh`). The site header sits inside the frame in light text; "Code Portfolio" and one line sit in the frame's lower left; Pause moves into the frame; the time-of-day line goes. The every-project table stays below the fold (the map scrolls to it).
      - [x] **O8j Perspective surround**: the back wall stays a fixed picture; angled side walls, ceiling and floor are drawn at the same pixel scale to fill whatever the window's shape leaves, so no object is ever cropped.
      - [x] **O8k Outlines that hug the object**: hover, focus and "open" draw a 1 px light line around the object's own shape (its pixel mask, grown by 2 px, with a 1 px gap) on the canvas, instead of a rectangle.
      - [x] **O8l The parchment scroll** (replaces the viewer card): clicking an object unrolls a scroll inside the frame (the room dims behind it): the shelf's projects as rows, the chosen one opens in place (description, tools, source). Close box and Escape close it and focus goes back to the object; unrolls instantly under reduced motion.
      - [ ] **O8m Three layouts by window shape**, never a sideways scroll bar. Sizes (base pixels; scale = the largest whole number that fits):
        - **Hall** (aspect 1.2 or wider, 768 px+ wide): today's room, back wall 384 x 216, fits width AND height (1280 x 800 → 3x; 1920 x 1080 → 5x... capped at 4x; 1280 x 600 → 2x with the side walls filling).
        - **Loft** (aspect 0.7 to 1.2, or 600 to 767 px wide; tablets upright): two floors joined by stairs, 256 x 320 (768 x 1024 → 3x).
        - **Spire** (narrower: phones): a tower of three floors and a roof joined by stairs, 160 x 320, scaled to the width (320 to 479 px → 2x, 480 px+ → 3x); the page scrolls down through it, never sideways.
        Each object is a sprite placed per layout, so all three are built from the same art.
      - [ ] **O8n Real artists' art** (owner, 2026-11-26: "if assets work, still want to use them over me redrawing"). A wide itch.io + OpenGameArt crawl (`references/research_notes/Free pixel sprites wide search/`, git-ignored; AI-disclosed packs rejected) found a kit: Whimsy Hallow (room shell, stairs, book stand, potions) and kanmandev Blacksmith (forge, anvil, bellows, grindstone, tables, tool stand), both use-only; Manu_Art Library (CC-BY-SA), candles, lanterns, fires, dice, computers, a bellows camera and the night lab (CC0 / CC-BY). Raw packs live in git-ignored `assets-src/workshop/` (checklist in its README); `tools/workshop.py` crops, recolours to one palette, adds one outline and writes `assets/images/workshop/` + `CREDITS.md`, the only files committed. Still drawn in code: the 3D printers, map, blueprint, horn, scales, lute, broom, herbs, coal, chains, side walls and all light. Steps: owner downloads → test corner (forge + anvil + bookshelf beside the drawn printer) → owner signs off → whole room.
        - **2026-11-26 mock built:** `tools/workshop.py` cuts and recolours 10 sprites (Manu_Art bookcases + globe, karsiori lantern: repo-safe sheet `sprites.png`; kanmandev anvil, tongs, hammer, bucket: use-only, flattened into `room-layer.png`). `?art=code` shows the old room. Whimsy's wall tile was tried and dropped (it fought the light). Open: kanmandev's 16 px anvil reads small beside the forge; the owner decides keep or draw.
        - **2026-11-26 owner round:** full screen like Ash's room (cover scale, safe area keeps every object; thin bands on odd shapes; upright/narrow screens pan until O8m), no header or title on the page (h1 kept for screen readers), Pause in the top corner, the map opens "Where to go" (every page), the shield links to About. Whimsy Hallow wall back in, greyer (`wall-layer.png`); kanmandev anvil and bucket at 2x (owner's call); Whimsy chest at 2x in wood, overlapping the shelf. Perspective side walls (O8j) removed. Sprite edits: `assets-src/workshop/export/` holds each original, `edits/` overrides it.
        - **2026-11-26 depth round:** the picture grew to 576 x 300 with the room in its middle (objects about a third smaller at full screen, like Ash's room); perspective without side walls: ceiling beams and floor joints run toward one vanishing point, plus a rug drawn as a trapezoid; margins hold Manu_Art's statue, vase, banners and chandelier and kanmandev's small furnace, ingots and ore. Cover scaling crops only spare margin, so no bands from 4:3 to 21:9. The final itch.io sweep (~10,500 listings) found no better free forge or bellows; karsiori's CC0 chest pack is the backup chest (`smithing_final.md`). Next: O8m the tower for phones.
        - **2026-11-26 layout round:** objects spread out (`SHIFT` groups in workcript.js, mirrored in tools/workshop.py): knight | bookshelf | vase on one floor line, the bookshelf's arch now a ring of grey voussoirs with a keystone, the lantern on a bracket right of the forge, a big and a small chandelier cut cleanly (the tool's new `erase` option). The forge is kanmandev's furnace at 3x (darker 'kiln' ramp) with the drawn fire in its mouth and faint chimney smoke. Audit: everything clears the 21 px a 16:9 screen trims; the furnace's 3x pixels are chunkier than the rest (owner's call); the wall tile repeats visibly (minor).
        - **2026-11-26 placement round:** lantern centred between furnace and banner (bottom just under the banner's), bucket in front of the furnace (the tool's new `z` paint order), a rusted sword (kanmandev, 2x) on the wall right of the forge, the upper wall spaced out (map, blueprint, scales apart; lute by the window; tool rack lowered over the anvil).
        - **2026-11-26 shop-only round:** the page opens as the workshop and nothing else (no scroll). Picking an object unfolds the table, the ask strip and the footer below (`.shows-below`); they fold away once the scroll is closed and the room is back in full view. The parchment ends in "Every project, in one table", which glides down. The art credit sits in the room's corner. Tall monitors fit the room's width with its edges fading into the dark (only phones pan). Pages cross-fade (D55).
        - **2026-11-26 load round:** the room no longer flashes the old code-drawn version first: it stays hidden until the pack art has loaded (preloaded in `<head>`), then fades in. The code-drawn stand-ins the packs replaced are trimmed (stone wall, books, forge and its smoke, anvil, bucket, chest, lantern, tongs, hammer, tankard; about 130 lines and `?art=code`). Layered sprites now outline properly (`sprites.json` gives each one's place). If the art fails to load, the page shows the table.
      - Not doing (report): splash screens, autoplay sound, endless blinking, a fake desktop, text in images.

  - **Owner content:** ✱ photos of journal pages (flat, even light) and more photographs, each with a real title and year; one intro line. The public résumé was checked on 2026-11-20: no phone number or street address, only the town and the public email.
- [ ] **R5 About Me** (`aboutme.html`). Audited 2026-11-16 (Day and Night, 390 / 768 / 1440) against daz's About page (short headed sections, one or two paragraphs each, a row of photos, one pull quote; no boxes or sidebar):
  - B1 ✱ The card photo is the placeholder, and its `<img>` has no `width` / `height` (page done bar).
  - B2 The name appears four times above the fold (title, bold lead, infobox title, card); "Designer · Maker · Fabricator" twice. Say it once.
  - B3 Wikipedia scaffolding for five short sections: the Contents box, *See also* (repeats the nav) and *External links* (repeats the footer).
  - B4 Five big Cinzel section headings over hairlines are the loudest thing on the page (daz: only the page title stands out).
  - B5 Phones: the infobox (a placeholder card + table) fills a whole screen before Background starts.
  - B6 ✱ Voice: third person ("Zach led…") here, first person on Home and CAD ("I design parts"). Pick one (owner's text).
  - B7 ✱ Three different one-line descriptions (About tagline, Home eyebrow, footer). Pick one.
  - B8 ✱ No real pictures: daz's About is half photos. A bench photo, the toboggan, a printed part would be the strongest proof.
  - B9 ✱ Unconfirmed facts: the tool years (6/6/5 are estimates) and "CAD since 2019".
  - **Previews:** A tidy encyclopedia (B2–B4 fixed, card and facts kept) · B daz story (photo, Origin / Now / Next, a photo row, "Create something from nothing." as the pull quote, facts as one hairline list; no card). B needs photos to work.
  - [x] **R5a Story layout** (owner's pick B, 2026-11-16; D44), built in `feat/refine-about`: title + one line + hero photo, a first-person lead, Origin / Now / Next, a row of three photos, the pull quote, "At a glance" facts on hairlines. Fixes B2–B7. The card moved into a **Profile card popover** (owner: "A's card as a pop up"): HTML `popover`, no JS. Photo slots use the placeholder at its own size until the real files arrive. Tested: Day and Night at 390 / 768 / 1440, popover open, W3C 0 errors.
  - [x] `tools/art.py --clean <folder>`: strips EXIF/GPS from any photo folder and prints `width`/`height` for the HTML (tested on a fake GPS-tagged photo: 0 tags left).
  - **Owner content** (✱ blocks launch): ✱ the four photos (hero, toboggan, shop, printed part) into `assets/images/about/`, run `python tools/art.py --clean assets/images/about`, then set `src`, `alt`, `width`, `height` in `aboutme.html`; ✱ rewrite the first-person text in your voice (Claude converted it, and drafted "Next" from the Contact status); ✱ confirm the tool years (6/6/5 are estimates) and "CAD since 2019" (university began 2020); a portrait for the card.
- [ ] **R6 Contact & Résumé** (`contact.html`). The style stays (owner, 2026-11-06).
  - [x] The real email (owner, 2026-11-08, in `fix/contact-drag-png`).
  - [x] City (from the résumé). Status still to confirm: internships, or design and fabrication roles?
  - [x] The résumé (2026-11-08): `assets/docs/zachery-nott-resume.pdf`, a public copy rebuilt from the owner's master with no health detail, clickable links and clean metadata. The contact button downloads it (and drags out); the Home hero button opens it. **Owner:** make the same edits in the Google Doc master, so the next export matches.
  - [x] GitHub (in the footer since R1a; no LinkedIn, owner 2026-11-07).
  - Regenerate the contact-sheet PNG and PDF after any text change (README).
- [ ] **R7 How to add content** (was 2.8, README). How to add a project, a photo and an art piece, plus image size, naming and metadata rules. Written last, once the patterns are final.

**Polish** (refinements to pages already done):
- [x] **Page-top gap** (2026-11-08, owner handed it back): every page's content starts `--page-top` below the header (D34): 60px on phones, 72 at 1280, 80 max. Measured on all six pages at 320–1440: identical, 0 lantern overlaps.
- [x] **CSS tidy** (2026-11-10, `feat/refine-code`). Checked 2026-11-10: no `transition: all` or stray font families are left; the only gap is 4 font sizes below the type scale, which `--step--2` covers (R3). Art's frame colours and the card's blueprint whites stay as local, named values (materials, not roles).
- [x] **Sleek pass** (owner, 2026-11-10, after comparing with dazprojects; mock-ups A/B/C per page). Built 2026-11-11 in `feat/sleek-catalogs`. What makes daz sleek: one picture style, nothing around each item, one font, a tight even grid.
  - **Home catalog: C.** Tiles (picture on a pale square, name, one meta line; no border, dashed frame or shadow), names in Instrument Sans, and a wider catalog on Home only (Code and CAD keep today's width). 3 tiles stretch to fill the row.
  - **Code: B "quiet paper".** Tilt tokens to 0, no grain, no red rule, one soft shadow, fainter ruled lines, the "Flip" hint only on hover. Mono titles stay.
  - **CAD: B "tidy".** Remove the repeated name row (`#cad-index`); stats as one line ("8 iterations · 5 parts · 6 h print · ★★★★"). Built with the dot after each stat, so a wrapped line never starts with one, and singular labels ("1 part"). Cinzel titles stay.
  - Biggest win is content, not CSS: renders in one style (same angle, background, square) and app screenshots for the Code cards.
- [~] **Daz pass, site-wide** (owner, 2026-11-16: daz's professionalism leads on every page). Found while auditing R5:
  - ~~X1 Header links lose their underline~~: no (owner, 2026-11-16). They stay underlined.
  - [x] X2 Cinzel only on the page title (`h1`); `h2`/`h3` default to Instrument Sans (D44). Only `.cad-title` relied on the default, so it now asks for Cinzel by class: the CAD page looks the same.
  - [x] X3 One self-description ("Mechanical design & CAD") and first person (owner): About now matches Home, Contact and the footer.
  - [ ] X4 Contact at 1440: the card takes a third of the screen and the rest is empty above the footer. Owner unsure: decide in R6.
  - [x] X5 Token pass (D45): `--radius-soft` (6px), `--radius-pill`, `--speed-fast/--speed/--speed-slow`, `--tracking-caps`. Replaced 6 pill radii, 8 letter-spacings, 16 transition times, a stray `15px` and a `#FFFFFF`. Times were rounded onto the scale: Art frames 250 → 300ms, the menu ▸ 200 → 150ms.
  - [x] X6 Profile card popover (D46): first a band over the stripes (owner), then, since the owner disliked the overlap, a **golden rectangle** (width = φ × height, measured 734 × 457 = 1.607 at 1440) that never crosses the stripes and is centred, so both sides match. Previews: A golden (picked), B the text column (2.3:1), C widest clear of the stripes (2.6:1). 6px corners. Fixed a bug: `--about-radius` lived on `.story`, outside which the popover sits, so its corners were square.
  - [x] X7 CAD "All projects" label no longer sits on the first sheet's frame; Home's "View projects" link is a step smaller and sentence case, like the hero button.
  - [ ] X8 One button style (in the launch freeze, owner 2026-11-20): the site has three (body-font pills on Home and Contact, mono pills on Art, About and Home's "Next card", CAD's square caps). Previews first, then one shared `.button` class (plus a filled variant) in `styles.css`, and the copies come out of the page files. Branch `feat/buttons`.
  - [ ] X9 Home hero at 1440: the text sits at the top with empty space under it, beside the taller card stack. Preview centring it. **After launch** (freeze, D47).

## Phase L: Launch

**Launch bar** (all true before the link goes to anyone):
- Phase R is done: every nav link leads to a refined page, or the link is gone until it does.
- Real name, email, résumé and GitHub (no LinkedIn, owner R1a). No made-up project facts.
- L1 and L2 are merged. The validator shows 0 errors. Lighthouse accessibility and a real-phone test pass on the live URL.

**Launch order (owner, 2026-11-20).** One branch per row, each merged before the next starts:

| Step | Who | Branch | What |
|---|---|---|---|
| L1 | Claude | `chore/launch-basics` | favicon, `.nojekyll`, `noindex`, CAD description |
| L1c | Claude | `chore/remove-lab-menu` | the hidden Lab dropdown out of all six pages |
| L0 | owner | (GitHub settings) | rename the repo, then `git remote set-url origin <new url>` |
| L3a | owner | (GitHub settings) | Pages on, unshared |
| L1b | Claude | `chore/share-tags` | Open Graph, canonical, `Person` JSON-LD (they need the final address) |
| L2 | Claude | `feat/csp-404` | security |
| L4a | Claude | `ci/site-checks` | lychee, pa11y-ci, Lighthouse CI |
| X8 | Claude | `feat/buttons` | one button class |
| L3 | owner + Claude | `chore/launch` | remove `noindex`, send the link |

Content (renders, stats, photos, texts) runs alongside and decides the launch date.

- [x] **L1** `chore/launch-basics` (was 5.3), built 2026-11-20:
  - Real page titles and the footer name: already done in the R tasks.
  - Favicon "stripe A": `favicon.svg`, the five stripes in a rounded square. Its own `<style>` picks colours by class and switches to the night greys with `prefers-color-scheme` (it can't see the site's dimmer). Checked at 16 / 32 / 64 px on light and dark tabs. Safari may show a letter instead until a PNG fallback is added (L4, if the audit flags it).
  - `.nojekyll`: GitHub Pages serves the files as they are, without running Jekyll (which hides `_` files and slows each deploy).
  - `<meta name="robots" content="noindex">` on every page until launch, so search engines skip the staging site. **Removing it is the launch.**
  - SEO check (`searchfit-seo:seo-check`): the CAD page had no description (added, drafted as option A of three, marked `CONTENT`). Descriptions are 58–117 characters, short of the 150–160 guideline: owner's text, before launch. No canonical, Open Graph or JSON-LD yet: L1b.
- [ ] **L1b** `chore/share-tags`, after L0 and L3a: `og:title`, `og:description`, `og:image` (1200 × 630, a full URL: social sites fetch it from their own servers, so a relative path doesn't work), `og:url`, a canonical link, Twitter card tags and a `Person` JSON-LD (`searchfit-seo:generate-schema`).
- [ ] **L1c** `chore/remove-lab-menu` (owner, 2026-11-20): remove the hidden Lab dropdown (7 `href="#"` links per page, its toggle button, its CSS and JS). Decide what happens to `thelab.html` once nothing links to it: delete it, or keep it with `noindex` as a private experiment.
- [ ] **L0 Repo rename** (owner; before L3a, because the Pages address is the repo name: `username.github.io/<repo>/`). GitHub redirects the old address, but update your copy: `git remote set-url origin https://github.com/OopsieLazy/<new-name>.git`. Then the Code page's MyWeb Source link (`data/code.json`) and the README.
- [ ] **L2** `feat/csp-404` (was 5.2):
  - A CSP via `<meta>`, because GitHub Pages can't set headers.
  - `rel="noopener noreferrer"` on external links.
  - An `innerHTML` audit.
  - A plain `404.html` with the site header (4.2 dresses it up later).
- [ ] **L3a Staging** (owner, right after L0; D47): turn on GitHub Pages from `main` and don't share the address. Every merge after that is tested on a real phone at the real URL, so launch day is only "remove `noindex`, send the link".
- [ ] **L3 Go live** (owner, was 5.1):
  - Pages is already on (L3a): remove the `noindex` tag (its own small PR).
  - GitHub settings: the ruleset is done ✅. Still to do: secret scanning and push protection, Actions read-only, wiki off, "Automatically delete head branches".
- [ ] **L4a Automatic checks** (`ci/site-checks`, owner 2026-11-20: "full test"; D47). Added to the existing GitHub workflow, so they run on GitHub's servers for every PR; nothing is installed locally and the site keeps no build step:
  - **lychee:** every link and image path on every page.
  - **pa11y-ci:** accessibility (contrast, alt text, labels) on each page, in a headless browser.
  - **Lighthouse CI:** performance, accessibility, SEO and best-practice scores, with minimum scores that fail the PR.
  - Each tool's version is pinned, like `vnu-jar`. Not added: stylelint (CLAUDE.md says no linter) and screenshot diffing (too heavy for six pages).
- [ ] **L4 Audit** (was 5.5): Lighthouse, plus a real-phone test on the live URL.
- [ ] **L5 Custom domain** (optional, was 5.6). `.dev` requires HTTPS, which GitHub Pages provides.

## Phase 3: Project display system (pluggable)

Goal: cool, unique ways to show the projects (carousel, film strip, spin reel), always next to one **streamlined** way for quick, accessible browsing. New displays are added without touching old ones.

Pattern: each display is a self-contained JS file that sets itself up on any container marked with `data-display="..."`.
```html
<div data-display="carousel"> <figure ...>...</figure> </div>
<div data-display="slideshow"> <figure ...>...</figure> </div>
```
- [ ] **3.1 Display loader.** A small script that finds `[data-display]` elements and calls the matching module.
- [ ] **3.2 Register the carousel.** Wrap the existing `projcript.js` logic as the first display, with minimal edits. ~~Its figures come from `projects.json`~~: done early in R2d (D39).
- ~~**3.3 Slideshow** and **3.4 Lightbox**~~: cut (2026-11-05). The popup and the grid already cover them.
- [ ] **3.3b Grid display: the streamlined version** (dazprojects pattern). The fast, plain, accessible way in, and the default for `prefers-reduced-motion`. Classic catalog grid: each project is an image on a pale tile, then its title and one short line of info (tools, year). CSS grid `repeat(auto-fill, minmax(…, 1fr))`: about 5 columns on desktop, 2 on phones, no media queries. Optional: a density toggle (big/small tiles) like daz's two icons. Each card is a real link (to the write-up from 2.5).
- [ ] **3.5 Doc: "How to add a display"** in README.
- [ ] **3.6 Film strip display.** Projects are frames on a vertical strip of film (sprocket holes down both sides), drifting slowly up or down. Hover or focus pauses it, and clicking a frame opens it. Medium difficulty: CSS sprocket holes (`repeating-linear-gradient`), a seamless loop (the frames are duplicated once and `@keyframes` moves the strip by exactly one copy), and the duplicates are `aria-hidden` so screen readers don't hear each project twice. Fits the Filmography theme.
- [ ] **3.7 Spin reel display** ("pick a project"). Project cards stand in a ring around a vertical axis, each card's left vertical edge on the center, like a book opened all the way round (360°, a "star book" or "carousel book"). The selected card is the one pointing closest to the camera. Cards' images read best about 90° around the ring, so the chosen one's info pops up beside the reel. You spin it by hand, it ticks like a prize wheel as cards pass, and when it settles the chosen card's info pops up (image above, text below, like a bibliography entry). Medium-hard, so it is split up:
  - [ ] **3.7a Ring layout.** CSS 3D: `perspective` on the stage, each card `rotateY(angle)` with `transform-origin` on its inner edge (the spine), not `translateZ` like the carousel. Angles come from the card count.
  - [ ] **3.7b Spin by hand.** Pointer events (drag or swipe) set the speed, `requestAnimationFrame` slows it with friction, then it snaps to the nearest card. Arrow keys and Prev/Next buttons step one card, so it works without a mouse.
  - [ ] **3.7c Tick sound.** A short click from the Web Audio API (no audio file) each time a card passes the pointer. It starts only after the visitor touches the reel (browsers block autoplay), with a mute button that's remembered.
  - [ ] **3.7d Info card.** On settle, show the image above the title and description, read from the same `data-*` attributes as the carousel. Announce it with `aria-live`. Reduced motion: no spin, just step and show.
  *Inspired by the owner's memory of the Chaotic game's match-select wheel. Our own design and art, not a copy of the game's look. Sketch the camera angle before 3.7a.*
- [ ] **3.9 Phone mini-player** (was 1.16b, D16): tapping a figure shrinks the carousel and docks it to the left, like YouTube's mini-player, while the project info slides up. On phones the carousel **keeps spinning** (desktop still stops and faces the pick). Tapping the mini carousel or Close restores it. CSS `transform: scale()` + `transition`, and JS picks the behavior with `matchMedia`. Reduced motion (1.15c) keeps it paused. *Open question: can you pick another project from the mini carousel, or only restore it?*
- [ ] **3.10 CAD featured area** (owner, 2026-11-07): the owner's two placeholder blocks above the CAD entries (`.larger-projects` "growing style, where you see part and expands to image or project view", and `.item-image-block`) become a featured area: projects with `"featured": true` in `projects.json` shown large, each showing a detail first and growing into the full image or the project entry on click. Built as a display (3.1 pattern), so it can be reused. **R2 decides:** built during refinement, or the blocks are removed and this waits.
- [ ] **3.8 Display switcher.** A small toolbar (Carousel · Film · Reel · Grid) above the projects. Each button swaps the `data-display` value and re-runs the loader from 3.1. The choice is remembered in `localStorage`, and the grid is the default.

## Phase 4: The museum

Design doc first (art style, room ↔ section map, controls), then build in small steps.

- [ ] **4.1 Design doc.** Rooms, layout sketch, palette, who draws the pixel art (you?).
- [ ] **4.2 One static room**, first used as `404.html` ("lost in the archives"): a low-stakes place to try the art. Small pixel-art images (found or drawn) scaled up with `image-rendering: pixelated` and placed with CSS. Doors are real `<a>` links, so the room works without JS. (ashanand.dev draws its room on a 480×270 `<canvas>` scaled up the same way, with SVG animations for the flames. We use images and HTML because they're simpler and more accessible.)
- [ ] **4.3 Movement.** A character that moves with keyboard, tap, or click, walks to a door, and enters it.
- [ ] **4.4 Room-to-room transitions.**
- [ ] **4.5 Grand clock.** A Da Vinci–style clock that uses `Intl.DateTimeFormat`. The city/time zone is a single setting the owner can change. Hands are rotated by CSS transforms.
- [ ] **4.6 Day/night lighting.** The museum lighting follows the theme picker (1.13, 1.14).
- [ ] **4.7 Accessibility.** "Skip the museum" link, `prefers-reduced-motion`, focusable doors.

## Later (planned, not scheduled)

- The Laboratory: real design based on the `thelab.html` experiment.
- Contact form: a form service (e.g. Formspree) plus a honeypot field against spam bots.
- Filmography: lazy-loaded video embeds (`youtube-nocookie.com`).
- Shared header injected by JS instead of copied (D3 step b).

## Experiments

**🃏 Card stack** (owner, 2026-11-04; **built in 2.0c**, left here as the design note): the home page's featured project as a stack of cards, with the other projects fanned out behind it and peeking at the top-right corner. Clicking a corner brings that card to the front; clicking the front card opens the project. Prototyped in a scratch preview during 2.0.
- **How.** Each card is a `<button>` with `data-pos` (0 = front); CSS places each position with `translate` + `rotate` and `z-index`, so JS only renumbers positions. Reduced motion: no transition. The caption is `aria-live` so screen readers hear the new title.
- **When.** Built in 2.0c as `setupStack(container)`; Phase 3 registers it as a display (`data-display="stack"`).
- **Look.** Trading-card style (owner's references kept in the git-ignored `references/` folder; copyrighted, never committed): name banner, art window, CAD stat column (iterations, parts, print hours, difficulty), type line, text box, version badge, year. Our own frame design, no copied symbols or art.
- **Featured = a JSON flag** (D26): projects with `"featured": true` become cards; the rest stay in the catalog, so the stack never overflows.

**🌆 Dusk theme** (owner asked 2026-11-15, "dusk should be a middle ground"): a true middle colour can't carry today's text. On the halfway grey every text colour fails WCAG (ink 2.8, grey 1.2, links 1.7–2.8); only pure white or black pass (~4.5). A real Dusk would be a third theme with its own roles (all text white, no grey captions, underlined links), like Moss (D36). Parked: the dimmer is frozen until launch; D41 already goes as far toward the middle as contrast allows.

**🪸 Coral highlights** (owner, 2026-11-20; a token option, after launch): a cream page (`--color-cardstock`) with pine text and coral for the highlight role (rings, underlines, markers). Only role tokens change, no page CSS. Check first: the palette's coral, `--color-chochin` #FF7A59, is about 2.4:1 on cream, and rings and underlines need 3:1 (WCAG 1.4.11), so it needs a deeper coral: #D9502E is 3.8:1 (passes for rings and lines, still not for small text). Preview it against today's white + jade.

**🔍 Code Lens**: a magnifying-glass toggle. A circular lens follows the cursor (or a finger on touch screens) and shows the page's *own source code* "underneath" the rendered page, as if seeing through it.
- **Live, not screenshots.** The page fetches its own source (`fetch(location.href)`, plus its CSS/JS files), so the lens is always up to date. Screenshots would go stale after every change.
- **How it's drawn.** A full-page `<pre>` code layer sits on top, and a CSS `clip-path: circle()` that follows the pointer shows only the lens area. Translucency comes from `opacity` / `backdrop-filter`.
- **Security.** The code is inserted with `textContent` (D7), so it's displayed and never run. Same-origin fetch only, which fits CSP `connect-src 'self'`.
- **Accessibility.** Off by default, toggled by a `<button aria-pressed>`, decorative layer `aria-hidden`, respects `prefers-reduced-motion`.
- **Ideas.** Tabs for HTML / CSS / JS. Syntax colors. Style it as a Renaissance brass loupe so it matches the museum. Possibly a museum exhibit in its own right.
- **When.** After Phase 1, once the header has a spot for the toggle. Could live in The Laboratory first.

**🎨 Theme Studio**: a page where you pick fonts and colors from dropdowns (or drop in a theme file) and watch the site restyle live.
- **Step 1, easy (1–2 sessions).** `<select>` and `<input type="color">` controls call `document.documentElement.style.setProperty("--color-accent", value)`. Every page already reads the tokens, so it all updates at once. Fonts are limited to the self-hosted ones.
- **Step 2, easy.** Remember the theme in `localStorage`, and have `script.js` re-apply it on every page (same no-flash issue as 1.14). Changes are **per visitor**, not global.
- **Step 3, medium.** "Download my theme" (a `.css` file built with a `Blob`), and **drag and drop** a theme file back in (`dragover`/`drop` + `FileReader`). Security: never inject the dropped file as raw CSS. CSS can load outside URLs (`url()`, `@import`) and leak data. Read only `--color-*`/`--font-*` lines and check each value (`CSS.supports("color", value)`).
- **Global for everyone, hard, not planned.** That needs a server, a database and a login, or any visitor could restyle (deface) the site for everyone. GitHub Pages is static (D1). The simple global route: export the theme, paste it into `:root`, commit.
- **When.** After Phase 1, in The Laboratory. Pairs with the Code Lens experiment.

**🧲 Drag it out** (owner, 2026-11-06): drag a file straight off the site, onto the desktop or into an app. Inspired by blender.org/lab/mcp-server's "Drag and Drop into Blender" button.
- **How Blender's works.** The button is (as far as the page shows) a plain `<a href>` to the add-on's `.zip`, with extra query parameters: `?repository=https://lab.blender.org/&blender_version_min=5.1.0`. Browsers make every link draggable, and the drag carries the URL (`text/uri-list` / `text/plain`); no JS needed. Blender listens for URL drops: it reads `repository=` (first drop: "add this repository?"), then installs the `.zip` (second drop), and later checks that repository for updates. The magic is on Blender's side, not the web page's.
- **Link onto the desktop: no, not by itself.** Dropping an ordinary link on the desktop makes a *shortcut* to the URL (`.url` on Windows, `.webloc` on Mac), not the file.
- **The real file: `DownloadURL`** (Chrome and Edge only, non-standard). On `dragstart`: `event.dataTransfer.setData("DownloadURL", "application/pdf:resume.pdf:" + new URL(link.href, location.href))` (format `mime:filename:absolute-url`). Dropping on the desktop or a folder then downloads the actual file there. Firefox and Safari ignore it and fall back to a shortcut, so the link must still work as a normal click download (`download` attribute).
- **Built on the contact page** (`feat/contact-drag-out`): the whole title-block card drags out (as a PNG since D30); the résumé button joins in once it points at a real PDF; a keyboard-only link saves the PDF without dragging. **Project kits:** R2c (D32).
- **Security.** Only our own same-site files; build the URL from our JSON paths, never from visitor input; set the right MIME type; strip metadata from anything offered (D15).
- **Testing.** The drag data is checked by script; the actual drop onto a desktop has to be tried by hand (a real mouse drag can't be automated headlessly).

**🧵 MakerWorld import** (owner, 2026-11-07; a separate tool, later): copy your own models from MakerWorld (titles, descriptions, images, print counts) into `projects.json` once, instead of retyping them.
- **Why not live on the site:** MakerWorld has no public API, refused an automated fetch (HTTP 403), and our static site can't read another site's pages anyway (cross-origin rules). So the site keeps a hand-written `makerworld` link per project.
- **Safest way: run it inside your own browser.** A small script you paste into DevTools while logged in on your profile page. It reads what the page already shows and copies JSON. No cookies leave the browser, and there's no bot to block. Rule: only paste code you've read (pasting unknown code is how "self-XSS" scams work).
- **Not recommended:** a standalone app that reads Firefox's cookie file. That file holds your logged-in session: anything that copies it can act as you, and it must never touch the repo. If a separate app is ever needed, use browser automation (e.g. Playwright) where you log in by hand in a visible window.
- **Either way:** it's a one-off, at a gentle pace, and only for your own models. Check MakerWorld's terms first. The output is a draft you review; images get metadata stripped like any photo (D15).

---

## Architecture decisions

| # | Decision | Why |
|---|---|---|
| D1 | Plain HTML/CSS/JS, no framework or build step | Learn the fundamentals first, and nothing to install |
| D2 | One shared `styles.css` plus a per-page file only when needed, named in the owner's style (`projyles.css`, `projcript.js`) | Consistency without one giant file |
| D3 | Header copied into each page now, JS include later | Simplest first; upgrade once JS is comfortable |
| D4 | Pages stay at the repo root; assets go in folders | Short, clean URLs (`/art.html`) |
| D5 | The museum is progressive enhancement over normal pages | Recruiters, screen readers, and SEO still work |
| D6 | Project displays are pluggable via `data-display` | New display types are added without editing old ones |
| D7 | Use `textContent`, never `innerHTML`, for dynamic text | Prevents XSS (script injection) |
| D8 | Owner makes all commits; no AI attribution | The repo history is the owner's, and committing doubles as the review step |
| D9 | Pixel art from found or drawn images, not a canvas | Easier to learn and edit, and doors stay real links |
| D10 | Relative links only, no leading `/` | Work locally, from a subfolder, and on any host |
| D11 | GitHub flow: feature branches, Conventional Commits, PRs into `main` | Industry practice; `main` always works and goes live; PRs are the review step |
| D12 | Self-host fonts (no Google Fonts link) | Faster, no third-party tracking, simpler CSP |
| D13 | `thelab.html` stays standalone for now | It's an experiment and gets its own design later |
| D14 | MIT license for code; `assets/` and written content all rights reserved | Code is open to learn from, and the art and designs stay the owner's |
| D15 | Only self-made or properly licensed images in the repo; metadata stripped | The repo is public: no one else's copyrighted files, and no hidden GPS or personal data |
| D16 | On phones, a picked project docks the carousel as a spinning mini-player | Small screens can't fit the carousel and the info side by side; a familiar pattern keeps the gallery in view while you read |
| D18 | Header links split three and three around a centered logo; the logo is the Home link; "Project Finder" leaves the header until Filmography exists | Seven links on one side wrapped onto three rows even at 1440px; balanced sides make centering honest (same model as dazprojects.com) |
| D19 | Restyle toward dazprojects: white with cool highlights, replacing parchment as the site's day look | The owner prefers a sleek, white, catalog-style look; tokens make it a `:root` swap, not a rewrite. The museum (Phase 4) can keep a Renaissance palette inside its rooms |
| D20 | Color as full-width bands (header sand, footer pine, later page sections); the band is the outer element, `.wrapper` sits inside. Active words only change color plus fake bold, with no background: muted deep jade `#496962` in the light menu (the step from resting pine is about the same size as the footer's step from white to pale blue), kamenozoki `#A5DEE4` on the pine footer, gunjō `#3B5BA5` elsewhere. One color can't be readable on both light and pine. The owner wanted it subtle but noticeable, like the footer | "Vintage Japanese" needs more color than highlights. Bands reach the screen edge while text stays in the column. The owner disliked the box. A color change plus weight change is still visible to keyboard users (WCAG 2.4.7), and fake bold avoids shoving the neighboring links |
| D21 | 70s stripes as a striped `linear-gradient` background on `.site`, scaled with `clamp()`, inset from the window edge, on every screen. `.site-main` gets just enough right padding to keep text clear | The header and footer bands cover the background, so the stripes join both bands with no positioning code. No image or extra HTML. The `max()` padding only grows on screens with no empty margin |
| D22 | Three themes. `color-scheme: light dark` plus `light-dark(Day, Lantern)` on each role token; `:root[data-theme]` forces `color-scheme`, and Moss is one override block. Tokens split into a fixed **palette** (named colors, same in every theme) and **roles** (bg, accent, active…). Night palettes come from a rainy Japanese city at night and Sanzo Wada's *A Dictionary of Color Combinations* (owner's picks after comparing previews) | Each Day/Lantern color is written once, next to its twin, and only Moss repeats values. Role names stay true in every theme (a token called "gunjo" holding orange would mislead). Stripes use palette colors, so they never change. The neon glow is a night-only third shadow in `--faux-bold`. Very old browsers (pre-2024) ignore `light-dark()` and fall back to browser defaults |
| D23 | Theme picker = one `<button>` that cycles 4 states (Auto, Day, Lantern, Moss). Auto removes `data-theme` and the saved value. `js/themcript.js` is external and blocking in `<head>`. The lantern art is only the `<svg>` plus one CSS section | A cycling control is one honest button, so keyboard and screen readers work for free. "Auto" as the absence of a choice lets the OS take over live. External, not inline, so a strict CSP needs no hash. The art is swappable, so the orrery lamp can replace it without touching the logic |
| D24 | Carousel keyboard access: a `<button>` inside each `<figure>` (owner's pick over `tabindex` + `role`). The spin has three separate stop flags (picked figure, Pause button, hover) that `animate()` checks together. The pause button's label changes ("Pause spin" / "Play spin") with no `aria-pressed` | A native button gives Tab, Enter, Space and the "button" role for free (first rule of ARIA). Separate flags stop one reason from cancelling another (leaving with the mouse can't undo the Pause button). A label plus `aria-pressed` would read "Play spin, pressed", which contradicts itself |
| D25 | Home: B split hero + catalog, Blueprint trading cards. The card's paper is a local `--card-paper: light-dark(pine, blueprint blue)`, so it matches the footer by day and is blue in both night themes. Catalog tiles get a retro hard border | Owner's picks after comparing previews. Pine by day ties the card to the footer and the primary button; blue reads as a real blueprint at night. One local variable keeps the choice in one place. Linework passes on both (6.9 / 9.1) |
| D26 | Projects live once in `data/projects.json`; page scripts `fetch()` it and build the HTML with `createElement` + `textContent`. Derived values (card number, `v` badge, stars) are computed, not typed. The carousel moves over in 3.2 | One source of truth: a project typed in three places drifts apart. Building with `textContent` keeps it XSS-safe (D7). Trade-off: content needs JS (a `<noscript>` link covers it) and a local server (`file://` blocks `fetch`) |
| D27 | Refinement (Phase R) before launch: page by page from Home down, five fixed steps per page, and nothing ships untouched (finish, fill or remove). A written launch bar opens Phase L. Phase 3 and 4 wait until after launch | Owner, 2026-11-07, with recruiting as the goal. Recruiters judge a dead link or a grey placeholder more harshly than a page that isn't there. One page at a time keeps each PR reviewable, the same steps each time make progress easy to see, and the launch bar gives the launch postponed on 2026-11-05 a finish line |
| D28 | Footer: one set of markup with two layouts. Phones get labelled groups on a 2-column grid (preview A); from 40rem everything is centered rows with the labels visually hidden (preview B). `display: contents` on `.footer-extras` lets the same wrapper be two grid cells on phones and one dotted row on wider screens | Owner's pick after comparing previews A/B/C. Labels help on a narrow stacked phone footer, where links would otherwise look scattered; on wide screens one centered column matches the dazprojects reference. One markup means the six copied footers stay identical |
| D29 | Home catalog: retro boxes in alternating full-width rows up to 5 projects, a tile grid from 6 (`:has(> li:nth-child(6))`). Each name is an `<h3>` link stretched over its box with `::after` | Owner's pick B after comparing A/B/C. Rows with descriptions read well while there are few projects; a grid keeps many from becoming a long scroll, and pure CSS means adding a project to the JSON is the only step. A stretched name link keeps the box clickable while screen readers hear a short link name, and `<h3>`s let them jump between projects |
| D30 | The contact card drags out as `contact-sheet.png`, a 2× screenshot of the card as it looks by day. The keyboard link keeps the PDF | A picture gets a thumbnail on the desktop; a PDF shows whatever app opens PDFs (Chrome's icon here). PNG, not JPEG: JPEG blurs text and thin lines. The PDF keeps clickable links for anyone who wants them |
| D31 | Project pages: one template, `sheet.html?id=<id>`, filled from `projects.json` | Each project is typed once and there's one more header copy, not one per project. The `id` only looks a project up and goes in with `textContent` (D7). Trade-off: shared links preview the site's title, not the project's; static pages can come later if that matters |
| D32 | Project kits: one `.zip` per project, as the drag payload and a download link. Licence CC BY-NC 4.0, in the kit (code stays MIT, the rest all rights reserved) | `DownloadURL` carries one file per drag, so several files need an archive. A zip can't show a preview: the desktop draws its own icon per file type. CC BY-NC is the common MakerWorld licence: people may print and remix with credit, but not sell |
| D33 | Several images per project in `images[]`, each tagged `cad` or `photo`, in `assets/images/<id>/` | "Modelled → printed and working" side by side is the strongest proof for a recruiter. A folder per project keeps dozens of photos findable; `image` stays the single cover |
| D34 | One `--page-top` token (`clamp(3.75rem, 2.5rem + 2.5vw, 5rem)`) sets where every page's content starts; page files add no top space of their own. The header ornament must fit inside it | Owner's pick B after comparing previews: about the lantern's length, but as a design value of its own. Before, CAD sat at 64px and the rest at 112–130px because each page added its own margin. Reversing the dependency (the lamp fits the gap, not the gap the lamp) means the orrery can replace the lantern without moving any page |
| D35 | The theme picker is a thumbwheel centred under the logo: a ridged drum with the sun and moon printed on it, turned like a volume knob between two ends with three click-stops (Day, Auto, Night). A `<button>` (tap, Enter, Space = next stop) plus drag/flick (pointer events) and ← →; the theme changes when it lands. Labels Auto / Day / Night; the night theme's code name stays `lantern` | Owner's design after previews A–F (an orbit, then a windowed drum, then this). A knob with ends is easy to understand: you can't get lost spinning. A native button keeps keyboard and screen readers working for free. Keeping the code name `lantern` avoids renaming every CSS selector for a label change |
| D36 | The Moss theme is removed: two themes (Day, Lantern) plus Auto. Its colour block is gone from `styles.css`; a visitor who had saved "moss" falls back to Auto, because `readSavedTheme()` only trusts known names | Owner, 2026-11-08. With the orrery holding only a sun and a moon, a third theme had no body of its own. Fewer themes also means half the contrast checks for every change. D22 and D23 stay as the history of why there were three |
| D37 | Brightness slider, option C: only decoration blends with the slider (stars, stripes, sun and moon, footer); the page and the header switch between Day and Night at the halfway point with a short crossfade | Owner's pick after mock-ups A–C with live contrast numbers. Blending everything drops text to 1.1:1 halfway; a safe blend can only dim the day page 12% before grey text fails. The header holds the menu links, so it switches with the page. Every word stays at 4.5:1 or more |
| D38 | The thumbwheel is a smooth dimmer: its position is `--dim` (0 Day to 1 Night) on `<html>`. The stripes (toward their inverted colours, mixed `in oklch`), the stars, the footer and the white drum (at least a third of the screen wide) follow it; the page and header switch at halfway (D37). Tap: Auto, Day, Night; drag: any level; arrows: a tenth. Saved as `theme` plus `theme-level` | Owner's pick after mock-ups C and D: keep the wheel, not a stripe slider, but make it a real dimmer with interpolated colours. One CSS variable keeps every blend in the stylesheet; the script only sets a number. OKLCH keeps the stripes colourful halfway (sRGB went grey). The CSSOM `style.setProperty` stays allowed under a strict CSP |
| D39 | The CAD carousel reads `projects.json` (3.2's data half, pulled forward) and is drawn as a drawing sheet like the entries: framed ring, small sheets with crop-marked viewports and DWG labels, blank paper backs, a light summary popup; the ring is pushed back by its radius so the front sheet shows at true size. Under 6 projects the list repeats (copies `aria-hidden`, out of the Tab order) | Owner, 2026-11-10: the carousel should match the projects below. One source of truth ends the placeholders and empty popups. Preview A (3 sheets) became a prism showing one sheet at a time and overflowed on phones; B keeps a ring (owner's pick). Frame and crop marks are shared selectors, not copies, so the two can't drift |
| D40 | The Code page becomes a catalog built from `data/code.json` (like D26): every project a flip card that grows to two columns when opened (preview A), bigger ones in a featured row first, private repos shown without a Source link. The cards are cream card stock in both themes (paper preview A) | Owner, 2026-11-10: "load all of em". 20+ projects as hand-copied HTML would drift and break; one JSON entry per project is easy to review. Small fronts keep a long list short; growing on open leaves room for the full entry (B's same-size back was too cramped). A link to a private repo is a 404 for visitors. Replaces the plain-HTML pick from 2.3 |
| D41 | (Colours superseded by D43; the dusk drift itself stays.) The dimmer moves the whole page: the background drifts toward dusk on each side of halfway (white to `#E6EBF0`, then `#1E2B36` to asphalt), mixed in OKLab; it still flips at halfway (D37). The night footer is ai indigo `#1F3F5F` (was akabeni red), mixed with pine in OKLCH | Owner, 2026-11-15: the page stood still while the stripes and footer moved, which read as broken. Each dusk colour is the furthest grey text still passes 4.5:1. OKLab because white has no hue, and an OKLCH mix drew it pink; OKLCH for the footer so pine to indigo goes through teal, not the sRGB mud. Indigo matches the starry night header (owner's pick C of three blues) |
| D42 | Browse Art is built from `data/art.json` by `js/artcript.js`; a local script, `tools/art.py`, writes the JSON from the photos in `assets/images/art/` and strips their EXIF/GPS. Visitors can reorder the frames (drag, press-and-hold on touch, Alt + arrows), Shuffle and Reset; the order is kept per device. Frame wood and tilt belong to the piece, not the position | Owner, 2026-11-15: the wall should "build as photos are added", and frames move "like a to-do list". A static host can't list a folder, so something must write the list; a script run before committing also makes stripping location data automatic. Pointer Events cover mouse, pen and touch in one code path; a hold-to-pick-up on touch keeps scrolling. Looks stamped per piece so a dragged frame doesn't change its wood mid-move. A pinboard was prototyped and declined |
| D43 | Daz-style colours (owner's pick A after comparing Today/A/B/C): Day keeps pine and the menu colours but the header band is white with a hairline (no sand); Night is a greyscale gallery (`#121212` page, white text and links, charcoal footer, no stars or glow) where only objects keep colour (cards, pictures, status dots). The stripes fade from colour to five greys as the dimmer turns. The dimmer is compact (`max(7rem, 12vw)`, was 45vw). The logo is near-white at night | Owner, 2026-11-15: "still not very professional". dazprojects gets its calm from black, white and grey, with colour only in the content. Pine stays as the one brand colour by day (owner: "the green is nice"). The stripes stay as the signature but quiet down at night (owner's idea). Supersedes D22's rainy-street night, D41's indigo footer and blue dusk tints. All text pairs measured: lowest 4.9 (grey on the day dusk tint) |
| D44 | About is a short first-person story (owner's pick B after previews A/B): photo, Origin / Now / Next, a photo row, one pull quote, the facts at the end; the trading card opens in an HTML `popover`. Site-wide, Cinzel is for page titles only; `h2`/`h3` use the body font, and a heading that wants Cinzel asks by class | Owner, 2026-11-16: daz's professionalism first. daz's About is short sections and photos, with nothing boxed. The encyclopedia layout said the name four times and repeated the nav and footer. The card stays (owner) without crowding the text; `popover` gives Esc, click-outside and the top layer with no JS, so nothing to load or allow in the CSP. One display font on one element per page makes the title the thing that stands out |
| D45 | Corners, motion and caps spacing are tokens: `--radius-soft` 6px (photos, floating panels), `--radius-pill`, three speeds (150 / 300 / 450ms), `--tracking-caps` 0.08em. A value used on one page by one thing stays a local page token | The same number typed in 6–9 places drifts (250ms here, 300ms there), and a page-level token is invisible to an element outside its box (the popover's square corners). Three speeds are enough to tell "respond", "move" and "glide" apart |
| D46 | Floating panels are sized by rule, not by eye: width = `min(φ × height, window − stripe clearance on both sides)`, where the height comes from the content and the clearance is the stripes' gap + the stripes + `--space-4`. Centred, so both sides match | Owner, 2026-11-16: a full-width band over the stripes looked wrong (a 3:1 strip crossing the page's signature). φ already sets other spacing (`--golden`); the clearance keeps the stripes uncovered at every width, and min() hands over to it on phones |
| D52 | Home = the mixed mosaic (the range: CAD + photography) with a quiet row into CAD; the flip cards live in a slide-open drawer there (a popover for one round: the owner wanted it to push the page down, not cover it). The CAD page is the complete recruiter page: carousel, an index of clean tiles, then the write-ups | Owner, 2026-11-24: recruiters get the CAD page link directly, so that page must stand on its own; the mosaic "just looks visually pleasing" mixed, and splitting it by kind made bands that didn't match. The drawer keeps the cards one click away without taking the first screen. Rejected: the stack as Home's hero again (A, pushes the mosaic down), the stack as a big mosaic tile (C, the CAD door becomes the smallest thing) |
| D55 | Pages cross-fade into each other with a cross-document View Transition (`@view-transition { navigation: auto }` in styles.css): CSS only, no script, no library | Owner, 2026-11-26: "smooth the transition between pages, like going from Code to CAD". The browser does the work and Firefox just jumps as before, so nothing breaks. A single-page app or a JS router would fade too, but the site would stop being plain pages. A zoom "into" the clicked object was skipped: it needs the old page's click point carried to the new page |
| D54 | The Code page is a pixel-art workshop (O8): a forge room by day (the night lab comes in O8f), every object a shelf of projects, then a viewer and one sortable table. The flip cards are retired. The art is drawn in code and credited on the page | Owner, 2026-11-25: Ash Anand's room where "all sprites lead somewhere", a fantasy workshop with their real tools (3D printers, blacksmithing, leather). Research (`references/reports/Pixel workshop scenes for Code page.md`) backed a room on top of a normal page with a text list, one light source, whole-number scaling. Free asset packs were rejected: mixed pixel sizes and palettes are the clearest sign of fake pixel art. Rejected: keeping the flip cards under the room (two ways to browse the same 28 projects) |
| D53 | The footer is a slim pine band again (charcoal at Night), centred, with the stripe mark shrunk under the name on the © line (owner's pick E1). Pine stays the one brand colour; the golden-angle partners were tested and kept in reserve: walnut `#584738` (pine's hue −137.5°, same saturation and lightness) and indigo `#3D3858` (−275°) | Owner, 2026-11-24: "looking back to the pantone pine colour", the mark "small and under my name", a slimmer bar. A band closes the page the way the header opens it; the plain line (D51) didn't. Walnut as the band brought in a new colour on a white-pine-photos site (E3); it may come back as a second accent on the Code page (O7). The white-start option (E4) was the calmest but didn't close the page |
| D51 | The launch freeze (D47) is lifted for an overhaul toward brittanybravo.com: a centred text header, no drum, the stripe cut down or removed, sans headings, Home as a grid of the work. The CAD carousel stays as the one signature | Owner, 2026-11-23, after the declutter pass: the reference's professionalism is the work starting right under a one-line header. Cost: launch moves later, and the drum's smooth dimmer (D35-D38) becomes a 3-step button. Content is still the other half: grey renders and dark photos can't carry colour on their own |
| D50 | Design direction: **minimal chrome, maximal content.** The interface keeps one signature (the stripes) and as few colours, boxes and controls as it can; colour and layout variety come from the work (photos, renders, screenshots). First pass: D Declutter | Owner, 2026-11-23: "minimalist with maximalist tendencies". The references (dazprojects, brittanybravo, ashanand, joeydanna) all keep the frame neutral and let the work carry the colour; our pages had frames inside frames and a footer that repeated the header |
| D49 | Art masonry = CSS grid with 4px rows, and each photo spans N rows (N = its height, set by a `ResizeObserver` in `artcript.js`). Auto-placement drops each photo into the first free spot (in effect the shortest column), so page order = reading order = drag order. Without JS: the plain row grid (`.is-masonry` is only added by the script). **Revisit** when native masonry (`display: grid-lanes`) works in every browser we target: then it's CSS only | Owner, 2026-11-22: "cleanly laid out chaotically", like brittanybravo.com. Rejected: CSS `columns` (order runs down each column, so dragging and Tab jump around), native masonry (not in every browser yet), a masonry library (a dependency, and absolute positioning fights the drag code). Cost: ~15 lines of JS and one observer |
| D48 | The freeze (D47) is amended: R4e, an Art page redesign, joins the launch scope. Researched first (three references: brittanybravo.com as the main aesthetic, seifkousmate.com, lindseywernli.com), then lettered previews, then a build in small commits | Owner, 2026-11-20: "the photo area is not ready for launch". With real photos in, the gilded, tilted salon frames fought the pictures; all three references show photos with nothing around them |
| D47 | Launch freeze: only Phase L, X8, fixes and content until launch. Pages goes on early as an unshared staging site with `noindex`; launch = removing the tag. lychee, pa11y-ci and Lighthouse CI run on every PR. PRs stay at about 5 files | Owner, 2026-11-20, after a 700-line PR was merged in 92 seconds. Testing on the real URL catches what local screenshots can't (real phones, paths in a subfolder). The checks catch dead links and contrast slips that a quick review misses. Small PRs are the only ones a person actually reads |
| D17 | Skeleton and layout are separate PRs; keep the `#page` wrapper; the width cap is a reusable `.wrapper` class; two `rem` breakpoints | Smaller reviews; respects the owner's structure; a class can be reused, and the carousel can skip it when it needs more width; breakpoints give more control than fluid sizing alone |

## Open questions

- Pixel art source: which asset packs? Check licenses (CC0 is safest) at Phase 4.1.
- Which pixel font, accent color, and Renaissance palette?
- "Old school" = **both** (owner, 2026-11-03): the plain daz catalog as the base, plus retro details. 1.12c added the bands and 70s stripes. More details (monospace labels and so on) are decided in R1 (was 2.7).
