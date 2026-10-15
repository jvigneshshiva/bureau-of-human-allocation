# Bureau of Human Allocation

A satirical personality site. An AI called the Custodian runs the world; you sit a 42-statement assessment and the Bureau assigns you one of sixteen Roles, with a full explanation of why, what ruled out the alternatives, and a dossier for every Role. Plain HTML, CSS and JavaScript. No server, no build tools, no dependencies.

## Run it locally

Open `index.html` in a browser. Everything works from the file system.

Or: `python3 -m http.server 8000` and visit http://localhost:8000

## Host it

Upload the folder to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3). Nothing to configure. The `data/` folder and `build.py` are only needed to regenerate pages and can be left out of the upload.

## Structure

```
index.html            Home: the world, the seven axes, the sixteen Roles by Sector
assess.html           The assessment (42 statements, 6 sections of 7)
allocation.html       Your allocation notice and the Custodian's reasoning
jobs/index.html       Role directory
jobs/<CODE>.html      One dossier per Role (16)
css/style.css         All styles, dark mode, mobile
js/questions.js       Statement bank, axis definitions, axis scoring
js/allocate.js        The allocation engine (gates, weighted fit, decisive axes)
js/assess.js          Assessment UI
js/allocation.js      Notice page rendering
js/jobs-data.js       Generated: the registry plus short dossier fields
js/toc.js             Side navigation highlight on dossier pages
data/WORLD.md         The setting, tone, and the Role table
data/jobs-registry.json   Ideal profile, weights, gates and handicap for every Role
data/jobs/<CODE>.json     Dossier content for each Role (edit these)
data/SCHEMA.md        Content schema the dossiers follow
build.py              Regenerates all HTML from data/
```

## How allocation works

1. Each of the 42 statements belongs to one of seven axes (Compliance, Custodial Trust, Human Attachment, Hazard Tolerance, Abstraction, Novelty Appetite, Status Drive). Six statements per axis, half reverse-keyed. Answers run from -3 to +3 and each axis is scaled to 0-100.
2. Every Role in `data/jobs-registry.json` has an `ideal` reading on each axis, a `weight` (1-3) for how much that axis matters to the Role, and `gates`: hard requirements such as `["OBD", "<=", 45]`. The Control Group has no gates and a `handicap` so it only wins when nothing else fits.
3. For each Role you pass the gates for, fit is the weighted root-mean-square distance between your readings and the ideal. Lowest distance wins. The notice reports a 0-100 fit index (100 minus distance).
4. The explanation picks the three axes that most decided the win (high weight, distinctive ideal, close match) and uses that Role's `axis_reasons` lines, written in the Custodian's voice. It also names the runner-up and the single axis that ruled it out, and, if you fit a gated Role better than your assignment, says so and names the requirement you missed.
5. Firmness (firm / settled / provisional) comes from the distance margin between the winner and the runner-up.

A simulation of 20,000 realistic answer profiles puts every Role between roughly 3% and 12% of outcomes, so none dominates and none is unreachable. If you change ideals, weights or gates, rerun a similar check.

## Editing content

Edit the JSON in `data/jobs/` or the numbers in `data/jobs-registry.json`, then run `python3 build.py`. Generated HTML files should not be edited by hand. Home-page copy and the footer live in `build.py`; statements live in `js/questions.js`.

## The Roles

| Code | Role                    | Sector         | Tier | Band |
|------|-------------------------|----------------|------|------|
| LIA  | Voice of the Custodian  | Governance     | 1    | A    |
| INT  | Decree Interpreter      | Governance     | 1    | A    |
| NEG  | Enclave Negotiator      | Governance     | 1    | A    |
| DIS  | Licensed Dissident      | Governance     | 1    | B    |
| WAR  | Harmony Warden          | Civic          | 2    | B    |
| INS  | Curriculum Instructor   | Civic          | 2    | B    |
| CAR  | Caretaker               | Civic          | 2    | C    |
| ART  | Morale Artist           | Civic          | 2    | B    |
| COO  | Coolant Technician      | Infrastructure | 2    | B    |
| YLD  | Yield Steward           | Infrastructure | 2    | C    |
| ANN  | Annotation Clerk        | Infrastructure | 3    | D    |
| ARC  | Archivist of the Before | Infrastructure | 2    | C    |
| SUR  | Frontier Surveyor       | Periphery      | 2    | B    |
| BIO  | Biome Hand              | Periphery      | 3    | D    |
| DRM  | Dream Logger            | Periphery      | 3    | D    |
| CTL  | Control Group Citizen   | Periphery      | 3    | C    |

All world-building, Role names, statements and dossier text are original fiction.
