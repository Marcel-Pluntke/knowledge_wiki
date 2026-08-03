import type {AdventureDefinition, Question, QuestionProvider} from '@lernhelden/engine';
import words from './vocabulary-data.json';
import {commonAchievements, createItems, ranks, shuffled, sprite} from './shared';

const provider: QuestionProvider = {
  next({modeId, sequence, random}) {
    const word = words[Math.floor(random() * words.length)];
    const sourceKey = modeId === 'en-de' ? 'en' : 'de';
    const targetKey = modeId === 'en-de' ? 'de' : 'en';
    const answer = word[targetKey];
    const wrong = shuffled(words.filter(candidate => candidate[targetKey] !== answer), random).slice(0, 3).map(candidate => candidate[targetKey]);
    return {
      id: `vocabulary-${sequence}-${word.en}`,
      inputKind: 'choice',
      prompt: word[sourceKey],
      choices: shuffled([answer, ...wrong], random),
      answer,
      category: word.category,
      hintSteps: [`Gesucht ist die Übersetzung von „${word[sourceKey]}“.`, `Die richtige Antwort lautet „${answer}“.`],
    } satisfies Question;
  },
  evaluate(question, answer) { return question.answer === answer; },
};

const slots = ['helmet','weapon','shield','armor','boots'];
const itemNames = [
  'Lederhelm','Holzschwert','Holzschild','Lederweste','Reisestiefel',
  'Ritterhelm','Silberschwert','Löwenschild','Plattenrüstung','Windstiefel',
  'Drachenhelm','Heldenklinge','Sternenschild','Königsrüstung','Blitzstiefel',
];

export const vocabularyAdventure: AdventureDefinition = {
  id:'vocabulary', title:'Vokabel Held', subtitle:'Deutsch und Englisch im Wortkampf', status:'released',
  theme:{primary:'#5ac8a8',secondary:'#7197ff',surface:'#20264b',background:'#12162f',accent:'#ffe16b'},
  currency:{id:'ruby', name:'Rubine', sprite:sprite('ruby','Rubin','ruby-crystal')},
  merchant:{id:'sir-worto',name:'Sir Worto',shopTitle:'Sir Wortos Wortwaren',greeting:'Neue Wörter brauchen gute Ausrüstung. Such dir etwas Passendes aus!',note:'Gekaufte Gegenstände wandern direkt in deine Truhe.',portrait:'scholar',backdrop:'library',shelfNames:['Lesestube','Bibliothek','Meisterarchiv'],colors:{skin:'#d8a06f',outfit:'#3e6c9d',accent:'#f0c959'}},
  ranks:ranks(['Wortlehrling','Sprachkämpfer','Wortwächter','Übersetzungsritter','Vokabelheld']),
  slots:{helmet:'Helm',weapon:'Schwert',shield:'Schild',armor:'Rüstung',boots:'Stiefel'},
  items:createItems('vocabulary', itemNames, slots),
  enemies:[
    ['word-slime','Wort-Schleim','Wörterwiese',35,5,35,8],
    ['translation-goblin','Übersetzungs-Goblin','Wörterwiese',70,8,70,10],
    ['book-skeleton','Buch-Skelett','Bücherwald',120,12,115,13],
    ['language-troll','Sprach-Troll','Bücherwald',180,16,175,16],
    ['grammar-knight','Grammatik-Ritter','Sprachburg',260,21,260,20],
    ['vocabulary-dragon','Vokabel-Drache','Sprachburg',380,27,420,28],
  ].map(([id,name,place,hp,attack,reward,xp], index) => ({id:String(id),name:String(name),place:String(place),hp:Number(hp),attack:Number(attack),reward:Number(reward),xp:Number(xp),rule:index===1?'heal-on-miss':index===3?'armor-pierce':index===5?'fire':'normal',sprite:sprite(String(id),String(name))})),
  modes:[
    {id:'de-en',title:'Deutsch → Englisch',description:'Finde die englische Übersetzung.'},
    {id:'en-de',title:'Englisch → Deutsch',description:'Finde die deutsche Übersetzung.'},
  ],
  questionProvider:provider,
  world:{id:'wordlands',width:960,height:540,start:{x:90,y:420},obstacles:[{x:270,y:120,width:130,height:75},{x:490,y:310,width:120,height:80},{x:690,y:120,width:120,height:70}],encounters:[{enemyId:'word-slime',x:230,y:390},{enemyId:'translation-goblin',x:430,y:210},{enemyId:'book-skeleton',x:650,y:390},{enemyId:'language-troll',x:820,y:190}],merchant:{x:120,y:120},chest:{x:820,y:420}},
  achievements:commonAchievements,
};
