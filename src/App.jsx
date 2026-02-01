import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import PortfolioView from './views/PortfolioView';
import SqlView from './views/SqlView';
import NoSqlView from './views/NoSqlView';
import './App.css';

function App() {
  const [view, setView] = useState('portfolio');

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 selection:bg-blue-500/30 font-sans">
      <Navbar currentView={view} setView={setView} />

      <main className="relative z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            {view === 'portfolio' && <PortfolioView />}
            {view === 'sql' && <SqlView />}
            {view === 'nosql' && <NoSqlView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Chatbot />
    </div>
  )
}

export default App;
