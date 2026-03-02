
import { Clock, CheckCircle2, Zap, MoreVertical, Edit, Trash, ArrowRight, DollarSign } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { TicketDetailsModal } from './TicketDetailsModal';
import clsx from 'clsx';

const statusConfig = {
  pending: {
    label: 'Aguardando',
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    badge: 'bg-amber-500/20 text-amber-300',
    barColor: 'bg-amber-400',
    glow: 'shadow-[0_0_15px_-3px_rgba(251,191,36,0.2)]'
  },
  washing: {
    label: 'Em Lavagem',
    icon: Zap,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    badge: 'bg-cyan-500/20 text-cyan-300',
    barColor: 'bg-cyan-400',
    glow: 'shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)]'
  },
  ready: {
    label: 'Pronto',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/20 text-emerald-300',
    barColor: 'bg-emerald-400',
    glow: 'shadow-[0_0_15px_-3px_rgba(52,211,153,0.2)]'
  }
};

export function KanbanColumn({ status }) {
  const { tickets, updateTicketStatus } = useTickets();
  const config = statusConfig[status];
  const Icon = config.icon;
  
  const columnTickets = tickets.filter(t => t.status === status);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    const ticketId = e.dataTransfer.getData('ticketId');
    if (ticketId) {
      updateTicketStatus(ticketId, status);
    }
  };

  return (
    <div 
      className={clsx(
        "p-5 rounded-2xl border backdrop-blur-md flex flex-col h-full transition-all duration-300", 
        config.bg, 
        config.border
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className={clsx("font-bold text-lg flex items-center gap-2", config.color)}>
          <div className={clsx("p-1.5 rounded-lg bg-white/5", config.glow)}>
             <Icon className="w-5 h-5" />
          </div>
          {config.label}
        </h2>
        <span className={clsx("text-xs font-bold px-3 py-1 rounded-full border border-white/5", config.badge)}>
          {columnTickets.length}
        </span>
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto min-h-[150px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1">
        <AnimatePresence>
          {columnTickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} config={config} />
          ))}
        </AnimatePresence>
        
        {columnTickets.length === 0 && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-10 opacity-30 text-sm italic"
            >
             Arraste veículos aqui
            </motion.div>
        )}
      </div>
    </div>
  );
}

function TicketCard({ ticket, config }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { updateTicketStatus, removeTicket } = useTickets();

  const handleDragStart = (e) => {
    e.dataTransfer.setData('ticketId', ticket.id);
  };

  const handleMenuAction = (e, action) => {
    e.stopPropagation();
    setShowMenu(false);
    
    if (action === 'delete') {
        if(confirm('Remover veículo?')) removeTicket(ticket.id);
    } else if (action === 'move_next') {
        const next = ticket.status === 'pending' ? 'washing' : 'ready';
        updateTicketStatus(ticket.id, next);
    }
  };

  return (
    <>
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      draggable 
      onDragStart={handleDragStart}
      onClick={() => setShowDetails(true)}
      className="group bg-card/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg hover:shadow-xl hover:bg-card/60 transition-all cursor-pointer active:cursor-grabbing relative overflow-visible"
    >
      {/* Side Color Bar */}
      <div className={clsx("absolute left-0 top-0 bottom-0 w-1", config.barColor)} />

      <div className="flex justify-between items-start mb-2 pl-2">
        <div>
            <span className="block font-bold text-xl tracking-tight text-white mb-0.5">{ticket.plate}</span>
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{ticket.model}</span>
        </div>
        
        {/* Actions Menu Trigger */}
        <div className="relative">
            <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="text-white/20 hover:text-white/80 p-1 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-white/10"
            >
                <MoreVertical className="w-4 h-4" />
            </button>
            
            {/* Dropdown Menu */}
            <AnimatePresence>
                {showMenu && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute right-0 top-6 w-32 bg-slate-800 border border-white/10 shadow-xl rounded-lg z-50 overflow-hidden"
                    >
                        {ticket.status !== 'ready' && (
                            <button 
                                onClick={(e) => handleMenuAction(e, 'move_next')}
                                className="w-full text-left px-3 py-2 text-xs text-white hover:bg-white/10 flex items-center gap-2"
                            >
                                <ArrowRight size={12} /> Avançar
                            </button>
                        )}
                        <button 
                            onClick={(e) => handleMenuAction(e, 'delete')}
                            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-white/10 flex items-center gap-2"
                        >
                            <Trash size={12} /> Excluir
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-white/70 mb-4 pl-2">
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs">
            {ticket.service}
        </span>
      </div>

      <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3 mt-1 pl-2">
        <div className="flex items-center gap-2">
            <span className={clsx("font-bold text-base", ticket.paid ? "text-green-400" : config.color)}>
                R$ {ticket.price.toFixed(2)}
            </span>
            {ticket.paid && (
                <span className="bg-green-500/20 text-green-400 border border-green-500/20 p-0.5 rounded-full" title="Pago">
                    <DollarSign size={12} />
                </span>
            )}
        </div>
        <span className="text-white/30 text-xs font-mono">
           {new Date(ticket.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      {/* Glow Effect on Hover */}
      <div className={clsx("absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-500 rounded-xl", config.barColor)} />
    </motion.div>

    {showDetails && (
        <TicketDetailsModal ticket={ticket} onClose={() => setShowDetails(false)} />
    )}
    </>
  );
}
