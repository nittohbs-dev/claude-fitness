import { motion } from 'framer-motion';
import { Home, PenLine, CalendarDays, Target, UtensilsCrossed } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'ホーム', icon: Home },
  { id: 'log', label: '記録', icon: PenLine },
  { id: 'calendar', label: 'カレンダー', icon: CalendarDays },
  { id: 'goals', label: '目標', icon: Target },
  { id: 'menus', label: 'メニュー', icon: UtensilsCrossed },
];

interface Props {
  current: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ current, onNavigate }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur border-t border-gray-800 z-40">
      <div className="flex max-w-md mx-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = current === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex-1 flex flex-col items-center py-3 gap-0.5 relative"
            >
              {isActive && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-500 rounded-full"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={isActive ? 'text-red-400' : 'text-gray-600'}
              />
              <span className={`text-xs ${isActive ? 'text-red-400 font-bold' : 'text-gray-600'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
