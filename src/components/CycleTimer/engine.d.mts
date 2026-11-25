export type Config = {warmup:number; rounds:number; exercises:number; work:number; rest:number; roundRest:number; finisher:number; lastExerciseRest:boolean; lastRoundRest:boolean};
export type Kind = 'warmup' | 'work' | 'rest' | 'roundRest' | 'finisher';
export type Step = {kind:Kind; seconds:number; round:number; exercise:number};
export type TimerState = {index:number; remainingMs:number; deadline:number|null};
export function buildPlan(c:Config):Step[];
export function startPlan(steps:Step[],now:number):TimerState;
export function settle(steps:Step[],state:TimerState,now:number):TimerState;
export function control(steps:Step[],state:TimerState,action:'pause'|'resume'|'next'|'repeat',now:number):TimerState;
