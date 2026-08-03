const decimalModes = {
  place: { title: 'Stellenwert-Wache', icon: '🏰', text: 'Erkenne Zehntel, Hundertstel und Tausendstel.' },
  compare: { title: 'Zahlen-Duell', icon: '⚔️', text: 'Vergleiche und ordne Dezimalzahlen.' },
  add: { title: 'Schatz-Addition', icon: '💰', text: 'Addiere Dezimalzahlen stellenrichtig.' },
  sub: { title: 'Rüstungs-Abzug', icon: '🛡️', text: 'Subtrahiere Dezimalzahlen sicher.' },
  shift: { title: 'Zehnerportal', icon: '🌀', text: 'Multipliziere und dividiere mit 10, 100 und 1000.' },
  test: { title: 'Kriegerprüfung', icon: '🏆', text: 'Alle Dezimal-Abenteuer gemischt.' },
};

const decimalItems = [
  {name:'Lederhelm',slot:'helmet',tier:1,cost:25,power:0,defense:2,luck:0,icon:'🪖'},
  {name:'Silberhelm',slot:'helmet',tier:2,cost:110,power:1,defense:5,luck:1,icon:'🪖'},
  {name:'Drachenhelm',slot:'helmet',tier:3,cost:280,power:3,defense:8,luck:1,icon:'🐲'},
  {name:'Kurzschwert',slot:'weapon',tier:1,cost:40,power:3,defense:0,luck:0,icon:'🗡️'},
  {name:'Ritterschwert',slot:'weapon',tier:2,cost:135,power:7,defense:0,luck:1,icon:'⚔️'},
  {name:'Sternenklinge',slot:'weapon',tier:3,cost:330,power:12,defense:1,luck:2,icon:'🌟'},
  {name:'Holzschild',slot:'shield',tier:1,cost:35,power:0,defense:3,luck:0,icon:'🛡️'},
  {name:'Löwenschild',slot:'shield',tier:2,cost:145,power:1,defense:7,luck:1,icon:'🛡️'},
  {name:'Kristallschild',slot:'shield',tier:3,cost:350,power:2,defense:12,luck:2,icon:'💠'},
  {name:'Kettenhemd',slot:'armor',tier:1,cost:65,power:0,defense:4,luck:0,icon:'🥋'},
  {name:'Plattenrüstung',slot:'armor',tier:2,cost:190,power:2,defense:9,luck:0,icon:'🦾'},
  {name:'Königsrüstung',slot:'armor',tier:3,cost:430,power:5,defense:14,luck:2,icon:'👑'},
  {name:'Reisestiefel',slot:'boots',tier:1,cost:45,power:0,defense:1,luck:2,icon:'🥾'},
  {name:'Windstiefel',slot:'boots',tier:2,cost:125,power:2,defense:2,luck:4,icon:'👢'},
  {name:'Blitzstiefel',slot:'boots',tier:3,cost:300,power:4,defense:3,luck:7,icon:'⚡'},
];

const decimalMonsters = [
  {name:'Komma-Kobold',icon:'👺',hp:35,attack:5,gold:40,xp:8,need:0,place:'Zehntel-Wiese'},
  {name:'Zehntel-Schleim',icon:'🟢',hp:70,attack:8,gold:75,xp:10,need:2,place:'Zehntel-Wiese'},
  {name:'Hundertstel-Hydra',icon:'🐍',hp:120,attack:12,gold:120,xp:12,need:5,place:'Komma-Höhle'},
  {name:'Rundungs-Riese',icon:'🗿',hp:180,attack:16,gold:180,xp:15,need:8,place:'Komma-Höhle'},
  {name:'Nullen-Nekromant',icon:'🧟',hp:260,attack:21,gold:265,xp:18,need:12,place:'Stellenwert-Festung'},
  {name:'Dezimal-Drache',icon:'🐉',hp:380,attack:27,gold:420,xp:25,need:18,place:'Stellenwert-Festung'},
];

const decimalSlotNames = {helmet:'Helm',weapon:'Schwert',shield:'Schild',armor:'Rüstung',boots:'Stiefel'};
let decimalGame = null;

function ensureDecimalData(){
  const base={completed:0,xp:0,owned:[],equipped:{},cleared:[]};
  data.decimal={...base,...(data.decimal||{})};
  if(!Array.isArray(data.decimal.owned))data.decimal.owned=[];
  if(!Array.isArray(data.decimal.cleared))data.decimal.cleared=[];
  if(!data.decimal.equipped||typeof data.decimal.equipped!=='object')data.decimal.equipped={};
  return data.decimal;
}
function decimalSave(){ensureDecimalData();save();}
function decimalStats(){return Object.values(ensureDecimalData().equipped).map(name=>decimalItems.find(i=>i.name===name)).filter(Boolean).reduce((s,i)=>({power:s.power+i.power,defense:s.defense+i.defense,luck:s.luck+i.luck}),{power:0,defense:0,luck:0});}
function decimalRank(){const xp=ensureDecimalData().xp;const ranks=[['Knappe',0],['Wächter',25],['Ritter',65],['Hauptmann',125],['Dezimal-Champion',210]];let index=0;ranks.forEach((r,i)=>{if(xp>=r[1])index=i});return {rank:index+1,title:ranks[index][0],xp,next:ranks[index+1]};}
function decimalTopbar(){const r=decimalRank();return `<header class="topbar decimal-topbar"><button class="brand brand-button" onclick="chapterSelect()"><span class="brand-mark">⚔️</span>Mathe Magier</button><div class="top-actions"><button class="rank-badge" onclick="decimalHome()">Rang ${r.rank} · ${r.title}</button><div class="coins">🪙 ${data.gold}</div></div></header>`;}
function decimalWarrior(size='large'){return `<div class="pixel-warrior ${size}" aria-label="Dezimal-Krieger"><span class="warrior-head">${ensureDecimalData().equipped.helmet?'🪖':'🙂'}</span><span class="warrior-body">${ensureDecimalData().equipped.armor?'🦾':'🟦'}</span><span class="warrior-weapon">${ensureDecimalData().equipped.weapon?'⚔️':'🗡️'}</span><span class="warrior-shield">${ensureDecimalData().equipped.shield?'🛡️':'◈'}</span><span class="warrior-boots">${ensureDecimalData().equipped.boots?'👢':'🥾'}</span></div>`;}
function decimalFmt(n,digits=3){return Number(n.toFixed(digits)).toLocaleString('de-DE',{maximumFractionDigits:digits});}
function decimalRand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function decimalNumber(maxWhole=20,maxDigits=2){const scale=10**maxDigits;return decimalRand(0,maxWhole*scale)/scale;}

function decimalHome(){
  const d=ensureDecimalData(),r=decimalRank(),s=decimalStats();
  show(`${decimalTopbar()}<section class="decimal-hero"><div><div class="eyebrow">Kapitel 2 · Dezimalzahlen</div><h1>Die Komma-Festung ruft!</h1><p>Trainiere deinen Krieger, sammle Ausrüstung und besiege die Wächter der Dezimalwelt.</p></div>${decimalWarrior('banner')}</section><div class="progress-row"><div class="stat"><strong>Rang ${r.rank} · ${r.title}</strong><span>${r.next?`${r.next[1]-r.xp} Punkte bis ${r.next[0]}`:'Höchster Rang erreicht'}</span></div><div class="stat"><strong>${d.completed}</strong><span>Dezimalaufgaben geschafft</span></div><div class="stat"><strong>⚔️ ${s.power} · 🛡️ ${s.defense}</strong><span>Kampfwerte</span></div></div><h2 class="section-title">Wähle dein Training</h2><section class="mode-grid decimal-mode-grid">${Object.entries(decimalModes).map(([id,m])=>`<article class="mode-card decimal-mode-card"><div class="mode-icon">${m.icon}</div><h2>${m.title}</h2><p>${m.text}</p><button class="button decimal-button" onclick="startDecimalGame('${id}')">Trainieren</button></article>`).join('')}</section><h2 class="section-title">Deine Festung</h2><div class="decimal-actions"><button class="button secondary" onclick="decimalInventory()">⚔️ Krieger ausrüsten</button><button class="button gold" onclick="decimalShop()">🛒 Zum Rüstungshändler</button><button class="button mint" onclick="decimalWorld()">🗺️ Zur Dezimalwelt</button></div>`);
}

function makeDecimalQuestion(mode){
  const selected=mode==='test'?['place','compare','add','sub','shift'][decimalRand(0,4)]:mode;
  if(selected==='place'){
    const whole=decimalRand(1,99),digits=[decimalRand(0,9),decimalRand(0,9),decimalRand(0,9)],pos=decimalRand(0,2),number=`${whole},${digits.join('')}`;
    return {type:'choice',prompt:`Welchen Wert hat die markierte Ziffer in ${number}?`,detail:`Die Ziffer ${digits[pos]} steht an der ${['Zehntel-','Hundertstel-','Tausendstel-'][pos]}stelle.`,choices:[digits[pos]/10**(pos+1),digits[pos],digits[pos]*10,1/10**(pos+1)],answer:digits[pos]/10**(pos+1)};
  }
  if(selected==='compare'){
    let a=decimalNumber(20,2),b=decimalNumber(20,2);while(a===b)b=decimalNumber(20,2);return {type:'choice',prompt:`Setze das richtige Zeichen ein: ${decimalFmt(a,2)}  ?  ${decimalFmt(b,2)}`,choices:['<','>','='],answer:a<b?'<':'>'};
  }
  if(selected==='add'||selected==='sub'){
    let a=decimalNumber(40,2),b=decimalNumber(20,2);if(selected==='sub'&&b>a)[a,b]=[b,a];return {type:'input',prompt:`${decimalFmt(a,2)} ${selected==='add'?'+':'−'} ${decimalFmt(b,2)} = ?`,answer:Number((selected==='add'?a+b:a-b).toFixed(2)),hint:'Schreibe die Kommas beim schriftlichen Rechnen genau untereinander.'};
  }
  const a=decimalNumber(30,3),factor=[10,100,1000][decimalRand(0,2)],multiply=Math.random()<.5;return {type:'input',prompt:`${decimalFmt(a,3)} ${multiply?'×':'÷'} ${factor} = ?`,answer:Number((multiply?a*factor:a/factor).toFixed(5)),hint:`Verschiebe das Komma ${Math.log10(factor)} Stelle${factor===10?'':'n'} nach ${multiply?'rechts':'links'}.`};
}

function startDecimalGame(mode,battle=null){decimalGame={mode,battle,number:0,streak:0};nextDecimalQuestion();}
function nextDecimalQuestion(){decimalGame.number++;decimalGame.q=makeDecimalQuestion(decimalGame.mode);const q=decimalGame.q,b=decimalGame.battle;const battleInfo=b?`<section class="decimal-battle-scene"><div class="decimal-fighter">${decimalWarrior('battle')}<strong>Du</strong><div class="health"><i style="width:${100*b.playerHp/b.maxPlayerHp}%"></i></div></div><div class="battle-sparks">✦ ⚔ ✦</div><div class="decimal-fighter"><span class="decimal-monster">${b.monster.icon}</span><strong>${b.monster.name}</strong><div class="health"><i style="width:${100*b.monsterHp/b.monster.hp}%"></i></div></div></section>`:'';const answer=q.type==='choice'?`<div class="decimal-choice-grid">${q.choices.map(c=>`<button class="decimal-choice" onclick='checkDecimalAnswer(${JSON.stringify(c)})'>${typeof c==='number'?decimalFmt(c,4):c}</button>`).join('')}</div>`:`<div class="decimal-answer-row"><input id="decimalAnswer" class="decimal-answer" inputmode="decimal" autocomplete="off" placeholder="Antwort"><button class="button decimal-button" onclick="checkDecimalInput()">Angreifen ⚔️</button></div>`;show(`${decimalTopbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="${b?'decimalWorld()':'decimalHome()'}">←</button><div><div class="eyebrow">${b?'Kampf · '+b.monster.place:decimalModes[decimalGame.mode].title}</div><h1>${b?b.monster.name:'Dezimal-Training'}</h1></div></div><section class="game-panel decimal-game-panel">${battleInfo}<div class="game-status"><span>Aufgabe ${decimalGame.number}</span><span>🔥 Serie ${decimalGame.streak}</span></div><div class="decimal-question">${q.prompt}</div>${answer}<div id="decimalFeedback" class="feedback"></div><button class="button secondary decimal-help" onclick="showDecimalHint()">💡 Hilfe anzeigen</button><div id="decimalHint" class="help-panel"></div></section>`);const input=document.querySelector('#decimalAnswer');if(input){input.focus();input.addEventListener('keydown',e=>{if(e.key==='Enter')checkDecimalInput()});}}
function decimalParse(value){const clean=String(value).trim().replace(',','.');if(!clean)return null;const n=Number(clean);return Number.isFinite(n)?n:null;}
function checkDecimalInput(){const input=document.querySelector('#decimalAnswer');checkDecimalAnswer(decimalParse(input?.value));}
function checkDecimalAnswer(value){const q=decimalGame.q,feedback=document.querySelector('#decimalFeedback');if(value===null){feedback.className='feedback try';feedback.textContent='Bitte gib eine gültige Zahl ein.';return}const correct=typeof q.answer==='number'?Math.abs(Number(value)-q.answer)<1e-6:value===q.answer;if(correct){decimalGame.streak++;feedback.className='feedback good';feedback.textContent='Treffer! Richtig gerechnet. ⚔️';if(decimalGame.battle){decimalBattleHit()}else{const d=ensureDecimalData();d.completed++;d.xp++;data.gold+=1+(decimalGame.streak%5===0?2:0);decimalSave();setTimeout(nextDecimalQuestion,750)}}else{decimalGame.streak=0;feedback.className='feedback try';feedback.textContent=`Noch nicht. Die richtige Antwort ist ${typeof q.answer==='number'?decimalFmt(q.answer,5):q.answer}.`;if(decimalGame.battle)decimalMonsterHit();else setTimeout(nextDecimalQuestion,1300)}}
function showDecimalHint(){const q=decimalGame.q,p=document.querySelector('#decimalHint');if(!p)return;p.innerHTML=`<strong>Krieger-Tipp</strong><p>${q.hint||q.detail||'Vergleiche die Zahlen Stelle für Stelle von links nach rechts.'}</p>`;}

function decimalBattleHit(){const b=decimalGame.battle,s=decimalStats(),damage=9+s.power+Math.floor(Math.random()*5);b.monsterHp=Math.max(0,b.monsterHp-damage);if(b.monsterHp<=0){const d=ensureDecimalData();if(!d.cleared.includes(b.index))d.cleared.push(b.index);d.xp+=b.monster.xp;d.completed++;data.gold+=b.monster.gold;decimalSave();setTimeout(()=>decimalVictory(b),650)}else setTimeout(nextDecimalQuestion,700);}
function decimalMonsterHit(){const b=decimalGame.battle,s=decimalStats(),damage=Math.max(2,b.monster.attack-Math.floor(s.defense/3));b.playerHp=Math.max(0,b.playerHp-damage);if(b.playerHp<=0)setTimeout(()=>decimalDefeat(b),650);else setTimeout(nextDecimalQuestion,1000);}
function decimalVictory(b){show(`${decimalTopbar()}<section class="decimal-result victory"><div class="result-icon">🏆</div><h1>${b.monster.name} besiegt!</h1><p>Du erhältst <strong>${b.monster.gold} Gold</strong> und ${b.monster.xp} Rangpunkte.</p><button class="button gold" onclick="decimalWorld()">Weiter zur Dezimalwelt</button></section>`);}
function decimalDefeat(){show(`${decimalTopbar()}<section class="decimal-result defeat"><div class="result-icon">🩹</div><h1>Der Krieger braucht eine Pause</h1><p>Trainiere weiter oder verbessere deine Ausrüstung im Shop.</p><button class="button" onclick="decimalWorld()">Zurück zur Welt</button> <button class="button gold" onclick="decimalShop()">Zum Shop</button></section>`);}

function decimalInventory(){const d=ensureDecimalData(),s=decimalStats();show(`${decimalTopbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="decimalHome()">←</button><div><div class="eyebrow">Dein Dezimal-Held</div><h1>Krieger ausrüsten</h1></div></div><section class="decimal-inventory"><article class="warrior-room">${decimalWarrior()}<div class="attribute-row"><span>⚔️ ${s.power}</span><span>🛡️ ${s.defense}</span><span>🍀 ${s.luck}</span></div></article><article class="decimal-gear"><h2>Angelegte Ausrüstung</h2><div class="decimal-slots">${Object.entries(decimalSlotNames).map(([slot,label])=>{const name=d.equipped[slot],item=decimalItems.find(i=>i.name===name);return `<button class="decimal-slot ${item?'filled':''}" onclick="decimalUnequip('${slot}')"><span>${label}</span><strong>${item?item.icon+' '+item.name:'Leer'}</strong></button>`}).join('')}</div><h2>Deine Truhe</h2><div class="decimal-chest">${d.owned.filter(name=>!Object.values(d.equipped).includes(name)).map(name=>{const i=decimalItems.find(x=>x.name===name);return `<button class="decimal-chest-item" onclick="decimalEquip('${i.name}')"><span>${i.icon}</span><strong>${i.name}</strong><small>⚔️${i.power} · 🛡️${i.defense} · 🍀${i.luck}</small></button>`}).join('')||'<p>Noch keine freie Ausrüstung. Besuche den Shop.</p>'}</div></article></section>`);}
function decimalEquip(name){const item=decimalItems.find(i=>i.name===name);if(!item)return;ensureDecimalData().equipped[item.slot]=item.name;decimalSave();decimalInventory();}
function decimalUnequip(slot){delete ensureDecimalData().equipped[slot];decimalSave();decimalInventory();}

function decimalShop(){const d=ensureDecimalData();show(`${decimalTopbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="decimalHome()">←</button><div><div class="eyebrow">Rüstungshändler Roderich</div><h1>Shop der Komma-Festung</h1></div></div><section class="decimal-shop-grid">${decimalItems.map(i=>{const owned=d.owned.includes(i.name),rank=decimalRank().rank,locked=rank<i.tier;return `<article class="shop-card decimal-shop-card ${locked?'locked':''}"><div class="decimal-item-icon">${i.icon}</div><div><h2>${i.name}</h2><p>⚔️ ${i.power} · 🛡️ ${i.defense} · 🍀 ${i.luck}</p>${owned?'<button class="button secondary" disabled>Bereits gekauft</button>':locked?`<button class="button secondary" disabled>Ab Rang ${i.tier}</button>`:`<button class="button gold" onclick="decimalBuy('${i.name}')">${i.cost} 🪙 kaufen</button>`}</div></article>`}).join('')}</section>`);}
function decimalBuy(name){const d=ensureDecimalData(),item=decimalItems.find(i=>i.name===name);if(!item||d.owned.includes(name))return;if(data.gold<item.cost){toast('Dafür hast du noch nicht genug Gold.');return}data.gold-=item.cost;d.owned.push(name);decimalSave();toast(`${name} gehört jetzt deinem Krieger!`);decimalShop();}

function decimalWorld(){const d=ensureDecimalData(),s=decimalStats();show(`${decimalTopbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="decimalHome()">←</button><div><div class="eyebrow">Kapitel 2</div><h1>Die Dezimalwelt</h1></div></div><section class="decimal-world-intro">${decimalWarrior('map')}<div><h2>Besiege die Komma-Wächter</h2><p>Deine Stärke: ⚔️ ${s.power} · Deine Verteidigung: 🛡️ ${s.defense}</p></div></section><section class="decimal-world-path">${decimalMonsters.map((m,index)=>{const cleared=d.cleared.includes(index),previous=index===0||d.cleared.includes(index-1),strong=s.power+s.defense>=m.need;const unlocked=previous&&strong;return `<article class="decimal-world-node ${cleared?'cleared':''} ${unlocked?'':'locked'}"><span class="node-number">${cleared?'✓':index+1}</span><span class="decimal-world-monster">${m.icon}</span><div><small>${m.place}</small><h2>${m.name}</h2><p>Empfohlene Kampfkraft: ${m.need}</p>${unlocked?`<button class="button ${cleared?'secondary':'decimal-button'}" onclick="startDecimalBattle(${index})">${cleared?'Noch einmal kämpfen':'Kampf starten'}</button>`:'<button class="button secondary" disabled>Gesperrt</button>'}</div></article>`}).join('')}</section>`);}
function startDecimalBattle(index){const monster=decimalMonsters[index],s=decimalStats(),maxPlayerHp=70+s.defense*4;startDecimalGame('test',{index,monster,monsterHp:monster.hp,playerHp:maxPlayerHp,maxPlayerHp});}

window.decimalHome=decimalHome;window.startDecimalGame=startDecimalGame;window.nextDecimalQuestion=nextDecimalQuestion;window.checkDecimalInput=checkDecimalInput;window.checkDecimalAnswer=checkDecimalAnswer;window.showDecimalHint=showDecimalHint;window.decimalInventory=decimalInventory;window.decimalEquip=decimalEquip;window.decimalUnequip=decimalUnequip;window.decimalShop=decimalShop;window.decimalBuy=decimalBuy;window.decimalWorld=decimalWorld;window.startDecimalBattle=startDecimalBattle;
