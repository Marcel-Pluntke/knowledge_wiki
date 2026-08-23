import {describe, expect, it} from 'vitest';
import {
  DEFAULT_FOOTBALL_CLUB_STATE,
  buyFootballKit,
  equipFootballKit,
  footballMatchReward,
  normalizeFootballClubState,
} from './footballClub';

describe('football club economy', () => {
  it('rewards a completed perfect winning match', () => {
    expect(footballMatchReward(10, 3, 1)).toEqual({
      base: 20,
      correct: 40,
      goals: 24,
      win: 20,
      perfect: 15,
      total: 119,
    });
  });

  it('keeps football currency and starter kit valid when loading old state', () => {
    expect(normalizeFootballClubState({coins: 42, ownedKitIds: [], equippedKitIds: ['missing', 'starter', 'missing']})).toEqual({
      coins: 42,
      ownedKitIds: ['starter'],
      equippedKitIds: ['starter', 'starter', 'starter'],
    });
  });

  it('buys a jersey once and subtracts its price', () => {
    const rich = {...DEFAULT_FOOTBALL_CLUB_STATE, coins: 200};
    const bought = buyFootballKit(rich, 'royal');
    expect(bought.coins).toBe(110);
    expect(bought.ownedKitIds).toContain('royal');
    expect(buyFootballKit(bought, 'royal')).toBe(bought);
  });

  it('equips an owned jersey independently for one of the three players', () => {
    const state = {...DEFAULT_FOOTBALL_CLUB_STATE, ownedKitIds: ['starter', 'royal']};
    const equipped = equipFootballKit(state, 1, 'royal');
    expect(equipped.equippedKitIds).toEqual(['starter', 'royal', 'starter']);
  });
});
