---
sidebar_position: 2
---

# IEC 61439 Kapitel 10: Prüfungen und Bauartnachweis

Kapitel 10 der IEC 61439-1 ist einer der wichtigsten Bereiche für Entwicklung, Prüflabor, Qualitätsmanagement und technische Dokumentation. In diesem Kapitel geht es um den **Bauartnachweis** bzw. die **Design Verification**.

Der Bauartnachweis beantwortet die Frage:

```text
Ist die Konstruktion der Schaltgerätekombination grundsätzlich geeignet,
die Anforderungen der IEC 61439-Reihe zu erfüllen?
```

Dabei geht es nicht nur um eine einzelne Endprüfung. Kapitel 10 betrachtet die Konstruktion als System: Gehäuse, Schienen, Schutzleiter, Luft- und Kriechstrecken, Geräte, Verbindungen, Klemmen, Erwärmung, Kurzschlussfestigkeit, EMV und mechanische Bedienbarkeit.

:::important
Kapitel 10 ist nicht dasselbe wie Kapitel 11. Kapitel 10 ist der Bauartnachweis der Konstruktion. Kapitel 11 ist der Stücknachweis an der einzelnen gefertigten Schaltgerätekombination.
:::

---

## Kapitel 10 vs. Kapitel 11

| Thema | Kapitel 10: Bauartnachweis | Kapitel 11: Stücknachweis |
| --- | --- | --- |
| Ziel | Nachweis, dass das Design grundsätzlich geeignet ist | Nachweis, dass das einzelne gefertigte Exemplar korrekt gebaut wurde |
| Zeitpunkt | Entwicklung, Typprüfung, Variantenfreigabe | Fertigung, Endprüfung, Abnahme |
| Objekt | Bauart / System / Referenzdesign | Konkrete Schaltgerätekombination |
| Wiederholung | Nicht für jedes identische Exemplar vollständig neu | Für jede gefertigte Anlage erforderlich |
| Typische Methoden | Prüfung, Vergleich, Bewertung, Berechnung | Sichtprüfung, Verdrahtungsprüfung, Schutzleiterprüfung, Funktionsprüfung, Isolationsprüfung |
| Ergebnis | Bauartnachweisbericht / Design Verification Report | Stückprüfprotokoll / Routine Verification Report |

Merksatz:

```text
Kapitel 10 sagt: Das Design kann es.
Kapitel 11 sagt: Dieses gebaute Exemplar wurde richtig umgesetzt.
```

---

## Die drei Nachweiswege

In Kapitel 10 gibt es je nach Merkmal grundsätzlich drei mögliche Nachweiswege. Nicht jeder Nachweisweg ist für jedes Merkmal zulässig.

| Nachweisweg | Bedeutung | Typische Anwendung |
| --- | --- | --- |
| **Prüfung / Test** | Der Nachweis wird durch reale Prüfung erbracht. | Temperaturerhöhung, Kurzschluss, Schutzart, Isolation, mechanische Festigkeit. |
| **Vergleich mit Referenzdesign** | Ein neues Design wird mit einem bereits geprüften Design verglichen. | Varianten, ähnliche Schränke, ähnliche Sammelschienen, geänderte Abgänge. |
| **Bewertung / Assessment / Berechnung** | Der Nachweis wird über Regeln, Berechnungen, Herstellerdaten oder konstruktive Bewertung erbracht. | Luft-/Kriechstrecken, Geräteauswahl, Klemmen, EMV, bestimmte Temperaturbewertungen. |

:::warning
Der Nachweisweg muss zur Norm und zum konkreten Merkmal passen. Eine reine technische Plausibilität ersetzt keinen geforderten Bauartnachweis.
:::

---

## Übersicht: Was wird in Kapitel 10 nachgewiesen?

| Bereich | Typischer Inhalt | Praktische Frage |
| --- | --- | --- |
| **10.2** | Festigkeit von Werkstoffen und Teilen | Hält Gehäuse, Isolierstoff, Beschichtung, Mechanik, UV, Korrosion und Transportbelastung? |
| **10.3** | Schutzart der Gehäuse | Wird die geforderte IP-Schutzart erreicht? |
| **10.4** | Luft- und Kriechstrecken | Sind Abstände für Spannung, Verschmutzungsgrad und Isolationskoordination ausreichend? |
| **10.5** | Schutz gegen elektrischen Schlag und Schutzleiterkreis | Ist PE/Schutzleiterverbindung wirksam und kurzschlussfest? |
| **10.6** | Einbau von Schaltgeräten und Komponenten | Sind Geräte normgerecht eingebaut und für die Anwendung geeignet? |
| **10.7** | Interne Stromkreise und Verbindungen | Sind Leiter, Schienen, Verdrahtung und Verbindungen geeignet? |
| **10.8** | Klemmen für externe Leiter | Sind Anschlussräume, Leiterarten und Klemmen passend? |
| **10.9** | Dielektrische Eigenschaften | Hält die Isolation Spannungs- und Stoßspannungsbeanspruchung aus? |
| **10.10** | Temperaturerhöhung | Bleiben Bauteile, Klemmen, Schienen, Geräte und Gehäuse thermisch innerhalb zulässiger Grenzen? |
| **10.11** | Kurzschlussfestigkeit | Hält die Schaltgerätekombination thermische und dynamische Kurzschlussbeanspruchungen aus? |
| **10.12** | EMV | Stört die Anlage ihre Umgebung nicht und ist sie ausreichend störfest? |
| **10.13** | Mechanische Funktion | Funktionieren mechanische Betätigungen nach Beanspruchung zuverlässig? |

---

## 10.2 Festigkeit von Werkstoffen und Teilen

Dieser Abschnitt betrifft die mechanische und stoffliche Eignung der Schaltgerätekombination.

### Was wird geprüft oder bewertet?

Typische Themen:

- Korrosionsbeständigkeit
- Eigenschaften von Isolierstoffen
- Wärmebeständigkeit
- Feuer-/Glühdrahtverhalten von Isolierstoffen
- UV-Beständigkeit bei Außenanwendung
- mechanische Festigkeit
- Heben und Transport
- mechanische Schlagfestigkeit, z. B. IK-Code
- Beständigkeit von Markierungen
- mechanische Betätigung von Türen, Verriegelungen, Einschüben oder Bedienorganen

### Wann ist dieser Abschnitt wichtig?

```text
Immer dann, wenn Gehäuse, Tragsysteme, Isolierteile, Beschichtungen,
Kunststoffe, Türen, Scharniere, Verriegelungen oder mechanische Teile
für Sicherheit und Funktion relevant sind.
```

### Typische Eingangsdaten

- Werkstoffdatenblätter
- Gehäusedatenblatt
- Schutzart- und IK-Nachweise
- Korrosionsschutzklasse oder Beschichtungsangaben
- Angaben zur Innen- oder Außenaufstellung
- Umgebungstemperatur und Feuchte
- Transport- und Hebekonzept
- Bedienzyklen, wenn mechanische Betätigung relevant ist

### Typische Nachweise

- Prüfung am Gehäuse oder an repräsentativen Teilen
- Herstellerzertifikate und Datenblätter
- Vergleich mit bereits geprüfter Gehäuseplattform
- Bewertung der Werkstoffdaten
- mechanische Funktionsprüfung

### Worauf im Prüfbericht achten?

- genaue Beschreibung des geprüften Gehäuses
- Werkstoff und Oberflächenbehandlung
- Abmessungen, Türen, Deckel, Abdeckungen
- Aufstellungsart: innen oder außen
- vorhandene Dichtungen und deren Zustand
- Befestigungspunkte und Hebepunkte
- Fotos vor und nach der Prüfung
- Abweichungen, Risse, Verformungen, gelöste Teile

---

## 10.3 Schutzart der Gehäuse, IP-Code

Dieser Abschnitt prüft, ob die Schaltgerätekombination die angegebene Schutzart erreicht.

### Was wird geprüft?

- Schutz gegen Berühren gefährlicher Teile
- Schutz gegen Eindringen fester Fremdkörper
- Schutz gegen Wasser
- Schutzart bei geschlossenen Türen
- ggf. Schutzart bei bestimmungsgemäßen Bedienzuständen
- Einfluss von Lüftungsöffnungen, Kabeldurchführungen, Türen und Dichtungen

### Typische Fragen

```text
Ist IP31, IP44, IP54 oder IP55 wirklich mit allen Durchführungen,
Lüftungen und Türen erreicht?
```

```text
Gilt die Schutzart nur für den Leerschrank oder auch für die fertig
bestückte Schaltgerätekombination?
```

### Kritische Punkte

- nachträglich eingebrachte Kabelverschraubungen
- Lüftungsgitter
- Filtermatten
- Türspalte
- geteilte Rückwände
- Bodenbleche
- Dachhauben
- nicht korrekt montierte Dichtungen
- Bedienöffnungen und Messbuchsen

### Prüfbericht: Was dokumentieren?

- geforderte Schutzart
- geprüfter Zustand: Türen zu, Klappen zu, Abdeckungen montiert
- verwendete Prüfmittel
- Fotos von kritischen Stellen
- Abweichungen durch Durchführungen oder Lüfter
- Ergebnis je Prüfabschnitt

---

## 10.4 Luft- und Kriechstrecken

Luft- und Kriechstrecken sind zentrale Sicherheitsanforderungen für Isolationskoordination.

### Begriffe

```text
Luftstrecke = kürzeste Entfernung durch Luft zwischen zwei leitfähigen Teilen
Kriechstrecke = kürzeste Entfernung entlang einer isolierenden Oberfläche
```

### Wovon hängen die Abstände ab?

- Bemessungsisolationsspannung
- Bemessungsstoßspannungsfestigkeit
- Überspannungskategorie
- Verschmutzungsgrad
- Werkstoffgruppe
- Art der Isolation
- Höhenlage
- Geometrie und Oberfläche

### Typische Prüfpunkte

- Abstand zwischen Phasen
- Abstand Phase zu PE
- Abstand Phase zu Gehäuse
- Abstand an Sammelschienen
- Abstand an Anschlussklemmen
- Abstand an Adaptern und Geräteanschlüssen
- Abstand hinter Abdeckungen
- Abstand bei geöffneten Türen, wenn Teile zugänglich werden

### Praktische Fehler

- zu enge Schienenführung
- Schraubenköpfe oder Unterlegscheiben verringern Abstand
- Kabelschuhe stehen ungünstig
- flexible Leiter liegen nach Montage anders als geplant
- metallische Abdeckungen oder Halter unterschreiten Abstand
- Verschmutzungsgrad nicht passend bewertet

### Prüfbericht: Was dokumentieren?

- Bemessungsdaten
- Verschmutzungsgrad
- Überspannungskategorie
- Werkstoffgruppe, falls relevant
- gemessene Mindestabstände
- kritische Messstellen mit Foto
- verwendetes Messmittel
- Ergebnis der Bewertung

---

## 10.5 Schutz gegen elektrischen Schlag und Schutzleiterkreis

Dieser Abschnitt ist sicherheitskritisch. Es geht um Schutzmaßnahmen gegen gefährliche Berührungsspannungen und um die Integrität des Schutzleiterkreises.

### Was wird betrachtet?

- Schutz gegen direktes Berühren
- Schutz gegen indirektes Berühren
- Verbindung berührbarer leitfähiger Teile mit dem Schutzleiterkreis
- Wirksamkeit und Dauerhaftigkeit der PE-Verbindungen
- Kurzschlussfestigkeit des Schutzleiterkreises
- Türen, Seitenwände, Montageplatten und Abdeckungen
- bewegliche Teile mit Schutzleiterverbindung

### Typische Fragen

```text
Sind alle berührbaren leitfähigen Teile sicher mit PE verbunden?
```

```text
Hält der Schutzleiterkreis den möglichen Fehlerstrom bis zur Abschaltung aus?
```

```text
Ist eine Tür über Scharniere ausreichend verbunden oder braucht sie eine separate PE-Leitung?
```

### Typische Prüfungen

- Sichtprüfung der Schutzleiterführung
- Durchgängigkeit / Niederohmmessung
- Bewertung von Querschnitten und Verbindungen
- Kurzschlussfestigkeitsnachweis des Schutzleiterkreises
- Prüfung von Verbindungspunkten, Schrauben, Zahnscheiben, Lackdurchdringung

### Kritische Punkte

- lackierte Montageflächen
- Türscharniere ohne sichere elektrische Kontinuität
- zu kleine PE-Leiter
- PE-Verbindung über mechanisch belastete Teile
- lose Schraubverbindungen
- nicht dokumentierte Erdungsbänder
- Aluminium/Kupfer-Übergänge ohne geeignete Verbindungstechnik

### Prüfbericht: Was dokumentieren?

- PE-Konzept
- Querschnitte
- Verbindungspunkte
- Messwerte der Durchgängigkeit
- Kurzschlussfestigkeitsnachweis
- Fotos kritischer PE-Verbindungen
- angewandtes Drehmoment bei PE-Schraubverbindungen, falls relevant

---

## 10.6 Einbau von Schaltgeräten und Komponenten

Hier wird bewertet, ob eingebaute Geräte und Komponenten korrekt ausgewählt und eingebaut wurden.

### Was wird geprüft?

- Geräte sind für Spannung, Strom, Kurzschlussdaten und Umgebung geeignet
- Einbau entspricht Herstellerangaben
- Einbaulage ist zulässig
- Belüftungsabstände werden eingehalten
- Derating ist berücksichtigt
- Anschlussquerschnitte passen
- Erwärmung durch Nachbargeräte ist berücksichtigt
- Schutzgeräte sind passend koordiniert

### Typische Komponenten

- Leistungsschalter
- Sicherungslasttrennschalter
- Lasttrennschalter
- Schütze
- Motorschutzschalter
- Messgeräte
- Steuertrafos
- Netzteile
- Frequenzumrichter
- Überspannungsschutzgeräte
- Klemmen
- Stromwandler

### Typische Fehler

- Gerät außerhalb seines Bemessungsbereichs eingesetzt
- falsche Einbaulage
- Hersteller-Derating nicht berücksichtigt
- zu geringe Lüftungsabstände
- Anschlussklemmen überlastet
- falsche Schutzgeräte-Koordination
- DC-Anwendung mit ungeeignetem AC-Gerät

### Prüfbericht: Was dokumentieren?

- Stückliste der relevanten Komponenten
- Datenblätter oder Typdaten
- Einbaulage
- Bemessungsdaten
- Derating-Annahmen
- Koordinationsdaten
- besondere Herstelleranweisungen

---

## 10.7 Interne Stromkreise und Verbindungen

Dieser Abschnitt betrifft die Auslegung und Ausführung der internen Verdrahtung, Sammelschienen und Verbindungen.

### Was wird betrachtet?

- Hauptstromkreise
- Hilfsstromkreise
- Steuerstromkreise
- Sammelschienen
- flexible Leiter
- Anschlussbrücken
- Schraubverbindungen
- Klemmenbrücken
- Leiterkennzeichnung
- Trennung unterschiedlicher Stromkreise

### Typische Fragen

```text
Sind Leiterquerschnitte, Verlegeart und Absicherung passend?
```

```text
Sind Sammelschienen mechanisch und thermisch ausreichend dimensioniert?
```

```text
Sind Verbindungen dauerhaft und gegen Lockerung gesichert?
```

### Kritische Punkte

- Übergangswiderstände an Schraubverbindungen
- falsche Drehmomente
- zu enge Biegeradien
- unzureichende Leiterbefestigung
- thermische Kopplung mehrerer belasteter Leiter
- fehlende Kurzschlussfestigkeit von Leitern
- fehlende Trennung von Leistungs- und Steuerkreisen

### Prüfbericht: Was dokumentieren?

- Leiterquerschnitte
- Material, z. B. Cu oder Al
- Schienenabmessungen
- Befestigungsabstände
- Drehmomente
- Kurzschlussdaten
- Temperaturmessstellen an kritischen Verbindungen
- Fotos von Sammelschienen und Anschlussstellen

---

## 10.8 Klemmen für externe Leiter

Dieser Abschnitt ist wichtig, weil Anschlussstellen häufig thermisch und mechanisch kritisch sind.

### Was wird geprüft?

- Anschlussraum ausreichend
- Klemmen für Leiterart geeignet
- Leiterquerschnitt passend
- Aluminium- oder Kupferleiter zulässig
- mehrdrähtig, feindrähtig, eindrähtig zulässig
- Zugänglichkeit für Montage und Wartung
- Kennzeichnung der Anschlüsse
- PE-/N-/PEN-Anschluss klar ausgeführt

### Typische Fehler

- Klemme nur für Cu, aber Al-Leiter geplant
- Leiterquerschnitt passt mechanisch, aber nicht thermisch
- Anschlussraum zu klein für Kabelschuhe
- Biegeradius nicht einhaltbar
- mehrere Leiter in einer Klemme ohne Zulassung
- falsche Aderendhülse

### Prüfbericht: Was dokumentieren?

- zulässige Leiterarten
- minimaler und maximaler Anschlussquerschnitt
- Anschlussart
- geforderte Drehmomente
- Anschlussraum und Biegeradius
- Beschriftung
- Fotos der Anschlussbereiche

---

## 10.9 Dielektrische Eigenschaften

Dieser Abschnitt prüft, ob die Isolation der Schaltgerätekombination ausreichend ist.

### Was wird geprüft?

- Netzfrequente Spannungsfestigkeit
- Stoßspannungsfestigkeit
- Isolationskoordination
- Verhalten von Isolierstoffgehäusen
- Bediengriffe und Abdeckungen aus Isolierstoff
- Schutz durch isolierende Abdeckungen

### Typische Fragen

```text
Hält die Anlage die geforderte Prüfspannung ohne Durchschlag oder Überschlag aus?
```

```text
Passen Luft- und Kriechstrecken zur angegebenen Bemessungsstoßspannungsfestigkeit?
```

### Prüfvorbereitung

- Schaltpläne prüfen
- empfindliche Elektronik abklemmen, wenn zulässig und erforderlich
- Überspannungsschutz beachten
- Prüfspannung und Prüfstellen eindeutig festlegen
- Zustand der Anlage dokumentieren
- Sicherheitsbereich einrichten

### Typische Fehler

- Elektronik wird versehentlich mitgeprüft und beschädigt
- Überspannungsschutz beeinflusst Prüfung
- Neutralleiter/PE-Verbindungen nicht korrekt berücksichtigt
- Prüfspannung an falscher Stelle angelegt
- Feuchtigkeit oder Verschmutzung verursacht Fehlbewertung

### Prüfbericht: Was dokumentieren?

- Prüfspannung
- Prüfdauer
- Prüfstellen
- Zustand der Schaltgeräte
- abgetrennte Komponenten
- Umgebung und Auffälligkeiten
- Ergebnis: bestanden / nicht bestanden
- Durchschlag, Überschlag oder Auslösung

---

## 10.10 Temperaturerhöhung

Die Temperaturerhöhung ist einer der wichtigsten und aufwendigsten Nachweise. Sie zeigt, ob die Schaltgerätekombination ihre Bemessungsströme thermisch sicher führen kann.

### Ziel der Prüfung

```text
Nachweis, dass die zulässigen Temperaturerhöhungen an Geräten,
Klemmen, Sammelschienen, Leitern, Gehäusen und Bedienflächen
unter definierten Betriebsbedingungen nicht überschritten werden.
```

### Mögliche Nachweiswege

| Nachweisweg | Wann geeignet? | Risiko |
| --- | --- | --- |
| **Prüfung mit Strom** | Neue Konstruktion, hohe Ströme, unklare Erwärmung, kritische Bauform | Aufwendig, aber belastbar. |
| **Ableitung von geprüftem Design** | Varianten einer geprüften Plattform | Nur zulässig, wenn Ähnlichkeit wirklich begründet ist. |
| **Bewertung / Berechnung** | Kleine oder klar begrenzte Systeme, bekannte Verlustleistungen, Herstellerdaten | Gefahr der Unterschätzung von Hotspots. |

### Typische Eingangsdaten

- Bemessungsstrom der Schaltgerätekombination
- Bemessungsstrom der Einspeisung
- Bemessungsstrom der Abgänge
- Gruppen-Bemessungsstrom
- Gleichzeitigkeit / Belastungsfaktor
- Umgebungstemperatur
- Aufstellungsart
- Schutzart
- Lüftung oder Klimatisierung
- Verlustleistungen der Geräte
- Schienen- und Leiterquerschnitte
- Anschlussbedingungen
- Produktteil, z. B. IEC 61439-2 oder -6

### Typische Messstellen

- Einspeiseklemmen
- Abgangsklemmen
- Sammelschienen
- Schienenverbindungen
- Leistungsschalteranschlüsse
- Sicherungslasttrennschalter
- Schütze
- Klemmenleisten
- PE-/N-/PEN-Schienen
- Kabelanschlussräume
- Lüftungsaustritt
- Bediengriffe und berührbare Flächen
- Innenraumluft in unterschiedlichen Höhen

### Prüfaufbau

```text
1. Prüfling vollständig dokumentieren
2. Anschlussbedingungen festlegen
3. Stromkreise nach Prüfplan belasten
4. Temperaturmessstellen montieren
5. Umgebungstemperatur messen
6. Strom, Spannung und Leistung überwachen
7. Bis zum thermisch stabilen Zustand prüfen
8. Grenzwerte bewerten
9. Messunsicherheit und Auffälligkeiten dokumentieren
```

### Thermisch stabiler Zustand

Ein stabiler Zustand ist erreicht, wenn sich die Temperaturen nur noch gering ändern. Für die Bewertung sollte im Prüfplan definiert sein, welches Stabilitätskriterium verwendet wird.

Beispiel für ein internes Kriterium:

```text
Stabil, wenn die Temperaturänderung über 1 h kleiner als 1 K ist.
```

Das konkrete Kriterium muss mit Norm, Laborvorgabe und Prüfplan abgeglichen werden.

### Typische Formeln

Temperaturerhöhung gegenüber Umgebung:

```text
ΔT = T_Messstelle - T_Umgebung
```

Temperaturdifferenz zwischen zwei Messstellen:

```text
ΔT_12 = T_1 - T_2
```

Gradient zur Stabilitätsbewertung:

```text
dT/dt ≈ (T_2 - T_1) / (t_2 - t_1)
```

Verlustleistung bei ohmschem Anteil:

```text
P = I² · R
```

### Typische Fehler bei Temperaturprüfungen

- falsche oder unklare Bemessungsströme
- Umgebungstemperatur falsch erfasst
- Sensor schlecht thermisch gekoppelt
- Sensor sitzt nicht am Hotspot
- Anschlussleiter entsprechen nicht den vorgesehenen Bedingungen
- Tür offen statt geschlossen geprüft
- Lüfter, Filter oder Abdeckungen nicht im Serienzustand
- Lastverteilung entspricht nicht dem späteren Betrieb
- Prüfung wird vor thermischer Stabilität beendet
- Messunsicherheit wird im Grenzwertfall ignoriert

### Prüfbericht: Was muss rein?

- Prüfling und Variante
- Normteil und Ausgabe
- Bemessungsdaten
- Belastete Stromkreise
- Prüfströme je Stromkreis
- Anschlussleiter und Länge, soweit relevant
- Umgebungstemperatur
- Messstellenplan
- Fotos der Sensorpositionen
- Messgeräte und Kalibrierstatus
- Messunsicherheit
- Temperaturverlauf
- Maximalwerte
- Temperaturerhöhungen gegenüber Umgebung
- Bewertung je Messstelle
- Abweichungen vom Prüfplan

---

## 10.11 Kurzschlussfestigkeit

Der Kurzschlussnachweis zeigt, ob die Schaltgerätekombination den thermischen und dynamischen Beanspruchungen eines Kurzschlusses standhält.

### Was wird nachgewiesen?

- mechanische Festigkeit von Sammelschienen und Haltern
- thermische Kurzzeitfestigkeit
- dynamische Festigkeit bei Stoßkurzschlussstrom
- Verhalten von Verbindungen
- Schutzleiterkreis unter Fehlerbedingungen
- Koordination mit Schutzgeräten
- Begrenzungswirkung von Sicherungen oder Leistungsschaltern

### Wichtige Begriffe

| Begriff | Bedeutung |
| --- | --- |
| **Icw** | Bemessungskurzzeitstrom, den die Anlage für eine bestimmte Zeit tragen kann. |
| **Ipk** | Bemessungsstoßstrom, also maximaler Scheitelwert der Kurzschlussbeanspruchung. |
| **Icc** | Bedingter Bemessungskurzschlussstrom mit vorgeschaltetem Schutzgerät. |
| **Prospektiver Kurzschlussstrom** | Kurzschlussstrom, der am Einbauort ohne Begrenzung verfügbar wäre. |

### Mögliche Nachweiswege

| Nachweisweg | Wann geeignet? |
| --- | --- |
| **Prüfung** | Neue oder kritische Schienensysteme, hohe Kurzschlussströme, neue Halter, neue Geometrie. |
| **Vergleich mit Referenzdesign** | Wenn Geometrie, Schienen, Halter, Abstände, Schutzgeräte und Kurzschlussdaten vergleichbar oder konservativer sind. |
| **Berechnung / Bewertung** | Für bestimmte Aspekte und Varianten, wenn die Norm dies zulässt und belastbare Daten vorhanden sind. |

### Typische Eingangsdaten

- Netzkurzschlussdaten am Einbauort
- Icw und Zeitdauer
- Ipk
- Icc und vorgeschaltetes Schutzgerät
- Schutzgerätedaten und Kennlinien
- Schienenmaterial und Querschnitt
- Schienenabstände
- Halterabstände
- Befestigungsmaterial
- PE-/PEN-Ausführung
- Einbau- und Anschlussbedingungen

### Kritische Punkte

- hohe elektrodynamische Kräfte zwischen Schienen
- unzureichende Schienenhalter
- zu große Halterabstände
- schwache Schraubverbindungen
- thermische Überlastung von Leitern
- nicht geeignete Schutzgerätekoordination
- nicht berücksichtigte Einspeiserichtung
- Varianten weichen stärker vom Referenzdesign ab als angenommen

### Prüfbericht: Was dokumentieren?

- Kurzschlussdaten
- Prüfstrom und Dauer
- Stoßstrom
- Netz- oder Prüfkreisparameter
- Schutzgeräte und Einstellungen
- Schienenaufbau
- Halterabstände
- Fotos vor und nach der Prüfung
- Verformungen, Risse, gelöste Teile
- Durchgängigkeit des Schutzleiterkreises nach der Prüfung
- Isolations-/Spannungsprüfung nach der Kurzschlussprüfung, wenn gefordert
- klare Bewertung bestanden / nicht bestanden

---

## 10.12 Elektromagnetische Verträglichkeit, EMV

EMV bedeutet, dass die Schaltgerätekombination ihre Umgebung nicht unzulässig stört und selbst ausreichend störfest ist.

### Was wird betrachtet?

- Störaussendung
- Störfestigkeit
- eingebaute elektronische Komponenten
- Frequenzumrichter
- Schaltnetzteile
- Kommunikationsmodule
- Messgeräte
- Filter
- Schirmung
- Erdungs- und Potentialausgleichskonzept
- Leitungsführung

### Wann ist EMV besonders wichtig?

- bei Frequenzumrichtern
- bei Leistungselektronik
- bei Ladeinfrastruktur
- bei Mess- und Kommunikationssystemen
- bei langen Leitungen
- bei sensiblen Steuerungen
- bei hoher Schaltfrequenz

### Typische Maßnahmen

- getrennte Verlegung von Leistungs- und Signalleitungen
- kurze PE-/Schirmanschlüsse
- 360°-Schirmanbindung
- Filter richtig platzieren
- EMV-gerechte Montageplatten
- saubere Erdungsstruktur
- geeignete Kabelverschraubungen

### Prüfbericht: Was dokumentieren?

- EMV-Konzept
- relevante Komponenten
- Filter und Schirme
- Leitungsführung
- verwendete Herstellerangaben
- durchgeführte Prüfungen oder Bewertungen
- Abweichungen zur Serienausführung

---

## 10.13 Mechanische Funktion

Dieser Abschnitt betrifft mechanische Betätigungen, die für Sicherheit und Funktion relevant sind.

### Typische Prüfpunkte

- Türverriegelungen
- Einschübe
- Ausfahrmechanismen
- Schaltstellungen
- Betätigungsgriffe
- mechanische Kopplungen
- Verriegelungen gegen Fehlbedienung
- Klappen und Abdeckungen

### Typische Fragen

```text
Funktioniert der Mechanismus nach wiederholter Betätigung noch sicher?
```

```text
Bleibt die Verriegelung auch nach mechanischer Beanspruchung wirksam?
```

### Prüfbericht: Was dokumentieren?

- geprüfte Mechanismen
- Anzahl der Betätigungen
- Anfangs- und Endzustand
- Auffälligkeiten
- Verschleiß, Spiel, Klemmen, Bruch
- Fotos oder Videos bei kritischen Mechanismen

---

## Prüfplan für Kapitel 10 erstellen

Ein guter Prüfplan verhindert spätere Diskussionen über Nachweisumfang und Prüfbarkeit.

### Mindeststruktur

```text
1. Prüfling / Variante
2. Anzuwendende Normteile
3. Bemessungsdaten
4. Relevante Kapitel-10-Merkmale
5. Gewählter Nachweisweg je Merkmal
6. Prüfaufbau
7. Messmittel
8. Akzeptanzkriterien
9. Dokumentationsanforderungen
10. Abweichungsmanagement
```

### Tabelle für den Prüfplan

| Merkmal | Kapitel | Nachweisweg | Eingangsdata | Ergebnisdokument |
| --- | --- | --- | --- | --- |
| Schutzart | 10.3 | Prüfung | IP-Anforderung, Gehäusezustand | IP-Prüfbericht |
| Luft-/Kriechstrecken | 10.4 | Bewertung/Messung | Spannung, Verschmutzungsgrad | Bewertungsprotokoll |
| Schutzleiterkreis | 10.5 | Prüfung/Bewertung | PE-Konzept, Kurzschlussdaten | PE-Prüfbericht |
| Temperaturerhöhung | 10.10 | Prüfung/Vergleich/Bewertung | Ströme, Verlustleistung, Umgebung | Temperaturprüfbericht |
| Kurzschlussfestigkeit | 10.11 | Prüfung/Vergleich/Berechnung | Icw, Ipk, Icc, Schutzgeräte | Kurzschlussbericht |
| EMV | 10.12 | Prüfung/Bewertung | Komponenten, EMV-Konzept | EMV-Bewertung |
| Mechanische Funktion | 10.13 | Prüfung | Bedienzyklen, Mechanik | Funktionsprüfbericht |

---

## Was gehört in einen Bauartnachweisbericht?

Ein Bauartnachweisbericht sollte so aufgebaut sein, dass ein fachkundiger Dritter die Entscheidung nachvollziehen kann.

### Empfohlene Struktur

```text
1. Titel und Identifikation
2. Prüfling / Bauart / Variante
3. Hersteller / Original Manufacturer
4. Normen und Ausgaben
5. Anwendungsbereich und Produktteil
6. Bemessungsdaten
7. Beschreibung der Konstruktion
8. Liste der Kapitel-10-Nachweise
9. Nachweisweg je Merkmal
10. Prüfergebnisse und Bewertungsgrundlagen
11. Abweichungen und Einschränkungen
12. Variantenfreigabe
13. Zusammenfassung bestanden / nicht bestanden
14. Anhänge: Fotos, Messdaten, Zeichnungen, Datenblätter
```

### Wichtig bei Varianten

Wenn Varianten über Vergleich oder Ableitung freigegeben werden, muss klar dokumentiert sein:

- Referenzdesign
- Unterschied zur Variante
- warum die Variante nicht kritischer ist
- welche Parameter gleich oder konservativer sind
- welche Grenzen für die Variante gelten
- welche Prüfungen trotzdem wiederholt werden müssen

---

## Häufige Fehler bei Kapitel-10-Nachweisen

| Fehler | Warum kritisch? |
| --- | --- |
| Kapitel 10 und Kapitel 11 werden vermischt | Stückprüfung ersetzt keinen Bauartnachweis. |
| Nur Komponenten-Zertifikate gesammelt | Die Kombination als System muss bewertet werden. |
| Temperaturprüfung ohne realistische Anschlussbedingungen | Ergebnisse sind nicht repräsentativ. |
| Varianten werden zu großzügig aus Referenzdesign abgeleitet | Bauartnachweis kann ungültig werden. |
| Schutzart nur am Leergehäuse betrachtet | Fertige Anlage kann durch Durchbrüche schlechter sein. |
| Kurzschlussdaten des Einbauorts fehlen | Kurzschlussfestigkeit kann nicht sauber bewertet werden. |
| PE-Verbindungen nur optisch geprüft | Wirksamkeit und Kurzschlussfestigkeit können unklar bleiben. |
| EMV nur über Einzelgeräte bewertet | Leitungsführung und Einbau können entscheidend sein. |
| Messstellen bei Temperaturprüfung nicht fotografiert | Ergebnisse sind später schwer nachvollziehbar. |

---

## Schnelle Entscheidung: Wann muss wirklich geprüft werden?

Eine reale Prüfung ist besonders wahrscheinlich erforderlich, wenn:

- die Konstruktion neu ist,
- kein geprüftes Referenzdesign vorhanden ist,
- hohe Ströme auftreten,
- die thermische Situation unklar ist,
- Schienenhalter oder Sammelschienen geändert wurden,
- Kurzschlussbeanspruchungen hoch sind,
- Schutzart durch neue Durchbrüche beeinflusst wird,
- neue Isolierstoffe verwendet werden,
- Leistungselektronik oder EMV-kritische Komponenten eingebaut werden,
- der Kunde oder Zertifizierer einen Prüfnachweis fordert.

Ein Vergleich mit einem Referenzdesign ist eher möglich, wenn:

- Aufbau und Plattform gleich bleiben,
- Ströme nicht höher sind,
- Verlustleistungen nicht höher sind,
- Schienenquerschnitte und Halterabstände gleich oder konservativer sind,
- Schutzgeräte gleich oder geeigneter sind,
- Gehäuse, Lüftung und Schutzart vergleichbar sind,
- die Abweichungen sauber dokumentiert sind.

---

## Merksätze für Kapitel 10

- Kapitel 10 ist der **Bauartnachweis**, nicht die Endprüfung.
- Der Bauartnachweis bewertet die **Schaltgerätekombination als System**.
- Komponenten-Zertifikate sind hilfreich, aber ersetzen nicht automatisch den Systemnachweis.
- Temperaturerhöhung und Kurzschlussfestigkeit sind oft die aufwendigsten Nachweise.
- Varianten dürfen nur dann abgeleitet werden, wenn die Vergleichslogik nachvollziehbar und konservativ ist.
- Jede Abweichung vom Referenzdesign muss technisch bewertet werden.
- Ein guter Prüfbericht enthält Messwerte, Fotos, Prüfbedingungen, Messmittel und klare Akzeptanzkriterien.

---

## Interne Checkliste für Review-Meetings

```text
[ ] Passender Produktteil bestimmt?
[ ] IEC 61439-1 zusätzlich berücksichtigt?
[ ] Bemessungsdaten vollständig?
[ ] Kapitel-10-Matrix erstellt?
[ ] Nachweisweg je Merkmal festgelegt?
[ ] Referenzdesign vorhanden?
[ ] Variantenunterschiede dokumentiert?
[ ] Temperaturmessstellenplan erstellt?
[ ] Kurzschlussdaten und Schutzgeräte bekannt?
[ ] PE-Konzept geprüft?
[ ] IP-Schutzart am fertigen Aufbau bewertet?
[ ] Luft- und Kriechstrecken an kritischen Stellen geprüft?
[ ] EMV-Konzept dokumentiert?
[ ] Mechanische Funktionen geprüft?
[ ] Bauartnachweisbericht vollständig?
[ ] Stückprüfplan nach Kapitel 11 daraus abgeleitet?
```

---

## Hinweis zum Normtext

Diese Seite beschreibt die praktische Anwendung und typische Prüfplanung. Für exakte Grenzwerte, zulässige Nachweiswege, Tabellenwerte und Akzeptanzkriterien muss immer der offizielle Normtext der zutreffenden Ausgabe verwendet werden.
