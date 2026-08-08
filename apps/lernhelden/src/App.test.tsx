import {act,fireEvent,render,screen,within} from '@testing-library/react';
import {describe,expect,it,vi} from 'vitest';
import {createAdventureSave,createProfile} from '@lernhelden/engine';
import type {AdventureDefinition} from '@lernhelden/engine';
import {fractionsAdventure} from './adventures/fractions';
import {Battle,Campaign,World} from './App';

describe('Campaign',()=>{
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
    const firstChapterCard=screen.getByRole('heading',{name:chapter.topic}).closest('article');
    expect(firstChapterCard).not.toBeNull();
    expect(within(firstChapterCard!).getByRole('button',{name:'Kapitelboss'})).toBeEnabled();
    save.campaign.defeatedBossIds=[chapter.bossEnemyId];
    rerender(<Campaign adventure={adventure} save={save} onSave={vi.fn().mockResolvedValue(undefined)}/>);
    expect(within(screen.getByRole('heading',{name:nextChapter.topic}).closest('article')!).getByRole('button',{name:nextChapter.missions[0].title})).toBeEnabled();
    expect(within(firstChapterCard!).getByRole('button',{name:'Schatztruhe +155'})).toBeEnabled();
  });

  it('keeps a locked boss visible on the world map and explains the missing strength',()=>{
    const context={fillRect:vi.fn(),drawImage:vi.fn(),save:vi.fn(),restore:vi.fn(),fillText:vi.fn()} as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(context);
    const chapter=fractionsAdventure.campaign![0];
    const save=createAdventureSave(fractionsAdventure);
    save.campaign.completedMissionIds=chapter.missions.map(mission=>mission.id);
    save.campaign.defeatedEliteIds=[chapter.eliteEnemyId];
    save.world={...save.world,x:870,y:80};
    const {rerender}=render(<World adventure={fractionsAdventure} save={save} profile={createProfile('Testheld')} onSave={vi.fn().mockResolvedValue(undefined)}/>);
    expect(screen.getAllByText(/Stärke 0\/15 – noch 15/)).toHaveLength(2);
    fireEvent.click(screen.getByRole('button',{name:'E'}));
    expect(screen.getAllByText(/Boss gesperrt: Stärke 0\/15 – noch 15/)).toHaveLength(2);
    const readyAdventure={...fractionsAdventure,campaign:fractionsAdventure.campaign!.map(item=>({...item,minimumPower:0,minimumDefense:0}))} as AdventureDefinition;
    rerender(<World adventure={readyAdventure} save={save} profile={createProfile('Testheld')} onSave={vi.fn().mockResolvedValue(undefined)}/>);
    fireEvent.click(screen.getByRole('button',{name:'E'}));
    expect(JSON.parse(sessionStorage.getItem('lernhelden:campaign:fractions')!)).toMatchObject({chapter:1,target:'boss'});
  });

  it('animates a projectile and both combatants when damage is resolved',async()=>{
    vi.useFakeTimers();
    vi.spyOn(Math,'random').mockReturnValue(0);
    sessionStorage.setItem('lernhelden:mode:fractions','add');
    sessionStorage.setItem('lernhelden:campaign:fractions',JSON.stringify({chapter:2,missionId:'mission-fractions-2-1'}));
    const save=createAdventureSave(fractionsAdventure);
    const {container}=render(<Battle adventure={fractionsAdventure} initialSave={save} profile={createProfile('Testheld')} onSave={vi.fn().mockResolvedValue(undefined)} onProfile={vi.fn().mockResolvedValue(undefined)}/>);
    const battleView=within(container);
    fireEvent.click(battleView.getByRole('button',{name:/Funkenangriff/}));
    expect(container.querySelectorAll('.math-fraction')).toHaveLength(2);
    expect(container.querySelector('.mixed-fraction-input > .whole-number-field')).not.toBeNull();
    expect(container.querySelector('.mixed-fraction-input > .fraction-fields > span')).not.toBeNull();
    fireEvent.change(battleView.getByLabelText('Ganze Zahl'),{target:{value:'1'}});
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
});
