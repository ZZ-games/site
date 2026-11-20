// Video sources (servers) + watch progress (localStorage)
// If one server is down, the player's "Server" button switches to the next.

const SOURCES = [
  // only servers that work inside the site's safe (sandboxed) player; VidLink, VidFast, VidRock and vidsrc.buzz refuse it. CineSrc first (it reports progress and has next-episode), then Peachify, the plainest player
  { id: 0, provider_name: "Peachify", style: "bare", base_url: "https://peachify.net", kind: "both", priority: 0, enabled: true, extra: "color=%233b82f6&allow-fullscreen=true&allow-pip=true" },
  { id: 1, provider_name: "EmbedWave", style: "path", base_url: "https://embedwave.cc", kind: "both", priority: 1, enabled: true },
  { id: 2, provider_name: "VidCore", style: "path", base_url: "https://vidcore.org", kind: "both", priority: 2, enabled: true, resume: "startAt", extra: "theme=3b82f6" },
  { id: 3, provider_name: "Cineby", style: "path", base_url: "https://mycineby.cc", kind: "both", priority: 3, enabled: true, extra: "color=3b82f6" },
  { id: 4, provider_name: "CineSrc", style: "cinesrc", base_url: "https://cinesrc.st", kind: "both", priority: -1, enabled: true },
];

function getSources(kind) {
  return SOURCES
    .filter(function (s) { return s.enabled && (s.kind === "both" || s.kind === kind); })
    .sort(function (a, b) { return a.priority - b.priority; });
}

// Session ID (browser-unique, persisted)
var SESSION_KEY = "zz-watch-session";
function getSessionId() {
  var id = null;
  try { id = localStorage.getItem(SESSION_KEY); } catch (e) {}
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
    try { localStorage.setItem(SESSION_KEY, id); } catch (e) {}
  }
  return id;
}

// Progress CRUD — keyed by "movie-{id}" or "tv-{id}-{season}-{episode}"
var PROGRESS_KEY = "zz-watch-progress";

function _loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch (e) { return {}; }
}
function _saveProgressStore(store) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(store)); } catch (e) {}
}

function progressKey(mediaType, tmdbId, season, episode) {
  if (mediaType === "tv") return "tv-" + tmdbId + "-" + (season || 1) + "-" + (episode || 1);
  return "movie-" + tmdbId;
}

function getAllProgress() { return _loadProgress(); }

function getProgress(mediaType, tmdbId, season, episode) {
  var store = _loadProgress();
  return store[progressKey(mediaType, tmdbId, season, episode)] || null;
}

function saveProgress(mediaType, tmdbId, season, episode, position, duration, extra) {
  var store = _loadProgress();
  var key = progressKey(mediaType, tmdbId, season, episode);
  var pct = duration > 0 ? position / duration : 0;
  // Delete past 95%
  if (pct > 0.95) { delete store[key]; _saveProgressStore(store); return; }
  store[key] = {
    session_id: getSessionId(),
    media_type: mediaType,
    tmdb_id: tmdbId,
    season: season || null,
    episode: episode || null,
    position_seconds: Math.floor(position),
    duration_seconds: Math.floor(duration),
    updated_at: Date.now(),
    title: (extra && extra.title) || "",
    poster_path: (extra && extra.poster_path) || "",
  };
  var keys = Object.keys(store).sort(function (a, b) { return (store[b].updated_at || 0) - (store[a].updated_at || 0); });
  keys.slice(120).forEach(function (k) { delete store[k]; });
  _saveProgressStore(store);
}

function deleteProgress(mediaType, tmdbId, season, episode) {
  var store = _loadProgress();
  delete store[progressKey(mediaType, tmdbId, season, episode)];
  _saveProgressStore(store);
}

// One entry per movie / show (the most recent episode wins), newest first.
// Progress is still saved per episode so each episode resumes at the right spot.
function getRecentProgress(limit) {
  var store = _loadProgress(), best = {};
  Object.keys(store).forEach(function (k) {
    var p = store[k];
    if (!p || !p.tmdb_id) return;
    var id = p.media_type + "-" + p.tmdb_id;
    if (!best[id] || (p.updated_at || 0) > (best[id].updated_at || 0)) best[id] = p;
  });
  return Object.keys(best).map(function (k) { return best[k]; })
    .sort(function (a, b) { return (b.updated_at || 0) - (a.updated_at || 0); })
    .slice(0, limit || 6);
}

// The season / episode last picked for each show, so a show reopens where you were
var PICK_KEY = "zz-watch-picks";
function getLastPick(tvId) {
  try { return (JSON.parse(localStorage.getItem(PICK_KEY)) || {})[tvId] || null; } catch (e) { return null; }
}
function saveLastPick(tvId, season, episode) {
  try {
    var all = JSON.parse(localStorage.getItem(PICK_KEY)) || {};
    all[tvId] = { s: +season || 1, e: +episode || 1, at: Date.now() };
    var keys = Object.keys(all).sort(function (a, b) { return all[b].at - all[a].at; });
    keys.slice(60).forEach(function (k) { delete all[k]; });
    localStorage.setItem(PICK_KEY, JSON.stringify(all));
  } catch (e) {}
}

// TMDB helpers
function tmdbFetch(path) {
  var token = typeof SITE !== "undefined" && SITE.tmdbToken;
  if (!token) return Promise.reject(new Error("No TMDB token"));
  return fetch("https://api.themoviedb.org/3" + path, {
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
  }).then(function (r) { if (!r.ok) throw new Error("TMDB " + r.status); return r.json(); });
}

function tmdbPoster(path, size) {
  if (!path) return "";
  return "https://image.tmdb.org/t/p/" + (size || "w500") + path;
}
