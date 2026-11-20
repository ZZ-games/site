/* ZZ Games — site logic. You normally only edit games.js. */

const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
GAMES.forEach((g) => {
  g.id = slug(g.title);
  if (g.url && g.url.startsWith("games/")) {
    // The original site repository hosts the complete game library under /site/games/.
    g.url = `https://zz-games.github.io/site/${g.url}`;
  } else if (!g.url && g.repo) {
    // Only use a standalone repository URL when the source list has no hosted folder path.
    g.url = `https://${(g.user || SITE.githubUser).toLowerCase()}.github.io/${g.repo}/`;
  }
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
const RECENT_AT_KEY = "zz-recent-at";
function getRecentAt() {
  try { return JSON.parse(localStorage.getItem(RECENT_AT_KEY)) || {}; } catch { return {}; }
}
function addRecent(id) {
  try {
    const list = [id, ...getRecent().filter((x) => x !== id)].slice(0, 12);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    const at = getRecentAt(); at[id] = Date.now();
    for (const k of Object.keys(at)) if (!list.includes(k)) delete at[k];
    localStorage.setItem(RECENT_AT_KEY, JSON.stringify(at));
  } catch {}
}

/* ---------- Music across the site ----------
   While a song is loaded, pages open inside the Music page (music.html), which keeps playing.
   playSong() hands a song to that player, opening it around this page if it isn't already. */
function musicShell() {
  try { return (window.parent !== window && window.parent.ZZMusic) || null; } catch { return null; }
}
function playSong(track, list) {
  const m = musicShell();
  if (m) { m.play(track, list); return; }
  try { sessionStorage.setItem("zz-play-now", JSON.stringify(track)); } catch {}
  const here = (location.pathname.split("/").pop() || "index.html") + location.search;
  location.href = "music.html?view=" + encodeURIComponent(here);
}
const escHTML = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

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
      <label class="row toggle"><span>Show “Continue” on the home page</span><input id="setRecent" type="checkbox"></label>
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
  let closeT = 0;
  const open = () => { clearTimeout(closeT); panel.classList.remove("closing"); sync(); panel.hidden = false; };
  const close = () => {
    if (panel.hidden || panel.classList.contains("closing")) return;
    const calm = document.documentElement.classList.contains("reduce-motion");
    if (calm) { panel.hidden = true; return; }
    panel.classList.add("closing");
    closeT = setTimeout(() => { panel.hidden = true; panel.classList.remove("closing"); }, 220);
  };
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
    try { localStorage.removeItem(RECENT_KEY); localStorage.removeItem(RECENT_AT_KEY); } catch {}
    e.target.textContent = "Cleared";
    if (document.getElementById("continueWrap")) buildContinue();
  };
}

/* ---------- Game sound: volume + mute ----------
   Works for games served from zz-games.github.io (same origin as this page). It catches:
   - Web Audio: every connection to the speakers is routed through one volume knob
     (contexts made before we could hook in are paused while muted instead)
   - <audio>/<video> and new Audio() objects, even ones never added to the page
   - games that run inside their own inner frames
   Games on other sites (e.g. Tung Tung Kart) keep their own sound controls. */
const gameAudio = { reachable: null, windows: [] };
function hookGameAudio(frame) {
  const level = () => (S.muted ? 0 : S.volume / 100);
  function patch(w) {
    if (!w || w.__zzAudio) return;
    try { void w.document; } catch { return; }   // another site: can't reach it
    w.__zzAudio = { ctxs: new Set(), media: new Set() };
    const st = w.__zzAudio;
    gameAudio.windows.push(w);

    // Web Audio
    const AN = w.AudioNode && w.AudioNode.prototype;
    const BAC = (w.BaseAudioContext || w.AudioContext || w.webkitAudioContext || {}).prototype;
    if (AN && !AN.__zzConnect) {
      const connect = AN.connect;
      AN.__zzConnect = connect;
      AN.connect = function (dest, ...rest) {
        if (dest && w.AudioDestinationNode && dest instanceof w.AudioDestinationNode && !this.__zzMaster) {
          const ctx = dest.context;
          if (!ctx.__zzGain) {
            const g = ctx.createGain(); g.__zzMaster = true;
            connect.call(g, dest); g.gain.value = level();
            ctx.__zzGain = g; st.ctxs.add(ctx);
          }
          return connect.call(this, ctx.__zzGain, ...rest);
        }
        return connect.call(this, dest, ...rest);
      };
    }
    if (BAC) {
      // notice every context the game uses, including ones created before we hooked in
      ["createBufferSource", "createGain", "createOscillator", "createMediaElementSource", "createBiquadFilter", "createPanner", "createDynamicsCompressor", "decodeAudioData"].forEach((m) => {
        const f = BAC[m]; if (typeof f !== "function" || f.__zz) return;
        const wrapped = function () { st.ctxs.add(this); if (S.muted && !this.__zzGain) holdCtx(this); return f.apply(this, arguments); };
        wrapped.__zz = true; BAC[m] = wrapped;
      });
      const resume = BAC.resume;
      if (typeof resume === "function" && !resume.__zz) {
        const r = function () { st.ctxs.add(this); if (S.muted && !this.__zzGain) { this.__zzHeld = true; return Promise.resolve(); } return resume.apply(this, arguments); };
        r.__zz = true; BAC.resume = r;
      }
      st.resume = resume;
    }
    function holdCtx(ctx) { if (ctx.state === "running") { ctx.__zzHeld = true; try { ctx.suspend(); } catch {} } }

    // <audio> / <video>, in the page or not
    const MP = w.HTMLMediaElement && w.HTMLMediaElement.prototype;
    if (MP && !MP.__zzVol) {
      const vd = Object.getOwnPropertyDescriptor(MP, "volume"), md = Object.getOwnPropertyDescriptor(MP, "muted");
      MP.__zzVol = vd; MP.__zzMuted = md;
      Object.defineProperty(MP, "volume", { configurable: true, enumerable: true,
        get() { return this.__zzWant ?? vd.get.call(this); },
        set(v) { this.__zzWant = +v; st.media.add(this); try { vd.set.call(this, Math.max(0, Math.min(1, +v * level()))); } catch {} } });
      Object.defineProperty(MP, "muted", { configurable: true, enumerable: true,
        get() { return this.__zzWantMuted ?? md.get.call(this); },
        set(v) { this.__zzWantMuted = !!v; st.media.add(this); md.set.call(this, !!v || S.muted); } });
      const play = MP.play;
      MP.play = function () { st.media.add(this); applyEl(this); return play.apply(this, arguments); };
    }
    function applyEl(el) {
      const P = w.HTMLMediaElement.prototype;
      try { P.__zzVol.set.call(el, Math.max(0, Math.min(1, (el.__zzWant ?? 1) * level()))); } catch {}
      try { P.__zzMuted.set.call(el, !!el.__zzWantMuted || S.muted); } catch {}
    }

    w.__zzApply = () => {
      st.ctxs.forEach((ctx) => {
        if (ctx.__zzGain) { try { ctx.__zzGain.gain.value = level(); } catch {} }
        else if (S.muted) holdCtx(ctx);
        else if (ctx.__zzHeld) { ctx.__zzHeld = false; try { st.resume ? st.resume.call(ctx) : ctx.resume(); } catch {} }
      });
      try { w.document.querySelectorAll("audio,video").forEach((m) => st.media.add(m)); } catch {}
      st.media.forEach(applyEl);
    };
    w.__zzApply();
    w.setInterval(() => {
      w.__zzApply();
      try { for (let i = 0; i < w.frames.length; i++) patch(w.frames[i]); } catch {}   // games inside inner frames
    }, 1000);

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
  const applyAll = () => gameAudio.windows.forEach((w) => { try { w.__zzApply && w.__zzApply(); } catch {} });
  // Catch the game's window as early as possible, before it starts making sound
  let win = null;
  const watch = () => {
    gameAudio.windows = []; win = null; gameAudio.reachable = null;
    const t0 = Date.now();
    const id = setInterval(() => {
      let w; try { w = frame.contentWindow; } catch {}
      if (w && w !== win) {
        try {
          if (w.location.href !== "about:blank") { win = w; patch(w); gameAudio.reachable = true; }
        } catch { gameAudio.reachable = false; clearInterval(id); }
      }
      if (Date.now() - t0 > 15000) clearInterval(id);
    }, 4);
  };
  frame.addEventListener("load", () => {
    try { patch(frame.contentWindow); gameAudio.reachable = true; } catch { gameAudio.reachable = false; }
    try { void frame.contentWindow.document; } catch { gameAudio.reachable = false; }
    applyAll();
  });
  settingsListeners.push(applyAll);
  return watch;
}

/* Arrow buttons for rails on desktop */
function railArrows() {
  document.querySelectorAll(".row-wrap").forEach((w) => {
    const rail = w.querySelector(".rail"), head = w.querySelector(".row-head");
    if (!rail || !head || w.querySelector(".rail-nav")) return;
    const nav = document.createElement("div"); nav.className = "rail-nav";
    nav.innerHTML = `<button type="button" aria-label="Scroll left">‹</button><button type="button" aria-label="Scroll right">›</button>`;
    const [l, r] = nav.querySelectorAll("button");
    l.onclick = () => rail.scrollBy({ left: -rail.clientWidth * 0.8, behavior: "smooth" });
    r.onclick = () => rail.scrollBy({ left: rail.clientWidth * 0.8, behavior: "smooth" });
    head.appendChild(nav);
  });
}

/* ---------------- Home page ---------------- */
function initHome() {
  const search = document.getElementById("search");

  // ZZ Games logo: go back to the hero instead of reloading
  const logo = document.querySelector(".topbar .logo");
  if (logo) logo.addEventListener("click", (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: "smooth" }); });

  // Hero channels: the hovered/focused panel opens up
  const chans = document.getElementById("channels");
  const panels = [...chans.querySelectorAll(".zz-panel")];
  const pick = (id) => panels.forEach((p) => {
    const on = p.dataset.ch === id;
    p.classList.toggle("on", on);
    p.setAttribute("aria-current", on ? "true" : "false");
  });
  pick("games");
  panels.forEach((p) => {
    ["mouseenter", "focus"].forEach((ev) => p.addEventListener(ev, () => pick(p.dataset.ch)));
  });
  chans.addEventListener("mouseleave", () => pick("games"));

  buildContinue();
  railArrows();
  initFind(search);
}

/* ---------- Continue: games, movies, shows and songs in one row, newest first ---------- */
function continueItems() {
  const items = [];
  const at = getRecentAt();
  getRecent().forEach((id, i) => {
    const g = GAMES.find((x) => x.id === id);
    if (!g) return;
    items.push({ kind: "game", at: at[id] || -i, title: g.title, label: "Game", sub: g.category || "", art: g.image || "", href: `play.html?game=${g.id}` });
  });
  if (typeof getRecentProgress === "function") {
    getRecentProgress(12).forEach((p) => {
      const tv = p.media_type === "tv";
      const left = p.duration_seconds > 0 ? Math.max(0, Math.round((p.duration_seconds - p.position_seconds) / 60)) : 0;
      items.push({
        kind: tv ? "tv" : "movie", at: p.updated_at || 0, title: p.title || "Untitled",
        label: tv ? `S${p.season || 1} · E${p.episode || 1}` : "Movie",
        sub: left ? `${left} min left` : "",
        art: p.poster_path ? tmdbPoster(p.poster_path, "w342") : "",
        pct: p.duration_seconds > 0 ? Math.min(100, Math.round(p.position_seconds / p.duration_seconds * 100)) : 0,
        href: tv ? `watch.html?type=tv&id=${p.tmdb_id}&s=${p.season || 1}&e=${p.episode || 1}` : `watch.html?type=movie&id=${p.tmdb_id}`,
      });
    });
  }
  let acts = [];
  try { acts = JSON.parse(localStorage.getItem("zzs:activity")) || []; } catch {}
  const seen = new Set();
  acts.forEach((a, i) => {
    if (a.k !== "song" || !a.ref || seen.has(a.id)) return;
    seen.add(a.id);
    items.push({ kind: "song", at: a.at || -100 - i, title: a.t, label: "Song", sub: a.s || "", art: a.img || "", song: a.ref });
  });
  return items.sort((x, y) => y.at - x.at).slice(0, 14);
}
function buildContinue() {
  const wrap = document.getElementById("continueWrap"), rail = document.getElementById("continueRail");
  if (!wrap || !rail) return;
  const items = S.showRecent ? continueItems() : [];
  wrap.hidden = !items.length;
  rail.replaceChildren(...items.map((it) => {
    const el = document.createElement(it.song ? "button" : "a");
    el.className = "cont-card k-" + it.kind;
    if (it.song) { el.type = "button"; el.onclick = () => playSong(it.song); }
    else el.href = it.href;
    const bg = it.art ? `background-image:url('${escHTML(it.art)}')` : coverStyle({ title: it.title });
    el.innerHTML = `<span class="cont-bg" style="${bg}"></span>
      <span class="cont-art" style="${bg}"></span>
      <span class="cont-txt"><small>${escHTML(it.label)}</small><b>${escHTML(it.title)}</b>${it.sub ? `<em>${escHTML(it.sub)}</em>` : ""}</span>
      <span class="cont-go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg></span>
      ${it.pct ? `<span class="cont-bar"><i style="width:${it.pct}%"></i></span>` : ""}`;
    el.setAttribute("aria-label", `${it.label}: ${it.title}`);
    return el;
  }));
}

/* ---------- One search for everything: games, movies & shows, songs ---------- */
let dzN = 0;
function deezer(path) {
  return new Promise((res, rej) => {
    const cb = "__zzfind" + ++dzN, s = document.createElement("script");
    const done = () => { clearTimeout(t); delete window[cb]; s.remove(); };
    const t = setTimeout(() => { done(); rej(new Error("timeout")); }, 9000);
    window[cb] = (j) => { done(); if (!j || j.error) rej(new Error("deezer")); else res(j); };
    s.onerror = () => { done(); rej(new Error("deezer")); };
    s.src = `https://api.deezer.com${path}${path.includes("?") ? "&" : "?"}output=jsonp&callback=${cb}`;
    document.head.append(s);
  });
}
const dzSong = (x) => ({ id: "dz" + x.id, src: "dz", t: x.title, a: x.artist?.name || "", aid: x.artist?.id ? "dz" + x.artist.id : "", al: x.album?.title || "", alid: x.album?.id ? "dz" + x.album.id : "", art: x.album?.cover_medium || "", big: x.album?.cover_xl || x.album?.cover_big || "", d: x.duration || 0, ex: !!x.explicit_lyrics, pre: x.preview || "" });

function initFind(input) {
  const box = document.getElementById("findResults");
  if (!input || !box) return;
  const q0 = new URLSearchParams(location.search).get("q");
  if (q0) { input.value = q0.slice(0, 60); }
  let tok = 0, timer = 0, songs = [];
  const open = () => { box.hidden = false; input.setAttribute("aria-expanded", "true"); };
  const close = () => { box.hidden = true; input.setAttribute("aria-expanded", "false"); };
  const row = (o) => `<a class="fr-item${o.wide ? " wide" : ""}" href="${o.href || "#"}"${o.song != null ? ` data-song="${o.song}"` : ""} role="option">
      <span class="fr-art" style="${o.art ? `background-image:url('${escHTML(o.art)}')` : o.bg || ""}"></span>
      <span class="fr-txt"><b>${escHTML(o.title)}</b><small>${escHTML(o.sub || "")}</small></span>
      <span class="fr-kind">${escHTML(o.kind)}</span></a>`;
  const section = (id, title, body, more) => `<section class="fr-sec" data-sec="${id}"><div class="fr-h"><span>${title}</span>${more || ""}</div>${body}</section>`;
  const skel = `<div class="fr-skel"><i></i><i></i></div>`;

  function render(q, parts) {
    const enc = encodeURIComponent(q);
    box.innerHTML =
      section("games", "Games", parts.games, `<a class="fr-more" href="games.html?q=${enc}">All games</a>`) +
      section("watch", "Movies & TV", parts.watch, `<a class="fr-more" href="watch.html?type=movie&id=popular">Browse</a>`) +
      section("music", "Songs", parts.music, `<a class="fr-more" href="music.html#/search?q=${enc}">More music</a>`);
  }

  function run() {
    const q = input.value.trim();
    if (q.toLowerCase() === "ss") { location.href = "gamble.html"; return; }
    if (!q) { close(); box.innerHTML = ""; return; }
    const my = ++tok;
    const games = GAMES.filter((g) => matches(g, q)).sort((a, b) => (!!b.url - !!a.url)).slice(0, 6);
    const gamesHTML = games.length
      ? `<div class="fr-grid">${games.map((g) => row({ title: g.title, sub: g.category || "Game", kind: "Game", art: g.image, bg: coverStyle(g), href: `play.html?game=${g.id}` })).join("")}</div>`
      : `<p class="fr-empty">No games match. <a href="request.html?game=${encodeURIComponent(q)}">Request it</a></p>`;
    render(q, { games: gamesHTML, watch: skel, music: skel });
    open();
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (typeof tmdbFetch === "function") {
        tmdbFetch("/search/multi?query=" + encodeURIComponent(q) + "&include_adult=false")
          .then((d) => filterWatchable(null, (d.results || []).filter((r) => (r.media_type === "movie" || r.media_type === "tv") && r.poster_path).slice(0, 10)))
          .then((all) => {
            if (my !== tok) return;
            const list = all.slice(0, 6);
            fillSec("watch", list.length ? `<div class="fr-grid">${list.map((r) => row({
              title: r.title || r.name, kind: r.media_type === "tv" ? "Show" : "Movie",
              sub: ((r.release_date || r.first_air_date || "").slice(0, 4)) || "", art: tmdbPoster(r.poster_path, "w185"),
              href: `watch.html?type=${r.media_type}&id=${r.id}`,
            })).join("")}</div>` : `<p class="fr-empty">No movies or shows found.</p>`);
          })
          .catch(() => { if (my === tok) fillSec("watch", `<p class="fr-empty">Movies and shows aren't loading right now.</p>`); });
      }
      deezer("/search?q=" + encodeURIComponent(q) + "&limit=8")
        .then((j) => {
          if (my !== tok) return;
          songs = (j.data || []).filter((x) => x.readable !== false).slice(0, 6).map(dzSong);
          fillSec("music", songs.length ? `<div class="fr-grid">${songs.map((t, i) => row({ title: t.t, sub: t.a, kind: "Song", art: t.art, song: i, href: `music.html#/search?q=${encodeURIComponent(t.a + " " + t.t)}` })).join("")}</div>` : `<p class="fr-empty">No songs found.</p>`);
        })
        .catch(() => { if (my === tok) fillSec("music", `<p class="fr-empty">Music search isn't loading right now.</p>`); });
    }, 260);
  }
  function fillSec(id, html) {
    const sec = box.querySelector(`[data-sec="${id}"]`);
    if (!sec) return;
    sec.querySelectorAll(".fr-skel, .fr-empty, .fr-grid").forEach((n) => n.remove());
    sec.insertAdjacentHTML("beforeend", html);
  }

  input.setAttribute("role", "combobox"); input.setAttribute("aria-controls", "findResults"); input.setAttribute("aria-expanded", "false");
  input.addEventListener("input", run);
  input.addEventListener("focus", () => { if (input.value.trim() && box.innerHTML) open(); });
  const items = () => [...box.querySelectorAll(".fr-item, .fr-more")];
  const move = (d) => {
    const list = items(); if (!list.length) return;
    let i = list.indexOf(document.activeElement);
    i = i < 0 ? (d > 0 ? 0 : list.length - 1) : Math.max(-1, Math.min(list.length - 1, i + d));
    if (i < 0) input.focus(); else list[i].focus();
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { input.value = ""; close(); input.blur(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "Enter") { e.preventDefault(); const first = box.querySelector(".fr-item"); if (first) first.click(); else if (input.value.trim()) location.href = "games.html?q=" + encodeURIComponent(input.value.trim()); }
  });
  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Escape") { close(); input.focus(); }
  });
  box.addEventListener("click", (e) => {
    const a = e.target.closest("[data-song]");
    if (a) { e.preventDefault(); const t = songs[+a.dataset.song]; if (t) { close(); playSong(t, songs); } }
  });
  document.addEventListener("pointerdown", (e) => { if (!box.hidden && !e.target.closest(".zz-find")) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== input && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && !e.metaKey && !e.ctrlKey) {
      e.preventDefault(); input.focus(); input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
  if (q0) run();
}

/* ---------------- Spotlight (games.html): rotating featured games + "Top picks" ---------------- */
function buildSpotlight() {
  const spot = document.getElementById("spotlight");
  if (!spot) return;
  const playable = GAMES.filter((g) => g.url);
  let feat = GAMES.filter((g) => g.featured && g.url);
  if (feat.length < 3) {
    feat = feat.concat(playable.filter((g) => !g.featured && !feat.includes(g)).slice(0, 3 - feat.length));
  }
  feat = feat.slice(0, 4);
  let picks = GAMES.filter((g) => g.pick && g.url);
  if (picks.length < 3) {
    picks = picks.concat(playable.filter((g) => !g.pick && !feat.includes(g)).slice(0, 3 - picks.length));
  }
  picks = picks.slice(0, 3);
  if (!feat.length && !picks.length) { spot.hidden = true; return; }

  spot.innerHTML = `
    <div class="spot-main">
      <div class="spot-slides"></div>
      <div class="spot-dots" role="tablist"></div>
    </div>
    <div class="spot-side"><div class="spot-side-title">Top picks</div></div>`;
  const slides = spot.querySelector(".spot-slides"), dots = spot.querySelector(".spot-dots");
  const items = feat;
  if (!items.length) spot.querySelector(".spot-main").remove();
  items.forEach((g, i) => {
    const s = document.createElement("a");
    s.className = "slide" + (i === 0 ? " on" : "");
    s.href = `play.html?game=${g.id}`;
    s.innerHTML = `
      <div class="slide-bg" style="${coverStyle(g)}"></div>
      <div class="slide-art" style="${coverStyle(g)}"></div>
      <div class="slide-info">
        <div class="slide-tag">${g.new ? "NEW · " : ""}FEATURED · ${(g.category || "GAME").toUpperCase()}</div>
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
    cur = (i + items.length) % items.length;
    slides.querySelectorAll(".slide").forEach((el, j) => el.classList.toggle("on", j === cur));
    // re-create the active dot so its progress bar starts again from empty
    dots.querySelectorAll("button").forEach((el, j) => {
      el.classList.remove("on");
      if (j === cur) { void el.offsetWidth; el.classList.add("on"); }
    });
  }
  function restart() {
    clearInterval(timer);
    if (items.length > 1 && !S.reduceMotion) timer = setInterval(() => show(cur + 1), 6000);
  }
  const main = spot.querySelector(".spot-main");
  if (main) {
    main.addEventListener("mouseenter", () => { clearInterval(timer); main.classList.add("paused"); });
    main.addEventListener("mouseleave", () => { main.classList.remove("paused"); restart(); });
    // swipe between slides on touch screens
    let x0 = null;
    main.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    main.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { show(cur + (dx < 0 ? 1 : -1)); restart(); }
    }, { passive: true });
  }
  restart();

  const side = spot.querySelector(".spot-side");
  picks.forEach((g) => {
    const a = document.createElement("a");
    a.className = "pick"; a.href = `play.html?game=${g.id}`;
    a.innerHTML = `<div class="pick-art" style="${coverStyle(g)}"></div><div class="pick-meta"><div class="pick-name"></div></div><span class="pick-play">▶</span>`;
    a.querySelector(".pick-name").textContent = g.title;
    side.appendChild(a);
  });
}

/* ---------------- Games page (games.html) ---------------- */
function initGames() {
  const search = document.getElementById("search");
  const grid = document.getElementById("grid");

  buildSpotlight();

  // Grid + search
  function render() {
    const q = search.value.trim();
    const mh = document.getElementById("musicHint");
    mh.hidden = !q || q.toLowerCase() === "ss";
    mh.href = "music.html#/search?q=" + encodeURIComponent(q);
    mh.textContent = `Search music for “${q}”`;
    const spot = document.getElementById("spotlight");
    if (spot) spot.hidden = !!q;
    const list = GAMES.filter((g) => matches(g, q))
      .sort((a, b) => (!!b.url - !!a.url) || (!!b.image - !!a.image)); // playable games first
    grid.replaceChildren(...list.map((g) => card(g)));
    document.getElementById("empty").hidden = list.length > 0;
    document.getElementById("emptyRequest").href = `request.html${q ? "?game=" + encodeURIComponent(q) : ""}`;
    document.getElementById("gridTitle").textContent = q ? `Results for “${q}”` : "All games";
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
    if (e.key === "/" && document.activeElement !== search && !e.metaKey && !e.ctrlKey) { e.preventDefault(); search.focus(); search.scrollIntoView({ behavior: "smooth", block: "center" }); }
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
  const art = document.querySelector(".loader-art");
  if (art && g.image) art.style.backgroundImage = `url('${g.image}')`;
  if (!g.gamble) {
    addRecent(g.id);
  }

  const frame = document.getElementById("frame");
  const loader = document.getElementById("loader");
  const startWatch = hookGameAudio(frame);

  // Every repository-backed game URL is resolved to its own GitHub Pages site above.
  function gameSrc(url) {
    return Promise.resolve(url);
  }
  function load() {
    if (!g.url) return;
    loader.classList.remove("done");
    gameSrc(g.url).then((u) => { frame.src = u; startWatch(); });
  }

  if (g.url) {
    load();
    frame.addEventListener("load", () => { if (frame.src) loader.classList.add("done"); });
  } else {
    loader.querySelector("p").textContent = "This game doesn't have a link yet.";
    loader.querySelector(".spinner").remove();
  }

  document.getElementById("reload").onclick = load;

  if (pickVersion) pickVersion(document.getElementById("versions"), () => document.getElementById("reload").onclick());

  // Fullscreen: "window" fills the browser tab, "screen" takes over the whole monitor
  const stage = document.getElementById("stage");
  const fullBtn = document.getElementById("full");
  const exitBtn = document.createElement("button");
  exitBtn.className = "exit-full"; exitBtn.textContent = "✕ Exit fullscreen";
  stage.appendChild(exitBtn);
  const setWindowFull = (on) => {
    document.body.classList.toggle("window-full", on);
    fullBtn.textContent = on ? "Exit" : "Fullscreen";
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
}

buildSettings();
applySettings();
if (document.body.classList.contains("play-page")) initPlay();
else if (document.body.classList.contains("watch-page")) { /* watch.js handles its own init */ }
else if (document.body.classList.contains("games-page")) { initGames(); }
else { initHome(); }
