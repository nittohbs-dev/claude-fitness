export interface LevelInfo {
  level: number;
  scale: number;
  label: string;
  nextThreshold: number | null;
}

const LEVELS = [
  { threshold: 0, scale: 1.0, label: 'ひよっこ' },
  { threshold: 100, scale: 1.25, label: 'ルーキー' },
  { threshold: 300, scale: 1.55, label: 'セミプロ' },
  { threshold: 700, scale: 1.9, label: 'プロ' },
  { threshold: 1500, scale: 2.35, label: 'エリート' },
  { threshold: 3000, scale: 3.0, label: 'レジェンド' },
];

export function getLevelInfo(points: number): LevelInfo {
  let levelIdx = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].threshold) {
      levelIdx = i;
      break;
    }
  }
  const next = LEVELS[levelIdx + 1] ?? null;
  return {
    level: levelIdx,
    scale: LEVELS[levelIdx].scale,
    label: LEVELS[levelIdx].label,
    nextThreshold: next ? next.threshold : null,
  };
}

export function getLevelProgress(points: number): number {
  const info = getLevelInfo(points);
  if (info.nextThreshold === null) return 1;
  const current = LEVELS[info.level].threshold;
  return (points - current) / (info.nextThreshold - current);
}

export function calcPoints(sets: number, reps: number, weight: number): number {
  return sets * reps * (weight > 0 ? weight : 1);
}
