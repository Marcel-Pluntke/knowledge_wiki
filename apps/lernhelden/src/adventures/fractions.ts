import type {AdventureDefinition, QuestionProvider} from '@lernhelden/engine';
import {commonAchievements, createItems, ranks, sprite} from './shared';

const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
const simplify=(n:number,d:number)=>{const g=gcd(n,d);return [n/g,d/g] as const};
const provider: QuestionProvider={
  next({modeId,sequence,random}){
    const rand=(min:number,max:number)=>Math.floor(random()*(max-min+1))+min;
    const chosen=modeId==='test'?['add','sub','mul','div','reduce'][rand(0,4)]:modeId;
    let an=rand(1,5),ad=rand(2,9),bn=rand(1,5),bd=rand(2,9),rn=0,rd=1,prompt='';
    if(chosen==='add'){rn=an*bd+bn*ad;rd=ad*bd;prompt=`${an}/${ad} + ${bn}/${bd}`;}
    else if(chosen==='sub'){if(an/ad<bn/bd){[an,bn]=[bn,an];[ad,bd]=[bd,ad];}rn=an*bd-bn*ad;rd=ad*bd;prompt=`${an}/${ad} − ${bn}/${bd}`;}
    else if(chosen==='mul'){rn=an*bn;rd=ad*bd;prompt=`${an}/${ad} × ${bn}/${bd}`;}
    else if(chosen==='div'){rn=an*bd;rd=ad*bn;prompt=`${an}/${ad} ÷ ${bn}/${bd}`;}
    else {const factor=rand(2,6);rn=an;rd=ad;prompt=`Kürze ${an*factor}/${ad*factor}`;}
    [rn,rd]=simplify(rn,rd);
    return {id:`fraction-${sequence}`,inputKind:'fraction',prompt,answer:`${rn}/${rd}`,numerator:rn,denominator:rd,hintSteps:['Bringe den Bruch Schritt für Schritt in eine berechenbare Form.',`Vollständig gekürzt lautet die Lösung ${rn}/${rd}.`]};
  },
  evaluate(question,answer){const parts=answer.split('/');const n=Number(parts[0]),d=Number(parts[1]??1);if(!Number.isInteger(n)||!Number.isInteger(d)||d===0)return false;const [sn,sd]=simplify(n,d);return sn===question.numerator&&sd===question.denominator;},
};

const slots=['hut','weapon','cloak','shield','boots','amulet'];
export const fractionsAdventure: AdventureDefinition={
  id:'fractions',title:'Mathe Magier: Brüche',subtitle:'Das Abenteuer in der Brüche-Burg',status:'released',theme:{primary:'#a982ff',secondary:'#5fd4b2',surface:'#292044',background:'#17142f',accent:'#ffe16b'},currency:{id:'gold',name:'Goldstücke',sprite:sprite('gold','Goldstück')},merchant:{id:'kuno',name:'Kobold Kuno',shopTitle:'Kunos Kramladen',greeting:'Kuno hat genau die richtige Ausrüstung für dein nächstes Abenteuer!',note:'Gekaufte Gegenstände wandern direkt in deine Truhe im Magierhaus.',portrait:'goblin',backdrop:'woodland-shop',shelfNames:['Lehrlings-Regal','Entdecker-Regal','Meister-Regal'],colors:{skin:'#64af56',outfit:'#6b55b7',accent:'#ffe17b'}},ranks:ranks(['Zauberlehrling','Waldwächter','Höhlenhüter','Gipfelmagier','Drachenmeister']),slots:{hut:'Kopf',weapon:'Stab',cloak:'Umhang',shield:'Schild',boots:'Stiefel',amulet:'Amulett'},items:createItems('fractions',['Lehrlingshut','Sternenstab','Drachenumhang','Holzschild','Wolkenstiefel','Glücksklee-Amulett','Mondkrone','Blitzstab','Sternenumhang','Goldener Schild','Drachenstiefel','Sonnenamulett','Saphirkrone','Kometenstab','Schattenmantel','Runenschild','Phönixstiefel','Sternensiegel'],slots),
  enemies:[['fraction-goblin','Kürzungs-Kobold','Klee-Wald',30,4,35,6,'normal'],['arithmetic-slime','Rechen-Schleim','Klee-Wald',65,7,65,6,'heal-on-miss'],['denominator-troll','Nenner-Troll','Smaragd-Höhle',105,10,100,8,'armor-pierce'],['fraction-basilisk','Bruch-Basilisk','Smaragd-Höhle',150,13,145,8,'charged'],['bracket-golem','Klammer-Golem','Zahlen-Gebirge',205,16,195,10,'golem'],['number-griffin','Zahlen-Greif','Zahlen-Gebirge',270,19,260,10,'charged'],['shadow-wizard','Schatten-Magier','Drachenfeste',350,23,340,12,'shadow'],['fraction-dragon','Brüche-Drache','Drachenfeste',450,28,450,12,'fire']].map(([id,name,place,hp,attack,reward,xp,rule],index)=>({id:String(id),name:String(name),place:String(place),hp:Number(hp),attack:Number(attack),reward:Number(reward),xp:Number(xp),rule:rule as never,sprite:sprite(String(id),String(name),index===6?'zero-necromancer':index===7?'decimal-dragon':String(id))})),modes:[{id:'add',title:'Zauber-Mischung',description:'Addiere zwei Brüche.'},{id:'sub',title:'Drachenbiss',description:'Subtrahiere zwei Brüche.'},{id:'mul',title:'Kristall-Kopie',description:'Multipliziere Brüche.'},{id:'div',title:'Portal-Teiler',description:'Dividiere Brüche.'},{id:'reduce',title:'Kürzungs-Kobold',description:'Kürze vollständig.'},{id:'test',title:'Meisterprüfung',description:'Alle Rechenarten gemischt.'}],questionProvider:provider,world:{id:'fraction-realms',width:960,height:540,start:{x:90,y:420},obstacles:[{x:245,y:145,width:125,height:72},{x:440,y:254,width:100,height:74},{x:625,y:88,width:126,height:60}],encounters:[{enemyId:'fraction-goblin',x:250,y:390},{enemyId:'arithmetic-slime',x:430,y:190},{enemyId:'denominator-troll',x:650,y:390},{enemyId:'fraction-basilisk',x:810,y:180}],merchant:{x:100,y:110},chest:{x:830,y:430}},achievements:commonAchievements,
};
