import {fireEvent,render,screen,within} from '@testing-library/react';
import {describe,expect,it,vi} from 'vitest';
import {createAdventureSave,createProfile} from '@lernhelden/engine';
import type {AdventureDefinition} from '@lernhelden/engine';
import {fractionsAdventure} from './adventures/fractions';
import {Campaign,World} from './App';

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
});
