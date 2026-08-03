import type {AdventureDefinition, AdventureSave, PlayerProfile} from './types';

export const defaultSettings = {
  reducedMotion: false,
  uiScale: 'normal' as const,
  fullscreenPreferred: false,
  showControlHints: true,
};

export function createProfile(displayName = '', avatarPresetId = 'avatar-1'): PlayerProfile {
  return {
    schemaVersion: 1,
    displayName,
    avatarPresetId,
    settings: {...defaultSettings},
    achievements: {},
    migratedAdventures: [],
    clientUpdatedAt: Date.now(),
  };
}

export function createAdventureSave(definition: AdventureDefinition): AdventureSave {
  return {
    schemaVersion: 1,
    adventureId: definition.id,
    revision: 0,
    currency: 0,
    xp: 0,
    completed: 0,
    ownedItemIds: [],
    equippedBySlot: {},
    clearedEnemyIds: [],
    world: {mapId: definition.world.id, ...definition.world.start},
    stats: {correct: 0, wrong: 0, bestStreak: 0},
    clientUpdatedAt: Date.now(),
  };
}

export function normalizeAdventureSave(value: unknown, definition: AdventureDefinition): AdventureSave {
  const base = createAdventureSave(definition);
  if (!value || typeof value !== 'object') return base;
  const raw = value as Partial<AdventureSave>;
  const itemIds = new Set(definition.items.map(item => item.id));
  const enemyIds = new Set(definition.enemies.map(enemy => enemy.id));
  const owned = [...new Set(Array.isArray(raw.ownedItemIds) ? raw.ownedItemIds.filter(id => itemIds.has(id)) : [])];
  const equipped: Record<string, string> = {};
  Object.entries(raw.equippedBySlot ?? {}).forEach(([slot, id]) => {
    const item = definition.items.find(candidate => candidate.id === id);
    if (item?.slot === slot && owned.includes(id)) equipped[slot] = id;
  });
  return {
    ...base,
    revision: Math.max(0, Number(raw.revision) || 0),
    currency: Math.max(0, Number(raw.currency) || 0),
    xp: Math.max(0, Number(raw.xp) || 0),
    completed: Math.max(0, Number(raw.completed) || 0),
    ownedItemIds: owned,
    equippedBySlot: equipped,
    clearedEnemyIds: [...new Set(Array.isArray(raw.clearedEnemyIds) ? raw.clearedEnemyIds.filter(id => enemyIds.has(id)) : [])],
    world: {
      mapId: definition.world.id,
      x: Number(raw.world?.x) || definition.world.start.x,
      y: Number(raw.world?.y) || definition.world.start.y,
    },
    stats: {
      correct: Math.max(0, Number(raw.stats?.correct) || 0),
      wrong: Math.max(0, Number(raw.stats?.wrong) || 0),
      bestStreak: Math.max(0, Number(raw.stats?.bestStreak) || 0),
    },
    clientUpdatedAt: Number(raw.clientUpdatedAt) || Date.now(),
  };
}

export function rankFor(definition: AdventureDefinition, xp: number) {
  return definition.ranks.reduce((current, rank) => xp >= rank.xp ? rank : current, definition.ranks[0]);
}

export function equipmentStats(save: AdventureSave, definition: AdventureDefinition) {
  return Object.values(save.equippedBySlot)
    .map(id => definition.items.find(item => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .reduce((sum, item) => ({
      power: sum.power + item.power,
      defense: sum.defense + item.defense,
      luck: sum.luck + item.luck,
    }), {power: 0, defense: 0, luck: 0});
}

export function touchSave(save: AdventureSave): AdventureSave {
  return {...save, revision: save.revision + 1, clientUpdatedAt: Date.now()};
}
