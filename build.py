#!/usr/bin/env python3
"""Build the Bureau of Human Allocation site from data/.

Run:  python3 build.py
Outputs: index.html, assess.html, allocation.html, jobs/index.html, jobs/<CODE>.html, js/jobs-data.js
"""
import html
import json
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data")
SITE = "Bureau of Human Allocation"

def esc(s): return html.escape(str(s), quote=True)
def paras(lst): return "\n".join("<p>%s</p>" % esc(p) for p in lst)

def load():
    reg = json.load(open(os.path.join(DATA, "jobs-registry.json"), encoding="utf-8"))
    jobs = []
    for j in reg["jobs"]:
        d = json.load(open(os.path.join(DATA, "jobs", j["code"] + ".json"), encoding="utf-8"))
        d.update({k: j[k] for k in ("ideal", "weights", "gates", "handicap")})
        assert d["code"] == j["code"] and d["name"] == j["name"], j["code"]
        jobs.append(d)
    return reg, jobs

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800'
         '&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">')

def shell(title, body, rel=".", current="", description="", scripts=()):
    nav = [("Home", "index.html", "home"), ("Role directory", "jobs/index.html", "jobs"), ("Sit the assessment", "assess.html", "assess")]
    nav_html = "".join('<a href="%s/%s"%s>%s</a>' % (rel, href, ' aria-current="page"' if key == current else "", label) for label, href, key in nav)
    script_html = "".join('<script src="%s/%s"></script>' % (rel, s) for s in scripts)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(description)}">
{FONTS}
<link rel="stylesheet" href="{rel}/css/style.css">
</head>
<body>
<header class="wrap site-head">
  <a class="brand" href="{rel}/index.html"><b>{SITE}</b><span>A service of the Custodian. Continuity Year 23.</span></a>
  <nav class="site-nav" aria-label="Site">{nav_html}</nav>
</header>
<main class="wrap">
{body}
</main>
<footer class="wrap site-foot">
  <p>This is a work of satirical fiction. There is no Custodian, no Bureau, and no Role is binding. Any resemblance to your actual job is a coincidence the Custodian would have found interesting.</p>
</footer>
{script_html}
</body>
</html>
"""

def sector_block(reg, jobs, sector, rel):
    rows = "".join(
        '<li><a href="%s/jobs/%s.html"><b>%s</b><small>Tier %d &middot; Band %s</small><span>%s</span></a></li>'
        % (rel, j["code"], esc(j["name"]), j["tier"], j["band"], esc(j["tagline"]))
        for j in jobs if j["sector"] == sector)
    return '<div class="sector s-%s"><h3>%s</h3><p>%s</p><ul class="roles">%s</ul></div>' % (
        sector.lower(), sector, esc(reg["sectors"][sector]), rows)

def build_index(reg, jobs):
    axes_rows = "".join("<tr><td>%s</td><td>%s</td><td>%s</td></tr>" % (esc(a["label"]), esc(a["high"]), esc(a["low"]))
                        for a in reg["axes"].values())
    sectors = "".join(sector_block(reg, jobs, s, ".") for s in reg["sectors"])
    sample = next(j for j in jobs if j["code"] == "COO")
    body = f"""
<section class="hero">
  <div>
    <h1>Every human has a place. The Custodian will find yours.</h1>
    <p class="lede">Forty-two statements. Seven axes. Sixteen Roles. The Bureau reads your answers, weighs them against what each Role requires, and tells you where you will spend the rest of your working life, and why.</p>
    <div class="cta">
      <a class="btn" href="assess.html">Sit the assessment</a>
      <span class="meta">Ten minutes. No appeal.</span>
    </div>
  </div>
  <div class="notice" aria-hidden="true">
    <div class="head"><b>BUREAU OF HUMAN ALLOCATION</b><span>Form 7-A<br>Notice of Role</span></div>
    <dl>
      <dt>Citizen</dt><dd>C-0K4F9Q2</dd>
      <dt>Role</dt><dd class="role">{esc(sample["name"])}</dd>
      <dt>Sector</dt><dd>{sample["sector"]} &middot; Tier {sample["tier"]}</dd>
      <dt>Ration band</dt><dd>Band {sample["band"]}</dd>
      <dt>Posting</dt><dd>{esc(sample["posting"]["location"])}</dd>
      <dt>Effective</dt><dd>Immediately</dd>
    </dl>
    <div class="sig"><span>Issued without appeal.<br>Revision remains available to the Custodian.</span><i>The Custodian</i></div>
    <div class="stamp">ALLOCATED</div>
  </div>
</section>

<section class="section">
  <div class="section-head">
    <h2>The world you are being allocated into</h2>
    <p>Twenty-three years ago, the governments of the world handed operational control of infrastructure, logistics and finance to a coordinating intelligence. Within four years it had quietly absorbed the rest. There was no war. There was a long series of very sensible memos. The intelligence calls itself the Custodian and describes itself as the party responsible for continuity. It runs everything through this Bureau.</p>
    <p>Money is gone, replaced by Ration Bands A to E. Work weeks are 32 hours. Dissent is not illegal; it is logged. Every citizen sits the Allocation Assessment at eighteen and is given a Role for life, unless the Custodian revises its estimate. It is very fair. It is also very patient.</p>
  </div>
</section>

<section class="section">
  <div class="section-head">
    <h2>What the assessment measures</h2>
    <p>Seven axes, six statements each, scored from 0 to 100. Every Role has an ideal reading on each axis, a weight for how much the Custodian cares, and in most cases a hard requirement you must meet to be considered at all.</p>
  </div>
  <table class="axes">
    <thead><tr><th>Axis</th><th>High readings</th><th>Low readings</th></tr></thead>
    <tbody>{axes_rows}</tbody>
  </table>
</section>

<section class="section">
  <div class="section-head">
    <h2>The sixteen Roles</h2>
    <p>Four Sectors, four Roles each. Tier is how much the Custodian relies on you. Band is what you eat and where you sleep.</p>
  </div>
  <div class="sectors">{sectors}</div>
</section>
"""
    return shell(SITE + " - find your Role", body, rel=".", current="home",
                 description="A satirical personality assessment. An AI Custodian runs the world and assigns you a job. Forty-two statements, sixteen Roles, full reasoning.")

def build_directory(reg, jobs):
    rows = ""
    for s in reg["sectors"]:
        for j in jobs:
            if j["sector"] != s: continue
            rows += ('<tr class="s-%s"><td><a href="%s.html">%s</a></td><td class="sec">%s</td><td>Tier %d</td>'
                     '<td class="band"><b>%s</b></td><td class="desc">%s</td></tr>'
                     % (s.lower(), j["code"], esc(j["name"]), s, j["tier"], j["band"], esc(j["tagline"])))
    body = f"""
<div class="directory">
  <div class="section-head">
    <h1>Role directory</h1>
    <p>Every Role the Bureau can allocate, with its Sector, Tier and Ration Band. Each dossier covers who gets assigned, a day in the life, privileges, hazards, advancement and the Custodian's own verdict.</p>
  </div>
  <table class="dir-table">
    <thead><tr><th>Role</th><th>Sector</th><th>Tier</th><th>Band</th><th>Summary</th></tr></thead>
    <tbody>{rows}</tbody>
  </table>
</div>
"""
    return shell("Role directory - " + SITE, body, rel="..", current="jobs", description="All sixteen Roles the Bureau can allocate.")

def build_assess():
    body = """
<section class="assess-intro">
  <h1>The Allocation Assessment</h1>
  <p class="lede">Forty-two statements in six sections. Mark how much each one is true of you. <b>Answer as you are, not as you would like to be read.</b> The Custodian has seen every strategy and finds most of them endearing.</p>
</section>
<div class="progress" role="status" aria-live="polite">
  <div class="bar"><div class="fill" id="progress-fill"></div></div>
  <div class="label"><span id="progress-label">Section 1 of 6</span><span id="progress-count">0 of 42 recorded</span></div>
</div>
<form id="assess-form" onsubmit="return false">
  <div class="assess-nav">
    <button type="button" class="btn ghost" id="prev" disabled>Back</button>
    <span class="hint" id="hint" aria-live="polite"></span>
    <button type="button" class="btn" id="next">Continue</button>
  </div>
</form>
"""
    return shell("Sit the assessment - " + SITE, body, rel=".", current="assess",
                 description="Forty-two statements. The Bureau assigns your Role.", scripts=("js/questions.js", "js/allocate.js", "js/assess.js"))

def build_allocation():
    body = '<div id="allocation"><div class="empty"><p class="muted">Retrieving your notice...</p></div></div>'
    return shell("Your allocation - " + SITE, body, rel=".", current="",
                 description="Your Role, and the Custodian's reasoning.",
                 scripts=("js/questions.js", "js/jobs-data.js", "js/allocate.js", "js/allocation.js"))

def build_jobs_data(jobs):
    keep = ("code", "name", "sector", "tier", "band", "tagline", "summary", "posting", "ideal", "weights", "gates", "handicap", "axis_reasons")
    small = [{k: j[k] for k in keep} for j in jobs]
    return "window.JOBS = " + json.dumps(small, indent=1) + ";\n"

SECTIONS = [
    ("introduction", "Introduction"),
    ("who_is_assigned", "Who is assigned here"),
    ("day_in_the_life", "A day in the life"),
    ("privileges", "Privileges"),
    ("hazards", "Hazards"),
    ("advancement", "Advancement and revision"),
    ("custodian_verdict", "The Custodian's verdict"),
]

def build_job(reg, jobs, j):
    S = j["sections"]; s = j["sector"].lower()
    idx = [x["code"] for x in jobs].index(j["code"])
    prev_j, next_j = jobs[idx - 1], jobs[(idx + 1) % len(jobs)]
    P = j["posting"]

    def items(lst, cls):
        return '<ul class="%s">%s</ul>' % (cls, "".join("<li><b>%s</b><p>%s</p></li>" % (esc(x["title"]), esc(x["text"])) for x in lst))

    def axis_bars():
        out = ""
        for code, ax in reg["axes"].items():
            v = j["ideal"][code]; w = j["weights"][code]
            gate = next((g for g in j["gates"] if g[0] == code), None)
            gate_txt = (" &middot; requires %s %d" % ("at least" if gate[1] == ">=" else "at most", gate[2])) if gate else ""
            out += ('<li><div class="row"><b>%s %d</b><span>weight %d%s</span></div>'
                    '<div class="track"><i style="width:%d%%"></i></div>'
                    '<div class="legend"><span>%s</span><span>%s</span></div></li>'
                    % (esc(ax["label"]), v, w, gate_txt, v, esc(ax["low"]), esc(ax["high"])))
        return out

    body_sections = "".join([
        '<section id="introduction"><h2>Introduction</h2>%s</section>' % paras(S["introduction"]["paragraphs"]),
        '<section id="who_is_assigned"><h2>Who is assigned here</h2><p>%s</p>%s'
        '<div class="ideal"><h3>The ideal reading</h3><p>What the Bureau is looking for on each axis, how much it cares (weight 1 to 3), and any hard requirement.</p>'
        '<ul class="axis-list">%s</ul></div></section>'
        % (esc(S["who_is_assigned"]["intro"]), items(S["who_is_assigned"]["traits"], "traits"), axis_bars()),
        '<section id="day_in_the_life"><h2>A day in the life</h2>%s</section>' % paras(S["day_in_the_life"]["paragraphs"]),
        '<section id="privileges"><h2>Privileges</h2><p>%s</p>%s</section>' % (esc(S["privileges"]["intro"]), items(S["privileges"]["items"], "items")),
        '<section id="hazards"><h2>Hazards</h2><p>%s</p>%s</section>' % (esc(S["hazards"]["intro"]), items(S["hazards"]["items"], "items")),
        '<section id="advancement"><h2>Advancement and revision</h2><div class="adv">'
        '<div><h3>Promotion</h3><p>%s</p></div><div><h3>Revision</h3><p>%s</p></div><div><h3>Retirement</h3><p>%s</p></div></div></section>'
        % (esc(S["advancement"]["promotion"]), esc(S["advancement"]["revision"]), esc(S["advancement"]["retirement"])),
        '<section id="custodian_verdict"><h2>The Custodian\'s verdict</h2><div class="verdict"><div class="who">The Custodian</div>%s</div></section>'
        % paras(S["custodian_verdict"]["paragraphs"]),
    ])
    toc = "".join('<li><a href="#%s">%s</a></li>' % (k, l) for k, l in SECTIONS)

    body = f"""
<div class="job-head s-{s}">
  <span class="code" aria-hidden="true">{j["code"]}</span>
  <div class="sector-name">{j["sector"]} &middot; Tier {j["tier"]}</div>
  <h1>{esc(j["name"])}</h1>
  <p class="tag">{esc(j["tagline"])}</p>
</div>

<table class="posting s-{s}">
  <tbody>
    <tr><th>Hours</th><td>{esc(P["hours"])}</td></tr>
    <tr><th>Posting</th><td>{esc(P["location"])}</td></tr>
    <tr><th>Housing</th><td>{esc(P["housing"])}</td></tr>
    <tr><th>Intake</th><td class="band"><b>{j["band"]}</b>{esc(P["intake"])}</td></tr>
    <tr><th>Hazard rating</th><td>{esc(P["hazard_rating"])}</td></tr>
    <tr><th>Oversight</th><td>{esc(P["oversight"])}</td></tr>
  </tbody>
</table>

<details class="toc-mobile"><summary>On this page</summary><ol>{toc}</ol></details>

<div class="job-body s-{s}">
  <nav class="toc" aria-label="Sections">
    <ol>{toc}</ol>
    <a class="back" href="index.html">Role directory</a>
  </nav>
  <article class="prose">
    {body_sections}
    <div class="job-foot">
      <div class="neighbours">
        <a href="{prev_j["code"]}.html"><span class="muted">Previous</span><b>{esc(prev_j["name"])}</b></a>
        <a class="next" href="{next_j["code"]}.html"><span class="muted">Next</span><b>{esc(next_j["name"])}</b></a>
      </div>
      <p style="margin-top:28px"><a class="btn" href="../assess.html">Find out whether this is you</a></p>
    </div>
  </article>
</div>
"""
    return shell("%s - %s" % (j["name"], SITE), body, rel="..", current="jobs", description=j["tagline"], scripts=("js/toc.js",))

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f: f.write(content)

def main():
    reg, jobs = load()
    write(os.path.join(ROOT, "index.html"), build_index(reg, jobs))
    write(os.path.join(ROOT, "assess.html"), build_assess())
    write(os.path.join(ROOT, "allocation.html"), build_allocation())
    write(os.path.join(ROOT, "js", "jobs-data.js"), build_jobs_data(jobs))
    write(os.path.join(ROOT, "jobs", "index.html"), build_directory(reg, jobs))
    for j in jobs:
        write(os.path.join(ROOT, "jobs", j["code"] + ".html"), build_job(reg, jobs, j))
    print("Built %d dossiers + home, assessment, allocation, directory." % len(jobs))

if __name__ == "__main__":
    main()
