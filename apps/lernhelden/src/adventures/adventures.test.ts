import {describe,expect,it} from 'vitest';
import {adventures} from './index';

describe('adventure contract',()=>{
  it('uses unique stable ids and complete content',()=>{const ids=adventures.map(item=>item.id);expect(new Set(ids).size).toBe(ids.length);for(const adventure of adventures){expect(adventure.modes.length).toBeGreaterThan(0);expect(adventure.items.length).toBeGreaterThan(0);expect(adventure.enemies.length).toBeGreaterThan(0);expect(adventure.world.encounters.length).toBeGreaterThan(0);expect(adventure.merchant.name).toBeTruthy()}});
  it('uses isolated sprites and a distinct visual for every item',()=>{for(const adventure of adventures){const refs=[adventure.currency.sprite,...adventure.enemies.map(enemy=>enemy.sprite)];expect(new Set(refs.map(ref=>ref.id)).size).toBe(refs.length);for(const ref of refs)expect(ref.src).toMatch(/^assets\/sprites\/[a-z0-9-]+\.png$/);expect(new Set(adventure.items.map(item=>item.visual.id)).size).toBe(adventure.items.length);expect(adventure.items.every(item=>item.visual.id===item.id)).toBe(true)}});
  it('creates valid questions for every mode',()=>{for(const adventure of adventures)for(const mode of adventure.modes){const question=adventure.questionProvider.next({modeId:mode.id,sequence:1,random:()=>.42});expect(adventure.questionProvider.evaluate(question,question.answer)).toBe(true)}});
  it('provides the full 24-week campaign and ten item tiers',()=>{for(const adventure of adventures){expect(adventure.campaign).toHaveLength(12);expect(new Set(adventure.items.map(item=>item.tier)).size).toBe(10);for(const chapter of adventure.campaign??[]){expect(chapter.missions).toHaveLength(6);expect(chapter.eliteEnemyId).toBeTruthy();expect(chapter.bossEnemyId).toBeTruthy()}}});
  it('limits decimal practice and its campaign missions to the six approved task types',()=>{
    const decimals = adventures.find(adventure=>adventure.id==='decimals')!;
    const allowed = ['add','sub','mul','div','shift','convert'];
    expect(decimals.modes.map(mode=>mode.id)).toEqual(allowed);
    expect(decimals.campaign?.flatMap(chapter=>chapter.missions.map(mission=>mission.modeId)).every(mode=>allowed.includes(mode))).toBe(true);
    for(const modeId of allowed){
      const question = decimals.questionProvider.next({modeId,sequence:1,random:()=>.42,chapter:1});
      expect(question.inputKind).toBe('decimal');
      expect(decimals.questionProvider.evaluate(question,question.answer)).toBe(true);
    }
  });
  it('stages fraction addition and subtraction with mixed numbers from chapter two',()=>{
    const fractions=adventures.find(adventure=>adventure.id==='fractions')!;
    const denominators=(prompt:string)=>[...prompt.matchAll(/\d+\/(\d+)/g)].map(match=>match[1]);
    for(const modeId of ['add','sub']){
      const chapterOne=fractions.questionProvider.next({modeId,sequence:1,random:()=>0,chapter:1});
      expect(chapterOne.prompt).not.toMatch(/\d+ \d+\/\d+/);
      expect(new Set(denominators(chapterOne.prompt)).size).toBe(1);

      const same=fractions.questionProvider.next({modeId,sequence:2,random:()=>0,chapter:2});
      const different=fractions.questionProvider.next({modeId,sequence:3,random:()=>.9,chapter:2});
      expect(same.prompt).toMatch(/\d+ \d+\/\d+/);
      expect(different.prompt).toMatch(/\d+ \d+\/\d+/);
      expect(new Set(denominators(same.prompt)).size).toBe(1);
      expect(new Set(denominators(different.prompt)).size).toBe(2);
      expect(same.numerator).toBeGreaterThanOrEqual(0);
      expect(different.numerator).toBeGreaterThanOrEqual(0);
      expect(fractions.questionProvider.evaluate(same,same.answer)).toBe(true);
      expect(fractions.questionProvider.evaluate(different,different.answer)).toBe(true);
    }
  });
});
