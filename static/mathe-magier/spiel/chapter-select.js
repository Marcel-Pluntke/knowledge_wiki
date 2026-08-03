const fractionChapterHome = home;

function chapterSelect() {
  show(`<section class="chapter-screen">
    <header class="chapter-title">
      <h1 class="chapter-logo">Mathe <span>Magier</span></h1>
      <div class="chapter-ribbon">Wissen ist Magie!</div>
    </header>

    <h2 class="chapter-heading">Wähle dein Kapitel</h2>

    <section class="chapter-grid" aria-label="Mathe-Kapitel">
      <article class="chapter-card">
        <div class="chapter-badge">1</div>
        <h2>Brüche</h2>
        <p>Addieren, Subtrahieren und mehr!</p>
        <div class="chapter-art" aria-hidden="true">
          <div class="pixel-fraction-pie"></div>
          <div class="chapter-equation">
            <span class="stacked-fraction"><span>1</span><span>2</span></span>
            <span>+</span>
            <span class="stacked-fraction"><span>1</span><span>4</span></span>
            <span>=</span>
            <span class="stacked-fraction"><span>3</span><span>4</span></span>
          </div>
          <div class="chapter-wizard">🧙‍♂️</div>
        </div>
        <button class="button chapter-button" onclick="fractionChapterHome()">Abenteuer starten ›</button>
      </article>

      <article class="chapter-card chapter-card-disabled" aria-disabled="true">
        <div class="chapter-badge">2</div>
        <h2>Neue Abenteuer folgen</h2>
        <p>Weitere Mathe-Kapitel bald verfügbar.</p>
        <div class="chapter-art" aria-hidden="true">
          <div class="chapter-castle">🏰</div>
          <div class="chapter-lock">🔒</div>
        </div>
        <button class="button chapter-button" type="button" disabled>Noch nicht verfügbar</button>
      </article>
    </section>

    <footer class="chapter-footer">🔮 Löse Aufgaben, sammle Gold und werde zum größten MatheMagier! ⭐</footer>
  </section>`);
}

home = chapterSelect;
window.home = chapterSelect;
window.fractionChapterHome = fractionChapterHome;
