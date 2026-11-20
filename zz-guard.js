/* ZZ Games — keep visitors on the site.
   Clicks on links to other sites and window.open() calls to other sites are
   blocked, so nothing on the page can send the visitor somewhere else.
   Same-site links, new tabs of our own pages, mailto: and in-page anchors
   keep working. */
(function () {
  "use strict";
  var own = location.origin;
  function isOwn(u) {
    try {
      var x = new URL(u, location.href);
      return x.origin === own || x.protocol === "blob:" || x.protocol === "data:" ||
        x.protocol === "about:" || x.protocol === "mailto:" || x.protocol === "javascript:";
    } catch (e) { return true; }
  }
  var realOpen = window.open;
  window.open = function (u) {
    if (!u || isOwn(String(u))) { try { return realOpen.apply(window, arguments); } catch (e) {} }
    return null;
  };
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (isOwn(href)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }, true);
})();
