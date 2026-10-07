// SwissCraft Live-Status Worker (Cloudflare Workers, kostenloser Plan reicht)
//
// Was er macht:
//   GET https://<dein-worker>.workers.dev/?logins=basefoxi,daedalcraft,...
//   -> { fetchedAt, twitch: [ {login, title, viewers, game, startedAt, thumbnail} ], tiktok: [], avatars: {login: url} }
//
// Nur Streams in der Twitch-Kategorie "Minecraft" (game_id 27471) werden als live gemeldet.
// Antworten werden 60 Sekunden gecacht, Profilbilder 6 Stunden.
//
// Secrets (im Cloudflare-Dashboard unter Settings > Variables and Secrets):
//   TWITCH_CLIENT_ID      – aus deiner Twitch-App (dev.twitch.tv/console)
//   TWITCH_CLIENT_SECRET  – ebenfalls aus der Twitch-App
// Variable (optional):
//   ALLOWED_ORIGINS       – z.B. "https://swisscraft.ch,https://www.swisscraft.ch" (leer = alle erlaubt)

const MINECRAFT_GAME_ID = "27471";
const MAX_LOGINS = 100;
const STREAMS_TTL = 60;          // Sekunden
const AVATARS_TTL = 6 * 3600;    // Sekunden

let tokenCache = { token: null, expiresAt: 0 };

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "GET") return json({ error: "method not allowed" }, 405, cors);

    const url = new URL(request.url);
    const logins = [...new Set((url.searchParams.get("logins") || "")
      .split(",").map(s => s.trim().toLowerCase()).filter(s => /^[a-z0-9_]{3,25}$/.test(s)))].slice(0, MAX_LOGINS);

    if (!logins.length) return json({ error: "logins parameter missing" }, 400, cors);
    if (!env.TWITCH_CLIENT_ID || !env.TWITCH_CLIENT_SECRET) return json({ error: "twitch credentials not configured" }, 500, cors);

    try {
      const [streams, avatars] = await Promise.all([
        cached(`streams:${logins.join(",")}`, STREAMS_TTL, () => fetchStreams(env, logins), ctx),
        cached(`avatars:${logins.join(",")}`, AVATARS_TTL, () => fetchAvatars(env, logins), ctx),
      ]);
      return json({
        fetchedAt: new Date().toISOString(),
        twitch: streams,
        tiktok: await fetchTikTokLive(logins),   // Platzhalter, siehe unten
        avatars,
      }, 200, { ...cors, "Cache-Control": `public, max-age=${STREAMS_TTL}` });
    } catch (err) {
      return json({ error: String(err && err.message || err) }, 502, cors);
    }
  },
};

// ---- Twitch ----------------------------------------------------------------

async function getAppToken(env) {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt - 60_000) return tokenCache.token;
  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.TWITCH_CLIENT_ID,
      client_secret: env.TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) throw new Error(`twitch token ${res.status}`);
  const j = await res.json();
  tokenCache = { token: j.access_token, expiresAt: Date.now() + (j.expires_in || 3600) * 1000 };
  return tokenCache.token;
}

async function helix(env, path, params) {
  const call = async (token) => {
    const u = new URL("https://api.twitch.tv/helix/" + path);
    for (const [k, v] of params) u.searchParams.append(k, v);
    return fetch(u, { headers: { "Client-Id": env.TWITCH_CLIENT_ID, Authorization: "Bearer " + token } });
  };
  let res = await call(await getAppToken(env));
  if (res.status === 401) {            // Token abgelaufen -> einmal erneuern
    tokenCache = { token: null, expiresAt: 0 };
    res = await call(await getAppToken(env));
  }
  if (!res.ok) throw new Error(`twitch ${path} ${res.status}`);
  return (await res.json()).data || [];
}

async function fetchStreams(env, logins) {
  const data = await helix(env, "streams", [["first", "100"], ...logins.map(l => ["user_login", l])]);
  return data
    .filter(s => s.type === "live" && (s.game_id === MINECRAFT_GAME_ID || (s.game_name || "").toLowerCase() === "minecraft"))
    .map(s => ({
      login: (s.user_login || "").toLowerCase(),
      name: s.user_name,
      title: s.title,
      viewers: s.viewer_count,
      game: s.game_name,
      startedAt: s.started_at,
      thumbnail: (s.thumbnail_url || "").replace("{width}", "640").replace("{height}", "360"),
    }));
}

async function fetchAvatars(env, logins) {
  const data = await helix(env, "users", logins.map(l => ["login", l]));
  const out = {};
  for (const u of data) out[(u.login || "").toLowerCase()] = u.profile_image_url;
  return out;
}

// ---- TikTok ----------------------------------------------------------------
// TikTok bietet keine öffentliche API für den Live-Status. Diese Funktion gibt deshalb
// eine leere Liste zurück. Wenn du später eine Lösung hast (z.B. eigener Dienst),
// hier TikTok-Handles zurückgeben, die gerade live sind: ["handle1", "handle2"].
async function fetchTikTokLive(_logins) {
  return [];
}

// ---- Helfer ----------------------------------------------------------------

async function cached(key, ttl, producer, ctx) {
  const cache = caches.default;
  const req = new Request("https://swisscraft-cache.internal/" + encodeURIComponent(key));
  const hit = await cache.match(req);
  if (hit) return hit.json();
  const value = await producer();
  const res = new Response(JSON.stringify(value), { headers: { "Content-Type": "application/json", "Cache-Control": `max-age=${ttl}` } });
  ctx.waitUntil(cache.put(req, res.clone()));
  return value;
}

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  const allow = !allowed.length ? "*" : (allowed.includes(origin) ? origin : allowed[0]);
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...headers } });
}
