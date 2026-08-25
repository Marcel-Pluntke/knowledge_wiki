---
title: ChatGPT → GitHub Pages
---

# Von ChatGPT zur fertigen GitHub-Pages-Seite

Diese Seite beschreibt den tatsächlichen Ablauf im Repository `Marcel-Pluntke/knowledge_wiki`: von einer Anweisung in ChatGPT über die Änderung im GitHub-Repository bis zur automatisch veröffentlichten Docusaurus-Seite auf GitHub Pages.

> **Kurzfassung:** Prompt in ChatGPT → GitHub-Verbindung → Commit im Repository → GitHub Actions → Docusaurus-Build → GitHub Pages.

## Gesamtübersicht

```text
┌──────────────────────┐
│ 1. Prompt in ChatGPT │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ 2. GitHub-App / Verbindung   │
│    liest relevante Dateien   │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ 3. ChatGPT erstellt/ändert   │
│    Dateien im Repository     │
└──────────┬───────────────────┘
           │ Commit / Push auf main
           ▼
┌──────────────────────────────┐
│ 4. GitHub Actions startet    │
│    .github/workflows/deploy  │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ 5. Prüfen + Docusaurus Build │
│    npm ci                    │
│    npm run typecheck         │
│    npm test                  │
│    npm run build             │
└──────────┬───────────────────┘
           │ build/
           ▼
┌──────────────────────────────┐
│ 6. Pages-Artefakt hochladen  │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ 7. GitHub Pages Deployment   │
│    fertige Website online    │
└──────────────────────────────┘
```

## 1. Die Anweisung startet in ChatGPT

Der Ablauf beginnt mit einer normalen Anweisung, zum Beispiel:

```text
Bringe auf meine Knowledge-Board-Seite ein neues Topic ein und veröffentliche es im Repository.
```

ChatGPT zerlegt die Aufgabe in einzelne Schritte: passende Dateien finden, vorhandene Struktur verstehen, Änderung erstellen, betroffene Dateien aktualisieren und die Änderung in GitHub schreiben.

Wichtig ist dabei, dass nicht blind eine neue Datei erzeugt wird. Zuerst werden zum Beispiel bestehende Seiten, Komponenten, Sidebar-Konfigurationen oder Workflows gelesen, damit die Änderung zur vorhandenen Struktur passt.

## 2. Wie ChatGPT auf GitHub zugreift

Der Zugriff läuft über die mit ChatGPT verbundene **GitHub-App bzw. GitHub-Verbindung**. Diese Verbindung wird einmal autorisiert und auf die gewünschten Repositories beschränkt.

In diesem Setup kann ChatGPT das Repository `Marcel-Pluntke/knowledge_wiki` lesen und – wenn die freigegebenen Aktionen und Berechtigungen es erlauben – Dateien erstellen oder aktualisieren.

Die Verbindung besteht damit aus drei Ebenen:

| Ebene | Aufgabe |
| --- | --- |
| ChatGPT | Versteht die Anweisung und entscheidet, welche Repository-Inhalte benötigt werden. |
| GitHub-Verbindung | Stellt die autorisierten Lese- und Schreibaktionen für freigegebene Repositories bereit. |
| GitHub Repository | Enthält den tatsächlichen Quellcode, die Doku, Docusaurus-Konfiguration und Workflows. |

ChatGPT benötigt dafür keinen im Wiki gespeicherten GitHub-Personal-Access-Token. Welche Repositories verfügbar sind, wird über die autorisierte GitHub-Verbindung und deren Berechtigungen gesteuert.

### Lesen

Zum Verstehen des Projekts können unter anderem folgende Inhalte abgefragt werden:

- einzelne Dateien,
- Verzeichnisse,
- Branches und Commits,
- Quellcode und Markdown-Dateien,
- GitHub-Workflow-Dateien.

### Schreiben

Bei einer gewünschten Änderung kann ChatGPT beispielsweise:

- eine neue Datei erstellen,
- eine vorhandene Datei vollständig aktualisieren,
- einen Commit mit Commit-Nachricht erzeugen,
- je nach Aufgabe direkt auf `main` oder auf einem separaten Branch arbeiten.

Für dieses Knowledge Wiki wird bei direkten Änderungen auf `main` anschließend automatisch der Deployment-Workflow ausgelöst.

## 3. Welche Dateien für eine neue Knowledge-Wiki-Seite zusammenspielen

Eine Änderung an der sichtbaren Website kann mehrere Repository-Bereiche betreffen:

| Bereich | Bedeutung |
| --- | --- |
| `docs/` | Markdown-Dokumentation und einzelne Topics |
| `src/components/` | React-Komponenten, z. B. Karten auf der Startseite |
| `src/pages/` | Eigene Docusaurus-Seiten |
| `sidebars.ts` | Legt fest, welche Dokumente in der Topics-Navigation erscheinen |
| `docusaurus.config.ts` | Zentrale Docusaurus- und GitHub-Pages-Konfiguration |
| `.github/workflows/` | Automatischer Build und Deployment |

Bei diesem Topic werden zum Beispiel die neue Dokumentationsseite, die Sidebar und die Knowledge-Board-Karte miteinander verknüpft.

## 4. Commit und Push lösen GitHub Actions aus

Der Deployment-Workflow liegt hier:

[`/.github/workflows/deploy.yml`](https://github.com/Marcel-Pluntke/knowledge_wiki/blob/main/.github/workflows/deploy.yml)

Er reagiert auf:

```yaml
on:
  push:
    branches: [main]
```

Damit gilt:

```text
Änderung auf main
        ↓
GitHub registriert den Push
        ↓
deploy.yml startet automatisch
```

Es ist also kein manueller Upload der Website notwendig.

## 5. Build-Job: Repository prüfen und Docusaurus bauen

Der erste Job läuft auf einem GitHub-gehosteten Ubuntu Runner.

### Checkout

```yaml
- uses: actions/checkout@v4
```

Dadurch bekommt der Runner den aktuellen Stand des Repositorys.

### Node.js bereitstellen

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
```

Das Projekt wird mit Node.js 20 ausgeführt. Zusätzlich wird der npm-Cache genutzt.

### Abhängigkeiten installieren

```bash
npm ci
```

`npm ci` installiert exakt die Versionen aus der Lock-Datei und ist daher für reproduzierbare CI-Builds geeignet.

### Typprüfung

```bash
npm run typecheck
```

TypeScript-Fehler sollen den Build stoppen, bevor eine fehlerhafte Seite veröffentlicht wird.

### Tests

```bash
npm test
```

Die normalen automatisierten Tests werden vor dem Produktions-Build ausgeführt.

Die Playwright-E2E-Tests sind bewusst nicht Bestandteil dieses Pages-Deployments. Dadurch bleibt die Veröffentlichung unabhängig von einer zusätzlichen Browser-Installation.

### Produktions-Build

```bash
npm run build
```

Docusaurus verarbeitet anschließend unter anderem:

- Markdown-Dokumente,
- React-Komponenten,
- Navigation und Sidebar,
- CSS,
- statische Dateien,
- interne Links.

Das fertige statische Ergebnis landet im Ordner:

```text
build/
```

## 6. Build-Artefakt an GitHub Pages übergeben

Nach erfolgreichem Build wird der erzeugte Ordner hochgeladen:

```yaml
- uses: actions/upload-pages-artifact@v3
  with:
    path: build
```

GitHub Pages bekommt damit nicht den TypeScript- oder Markdown-Quellcode direkt, sondern das bereits fertig gebaute statische Web-Artefakt.

## 7. Deployment auf GitHub Pages

Der zweite Job startet erst, wenn der Build erfolgreich war:

```yaml
deploy:
  needs: build
```

Die Veröffentlichung erfolgt mit:

```yaml
- uses: actions/deploy-pages@v4
```

Dafür verwendet der Workflow das GitHub-Environment `github-pages` und die dafür vorgesehenen Berechtigungen:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

Nach erfolgreichem Deployment ist die Website unter der in Docusaurus konfigurierten Project-Pages-Adresse erreichbar:

**https://Marcel-Pluntke.github.io/knowledge_wiki/**

## 8. Verbindung zwischen Docusaurus und GitHub Pages

Die entscheidenden Angaben stehen in `docusaurus.config.ts`:

```ts
url: 'https://Marcel-Pluntke.github.io',
baseUrl: '/knowledge_wiki/',
organizationName: 'Marcel-Pluntke',
projectName: 'knowledge_wiki',
```

Daraus ergibt sich die öffentliche Basisadresse:

```text
https://Marcel-Pluntke.github.io/knowledge_wiki/
```

Eine Dokumentationsseite wie

```text
docs/chatgpt-github-pages-workflow.md
```

wird von Docusaurus als Seite unterhalb des Docs-Bereichs bereitgestellt.

## 9. Die vollständige Verknüpfung

```text
Benutzer
   │
   │ Prompt
   ▼
ChatGPT
   │
   │ autorisierte GitHub-App / GitHub-Aktionen
   ▼
GitHub Repository: Marcel-Pluntke/knowledge_wiki
   │
   │ Commit auf main
   ▼
GitHub Actions: deploy.yml
   │
   ├─ Checkout
   ├─ Node 20
   ├─ npm ci
   ├─ Typecheck
   ├─ Tests
   └─ Docusaurus Build
          │
          ▼
        build/
          │
          ▼
GitHub Pages Artifact
          │
          ▼
GitHub Pages Deployment
          │
          ▼
https://Marcel-Pluntke.github.io/knowledge_wiki/
```

## 10. Was passiert bei einem Fehler?

Wenn `npm ci`, Typecheck, Tests oder der Docusaurus-Build fehlschlagen, wird der Build-Job abgebrochen. Da der Deployment-Job `needs: build` verwendet, wird die fehlerhafte Version nicht auf GitHub Pages veröffentlicht.

Damit wirkt GitHub Actions gleichzeitig als automatische Qualitätsbarriere zwischen einem Commit und der öffentlichen Website.

## 11. Konkretes Beispiel: dieses Topic

Auch diese Seite selbst folgt genau der beschriebenen Kette:

1. In ChatGPT wurde das neue Topic angefordert.
2. ChatGPT hat die aktuelle Knowledge-Board-Komponente, Sidebar, Docusaurus-Konfiguration und `deploy.yml` gelesen.
3. Die neue Markdown-Seite wurde im Repository angelegt.
4. Knowledge Board und Sidebar wurden mit dieser Seite verknüpft.
5. Die Änderungen wurden auf `main` committed.
6. GitHub Actions übernimmt Build und Deployment.
7. Nach erfolgreichem Workflow ist das Topic auf der GitHub-Pages-Version des Knowledge Wiki sichtbar.

## Nützliche Links

- [Repository](https://github.com/Marcel-Pluntke/knowledge_wiki)
- [GitHub Actions](https://github.com/Marcel-Pluntke/knowledge_wiki/actions)
- [Deployment-Workflow](https://github.com/Marcel-Pluntke/knowledge_wiki/blob/main/.github/workflows/deploy.yml)
- [Docusaurus-Konfiguration](https://github.com/Marcel-Pluntke/knowledge_wiki/blob/main/docusaurus.config.ts)
- [Knowledge Wiki auf GitHub Pages](https://Marcel-Pluntke.github.io/knowledge_wiki/)

---

**Stand:** August 2026. Die genaue ChatGPT-Oberfläche für verbundene Apps kann sich ändern; technisch entscheidend bleiben die in GitHub freigegebenen Repository-Berechtigungen und die im Repository hinterlegten Workflows.
