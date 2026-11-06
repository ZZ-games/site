/* ZZ Games offline support.
   Online: always loads fresh files (network first), and keeps a copy.
   Offline: serves the saved copy. Only the site pages and Cookie Clicker are saved.
   This never touches game saves (those live in localStorage, not here). */
var CACHE = "zz-offline-v1";
var SHELL = ["./", "index.html", "play.html", "gamble.html", "request.html", "style.css", "games.js", "app.js", "zz-desktop.js"];
var FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
  }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function wanted(url) {
  if (FONT_HOSTS.indexOf(url.hostname) > -1) return true;
  if (url.origin !== location.origin) return false;
  var p = url.pathname, base = location.pathname.replace(/sw\.js$/, "");
  var rel = p.indexOf(base) === 0 ? p.slice(base.length) : "";
  return rel === "" || /^(index|play|gamble|request)\.html$/.test(rel) || /^(style\.css|games\.js|app\.js|zz-desktop\.js)$/.test(rel) ||
    rel.indexOf("images/") === 0 || rel.indexOf("games/cookieclicker/") === 0;
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (!wanted(url)) return;
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && (res.ok || res.type === "opaque")) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
      }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || new Response("Offline and not saved yet. Open this game once while online.", { status: 503, headers: { "Content-Type": "text/plain" } });
      });
    })
  );
});

// Save every Cookie Clicker file so it can run with no connection.
self.addEventListener("message", function (e) {
  var d = e.data || {};
  if (d.type !== "precache" || !d.base || !d.files) return;
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(d.files.map(function (f) {
      var u = d.base + f.split("/").map(encodeURIComponent).join("/");
      return c.match(u).then(function (h) { return h || c.add(u).catch(function () {}); });
    }));
  }).then(function () {
    if (e.source) e.source.postMessage({ type: "precached", base: d.base });
  }));
});
