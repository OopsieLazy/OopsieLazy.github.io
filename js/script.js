// Shared script for every page. Loaded with defer, so the HTML is already parsed when it runs
// (no DOMContentLoaded wrapper needed, unlike projcript.js which loads without defer)

// The Menu button in the header (phones). It's hidden in the HTML and starts "expanded", so
// without JS every link stays visible. JS shows the button and collapses the links; the CSS
// reads aria-expanded to show or hide them. (A second button, the Lab ▸, used this too until L1c)
function setupToggle(button) {
    button.hidden = false;
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
        // Attributes are always strings, so compare with "true", not true
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
    });
}

document.querySelectorAll(".menu-toggle").forEach(setupToggle);

// YEARS THAT COUNT THEMSELVES (owner, 2026-11-27: "minimal AI intervention"). The HTML stores the
// year something STARTED, which never changes, and the page works out the count every visit:
//   <span data-since="2019">7</span>   shows the years since 2019 (7 in 2026, 8 in 2027...);
//                                      a start THIS year shows "<1", never "0"
//   <dd data-since="2019" data-unit="year">  writes the words: "Under a year", "1 year", "7 years"
//   <span data-year>2026</span>        shows this year (the footer's ©)
// What's typed inside is only what shows with JavaScript off, so keep it roughly right
const thisYear = new Date().getFullYear();
function yearsSince(start, unit) {
    const years = thisYear - Number(start);
    if (!unit) return years < 1 ? "<1" : String(years);
    if (years < 1) return `Under a ${unit}`;
    return years === 1 ? `1 ${unit}` : `${years} ${unit}s`;
}
document.querySelectorAll("[data-since]").forEach((el) => {
    el.textContent = yearsSince(el.dataset.since, el.dataset.unit);
});
document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = thisYear;
});
