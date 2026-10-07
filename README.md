# SwissCraft Website

Statische Website, läuft auf jedem Webhosting (z.B. hosttech, Infomaniak, Netlify, GitHub Pages).
Kein Build-Schritt nötig: Ordner hochladen, fertig.

## Ordner

```
index.html          Die Seite
config.js           Einstellungen (Start-Datum, Live-Endpoint, Server-IP, YouTube-ID, Map-Link ...)
participants.js     Alle Teilnehmer mit Kanälen, Season-2-Lineup und Season-1-Archiv
assets/             Logos, Poster
worker/worker.js    Live-Status-Abfrage bei Twitch (Cloudflare Worker)
```

## 1. Seite anpassen

Alles, was du regelmässig änderst, steht in `config.js` und `participants.js`. In `index.html` musst du nichts anfassen.

**Teilnehmer hinzufügen** (`participants.js`):

```js
neuername: { name: "NeuerName", twitch: "neuername", tiktok: "neuername" },
```

und den Schlüssel `"neuername"` in die Liste `season2` eintragen. Solange `announced: false` gesetzt ist,
bleibt die Person unsichtbar; Zeile entfernen, sobald sie angekündigt ist.
Handles immer ohne `@` und ohne `https://` eintragen.

**Ausfüllen, sobald vorhanden** (`config.js`):

- `discordUrl` (Community Server läuft über den Discord)
- `youtubeBestOfId` (nur die ID aus dem YouTube-Link, z.B. bei `youtube.com/watch?v=abc123` ist es `abc123`)
- `mapDownloadUrl`, `mapVersion`, `mapSize`
- `impressumUrl`

Leere Felder zeigen automatisch «folgt» an.

## 2. Live-Status einrichten (Twitch)

Die Seite fragt alle 60 Sekunden einen kleinen Dienst, wer gerade auf Twitch **in der Kategorie Minecraft** streamt.
Dieser Dienst läuft als Cloudflare Worker (kostenlos, 100'000 Abfragen pro Tag).

1. **Twitch-App erstellen:** https://dev.twitch.tv/console → «Register Your Application»
   - Name: SwissCraft Live
   - OAuth Redirect URL: `http://localhost`
   - Category: Website Integration
   - Danach **Client ID** und **Client Secret** notieren.
2. **Cloudflare Worker anlegen:** https://dash.cloudflare.com → Workers & Pages → Create → «Hello World» → Deploy.
   Dann «Edit code», den Inhalt von `worker/worker.js` einfügen und speichern.
3. **Secrets setzen:** Worker → Settings → Variables and Secrets:
   - `TWITCH_CLIENT_ID` (Secret)
   - `TWITCH_CLIENT_SECRET` (Secret)
   - `ALLOWED_ORIGINS` (Text), z.B. `https://swisscraft.ch,https://www.swisscraft.ch`
4. **Testen:** `https://<dein-worker>.workers.dev/?logins=basefoxi,daedalcraft` im Browser öffnen. Es muss JSON zurückkommen.
5. **In `config.js` eintragen:** `liveEndpoint: "https://<dein-worker>.workers.dev"`

Sobald jemand aus dem Lineup Minecraft streamt, erscheint die Person im Live-Board, rutscht im Lineup nach oben
und der Twitch-Button wird zu «Jetzt zuschauen». Ausserdem werden die Twitch-Profilbilder geladen.

**TikTok:** TikTok hat keine öffentliche Schnittstelle für den Live-Status. Die Seite ist dafür vorbereitet
(`tiktok`-Liste im Worker), aber ohne eigenen Dienst bleibt sie leer.

## 3. Vorschau mit simuliertem Live-Status

`index.html?demo` (oder `#demo`) anhängen, dann werden drei Streamer als live angezeigt (nur zum Anschauen des Designs).

## 4. Hochladen

Den ganzen Ordner (ohne `worker/`) per FTP/SFTP ins Webroot laden. Die Seite ist reines HTML/CSS/JS,
es braucht weder PHP noch Datenbank. Schriften kommen von Google Fonts.
