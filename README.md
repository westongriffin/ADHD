# ADHD

**adhdguide** — a static educational site about ADHD, built in the same spirit (and design system)
as the companion [enneagram site](https://github.com/westongriffin/Enneagram): honest framing,
explicit look-alike screening, and no diagnostic pretensions.

## Pages

- **Overview** (`adhd-site/index.html`) — ADHD as an attention-*regulation* / executive-function
  condition; the four domains; the interest-based engine; what ADHD is and isn't.
- **The 3 Presentations** (`adhd-site/presentations.html`) — inattentive, hyperactive-impulsive,
  and combined profiles; how the picture changes across the lifespan; why women and girls get missed.
- **Look-alikes** (`adhd-site/lookalikes.html`) — both failure modes: conditions that imitate ADHD
  (anxiety, depression, sleep, bipolar spectrum, autism, trauma, OCD), and the labels real ADHD
  hides under for years.
- **Take a Screener** (`adhd-site/screeners.html`) — a 21-item quick screen and a 56-item
  exhaustive screen. Both score four trait domains (inattention, hyperactivity-impulsivity,
  executive function, emotional regulation), run the three context checks a diagnosis actually
  requires (childhood onset, cross-setting presence, impairment), and flag look-alike patterns in
  the results. Items are rated on an agreement scale.
- **Toolbox** (`adhd-site/toolbox.html`) — interactive tools, all client-side: a filterable
  library of 30+ strategies, a visual focus timer, a task splitter with a highlighted "next tiny
  step" (persisted in localStorage), and a printable evaluation-prep worksheet.
- **Resources** (`adhd-site/resources.html`) — curated organizations, books, podcasts/channels,
  clinical guidelines, communities, an honest treatment-evidence overview, and school/work
  accommodation guidance.

## Running

No build step, no dependencies — open `index.html` (which redirects into `adhd-site/`) in a
browser, or serve the repo root with any static file server.

## Disclaimer

Educational content only. Nothing here can diagnose or rule out ADHD or any other condition;
the screeners produce hypotheses for self-observation, not findings.
