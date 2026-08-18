import {describe,expect,it} from 'vitest';
import type {Question} from '@lernhelden/engine';
import {advanceBattlePhase, companionStage, companions, detectedPhase, focusHelp, phasesFor} from './battlePresentation';

describe('battle presentation',()=>{
  it('uses two monotonic phases for normal enemies',()=>{
    expect(phasesFor('normal').map(phase=>phase.label)).toEqual(['Verteidigung','Verwundbar']);
    expect(detectedPhase(51,100,'normal')).toBe(0);
    expect(detectedPhase(50,100,'normal')).toBe(1);
    expect(advanceBattlePhase(1,90,100,'normal')).toBe(1);
  });

  it('uses three monotonic phases for elite and boss enemies',()=>{
    for(const kind of ['elite','boss'] as const){
      expect(phasesFor(kind)).toHaveLength(3);
      expect(detectedPhase(67,100,kind)).toBe(0);
      expect(detectedPhase(66,100,kind)).toBe(1);
      expect(detectedPhase(34,100,kind)).toBe(1);
      expect(detectedPhase(33,100,kind)).toBe(2);
      expect(advanceBattlePhase(2,100,100,kind)).toBe(2);
    }
  });

  it('derives three companion stages from mastered learning keys',()=>{
    const record=(box:1|2|3|4|5)=>({correct:2,wrong:0,box,dueAt:0});
    expect(companionStage({})).toBe(1);
    expect(companionStage({one:record(3),two:record(2)})).toBe(2);
    expect(companionStage({one:record(3),two:record(4),three:record(5)})).toBe(3);
  });

  it('uses twelve original pose sprites instead of enemy sprites',()=>{
    const sprites=Object.values(companions).flatMap(companion=>Object.values(companion.sprites));
    expect(sprites).toHaveLength(12);
    expect(new Set(sprites.map(sprite=>sprite.id)).size).toBe(12);
    expect(sprites.every(sprite=>sprite.id.startsWith('companion-'))).toBe(true);
    expect(sprites.some(sprite=>/basilisk|slime|skeleton/.test(sprite.id))).toBe(false);
  });

  it('builds visual focus help without exposing the complete solution',()=>{
    const base:Question={id:'q',inputKind:'text',prompt:'',answer:'',hintSteps:[]};
    const fraction=focusHelp({...base,inputKind:'fraction',prompt:'1/3 + 2/5',answer:'11/15'});
    const decimal=focusHelp({...base,inputKind:'decimal',prompt:'2,4 + 1,3',answer:'3,7'});
    const word=focusHelp({...base,inputKind:'text',prompt:'Translate',answer:'green dragon'});
    expect(fraction).toMatchObject({kind:'fraction',values:['3','5']});
    expect(decimal).toMatchObject({kind:'decimal',values:['2,4','1,3']});
    expect(word).toMatchObject({kind:'word',pattern:'g _ _ _ _   d _ _ _ _ _'});
    expect(JSON.stringify(fraction)).not.toContain('11/15');
    expect(JSON.stringify(decimal)).not.toContain('3,7');
    expect(JSON.stringify(word)).not.toContain('green dragon');
  });
});
