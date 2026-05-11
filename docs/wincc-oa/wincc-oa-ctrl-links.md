---
title: WinCC OA CTRL Link-Sammlung
description: Wichtige Links zur WinCC OA Programmiersprache CTRL / Control und passenden Developer-Dokumenten.
---

# WinCC OA – wichtige Links zur Programmiersprache CTRL / Control

Diese Seite sammelt wichtige offizielle Links zur Programmiersprache **CTRL / Control** in **WinCC OA**.

CTRL ist die interne Skript- und Programmiersprache von WinCC OA. Sie wird unter anderem für Logik, Panels, Datapoint-Zugriffe, Automatisierung und einfache Hintergrundskripte verwendet.

## Wichtigste Einstiegslinks

| Nr. | Thema | Link |
|---:|---|---|
| 1 | Introduction to CTRL – offizieller Einstieg | <https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Control_Grundlagen/Control_Grundlagen.html> |
| 2 | CONTROL – Hauptkapitel der offiziellen Dokumentation | <https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Control_Grundlagen/CONTROL.html> |
| 3 | Deutsche/AT-Version – Introduction to CTRL | <https://www.winccoa.com/documentation/WinCCOA/latest/de_AT/Control_Grundlagen/Control_Grundlagen.html> |
| 4 | WCCOActrl – Control Manager / Skripte ausführen | <https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Manageroptionen/ManagerOptionen-04.html> |
| 5 | Getting Started – Scripting / Datapoints mit CONTROL | <https://www.winccoa.com/documentation/WinCCOA/latest/en_US/GettingStarted/GettingStarted-39.html> |

## PDF- und Download-Dokumente

| Nr. | Dokument | Link |
|---:|---|---|
| 6 | Certified WinCC OA Developer Workshop – PDF | <https://www.winccoa.com/fileadmin/pdf/doc_winccoadev_EN.pdf> |
| 7 | WinCC OA Object-oriented programming and panels – PDF/Download | <https://www.winccoa.com/downloads/detail.html?cHash=0f821ea3cbada3eb37bc470f911521f7&tx_mddownloads_show%5Baction%5D=download&tx_mddownloads_show%5Bcontroller%5D=Download&tx_mddownloads_show%5Bdownload%5D=1513> |
| 8 | WinCC OA Object-oriented programming and panels – zweite PDF/Download-Variante | <https://www.winccoa.com/downloads/detail.html?cHash=2e28c6ef9f10f7473224cc7e13dcb62c&tx_mddownloads_show%5Baction%5D=download&tx_mddownloads_show%5Bcontroller%5D=Download&tx_mddownloads_show%5Bdownload%5D=1517> |
| 9 | Certified WinCC OA Basic Training – PDF/Download | <https://www.winccoa.com/downloads/detail.html?cHash=518d3dd087c5ac4de7d4ea5d5f0aa192&tx_mddownloads_show%5Baction%5D=download&tx_mddownloads_show%5Bcontroller%5D=Download&tx_mddownloads_show%5Bdownload%5D=1370> |
| 10 | Certified WinCC OA Extended Developer Workshop – PDF/Download | <https://www.winccoa.com/downloads/detail.html?cHash=b5f7d202b9421cdd8a4e80039b48333b&tx_mddownloads_show%5Baction%5D=download&tx_mddownloads_show%5Bcontroller%5D=Download&tx_mddownloads_show%5Bdownload%5D=1512> |

## Zusatztool

| Nr. | Tool | Link |
|---:|---|---|
| 11 | Siemens CtrlppCheck – statische Codeanalyse für CTRL / CTRL++ | <https://github.com/siemens/CtrlppCheck> |

## Empfohlene Reihenfolge zum Lernen

1. **Introduction to CTRL** lesen.
2. **CONTROL Hauptkapitel** überfliegen.
3. **WCCOActrl** anschauen, wenn Skripte als Hintergrundlogik laufen sollen.
4. **Datapoint-Funktionen** wie `dpGet()`, `dpSet()` und `dpConnect()` lernen.
5. Erst danach mit **CTRL++ / objektorientierter Programmierung** oder eigenen Extensions beschäftigen.

## Relevanz für AMR zu WinCC OA

Für eine Quick-and-dirty-Anbindung eines AMR-/Messsystems an WinCC OA sind vor allem diese Themen relevant:

- Werte in WinCC OA über Datapoints ablegen
- Messwerte mit `dpSet()` schreiben
- Werte mit `dpGet()` oder `dpConnect()` lesen bzw. überwachen
- einfache Berechnungskanäle in CTRL umsetzen
- ggf. externe Datenquelle über CSV, OPC, ASCII, Modbus oder Python-Zwischenschicht anbinden

Beispielhafter CTRL-Ablauf:

```c
main()
{
  float value;

  // Wert aus einem Datapoint lesen
  dpGet("AMR.Messwert:_online.._value", value);

  // Beispielhafte Berechnung
  value = value * 1.2;

  // Ergebnis in einen anderen Datapoint schreiben
  dpSet("AMR.BerechneterWert:_original.._value", value);
}
```

## Merksatz

Für die reine Gerätekommunikation ist meistens ein Treiber oder eine Schnittstelle wie **OPC UA**, **Modbus**, **ASCII**, **CSV**, **API** oder eine Python-Zwischenschicht zuständig.  
**CTRL** nutzt man dann in WinCC OA, um die eingelesenen Werte weiterzuverarbeiten, zu berechnen, zu prüfen und in Datapoints oder Panels zu verwenden.
