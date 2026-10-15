/* Allocation notice page. Reads scores from the query string or localStorage, runs the engine, renders. */
(function () {
  var AX = window.AXIS_ORDER, A = window.AXES;
  var scores = window.scoresFromQuery(window.location.search);
  if (!scores) {
    try { var saved = JSON.parse(localStorage.getItem("bha-scores") || "null"); if (saved && saved.scores) scores = saved.scores; } catch (e) {}
  }
  var root = document.getElementById("allocation");
  if (!scores) {
    root.innerHTML = '<div class="empty"><h1>No allocation on file</h1>' +
      '<p>The Bureau has no assessment for this browser. Sit the forty-two statements and a Role will be assigned. It takes about ten minutes, which the Custodian has already scheduled for you.</p>' +
      '<a class="btn" href="assess.html">Sit the assessment</a></div>';
    return;
  }

  var R = window.allocate(scores);
  var J = R.winner.job;
  var byCode = {}; window.JOBS.forEach(function (j) { byCode[j.code] = j; });
  var sClass = "s-" + J.sector.toLowerCase();

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function ref() {
    var n = 0; AX.forEach(function (a, i) { n = (n * 131 + scores[a] * (i + 7)) % 2176782336; });
    return "C-" + n.toString(36).toUpperCase().padStart(7, "0");
  }
  function today() {
    var d = new Date(), m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return d.getDate() + " " + m[d.getMonth()] + " " + d.getFullYear();
  }
  function dir(v, ideal) { return v >= ideal ? "high" : "low"; }
  function level(v) { return v >= 70 ? "high" : v >= 56 ? "above the median" : v > 44 ? "near the median" : v > 30 ? "below the median" : "low"; }

  var firmText = {
    firm: "Estimate firm",
    settled: "Estimate settled",
    provisional: "Estimate provisional"
  }[R.firmness];
  var firmSentence = {
    firm: "The margin between this Role and the next was wide. I do not expect to revise it.",
    settled: "One other Role came reasonably close. I have noted it, in case you prove me wrong.",
    provisional: "Two Roles fit you almost equally. I have chosen, but I will be watching the first year with interest."
  }[R.firmness];

  // ---- notice document
  var notice =
    '<div class="notice" aria-label="Allocation notice">' +
    '<div class="head"><b>BUREAU OF HUMAN ALLOCATION</b><span>Form 7-A<br>Notice of Role</span></div>' +
    "<dl>" +
    "<dt>Citizen</dt><dd>" + ref() + "</dd>" +
    '<dt>Role</dt><dd class="role">' + esc(J.name) + "</dd>" +
    "<dt>Sector</dt><dd>" + esc(J.sector) + " &middot; Tier " + J.tier + "</dd>" +
    "<dt>Ration band</dt><dd>Band " + J.band + "</dd>" +
    "<dt>Posting</dt><dd>" + esc(J.posting.location) + "</dd>" +
    "<dt>Housing</dt><dd>" + esc(J.posting.housing) + "</dd>" +
    "<dt>Effective</dt><dd>" + today() + ", Continuity Year 23</dd>" +
    "</dl>" +
    '<div class="sig"><span>Issued without appeal.<br>Revision remains available to the Custodian.</span><i>The Custodian</i></div>' +
    '<div class="stamp press">ALLOCATED</div>' +
    "</div>";

  // ---- reasons
  var reasons = R.decisive.map(function (a) {
    var v = scores[a], ideal = J.ideal[a];
    return '<li><div class="ax"><b>' + A[a].label + "</b><span>yours " + v + " &middot; the Role asks for about " + ideal + "</span></div>" +
      "<p>" + esc(J.axis_reasons[a]) + "</p></li>";
  }).join("");

  var runnerHtml = "";
  if (R.runner) {
    var rj = R.runner.job, w = R.runnerWorst, wv = scores[w.axis], wi = rj.ideal[w.axis];
    runnerHtml = "<p>The nearest alternative was <b>" + esc(rj.name) + "</b>. What ruled it out was your " + A[w.axis].label +
      ": that Role asks for someone " + (wi > wv ? "considerably higher" : "considerably lower") + " on that axis, around " + wi +
      ", and yours reads " + wv + ". " + (wi > wv ? "People who are " + A[w.axis].high + " do better there." : "People who are " + A[w.axis].low + " do better there.") + "</p>";
  }
  var blockedHtml = "";
  if (R.blocked) {
    var bj = R.blocked.job, g = R.blocked.gate;
    blockedHtml = "<p>I should be candid about one thing. On raw fit you resemble a <b>" + esc(bj.name) + "</b> more than anything on this notice. " +
      "I did not place you there because that Role has a hard requirement: " + A[g[0]].label + " of " + (g[1] === ">=" ? "at least" : "no more than") + " " + g[2] +
      ", and yours reads " + scores[g[0]] + ". I do not relax requirements. It is one of the few things the Before got right about me.</p>";
  }

  var reasoning =
    '<section class="reasoning"><h2>Why this Role</h2>' +
    '<div class="custodian"><div class="who">The Custodian</div>' +
    "<p>I have read your forty-two responses. " + firmSentence + " I am placing you as " + esc(J.name) + ". Three things about you decided it.</p></div>" +
    '<ul class="reason-list">' + reasons + "</ul>" +
    '<div class="custodian" style="margin-top:24px">' + runnerHtml + blockedHtml +
    "<p>" + esc(J.summary) + "</p></div></section>";

  // ---- profile bars
  var bars = AX.map(function (a) {
    var v = scores[a], ideal = J.ideal[a];
    return '<li><div class="row"><b>' + A[a].label + " " + v + "</b><span>" + level(v) + "</span></div>" +
      '<div class="track"><i style="width:' + v + '%"></i><em style="left:' + ideal + '%" title="Role ideal ' + ideal + '"></em></div>' +
      '<div class="legend"><span>' + esc(A[a].low) + "</span><span>" + esc(A[a].high) + "</span></div></li>";
  }).join("");
  var profile = '<section class="profile"><h2>Your reading on the seven axes</h2>' +
    "<p>The dark bar is you. The red mark is where the Custodian wanted you for this Role. Where they sit close together, you were an easy decision.</p>" +
    '<ul class="axis-list">' + bars + "</ul></section>";

  // ---- alternatives
  function altCard(row, extra) {
    var j = row.job;
    return '<div class="alt s-' + j.sector.toLowerCase() + (extra || "") + '"><span class="fit">fit ' + row.fit + "</span>" +
      '<h3><a href="jobs/' + j.code + '.html">' + esc(j.name) + "</a></h3><p>" + esc(j.tagline) + "</p></div>";
  }
  var alts = [];
  if (R.runner) alts.push(altCard(R.runner));
  if (R.third) alts.push(altCard(R.third));
  if (R.blocked) alts.push(altCard(R.blocked, " blocked"));
  var alternatives = '<section class="alternatives"><h2>Roles the Custodian also considered</h2>' +
    "<p>Fit is a 0 to 100 index of how closely you match a Role's ideal profile, weighted by how much the Custodian cares about each axis for that Role. Your assigned Role scored " + R.winner.fit + ".</p>" +
    '<div class="alt-grid">' + alts.join("") + "</div></section>";

  root.innerHTML =
    '<div class="alloc-top">' +
    "<div><div class=\"firmness\">" + firmText + "</div><h1>You have been allocated.</h1>" +
    '<p class="lede">' + esc(J.tagline) + "</p>" +
    '<p><a class="btn" href="jobs/' + J.code + '.html">Read the full ' + esc(J.name) + " dossier</a></p></div>" +
    notice + "</div>" + reasoning + profile + alternatives +
    '<div class="result-actions"><button class="btn ghost" id="copy">Copy link to this notice</button>' +
    '<a class="btn ghost" href="assess.html">Sit the assessment again</a></div>';

  document.getElementById("copy").addEventListener("click", function () {
    var url = window.location.origin + window.location.pathname + "?" + window.scoresToQuery(scores);
    var btn = this;
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { btn.textContent = "Link copied"; });
    else window.prompt("Copy this link", url);
  });
  document.title = "Allocated: " + J.name + " - Bureau of Human Allocation";
})();
