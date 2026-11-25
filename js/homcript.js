// Home page (O4, D51): one mosaic of the work, CAD projects and photos mixed, like brittanybravo.com.
// No words show until a tile is hovered or focused (css/homyles.css), but they're in every link,
// so screen readers and search engines still get them.
// The flip cards (the Blueprint card stack, Home's hero until O4) came back on 2026-11-24 in a
// drawer: "Featured cards" above the mosaic slides it open and pushes the mosaic down.
// The stack turns like a wheel with Previous / Next.
// Loaded with `defer` after js/datacript.js (loadProjects, fetchJson, make, makeImage, joinMeta,
// twoDigits, projectHref, dragOutProject, enableMasonry).

const HOME_ART_URL = "data/art.json";
// The owner's setting for the mosaic's order (2026-11-24). It lives in the repo, so only the owner
// can change it; visitors can't. Read by arrange() below; how to use it is in README ("Home order")
const HOME_SETTINGS_URL = "data/home.json";
const MODES = ["listed", "mixed", "random"];
const EAGER_TILES = 3;   // the first row loads straight away; the rest wait until they're near the screen (lazy)
const MAX_FEATURED = 3;   // the stack's CSS has a place for 3 cards (data-pos 0, 1, 2)

// One tile: the picture, and a caption that the CSS hides until hover or focus.
// The caption is INSIDE the link, so it's the link's name ("Bridge Guitar, CAD · 2025"). That's why the
// image has alt="": a screen reader would otherwise read the name twice
function buildTile({ href, src, w, h, title, meta }, index) {
    const image = makeImage(src);
    image.decoding = "async";
    if (index >= EAGER_TILES) image.loading = "lazy";
    if (w && h) { image.width = w; image.height = h; }   // reserves the shape before it loads: no jumping
    const link = make("a", "tile", image,
        make("span", "tile-cap", make("span", "tile-title", title), " ", make("span", "tile-meta", meta)));
    link.href = href;
    return make("li", "", link);
}

// Both lists turned into the same tile shape
const fromProject = (project) => ({
    id: project.id,                        // the name home.json uses for it
    href: projectHref(project),            // its entry on the CAD page
    src: project.image,
    title: project.name,
    meta: joinMeta(["CAD", project.year])
});

// SECURITY: only our own image folder, the same check as artcript.js, so a typo or a pasted URL
// in art.json can't become a picture from somewhere else
const fromPhoto = (photo) => /^assets\/images\/[\w./-]+$/.test(photo.src || "") && {
    id: photo.id,
    href: `art.html#piece-${encodeURIComponent(photo.id)}`,   // the photo on the Art page
    src: photo.src, w: photo.w, h: photo.h,
    title: photo.title || "Untitled",
    meta: joinMeta(["Photography", photo.year])
};

// Project, photo, project, photo…: the two kinds mixed evenly, like the reference's mosaic
function interleave(a, b) {
    const mixed = [];
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        if (i < a.length) mixed.push(a[i]);
        if (i < b.length) mixed.push(b[i]);
    }
    return mixed;
}

// A fair shuffle (Fisher-Yates): walk backwards, swapping each tile with a random one at or before it.
// Every order is equally likely, which "sort by a random number" doesn't give you
function shuffled(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Puts the tiles in the order data/home.json asks for:
// - "listed": the ids in "order" first, exactly as written; anything not listed follows in the mixed order,
//   so a new project or photo still shows up before you've placed it
// - "mixed":  project, photo, project, photo… (the default, and what a missing or broken home.json gives)
// - "random": a new shuffle on every visit
// The owner's preview: index.html?shuffle shuffles whatever the setting says, and prints that order in
// the browser console, ready to paste into home.json. A visitor who finds it only reshuffles their own screen
function arrange(tiles, settings) {
    const preview = new URLSearchParams(location.search).has("shuffle");
    const mode = preview ? "random" : MODES.includes(settings.mode) ? settings.mode : "mixed";

    if (mode === "random") {
        const order = shuffled(tiles);
        if (preview) {
            console.info("Home: shuffled. Like it? Paste this into data/home.json:\n" +
                JSON.stringify({ mode: "listed", order: order.map((tile) => tile.id) }, null, 2));
        }
        return order;
    }

    if (mode === "listed") {
        const left = new Map(tiles.map((tile) => [tile.id, tile]));   // id -> tile, still to be placed
        const listed = [];
        for (const id of Array.isArray(settings.order) ? settings.order : []) {
            const tile = left.get(id);
            if (tile) {
                listed.push(tile);
                left.delete(id);                // listed twice? It still shows once
            } else {
                console.warn(`data/home.json: "${id}" isn't a project or photo id (or it's listed twice), so it's skipped.`);
            }
        }
        return [...listed, ...left.values()];   // Map keeps insertion order, so the rest stay mixed
    }

    return tiles;
}

/* ---------- The flip cards (2.0c; in a slide-open drawer since 2026-11-24) ---------- */

// One Blueprint card. The values in the corners are DERIVED, not typed:
// card number from its place, "v8" from iterations, stars from difficulty
function buildCard(project, index, total) {
    const stats = project.stats || {};
    // A missing stat shows a dash instead of "undefined"
    const show = (value, unit = "") => (value === undefined || value === null) ? "–" : `${value}${unit}`;
    const difficulty = Math.min(5, Math.max(0, stats.difficulty ?? 0)); // keep it within 0–5

    const stat = (icon, value, label) =>
        make("span", "card-stat", make("span", "card-icon", icon), make("b", "", value), make("small", "", label));

    const card = make("a", "bp-card",
        make("span", "card-top",
            make("span", "card-tool", project.tool || "CAD"),
            make("span", "card-name", project.name),
            make("span", "card-number", `${twoDigits(index + 1)}/${twoDigits(total)}`)
        ),
        make("span", "card-art",
            makeImage(project.image),
            make("span", "card-stats",
                stat("↻", show(stats.iterations), "Iter"),
                stat("⚙", show(stats.parts), "Parts"),
                stat("⏱", show(stats.printHours, "h"), "Print"),
                stat("◆", show(stats.difficulty), "Diff")
            )
        ),
        make("span", "card-type", project.type || ""),
        make("span", "card-text",
            make("span", "card-desc", project.description || ""),
            make("span", "card-flavor", project.flavor || "")
        ),
        make("span", "card-foot",
            make("span", "card-rev", show(stats.iterations ? `v${stats.iterations}` : undefined)),   // 0 or missing: a dash
            // Empty stars get their own span so the CSS can fade them (tiny ☆ and ★ look alike)
            make("span", "card-difficulty",
                "★".repeat(difficulty),
                make("span", "star-empty", "☆".repeat(5 - difficulty))
            ),
            make("span", "card-date", show(project.year))
        )
    );
    // It's a link because it GOES somewhere (a <button> DOES something on the page).
    // aria-label gives it a short name; otherwise a screen reader would read every stat
    card.href = projectHref(project);
    card.setAttribute("aria-label", `${project.name}, featured project`);
    card.dataset.name = project.name;
    dragOutProject(card, project); // the whole card drags out (datacript.js)
    return card;
}

// The stack inside the drawer. The ARRAY ORDER is the stack order: cards[0] is always the front card.
// JS only reorders this array and renumbers data-pos; CSS does the placing and the motion
function setupStack(drawer, opener, projects) {
    if (projects.length === 0) return;   // nothing featured: the "Featured cards" button stays hidden

    const stack = drawer.querySelector(".card-stack");
    const name = drawer.querySelector(".featured-name");
    const caption = drawer.querySelector(".featured-caption");
    const prev = drawer.querySelector(".stack-prev");
    const next = drawer.querySelector(".stack-next");

    const cards = projects.map((project, i) => buildCard(project, i, projects.length));
    stack.append(...cards);

    function update() {
        cards.forEach((card, pos) => {
            card.dataset.pos = pos;
            const isFront = pos === 0;
            // Back cards leave the Tab order and the screen-reader view: they are a mouse
            // shortcut only. Keyboard users get the same result from Previous / Next
            card.tabIndex = isFront ? 0 : -1;
            if (isFront) card.removeAttribute("aria-hidden");
            else card.setAttribute("aria-hidden", "true");
        });
        name.textContent = cards[0].dataset.name;
    }

    // The wheel: Next sends the front card to the back, Previous brings the back card to the front.
    // Either way it loops round forever, like turning a wheel
    const turn = (by) => {
        if (by > 0) cards.push(cards.shift());
        else cards.unshift(cards.pop());
        update();
    };

    // One listener on the stack instead of one per card ("event delegation")
    stack.addEventListener("click", (event) => {
        const card = event.target.closest(".bp-card");
        if (!card || card === cards[0]) return; // the front card is a normal link: let it navigate
        event.preventDefault();                 // a back card swaps to the front instead
        cards.splice(cards.indexOf(card), 1);   // take it out...
        cards.unshift(card);                    // ...and put it first
        update();
    });

    if (cards.length > 1) {
        prev.hidden = false;
        next.hidden = false;
        prev.addEventListener("click", () => turn(-1));
        next.addEventListener("click", () => turn(1));
        // Left / Right anywhere in the open drawer turn it too
        drawer.addEventListener("keydown", (event) => {
            const by = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
            if (!by) return;
            event.preventDefault();
            turn(by);
        });
    }

    update();
    // Only now: if aria-live were on from the start, the first fill would be announced
    caption.setAttribute("aria-live", "polite");
    setupDrawer(drawer, opener);
}

// Open and shut the drawer. The CSS animates the height from the .is-open class.
// inert while shut: the hidden cards drop out of the Tab order and the screen-reader view,
// which height alone wouldn't do (a 0-tall box still has focusable links inside).
// aria-expanded on the button tells screen readers whether it's open
function setupDrawer(drawer, opener) {
    const toggle = (open) => {
        drawer.classList.toggle("is-open", open);
        drawer.inert = !open;
        opener.setAttribute("aria-expanded", String(open));
    };
    opener.addEventListener("click", () => toggle(opener.getAttribute("aria-expanded") !== "true"));
    // Esc inside the open drawer shuts it and puts focus back on the button, so keyboard users aren't lost
    drawer.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        toggle(false);
        opener.focus();
    });
    toggle(false);           // start shut from JS too, so it never depends on the HTML having inert
    opener.hidden = false;   // the cards exist, so the button can open them
}

async function initHome() {
    const grid = document.querySelector("#mosaic");
    if (!grid) return;

    // allSettled waits for both files and never throws: if one fails, the other still shows
    const [projects, art, settings] = await Promise.allSettled(
        [loadProjects(), fetchJson(HOME_ART_URL), fetchJson(HOME_SETTINGS_URL)]);
    for (const result of [projects, art]) {
        if (result.status === "rejected") {
            console.error(`Home: a data file didn't load. Check data/*.json for a typo, and serve the site with "python -m http.server".`, result.reason);
        }
    }
    // A project without a picture has nothing to show in a picture mosaic, so it's left out here
    const projectTiles = projects.status === "fulfilled" ? projects.value.filter((project) => project.image).map(fromProject) : [];

    // The flip cards in their drawer
    const drawer = document.querySelector("#featured-cards");
    const opener = document.querySelector(".cards-open");
    if (projects.status === "fulfilled" && drawer && opener) {
        setupStack(drawer, opener, projects.value.filter((project) => project.featured).slice(0, MAX_FEATURED));
    }
    const photoTiles = art.status === "fulfilled"
        ? art.value.filter((piece) => piece.kind === "photo").map(fromPhoto).filter(Boolean)
        : [];

    // No home.json (or a typo in it): the mosaic still builds, in the mixed order
    const tiles = arrange(interleave(projectTiles, photoTiles),
        settings.status === "fulfilled" && settings.value ? settings.value : {});
    if (tiles.length === 0) {
        const link = make("a", "", "Open the CAD portfolio");
        link.href = "projects.html";
        grid.after(make("p", "mosaic-note", "The work couldn't load. ", link));
        return;
    }
    grid.replaceChildren(...tiles.map(buildTile));
    enableMasonry(grid);   // datacript.js: packs each tile into the shortest column
}

initHome();
