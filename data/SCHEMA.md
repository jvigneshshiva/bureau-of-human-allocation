# Dossier schema: one file per Role at data/jobs/<CODE>.json

Read WORLD.md first for setting, tone and the Role table. Read the Role's entry in jobs-registry.json so the dossier matches its ideal profile on the seven axes (for example, a Role whose ideal Compliance is 15 must describe rule-benders; a Role with Status Drive 10 must describe people with no interest in rank).

```json
{
  "code": "LIA",
  "name": "Voice of the Custodian",
  "sector": "Governance",
  "tier": 1,
  "band": "A",
  "tagline": "One sentence, under 15 words. In the Custodian's voice or neutral Bureau voice.",
  "summary": "Two or three sentences for the directory and the allocation notice. What the job is and who ends up in it.",
  "posting": {
    "hours": "e.g. 32 hours, split shifts around decree cycles",
    "location": "e.g. District Core, Level 1 (windows)",
    "housing": "e.g. Single unit, 24 square metres, window",
    "intake": "e.g. Band A: fresh produce, real coffee, meat on Fridays",
    "hazard_rating": "Low | Moderate | High | Severe",
    "oversight": "e.g. Continuous (every utterance logged and scored)"
  },
  "sections": {
    "introduction": { "paragraphs": ["...", "...", "..."] },
    "who_is_assigned": {
      "intro": "One paragraph: the kind of person the Bureau routes here, in terms of the seven axes, without naming the axes mechanically.",
      "traits": [ {"title": "Short name", "text": "2-3 sentences."}, ... exactly 5 ]
    },
    "day_in_the_life": { "paragraphs": ["...", "...", "...", "..."] },
    "privileges": {
      "intro": "One paragraph.",
      "items": [ {"title": "Short name", "text": "1-2 sentences."}, ... exactly 4 ]
    },
    "hazards": {
      "intro": "One paragraph.",
      "items": [ {"title": "Short name", "text": "1-2 sentences."}, ... exactly 4 ]
    },
    "advancement": {
      "promotion": "One paragraph: how you rise, and to what.",
      "revision": "One paragraph: how you get demoted or reassigned, and where people from this Role usually end up.",
      "retirement": "One paragraph: what happens at the end."
    },
    "custodian_verdict": { "paragraphs": ["...", "..."] }
  },
  "axis_reasons": {
    "OBD": "One sentence, first person as the Custodian, explaining why this Role needs the level of Compliance in its ideal profile. Used in the allocation notice when this axis was decisive. Example for a high-Compliance Role: 'You do what the schedule says, and the schedule is how I keep nine million people fed.'",
    "LOY": "...", "WRM": "...", "NRV": "...", "ABS": "...", "NOV": "...", "AMB": "..."
  }
}
```

## Writing rules

- Satirical dystopian fiction. The Custodian is polite, sincere, bureaucratic and faintly unnerving. Humour through euphemism and deadpan, never through cruelty or gore. No real people, companies or products.
- Voice: "introduction", "who_is_assigned", "day_in_the_life", "privileges", "hazards", "advancement" are written by the Bureau in second person ("you"), like an official but oddly candid job description. "custodian_verdict" and every "axis_reasons" line are the Custodian speaking in first person ("I").
- Each paragraph 70-120 words. Concrete: name places (District Core, Server Hall Four, the food domes, the Periphery, the Enclaves, the Dead Zones), objects, times of day, procedures, small telling details.
- Use the world's vocabulary: the Handover, the Before, Districts, Ration Bands A-E, intake, rest surface, revision, logged, continuity, legible.
- Day in the life: walk through a shift chronologically with times.
- Make each Role feel like a different life, not a reskin.
- Plain ASCII punctuation only. Straight quotes. No em dashes; use commas or full stops. No markdown inside strings.
- Valid JSON.
