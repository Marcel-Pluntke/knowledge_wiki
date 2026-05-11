---
title: WinCC OA GEDI und grafische Anpassungen
description: Kategorisierte Links und Lernpfad zum WinCC OA Graphics Editor GEDI, Panels, Grafikobjekten, StyleSheets und grafischen Anpassungen.
---

# WinCC OA – GEDI, Panels und grafische Anpassungen

Diese Seite sammelt wichtige Links und Tutorials rund um den **WinCC OA Graphics Editor GEDI**.  
GEDI wird verwendet, um Panels zu erstellen, grafische Objekte zu platzieren, Objekte mit Datenpunkten zu verbinden und Oberflächen grafisch anzupassen.

## 1. Einstieg: GEDI verstehen

| Thema | Link | Nutzen |
|---|---|---|
| Graphics Editor GEDI – Hauptseite | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Native_GEDI/MODULE_GEDI.html) | Zentrale Einstiegsseite zum Graphics Editor. |
| GEDI Grundlagen, Deutsch/AT | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/de_AT/Native_GEDI/Referenz_Native_GEDI.html) | Guter deutschsprachiger Einstieg: Panels erstellen, Grafikobjekte parametrieren, Datenpunkte verknüpfen. |
| GEDI Basics, Englisch | [öffnen](https://www.winccoa.com/documentation/WinCCOA/3.18/en_US/Native_GEDI/Referenz_Native_GEDI.html) | Grundlagen mit Beschreibung von GEDI, Property Sheet, Catalog Window und Script Editor. |
| Creating Process Images – Graphic Editor | [öffnen](https://www.winccoa.com/documentation/WinCCOA/3.18/en_US/GettingStarted/GettingStarted-41.html) | Praktischer Einstieg zum Erstellen von Prozessbildern und Panels. |
| The graphics editor – GEDI DemoApplication | [öffnen](https://www.winccoa.com/documentation/WinCCOA/3.19/en_US/DemoApplication/DemoApplication-42.html) | Tutorial-/Demo-Seite zum Starten von GEDI und Testen mit Beispielpanels. |

## 2. Panels, Panel Window und VISION Runtime

| Thema | Link | Nutzen |
|---|---|---|
| The panel window | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Native_GEDI/Referenz_Native_GEDI-05.html) | Arbeitsfläche im GEDI, Grid, Zoom, Panning und Auswahl überlappender Objekte. |
| User Interface VISION | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Native_UI/Native_User_Interface.html) | Erklärt die Runtime-Oberfläche WCCOAui / VISION und den Zusammenhang zu Panels. |
| Structure of the User Interface VISION | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Native_UI/Structure_of_module_VISION.html) | Aufbau des VISION-Moduls, Panel-Menüs und Startoptionen. |
| Menu Bar im GEDI | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Native_GEDI/Referenz_Native_GEDI-04.html) | Menüs im GEDI, Save Panel, Quicktest, Reload Stylesheet, Reload CTRL libs. |

## 3. Grafikobjekte im GEDI

| Thema | Link | Nutzen |
|---|---|---|
| Simple graphics objects | [öffnen](https://www.winccoa.com/documentation/WinCCOA/3.18/en_US/Native_GEDI/Referenz_Native_GEDI-30.html) | Linien, Rechtecke, Kreise, Ellipsen, Polygone, Primitive Text, Frames und einfache Formen. |
| Complex graphics objects | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Native_GEDI/Referenz_Native_GEDI-36.html) | Buttons, Textfelder, Trends, Tabellen, Tabs, Slider, Tree Widgets, Embedded Modules, Panel References und EWOs. |
| Properties of graphics objects | [öffnen](https://www.winccoa.com/documentation/WinCCOA/3.18/en_US/Native_GEDI/Referenz_Native_GEDI-22.html) | Standard-Tab im Property Sheet: Namen, Farben, Schrift, Linien, Position, Größe, Rotation. |
| Graphics objects – CTRL access | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Control_Grafik/Graphics_Objects.html) | Zugriff auf Grafikobjekte per CTRL, Attribute, Dot-Notation, `setValue()` und `getValue()`. |
| Handling of Graphic Properties | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/GettingStarted/GettingStarted-75.html) | Eigenschaften, Methoden und Events von Grafikobjekten; Lesen/Schreiben von Properties per CTRL. |

## 4. Grafische Dynamik, Animation und Zustandsanzeige

| Thema | Link | Nutzen |
|---|---|---|
| Simple Configuration | [öffnen](https://www.winccoa.com/documentation/WinCCOA/3.19/en_US/Einfache_Parametrierung/Einfache_Parametrierung1.html) | Dialogbasierte Konfiguration ohne viel Programmierung: Farben ändern, Sichtbarkeit, Position, Skalierung, Rotation, Panels öffnen. |
| Applying colors to graphic objects | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ScriptWizard/ScriptWizard_Animation-03.html) | Farbzuweisungen für Shapes über ScriptWizard / Animation. |
| animate() | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/animate.html) | CTRL-Funktion zum Animieren von Objekten und Attributen. |
| styleSheet Property | [öffnen](https://www.winccoa.com/documentation/WinCCOA/3.18/en_US/Control_Grafik/styleSheet.html) | Style eines einzelnen Widgets oder Panels per CTRL setzen. |

## 5. StyleSheets, CSS und optische Anpassungen

| Thema | Link | Nutzen |
|---|---|---|
| Implementation of Style Sheets | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Native_GEDI/Referenz_Native_GEDI-61.html) | CSS-Datei in WinCC OA einbinden: `config/stylesheet.css` oder UI-Startparameter `-stylesheet`. |
| Creation of the CSS file | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Native_GEDI/Referenz_Native_GEDI-62.html) | Aufbau von CSS-Regeln, Selektoren, Attribut-Selektoren, Bilderreferenzen und WinCC-OA-Farben mit `oa-color()`. |
| styleSheet Property per CTRL | [öffnen](https://www.winccoa.com/documentation/WinCCOA/3.18/en_US/Control_Grafik/styleSheet.html) | Lokale StyleSheet-Anpassung für einzelne Objekte oder Panels per Script. |

## 6. Wiederverwendbare Grafiken und Symbole

| Thema | Link | Nutzen |
|---|---|---|
| Panel reference | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Native_GEDI/Referenz_Native_GEDI-37.html) | Bestehende Panels in andere Panels einfügen und wiederverwenden. Wichtig für globale Symboländerungen. |
| Object-Oriented Panel References | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/OOP/oop_basics.html) | Wiederverwendbare Panel-Referenzen mit objektorientierten Konzepten, Properties und Events. |
| Simple Symbols, basics | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/SimpleSymbols/SimpleSymbols-01.html) | Symbole flexibel Datapoint-Typen zuordnen, Drag'N Draw und Symbol-Wiederverwendung. |
| EWO Basics and Development | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Native_GEDI/EWO.html) | External Widget Objects: eigene Qt-basierte Widgets in WinCC OA Panels einbinden. |

## 7. Systemmanagement aus GEDI / VISION

| Thema | Link | Nutzen |
|---|---|---|
| System management | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Referenz_VISION/Referenz_VISION-28.html) | System Management Panel aus GEDI/VISION: Diagnose, Reports, Database, Driver, OPC, S7, Kommunikation, Berechtigungen. |

## 8. Allgemeine Doku- und Tutorial-Übersichten

| Thema | Link | Nutzen |
|---|---|---|
| WinCC OA Documentation Startseite | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/index.html) | Zentrale Doku-Startseite mit Bereichen Engineering, Data Visualization, Business Logic / Control, Interfaces und Tutorials. |
| WinCC OA Videos & Tutorials Bereich | [öffnen](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/index.html) | Auf der Doku-Startseite gibt es einen eigenen Bereich für Videos & Tutorials. |

## Lernpfad für GEDI und grafische Anpassungen

1. **GEDI Grundlagen** lesen und GEDI mit `WCCOAui -m gedi` starten.
2. Ein erstes **Panel** erstellen und im Panel Window mit Grid, Zoom und Objektselektion arbeiten.
3. Einfache Objekte platzieren: Linie, Rechteck, Text, Kreis, Frame.
4. Komplexe Objekte testen: Button, Textfeld, Tabelle, Trend, Tab, Slider.
5. Im **Property Sheet** Farben, Schrift, Größe, Position und Rotation ändern.
6. Mit **Simple Configuration** erste Dynamiken erstellen, z. B. Farbe nach Datenpunktwert ändern.
7. Danach gezielt CTRL nutzen: `setValue()`, `getValue()`, Dot-Notation und `animate()`.
8. Für ein einheitliches Look-and-Feel eine `config/stylesheet.css` anlegen.
9. Wiederverwendbare Bausteine über **Panel References**, **Simple Symbols** oder später **Object-Oriented Panel References** aufbauen.

## Quick-and-dirty Empfehlung für AMR/WinCC OA

Für dein AMR-zu-WinCC-OA-Projekt wäre der schnellste Weg:

1. Pro Messkanal einen Datapoint oder Datenpunkt-Elemente anlegen.
2. Ein einfaches Panel im GEDI bauen.
3. Textfelder oder Tabellen für aktuelle Messwerte verwenden.
4. Grenzwerte visuell über Farben darstellen, z. B. grün/gelb/rot.
5. Erst mit Simple Configuration arbeiten, danach bei Bedarf CTRL-Skripte ergänzen.
6. Für wiederkehrende Kanäle ein Referenzpanel oder Simple Symbol bauen.

## Mini-Beispiel: Farbe eines Objekts per CTRL ändern

```c
main()
{
  float temp;

  dpGet("AMR.Temp01:_online.._value", temp);

  if (temp > 80)
  {
    setValue("RECTANGLE1", "backCol", "red");
  }
  else if (temp > 60)
  {
    setValue("RECTANGLE1", "backCol", "yellow");
  }
  else
  {
    setValue("RECTANGLE1", "backCol", "green");
  }
}
```

## Mini-Beispiel: StyleSheet per CTRL setzen

```c
main()
{
  string myStyle;

  myStyle = "QPushButton { color: white; background-color: #005f87; }";
  this.styleSheet(myStyle);
}
```

## Merksatz

**GEDI** ist der Editor zum Bauen der Oberfläche.  
**VISION** ist die Runtime, in der die Panels bedient werden.  
**CTRL** macht die Oberfläche dynamisch.  
**StyleSheets/CSS** sorgen für ein einheitliches Design.  
**Panel References und Simple Symbols** helfen, wiederverwendbare Bausteine aufzubauen.
