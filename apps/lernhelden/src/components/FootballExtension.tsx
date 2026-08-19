import {useEffect, useMemo, useState} from 'react';
import {createPortal} from 'react-dom';
import type {Question} from '@lernhelden/engine';
import {fractionsAdventure} from '../adventures/fractions';
import {FOOTBALL_MATCH_QUESTIONS, footballBallLeft, resolveFootballTurn} from '../footballGame';
import './football.css';

type MatchPhase = 'select' | 'playing' | 'finished';

type FootballRecord = {
  matches: number;
  wins: number;
  goals: number;
  bestGoals: number;
};

const footballModes = [
  {id: 'add', title: 'Passspiel', description: 'Brüche addieren'},
  {id: 'sub', title: 'Ballgewinn', description: 'Brüche subtrahieren'},
  {id: 'mul', title: 'Flankenlauf', description: 'Brüche multiplizieren'},
  {id: 'div', title: 'Steilpass', description: 'Brüche dividieren'},
  {id: 'reduce', title: 'Kurzpass', description: 'Brüche vollständig kürzen'},
  {id: 'test', title: 'Pokalspiel', description: 'Alle Brucharten gemischt'},
] as const;

const recordKey = 'lernhelden:football:v1';
const emptyRecord: FootballRecord = {matches: 0, wins: 0, goals: 0, bestGoals: 0};

const routeFromHash = () => location.hash.replace(/^#/, '') || '/home';
const go = (path: string) => { location.hash = path.startsWith('/') ? path : `/${path}`; };

function readRecord(): FootballRecord {
  try {
    const parsed = JSON.parse(localStorage.getItem(recordKey) ?? 'null') as Partial<FootballRecord> | null;
    if (!parsed) return emptyRecord;
    return {
      matches: Number(parsed.matches) || 0,
      wins: Number(parsed.wins) || 0,
      goals: Number(parsed.goals) || 0,
      bestGoals: Number(parsed.bestGoals) || 0,
    };
  } catch {
    return emptyRecord;
  }
}

export function FootballExtension() {
  const [route, setRoute] = useState(routeFromHash);
  const [grid, setGrid] = useState<HTMLElement | null>(null);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setRoute(routeFromHash());
      setGrid(document.querySelector<HTMLElement>('.adventure-grid'));
      setAppReady(Boolean(document.querySelector('.app')));
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {childList: true, subtree: true});
    window.addEventListener('hashchange', sync);
    sync();
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  return <>
    {grid && route === '/home' && createPortal(<FootballCard/>, grid)}
    {appReady && route === '/football' && createPortal(<FootballGame/>, document.body)}
  </>;
}

function FootballCard() {
  return <article className="adventure-card football-launch-card">
    <div className="football-card-art" aria-hidden="true">
      <div className="football-card-pitch"><span className="football-card-ball"/></div>
    </div>
    <span className="status">MVP</span>
    <h2>Mathe Fußball</h2>
    <p>Brüche lösen, den Ball nach vorn spielen und Tore schießen.</p>
    <button onClick={() => go('/football')}>Match starten <span aria-hidden="true">›</span></button>
  </article>;
}

function FootballGame() {
  const [phase, setPhase] = useState<MatchPhase>('select');
  const [modeId, setModeId] = useState<(typeof footballModes)[number]['id']>('add');
  const [question, setQuestion] = useState<Question | null>(null);
  const [sequence, setSequence] = useState(0);
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [answered, setAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [playerGoals, setPlayerGoals] = useState(0);
  const [opponentGoals, setOpponentGoals] = useState(0);
  const [ballPosition, setBallPosition] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [turnLocked, setTurnLocked] = useState(false);
  const [record, setRecord] = useState<FootballRecord>(readRecord);

  const activeMode = useMemo(() => footballModes.find(mode => mode.id === modeId) ?? footballModes[0], [modeId]);
  const progress = Math.round((answered / FOOTBALL_MATCH_QUESTIONS) * 100);

  const makeQuestion = (nextSequence: number, selectedMode = modeId) => fractionsAdventure.questionProvider.next({
    modeId: selectedMode,
    sequence: nextSequence,
    random: Math.random,
    chapter: 4,
  });

  const resetAnswer = () => {
    setNumerator('');
    setDenominator('');
    setFeedback('');
    setTurnLocked(false);
  };

  const startMatch = (selectedMode = modeId) => {
    setModeId(selectedMode);
    setPhase('playing');
    setSequence(1);
    setQuestion(makeQuestion(1, selectedMode));
    setAnswered(0);
    setCorrectAnswers(0);
    setPlayerGoals(0);
    setOpponentGoals(0);
    setBallPosition(0);
    resetAnswer();
  };

  const finishMatch = () => {
    setPhase('finished');
    setRecord(current => {
      const next = {
        matches: current.matches + 1,
        wins: current.wins + (playerGoals > opponentGoals ? 1 : 0),
        goals: current.goals + playerGoals,
        bestGoals: Math.max(current.bestGoals, playerGoals),
      };
      localStorage.setItem(recordKey, JSON.stringify(next));
      return next;
    });
  };

  const submit = () => {
    if (!question || turnLocked || !numerator.trim() || !denominator.trim()) return;
    const answer = `${numerator.trim()}/${denominator.trim()}`;
    const correct = fractionsAdventure.questionProvider.evaluate(question, answer);
    const turn = resolveFootballTurn(ballPosition, correct);
    const nextAnswered = answered + 1;

    setAnswered(nextAnswered);
    setBallPosition(turn.ballPosition);
    setTurnLocked(true);

    if (correct) {
      setCorrectAnswers(value => value + 1);
      if (turn.playerGoal) {
        setPlayerGoals(value => value + 1);
        setFeedback('Tor! Drei starke Aktionen bringen dein Team in Führung.');
      } else {
        setFeedback('Richtig! Dein Team spielt den Ball weiter nach vorn.');
      }
    } else if (turn.opponentGoal) {
      setOpponentGoals(value => value + 1);
      setFeedback(`Noch nicht. Richtig wäre ${question.answer}. Der Gegner nutzt die Chance und trifft.`);
    } else {
      setFeedback(`Noch nicht. Richtig wäre ${question.answer}. Der Gegner gewinnt Raum.`);
    }
  };

  const nextTurn = () => {
    if (answered >= FOOTBALL_MATCH_QUESTIONS) {
      finishMatch();
      return;
    }
    const nextSequence = sequence + 1;
    setSequence(nextSequence);
    setQuestion(makeQuestion(nextSequence));
    resetAnswer();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (turnLocked) nextTurn();
    else submit();
  };

  return <div className="football-shell" role="dialog" aria-label="Mathe Fußball">
    <header className="football-topbar">
      <button className="football-back" onClick={() => go('/home')}>Zur Spieleauswahl</button>
      <div><small>Lernhelden</small><strong>Mathe Fußball</strong></div>
      <span className="football-record">{record.wins} Siege · {record.goals} Tore</span>
    </header>

    {phase === 'select' && <main className="football-start">
      <section className="football-hero-panel">
        <p className="football-kicker">Brüche-Liga</p>
        <h1>Rechnen. Angreifen. Tore schießen.</h1>
        <p>Jede richtige Lösung bringt den Ball Richtung gegnerisches Tor. Fehler geben dem Gegner Raum. Nach {FOOTBALL_MATCH_QUESTIONS} Aufgaben steht das Ergebnis fest.</p>
        <div className="football-mini-pitch" aria-hidden="true"><span className="football-ball"/></div>
      </section>
      <section className="football-mode-panel">
        <div className="football-section-heading"><div><small>Trainingsart</small><h2>Wähle dein Match</h2></div><span>10 Aufgaben</span></div>
        <div className="football-mode-grid">
          {footballModes.map(mode => <button key={mode.id} className={modeId === mode.id ? 'selected' : ''} onClick={() => setModeId(mode.id)}>
            <strong>{mode.title}</strong><span>{mode.description}</span>
          </button>)}
        </div>
        <button className="football-primary" onClick={() => startMatch()}>Match anpfeifen</button>
      </section>
    </main>}

    {phase === 'playing' && question && <main className="football-match">
      <section className="football-scoreboard">
        <div><small>DEIN TEAM</small><strong>{playerGoals}</strong></div>
        <span><small>{activeMode.title}</small><b>{answered}/{FOOTBALL_MATCH_QUESTIONS}</b></span>
        <div><small>GEGNER</small><strong>{opponentGoals}</strong></div>
      </section>

      <section className="football-pitch" aria-label="Spielfeld mit aktueller Ballposition">
        <div className="football-goal left" aria-hidden="true"/>
        <div className="football-goal right" aria-hidden="true"/>
        <div className="football-halfway" aria-hidden="true"/>
        <div className="football-center-circle" aria-hidden="true"/>
        <span className="football-ball match-ball" style={{left: `${footballBallLeft(ballPosition)}%`}} aria-label="Ballposition"/>
      </section>

      <div className="football-progress" aria-label={`${progress} Prozent des Matches gespielt`}><span style={{width: `${progress}%`}}/></div>

      <section className="football-question-card">
        <div className="football-question-meta"><span>{question.category}</span><strong>Aktion {answered + (turnLocked ? 0 : 1)} von {FOOTBALL_MATCH_QUESTIONS}</strong></div>
        <div className="football-question">{question.prompt}</div>
        <form className="football-answer" onSubmit={handleSubmit}>
          <div className="football-fraction-input">
            <input aria-label="Zähler" inputMode="numeric" pattern="-?[0-9]*" value={numerator} onChange={event => setNumerator(event.target.value)} disabled={turnLocked}/>
            <span/>
            <input aria-label="Nenner" inputMode="numeric" pattern="-?[0-9]*" value={denominator} onChange={event => setDenominator(event.target.value)} disabled={turnLocked}/>
          </div>
          <button className="football-primary" disabled={!turnLocked && (!numerator.trim() || !denominator.trim())} type="submit">
            {turnLocked ? answered >= FOOTBALL_MATCH_QUESTIONS ? 'Ergebnis anzeigen' : 'Nächste Aktion' : 'Antwort prüfen'}
          </button>
        </form>
        {feedback && <p className={`football-feedback${feedback.startsWith('Richtig') || feedback.startsWith('Tor') ? ' correct' : ''}`} role="status">{feedback}</p>}
      </section>
    </main>}

    {phase === 'finished' && <main className="football-finish">
      <section className="football-result-card">
        <p className="football-kicker">Abpfiff</p>
        <h1>{playerGoals > opponentGoals ? 'Sieg!' : playerGoals === opponentGoals ? 'Unentschieden' : 'Nächstes Match holen wir uns.'}</h1>
        <div className="football-final-score"><span>{playerGoals}</span><b>:</b><span>{opponentGoals}</span></div>
        <p>{correctAnswers} von {FOOTBALL_MATCH_QUESTIONS} Aufgaben richtig gelöst.</p>
        <div className="football-result-actions">
          <button className="football-primary" onClick={() => startMatch(modeId)}>Noch ein Match</button>
          <button className="football-secondary" onClick={() => setPhase('select')}>Modus wechseln</button>
          <button className="football-secondary" onClick={() => go('/home')}>Zur Spieleauswahl</button>
        </div>
      </section>
    </main>}
  </div>;
}
