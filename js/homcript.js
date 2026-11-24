// Home page (O4, D51): one mosaic of the work, CAD projects and photos mixed, like brittanybravo.com.
// No words show until a tile is hovered or focused (css/homyles.css), but they're in every link,
// so screen readers and search engines still get them.
// (The hero and the featured card stack lived here until O4: git log -S "setupStack")
// Loaded with `defer` after js/datacript.js (loadProjects, fetchJson, make, makeImage, joinMeta, enableMasonry).

const HOME_ART_URL = "data/art.json";
const EAGER_TILES = 3;   // the first row loads straight away; the rest wait until they're near the screen (lazy)

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
    href: projectHref(project),            // its entry on the CAD page
    src: project.image,
    title: project.name,
    meta: joinMeta(["CAD", project.year])
});

// SECURITY: only our own image folder, the same check as artcript.js, so a typo or a pasted URL
// in art.json can't become a picture from somewhere else
const fromPhoto = (photo) => /^assets\/images\/[\w./-]+$/.test(photo.src || "") && {
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

async function initHome() {
    const grid = document.querySelector("#mosaic");
    if (!grid) return;

    // allSettled waits for both files and never throws: if one fails, the other still shows
    const [projects, art] = await Promise.allSettled([loadProjects(), fetchJson(HOME_ART_URL)]);
    for (const result of [projects, art]) {
        if (result.status === "rejected") {
            console.error(`Home: a data file didn't load. Check data/*.json for a typo, and serve the site with "python -m http.server".`, result.reason);
        }
    }
    const projectTiles = projects.status === "fulfilled" ? projects.value.map(fromProject) : [];
    const photoTiles = art.status === "fulfilled"
        ? art.value.filter((piece) => piece.kind === "photo").map(fromPhoto).filter(Boolean)
        : [];

    const tiles = interleave(projectTiles, photoTiles);
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
