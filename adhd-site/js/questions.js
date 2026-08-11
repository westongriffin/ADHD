/* Question banks.
 * Each item: { text, w: {domain: weight}, k: {context: weight}, c: {confound: weight} }
 *  - w: contribution to trait-domain scores (ia, hi, ef, er); frequency 1–5 scaled 0–1 first
 *  - k: contribution to context checks (onset, pervasive, impair)
 *  - c: contribution to confound (look-alike) scales
 * Items may carry both trait and confound weight: agreement raises an ADHD domain AND
 * a look-alike scale, which is exactly how real misdiagnoses happen — the flag logic
 * compares the two.
 */

const SHORT_TEST = [
  // ---- Trait items ----
  { text: "I lose the thread of conversations or pages because my mind has drifted — even when the topic matters to me.", w: { ia: 1 } },
  { text: "I avoid or endlessly postpone tasks that need sustained mental effort, then do them in a deadline panic.", w: { ia: 1, ef: 0.3 } },
  { text: "I can focus intensely on what's novel or fascinating, but I can't summon that focus on demand for what's merely important.", w: { ia: 1 } },
  { text: "I feel driven by an internal motor — restless even when nothing needs doing.", w: { hi: 1 }, c: { anxiety: 0.25 } },
  { text: "I interrupt, blurt things out, or finish people's sentences even though I know better.", w: { hi: 1 } },
  { text: "Waiting is disproportionately hard for me, and I make impulsive decisions partly to escape it.", w: { hi: 1 } },
  { text: "Time is slippery for me — chronic lateness, or badly underestimating how long things take.", w: { ef: 1 } },
  { text: "Starting a task can feel like a physical wall, even a small task I genuinely want done.", w: { ef: 1 }, c: { depression: 0.25 } },
  { text: "I forget appointments and promises, and my spaces drift into chaos, unless external systems catch me.", w: { ef: 1, ia: 0.3 } },
  { text: "My frustration spikes fast and drains fast, and criticism or rejection hits me physically hard.", w: { er: 1 } },
  { text: "Boredom feels closer to pain than to mild discomfort.", w: { er: 0.9, hi: 0.2 } },

  // ---- Context checks ----
  { text: "These patterns were already visible before I was 12 — in report cards, teacher comments, or family stories.", k: { onset: 1 } },
  { text: "They show up in at least two areas of my life (work and home, school and friendships), even in good, low-stress periods.", k: { pervasive: 1 } },
  { text: "They've cost me concretely — grades below my ability, missed deadlines, late fees, strained relationships, or jobs.", k: { impair: 1 } },

  // ---- Look-alike screeners — pure confound detectors, no trait weight ----
  { text: "My distraction has a content: I'm pulled toward specific worries, not toward nothing in particular — and my body carries them (tension, poor sleep).", c: { anxiety: 1 } },
  { text: "For weeks at a stretch I lose interest and pleasure in nearly everything; my focus problems arrived together with a low-mood period.", c: { depression: 1 } },
  { text: "My focus problems closely track my sleep — after a few genuinely rested days, they mostly fade.", c: { sleep: 1 } },
  { text: "My high-energy, impulsive stretches come in distinct episodes of days or weeks with much less need for sleep — noticeably different from my baseline.", c: { bipolar: 1 } },
  { text: "Unwritten social rules have always felt like a foreign language to me, and intense sensory environments or sudden changes of plan genuinely destabilize me.", c: { autism: 1 } },
  { text: "My concentration problems and jumpiness began after specific overwhelming events, and come with intrusive memories or being easily startled.", c: { trauma: 1 } },
  { text: "When I zone out, it's often because I'm stuck in a repetitive mental loop — checking, counting, replaying — that I can't skip without intense discomfort.", c: { ocd: 1 } }
];

const FULL_TEST = [
  // ---- Inattention ----
  { text: "I lose the thread of conversations, lectures, or reading because my mind has drifted — even when the topic matters to me.", w: { ia: 1 } },
  { text: "Careless mistakes slip into my work despite my knowing better — wrong details, skipped steps, misread instructions.", w: { ia: 1 } },
  { text: "When a task is routine or effortful, my attention slides off it within minutes, no matter how hard I clamp down.", w: { ia: 1 } },
  { text: "I realize mid-conversation that I've heard nothing for a while, even though I meant to listen.", w: { ia: 1 } },
  { text: "I avoid or endlessly postpone tasks that require sustained mental effort — forms, taxes, long reports.", w: { ia: 1, ef: 0.3 } },
  { text: "Background noise, movement, or my own unrelated thoughts pull me off-task even when I'm trying hard to focus.", w: { ia: 1 } },
  { text: "I can focus intensely — but only when something is novel, urgent, or fascinating; I can't produce that focus on demand.", w: { ia: 0.9 } },
  { text: "I misplace everyday items — keys, phone, wallet, paperwork — over and over.", w: { ia: 0.8, ef: 0.5 } },

  // ---- Hyperactivity–impulsivity ----
  { text: "I fidget, tap, bounce a leg, or shift in my seat almost constantly.", w: { hi: 1 } },
  { text: "Sitting through long meetings, dinners, or movies feels physically hard — I want to get up and move.", w: { hi: 1 } },
  { text: "I feel driven by an internal motor — a restlessness that's there even when nothing needs doing.", w: { hi: 1 }, c: { anxiety: 0.25 } },
  { text: "I talk fast and a lot, and sometimes finish other people's sentences before they get there.", w: { hi: 1 } },
  { text: "I interrupt or blurt out answers before questions are finished, even though I know better.", w: { hi: 1 } },
  { text: "Waiting — in lines, in traffic, for slow talkers, for pages to load — is disproportionately hard for me.", w: { hi: 1 } },
  { text: "I make significant decisions on impulse — purchases, commitments, quitting things — and think them through afterwards.", w: { hi: 1 }, c: { bipolar: 0.2 } },
  { text: "I seek intensity — speed, risk, strong sensations, stirring things up — when life gets too quiet.", w: { hi: 0.9 } },

  // ---- Executive function ----
  { text: "Time is slippery for me: I'm chronically late, or absurdly early because I can't trust my own time sense.", w: { ef: 1 } },
  { text: "I underestimate how long things will take — badly and consistently.", w: { ef: 1 } },
  { text: "Starting a task can feel like a physical wall, even when the task is small and I want it done.", w: { ef: 1 }, c: { depression: 0.25 } },
  { text: "My projects accumulate as open loops: started, 80% finished, abandoned once the interesting part ended.", w: { ef: 1, ia: 0.3 } },
  { text: "Without an external deadline, a crisis, or another person, it's very hard to make myself do things I fully intend to do.", w: { ef: 1 } },
  { text: "My spaces — desk, car, inbox, bag — drift into chaos unless something external forces order.", w: { ef: 0.9 } },
  { text: "I forget appointments, errands, and promises unless they're written down and the reminder actually fires.", w: { ef: 1, ia: 0.3 } },
  { text: "Multi-step tasks fall apart on me — steps out of order, a step missed, or a stall over where to begin.", w: { ef: 1 } },

  // ---- Emotional regulation ----
  { text: "My frustration goes from zero to boiling faster than other people's — and drains away just as fast.", w: { er: 1 } },
  { text: "Small irritations — an itchy tag, a repeated noise, being interrupted mid-thought — can derail my whole mood.", w: { er: 0.9 }, c: { autism: 0.25 } },
  { text: "Criticism and rejection hit me physically hard, out of all proportion to the event.", w: { er: 1 } },
  { text: "My motivation and mood swing several times within a single day, tracking what's happening around me.", w: { er: 0.9 }, c: { bipolar: 0.2 } },
  { text: "People describe me as 'too intense' or 'too sensitive' about feelings that, for me, pass quickly.", w: { er: 0.9 } },
  { text: "Boredom feels genuinely aversive to me — closer to pain than to mild discomfort.", w: { er: 0.8, hi: 0.3 } },

  // ---- Context checks ----
  { text: "Teachers or family described me in primary school with phrases like 'doesn't apply themselves,' 'careless,' 'talks too much,' or 'off in their own world.'", k: { onset: 1 } },
  { text: "Looking back honestly, these patterns already existed before age 12 — school structure just contained them.", k: { onset: 1 } },
  { text: "These difficulties show up in at least two areas of life — work AND home, or school AND friendships — not just one.", k: { pervasive: 1 } },
  { text: "Even during good periods — low stress, decent sleep, work I enjoy — the distractibility and disorganization persist.", k: { pervasive: 1 } },
  { text: "These patterns have cost me concretely: grades below ability, missed deadlines, lost items and late fees, strained relationships, or jobs.", k: { impair: 1 } },
  { text: "I've built elaborate workarounds — alarms, lists, body-doubling, deadline all-nighters — without which things fall apart.", k: { impair: 0.9 } },

  // ---- Look-alike screeners ----
  // Anxiety
  { text: "My concentration problems have a content: I'm distracted by specific worries, not by nothing in particular.", c: { anxiety: 1 } },
  { text: "My body carries worry — muscle tension, racing heart, poor sleep — even when nothing specific is wrong.", c: { anxiety: 1 } },
  { text: "My restlessness feels like dread or being on edge, more than like an engine that wants to move.", c: { anxiety: 0.9 } },
  // Depression
  { text: "For stretches of weeks I lose interest and pleasure in nearly everything, with changes in sleep, appetite, or energy.", c: { depression: 1 } },
  { text: "My concentration problems arrived together with a low-mood period, rather than being how I've always been.", c: { depression: 1 } },
  { text: "When my mood lifts, my focus and organization largely come back on their own.", c: { depression: 0.9 } },
  // Sleep
  { text: "I regularly get under seven hours of sleep, snore heavily, or wake unrefreshed no matter how long I sleep.", c: { sleep: 1 } },
  { text: "My focus problems track my sleep closely: after a few genuinely rested days, they mostly fade.", c: { sleep: 1 } },
  { text: "I fight to stay awake during quiet daytime activities — reading, meetings, driving.", c: { sleep: 0.9 } },
  // Bipolar spectrum
  { text: "I have distinct periods of days or weeks with dramatically elevated energy and confidence and much less need for sleep — noticeably different from my baseline.", c: { bipolar: 1 } },
  { text: "My impulsive spending, talking, or risk-taking comes in episodes with a clear start and end, rather than being constant.", c: { bipolar: 1 } },
  { text: "People close to me can tell 'which version' of me a given month holds, based on my energy and mood.", c: { bipolar: 0.8 } },
  // Autism
  { text: "Unwritten social rules that others absorb naturally have always felt like a foreign language I had to study deliberately.", c: { autism: 1 } },
  { text: "Unexpected changes of plan, or intense sensory environments (noise, light, texture), genuinely destabilize me.", c: { autism: 1 } },
  { text: "I rely on routines and sameness to function — it's disruption, more than boredom, that undoes me.", c: { autism: 0.9 } },
  // Trauma / PTSD
  { text: "My concentration and jumpiness problems began after specific overwhelming events; people who knew me before say I changed.", c: { trauma: 1 } },
  { text: "I experience intrusive memories, nightmares, or a startle response that feels bodily rather than mental.", c: { trauma: 1 } },
  { text: "My 'spacing out' feels like leaving my body or losing time, especially around reminders of hard things.", c: { trauma: 0.9 } },
  // OCD
  { text: "When I zone out, it's often because I'm stuck in a repetitive mental loop — checking, counting, replaying — that I can't skip without intense discomfort.", c: { ocd: 1 } },
  { text: "I repeat actions — checking locks, rereading sent messages — driven by dread that something terrible will slip through.", c: { ocd: 1 } }
];

if (typeof module !== "undefined") {
  module.exports = { SHORT_TEST, FULL_TEST };
}
