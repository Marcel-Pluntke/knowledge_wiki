export function buildPlan(c) {
  if (!Number.isInteger(c.rounds)||c.rounds<1||c.rounds>50||!Number.isInteger(c.exercises)||c.exercises<1||c.exercises>50||!['warmup','work','rest','roundRest','finisher'].every(k=>Number.isInteger(c[k])&&c[k]>=0&&c[k]<=3600)||c.work===0) return [];
  const steps=[];
  const add=(kind,seconds,round=0,exercise=0)=>{if(seconds>0)steps.push({kind,seconds,round,exercise});};
  add('warmup',c.warmup);
  for(let r=1;r<=c.rounds;r++){
    for(let e=1;e<=c.exercises;e++){
      add('work',c.work,r,e);
      if(e<c.exercises||c.lastExerciseRest)add('rest',c.rest,r,e);
    }
    if(r<c.rounds||c.lastRoundRest)add('roundRest',c.roundRest,r);
  }
  add('finisher',c.finisher);
  return steps;
}

export function startPlan(steps,now){return steps.length?{index:0,remainingMs:steps[0].seconds*1000,deadline:now+steps[0].seconds*1000}:{index:0,remainingMs:0,deadline:null};}

export function settle(steps,state,now){
  if(state.deadline===null)return state;
  let {index,deadline}=state;
  while(index<steps.length&&now>=deadline){
    index++;
    if(index===steps.length)return {index,remainingMs:0,deadline:null};
    deadline+=steps[index].seconds*1000;
  }
  return {index,remainingMs:Math.max(0,deadline-now),deadline};
}

export function control(steps,state,action,now){
  const s=settle(steps,state,now);
  if(s.index>=steps.length)return s;
  if(action==='pause')return {...s,deadline:null};
  if(action==='resume')return {...s,deadline:now+s.remainingMs};
  const index=action==='next'?s.index+1:s.index;
  if(index>=steps.length)return {index,remainingMs:0,deadline:null};
  const remainingMs=steps[index].seconds*1000;
  return {index,remainingMs,deadline:s.deadline===null?null:now+remainingMs};
}
