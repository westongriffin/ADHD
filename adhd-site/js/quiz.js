/* Screener engine: rendering, scoring, presentation hypothesis, context checks,
 * look-alike flags — plus result sharing (URL-encoded), PDF printing, and a
 * saved result in localStorage that the rest of the site personalizes from.
 * Requires data.js and questions.js to be loaded first.
 * All data stays in the browser; share links carry scores only, never answers.
 */
(function () {
  "use strict";

  /* Agreement scale, not frequency: the items are statements (including facts
   * like childhood onset), which "Never…Very often" cannot coherently answer. */
  const LIKERT = [
    "Strongly disagree",
    "Disagree",
    "Neutral / unsure",
    "Agree",
    "Strongly agree"
  ];

  // A domain scale at or above this (0–100) counts as elevated.
  const DOMAIN_HIGH = 60;
  // Between this and DOMAIN_HIGH counts as subthreshold traits.
  const DOMAIN_MID = 45;
  // A confound scale at or above this is considered elevated.
  const CONFOUND_THRESHOLD = 60;
  // A context check below this raises a caution.
  const CONTEXT_OK = 55;

  const DOMAIN_ORDER = ["ia", "hi", "ef", "er"];
  const CONTEXT_ORDER = ["onset", "pervasive", "impair"];
  const STORE_KEY = "adhd-last-result";

  let bank = [];
  let bankName = "";
  let answers = [];
  let idx = 0;
  let advancing = false;

  const $ = (sel) => document.querySelector(sel);

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startQuiz(which) {
    bankName = which;
    bank = shuffle(which === "short" ? SHORT_TEST : FULL_TEST);
    answers = new Array(bank.length).fill(null);
    idx = 0;
    $("#chooser").hidden = true;
    $("#results").hidden = true;
    $("#quiz").hidden = false;
    renderQuestion();
    $("#quiz").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderQuestion() {
    const q = bank[idx];
    $("#q-count").textContent = "Question " + (idx + 1) + " of " + bank.length;
    $("#q-text").textContent = q.text;
    $("#progress-fill").style.width = (100 * idx / bank.length) + "%";

    const wrap = $("#likert");
    wrap.innerHTML = "";
    LIKERT.forEach(function (label, i) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      if (answers[idx] === i + 1) b.classList.add("sel");
      b.addEventListener("click", function () {
        if (advancing) return;
        advancing = true;
        answers[idx] = i + 1;
        // Show the selection briefly so the tap feels registered before advancing.
        wrap.querySelectorAll("button").forEach(function (x) { x.classList.remove("sel"); });
        b.classList.add("sel");
        setTimeout(function () {
          advancing = false;
          // Drop focus from the tapped button so no highlight (focus ring or
          // sticky hover) carries over to the same position on the next question.
          b.blur();
          if (document.activeElement && document.activeElement !== document.body) {
            document.activeElement.blur();
          }
          if (idx < bank.length - 1) {
            idx += 1;
            renderQuestion();
          } else {
            showResults();
          }
        }, 160);
      });
      wrap.appendChild(b);
    });

    $("#btn-back").disabled = idx === 0;
  }

  function computeScores() {
    const dScore = {}, dMax = {};
    const kScore = {}, kMax = {};
    const cScore = {}, cMax = {};
    DOMAIN_ORDER.forEach(function (d) { dScore[d] = 0; dMax[d] = 0; });
    CONTEXT_ORDER.forEach(function (k) { kScore[k] = 0; kMax[k] = 0; });
    Object.keys(CONFOUNDS).forEach(function (k) { cScore[k] = 0; cMax[k] = 0; });

    bank.forEach(function (q, i) {
      const a = answers[i];
      if (a == null) return;
      const s = (a - 1) / 4; // 0..1
      if (q.w) Object.keys(q.w).forEach(function (d) {
        dScore[d] += s * q.w[d];
        dMax[d] += q.w[d];
      });
      if (q.k) Object.keys(q.k).forEach(function (k) {
        kScore[k] += s * q.k[k];
        kMax[k] += q.k[k];
      });
      if (q.c) Object.keys(q.c).forEach(function (k) {
        cScore[k] += s * q.c[k];
        cMax[k] += q.c[k];
      });
    });

    const pct = function (score, max) { return max ? Math.round(100 * score / max) : 0; };
    const domains = {}, contexts = {}, confounds = {};
    DOMAIN_ORDER.forEach(function (d) { domains[d] = pct(dScore[d], dMax[d]); });
    CONTEXT_ORDER.forEach(function (k) { contexts[k] = pct(kScore[k], kMax[k]); });
    Object.keys(CONFOUNDS).forEach(function (k) { confounds[k] = pct(cScore[k], cMax[k]); });

    return { bank: bankName, ts: Date.now(), domains: domains, contexts: contexts, confounds: confounds };
  }

  /* Presentation hypothesis from the two core symptom domains.
   * EF and ER are associated features — shown, but not what the DSM counts. */
  function hypothesisFor(d) {
    if (d.ia >= DOMAIN_HIGH && d.hi >= DOMAIN_HIGH) {
      return { key: "combined", title: "Combined-presentation ADHD pattern",
        text: "Both core symptom clusters — inattention and hyperactivity-impulsivity — came back elevated. This matches the combined presentation, the most common significant-ADHD picture." };
    }
    if (d.ia >= DOMAIN_HIGH) {
      return { key: "inattentive", title: "Predominantly inattentive ADHD pattern",
        text: "Inattention came back elevated while hyperactivity-impulsivity did not. This matches the predominantly inattentive presentation — the picture most often missed in quiet, capable people." };
    }
    if (d.hi >= DOMAIN_HIGH) {
      return { key: "hyperactive", title: "Predominantly hyperactive-impulsive ADHD pattern",
        text: "Hyperactivity-impulsivity came back elevated while inattention did not. This matches the predominantly hyperactive-impulsive presentation — the rarest in adults, and worth double-checking against the mood-episode look-alikes below." };
    }
    if (d.ia >= DOMAIN_MID || d.hi >= DOMAIN_MID) {
      return { key: "sub", title: "Some ADHD-like traits, below threshold",
        text: "One or both core domains came back moderately elevated, but not at the level that usually distinguishes ADHD from ordinary variation. Traits at this level can still be worth understanding — and can still be something else entirely (see any flags below)." };
    }
    return { key: "low", title: "Low ADHD-pattern score",
      text: "Neither core symptom domain came back elevated. Whatever brought you here — distractibility in one context, a rough season, curiosity — this screen doesn't show the pervasive pattern ADHD refers to." };
  }

  function buildFlags(result) {
    const flags = [];
    Object.keys(CONFOUNDS).forEach(function (k) {
      const scale = CONFOUNDS[k];
      const pctVal = result.confounds[k];
      if (pctVal < CONFOUND_THRESHOLD) return;
      const overlapping = scale.mimics.filter(function (d) { return result.domains[d] >= DOMAIN_MID; });
      flags.push({ key: k, pct: pctVal, overlaps: overlapping, scale: scale });
    });
    flags.sort(function (a, b) { return b.pct - a.pct; });
    return flags;
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

  /* ---------- Persistence & sharing ---------- */

  function saveResult(result) {
    const hyp = hypothesisFor(result.domains);
    const payload = {
      v: 1, bank: result.bank, ts: result.ts,
      hyp: hyp.key, title: hyp.title,
      domains: result.domains, contexts: result.contexts, confounds: result.confounds
    };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(payload)); } catch (e) { /* private mode */ }
  }

  function loadSaved() {
    try {
      const p = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      return sanitize(p);
    } catch (e) { return null; }
  }

  /* Accepts a payload from storage or a share link (both untrusted) and
   * returns a clean result object, or null. */
  function sanitize(p) {
    if (!p || p.v !== 1 || typeof p !== "object") return null;
    const clamp = function (v) { return Math.max(0, Math.min(100, Math.round(Number(v) || 0))); };
    const out = {
      bank: p.bank === "full" ? "full" : "short",
      ts: Number(p.ts) || 0,
      domains: {}, contexts: {}, confounds: {}
    };
    DOMAIN_ORDER.forEach(function (d) { out.domains[d] = clamp(p.domains && p.domains[d]); });
    CONTEXT_ORDER.forEach(function (k) { out.contexts[k] = clamp(p.contexts && p.contexts[k]); });
    Object.keys(CONFOUNDS).forEach(function (k) { out.confounds[k] = clamp(p.confounds && p.confounds[k]); });
    return out;
  }

  function shareLink(result) {
    const payload = {
      v: 1, bank: result.bank, ts: result.ts,
      domains: result.domains, contexts: result.contexts, confounds: result.confounds
    };
    const encoded = btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return location.href.split("#")[0] + "#r=" + encoded;
  }

  function decodeShared(hash) {
    const m = /^#r=([A-Za-z0-9_-]+)$/.exec(hash);
    if (!m) return null;
    try {
      let b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      return sanitize(JSON.parse(atob(b64)));
    } catch (e) { return null; }
  }

  function copyText(text, btn, doneLabel) {
    const orig = btn.textContent;
    const done = function () {
      btn.textContent = doneLabel;
      setTimeout(function () { btn.textContent = orig; }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { window.prompt("Copy this link:", text); });
    } else {
      window.prompt("Copy this link:", text);
    }
  }

  /* ---------- Results rendering ---------- */

  // mode: "live" (just finished), "stored" (reopened saved result), "shared" (from a link)
  function renderResults(result, mode) {
    const hyp = hypothesisFor(result.domains);
    const flags = buildFlags(result);
    const patterned = hyp.key !== "low";
    const whose = mode === "shared" ? "This person" : "You";

    let html = "";

    if (mode === "shared") {
      html += '<div class="callout"><p><strong>This is a shared result.</strong> Someone sent you their ' +
        "screener scores — it reflects their answers, not yours. " +
        '<a href="#" id="shared-take">Take the screener yourself →</a></p></div>';
    }

    html += '<p class="kicker">' + (result.bank === "short" ? "Quick screener" : "Exhaustive screener") + " result" +
      (mode === "stored" ? " · saved in this browser" : "") + "</p>";
    html += "<h2 style='margin-top:0'>" + esc(hyp.title) + "</h2>";
    if (result.ts) html += '<p class="quiz-meta">Taken ' + esc(fmtDate(result.ts)) + "</p>";

    const ranked = DOMAIN_ORDER.slice().sort(function (a, b) { return result.domains[b] - result.domains[a]; });
    html += '<p><span class="pill">Strongest domain: ' + esc(DOMAINS[ranked[0]].label) + '</span>' +
            '<span class="pill">Runner-up: ' + esc(DOMAINS[ranked[1]].label) + '</span></p>';
    html += "<p>" + esc(hyp.text) + "</p>";
    if (hyp.key === "combined" || hyp.key === "inattentive" || hyp.key === "hyperactive") {
      html += '<p class="no-print"><a href="presentations.html#pres-' + hyp.key + '">Read the full ' + esc(hyp.title.split(" ADHD")[0].toLowerCase()) + ' profile →</a></p>';
    }

    // Score chart: single measure (0–100), one hue, values direct-labeled.
    html += "<h3>" + (mode === "shared" ? "Their" : "Your") + " four domain scores</h3>";
    html += '<div class="score-chart" role="img" aria-label="Bar chart of scores across four ADHD trait domains">';
    DOMAIN_ORDER.forEach(function (d) {
      html += '<div class="score-row' + (d === ranked[0] ? " top" : "") + '">' +
        '<span class="name">' + esc(DOMAINS[d].label) + "</span>" +
        '<span class="track"><span class="bar" style="width:' + result.domains[d] + '%"></span></span>' +
        '<span class="val">' + result.domains[d] + "</span></div>";
    });
    html += "</div>";
    html += '<p class="quiz-meta">Inattention and hyperactivity-impulsivity are the two domains diagnosis actually counts; ' +
      'executive function and emotional regulation are associated features that fill in the picture.</p>';
    html += '<details><summary>View as table</summary><table><caption>Domain score (0–100)</caption>' +
      "<thead><tr><th scope='col'>Domain</th><th scope='col'>Score</th></tr></thead><tbody>" +
      DOMAIN_ORDER.map(function (d) {
        return "<tr><td>" + esc(DOMAINS[d].label) + "</td><td>" + result.domains[d] + "</td></tr>";
      }).join("") + "</tbody></table></details>";

    // Context checks — what separates a trait from a diagnosis-shaped picture.
    html += "<h3>The checks that checklists skip</h3>";
    html += '<ul class="check-list">';
    CONTEXT_ORDER.forEach(function (k) {
      const ok = result.contexts[k] >= CONTEXT_OK;
      const meta = CONTEXT_CHECKS[k];
      html += '<li class="' + (ok ? "ok" : "warn") + '"><strong>' + esc(meta.label) + " (" + result.contexts[k] + "/100):</strong> " +
        esc(ok ? meta.ok : meta.warn) + "</li>";
    });
    html += "</ul>";
    if (patterned && (result.contexts.onset < CONTEXT_OK || result.contexts.pervasive < CONTEXT_OK)) {
      html += '<div class="callout flag"><p><strong>Read the score in light of the cautions above.</strong> Elevated symptoms ' +
        "without childhood onset or without cross-context presence usually mean the engine is something other than ADHD — " +
        'the flags below are the first suspects.</p></div>';
    }

    // Look-alike flags
    if (flags.length) {
      html += "<h3>⚑ Look-alike flags</h3>";
      html += "<p>" + whose + " scored high on screening items for patterns known to <em>imitate</em> ADHD (or to travel with it). These are hypotheses to consider, <strong>not</strong> diagnoses.</p>";
      flags.forEach(function (f) {
        const overlapNote = f.overlaps.length
          ? " — overlaps the elevated " + f.overlaps.map(function (d) { return DOMAINS[d].label.toLowerCase(); }).join(" and ") + " score" + (f.overlaps.length > 1 ? "s" : "")
          : "";
        html += '<div class="callout flag result-flag">' +
          "<h4>" + esc(f.scale.label) + " (screen score " + f.pct + "/100)" + esc(overlapNote) + "</h4>" +
          "<p>" + esc(f.scale.explain) + "</p></div>";
      });
      html += '<div class="callout caution"><p><strong>Important:</strong> this screener cannot diagnose ADHD, anxiety, depression, bipolar disorder, autism, PTSD, OCD, a sleep disorder, or anything else. If a flag resonates, the useful next step is a conversation with a qualified clinician — bring the flag with you rather than settling the question yourself.</p></div>';
    } else {
      html += '<div class="callout"><p><strong>No look-alike flags raised.</strong> The answers to the screening items didn\'t show the patterns that most commonly masquerade as ADHD. As always, treat the result as a hypothesis, not a finding.</p></div>';
    }

    if (patterned) {
      html += '<div class="callout no-print"><p><strong>If this result rings true,</strong> the real-world next step is an evaluation by someone qualified to make the call — a psychologist, psychiatrist, or physician experienced with adult ADHD — ideally one who asks about your childhood, your sleep, and your mood, not just your symptoms today. The <a href="lookalikes.html">look-alikes page</a> describes what a good evaluation rules out, the <a href="toolbox.html#eval-prep">toolbox</a> has a printable worksheet for preparing that appointment (plus practical strategies you can start today), and the <a href="resources.html">resources page</a> lists organizations, books, and communities worth your time.</p></div>';
    }

    if (result.bank === "short" && mode === "live") {
      html += '<p class="no-print">Want more resolution — fuller domain coverage and a complete look-alike screen? <a href="#" id="go-full">Take the exhaustive screener →</a></p>';
    }

    // Share / PDF / retake actions
    html += '<div class="share-row no-print">' +
      '<button class="btn" id="btn-share" type="button">Share result</button>' +
      '<button class="btn ghost" id="btn-copy-link" type="button">Copy link</button>' +
      '<button class="btn ghost" id="btn-pdf" type="button">Download PDF</button>' +
      '<button class="btn ghost" id="btn-retake" type="button">' + (mode === "shared" ? "Take the screener" : "Retake") + "</button>" +
      "</div>";
    html += '<p class="quiz-meta no-print">The share link and PDF carry scores only — never your answers. ' +
      (mode === "shared"
        ? ""
        : 'Your result is saved only in this browser so the site can point you at relevant pages; <a href="#" id="btn-forget">forget it</a> anytime.');
    html += "</p>";

    $("#chooser").hidden = true;
    $("#quiz").hidden = true;
    $("#results").hidden = false;
    $("#results-body").innerHTML = html;
    $("#results").scrollIntoView({ behavior: "smooth", block: "start" });

    // ---- Wire up actions ----
    const link = shareLink(result);
    const copyBtn = $("#btn-copy-link");
    copyBtn.dataset.link = link;
    copyBtn.addEventListener("click", function () { copyText(link, copyBtn, "Copied ✓"); });

    $("#btn-share").addEventListener("click", function () {
      const shareBtn = $("#btn-share");
      const summary = hyp.title + " — ADHD Guide " +
        (result.bank === "short" ? "quick" : "exhaustive") + " screener result (educational, not a diagnosis)";
      if (navigator.share) {
        navigator.share({ title: "ADHD Guide result", text: summary, url: link }).catch(function () { /* user canceled */ });
      } else {
        copyText(link, shareBtn, "Link copied ✓");
      }
    });

    $("#btn-pdf").addEventListener("click", function () {
      const prevTitle = document.title;
      document.title = "ADHD Guide result" + (result.ts ? " — " + fmtDate(result.ts) : "");
      document.body.classList.add("print-results");
      window.print();
      // afterprint also fires, but restore here too for browsers that return immediately
      document.body.classList.remove("print-results");
      document.title = prevTitle;
    });

    $("#btn-retake").addEventListener("click", function () {
      if (location.hash) history.replaceState(null, "", location.pathname);
      $("#results").hidden = true;
      $("#chooser").hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const forget = $("#btn-forget");
    if (forget) forget.addEventListener("click", function (e) {
      e.preventDefault();
      try { localStorage.removeItem(STORE_KEY); } catch (err) { /* ignore */ }
      forget.textContent = "forgotten ✓";
    });

    const goFull = $("#go-full");
    if (goFull) goFull.addEventListener("click", function (e) { e.preventDefault(); startQuiz("full"); });

    const sharedTake = $("#shared-take");
    if (sharedTake) sharedTake.addEventListener("click", function (e) {
      e.preventDefault();
      history.replaceState(null, "", location.pathname);
      $("#results").hidden = true;
      $("#chooser").hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function showResults() {
    $("#progress-fill").style.width = "100%";
    const result = computeScores();
    saveResult(result);
    renderResults(result, "live");
  }

  /* Saved-result card on the chooser. */
  function renderSavedCard(saved) {
    const chooser = $("#chooser");
    if (!chooser || $("#saved-card")) return;
    const hyp = hypothesisFor(saved.domains);
    const card = document.createElement("div");
    card.className = "callout";
    card.id = "saved-card";
    card.innerHTML =
      '<p class="kicker">Your saved result</p>' +
      "<p><strong>" + esc(hyp.title) + "</strong> — " +
      (saved.bank === "short" ? "quick" : "exhaustive") + " screener" +
      (saved.ts ? ", taken " + esc(fmtDate(saved.ts)) : "") + ".</p>" +
      '<p><button class="btn ghost" id="saved-view" type="button">View full result</button> ' +
      '<button class="btn ghost" id="saved-forget" type="button">Forget it</button></p>';
    chooser.insertBefore(card, chooser.querySelector(".grid"));
    card.querySelector("#saved-view").addEventListener("click", function () {
      renderResults(saved, "stored");
    });
    card.querySelector("#saved-forget").addEventListener("click", function () {
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      card.remove();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    $("#start-short").addEventListener("click", function () { startQuiz("short"); });
    $("#start-full").addEventListener("click", function () { startQuiz("full"); });
    $("#btn-back").addEventListener("click", function () {
      if (idx > 0) { idx -= 1; renderQuestion(); }
    });

    window.addEventListener("afterprint", function () {
      document.body.classList.remove("print-results");
    });

    // Entry points: a shared link, a request to reopen the saved result, or the chooser.
    const shared = decodeShared(location.hash);
    const saved = loadSaved();
    if (shared) {
      renderResults(shared, "shared");
    } else if (location.hash === "#saved" && saved) {
      renderResults(saved, "stored");
    } else if (saved) {
      renderSavedCard(saved);
    }
  });
})();
