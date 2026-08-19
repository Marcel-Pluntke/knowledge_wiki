import {describe, expect, it} from 'vitest';
import {footballBallLeft, resolveFootballTurn} from './footballGame';

describe('football match logic', () => {
  it('moves toward the opponent goal after a correct answer', () => {
    expect(resolveFootballTurn(0, true)).toEqual({ballPosition: 1, playerGoal: false, opponentGoal: false});
  });

  it('scores for the player after three successful advances', () => {
    expect(resolveFootballTurn(2, true)).toEqual({ballPosition: 0, playerGoal: true, opponentGoal: false});
  });

  it('scores for the opponent after three failed advances', () => {
    expect(resolveFootballTurn(-2, false)).toEqual({ballPosition: 0, playerGoal: false, opponentGoal: true});
  });

  it('keeps the ball marker inside the pitch', () => {
    expect(footballBallLeft(-10)).toBe(16);
    expect(footballBallLeft(10)).toBe(84);
  });
});
