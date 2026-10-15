/* Type page: highlight the current section in the side table of contents. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
  if (!links.length || !("IntersectionObserver" in window)) return;
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
  var current = null;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        if (current) current.classList.remove("current");
        current = map[e.target.id];
        if (current) current.classList.add("current");
      }
    });
  }, { rootMargin: "-10% 0px -70% 0px", threshold: 0 });
  Object.keys(map).forEach(function (id) {
    var sec = document.getElementById(id);
    if (sec) io.observe(sec);
  });
})();
