const app = document.querySelector('#app');
const saveKey = 'vokabelHeld';

const defaultData = {
  gold: 0,
  xp: 0,
  completed: 0,
  owned: [],
  equipped: {},
  cleared: [],
};

const items = [
  {name:'Lederhelm',slot:'helmet',cost:20,power:0,defense:2,luck:0,icon:'🪖'},
  {name:'Ritterhelm',slot:'helmet',cost:90,power:1,defense:5,luck:1,icon:'⛑️'},
  {name:'Drachenhelm',slot:'helmet',cost:240,power:3,defense:9,luck:1,icon:'🐲'},
  {name:'Holzschwert',slot:'weapon',cost:30,power:3,defense:0,luck:0,icon:'🗡️'},
  {name:'Silberschwert',slot:'weapon',cost:120,power:7,defense:0,luck:1,icon:'⚔️'},
  {name:'Heldenklinge',slot:'weapon',cost:320,power:12,defense:1,luck:2,icon:'🌟'},
  {name:'Holzschild',slot:'shield',cost:35,power:0,defense:3,luck:0,icon:'🛡️'},
  {name:'Löwenschild',slot:'shield',cost:135,power:1,defense:7,luck:1,icon:'🦁'},
  {name:'Sternenschild',slot:'shield',cost:340,power:2,defense:12,luck:2,icon:'💠'},
  {name:'Lederweste',slot:'armor',cost:55,power:0,defense:4,luck:0,icon:'🥋'},
  {name:'Plattenrüstung',slot:'armor',cost:180,power:2,defense:9,luck:0,icon:'🦾'},
  {name:'Königsrüstung',slot:'armor',cost:430,power:5,defense:14,luck:2,icon:'👑'},
  {name:'Reisestiefel',slot:'boots',cost:45,power:0,defense:1,luck:2,icon:'🥾'},
  {name:'Windstiefel',slot:'boots',cost:130,power:2,defense:2,luck:4,icon:'👢'},
  {name:'Blitzstiefel',slot:'boots',cost:300,power:4,defense:3,luck:7,icon:'⚡'},
];

const monsters = [
  {name:'Wort-Schleim',icon:'🟢',hp:35,attack:5,gold:35,xp:8,place:'Wörterwiese'},
  {name:'Übersetzungs-Goblin',icon:'👺',hp:70,attack:8,gold:70,xp:10,place:'Wörterwiese'},
  {name:'Buch-Skelett',icon:'💀',hp:120,attack:12,gold:115,xp:13,place:'Bücherwald'},
  {name:'Sprach-Troll',icon:'🧌',hp:180,attack:16,gold:175,xp:16,place:'Bücherwald'},
  {name:'Grammatik-Ritter',icon:'🛡️',hp:260,attack:21,gold:260,xp:20,place:'Sprachburg'},
  {name:'Vokabel-Drache',icon:'🐉',hp:380,attack:27,gold:420,xp:28,place:'Sprachburg'},
];

const trainingEnemies = {
  'de-en': {name:'Englisch-Kobold',icon:'👺',hp:45,attack:6},
  'en-de': {name:'Deutsch-Geist',icon:'👻',hp:45,attack:6},
};

const slotNames = {helmet:'Helm',weapon:'Schwert',shield:'Schild',armor:'Rüstung',boots:'Stiefel'};
const ranks = [
  {title:'Wortlehrling',xp:0},
  {title:'Sprachkämpfer',xp:25},
  {title:'Wortwächter',xp:70},
  {title:'Übersetzungsritter',xp:140},
  {title:'Vokabelheld',xp:240},
];

let data = normalize(JSON.parse(localStorage.getItem(saveKey) || '{}'));
let words = [];
let game = null;

function normalize(saved){
  return {
    ...defaultData,
    ...saved,
    owned:Array.isArray(saved.owned)?saved.owned:[],
    equipped:saved.equipped&&typeof saved.equipped==='object'?saved.equipped:{},
    cleared:Array.isArray(saved.cleared)?saved.cleared:[],
  };
}
function save(){localStorage.setItem(saveKey,JSON.stringify(data));}
function rankInfo(){let index=0;ranks.forEach((r,i)=>{if(data.xp>=r.xp)index=i});return {rank:index+1,...ranks[index],next:ranks[index+1]};}
function stats(){return Object.values(data.equipped).map(name=>items.find(i=>i.name===name)).filter(Boolean).reduce((s,i)=>({power:s.power+i.power,defense:s.defense+i.defense,luck:s.luck+i.luck}),{power:0,defense:0,luck:0});}
function equipped(slot){return items.find(i=>i.name===data.equipped[slot]);}
function heroMarkup(size='large'){
  return `<div class="pixel-knight ${size}"><span class="knight-head">${equipped('helmet')?'🪖':'🙂'}</span><span class="knight-body">${equipped('armor')?'🦾':'🟦'}</span><span class="knight-weapon">${equipped('weapon')?'⚔️':'🗡️'}</span><span class="knight-shield">${equipped('shield')?'🛡️':'◈'}</span><span class="knight-boots">${equipped('boots')?'👢':'🥾'}</span></div>`;
}
function topbar(){const r=rankInfo();return `<header class="topbar"><button class="brand" onclick="home()"><span>⚔️</span>Vokabel Held</button><div class="top-actions"><button class="rank-badge" onclick="home()">Rang ${r.rank} · ${r.title}</button><div class="coins">🪙 ${data.gold}</div></div></header>`;}
function show(html){app.innerHTML=html;}
function toast(text){const el=document.createElement('div');el.className='toast';el.textContent=text;document.body.append(el);requestAnimationFrame(()=>el.classList.add('show'));setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),300)},2200);}

async function loadWords(){if(words.length)return words;const response=await fetch('data/vocabulary.json?v=game-20260803');words=await response.json();return words;}

function home(){
  const r=rankInfo(),s=stats();
  show(`${topbar()}<section class="hero-banner"><div><div class="eyebrow">Englisch lernen als Abenteuer</div><h1>Willkommen, Vokabel Held!</h1><p>Wähle deine Übersetzungsrichtung, kämpfe gegen Wortmonster und sammle Gold für neue Ausrüstung.</p></div>${heroMarkup('banner')}</section><div class="progress-row"><div class="stat"><strong>Rang ${r.rank} · ${r.title}</strong><span>${r.next?`${r.next.xp-data.xp} XP bis ${r.next.title}`:'Höchster Rang erreicht'}</span></div><div class="stat"><strong>${data.completed}</strong><span>Vokabeln richtig gelöst</span></div><div class="stat"><strong>⚔️ ${s.power} · 🛡️ ${s.defense}</strong><span>deine Kampfwerte</span></div></div><h2 class="section-title">Wähle dein Training</h2><section class="mode-grid"><article class="mode-card"><div class="mode-icon">🇩🇪 ➜ 🇬🇧</div><h2>Deutsch → Englisch</h2><p>Ein deutsches Wort wird gezeigt. Wähle aus vier Antworten die richtige englische Übersetzung.</p><button class="button" onclick="startMode('de-en')">Training starten ⚔️</button></article><article class="mode-card"><div class="mode-icon">🇬🇧 ➜ 🇩🇪</div><h2>Englisch → Deutsch</h2><p>Ein englisches Wort wird gezeigt. Wähle aus vier Antworten die richtige deutsche Übersetzung.</p><button class="button" onclick="startMode('en-de')">Training starten ⚔️</button></article></section><h2 class="section-title">Deine Heldenburg</h2><div class="home-actions"><button class="button secondary" onclick="inventory()">🎒 Held ausrüsten</button><button class="button gold" onclick="shop()">🛒 Zum Shop</button><button class="button mint" onclick="worldMap()">🗺️ Zur Weltkarte</button><a class="button wiki-link" href="../">← Knowledge Wiki</a></div>`);
}

async function startMode(mode,battle=null){
  await loadWords();
  const enemy=battle?battle.monster:{...trainingEnemies[mode]};
  const s=stats();
  game={mode,battle,number:0,streak:0,enemy,maxEnemyHp:enemy.hp,enemyHp:enemy.hp,maxPlayerHp:70+s.defense*4,playerHp:70+s.defense*4,locked:false};
  nextQuestion();
}

function makeQuestion(){
  const word=words[Math.floor(Math.random()*words.length)];
  const source=game.mode==='de-en'?word.de:word.en;
  const targetKey=game.mode==='de-en'?'en':'de';
  const wrong=[...words].filter(item=>item[targetKey]!==word[targetKey]).sort(()=>Math.random()-.5).slice(0,3).map(item=>item[targetKey]);
  return {source,correct:word[targetKey],answers:[word[targetKey],...wrong].sort(()=>Math.random()-.5),category:word.category};
}

function nextQuestion(){
  game.number++;game.q=makeQuestion();game.locked=false;
  const e=game.enemy;
  show(`${topbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="${game.battle?'worldMap()':'home()'}">←</button><div><div class="eyebrow">${game.battle?'Bosskampf · '+e.place:(game.mode==='de-en'?'Deutsch → Englisch':'Englisch → Deutsch')}</div><h1>${game.battle?e.name:'Wortkampf'}</h1></div></div><section class="game-panel"><section class="battle-scene"><div class="fighter" id="heroFighter">${heroMarkup('battle')}<strong>Vokabel Held</strong><div class="health"><i id="heroHealth" style="width:${100*game.playerHp/game.maxPlayerHp}%"></i></div></div><div id="battleEffect" class="battle-effect">⚔️</div><div class="fighter" id="enemyFighter"><span class="monster">${e.icon}</span><strong>${e.name}</strong><div class="health"><i id="enemyHealth" style="width:${100*game.enemyHp/game.maxEnemyHp}%"></i></div></div></section><div class="game-status"><span>Aufgabe ${game.number}</span><span>🔥 Serie ${game.streak}</span><span>🪙 +${2+Math.floor(game.streak/5)}</span></div><div class="word-category">${game.q.category}</div><div class="question-word">${game.q.source}</div><p class="mission">Wähle die richtige Übersetzung.</p><div class="answer-grid">${game.q.answers.map(answer=>`<button class="answer-card" onclick='checkAnswer(${JSON.stringify(answer)})'>${answer}</button>`).join('')}</div><div id="feedback" class="feedback"></div></section>`);
}

function checkAnswer(answer){
  if(game.locked)return;game.locked=true;
  const correct=answer===game.q.correct;
  const feedback=document.querySelector('#feedback');
  document.querySelectorAll('.answer-card').forEach(button=>{button.disabled=true;if(button.textContent===game.q.correct)button.classList.add('correct');if(button.textContent===answer&&!correct)button.classList.add('wrong');});
  if(correct){
    game.streak++;const reward=2+Math.floor(game.streak/5);data.gold+=reward;data.xp++;data.completed++;save();updateCoins();feedback.className='feedback good';feedback.textContent=`Richtig! +${reward} Gold`;heroAttack();
  }else{
    game.streak=0;feedback.className='feedback try';feedback.textContent=`Noch nicht. Richtig ist: ${game.q.correct}`;enemyAttack();
  }
}
function updateCoins(){const coin=document.querySelector('.coins');if(coin)coin.textContent=`🪙 ${data.gold}`;}
function heroAttack(){
  const damage=10+stats().power+Math.floor(Math.random()*5);game.enemyHp=Math.max(0,game.enemyHp-damage);animateAttack('hero',damage);setTimeout(()=>{updateHealth();if(game.enemyHp<=0)enemyDefeated();else{game.locked=false;nextQuestion();}},750);
}
function enemyAttack(){
  const damage=Math.max(2,game.enemy.attack-stats().defense+Math.floor(Math.random()*4));game.playerHp=Math.max(0,game.playerHp-damage);animateAttack('enemy',damage);setTimeout(()=>{updateHealth();if(game.playerHp<=0)defeat();else{game.locked=false;nextQuestion();}},900);
}
function animateAttack(side,damage){
  const attacker=document.querySelector(side==='hero'?'#heroFighter':'#enemyFighter');const target=document.querySelector(side==='hero'?'#enemyFighter':'#heroFighter');const effect=document.querySelector('#battleEffect');attacker?.classList.add('attacking');target?.classList.add('hit');if(effect){effect.textContent=side==='hero'?`⚔️ -${damage}`:`💥 -${damage}`;effect.classList.add('active');}setTimeout(()=>{attacker?.classList.remove('attacking');target?.classList.remove('hit');effect?.classList.remove('active');},650);
}
function updateHealth(){const h=document.querySelector('#heroHealth'),e=document.querySelector('#enemyHealth');if(h)h.style.width=`${100*game.playerHp/game.maxPlayerHp}%`;if(e)e.style.width=`${100*game.enemyHp/game.maxEnemyHp}%`;}
function enemyDefeated(){
  if(game.battle){const m=game.enemy;if(!data.cleared.includes(game.battle.index))data.cleared.push(game.battle.index);data.gold+=m.gold;data.xp+=m.xp;save();show(`${topbar()}<section class="result-card"><div class="result-icon">🏆</div><h1>${m.name} besiegt!</h1><p>Du erhältst <strong>${m.gold} Gold</strong> und <strong>${m.xp} XP</strong>.</p><button class="button mint" onclick="worldMap()">Zur Weltkarte</button></section>`);return;}
  data.gold+=5;save();show(`${topbar()}<section class="result-card"><div class="result-icon">⭐</div><h1>Trainingsgegner besiegt!</h1><p>Bonus: <strong>5 Gold</strong>. Deine Serie startet mit einem neuen Gegner weiter.</p><button class="button" onclick="startMode('${game.mode}')">Weitertrainieren</button><button class="button secondary" onclick="home()">Zur Startseite</button></section>`);
}
function defeat(){show(`${topbar()}<section class="result-card defeat"><div class="result-icon">💫</div><h1>Der Held braucht eine Pause</h1><p>Trainiere weiter oder kaufe stärkere Ausrüstung im Shop.</p><button class="button" onclick="startMode('${game.mode}')">Noch einmal</button><button class="button gold" onclick="shop()">Zum Shop</button></section>`);}

function inventory(){
  const s=stats();
  show(`${topbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="home()">←</button><div><div class="eyebrow">Ausrüstung</div><h1>Heldenkammer</h1></div></div><section class="inventory-layout"><article class="hero-card">${heroMarkup()}<h2>Vokabel Held</h2><div class="attribute-row"><span>⚔️ ${s.power}</span><span>🛡️ ${s.defense}</span><span>🍀 ${s.luck}</span></div></article><article class="gear-panel"><h2>Angelegte Ausrüstung</h2><div class="slot-grid">${Object.entries(slotNames).map(([slot,label])=>{const item=equipped(slot);return `<article class="slot-card"><span>${label}</span>${item?`<div class="item-icon">${item.icon}</div><strong>${item.name}</strong><button class="button small secondary" onclick="unequip('${slot}')">Ablegen</button>`:'<em>leer</em>'}</article>`}).join('')}</div><h2>Deine Gegenstände</h2><div class="owned-grid">${data.owned.length?data.owned.map(name=>{const item=items.find(i=>i.name===name);return `<article class="owned-card"><div class="item-icon">${item.icon}</div><strong>${item.name}</strong><span>⚔️${item.power} · 🛡️${item.defense} · 🍀${item.luck}</span><button class="button small" onclick="equipItem('${item.name}')">Anlegen</button></article>`}).join(''):'<p>Noch keine Ausrüstung. Besuche den Shop.</p>'}</div></article></section>`);
}
function equipItem(name){const item=items.find(i=>i.name===name);if(!item)return;data.equipped[item.slot]=name;save();inventory();}
function unequip(slot){delete data.equipped[slot];save();inventory();}

function shop(){
  const r=rankInfo();
  show(`${topbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="home()">←</button><div><div class="eyebrow">Rüstungshändler</div><h1>Sir Wortos Waren</h1></div></div><section class="shop-grid">${items.map((item,index)=>{const owned=data.owned.includes(item.name),needed=Math.floor(index/3)+1,locked=r.rank<needed;return `<article class="shop-card ${locked?'locked':''}"><div class="item-icon">${item.icon}</div><div><h2>${item.name}</h2><p>⚔️ ${item.power} · 🛡️ ${item.defense} · 🍀 ${item.luck}</p>${locked?`<span class="locked-note">Ab Rang ${needed}</span>`:owned?`<button class="button small secondary" onclick="equipItem('${item.name}')">Anlegen</button>`:`<button class="button small gold" onclick="buyItem('${item.name}')">${item.cost} 🪙</button>`}</div></article>`}).join('')}</section>`);
}
function buyItem(name){const item=items.find(i=>i.name===name);if(!item||data.owned.includes(name))return;if(data.gold<item.cost){toast('Dafür reicht dein Gold noch nicht.');return}data.gold-=item.cost;data.owned.push(name);data.equipped[item.slot]=name;save();shop();toast(`${name} gekauft und angelegt!`);}

function worldMap(){
  show(`${topbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="home()">←</button><div><div class="eyebrow">Abenteuerwelt</div><h1>Die Länder der Wörter</h1></div></div><section class="world-path">${monsters.map((m,index)=>{const cleared=data.cleared.includes(index),unlocked=index===0||data.cleared.includes(index-1);return `<article class="world-node ${cleared?'cleared':''} ${!unlocked?'locked':''}"><div class="node-number">${cleared?'✓':index+1}</div><div class="node-monster">${m.icon}</div><div><small>${m.place}</small><h2>${m.name}</h2><p>❤️ ${m.hp} · ⚔️ ${m.attack} · 🪙 ${m.gold}</p>${unlocked?`<button class="button small" onclick="startBoss(${index})">${cleared?'Erneut kämpfen':'Kampf starten'}</button>`:'<span class="locked-note">🔒 Erst vorherigen Gegner besiegen</span>'}</div></article>`}).join('')}</section>`);
}
async function startBoss(index){await loadWords();const monster=monsters[index];startMode(index%2===0?'de-en':'en-de',{index,monster});}

window.home=home;window.startMode=startMode;window.checkAnswer=checkAnswer;window.inventory=inventory;window.equipItem=equipItem;window.unequip=unequip;window.shop=shop;window.buyItem=buyItem;window.worldMap=worldMap;window.startBoss=startBoss;
home();
