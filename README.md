# Werkverzeichnis — Philipp Sobioch

Persönliche Portfolio-Website mit Karussell, Archiv, Bild-Upload, „Über mich" und „Kontakt".

## Was du brauchst (alles kostenlos in der Grundversion)

- Einen [Supabase](https://supabase.com)-Account (Bildspeicher + Datenbank + Login)
- Einen [GitHub](https://github.com)-Account (Code-Ablage)
- Einen [Vercel](https://vercel.com)-Account (Hosting)

---

## 1. Supabase einrichten

1. Auf [supabase.com](https://supabase.com) einloggen, **New Project** anlegen (Name z. B. `werkverzeichnis`, Passwort merken, Region z. B. Frankfurt).
2. Im Projekt links auf **SQL Editor** → **New query**. Öffne die Datei `supabase-setup.sql` aus diesem Projekt, kopiere den Inhalt hinein und klicke **Run**. Das legt die Tabelle für deine Werke an und sorgt dafür, dass nur eingeloggte Nutzer hochladen/löschen dürfen.
3. Links auf **Storage** → **New bucket**. Name: `artworks`. Schalte **Public bucket** ein. Erstellen.
4. Links auf **Authentication** → **Users** → **Add user** → **Create new user**. Trage deine E-Mail-Adresse und ein sicheres Passwort ein, Haken bei **Auto Confirm User** setzen. Das ist dein persönlicher Login — nur mit diesen Zugangsdaten kannst du später Bilder hochladen oder löschen.
5. Links auf **Project Settings** → **API**. Dort findest du:
   - **Project URL** → das ist dein `VITE_SUPABASE_URL`
   - **anon public** Key → das ist dein `VITE_SUPABASE_ANON_KEY`

Beide brauchst du gleich für Vercel.

---

## 2. Code zu GitHub hochladen

1. Auf [github.com](https://github.com) ein neues, leeres Repository anlegen (z. B. `werkverzeichnis`), **ohne** README/gitignore-Häkchen.
2. Diesen kompletten Projektordner hochladen. Am einfachsten geht das über die GitHub-Weboberfläche: im leeren Repo auf **uploading an existing file** klicken und alle Dateien/Ordner hineinziehen (`node_modules` gibt es noch nicht, das ist normal).

Alternativ per Terminal, falls du das lieber magst:

```bash
cd werkverzeichnis
git init
git add .
git commit -m "Erste Version"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/werkverzeichnis.git
git push -u origin main
```

---

## 3. Bei Vercel deployen

1. Auf [vercel.com](https://vercel.com) mit GitHub einloggen.
2. **Add New** → **Project** → dein `werkverzeichnis`-Repo auswählen → **Import**.
3. Vercel erkennt automatisch, dass es ein Vite-Projekt ist. Vor dem Klick auf **Deploy** unter **Environment Variables** zwei Einträge hinzufügen:

   | Name | Wert |
   |---|---|
   | `VITE_SUPABASE_URL` | (aus Schritt 1) |
   | `VITE_SUPABASE_ANON_KEY` | (aus Schritt 1) |

4. **Deploy** klicken. Nach ca. einer Minute bekommst du eine URL wie `werkverzeichnis.vercel.app` — das ist deine echte, öffentlich erreichbare Website.

---

## 4. Benutzen

- **Als Besucher** sieht man nur die Galerien, „Über mich" und „Kontakt" — kein Upload-Button, kein Lösch-Symbol, nichts, was auf einen Login hindeutet.
- **Für dich als Admin**: Öffne `deine-url.vercel.app/admin` (am besten als Lesezeichen speichern) und melde dich mit der E-Mail/Passwort-Kombination aus Schritt 4 der Supabase-Einrichtung an.
- Nach dem Login bleibst du im Browser angemeldet (bis du dich über die Admin-Seite wieder abmeldest oder die Sitzung abläuft). Gehst du danach auf eine Galerie-Seite, siehst du dort automatisch „Bild hinzufügen" und die Lösch-Symbole an den Bildern.
- Die `/admin`-Seite ist bewusst nirgends verlinkt — Besucher stoßen nicht zufällig darauf.

---

## Eigene Domain (optional)

Falls du z. B. `philippsobioch.de` möchtest: Domain bei einem Registrar kaufen (z. B. INWX, Namecheap, ca. 10–15 €/Jahr), dann in Vercel unter **Project Settings → Domains** hinzufügen und die dort angezeigten DNS-Einträge beim Registrar eintragen. Vercel zeigt genau, was zu tun ist.

---

## Sicherheit

Das ist jetzt ein echter Login über Supabase Auth, keine reine Oberflächen-Maskierung mehr: Die Berechtigung wird direkt in der Datenbank geprüft (Row-Level-Security-Regeln in `supabase-setup.sql`), nicht nur im Browser versteckt. Nur wer sich mit deinen Zugangsdaten erfolgreich anmeldet, kann überhaupt schreibend auf die Datenbank oder den Bildspeicher zugreifen — unabhängig davon, was jemand im Browser-Code einsehen oder verändern könnte.

Praktische Hinweise:
- Falls du dein Passwort vergisst: in Supabase unter **Authentication → Users** kannst du es jederzeit zurücksetzen.
- Für noch mehr Sicherheit könntest du in Supabase zusätzlich Zwei-Faktor-Authentifizierung aktivieren (Authentication → Settings) — für ein persönliches Portfolio in der Regel nicht nötig, aber möglich.

---

## Lokal testen (optional, für Entwickler)

```bash
npm install
cp .env.example .env.local
# .env.local mit deinen echten Werten ausfüllen
npm run dev
```

## Struktur

```
src/
  App.jsx                Routen inkl. AuthProvider
  AuthContext.jsx         Login-Status (Supabase Auth)
  main.jsx                Einstiegspunkt
  styles.js                Gemeinsame Design-Tokens (Farben, Schrift)
  supabaseClient.js        Verbindung zu Supabase
  imageUtils.js            Bildkomprimierung + Datumsformatierung
  components/Header.jsx    Navigation
  pages/Gallery.jsx        Karussell, Archiv, Upload (wiederverwendet für beide Galerien)
  pages/About.jsx          Über mich
  pages/Contact.jsx        Kontakt
  pages/Admin.jsx          Versteckter Login für dich als Admin
supabase-setup.sql         SQL: Tabelle + Zugriffsregeln (nur eingeloggt darf schreiben)
```
