import type {AchievementDefinition, CampaignChapter, EnemyDefinition, ItemDefinition, ItemVisualStyle, SpriteRef} from '@lernhelden/engine';

export const sprite = (id: string, label: string, asset = id): SpriteRef => ({id, src:`assets/sprites/${asset}.png`, label});

export const commonAchievements: AchievementDefinition[] = [
  {id:'first-answer', title:'Erster Treffer', description:'Löse deine erste Aufgabe.', event:'answer-correct', threshold:1, sprite:sprite('achievement','Erfolg')},
  {id:'ten-answers', title:'Trainingsheld', description:'Löse zehn Aufgaben.', event:'answer-correct', threshold:10, sprite:sprite('achievement','Erfolg')},
  {id:'first-boss', title:'Bossbezwinger', description:'Besiege deinen ersten Boss.', event:'boss-defeated', threshold:1, sprite:sprite('achievement','Erfolg')},
];

const visualThemes: Record<string, {style:ItemVisualStyle; palettes:Array<[string,string,string]>}> = {
  fractions:{style:'arcane',palettes:[['#6f52c8','#e6bd59','#fff0a6'],['#735fd4','#73d9ff','#ffffff'],['#412f76','#d08cff','#ffe67a']]},
  decimals:{style:'knightly',palettes:[['#8d5f42','#d9b870','#fff2b4'],['#72859c','#d9e5ef','#ffffff'],['#385f9a','#75dfff','#ffe881']]},
  vocabulary:{style:'scholarly',palettes:[['#4e9d67','#d7aa55','#fff1af'],['#3c72ad','#d6e8ff','#ffffff'],['#6c3fa0','#f0c959','#8ff0cf']]},
};

const tierNames = ['Lehrlings','Kupfer','Silber','Saphir','Sonnen','Sternen','Kristall','Königs','Drachen','Licht'];

export function createItems(prefix: string, names: string[], slots: string[]): ItemDefinition[] {
  return Array.from({length: slots.length * 10}, (_, index) => {
    const tier = Math.floor(index / slots.length) + 1;
    const slot = slots[index % slots.length];
    const name = names[index] ?? `${tierNames[tier - 1]}-${names[index % slots.length]}`;
    const theme = visualThemes[prefix] ?? visualThemes.fractions;
    const [primary,secondary,highlight] = theme.palettes[(tier - 1) % theme.palettes.length];
    const id = `${prefix}-${slot}-${tier}`;
    return {
      id,
      name,
      slot,
      tier,
      cost: tier * 50 + index * 8,
      power: slot === 'weapon' ? tier * 5 : tier * 2,
      defense: ['shield','armor','cloak','helmet','hut'].includes(slot) ? tier * 5 : tier,
      luck: slot === 'boots' || slot === 'amulet' ? tier * 3 : tier,
      visual:{id,style:theme.style,variant:tier,primary,secondary,highlight},
    };
  });
}

export const ranks = (titles: string[]) => Array.from({length:10}, (_, index) => ({id:`rank-${index + 1}`, title:titles[index] ?? `Meisterrang ${index + 1}`, xp:[0,50,160,380,700,1100,1600,2250,3000,3900][index]}));

export function createCampaign(prefix: string, topics: string[], modes: string[], spriteAssets: string[], slots: string[]): {campaign: CampaignChapter[]; enemies: EnemyDefinition[]} {
  const campaign: CampaignChapter[] = [];
  const enemies: EnemyDefinition[] = [];
  topics.forEach((topic, offset) => {
    const index = offset + 1;
    const tier = Math.min(10, Math.ceil(index * 10 / 12));
    const power = (slots.length === 6 ? 15 : 13) * tier;
    const defense = (slots.length === 6 ? 17 : 15) * tier;
    const eliteId = `elite-${prefix}-${index}`;
    const bossId = `boss-${prefix}-${index}`;
    const asset = spriteAssets[offset % spriteAssets.length];
    enemies.push(
      {id:eliteId,name:`Elite: ${topic}`,place:`Kapitel ${index}`,hp:70 + index * 32,attack:5 + index * 3,reward:70 + index * 28,xp:18 + index * 7,minimumPower:Math.floor(power * .72),minimumDefense:Math.floor(defense * .72),rule:index % 3 === 0 ? 'charged' : 'normal',sprite:sprite(eliteId,`Elite ${topic}`,asset)},
      {id:bossId,name:`Boss: ${topic}`,place:`Kapitel ${index}`,hp:130 + index * 55,attack:9 + index * 4,reward:150 + index * 45,xp:45 + index * 12,minimumPower:Math.floor(power * 1.05),minimumDefense:Math.floor(defense * 1.05),rule:index % 4 === 0 ? 'fire' : index % 3 === 0 ? 'armor-pierce' : 'normal',sprite:sprite(bossId,`Boss ${topic}`,asset)},
    );
    campaign.push({id:`chapter-${prefix}-${index}`,index,title:`Kapitel ${index}: ${topic}`,topic,itemTier:tier,
      missions:Array.from({length:6},(_, mission)=>({id:`mission-${prefix}-${index}-${mission + 1}`,title:`${topic} · Mission ${mission + 1}`,modeId:modes[(offset + mission) % modes.length],reward:35 + tier * 12,xp:12 + tier * 4})),
      eliteEnemyId:eliteId,bossEnemyId:bossId,chestId:`chest-${prefix}-${index}`,minimumPower:Math.floor(power * 1.05),minimumDefense:Math.floor(defense * 1.05),reward:100 + tier * 55,
    });
  });
  return {campaign,enemies};
}

export function shuffled<T>(values: T[], random: () => number): T[] {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}
