import type {AdventureDefinition, QuestionProvider} from '@lernhelden/engine';
import {commonAchievements, createCampaign, createItems, ranks, sprite} from './shared';

const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
const simplify=(n:number,d:number)=>{const g=gcd(n,d);return [n/g,d/g] as const};
const fractionText=(numerator:number,denominator:number)=>{
  const whole=Math.floor(numerator/denominator), remainder=numerator%denominator;
  return whole>0&&remainder>0?`${whole} ${remainder}/${denominator}`:`${numerator}/${denominator}`;
};

const provider: QuestionProvider={
  next({modeId,sequence,random,chapter = 1}){
    const rand=(min:number,max:number)=>Math.floor(random()*(max-min+1))+min;
    const chosen=modeId==='test'?['add','sub','mul','div','reduce'][rand(0,4)]:modeId;
    const max=Math.min(14,5+chapter);
    let an=rand(1,max),ad=rand(2,Math.min(18,8+chapter)),bn=rand(1,max),bd=rand(2,Math.min(18,8+chapter)),rn=0,rd=1,prompt='',category='';

    if(chosen==='add'||chosen==='sub'){
      if(chapter===1){
        ad=rand(2,8);bd=ad;an=rand(1,ad-1);bn=rand(1,bd-1);
        category='Gleichnamige Brüche';
      }else{
        const sameDenominator=rand(0,1)===0;
        ad=rand(2,Math.min(12,6+chapter));
        bd=sameDenominator?ad:rand(2,Math.min(12,6+chapter));
        if(!sameDenominator&&bd===ad)bd=bd===Math.min(12,6+chapter)?2:bd+1;
        an=rand(1,3)*ad+rand(1,ad-1);
        const otherWhole=rand(0,2);
        bn=otherWhole*bd+rand(1,bd-1);
        category=sameDenominator?'Gleichnamige Brüche mit gemischten Zahlen':'Ungleichnamige Brüche mit gemischten Zahlen';
      }
      if(chosen==='sub'&&an/ad<bn/bd){[an,bn]=[bn,an];[ad,bd]=[bd,ad];}
      rn=chosen==='add'?an*bd+bn*ad:an*bd-bn*ad;
      rd=ad*bd;
      prompt=`${fractionText(an,ad)} ${chosen==='add'?'+':'−'} ${fractionText(bn,bd)}`;
    }else if(chosen==='mul'){
      rn=an*bn;rd=ad*bd;prompt=`${an}/${ad} × ${bn}/${bd}`;category='Brüche multiplizieren';
    }else if(chosen==='div'){
      rn=an*bd;rd=ad*bn;prompt=`${an}/${ad} ÷ ${bn}/${bd}`;category='Brüche dividieren';
    }else{
      const factor=rand(2,6);rn=an;rd=ad;prompt=`Kürze ${an*factor}/${ad*factor}`;category='Brüche kürzen';
    }

    [rn,rd]=simplify(rn,rd);
    return {id:`fraction-${sequence}`,inputKind:'fraction',prompt,answer:`${rn}/${rd}`,numerator:rn,denominator:rd,category,hintSteps:['Bringe den Bruch Schritt für Schritt in eine berechenbare Form.',`Vollständig gekürzt lautet die Lösung ${rn}/${rd}.`]};
  },
  evaluate(question,answer){
    const match=answer.trim().match(/^(?:(-?\d+)\s+)?(-?\d+)\/(-?\d+)$/);
    if(!match)return false;
    const whole=match[1]===undefined?undefined:Number(match[1]),numerator=Number(match[2]),denominator=Number(match[3]);
    if(!Number.isInteger(numerator)||!Number.isInteger(denominator)||denominator===0)return false;
    const value=whole===undefined?numerator:whole<0?whole*denominator-numerator:whole*denominator+numerator;
    const [sn,sd]=simplify(value,denominator);
    return sn===question.numerator&&sd===question.denominator;
  },
};

const slots=['hut','weapon','cloak','shield','boots','amulet'];
const campaignContent = createCampaign('fractions', ['Brüche entdecken','Erweitern','Kürzen','Vergleichen','Gleichnamig addieren','Gleichnamig subtrahieren','Ungleichnamig addieren','Ungleichnamig subtrahieren','Multiplizieren','Dividieren','Sachaufgaben','Brüche-Burg'], ['add','sub','mul','div','reduce','test'], ['fraction-goblin','arithmetic-slime','denominator-troll','fraction-basilisk','bracket-golem','number-griffin','zero-necromancer','decimal-dragon'], slots) as {campaign: AdventureDefinition['campaign']; enemies: never[]};

export const fractionsAdventure: AdventureDefinition={
  id:'fractions',title:'Mathe Magier: Brüche',subtitle:'Das Abenteuer in der Brüche-Burg',status:'released',
  theme:{primary:'#a982ff',secondary:'#5fd4b2',surface:'#292044',background:'#17142f',accent:'#ffe16b'},
  currency:{id:'gold',name:'Goldstücke',sprite:sprite('gold','Goldstück')},
  merchant:{id:'kuno',name:'Kobold Kuno',shopTitle:'Kunos Kramladen',greeting:'Kuno hat genau die richtige Ausrüstung für dein nächstes Abenteuer!',note:'Gekaufte Gegenstände wandern direkt in deine Truhe im Magierhaus.',portrait:'goblin',backdrop:'woodland-shop',shelfNames:['Lehrlings-Regal','Entdecker-Regal','Meister-Regal'],colors:{skin:'#64af56',outfit:'#6b55b7',accent:'#ffe17b'}},
  ranks:ranks(['Zauberlehrling','Waldwächter','Höhlenhüter','Gipfelmagier','Drachenmeister']),
  slots:{hut:'Kopf',weapon:'Stab',cloak:'Umhang',shield:'Schild',boots:'Stiefel',amulet:'Amulett'},
  items:createItems('fractions',['Lehrlingshut','Sternenstab','Drachenumhang','Holzschild','Wolkenstiefel','Glücksklee-Amulett','Mondkrone','Blitzstab','Sternenumhang','Goldener Schild','Drachenstiefel','Sonnenamulett','Saphirkrone','Kometenstab','Schattenmantel','Runenschild','Phönixstiefel','Sternensiegel'],slots),
  enemies:[['fraction-goblin','Kürzungs-Kobold','Klee-Wald',30,4,35,6,'normal'],['arithmetic-slime','Rechen-Schleim','Klee-Wald',65,7,65,6,'heal-on-miss'],['denominator-troll','Nenner-Troll','Smaragd-Höhle',105,10,100,8,'armor-pierce'],['fraction-basilisk','Bruch-Basilisk','Smaragd-Höhle',150,13,145,8,'charged'],['bracket-golem','Klammer-Golem','Zahlen-Gebirge',205,16,195,10,'golem'],['number-griffin','Zahlen-Greif','Zahlen-Gebirge',270,19,260,10,'charged'],['shadow-wizard','Schatten-Magier','Drachenfeste',350,23,340,12,'shadow'],['fraction-dragon','Brüche-Drache','Drachenfeste',450,28,450,12,'fire']].map(([id,name,place,hp,attack,reward,xp,rule],index)=>({id:String(id),name:String(name),place:String(place),hp:Number(hp),attack:Number(attack),reward:Number(reward),xp:Number(xp),rule:rule as never,sprite:sprite(String(id),String(name),index===6?'zero-necromancer':index===7?'decimal-dragon':String(id))})).concat(campaignContent.enemies),
  campaign:campaignContent.campaign,
  modes:[{id:'add',title:'Zauber-Mischung',description:'Addiere zwei Brüche.'},{id:'sub',title:'Drachenbiss',description:'Subtrahiere zwei Brüche.'},{id:'mul',title:'Kristall-Kopie',description:'Multipliziere Brüche.'},{id:'div',title:'Portal-Teiler',description:'Dividiere Brüche.'},{id:'reduce',title:'Kürzungs-Kobold',description:'Kürze vollständig.'},{id:'test',title:'Meisterprüfung',description:'Alle Rechenarten gemischt.'}],
  questionProvider:provider,
  world:{id:'fraction-realms',width:960,height:540,start:{x:90,y:420},obstacles:[{x:245,y:145,width:125,height:72},{x:440,y:254,width:100,height:74},{x:625,y:88,width:126,height:60}],encounters:[{enemyId:'fraction-goblin',x:250,y:390},{enemyId:'arithmetic-slime',x:430,y:190},{enemyId:'denominator-troll',x:650,y:390},{enemyId:'fraction-basilisk',x:810,y:180}],merchant:{x:100,y:110},chest:{x:830,y:430}},
  achievements:commonAchievements,
};
