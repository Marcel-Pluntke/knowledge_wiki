import {act,cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {createAdventureSave,createProfile} from '@lernhelden/engine';
import type {AdventureDefinition} from '@lernhelden/engine';
import {fractionsAdventure} from './adventures/fractions';
import {vocabularyAdventure} from './adventures/vocabulary';
import {curriculumModeIds} from './adventures/vocabulary-curriculum';
import {AdventureHome,Battle,Campaign,CurriculumChapterScreen,CurriculumGradeScreen,World} from './App';
import {worldScenes} from './worldMap';

const beginBattle=()=>fireEvent.click(screen.getByRole('button',{name:'Überspringen'}));

describe('Campaign',()=>{
  beforeEach(()=>{sessionStorage.clear();vi.restoreAllMocks()});
  afterEach(cleanup);
  it('shows the boss as ready after an elite victory and unlocks the next chapter after a boss victory',()=>{
    const campaign=fractionsAdventure.campaign!.map(chapter=>({...chapter,minimumPower:0,minimumDefense:0}));
    const adventure={...fractionsAdventure,campaign} as AdventureDefinition;
    const chapter=campaign[0],nextChapter=campaign[1];
    const save=createAdventureSave(adventure);
    save.campaign.completedMissionIds=chapter.missions.map(mission=>mission.id);
    const {rerender}=render(<Campaign adventure={adventure} save={save} onSave={vi.fn().mockResolvedValue(undefined)}/>);
    expect(screen.getByText('Erst die Elite besiegen.')).toBeVisible();
    save.campaign.defeatedEliteIds=[chapter.eliteEnemyId];
    rerender(<Campaign adventure={adventure} save={save} onSave={vi.fn().mockResolvedValue(undefined)}/>);
    const firstChapterCard=screen.getByRole('heading',{name:chapter.topic}).closest('details');
    expect(firstChapterCard).not.toBeNull();
    expect(within(firstChapterCard!).getByRole('button',{name:'Kapitelboss'})).toBeEnabled();
    save.campaign.defeatedBossIds=[chapter.bossEnemyId];
    rerender(<Campaign adventure={adventure} save={save} onSave={vi.fn().mockResolvedValue(undefined)}/>);
    expect(within(screen.getByRole('heading',{name:nextChapter.topic}).closest('details')!).getByRole('button',{name:nextChapter.missions[0].title})).toBeEnabled();
    expect(within(firstChapterCard!).getByRole('button',{name:'Schatztruhe +155'})).toBeEnabled();
  });

  it('keeps a locked boss visible on the world map and explains the missing strength',()=>{
    const context={fillRect:vi.fn(),drawImage:vi.fn(),save:vi.fn(),restore:vi.fn(),fillText:vi.fn()} as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(context);
    const chapter=fractionsAdventure.campaign![0];
    const save=createAdventureSave(fractionsAdventure);
    save.campaign.completedMissionIds=chapter.missions.map(mission=>mission.id);
    save.campaign.defeatedEliteIds=[chapter.eliteEnemyId];
    save.world={...save.world,x:808,y:282};
    const {rerender}=render(<World adventure={fractionsAdventure} save={save} profile={createProfile('Testheld')} onSave={vi.fn().mockResolvedValue(undefined)}/>);
    expect(screen.getAllByText(/Stärke 0\/15 – noch 15/)).toHaveLength(2);
    fireEvent.click(screen.getByRole('button',{name:'E'}));
    expect(screen.getAllByText(/Boss gesperrt: Stärke 0\/15 – noch 15/)).toHaveLength(2);
    const readyAdventure={...fractionsAdventure,campaign:fractionsAdventure.campaign!.map(item=>({...item,minimumPower:0,minimumDefense:0}))} as AdventureDefinition;
    rerender(<World adventure={readyAdventure} save={save} profile={createProfile('Testheld')} onSave={vi.fn().mockResolvedValue(undefined)}/>);
    fireEvent.click(screen.getByRole('button',{name:'Nach rechts'}));
    fireEvent.click(screen.getByRole('button',{name:'Nach rechts'}));
    fireEvent.click(screen.getByRole('button',{name:'Nach rechts'}));
    fireEvent.click(screen.getByRole('button',{name:'E'}));
    expect(JSON.parse(sessionStorage.getItem('lernhelden:campaign:fractions')!)).toMatchObject({chapter:1,target:'boss'});
  });

  it('starts the exact map mission and keeps completed landmarks inactive',()=>{
    const context={fillRect:vi.fn(),drawImage:vi.fn(),save:vi.fn(),restore:vi.fn(),fillText:vi.fn()} as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(context);
    const chapter=fractionsAdventure.campaign![0],site=worldScenes.fractions.missionSites[1];
    const save=createAdventureSave(fractionsAdventure);
    save.world={...save.world,...site};
    const {rerender}=render(<World adventure={fractionsAdventure} save={save} profile={createProfile('Testheld')} onSave={vi.fn().mockResolvedValue(undefined)}/>);
    fireEvent.click(screen.getByRole('button',{name:'E'}));
    expect(sessionStorage.getItem('lernhelden:mode:fractions')).toBe(chapter.missions[1].modeId);
    expect(JSON.parse(sessionStorage.getItem('lernhelden:campaign:fractions')!)).toEqual({chapter:1,missionId:chapter.missions[1].id});
    sessionStorage.clear();
    save.campaign.completedMissionIds=[chapter.missions[1].id];
    rerender(<World adventure={fractionsAdventure} save={save} profile={createProfile('Testheld')} onSave={vi.fn().mockResolvedValue(undefined)}/>);
    fireEvent.click(screen.getByRole('button',{name:'E'}));
    expect(sessionStorage.getItem('lernhelden:campaign:fractions')).toBeNull();
    expect(screen.getByText(`${chapter.missions[1].title} ist bereits geschafft.`)).toBeVisible();
  });

  it('blocks the mission wall until all six missions are complete',()=>{
    const context={fillRect:vi.fn(),drawImage:vi.fn(),save:vi.fn(),restore:vi.fn(),fillText:vi.fn()} as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(context);
    const chapter=fractionsAdventure.campaign![0],save=createAdventureSave(fractionsAdventure),onSave=vi.fn().mockResolvedValue(undefined);
    save.world={...save.world,x:660,y:282};
    const {rerender}=render(<World adventure={fractionsAdventure} save={save} profile={createProfile('Testheld')} onSave={onSave}/>);
    fireEvent.click(screen.getByRole('button',{name:'Nach rechts'}));
    expect(onSave).not.toHaveBeenCalled();
    save.campaign.completedMissionIds=chapter.missions.map(mission=>mission.id);
    rerender(<World adventure={fractionsAdventure} save={save} profile={createProfile('Testheld')} onSave={onSave}/>);
    fireEvent.click(screen.getByRole('button',{name:'Nach rechts'}));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({world:expect.objectContaining({x:684,y:282})}));
  });

  it('repeats joystick movement, changes direction and persists only the final position',()=>{
    vi.useFakeTimers();
    const pointerEvent=window.PointerEvent;
    try{
      Object.defineProperty(window,'PointerEvent',{configurable:true,writable:true,value:MouseEvent});
      const context={fillRect:vi.fn(),drawImage:vi.fn(),save:vi.fn(),restore:vi.fn(),fillText:vi.fn()} as unknown as CanvasRenderingContext2D;
      vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(context);
      const save=createAdventureSave(fractionsAdventure),onSave=vi.fn().mockResolvedValue(undefined);
      render(<World adventure={fractionsAdventure} save={save} profile={createProfile('Testheld')} onSave={onSave}/>);
      const joystick=screen.getByRole('group',{name:'Bewegungssteuerung'});
      vi.spyOn(joystick,'getBoundingClientRect').mockReturnValue({x:0,y:0,left:0,top:0,right:104,bottom:104,width:104,height:104,toJSON:()=>({})});
      fireEvent.pointerDown(joystick,{pointerId:1,clientX:100,clientY:52});
      act(()=>vi.advanceTimersByTime(120));
      fireEvent.pointerMove(joystick,{pointerId:1,clientX:52,clientY:0});
      expect(onSave).not.toHaveBeenCalled();
      fireEvent.pointerUp(joystick,{pointerId:1,clientX:52,clientY:0});
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({world:expect.objectContaining({x:138,y:396})}));
      onSave.mockClear();
      fireEvent.pointerDown(joystick,{pointerId:2,clientX:0,clientY:52});
      fireEvent(window,new Event('blur'));
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({world:expect.objectContaining({x:114,y:396})}));
    }finally{Object.defineProperty(window,'PointerEvent',{configurable:true,writable:true,value:pointerEvent});vi.useRealTimers()}
  });

  it('offers proper-only and mixed-number choices for standalone fraction practice',()=>{
    const save=createAdventureSave(fractionsAdventure);
    render(<AdventureHome adventure={fractionsAdventure} save={save} profile={createProfile('Testheld')}/>);
    const addCard=screen.getByRole('heading',{name:'Zauber-Mischung'}).closest('article')!;
    const subCard=screen.getByRole('heading',{name:'Drachenbiss'}).closest('article')!;
    const multiplyCard=screen.getByRole('heading',{name:'Kristall-Kopie'}).closest('article')!;
    sessionStorage.setItem('lernhelden:campaign:fractions',JSON.stringify({chapter:2,missionId:'stale'}));
    fireEvent.click(within(addCard).getByRole('button',{name:'Mit ganzen Zahlen'}));
    expect(sessionStorage.getItem('lernhelden:mode:fractions')).toBe('add');
    expect(sessionStorage.getItem('lernhelden:practice:fractions')).toBe('mixed');
    expect(sessionStorage.getItem('lernhelden:campaign:fractions')).toBeNull();
    fireEvent.click(within(subCard).getByRole('button',{name:'Nur Brüche'}));
    expect(sessionStorage.getItem('lernhelden:mode:fractions')).toBe('sub');
    expect(sessionStorage.getItem('lernhelden:practice:fractions')).toBe('proper');
    fireEvent.click(within(multiplyCard).getByRole('button',{name:'Training starten'}));
    expect(sessionStorage.getItem('lernhelden:practice:fractions')).toBeNull();
  });

  it('ignores a stored practice choice inside campaign battles',()=>{
    vi.spyOn(Math,'random').mockReturnValue(.1);
    sessionStorage.setItem('lernhelden:mode:fractions','add');
    sessionStorage.setItem('lernhelden:practice:fractions','mixed');
    sessionStorage.setItem('lernhelden:campaign:fractions',JSON.stringify({chapter:1,missionId:'mission-fractions-1-1'}));
    const save=createAdventureSave(fractionsAdventure);
    const {container}=render(<Battle adventure={fractionsAdventure} initialSave={save} profile={createProfile('Testheld')} onSave={vi.fn().mockResolvedValue(undefined)} onProfile={vi.fn().mockResolvedValue(undefined)}/>);
    beginBattle();
    fireEvent.click(screen.getByRole('button',{name:/Funkenangriff/}));
    expect(container.querySelector('.question-card h2')?.textContent).not.toMatch(/^\d+ \d/);
  });

  it('uses a mixed-number practice choice once and then clears it',()=>{
    vi.spyOn(Math,'random').mockReturnValue(.9);
    sessionStorage.setItem('lernhelden:mode:fractions','add');
    sessionStorage.setItem('lernhelden:practice:fractions','mixed');
    const save=createAdventureSave(fractionsAdventure);
    const {container}=render(<Battle adventure={fractionsAdventure} initialSave={save} profile={createProfile('Testheld')} onSave={vi.fn().mockResolvedValue(undefined)} onProfile={vi.fn().mockResolvedValue(undefined)}/>);
    expect(sessionStorage.getItem('lernhelden:practice:fractions')).toBeNull();
    beginBattle();
    fireEvent.click(screen.getByRole('button',{name:/Funkenangriff/}));
    expect(container.querySelector('.question-card h2')?.textContent).toMatch(/^1 \d/);
  });

  it('animates a projectile and both combatants when damage is resolved',async()=>{
    vi.useFakeTimers();
    vi.spyOn(Math,'random').mockReturnValue(0);
    sessionStorage.setItem('lernhelden:mode:fractions','add');
    sessionStorage.setItem('lernhelden:campaign:fractions',JSON.stringify({chapter:2,missionId:'mission-fractions-2-1'}));
    const save=createAdventureSave(fractionsAdventure);
    const {container}=render(<Battle adventure={fractionsAdventure} initialSave={save} profile={createProfile('Testheld')} onSave={vi.fn().mockResolvedValue(undefined)} onProfile={vi.fn().mockResolvedValue(undefined)}/>);
    const battleView=within(container);
    beginBattle();
    fireEvent.click(battleView.getByRole('button',{name:/Funkenangriff/}));
    expect(container.querySelectorAll('.math-fraction')).toHaveLength(2);
    expect(container.querySelector('.mixed-fraction-input > .whole-number-field')).not.toBeNull();
    expect(container.querySelector('.mixed-fraction-input > .fraction-fields > span')).not.toBeNull();
    fireEvent.change(battleView.getByLabelText('Ganze Zahl'),{target:{value:'0'}});
    fireEvent.change(battleView.getByLabelText('Zähler'),{target:{value:'1'}});
    fireEvent.change(battleView.getByLabelText('Nenner'),{target:{value:'1'}});
    await act(async()=>{fireEvent.click(battleView.getByRole('button',{name:'Antwort prüfen'}));await Promise.resolve();});
    expect(document.activeElement).toBe(container.querySelector('.battle-stage'));
    expect(battleView.getByTestId('fighter-player')).toHaveClass('fighter-attacking');
    expect(battleView.getByTestId('fighter-enemy')).toHaveClass('fighter-hit');
    expect(battleView.getByTestId('battle-projectile')).toBeVisible();
    await act(async()=>{vi.advanceTimersByTime(560);});
    expect(battleView.getByTestId('fighter-enemy')).toHaveClass('fighter-attacking');
    expect(battleView.getByTestId('fighter-player')).toHaveClass('fighter-hit');
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('shows a two-panel comic before combat and distinguishes normal and boss phases',()=>{
    sessionStorage.setItem('lernhelden:mode:fractions','add');
    const save=createAdventureSave(fractionsAdventure);
    const {unmount}=render(<Battle adventure={fractionsAdventure} initialSave={save} profile={createProfile('Testheld')} onSave={vi.fn().mockResolvedValue(undefined)} onProfile={vi.fn().mockResolvedValue(undefined)}/>);
    expect(screen.getByRole('region',{name:'Kampf-Intro'})).toBeVisible();
    expect(screen.queryByRole('button',{name:/Funkenangriff/})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Weiter'}));
    expect(screen.getByText(/Runa:/)).toBeVisible();
    fireEvent.click(screen.getByRole('button',{name:'Kampf beginnen'}));
    expect(screen.getByText('Phase 1/2')).toBeVisible();
    unmount();

    sessionStorage.setItem('lernhelden:campaign:fractions',JSON.stringify({chapter:1,target:'boss'}));
    render(<Battle adventure={fractionsAdventure} initialSave={save} profile={createProfile('Testheld')} onSave={vi.fn().mockResolvedValue(undefined)} onProfile={vi.fn().mockResolvedValue(undefined)}/>);
    beginBattle();
    expect(screen.getByText('Phase 1/3')).toBeVisible();
    expect(screen.getByText('Schild')).toBeVisible();
  });

  it('reveals three companion hints without a penalty and records mastery after the answer',async()=>{
    vi.spyOn(Math,'random').mockReturnValue(0);
    sessionStorage.setItem('lernhelden:mode:fractions','add');
    const save=createAdventureSave(fractionsAdventure),onSave=vi.fn().mockResolvedValue(undefined);
    const {container}=render(<Battle adventure={fractionsAdventure} initialSave={save} profile={createProfile('Testheld')} onSave={onSave} onProfile={vi.fn().mockResolvedValue(undefined)}/>);
    beginBattle();
    fireEvent.click(screen.getByRole('button',{name:/Funkenangriff/}));
    fireEvent.click(screen.getByRole('button',{name:'Tipp vom Begleiter'}));
    expect(screen.getByText(/Schritt für Schritt/)).toBeVisible();
    fireEvent.click(screen.getByRole('button',{name:'Noch ein Tipp'}));
    expect(screen.getByText('Nenner im Blick')).toBeVisible();
    expect(screen.getAllByText('Nenner 2')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button',{name:'Noch ein Tipp'}));
    expect(screen.getByText(/Vollständig gekürzt/)).toBeVisible();
    expect(onSave).not.toHaveBeenCalled();

    const battleView=within(container);
    fireEvent.change(battleView.getByLabelText('Ganze Zahl'),{target:{value:'0'}});
    fireEvent.change(battleView.getByLabelText('Zähler'),{target:{value:'1'}});
    fireEvent.change(battleView.getByLabelText('Nenner'),{target:{value:'1'}});
    await act(async()=>{fireEvent.click(screen.getByRole('button',{name:'Antwort prüfen'}));await Promise.resolve()});
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({masteryByKey:expect.objectContaining({'Gleichnamige Brüche':expect.objectContaining({correct:1,box:2})})}));
  });

  it('navigates from the vocabulary grade selection to the grade-five basics chapter',()=>{
    const save=createAdventureSave(vocabularyAdventure),profile=createProfile('Testheld');
    const {unmount}=render(<AdventureHome adventure={vocabularyAdventure} save={save} profile={profile}/>);
    expect(screen.getByRole('heading',{name:'Wähle deine Klasse'})).toBeVisible();
    expect(screen.getByText('Weitere Klassen')).toBeVisible();
    fireEvent.click(screen.getByRole('button',{name:/Klasse öffnen/}));
    expect(location.hash).toBe('#/adventure/vocabulary/grade/grade-5');
    unmount();
    render(<CurriculumGradeScreen adventure={vocabularyAdventure} save={save} gradeId="grade-5"/>);
    expect(screen.getByRole('heading',{name:'Grundlagen'})).toBeVisible();
    fireEvent.click(screen.getByRole('button',{name:/Kapitel öffnen/}));
    expect(location.hash).toBe('#/adventure/vocabulary/grade/grade-5/chapter/basics');
  });

  it('unlocks the mixed basics battle after the three required victories',()=>{
    const save=createAdventureSave(vocabularyAdventure);
    const {rerender}=render(<CurriculumChapterScreen adventure={vocabularyAdventure} save={save} gradeId="grade-5" chapterId="basics"/>);
    const mixCard=screen.getByRole('heading',{name:'Gemischte Wiederholung'}).closest('article')!;
    expect(within(mixCard).getByRole('button',{name:/Wortkampf starten/})).toBeDisabled();
    const completed={...save,curriculum:{completedLessonIds:['spelling','numbers-1-50','teacher-says']}};
    rerender(<CurriculumChapterScreen adventure={vocabularyAdventure} save={completed} gradeId="grade-5" chapterId="basics"/>);
    const unlocked=screen.getByRole('heading',{name:'Gemischte Wiederholung'}).closest('article')!;
    fireEvent.click(within(unlocked).getByRole('button',{name:/Wortkampf starten/}));
    expect(JSON.parse(sessionStorage.getItem('lernhelden:curriculum:vocabulary')!)).toMatchObject({gradeId:'grade-5',chapterId:'basics',lessonId:'basics-mix',modeId:curriculumModeIds.mix});
  });

  it('records a curriculum victory and uses a text keyboard for written English',async()=>{
    vi.spyOn(Math,'random').mockReturnValue(0);
    const adventure={...vocabularyAdventure,enemies:vocabularyAdventure.enemies.map(enemy=>enemy.id==='curriculum-spelling-slime'?{...enemy,hp:1,attack:0}:enemy)} as AdventureDefinition;
    const save=createAdventureSave(adventure),onSave=vi.fn().mockResolvedValue(undefined);
    sessionStorage.setItem('lernhelden:mode:vocabulary',curriculumModeIds.spelling);
    sessionStorage.setItem('lernhelden:curriculum:vocabulary',JSON.stringify({gradeId:'grade-5',chapterId:'basics',lessonId:'spelling',modeId:curriculumModeIds.spelling,enemyId:'curriculum-spelling-slime'}));
    render(<Battle adventure={adventure} initialSave={save} profile={createProfile('Testheld')} onSave={onSave} onProfile={vi.fn().mockResolvedValue(undefined)}/>);
    beginBattle();
    fireEvent.click(screen.getByRole('button',{name:/Funkenangriff/}));
    const input=screen.getByRole('textbox');
    expect(input).toHaveAttribute('inputmode','text');
    fireEvent.change(input,{target:{value:'school'}});
    await act(async()=>{fireEvent.click(screen.getByRole('button',{name:'Antwort prüfen'}));await Promise.resolve()});
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({curriculum:{completedLessonIds:['spelling']}}));
    expect(screen.getByRole('button',{name:'Zurück zu den Übungen'})).toBeVisible();
  });
});
