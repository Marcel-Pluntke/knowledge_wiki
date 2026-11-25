import {useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import {buildPlan, startPlan, settle, control, type Config, type Kind, type Step, type TimerState} from '../../components/CycleTimer/engine.mjs';
import shared from './styles.module.css';
import styles from '../../components/CycleTimer/timer.module.css';

const defaults = {warmup:'180', rounds:'3', exercises:'6', work:'40', rest:'20', roundRest:'60', finisher:'240'};
type Field = keyof typeof defaults;
type HelpKey = Field | 'lastExerciseRest' | 'lastRoundRest';
const fields: {key:Field; label:string; explanation:string}[] = [
  {key:'warmup',label:'Startphase',explanation:'Einmal vor dem ersten Zyklus.'},
  {key:'rounds',label:'Zyklen',explanation:'Anzahl der Wiederholungen des gesamten Zyklus.'},
  {key:'exercises',label:'Intervalle pro Zyklus',explanation:'Anzahl der Intervalle aus Aktivphase und Intervallpause pro Zyklus.'},
  {key:'work',label:'Aktivphase',explanation:'Dauer der Aktivphase pro Intervall.'},
  {key:'rest',label:'Intervallpause',explanation:'Pause nach einer Aktivphase.'},
  {key:'roundRest',label:'Zykluspause',explanation:'Zusätzliche Pause zwischen den Zyklen.'},
  {key:'finisher',label:'Abschlussphase',explanation:'Einmal nach dem letzten Zyklus.'},
];
const labels:Record<Kind,string> = {warmup:'Startphase',work:'Aktivphase',rest:'Intervallpause',roundRest:'Zykluspause',finisher:'Abschlussphase'};
const fmt=(seconds:number)=>String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
function stepName(step:Step){return labels[step.kind]+(step.exercise?' · Intervall '+step.exercise:step.round?' · Zyklus '+step.round:'');}

function Flow({values,highlight,lastExerciseRest,lastRoundRest}:{values:typeof defaults;highlight?:HelpKey;lastExerciseRest:boolean;lastRoundRest:boolean}) {
  const node=(key:Field,label:string)=> <span className={styles.node} data-highlight={highlight===key} data-kind={key}>{label}<b>{values[key]||'–'}{key==='rounds'||key==='exercises'?'':' s'}</b></span>;
  return <div className={styles.flow} aria-label="Ablaufdiagramm des Timers">
    {node('warmup','Startphase')}<span aria-hidden="true">↓</span>
    <div className={styles.loop} data-highlight={highlight==='rounds'}>
      <strong>{values.rounds||'–'} × Zyklus</strong>
      <div className={styles.loop} data-highlight={highlight==='exercises'||highlight==='lastExerciseRest'}>
        <strong>{values.exercises||'–'} × Intervall</strong>
        {node('work','Aktivphase')}<span aria-hidden="true">↓</span>{node('rest','Intervallpause')}
        {!lastExerciseRest&&<small>Letztes Intervall ohne Intervallpause</small>}
      </div>
      <span aria-hidden="true">↓</span>
      <div data-highlight={highlight==='lastRoundRest'} className={styles.roundOption}>{node('roundRest','Zykluspause')}<small>{lastRoundRest?'Auch nach letztem Zyklus':'Nur zwischen Zyklen'}</small></div>
    </div>
    <span aria-hidden="true">↓</span>{node('finisher','Abschlussphase')}
  </div>;
}

function Help({field,label,explanation,values,lastExerciseRest,lastRoundRest}:{field:HelpKey;label:string;explanation:string;values:typeof defaults;lastExerciseRest:boolean;lastRoundRest:boolean}){
  const [open,setOpen]=useState(false);
  const [hover,setHover]=useState(false);
  const [focus,setFocus]=useState(false);
  const visible=open||hover||focus;
  return <span className={styles.help} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
    <button type="button" className={styles.helpButton} aria-label={'Hilfe: '+label} aria-expanded={visible} aria-controls={'help-'+field} onFocus={()=>setFocus(true)} onBlur={()=>{setFocus(false);setOpen(false);}} onClick={()=>{setOpen(v=>!v);setFocus(false);setHover(false);}} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);setHover(false);setFocus(false);}}}>?</button>
    {visible&&<div id={'help-'+field} className={styles.tooltip}><strong>{label}</strong><p>{explanation}</p><Flow values={values} highlight={field} lastExerciseRest={lastExerciseRest} lastRoundRest={lastRoundRest}/></div>}
  </span>;
}

export default function CycleTimerPage():ReactNode{
  const [values,setValues]=useState(defaults);
  const [lastExerciseRest,setLastExerciseRest]=useState(true);
  const [lastRoundRest,setLastRoundRest]=useState(false);
  const [state,setState]=useState<TimerState|null>(null);
  const [ready,setReady]=useState(false);
  const [fullscreen,setFullscreen]=useState(false);
  const sessionRef=useRef<HTMLElement|null>(null);
  const fullscreenButtonRef=useRef<HTMLButtonElement|null>(null);
  const fullscreenWanted=useRef(false);
  const nativeFullscreen=useRef(false);

  const leaveFullscreen=()=>{
    fullscreenWanted.current=false;
    nativeFullscreen.current=false;
    setFullscreen(false);
    if(document.fullscreenElement===sessionRef.current&&document.fullscreenElement){
      void document.exitFullscreen().catch(()=>{});
    }
  };

  const toggleFullscreen=()=>{
    if(fullscreenWanted.current){leaveFullscreen();return;}
    const element=sessionRef.current;
    if(!element)return;
    fullscreenWanted.current=true;
    setFullscreen(true);
    // Use native fullscreen when available; otherwise keep the viewport-filling CSS view.
    if(document.fullscreenEnabled&&typeof element.requestFullscreen==='function'){
      try{
        void element.requestFullscreen().then(()=>{
          if(!fullscreenWanted.current&&document.fullscreenElement===element){
            void document.exitFullscreen().catch(()=>{});
          }
        }).catch(()=>{});
      }catch{/* The CSS fallback remains active. */}
    }
  };

  useEffect(()=>{
    const onChange=()=>{
      if(document.fullscreenElement===sessionRef.current&&document.fullscreenElement){
        nativeFullscreen.current=true;
      }else if(nativeFullscreen.current){
        nativeFullscreen.current=false;
        fullscreenWanted.current=false;
        setFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange',onChange);
    return ()=>document.removeEventListener('fullscreenchange',onChange);
  },[]);

  useEffect(()=>{
    if(!fullscreen)return;
    const previousOverflow=document.body.style.overflow;
    const previousFocus=document.activeElement as HTMLElement|null;
    document.body.style.overflow='hidden';
    fullscreenButtonRef.current?.focus({preventScroll:true});
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){
        event.preventDefault();
        leaveFullscreen();
      }
      if(event.key==='Tab'){
        const buttons=sessionRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        if(!buttons?.length)return;
        const first=buttons[0],last=buttons[buttons.length-1];
        if(event.shiftKey&&(document.activeElement===first||!sessionRef.current?.contains(document.activeElement))){
          event.preventDefault();last.focus();
        }else if(!event.shiftKey&&(document.activeElement===last||!sessionRef.current?.contains(document.activeElement))){
          event.preventDefault();first.focus();
        }
      }
    };
    document.addEventListener('keydown',onKey);
    return ()=>{
      document.body.style.overflow=previousOverflow;
      document.removeEventListener('keydown',onKey);
      if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
    };
  },[fullscreen]);
  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem('wiki-cycle-timer-v1')||'null');
      if(saved&&fields.every(({key})=>typeof saved.values?.[key]==='string')){
        setValues({...defaults,...saved.values});
        setLastExerciseRest(saved.lastExerciseRest!==false);
        setLastRoundRest(saved.lastRoundRest===true);
      }
    }catch{/* Storage is optional. */}
    setReady(true);
  },[]);
  useEffect(()=>{
    if(!ready)return;
    try{localStorage.setItem('wiki-cycle-timer-v1',JSON.stringify({values,lastExerciseRest,lastRoundRest}));}catch{/* Storage is optional. */}
  },[ready,values,lastExerciseRest,lastRoundRest]);
  const plan=useMemo(()=>{
    if(fields.some(({key})=>!/^\d+$/.test(values[key])))return [];
    const config={...Object.fromEntries(fields.map(({key})=>[key,Number(values[key])])),lastExerciseRest,lastRoundRest} as Config;
    return buildPlan(config);
  },[values,lastExerciseRest,lastRoundRest]);
  const total=plan.reduce((n,s)=>n+s.seconds,0);
  const running=state!==null&&state.deadline!==null;
  useEffect(()=>{
    if(!running)return;
    const tick=()=>setState(s=>s?settle(plan,s,performance.now()):s);
    const id=window.setInterval(tick,100);
    document.addEventListener('visibilitychange',tick);
    return ()=>{window.clearInterval(id);document.removeEventListener('visibilitychange',tick);};
  },[running,plan]);
  const act=(action:'pause'|'resume'|'next'|'repeat')=>{
    const now=performance.now();
    setState(s=>s?control(plan,s,action,now):s);
  };
  const current=state?plan[state.index]:undefined;
  const next=state?plan[state.index+1]:undefined;
  const remaining=state?Math.ceil(state.remainingMs/1000):0;
  const overall=state?remaining+plan.slice(state.index+1).reduce((n,s)=>n+s.seconds,0):total;
  const helpProps={values,lastExerciseRest,lastRoundRest};

  return <Layout title="Zyklus-Timer" description="Konfigurierbarer Timer für zeitgesteuerte und wiederkehrende Abläufe.">
    <main className={shared.page}><div className="container">
      <Link to="/tools">Alle Tools</Link>
      <header className={shared.hero}><span className={shared.eyebrow}>Knowledge Wiki · Tools</span><Heading as="h1">Zyklus-Timer</Heading><p>Zeitgesteuerte Abläufe mit frei konfigurierbaren Intervallen, Zyklen und Pausen.</p></header>
      {state===null?<div className={styles.layout}>
        <section className={shared.card}>
          <Heading as="h2">Konfiguration</Heading>
          <p>Alle Zeiten in Sekunden. 0 deaktiviert optionale Phasen.</p>
          <div className={styles.fields}>
            {fields.map(({key,label,explanation})=><div key={key} className={styles.field}>
              <div className={styles.labelRow}><label htmlFor={'timer-'+key}>{label}</label><Help field={key} label={label} explanation={explanation} {...helpProps}/></div>
              <div className={shared.inputWrap}><input id={'timer-'+key} className={shared.input} type="number" inputMode="numeric" min={['rounds','exercises','work'].includes(key)?1:0} max={['rounds','exercises'].includes(key)?50:3600} step={1} value={values[key]} onChange={e=>setValues(v=>({...v,[key]:e.target.value}))}/><span className={shared.unit}>{['rounds','exercises'].includes(key)?'×':'s'}</span></div>
            </div>)}
          </div>
          <div className={styles.options}>
            <div className={styles.labelRow}><label><input type="checkbox" checked={lastExerciseRest} onChange={e=>setLastExerciseRest(e.target.checked)}/> Intervallpause auch nach letztem Intervall</label><Help field="lastExerciseRest" label="Letzte Intervallpause" explanation="Deaktivieren, wenn auf die letzte Aktivphase direkt die Zykluspause oder Abschlussphase folgen soll." {...helpProps}/></div>
            <div className={styles.labelRow}><label><input type="checkbox" checked={lastRoundRest} onChange={e=>setLastRoundRest(e.target.checked)}/> Zykluspause auch nach letztem Zyklus</label><Help field="lastRoundRest" label="Letzte Zykluspause" explanation="Aktivieren, wenn vor der Abschlussphase eine zusätzliche Zykluspause vorgesehen ist." {...helpProps}/></div>
          </div>
          {plan.length===0?<p role="alert">Bitte ganze Zahlen eingeben: 1–50 Zyklen und Intervalle, 1–3600 s Aktivphase und 0–3600 s für optionale Phasen.</p>:<p className={styles.total}>Gesamtdauer <strong>{fmt(total)}</strong> · {plan.length} Schritte</p>}
          <div className={styles.actions}><button className="button button--primary button--lg" disabled={!plan.length} onClick={()=>setState(startPlan(plan,performance.now()))}>Start</button><button className="button button--secondary" onClick={()=>{setValues(defaults);setLastExerciseRest(true);setLastRoundRest(false);}}>Standardwerte</button></div>
        </section>
        <section className={shared.card}><Heading as="h2">Ablaufübersicht</Heading><Flow {...helpProps}/><small>Die Vorschau zeigt die verschachtelten Wiederholungen. Phasen mit 0 Sekunden werden übersprungen.</small></section>
      </div>:<section ref={sessionRef} className={styles.session} data-kind={current?.kind??'done'} data-fullscreen={fullscreen} role={fullscreen?'dialog':undefined} aria-modal={fullscreen?true:undefined} aria-label="Zyklus-Timer">
        <div className={styles.viewControls}>
          <button ref={fullscreenButtonRef} type="button" className="button button--outline button--secondary" aria-pressed={fullscreen} onClick={toggleFullscreen}>{fullscreen?'Vollbild beenden':'Vollbild'}</button>
        </div>
        <div className={styles.phase} aria-live="polite">{current?labels[current.kind]:'Ablauf abgeschlossen'}</div>
        {current&&<><p className={styles.context}>{current.round?'Zyklus '+current.round+' / '+values.rounds:'Einmalige Phase'}{current.exercise?' · Intervall '+current.exercise+' / '+values.exercises:''} · Schritt {state.index+1} / {plan.length}</p>
        <div className={styles.clock} aria-label="Verbleibende Zeit">{fmt(remaining)}</div>
        <progress className={styles.progress} aria-label="Fortschritt der aktuellen Phase" max={current.seconds*1000} value={current.seconds*1000-state.remainingMs}/>
        <div className={styles.metrics}><span>Gesamt verbleibend <strong>{fmt(overall)}</strong></span><span>Als Nächstes <strong>{next?stepName(next)+' · '+fmt(next.seconds):'Fertig'}</strong></span></div>
        <progress className={styles.progress} aria-label="Gesamtfortschritt" max={total} value={Math.max(0,total-overall)}/>
        <p className={styles.status}>{running?'Timer läuft':'Pausiert'}</p></>}
        <div className={styles.actions}>
          {current&&<><button className="button button--primary button--lg" onClick={()=>act(running?'pause':'resume')}>{running?'Pause':'Fortsetzen'}</button><button className="button button--secondary" onClick={()=>act('next')}>Nächster Schritt</button><button className="button button--secondary" onClick={()=>act('repeat')}>Schritt wiederholen</button></>}
          <button className="button button--outline button--danger" onClick={()=>{leaveFullscreen();setState(null);}}>{current?'Abbrechen':'Zur Konfiguration'}</button>
        </div>
        <small className={styles.screenHint}>Bei gesperrtem Bildschirm kann der Browser die Anzeige anhalten. Für eine kontinuierliche Anzeige die Seite geöffnet lassen.</small>
      </section>}
    </div></main>
  </Layout>;
}
