/* ADHD site data — shared by presentations.html, lookalikes.html, and the screeners. */

/* The four trait domains the screeners score. */
const DOMAINS = {
  ia: { label: "Inattention",                 cls: "d-ia" },
  hi: { label: "Hyperactivity–impulsivity",   cls: "d-hi" },
  ef: { label: "Executive function",          cls: "d-ef" },
  er: { label: "Emotional regulation",        cls: "d-er" }
};

/* Context checks — the parts of the actual diagnostic picture that
 * symptom checklists usually skip. */
const CONTEXT_CHECKS = {
  onset: {
    label: "Childhood onset",
    ok: "Your answers describe patterns already visible before age 12 — consistent with ADHD, which is developmental and doesn't switch on in adulthood.",
    warn: "Your answers suggest these patterns arrived later in life. ADHD is developmental — real ADHD traits were there in childhood, even if masked by structure or intelligence. An adult onset points toward look-alikes: sleep, mood, anxiety, trauma, or life overload."
  },
  pervasive: {
    label: "Present across settings",
    ok: "You report these patterns in multiple areas of life and even during good periods — consistent with a trait rather than a situation.",
    warn: "You report these patterns in only one setting, or mainly during stress. ADHD is context-general; difficulty that lives in one job, one class, or one bad year is more likely about that situation than about neurology."
  },
  impair: {
    label: "Real-world impairment",
    ok: "You report concrete costs and heavy workarounds — impairment is part of what separates a diagnosis from a personality quirk.",
    warn: "You report few concrete costs. Traits without meaningful impairment don't add up to a disorder — which is worth knowing before adopting the label."
  }
};

/* The three DSM presentations. */
const PRESENTATIONS = {
  inattentive: {
    short: "IA",
    cls: "d-ia",
    name: "Predominantly Inattentive",
    aka: "what people used to call “ADD”",
    summary:
      "Attention drifts off tasks, conversations, and pages — not because the person doesn't care, but because attention won't stay pointed where they point it. From the outside it reads as daydreaming, carelessness, or not listening. There is little or no visible hyperactivity, which is exactly why this presentation gets missed: nobody disruptive, nobody flagged.",
    signs: [
      "Loses the thread of conversations, lectures, and reading, even on topics that matter",
      "Careless mistakes despite knowing better; skipped steps and misread instructions",
      "Avoids or endlessly defers tasks needing sustained mental effort",
      "Chronically loses everyday items; forgets appointments and promises",
      "Easily pulled off-task by noise, movement, or unrelated thoughts",
      "Can hyperfocus on the novel or fascinating — but can't summon focus on demand"
    ],
    adult:
      "This is the dominant grown-up picture: the missed emails, the unopened mail, the 'I read the same paragraph four times,' the reputation for being scattered or flaky in someone who is clearly capable. Many inattentive adults were quiet, bright kids whose report cards said 'doesn't apply herself' — nothing was flagged because nothing was loud.",
    missed:
      "Girls and women, quiet kids, and high-IQ compensators are disproportionately in this group. Because the struggle is silent, it commonly gets relabeled as anxiety, depression, or a character flaw before anyone considers ADHD.",
    mislabels: [
      "Anxiety and depression both impair concentration and get diagnosed first — sometimes correctly, sometimes instead of the ADHD driving them.",
      "Sleep disorders and chronic sleep debt produce a near-identical picture; sleep should always be ruled out.",
      "In children: 'lazy,' 'unmotivated,' 'not trying' — moral labels for a regulation problem."
    ]
  },
  hyperactive: {
    short: "HI",
    cls: "d-hi",
    name: "Predominantly Hyperactive-Impulsive",
    aka: "the stereotype — and the rarest presentation in adults",
    summary:
      "The motor presentation: fidgeting, restlessness, talking fast and a lot, interrupting, acting before thinking. Attention itself may test fine; the failure is in braking. This is the presentation everyone pictures when they hear 'ADHD,' which is a problem, because it's the least common one — especially past childhood.",
    signs: [
      "Fidgets, taps, paces; feels driven by an internal motor",
      "Talks over people, blurts answers, finishes others' sentences",
      "Waiting — lines, traffic, slow talkers — is disproportionately hard",
      "Acts on impulse: purchases, commitments, exits, risky moves",
      "Leaves seat / leaves task when stillness is expected",
      "Seeks intensity and stimulation when life goes quiet"
    ],
    adult:
      "Overt hyperactivity usually goes underground with age: the kid who climbed furniture becomes the adult with a bouncing knee, three side projects, a fast car habit, and an inability to sit through a movie. The impulsivity tends to persist longer than the motion — quick decisions, quick words, quick exits.",
    missed:
      "This presentation is the most likely to be caught in childhood (it's disruptive) and the most likely to be over-attributed: an energetic, impulsive temperament is not ADHD unless it's extreme, lifelong, and costly.",
    mislabels: [
      "Bipolar-spectrum hypomania mimics it — but hypomania is episodic, with reduced need for sleep; ADHD restlessness is the permanent baseline.",
      "Anxiety produces restlessness too — but anxious restlessness feels like dread, not like an engine.",
      "Simply being an energetic extravert. Temperament without impairment isn't a disorder."
    ]
  },
  combined: {
    short: "C",
    cls: "d-ef",
    name: "Combined",
    aka: "the most common presentation overall",
    summary:
      "Meets the threshold on both lists: attention that won't stay pointed and a brake system that engages late. In practice most people with significant ADHD have some of both, with the mix shifting over a lifetime — hyperactive-leaning in childhood, inattentive-leaning by adulthood. 'Presentation' is a snapshot, not a subtype carved in stone; the DSM renamed it from 'subtype' for exactly that reason.",
    signs: [
      "Both symptom clusters at clinical levels — see the two cards above",
      "Executive-function costs usually loudest here: time-blindness, task paralysis, chaotic systems",
      "Emotional intensity — fast frustration, rejection sensitivity — commonly rides along",
      "Presentation can shift over the years as hyperactivity fades and demands grow"
    ],
    adult:
      "The adult combined picture is often 'inattentive plus internal restlessness': the visible motor is gone but the felt one isn't. Workload transitions — university, first management job, first baby — are when compensations collapse and diagnosis finally happens.",
    missed:
      "People whose hyperactivity faded early can be told 'you can't have ADHD, you sit still' — a decades-out-of-date criterion.",
    mislabels: [
      "The full look-alike list applies: sleep, mood, anxiety, trauma, thyroid — anything that degrades attention and self-control can imitate a combined picture.",
      "Conversely, combined-presentation emotional swings get mislabeled as bipolar or borderline patterns when they're reactive, hours-long, and trigger-tracked."
    ]
  }
};

/* Confound scales for the screeners: what mimics ADHD, and how to tell. */
const CONFOUNDS = {
  anxiety: {
    label: "Anxiety-like pattern",
    mimics: ["ia", "hi"],
    explain:
      "Worry consumes working memory, so anxiety impairs concentration and produces restlessness — a convincing ADHD imitation. The tell: anxious distraction has content (you're pulled toward the worry), while ADHD drift is contentless; and anxious restlessness feels like dread, not an idling engine. If this fits, your inattention and restlessness scores may be anxiety wearing an ADHD costume — or ADHD and anxiety together, which is common."
  },
  depression: {
    label: "Depression-like pattern",
    mimics: ["ia", "ef"],
    explain:
      "Depressive episodes flatten concentration, motivation, and memory — and when mood lifts, the 'ADHD' lifts with it. The tell is the time course: ADHD is lifelong and steady; depression descends in episodes with sleep, appetite, and energy changes. If this fits, consider whether a mood episode is coloring your answers — and don't screen yourself for ADHD from inside one."
  },
  sleep: {
    label: "Sleep-related pattern",
    mimics: ["ia", "ef", "er"],
    explain:
      "Chronic short sleep, apnea, and delayed sleep phase reproduce nearly the whole ADHD picture: distractibility, forgetfulness, irritability, poor initiation. Sleep is the first thing a competent evaluation rules out. The tell: rested stretches largely fix sleep-driven 'ADHD,' while real ADHD persists after a good week of nights. (The catch: ADHD also wrecks sleep, so both can be true.)"
  },
  bipolar: {
    label: "Bipolar-spectrum pattern",
    mimics: ["hi", "er"],
    explain:
      "Hypomania looks like hyperactivity-impulsivity: fast talk, big plans, risky spending, little sleep. The tell is episodicity: hypomania has a start and an end, runs days to weeks, and includes reduced *need* for sleep (energetic on four hours), a distinct departure from baseline. ADHD is the baseline. Misreading one as the other matters because the treatments differ sharply — this distinction genuinely needs a clinician."
  },
  autism: {
    label: "Autistic-traits pattern",
    mimics: ["ia", "er"],
    explain:
      "Autistic attention differences (monotropic deep focus, difficulty with imposed switching), sensory overload, and shutdowns can read as inattention and emotional dysregulation. The tell: autistic difficulty centers on social communication, routine change, and sensory load rather than on sustaining attention per se. Note that ADHD and autism co-occur far more often than chance — this may be an 'and,' not an 'or.'"
  },
  trauma: {
    label: "Trauma/PTSD-like pattern",
    mimics: ["ia", "hi", "er"],
    explain:
      "Hypervigilance shreds concentration; dissociation looks like zoning out; a keyed-up nervous system looks like restlessness — especially in children, trauma and ADHD are notoriously hard to distinguish. The tell: trauma responses have an onset and triggers (a before and after, intrusive memories, startle), while ADHD is lifelong and trigger-independent. If this fits, that history deserves direct attention, whatever else is true."
  },
  ocd: {
    label: "OCD-like pattern",
    mimics: ["ia"],
    explain:
      "When attention is consumed by internal loops — checking, counting, replaying — the outside world sees someone distracted and slow to finish. The tell: OCD 'distraction' is capture by repetitive, unwanted thoughts you can't skip without intense discomfort; ADHD distraction wanders freely and lands anywhere. If this fits, the loops themselves are the thing to bring to a professional."
  }
};

/* ADHD hiding under other labels — the reverse misdiagnosis direction. */
const HIDDEN_AS = [
  { label: "“Anxiety”", how: "Years of missed deadlines and lost items teach genuine, rational worry. The anxiety is real — but it's downstream. Treating only the anxiety while the executive engine misfires treats the smoke, not the fire. A tell: the worry is mostly about dropped balls, and organization help reduces it." },
  { label: "“Depression”", how: "Chronic underperformance relative to obvious ability produces demoralization that meets checklist criteria for depression. Downstream depression lifts when functioning improves; primary depression doesn't care how well the week went." },
  { label: "“Lazy / unmotivated / careless”", how: "The oldest mislabel: a motivation-regulation problem read as a character verdict. The tell that it's regulation, not character: performance is wildly inconsistent — brilliant under interest or deadline, absent otherwise. Lazy is consistent; ADHD is inconsistent." },
  { label: "“Anxious overachiever”", how: "Bright students — disproportionately girls — hold grades up through brute-force hours, all-nighters, and dread. Output looks fine, so no one asks about cost. The tell: effort per unit of output is enormous, and the system collapses at the next demand jump." },
  { label: "“Bipolar II”", how: "ADHD emotional dysregulation — fast, intense, reactive mood shifts — can be misread as cycling. ADHD moods turn in minutes-to-hours and track events; bipolar episodes run days-to-weeks and include sleep-need changes. Direction of error matters in both directions here." },
  { label: "“Borderline traits”", how: "Rejection sensitivity plus impulsivity plus stormy relationships can pattern-match to borderline personality. The distinction (identity disturbance, abandonment panic, self-harm) is genuinely clinical — but ADHD belongs in the differential and often isn't." },
  { label: "“Just stressed / just modern life”", how: "Everyone's attention is worse in the phone era, so real impairment gets normalized away. The tell: ADHD-level difficulty predates smartphones in the person's history, survives digital detoxes, and costs jobs and relationships, not just scrolling time." }
];

if (typeof module !== "undefined") {
  module.exports = { DOMAINS, CONTEXT_CHECKS, PRESENTATIONS, CONFOUNDS, HIDDEN_AS };
}
