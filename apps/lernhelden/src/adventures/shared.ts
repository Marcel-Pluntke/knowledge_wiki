import type {AchievementDefinition, ItemDefinition, ItemVisualStyle, SpriteRef} from '@lernhelden/engine';

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

export function createItems(prefix: string, names: string[], slots: string[]): ItemDefinition[] {
  return names.map((name, index) => {
    const tier = Math.floor(index / slots.length) + 1;
    const slot = slots[index % slots.length];
    const theme = visualThemes[prefix] ?? visualThemes.fractions;
    const [primary,secondary,highlight] = theme.palettes[(tier - 1) % theme.palettes.length];
    const id = `${prefix}-${slot}-${tier}`;
    return {
      id,
      name,
      slot,
      tier,
      cost: tier * tier * 35 + index * 5,
      power: slot === 'weapon' ? tier * 3 : tier,
      defense: ['shield','armor','cloak','helmet','hut'].includes(slot) ? tier * 2 : tier - 1,
      luck: slot === 'boots' || slot === 'amulet' ? tier * 2 : tier - 1,
      visual:{id,style:theme.style,variant:tier,primary,secondary,highlight},
    };
  });
}

export const ranks = (titles: string[]) => titles.map((title, index) => ({id:`rank-${index + 1}`, title, xp:[0,25,70,140,240][index] ?? index * 80}));

export function shuffled<T>(values: T[], random: () => number): T[] {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}
