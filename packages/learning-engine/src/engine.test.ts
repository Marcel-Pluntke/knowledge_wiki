import {describe,expect,it} from 'vitest';
import {createAdventureSave,discardItem,equipItem,buyItem,createBattle,resolveCorrect,resolveCounter} from './index';
import type {AdventureDefinition} from './types';

const sprite={id:'test',src:'assets/sprites/test.png',label:'Test'};
const definition:AdventureDefinition={id:'vocabulary',title:'Test',subtitle:'Test',status:'released',theme:{primary:'#fff',secondary:'#fff',surface:'#000',background:'#000',accent:'#fff'},currency:{id:'coin',name:'Münzen',sprite},merchant:{id:'merchant',name:'Händler',shopTitle:'Shop',greeting:'Hallo',note:'Test',portrait:'scholar',backdrop:'library',shelfNames:['Regal'],colors:{skin:'#fff',outfit:'#000',accent:'#fff'}},ranks:[{id:'one',title:'Eins',xp:0}],slots:{weapon:'Waffe'},items:[{id:'sword',name:'Schwert',slot:'weapon',tier:1,cost:10,power:2,defense:0,luck:0,visual:{id:'sword',style:'knightly',variant:1,primary:'#777',secondary:'#aaa',highlight:'#fff'}}],enemies:[{id:'slime',name:'Schleim',place:'Wiese',hp:20,attack:5,reward:5,xp:2,rule:'heal-on-miss',sprite}],modes:[{id:'test',title:'Test',description:'Test'}],questionProvider:{next:()=>({id:'q',inputKind:'choice',prompt:'A',choices:['B'],answer:'B',hintSteps:[]}),evaluate:(q,a)=>q.answer===a},world:{id:'world',width:100,height:100,start:{x:1,y:1},obstacles:[],encounters:[],merchant:{x:1,y:1},chest:{x:1,y:1}},achievements:[]};

describe('learning engine',()=>{
  it('keeps inventory mutations safe',()=>{let save={...createAdventureSave(definition),currency:20};save=buyItem(save,definition,'sword');expect(save.currency).toBe(10);save=equipItem(save,definition,'sword');expect(discardItem(save,'sword').ownedItemIds).toContain('sword');});
  it('applies shared battle rules',()=>{const enemy=definition.enemies[0];let battle=createBattle(enemy,0);battle={...battle,phase:'question'};const hit=resolveCorrect(battle,enemy,2);expect(hit.state.enemyHp).toBeLessThan(enemy.hp);const counter=resolveCounter(hit.state,enemy,0,true);expect(counter.state.enemyHp).toBeGreaterThanOrEqual(hit.state.enemyHp);});
});
