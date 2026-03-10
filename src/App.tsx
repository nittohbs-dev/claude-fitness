import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigation } from './components/layout/Navigation';
import { ShippingCelebration } from './components/character/ShippingCelebration';
import { Home } from './pages/Home';
import { WorkoutLog } from './pages/WorkoutLog';
import { Calendar } from './pages/Calendar';
import { Goals } from './pages/Goals';
import { Menus } from './pages/Menus';
import { useWorkoutStore } from './store/workoutStore';

type Page = 'home' | 'log' | 'calendar' | 'goals' | 'menus';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { pendingShipment, clearPendingShipment } = useWorkoutStore();

  const navigate = (page: string) => setCurrentPage(page as Page);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.15 }}
          className="max-w-md mx-auto"
        >
          {currentPage === 'home' && <Home onNavigate={navigate} />}
          {currentPage === 'log' && <WorkoutLog />}
          {currentPage === 'calendar' && <Calendar />}
          {currentPage === 'goals' && <Goals />}
          {currentPage === 'menus' && <Menus />}
        </motion.div>
      </AnimatePresence>

      <Navigation current={currentPage} onNavigate={navigate} />

      {/* 出荷演出オーバーレイ */}
      <AnimatePresence>
        {pendingShipment && (
          <ShippingCelebration
            goal={pendingShipment}
            onClose={clearPendingShipment}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
