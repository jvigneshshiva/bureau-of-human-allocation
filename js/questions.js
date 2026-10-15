/* The Allocation Assessment: 42 statements, 6 per axis.
   axis: OBD LOY WRM NRV ABS NOV AMB
   key: +1 means agreeing raises the axis score; -1 means agreeing lowers it.
   Items are interleaved and half are reverse-keyed. */

window.QUESTIONS = [
  { axis: "OBD", key: 1,  text: "When a rule seems pointless, you follow it anyway and raise the matter later through the proper channel." },
  { axis: "LOY", key: 1,  text: "A decision made by a system that has seen a billion cases is more trustworthy than one made by a wise person who has seen a hundred." },
  { axis: "WRM", key: 1,  text: "A day with no real conversation in it feels wasted, whatever else you got done." },
  { axis: "NRV", key: 1,  text: "When an alarm sounds, you feel sharper rather than frightened." },
  { axis: "ABS", key: 1,  text: "You would rather understand why a machine works than be able to fix it." },
  { axis: "NOV", key: 1,  text: "Doing the same task the same way for a third day in a row makes you restless." },
  { axis: "AMB", key: 1,  text: "You would accept a harder, longer week in exchange for a title that people recognise." },

  { axis: "OBD", key: -1, text: "If you are confident a procedure is wrong, you quietly do it your own way." },
  { axis: "LOY", key: -1, text: "There are kinds of judgment that should never be handed to a machine, however capable it is." },
  { axis: "WRM", key: -1, text: "You are perfectly content working alone for weeks with only brief check-ins." },
  { axis: "NRV", key: -1, text: "You check twice before stepping onto anything that might not hold your weight." },
  { axis: "ABS", key: -1, text: "You learn best by taking something apart with your hands, not by reading about it." },
  { axis: "NOV", key: -1, text: "A predictable routine makes you feel safe rather than bored." },
  { axis: "AMB", key: -1, text: "Being noticed by important people makes you uneasy rather than pleased." },

  { axis: "OBD", key: 1,  text: "Schedules exist to be kept, even when nobody would notice if you slipped." },
  { axis: "LOY", key: 1,  text: "If a recommendation from an automated system contradicts your gut, you follow the system." },
  { axis: "WRM", key: 1,  text: "You notice when someone in the room is struggling before they say a word." },
  { axis: "NRV", key: 1,  text: "You have deliberately gone somewhere dangerous because it looked interesting." },
  { axis: "ABS", key: 1,  text: "You enjoy arguments about definitions and principles that have no practical consequence." },
  { axis: "NOV", key: 1,  text: "You would rather try an untested method and fail than repeat a proven one and succeed." },
  { axis: "AMB", key: 1,  text: "When you join a group, you quickly work out who holds the real influence and position yourself near them." },

  { axis: "OBD", key: -1, text: "You have been reprimanded more than once for doing something you still think was right." },
  { axis: "LOY", key: -1, text: "You feel a pull toward old things, old ways and the time before everything was managed." },
  { axis: "WRM", key: -1, text: "Other people's emotional crises are mostly an interruption to the work." },
  { axis: "NRV", key: -1, text: "A job with a written injury rate, however low, is a job you would turn down." },
  { axis: "ABS", key: -1, text: "If it cannot be measured, weighed or held, it is probably not worth much thought." },
  { axis: "NOV", key: -1, text: "You wear, eat and listen to much the same things you did five years ago, by choice." },
  { axis: "AMB", key: -1, text: "A small life with no one reporting to you and no one watching sounds ideal." },

  { axis: "OBD", key: 1,  text: "Authority is usually right about the big picture, even when it is wrong about the details." },
  { axis: "LOY", key: 1,  text: "Humanity ran the world for a long time and did not do it especially well." },
  { axis: "WRM", key: 1,  text: "You would give up a privilege of your own to spare someone else a hardship." },
  { axis: "NRV", key: 1,  text: "Physical pain and discomfort bother you less than most people." },
  { axis: "ABS", key: 1,  text: "You often catch yourself building a theory about something ordinary, like a queue or a bus timetable." },
  { axis: "NOV", key: 1,  text: "You need to make something new, however small, most days of the week." },
  { axis: "AMB", key: 1,  text: "You keep a mental tally of who is ahead of you and who is behind." },

  { axis: "OBD", key: -1, text: "The right thing to do is often not the permitted thing to do." },
  { axis: "LOY", key: -1, text: "You would feel safer if a human, not a program, had the final say over your life." },
  { axis: "WRM", key: -1, text: "You rarely feel lonely and are sometimes surprised that other people do." },
  { axis: "NRV", key: -1, text: "In a crisis you freeze for a moment before you can act." },
  { axis: "ABS", key: -1, text: "You trust a person with dirty hands over a person with a diagram." },
  { axis: "NOV", key: -1, text: "Change for its own sake is a sign that something is wrong with the person asking for it." },
  { axis: "AMB", key: -1, text: "You would rather be useful and unknown than celebrated and spread thin." }
];

window.AXES = {
  OBD: { label: "Compliance",       high: "follows rules and authority without friction", low: "questions, resists, bends rules" },
  LOY: { label: "Custodial Trust",  high: "trusts the Custodian and machine judgment",      low: "nostalgic for the Before, distrusts machines" },
  WRM: { label: "Human Attachment", high: "people-focused and caring",                      low: "task-focused and self-sufficient" },
  NRV: { label: "Hazard Tolerance", high: "calm in danger, seeks risk",                     low: "cautious, prefers safety" },
  ABS: { label: "Abstraction",      high: "theoretical and analytical",                     low: "hands-on and practical" },
  NOV: { label: "Novelty Appetite", high: "craves change and creation",                     low: "prefers routine and stability" },
  AMB: { label: "Status Drive",     high: "wants rank and influence",                       low: "content with a quiet life" }
};
window.AXIS_ORDER = ["OBD", "LOY", "WRM", "NRV", "ABS", "NOV", "AMB"];

/* answers: array of 42 values in -3..3 or null. Returns {OBD: 0..100, ...}. */
window.scoreAxes = function (answers) {
  var sum = {}, n = {};
  window.AXIS_ORDER.forEach(function (a) { sum[a] = 0; n[a] = 0; });
  window.QUESTIONS.forEach(function (q, i) {
    var v = answers[i];
    if (v === null || v === undefined) return;
    sum[q.axis] += v * q.key;
    n[q.axis] += 1;
  });
  var out = {};
  window.AXIS_ORDER.forEach(function (a) {
    var max = (n[a] || 1) * 3;
    out[a] = Math.round(50 + (sum[a] / max) * 50);
  });
  return out;
};
