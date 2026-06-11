# Kraftraum Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine mobile-first Kraftraum-Website für SF Schwaikheim Handball als statischen GitHub-Pages-Build mit Supabase-basierten Vorschlägen, Uploads und Votes erstellen.

**Architecture:** React und Vite erzeugen ausschließlich statische Dateien. Eine kleine Repository-Schnittstelle kapselt Supabase; ohne Umgebungsvariablen liefert sie einen klaren Einrichtungszustand und die drei lokalen Startgeräte bleiben sichtbar. Supabase SQL definiert Tabellen, RLS, Storage und atomare Vote-Funktionen.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, Supabase JS, Lucide React, CSS, GitHub Actions

---

## Dateistruktur

- `src/config/site.ts`: Vereins-, Spenden- und Geräte-Konfiguration
- `src/types.ts`: Domänentypen
- `src/lib/equipment.ts`: Sortierung, Vote-Übergänge und Formatierung
- `src/lib/validation.ts`: Vorschlagsvalidierung
- `src/lib/supabase.ts`: optionale Client-Erstellung
- `src/services/equipmentRepository.ts`: Datenzugriff, Uploads und Votes
- `src/components/*`: Header, Hero, Karten, Formular, Footer und Status
- `src/App.tsx`: Seitenkomposition und Zustandskoordination
- `src/styles.css`: Design-Tokens, responsives Layout und Animation
- `supabase/schema.sql`: vollständige Datenbank- und RLS-Einrichtung
- `.github/workflows/deploy-pages.yml`: statischer Pages-Build
- `README.md`: Einrichtung und Betrieb

### Task 1: Projekt- und Testbasis

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`

- [ ] **Step 1: Tooling konfigurieren**

Scripts:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "test": "vitest run",
  "test:watch": "vitest",
  "lint": "eslint ."
}
```

- [ ] **Step 2: Abhängigkeiten installieren**

Run: `npm install`

- [ ] **Step 3: Leeren Testlauf prüfen**

Run: `npm test -- --passWithNoTests`
Expected: Exit 0.

### Task 2: Domänenlogik testgetrieben

**Files:**
- Create: `src/types.ts`
- Create: `src/lib/equipment.test.ts`
- Create: `src/lib/equipment.ts`
- Create: `src/lib/validation.test.ts`
- Create: `src/lib/validation.ts`

- [ ] **Step 1: Fehlende Sortier- und Vote-Funktionen testen**

```ts
expect(sortEquipment(items).map((item) => item.id)).toEqual(["popular", "newer"]);
expect(nextVote(null, 1)).toBe(1);
expect(nextVote(1, 1)).toBe(null);
expect(nextVote(-1, 1)).toBe(1);
```

- [ ] **Step 2: RED verifizieren**

Run: `npm test -- src/lib/equipment.test.ts`
Expected: FAIL wegen fehlender Implementierung.

- [ ] **Step 3: Minimale Logik implementieren**

`sortEquipment` sortiert nach `score`, dann `createdAt`; `nextVote` schaltet,
entfernt oder wechselt eine Stimme.

- [ ] **Step 4: Vorschlagsvalidierung testen**

Tests decken leeren Titel, zu lange Texte, ungültige URLs, fehlenden Link/Bild,
unzulässige Dateitypen und Dateien über 5 MB ab.

- [ ] **Step 5: RED und GREEN verifizieren**

Run: `npm test -- src/lib`
Expected: Alle Domänentests bestehen.

### Task 3: Supabase-Schicht testgetrieben

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/services/equipmentRepository.test.ts`
- Create: `src/services/equipmentRepository.ts`
- Create: `.env.example`

- [ ] **Step 1: Nicht konfigurierte Umgebung testen**

```ts
expect(createEquipmentRepository({ url: "", key: "" }).mode).toBe("setup");
```

- [ ] **Step 2: RED verifizieren**

Run: `npm test -- src/services/equipmentRepository.test.ts`
Expected: FAIL wegen fehlendem Repository.

- [ ] **Step 3: Repository implementieren**

Die Schnittstelle stellt `list`, `submit`, `vote` und `ensureAnonymousSession`
bereit. Ohne Konfiguration geben Schreiboperationen einen erklärenden Fehler
zurück. Mit Konfiguration werden Supabase Auth, Storage und RPC verwendet.

- [ ] **Step 4: GREEN verifizieren**

Run: `npm test -- src/services/equipmentRepository.test.ts`
Expected: PASS.

### Task 4: Seitenkomponenten testgetrieben

**Files:**
- Create: `src/config/site.ts`
- Create: `src/components/DonationButton.test.tsx`
- Create: `src/components/DonationButton.tsx`
- Create: `src/components/VoteControl.test.tsx`
- Create: `src/components/VoteControl.tsx`
- Create: `src/components/SuggestionForm.test.tsx`
- Create: `src/components/SuggestionForm.tsx`
- Create: `src/components/EquipmentCard.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/Hero.tsx`
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: PayPal-Platzhalter testen**

Ohne URL ist die Schaltfläche ein Button und zeigt einen Hinweis; mit URL ist
sie ein sicherer externer Link.

- [ ] **Step 2: Vote-Control testen**

Die aktive Stimme besitzt `aria-pressed="true"` und alle Touch-Ziele haben
eindeutige Beschriftungen.

- [ ] **Step 3: Formular testen**

Das Formular zeigt Inline-Fehler, blockiert ungültige Eingaben und ruft bei
gültigem Link oder Bild `onSubmit` auf.

- [ ] **Step 4: Komponenten minimal implementieren**

Semantische Überschriften, persistente Labels, Statusmeldungen mit
`aria-live`, externe Links mit `noopener noreferrer`.

- [ ] **Step 5: Komponententests verifizieren**

Run: `npm test -- src/components`
Expected: PASS.

### Task 5: App, visuelles System und Assets

**Files:**
- Create: `src/App.test.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `public/assets/kraftraum-hero.webp`
- Create: `public/assets/rueckenstrecker.webp`
- Create: `public/assets/hanteln-5kg.webp`
- Create: `public/assets/wanduhr.webp`
- Create: `public/assets/quad-rack.webp`
- Create: `public/assets/image-fallback.webp`

- [ ] **Step 1: App-Zustände testen**

Testet Startgeräte, Setup-Hinweis, Sortierung, optimistisches Voting mit
Rollback und unmittelbares Einfügen eines Vorschlags.

- [ ] **Step 2: RED verifizieren**

Run: `npm test -- src/App.test.tsx`
Expected: FAIL wegen fehlender App.

- [ ] **Step 3: Illustrationen erzeugen**

Ein konsistenter, kantiger Editorial-Stil in Rot, Anthrazit und Off-White,
ohne Text, Logos oder Wasserzeichen.

- [ ] **Step 4: App und responsives CSS implementieren**

Hero, Meilenstein, Geräte-Raster, Vorschlagsbereich, Formular, Footer und
mobile Spendenleiste. Breakpoints folgen dem Inhalt; Fokus und reduzierte
Bewegung sind explizit gestaltet.

- [ ] **Step 5: GREEN verifizieren**

Run: `npm test -- src/App.test.tsx`
Expected: PASS.

### Task 6: Supabase-Schema

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: Tabellen und Constraints definieren**

`equipment_items` und `votes` mit UUIDs, Längenlimits, URL-Prüfung,
Preisprüfung und `value in (-1, 1)`.

- [ ] **Step 2: RLS und Funktionen definieren**

Öffentliches Lesen, authentifiziertes anonymes Einreichen, eigene Votes und
eine `set_equipment_vote`-RPC für atomare Änderungen.

- [ ] **Step 3: Storage definieren**

Öffentlicher Bucket mit 5-MB-Limit und MIME-Typen JPEG, PNG, WebP; Uploads nur
in einem Pfad unter der eigenen User-ID.

- [ ] **Step 4: Seed-Daten einfügen**

Deterministische UUIDs für Rückenstrecker, Hanteln und Wanduhr.

### Task 7: Build, Dokumentation und GitHub Pages

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Create: `README.md`
- Create: `.gitignore`
- Create: `public/404.html`

- [ ] **Step 1: Pages-Workflow erstellen**

Der Workflow installiert mit `npm ci`, testet, baut mit Repository-Basispfad
und veröffentlicht `dist` über `actions/deploy-pages`.

- [ ] **Step 2: README schreiben**

Lokale Befehle, Supabase-SQL, anonyme Auth, GitHub-Secrets, PayPal-Konfiguration,
rechtliche Platzhalter und Spam-Grenzen dokumentieren.

- [ ] **Step 3: Vollständige Verifikation**

Run: `npm test && npm run lint && npm run build`
Expected: Alle Befehle Exit 0.

### Task 8: Repository und Deployment

**Files:**
- Modify: Git history and remote configuration
- Create: `public/assets/kraftraum-qr.png`
- Create: `public/assets/kraftraum-qr.svg`

- [ ] **Step 1: Feature-Änderungen committen**

Run: `git add . && git commit -m "feat: build kraftraum voting website"`

- [ ] **Step 2: Öffentliches GitHub-Repository erstellen**

Run: `gh repo create MarcBaumholz/kraftraum-sf-schwaikheim --public --source=. --remote=origin --push`

- [ ] **Step 3: GitHub Pages aktivieren**

Pages wird auf GitHub Actions als Quelle gesetzt; der Workflow wird geprüft.

- [ ] **Step 4: QR-Code für finale URL erzeugen**

Ziel: `https://marcbaumholz.github.io/kraftraum-sf-schwaikheim/`

- [ ] **Step 5: QR-Code committen und pushen**

Run: `git add public/assets/kraftraum-qr.* && git commit -m "feat: add pages qr code" && git push`

- [ ] **Step 6: Live-Seite verifizieren**

HTTP-Status, HTML-Titel, Asset-Ladevorgänge und mobile Kernansicht werden
gegen die veröffentlichte URL geprüft.

