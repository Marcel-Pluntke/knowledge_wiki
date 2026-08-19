import {useEffect, useMemo, useState} from 'react';
import type {CSSProperties, FormEvent} from 'react';
import {createPortal} from 'react-dom';
import type {Question} from '@lernhelden/engine';
import {fractionsAdventure} from '../adventures/fractions';
import {
  FOOTBALL_MATCH_QUESTIONS,
  footballBallLeft,
  footballPlayType,
  resolveFootballAction,
  splitFractionExpression,
  type FootballAction,
  type FootballDirection,
  type FootballOutcome,
  type FootballPlayType,
  type FootballSituation,
} from '../footballGame';
import './football.css';
import './footballV2.css';
import './footballGameplayV3.css';

type MatchPhase = 'select' | 'playing' | 'finished';

type FootballRecord = {
  matches: number;
  wins: number;
  goals: number;
  bestGoals: number;
};

type PitchPoint = {left: number; top: number};

const footballModes = [
  {id: 'add', title: 'Passspiel', description: 'Brüche addieren'},
  {id: 'sub', title: 'Ballgewinn', description: 'Brüche subtrahieren'},
  {id: 'mul', title: 'Flankenlauf', description: 'Brüche multiplizieren'},
  {id: 'div', title: 'Steilpass', description: 'Brüche dividieren'},
  {id: 'reduce', title: 'Kurzpass', description: 'Brüche vollständig kürzen'},
  {id: 'test', title: 'Pokalspiel', description: 'Alle Brucharten gemischt'},
] as const;

const footballActions: Array<{id: FootballAction; title: string; short: string; description: string}> = [
  {id: 'pass', title: 'Pass', short: 'P', description: 'Sicher kombinieren'},
  {id: 'dribble', title: 'Dribbling', short: 'D', description: 'Gegner ausspielen'},
  {id: 'through-ball', title: 'Steilpass', short: 'S', description: 'Schnell hinter die Abwehr'},
];

const TEAM_PLAYER_TOPS = [50, 28, 72] as const;
const recordKey = 'lernhelden:football:v1';
const emptyRecord: FootballRecord = {matches: 0, wins: 0, goals: 0, bestGoals: 0};

const routeFromHash = () => location.hash.replace(/^#/, '') || '/home';
const go = (path: string) => { location.hash = path.startsWith('/') ? path : `/${path}`; };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

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

function targetPlayer(activePlayer: number, direction: FootballDirection) {
  const preferred = direction === 'upper' ? 1 : 2;
  return preferred === activePlayer ? 0 : preferred;
}

function teamPlayerPoint(index: number, ballPosition: number, activePlayer: number, playType: FootballPlayType): PitchPoint {
  const carrierLeft = clamp(footballBallLeft(ballPosition) - 3, 24, playType === 'shot' ? 72 : 76);
  return {
    left: index === activePlayer ? carrierLeft : clamp(carrierLeft - 12, 17, 68),
    top: TEAM_PLAYER_TOPS[index] ?? 50,
  };
}

function opponentPlayerPoint(index: number, ballPosition: number, playType: FootballPlayType): PitchPoint {
  if (playType === 'shot') {
    if (index === 2) return {left: 94, top: 50};
    return {left: index === 0 ? 79 : 82, top: index === 0 ? 30 : 70};
  }
  const carrierLeft = clamp(footballBallLeft(ballPosition) - 3, 24, 76);
  const defensiveLine = clamp(carrierLeft + 20, 46, 84);
  if (index === 0) return {left: defensiveLine - 3, top: 26};
  if (index === 1) return {left: defensiveLine + 2, top: 50};
  return {left: defensiveLine - 3, top: 74};
}

function momentumLabel(momentum: number) {
  if (momentum >= 5) return 'Nicht zu stoppen';
  if (momentum >= 4) return 'Heiß';
  if (momentum >= 3) return 'Großchance';
  if (momentum >= 2) return 'Angriff läuft';
  if (momentum === 1) return 'Aufbau';
  return 'Neutral';
}

function situationCopy(situation: FootballSituation) {
  if (situation === 'big-chance') return {eyebrow: 'Sondersituation', title: 'GROSSCHANCE'};
  if (situation === 'free-kick') return {eyebrow: 'Foul an deinem Team', title: 'FREISTOSS'};
  if (situation === 'one-on-one') return {eyebrow: 'Abwehr überspielt', title: '1 GEGEN 1'};
  if (situation === 'counter') return {eyebrow: 'Ballverlust', title: 'KONTER'};
  return null;
}

function nextSituationSuffix(situation: FootballSituation) {
  if (situation === 'big-chance') return ' Großchance vorbereitet!';
  if (situation === 'free-kick') return ' Foul – du bekommst einen Freistoß!';
  if (situation === 'one-on-one') return ' Abwehr geknackt – 1 gegen 1!';
  return '';
}

function directionOption(
  action: FootballAction | 'shot',
  direction: FootballDirection,
  activePlayer: number,
) {
  if (action === 'shot') {
    return direction === 'upper'
      ? {mark: 'L', title: 'Linke Ecke', hint: 'Schuss platzieren'}
      : {mark: 'R', title: 'Rechte Ecke', hint: 'Schuss platzieren'};
  }
  if (action === 'pass') {
    const target = targetPlayer(activePlayer, direction) + 1;
    return {mark: `${target}`, title: `Zu Spieler ${target}`, hint: direction === 'upper' ? 'Obere Passlinie' : 'Untere Passlinie'};
  }
  if (action === 'through-ball') {
    const target = targetPlayer(activePlayer, direction) + 1;
    return {mark: direction === 'upper' ? '↗' : '↘', title: `Lauf Spieler ${target}`, hint: 'In den freien Raum'};
  }
  return direction === 'upper'
    ? {mark: '↑', title: 'Oben vorbei', hint: 'Dribbling wählen'}
    : {mark: '↓', title: 'Unten vorbei', hint: 'Dribbling wählen'};
}

function shotPrompt(situation: FootballSituation) {
  if (situation === 'one-on-one') return '1 gegen 1 – wohin schießt du?';
  if (situation === 'free-kick') return 'Freistoß – welche Ecke nimmst du?';
  if (situation === 'big-chance') return 'Großchance – Abschluss wählen';
  return 'In welche Ecke schießt du?';
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
    <p>Brüche lösen, im 3 gegen 3 kombinieren und Tore schießen.</p>
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
  const [activePlayer, setActivePlayer] = useState(0);
  const [lastStartPlayer, setLastStartPlayer] = useState(0);
  const [lastStartBallPosition, setLastStartBallPosition] = useState(0);
  const [selectedAction, setSelectedAction] = useState<FootballAction | null>(null);
  const [lastAction, setLastAction] = useState<FootballAction | 'shot' | null>(null);
  const [playerDirection, setPlayerDirection] = useState<FootballDirection | null>(null);
  const [opponentDirection, setOpponentDirection] = useState<FootballDirection | null>(null);
  const [lastPlayType, setLastPlayType] = useState<FootballPlayType | null>(null);
  const [lastOutcome, setLastOutcome] = useState<FootballOutcome | null>(null);
  const [momentum, setMomentum] = useState(0);
  const [situation, setSituation] = useState<FootballSituation>('normal');
  const [pendingSituation, setPendingSituation] = useState<FootballSituation>('normal');
  const [feedback, setFeedback] = useState('');
  const [turnLocked, setTurnLocked] = useState(false);
  const [record, setRecord] = useState<FootballRecord>(readRecord);

  const activeMode = useMemo(() => footballModes.find(mode => mode.id === modeId) ?? footballModes[0], [modeId]);
  const progress = Math.round((answered / FOOTBALL_MATCH_QUESTIONS) * 100);
  const currentPlayType = footballPlayType(ballPosition, situation);
  const displayPlayType = turnLocked && lastPlayType ? lastPlayType : currentPlayType;
  const displayAction: FootballAction | 'shot' | null = turnLocked && lastAction
    ? lastAction
    : currentPlayType === 'shot' ? 'shot' : selectedAction;
  const situationBanner = situationCopy(situation);

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
    setSelectedAction(null);
    setPlayerDirection(null);
    setOpponentDirection(null);
    setLastPlayType(null);
    setLastOutcome(null);
    setLastAction(null);
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
    setActivePlayer(0);
    setLastStartPlayer(0);
    setLastStartBallPosition(0);
    setMomentum(0);
    setSituation('normal');
    setPendingSituation('normal');
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
    if (currentPlayType !== 'shot' && !selectedAction) return;

    const fractionAnswer = `${numerator.trim()}/${denominator.trim()}`;
    const answer = whole.trim() ? `${whole.trim()} ${fractionAnswer}` : fractionAnswer;
    const correct = fractionsAdventure.questionProvider.evaluate(question, answer);
    const defendingDirection: FootballDirection = Math.random() < .5 ? 'upper' : 'lower';
    const action = selectedAction ?? 'pass';
    const play = resolveFootballAction(
      ballPosition,
      correct,
      action,
      playerDirection,
      defendingDirection,
      momentum,
      situation,
      Math.random,
    );
    const nextAnswered = answered + 1;
    const receivingPlayer = targetPlayer(activePlayer, playerDirection);

    setLastStartBallPosition(ballPosition);
    setLastStartPlayer(activePlayer);
    setAnswered(nextAnswered);
    setBallPosition(play.ballPosition);
    setOpponentDirection(defendingDirection);
    setLastPlayType(play.playType);
    setLastOutcome(play.outcome);
    setLastAction(play.action);
    setMomentum(play.momentum);
    setPendingSituation(play.nextSituation);
    setTurnLocked(true);

    if (correct) setCorrectAnswers(value => value + 1);
    if (play.playerGoal) setPlayerGoals(value => value + 1);
    if (play.opponentGoal) setOpponentGoals(value => value + 1);

    if (play.playerGoal || play.opponentGoal) {
      setActivePlayer(0);
    } else if (correct && play.playType !== 'shot' && (action === 'pass' || action === 'through-ball')) {
      setActivePlayer(receivingPlayer);
    }

    if (!correct) {
      setFeedback(play.opponentGoal
        ? `Noch nicht. Richtig wäre ${question.answer}. Der Gegner kontert und trifft.`
        : action === 'through-ball'
          ? `Noch nicht. Richtig wäre ${question.answer}. Der riskante Steilpass wird abgefangen – Konter!`
          : `Noch nicht. Richtig wäre ${question.answer}. Der Gegner gewinnt den Ball – Konter!`);
      return;
    }

    const situationSuffix = nextSituationSuffix(play.nextSituation);
    if (play.outcome === 'goal') {
      setFeedback(`Tor! Der Torwart springt ${opponentDirectionLabel(defendingDirection, 'shot')}, dein Schuss geht in die ${playerDirectionLabel(playerDirection, 'shot')}.`);
    } else if (play.outcome === 'saved') {
      setFeedback(`Richtig gerechnet, aber der Torwart ahnt die ${playerDirectionLabel(playerDirection, 'shot')} und hält. Der Abpraller bleibt bei dir.${situationSuffix}`);
    } else if (play.outcome === 'pass-complete') {
      setFeedback(`Richtig! Pass auf Spieler ${receivingPlayer + 1} kommt an.${situationSuffix}`);
    } else if (play.outcome === 'through-ball') {
      setFeedback(`Richtig! Steilpass in den Lauf von Spieler ${receivingPlayer + 1} – Abwehr überspielt.${situationSuffix}`);
    } else if (play.outcome === 'breakthrough') {
      setFeedback(`Richtig! Du gehst ${playerDirectionLabel(playerDirection, 'dribble')}, die Abwehr zieht ${opponentDirectionLabel(defendingDirection, 'dribble')}. Ausgespielt!${situationSuffix}`);
    } else if (action === 'through-ball') {
      setFeedback(`Richtig gerechnet. Die Abwehr liest den Steilpass, aber dein Team bleibt am Ball.${situationSuffix}`);
    } else {
      setFeedback(`Richtig! Die Abwehr liest deine Richtung, aber du behauptest den Ball und kommst weiter.${situationSuffix}`);
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
    setSituation(pendingSituation);
    setPendingSituation('normal');
    resetAnswer();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (turnLocked) nextTurn();
    else submit();
  };

  const chooseAction = (action: FootballAction) => {
    if (turnLocked) return;
    setSelectedAction(action);
    setPlayerDirection(null);
  };

  const actorDirectionClass = turnLocked && opponentDirection ? ` ${opponentDirection}` : '';
  const ballDirectionClass = playerDirection ? ` choice-${playerDirection}` : '';
  const outcomeClass = turnLocked && lastOutcome ? ` outcome-${lastOutcome}` : '';
  const actionClass = displayAction ? ` action-${displayAction}` : ' action-none';
  const startTop = TEAM_PLAYER_TOPS[lastStartPlayer] ?? 50;
  const endTop = TEAM_PLAYER_TOPS[activePlayer] ?? 50;
  const ballStyle = {
    left: `${footballBallLeft(ballPosition)}%`,
    top: `${endTop}%`,
    '--football-ball-start-left': `${footballBallLeft(lastStartBallPosition)}%`,
    '--football-ball-end-left': `${footballBallLeft(ballPosition)}%`,
    '--football-ball-start-top': `${startTop}%`,
    '--football-ball-end-top': `${endTop}%`,
  } as CSSProperties;
  const directionAction = displayAction ?? 'dribble';
  const upperOption = directionOption(directionAction, 'upper', activePlayer);
  const lowerOption = directionOption(directionAction, 'lower', activePlayer);
  const targetIndex = playerDirection && displayAction && displayAction !== 'shot' && displayAction !== 'dribble'
    ? targetPlayer(lastStartPlayer, playerDirection)
    : null;

  return <div className="football-shell" role="dialog" aria-label="Mathe Fußball">
    <header className="football-topbar">
      <button className="football-back" onClick={() => go('/home')}>Zur Spieleauswahl</button>
      <div><small>Lernhelden</small><strong>Mathe Fußball</strong></div>
      <span className="football-record">{record.wins} Siege · {record.goals} Tore</span>
    </header>

    {phase === 'select' && <main className="football-start">
      <section className="football-hero-panel">
        <p className="football-kicker">3 gegen 3 · Brüche-Liga</p>
        <h1>Rechnen. Kombinieren. Tore schießen.</h1>
        <p>Wähle einen Modus und das Match startet sofort. Mit Pass, Dribbling und Steilpass spielst du dich durch drei Gegner. Richtige Serien bauen Momentum auf und erzeugen besondere Torchancen.</p>
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

      <section className="football-gameplay-strip" aria-label={`Momentum ${momentum} von 5`}>
        <div className="football-momentum-copy"><span>Momentum</span><strong>{momentumLabel(momentum)}</strong></div>
        <div className="football-momentum-meter" aria-hidden="true">
          {[1, 2, 3, 4, 5].map(level => <span key={level} className={momentum >= level ? 'active' : ''}/>) }
        </div>
        <span className="football-format-chip">3 VS 3</span>
      </section>

      <section className={`football-pitch football-pitch-3v3 play-${displayPlayType}${outcomeClass}${actionClass} situation-${situation}`} aria-label="3 gegen 3 Spielfeld mit aktueller Ballposition">
        <div className="football-goal left" aria-hidden="true"/>
        <div className="football-goal right" aria-hidden="true"/>
        <div className="football-halfway" aria-hidden="true"/>
        <div className="football-center-circle" aria-hidden="true"/>

        {situationBanner && <div className={`football-situation-scene ${situation}`} aria-hidden="true">
          <small>{situationBanner.eyebrow}</small><strong>{situationBanner.title}</strong>
        </div>}

        {[0, 1, 2].map(index => {
          const point = teamPlayerPoint(index, ballPosition, activePlayer, displayPlayType);
          const isTarget = targetIndex === index;
          return <div
            key={`team-${index}`}
            className={`football-field-player football-team-player player-${index + 1}${activePlayer === index ? ' active' : ''}${isTarget ? ' pass-target' : ''}`}
            style={{left: `${point.left}%`, top: `${point.top}%`}}
            aria-label={`Eigener Spieler ${index + 1}${activePlayer === index ? ', am Ball' : ''}`}
          ><span>{index + 1}</span></div>;
        })}

        {[0, 1, 2].map(index => {
          const point = opponentPlayerPoint(index, ballPosition, displayPlayType);
          const isKeeper = displayPlayType === 'shot' && index === 2;
          const isPrimaryDefender = displayPlayType !== 'shot' && index === 1;
          const motionClasses = isKeeper
            ? ` football-pitch-actor football-keeper${actorDirectionClass}`
            : isPrimaryDefender ? ` football-pitch-actor football-defender${actorDirectionClass}` : '';
          return <div
            key={`opponent-${index}`}
            className={`football-field-player football-opponent-player opponent-${index + 1}${motionClasses}`}
            style={{left: `${point.left}%`, top: `${point.top}%`}}
            aria-label={isKeeper ? 'Gegnerischer Torwart' : `Gegner ${index + 1}`}
          ><span>{isKeeper ? 'TW' : `A${index + 1}`}</span></div>;
        })}

        {displayAction && displayAction !== 'shot' && playerDirection && <span className={`football-action-route route-${displayAction} route-${playerDirection}`} aria-hidden="true"/>}
        <span className={`football-ball match-ball${ballDirectionClass}`} style={ballStyle} aria-label="Ballposition"/>
      </section>

      <div className="football-progress" aria-label={`${progress} Prozent des Matches gespielt`}><span style={{width: `${progress}%`}}/></div>

      <section className="football-question-card">
        <div className="football-question-meta"><span>{question.category}</span><strong>Aktion {answered + (turnLocked ? 0 : 1)} von {FOOTBALL_MATCH_QUESTIONS}</strong></div>
        <div className="football-question"><SchoolFractionExpression text={question.prompt}/></div>

        {currentPlayType !== 'shot' && <div className="football-action-selector">
          <div className="football-tactic-copy"><small>Dein Spielzug</small><strong>Welche Aktion spielst du?</strong></div>
          <div className="football-action-grid">
            {footballActions.map(action => <button
              type="button"
              key={action.id}
              disabled={turnLocked}
              className={selectedAction === action.id ? 'selected' : ''}
              onClick={() => chooseAction(action.id)}
            >
              <span className="football-action-mark">{action.short}</span>
              <span><strong>{action.title}</strong><small>{action.description}</small></span>
            </button>)}
          </div>
        </div>}

        {(currentPlayType === 'shot' || selectedAction) && <div className={`football-tactic ${displayPlayType} tactical-${displayAction ?? 'none'}`}>
          <div className="football-tactic-copy">
            <small>{displayPlayType === 'shot' ? situation === 'normal' ? 'Torchance' : 'Sondersituation' : selectedAction === 'pass' ? 'Passziel' : selectedAction === 'through-ball' ? 'Laufweg' : 'Duell'}</small>
            <strong>{displayPlayType === 'shot' ? shotPrompt(situation) : selectedAction === 'pass' ? 'Wen spielst du an?' : selectedAction === 'through-ball' ? 'In welchen Raum spielst du?' : 'Wo gehst du an der Abwehr vorbei?'}</strong>
          </div>
          <div className="football-tactic-grid">
            <button type="button" disabled={turnLocked} className={playerDirection === 'upper' ? 'selected' : ''} onClick={() => setPlayerDirection('upper')}>
              <span className="football-direction-mark">{upperOption.mark}</span>
              <span><strong>{upperOption.title}</strong><small>{upperOption.hint}</small></span>
            </button>
            <button type="button" disabled={turnLocked} className={playerDirection === 'lower' ? 'selected' : ''} onClick={() => setPlayerDirection('lower')}>
              <span className="football-direction-mark">{lowerOption.mark}</span>
              <span><strong>{lowerOption.title}</strong><small>{lowerOption.hint}</small></span>
            </button>
          </div>
        </div>}

        <form className="football-answer" onSubmit={handleSubmit}>
          <div className="football-answer-value">
            <label className="football-whole-input">
              <span>Ganze</span>
              <input aria-label="Ganze Zahl" inputMode="numeric" pattern="-?[0-9]*" value={whole} onChange={event => setWhole(event.target.value)} disabled={turnLocked}/>
            </label>
            <div className="football-fraction-input">
              <input aria-label="Zähler" inputMode="numeric" pattern="-?[0-9]*" value={numerator} onChange={event => setNumerator(event.target.value)} disabled={turnLocked}/>
              <span/>
              <input aria-label="Nenner" inputMode="numeric" pattern="-?[0-9]*" value={denominator} onChange={event => setDenominator(event.target.value)} disabled={turnLocked}/>
            </div>
          </div>
          <button className="football-primary" disabled={!turnLocked && ((currentPlayType !== 'shot' && !selectedAction) || !playerDirection || !numerator.trim() || !denominator.trim())} type="submit">
            {turnLocked ? answered >= FOOTBALL_MATCH_QUESTIONS ? 'Ergebnis anzeigen' : 'Nächste Aktion' : currentPlayType === 'shot' ? 'Abschluss ausführen' : 'Spielzug ausführen'}
          </button>
        </form>
        {!turnLocked && currentPlayType !== 'shot' && !selectedAction && <p className="football-action-hint">Wähle Pass, Dribbling oder Steilpass.</p>}
        {!turnLocked && (currentPlayType === 'shot' || selectedAction) && !playerDirection && <p className="football-action-hint">Wähle jetzt Ziel, Laufweg oder Schussecke.</p>}
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
