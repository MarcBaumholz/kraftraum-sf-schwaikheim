# Projekt Kraftraum

Statische Website für die aktiven Mannschaften der SF Schwaikheim Handball.
Die Seite zeigt geplante Anschaffungen, sammelt Vorschläge und ermöglicht
gemeinsame Up- und Downvotes.

## Lokal starten

```bash
npm install
npm run dev
```

Qualitätschecks:

```bash
npm test
npm run lint
npm run build
```

## Inhalte anpassen

Vereinsname, PayPal-Link, Spendenziel und Beispielbetrag stehen zentral in
`src/config/site.ts`.

Solange `paypalUrl` leer ist, startet die Schaltfläche keine Zahlung und zeigt
stattdessen einen transparenten Hinweis. Preise und Sammelstand sind aktuell
als Beispielwerte gekennzeichnet.

## Supabase aktivieren

Die Website ist vollständig statisch. Supabase übernimmt nur gemeinsame
Vorschläge, Bilder, anonyme Sitzungen und Votes.

1. Ein kostenloses Supabase-Projekt erstellen.
2. Unter **Authentication > Providers > Anonymous Sign-Ins** anonyme
   Anmeldungen aktivieren.
3. `supabase/schema.sql` im Supabase SQL Editor vollständig ausführen.
4. `.env.example` als `.env.local` anlegen und die Projektwerte eintragen:

```env
VITE_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=DEIN_PUBLIC_KEY
```

Für GitHub Pages dieselben Werte als Repository-Secrets
`VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` eintragen.

Der Publishable-/Anon-Key ist für Browser-Anwendungen vorgesehen. Die
Absicherung erfolgt über die Row-Level-Security-Regeln in `schema.sql`, nicht
durch Geheimhaltung dieses öffentlichen Keys.

## GitHub Pages

`.github/workflows/deploy-pages.yml` testet und baut die Seite bei jedem Push
auf `main`. In den Repository-Einstellungen unter **Pages** muss als Quelle
**GitHub Actions** ausgewählt sein.

Die Vite-Konfiguration setzt in GitHub Actions automatisch den Basispfad
`/kraftraum-sf-schwaikheim/`.

## Moderation und Grenzen

Neue Vorschläge erscheinen wie gewünscht sofort. Das Schema begrenzt:

- Titel auf 80 Zeichen
- Beschreibungen auf 500 Zeichen
- Links auf HTTP/HTTPS
- Bilder auf JPEG, PNG oder WebP bis 5 MB
- Uploadpfade auf die anonyme Nutzer-ID
- Vorschläge pro anonymer Identität auf höchstens einen pro Minute
- Votes auf eine aktive Stimme pro anonymer Identität und Gerät

Ein öffentliches Formular ohne Captcha oder persönliche Anmeldung kann
gezielten Spam nicht vollständig verhindern. Unerwünschte Vorschläge lassen
sich im Supabase Table Editor aus `equipment_items` löschen.

## Vor öffentlicher Bewerbung ergänzen

- PayPal-Spendenlink
- Tatsächliche Gerätepreise und Spendenwerte
- Impressumsangaben
- Datenschutzerklärung und verantwortliche Kontaktmöglichkeit
- Gegebenenfalls das freigegebene Vereinslogo
