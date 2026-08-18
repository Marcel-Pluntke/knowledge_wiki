import {describe, expect, it} from 'vitest';
import {adventures} from './adventures';
import {collides, collisionRects, securePosition, worldScenes} from './worldMap';

describe('world map scenes',()=>{
  it('provides six safe mission landmarks and separated campaign zones for every adventure',()=>{
    for(const adventure of adventures){
      const scene=worldScenes[adventure.id];
      expect(scene.missionSites).toHaveLength(6);
      expect(new Set(scene.missionSites.map(site=>`${site.x}:${site.y}`)).size).toBe(6);
      for(const site of scene.missionSites){
        expect(site.x).toBeGreaterThan(32);
        expect(site.x).toBeLessThan(scene.missionGate.x-30);
        expect(site.y).toBeGreaterThan(70);
        expect(site.y).toBeLessThan(adventure.world.height-30);
        expect(collides(site,adventure.world.obstacles,30)).toBe(false);
        expect(adventure.world.encounters.every(encounter=>Math.hypot(encounter.x-site.x,encounter.y-site.y)>75)).toBe(true);
      }
      expect(scene.campaign.elite.x).toBeGreaterThan(scene.missionGate.x+scene.missionGate.width);
      expect(scene.campaign.elite.x).toBeLessThan(scene.bossGate.x);
      expect(scene.campaign.boss.x).toBeGreaterThan(scene.bossGate.x+scene.bossGate.width);
      for(const point of [...adventure.world.encounters,adventure.world.merchant,adventure.world.chest]){
        expect(point.x).toBeLessThan(scene.missionGate.x-20);
        expect(point.y).toBeGreaterThanOrEqual(64);
        expect(point.y).toBeLessThanOrEqual(adventure.world.height-24);
      }
    }
  });

  it('adds and removes the two physical gate colliders with progression',()=>{
    const scene=worldScenes.fractions;
    const missionCenter={x:scene.missionGate.x+12,y:scene.missionGate.y+46};
    const bossCenter={x:scene.bossGate.x+12,y:scene.bossGate.y+46};
    expect(collides(missionCenter,collisionRects(scene,[],false,false))).toBe(true);
    expect(collides(missionCenter,collisionRects(scene,[],true,false))).toBe(false);
    expect(collides(bossCenter,collisionRects(scene,[],true,false))).toBe(true);
    expect(collides(bossCenter,collisionRects(scene,[],true,true))).toBe(false);
  });

  it('returns legacy saves from newly locked regions to a safe side',()=>{
    const scene=worldScenes.fractions,start={x:90,y:420};
    expect(securePosition({x:900,y:282,mapId:'fraction-realms'},start,scene,false,false,true)).toMatchObject(start);
    expect(securePosition({x:900,y:282,mapId:'fraction-realms'},start,scene,true,false,true)).toMatchObject({x:788,y:282});
    expect(securePosition({x:900,y:282,mapId:'fraction-realms'},start,scene,true,true,true)).toMatchObject({x:900,y:282});
  });
});
