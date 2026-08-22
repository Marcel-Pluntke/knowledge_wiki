import {describe,expect,it} from 'vitest';
import {adventures} from './index';
import {fractionMixedRate} from './fractions';
import {curriculumModeIds,englishNumber,numberItems,spellingItems,teacherItems} from './vocabulary-curriculum';

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
  it('keeps the first six campaign weeks free of mixed numbers',()=>{
    const fractions=adventures.find(adventure=>adventure.id==='fractions')!;
    const denominators=(prompt:string)=>[...prompt.matchAll(/\d+\/(\d+)/g)].map(match=>match[1]);
    for(const modeId of ['add','sub']){
      for(const chapter of [1,2,3])for(const randomValue of [0,.1,.4,.9]){
        const question=fractions.questionProvider.next({modeId,sequence:chapter,random:()=>randomValue,chapter});
        expect(question.prompt).not.toMatch(/\d+ \d+\/\d+/);
        expect(fractions.questionProvider.evaluate(question,question.answer)).toBe(true);
      }
      const same=fractions.questionProvider.next({modeId,sequence:20,random:()=>0,chapter:2});
      const different=fractions.questionProvider.next({modeId,sequence:21,random:()=>.9,chapter:2});
      expect(new Set(denominators(same.prompt)).size).toBe(1);
      expect(new Set(denominators(different.prompt)).size).toBe(2);
    }
  });

  it('introduces mixed numbers with the staged campaign rates and difficulty',()=>{
    const fractions=adventures.find(adventure=>adventure.id==='fractions')!;
    expect([1,2,3,4,5,6,7,12].map(fractionMixedRate)).toEqual([0,0,0,.2,.35,.5,.65,.65]);
    for(const [chapter,rate] of [[4,.2],[5,.35],[6,.5],[7,.65]] as const){
      const mixed=fractions.questionProvider.next({modeId:'add',sequence:chapter,random:()=>rate-.01,chapter});
      const proper=fractions.questionProvider.next({modeId:'add',sequence:chapter+20,random:()=>rate+.01,chapter});
      expect(mixed.prompt).toMatch(/\d+ \d+\/\d+/);
      expect(proper.prompt).not.toMatch(/\d+ \d+\/\d+/);
      if(chapter<=6)expect(mixed.prompt.match(/\d+ \d+\/\d+/g)).toHaveLength(1);
    }
    const early=fractions.questionProvider.next({modeId:'add',sequence:30,random:()=>.1,chapter:4});
    const middle=fractions.questionProvider.next({modeId:'add',sequence:31,random:()=>.49,chapter:6});
    const late=fractions.questionProvider.next({modeId:'add',sequence:32,random:()=>.1,chapter:7});
    expect(early.prompt.match(/\d+ \d+\/\d+/g)).toHaveLength(1);
    expect(early.prompt).toMatch(/\b1 \d+\/\d+/);
    expect(middle.prompt.match(/\d+ \d+\/\d+/g)).toHaveLength(1);
    expect([...middle.prompt.matchAll(/(\d+) \d+\/\d+/g)].every(match=>Number(match[1])<=2)).toBe(true);
    expect(late.prompt.match(/\d+ \d+\/\d+/g)).toHaveLength(2);
    expect([...late.prompt.matchAll(/(\d+) \d+\/\d+/g)].every(match=>Number(match[1])<=3)).toBe(true);
  });

  it('offers targeted proper-only and mixed-number fraction practice',()=>{
    const fractions=adventures.find(adventure=>adventure.id==='fractions')!;
    for(const modeId of ['add','sub']){
      const proper=fractions.questionProvider.next({modeId:`${modeId}:proper`,sequence:1,random:()=>.1});
      const mixed=fractions.questionProvider.next({modeId:`${modeId}:mixed`,sequence:2,random:()=>.9});
      expect(proper.prompt).not.toMatch(/\d+ \d+\/\d+/);
      expect(mixed.prompt.match(/\d+ \d+\/\d+/g)).toHaveLength(1);
      expect(mixed.prompt).toMatch(/\b1 \d+\/\d+/);
      expect(fractions.questionProvider.evaluate(proper,proper.answer)).toBe(true);
      expect(fractions.questionProvider.evaluate(mixed,mixed.answer)).toBe(true);
    }
  });

  it('provides the complete grade-five vocabulary curriculum',()=>{
    const vocabulary=adventures.find(adventure=>adventure.id==='vocabulary')!;
    expect(spellingItems.length).toBeGreaterThan(160);
    expect(new Set(spellingItems.map(item=>item.id)).size).toBe(spellingItems.length);
    expect(new Set(spellingItems.map(item=>item.category))).toEqual(new Set(['Schule','Familie und Freunde','Haus und Zuhause','Tagesablauf und Zeit','Kleidung','Freizeit','Einkaufen','Haustiere und Tiere','Körper und Gesundheit','Essen und Trinken','Farben','Begegnungen']));
    expect(spellingItems.map(item=>item.en)).toEqual(expect.arrayContaining(['chair','classroom','family','living room','go to school','trousers','football','pound','rabbit','doctor','breakfast','thank you']));
    expect(numberItems.map(item=>item.en)).toEqual('one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|twenty-one|twenty-two|twenty-three|twenty-four|twenty-five|twenty-six|twenty-seven|twenty-eight|twenty-nine|thirty|thirty-one|thirty-two|thirty-three|thirty-four|thirty-five|thirty-six|thirty-seven|thirty-eight|thirty-nine|forty|forty-one|forty-two|forty-three|forty-four|forty-five|forty-six|forty-seven|forty-eight|forty-nine|fifty'.split('|'));
    expect(numberItems.map(item=>item.en)).toEqual(Array.from({length:50},(_,index)=>englishNumber(index+1)));
    expect(englishNumber(21)).toBe('twenty-one');
    expect(englishNumber(40)).toBe('forty');
    expect(teacherItems.map(item=>item.en)).toEqual(["Open your textbook on page eighteen.","Read the task.","Listen to the recording.","Close your workbook.","Write down the headline into your folder.","Write down five sentences into your exercise book.","Repeat after me.","Look at the picture.","Watch the video clip.","Compare your results to your bank neighbour's.","Do the task in your folder.","Talk to your bank neighbour.","Use a pencil."]);
    expect(vocabulary.curriculum?.grades[0]).toMatchObject({id:'grade-5',status:'released'});
    expect(vocabulary.curriculum?.grades[0].chapters.some(chapter=>chapter.id==='basics')).toBe(true);
  });

  it('guarantees writing, German-to-English choice and English-to-German choice in every curriculum mode',()=>{
    const vocabulary=adventures.find(adventure=>adventure.id==='vocabulary')!;
    for(const modeId of [curriculumModeIds.spelling,curriculumModeIds.numbers,curriculumModeIds.teachers,curriculumModeIds.mix]){
      const questions=[1,2,3].map(sequence=>vocabulary.questionProvider.next({modeId,sequence,random:()=>0}));
      expect(questions.map(question=>question.inputKind)).toEqual(['text','choice','choice']);
      expect(questions[0].category).toContain('Schreiben');
      expect(questions[1].category).toContain('Deutsch → Englisch');
      expect(questions[2].category).toContain('Englisch → Deutsch');
      expect(questions.every(question=>vocabulary.questionProvider.evaluate(question,question.answer))).toBe(true);
    }
  });

  it('evaluates typed curriculum answers in a learner-friendly way',()=>{
    const vocabulary=adventures.find(adventure=>adventure.id==='vocabulary')!;
    const pupilIndex=spellingItems.findIndex(item=>item.en==='pupil');
    const spelling=vocabulary.questionProvider.next({modeId:curriculumModeIds.spelling,sequence:1,random:()=>(pupilIndex+.01)/spellingItems.length});
    expect(spelling.answer).toBe('pupil');
    expect(vocabulary.questionProvider.evaluate(spelling,' STUDENT! ')).toBe(true);
    const number=vocabulary.questionProvider.next({modeId:curriculumModeIds.numbers,sequence:1,random:()=>.41});
    expect(number.answer).toBe('twenty-one');
    expect(vocabulary.questionProvider.evaluate(number,'Twenty one')).toBe(true);
    const teacher=vocabulary.questionProvider.next({modeId:curriculumModeIds.teachers,sequence:1,random:()=>.72});
    expect(teacher.answer).toContain('bank neighbour');
    expect(vocabulary.questionProvider.evaluate(teacher,"compare your results to your bank neighbor's")).toBe(true);
  });

  it('never selects the same vocabulary item twice in a row',()=>{
    const vocabulary=adventures.find(adventure=>adventure.id==='vocabulary')!;
    for(const modeId of ['de-en',curriculumModeIds.spelling]){
      const first=vocabulary.questionProvider.next({modeId,sequence:1,random:()=>0});
      const second=vocabulary.questionProvider.next({modeId,sequence:2,random:()=>0,previousLearningKey:first.learningKey});
      expect(second.learningKey).not.toBe(first.learningKey);
      expect(second.prompt).not.toBe(first.prompt);
    }
  });
});
