import {useRef, useState} from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './mathe-magier.module.css';

export default function VokabelHeldPage() {
  const gameUrl = useBaseUrl('/vokabel-held/index.html');
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
    <Layout title="Vokabel Held" description="Ein Englisch-Vokabelabenteuer mit Deutsch-Englisch-Übungen.">
      <main className={styles.page}>
        <section className={styles.intro}>
          <h1>Vokabel Held</h1>
          <p>Trainiere deutsche und englische Wörter in beide Richtungen und sammle dabei Gold.</p>
          <button className="button button--primary" type="button" onClick={playFullscreen}>Vollbild / ohne Wiki spielen</button>
          {fullscreenError && <p className={styles.fullscreenError} role="status">{fullscreenError}</p>}
        </section>
        <iframe ref={frameRef} className={styles.frame} src={gameUrl} title="Vokabel Held – Englisch-Abenteuer" allow="fullscreen" allowFullScreen />
      </main>
    </Layout>
  );
}
