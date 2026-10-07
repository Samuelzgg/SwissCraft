// SwissCraft – Website-Konfiguration
// Leere Felder ("") werden auf der Seite automatisch als "folgt" angezeigt.

window.SWISSCRAFT_CONFIG = {
  // Season 2 Start (mit Zeitzone). Bis dahin läuft ein Countdown, danach die Live-Anzeige.
  seasonStart: "2026-10-09T20:15:00+02:00",
  seasonStartLabel: "09.10.2026",
  seasonStartTime: "20:15 Uhr",

  // URL des Live-Status-Workers (siehe README, Ordner "worker"). Leer = keine Live-Abfrage.
  liveEndpoint: "",
  // Abfrage-Intervall in Sekunden
  pollSeconds: 60,

  // Community Server (Infos laufen über den Discord)
  discordUrl: "https://discord.gg/swisscraft",

  // Archiv Season 1
  youtubeBestOfId: "JqjUhnBnlAw",
  mapDownloadUrl: "https://drive.google.com/drive/folders/137gMWND4ecI9sitE6pHcR5Tg8ktMtnLO?usp=sharing", // Ordner-Link oder direkter ZIP-Link
  mapVersion: "Minecraft 1.21.10 (Java Edition)",
  mapSize: "",                    // z.B. "2.4 GB" (sobald als ZIP vorhanden)

  // Social & Rechtliches
  instagramHandle: "swisscraftofficial",
  impressumUrl: ""
};
