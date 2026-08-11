/* Mobile hamburger nav + theme toggle — shared by every page. */
(function () {
  "use strict";

  /* Theme toggle. Light is the default; dark is an explicit choice, persisted
   * in localStorage and restored before first paint by an inline head snippet. */
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    var meta = document.querySelector('meta[name="theme-color"]');
    var applyTheme = function (theme) {
      if (theme === "dark") {
        document.documentElement.dataset.theme = "dark";
      } else {
        delete document.documentElement.dataset.theme;
      }
      if (meta) meta.content = theme === "dark" ? "#0d0d0d" : "#f9f9f7";
      themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
      try { localStorage.setItem("theme", theme); } catch (e) { /* private mode */ }
    };
    // Sync button + meta with whatever the head snippet restored.
    var current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    themeBtn.setAttribute("aria-pressed", String(current === "dark"));
    if (meta && current === "dark") meta.content = "#0d0d0d";
    themeBtn.addEventListener("click", function () {
      applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function close() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 640) close();
  });
})();
