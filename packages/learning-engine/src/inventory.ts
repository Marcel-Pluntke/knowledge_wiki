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
