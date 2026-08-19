import {useEffect} from 'react';
import {fractionsAdventure} from '../adventures/fractions';
import './footballMotion.css';
import './footballGoalBanner.css';
import './footballDifficulty.css';

const DRIBBLE_PLAYBACK_MS = 1500;
const SHOT_PLAYBACK_MS = 2450;
const DIFFICULTY_KEY_PREFIX = 'lernhelden:football:difficulty:';

type FootballArithmeticMode = 'add' | 'sub';
type FootballDifficulty = 'easy' | 'hard';

const difficultyKey = (mode: FootballArithmeticMode) => `${DIFFICULTY_KEY_PREFIX}${mode}`;

const readDifficulty = (mode: FootballArithmeticMode): FootballDifficulty =>
  localStorage.getItem(difficultyKey(mode)) === 'hard' ? 'hard' : 'easy';

const writeDifficulty = (mode: FootballArithmeticMode, difficulty: FootballDifficulty) => {
  localStorage.setItem(difficultyKey(mode), difficulty);
};

export function FootballMotionEnhancer() {
  useEffect(() => {
    let lastFeedback = '';
    let playbackTimer = 0;
    let advanceTimer = 0;
    let scrollTimer = 0;

    const originalNext = fractionsAdventure.questionProvider.next;
    const footballNext: typeof originalNext = args => {
      const isFootball = location.hash.replace(/^#/, '').startsWith('/football');
      const mode = args.modeId === 'add' || args.modeId === 'sub' ? args.modeId as FootballArithmeticMode : null;
      if (!isFootball || !mode) return originalNext(args);

      const difficulty = readDifficulty(mode);
      const wantedCategory = difficulty === 'hard' ? 'Ungleichnamige' : 'Gleichnamige';
      let question = originalNext(args);

      for (let attempt = 0; attempt < 60 && !question.category.startsWith(wantedCategory); attempt += 1) {
        question = originalNext(args);
      }

      return question;
    };
    fractionsAdventure.questionProvider.next = footballNext;

    const clearWholePlaceholder = () => {
      document.querySelector<HTMLInputElement>('input[aria-label="Ganze Zahl"]')?.removeAttribute('placeholder');
    };

    const updateModeCardDescriptions = () => {
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.football-mode-grid > button'));
      const update = (title: string, mode: FootballArithmeticMode, operation: string) => {
        const button = buttons.find(candidate => candidate.querySelector('strong')?.textContent?.trim() === title);
        const description = button?.querySelector('span');
        if (!description) return;
        const difficulty = readDifficulty(mode);
        description.textContent = difficulty === 'hard'
          ? `${operation} · Schwer · unterschiedliche Nenner`
          : `${operation} · Leicht · gleiche Nenner`;
      };
      update('Passspiel', 'add', 'Brüche addieren');
      update('Ballgewinn', 'sub', 'Brüche subtrahieren');
    };

    const syncDifficultyControls = () => {
      const grid = document.querySelector<HTMLElement>('.football-mode-grid');
      if (!grid) return;

      const existing = document.querySelector<HTMLElement>('.football-difficulty-panel');
      if (existing) {
        updateModeCardDescriptions();
        return;
      }

      const panel = document.createElement('section');
      panel.className = 'football-difficulty-panel';
      panel.setAttribute('aria-label', 'Schwierigkeit für Addition und Subtraktion');

      const intro = document.createElement('div');
      intro.className = 'football-difficulty-intro';
      intro.innerHTML = '<small>Schwierigkeit</small><strong>Nenner wählen</strong><span>Leicht = gleich · Schwer = unterschiedlich</span>';
      panel.appendChild(intro);

      const rows = document.createElement('div');
      rows.className = 'football-difficulty-rows';

      const addRow = (mode: FootballArithmeticMode, title: string) => {
        const row = document.createElement('div');
        row.className = 'football-difficulty-row';

        const label = document.createElement('strong');
        label.textContent = title;
        row.appendChild(label);

        const choices = document.createElement('div');
        choices.className = 'football-difficulty-choices';

        (['easy', 'hard'] as FootballDifficulty[]).forEach(difficulty => {
          const button = document.createElement('button');
          button.type = 'button';
          button.dataset.mode = mode;
          button.dataset.difficulty = difficulty;
          button.textContent = difficulty === 'easy' ? 'Leicht' : 'Schwer';
          button.classList.toggle('selected', readDifficulty(mode) === difficulty);
          button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            writeDifficulty(mode, difficulty);
            choices.querySelectorAll('button').forEach(choice => choice.classList.remove('selected'));
            button.classList.add('selected');
            updateModeCardDescriptions();
          });
          choices.appendChild(button);
        });

        row.appendChild(choices);
        rows.appendChild(row);
      };

      addRow('add', 'Addition');
      addRow('sub', 'Subtraktion');
      panel.appendChild(rows);
      grid.parentElement?.insertBefore(panel, grid);
      updateModeCardDescriptions();
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

    const sync = () => {
      clearWholePlaceholder();
      syncDifficultyControls();
      runPlayback();
    };

    const observer = new MutationObserver(sync);
    observer.observe(document.body, {childList: true, subtree: true, characterData: true});
    sync();

    return () => {
      observer.disconnect();
      removeGoalScene();
      if (fractionsAdventure.questionProvider.next === footballNext) {
        fractionsAdventure.questionProvider.next = originalNext;
      }
      window.clearTimeout(playbackTimer);
      window.clearTimeout(advanceTimer);
      window.clearTimeout(scrollTimer);
    };
  }, []);

  return null;
}
