import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '../store/workoutStore';
import { BODY_PARTS } from '../types';
import type { BodyPartId } from '../types';
import { getLevelInfo } from '../utils/characterLevel';
import { Trash2, Plus, Ship } from 'lucide-react';

export function Goals() {
  const { goals, addGoal, deleteGoal, shipGoal, getStats } = useWorkoutStore();
  const stats = getStats();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ bodyPart: BodyPartId; targetPoints: number; deadline: string }>({
    bodyPart: 'arms',
    targetPoints: 500,
    deadline: '',
  });

  const handleAdd = () => {
    addGoal({ bodyPart: form.bodyPart, targetPoints: form.targetPoints, deadline: form.deadline || undefined });
    setShowForm(false);
  };

  return (
    <div className="flex flex-col px-4 pt-6 pb-28 min-h-screen max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-white">🎯 目標設定</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-sm px-3 py-2 rounded-lg"
        >
          <Plus size={14} /> 追加
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="bg-gray-900 rounded-2xl p-4 border border-gray-800 mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-sm font-bold text-white mb-3">新しい目標</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">部位</label>
                <div className="flex gap-2 flex-wrap">
                  {BODY_PARTS.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => setForm((f) => ({ ...f, bodyPart: part.id }))}
                      className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                        form.bodyPart === part.id
                          ? 'bg-red-600 border-red-400 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-300'
                      }`}
                    >
                      {part.emoji} {part.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  目標ポイント（現在: {stats[form.bodyPart]} pt）
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.targetPoints}
                  onChange={(e) => setForm((f) => ({ ...f, targetPoints: Number(e.target.value) }))}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">期限（任意）</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700"
                />
              </div>
              <button
                onClick={handleAdd}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-2 rounded-lg"
              >
                目標を設定する
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals list */}
      {goals.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-4xl mb-2">🎯</p>
          <p>まだ目標がありません</p>
          <p className="text-sm mt-1">「追加」から最初の目標を設定しよう！</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {goals.map((goal) => {
            const part = BODY_PARTS.find((b) => b.id === goal.bodyPart)!;
            const current = stats[goal.bodyPart];
            const progress = Math.min(current / goal.targetPoints, 1);
            const levelInfo = getLevelInfo(current);
            const isAchieved = goal.achieved;
            const isShipped = goal.shipped;

            return (
              <motion.div
                key={goal.id}
                className={`bg-gray-900 rounded-2xl p-4 border ${
                  isShipped
                    ? 'border-gray-700 opacity-50'
                    : isAchieved
                    ? 'border-yellow-500/60'
                    : 'border-gray-800'
                }`}
                layout
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{part.emoji}</span>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {part.label} <span className="text-gray-400 text-xs">({part.characterPart})</span>
                      </div>
                      <div className="text-xs text-gray-500">Lv{levelInfo.level} {levelInfo.label}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAchieved && !isShipped && (
                      <button
                        onClick={() => shipGoal(goal.id)}
                        className="flex items-center gap-1 text-xs bg-yellow-500 text-black font-bold px-2 py-1 rounded-full"
                      >
                        <Ship size={12} /> 出荷！
                      </button>
                    )}
                    {isShipped && (
                      <span className="text-xs text-gray-500">✅ 出荷済み</span>
                    )}
                    <button onClick={() => deleteGoal(goal.id)} className="text-gray-600 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>{current} pt</span>
                  <span>目標: {goal.targetPoints} pt</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-3 rounded-full ${isAchieved ? 'bg-yellow-400' : 'bg-gradient-to-r from-red-500 to-orange-400'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <div className="text-right text-xs mt-1">
                  {isShipped ? (
                    <span className="text-gray-500">出荷完了 🚢</span>
                  ) : isAchieved ? (
                    <span className="text-yellow-400 font-bold">🎉 目標達成！出荷できます！</span>
                  ) : (
                    <span className="text-gray-500">
                      あと {goal.targetPoints - current} pt
                      {goal.deadline && ` / 期限: ${goal.deadline}`}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
