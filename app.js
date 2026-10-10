// ZZ Games — site logic. You normally only edit games.js.

const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
GAMES.forEach((g) => {
  g.id = slug(g.title);
  if (!g.url && g.repo) g.url = `https://${(g.user || SITE.githubUser).toLowerCase()}.github.io/${g.repo}/`;
});

// Colorful generated cover when a game has no image
function coverStyle(g) {
  if (g.image) return `background-image:url('${g.image}')`;
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

/* ---------------- Home page ---------------- */
function initHome() {
  document.title = SITE.name;
  const req = document.getElementById("requestLink");
  if (SITE.requestFormUrl) req.href = SITE.requestFormUrl; else req.remove();

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
  if (recent.length) {
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

  document.title = `${g.title} · ${SITE.name}`;
  document.getElementById("gameTitle").textContent = g.title;
  if (!g.gamble) addRecent(g.id);

  const frame = document.getElementById("frame");
  const loader = document.getElementById("loader");
  if (g.url) {
    frame.src = g.url;
    frame.addEventListener("load", () => loader.classList.add("done"));
  } else {
    loader.querySelector("p").textContent = "This game doesn't have a link yet — add it in games.js.";
    loader.querySelector(".spinner").remove();
  }

  document.getElementById("reload").onclick = () => {
    if (!g.url) return;
    loader.classList.remove("done");
    frame.src = g.url;
  };
  document.getElementById("full").onclick = () => {
    const el = document.getElementById("stage");
    (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
  };

  // More games: same category first
  const more = GAMES.filter((x) => x.id !== g.id)
    .sort((a, b) => (b.category === g.category) - (a.category === g.category) || Math.random() - 0.5)
    .slice(0, 12);
  document.getElementById("more").replaceChildren(...more.map(card));
}

if (document.body.classList.contains("play-page")) initPlay(); else initHome();
