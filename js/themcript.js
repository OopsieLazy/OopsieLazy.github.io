// Theme button: Auto -> Day -> Night (O1, D51; it replaced the drum dimmer of D35-D38)
// Loaded in <head> WITHOUT defer on purpose: part 1 must run before the page is drawn,
// or a visitor who picked Night would see a white flash first.
// It's an external file, not inline, so a strict Content Security Policy won't need a hash for it later

// Three choices. "auto" is the ABSENCE of a choice: no data-theme on <html>, so the CSS
// follows the OS live, with no JS at all. "lantern" is Night's old internal name (D35):
// the CSS and saved choices use it, visitors only ever see "Night"
const THEME_NAMES = { auto: "Auto", day: "Day", lantern: "Night" };
const NEXT = { auto: "day", day: "lantern", lantern: "auto" };   // the order a press goes through
const THEME_KEY = "theme";
const OLD_LEVEL_KEY = "theme-level";   // the drum's in-between level; no longer used, cleaned up on save

// localStorage can throw (private mode, blocked storage), so every use is wrapped in try/catch.
// Anyone can edit storage in DevTools, so only values we recognise are trusted
function readSaved() {
    try {
        const theme = localStorage.getItem(THEME_KEY);
        // Object.hasOwn, not "in": "toString" in NEXT is true (every object inherits it)
        return Object.hasOwn(NEXT, theme ?? "") ? theme : "auto";
    } catch {
        return "auto";
    }
}

// data-theme on <html> is all the CSS needs: it sets --dim (0 or 1) and color-scheme from it.
// An old visit may have left an in-between --dim from the drum, so that's cleared too
function apply(theme) {
    const root = document.documentElement;
    root.style.removeProperty("--dim");
    if (theme === "auto") delete root.dataset.theme;
    else root.dataset.theme = theme;
}

function save(theme) {
    try {
        localStorage.removeItem(OLD_LEVEL_KEY);
        if (theme === "auto") localStorage.removeItem(THEME_KEY);
        else localStorage.setItem(THEME_KEY, theme);
    } catch {
        // Storage blocked: the theme still changes, it just isn't remembered
    }
}

// Part 1: runs right now, while <head> is still loading
let theme = readSaved();
apply(theme);

// Part 2: the button. It doesn't exist yet (the <body> hasn't been read), so wait for it
document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".theme-button");
    if (!button) return;   // a page without the button (e.g. thelab.html) still gets part 1

    const name = button.querySelector(".theme-name");

    // The icon (CSS reads data-mode), the spoken name ("Theme: Day") and the hover tip,
    // which says what a press will do next rather than repeating the name
    function show() {
        button.dataset.mode = theme;
        name.textContent = THEME_NAMES[theme];
        button.title = `Switch to ${THEME_NAMES[NEXT[theme]]}`;
    }

    // Click, tap, Enter and Space all arrive here: that's what a <button> gives for free
    button.addEventListener("click", () => {
        theme = NEXT[theme];
        apply(theme);
        save(theme);
        show();
    });

    show();
    button.hidden = false;   // no JS = no button, and the site simply follows the OS
});
