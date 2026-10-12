// SwissCraft – Live-Status von Twitch holen und als live.json speichern.
// Läuft automatisch über GitHub Actions (.github/workflows/live.yml).
// Nur Streams in der Twitch-Kategorie "Minecraft" werden als live gemeldet.
//
// Benötigt das GitHub-Secret TWITCH_CLIENT_SECRET. Die Client-ID ist öffentlich und unten hinterlegt.

import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

const MINECRAFT_GAME_ID = "27471";
const CLIENT_ID = process.env.TWITCH_CLIENT_ID || "eb02mp7v41brhjwk9vwegejpjb0wt8";
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || "";
const OUT = process.argv[2] || "live.json";

async function loadLogins() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(await readFile("participants.js", "utf8"), ctx);
  const D = ctx.window.SWISSCRAFT_DATA || { people: {} };
  const ids = [...new Set([...(D.season2 || []), ...(D.season1 || [])])];
  return [...new Set(ids
    .map(id => D.people[id])
    .filter(p => p && p.twitch && p.announced !== false)
    .map(p => p.twitch.toLowerCase()))];
}

async function getToken() {
  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: "client_credentials" }),
  });
  if (!res.ok) throw new Error(`Twitch-Token fehlgeschlagen (${res.status}) – stimmt TWITCH_CLIENT_SECRET?`);
  return (await res.json()).access_token;
}

async function helix(token, path, key, values) {
  const out = [];
  for (let i = 0; i < values.length; i += 100) {
    const u = new URL("https://api.twitch.tv/helix/" + path);
    u.searchParams.set("first", "100");
    for (const v of values.slice(i, i + 100)) u.searchParams.append(key, v);
    const res = await fetch(u, { headers: { "Client-Id": CLIENT_ID, Authorization: "Bearer " + token } });
    if (!res.ok) throw new Error(`Twitch ${path} fehlgeschlagen (${res.status})`);
    out.push(...((await res.json()).data || []));
  }
  return out;
}

async function main() {
  const logins = await loadLogins();
  let result = { fetchedAt: new Date().toISOString(), twitch: [], tiktok: [], avatars: {} };
  try {
    if (!CLIENT_SECRET) throw new Error("TWITCH_CLIENT_SECRET ist nicht gesetzt (Settings → Secrets and variables → Actions).");
    const token = await getToken();
    const [streams, users] = await Promise.all([
      helix(token, "streams", "user_login", logins),
      helix(token, "users", "login", logins),
    ]);
    result.twitch = streams
      .filter(s => s.type === "live" && (s.game_id === MINECRAFT_GAME_ID || (s.game_name || "").toLowerCase() === "minecraft"))
      .map(s => ({ login: (s.user_login || "").toLowerCase(), title: s.title, viewers: s.viewer_count, game: s.game_name, startedAt: s.started_at, thumbnail: s.thumbnail_url }));
    for (const u of users) result.avatars[(u.login || "").toLowerCase()] = u.profile_image_url;
    console.log(`${logins.length} Kanäle geprüft, ${result.twitch.length} live in Minecraft:`, result.twitch.map(s => s.login).join(", ") || "–");
  } catch (err) {
    // Datei ohne Live-Daten schreiben, damit die Seite trotzdem ausgeliefert wird; Fehler im Actions-Log anzeigen.
    result = { fetchedAt: null, error: String(err.message || err), twitch: [], tiktok: [], avatars: {} };
    console.log(`::error::${result.error}`);
  }
  await writeFile(OUT, JSON.stringify(result));
}

main();
