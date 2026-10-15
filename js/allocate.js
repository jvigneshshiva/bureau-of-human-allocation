/* Allocation engine.
   Input: scores {OBD..AMB: 0..100}, window.JOBS (from jobs-data.js).
   Output: a full, explained allocation. Pure function; no DOM. */
(function () {
  var AX = ["OBD", "LOY", "WRM", "NRV", "ABS", "NOV", "AMB"];

  function passes(job, s) {
    for (var i = 0; i < job.gates.length; i++) {
      var g = job.gates[i], v = s[g[0]];
      if (g[1] === ">=" && !(v >= g[2])) return g;
      if (g[1] === "<=" && !(v <= g[2])) return g;
    }
    return null;
  }

  /* Weighted RMS distance between the citizen and the Role's ideal, 0..100 scale. */
  function distance(job, s) {
    var num = 0, den = 0;
    AX.forEach(function (a) {
      var w = job.weights[a], d = s[a] - job.ideal[a];
      num += w * d * d; den += w;
    });
    return Math.sqrt(num / den) + (job.handicap || 0);
  }

  function fitIndex(d) { return Math.max(0, Math.round(100 - d)); }

  /* Which axes made this Role the right call: weight x distinctiveness x closeness. */
  function decisiveAxes(job, s) {
    return AX.map(function (a) {
      var ideal = job.ideal[a], gap = Math.abs(s[a] - ideal);
      var closeness = Math.max(0, 1 - gap / 35);
      var distinct = Math.abs(ideal - 50) + 10;
      return { axis: a, score: job.weights[a] * distinct * closeness, gap: gap };
    }).filter(function (x) { return x.score > 0; })
      .sort(function (p, q) { return q.score - p.score; })
      .slice(0, 3).map(function (x) { return x.axis; });
  }

  /* The single axis that most pushed a citizen away from a Role. */
  function worstAxis(job, s) {
    var best = null;
    AX.forEach(function (a) {
      var d = s[a] - job.ideal[a], c = job.weights[a] * d * d;
      if (!best || c > best.c) best = { axis: a, c: c, diff: d };
    });
    return best;
  }

  window.allocate = function (scores) {
    var rows = window.JOBS.map(function (job) {
      var d = distance(job, scores), gate = passes(job, scores);
      return { job: job, dist: d, fit: fitIndex(d), gate: gate };
    });
    var eligible = rows.filter(function (r) { return !r.gate; }).sort(function (a, b) { return a.dist - b.dist; });
    var winner = eligible[0];
    var runner = eligible[1] || null;
    var third = eligible[2] || null;

    // A Role you fit better than your assignment but were gated out of.
    var blocked = rows.filter(function (r) { return r.gate && r.dist < winner.dist; })
      .sort(function (a, b) { return a.dist - b.dist; })[0] || null;

    var margin = runner ? runner.dist - winner.dist : 99;
    var firmness = margin >= 8 ? "firm" : margin >= 3 ? "settled" : "provisional";

    return {
      scores: scores,
      winner: winner,
      runner: runner,
      third: third,
      blocked: blocked,
      firmness: firmness,
      margin: margin,
      decisive: decisiveAxes(winner.job, scores),
      runnerWorst: runner ? worstAxis(runner.job, scores) : null,
      ranking: eligible
    };
  };

  /* Serialise scores into a query string and back, so a notice can be shared. */
  window.scoresToQuery = function (s) {
    return AX.map(function (a) { return a + "=" + s[a]; }).join("&");
  };
  window.scoresFromQuery = function (qs) {
    var p = new URLSearchParams(qs), out = {}, ok = true;
    AX.forEach(function (a) {
      var v = parseInt(p.get(a), 10);
      if (isNaN(v)) ok = false;
      out[a] = Math.max(0, Math.min(100, isNaN(v) ? 50 : v));
    });
    return ok ? out : null;
  };
})();
