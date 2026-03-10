import { create } from 'zustand';
import { DEFAULT_MENUS } from '../utils/defaultMenus';
import { calcPoints } from '../utils/characterLevel';
import type { WorkoutLog, ExerciseLog, Goal, WorkoutMenu, BodyPartStats, BodyPartId } from '../types';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

interface WorkoutStore {
  // Data
  workoutLogs: WorkoutLog[];
  goals: Goal[];
  menus: WorkoutMenu[];
  pendingShipment: Goal | null;

  // Computed
  getStats: () => BodyPartStats;
  getLogsByDate: (date: string) => WorkoutLog | undefined;
  getWorkoutDates: () => string[];

  // Actions
  addWorkout: (date: string, exercises: Omit<ExerciseLog, 'id' | 'points'>[]) => void;
  deleteWorkout: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'achieved' | 'shipped' | 'createdAt'>) => void;
  deleteGoal: (id: string) => void;
  shipGoal: (id: string) => void;
  clearPendingShipment: () => void;
  addMenu: (menu: Omit<WorkoutMenu, 'id'>) => void;
  updateMenu: (menu: WorkoutMenu) => void;
  deleteMenu: (id: string) => void;
  checkGoalAchievements: () => void;
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workoutLogs: loadFromStorage<WorkoutLog[]>('workout_logs', []),
  goals: loadFromStorage<Goal[]>('workout_goals', []),
  menus: loadFromStorage<WorkoutMenu[]>('workout_menus', DEFAULT_MENUS),
  pendingShipment: null,

  getStats: () => {
    const logs = get().workoutLogs;
    const stats: BodyPartStats = { arms: 0, legs: 0, back: 0, chest: 0, shoulders: 0 };
    for (const log of logs) {
      for (const ex of log.exercises) {
        stats[ex.bodyPart] += ex.points;
      }
    }
    return stats;
  },

  getLogsByDate: (date: string) => {
    return get().workoutLogs.find((l) => l.date === date);
  },

  getWorkoutDates: () => {
    return get().workoutLogs.map((l) => l.date);
  },

  addWorkout: (date, exercises) => {
    const logs = get().workoutLogs;
    const exWithPoints: ExerciseLog[] = exercises.map((e) => ({
      ...e,
      id: crypto.randomUUID(),
      points: calcPoints(e.sets, e.reps, e.weight),
    }));

    const existing = logs.find((l) => l.date === date);
    let updated: WorkoutLog[];
    if (existing) {
      updated = logs.map((l) =>
        l.date === date ? { ...l, exercises: [...l.exercises, ...exWithPoints] } : l
      );
    } else {
      updated = [...logs, { id: crypto.randomUUID(), date, exercises: exWithPoints }];
    }

    set({ workoutLogs: updated });
    save('workout_logs', updated);
    get().checkGoalAchievements();
  },

  deleteWorkout: (id) => {
    const updated = get().workoutLogs.filter((l) => l.id !== id);
    set({ workoutLogs: updated });
    save('workout_logs', updated);
  },

  addGoal: (goal) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      achieved: false,
      shipped: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().goals, newGoal];
    set({ goals: updated });
    save('workout_goals', updated);
  },

  deleteGoal: (id) => {
    const updated = get().goals.filter((g) => g.id !== id);
    set({ goals: updated });
    save('workout_goals', updated);
  },

  shipGoal: (id) => {
    const updated = get().goals.map((g) => (g.id === id ? { ...g, shipped: true } : g));
    set({ goals: updated, pendingShipment: null });
    save('workout_goals', updated);
  },

  clearPendingShipment: () => set({ pendingShipment: null }),

  checkGoalAchievements: () => {
    const stats = get().getStats();
    const goals = get().goals;
    let pendingShipment: Goal | null = null;

    const updated = goals.map((g) => {
      if (g.achieved || g.shipped) return g;
      const current = stats[g.bodyPart];
      if (current >= g.targetPoints) {
        const achieved = { ...g, achieved: true };
        if (!pendingShipment) pendingShipment = achieved;
        return achieved;
      }
      return g;
    });

    set({ goals: updated, pendingShipment });
    save('workout_goals', updated);
  },

  addMenu: (menu) => {
    const newMenu: WorkoutMenu = { ...menu, id: crypto.randomUUID() };
    const updated = [...get().menus, newMenu];
    set({ menus: updated });
    save('workout_menus', updated);
  },

  updateMenu: (menu) => {
    const updated = get().menus.map((m) => (m.id === menu.id ? menu : m));
    set({ menus: updated });
    save('workout_menus', updated);
  },

  deleteMenu: (id) => {
    const updated = get().menus.filter((m) => m.id !== id);
    set({ menus: updated });
    save('workout_menus', updated);
  },
}));

export function getStatsByBodyPart(logs: WorkoutLog[], bodyPart: BodyPartId): number {
  return logs.reduce((total, log) => {
    return total + log.exercises
      .filter((e) => e.bodyPart === bodyPart)
      .reduce((sum, e) => sum + e.points, 0);
  }, 0);
}
