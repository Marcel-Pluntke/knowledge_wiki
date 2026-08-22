import type {AdventureDefinition, Question, QuestionProvider} from '@lernhelden/engine';
import {commonAchievements, createCampaign, createItems, ranks, shuffled, sprite} from './shared';
import {curriculumModeIds, evaluateVocabularyAnswer, isVocabularyCurriculumMode, spellingItems, vocabularyCurriculumQuestion} from './vocabulary-curriculum';

const words=spellingItems;

const provider: QuestionProvider = {
  next({modeId, sequence, random, mastery, previousLearningKey}) {
    if(isVocabularyCurriculumMode(modeId))return vocabularyCurriculumQuestion({modeId,sequence,random,mastery,previousLearningKey});
    const due = words.filter(word => (mastery?.[`word-${word.en}`]?.dueAt ?? 0) <= Date.now());
    const preferred=due.length?due:words;
    const withoutPrevious=preferred.filter(word=>`word-${word.en}`!==previousLearningKey);
    const fallback=words.filter(word=>`word-${word.en}`!==previousLearningKey);
    const available=withoutPrevious.length?withoutPrevious:fallback.length?fallback:preferred;
    const word = available[Math.floor(random() * available.length)];
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
      acceptedAnswers: spelling&&targetKey==='en'?[word.en,...(word.alternatives??[])]:undefined,
      category: word.category, learningKey:`word-${word.en}`,
      hintSteps: [`Gesucht ist die Übersetzung von „${word[sourceKey]}“.`, `Die richtige Antwort lautet „${answer}“.`],
    } satisfies Question;
  },
  evaluate: evaluateVocabularyAnswer,
};

const slots = ['helmet','weapon','shield','armor','boots'];
const itemNames = [
  'Lederhelm','Holzschwert','Holzschild','Lederweste','Reisestiefel',
  'Ritterhelm','Silberschwert','Löwenschild','Plattenrüstung','Windstiefel',
  'Drachenhelm','Heldenklinge','Sternenschild','Königsrüstung','Blitzstiefel',
];
const campaignContent = createCampaign('vocabulary', ['Sich vorstellen','Familie und Freunde','Schule','Zuhause','Freizeit','Tiere und Natur','Essen und Einkaufen','Stadt und Weg','Zeit und Alltag','Reisen','Gesundheit','Geschichten erzählen'], ['de-en','en-de','spell'], ['word-slime','translation-goblin','book-skeleton','language-troll','grammar-knight','vocabulary-dragon'], slots) as {campaign: NonNullable<AdventureDefinition['campaign']>; enemies: never[]};
const curriculumEnemies: AdventureDefinition['enemies'] = [
  {id:'curriculum-spelling-slime',name:'Buchstaben-Schleim',place:'Grundlagenpfad',hp:24,attack:5,reward:24,xp:6,rule:'normal',sprite:sprite('curriculum-spelling-slime','Buchstaben-Schleim','word-slime')},
  {id:'curriculum-number-goblin',name:'Zahlen-Goblin',place:'Grundlagenpfad',hp:30,attack:6,reward:30,xp:7,rule:'normal',sprite:sprite('curriculum-number-goblin','Zahlen-Goblin','translation-goblin')},
  {id:'curriculum-classroom-skeleton',name:'Klassenraum-Skelett',place:'Grundlagenpfad',hp:36,attack:7,reward:36,xp:8,rule:'normal',sprite:sprite('curriculum-classroom-skeleton','Klassenraum-Skelett','book-skeleton')},
  {id:'curriculum-basics-troll',name:'Grundlagen-Troll',place:'Grundlagenpfad',hp:45,attack:8,reward:45,xp:10,rule:'normal',sprite:sprite('curriculum-basics-troll','Grundlagen-Troll','language-troll')},
];
const regularEnemies = [
  ['word-slime','Wort-Schleim','Wörterwiese',35,5,35,8],
  ['translation-goblin','Übersetzungs-Goblin','Wörterwiese',70,8,70,10],
  ['book-skeleton','Buch-Skelett','Bücherwald',120,12,115,13],
  ['language-troll','Sprach-Troll','Bücherwald',180,16,175,16],
  ['grammar-knight','Grammatik-Ritter','Sprachburg',260,21,260,20],
  ['vocabulary-dragon','Vokabel-Drache','Sprachburg',380,27,420,28],
].map(([id,name,place,hp,attack,reward,xp], index) => ({id:String(id),name:String(name),place:String(place),hp:Number(hp),attack:Number(attack),reward:Number(reward),xp:Number(xp),rule:index===1?'heal-on-miss':index===3?'armor-pierce':index===5?'fire':'normal',sprite:sprite(String(id),String(name))})) as AdventureDefinition['enemies'];

export const vocabularyAdventure: AdventureDefinition = {
  id:'vocabulary', title:'Vokabel Held', subtitle:'Deutsch und Englisch im Wortkampf', status:'released',
  theme:{primary:'#5ac8a8',secondary:'#7197ff',surface:'#20264b',background:'#12162f',accent:'#ffe16b'},
  currency:{id:'ruby', name:'Rubine', sprite:sprite('ruby','Rubin','ruby-crystal')},
  merchant:{id:'sir-worto',name:'Sir Worto',shopTitle:'Sir Wortos Wortwaren',greeting:'Neue Wörter brauchen gute Ausrüstung. Such dir etwas Passendes aus!',note:'Gekaufte Gegenstände wandern direkt in deine Truhe.',portrait:'scholar',backdrop:'library',shelfNames:['Lesestube','Bibliothek','Meisterarchiv'],colors:{skin:'#d8a06f',outfit:'#3e6c9d',accent:'#f0c959'}},
  ranks:ranks(['Wortlehrling','Sprachkämpfer','Wortwächter','Übersetzungsritter','Vokabelheld']),
  slots:{helmet:'Helm',weapon:'Schwert',shield:'Schild',armor:'Rüstung',boots:'Stiefel'},
  items:createItems('vocabulary', itemNames, slots),
  enemies:[...regularEnemies,...curriculumEnemies,...campaignContent.enemies],
  campaign:campaignContent.campaign,
  curriculum:{grades:[
    {id:'grade-5',title:'Klasse 5',description:'Englische Grundlagen für das sächsische Gymnasium.',status:'released',chapters:[
      {id:'basics',index:1,title:'Grundlagen',description:'Buchstabieren, Zahlen und wichtige Sätze aus dem Unterricht.',status:'released',lessons:[
        {id:'spelling',title:'Buchstabieren',description:'Schreibe über 160 wichtige Wörter aus den Themen der Klasse 5.',modeId:curriculumModeIds.spelling,enemyId:'curriculum-spelling-slime',status:'released'},
        {id:'numbers-1-50',title:'Zahlen 1–50',description:'Erkenne und schreibe alle englischen Zahlen bis fifty.',modeId:curriculumModeIds.numbers,enemyId:'curriculum-number-goblin',status:'released'},
        {id:'teacher-says',title:'What Teachers Often Say',description:'Verstehe 13 wichtige Anweisungen aus dem Englischunterricht.',modeId:curriculumModeIds.teachers,enemyId:'curriculum-classroom-skeleton',status:'released'},
        {id:'basics-mix',title:'Gemischte Wiederholung',description:'Beweise dein Können mit Aufgaben aus allen drei Bereichen.',modeId:curriculumModeIds.mix,enemyId:'curriculum-basics-troll',status:'released',requiredLessonIds:['spelling','numbers-1-50','teacher-says']},
      ]},
      {id:'future-chapters',index:2,title:'Weitere Kapitel',description:'Neue Themen für Klasse 5 folgen.',status:'coming-soon',lessons:[]},
    ]},
    {id:'future-grades',title:'Weitere Klassen',description:'Neue Klassenstufen sind in Vorbereitung.',status:'coming-soon',chapters:[]},
  ]},
  modes:[
    {id:'de-en',title:'Deutsch zu Englisch',description:'Finde die englische Übersetzung.'},
    {id:'en-de',title:'Englisch zu Deutsch',description:'Finde die deutsche Übersetzung.'},
    {id:'spell',title:'Schreibwerkstatt',description:'Schreibe die Übersetzung selbst.'},
  ],
  questionProvider:provider,
  world:{id:'wordlands',width:960,height:540,start:{x:90,y:420},obstacles:[{x:270,y:235,width:108,height:58},{x:468,y:270,width:98,height:60},{x:520,y:62,width:92,height:52}],encounters:[{enemyId:'word-slime',x:295,y:335},{enemyId:'translation-goblin',x:470,y:145},{enemyId:'book-skeleton',x:520,y:475},{enemyId:'language-troll',x:650,y:270}],merchant:{x:90,y:110},chest:{x:385,y:500}},
  achievements:commonAchievements,
};
