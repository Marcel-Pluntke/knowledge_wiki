import {describe,expect,it} from 'vitest';
import {adventures} from './index';

describe('adventure contract',()=>{
  it('uses unique stable ids and complete content',()=>{const ids=adventures.map(item=>item.id);expect(new Set(ids).size).toBe(ids.length);for(const adventure of adventures){expect(adventure.modes.length).toBeGreaterThan(0);expect(adventure.items.length).toBeGreaterThan(0);expect(adventure.enemies.length).toBeGreaterThan(0);expect(adventure.world.encounters.length).toBeGreaterThan(0);expect(adventure.merchant.name).toBeTruthy()}});
  it('uses isolated sprites and a distinct visual for every item',()=>{for(const adventure of adventures){const refs=[adventure.currency.sprite,...adventure.enemies.map(enemy=>enemy.sprite)];expect(new Set(refs.map(ref=>ref.id)).size).toBe(refs.length);for(const ref of refs)expect(ref.src).toMatch(/^assets\/sprites\/[a-z0-9-]+\.png$/);expect(new Set(adventure.items.map(item=>item.visual.id)).size).toBe(adventure.items.length);expect(adventure.items.every(item=>item.visual.id===item.id)).toBe(true)}});
  it('creates valid questions for every mode',()=>{for(const adventure of adventures)for(const mode of adventure.modes){const question=adventure.questionProvider.next({modeId:mode.id,sequence:1,random:()=>.42});expect(adventure.questionProvider.evaluate(question,question.answer)).toBe(true)}});
});
