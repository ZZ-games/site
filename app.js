// ZZ Games — site logic. You normally only edit games.js.

const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
GAMES.forEach((g) => {
  g.id = slug(g.title);
  if (!g.url && g.repo) g.url = `https://${(g.user || SITE.githubUser).toLowerCase()}.github.io/${g.repo}/`;
});

// Colorful generated cover when a game has no image
function coverStyle(g) {
  if (g.image) return `background-image:url('${g.image}')${g.imagePos ? `;background-position:${g.imagePos}` : ""}`;
  let h = 0;
  for (const c of g.title) h = (h * 31 + c.charCodeAt(0)) % 360;
  const hue = 190 + (h % 90); // blues → purples to match the logo
  return `background-image:linear-gradient(135deg,hsl(${hue} 85% 50%),hsl(${hue + 25} 90% 22%))`;
}
const initials = (t) => t.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// Favorites (stored in this browser)
const FAV_KEY = "zz-favs";
function getFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; }
}
const isFav = (id) => getFavs().includes(id);
function toggleFav(id) {
  const favs = getFavs();
  const next = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
  try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch {}
  document.querySelectorAll(`.fav[data-id="${id}"]`).forEach((b) => paintFav(b, next.includes(id)));
  document.dispatchEvent(new CustomEvent("zz-favs"));
}
function paintFav(b, on) {
  b.classList.toggle("on", on);
  b.setAttribute("aria-pressed", on);
  b.title = on ? "Remove from favorites" : "Add to favorites";
  if (b.classList.contains("fav-btn")) b.innerHTML = (on ? "♥" : "♡") + `<span class="lbl"> ${on ? "Favorited" : "Favorite"}</span>`;
  else b.textContent = on ? "♥" : "♡";
}
function favButton(g, big) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = big ? "btn ghost fav fav-btn" : "fav";
  b.dataset.id = g.id;
  b.setAttribute("aria-label", "Favorite " + g.title);
  paintFav(b, isFav(g.id));
  b.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    toggleFav(g.id);
    b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
  });
  return b;
}

const badgeFor = (g) => g.new ? `<span class="badge new">NEW</span>` : g.hot ? `<span class="badge hot">HOT</span>` : "";

function card(g, opts = {}) {
  const a = document.createElement("a");
  a.className = "card" + (opts.big ? " big" : "");
  a.href = `play.html?game=${g.id}`;
  a.innerHTML = `
    <div class="cover" style="${coverStyle(g)}">
      ${g.image ? "" : `<span class="initials">${initials(g.title)}</span>`}
      ${g.url ? badgeFor(g) : `<span class="soon">NO LINK YET</span>`}
      <span class="play-ov" aria-hidden="true"><span>▶</span></span>
    </div>
    <div class="meta"><div class="name"></div></div>`;
  a.querySelector(".name").textContent = g.title;
  a.querySelector(".cover").appendChild(favButton(g));
  return a;
}

// Rough search: ignores spaces/punctuation, matches initials ("gd") and tags ("mc")
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
function matches(g, q) {
  if (!q) return true;
  const n = norm(q);
  if (!n) return true;
  if (norm(g.title).includes(n)) return true;
  if (initials(g.title).toLowerCase() === n || g.title.split(/\s+/).map((w) => w[0]).join("").toLowerCase().startsWith(n) && n.length > 1) return true;
  if (g.tags && g.tags.toLowerCase().split(/\s+/).some((t) => norm(t).startsWith(n))) return true;
  if (norm(g.category) === n) return true;
  return false;
}
function randomGame(exceptId) {
  const pool = GAMES.filter((g) => g.url && g.id !== exceptId);
  return pool[Math.floor(Math.random() * pool.length)];
}

// Recently played (stored in this browser)
const RECENT_KEY = "zz-recent";
function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { return []; }
}
function addRecent(id) {
  try {
    const list = [id, ...getRecent().filter((x) => x !== id)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {}
}

/* ---------------- Settings (saved in this browser) ---------------- */
const SETTINGS_KEY = "zz-settings";
const DEFAULTS = { volume: 80, muted: false, fullMode: "window", autoFull: false, showRecent: true, reduceMotion: false, desktopMode: "auto" };
function getSettings() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY)) }; } catch { return { ...DEFAULTS }; }
}
let S = getSettings();
function saveSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(S)); } catch {}
  applySettings();
}
const settingsListeners = [];
function applySettings() {
  document.documentElement.classList.toggle("reduce-motion", S.reduceMotion);
  settingsListeners.forEach((fn) => fn(S));
}

function buildSettings() {
  const btn = document.createElement("button");
  btn.className = "icon-btn";
  btn.title = "Settings";
  btn.setAttribute("aria-label", "Settings");
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;
  document.querySelector(".topbar").appendChild(btn);

  const panel = document.createElement("div");
  panel.className = "settings-backdrop";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="settings" role="dialog" aria-label="Settings">
      <div class="settings-head"><h3>Settings</h3><button class="x" aria-label="Close">✕</button></div>
      <label class="row"><span>Volume <b id="volVal"></b></span>
        <input id="setVol" type="range" min="0" max="100" step="1"></label>
      <label class="row toggle"><span>Mute all games</span><input id="setMute" type="checkbox"></label>
      <div class="row"><span>Fullscreen button</span>
        <div class="seg" id="setFull">
          <button data-v="window">Browser window</button><button data-v="screen">Whole screen</button>
        </div></div>
      <div class="row"><span>Desktop mode <small>(use a keyboard on iPad)</small></span>
        <div class="seg" id="setDesk">
          <button data-v="auto">Auto</button><button data-v="on">On</button><button data-v="off">Off</button>
        </div></div>
      <label class="row toggle"><span>Start games in fullscreen</span><input id="setAuto" type="checkbox"></label>
      <label class="row toggle"><span>Show “Jump back in”</span><input id="setRecent" type="checkbox"></label>
      <label class="row toggle"><span>Reduce animations</span><input id="setMotion" type="checkbox"></label>
      <div class="row"><span>Recently played</span><button id="clearRecent" class="btn ghost small">Clear</button></div>
      <p class="note" id="deskNote" hidden>Desktop mode changed — press ↻ Restart to apply it to this game.</p>
      <p class="note">Desktop mode makes games use keyboard controls instead of touch controls. Auto turns it on for iPads and tablets (Minecraft keeps its touch buttons unless Desktop mode is set to On). Settings save in this browser. Volume works on games hosted on ZZ Games; a few outside games (like Tung Tung Kart) use their own volume.</p>
    </div>`;
  document.body.appendChild(panel);
  const $ = (s) => panel.querySelector(s);
  const sync = () => {
    $("#setVol").value = S.volume; $("#volVal").textContent = S.muted ? "Muted" : S.volume + "%";
    $("#setMute").checked = S.muted; $("#setAuto").checked = S.autoFull;
    $("#setRecent").checked = S.showRecent; $("#setMotion").checked = S.reduceMotion;
    panel.querySelectorAll("#setFull button").forEach((b) => b.classList.toggle("on", b.dataset.v === S.fullMode));
    panel.querySelectorAll("#setDesk button").forEach((b) => b.classList.toggle("on", b.dataset.v === S.desktopMode));
  };
  const open = () => { sync(); panel.hidden = false; };
  const close = () => { panel.hidden = true; };
  btn.onclick = open;
  $(".x").onclick = close;
  panel.addEventListener("click", (e) => { if (e.target === panel) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) close(); });
  $("#setVol").oninput = (e) => { S.volume = +e.target.value; if (S.muted && S.volume > 0) S.muted = false; sync(); saveSettings(); };
  $("#setMute").onchange = (e) => { S.muted = e.target.checked; sync(); saveSettings(); };
  $("#setAuto").onchange = (e) => { S.autoFull = e.target.checked; saveSettings(); };
  $("#setRecent").onchange = (e) => { S.showRecent = e.target.checked; saveSettings(); };
  $("#setMotion").onchange = (e) => { S.reduceMotion = e.target.checked; saveSettings(); };
  panel.querySelectorAll("#setFull button").forEach((b) => b.onclick = () => { S.fullMode = b.dataset.v; sync(); saveSettings(); });
  panel.querySelectorAll("#setDesk button").forEach((b) => b.onclick = () => {
    S.desktopMode = b.dataset.v; sync(); saveSettings();
    $("#deskNote").hidden = !document.body.classList.contains("play-page");
  });
  $("#clearRecent").onclick = (e) => {
    try { localStorage.removeItem(RECENT_KEY); } catch {}
    e.target.textContent = "Cleared"; const w = document.getElementById("recentWrap"); if (w) w.hidden = true;
  };
}

/* Game volume: works for games served from this site (same origin) */
function hookGameAudio(frame) {
  const level = () => (S.muted ? 0 : S.volume / 100);
  let win = null;
  function patch(w) {
    if (!w || w.__zzAudio) return;
    let doc;
    try { doc = w.document; } catch { return; } // other site: can't control
    w.__zzAudio = true;
    const gains = [];
    const AN = w.AudioNode && w.AudioNode.prototype;
    if (AN) {
      const orig = AN.connect;
      AN.connect = function (dest, ...rest) {
        if (dest && w.AudioDestinationNode && dest instanceof w.AudioDestinationNode && !this.__zzMaster) {
          const ctx = dest.context;
          if (!ctx.__zzGain) {
            const g = ctx.createGain(); g.__zzMaster = true;
            orig.call(g, dest); g.gain.value = level();
            ctx.__zzGain = g; gains.push(g);
          }
          return orig.call(this, ctx.__zzGain, ...rest);
        }
        return orig.call(this, dest, ...rest);
      };
    }
    const media = () => { try { doc.querySelectorAll("audio,video").forEach((m) => { m.volume = level(); m.muted = S.muted; }); } catch {} };
    w.__zzApply = () => { gains.forEach((g) => { try { g.gain.value = level(); } catch {} }); media(); };
    w.setInterval(media, 1500);
    // Esc inside the game exits browser-window fullscreen, unless the game uses Esc itself
    // (e.g. Minecraft's pause menu) or has the mouse locked.
    w.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      let locked = false; try { locked = !!w.document.pointerLockElement; } catch {}
      setTimeout(() => {
        if (!e.defaultPrevented && !locked) document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      }, 0);
    });
  }
  // Catch the game's window as early as possible, before it starts making sound
  const watch = () => {
    const t0 = Date.now();
    const id = setInterval(() => {
      let w; try { w = frame.contentWindow; } catch {}
      if (w && w !== win) {
        try { if (w.location.href !== "about:blank") { win = w; patch(w); } } catch { clearInterval(id); }
      }
      if (Date.now() - t0 > 15000) clearInterval(id);
    }, 5);
  };
  frame.addEventListener("load", () => { try { patch(frame.contentWindow); frame.contentWindow.__zzApply && frame.contentWindow.__zzApply(); } catch {} });
  settingsListeners.push(() => { try { frame.contentWindow.__zzApply && frame.contentWindow.__zzApply(); } catch {} });
  return watch;
}

/* ---------------- Home page ---------------- */
function initHome() {
  const search = document.getElementById("search");

  // Spotlight: rotating featured games + "top picks" beside it
  const feat = [{ brand: true, title: SITE.name }, ...GAMES.filter((g) => g.featured && g.url)];
  let picks = GAMES.filter((g) => g.pick && g.url);
  if (!picks.length) picks = GAMES.filter((g) => g.hot && g.url && !g.featured);
  picks = picks.slice(0, 3);
  const spot = document.getElementById("spotlight");
  spot.innerHTML = `
    <div class="spot-main">
      <div class="spot-slides"></div>
      <div class="spot-dots" role="tablist"></div>
    </div>
    <div class="spot-side"><div class="spot-side-title">Top picks</div></div>`;
  const slides = spot.querySelector(".spot-slides"), dots = spot.querySelector(".spot-dots");
  feat.forEach((g, i) => {
    if (g.brand) {
      const s = document.createElement("div");
      s.className = "slide brand-slide" + (i === 0 ? " on" : "");
      s.innerHTML = `<img class="brand" src="images/logo.png" alt="${SITE.name}"><p class="brand-sub">Free browser games. No downloads.</p>`;
      slides.appendChild(s);
      const d = document.createElement("button");
      d.type = "button"; d.setAttribute("aria-label", "Show " + SITE.name);
      if (i === 0) d.classList.add("on");
      d.onclick = () => { show(i); restart(); };
      dots.appendChild(d);
      return;
    }
    const s = document.createElement("a");
    s.className = "slide" + (i === 0 ? " on" : "");
    s.href = `play.html?game=${g.id}`;
    s.innerHTML = `
      <div class="slide-bg" style="${coverStyle(g)}"></div>
      <div class="slide-art" style="${coverStyle(g)}"></div>
      <div class="slide-info">
        <div class="slide-tag">${g.new ? "NEW · " : ""}FEATURED · ${g.category.toUpperCase()}</div>
        <div class="slide-title"></div>
        <span class="btn big-btn">▶ Play now</span>
      </div>`;
    s.querySelector(".slide-title").textContent = g.title;
    slides.appendChild(s);
    const d = document.createElement("button");
    d.type = "button"; d.setAttribute("aria-label", "Show " + g.title);
    if (i === 0) d.classList.add("on");
    d.onclick = () => { show(i); restart(); };
    dots.appendChild(d);
  });
  let cur = 0, timer = null;
  function show(i) {
    cur = (i + feat.length) % feat.length;
    slides.querySelectorAll(".slide").forEach((el, j) => el.classList.toggle("on", j === cur));
    dots.querySelectorAll("button").forEach((el, j) => el.classList.toggle("on", j === cur));
  }
  function restart() {
    clearInterval(timer);
    if (feat.length > 1 && !S.reduceMotion) timer = setInterval(() => show(cur + 1), 6000);
  }
  spot.querySelector(".spot-main").addEventListener("mouseenter", () => clearInterval(timer));
  spot.querySelector(".spot-main").addEventListener("mouseleave", restart);
  restart();
  const side = spot.querySelector(".spot-side");
  picks.forEach((g) => {
    const a = document.createElement("a");
    a.className = "pick"; a.href = `play.html?game=${g.id}`;
    a.innerHTML = `<div class="pick-art" style="${coverStyle(g)}"></div><div class="pick-meta"><div class="pick-name"></div></div><span class="pick-play">▶</span>`;
    a.querySelector(".pick-name").textContent = g.title;
    side.appendChild(a);
  });

  // Categories (with counts)
  const cats = ["All", ...new Set(GAMES.map((g) => g.category))];
  const catBox = document.getElementById("cats");
  let current = "All";
  cats.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    const n = c === "All" ? GAMES.length : GAMES.filter((g) => g.category === c).length;
    b.textContent = c;
    if (c === "All") b.classList.add("on");
    b.onclick = () => {
      current = c;
      catBox.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      render();
      if (c !== "All") document.getElementById("gridTitle").scrollIntoView({ behavior: S.reduceMotion ? "auto" : "smooth", block: "start" });
    };
    catBox.appendChild(b);
  });

  // Rows
  const fill = (wrapId, boxId, list) => {
    document.getElementById(wrapId).hidden = !list.length;
    document.getElementById(boxId).replaceChildren(...list.map((g) => card(g)));
  };
  const byIds = (ids) => ids.map((id) => GAMES.find((g) => g.id === id)).filter(Boolean);
  function renderFavs() { fill("favWrap", "favs", byIds(getFavs())); }
  document.addEventListener("zz-favs", renderFavs);
  renderFavs();
  if (S.showRecent) fill("recentWrap", "recent", byIds(getRecent()));
  fill("hotWrap", "hot", GAMES.filter((g) => g.hot && g.url));
  fill("newWrap", "new", GAMES.filter((g) => g.new && g.url));
  const rows = document.getElementById("rows");
  cats.filter((c) => c !== "All").forEach((c) => {
    const list = GAMES.filter((g) => g.category === c && g.url);
    if (list.length < 5) return;
    const sec = document.createElement("section");
    sec.className = "row-wrap";
    sec.innerHTML = `<div class="row-head"><h2>${c}</h2><button type="button" class="see-all">See all</button></div><div class="rail"></div>`;
    sec.querySelector(".rail").replaceChildren(...list.map((g) => card(g)));
    sec.querySelector(".see-all").onclick = () => [...catBox.querySelectorAll("button")].find((b) => b.textContent === c).click();
    rows.appendChild(sec);
  });
  // Arrow buttons for rails on desktop
  document.querySelectorAll(".row-wrap").forEach((w) => {
    const rail = w.querySelector(".rail"), head = w.querySelector(".row-head");
    const nav = document.createElement("div"); nav.className = "rail-nav";
    nav.innerHTML = `<button type="button" aria-label="Scroll left">‹</button><button type="button" aria-label="Scroll right">›</button>`;
    const [l, r] = nav.querySelectorAll("button");
    l.onclick = () => rail.scrollBy({ left: -rail.clientWidth * 0.8, behavior: "smooth" });
    r.onclick = () => rail.scrollBy({ left: rail.clientWidth * 0.8, behavior: "smooth" });
    head.appendChild(nav);
  });

  // Grid + search
  const grid = document.getElementById("grid");
  function render() {
    const q = search.value.trim();
    const browsing = !q && current === "All";
    document.getElementById("spotlight").hidden = !!q;
    document.getElementById("rows").hidden = !browsing;
    const list = GAMES.filter((g) => (current === "All" || g.category === current) && matches(g, q))
      .sort((a, b) => (!!b.url - !!a.url) || (!!b.image - !!a.image)); // playable games first
    grid.classList.toggle("mosaic", browsing);
    grid.replaceChildren(...list.map((g) => card(g, { big: browsing && g.hot && g.url })));
    document.getElementById("empty").hidden = list.length > 0;
    document.getElementById("emptyRequest").href = `request.html${q ? "?game=" + encodeURIComponent(q) : ""}`;
    document.getElementById("gridTitle").textContent =
      q ? `Results for “${q}”` : current === "All" ? "All games" : `${current} games`;
    document.getElementById("gridCount").textContent = q && list.length ? `${list.length} found` : "";
  }
  const q0 = new URLSearchParams(location.search).get("q");
  if (q0) search.value = q0.slice(0, 60);
  search.addEventListener("input", () => {
    if (search.value.trim().toLowerCase() === "ss") { location.href = "gamble.html"; return; }
    render();
  });
  search.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { search.value = ""; render(); search.blur(); }
    if (e.key === "Enter") { const first = grid.querySelector(".card"); if (first && search.value.trim()) location.href = first.href; }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== search && !e.metaKey && !e.ctrlKey) { e.preventDefault(); search.focus(); }
  });

  render();
}

/* ---------------- Play page ---------------- */
function initPlay() {
  // Touch screens: stop Safari pinch / double-tap zoom on the play page (games handle their own touches)
  document.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("dblclick", (e) => e.preventDefault(), { passive: false });
  const params = new URLSearchParams(location.search);
  const id = params.get("game");
  let g = GAMES.find((x) => x.id === id);
  const gamble = params.get("gamble");
  if (!g && gamble && /^gamble\/[a-z0-9-]+\/$/.test(gamble)) {
    g = { id: "", title: params.get("title") || "ZZ-Gamble", url: gamble, gamble: true };
  }
  if (!g) { location.href = "index.html"; return; }

  // Games with more than one version (e.g. Normal / Hacked)
  let pickVersion = null;
  if (g.versions && g.versions.length) {
    g = { ...g };
    const key = "zz-version-" + g.id;
    let saved = null; try { saved = localStorage.getItem(key); } catch {}
    const want = params.get("version") || saved;
    let cur = g.versions.find((v) => v.label.toLowerCase() === String(want).toLowerCase()) || g.versions[0];
    g.url = cur.url;
    pickVersion = (wrap, onChange) => {
      wrap.innerHTML = `<span class="vlabel">Version</span><div class="seg"></div><span class="vnote"></span>`;
      const seg = wrap.querySelector(".seg"), note = wrap.querySelector(".vnote");
      const paint = () => {
        seg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.textContent === cur.label));
        note.textContent = cur.note || "";
      };
      g.versions.forEach((v) => {
        const b = document.createElement("button"); b.textContent = v.label;
        b.onclick = () => {
          if (v === cur) return;
          cur = v; g.url = v.url; paint();
          try { localStorage.setItem(key, v.label); } catch {}
          onChange();
        };
        seg.appendChild(b);
      });
      wrap.hidden = false; paint();
    };
  }

  document.title = "ZZ Classroom"; // tab disguise (change on every page's <head> too)
  if (!g.gamble) {
    const md = document.querySelector('meta[name="description"]');
    if (md) md.content = `Play ${g.title} unblocked for free on ZZ Games. No download – it runs right in your browser.`;
  }
  document.getElementById("gameTitle").textContent = g.title;
  if (!g.gamble) {
    addRecent(g.id);
    document.querySelector(".play-page .actions").prepend(favButton(g, true));
  }

  const frame = document.getElementById("frame");
  const loader = document.getElementById("loader");
  const startWatch = hookGameAudio(frame);
  if (g.url) {
    frame.src = g.url; startWatch();
    frame.addEventListener("load", () => loader.classList.add("done"));
  } else {
    loader.querySelector("p").textContent = "This game doesn't have a link yet — add it in games.js.";
    loader.querySelector(".spinner").remove();
  }

  document.getElementById("reload").onclick = () => {
    if (!g.url) return;
    loader.classList.remove("done");
    frame.src = g.url; startWatch();
  };
  if (pickVersion) pickVersion(document.getElementById("versions"), () => document.getElementById("reload").onclick());

  // Fullscreen: "window" fills the browser tab, "screen" takes over the whole monitor
  const stage = document.getElementById("stage");
  const fullBtn = document.getElementById("full");
  const exitBtn = document.createElement("button");
  exitBtn.className = "exit-full"; exitBtn.textContent = "✕ Exit fullscreen";
  stage.appendChild(exitBtn);
  const setWindowFull = (on) => {
    document.body.classList.toggle("window-full", on);
    fullBtn.textContent = on ? "⛶ Exit" : "⛶ Fullscreen";
    if (on) frame.focus();
  };
  const goFull = () => {
    if (S.fullMode === "screen") {
      const req = stage.requestFullscreen || stage.webkitRequestFullscreen;
      if (req) return req.call(stage);
    }
    setWindowFull(true);
  };
  fullBtn.onclick = () => document.body.classList.contains("window-full") ? setWindowFull(false) : goFull();
  exitBtn.onclick = () => setWindowFull(false);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("window-full")) setWindowFull(false);
  });
  if (S.autoFull && g.url) setWindowFull(true);

  // Keyboard: if the iPad/browser leaves focus on the page instead of the game,
  // pass the keys into the game ourselves.
  const settingsOpen = () => { const b = document.querySelector(".settings-backdrop"); return b && !b.hidden; };
  const focusFrame = () => { try { frame.focus(); frame.contentWindow.focus(); } catch {} };
  stage.addEventListener("pointerdown", focusFrame);
  frame.addEventListener("load", () => setTimeout(focusFrame, 50));
  const forward = (e) => {
    if (!g.url || settingsOpen() || e.metaKey || e.key === "Escape") return;
    if (document.activeElement === frame) return; // game already has the keyboard
    const t = e.target; if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    let w, d;
    try { w = frame.contentWindow; d = w.document; } catch { focusFrame(); return; } // outside site: just focus
    const target = (d.activeElement && d.activeElement !== d.body) ? d.activeElement : (d.querySelector("canvas") || d.body || d);
    const ev = new w.KeyboardEvent(e.type, {
      key: e.key, code: e.code, location: e.location, repeat: e.repeat,
      shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, altKey: e.altKey, bubbles: true, cancelable: true,
    });
    for (const k of ["keyCode", "which", "charCode"]) {
      try { Object.defineProperty(ev, k, { get: () => e[k] }); } catch {}
    }
    target.dispatchEvent(ev);
    e.preventDefault();
    if (e.type === "keydown") focusFrame();
  };
  document.addEventListener("keydown", forward);
  document.addEventListener("keyup", forward);

  const report = document.getElementById("report");
  if (report && !g.gamble) report.href = `request.html?type=broken&game=${encodeURIComponent(g.title)}`;
  else if (report) report.remove();

  // Info bar under the game
  const src = GAMES.find((x) => x.id === g.id) || g;
  document.getElementById("gameName").textContent = g.title;
  document.getElementById("gameCat").textContent = g.gamble ? "ZZ-Gamble" : src.category || "";
  document.getElementById("gameArt").setAttribute("style", src.image || src.title ? coverStyle(src) : "");
  const share = document.getElementById("share");
  if (g.gamble) share.remove();
  else share.onclick = () => {
    const url = location.href.split("&version")[0];
    const done = () => { share.textContent = "Copied!"; setTimeout(() => (share.textContent = "Copy link"), 1600); };
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(done, () => { prompt("Copy this link:", url); });
  };

  // More games: same category first, hot games get a nudge
  const more = GAMES.filter((x) => x.id !== g.id && x.url)
    .map((x) => ({ x, s: (x.category === src.category ? 2 : 0) + (x.hot ? 1 : 0) + Math.random() * 1.5 }))
    .sort((a, b) => b.s - a.s).map((o) => o.x)
    .slice(0, 16);
  document.getElementById("more").replaceChildren(...more.map((x) => card(x)));
}

buildSettings();
applySettings();
if (document.body.classList.contains("play-page")) initPlay(); else initHome();

// Offline support: remember the site, and save Cookie Clicker for offline play.
if ("serviceWorker" in navigator && location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  try {
    navigator.serviceWorker.register("sw.js").then(() => navigator.serviceWorker.ready).then((reg) => {
      const q = new URLSearchParams(location.search).get("game");
      if (q !== "cookie-clicker" || !reg.active) return;
      const base = new URL("games/cookieclicker/", location.href).href;
      fetch(base + "offline-manifest.json").then((r) => r.json()).then((files) => reg.active.postMessage({ type: "precache", base, files })).catch(() => {});
    }).catch(() => {});
  } catch (e) {}
}
