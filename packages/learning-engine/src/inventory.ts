import type {AdventureDefinition, AdventureSave} from './types';
import {touchSave} from './state';

export function buyItem(save: AdventureSave, definition: AdventureDefinition, itemId: string): AdventureSave {
  const item = definition.items.find(candidate => candidate.id === itemId);
  if (!item || save.ownedItemIds.includes(itemId) || save.currency < item.cost) return save;
  return touchSave({...save, currency: save.currency - item.cost, ownedItemIds: [...save.ownedItemIds, itemId]});
}

export function equipItem(save: AdventureSave, definition: AdventureDefinition, itemId: string): AdventureSave {
  const item = definition.items.find(candidate => candidate.id === itemId);
  if (!item || !save.ownedItemIds.includes(itemId)) return save;
  return touchSave({...save, equippedBySlot: {...save.equippedBySlot, [item.slot]: item.id}});
}

export function unequipSlot(save: AdventureSave, slot: string): AdventureSave {
  if (!save.equippedBySlot[slot]) return save;
  const equippedBySlot = {...save.equippedBySlot};
  delete equippedBySlot[slot];
  return touchSave({...save, equippedBySlot});
}

export function discardItem(save: AdventureSave, itemId: string): AdventureSave {
  if (!save.ownedItemIds.includes(itemId) || Object.values(save.equippedBySlot).includes(itemId)) return save;
  return touchSave({...save, ownedItemIds: save.ownedItemIds.filter(id => id !== itemId)});
}

export function upgradeCost(itemCost: number, level: number) {
  return Math.max(10, Math.floor(itemCost * (0.35 + level * 0.2)));
}

export function upgradeItem(save: AdventureSave, definition: AdventureDefinition, itemId: string): AdventureSave {
  const item = definition.items.find(candidate => candidate.id === itemId);
  const level = save.itemUpgradeById[itemId] ?? 0;
  if (!item || !save.ownedItemIds.includes(itemId) || level >= 3) return save;
  const cost = upgradeCost(item.cost, level);
  if (save.currency < cost) return save;
  return touchSave({...save, currency: save.currency - cost, itemUpgradeById: {...save.itemUpgradeById, [itemId]: (level + 1) as 1 | 2 | 3}});
}
