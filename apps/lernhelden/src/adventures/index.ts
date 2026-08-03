import {decimalsAdventure} from './decimals';
import {fractionsAdventure} from './fractions';
import {vocabularyAdventure} from './vocabulary';

export const adventures = [vocabularyAdventure, decimalsAdventure, fractionsAdventure];
export const adventureById = Object.fromEntries(adventures.map(adventure => [adventure.id, adventure]));
