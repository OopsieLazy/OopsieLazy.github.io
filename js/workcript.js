// The workshop (O8): the pixel-art room that IS the Code page.
// This file is ONLY the picture: it draws the room on a small canvas (576 x 300 pixels) from
// the art packs' sprites plus code-drawn objects, scales it to fill the window, and runs its
// slow animation.
// The things you can click are real HTML buttons and links laid over the canvas
// (codcript.js builds them from SPOTS below), so keyboards and screen readers never
// have to read the picture.
// Loaded with `defer` before codcript.js, which calls Workshop.mount().
//
// How the light works (the trick behind the depth), in three passes:
//   1. draw the room in its daytime colours
//   2. darken it all with one "multiply" colour for the time of day (dawn, dusk, night)
//   3. draw everything that MAKES light on top (fire, candles, the window, screens),
//      so the light sources stay bright while the room around them gets dark
// Passes 1 and 2 never move, so they're drawn ONCE per time of day into hidden canvases
// (a cache) and each frame just copies that picture: one drawImage instead of ~4,900
// little rectangles, ten times a second. Only the moving parts are drawn every frame.

const Workshop = (() => {
    // The ROOM you click around in is 384 x 216 (W x H): every object below is placed in it.
    // The PICTURE is bigger, 576 x 300 (RW x RH), with that room in its middle at (OX, OY): the
    // extra space is a deeper floor, a ceiling and wall at the sides, so the objects come out
    // smaller on a big screen and the window can crop into spare wall, never into an object
    // (owner, 2026-11-26: "smaller items, like actually in a room")
    const W = 384;
    const H = 216;
    const RW = 576, RH = 300, OX = 96, OY = 54;
    // Objects spread out across the bigger picture (owner, 2026-11-26: "larger gaps, not all piled
    // together"). Each group's shift [dx, dy] from where it was first drawn: its picture, its light,
    // its click area and its outline all move together. tools/workshop.py has the same table for
    // the sprites it pastes, so keep the two in step
    const SHIFT = {
        books: [-50, 0], box: [-50, 0], arms: [-50, -4], printer: [-10, 0], broom: [-14, 0],
        herbs: [-234, 0], anvil: [0, 0], fire: [19, -4],
        // The upper wall, spaced out (owner, 2026-11-26): map and blueprint apart, the scales
        // under the blueprint with air between, the lute by the window, and the tool rack down
        // over the anvil, within reach. The lantern centred between the furnace and the banner
        map: [16, 0], blueprint: [20, -4], scales: [14, 12], lute: [-176, -32],
        toolbox: [8, 34], lantern: [173, 25],
    };
    let curDX = 0, curDY = 0;   // the shift being drawn right now (candles remember it)
    function place(group, fn) {
        const [dx, dy] = SHIFT[group] || [0, 0];
        curDX = dx; curDY = dy;
        g.save(); g.translate(dx, dy); fn(); g.restore();
        curDX = 0; curDY = 0;
    }

    /* ---------- Where you can click (in canvas pixels) ----------
       shelf: a group of projects (code.json "shelf"); href: a link that leaves the room.
       codcript.js turns each one into a button or link on top of the canvas */
    const SPOTS = [
        { shelf: "books",    name: "Bookshelf",           x: 2,   y: 24,  w: 88, h: 142, group: "books" },
        { href: "projects.html", name: "3D printer", what: "CAD portfolio", x: 90, y: 86, w: 44, h: 82 , group: "printer" },
        { shelf: "voice",    name: "Speaking horn",       x: 136, y: 46,  w: 40, h: 32 },
        { nav: true, name: "Map", what: "Where to go", x: 150, y: 14, w: 46, h: 32 , group: "map" },
        { href: "aboutme.html", name: "Coat of arms", what: "About me", x: 36, y: 10, w: 21, h: 21, group: "arms" },
        { shelf: "web",      name: "Blueprint",           x: 204, y: 24,  w: 28, h: 24 , group: "blueprint" },
        { shelf: "market",   name: "Merchant's scales",   x: 206, y: 50,  w: 40, h: 26 , group: "scales" },
        { shelf: "toolbox",  name: "Tool rack",           x: 256, y: 16,  w: 36, h: 42 , group: "toolbox" },
        { shelf: "terminal", name: "Advanced rune tablet", x: 140, y: 78, w: 38, h: 40 },
        { shelf: "desk",     name: "Spellbook lectern",   x: 184, y: 96,  w: 30, h: 72 },
        { shelf: "games",    name: "Dice board",          x: 214, y: 108, w: 26, h: 12 },
        { shelf: "radio",    name: "Lute",                x: 248, y: 78,  w: 16, h: 36 , group: "lute" },
        { href: "art.html", name: "Bellows camera", what: "Photography", x: 218, y: 140, w: 40, h: 68 },
        { shelf: "box",      name: "Old chest",           x: 26,  y: 156, w: 48, h: 40 , group: "box" },
    ];

    /* ---------- The palette: warm stone, wood, brass and verdigris. No purple ---------- */
    const C = {
        ink: "#1E1915",
        stoneHi: "#9A9488", stoneLo: "#4E4A45",
        recess: "#241D18", recessLo: "#1A1411",
        floor1: "#58514A", floor2: "#625B52", floorHi: "#7A7268", floorLo: "#3E3934",
        wood: "#6E4A30", woodDark: "#47301F", woodLight: "#97683F", woodHi: "#B88A55",
        iron: "#3A3F42", ironLight: "#6E7578", ironHi: "#9AA2A5",
        brass: "#B98B3E", brassHi: "#E2C072", verdigris: "#4F8A7A", verdigrisDark: "#2F5A50", verdigrisHi: "#8BC2B0",
        parchment: "#E9DAB6", parchDark: "#C9B48A", burnt: "#6B4A2A", mapInk: "#5A3A22",
        leather: "#7A4A2B", leatherHi: "#A46B42", moss: "#53704C",
        fire: "#FFE08A", fire2: "#F5A623", fire3: "#E0602A", ember: "#9A3A1C",
        rune: "#3C9F9C", runeHi: "#9EDDD3", screenBg: "#0E1A17", screen: "#8FE0C0", screenDim: "#3F7F69",
        blueprint: "#2B4F7E", blueprintInk: "#B9D2EE", red: "#9E3A2E",
        printer: "#1C1E20", printerEdge: "#0E0F10", glass: "#22302F", mini: "#DCDCD6", miniDark: "#9C9C96",
        candle: "#EFE2BE",
    };

    /* ---------- Time of day: the window follows the visitor's own clock ---------- */
    const PHASES = {
        dawn:  { skyTop: "#9DB4C8", skyLow: "#F2C79E", hills: "#5E6F66", shaft: "#FFD9A8", shaftA: 0.20, ambient: "#E6D5C8", words: "Dawn in the workshop" },
        day:   { skyTop: "#A9CFDC", skyLow: "#E8F2EC", hills: "#4F7A6C", shaft: "#FFF1CC", shaftA: 0.26, ambient: null,      words: "Daylight in the workshop" },
        dusk:  { skyTop: "#46566A", skyLow: "#E8A06A", hills: "#3E4A48", shaft: "#FFB884", shaftA: 0.16, ambient: "#C9B2A2", words: "Dusk in the workshop" },
        night: { skyTop: "#0B141D", skyLow: "#1C2F40", hills: "#141E24", shaft: "#BCD4E6", shaftA: 0.07, ambient: "#5B6577", words: "Night in the workshop" },
    };
    function phaseNow(date = new Date()) {
        const h = date.getHours() + date.getMinutes() / 60;
        if (h >= 5 && h < 8) return "dawn";
        if (h >= 8 && h < 17) return "day";
        if (h >= 17 && h < 20) return "dusk";
        return "night";
    }

    /* ---------- Pixel helpers. g is the canvas's 2D context ---------- */
    let g;
    const R = (x, y, w, h, c) => { if (w > 0 && h > 0) { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); } };
    const P1 = (x, y, c) => R(x, y, 1, 1, c);
    const hl = (x, y, w, c) => R(x, y, w, 1, c);
    const vl = (x, y, h, c) => R(x, y, 1, h, c);
    const box = (x, y, w, h, fill, edge) => { R(x, y, w, h, edge); R(x + 1, y + 1, w - 2, h - 2, fill); };
    // A repeatable "random" number from two whole numbers: the same stone is the same
    // shape every frame, without storing anything
    const hash = (a, b) => (((a * 73856093) ^ (b * 19349663)) >>> 0) % 997;
    function line(x0, y0, x1, y1, c) {   // Bresenham: a 1-pixel line with no blur
        g.fillStyle = c;
        let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1, dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1, err = dx + dy;
        for (;;) {
            g.fillRect(x0, y0, 1, 1);
            if (x0 === x1 && y0 === y1) break;
            const e = 2 * err;
            if (e >= dy) { err += dy; x0 += sx; }
            if (e <= dx) { err += dx; y0 += sy; }
        }
    }
    function disc(cx, cy, r, c) {
        for (let y = -r; y <= r; y++) { const w = Math.floor(Math.sqrt(r * r - y * y + r * 0.6)); R(cx - w, cy + y, 2 * w + 1, 1, c); }
    }
    // Light, drawn the way Dead Cells and Eastward do: smooth light OVER the pixel art.
    // "screen" brightens what's under it; it can never darken.
    // Each gradient is centred on 0,0 and moved into place with translate(), so one made for
    // a given size and colour fits every glow like it: they're made once and kept in a Map
    const glows = new Map();
    function glow(cx, cy, r, color, alpha, squash = 1) {
        const key = `${r} ${color}`;
        if (!glows.has(key)) {
            const grad = g.createRadialGradient(0, 0, 0, 0, 0, r);
            grad.addColorStop(0, color);
            grad.addColorStop(1, "rgba(0,0,0,0)");
            glows.set(key, grad);
        }
        g.save();
        g.globalCompositeOperation = "screen";
        g.globalAlpha = alpha;
        g.translate(cx, cy);
        g.scale(1, squash);
        g.fillStyle = glows.get(key);
        g.fillRect(-r, -r, 2 * r, 2 * r);
        g.restore();
    }

    /* ======================= THE ROOM, back to front ======================= */


    /* ---------- The whole picture: ceiling, back wall and floor, in perspective ----------
       No side walls (owner's call): the depth comes from the ceiling beams and the floor joints,
       which all run toward one vanishing point a little above the middle of the room */
    const VX = OX + W / 2;
    function backdrop() {
        // Ceiling: dark planks, then beams running from the back beam toward you
        R(0, 0, RW, OY + 9, "#2A1D14");
        for (let y = 4; y < OY; y += 7) hl(0, y, RW, "#20160F");
        const VYc = OY + 150;
        for (let k = -5; k <= 13; k++) {
            const bx = OX + k * 48, tx = Math.round(VX + (bx - VX) * VYc / (VYc - OY));
            line(Math.round(bx), OY, tx, 0, C.woodDark); line(Math.round(bx) + 1, OY, tx + 2, 0, C.wood);
        }
        R(0, OY, RW, 9, C.woodDark); hl(0, OY + 1, RW, C.wood); hl(0, OY + 8, RW, C.ink);   // the back beam
        for (let x = OX + 30; x < OX + W; x += 96) { R(x, OY + 9, 4, 5, C.iron); P1(x + 1, OY + 10, C.ironHi); }
        // The back wall, across the whole picture
        g.drawImage(wallLayer, 0, 0); hl(0, OY + 167, RW, C.ink);
        floorFull();
    }
    // Flagstones in perspective: each row a bit taller than the one behind it, and the joints
    // fanning out from the vanishing point, so the floor reads as a surface you could walk on
    function floorFull() {
        const y0 = OY + 168, VYf = OY + 110;   // a low vanishing point: the joints fan out strongly
        R(0, y0, RW, RH - y0, C.floorLo);
        for (let y = y0, h = 5, r = 0; y < RH; y += h, h += 2, r++) {
            const xAt = (k) => Math.round(VX + (OX + (k + (r % 2) * 0.5) * 30 - VX) * (y - VYf) / (y0 - VYf));
            for (let k = -14; k <= 28; k++) {
                const a = xAt(k), b = xAt(k + 1);
                if (b < 0 || a > RW) continue;
                R(a + 1, y + 1, b - a - 1, h - 1, (k + r) % 2 ? C.floor1 : C.floor2);
                hl(a + 1, y + 1, b - a - 1, C.floorHi);
            }
        }
        rug();
    }
    // A rug in front of the bench, drawn as a trapezoid (narrow at the back, wide at the front):
    // the strongest "this is a floor you stand on" cue there is. Deep red with a worn gold border
    function rug() {
        const top = OY + 176, bottom = RH - 10;
        for (let y = top; y < bottom; y++) {
            const k = (y - top) / (bottom - top);
            const half = Math.round(78 + k * 46), cx = OX + 198;
            const edge = y === top || y === bottom - 1 || y - top === 2 || bottom - y === 3;
            // A deep, worn red: bright enough to read as a rug, never louder than the forge
            R(cx - half, y, 2 * half, 1, edge ? "#8A6A30" : "#6E2A22");
            R(cx - half, y, 2, 1, "#8A6A30"); R(cx + half - 2, y, 2, 1, "#8A6A30");
            if (!edge && (y - top) % 6 === 3) for (let x = cx - half + 8; x < cx + half - 8; x += 10) P1(x + ((y - top) % 12 === 3 ? 0 : 5), y, "#9A6A34");
        }
    }
    // The sides of the room: Manu_Art's statue, vase and banners on the left, kanmandev's little
    // furnace with ingots and ore on the right (that part comes from room-layer.png), and an
    // iron chandelier in the ceiling. Without the art packs the margins are simply bare wall
    function marginProps() {
        const floorLine = OY + 175;                     // where things standing on the floor end
        // A 16:9 screen trims about 21 px off each side of the picture, so nothing sits nearer the edge
        sprite("banner-red", 30, OY + 20);              // above the knight
        sprite("statue", 27, floorLine - 47);           // the knight, left of the bookshelf
        sprite("vase-stand", 136, floorLine - 31);      // the vase, right of it, on the same floor line
        sprite("banner-blue", 532, OY + 20);
        if (sprite("chandelier", OX + 176, 4)) vl(OX + 197, 0, 4, C.iron);            // over the bench
        if (sprite("chandelier-small", 82, 14)) vl(89, 0, 14, C.iron);              // over the bookshelf
    }
    function marginLight(phase) {
        const night = phase === "night";
        glow(OX + 197, 30, night ? 44 : 22, "#FFC46B", night ? 0.35 : 0.16);
        glow(90, 26, night ? 26 : 14, "#FFC46B", night ? 0.3 : 0.14);
        chimneySmoke(phase);
    }
    // Smoke from the furnace's chimney: soft puffs that rise, drift and fade (no clipping trick
    // needed: it's drawn over the finished frame, in a colour already dimmed for the time of day)
    let smokeT = 0;
    function chimneySmoke(phase) {
        const col = phase === "night" ? "#4A4744" : phase === "day" ? "#9A948C" : "#77716A";
        g.save();
        for (let i = 0; i < 6; i++) {
            const p = (smokeT * 0.5 + i * 9) % 54;
            const x = 448 + Math.sin((p + i * 4) / 7) * 5 + (i % 3), y = 80 - p;
            g.globalAlpha = 0.18 * (1 - p / 54);           // faint: a haze, not a row of balls
            disc(Math.round(x), Math.round(y), 1 + Math.floor(p / 20), col);
        }
        g.restore();
    }

    /* ---------- Sprites from the art packs (O8n) ----------
       tools/workshop.py cuts them out of the packs and recolours them into ONE sheet
       (assets/images/workshop/sprites.png + .json). The room waits for all of it: drawing
       first and swapping the art in later showed the old code-drawn room for a moment
       (owner, 2026-11-26), so the code-drawn stand-ins are gone and the room fades in once */
    let atlas = null, atlasMap = {}, roomLayer2 = null, wallLayer = null;
    // Sprites whose license forbids sharing the files come pre-placed in one picture-sized layer
    // (room-layer.png), drawn whole by drawLayer(). "layer" in the JSON says where each one is
    let outlining = false;   // true while buildOutlines() draws one object alone
    function drawLayer() { g.drawImage(roomLayer2, 0, 0); }
    // Draw one sprite with its top-left corner at (x, y). A layered one is already in the
    // picture, so it's only drawn while its object's outline is being worked out: its shape
    // is cut out of room-layer.png
    function sprite(name, x, y) {
        const placed = atlasMap.layer[name];
        if (placed) {
            if (outlining) g.drawImage(roomLayer2, placed[0], placed[1], placed[2], placed[3], x, y, placed[2], placed[3]);
            return;
        }
        const r = atlasMap[name];
        if (r) g.drawImage(atlas, r[0], r[1], r[2], r[3], x, y, r[2], r[3]);
    }
    // After tools/workshop.py rebuilds the art, change this (and the four preload links in
    // code.html to match): a new address makes every browser fetch the new pictures
    const ART_VERSION = "?v=20261126";
    function loadSprites(done, failed) {
        fetch(`assets/images/workshop/sprites.json${ART_VERSION}`)
            .then((response) => (response.ok ? response.json() : Promise.reject(new Error(response.status))))
            .then((map) => {
                const img = new Image(), layer = new Image(), wall = new Image();
                let left = 3;   // wait for all three pictures
                const ready = () => {
                    if (--left) return;
                    atlas = img; roomLayer2 = layer; wallLayer = wall; atlasMap = map; done();
                };
                img.onload = ready; layer.onload = ready; wall.onload = ready;
                img.onerror = failed; layer.onerror = failed; wall.onerror = failed;
                img.src = `assets/images/workshop/sprites.png${ART_VERSION}`;
                layer.src = `assets/images/workshop/room-layer.png${ART_VERSION}`;
                wall.src = `assets/images/workshop/wall-layer.png${ART_VERSION}`;
            })
            .catch(failed);   // no art, no room: the page shows the project table instead
    }

    // A bookshelf built into the wall: an arched recess, deep and dark, with the books,
    // candles, a figurine and bottles on four shelves
    const candles = [];   // filled while the cache is drawn; the light pass lights them every frame
    const addCandle = (x, y) => candles.push([x + curDX, y + curDY]);
    function bookAlcove() {
        const x0 = 10, x1 = 82, top = 34, archH = 20, bottom = 166, cx = (x0 + x1) / 2, hw = (x1 - x0) / 2;
        const archRow = (y, grow) => { const k = (top + archH - y) / archH; return Math.round((hw + grow) * Math.sqrt(Math.max(0, 1 - k * k))); };
        // The arch: a ring of grey bricks (voussoirs) 8 px deep over the recess, a keystone at the
        // top, and plain jambs down the sides (owner, 2026-11-26: "show more of the brick at the top")
        const ring = 8, cy = top + archH;
        for (let y = top - ring; y < bottom + 2; y++) {
            const k = (cy - y) / (archH + ring);
            const w = y < cy ? Math.round((hw + ring) * Math.sqrt(Math.max(0, 1 - k * k))) : hw + 5;
            R(cx - w, y, 2 * w, 1, y < cy ? "#8C8882" : (y % 6 === 0 ? C.stoneLo : C.stoneHi));
        }
        for (let a = 0; a <= 12; a++) {            // the joints between the bricks, fanning out
            const ang = Math.PI + (a / 12) * Math.PI;
            const xi = Math.round(cx + hw * Math.cos(ang)), yi = Math.round(cy + archH * Math.sin(ang));
            const xo = Math.round(cx + (hw + ring) * Math.cos(ang)), yo = Math.round(cy + (archH + ring) * Math.sin(ang));
            line(xi, yi, xo, yo, C.stoneLo);
        }
        R(cx - 4, top - ring - 1, 8, ring + 3, "#A29E96"); hl(cx - 4, top - ring - 1, 8, "#BAB6AE");   // keystone
        for (let y = top; y < bottom; y++) {
            const w = y < top + archH ? archRow(y, 0) : hw;
            R(cx - w, y, 2 * w, 1, y < top + 4 ? C.recessLo : C.recess);
        }
        // With the art packs: Manu_Art's bookcases fill the recess (two stacked, a low one under
        // them) and two candles stand on top, under the arch
        sprite("bookcase", 14, 54); sprite("bookcase-narrow", 62, 54); sprite("bookcase", 14, 102); sprite("bookcase-narrow", 62, 102);
        sprite("bookcase-low", 14, 150); sprite("bookcase-low-narrow", 62, 150);
        R(26, 48, 3, 6, C.candle); hl(26, 48, 3, "#FFFFFF"); addCandle(27, 46);
        R(64, 48, 3, 6, C.candle); hl(64, 48, 3, "#FFFFFF"); addCandle(65, 46);
    }

    // The grate window (after the Dead Cells reference): a deep stone arch with iron bars.
    // The sky inside is drawn in the light pass, so night outside stays night
    const WIN = { x: 96, y: 20, w: 40, h: 54, arch: 12 };
    function windowRow(y) {     // half-width of the opening at row y
        const hw = WIN.w / 2;
        if (y >= WIN.y + WIN.arch) return hw;
        const k = (WIN.y + WIN.arch - y) / WIN.arch;
        return Math.round(hw * Math.sqrt(Math.max(0, 1 - k * k)));
    }
    // The frame, built like the bookshelf's arch (owner, 2026-11-26: "repair the window like the
    // bookshelf"): a ring of grey voussoirs over the opening with a keystone, then jambs of
    // dressed stone down the sides, long and short blocks in turn so they key into the wall
    function windowFrame() {
        const cx = WIN.x + WIN.w / 2, hw = WIN.w / 2, ring = 6;
        const cy = WIN.y + WIN.arch, bottom = WIN.y + WIN.h;
        const face = "#8C8882", lit = "#A29E96";
        for (let y = WIN.y - ring; y < cy; y++) {            // the ring, an ellipse ring-thick
            const k = (cy - y) / (WIN.arch + ring);
            const w = Math.round((hw + ring) * Math.sqrt(Math.max(0, 1 - k * k)));
            R(cx - w, y, 2 * w, 1, face);
        }
        for (let a = 0; a <= 8; a++) {                         // the joints, fanning out from the middle
            const ang = Math.PI + (a / 8) * Math.PI;
            line(Math.round(cx + hw * Math.cos(ang)), Math.round(cy + WIN.arch * Math.sin(ang)),
                Math.round(cx + (hw + ring) * Math.cos(ang)), Math.round(cy + (WIN.arch + ring) * Math.sin(ang)), C.stoneLo);
        }
        for (let y = cy, n = 0; y < bottom; y += 7, n++) {     // the jambs: blocks 7 rows high
            const reach = n % 2 === 0 ? 7 : 5, h = Math.min(7, bottom - y);
            [cx - hw - reach, cx + hw].forEach((x) => {
                R(x, y, reach, h, face);
                hl(x, y, reach, C.stoneLo);                    // the joint above the block
                hl(x, y + 1, reach, lit);                      // its top catches the light
            });
            vl(cx - hw - reach, y, h, C.stoneLo); vl(cx + hw + reach - 1, y, h, C.stoneLo);
        }
        R(cx - 3, WIN.y - ring - 1, 6, ring + 3, lit); hl(cx - 3, WIN.y - ring - 1, 6, "#BAB6AE");   // keystone
        vl(cx - 3, WIN.y - ring - 1, ring + 3, C.stoneLo); vl(cx + 2, WIN.y - ring - 1, ring + 3, C.stoneLo);
        R(WIN.x - 8, bottom, WIN.w + 16, 4, C.stoneHi); hl(WIN.x - 8, bottom, WIN.w + 16, "#BAB6AE");      // the sill
        hl(WIN.x - 8, bottom + 4, WIN.w + 16, C.ink);
    }
    function windowSky(phase, t) {
        const P = PHASES[phase], cx = WIN.x + WIN.w / 2;
        for (let y = WIN.y; y < WIN.y + WIN.h; y++) {
            const w = windowRow(y), k = (y - WIN.y) / WIN.h;
            g.fillStyle = mix(P.skyTop, P.skyLow, k);
            g.fillRect(cx - w, y, 2 * w, 1);
        }
        if (phase === "night") {
            [[101, 30], [110, 25], [124, 33], [131, 41], [104, 45], [118, 40]].forEach(([x, y], i) => P1(x, y, (Math.floor(t / 14) + i) % 5 === 0 ? "#5E7486" : "#E8F0F4"));
            disc(124, 30, 4, "#E9EEDA"); disc(126, 29, 4, P.skyTop);   // a crescent moon
        } else if (phase === "day") {
            R(102, 36, 10, 2, "#FFFFFF"); R(104, 35, 5, 1, "#FFFFFF"); R(120, 30, 8, 2, "#FFFFFF");
        } else {
            disc(phase === "dawn" ? 106 : 126, 60, 5, phase === "dawn" ? "#FFE3B0" : "#FFC27A");
        }
        // Hills outside, like the artificer room: the same green, darker as the day ends
        for (let x = WIN.x; x < WIN.x + WIN.w; x++) { const hh = Math.round(7 + 3 * Math.sin(x / 6) + 2 * Math.sin(x / 2.6)); R(x, WIN.y + WIN.h - hh, 1, hh, P.hills); }
        // The bars, again on top: iron, 2 px wide, one cross bar. Each starts where the arch's
        // opening reaches it, so none sticks up into the stone at the top corners
        for (let x = WIN.x + 3; x < WIN.x + WIN.w - 1; x += 6) {
            let y = WIN.y;
            while (Math.max(Math.abs(x - cx), Math.abs(x + 2 - cx)) > windowRow(y)) y++;
            R(x, y, 2, WIN.y + WIN.h - y, C.iron); vl(x, y, WIN.y + WIN.h - y, C.ironLight);
        }
        R(WIN.x, WIN.y + 30, WIN.w, 2, C.iron); hl(WIN.x, WIN.y + 30, WIN.w, C.ironLight);
    }
    // Light through the grate: one beam per gap between the bars, falling down to the right,
    // so the bars cast stripes on the floor (the Dead Cells window). Strongest by day
    function windowShaft(phase) {
        const P = PHASES[phase];
        g.save();
        g.globalCompositeOperation = "screen";
        const grad = g.createLinearGradient(0, WIN.y, 0, 190);
        grad.addColorStop(0, hexA(P.shaft, P.shaftA * 1.6));
        grad.addColorStop(1, hexA(P.shaft, 0));
        g.fillStyle = grad;
        for (let x = WIN.x + 5; x < WIN.x + WIN.w - 1; x += 6) {
            for (let y = WIN.y + 14; y < 190; y++) {
                const drift = Math.round((y - WIN.y) * 0.62);   // the angle of the sun
                g.fillRect(x + drift, y, 4, 1);
            }
        }
        g.restore();
    }

    // The speaking horn (after the owner's verdigris horn): a brass-banded bell pointing out
    // through the grate, its tube curling back to a mouthpiece, a leather strap hanging under it
    function horn() {
        R(166, 62, 2, 14, C.iron); R(162, 74, 9, 2, C.iron);                      // wall bracket
        for (let i = 0; i <= 20; i++) {                                           // the tube, tapering as it curls down
            const x = 152 + i, y = 60 + Math.round(i * i / 30), th = Math.max(3, 7 - Math.floor(i / 5));
            R(x, y - (th >> 1), 1, th, C.verdigris);
            P1(x, y - (th >> 1), C.verdigrisHi);
            P1(x, y - (th >> 1) + th - 1, C.verdigrisDark);
        }
        R(157, 57, 2, 8, C.brass); P1(157, 57, C.brassHi);                       // brass bands
        R(165, 61, 2, 7, C.brass); P1(165, 61, C.brassHi);
        R(171, 72, 4, 4, C.brass); P1(172, 72, C.brassHi);                       // mouthpiece
        disc(147, 56, 10, C.verdigrisDark); disc(147, 56, 9, C.verdigris);           // the bell
        disc(145, 54, 6, "#1A2622"); disc(144, 53, 3, "#0F1714");                   // its dark mouth, toward the window
        for (let a = 0; a < 24; a++) {                                              // a brass rim round the mouth
            const ang = a / 24 * Math.PI * 2, x = Math.round(145 + Math.cos(ang) * 7), y = Math.round(54 + Math.sin(ang) * 7);
            P1(x, y, a < 12 ? C.brass : C.brassHi);
        }
        [[139, 49], [140, 48], [141, 47], [138, 51]].forEach(([x, y]) => P1(x, y, C.verdigrisHi));
        line(156, 66, 160, 76, C.leather); line(160, 76, 168, 72, C.leather);     // the strap
        P1(160, 75, C.leatherHi);
    }

    // A Middle-earth style map: burnt parchment, mountain chains, a forest, a river,
    // a dotted route and a compass. Its places stand for the site's pages
    function map() {
        const x = 150, y = 14, w = 46, h = 32;
        R(x, y, w, h, C.parchment);
        for (let i = 0; i < w; i++) {                     // a burnt, uneven edge
            if (hash(i, 1) % 3) P1(x + i, y, C.burnt); if (hash(i, 2) % 3) P1(x + i, y + h - 1, C.burnt);
            if (hash(i, 3) % 4 === 0) P1(x + i, y + 1, C.parchDark); if (hash(i, 4) % 4 === 0) P1(x + i, y + h - 2, C.parchDark);
        }
        for (let j = 0; j < h; j++) { if (hash(j, 5) % 3) P1(x, y + j, C.burnt); if (hash(j, 6) % 3) P1(x + w - 1, y + j, C.burnt); }
        R(x + w - 5, y + h - 5, 4, 4, C.parchDark); P1(x + w - 2, y + h - 2, C.burnt);     // a curled corner
        const mountain = (mx, my, s) => {
            for (let r = 0; r < s; r++) { P1(mx + s - r, my + r, C.mapInk); P1(mx + s + r, my + r, C.mapInk); if (r > 1) hl(mx + s + 1, my + r, r - 1, C.parchDark); }
        };
        [[153, 18, 4], [160, 16, 5], [169, 18, 4], [156, 24, 3], [165, 23, 3]].forEach(([a, b, s]) => mountain(a, b, s));
        for (let i = 0; i < 9; i++) { const fx = 178 + (i % 3) * 4 + (hash(i, 7) % 2), fy = 30 + Math.floor(i / 3) * 3; R(fx, fy, 2, 2, C.moss); }
        let ry = 26;
        for (let rx = 156; rx < 190; rx++) { ry += (hash(rx, 8) % 3) - 1; ry = Math.max(24, Math.min(40, ry + (rx % 9 === 0 ? 1 : 0))); P1(rx, ry, "#4E6B7A"); }
        for (let i = 0; i <= 12; i++) { if (i % 2) continue; P1(154 + i * 3, 41 - i, C.red); }   // the route, dotted
        R(186, 18, 2, 2, C.red);                                                              // X marks the spot
        vl(190, 37, 5, C.mapInk); hl(188, 39, 5, C.mapInk); P1(190, 36, C.red);                 // compass
        [[151, 15], [195, 15], [151, 44], [195, 44]].forEach(([a, b]) => P1(a, b, C.iron));     // nails
    }

    // This site's blueprint (from the artificer room): a page layout on blue paper
    function blueprint() {
        const x = 204, y = 24, w = 28, h = 24;
        R(x, y, w, h, C.blueprint);
        for (let i = x + 3; i < x + w; i += 4) vl(i, y + 1, h - 2, "rgba(185,210,238,0.18)");
        for (let j = y + 3; j < y + h; j += 4) hl(x + 1, j, w - 2, "rgba(185,210,238,0.18)");
        R(x + 3, y + 3, w - 6, 3, C.blueprintInk);                       // the header
        R(x + 12, y + 4, 4, 1, C.blueprint);                             // the name in it
        for (let i = 0; i < 3; i++) { R(x + 3 + i * 8, y + 9, 6, 8, "rgba(185,210,238,0.55)"); hl(x + 3 + i * 8, y + 18, 6, C.blueprintInk); }
        hl(x + 3, y + 21, w - 6, C.blueprintInk);                        // the footer
        R(x + w - 4, y + h - 4, 4, 4, "#3E6795");                         // a peeled corner
        P1(x + 2, y + 1, C.red); P1(x + w - 3, y + 1, C.red);
    }

    // The merchant's scales on a shelf, not balanced: the trading tools
    function scales() {
        R(206, 72, 40, 3, C.woodLight); hl(206, 72, 40, C.woodHi); hl(206, 75, 40, C.ink);
        R(210, 75, 2, 5, C.iron); R(240, 75, 2, 5, C.iron);
        vl(226, 52, 20, C.brass); R(223, 70, 7, 2, C.brass); R(225, 50, 3, 3, C.brassHi);
        line(212, 56, 240, 52, C.brass);
        line(212, 56, 209, 64, C.brass); line(212, 56, 215, 64, C.brass); R(207, 64, 10, 2, C.brass);
        line(240, 52, 237, 60, C.brass); line(240, 52, 243, 60, C.brass); R(235, 60, 10, 2, C.brass);
        R(209, 62, 6, 2, C.brassHi); P1(211, 61, C.brassHi);                // coins in the low pan
        R(234, 66, 6, 6, C.parchment); hl(234, 68, 6, C.mapInk); hl(234, 70, 6, C.mapInk); // the ledger
    }

    // The smith's rack: tongs, hammers, a chisel, and a horseshoe nailed on for luck
    function toolRack() {
        box(256, 22, 36, 34, "#7A5636", C.ink); hl(257, 23, 34, C.woodHi); for (let y = 31; y < 55; y += 6) hl(257, y, 34, "#6A4A2E");
        R(270, 15, 8, 2, C.iron); R(270, 15, 2, 6, C.iron); R(276, 15, 2, 6, C.iron); P1(274, 15, C.ironHi);
        R(258, 28, 32, 2, C.woodLight);
        sprite("tongs", 260, 30); sprite("hammer", 266, 31);                                              // kanmandev's tongs and hammer
        R(276, 30, 2, 18, C.woodHi); R(274, 29, 6, 3, C.ink); P1(279, 30, C.ironHi);                     // cross-peen
        R(284, 30, 2, 12, C.ironLight); R(284, 42, 2, 5, C.wood);                                        // chisel
        R(288, 30, 2, 14, C.leather);                                                                    // a strop
    }

    // The lute hangs on a peg, low on the wall
    function lute() {
        R(255, 78, 2, 3, C.iron);
        line(254, 81, 258, 85, C.woodDark); R(256, 83, 2, 14, C.woodDark);
        disc(256, 104, 7, C.woodLight); disc(256, 104, 6, C.wood);
        disc(256, 102, 2, C.ink); hl(252, 109, 9, C.woodDark);
        vl(256, 86, 22, C.parchment);
        [[251, 99], [252, 98], [253, 97]].forEach(([x, y]) => P1(x, y, C.woodHi));
    }

    function herbs() {
        [[298, 22, C.moss], [305, 18, "#7A6A3A"], [312, 24, C.moss]].forEach(([x, len, c]) => {   // herbs drying
            vl(x + 1, 9, 4, C.leather);
            for (let j = 0; j < len - 4; j++) R(x + (j % 3 === 0 ? 0 : 1), 13 + j, j > len - 9 ? 2 : 3, 1, j % 4 === 0 ? "#3E5236" : c);
        });
    }
    function broom() {
        line(86, 118, 84, 166, C.woodLight);                                               // a broom against the wall
        for (let i = 0; i < 6; i++) line(84, 158, 80 + i * 2, 167, i % 2 ? "#B89A5A" : "#9A7E44");
    }
    // A round shield over the bookshelf: the coat of arms, which leads to About
    function shield() {
        disc(46, 20, 9, C.woodDark); disc(46, 20, 8, C.wood);
        for (let i = -8; i <= 8; i += 4) vl(46 + i, 13, 15, C.woodDark);
        disc(46, 20, 3, C.ironLight); P1(45, 19, C.ironHi);
        for (let a = 0; a < 20; a++) { const ang = a / 20 * Math.PI * 2; P1(Math.round(46 + Math.cos(ang) * 8), Math.round(20 + Math.sin(ang) * 8), C.iron); }
    }

    // A lantern: karsiori's, on a wall bracket right of the forge
    function lantern() {
        sprite("lantern", 233, 12);                                                       // karsiori's lantern
        R(244, 9, 12, 2, C.iron); R(254, 7, 2, 8, C.iron); vl(245, 11, 2, C.iron);         // on a wall bracket
    }

    /* ---------- The fire in kanmandev's furnace (the furnace itself is in room-layer.png) ---------- */
    function fireLight(t, still) {
        const f = still ? 1 : Math.floor(t / 3) % 3;
        // coals
        for (let x = 318; x < 354; x++) P1(x, 147 - (hash(x, 1) % 3), hash(x, f) % 3 ? C.ember : C.fire3);
        R(318, 146, 36, 3, C.ember);
        // flames: three layers, the shape changes every 0.3 s (well under 3 flashes a second)
        const flame = (w, h, col, off) => { for (let x = 336 - w; x < 336 + w; x++) { const hh = h - Math.abs(x - 336) / (w / h * 1.2) + ((hash(x, f + off) % 4) - 1); R(x, 146 - hh, 1, Math.max(0, hh), col); } };
        flame(17, 18, C.fire3, 0); flame(12, 14, C.fire2, 4); flame(6, 9, C.fire, 8);
        glow(336, 134, 92, "#FF9A3C", 0.42);              // on the wall and hood
        glow(336, 178, 70, "#FF9A3C", 0.32, 0.35);        // a pool on the floor
        glow(336, 128, 22, "#FFE08A", 0.5);
    }
    // Embers rising from the fire: each one on its own fixed path, warm colours only
    function embers(t) {
        for (let i = 0; i < 9; i++) {
            const life = 16 + (i * 7) % 9, p = (t + i * 5) % life;
            const vx = ((i * 37) % 11 - 5) * 0.35;
            const x = 336 + vx * p, y = 132 - p * 1.6 + p * p * 0.03;
            const col = [C.fire, C.fire2, C.fire3, C.ember][Math.min(3, Math.floor(p / life * 4))];
            P1(Math.round(x), Math.round(y), col);
        }
    }
    /* ---------- The 3D printer (CAD): an enclosed box with an A1 mini strapped on the roof ---------- */
    function printer() {
        // A sturdy little table
        R(90, 152, 44, 4, C.woodLight); hl(90, 152, 44, C.woodHi); hl(90, 156, 44, C.ink);
        R(92, 156, 4, 12, C.woodDark); R(128, 156, 4, 12, C.woodDark);
        // The enclosure
        box(94, 110, 36, 42, C.printer, C.printerEdge);
        R(97, 113, 30, 32, C.glass);
        for (let i = 0; i < 6; i++) P1(99 + i, 120 - i, "rgba(255,255,255,0.20)");            // a reflection
        vl(126, 118, 18, C.ironLight);                                                         // door handle
        R(98, 147, 7, 3, "#2E3A3A");                                                           // the touchscreen (lit below)
        // The A1 mini, strapped on top
        R(100, 106, 24, 4, C.mini); hl(100, 109, 24, C.miniDark);
        R(101, 88, 3, 18, C.mini); vl(103, 88, 18, C.miniDark);
        R(103, 91, 16, 2, C.mini);
        R(106, 103, 16, 2, "#3A3A3A");
        R(104, 105, 2, 7, C.leather); R(118, 105, 2, 7, C.leather); P1(104, 107, C.brass); P1(118, 107, C.brass);
    }
    function printerLight(t, still) {
        // Inside: an LED strip, the bed, a print slowly growing, the head moving
        R(98, 114, 28, 1, "#DDE7E2");
        g.save(); g.globalAlpha = 0.16; R(98, 115, 28, 30, "#DDE7E2"); g.restore();
        R(99, 140, 26, 2, C.ironLight);
        const grow = still ? 7 : 2 + Math.floor(t / 25) % 12;
        R(108, 140 - grow, 9, grow, "#4F8A6A"); hl(108, 140 - grow, 9, "#7DB894");
        const head = still ? 10 : pingpong(Math.floor(t / 2), 16);
        hl(98, 118, 28, C.ironLight); R(100 + head, 117, 6, 4, C.mini); P1(102 + head, 121, C.fire2);
        R(99, 148, 5, 1, C.screen);
        // The A1 mini's head and status light
        R(112 + (still ? 0 : pingpong(Math.floor(t / 3), 5)), 93, 5, 5, "#2E2E2E"); P1(116, 94, "#5BC46A");
    }
    const pingpong = (t, n) => { const m = t % (2 * n); return m < n ? m : 2 * n - m; };

    /* ---------- The workbench and what's on it ---------- */
    function bench() {
        R(136, 118, 126, 4, C.woodLight); hl(136, 118, 126, C.woodHi); hl(136, 122, 126, C.ink);
        R(140, 122, 5, 46, C.woodDark); R(253, 122, 5, 46, C.woodDark); hl(145, 150, 108, C.woodDark);
    }
    // The advanced rune tablet: a computer cased in carved stone, with an LCD screen
    function runeTablet() {
        box(140, 84, 38, 27, "#6E766F", C.ink);
        hl(141, 85, 36, "#8E968E");
        R(144, 88, 30, 20, C.ink);
        R(145, 89, 28, 18, C.screenBg);
        [[142, 90], [142, 96], [142, 102], [176, 92], [176, 99], [176, 105]].forEach(([x, y]) => { P1(x, y, "#4A524B"); P1(x, y + 1, "#4A524B"); });
        R(140, 84, 3, 3, C.brass); R(175, 84, 3, 3, C.brass); R(140, 108, 3, 3, C.brass); R(175, 108, 3, 3, C.brass);
        R(154, 111, 10, 3, "#5C635D");                                            // stand
        box(142, 114, 34, 4, "#7A827A", C.ink);                                   // the stone keyboard
        for (let i = 144; i < 174; i += 3) P1(i, 115, "#A3AAA2");
        R(157, 78, 4, 6, "#2F6E6A"); P1(158, 77, "#2F6E6A");                     // the power crystal on top
    }
    function runeTabletLight(t, still) {
        [[147, 91, 3], [151, 91, 10], [147, 95, 14], [147, 99, 8], [147, 103, 3]].forEach(([x, y, w], i) => hl(x, y, w, i === 0 || i === 4 ? C.screen : C.screenDim));
        P1(147, 103, C.screen); P1(148, 104, C.screen); P1(147, 105, C.screen);   // the ">" of the prompt
        if (still || Math.floor(t / 5) % 2 === 0) R(150, 105, 4, 1, C.screen);   // the cursor, 1 blink a second
        const pulse = still ? 1 : 0.6 + 0.4 * Math.sin(t / 8);
        [[142, 90], [142, 96], [142, 102], [176, 92], [176, 99], [176, 105]].forEach(([x, y]) => { P1(x, y, C.rune); });
        R(157, 78, 4, 6, C.rune); P1(158, 79, C.runeHi);
        glow(159, 80, 10, "#3C9F9C", 0.35 * pulse);
        glow(159, 98, 26, "#8FE0C0", 0.10);
    }
    function lectern() {
        R(184, 160, 30, 8, C.woodDark); hl(184, 160, 30, C.wood); hl(184, 167, 30, C.ink);
        R(193, 118, 12, 42, C.wood); vl(193, 118, 42, C.woodHi); vl(204, 118, 42, C.woodDark);
        R(192, 126, 14, 2, C.iron); R(192, 150, 14, 2, C.iron);
        for (let y = 130; y < 148; y += 4) P1(198, y, C.woodDark);
        for (let j = 0; j < 12; j++) R(184 + Math.floor(j / 3), 106 + j, 30 - Math.floor(j / 3) * 2, 1, j > 9 ? C.woodDark : C.woodLight);
        R(186, 98, 12, 9, C.parchment); R(199, 98, 12, 9, C.parchment);       // the open book
        vl(198, 97, 10, C.leather); R(185, 106, 28, 2, C.leather);
        R(209, 106, 2, 6, C.red);                                               // a ribbon
        R(212, 100, 2, 6, C.candle); addCandle(212, 98);
    }
    function lecternLight(t, still) {
        const on = still || Math.floor(t / 10) % 2 === 0;
        [100, 102, 104].forEach((y) => { hl(188, y, 8, on ? C.rune : "#5C8C88"); hl(200, y, 8, on ? C.rune : "#5C8C88"); });
        if (on) glow(198, 101, 14, "#9EDDD3", 0.35);
    }
    function diceBoard() {
        box(214, 112, 18, 6, C.parchment, C.woodDark);
        for (let i = 216; i < 230; i += 4) R(i, 114, 2, 2, C.woodDark);
        R(234, 113, 4, 4, C.candle); P1(235, 114, C.ink); P1(236, 115, C.ink);
        R(232, 116, 2, 2, C.red);
        R(180, 112, 3, 6, C.candle); addCandle(181, 110);
    }
    // Manu_Art's globe sits beside the dice board but is its own thing: drawn apart, so the
    // board's outline (SPOT_ART) stops at the board instead of wrapping the globe too
    function globe() { sprite("globe", 240, 103); }
    function anvil() {
        R(272, 154, 14, 16, C.woodDark); hl(272, 158, 14, C.wood); hl(272, 164, 14, C.wood);
        // kanmandev's anvil (hot steel and all) and the quench bucket are in room-layer.png
    }
    function anvilLight() {   // the hot steel on the anvil glows
        glow(282, 140, 10, "#FF9A3C", 0.35);
    }
    // A bellows camera on a wooden tripod: for the Art page
    function camera() {
        line(239, 166, 226, 206, C.woodDark); line(239, 166, 252, 206, C.woodDark); line(239, 166, 239, 204, C.wood);
        P1(226, 206, C.brass); P1(252, 206, C.brass); P1(239, 204, C.brass);
        R(235, 164, 9, 3, C.brass);                                              // tripod head
        R(220, 146, 9, 22, "#1E1A18"); for (let y = 148; y < 168; y += 3) P1(221 + (y % 2), y, "#33302C");   // the focusing cloth
        R(228, 146, 7, 20, C.woodLight); vl(228, 146, 20, C.woodHi); hl(228, 165, 7, C.woodDark);         // back
        for (let i = 0; i < 12; i++) {                                            // the bellows, folding toward the lens
            const h = 16 - Math.floor(i / 3);
            R(235 + i, 148 + Math.floor((16 - h) / 2), 1, h, i % 2 ? "#1F1F1F" : "#3A3836");
        }
        R(247, 145, 6, 22, C.woodLight); vl(252, 145, 22, C.woodDark); hl(247, 145, 6, C.woodHi);         // front
        R(253, 151, 5, 9, C.brass); hl(253, 151, 5, C.brassHi);                                           // lens barrel
        P1(257, 154, "#BFD8E6"); P1(257, 155, "#7FA6BA"); P1(256, 156, "#7FA6BA");
        R(238, 143, 3, 3, C.brass);                                                                     // a knob on top
    }
    function chest() {
        sprite("chest", 26, 156);   // Whimsy Hallow's chest, in front of the shelf (room layer)
    }

    // Foreground: dark shapes close to you, rim-lit by the forge. This is what gives depth.
    // Placed in the WHOLE picture, at its own edges
    function foreground() {
        const fg = "#141010";
        R(0, RH - 46, 22, 46, fg); hl(0, RH - 36, 22, "#2A2220"); hl(0, RH - 16, 22, "#2A2220"); vl(21, RH - 44, 44, "#3A2A22");   // barrel
        for (let y = 0; y < 70; y += 3) { R(RW - 30, y, 2, 2, fg); P1(RW - 28, y + 1, "#3A2A22"); }                              // a chain
        R(RW - 33, 70, 7, 2, fg); R(RW - 33, 70, 2, 6, fg);                                                                       // its hook
        R(RW - 40, RH - 22, 40, 22, fg); disc(RW - 26, RH - 22, 9, fg); disc(RW - 10, RH - 20, 10, fg);                            // a coal sack
        P1(RW - 33, RH - 28, "#6B2E18"); P1(RW - 17, RH - 30, "#6B2E18");
    }
    function candleLight(t, still) {
        candles.forEach(([x, y], i) => {
            const f = still ? 0 : (Math.floor(t / 4) + i) % 2;
            P1(x, y - f, C.fire); P1(x, y + 1, C.fire2);
            glow(x, y, 9, "#FFC46B", 0.30);
        });
    }
    function lanternLight(phase) {
        glow(245, 34, phase === "night" ? 34 : 18, "#FFC46B", phase === "night" ? 0.4 : 0.22);
    }
    // Dust drifting through the sunbeam (day only)
    function motes(t, still) {
        if (still) return;
        for (let i = 0; i < 8; i++) {
            const p = (t * 0.4 + i * 13) % 80;
            const x = 112 + i * 7 + Math.round(p * 0.6), y = 40 + Math.round(p) + Math.round(Math.sin((t + i * 10) / 9) * 2);
            P1(x, y, "rgba(255,244,214,0.55)");
        }
    }

    /* ---------- Colour helpers for the light pass ---------- */
    function mix(a, b, k) {
        const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
        const ch = (s) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k);
        return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
    }
    function hexA(hex, a) { const p = parseInt(hex.slice(1), 16); return `rgba(${(p >> 16) & 255},${(p >> 8) & 255},${p & 255},${a})`; }

    /* ======================= The cache: the parts that never move ======================= */
    // Two hidden canvases the same size as the real one (never added to the page):
    //   roomLayer: pass 1 only, the room in daylight colours (minus the smoke)
    //   litLayer:  pass 1 + pass 2, the room already darkened for the time of day
    const layer = () => Object.assign(document.createElement("canvas"), { width: RW, height: RH });
    const roomSized = () => Object.assign(document.createElement("canvas"), { width: W, height: H });
    // Draw room objects in the room's own coordinates, wherever the room sits in the picture
    function inRoom(fn) { g.save(); g.translate(OX, OY); fn(); g.restore(); }
    const roomLayer = layer(), litLayer = layer();
    const frameLayer = layer();   // one finished frame of the room, before it's placed in the window
    let baked = null;   // which time of day the cache holds

    // 2. The time of day: one colour multiplied over everything (white would change nothing)
    function shade(phase) {
        const P = PHASES[phase];
        if (P.ambient) { g.save(); g.globalCompositeOperation = "multiply"; R(0, 0, RW, RH, P.ambient); g.restore(); }
        // A vignette: the corners fall into shadow, which pulls your eye to the middle
        g.save(); g.globalCompositeOperation = "multiply";
        const cx = OX + W * 0.55, cy = OY + H * 0.55;
        const v = g.createRadialGradient(cx, cy, H * 0.5, cx, cy, RW * 0.62);
        v.addColorStop(0, "rgba(255,255,255,1)"); v.addColorStop(1, "rgba(60,52,48,1)");
        g.fillStyle = v; g.fillRect(0, 0, RW, RH); g.restore();
    }
    function bake(phase) {
        const screen = g;   // the helpers draw on whatever g is: point it at a layer, then back
        candles.length = 0;
        // 1. The room in daylight colours, back to front
        g = roomLayer.getContext("2d");
        backdrop(); marginProps();
        inRoom(() => {
            place("books", bookAlcove); windowFrame(); horn(); place("map", map); place("blueprint", blueprint); place("scales", scales);
            place("toolbox", toolRack); place("lute", lute); place("lantern", lantern); place("herbs", herbs); place("broom", broom);
            place("printer", printer); bench(); runeTablet(); diceBoard(); globe(); lectern(); place("anvil", anvil); camera();
            place("box", chest); place("arms", shield);
        });
        drawLayer(); foreground();
        // 2. A copy of it, darkened for the time of day
        g = litLayer.getContext("2d");
        g.drawImage(roomLayer, 0, 0);
        shade(phase);
        g = screen;
        baked = phase;
    }

    /* ======================= One frame ======================= */
    function draw(t, phase, still) {
        if (baked !== phase) bake(phase);   // a new time of day: redraw the cache once
        // Passes 1 + 2, straight from the cache
        g.drawImage(litLayer, 0, 0);
        smokeT = t;
        // 3. Everything that gives off light, on top
        inRoom(() => {
            windowSky(phase, t); windowShaft(phase);
            if (phase === "day") motes(t, still);
            place("fire", () => { fireLight(t, still); if (!still) embers(t); });   // in the furnace's mouth
            place("anvil", anvilLight);
            candleLight(t, still); place("lantern", () => lanternLight(phase));
            place("printer", () => printerLight(t, still)); runeTabletLight(t, still); lecternLight(t, still);
        });
        marginLight(phase);
        foreground();   // again, so the light never spills over the closest shapes
    }

    /* ======================= Outlines that hug the object (O8k) ======================= */
    // Each clickable object is drawn ALONE on a clear canvas: whatever it painted is its shape
    // (its mask). The outline is every pixel 2 away from that shape: 1 pixel of air, then a
    // light line, with a dark line outside it so it shows on pale stone too
    const SPOT_ART = {
        "Bookshelf": [bookAlcove], "3D printer": [printer], "Speaking horn": [horn], "Map": [map],
        "Blueprint": [blueprint], "Merchant's scales": [scales], "Tool rack": [toolRack],
        "Advanced rune tablet": [runeTablet], "Spellbook lectern": [lectern], "Dice board": [diceBoard],
        "Lute": [lute], "Bellows camera": [camera], "Old chest": [chest], "Coat of arms": [shield],
    };
    const outlines = {};
    function buildOutlines() {
        const saved = g;
        for (const spot of SPOTS) {
            const art = SPOT_ART[spot.name];
            if (!art) continue;
            const shape = roomSized();
            g = shape.getContext("2d");
            outlining = true;
            art.forEach((fn) => fn());
            outlining = false;
            const a = g.getImageData(0, 0, W, H).data;
            const solid = (x, y) => x >= 0 && y >= 0 && x < W && y < H && a[(y * W + x) * 4 + 3] > 0;
            // Is there any of the shape within r pixels (a round brush, not a square one)?
            const near = (x, y, r) => {
                for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
                    if (dx * dx + dy * dy <= r * r + 1 && solid(x + dx, y + dy)) return true;
                }
                return false;
            };
            const ring = roomSized(), rc = ring.getContext("2d");
            // Only look near the object's own box, not the whole picture
            for (let y = Math.max(0, spot.y - 6); y < Math.min(H, spot.y + spot.h + 6); y++) {
                for (let x = Math.max(0, spot.x - 6); x < Math.min(W, spot.x + spot.w + 6); x++) {
                    if (solid(x, y) || near(x, y, 1)) continue;          // the shape and its 1 px of air
                    if (near(x, y, 2)) { rc.fillStyle = "#FFFFFF"; rc.fillRect(x, y, 1, 1); }
                    else if (near(x, y, 3)) { rc.fillStyle = "#14100D"; rc.fillRect(x, y, 1, 1); }
                }
            }
            outlines[spot.name] = ring;
        }
        g = saved;
        candles.length = 0;   // drawing the objects alone added their candles: the cache adds them again
        baked = null;
    }

    /* ======================= The tower (O8m): phones get the room as floors ======================= */
    // A phone is too narrow for a wide room, so the same picture is cut into three slices where
    // nothing stands and stacked floor on floor inside drawn stone walls, a turret and roof on top,
    // like a cutaway tower: you scroll DOWN through it, never sideways (owner, 2026-11-26, after a
    // tower painting). Only where each slice lands changes, so the sprites, the light, the
    // animation and the outlines all come along without a second drawing of the room
    const FY0 = 56, FH = 208;                  // each floor shows the picture's rows 56 to 264
    const SKY = 26, ROOF = 50, SLAB = 10, BASE = 26;
    const TW = 224;                            // the tower's width, in the same pixels as the room
    const FLOORS = [                           // top to bottom, each a slice [x0, x0 + w) of the picture
        { x0: 20, w: 136 },                    // the turret: bookshelf, chest, coat of arms
        { x0: 156, w: 203 },                   // the study: printer, window, desk, maps
        { x0: 359, w: 208 },                   // the ground floor: tool rack, anvil, forge (heavy things low)
    ];
    let floorTop = SKY + ROOF;
    FLOORS.forEach((f) => { f.tx = Math.floor((TW - f.w) / 2); f.ty = floorTop; floorTop += FH + SLAB; });
    const TH = floorTop - SLAB + BASE;
    const TURRET = [FLOORS[0].tx - 8, FLOORS[0].tx + FLOORS[0].w + 8];   // its outer walls, 8 thick
    const LEDGE = FLOORS[0].ty + FH;          // the walk round the turret, on top of the wide tower

    // The time of day's multiply, worked out per colour (the walls are drawn on their own canvas,
    // so the room's shade() can't reach them): "#808080" times "#FF8000" = "#804000"
    const mul = (a, b) => {
        if (!b) return a;
        const ch = (hex, i) => parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16);
        return "#" + [0, 1, 2].map((i) => Math.round((ch(a, i) * ch(b, i)) / 255).toString(16).padStart(2, "0")).join("");
    };
    const shellLayer = Object.assign(document.createElement("canvas"), { width: TW, height: TH });
    let shellPhase = null;
    // Everything round the floors: sky, roof, walls, the floors between them, the hill. It never
    // moves, so it's drawn once per time of day, like the room's cache
    function buildShell(phase) {
        const screen = g;
        g = shellLayer.getContext("2d");
        g.clearRect(0, 0, TW, TH);
        const P = PHASES[phase], T = (c) => mul(c, P.ambient);
        const mortar = T("#3A3632"), stone = T("#5A554F"), stoneTop = T("#6E6860"), cutFace = T("#8C867C"), shadow = T("#2A2622");
        // Stone courses 5 pixels high, the joints staggered every other row
        function stones(x, y, w, h) {
            R(x, y, w, h, stone);
            for (let yy = y; yy < y + h; yy += 5) {
                hl(x, yy, w, mortar);
                for (let bx = x - (Math.floor(yy / 5) % 2) * 6; bx < x + w; bx += 12) {
                    if (bx > x) R(bx, yy, 1, Math.min(5, y + h - yy), mortar);
                    if (hash(bx, yy) % 3 === 0) hl(Math.max(x, bx + 1), yy + 1, Math.min(10, x + w - bx - 1), stoneTop);
                }
            }
        }
        // The sky and far hills, behind the roof and either side of the turret
        const sky = g.createLinearGradient(0, 0, 0, LEDGE);
        sky.addColorStop(0, P.skyTop); sky.addColorStop(1, P.skyLow);
        g.fillStyle = sky; g.fillRect(0, 0, TW, LEDGE);
        if (phase === "night") for (let i = 0; i < 40; i++) P1(hash(i, 1) % TW, hash(i, 2) % (LEDGE - 40), "#DDE6EE");
        for (let x = 0; x < TW; x++) {
            const top = LEDGE - 16 - Math.round(5 * Math.sin(x / 19) + 3 * Math.sin(x / 7));
            R(x, top, 1, LEDGE - top, P.hills);
        }
        // The walls beside each floor. The turret's stand alone; the tower's run to the edges
        FLOORS.forEach((f, i) => {
            const left = i === 0 ? TURRET[0] : 0, right = i === 0 ? TURRET[1] : TW;
            stones(left, f.ty, f.tx - left, FH);
            stones(f.tx + f.w, f.ty, right - f.tx - f.w, FH);
            // A round tower: its outer edge turns away from the light into shadow
            vl(left, f.ty, FH, shadow); vl(right - 1, f.ty, FH, shadow);
            // The cut: a pale face where the wall was sliced open, then a dark line into the room
            vl(f.tx - 2, f.ty, FH, cutFace); vl(f.tx - 1, f.ty, FH, C.ink);
            vl(f.tx + f.w, f.ty, FH, C.ink); vl(f.tx + f.w + 1, f.ty, FH, cutFace);
            // An arrow slit in each wall
            R(left + 3, f.ty + 70, 2, 12, C.recessLo); R(right - 5, f.ty + 120, 2, 12, C.recessLo);
        });
        // The floors between the floors: a dark line, the floorboards' ends, stone, and a hatch
        // with a ladder (the way up) at alternate ends
        function slab(y, hatchX) {
            R(0, y, TW, SLAB, stone);
            stones(0, y + 4, TW, SLAB - 5);
            hl(0, y, TW, C.ink);
            R(0, y + 1, TW, 2, T(C.wood)); hl(0, y + 3, TW, T(C.woodDark));
            hl(0, y + SLAB - 1, TW, C.ink);
            R(hatchX, y + 1, 12, SLAB - 2, C.recessLo);
            vl(hatchX + 2, y + 1, SLAB - 2, T(C.woodLight)); vl(hatchX + 9, y + 1, SLAB - 2, T(C.woodLight));
            [3, 6].forEach((dy) => hl(hatchX + 2, y + dy, 8, T(C.woodLight)));
        }
        slab(LEDGE, FLOORS[0].tx + FLOORS[0].w - 24);
        slab(FLOORS[1].ty + FH, FLOORS[1].tx + 14);
        // Battlements on the walk round the turret
        for (let x = 1; x < TW; x += 10) {
            if (x + 6 > TURRET[0] - 2 && x < TURRET[1] + 2) continue;
            R(x, LEDGE - 6, 6, 6, stone); hl(x, LEDGE - 6, 6, stoneTop);
            vl(x, LEDGE - 6, 6, C.ink); vl(x + 5, LEDGE - 6, 6, C.ink); hl(x, LEDGE - 7, 6, C.ink);
        }
        // The roof: a slate cone over the turret, lit from the left, a lit dormer and a pennant
        const cx = TW / 2, eave = FLOORS[0].ty, half = 84;
        for (let y = SKY; y < eave; y++) {
            const k = (y - SKY) / (eave - SKY);
            const hw = Math.round(4 + (half - 4) * Math.pow(k, 1.4));
            const dark = Math.floor((y - SKY) / 4) % 2 === 1;
            R(cx - hw, y, hw * 2, 1, T(dark ? "#34404A" : "#3C4750"));
            R(cx - hw + 1, y, Math.floor(hw * 0.6), 1, T(dark ? "#46535D" : "#4E5B66"));
            if (y % 4 === 3) for (let x = cx - hw + ((y >> 2) % 2) * 3; x < cx + hw; x += 6) P1(x, y, T("#232B31"));
            P1(cx - hw, y, C.ink); P1(cx + hw - 1, y, C.ink);
        }
        R(cx - half - 2, eave - 3, 2 * half + 4, 3, T(C.woodDark)); hl(cx - half - 2, eave - 3, 2 * half + 4, T(C.wood));
        box(cx - 5, eave - 24, 10, 10, "#F3C97A", C.ink); vl(cx, eave - 23, 8, C.ink);
        vl(cx, SKY - 10, 10, C.ink); R(cx + 1, SKY - 10, 7, 3, T(C.red));
        // The foot of the tower: a stone plinth on a grassy hill
        const foot = FLOORS[2].ty + FH;
        R(0, foot, TW, TH - foot, T("#3E352B"));
        stones(0, foot, TW, 6); hl(0, foot, TW, C.ink);
        for (let x = 0; x < TW; x++) {
            const top = foot + 7 + Math.round(3 + 2 * Math.sin(x / 13));
            R(x, top, 1, TH - top, T("#4F6B3A")); P1(x, top, T("#6E8C4E"));
        }
        g = screen;
        shellPhase = phase;
    }
    // Where an object (in picture pixels) lands in the tower: on the floor its middle is over
    function inTower(spot) {
        const mid = spot.x + spot.w / 2;
        const i = Math.max(0, FLOORS.findIndex((f) => mid >= f.x0 && mid < f.x0 + f.w));
        const f = FLOORS[i];
        return { x: f.tx + spot.x - f.x0, y: f.ty + spot.y - FY0, w: spot.w, h: spot.h, floor: i };
    }
    let towerMode = false;   // set by fit(): true on phones
    // An object's button, in % of whatever is showing (the room or the tower), plus its place in
    // the Tab order: reading order, top to bottom then left to right, floor by floor in the tower
    function view(spot) {
        const r = towerMode ? inTower(spot) : spot;
        const cw = towerMode ? TW : RW, ch = towerMode ? TH : RH;
        const order = (towerMode ? r.floor * 1e6 : 0) + Math.round(spot.y / 50) * 1000 + spot.x;
        return { x: (r.x / cw) * 100, y: (r.y / ch) * 100, w: (r.w / cw) * 100, h: (r.h / ch) * 100, order };
    }
    const composed = Object.assign(document.createElement("canvas"), { width: RW, height: RH });

    /* ======================= Mounting it on the page ======================= */
    // canvas: the <canvas>; pauseButton: a <button> that stops and starts the motion;
    // stage: the box that holds it; spots: the list of buttons laid over the room;
    // onPhase(words): tells the page the time of day
    function mount({ canvas, pauseButton, stage, spots, onPhase, onError, onLayout }) {
        const out = canvas.getContext("2d");
        g = frameLayer.getContext("2d");   // the room is drawn here; out shows it in the window
        // ?sky=night previews a time of day. Object.hasOwn, not PHASES[query]: every object
        // inherits keys such as "constructor" and "toString", so ?sky=constructor would
        // otherwise look like a real time of day and break the drawing
        const query = new URLSearchParams(location.search).get("sky");
        const sky = Object.hasOwn(PHASES, query) ? query : null;
        let phase = sky || phaseNow();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        let saved = null;
        try { saved = localStorage.getItem("workshop-motion"); } catch (e) { /* storage blocked: fine */ }
        let paused = saved ? saved === "off" : reduce.matches;
        let visible = true, t = 0, scale = 0;
        let lit = [], dim = false;
        let ready = false;   // nothing is drawn until the art packs' pictures have arrived
        canvas.width = RW; canvas.height = RH;

        // Put the finished frame on the page: the room, the dimming, then the outlines (after the
        // dimming, so the open object stays bright while the room goes dark)
        // In the tower the frame is put together off screen first, then cut into its floors
        function present() {
            if (!ready) return;
            const c = towerMode ? composed.getContext("2d") : out;
            c.drawImage(frameLayer, 0, 0);
            if (dim) { c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(0, 0, RW, RH); }
            lit.forEach((name) => {
                const spot = SPOTS.find((s) => s.name === name);
                const [dx, dy] = (spot && SHIFT[spot.group]) || [0, 0];
                if (outlines[name]) c.drawImage(outlines[name], OX + dx, OY + dy);
            });
            if (!towerMode) return;
            if (shellPhase !== phase) buildShell(phase);
            out.drawImage(shellLayer, 0, 0);
            if (dim) { out.fillStyle = "rgba(0,0,0,0.45)"; out.fillRect(0, 0, TW, TH); }
            FLOORS.forEach((f) => out.drawImage(composed, f.x0, FY0, f.w, FH, f.tx, f.ty, f.w, FH));
        }
        function render(still) { if (ready) { draw(t, phase, still); present(); } }

        // Full screen, like Ash's room (owner, 2026-11-26). The room is scaled to COVER the window:
        // the picture's edges may fall off, but never so far that an object you can click would.
        // SAFE: the whole 384 x 216 room (plus a little air) always stays on screen; only the
        // spare wall, ceiling and floor around it get cropped, so no shape of window shows bands.
        // The scale needn't be a whole number here (Ash's room does the same); image-rendering:
        // pixelated keeps the edges sharp, though some pixel rows come out a pixel wider.
        // A phone-width window gets the tower instead: as wide as the screen, as tall as it needs,
        // and the page scrolls down through it. A tall monitor doesn't: the room fits its width and
        // sits in the middle with a dark band above and below, so the page never scrolls (owner, 2026-11-26)
        function fit() {
            const width = stage.clientWidth, height = stage.clientHeight;
            if (!width) return;   // not laid out yet: the ResizeObserver calls again
            const tower = width < 700;
            if (!tower && !height) return;
            const s = tower ? width / TW
                : Math.min(Math.max(width / RW, height / RH), width / (W + 16), height / (H + 12));
            stage.classList.toggle("is-tower", tower);
            stage.classList.toggle("is-letterboxed", !tower && RH * s < height - 1);
            if (s === scale && tower === towerMode) return;
            const changed = tower !== towerMode || scale === 0;   // or the first fit
            scale = s;
            towerMode = tower;
            const cw = tower ? TW : RW, ch = tower ? TH : RH;
            if (canvas.width !== cw) { canvas.width = cw; canvas.height = ch; }
            canvas.style.width = `${cw * s}px`;
            canvas.style.height = `${ch * s}px`;
            render(paused);
            if (changed && onLayout) onLayout();   // the buttons move to the objects' new places
        }
        // A toggle button keeps ONE name and says its state with aria-pressed (pressed = paused).
        // Changing the words too would make a screen reader say "Play motion, pressed": two
        // signals that contradict each other (WCAG 4.1.2)
        function setPaused(p) {
            paused = p;
            pauseButton.setAttribute("aria-pressed", String(p));
            render(p);
        }
        pauseButton.addEventListener("click", () => {
            setPaused(!paused);
            try { localStorage.setItem("workshop-motion", paused ? "off" : "on"); } catch (e) { /* fine */ }
        });
        // The room stays invisible (.is-loading) until the art arrives, then fades in whole.
        // If it never comes (a missing file, a failed download), onError tells the page
        stage.classList.add("is-loading");
        loadSprites(() => {
            ready = true;
            buildOutlines();
            render(paused);
            stage.classList.remove("is-loading");
        }, () => { if (onError) onError(); });
        // Only animate while the room is on screen and the tab is visible: no wasted battery
        new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(canvas);
        // About 10 frames a second, like hand-drawn pixel animation
        setInterval(() => {
            if (paused || !visible || document.hidden) return;
            t++;
            render(false);
        }, 100);
        // The window follows the clock: look once a minute, paused or not
        setInterval(() => {
            const now = phaseNow();
            if (sky || now === phase) return;
            phase = now;
            if (onPhase) onPhase(PHASES[phase].words);
            render(paused);   // draw() sees the new phase and rebuilds its cache
        }, 60000);
        // ResizeObserver watches the box itself, not the window, so it also catches the page's
        // scrollbar appearing later (which narrows the box without any window resize)
        new ResizeObserver(fit).observe(stage);
        fit();
        setPaused(paused);
        pauseButton.hidden = false;
        if (onPhase) onPhase(PHASES[phase].words);
        // codcript.js says which objects to outline (pointed at, focused, open) and whether the
        // room is dimmed behind the scroll; the frame is redrawn at once, even when paused
        highlight = (names, dimmed) => { lit = names; dim = dimmed; present(); };
    }

    // Replaced by mount() once the room exists; before that there's nothing to outline
    let highlight = () => {};

    const PAGE_SPOTS = SPOTS.map((spot) => {
        const [dx, dy] = SHIFT[spot.group] || [0, 0];
        return { ...spot, x: spot.x + OX + dx, y: spot.y + OY + dy };
    });
    return { W: RW, H: RH, SPOTS: PAGE_SPOTS, mount, view, highlight: (names, dimmed) => highlight(names, dimmed) };
})();
