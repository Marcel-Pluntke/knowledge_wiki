import {useState} from 'react';

type Flashcard = {question:string;answer:string};
type Deck = {id:string;subject:string;grade:string;title:string;cards:Flashcard[]};
const card=(question:string,answer:string):Flashcard=>({question,answer});

// Lehrplan Gymnasium Sachsen, Geschichte Klasse 5, Lernbereich 2:
// https://www.schulportal.sachsen.de/lplandb/lehrplan/65
export const flashcardDecks:Deck[]=[{
  id:'geschichte-5-steinzeit',subject:'Geschichte',grade:'Klasse 5 · Gymnasium Sachsen',title:'Steinzeit',
  cards:[
    card('Warum heißt die Steinzeit so?','Viele Werkzeuge wurden aus Stein hergestellt.'),
    card('Welche drei Abschnitte der Steinzeit unterscheidet man in Mitteleuropa?','Altsteinzeit, Mittelsteinzeit und Jungsteinzeit.'),
    card('Auf welchem Kontinent entwickelte sich der moderne Mensch (Homo sapiens)?','In Afrika.'),
    card('Was bedeutet der Begriff Nomaden?','Menschen ohne festen Wohnort, die von Ort zu Ort ziehen.'),
    card('Wie ernährten sich die Menschen der Altsteinzeit?','Durch Jagen, Fischen und Sammeln von Wildpflanzen.'),
    card('Warum wechselten die Menschen der Altsteinzeit ihren Wohnort?','Sie folgten der Nahrung und suchten geeignete Lagerplätze.'),
    card('Wo lebten Menschen in der Altsteinzeit?','In Zelten, einfachen Hütten oder geschützten Höhlen und Felsüberhängen.'),
    card('Woraus stellten die Menschen der Altsteinzeit Werkzeuge her?','Aus Stein, Holz, Knochen und Geweih.'),
    card('Was ist ein Faustkeil?','Ein bearbeiteter Stein, der zum Schneiden, Schaben und anderen Arbeiten diente.'),
    card('Welche Vorteile brachte die Nutzung des Feuers?','Wärme, Licht, Schutz und die Möglichkeit, Nahrung zu garen.'),
    card('Wie schützten sich Menschen während der Eiszeiten vor Kälte?','Mit Fellkleidung, Feuer und geschützten Unterkünften.'),
    card('Welche Tiere jagten Menschen der Altsteinzeit in Europa?','Zum Beispiel Rentiere, Wildpferde und Mammuts.'),
    card('Was zeigen viele steinzeitliche Höhlenmalereien?','Tiere, Zeichen und manchmal Menschen.'),
    card('Was können Bestattungen und Grabbeigaben über die Steinzeit verraten?','Sie können Hinweise auf Vorstellungen, Rituale und das Zusammenleben geben.'),
    card('Was bedeutet Sesshaftigkeit?','Menschen leben dauerhaft an einem festen Ort.'),
    card('Welche neue Art der Ernährung entstand in der Jungsteinzeit?','Ackerbau und Viehzucht.'),
    card('Was bedeutet neolithische Revolution?','Der grundlegende Wandel vom Jagen und Sammeln zu Ackerbau, Viehzucht und meist sesshaftem Leben.'),
    card('Warum wurden viele Menschen in der Jungsteinzeit sesshaft?','Sie mussten ihre Felder pflegen und ihre Nutztiere versorgen.'),
    card('Welche Nutzpflanzen bauten frühe Bauern in Mitteleuropa an?','Zum Beispiel Einkorn, Emmer und Gerste.'),
    card('Welche Tiere hielten frühe Bauern in Mitteleuropa?','Zum Beispiel Rinder, Schafe, Ziegen und Schweine.'),
    card('Wofür nutzten Menschen Tongefäße?','Zum Kochen, Lagern und Transportieren von Nahrung und Wasser.'),
    card('Wie unterschieden sich typische Steinwerkzeuge der Jungsteinzeit von älteren Werkzeugen?','Viele wurden zusätzlich geschliffen und poliert, etwa Steinbeile.'),
    card('Wie wohnten frühe Bauern in Mitteleuropa?','Oft in Dörfern mit festen Häusern aus Holz und Lehm.'),
    card('Warum war Vorratshaltung für Bauern wichtig?','Sie half, den Winter und Zeiten mit wenig Nahrung zu überstehen.'),
    card('Welche neuen Risiken brachte der Ackerbau?','Missernten durch schlechtes Wetter oder Schädlinge und die Abhängigkeit von wenigen Nutzpflanzen.'),
    card('Warum veränderte sich die Natur durch die Landwirtschaft?','Menschen rodeten Wälder, legten Felder an und hielten Nutztiere.'),
    card('Was bedeutet Arbeitsteilung?','Menschen übernehmen unterschiedliche Aufgaben, etwa Ackerbau, Töpfern oder Werkzeugherstellung.'),
    card('Was sind archäologische Funde?','Erhaltene Überreste früherer Menschen, zum Beispiel Werkzeuge, Knochen oder Gefäße.'),
    card('Warum wissen wir nicht alles über das Leben in der Steinzeit?','Es gibt aus dieser Zeit keine Schriftzeugnisse; viele Überreste sind nicht erhalten.'),
    card('Nenne den wichtigsten Unterschied zwischen Alt- und Jungsteinzeit.','Jäger und Sammler wurden in vielen Regionen zu sesshaften Bauern und Viehzüchtern.')
  ]
}];

function shuffled<T,>(items:T[]):T[]{
  const result=[...items];
  for(let i=result.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}

export function FlashcardGame(){
  const [deck,setDeck]=useState<Deck|null>(null);
  const [queue,setQueue]=useState<Flashcard[]>([]);
  const [index,setIndex]=useState(0);
  const [revealed,setRevealed]=useState(false);
  const [missed,setMissed]=useState<Flashcard[]>([]);
  const start=(selected:Deck,cards=selected.cards,random=false)=>{
    setDeck(selected);setQueue(random?shuffled(cards):[...cards]);
    setIndex(0);setRevealed(false);setMissed([]);
  };
  const rate=(known:boolean)=>{
    if(!revealed||index>=queue.length)return;
    if(!known)setMissed(items=>[...items,queue[index]]);
    setRevealed(false);setIndex(value=>value+1);
  };
  const current=queue[index];
  return <div className="page flashcards-page">
    <style>{`
      .flashcards-page{max-width:760px;margin-inline:auto}
      .flashcards-page .flashcards-decks{display:grid;gap:1rem;margin-top:1.5rem}
      .flashcards-page .flashcards-panel{border:1px solid rgba(155,123,255,.45);border-radius:16px;background:var(--surface,#182343);padding:clamp(16px,4vw,28px)}
      .flashcards-page .flashcards-panel h2{margin:8px 0 12px}
      .flashcards-page .flashcards-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:16px}
      .flashcards-page .flashcards-actions button{flex:1 1 145px;min-height:48px}
      .flashcards-page .flashcards-card{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;width:100%;min-height:clamp(220px,44vh,400px);padding:24px;margin:16px 0;border-radius:18px;background:var(--surface,#182343);border:2px solid var(--primary,#9b7bff);color:inherit;text-align:center;white-space:normal;overflow-wrap:anywhere;box-shadow:none}
      .flashcards-page .flashcards-card strong{font-size:clamp(20px,4.5vw,30px);line-height:1.4}
      .flashcards-page .flashcards-card.is-answer{border-color:var(--accent,#f3c969)}
      .flashcards-page progress{width:100%;height:12px;accent-color:var(--primary,#9b7bff)}
      .flashcards-page .flashcards-counts{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin:12px 0}
    `}</style>
    <button className="back" onClick={()=>deck?setDeck(null):location.hash='/home'}>{deck?'← Themenübersicht':'← Startseite'}</button>
    <p className="eyebrow">Lernhelden · Karteikarten</p>
    {!deck?<><h1>Karteikarten</h1><p>Wähle ein Thema und überprüfe dein Wissen.</p>
      <section className="flashcards-decks">{flashcardDecks.map(item=><article className="flashcards-panel" key={item.id}>
        <small>{item.subject} · {item.grade}</small><h2>{item.title}</h2><p>{item.cards.length} Karteikarten</p>
        <div className="flashcards-actions"><button onClick={()=>start(item)}>Lernen starten</button><button className="secondary" onClick={()=>start(item,item.cards,true)}>Zufällig starten</button></div>
      </article>)}</section></>:<>
      <h1>{deck.title}</h1><p>{deck.subject} · {deck.grade}</p>
      <progress max={queue.length} value={index} aria-label="Lernfortschritt"/>
      <div className="flashcards-counts"><span>{current?'Karte '+(index+1)+' von '+queue.length:'Runde abgeschlossen'}</span><span>{index-missed.length} gewusst · {missed.length} wiederholen</span></div>
      {current?<><button type="button" className={'flashcards-card'+(revealed?' is-answer':'')} onClick={()=>setRevealed(value=>!value)} aria-label={revealed?'Antwort: '+current.answer+'. Frage anzeigen':'Frage: '+current.question+'. Antwort anzeigen'}>
        <small>{revealed?'Antwort':'Frage'}</small><strong>{revealed?current.answer:current.question}</strong><small>{revealed?'Antippen: Frage anzeigen':'Antippen: Antwort anzeigen'}</small>
      </button><div className="flashcards-actions"><button className="secondary" disabled={!revealed} onClick={()=>rate(false)}>Nochmal lernen</button><button disabled={!revealed} onClick={()=>rate(true)}>Gewusst</button></div></>:
      <section className="flashcards-panel"><h2>{missed.length?'Gut gemacht! Übe die übrigen Karten noch einmal.':'Super! Du hast alle Karten gewusst.'}</h2><p>{index-missed.length} von {queue.length} Karten gewusst.</p>
        <div className="flashcards-actions">{missed.length>0&&<button onClick={()=>start(deck,missed)}>Nur offene Karten wiederholen</button>}<button className="secondary" onClick={()=>start(deck)}>Alle erneut lernen</button><button className="secondary" onClick={()=>setDeck(null)}>Themenübersicht</button></div>
      </section>}
    </>}
  </div>;
}
