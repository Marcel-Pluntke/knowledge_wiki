import {useRef, useState} from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './mathe-magier.module.css';

export default function LernheldenPage() {
  const gameUrl = useBaseUrl('/games/lernhelden/');
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState('');

  async function fullscreen() {
    const isIphoneSafari = /iP(ad|hone|od)/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
    if (isIphoneSafari) { window.location.assign(gameUrl); return; }
    try { await frameRef.current?.requestFullscreen(); setError(''); }
    catch { setError('Der Vollbildmodus konnte nicht gestartet werden.'); }
  }

  return <Layout title="Lernhelden" description="Ein Held, eine Welt und viele Lernabenteuer.">
    <main className={styles.page}>
      <section className={styles.intro}>
        <h1>Lernhelden</h1>
        <p>Brüche, Dezimalzahlen und Vokabeln als ein gemeinsames Pixel-Rollenspiel.</p>
        <button className="button button--primary" type="button" onClick={fullscreen}>Vollbild spielen</button>
        {error && <p className={styles.fullscreenError} role="status">{error}</p>}
      </section>
      <iframe ref={frameRef} className={styles.frame} src={gameUrl} title="Lernhelden" allow="fullscreen" allowFullScreen />
    </main>
  </Layout>;
}
