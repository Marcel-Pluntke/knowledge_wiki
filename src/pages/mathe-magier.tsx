import { useRef, useState } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './mathe-magier.module.css';

export default function MatheMagierPage() {
  const gameUrl = useBaseUrl('/mathe-magier/spiel/');
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [fullscreenError, setFullscreenError] = useState('');

  async function playFullscreen() {
    const userAgent = navigator.userAgent;
    const isIphoneSafari = /iP(ad|hone|od)/.test(userAgent)
      && /Safari/.test(userAgent)
      && !/CriOS|FxiOS|EdgiOS/.test(userAgent);

    if (isIphoneSafari) {
      window.location.assign(gameUrl);
      return;
    }

    const frame = frameRef.current;
    if (!frame?.requestFullscreen) {
      setFullscreenError('Dein Browser unterstützt den Vollbildmodus hier leider nicht.');
      return;
    }

    try {
      await frame.requestFullscreen();
      setFullscreenError('');
    } catch {
      setFullscreenError('Der Vollbildmodus wurde vom Browser nicht gestartet.');
    }
  }

  return (
    <Layout title="Mathe Magier" description="Ein Brüche-Abenteuer für die 5. Klasse.">
      <main className={styles.page}>
        <section className={styles.intro}>
          <h1>Mathe Magier</h1>
          <p>Löse Bruchaufgaben, sammle Ausrüstung und besiege die Bosse der Brüche-Burg.</p>
          <button className="button button--primary" type="button" onClick={playFullscreen}>Vollbild / ohne Wiki spielen</button>
          {fullscreenError && <p className={styles.fullscreenError} role="status">{fullscreenError}</p>}
        </section>
        <iframe ref={frameRef} className={styles.frame} src={gameUrl} title="Mathe Magier – Brüche-Abenteuer" allow="fullscreen" allowFullScreen />
      </main>
    </Layout>
  );
}
