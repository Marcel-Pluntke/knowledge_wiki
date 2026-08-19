import {useEffect} from 'react';
import './footballMotion.css';
import './footballGoalBanner.css';

const DRIBBLE_PLAYBACK_MS = 1500;
const SHOT_PLAYBACK_MS = 2450;

export function FootballMotionEnhancer() {
  useEffect(() => {
    let lastFeedback = '';
    let playbackTimer = 0;
    let advanceTimer = 0;
    let scrollTimer = 0;

    const clearWholePlaceholder = () => {
      document.querySelector<HTMLInputElement>('input[aria-label="Ganze Zahl"]')?.removeAttribute('placeholder');
    };

    const removeGoalScene = () => {
      document.querySelector('.football-goal-scene')?.remove();
    };

    const addGoalScene = (pitch: HTMLElement) => {
      removeGoalScene();
      const scores = Array.from(document.querySelectorAll<HTMLElement>('.football-scoreboard > div strong'));
      const scoreText = scores.length >= 2 ? `${scores[0].textContent ?? ''} : ${scores[1].textContent ?? ''}` : '';

      const scene = document.createElement('div');
      scene.className = 'football-goal-scene';
      scene.setAttribute('aria-hidden', 'true');

      const label = document.createElement('strong');
      label.textContent = 'TOOOR!';
      scene.appendChild(label);

      if (scoreText.trim()) {
        const score = document.createElement('span');
        score.textContent = scoreText;
        scene.appendChild(score);
      }

      pitch.appendChild(scene);
    };

    const runPlayback = () => {
      clearWholePlaceholder();

      const feedback = document.querySelector<HTMLElement>('.football-feedback');
      if (!feedback) {
        lastFeedback = '';
        return;
      }

      const text = feedback.textContent?.trim() ?? '';
      if (!text || text === lastFeedback) return;
      lastFeedback = text;

      const pitch = document.querySelector<HTMLElement>('.football-pitch');
      const form = document.querySelector<HTMLFormElement>('.football-question-card .football-answer');
      const submitButton = form?.querySelector<HTMLButtonElement>('.football-primary') ?? null;
      if (!pitch || !form) return;

      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();

      window.clearTimeout(playbackTimer);
      window.clearTimeout(advanceTimer);
      window.clearTimeout(scrollTimer);
      removeGoalScene();

      pitch.classList.remove('football-playback');
      void pitch.offsetWidth;
      pitch.classList.add('football-playback');

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isShot = pitch.classList.contains('play-shot');
      const isGoal = pitch.classList.contains('outcome-goal') || text.startsWith('Tor!');
      const playbackMs = reduceMotion ? 300 : isShot ? SHOT_PLAYBACK_MS : DRIBBLE_PLAYBACK_MS;
      const finalAction = submitButton?.textContent?.includes('Ergebnis') ?? false;

      if (isGoal) addGoalScene(pitch);

      if (submitButton) {
        submitButton.textContent = finalAction ? 'Ergebnis folgt …' : 'Nächste Aufgabe …';
        submitButton.disabled = true;
        submitButton.classList.add('football-auto-advance');
      }

      window.requestAnimationFrame(() => {
        pitch.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block: 'center'});
      });

      playbackTimer = window.setTimeout(() => {
        pitch.classList.remove('football-playback');
        removeGoalScene();
      }, playbackMs);

      advanceTimer = window.setTimeout(() => {
        if (!document.querySelector('.football-shell')) return;
        form.requestSubmit();

        scrollTimer = window.setTimeout(() => {
          if (!document.querySelector('.football-shell')) return;
          const target = document.querySelector<HTMLElement>('.football-question-card')
            ?? document.querySelector<HTMLElement>('.football-result-card');
          target?.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block: 'start'});
        }, reduceMotion ? 40 : 120);
      }, playbackMs + (reduceMotion ? 40 : 180));
    };

    const observer = new MutationObserver(runPlayback);
    observer.observe(document.body, {childList: true, subtree: true, characterData: true});
    clearWholePlaceholder();

    return () => {
      observer.disconnect();
      removeGoalScene();
      window.clearTimeout(playbackTimer);
      window.clearTimeout(advanceTimer);
      window.clearTimeout(scrollTimer);
    };
  }, []);

  return null;
}
