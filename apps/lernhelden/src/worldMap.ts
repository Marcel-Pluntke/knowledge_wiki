import type {AdventureId, ThemeDefinition} from '@lernhelden/engine';

export type MapPoint = {x: number; y: number};
export type MapRect = MapPoint & {width: number; height: number};
export type LandmarkKind = 'village' | 'shrine' | 'tower' | 'camp' | 'cave' | 'ruins';

type DetailKind = 'tree' | 'rock' | 'rune' | 'torch' | 'banner' | 'water' | 'books';
type SceneStyle = 'highlands' | 'fortress' | 'forest';

export interface WorldScene {
  title: string;
  style: SceneStyle;
  ground: string;
  groundAlt: string;
  path: string;
  pathEdge: string;
  wall: string;
  wallTop: string;
  missionSites: Array<MapPoint & {kind: LandmarkKind}>;
  campaign: {elite: MapPoint; boss: MapPoint};
  missionGate: MapRect;
  bossGate: MapRect;
  walls: MapRect[];
  details: Array<MapPoint & {kind: DetailKind}>;
}

const gateY = 236;
const gateHeight = 92;
const barrier = (x: number): MapRect[] => [
  {x, y: 48, width: 24, height: gateY - 48},
  {x, y: gateY + gateHeight, width: 24, height: 516 - gateY - gateHeight},
];

export const worldScenes: Record<AdventureId, WorldScene> = {
  fractions: {
    title: 'Die Bruchreiche', style: 'highlands', ground: '#263b3c', groundAlt: '#2d4744', path: '#9b7854', pathEdge: '#5c483b', wall: '#55496a', wallTop: '#8876a5',
    missionSites: [
      {x: 190, y: 300, kind: 'village'}, {x: 360, y: 180, kind: 'shrine'}, {x: 590, y: 165, kind: 'tower'},
      {x: 210, y: 455, kind: 'camp'}, {x: 420, y: 405, kind: 'cave'}, {x: 610, y: 375, kind: 'ruins'},
    ],
    campaign: {elite: {x: 770, y: 282}, boss: {x: 900, y: 282}},
    missionGate: {x: 692, y: gateY, width: 24, height: gateHeight}, bossGate: {x: 836, y: gateY, width: 24, height: gateHeight},
    walls: [...barrier(692), ...barrier(836)],
    details: [
      {x: 70, y: 205, kind: 'tree'}, {x: 130, y: 245, kind: 'rock'}, {x: 290, y: 92, kind: 'rune'}, {x: 480, y: 105, kind: 'rock'},
      {x: 560, y: 475, kind: 'water'}, {x: 650, y: 455, kind: 'tree'}, {x: 730, y: 205, kind: 'torch'}, {x: 805, y: 205, kind: 'banner'},
    ],
  },
  decimals: {
    title: 'Die Komma-Festung', style: 'fortress', ground: '#1b2b43', groundAlt: '#203852', path: '#707783', pathEdge: '#343b48', wall: '#4d5d70', wallTop: '#8295aa',
    missionSites: [
      {x: 180, y: 305, kind: 'village'}, {x: 345, y: 175, kind: 'tower'}, {x: 585, y: 150, kind: 'shrine'},
      {x: 205, y: 460, kind: 'camp'}, {x: 425, y: 410, kind: 'ruins'}, {x: 615, y: 365, kind: 'cave'},
    ],
    campaign: {elite: {x: 770, y: 282}, boss: {x: 900, y: 282}},
    missionGate: {x: 692, y: gateY, width: 24, height: gateHeight}, bossGate: {x: 836, y: gateY, width: 24, height: gateHeight},
    walls: [...barrier(692), ...barrier(836)],
    details: [
      {x: 80, y: 220, kind: 'banner'}, {x: 270, y: 105, kind: 'torch'}, {x: 445, y: 90, kind: 'banner'}, {x: 535, y: 475, kind: 'rock'},
      {x: 645, y: 465, kind: 'torch'}, {x: 740, y: 205, kind: 'banner'}, {x: 800, y: 350, kind: 'torch'}, {x: 885, y: 180, kind: 'banner'},
    ],
  },
  vocabulary: {
    title: 'Die Wortlande', style: 'forest', ground: '#193a36', groundAlt: '#214943', path: '#8c6b4f', pathEdge: '#4c392f', wall: '#3f594b', wallTop: '#6f8b65',
    missionSites: [
      {x: 175, y: 300, kind: 'village'}, {x: 355, y: 165, kind: 'shrine'}, {x: 585, y: 180, kind: 'tower'},
      {x: 205, y: 455, kind: 'camp'}, {x: 415, y: 405, kind: 'cave'}, {x: 605, y: 380, kind: 'ruins'},
    ],
    campaign: {elite: {x: 770, y: 282}, boss: {x: 900, y: 282}},
    missionGate: {x: 692, y: gateY, width: 24, height: gateHeight}, bossGate: {x: 836, y: gateY, width: 24, height: gateHeight},
    walls: [...barrier(692), ...barrier(836)],
    details: [
      {x: 65, y: 210, kind: 'tree'}, {x: 115, y: 260, kind: 'books'}, {x: 285, y: 90, kind: 'tree'}, {x: 470, y: 105, kind: 'rune'},
      {x: 555, y: 475, kind: 'water'}, {x: 650, y: 460, kind: 'tree'}, {x: 740, y: 205, kind: 'torch'}, {x: 800, y: 365, kind: 'books'},
    ],
  },
};

export function collisionRects(scene: WorldScene, obstacles: MapRect[], missionsDone: boolean, bossOpen: boolean) {
  return [...obstacles, ...scene.walls, ...(missionsDone ? [] : [scene.missionGate]), ...(bossOpen ? [] : [scene.bossGate])];
}

export function collides(point: MapPoint, rects: MapRect[], radius = 14) {
  return rects.some(rect => point.x + radius > rect.x && point.x - radius < rect.x + rect.width && point.y + radius > rect.y && point.y - radius < rect.y + rect.height);
}

export function securePosition<T extends MapPoint>(position: T, start: MapPoint, scene: WorldScene, missionsDone: boolean, bossOpen: boolean, hasChapter: boolean): T {
  if (!hasChapter) return position;
  if (!missionsDone && position.x > scene.missionGate.x - 18) return {...position, x: start.x, y: start.y};
  if (!bossOpen && position.x > scene.bossGate.x - 18) return {...position, x: scene.bossGate.x - 48, y: scene.bossGate.y + scene.bossGate.height / 2};
  return position;
}

function tile(context: CanvasRenderingContext2D, x: number, y: number, color: string, width = 8, height = width) {
  context.fillStyle = color;
  context.fillRect(Math.round(x), Math.round(y), width, height);
}

function pixelPath(context: CanvasRenderingContext2D, points: MapPoint[], edge: string, fill: string) {
  for (let segment = 0; segment < points.length - 1; segment++) {
    const from = points[segment], to = points[segment + 1];
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const steps = Math.max(1, Math.ceil(distance / 12));
    for (let step = 0; step <= steps; step++) {
      const x = from.x + (to.x - from.x) * step / steps;
      const y = from.y + (to.y - from.y) * step / steps;
      tile(context, x - 15, y - 15, edge, 30, 30);
      tile(context, x - 11, y - 11, fill, 22, 22);
      if ((step + segment) % 3 === 0) tile(context, x - 2, y - 2, '#f2d19a55', 4, 4);
    }
  }
}

function drawObstacle(context: CanvasRenderingContext2D, rect: MapRect, scene: WorldScene) {
  tile(context, rect.x + 4, rect.y + 7, '#00000055', rect.width, rect.height);
  tile(context, rect.x, rect.y, scene.wall, rect.width, rect.height);
  tile(context, rect.x, rect.y, scene.wallTop, rect.width, 13);
  if (scene.style === 'forest') {
    for (let x = rect.x + 8; x < rect.x + rect.width - 8; x += 22) {
      tile(context, x, rect.y - 8, '#2d693e', 16, 20);
      tile(context, x + 5, rect.y + 8, '#68462e', 6, Math.min(25, rect.height - 8));
    }
  } else {
    for (let x = rect.x + 8; x < rect.x + rect.width - 5; x += 24) tile(context, x, rect.y + 24, '#ffffff18', 14, 5);
  }
}

function drawWall(context: CanvasRenderingContext2D, rect: MapRect, scene: WorldScene) {
  tile(context, rect.x + 5, rect.y + 5, '#00000066', rect.width, rect.height);
  tile(context, rect.x, rect.y, scene.wall, rect.width, rect.height);
  for (let y = rect.y; y < rect.y + rect.height; y += 24) {
    tile(context, rect.x, y, scene.wallTop, rect.width, 5);
    tile(context, rect.x + (Math.floor(y / 24) % 2 ? 4 : 13), y + 5, '#00000028', 3, 19);
  }
}

function drawGate(context: CanvasRenderingContext2D, gate: MapRect, scene: WorldScene, open: boolean, label: string) {
  const centerY = gate.y + gate.height / 2;
  if (open) {
    tile(context, gate.x - 7, gate.y, scene.wallTop, gate.width + 14, 12);
    tile(context, gate.x - 7, gate.y + gate.height - 12, scene.wallTop, gate.width + 14, 12);
    tile(context, gate.x + 7, gate.y + 15, '#ffe88888', 10, 10);
  } else {
    tile(context, gate.x + 3, gate.y, '#31283b', gate.width - 6, gate.height);
    for (let y = gate.y + 4; y < gate.y + gate.height; y += 14) tile(context, gate.x + 5, y, '#d4b86a', gate.width - 10, 5);
    tile(context, gate.x + 7, centerY - 8, '#ffe16b', 10, 14);
    tile(context, gate.x + 9, centerY - 12, '#5b4b31', 6, 7);
  }
  context.fillStyle = open ? '#a9efbd' : '#ffe69a';
  context.font = 'bold 12px monospace';
  context.textAlign = 'center';
  context.fillText(`${open ? '◆' : '■'} ${label}`, gate.x + gate.width / 2, gate.y + gate.height + 18);
}

function drawDetail(context: CanvasRenderingContext2D, detail: WorldScene['details'][number], scene: WorldScene) {
  const {x, y, kind} = detail;
  if (kind === 'tree') {
    tile(context, x - 4, y + 8, '#65452e', 8, 22); tile(context, x - 15, y - 8, '#245c39', 30, 24); tile(context, x - 9, y - 18, '#3d8050', 18, 16);
  } else if (kind === 'rock') {
    tile(context, x - 13, y, '#56606c', 26, 14); tile(context, x - 7, y - 7, '#87929c', 15, 9);
  } else if (kind === 'rune') {
    tile(context, x - 7, y - 17, '#667381', 14, 34); tile(context, x - 3, y - 11, scene.wallTop, 6, 19);
  } else if (kind === 'torch') {
    tile(context, x - 2, y - 2, '#6f4428', 5, 24); tile(context, x - 7, y - 14, '#ff8b3d', 15, 14); tile(context, x - 3, y - 18, '#ffe16b', 7, 10);
  } else if (kind === 'banner') {
    tile(context, x - 2, y - 15, '#b7c2cc', 4, 40); tile(context, x + 2, y - 13, scene.wallTop, 18, 20); tile(context, x + 8, y - 7, '#ffe16b', 6, 6);
  } else if (kind === 'water') {
    tile(context, x - 25, y - 9, '#2e7892', 50, 19); tile(context, x - 16, y - 5, '#73cbe0', 19, 4); tile(context, x + 8, y + 3, '#73cbe0', 12, 3);
  } else {
    tile(context, x - 15, y - 8, '#5d3929', 30, 18); tile(context, x - 10, y - 13, '#d5b665', 8, 13); tile(context, x + 1, y - 13, '#8f72bd', 8, 13);
  }
}

function drawLandmark(context: CanvasRenderingContext2D, point: MapPoint, kind: LandmarkKind, color: string) {
  const {x, y} = point;
  tile(context, x - 27, y + 16, '#00000055', 54, 9);
  if (kind === 'village') {
    tile(context, x - 24, y - 6, '#74452f', 48, 29); tile(context, x - 29, y - 14, color, 58, 12); tile(context, x - 6, y + 6, '#241a20', 12, 17);
  } else if (kind === 'shrine') {
    tile(context, x - 21, y + 13, '#8a8496', 42, 10); tile(context, x - 17, y - 18, '#aca7b6', 8, 31); tile(context, x + 9, y - 18, '#aca7b6', 8, 31); tile(context, x - 22, y - 23, color, 44, 8);
  } else if (kind === 'tower') {
    tile(context, x - 18, y - 24, '#777787', 36, 47); tile(context, x - 23, y - 28, color, 10, 10); tile(context, x - 5, y - 28, color, 10, 10); tile(context, x + 13, y - 28, color, 10, 10); tile(context, x - 5, y + 7, '#272331', 10, 16);
  } else if (kind === 'camp') {
    tile(context, x - 26, y + 15, '#5b392a', 52, 8); tile(context, x - 21, y - 10, color, 42, 27); tile(context, x - 3, y - 8, '#302331', 6, 25); tile(context, x + 27, y + 4, '#ff8e42', 8, 12);
  } else if (kind === 'cave') {
    tile(context, x - 27, y - 8, '#59616b', 54, 31); tile(context, x - 18, y - 18, '#7c8490', 36, 13); tile(context, x - 13, y - 4, '#171724', 26, 27); tile(context, x - 4, y + 6, color, 8, 8);
  } else {
    tile(context, x - 26, y + 14, '#6d6877', 52, 9); tile(context, x - 20, y - 13, '#8f8997', 11, 27); tile(context, x + 7, y - 23, '#8f8997', 12, 37); tile(context, x - 5, y - 3, color, 11, 8);
  }
}

export function paintWorldScene(context: CanvasRenderingContext2D, width: number, height: number, theme: ThemeDefinition, scene: WorldScene, obstacles: MapRect[], start: MapPoint, completed: boolean[], missionsDone: boolean, bossOpen: boolean) {
  context.fillStyle = scene.ground;
  context.fillRect(0, 0, width, height);
  for (let x = 0; x < width; x += 32) for (let y = 0; y < height; y += 32) {
    context.fillStyle = (x / 32 + y / 32) % 2 ? scene.groundAlt : `${theme.primary}18`;
    context.fillRect(x, y, 32, 32);
    if ((x * 3 + y) % 128 === 0) tile(context, x + 7, y + 20, `${theme.secondary}55`, 5, 5);
  }
  const upper = scene.missionSites.slice(0, 3);
  const lower = scene.missionSites.slice(3);
  const merge = {x: scene.missionGate.x - 20, y: scene.missionGate.y + scene.missionGate.height / 2};
  pixelPath(context, [start, ...upper, merge], scene.pathEdge, scene.path);
  pixelPath(context, [start, ...lower, merge], scene.pathEdge, scene.path);
  pixelPath(context, [merge, scene.campaign.elite, scene.campaign.boss], scene.pathEdge, scene.path);
  scene.details.forEach(detail => drawDetail(context, detail, scene));
  obstacles.forEach(obstacle => drawObstacle(context, obstacle, scene));
  scene.walls.forEach(wall => drawWall(context, wall, scene));
  drawGate(context, scene.missionGate, scene, missionsDone, '6/6-Tor');
  drawGate(context, scene.bossGate, scene, bossOpen, 'Boss');
  scene.missionSites.forEach((site, index) => {
    const done = completed[index];
    drawLandmark(context, site, site.kind, done ? '#68dda0' : theme.accent);
    tile(context, site.x - 13, site.y - 47, done ? '#226d4a' : '#211a36', 26, 22);
    context.fillStyle = done ? '#d7ffe7' : theme.accent;
    context.font = 'bold 14px monospace';
    context.textAlign = 'center';
    context.fillText(done ? 'OK' : String(index + 1), site.x, site.y - 31);
    context.fillStyle = done ? '#9ce8b9' : '#fff3bf';
    context.font = 'bold 11px monospace';
    context.fillText(done ? 'geschafft' : `Mission ${index + 1}`, site.x, site.y + 39);
  });
}
