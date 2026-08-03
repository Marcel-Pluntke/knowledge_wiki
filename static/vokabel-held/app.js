const app=document.querySelector('#app');

function home(){
  app.innerHTML=`<section class="hero"><div><div class="eyebrow">Englisch lernen als Abenteuer</div><h1>Vokabel Held</h1><p>Wähle eine Richtung und trainiere englische Grundvokabeln mit vier Antwortmöglichkeiten.</p><a class="back" href="../">← Zurück zum Knowledge Wiki</a></div><div class="pixel-hero">🛡️🧑‍🚀</div></section><section class="mode-grid"><article class="mode-card"><div class="mode-icon">🇩🇪 ➜ 🇬🇧</div><h2>Deutsch → Englisch</h2><p>Ein deutsches Wort wird vorgegeben. Wähle die richtige englische Übersetzung.</p><button class="button" onclick="startMode('de-en')">Abenteuer starten</button></article><article class="mode-card"><div class="mode-icon">🇬🇧 ➜ 🇩🇪</div><h2>Englisch → Deutsch</h2><p>Ein englisches Wort wird vorgegeben. Wähle die richtige deutsche Übersetzung.</p><button class="button" onclick="startMode('en-de')">Abenteuer starten</button></article></section><div class="placeholder">Phase 1 ist angelegt. Vokabeln, Fortschritt und Spieloberfläche werden als Nächstes ergänzt.</div>`;
}

async function startMode(mode){
  const response=await fetch('data/vocabulary.json');
  const words=await response.json();
  const word=words[Math.floor(Math.random()*words.length)];
  const source=mode==='de-en'?word.de:word.en;
  const targetKey=mode==='de-en'?'en':'de';
  const wrong=[...words].filter(item=>item[targetKey]!==word[targetKey]).sort(()=>Math.random()-.5).slice(0,3).map(item=>item[targetKey]);
  const answers=[word[targetKey],...wrong].sort(()=>Math.random()-.5);
  app.innerHTML=`<section class="hero"><div><div class="eyebrow">${mode==='de-en'?'Deutsch → Englisch':'Englisch → Deutsch'}</div><h1>${source}</h1><p>Wähle die richtige Übersetzung.</p></div><div class="pixel-hero">⚔️</div></section><section class="mode-grid">${answers.map(answer=>`<article class="mode-card"><h2>${answer}</h2><button class="button" onclick='checkAnswer(${JSON.stringify(answer)},${JSON.stringify(word[targetKey])},${JSON.stringify(mode)})'>Auswählen</button></article>`).join('')}</section><button class="button" style="margin-top:22px" onclick="home()">Zurück</button>`;
}

function checkAnswer(answer,correct,mode){
  alert(answer===correct?'Richtig! ⚔️':'Noch nicht. Richtig wäre: '+correct);
  startMode(mode);
}

window.home=home;window.startMode=startMode;window.checkAnswer=checkAnswer;home();
