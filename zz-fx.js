/* ZZ Games — motion layer. Pairs with zz-fx.css. Loaded last on every page.
   1. Floating dock (tightens on scroll) + the gliding tab pill
   2. Pointer light + card tilt
   3. Press ripple on buttons
   4. Scroll reveals: things cascade in as they enter the screen
   5. Live backdrop: drifting light, a grid with depth, twinkles, click ripples
   Nothing here changes how the site works. Respects "Reduce animations"
   (site setting) and the device's reduced-motion setting. */
(function () {
  "use strict";
  var root = document.documentElement, body = document.body;
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem("zz-settings")) || {}; } catch (e) {}
  if (saved.reduceMotion) root.classList.add("reduce-motion");
  var mq = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  // Settings → "Reduce animations" turns motion off. A device set to reduce motion still gets the
  // animations, just without the big movement (card tilt, background drift and parallax).
  var calm = function () { return root.classList.contains("reduce-motion"); };
  var gentle = function () { return mq.matches; };
  var isPlay = body.classList.contains("play-page");
  root.classList.add("fx");

  /* ---------- 1. Dock + pill ---------- */
  var bar = document.querySelector(".topbar, .m-nav");
  if (bar) {
    var tight = false;
    var space = function () { if (!tight) root.style.setProperty("--fx-bar-space", (bar.offsetHeight + 24) + "px"); };
    var onScroll = function () {
      var y = window.scrollY, next = tight ? y > 6 : y > 28;   // two thresholds so it never flickers
      if (next !== tight) { tight = next; bar.classList.toggle("fx-scrolled", tight); }
    };
    space(); onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", space);
    if ("ResizeObserver" in window) new ResizeObserver(space).observe(bar);   // e.g. the nav wraps onto two rows
  }

  // Movies / TV share one page: light up the right tab
  if (body.classList.contains("watch-page")) {
    var kind = new URLSearchParams(location.search).get("type") === "tv" ? "tv" : "movies";
    var tab = document.querySelector('.zz-links a[data-ch="' + kind + '"]');
    if (tab) { tab.classList.add("on"); tab.setAttribute("aria-current", "page"); }
  }

  var links = document.querySelector(".zz-links, .m-links");
  if (bar && links) {
    var tabs = [].slice.call(links.querySelectorAll("a"));
    var pill = bar.querySelector(".fx-pill");
    if (!pill) {
      pill = document.createElement("span");
      pill.className = "fx-pill"; pill.setAttribute("aria-hidden", "true");
      bar.insertBefore(pill, links);
    }
    // One smooth glide to whatever tab you point at. Leaving the tabs, it waits a beat and
    // then eases back to the tab you're on, so sweeping across the bar never jerks.
    var here = function () { return links.querySelector("a.on"); };
    var at = null, backT = 0;
    var place = function (a, instant) {
      clearTimeout(backT);
      at = a || null;
      tabs.forEach(function (t) { t.classList.toggle("fx-lit", t === a); });
      if (!a) { pill.style.opacity = 0; return; }
      var r = a.getBoundingClientRect(), b = bar.getBoundingClientRect();
      var x = r.left - b.left - bar.clientLeft, y = r.top - b.top - bar.clientTop;
      pill.classList.toggle("fx-peek", a !== here());
      if (instant || calm()) pill.style.transition = "none";
      pill.style.width = r.width + "px"; pill.style.height = r.height + "px";
      pill.style.transform = "translate(" + x + "px," + y + "px)";
      pill.style.opacity = 1;
      if (instant || calm()) { void pill.offsetWidth; pill.style.transition = ""; }
    };
    var home = function () {
      pill.classList.remove("fx-squish");
      clearTimeout(backT);
      backT = setTimeout(function () { place(here()); }, 90);
    };
    tabs.forEach(function (a) {
      a.addEventListener("pointerenter", function () { place(a); });
      a.addEventListener("focus", function () { place(a); });
      a.addEventListener("pointerdown", function () { place(a); pill.classList.add("fx-squish"); });
      a.addEventListener("pointerup", function () { pill.classList.remove("fx-squish"); });
      a.addEventListener("pointercancel", function () { pill.classList.remove("fx-squish"); });
    });
    links.addEventListener("pointerleave", home);
    links.addEventListener("focusout", function (e) { if (!links.contains(e.relatedTarget)) home(); });
    var settle = function () { var a = at || here(); clearTimeout(backT); place(a, true); };
    settle();
    addEventListener("resize", settle);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
    if ("ResizeObserver" in window) new ResizeObserver(settle).observe(bar);
    addEventListener("pageshow", function () { at = null; pill.classList.remove("fx-squish"); settle(); });
  }

  /* ---------- 2. Pointer light + card tilt ---------- */
  var mouse = { x: innerWidth / 2, y: innerHeight * .3, on: false };
  var LIGHT = ".card, .zz-panel, .m-panel, .related-card, .cw-card, .spot-main, .watch-hero";
  var pend = null, raf = 0, last = null;
  function clearTilt(el) { if (el) { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); } }
  function apply() {
    raf = 0;
    var e = pend, t = e.target && e.target.closest ? e.target.closest(LIGHT) : null;
    if (last && last !== t) clearTilt(last);
    last = t;
    if (!t) return;
    var r = t.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    t.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
    t.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    if (!calm() && !gentle() && t.classList.contains("card") && !body.classList.contains("music")) {
      var k = 8;
      t.style.setProperty("--ry", ((x - .5) * k).toFixed(2) + "deg");
      t.style.setProperty("--rx", ((.5 - y) * k).toFixed(2) + "deg");
    }
  }
  document.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    pend = e; mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true;
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });
  document.addEventListener("pointerleave", function () { clearTilt(last); last = null; mouse.on = false; });

  /* ---------- 3. Press ripple ---------- */
  document.addEventListener("pointerdown", function (e) {
    var b = e.target && e.target.closest ? e.target.closest(".btn") : null;
    if (!b || b.disabled || calm()) return;
    var r = b.getBoundingClientRect();
    b.style.setProperty("--px", (e.clientX - r.left) + "px");
    b.style.setProperty("--py", (e.clientY - r.top) + "px");
    b.classList.remove("fx-press"); void b.offsetWidth; b.classList.add("fx-press");
    setTimeout(function () { b.classList.remove("fx-press"); }, 650);
  }, { passive: true });

  /* ---------- 4. Scroll reveals ----------
     Items already on screen cascade in. Items below wait (hidden) and rise
     in as they scroll into view, a few at a time. Classes are removed once
     the motion ends so hover effects stay snappy. */
  var ITEMS = ".grid > *, .related-grid > *, .cast-grid > *, .gamble-grid > *";
  var BLOCKS = ".row-wrap, .watch-section:not(#browseWrap), .mine";
  var STEP = 32, MAX_DELAY = 520;
  var tidy = function (el, ms) {
    setTimeout(function () { el.classList.remove("fx-cascade", "fx-show", "fx-wait"); el.style.removeProperty("--d"); }, ms);
  };
  var inView = function (el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight * .96 && r.width > 0;
  };
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    var n = 0;
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target; io.unobserve(el);
      var d = Math.min(n++ * STEP, MAX_DELAY);
      el.style.setProperty("--d", d);
      el.classList.add("fx-show"); el.classList.remove("fx-wait");
      tidy(el, d + 800);
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: .06 }) : null;

  function reveal(list) {
    if (calm() || isPlay || !list.length) return;
    var n = 0;
    list.forEach(function (el) {
      if (el.nodeType !== 1 || el.__fx) return;
      el.__fx = 1;
      if (inView(el) || !io) {
        var d = Math.min(n++ * STEP, MAX_DELAY);
        el.style.setProperty("--d", d);
        el.classList.add("fx-cascade");
        tidy(el, d + 700);
      } else {
        el.classList.add("fx-wait");
        io.observe(el);
      }
    });
  }
  reveal([].slice.call(document.querySelectorAll(ITEMS + "," + BLOCKS)));
  if (!body.classList.contains("music")) {
    new MutationObserver(function (muts) {
      var added = [];
      muts.forEach(function (m) {
        [].forEach.call(m.addedNodes, function (node) {
          if (node.nodeType !== 1) return;
          if (node.matches(ITEMS) || node.matches(BLOCKS)) added.push(node);
        });
      });
      if (added.length) reveal(added);
    }).observe(body, { childList: true, subtree: true });
  }
  // safety: never leave anything hidden (e.g. a box scrolled sideways)
  addEventListener("load", function () {
    setTimeout(function () {
      document.querySelectorAll(".fx-wait").forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) { el.classList.add("fx-show"); el.classList.remove("fx-wait"); tidy(el, 800); }
      });
    }, 1500);
  });

  /* ---------- 6. Now playing (music keeps playing across the site) ----------
     While a song plays, pages open inside the Music player. Their nav gets a small
     "now playing" button; tapping it drops down the controls. */
  (function nowPlaying() {
    var M = null;
    try { if (window.parent !== window && window.parent.ZZMusic) M = window.parent.ZZMusic; } catch (e) {}
    var bar0 = document.querySelector(".topbar");
    if (!M || !bar0) return;
    var IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    var I = {
      play: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
      pause: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
      prev: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg>',
      next: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg>',
      vol: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>',
      down: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
    };
    var wrap = document.createElement("div");
    wrap.className = "np-wrap"; wrap.hidden = true;
    wrap.innerHTML =
      '<button type="button" class="np-pill" aria-haspopup="true" aria-expanded="false" aria-label="Now playing">' +
        '<span class="np-eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="np-pill-txt"></span>' + I.down + '</button>' +
      '<div class="np-drop" role="dialog" aria-label="Music controls" hidden>' +
        '<div class="np-d-top"><span class="np-d-art"></span><div class="np-d-meta"><b></b><small></small></div></div>' +
        '<div class="np-d-prog"><span class="np-t0">0:00</span><input type="range" class="np-seek" min="0" max="1000" value="0" aria-label="Seek"><span class="np-t1">0:00</span></div>' +
        '<div class="np-d-ctrl"><button type="button" class="np-b np-prev" aria-label="Previous">' + I.prev + '</button>' +
          '<button type="button" class="np-b np-play" aria-label="Play">' + I.play + '</button>' +
          '<button type="button" class="np-b np-next" aria-label="Next">' + I.next + '</button></div>' +
        (IOS ? '' : '<div class="np-d-vol">' + I.vol + '<input type="range" class="np-vol" min="0" max="100" aria-label="Volume"></div>') +
        '<a class="np-d-open" href="music.html">Open Music</a>' +
      '</div>';
    var gear = bar0.querySelector(":scope > .icon-btn");
    if (gear) bar0.insertBefore(wrap, gear); else bar0.appendChild(wrap);
    var $ = function (s) { return wrap.querySelector(s); };
    var pill = $(".np-pill"), drop = $(".np-drop"), seek = $(".np-seek"), vol = $(".np-vol");
    var seeking = false, lastArt = "";
    var fmt = function (s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); };
    function paint() {
      var st; try { st = M.state(); } catch (e) { return; }
      wrap.hidden = !st.active;
      if (!st.active) { if (!drop.hidden) toggleDrop(false); return; }
      wrap.classList.toggle("on", st.playing);
      $(".np-pill-txt").textContent = st.title;
      pill.title = st.title + (st.artist ? " · " + st.artist : "");
      if (drop.hidden) return;
      $(".np-d-meta b").textContent = st.title; $(".np-d-meta small").textContent = st.artist;
      if (st.art !== lastArt) { lastArt = st.art; $(".np-d-art").style.backgroundImage = st.art ? "url('" + st.art.replace(/'/g, "%27") + "')" : ""; }
      var playBtn = $(".np-play");
      playBtn.innerHTML = st.playing ? I.pause : I.play; playBtn.setAttribute("aria-label", st.playing ? "Pause" : "Play");
      $(".np-t1").textContent = fmt(st.dur);
      if (!seeking) { $(".np-t0").textContent = fmt(st.pos); seek.value = st.dur ? Math.round(st.pos / st.dur * 1000) : 0; }
      seek.style.setProperty("--p", (seek.value / 10) + "%");
      if (vol && document.activeElement !== vol) { vol.value = Math.round(st.vol * 100); vol.style.setProperty("--p", vol.value + "%"); }
    }
    var closeT = 0;
    function toggleDrop(open) {
      if (open == null) open = drop.hidden;
      clearTimeout(closeT);
      pill.setAttribute("aria-expanded", open ? "true" : "false");
      wrap.classList.toggle("open", open);
      if (open) { drop.classList.remove("closing"); drop.hidden = false; paint(); }
      else if (!drop.hidden) {
        if (calm()) { drop.hidden = true; return; }
        drop.classList.add("closing");
        closeT = setTimeout(function () { drop.hidden = true; drop.classList.remove("closing"); }, 180);
      }
    }
    pill.addEventListener("click", function () { toggleDrop(); });
    $(".np-play").addEventListener("click", function () { M.toggle(); setTimeout(paint, 60); });
    $(".np-prev").addEventListener("click", function () { M.prev(); setTimeout(paint, 120); });
    $(".np-next").addEventListener("click", function () { M.next(); setTimeout(paint, 120); });
    seek.addEventListener("input", function () {
      seeking = true; var st = M.state();
      $(".np-t0").textContent = fmt(seek.value / 1000 * st.dur); seek.style.setProperty("--p", (seek.value / 10) + "%");
    });
    seek.addEventListener("change", function () { var st = M.state(); M.seek(seek.value / 1000 * st.dur); seeking = false; });
    if (vol) vol.addEventListener("input", function () { M.setVolume(vol.value / 100); vol.style.setProperty("--p", vol.value + "%"); });
    document.addEventListener("pointerdown", function (e) { if (!drop.hidden && !wrap.contains(e.target)) toggleDrop(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !drop.hidden) { toggleDrop(false); pill.focus(); } });
    paint();
    setInterval(paint, 500);
  })();

  /* ---------- 5. Live backdrop ----------
     A blue grid that drifts with the page (slower than the content, so it
     has depth), soft light that slowly wanders behind it, lines that light
     up around the pointer, a few twinkling crossings, and a ring of light
     that runs across the grid when you click. Never on the play page. */
  if (isPlay) return;
  var cv = document.createElement("canvas");
  cv.className = "fx-bg"; cv.setAttribute("aria-hidden", "true");
  body.insertBefore(cv, body.firstChild);
  var ctx = cv.getContext("2d");
  if (!ctx) return;
  var CELL = 56, PARALLAX = .45;
  var W = 0, H = 0, dpr = 1, gx = mouse.x, gy = mouse.y, t0 = performance.now(), running = false, lastDraw = 0;
  var stars = [], rings = [];
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var blobs = [
    { c: "36,102,255", a: .032, r: .55, sx: .00011, sy: .00007, px: .5, py: .05, ax: .28, ay: .08 },
    { c: "90,70,255",  a: .02, r: .45, sx: .00008, sy: .00012, px: .2, py: .25, ax: .18, ay: .12 },
    { c: "56,214,255", a: .012, r: .40, sx: .00013, sy: .00009, px: .82, py: .3, ax: .14, ay: .14 }
  ];
  // iPads / phones: no mouse, weaker GPU. The glow is soft, so drawing it at lower resolution and
  // frame rate looks the same and costs a fraction.
  var TOUCH = !(window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches);
  var FRAME_MS = TOUCH ? 50 : 31;
  // Each soft light is drawn once into a small image and reused (no per-frame gradients, no
  // "lighter" blending, which iPad Safari renders as a hard-edged block).
  function sprite(rgb) {
    var c = document.createElement("canvas"); c.width = c.height = 128;
    var g = c.getContext("2d"), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(" + rgb + ",1)"); gr.addColorStop(.45, "rgba(" + rgb + ",.45)"); gr.addColorStop(1, "rgba(" + rgb + ",0)");
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return c;
  }
  blobs.forEach(function (B) { B.img = sprite(B.c); });
  var pointerImg = sprite("47,110,255"), starImg = sprite("170,215,255");
  // all the soft light is painted into a quarter-size layer, then stretched over the screen once
  var glow = document.createElement("canvas"), gctx = glow.getContext("2d"), GS = 4;
  function newStar() { return { c: (Math.random() * 40) | 0, r: (Math.random() * 16) | 0, t: 0, d: rnd(90, 200), wait: (Math.random() * 240) | 0 }; }
  function size() {
    dpr = TOUCH ? .75 : Math.min(window.devicePixelRatio || 1, 1.5);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    glow.width = Math.max(1, Math.ceil(W / GS)); glow.height = Math.max(1, Math.ceil(H / GS));
    var ns = W < 700 ? 6 : 14;
    while (stars.length < ns) stars.push(newStar()); stars.length = ns;
  }
  function gridPath(ox, oy) {
    ctx.beginPath();
    for (var x = ox; x <= W; x += CELL) { ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); }
    for (var y = oy; y <= H; y += CELL) { ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); }
  }
  // grid brightness by depth down the page: strongest behind the top, never fully gone
  var lineAlpha = function (docY) { return .035 + .085 * Math.max(0, 1 - docY / 1100); };

  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (now - lastDraw < FRAME_MS) return;    // ~30fps (20 on touch screens) is plenty for a backdrop
    if (body.classList.contains("games-overlay")) return;   // Music page hidden behind another page
    lastDraw = now;
    var t = gentle() ? 0 : now - t0;                       // reduce-motion devices: light holds still
    var sy = (window.scrollY || 0) * (gentle() ? 0 : PARALLAX);
    var ox = ((W / 2) % CELL + CELL) % CELL, oy = ((-sy) % CELL + CELL) % CELL;
    var fadeTop = Math.max(0, 1 - (window.scrollY || 0) / 1400);
    ctx.clearRect(0, 0, W, H);

    // drifting light (painted small, stretched once)
    gctx.clearRect(0, 0, glow.width, glow.height);
    for (var b = 0; b < blobs.length; b++) {
      var B = blobs[b];
      var bx = W * (B.px + Math.sin(t * B.sx + b) * B.ax), by = H * (B.py + Math.cos(t * B.sy + b * 2) * B.ay) - (window.scrollY || 0) * .15;
      var br = Math.max(W, 700) * B.r;
      gctx.globalAlpha = B.a * 1.6 * (.45 + .55 * fadeTop);
      gctx.drawImage(B.img, (bx - br) / GS, (by - br) / GS, br * 2 / GS, br * 2 / GS);
    }
    // soft light that trails the pointer (mouse only)
    if (!TOUCH) {
      gx += (mouse.x - gx) * .08; gy += (mouse.y - gy) * .08;
      gctx.globalAlpha = mouse.on ? .07 : .03;
      gctx.drawImage(pointerImg, (gx - 360) / GS, (gy - 360) / GS, 720 / GS, 720 / GS);
    }
    gctx.globalAlpha = 1;
    ctx.drawImage(glow, 0, 0, W, H);

    // the grid
    ctx.lineWidth = 1;
    var lg = ctx.createLinearGradient(0, 0, 0, H);
    lg.addColorStop(0, "rgba(70,125,255," + lineAlpha(sy).toFixed(3) + ")");
    lg.addColorStop(1, "rgba(70,125,255," + lineAlpha(sy + H).toFixed(3) + ")");
    gridPath(ox, oy); ctx.strokeStyle = lg; ctx.stroke();

    // lines light up around the pointer
    if (mouse.on && !TOUCH) {
      var pg = ctx.createRadialGradient(gx, gy, 0, gx, gy, 240);
      pg.addColorStop(0, "rgba(140,190,255,.4)"); pg.addColorStop(1, "rgba(140,190,255,0)");
      ctx.strokeStyle = pg; ctx.stroke();
    }

    // rings of light from clicks
    for (var i = rings.length - 1; i >= 0; i--) {
      var R = rings[i]; R.r += 9 + R.r * .02; R.a *= .965;
      if (R.a < .02 || R.r > Math.max(W, H) * 1.2) { rings.splice(i, 1); continue; }
      var inner = Math.max(0, R.r - 70);
      var rg = ctx.createRadialGradient(R.x, R.y, inner, R.x, R.y, R.r);
      rg.addColorStop(0, "rgba(120,190,255,0)");
      rg.addColorStop(.75, "rgba(140,205,255," + R.a.toFixed(3) + ")");
      rg.addColorStop(1, "rgba(140,205,255,0)");
      ctx.strokeStyle = rg; ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineWidth = 1;
    }

    // twinkling crossings near the top of the page
    for (var s = 0; s < stars.length; s++) {
      var st = stars[s];
      if (st.wait > 0) { st.wait--; continue; }
      if (++st.t > st.d) { stars[s] = newStar(); continue; }
      var sxp = ox + st.c * CELL + .5, syp = oy + st.r * CELL + .5;   // locked to a crossing on screen
      if (sxp > W || syp > H) continue;
      var env = Math.sin(Math.PI * st.t / st.d);
      var depth = Math.max(.2, 1 - (syp + sy) / 900);
      var al = env * depth;
      if (al < .02) continue;
      ctx.globalAlpha = .55 * al; ctx.drawImage(starImg, sxp - 16, syp - 16, 32, 32); ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(225,240,255," + (.9 * al).toFixed(3) + ")";
      ctx.fillRect(sxp - 1, syp - 1, 2, 2);
    }
  }
  function sync() {
    var want = !document.hidden && !calm();
    if (want && !running) { running = true; lastDraw = 0; requestAnimationFrame(frame); }
    else if (!want && running) { running = false; ctx.clearRect(0, 0, W, H); }
    root.classList.toggle("fx-live", !calm());
  }
  size(); sync();
  addEventListener("resize", size);
  document.addEventListener("visibilitychange", sync);
  if (mq.addEventListener) mq.addEventListener("change", sync);
  document.addEventListener("pointerdown", function (e) {
    if (!running) return;
    var tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    rings.push({ x: e.clientX, y: e.clientY, r: 4, a: .7 });
    if (rings.length > 4) rings.shift();
  }, { passive: true });
  new MutationObserver(function () {
    var was = root.classList.contains("fx-live"), now = !calm();
    if (was !== now || (now && !running && !document.hidden)) sync();
  }).observe(root, { attributes: true, attributeFilter: ["class"] });
})();
