import type {MasteryRecord, Question, QuestionContext} from '@lernhelden/engine';
import {shuffled} from './shared';

export type VocabularyCurriculumItem = {
  id: string;
  de: string;
  en: string;
  category: string;
  alternatives?: string[];
};

export const spellingItems: VocabularyCurriculumItem[] = [
  ['school','Schule','school'],['teacher','Lehrer/in','teacher'],['pupil','Schüler/in','pupil',['student']],['class','Klasse','class'],
  ['classroom','Klassenzimmer','classroom'],['book','Buch','book'],['textbook','Schulbuch','textbook'],['workbook','Arbeitsheft','workbook'],
  ['exercise-book','Heft','exercise book'],['folder','Hefter','folder'],['pen','Stift','pen'],['pencil','Bleistift','pencil'],
  ['ruler','Lineal','ruler'],['rubber','Radiergummi','rubber',['eraser']],['schoolbag','Schultasche','schoolbag',['school bag']],['desk','Schultisch','desk'],
  ['chair','Stuhl','chair'],['task','Aufgabe','task'],['page','Seite','page'],['picture','Bild','picture'],
  ['family','Familie','family'],['mother','Mutter','mother'],['father','Vater','father'],['parents','Eltern','parents'],
  ['brother','Bruder','brother'],['sister','Schwester','sister'],['friend','Freund/in','friend'],['name','Name','name'],
  ['house','Haus','house'],['home','Zuhause','home'],['room','Zimmer','room'],['door','Tür','door'],
  ['window','Fenster','window'],['dog','Hund','dog'],['cat','Katze','cat'],['food','Essen','food'],
  ['water','Wasser','water'],['head','Kopf','head'],['hand','Hand','hand'],['clothes','Kleidung','clothes'],
].map(([id,de,en,alternatives])=>({id:`spelling-${id}`,de,en,category:'Buchstabieren',alternatives})) as VocabularyCurriculumItem[];

const smallNumbers = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const tens: Record<number,string> = {20:'twenty',30:'thirty',40:'forty',50:'fifty'};

export function englishNumber(value: number) {
  if (value < 20) return smallNumbers[value];
  const ten = Math.floor(value / 10) * 10;
  return value % 10 === 0 ? tens[ten] : `${tens[ten]}-${smallNumbers[value % 10]}`;
}

export const numberItems: VocabularyCurriculumItem[] = Array.from({length:50},(_,index)=>{
  const value=index+1;
  return {id:`number-${value}`,de:String(value),en:englishNumber(value),category:'Zahlen 1–50'};
});

export const teacherItems: VocabularyCurriculumItem[] = [
  ['open-textbook','Öffne dein Schulbuch auf Seite achtzehn.','Open your textbook on page eighteen.'],
  ['read-task','Lies die Aufgabe.','Read the task.'],
  ['listen-recording','Hör dir die Aufnahme an.','Listen to the recording.'],
  ['close-workbook','Schließe dein Arbeitsheft.','Close your workbook.'],
  ['write-headline','Schreibe die Überschrift in deinen Hefter.','Write down the headline into your folder.'],
  ['write-sentences','Schreibe fünf Sätze in dein Heft.','Write down five sentences into your exercise book.'],
  ['repeat','Sprich mir nach.','Repeat after me.'],
  ['look-picture','Sieh dir das Bild an.','Look at the picture.'],
  ['watch-video','Sieh dir den Videoclip an.','Watch the video clip.'],
  ['compare-results','Vergleiche deine Ergebnisse mit denen deines Banknachbarn oder deiner Banknachbarin.','Compare your results to your bank neighbour\'s.'],
  ['folder-task','Bearbeite die Aufgabe in deinem Hefter.','Do the task in your folder.'],
  ['talk-neighbour','Sprich mit deinem Banknachbarn oder deiner Banknachbarin.','Talk to your bank neighbour.'],
  ['use-pencil','Benutze einen Bleistift.','Use a pencil.'],
].map(([id,de,en])=>({id:`teacher-${id}`,de,en,category:'What Teachers Often Say'}));

export const curriculumModeIds = {
  spelling:'grade5-spelling',
  numbers:'grade5-numbers-1-50',
  teachers:'grade5-teacher-says',
  mix:'grade5-basics-mix',
} as const;

const pools: Record<Exclude<keyof typeof curriculumModeIds,'mix'>,VocabularyCurriculumItem[]> = {
  spelling:spellingItems,
  numbers:numberItems,
  teachers:teacherItems,
};

const modePool = new Map<string,keyof typeof pools>([
  [curriculumModeIds.spelling,'spelling'],
  [curriculumModeIds.numbers,'numbers'],
  [curriculumModeIds.teachers,'teachers'],
]);

export function isVocabularyCurriculumMode(modeId: string) {
  return modeId===curriculumModeIds.mix||modePool.has(modeId);
}

function dueItems(items: VocabularyCurriculumItem[], mastery?: Record<string,MasteryRecord>) {
  const due=items.filter(item=>(mastery?.[`curriculum:grade-5:${item.id}`]?.dueAt??0)<=Date.now());
  return due.length?due:items;
}

function itemPool(context: QuestionContext) {
  const direct=modePool.get(context.modeId);
  if(direct)return pools[direct];
  const turn=Math.max(0,context.sequence-1);
  const topic=(turn+Math.floor(turn/3))%3;
  return pools[(['spelling','numbers','teachers'] as const)[topic]];
}

export function vocabularyCurriculumQuestion(context: QuestionContext): Question {
  const pool=itemPool(context);
  const available=dueItems(pool,context.mastery);
  const item=available[Math.min(available.length-1,Math.floor(context.random()*available.length))];
  const taskType=Math.max(0,context.sequence-1)%3;
  const englishToGerman=taskType===2;
  const writing=taskType===0;
  const answer=englishToGerman?item.de:item.en;
  const targetKey=englishToGerman?'de':'en';
  const wrong=shuffled(pool.filter(candidate=>candidate.id!==item.id),context.random).slice(0,3).map(candidate=>candidate[targetKey]);
  const prompt=englishToGerman?`Was bedeutet „${item.en}“?`:`Wie heißt „${item.de}“ auf Englisch?`;
  return {
    id:`curriculum-${context.modeId}-${context.sequence}-${item.id}`,
    inputKind:writing?'text':'choice',
    prompt,
    choices:writing?undefined:shuffled([answer,...wrong],context.random),
    answer,
    acceptedAnswers:writing?[item.en,...(item.alternatives??[])]:undefined,
    category:`${item.category} · ${englishToGerman?'Englisch → Deutsch':writing?'Schreiben':'Deutsch → Englisch'}`,
    learningKey:`curriculum:grade-5:${item.id}`,
    hintSteps:[`Achte auf die genaue Bedeutung von „${englishToGerman?item.en:item.de}“.`,`Die richtige Antwort lautet „${answer}“.`],
  };
}

export function normalizeVocabularyAnswer(value: string) {
  return value
    .toLocaleLowerCase('en')
    .replace(/neighbor/g,'neighbour')
    .replace(/[^a-z0-9]+/g,'');
}

export function evaluateVocabularyAnswer(question: Question, answer: string) {
  const expected=question.acceptedAnswers?.length?question.acceptedAnswers:[question.answer];
  const normalized=normalizeVocabularyAnswer(answer);
  return expected.some(candidate=>normalizeVocabularyAnswer(candidate)===normalized);
}
