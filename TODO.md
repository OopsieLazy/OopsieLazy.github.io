# TODO

*Rebuilt from PLAN.md on 2026-11-27. Edit PLAN.md, then ask Claude to rebuild this.*

**Live as staging:** https://nottco.ca (`noindex` until the launch bar below is met).

## Now (branch `fix/plain-separators`, roadmap 1.1 + 1.2 in one PR: at its size limit)
- [ ] Look over the branch at http://localhost:8000: Home at full width, the Code credit button, About's years, the contact sheet. Then commit, push and open the PR.
- [ ] Click **Verify** for nottco.ca again (GitHub: profile, Settings, Pages). Done when it says verified.

## Owner: content (✱ blocks launch: this is the critical path)
- [ ] ✱ CAD stats in `data/projects.json`, daz style: only what's true (print time, parts, filament, difficulty, what's included).
- [ ] ✱ Re-export the CAD renders square, same angle, same background (Fusion: File, Capture Image, 1600 x 1600).
- [ ] ✱ Pick the 3 to 6 strongest CAD projects: name, year, what it does, versions, parts, print time, MakerWorld link.
- [ ] ✱ Add the four About photos to `assets/images/about/`, run `python tools/art.py --clean assets/images/about`.
- [ ] ✱ Rewrite the About text in first person; one one-line description for About, Home and the footer.
- [ ] ✱ Rewrite the Code intro and the one-liners (`data/code.json`); confirm each status.
- [ ] ✱ Art: titles come from file names now: rename a file and run `python tools/art.py` to rename a picture (its alt text then needs writing again); one Art intro line.
- [ ] Add GitHub to the résumé PDF (it links MakerWorld and email only); mirror it in the Google Doc master.
- [ ] Photos of printed parts (in use, close-up, next to something for scale).
- [ ] Write a README for AUDA (the Code page links to it).
- [ ] Travel photos tagged `"area": "Travel"` (then the workshop globe can link to them).

## Owner: decisions and checks
- [ ] ✱ Review the new CAD page (A2 + A1) at desktop and phone width; add `"makerworld"` links to `data/projects.json`.
- [ ] Pick the motion control for Pause spin (CAD) and Pause motion (Code): M1 Words, M2 Transport keys, M3 Panel lamp, M4 Turning dial.
- [ ] Red wings: if you have the suite's name or a plaque photo, the sculptor can be credited by name.
- [ ] Art journals wall: rename it "Paintings and journals" now the rose is there?
- [ ] ✱ Confirm the About start years: Fusion 2019, SolidWorks 2020, Python 2020, CNC 2021, CAD since 2019.
- [ ] Test every page on your phone at nottco.ca (private tab after each deploy).

## Next for Claude (in PLAN order)
- [ ] 1.3 O3 sans headings + X8 one button style + the picked motion control (theme switch already built).
- [ ] 1.4 L1b share tags + L2 `404.html`.
- [ ] 1.5 O6 light pass: About, Contact, Code text.
- [ ] 1.6 L4a automatic checks. 1.7 R7 "How to change things" in README.
- [ ] After launch: workshop (tower roof and observatory, scroll switch, night lab, sound, Loft), then Phase P (Code Lens, Bookshelf, CL Buddy terminal, Shop, Print queue).

## Launch bar (all true before the link goes out)
- [ ] Phase R done: every nav link leads to a finished page, or the link is gone.
- [ ] No made-up project facts; real name, email, résumé and GitHub (done).
- [ ] L1b and L2 merged; validator 0 errors; a real-phone test passes on nottco.ca.
- [ ] L3 (you): remove `noindex` (its own PR), then secret scanning, push protection, wiki off, auto-delete head branches.

## Git
- On `fix/plain-separators`, cut from an up-to-date `main` (0 ahead, 0 behind `origin/main`).
- Uncommitted: 25 changed files and `thelab.html` deleted (staged by `git rm`).
- Next step: the commands in Claude's hand-off.
