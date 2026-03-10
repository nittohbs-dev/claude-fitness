import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useWorkoutStore } from '../store/workoutStore';
import { BODY_PARTS } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { workoutLogs } = useWorkoutStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDow = getDay(monthStart); // 0=Sun

  const prevMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1));
  const nextMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1));

  const getLogForDate = (date: Date) => {
    const ds = format(date, 'yyyy-MM-dd');
    return workoutLogs.find((l) => l.date === ds);
  };

  const selectedLog = selectedDate ? getLogForDate(selectedDate) : null;

  const DOW_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="flex flex-col px-4 pt-6 pb-28 min-h-screen max-w-md mx-auto">
      <h2 className="text-xl font-black text-white mb-4">📅 カレンダー</h2>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-gray-400 hover:text-white p-1">
          <ChevronLeft size={22} />
        </button>
        <h3 className="text-base font-bold text-white">
          {format(currentMonth, 'yyyy年M月', { locale: ja })}
        </h3>
        <button onClick={nextMonth} className="text-gray-400 hover:text-white p-1">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Day of week header */}
      <div className="grid grid-cols-7 mb-1">
        {DOW_LABELS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs py-1 font-bold ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Empty cells before start */}
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const log = getLogForDate(day);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isToday = isSameDay(day, new Date());
          const dow = getDay(day);

          // Gather which body parts were trained
          const trainedParts = log
            ? [...new Set(log.exercises.map((e) => e.bodyPart))]
            : [];

          return (
            <motion.button
              key={day.toISOString()}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedDate(isSelected ? null : day)}
              className={`relative flex flex-col items-center justify-start rounded-lg pt-1 pb-1 aspect-square
                ${isSelected ? 'bg-orange-600/40 border border-orange-500' : log ? 'bg-red-950/40 border border-red-800/30' : 'bg-gray-900/40 border border-transparent'}
                ${isToday ? 'ring-1 ring-orange-400' : ''}
              `}
            >
              <span
                className={`text-xs font-bold ${
                  dow === 0 ? 'text-red-400' : dow === 6 ? 'text-blue-400' : 'text-gray-300'
                }`}
              >
                {format(day, 'd')}
              </span>
              {/* Body part dots */}
              <div className="flex flex-wrap justify-center gap-0.5 mt-0.5">
                {trainedParts.slice(0, 3).map((p) => (
                  <div
                    key={p}
                    className="w-1.5 h-1.5 rounded-full bg-orange-400"
                    title={BODY_PARTS.find((b) => b.id === p)?.label}
                  />
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedDate && (
        <motion.div
          className="bg-gray-900 rounded-2xl p-4 border border-gray-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="text-sm font-bold text-white mb-2">
            {format(selectedDate, 'M月d日（E）', { locale: ja })}
          </h4>
          {selectedLog ? (
            <div className="flex flex-col gap-2">
              {selectedLog.exercises.map((ex) => {
                const part = BODY_PARTS.find((b) => b.id === ex.bodyPart);
                return (
                  <div key={ex.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span>{part?.emoji}</span>
                      <span className="text-gray-300">{ex.exerciseName || '（名称なし）'}</span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {ex.sets}セット×{ex.reps}回
                      {ex.weight > 0 ? ` ${ex.weight}kg` : ''}
                    </span>
                    <span className="text-orange-400 text-xs font-bold">{ex.points}pt</span>
                  </div>
                );
              })}
              <div className="border-t border-gray-800 pt-2 flex justify-between">
                <span className="text-gray-400 text-sm">合計</span>
                <span className="text-orange-400 font-black">
                  {selectedLog.exercises.reduce((s, e) => s + e.points, 0)} pt
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">この日の記録はありません</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
