// CAD page sections (task 2.5): one entry per project from data/projects.json (D26).
// Each entry has the project's JSON id, so projects.html#bridge-guitar opens straight at that
// project (the home page links here). Since O5 (owner, 2026-11-27: "A2, with A1 below"):
// - the LIST beside the carousel: one row per project (buildIndexRow)
// - each ENTRY reads like a daz product page: a big gallery on the left, the facts on the
//   right (buildEntry): number, name, one line, a spec table, MakerWorld and "Next project"
// Loaded with `defer` after js/datacript.js (loadProjects, make, makeImage, twoDigits).
// The carousel above (projcript.js) reads the same JSON; its DWG numbers match these entries.

// Ids become part of a URL, so only plain lowercase-kebab-case is allowed (bridge-guitar)
const SAFE_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// An id is usable if it's well formed AND not already on the page. A project called
// "content" would steal the skip link's target, so the second copy would never be reached
function usableId(id) {
    if (!SAFE_ID.test(id || "")) {
        console.warn(`Project id "${id}" isn't lowercase-kebab-case, so it gets no anchor link.`);
        return false;
    }
    if (document.getElementById(id)) {
        console.warn(`Project id "${id}" is already used on this page, so it gets no anchor link.`);
        return false;
    }
    return true;
}

// What the "tool" short names in the JSON stand for. Add a line here for a new program
const TOOL_NAMES = { F360: "Fusion 360", SW: "SolidWorks", OS: "Onshape" };

// The specs as a description list: <dt> is the label, <dd> the value. Screen readers announce
// it as pairs ("Parts, 5"). The CSS draws it as a ruled table, like daz's product facts.
// Missing values are left out instead of showing a dash, so only what's true appears
function buildStats(stats = {}, tool) {
    const list = make("dl", "cad-stats");
    const add = (label, value) => {
        if (value === undefined || value === null || value === "") return;
        list.append(make("div", "", make("dt", "", label), make("dd", "", value)));
    };
    add("Versions", stats.iterations);
    add("Parts", stats.parts);
    add("Print time", stats.printHours != null ? `${stats.printHours} h` : null);
    add("Filament", stats.filament);                  // optional, e.g. "PETG, 85 g"
    // (Difficulty was shown here until 2026-11-27: owner, "remove difficulty". The JSON keeps it
    // for Home's trading cards)
    add("Made in", TOOL_NAMES[tool] || tool);
    return list;
}

// THE RESULT LINES (owner, 2026-11-27, from the kylepurser.net reference: show proof).
// "result" is free text for a placing or an outcome ("First place, school design fair").
// "makerworldStats" is the model's numbers, copied by hand from its MakerWorld page:
//   { "downloads": 61, "prints": 31, "checked": "2026-11" }
// MakerWorld has no public API and sits behind a bot check, so the page can't fetch them live;
// "checked" says how fresh they are, so a number is never passed off as today's
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function makerworldLine(numbers) {
    if (!numbers) return null;
    const parts = [];
    if (numbers.downloads != null) parts.push(`${numbers.downloads} downloads`);
    if (numbers.prints != null) parts.push(`${numbers.prints} prints`);
    if (!parts.length) return null;
    // "2026-11" becomes "Nov 2026". Anything else is left off rather than shown wrong
    const [, year, month] = /^(\d{4})-(\d{2})$/.exec(numbers.checked || "") || [];
    const when = year && MONTHS[Number(month) - 1] ? ` (${MONTHS[Number(month) - 1]} ${year})` : "";
    return parts.join(", ") + when;
}

function addResults(list, project) {
    const add = (label, value) => {
        if (!value) return;
        list.append(make("div", "", make("dt", "", label), make("dd", "", value)));
    };
    add("Result", project.result);
    add("MakerWorld", makerworldLine(project.makerworldStats));
}

/* ---------- Gallery (R2a, D33): one big picture, thumbnails to switch ---------- */

const KIND_LABEL = { cad: "CAD", photo: "Photo", drawing: "Drawing" };   // the tag in the picture's corner

// A drawing can carry its PDF: { "kind": "drawing", "src": "...png", "pdf": "assets/docs/....pdf" }.
// SECURITY: only a PDF in our own docs folder becomes a link (no other sites, no "javascript:")
const OWN_PDF = /^assets\/docs\/[\w./-]+\.pdf$/;

// The project's pictures. "images" is a list of { src, alt, kind, caption }.
// A project with only the older single "image" still works: it becomes a one-picture list
function projectImages(project) {
    const list = Array.isArray(project.images) && project.images.length
        ? project.images
        : [{ src: project.image, alt: project.alt || "", kind: "cad" }];
    const usable = list.filter((picture) => picture && picture.src);
    // No picture at all: the placeholder, so the tile and the entry still build (an empty list
    // would make pictures[0] undefined, and that error would stop every project after this one)
    return usable.length ? usable : [{ src: "assets/images/placeholder.svg", alt: "", kind: "" }];
}

function buildGallery(project) {
    const pictures = projectImages(project);
    // Here the picture IS the content, so it gets real alt text (from the JSON)
    const main = makeImage(pictures[0].src, pictures[0].alt || "");
    main.loading = "lazy";   // below the fold: the browser fetches it only when it's close to the screen
    const tag = make("span", "cad-tag");
    const count = make("span", "cad-count");            // "1 / 4", like daz (hidden with one picture)
    const caption = make("figcaption", "cad-caption");
    const art = make("div", "cad-art", main, tag, count);
    // <figure> + <figcaption>: the caption is tied to the picture for screen readers
    const figure = make("figure", "cad-figure", art, caption);

    const buttons = [];
    let current = 0;
    function show(i) {
        current = i;
        const picture = pictures[i];
        count.textContent = `${i + 1} / ${pictures.length}`;
        main.src = picture.src;
        main.alt = picture.alt || "";
        art.classList.toggle("is-drawing", picture.kind === "drawing");   // whole sheet, not cropped (projyles.css)
        tag.textContent = KIND_LABEL[picture.kind] || "";
        tag.hidden = !KIND_LABEL[picture.kind];
        // The caption, plus a link to the drawing's PDF when it has one (the sheet at full detail)
        caption.replaceChildren(picture.caption || "");
        if (OWN_PDF.test(picture.pdf || "")) {
            const pdf = make("a", "cad-pdf", "Open the drawing (PDF)");
            pdf.href = picture.pdf;
            caption.append(picture.caption ? " " : "", pdf);
        }
        caption.hidden = !caption.textContent;
        // aria-pressed tells screen readers which thumbnail is the one showing
        buttons.forEach((button, k) => button.setAttribute("aria-pressed", String(k === i)));
    }

    // Arrows and thumbnails only when there is something to switch to
    count.hidden = pictures.length < 2;
    if (pictures.length > 1) {
        // ‹ › on the picture's sides. They loop like a wheel: after the last picture comes the
        // first again, so the % (remainder) wraps the number around
        [[-1, "‹", "Previous"], [1, "›", "Next"]].forEach(([by, symbol, word]) => {
            const arrow = make("button", `cad-arrow is-${word.toLowerCase()}`, make("span", "", symbol));
            arrow.type = "button";
            arrow.firstChild.setAttribute("aria-hidden", "true");   // the label says what it does
            arrow.setAttribute("aria-label", `${word} picture of ${project.name}`);
            arrow.addEventListener("click", () => show((current + by + pictures.length) % pictures.length));
            art.append(arrow);
        });
        const thumbs = make("ul", "cad-thumbs");
        pictures.forEach((picture, i) => {
            const thumb = makeImage(picture.src);   // alt="" here: the button's name says what it shows
            thumb.loading = "lazy";
            const button = make("button", "cad-thumb", thumb);
            button.type = "button";
            button.setAttribute("aria-label",
                `Show picture ${i + 1} of ${pictures.length}: ${picture.alt || KIND_LABEL[picture.kind] || ""}`);
            button.addEventListener("click", () => show(i));
            buttons.push(button);
            thumbs.append(make("li", "", button));
        });
        figure.append(thumbs);
    }

    show(0);
    return figure;
}

/* ---------- The list beside the carousel (O5, A2) ---------- */

// One row: a small picture, the name, its DWG number. The whole row is ONE link down to the
// project's block. alt="" on the picture: the name inside the same link already says it all
function buildIndexRow(project, index, id) {
    // The small copy when there is one (tools/render.py): this picture is only 48 px wide
    const image = makeImage(project.thumb || projectImages(project)[0].src);
    image.loading = "lazy";
    // The " " between the two spans matters: without it a screen reader hears "Bridge Guitar01"
    const link = make("a", "index-row", image,
        make("span", "index-name", project.name), " ",
        make("span", "index-number", twoDigits(index + 1)));
    link.href = id ? `#${id}` : "#cad-sections";
    return make("li", "", link);
}

/* ---------- One project (O5, A1): the daz product layout ---------- */

// SECURITY: a MakerWorld link from the JSON only becomes a link if it really goes to MakerWorld
// over https. A typo or a pasted "javascript:..." address can never become a clickable link
const MAKERWORLD = /^https:\/\/makerworld\.com\//;

function buildEntry(project, index, id, next) {
    const titleId = id ? `${id}-title` : "";
    const title = make("h3", "cad-title", project.name);
    if (titleId) title.id = titleId;

    // "writeup" is optional: a list of paragraphs. [].concat() also accepts a single string
    const writeup = [].concat(project.writeup ?? []).map((text) => make("p", "", text));

    // The buttons under the specs: MakerWorld (when the JSON has a link), then the next project
    const actions = make("p", "cad-actions");
    if (MAKERWORLD.test(project.makerworld || "")) {
        const maker = make("a", "button button-solid", "MakerWorld");   // the shared button (styles.css, X8)
        maker.href = project.makerworld;
        actions.append(maker);
    }
    const onward = make("a", "cad-next", next ? `Next: ${next.name} ›` : "Back to the top ↑");
    onward.href = next && next.id ? `#${next.id}` : "#content";
    actions.append(onward);

    // The facts column. On wide screens it stays beside the picture and scrolls on its own
    // (projyles.css, THE FACTS COLUMN), like daz
    const stats = buildStats(project.stats, project.tool);
    addResults(stats, project);               // the proof rows go in the same table, last
    const info = make("div", "cad-info",
        make("p", "cad-kicker", joinMeta([twoDigits(index + 1), project.type, project.year])),
        title,
        make("p", "cad-lead", project.description || ""),
        stats,
        actions,
        ...writeup
    );

    // <article>: a self-contained piece that makes sense on its own, like a catalog entry
    const entry = make("article", "cad-entry", buildGallery(project), info);
    dragOutProject(entry, project); // the whole entry drags out (datacript.js)
    if (id) {
        entry.id = id;
        entry.setAttribute("aria-labelledby", titleId); // the article is named by its heading
    }
    return entry;
}

// The browser jumps to #bridge-guitar while the page loads, but the entry doesn't exist
// until the JSON arrives, so there's nothing to jump to. Once it's built, jump ourselves
function scrollToHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id && document.getElementById(id);
    if (target && target.classList.contains("cad-entry")) {
        target.scrollIntoView();
    }
}

async function initSections() {
    const entries = document.querySelector("#cad-entries");
    if (!entries) return;

    let projects;
    try {
        projects = await loadProjects();
    } catch (error) {
        console.error(`CAD sections not built: check ${PROJECTS_URL} for a typo, and serve the site with "python -m http.server" (fetch is blocked on file://).`, error);
        entries.append(make("p", "cad-note", "Projects couldn't load. Please try again later."));
        return;
    }

    const list = document.querySelector("#cad-index-list");
    // Check every id BEFORE adding any entry: once it's on the page, it would clash with itself
    const ids = projects.map((project) => (usableId(project.id) ? project.id : ""));
    projects.forEach((project, i) => {
        // "Next" only when the next project has a usable id to jump to; otherwise "Back to the top"
        const next = ids[i + 1] ? { id: ids[i + 1], name: projects[i + 1].name } : null;
        entries.append(buildEntry(project, i, ids[i], next));
        list?.append(buildIndexRow(project, i, ids[i]));
    });

    // The drawings' shared note (projects.html) shows once any project has a drawing
    const hasDrawing = projects.some((project) =>
        Array.isArray(project.images) && project.images.some((picture) => picture?.kind === "drawing"));
    const note = document.querySelector("#drawing-note");
    if (note) note.hidden = !hasDrawing;

    scrollToHash();
}

initSections();
