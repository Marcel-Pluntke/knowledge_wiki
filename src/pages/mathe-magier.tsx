import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './mathe-magier.module.css';

export default function MatheMagierPage() {
  const gameUrl = useBaseUrl('/mathe-magier/spiel/');

  return (
    <Layout title="Mathe Magier" description="Ein Brüche-Abenteuer für die 5. Klasse.">
      <main className={styles.page}>
        <section className={styles.intro}>
          <h1>Mathe Magier</h1>
          <p>Löse Bruchaufgaben, sammle Ausrüstung und besiege die Bosse der Brüche-Burg.</p>
        </section>
        <iframe className={styles.frame} src={gameUrl} title="Mathe Magier – Brüche-Abenteuer" />
      </main>
    </Layout>
  );
}
