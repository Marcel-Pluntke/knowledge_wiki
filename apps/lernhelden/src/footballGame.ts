export const FOOTBALL_MATCH_QUESTIONS = 10;

export interface FootballTurnResult {
  ballPosition: number;
  playerGoal: boolean;
  opponentGoal: boolean;
}

export function resolveFootballTurn(ballPosition: number, correct: boolean): FootballTurnResult {
  const nextPosition = ballPosition + (correct ? 1 : -1);
  if (nextPosition >= 3) return {ballPosition: 0, playerGoal: true, opponentGoal: false};
  if (nextPosition <= -3) return {ballPosition: 0, playerGoal: false, opponentGoal: true};
  return {ballPosition: nextPosition, playerGoal: false, opponentGoal: false};
}

export function footballBallLeft(ballPosition: number): number {
  return Math.max(16, Math.min(84, 50 + ballPosition * 17));
}
