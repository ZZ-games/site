'use strict';
/* ZZ Games Music: catalogue metadata with full-length Audius and licensed Archive playback. */
(() => {
  /* ================= helpers ================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (s) => { s = Math.max(0, Math.floor(s || 0)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = String(s % 60).padStart(2, '0'); return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${m}:${x}`; };
  const long = (s) => { const m = Math.round((s || 0) / 60); return m >= 60 ? `${Math.floor(m / 60)} hr ${m % 60} min` : `${m} min`; };
  const fans = (n) => (n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'K' : String(n || 0));
  const shuffled = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const hash = (s) => { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); };
  const enc = encodeURIComponent;
  const BASE_TITLE = document.title;

  const ICONS = {
    play: ['M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z', 1],
    pause: ['M7 5h3.5v14H7zM13.5 5H17v14h-3.5z', 1],
    next: ['M5.5 6.2v11.6a.8.8 0 0 0 1.2.7l8.6-5.8a.8.8 0 0 0 0-1.4L6.7 5.5a.8.8 0 0 0-1.2.7zM16.5 5.5h2v13h-2z', 1],
    prev: ['M18.5 6.2v11.6a.8.8 0 0 1-1.2.7l-8.6-5.8a.8.8 0 0 1 0-1.4l8.6-5.8a.8.8 0 0 1 1.2.7zM5.5 5.5h2v13h-2z', 1],
    shuffle: ['M16 4h4v4M4 20 20 4M20 16v4h-4M15 15l5 5M4 4l5 5'],
    repeat: ['M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4'],
    repeat1: ['M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4M11.5 10.5l1-.5v4'],
    heart: ['M12 20s-7.5-4.6-9.2-9.3C1.7 7.6 3.7 4.5 7 4.5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.3 0 5.3 3.1 4.2 6.2C19.5 15.4 12 20 12 20z'],
    plus: ['M12 5v14M5 12h14'],
    more: ['M5 12h.01M12 12h.01M19 12h.01'],
    search: ['M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM21 21l-5.2-5.2'],
    compass: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z'],
    crate: ['M4 9h16v11H4zM4 9l2-5h12l2 5M9 13h6'],
    radio: ['M4 9h16v11H4zM7 9l10-5M8 14.5h.01M8 17h.01M13 15.5h4'],
    moon: ['M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z'],
    vol: ['M11 5 6.5 9H3v6h3.5L11 19zM15.5 9a4 4 0 0 1 0 6M18.5 6a8 8 0 0 1 0 12'],
    mute: ['M11 5 6.5 9H3v6h3.5L11 19zM16 9.5l5 5M21 9.5l-5 5'],
    video: ['M3 6.5h12v11H3zM15 10.5l6-3.5v10l-6-3.5'],
    queue: ['M3 6h14M3 11h14M3 16h8M16 14v6l5-3z'],
    close: ['M6 6l12 12M18 6 6 18'],
    sun: ['M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z'],
    wave: ['M5 18.5a9.5 9.5 0 0 1 0-13M8 15.5a5.5 5.5 0 0 1 0-7M16 8.5a5.5 5.5 0 0 1 0 7M19 5.5a9.5 9.5 0 0 1 0 13M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'],
    dice: ['M4.5 4.5h15v15h-15zM9 9h.01M15 15h.01M15 9h.01M9 15h.01M12 12h.01'],
    clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2'],
    expand: ['M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7'],
    back: ['M15 18l-6-6 6-6'],
    trash: ['M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3'],
    edit: ['M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4'],
    user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0'],
    disc: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
    next2: ['M5 12h14M13 6l6 6-6 6'],
    star: ['M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z'],
    verified: ['M12 2.5l2.4 1.8 3-.2.8 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.8 2.9-3-.2L12 21.5l-2.4-1.8-3 .2-.8-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.8-2.9 3 .2zM8.5 12l2.5 2.5 4.5-5'],
  };
  const ic = (n, cls = '') => { const [d, f] = ICONS[n] || ICONS.more; return `<svg class="i ${f ? 'fill ' : ''}${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`; };
  const phStyle = (seed) => { const h = hash(seed) % 360; return `background:linear-gradient(135deg,hsl(${h} 62% 58%),hsl(${(h + 48) % 360} 55% 28%))`; };
  const initial = (s) => esc((String(s || '?').replace(/[^\p{L}\p{N}]/gu, '')[0] || '?').toUpperCase());
  const ph = (seed, cls = '') => `<span class="ph ${cls}" style="${phStyle(seed)}">${initial(seed)}</span>`;
  const art = (src, seed, cls = '') => (src ? `<img class="${cls}" src="${esc(src)}" alt="" loading="lazy" decoding="async" data-seed="${esc(seed)}">` : ph(seed, cls));
  // broken images become a generated placeholder
  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t.tagName !== 'IMG' || !('seed' in t.dataset)) return;
    const s = document.createElement('span');
    s.className = 'ph ' + t.className; s.setAttribute('style', phStyle(t.dataset.seed)); s.textContent = (t.dataset.seed || '?')[0]?.toUpperCase() || '?';
    t.replaceWith(s);
  }, true);

  /* ================= storage ================= */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('zzs:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('zzs:' + k, JSON.stringify(v)); } catch { /* full or blocked */ } },
  };
  const S = {
    liked: store.get('liked', []), lists: store.get('lists', []), follows: store.get('follows', []),
    tuned: store.get('tuned', []), activity: store.get('activity', []),
    searches: store.get('searches', []), taste: store.get('taste', {}),
    cfg: Object.assign({ theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light', autoplay: true, vol: 0.8, muted: false, panel: true }, store.get('cfg', {})),
  };
  const save = (...ks) => ks.forEach((k) => store.set(k, S[k]));
  const slim = (t) => ({ id: t.id, src: t.src, t: t.t, a: t.a, aid: t.aid || '', al: t.al || '', alid: t.alid || '', art: t.art || '', big: t.big || '', d: t.d || 0, ex: !!t.ex, ver: !!t.ver, g: t.g || '', file: t.file || '', license: t.license || '', licenseUrl: t.licenseUrl || '', archiveUrl: t.archiveUrl || '', pre: t.pre || '' });

  function remember(item) {
    item.at = Date.now();
    S.activity = [item, ...S.activity.filter((a) => !(a.k === item.k && a.id === item.id))].slice(0, 30);
    save('activity');
  }
  function bumpTaste(t) {
    if (!t.aid) return;
    const x = S.taste[t.aid] || { n: 0 };
    x.n += 1; x.name = t.a; x.at = Date.now();
    S.taste[t.aid] = x;
    S.taste = Object.fromEntries(Object.entries(S.taste).sort((a, b) => b[1].n - a[1].n).slice(0, 80));
    save('taste');
  }
  function topArtists(n = 5) {
    const w = {};
    const add = (id, name, s) => { if (!id || !id.startsWith('dz')) return; (w[id] ??= { name, s: 0 }).s += s; };
    for (const [id, x] of Object.entries(S.taste)) add(id, x.name, x.n);
    S.liked.forEach((t) => add(t.aid, t.a, 2));
    S.follows.forEach((f) => add(f.id, f.name, 4));
    return Object.entries(w).sort((a, b) => b[1].s - a[1].s).slice(0, n).map(([id, x]) => ({ id, name: x.name }));
  }

  /* ================= data sources ================= */
  const memo = new Map();
  const cached = (k, fn, ttl = 10 * 60e3) => {
    const h = memo.get(k);
    if (h && Date.now() - h.at < ttl) return h.p;
    const p = fn().catch((e) => { memo.delete(k); throw e; });
    memo.set(k, { p, at: Date.now() });
    return p;
  };
  const getJSON = async (u, ms = 12000) => {
    const r = await fetch(u, { signal: AbortSignal.timeout(ms) });
    if (!r.ok) throw new Error(`Request failed (${r.status})`);
    return r.json();
  };
  // Opened straight from disk (file://) or on a host without the backend (e.g. GitHub Pages):
  // the catalog then comes from Deezer directly in the browser, and songs play as Deezer's 30-second previews.
  const FILE = location.protocol === 'file:';
  let NOAPI = FILE;
  function markNoapi() { NOAPI = true; }
  const M = (p, fresh) => cached('m:' + p + (fresh ? Math.random() : ''), async () => {
    if (!NOAPI) {
      try {
        const r = await fetch('api/music/' + p, { signal: AbortSignal.timeout(20000) });
        const isJson = (r.headers.get('content-type') || '').includes('json');
        if (r.ok && isJson) return await r.json();
        if (!isJson) markNoapi(); // got an HTML 404 page: no backend on this host
      } catch { /* network trouble: try the browser route */ }
    }
    return localApi(p);
  });

  /* --- Deezer straight from the browser (JSONP works even from file://) --- */
  let jpN = 0;
  function dzp(path) {
    return new Promise((res, rej) => {
      const cb = '__zzdz' + ++jpN, s = document.createElement('script');
      const done = () => { clearTimeout(timer); delete window[cb]; s.remove(); };
      const timer = setTimeout(() => { done(); rej(new Error('Deezer took too long')); }, 12000);
      window[cb] = (j) => { done(); if (!j || j.error) rej(new Error(j?.error?.message || 'Deezer error')); else res(j); };
      s.onerror = () => { done(); rej(new Error('Can’t reach Deezer')); };
      s.src = `https://api.deezer.com${path}${path.includes('?') ? '&' : '?'}output=jsonp&callback=${cb}`;
      document.head.append(s);
    });
  }
  const dzTrack = (x, alb) => {
    const al = alb || x.album || {};
    return { id: 'dz' + x.id, src: 'dz', t: x.title, a: x.artist?.name || '', aid: x.artist?.id ? 'dz' + x.artist.id : '', al: al.title || '', alid: al.id ? 'dz' + al.id : '', art: al.cover_medium || '', big: al.cover_xl || al.cover_big || '', d: x.duration || 0, ex: !!x.explicit_lyrics, pre: x.preview || '' };
  };
  const dzArtist = (a) => ({ id: 'dz' + a.id, name: a.name, pic: a.picture_medium || '', big: a.picture_xl || a.picture_big || '', fans: a.nb_fan || 0 });
  const dzAlbum = (a, who) => ({ id: 'dz' + a.id, t: a.title, a: a.artist?.name || who || '', art: a.cover_medium || '', big: a.cover_xl || '', year: (a.release_date || '').slice(0, 4), type: a.record_type || 'album' });
  const okTrack = (x) => x.readable !== false;
  async function localApi(p) {
    const [route, qs] = p.split('?');
    const q = new URLSearchParams(qs || '');
    const num = (v) => (String(v || '').match(/\d+/) || [''])[0];
    const data = (j) => j.data || [];
    if (route === 'chart') {
      const [t, a] = await Promise.all([dzp('/chart/0/tracks?limit=50'), dzp('/chart/0/artists?limit=24')]);
      return { tracks: data(t).filter(okTrack).map((x) => dzTrack(x)), artists: data(a).map(dzArtist) };
    }
    if (route === 'search') {
      const e = enc(q.get('q') || '');
      const [t, a, al] = await Promise.all([dzp(`/search?q=${e}&limit=30`), dzp(`/search/artist?q=${e}&limit=12`), dzp(`/search/album?q=${e}&limit=12`).catch(() => ({}))]);
      return { tracks: data(t).filter(okTrack).map((x) => dzTrack(x)), artists: data(a).map(dzArtist), albums: data(al).map((x) => dzAlbum(x)) };
    }
    if (route === 'artist') {
      const id = num(q.get('id'));
      const [a, top, albums, rel] = await Promise.all([dzp(`/artist/${id}`), dzp(`/artist/${id}/top?limit=30`), dzp(`/artist/${id}/albums?limit=40`).catch(() => ({})), dzp(`/artist/${id}/related?limit=14`).catch(() => ({}))]);
      return { artist: dzArtist(a), tracks: data(top).filter(okTrack).map((x) => dzTrack(x)), albums: data(albums).map((x) => dzAlbum(x, a.name)), related: data(rel).map(dzArtist) };
    }
    if (route === 'album') {
      const a = await dzp(`/album/${num(q.get('id'))}`);
      return { album: { ...dzAlbum(a), label: a.label || '' }, tracks: data(a.tracks || {}).filter(okTrack).map((x) => dzTrack(x, a)) };
    }
    if (route === 'recs') {
      const seeds = (q.get('a') || '').split(',').map(num).filter(Boolean).slice(0, 6), n = +q.get('n') || 50;
      if (!seeds.length) return { tracks: shuffled((await localApi('chart')).tracks).slice(0, n) };
      const rel = await Promise.all(seeds.map((s) => dzp(`/artist/${s}/related?limit=8`).then(data).catch(() => [])));
      const ids = [...new Set([...seeds, ...rel.flatMap((l) => shuffled(l).slice(0, Math.max(2, Math.ceil(10 / seeds.length))).map((a) => String(a.id)))])].slice(0, 16);
      const tops = await Promise.all(ids.map((id) => dzp(`/artist/${id}/top?limit=8`).then((r) => shuffled(data(r).filter(okTrack)).slice(0, 4)).catch(() => [])));
      const seen = new Set();
      const out = tops.flat().filter((x) => { const k = (x.title + '|' + x.artist?.name).toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; }).map((x) => dzTrack(x));
      return { tracks: shuffled(out).slice(0, n) };
    }
    throw new Error('Unknown request');
  }
  /* --- Internet Archive: explicitly permissively licensed audio only --- */
  const IA = 'https://archive.org';
  const iaLicense = (url) => {
    const u = String(url || '').toLowerCase();
    if (u.includes('creativecommons.org/publicdomain/zero/1.0')) return 'CC0';
    const m = u.match(/creativecommons\.org\/licenses\/(by-sa|by)\/([0-9.]+)/);
    if (m) return (m[1] === 'by-sa' ? 'CC BY-SA ' : 'CC BY ') + m[2];
    return '';
  };
  const iaText = (v) => Array.isArray(v) ? v.join(', ') : String(v || '');
  const iaDuration = (v) => { if (!v) return 0; if (String(v).includes(':')) return String(v).split(':').reduce((n, p) => n * 60 + (+p || 0), 0); return Math.round(+v || 0); };
  const iaFiles = (files) => {
    const rank = { mp3: 0, m4a: 1, ogg: 2, oga: 2, opus: 3, flac: 4, wav: 5 };
    return (files || []).filter((f) => { const m = String(f.name || '').match(/\.([a-z0-9]+)$/i); return m && Object.prototype.hasOwnProperty.call(rank, m[1].toLowerCase()) && f.source !== 'metadata' && (!f.size || +f.size < 250000000); })
      .sort((a, b) => { const ext = (f) => String(f.name).split('.').pop().toLowerCase(); return rank[ext(a)] - rank[ext(b)] || (+a.size || 0) - (+b.size || 0); });
  };
  async function iaItem(doc, expectedArtist = '') {
    const id = doc.identifier; if (!id) return null;
    const meta = await cached('ia:item:' + id, () => getJSON(IA + '/metadata/' + enc(id)), 60 * 60e3);
    const md = meta?.metadata || {}, licenseUrl = md.licenseurl || doc.licenseurl || '', license = iaLicense(licenseUrl);
    if ((md.mediatype || doc.mediatype) !== 'audio' || !license) return null;
    const creators = iaText(md.creator || doc.creator), title = iaText(md.title || doc.title).trim();
    if (!title) return null;
    const norm = (v) => String(v || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (expectedArtist) { const want = norm(expectedArtist), got = norm(creators); if (!got || (!got.includes(want) && !want.includes(got))) return null; }
    const file = iaFiles(meta.files)[0]; if (!file) return null;
    const name = file.name.split('/').map(encodeURIComponent).join('/'), ext = file.name.split('.').pop().toLowerCase();
    if (['flac', 'wav'].includes(ext) && file.size && +file.size > 80000000) return null;
    return { id: 'ia' + id, src: 'ia', t: title, a: creators || 'Internet Archive contributor', al: 'Internet Archive · ' + license, art: IA + '/services/img/' + enc(id), big: IA + '/services/img/' + enc(id), d: iaDuration(file.length || md.runtime), file: name, license, licenseUrl, archiveUrl: IA + '/details/' + enc(id) };
  }
  async function searchArchiveTracks(query, expectedArtist = '', limit = 12) {
    const phrase = String(query || '').replace(/["\\]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100); if (!phrase) return [];
    const q = 'mediatype:audio AND (title:"' + phrase + '" OR creator:"' + phrase + '")';
    const url = IA + '/advancedsearch.php?q=' + enc(q) + '&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=licenseurl&fl[]=mediatype&rows=' + Math.min(30, limit * 2) + '&page=1&output=json&sort[]=downloads+desc';
    const result = await cached('ia:search:' + q, () => getJSON(url), 15 * 60e3), docs = result?.response?.docs || [];
    const checked = await Promise.all(docs.slice(0, Math.min(10, limit * 2)).map((d) => iaItem(d, expectedArtist).catch(() => null)));
    const seen = new Set(); return checked.filter((t) => t && !seen.has(t.id) && seen.add(t.id)).slice(0, limit);
  }
  async function findArchiveVersion(t) {
    const tracks = await searchArchiveTracks(t.t, t.a, 10);
    const norm = (v) => String(v || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
    return tracks.find((x) => norm(x.t) === norm(t.t)) || tracks[0] || null;
  }

  const AU = 'https://api.audius.co/v1', APP = 'app_name=ZZSound';
  const A = (p) => cached('a:' + p, async () => (await getJSON(`${AU}${p}${p.includes('?') ? '&' : '?'}${APP}`)).data);
  const auTrack = (x) => ({
    id: 'au' + x.id, src: 'au', t: x.title, a: x.user?.name || '', aid: x.user?.id ? 'au' + x.user.id : '', ver: !!x.user?.is_verified,
    d: x.duration || 0, art: x.artwork?.['480x480'] || x.artwork?.['150x150'] || '', big: x.artwork?.['1000x1000'] || x.artwork?.['480x480'] || '',
    g: x.genre || '', al: x.genre || '',
  });
  const AU_GENRES = ['All', 'Hip-Hop/Rap', 'Electronic', 'Pop', 'R&B/Soul', 'House', 'Lo-Fi', 'Alternative', 'Rock', 'Trap', 'Dubstep', 'Techno', 'Drum & Bass', 'Ambient', 'Latin', 'Jazz', 'Country', 'Funk'];
  const MOODS = [
    { id: 'sunday', name: 'Slow Sunday', d: 'Soft edges, no rush', g: ['Lo-Fi', 'Ambient'], c: ['#f2a65a', '#9c3d22'] },
    { id: 'lift', name: 'Heavy Lift', d: 'For the last rep', g: ['Trap', 'Dubstep', 'Drum & Bass'], c: ['#ff4d2e', '#33100a'] },
    { id: 'afterhours', name: 'After Hours', d: 'Lights low, bass up', g: ['House', 'Techno'], c: ['#5a3fc0', '#120d2a'] },
    { id: 'bars', name: 'Bars Only', d: 'Fresh rap, no skips', g: ['Hip-Hop/Rap'], c: ['#d6a227', '#3d2c05'] },
    { id: 'deepwork', name: 'Deep Work', d: 'Headphones on', g: ['Ambient', 'Lo-Fi', 'Jazz'], c: ['#6fa595', '#173630'] },
    { id: 'velvet', name: 'Velvet', d: 'R&B after midnight', g: ['R&B/Soul'], c: ['#b8496c', '#2c0c18'] },
    { id: 'riffs', name: 'Loud Guitars', d: 'Rock & alt picks', g: ['Rock', 'Alternative'], c: ['#8c96a1', '#1f2328'] },
    { id: 'calor', name: 'Calor', d: 'Latin heat', g: ['Latin'], c: ['#ffae3b', '#b8301d'] },
    { id: 'glitter', name: 'Glitter Pop', d: 'Bright & catchy', g: ['Pop'], c: ['#ff86c2', '#6b33e8'] },
    { id: 'drops', name: 'Big Drops', d: 'Synths for days', g: ['Electronic', 'Dubstep'], c: ['#3cc8f0', '#25267a'] },
  ];
  async function mixTracks(m) {
    const lists = await Promise.all(m.g.map((g) => A(`/tracks/trending?time=week&limit=40&genre=${enc(g)}`).catch(() => [])));
    const seen = new Set();
    return shuffled(lists.flat().map(auTrack).filter((t) => !seen.has(t.id) && seen.add(t.id))).slice(0, 50);
  }

  /* ================= theme / ui bits ================= */
  $$('[data-ic]').forEach((el) => { el.outerHTML = ic(el.dataset.ic); });
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    $('#toasts').append(t);
    setTimeout(() => t.remove(), 2400);
    while ($('#toasts').children.length > 3) $('#toasts').firstChild.remove();
  }
  const dlg = $('#dlg');
  function askText(title, value = '', cta = 'Save') {
    return new Promise((res) => {
      dlg.innerHTML = `<form method="dialog"><h3>${esc(title)}</h3><input name="v" value="${esc(value)}" maxlength="80" autocomplete="off"><div class="row-btns"><button class="btn ghost" value="cancel">Cancel</button><button class="btn hot" value="ok">${esc(cta)}</button></div></form>`;
      const inp = $('input', dlg);
      dlg.onclose = () => res(dlg.returnValue === 'ok' ? inp.value.trim() : null);
      dlg.returnValue = ''; dlg.showModal(); inp.select();
    });
  }
  function confirmAsk(title, cta = 'Delete') {
    return new Promise((res) => {
      dlg.innerHTML = `<form method="dialog"><h3>${esc(title)}</h3><div class="row-btns"><button class="btn ghost" value="cancel">Cancel</button><button class="btn hot" value="ok">${esc(cta)}</button></div></form>`;
      dlg.onclose = () => res(dlg.returnValue === 'ok');
      dlg.returnValue = ''; dlg.showModal();
    });
  }

  /* ================= list registry (rows reference arrays by key) ================= */
  const LISTS = new Map();
  let regN = 0;
  let warmBudget = 6;   // background lookups allowed on the current screen
  const reg = (list, pfx = 'L') => {
    const k = pfx + ++regN; LISTS.set(k, list);
    // get the first few songs of every list ready, so tapping one starts the full song straight away
    // (at most a handful per screen, so the free lookup servers aren't flooded)
    (window.requestIdleCallback || ((f) => setTimeout(f, 300)))(() => list.slice(0, 3).forEach((t, i) => setTimeout(() => { if (warmBudget > 0 && t && t.src === 'dz' && !ytc[t.id]) { warmBudget--; prepare(t); } }, i * 400)));
    return k;
  };

  const isLiked = (t) => S.liked.some((x) => x.id === t.id);
  const isCur = (t) => P.mode === 'song' && P.cur?.id === t.id;

  function rows(list, o = {}) {
    const k = reg(list, o.pfx || 'L');
    return `<ol class="rows${o.compact ? ' compact' : ''}" data-key="${k}" ${o.ctx ? `data-ctx="${esc(o.ctx)}"` : ''}>${list.map((t, i) => row(t, i, k, o)).join('')}</ol>`;
  }
  function row(t, i, k, o) {
    const alb = t.alid?.startsWith('dz') ? `<a href="#/album/${esc(t.alid)}">${esc(t.al)}</a>` : esc(t.al || '');
    return `<li class="row${o.album === false ? ' noal' : ''}${isCur(t) ? ' on' : ''}" data-l="${k}" data-i="${i}" data-tid="${esc(t.id)}"${o.drag ? ' draggable="true"' : ''}>
      <span class="r-n"><b>${(o.start || 0) + i + 1}</b><i class="eq"><s></s><s></s><s></s></i>${ic('play', 'r-play')}</span>
      ${art(t.art, t.t, 'r-art')}
      <span class="r-main"><b>${esc(t.t)}${t.ex ? '<em class="ex" title="Explicit">E</em>' : ''}</b>${t.aid ? `<a class="r-a" href="#/artist/${esc(t.aid)}">${esc(t.a)}${t.ver ? ic('verified', 'ver') : ''}</a>` : `<span class="r-a">${esc(t.a)}</span>`}</span>
      <span class="r-al">${alb}</span>
      <button class="ib r-like${isLiked(t) ? ' on' : ''}" data-like aria-label="Like">${ic('heart')}</button>
      <span class="r-d">${t.d ? fmt(t.d) : ''}</span>
      <button class="ib r-more" data-more aria-label="More options">${ic('more')}</button></li>`;
  }
  const trackAt = (el) => { const r = el.closest('[data-l]'); return r ? LISTS.get(r.dataset.l)?.[+r.dataset.i] : null; };
  // start finding a song as soon as you point at it, so it's ready when you tap
  let hoverT = 0, hoverEl = null;
  const warm = (e) => {
    const r = e.target && e.target.closest ? e.target.closest('[data-l]') : null;
    if (!r || r === hoverEl) return;
    hoverEl = r; clearTimeout(hoverT);
    hoverT = setTimeout(() => { const t = trackAt(r); if (t) prepare(t); }, e.type === 'touchstart' ? 0 : 120);
  };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('touchstart', warm, { passive: true });

  const secHead = (n, title, sub = '', acts = '') => `<div class="sec-h"><h2>${esc(title)}</h2>${sub ? `<p>${sub}</p>` : '<p></p>'}${acts ? `<div class="acts">${acts}</div>` : ''}</div>`;
  const skelRows = (n = 6) => Array.from({ length: n }, () => '<div class="sk sk-row"></div>').join('');
  const skelCards = (n = 6) => `<div class="hscroll">${Array.from({ length: n }, () => '<div><div class="sk sk-card"></div></div>').join('')}</div>`;
  const errBox = (e) => `<div class="empty"><b>That didn't load</b>${esc(e?.message || 'Something went wrong')}<div class="more-row"><button class="btn ghost" data-retry>Try again</button></div></div>`;
  const emptyBox = (title, text = '') => `<div class="empty"><b>${esc(title)}</b>${esc(text)}</div>`;

  const card = ({ href, img, seed, title, sub, play }) => `<a class="card" href="${href}"><div class="sleeve"><span class="disc"></span>${art(img, seed || title)}${play ? `<button class="card-play" data-cplay="${esc(play)}" aria-label="Play ${esc(title)}">${ic('play')}</button>` : ''}</div><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</a>`;
  const mosaic = (tracks) => {
    const arts = [...new Set(tracks.map((t) => t.art).filter(Boolean))].slice(0, 4);
    if (arts.length < 4) return `<div class="mosaic one">${arts[0] ? art(arts[0], 'x') : ph(tracks[0]?.t || 'Playlist')}</div>`;
    return `<div class="mosaic">${arts.map((a) => art(a, 'x')).join('')}</div>`;
  };
  const listCard = (l) => `<a class="card" href="#/list/${esc(l.id)}"><div class="sleeve"><span class="disc"></span>${l.tracks.length ? mosaic(l.tracks) : ph(l.name)}${l.tracks.length ? `<button class="card-play" data-cplay="list:${esc(l.id)}" aria-label="Play">${ic('play')}</button>` : ''}</div><b>${esc(l.name)}</b><small>${l.tracks.length} song${l.tracks.length === 1 ? '' : 's'}</small></a>`;
  const artistCard = (a) => `<a class="artist" href="#/artist/${esc(a.id)}">${art(a.pic, a.name)}<b>${esc(a.name)}</b>${a.fans ? `<small>${fans(a.fans)} fans</small>` : ''}</a>`;
  const mixCard = (m) => `<a class="mix" href="#/mix/${m.id}" style="background:linear-gradient(160deg,${m.c[0]},${m.c[1]})"><span class="tag">${esc(m.g.join(' · '))}</span><span><b>${esc(m.name)}</b><br><small>${esc(m.d)}</small></span><button class="card-play" data-cplay="mix:${m.id}" aria-label="Play ${esc(m.name)}">${ic('play')}</button></a>`;

  /* ================= player engine ================= */
  const audio = new Audio();
  audio.preload = 'auto';
  audio.playsInline = true;
  // iPad / iPhone (iPadOS reports itself as a Mac with a touch screen)
  const IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  // iOS only lets a page play sound that starts from a tap. Songs start after a short lookup, so the
  // audio element is switched on during the tap itself (a silent blip); after that iOS lets it play.
  const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
  let audioUnlocked = false;
  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    try { if (!audio.getAttribute('src')) { audio.src = SILENT; const p = audio.play(); if (p && p.catch) p.catch(() => { audioUnlocked = false; }); } } catch { audioUnlocked = false; }
  }
  addEventListener('pointerdown', unlockAudio, { capture: true, passive: true });
  addEventListener('touchend', unlockAudio, { capture: true, passive: true });
  const P = { q: [], i: -1, orig: null, shuffle: store.get('shuf', false), repeat: store.get('rep', 0), mode: null, cur: null, eng: 'audio', tok: 0, label: '', playing: false };
  function stopEngines() {
    audio.pause(); audio.removeAttribute('src'); audio.load();
    try { ytNP?.stopVideo?.(); } catch { /* ignore */ }
    if ($('#npArtBox')) $('#npArtBox').hidden = false;
    if ($('#npVid')) $('#npVid').hidden = true;
  }
  const real = () => P.eng === 'audio' && audio.getAttribute('src') !== SILENT;   // ignore the silent unlock blip
  audio.addEventListener('playing', () => { if (real()) { setPlaying(true); setBuffering(false); } });
  audio.addEventListener('pause', () => { if (real()) setPlaying(false); });
  audio.addEventListener('waiting', () => { if (real()) setBuffering(true); });
  audio.addEventListener('ended', () => { if (real()) onEnded(); });
  audio.addEventListener('error', () => {
    if (P.eng !== 'audio' || !audio.getAttribute('src') || audio.getAttribute('src') === SILENT) return;
    // a full-song stream that won't load: try the next way to play the SAME song
    if (P.onAudioFail) { const f = P.onAudioFail; P.onAudioFail = null; f(); return; }
    setBuffering(false); failSkip('Track failed — skipping');
  });
  const normAudio = (v) => String(v || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  async function findAudiusVersion(t) {
    const found = await A('/tracks/search?query=' + enc([t.a, t.t].filter(Boolean).join(' ')) + '&limit=25');
    const title = normAudio(t.t), artist = normAudio(t.a);
    let best = null, scoreBest = 0;
    for (const x of found || []) {
      const xt = normAudio(x.title), xa = normAudio(x.user?.name);
      const titleOK = xt === title || xt.includes(title) || title.includes(xt);
      const artistOK = !artist || xa === artist || xa.includes(artist) || artist.includes(xa);
      const score = (xt === title ? 5 : titleOK ? 3 : 0) + (artistOK ? 3 : 0) + (x.is_streamable === false ? -10 : 0);
      if (score > scoreBest) { best = x; scoreBest = score; }
    }
    return scoreBest >= 6 ? best : null;
  }
  async function playAudioSource(url, tok, onFail) {
    if (tok !== P.tok) return;
    P.onAudioFail = onFail || null;
    P.eng = 'audio'; audio.src = url;
    try { await audio.play(); } catch { if (tok === P.tok) { setBuffering(false); setPlaying(false); } }
  }

  /* --- YouTube engine: catalogue songs play from their official uploads (like aa-games-hub) --- */
  const YTHOSTS = ['https://pipedapi.private.coffee', 'https://pipedapi.ducks.party', 'https://pipedapi.kavin.rocks', 'https://pipedapi.adminforge.de'];
  // A second, separate family of free lookup servers (Invidious). These volunteer servers come and
  // go, so both families are asked at the same time and the first right answer wins.
  const INVHOSTS = ['https://inv.nadeko.net', 'https://invidious.nerdvpn.de', 'https://invidious.f5.si', 'https://inv.tux.pizza', 'https://invidious.privacyredirect.com'];
  // Optional, most reliable: a free YouTube Data API key (Google Cloud console → YouTube Data API v3 →
  // Create API key, then restrict it to the website zz-games.github.io). Leave empty to skip.
  const YT_KEY = 'AIzaSyCZ2vIxFir0cgT1RdAMeow60_IsPGfIJX8';
  // v2: older lookups could match the wrong song, so they're dropped
  try { localStorage.removeItem('zzs:ytv'); } catch { /* ignore */ }
  // Ask every lookup server at once and take the first good answer (one slow or dead server
  // used to hold a song up for 9 seconds before the next was tried). The fastest is tried first next time.
  let pipedBest = store.get('pipedBest', '');
  function piped(path, good) {
    const hosts = pipedBest && YTHOSTS.includes(pipedBest) ? [pipedBest, ...YTHOSTS.filter((h) => h !== pipedBest)] : YTHOSTS;
    const ctl = new AbortController();
    const kill = setTimeout(() => ctl.abort(), 8000);
    const one = (host, i) => new Promise((res, rej) => {
      // give the remembered fastest server a short head start, then ask the rest
      setTimeout(() => {
        fetch(host + path, { signal: ctl.signal })
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
          .then((j) => (good(j) ? res([j, host]) : rej(new Error('empty'))))
          .catch(rej);
      }, i === 0 || !pipedBest ? 0 : 350);
    });
    return Promise.any(hosts.map(one))
      .then(([j, host]) => { if (host !== pipedBest) { pipedBest = host; store.set('pipedBest', host); } return j; })
      .catch(() => null)
      .finally(() => { clearTimeout(kill); ctl.abort(); });
  }
  const ytc = store.get('ytv2', {}); // track id → [videoId, savedAt], a persistent lookup cache
  const ytcFail = {};                // track id → time of last failed lookup (memory only)
  const saveYt = () => { const ks = Object.keys(ytc); if (ks.length > 600) for (const k of ks.slice(0, ks.length - 600)) delete ytc[k]; store.set('ytv2', ytc); };
  // Strip the noise uploads add around a song title: (Official Video), [Lyrics], feat. credits, etc.
  const songName = (v) => normAudio(String(v || '')
    .replace(/[([](?:[^)\]]*?)(?:feat|ft\.|with |official|lyric|audio|video|visuali[sz]er|remaster|explicit|clean|hd|4k|mv)[^)\]]*[)\]]/gi, ' ')
    .replace(/\b(?:feat|ft)\.?\s.*$/i, ' ')
    .replace(/\b(?:official|music video|lyric video|lyrics?|audio|visuali[sz]er|hd|4k)\b/gi, ' '));
  const ALT = /\b(remix|cover|live|sped up|slowed|reverb|nightcore|karaoke|instrumental|8d|acoustic|edit|version|mashup|bass boosted)\b/i;
  function pickVideo(items, t) {
    const want = songName(t.t), wantA = normAudio(t.a), firstA = normAudio(String(t.a || '').split(/,|&| x | feat/i)[0]);
    if (!want) return null;
    const wd = t.d || 0, altOK = ALT.test(t.t);
    let best = null, bs = -1;
    for (const x of items.slice(0, 10)) {
      const raw = x.title || '', who = normAudio((x.uploader || x.uploaderName || '').replace(/\s*-\s*topic$/i, ''));
      if (!altOK && ALT.test(raw)) continue;                         // a remix / cover / live take isn't the song
      let xt = songName(raw);
      for (const a of [wantA, firstA]) if (a) xt = xt.replace(a, ' ').replace(/\s+/g, ' ').trim();   // "Drake - Hotline Bling" → "hotline bling"
      const exact = xt === want;
      const close = !exact && want.length >= 4 && (xt.startsWith(want + ' ') || xt.endsWith(' ' + want) || xt.includes(' ' + want + ' '));
      if (!exact && !close) continue;                                // the title has to be this song
      const artistOK = !!firstA && (who.includes(firstA) || normAudio(raw).includes(firstA));
      const xd = Math.round(x.duration || 0);
      if (wd && xd && Math.abs(xd - wd) > Math.max(20, wd * .15)) continue;   // way off on length: different track
      if (!artistOK && !(exact && wd && xd && Math.abs(xd - wd) <= 6)) continue;
      const sc = (exact ? 6 : 3) + (artistOK ? 4 : 0) + (/topic$/i.test(x.uploader || x.uploaderName || '') ? 1 : 0) + (wd && xd ? Math.max(0, 2 - Math.abs(xd - wd) / 5) : 0);
      if (sc > bs) { bs = sc; best = x; }
    }
    return best;
  }
  // first good JSON answer from any of these addresses
  function raceJson(urls, good, ms = 8000) {
    const ctl = new AbortController();
    const kill = setTimeout(() => ctl.abort(), ms);
    return Promise.any(urls.map((u) => fetch(u, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((j) => (good(j) ? j : Promise.reject(new Error('empty'))))))
      .catch(() => null)
      .finally(() => { clearTimeout(kill); ctl.abort(); });
  }
  const unEntity = (h) => { const d = document.createElement('textarea'); d.innerHTML = h || ''; return d.value; };
  const ytPending = new Map();   // lookups in progress, shared by "play" and "get ready"
  function ytResolve(t) {
    const hit = ytc[t.id];
    if (hit && Date.now() - hit[1] < 30 * 864e5) return Promise.resolve(hit[0]);
    if (ytcFail[t.id] && Date.now() - ytcFail[t.id] < 10 * 60e3) return Promise.resolve(null);
    if (ytPending.has(t.id)) return ytPending.get(t.id);
    const words = [t.a, songName(t.t) || t.t].filter(Boolean).join(' '), q = enc(words);
    // each source answers with its own list; only a video that is really this song counts
    const pickOrFail = (items) => {
      const best = items.length ? pickVideo(items, t) : null;
      const v = best ? (String(best.url).split('v=')[1] || '').split('&')[0] : '';
      return v || Promise.reject(new Error('no match'));
    };
    const sources = [
      piped('/search?q=' + q + '&filter=music_songs', (j) => (j.items || []).some((x) => x.url && x.type === 'stream'))
        .then((j) => pickOrFail(j ? (j.items || []).filter((x) => x.url && x.type === 'stream') : [])),
      // the "songs" list often misses the real upload (Hotline Bling only had covers there), so
      // the normal video search is asked at the same time
      piped('/search?q=' + q + '&filter=videos', (j) => (j.items || []).some((x) => x.url && x.type === 'stream'))
        .then((j) => pickOrFail(j ? (j.items || []).filter((x) => x.url && x.type === 'stream') : [])),
      raceJson(INVHOSTS.map((h) => h + '/api/v1/search?type=video&q=' + q), (j) => Array.isArray(j) && j.some((x) => x.videoId))
        .then((j) => pickOrFail((j || []).filter((x) => x.videoId).map((x) => ({ url: '/watch?v=' + x.videoId, type: 'stream', title: x.title, uploader: x.author, duration: x.lengthSeconds })))),
    ];
    // The YouTube key has a daily limit (about 100 searches), so it's the backup: it's only used
    // when the free servers fail or haven't answered within 2.5 seconds.
    const viaKey = () => fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=' + q + '&key=' + YT_KEY, { signal: AbortSignal.timeout(8000) })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((j) => pickOrFail((j.items || []).map((x) => ({ url: '/watch?v=' + x.id.videoId, type: 'stream', title: unEntity(x.snippet.title), uploader: unEntity(x.snippet.channelTitle), duration: 0 }))));
    if (YT_KEY) {
      const free = Promise.any(sources);
      sources.push(Promise.race([free.then(() => 'done', () => 'failed'), new Promise((r) => setTimeout(() => r('slow'), 2500))])
        .then((why) => (why === 'done' ? Promise.reject(new Error('not needed')) : viaKey())));
    }
    const job = Promise.any(sources)
      .then((v) => { ytc[t.id] = [v, Date.now()]; saveYt(); return v; })
      .catch(() => { ytcFail[t.id] = Date.now(); return null; })
      .finally(() => ytPending.delete(t.id));
    ytPending.set(t.id, job);
    return job;
  }
  // The song's audio as a plain stream, for the normal <audio> player (iPad/iPhone, or when the
  // YouTube player won't start). iOS plays AAC (audio/mp4), so that format is preferred.
  const streamCache = new Map();   // videoId → [url, time]; stream links stay good for a few hours
  function ytAudio(v) {
    const c = streamCache.get(v);
    if (c && Date.now() - c[1] < 2 * 3600e3) return Promise.resolve(c[0]);
    const pickFrom = (j) => {
      const list = (j.audioStreams || []).filter((x) => x.url && !x.videoOnly);
      const mp4 = list.filter((x) => /mp4|m4a/i.test((x.mimeType || '') + (x.format || ''))).sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
      const pick = mp4[0] || (IOS ? null : list.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0]);
      return pick ? pick.url : null;
    };
    return piped('/streams/' + v, (j) => !!pickFrom(j)).then((j) => {
      const url = j ? pickFrom(j) : null;
      if (url) streamCache.set(v, [url, Date.now()]);
      return url;
    });
  }
  // Get a song ready before it's played: find its video (and on iPad/iPhone its audio stream)
  function prepare(t) {
    if (!t || t.src !== 'dz') return;
    ytResolve(t).then((v) => { if (v && IOS) ytAudio(v); }).catch(() => {});
  }
  // Play the full song as plain audio; if that fails, YouTube's player, then the other sources
  // the first full-song stream that responds within a few seconds (a stuck one is skipped)
  async function workingStream(v) {
    const quick = await Promise.race([ytAudio(v), new Promise((r) => setTimeout(() => r(null), 2500))]);
    const list = [quick, ...INVHOSTS.slice(0, 2).map((h) => h + '/latest_version?id=' + encodeURIComponent(v) + '&itag=140&local=true')].filter(Boolean);
    const probe = (u) => new Promise((res) => {
      const ctl = new AbortController(), kill = setTimeout(() => { ctl.abort(); res(false); }, 4000);
      fetch(u, { mode: 'no-cors', headers: { Range: 'bytes=0-1' }, signal: ctl.signal })
        .then(() => { clearTimeout(kill); ctl.abort(); res(true); }, () => { clearTimeout(kill); res(false); });
    });
    for (const u of list) if (await probe(u)) return u;
    return null;
  }
  async function playFullAudio(v, tok, thenTry) {
    // the stream from the first family of servers (if it answers quickly), then audio passed through
    // the second family's servers (Invidious "local" mode, AAC itag 140)
    const quick = await Promise.race([ytAudio(v), new Promise((r) => setTimeout(() => r(null), 2500))]);
    if (tok !== P.tok) return true;
    const list = [quick, ...INVHOSTS.slice(0, 2).map((h) => h + '/latest_version?id=' + encodeURIComponent(v) + '&itag=140&local=true')].filter(Boolean);
    if ($('#npArtBox')) $('#npArtBox').hidden = false;
    if ($('#npVid')) $('#npVid').hidden = true;
    let i = 0;
    const tryNext = async () => {
      if (tok !== P.tok) return;
      if (i >= list.length) { thenTry(); return; }
      const url = list[i++];
      // a stream that hasn't produced any sound data in 5s counts as failed: move on
      // (the timer starts first: playing a stuck stream never finishes on its own)
      setTimeout(() => {
        if (tok === P.tok && P.eng === 'audio' && audio.getAttribute('src') === url && audio.readyState < 2 && P.onAudioFail === tryNext) {
          P.onAudioFail = null; tryNext();
        }
      }, 5000);
      playAudioSource(url, tok, tryNext);
    };
    await tryNext();
    return true;
  }
  const ytForget = (t) => { if (t && ytc[t.id]) { delete ytc[t.id]; saveYt(); } if (t) ytcFail[t.id] = Date.now(); };
  let ytApi = null, ytNP = null, ytN = 0;
  const ytCur = () => ytNP;
  function loadYT() {
    if (ytApi) return ytApi;
    ytApi = new Promise((res, rej) => {
      if (window.YT?.Player) return res();
      window.onYouTubeIframeAPIReady = () => res();
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.onerror = () => { ytApi = null; rej(new Error('YouTube blocked')); };
      document.head.append(s);
      setTimeout(() => { if (!window.YT?.Player) { ytApi = null; rej(new Error('YouTube took too long')); } }, 15000);
    });
    return ytApi;
  }
  // One YouTube player is made ahead of time and reused for every song: songs start faster, and on
  // iPad/iPhone a song can be started inside the tap itself (iOS only allows sound that starts from a tap).
  let ytReadyP = null, ytWant = null;
  function ytPlayer() {
    if (ytReadyP) return ytReadyP;
    ytReadyP = loadYT().then(() => new Promise((res, rej) => {
      const host = $('#npVid');
      if (!host) { rej(new Error('no player box')); return; }
      host.innerHTML = '<div id="ytp"></div>';
      const p = new YT.Player('ytp', {
        host: 'https://www.youtube-nocookie.com', width: '100%', height: '100%',
        playerVars: { autoplay: 0, controls: 0, rel: 0, playsinline: 1, iv_load_policy: 3, modestbranding: 1, disablekb: 1, fs: 1 },
        events: { onReady: () => { ytNP = p; res(p); }, onStateChange: (e) => ytState(e.data), onError: () => ytErr() },
      });
      setTimeout(() => rej(new Error('YouTube took too long')), 15000);
    })).catch((e) => { ytReadyP = null; throw e; });
    return ytReadyP;
  }
  function ytState(d) {
    const w = ytWant;
    if (!w || w.tok !== P.tok || w.done) return;
    if (d === 1) {
      if (!w.started) { w.started = true; w.onStart?.(); }
      P.sysPaused = false;
      setBuffering(false); setPlaying(true);
    } else if (!w.started) {
      // not really playing yet (the preview may still be on): ignore
    } else if (d === 2) {
      // paused by the browser for leaving the tab (not by you): ask it to keep going, and pick up
      // again the moment you come back
      if (document.hidden && Date.now() - (P.wePaused || 0) > 1500) {
        P.sysPaused = true;
        // only once per time away, so pausing from the lock screen still works
        if (!P.hideRetried) { P.hideRetried = true; setTimeout(() => { try { if (P.sysPaused && P.eng === 'yt') ytNP.playVideo(); } catch { /* ignore */ } }, 250); }
        setPlaying(false);
        return;
      }
      setPlaying(false);
    } else if (d === 0) { if (P.mode === 'song') onEnded(); else setPlaying(false); }
    else if (d === 3) setBuffering(true);
  }
  // back on the tab after the browser paused the song: carry on
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { P.hideRetried = false; return; }
    if (!P.sysPaused) return;
    P.sysPaused = false;
    try { if (P.eng === 'yt' && P.mode) ytNP.playVideo(); } catch { /* ignore */ }
  });
  function ytErr() { const w = ytWant; if (w && w.tok === P.tok) { ytForget(P.cur); w.fail(); } }
  // start video v; onFail runs if it errors or doesn't start within `wait` ms
  function ytStart(v, tok, o) {
    const w = { tok, v, started: false, done: false, onStart: o.onStart };
    w.fail = () => { if (w.done) return; w.done = true; if (ytWant === w) { try { ytNP?.stopVideo?.(); } catch { /* ignore */ } } o.onFail?.(); };
    ytWant = w;
    const go = (p) => {
      if (tok !== P.tok || ytWant !== w || w.done) return;
      try { p.setVolume(Math.round((S.cfg.muted ? 0 : S.cfg.vol) * 100)); p.unMute(); p.loadVideoById(v); } catch { w.fail(); }
    };
    if (ytNP) go(ytNP); else ytPlayer().then(go, () => w.fail());
    setTimeout(() => { if (!w.started && tok === P.tok) w.fail(); }, o.wait || 7000);
  }
  function showVid(on) {
    if ($('#npArtBox')) $('#npArtBox').hidden = on;
    if ($('#npVid')) $('#npVid').hidden = !on;
  }
  async function playYT(v, tok) {
    if (tok !== P.tok) return;
    P.eng = 'yt';
    showVid(true); setBuffering(true); setPlaying(true);
    ytStart(v, tok, {
      wait: 7000,
      // YouTube's player wouldn't start: try the song as a plain stream, then the other sources
      onFail: () => { if (tok !== P.tok) return; stopEngines(); P.eng = 'audio'; playFullAudio(v, tok, () => playFallback(P.cur, tok)); },
    });
  }
  async function playTrack(t) {
    unlockAudio();   // still inside the tap that started this song
    const tok = ++P.tok;
    P.cur = t; P.mode = 'song';
    dispatchEvent(new Event('zzmusic:track'));
    stopEngines();
    setNow({ title: t.t, sub: t.a, subHref: t.src === 'ia' ? t.archiveUrl : (t.aid ? '#/artist/' + t.aid : ''), art: t.big || t.art, small: t.art, seed: t.t });
    setBuffering(true); markCurrent(); renderQueue(); bumpTaste(t);
    remember({ k: 'song', id: t.id, t: t.t, s: t.a, img: t.art, ref: slim(t) });
    // while this one starts, quietly find the next two so skipping is instant
    setTimeout(() => { if (tok === P.tok) [P.q[P.i + 1], P.q[P.i + 2]].forEach(prepare); }, 1500);
    if (t.src === 'au') { await playAudioSource(AU + '/tracks/' + t.id.slice(2) + '/stream?' + APP, tok); return; }
    if (t.src === 'ia') { await playAudioSource(IA + '/download/' + enc(t.id.slice(2)) + '/' + t.file, tok); return; }
    if (t.src !== 'dz') { await playFallback(t, tok); return; }
    // Already found (played before, or looked up ahead of time): the full song starts right away
    const hit = ytc[t.id];
    if (hit && Date.now() - hit[1] < 30 * 864e5) { await playFull(hit[0], tok); return; }
    // Not found yet: sound starts the instant you tap (the preview) while the full song is found,
    // then it fades over to the full song from the start
    const previewing = !!t.pre;
    if (previewing) playAudioSource(t.pre, tok);
    const v = await ytResolve(t);
    if (tok !== P.tok) return;
    if (v && IOS && previewing) {
      // iPad / iPhone: keep the preview playing until a full-song stream actually answers, then switch
      const url = await workingStream(v);
      if (tok !== P.tok) return;
      if (url) { await switchTo(() => playAudioSource(url, tok, () => playFallback(t, tok)), tok, true); return; }
      // no plain stream answered: try YouTube's player while the preview keeps playing
      const ok = await new Promise((res) => ytStart(v, tok, {
        wait: 6000,
        onStart: () => { P.onAudioFail = null; P.eng = 'yt'; audio.pause(); audio.removeAttribute('src'); audio.load(); applyVol(); showVid(true); res(true); },
        onFail: () => res(false),
      }));
      if (tok !== P.tok || ok) return;
    } else if (v) { await switchTo(() => playFull(v, tok), tok, previewing); return; }
    const alt = await findFullAlt(t, tok);   // the full song somewhere else; the preview keeps playing meanwhile
    if (tok !== P.tok) return;
    if (alt) { await switchTo(alt, tok, previewing); return; }
    if (!previewing) failSkip('Couldn’t find a playable version of “' + t.t + '”', tok);
  }
  async function playFull(v, tok) {
    await playYT(v, tok);
  }
  // quick fade out of the preview, then start the full song
  async function switchTo(start, tok, previewing) {
    if (previewing && P.eng === 'audio' && !audio.paused && !IOS) {
      const from = audio.volume;
      for (let k = 1; k <= 6 && tok === P.tok; k++) { audio.volume = from * (1 - k / 6); await new Promise((r) => setTimeout(r, 40)); }
    }
    if (tok !== P.tok) return;
    P.onAudioFail = null;
    stopEngines(); applyVol();
    await start();
  }
  async function findFullAlt(t, tok) {
    try {
      const m = await findAudiusVersion(t);
      if (m) return () => playAudioSource(AU + '/tracks/' + m.id + '/stream?' + APP, tok);
    } catch { /* try Internet Archive */ }
    try {
      const a = await findArchiveVersion(t);
      if (a) return () => { setNow({ title: t.t, sub: t.a, subHref: a.archiveUrl, art: t.big || t.art, small: t.art, seed: t.t }); return playAudioSource(IA + '/download/' + enc(a.id.slice(2)) + '/' + a.file, tok); };
    } catch { /* none */ }
    return null;
  }
  // Other places to find the same song, quietly, in order: Audius, Internet Archive, the 30s preview
  async function playFallback(t, tok) {
    if (!t || tok !== P.tok) return;
    try {
      const match = await findAudiusVersion(t);
      if (tok !== P.tok) return;
      if (match) { await playAudioSource(AU + '/tracks/' + match.id + '/stream?' + APP, tok); return; }
    } catch { /* try Internet Archive next */ }
    try {
      const archiveMatch = await findArchiveVersion(t);
      if (tok !== P.tok) return;
      // keep a link to the source page (the license asks for credit) without announcing it
      if (archiveMatch) { setNow({ title: t.t, sub: t.a, subHref: archiveMatch.archiveUrl, art: t.big || t.art, small: t.art, seed: t.t }); await playAudioSource(IA + '/download/' + enc(archiveMatch.id.slice(2)) + '/' + archiveMatch.file, tok); return; }
    } catch { /* fall back to the short preview */ }
    if (tok !== P.tok) return;
    if (t.pre) { await playAudioSource(t.pre, tok); return; }
    if (tok === P.tok) failSkip('Couldn’t find a playable version of “' + t.t + '”', tok);
  }

  function playList(list, start = 0, { shuffle = false, label = '' } = {}) {
    list = list.filter(Boolean).map(slim);
    if (!list.length) return;
    if (shuffle) { setShuffle(true, false); start = (Math.random() * list.length) | 0; }
    P.orig = list.slice(); P.label = label;
    if (P.shuffle) { const first = list[start]; list = [first, ...shuffled(list.filter((_, k) => k !== start))]; start = 0; }
    P.q = list; P.i = start;
    playTrack(P.q[P.i]);
  }
  function setShuffle(on, reorder = true) {
    P.shuffle = on; store.set('shuf', on);
    if (reorder && P.mode === 'song' && P.q.length) {
      const cur = P.q[P.i];
      if (on) P.q = [...P.q.slice(0, P.i + 1), ...shuffled(P.q.slice(P.i + 1))];
      else if (P.orig) { const k = P.orig.findIndex((x) => x.id === cur?.id); if (k >= 0) { P.q = P.orig.slice(); P.i = k; } }
      renderQueue();
    }
    paintModes();
  }
  function cycleRepeat() { P.repeat = (P.repeat + 1) % 3; store.set('rep', P.repeat); paintModes(); toast(['Repeat off', 'Repeating the queue', 'Repeating this song'][P.repeat]); }

  async function similarTo(t, exclude = []) {
    const ex = new Set(exclude.map((x) => x.id));
    try {
      let list;
      if (t?.aid?.startsWith('dz')) list = (await M(`recs?a=${t.aid}&n=40`)).tracks;
      else if (t?.src === 'au') list = (await A(`/tracks/trending?time=week&limit=60${t.g ? '&genre=' + enc(t.g) : ''}`)).map(auTrack);
      else list = (await M('chart')).tracks;
      return shuffled(list.filter((x) => !ex.has(x.id))).slice(0, 15);
    } catch { return []; }
  }
  let sleepT = null, sleepEnd = false;
  async function next(auto = false) {
    if (P.mode !== 'song') return;
    if (auto && sleepEnd) { sleepEnd = false; paintSleep(false); setPlaying(false); toast('Sleep timer — stopped'); return; }
    if (auto && P.repeat === 2) { playTrack(P.cur); return; }
    if (P.i < P.q.length - 1) { P.i++; playTrack(P.q[P.i]); return; }
    if (P.repeat === 1 && P.q.length) { P.i = 0; playTrack(P.q[0]); return; }
    if (S.cfg.autoplay && P.cur) {
      const tok = P.tok;
      const more = await similarTo(P.cur, P.q);
      if (tok !== P.tok) return;
      if (more.length) { P.q.push(...more); P.orig?.push(...more); P.i++; toast('Keeping it going with similar songs'); playTrack(P.q[P.i]); return; }
    }
    setPlaying(false);
  }
  function prev() {
    if (P.mode !== 'song') return;
    if (position() > 3 || P.i <= 0) { seek(0); return; }
    P.i--; playTrack(P.q[P.i]);
  }
  function onEnded() { next(true); }
  // skip a song that won't play, but stop after a few in a row instead of racing through the queue
  function failSkip(msg, tok = P.tok) {
    setBuffering(false);
    P.fails = (P.fails || 0) + 1;
    if (P.fails >= 4) { P.fails = 0; setPlaying(false); toast('Songs aren’t loading right now. Try again in a bit.'); return; }
    toast(msg);
    setTimeout(() => { if (tok === P.tok) next(true); }, 700);
  }
  async function songRadio(t) {
    toast(`Starting radio from “${t.t}”`);
    const more = await similarTo(t, [t]);
    playList([t, ...more], 0, { label: `Radio · ${t.t}` });
  }
  function playNext(tracks) {
    tracks = tracks.map(slim);
    if (P.mode !== 'song') { playList(tracks); return; }
    P.q.splice(P.i + 1, 0, ...tracks); renderQueue(); toast(tracks.length > 1 ? `${tracks.length} songs play next` : 'Plays next');
  }
  function addToQueue(tracks) {
    tracks = tracks.map(slim);
    if (P.mode !== 'song') { playList(tracks); return; }
    P.q.push(...tracks); P.orig?.push(...tracks); renderQueue(); toast(tracks.length > 1 ? `Added ${tracks.length} songs to the queue` : 'Added to the queue');
  }


  function toggle() {
    if (!P.mode) return;
    if (P.eng === 'yt') {
      try {
        const p = ytCur();
        const st = typeof p.getPlayerState === 'function' ? p.getPlayerState() : -1;
        if (st === 1) { P.wePaused = Date.now(); p.pauseVideo(); return; }
        if (st === 2 || st === 3 || st === 5) { p.playVideo(); return; }
      } catch { /* dead player: rebuild below */ }
      if (P.cur) playTrack(P.cur); // ended (0) or unresponsive: start the song over
      return;
    }
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  }
  function pause() { try { if (P.eng === 'yt') { P.wePaused = Date.now(); ytCur()?.pauseVideo?.(); } else audio.pause(); } catch { /* ignore */ } }
  const position = () => (P.eng === 'yt' ? (ytCur()?.getCurrentTime?.() || 0) : (audio.currentTime || 0));
  const duration = () => {
    if (P.mode !== 'song') return 0;
    if (P.eng === 'yt') { const d = ytCur()?.getDuration?.() || 0; return isFinite(d) && d > 0 ? d : P.cur?.d || 0; }
    const d = audio.duration; return isFinite(d) && d > 0 ? d : P.cur?.d || 0;
  };
  function seek(s) {
    if (P.mode !== 'song') return;
    if (P.eng === 'yt') { try { ytCur()?.seekTo?.(s, true); } catch { /* ignore */ } return; }
    if (isFinite(audio.duration)) audio.currentTime = s;
  }
  function applyVol() {
    audio.volume = S.cfg.muted ? 0 : S.cfg.vol;
    const v = Math.round((S.cfg.muted ? 0 : S.cfg.vol) * 100);
    try { ytNP?.setVolume?.(v); } catch { /* ignore */ }
    $('#vol').value = Math.round(S.cfg.vol * 100); $('#muteBtn').innerHTML = ic(S.cfg.muted || S.cfg.vol === 0 ? 'mute' : 'vol');
  }

  function closePlayer() {
    ++P.tok; stopEngines();
    P.mode = null; P.cur = null; P.q = []; P.i = -1;
    setPlaying(false); setBuffering(false);
    $('#bar').hidden = true; document.body.classList.remove('playing-bar');
    drawer(false);
    markCurrent(); renderQueue();
    dispatchEvent(new Event('zzmusic:closed'));
  }

  /* ================= now-playing UI ================= */
  function setNow({ title, sub, subHref = '', art: big, small, seed, live = false }) {
    $('#barTitle').textContent = title; $('#barSub').textContent = sub;
    $('#npTitle').textContent = title;
    $('#npSub').innerHTML = subHref ? `<a href="${esc(subHref)}">${esc(sub)}</a>` : esc(sub);
    for (const [id, src] of [['#barArt', small || big], ['#npArt', big || small]]) {
      const img = $(id);
      if (src) { img.src = src; img.style.cssText = ''; } else { img.removeAttribute('src'); img.style.cssText = phStyle(seed); }
    }
    $('#bar').classList.toggle('live', live);
    $('#liveTag').textContent = 'On air';
    $('#liveTag').hidden = !live;
    tint(small || big, seed);
    paintNowLike();
    $$('[data-act=shuffle],[data-act=repeat],[data-act=prev],[data-act=next]').forEach((b) => (b.disabled = live));
    ['#npLike', '#npAdd', '#npRadio', '#barLike'].forEach((s) => ($(s).disabled = P.mode !== 'song'));
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title, artist: sub, artwork: big || small ? [{ src: big || small, sizes: '512x512' }] : [] });
    }
  }
  function tint(src, seed) {
    const set = (c) => document.documentElement.style.setProperty('--tint', c);
    set(`hsl(${hash(seed || src) % 360} 55% 50%)`);
    if (!src) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const c = document.createElement('canvas'); c.width = c.height = 10;
        const x = c.getContext('2d'); x.drawImage(img, 0, 0, 10, 10);
        const d = x.getImageData(0, 0, 10, 10).data;
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) { const l = d[i] + d[i + 1] + d[i + 2]; if (l < 60 || l > 700) continue; r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
        if (n) set(`rgb(${(r / n) | 0},${(g / n) | 0},${(b / n) | 0})`);
      } catch { /* image not CORS-readable */ }
    };
    img.src = src;
  }
  function setPlaying(on) {
    P.playing = on;
    if (on) {
      P.fails = 0;
      $('#bar').hidden = false;
      document.body.classList.add('playing-bar');
      paintPanel();
    } else if (!P.mode) {
      // nothing loaded: no bar. Paused: keep it, so you can press play again from any page.
      $('#bar').hidden = true;
      document.body.classList.remove('playing-bar');
    }
    document.body.classList.toggle('paused', !on);
    $$('[data-act=toggle]').forEach((b) => (b.innerHTML = ic(on ? 'pause' : 'play')));
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = on ? 'playing' : 'paused';
  }
  const setBuffering = (on) => document.body.classList.toggle('buffering', on);
  function showPlayer() { $('#bar').hidden = false; document.body.classList.add('playing-bar'); paintPanel(); }
  function paintModes() {
    $$('[data-act=shuffle]').forEach((b) => b.classList.toggle('on', P.shuffle));
    $$('[data-act=repeat]').forEach((b) => { b.classList.toggle('on', P.repeat > 0); b.innerHTML = ic(P.repeat === 2 ? 'repeat1' : 'repeat'); });
  }
  function paintNowLike() {
    const on = !!(P.cur && isLiked(P.cur));
    ['#npLike', '#barLike'].forEach((s) => $(s).classList.toggle('on', on));
  }
  function paintPanel() { $('#panelBtn').classList.toggle('on', $('#np').classList.contains('open')); }
  function drawer(on) {
    $('#np').classList.toggle('open', on);
    $('#npScrim').classList.toggle('on', on);
    paintPanel();
  }
  function paintSleep(on) { $('#sleepBtn').classList.toggle('on', on); }
  function markCurrent() {
    $$('.row.on').forEach((r) => r.classList.remove('on'));
    if (P.mode === 'song' && P.cur) $$(`.row[data-tid="${CSS.escape(P.cur.id)}"]`).forEach((r) => r.classList.add('on'));
  }
  function renderQueue() {
    for (const k of LISTS.keys()) if (k.startsWith('Q')) LISTS.delete(k);
    const box = $('#npQueue');
    $('#qClear').hidden = !(P.mode === 'song' && P.q.length > P.i + 1);
    if (P.mode !== 'song') { $('#qLabel').textContent = 'Up next'; box.innerHTML = ''; return; }
    const up = P.q.slice(P.i + 1);
    $('#qLabel').textContent = P.label ? `Up next · ${P.label}` : 'Up next';
    box.innerHTML = up.length ? rows(up, { compact: true, pfx: 'Q', drag: true, ctx: 'queue' }) : `<p class="note">${S.cfg.autoplay ? 'Similar songs will keep playing after this one.' : 'Nothing queued.'}</p>`;
    const ol = $('ol', box);
    if (ol) sortable(ol, (from, to) => { const base = P.i + 1; const [x] = P.q.splice(base + from, 1); P.q.splice(base + to, 0, x); renderQueue(); });
  }

  // progress ticker
  let dragging = false;
  setInterval(() => {
    if (!P.mode || P.mode !== 'song') return;
    const d = duration(), c = position();
    const pct = d ? Math.min(1, c / d) : 0;
    if (!dragging) { $('#seek').value = $('#npSeek').value = pct * 1000; $('#seekFill').style.width = pct * 100 + '%'; }
    $('#tCur').textContent = $('#npCur').textContent = fmt(c);
    $('#tDur').textContent = $('#npDur').textContent = fmt(d);
  }, 250);
  for (const s of ['#seek', '#npSeek']) {
    $(s).addEventListener('input', (e) => { dragging = true; $('#seekFill').style.width = e.target.value / 10 + '%'; $('#tCur').textContent = $('#npCur').textContent = fmt((e.target.value / 1000) * duration()); });
    $(s).addEventListener('change', (e) => { seek((e.target.value / 1000) * duration()); dragging = false; });
  }

  /* ================= likes, playlists, follows ================= */
  function toggleLike(t) {
    if (!t) return;
    if (isLiked(t)) { S.liked = S.liked.filter((x) => x.id !== t.id); toast('Removed from Liked songs'); }
    else { S.liked.unshift(slim(t)); toast('Saved to Liked songs'); }
    save('liked');
    $$(`[data-tid="${CSS.escape(t.id)}"] [data-like]`).forEach((b) => b.classList.toggle('on', isLiked(t)));
    paintNowLike(); paintSide();
  }
  function newList(name, tracks = []) {
    const l = { id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name: name || `Playlist ${S.lists.length + 1}`, tracks: tracks.map(slim), at: Date.now() };
    S.lists.unshift(l); save('lists'); paintSide();
    return l;
  }
  function addToList(id, tracks) {
    const l = S.lists.find((x) => x.id === id);
    if (!l) return;
    let n = 0;
    for (const t of tracks) if (!l.tracks.some((x) => x.id === t.id)) { l.tracks.push(slim(t)); n++; }
    save('lists'); paintSide();
    toast(n ? `Added to ${l.name}` : `Already in ${l.name}`);
  }
  async function createListWith(tracks) {
    const name = await askText('New playlist', `Playlist ${S.lists.length + 1}`, 'Create');
    if (name === null) return null;
    const l = newList(name, tracks);
    toast(tracks.length ? `Created ${l.name}` : `${l.name} is ready`);
    return l;
  }
  const FMETA = new Map();
  const isFollowing = (id) => S.follows.some((f) => f.id === id);
  function followBtn(a) { FMETA.set(a.id, a); const on = isFollowing(a.id); return `<button class="btn ghost${on ? ' on' : ''}" data-follow="${esc(a.id)}">${on ? 'Following' : 'Follow'}</button>`; }
  function toggleFollow(id) {
    const a = FMETA.get(id) || S.follows.find((f) => f.id === id);
    if (!a) return;
    const on = isFollowing(id);
    S.follows = on ? S.follows.filter((f) => f.id !== id) : [{ id, name: a.name, pic: a.pic || '' }, ...S.follows];
    save('follows');
    $$(`[data-follow="${CSS.escape(id)}"]`).forEach((b) => { b.classList.toggle('on', !on); b.textContent = on ? 'Follow' : 'Following'; });
    toast(on ? `Unfollowed ${a.name}` : `Following ${a.name}`);
  }
  function paintSide() { /* playlists live in the Playlists tab */ }

  /* ================= menus ================= */
  const menu = $('#menu');
  let menuCtx = null, menuY = 0;
  function openMenu(anchor, html, ctx) {
    menuCtx = ctx; menu.innerHTML = html; menu.hidden = false; menuY = scrollY;
    const r = anchor.getBoundingClientRect(), mw = menu.offsetWidth, mh = menu.offsetHeight;
    let x = r.right - mw, y = r.bottom + 6;
    if (x < 8) x = 8;
    if (y + mh > innerHeight - 8) y = Math.max(8, r.top - mh - 6);
    menu.style.left = x + 'px'; menu.style.top = y + 'px';
  }
  const closeMenu = () => { menu.hidden = true; menuCtx = null; };
  function trackMenu(anchor, t, opts = {}) {
    const inList = opts.listId && opts.listId !== 'liked';
    openMenu(anchor, `
      <button data-m="next">${ic('next2')}Play next</button>
      <button data-m="queue">${ic('queue')}Add to queue</button>
      <button data-m="radio">${ic('wave')}Start song radio</button>
      <button data-m="add">${ic('plus')}Add to playlist…</button>
      <button data-m="like">${ic('heart')}${isLiked(t) ? 'Remove from Liked' : 'Save to Liked'}</button>
      <hr>
      ${t.aid ? `<a href="#/artist/${esc(t.aid)}" data-m="go">${ic('user')}Go to artist</a>` : ''}
      ${t.alid?.startsWith('dz') ? `<a href="#/album/${esc(t.alid)}" data-m="go">${ic('disc')}Go to album</a>` : ''}
      ${inList ? `<hr><button data-m="rmlist" class="danger">${ic('trash')}Remove from this playlist</button>` : ''}
      ${opts.queueIdx != null ? `<hr><button data-m="rmq" class="danger">${ic('trash')}Remove from queue</button>` : ''}`, { kind: 'track', t, anchor, ...opts });
  }
  function addMenu(anchor, tracks) {
    openMenu(anchor, `<div class="mh">Add ${tracks.length > 1 ? tracks.length + ' songs' : 'to playlist'}</div>
      <button data-m="newlist">${ic('plus')}New playlist</button>${S.lists.length ? '<hr>' : ''}
      ${S.lists.map((l) => `<button data-m="tolist" data-id="${esc(l.id)}">${ic('queue')}${esc(l.name)}</button>`).join('')}`, { kind: 'add', tracks, anchor });
  }
  menu.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-m]');
    if (!b || !menuCtx) return;
    const c = menuCtx, m = b.dataset.m;
    if (m === 'go') { closeMenu(); return; }
    if (m === 'add') { addMenu(c.anchor, [c.t]); return; }
    closeMenu();
    if (m === 'next') playNext([c.t]);
    else if (m === 'queue') addToQueue([c.t]);
    else if (m === 'radio') songRadio(c.t);
    else if (m === 'like') toggleLike(c.t);
    else if (m === 'rmlist') { const l = S.lists.find((x) => x.id === c.listId); if (l) { l.tracks = l.tracks.filter((x) => x.id !== c.t.id); save('lists'); paintSide(); route(); } }
    else if (m === 'rmq') { P.q.splice(P.i + 1 + c.queueIdx, 1); renderQueue(); }
    else if (m === 'newlist') createListWith(c.tracks);
    else if (m === 'tolist') addToList(b.dataset.id, c.tracks);
    else if (m === 'sleep') setSleep(b.dataset.v);
  });
  addEventListener('pointerdown', (e) => { if (!menu.hidden && !menu.contains(e.target) && !e.target.closest('[data-more],#npAdd,#sleepBtn,[data-addall]')) closeMenu(); });
  $('#main').addEventListener('scroll', closeMenu, { passive: true });

  function setSleep(v) {
    clearTimeout(sleepT); sleepT = null; sleepEnd = false;
    if (v === 'end') { sleepEnd = true; toast('Stopping after this song'); }
    else if (+v) { sleepT = setTimeout(() => { pause(); paintSleep(false); toast('Sleep timer — paused'); }, +v * 60e3); toast(`Pausing in ${v} minutes`); }
    else toast('Sleep timer off');
    paintSleep(v !== '0');
  }

  /* ================= drag to reorder ================= */
  function sortable(ol, onMove) {
    let from = null;
    ol.addEventListener('dragstart', (e) => { const li = e.target.closest('li[draggable]'); if (!li) return; from = +li.dataset.i; li.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', ''); });
    ol.addEventListener('dragover', (e) => { if (from == null) return; e.preventDefault(); $$('.drop', ol).forEach((x) => x.classList.remove('drop')); e.target.closest('li[draggable]')?.classList.add('drop'); });
    ol.addEventListener('drop', (e) => { e.preventDefault(); const li = e.target.closest('li[draggable]'); if (li && from != null && +li.dataset.i !== from) onMove(from, +li.dataset.i); from = null; });
    ol.addEventListener('dragend', () => { from = null; $$('.dragging,.drop', ol).forEach((x) => x.classList.remove('dragging', 'drop')); });
  }

  /* ================= router ================= */
  const V = $('#view');
  let VT = 0;
  function parse() {
    const h = location.hash.slice(1) || '/';
    const [path, qs] = h.split('?');
    return { parts: path.split('/').filter(Boolean).map(decodeURIComponent), q: new URLSearchParams(qs || '') };
  }
  const live = (tok) => tok === VT;
  async function route() {
    warmBudget = 6;
    const { parts, q } = parse();
    const tok = ++VT;
    for (const k of LISTS.keys()) if (!k.startsWith('Q')) LISTS.delete(k);
    closeMenu();
    const r = parts[0] || 'home';
    CUR_TAB = { home: 'home', library: 'library', list: 'library' }[r] || '';
    paintChans(CUR_TAB);
    document.body.classList.toggle('m-compact', r !== 'home');
    if (r !== 'search' && MQ.value && document.activeElement !== MQ) MQ.value = '';
    scrollTo({ top: 0, behavior: 'instant' });
    const views = { home: viewHome, search: viewSearch, library: viewLibrary, artist: viewArtist, album: viewAlbum, list: viewList, aplaylist: viewAPlaylist, mix: viewMix, chart: viewChart };
    try { await (views[r] || viewHome)(parts[1], q, tok); }
    catch (e) { if (live(tok)) V.innerHTML = errBox(e); console.error(e); }
    markCurrent();
  }
  addEventListener('hashchange', route);

  /* --- music channel panels (same feel as the homepage hero) --- */
  let CUR_TAB = 'home';
  const CHANS = $$('#mchans .m-panel');
  function paintChans(id) {
    CHANS.forEach((p) => {
      p.classList.toggle('on', p.dataset.nav === id);
      p.classList.toggle('cur', p.dataset.nav === CUR_TAB);
      if (p.dataset.nav === CUR_TAB) p.setAttribute('aria-current', 'page'); else p.removeAttribute('aria-current');
    });
  }
  CHANS.forEach((p) => ['mouseenter', 'focus'].forEach((ev) => p.addEventListener(ev, () => paintChans(p.dataset.nav))));
  $('#mchans').addEventListener('mouseleave', () => paintChans(CUR_TAB));
  $('#mchans').addEventListener('focusout', (e) => { if (!$('#mchans').contains(e.relatedTarget)) paintChans(CUR_TAB); });
  // nav background once scrolled
  const onScroll = () => $('#mnav').classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', () => { onScroll(); if (!menu.hidden && Math.abs(scrollY - menuY) > 60) closeMenu(); }, { passive: true });

  /* --- the hero search box drives the search page --- */
  const MQ = $('#mq');
  let mqDeb;
  const goSearch = (v, remember) => {
    if (remember) rememberSearch(v);
    if (parse().parts[0] !== 'search') { location.hash = '#/search' + (v ? '?q=' + enc(v) : ''); return; }
    history.replaceState(null, '', '#/search' + (v ? '?q=' + enc(v) : ''));
    paintHist(); searchResults(v);
  };
  MQ.addEventListener('input', () => { clearTimeout(mqDeb); mqDeb = setTimeout(() => { const v = MQ.value.trim(); if (v || parse().parts[0] === 'search') goSearch(v); }, 320); });
  MQ.addEventListener('focus', () => { if (!MQ.value && S.searches.length && parse().parts[0] !== 'search') location.hash = '#/search'; });
  $('#mfind').onsubmit = (e) => { e.preventDefault(); clearTimeout(mqDeb); goSearch(MQ.value.trim(), true); };
  MQ.addEventListener('keydown', (e) => { if (e.key === 'Escape') { MQ.value = ''; MQ.blur(); if (parse().parts[0] === 'search') location.hash = '#/'; } });
  const fill = (id, html, tok) => { const el = document.getElementById(id); if (el && live(tok)) el.innerHTML = html; return el; };

  /* ================= views ================= */
  function jumpHTML(n = 8) {
    const items = S.activity.slice(0, n);
    if (!items.length) return '';
    return `<section class="sec">${secHead(1, 'Pick up where you left off', '', '<button class="link" data-clearjump>Clear</button>')}
      <div class="jump">${items.map((a, i) => {
        const label = { song: 'Song', artist: 'Artist', album: 'Album', aplaylist: 'Playlist', mix: 'Mix' }[a.k] || '';
        const inner = `${art(a.img, a.t)}<span><small>${label}</small><b>${esc(a.t)}</b>${a.s ? `<em>${esc(a.s)}</em>` : ''}</span>`;
        const x = `<button class="ib sm x" data-unjump="${i}" aria-label="Remove ${esc(a.t)}">${ic('close')}</button>`;
        return a.k === 'song' ? `<button class="jb" data-jump="${i}">${inner}${x}</button>` : `<a class="jb${a.k === 'artist' ? ' art' : ''}" href="${esc(a.href || '#/')}">${inner}${x}</a>`;
      }).join('')}</div></section>`;
  }

  async function viewHome(_, __, tok) {
    const h = new Date().getHours();
    $('#mGreet').textContent = (h < 5 ? 'Up late' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening') + ' · ' + new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    const seeds = topArtists(5);
    let n = S.activity.length ? 1 : 0;
    V.innerHTML = `
      ${jumpHTML()}
      <section class="sec">${secHead(++n, 'Tuned for you', seeds.length ? `Because you play ${seeds.slice(0, 3).map((s) => esc(s.name)).join(', ')}` : 'Play and like songs — this learns what you’re into', `<button class="btn ghost" id="recNew">${ic('dice')}New picks</button><button class="btn ghost" id="recShuf">${ic('shuffle')}Shuffle</button><button class="btn hot" id="recPlay">${ic('play')}Play</button>`)}<div id="recBox">${skelRows(6)}</div></section>
      <section class="sec">${secHead(++n, 'The chart', 'Top songs worldwide right now', `<button class="btn hot" id="chartPlay">${ic('play')}Play all</button>`)}<div id="chartBox">${skelRows(6)}</div></section>
      <section class="sec">${secHead(++n, 'Artists everyone’s playing')}<div id="artBox">${skelCards(7)}</div></section>
      <section class="sec">${secHead(++n, 'Community playlists', 'Trending on Audius')}<div id="plBox">${skelCards(6)}</div></section>`;


    // recommendations
    let recs = [], recShown = 10;
    const paintRecs = () => fill('recBox', recs.length ? rows(recs.slice(0, recShown)) + (recs.length > recShown ? '<div class="more-row"><button class="btn ghost" id="recMore">Show more</button></div>' : '') : emptyBox('Nothing yet', 'Play a few songs and check back.'), tok);
    const loadRecs = async (fresh) => {
      fill('recBox', skelRows(6), tok);
      try {
        const j = seeds.length ? await M(`recs?a=${seeds.map((s) => s.id).join(',')}&n=40`, fresh) : await M('chart');
        recs = seeds.length ? j.tracks : shuffled(j.tracks).slice(0, 30); recShown = 10; paintRecs();
      } catch (e) { fill('recBox', errBox(e), tok); }
    };
    loadRecs();
    $('#recNew').onclick = () => loadRecs(true);
    $('#recPlay').onclick = () => playList(recs, 0, { label: 'Tuned for you' });
    $('#recShuf').onclick = () => playList(recs, 0, { shuffle: true, label: 'Tuned for you' });
    V.addEventListener('click', (e) => { if (e.target.id === 'recMore') { recShown = recs.length; paintRecs(); markCurrent(); } });

    // chart + artists
    M('chart').then((j) => {
      fill('chartBox', rows(j.tracks.slice(0, 10)) + '<div class="more-row"><a class="btn ghost" href="#/chart">See the full top 50</a></div>', tok);
      fill('artBox', `<div class="hscroll">${j.artists.map(artistCard).join('')}</div>`, tok);
      const b = $('#chartPlay'); if (b) b.onclick = () => playList(j.tracks, 0, { label: 'The chart' });
      markCurrent();
    }).catch((e) => { fill('chartBox', errBox(e), tok); fill('artBox', '', tok); });

    A('/playlists/trending?limit=16').then((list) => {
      fill('plBox', `<div class="hscroll">${list.map((p) => card({ href: `#/aplaylist/${p.id}`, img: p.artwork?.['480x480'] || p.artwork?.['150x150'], title: p.playlist_name, sub: `${p.user?.name || ''}${p.track_count ? ' · ' + p.track_count + ' songs' : ''}`, play: `aplaylist:${p.id}` })).join('')}</div>`, tok);
    }).catch(() => fill('plBox', emptyBox('Couldn’t reach Audius'), tok));
  }

  async function viewChart(_, __, tok) {
    V.innerHTML = `<a class="back" href="#/">${ic('back')}Discover</a><div class="ph-head"><div class="cover">${ph('Top 50')}</div><div><span class="eyebrow">Chart</span><h1>The Top 50</h1><div class="meta">Worldwide · updated daily</div><div class="page-acts"><button class="btn hot" id="pPlay">${ic('play')}Play</button><button class="btn ghost" id="pShuf">${ic('shuffle')}Shuffle</button></div></div></div><div id="cBox">${skelRows(10)}</div>`;
    const j = await M('chart');
    if (!live(tok)) return;
    fill('cBox', rows(j.tracks), tok);
    $('#pPlay').onclick = () => playList(j.tracks, 0, { label: 'Top 50' });
    $('#pShuf').onclick = () => playList(j.tracks, 0, { shuffle: true, label: 'Top 50' });
  }

  /* --- search --- */
  let searchTok = 0;
  function rememberSearch(q) { q = q.trim(); if (!q) return; S.searches = [q, ...S.searches.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 10); save('searches'); }
  function paintHist() {
    const box = $('#sHist'); if (!box) return;
    box.innerHTML = !MQ.value.trim() && S.searches.length ? `<span class="hist-l">Recent</span>${S.searches.map((s, i) => `<button class="chip" data-hs="${esc(s)}">${esc(s)}<span class="x" data-hx="${i}" aria-label="Remove">×</span></button>`).join('')}` : '';
  }
  async function viewSearch(_, q) {
    const query = q.get('q') || '';
    if (document.activeElement !== MQ) MQ.value = query;
    V.innerHTML = `<div class="hist" id="sHist"></div><div id="sRes"></div>`;
    $('#sHist').onclick = (e) => {
      const x = e.target.closest('[data-hx]');
      if (x) { S.searches.splice(+x.dataset.hx, 1); save('searches'); paintHist(); return; }
      const b = e.target.closest('[data-hs]'); if (b) { MQ.value = b.dataset.hs; goSearch(b.dataset.hs, true); }
    };
    paintHist(); searchResults(MQ.value.trim());
  }
  async function searchResults(q) {
    const tok = ++searchTok, box = $('#sRes');
    for (const k of LISTS.keys()) if (!k.startsWith('Q')) LISTS.delete(k);
    if (!q) {
      box.innerHTML = `<section class="sec">${secHead(1, 'Or try')}<div class="chips">${['Taylor Swift', 'Drake', 'Lofi', 'Bad Bunny', 'The Weeknd', 'Kendrick Lamar', 'Billie Eilish', 'Daft Punk', 'Afrobeats', 'Classic rock'].map((s) => `<a class="chip" href="#/search?q=${enc(s)}">${esc(s)}</a>`).join('')}</div></section>`;
      return;
    }
    box.innerHTML = skelRows(8);
    const [cat, au, ia] = await Promise.allSettled([M('search?q=' + enc(q)), A(`/tracks/search?query=${enc(q)}&limit=15`), searchArchiveTracks(q, '', 12)]);
    if (tok !== searchTok) return;
    const j = cat.status === 'fulfilled' ? cat.value : { tracks: [], artists: [], albums: [] };
    const aut = au.status === 'fulfilled' ? (au.value || []).map(auTrack) : [];
    const iat = ia.status === 'fulfilled' ? ia.value : [];
    if (!j.tracks.length && !j.artists.length && !aut.length && !iat.length) {
      box.innerHTML = cat.status === 'rejected' ? errBox(cat.reason) : emptyBox('No matches', 'Check the spelling or try the artist’s name.');
      return;
    }
    const top = j.artists.find((a) => a.name.toLowerCase() === q.toLowerCase()) || j.artists[0];
    let n = 0;
    box.innerHTML = `
      ${top ? `<section class="sec">${secHead(++n, 'Top result')}<a class="jb art" href="#/artist/${esc(top.id)}" style="max-width:420px;padding:12px 30px 12px 12px">${art(top.pic, top.name)}<span><small>Artist</small><b style="font-size:20px;font-family:var(--serif)">${esc(top.name)}</b><em>${fans(top.fans)} fans</em></span></a></section>` : ''}
      ${j.tracks.length ? `<section class="sec">${secHead(++n, 'Songs', '', `<button class="btn hot" id="srPlay">${ic('play')}Play all</button>`)}${rows(j.tracks.slice(0, 20))}</section>` : ''}
      ${j.artists.length ? `<section class="sec">${secHead(++n, 'Artists')}<div class="hscroll">${j.artists.map(artistCard).join('')}</div></section>` : ''}
      ${j.albums.length ? `<section class="sec">${secHead(++n, 'Albums')}<div class="hscroll">${j.albums.map((a) => card({ href: `#/album/${a.id}`, img: a.art, title: a.t, sub: `${a.a}${a.year ? ' · ' + a.year : ''}`, play: `album:${a.id}` })).join('')}</div></section>` : ''}
      ${aut.length ? `<section class="sec">${secHead(++n, 'On Audius', 'Independent uploads')}${rows(aut)}</section>` : ''}
      ${iat.length ? `<section class="sec">${secHead(++n, 'Internet Archive', 'Openly licensed recordings · CC0 / CC BY / CC BY-SA')}${rows(iat)}</section>` : ''}`;
    const sp = $('#srPlay'); if (sp) sp.onclick = () => { rememberSearch(q); playList(j.tracks.slice(0, 20), 0, { label: `Search · ${q}` }); };
    box.addEventListener('click', (e) => { if (e.target.closest('.row,.artist,.card,.jb')) rememberSearch(q); }, { once: true });
    markCurrent();
  }

  /* --- library --- */
  function viewLibrary(_, q) {
    const tab = q.get('tab') || 'playlists';
    const T = [['playlists', 'Playlists'], ['liked', 'Liked songs'], ['artists', 'Artists'], ['history', 'History']];
    let body = '';
    if (tab === 'playlists') {
      body = `<div class="grid">
        <button class="card new-card" data-newlist><div class="sleeve">${ic('plus')}</div><b>New playlist</b><small>Start from scratch</small></button>
        <a class="card" href="#/list/liked"><div class="sleeve"><span class="disc"></span><span class="ph" style="background:linear-gradient(135deg,#ff3d6e,#3b2bd9);width:100%;height:100%;border-radius:6px;position:relative;z-index:1">${ic('heart')}</span>${S.liked.length ? `<button class="card-play" data-cplay="list:liked" aria-label="Play">${ic('play')}</button>` : ''}</div><b>Liked songs</b><small>${S.liked.length} songs</small></a>
        ${S.lists.map(listCard).join('')}</div>`;
    } else if (tab === 'liked') {
      body = S.liked.length ? `<div class="page-acts" style="margin:0 0 14px"><button class="btn hot" data-cplay="list:liked">${ic('play')}Play</button><button class="btn ghost" data-shufflelist="liked">${ic('shuffle')}Shuffle</button></div>${rows(S.liked, { ctx: 'liked' })}` : emptyBox('No liked songs yet', 'Tap the heart on any song to keep it here.');
    } else if (tab === 'artists') {
      body = S.follows.length ? `<div class="grid">${S.follows.map(artistCard).join('')}</div>` : emptyBox('Not following anyone', 'Follow artists from their page to see them here.');
    } else {
      const songs = S.activity.filter((a) => a.k === 'song' && a.ref).map((a) => a.ref);
      body = songs.length ? `<div class="page-acts" style="margin:0 0 14px"><button class="btn ghost" data-clearhist>${ic('trash')}Clear history</button></div>${rows(songs)}` : emptyBox('Nothing played yet');
    }
    V.innerHTML = `<header class="hero"><span class="eyebrow">Library</span><h1>Your <em>playlists</em></h1></header>
      <nav class="tabs">${T.map(([k, l]) => `<a href="#/library?tab=${k}" class="${k === tab ? 'on' : ''}">${l}</a>`).join('')}</nav>${body}`;
  }

  /* --- user playlist / liked --- */
  function viewList(id) {
    const liked = id === 'liked';
    const l = liked ? { id: 'liked', name: 'Liked songs', tracks: S.liked } : S.lists.find((x) => x.id === id);
    if (!l) { V.innerHTML = emptyBox('Playlist not found', 'It may have been deleted.'); return; }
    const dur = l.tracks.reduce((s, t) => s + (t.d || 0), 0);
    V.innerHTML = `<a class="back" href="#/library">${ic('back')}Your playlists</a>
      <div class="ph-head"><div class="cover">${liked ? `<span class="ph" style="background:linear-gradient(135deg,#ff3d6e,#3b2bd9)">${ic('heart')}</span>` : l.tracks.length ? mosaic(l.tracks) : ph(l.name)}</div>
      <div><span class="eyebrow">${liked ? 'Collection' : 'Playlist'}</span><h1 ${liked ? '' : 'data-rename title="Click to rename"'}>${esc(l.name)}</h1>
      <div class="meta">${l.tracks.length} songs${dur ? ' · ' + long(dur) : ''}</div>
      <div class="page-acts">
        <button class="btn hot" data-cplay="list:${esc(l.id)}" ${l.tracks.length ? '' : 'disabled'}>${ic('play')}Play</button>
        <button class="btn ghost" data-shufflelist="${esc(l.id)}">${ic('shuffle')}Shuffle</button>
        ${l.tracks.length ? `<button class="btn ghost" data-radiolist="${esc(l.id)}">${ic('wave')}Radio</button>` : ''}
        ${liked ? '' : `<button class="btn ghost" data-rename>${ic('edit')}Rename</button><button class="btn ghost" data-dellist="${esc(l.id)}">${ic('trash')}Delete</button>`}
      </div></div></div>
      <div id="lBox" class="sec" style="margin-top:28px">${l.tracks.length ? rows(l.tracks, { ctx: l.id, drag: true }) : emptyBox('This playlist is empty', 'Use “Add to playlist…” from any song’s ⋯ menu.')}</div>`;
    const ol = $('#lBox ol');
    if (ol) sortable(ol, (from, to) => { const [x] = l.tracks.splice(from, 1); l.tracks.splice(to, 0, x); save(liked ? 'liked' : 'lists'); viewList(id); markCurrent(); });
  }

  /* --- artist --- */
  async function viewArtist(id, _, tok) {
    V.innerHTML = `<div class="banner" style="background-color:var(--line)"><span class="eyebrow">Artist</span><h1>&nbsp;</h1></div><div class="sec">${skelRows(5)}</div>`;
    let a, tracks, albums = [], related = [];
    if (id.startsWith('au')) {
      const [u, t] = await Promise.all([A(`/users/${id.slice(2)}`), A(`/users/${id.slice(2)}/tracks?limit=50`)]);
      a = { id, name: u.name, pic: u.profile_picture?.['480x480'] || '', big: u.cover_photo?.['2000x'] || u.profile_picture?.['1000x1000'] || '', fans: u.follower_count || 0 };
      tracks = (t || []).map(auTrack);
    } else {
      const j = await M('artist?id=' + enc(id));
      ({ artist: a, tracks, albums, related } = j);
    }
    if (!live(tok)) return;
    remember({ k: 'artist', id, t: a.name, s: 'Artist', img: a.pic, href: `#/artist/${id}` });
    let shown = 5;
    const top = () => rows(tracks.slice(0, shown)) + (tracks.length > shown ? '<div class="more-row"><button class="btn ghost" id="topMore">Show more</button></div>' : '');
    V.innerHTML = `<div class="banner" style="background-image:url('${esc(a.big || a.pic)}')"><span class="eyebrow">${id.startsWith('au') ? 'Audius artist' : 'Artist'}</span><h1>${esc(a.name)}</h1>
      <div style="opacity:.85">${fans(a.fans)} ${id.startsWith('au') ? 'followers' : 'fans'}</div>
      <div class="page-acts"><button class="btn hot" id="aPlay">${ic('play')}Play</button><button class="btn ghost" id="aShuf">${ic('shuffle')}Shuffle</button>${followBtn(a)}${tracks[0] ? `<button class="btn ghost" id="aRadio">${ic('wave')}Radio</button>` : ''}</div></div>
      <section class="sec">${secHead(1, 'Popular')}<div id="topBox">${tracks.length ? top() : emptyBox('No songs found')}</div></section>
      ${albums.length ? `<section class="sec">${secHead(2, 'Discography')}<div class="hscroll">${albums.map((x) => card({ href: `#/album/${x.id}`, img: x.art, title: x.t, sub: `${x.year}${x.type ? ' · ' + x.type[0].toUpperCase() + x.type.slice(1) : ''}`, play: `album:${x.id}` })).join('')}</div></section>` : ''}
      ${related.length ? `<section class="sec">${secHead(albums.length ? 3 : 2, 'Fans also like')}<div class="hscroll">${related.map(artistCard).join('')}</div></section>` : ''}`;
    $('#aPlay').onclick = () => playList(tracks, 0, { label: a.name });
    $('#aShuf').onclick = () => playList(tracks, 0, { shuffle: true, label: a.name });
    const rb = $('#aRadio'); if (rb) rb.onclick = () => songRadio(tracks[0]);
    $('#topBox').onclick = (e) => { if (e.target.id === 'topMore') { shown = tracks.length; $('#topBox').innerHTML = top(); markCurrent(); } };
  }

  /* --- album --- */
  async function viewAlbum(id, _, tok) {
    V.innerHTML = `<div class="ph-head"><div class="cover sk"></div><div><span class="eyebrow">Album</span><h1>&nbsp;</h1></div></div>${skelRows(8)}`;
    const j = await M('album?id=' + enc(id));
    if (!live(tok)) return;
    const al = j.album, dur = j.tracks.reduce((s, t) => s + t.d, 0), aid = j.tracks[0]?.aid;
    remember({ k: 'album', id, t: al.t, s: al.a, img: al.art, href: `#/album/${id}` });
    V.innerHTML = `<div class="ph-head"><div class="cover">${art(al.big || al.art, al.t)}</div>
      <div><span class="eyebrow">${esc(al.type || 'Album')}</span><h1>${esc(al.t)}</h1>
      <div class="meta">${aid ? `<a href="#/artist/${esc(aid)}">${esc(al.a)}</a>` : esc(al.a)}${al.year ? ' · ' + al.year : ''} · ${j.tracks.length} songs · ${long(dur)}</div>
      <div class="page-acts"><button class="btn hot" id="pPlay">${ic('play')}Play</button><button class="btn ghost" id="pShuf">${ic('shuffle')}Shuffle</button><button class="btn ghost" data-addall>${ic('plus')}Add to playlist</button></div></div></div>
      <div class="sec" style="margin-top:28px">${rows(j.tracks, { album: false })}</div>${al.label ? `<p class="eyebrow" style="margin-top:24px">${esc(al.label)}</p>` : ''}`;
    $('#pPlay').onclick = () => playList(j.tracks, 0, { label: al.t });
    $('#pShuf').onclick = () => playList(j.tracks, 0, { shuffle: true, label: al.t });
    PAGE_TRACKS = j.tracks;
  }
  let PAGE_TRACKS = [];

  /* --- audius playlist --- */
  async function viewAPlaylist(id, _, tok) {
    V.innerHTML = `<div class="ph-head"><div class="cover sk"></div><div><span class="eyebrow">Playlist</span><h1>&nbsp;</h1></div></div>${skelRows(8)}`;
    const [meta, tr] = await Promise.all([A(`/playlists/${id}`), A(`/playlists/${id}/tracks`)]);
    if (!live(tok)) return;
    const p = Array.isArray(meta) ? meta[0] : meta, tracks = (tr || []).map(auTrack);
    const img = p?.artwork?.['1000x1000'] || p?.artwork?.['480x480'] || tracks[0]?.big;
    remember({ k: 'aplaylist', id, t: p?.playlist_name || 'Playlist', s: p?.user?.name || 'Audius', img: p?.artwork?.['480x480'] || tracks[0]?.art, href: `#/aplaylist/${id}` });
    V.innerHTML = `<div class="ph-head"><div class="cover">${art(img, p?.playlist_name)}</div>
      <div><span class="eyebrow">Audius playlist</span><h1>${esc(p?.playlist_name || 'Playlist')}</h1>
      <div class="meta">${p?.user ? `<a href="#/artist/au${esc(p.user.id)}">${esc(p.user.name)}</a> · ` : ''}${tracks.length} songs · ${long(tracks.reduce((s, t) => s + t.d, 0))}</div>
      <div class="page-acts"><button class="btn hot" id="pPlay">${ic('play')}Play</button><button class="btn ghost" id="pShuf">${ic('shuffle')}Shuffle</button><button class="btn ghost" data-addall>${ic('plus')}Save as playlist</button></div></div></div>
      <div class="sec" style="margin-top:28px">${tracks.length ? rows(tracks) : emptyBox('This playlist is empty')}</div>`;
    $('#pPlay').onclick = () => playList(tracks, 0, { label: p?.playlist_name });
    $('#pShuf').onclick = () => playList(tracks, 0, { shuffle: true, label: p?.playlist_name });
    PAGE_TRACKS = tracks;
  }

  /* --- mood mix --- */
  async function viewMix(id, _, tok) {
    const m = MOODS.find((x) => x.id === id);
    if (!m) { V.innerHTML = emptyBox('Mix not found'); return; }
    V.innerHTML = `<div class="ph-head"><div class="cover"><div class="mix" style="background:linear-gradient(160deg,${m.c[0]},${m.c[1]});width:100%;height:100%;aspect-ratio:auto"><span class="tag">Mood mix</span><b>${esc(m.name)}</b></div></div>
      <div><span class="eyebrow">Mood mix · ${esc(m.g.join(' · '))}</span><h1>${esc(m.name)}</h1><div class="meta">${esc(m.d)} — reshuffled every visit</div>
      <div class="page-acts"><button class="btn hot" id="pPlay">${ic('play')}Play</button><button class="btn ghost" id="pNew">${ic('dice')}Reshuffle</button><button class="btn ghost" data-addall>${ic('plus')}Save as playlist</button></div></div></div>
      <div class="sec" style="margin-top:28px" id="mBox">${skelRows(10)}</div>`;
    const tracks = await mixTracks(m);
    if (!live(tok)) return;
    remember({ k: 'mix', id, t: m.name, s: 'Mood mix', img: tracks[0]?.art, href: `#/mix/${id}` });
    fill('mBox', tracks.length ? rows(tracks) : emptyBox('Nothing in this mix right now'), tok);
    $('#pPlay').onclick = () => playList(tracks, 0, { label: m.name });
    $('#pNew').onclick = () => { memo.forEach((_, k) => k.startsWith('a:/tracks/trending') && memo.delete(k)); route(); };
    PAGE_TRACKS = tracks;
  }

  /* ================= global click handling ================= */
  async function playCollection(spec, shuffle = false) {
    const [kind, id] = spec.split(/:(.*)/);
    try {
      let tracks = [], label = '';
      if (kind === 'album') { const j = await M('album?id=' + enc(id)); tracks = j.tracks; label = j.album.t; }
      else if (kind === 'aplaylist') { const [m, t] = await Promise.all([A(`/playlists/${id}`), A(`/playlists/${id}/tracks`)]); tracks = (t || []).map(auTrack); label = (Array.isArray(m) ? m[0] : m)?.playlist_name || 'Playlist'; }
      else if (kind === 'mix') { const m = MOODS.find((x) => x.id === id); tracks = await mixTracks(m); label = m.name; }
      else if (kind === 'list') { const l = id === 'liked' ? { tracks: S.liked, name: 'Liked songs' } : S.lists.find((x) => x.id === id); tracks = l?.tracks || []; label = l?.name || ''; }
      if (!tracks.length) { toast('Nothing to play there'); return; }
      playList(tracks, 0, { shuffle, label });
    } catch (e) { toast(e.message); }
  }

  document.addEventListener('click', async (e) => {
    const t = e.target;
    const cp = t.closest('[data-cplay]');
    if (cp) { e.preventDefault(); e.stopPropagation(); playCollection(cp.dataset.cplay); return; }
    const sl = t.closest('[data-shufflelist]');
    if (sl) { playCollection('list:' + sl.dataset.shufflelist, true); return; }
    const rl = t.closest('[data-radiolist]');
    if (rl) { const l = rl.dataset.radiolist === 'liked' ? S.liked : S.lists.find((x) => x.id === rl.dataset.radiolist)?.tracks || []; if (l.length) songRadio(l[(Math.random() * l.length) | 0]); return; }
    if (t.closest('[data-retry]')) { route(); return; }
    if (t.closest('[data-newlist]')) { const l = await createListWith([]); if (l) location.hash = '#/list/' + l.id; return; }
    const dl = t.closest('[data-dellist]');
    if (dl) { const l = S.lists.find((x) => x.id === dl.dataset.dellist); if (l && (await confirmAsk(`Delete “${l.name}”?`))) { S.lists = S.lists.filter((x) => x !== l); save('lists'); paintSide(); location.hash = '#/library'; toast('Playlist deleted'); } return; }
    if (t.closest('[data-rename]')) {
      const id = parse().parts[1], l = S.lists.find((x) => x.id === id);
      if (l) { const n = await askText('Rename playlist', l.name); if (n) { l.name = n; save('lists'); paintSide(); viewList(id); } }
      return;
    }
    const aa = t.closest('[data-addall]');
    if (aa && PAGE_TRACKS.length) { addMenu(aa, PAGE_TRACKS); return; }
    const fb = t.closest('[data-follow]');
    if (fb) { toggleFollow(fb.dataset.follow); return; }
    if (t.closest('[data-clearjump]')) { S.activity = []; save('activity'); route(); return; }
    if (t.closest('[data-clearhist]')) { S.activity = S.activity.filter((a) => a.k !== 'song'); save('activity'); route(); return; }
    const uj = t.closest('[data-unjump]');
    if (uj) { e.preventDefault(); e.stopPropagation(); S.activity.splice(+uj.dataset.unjump, 1); save('activity'); const sec = uj.closest('.sec'); const html = jumpHTML(); if (html) sec.outerHTML = html; else sec.remove(); return; }
    const jb = t.closest('[data-jump]');
    if (jb) { const a = S.activity[+jb.dataset.jump]; if (a?.ref) playList([a.ref]); return; }

    // track rows
    const rowEl = t.closest('.row[data-l]');
    if (!rowEl) return;
    const tr = trackAt(rowEl);
    if (!tr) return;
    if (t.closest('[data-like]')) { toggleLike(tr); return; }
    if (t.closest('[data-more]')) {
      const ol = rowEl.closest('ol');
      const ctx = ol?.dataset.ctx;
      trackMenu(t.closest('[data-more]'), tr, { listId: ctx && ctx !== 'queue' ? ctx : null, queueIdx: ctx === 'queue' ? +rowEl.dataset.i : null });
      return;
    }
    if (t.closest('a')) return;
    const list = LISTS.get(rowEl.dataset.l), i = +rowEl.dataset.i;
    if (rowEl.dataset.l.startsWith('Q')) { P.i = P.i + 1 + i; playTrack(P.q[P.i]); return; }
    if (isCur(tr)) { toggle(); return; }
    playList(list, i, { label: rowEl.closest('.sec')?.querySelector('h2')?.textContent || '' });
  });

  /* ================= player controls wiring ================= */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const a = b.dataset.act;
    if (a === 'toggle') toggle();
    else if (a === 'next') next(false);
    else if (a === 'prev') prev();
    else if (a === 'shuffle') { setShuffle(!P.shuffle); toast(P.shuffle ? 'Shuffle on' : 'Shuffle off'); }
    else if (a === 'repeat') cycleRepeat();
  });
  $('#barNow').onclick = () => drawer(true);
  $('#panelBtn').onclick = () => drawer(!$('#np').classList.contains('open'));
  $('#npClose').onclick = $('#npScrim').onclick = () => drawer(false);
  $('#npSub').addEventListener('click', (e) => { if (e.target.closest('a')) drawer(false); });
  $('#npLike').onclick = $('#barLike').onclick = () => toggleLike(P.cur);
  $('#npAdd').onclick = (e) => { if (P.cur) addMenu(e.currentTarget, [P.cur]); };
  $('#npRadio').onclick = () => { if (P.cur) songRadio(P.cur); };
  $('#stopBtn').onclick = closePlayer;
  $('#qClear').onclick = () => { P.q = P.q.slice(0, P.i + 1); P.orig = P.q.slice(); renderQueue(); toast('Queue cleared'); };
  $('#vol').oninput = (e) => { S.cfg.vol = e.target.value / 100; S.cfg.muted = false; applyVol(); save('cfg'); };
  $('#muteBtn').onclick = () => { S.cfg.muted = !S.cfg.muted; applyVol(); save('cfg'); };
  $('#sleepBtn').onclick = (e) => openMenu(e.currentTarget, `<div class="mh">Sleep timer</div>${[['15', '15 minutes'], ['30', '30 minutes'], ['45', '45 minutes'], ['60', '1 hour'], ['end', 'End of this song'], ['0', 'Off']].map(([v, l]) => `<button data-m="sleep" data-v="${v}">${ic('clock')}${l}</button>`).join('')}`, { kind: 'sleep' });
  const paintAuto = () => $('#autoBtn').classList.toggle('on', S.cfg.autoplay);
  $('#autoBtn').onclick = () => { S.cfg.autoplay = !S.cfg.autoplay; save('cfg'); paintAuto(); toast(S.cfg.autoplay ? 'Autoplay on — similar songs keep coming' : 'Autoplay off'); renderQueue(); };

  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input,textarea,select,[contenteditable]') || e.metaKey || e.ctrlKey || e.altKey || dlg.open) return;
    const k = e.key;
    if (k === ' ' || k === 'k') { if (!P.mode) return; e.preventDefault(); toggle(); }
    else if (k === 'ArrowRight' && e.shiftKey) next(false);
    else if (k === 'ArrowLeft' && e.shiftKey) prev();
    else if (k === 'ArrowRight') seek(position() + 10);
    else if (k === 'ArrowLeft') seek(Math.max(0, position() - 10));
    else if (k === 'm') { S.cfg.muted = !S.cfg.muted; applyVol(); save('cfg'); }
    else if (k === 'l' && P.cur) toggleLike(P.cur);
    else if (k === 's' && P.mode === 'song') { setShuffle(!P.shuffle); toast(P.shuffle ? 'Shuffle on' : 'Shuffle off'); }
    else if (k === '/') { e.preventDefault(); MQ.focus(); MQ.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    else if (k === 'Escape') { closeMenu(); drawer(false); }
  });
  if ('mediaSession' in navigator) {
    const ms = navigator.mediaSession;
    ms.setActionHandler('play', () => toggle());
    ms.setActionHandler('pause', () => toggle());
    ms.setActionHandler('nexttrack', () => next(false));
    ms.setActionHandler('previoustrack', () => prev());
    try { ms.setActionHandler('seekto', (d) => seek(d.seekTime)); } catch { /* unsupported */ }
  }

  /* ================= boot ================= */
  if (FILE) markNoapi();
  applyVol(); paintModes(); paintAuto(); setPlaying(false);
  const q0 = new URLSearchParams(location.search).get('q');
  if (q0 && !location.hash) location.hash = '#/search?q=' + enc(q0.slice(0, 80));
  route();

  // Load the YouTube player in the background (not on iPad/iPhone, which use plain audio), so
  // the first song doesn't wait for it
  (window.requestIdleCallback || ((f) => setTimeout(f, 1200)))(() => { ytPlayer().catch(() => {}); });

  // The rest of the site talks to the player through this (pages open inside the Music shell)
  window.ZZMusic = {
    active: () => !!P.mode,
    playing: () => !!P.playing,
    play: (t, list) => { if (!t) return; const l = (list && list.length ? list : [t]); playList(l, Math.max(0, l.findIndex((x) => x.id === t.id))); },
    // for the "now playing" dropdown in other pages' nav
    state: () => ({
      active: !!P.mode, playing: !!P.playing,
      title: P.cur?.t || $('#barTitle').textContent || '', artist: P.cur?.a || $('#barSub').textContent || '',
      art: P.cur?.art || P.cur?.big || $('#barArt').getAttribute('src') || '',
      pos: position(), dur: duration(), vol: S.cfg.muted ? 0 : S.cfg.vol,
    }),
    toggle: () => toggle(), next: () => next(), prev: () => prev(), seek: (s) => seek(s),
    setVolume: (v) => { S.cfg.vol = Math.max(0, Math.min(1, v)); S.cfg.muted = false; applyVol(); save('cfg'); },
    pauseForVideo: () => { if (P.mode && P.playing) { pause(); P.videoPaused = true; } },
    resumeAfterVideo: () => { if (P.videoPaused) { P.videoPaused = false; if (P.mode && !P.playing) toggle(); } },
  };
  // a song picked on another page (search, Continue) waits here for the player
  try {
    const raw = sessionStorage.getItem('zz-play-now');
    if (raw) { sessionStorage.removeItem('zz-play-now'); const t = JSON.parse(raw); if (t && t.id) window.ZZMusic.play(t); }
  } catch { /* ignore */ }
})();
