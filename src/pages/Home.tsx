import { motion } from 'framer-motion';
import { ClaudeMascot } from '../components/character/ClaudeMascot';
import { useWorkoutStore } from '../store/workoutStore';
import { BODY_PARTS } from '../types';
import { getLevelInfo, getLevelProgress } from '../utils/characterLevel';

interface Props {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: Props) {
  const { getStats, workoutLogs } = useWorkoutStore();
  const stats = getStats();

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  const totalWorkouts = workoutLogs.length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const workedOutToday = workoutLogs.some((l) => l.date === todayStr);

  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-28 min-h-screen">
      {/* Header */}
      <div className="w-full max-w-md mb-2">
        <p className="text-gray-400 text-sm text-center">{today}</p>
        <h1 className="text-2xl font-black text-center text-white">
          🦀 俺の蟹
        </h1>
      </div>

      {/* Character */}
      <motion.div
        className="animate-float my-2"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ClaudeMascot stats={stats} size={260} />
      </motion.div>

      {/* Today status */}
      {workedOutToday ? (
        <motion.div
          className="bg-green-900/40 border border-green-500/40 text-green-300 text-sm px-4 py-2 rounded-full mb-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          ✅ 今日もトレーニング済み！
        </motion.div>
      ) : (
        <motion.button
          className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold px-8 py-3 rounded-full text-base shadow-lg mb-4"
          style={{ boxShadow: '0 0 16px rgba(229,62,62,0.4)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('log')}
        >
          今日のトレーニングを記録する 💪
        </motion.button>
      )}

      {/* Stats grid */}
      <div className="w-full max-w-md grid grid-cols-5 gap-2 mb-4">
        {BODY_PARTS.map((part) => {
          const points = stats[part.id];
          const info = getLevelInfo(points);
          const progress = getLevelProgress(points);
          return (
            <div key={part.id} className="flex flex-col items-center bg-gray-900 rounded-xl p-2">
              <span className="text-lg">{part.emoji}</span>
              <span className="text-xs text-gray-400">{part.label}</span>
              <span className="text-xs font-bold text-white">Lv{info.level}</span>
              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                <div
                  className="bg-orange-400 h-1 rounded-full transition-all duration-700"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-0.5">{info.label}</span>
            </div>
          );
        })}
      </div>

      {/* Total workouts */}
      <div className="w-full max-w-md bg-gray-900/60 rounded-2xl p-4 flex items-center justify-between">
        <span className="text-gray-400 text-sm">総トレーニング回数</span>
        <span className="text-2xl font-black text-white">{totalWorkouts} <span className="text-base font-normal text-gray-400">回</span></span>
      </div>
    </div>
  );
}
