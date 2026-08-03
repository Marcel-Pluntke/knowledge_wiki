import type {AdventureDefinition, AdventureSave, CampaignChapter, Question} from './types';
import {touchSave} from './state';

const day = 86_400_000;
const unique = (values: string[], value: string) => values.includes(value) ? values : [...values, value];

export function chapterUnlocked(save: AdventureSave, chapter: CampaignChapter) {
  return chapter.index === 1 || save.campaign.defeatedBossIds.includes(`boss-${save.adventureId}-${chapter.index - 1}`);
}

export function chapterComplete(save: AdventureSave, chapter: CampaignChapter) {
  return chapter.missions.every(mission => save.campaign.completedMissionIds.includes(mission.id));
}

export function completeMission(save: AdventureSave, missionId: string, reward: number, xp: number) {
  if (save.campaign.completedMissionIds.includes(missionId)) return save;
  return touchSave({...save, currency: save.currency + reward, xp: save.xp + xp, completed: save.completed + 1,
    campaign: {...save.campaign, completedMissionIds: unique(save.campaign.completedMissionIds, missionId)}});
}

export function defeatCampaignEnemy(save: AdventureSave, enemyId: string, boss: boolean) {
  const key = boss ? 'defeatedBossIds' : 'defeatedEliteIds';
  if (save.campaign[key].includes(enemyId)) return save;
  return touchSave({...save, campaign: {...save.campaign, [key]: unique(save.campaign[key], enemyId)}});
}

export function openCampaignChest(save: AdventureSave, chapter: CampaignChapter) {
  if (save.campaign.openedChestIds.includes(chapter.chestId)) return save;
  return touchSave({...save, currency: save.currency + chapter.reward,
    campaign: {...save.campaign, openedChestIds: unique(save.campaign.openedChestIds, chapter.chestId), collectionIds: unique(save.campaign.collectionIds, `relic-${chapter.index}`)}});
}

export function bossGate(save: AdventureSave, chapter: CampaignChapter, stats: {power: number; defense: number}) {
  return chapterComplete(save, chapter) && stats.power >= chapter.minimumPower && stats.defense >= chapter.minimumDefense;
}

export function recordMastery(save: AdventureSave, question: Question, correct: boolean, now = Date.now()) {
  const key = question.learningKey ?? question.category ?? question.id;
  const previous = save.masteryByKey[key] ?? {correct: 0, wrong: 0, box: 1 as const, dueAt: now};
  const box = (correct ? Math.min(5, previous.box + 1) : 1) as 1 | 2 | 3 | 4 | 5;
  const intervals = [0, day, day * 3, day * 7, day * 21];
  const next = {correct: previous.correct + (correct ? 1 : 0), wrong: previous.wrong + (correct ? 0 : 1), box, dueAt: now + intervals[box - 1]};
  return touchSave({...save, masteryByKey: {...save.masteryByKey, [key]: next}});
}

export function dailyKey(now = Date.now()) { return new Date(now).toISOString().slice(0, 10); }
export function weeklyKey(now = Date.now()) { const date = new Date(now); return `${date.getUTCFullYear()}-W${Math.ceil((date.getUTCDate() + 6) / 7)}`; }
