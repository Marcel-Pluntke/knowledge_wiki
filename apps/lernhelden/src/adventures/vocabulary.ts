import type {AdventureDefinition, Question, QuestionProvider} from '@lernhelden/engine';
import words from './vocabulary-data.json';
import {commonAchievements, createCampaign, createItems, ranks, shuffled, sprite} from './shared';

const provider: QuestionProvider = {
  next({modeId, sequence, random, mastery}) {
    const due = words.filter(word => (mastery?.[`word-${word.en}`]?.dueAt ?? 0) <= Date.now());
    const word = (due.length ? due : words)[Math.floor(random() * (due.length || words.length))];
    const sourceKey = modeId === 'en-de' ? 'en' : 'de';
    const targetKey = modeId === 'en-de' ? 'de' : 'en';
    const answer = word[targetKey];
    const wrong = shuffled(words.filter(candidate => candidate[targetKey] !== answer), random).slice(0, 3).map(candidate => candidate[targetKey]);
    const spelling = modeId === 'spell';
    return {
      id: `vocabulary-${sequence}-${word.en}`,
      inputKind: spelling ? 'text' : 'choice',
      prompt: word[sourceKey],
      choices: spelling ? undefined : shuffled([answer, ...wrong], random),
      answer,
      category: word.category, learningKey:`word-${word.en}`,
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
const campaignContent = createCampaign('vocabulary', ['Sich vorstellen','Familie und Freunde','Schule','Zuhause','Freizeit','Tiere und Natur','Essen und Einkaufen','Stadt und Weg','Zeit und Alltag','Reisen','Gesundheit','Geschichten erzählen'], ['de-en','en-de','spell'], ['word-slime','translation-goblin','book-skeleton','language-troll','grammar-knight','vocabulary-dragon'], slots) as {campaign: NonNullable<AdventureDefinition['campaign']>; enemies: never[]};

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
  ].map(([id,name,place,hp,attack,reward,xp], index) => ({id:String(id),name:String(name),place:String(place),hp:Number(hp),attack:Number(attack),reward:Number(reward),xp:Number(xp),rule:index===1?'heal-on-miss':index===3?'armor-pierce':index===5?'fire':'normal',sprite:sprite(String(id),String(name))})).concat(campaignContent.enemies) as AdventureDefinition['enemies'],
  campaign:campaignContent.campaign,
  modes:[
    {id:'de-en',title:'Deutsch zu Englisch',description:'Finde die englische Übersetzung.'},
    {id:'en-de',title:'Englisch zu Deutsch',description:'Finde die deutsche Übersetzung.'},
    {id:'spell',title:'Schreibwerkstatt',description:'Schreibe die Übersetzung selbst.'},
  ],
  questionProvider:provider,
  world:{id:'wordlands',width:960,height:540,start:{x:90,y:420},obstacles:[{x:270,y:235,width:108,height:58},{x:468,y:270,width:98,height:60},{x:520,y:62,width:92,height:52}],encounters:[{enemyId:'word-slime',x:295,y:335},{enemyId:'translation-goblin',x:470,y:145},{enemyId:'book-skeleton',x:520,y:475},{enemyId:'language-troll',x:650,y:270}],merchant:{x:90,y:110},chest:{x:385,y:500}},
  achievements:commonAchievements,
};
