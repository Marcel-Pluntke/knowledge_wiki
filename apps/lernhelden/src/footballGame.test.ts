import {describe, expect, it} from 'vitest';
import {footballBallLeft, footballPlayType, resolveFootballPlay, splitFractionExpression} from './footballGame';

describe('football match logic', () => {
  it('rewards choosing the free lane after a correct answer', () => {
    expect(resolveFootballPlay(0, true, 'upper', 'lower')).toEqual({
      ballPosition: 2,
      playerGoal: false,
      opponentGoal: false,
      playType: 'dribble',
      outcome: 'breakthrough',
    });
  });

  it('still advances when the defender reads the lane', () => {
    expect(resolveFootballPlay(0, true, 'upper', 'upper').ballPosition).toBe(1);
  });

  it('turns the attacking third into a shot choice', () => {
    expect(footballPlayType(2)).toBe('shot');
    expect(resolveFootballPlay(2, true, 'upper', 'lower').outcome).toBe('goal');
  });

  it('lets a correctly diving keeper save some shots', () => {
    expect(resolveFootballPlay(2, true, 'upper', 'upper', () => 0.2)).toMatchObject({ballPosition: 1, outcome: 'saved'});
  });

  it('still allows a well-placed shot to score when the keeper guesses the corner', () => {
    expect(resolveFootballPlay(2, true, 'upper', 'upper', () => 0.9)).toMatchObject({ballPosition: 0, playerGoal: true, outcome: 'goal'});
  });

  it('scores for the opponent after enough wrong answers', () => {
    expect(resolveFootballPlay(-2, false, 'upper', 'lower')).toMatchObject({
      ballPosition: 0,
      opponentGoal: true,
      outcome: 'opponent-goal',
    });
  });

  it('keeps the ball marker inside the pitch', () => {
    expect(footballBallLeft(-10)).toBe(16);
    expect(footballBallLeft(10)).toBe(84);
  });
});

describe('school fraction rendering data', () => {
  it('splits normal fraction expressions into stacked fraction parts', () => {
    expect(splitFractionExpression('2/7 + 3/7')).toEqual([
      {kind: 'fraction', numerator: '2', denominator: '7', whole: undefined},
      {kind: 'text', text: ' + '},
      {kind: 'fraction', numerator: '3', denominator: '7', whole: undefined},
    ]);
  });

  it('keeps whole numbers attached to mixed fractions', () => {
    expect(splitFractionExpression('1 2/3 − 1/4')[0]).toEqual({
      kind: 'fraction',
      whole: '1',
      numerator: '2',
      denominator: '3',
    });
  });
});
