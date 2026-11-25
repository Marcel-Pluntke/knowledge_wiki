import {useEffect, useMemo, useState, type ReactNode} from 'react';
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
  {key:'warmup',label:'Aufwärmen',explanation:'Einmal vor der ersten Runde.'},
  {key:'rounds',label:'Runden',explanation:'So oft wird der gesamte Übungsblock durchlaufen.'},
  {key:'exercises',label:'Übungen je Runde',explanation:'So oft wechseln sich Belastung und Übungspause innerhalb einer Runde ab.'},
  {key:'work',label:'Belastung',explanation:'Aktive Zeit pro Übung.'},
  {key:'rest',label:'Übungspause',explanation:'Erholung nach einer Übung.'},
  {key:'roundRest',label:'Rundenpause',explanation:'Zusätzliche Pause zwischen den Runden.'},
  {key:'finisher',label:'Auspowern / Finisher',explanation:'Einmal nach dem letzten Übungsblock.'},
];
const labels:Record<Kind,string> = {warmup:'Aufwärmen',work:'Belastung',rest:'Übungspause',roundRest:'Rundenpause',finisher:'Auspowern'};
const fmt=(seconds:number)=>String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
function stepName(step:Step){return labels[step.kind]+(step.exercise?' · Übung '+step.exercise:step.round?' · Runde '+step.round:'');}

function Flow({values,highlight,lastExerciseRest,lastRoundRest}:{values:typeof defaults;highlight?:HelpKey;lastExerciseRest:boolean;lastRoundRest:boolean}) {
  const node=(key:Field,label:string)=> <span className={styles.node} data-highlight={highlight===key} data-kind={key}>{label}<b>{values[key]||'–'}{key==='rounds'||key==='exercises'?'':' s'}</b></span>;
  return <div className={styles.flow} aria-label="Ablaufdiagramm des Trainings">
    {node('warmup','Aufwärmen')}<span aria-hidden="true">↓</span>
    <div className={styles.loop} data-highlight={highlight==='rounds'}>
      <strong>{values.rounds||'–'} × Runde</strong>
      <div className={styles.loop} data-highlight={highlight==='exercises'||highlight==='lastExerciseRest'}>
        <strong>{values.exercises||'–'} × Übung</strong>
        {node('work','Belastung')}<span aria-hidden="true">↓</span>{node('rest','Übungspause')}
        {!lastExerciseRest&&<small>Letzte Übung ohne Übungspause</small>}
      </div>
      <span aria-hidden="true">↓</span>
      <div data-highlight={highlight==='lastRoundRest'} className={styles.roundOption}>{node('roundRest','Rundenpause')}<small>{lastRoundRest?'Auch nach letzter Runde':'Nur zwischen Runden'}</small></div>
    </div>
    <span aria-hidden="true">↓</span>{node('finisher','Finisher')}
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

  return <Layout title="Zyklus-Timer" description="Konfigurierbarer Intervalltimer für Training und wiederkehrende Abläufe.">
    <main className={shared.page}><div className="container">
      <Link to="/tools">← Alle Tools</Link>
      <header className={shared.hero}><span className={shared.eyebrow}>Knowledge Wiki · Tools</span><Heading as="h1">Zyklus-Timer</Heading><p>Konfiguriere dein Training – der Timer führt dich durch jede Phase.</p></header>
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
            <div className={styles.labelRow}><label><input type="checkbox" checked={lastExerciseRest} onChange={e=>setLastExerciseRest(e.target.checked)}/> Übungspause auch nach letzter Übung</label><Help field="lastExerciseRest" label="Letzte Übungspause" explanation="Deaktivieren, wenn direkt nach der letzten Belastung die Rundenpause oder der Finisher folgen soll." {...helpProps}/></div>
            <div className={styles.labelRow}><label><input type="checkbox" checked={lastRoundRest} onChange={e=>setLastRoundRest(e.target.checked)}/> Rundenpause auch nach letzter Runde</label><Help field="lastRoundRest" label="Letzte Rundenpause" explanation="Aktivieren, wenn vor dem Finisher noch eine zusätzliche Rundenpause gewünscht ist." {...helpProps}/></div>
          </div>
          {plan.length===0?<p role="alert">Bitte ganze Zahlen eingeben: 1–50 Runden und Übungen, 1–3600 s Belastung und 0–3600 s für optionale Phasen.</p>:<p className={styles.total}>Gesamtdauer <strong>{fmt(total)}</strong> · {plan.length} Schritte</p>}
          <div className={styles.actions}><button className="button button--primary button--lg" disabled={!plan.length} onClick={()=>setState(startPlan(plan,performance.now()))}>▶ Start</button><button className="button button--secondary" onClick={()=>{setValues(defaults);setLastExerciseRest(true);setLastRoundRest(false);}}>Standardwerte</button></div>
        </section>
        <section className={shared.card}><Heading as="h2">Trainingsablauf</Heading><Flow {...helpProps}/><small>Die Vorschau zeigt die verschachtelten Wiederholungen. Phasen mit 0 Sekunden werden übersprungen.</small></section>
      </div>:<section className={styles.session} data-kind={current?.kind??'done'}>
        <div className={styles.phase} aria-live="polite">{current?labels[current.kind]:'Training abgeschlossen!'}</div>
        {current&&<><p className={styles.context}>{current.round?'Runde '+current.round+' / '+values.rounds:'Einmalige Phase'}{current.exercise?' · Übung '+current.exercise+' / '+values.exercises:''} · Schritt {state.index+1} / {plan.length}</p>
        <div className={styles.clock} aria-label="Verbleibende Zeit">{fmt(remaining)}</div>
        <progress className={styles.progress} aria-label="Fortschritt der aktuellen Phase" max={current.seconds*1000} value={current.seconds*1000-state.remainingMs}/>
        <div className={styles.metrics}><span>Gesamt verbleibend <strong>{fmt(overall)}</strong></span><span>Als Nächstes <strong>{next?stepName(next)+' · '+fmt(next.seconds):'Fertig'}</strong></span></div>
        <progress className={styles.progress} aria-label="Gesamtfortschritt" max={total} value={Math.max(0,total-overall)}/>
        <p className={styles.status}>{running?'Timer läuft':'Pausiert'}</p></>}
        <div className={styles.actions}>
          {current&&<><button className="button button--primary button--lg" onClick={()=>act(running?'pause':'resume')}>{running?'Ⅱ Pause':'▶ Fortsetzen'}</button><button className="button button--secondary" onClick={()=>act('next')}>Nächster Schritt ⏭</button><button className="button button--secondary" onClick={()=>act('repeat')}>↻ Schritt wiederholen</button></>}
          <button className="button button--outline button--danger" onClick={()=>setState(null)}>{current?'Abbrechen':'Zur Konfiguration'}</button>
        </div>
        <small>Bei gesperrtem Bildschirm kann der Browser die Anzeige anhalten. Für den Trainingsbetrieb die Seite geöffnet lassen.</small>
      </section>}
    </div></main>
  </Layout>;
}
