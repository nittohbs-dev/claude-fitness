import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '../store/workoutStore';
import { BODY_PARTS } from '../types';
import type { BodyPartId, MenuExercise } from '../types';
import { calcPoints } from '../utils/characterLevel';
import { Plus, Trash2, CheckCircle, ChevronDown } from 'lucide-react';

interface ExerciseEntry {
  id: string;
  exerciseName: string;
  bodyPart: BodyPartId;
  sets: number;
  reps: number;
  weight: number;
}

export function WorkoutLog() {
  const { addWorkout, menus } = useWorkoutStore();
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPartId>('arms');
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [showMenuPicker, setShowMenuPicker] = useState(false);
  const [saved, setSaved] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const filteredMenus = menus.filter((m) => m.bodyPart === selectedBodyPart);

  const addEntry = (ex?: { name: string; sets: number; reps: number; weight: number }) => {
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        exerciseName: ex?.name ?? '',
        bodyPart: selectedBodyPart,
        sets: ex?.sets ?? 3,
        reps: ex?.reps ?? 10,
        weight: ex?.weight ?? 0,
      },
    ]);
  };

  const addFromMenu = (exercises: MenuExercise[]) => {
    const newEntries = exercises.map((e) => ({
      id: crypto.randomUUID(),
      exerciseName: e.name,
      bodyPart: selectedBodyPart,
      sets: e.defaultSets,
      reps: e.defaultReps,
      weight: e.defaultWeight,
    }));
    setEntries((prev) => [...prev, ...newEntries]);
    setShowMenuPicker(false);
  };

  const updateEntry = (id: string, field: keyof ExerciseEntry, value: string | number) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSave = () => {
    if (entries.length === 0) return;
    addWorkout(date, entries);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setEntries([]);
    }, 1500);
  };

  const totalPoints = entries.reduce((sum, e) => sum + calcPoints(e.sets, e.reps, e.weight), 0);

  return (
    <div className="flex flex-col px-4 pt-6 pb-28 min-h-screen max-w-md mx-auto">
      <h2 className="text-xl font-black text-white mb-4">📝 トレーニング記録</h2>

      {/* Date */}
      <label className="text-gray-400 text-sm mb-1">日付</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="bg-gray-800 text-white rounded-lg px-3 py-2 mb-4 text-sm border border-gray-700 w-full"
      />

      {/* Body part selector */}
      <label className="text-gray-400 text-sm mb-2">部位を選ぶ</label>
      <div className="flex gap-2 flex-wrap mb-4">
        {BODY_PARTS.map((part) => (
          <button
            key={part.id}
            onClick={() => setSelectedBodyPart(part.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all ${
              selectedBodyPart === part.id
                ? 'bg-red-600 border-red-400 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-300'
            }`}
          >
            {part.emoji} {part.label}
          </button>
        ))}
      </div>

      {/* Add buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => addEntry()}
          className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 flex-1"
        >
          <Plus size={14} /> 種目を追加
        </button>
        {filteredMenus.length > 0 && (
          <button
            onClick={() => setShowMenuPicker(!showMenuPicker)}
            className="flex items-center gap-1 bg-orange-900/40 hover:bg-orange-900/60 text-orange-300 text-sm px-3 py-2 rounded-lg border border-orange-700/40 flex-1"
          >
            <ChevronDown size={14} /> メニューから
          </button>
        )}
      </div>

      {/* Menu picker */}
      <AnimatePresence>
        {showMenuPicker && (
          <motion.div
            className="bg-gray-800 rounded-xl border border-gray-700 mb-4 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {filteredMenus.map((menu) => (
              <button
                key={menu.id}
                onClick={() => addFromMenu(menu.exercises)}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700 border-b border-gray-700 last:border-0"
              >
                <div className="font-bold">{menu.name}</div>
                <div className="text-gray-400 text-xs">{menu.exercises.map((e) => e.name).join(' / ')}</div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise entries */}
      <div className="flex flex-col gap-3 mb-4">
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              className="bg-gray-900 rounded-xl p-3 border border-gray-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-orange-400 font-bold">
                  {BODY_PARTS.find((b) => b.id === entry.bodyPart)?.emoji}
                  {BODY_PARTS.find((b) => b.id === entry.bodyPart)?.label}
                </span>
                <input
                  type="text"
                  placeholder="種目名"
                  value={entry.exerciseName}
                  onChange={(e) => updateEntry(entry.id, 'exerciseName', e.target.value)}
                  className="flex-1 bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
                />
                <button onClick={() => removeEntry(entry.id)} className="text-gray-500 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex gap-2">
                {[
                  { label: 'セット', field: 'sets' as const, unit: '' },
                  { label: '回数', field: 'reps' as const, unit: '' },
                  { label: '重量(kg)', field: 'weight' as const, unit: '' },
                ].map(({ label, field }) => (
                  <div key={field} className="flex-1">
                    <label className="text-xs text-gray-500">{label}</label>
                    <input
                      type="number"
                      min={0}
                      value={entry[field]}
                      onChange={(e) => updateEntry(entry.id, field, Number(e.target.value))}
                      className="w-full bg-gray-800 text-white text-sm text-center rounded px-1 py-1 border border-gray-700"
                    />
                  </div>
                ))}
              </div>
              <div className="text-right text-xs text-orange-400 mt-1">
                {calcPoints(entry.sets, entry.reps, entry.weight)} pt
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {entries.length > 0 && (
        <div className="bg-gray-900/60 rounded-xl p-3 mb-4 flex justify-between items-center">
          <span className="text-gray-400 text-sm">合計ポイント</span>
          <span className="text-orange-400 font-black text-lg">{totalPoints} pt</span>
        </div>
      )}

      {/* Save button */}
      <motion.button
        className={`w-full py-4 rounded-xl font-black text-lg ${
          entries.length === 0
            ? 'bg-gray-800 text-gray-600'
            : 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
        }`}
        style={entries.length > 0 ? { boxShadow: '0 0 16px rgba(229,62,62,0.4)' } : {}}
        disabled={entries.length === 0}
        onClick={handleSave}
        whileTap={entries.length > 0 ? { scale: 0.97 } : {}}
      >
        {saved ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle size={20} /> 保存しました！
          </span>
        ) : (
          '記録を保存する 💪'
        )}
      </motion.button>
    </div>
  );
}
