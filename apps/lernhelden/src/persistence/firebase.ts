import {initializeApp} from 'firebase/app';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import type {AdventureId, AdventureSave, PlayerProfile, SaveRepository} from '@lernhelden/engine';
import {createAdventureSave, createProfile, normalizeAdventureSave, repairCampaignProgress} from '@lernhelden/engine';
import {adventureById, adventures} from '../adventures';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC-sG7TSHjT6uCP437sWIMPR4bOCGlAA5w',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'trim-attic-422212-p0.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'trim-attic-422212-p0',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'trim-attic-422212-p0.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1070084446234',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1070084446234:web:783a501ff2f77b520b19a3',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}),
});
void setPersistence(auth, browserLocalPersistence);

const profileCacheKey = 'lernhelden:profile:v1';
const adventureCacheKey = (id: AdventureId) => `lernhelden:adventure:${id}:v1`;
const parse = <T,>(value: string | null): T | null => {
  try { return value ? JSON.parse(value) as T : null; } catch { return null; }
};

export function firebaseErrorMessage(error: unknown) {
  const code = (error as {code?: string})?.code;
  if (code === 'permission-denied') return 'Cloud-Zugriff wurde von Firebase abgelehnt. Die Firestore-Regeln müssen veröffentlicht werden.';
  if (code === 'unavailable' || code === 'deadline-exceeded') return 'Keine Verbindung zur Cloud. Dein lokaler Spielstand bleibt erhalten.';
  if (code === 'unauthenticated') return 'Die Anmeldung ist abgelaufen. Bitte melde dich erneut an.';
  return 'Die Cloud-Synchronisierung ist gerade nicht verfügbar. Dein lokaler Spielstand bleibt erhalten.';
}

export class FirebaseSaveRepository implements SaveRepository {
  constructor(private readonly user: User) {}

  async loadProfile(): Promise<PlayerProfile | null> {
    const cached = parse<PlayerProfile>(localStorage.getItem(profileCacheKey));
    try {
      const snapshot = await getDoc(doc(db, 'players', this.user.uid));
      const raw = snapshot.data()?.profile as PlayerProfile | undefined;
      const selected = raw && (!cached || raw.clientUpdatedAt >= cached.clientUpdatedAt) ? raw : cached;
      if (selected) localStorage.setItem(profileCacheKey, JSON.stringify(selected));
      return selected ?? null;
    } catch { return cached; }
  }

  async saveProfile(profile: PlayerProfile): Promise<void> {
    localStorage.setItem(profileCacheKey, JSON.stringify(profile));
    await setDoc(doc(db, 'players', this.user.uid), {profile, schemaVersion:1, updatedAt:serverTimestamp()}, {merge:true});
  }

  async loadAdventure(id: AdventureId): Promise<AdventureSave | null> {
    const cachedRaw = parse<AdventureSave>(localStorage.getItem(adventureCacheKey(id)));
    const cached = cachedRaw ? normalizeAdventureSave(cachedRaw, adventureById[id]) : null;
    try {
      const snapshot = await getDoc(doc(db, 'players', this.user.uid, 'adventures', id));
      const remote = snapshot.exists() ? normalizeAdventureSave(snapshot.data(), adventureById[id]) : null;
      const selected = remote && (!cached || remote.revision >= cached.revision) ? remote : cached;
      if (selected) localStorage.setItem(adventureCacheKey(id), JSON.stringify(selected));
      return selected ?? null;
    } catch { return cached; }
  }

  async saveAdventure(save: AdventureSave): Promise<void> {
    localStorage.setItem(adventureCacheKey(save.adventureId), JSON.stringify(save));
    await setDoc(doc(db, 'players', this.user.uid, 'adventures', save.adventureId), {...save, updatedAt:serverTimestamp()}, {merge:true});
  }

  async migrateLegacy(): Promise<PlayerProfile> {
    const existingProfile = await this.loadProfile();
    let profile = existingProfile ?? createProfile();
    let cloud: Record<string, unknown> = {};
    try { cloud = (await getDoc(doc(db, 'players', this.user.uid))).data() ?? {}; }
    catch { /* Der persistente Cache bleibt für Offline-Spiel maßgeblich. */ }
    const localMath = parse<Record<string, unknown>>(localStorage.getItem('matheMagier'));
    const localVocabulary = parse<Record<string, unknown>>(localStorage.getItem('vokabelHeld'));
    for (const definition of adventures) {
      const existing = await this.loadAdventure(definition.id);
      if (existing) {
        const repaired = repairCampaignProgress(existing, definition);
        if (repaired !== existing) {
          try { await this.saveAdventure(repaired); }
          catch { localStorage.setItem(adventureCacheKey(definition.id), JSON.stringify(repaired)); }
        }
        continue;
      }
      const cloudSource = definition.id === 'vocabulary' ? cloud.vocabulary : definition.id === 'decimals' ? (cloud.game as Record<string, unknown> | undefined)?.decimal : cloud.game;
      const localSource = definition.id === 'vocabulary' ? localVocabulary : definition.id === 'decimals' ? localMath?.decimal : localMath;
      const source = (cloudSource ?? localSource) as Record<string, unknown> | undefined;
      const migrated = migrateAdventure(source, definition.id);
      try { await this.saveAdventure(migrated); }
      catch { localStorage.setItem(adventureCacheKey(definition.id), JSON.stringify(migrated)); }
      if (!profile.migratedAdventures.includes(definition.id)) profile = {...profile, migratedAdventures:[...profile.migratedAdventures, definition.id]};
    }
    profile = {...profile, clientUpdatedAt:Date.now()};
    try { await this.saveProfile(profile); }
    catch { localStorage.setItem(profileCacheKey, JSON.stringify(profile)); }
    return profile;
  }
}

function migrateAdventure(source: Record<string, unknown> | undefined, id: AdventureId): AdventureSave {
  const definition = adventureById[id];
  const base = createAdventureSave(definition);
  if (!source) return base;
  const names = new Map(definition.items.map(item => [item.name, item.id]));
  const enemyIds = definition.enemies.map(enemy => enemy.id);
  const owned = Array.isArray(source.owned) ? source.owned.map(String).map(name => names.get(name)).filter((value): value is string => Boolean(value)) : [];
  const equipped: Record<string,string> = {};
  if (source.equipped && typeof source.equipped === 'object') Object.entries(source.equipped as Record<string, unknown>).forEach(([slot,name]) => {
    const itemId = names.get(String(name)); if (itemId) equipped[slot] = itemId;
  });
  const cleared = Array.isArray(source.cleared) ? source.cleared.map(Number).filter(Number.isInteger).map(index => enemyIds[index]).filter(Boolean) : [];
  const currency = id === 'decimals' ? 0 : Math.max(0, Number(source.gold) || 0);
  return normalizeAdventureSave({...base,currency,xp:Number(source.rankXp ?? source.xp) || 0,completed:Number(source.completed)||0,ownedItemIds:owned,equippedBySlot:equipped,clearedEnemyIds:cleared,world:{mapId:definition.world.id,x:Number((source.world as {x?:number}|undefined)?.x)||definition.world.start.x,y:Number((source.world as {y?:number}|undefined)?.y)||definition.world.start.y}},definition);
}

export const observeUser = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);
export const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const register = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
