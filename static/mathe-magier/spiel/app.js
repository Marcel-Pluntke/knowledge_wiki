const modes = {
  add: { title: 'Zauber-Mischung', icon: '🧪', text: 'Füge zwei Zaubertränke zusammen!', op: '+' },
  sub: { title: 'Drachenbiss', icon: '🐉', text: 'Nimm dem Drachen einen Teil seiner Energie ab!', op: '−' },
  mul: { title: 'Kristall-Kopie', icon: '💎', text: 'Vervielfache magische Kristalle!', op: '×' },
  div: { title: 'Portal-Teiler', icon: '🌀', text: 'Verteile Magie gleichmäßig durch Portale!', op: '÷' },
  reduce: { title: 'Kürzungs-Kobold', icon: '👺', text: 'Besiege den Kobold: Kürze seinen Bruch!', op: '=' },
  test: { title: 'Meisterprüfung', icon: '🏆', text: 'Alle Zauberarten warten auf dich!', op: '?' },
};

const items = [
  {name:'Lehrlingshut', slot:'hut', tier:1, cost:15, power:0, defense:0, luck:1, text:'Der erste Hut eines Zauberlehrlings.'},
  {name:'Mondkrone', slot:'hut', tier:2, cost:80, power:1, defense:1, luck:3, text:'Sie glitzert bei jeder richtigen Antwort.'},
  {name:'Saphirkrone', slot:'hut', tier:3, cost:215, power:3, defense:2, luck:3, text:'Für Magier, die bis zur Drachenfeste reisen.'},
  {name:'Sternenstab', slot:'weapon', tier:1, cost:35, power:2, defense:0, luck:0, text:'Macht deine Zauber stärker.'},
  {name:'Blitzstab', slot:'weapon', tier:2, cost:105, power:5, defense:0, luck:1, text:'Ein Funke wird zum Rechenblitz.'},
  {name:'Kometenstab', slot:'weapon', tier:3, cost:270, power:8, defense:0, luck:2, text:'Sein Zauber schlägt wie ein Komet ein.'},
  {name:'Drachenumhang', slot:'cloak', tier:1, cost:60, power:0, defense:3, luck:0, text:'Warm, geheimnisvoll und drachenstark.'},
  {name:'Sternenumhang', slot:'cloak', tier:2, cost:130, power:2, defense:4, luck:1, text:'Schützt den Magier unter Sternenlicht.'},
  {name:'Schattenmantel', slot:'cloak', tier:3, cost:310, power:4, defense:7, luck:1, text:'Macht dich stark gegen finstere Gegner.'},
  {name:'Holzschild', slot:'shield', tier:1, cost:40, power:0, defense:2, luck:0, text:'Hält kleine Koboldhiebe ab.'},
  {name:'Goldener Schild', slot:'shield', tier:2, cost:150, power:1, defense:6, luck:0, text:'Der Schutz für echte Brüche-Helden.'},
  {name:'Runenschild', slot:'shield', tier:3, cost:365, power:3, defense:9, luck:1, text:'Alte Runen halten mächtige Treffer ab.'},
  {name:'Wolkenstiefel', slot:'boots', tier:1, cost:55, power:0, defense:1, luck:2, text:'Sie tragen dich schnell über die Karte.'},
  {name:'Drachenstiefel', slot:'boots', tier:2, cost:125, power:2, defense:2, luck:2, text:'Festes Schuhwerk für hohe Berge.'},
  {name:'Phönixstiefel', slot:'boots', tier:3, cost:295, power:4, defense:4, luck:4, text:'Sie tragen dich durch jede Feuerprobe.'},
  {name:'Glücksklee-Amulett', slot:'amulet', tier:1, cost:70, power:0, defense:0, luck:4, text:'Ein wenig Glück kann nie schaden.'},
  {name:'Sonnenamulett', slot:'amulet', tier:2, cost:165, power:3, defense:2, luck:3, text:'Ein heller Schutz gegen dunkle Monster.'},
  {name:'Sternensiegel', slot:'amulet', tier:3, cost:410, power:5, defense:3, luck:5, text:'Das seltenste Amulett des magischen Kobolds.'},
];

const monsters = [
  {name:'Kürzungs-Kobold', hp:30, attack:4, gold:35, rankBonus:6, needPower:0, needDefense:0, place:'Klee-Wald', attackName:'Kieselwurf', rule:'normal', ruleText:'Kieselwurf: ein fairer, normaler Gegenangriff.', description:'Der kleine Kobold hüpft flink zwischen den Bruchbalken.'},
  {name:'Rechen-Schleim', hp:65, attack:7, gold:65, rankBonus:6, needPower:2, needDefense:0, place:'Klee-Wald', attackName:'Teilungssprung', rule:'slime', ruleText:'Teilungssprung: Bei der ersten falschen Antwort heilt er 5 Leben.', description:'Ein wackeliger Schleim, der sich bei Fehlern einmal teilt.'},
  {name:'Nenner-Troll', hp:105, attack:10, gold:100, rankBonus:8, needPower:4, needDefense:2, place:'Smaragd-Höhle', attackName:'Nennerhammer', rule:'troll', ruleText:'Nennerhammer: Er ignoriert einen kleinen Teil deines Schutzes.', description:'Ein Felsentroll mit einem Hammer aus schweren Nennern.'},
  {name:'Bruch-Basilisk', hp:150, attack:13, gold:145, rankBonus:8, needPower:6, needDefense:4, place:'Smaragd-Höhle', attackName:'Zählerblick', rule:'basilisk', ruleText:'Zählerblick: Jeder dritte Angriff ist um 2 Schaden stärker.', description:'Sein leuchtender Blick zählt jeden deiner Zauberzüge.'},
  {name:'Klammer-Golem', hp:205, attack:16, gold:195, rankBonus:10, needPower:8, needDefense:6, place:'Zahlen-Gebirge', attackName:'Steinpanzer', rule:'golem', ruleText:'Steinpanzer: Jeder Zaubertreffer richtet 2 Schaden weniger an.', description:'Sein Steinpanzer lässt nur starke Zauber hindurch.'},
  {name:'Zahlen-Greif', hp:270, attack:19, gold:260, rankBonus:10, needPower:11, needDefense:8, place:'Zahlen-Gebirge', attackName:'Zahlenwind', rule:'griffin', ruleText:'Zahlenwind: Der dritte Angriff ist angekündigt und um 3 Schaden stärker.', description:'Der Greif sammelt sichtbar Wind für seinen starken Flügelschlag.'},
  {name:'Schatten-Magier', hp:350, attack:23, gold:340, rankBonus:12, needPower:15, needDefense:10, place:'Drachenfeste', attackName:'Schattenzauber', rule:'shadow', ruleText:'Schattenzauber: Nach einer falschen Antwort trifft sein nächster Angriff um 2 stärker.', description:'Er lädt aus einem Fehler einen einzelnen Schattenzauber auf.'},
  {name:'Brüche-Drache', hp:450, attack:28, gold:450, rankBonus:12, needPower:20, needDefense:13, place:'Drachenfeste', attackName:'Bruchfeuer', rule:'dragon', ruleText:'Bruchfeuer: Unter halbem Leben beginnt seine Feuerphase mit +2 Schaden.', description:'Der Drache entfacht sein Bruchfeuer, wenn sein Schatz in Gefahr ist.'},
];

const zones = [
  {name:'Klee-Wald', base:'#3d975c', accent:'#82d66b', detail:'#256b48', bosses:[0,1]},
  {name:'Smaragd-Höhle', base:'#23636b', accent:'#4eb5a6', detail:'#183f59', bosses:[2,3]},
  {name:'Zahlen-Gebirge', base:'#7d689a', accent:'#b8a5dc', detail:'#4d496d', bosses:[4,5]},
  {name:'Drachenfeste', base:'#8b4e59', accent:'#d37668', detail:'#54283d', bosses:[6,7]},
];
const zoneObstacles = [
  [{x:245,y:145,w:125,h:72},{x:440,y:254,w:100,h:74},{x:625,y:88,w:126,h:60}],
  [{x:185,y:102,w:160,h:88},{x:410,y:340,w:145,h:72},{x:668,y:220,w:92,h:96}],
  [{x:190,y:292,w:126,h:90},{x:398,y:114,w:148,h:82},{x:650,y:360,w:126,h:64}],
  [{x:205,y:104,w:145,h:88},{x:400,y:280,w:132,h:94},{x:670,y:84,w:120,h:78}],
];
const bossPositions = [{x:690,y:350},{x:765,y:160},{x:660,y:305},{x:775,y:145},{x:680,y:350},{x:760,y:145},{x:660,y:315},{x:780,y:145}];
const ranks = [
  {title:'Zauberlehrling', xp:0}, {title:'Waldwächter', xp:20}, {title:'Höhlenhüter', xp:60}, {title:'Gipfelmagier', xp:120}, {title:'Drachenmeister', xp:180}
];
const defaultData = {gold:0, completed:0, rankXp:0, owned:[], equipped:{}, cleared:[], world:{zone:0,x:110,y:405}};
const app = document.querySelector('#app');
const localSaveKey = 'matheMagier';
let data = normalize(JSON.parse(localStorage.getItem(localSaveKey) || '{}'));
let game = null, worldActive = false, worldFrame = null, keyHandler = null, dragState = null, dragGhost = null;
let currentUser = null, firebaseServices = null, cloudSaveTimer = null, appStarted = false;

function normalize(saved) {
  const merged = {...defaultData, ...saved, world:{...defaultData.world,...saved.world}};
  const legacyItemNames = {Zauberhut:'Lehrlingshut'};
  if (Array.isArray(merged.equipped)) { const old=merged.equipped; merged.equipped={}; old.forEach(name=>{const migratedName=legacyItemNames[name]||name,item=items.find(i=>i.name===migratedName);if(item)merged.equipped[item.slot]=migratedName;}); }
  if (!Array.isArray(merged.owned)) merged.owned=[];
  merged.owned=[...new Set(merged.owned.map(name=>legacyItemNames[name]||name).filter(name=>items.some(item=>item.name===name)))];
  const validEquipped={};
  Object.entries(merged.equipped||{}).forEach(([slot,name])=>{const migratedName=legacyItemNames[name]||name,item=items.find(candidate=>candidate.name===migratedName);if(item&&item.slot===slot)validEquipped[slot]=migratedName;});
  merged.equipped=validEquipped;
  Object.values(validEquipped).forEach(name=>{if(!merged.owned.includes(name))merged.owned.push(name);});
  if (!Array.isArray(merged.cleared)) merged.cleared=[];
  merged.cleared=[...new Set(merged.cleared.filter(index=>Number.isInteger(index)&&monsters[index]))].sort((a,b)=>a-b);
  const completed=Math.max(0,Number(merged.completed)||0),hasSavedRank=Number.isFinite(Number(saved.rankXp));
  merged.completed=completed;
  merged.rankXp=hasSavedRank?Math.max(completed,Number(saved.rankXp)):completed+merged.cleared.reduce((sum,index)=>sum+monsters[index].rankBonus,0);
  return merged;
}
function save(){
  localStorage.setItem(localSaveKey, JSON.stringify(data));
  if (!currentUser || !firebaseServices) return;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(saveToCloud, 450);
}

async function saveToCloud(){
  if (!currentUser || !firebaseServices) return;
  try {
    await firebaseServices.setDoc(
      firebaseServices.doc(firebaseServices.db, 'players', currentUser.uid),
      {game:data, updatedAt:firebaseServices.serverTimestamp(), version:1},
      {merge:true},
    );
  } catch (error) {
    console.warn('Spielstand konnte gerade nicht in die Wolke gespeichert werden.', error);
  }
}
const gcd = (a,b) => b ? gcd(b,a%b) : Math.abs(a);
const simplify = f => {const sign=f.d<0?-1:1,g=gcd(f.n,f.d);return {n:sign*f.n/g,d:Math.abs(f.d/g)}};
const rand = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
const fmt = f => f.d===1?String(f.n):`${f.n}/${f.d}`;
const fractionHtml = f => f.d===1?`<span class="whole-number">${f.n}</span>`:`<span class="stacked-fraction"><span>${f.n}</span><span>${f.d}</span></span>`;
function show(html) {
  stopWorld();
  app.innerHTML=html;
  if (currentUser) {
    const actions = app.querySelector('.top-actions');
    if (actions) {
      const signOutButton = document.createElement('button');
      signOutButton.className = 'map-link sign-out-link';
      signOutButton.textContent = 'Abmelden';
      signOutButton.addEventListener('click', signOutPlayer);
      actions.append(signOutButton);
    }
  }
  requestAnimationFrame(paintSpriteCanvases);
}
const topbar = () => {const r=rankInfo();return `<header class="topbar"><button class="brand brand-button" onclick="home()"><span class="brand-mark">✦</span>Mathe Magier</button><div class="top-actions"><button class="rank-badge" onclick="home()">Rang ${r.rank} · ${r.title}</button><button class="map-link" onclick="atlasMap()">🗺️ Große Karte</button><div class="coins">🪙 ${data.gold}</div></div></header>`};
const toast = text => {const el=document.createElement('div');el.className='toast';el.textContent=text;document.body.append(el);requestAnimationFrame(()=>el.classList.add('show'));setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),300)},3100)};
const bar = f => `<div class="fraction-viz">${Array.from({length:Math.min(f.d,12)},(_,i)=>`<span class="fraction-piece ${i<Math.min(f.n,f.d)?'filled':''}"></span>`).join('')}</div>`;
const stats = () => Object.values(data.equipped).map(name=>items.find(i=>i.name===name)).filter(Boolean).reduce((s,i)=>({power:s.power+i.power,defense:s.defense+i.defense,luck:s.luck+i.luck}),{power:0,defense:0,luck:0});
const rankInfo = (xp=data.rankXp) => {let index=0;for(let i=0;i<ranks.length;i++)if(xp>=ranks[i].xp)index=i;const current=ranks[index],next=ranks[index+1];return {rank:index+1,title:current.title,xp,next,progress:next?Math.min(100,Math.round((xp-current.xp)/(next.xp-current.xp)*100)):100};};
const rankAtLeast = rank => rankInfo().rank>=rank;
const zoneRank = zone => zone+1;
const zoneUnlocked = zone => zone===0||(data.cleared.includes((zone-1)*2+1)&&rankAtLeast(zoneRank(zone)));
const slotNames = {hut:'Kopf',weapon:'Stab',cloak:'Umhang',shield:'Schild',boots:'Stiefel',amulet:'Amulett'};
const equippedItem = slot => items.find(i=>i.name===data.equipped[slot]);

function heroCanvas(size='large') {const dims=size==='banner'?'170,180':size==='map'?'110,120':'190,210';return `<canvas class="pixel-hero ${size}" data-hero width="${dims.split(',')[0]}" height="${dims.split(',')[1]}"></canvas>`}
function itemCanvas(item, small=false) {return `<canvas class="pixel-item ${small?'small-art':''}" data-item="${item.name}" width="${small?58:78}" height="${small?58:78}"></canvas>`}
function colorFor(item) {if(!item)return '#8755cc'; const score=item.power*7+item.defense*4+item.luck*2;return score>52?'#ffe36e':score>35?'#ff9e4a':score>18?'#6ee4d2':'#a984ff'}
function px(ctx,x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function drawHero(ctx,x,y,scale=1,facing='down') {
  const cloak=equippedItem('cloak'),hat=equippedItem('hut'),weapon=equippedItem('weapon'),shield=equippedItem('shield'),boots=equippedItem('boots'),amulet=equippedItem('amulet');
  ctx.imageSmoothingEnabled=false;
  if(cloak){px(ctx,x-12*scale,y+21*scale,25*scale,23*scale,colorFor(cloak));px(ctx,x-15*scale,y+29*scale,31*scale,14*scale,colorFor(cloak));}
  if(boots){px(ctx,x-9*scale,y+45*scale,7*scale,5*scale,colorFor(boots));px(ctx,x+3*scale,y+45*scale,7*scale,5*scale,colorFor(boots));}
  px(ctx,x-10*scale,y+19*scale,21*scale,28*scale,'#5e70c8');px(ctx,x-8*scale,y+22*scale,17*scale,9*scale,'#8da4ff');
  px(ctx,x-9*scale,y+5*scale,19*scale,16*scale,'#f3b779');px(ctx,x-7*scale,y+7*scale,15*scale,11*scale,'#ffd296');px(ctx,x-4*scale,y+13*scale,2*scale,2*scale,'#302642');px(ctx,x+4*scale,y+13*scale,2*scale,2*scale,'#302642');
  if(hat){px(ctx,x-13*scale,y,26*scale,8*scale,colorFor(hat));px(ctx,x-9*scale,y-7*scale,18*scale,9*scale,colorFor(hat));px(ctx,x-4*scale,y-12*scale,8*scale,6*scale,colorFor(hat));}
  if(amulet){px(ctx,x-2*scale,y+24*scale,5*scale,5*scale,colorFor(amulet));}
  if(shield){px(ctx,x-17*scale,y+26*scale,8*scale,14*scale,colorFor(shield));px(ctx,x-19*scale,y+29*scale,12*scale,7*scale,colorFor(shield));}
  if(weapon){px(ctx,x+14*scale,y+20*scale,3*scale,29*scale,'#9a6139');px(ctx,x+10*scale,y+17*scale,10*scale,8*scale,colorFor(weapon));px(ctx,x+12*scale,y+14*scale,6*scale,5*scale,'#fff0a8');}
}
function merchantCanvas(){return '<canvas class="merchant-canvas" data-merchant width="210" height="210" aria-label="Kobold Kuno hinter seinem Verkaufstresen"></canvas>'}
function drawMerchant(ctx){const w=ctx.canvas.width;ctx.clearRect(0,0,w,ctx.canvas.height);ctx.imageSmoothingEnabled=false;for(let x=0;x<w;x+=18)for(let y=0;y<ctx.canvas.height;y+=18)px(ctx,x,y,16,16,(x+y)%36?'#6e3f2d':'#814d33');px(ctx,12,158,186,45,'#66351f');px(ctx,20,166,170,7,'#d18b42');px(ctx,95,40,28,22,'#8ccf67');px(ctx,78,61,64,63,'#64af56');px(ctx,60,70,25,19,'#64af56');px(ctx,135,70,25,19,'#64af56');px(ctx,87,82,11,8,'#29213d');px(ctx,123,82,11,8,'#29213d');px(ctx,99,104,22,6,'#3c2330');px(ctx,88,115,45,18,'#ecb56f');px(ctx,78,132,65,28,'#6b55b7');px(ctx,24,126,38,27,'#e3a645');px(ctx,30,116,26,12,'#ffe17b');px(ctx,146,123,35,31,'#b67540');px(ctx,153,111,20,13,'#ffe17b');px(ctx,95,25,28,15,'#8b5fc7');px(ctx,86,34,46,12,'#8b5fc7');px(ctx,101,21,10,7,'#ffe787');}
function drawItem(ctx,item) {
  const c=colorFor(item),w=ctx.canvas.width,s=w/78,rank=items.filter(candidate=>candidate.slot===item.slot).findIndex(candidate=>candidate.name===item.name),dark='#342343',gold='#fff0a6',shine='#ffffff';
  ctx.clearRect(0,0,w,ctx.canvas.height);ctx.imageSmoothingEnabled=false;
  // Der Ausrüstungsplatz heißt in den Spieldaten "hut" (nicht "hat").
  // Dadurch wurden Hüte und Kronen zwar angelegt, aber ihre Pixelgrafik nie gezeichnet.
  if(item.slot==='hut'){
    if(rank===0){px(ctx,11*s,48*s,56*s,10*s,c);px(ctx,24*s,25*s,29*s,24*s,c);px(ctx,37*s,11*s,12*s,16*s,c);px(ctx,23*s,42*s,31*s,5*s,'#d9b65d');}
    if(rank===1){px(ctx,13*s,45*s,52*s,12*s,'#d9b84f');px(ctx,18*s,24*s,10*s,24*s,c);px(ctx,34*s,15*s,10*s,33*s,c);px(ctx,50*s,24*s,10*s,24*s,c);px(ctx,35*s,31*s,8*s,8*s,gold);}
    if(rank===2){px(ctx,10*s,47*s,58*s,11*s,c);[18,31,44,57].forEach((x,i)=>{px(ctx,x*s,(20-(i%2)*7)*s,8*s,29*s,c)});px(ctx,34*s,31*s,10*s,10*s,'#75dfff');}
  }
  if(item.slot==='weapon'){
    px(ctx,37*s,24*s,7*s,48*s,'#8d5c37');
    if(rank===0){px(ctx,20*s,12*s,40*s,22*s,c);px(ctx,28*s,4*s,24*s,13*s,gold);px(ctx,34*s,8*s,12*s,5*s,shine);}
    if(rank===1){px(ctx,40*s,4*s,10*s,25*s,gold);px(ctx,32*s,10*s,11*s,14*s,gold);px(ctx,47*s,20*s,10*s,15*s,gold);px(ctx,42*s,5*s,5*s,9*s,shine);}
    if(rank===2){px(ctx,19*s,6*s,36*s,16*s,c);px(ctx,12*s,13*s,34*s,12*s,'#ff8b50');px(ctx,48*s,3*s,14*s,14*s,shine);px(ctx,26*s,10*s,10*s,5*s,gold);}
  }
  if(item.slot==='cloak'){
    px(ctx,18*s,16*s,42*s,48*s,c);px(ctx,11*s,59*s,56*s,9*s,c);px(ctx,27*s,9*s,24*s,9*s,gold);
    if(rank===0){px(ctx,32*s,25*s,14*s,23*s,'#7f4d34');}
    if(rank===1){[25,45,35].forEach((x,i)=>{px(ctx,x*s,(28+i*9)*s,5*s,5*s,shine)});}
    if(rank===2){px(ctx,29*s,27*s,18*s,18*s,dark);px(ctx,34*s,31*s,7*s,7*s,'#b58dff');}
  }
  if(item.slot==='shield'){
    px(ctx,18*s,18*s,42*s,39*s,c);px(ctx,25*s,11*s,28*s,9*s,c);px(ctx,26*s,54*s,26*s,12*s,c);
    if(rank===0){px(ctx,36*s,22*s,6*s,32*s,'#8b5b37');px(ctx,25*s,34*s,28*s,6*s,'#8b5b37');}
    if(rank===1){px(ctx,25*s,23*s,28*s,8*s,gold);px(ctx,29*s,38*s,20*s,8*s,gold);px(ctx,34*s,29*s,10*s,20*s,shine);}
    if(rank===2){px(ctx,27*s,26*s,8*s,8*s,shine);px(ctx,44*s,26*s,8*s,8*s,shine);px(ctx,35*s,42*s,10*s,10*s,shine);}
  }
  if(item.slot==='boots'){
    px(ctx,13*s,41*s,21*s,24*s,c);px(ctx,44*s,41*s,21*s,24*s,c);px(ctx,8*s,62*s,30*s,8*s,c);px(ctx,40*s,62*s,30*s,8*s,c);
    if(rank===0){px(ctx,12*s,55*s,22*s,6*s,shine);px(ctx,44*s,55*s,22*s,6*s,shine);}
    if(rank===1){[17,25,48,56].forEach((x,i)=>px(ctx,x*s,(47+(i%2)*8)*s,5*s,5*s,gold));}
    if(rank===2){px(ctx,14*s,31*s,18*s,12*s,'#ff7657');px(ctx,46*s,31*s,18*s,12*s,'#ff7657');px(ctx,18*s,25*s,10*s,10*s,gold);px(ctx,50*s,25*s,10*s,10*s,gold);}
  }
  if(item.slot==='amulet'){
    px(ctx,36*s,8*s,6*s,32*s,gold);px(ctx,20*s,36*s,38*s,29*s,c);
    if(rank===0){px(ctx,30*s,30*s,18*s,15*s,'#63d890');px(ctx,24*s,37*s,12*s,12*s,'#63d890');px(ctx,43*s,37*s,12*s,12*s,'#63d890');}
    if(rank===1){px(ctx,30*s,42*s,18*s,18*s,gold);px(ctx,35*s,37*s,8*s,28*s,'#ff9854');px(ctx,25*s,47*s,28*s,8*s,'#ff9854');}
    if(rank===2){px(ctx,33*s,39*s,12*s,22*s,shine);px(ctx,25*s,46*s,28*s,8*s,shine);px(ctx,29*s,42*s,20*s,16*s,shine);}
  }
}
function paintSpriteCanvases(){document.querySelectorAll('canvas[data-hero]').forEach(c=>{const ctx=c.getContext('2d'),scale=Math.min(c.width/48,c.height/60);ctx.clearRect(0,0,c.width,c.height);drawHero(ctx,c.width/2,c.height/2-20*scale,scale)});document.querySelectorAll('canvas[data-item]').forEach(c=>drawItem(c.getContext('2d'),items.find(i=>i.name===c.dataset.item)));document.querySelectorAll('canvas[data-merchant]').forEach(c=>drawMerchant(c.getContext('2d')));document.querySelectorAll('canvas[data-boss-preview]').forEach(c=>{const ctx=c.getContext('2d');ctx.fillStyle='#1f2445';ctx.fillRect(0,0,c.width,c.height);drawMonster(ctx,Number(c.dataset.bossPreview),c.width/2,c.height/2-10,3.7)});document.querySelectorAll('canvas[data-atlas]').forEach(c=>drawAtlas(c.getContext('2d')));if(game?.battle)drawBattleCanvas();}

function home(){const r=rankInfo(),s=stats(),next=r.next?`${r.next.xp-r.xp} Rangpunkte bis ${r.next.title}`:'Du bist ein Drachenmeister!';show(`${topbar()}<section class="hero-banner"><div><div class="eyebrow">Deine Brüche-Abenteuer warten</div><h1>Willkommen in der<br>Brüche-Burg!</h1><p>Trainiere Zauber, ziehe Ausrüstung an und erobere die Pixelwelt.</p></div>${heroCanvas('banner')}</section><div class="progress-row"><div class="stat"><strong>Rang ${r.rank} · ${r.title}</strong><span>${next}</span><div class="rank-progress"><i style="width:${r.progress}%"></i></div></div><div class="stat"><strong>${data.completed}</strong><span>Aufgaben geschafft · ${r.xp} Rangpunkte</span></div><div class="stat"><strong>⚔️ ${s.power} · 🛡️ ${s.defense}</strong><span>deine Kampfwerte</span></div></div><h2 class="section-title">Wähle deinen Zauber</h2><section class="mode-grid">${Object.entries(modes).map(([id,m])=>`<article class="mode-card"><div class="mode-icon">${m.icon}</div><h2>${m.title}</h2><p>${m.text}</p>${['add','sub'].includes(id)?`<button class="button small" onclick="chooseDifficulty('${id}')">Schwierigkeit wählen</button>`:`<button class="button" onclick="startGame('${id}','normal')">Spielen ✨</button>`}</article>`).join('')}</section><h2 class="section-title">Deine Burg</h2><button class="button secondary" onclick="hero()">Inventar</button> <button class="button gold" onclick="showShop()">Zu Kunos Kramladen</button> <button class="button mint" onclick="worldMap()">Zur Pixelwelt</button>`)}
function chooseDifficulty(mode){const m=modes[mode];show(`${topbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="home()">←</button><div><div class="eyebrow">${m.title}</div><h1>Welche Herausforderung?</h1></div></div><section class="difficulty-choice"><article><div class="mode-icon">🌱</div><h2>Einfach</h2><p>Die Brüche haben immer denselben Nenner.</p><button class="button mint" onclick="startGame('${mode}','easy')">Einfach spielen</button></article><article><div class="mode-icon">🔥</div><h2>Schwer</h2><p>Die Nenner sind verschieden. Erweitere zuerst.</p><button class="button gold" onclick="startGame('${mode}','hard')">Schwer spielen</button></article></section>`)}

function makeQuestion(selected,difficulty='normal'){
  const battlePools={battle0:['add','sub'],battle1:['add','sub','mul','reduce'],battle2:['add','sub','mul','div','reduce'],battle3:['add','sub','mul','div','reduce']};
  const type=selected==='test'?(battlePools[difficulty]||['add','sub','mul','div','reduce'])[rand(0,(battlePools[difficulty]||['add','sub','mul','div','reduce']).length-1)]:selected;
  let a,b,answer,raw;
  if(type==='add'||type==='sub'){
    const sameDenominators=difficulty==='easy'||difficulty==='battle0'||difficulty==='battle1'||(selected==='test'&&difficulty==='normal'&&Math.random()<.45);
    if(sameDenominators){const d=(difficulty==='battle0'?[2,3,4,5]:[3,4,5,6,8,10,12])[rand(0,difficulty==='battle0'?3:6)];a={n:rand(1,d-1),d};b={n:rand(1,d-1),d};if(type==='sub'&&a.n<b.n)[a,b]=[b,a];if(type==='sub'&&a.n===b.n){if(a.n<d-1)a.n++;else b.n--}answer=simplify({n:type==='add'?a.n+b.n:a.n-b.n,d})}
    else{const common=(difficulty==='battle3'?[8,9,10,12]:[6,8,9,10,12])[rand(0,difficulty==='battle3'?3:4)],choices=Array.from({length:common-1},(_,i)=>i+2).filter(d=>common%d===0);do{const d1=choices[rand(0,choices.length-1)];let d2=choices[rand(0,choices.length-1)];while(d2===d1)d2=choices[rand(0,choices.length-1)];a={n:rand(1,d1-1),d:d1};b={n:rand(1,d2-1),d:d2};if(type==='sub'&&a.n/a.d<b.n/b.d)[a,b]=[b,a]}while(type==='sub'&&a.n*b.d===b.n*a.d);answer=simplify(type==='add'?{n:a.n*b.d+b.n*a.d,d:a.d*b.d}:{n:a.n*b.d-b.n*a.d,d:a.d*b.d})}
  }
  if(type==='mul'){const ds=difficulty==='battle1'?[2,3,4,5]:[3,4,5,6,8,10];a={n:rand(1,difficulty==='battle1'?3:6),d:ds[rand(0,ds.length-1)]};b={n:rand(1,difficulty==='battle1'?2:5),d:ds[rand(0,ds.length-1)]};answer=simplify({n:a.n*b.n,d:a.d*b.d})}
  if(type==='div'){a={n:rand(1,6),d:[3,4,5,6,8,10][rand(0,5)]};b={n:rand(1,5),d:[3,4,5,6,8,10][rand(0,5)]};answer=simplify({n:a.n*b.d,d:a.d*b.n})}
  if(type==='reduce'){const d=difficulty==='battle1'?rand(3,7):rand(3,12),n=rand(1,d-1),factor=[2,3,4,5,6][rand(0,4)];raw={n:n*factor,d:d*factor};a=raw;answer=simplify(raw)}
  return {type,a,b,answer,raw}
}

function tutorialSteps(q,difficulty){
  if(q.type==='reduce'){const divisor=gcd(q.raw.n,q.raw.d);return [`Schau auf Zähler und Nenner: ${q.raw.n} und ${q.raw.d}.`, `Beide Zahlen lassen sich durch ${divisor} teilen.`, `${q.raw.n} ÷ ${divisor} = ${q.answer.n} und ${q.raw.d} ÷ ${divisor} = ${q.answer.d}.`, `Der vollständig gekürzte Bruch ist ${fmt(q.answer)}.`]}
  if(q.type==='mul')return [`Multipliziere erst die beiden Zähler: ${q.a.n} × ${q.b.n} = ${q.a.n*q.b.n}.`, `Dann die beiden Nenner: ${q.a.d} × ${q.b.d} = ${q.a.d*q.b.d}.`, `Das ergibt ${q.a.n*q.b.n}/${q.a.d*q.b.d}.`, `Kürzen ergibt ${fmt(q.answer)}.`]
  if(q.type==='div')return [`Beim Dividieren drehst du den zweiten Bruch um.`, `Aus ${fmt(q.b)} wird ${q.b.d}/${q.b.n}.`, `Jetzt multiplizierst du: ${fmt(q.a)} × ${q.b.d}/${q.b.n}.`, `Das Ergebnis ist ${fmt(q.answer)}.`]
  const operator=q.type==='add'?'+':'−';
  if(q.a.d===q.b.d)return [`Die Nenner sind gleich: ${q.a.d}.`, `Der Nenner bleibt deshalb ${q.a.d}.`, `Rechne nur oben: ${q.a.n} ${operator} ${q.b.n} = ${q.type==='add'?q.a.n+q.b.n:q.a.n-q.b.n}.`, `Das Ergebnis ist ${fmt(q.answer)}.`]
  const common=Math.abs(q.a.d*q.b.d)/gcd(q.a.d,q.b.d), left=q.a.n*(common/q.a.d), right=q.b.n*(common/q.b.d);
  return [`Die Nenner sind verschieden: ${q.a.d} und ${q.b.d}.`, `Ein gemeinsamer Nenner ist ${common}.`, `Erweitere: ${fmt(q.a)} wird ${left}/${common} und ${fmt(q.b)} wird ${right}/${common}.`, `Jetzt oben rechnen: ${left} ${operator} ${right} = ${q.type==='add'?left+right:left-right}.`, `Das Ergebnis ist ${fmt(q.answer)}.`]
}
function updateCoins(){const coin=document.querySelector('.coins');if(coin)coin.textContent=`🪙 ${data.gold}`}
function showTutorial(){if(!game)return;if(game.battle&&!game.helpPaid){if(data.gold<5){toast('Für die Boss-Hilfe brauchst du 5 Goldstücke.');return}data.gold-=5;game.helpPaid=true;save();updateCoins()}const steps=tutorialSteps(game.q,game.difficulty);game.helpStep=Math.min(game.helpStep+1,steps.length-1);const panel=document.querySelector('#helpPanel');if(panel)panel.innerHTML=`<strong>Schritt ${game.helpStep+1} von ${steps.length}</strong><p>${steps[game.helpStep]}</p>${game.helpStep<steps.length-1?'<small>Klicke erneut auf Hilfe für den nächsten Schritt.</small>':'<small>Jetzt kannst du die Aufgabe selbst lösen!</small>'}`}
function showHint(){if(!game?.battle)return;if(game.hintPaid){toast('Den Teil-Hinweis hast du für diese Aufgabe bereits erhalten.');return}if(data.gold<50){toast('Für diesen starken Teil-Hinweis brauchst du 50 Goldstücke.');return}data.gold-=50;game.hintPaid=true;save();updateCoins();const q=game.q;let text;if(q.type==='reduce')text=`Zähler und Nenner sind beide durch ${gcd(q.raw.n,q.raw.d)} teilbar.`;else if(q.type==='mul')text=`Die beiden Zähler ergeben zusammen ${q.a.n*q.b.n}.`;else if(q.type==='div')text=`Drehe den zweiten Bruch um: ${q.b.d}/${q.b.n}.`;else if(q.a.d===q.b.d)text=`Der Nenner bleibt ${q.a.d}.`;else text=`Der gemeinsame Nenner ist ${Math.abs(q.a.d*q.b.d)/gcd(q.a.d,q.b.d)}.`;const panel=document.querySelector('#helpPanel');if(panel)panel.innerHTML=`<strong>Magischer Teil-Hinweis</strong><p>${text}</p>`}
const battleAttacks = [
  {id:'spark', name:'Funkenzauber', damage:1, cooldown:0, text:'1 Schaden · immer bereit'},
  {id:'double', name:'Doppelblitz', damage:2, cooldown:1, text:'2 Schaden · 1 Aufgabe Abklingzeit'},
  {id:'chain', name:'Kettenzauber', damage:1, cooldown:0, text:'1–3 Schaden · wächst mit deiner Serie'},
  {id:'star', name:'Sternensturm', damage:3, cooldown:2, text:'3 Schaden · 2 Aufgaben Abklingzeit'},
];
const practiceModes = ['add','sub','mul','div','reduce'];
function createPracticeBattle(){const index=rand(0,monsters.length-1),monster=monsters[index];return {kind:'practice',index,monster,monsterHp:7,monsterMaxHp:7,playerHp:1,maxHp:1,cooldowns:{},selectedAttack:'spark'};}
function attackFor(id){return battleAttacks.find(attack=>attack.id===id)||battleAttacks[0]}
function attackDamage(attack,currentStreak=game.streak){return attack.id==='chain'?1+Math.min(2,currentStreak):attack.damage}
function attackPicker(){const battle=game.battle;if(!battle)return '';return `<section class="attack-picker" aria-label="Zauberangriff auswählen"><div class="attack-picker-heading"><strong>Wähle deinen Angriff</strong><small id="selectedAttackInfo">${attackFor(battle.selectedAttack).name} ist ausgewählt.</small></div><div class="attack-options">${battleAttacks.map(attack=>{const remaining=Math.max(0,battle.cooldowns[attack.id]||0),locked=remaining>0,selected=battle.selectedAttack===attack.id;return `<button type="button" class="attack-option ${selected?'selected':''} ${locked?'locked':''}" data-attack="${attack.id}" onclick="selectBattleAttack('${attack.id}')" ${locked?'disabled':''}><strong>${attack.name}</strong><span>${attack.text}</span><small>${locked?`Noch ${remaining} ${remaining===1?'Aufgabe':'Aufgaben'} gesperrt`:selected?'Ausgewählt':'Auswählen'}</small></button>`}).join('')}</div></section>`}
function updateAttackPicker(){if(!game?.battle)return;document.querySelectorAll('[data-attack]').forEach(button=>{const attack=attackFor(button.dataset.attack),remaining=Math.max(0,game.battle.cooldowns[attack.id]||0),locked=remaining>0,selected=game.battle.selectedAttack===attack.id;button.classList.toggle('selected',selected);button.classList.toggle('locked',locked);button.disabled=locked;button.querySelector('small').textContent=locked?`Noch ${remaining} ${remaining===1?'Aufgabe':'Aufgaben'} gesperrt`:selected?'Ausgewählt':'Auswählen';});const info=document.querySelector('#selectedAttackInfo');if(info)info.textContent=`${attackFor(game.battle.selectedAttack).name} ist ausgewählt.`;}
function selectBattleAttack(id){if(!game?.battle||(game.battle.cooldowns[id]||0)>0)return;game.battle.selectedAttack=id;updateAttackPicker();}
function advanceAttackCooldowns(){const battle=game?.battle;if(!battle)return;Object.keys(battle.cooldowns).forEach(id=>{battle.cooldowns[id]=Math.max(0,battle.cooldowns[id]-1);});if((battle.cooldowns[battle.selectedAttack]||0)>0)battle.selectedAttack='spark';}
function startGame(mode,difficulty='normal',battle=null){const resolvedBattle=battle||((practiceModes.includes(mode))?createPracticeBattle():null);game={mode,difficulty,streak:0,number:0,battle:resolvedBattle,animating:false};nextQuestion()}
function nextQuestion(){if(game.number>0)advanceAttackCooldowns();game.number++;if(game.battle)game.battle.selectedAttack='spark';const taskDifficulty=game.battle?.kind==='world'?(game.number<=2?'battle0':game.number<=4?'battle1':game.number<=6?'battle2':'battle3'):game.difficulty;game.q=makeQuestion(game.mode,taskDifficulty);game.taskDifficulty=taskDifficulty;game.helpStep=-1;game.helpPaid=false;game.hintPaid=false;const q=game.q,m=modes[q.type],battle=game.battle,equation=q.type==='reduce'?`${fractionHtml(q.raw)} <span class="operator">=</span> ?`:`${fractionHtml(q.a)} <span class="operator">${m.op}</span> ${fractionHtml(q.b)} <span class="operator">=</span> ?`,battleInfo=battle?`<div class="battle-status"><div class="battle-status-hero"><span>Magier</span><div class="health hero-health"><i class="hero-health-bar" style="width:${100*battle.playerHp/battle.maxHp}%"></i></div></div><div class="battle-status-monster"><span>${battle.monster.name}</span><div class="health"><i class="monster-health-bar" style="width:${100*battle.monsterHp/battle.monsterMaxHp}%"></i></div></div></div><canvas id="battleCanvas" class="battle-canvas" width="720" height="245"></canvas>`:'',helpControls=`<div class="help-actions"><button class="button secondary help-button" onclick="showTutorial()">${battle?'Hilfe anzeigen (5 🪙)':'📖 Hilfe: Schritt für Schritt'}</button>${battle?'<button class="button gold help-button" onclick="showHint()">✨ Teil-Hinweis (50 🪙)</button>':''}</div><div id="helpPanel" class="help-panel"></div>`,backAction=battle?.kind==='world'?'worldMap()':'home()',eyebrow=battle?(battle.kind==='practice'?'Übungsboss · Magische Arena':'Bosskampf · '+battle.monster.place):m.title;show(`${topbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="${backAction}">←</button><div><div class="eyebrow">${eyebrow}</div><h1>${battle?battle.monster.name:m.title}</h1></div></div><section class="game-panel">${battleInfo}<div class="game-status"><span>Aufgabe ${game.number}</span><span>🔥 Serie: ${game.streak}</span></div><p class="mission">${battle?(battle.kind==='practice'?'Besiege den Übungsboss mit 7 Leben. Er greift nicht zurück.':'Löse die Aufgabe und wirke einen Zauber!'):m.text}</p>${attackPicker()}<div class="equation">${equation}</div>${bar(q.type==='reduce'?q.answer:q.a)}<div class="answer-row"><div class="fraction-input"><input id="numerator" autocomplete="off" inputmode="numeric" aria-label="Zähler"><span></span><input id="denominator" autocomplete="off" inputmode="numeric" aria-label="Nenner"></div><button id="answerButton" class="button" onclick="checkAnswer()">Zauber wirken ✨</button></div><p class="answer-help">Zähler oben, Nenner unten. Bei einer ganzen Zahl bleibt das untere Feld frei.</p>${helpControls}<div id="feedback" class="feedback"></div><div id="hint" class="hint"></div></section>`);const n=document.querySelector('#numerator'),d=document.querySelector('#denominator');n.focus();[n,d].forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')checkAnswer()}));}
function parse(top,bottom){if(!top.trim())return null;const n=Number(top.trim()),d=bottom.trim()?Number(bottom.trim()):1;if(!Number.isInteger(n)||!Number.isInteger(d)||d===0)return null;return {...simplify({n,d}),originalN:n,originalD:d}}
function checkAnswer(){if(game?.animating)return;const n=document.querySelector('#numerator'),d=document.querySelector('#denominator'),feedback=document.querySelector('#feedback'),hint=document.querySelector('#hint'),guess=parse(n.value,d.value);if(!guess){feedback.className='feedback try';feedback.textContent='Trage oben den Zähler und unten einen Nenner ungleich 0 ein.';return}const q=game.q,same=guess.n===q.answer.n&&guess.d===q.answer.d,reduced=guess.originalD===1||gcd(guess.originalN,guess.originalD)===1;if(same&&(q.type!=='reduce'||reduced)){const s=stats(),isPractice=game.battle?.kind==='practice',reward=game.battle?(isPractice?0:1+Math.floor(s.luck/4)):2+Math.min(game.streak,2)+Math.floor(s.luck/3),attack=game.battle?attackFor(game.battle.selectedAttack):null;game.streak++;if(!isPractice)data.gold+=reward;data.completed++;data.rankXp++;save();n.disabled=d.disabled=true;if(game.battle){resolveBattleHit(attack,reward,feedback,hint);return}feedback.className='feedback good';feedback.textContent=`Fantastisch! ${fmt(q.answer)} ist richtig. +${reward} Gold · +1 Rangpunkt!`;const b=document.querySelector('#answerButton');b.textContent='Nächster Zauber →';b.onclick=nextQuestion}else{game.streak=0;feedback.className='feedback try';feedback.textContent='Noch nicht ganz – aber du bist auf dem richtigen Weg!';hint.textContent=same?'Der Bruch ist gleichwertig, aber noch nicht vollständig gekürzt.':'Tipp: '+(q.type==='reduce'?'Teile Zähler und Nenner durch dieselbe Zahl.':(q.type==='add'||q.type==='sub'?(game.difficulty==='hard'?'Erweitere beide Brüche auf denselben Nenner.':'Rechne bei gleichem Nenner nur mit den Zählern.'):'Rechne Schritt für Schritt und kürze am Ende.'));if(game.battle){n.disabled=d.disabled=true;resolveBattleMiss(feedback,hint)}}}

function battleButton(text,action){const b=document.querySelector('#answerButton');b.textContent=text;b.onclick=action}
function updateBattleBars(){if(!game?.battle)return;const monsterBar=document.querySelector('.monster-health-bar'),heroBar=document.querySelector('.hero-health-bar');if(monsterBar)monsterBar.style.width=`${100*game.battle.monsterHp/game.battle.monsterMaxHp}%`;if(heroBar)heroBar.style.width=`${100*game.battle.playerHp/game.battle.maxHp}%`;}
function finishBattleWin(hint){const battle=game.battle,m=battle.monster;if(battle.kind==='practice'){const goldBonus=20+Math.floor(stats().luck/4),mode=game.mode,difficulty=game.difficulty;data.gold+=goldBonus;save();hint.innerHTML=`${m.name} ist besiegt! +${goldBonus} Gold für deinen Übungsboss-Sieg.<br><button class="button secondary practice-home-button" onclick="home()">Zur Startseite</button>`;battleButton('Nächster Übungsboss →',()=>startGame(mode,difficulty));return;}const first=!data.cleared.includes(battle.index),goldBonus=first?m.gold:Math.max(5,Math.floor(m.gold/8));data.gold+=goldBonus;if(first){data.cleared.push(battle.index);data.rankXp+=m.rankBonus;}save();const r=rankInfo();hint.textContent=first?`${m.name} ist besiegt! +${goldBonus} Gold · +${m.rankBonus} Rangpunkte. Du bist jetzt Rang ${r.rank}: ${r.title}.`:`${m.name} ist besiegt! +${goldBonus} Gold.`;battleButton('Zur Pixelwelt →',worldMap)}
function monsterAttackDamage(missed=false){const b=game.battle,m=b.monster;let protection=stats().defense,note='';b.counterCount=(b.counterCount||0)+1;if(m.rule==='troll'){protection=Math.floor(protection*.7);note='Der Nennerhammer dringt durch einen Teil deiner Rüstung.';}let damage=missed?Math.max(2,m.attack-protection):Math.max(1,Math.ceil((m.attack-protection*1.2)/5));if(m.rule==='basilisk'&&b.counterCount%3===0){damage+=2;note='Der Zählerblick leuchtet auf: +2 Schaden!';}if(m.rule==='griffin'){if(b.counterCount%3===0){damage+=3;note='Der aufgeladene Zahlenwind trifft: +3 Schaden!';}else if(b.counterCount%3===2)note='Der Greif sammelt Wind für seinen nächsten Angriff.';}if(m.rule==='shadow'&&b.shadowCharged){damage+=2;b.shadowCharged=false;note='Der geladene Schattenzauber trifft: +2 Schaden!';}if(m.rule==='dragon'&&b.monsterHp<=m.hp/2){b.firePhase=true;damage+=2;note='Bruchfeuer-Phase: +2 Schaden!';}return {damage,note,protection};}
function missRuleEffect(){const b=game.battle,m=b.monster;if(m.rule==='slime'&&!b.slimeHealed){b.slimeHealed=true;b.monsterHp=Math.min(m.hp,b.monsterHp+5);updateBattleBars();return 'Der Schleim teilt sich und heilt 5 Leben.';}if(m.rule==='shadow'){b.shadowCharged=true;return 'Der Schatten-Magier lädt aus dem Fehler einen Schattenzauber auf.';}return '';}
function bossCounterattack(feedback,hint){const result=monsterAttackDamage(false),counter=result.damage,m=game.battle.monster;game.battle.playerHp=Math.max(0,game.battle.playerHp-counter);updateBattleBars();game.animating=true;playBattleAnimation('monster',counter,()=>{if(game.battle.playerHp===0){feedback.className='feedback try';feedback.textContent=`${m.attackName} verursacht ${counter} Schaden.`;hint.textContent=result.note||'Dein Schutz war zu niedrig. Bessere Ausrüstung macht den nächsten Versuch leichter.';battleButton('Zur Pixelwelt →',worldMap)}else{feedback.className='feedback good';feedback.textContent=`Treffer! Danach kontert ${m.name} mit ${m.attackName} für ${counter} Schaden.`;hint.textContent=result.note||`${m.ruleText} ${result.protection<m.needDefense?'Mehr Schutz dämpft den Angriff deutlich.':'Deine Rüstung dämpft den Angriff.'}`;battleButton('Nächster Zauber →',nextQuestion)}},m.attackName)}
function resolveBattleHit(attack,reward,feedback,hint){const battle=game.battle,m=battle.monster,spellDamage=attackDamage(attack,game.streak-1),rawDamage=battle.kind==='practice'?spellDamage:6+stats().power+(spellDamage-1),damage=Math.max(1,rawDamage-(battle.kind==='world'&&m.rule==='golem'?2:0)),effect=battle.kind==='world'&&m.rule==='golem'?' Der Steinpanzer fängt 2 Schaden ab.':'';if(attack.cooldown)battle.cooldowns[attack.id]=attack.cooldown+1;game.battle.monsterHp=Math.max(0,game.battle.monsterHp-damage);updateBattleBars();game.animating=true;playBattleAnimation('hero',damage,()=>{feedback.className='feedback good';feedback.textContent=battle.kind==='practice'?`Treffer! ${attack.name} verursacht ${damage} Schaden. +1 Rangpunkt, Gold gibt es beim Sieg.`:`Treffer! ${attack.name} verursacht ${damage} Schaden. +${reward} Gold!${effect}`;if(game.battle.monsterHp===0)finishBattleWin(hint);else if(battle.kind==='practice')battleButton('Nächste Aufgabe →',nextQuestion);else bossCounterattack(feedback,hint)},attack.name)}
function resolveBattleMiss(feedback,hint){if(game.battle.kind==='practice'){feedback.className='feedback try';feedback.textContent='Nicht ganz. Der Übungsboss greift nicht zurück – deine Serie beginnt nur wieder bei 0.';hint.textContent='Wähle bei der nächsten Aufgabe wieder einen Zauberangriff.';battleButton('Neue Aufgabe →',nextQuestion);return;}const effect=missRuleEffect(),result=monsterAttackDamage(true),damage=result.damage,m=game.battle.monster;game.battle.playerHp=Math.max(0,game.battle.playerHp-damage);updateBattleBars();game.animating=true;playBattleAnimation('monster',damage,()=>{feedback.className='feedback try';feedback.textContent=`Nicht ganz. ${m.name} trifft dich mit ${m.attackName} für ${damage} Schaden.`;hint.textContent=[effect,result.note].filter(Boolean).join(' ')||m.ruleText;if(game.battle.playerHp===0){hint.textContent+=' Mit mehr Schutz hältst du viel länger durch.';battleButton('Zur Pixelwelt →',worldMap)}else battleButton('Neue Aufgabe →',nextQuestion)},m.attackName)}
function playBattleAnimation(kind,damage,done,label=''){game.battleAnimation={kind,damage,label,start:performance.now()};const tick=now=>{drawBattleCanvas();if(now-game.battleAnimation.start<720)requestAnimationFrame(tick);else{game.battleAnimation=null;game.animating=false;drawBattleCanvas();done()}};requestAnimationFrame(tick)}
function drawMonster(ctx,index,x,y,scale=1){const palettes=[['#70da67','#2f8049'],['#4dd4a2','#156d5e'],['#876a57','#403c47'],['#5aab57','#244b3e'],['#9d9990','#54515a'],['#dfa95b','#86465a'],['#6f527f','#34234f'],['#cf5d55','#663247']][index], [light,dark]=palettes,eye='#fff6ba';ctx.imageSmoothingEnabled=false;px(ctx,x-18*scale,y+6*scale,36*scale,27*scale,dark);px(ctx,x-14*scale,y,28*scale,34*scale,light);px(ctx,x-9*scale,y+12*scale,4*scale,4*scale,eye);px(ctx,x+5*scale,y+12*scale,4*scale,4*scale,eye);px(ctx,x-12*scale,y+26*scale,24*scale,7*scale,dark);if(index===0){px(ctx,x-26*scale,y-4*scale,14*scale,15*scale,light);px(ctx,x+12*scale,y-4*scale,14*scale,15*scale,light);px(ctx,x-8*scale,y-10*scale,18*scale,10*scale,'#8652b5');px(ctx,x+21*scale,y+20*scale,17*scale,4*scale,'#c69255');}if(index===1){px(ctx,x-22*scale,y+17*scale,44*scale,15*scale,light);px(ctx,x-18*scale,y-6*scale,36*scale,17*scale,light);px(ctx,x-8*scale,y-12*scale,16*scale,7*scale,'#93f3df');}if(index===2){px(ctx,x-17*scale,y-14*scale,34*scale,17*scale,dark);px(ctx,x-26*scale,y-11*scale,9*scale,27*scale,dark);px(ctx,x+17*scale,y-11*scale,9*scale,27*scale,dark);px(ctx,x+17*scale,y+7*scale,8*scale,28*scale,'#c6a36b');}if(index===3){px(ctx,x-19*scale,y-8*scale,38*scale,13*scale,dark);px(ctx,x-8*scale,y-20*scale,16*scale,14*scale,light);px(ctx,x-22*scale,y+24*scale,45*scale,8*scale,dark);px(ctx,x-13*scale,y+11*scale,6*scale,6*scale,'#edff65');px(ctx,x+7*scale,y+11*scale,6*scale,6*scale,'#edff65');}if(index===4){px(ctx,x-20*scale,y-3*scale,40*scale,38*scale,dark);px(ctx,x-15*scale,y-9*scale,30*scale,38*scale,light);px(ctx,x-14*scale,y+4*scale,26*scale,4*scale,'#d8d7d3');px(ctx,x-4*scale,y-15*scale,8*scale,10*scale,'#d8d7d3');}if(index===5){px(ctx,x-43*scale,y-2*scale,28*scale,15*scale,light);px(ctx,x+15*scale,y-2*scale,28*scale,15*scale,light);px(ctx,x-8*scale,y-16*scale,16*scale,15*scale,'#ffe6a8');px(ctx,x-22*scale,y+26*scale,10*scale,15*scale,dark);px(ctx,x+12*scale,y+26*scale,10*scale,15*scale,dark);}if(index===6){px(ctx,x-17*scale,y-18*scale,34*scale,13*scale,'#4b315d');px(ctx,x-21*scale,y+18*scale,42*scale,18*scale,'#4b315d');px(ctx,x+17*scale,y+10*scale,7*scale,28*scale,'#b688e4');}if(index===7){px(ctx,x-28*scale,y+1*scale,17*scale,11*scale,light);px(ctx,x+12*scale,y+1*scale,17*scale,11*scale,light);px(ctx,x-12*scale,y-18*scale,8*scale,14*scale,'#ffe16c');px(ctx,x+4*scale,y-18*scale,8*scale,14*scale,'#ffe16c');px(ctx,x-7*scale,y+23*scale,14*scale,8*scale,'#ffbc58');}}
function drawAtlas(ctx){const w=ctx.canvas.width,h=ctx.canvas.height,positions=[{x:170,y:355},{x:505,y:325},{x:850,y:350},{x:1190,y:305}],current=data.world.zone;ctx.clearRect(0,0,w,h);ctx.fillStyle='#182045';ctx.fillRect(0,0,w,h);for(let i=0;i<70;i++){ctx.fillStyle=i%3?'#ffffff44':'#ffe88799';ctx.fillRect((i*83)%w,(i*47)%230,3,3);}ctx.fillStyle='#5d4b97';ctx.beginPath();ctx.arc(1130,92,45,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffe683';ctx.beginPath();ctx.arc(1130,92,30,0,Math.PI*2);ctx.fill();ctx.fillStyle='#364f83';ctx.beginPath();ctx.moveTo(0,285);ctx.lineTo(140,170);ctx.lineTo(290,282);ctx.lineTo(450,135);ctx.lineTo(630,286);ctx.lineTo(820,170);ctx.lineTo(1000,288);ctx.lineTo(1180,128);ctx.lineTo(1440,292);ctx.lineTo(1440,460);ctx.lineTo(0,460);ctx.fill();ctx.fillStyle='#2c3b67';ctx.fillRect(0,395,w,205);ctx.strokeStyle='#f7ce70';ctx.lineWidth=13;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(55,465);ctx.bezierCurveTo(270,355,345,525,555,445);ctx.bezierCurveTo(755,365,850,520,1060,415);ctx.bezierCurveTo(1190,350,1300,400,1400,342);ctx.stroke();ctx.strokeStyle='#7f5b37';ctx.lineWidth=4;ctx.stroke();positions.forEach((pos,index)=>{const zone=zones[index],unlocked=zoneUnlocked(index),isHere=current===index,cleared=zone.bosses.filter(b=>data.cleared.includes(b)).length;ctx.fillStyle=unlocked?zone.base:'#25233d';ctx.beginPath();ctx.ellipse(pos.x,pos.y,118,62,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=unlocked?zone.accent:'#5d5a72';ctx.lineWidth=7;ctx.stroke();if(index===0){for(let t=-70;t<75;t+=29){px(ctx,pos.x+t,pos.y-36,11,35,zone.detail);px(ctx,pos.x+t-10,pos.y-20,31,20,zone.accent);}}if(index===1){px(ctx,pos.x-57,pos.y-20,114,46,zone.detail);ctx.fillStyle='#171d39';ctx.beginPath();ctx.arc(pos.x,pos.y+19,24,Math.PI,0);ctx.fill();}if(index===2){ctx.fillStyle=zone.detail;ctx.beginPath();ctx.moveTo(pos.x-90,pos.y+33);ctx.lineTo(pos.x-35,pos.y-58);ctx.lineTo(pos.x+3,pos.y+20);ctx.lineTo(pos.x+58,pos.y-72);ctx.lineTo(pos.x+98,pos.y+32);ctx.fill();ctx.fillStyle='#e7e3fb';ctx.fillRect(pos.x-39,pos.y-60,10,16);ctx.fillRect(pos.x+53,pos.y-74,11,16);}if(index===3){px(ctx,pos.x-55,pos.y-28,110,56,zone.detail);for(let x=pos.x-50;x<=pos.x+40;x+=30){px(ctx,x,pos.y-56,15,32,zone.detail);px(ctx,x-4,pos.y-64,23,10,zone.accent);}px(ctx,pos.x-19,pos.y-4,38,32,'#241a35');}if(unlocked){zone.bosses.forEach((boss,offset)=>drawMonster(ctx,boss,pos.x-36+offset*70,pos.y+11,.68));ctx.fillStyle='#fff3ae';ctx.font='800 20px Nunito';ctx.textAlign='center';ctx.fillText(`${cleared}/2 Siegel`,pos.x,pos.y+89);}else{ctx.fillStyle='#1a1830cc';ctx.beginPath();ctx.ellipse(pos.x,pos.y,115,60,0,0,Math.PI*2);ctx.fill();ctx.font='bold 38px Nunito';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('🔒',pos.x,pos.y+13);}if(isHere){ctx.strokeStyle='#ffe774';ctx.lineWidth=6;ctx.beginPath();ctx.arc(pos.x,pos.y-92,26,0,Math.PI*2);ctx.stroke();drawHero(ctx,pos.x,pos.y-121,1.05);ctx.fillStyle='#fff2a2';ctx.font='800 17px Nunito';ctx.fillText('DU BIST HIER',pos.x,pos.y-157);}ctx.fillStyle=unlocked?'#fff3ca':'#9e9ab6';ctx.font='800 24px Baloo 2';ctx.fillText(zone.name,pos.x,pos.y+123);});ctx.textAlign='left';ctx.fillStyle='#fff0aa';ctx.font='800 28px Baloo 2';ctx.fillText('Der lange Horizont-Quest',52,55);ctx.fillStyle='#d9d3f1';ctx.font='600 16px Nunito';ctx.fillText('Folge dem goldenen Weg von Welt zu Welt – jede Insel ist ein neues Abenteuer.',52,80);}
function atlasMap(){const r=rankInfo(),current=zones[data.world.zone],completedSeals=data.cleared.length;show(`${topbar()}<div class="screen-heading atlas-heading"><button class="button secondary round-back" onclick="home()">←</button><div><div class="eyebrow">Deine lange Quest am Horizont</div><h1>Große Abenteuerkarte</h1></div></div><section class="atlas-panel"><canvas class="atlas-canvas" data-atlas width="1440" height="600" aria-label="Große Karte mit allen Pixelwelten und aktueller Spielerposition"></canvas><div class="atlas-status"><div><strong>Du bist in: ${current.name}</strong><span>Rang ${r.rank} · ${r.title}</span></div><div><strong>${completedSeals}/8 Boss-Siegel</strong><span>Der goldene Weg zeigt dein nächstes Ziel.</span></div><button class="button mint" onclick="worldMap()">Aktuelle Pixelwelt betreten →</button></div></section><section class="atlas-legend">${zones.map((zone,index)=>{const open=zoneUnlocked(index),done=zone.bosses.filter(b=>data.cleared.includes(b)).length;return `<article class="${open?'open':'locked'} ${data.world.zone===index?'current':''}"><span>${index+1}</span><div><strong>${zone.name}</strong><small>${open?`${done}/2 Bosse besiegt${data.world.zone===index?' · Hier bist du':''}`:`Ab Rang ${zoneRank(index)}`}</small></div></article>`}).join('')}</section>`)}
function drawBattleCanvas(){const c=document.querySelector('#battleCanvas');if(!c||!game?.battle)return;const ctx=c.getContext('2d'),b=game.battle,a=game.battleAnimation,elapsed=a?(performance.now()-a.start)/720:0;ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#17244a';ctx.fillRect(0,0,c.width,c.height);for(let i=0;i<18;i++){ctx.fillStyle=i%2?'#263c6b':'#1e315b';ctx.fillRect(i*48,180+(i%3)*8,48,65)}let heroX=160,monsterX=555;if(a?.kind==='hero')monsterX+=Math.sin(elapsed*24)*10;if(a?.kind==='monster')heroX+=Math.sin(elapsed*24)*10;drawHero(ctx,heroX,115,2.15);drawMonster(ctx,b.index,monsterX,100,2.55);if(a){const start=a.kind==='hero'?220:500,end=a.kind==='hero'?500:220,x=start+(end-start)*Math.min(elapsed*1.4,1),y=100-Math.sin(Math.min(elapsed*1.4,1)*Math.PI)*45;ctx.fillStyle=a.kind==='hero'?'#ffe66c':'#ff7192';ctx.beginPath();ctx.arc(x,y,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 23px Nunito';ctx.fillText(`-${a.damage}`,a.kind==='hero'?monsterX-14:heroX-14,45);if(a.label){ctx.font='bold 15px Nunito';ctx.fillStyle='#ffeb9c';ctx.fillText(a.label,a.kind==='hero'?455:88,30)}}}

function hero(){
  const s=stats(), unequipped=data.owned.filter(name=>!Object.values(data.equipped).includes(name));
  const slotMarkup=Object.entries(slotNames).map(([slot,label])=>{const it=equippedItem(slot);return `<div class="drop-slot ${it?'filled draggable-source':''}" data-drop-slot data-slot="${slot}" ${it?`data-draggable-item data-item="${it.name}" data-source-slot="${slot}"`:''}><span class="slot-label">${label}</span>${it?`${itemCanvas(it,true)}<strong>${it.name}</strong>`:'<span class="slot-empty">hier ablegen</span>'}</div>`}).join('');
  show(`${topbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="home()">←</button><div><div class="eyebrow">Ziehe Gegenstände aus der Truhe auf den Helden</div><h1>Magierhaus · Inventar</h1></div></div><section class="house-inventory"><div class="house-sparkles">✦　✧　✦</div><article class="character-room"><div class="window-light"></div><div class="character-name">Der Brüche-Magier</div><div class="character-stage">${heroCanvas()}<div class="slot-ring">${slotMarkup}</div></div><div class="attribute-row"><span>⚔️ ${s.power}</span><span>🛡️ ${s.defense}</span><span>🍀 ${s.luck}</span></div><p class="drag-tip">Ziehe ein Item auf den passenden Platz. Ziehe es zurück in die Truhe, um es abzulegen.</p></article><article class="chest-room" data-chest-drop><div class="chest-lid"></div><div class="chest-title"><span>Meine Truhe</span><small>${unequipped.length} Gegenstände</small></div><div class="chest-grid">${unequipped.length?unequipped.map(name=>{const it=items.find(i=>i.name===name);return `<button class="chest-item" data-draggable-item data-item="${it.name}" data-source-slot="chest">${itemCanvas(it)}<strong>${it.name}</strong><span>⚔️${it.power} · 🛡️${it.defense} · 🍀${it.luck}</span></button>`}).join(''):'<p class="empty-chest">Die Truhe ist leer. Ausrüstung bekommst du im Kobold-Shop.</p>'}</div><button class="button gold chest-shop-button" onclick="showShop()">Zum Kobold-Shop</button></article></section>`);
  requestAnimationFrame(setupInventoryDrag);
}
function setupInventoryDrag(){document.querySelectorAll('[data-draggable-item]').forEach(el=>el.addEventListener('pointerdown',startInventoryDrag));}
function startInventoryDrag(event){if(event.button!==undefined&&event.button!==0)return;const source=event.currentTarget,item=items.find(i=>i.name===source.dataset.item);if(!item)return;event.preventDefault();dragState={item,sourceSlot:source.dataset.sourceSlot};source.classList.add('is-dragging');document.querySelectorAll('[data-drop-slot]').forEach(slot=>slot.classList.add(slot.dataset.slot===item.slot?'drop-valid':'drop-invalid'));if(source.dataset.sourceSlot!=='chest')document.querySelector('[data-chest-drop]')?.classList.add('chest-drop-active');dragGhost=source.cloneNode(true);dragGhost.classList.add('drag-ghost');document.body.append(dragGhost);moveDragGhost(event);window.addEventListener('pointermove',moveDragGhost);window.addEventListener('pointerup',finishInventoryDrag,{once:true});}
function moveDragGhost(event){if(!dragGhost)return;dragGhost.style.left=`${event.clientX+14}px`;dragGhost.style.top=`${event.clientY+14}px`;}
function finishInventoryDrag(event){window.removeEventListener('pointermove',moveDragGhost);const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-drop-slot], [data-chest-drop]');const {item,sourceSlot}=dragState||{};let changed=false;if(target?.dataset.dropSlot!==undefined){if(target.dataset.slot===item.slot){data.equipped[item.slot]=item.name;changed=true;}else{target.classList.add('bad-drop');setTimeout(()=>target.classList.remove('bad-drop'),450);toast(`Das passt nicht: ${item.name} gehört zu ${slotNames[item.slot]}.`);}}else if(target?.dataset.chestDrop!==undefined&&sourceSlot!=='chest'){if(data.equipped[item.slot]===item.name){delete data.equipped[item.slot];changed=true;}}if(changed){save();hero();}cleanupInventoryDrag();}
function cleanupInventoryDrag(){dragState?.source?.classList.remove('is-dragging');document.querySelectorAll('.drop-valid,.drop-invalid').forEach(el=>el.classList.remove('drop-valid','drop-invalid'));document.querySelector('[data-chest-drop]')?.classList.remove('chest-drop-active');dragGhost?.remove();dragGhost=null;dragState=null;}
function itemAttributes(it){return `<span class="item-attrs">⚔️ +${it.power} &nbsp; 🛡️ +${it.defense} &nbsp; 🍀 +${it.luck}</span>`}
function nextAvailableMonster(){const index=monsters.findIndex((monster,i)=>!data.cleared.includes(i)&&i<=data.cleared.length);return index<0?null:{monster:monsters[index],index};}
function merchantAdvice(){const next=nextAvailableMonster(),s=stats();if(!next)return 'Du hast alle Bosse besiegt! Meine besten Waren stehen dir offen, Drachenmeister.';const m=next.monster,missing=[];if(s.power<m.needPower)missing.push(`${m.needPower-s.power} Zauberkraft`);if(s.defense<m.needDefense)missing.push(`${m.needDefense-s.defense} Schutz`);if(missing.length)return `Für ${m.name} fehlen dir noch ${missing.join(' und ')}. Ich habe dafür genau die richtigen Sachen im Regal!`;return `Deine Ausrüstung passt für ${m.name}. Denk an seine Regel: ${m.ruleText}`;}
function shopItem(it){const owned=data.owned.includes(it.name),locked=!rankAtLeast(it.tier),rankLabel=`Rang ${it.tier}`;return `<article class="kuno-item ${locked?'locked':''}"><div class="kuno-item-art">${itemCanvas(it)}${locked?'<span>🔒</span>':''}</div><div><h3>${it.name}</h3><p>${it.text}</p>${itemAttributes(it)}<br>${locked?`<button class="button secondary" disabled>Ab ${rankLabel}</button>`:`<button class="button ${owned?'mint':'gold'}" onclick="${owned?'hero()':`buy('${it.name}')`}">${owned?'In die Truhe':`Für ${it.cost} 🪙 kaufen`}</button>`}</div></article>`}
function showShop(){const r=rankInfo(),shelfNames=['Lehrlings-Regal','Entdecker-Regal','Meister-Regal'];show(`${topbar()}<div class="screen-heading"><button class="button secondary round-back" onclick="home()">←</button><div><div class="eyebrow">Kunos Kramladen · Rang ${r.rank}</div><h1>Kunos Kramladen</h1></div></div><section class="kuno-shop"><div class="kuno-counter">${merchantCanvas()}<div class="kuno-speech"><strong>Kobold Kuno</strong><p>${merchantAdvice()}</p><small>Rang ${r.rank} · ${r.title} · ${r.xp} Rangpunkte</small></div></div><div class="kuno-shop-note">Gekaufte Gegenstände wandern direkt in deine Truhe. Ziehe sie im Magierhaus an deinen Helden.</div>${[1,2,3].map(tier=>`<section class="kuno-shelf ${rankAtLeast(tier)?'open':'closed'}"><header><div><span>Regal ${tier}</span><h2>${shelfNames[tier-1]}</h2></div><strong>${rankAtLeast(tier)?'Geöffnet':'Ab Rang '+tier}</strong></header><div class="kuno-items">${items.filter(item=>item.tier===tier).map(shopItem).join('')}</div></section>`).join('')}</section>`)}
function buy(name){const it=items.find(i=>i.name===name);if(!it)return;if(!rankAtLeast(it.tier))return toast(`Kuno öffnet dieses Regal erst ab Rang ${it.tier}.`);if(data.owned.includes(name))return hero();if(data.gold<it.cost)return toast(`Dir fehlen noch ${it.cost-data.gold} Goldstücke.`);data.gold-=it.cost;data.owned.push(name);save();toast(`Kuno packt ${it.name} in deine Truhe.`);showShop()}
function equip(name){const it=items.find(i=>i.name===name);data.equipped[it.slot]=name;save();toast(`${it.name} angezogen!`);hero()}

function worldMap(){const w=data.world,r=rankInfo();show(`${topbar()}<div class="screen-heading world-heading"><button class="button secondary round-back" onclick="home()">←</button><div><div class="eyebrow">Rang ${r.rank} · ${r.title} · Pfeiltasten/WASD laufen · E kämpfen</div><h1>Pixel-Abenteuerwelt</h1></div></div><section class="world-game"><canvas id="worldCanvas" width="960" height="540" aria-label="Begehbare Abenteuerkarte"></canvas><div class="world-hud"><strong id="zoneName"></strong><span id="worldHint">Besiege Bossgegner und öffne neue Wege.</span></div><div class="touch-controls"><button onclick="moveWorld(0,-1)">▲</button><span><button onclick="moveWorld(-1,0)">◀</button><button onclick="worldInteract()">E</button><button onclick="moveWorld(1,0)">▶</button></span><button onclick="moveWorld(0,1)">▼</button></div></section>`);worldActive=true;w.zone=Math.max(0,Math.min(3,w.zone||0));while(w.zone>0&&!zoneUnlocked(w.zone)){w.zone--;w.x=900;w.y=405;}keyHandler=e=>{if(!worldActive)return;const key=e.key.toLowerCase(),moves={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]};if(moves[key]){e.preventDefault();moveWorld(...moves[key])}if(key==='e'||key==='enter'){e.preventDefault();worldInteract()}};window.addEventListener('keydown',keyHandler);paintWorld()}
function stopWorld(){if(!worldActive)return;worldActive=false;if(worldFrame)cancelAnimationFrame(worldFrame);if(keyHandler)window.removeEventListener('keydown',keyHandler);keyHandler=null;save()}
function moveWorld(dx,dy){if(!worldActive)return;const p=data.world,nx=p.x+dx*24,ny=p.y+dy*24,blocked=zoneObstacles[p.zone].some(o=>nx+13>o.x&&nx-13<o.x+o.w&&ny+13>o.y&&ny-13<o.y+o.h);if(nx<30&&p.zone>0){p.zone--;p.x=900;p.y=405}else if(nx>930&&p.zone<3&&zoneUnlocked(p.zone+1)){p.zone++;p.x=60;p.y=405}else if(nx>=30&&nx<=930&&ny>=70&&ny<=500&&!blocked){p.x=nx;p.y=ny}else if(nx>930&&p.zone<3){const neededRank=zoneRank(p.zone+1);toast(data.cleared.includes(p.zone*2+1)?`Der Weg braucht Rang ${neededRank}. Übe weiter oder besiege Bosse!`:'Der Weg ist noch versiegelt. Besiege beide Bosse dieses Gebiets!')}}
function worldInteract(){if(!worldActive)return;const p=data.world,zone=zones[p.zone];for(const index of zone.bosses){const pos=bossPositions[index],m=monsters[index],distance=Math.hypot(pos.x-p.x,pos.y-p.y);if(distance<78){if(index>data.cleared.length){toast('Dieser Gegner ist noch verborgen.');return}startBattle(index);return}}toast('Komm näher an einen Boss und drücke E.')}
function paintWorld(){if(!worldActive)return;const c=document.querySelector('#worldCanvas');if(!c)return;const ctx=c.getContext('2d'),p=data.world,z=zones[p.zone];ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle=z.base;ctx.fillRect(0,0,c.width,c.height);for(let x=0;x<c.width;x+=48)for(let y=0;y<c.height;y+=48){ctx.fillStyle=(x/48+y/48)%2?'#ffffff09':'#0000000a';ctx.fillRect(x,y,48,48)}ctx.fillStyle='#d9b86c';ctx.fillRect(0,388,c.width,58);for(const o of zoneObstacles[p.zone]){ctx.fillStyle=z.detail;ctx.fillRect(o.x,o.y,o.w,o.h);ctx.fillStyle=z.accent;ctx.fillRect(o.x+6,o.y+6,o.w-12,15);for(let x=o.x+13;x<o.x+o.w-5;x+=24){ctx.fillStyle='#ffffff24';ctx.fillRect(x,o.y+27,12,12)}}ctx.fillStyle='#ffffff30';ctx.fillRect(0,62,c.width,7);for(const index of z.bosses){const pos=bossPositions[index],done=data.cleared.includes(index),available=index<=data.cleared.length;if(done){ctx.strokeStyle='#78e4a0';ctx.lineWidth=5;ctx.beginPath();ctx.arc(pos.x,pos.y,25,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#fff';ctx.font='bold 22px Nunito';ctx.fillText('✓',pos.x-8,pos.y+8)}else{drawMonster(ctx,index,pos.x,pos.y,1.35);if(!available){ctx.fillStyle='#1d1837bb';ctx.fillRect(pos.x-26,pos.y-30,52,60);ctx.fillStyle='#fff';ctx.font='bold 22px Nunito';ctx.fillText('?',pos.x-6,pos.y+8)}}}drawHero(ctx,p.x,p.y-28,1.35);const near=z.bosses.some(i=>!data.cleared.includes(i)&&Math.hypot(bossPositions[i].x-p.x,bossPositions[i].y-p.y)<78);document.querySelector('#zoneName').textContent=`${z.name} · Rang ${rankInfo().rank}`;document.querySelector('#worldHint').textContent=near?'Drücke E, um die Boss-Regel anzusehen!':p.zone<3&&!data.cleared.includes(p.zone*2+1)?'Besiege beide Bosse, um den Weg nach Osten zu öffnen.':p.zone<3&&!rankAtLeast(zoneRank(p.zone+1))?`Der nächste Weg braucht Rang ${zoneRank(p.zone+1)}.`:'Der nächste Weg liegt im Osten.';worldFrame=requestAnimationFrame(paintWorld)}
function showBossBriefing(index){const m=monsters[index],s=stats(),missing=[];if(s.power<m.needPower)missing.push(`${m.needPower-s.power} Zauberkraft`);if(s.defense<m.needDefense)missing.push(`${m.needDefense-s.defense} Schutz`);show(`${topbar()}<section class="boss-briefing"><div class="briefing-monster"><canvas class="boss-preview" data-boss-preview="${index}" width="220" height="220"></canvas></div><div class="briefing-copy"><div class="eyebrow">Boss-Steckbrief · ${m.place}</div><h1>${m.name}</h1><p>${m.description}</p><div class="boss-rule"><strong>⚡ ${m.attackName}</strong><p>${m.ruleText}</p></div><div class="boss-needs">⚔️ benötigt ${m.needPower} · 🛡️ benötigt ${m.needDefense}</div>${missing.length?`<p class="briefing-warning">Noch zu gefährlich: Dir fehlen ${missing.join(' und ')}. Kuno kann dir helfen.</p><button class="button gold" onclick="showShop()">Zu Kunos Kramladen</button>`:`<p class="briefing-ready">Deine Ausrüstung ist bereit. Du schaffst das!</p><button class="button" onclick="beginBattle(${index})">Kampf beginnen ✨</button>`} <button class="button secondary" onclick="worldMap()">Zurück zur Welt</button></div></section>`)}
function startBattle(index){const zone=Math.floor(index/2);if(!rankAtLeast(zoneRank(zone))){toast(`Für diesen Ort brauchst du Rang ${zoneRank(zone)}.`);return}showBossBriefing(index)}
function beginBattle(index){const m=monsters[index],s=stats();if(s.power<m.needPower||s.defense<m.needDefense)return showBossBriefing(index);startGame('test','hard',{kind:'world',index,monster:m,monsterHp:m.hp,monsterMaxHp:m.hp,playerHp:30+s.defense*2,maxHp:30+s.defense*2,counterCount:0,slimeHealed:false,shadowCharged:false,firePhase:false,cooldowns:{},selectedAttack:'spark'})}

window.home=home;window.chooseDifficulty=chooseDifficulty;window.startGame=startGame;window.checkAnswer=checkAnswer;window.nextQuestion=nextQuestion;window.selectBattleAttack=selectBattleAttack;window.showTutorial=showTutorial;window.showHint=showHint;window.hero=hero;window.showShop=showShop;window.buy=buy;window.equip=equip;window.atlasMap=atlasMap;window.worldMap=worldMap;window.moveWorld=moveWorld;window.worldInteract=worldInteract;window.startBattle=startBattle;window.beginBattle=beginBattle;

const authThrottleKey = 'matheMagierAuthThrottle';
const authMaxFailures = 5;
const authLockMs = 15 * 60 * 1000;

function getAuthThrottle(){
  try { return JSON.parse(localStorage.getItem(authThrottleKey) || '{}'); }
  catch { return {}; }
}
function getAuthWaitMs(){
  const waitMs = Math.max(0, Number(getAuthThrottle().lockedUntil || 0) - Date.now());
  if (!waitMs) localStorage.removeItem(authThrottleKey);
  return waitMs;
}
function addAuthFailure(){
  const throttle = getAuthThrottle();
  const failures = Number(throttle.failures || 0) + 1;
  const lockedUntil = failures >= authMaxFailures ? Date.now() + authLockMs : 0;
  localStorage.setItem(authThrottleKey, JSON.stringify({failures: lockedUntil ? 0 : failures, lockedUntil}));
  return lockedUntil ? authLockMs : 0;
}
function resetAuthThrottle(){ localStorage.removeItem(authThrottleKey); }
function authWaitMessage(waitMs){ return `Zu viele Versuche. Bitte warte noch ${Math.ceil(waitMs / 60000)} Minuten.`; }

function showAccountGate(message=''){
  stopWorld();
  app.innerHTML = `<section class="access-gate"><div class="access-card"><div class="access-sparkle">&#10022;</div><p class="eyebrow">Dein Abenteuer auf jedem Gerät</p><h1>Mathe Magier</h1><p>Erstelle ein Konto oder melde dich an. Damit bleiben Gold, Items und Fortschritt sicher erhalten.</p><label for="accountEmail">E-Mail-Adresse</label><input id="accountEmail" class="account-input" type="email" autocomplete="email" inputmode="email" autofocus><label for="accountPassword">Passwort</label><input id="accountPassword" class="account-input" type="password" autocomplete="current-password" minlength="6"><div class="account-actions"><button id="signInButton" class="button">Anmelden</button><button id="createAccountButton" class="button secondary">Konto erstellen</button></div><p id="accountFeedback" class="access-feedback" role="alert">${message}</p><p class="account-note">Das Passwort braucht mindestens 6 Zeichen. Dein Spielstand gehört nur deinem Konto.</p></div></section>`;
  const email = document.querySelector('#accountEmail'), password = document.querySelector('#accountPassword'), feedback = document.querySelector('#accountFeedback');
  const submit = async create => {
    const waitMs = getAuthWaitMs();
    if (waitMs) { feedback.textContent = authWaitMessage(waitMs); return; }
    const cleanEmail = email.value.trim();
    if (!cleanEmail || !password.value) { feedback.textContent = 'Bitte E-Mail-Adresse und Passwort eingeben.'; return; }
    if (create && password.value.length < 6) { feedback.textContent = 'Das Passwort muss mindestens 6 Zeichen haben.'; return; }
    feedback.textContent = create ? 'Konto wird erstellt ...' : 'Anmeldung läuft ...';
    try {
      if (create) await firebaseServices.createUserWithEmailAndPassword(firebaseServices.auth, cleanEmail, password.value);
      else await firebaseServices.signInWithEmailAndPassword(firebaseServices.auth, cleanEmail, password.value);
      resetAuthThrottle();
    } catch (error) {
      const lockMs = addAuthFailure();
      if (lockMs) { feedback.textContent = authWaitMessage(lockMs); return; }
      const messages = {
        'auth/email-already-in-use':'Zu dieser E-Mail-Adresse gibt es bereits ein Konto. Bitte anmelden.',
        'auth/invalid-credential':'E-Mail-Adresse oder Passwort stimmt nicht.',
        'auth/invalid-email':'Bitte eine gültige E-Mail-Adresse eingeben.',
        'auth/weak-password':'Bitte ein Passwort mit mindestens 6 Zeichen wählen.',
        'auth/too-many-requests':'Zu viele Anfragen. Bitte versuche es später erneut.',
      };
      feedback.textContent = messages[error.code] || 'Die Anmeldung hat nicht funktioniert. Bitte versuche es noch einmal.';
    }
  };
  document.querySelector('#signInButton').addEventListener('click', () => submit(false));
  document.querySelector('#createAccountButton').addEventListener('click', () => submit(true));
  password.addEventListener('keydown', event => { if (event.key === 'Enter') submit(false); });
}

async function loadCloudSave(user){
  app.innerHTML = `<section class="access-gate"><div class="access-card"><div class="access-sparkle">&#10022;</div><h1>Spielstand wird geladen ...</h1><p>Wir holen dein Gold, deine Items und deinen Fortschritt.</p></div></section>`;
  try {
    const playerRef = firebaseServices.doc(firebaseServices.db, 'players', user.uid);
    const saved = await firebaseServices.getDoc(playerRef);
    if (saved.exists() && saved.data().game) {
      data = normalize(saved.data().game);
      localStorage.setItem(localSaveKey, JSON.stringify(data));
    } else {
      await saveToCloud();
    }
    if (sessionStorage.getItem(accessSessionKey) === 'granted') home();
    else showAccessGate();
  } catch (error) {
    console.warn('Cloud-Spielstand konnte nicht geladen werden.', error);
    showAccountGate('Der Cloud-Spielstand ist noch nicht erreichbar. Bitte gleich noch einmal anmelden.');
  }
}

function startCloudApp(){
  if (appStarted || !window.matheMagierFirebase) return;
  appStarted = true;
  firebaseServices = window.matheMagierFirebase;
  firebaseServices.onAuthStateChanged(firebaseServices.auth, user => {
    currentUser = user;
    if (user) loadCloudSave(user);
    else showAccountGate();
  });
}

async function signOutPlayer(){
  if (firebaseServices) await firebaseServices.signOut(firebaseServices.auth);
}

window.signOutPlayer = signOutPlayer;

const accessSessionKey = 'matheMagierAccess';
const accessCode = '18112015';

function showAccessGate(){
  stopWorld();
  app.innerHTML = `<section class="access-gate"><div class="access-card"><div class="access-sparkle">✦</div><p class="eyebrow">Willkommen in der Brüche-Burg</p><h1>Mathe Magier</h1><p>Gib den Zugangscode ein, um dein Abenteuer zu beginnen.</p><label for="accessCode">Zugangscode</label><div class="access-row"><input id="accessCode" type="password" inputmode="numeric" autocomplete="current-password" aria-describedby="accessFeedback" autofocus><button id="accessButton" class="button">Abenteuer starten ✨</button></div><p id="accessFeedback" class="access-feedback" role="alert"></p></div></section>`;
  const input = document.querySelector('#accessCode');
  const feedback = document.querySelector('#accessFeedback');
  const unlock = () => {
    if(input.value === accessCode){
      sessionStorage.setItem(accessSessionKey, 'granted');
      home();
      return;
    }
    feedback.textContent = 'Der Zugangscode stimmt noch nicht. Versuch es noch einmal.';
    input.select();
  };
  document.querySelector('#accessButton').addEventListener('click', unlock);
  input.addEventListener('keydown', event => { if(event.key === 'Enter') unlock(); });
  input.focus();
}

if (window.matheMagierFirebase) startCloudApp();
else window.addEventListener('mathe-magier-firebase-ready', startCloudApp, {once:true});
