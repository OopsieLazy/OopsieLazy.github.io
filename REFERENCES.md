# REFERENCES.md

Design references: what each one does well, and what we take from it (or don't).
Notes only, in our own words. Screenshots of other people's sites are copyrighted, so they stay
in the git-ignored `references/` folder or a scratch folder, never in the repo.
Rule: take **principles**, never a site's look, art, layout or copy.

*Last checked: 2026-11-15.*

## dazprojects.com: the sleek benchmark (catalog and home)

**What makes it professional:**
- One picture style for every product: line-art renders, same scale, same pale tile, same shape.
- Nothing around each item: no borders, boxes or shadows. Space alone separates them.
- One font (an Inter-like sans), two sizes, sentence case. Only page titles are bold.
- Black and grey only. The colour comes from the content.
- A tight grid (5 across at 1440, ~16px gaps) using nearly the full window width.
- A small toolbar: item count, Sort, and a big/small grid toggle.
- Home: a big centred headline, one sentence, then **one large photo of the product in use**
  (rounded corners), then "Best Projects" as a 4-up grid, then reviews with star ratings.

**Taken so far:** the Sleek pass (2026-11-11): Home tiles, quiet paper Code cards, tidy CAD stats.

**Still worth taking:**
- A real **in-use photo** as Home's hero (owner content: your guitar with the bridge on it).
- **Proof** like daz's reviews, made honest for a portfolio: MakerWorld download or print counts,
  "printed and in use since 2024".
- A toolbar (count + filter) on the Code page: PLAN 3.8 / 3.3b, after launch.

**Don't take:** the newsletter pop-up over the hero (it covers the content; a dark pattern on a portfolio).

## SPELUNKR.tv: the retro personality benchmark

24/7 "cable TV" channels built from forgotten Internet Archive video. "Cable TV, but weirder."

**What makes it memorable:**
- A complete era costume: a 90s TV-guide look. Deep indigo (`#1C0A57`) to sunset-orange
  gradient, yellow display type, condensed TV-listing font, chunky blue double-bordered panels.
- A pixel-art icon for every channel, in one consistent style. The icons ARE the navigation.
- A real TV-guide grid (channels down, half-hours across) as the main way to browse.
- An object as the hero: a CRT TV showing static, with the channel name in the corner.
- Big stat tiles ("36 channels · 24/7 live sync · 4,174 hours").
- A **voice**: short, dry, honest copy. "No purchase necessary. No purchase possible.
  (We checked. There is no checkout.)" "Every tape plays from the Internet Archive."
- Updates as dated entries ("November 14, 2026 · new channel"), each with its own card.

**What fits us** (our identity: a retro curiosity cabinet, 70s stripes, pixel-art objects, a museum):
- The **voice**: your intro lines could be this short and dry (all owner text, see TODO).
- **Pixel-art icons per project**, one style, drawn by you: they'd suit the Code cards and the
  museum (Phase 4) far better than generic icons.
- The **TV-guide grid** as the model for Filmography (later) and maybe a playful 404.
- **Dated updates**: a short "What I'm building" log is honest proof of activity for recruiters.

**What doesn't fit:** the full costume. It's a maximal look, and the owner chose "sleek and
professional" for the catalogs. Use Spelunkr's flavour in small, contained places (404, the Lab,
Filmography), never across the catalog pages. And never copy its art, layout or wording.

## kylepurser.net: the evidence benchmark (CAD portfolio, 2026-11-27)

A Google Sites portfolio; the owner's capture is `references/portfolio-reference-pack.zip`
(git-ignored: it holds another person's pages). Its look is stock Sites blocks; its strength is
**proof**: every claim has something to look at.

**What we take** (structure, never his text, images or branding):
- **Render beside the real build**, one pair per assembly, with the part count in the title.
  Our gallery already has `"kind": "cad"` / `"photo"`; the pairing is the habit to copy.
- **2D drawings** with a one-line caption each (what it is, any result). The biggest gap here:
  a mechanical designer with no drawings on show. Self-hosted PNG previews + the PDF in
  `assets/docs/`, no Drive iframes (our CSP allows nothing from other sites, L2).
- **A result line** where there is one (a placing, MakerWorld prints by others).
- **Certifications on About**, only real ones: issuer, title, date, one line on what it shows,
  a verification link. The pack's `certifications.md` lists options and costs.
- **Every claim links to its proof**: About's tool years to the CAD page, the bio to the résumé.

**What doesn't fit:** dark title bands on every page, Georgia serif and justified body text
(uneven gaps, harder for dyslexic readers), 4px rounded buttons (D59), software logo collages
(other brands' trademarks as filler), a "best viewed on desktop" banner, YouTube/Drive/Form
iframes, a third-person bio, and splitting three projects into a hub of category pages.

## Earlier references (from CLAUDE.md)

- **ashanand.dev**: a pixel-art room drawn on a scaled `<canvas>`; the model for the museum (Phase 4).
- **joeydanna.com/cad-portfolio**: CAD project write-ups; the model for R2b project pages (after launch).
