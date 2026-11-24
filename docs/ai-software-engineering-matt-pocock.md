---
title: KI-gestütztes Software Engineering – Matt Pocock Workflow
sidebar_label: KI-gestütztes Software Engineering
description: Alignment, Kontextmanagement, vertikale Slices, TDD, autonome Agenten, Architektur und kontinuierliche Retrospektive.
---

# KI-gestütztes Software Engineering: Workflows und Methodiken

*Comprehensive Overview – Matt Pocock Workflow*

## 1. Kurze Zusammenfassung (Vorab-Überblick)

Die Integration von Large Language Models (LLMs) in den Softwareentwicklungsprozess erfordert keine Abkehr von etablierten Prinzipien des Software Engineerings, sondern eine verstärkte Anwendung dieser Fundamente. Klassische Kernkonzepte wie Test-Driven Development (TDD), modulare Systemarchitektur (John Ousterhout), vertikale Durchstiche (Tracer Bullets nach *The Pragmatic Programmer*) und eine präzise Domänensprache (Domain-Driven Design) sind bei der Interaktion mit KI-Agenten mindestens ebenso kritisch wie im menschlichen Entwicklerteam.

Der von Matt Pocock beschriebene Workflow basiert auf einer klaren kognitiven und operativen Trennung zwischen **Human-in-the-Loop-Aufgaben** (Strategie, Domänenausrichtung, UI-Geschmack und Architekturfragen) und **AFK-Aufgaben** (Away From Keyboard: autonome Codierung, TDD-Zyklen und automatisierte Feedback-Schleifen).

Der Gesamtablauf gliedert sich in vier zentrale Phasen:

| Phase | Verantwortung | Ergebnis |
| --- | --- | --- |
| 1. Alignment | Mensch + KI | Gemeinsames mentales Designmodell, präzise Domänensprache, abgesicherte Architekturentscheidungen |
| 2. Ziel-Dokumentation und Arbeitsplanung | Mensch + KI | PRD, Spezifikation, vertikale Tickets und Abhängigkeitsgraph (DAG) |
| 3. AFK-Umsetzung und Qualitätssicherung | KI-Agenten mit automatisierten Kontrollen | Isolierte Implementierung, TDD, getestete Änderungen und Review |
| 4. Kontinuierliche Systemhärtung | Mensch + KI | Retrospektive, deterministische Regeln und verbesserte Agenten-Skills |

```text
HUMAN IN THE LOOP
  Grill me / Grill with docs
            |
            v
  Glossar + ADRs + Prototypen
            |
            v
  PRD / Spec -> Tickets (DAG)
            |
============|========================
            v
AFK         +--> Agent A / Worktree A
            +--> Agent B / Worktree B
            +--> Agent C / Worktree C
                         |
                 Red -> Green -> Refactor
                         |
                 Typecheck / Test / Lint
                         |
============|========================
            v
HUMAN + KI  Review / Merge
            |
            v
            Retro -> Regeln / Skills
            |
            +--> nächster Entwicklungszyklus
```

## 2. Technische Beschränkungen von LLMs im Software Engineering

### 2.1 Smart Zone vs. Dumb Zone

Die Leistungsfähigkeit von LLMs bei der Erstellung und Bearbeitung von Code lässt sich anhand des von Dex Horthy (HumanLayer / Factory) beschriebenen Konzepts der **Smart Zone** und **Dumb Zone** diskutieren.

- **Quadratisches Anwachsen von Aufmerksamkeitsbeziehungen:** Bei klassischer dichter Self-Attention wächst die Zahl der möglichen Beziehungen zwischen Token quadratisch (O(n²)). Das ähnelt der Anzahl möglicher Spielpaarungen in einer Sportliga, wenn weitere Mannschaften hinzukommen. Mit zunehmender Kontextfüllung kann die Fähigkeit des Modells, relevante Informationen zuverlässig zu nutzen und konsistente Schlüsse zu ziehen, abnehmen.
- **Grenzen der Smart Zone:** Unabhängig von theoretischen maximalen Kontextfenstern (z. B. 200.000 bis 1 Million Token) nennt der dargestellte Workflow etwa 100.000 bis 150.000 Token als praktische Orientierung für komplexe Aufgaben.
- **Differenzierung nach Einsatzzweck:** Sehr große Kontextfenster können für Informationsabfragen und Text-Retrieval nützlich sein, beispielsweise zum Durchsuchen umfangreicher Dokumentenmengen. Komplexe Codiervorgänge mit hohen Genauigkeitsanforderungen profitieren dagegen von fokussiertem Kontext. Aufgaben sollten so zugeschnitten sein, dass der Agent sie innerhalb seines verlässlichen Arbeitsbereichs abschließen kann.

:::note Einordnung
Die genannten Token-Zahlen sind Erfahrungswerte aus dem beschriebenen Ansatz, keine universell gültigen Grenzen. Modell, Aufgabe, Kontextqualität und Attention-Architektur beeinflussen die tatsächliche Leistungsfähigkeit. Aus der quadratischen Komplexität dichter Attention allein folgt kein bestimmter Qualitätsabfall.
:::

### 2.2 Das Memento-Phänomen und Kontext-Management

LLMs besitzen ohne externe Speicher- oder Retrieval-Mechanismen kein dauerhaftes Sitzungswissen. Bei einer Kontext-Zurücksetzung stehen frühere Gesprächsinhalte nicht mehr automatisch zur Verfügung. Matt Pocock vergleicht diese Eigenschaft mit der Hauptfigur des Films *Memento*.

Eine typische Entwicklungssitzung durchläuft folgende Phasen:

1. **Minimaler System-Prompt (Basis):** Der dauerhaft im jeweiligen Kontext verfügbare Basis-Prompt.
2. **Explorationsphase:** Der Agent durchsucht das Repository und sammelt relevanten Kontext.
3. **Implementierungsphase:** Generierung von Code und Modifikation bestehender Dateien.
4. **Test- und Feedbackphase:** Ausführung von Tests, Lintern und Typprüfungen.
5. **Kontext-Reset (Clear Context):** Rückkehr zu einem frischen Sitzungskontext für die nächste Aufgabe.

| Strategie | Funktionsweise | Konsequenz |
| --- | --- | --- |
| Compacting | Das LLM fasst den bisherigen Gesprächsverlauf zusammen. | Reduziert kurzfristig die Token-Zahl, kann jedoch ungenaue Zusammenfassungen, obsolete Annahmen und verworfene Lösungsansätze als Kontext-Sediment akkumulieren. |
| Clear Context | Nach einem abgeschlossenen logischen Arbeitsschritt wird eine neue Sitzung begonnen. | Der Agent startet mit einem frischen Kontext und liest die relevanten dokumentierten Ergebnisse erneut ein. |

**Schlanke System-Prompts:** Da der System-Prompt bei jedem Aufruf Kontext belegt, sollte er möglichst kompakt bleiben (im beschriebenen Ansatz wenige tausend Token). Ein riesiger System-Prompt, beispielsweise mit 250.000 Token, beansprucht bereits vor der eigentlichen Aufgabe einen großen Teil des verfügbaren Arbeitskontexts.

## 3. Die Ausrichtungs- und Planungsphase (Human-in-the-Loop)

### 3.1 Ablehnung der Specs-to-Code-Doktrin und Code als primäres Arbeitsmedium

Eine im Zuge des KI-Hypes verbreitete Vorstellung von Specs-to-Code bzw. Vibe Coding postuliert, dass Entwickler nur noch Spezifikationen verfassen und den generierten Code nicht mehr selbst verstehen oder lesen müssen. Bei Fehlern werde lediglich die Spezifikation angepasst.

- **Code als primäres Arbeitsmedium:** Bei komplexen Softwaresystemen reicht diese Vorgehensweise nicht aus. Code bleibt das eigentliche Arbeitsmedium des Ingenieurs. Entwickler müssen Architektur, Modulgrenzen und entscheidende Implementierungsdetails verstehen und steuern.
- **Alignment vor Code-Generierung:** Vor der Erstellung von Code durch KI-Agenten soll eine möglichst vollständige gedankliche Ausrichtung zwischen menschlichem Entwickler und KI-Modell stattfinden.

### 3.2 Grill Me und Grill with Docs: Ausrichtung der Domänensprache

Um Ausrichtungsfehler zu vermeiden, beginnt der Prozess vor der Implementierung mit den Skills `grill-me` oder `grill-with-docs`.

- **Funktionsweise:** Das LLM befragt den Entwickler im Einzelfragen-Format über Randbedingungen, Edge Cases, Benutzeroberflächen und Architekturentscheidungen. Ziel ist ein gemeinsames mentales Designmodell (Shared Design Concept nach Fred Brooks, *The Design of Design*).
- **Repository-Glossar (`glossary.mmd`):** Ein zentrales Glossar gewährleistet eine präzise Projektsprache. Begriffe wie diagram, diagram snapshot, thumbnail diagram, cutout und active diagram werden scharf abgegrenzt; Mehrdeutigkeiten werden beseitigt.
- **Architecture Decision Records (ADRs) und Chesterton's Fence:** Das LLM liest historische Architekturentscheidungen. Ein bestehender Architekturzaun soll erst verändert werden, wenn verstanden wurde, warum er ursprünglich errichtet wurde. ADRs bilden historische Leitplanken gegen übereilte Refactorings.
- **Scenario Testing:** Bei der Einführung neuer Domänenbegriffe wird überprüft, wie sich Kandidaten in realen Entwickler-Sätzen bewähren.

| Kandidaten-Begriff | Anwendungsszenario | Bewertung und Konsequenz |
| --- | --- | --- |
| thumbnail diagram snapshot | „Ich habe ein Thumbnail aus dem Agent-Loop-Snapshot gestartet.“ | Zu lang, sprachlich unhandlich und umständlich. |
| thumbnail scene | „Ich habe das Element im Thumbnail-Scene-Editor gezeichnet.“ | Technisch präzise, aber nicht die natürliche Teamsprache; scene existiert bereits an anderer Stelle im Glossar. |
| thumbnail diagram | „Erstelle ein Thumbnail-Diagramm neben dem Gesicht.“ | Entspricht der natürlichen Entwicklersprache; ein ADR soll die Abgrenzung von regulären Top-Level-Diagrammen dokumentieren. |

### 3.3 Prototyping und Reduktion des Entscheidungsraums

Vor der Erstellung von Spezifikationen werden KI-gestützt funktionale oder visuelle Prototypen erzeugt, beispielsweise Varianten A, B und C einer Benutzeroberfläche.

- **Menschliche Geschmacks-Evaluation:** Der Entwickler beurteilt Look & Feel, Ergonomie und Benutzbarkeit direkt in der Praxis.
- **Einschränkung des Entscheidungsraums:** Durch die Festlegung auf eine konkrete Variante (z. B. A auswählen, B und C verwerfen) wird der Handlungs- und Entscheidungsraum autonomer AFK-Agenten eingeschränkt. Agenten können sich dadurch auf die Umsetzung konzentrieren, statt komplexe Geschmacks- und Designentscheidungen eigenständig treffen zu müssen.

### 3.4 Erstellung von PRDs, Specs und Kanban-Tickets

Nach Abschluss der Befragungs- und Prototyping-Phase wird das konsolidierte Wissen in Ziel-Dokumente überführt:

1. **Destination Document (to spec):** Erstellung eines Product Requirements Document (PRD) bzw. einer Spezifikation mit Problemstellung, Lösung, User Stories, konkreten Implementierungs- und Testentscheidungen sowie einer expliziten Out-of-Scope-Liste.
2. **Aufteilung in Tickets (to tickets):** Zerlegung des Destination Documents in feingranulare, möglichst unabhängig bearbeitbare Arbeitseinheiten.
3. **Kanban-Board als DAG:** Strukturierung der Tickets mit expliziten Blockade- und Abhängigkeitsbeziehungen als gerichteter azyklischer Graph (Directed Acyclic Graph). Damit wird definiert, welche Tickets sequenziell bearbeitet werden und welche parallel laufen können.

Beispiel eines Ticket-DAG:

```text
            [A: Basis-Slice]
              /           \
             v             v
   [B: Feature 1]    [C: Feature 2]
             \             /
              v           v
           [D: Integration]
```

B und C können nach A parallel bearbeitet werden; D hängt von beiden ab.

## 4. Die Umsetzungsphase (AFK-Ausführung und Qualitätssicherung)

### 4.1 Vertikale Slices (Tracer Bullets) vs. horizontale Schichten

Bei der Erstellung der Ticket-Struktur wird das LLM angewiesen, Arbeitseinheiten als vertikale Durchstiche zu definieren.

- **Problem horizontaler Arbeit:** Unbeaufsichtigte KI-Agenten neigen dazu, schichtenweise zu arbeiten (zuerst alle Datenbank-Schemata, dann alle API-Endpunkte, schließlich die Benutzeroberfläche). Das verzögert die Integration: Rückkopplung über das Gesamtsystem entsteht erst spät.
- **Vertikale Slices (Tracer Bullets):** Nach dem Prinzip aus *The Pragmatic Programmer* deckt jedes Ticket einen dünnen, funktionalen Durchstich über die benötigten Systemschichten hinweg ab (Datenbank, Service-Logik und UI-Komponente). So entsteht nach jedem abgeschlossenen Ticket ein durchgängig testbares Gesamtsystem.

```text
Horizontal:                 Vertikal:

UI       [-----------]      UI       [1] [2] [3]
API      [-----------]      API      [1] [2] [3]
Service  [-----------]      Service  [1] [2] [3]
DB       [-----------]      DB       [1] [2] [3]

Integration erst spät       Testbares Feature je Slice
```

### 4.2 Test-Driven Development (TDD) als Qualitäts-Obergrenze

TDD ist das zentrale Instrument zur Steuerung von KI-Agenten während der Implementierung.

| Phase | Aufgabe |
| --- | --- |
| Red | Zuerst einen fehlschlagenden Test schreiben, der das gewünschte Verhalten beschreibt. |
| Green | Den Test mit minimal erforderlichem Produktionscode zum Bestehen bringen. |
| Refactor | Den Code bei weiterhin erfolgreichen Tests bereinigen. |

- **Vermeidung von Schummeln:** Werden Tests erst nach der Implementierung geschrieben, können Agenten fehlerhaften Code durch schwache Assertions oder passend gemachte Tests absichern. TDD legt das erwartete Verhalten vor der Implementierung fest.
- **Feedback-Loops als Leistungsobergrenze:** Die Qualität automatisierter Feedback-Schleifen (Linter, Typprüfung, Test-Suites) begrenzt, wie zuverlässig Fehler erkannt werden. Fehlen verlässliche Testumgebungen, sinkt die kontrollierbare Arbeitsqualität der Agenten. Tests ersetzen jedoch nicht alle Architektur- oder Sicherheitsreviews.

### 4.3 Parallele Agenten-Ausführung, Sandboxing und AFK-Loops

Die Implementierung erfolgt in autonomen AFK-Schleifen (Away From Keyboard), beispielsweise Ralph-Loops oder Orchestrierungs-Frameworks wie Sand Castle. Während die Ausrichtungsphase menschliche Präsenz verlangt, läuft die Ausführungsphase weitgehend getrennt vom Entwickler ab.

- **Isolierung:** Jeder Agent arbeitet in einer eigenen Docker-Sandbox und einem isolierten Git Worktree bzw. Git Branch.
- **Parallele Ausführung:** Entlang des im Kanban-Board definierten DAG bearbeiten separate Agenten-Instanzen unabhängige Tickets zeitgleich.

Ablauf eines AFK-Agenten-Durchlaufs:

1. Nächstes unblockiertes Ticket aus dem DAG-Backlog auslesen.
2. TDD (Red-Green-Refactor) zur Bearbeitung des Tickets anwenden.
3. Automatisierte Feedback-Schleifen ausführen: typecheck, test, lint.
4. Bei erfolgreichem Durchlauf den Branch an einen Merge- oder Review-Agenten übergeben.

## 5. Codebase-Architektur und Erhalt des mentalen Modells

### 5.1 Tiefe vs. flache Module (John Ousterhout)

In Anlehnung an John Ousterhouts *A Philosophy of Software Design* unterscheidet die Methodik zwischen zwei Modultypen:

| Eigenschaft | Flaches Modul (Shallow Module) | Tiefes Modul (Deep Module) |
| --- | --- | --- |
| Schnittstelle | Breit oder komplex | Einfach und schmal |
| Interne Funktionalität | Gering im Verhältnis zur Schnittstelle | Umfangreiche, verborgene Funktionalität |
| Abhängigkeiten | Oft viele gegenseitige Abhängigkeiten | Implementierungsdetails werden gekapselt |
| Testbarkeit | Testgrenzen schwerer zu setzen | Tests lassen sich an der öffentlichen Schnittstelle ausrichten |
| KI-Kontext | Gefahr aufgeblähter Abhängigkeitsgraphen | Fokussierter Kontext |

Unbeaufsichtigte KI kann flache Strukturen begünstigen, indem sie Logik in viele kleine Dateien auslagert. Tiefe Module bieten dagegen klare Testgrenzen und kapseln interne Komplexität hinter einer einfachen API. Die Modultiefe ergibt sich nicht allein aus der Dateigröße oder Dateianzahl.

### 5.2 Das Gray-Box-Prinzip zum Schutz des mentalen Modells

Durch die hohe Generierungsgeschwindigkeit der KI droht Entwicklern das mentale Modell über die eigene Codebase zu entgleiten.

- **Konzept der Gray Boxes:** Entwickler definieren und verstehen Modul-Schnittstellen und deren äußeres Verhalten präzise. Die konkrete innere Implementierung wird innerhalb dieser Grenzen an die KI delegiert.
- **Nutzen:** Der Entwickler behält die Kontrolle über Makro-Architektur und Systemdesign, ohne jede einzelne Implementierungszeile im Kopf behalten zu müssen.

```text
          Mensch versteht und kontrolliert
                         |
                         v
              +---------------------+
              | Öffentliche API     |
              +---------------------+
              |                     |
              | Interne Komplexität |  <-- KI-Umsetzung
              | (Gray Box)          |
              |                     |
              +---------------------+
                         |
                         v
                 Tests am Verhalten
```

## 6. Code-Review, Stacked Diffs und kontinuierliche Retrospektive (Retro-Skill)

### 6.1 Review-Strategien: Stacked Diffs, Feature Flags und 2-Way- vs. 1-Way-Doors

Umfangreiche KI-Generierungen, beispielsweise Pull Requests mit mehreren tausend Zeilen Code, erfordern strukturierte Review- und Zerlegungsverfahren.

- **Stacked Diffs:** Große Änderungen (im Beispiel 21.000–25.000 Zeilen) werden in eine Kette kleinerer, aufeinander aufbauender PRs zerlegt, die einzeln überprüfbar sind.
- **Feature Flags:** Ermöglichen das schrittweise Mergen von Codeinfrastruktur, bevor die Funktionalität final freigeschaltet wird.

| Änderungstyp | Eigenschaften | Beispiele und Review |
| --- | --- | --- |
| 2-Way-Door | Gut reversible Änderungen | Interne Refactorings und isolierte UI-Komponenten; nach Prüfung leichter rückgängig zu machen. |
| 1-Way-Door | Schwer umkehrbare, kritische Änderungen | Datenbank-Schema-Migrationen, externe Dienste und Sicherheitsarchitekturen; zwingendes manuelles Review im beschriebenen Workflow. |

Auch reversible Änderungen benötigen risikogerechte Tests und Review. Feature Flags verhindern nicht automatisch Nebenwirkungen von Migrationen oder Infrastrukturänderungen.

### 6.2 Der Retro-Skill und die Härtung der Entwicklungs-Umgebung

Im Workflow dient menschliches Code-Review nicht primär dazu, fehlerhaften Code Zeile für Zeile manuell auszubessern. Stattdessen dient es auch als Diagnosewerkzeug, um zugrunde liegende Code Smells und Schwachstellen im Entwicklungssystem zu identifizieren.

**Analyse von Sitzungsprotokollen:** Der Skill `retro` analysiert automatisiert die Protokolle vergangener Agenten-Sitzungen (im Beispiel 30 Transkripte) sowie menschliche Review-Kommentare (im Beispiel 12 Anmerkungen).

**Transformation von Kritik in deterministische Regeln:** Erkannte Muster und Workarounds werden in maschinell erzwingbare Regeln (Ratcheted Lint Rules, z. B. ESLint oder Oxlint) transformiert.

| Wiederkehrendes Problem | Mögliche deterministische Regel |
| --- | --- |
| Unkontrollierte TypeScript-Type-Assertions mit `as` | Einschränkung außerhalb zentraler Utility-Dateien; im Beispiel über 2.000 Altlast-Instanzen. |
| Unkontrollierte Nebenwirkungen durch `useEffect` | Projektspezifische Lint-Regeln, beispielsweise Einschränkungen in Hooks-Ordnern. |
| `useSearchParams` mit Magic Strings | Typisierte Search-Param-Helper erzwingen. |
| Überflüssige Inline-Kommentare | Unnötige Kommentare reduzieren, die schlechte Implementierungen verdecken oder Kontext belasten; hilfreiche Begründungen erhalten. |

Ratcheting bedeutet, neue Verstöße zu verhindern und bestehende Altlasten schrittweise zu reduzieren, statt alle Probleme sofort beheben zu müssen.

**Kontinuierliche Systemhärtung:** Das Feedback des Entwicklers fließt in System-Prompts, Linter-Konfigurationen, Repository-Dokumente (z. B. `coding-standards.mmd`) und Agenten-Skills zurück. Das Gesamtsystem kann dadurch mit jedem Entwicklungszyklus robuster gegen wiederkehrende Fehler werden.

```text
Agenten-Sessions + Review-Kommentare
                 |
                 v
           Muster erkennen
                 |
                 v
      Regel / Test / Skill verbessern
                 |
                 v
          CI erzwingt Regel
                 |
                 v
       Nächste Agenten-Sitzung
```

## Praktische Checkliste für die Anwendung

- [ ] Domänensprache und bestehende ADRs prüfen.
- [ ] Alignment-Fragen klären, offene Entscheidungen dokumentieren.
- [ ] UI-Prototypen bei Bedarf bewerten und Variante auswählen.
- [ ] PRD, Akzeptanzkriterien und Out-of-Scope festhalten.
- [ ] Vertikale Tickets mit expliziten Abhängigkeiten erstellen.
- [ ] Agenten isoliert mit frischem Kontext starten.
- [ ] Red-Green-Refactor sowie Typecheck, Tests und Lint ausführen.
- [ ] Änderungen in kleinen Diffs überprüfen; kritische Entscheidungen manuell freigeben.
- [ ] Wiederkehrende Fehler durch Tests, Lint-Regeln, ADRs oder Skills verhindern.

## Quellenhinweis

Grundlage dieser Seite ist die bereitgestellte Zusammenfassung des Matt-Pocock-Workflows. Die zwei im Ausgangstext erwähnten Quellen wurden nicht mit Titel oder URL übermittelt; konkrete Quellenverweise und die genannten Beispielzahlen sind deshalb nicht unabhängig verifiziert.

Im Ausgangstext genannte weiterführende Literatur:

- Fred Brooks: *The Design of Design* – Shared Design Concept.
- John Ousterhout: *A Philosophy of Software Design* – tiefe Module.
- Andrew Hunt und David Thomas: *The Pragmatic Programmer* – Tracer Bullets.
- Eric Evans: *Domain-Driven Design* – präzise Domänensprache als thematisch weiterführende Literatur.
