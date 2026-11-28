# TODO

*Rebuilt from PLAN.md on 2026-11-28. Edit PLAN.md, then ask Claude to rebuild this.*

**Live as staging:** https://nottco.ca (`noindex` until the launch bar below is met).

## Now (branch `feat/o6-pass`, roadmap 1.5: About)
- [ ] Look it over at http://localhost:8000: the new About text and At a glance, Art's 10 new photos and Travel wall, the funnel on CAD (carousel, list, Home).
- [ ] Commit, push, open the PR, merge (commands in Claude's hand-off). Done when nottco.ca shows the funnel.
- [ ] Re-render the funnel on grey (Fusion: Render, Scene Settings, Background, Solid color, RGB 178), save it over `assets/images/parametric-funnel/funnel-render.png`, run `python tools/render.py assets/images/parametric-funnel/funnel-render.png`.

## Owner: ingredients (✱ blocks launch: send these and Claude fits them in)
- [ ] About: pick lead A, B or C (B and C wait in a comment above the lead in `aboutme.html`), and confirm the tool years in At a glance (6/6/5 are estimates).
- [ ] About: check the row's captions and alt text (is the makerspace photo you?). Art: the bike's year, if you know it.
- [ ] Art: the years of the three sketchbook pages (2026 is when they were photographed), where Green Flames was shot, and whether the Iron Giant fan drawing stays (credited to the 1999 film).
- [ ] Optional: re-shoot the roses page in even light (no shadow) and send it.
- [ ] ✱ CAD: for each project, the true facts only: year, versions, parts, print time (no filament yet). The funnel has none yet.
- [ ] CAD: the MakerWorld page address of each project, later, if you still link them (the MakerWorld button only shows when there's an address).
- [ ] ✱ CAD: square renders, 1600 x 1600, same angle, grey RGB 178, then `tools/render.py`. Plus a photo of each part in use, in `assets/images/<id>/`.
- [ ] ✱ CAD: which MakerWorld models join the page (shortlist: LEGO brick, Magnetic Backgammon v2, Mini Parallettes, Camera "Tripod", UV Curing Station, Geoboard), then each one's files (README, "What to gather first").
- [ ] Art: check the draft titles of the 10 new photos in `data/art.json` (Eye of gears, Reaching hand, Safety first...).
- [ ] CAD: a drawing sheet per project (PNG + PDF, README "Add a project"), and MakerWorld numbers for published ones (README "Update MakerWorld numbers").
- [ ] About: certifications once you hold them (issuer, title, date, verification link).
- [ ] Optional: re-straighten Gaura and bumblebee (Photos: Edit, Vertical / Straighten), more Art photos, the Red Wings sculptor's name, an AUDA README.

## Owner: decisions and checks
- [ ] MakerWorld updater (D63 accepted, P6): save your profile page and one model page (Ctrl+S, "Webpage, complete") into `references/`, and read MakerWorld's terms on automated access.
- [ ] Home cards: keep difficulty on them, or drop it as on the CAD page?
- [ ] Read the six page descriptions (each page's `<head>`); change any you'd say differently.
- [ ] Résumé: add GitHub to the PDF (it links MakerWorld and email only).
- [ ] Click **Verify** for nottco.ca again (GitHub: profile, Settings, Pages).

## Next for Claude (in PLAN order)
- [ ] 1.5 part 2 on `feat/o6-text`: O6 text pass on Contact and Code to match About.
- [ ] 1.6 L4a automatic checks (links, accessibility, Lighthouse) on every PR (`ci/site-checks`).
- [ ] 1.7 R7 "How to change things" in README (`docs/how-to`).
- [ ] 1.9 (after launch) P6 `tools/makerworld.py`, once the MakerWorld addresses and saved pages are in.
- [ ] After launch: workshop (tower roof, night lab, sound, Loft), then Phase P (CAD downloads, Code Lens, Bookshelf, CL Buddy, Shop, Print queue).

## Launch bar (all true before the link goes out)
- [x] Every nav link leads to a finished page; no placeholder pictures left (About row done 2026-11-28).
- [ ] No made-up project facts (CAD stats).
- [x] L1b and L2 built; validator 0 errors.
- [ ] Lighthouse accessibility and a real-phone test pass on nottco.ca.
- [ ] L3 (you): remove `noindex` (its own PR), then secret scanning, push protection, wiki off, auto-delete head branches.

## Git
- On `feat/o6-pass`, cut from `main` after #51; `main` matches `origin/main` (0 ahead, 0 behind).
- Uncommitted: 16 changed files, 14 new photos and renders, `tools/render.py`. Next: the commands in Claude's hand-off.
