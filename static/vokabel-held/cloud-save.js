const vocabularyAuthThrottleKey = 'vokabelHeldAuthThrottle';
const vocabularyAuthMaxFailures = 5;
const vocabularyAuthLockMs = 15 * 60 * 1000;
let vocabularyFirebase = null;
let vocabularyUser = null;
let vocabularyCloudStarted = false;
let vocabularyCloudReady = false;
let vocabularySaveTimer = null;
let vocabularySaving = false;
let vocabularySaveAgain = false;

const localVocabularySave = save;
const originalVocabularyTopbar = topbar;

function vocabularyAuthThrottle(){
  try { return JSON.parse(localStorage.getItem(vocabularyAuthThrottleKey) || '{}'); }
  catch { return {}; }
}
function vocabularyAuthWaitMs(){
  const wait = Math.max(0, Number(vocabularyAuthThrottle().lockedUntil || 0) - Date.now());
  if (!wait) localStorage.removeItem(vocabularyAuthThrottleKey);
  return wait;
}
function vocabularyAddAuthFailure(){
  const state = vocabularyAuthThrottle();
  const failures = Number(state.failures || 0) + 1;
  const lockedUntil = failures >= vocabularyAuthMaxFailures ? Date.now() + vocabularyAuthLockMs : 0;
  localStorage.setItem(vocabularyAuthThrottleKey, JSON.stringify({failures: lockedUntil ? 0 : failures, lockedUntil}));
  return lockedUntil ? vocabularyAuthLockMs : 0;
}
function vocabularyResetAuthThrottle(){ localStorage.removeItem(vocabularyAuthThrottleKey); }
function vocabularyAuthWaitMessage(wait){ return `Zu viele Versuche. Bitte warte noch ${Math.ceil(wait / 60000)} Minuten.`; }

function vocabularyAccountGate(message = ''){
  show(`<section class="access-gate"><div class="access-card"><div class="access-sparkle">⚔️</div><p class="eyebrow">Dein Abenteuer auf jedem Gerät</p><h1>Vokabel Held</h1><p>Melde dich mit demselben Konto wie bei Mathe Magier an. Gold, Ausrüstung und Fortschritt werden sicher in der Cloud gespeichert.</p><label for="vocabularyEmail">E-Mail-Adresse</label><input id="vocabularyEmail" class="account-input" type="email" autocomplete="email" inputmode="email" autofocus><label for="vocabularyPassword">Passwort</label><input id="vocabularyPassword" class="account-input" type="password" autocomplete="current-password" minlength="6"><div class="account-actions"><button id="vocabularySignIn" class="button">Anmelden</button><button id="vocabularyCreate" class="button secondary">Konto erstellen</button></div><p id="vocabularyAccountFeedback" class="access-feedback" role="alert">${message}</p><p class="account-note">Das Passwort benötigt mindestens 6 Zeichen. Das gleiche Konto funktioniert in beiden Lernspielen.</p></div></section>`);
  const email = document.querySelector('#vocabularyEmail');
  const password = document.querySelector('#vocabularyPassword');
  const feedback = document.querySelector('#vocabularyAccountFeedback');
  const submit = async create => {
    const wait = vocabularyAuthWaitMs();
    if (wait) { feedback.textContent = vocabularyAuthWaitMessage(wait); return; }
    const cleanEmail = email.value.trim();
    if (!cleanEmail || !password.value) { feedback.textContent = 'Bitte E-Mail-Adresse und Passwort eingeben.'; return; }
    if (create && password.value.length < 6) { feedback.textContent = 'Das Passwort muss mindestens 6 Zeichen haben.'; return; }
    feedback.textContent = create ? 'Konto wird erstellt ...' : 'Anmeldung läuft ...';
    try {
      if (create) await vocabularyFirebase.createUserWithEmailAndPassword(vocabularyFirebase.auth, cleanEmail, password.value);
      else await vocabularyFirebase.signInWithEmailAndPassword(vocabularyFirebase.auth, cleanEmail, password.value);
      vocabularyResetAuthThrottle();
    } catch (error) {
      const lock = vocabularyAddAuthFailure();
      if (lock) { feedback.textContent = vocabularyAuthWaitMessage(lock); return; }
      const messages = {
        'auth/email-already-in-use':'Zu dieser E-Mail-Adresse gibt es bereits ein Konto. Bitte anmelden.',
        'auth/invalid-credential':'E-Mail-Adresse oder Passwort stimmt nicht.',
        'auth/invalid-email':'Bitte eine gültige E-Mail-Adresse eingeben.',
        'auth/weak-password':'Bitte ein Passwort mit mindestens 6 Zeichen wählen.',
        'auth/too-many-requests':'Zu viele Anfragen. Bitte versuche es später erneut.',
      };
      feedback.textContent = messages[error.code] || 'Die Anmeldung hat nicht funktioniert. Bitte versuche es erneut.';
    }
  };
  document.querySelector('#vocabularySignIn').addEventListener('click', () => submit(false));
  document.querySelector('#vocabularyCreate').addEventListener('click', () => submit(true));
  password.addEventListener('keydown', event => { if (event.key === 'Enter') submit(false); });
}

async function writeVocabularyCloudSave(){
  if (!vocabularyCloudReady || !vocabularyUser || !vocabularyFirebase) return;
  if (vocabularySaving) { vocabularySaveAgain = true; return; }
  vocabularySaving = true;
  try {
    const playerRef = vocabularyFirebase.doc(vocabularyFirebase.db, 'players', vocabularyUser.uid);
    await vocabularyFirebase.setDoc(playerRef, {
      vocabulary: data,
      vocabularyUpdatedAt: vocabularyFirebase.serverTimestamp(),
    }, {merge:true});
  } catch (error) {
    console.warn('Vokabel-Spielstand konnte nicht in der Cloud gespeichert werden.', error);
    toast('Cloud-Speicherung ist gerade nicht erreichbar. Lokal wurde gespeichert.');
  } finally {
    vocabularySaving = false;
    if (vocabularySaveAgain) {
      vocabularySaveAgain = false;
      writeVocabularyCloudSave();
    }
  }
}

function scheduleVocabularyCloudSave(){
  if (!vocabularyCloudReady) return;
  clearTimeout(vocabularySaveTimer);
  vocabularySaveTimer = setTimeout(writeVocabularyCloudSave, 450);
}

save = function vocabularySave(){
  localVocabularySave();
  scheduleVocabularyCloudSave();
};

topbar = function vocabularyCloudTopbar(){
  const html = originalVocabularyTopbar();
  if (!vocabularyUser) return html;
  return html.replace('</div></header>', `<button class="cloud-account" type="button" onclick="signOutVocabularyPlayer()" title="Angemeldet als ${vocabularyUser.email || 'Spieler'}">☁️ Abmelden</button></div></header>`);
};

async function loadVocabularyCloudSave(user){
  show(`<section class="access-gate"><div class="access-card"><div class="access-sparkle">☁️</div><h1>Spielstand wird geladen ...</h1><p>Wir holen Gold, Ausrüstung und deinen Vokabel-Fortschritt.</p></div></section>`);
  try {
    const playerRef = vocabularyFirebase.doc(vocabularyFirebase.db, 'players', user.uid);
    const snapshot = await vocabularyFirebase.getDoc(playerRef);
    const cloudData = snapshot.exists() ? snapshot.data().vocabulary : null;
    if (cloudData) {
      data = normalize(cloudData);
      localStorage.setItem(saveKey, JSON.stringify(data));
    } else {
      // Der bereits vorhandene lokale Spielstand wird beim ersten Login übernommen.
      await vocabularyFirebase.setDoc(playerRef, {
        vocabulary: data,
        vocabularyUpdatedAt: vocabularyFirebase.serverTimestamp(),
      }, {merge:true});
    }
    vocabularyCloudReady = true;
    home();
  } catch (error) {
    console.warn('Vokabel-Spielstand konnte nicht geladen werden.', error);
    vocabularyAccountGate('Der Cloud-Spielstand ist noch nicht erreichbar. Bitte gleich noch einmal anmelden.');
  }
}

function startVocabularyCloudApp(){
  if (vocabularyCloudStarted || !window.vokabelHeldFirebase) return;
  vocabularyCloudStarted = true;
  vocabularyFirebase = window.vokabelHeldFirebase;
  vocabularyFirebase.onAuthStateChanged(vocabularyFirebase.auth, user => {
    vocabularyUser = user;
    vocabularyCloudReady = false;
    if (user) loadVocabularyCloudSave(user);
    else vocabularyAccountGate();
  });
}

async function signOutVocabularyPlayer(){
  clearTimeout(vocabularySaveTimer);
  await writeVocabularyCloudSave();
  if (vocabularyFirebase) await vocabularyFirebase.signOut(vocabularyFirebase.auth);
}
window.signOutVocabularyPlayer = signOutVocabularyPlayer;

if (window.vokabelHeldFirebase) startVocabularyCloudApp();
else window.addEventListener('vokabel-held-firebase-ready', startVocabularyCloudApp, {once:true});
