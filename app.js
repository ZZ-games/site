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

function card(g) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = `play.html?game=${g.id}`;
  a.innerHTML = `
    <div class="cover" style="${coverStyle(g)}">
      ${g.image ? "" : `<span class="initials">${initials(g.title)}</span>`}
      ${g.url ? "" : `<span class="soon">NO LINK YET</span>`}
    </div>
    <div class="meta"><div class="name"></div><div class="cat"></div></div>`;
  a.querySelector(".name").textContent = g.title;
  a.querySelector(".cat").textContent = g.category;
  return a;
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
  btn.className = "btn ghost icon-btn";
  btn.title = "Settings";
  btn.setAttribute("aria-label", "Settings");
  btn.textContent = "⚙";
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
      <p class="note">Desktop mode makes games use keyboard controls instead of touch controls. Auto turns it on for iPads and tablets. Settings save in this browser. Volume works on games hosted on ZZ Games; a few outside games (like Tung Tung Kart) use their own volume.</p>
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
    // Esc inside the game still exits browser-window fullscreen
    w.addEventListener("keydown", (e) => {
      if (e.key === "Escape") document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
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
  document.title = SITE.name;
  const req = document.getElementById("requestLink");
  req.href = "request.html";

  // Hero
  const f = GAMES.find((g) => g.featured && g.url) || GAMES.find((g) => g.url && g.image) || GAMES.find((g) => g.url) || GAMES[0];
  const hero = document.getElementById("hero");
  hero.innerHTML = `
    <img class="brand" src="images/logo.png" alt="${SITE.name}">
    <div class="featured">
      <div class="thumb" style="${coverStyle(f)}">${f.image ? "" : initials(f.title)}</div>
      <div><div class="tag">FEATURED</div><div class="t"></div></div>
      <a class="btn" href="play.html?game=${f.id}">▶ Play</a>
    </div>`;
  hero.querySelector(".t").textContent = f.title;

  // Categories
  const cats = ["All", ...new Set(GAMES.map((g) => g.category))];
  const catBox = document.getElementById("cats");
  let current = "All";
  cats.forEach((c) => {
    const b = document.createElement("button");
    b.textContent = c;
    if (c === "All") b.classList.add("on");
    b.onclick = () => {
      current = c;
      catBox.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      render();
    };
    catBox.appendChild(b);
  });

  // Recent
  const recent = getRecent().map((id) => GAMES.find((g) => g.id === id)).filter(Boolean);
  if (recent.length && S.showRecent) {
    document.getElementById("recentWrap").hidden = false;
    recent.forEach((g) => document.getElementById("recent").appendChild(card(g)));
  }

  // Grid + search
  const grid = document.getElementById("grid");
  const search = document.getElementById("search");
  function render() {
    const q = search.value.trim().toLowerCase();
    const list = GAMES.filter((g) =>
      (current === "All" || g.category === current) && g.title.toLowerCase().includes(q))
      .sort((a, b) => (!!b.url - !!a.url) || (!!b.image - !!a.image)); // playable games first, then ones with covers
    grid.replaceChildren(...list.map(card));
    document.getElementById("empty").hidden = list.length > 0;
    document.getElementById("gridTitle").textContent =
      q ? `Results for “${search.value.trim()}”` : current === "All" ? "All games" : `${current} games`;
  }
  search.addEventListener("input", () => {
    if (search.value.trim().toLowerCase() === "ss") { location.href = "gamble.html"; return; }
    render();
  });
  document.getElementById("count").textContent = GAMES.length;
  render();
}

/* ---------------- Play page ---------------- */
function initPlay() {
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

  document.title = `${g.title} · ${SITE.name}`;
  document.getElementById("gameTitle").textContent = g.title;
  if (!g.gamble) addRecent(g.id);

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

  // More games: same category first
  const more = GAMES.filter((x) => x.id !== g.id)
    .sort((a, b) => (b.category === g.category) - (a.category === g.category) || Math.random() - 0.5)
    .slice(0, 12);
  document.getElementById("more").replaceChildren(...more.map(card));
}

buildSettings();
applySettings();
if (document.body.classList.contains("play-page")) initPlay(); else initHome();
