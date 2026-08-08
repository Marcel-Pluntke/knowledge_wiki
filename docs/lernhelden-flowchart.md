# Lernhelden – Draw.io Gesamtflow

Dieses Diagramm bildet den zentralen Ablauf des Lernhelden-Spiels ab: Anmeldung, gemeinsames Profil, Abenteuerwahl, Training, Kampagne, Weltkarte, Shop, Inventar, Kampf- und Lernloop sowie Fortschritt und Persistenz.

## Verwendung

1. Den XML-Inhalt aus dem Codeblock kopieren.
2. Als `lernhelden_ablauf.drawio` speichern.
3. In draw.io / diagrams.net öffnen.
4. Alle Boxen, Pfeile und Texte sind dort einzeln editierbar.

## Draw.io XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" type="device">
  <diagram id="lernhelden-main" name="Lernhelden – Gesamtflow">
    <mxGraphModel dx="2200" dy="1500" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2200" pageHeight="1500" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <mxCell id="title" value="LERNHELDEN · SPIELABLAUF &amp; SYSTEMLOGIK" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0F172A;strokeColor=#0F172A;fontColor=#FFFFFF;fontSize=24;fontStyle=1;align=left;spacingLeft=18;" vertex="1" parent="1">
          <mxGeometry x="40" y="25" width="2120" height="55" as="geometry"/>
        </mxCell>

        <mxCell id="lane1" value="1 · Einstieg &amp; Plattform" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#CBD5E1;dashed=1;fontColor=#334155;fontSize=16;fontStyle=1;verticalAlign=top;align=left;spacingTop=12;spacingLeft=14;" vertex="1" parent="1">
          <mxGeometry x="40" y="100" width="2120" height="250" as="geometry"/>
        </mxCell>
        <mxCell id="lane2" value="2 · Abenteuer &amp; Spielwelt" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#CBD5E1;dashed=1;fontColor=#334155;fontSize=16;fontStyle=1;verticalAlign=top;align=left;spacingTop=12;spacingLeft=14;" vertex="1" parent="1">
          <mxGeometry x="40" y="370" width="2120" height="300" as="geometry"/>
        </mxCell>
        <mxCell id="lane3" value="3 · Kampf- und Lernloop" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#CBD5E1;dashed=1;fontColor=#334155;fontSize=16;fontStyle=1;verticalAlign=top;align=left;spacingTop=12;spacingLeft=14;" vertex="1" parent="1">
          <mxGeometry x="40" y="690" width="1500" height="690" as="geometry"/>
        </mxCell>
        <mxCell id="lane4" value="4 · Progression &amp; Persistenz" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#CBD5E1;dashed=1;fontColor=#334155;fontSize=16;fontStyle=1;verticalAlign=top;align=left;spacingTop=12;spacingLeft=14;" vertex="1" parent="1">
          <mxGeometry x="1560" y="690" width="600" height="690" as="geometry"/>
        </mxCell>

        <mxCell id="start" value="START" style="ellipse;whiteSpace=wrap;html=1;fillColor=#DCFCE7;strokeColor=#16A34A;strokeWidth=2;fontColor=#14532D;fontSize=14;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="90" y="175" width="90" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="auth" value="&lt;b&gt;Login / Registrierung&lt;/b&gt;&lt;br&gt;Firebase Auth" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#2563EB;strokeWidth=2;fontColor=#1E3A8A;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="240" y="165" width="210" height="100" as="geometry"/>
        </mxCell>
        <mxCell id="load" value="&lt;b&gt;Profil + Spielstände laden&lt;/b&gt;&lt;br&gt;Cloud, Migration, lokaler Fallback" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E0F2FE;strokeColor=#0284C7;strokeWidth=2;fontColor=#0C4A6E;fontSize=13;" vertex="1" parent="1">
          <mxGeometry x="520" y="155" width="250" height="120" as="geometry"/>
        </mxCell>
        <mxCell id="profileq" value="Heldenprofil&lt;br&gt;vorhanden?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#FFF7ED;strokeColor=#EA580C;strokeWidth=2;fontColor=#7C2D12;fontSize=12;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="840" y="165" width="140" height="100" as="geometry"/>
        </mxCell>
        <mxCell id="profile" value="&lt;b&gt;Held gestalten&lt;/b&gt;&lt;br&gt;Name + Avatar" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#2563EB;strokeWidth=2;fontColor=#1E3A8A;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1040" y="165" width="180" height="100" as="geometry"/>
        </mxCell>
        <mxCell id="home" value="&lt;b&gt;Plattform-Startseite&lt;/b&gt;&lt;br&gt;Gemeinsamer Held&lt;br&gt;Erfolge · Einstellungen · Profil" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#2563EB;strokeWidth=2;fontColor=#1E3A8A;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1310" y="150" width="280" height="130" as="geometry"/>
        </mxCell>

        <mxCell id="choose" value="&lt;b&gt;Abenteuer wählen&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F3E8FF;strokeColor=#9333EA;strokeWidth=2;fontColor=#581C87;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="90" y="470" width="180" height="85" as="geometry"/>
        </mxCell>
        <mxCell id="fractions" value="&lt;b&gt;Brüche&lt;/b&gt;&lt;br&gt;Mathe-Magier" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F3E8FF;strokeColor=#9333EA;strokeWidth=2;fontColor=#581C87;fontSize=13;" vertex="1" parent="1">
          <mxGeometry x="330" y="405" width="175" height="75" as="geometry"/>
        </mxCell>
        <mxCell id="decimals" value="&lt;b&gt;Dezimalzahlen&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F3E8FF;strokeColor=#9333EA;strokeWidth=2;fontColor=#581C87;fontSize=13;" vertex="1" parent="1">
          <mxGeometry x="330" y="495" width="175" height="75" as="geometry"/>
        </mxCell>
        <mxCell id="vocab" value="&lt;b&gt;Vokabeln&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F3E8FF;strokeColor=#9333EA;strokeWidth=2;fontColor=#581C87;fontSize=13;" vertex="1" parent="1">
          <mxGeometry x="330" y="585" width="175" height="65" as="geometry"/>
        </mxCell>
        <mxCell id="hub" value="&lt;b&gt;Abenteuer-Hub&lt;/b&gt;&lt;br&gt;Rang · XP · Stärke · Schutz&lt;br&gt;eigene Economy &amp; eigener Spielstand" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F3E8FF;strokeColor=#9333EA;strokeWidth=2;fontColor=#581C87;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="590" y="455" width="285" height="125" as="geometry"/>
        </mxCell>
        <mxCell id="training" value="&lt;b&gt;Freies Training&lt;/b&gt;&lt;br&gt;Trainingsmodus wählen" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#94A3B8;strokeWidth=2;fontColor=#0F172A;fontSize=13;" vertex="1" parent="1">
          <mxGeometry x="950" y="405" width="220" height="85" as="geometry"/>
        </mxCell>
        <mxCell id="campaign" value="&lt;b&gt;24-Wochen-Kampagne&lt;/b&gt;&lt;br&gt;12 Kapitel · Missionen&lt;br&gt;Elite · Boss · Boss-Gates" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F3E8FF;strokeColor=#9333EA;strokeWidth=2;fontColor=#581C87;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="950" y="515" width="220" height="115" as="geometry"/>
        </mxCell>
        <mxCell id="world" value="&lt;b&gt;Weltkarte&lt;/b&gt;&lt;br&gt;Gegner · Händler · Truhe" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F3E8FF;strokeColor=#9333EA;strokeWidth=2;fontColor=#581C87;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1230" y="405" width="215" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="inventory" value="&lt;b&gt;Inventar &amp; Truhe&lt;/b&gt;&lt;br&gt;Ausrüsten · Ablegen · Löschen" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#D97706;strokeWidth=2;fontColor=#78350F;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1500" y="405" width="230" height="95" as="geometry"/>
        </mxCell>
        <mxCell id="shop" value="&lt;b&gt;Shop / Händler&lt;/b&gt;&lt;br&gt;Items nach Rangstufe&lt;br&gt;eigene Abenteuer-Währung" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#D97706;strokeWidth=2;fontColor=#78350F;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1790" y="405" width="255" height="100" as="geometry"/>
        </mxCell>
        <mxCell id="battleStart" value="&lt;b&gt;Kampf starten&lt;/b&gt;&lt;br&gt;Modus + Gegner + Kapitelkontext" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEE2E2;strokeColor=#DC2626;strokeWidth=2;fontColor=#7F1D1D;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1230" y="555" width="260" height="90" as="geometry"/>
        </mxCell>

        <mxCell id="battleInit" value="&lt;b&gt;Kampf initialisieren&lt;/b&gt;&lt;br&gt;Held-Stats aus Ausrüstung&lt;br&gt;Gegner + HP" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEE2E2;strokeColor=#DC2626;strokeWidth=2;fontColor=#7F1D1D;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="90" y="785" width="245" height="105" as="geometry"/>
        </mxCell>
        <mxCell id="attack" value="&lt;b&gt;Angriff wählen&lt;/b&gt;&lt;br&gt;Basis · Spezial · Serie&lt;br&gt;Cooldowns" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEE2E2;strokeColor=#DC2626;strokeWidth=2;fontColor=#7F1D1D;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="400" y="785" width="225" height="105" as="geometry"/>
        </mxCell>
        <mxCell id="question" value="&lt;b&gt;Lernfrage erzeugen&lt;/b&gt;&lt;br&gt;Modus · Kapitel · Mastery&lt;br&gt;Bruch / Zahl / Auswahl" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#2563EB;strokeWidth=2;fontColor=#1E3A8A;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="690" y="785" width="250" height="105" as="geometry"/>
        </mxCell>
        <mxCell id="correctq" value="Antwort&lt;br&gt;korrekt?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#FFF7ED;strokeColor=#EA580C;strokeWidth=2;fontColor=#7C2D12;fontSize=12;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1010" y="790" width="130" height="95" as="geometry"/>
        </mxCell>
        <mxCell id="correct" value="&lt;b&gt;Treffer&lt;/b&gt;&lt;br&gt;Schaden · XP · Währung&lt;br&gt;Statistik erhöhen" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DCFCE7;strokeColor=#16A34A;strokeWidth=2;fontColor=#14532D;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1200" y="735" width="245" height="110" as="geometry"/>
        </mxCell>
        <mxCell id="wrong" value="&lt;b&gt;Falsche Antwort&lt;/b&gt;&lt;br&gt;Lösung anzeigen&lt;br&gt;Fehlerstatistik erhöhen" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFE4E6;strokeColor=#E11D48;strokeWidth=2;fontColor=#881337;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1200" y="875" width="245" height="105" as="geometry"/>
        </mxCell>
        <mxCell id="enemyDead" value="Gegner&lt;br&gt;besiegt?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#FFF7ED;strokeColor=#EA580C;strokeWidth=2;fontColor=#7C2D12;fontSize=12;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1010" y="1010" width="135" height="95" as="geometry"/>
        </mxCell>
        <mxCell id="counter" value="&lt;b&gt;Gegner kontert&lt;/b&gt;&lt;br&gt;Schaden abhängig von Schutz&lt;br&gt;bei Fehler stärker" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEE2E2;strokeColor=#DC2626;strokeWidth=2;fontColor=#7F1D1D;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="690" y="1010" width="250" height="105" as="geometry"/>
        </mxCell>
        <mxCell id="playerDead" value="Held&lt;br&gt;besiegt?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#FFF7ED;strokeColor=#EA580C;strokeWidth=2;fontColor=#7C2D12;fontSize=12;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="455" y="1015" width="135" height="95" as="geometry"/>
        </mxCell>
        <mxCell id="nextTurn" value="&lt;b&gt;Nächster Zug&lt;/b&gt;&lt;br&gt;Cooldowns aktualisieren" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#94A3B8;strokeWidth=2;fontColor=#0F172A;fontSize=13;" vertex="1" parent="1">
          <mxGeometry x="170" y="1015" width="210" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="win" value="&lt;b&gt;SIEG&lt;/b&gt;&lt;br&gt;Belohnung · Gegner erledigt&lt;br&gt;Kampagnenfortschritt" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DCFCE7;strokeColor=#16A34A;strokeWidth=2;fontColor=#14532D;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1195" y="1150" width="250" height="110" as="geometry"/>
        </mxCell>
        <mxCell id="lose" value="&lt;b&gt;NIEDERLAGE&lt;/b&gt;&lt;br&gt;Kampf beendet" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFE4E6;strokeColor=#E11D48;strokeWidth=2;fontColor=#881337;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="455" y="1170" width="190" height="85" as="geometry"/>
        </mxCell>
        <mxCell id="return" value="&lt;b&gt;Zur Welt / zum Hub&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#94A3B8;strokeWidth=2;fontColor=#0F172A;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="930" y="1280" width="220" height="80" as="geometry"/>
        </mxCell>

        <mxCell id="mastery" value="&lt;b&gt;Mastery &amp; Statistik&lt;/b&gt;&lt;br&gt;richtig / falsch · Streak&lt;br&gt;Lernziel-Fortschritt" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#2563EB;strokeWidth=2;fontColor=#1E3A8A;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1610" y="780" width="230" height="110" as="geometry"/>
        </mxCell>
        <mxCell id="achievements" value="&lt;b&gt;Erfolge&lt;/b&gt;&lt;br&gt;Antworten · Käufe · Bosse" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DCFCE7;strokeColor=#16A34A;strokeWidth=2;fontColor=#14532D;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1880" y="780" width="220" height="110" as="geometry"/>
        </mxCell>
        <mxCell id="progress" value="&lt;b&gt;Progression&lt;/b&gt;&lt;br&gt;XP → Rang&lt;br&gt;Währung → Shop&lt;br&gt;Gegner → Weltfortschritt" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#D97706;strokeWidth=2;fontColor=#78350F;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1610" y="950" width="230" height="125" as="geometry"/>
        </mxCell>
        <mxCell id="equipment" value="&lt;b&gt;Ausrüstung&lt;/b&gt;&lt;br&gt;Stärke · Schutz · Glück&lt;br&gt;wirkt direkt im Kampf" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#D97706;strokeWidth=2;fontColor=#78350F;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1880" y="950" width="220" height="125" as="geometry"/>
        </mxCell>
        <mxCell id="save" value="&lt;b&gt;Speichern&lt;/b&gt;&lt;br&gt;PlayerProfile + AdventureSave" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E0F2FE;strokeColor=#0284C7;strokeWidth=2;fontColor=#0C4A6E;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1610" y="1140" width="230" height="95" as="geometry"/>
        </mxCell>
        <mxCell id="firebase" value="&lt;b&gt;Firebase&lt;/b&gt;&lt;br&gt;primärer Cloud-Spielstand" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E0F2FE;strokeColor=#0284C7;strokeWidth=2;fontColor=#0C4A6E;fontSize=13;" vertex="1" parent="1">
          <mxGeometry x="1880" y="1120" width="220" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="fallback" value="&lt;b&gt;Local Storage&lt;/b&gt;&lt;br&gt;Fallback bei Cloud-Fehler" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E0F2FE;strokeColor=#0284C7;strokeWidth=2;fontColor=#0C4A6E;fontSize=13;" vertex="1" parent="1">
          <mxGeometry x="1880" y="1240" width="220" height="90" as="geometry"/>
        </mxCell>

        <mxCell id="e1" edge="1" parent="1" source="start" target="auth" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e2" edge="1" parent="1" source="auth" target="load" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e3" edge="1" parent="1" source="load" target="profileq" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e4" value="Nein" edge="1" parent="1" source="profileq" target="profile" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e5" value="Ja" edge="1" parent="1" source="profileq" target="home" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e6" value="speichern" edge="1" parent="1" source="profile" target="home" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e7" edge="1" parent="1" source="home" target="choose" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e8" edge="1" parent="1" source="choose" target="fractions" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e9" edge="1" parent="1" source="choose" target="decimals" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e10" edge="1" parent="1" source="choose" target="vocab" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e11" edge="1" parent="1" source="fractions" target="hub" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e12" edge="1" parent="1" source="decimals" target="hub" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e13" edge="1" parent="1" source="vocab" target="hub" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e14" edge="1" parent="1" source="hub" target="training" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e15" edge="1" parent="1" source="hub" target="campaign" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e16" edge="1" parent="1" source="hub" target="world" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e17" edge="1" parent="1" source="hub" target="inventory" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e18" edge="1" parent="1" source="hub" target="shop" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e19" edge="1" parent="1" source="training" target="battleStart" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e20" edge="1" parent="1" source="campaign" target="battleStart" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e21" value="Gegner" edge="1" parent="1" source="world" target="battleStart" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e22" edge="1" parent="1" source="battleStart" target="battleInit" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e23" edge="1" parent="1" source="battleInit" target="attack" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e24" edge="1" parent="1" source="attack" target="question" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e25" edge="1" parent="1" source="question" target="correctq" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e26" value="Ja" edge="1" parent="1" source="correctq" target="correct" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e27" value="Nein" edge="1" parent="1" source="correctq" target="wrong" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e28" edge="1" parent="1" source="correct" target="enemyDead" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e29" value="Nein" edge="1" parent="1" source="enemyDead" target="counter" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e30" value="Ja" edge="1" parent="1" source="enemyDead" target="win" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e31" edge="1" parent="1" source="wrong" target="counter" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e32" edge="1" parent="1" source="counter" target="playerDead" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e33" value="Ja" edge="1" parent="1" source="playerDead" target="lose" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e34" value="Nein" edge="1" parent="1" source="playerDead" target="nextTurn" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e35" value="weiter" edge="1" parent="1" source="nextTurn" target="attack" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e36" edge="1" parent="1" source="win" target="return" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e37" edge="1" parent="1" source="lose" target="return" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor=#64748B;"><mxGeometry relative="1" as="geometry"/></mxCell>

        <mxCell id="d1" value="Lernfortschritt" edge="1" parent="1" source="correct" target="mastery" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#94A3B8;dashed=1;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="d2" value="Fehlerdaten" edge="1" parent="1" source="wrong" target="mastery" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#94A3B8;dashed=1;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="d3" value="Belohnungen" edge="1" parent="1" source="win" target="progress" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#94A3B8;dashed=1;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="d4" edge="1" parent="1" source="progress" target="achievements" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#94A3B8;dashed=1;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="d5" edge="1" parent="1" source="inventory" target="equipment" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#94A3B8;dashed=1;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="d6" edge="1" parent="1" source="shop" target="equipment" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#94A3B8;dashed=1;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="d7" value="Stats" edge="1" parent="1" source="equipment" target="battleInit" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#94A3B8;dashed=1;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="d8" edge="1" parent="1" source="mastery" target="save" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#94A3B8;dashed=1;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="d9" edge="1" parent="1" source="progress" target="save" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#94A3B8;dashed=1;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="d10" edge="1" parent="1" source="achievements" target="save" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#94A3B8;dashed=1;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="d11" value="normal" edge="1" parent="1" source="save" target="firebase" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#94A3B8;dashed=1;"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="d12" value="bei Fehler" edge="1" parent="1" source="save" target="fallback" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#94A3B8;dashed=1;"><mxGeometry relative="1" as="geometry"/></mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```
