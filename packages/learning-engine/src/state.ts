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
    schemaVersion: 3,
    adventureId: definition.id,
    revision: 0,
    currency: 0,
    xp: 0,
    completed: 0,
    ownedItemIds: [],
    equippedBySlot: {},
    itemUpgradeById: {},
    clearedEnemyIds: [],
    world: {mapId: definition.world.id, ...definition.world.start},
    stats: {correct: 0, wrong: 0, bestStreak: 0},
    campaign: {completedMissionIds: [], defeatedEliteIds: [], defeatedBossIds: [], openedChestIds: [], collectionIds: [], claimedDailyKeys: [], claimedWeeklyKeys: []},
    curriculum: {completedLessonIds: []},
    masteryByKey: {},
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
  const upgrades: Record<string, 0 | 1 | 2 | 3> = {};
  Object.entries(raw.itemUpgradeById ?? {}).forEach(([id, level]) => {
    if (owned.includes(id) && Number.isInteger(level) && Number(level) >= 0 && Number(level) <= 3) upgrades[id] = Number(level) as 0 | 1 | 2 | 3;
  });
  const campaignIds = new Set((definition.campaign ?? []).flatMap(chapter => [chapter.chestId, chapter.eliteEnemyId, chapter.bossEnemyId, ...chapter.missions.map(mission => mission.id)]));
  const curriculumLessonIds = new Set((definition.curriculum?.grades ?? []).flatMap(grade => grade.chapters.flatMap(chapter => chapter.lessons.map(lesson => lesson.id))));
  const legacyTier = Math.max(0, ...owned.map(id => definition.items.find(item => item.id === id)?.tier ?? 0));
  const earlyMissions = (definition.campaign ?? []).filter(chapter => chapter.itemTier <= legacyTier).flatMap(chapter => chapter.missions.map(mission => mission.id));
  const rawCampaign = raw.campaign;
  const list = (values: unknown, valid?: Set<string>) => [...new Set(Array.isArray(values) ? values.filter((id): id is string => typeof id === 'string' && (!valid || valid.has(id))) : [])];
  const mastery: AdventureSave['masteryByKey'] = {};
  Object.entries(raw.masteryByKey ?? {}).forEach(([key, record]) => {
    if (!record || typeof record !== 'object') return;
    const value = record as Partial<AdventureSave['masteryByKey'][string]>;
    const box = Math.min(5, Math.max(1, Number(value.box) || 1)) as 1 | 2 | 3 | 4 | 5;
    mastery[key] = {correct: Math.max(0, Number(value.correct) || 0), wrong: Math.max(0, Number(value.wrong) || 0), box, dueAt: Math.max(0, Number(value.dueAt) || 0)};
  });
  return {
    ...base,
    revision: Math.max(0, Number(raw.revision) || 0),
    currency: Math.max(0, Number(raw.currency) || 0),
    xp: Math.max(0, Number(raw.xp) || 0),
    completed: Math.max(0, Number(raw.completed) || 0),
    ownedItemIds: owned,
    equippedBySlot: equipped,
    itemUpgradeById: upgrades,
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
    campaign: {
      completedMissionIds: list(rawCampaign?.completedMissionIds, campaignIds).length ? list(rawCampaign?.completedMissionIds, campaignIds) : earlyMissions,
      defeatedEliteIds: list(rawCampaign?.defeatedEliteIds, enemyIds),
      defeatedBossIds: list(rawCampaign?.defeatedBossIds, enemyIds),
      openedChestIds: list(rawCampaign?.openedChestIds, campaignIds),
      collectionIds: list(rawCampaign?.collectionIds),
      claimedDailyKeys: list(rawCampaign?.claimedDailyKeys),
      claimedWeeklyKeys: list(rawCampaign?.claimedWeeklyKeys),
    },
    curriculum: {
      completedLessonIds: list(raw.curriculum?.completedLessonIds, curriculumLessonIds),
    },
    masteryByKey: mastery,
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
    .reduce((sum, item) => {
      const factor = 1 + (save.itemUpgradeById[item.id] ?? 0) * 0.1;
      return {
      power: sum.power + Math.floor(item.power * factor),
      defense: sum.defense + Math.floor(item.defense * factor),
      luck: sum.luck + Math.floor(item.luck * factor),
      };
    }, {power: 0, defense: 0, luck: 0});
}

export function touchSave(save: AdventureSave): AdventureSave {
  return {...save, revision: save.revision + 1, clientUpdatedAt: Date.now()};
}
