const decimalTrainingEnemies = {
  place: {name:'Stellenwert-Goblin',icon:'👺',hp:36,attack:4},
  compare: {name:'Vergleichs-Ritter',icon:'🛡️',hp:42,attack:5},
  add: {name:'Gold-Gnom',icon:'🧌',hp:48,attack:6},
  sub: {name:'Rüstungs-Räuber',icon:'🥷',hp:48,attack:6},
  shift: {name:'Komma-Geist',icon:'👻',hp:54,attack:7},
  test: {name:'Prüfungs-Ork',icon:'👹',hp:65,attack:8},
};

const originalStartDecimalGame = startDecimalGame;
const originalNextDecimalQuestion = nextDecimalQuestion;
const originalCheckDecimalAnswer = checkDecimalAnswer;

function decimalTrainingBattle(mode){
  const enemy=decimalTrainingEnemies[mode]||decimalTrainingEnemies.test;
  const stats=decimalStats();
  const maxPlayerHp=42+stats.defense*3;
  return {
    training:true,
    monster:{...enemy},
    monsterHp:enemy.hp,
    playerHp:maxPlayerHp,
    maxPlayerHp,
    defeated:0,
  };
}

startDecimalGame = function(mode,battle=null){
  if(battle){ originalStartDecimalGame(mode,battle); return; }
  decimalGame={mode,battle:decimalTrainingBattle(mode),number:0,streak:0};
  nextDecimalQuestion();
};

function decimalTrainingScene(b){
  return `<section class="decimal-battle-scene decimal-training-scene" id="decimalTrainingScene">
    <div class="decimal-fighter decimal-player-fighter" id="decimalPlayerFighter">
      ${decimalWarrior('battle')}
      <strong>Dezimal-Krieger</strong>
      <div class="health"><i style="width:${100*b.playerHp/b.maxPlayerHp}%"></i></div>
      <small>${b.playerHp}/${b.maxPlayerHp} Leben</small>
    </div>
    <div class="decimal-training-center">
      <div class="battle-sparks" id="decimalBattleEffect">✦ ⚔ ✦</div>
      <div class="training-reward">🪙 Richtige Aufgabe: mindestens 2 Gold</div>
    </div>
    <div class="decimal-fighter decimal-enemy-fighter" id="decimalEnemyFighter">
      <span class="decimal-monster">${b.monster.icon}</span>
      <strong>${b.monster.name}</strong>
      <div class="health"><i style="width:${100*b.monsterHp/b.monster.hp}%"></i></div>
      <small>${b.monsterHp}/${b.monster.hp} Leben</small>
    </div>
  </section>`;
}

nextDecimalQuestion = function(){
  if(!decimalGame?.battle?.training){ originalNextDecimalQuestion(); return; }
  decimalGame.number++;
  decimalGame.q=makeDecimalQuestion(decimalGame.mode);
  const q=decimalGame.q,b=decimalGame.battle;
  const answer=q.type==='choice'
    ? `<div class="decimal-choice-grid">${q.choices.map(c=>`<button class="decimal-choice" onclick='checkDecimalAnswer(${JSON.stringify(c)})'>${typeof c==='number'?decimalFmt(c,4):c}</button>`).join('')}</div>`
    : `<div class="decimal-answer-row"><input id="decimalAnswer" class="decimal-answer" inputmode="decimal" autocomplete="off" placeholder="Antwort"><button class="button decimal-button" onclick="checkDecimalInput()">Angreifen ⚔️</button></div>`;
  show(`${decimalTopbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="decimalHome()">←</button><div><div class="eyebrow">Übungskampf · ${decimalModes[decimalGame.mode].title}</div><h1>${b.monster.name}</h1></div></div><section class="game-panel decimal-game-panel">${decimalTrainingScene(b)}<div class="game-status"><span>Aufgabe ${decimalGame.number}</span><span>🔥 Serie ${decimalGame.streak}</span><span>🏆 Gegner besiegt: ${b.defeated}</span></div><div class="decimal-question">${q.prompt}</div>${answer}<div id="decimalFeedback" class="feedback"></div><button class="button secondary decimal-help" onclick="showDecimalHint()">💡 Hilfe anzeigen</button><div id="decimalHint" class="help-panel"></div></section>`);
  const input=document.querySelector('#decimalAnswer');
  if(input){input.focus();input.addEventListener('keydown',e=>{if(e.key==='Enter')checkDecimalInput()});}
};

function decimalTrainingAnimation(kind,damage,gold=0){
  const player=document.querySelector('#decimalPlayerFighter');
  const enemy=document.querySelector('#decimalEnemyFighter');
  const effect=document.querySelector('#decimalBattleEffect');
  if(kind==='hero'){
    player?.classList.add('decimal-attack-right');
    enemy?.classList.add('decimal-hit');
    if(effect)effect.innerHTML=`<span class="decimal-slash">⚔️</span><b>-${damage}</b>${gold?`<em>+${gold} 🪙</em>`:''}`;
  }else{
    enemy?.classList.add('decimal-attack-left');
    player?.classList.add('decimal-hit');
    if(effect)effect.innerHTML=`<span class="decimal-impact">💥</span><b>-${damage}</b>`;
  }
}

checkDecimalAnswer = function(value){
  if(!decimalGame?.battle?.training){ originalCheckDecimalAnswer(value); return; }
  const q=decimalGame.q,feedback=document.querySelector('#decimalFeedback');
  if(value===null){feedback.className='feedback try';feedback.textContent='Bitte gib eine gültige Zahl ein.';return;}
  const correct=typeof q.answer==='number'?Math.abs(Number(value)-q.answer)<1e-6:value===q.answer;
  const b=decimalGame.battle;
  document.querySelectorAll('.decimal-choice,.decimal-answer,.decimal-answer-row .button').forEach(el=>el.disabled=true);
  if(correct){
    decimalGame.streak++;
    const stats=decimalStats();
    const damage=10+stats.power+Math.floor(Math.random()*5);
    const gold=2+(decimalGame.streak%5===0?3:0);
    b.monsterHp=Math.max(0,b.monsterHp-damage);
    const d=ensureDecimalData();d.completed++;d.xp++;data.gold+=gold;
    feedback.className='feedback good';
    feedback.textContent=`Treffer! ${damage} Schaden und +${gold} Gold. ⚔️`;
    if(b.monsterHp<=0){
      b.defeated++;
      data.gold+=5;
      feedback.textContent+=` ${b.monster.name} besiegt – zusätzlich +5 Gold!`;
      b.monsterHp=b.monster.hp;
      b.playerHp=Math.min(b.maxPlayerHp,b.playerHp+8);
    }
    decimalSave();
    decimalTrainingAnimation('hero',damage,gold);
    setTimeout(nextDecimalQuestion,950);
  }else{
    decimalGame.streak=0;
    const stats=decimalStats();
    const damage=Math.max(2,b.monster.attack-Math.floor(stats.defense/3));
    b.playerHp=Math.max(0,b.playerHp-damage);
    feedback.className='feedback try';
    feedback.textContent=`Noch nicht. ${b.monster.name} trifft dich mit ${damage} Schaden. Richtig ist ${typeof q.answer==='number'?decimalFmt(q.answer,5):q.answer}.`;
    decimalTrainingAnimation('monster',damage);
    if(b.playerHp<=0){
      feedback.textContent+=' Dein Krieger sammelt sich und startet mit voller Energie neu.';
      b.playerHp=b.maxPlayerHp;
      b.monsterHp=b.monster.hp;
    }
    setTimeout(nextDecimalQuestion,1450);
  }
};

window.startDecimalGame=startDecimalGame;
window.nextDecimalQuestion=nextDecimalQuestion;
window.checkDecimalAnswer=checkDecimalAnswer;
