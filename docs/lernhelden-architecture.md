---
title: Lernhelden-Architektur
---

# Lernhelden erweitern

Lernhelden besteht aus einer React-/Vite-App und einer UI-unabhängigen Engine. Docusaurus bindet den fertigen Build unter `/games/lernhelden/` ein.

## Neues Abenteuer

Ein Abenteuer implementiert `AdventureDefinition` und registriert sich in `apps/lernhelden/src/adventures/index.ts`. Erforderlich sind stabile IDs, Währung, Ränge, Slots, Items, Gegner, Lernmodi, ein `QuestionProvider`, Weltdefinition, Theme, Sprites und Erfolge. Gemeinsame Kampf-, Shop-, Inventar- und Speicherlogik darf nicht im Abenteuer dupliziert werden.

## Spielstände

Das Profil liegt unter `players/{uid}`. Abenteuerstände liegen getrennt unter `players/{uid}/adventures/{adventureId}`. Änderungen erhalten eine steigende Revision. Bei Offline-Konflikten gewinnt die neueste Cloud-Revision. Legacy-Felder werden nur gelesen und während der Übergangszeit nicht gelöscht.

## Pixelgrafiken

Der Atlas verwendet sechs Spalten und sechs Reihen. Die Engine referenziert Sprites ausschließlich über `SpriteRef`. Sichtbare Spielsymbole dürfen nicht durch Emojis ersetzt werden. CSS und Canvas rendern mit deaktivierter Bildglättung.

## Qualitätssicherung

Vor einem Release müssen Typprüfung, Unit-Tests, Legacy-Prüfsummen, Playwright-Test und der vollständige Produktions-Build erfolgreich sein. Das alte Brüche-Spiel bleibt über die Prüfsummen geschützt, bis seine Migration separat abgenommen wurde.
