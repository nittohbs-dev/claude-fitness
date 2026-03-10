import type { WorkoutMenu } from '../types';

export const DEFAULT_MENUS: WorkoutMenu[] = [
  {
    id: 'default-arms-1',
    name: '腕の日 基本',
    bodyPart: 'arms',
    exercises: [
      { name: 'ダンベルカール', defaultSets: 3, defaultReps: 10, defaultWeight: 10 },
      { name: 'ハンマーカール', defaultSets: 3, defaultReps: 10, defaultWeight: 8 },
      { name: 'トライセプスエクステンション', defaultSets: 3, defaultReps: 12, defaultWeight: 6 },
    ],
  },
  {
    id: 'default-legs-1',
    name: '脚の日 基本',
    bodyPart: 'legs',
    exercises: [
      { name: 'スクワット', defaultSets: 4, defaultReps: 10, defaultWeight: 40 },
      { name: 'ランジ', defaultSets: 3, defaultReps: 12, defaultWeight: 0 },
      { name: 'カーフレイズ', defaultSets: 3, defaultReps: 20, defaultWeight: 0 },
    ],
  },
  {
    id: 'default-back-1',
    name: '背中の日 基本',
    bodyPart: 'back',
    exercises: [
      { name: 'デッドリフト', defaultSets: 4, defaultReps: 6, defaultWeight: 60 },
      { name: '懸垂', defaultSets: 3, defaultReps: 8, defaultWeight: 0 },
      { name: 'ダンベルロウ', defaultSets: 3, defaultReps: 10, defaultWeight: 15 },
    ],
  },
  {
    id: 'default-chest-1',
    name: '胸の日 基本',
    bodyPart: 'chest',
    exercises: [
      { name: 'ベンチプレス', defaultSets: 4, defaultReps: 8, defaultWeight: 50 },
      { name: '腕立て伏せ', defaultSets: 3, defaultReps: 15, defaultWeight: 0 },
      { name: 'ダンベルフライ', defaultSets: 3, defaultReps: 12, defaultWeight: 12 },
    ],
  },
  {
    id: 'default-shoulders-1',
    name: '肩の日 基本',
    bodyPart: 'shoulders',
    exercises: [
      { name: 'ショルダープレス', defaultSets: 4, defaultReps: 10, defaultWeight: 20 },
      { name: 'サイドレイズ', defaultSets: 3, defaultReps: 15, defaultWeight: 5 },
      { name: 'フロントレイズ', defaultSets: 3, defaultReps: 15, defaultWeight: 5 },
    ],
  },
];
