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
    card('Nenne den wichtigsten Unterschied zwischen Alt- und Jungsteinzeit.','Jäger und Sammler wurden in vielen Regionen zu sesshaften Bauern und Viehzüchtern.'),
    // Karten zu den Schulbuchfotos und Hefteinträgen (27.11.2026).
    card("Warum wird Afrika als Wiege der Menschheit bezeichnet?","Dort liegen die Wurzeln der menschlichen Entwicklung."),
    card("Welche Bedingungen in Afrika begünstigten laut Buch die Entwicklung des Menschen?","Warmes Klima und eine reiche Pflanzenwelt."),
    card("Wo und wann begann laut Einführungstext die Entwicklung des Menschen?","In Afrika vor über drei Millionen Jahren."),
    card("Wann verließen laut Buch Gruppen der Frühmenschen ihre ursprünglichen Lebensgebiete?","Vor ungefähr einer Million Jahren."),
    card("Warum wanderten Frühmenschen vermutlich aus Afrika aus?","Klimaveränderungen verschlechterten das Nahrungsangebot."),
    card("Welche Folge hatte ein schlechteres Nahrungsangebot für frühe Menschen?","Sie suchten neue Lebensräume."),
    card("In welchen Regionen entwickelte sich aus eingewanderten Frühmenschen der Neandertaler?","In Europa und im Westen Asiens."),
    card("Wann begann laut Buch die Ausbreitung des Jetztmenschen aus Afrika?","Vor mehr als 100.000 Jahren."),
    card("Welche beiden Menschenformen zeigt die Karte zur Ausbreitung?","Homo erectus und Homo sapiens."),
    card("Wann erreichte der Frühmensch laut Schulbuchkarte Europa und weiter östliche Teile Asiens?","Europa vor etwa 800.000 Jahren, weiter östliche Teile Asiens vor etwa 600.000 Jahren."),
    card("Wann erreichte der Jetztmensch laut Schulbuchkarte Europa?","Vor etwa 40.000 Jahren."),
    card("Wann erreichte der Jetztmensch laut Schulbuchkarte Australien?","Vor etwa 55.000 Jahren."),
    card("Wann erreichte der Jetztmensch laut Schulbuchkarte Nord- und Südamerika?","Nordamerika vor etwa 15.000 Jahren, Südamerika vor etwa 11.000 Jahren."),
    card("Über welchen Kontinent gelangte der Jetztmensch laut Karte nach Nordamerika?","Über Asien, insbesondere dessen äußersten Nordosten."),
    card("Ordne laut Karte die Besiedlung durch den Jetztmenschen: Südamerika, Europa, Australien, Nordamerika.","Australien, Europa, Nordamerika, Südamerika."),
    card("Welche zwei möglichen Erklärungen nennt das Buch für das Verschwinden der Neandertaler?","Konkurrenz mit dem Jetztmenschen und Vermischung mit ihm."),
    card("Zu welcher Menschenart gehören alle heute lebenden Menschen?","Homo sapiens (Jetztmensch)."),
    card("Was bedeutet Evolution?","Die allmähliche Entwicklung von Lebewesen über viele Generationen."),
    card("Mit welchen Tieren ist der Mensch besonders eng verwandt?","Mit den Menschenaffen."),
    card("Wie änderte sich die Erklärung der Entstehung des Menschen laut Buch?","Früher glaubten viele an eine fertige Schöpfung; die Evolution erklärt die Entwicklung über Millionen Jahre."),
    card("Wann begann in Europa laut Buch das Eiszeitalter?","Vor etwa drei Millionen Jahren."),
    card("Was wechselte sich während des Eiszeitalters ab?","Kaltzeiten und Warmzeiten; insgesamt wurde das Klima kühler."),
    card("Wie ermöglichten Kleidung, Behausungen und Feuer die Ausbreitung des Menschen?","Sie schützten vor Kälte und machten neue Lebensräume bewohnbar."),
    card("Wie lautet der wissenschaftliche Name des Vormenschen und was bedeutet er?","Australopithecus – Südmensch."),
    card("Wann lebte der Vormensch laut Steckbrief?","Vor 4,2 bis 1,1 Millionen Jahren."),
    card("Wie groß und schwer war der Vormensch laut Steckbrief?","1,20–1,40 m groß, 35–80 kg schwer."),
    card("Wo lebte der Vormensch und was aß er laut Steckbrief?","In Ost- und Südafrika; Pflanzen."),
    card("Welche wichtige Fähigkeit hatte bereits der Vormensch?","Er konnte aufrecht gehen."),
    card("Welche Menschenform ist gemeint: Ost- und Südafrika, Pflanzenkost, aufrechter Gang?","Der Vormensch (Australopithecus)."),
    card("Wie lautet der wissenschaftliche Name des Frühmenschen und was bedeutet er?","Homo erectus – aufrecht gehender Mensch."),
    card("Wann lebte der Frühmensch laut Steckbrief?","Vor 1,8 Millionen bis 40.000 Jahren."),
    card("Wie groß und schwer war der Frühmensch laut Steckbrief?","Bis 1,65 m groß und bis 65 kg schwer."),
    card("Wo lebte der Frühmensch und wovon ernährte er sich?","In Afrika, Asien und Europa; von Pflanzen und Fleisch, zunehmend auch von Jagdbeute."),
    card("Was konnte der Frühmensch im Unterschied zum Vormenschen laut Steckbrief?","Er stellte planvoll Werkzeuge her und nutzte Feuer."),
    card("Welche Menschenform nutzte Feuer, stellte planvoll Werkzeuge her und lebte in Afrika, Asien und Europa?","Der Frühmensch (Homo erectus)."),
    card("Wie lautet der wissenschaftliche Name des Neandertalers?","Homo neanderthalensis."),
    card("Wann lebte der Neandertaler laut Steckbrief?","Vor 220.000 bis 27.000 Jahren."),
    card("Wie groß und schwer war der Neandertaler laut Steckbrief?","Bis 1,60 m groß und bis 80 kg schwer."),
    card("Wo lebte der Neandertaler und was aß er?","In Europa und Vorderasien; Pflanzen und Fleisch."),
    card("Wie war der Körper des Neandertalers an die Kälte angepasst?","Er war kräftig und gedrungen gebaut."),
    card("Was konnte der Neandertaler laut Steckbrief?","Er war ein guter Jäger, konnte sprechen und bestattete seine Toten; der Steckbrief nennt auch Felsmalereien."),
    card("Welche Menschenform passt: kräftig, gedrungen, guter Jäger, Europa und Vorderasien?","Der Neandertaler."),
    card("Woher hat der Neandertaler seinen Namen?","Vom Fundort im Neandertal in der Nähe von Düsseldorf."),
    card("Welche Schädelmerkmale hatte der Neandertaler laut Buch?","Einen längeren, flacheren Schädel und starke Wülste über den Augen."),
    card("Wie lautet der wissenschaftliche Name des Jetztmenschen und was bedeutet er?","Homo sapiens – verständiger Mensch."),
    card("Seit wann gibt es den Jetztmenschen laut Steckbrief?","Seit etwa 150.000 Jahren."),
    card("Wie groß und schwer war der Jetztmensch laut Steckbrief zunächst?","Bis 1,80 m groß und etwa 80 kg schwer."),
    card("Wo lebte der Jetztmensch zuerst und wie breitete er sich aus?","Zunächst in Ostafrika; später auch in Asien, Australien, Europa und Amerika."),
    card("Wovon ernährte sich der Jetztmensch laut Steckbrief?","Von Pflanzen und Fleisch."),
    card("Welche besonderen Fähigkeiten hatte der Jetztmensch laut Steckbrief?","Er entwickelte Werkzeuge, Kleidung und Kunst, sprach, hatte religiöse Vorstellungen und teilte die Arbeit auf."),
    card("Welche Menschenform ist gemeint: religiöse Vorstellungen, Kunstgegenstände und Spezialisten für Tätigkeiten?","Der Jetztmensch (Homo sapiens)."),
    card("Ordne die vier Menschenformen nach ihrem ersten Auftreten laut Buch.","Vormensch, Frühmensch, Neandertaler, Jetztmensch. Ihre Lebenszeiten überschnitten sich teilweise."),
    card("Welche der vier Menschenformen war laut Steckbrief am kleinsten, welche zunächst am größten?","Vormensch am kleinsten; Jetztmensch zunächst am größten."),
    card("Vergleiche die Ernährung von Vor- und Frühmensch laut Steckbrief.","Vormensch: Pflanzen. Frühmensch: Pflanzen und Fleisch."),
    card("Welche Menschenformen lebten laut Steckbrief in Europa?","Frühmensch, Neandertaler und Jetztmensch."),
    card("Welche Menschenformen lebten laut Steckbrief in Afrika?","Vormensch, Frühmensch und Jetztmensch."),
    card("Waren Neandertaler und Jetztmenschen laut den Buchdaten gleichzeitig auf der Erde?","Ja, ihre angegebenen Lebenszeiten überschneiden sich."),
    card("Wie können Forscher das Aussehen des Neandertalers rekonstruieren?","Sie untersuchen Knochenfunde und fertigen wissenschaftlich begründete Nachbildungen an."),
    card("Was zeigt der Vergleich der Neandertaler-Modelle von 1989 und 2013 im Buch?","Rekonstruktionen können sich mit neuen Erkenntnissen verändern; moderne Kleidung verändert ebenfalls den Eindruck."),
    card("Sahen alle Neandertaler gleich aus?","Nein, ebenso wie heutige Menschen unterschieden sie sich voneinander."),
    card("Wo und wann wurde das im Buch beschriebene Neandertaler-Museum eröffnet?","1996 in der Nähe des Fundortes im Neandertal (Museum in Mettmann)."),
    card("Was zeigt das Neanderthal Museum laut Buch?","Die Entwicklung des Menschen und die Lebenswelt der Neandertaler anhand von Medien und Nachbildungen."),
    card("Wann begann und endete die Altsteinzeit laut Schulbuch?","Vor etwa zwei Millionen Jahren bis ungefähr 9000 v. Chr."),
    card("Welche Lebensweise kennzeichnet die Altsteinzeit?","Die Menschen lebten überwiegend als umherziehende Jäger und Sammler."),
    card("Seit wann wurden laut Schulbuch einfache Steinwerkzeuge hergestellt?","Seit etwa zwei Millionen Jahren."),
    card("Welche spezialisierten Werkzeuge entwickelten sich aus einfachen Steinwerkzeugen?","Werkzeuge zum Schlagen, Schaben, Bohren und Speerspitzen."),
    card("Welche Materialien waren in der Altsteinzeit besonders lange wichtig?","Stein und Holz; der Hefteintrag nennt auch Knochen."),
    card("Welcher im Buch abgebildete Faustkeil stammt aus Sachsen?","Der Faustkeil aus Sprotta."),
    card("Warum war die Entwicklung verschiedener Werkzeuge für das Überleben wichtig?","Damit konnten Menschen jagen, Nahrung verarbeiten und Materialien bearbeiten."),
    card("Wie groß waren die wandernden Gruppen in der Altsteinzeit laut Buch?","Etwa 25 bis 30 Personen."),
    card("Was machten Nomaden, wenn es um ihren Lagerplatz nicht mehr genügend Nahrung gab?","Sie zogen zu einem anderen Lagerplatz weiter."),
    card("Warum dauerte die Nahrungsbeschaffung in der Altsteinzeit oft lange?","Nahrung musste gesucht, gesammelt oder unter Gefahren erjagt werden."),
    card("Welche gesammelten Nahrungsmittel waren laut Buch und Hefteintrag besonders wichtig?","Früchte, Beeren, Körner, Nüsse, Pilze, Honig und Insekten."),
    card("Warum bildete das Sammeln eine wichtige Grundlage der Ernährung?","Jagdbeute war unsicher; gesammelte Nahrung konnte die Ernährung sichern."),
    card("Nenne vier im Buch genannte Großwildarten der Altsteinzeit.","Zum Beispiel Elefanten, Nashörner, Auerochsen und Wildpferde; auch Bären und Wildschweine."),
    card("Welche kleineren Tiere wurden ebenfalls genutzt?","Kleine Säugetiere und Vögel; der Hefteintrag nennt auch Fischfang."),
    card("Was bedeutet Wildbeuter?","Menschen, die vom natürlichen Nahrungsangebot ihrer Umwelt leben."),
    card("Weshalb waren Wildbeuter von der Natur abhängig?","Ihre Nahrung hing von verfügbaren Tieren, Pflanzen und den Jahreszeiten ab."),
    card("Warum waren die Menschen der Altsteinzeit nicht einfach unterentwickelt?","Sie kannten die Natur gut und nutzten ihre Möglichkeiten geschickt zum Überleben."),
    card("Wie können Beobachtungen jüngerer Jäger-und-Sammler-Gesellschaften bei der Forschung helfen?","Sie geben Hinweise auf mögliche frühere Lebensweisen, sind aber kein direkter Beweis."),
    card("Welche Beispiele für solche Gesellschaften nennt das Schulbuch?","Jäger und Sammler in Südafrika und die Ureinwohner Australiens."),
    card("Wann konnten Menschen laut Buch vermutlich bereits Feuer hüten und nutzen?","Vor etwa 1,5 Millionen Jahren."),
    card("Wann lernten Menschen laut Buch selbst Feuer zu machen?","Vor etwa 150.000 bis 100.000 Jahren."),
    card("Wie kamen Menschen an Feuer, bevor sie es selbst herstellen konnten?","Sie nutzten natürlich entstandenes Feuer, etwa nach einem Blitzeinschlag."),
    card("Welche zwei Methoden zum Entzünden eines Feuers beschreibt das Buch?","Holz aneinanderreiben oder geeignete Steine gegeneinanderschlagen, um Funken zu erzeugen."),
    card("Was ist der Unterschied zwischen Feuer nutzen und Feuer selbst erzeugen?","Beim Nutzen muss vorhandenes Feuer erhalten werden; beim Erzeugen kann man selbst neues Feuer entzünden."),
    card("Warum war Feuer beim Erschließen kälterer Gebiete wichtig?","Es spendete Wärme, Licht und Schutz vor wilden Tieren und half bei der Nahrungszubereitung."),
    card("Wo lagen Lagerplätze laut Hefteintrag häufig?","Am Ufer von Seen."),
    card("Wie breit waren die im Hefteintrag beschriebenen zeltartigen Behausungen?","Etwa 3–4 m."),
    card("Welche Unterkünfte nutzten die Menschen der Altsteinzeit?","Einfache Hütten, Zelte und geschützte Höhlen."),
    card("Woraus bestanden Kleidung und Teile der Behausungen?","Aus Tierfellen und Häuten; für das Gerüst wurden unter anderem Äste verwendet."),
    card("Warum brauchten die Menschen Fellkleidung und geschützte Unterkünfte?","Zum Schutz vor Kälte und Witterung."),
    card("Was hinterließen Menschen der Altsteinzeit an Kunstwerken?","Zum Beispiel Höhlenmalereien."),
    card("Welche religiöse Vorstellung wird im Hefteintrag vermutet?","Der Glaube an Geister von Tieren."),
    card("Warum sollte man beim Glauben der Altsteinzeit das Wort vermutlich verwenden?","Weil Funde Hinweise geben, die Gedanken der Menschen aber nicht direkt belegen."),
    card("Was zeigen Feuer, Werkzeuge, Kleidung und Jagd gemeinsam über die Altsteinzeit?","Menschen passten sich geschickt ihrer Umwelt an und sicherten so ihr Überleben."),
    card("Wie veränderte sich die Lebensweise in der Jungsteinzeit laut Hefteintrag?","Aus Jägern und Sammlern wurden vielfach Bauern und Viehzüchter."),
    card("Weshalb mussten Bauern an einem Ort bleiben?","Sie mussten ihre Felder bestellen und ihre Tiere versorgen."),
    card("Vergleiche die Wohnweise in Alt- und Jungsteinzeit.","Altsteinzeit: wechselnde Lager und einfache Unterkünfte. Jungsteinzeit: sesshaft in festen Dörfern."),
    card("Vergleiche die Ernährung in Alt- und Jungsteinzeit.","Altsteinzeit: Jagd, Fischfang und Sammeln. Jungsteinzeit: Ackerbau und Viehzucht."),
    card("Was unterscheidet die Werkzeuge der Alt- und Jungsteinzeit laut Hefteintrag?","Altsteinzeit: Stein, Holz und Knochen. Jungsteinzeit: insbesondere geschliffene Steinwerkzeuge."),
    card("Welche neuen handwerklichen Tätigkeiten nennt der Hefteintrag zur Jungsteinzeit?","Töpferei und Weberei."),
    card("Was ist Töpferei?","Das Herstellen von Gegenständen wie Gefäßen aus Ton."),
    card("Was ist Weberei?","Das Herstellen von Stoffen aus Fäden."),
    card("Welche besondere Bedeutung hatte Vorratshaltung in der Jungsteinzeit?","Lebensmittel wurden für Zeiten mit geringem Nahrungsangebot aufbewahrt."),
    card("Welche Beispiele für Arbeitsteilung nennt der Hefteintrag?","Landwirt, Koch und Bauarbeiter."),
    card("Welche Epoche passt zu festen Dörfern, geschliffenen Steinwerkzeugen, Töpferei und Weberei?","Die Jungsteinzeit."),
    card("Welche Vorteile konnte die Sesshaftigkeit gegenüber dem Nomadenleben haben?","Feste Häuser, Vorräte und weniger notwendige Ortswechsel."),
    card("Beurteile: War die Jungsteinzeit eine Verbesserung?","Mögliche Begründung: feste Wohnorte und Landwirtschaft konnten Vorteile bieten, aber Felder und Tiere verlangten regelmäßige Arbeit."),
    card("Was blieb in Jungsteinzeit und Bronzezeit bei der Nahrungsbeschaffung gleich?","Ackerbau und Viehzucht blieben wichtig."),
    card("Welche Unterschiede nennt der Hefteintrag beim Wohnen in den drei Epochen?","Altsteinzeit: umherziehend; Jungsteinzeit: feste Dörfer; Bronzezeit: feste Siedlungen."),
    card("Ordne Faustkeil, geschliffenes Steinbeil und Bronzewerkzeug den typischen Epochen zu.","Altsteinzeit, Jungsteinzeit, Bronzezeit."),
    card("Wie veränderte sich die Arbeitsteilung von der Altsteinzeit bis zur Bronzezeit?","Jäger und Sammler, dann Bauern und Viehzüchter, später zusätzlich spezialisierte Handwerker und Händler."),
    card("Wer oder was ist Ötzi?","Eine im Gletschereis erhaltene menschliche Mumie."),
    card("Wo kann man Ötzis Überreste besichtigen?","Im Südtiroler Archäologiemuseum in Bozen."),
    card("Was versteht man unter einer historischen Rekonstruktion?","Eine wissenschaftlich begründete Nachbildung eines historischen Gegenstandes, Bauwerks oder einer Situation."),
    card("Worauf stützt sich das im Buch gezeigte Modell von Ötzi?","Auf archäologische Funde im Eis."),
    card("Ist das gezeigte Ötzi-Modell sein tatsächlicher Körper?","Nein, es ist eine Rekonstruktion; die Mumie ist der echte Fund."),
    card("Was kann Ötzis erhaltene Ausrüstung über das frühere Leben verraten?","Hinweise auf Kleidung, Werkzeuge und Alltag der damaligen Menschen."),
    card("Was haben Ötzi- und Neandertaler-Rekonstruktionen gemeinsam?","Beide beruhen auf Funden und zeigen, wie Menschen früher ausgesehen haben könnten."),
    card("Welcher Fund wird im Südtiroler Archäologiemuseum in Bozen ausgestellt?","Die Gletschermumie Ötzi."),
    card("Welches Material blieb bei den frühen Bauern zunächst das wichtigste für Werkzeuge?","Stein."),
    card("Welche drei Metalle beziehungsweise Metallwerkstoffe behandelt die Buchseite?","Kupfer, Bronze und Eisen."),
    card("Wann und wo begann laut Buch die Kupferverarbeitung?","Im 8. Jahrtausend v. Chr. im östlichen Mittelmeerraum."),
    card("Wann gelangte die Kupferverarbeitung laut Buch nach Mitteleuropa?","Im 5. Jahrtausend v. Chr."),
    card("Wofür wurde Kupfer verwendet?","Für Waffen, Geräte und Schmuck."),
    card("Welche Vorteile und Nachteile hat Kupfer laut Buch?","Es ist weich und gut formbar, aber nicht besonders widerstandsfähig."),
    card("Wann entdeckten die Menschen laut Buch die Bronze?","Gut 3000 Jahre v. Chr."),
    card("Aus welchen beiden Metallen besteht Bronze laut Buch?","Aus Kupfer und Zinn."),
    card("In welchem ungefähren Verhältnis wurden Kupfer und Zinn laut Buch gemischt?","9 Teile Kupfer zu 1 Teil Zinn."),
    card("Welcher Werkstoff entsteht aus neun Teilen Kupfer und einem Teil Zinn?","Bronze."),
    card("Warum war Bronze gegenüber Kupfer ein Fortschritt?","Bronze ist härter und widerstandsfähiger."),
    card("Wann gelangte die Bronzetechnik laut Buch nach Mitteleuropa?","Etwa 2000 v. Chr."),
    card("Welchen wichtigen Fund aus der Bronzezeit nennt das Buch?","Die Himmelsscheibe von Nebra."),
    card("Wann begann die Metallverarbeitung in Mitteleuropa laut Randtext?","Etwa 2500 v. Chr.; der Haupttext nennt die Bronzetechnik ab etwa 2000 v. Chr."),
    card("Wann lernten Menschen laut Haupttext Eisen aus Gestein zu gewinnen?","Im letzten Jahrtausend v. Chr.; der Randtext nennt etwa 750 v. Chr."),
    card("Warum war Eisen gegenüber Bronze ein Fortschritt?","Es war laut Buch härter und haltbarer."),
    card("Ordne die Metallwerkstoffe nach ihrer Einführung im Buch.","Kupfer, Bronze, Eisen."),
    card("Verdrängten neue Metalle die älteren Werkstoffe sofort?","Nein. Stein und verschiedene Metalle wurden lange nebeneinander benutzt."),
    card("Warum bestanden viele Alltagsgeräte noch lange aus Stein?","Metallgegenstände waren wertvoll."),
    card("Welche neuen Berufe entstanden durch die Metallverarbeitung?","Bergleute, Schmiede und Bronzegießer."),
    card("Warum waren Metallhandwerker gefragte Spezialisten?","Metallgewinnung und -verarbeitung waren schwer zu beherrschen."),
    card("Wie verbreiteten sich Metalltechniken zwischen Regionen?","Menschen mit entsprechenden Kenntnissen wanderten oder ließen sich in anderen Gegenden nieder."),
    card("Welche Folgen hatte die Verbreitung der Metalltechniken für die Gesellschaft?","Es entstanden neue Stammesgruppen und Kulturen."),
    card("Warum waren Rohstoffe und Metallgeräte wichtige Handelswaren?","Rohstoffe kamen nicht überall vor, und Metallgeräte waren begehrt."),
    card("Was bedeutet Fernhandel?","Handel über große Entfernungen."),
    card("Woher kamen laut Buch Zinn und Gold für die Bronzezeit?","Unter anderem aus Cornwall in Südengland."),
    card("Welche Handelsware gelangte von der Ostseeküste bis nach Griechenland?","Bernstein."),
    card("Was benötigten Händler für den Fernhandel?","Langfristige, stabile Beziehungen und Kenntnisse über Waren und Handelspartner."),
    card("Wie wurden Waren laut Buch gehandelt, obwohl es noch kein Geld gab?","Durch Tauschhandel."),
    card("Warum waren Metallhandwerker stärker auf Handel angewiesen als Bauern oder Viehzüchter?","Sie mussten benötigte Rohstoffe oder Waren aus anderen Regionen beschaffen."),
    card("Wie veränderte sich der Besitz in der Bronzezeit?","Er nahm zu und verteilte sich ungleich; es gab Reichere und Ärmere."),
    card("Wer führte größere Stammesgruppen in der Bronzezeit an?","Fürsten oder Häuptlinge."),
    card("Wie stärkten Fürsten und Häuptlinge ihre Macht?","Sie hatten Einfluss auf den Handel und profitierten davon."),
    card("Warum tauschten Reiche und Mächtige Geschenke aus?","Um Verbindungen herzustellen und ihre Bedeutung zu zeigen."),
    card("Was bedeutet soziale Unterschiede in der Bronzezeit?","Menschen hatten unterschiedlich viel Besitz, Einfluss und Macht."),
    card("Welche beiden Flüsse nennt das Buch zur mitteldeutschen Handelsregion?","Saale und Elbe."),
    card("Welche Waren wurden zwischen Saale und Elbe gehandelt?","Lebensmittel, Vieh, Kupfer, Salz, Bernstein, Waffen, Schmuck und Werkzeuge."),
    card("Welcher Rohstoff aus dem Erzgebirge war besonders begehrt und warum?","Zinn, weil es zur Bronzeherstellung benötigt wurde."),
    card("Wie schützten Fürsten ihre Anlagen in Mitteldeutschland?","Durch Wallanlagen, die mit Holzpalisaden gesichert waren."),
    card("Welchen bronzezeitlichen Ort an der Elbe nennt das Buch?","Die Raue Furt bei Diesbar-Seußlitz mit drei großen Höhenburgen."),
    card("Welche Funde weisen auf Handelskontakte Mitteldeutschlands bis nach Griechenland hin?","Schmuck, Waffen und Trinkgeschirr aus Bronze in Hortfunden und Gräbern."),
    card("Was ist ein Hortfund?","Ein wiederentdecktes Versteck, in dem früher wertvolle Gegenstände absichtlich verborgen wurden."),
    card("Warum können Hortfunde für die Geschichtsforschung wichtig sein?","Sie zeigen, welche wertvollen Gegenstände vorhanden waren, und können Hinweise auf Handel geben."),
    card("Was wurde 1853 in Weißig bei Riesa gefunden?","Ein Hortfund mit 410 Einzelstücken und etwa 25 kg Gesamtgewicht, darunter Sicheln, Waffen und Schmuck."),
    card("Welcher Bestandteil des Hortfunds von Weißig weist auf Kontakte zu Griechenland hin?","Die Wangenklappe eines Helms aus dem antiken Griechenland."),
    card("Was zeigt die Rohstoffkarte zur Bronzezeit im Buch?","Dass wichtige Rohstoffe in unterschiedlichen Regionen Europas vorkamen."),
    card("Warum mussten Menschen trotz eigener Metallkenntnisse Fernhandel betreiben?","Nicht alle benötigten Rohstoffe kamen an einem Ort vor."),
    card("Welche Epoche passt zu Bronzewerkzeugen, Metallverarbeitung, Fernhandel und sozialen Unterschieden?","Die Bronzezeit."),
    card("Vergleiche das Handwerk in der Jungsteinzeit und Bronzezeit.","Jungsteinzeit: etwa Töpferei und Weberei. Bronzezeit: zusätzlich spezialisierte Metallberufe."),
    card("Welche Vorteile und Nachteile brachte die Bronzezeit für das Zusammenleben?","Vorteile: bessere Werkstoffe, neue Berufe und Handel. Nachteile: größere Besitz- und Machtunterschiede."),
    card("Erkläre den Zusammenhang zwischen Metallverarbeitung, Handel und Herrschaft.","Rohstoffe waren ungleich verteilt, deshalb entstand Fernhandel. Wer Handel und wertvolle Waren kontrollierte, konnte Macht gewinnen."),
    card("Welche Menschenform lebte laut Buch vor 4,2 bis 1,1 Millionen Jahren?","Der Vormensch."),
    card("Welche Menschenform lebte laut Buch vor 1,8 Millionen bis 40.000 Jahren?","Der Frühmensch."),
    card("Welche Menschenform lebte laut Buch vor 220.000 bis 27.000 Jahren?","Der Neandertaler."),
    card("Welche Menschenform gibt es laut Buch seit 150.000 Jahren?","Den Jetztmenschen."),
    card("Ordne die Größen laut Steckbrief zu: Vormensch, Frühmensch, Neandertaler, Jetztmensch.","1,20–1,40 m; bis 1,65 m; bis 1,60 m; zunächst bis 1,80 m."),
    card("Ordne die Gewichte laut Steckbrief zu: Vormensch, Frühmensch, Neandertaler, Jetztmensch.","35–80 kg; bis 65 kg; bis 80 kg; etwa 80 kg."),
    card("Welche Karte zeigt eine Ausbreitung nach Australien und Amerika: Homo erectus oder Homo sapiens?","Homo sapiens."),
    card("Was geschah laut Buch vor 1,5 Millionen Jahren und was vor 150.000–100.000 Jahren?","Zunächst Feuer hüten und nutzen; später selbst Feuer erzeugen."),
    card("Welcher Fundort bei Riesa ist mit einem Hortfund von 1853 verbunden?","Weißig."),
    card("Wie viele Gegenstände und welches Gewicht hatte der Hortfund von Weißig?","410 Einzelstücke, etwa 25 kg."),
    card("Ordne die Daten zur Metallverarbeitung laut Buch: 8. Jahrtausend, 5. Jahrtausend, 3000, 2000, 750 v. Chr.","Kupfer im östlichen Mittelmeerraum, Kupfer in Mitteleuropa, Entdeckung der Bronze, Bronzetechnik in Mitteleuropa, Beginn der Eisenverarbeitung laut Randtext."),
    card("Welche Region lieferte Zinn in Mitteldeutschland, welche Region in Südengland?","Erzgebirge und Cornwall."),
    card("Was macht den Neandertaler-Fundort und das Museum für die Forschung interessant?","Knochenfunde ermöglichen Rückschlüsse auf Körperbau; Modelle zeigen mögliche Lebensweisen."),
    card("Nenne je zwei Merkmale der Altsteinzeit, Jungsteinzeit und Bronzezeit.","Altsteinzeit: Jagen und Sammeln, Nomaden. Jungsteinzeit: Ackerbau, feste Dörfer. Bronzezeit: Metallverarbeitung, Fernhandel."),
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
