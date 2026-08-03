import type {AdventureDefinition, GameEvent, PlayerProfile} from './types';

export function applyAchievementEvent(profile: PlayerProfile, definition: AdventureDefinition, event: GameEvent): PlayerProfile {
  if (event.adventureId !== definition.id) return profile;
  const achievements = {...profile.achievements};
  definition.achievements.filter(item => item.event === event.type).forEach(item => {
    const key = `${definition.id}:${item.id}`;
    const current = achievements[key] ?? {progress: 0};
    const progress = Math.min(item.threshold, current.progress + 1);
    achievements[key] = {progress, unlockedAt: current.unlockedAt ?? (progress >= item.threshold ? Date.now() : undefined)};
  });
  return {...profile, achievements, clientUpdatedAt: Date.now()};
}
