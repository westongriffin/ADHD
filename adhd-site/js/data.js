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

/* Strategy library for the toolbox page.
 * Everything here is workaround-level, not treatment: externalize, shrink,
 * automate, and design the environment instead of betting on willpower. */
const STRATEGY_CATS = {
  start:  { label: "Getting started" },
  time:   { label: "Time" },
  memory: { label: "Memory & organization" },
  focus:  { label: "Focus environment" },
  emotion:{ label: "Emotion" },
  sleep:  { label: "Sleep" },
  work:   { label: "Work & school" },
  social: { label: "Relationships" }
};

const STRATEGIES = [
  // Getting started
  { cat: "start", title: "The two-minute entry point",
    how: "Shrink the task until it's laughably small — 'open the document,' not 'write the report.' Starting is the broken step, not working; once in motion, momentum is cheap. If the tiny version still won't start, it's still too big." },
  { cat: "start", title: "Body doubling",
    how: "Work alongside another person — in the same room, on a video call, or in an online co-working session. You don't interact; they just exist. External presence supplies the activation an ADHD brain won't self-generate for dull tasks." },
  { cat: "start", title: "Temptation bundling",
    how: "Pair a dreaded task with something pleasant that's only allowed during the task: that podcast only while doing dishes, that fancy coffee only while doing taxes. You're borrowing interest from one activity to fuel another." },
  { cat: "start", title: "Manufacture a witnessed deadline",
    how: "Self-imposed deadlines don't fire; witnessed ones do. Book the meeting where you'll present it, tell a colleague you'll send it by 4 p.m., schedule the review before the work is done. Urgency is a fuel your engine actually runs on — install some." },
  { cat: "start", title: "Do it badly, on purpose",
    how: "Give yourself explicit permission to produce a terrible first version — an ugly draft, a half-packed bag, a wrong plan. Perfectionism is a task-initiation tax: the standard blocks the start. Bad work is editable; nonexistent work isn't." },

  // Time
  { cat: "time", title: "Make time visible",
    how: "Time-blindness responds to making time a thing you can see rather than estimate: analog clocks in every room, visual countdown timers, a written schedule in your eyeline. If time only exists in your head, it doesn't exist." },
  { cat: "time", title: "Sprint, don't marathon",
    how: "Work in short, timed sprints (10–50 minutes) with real breaks — the focus timer on this page exists for exactly this. A visible endpoint converts an unbounded slog into a boarded train, and boredom gets a scheduled exit instead of an impulsive one." },
  { cat: "time", title: "The ×1.5 rule",
    how: "Whatever you estimated, multiply by 1.5–2 before you promise it to anyone. ADHD time estimates are systematically, not randomly, optimistic — so correct systematically. Track a few real tasks against your guesses to find your personal multiplier." },
  { cat: "time", title: "Alarm the transitions, not just the starts",
    how: "The dangerous moments are exits: when to stop this task, when to leave the house, when to go to bed. Set alarms for endings — with labels ('shoes on NOW') — because momentum plus time-blindness will otherwise eat the buffer you swore you had." },
  { cat: "time", title: "Anchor tasks to events, not clock times",
    how: "'After my coffee' fires more reliably than 'at 9:15,' because the event is in front of you and the clock isn't. Chain new habits onto things that already happen: meds live next to the kettle, gym bag packs itself the moment laundry finishes." },

  // Memory & organization
  { cat: "memory", title: "One capture point, always",
    how: "One notes app or one pocket notebook, and an iron rule: everything gets captured the second it appears — ideas, promises, 'I should…'. Working memory is not a storage medium; stop using it as one. Sort the capture pile later, on a schedule." },
  { cat: "memory", title: "The launchpad",
    how: "One bowl or hook by the door where keys, wallet, badge, and headphones live — and a rule that they never land anywhere else. You're not tidying; you're removing a daily search task from a system that can't afford it." },
  { cat: "memory", title: "Out of sight is out of existence — so keep it in sight",
    how: "Open shelves beat closed drawers, clear containers beat opaque ones, a wall calendar beats a hidden app. ADHD forgetting is object impermanence for tasks: design your space so the important things ambush your eyes." },
  { cat: "memory", title: "Reminders that fire, not lists that sit",
    how: "A list waits politely to be remembered; an alarm interrupts. Convert list items into notifications anchored to the time and place of action — 'take out bins' at 8 p.m. Tuesday at home, not on a page you'd have to think to open." },
  { cat: "memory", title: "Close loops under two minutes on the spot",
    how: "If a reply, filing, or decision takes less than two minutes, do it immediately — not because efficiency, but because every open loop you carry is working-memory rent, and your working memory is already over-leased." },

  // Focus environment
  { cat: "focus", title: "Design the environment, not the willpower",
    how: "Phone in another room (not face-down — another room), site blockers during sprints, one browser tab, headphones on. Every removed temptation is a battle you no longer have to win with executive function you don't have spare." },
  { cat: "focus", title: "Match sound to task",
    how: "Silence, brown noise, rain, instrumental music, one familiar album on loop — different brains and different tasks want different sound floors. Experiment deliberately; many people with ADHD focus measurably better with the right steady input." },
  { cat: "focus", title: "Fidget on purpose",
    how: "Doodling in meetings, a fidget object, knitting during calls, walking meetings — channeled motion isn't a distraction from attention, it's often the price of it. Pick fidgets that don't demand eyes or language and let the motor idle legally." },
  { cat: "focus", title: "The parking lot",
    how: "Keep paper beside you while working. When an intrusive thought arrives ('reply to Sam!', 'what's that actor's name?'), write it in the lot and return. The thought wanted to be kept, not acted on — capture satisfies it." },
  { cat: "focus", title: "One screen, one task",
    how: "Full-screen the thing you're working on. Multiple visible windows are multiple invitations, and ADHD attention accepts invitations. This is the cheapest environmental fix that exists." },

  // Emotion
  { cat: "emotion", title: "Name rejection sensitivity when it fires",
    how: "That physical gut-punch after criticism or a read-but-unanswered message has a name (RSD), a mechanism, and a course — fast up, fast down. Label it, and don't send the reply or make the decision for 24 hours. The feeling is real; its size is a misreport." },
  { cat: "emotion", title: "The weather rule",
    how: "ADHD moods are storms, not climates: intense, fast-arriving, fast-passing, and event-triggered. Before concluding anything large ('I hate this job,' 'they don't respect me'), wait for the front to pass — re-examine in a few hours, not mid-downpour." },
  { cat: "emotion", title: "Movement is a first-line mood tool",
    how: "Exercise is among the best-evidenced non-medication supports for ADHD — mood, focus, and impulse control all respond. It doesn't need to be a program: a hard walk when agitation spikes is using the tool. Make it stupidly easy to start (see 'two-minute entry point')." },
  { cat: "emotion", title: "Pre-plan the boredom exits",
    how: "Boredom mid-task will come, and it will hurt more than it does for other people. Decide the exit ramp in advance — stand up, water, 20 push-ups, look out the window for two minutes — so the exit isn't your phone, which is a one-way ramp." },

  // Sleep
  { cat: "sleep", title: "Set a bedtime alarm, not just a waking one",
    how: "Revenge bedtime procrastination — staying up to reclaim the day — runs on time-blindness. An alarm one hour before target bedtime, labeled honestly ('you will hate tomorrow'), makes the invisible cost visible at the decision moment." },
  { cat: "sleep", title: "Park the mind on paper",
    how: "Ten minutes before bed, brain-dump tomorrow onto paper: tasks, worries, the thing you must not forget. The 1 a.m. racing mind is often working memory refusing to power down while it's still holding things. Put them down somewhere safe first." },
  { cat: "sleep", title: "Guard the wake time",
    how: "A consistent wake time — same hour, weekends included, light immediately — is the strongest lever on a delayed sleep rhythm, which is disproportionately common with ADHD. The bedtime follows the wake time; it doesn't work the other way around." },

  // Work & school
  { cat: "work", title: "Get it in writing",
    how: "Spoken instructions evaporate; email survives. After meetings, send the summary yourself ('so I'm doing X by Friday, right?') — it fixes your memory, catches misunderstandings, and quietly builds a reputation for reliability instead of the opposite." },
  { cat: "work", title: "Spend your best focus on the worst task",
    how: "Whatever daily window your focus is genuinely good — first coffee, late night — spend it on the most aversive item, not the most interesting one. Interest-driven work will happen anyway; the dreaded thing only happens on purpose." },
  { cat: "work", title: "Break big deliverables into witnessed stages",
    how: "One deadline in six weeks is an ADHD trap; four staged check-ins is a structure. Ask for interim reviews explicitly — it's a normal, reasonable accommodation, and it converts one distant cliff into several nearby, motivating ledges." },
  { cat: "work", title: "Automate everything recurring",
    how: "Autopay every bill, standing orders, subscription deliveries for essentials, calendar templates for routines. Every automated task is one your executive system permanently stops carrying — and late fees are an ADHD tax you can actually cancel." },

  // Relationships
  { cat: "social", title: "Tell the people who matter how the machine works",
    how: "Unexplained ADHD reads as not caring: lateness reads as disrespect, forgetting as indifference. Naming the mechanism — with the fixes you're using, not as a blanket excuse — changes the story from 'doesn't care' to 'cares, works differently.'" },
  { cat: "social", title: "The repeat-back protocol",
    how: "When plans are made, repeat them back out loud and put them in the calendar while the other person watches. It feels mechanical for ten seconds and prevents the hurt of a forgotten dinner, which lasts considerably longer." },
  { cat: "social", title: "Listen with your hands busy",
    how: "If eye-contact stillness makes you drift mid-conversation, say so and doodle or fidget while listening — most people prefer a slightly fidgety person who heard them to a perfectly still one who didn't." }
];

if (typeof module !== "undefined") {
  module.exports = { DOMAINS, CONTEXT_CHECKS, PRESENTATIONS, CONFOUNDS, HIDDEN_AS, STRATEGY_CATS, STRATEGIES };
}
