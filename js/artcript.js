// Browse Art (R4, D42; grid since R4e, D48): builds the walls from data/art.json and lets visitors
// reorder them, like sliding tasks up and down a to-do list: drag a photo (or Alt + arrow keys) and the
// others make room. Shuffle mixes a wall; Reset puts it back. The order is remembered on this device.
// The look (bare photos in a grid) is all CSS (artyles.css); this file only builds and moves them.
// New pieces come from tools/art.py, which writes art.json from the photos in assets/images/art/.
// Loaded with `defer` after js/datacript.js (fetchJson, make).

const ART_URL = "data/art.json";
// localStorage: { [wall id]: [piece ids] }. "-2" since R4e-2: the walls became one per area, so an
// order saved in the old shape ({ journal, photo }) is simply left unused instead of misapplied
const ORDER_KEY = "art-order-2";
const DRAG_START = 6;                     // px a mouse must move before a press becomes a drag (else it's a click)
const HOLD_MS = 350;                      // touch: press and hold this long to pick a frame up (a swipe still scrolls)
const lessMotion = matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- Building one piece ----------
   (The frames' wood, tilt and wide/tall cell sizes lived here until R4e. The grid needs none of
   them: each photo keeps its own shape. They're in git history: git log -S "woodFor") */

function buildPiece(piece) {
    // SECURITY: the frame is a link to the picture, and an href can run code ("javascript:…").
    // Only our own image folder is allowed, so a typo or a pasted URL can't become a link
    if (!/^assets\/images\/[\w./-]+$/.test(piece.src || "")) {
        console.warn(`art.json: "${piece.id}" skipped, src must be a file in assets/images/`, piece.src);
        return null;
    }
    const image = make("img", "");
    Object.assign(image, { src: piece.src, alt: piece.alt || "", loading: "lazy", decoding: "async" });
    if (piece.w && piece.h) { image.width = piece.w; image.height = piece.h; }  // reserves the space: no jumping
    image.draggable = false;              // we do our own dragging; the browser's image drag would fight it

    const frame = make("a", "frame", image);
    frame.href = piece.src;               // click = see the full picture
    frame.draggable = false;

    const detail = [piece.detail, piece.year].filter(Boolean).join(" · ");
    const item = make("li", "", make("figure", "piece", frame,
        make("figcaption", "", piece.title || "", detail ? make("span", "label-meta", detail) : "")));
    item.dataset.id = piece.id;
    return item;
}

/* ---------- Remembering the order (on this device only) ---------- */

function readOrder() {
    try { return JSON.parse(localStorage.getItem(ORDER_KEY)) || {}; }
    catch { return {}; }                  // private mode or a broken value: just use the JSON order
}

function saveOrder() {
    const order = {};
    document.querySelectorAll(".salon").forEach((wall) => {
        order[wall.id] = [...wall.children].map((li) => li.dataset.id);
    });
    try { localStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch { /* storage full or blocked */ }
}

// Saved ids first, in their saved order; pieces added since (not in the save) after them
function applyOrder(wall, ids = []) {
    const byId = new Map([...wall.children].map((li) => [li.dataset.id, li]));
    ids.forEach((id) => byId.has(id) && wall.append(byId.get(id)));
    byId.forEach((li, id) => !ids.includes(id) && wall.append(li));
}

/* ---------- FLIP: smooth reflow when the order changes ----------
   First: measure every frame. Last: change the order (the browser jumps them to new places).
   Invert: push each one back to where it was with a translate. Play: animate that to zero.
   Only transform-type properties animate, so the browser doesn't recalculate layout every frame */
function reorder(wall, change) {
    const items = [...wall.children];
    const before = new Map(items.map((li) => [li, li.getBoundingClientRect()]));
    change();
    if (lessMotion.matches) return;
    items.forEach((li) => {
        if (li.classList.contains("is-dragging")) return;   // the dragged frame follows the pointer instead
        const a = before.get(li), b = li.getBoundingClientRect();
        const dx = a.left - b.left, dy = a.top - b.top;
        if (dx || dy) li.animate([{ translate: `${dx}px ${dy}px` }, { translate: "0 0" }], { duration: 220, easing: "ease-out" });
    });
}

/* ---------- Dragging (mouse, pen and touch: Pointer Events) ---------- */

function enableDragging(wall, announce) {
    let drag = null;                      // { li, pointerId, startX, startY, left, top, moved, holdTimer, picked }

    function pickUp() {
        drag.picked = true;
        drag.li.classList.add("is-dragging");
        wall.classList.add("is-sorting");
        drag.left = drag.li.offsetLeft;   // offsetLeft/Top ignore transforms: the frame's place in the layout
        drag.top = drag.li.offsetTop;
    }

    function follow(event) {
        // How far the pointer moved, minus how far the frame's own slot moved (it moves when we reorder)
        const dx = event.clientX - drag.startX - (drag.li.offsetLeft - drag.left);
        const dy = event.clientY - drag.startY - (drag.li.offsetTop - drag.top);
        drag.li.style.translate = `${dx}px ${dy}px`;
        // Which frame is under the pointer? The dragged one ignores the pointer (CSS), so we see past it
        const over = document.elementFromPoint(event.clientX, event.clientY)?.closest(`#${wall.id} > li`);
        if (!over || over === drag.li) return;
        const items = [...wall.children];
        const after = items.indexOf(over) > items.indexOf(drag.li);
        reorder(wall, () => over[after ? "after" : "before"](drag.li));
        drag.li.style.translate = `${event.clientX - drag.startX - (drag.li.offsetLeft - drag.left)}px ${event.clientY - drag.startY - (drag.li.offsetTop - drag.top)}px`;
    }

    function drop() {
        if (!drag) return;
        clearTimeout(drag.holdTimer);
        if (drag.picked) {
            const li = drag.li;
            const from = li.style.translate;
            li.style.translate = "";
            li.classList.remove("is-dragging");
            wall.classList.remove("is-sorting");
            if (!lessMotion.matches && from) li.animate([{ translate: from }, { translate: "0 0" }], { duration: 180, easing: "ease-out" });
            saveOrder();
            announce(li);
        }
        drag = null;
    }

    wall.addEventListener("pointerdown", (event) => {
        delete wall.dataset.justDragged;  // a fresh press: an old "just dragged" flag must not eat this click
        const li = event.target.closest(`#${wall.id} > li`);
        if (!li || event.button > 0 || drag) return;
        drag = { li, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false, picked: false };
        if (event.pointerType === "touch") {
            // Touch: hold still to pick up. Moving first means the visitor is scrolling, so let them
            drag.holdTimer = setTimeout(() => drag && pickUp(), HOLD_MS);
        }
    });

    wall.addEventListener("pointermove", (event) => {
        if (!drag || event.pointerId !== drag.pointerId) return;
        const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
        if (!drag.picked) {
            if (event.pointerType === "touch") {
                if (distance > DRAG_START) { clearTimeout(drag.holdTimer); drag = null; }   // a swipe: scroll
                return;
            }
            if (distance < DRAG_START) return;
            pickUp();
            // Keep getting moves even if the pointer leaves the wall. A nice-to-have: it throws if
            // the browser no longer counts that pointer as active, and the drag works without it
            try { wall.setPointerCapture(event.pointerId); } catch { /* fine */ }
        }
        drag.moved = true;
        follow(event);
    });

    wall.addEventListener("pointerup", drop);
    wall.addEventListener("pointercancel", drop);

    // While a touch drag is on, stop the page scrolling under the finger. This has to be a
    // touchmove listener with passive: false; pointer events alone can't cancel a scroll
    wall.addEventListener("touchmove", (event) => { if (drag?.picked) event.preventDefault(); }, { passive: false });
    // A long press on a link or picture opens the phone's menu; not while we're holding a frame
    wall.addEventListener("contextmenu", (event) => { if (drag?.picked) event.preventDefault(); });

    // A drag ends with a click on the link underneath; that click must not open the picture
    wall.addEventListener("click", (event) => {
        if (wall.dataset.justDragged) { event.preventDefault(); delete wall.dataset.justDragged; }
    }, true);
    wall.addEventListener("pointerup", () => { if (drag?.moved) wall.dataset.justDragged = "1"; }, true);
}

/* ---------- Keyboard: Alt + arrow keys move the focused frame one place ---------- */

function enableKeys(wall, announce) {
    wall.addEventListener("keydown", (event) => {
        if (!event.altKey || !["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(event.key)) return;
        const li = event.target.closest(`#${wall.id} > li`);
        if (!li) return;
        event.preventDefault();           // Alt + Left is also the browser's Back: not while sorting
        const earlier = event.key === "ArrowLeft" || event.key === "ArrowUp";
        const neighbour = earlier ? li.previousElementSibling : li.nextElementSibling;
        if (!neighbour) return;
        reorder(wall, () => neighbour[earlier ? "before" : "after"](li));
        li.querySelector(".frame").focus();   // moving an element in the page can drop its focus
        saveOrder();
        announce(li);
    });
}

/* ---------- Shuffle and Reset ---------- */

// Fisher-Yates: every order is equally likely (sorting by Math.random() is biased)
function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}

/* ---------- Masonry (owner, 2026-11-22: "cleanly laid out chaotically", like brittanybravo.com) ----------
   Each photo spans as many tiny grid rows (--masonry-row in artyles.css) as it is tall, so the grid
   packs it into its column's first free spot. A ResizeObserver re-measures whenever a photo's box
   changes size (window resized, 3 columns became 2, a caption wrapped), and its callback runs before
   the browser paints, so the layout never shows unpacked. A span doesn't depend on WHERE a photo is,
   so dragging and Shuffle need nothing extra. grid-row-end is set through the CSSOM (element.style),
   which a strict CSP allows, unlike a style="" attribute written into the HTML */
const masonry = new ResizeObserver((entries) => {
    for (const { target: li, borderBoxSize } of entries) {
        const row = parseFloat(getComputedStyle(li.parentElement).getPropertyValue("--masonry-row")) || 4;
        const height = borderBoxSize?.[0]?.blockSize ?? li.getBoundingClientRect().height;
        li.style.gridRowEnd = `span ${Math.ceil(height / row)}`;
    }
});

function enableMasonry(wall) {
    wall.classList.add("is-masonry");      // CSS switches to the tiny rows only once spans are coming
    [...wall.children].forEach((li) => masonry.observe(li));
}

/* ---------- Areas (R4e-2) ---------- */

// "Street & City" -> "street-city": only a-z, 0-9 and "-", so it's safe inside an id and a #link
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "area";

// Ids must be unique, or a #link jumps to the wrong place and two walls share a saved order.
// "Street & City" and "Street City" give the same slug, and an area called "Photos" would take the
// unnamed wall's id, so a taken slug gets -2, -3… (wall ids already in the HTML are reserved up front)
const usedSlugs = new Set(["journals", "photos"]);
function uniqueSlug(text) {
    const base = slug(text);
    let candidate = base;
    for (let n = 2; usedSlugs.has(candidate); n++) candidate = `${base}-${n}`;
    usedSlugs.add(candidate);
    return candidate;
}

// "3" on screen; screen readers hear "3 photos" (the word is screen-reader-only text)
const count = (n) => make("span", "area-count", String(n),
    make("span", "screen-reader-text", n === 1 ? " photo" : " photos"));

/* ---------- Start ---------- */

async function initArt() {
    const status = document.querySelector("#art-status");
    // The screen-reader message after a move: "Placeholder 3, position 2 of 8"
    const announce = (li) => {
        const wall = li.parentElement;
        const title = li.querySelector("figcaption")?.firstChild?.textContent.trim() || "Piece";
        status.textContent = `${title}, position ${[...wall.children].indexOf(li) + 1} of ${wall.children.length}`;
    };

    let pieces;
    try {
        pieces = await fetchJson(ART_URL);
    } catch (error) {
        console.error(`Art not built: check ${ART_URL} for a typo, and serve the site with "python -m http.server".`, error);
        status.textContent = "The pieces couldn't load. Please try again later.";
        return;
    }

    const saved = readOrder();
    const walls = [];                     // every wall on the page with its pieces in JSON order (Shuffle, Reset)
    const jumps = [];                     // [label, #target, how many] for the jump list

    function fillWall(wall, list) {
        wall.replaceChildren(...list.map(buildPiece).filter(Boolean));
        enableMasonry(wall);
        applyOrder(wall, saved[wall.id]);
        enableDragging(wall, announce);
        enableKeys(wall, announce);
        walls.push({ wall, list });
    }

    // Art journals: one wall, already in the HTML. No pieces: the whole section stays hidden
    const journals = pieces.filter((piece) => piece.kind === "journal");
    const journalWall = document.querySelector("#wall-journals");
    if (journalWall) journalWall.closest(".art-room").hidden = journals.length === 0;
    if (journalWall && journals.length) {
        fillWall(journalWall, journals);
        jumps.push(["Art journals", "#journals-title", journals.length]);
    }

    // Photography: one wall per area, in the order the areas first appear in art.json.
    // A Map keeps that order (an object would too, mostly; a Map says it on purpose)
    const photos = pieces.filter((piece) => piece.kind === "photo");
    const areas = new Map();
    for (const photo of photos) {
        const name = (photo.area || "").trim();           // no area = the shared wall without a sub-heading
        if (!areas.has(name)) areas.set(name, []);
        areas.get(name).push(photo);
    }
    const holder = document.querySelector("#photo-areas");
    if (holder) holder.closest(".art-room").hidden = photos.length === 0;
    for (const [name, list] of holder ? areas : []) {
        const key = name ? uniqueSlug(name) : "photos";
        const wall = make("ul", "salon");
        wall.id = `wall-${key}`;
        wall.setAttribute("role", "list");    // list-style: none makes Safari drop the list meaning
        if (name) {
            const heading = make("h3", "area-title", name, count(list.length));
            heading.id = `area-${key}`;
            holder.append(heading);
            jumps.push([name, `#${heading.id}`, list.length]);
        } else {
            jumps.push(["Photography", "#photos-title", list.length]);
        }
        holder.append(wall);
        fillWall(wall, list);
    }

    // A heading that's the only one of its kind says nothing the page doesn't already show (owner,
    // 2026-11-22: nothing in the way of the work). screen-reader-text hides it from sight only:
    // screen readers still find it when they jump between headings
    const rooms = [...document.querySelectorAll(".art-room")].filter((room) => !room.hidden);
    if (rooms.length === 1) rooms[0].querySelector(".art-label")?.classList.add("screen-reader-text");
    if (areas.size === 1) holder?.querySelector(".area-title")?.classList.add("screen-reader-text");

    // The jump list: plain links, so Back, bookmarks and "copy link" all work without any code.
    // Only from 2 places up: with one, there's nowhere to jump to
    const jump = document.querySelector("#art-jump");
    if (jumps.length >= 2) {
        jump.querySelector("ul").replaceChildren(...jumps.map(([label, href, n]) => {
            const link = make("a", "", label);
            link.href = href;
            return make("li", "", link, " ", count(n));
        }));
        jump.hidden = false;
    }

    document.querySelector("#art-tools").hidden = false;   // the walls exist now, so the buttons can work

    document.querySelector("#art-shuffle")?.addEventListener("click", () => {
        walls.forEach(({ wall }) => reorder(wall, () => wall.append(...shuffle([...wall.children]))));
        saveOrder();
        status.textContent = "Shuffled";
    });

    document.querySelector("#art-reset")?.addEventListener("click", () => {
        try { localStorage.removeItem(ORDER_KEY); } catch { /* ignore */ }
        walls.forEach(({ wall, list }) => reorder(wall, () => applyOrder(wall, list.map((piece) => piece.id))));
        status.textContent = "Back in the original order";
    });
}

initArt();
