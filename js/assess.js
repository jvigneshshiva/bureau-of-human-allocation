/* Assessment page: 42 statements in 6 parts of 7. */
(function () {
  var PER_PAGE = 7;
  var Q = window.QUESTIONS;
  var pages = Math.ceil(Q.length / PER_PAGE);
  var answers = new Array(Q.length).fill(null);
  var page = 0;

  var form = document.getElementById("assess-form");
  var fill = document.getElementById("progress-fill");
  var label = document.getElementById("progress-label");
  var counter = document.getElementById("progress-count");
  var prev = document.getElementById("prev");
  var next = document.getElementById("next");
  var hint = document.getElementById("hint");

  var SCALE = [
    [-3, "Strongly disagree"], [-2, "Disagree"], [-1, "Slightly disagree"],
    [0, "Neither"], [1, "Slightly agree"], [2, "Agree"], [3, "Strongly agree"]
  ];

  for (var p = 0; p < pages; p++) {
    var sec = document.createElement("div");
    sec.className = "qpage" + (p === 0 ? " active" : "");
    sec.dataset.page = p;
    for (var i = p * PER_PAGE; i < Math.min(Q.length, (p + 1) * PER_PAGE); i++) sec.appendChild(renderQuestion(i));
    form.insertBefore(sec, form.querySelector(".assess-nav"));
  }

  function renderQuestion(i) {
    var q = Q[i];
    var fs = document.createElement("fieldset");
    fs.className = "q"; fs.id = "q" + i;
    fs.style.border = "1.5px solid var(--line)"; fs.style.margin = "14px 0"; fs.style.padding = "22px 22px 20px";
    var legend = document.createElement("legend"); legend.className = "sr-only";
    legend.textContent = "Statement " + (i + 1) + " of " + Q.length;
    fs.appendChild(legend);
    var num = document.createElement("div"); num.className = "num"; num.textContent = "Statement " + String(i + 1).padStart(2, "0");
    fs.appendChild(num);
    var stem = document.createElement("p"); stem.className = "stem"; stem.textContent = q.text;
    fs.appendChild(stem);

    var scale = document.createElement("div"); scale.className = "scale";
    var left = el("span", "end", "Disagree"), right = el("span", "end right", "Agree");
    var opts = document.createElement("div"); opts.className = "opts";
    SCALE.forEach(function (s) {
      var lab = document.createElement("label");
      var inp = document.createElement("input");
      inp.type = "radio"; inp.name = "q" + i; inp.value = s[0]; inp.setAttribute("aria-label", s[1]);
      inp.addEventListener("change", function () {
        answers[i] = parseInt(this.value, 10);
        fs.classList.remove("missing");
        update();
      });
      var dot = document.createElement("span"); dot.className = "dot";
      lab.appendChild(inp); lab.appendChild(dot); lab.title = s[1];
      opts.appendChild(lab);
    });
    scale.appendChild(left); scale.appendChild(opts); scale.appendChild(right);
    fs.appendChild(scale);
    return fs;
  }
  function el(tag, cls, text) { var e = document.createElement(tag); e.className = cls; e.textContent = text; return e; }
  function answered() { return answers.filter(function (a) { return a !== null; }).length; }

  function update() {
    var done = answered();
    fill.style.width = Math.round(done / Q.length * 100) + "%";
    counter.textContent = done + " of " + Q.length + " recorded";
    label.textContent = "Section " + (page + 1) + " of " + pages;
    next.textContent = page === pages - 1 ? "Submit for allocation" : "Continue";
    prev.disabled = page === 0;
  }
  function firstMissing(p) {
    for (var i = p * PER_PAGE; i < Math.min(Q.length, (p + 1) * PER_PAGE); i++) if (answers[i] === null) return i;
    return -1;
  }
  function showPage(p) {
    document.querySelectorAll(".qpage").forEach(function (s) { s.classList.toggle("active", parseInt(s.dataset.page, 10) === p); });
    page = p; hint.textContent = ""; update();
    window.scrollTo({ top: 0 });
    var first = document.querySelector(".qpage.active .q");
    if (first) { first.setAttribute("tabindex", "-1"); first.focus({ preventScroll: true }); }
  }

  prev.addEventListener("click", function () { if (page > 0) showPage(page - 1); });
  next.addEventListener("click", function () {
    var miss = firstMissing(page);
    if (miss !== -1) {
      document.querySelectorAll(".qpage.active .q").forEach(function (f, idx) {
        f.classList.toggle("missing", answers[page * PER_PAGE + idx] === null);
      });
      hint.textContent = "The Bureau requires a response to every statement in this section.";
      document.getElementById("q" + miss).scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (page < pages - 1) { showPage(page + 1); return; }
    var scores = window.scoreAxes(answers);
    try { localStorage.setItem("bha-scores", JSON.stringify({ scores: scores, at: Date.now() })); } catch (e) {}
    window.location.href = "allocation.html?" + window.scoresToQuery(scores);
  });

  update();
})();
