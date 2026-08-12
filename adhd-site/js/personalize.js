/* Site personalization from the saved screener result (localStorage only).
 * Requires data.js. Loaded last on each page so injected UI can reference
 * already-rendered content. Everything degrades to nothing without a result.
 */
(function () {
  "use strict";

  const KEY = "adhd-last-result";
  const CONFOUND_THRESHOLD = 60; // keep in sync with quiz.js
  const DOMAIN_ORDER = ["ia", "hi", "ef", "er"];

  function getSaved() {
    try {
      const p = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!p || p.v !== 1 || !p.domains) return null;
      return p;
    } catch (e) { return null; }
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }

  function fmtDate(ts) {
    try {
      return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch (e) { return ""; }
  }

  const saved = getSaved();
  if (!saved) return;

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const title = typeof saved.title === "string" ? saved.title : "Saved screener result";
  const hyp = ["inattentive", "hyperactive", "combined", "sub", "low"].indexOf(saved.hyp) !== -1 ? saved.hyp : null;
  const hasProfile = hyp === "inattentive" || hyp === "hyperactive" || hyp === "combined";
  const flaggedKeys = Object.keys(CONFOUNDS).filter(function (k) {
    return Number(saved.confounds && saved.confounds[k]) >= CONFOUND_THRESHOLD;
  });

  function forgetLink(el) {
    const a = el.querySelector(".pz-forget");
    if (!a) return;
    a.addEventListener("click", function (e) {
      e.preventDefault();
      try { localStorage.removeItem(KEY); } catch (err) { /* ignore */ }
      el.remove();
    });
  }

  /* ---------- Overview: result banner after the hero ---------- */
  if (page === "index.html") {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const div = document.createElement("div");
    div.className = "callout";
    div.innerHTML =
      '<p class="kicker">Your saved screener result</p>' +
      "<p><strong>" + esc(title) + "</strong>" +
      (saved.ts ? " — taken " + esc(fmtDate(saved.ts)) : "") +
      ". Pages across the site now point at what's most relevant to it. It remains a hypothesis, not a diagnosis.</p>" +
      '<p><a href="screeners.html#saved">View the full result</a>' +
      (hasProfile ? ' · <a href="presentations.html#pres-' + hyp + '">Read your presentation profile</a>' : "") +
      (flaggedKeys.length ? ' · <a href="lookalikes.html">Check your look-alike flags</a>' : "") +
      ' · <a href="toolbox.html#strategies">Strategies for your profile</a>' +
      ' · <a class="pz-forget" href="#">Forget my result</a></p>';
    hero.insertAdjacentElement("afterend", div);
    forgetLink(div);
  }

  /* ---------- Presentations: badge the matching profile ---------- */
  if (page === "presentations.html" && hasProfile) {
    const sec = document.getElementById("pres-" + hyp);
    if (sec) {
      const head = sec.querySelector(".type-head");
      if (head) {
        const pill = document.createElement("span");
        pill.className = "pill";
        pill.textContent = "⭑ Your last screener result";
        head.appendChild(pill);
      }
      const chip = document.querySelector('#pres-jump a[href="#pres-' + hyp + '"]');
      if (chip) chip.setAttribute("title", "Your last screener result");
    }
  }

  /* ---------- Look-alikes: surface raised flags ---------- */
  if (page === "lookalikes.html" && flaggedKeys.length) {
    const main = document.querySelector("main");
    const h1 = main && main.querySelector("h1");
    if (h1) {
      const div = document.createElement("div");
      div.className = "callout flag";
      div.innerHTML =
        '<p class="kicker">From your saved screener result</p>' +
        "<p>Your answers raised look-alike flags for: <strong>" +
        flaggedKeys.map(function (k) { return esc(CONFOUNDS[k].label); }).join(", ") +
        "</strong>. The matching sections below deserve your attention — they describe how to tell those patterns from ADHD, and none of this is a diagnosis. " +
        '<a href="screeners.html#saved">View the full result</a> · <a class="pz-forget" href="#">forget it</a></p>';
      h1.insertAdjacentElement("afterend", div);
      forgetLink(div);
    }
  }

  /* ---------- Toolbox: suggest starting filters from top domains ---------- */
  if (page === "toolbox.html") {
    const catFor = { ia: ["start", "focus"], hi: ["focus", "emotion"], ef: ["time", "memory"], er: ["emotion", "sleep"] };
    const ranked = DOMAIN_ORDER.slice().sort(function (a, b) {
      return (saved.domains[b] || 0) - (saved.domains[a] || 0);
    });
    const cats = [];
    ranked.slice(0, 2).forEach(function (d) {
      (catFor[d] || []).forEach(function (c) { if (cats.indexOf(c) === -1) cats.push(c); });
    });
    const search = document.getElementById("strat-search");
    if (search && cats.length) {
      const p = document.createElement("p");
      p.innerHTML =
        "<strong>From your saved result:</strong> your highest domains were " +
        esc(DOMAINS[ranked[0]].label.toLowerCase()) + " and " + esc(DOMAINS[ranked[1]].label.toLowerCase()) +
        " — good starting filters: " +
        cats.slice(0, 3).map(function (c) {
          return '<button type="button" class="chip pz-cat" data-cat="' + esc(c) + '">' + esc(STRATEGY_CATS[c].label) + "</button>";
        }).join(" ");
      search.parentNode.insertBefore(p, search);
      p.querySelectorAll(".pz-cat").forEach(function (b) {
        b.addEventListener("click", function () {
          const chip = document.querySelector('#strat-chips .chip[data-cat="' + b.dataset.cat + '"]');
          if (chip) { chip.click(); chip.scrollIntoView({ behavior: "smooth", block: "center" }); }
        });
      });
    }
  }
})();
