# TODO

*Rebuilt from PLAN.md on 2026-11-20. Edit PLAN.md, then ask Claude to rebuild this.*

**Launch freeze (D47):** only Phase L, X8, fixes and your content until launch. PRs stay at about 5 files.

## Now (branch `chore/launch-prep`)
- [ ] Read the diff of `.gitattributes`, `PLAN.md` and `TODO.md` before committing (`git diff`, then `git diff --cached`).
- [ ] Commit, push and open PR 1; merge only after reading it on GitHub's "Files changed" tab.

## Owner: content (✱ blocks launch: this is the critical path)
- [ ] ✱ Re-export the CAD renders square, same angle, same background (`assets/images/`).
- [ ] ✱ Give real stats for End Stop Cap and Latch Hinge in `data/projects.json`, or trim them to what's true.
- [ ] ✱ Write the CAD page intro (2 lines) and tab title (`projects.html`).
- [ ] ✱ Add the four About photos to `assets/images/about/`, run `python tools/art.py --clean assets/images/about`, then set `src`, `alt`, `width`, `height` in `aboutme.html` (README "Add About photos").
- [ ] ✱ Rewrite the About text in your voice; replace the drafted "Next" paragraph (`aboutme.html`).
- [ ] ✱ Add your art: photos into `assets/images/art/`, run `python tools/art.py`, then fix titles, details and `TODO` alt text in `data/art.json`.
- [ ] ✱ Write the Art intro line (`art.html`).
- [ ] ✱ Rewrite the Code intro and the drafted one-liners (`code.html`, `data/code.json`); confirm each status and `"handWritten": true`.
- [ ] Add a portrait to the Profile card (`aboutme.html`).
- [ ] Take CAD photos and write per-project notes; add MakerWorld links (`data/projects.json`).
- [ ] Draw the sun and moon sprites for the dimmer (1.14c, ~22 × 22 px).
- [ ] Write a README for AUDA (its Code card links to the repo).

## Owner: decisions and checks
- [ ] ✱ Confirm the About tool years (6/6/5 are estimates) and "CAD since 2019" (university began 2020).
- [ ] Confirm what you're looking for (About "Next" and Contact): internships, or design and fabrication roles?
- [ ] Decide X4 in R6: Contact's empty space at desktop width.
- [ ] Decide whether CL Buddy stays on the Code page (its code says it copies a leaked feature).
- [ ] Mirror the résumé edits in the Google Doc master, so the next export matches.
- [ ] Open the About popover on a real phone (left over from #36).
- [ ] L3a (you, after L1 merges): turn on GitHub Pages from `main` as unshared staging.

## Next for Claude (in PLAN order)
- [ ] L1 `chore/launch-basics`: page titles, favicon, Open Graph tags, `.nojekyll`, `noindex` until launch.
- [ ] L2 `feat/csp-404`: CSP `<meta>`, `rel="noopener noreferrer"`, `innerHTML` audit, a plain `404.html`.
- [ ] L4a `ci/site-checks`: lychee, pa11y-ci and Lighthouse CI in the GitHub workflow.
- [ ] X8 `feat/buttons`: previews, then one shared `.button` class.
- [ ] R6 Contact audit (including X4) and R7 "How to add content" in README.

## Launch bar (all true before the link goes out)
- [ ] Phase R done: every nav link leads to a refined page, or the link is gone.
- [ ] Real name, email, résumé and GitHub. No made-up project facts.
- [ ] L1 and L2 merged; validator 0 errors; the L4a checks pass; a real-phone test passes on the live URL.
- [ ] L3 (you): `noindex` removed, plus secret scanning, push protection, Actions read-only, wiki off, auto-delete head branches.

## Git
- On `chore/launch-prep`, cut from `main` (in sync with `origin/main`: 0 ahead, 0 behind).
- Changed: `.gitattributes` (new), `PLAN.md`, `TODO.md`. Nothing committed yet.
- Next step: the two commits in Claude's hand-off, then push and open PR 1.
