# TODO

*Rebuilt from PLAN.md on 2026-11-27. Edit PLAN.md, then ask Claude to rebuild this.*

**Live as staging:** https://nottco.ca (`noindex` until the launch bar below is met).

## Now (branch `feat/buttons`, roadmap 1.3 X8 + 1.4)
- [ ] Look over the branch at http://localhost:8000: square buttons everywhere, `404.html`, the share picture. Then commit, push, open the PR, merge.
- [ ] After merging, paste https://nottco.ca into a chat app to see the link preview.
- [ ] Click **Verify** for nottco.ca again (GitHub: profile, Settings, Pages).

## Owner: ingredients (✱ blocks launch: send these and Claude fits them in)
- [ ] ✱ CAD: for each project, the true facts only: versions, parts, print time (filament is left out for now).
- [ ] ✱ CAD: the MakerWorld page address of each project that has one.
- [ ] ✱ CAD: square renders, 1600 x 1600, same angle and background (Fusion: File, Capture Image), plus a photo of each part in use. Drop them in `assets/images/<id>/`.
- [ ] CAD: a drawing sheet per project (PNG + PDF, README "Add a project"), and MakerWorld numbers for the ones that are published (README "Update MakerWorld numbers").
- [ ] About: certifications once you hold them (issuer, title, date, verification link).
- [ ] ✱ CAD: say which MakerWorld models join the CAD page (shortlist: Parametric Funnel, LEGO brick, Magnetic Backgammon v2, Mini Parallettes, Camera "Tripod", UV Curing Station, Geoboard), then gather each one's files (README, "What to gather first").
- [ ] Home cards: keep difficulty on them, or drop it as on the CAD page?
- [ ] ✱ About: four photos of you or your work, and the About text rewritten in your own words (or approve the draft as is).
- [ ] Art: more photos if you have them (straight from the phone).
- [ ] Read the six page descriptions Claude wrote (in each page's `<head>`); change any you'd say differently.
- [ ] Résumé: add GitHub to the PDF (it links MakerWorld and email only).
- [ ] Optional: printed parts in use, travel photos (`"area": "Travel"`), the Red Wings sculptor's name, an AUDA README.

## Next for Claude (in PLAN order)
- [ ] 1.5 O6 text pass on About, Contact and Code (with the owner's words above).
- [ ] 1.6 L4a automatic checks (links, accessibility, Lighthouse) on every PR.
- [ ] 1.7 R7 "How to change things" in README.
- [ ] After launch: workshop (tower roof and observatory, night lab, sound, Loft), then Phase P (Code Lens, Bookshelf, CL Buddy terminal, Shop, Print queue).

## Launch bar (all true before the link goes out)
- [ ] Every nav link leads to a finished page (done), no placeholder pictures left (About photos).
- [ ] No made-up project facts (CAD stats).
- [x] L1b and L2 built; validator 0 errors.
- [ ] A real-phone test passes on nottco.ca.
- [ ] L3 (you): remove `noindex` (its own PR), then secret scanning, push protection, wiki off, auto-delete head branches.

## Git
- On `feat/buttons`, cut from an up-to-date `main` after #50.
- Next step: the commands in Claude's hand-off.
