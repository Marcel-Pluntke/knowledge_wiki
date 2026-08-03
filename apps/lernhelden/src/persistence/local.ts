import type {AdventureId, AdventureSave, PlayerProfile, SaveRepository} from '@lernhelden/engine';
import {createAdventureSave, createProfile} from '@lernhelden/engine';
import {adventureById} from '../adventures';

export class LocalSaveRepository implements SaveRepository {
  private profile = {...createProfile('Testheld', 'avatar-1'), migratedAdventures:['vocabulary','decimals','fractions'] as AdventureId[]};
  private saves = new Map<AdventureId,AdventureSave>();
  async loadProfile(){return this.profile}
  async saveProfile(profile:PlayerProfile){this.profile=profile}
  async loadAdventure(id:AdventureId){return this.saves.get(id)??null}
  async saveAdventure(save:AdventureSave){this.saves.set(save.adventureId,save)}
  async migrateLegacy(){
    (Object.keys(adventureById) as AdventureId[]).forEach(id=>{if(!this.saves.has(id))this.saves.set(id,{...createAdventureSave(adventureById[id]),currency:500})});
    return this.profile;
  }
}
