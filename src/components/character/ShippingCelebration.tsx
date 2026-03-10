import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Goal } from '../../types';
import { BODY_PARTS } from '../../types';
import { useWorkoutStore } from '../../store/workoutStore';

/* ─────────────────────────────────────────
   Confetti
───────────────────────────────────────── */
interface ConfettiPiece {
  id: number; x: number; color: string; delay: number; rotate: number; size: number;
}
const COLORS = ['#E53E3E', '#F6AD55', '#68D391', '#63B3ED', '#FC8181', '#FBD38D', '#9AE6B4'];
function generateConfetti(count = 60): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 1.5, rotate: Math.random() * 720 - 360, size: 8 + Math.random() * 12,
  }));
}

/* ─────────────────────────────────────────
   Steam particle
───────────────────────────────────────── */
function SteamParticle({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/20 blur-sm"
      style={{ left: x, bottom: 0, width: 10 + Math.random() * 8, height: 10 + Math.random() * 8 }}
      initial={{ y: 0, opacity: 0.6, scale: 0.5 }}
      animate={{ y: -80, opacity: 0, scale: 2.5 }}
      transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: 0.5, ease: 'easeOut' }}
    />
  );
}

/* ─────────────────────────────────────────
   Cooked crab SVG (食卓用)
───────────────────────────────────────── */
function CookedCrab() {
  const cx = 80, cy = 68;
  return (
    <svg width={160} height={120} viewBox="0 0 160 120" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="cookedBody" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FF8C42" />
          <stop offset="100%" stopColor="#C0392B" />
        </radialGradient>
      </defs>

      {/* Legs */}
      {[-1, 1].map((side) =>
        [0, 1, 2].map((i) => (
          <line key={`${side}${i}`}
            x1={cx + side * 32}
            y1={cy + 4 + i * 8}
            x2={cx + side * (50 + i * 5)}
            y2={cy + 18 + i * 10}
            stroke="#C0392B" strokeWidth={4} strokeLinecap="round"
          />
        ))
      )}

      {/* Shell */}
      <ellipse cx={cx} cy={cy} rx={36} ry={26} fill="#E67E22" />
      {[0,1,2].map(i => (
        <ellipse key={i} cx={cx} cy={cy-1+i*3} rx={36*(0.7-i*0.15)} ry={26*(0.5-i*0.1)}
          fill="none" stroke="#F39C12" strokeWidth={1.5} strokeOpacity={0.5} />
      ))}

      {/* Body */}
      <ellipse cx={cx} cy={cy} rx={28} ry={20} fill="url(#cookedBody)" />

      {/* X eyes (cooked) */}
      {[-10, 10].map((ox) => (
        <g key={ox} transform={`translate(${cx + ox}, ${cy - 6})`}>
          <line x1={-3} y1={-3} x2={3} y2={3} stroke="#5D2A00" strokeWidth={2} strokeLinecap="round" />
          <line x1={3} y1={-3} x2={-3} y2={3} stroke="#5D2A00" strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}

      {/* Mouth (wavy, cooked expression) */}
      <path d={`M ${cx-8} ${cy+8} Q ${cx} ${cy+13} ${cx+8} ${cy+8}`}
        fill="none" stroke="#7B1919" strokeWidth={2} strokeLinecap="round" />

      {/* Claws */}
      {[-1, 1].map((side) => (
        <g key={side}>
          <rect x={cx + side * 28 - (side > 0 ? 0 : 16)} y={cy - 14} width={18} height={8} rx={4} fill="#C0392B" />
          <path
            d={`M ${cx + side * (44)} ${cy - 16}
                C ${cx + side * (54)} ${cy - 24}
                  ${cx + side * (58)} ${cy - 14}
                  ${cx + side * (46)} ${cy - 10}`}
            fill="#E74C3C" stroke="#922B21" strokeWidth={1}
          />
          <path
            d={`M ${cx + side * (44)} ${cy - 6}
                C ${cx + side * (54)} ${cy + 2}
                  ${cx + side * (56)} ${cy - 8}
                  ${cx + side * (46)} ${cy - 10}`}
            fill="#E74C3C" stroke="#922B21" strokeWidth={1}
          />
        </g>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────
   Dining table scene
───────────────────────────────────────── */
function DiningScene({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Restaurant background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #1a0a00 0%, #3d1200 60%, #5c1f00 100%)' }} />

      {/* Ambient light from above */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 300, height: 300, top: -80, left: '50%', transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(255,180,50,0.18) 0%, transparent 70%)' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Table surface */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
        style={{ height: '52%', background: 'linear-gradient(180deg, #8B4513 0%, #5D2E0C 100%)',
          borderTop: '4px solid #A0522D' }}
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
      />

      {/* Table wood grain lines */}
      {[0.2, 0.4, 0.65, 0.85].map((t, i) => (
        <motion.div key={i}
          className="absolute pointer-events-none"
          style={{ bottom: `${t * 52}%`, left: '5%', right: '5%', height: 1,
            background: 'rgba(0,0,0,0.15)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        />
      ))}

      {/* Chopsticks */}
      <motion.div
        className="absolute z-10"
        style={{ bottom: '44%', right: '18%' }}
        initial={{ opacity: 0, rotate: -20, y: 30 }}
        animate={{ opacity: 1, rotate: -15, y: 0 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 150 }}
      >
        <div style={{ position: 'relative', width: 60, height: 8 }}>
          {[0, 5].map((offset) => (
            <div key={offset} style={{
              position: 'absolute', top: offset, left: 0,
              width: 110, height: 5, borderRadius: 3,
              background: 'linear-gradient(90deg, #8B4513, #D2691E)',
              transformOrigin: 'left center',
              transform: `rotate(${offset > 0 ? 8 : -8}deg)`,
            }} />
          ))}
        </div>
      </motion.div>

      {/* Soy sauce dish */}
      <motion.div
        className="absolute z-10"
        style={{ bottom: '44%', left: '16%' }}
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.7, type: 'spring' }}
      >
        <div style={{ width: 36, height: 20, borderRadius: '50%',
          background: 'linear-gradient(180deg, #1a1a2e 0%, #2d2d4e 100%)',
          border: '2px solid #3a3a5e', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 3, borderRadius: '50%',
            background: 'rgba(30,10,60,0.8)' }} />
        </div>
      </motion.div>

      {/* Lemon slice */}
      <motion.div
        className="absolute z-10 text-2xl"
        style={{ bottom: '46%', left: '22%' }}
        initial={{ opacity: 0, scale: 0, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        🍋
      </motion.div>

      {/* Plate */}
      <motion.div
        className="absolute z-10 flex items-center justify-center"
        style={{ bottom: '42%', left: '50%', transform: 'translateX(-50%)' }}
        initial={{ scale: 0, opacity: 0, y: 60 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.3 }}
      >
        {/* Plate shadow */}
        <div style={{ position: 'absolute', bottom: -8, width: 180, height: 20, borderRadius: '50%',
          background: 'rgba(0,0,0,0.4)', filter: 'blur(6px)' }} />
        {/* Plate rim */}
        <div style={{ width: 175, height: 110, borderRadius: '50%',
          background: 'linear-gradient(160deg, #f5f0e8 0%, #e8dfd0 100%)',
          border: '3px solid #d4c9b8', display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
          {/* Inner plate */}
          <div style={{ width: 145, height: 88, borderRadius: '50%',
            background: 'linear-gradient(160deg, #faf6ef 0%, #ede5d8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>

            {/* Garnish / parsley */}
            <div style={{ position: 'absolute', bottom: 8, right: 16, fontSize: 14 }}>🌿</div>

            {/* The cooked crab! */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: [-10, 5, -3, 0] }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 160, damping: 12 }}
            >
              <CookedCrab />
            </motion.div>
          </div>
        </div>

        {/* Steam particles above plate */}
        <div style={{ position: 'absolute', bottom: '85%', left: '30%', width: 80, height: 80 }}>
          {[20, 38, 56].map((x, i) => (
            <SteamParticle key={i} x={x} delay={i * 0.4} />
          ))}
        </div>
      </motion.div>

      {/* いただきます！ text */}
      <motion.div
        className="absolute z-20 font-black text-center"
        style={{ top: '14%' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.3, 0.95, 1.05, 1], opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="text-4xl text-yellow-200" style={{ textShadow: '0 0 20px #F6AD55, 0 2px 8px rgba(0,0,0,0.8)' }}>
          いただきます！
        </div>
        <div className="text-2xl mt-1">🍽️✨</div>
      </motion.div>

      {/* "完食" stamp */}
      <motion.div
        className="absolute z-20"
        style={{ top: '22%', right: '10%' }}
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: -12, opacity: 1 }}
        transition={{ delay: 2.8, type: 'spring', stiffness: 200 }}
      >
        <div style={{
          border: '3px solid #E53E3E', borderRadius: 8, padding: '2px 8px',
          color: '#E53E3E', fontWeight: 900, fontSize: 18, opacity: 0.85,
          textShadow: 'none', transform: 'skewX(-5deg)',
        }}>
          完食
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
interface Props {
  goal: Goal;
  onClose: () => void;
}

export function ShippingCelebration({ goal, onClose }: Props) {
  const [phase, setPhase] = useState<'celebrate' | 'dining'>('celebrate');
  const [confetti] = useState(() => generateConfetti());
  const { shipGoal } = useWorkoutStore();
  const bodyPart = BODY_PARTS.find((b) => b.id === goal.bodyPart);

  const handleShip = () => {
    // shipGoal はここで呼ばない → 呼ぶと pendingShipment が null になり
    // App.tsx 側でコンポーネントがアンマウントされてしまう
    setPhase('dining');
  };

  const handleDone = () => {
    // 食卓アニメーション完了後にまとめて処理
    shipGoal(goal.id);
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {phase === 'celebrate' ? (
        <motion.div
          key="celebrate"
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/85" />

          {/* Confetti */}
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute top-0 rounded-sm pointer-events-none"
              style={{ left: `${piece.x}%`, width: piece.size, height: piece.size, backgroundColor: piece.color }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{ y: '110vh', opacity: 0, rotate: piece.rotate }}
              transition={{ duration: 3 + Math.random(), delay: piece.delay, ease: 'easeIn' }}
            />
          ))}

          {/* Main panel */}
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-8 py-10 max-w-sm w-full mx-4"
            initial={{ scale: 0.3, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            {/* Explosion rings */}
            <motion.div className="absolute inset-0 rounded-full border-4 border-yellow-400"
              initial={{ scale: 0, opacity: 1 }} animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.1 }} />
            <motion.div className="absolute inset-0 rounded-full border-4 border-red-400"
              initial={{ scale: 0, opacity: 1 }} animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1.0, delay: 0.3 }} />

            <motion.div className="text-8xl mb-2"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 1.4, 1.1, 1.3], rotate: [0, 15, -10, 5] }}
              transition={{ duration: 0.8, delay: 0.3 }}>
              🦀
            </motion.div>

            <motion.div className="text-6xl font-black text-yellow-300 mb-1"
              style={{ textShadow: '0 0 20px #F6AD55, 0 0 40px #E53E3E' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 0.95, 1.05, 1], opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.6 }}>
              出荷！
            </motion.div>

            <motion.div className="text-xl font-bold text-white mb-1"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}>
              🎉 目標達成！ 🎉
            </motion.div>

            <motion.div className="text-base text-gray-300 mb-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}>
              <span className="text-orange-300 font-bold">{bodyPart?.label}</span>
              の目標を突破した！
              <br />
              <span className="text-yellow-300 font-bold">{bodyPart?.characterPart}</span>
              が爆発して出荷されました🚀
            </motion.div>

            <motion.button
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-black text-xl px-10 py-4 rounded-full"
              style={{ boxShadow: '0 0 20px rgba(229,62,62,0.6)' }}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleShip}>
              出荷する！🚢
            </motion.button>

            <motion.button
              className="mt-3 text-gray-400 text-sm underline"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              onClick={onClose}>
              後で確認する
            </motion.button>
          </motion.div>
        </motion.div>
      ) : (
        <DiningScene key="dining" onDone={handleDone} />
      )}
    </AnimatePresence>
  );
}
