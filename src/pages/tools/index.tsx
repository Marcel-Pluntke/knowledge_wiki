import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

const tools = [
  {
    title: 'IEC 61439 Erwärmungs-Umrechner',
    category: 'Engineering',
    description: 'Berechnet den Strom am Temperaturgrenzwert oder schätzt die Temperatur bei einem anderen Prüfstrom. Grundlage ist die IEC-Kennlinie mit dem Exponenten 0,61.',
    to: '/tools/erwaermungs-umrechner',
  },
  {
    title: 'Zyklus-Timer',
    category: 'Zeitsteuerung',
    description: 'Konfiguriere zeitgesteuerte Abläufe mit Start- und Abschlussphasen, wiederkehrenden Intervallen, Zyklen und Pausen. Mit Ablaufübersicht und Vollbildmodus.',
    to: '/tools/zyklus-timer',
  },
] as const;

export default function ToolsPage(): ReactNode {
  return (
    <Layout title="Tools" description="Übersicht aller Werkzeuge im Knowledge Wiki.">
      <main className={styles.page}>
        <div className="container">
          <header className={styles.hero}>
            <span className={styles.eyebrow}>Knowledge Wiki</span>
            <Heading as="h1">Tools</Heading>
            <p>Interaktive Rechner und praktische Werkzeuge für technische und allgemeine Anwendungen.</p>
          </header>

          <section className={styles.toolGrid} aria-label="Verfügbare Tools">
            {tools.map((tool) => (
              <article key={tool.to} className={styles.toolCard}>
                <span className={styles.kicker}>{tool.category}</span>
                <Heading as="h2">{tool.title}</Heading>
                <p>{tool.description}</p>
                <Link className="button button--primary" to={tool.to} aria-label={tool.title + ' öffnen'}>
                  Tool öffnen
                </Link>
              </article>
            ))}
          </section>
        </div>
      </main>
    </Layout>
  );
}
