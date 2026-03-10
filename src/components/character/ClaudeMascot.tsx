import { motion } from 'framer-motion';
import { getLevelInfo } from '../../utils/characterLevel';
import type { BodyPartStats } from '../../types';

interface Props {
  stats: BodyPartStats;
  size?: number;
}

export function ClaudeMascot({ stats, size = 280 }: Props) {
  const armsScale = getLevelInfo(stats.arms).scale;
  const legsScale = getLevelInfo(stats.legs).scale;
  const backScale = getLevelInfo(stats.back).scale;
  const chestScale = getLevelInfo(stats.chest).scale;
  const shouldersScale = getLevelInfo(stats.shoulders).scale;

  // Shell width/height based on chest+back
  const shellW = 80 + (chestScale - 1) * 30;
  const shellH = 60 + (backScale - 1) * 25;

  // Eye stalk height based on shoulders
  const eyeStalkH = 16 + (shouldersScale - 1) * 18;

  // Claw size based on arms
  const clawScale = armsScale;

  // Leg length/thickness based on legs
  const legLenMul = legsScale;

  const cx = size / 2;
  const bodyY = size * 0.52;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: 'visible' }}
    >
      {/* Glow filter */}
      <defs>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="shellGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F6AD55" />
          <stop offset="100%" stopColor="#C05621" />
        </radialGradient>
        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FC8181" />
          <stop offset="100%" stopColor="#9B2335" />
        </radialGradient>
      </defs>

      {/* ===== LEGS ===== */}
      <motion.g
        animate={{ scaleY: legLenMul, scaleX: 0.6 + legsScale * 0.4 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx}px ${bodyY + shellH / 2}px` }}
      >
        {/* Left legs */}
        {[0, 1, 2].map((i) => (
          <motion.g key={`ll${i}`}
            animate={{ rotate: -10 - i * 8 }}
            style={{ transformOrigin: `${cx - shellW / 2}px ${bodyY}px` }}
          >
            <line
              x1={cx - shellW / 2}
              y1={bodyY + 5 + i * 10}
              x2={cx - shellW / 2 - 28 - i * 6}
              y2={bodyY + 22 + i * 14}
              stroke="#C53030"
              strokeWidth={4 + legsScale * 1.5}
              strokeLinecap="round"
            />
            {/* foot */}
            <circle
              cx={cx - shellW / 2 - 28 - i * 6}
              cy={bodyY + 22 + i * 14}
              r={3 + legsScale}
              fill="#9B2C2C"
            />
          </motion.g>
        ))}
        {/* Right legs */}
        {[0, 1, 2].map((i) => (
          <motion.g key={`rl${i}`}
            animate={{ rotate: 10 + i * 8 }}
            style={{ transformOrigin: `${cx + shellW / 2}px ${bodyY}px` }}
          >
            <line
              x1={cx + shellW / 2}
              y1={bodyY + 5 + i * 10}
              x2={cx + shellW / 2 + 28 + i * 6}
              y2={bodyY + 22 + i * 14}
              stroke="#C53030"
              strokeWidth={4 + legsScale * 1.5}
              strokeLinecap="round"
            />
            <circle
              cx={cx + shellW / 2 + 28 + i * 6}
              cy={bodyY + 22 + i * 14}
              r={3 + legsScale}
              fill="#9B2C2C"
            />
          </motion.g>
        ))}
      </motion.g>

      {/* ===== SHELL (甲羅) - back ===== */}
      <motion.g
        animate={{ scaleX: backScale, scaleY: backScale * 0.85 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx}px ${bodyY}px` }}
      >
        <ellipse
          cx={cx}
          cy={bodyY}
          rx={shellW / 2 + 10}
          ry={shellH / 2 + 6}
          fill="url(#shellGrad)"
          filter="url(#glow)"
        />
        {/* Shell pattern lines */}
        {[0, 1, 2].map((i) => (
          <ellipse
            key={`sp${i}`}
            cx={cx}
            cy={bodyY - 2 + i * 4}
            rx={(shellW / 2 + 10) * (0.7 - i * 0.15)}
            ry={(shellH / 2 + 6) * (0.5 - i * 0.1)}
            fill="none"
            stroke="#F6AD55"
            strokeWidth={1.5}
            strokeOpacity={0.5}
          />
        ))}
      </motion.g>

      {/* ===== BODY (胴体) - chest ===== */}
      <motion.g
        animate={{ scaleX: chestScale, scaleY: 1 + (chestScale - 1) * 0.5 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx}px ${bodyY}px` }}
      >
        <ellipse cx={cx} cy={bodyY} rx={shellW / 2} ry={shellH / 2} fill="url(#bodyGrad)" />

        {/* Face */}
        {/* Eyes */}
        <circle cx={cx - 12} cy={bodyY - 6} r={6} fill="white" />
        <circle cx={cx + 12} cy={bodyY - 6} r={6} fill="white" />
        <circle cx={cx - 11} cy={bodyY - 5} r={3.5} fill="#1a1a2e" />
        <circle cx={cx + 11} cy={bodyY - 5} r={3.5} fill="#1a1a2e" />
        {/* Shine */}
        <circle cx={cx - 9} cy={bodyY - 7} r={1.2} fill="white" />
        <circle cx={cx + 13} cy={bodyY - 7} r={1.2} fill="white" />

        {/* Mouth */}
        <path
          d={`M ${cx - 8} ${bodyY + 8} Q ${cx} ${bodyY + 14} ${cx + 8} ${bodyY + 8}`}
          fill="none"
          stroke="#7B1919"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Blush */}
        <ellipse cx={cx - 18} cy={bodyY + 4} rx={5} ry={3} fill="#FC8181" fillOpacity={0.5} />
        <ellipse cx={cx + 18} cy={bodyY + 4} rx={5} ry={3} fill="#FC8181" fillOpacity={0.5} />
      </motion.g>

      {/* ===== EYE STALKS (目柄) - shoulders ===== */}
      <motion.g
        animate={{ scaleY: shouldersScale }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx}px ${bodyY - shellH / 2}px` }}
      >
        {/* Left stalk */}
        <rect
          x={cx - 18}
          y={bodyY - shellH / 2 - eyeStalkH}
          width={5}
          height={eyeStalkH}
          rx={2.5}
          fill="#9B2C2C"
        />
        <circle cx={cx - 15} cy={bodyY - shellH / 2 - eyeStalkH} r={6} fill="#1a1a2e" />
        <circle cx={cx - 13} cy={bodyY - shellH / 2 - eyeStalkH - 2} r={2} fill="white" />

        {/* Right stalk */}
        <rect
          x={cx + 13}
          y={bodyY - shellH / 2 - eyeStalkH}
          width={5}
          height={eyeStalkH}
          rx={2.5}
          fill="#9B2C2C"
        />
        <circle cx={cx + 16} cy={bodyY - shellH / 2 - eyeStalkH} r={6} fill="#1a1a2e" />
        <circle cx={cx + 18} cy={bodyY - shellH / 2 - eyeStalkH - 2} r={2} fill="white" />
      </motion.g>

      {/* ===== CLAWS (ハサミ) - arms ===== */}
      {/* Left claw */}
      <motion.g
        animate={{ scale: clawScale }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx - shellW / 2 - 4}px ${bodyY - 10}px` }}
      >
        {/* Arm */}
        <rect
          x={cx - shellW / 2 - 4 - 22}
          y={bodyY - 16}
          width={24}
          height={10}
          rx={5}
          fill="#C53030"
        />
        {/* Upper claw */}
        <path
          d={`M ${cx - shellW / 2 - 26} ${bodyY - 18}
              C ${cx - shellW / 2 - 40} ${bodyY - 28}
                ${cx - shellW / 2 - 46} ${bodyY - 16}
                ${cx - shellW / 2 - 30} ${bodyY - 12}`}
          fill="#E53E3E"
          stroke="#9B2C2C"
          strokeWidth={1}
        />
        {/* Lower claw */}
        <path
          d={`M ${cx - shellW / 2 - 26} ${bodyY - 6}
              C ${cx - shellW / 2 - 40} ${bodyY + 4}
                ${cx - shellW / 2 - 44} ${bodyY - 6}
                ${cx - shellW / 2 - 30} ${bodyY - 10}`}
          fill="#E53E3E"
          stroke="#9B2C2C"
          strokeWidth={1}
        />
        {/* Inner claw tips */}
        <path
          d={`M ${cx - shellW / 2 - 30} ${bodyY - 12}
              L ${cx - shellW / 2 - 38} ${bodyY - 15}
              L ${cx - shellW / 2 - 30} ${bodyY - 10}`}
          fill="#FC8181"
        />
      </motion.g>

      {/* Right claw */}
      <motion.g
        animate={{ scale: clawScale }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx + shellW / 2 + 4}px ${bodyY - 10}px` }}
      >
        <rect
          x={cx + shellW / 2 - 2}
          y={bodyY - 16}
          width={24}
          height={10}
          rx={5}
          fill="#C53030"
        />
        {/* Upper claw */}
        <path
          d={`M ${cx + shellW / 2 + 24} ${bodyY - 18}
              C ${cx + shellW / 2 + 38} ${bodyY - 28}
                ${cx + shellW / 2 + 44} ${bodyY - 16}
                ${cx + shellW / 2 + 28} ${bodyY - 12}`}
          fill="#E53E3E"
          stroke="#9B2C2C"
          strokeWidth={1}
        />
        {/* Lower claw */}
        <path
          d={`M ${cx + shellW / 2 + 24} ${bodyY - 6}
              C ${cx + shellW / 2 + 38} ${bodyY + 4}
                ${cx + shellW / 2 + 42} ${bodyY - 6}
                ${cx + shellW / 2 + 28} ${bodyY - 10}`}
          fill="#E53E3E"
          stroke="#9B2C2C"
          strokeWidth={1}
        />
        <path
          d={`M ${cx + shellW / 2 + 28} ${bodyY - 12}
              L ${cx + shellW / 2 + 36} ${bodyY - 15}
              L ${cx + shellW / 2 + 28} ${bodyY - 10}`}
          fill="#FC8181"
        />
      </motion.g>
    </svg>
  );
}
