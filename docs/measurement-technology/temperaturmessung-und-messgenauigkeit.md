---
sidebar_position: 1
---

# Temperaturmessung und Messgenauigkeit

Temperaturmessungen wirken auf den ersten Blick einfach: Ein Sensor wird angebracht, ein Messwert wird angezeigt und anschließend bewertet. In der Praxis hängt die Aussagekraft einer Temperaturmessung jedoch stark davon ab, **was genau gemessen werden soll**, **wie der Sensor thermisch gekoppelt ist** und **welche Messunsicherheiten in der gesamten Messkette auftreten**.

Diese Seite fasst die wichtigsten Grundlagen, Formeln und Python-Auswertungen für technische Temperaturmessungen im Labor-, Prüfstands- und Entwicklungsumfeld zusammen.

---

## Ziel einer Temperaturmessung

Vor jeder Messung sollte klar definiert werden, welche Temperatur tatsächlich relevant ist.

Typische Fragestellungen sind:

- Welche Temperatur hat ein Bauteil an einer kritischen Stelle?
- Welche maximale Temperatur tritt während einer Belastungsprüfung auf?
- Wie groß ist die Temperaturdifferenz zwischen zwei Messpunkten?
- Wie schnell steigt oder fällt die Temperatur?
- Wird ein Grenzwert sicher eingehalten?
- Wie groß ist der Abstand zum Grenzwert unter Berücksichtigung der Messunsicherheit?

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
| **Drift** | Langsame Änderung der Messeigenschaften über Zeit, Temperatur oder Belastung. |

:::important
Eine hohe Anzeigeauflösung bedeutet nicht automatisch eine hohe Messgenauigkeit. Ein Gerät kann z. B. 0,01 °C anzeigen, obwohl die reale Messunsicherheit deutlich größer ist.
:::

---

## Grundformeln der Temperaturauswertung

### Temperaturdifferenz

```text
ΔT = T1 - T2
```

oder als Betrag:

```text
|ΔT| = |T1 - T2|
```

Anwendung:

- Vergleich zweier Messpunkte
- Erkennung asymmetrischer Erwärmung
- Vergleich DC+ zu DC-
- Vergleich Eingang zu Ausgang
- Vergleich Bauteil zu Umgebung

---

### Temperaturerhöhung gegenüber Umgebung

```text
ΔT_amb = T_Bauteil - T_Umgebung
```

Diese Größe ist wichtig, wenn Grenzwerte als Temperaturerhöhung über Umgebung definiert sind.

Beispiel:

```text
T_Bauteil  = 82 °C
T_Umgebung = 24 °C

ΔT_amb = 82 °C - 24 °C = 58 K
```

Hinweis: Temperaturdifferenzen werden in Kelvin angegeben. Ein Unterschied von 1 K entspricht einem Unterschied von 1 °C.

---

### Maximalwert

```text
T_max = max(T1, T2, T3, ..., Tn)
```

Typische Anwendung:

- heißeste Messstelle bestimmen
- kritischsten Zeitpunkt bestimmen
- Grenzwertverletzung erkennen

---

### Minimalwert

```text
T_min = min(T1, T2, T3, ..., Tn)
```

---

### Mittelwert

```text
T_mean = (T1 + T2 + ... + Tn) / n
```

Der Mittelwert ist sinnvoll für stabile Zustände, aber weniger geeignet, wenn kurze Temperaturspitzen kritisch sind.

---

### Gleitender Mittelwert

```text
T_smooth[i] = (T[i-k] + ... + T[i] + ... + T[i+k]) / (2k + 1)
```

Der gleitende Mittelwert reduziert Rauschen, kann aber kurze Temperaturspitzen glätten oder verschleiern.

---

### Temperaturanstieg pro Zeit

```text
dT/dt ≈ (T2 - T1) / (t2 - t1)
```

Beispiel:

```text
T1 = 35 °C bei t1 = 10 min
T2 = 65 °C bei t2 = 15 min

dT/dt = (65 °C - 35 °C) / (15 min - 10 min)
dT/dt = 30 K / 5 min
dT/dt = 6 K/min
```

Anwendung:

- Bewertung der Erwärmungsgeschwindigkeit
- Früherkennung kritischer Trends
- Vergleich mehrerer Lastzyklen
- Detektion ungewöhnlicher Übergangswiderstände

---

### Grenzwertabstand

```text
Abstand = T_Grenze - T_gemessen
```

Beispiel:

```text
T_Grenze   = 90 °C
T_gemessen = 88 °C

Abstand = 90 °C - 88 °C = 2 K
```

Wenn die Messunsicherheit größer als der Abstand zum Grenzwert ist, ist die Bewertung kritisch.

---

### Sicherheitsbewertung mit Messunsicherheit

```text
T_obere_Grenze = T_gemessen + U
T_untere_Grenze = T_gemessen - U
```

Dabei ist `U` die erweiterte Messunsicherheit.

Beispiel:

```text
T_gemessen = 88 °C
U = 3 K

T_obere_Grenze = 88 °C + 3 K = 91 °C
T_untere_Grenze = 88 °C - 3 K = 85 °C
```

Bewertung:

```text
Wenn T_obere_Grenze > T_Grenze:
    Grenzwert kann unter Berücksichtigung der Messunsicherheit überschritten sein.
```

---

## Formeln zur Messunsicherheit

### Einzelabweichung

```text
e = T_gemessen - T_Referenz
```

Beispiel:

```text
T_gemessen = 50,8 °C
T_Referenz = 50,0 °C

e = 50,8 °C - 50,0 °C = 0,8 K
```

---

### Standardabweichung einer Messreihe

```text
s = sqrt( Σ(T_i - T_mean)^2 / (n - 1) )
```

Anwendung:

- Streuung einer Messreihe bewerten
- Wiederholbarkeit abschätzen
- Rauschen eines Messkanals bewerten

---

### Standardunsicherheit des Mittelwertes

```text
u_mean = s / sqrt(n)
```

Je mehr unabhängige Messwerte vorhanden sind, desto kleiner wird die Unsicherheit des Mittelwertes. Das gilt jedoch nicht automatisch für systematische Fehler wie falsche Kalibrierung oder schlechte Sensorbefestigung.

---

### Rechteckverteilung für Herstellerangaben

Wenn eine Herstellerangabe z. B. als ±a angegeben ist und keine weitere Verteilung bekannt ist, wird häufig eine Rechteckverteilung angenommen.

```text
u = a / sqrt(3)
```

Beispiel:

```text
Herstellerangabe: ±1,5 K

a = 1,5 K
u = 1,5 K / sqrt(3)
u ≈ 0,87 K
```

---

### Kombinierte Standardunsicherheit

Unabhängige Unsicherheitsbeiträge werden häufig quadratisch kombiniert.

```text
u_c = sqrt(u1² + u2² + u3² + ... + un²)
```

Beispiel:

```text
u_sensor      = 0,6 K
u_logger      = 0,4 K
u_resolution  = 0,1 K
u_mounting    = 1,5 K

u_c = sqrt(0,6² + 0,4² + 0,1² + 1,5²)
u_c = sqrt(0,36 + 0,16 + 0,01 + 2,25)
u_c = sqrt(2,78)
u_c ≈ 1,67 K
```

---

### Erweiterte Messunsicherheit

```text
U = k · u_c
```

Häufig wird für technische Bewertungen näherungsweise `k = 2` verwendet.

```text
U = 2 · 1,67 K = 3,34 K
```

Interpretation:

```text
T = T_gemessen ± U
T = 88,0 °C ± 3,34 K
```

---

### Unsicherheit einer Temperaturdifferenz

Wenn zwei Temperaturen voneinander abgezogen werden, addieren sich die Unsicherheiten nicht direkt linear, sondern bei unabhängigen Beiträgen quadratisch.

```text
u_ΔT = sqrt(u_T1² + u_T2²)
```

Beispiel:

```text
u_T1 = 1,0 K
u_T2 = 1,0 K

u_ΔT = sqrt(1,0² + 1,0²)
u_ΔT = 1,41 K
```

---

## Sensortypen und wichtige Formeln

### Thermoelemente

Thermoelemente erzeugen eine temperaturabhängige Thermospannung. Stark vereinfacht gilt in einem kleinen Temperaturbereich:

```text
U_TC ≈ S · ΔT
```

| Symbol | Bedeutung |
| --- | --- |
| `U_TC` | Thermospannung |
| `S` | Seebeck-Koeffizient |
| `ΔT` | Temperaturdifferenz zwischen Messstelle und Vergleichsstelle |

In der Praxis wird die Kennlinie nicht einfach linear berechnet, sondern im Messgerät hinterlegt. Zusätzlich ist eine Vergleichsstellenkompensation erforderlich.

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

---

### Widerstandsthermometer, z. B. Pt100 oder Pt1000

Für einen begrenzten Bereich kann der Widerstand näherungsweise linear beschrieben werden:

```text
R(T) = R0 · (1 + α · T)
```

Für Pt100 gilt näherungsweise:

```text
R0 = 100 Ω bei 0 °C
α ≈ 0,00385 1/K
```

Beispiel:

```text
T = 100 °C
R(T) = 100 Ω · (1 + 0,00385 · 100)
R(T) = 138,5 Ω
```

Für genauere Berechnungen wird die Callendar-van-Dusen-Gleichung verwendet.

```text
R(T) = R0 · (1 + A·T + B·T²)
```

Für Temperaturen unter 0 °C wird zusätzlich ein weiterer Term verwendet.

```text
R(T) = R0 · (1 + A·T + B·T² + C·(T - 100)·T³)
```

**Vorteile:**

- gute Genauigkeit
- gute Langzeitstabilität
- gut geeignet für Referenz- und Prozessmessungen

**Nachteile:**

- meist langsamer als kleine Thermoelemente
- Eigenerwärmung durch Messstrom möglich
- Leitungswiderstände müssen berücksichtigt werden
- mechanisch oft größer als Thermoelemente

---

### Einfluss des Leitungswiderstands bei 2-Leiter-Pt100

Bei einer 2-Leiter-Messung wird der Leitungswiderstand mitgemessen.

```text
R_gemessen = R_sensor + R_leitung_hin + R_leitung_zurück
```

Der dadurch entstehende Temperaturfehler ist näherungsweise:

```text
ΔT_fehler ≈ R_leitung_gesamt / (R0 · α)
```

Beispiel für Pt100:

```text
R_leitung_gesamt = 1 Ω
R0 = 100 Ω
α = 0,00385 1/K

ΔT_fehler ≈ 1 Ω / (100 Ω · 0,00385 1/K)
ΔT_fehler ≈ 2,6 K
```

Das zeigt, warum 3-Leiter- oder 4-Leiter-Schaltungen in der Praxis wichtig sind.

---

### Eigenerwärmung bei Widerstandssensoren

Durch den Messstrom entsteht Verlustleistung im Sensor.

```text
P = I² · R
```

Die daraus resultierende Eigenerwärmung kann näherungsweise beschrieben werden als:

```text
ΔT_self = P · R_th
```

| Symbol | Bedeutung |
| --- | --- |
| `P` | elektrische Verlustleistung im Sensor |
| `I` | Messstrom |
| `R` | Sensorwiderstand |
| `R_th` | thermischer Widerstand zur Umgebung |

---

### Infrarot- und Wärmebildmessung

Bei berührungsloser Messung ist der Emissionsgrad entscheidend.

Vereinfachter Zusammenhang der Wärmestrahlung:

```text
P_rad = ε · σ · A · T⁴
```

| Symbol | Bedeutung |
| --- | --- |
| `ε` | Emissionsgrad |
| `σ` | Stefan-Boltzmann-Konstante |
| `A` | Fläche |
| `T` | absolute Temperatur in Kelvin |

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

### 5. Fehler durch Leitungen und Anschlussart

Bei Pt100- oder Pt1000-Sensoren kann der Leitungswiderstand das Messergebnis verfälschen. Deshalb ist die Anschlussart wichtig.

| Anschlussart | Bewertung |
| --- | --- |
| **2-Leiter** | Einfach, aber Leitungswiderstand geht direkt in den Messwert ein. |
| **3-Leiter** | Industrieller Standard, Leitungswiderstand wird teilweise kompensiert. |
| **4-Leiter** | Sehr genau, besonders für Referenzmessungen geeignet. |

Bei Thermoelementen müssen passende Thermoleitungen oder Ausgleichsleitungen verwendet werden. Falsche Leitungsmaterialien können zusätzliche Thermospannungen erzeugen.

---

## Beispiel: Messwert nahe am Grenzwert interpretieren

Angenommen, ein Messsystem zeigt an einem Leiteranschluss folgende Temperatur an:

```text
T_gemessen = 88 °C
T_Grenze   = 90 °C
U          = 3 K
```

Bewertung:

```text
T_obere_Grenze = T_gemessen + U
T_obere_Grenze = 88 °C + 3 K
T_obere_Grenze = 91 °C
```

Das bedeutet: Der Messwert liegt sehr nah am Grenzwert. Unter Berücksichtigung der Messunsicherheit kann der wahre Wert oberhalb des Grenzwerts liegen.

**Praktische Konsequenz:**

- Messstelle prüfen
- Sensorbefestigung kontrollieren
- Messung wiederholen
- zusätzliche Messpunkte setzen
- Sicherheitsabstand zum Grenzwert definieren
- Messunsicherheit im Prüfbericht angeben

---

## Python: Messdateien einlesen und auswerten

Die folgenden Beispiele sind bewusst einfach gehalten und eignen sich als Grundlage für Labor-Messdaten aus CSV- oder Excel-Dateien.

### Erwartetes CSV-Format

Beispiel für eine Messdatei:

```text
time_s,T_amb,T_L1,T_L2,T_L3
0,23.4,24.1,24.0,24.2
60,23.5,31.2,30.8,31.5
120,23.6,38.4,37.9,39.1
```

- `time_s`: Zeit in Sekunden
- `T_amb`: Umgebungstemperatur in °C
- `T_L1`, `T_L2`, `T_L3`: Temperaturkanäle in °C

---

### CSV-Datei einlesen

```python
from pathlib import Path

import pandas as pd

file_path = Path("messdaten.csv")

# CSV einlesen
# Falls deine Datei ein Semikolon nutzt, sep=";" verwenden.
df = pd.read_csv(file_path, sep=",")

# Zeitspalte prüfen
if "time_s" not in df.columns:
    raise ValueError("Die Spalte 'time_s' fehlt in der Messdatei.")

print(df.head())
print(df.info())
```

---

### Excel-Datei einlesen

```python
from pathlib import Path

import pandas as pd

file_path = Path("messdaten.xlsx")

# Erstes Tabellenblatt einlesen
df = pd.read_excel(file_path, sheet_name=0)

print(df.head())
print(df.columns)
```

---

### Temperaturkanäle automatisch erkennen

```python
# Alle Spalten, die mit "T_" beginnen, werden als Temperaturkanäle behandelt.
temp_cols = [col for col in df.columns if col.startswith("T_")]

# Umgebung optional aus der Kanalliste entfernen
measurement_cols = [col for col in temp_cols if col != "T_amb"]

print("Temperaturkanäle:", temp_cols)
print("Messkanäle ohne Umgebung:", measurement_cols)
```

---

### Maximaltemperaturen je Kanal berechnen

```python
summary = []

for col in measurement_cols:
    t_max = df[col].max()
    idx_max = df[col].idxmax()
    time_at_max_s = df.loc[idx_max, "time_s"]

    summary.append({
        "channel": col,
        "T_max_C": t_max,
        "time_at_max_s": time_at_max_s,
    })

summary_df = pd.DataFrame(summary)
print(summary_df)
```

---

### Temperaturerhöhung gegenüber Umgebung berechnen

Formel:

```text
ΔT_amb = T_Kanal - T_amb
```

Python:

```python
if "T_amb" not in df.columns:
    raise ValueError("Für diese Auswertung wird die Spalte 'T_amb' benötigt.")

for col in measurement_cols:
    df[f"dT_amb_{col}"] = df[col] - df["T_amb"]

print(df.filter(regex="dT_amb").head())
```

---

### Temperaturdifferenz zwischen zwei Kanälen berechnen

Formel:

```text
ΔT = T_L1 - T_L2
```

Python:

```python
df["dT_L1_L2"] = df["T_L1"] - df["T_L2"]
df["abs_dT_L1_L2"] = df["dT_L1_L2"].abs()

print(df[["time_s", "T_L1", "T_L2", "dT_L1_L2", "abs_dT_L1_L2"]].head())
```

---

### Temperaturanstieg pro Minute berechnen

Formel:

```text
dT/dt ≈ ΔT / Δt
```

Python:

```python
# Zeitdifferenz in Minuten
dt_min = df["time_s"].diff() / 60

for col in measurement_cols:
    df[f"gradient_K_per_min_{col}"] = df[col].diff() / dt_min

print(df.filter(regex="gradient").head())
```

---

### Grenzwertverletzungen erkennen

```python
limit_c = 90.0

violations = []

for col in measurement_cols:
    mask = df[col] > limit_c
    if mask.any():
        first_idx = mask.idxmax()
        violations.append({
            "channel": col,
            "limit_C": limit_c,
            "first_time_s": df.loc[first_idx, "time_s"],
            "max_C": df[col].max(),
        })

violations_df = pd.DataFrame(violations)

if violations_df.empty:
    print("Keine Grenzwertverletzung gefunden.")
else:
    print(violations_df)
```

---

### Bewertung mit Messunsicherheit

Formel:

```text
T_upper = T_measured + U
```

Python:

```python
limit_c = 90.0
expanded_uncertainty_k = 3.0

risk_rows = []

for col in measurement_cols:
    upper_col = f"T_upper_{col}"
    df[upper_col] = df[col] + expanded_uncertainty_k

    mask = df[upper_col] > limit_c
    if mask.any():
        first_idx = mask.idxmax()
        risk_rows.append({
            "channel": col,
            "limit_C": limit_c,
            "U_K": expanded_uncertainty_k,
            "first_risk_time_s": df.loc[first_idx, "time_s"],
            "max_measured_C": df[col].max(),
            "max_upper_C": df[upper_col].max(),
        })

risk_df = pd.DataFrame(risk_rows)

if risk_df.empty:
    print("Auch mit Messunsicherheit keine kritische Grenzwertnähe erkannt.")
else:
    print(risk_df)
```

---

### Kombinierte Messunsicherheit berechnen

Formel:

```text
u_c = sqrt(u1² + u2² + ... + un²)
U = k · u_c
```

Python:

```python
import math

uncertainty_budget = {
    "sensor_K": 0.6,
    "logger_K": 0.4,
    "resolution_K": 0.1,
    "mounting_K": 1.5,
}

u_c = math.sqrt(sum(value ** 2 for value in uncertainty_budget.values()))
k = 2
U = k * u_c

print(f"Kombinierte Standardunsicherheit u_c = {u_c:.2f} K")
print(f"Erweiterte Messunsicherheit U = {U:.2f} K")
```

---

### Messdaten glätten

```python
window = 5  # Anzahl Messpunkte

for col in measurement_cols:
    df[f"smooth_{col}"] = df[col].rolling(window=window, center=True).mean()

print(df.filter(regex="smooth").head(10))
```

Hinweis: Glättung kann kurze Temperaturspitzen reduzieren oder vollständig verschleiern. Rohdaten sollten deshalb immer erhalten bleiben.

---

### Diagramm erstellen

```python
import matplotlib.pyplot as plt

limit_c = 90.0

for col in measurement_cols:
    plt.figure()
    plt.plot(df["time_s"] / 60, df[col], label=col)
    plt.axhline(limit_c, linestyle="--", label=f"Grenzwert {limit_c} °C")
    plt.xlabel("Zeit in min")
    plt.ylabel("Temperatur in °C")
    plt.title(f"Temperaturverlauf {col}")
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()
```

---

### Ergebnisbericht als CSV exportieren

```python
summary_df.to_csv("temperatur_summary.csv", index=False, sep=";")

if not violations_df.empty:
    violations_df.to_csv("temperatur_grenzwertverletzungen.csv", index=False, sep=";")

if not risk_df.empty:
    risk_df.to_csv("temperatur_risikobewertung_mit_messunsicherheit.csv", index=False, sep=";")
```

---

### Mehrere Messdateien automatisch auswerten

```python
from pathlib import Path

import pandas as pd

input_folder = Path("messdaten")
output_folder = Path("auswertung")
output_folder.mkdir(exist_ok=True)

limit_c = 90.0
expanded_uncertainty_k = 3.0
all_results = []

for file_path in input_folder.glob("*.csv"):
    df = pd.read_csv(file_path, sep=",")

    if "time_s" not in df.columns:
        print(f"Übersprungen, weil time_s fehlt: {file_path.name}")
        continue

    temp_cols = [col for col in df.columns if col.startswith("T_")]
    measurement_cols = [col for col in temp_cols if col != "T_amb"]

    for col in measurement_cols:
        t_max = df[col].max()
        idx_max = df[col].idxmax()
        time_at_max_s = df.loc[idx_max, "time_s"]
        t_upper = t_max + expanded_uncertainty_k

        all_results.append({
            "file": file_path.name,
            "channel": col,
            "T_max_C": t_max,
            "time_at_max_s": time_at_max_s,
            "T_upper_C": t_upper,
            "limit_C": limit_c,
            "limit_exceeded": t_max > limit_c,
            "risk_with_uncertainty": t_upper > limit_c,
        })

results_df = pd.DataFrame(all_results)
results_df.to_csv(output_folder / "gesamtbewertung_temperatur.csv", index=False, sep=";")

print(results_df)
```

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
