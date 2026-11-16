# TODO

*Rebuilt from PLAN.md on 2026-11-15. Edit PLAN.md, then ask Claude to rebuild this (the `todo-list` skill).*

## Now (branch `fix/night-colours`, to be renamed `feat/art-wall`)
- [ ] Look at every page at Night (greyscale) and Day (white header band), and drag the compact dimmer slowly: the stripes should fade from colour to greys, the footer from pine to charcoal.
- [ ] Open a CAD sheet (projects.html): the full picture should grow in at the top of the popup, and the frame grow to hold it.
- [ ] Try Browse Art: drag a frame, press-and-hold on your phone, Alt + arrow keys, Shuffle, Reset; reload and the order stays.
- [ ] Rename the branch, commit, push and open the PR (commands in Claude's hand-off).

## Owner: content (✱ blocks launch)
- [ ] ✱ Add your art: photos into `assets/images/art/` (`journal-…` or a name with the year), run `python tools/art.py`, then fix titles, details and `TODO` alt text in `data/art.json`.
- [ ] ✱ Write the Art intro line (`art.html`).
- [ ] ✱ Re-export the CAD renders square, same angle, same background (`assets/images/`).
- [ ] ✱ Give real stats for End Stop Cap and Latch Hinge in `data/projects.json`, or trim them to what's true.
- [ ] ✱ Write the CAD page intro (2 lines) and tab title (`projects.html`).
- [ ] ✱ Rewrite the Code intro and the drafted one-liners in your words (`code.html`, `data/code.json`).
- [ ] ✱ Confirm each Code project's status, and set `"handWritten": true` on the ones written before AI (`data/code.json`).
- [ ] Take CAD photos: hero, in use, close-up, scale, iteration lineup (`tools/art.py` style: EXIF/GPS stripped).
- [ ] Write CAD notes per project: the problem, what changed per version, print settings; MakerWorld links.
- [ ] Add a card photo to About (`aboutme.html`).
- [ ] Draw the sun and moon sprites for the dimmer (1.14c, ~22 × 22 px, PNG or SVG).
- [ ] Write a README for AUDA (its Code card links to the repo).

## Owner: decisions and checks
- [ ] Decide whether CL Buddy stays on the Code page (its code says it copies a leaked feature).
- [ ] Confirm the About tool years (6/6/5 are estimates) and "CAD since 2019".
- [ ] Confirm what you're looking for on Contact: internships, or design and fabrication roles?
- [ ] Mirror the résumé edits in the Google Doc master, so the next export matches.
- [ ] Check the CAD carousel's front sheet isn't "hazy" on a real screen (R2d).

## Next for Claude (in PLAN order)
- [ ] R5 About Me audit (`aboutme.html`).
- [ ] R6 Contact & Résumé audit (`contact.html`).
- [ ] R7 "How to add content" in README (Add a project and Add art exist; add photos and the image rules).
- [ ] L1 launch basics: page titles, favicon, Open Graph tags, `.nojekyll`.
- [ ] L2 security: CSP `<meta>`, `rel="noopener noreferrer"`, `innerHTML` audit, a plain `404.html`.

## Launch bar (all true before the link goes out)
- [ ] Phase R done: every nav link leads to a refined page, or the link is gone.
- [ ] Real name, email, résumé and GitHub. No made-up project facts.
- [ ] L1 and L2 merged; validator 0 errors; Lighthouse accessibility and a real-phone test pass on the live URL.
- [ ] L3 (you): GitHub Pages on, plus secret scanning, push protection, Actions read-only, wiki off, auto-delete head branches.

## Git
- On `fix/night-colours`, cut from `main` (in sync with `origin/main`: 0 ahead, 0 behind). Nothing committed yet.
- Changed: `CLAUDE.md`, `PLAN.md`, `README.md`, `TODO.md`, `art.html`, `css/artyles.css`, `css/styles.css`, `projects.html`, `css/projyles.css`, `js/projcript.js`.
- New: `REFERENCES.md`, `TODO.md`, `.claude/skills/todo-list/`, `data/art.json`, `js/artcript.js`, `tools/art.py`.
- Next step: rename the branch, then the commits in the hand-off.
