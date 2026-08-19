export const FOOTBALL_MATCH_QUESTIONS = 10;

export type FootballDirection = 'upper' | 'lower';
export type FootballPlayType = 'dribble' | 'shot';
export type FootballOutcome = 'advance' | 'breakthrough' | 'goal' | 'saved' | 'lost' | 'opponent-goal';

export interface FootballPlayResult {
  ballPosition: number;
  playerGoal: boolean;
  opponentGoal: boolean;
  playType: FootballPlayType;
  outcome: FootballOutcome;
}

export type FractionExpressionPart =
  | {kind: 'text'; text: string}
  | {kind: 'fraction'; whole?: string; numerator: string; denominator: string};

export function footballPlayType(ballPosition: number): FootballPlayType {
  return ballPosition >= 2 ? 'shot' : 'dribble';
}

export function resolveFootballPlay(
  ballPosition: number,
  correct: boolean,
  playerDirection: FootballDirection,
  opponentDirection: FootballDirection,
): FootballPlayResult {
  const playType = footballPlayType(ballPosition);

  if (!correct) {
    const nextPosition = ballPosition - 1;
    if (nextPosition <= -3) {
      return {ballPosition: 0, playerGoal: false, opponentGoal: true, playType, outcome: 'opponent-goal'};
    }
    return {ballPosition: nextPosition, playerGoal: false, opponentGoal: false, playType, outcome: 'lost'};
  }

  if (playType === 'shot') {
    if (playerDirection !== opponentDirection) {
      return {ballPosition: 0, playerGoal: true, opponentGoal: false, playType, outcome: 'goal'};
    }
    return {ballPosition: 1, playerGoal: false, opponentGoal: false, playType, outcome: 'saved'};
  }

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
