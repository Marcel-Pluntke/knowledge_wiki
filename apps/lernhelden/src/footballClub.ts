export type FootballKitPattern = 'solid' | 'stripe' | 'sash' | 'hoops' | 'split';

export interface FootballKit {
  id: string;
  name: string;
  price: number;
  primary: string;
  secondary: string;
  accent: string;
  shorts: string;
  socks: string;
  pattern: FootballKitPattern;
}

export interface FootballClubState {
  coins: number;
  ownedKitIds: string[];
  equippedKitIds: [string, string, string];
}

export interface FootballMatchReward {
  total: number;
  base: number;
  correct: number;
  goals: number;
  win: number;
  perfect: number;
}

export const FOOTBALL_KITS: FootballKit[] = [
  {id: 'starter', name: 'Lernhelden Grün', price: 0, primary: '#54d67b', secondary: '#f4fff7', accent: '#143f25', shorts: '#163c26', socks: '#f4fff7', pattern: 'solid'},
  {id: 'royal', name: 'Royal Blau', price: 90, primary: '#3568d4', secondary: '#f1c85a', accent: '#f8f4df', shorts: '#19386f', socks: '#f1c85a', pattern: 'stripe'},
  {id: 'redline', name: 'Rot Schwarz', price: 130, primary: '#d74b47', secondary: '#171b22', accent: '#f5e7df', shorts: '#171b22', socks: '#d74b47', pattern: 'split'},
  {id: 'ice', name: 'Eisblau', price: 170, primary: '#78ccec', secondary: '#effaff', accent: '#173b66', shorts: '#244c75', socks: '#effaff', pattern: 'hoops'},
  {id: 'neon', name: 'Neon Nacht', price: 220, primary: '#a8ef52', secondary: '#172220', accent: '#f5ffdf', shorts: '#172220', socks: '#a8ef52', pattern: 'sash'},
  {id: 'sunset', name: 'Sunset', price: 280, primary: '#ef8a43', secondary: '#6c3f91', accent: '#fff0d2', shorts: '#51316f', socks: '#ef8a43', pattern: 'stripe'},
];

export const FOOTBALL_OPPONENT_KIT: FootballKit = {
  id: 'opponent', name: 'Gegner', price: 0, primary: '#c94843', secondary: '#f2dfd8', accent: '#531d1b', shorts: '#63211f', socks: '#f2dfd8', pattern: 'solid',
};

export const FOOTBALL_KEEPER_KIT: FootballKit = {
  id: 'keeper', name: 'Torwart', price: 0, primary: '#e4a42e', secondary: '#fff0ad', accent: '#5b3d08', shorts: '#754e0b', socks: '#fff0ad', pattern: 'solid',
};

export const DEFAULT_FOOTBALL_CLUB_STATE: FootballClubState = {
  coins: 0,
  ownedKitIds: ['starter'],
  equippedKitIds: ['starter', 'starter', 'starter'],
};

export function footballKitById(id: string): FootballKit {
  return FOOTBALL_KITS.find(kit => kit.id === id) ?? FOOTBALL_KITS[0];
}

export function normalizeFootballClubState(value: Partial<FootballClubState> | null | undefined): FootballClubState {
  const validIds = new Set(FOOTBALL_KITS.map(kit => kit.id));
  const owned = Array.from(new Set(['starter', ...(value?.ownedKitIds ?? []).filter(id => validIds.has(id))]));
  const equippedSource = value?.equippedKitIds ?? DEFAULT_FOOTBALL_CLUB_STATE.equippedKitIds;
  const equipped: [string, string, string] = [0, 1, 2].map(index => {
    const id = equippedSource[index];
    return id && owned.includes(id) ? id : 'starter';
  }) as [string, string, string];

  return {
    coins: Math.max(0, Math.floor(Number(value?.coins) || 0)),
    ownedKitIds: owned,
    equippedKitIds: equipped,
  };
}

export function footballMatchReward(correctAnswers: number, playerGoals: number, opponentGoals: number): FootballMatchReward {
  const safeCorrect = Math.max(0, Math.min(10, Math.floor(correctAnswers)));
  const safeGoals = Math.max(0, Math.floor(playerGoals));
  const base = 20;
  const correct = safeCorrect * 4;
  const goals = safeGoals * 8;
  const win = playerGoals > opponentGoals ? 20 : 0;
  const perfect = safeCorrect === 10 ? 15 : 0;
  return {base, correct, goals, win, perfect, total: base + correct + goals + win + perfect};
}

export function buyFootballKit(state: FootballClubState, kitId: string): FootballClubState {
  const kit = FOOTBALL_KITS.find(candidate => candidate.id === kitId);
  if (!kit || state.ownedKitIds.includes(kitId) || state.coins < kit.price) return state;
  return {
    ...state,
    coins: state.coins - kit.price,
    ownedKitIds: [...state.ownedKitIds, kitId],
  };
}

export function equipFootballKit(state: FootballClubState, playerIndex: number, kitId: string): FootballClubState {
  if (playerIndex < 0 || playerIndex > 2 || !state.ownedKitIds.includes(kitId)) return state;
  const equipped = [...state.equippedKitIds] as [string, string, string];
  equipped[playerIndex] = kitId;
  return {...state, equippedKitIds: equipped};
}
