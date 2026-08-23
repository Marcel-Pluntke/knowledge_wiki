import {describe, expect, it} from 'vitest';
import {
  footballBallLeft,
  footballPlayType,
  nextFootballMomentum,
  resolveFootballAction,
  resolveFootballPlay,
  splitFractionExpression,
} from './footballGame';

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

  it('turns the attacking third and special situations into shots', () => {
    expect(footballPlayType(2)).toBe('shot');
    expect(footballPlayType(1, 'big-chance')).toBe('shot');
    expect(footballPlayType(0, 'free-kick')).toBe('shot');
  });

  it('keeps a normal guessed shot saveable but makes one-on-one chances stronger', () => {
    expect(resolveFootballAction(2, true, 'pass', 'upper', 'upper', 0, 'normal', () => 0.3).outcome).toBe('saved');
    expect(resolveFootballAction(1, true, 'pass', 'upper', 'upper', 4, 'one-on-one', () => 0.3).outcome).toBe('goal');
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

describe('football action gameplay', () => {
  it('builds momentum on correct answers and resets it on mistakes', () => {
    expect(nextFootballMomentum(0, true)).toBe(1);
    expect(nextFootballMomentum(4, true)).toBe(5);
    expect(nextFootballMomentum(5, true)).toBe(5);
    expect(nextFootballMomentum(4, false)).toBe(0);
  });

  it('makes a pass the safe one-zone option', () => {
    expect(resolveFootballAction(0, true, 'pass', 'upper', 'upper', 0, 'normal', () => 0.99)).toMatchObject({
      ballPosition: 1,
      outcome: 'pass-complete',
      momentum: 1,
      nextSituation: 'normal',
    });
  });

  it('lets a successful through ball create an immediate shot', () => {
    expect(resolveFootballAction(0, true, 'through-ball', 'upper', 'lower', 0, 'normal', () => 0.99)).toMatchObject({
      ballPosition: 2,
      outcome: 'through-ball',
    });
  });

  it('turns a three-answer streak into a big chance', () => {
    expect(resolveFootballAction(0, true, 'pass', 'upper', 'upper', 2, 'normal', () => 0.99)).toMatchObject({
      ballPosition: 1,
      momentum: 3,
      nextSituation: 'big-chance',
    });
  });

  it('turns a four-answer streak into a one-on-one', () => {
    expect(resolveFootballAction(0, true, 'pass', 'lower', 'upper', 3, 'normal', () => 0.99)).toMatchObject({
      momentum: 4,
      nextSituation: 'one-on-one',
    });
  });

  it('can award a free kick when a correct dribble is stopped', () => {
    expect(resolveFootballAction(0, true, 'dribble', 'upper', 'upper', 0, 'normal', () => 0.1)).toMatchObject({
      nextSituation: 'free-kick',
    });
  });

  it('punishes a wrong through ball more strongly', () => {
    expect(resolveFootballAction(0, false, 'through-ball', 'upper', 'lower', 2)).toMatchObject({
      ballPosition: -2,
      momentum: 0,
      nextSituation: 'counter',
    });
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
