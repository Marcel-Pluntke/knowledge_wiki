---
sidebar_position: 1
---

# IEC 61439: Niederspannungs-Schaltgerätekombinationen

Die Normenreihe **IEC 61439** beschreibt Anforderungen an **Niederspannungs-Schaltgerätekombinationen**. Dazu gehören z. B. Hauptverteilungen, Energieverteiler, Motor-Control-Center, Baustromverteiler, Installationsverteiler, Schienenverteilersysteme und bestimmte Verteilsysteme für Ladeinfrastruktur.

Diese Seite soll helfen, schnell zu entscheiden:

- welche Norm aus der IEC-61439-Reihe relevant ist,
- wann man in welchen Teil schauen muss,
- welche Inhalte die Teile grob abdecken,
- welche Kapitel in der Praxis besonders wichtig sind,
- welche zusätzlichen Dokumente häufig gemeinsam mit IEC 61439 betrachtet werden.

:::important
Diese Seite ersetzt nicht den offiziellen Normtext. Sie ist eine Arbeits- und Orientierungshilfe für Prüfung, Entwicklung, Dokumentation und Projektklärung.
:::

---

## Kurzlogik: Welche Norm brauche ich?

```text
Spezifikation / Kundenvorgaben erstellen?
→ IEC/TR 61439-0

Allgemeine Anforderungen, Begriffe, Nachweise, Prüfungen?
→ IEC 61439-1

Normale Leistungs-Schaltgerätekombination, Hauptverteilung, MCC, Industrieverteiler?
→ IEC 61439-2 + IEC 61439-1

Installationsverteiler / Verteiler, die durch Laien bedient werden?
→ IEC 61439-3 + IEC 61439-1

Baustromverteiler / Bauverteiler?
→ IEC 61439-4 + IEC 61439-1

Öffentliche Energieverteilungsnetze, Kabelverteilerschränke, Netzverteiler?
→ IEC 61439-5 + IEC 61439-1

Schienenverteilersystem / Busbar trunking system?
→ IEC 61439-6 + IEC 61439-1

Camping, Marina, Marktplatz, Ladeinfrastruktur / EV-Charging-Assembly?
→ IEC 61439-7 + IEC 61439-1

Lichtbogenprüfung / Internal Arc?
→ IEC TR 61641 und ggf. IEC TS 63107 zusätzlich betrachten
```

---

## Übersicht der IEC-61439-Reihe

| Dokument | Thema | Wann reinschauen? |
| --- | --- | --- |
| **IEC/TR 61439-0** | Leitfaden zur Spezifikation von Schaltgerätekombinationen | Wenn Anforderungen zwischen Planer, Betreiber, Kunde und Hersteller sauber festgelegt werden sollen. |
| **IEC 61439-1** | Allgemeine Regeln | Immer. Begriffe, Bemessungswerte, Umgebungsbedingungen, Bauanforderungen, Nachweise und Stücknachweise. |
| **IEC 61439-2** | Power switchgear and controlgear assemblies, PSC | Für industrielle Schaltanlagen, Hauptverteilungen, Energieverteiler, MCC, Maschinen- und Prozessanlagen. |
| **IEC 61439-3** | Distribution boards operated by ordinary persons, DBO | Für Installationsverteiler, Unterverteiler, Haus-/Gebäudeverteiler, die von Laien bedient werden können. |
| **IEC 61439-4** | Assemblies for construction sites, ACS | Für Baustromverteiler und mobile/transportable Verteiler auf Baustellen. |
| **IEC 61439-5** | Assemblies for power distribution in public networks, PENDA | Für Netzverteiler, Kabelverteilerschränke und Verteilungen öffentlicher Stromnetze. |
| **IEC 61439-6** | Busbar trunking systems, BTS | Für Schienenverteilersysteme und Busway-Systeme. |
| **IEC 61439-7** | Specific applications: marinas, camping, market squares, EV charging | Für öffentlich zugängliche Sonderanwendungen, insbesondere Ladeinfrastruktur, Camping, Marina und Marktplatz. |

---

## Grundprinzip der Reihe

IEC 61439 funktioniert nach einem Baukastenprinzip:

```text
IEC 61439-1
= allgemeine Regeln

IEC 61439-2 bis IEC 61439-7
= produktspezifische Zusatz- und Änderungsanforderungen
```

Für die Konformitätsbewertung nimmt man deshalb normalerweise **Teil 1 plus den passenden Produktteil**.

Beispiel:

```text
Industrie-Hauptverteilung
→ IEC 61439-1 + IEC 61439-2

Baustromverteiler
→ IEC 61439-1 + IEC 61439-4

Schienenverteiler
→ IEC 61439-1 + IEC 61439-6
```

:::warning
IEC 61439-1 ist die Grundlage, aber nicht allein ausreichend, um eine konkrete Schaltgerätekombination vollständig zu spezifizieren oder zu bewerten. Dafür ist zusätzlich der passende Produktteil erforderlich.
:::

---

## IEC/TR 61439-0: Spezifikation und Ausschreibung

**Zweck:** IEC/TR 61439-0 ist ein Leitfaden aus Sicht des Spezifizierenden. Er hilft dabei, die technischen Anforderungen an eine Schaltgerätekombination vollständig und eindeutig zu beschreiben.

**Wann verwenden?**

- bei Lastenheften
- bei Ausschreibungen
- bei Pflichtenheften
- bei interner Projektklärung
- bei Abstimmung zwischen Kunde, Planer, Hersteller und Prüflabor
- wenn unklar ist, welche Betriebs- und Schnittstellendaten benötigt werden

**Typische Inhalte:**

- Auswahl der relevanten IEC-61439-Teile
- Festlegung von Bemessungsdaten
- Umgebungsbedingungen
- Aufstellungsbedingungen
- Schutzart
- Bedienung durch Fachkräfte oder Laien
- Kurzschlussdaten
- Erweiterbarkeit
- Wartungszugang
- Schnittstellen zum Netz und zu Verbrauchern

**Praxisfrage:**

```text
Ich muss eine Schaltanlage bestellen oder spezifizieren.
Welche Daten muss ich dem Hersteller geben?
→ IEC/TR 61439-0
```

---

## IEC 61439-1: Allgemeine Regeln

**Zweck:** IEC 61439-1 enthält die allgemeinen Anforderungen, Begriffe, Bemessungsdaten, Bauanforderungen und Nachweismethoden für Niederspannungs-Schaltgerätekombinationen.

**Wann verwenden?**

- immer als Basisdokument
- bei Begriffsdefinitionen
- bei Bemessungswerten
- bei Nachweisplanung
- bei Bauartnachweisen
- bei Stücknachweisen
- bei Temperaturerhöhungsprüfungen
- bei Kurzschlussfestigkeit
- bei Schutz gegen elektrischen Schlag
- bei Luft- und Kriechstrecken
- bei Schutzart, Isolation, Erwärmung und mechanischer Ausführung

### Kapitelstruktur als Orientierung

Die konkrete Kapitelnummerierung kann je nach Ausgabe und Produktteil leicht erweitert oder angepasst sein. Für die praktische Arbeit ist diese Struktur besonders wichtig:

| Bereich | Inhalt | Wann reinschauen? |
| --- | --- | --- |
| **Anwendungsbereich** | Klärt, für welche Schaltgerätekombinationen die Norm gilt. | Wenn unsicher ist, ob dein Produkt überhaupt unter IEC 61439 fällt. |
| **Normative Verweisungen** | Nennt weitere Normen, die für Prüfungen oder Bauteile relevant sind. | Wenn du wissen musst, welche Zusatznormen heranzuziehen sind. |
| **Begriffe und Definitionen** | Definiert Assembly, circuit, rated current, verification, Herstellerrollen usw. | Wenn Begriffe in Prüfbericht, Angebot oder Lastenheft eindeutig sein müssen. |
| **Symbole und Abkürzungen** | Einheitliche Formelzeichen und Kurzzeichen. | Bei technischen Datenblättern und Prüfprotokollen. |
| **Schnittstellen-/Bemessungsdaten** | Spannung, Strom, Frequenz, Kurzschlussdaten, Gleichzeitigkeit, Anschlussdaten. | Wenn die Anlage ausgelegt oder spezifiziert wird. |
| **Angaben zur Schaltgerätekombination** | Typenschild, Dokumentation, Herstellerangaben. | Bei Dokumentationsprüfung und Abnahme. |
| **Betriebsbedingungen** | Umgebungstemperatur, Aufstellung, Verschmutzungsgrad, Höhe, Feuchte. | Wenn Laborbedingungen oder Einsatzort abweichen. |
| **Bauanforderungen** | Mechanik, Werkstoffe, Korrosionsschutz, Schutzart, Luft-/Kriechstrecken, Schutzleiter. | Bei Konstruktion und Design Review. |
| **Verhalten und Performance** | Erwärmung, Kurzschlussfestigkeit, EMV, Isolation, Schutz gegen Schlag. | Bei Prüfplanung und Bauartnachweis. |
| **Bauartnachweis / Design Verification** | Methoden zum Nachweis der Konstruktion. | Wenn ein Typnachweis oder Variantenvergleich erstellt wird. |
| **Stücknachweis / Routine Verification** | Prüfungen an jeder gefertigten Anlage. | Bei Endprüfung, Fertigung, Prüfprotokoll und Abnahme. |

---

## IEC 61439-2: Leistungs-Schaltgerätekombinationen, PSC

**Zweck:** IEC 61439-2 ergänzt IEC 61439-1 für **Power Switchgear and Controlgear Assemblies**. Das ist der wichtigste Produktteil für industrielle Niederspannungsschaltanlagen.

**Typische Anlagen:**

- Hauptverteilungen
- Energieverteiler
- Motor-Control-Center, MCC
- Steuerungs- und Leistungsschaltanlagen
- Industrieverteiler
- Verteilungen in Energieerzeugung, Verteilung, Umwandlung und Verbraucheransteuerung
- Schaltanlagen in Maschinenumgebungen, wenn passend zur Anwendung

**Wann reinschauen?**

```text
Ist es eine industrielle Schaltanlage oder Hauptverteilung?
→ IEC 61439-2
```

**Wichtige Inhalte:**

- spezielle Anforderungen an PSC-Assemblies
- Ergänzungen und Änderungen zu IEC 61439-1
- Bemessungsdaten für Einspeisungen und Abgänge
- Anforderungen an Anschluss- und Installationsbedingungen
- Anforderungen an innere Unterteilung, Zugänglichkeit und Betrieb
- produktspezifische Verifikationen

**Typische Prüf- und Bewertungsfragen:**

- Welche Bemessungsströme gelten für Einspeisung und Abgänge?
- Wie wird die Temperaturerhöhung bewertet?
- Welche Kurzschlussfestigkeit ist erforderlich?
- Welche Form der inneren Unterteilung ist gefordert?
- Welche Dokumentation muss der Hersteller liefern?
- Welche Routineprüfungen sind bei jeder Anlage notwendig?

---

## IEC 61439-3: Verteiler für Bedienung durch Laien, DBO

**Zweck:** IEC 61439-3 gilt für **Distribution Boards intended to be operated by ordinary persons**, also Verteiler, die von elektrotechnischen Laien bedient werden können.

**Typische Anlagen:**

- Installationsverteiler
- Unterverteiler in Gebäuden
- Haus- und Wohnungsverteiler
- kleine gewerbliche Verteiler
- Verteiler mit Endstromkreisen, Leitungsschutzschaltern, RCDs oder ähnlichen Schutzgeräten

**Wann reinschauen?**

```text
Kann eine gewöhnliche Person den Verteiler bedienen, z. B. Sicherung wieder einschalten?
→ IEC 61439-3
```

**Wichtige Inhalte:**

- Anforderungen an Verteiler, die durch Laien bedient werden
- Begrenzungen und Anwendungsbedingungen
- Anforderungen an Schutzgeräte in Abgangsstromkreisen
- Anforderungen an Gehäuse, Schutzart und Zugänglichkeit
- zusätzliche Sicherheitsanforderungen wegen Bedienung durch Nichtfachkräfte

**Abgrenzung zu IEC 61439-2:**

| Frage | Eher IEC 61439-2 | Eher IEC 61439-3 |
| --- | --- | --- |
| Bedienung nur durch Elektrofachkräfte? | Ja | Nein |
| Hauptverteilung / Industrieanlage? | Ja | Eher nein |
| Wohnungs-/Gebäudeverteiler? | Eher nein | Ja |
| Laie darf Schutzgeräte bedienen? | Eher nein | Ja |

---

## IEC 61439-4: Baustromverteiler, ACS

**Zweck:** IEC 61439-4 gilt für **Assemblies for Construction Sites**.

**Typische Anlagen:**

- Baustromverteiler
- transportable Baustellenverteiler
- mobile oder semi-mobile Verteiler
- Verteiler für temporäre Baustellenversorgung

**Wann reinschauen?**

```text
Wird die Schaltgerätekombination auf einer Baustelle oder temporären Arbeitsstelle eingesetzt?
→ IEC 61439-4
```

**Wichtige Inhalte:**

- Anforderungen für harte Umgebungsbedingungen auf Baustellen
- mobile oder transportable Bauweise
- mechanische Beanspruchung
- Schutz gegen Feuchtigkeit, Staub und äußere Einflüsse
- Betrieb durch wechselnde Nutzergruppen
- Anforderungen an Ein- und Ausgangsanschlüsse

**Praxisfragen:**

- Muss der Verteiler transportabel sein?
- Welche Schutzart ist erforderlich?
- Welche mechanischen Belastungen sind zu berücksichtigen?
- Welche besonderen Umgebungsbedingungen gelten auf Baustellen?

---

## IEC 61439-5: Verteilungen in öffentlichen Netzen, PENDA

**Zweck:** IEC 61439-5 gilt für **Public Electricity Network Distribution Assemblies**.

**Typische Anlagen:**

- Kabelverteilerschränke
- Netzverteilerschränke
- Verteilungen in öffentlichen Niederspannungsnetzen
- stationäre Netzverteiler im Versorgungsnetz

**Wann reinschauen?**

```text
Gehört die Anlage zur öffentlichen Energieverteilung oder zum Netzbetreiberbereich?
→ IEC 61439-5
```

**Wichtige Inhalte:**

- Anforderungen an stationäre Verteilungen in öffentlichen Netzen
- Innen- und Außenaufstellung
- Zugänglichkeit durch Fachkräfte
- mögliche Aufstellung in Bereichen, die öffentlich zugänglich sind
- Anforderungen an Netzverteilungsfunktion und Anschlussbedingungen
- Anforderungen an mechanische und klimatische Robustheit

**Abgrenzung:**

| Anwendung | Wahrscheinlicher Normteil |
| --- | --- |
| Industrieverteilung im Werk | IEC 61439-2 |
| Wohnungs-/Gebäudeverteiler | IEC 61439-3 |
| Kabelverteilerschrank des Netzbetreibers | IEC 61439-5 |

---

## IEC 61439-6: Schienenverteilersysteme, BTS

**Zweck:** IEC 61439-6 gilt für **Busbar Trunking Systems**, also Schienenverteiler und Busway-Systeme.

**Typische Anlagen:**

- Schienenverteilsysteme in Gebäuden
- Energieverteilung mit Sammelschienenkanälen
- Einspeiseeinheiten
- Abgangskästen
- Verteilungsstrecken in Industrieanlagen
- vertikale oder horizontale Energieverteilung

**Wann reinschauen?**

```text
Ist es kein klassischer Schaltschrank, sondern ein Schienenverteilersystem?
→ IEC 61439-6
```

**Wichtige Inhalte:**

- Definitionen für BTS
- Bauanforderungen an Schienensysteme
- elektrische Eigenschaften
- mechanische Eigenschaften
- Schutzart und Gehäuse
- Temperaturerhöhung
- Kurzschlussfestigkeit
- Prüfungen von Streckenelementen, Abgängen und Verbindungen

**Praxisfragen:**

- Wie wird die Temperaturerhöhung entlang der Schiene bewertet?
- Wie sind Steck-/Abgangseinheiten zu betrachten?
- Welche Kurzschlussdaten gelten für das System?
- Welche Übergangswiderstände und Verbindungspunkte sind kritisch?

---

## IEC 61439-7: Besondere Anwendungen und Ladeinfrastruktur

**Zweck:** IEC 61439-7 gilt für Schaltgerätekombinationen in besonderen Anwendungen, z. B. Marinas, Campingplätze, Marktplätze und Ladeinfrastruktur für Elektrofahrzeuge.

**Typische Anlagen:**

- Verteilungen auf Campingplätzen
- Verteilungen in Marinas
- Markt- und Festplatzverteiler
- öffentlich zugängliche temporäre Verteiler
- Schaltgerätekombinationen für AC- und DC-Ladeinfrastruktur
- Assemblies for Electric Vehicle Charging Stations, AEVCS

**Wann reinschauen?**

```text
Ist die Anlage öffentlich zugänglich, wird von Laien bedient oder gehört zur Ladeinfrastruktur?
→ IEC 61439-7
```

**Wichtige Inhalte:**

- Anforderungen für öffentlich zugängliche Anwendungen
- Bedienung durch gewöhnliche Personen
- besondere Umgebungsbedingungen
- Steckvorgänge und Anschlussvorgänge durch Nutzer
- Anforderungen im Umfeld von Ladeinfrastruktur
- Verknüpfung mit Anforderungen aus der IEC-61851-Reihe für conductive charging systems

**Praxisfragen:**

- Ist die Anlage für Mode-3- oder Mode-4-Laden vorgesehen?
- Wird sie von gewöhnlichen Personen bedient?
- Ist sie im Außenbereich oder öffentlich zugänglich?
- Gibt es besondere Anforderungen an Robustheit, Schutzart und Anschlussstellen?

---

## Ergänzende Dokumente, die häufig wichtig sind

Diese Dokumente sind nicht einfach weitere Produktteile der IEC-61439-Reihe, aber sie werden in der Praxis häufig zusammen mit IEC 61439 verwendet.

| Dokument | Thema | Wann reinschauen? |
| --- | --- | --- |
| **IEC TR 61641** | Prüfung bei innerem Störlichtbogen | Wenn eine Anlage gegen Internal Arc bewertet oder geprüft werden soll. |
| **IEC TS 63107** | Integration von Internal-Arc-Fault-Mitigation-Systemen in PSC-Assemblies | Wenn aktive oder systematische Lichtbogenminderung in PSC-Schaltanlagen eingesetzt wird. |
| **IEC 60947-Reihe** | Niederspannungs-Schaltgeräte und Komponenten | Wenn die Einzelgeräte wie Leistungsschalter, Schütze, Lasttrennschalter oder Schutzgeräte betrachtet werden. |
| **IEC 60204-Reihe** | Elektrische Ausrüstung von Maschinen | Wenn die Schaltgerätekombination Teil einer Maschine ist. |
| **IEC 60364-Reihe** | Errichten von Niederspannungsanlagen | Wenn es um Installation, Schutzmaßnahmen und Anlagenerrichtung geht. |
| **IEC 61851-Reihe** | Konduktive Ladesysteme für Elektrofahrzeuge | Wenn Ladeinfrastruktur betrachtet wird. |

---

## Entscheidungsmatrix für die Praxis

| Situation | Erstes Dokument | Danach prüfen |
| --- | --- | --- |
| Ich schreibe eine Spezifikation für eine neue Schaltanlage. | IEC/TR 61439-0 | Passenden Produktteil wählen, danach IEC 61439-1. |
| Ich prüfe eine Industrie-Hauptverteilung. | IEC 61439-2 | IEC 61439-1 für Nachweise und Stückprüfung. |
| Ich prüfe einen Installationsverteiler für Bedienung durch Laien. | IEC 61439-3 | IEC 61439-1 für allgemeine Anforderungen. |
| Ich prüfe einen Baustromverteiler. | IEC 61439-4 | IEC 61439-1 und Umgebungs-/Mechanikanforderungen. |
| Ich prüfe einen Kabelverteilerschrank für öffentliche Netze. | IEC 61439-5 | IEC 61439-1 und Netzbetreiberanforderungen. |
| Ich prüfe ein Schienenverteilsystem. | IEC 61439-6 | IEC 61439-1 und Systemnachweise für BTS. |
| Ich prüfe eine Verteilung für EV-Charging, Camping oder Marina. | IEC 61439-7 | IEC 61439-1, ggf. IEC 61851. |
| Ich prüfe Erwärmung. | IEC 61439-1 | Produktteil für besondere Bedingungen. |
| Ich prüfe Kurzschlussfestigkeit. | IEC 61439-1 | Produktteil und Gerätedaten nach IEC 60947. |
| Ich prüfe Internal Arc. | IEC TR 61641 | Bei PSC zusätzlich IEC TS 63107, falls Mitigation-Systeme eingesetzt werden. |

---

## Welche Kapitel sind in Prüfberichten besonders relevant?

Für Prüfberichte und technische Bewertungen sind meistens diese Themenblöcke wichtig:

### 1. Anwendungsbereich und Normauswahl

Hier wird festgelegt, ob das Produkt korrekt eingeordnet ist.

Beispiele:

- PSC nach IEC 61439-2?
- DBO nach IEC 61439-3?
- ACS nach IEC 61439-4?
- BTS nach IEC 61439-6?
- AEVCS / Sonderanwendung nach IEC 61439-7?

### 2. Bemessungsdaten

Typische Angaben:

- Bemessungsspannung
- Bemessungsisolationsspannung
- Bemessungsstoßspannungsfestigkeit
- Bemessungsstrom
- Bemessungsstrom der Abgänge
- Gruppen-Bemessungsstrom
- Kurzschlussstrom
- Frequenz
- Schutzart
- Verschmutzungsgrad
- Aufstellhöhe
- Umgebungstemperatur

### 3. Bauanforderungen

Typische Prüfpunkte:

- Gehäuse
- Werkstoffe
- Korrosionsschutz
- mechanische Festigkeit
- Schutzleiterkreis
- Luftstrecken
- Kriechstrecken
- innere Unterteilung
- Zugänglichkeit
- Schutz gegen direktes und indirektes Berühren

### 4. Temperaturerhöhung

Typische Prüfpunkte:

- Hotspots
- Einspeisungen
- Abgänge
- Sammelschienen
- Klemmen
- Übergangswiderstände
- Umgebungstemperatur
- Strombelastung und Gleichzeitigkeit

### 5. Kurzschlussfestigkeit

Typische Prüfpunkte:

- Bemessungskurzzeitstrom
- Bemessungsstoßstrom
- Schutzorgan
- Selektivität und Koordination
- Sammelschienenfestigkeit
- PE-/PEN-Leiter

### 6. Isolations- und Spannungsprüfungen

Typische Prüfpunkte:

- Durchschlagfestigkeit
- Luft- und Kriechstrecken
- Isolationswiderstand
- Bemessungsstoßspannung
- Verschmutzungsgrad

### 7. Schutzart und Umgebungsbedingungen

Typische Prüfpunkte:

- IP-Schutzart
- Innen-/Außenaufstellung
- Feuchte
- Staub
- Temperaturbereich
- mechanische Beanspruchung
- Transport und Lagerung

### 8. Bauartnachweis

Hier wird nachgewiesen, dass die Konstruktion grundsätzlich geeignet ist.

Mögliche Nachweiswege können je nach Thema sein:

- Prüfung
- Vergleich mit geprüfter Referenzkonstruktion
- Bewertung / Berechnung
- konstruktive Regeln aus der Norm

### 9. Stücknachweis

Der Stücknachweis betrifft die einzelne gefertigte Anlage.

Typische Inhalte:

- Sichtprüfung
- Verdrahtungsprüfung
- Schutzleiterprüfung
- Funktionsprüfung
- Isolationsprüfung
- Prüfung der Dokumentation
- Kontrolle von Beschriftungen und Typenschild

---

## Schnelle Zuordnung nach Anlage

| Anlage / Produkt | Wahrscheinlich relevante Norm |
| --- | --- |
| Industrie-Hauptverteilung | IEC 61439-2 |
| Motor-Control-Center | IEC 61439-2 |
| Schaltschrank für Prozessanlage | IEC 61439-2 |
| Gebäude-Unterverteiler | IEC 61439-3 |
| Wohnungsverteiler | IEC 61439-3 |
| Baustromverteiler | IEC 61439-4 |
| Kabelverteilerschrank des Netzbetreibers | IEC 61439-5 |
| Schienenverteiler / Busway | IEC 61439-6 |
| Campingplatzverteiler | IEC 61439-7 |
| Marina-Verteiler | IEC 61439-7 |
| Marktplatzverteiler | IEC 61439-7 |
| EV-Charging-Assembly | IEC 61439-7 |
| Internal-Arc-Prüfung | IEC TR 61641, ggf. IEC TS 63107 |

---

## Typischer Arbeitsablauf für die Normenprüfung

```text
1. Produktart bestimmen
   → PSC, DBO, ACS, PENDA, BTS, AEVCS?

2. Passenden Produktteil wählen
   → IEC 61439-2 bis IEC 61439-7

3. IEC 61439-1 parallel verwenden
   → allgemeine Anforderungen und Nachweise

4. Bemessungsdaten sammeln
   → Spannung, Strom, Kurzschluss, IP, Umgebung, Aufstellung

5. Bauanforderungen prüfen
   → Gehäuse, PE, Schutz gegen Schlag, Luft-/Kriechstrecken

6. Performance-Nachweise prüfen
   → Erwärmung, Kurzschluss, Isolation, EMV

7. Bauartnachweis dokumentieren
   → Prüfung, Berechnung, Vergleich oder Regelanwendung

8. Stücknachweis definieren
   → Prüfplan für jede gefertigte Anlage

9. Ergänzende Normen prüfen
   → IEC 60947, IEC 60364, IEC 60204, IEC 61851, IEC TR 61641
```

---

## Merksätze

- **IEC 61439-1 ist immer die Basis, aber nicht allein ausreichend.**
- **Der passende Produktteil entscheidet, welche besonderen Anforderungen gelten.**
- **IEC 61439-2 ist der Standardfall für industrielle Leistungs-Schaltanlagen.**
- **IEC 61439-3 ist relevant, wenn Laien den Verteiler bedienen können.**
- **IEC 61439-6 ist für Schienenverteilersysteme, nicht für klassische Schaltschränke.**
- **IEC 61439-7 ist besonders wichtig bei Ladeinfrastruktur und öffentlich zugänglichen Sonderanwendungen.**
- **Internal Arc ist kein Standardnachweis aus jedem Projekt, sondern muss gezielt spezifiziert und geprüft werden.**

---

## Quellen und Versionsstand

Versionsstand dieser Übersicht: **2026-05-12**.

Für den konkreten Prüf- oder Zertifizierungsfall immer die aktuell beschaffte Normausgabe, nationale Übernahmen wie DIN EN IEC/VDE und projektspezifische Kundenvorgaben prüfen.

Öffentliche Informationsquellen zur Einordnung:

- IEC/TR 61439-0:2022: Guidance to specifying assemblies
- IEC 61439-1:2020: General rules
- IEC 61439-2:2020: Power switchgear and controlgear assemblies
- IEC 61439-3:2024: Distribution boards intended to be operated by ordinary persons
- IEC 61439-4:2023: Assemblies for construction sites
- IEC 61439-5:2023: Assemblies for power distribution in public networks
- IEC 61439-6:2012: Busbar trunking systems
- IEC 61439-7:2022: Specific applications such as marinas, camping sites, market squares and electric vehicle charging stations
- IEC TR 61641:2014: Internal arc testing guide
- IEC TS 63107:2020: Internal arc-fault mitigation systems in PSC assemblies
