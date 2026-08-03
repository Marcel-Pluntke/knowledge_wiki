import type {BattleAttack, BattleState, EnemyDefinition} from './types';

export const battleAttacks: BattleAttack[] = [
  {id: 'spark', name: 'Funkenangriff', damage: 1, cooldown: 0, sprite: {id:'attack-spark', src:'assets/sprites/attack-spark.png', label:'Funkenangriff'}},
  {id: 'double', name: 'Doppelblitz', damage: 2, cooldown: 1, sprite: {id:'attack-double', src:'assets/sprites/attack-double.png', label:'Doppelblitz'}},
  {id: 'chain', name: 'Kettenzauber', damage: 1, cooldown: 0, sprite: {id:'attack-chain', src:'assets/sprites/attack-chain.png', label:'Kettenzauber'}},
  {id: 'star', name: 'Sternensturm', damage: 3, cooldown: 2, sprite: {id:'attack-star', src:'assets/sprites/attack-star.png', label:'Sternensturm'}},
];

export function createBattle(enemy: EnemyDefinition, defense: number): BattleState {
  const hp = 70 + defense * 4;
  return {
    enemyId: enemy.id,
    enemyHp: enemy.hp,
    enemyMaxHp: enemy.hp,
    playerHp: hp,
    playerMaxHp: hp,
    streak: 0,
    phase: 'attack-select',
    selectedAttackId: 'spark',
    cooldowns: {},
    counterCount: 0,
    specialTriggered: false,
  };
}

export function selectAttack(state: BattleState, attackId: BattleAttack['id']): BattleState {
  if (state.phase !== 'attack-select' || (state.cooldowns[attackId] ?? 0) > 0) return state;
  return {...state, selectedAttackId: attackId, phase: 'question'};
}

export function resolveCorrect(state: BattleState, enemy: EnemyDefinition, power: number) {
  const attack = battleAttacks.find(candidate => candidate.id === state.selectedAttackId) ?? battleAttacks[0];
  const chainBonus = attack.id === 'chain' ? Math.min(2, state.streak) : 0;
  let damage = Math.max(1, 6 + power + attack.damage - 1 + chainBonus);
  if (enemy.rule === 'golem') damage = Math.max(1, damage - 2);
  const enemyHp = Math.max(0, state.enemyHp - damage);
  const cooldowns = {...state.cooldowns};
  if (attack.cooldown) cooldowns[attack.id] = attack.cooldown + 1;
  return {
    state: {...state, enemyHp, streak: state.streak + 1, cooldowns, phase: enemyHp === 0 ? 'won' as const : 'resolved' as const},
    damage,
  };
}

export function resolveCounter(state: BattleState, enemy: EnemyDefinition, defense: number, missed: boolean) {
  const counterCount = state.counterCount + 1;
  let protection = defense;
  if (enemy.rule === 'armor-pierce') protection = Math.floor(defense * .7);
  let damage = missed ? Math.max(2, enemy.attack - protection) : Math.max(1, Math.ceil((enemy.attack - protection * 1.2) / 5));
  if (enemy.rule === 'charged' && counterCount % 3 === 0) damage += 3;
  if (enemy.rule === 'fire' && state.enemyHp <= state.enemyMaxHp / 2) damage += 2;
  let enemyHp = state.enemyHp;
  let specialTriggered = state.specialTriggered;
  if (missed && enemy.rule === 'heal-on-miss' && !specialTriggered) {
    enemyHp = Math.min(state.enemyMaxHp, enemyHp + 5);
    specialTriggered = true;
  }
  const playerHp = Math.max(0, state.playerHp - damage);
  return {
    state: {...state, enemyHp, playerHp, counterCount, specialTriggered, streak: missed ? 0 : state.streak, phase: playerHp === 0 ? 'lost' as const : 'resolved' as const},
    damage,
  };
}

export function nextTurn(state: BattleState): BattleState {
  const cooldowns = Object.fromEntries(Object.entries(state.cooldowns).map(([id, value]) => [id, Math.max(0, (value ?? 0) - 1)]));
  return {...state, cooldowns, selectedAttackId: 'spark', phase: 'attack-select'};
}
