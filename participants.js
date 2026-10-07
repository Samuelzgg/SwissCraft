// SwissCraft – Teilnehmerdaten
// Eine Person pro Eintrag. Handles ohne "@" und ohne URL, nur der Name.
//   twitch:    Twitch-Login (twitch.tv/<login>)
//   tiktok:    TikTok-Handle (tiktok.com/@<handle>)
//   instagram: Instagram-Handle
//   youtube:   YouTube-Handle (youtube.com/@<handle>)
//   announced: false  -> wird NICHT angezeigt (für noch nicht angekündigte Teilnehmer)
//
// Season-Listen unten bestimmen, wer in welcher Staffel erscheint.

window.SWISSCRAFT_DATA = {
  people: {
    basefoxi:             { name: "BaseFoxi",             twitch: "basefoxi" },
    daedalcraft:          { name: "DaedalCraft",          twitch: "daedalcraft" },
    ddydavee:             { name: "DDY.Davee",            twitch: "davidsldt", tiktok: "ddy.davee" },
    docflashy:            { name: "DocFlashy",            twitch: "docflashy" },
    dreamyrere:           { name: "dreamyrere",           twitch: "dreamyrere" },
    elijahtetillaa:       { name: "Elijah Tetillaa",      twitch: "elijahtetillaa" },
    gery_live:            { name: "Gery_live",            twitch: "gery_live" },
    helagon:              { name: "Helagon",              twitch: "helagon_" },
    jakofski37:           { name: "Jakofski37",           twitch: "jakofski37" },
    jenniferjordii:       { name: "JenniferJordii",       twitch: "jenniferjordii" },
    karagorni:            { name: "Karagorni",            twitch: "karagorni" },
    kritiker8153:         { name: "kritiker8153",         twitch: "kritiker8153" },
    laisalicious:         { name: "Laisalicious",         twitch: "laisalicious" },
    leonie_zh:            { name: "Leonie_zh",            twitch: "leonie_zh" },
    logik66:              { name: "Logik66",              twitch: "logik_66", youtube: "logik_66" },
    loschua:              { name: "Loschua",              twitch: "loschuatv" },
    maeloromani:          { name: "Maeloromani",          twitch: "maeloromani" },
    magopi:               { name: "Magopi",               twitch: "magopi_", tiktok: "magopionduty" },
    makroniklp:           { name: "makroniklp",           twitch: "makroniklp" },
    marachuuu:            { name: "Marachuuu",            twitch: "marachuuu" },
    mlgamer:              { name: "ML Gamer",             twitch: "mlgamerch" },
    missesseli:           { name: "MissesSeli",           twitch: "missesseli" },
    monkeey99:            { name: "Monkeey99",            twitch: "monkeey99" },
    nanox:                { name: "Nanox",                twitch: "nanox04" },
    naxlani:              { name: "Naxlani",              twitch: "naxlani" },
    nimmbaa:              { name: "nimmbaa",              twitch: "nimmbaa" },
    onklskoko:            { name: "Onklskoko",            twitch: "onklskoko" },
    prinznorin:           { name: "prinznorin",           twitch: "prinznorin" },
    saendu2k:             { name: "saendu2k",             twitch: "saendu2k" },
    samuel_zgg:           { name: "Samuel_zgg",           twitch: "samuel_zgg" },
    sandroschmitter:      { name: "SandroSchmitter",      twitch: "sandroschmitter" },
    scorpion1997_cosplay: { name: "scorpion1997_cosplay", twitch: "scorpion1997_cosplay" },
    sir_cooli:            { name: "Sir_Cooli",            twitch: "sir_cooli" },
    swisscraftix:         { name: "Swisscraftix",         twitch: "swisscraftix" },
    technobird:           { name: "Technobird",           twitch: "technobirdxd" },
    tsswiss22:            { name: "TSswiss22",            twitch: "tsswiss22", tiktok: "tsswiss22" },
    whosayla:             { name: "WhosAyla",             twitch: "whosayla", instagram: "whosayla_" },
    z_wqlf:               { name: "z_wqlf",               twitch: "z_wqlf" }
    // Beispiel für eine noch nicht angekündigte Person (bleibt unsichtbar, bis announced entfernt wird):
    // neuername: { name: "NeuerName", twitch: "neuername", announced: false },
  },

  // Season 2 – Reihenfolge wie auf dem offiziellen Lineup-Poster
  season2: [
    "basefoxi", "daedalcraft", "ddydavee", "docflashy", "dreamyrere",
    "elijahtetillaa", "gery_live", "helagon", "jakofski37", "jenniferjordii",
    "karagorni", "kritiker8153", "laisalicious", "leonie_zh", "logik66",
    "loschua", "maeloromani", "magopi", "makroniklp", "marachuuu",
    "mlgamer", "missesseli", "monkeey99", "nanox", "naxlani",
    "nimmbaa", "onklskoko", "prinznorin", "saendu2k", "samuel_zgg",
    "sandroschmitter", "scorpion1997_cosplay", "sir_cooli", "swisscraftix",
    "technobird", "tsswiss22", "whosayla", "z_wqlf"
  ],

  // Season 1 – Archiv (bitte vervollständigen)
  season1: [
    "daedalcraft", "ddydavee", "dreamyrere", "elijahtetillaa", "gery_live",
    "helagon", "jakofski37", "jenniferjordii", "laisalicious", "logik66",
    "maeloromani", "marachuuu", "mlgamer", "missesseli", "monkeey99",
    "naxlani", "nimmbaa", "onklskoko", "prinznorin", "saendu2k",
    "samuel_zgg", "sandroschmitter", "sir_cooli", "technobird"
  ]
};
