# TODO

*Rebuilt from PLAN.md on 2026-11-16. Edit PLAN.md, then ask Claude to rebuild this.*

## Now (branch `feat/refine-about`)
- [ ] Open About (`aboutme.html`) in Day and Night, phone and desktop: story layout, photo slots, "At a glance" list.
- [ ] Press "Profile card": a golden-ratio panel opens, centred and clear of the stripes; Esc, a click outside, or Close shuts it. Try it on your phone too.
- [ ] Glance at CAD (`projects.html`): entry titles are still Cinzel, and "All projects" has a gap above the first sheet.
- [ ] Hover a few things on Home, Art and Code: they move at the same pace as before (times now come from `--speed-*`).
- [ ] Commit, push and open the PR (commands in Claude's hand-off).

## Owner: content (✱ blocks launch)
- [ ] ✱ Add the four About photos (hero, toboggan, shop, printed part) to `assets/images/about/`, run `python tools/art.py --clean assets/images/about`, then set `src`, `alt`, `width`, `height` in `aboutme.html` (README "Add About photos").
- [ ] ✱ Rewrite the About text in your voice; replace the drafted "Next" paragraph (`aboutme.html`).
- [ ] ✱ Add your art: photos into `assets/images/art/`, run `python tools/art.py`, then fix titles, details and `TODO` alt text in `data/art.json`.
- [ ] ✱ Write the Art intro line (`art.html`).
- [ ] ✱ Re-export the CAD renders square, same angle, same background (`assets/images/`).
- [ ] ✱ Give real stats for End Stop Cap and Latch Hinge in `data/projects.json`, or trim them to what's true.
- [ ] ✱ Write the CAD page intro (2 lines) and tab title (`projects.html`).
- [ ] ✱ Rewrite the Code intro and the drafted one-liners in your words (`code.html`, `data/code.json`).
- [ ] ✱ Confirm each Code project's status, and set `"handWritten": true` on the ones written before AI (`data/code.json`).
- [ ] Add a portrait to the Profile card (`aboutme.html`, the card's `placeholder.svg`).
- [ ] Take CAD photos: hero, in use, close-up, scale, iteration lineup (strip with `tools/art.py --clean`).
- [ ] Write CAD notes per project: the problem, what changed per version, print settings; MakerWorld links.
- [ ] Draw the sun and moon sprites for the dimmer (1.14c, ~22 × 22 px, PNG or SVG).
- [ ] Write a README for AUDA (its Code card links to the repo).

## Owner: decisions and checks
- [ ] ✱ Confirm the About tool years (6/6/5 are estimates) and "CAD since 2019" (university began 2020).
- [ ] Confirm what you're looking for (About "Next" and Contact): internships, or design and fabrication roles?
- [ ] Decide X4 in R6: Contact's empty space at desktop width.
- [ ] Decide whether CL Buddy stays on the Code page (its code says it copies a leaked feature).
- [ ] Mirror the résumé edits in the Google Doc master, so the next export matches.
- [ ] Check the CAD carousel's front sheet isn't "hazy" on a real screen (R2d).

## Next for Claude (in PLAN order)
- [ ] X8 previews: one button style for the whole site (then a shared class).
- [ ] X9 preview: centre the Home hero text beside the card stack.
- [ ] R6 Contact & Résumé audit (`contact.html`), including X4.
- [ ] R7 "How to add content" in README (projects, art and About photos exist; add CAD photos and the image rules).
- [ ] L1 launch basics: page titles, favicon, Open Graph tags, `.nojekyll`.
- [ ] L2 security: CSP `<meta>`, `rel="noopener noreferrer"`, `innerHTML` audit, a plain `404.html`.

## Launch bar (all true before the link goes out)
- [ ] Phase R done: every nav link leads to a refined page, or the link is gone.
- [ ] Real name, email, résumé and GitHub. No made-up project facts.
- [ ] L1 and L2 merged; validator 0 errors; Lighthouse accessibility and a real-phone test pass on the live URL.
- [ ] L3 (you): GitHub Pages on, plus secret scanning, push protection, Actions read-only, wiki off, auto-delete head branches.

## Git
- On `feat/refine-about`, cut from `main` (in sync with `origin/main`: 0 ahead, 0 behind). Nothing committed yet.
- Changed: `aboutme.html`, `index.html`, every file in `css/`, `tools/art.py`, `PLAN.md`, `README.md`, `CLAUDE.md`, `TODO.md`.
- Next step: the four commits in Claude's hand-off, then push and open the PR.
