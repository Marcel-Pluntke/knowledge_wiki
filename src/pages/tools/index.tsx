import {useMemo, useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

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

    const currentAtLimit = iMeasured * Math.sqrt(deltaLimit / deltaMeasured);
    const changePercent = ((currentAtLimit / iMeasured) - 1) * 100;

    return {deltaMeasured, deltaLimit, currentAtLimit, changePercent} as const;
  }, [measuredTemp, ambientTemp, limitTemp, measuredCurrent]);

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.kicker}>Rechner 1</span>
        <Heading as="h2">Strom am Temperaturgrenzwert</Heading>
        <p>
          Ermittelt aus einem stabilen Messergebnis den Strom, bei dem der eingegebene Temperaturgrenzwert
          rechnerisch erreicht wird.
        </p>
      </div>

      <div className={styles.fields}>
        <NumberField id="current-measured-temp" label="Gemessene Temperatur" value={measuredTemp} onChange={setMeasuredTemp} unit="°C" placeholder="z. B. 92" />
        <NumberField id="current-ambient-temp" label="Umgebungstemperatur (Standard 35 °C)" value={ambientTemp} onChange={setAmbientTemp} unit="°C" />
        <NumberField id="current-limit-temp" label="Grenztemperatur der Messstelle" value={limitTemp} onChange={setLimitTemp} unit="°C" placeholder="z. B. 105" />
        <NumberField id="current-measured-current" label="Gemessener Strom" value={measuredCurrent} onChange={setMeasuredCurrent} unit="A" placeholder="z. B. 5900" />
      </div>

      <div className={styles.formula}>I₂ = I₁ · √(ΔT₂ / ΔT₁)</div>

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

    const deltaTarget = deltaMeasured * Math.pow(iTarget / iMeasured, 2);
    const targetTemp = tAmbient + deltaTarget;
    const limit = Number.isFinite(tLimit) ? tLimit : null;
    const margin = limit === null ? null : limit - targetTemp;

    return {deltaMeasured, deltaTarget, targetTemp, margin} as const;
  }, [measuredTemp, ambientTemp, measuredCurrent, targetCurrent, limitTemp]);

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.kicker}>Rechner 2</span>
        <Heading as="h2">Temperatur bei gewünschtem Strom</Heading>
        <p>
          Rechnet ein vorhandenes Messergebnis auf einen anderen Strom hoch oder herunter – zum Beispiel von
          5.900 A auf 6.000 A.
        </p>
      </div>

      <div className={styles.fields}>
        <NumberField id="temp-measured-temp" label="Gemessene Temperatur" value={measuredTemp} onChange={setMeasuredTemp} unit="°C" placeholder="z. B. 92" />
        <NumberField id="temp-ambient-temp" label="Umgebungstemperatur (Standard 35 °C)" value={ambientTemp} onChange={setAmbientTemp} unit="°C" />
        <NumberField id="temp-measured-current" label="Gemessener Strom" value={measuredCurrent} onChange={setMeasuredCurrent} unit="A" />
        <NumberField id="temp-target-current" label="Gewünschter Strom" value={targetCurrent} onChange={setTargetCurrent} unit="A" />
        <NumberField id="temp-limit-temp" label="Grenztemperatur (optional)" value={limitTemp} onChange={setLimitTemp} unit="°C" placeholder="z. B. 105" />
      </div>

      <div className={styles.formula}>ΔT₂ = ΔT₁ · (I₂ / I₁)²</div>

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
            <strong>Grundlage:</strong> IEC 61439-1:2020, Abschnitt 9.2 (insbesondere 9.2.2). Die Erwärmung ΔT ist
            die Differenz zwischen Messstellentemperatur und Umgebungstemperatur. Die Umrechnung setzt voraus,
            dass die Verlustleistung der betrachteten Leiter/Geräte im Wesentlichen proportional zu I² ist. Der
            nach oben berechnete Strom darf außerdem keine Bemessungsgrenze eines beteiligten Geräts überschreiten.
          </div>

          <div className={styles.grid}>
            <CurrentAtLimitCalculator />
            <TemperatureAtCurrentCalculator />
          </div>

          <section className={styles.explanation}>
            <Heading as="h2">So wird gerechnet</Heading>
            <p>
              Aus der IEC-Annahme <strong>ΔT ∝ Verlustleistung</strong> und für ohmsch dominierte Verluste
              <strong> P ∝ I²</strong> ergibt sich <strong>ΔT ∝ I²</strong>. Deshalb wird immer mit der
              Temperaturerhöhung gegenüber der Umgebung gerechnet – nicht mit der absoluten Temperatur allein.
            </p>
            <p className={styles.smallPrint}>
              Der zweite Rechner ist die mathematische Umkehrung derselben Beziehung und dient als Näherung für
              vergleichbare Betriebsbedingungen. Änderungen an Kühlung, Kontaktwiderständen, Material, Einbau,
              Frequenz oder Verlustmechanismen können die reale Temperatur verändern.
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}
