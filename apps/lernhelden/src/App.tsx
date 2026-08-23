import {lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import type {AdventureDefinition, AdventureId, AdventureSave, BattleState, CurriculumChapterDefinition, CurriculumGradeDefinition, CurriculumLessonDefinition, PlayerProfile, Question} from '@lernhelden/engine';
import {applyAchievementEvent, battleAttacks, bossGate, buyItem, chapterComplete, chapterUnlocked, completeCampaignRun, completeCurriculumLesson, createAdventureSave, createBattle, createProfile, currentCampaignChapter, discardItem, equipItem, equipmentStats, nextTurn, normalizeAdventureSave, openCampaignChest, rankFor, recordMastery, resolveCorrect, resolveCounter, selectAttack, touchSave, unequipSlot, upgradeCost, upgradeItem} from '@lernhelden/engine';
import {adventureById, adventures} from './adventures';
import {avatarSprite, Sprite, spriteUrl, uiSprites} from './components/Sprite';
import {Icon} from './components/Icon';
import {InventoryScreen,ShopScreen} from './components/ArcaneScreens';
import {ItemSprite, MerchantPortrait} from './components/PixelArt';
import {firebaseErrorMessage, FirebaseSaveRepository, login, logout, observeUser, register} from './persistence/firebase';
import {LocalSaveRepository} from './persistence/local';
import {advanceBattlePhase, comicText, companionStage, companions, focusHelp, phasesFor} from './battlePresentation';
import type {BattleKind, CompanionPose, CompanionPresentation, FocusHelp} from './battlePresentation';
import {collides, collisionRects, paintWorldScene, securePosition, worldScenes} from './worldMap';

type Screen = 'home'|'profile'|'adventure'|'grade'|'chapter'|'campaign'|'inventory'|'shop'|'world'|'achievements'|'settings'|'battle'|'practice'|'football';
type Route = {screen:Screen; adventureId?:AdventureId; gradeId?:string; chapterId?:string};
type CurriculumRun = {gradeId:string;chapterId:string;lessonId:string;modeId:string;enemyId:string};

const arcaneThemes:Record<AdventureId,Record<string,string>>={
  fractions:{'--primary':'#9b7bff','--accent':'#f3c969','--surface':'#182343','--background':'#0b1020'},
  decimals:{'--primary':'#45b7ff','--accent':'#68e0dd','--surface':'#182343','--background':'#0b1020'},
  vocabulary:{'--primary':'#34d6c7','--accent':'#ffbf69','--surface':'#182343','--background':'#0b1020'},
};

const FootballGame=lazy(()=>import('./components/FootballGame').then(module=>({default:module.FootballGame})));

export function readRoute():Route {
  const parts=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
  if(parts[0]==='football')return{screen:'football'};
  if(parts[0]==='profile')return{screen:'profile'};
  if(parts[0]==='achievements')return{screen:'achievements'};
  if(parts[0]==='settings')return{screen:'settings'};
  if(parts[0]==='adventure'&&parts[1] in adventureById){
    const adventureId=parts[1] as AdventureId;
    if(parts[2]==='grade'&&parts[3]&&parts[4]==='chapter'&&parts[5])return{screen:'chapter',adventureId,gradeId:parts[3],chapterId:parts[5]};
    if(parts[2]==='grade'&&parts[3])return{screen:'grade',adventureId,gradeId:parts[3]};
    return{screen:(parts[2] as Screen)||'adventure',adventureId};
  }
  return{screen:'home'};
}

const go=(path:string)=>{location.hash=path.startsWith('/')?path:`/${path}`;};
type FractionPracticeVariant='proper'|'mixed';
const practiceVariantKey=(adventureId:AdventureId)=>`lernhelden:practice:${adventureId}`;
const curriculumRunKey=(adventureId:AdventureId)=>`lernhelden:curriculum:${adventureId}`;
const readSession=<T,>(key:string):T|null=>{try{const value=sessionStorage.getItem(key);return value?JSON.parse(value) as T:null}catch{return null}};
const startTraining=(adventure:AdventureDefinition,modeId:string,variant?:FractionPracticeVariant)=>{
  sessionStorage.setItem(`lernhelden:mode:${adventure.id}`,modeId);
  sessionStorage.removeItem(`lernhelden:campaign:${adventure.id}`);
  sessionStorage.removeItem(curriculumRunKey(adventure.id));
  if(adventure.id==='fractions'&&(modeId==='add'||modeId==='sub')&&variant)sessionStorage.setItem(practiceVariantKey(adventure.id),variant);
  else sessionStorage.removeItem(practiceVariantKey(adventure.id));
  go(`/adventure/${adventure.id}/battle`);
};
const within=<T,>(promise:Promise<T>,milliseconds:number)=>new Promise<T>((resolve,reject)=>{const timer=window.setTimeout(()=>reject(new Error('timeout')),milliseconds);promise.then(value=>{clearTimeout(timer);resolve(value)},error=>{clearTimeout(timer);reject(error)})});
const cachedJson=<T,>(key:string):T|null=>{try{const value=localStorage.getItem(key);return value?JSON.parse(value) as T:null}catch{return null}};

export function App(){
  const demoMode=import.meta.env.VITE_E2E_MODE==='true';
  const [user,setUser]=useState<import('firebase/auth').User|null|undefined>(demoMode?({uid:'e2e'} as import('firebase/auth').User):undefined);
  const [profile,setProfile]=useState<PlayerProfile|null>(null);
  const [saves,setSaves]=useState<Partial<Record<AdventureId,AdventureSave>>>({});
  const [route,setRoute]=useState<Route>(readRoute);
  const [busy,setBusy]=useState(true);
  const [message,setMessage]=useState('');
  const repository=useMemo(()=>user?(demoMode?new LocalSaveRepository():new FirebaseSaveRepository(user)):null,[demoMode,user]);

  useEffect(()=>demoMode?undefined:observeUser(setUser),[demoMode]);
  useEffect(()=>{const listener=()=>setRoute(readRoute());window.addEventListener('hashchange',listener);return()=>window.removeEventListener('hashchange',listener)},[]);
  useEffect(()=>{
    if(!user||!repository){setBusy(false);setProfile(null);setSaves({});return;}
    let active=true;setBusy(true);
    const initialize=async()=>{
      try{
        const migrated=await within(repository.migrateLegacy(),6000);
        const loaded=Object.fromEntries(await Promise.all(adventures.map(async adventure=>[adventure.id,(await within(repository.loadAdventure(adventure.id),2500))??createAdventureSave(adventure)])));
        if(active){setProfile(migrated);setSaves(loaded);setBusy(false);}
      }catch(error){
        const fallbackProfile=cachedJson<PlayerProfile>('lernhelden:profile:v1')??createProfile();
        const fallbackSaves=Object.fromEntries(adventures.map(adventure=>[adventure.id,normalizeAdventureSave(cachedJson<AdventureSave>(`lernhelden:adventure:${adventure.id}:v1`),adventure)]));
        if(active){setProfile(fallbackProfile);setSaves(fallbackSaves);setMessage(firebaseErrorMessage(error));setBusy(false);}
      }
    };
    void initialize();
    return()=>{active=false};
  },[user,repository]);
  useEffect(()=>{document.documentElement.dataset.uiScale=profile?.settings.uiScale??'normal';document.documentElement.classList.toggle('reduced-motion',Boolean(profile?.settings.reducedMotion));},[profile?.settings]);

  const saveProfile=async(next:PlayerProfile)=>{setProfile(next);try{await repository?.saveProfile(next)}catch{setMessage('Änderung lokal gespeichert – Cloud folgt später.')}};
  const saveAdventure=async(next:AdventureSave)=>{setSaves(current=>({...current,[next.adventureId]:next}));try{await repository?.saveAdventure(next)}catch{setMessage('Fortschritt lokal gespeichert – Cloud folgt später.')}};
  const dispatchEvent=async(adventure:AdventureDefinition,type:Parameters<typeof applyAchievementEvent>[2]['type'])=>{if(!profile)return;await saveProfile(applyAchievementEvent(profile,adventure,{type,adventureId:adventure.id} as never));};

  if(user===undefined||busy)return <Loading/>;
  if(!user)return <AuthScreen message={message}/>;
  if(!profile)return <Loading/>;
  if(!profile.displayName)return <ProfileEditor profile={profile} onSave={saveProfile} firstRun/>;
  const adventure=route.adventureId?adventureById[route.adventureId]:undefined;
  const save=adventure?saves[adventure.id]??createAdventureSave(adventure):undefined;
  return <div className={`app${route.screen==='world'?' world-active':''}`} style={adventure?arcaneThemes[adventure.id] as React.CSSProperties:undefined}>
    {route.screen!=='football'&&<Header profile={profile} adventure={adventure} save={save} onLogout={()=>void logout()}/>}
    {message&&<button className="notice" onClick={()=>setMessage('')}>{message}</button>}
    <main>
      {route.screen==='home'&&<PlatformHome profile={profile}/>}
      {route.screen==='profile'&&<ProfileEditor profile={profile} onSave={saveProfile}/>}
      {route.screen==='achievements'&&<Achievements profile={profile}/>}
      {route.screen==='settings'&&<Settings profile={profile} onSave={saveProfile}/>}
      {route.screen==='football'&&<Suspense fallback={<Loading/>}><FootballGame/></Suspense>}
      {adventure&&save&&route.screen==='adventure'&&<AdventureHome adventure={adventure} save={save} profile={profile}/>}
      {adventure&&save&&route.screen==='grade'&&route.gradeId&&<CurriculumGradeScreen adventure={adventure} save={save} gradeId={route.gradeId}/>}
      {adventure&&save&&route.screen==='chapter'&&route.gradeId&&route.chapterId&&<CurriculumChapterScreen adventure={adventure} save={save} gradeId={route.gradeId} chapterId={route.chapterId}/>}
      {adventure&&save&&route.screen==='campaign'&&<Campaign adventure={adventure} save={save} onSave={saveAdventure}/>}
      {adventure&&save&&route.screen==='inventory'&&<InventoryScreen adventure={adventure} save={save} profile={profile} onSave={saveAdventure} onEvent={type=>dispatchEvent(adventure,type)} navigate={go}/>}
      {adventure&&save&&route.screen==='shop'&&<ShopScreen adventure={adventure} save={save} onSave={saveAdventure} onEvent={type=>dispatchEvent(adventure,type)} navigate={go}/>}
      {adventure&&save&&route.screen==='world'&&<World adventure={adventure} save={save} profile={profile} onSave={saveAdventure}/>}
      {adventure&&save&&route.screen==='battle'&&<Battle adventure={adventure} initialSave={save} profile={profile} onSave={saveAdventure} onProfile={saveProfile}/>}
      {adventure&&save&&route.screen==='practice'&&<QuickPractice adventure={adventure} initialSave={save} profile={profile} onSave={saveAdventure} onProfile={saveProfile}/>}
    </main>
    {route.screen!=='battle'&&route.screen!=='practice'&&route.screen!=='world'&&route.screen!=='football'&&<MobileNavigation route={route} adventure={adventure} onLogout={()=>void logout()}/>}
  </div>;
}

function Loading(){return <div className="loading"><div className="pixel-loader"/><h1>Lernhelden</h1><p>Deine Abenteuer werden vorbereitet …</p></div>}

function AuthScreen({message}:{message:string}){
  const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [feedback,setFeedback]=useState(message);const [busy,setBusy]=useState(false);
  const submit=async(create:boolean)=>{if(!email||password.length<6){setFeedback('Bitte E-Mail und ein Passwort mit mindestens 6 Zeichen eingeben.');return}setBusy(true);try{if(create)await register(email,password);else await login(email,password)}catch(error){setFeedback((error as {code?:string}).code==='auth/invalid-credential'?'E-Mail oder Passwort stimmt nicht.':'Die Anmeldung hat nicht funktioniert.')}finally{setBusy(false)}};
  return <div className="auth-page"><section className="auth-card"><div className="logo-lockup"><Sprite sprite={uiSprites.map} size={76}/><div><span>Eine Welt. Viele Abenteuer.</span><h1>Lernhelden</h1></div></div><p>Melde dich einmal an und spiele Brüche, Dezimalzahlen und Vokabeln mit demselben Helden.</p><label>E-Mail<input type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email"/></label><label>Passwort<input type="password" value={password} onChange={event=>setPassword(event.target.value)} onKeyDown={event=>event.key==='Enter'&&void submit(false)} autoComplete="current-password"/></label><div className="button-row"><button disabled={busy} onClick={()=>void submit(false)}>Anmelden</button><button className="secondary" disabled={busy} onClick={()=>void submit(true)}>Konto erstellen</button></div><p className="feedback" role="alert">{feedback}</p></section></div>;
}

function Header({profile,adventure,save,onLogout}:{profile:PlayerProfile;adventure?:AdventureDefinition;save?:AdventureSave;onLogout:()=>void}){
  const rank=adventure&&save?rankFor(adventure,save.xp):null;
  return <header className="topbar"><button className="brand" onClick={()=>go('/home')}><Sprite sprite={uiSprites.map} size={36}/><span>Lernhelden</span></button><div className="mobile-context">{adventure?.title??'Deine Lernwelten'}</div><nav>{adventure&&save&&<><button onClick={()=>go(`/adventure/${adventure.id}`)}>{adventure.title}</button><span>{rank?.title}</span><span className="currency"><Sprite sprite={adventure.currency.sprite} size={25}/>{save.currency}</span></>}<button onClick={()=>go('/achievements')}>Erfolge</button><button onClick={()=>go('/settings')}>Einstellungen</button><button onClick={()=>go('/profile')}>{profile.displayName}</button><button className="quiet" onClick={onLogout}>Abmelden</button></nav><button className="mobile-profile" onClick={()=>go('/profile')} aria-label={`Profil von ${profile.displayName}`}><Icon name="user"/></button></header>;
}

function MobileNavigation({route,adventure,onLogout}:{route:Route;adventure?:AdventureDefinition;onLogout:()=>void}){
  const [open,setOpen]=useState(false);
  const active=(screen:Screen)=>route.screen===screen;
  const item=(label:string,icon:Parameters<typeof Icon>[0]['name'],path:string,selected=false)=><button className={selected?'active':''} onClick={()=>{setOpen(false);go(path)}}><Icon name={icon}/><span>{label}</span></button>;
  return <>
    <nav className="mobile-nav" aria-label="Hauptnavigation">
      {adventure?<>{item('Abenteuer','home',`/adventure/${adventure.id}`,active('adventure')||active('grade')||active('chapter'))}{item('Karte','map',`/adventure/${adventure.id}/world`,active('world'))}{item('Beutel','bag',`/adventure/${adventure.id}/inventory`,active('inventory'))}</>:<>{item('Start','home','/home',active('home'))}{item('Erfolge','trophy','/achievements',active('achievements'))}{item('Held','user','/profile',active('profile'))}</>}
      <button className={open?'active':''} onClick={()=>setOpen(value=>!value)} aria-expanded={open}><Icon name="menu"/><span>Mehr</span></button>
    </nav>
    {open&&<div className="sheet-backdrop" onClick={()=>setOpen(false)}><section className="nav-sheet" role="dialog" aria-label="Weitere Navigation" onClick={event=>event.stopPropagation()}><header><div><small>Navigation</small><h2>Wohin möchtest du?</h2></div><button className="icon-button quiet" aria-label="Menü schließen" onClick={()=>setOpen(false)}><Icon name="close"/></button></header>{adventure&&item('Zum Händler','shop',`/adventure/${adventure.id}/shop`,active('shop'))}{item('Erfolge','trophy','/achievements',active('achievements'))}{item('Einstellungen','settings','/settings',active('settings'))}{item('Startseite','home','/home',active('home'))}<button className="logout-action" onClick={onLogout}><Icon name="logout"/>Abmelden</button></section></div>}
  </>;
}

export function PlatformHome({profile}:{profile:PlayerProfile}){return <div className="page home-page"><section className="platform-hero"><div><p className="eyebrow">Dein großes Lern-Rollenspiel</p><h1>Willkommen, {profile.displayName}!</h1><p>Ein Held, eine Spielwelt und immer neue Lernabenteuer.</p></div><Avatar profile={profile} size={160}/></section><h2>Wähle dein Abenteuer</h2><section className="adventure-grid">{adventures.filter(item=>item.status!=='hidden').map(adventure=><article className="adventure-card" style={{'--card-color':arcaneThemes[adventure.id]['--primary']} as React.CSSProperties} key={adventure.id}><Sprite sprite={adventure.enemies[adventure.enemies.length-1].sprite} size={100}/><span className="status">{adventure.status==='beta'?'Beta':'Bereit'}</span><h2>{adventure.title}</h2><p>{adventure.subtitle}</p><button onClick={()=>go(`/adventure/${adventure.id}`)}>Abenteuer betreten <Icon name="arrow-right" size={18}/></button></article>)}<article className="adventure-card football-beta-card"><div className="football-beta-art" aria-hidden="true"><div className="football-beta-pitch"><span className="football-beta-ball"/></div></div><span className="status">Beta</span><h2>Mathe Fußball</h2><p>3 gegen 3 spielen, Brüche lösen und dein Team ausstatten.</p><button onClick={()=>go('/football')}>Match starten <Icon name="arrow-right" size={18}/></button></article></section></div>}

function ProfileEditor({profile,onSave,firstRun=false}:{profile:PlayerProfile;onSave:(value:PlayerProfile)=>Promise<void>;firstRun?:boolean}){const [name,setName]=useState(profile.displayName);const [avatar,setAvatar]=useState(Number(profile.avatarPresetId.split('-')[1]||1)-1);return <div className="page narrow"><p className="eyebrow">{firstRun?'Dein erster Schritt':'Gemeinsames Profil'}</p><h1>Gestalte deinen Lernhelden</h1><label className="field">Heldenname<input maxLength={24} value={name} onChange={event=>setName(event.target.value)}/></label><div className="avatar-picker">{Array.from({length:6},(_,index)=><button key={index} className={avatar===index?'selected':''} onClick={()=>setAvatar(index)}><Sprite sprite={avatarSprite(index)} size={88}/><span>Vorlage {index+1}</span></button>)}</div><button disabled={!name.trim()} onClick={()=>void onSave({...profile,displayName:name.trim(),avatarPresetId:`avatar-${avatar+1}`,clientUpdatedAt:Date.now()}).then(()=>go('/home'))}>Profil speichern</button></div>}

function Avatar({profile,size=120}:{profile:PlayerProfile;size?:number}){const index=Math.max(0,Number(profile.avatarPresetId.split('-')[1]||1)-1);return <div className="avatar"><Sprite sprite={avatarSprite(index)} size={size}/></div>}
function BackButton({to,label}:{to:string;label:string}){return <button className="back" onClick={()=>go(to)}><Icon name="arrow-left" size={18}/>{label}</button>}
const modeSprite=(index:number)=>[uiSprites.map,uiSprites.chest,uiSprites.achievement,uiSprites.shop][index%4];

function FreeAdventureSection({adventure,secondary=false}:{adventure:AdventureDefinition;secondary?:boolean}){
  const modes=<section className="mode-grid">{adventure.modes.map((mode,index)=>{const chooseFractionVariant=adventure.id==='fractions'&&(mode.id==='add'||mode.id==='sub');return <article key={mode.id}><Sprite sprite={modeSprite(index)} size={52} className="mode-sprite"/><h3>{mode.title}</h3><p>{mode.description}</p>{chooseFractionVariant?<div className="practice-choice"><button onClick={()=>startTraining(adventure,mode.id,'proper')}>Nur Brüche</button><button className="secondary" onClick={()=>startTraining(adventure,mode.id,'mixed')}>Mit ganzen Zahlen</button></div>:<button onClick={()=>startTraining(adventure,mode.id)}>Training starten</button>}</article>})}</section>;
  const actions=<section className="action-grid"><button onClick={()=>go(`/adventure/${adventure.id}/inventory`)}><Sprite sprite={uiSprites.chest} size={54}/>Inventar</button><button onClick={()=>go(`/adventure/${adventure.id}/shop`)}><Sprite sprite={uiSprites.shop} size={54}/>Shop</button><button onClick={()=>go(`/adventure/${adventure.id}/world`)}><Sprite sprite={uiSprites.map} size={54}/>Weltkarte</button></section>;
  if(!secondary)return <><button className="campaign-entry" onClick={()=>go(`/adventure/${adventure.id}/campaign`)}><span><small>Deine große Reise</small><strong>24-Wochen-Kampagne</strong></span><Icon name="arrow-right"/></button><h2>Wähle dein Training</h2>{modes}{actions}</>;
  return <section className="free-adventure"><div className="free-adventure-heading"><div><p className="eyebrow">Freies Abenteuer</p><h2>Trainiere auf deine Art</h2><p>Kampagne, freie Wortkämpfe und deine Ausrüstung bleiben jederzeit erreichbar.</p></div><button className="campaign-entry compact" onClick={()=>go(`/adventure/${adventure.id}/campaign`)}><span><small>Deine große Reise</small><strong>24-Wochen-Kampagne</strong></span><Icon name="arrow-right"/></button></div>{modes}{actions}</section>;
}

function launchCurriculumLesson(adventure:AdventureDefinition,grade:CurriculumGradeDefinition,chapter:CurriculumChapterDefinition,lesson:CurriculumLessonDefinition,presentation:'battle'|'quick'='battle'){
  const run:CurriculumRun={gradeId:grade.id,chapterId:chapter.id,lessonId:lesson.id,modeId:lesson.modeId,enemyId:lesson.enemyId};
  sessionStorage.setItem(`lernhelden:mode:${adventure.id}`,lesson.modeId);
  sessionStorage.setItem(curriculumRunKey(adventure.id),JSON.stringify(run));
  sessionStorage.removeItem(`lernhelden:campaign:${adventure.id}`);
  sessionStorage.removeItem(practiceVariantKey(adventure.id));
  go(`/adventure/${adventure.id}/${presentation==='quick'?'practice':'battle'}`);
}

export function AdventureHome({adventure,save,profile}:{adventure:AdventureDefinition;save:AdventureSave;profile:PlayerProfile}){
  const stats=equipmentStats(save,adventure),rank=rankFor(adventure,save.xp);
  const curriculum=adventure.curriculum;
  return <div className="page"><BackButton to="/home" label="Alle Abenteuer"/><section className="adventure-hero"><div><p className="eyebrow">{rank.title}</p><h1>{adventure.title}</h1><p>{adventure.subtitle}</p><div className="stats"><span>{save.completed}<small>Aufgaben</small></span><span>{stats.power}<small>Stärke</small></span><span>{stats.defense}<small>Schutz</small></span></div></div><Avatar profile={profile} size={150}/></section>{curriculum?<><section className="curriculum-heading"><p className="eyebrow">Dein Englisch-Lehrplan</p><h2>Wähle deine Klasse</h2><p>Übe genau die Grundlagen, die du in deiner Klassenstufe brauchst.</p></section><section className="curriculum-grid grade-grid">{curriculum.grades.map((grade,index)=>{const available=grade.status==='released',lessonIds=grade.chapters.flatMap(chapter=>chapter.lessons.map(lesson=>lesson.id)),done=lessonIds.filter(id=>save.curriculum.completedLessonIds.includes(id)).length;return <article className={`curriculum-card ${available?'available':'coming-soon'}`} key={grade.id}><div className="curriculum-card-icon"><Sprite sprite={modeSprite(index)} size={58}/></div><span className="curriculum-status">{available?`${done}/${lessonIds.length} Übungen`:'Coming Soon'}</span><h3>{grade.title}</h3><p>{grade.description}</p><button disabled={!available} onClick={()=>available&&go(`/adventure/${adventure.id}/grade/${grade.id}`)}>{available?'Klasse öffnen':'In Vorbereitung'} {available&&<Icon name="arrow-right" size={17}/>}</button></article>})}</section><FreeAdventureSection adventure={adventure} secondary/></>:<FreeAdventureSection adventure={adventure}/>}</div>
}

export function CurriculumGradeScreen({adventure,save,gradeId}:{adventure:AdventureDefinition;save:AdventureSave;gradeId:string}){
  const grade=adventure.curriculum?.grades.find(candidate=>candidate.id===gradeId);
  if(!grade)return <div className="page"><BackButton to={`/adventure/${adventure.id}`} label="Zurück"/><h1>Klasse nicht gefunden</h1></div>;
  return <div className="page curriculum-page"><BackButton to={`/adventure/${adventure.id}`} label="Alle Klassen"/><p className="eyebrow">Englisch · Sächsisches Gymnasium</p><h1>{grade.title}</h1><p>{grade.description}</p><section className="curriculum-grid chapter-grid">{grade.chapters.map(chapter=>{const available=chapter.status==='released',done=chapter.lessons.filter(lesson=>save.curriculum.completedLessonIds.includes(lesson.id)).length;return <article className={`curriculum-card chapter-card ${available?'available':'coming-soon'}`} key={chapter.id}><span className="chapter-number">{available?`Kapitel ${chapter.index}`:'+'}</span><span className="curriculum-status">{available?`${done}/${chapter.lessons.length} Übungen`:'Coming Soon'}</span><h2>{chapter.title}</h2><p>{chapter.description}</p><button disabled={!available} onClick={()=>available&&go(`/adventure/${adventure.id}/grade/${grade.id}/chapter/${chapter.id}`)}>{available?'Kapitel öffnen':'In Vorbereitung'} {available&&<Icon name="arrow-right" size={17}/>}</button></article>})}</section></div>;
}

export function CurriculumChapterScreen({adventure,save,gradeId,chapterId}:{adventure:AdventureDefinition;save:AdventureSave;gradeId:string;chapterId:string}){
  const grade=adventure.curriculum?.grades.find(candidate=>candidate.id===gradeId);
  const chapter=grade?.chapters.find(candidate=>candidate.id===chapterId);
  if(!grade||!chapter)return <div className="page"><BackButton to={`/adventure/${adventure.id}`} label="Zurück"/><h1>Kapitel nicht gefunden</h1></div>;
  const completed=new Set(save.curriculum.completedLessonIds);
  const finished=chapter.lessons.filter(lesson=>completed.has(lesson.id)).length;
  return <div className="page curriculum-page"><BackButton to={`/adventure/${adventure.id}/grade/${grade.id}`} label={grade.title}/><section className="chapter-hero"><div><p className="eyebrow">Kapitel {chapter.index} · {grade.title}</p><h1>{chapter.title}</h1><p>{chapter.description}</p></div><div className="chapter-ring"><strong>{finished}</strong><span>von {chapter.lessons.length}</span></div></section><section className="lesson-path">{chapter.lessons.map((lesson,index)=>{const done=completed.has(lesson.id),missing=(lesson.requiredLessonIds??[]).filter(id=>!completed.has(id)),locked=lesson.status!=='released'||missing.length>0,quickEligible=adventure.id==='vocabulary'&&grade.id==='grade-5'&&chapter.id==='basics'&&['spelling','numbers-1-50','teacher-says'].includes(lesson.id);return <article className={`lesson-card ${done?'completed':''} ${locked?'locked':''}`} key={lesson.id}><div className="lesson-node">{done?<Icon name="check" size={25}/>:locked?<Icon name="lock" size={22}/>:index+1}</div><div className="lesson-content"><span>{done?'Geschafft':locked?'Noch gesperrt':`Übung ${index+1}`}</span><h2>{lesson.title}</h2><p>{lesson.description}</p>{missing.length>0&&<small>Gewinne zuerst Buchstabieren, Zahlen und Teacher-Sätze.</small>}</div><div className="lesson-actions"><button disabled={locked} onClick={()=>!locked&&launchCurriculumLesson(adventure,grade,chapter,lesson)}>{done?'Erneut kämpfen':'Wortkampf starten'} {!locked&&<Icon name="arrow-right" size={17}/>}</button>{quickEligible&&<button className="secondary" disabled={locked} onClick={()=>!locked&&launchCurriculumLesson(adventure,grade,chapter,lesson,'quick')}>{done?'Schnell üben':'Schnellübung starten'} {!locked&&<Icon name="arrow-right" size={17}/>}</button>}</div></article>})}</section></div>;
}

export function Campaign({adventure,save,onSave}:{adventure:AdventureDefinition;save:AdventureSave;onSave:(save:AdventureSave)=>Promise<void>}){
  const stats=equipmentStats(save,adventure);
  const activeChapter=currentCampaignChapter(save,adventure)?.index??1;
  const launch=(modeId:string,chapter:number,missionId?:string,target?:'elite'|'boss')=>{sessionStorage.setItem(`lernhelden:mode:${adventure.id}`,modeId);sessionStorage.setItem(`lernhelden:campaign:${adventure.id}`,JSON.stringify({chapter,missionId,target}));sessionStorage.removeItem(curriculumRunKey(adventure.id));go(`/adventure/${adventure.id}/battle`)};
  return <div className="page campaign-page"><BackButton to={`/adventure/${adventure.id}`} label="Zurück"/><p className="eyebrow">24 Wochen · 12 Kapitel · keine Kalender-Sperre</p><h1>Deine Langzeitkampagne</h1><p>Meisterschaft und Fehlerwiederholung begleiten jedes Lernziel. Tages- und Wochenaufträge sind Bonus ohne Streak-Druck.</p><section className="campaign-grid">{(adventure.campaign ?? []).map(chapter=>{const unlocked=chapterUnlocked(save,chapter),completedMissions=chapter.missions.filter(mission=>save.campaign.completedMissionIds.includes(mission.id)).length,done=chapterComplete(save,chapter),eliteDone=save.campaign.defeatedEliteIds.includes(chapter.eliteEnemyId),bossDone=save.campaign.defeatedBossIds.includes(chapter.bossEnemyId),missingPower=Math.max(0,chapter.minimumPower-stats.power),missingDefense=Math.max(0,chapter.minimumDefense-stats.defense),gate=bossGate(save,chapter,stats),bossHint=!done?'Erst alle Missionen abschließen.':!eliteDone?'Erst die Elite besiegen.':missingPower||missingDefense?`Es fehlen ${[missingPower&&`${missingPower} Stärke`,missingDefense&&`${missingDefense} Schutz`].filter(Boolean).join(' und ')}.`:'Bereit für den Kapitelboss.';return <details className={!unlocked?'locked':''} open={chapter.index===activeChapter} key={chapter.id}><summary><span><small>Kapitel {chapter.index} · Itemstufe {chapter.itemTier}</small><h2>{chapter.topic}</h2></span><span className="chapter-progress">{bossDone?<Icon name="check"/>:<>{completedMissions}/{chapter.missions.length}</>}<Icon name="chevron-down"/></span></summary><div className="chapter-body"><p>Boss: Stärke {chapter.minimumPower} · Schutz {chapter.minimumDefense}</p><p className="campaign-status">Missionen: {completedMissions}/{chapter.missions.length} · Elite: {eliteDone?'besiegt':'offen'} · Boss: {bossDone?'besiegt':'offen'}</p><div className="mission-list">{chapter.missions.map(mission=>{const complete=save.campaign.completedMissionIds.includes(mission.id);return <button disabled={!unlocked||complete} key={mission.id} onClick={()=>launch(mission.modeId,chapter.index,mission.id)}>{complete&&<Icon name="check" size={16}/>}<span>{mission.title}</span></button>})}</div><button disabled={!done||eliteDone} onClick={()=>launch(chapter.missions[0].modeId,chapter.index,undefined,'elite')}>{eliteDone&&<Icon name="check" size={16}/>} {eliteDone?'Elite besiegt':done?'Elitekampf':'Elitekampf · Missionen abschließen'}</button><button disabled={!gate||bossDone} onClick={()=>launch(chapter.missions[0].modeId,chapter.index,undefined,'boss')}>{bossDone&&<Icon name="check" size={16}/>} {bossDone?'Kapitelboss besiegt':'Kapitelboss'}</button>{!bossDone&&<p className="campaign-status">{bossHint}</p>}<button disabled={!bossDone||save.campaign.openedChestIds.includes(chapter.chestId)} onClick={()=>void onSave(openCampaignChest(save,chapter))}>{save.campaign.openedChestIds.includes(chapter.chestId)?<><Icon name="check" size={16}/> Schatztruhe geöffnet</>:`Schatztruhe +${chapter.reward}`}</button></div></details>})}</section></div>
}

function Inventory({adventure,save,profile,onSave,onEvent}:{adventure:AdventureDefinition;save:AdventureSave;profile:PlayerProfile;onSave:(save:AdventureSave)=>Promise<void>;onEvent:(type:'item-equipped')=>Promise<void>}){
  const [selected,setSelected]=useState<string|null>(null);const [mobileTab,setMobileTab]=useState<'equipment'|'chest'>('equipment');const stats=equipmentStats(save,adventure);
  const equip=async(itemId:string,slot:string)=>{const item=adventure.items.find(candidate=>candidate.id===itemId);if(!item||item.slot!==slot)return;await onSave(equipItem(save,adventure,itemId));await onEvent('item-equipped');setSelected(null)};
  const remove=async(itemId:string)=>{const item=adventure.items.find(candidate=>candidate.id===itemId);if(!item)return;const accepted=window.confirm(`„${item.name}“ wirklich dauerhaft löschen?\n\nDer Gegenstand wird abgelegt, entfernt und es gibt keine Rückerstattung.`);if(accepted)await onSave(discardItem(save,itemId))};
  const equippedIds=new Set(Object.values(save.equippedBySlot));
  const chestItems=save.ownedItemIds.map(itemId=>adventure.items.find(item=>item.id===itemId)).filter(item=>item&&!equippedIds.has(item.id));
  const selectedItem=adventure.items.find(item=>item.id===selected);
  const dropIntoChest=(itemId:string)=>{const item=adventure.items.find(candidate=>candidate.id===itemId);if(item&&save.equippedBySlot[item.slot]===item.id)void onSave(unequipSlot(save,item.slot))};
  return <div className="page inventory-page"><button className="back" onClick={()=>go(`/adventure/${adventure.id}`)}>← Zurück</button><p className="eyebrow">Ausrüstung anlegen und verwahren</p><h1>Charakterraum & Truhe</h1><section className="house-inventory"><article className="character-room"><div className="window-light"/><h2 className="character-name">{profile.displayName}</h2><div className="character-stage"><Avatar profile={profile} size={178}/><div className="slot-ring">{Object.entries(adventure.slots).map(([slot,label],index)=>{const item=adventure.items.find(candidate=>candidate.id===save.equippedBySlot[slot]);const valid=selected&&adventure.items.find(candidate=>candidate.id===selected)?.slot===slot;return <button key={slot} data-slot={slot} style={{'--slot-index':index} as React.CSSProperties} draggable={Boolean(item)} className={`drop-slot ${item?'filled':''} ${valid?'drop-valid':''}`} onDragStart={event=>item&&event.dataTransfer.setData('text/plain',item.id)} onDragOver={event=>event.preventDefault()} onDrop={event=>void equip(event.dataTransfer.getData('text/plain'),slot)} onClick={()=>selected&&void equip(selected,slot)}>{item?<ItemSprite item={item} size={45}/>:<span className="empty-slot"/>}<span><strong>{label}</strong><small>{item?.name??'Leer'}</small></span>{item&&<span className="link" onClick={event=>{event.stopPropagation();void onSave(unequipSlot(save,slot))}}>Ablegen</span>}</button>})}</div></div><div className="stats inventory-stats"><span>{stats.power}<small>Stärke</small></span><span>{stats.defense}<small>Schutz</small></span><span>{stats.luck}<small>Glück</small></span></div><p className="help">Ziehe ein Item auf den passenden Platz. Auf Touch-Geräten: Item und danach den leuchtenden Platz antippen.</p></article><article className="chest-room" onDragOver={event=>event.preventDefault()} onDrop={event=>dropIntoChest(event.dataTransfer.getData('text/plain'))}><div className="chest-lid"/><div className="chest-title"><h2>Meine Truhe</h2><small>{chestItems.length} Gegenstände</small></div><div className="chest-grid">{chestItems.length===0&&<p className="empty-chest">Die Truhe ist leer. Ausrüstung bekommst du im Shop.</p>}{chestItems.map(item=>item&&<article draggable key={item.id} onDragStart={event=>event.dataTransfer.setData('text/plain',item.id)} className={selected===item.id?'selected':''} onClick={()=>setSelected(current=>current===item.id?null:item.id)}><ItemSprite item={item} size={62}/><strong>{item.name}</strong><small>Stärke {item.power} · Schutz {item.defense} · Glück {item.luck}</small><button className="danger" onClick={event=>{event.stopPropagation();void remove(item.id)}}>Dauerhaft löschen</button></article>)}</div><button className="chest-shop-button" onClick={()=>go(`/adventure/${adventure.id}/shop`)}>Zum Händler</button></article></section></div>;
}

function Shop({adventure,save,onSave,onEvent}:{adventure:AdventureDefinition;save:AdventureSave;onSave:(save:AdventureSave)=>Promise<void>;onEvent:(type:'item-bought')=>Promise<void>}){const currentRank=rankFor(adventure,save.xp),tier=adventure.ranks.indexOf(currentRank)+1;const purchase=async(id:string)=>{const next=buyItem(save,adventure,id);if(next===save)return;await onSave(next);await onEvent('item-bought')};const tiers=[...new Set(adventure.items.map(item=>item.tier))];return <div className="page shop-page"><button className="back" onClick={()=>go(`/adventure/${adventure.id}`)}>← Zurück</button><div className="heading-row"><div><p className="eyebrow">Ausrüstung für dein Abenteuer</p><h1>{adventure.merchant.shopTitle}</h1></div><div className="wallet"><Sprite sprite={adventure.currency.sprite} size={44}/><strong>{save.currency}</strong><span>{adventure.currency.name}</span></div></div><section className={`merchant-shop ${adventure.merchant.backdrop}`}><div className="merchant-counter"><MerchantPortrait merchant={adventure.merchant}/><div className="merchant-speech"><strong>{adventure.merchant.name}</strong><p>{adventure.merchant.greeting}</p><small>{currentRank.title} · {save.xp} Rangpunkte</small></div></div><div className="merchant-note">{adventure.merchant.note}</div>{tiers.map(itemTier=><section className={`merchant-shelf ${itemTier>tier?'closed':'open'}`} key={itemTier}><header><div><span>Regal {itemTier}</span><h2>{adventure.merchant.shelfNames[itemTier-1]??`Stufe ${itemTier}`}</h2></div><strong>{itemTier>tier?`Ab Rang ${itemTier}`:'Geöffnet'}</strong></header><div className="shop-grid">{adventure.items.filter(item=>item.tier===itemTier).map(item=>{const owned=save.ownedItemIds.includes(item.id),locked=item.tier>tier;return <article key={item.id} className={locked?'locked':''}><ItemSprite item={item} size={76}/><div><small>Stufe {item.tier}</small><h3>{item.name}</h3><p>Stärke {item.power} · Schutz {item.defense} · Glück {item.luck}</p>{owned?<button disabled>Bereits in der Truhe</button>:locked?<button disabled>Ab Rang {item.tier}</button>:<button onClick={()=>void purchase(item.id)}>{item.cost} {adventure.currency.name}</button>}</div></article>})}</div></section>)}</section></div>}

type BattleAnimation = {direction:'player'|'enemy'; attackId:BattleState['selectedAttackId']};
type AnswerResult = {given:string; expected:string; correct:boolean};

function CompanionActor({definition,pose,stage,text,compact=false}:{definition:CompanionPresentation;pose:CompanionPose;stage:1|2|3;text?:string;compact?:boolean}){
  return <aside className={`companion-actor pose-${pose} stage-${stage} ${compact?'compact':''}`} style={{'--companion-accent':definition.accent} as React.CSSProperties} aria-label={`${definition.name}, ${definition.species}, Stufe ${stage}`}><div className="companion-sprite-wrap"><span className="companion-runes" aria-hidden="true">{Array.from({length:Math.max(0,stage-1)},(_,index)=><i key={index}/>)}</span><Sprite sprite={definition.sprites[pose]} size={compact?68:78+stage*8}/></div>{text&&<div className="companion-speech"><small>{definition.name} · {definition.species}</small><p role="status">{text}</p></div>}</aside>;
}

function VisualFocus({help}:{help:FocusHelp}){
  return <div className={`visual-focus ${help.kind}`}><strong>{help.label}</strong>{help.kind==='word'?<p>{help.pattern}</p>:<div>{help.values.map((value,index)=><span key={`${value}-${index}`}>{help.kind==='fraction'?`Nenner ${value}`:value}</span>)}</div>}</div>;
}

function BattleIntro({adventure,enemy,companion,panel,onPanel,onBegin}:{adventure:AdventureDefinition;enemy:AdventureDefinition['enemies'][number];companion:CompanionPresentation;panel:0|1;onPanel:()=>void;onBegin:()=>void}){
  const lines=comicText(enemy.name,enemy.rule,companion);
  return <section className={`battle-intro ${adventure.id} ${adventure.id==='fractions'?'runes':''}`} aria-label="Kampf-Intro"><header><span>Pixel-Chronik</span><strong>1 Kampf · 2 Panels</strong></header><div className="comic-panel">{panel===0?<><Sprite sprite={enemy.sprite} size={154}/><div><small>{enemy.place}</small><h1>{enemy.name}</h1><p>Ein neuer Gegner versperrt den Weg.</p></div></>:<><div className="comic-duo"><Sprite sprite={enemy.sprite} size={118}/><Sprite sprite={companion.sprites.idle} size={92}/></div><div><p className="enemy-line">{lines.enemy}</p><p className="companion-line">{lines.companion}</p></div></>}</div><footer><button className="secondary" onClick={onBegin}>Überspringen</button>{panel===0?<button onClick={onPanel}>Weiter <Icon name="arrow-right" size={18}/></button>:<button onClick={onBegin}>Kampf beginnen</button>}</footer></section>;
}

function AnswerReview({result}:{result:AnswerResult}){
  return <div className={`answer-review ${result.correct?'correct':'wrong'}`} role="region" aria-label="Antwortauswertung">
    <div><span>Deine Antwort</span><strong>{result.given}</strong></div>
    <div><span>Richtige Lösung</span><strong>{result.expected}</strong></div>
  </div>;
}

const quickPracticeLength=10;

export function QuickPractice({adventure,initialSave,profile,onSave,onProfile}:{adventure:AdventureDefinition;initialSave:AdventureSave;profile:PlayerProfile;onSave:(save:AdventureSave)=>Promise<void>;onProfile:(profile:PlayerProfile)=>Promise<void>}){
  const run=readSession<CurriculumRun>(curriculumRunKey(adventure.id));
  const grade=run?adventure.curriculum?.grades.find(candidate=>candidate.id===run.gradeId):undefined;
  const chapter=grade?.chapters.find(candidate=>candidate.id===run?.chapterId);
  const lesson=chapter?.lessons.find(candidate=>candidate.id===run?.lessonId);
  const returnPath=run?`/adventure/${adventure.id}/grade/${run.gradeId}/chapter/${run.chapterId}`:`/adventure/${adventure.id}`;
  const stats=equipmentStats(initialSave,adventure);
  const createQuestion=(sequence:number,save:AdventureSave,previousLearningKey?:string)=>adventure.questionProvider.next({modeId:run?.modeId??adventure.modes[0].id,sequence,random:Math.random,mastery:save.masteryByKey,previousLearningKey});
  const [save,setSave]=useState(initialSave);
  const [currentProfile,setCurrentProfile]=useState(profile);
  const [sequence,setSequence]=useState(1);
  const [question,setQuestion]=useState<Question>(()=>createQuestion(1,initialSave));
  const [answer,setAnswer]=useState('');
  const [answerResult,setAnswerResult]=useState<AnswerResult|null>(null);
  const [correctCount,setCorrectCount]=useState(0);
  const [streak,setStreak]=useState(0);
  const [finished,setFinished]=useState(false);
  const [busy,setBusy]=useState(false);
  const inputRef=useRef<HTMLInputElement>(null);
  const lastLearningKey=useRef<string|undefined>(question.learningKey);

  useEffect(()=>{if(!answerResult&&!finished)inputRef.current?.focus()},[answerResult,finished,question.id]);

  if(!run||!grade||!chapter||!lesson)return <div className="page quick-practice-page"><BackButton to={returnPath} label="Zurück"/><section className="quick-empty"><h1>Schnellübung nicht gefunden</h1><p>Öffne die Übung erneut über den Klasse-5-Bereich.</p><button onClick={()=>go(returnPath)}>Zum Lehrplan</button></section></div>;

  const submit=async()=>{
    if(!answer.trim()||answerResult||busy)return;
    const correct=adventure.questionProvider.evaluate(question,answer);
    const nextStreak=correct?streak+1:0;
    let nextSave=recordMastery(correct?{
      ...save,
      currency:save.currency+2+Math.floor(stats.luck/4),
      xp:save.xp+1,
      completed:save.completed+1,
      stats:{...save.stats,correct:save.stats.correct+1,bestStreak:Math.max(save.stats.bestStreak,nextStreak)},
    }:{...save,stats:{...save.stats,wrong:save.stats.wrong+1}},question,correct);
    if(sequence===quickPracticeLength)nextSave=completeCurriculumLesson(nextSave,lesson.id);
    const result={given:answer,expected:question.answer,correct};
    setAnswerResult(result);
    setCorrectCount(current=>current+(correct?1:0));
    setStreak(nextStreak);
    setSave(nextSave);
    setBusy(true);
    try{
      await onSave(nextSave);
      const nextProfile=applyAchievementEvent(currentProfile,adventure,{type:correct?'answer-correct':'answer-wrong',adventureId:adventure.id});
      setCurrentProfile(nextProfile);
      await onProfile(nextProfile);
    }finally{setBusy(false)}
  };
  const advance=()=>{
    if(!answerResult||busy)return;
    if(sequence===quickPracticeLength){setFinished(true);return}
    const nextSequence=sequence+1;
    const nextQuestion=createQuestion(nextSequence,save,lastLearningKey.current);
    setSequence(nextSequence);
    setQuestion(nextQuestion);
    lastLearningKey.current=nextQuestion.learningKey;
    setAnswer('');
    setAnswerResult(null);
  };
  const restart=()=>{
    const first=createQuestion(1,save);
    setSequence(1);
    setQuestion(first);
    lastLearningKey.current=first.learningKey;
    setAnswer('');
    setAnswerResult(null);
    setCorrectCount(0);
    setStreak(0);
    setFinished(false);
    setBusy(false);
  };

  if(finished)return <div className="page quick-practice-page"><section className="quick-summary"><div className="quick-summary-mark" aria-hidden="true"><Icon name="check" size={42}/></div><p className="eyebrow">Schnellübung abgeschlossen</p><h1>{lesson.title}</h1><strong>{correctCount} von {quickPracticeLength} richtig</strong><p>Dein Lernstand wurde gespeichert. Du kannst die Übung direkt wiederholen oder zum Kapitel zurückkehren.</p><div><button onClick={restart}>Noch einmal üben</button><button className="secondary" onClick={()=>go(returnPath)}>Zurück zum Kapitel</button></div></section></div>;

  const progress=Math.round(sequence/quickPracticeLength*100);
  return <div className="page quick-practice-page">
    <header className="quick-header"><button className="quick-close" aria-label="Schnellübung verlassen" onClick={()=>go(returnPath)}><Icon name="close" size={20}/></button><div className="quick-progress"><div role="progressbar" aria-label="Fortschritt der Schnellübung" aria-valuemin={0} aria-valuemax={quickPracticeLength} aria-valuenow={sequence}><i style={{width:`${progress}%`}}/></div><span>Aufgabe {sequence} von {quickPracticeLength}</span></div><div className="quick-score"><strong>{correctCount}</strong><span>richtig</span></div></header>
    <div className="quick-shell">
      <section className="quick-question-card" aria-labelledby="quick-question-heading">
        <p className="quick-category">{question.category}</p>
        <h1 id="quick-question-heading">{question.prompt}</h1>
        {question.inputKind==='choice'?<div className="quick-choice-grid">{question.choices?.map((choice,index)=>{const isExpected=choice===question.answer,isSelected=choice===answer;return <button key={choice} disabled={Boolean(answerResult)||busy} className={`${isSelected?'selected ':''}${answerResult&&isExpected?'correct ':''}${answerResult&&!answerResult.correct&&isSelected?'wrong':''}`} onClick={()=>setAnswer(choice)}><span>{index+1}</span>{choice}</button>})}</div>:<label className="quick-write"><span>Deine Antwort</span><input ref={inputRef} disabled={Boolean(answerResult)||busy} inputMode="text" autoCapitalize="none" autoComplete="off" spellCheck={false} value={answer} onChange={event=>setAnswer(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();if(answerResult)advance();else void submit()}}} placeholder="Antwort eingeben …"/></label>}
      </section>
    </div>
    <footer className={`quick-footer ${answerResult?(answerResult.correct?'correct':'wrong'):''}`} aria-live="polite">
      <div className="quick-footer-inner">{answerResult?<><div className="quick-feedback"><div className="quick-feedback-icon"><Icon name={answerResult.correct?'check':'close'} size={24}/></div><div><strong>{answerResult.correct?'Richtig!':'Noch nicht.'}</strong>{!answerResult.correct&&<p>Deine Antwort: <b>{answerResult.given}</b> · Richtige Lösung: <b>{answerResult.expected}</b></p>}</div></div><button disabled={busy} onClick={advance}>{sequence===quickPracticeLength?'Ergebnis ansehen':'Weiter'}</button></>:<><p>Wähle oder schreibe die passende Antwort.</p><button disabled={!answer.trim()||busy} onClick={()=>void submit()}>Antwort prüfen</button></>}</div>
    </footer>
  </div>;
}

export function Battle({adventure,initialSave,profile,onSave,onProfile}:{adventure:AdventureDefinition;initialSave:AdventureSave;profile:PlayerProfile;onSave:(save:AdventureSave)=>Promise<void>;onProfile:(profile:PlayerProfile)=>Promise<void>}){
  const modeId=sessionStorage.getItem(`lernhelden:mode:${adventure.id}`)??adventure.modes[0].id;
  const campaignRun=readSession<{chapter:number;missionId?:string;target?:'elite'|'boss'}>(`lernhelden:campaign:${adventure.id}`);
  const curriculumRun=campaignRun?null:readSession<CurriculumRun>(curriculumRunKey(adventure.id));
  const [practiceVariant]=useState<FractionPracticeVariant|null>(()=>{
    const key=practiceVariantKey(adventure.id);
    const stored=!campaignRun&&adventure.id==='fractions'&&(modeId==='add'||modeId==='sub')?sessionStorage.getItem(key):null;
    sessionStorage.removeItem(key);
    return stored==='proper'||stored==='mixed'?stored:null;
  });
  const questionModeId=practiceVariant?`${modeId}:${practiceVariant}`:modeId;
  const chapter=campaignRun?(adventure.campaign ?? [])[campaignRun.chapter-1]:undefined;
  const curriculumGrade=curriculumRun?adventure.curriculum?.grades.find(candidate=>candidate.id===curriculumRun.gradeId):undefined;
  const curriculumChapter=curriculumGrade?.chapters.find(candidate=>candidate.id===curriculumRun?.chapterId);
  const curriculumLesson=curriculumChapter?.lessons.find(candidate=>candidate.id===curriculumRun?.lessonId);
  const curriculumEnemyIds=new Set((adventure.curriculum?.grades??[]).flatMap(grade=>grade.chapters.flatMap(item=>item.lessons.map(lesson=>lesson.enemyId))));
  const enemy=curriculumRun?adventure.enemies.find(candidate=>candidate.id===curriculumRun.enemyId)??adventure.enemies[0]:chapter&&campaignRun?.target?adventure.enemies.find(candidate=>candidate.id===(campaignRun.target==='boss'?chapter.bossEnemyId:chapter.eliteEnemyId))??adventure.enemies[0]:adventure.enemies.find(candidate=>!curriculumEnemyIds.has(candidate.id)&&!initialSave.clearedEnemyIds.includes(candidate.id))??adventure.enemies.find(candidate=>!curriculumEnemyIds.has(candidate.id))??adventure.enemies[adventure.enemies.length-1];
  const battleKind:BattleKind=campaignRun?.target??'normal';
  const companion=companions[adventure.id];
  const phaseList=phasesFor(battleKind);
  const stats=equipmentStats(initialSave,adventure);
  const [battle,setBattle]=useState<BattleState>(()=>createBattle(enemy,stats.defense));
  const [save,setSave]=useState(initialSave);
  const [question,setQuestion]=useState<Question|null>(null);
  const [answer,setAnswer]=useState('');
  const [answerResult,setAnswerResult]=useState<AnswerResult|null>(null);
  const [feedback,setFeedback]=useState('');
  const [sequence,setSequence]=useState(0);
  const [animation,setAnimation]=useState<BattleAnimation|null>(null);
  const [introPanel,setIntroPanel]=useState<0|1|null>(0);
  const [hintLevel,setHintLevel]=useState(0);
  const [highestPhase,setHighestPhase]=useState(0);
  const [phaseBanner,setPhaseBanner]=useState<number|null>(null);
  const [companionText,setCompanionText]=useState(companion.intro);
  const [companionPose,setCompanionPose]=useState<CompanionPose>('idle');
  const previousBattle=useRef<BattleState|null>(null);
  const animationTimers=useRef<number[]>([]);
  const battleStageRef=useRef<HTMLElement>(null);
  const lastLearningKey=useRef<string|undefined>(undefined);

  const showAnimation=(direction:BattleAnimation['direction'],attackId:BattleAnimation['attackId'],delay=0)=>{
    const start=()=>{
      setAnimation({direction,attackId});
      animationTimers.current.push(window.setTimeout(()=>setAnimation(null),520));
    };
    if(delay)animationTimers.current.push(window.setTimeout(start,delay));else start();
  };
  useEffect(()=>{Object.values(companion.sprites).forEach(sprite=>{const image=new Image();image.src=spriteUrl(sprite)});return()=>{animationTimers.current.forEach(timer=>window.clearTimeout(timer));}},[companion.sprites]);
  useEffect(()=>{
    const previous=previousBattle.current;
    if(previous){
      if(battle.enemyHp<previous.enemyHp)showAnimation('player',battle.selectedAttackId);
      if(battle.playerHp<previous.playerHp)showAnimation('enemy','spark',battle.enemyHp<previous.enemyHp?560:0);
    }
    previousBattle.current=battle;
  },[battle]);
  const sensedPhase=advanceBattlePhase(highestPhase,battle.enemyHp,battle.enemyMaxHp,battleKind);
  useEffect(()=>{
    if(sensedPhase<=highestPhase)return;
    setHighestPhase(sensedPhase);
    setPhaseBanner(sensedPhase);
    setCompanionText(companion.phase[Math.min(sensedPhase-1,companion.phase.length-1)]);
    setCompanionPose('cheer');
    animationTimers.current.push(window.setTimeout(()=>setPhaseBanner(null),1800));
  },[companion.phase,highestPhase,sensedPhase]);

  const newQuestion=()=>{
    const nextSequence=sequence+1;
    setSequence(nextSequence);
    const nextQuestion=adventure.questionProvider.next({modeId:questionModeId,sequence:nextSequence,random:Math.random,chapter:chapter?.index,mastery:save.masteryByKey,previousLearningKey:lastLearningKey.current});
    setQuestion(nextQuestion);
    lastLearningKey.current=nextQuestion.learningKey;
    setAnswer('');
    setAnswerResult(null);
    setFeedback('');
    setHintLevel(0);
    setCompanionText('Schau dir die Aufgabe in Ruhe an. Du hast Zeit.');
    setCompanionPose('idle');
  };
  const choose=(id:BattleState['selectedAttackId'])=>{
    const selected=selectAttack(battle,id);
    setBattle(selected);
    if(selected.phase==='question')newQuestion();
  };
  const persistEvent=async(next:AdventureSave,type:'answer-correct'|'answer-wrong'|'boss-defeated')=>{
    setSave(next);
    await onSave(next);
    await onProfile(applyAchievementEvent(profile,adventure,{type,adventureId:adventure.id}));
  };
  const focusBattleStage=()=>{
    const active=document.activeElement;
    if(active instanceof HTMLElement)active.blur();
    const stage=battleStageRef.current??document.querySelector<HTMLElement>('.battle-page .battle-stage');
    if(!stage)return;
    battleStageRef.current=stage;
    stage.tabIndex=-1;
    stage.focus({preventScroll:true});
    window.setTimeout(()=>stage.scrollIntoView?.({behavior:'smooth',block:'start'}),0);
  };
  const submit=async()=>{
    if(!question)return;
    focusBattleStage();
    const correct=adventure.questionProvider.evaluate(question,answer);
    setAnswerResult({given:answer,expected:question.answer,correct});
    if(correct){
      const hit=resolveCorrect(battle,enemy,curriculumRun?0:stats.power);
      let next=recordMastery({...save,currency:save.currency+2+Math.floor(stats.luck/4),xp:save.xp+1,completed:save.completed+1,stats:{...save.stats,correct:save.stats.correct+1,bestStreak:Math.max(save.stats.bestStreak,hit.state.streak)}},question,true);
      setFeedback(`Richtig! ${hit.damage} Schaden.`);
      setCompanionText(companion.correct[(sequence-1)%companion.correct.length]);
      setCompanionPose('cheer');
      if(hit.state.phase==='won'){
        const first=!next.clearedEnemyIds.includes(enemy.id);
        next=touchSave({...next,currency:next.currency+(first?enemy.reward:Math.max(5,Math.floor(enemy.reward/8))),xp:next.xp+(first?enemy.xp:0),clearedEnemyIds:first?[...next.clearedEnemyIds,enemy.id]:next.clearedEnemyIds});
        if(chapter&&campaignRun)next=completeCampaignRun(next,chapter,campaignRun);
        if(curriculumRun)next=completeCurriculumLesson(next,curriculumRun.lessonId);
        setBattle(hit.state);
        setCompanionText(companion.win);
        setCompanionPose('cheer');
        await persistEvent(next,'boss-defeated');
        return;
      }
      const counter=resolveCounter(hit.state,enemy,stats.defense,false);
      setBattle(counter.state);
      setFeedback(`Richtig! ${hit.damage} Schaden. ${enemy.name} kontert mit ${counter.damage}.`);
      await persistEvent(next,'answer-correct');
    }else{
      const counter=resolveCounter(battle,enemy,stats.defense,true);
      const next=recordMastery({...save,stats:{...save.stats,wrong:save.stats.wrong+1}},question,false);
      setBattle(counter.state);
      setFeedback(`Noch nicht. ${enemy.name} trifft mit ${counter.damage}.`);
      setCompanionText(companion.wrong[(sequence-1)%companion.wrong.length]);
      setCompanionPose('concerned');
      await persistEvent(next,'answer-wrong');
    }
  };
  const continueBattle=()=>{setBattle(nextTurn(battle));setQuestion(null);setFeedback('');setAnswerResult(null);setHintLevel(0);setCompanionPose('idle')};
  const revealHint=()=>{setHintLevel(current=>Math.min(3,current+1));setCompanionPose('hint');setCompanionText('Ich zeige dir eine Spur. Du findest den nächsten Schritt.')};
  const projectile=animation&&battleAttacks.find(attack=>attack.id===animation.attackId);
  const playerClass=`fighter player ${animation?.direction==='player'?'fighter-attacking':animation?.direction==='enemy'?'fighter-hit':''}`;
  const enemyClass=`fighter enemy ${animation?.direction==='enemy'?'fighter-attacking':animation?.direction==='player'?'fighter-hit':''}`;
  const activePhase=phaseList[highestPhase];
  const level=companionStage(save.masteryByKey);
  const currentFocus=question?focusHelp(question):null;

  const curriculumReturn=curriculumRun?`/adventure/${adventure.id}/grade/${curriculumRun.gradeId}/chapter/${curriculumRun.chapterId}`:`/adventure/${adventure.id}`;
  if(introPanel!==null)return <div className="page battle-page"><BackButton to={curriculumReturn} label="Kampf verlassen"/><BattleIntro adventure={adventure} enemy={enemy} companion={companion} panel={introPanel} onPanel={()=>setIntroPanel(1)} onBegin={()=>setIntroPanel(null)}/></div>;
  return <div className={`page battle-page battle-phase-${highestPhase+1}`}>
    <BackButton to={curriculumReturn} label="Kampf verlassen"/>
    <div className="battle-heading"><div><p className="eyebrow">{curriculumLesson?.title??adventure.modes.find(mode=>mode.id===modeId)?.title}</p><h1>{enemy.name}</h1></div><span>{curriculumLesson?`${curriculumGrade?.title} · ${curriculumChapter?.title}`:enemy.place}</span></div>
    <section className="battle-stage" ref={battleStageRef}>
      <div className="player-party"><div className={playerClass} data-testid="fighter-player"><Avatar profile={profile} size={105}/><strong>{profile.displayName}</strong><Health value={battle.playerHp} max={battle.playerMaxHp}/></div>{battle.phase!=='question'&&<CompanionActor definition={companion} pose={companionPose} stage={level} text={companionText}/>}</div>
      <div className="battle-center">gegen</div>
      <div className={enemyClass} data-testid="fighter-enemy"><Sprite sprite={enemy.sprite} size={118}/><strong>{enemy.name}</strong><Health value={battle.enemyHp} max={battle.enemyMaxHp}/></div>
      <div className="battle-phase-badge"><small>Phase {highestPhase+1}/{phaseList.length}</small><strong>{activePhase.label}</strong><span>{activePhase.detail}</span></div>
      {animation&&projectile&&<span className={`battle-projectile ${animation.direction}`} data-testid="battle-projectile"><Sprite sprite={projectile.sprite} size={52}/></span>}
      {phaseBanner!==null&&<div className="phase-banner" role="status">Phase {phaseBanner+1}: {phaseList[phaseBanner].label}</div>}
    </section>
    <div className="battle-interaction-layout">
      <div className="battle-actions">
        {battle.phase==='attack-select'&&<section><h2>Wähle deinen Angriff</h2><div className="attack-grid">{battleAttacks.map(attack=><button key={attack.id} disabled={(battle.cooldowns[attack.id]??0)>0} onClick={()=>choose(attack.id)}><Sprite sprite={attack.sprite} size={58}/><strong>{attack.name}</strong><small>{attack.id==='chain'?'Stärker mit Serie':`${attack.damage} Kraft · ${attack.cooldown} Abklingzeit`}</small></button>)}</div></section>}
        {battle.phase==='question'&&question&&<section className="question-card"><div className="question-companion"><CompanionActor definition={companion} pose={hintLevel?'hint':companionPose} stage={level} text={companionText} compact/></div><span>{question.category}</span><h2>{question.inputKind==='fraction'?<FractionExpression text={question.prompt}/>:question.prompt}</h2>{question.inputKind==='choice'?<div className="choice-grid">{question.choices?.map(choice=><button key={choice} onClick={()=>setAnswer(choice)} className={answer===choice?'selected':''}>{choice}</button>)}</div>:question.inputKind==='fraction'?<FractionInput value={answer} onChange={setAnswer}/>:<input className="answer-input" inputMode={question.inputKind==='text'?'text':'decimal'} autoCapitalize="none" spellCheck={false} value={answer} onChange={event=>setAnswer(event.target.value)} onKeyDown={event=>event.key==='Enter'&&void submit()}/>}<div className="question-actions"><button disabled={!answer} onClick={()=>void submit()}>Antwort prüfen</button><button className="secondary" disabled={hintLevel>=3} onClick={revealHint}>{hintLevel===0?'Tipp vom Begleiter':hintLevel<3?'Noch ein Tipp':'Alle Tipps gezeigt'}</button></div>{hintLevel===1&&<div className="companion-hint" role="status">{question.hintSteps[0]??'Betrachte die Aufgabe Schritt für Schritt.'}</div>}{hintLevel===2&&currentFocus&&<VisualFocus help={currentFocus}/>} {hintLevel===3&&<div className="companion-hint solution" role="status">{question.hintSteps.at(-1)??`Die Lösung ist ${question.answer}.`}</div>}</section>}
        {(battle.phase==='resolved'||battle.phase==='won'||battle.phase==='lost')&&<section className={`result ${battle.phase}`}><h2>{battle.phase==='won'?'Sieg!':battle.phase==='lost'?'Dein Held braucht eine Pause':'Auflösung'}</h2><p>{feedback}</p>{answerResult&&<AnswerReview result={answerResult}/>} {battle.phase==='resolved'?<button onClick={continueBattle}>Weiterkämpfen</button>:<button onClick={()=>go(curriculumRun?curriculumReturn:`/adventure/${adventure.id}/world`)}>{curriculumRun?'Zurück zu den Übungen':'Zur Weltkarte'}</button>}</section>}
      </div>
    </div>
  </div>;
}

function LegacyBattle({adventure,initialSave,profile,onSave,onProfile}:{adventure:AdventureDefinition;initialSave:AdventureSave;profile:PlayerProfile;onSave:(save:AdventureSave)=>Promise<void>;onProfile:(profile:PlayerProfile)=>Promise<void>}){
  const modeId=sessionStorage.getItem(`lernhelden:mode:${adventure.id}`)??adventure.modes[0].id;
  const campaignRun=JSON.parse(sessionStorage.getItem(`lernhelden:campaign:${adventure.id}`)??'null') as {chapter:number;missionId?:string;target?:'elite'|'boss'}|null;
  const chapter=campaignRun?(adventure.campaign ?? [])[campaignRun.chapter-1]:undefined;
  const enemy=chapter&&campaignRun?.target?adventure.enemies.find(candidate=>candidate.id===(campaignRun.target==='boss'?chapter.bossEnemyId:chapter.eliteEnemyId))??adventure.enemies[0]:adventure.enemies.find(candidate=>!initialSave.clearedEnemyIds.includes(candidate.id))??adventure.enemies[adventure.enemies.length-1];
  const stats=equipmentStats(initialSave,adventure);
  const [battle,setBattle]=useState<BattleState>(()=>createBattle(enemy,stats.defense));
  const [save,setSave]=useState(initialSave);const [question,setQuestion]=useState<Question|null>(null);const [answer,setAnswer]=useState('');const [feedback,setFeedback]=useState('');const [sequence,setSequence]=useState(0);
  const newQuestion=()=>{const nextSequence=sequence+1;setSequence(nextSequence);setQuestion(adventure.questionProvider.next({modeId,sequence:nextSequence,random:Math.random,chapter:chapter?.index,mastery:save.masteryByKey}));setAnswer('');setFeedback('')};
  const choose=(id:BattleState['selectedAttackId'])=>{const selected=selectAttack(battle,id);setBattle(selected);if(selected.phase==='question')newQuestion()};
  const persistEvent=async(next:AdventureSave,type:'answer-correct'|'answer-wrong'|'boss-defeated')=>{setSave(next);await onSave(next);await onProfile(applyAchievementEvent(profile,adventure,{type,adventureId:adventure.id}))};
  const submit=async()=>{
    if(!question)return;const correct=adventure.questionProvider.evaluate(question,answer);
    if(correct){const hit=resolveCorrect(battle,enemy,stats.power);let next=touchSave({...save,currency:save.currency+2+Math.floor(stats.luck/4),xp:save.xp+1,completed:save.completed+1,stats:{...save.stats,correct:save.stats.correct+1,bestStreak:Math.max(save.stats.bestStreak,hit.state.streak)}});setFeedback(`Richtig! ${hit.damage} Schaden.`);if(hit.state.phase==='won'){const first=!next.clearedEnemyIds.includes(enemy.id);next=touchSave({...next,currency:next.currency+(first?enemy.reward:Math.max(5,Math.floor(enemy.reward/8))),xp:next.xp+(first?enemy.xp:0),clearedEnemyIds:first?[...next.clearedEnemyIds,enemy.id]:next.clearedEnemyIds});if(chapter&&campaignRun)next=completeCampaignRun(next,chapter,campaignRun);setBattle(hit.state);await persistEvent(next,'boss-defeated');return}const counter=resolveCounter(hit.state,enemy,stats.defense,false);setBattle(counter.state);setFeedback(`Richtig! ${hit.damage} Schaden. ${enemy.name} kontert mit ${counter.damage}.`);await persistEvent(next,'answer-correct');}
    else{const counter=resolveCounter(battle,enemy,stats.defense,true);const next=touchSave({...save,stats:{...save.stats,wrong:save.stats.wrong+1}});setBattle(counter.state);setFeedback(`Noch nicht. Richtig ist ${question.answer}. ${enemy.name} trifft mit ${counter.damage}.`);await persistEvent(next,'answer-wrong')}
  };
  const continueBattle=()=>{setBattle(nextTurn(battle));setQuestion(null);setFeedback('')};
  return <div className="page battle-page"><button className="back" onClick={()=>go(`/adventure/${adventure.id}`)}>← Kampf verlassen</button><div className="battle-heading"><div><p className="eyebrow">{adventure.modes.find(mode=>mode.id===modeId)?.title}</p><h1>{enemy.name}</h1></div><span>{enemy.place}</span></div><section className="battle-stage"><div className="fighter"><Avatar profile={profile} size={105}/><strong>{profile.displayName}</strong><Health value={battle.playerHp} max={battle.playerMaxHp}/></div><div className="battle-center">gegen</div><div className="fighter"><Sprite sprite={enemy.sprite} size={118}/><strong>{enemy.name}</strong><Health value={battle.enemyHp} max={battle.enemyMaxHp}/></div></section>{battle.phase==='attack-select'&&<section><h2>Wähle deinen Angriff</h2><div className="attack-grid">{battleAttacks.map(attack=><button key={attack.id} disabled={(battle.cooldowns[attack.id]??0)>0} onClick={()=>choose(attack.id)}><Sprite sprite={attack.sprite} size={58}/><strong>{attack.name}</strong><small>{attack.id==='chain'?'Stärker mit Serie':`${attack.damage} Kraft · ${attack.cooldown} Abklingzeit`}</small></button>)}</div></section>}{battle.phase==='question'&&question&&<section className="question-card"><span>{question.category}</span><h2>{question.inputKind==='fraction'?<FractionExpression text={question.prompt}/>:question.prompt}</h2>{question.inputKind==='choice'?<div className="choice-grid">{question.choices?.map(choice=><button key={choice} onClick={()=>setAnswer(choice)} className={answer===choice?'selected':''}>{choice}</button>)}</div>:question.inputKind==='fraction'?<FractionInput value={answer} onChange={setAnswer}/>:<input className="answer-input" inputMode={question.inputKind==='text'?'text':'decimal'} autoCapitalize="none" spellCheck={false} value={answer} onChange={event=>setAnswer(event.target.value)} onKeyDown={event=>event.key==='Enter'&&void submit()}/>}<button disabled={!answer} onClick={()=>void submit()}>Antwort prüfen</button></section>}{(battle.phase==='resolved'||battle.phase==='won'||battle.phase==='lost')&&<section className={`result ${battle.phase}`}><h2>{battle.phase==='won'?'Sieg!':battle.phase==='lost'?'Dein Held braucht eine Pause':'Nächster Zug'}</h2><p>{feedback}</p>{battle.phase==='resolved'?<button onClick={continueBattle}>Weiterkämpfen</button>:<button onClick={()=>go(`/adventure/${adventure.id}/world`)}>Zur Weltkarte</button>}</section>}</div>;
}

function Health({value,max}:{value:number;max:number}){return <div className="health"><i style={{width:`${Math.max(0,100*value/max)}%`}}/><span>{value}/{max}</span></div>}
function FractionInput({value,onChange}:{value:string;onChange:(value:string)=>void}){
  const match=value.match(/^(?:(-?\d*)\s+)?(-?\d*)\/(-?\d*)$/);
  const whole=match?.[1]??'',top=match?.[2]??'',bottom=match?.[3]??'';
  const update=(nextWhole:string,nextTop:string,nextBottom:string)=>onChange(`${nextWhole.trim()?`${nextWhole.trim()} `:''}${nextTop}/${nextBottom}`);
  return <div className="fraction-input mixed-fraction-input"><label className="whole-number-field"><small>Ganze Zahl</small><input aria-label="Ganze Zahl" inputMode="numeric" value={whole} onChange={event=>update(event.target.value,top,bottom)}/></label><div className="fraction-fields"><label><small>Zähler</small><input aria-label="Zähler" inputMode="numeric" value={top} onChange={event=>update(whole,event.target.value,bottom)}/></label><span aria-hidden="true"/><label><small>Nenner</small><input aria-label="Nenner" inputMode="numeric" value={bottom} onChange={event=>update(whole,top,event.target.value)}/></label></div><p>Optional: Ganze Zahl für gemischte Zahlen, z. B. 1 1/3.</p></div>
}
function FractionExpression({text}:{text:string}){return <span className="fraction-expression">{text.split(/(\d+\/\d+)/g).map((part,index)=>{const match=part.match(/^(\d+)\/(\d+)$/);return match?<span className="math-fraction" key={index}><i>{match[1]}</i><b/><i>{match[2]}</i></span>:<span key={index}>{part}</span>})}</span>}

type MoveDirection=[number,number];

function TouchJoystick({onMove,onStop}:{onMove:(dx:number,dy:number)=>void;onStop:()=>void}){
  const pointerRef=useRef<number|null>(null);
  const directionRef=useRef<MoveDirection|null>(null);
  const repeatRef=useRef<number|undefined>(undefined);
  const moveRef=useRef(onMove);
  const stopRef=useRef(onStop);
  const [knob,setKnob]=useState({x:0,y:0});
  const [active,setActive]=useState(false);
  useEffect(()=>{moveRef.current=onMove;stopRef.current=onStop},[onMove,onStop]);
  const stopRepeat=()=>{if(repeatRef.current!==undefined){window.clearInterval(repeatRef.current);repeatRef.current=undefined}directionRef.current=null};
  const startDirection=(direction:MoveDirection|null)=>{
    if(!direction){stopRepeat();return}
    if(directionRef.current?.[0]===direction[0]&&directionRef.current?.[1]===direction[1])return;
    stopRepeat();directionRef.current=direction;moveRef.current(...direction);
    repeatRef.current=window.setInterval(()=>{const current=directionRef.current;if(current)moveRef.current(...current)},120);
  };
  const update=(event:React.PointerEvent<HTMLDivElement>)=>{
    const rect=event.currentTarget.getBoundingClientRect();
    const dx=event.clientX-(rect.left+rect.width/2),dy=event.clientY-(rect.top+rect.height/2);
    const distance=Math.hypot(dx,dy),limit=Math.min(22,Math.max(14,Math.min(rect.width,rect.height)*.22));
    const scale=distance>limit?limit/distance:1;
    setKnob({x:dx*scale,y:dy*scale});
    if(distance<6){startDirection(null);return}
    startDirection(Math.abs(dx)>=Math.abs(dy)?[dx<0?-1:1,0]:[0,dy<0?-1:1]);
  };
  const finish=(event?:React.PointerEvent<HTMLDivElement>)=>{
    if(event&&pointerRef.current!==event.pointerId)return;
    pointerRef.current=null;stopRepeat();setKnob({x:0,y:0});setActive(false);stopRef.current();
  };
  useEffect(()=>{const cancel=()=>{if(pointerRef.current===null)return;pointerRef.current=null;if(repeatRef.current!==undefined)window.clearInterval(repeatRef.current);repeatRef.current=undefined;directionRef.current=null;setKnob({x:0,y:0});setActive(false);stopRef.current()};window.addEventListener('blur',cancel);return()=>{window.removeEventListener('blur',cancel);if(repeatRef.current!==undefined)window.clearInterval(repeatRef.current)}},[]);
  const fallback=(label:string,direction:MoveDirection)=><button aria-label={label} onClick={()=>{moveRef.current(...direction);stopRef.current()}}/>;
  return <div className={`touch-joystick${active?' active':''}`} role="group" aria-label="Bewegungssteuerung"
    onPointerDown={event=>{if(pointerRef.current!==null)return;pointerRef.current=event.pointerId;event.currentTarget.setPointerCapture?.(event.pointerId);setActive(true);update(event)}}
    onPointerMove={event=>{if(pointerRef.current===event.pointerId)update(event)}}
    onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}>
    <span className="joystick-knob" style={{transform:`translate3d(${knob.x}px,${knob.y}px,0)`}}/>
    <span className="joystick-fallback">{fallback('Nach oben',[0,-1])}{fallback('Nach links',[-1,0])}{fallback('Nach rechts',[1,0])}{fallback('Nach unten',[0,1])}</span>
  </div>;
}

export function World({adventure,save,profile,onSave}:{adventure:AdventureDefinition;save:AdventureSave;profile:PlayerProfile;onSave:(save:AdventureSave)=>Promise<void>}){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const cameraRef=useRef<HTMLDivElement>(null);
  const [cameraSize,setCameraSize]=useState({width:0,height:0});
  const scene=worldScenes[adventure.id];
  const chapter=currentCampaignChapter(save,adventure);
  const stats=equipmentStats(save,adventure);
  const completedMissions=chapter?.missions.filter(mission=>save.campaign.completedMissionIds.includes(mission.id)).length??0;
  const completedMissionStates=chapter?.missions.map(mission=>save.campaign.completedMissionIds.includes(mission.id))??[];
  const missionsDone=chapter?chapterComplete(save,chapter):false;
  const eliteDone=chapter?save.campaign.defeatedEliteIds.includes(chapter.eliteEnemyId):false;
  const bossDone=chapter?save.campaign.defeatedBossIds.includes(chapter.bossEnemyId):false;
  const eliteReady=Boolean(chapter&&missionsDone&&!eliteDone);
  const bossReady=Boolean(chapter&&bossGate(save,chapter,stats)&&!bossDone);
  const missionGateOpen=!chapter||missionsDone;
  const bossGateOpen=!chapter||bossReady;
  const [position,setPosition]=useState(()=>securePosition(save.world,adventure.world.start,scene,missionsDone,bossGateOpen,Boolean(chapter)));
  const [walkFrame,setWalkFrame]=useState<number|null>(null);
  const initialHint='Wähle einen Weg und finde die sechs Missionsorte.';
  const [hint,setHint]=useState(initialHint);
  const [touchMap,setTouchMap]=useState(()=>typeof window.matchMedia==='function'&&window.matchMedia('(hover: none) and (pointer: coarse) and (max-width: 950px)').matches);
  const [goalOpen,setGoalOpen]=useState(()=>!touchMap);
  const positionRef=useRef(position);
  const saveRef=useRef(save);
  const onSaveRef=useRef(onSave);
  const persistTimerRef=useRef<number|undefined>(undefined);
  const hintTimerRef=useRef<number|undefined>(undefined);
  const walkTimerRef=useRef<number|undefined>(undefined);
  const facingRef=useRef(1);
  useEffect(()=>{saveRef.current=save;onSaveRef.current=onSave},[save,onSave]);
  useEffect(()=>{if(typeof window.matchMedia!=='function')return;const media=window.matchMedia('(hover: none) and (pointer: coarse) and (max-width: 950px)');const update=()=>{setTouchMap(media.matches);setGoalOpen(!media.matches)};update();media.addEventListener?.('change',update);return()=>media.removeEventListener?.('change',update)},[]);
  const flushPosition=useCallback(()=>{
    if(persistTimerRef.current!==undefined){window.clearTimeout(persistTimerRef.current);persistTimerRef.current=undefined}
    const current=positionRef.current,stored=saveRef.current.world;
    if(current.x===stored.x&&current.y===stored.y)return;
    const next=touchSave({...saveRef.current,world:current});saveRef.current=next;void onSaveRef.current(next);
  },[]);
  const schedulePositionSave=useCallback(()=>{if(persistTimerRef.current!==undefined)window.clearTimeout(persistTimerRef.current);persistTimerRef.current=window.setTimeout(flushPosition,350)},[flushPosition]);
  const showHint=useCallback((message:string)=>{setHint(message);if(hintTimerRef.current!==undefined)window.clearTimeout(hintTimerRef.current);hintTimerRef.current=window.setTimeout(()=>setHint(initialHint),2800)},[]);
  const missingPower=chapter?Math.max(0,chapter.minimumPower-stats.power):0;
  const missingDefense=chapter?Math.max(0,chapter.minimumDefense-stats.defense):0;
  const elite=chapter?adventure.enemies.find(enemy=>enemy.id===chapter.eliteEnemyId):undefined;
  const boss=chapter?adventure.enemies.find(enemy=>enemy.id===chapter.bossEnemyId):undefined;
  const bossRequirement=missingPower||missingDefense?`Stärke ${stats.power}/${chapter!.minimumPower}${missingPower?` – noch ${missingPower}`:''} · Schutz ${stats.defense}/${chapter!.minimumDefense}${missingDefense?` – noch ${missingDefense}`:''}`:'Stärke und Schutz reichen aus.';
  const eliteMessage=!chapter?'Alle Kampagnenkapitel sind geschafft.':eliteDone?'Elite besiegt.':missionsDone?'Elite ist spielbar.':`Elite gesperrt: Missionen ${completedMissions}/${chapter.missions.length}.`;
  const bossMessage=!chapter?'Alle Kampagnenkapitel sind geschafft.':bossDone?'Kapitelboss besiegt.':!missionsDone?'Boss gesperrt: erst alle Missionen abschließen.':!eliteDone?'Boss gesperrt: erst die Elite besiegen.':bossReady?'Kapitelboss ist spielbar.':`Boss gesperrt: ${bossRequirement}`;
  const startCampaignBattle=(target:'elite'|'boss')=>{if(!chapter)return;flushPosition();sessionStorage.setItem(`lernhelden:mode:${adventure.id}`,chapter.missions[0]?.modeId??adventure.modes[0].id);sessionStorage.setItem(`lernhelden:campaign:${adventure.id}`,JSON.stringify({chapter:chapter.index,target}));sessionStorage.removeItem(curriculumRunKey(adventure.id));go(`/adventure/${adventure.id}/battle`)};
  const startMission=(index:number)=>{const mission=chapter?.missions[index];if(!chapter||!mission)return;flushPosition();sessionStorage.setItem(`lernhelden:mode:${adventure.id}`,mission.modeId);sessionStorage.setItem(`lernhelden:campaign:${adventure.id}`,JSON.stringify({chapter:chapter.index,missionId:mission.id}));sessionStorage.removeItem(curriculumRunKey(adventure.id));go(`/adventure/${adventure.id}/battle`)};
  const move=useCallback((dx:number,dy:number)=>{const current=positionRef.current,step=24,nx=Math.max(24,Math.min(adventure.world.width-24,current.x+dx*step)),ny=Math.max(64,Math.min(adventure.world.height-24,current.y+dy*step));const blocked=collides({x:nx,y:ny},collisionRects(scene,adventure.world.obstacles,missionGateOpen,bossGateOpen));if(!blocked){const next={...current,x:nx,y:ny};positionRef.current=next;setPosition(next);if(dx)facingRef.current=dx;if(!profile.settings.reducedMotion){setWalkFrame(frame=>(frame??0)+1);if(walkTimerRef.current!==undefined)window.clearTimeout(walkTimerRef.current);walkTimerRef.current=window.setTimeout(()=>setWalkFrame(null),170)}schedulePositionSave()}},[adventure.world.height,adventure.world.obstacles,adventure.world.width,bossGateOpen,missionGateOpen,profile.settings.reducedMotion,scene,schedulePositionSave]);
  const near=(point:{x:number;y:number},distance=72)=>Math.hypot(point.x-position.x,point.y-position.y)<distance;
  const nearbyMission=chapter?scene.missionSites.findIndex(site=>near(site,66)):-1;
  const nearMissionGate=near({x:scene.missionGate.x+scene.missionGate.width/2,y:scene.missionGate.y+scene.missionGate.height/2},70);
  const nearBossGate=near({x:scene.bossGate.x+scene.bossGate.width/2,y:scene.bossGate.y+scene.bossGate.height/2},70);
  const interactionLabel=nearbyMission>=0?completedMissionStates[nearbyMission]?`Mission ${nearbyMission+1} geschafft`:`E · Mission ${nearbyMission+1} starten`:!missionGateOpen&&nearMissionGate?'E · Missionstor prüfen':!bossGateOpen&&nearBossGate?'E · Bosstor prüfen':elite&&near(scene.campaign.elite)?`E · ${eliteReady?'Elite herausfordern':'Elite prüfen'}`:boss&&near(scene.campaign.boss)?`E · ${bossReady?'Boss herausfordern':'Boss prüfen'}`:near(adventure.world.merchant)?'E · Händler':near(adventure.world.chest)?'E · Truhe':'WASD / Pfeile · E zum Interagieren';
  const actionLabel=nearbyMission>=0?(completedMissionStates[nearbyMission]?'Erledigt':'Mission'):nearMissionGate||nearBossGate?'Tor':elite&&near(scene.campaign.elite)?'Elite':boss&&near(scene.campaign.boss)?'Boss':near(adventure.world.merchant)?'Händler':near(adventure.world.chest)?'Truhe':'Aktion';
  const hasInteraction=actionLabel!=='Aktion';
  const interact=()=>{flushPosition();if(chapter&&nearbyMission>=0){const mission=chapter.missions[nearbyMission];if(!mission)return;if(save.campaign.completedMissionIds.includes(mission.id))showHint(`${mission.title} ist bereits geschafft.`);else startMission(nearbyMission);return}if(!missionGateOpen&&nearMissionGate){showHint(`Das Missionstor ist versiegelt: ${completedMissions}/${chapter?.missions.length??6} Missionen geschafft.`);return}if(!bossGateOpen&&nearBossGate){showHint(bossMessage);return}if(chapter&&elite&&near(scene.campaign.elite)){if(eliteReady)startCampaignBattle('elite');else showHint(eliteMessage);return}if(chapter&&boss&&near(scene.campaign.boss)){if(bossReady)startCampaignBattle('boss');else showHint(bossMessage);return}const encounter=adventure.world.encounters.find(item=>near(item));if(encounter){startTraining(adventure,adventure.modes[0].id);return}if(near(adventure.world.merchant)){go(`/adventure/${adventure.id}/shop`);return}if(near(adventure.world.chest)){go(`/adventure/${adventure.id}/inventory`);return}showHint('Gehe näher an eine Mission, einen Gegner, Händler oder die Truhe.')};
  useEffect(()=>{const current=positionRef.current,secured=securePosition(current,adventure.world.start,scene,missionsDone,bossGateOpen,Boolean(chapter));if(secured.x!==current.x||secured.y!==current.y){positionRef.current=secured;setPosition(secured);flushPosition()}},[chapter?.index,missionsDone,bossGateOpen]);
  useEffect(()=>{const flush=()=>flushPosition(),visibility=()=>{if(document.visibilityState==='hidden')flushPosition()};window.addEventListener('pagehide',flush);document.addEventListener('visibilitychange',visibility);return()=>{window.removeEventListener('pagehide',flush);document.removeEventListener('visibilitychange',visibility);flushPosition();if(hintTimerRef.current!==undefined)window.clearTimeout(hintTimerRef.current);if(walkTimerRef.current!==undefined)window.clearTimeout(walkTimerRef.current)}},[flushPosition]);
  useLayoutEffect(()=>{const element=cameraRef.current;if(!element)return;const update=()=>{const width=element.clientWidth,height=element.clientHeight;if(width&&height)setCameraSize({width,height})};update();if(typeof ResizeObserver==='undefined'){window.addEventListener('resize',update);return()=>window.removeEventListener('resize',update)}const observer=new ResizeObserver(update);observer.observe(element);return()=>observer.disconnect()},[]);
  useEffect(()=>{const key=(event:KeyboardEvent)=>{const moves:Record<string,[number,number]>={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]};const selected=moves[event.key.toLowerCase()];if(selected){event.preventDefault();move(...selected)}if(event.key==='Enter'||event.key.toLowerCase()==='e')interact()};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)});
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const context=canvas.getContext('2d');if(!context)return;
    let active=true;context.imageSmoothingEnabled=false;
    const paintBackground=()=>paintWorldScene(context,canvas.width,canvas.height,adventure.theme,scene,adventure.world.obstacles,adventure.world.start,completedMissionStates,missionGateOpen,bossGateOpen);
    const load=(source:string)=>new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=source});
    const paint=async()=>{
      paintBackground();
      const visible=adventure.world.encounters.map(entry=>({entry,enemy:adventure.enemies.find(candidate=>candidate.id===entry.enemyId)})).filter(value=>value.enemy&&!save.clearedEnemyIds.includes(value.enemy.id));
      const campaignFigures=[elite&&!eliteDone&&{enemy:elite,position:scene.campaign.elite,ready:eliteReady,label:'Elite'},boss&&{enemy:boss,position:scene.campaign.boss,ready:bossReady,label:'Boss'}].filter((value):value is {enemy:NonNullable<typeof elite>;position:{x:number;y:number};ready:boolean;label:string}=>Boolean(value));
      const avatar=avatarSprite(Math.max(0,Number(profile.avatarPresetId.split('-')[1]||1)-1));
      const refs=[...visible.map(value=>value.enemy!.sprite),...campaignFigures.map(value=>value.enemy.sprite),uiSprites.shop,uiSprites.chest,avatar];
      try{
        const images=await Promise.all(refs.map(ref=>load(spriteUrl(ref))));if(!active)return;
        const draw=(image:HTMLImageElement,x:number,y:number,size:number)=>context.drawImage(image,x-size/2,y-size/2,size,size);
        visible.forEach((value,index)=>draw(images[index],value.entry.x,value.entry.y,62));
        const campaignOffset=visible.length;
        campaignFigures.forEach((figure,index)=>{context.save();context.globalAlpha=figure.ready?1:.42;draw(images[campaignOffset+index],figure.position.x,figure.position.y,78);context.restore();context.fillStyle=figure.ready?'#8df0ad':'#ffe16b';context.font='bold 13px monospace';context.textAlign='center';context.fillText(figure.ready?figure.label:`Gesperrt: ${figure.label}`,figure.position.x,figure.position.y-48);if(!figure.ready){context.fillRect(figure.position.x-7,figure.position.y-68,14,10);context.fillRect(figure.position.x-4,figure.position.y-74,8,7)}});
        const offset=campaignOffset+campaignFigures.length;draw(images[offset],adventure.world.merchant.x,adventure.world.merchant.y,54);draw(images[offset+1],adventure.world.chest.x,adventure.world.chest.y,54);
        const walking=walkFrame!==null&&!profile.settings.reducedMotion,odd=Boolean((walkFrame??0)%2),facing=facingRef.current<0?-1:1;
        context.save();context.translate(position.x,position.y+(walking?(odd?-3:-1):0));context.rotate(walking?(odd?-.04:.04):0);context.scale(facing*(walking?(odd?1.04:.98):1),walking?(odd?.96:1.02):1);context.drawImage(images[offset+2],-32,-32,64,64);context.restore();
      }catch{if(active)paintBackground()}
    };
    void paint();return()=>{active=false};
  },[adventure,boss,bossReady,bossGateOpen,elite,eliteDone,eliteReady,missionGateOpen,position,profile.avatarPresetId,profile.settings.reducedMotion,save.campaign.completedMissionIds,save.clearedEnemyIds,scene,walkFrame]);
  const mobileCamera=touchMap&&cameraSize.width>0&&(cameraSize.width<960||cameraSize.height<540);
  const cameraScale=mobileCamera?Math.max(1,cameraSize.height/540):1;
  const scaledWidth=960*cameraScale,scaledHeight=540*cameraScale;
  const cameraLeft=mobileCamera?Math.max(cameraSize.width-scaledWidth,Math.min(0,cameraSize.width/2-position.x*cameraScale)):0;
  const cameraTop=mobileCamera?Math.max(cameraSize.height-scaledHeight,Math.min(0,cameraSize.height/2-position.y*cameraScale)):0;
  return <div className="page world-page"><BackButton to={`/adventure/${adventure.id}`} label="Zurück"/><div className="heading-row"><div><p className="eyebrow">Begehbare Pixel-D&amp;D-Welt</p><h1>{scene.title}</h1></div><p className={`world-hint${hint===initialHint?' initial':''}`} role="status">{hint}</p></div>{chapter&&<details className="campaign-map-goal" open={goalOpen} onToggle={event=>setGoalOpen(event.currentTarget.open)}><summary><span><small>Kampagnenziel · Kapitel {chapter.index}</small><strong>{chapter.topic}</strong></span><span><Icon className="world-goal-flag" name="flag" size={15}/>{completedMissions}/{chapter.missions.length}<Icon name="chevron-down"/></span></summary><div className="map-goal-body"><div><p>Zwei Wege · Missionen: {completedMissions}/{chapter.missions.length}</p><p>{eliteMessage}</p></div><div><strong>Kapitelboss</strong><p>{bossMessage}</p><p>{bossRequirement}</p></div></div></details>}<div className="world-wrap"><div className="world-camera" ref={cameraRef}><canvas ref={canvasRef} width={960} height={540} style={mobileCamera?{transform:`translate3d(${cameraLeft}px,${cameraTop}px,0) scale(${cameraScale})`}:undefined} role="img" aria-label={`${scene.title}: begehbare Karte mit zwei Missionswegen`}/><div className="world-map-legend" aria-hidden="true"><span className={missionsDone?'done':''}><Icon name="flag" size={15}/>{completedMissions}/6</span><span className={eliteDone?'done':eliteReady?'ready':''}><Icon name="sword" size={15}/>Elite</span><span className={bossReady?'ready':''}><Icon name="crown" size={15}/>Boss</span></div></div>{profile.settings.showControlHints&&<div className="world-interaction">{interactionLabel.replace(/^✓\s*/, '')}</div>}<div className="world-mobile-controls"><TouchJoystick onMove={move} onStop={flushPosition}/><div className="world-action-wrap">{profile.settings.showControlHints&&hasInteraction&&<span className="world-action-context">{interactionLabel.replace(/^E · /,'')}</span>}<button className={`world-action${hasInteraction?' available':''}`} aria-label="E" onClick={interact}><Icon name="interact"/><span>{actionLabel}</span></button></div></div></div></div>;
}

function LegacyWorld({adventure,save,profile,onSave}:{adventure:AdventureDefinition;save:AdventureSave;profile:PlayerProfile;onSave:(save:AdventureSave)=>Promise<void>}){
  const canvasRef=useRef<HTMLCanvasElement>(null);const [position,setPosition]=useState(save.world);const [hint,setHint]=useState('Erkunde die Welt und finde den nächsten Gegner.');
  const move=(dx:number,dy:number)=>{const step=24,nx=Math.max(24,Math.min(adventure.world.width-24,position.x+dx*step)),ny=Math.max(64,Math.min(adventure.world.height-24,position.y+dy*step));const blocked=adventure.world.obstacles.some(obstacle=>nx+14>obstacle.x&&nx-14<obstacle.x+obstacle.width&&ny+14>obstacle.y&&ny-14<obstacle.y+obstacle.height);if(!blocked){const next={...position,x:nx,y:ny};setPosition(next);void onSave(touchSave({...save,world:next}))}};
  const interact=()=>{const encounter=adventure.world.encounters.find(item=>Math.hypot(item.x-position.x,item.y-position.y)<75);if(encounter){sessionStorage.setItem(`lernhelden:mode:${adventure.id}`,adventure.modes[0].id);go(`/adventure/${adventure.id}/battle`);return}if(Math.hypot(adventure.world.merchant.x-position.x,adventure.world.merchant.y-position.y)<75){go(`/adventure/${adventure.id}/shop`);return}if(Math.hypot(adventure.world.chest.x-position.x,adventure.world.chest.y-position.y)<75){go(`/adventure/${adventure.id}/inventory`);return}setHint('Gehe näher an einen Gegner, Händler oder die Truhe.')};
  useEffect(()=>{const key=(event:KeyboardEvent)=>{const moves:Record<string,[number,number]>={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]};const selected=moves[event.key.toLowerCase()];if(selected){event.preventDefault();move(...selected)}if(event.key==='Enter'||event.key.toLowerCase()==='e')interact()};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)});
  useEffect(()=>{const canvas=canvasRef.current;if(!canvas)return;const context=canvas.getContext('2d');if(!context)return;let active=true;context.imageSmoothingEnabled=false;const paintBackground=()=>{context.fillStyle=adventure.theme.background;context.fillRect(0,0,canvas.width,canvas.height);for(let x=0;x<canvas.width;x+=32)for(let y=0;y<canvas.height;y+=32){context.fillStyle=(x/32+y/32)%2?`${adventure.theme.primary}25`:`${adventure.theme.secondary}18`;context.fillRect(x,y,32,32)}context.fillStyle=adventure.theme.accent;context.fillRect(0,390,canvas.width,52);adventure.world.obstacles.forEach(obstacle=>{context.fillStyle=adventure.theme.surface;context.fillRect(obstacle.x,obstacle.y,obstacle.width,obstacle.height);context.fillStyle=adventure.theme.primary;context.fillRect(obstacle.x+6,obstacle.y+6,obstacle.width-12,12)})};const load=(source:string)=>new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=source});const paint=async()=>{paintBackground();const visible=adventure.world.encounters.map(entry=>({entry,enemy:adventure.enemies.find(candidate=>candidate.id===entry.enemyId)})).filter(value=>value.enemy&&!save.clearedEnemyIds.includes(value.enemy.id));const avatar=avatarSprite(Math.max(0,Number(profile.avatarPresetId.split('-')[1]||1)-1));const refs=[...visible.map(value=>value.enemy!.sprite),uiSprites.shop,uiSprites.chest,avatar];try{const images=await Promise.all(refs.map(ref=>load(spriteUrl(ref))));if(!active)return;const draw=(image:HTMLImageElement,x:number,y:number,size:number)=>context.drawImage(image,x-size/2,y-size/2,size,size);visible.forEach((value,index)=>draw(images[index],value.entry.x,value.entry.y,70));const offset=visible.length;draw(images[offset],adventure.world.merchant.x,adventure.world.merchant.y,58);draw(images[offset+1],adventure.world.chest.x,adventure.world.chest.y,58);draw(images[offset+2],position.x,position.y,68)}catch{if(active)paintBackground()}};void paint();return()=>{active=false}},[adventure,position,profile.avatarPresetId,save.clearedEnemyIds]);
  return <div className="page"><button className="back" onClick={()=>go(`/adventure/${adventure.id}`)}>← Zurück</button><div className="heading-row"><div><p className="eyebrow">Begehbare Pixelwelt</p><h1>{adventure.world.id.replaceAll('-',' ')}</h1></div><p>{hint}</p></div><div className="world-wrap"><canvas ref={canvasRef} width={960} height={540}/><div className="touch-controls"><button onClick={()=>move(0,-1)}>▲</button><span><button onClick={()=>move(-1,0)}>◀</button><button onClick={interact}>E</button><button onClick={()=>move(1,0)}>▶</button></span><button onClick={()=>move(0,1)}>▼</button></div></div></div>;
}

function Achievements({profile}:{profile:PlayerProfile}){return <div className="page"><BackButton to="/home" label="Startseite"/><p className="eyebrow">Gemeinsam über alle Abenteuer</p><h1>Erfolge</h1><section className="achievement-grid">{adventures.flatMap(adventure=>adventure.achievements.map(achievement=>{const entry=profile.achievements[`${adventure.id}:${achievement.id}`];return <article key={`${adventure.id}:${achievement.id}`} className={entry?.unlockedAt?'unlocked':''}><Sprite sprite={achievement.sprite} size={64}/><small>{adventure.title}</small><h2>{achievement.title}</h2><p>{achievement.description}</p><progress value={entry?.progress??0} max={achievement.threshold}/><span>{entry?.progress??0}/{achievement.threshold}</span></article>}))}</section></div>}

function Settings({profile,onSave}:{profile:PlayerProfile;onSave:(profile:PlayerProfile)=>Promise<void>}){const update=(settings:Partial<PlayerProfile['settings']>)=>void onSave({...profile,settings:{...profile.settings,...settings},clientUpdatedAt:Date.now()});return <div className="page narrow"><BackButton to="/home" label="Startseite"/><p className="eyebrow">Für alle Abenteuer</p><h1>Einstellungen</h1><section className="settings-card"><label><span><strong>Reduzierte Animationen</strong><small>Weniger Bewegung bei Angriffen und Übergängen.</small></span><input type="checkbox" checked={profile.settings.reducedMotion} onChange={event=>update({reducedMotion:event.target.checked})}/></label><label><span><strong>Steuerungshinweise</strong><small>Tasten und Touch-Hilfe auf der Weltkarte anzeigen.</small></span><input type="checkbox" checked={profile.settings.showControlHints} onChange={event=>update({showControlHints:event.target.checked})}/></label><label><span><strong>Vollbild bevorzugen</strong><small>Vollbild beim Start eines Abenteuers anbieten.</small></span><input type="checkbox" checked={profile.settings.fullscreenPreferred} onChange={event=>update({fullscreenPreferred:event.target.checked})}/></label><label><span><strong>Größe der Oberfläche</strong><small>Gilt auf diesem und allen anderen Geräten.</small></span><select value={profile.settings.uiScale} onChange={event=>update({uiScale:event.target.value as PlayerProfile['settings']['uiScale']})}><option value="small">Klein</option><option value="normal">Normal</option><option value="large">Groß</option></select></label></section><button onClick={()=>document.documentElement.requestFullscreen?.()}>Jetzt Vollbild öffnen</button></div>}
