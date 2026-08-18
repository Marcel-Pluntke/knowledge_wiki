import type {AdventureDefinition, QuestionProvider} from '@lernhelden/engine';
import {commonAchievements, createCampaign, createItems, ranks, sprite} from './shared';

const format = (value: number) => Number(value.toFixed(3)).toLocaleString('de-DE', {maximumFractionDigits:3});

const provider: QuestionProvider = {
  next({modeId, sequence, random, chapter = 1}) {
    const integer = (min: number, max: number) => Math.floor(random() * (max - min + 1)) + min;
    const scale = Math.max(1, Math.min(12, chapter));
    const decimal = (min: number, max: number) => integer(min, max) / 100;
    let prompt = '', answer = '', hint = '', category = '';

    if (modeId === 'add' || modeId === 'sub') {
      const a = decimal(120 + scale * 20, 380 + scale * 55);
      const b = decimal(45 + scale * 10, 190 + scale * 32);
      const [left, right] = modeId === 'sub' ? [Math.max(a, b), Math.min(a, b)] : [a, b];
      prompt = `${format(left)} ${modeId === 'sub' ? '−' : '+'} ${format(right)}`;
      answer = format(modeId === 'sub' ? left - right : left + right);
      hint = 'Schreibe die Kommas genau untereinander.';
      category = modeId === 'sub' ? 'Subtraktion' : 'Addition';
    } else if (modeId === 'mul') {
      const value = decimal(125 + scale * 15, 640 + scale * 45);
      const factor = integer(2, 9);
      prompt = `${format(value)} · ${factor}`;
      answer = format(value * factor);
      hint = `Multipliziere ${format(value)} mit ${factor}; das Komma übernimmt die Anzahl der Nachkommastellen.`;
      category = 'Multiplikation mit einstelliger Zahl';
    } else if (modeId === 'div') {
      const divisor = integer(2, 9);
      const quotient = decimal(110 + scale * 10, 550 + scale * 40);
      const dividend = quotient * divisor;
      prompt = `${format(dividend)} : ${divisor}`;
      answer = format(quotient);
      hint = `Teile durch ${divisor} und setze das Komma richtig.`;
      category = 'Division durch einstellige Zahl';
    } else if (modeId === 'shift') {
      const factor = [10, 100, 1000][integer(0, 2)];
      const divide = integer(0, 1) === 1;
      const value = decimal(120 + scale * 10, 800 + scale * 35);
      prompt = `${format(value)} ${divide ? ':' : '·'} ${factor}`;
      answer = format(divide ? value / factor : value * factor);
      hint = `Verschiebe das Komma ${String(factor).length - 1} Stellen nach ${divide ? 'links' : 'rechts'}.`;
      category = 'Mit 10, 100 oder 1000 rechnen';
    } else {
      const conversions = [
        {value: decimal(125, 975), from: 'm', to: 'cm', factor: 100},
        {value: decimal(120, 850), from: 'kg', to: 'g', factor: 1000},
        {value: decimal(125, 975), from: '€', to: 'Cent', factor: 100},
      ];
      const conversion = conversions[integer(0, conversions.length - 1)];
      prompt = `${format(conversion.value)} ${conversion.from} = ? ${conversion.to}`;
      answer = format(conversion.value * conversion.factor);
      hint = `Rechne von ${conversion.from} zu ${conversion.to} mit ${conversion.factor}.`;
      category = 'Größen und Geld umrechnen';
    }

    return {id:`decimal-${sequence}`,inputKind:'decimal',prompt,answer,category,hintSteps:[hint,`Die Lösung ist ${answer}.`]};
  },
  evaluate(question, answer) {
    const parse = (value: string) => Number(value.replace(',','.'));
    return Number.isFinite(parse(answer)) && Math.abs(parse(answer) - parse(question.answer)) < 1e-6;
  },
};

const slots = ['helmet','weapon','shield','armor','boots'];
const campaignContent = createCampaign('decimals', ['Addition','Subtraktion','Multiplikation','Division','Zehnerpotenzen','Größen und Geld','Addition und Subtraktion','Mal und Geteilt','Maße umrechnen','Geld rechnen','Meisteraufgaben','Komma-Festung'], ['add','sub','mul','div','shift','convert'], ['comma-goblin','decimal-slime','hundredths-hydra','rounding-giant','zero-necromancer','decimal-dragon'], slots) as {campaign: NonNullable<AdventureDefinition['campaign']>; enemies: never[]};

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
  ].map(([id,name,place,hp,attack,reward,xp],index)=>({id:String(id),name:String(name),place:String(place),hp:Number(hp),attack:Number(attack),reward:Number(reward),xp:Number(xp),rule:index===1?'heal-on-miss':index===3?'charged':index===5?'fire':'normal',sprite:sprite(String(id),String(name))})).concat(campaignContent.enemies) as AdventureDefinition['enemies'],
  campaign:campaignContent.campaign,
  modes:[
    {id:'add',title:'Schatz-Addition',description:'Addiere Dezimalzahlen stellenrichtig.'},
    {id:'sub',title:'Rüstungs-Abzug',description:'Subtrahiere Dezimalzahlen stellenrichtig.'},
    {id:'mul',title:'Zahlen-Schmiede',description:'Multipliziere mit einer einstelligen Zahl.'},
    {id:'div',title:'Teiler-Tor',description:'Dividiere durch eine einstellige Zahl.'},
    {id:'shift',title:'Zehnerportal',description:'Rechne mit 10, 100 und 1000.'},
    {id:'convert',title:'Maß- und Geldmarkt',description:'Rechne Größen und Geld um.'},
  ],
  questionProvider:provider,
  world:{id:'decimal-fortress',width:960,height:540,start:{x:80,y:420},obstacles:[{x:265,y:235,width:110,height:58},{x:470,y:272,width:95,height:58},{x:520,y:62,width:95,height:50}],encounters:[{enemyId:'comma-goblin',x:295,y:335},{enemyId:'decimal-slime',x:470,y:145},{enemyId:'hundredths-hydra',x:520,y:475},{enemyId:'rounding-giant',x:650,y:270}],merchant:{x:90,y:110},chest:{x:385,y:500}},achievements:commonAchievements,
};
