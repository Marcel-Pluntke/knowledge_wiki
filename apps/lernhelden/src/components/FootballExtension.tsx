import {useEffect, useMemo, useState} from 'react';
import type {FormEvent} from 'react';
import {createPortal} from 'react-dom';
import type {Question} from '@lernhelden/engine';
import {fractionsAdventure} from '../adventures/fractions';
import {
  FOOTBALL_MATCH_QUESTIONS,
  footballBallLeft,
  footballPlayType,
  resolveFootballPlay,
  splitFractionExpression,
  type FootballDirection,
  type FootballOutcome,
  type FootballPlayType,
} from '../footballGame';
import './football.css';
import './footballV2.css';

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

function SchoolFractionExpression({text}: {text: string}) {
  const parts = splitFractionExpression(text);
  return <span className="school-expression" aria-label={text}>
    <span aria-hidden="true">
      {parts.map((part, index) => part.kind === 'text'
        ? <span className="school-expression-text" key={`${part.text}-${index}`}>{part.text}</span>
        : <span className="school-mixed-fraction" key={`${part.numerator}-${part.denominator}-${index}`}>
            {part.whole && <span className="school-whole">{part.whole}</span>}
            <span className="school-fraction">
              <span>{part.numerator}</span>
              <span className="school-fraction-line"/>
              <span>{part.denominator}</span>
            </span>
          </span>)}
    </span>
  </span>;
}

function playerDirectionLabel(direction: FootballDirection, playType: FootballPlayType) {
  if (playType === 'shot') return direction === 'upper' ? 'linke Ecke' : 'rechte Ecke';
  return direction === 'upper' ? 'oben' : 'unten';
}

function opponentDirectionLabel(direction: FootballDirection, playType: FootballPlayType) {
  if (playType === 'shot') return direction === 'upper' ? 'links' : 'rechts';
  return direction === 'upper' ? 'oben' : 'unten';
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
    <p>Brüche lösen, die Abwehr ausspielen und Tore schießen.</p>
    <button onClick={() => go('/football')}>Match starten <span aria-hidden="true">›</span></button>
  </article>;
}

function FootballGame() {
  const [phase, setPhase] = useState<MatchPhase>('select');
  const [modeId, setModeId] = useState<(typeof footballModes)[number]['id']>('add');
  const [question, setQuestion] = useState<Question | null>(null);
  const [sequence, setSequence] = useState(0);
  const [whole, setWhole] = useState('');
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [answered, setAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [playerGoals, setPlayerGoals] = useState(0);
  const [opponentGoals, setOpponentGoals] = useState(0);
  const [ballPosition, setBallPosition] = useState(0);
  const [playerDirection, setPlayerDirection] = useState<FootballDirection | null>(null);
  const [opponentDirection, setOpponentDirection] = useState<FootballDirection | null>(null);
  const [lastPlayType, setLastPlayType] = useState<FootballPlayType | null>(null);
  const [lastOutcome, setLastOutcome] = useState<FootballOutcome | null>(null);
  const [feedback, setFeedback] = useState('');
  const [turnLocked, setTurnLocked] = useState(false);
  const [record, setRecord] = useState<FootballRecord>(readRecord);

  const activeMode = useMemo(() => footballModes.find(mode => mode.id === modeId) ?? footballModes[0], [modeId]);
  const progress = Math.round((answered / FOOTBALL_MATCH_QUESTIONS) * 100);
  const currentPlayType = footballPlayType(ballPosition);
  const displayPlayType = turnLocked && lastPlayType ? lastPlayType : currentPlayType;

  const makeQuestion = (nextSequence: number, selectedMode = modeId) => fractionsAdventure.questionProvider.next({
    modeId: selectedMode,
    sequence: nextSequence,
    random: Math.random,
    chapter: 4,
  });

  const resetAnswer = () => {
    setWhole('');
    setNumerator('');
    setDenominator('');
    setPlayerDirection(null);
    setOpponentDirection(null);
    setLastPlayType(null);
    setLastOutcome(null);
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
    if (!question || turnLocked || !playerDirection || !numerator.trim() || !denominator.trim()) return;
    const fractionAnswer = `${numerator.trim()}/${denominator.trim()}`;
    const answer = whole.trim() ? `${whole.trim()} ${fractionAnswer}` : fractionAnswer;
    const correct = fractionsAdventure.questionProvider.evaluate(question, answer);
    const defendingDirection: FootballDirection = Math.random() < .5 ? 'upper' : 'lower';
    const play = resolveFootballPlay(ballPosition, correct, playerDirection, defendingDirection);
    const nextAnswered = answered + 1;

    setAnswered(nextAnswered);
    setBallPosition(play.ballPosition);
    setOpponentDirection(defendingDirection);
    setLastPlayType(play.playType);
    setLastOutcome(play.outcome);
    setTurnLocked(true);

    if (correct) setCorrectAnswers(value => value + 1);
    if (play.playerGoal) setPlayerGoals(value => value + 1);
    if (play.opponentGoal) setOpponentGoals(value => value + 1);

    if (!correct) {
      setFeedback(play.opponentGoal
        ? `Noch nicht. Richtig wäre ${question.answer}. Der Gegner kontert und trifft.`
        : `Noch nicht. Richtig wäre ${question.answer}. Der Gegner gewinnt den Ball.`);
      return;
    }

    if (play.outcome === 'goal') {
      setFeedback(`Tor! Der Torwart springt ${opponentDirectionLabel(defendingDirection, 'shot')}, dein Schuss geht in die ${playerDirectionLabel(playerDirection, 'shot')}.`);
    } else if (play.outcome === 'saved') {
      setFeedback(`Richtig gerechnet, aber der Torwart ahnt die ${playerDirectionLabel(playerDirection, 'shot')} und hält. Der Abpraller bleibt bei dir.`);
    } else if (play.outcome === 'breakthrough') {
      setFeedback(`Richtig! Du gehst ${playerDirectionLabel(playerDirection, 'dribble')}, die Abwehr zieht ${opponentDirectionLabel(defendingDirection, 'dribble')}. Ausgespielt!`);
    } else {
      setFeedback(`Richtig! Die Abwehr liest deine Richtung, aber du behauptest den Ball und kommst weiter.`);
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (turnLocked) nextTurn();
    else submit();
  };

  const actorDirectionClass = turnLocked && opponentDirection ? ` ${opponentDirection}` : '';
  const ballDirectionClass = playerDirection ? ` choice-${playerDirection}` : '';
  const outcomeClass = turnLocked && lastOutcome ? ` outcome-${lastOutcome}` : '';

  return <div className="football-shell" role="dialog" aria-label="Mathe Fußball">
    <header className="football-topbar">
      <button className="football-back" onClick={() => go('/home')}>Zur Spieleauswahl</button>
      <div><small>Lernhelden</small><strong>Mathe Fußball</strong></div>
      <span className="football-record">{record.wins} Siege · {record.goals} Tore</span>
    </header>

    {phase === 'select' && <main className="football-start">
      <section className="football-hero-panel">
        <p className="football-kicker">Brüche-Liga</p>
        <h1>Rechnen. Ausspielen. Tore schießen.</h1>
        <p>Wähle einen Modus und das Match startet sofort. Löse die Aufgabe und entscheide zusätzlich, wie du an der Abwehr vorbeigehst oder in welche Ecke du schießt.</p>
        <div className="football-mini-pitch" aria-hidden="true"><span className="football-ball"/></div>
      </section>
      <section className="football-mode-panel">
        <div className="football-section-heading"><div><small>Trainingsart</small><h2>Wähle dein Match</h2></div><span>Startet sofort</span></div>
        <p className="football-mode-tip">Einmal tippen – direkt geht es auf den Platz.</p>
        <div className="football-mode-grid">
          {footballModes.map(mode => <button key={mode.id} onClick={() => startMatch(mode.id)}>
            <strong>{mode.title}</strong><span>{mode.description}</span>
          </button>)}
        </div>
      </section>
    </main>}

    {phase === 'playing' && question && <main className="football-match">
      <section className="football-scoreboard">
        <div><small>DEIN TEAM</small><strong>{playerGoals}</strong></div>
        <span><small>{activeMode.title}</small><b>{answered}/{FOOTBALL_MATCH_QUESTIONS}</b></span>
        <div><small>GEGNER</small><strong>{opponentGoals}</strong></div>
      </section>

      <section className={`football-pitch play-${displayPlayType}${outcomeClass}`} aria-label="Spielfeld mit aktueller Ballposition">
        <div className="football-goal left" aria-hidden="true"/>
        <div className="football-goal right" aria-hidden="true"/>
        <div className="football-halfway" aria-hidden="true"/>
        <div className="football-center-circle" aria-hidden="true"/>
        {displayPlayType === 'shot'
          ? <div className={`football-pitch-actor football-keeper${actorDirectionClass}`} aria-hidden="true"><span>TW</span></div>
          : <div className={`football-pitch-actor football-defender${actorDirectionClass}`} aria-hidden="true"><span>ABW</span></div>}
        <span className={`football-ball match-ball${ballDirectionClass}`} style={{left: `${footballBallLeft(ballPosition)}%`}} aria-label="Ballposition"/>
      </section>

      <div className="football-progress" aria-label={`${progress} Prozent des Matches gespielt`}><span style={{width: `${progress}%`}}/></div>

      <section className="football-question-card">
        <div className="football-question-meta"><span>{question.category}</span><strong>Aktion {answered + (turnLocked ? 0 : 1)} von {FOOTBALL_MATCH_QUESTIONS}</strong></div>
        <div className="football-question"><SchoolFractionExpression text={question.prompt}/></div>

        <div className={`football-tactic ${displayPlayType}`}>
          <div className="football-tactic-copy">
            <small>{displayPlayType === 'shot' ? 'Torchance' : 'Dein Spielzug'}</small>
            <strong>{displayPlayType === 'shot' ? 'In welche Ecke schießt du?' : 'Wo gehst du an der Abwehr vorbei?'}</strong>
          </div>
          <div className="football-tactic-grid">
            <button type="button" disabled={turnLocked} className={playerDirection === 'upper' ? 'selected' : ''} onClick={() => setPlayerDirection('upper')}>
              <span className="football-direction-mark">{displayPlayType === 'shot' ? 'L' : '↑'}</span>
              <span><strong>{displayPlayType === 'shot' ? 'Linke Ecke' : 'Oben vorbei'}</strong><small>{displayPlayType === 'shot' ? 'Schuss platzieren' : 'Dribbling wählen'}</small></span>
            </button>
            <button type="button" disabled={turnLocked} className={playerDirection === 'lower' ? 'selected' : ''} onClick={() => setPlayerDirection('lower')}>
              <span className="football-direction-mark">{displayPlayType === 'shot' ? 'R' : '↓'}</span>
              <span><strong>{displayPlayType === 'shot' ? 'Rechte Ecke' : 'Unten vorbei'}</strong><small>{displayPlayType === 'shot' ? 'Schuss platzieren' : 'Dribbling wählen'}</small></span>
            </button>
          </div>
        </div>

        <form className="football-answer" onSubmit={handleSubmit}>
          <div className="football-answer-value">
            <label className="football-whole-input">
              <span>Ganze</span>
              <input aria-label="Ganze Zahl" inputMode="numeric" pattern="-?[0-9]*" placeholder="0" value={whole} onChange={event => setWhole(event.target.value)} disabled={turnLocked}/>
            </label>
            <div className="football-fraction-input">
              <input aria-label="Zähler" inputMode="numeric" pattern="-?[0-9]*" value={numerator} onChange={event => setNumerator(event.target.value)} disabled={turnLocked}/>
              <span/>
              <input aria-label="Nenner" inputMode="numeric" pattern="-?[0-9]*" value={denominator} onChange={event => setDenominator(event.target.value)} disabled={turnLocked}/>
            </div>
          </div>
          <button className="football-primary" disabled={!turnLocked && (!playerDirection || !numerator.trim() || !denominator.trim())} type="submit">
            {turnLocked ? answered >= FOOTBALL_MATCH_QUESTIONS ? 'Ergebnis anzeigen' : 'Nächste Aktion' : 'Spielzug ausführen'}
          </button>
        </form>
        {!turnLocked && !playerDirection && <p className="football-action-hint">Wähle zuerst deinen Laufweg oder deine Schussecke.</p>}
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
