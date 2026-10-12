# SwissCraft Website

Statische Website für GitHub Pages. Der Live-Status kommt über GitHub Actions: alle 5 Minuten
fragt `scripts/update-live.mjs` Twitch ab und veröffentlicht das Ergebnis als `live.json`.
Nur Streams in der Kategorie **Minecraft** zählen als live.

## Ordner

```
index.html                    Die Seite
config.js                     Einstellungen (Start-Datum, Discord, YouTube-ID, Map-Link ...)
participants.js               Alle Teilnehmer mit Twitch-Kanal, Season-2-Lineup und Season-1-Archiv
live.json                     Live-Status (wird automatisch überschrieben, nicht von Hand ändern)
assets/                       Logos, Poster
scripts/update-live.mjs       Holt den Live-Status von Twitch
.github/workflows/live.yml    Startet das Script alle 5 Minuten und veröffentlicht die Seite
CNAME                         Domain swisscraft.net
```

## 1. Auf GitHub hochladen

1. Auf github.com ein neues Repository anlegen, z.B. `swisscraft-website`, **Public**.
2. «Add file» → «Upload files» → den **Inhalt** dieses Ordners hineinziehen (nicht die ZIP).
   Der Ordner `.github` ist auf Mac/Windows oft versteckt. Wenn er nach dem Upload fehlt:
   «Add file» → «Create new file», als Name `.github/workflows/live.yml` eintippen und den Inhalt der Datei einfügen.
3. Commit.

## 2. Twitch Secret hinterlegen

Repository → Settings → Secrets and variables → Actions → «New repository secret»
- Name: `TWITCH_CLIENT_SECRET`
- Wert: das Client Secret aus dev.twitch.tv/console

GitHub-Secrets sind verschlüsselt und auch in einem öffentlichen Repository für niemanden sichtbar.
Das Secret **nie** in eine Datei schreiben. Die Client-ID ist im Script hinterlegt.

## 3. GitHub Pages einschalten

1. Settings → Pages → Source: **GitHub Actions** (nicht «Deploy from a branch»).
2. Actions → «Website & Live-Status» → «Run workflow». Nach ca. 1 Minute ist die Seite online.
   Danach läuft es automatisch alle 5 Minuten und bei jeder Änderung an den Dateien.
3. Settings → Pages → Custom domain: `swisscraft.net`.
4. Beim Domain-Anbieter:
   - A-Records für `swisscraft.net`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - CNAME für `www`: `DEIN-GITHUB-NAME.github.io`
5. Sobald die Domain bestätigt ist: «Enforce HTTPS» aktivieren.

**Kontrolle:** Im Tab «Actions» steht bei jedem Lauf z.B. «40 Kanäle geprüft, 2 live in Minecraft: ...».
Rot markiert mit Hinweis auf das Secret = Secret fehlt oder ist falsch.

Hinweis: GitHub startet geplante Läufe manchmal ein paar Minuten verspätet. Live-Daten älter als
30 Minuten blendet die Seite automatisch aus (`maxAgeMinutes` in `config.js`).
GitHub pausiert geplante Läufe, wenn 60 Tage lang nichts am Repository geändert wurde; dann einmal
«Run workflow» klicken oder eine Datei ändern.

## 4. Seite anpassen

Teilnehmer in `participants.js`:

```js
neuername: { name: "NeuerName", twitch: "neuername" },
```

und `"neuername"` in die Liste `season2` eintragen. `announced: false` hält eine Person versteckt.
Datei auf GitHub bearbeiten (Stift-Symbol) → Commit, die Seite aktualisiert sich nach ca. 1 Minute.

In `config.js`: `mapDownloadUrl`, `mapVersion`, `mapSize`, `youtubeBestOfId`, `discordUrl`, `impressumUrl`.
Leere Felder zeigen automatisch «folgt» an.

## 5. Vorschau mit simuliertem Live-Status

`#demo` an die Adresse anhängen, z.B. `https://swisscraft.net/#demo`.
