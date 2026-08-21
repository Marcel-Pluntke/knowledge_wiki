export type AdventureId = 'vocabulary' | 'decimals' | 'fractions';
export type ReleaseStatus = 'hidden' | 'beta' | 'released';
export type InputKind = 'choice' | 'decimal' | 'fraction' | 'text';
export type EquipmentSlot = string;

export interface SpriteRef {
  id: string;
  src: string;
  label: string;
}

export type ItemVisualStyle = 'arcane' | 'knightly' | 'scholarly';

export interface ItemVisualDefinition {
  id: string;
  style: ItemVisualStyle;
  variant: number;
  primary: string;
  secondary: string;
  highlight: string;
}

export type MerchantPortrait = 'goblin' | 'armorer' | 'scholar';
export type MerchantBackdrop = 'woodland-shop' | 'forge' | 'library';

export interface MerchantDefinition {
  id: string;
  name: string;
  shopTitle: string;
  greeting: string;
  note: string;
  portrait: MerchantPortrait;
  backdrop: MerchantBackdrop;
  shelfNames: string[];
  colors: {skin: string; outfit: string; accent: string};
}

export interface ThemeDefinition {
  primary: string;
  secondary: string;
  surface: string;
  background: string;
  accent: string;
}

export interface CurrencyDefinition {
  id: string;
  name: string;
  sprite: SpriteRef;
}

export interface RankDefinition {
  id: string;
  title: string;
  xp: number;
}

export interface ItemDefinition {
  id: string;
  name: string;
  slot: EquipmentSlot;
  tier: number;
  cost: number;
  power: number;
  defense: number;
  luck: number;
  visual: ItemVisualDefinition;
}

export type BossRule = 'normal' | 'heal-on-miss' | 'armor-pierce' | 'charged' | 'golem' | 'shadow' | 'fire';

export interface EnemyDefinition {
  id: string;
  name: string;
  place: string;
  hp: number;
  attack: number;
  reward: number;
  xp: number;
  minimumPower?: number;
  minimumDefense?: number;
  rule?: BossRule;
  sprite: SpriteRef;
}

export interface CampaignMission {
  id: string;
  title: string;
  modeId: string;
  reward: number;
  xp: number;
}

export interface CampaignChapter {
  id: string;
  index: number;
  title: string;
  topic: string;
  itemTier: number;
  missions: CampaignMission[];
  eliteEnemyId: string;
  bossEnemyId: string;
  chestId: string;
  minimumPower: number;
  minimumDefense: number;
  reward: number;
}

export interface MasteryRecord {
  correct: number;
  wrong: number;
  box: 1 | 2 | 3 | 4 | 5;
  dueAt: number;
}

export interface CampaignProgress {
  completedMissionIds: string[];
  defeatedEliteIds: string[];
  defeatedBossIds: string[];
  openedChestIds: string[];
  collectionIds: string[];
  claimedDailyKeys: string[];
  claimedWeeklyKeys: string[];
}

export type CurriculumStatus = 'released' | 'coming-soon';

export interface CurriculumLessonDefinition {
  id: string;
  title: string;
  description: string;
  modeId: string;
  enemyId: string;
  status: CurriculumStatus;
  requiredLessonIds?: string[];
}

export interface CurriculumChapterDefinition {
  id: string;
  index: number;
  title: string;
  description: string;
  status: CurriculumStatus;
  lessons: CurriculumLessonDefinition[];
}

export interface CurriculumGradeDefinition {
  id: string;
  title: string;
  description: string;
  status: CurriculumStatus;
  chapters: CurriculumChapterDefinition[];
}

export interface CurriculumDefinition {
  grades: CurriculumGradeDefinition[];
}

export interface CurriculumProgress {
  completedLessonIds: string[];
}

export interface LearningMode {
  id: string;
  title: string;
  description: string;
}

export interface Question {
  id: string;
  inputKind: InputKind;
  prompt: string;
  choices?: string[];
  answer: string;
  acceptedAnswers?: string[];
  numerator?: number;
  denominator?: number;
  category?: string;
  learningKey?: string;
  hintSteps: string[];
}

export interface QuestionContext {
  modeId: string;
  sequence: number;
  random: () => number;
  chapter?: number;
  mastery?: Record<string, MasteryRecord>;
}

export interface QuestionProvider {
  next(context: QuestionContext): Question;
  evaluate(question: Question, answer: string): boolean;
}

export interface WorldDefinition {
  id: string;
  width: number;
  height: number;
  start: {x: number; y: number};
  obstacles: Array<{x: number; y: number; width: number; height: number}>;
  encounters: Array<{enemyId: string; x: number; y: number}>;
  campaign?: {elite: {x: number; y: number}; boss: {x: number; y: number}};
  merchant: {x: number; y: number};
  chest: {x: number; y: number};
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  event: GameEvent['type'];
  threshold: number;
  sprite: SpriteRef;
}

export interface AdventureDefinition {
  id: AdventureId;
  title: string;
  subtitle: string;
  status: ReleaseStatus;
  theme: ThemeDefinition;
  currency: CurrencyDefinition;
  merchant: MerchantDefinition;
  ranks: RankDefinition[];
  slots: Record<EquipmentSlot, string>;
  items: ItemDefinition[];
  enemies: EnemyDefinition[];
  campaign?: CampaignChapter[];
  curriculum?: CurriculumDefinition;
  modes: LearningMode[];
  questionProvider: QuestionProvider;
  world: WorldDefinition;
  achievements: AchievementDefinition[];
}

export interface AdventureSave {
  schemaVersion: 3;
  adventureId: AdventureId;
  revision: number;
  currency: number;
  xp: number;
  completed: number;
  ownedItemIds: string[];
  equippedBySlot: Record<EquipmentSlot, string>;
  itemUpgradeById: Record<string, 0 | 1 | 2 | 3>;
  clearedEnemyIds: string[];
  world: {mapId: string; x: number; y: number};
  stats: {correct: number; wrong: number; bestStreak: number};
  campaign: CampaignProgress;
  curriculum: CurriculumProgress;
  masteryByKey: Record<string, MasteryRecord>;
  clientUpdatedAt: number;
}

export interface PlayerSettings {
  reducedMotion: boolean;
  uiScale: 'small' | 'normal' | 'large';
  fullscreenPreferred: boolean;
  showControlHints: boolean;
}

export interface PlayerProfile {
  schemaVersion: 1;
  displayName: string;
  avatarPresetId: string;
  settings: PlayerSettings;
  achievements: Record<string, {progress: number; unlockedAt?: number}>;
  migratedAdventures: AdventureId[];
  clientUpdatedAt: number;
}

export interface SaveRepository {
  loadProfile(): Promise<PlayerProfile | null>;
  saveProfile(profile: PlayerProfile): Promise<void>;
  loadAdventure(id: AdventureId): Promise<AdventureSave | null>;
  saveAdventure(save: AdventureSave): Promise<void>;
}

export type GameEvent =
  | {type: 'answer-correct'; adventureId: AdventureId}
  | {type: 'answer-wrong'; adventureId: AdventureId}
  | {type: 'item-bought'; adventureId: AdventureId}
  | {type: 'item-equipped'; adventureId: AdventureId}
  | {type: 'boss-defeated'; adventureId: AdventureId}
  | {type: 'area-entered'; adventureId: AdventureId};

export interface BattleAttack {
  id: 'spark' | 'double' | 'chain' | 'star';
  name: string;
  damage: number;
  cooldown: number;
  sprite: SpriteRef;
}

export interface BattleState {
  enemyId: string;
  enemyHp: number;
  enemyMaxHp: number;
  playerHp: number;
  playerMaxHp: number;
  streak: number;
  phase: 'attack-select' | 'question' | 'resolved' | 'won' | 'lost';
  selectedAttackId: BattleAttack['id'];
  cooldowns: Partial<Record<BattleAttack['id'], number>>;
  counterCount: number;
  specialTriggered: boolean;
}
