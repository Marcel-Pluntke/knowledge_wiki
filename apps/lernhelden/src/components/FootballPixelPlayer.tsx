import {useEffect, useRef} from 'react';
import type {FootballKit} from '../footballClub';

const px = (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
  context.fillStyle = color;
  context.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
};

const skinTones = ['#d9a06f', '#b9784f', '#e1b184'];
const hairTones = ['#3b2a24', '#201d22', '#6a442a'];

function drawShirt(context: CanvasRenderingContext2D, kit: FootballKit) {
  px(context, 7, 9, 10, 9, kit.primary);
  px(context, 5, 10, 3, 7, kit.primary);
  px(context, 16, 10, 3, 7, kit.primary);
  if (kit.pattern === 'stripe') px(context, 11, 9, 3, 9, kit.secondary);
  if (kit.pattern === 'split') px(context, 12, 9, 5, 9, kit.secondary);
  if (kit.pattern === 'sash') {
    px(context, 7, 10, 3, 3, kit.secondary);
    px(context, 10, 12, 3, 3, kit.secondary);
    px(context, 13, 14, 3, 3, kit.secondary);
  }
  if (kit.pattern === 'hoops') {
    px(context, 7, 12, 10, 2, kit.secondary);
    px(context, 7, 16, 10, 2, kit.secondary);
  }
  px(context, 10, 9, 4, 2, kit.accent);
}

function drawFootballer(
  context: CanvasRenderingContext2D,
  kit: FootballKit,
  number: number,
  playerIndex: number,
  keeper: boolean,
) {
  context.clearRect(0, 0, 24, 32);
  context.imageSmoothingEnabled = false;

  const skin = skinTones[playerIndex % skinTones.length];
  const hair = hairTones[playerIndex % hairTones.length];

  px(context, 9, 2, 6, 6, skin);
  px(context, 8, 2, 8, 2, hair);
  px(context, 8, 3, 2, 4, hair);
  px(context, 10, 7, 4, 2, skin);

  drawShirt(context, kit);
  px(context, 4, 11, 2, 7, skin);
  px(context, 18, 11, 2, 7, skin);
  if (keeper) {
    px(context, 2, 16, 4, 2, kit.secondary);
    px(context, 18, 16, 4, 2, kit.secondary);
  }

  px(context, 8, 18, 8, 5, kit.shorts);
  px(context, 8, 23, 3, 6, skin);
  px(context, 13, 23, 3, 6, skin);
  px(context, 8, 25, 3, 4, kit.socks);
  px(context, 13, 25, 3, 4, kit.socks);
  px(context, 6, 29, 5, 2, '#161a20');
  px(context, 13, 29, 5, 2, '#161a20');

  const digit = String(number).slice(-1);
  context.fillStyle = kit.accent;
  context.font = 'bold 5px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(digit, 12, 14);
}

export function FootballPixelPlayer({
  kit,
  number,
  playerIndex = 0,
  keeper = false,
  className = '',
}: {
  kit: FootballKit;
  number: number;
  playerIndex?: number;
  keeper?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = ref.current?.getContext('2d');
    if (context) drawFootballer(context, kit, number, playerIndex, keeper);
  }, [kit, number, playerIndex, keeper]);

  return <canvas
    ref={ref}
    width={24}
    height={32}
    className={`football-pixel-player ${className}`}
    role="img"
    aria-label={keeper ? 'Pixel-Torwart' : `Pixel-Fußballspieler ${number}`}
  />;
}
