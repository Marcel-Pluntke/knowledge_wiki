import type {AdventureDefinition, QuestionProvider} from '@lernhelden/engine';
import {commonAchievements, createItems, ranks, shuffled, sprite} from './shared';

const format = (value: number) => Number(value.toFixed(3)).toLocaleString('de-DE', {maximumFractionDigits:3});
const provider: QuestionProvider = {
  next({modeId, sequence, random}) {
    const integer = (max: number) => Math.floor(random() * max) + 1;
    let prompt = '', answer = '', hint = '';
    if (modeId === 'place') {
      const value = integer(99) + integer(99) / 100;
      prompt = `Welche Ziffer steht bei ${format(value)} an der Zehntelstelle?`;
      answer = String(Math.floor((value * 10) % 10)); hint = 'Die erste Stelle rechts vom Komma sind die Zehntel.';
    } else if (modeId === 'compare') {
      const a = integer(200) / 10, b = integer(200) / 10;
      prompt = `${format(a)} __ ${format(b)}`; answer = a === b ? '=' : a > b ? '>' : '<'; hint = 'Vergleiche von links nach rechts.';
    } else if (modeId === 'shift') {
      const a = integer(90) / 10, factor = [10,100,1000][integer(3)-1];
      prompt = `${format(a)} × ${factor}`; answer = format(a * factor); hint = `Verschiebe das Komma ${String(factor).length - 1} Stellen nach rechts.`;
    } else {
      const a = integer(200) / 10, b = integer(100) / 10, subtract = modeId === 'sub';
      const left = subtract ? Math.max(a,b) : a, right = subtract ? Math.min(a,b) : b;
      prompt = `${format(left)} ${subtract ? '−' : '+'} ${format(right)}`; answer = format(subtract ? left-right : left+right); hint = 'Schreibe die Kommas untereinander.';
    }
    const choices = modeId === 'compare' ? shuffled(['<','=','>'],random) : undefined;
    return {id:`decimal-${sequence}`,inputKind:choices?'choice':'decimal',prompt,choices,answer,hintSteps:[hint,`Die Lösung ist ${answer}.`]};
  },
  evaluate(question, answer) {
    if (question.inputKind === 'choice') return question.answer === answer;
    const parse = (value: string) => Number(value.replace(',','.'));
    return Number.isFinite(parse(answer)) && Math.abs(parse(answer) - parse(question.answer)) < 1e-6;
  },
};

const slots=['helmet','weapon','shield','armor','boots'];
export const decimalsAdventure: AdventureDefinition = {
  id:'decimals',title:'Dezimal-Abenteuer',subtitle:'Erobere die Komma-Festung',status:'released',
  theme:{primary:'#72b8e8',secondary:'#7c8cff',surface:'#1c3152',background:'#101b34',accent:'#dcecff'},
  currency:{id:'silver',name:'Silbertaler',sprite:sprite('silver','Silbertaler')},
  merchant:{id:'roderich',name:'Rüstungshändler Roderich',shopTitle:'Roderichs Rüstkammer',greeting:'Eine saubere Rechnung verdient eine glänzende Rüstung. Sieh dich um!',note:'Jeder Kauf wird sicher in deiner Abenteuer-Truhe verstaut.',portrait:'armorer',backdrop:'forge',shelfNames:['Knappenregal','Ritterregal','Königsregal'],colors:{skin:'#d19a6f',outfit:'#66798e',accent:'#75dfff'}},
  ranks:ranks(['Knappe','Wächter','Ritter','Hauptmann','Dezimal-Champion']),
  slots:{helmet:'Helm',weapon:'Schwert',shield:'Schild',armor:'Rüstung',boots:'Stiefel'},
  items:createItems('decimals',['Lederhelm','Kurzschwert','Holzschild','Kettenhemd','Reisestiefel','Silberhelm','Ritterschwert','Löwenschild','Plattenrüstung','Windstiefel','Drachenhelm','Sternenklinge','Kristallschild','Königsrüstung','Blitzstiefel'],slots),
  enemies:[
    ['comma-goblin','Komma-Kobold','Zehntel-Wiese',35,5,40,8],['decimal-slime','Zehntel-Schleim','Zehntel-Wiese',70,8,75,10],['hundredths-hydra','Hundertstel-Hydra','Komma-Höhle',120,12,120,12],['rounding-giant','Rundungs-Riese','Komma-Höhle',180,16,180,15],['zero-necromancer','Nullen-Nekromant','Stellenwert-Festung',260,21,265,18],['decimal-dragon','Dezimal-Drache','Stellenwert-Festung',380,27,420,25],
  ].map(([id,name,place,hp,attack,reward,xp],index)=>({id:String(id),name:String(name),place:String(place),hp:Number(hp),attack:Number(attack),reward:Number(reward),xp:Number(xp),rule:index===1?'heal-on-miss':index===3?'charged':index===5?'fire':'normal',sprite:sprite(String(id),String(name))})),
  modes:[{id:'place',title:'Stellenwert-Wache',description:'Erkenne Zehntel und Hundertstel.'},{id:'compare',title:'Zahlen-Duell',description:'Vergleiche Dezimalzahlen.'},{id:'add',title:'Schatz-Addition',description:'Addiere stellenrichtig.'},{id:'sub',title:'Rüstungs-Abzug',description:'Subtrahiere sicher.'},{id:'shift',title:'Zehnerportal',description:'Rechne mit 10, 100 und 1000.'}],
  questionProvider:provider,
  world:{id:'decimal-fortress',width:960,height:540,start:{x:80,y:420},obstacles:[{x:220,y:90,width:150,height:90},{x:430,y:280,width:140,height:80},{x:680,y:80,width:130,height:100}],encounters:[{enemyId:'comma-goblin',x:220,y:400},{enemyId:'decimal-slime',x:420,y:200},{enemyId:'hundredths-hydra',x:640,y:390},{enemyId:'rounding-giant',x:820,y:190}],merchant:{x:100,y:120},chest:{x:820,y:430}},achievements:commonAchievements,
};
