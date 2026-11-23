# Blockmodellen

Webbplats med problemlösning enligt blockmodellen: genomgångar steg för steg (PPT och PDF) och interaktiva övningar.

- `index.html` – elevsida (startsida): *Så tänker du* (hopfälld), en ruta per område (naturliga tal, bråk, förhållande, procent) med uppgiftsblad (PDF) och Öva i samma ruta (inga PPT:er) och slumpade uppgifter, sist slumpade uppgifter från alla områden
- `ova.html?l=N` – interaktiv övning till genomgång N (`js/blandade-ova.js` + motorn `js/blockmodell-ova.js`)
- `larare.html` – lärarsida med lösenord: 15 lektioner med PPT, elevblad, övning och en sida per lektion (`#lektion-N`). Innehållet (bl.a. PPT-länkarna) ligger krypterat i sidan (PBKDF2 + AES-GCM) och öppnas med lärarnas lösenord. Lösenordet finns inte i repot. Byggs om med `bygg.py` i projektmappen.
- `trana.html` – slumpade uppgifter, nya tal varje gång
- `pdf/` – genomgångarna som PDF. PPT:erna ligger på Google Drive.


Flyttat från Mattekompassen (mattekompassen/nikpet) 2026-11-18. Publiceras med GitHub Pages från grenen `main`.
