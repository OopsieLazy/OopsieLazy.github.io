---
name: todo-list
description: Rebuild TODO.md, the short action list for this portfolio, from PLAN.md and git. Use when the owner asks for a to-do list, "what's left", "what do I need to do", or at the end of a session after PLAN.md's notes are updated.
---

# todo-list

`TODO.md` is a **view** of `PLAN.md`, not a second plan. PLAN.md stays the source of truth
(roadmap, decisions, details); TODO.md is the one-screen answer to "what do we do next, and who
does it". Rebuild it from scratch every time instead of editing it by hand, so the two can't drift.

## Steps

1. Read `PLAN.md`: the "Where we left off" section, every unchecked `[ ]` / in-progress `[~]`
   task in the current phase (Phase R) and the next one (Phase L), every **Owner content** line
   (✱ marks a launch blocker), and the **Launch bar**.
2. Run `git status --short` and `git branch --show-current`, and compare `main` with
   `origin/main` (`git fetch --prune`, then `git rev-list --left-right --count main...origin/main`).
3. Write `TODO.md` in the format below. Every item is ONE line, starts with a verb, names the
   file or page, and ends with how to tell it's done when that isn't obvious.
4. Keep it under ~70 lines. Anything that doesn't fit belongs in PLAN.md, not here.
5. Tell the owner what changed since the last TODO.md (new, done, moved), in two or three lines.

## Format

```markdown
# TODO

*Rebuilt from PLAN.md on YYYY-MM-DD. Edit PLAN.md, then ask Claude to rebuild this.*

## Now (branch `name`)
- [ ] ...

## Owner: content (✱ blocks launch)
- [ ] ✱ ...

## Owner: decisions and checks
- [ ] ...

## Next for Claude (in PLAN order)
- [ ] ...

## Launch bar (all true before the link goes out)
- [ ] ...

## Git
- Branch, uncommitted files, ahead/behind `origin/main`, and the next git step for the owner.
```

## Rules

- Never record dice rolls (CLAUDE.md).
- Don't invent tasks. If something seems missing from PLAN.md, say so and suggest adding it there.
- Owner items come first after "Now": the owner's content is what blocks launch.
- Mark nothing done unless PLAN.md or git shows it done.
