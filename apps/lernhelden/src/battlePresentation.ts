import type {AdventureId, BossRule, MasteryRecord, Question, SpriteRef} from '@lernhelden/engine';

export type BattleKind='normal'|'elite'|'boss';
export type CompanionStage=1|2|3;
export type CompanionPose='idle'|'hint'|'cheer'|'concerned';

export type CompanionPresentation={
  name:string;
  species:string;
  sprites:Record<CompanionPose,SpriteRef>;
  accent:string;
  intro:string;
  correct:string[];
  wrong:string[];
  phase:string[];
  win:string;
};

const companionSprite=(id:string,name:string,pose:CompanionPose):SpriteRef=>({
  id:`companion-${id}-${pose}`,
  src:`assets/sprites/companion-${id}-${pose}.png`,
  label:`${name}, ${pose==='idle'?'ruhig':pose==='hint'?'gibt einen Tipp':pose==='cheer'?'jubelt':'ist besorgt'}`,
});

export const companions:Record<AdventureId,CompanionPresentation>={
  fractions:{name:'Runa',species:'Runenwyvern',sprites:{idle:companionSprite('runa','Runa','idle'),hint:companionSprite('runa','Runa','hint'),cheer:companionSprite('runa','Runa','cheer'),concerned:companionSprite('runa','Runa','concerned')},accent:'#9b7bff',intro:'Meine Runen leuchten. Gemeinsam knacken wir diesen Kampf!',correct:['Runenstark! Das war genau richtig.','Sauber gerechnet – der Zauber sitzt!'],wrong:['Noch ist nichts verloren. Wir schauen genauer hin.','Guter Versuch! Hol dir einen Tipp, wenn du magst.'],phase:['Der Schutz wackelt – weiter so!','Die Runen sind offen. Jetzt kommt dein stärkster Zauber!'],win:'Geschafft! Diese Geschichte erzählen die Runen noch lange.'},
  decimals:{name:'Kommi',species:'Uhrwerk-Tropfengeist',sprites:{idle:companionSprite('kommi','Kommi','idle'),hint:companionSprite('kommi','Kommi','hint'),cheer:companionSprite('kommi','Kommi','cheer'),concerned:companionSprite('kommi','Kommi','concerned')},accent:'#45b7ff',intro:'Ich halte das Komma im Blick und du den Gegner.',correct:['Komma perfekt – glanzvoll!','Treffer! Die Stellen sitzen genau.'],wrong:['Kein Problem. Wir sortieren die Stellen gemeinsam.','Fast! Ein kleiner Tipp bringt uns wieder auf Kurs.'],phase:['Die Verteidigung löst sich!','Jetzt ist der Kern sichtbar – Endspurt!'],win:'Besiegt! Das war eine Glanzrechnung.'},
  vocabulary:{name:'Lex',species:'Pergamentgeist',sprites:{idle:companionSprite('lex','Lex','idle'),hint:companionSprite('lex','Lex','hint'),cheer:companionSprite('lex','Lex','cheer'),concerned:companionSprite('lex','Lex','concerned')},accent:'#34d6c7',intro:'Meine Seiten rauschen: Dieses Wortabenteuer schaffen wir!',correct:['Wortzauber getroffen!','Richtig! Das kommt sofort in mein Heldenbuch.'],wrong:['Ein neues Wort braucht manchmal zwei Anläufe.','Nicht schlimm – ich habe einen Hinweis auf der nächsten Seite.'],phase:['Das Kapitel wendet sich zu unseren Gunsten!','Die letzte Seite beginnt – du schaffst das!'],win:'The end? Nein: der Anfang deiner nächsten Heldengeschichte!'},
};

export type BattlePhase={label:string;detail:string};

export const phasesFor=(kind:BattleKind):BattlePhase[]=>kind==='normal'
  ?[{label:'Verteidigung',detail:'Durchbrich den Schutz.'},{label:'Verwundbar',detail:'Der Weg zum Sieg ist frei!'}]
  :[{label:'Schild',detail:'Zerschlage die äußere Barriere.'},{label:'Runen',detail:'Entschlüssele die magische Abwehr.'},{label:'Finalzauber',detail:'Setze zum entscheidenden Angriff an!'}];

export const detectedPhase=(enemyHp:number,enemyMaxHp:number,kind:BattleKind)=>{
  const ratio=enemyMaxHp<=0?0:enemyHp/enemyMaxHp;
  if(kind==='normal')return ratio>.5?0:1;
  if(ratio>2/3)return 0;
  return ratio>1/3?1:2;
};

export const advanceBattlePhase=(current:number,enemyHp:number,enemyMaxHp:number,kind:BattleKind)=>Math.max(current,detectedPhase(enemyHp,enemyMaxHp,kind));

export const companionStage=(mastery:Record<string,MasteryRecord>):CompanionStage=>{
  const mastered=Object.values(mastery).filter(record=>record.box>=3).length;
  return mastered>=3?3:mastered>=1?2:1;
};

const threats:Record<BossRule,string>={
  normal:'„Kein Held kommt an mir vorbei!“',
  'heal-on-miss':'„Jeder Fehltritt macht mich nur stärker!“',
  'armor-pierce':'„Deine Rüstung wird dich nicht retten!“',
  charged:'„Spürst du, wie sich meine Kraft auflädt?“',
  golem:'„An meiner steinernen Haut zerbricht jeder Zauber!“',
  shadow:'„Im Schatten findest du keine Antwort!“',
  fire:'„Meine Flammen verschlingen jeden falschen Zauber!“',
};

export const comicText=(enemyName:string,rule:BossRule|undefined,companion:CompanionPresentation)=>({
  enemy:`${enemyName}: ${threats[rule??'normal']}`,
  companion:`${companion.name}: ${companion.intro}`,
});

export type FocusHelp=
  |{kind:'fraction';label:string;values:string[]}
  |{kind:'decimal';label:string;values:string[]}
  |{kind:'word';label:string;pattern:string};

export const focusHelp=(question:Question):FocusHelp=>{
  if(question.inputKind==='fraction'){
    const denominators=[...question.prompt.matchAll(/\/(-?\d+)/g)].map(match=>match[1]);
    return {kind:'fraction',label:'Nenner im Blick',values:denominators};
  }
  if(question.inputKind==='decimal'){
    const values=question.prompt.match(/-?\d+(?:[,.]\d+)?/g)??[];
    return {kind:'decimal',label:'Zahlen und Kommas im Blick',values};
  }
  const words=question.answer.trim().split(/\s+/).filter(Boolean);
  const pattern=words.map(word=>`${word[0]??''}${' _'.repeat(Math.max(0,word.length-1))}`).join('   ');
  return {kind:'word',label:'Anfang und Wortlänge',pattern};
};
