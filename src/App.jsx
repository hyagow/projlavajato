
import { useState } from 'react';
import { Plus, LayoutDashboard, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { TicketProvider } from './context/TicketContext';
import { KanbanColumn } from './components/KanbanBoard';
import { NewTicketModal } from './components/NewTicketModal';
import { StatisticsDashboard } from './components/StatisticsDashboard';
import { SettingsModal } from './components/SettingsModal';
import { FinancialHistoryModal } from './components/FinancialHistoryModal';
import { LandingPage } from './components/LandingPage';
import { ClientPortal } from './components/ClientPortal';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'staff', 'client'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Routing Logic
  if (currentView === 'landing') {
      return <LandingPage onSelectRole={setCurrentView} />;
  }

  if (currentView === 'client') {
      return <ClientPortal onBack={() => setCurrentView('landing')} />;
  }

  // Staff View
  return (
    <div className="min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navbar / Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-white/5 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-cover rounded-full drop-shadow-lg border border-white/10" />
          <h1 className="text-xl font-bold tracking-tight text-white hidden md:block">
            Lava Jato <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Tá Novo</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
           {/* Mobile Title Replacement */}
           <span className="md:hidden text-sm font-bold text-white/50">Painel Staff</span>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-white/10 mx-2" />

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] px-4 md:px-5 py-2 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg text-sm md:text-base"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline">Nova Entrada</span>
            <span className="md:hidden">Novo</span>
          </motion.button>
          
          <button 
            onClick={() => setCurrentView('landing')}
            className="ml-2 p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-6 max-w-[1600px] mx-auto h-screen flex flex-col">
          
        {/* Statistics Section */}
        <StatisticsDashboard onOpenHistory={() => setIsHistoryOpen(true)} />

        {/* Kanban Section */}
        <div className="flex-1 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-x-auto pb-4 snap-x snap-mandatory">
            <div className="snap-center h-full min-w-[300px]">
                <KanbanColumn status="pending" />
            </div>
            <div className="snap-center h-full min-w-[300px]">
                <KanbanColumn status="washing" />
            </div>
            <div className="snap-center h-full min-w-[300px]">
                <KanbanColumn status="ready" />
            </div>
          </div>
        </div>
      </main>
      
      {isModalOpen && <NewTicketModal onClose={() => setIsModalOpen(false)} />}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isHistoryOpen && <FinancialHistoryModal onClose={() => setIsHistoryOpen(false)} />}
    </div>
  );
}

function App() {
  return (
    <TicketProvider>
      <AppContent />
    </TicketProvider>
  );
}

export default App;
