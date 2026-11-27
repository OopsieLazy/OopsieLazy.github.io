// Theme switch: Auto, Day, Night (O1, D51; it replaced the drum dimmer of D35-D38).
// Since 2026-11-27 (owner's pick T1) most pages show the three choices as words, and the Code page
// has one button drawn as two scrolls that steps through them (owner: "Scrolls for Code")
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

// Part 2: the controls. They don't exist yet (the <body> hasn't been read), so wait for them
document.addEventListener("DOMContentLoaded", () => {
    const choices = [...document.querySelectorAll(".theme-choice")];   // the three words (most pages)
    const cycler = document.querySelector(".theme-cycle");              // the scrolls (Code)

    function choose(next) {
        theme = next;
        apply(theme);
        save(theme);
        show();
    }

    // aria-pressed marks the word in use (the CSS underlines it, and on phones hides the others).
    // The scroll button: data-mode picks the picture; its spoken name (and the hover tip)
    // says the theme in use and what a press will do next
    function show() {
        choices.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.choice === theme)));
        if (cycler) {
            cycler.dataset.mode = theme;
            cycler.setAttribute("aria-label", `Theme: ${THEME_NAMES[theme]}. Press for ${THEME_NAMES[NEXT[theme]]}`);
            cycler.title = cycler.getAttribute("aria-label");
        }
    }

    // Click, tap, Enter and Space all arrive here: that's what a <button> gives for free.
    // A press picks that word (all three always show, side by side)
    choices.forEach((button) => button.addEventListener("click", () => choose(button.dataset.choice)));
    cycler?.addEventListener("click", () => choose(NEXT[theme]));

    show();
    // No JS = no controls, and the site simply follows the OS
    document.querySelectorAll(".theme-switch, .theme-cycle").forEach((control) => { control.hidden = false; });
});
