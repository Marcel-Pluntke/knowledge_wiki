import {useMemo, useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

const IEC_EXPONENT = 0.61;

function parseNumber(value: string): number {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return Number.NaN;
  return Number(normalized);
}

function formatNumber(value: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat('de-DE', {
    maximumFractionDigits,
  }).format(value);
}

function NumberField({
  id,
  label,
  value,
  onChange,
  unit,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit: string;
  placeholder?: string;
}) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <span className={styles.inputWrap}>
        <input
          id={id}
          className={styles.input}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className={styles.unit}>{unit}</span>
      </span>
    </label>
  );
}

function CurrentAtLimitCalculator() {
  const [measuredTemp, setMeasuredTemp] = useState('');
  const [ambientTemp, setAmbientTemp] = useState('35');
  const [limitTemp, setLimitTemp] = useState('');
  const [measuredCurrent, setMeasuredCurrent] = useState('');

  const result = useMemo(() => {
    const tMeasured = parseNumber(measuredTemp);
    const tAmbient = parseNumber(ambientTemp);
    const tLimit = parseNumber(limitTemp);
    const iMeasured = parseNumber(measuredCurrent);

    if (![tMeasured, tAmbient, tLimit, iMeasured].every(Number.isFinite)) return null;

    const deltaMeasured = tMeasured - tAmbient;
    const deltaLimit = tLimit - tAmbient;

    if (deltaMeasured <= 0 || deltaLimit <= 0 || iMeasured <= 0) {
      return {error: 'Temperaturen müssen über der Umgebung liegen und der Strom muss größer als 0 A sein.'} as const;
    }

    const currentAtLimit = iMeasured * Math.pow(deltaLimit / deltaMeasured, IEC_EXPONENT);
    const changePercent = ((currentAtLimit / iMeasured) - 1) * 100;
    const deltaDifference = Math.abs(deltaLimit - deltaMeasured);
    const withinIecRange = deltaDifference <= 5;

    return {
      deltaMeasured,
      deltaLimit,
      currentAtLimit,
      changePercent,
      deltaDifference,
      withinIecRange,
    } as const;
  }, [measuredTemp, ambientTemp, limitTemp, measuredCurrent]);

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.kicker}>Rechner 1 · IEC-Korrektur</span>
        <Heading as="h2">Strom am Temperaturgrenzwert</Heading>
        <p>
          Ermittelt aus einem Prüfergebnis den Strom, bei dem die maximal zulässige Erwärmung rechnerisch
          erreicht wird.
        </p>
      </div>

      <div className={styles.fields}>
        <NumberField id="current-measured-temp" label="Gemessene Temperatur" value={measuredTemp} onChange={setMeasuredTemp} unit="°C" placeholder="z. B. 92" />
        <NumberField id="current-ambient-temp" label="Umgebungstemperatur (Istwert; 35 °C vorbelegt)" value={ambientTemp} onChange={setAmbientTemp} unit="°C" />
        <NumberField id="current-limit-temp" label="Grenztemperatur der Messstelle" value={limitTemp} onChange={setLimitTemp} unit="°C" placeholder="z. B. 95" />
        <NumberField id="current-measured-current" label="Gemessener Prüfstrom" value={measuredCurrent} onChange={setMeasuredCurrent} unit="A" placeholder="z. B. 5900" />
      </div>

      <div className={styles.formula}>I_Grenz = I_Mess · (ΔT_Grenz / ΔT_Mess)^0,61</div>

      <div className={styles.resultBox} aria-live="polite">
        {!result && <span className={styles.resultHint}>Werte eingeben – das Ergebnis erscheint sofort.</span>}
        {result && 'error' in result && <span className={styles.error}>{result.error}</span>}
        {result && !('error' in result) && (
          <>
            <span className={styles.resultLabel}>Rechnerischer Strom am Grenzwert</span>
            <strong className={styles.resultValue}>{formatNumber(result.currentAtLimit, 0)} A</strong>
            <span className={styles.resultMeta}>
              ΔT Messung: {formatNumber(result.deltaMeasured)} K · ΔT Grenzwert: {formatNumber(result.deltaLimit)} K · Änderung: {result.changePercent >= 0 ? '+' : ''}{formatNumber(result.changePercent, 2)} %
            </span>
            <span className={result.withinIecRange ? styles.okNote : styles.warning}>
              {result.withinIecRange
                ? `IEC-Bedingung erfüllt: Abweichung der Erwärmung ${formatNumber(result.deltaDifference)} K (≤ 5 K).`
                : `IEC-Bedingung nicht erfüllt: Abweichung der Erwärmung ${formatNumber(result.deltaDifference)} K (> 5 K). Ergebnis nur als Orientierung verwenden.`}
            </span>
          </>
        )}
      </div>
    </section>
  );
}

function TemperatureAtCurrentCalculator() {
  const [measuredTemp, setMeasuredTemp] = useState('');
  const [ambientTemp, setAmbientTemp] = useState('35');
  const [measuredCurrent, setMeasuredCurrent] = useState('5900');
  const [targetCurrent, setTargetCurrent] = useState('6000');
  const [limitTemp, setLimitTemp] = useState('');

  const result = useMemo(() => {
    const tMeasured = parseNumber(measuredTemp);
    const tAmbient = parseNumber(ambientTemp);
    const iMeasured = parseNumber(measuredCurrent);
    const iTarget = parseNumber(targetCurrent);
    const tLimit = parseNumber(limitTemp);

    if (![tMeasured, tAmbient, iMeasured, iTarget].every(Number.isFinite)) return null;

    const deltaMeasured = tMeasured - tAmbient;
    if (deltaMeasured <= 0 || iMeasured <= 0 || iTarget <= 0) {
      return {error: 'Die gemessene Temperatur muss über der Umgebung liegen; beide Ströme müssen größer als 0 A sein.'} as const;
    }

    const deltaTarget = deltaMeasured * Math.pow(iTarget / iMeasured, 1 / IEC_EXPONENT);
    const targetTemp = tAmbient + deltaTarget;
    const limit = Number.isFinite(tLimit) ? tLimit : null;
    const margin = limit === null ? null : limit - targetTemp;

    return {deltaMeasured, deltaTarget, targetTemp, margin} as const;
  }, [measuredTemp, ambientTemp, measuredCurrent, targetCurrent, limitTemp]);

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.kicker}>Rechner 2 · Näherung</span>
        <Heading as="h2">Temperatur bei gewünschtem Strom</Heading>
        <p>
          Kehrt dieselbe Kennlinie mathematisch um und schätzt die Temperatur für einen anderen Strom – zum
          Beispiel von 5.900 A auf 6.000 A.
        </p>
      </div>

      <div className={styles.fields}>
        <NumberField id="temp-measured-temp" label="Gemessene Temperatur" value={measuredTemp} onChange={setMeasuredTemp} unit="°C" placeholder="z. B. 92" />
        <NumberField id="temp-ambient-temp" label="Umgebungstemperatur (Istwert; 35 °C vorbelegt)" value={ambientTemp} onChange={setAmbientTemp} unit="°C" />
        <NumberField id="temp-measured-current" label="Gemessener Strom" value={measuredCurrent} onChange={setMeasuredCurrent} unit="A" />
        <NumberField id="temp-target-current" label="Gewünschter Strom" value={targetCurrent} onChange={setTargetCurrent} unit="A" />
        <NumberField id="temp-limit-temp" label="Grenztemperatur (optional)" value={limitTemp} onChange={setLimitTemp} unit="°C" placeholder="z. B. 105" />
      </div>

      <div className={styles.formula}>ΔT_Ziel = ΔT_Mess · (I_Ziel / I_Mess)^(1 / 0,61)</div>

      <div className={styles.resultBox} aria-live="polite">
        {!result && <span className={styles.resultHint}>Gemessene Temperatur eingeben – das Ergebnis erscheint sofort.</span>}
        {result && 'error' in result && <span className={styles.error}>{result.error}</span>}
        {result && !('error' in result) && (
          <>
            <span className={styles.resultLabel}>Geschätzte Temperatur beim Zielstrom</span>
            <strong className={styles.resultValue}>{formatNumber(result.targetTemp)} °C</strong>
            <span className={styles.resultMeta}>
              ΔT: {formatNumber(result.deltaMeasured)} K → {formatNumber(result.deltaTarget)} K
              {result.margin !== null && <> · Reserve zum Grenzwert: <span className={result.margin >= 0 ? styles.ok : styles.over}>{formatNumber(result.margin)} K</span></>}
            </span>
            <span className={styles.warningSoft}>Näherungswert aus der umgestellten IEC-Kennlinie; kein eigenständiger normativer Nachweis.</span>
          </>
        )}
      </div>
    </section>
  );
}

export default function ToolsPage(): ReactNode {
  return (
    <Layout
      title="Tools"
      description="Praktische Engineering-Rechner für das Knowledge Wiki.">
      <main className={styles.page}>
        <div className="container">
          <header className={styles.hero}>
            <span className={styles.eyebrow}>Knowledge Wiki · Tools</span>
            <Heading as="h1">IEC 61439 Erwärmungs-Umrechner</Heading>
            <p>
              Zwei schnelle Rechner für Erwärmungsprüfungen: Grenzstrom aus einem Messergebnis bestimmen oder
              die zu erwartende Temperatur bei einem anderen Strom abschätzen.
            </p>
          </header>

          <div className={styles.notice}>
            <strong>Grundlage für Rechner 1:</strong> IEC 61439-1:2020, 10.10.2.3.1. Für die Korrektur eines
            Prüfergebnisses wird die empirische Beziehung mit dem Exponenten 0,61 verwendet. Die gemessene
            Erwärmung darf dabei höchstens ±5 K von der maximal zulässigen Erwärmung abweichen. ΔT ist die
            Temperaturerhöhung der Messstelle gegenüber der Umgebung.
          </div>

          <div className={styles.grid}>
            <CurrentAtLimitCalculator />
            <TemperatureAtCurrentCalculator />
          </div>

          <section className={styles.explanation}>
            <Heading as="h2">So wird gerechnet</Heading>
            <p>
              Rechner 1 verwendet <strong>I_Grenz / I_Mess = (ΔT_Grenz / ΔT_Mess)^0,61</strong>. Rechner 2 stellt
              dieselbe Beziehung nach der Erwärmung um: <strong>ΔT_Ziel = ΔT_Mess · (I_Ziel / I_Mess)^(1/0,61)</strong>.
              Aus der berechneten Erwärmung wird mit der eingegebenen Umgebungstemperatur wieder die absolute
              Temperatur bestimmt.
            </p>
            <p className={styles.smallPrint}>
              Die Umrechnung ist für vergleichbare Betriebs- und Kühlbedingungen gedacht. Geräte mit wesentlich
              festen oder linear vom Strom abhängigen Verlusten sowie Änderungen an Kühlung, Kontaktwiderständen,
              Material, Einbau oder Frequenz können das reale Verhalten verändern. Ein berechneter Strom darf
              außerdem keine Bemessungsgrenze eines beteiligten Geräts überschreiten.
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}
