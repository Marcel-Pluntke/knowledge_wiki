import type {ReactNode,SVGProps} from 'react';

export type IconName=
  |'home'|'trophy'|'user'|'menu'|'map'|'bag'|'shop'|'settings'|'logout'
  |'arrow-left'|'arrow-right'|'chevron-down'|'check'|'lock'|'flag'|'sword'|'crown'
  |'up'|'down'|'left'|'right'|'interact'|'close';

const paths:Record<IconName,ReactNode>={
  home:<><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5M9.5 20v-6h5v6"/></>,
  trophy:<><path d="M8 4h8v4c0 4-2 6-4 6s-4-2-4-6V4Z"/><path d="M8 6H4v2c0 2 1.5 3.5 4 3.5M16 6h4v2c0 2-1.5 3.5-4 3.5M12 14v4M8 20h8"/></>,
  user:<><circle cx="12" cy="8" r="4"/><path d="M4.5 21c.7-4.2 3.2-6.3 7.5-6.3s6.8 2.1 7.5 6.3"/></>,
  menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>,
  map:<><path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2V6Z"/><path d="M9 4v14M15 6v14"/></>,
  bag:<><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></>,
  shop:<><path d="M4 9h16l-1-5H5L4 9Z"/><path d="M6 9v11h12V9M9 20v-6h6v6"/></>,
  settings:<><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></>,
  logout:<><path d="M10 5H5v14h5M14 8l4 4-4 4M9 12h9"/></>,
  'arrow-left':<><path d="m14 5-7 7 7 7M7 12h13"/></>,
  'arrow-right':<><path d="m10 5 7 7-7 7M4 12h13"/></>,
  'chevron-down':<path d="m6 9 6 6 6-6"/>,
  check:<path d="m5 12 4 4L19 6"/>,
  lock:<><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2"/></>,
  flag:<><path d="M6 21V4M6 5h11l-2 3 2 3H6"/></>,
  sword:<><path d="m14 4 6-1-1 6-9 9-4-4 8-10ZM5 15l-2 2 4 4 2-2"/></>,
  crown:<><path d="m4 7 4 4 4-7 4 7 4-4-2 11H6L4 7ZM7 21h10"/></>,
  up:<path d="m6 14 6-6 6 6"/>,
  down:<path d="m6 10 6 6 6-6"/>,
  left:<path d="m14 6-6 6 6 6"/>,
  right:<path d="m10 6 6 6-6 6"/>,
  interact:<><circle cx="12" cy="12" r="8"/><path d="M9 9h6v6H9z"/></>,
  close:<path d="M6 6l12 12M18 6 6 18"/>,
};

export function Icon({name,size=22,...props}:{name:IconName;size?:number}&Omit<SVGProps<SVGSVGElement>,'name'>){
  return <svg className="ui-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{paths[name]}</svg>;
}
