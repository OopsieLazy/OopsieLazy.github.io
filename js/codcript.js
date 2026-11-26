// Code page (O8, the workshop): builds everything below the header from data/code.json.
//   1. The room: workcript.js draws it; this file lays a real button or link over each object
//   2. The scroll: the chosen shelf unrolled over the room, each project a row that opens in place
//   3. Every project: one table you can sort and filter (the Pirate Bay idea, O7b)
// Each project is typed once in the JSON, with a "shelf" saying which object holds it.
// Loaded with `defer`, so the page's HTML is already parsed when this runs.
// fetchJson(), make() and joinMeta() come from js/datacript.js; Workshop from js/workcript.js.

const CODE_URL = "data/code.json";

// The words for each status. An unknown status in the JSON falls back to "archived"
const STATUS_WORDS = { live: "Live", wip: "In progress", archived: "Archived" };
const STATUS_ORDER = { live: 0, wip: 1, archived: 2 };   // live first when sorting
const statusKey = (status) => (STATUS_WORDS[status] ? status : "archived");

// What each shelf holds, in plain words (the object's own name comes from workcript.js)
const SHELF_WORDS = {
    desk: "Desk apps", market: "Trading tools", terminal: "Command-line tools", books: "Book tools",
    games: "Games", radio: "Audio and video", voice: "Voice control", toolbox: "Small utilities",
    web: "This website", box: "Early projects",
};

// The map on the wall is the site's menu (the header is hidden on this page): every page,
// in plain words. Fixed addresses written here, never from the JSON
const MAP_PLACES = [
    { name: "Home", href: "index.html", note: "Everything at a glance" },
    { name: "CAD portfolio", href: "projects.html", note: "Parts I design and 3D print" },
    { name: "Art", href: "art.html", note: "My photographs" },
    { name: "About", href: "aboutme.html", note: "Who I am and how I work" },
    { name: "Contact", href: "contact.html", note: "Email and résumé" },
    { name: "Every project", href: "#every-project", note: "All my code in one table, below the room" },
];

/* ---------- Below the room ---------- */

// At first the page is only the workshop: the table, the ask strip and the footer are folded
// away (owner, 2026-11-26: "no motion unless an object is selected"). Picking an object
// unfolds them; they fold away again once nothing is open AND the room is back in full view.
// The class lives on <body> so the CSS can reach the footer too
let belowSeen = false;   // is any of the part below on screen right now?
function showBelow() {
    document.body.classList.add("shows-below");
}
function hideBelowIfIdle() {
    if ($("#code-viewer").hidden && !belowSeen) document.body.classList.remove("shows-below");
}
// Glide down to the table and put keyboard focus on its heading. preventScroll on focus,
// or the browser would jump there at once and skip the glide
function goToList() {
    showBelow();
    $("#every-project").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
    $("#every-label").focus({ preventScroll: true });
}
function wireBelow() {
    // Watch the part below. The root is shrunk by 4px at the bottom: with the room exactly one
    // window tall, the part below TOUCHES the window's edge at the top of the page, and a
    // touching box still counts as "intersecting"
    new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) belowSeen = true;
        else if (belowSeen) { belowSeen = false; hideBelowIfIdle(); }
    }, { rootMargin: "0px 0px -4px 0px" }).observe($("#code-below"));
    // Every same-page link to the table (the skip link, the scroll's foot, the map) unfolds it first:
    // a link can't land on something that's folded away
    document.addEventListener("click", (event) => {
        const link = event.target.closest('a[href="#every-project"]');
        if (!link) return;
        event.preventDefault();
        if (link.closest(".scroll-list")) closeScroll({ returnFocus: false });   // from the map: roll it up
        goToList();
    });
}

// The catalog number is worked out from the project's place in the JSON, never typed:
// reorder the file and every number follows. 0 -> "No. 001"
const catalogNumber = (index) => `No. ${String(index + 1).padStart(3, "0")}`;

const state = { projects: [], shelf: null, id: null, map: false, sort: "status", dir: 1, filter: "all" };
const $ = (selector) => document.querySelector(selector);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

/* ---------- Small parts ---------- */

// A status lamp (Conspiracy's indicator lights, O7a): the bulb is drawn by CSS and the WORD
// is always on screen, because a colour alone would fail WCAG 1.4.1
function statusLamp(status) {
    const key = statusKey(status);
    return make("span", "ic-lamp", make("span", `ic-status is-${key}`), STATUS_WORDS[key]);
}

function toolChips(tools = []) {
    const list = make("ul", "ic-chips", ...tools.map((tool) => make("li", "", tool)));
    list.setAttribute("role", "list"); // list-style: none makes Safari drop the list meaning
    list.setAttribute("aria-label", "Built with");
    return list;
}

// SECURITY: an href can run code ("javascript:…"), so only a plain https:// address
// from the JSON becomes a link. A private repo (source: null) gets a note, not a 404 link
function sourceLink(project) {
    if (typeof project.source === "string" && project.source.startsWith("https://")) {
        const link = make("a", "", "Source on GitHub");
        link.href = project.source;
        return link;
    }
    return make("span", "ic-private", "Private repo");
}

const shelfSpot = (shelf) => Workshop.SPOTS.find((spot) => spot.shelf === shelf);
const inShelf = (shelf) => state.projects.filter((p) => p.shelf === shelf)
    .sort((a, b) => STATUS_ORDER[statusKey(a.status)] - STATUS_ORDER[statusKey(b.status)] || a.index - b.index);

/* ---------- 1. The room ---------- */

// Which objects get an outline: the one under the pointer, the one with keyboard focus,
// and the open shelf's. The room dims while the scroll is open
const lit = { hover: null, focus: null };
function syncOutlines() {
    if (typeof Workshop === "undefined") return;
    const isOpen = !$("#code-viewer").hidden;
    const open = !isOpen ? null : state.map ? "Map" : state.shelf ? shelfSpot(state.shelf).name : null;
    Workshop.highlight([lit.hover, lit.focus, open].filter(Boolean), isOpen);
}

// A screen reader says "→" out loud ("right arrow"), so the arrow is drawn for the eyes only.
// A fresh span each call: one DOM node can only sit in one place
const arrow = () => {
    const span = make("span", "", " → ");
    span.setAttribute("aria-hidden", "true");
    return span;
};

// Each object becomes a real control laid over the canvas, placed in % of the room,
// so it stays on its object at every size. Shelves are buttons (they change this page);
// the printer, camera and map are links (they go somewhere)
function spotControl(spot, inList) {
    const count = spot.shelf ? inShelf(spot.shelf).length : 0;
    const label = spot.shelf ? `${spot.name}: ${SHELF_WORDS[spot.shelf]}, ${plural(count, "project")}` : `${spot.name}: ${spot.what}`;
    let control;
    if (spot.nav) {
        // The map: a button that unrolls the scroll with the site's pages on it
        control = make("button", inList ? "shelf-button" : "spot", inList ? `${spot.name} · ${spot.what}` : make("span", "spot-tag", `${spot.name} · ${spot.what}`));
        control.type = "button";
        control.dataset.nav = "map";
        control.setAttribute("aria-pressed", "false");
        control.setAttribute("aria-controls", "code-viewer");
        control.addEventListener("click", () => openMap(control));
    } else if (spot.href) {
        // Reads "3D printer CAD portfolio": the arrow only shows that the link leaves the room.
        // One span round the words: in the phone list's flex link, loose text pieces would each
        // become a flex item and lose the spaces around the arrow
        const words = make("span", inList ? "" : "spot-tag", spot.name, arrow(), spot.what);
        control = make("a", inList ? "shelf-link" : "spot is-link", words);
        control.href = spot.href;   // fixed addresses from workcript.js, never from the JSON
    } else {
        const tag = `${spot.name} · ${count}`;
        control = make("button", inList ? "shelf-button" : "spot", inList ? `${spot.name} · ${SHELF_WORDS[spot.shelf]} (${count})` : make("span", "spot-tag", tag));
        control.type = "button";
        control.dataset.shelf = spot.shelf;
        control.setAttribute("aria-pressed", "false");
        control.setAttribute("aria-controls", "code-viewer");
        // The scroll opens INSIDE the frame, so there's nothing to scroll to: focus moves to its
        // heading, and goes back to this button when the scroll closes
        control.addEventListener("click", () => pickShelf(spot.shelf, control));
    }
    if (!inList) {
        // The outline is drawn ON the canvas around the object's own shape (workcript.js):
        // tell it what the pointer is over and what has keyboard focus
        control.addEventListener("pointerenter", () => { lit.hover = spot.name; syncOutlines(); });
        control.addEventListener("pointerleave", () => { lit.hover = null; syncOutlines(); });
        control.addEventListener("focus", () => { lit.focus = spot.name; syncOutlines(); });
        control.addEventListener("blur", () => { lit.focus = null; syncOutlines(); });
        control.setAttribute("aria-label", label);
        // Tags near the top of the room open downward, so they don't fall off the edge
        if (spot.y < 30) control.classList.add("tag-below");
    }
    const item = make("li", "", control);
    item.spot = spot;   // placeSpots() reads it to put the button on its object
    return item;
}

// Each button sits over its object, in % of the picture. The wide room and the phone tower
// (O8m) put the same objects in different places, so workcript.js calls this again whenever
// the layout changes. The Tab order is re-sorted too, so it always follows what you see
function placeSpots() {
    const items = [...$("#workshop-spots").children].map((item) => ({ item, at: Workshop.view(item.spot) }));
    items.forEach(({ item, at }) => {
        item.firstChild.style.cssText = `--x:${at.x}%;--y:${at.y}%;--w:${at.w}%;--h:${at.h}%`;
    });
    items.sort((a, b) => a.at.order - b.at.order);
    $("#workshop-spots").replaceChildren(...items.map(({ item }) => item));
}

// The art never arrived (a missing file, a failed download): no room, so the page is the
// project table instead, the same as when drawing fails
function roomFailed() {
    $("#workshop").hidden = true;
    document.body.classList.remove("has-room");
}

function buildRoom() {
    if (!$("#workshop") || typeof Workshop === "undefined") return;
    // Tab order follows the room like a page: top row first, left to right
    const order = [...Workshop.SPOTS].sort((a, b) => (Math.round(a.y / 50) - Math.round(b.y / 50)) || (a.x - b.x));
    $("#workshop-spots").replaceChildren(...order.map((spot) => spotControl(spot, false)));
    $("#workshop-list").replaceChildren(...order.map((spot) => spotControl(spot, true)));
    const stage = $("#workshop-stage");
    // Shown BEFORE mounting, so the stage has a real size to fit the room into
    stage.hidden = false;
    Workshop.mount({ canvas: $("#workshop-canvas"), pauseButton: $("#workshop-pause"), stage, spots: $("#workshop-spots"), onError: roomFailed, onLayout: placeSpots });
}

/* ---------- 2. The scroll ---------- */

let opener = null;   // what opened the scroll (an object, a list button, a table row): focus goes back to it

// One project = one row. The title is a button that opens its details in place
// (aria-expanded says open or shut; aria-controls says which part it opens)
function scrollRow(project) {
    const open = project.id === state.id;
    const detailId = `scroll-${project.id}`;
    const toggle = make("button", "scroll-row",
        make("span", "screen-reader-text", "Status: "), statusLamp(project.status),
        make("span", "scroll-row-title", project.title),
        make("span", "scroll-row-year", project.year || ""));
    toggle.type = "button";
    toggle.dataset.id = project.id;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-controls", detailId);
    // Click an open row to roll it up again; click another to open that one instead
    toggle.addEventListener("click", () => {
        if (state.id === project.id) { state.id = null; renderScroll(); focusRow(project.id); markRows(); }
        else openScroll(project.id, { focus: "row" });
    });
    const detail = make("div", "scroll-detail",
        make("p", "scroll-number", joinMeta([project.number, project.handWritten ? "Hand-written" : ""])),
        make("p", "scroll-desc", project.description || project.blurb || ""),
        toolChips(project.tools),
        make("p", "scroll-links", sourceLink(project)));
    detail.id = detailId;
    detail.hidden = !open;
    return make("li", open ? "is-open" : "", make("h3", "scroll-row-head", toggle), detail);
}

function renderScroll() {
    const items = inShelf(state.shelf);
    const spot = shelfSpot(state.shelf);
    $("#scroll-crumb").textContent = `${spot ? spot.name : "Shelf"} · ${plural(items.length, "project")}`;
    $("#scroll-shelf").textContent = SHELF_WORDS[state.shelf] || "Projects";
    $("#scroll-list").replaceChildren(...items.map(scrollRow));
    $("#scroll-foot").hidden = false;
    pressOnly((control) => control.dataset.shelf === state.shelf);
}

// Exactly one object (or none) shows as pressed: the open shelf, or the map
function pressOnly(test) {
    document.querySelectorAll("[data-shelf], [data-nav]").forEach((control) => control.setAttribute("aria-pressed", String(test(control))));
}

// The map: the same scroll, with the site's pages on it as plain links
function openMap(from) {
    opener = from || null;
    state.map = true;
    state.id = null;
    $("#scroll-crumb").textContent = "Map of the realm";
    $("#scroll-shelf").textContent = "Where to go";
    $("#scroll-list").replaceChildren(...MAP_PLACES.map((place) => {
        const link = make("a", "scroll-place", make("span", "scroll-place-name", place.name), make("span", "scroll-place-note", place.note));
        link.href = place.href;
        return make("li", "", link);
    }));
    pressOnly((control) => control.dataset.nav === "map");
    $("#scroll-foot").hidden = true;   // the map already lists "Every project"
    showBelow();
    const scroll = $("#code-viewer");
    if (scroll.hidden) {
        scroll.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => scroll.classList.add("is-open")));
    }
    $("#workshop").classList.add("is-reading");
    syncOutlines();
    $("#scroll-shelf").focus({ preventScroll: true });
}

const focusRow = (id) => { const row = $(`.scroll-row[data-id="${CSS.escape(id)}"]`); if (row) row.focus(); };

// Open the scroll on a project (its shelf unrolled, that row open). focus: "shelf" lands on
// the heading (a shelf was picked), "row" on the project's own row (a project was picked)
function openScroll(id, { focus = "shelf" } = {}) {
    const project = state.projects.find((p) => p.id === id);
    if (!project) return;
    state.id = id;
    state.shelf = project.shelf;
    state.map = false;
    renderScroll();
    markRows();
    showBelow();
    const scroll = $("#code-viewer");
    if (scroll.hidden) {
        scroll.hidden = false;
        // Two frames later, so the browser has drawn it rolled up before it unrolls (CSS transition)
        requestAnimationFrame(() => requestAnimationFrame(() => scroll.classList.add("is-open")));
    }
    $("#workshop").classList.add("is-reading");
    syncOutlines();   // dims the room behind the scroll and outlines the open object
    try { history.replaceState(null, "", `#p-${id}`); } catch (e) { /* the page still works */ }
    if (focus === "shelf") $("#scroll-shelf").focus({ preventScroll: true });
    else if (focus === "row") focusRow(id);
}

function closeScroll({ returnFocus = true } = {}) {
    const scroll = $("#code-viewer");
    if (scroll.hidden) return;
    scroll.classList.remove("is-open");
    scroll.hidden = true;
    $("#workshop").classList.remove("is-reading");
    state.id = null;
    state.map = false;
    syncOutlines();
    pressOnly(() => false);
    markRows();
    hideBelowIfIdle();
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* fine */ }
    // Back to where the visitor was, so a keyboard user isn't dropped at the top of the page
    if (returnFocus && opener && document.contains(opener)) opener.focus({ preventScroll: false });
    opener = null;
}

// A shelf opens on its best project: live first, then in progress, then the rest
function pickShelf(shelf, from) {
    const first = inShelf(shelf)[0];
    if (!first) return;
    opener = from || null;
    openScroll(first.id, { focus: "shelf" });
    $("#viewer-status").textContent = `${SHELF_WORDS[shelf]}: ${plural(inShelf(shelf).length, "project")}. ${first.title} is open.`;
}

// From the table below the room: bring the room back into view, then open the project
function pickFromTable(id, from) {
    opener = from;
    $("#workshop").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
    openScroll(id, { focus: "row" });
}

function wireScroll() {
    $("#scroll-close").addEventListener("click", () => closeScroll());
    // Escape closes the scroll from anywhere on the page
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !$("#code-viewer").hidden) closeScroll();
    });
}

/* ---------- 3. Every project ---------- */

function renderTable() {
    const rows = state.projects
        .filter((p) => state.filter === "all" || statusKey(p.status) === state.filter)
        .sort((a, b) => {
            const value = (p) => state.sort === "status" ? STATUS_ORDER[statusKey(p.status)]
                : state.sort === "shelf" ? (SHELF_WORDS[p.shelf] || "")
                : state.sort === "year" ? String(p.year || "") : p.title.toLowerCase();
            const va = value(a), vb = value(b);
            return (va > vb ? 1 : va < vb ? -1 : a.title.localeCompare(b.title)) * state.dir;
        });
    $("#every-count").textContent = `(${rows.length})`;
    $("#every-rows").replaceChildren(...rows.map((p) => {
        const name = make("button", "every-name", p.title);
        name.type = "button";
        name.addEventListener("click", () => pickFromTable(p.id, name));
        const row = make("tr", "",
            make("th", "every-project-cell", name, make("span", "every-blurb", p.blurb || "")),
            make("td", "every-shelf", SHELF_WORDS[p.shelf] || ""),
            make("td", "", statusLamp(p.status)),
            make("td", "every-tools", (p.tools || []).slice(0, 3).join(" · ")),
            make("td", "every-year", p.year || ""));
        row.querySelector("th").scope = "row";
        row.dataset.id = p.id;
        return row;
    }));
    if (!rows.length) {
        const cell = make("td", "every-empty", "Nothing with that status yet.");
        cell.colSpan = 5;
        $("#every-rows").replaceChildren(make("tr", "", cell));
    }
    // aria-sort tells a screen reader which column is sorted, and which way
    document.querySelectorAll("#every-project thead th").forEach((th) => {
        const button = th.querySelector("button");
        const on = button && button.dataset.sort === state.sort;
        if (on) th.setAttribute("aria-sort", state.dir === 1 ? "ascending" : "descending");
        else th.removeAttribute("aria-sort");
    });
    markRows();
}

function markRows() {
    document.querySelectorAll("#every-rows tr").forEach((row) => row.classList.toggle("is-current", row.dataset.id === state.id));
}

function wireTable() {
    document.querySelectorAll("#every-project thead button").forEach((button) => button.addEventListener("click", () => {
        if (state.sort === button.dataset.sort) state.dir *= -1;
        else { state.sort = button.dataset.sort; state.dir = 1; }
        renderTable();
    }));
    document.querySelectorAll(".every-filters button").forEach((button) => button.addEventListener("click", () => {
        state.filter = button.dataset.filter;
        document.querySelectorAll(".every-filters button").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        renderTable();
    }));
}

/* ---------- Build the page ---------- */

function renderCode(projects) {
    state.projects = projects.map((project, index) => ({ ...project, index, number: catalogNumber(index) }));
    // The project list comes FIRST: it's the content, the room is decoration
    wireTable();
    renderTable();
    $("#every-project").hidden = false;
    wireScroll();
    // The art must never take the list down with it: if drawing throws (an old browser, a bug
    // in workcript.js), log it and leave the room hidden. The viewer and table still work.
    // Only a room that drew folds the part below away (.has-room): without it, all stays open
    try {
        buildRoom();
        document.body.classList.add("has-room");
        wireBelow();
    } catch (error) {
        console.error(error);
        $("#workshop").hidden = true;
    }
    // The scroll stays rolled up until something is picked (owner, 2026-11-25), except on a
    // shared link (#p-inv-os), which opens straight on that project
    const fromHash = location.hash.startsWith("#p-") ? location.hash.slice(3) : null;
    if (fromHash) openScroll(fromHash, { focus: "none" });
    else if (location.hash === "#every-project") goToList();   // a link from another page
    window.addEventListener("hashchange", () => {
        if (location.hash.startsWith("#p-")) openScroll(location.hash.slice(3), { focus: "row" });
        else if (location.hash === "#every-project") goToList();
    });
}

// If code.json can't load (a typo in the file, or the page opened as file:// without a
// server), say so on the page, and still point at GitHub, instead of showing nothing
function showCodeNote(error) {
    console.error(error);
    const note = $("#code-note");
    if (!note) return;
    const link = make("a", "", "GitHub");
    link.href = "https://github.com/OopsieLazy";
    note.replaceChildren("The project list didn't load. My public code is on ", link, ".");
}

fetchJson(CODE_URL).then(renderCode).catch(showCodeNote);
