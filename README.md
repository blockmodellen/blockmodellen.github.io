# Blockmodellen

Webbplats med problemlösning enligt blockmodellen: genomgångar steg för steg (PPT och PDF) och interaktiva övningar.

- `index.html` – startsida: *Så tänker du* (hopfälld), en ruta per område (naturliga tal, bråk, förhållande, procent) med genomgångar (PPT, PDF och Öva i samma ruta) och slumpade uppgifter, sist slumpade uppgifter från alla områden
- `ova.html?l=N` – interaktiv övning till genomgång N (`js/blandade-ova.js` + motorn `js/blockmodell-ova.js`)
- `trana.html` – slumpade uppgifter, nya tal varje gång
- `pdf/` – genomgångarna som PDF. PPT:erna ligger på Google Drive.
- `xyz.html` – *Blockmodellen med XYZ*: uppgifter som bygger på uppgifter i Matematik X, Y och Z (åk 7–9), med nya tal och delvis nytt sammanhang, per årskurs, område, avsnitt och nivå 1–3. PPT i `xyz/ppt/`, PDF i `xyz/pdf/`
- `xyz-ova.html?g=<åk>-<avsnitt>-<nivå>` – interaktiv övning (`js/xyz-data.js` + `js/xyz-ova.js`)

XYZ-delen byggs av `bygg_xyz.py` (uppgifterna i `uppgifter_ny.py`) i projektmappen `blockmodellen/xyz/`. Den länkar också in sidan i startsidan och menyerna, så kör den efter `flytt-skript.py`.

Flyttat från Mattekompassen (mattekompassen/nikpet) 2026-11-18. Publiceras med GitHub Pages från grenen `main`.
