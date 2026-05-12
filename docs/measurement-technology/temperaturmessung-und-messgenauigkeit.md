---
sidebar_position: 1
---

# Temperaturmessung und Messgenauigkeit

Temperaturmessungen wirken auf den ersten Blick einfach: Ein Sensor wird angebracht, ein Messwert wird angezeigt und anschließend bewertet. In der Praxis hängt die Aussagekraft einer Temperaturmessung jedoch stark davon ab, **was genau gemessen werden soll**, **wie der Sensor thermisch gekoppelt ist** und **welche Messunsicherheiten in der gesamten Messkette auftreten**.

Diese Seite fasst die wichtigsten Grundlagen für technische Temperaturmessungen im Labor-, Prüfstands- und Entwicklungsumfeld zusammen.

---

## Ziel einer Temperaturmessung

Vor jeder Messung sollte klar definiert werden, welche Temperatur tatsächlich relevant ist.

Typische Fragestellungen sind:

- Welche Temperatur hat ein Bauteil an einer kritischen Stelle?
- Welche maximale Temperatur tritt während einer Belastungsprüfung auf?
- Wie groß ist die Temperaturdifferenz zwischen zwei Messpunkten?
- Wie schnell steigt oder fällt die Temperatur?
- Wird ein Grenzwert sicher eingehalten?

Wichtig ist dabei: Ein Temperatursensor misst immer nur seine **eigene Sensortemperatur**. Diese entspricht nur dann der gesuchten Bauteiltemperatur, wenn der Sensor ausreichend gut thermisch an die Messstelle gekoppelt ist.

---

## Wichtige Begriffe

| Begriff | Bedeutung |
| --- | --- |
| **Messwert** | Angezeigter oder aufgezeichneter Temperaturwert. |
| **Wahrer Wert** | Idealer, nicht exakt bekannter Temperaturwert der Messgröße. |
| **Messabweichung** | Differenz zwischen Messwert und wahrem Wert. |
| **Messunsicherheit** | Bereich, in dem der wahre Wert mit einer bestimmten Wahrscheinlichkeit liegt. |
| **Auflösung** | Kleinster darstellbarer Temperaturunterschied des Messsystems. |
| **Genauigkeit** | Qualitätsangabe, wie nahe ein Messwert am wahren Wert liegt. |
| **Wiederholbarkeit** | Streuung bei mehrfacher Messung unter gleichen Bedingungen. |
| **Reproduzierbarkeit** | Streuung bei Messungen unter veränderten Bedingungen, z. B. anderer Bediener oder anderer Aufbau. |
| **Kalibrierung** | Vergleich mit einem Referenznormal und Ermittlung der Abweichung. |
| **Justierung** | Einstellung eines Messgeräts, um die Abweichung zu verringern. |

:::important
Eine hohe Anzeigeauflösung bedeutet nicht automatisch eine hohe Messgenauigkeit. Ein Gerät kann z. B. 0,01 °C anzeigen, obwohl die reale Messunsicherheit deutlich größer ist.
:::

---

## Typische Temperatursensoren

### Thermoelemente

Thermoelemente erzeugen eine temperaturabhängige Thermospannung. Sie sind robust, schnell und für große Temperaturbereiche geeignet.

**Vorteile:**

- großer Temperaturbereich
- mechanisch robust
- kleine Bauformen möglich
- gute Dynamik bei dünnen Messstellen

**Nachteile:**

- vergleichsweise geringe Genauigkeit ohne Kalibrierung
- benötigt Vergleichsstellenkompensation
- empfindlich gegenüber schlechten Kontaktstellen und Ausgleichsleitungen
- Messfehler durch falsche Thermoelementtypen möglich

Typische Anwendungen sind Erwärmungsprüfungen, Prüfstände, Prototypenmessungen und Messungen an schwer zugänglichen Stellen.

---

### Widerstandsthermometer, z. B. Pt100 oder Pt1000

Widerstandsthermometer nutzen die Temperaturabhängigkeit des elektrischen Widerstands. Pt100 und Pt1000 sind im industriellen Umfeld sehr verbreitet.

**Vorteile:**

- gute Genauigkeit
- gute Langzeitstabilität
- gut geeignet für Referenz- und Prozessmessungen

**Nachteile:**

- meist langsamer als kleine Thermoelemente
- Eigenerwärmung durch Messstrom möglich
- Leitungswiderstände müssen berücksichtigt werden
- mechanisch oft größer als Thermoelemente

Bei Pt100-Messungen sind 3-Leiter- oder 4-Leiter-Schaltungen häufig genauer als einfache 2-Leiter-Schaltungen, weil Leitungswiderstände besser kompensiert werden.

---

### NTC- und PTC-Sensoren

NTC- und PTC-Sensoren ändern ihren Widerstand stark mit der Temperatur. Sie werden oft in Elektronik, Batterien, Netzteilen oder kompakten Baugruppen eingesetzt.

**Vorteile:**

- hohe Empfindlichkeit
- günstig
- kleine Bauformen
- gut für Überwachung und Schutzfunktionen

**Nachteile:**

- nichtlinear
- begrenzter Temperaturbereich
- oft schlechtere Austauschbarkeit
- Kalibrierung oder Kennlinienkorrektur erforderlich

---

### Infrarot- und Wärmebildmessung

Berührungslose Temperaturmessungen erfassen Wärmestrahlung. Sie sind hilfreich, wenn Sensoren nicht montiert werden können oder wenn Temperaturverteilungen sichtbar gemacht werden sollen.

**Vorteile:**

- keine Beeinflussung der Messstelle durch Sensorbefestigung
- schnelle Erfassung großer Flächen
- gut zur Hotspot-Suche

**Nachteile:**

- stark abhängig vom Emissionsgrad
- Reflexionen können Messwerte verfälschen
- nicht direkt geeignet für blanke metallische Oberflächen ohne Korrektur
- misst Oberflächentemperatur, nicht die Temperatur im Inneren

:::warning
Bei glänzenden oder metallischen Oberflächen kann eine Wärmebildkamera deutlich falsche Temperaturen anzeigen. In solchen Fällen sollte der Emissionsgrad angepasst oder eine definierte Messfläche, z. B. mit geeignetem Messband oder Lack, geschaffen werden.
:::

---

## Messkette einer Temperaturmessung

Eine Temperaturmessung besteht nicht nur aus dem Sensor. Die gesamte Messkette beeinflusst das Ergebnis.

```text
Messstelle
  → thermische Kopplung
  → Sensor
  → Anschlussleitung
  → Messmodul / Datenlogger
  → Skalierung / Linearisierung
  → Aufzeichnung
  → Auswertung
```

Fehler können an jeder Stelle entstehen. Deshalb sollte nicht nur der Sensortyp betrachtet werden, sondern auch Befestigung, Leitung, Messgerät, Abtastrate und Auswerteverfahren.

---

## Hauptquellen für Messfehler

### 1. Schlechte thermische Kopplung

Der häufigste Fehler entsteht durch schlechten Kontakt zwischen Sensor und Messstelle.

Beispiele:

- Sensor liegt nicht plan auf.
- Klebeband hält den Sensor mechanisch, aber nicht thermisch gut.
- Luftspalt zwischen Sensor und Oberfläche.
- Sensor wird durch Zug an der Leitung abgehoben.
- Messstelle ist gekrümmt oder schlecht zugänglich.

**Gute Praxis:**

- Sensor mechanisch spannungsfrei befestigen.
- Möglichst kleine Luftspalte vermeiden.
- Geeignete Wärmeleitpaste, Kleber oder Klemmung verwenden.
- Sensorposition fotografisch dokumentieren.
- Bei kritischen Messpunkten Plausibilitätsmessungen durchführen.

---

### 2. Wärmeableitung über den Sensor

Der Sensor und seine Leitung können Wärme von der Messstelle wegführen oder zusätzliche Wärme einbringen.

Das ist besonders relevant bei:

- kleinen Bauteilen
- dünnen Leitern
- Leiterplatten
- kleinen Kontaktflächen
- starkem Luftstrom
- schnellen Temperaturänderungen

Ein großer Sensor auf einem kleinen Bauteil kann die tatsächliche Temperatur verändern und dadurch selbst zum Messfehler werden.

---

### 3. Falsche Sensorposition

Bei Erwärmungsprüfungen entscheidet die Position häufig darüber, ob ein kritischer Hotspot erkannt wird.

Typische Fehler:

- Sensor sitzt neben dem eigentlichen Hotspot.
- Sensor sitzt auf einer Schraube statt auf dem Leiter.
- Sensor erfasst Umgebungsluft statt Bauteiltemperatur.
- Messpunkt ist nicht eindeutig dokumentiert.

**Empfehlung:** Messpunkte vorab festlegen, nummerieren und mit Fotos oder Skizzen dokumentieren.

---

### 4. Luftbewegung und Umgebungseinfluss

Luftströmungen können die gemessene Temperatur deutlich beeinflussen.

Mögliche Ursachen:

- geöffnete Schaltschranktüren
- Lüfter
- Klimaanlage
- Personenbewegung im Labor
- thermische Abschirmung durch Abdeckungen
- Sonneneinstrahlung oder externe Wärmequellen

Deshalb sollten Umgebungsbedingungen während der Messung dokumentiert werden.

---

### 5. Eigenerwärmung

Bei Widerstandssensoren fließt ein Messstrom. Dieser kann den Sensor leicht erwärmen. Der Effekt ist meist klein, kann bei kleinen Sensoren oder schlechter Wärmeabfuhr aber relevant werden.

---

### 6. Fehler durch Leitungen und Anschlussart

Bei Pt100- oder Pt1000-Sensoren kann der Leitungswiderstand das Messergebnis verfälschen. Deshalb ist die Anschlussart wichtig.

| Anschlussart | Bewertung |
| --- | --- |
| **2-Leiter** | Einfach, aber Leitungswiderstand geht direkt in den Messwert ein. |
| **3-Leiter** | Industrieller Standard, Leitungswiderstand wird teilweise kompensiert. |
| **4-Leiter** | Sehr genau, besonders für Referenzmessungen geeignet. |

Bei Thermoelementen müssen passende Thermoleitungen oder Ausgleichsleitungen verwendet werden. Falsche Leitungsmaterialien können zusätzliche Thermospannungen erzeugen.

---

### 7. Kalibrierung und Drift

Sensoren und Messgeräte können über die Zeit driften. Mechanische Belastung, hohe Temperaturen, Feuchtigkeit oder Alterung können die Abweichung vergrößern.

Für belastbare Messungen sollte festgelegt werden:

- Wann wurde der Sensor zuletzt kalibriert?
- Wurde die gesamte Messkette oder nur der Sensor kalibriert?
- Gibt es ein Kalibrierzertifikat?
- Ist die Messunsicherheit des Kalibrierlabors bekannt?
- Passt der kalibrierte Bereich zum realen Einsatzbereich?

:::tip
Für Prüfberichte ist eine Kalibrierung der gesamten Messkette besonders wertvoll: Sensor, Leitung, Messmodul und Auswertesystem werden dann gemeinsam betrachtet.
:::

---

## Messgenauigkeit richtig bewerten

Die Messgenauigkeit ergibt sich nicht aus einer einzigen Zahl. Sie setzt sich aus mehreren Beiträgen zusammen.

Typische Beiträge sind:

- Sensorabweichung
- Messgeräteabweichung
- Auflösung des Messsystems
- Kalibrierunsicherheit
- Kontaktfehler an der Messstelle
- Umgebungseinfluss
- Drift
- Auswertefehler

Eine vereinfachte Betrachtung kann so aussehen:

```text
Gesamtunsicherheit ≈ Sensorfehler
                   + Messgerätefehler
                   + Kontakt- und Montageeinfluss
                   + Kalibrierunsicherheit
                   + Umgebungseinfluss
```

Für eine formale Messunsicherheitsbetrachtung werden Einzelbeiträge normalerweise nicht einfach addiert, sondern je nach Unsicherheitsart mathematisch kombiniert. Für praktische Laborbewertungen ist die obige Auflistung trotzdem hilfreich, um die wichtigsten Fehlerquellen nicht zu übersehen.

---

## Beispiel: Messwert interpretieren

Angenommen, ein Messsystem zeigt an einem Leiteranschluss folgende Temperatur an:

```text
Tgemessen = 88 °C
```

Der Grenzwert liegt bei:

```text
TGrenze = 90 °C
```

Auf den ersten Blick scheint der Grenzwert eingehalten zu sein. Wenn die Messunsicherheit aber z. B. ±3 K beträgt, kann die tatsächliche Temperatur im ungünstigen Fall auch über 90 °C liegen.

```text
Möglicher Bereich: 85 °C bis 91 °C
```

Das bedeutet: Der Messwert liegt sehr nah am Grenzwert. Für eine sichere Bewertung reicht die reine Anzeige von 88 °C möglicherweise nicht aus.

**Praktische Konsequenz:**

- Messstelle prüfen
- Sensorbefestigung kontrollieren
- Messung wiederholen
- zusätzliche Messpunkte setzen
- Sicherheitsabstand zum Grenzwert definieren
- Messunsicherheit im Prüfbericht angeben

---

## Temperaturdifferenzen und Trends

In vielen Prüfungen ist nicht nur die absolute Temperatur wichtig, sondern auch die Differenz oder der zeitliche Verlauf.

Beispiele:

```text
ΔT = T1 - T2
```

oder

```text
Temperaturanstieg = ΔT / Δt
```

Temperaturdifferenzen sind oft robuster als absolute Temperaturen, wenn beide Sensoren gleichartig montiert sind und ähnliche Fehlerquellen haben. Trotzdem können auch Differenzmessungen fehlerhaft sein, wenn die Sensoren unterschiedlich befestigt sind oder unterschiedliche thermische Kopplung haben.

---

## Gute Praxis für Temperaturmessungen

### Vorbereitung

- Messziel eindeutig festlegen.
- Kritische Messpunkte anhand von Strompfad, Verlustleistung und Bauteilgeometrie bestimmen.
- Geeigneten Sensortyp auswählen.
- Messbereich und erwartete Temperatur prüfen.
- Kalibrierstatus der Messkette kontrollieren.
- Abtastrate passend zur Dynamik wählen.

### Aufbau

- Sensoren eindeutig beschriften.
- Messpunkte fotografieren.
- Leitungen mechanisch entlasten.
- Sensoren gegen Ablösen sichern.
- Umgebungseinflüsse minimieren.
- Thermische Kopplung plausibilisieren.

### Durchführung

- Startbedingungen dokumentieren.
- Umgebungstemperatur erfassen.
- Messdaten kontinuierlich aufzeichnen.
- Auffällige Ereignisse notieren, z. B. Tür geöffnet, Lüfter eingeschaltet, Laständerung.
- Messung ausreichend lange laufen lassen, bis ein stabiler Zustand erreicht ist oder das definierte Prüfkriterium erfüllt ist.

### Auswertung

- Maximalwerte bestimmen.
- Temperaturdifferenzen berechnen.
- Einschwingverhalten beurteilen.
- Messunsicherheit berücksichtigen.
- Grenzwertabstand bewerten.
- Rohdaten und Auswerteskripte nachvollziehbar ablegen.

---

## Checkliste für Prüfberichte

Für nachvollziehbare Temperaturmessungen sollten folgende Angaben im Prüfbericht enthalten sein:

- verwendeter Sensortyp
- Messgerät oder Datenlogger
- Seriennummern, falls relevant
- Kalibrierstatus
- Messbereich
- Abtastrate
- Messpunktbezeichnung
- Befestigungsart der Sensoren
- Fotos oder Skizzen der Messstellen
- Umgebungstemperatur
- Lastprofil oder Prüfstrom
- Dauer der Messung
- maximale Temperatur
- Temperaturdifferenzen, falls relevant
- Bewertung der Messunsicherheit
- besondere Ereignisse während der Messung

---

## Typische Fehler im Laboralltag

| Fehler | Mögliche Auswirkung |
| --- | --- |
| Sensor nur lose angeklebt | Messwert ist zu niedrig oder reagiert verzögert. |
| Falscher Thermoelementtyp eingestellt | Systematische Temperaturabweichung. |
| Messpunkt nicht dokumentiert | Messung ist später schwer nachvollziehbar. |
| Wärmebildkamera auf blankem Metall eingesetzt | Reflexionen und falsche Temperaturwerte. |
| Zu geringe Abtastrate | Temperaturspitzen werden übersehen. |
| Grenzwert ohne Unsicherheit bewertet | Bauteil wird möglicherweise zu optimistisch beurteilt. |
| Sensorleitung unter Zug | Sensor kann sich während der Prüfung lösen. |

---

## Kurze Merksätze

- Ein Temperatursensor misst zuerst seine eigene Temperatur.
- Gute thermische Kopplung ist oft wichtiger als eine hohe Displayauflösung.
- Messgenauigkeit betrifft die gesamte Messkette, nicht nur den Sensor.
- Nahe am Grenzwert muss die Messunsicherheit immer berücksichtigt werden.
- Ohne dokumentierte Messstelle ist ein Temperaturmesswert nur eingeschränkt nachvollziehbar.
- Wärmebildmessungen sind sehr hilfreich, aber stark vom Emissionsgrad abhängig.

---

## Weiterführende Themen

Mögliche Ergänzungen für spätere Wiki-Seiten:

- Kalibrierung von Temperaturmessketten
- Messunsicherheitsbudget nach GUM
- Thermoelemente Typ K, J, T und N im Vergleich
- Pt100/Pt1000 in 2-, 3- und 4-Leiter-Schaltung
- Wärmebildkamera: Emissionsgrad und Reflexionen
- Temperaturmessung an Stromschienen und Kontaktstellen
- Automatisierte Temperaturauswertung mit Python
