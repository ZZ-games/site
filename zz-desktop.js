/* ZZ Games — loaded first inside every game.
   1) Desktop mode: makes tablets look like a computer to the game, so games
      use keyboard controls instead of touch controls (great for iPad + keyboard).
   2) Keyboard focus: keeps keys going to the game and stops arrows/space
      from scrolling the page. */
(function () {
  var s = {};
  try { s = JSON.parse(localStorage.getItem("zz-settings")) || {}; } catch (e) {}
  var mode = s.desktopMode || "auto";
  var ua0 = navigator.userAgent || "";
  var isIPad = /iPad/.test(ua0) || (/Macintosh/.test(ua0) && navigator.maxTouchPoints > 0);
  var isAndroidTablet = /Android/.test(ua0) && !/Mobile/.test(ua0);
  var on = mode === "on" || (mode === "auto" && (isIPad || isAndroidTablet));

  if (on) {
    var def = function (o, k, v) {
      try { Object.defineProperty(o, k, { get: function () { return v; }, configurable: true }); } catch (e) {}
    };
    var ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
    [Navigator.prototype, navigator].forEach(function (n) {
      def(n, "userAgent", ua);
      def(n, "appVersion", ua.slice(8));
      def(n, "platform", "MacIntel");
      def(n, "maxTouchPoints", 0);
      def(n, "msMaxTouchPoints", 0);
      def(n, "vendor", "Apple Computer, Inc.");
    });
    try { def(navigator, "userAgentData", undefined); } catch (e) {}
    // Hide touch support so games don't switch to touch-only controls
    var touchProps = ["ontouchstart", "ontouchend", "ontouchmove", "ontouchcancel"];
    var owners = [window, window.Window && Window.prototype, Document.prototype, HTMLElement.prototype, Element.prototype, window.GlobalEventHandlers && GlobalEventHandlers.prototype];
    touchProps.forEach(function (k) {
      owners.forEach(function (o) { if (o) { try { delete o[k]; } catch (e) {} } });
    });
    try { delete window.TouchEvent; } catch (e) {}
    try { window.TouchEvent = undefined; } catch (e) {}
    try { if (window.DocumentTouch) window.DocumentTouch = undefined; } catch (e) {}
    // Make CSS media checks say "mouse + keyboard"
    var mm = window.matchMedia;
    if (mm) {
      window.matchMedia = function (q) {
        var str = String(q), res;
        if (/(any-)?pointer\s*:\s*coarse|(any-)?hover\s*:\s*none/.test(str)) res = false;
        else if (/(any-)?pointer\s*:\s*fine|(any-)?hover\s*:\s*hover/.test(str)) res = true;
        if (res === undefined) return mm.call(window, q);
        var real = mm.call(window, q);
        try { Object.defineProperty(real, "matches", { get: function () { return res; } }); } catch (e) {}
        return real;
      };
    }
  }

  // Keep keyboard focus on the game
  function focusGame() {
    try { window.focus(); } catch (e) {}
    var c = document.querySelector("canvas");
    if (c && document.activeElement === document.body) {
      if (!c.hasAttribute("tabindex")) c.setAttribute("tabindex", "-1");
      try { c.focus({ preventScroll: true }); } catch (e) {}
    }
  }
  window.addEventListener("load", focusGame);
  document.addEventListener("pointerdown", focusGame, true);
  document.addEventListener("touchstart", focusGame, { capture: true, passive: true });

  // Arrows / space shouldn't scroll the page while playing
  window.addEventListener("keydown", function (e) {
    var t = e.target, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || (t && t.isContentEditable)) return;
    if ([32, 33, 34, 37, 38, 39, 40].indexOf(e.keyCode) > -1) e.preventDefault();
  }, { passive: false });
})();
