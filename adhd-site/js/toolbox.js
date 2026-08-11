/* Toolbox tools: strategy library, focus timer, task splitter, eval-prep print.
 * Requires data.js (STRATEGY_CATS, STRATEGIES). All state stays in this browser.
 */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  /* ---------- Strategy library ---------- */
  (function () {
    const chipsWrap = $("#strat-chips");
    const listWrap = $("#strat-list");
    const search = $("#strat-search");
    const count = $("#strat-count");
    if (!chipsWrap || !listWrap) return;

    let activeCat = "all";

    function chip(label, key) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (key === activeCat ? " sel" : "");
      b.textContent = label;
      b.dataset.cat = key;
      b.addEventListener("click", function () {
        activeCat = key;
        chipsWrap.querySelectorAll(".chip").forEach(function (c) {
          c.classList.toggle("sel", c.dataset.cat === key);
        });
        render();
      });
      return b;
    }

    chipsWrap.appendChild(chip("All", "all"));
    Object.keys(STRATEGY_CATS).forEach(function (k) {
      chipsWrap.appendChild(chip(STRATEGY_CATS[k].label, k));
    });

    function render() {
      const q = (search.value || "").trim().toLowerCase();
      listWrap.innerHTML = "";
      let shown = 0;
      STRATEGIES.forEach(function (s) {
        if (activeCat !== "all" && s.cat !== activeCat) return;
        if (q && (s.title + " " + s.how + " " + STRATEGY_CATS[s.cat].label).toLowerCase().indexOf(q) === -1) return;
        shown += 1;
        const card = document.createElement("div");
        card.className = "card";
        const kicker = document.createElement("p");
        kicker.className = "kicker";
        kicker.textContent = STRATEGY_CATS[s.cat].label;
        const h = document.createElement("h3");
        h.style.margin = "0 0 0.35rem";
        h.textContent = s.title;
        const p = document.createElement("p");
        p.style.margin = "0";
        p.textContent = s.how;
        card.appendChild(kicker); card.appendChild(h); card.appendChild(p);
        listWrap.appendChild(card);
      });
      count.textContent = shown + " of " + STRATEGIES.length + " strategies" + (q ? ' matching "' + q + '"' : "");
    }

    search.addEventListener("input", render);
    render();
  })();

  /* ---------- Focus timer ---------- */
  (function () {
    const fill = $("#timer-fill");
    if (!fill) return;
    const timeEl = $("#timer-time");
    const stateEl = $("#timer-state");
    const ring = $("#timer-ring");
    const startBtn = $("#timer-start");
    const resetBtn = $("#timer-reset");
    const custom = $("#timer-custom");
    const presets = document.querySelectorAll("#timer .chip[data-mins]");

    const C = 2 * Math.PI * 100; // ring circumference
    fill.style.strokeDasharray = C;

    let totalSec = 25 * 60;
    let remaining = totalSec;
    let running = false;
    let endAt = 0;
    let intervalId = null;
    const baseTitle = document.title;

    function fmt(sec) {
      const m = Math.floor(sec / 60), s = sec % 60;
      return m + ":" + (s < 10 ? "0" : "") + s;
    }

    function paint() {
      timeEl.textContent = fmt(remaining);
      fill.style.strokeDashoffset = C * (1 - (totalSec ? remaining / totalSec : 0));
      document.title = running ? "▶ " + fmt(remaining) + " — " + baseTitle : baseTitle;
    }

    function setMinutes(mins) {
      mins = Math.min(180, Math.max(1, Math.round(mins) || 25));
      stop();
      totalSec = mins * 60;
      remaining = totalSec;
      ring.classList.remove("done");
      stateEl.textContent = "ready";
      custom.value = mins;
      paint();
    }

    function stop() {
      running = false;
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
      startBtn.textContent = "Start";
    }

    function chime() {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        const ctx = new Ctx();
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = 880;
          osc.connect(gain); gain.connect(ctx.destination);
          const t = ctx.currentTime + i * 0.35;
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
          osc.start(t); osc.stop(t + 0.3);
        }
      } catch (e) { /* no audio available — the visual state still flips */ }
    }

    function tick() {
      remaining = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      paint();
      if (remaining === 0) {
        stop();
        ring.classList.add("done");
        stateEl.textContent = "done — take the break";
        document.title = "⏰ Done — " + baseTitle;
        chime();
      }
    }

    startBtn.addEventListener("click", function () {
      if (running) { // pause
        stop();
        stateEl.textContent = "paused";
        paint();
        return;
      }
      if (remaining === 0) { remaining = totalSec; ring.classList.remove("done"); }
      running = true;
      endAt = Date.now() + remaining * 1000;
      startBtn.textContent = "Pause";
      stateEl.textContent = "focusing";
      intervalId = setInterval(tick, 250);
      paint();
    });

    resetBtn.addEventListener("click", function () { setMinutes(totalSec / 60); });

    presets.forEach(function (b) {
      b.addEventListener("click", function () {
        presets.forEach(function (x) { x.classList.toggle("sel", x === b); });
        setMinutes(parseInt(b.dataset.mins, 10));
      });
    });
    custom.addEventListener("change", function () {
      presets.forEach(function (x) { x.classList.remove("sel"); });
      setMinutes(parseFloat(custom.value));
    });

    paint();
  })();

  /* ---------- Task splitter ---------- */
  (function () {
    const list = $("#step-list");
    if (!list) return;
    const input = $("#step-input");
    const addBtn = $("#step-add");
    const empty = $("#step-empty");
    const KEY = "adhd-steps";

    let steps = [];
    try { steps = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { steps = []; }
    if (!Array.isArray(steps)) steps = [];

    function save() {
      try { localStorage.setItem(KEY, JSON.stringify(steps)); } catch (e) { /* private mode */ }
    }

    function render() {
      list.innerHTML = "";
      empty.hidden = steps.length > 0;
      let nextMarked = false;
      steps.forEach(function (s, i) {
        const li = document.createElement("li");
        if (s.done) li.className = "done";
        else if (!nextMarked) { li.className = "next"; nextMarked = true; }

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!s.done;
        cb.setAttribute("aria-label", "Done: " + s.t);
        cb.addEventListener("change", function () { steps[i].done = cb.checked; save(); render(); });

        const txt = document.createElement("span");
        txt.className = "txt";
        txt.textContent = s.t;

        li.appendChild(cb);
        li.appendChild(txt);
        if (li.className === "next") {
          const tag = document.createElement("span");
          tag.className = "next-tag";
          tag.textContent = "next step";
          li.appendChild(tag);
        }
        const del = document.createElement("button");
        del.type = "button";
        del.className = "del";
        del.textContent = "✕";
        del.setAttribute("aria-label", "Remove: " + s.t);
        del.addEventListener("click", function () { steps.splice(i, 1); save(); render(); });
        li.appendChild(del);
        list.appendChild(li);
      });
    }

    function add() {
      const t = (input.value || "").trim();
      if (!t) return;
      steps.push({ t: t, done: false });
      input.value = "";
      input.focus();
      save(); render();
    }

    addBtn.addEventListener("click", add);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") add(); });
    $("#step-clear-done").addEventListener("click", function () {
      steps = steps.filter(function (s) { return !s.done; });
      save(); render();
    });
    $("#step-clear-all").addEventListener("click", function () {
      if (steps.length && !window.confirm("Clear all steps?")) return;
      steps = [];
      save(); render();
    });

    render();
  })();

  /* ---------- Evaluation-prep print ---------- */
  (function () {
    const btn = $("#prep-print");
    if (!btn) return;
    btn.addEventListener("click", function () {
      document.body.classList.add("print-eval");
      window.print();
    });
    window.addEventListener("afterprint", function () {
      document.body.classList.remove("print-eval");
    });
  })();
})();
