# Kraftraum-Website: Design-Spezifikation

## 1. Projektüberblick

Die aktiven Handballmannschaften der Sportfreunde Schwaikheim erhalten eine
öffentliche, deutschsprachige Website für die Weiterentwicklung ihres
Kraftraums. Die Seite wird als statische Website über GitHub Pages
bereitgestellt und über einen QR-Code im Vereinsumfeld aufgerufen.

Die Website verfolgt drei Ziele:

1. Geplante Anschaffungen verständlich und attraktiv präsentieren.
2. Gemeinsame Priorisierung durch Upvotes und Downvotes ermöglichen.
3. Spenden über einen später einzutragenden PayPal-Link aktivieren.

Als bereits erreichter Meilenstein wird das gemeinsam finanzierte Quad Rack
gezeigt.

## 2. Zielgruppen

### Primäre Zielgruppe

- Aktive Spielerinnen und Spieler der Sportfreunde Schwaikheim Handball
- Trainerinnen, Trainer und Teamverantwortliche
- Vereinsmitglieder, die den Kraftraum nutzen oder unterstützen

### Sekundäre Zielgruppe

- Ehemalige Aktive
- Fans, Familien und lokale Unterstützer
- Potenzielle Spenderinnen und Spender

Die meisten Besuche erfolgen mobil nach dem Scan eines QR-Codes. Die Seite muss
daher ohne Einführung verständlich sein und die wichtigsten Aktionen in
wenigen Sekunden vermitteln.

## 3. Erfolgskriterien

- Besucher erkennen sofort, dass es um die gemeinsame Ausstattung des
  Kraftraums geht.
- Der Spendenaufruf ist innerhalb des ersten mobilen Viewports sichtbar.
- Besucher können ohne sichtbare Registrierung abstimmen.
- Besucher können einen Vorschlag mit Titel, Beschreibung und wahlweise Link
  oder Bild einreichen.
- Ein eingereichter Vorschlag erscheint nach erfolgreicher Speicherung sofort
  in der öffentlichen Liste.
- Die Website funktioniert als statischer GitHub-Pages-Build.
- Tastaturbedienung, Fokuszustände, Kontraste und Formularbeschriftungen
  erfüllen mindestens die wesentlichen Anforderungen von WCAG 2.2 AA.

## 4. Gestaltungsrichtung

### Markenwirkung

Die Seite wirkt wie eine eigenständige Vereinsaktion: athletisch, direkt,
gemeinschaftlich und bodenständig. Sie soll nicht wie ein Online-Shop oder
eine generische Crowdfunding-Plattform aussehen.

### Farbwelt

- Primär: kräftiges Vereinsrot für Aktionen und Hervorhebungen
- Text und Flächen: tiefes Schwarz beziehungsweise Anthrazit
- Hintergrund: warmes Off-White statt reinem Weiß
- Erfolg: gedämpftes Grün für den finanzierten Quad-Rack-Meilenstein
- Warnung und Fehler: eigene semantische Farben, nicht ausschließlich Rot

Alle Text-Hintergrund-Kombinationen erreichen mindestens 4,5:1 Kontrast,
große Schrift mindestens 3:1.

### Typografie

- Eine plakative, kondensierte Display-Schrift für Hero und Abschnittstitel
- Eine gut lesbare Grotesk-Schrift für Fließtext, Formulare und Metadaten
- Flüssige Schriftgrößen mit `clamp()`
- Keine dekorativen Versalien für längere Texte

Schriften werden entweder lokal ausgeliefert oder mit robusten
System-Fallbacks versehen, damit die Seite auch bei langsamer Verbindung
schnell lesbar bleibt.

### Bildsprache

Die Geräte werden mit konsistenten, hochwertigen Illustrationen oder
freigestellten Bildern dargestellt. Es werden keine Emoji, ASCII-Grafiken,
leeren Platzhalter oder improvisierten CSS-Zeichnungen als sichtbare
Gerätebilder verwendet.

## 5. Informationsarchitektur

Die Website ist eine responsive Einseiter-Anwendung mit folgenden Bereichen:

### 5.1 Kopfzeile

- Kompakte Wortmarke: `SF Schwaikheim Handball`
- Aktionsname: `Projekt Kraftraum`
- Sprunglink zu den Vorschlägen
- Auf kleinen Displays keine komplexe Navigation

### 5.2 Hero

- Hauptzeile: `Gemeinsam machen wir unseren Kraftraum stärker.`
- Kurzer Kontext zur früheren Sammlung und zum bereits beschafften Quad Rack
- Primäre Aktion: `Kraftraum unterstützen`
- Sekundäre Aktion: `Geräte ansehen`
- Visueller Fortschritt mit vorläufigem Gesamtziel und Beispielbetrag

Der PayPal-Link ist zunächst als klar benannter Konfigurationswert hinterlegt.
Solange kein echter Link gesetzt ist, öffnet die Schaltfläche keinen
Zahlungsvorgang und erklärt transparent, dass der Spendenlink folgt.

### 5.3 Erreichter Meilenstein

- Quad Rack als bereits finanzierte Anschaffung
- Kurze Botschaft, dass die erste Sammelaktion funktioniert hat
- Positive soziale Bestätigung ohne erfundene Spenderzahlen

### 5.4 Geplante Geräte

Initiale Karten:

| Gerät | Beispielpreis | Kurzbeschreibung |
| --- | ---: | --- |
| Rückenstrecker | 349 EUR | Für gezieltes Training der unteren Rücken- und Rumpfmuskulatur |
| 5-kg-Hanteln, Paar | 49 EUR | Leichtere Gewichte für Reha, Schultertraining und Warm-up |
| Digitale Wanduhr | 89 EUR | Große Trainingszeit für Intervalle, Pausen und Zirkel |

Jede Karte enthält:

- Bild oder Illustration
- Titel und Kurzbeschreibung
- Beispielpreis mit Kennzeichnung `ca.`
- Upvote- und Downvote-Schaltfläche
- Aktuellen Saldo und getrennte positive beziehungsweise negative Stimmen
- Lade-, Erfolgs- und Fehlerzustand

### 5.5 Community-Vorschläge

Die Vorschlagsliste wird nach Vote-Saldo absteigend sortiert. Bei Gleichstand
erscheint der neuere Vorschlag zuerst.

Jede Karte zeigt:

- Titel
- Beschreibung, sofern vorhanden
- Vorschaubild, sofern vorhanden
- Externen Link, sofern vorhanden
- Erstellungsdatum
- Upvote, Downvote und Saldo

Lange URLs und Texte dürfen das Layout nicht sprengen. Externe Links öffnen
mit sicherem `rel="noopener noreferrer"`.

### 5.6 Vorschlag einreichen

Das Formular ist einspaltig und enthält:

- Titel, erforderlich, maximal 80 Zeichen
- Begründung, optional, maximal 500 Zeichen
- Link, optional, nur `http` oder `https`
- Bild, optional, JPEG, PNG oder WebP, maximal 5 MB
- Datenschutzhinweis, dass öffentlich eingereichte Inhalte sichtbar werden
- Absenden-Schaltfläche

Mindestens Link oder Bild ist erforderlich. Validierungsfehler erscheinen
direkt am betreffenden Feld. Während Upload und Speicherung ist das Formular
gesperrt. Nach Erfolg wird es zurückgesetzt und der neue Vorschlag in der Liste
angezeigt.

### 5.7 Abschluss und Fußzeile

- Wiederholter Spendenaufruf
- Hinweis `Von den aktiven Mannschaften der SF Schwaikheim Handball`
- Impressums- und Datenschutz-Platzhalter, die vor öffentlicher Bewerbung mit
  den tatsächlichen Vereinsangaben ergänzt werden müssen
- Projektstand beziehungsweise letztes inhaltliches Update

## 6. Interaktionen und Zustände

### Abstimmung

Besucher werden durch Supabase anonym authentifiziert, ohne Login-Formular,
E-Mail oder sichtbares Konto. Pro anonymem Benutzer und Vorschlag ist genau
eine aktive Stimme gespeichert.

- Erstes Upvote setzt `+1`.
- Erstes Downvote setzt `-1`.
- Klick auf die bereits aktive Stimme entfernt sie.
- Klick auf die Gegenstimme wechselt die Stimme atomar.
- Die Oberfläche reagiert optimistisch und stellt bei einem Fehler den
  vorherigen Zustand wieder her.

Die anonyme Identität reduziert Mehrfachstimmen im normalen Gebrauch, ist aber
kein vollständiger Schutz gegen gezielte Manipulation. Dieser Kompromiss ist
für die ausdrücklich gewünschte Nutzung ohne sichtbare Anmeldung akzeptiert.

### Direkt sichtbare Vorschläge

Neue Einträge werden nicht moderiert und erscheinen sofort. Zur Begrenzung von
Missbrauch gelten:

- Datenbankseitige Längen- und Formatregeln
- Dateityp- und Dateigrößenlimits
- Zufällige Dateinamen statt Nutzer-Dateinamen
- Keine HTML-Ausgabe aus Nutzereingaben
- Begrenzung auf einen neuen Vorschlag pro anonymer Identität innerhalb eines
  kurzen Zeitfensters, soweit mit Supabase-Richtlinien und Datenbankfunktion
  zuverlässig umsetzbar

Ein öffentliches System ohne Captcha oder echte Anmeldung kann Spam nicht
vollständig verhindern. Die Dokumentation erklärt, wie Einträge direkt im
Supabase-Dashboard gelöscht werden.

### Fehler und leere Zustände

- Ohne Supabase-Konfiguration zeigt die Seite die initialen Geräte und einen
  klaren Einrichtungszustand; Formulare und Votes sind deaktiviert.
- Netzwerkfehler erscheinen als kurze, konkrete Meldung mit erneutem Versuch.
- Eine leere Vorschlagsliste fordert zum ersten Vorschlag auf.
- Defekte oder entfernte Bilder werden durch eine neutrale, echte
  Fallback-Grafik ersetzt.

## 7. Technische Architektur

### Frontend

- React mit TypeScript
- Vite für Entwicklung und statischen Build
- CSS Modules oder fokussierte globale Styles mit Design-Tokens
- Lucide Icons für Interface-Symbole
- Keine serverseitige Laufzeit auf GitHub Pages
- GitHub-Pages-kompatible relative Asset-Pfade

### Supabase

- PostgreSQL-Tabelle `equipment_items`
- PostgreSQL-Tabelle `votes`
- Öffentlicher Storage-Bucket `suggestion-images`
- Aktivierte anonyme Authentifizierung
- Row Level Security für Lesen, Erstellen und eigene Votes
- Datenbankfunktion für atomare Stimmwechsel
- Seed-Daten für Rückenstrecker, 5-kg-Hanteln und digitale Wanduhr

Vorgeschlagenes Datenmodell:

```text
equipment_items
  id uuid primary key
  title text
  description text nullable
  external_url text nullable
  image_url text nullable
  estimated_price_cents integer nullable
  is_seeded boolean
  created_by uuid nullable
  created_at timestamptz

votes
  item_id uuid references equipment_items
  user_id uuid references auth.users
  value smallint check value in (-1, 1)
  created_at timestamptz
  updated_at timestamptz
  primary key (item_id, user_id)
```

Öffentliche Supabase-URL und `anon`- beziehungsweise `publishable`-Key werden
als Vite-Umgebungsvariablen verwendet. Diese Werte sind für Browser-Apps
vorgesehen; Schutz entsteht durch Row Level Security, nicht durch Geheimhaltung
des Keys.

### Konfiguration

Zentrale Konfigurationswerte:

- PayPal-Spendenlink
- Spendenziel in Cent
- Bereits gesammelter Beispielbetrag in Cent
- Vereinsname und Projekttexte
- Supabase-URL und öffentlicher Key

Beispielwerte werden deutlich als Beispiel gekennzeichnet und sind an einer
zentralen Stelle austauschbar.

## 8. Responsive Verhalten

- Mobile-first ab 320 Pixel Breite
- Mindestens 44 mal 44 Pixel große Touch-Ziele
- Einspaltige Karten und Formulare auf Smartphones
- Zwei bis drei Kartenspalten auf größeren Displays, abhängig vom Inhalt
- Sticky Spendenaktion am unteren Rand auf kleinen Displays, ohne Inhalte oder
  Systemnavigation zu verdecken
- Respekt vor `prefers-reduced-motion`
- Keine horizontale Scrollbar bei langen Titeln, URLs oder Fehlermeldungen

## 9. Bewegung

Animation unterstützt nur die Orientierung:

- Kurzes gestaffeltes Einblenden der Hauptbereiche beim ersten Laden
- Sichtbare, aber zurückhaltende Statusänderung bei Votes
- Fortschrittsbalken animiert einmal zum aktuellen Wert
- Keine permanenten Pulseffekte
- Alle nicht notwendigen Animationen entfallen bei reduzierter Bewegung

## 10. Tests und Qualität

Automatisierte Tests decken mindestens ab:

- Konfigurations-Fallback ohne Supabase
- Sortierung nach Vote-Saldo und Datum
- Validierung von Titel, URL und Bild
- Vote-Zustandswechsel und Rücknahme
- Deaktivierter PayPal-Platzhalter
- Erfolgreiche Formulareinreichung mit Link oder Bild

Zusätzlich werden geprüft:

- Produktions-Build mit korrektem GitHub-Pages-Basispfad
- Responsive Layouts bei 375, 768 und 1440 Pixel Breite
- Tastaturbedienung und sichtbare Fokuszustände
- Kontrast und semantische Überschriftenstruktur
- Fehlerzustand bei fehlender oder nicht erreichbarer Supabase-Instanz

## 11. GitHub Pages und Veröffentlichung

- Git-Repository mit Branch `main`
- GitHub-Actions-Workflow baut die Vite-Anwendung
- Deployment des `dist`-Ordners über GitHub Pages
- `vite.config.ts` ermittelt den Repository-Basispfad für Projektseiten
- Eine README beschreibt lokale Entwicklung, Supabase-Setup, PayPal-
  Konfiguration und Pages-Aktivierung
- Nach Vorliegen der finalen Pages-URL wird ein QR-Code als PNG und SVG erzeugt
  und in der Website beziehungsweise im Ausgabeordner bereitgestellt

Das Pushen kann erst erfolgen, wenn ein Ziel-Repository bekannt oder über die
lokal angemeldete GitHub-CLI angelegt werden kann.

## 12. Nicht im ersten Umfang

- Moderationsoberfläche
- Echtes Spenden-Tracking über die PayPal-API
- Persönliche Profile
- Kommentare
- Push-Benachrichtigungen
- Mehrsprachigkeit
- Garantierter Schutz vor koordiniertem Voting oder Spam

## 13. Offene Inhalte vor öffentlicher Bewerbung

Die Website kann technisch mit Platzhaltern veröffentlicht werden. Vor einer
breiten Bewerbung müssen ersetzt beziehungsweise bestätigt werden:

- PayPal-Spendenlink
- Tatsächliche Preise
- Tatsächliches Gesamtziel und gesammelter Betrag
- Vereinslogo oder Freigabe für eine reine Wortmarke
- Impressumsangaben
- Datenschutzhinweise und verantwortliche Kontaktmöglichkeit

