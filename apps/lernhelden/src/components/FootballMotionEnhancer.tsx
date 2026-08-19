import {useEffect} from 'react';
import './footballMotion.css';

const PLAYBACK_MS = 1650;

export function FootballMotionEnhancer() {
  useEffect(() => {
    let lastFeedback = '';
    let playbackTimer = 0;
    let returnTimer = 0;

    const runPlayback = () => {
      const feedback = document.querySelector<HTMLElement>('.football-feedback');
      if (!feedback) {
        lastFeedback = '';
        return;
      }

      const text = feedback.textContent?.trim() ?? '';
      if (!text || text === lastFeedback) return;
      lastFeedback = text;

      const pitch = document.querySelector<HTMLElement>('.football-pitch');
      if (!pitch) return;

      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();

      window.clearTimeout(playbackTimer);
      window.clearTimeout(returnTimer);

      pitch.classList.remove('football-playback');
      void pitch.offsetWidth;
      pitch.classList.add('football-playback');

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.requestAnimationFrame(() => {
        pitch.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block: 'center'});
      });

      playbackTimer = window.setTimeout(() => {
        pitch.classList.remove('football-playback');
      }, reduceMotion ? 250 : PLAYBACK_MS);

      returnTimer = window.setTimeout(() => {
        const questionCard = document.querySelector<HTMLElement>('.football-question-card');
        if (!questionCard || !document.querySelector('.football-shell')) return;
        questionCard.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block: 'start'});
      }, reduceMotion ? 450 : PLAYBACK_MS + 250);
    };

    const observer = new MutationObserver(runPlayback);
    observer.observe(document.body, {childList: true, subtree: true, characterData: true});

    return () => {
      observer.disconnect();
      window.clearTimeout(playbackTimer);
      window.clearTimeout(returnTimer);
    };
  }, []);

  return null;
}
