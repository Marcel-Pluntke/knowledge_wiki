import {createElement, useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import {calculateWindingTemperature, COPPER_CONSTANT, parseDecimal} from '../../components/WindingTemperature/engine.mjs';
import styles from './styles.module.css';

const article = '/docs/obsidian/Stromwandler-pruefen-IEC-61439-1#5-erwärmungsmessung-über-den-wicklungswiderstand-resistance-method';
const format = (value: number) => new Intl.NumberFormat('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(value);
const m = (tag: string, ...children: ReactNode[]) => createElement(tag, null, ...children);
const sub = (symbol: string, index: string) => m('msub', m('mi', symbol), m('mtext', index));
const op = (value: string) => m('mo', value);

function Equation({rise = false}: {rise?: boolean}) {
  const theta = (index: string) => sub('ϑ', index);
  const equation = rise
    ? m('mrow', m('mi', 'Δ'), theta('W'), op('='), theta('w'), op('−'), theta('a'))
    : m('mrow', theta('w'), op('='), m('mfrac', sub('R', 'w'), sub('R', 'k')), op('·'),
        op('('), m('mi', 'K'), op('+'), theta('k'), op(')'), op('−'), m('mi', 'K'));
  return <div className={styles.formula}>{createElement('math', {xmlns: 'http://www.w3.org/1998/Math/MathML', display: 'block'}, equation)}</div>;
}

function Field({id, label, unit, value, setValue, placeholder, help}: {
  id: string; label: string; unit: string; value: string; setValue: (value: string) => void; placeholder?: string; help?: string;
}) {
  return <label className={styles.field} htmlFor={id}>
    <span className={styles.label}>{label}</span>
    <span className={styles.inputWrap}>
      <input id={id} className={styles.input} value={value} onChange={e => setValue(e.target.value)}
        type="text" inputMode="decimal" autoComplete="off" placeholder={placeholder} aria-describedby={help ? id + '-help' : undefined}/>
      <span className={styles.unit}>{unit}</span>
    </span>
    {help && <small id={id + '-help'} className={styles.smallPrint}>{help}</small>}
  </label>;
}

export default function WindingTemperaturePage(): ReactNode {
  const [coldR, setColdR] = useState('');
  const [warmR, setWarmR] = useState('');
  const [coldT, setColdT] = useState('');
  const [ambient, setAmbient] = useState('');
  const [unit, setUnit] = useState('Ω');
  const [material, setMaterial] = useState('copper');
  const [custom, setCustom] = useState('234,5');
  const constant = material === 'copper' ? COPPER_CONSTANT : material === 'aluminium' ? 225 : parseDecimal(custom);
  const ready = [coldR, warmR, coldT].every(v => v.trim() !== '') && (material !== 'custom' || custom.trim() !== '');
  const result = ready ? calculateWindingTemperature({
    coldResistance: parseDecimal(coldR), warmResistance: parseDecimal(warmR), coldTemperature: parseDecimal(coldT),
    constant, ambientEnd: ambient.trim() === '' ? null : parseDecimal(ambient),
  }) : null;
  function reset() {setColdR(''); setWarmR(''); setColdT(''); setAmbient(''); setUnit('Ω'); setMaterial('copper'); setCustom('234,5');}
  function example() {setColdR('0,500'); setWarmR('0,650'); setColdT('20'); setAmbient('35'); setUnit('Ω'); setMaterial('copper');}
  function changeUnit(next: string) {
    if (next === unit) return;
    const factor = next === 'mΩ' ? 1000 : .001;
    const convert = (v: string) => Number.isFinite(parseDecimal(v)) ? String(Number((parseDecimal(v) * factor).toPrecision(12))).replace('.', ',') : v;
    setColdR(convert(coldR)); setWarmR(convert(warmR)); setUnit(next);
  }
  return <Layout title="Wicklungstemperatur-Rechner" description="Mittlere Wicklungstemperatur aus Kalt- und Warmwiderstand bestimmen.">
    <main className={styles.page}><div className="container">
      <Link to="/tools">Alle Tools</Link>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Knowledge Wiki · Engineering</span>
        <Heading as="h1">Wicklungstemperatur-Rechner</Heading>
        <p>Mittlere Wicklungstemperatur nach einer Erwärmungsprüfung aus drei Messwerten bestimmen.</p>
      </header>
      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}><Heading as="h2">Messwerte</Heading><p>Gleiche Wicklung bzw. Anzapfung und gleiche Widerstandseinheit verwenden.</p></div>
          <div className={styles.fields}>
            <label className={styles.field}><span className={styles.label}>Widerstandseinheit</span>
              <select className={styles.toolSelect} value={unit} onChange={e => changeUnit(e.target.value)}><option>Ω</option><option>mΩ</option></select>
            </label>
            <Field id="winding-cold-t" label="Umgebungstemperatur vor der Prüfung" unit="°C" value={coldT} setValue={setColdT} placeholder="z. B. 20" help="Bei thermischem Gleichgewicht entspricht sie der Kaltwicklungstemperatur."/>
            <Field id="winding-cold-r" label="Kaltwiderstand der Wicklung" unit={unit} value={coldR} setValue={setColdR} placeholder={unit === 'Ω' ? 'z. B. 0,500' : 'z. B. 500'}/>
            <Field id="winding-warm-r" label="Warmwiderstand der Wicklung" unit={unit} value={warmR} setValue={setWarmR} placeholder={unit === 'Ω' ? 'z. B. 0,650' : 'z. B. 650'} help="Widerstand am Abschaltzeitpunkt; falls erforderlich rückextrapoliert."/>
            <label className={styles.field}><span className={styles.label}>Wicklungsmaterial</span>
              <select className={styles.toolSelect} value={material} onChange={e => setMaterial(e.target.value)}>
                <option value="copper">Kupfer – 234,5 °C</option><option value="aluminium">Aluminium – 225 °C</option><option value="custom">Eigene Materialkonstante</option>
              </select>
            </label>
            {material === 'custom' && <Field id="winding-constant" label="Materialkonstante K" unit="°C" value={custom} setValue={setCustom}/>}
            <Field id="winding-ambient-end" label="Umgebungstemperatur am Prüfende (optional)" unit="°C" value={ambient} setValue={setAmbient} placeholder="z. B. 35" help="Nur für die Temperaturerhöhung gegenüber der Umgebung erforderlich."/>
          </div>
          <div className={styles.toolActions}><button type="button" className="button button--secondary" onClick={example}>Beispiel laden</button><button type="button" className="button button--outline button--secondary" onClick={reset}>Zurücksetzen</button></div>
        </section>
        <section className={styles.card}>
          <div className={styles.cardHeader}><Heading as="h2">Ergebnis</Heading><p>Berechnung in Echtzeit nach der Widerstandsänderungsmethode.</p></div>
          <div className={styles.resultBox} aria-live="polite">
            {!ready ? <span className={styles.resultHint}>Bitte die drei Messwerte eingeben.</span> : !result ? <span className={styles.error}>Ungültige Eingabe. Widerstände und Materialkonstante müssen positiv sein; Temperaturen müssen physikalisch plausibel sein.</span> : <>
              <span className={styles.resultLabel}>Mittlere Wicklungstemperatur</span>
              <strong className={styles.resultValue}>{format(result.warmTemperature)} °C</strong>
              <span className={styles.resultMeta}>Änderung gegenüber dem Kaltzustand: {format(result.changeFromCold)} K</span>
              {result.temperatureRise !== null && <><span className={styles.resultLabel}>Temperaturerhöhung gegenüber der Umgebung am Prüfende</span><strong className={styles.resultValue}>{format(result.temperatureRise)} K</strong></>}
              {parseDecimal(warmR) < parseDecimal(coldR) && <span className={styles.warning}>Warmwiderstand ist kleiner als Kaltwiderstand. Messwerte und Prüfbedingungen überprüfen.</span>}
            </>}
          </div>
          <Heading as="h3">Mathematisches Modell</Heading>
          <Equation/>
          <p className={styles.smallPrint}>K = {Number.isFinite(constant) ? format(constant) : '–'} °C · ϑk: Kaltwicklungstemperatur · Rk/Rw: Kalt-/Warmwiderstand.</p>
          <Equation rise/>
          <p className={styles.smallPrint}>ϑa: maßgebliche Umgebungstemperatur am Prüfende. Die Änderung gegenüber dem Kaltzustand ist nicht automatisch die Temperaturerhöhung im Sinne des Erwärmungsnachweises.</p>
        </section>
      </div>
      <section className={styles.explanation}>
        <Heading as="h2">Hinweise zur Messung</Heading>
        <p>Vor der Kaltmessung thermisches Gleichgewicht sicherstellen. Den Warmwiderstand möglichst zeitnah erfassen und bei Bedarf nach der anwendbaren Prüfvorschrift auf den Abschaltzeitpunkt zurückführen. Die Berechnung bestimmt eine mittlere Wicklungstemperatur, keinen lokalen Hotspot und keinen eigenständigen normativen Nachweis.</p>
        <p>Widerstandsmessung nur am sicher freigeschalteten Prüfling. Einen Stromwandler-Sekundärkreis niemals bei fließendem Primärstrom öffnen.</p>
        <Link to={article}>Zum Fachartikel: Erwärmungsmessung über den Wicklungswiderstand</Link>
      </section>
      <section className={styles.explanation}>
        <Heading as="h2">Quellen und Referenzen</Heading>
        <ul>
          <li><a href="https://www.saso.gov.sa/ar/Laws-And-Regulations/Technical_regulations/Documents/SASO-IEEE-C57-2018-E.pdf#page=63" target="_blank" rel="noopener noreferrer">IEEE C57.13-2016 – öffentlich zugängliche SASO IEEE C57:2018</a> · S. 61, Abschnitt 11.2.5, Gleichungen (26) und (27): mittlere Wicklungstemperatur, Kupferkonstante 234,5 und EC-Aluminium 225. Abschnitte 11.2.3–11.2.6 behandeln Messung, Abschaltkorrektur und Temperaturerhöhung.</li>
          <li>Hideki Garduno (2012), <a href="https://publications.lib.chalmers.se/records/fulltext/173228/173228.pdf#page=24" target="_blank" rel="noopener noreferrer">Temperature Rise Testing of Current Transformers: Improvement in Test Method</a>, Chalmers University of Technology, Masterarbeit, S. 14, Abschnitt 3.1.4, Gleichungen (15) und (16): Berechnung von Wicklungstemperatur und Temperaturerhöhung. <a href="https://odr.chalmers.se/items/0e911724-2e69-41e3-9c01-f30e577e11fb" target="_blank" rel="noopener noreferrer">Publikationseintrag</a>.</li>
        </ul>
        <p className={styles.smallPrint}>Die Quellen belegen das Rechenmodell. Für einen formalen IEC-Nachweis gelten die jeweils anwendbare IEC-Produktnorm, Prüfvorschrift und erforderliche Korrekturen; das Tool berechnet keine vollständige Normkonformität.</p>
      </section>
    </div></main>
  </Layout>;
}
