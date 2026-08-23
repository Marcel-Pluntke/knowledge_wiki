export const FOOTBALL_MATCH_QUESTIONS = 10;
export const FOOTBALL_KEEPER_SAVE_WHEN_GUESSED_CHANCE = 0.6;

export type FootballDirection = 'upper' | 'lower';
export type FootballPlayType = 'dribble' | 'shot';
export type FootballAction = 'pass' | 'dribble' | 'through-ball';
export type FootballSituation = 'normal' | 'big-chance' | 'free-kick' | 'one-on-one' | 'counter';
export type FootballOutcome =
  | 'advance'
  | 'breakthrough'
  | 'pass-complete'
  | 'through-ball'
  | 'goal'
  | 'saved'
  | 'lost'
  | 'opponent-goal';

export interface FootballPlayResult {
  ballPosition: number;
  playerGoal: boolean;
  opponentGoal: boolean;
  playType: FootballPlayType;
  outcome: FootballOutcome;
}

export interface FootballActionResult extends FootballPlayResult {
  action: FootballAction | 'shot';
  momentum: number;
  nextSituation: FootballSituation;
}

export type FractionExpressionPart =
  | {kind: 'text'; text: string}
  | {kind: 'fraction'; whole?: string; numerator: string; denominator: string};

export function footballPlayType(
  ballPosition: number,
  situation: FootballSituation = 'normal',
): FootballPlayType {
  if (situation === 'big-chance' || situation === 'free-kick' || situation === 'one-on-one') return 'shot';
  return ballPosition >= 2 ? 'shot' : 'dribble';
}

export function nextFootballMomentum(momentum: number, correct: boolean): number {
  return correct ? Math.min(5, momentum + 1) : 0;
}

function keeperSaveChance(situation: FootballSituation): number {
  if (situation === 'one-on-one') return 0.2;
  if (situation === 'big-chance') return 0.35;
  if (situation === 'free-kick') return 0.45;
  return FOOTBALL_KEEPER_SAVE_WHEN_GUESSED_CHANCE;
}

function resolveShot(
  ballPosition: number,
  playerDirection: FootballDirection,
  opponentDirection: FootballDirection,
  situation: FootballSituation,
  random: () => number,
): FootballPlayResult {
  const keeperGuessedCorner = playerDirection === opponentDirection;
  const keeperSaves = keeperGuessedCorner && random() < keeperSaveChance(situation);
  if (!keeperSaves) {
    return {ballPosition: 0, playerGoal: true, opponentGoal: false, playType: 'shot', outcome: 'goal'};
  }
  return {ballPosition: 1, playerGoal: false, opponentGoal: false, playType: 'shot', outcome: 'saved'};
}

export function resolveFootballPlay(
  ballPosition: number,
  correct: boolean,
  playerDirection: FootballDirection,
  opponentDirection: FootballDirection,
  random: () => number = Math.random,
): FootballPlayResult {
  const playType = footballPlayType(ballPosition);

  if (!correct) {
    const nextPosition = ballPosition - 1;
    if (nextPosition <= -3) {
      return {ballPosition: 0, playerGoal: false, opponentGoal: true, playType, outcome: 'opponent-goal'};
    }
    return {ballPosition: nextPosition, playerGoal: false, opponentGoal: false, playType, outcome: 'lost'};
  }

  if (playType === 'shot') return resolveShot(ballPosition, playerDirection, opponentDirection, 'normal', random);

  const defenderBeaten = playerDirection !== opponentDirection;
  const nextPosition = Math.min(2, ballPosition + (defenderBeaten ? 2 : 1));
  return {
    ballPosition: nextPosition,
    playerGoal: false,
    opponentGoal: false,
    playType,
    outcome: defenderBeaten ? 'breakthrough' : 'advance',
  };
}

export function resolveFootballAction(
  ballPosition: number,
  correct: boolean,
  action: FootballAction,
  playerDirection: FootballDirection,
  opponentDirection: FootballDirection,
  momentum: number,
  situation: FootballSituation = 'normal',
  random: () => number = Math.random,
): FootballActionResult {
  const playType = footballPlayType(ballPosition, situation);
  const nextMomentum = nextFootballMomentum(momentum, correct);
  const effectiveAction: FootballAction | 'shot' = playType === 'shot' ? 'shot' : action;

  if (!correct) {
    const fieldLoss = playType === 'shot' ? 1 : action === 'through-ball' ? 2 : 1;
    const nextPosition = ballPosition - fieldLoss;
    if (nextPosition <= -3) {
      return {
        ballPosition: 0,
        playerGoal: false,
        opponentGoal: true,
        playType,
        outcome: 'opponent-goal',
        action: effectiveAction,
        momentum: 0,
        nextSituation: 'normal',
      };
    }
    return {
      ballPosition: nextPosition,
      playerGoal: false,
      opponentGoal: false,
      playType,
      outcome: 'lost',
      action: effectiveAction,
      momentum: 0,
      nextSituation: 'counter',
    };
  }

  if (playType === 'shot') {
    const shot = resolveShot(ballPosition, playerDirection, opponentDirection, situation, random);
    return {
      ...shot,
      action: 'shot',
      momentum: nextMomentum,
      nextSituation: shot.outcome === 'saved' && nextMomentum >= 4 ? 'big-chance' : 'normal',
    };
  }

  const defenderBeaten = playerDirection !== opponentDirection;
  let nextPosition = ballPosition;
  let outcome: FootballOutcome = 'advance';

  if (action === 'pass') {
    nextPosition = Math.min(2, ballPosition + 1);
    outcome = 'pass-complete';
  } else if (action === 'dribble') {
    nextPosition = Math.min(2, ballPosition + (defenderBeaten ? 2 : 1));
    outcome = defenderBeaten ? 'breakthrough' : 'advance';
  } else {
    nextPosition = Math.min(2, ballPosition + (defenderBeaten ? 2 : nextMomentum >= 2 ? 1 : 0));
    outcome = defenderBeaten ? 'through-ball' : 'advance';
  }

  let nextSituation: FootballSituation = 'normal';
  const defenderStopsDribble = action === 'dribble' && !defenderBeaten;
  if (defenderStopsDribble && random() < 0.28) {
    nextSituation = 'free-kick';
  } else if (nextMomentum >= 4 && nextPosition >= 1) {
    nextSituation = 'one-on-one';
  } else if (nextMomentum >= 3 && nextPosition >= 1) {
    nextSituation = 'big-chance';
  }

  return {
    ballPosition: nextPosition,
    playerGoal: false,
    opponentGoal: false,
    playType,
    outcome,
    action,
    momentum: nextMomentum,
    nextSituation,
  };
}

export function footballBallLeft(ballPosition: number): number {
  return Math.max(16, Math.min(84, 50 + ballPosition * 17));
}

export function splitFractionExpression(text: string): FractionExpressionPart[] {
  const parts: FractionExpressionPart[] = [];
  const fractionPattern = /(?:(-?\d+)\s+)?(-?\d+)\/(-?\d+)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(fractionPattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) parts.push({kind: 'text', text: text.slice(lastIndex, index)});
    parts.push({
      kind: 'fraction',
      whole: match[1] || undefined,
      numerator: match[2],
      denominator: match[3],
    });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) parts.push({kind: 'text', text: text.slice(lastIndex)});
  return parts.length ? parts : [{kind: 'text', text}];
}
