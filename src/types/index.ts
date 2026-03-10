export type BodyPartId = 'arms' | 'legs' | 'back' | 'chest' | 'shoulders';

export interface BodyPartInfo {
  id: BodyPartId;
  label: string;
  emoji: string;
  color: string;
  characterPart: string;
}

export const BODY_PARTS: BodyPartInfo[] = [
  { id: 'arms', label: '腕', emoji: '🦀', color: 'text-red-400', characterPart: 'ハサミ' },
  { id: 'legs', label: '脚', emoji: '🦵', color: 'text-orange-400', characterPart: '脚' },
  { id: 'back', label: '背中', emoji: '🐚', color: 'text-amber-400', characterPart: '甲羅' },
  { id: 'chest', label: '胸', emoji: '💪', color: 'text-yellow-400', characterPart: '胴体' },
  { id: 'shoulders', label: '肩', emoji: '👁️', color: 'text-lime-400', characterPart: '目柄' },
];

export interface ExerciseLog {
  id: string;
  exerciseName: string;
  bodyPart: BodyPartId;
  sets: number;
  reps: number;
  weight: number; // 0 = bodyweight
  points: number;
}

export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  exercises: ExerciseLog[];
}

export interface BodyPartStats {
  arms: number;
  legs: number;
  back: number;
  chest: number;
  shoulders: number;
}

export interface Goal {
  id: string;
  bodyPart: BodyPartId;
  targetPoints: number;
  deadline?: string;
  achieved: boolean;
  shipped: boolean;
  createdAt: string;
}

export interface MenuExercise {
  name: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number;
}

export interface WorkoutMenu {
  id: string;
  name: string;
  bodyPart: BodyPartId;
  exercises: MenuExercise[];
}
