
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, Calendar, DollarSign, ArrowUpRight, ArrowDownLeft, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useTickets } from '../context/TicketContext';

import { TicketDetailsModal } from './TicketDetailsModal';

export function FinancialHistoryModal({ onClose }) {
  const { tickets, removeTicket } = useTickets();
  const [filter, setFilter] = useState('today'); // today, week, all
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Confirmation States
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filter Logic
  const filteredTickets = tickets.filter(t => {
      const matchSearch = t.plate.includes(searchTerm.toUpperCase()) || 
                          t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchSearch) return false;

      const date = new Date(t.startTime);
      const today = new Date();
      
      if (filter === 'today') {
          return date.getDate() === today.getDate() && 
                 date.getMonth() === today.getMonth() &&
                 date.getFullYear() === today.getFullYear();
      }
      
      if (filter === 'week') {
          const diffTime = Math.abs(today - date);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
      }

      return true;
  }).sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // Newest first

  // Calc Totals based on Filtered View
  const totalRevenue = filteredTickets.reduce((acc, t) => acc + (t.price || 0), 0);
  const totalPaid = filteredTickets.filter(t => t.paid).reduce((acc, t) => acc + (t.price || 0), 0);
  const totalPending = filteredTickets.filter(t => !t.paid).reduce((acc, t) => acc + (t.price || 0), 0);
  
  return (
    <AnimatePresence>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-card border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 shrink-0">
          <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <DollarSign className="text-primary" /> Histórico Financeiro
              </h2>
              <p className="text-white/40 text-sm">Gerenciamento de receitas e fluxo.</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                <X className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-white/5 shrink-0">
             {/* Summary Cards */}
             <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                 <p className="text-primary/70 text-xs uppercase font-bold mb-1">Total Lançado</p>
                 <p className="text-2xl font-bold text-primary">R$ {totalRevenue.toFixed(2)}</p>
             </div>
             <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                 <p className="text-emerald-400/70 text-xs uppercase font-bold mb-1 flex items-center gap-1"><ArrowDownLeft size={12}/> Recebido (Pago)</p>
                 <p className="text-2xl font-bold text-emerald-400">R$ {totalPaid.toFixed(2)}</p>
             </div>
             <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                 <p className="text-amber-400/70 text-xs uppercase font-bold mb-1 flex items-center gap-1"><ArrowUpRight size={12}/> Pendente</p>
                 <p className="text-2xl font-bold text-amber-400">R$ {totalPending.toFixed(2)}</p>
             </div>
        </div>
        
        {/* Filters bar */}
        <div className="px-6 py-4 flex gap-4 items-center border-b border-white/5 shrink-0">
             <div className="flex bg-white/5 rounded-lg p-1">
                 <button onClick={() => setFilter('today')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'today' ? 'bg-primary text-white shadow-lg' : 'text-white/50 hover:text-white'}`}>Hoje</button>
                 <button onClick={() => setFilter('week')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'week' ? 'bg-primary text-white shadow-lg' : 'text-white/50 hover:text-white'}`}>7 Dias</button>
                 <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-primary text-white shadow-lg' : 'text-white/50 hover:text-white'}`}>Tudo</button>
             </div>
             <div className="flex-1 relative">
                 <Search className="absolute left-3 top-2.5 text-white/20 w-4 h-4" />
                 <input 
                    placeholder="Buscar placa, cliente..." 
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
             </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {filteredTickets.length > 0 ? (
                filteredTickets.map(ticket => (
                    <div 
                        key={ticket.id} 
                        onClick={() => setSelectedTicket(ticket)}
                        className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 rounded-xl transition-all cursor-pointer relative"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-2 h-12 rounded-full ${
                                ticket.status === 'ready' ? 'bg-emerald-500' : 
                                ticket.status === 'washing' ? 'bg-cyan-500' : 'bg-amber-500'
                            }`} />
                            <div>
                                <h4 className="font-bold text-white text-lg">{ticket.plate} <span className="text-base font-normal text-white/50">• {ticket.model}</span></h4>
                                <div className="flex items-center gap-2 text-xs text-white/40">
                                    <Calendar size={12} />
                                    <span>{new Date(ticket.startTime).toLocaleString('pt-BR')}</span>
                                    <span>•</span>
                                    <span>{ticket.customer}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <span className="block font-medium text-white/80">{ticket.service}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                                    ticket.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                    ticket.status === 'washing' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 
                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>
                                    {ticket.status === 'ready' ? 'Finalizado' : ticket.status === 'washing' ? 'Lavando' : 'Aguardando'}
                                </span>
                            </div>
                            
                            <div className="text-right w-24">
                                <span className="block text-xl font-bold text-white">R$ {ticket.price?.toFixed(2)}</span>
                                {ticket.paid ? (
                                    <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">PAGO <CheckCircle2 size={10} /></span>
                                ) : (
                                    <span className="text-[10px] text-amber-400 font-bold flex items-center justify-end gap-1">PENDENTE <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /></span>
                                )}
                            </div>

                            {/* Delete Action (Protected from row click) */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setItemToDelete(ticket);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 text-white/20 hover:text-red-400 rounded-lg transition-all"
                                title="Excluir Registro"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 text-white/20">
                    <p>Nenhum registro encontrado no período.</p>
                </div>
            )}
        </div>
        
        {/* Remove Confirmation Modal */}
        <AnimatePresence>
            {itemToDelete && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-8">
                     <motion.div 
                        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                        className="bg-card border border-white/10 p-6 rounded-2xl shadow-xl max-w-sm w-full text-center"
                     >
                         <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                             <Trash2 size={32} />
                         </div>
                         <h3 className="text-xl font-bold text-white mb-2">Excluir Registro?</h3>
                         <p className="text-white/60 text-sm mb-6">
                            Tem certeza que deseja remover o veículo <strong>{itemToDelete.plate}</strong> do histórico? Essa ação não pode ser desfeita.
                         </p>
                         <div className="flex gap-3">
                             <button onClick={() => setItemToDelete(null)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">Cancelar</button>
                             <button 
                                onClick={() => {
                                    removeTicket(itemToDelete.id);
                                    setItemToDelete(null);
                                }} 
                                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors"
                             >
                                 Excluir
                             </button>
                         </div>
                     </motion.div>
                </div>
            )}
        </AnimatePresence>
      </motion.div>

      {/* Detail Modal for Selected History Item */}
      {selectedTicket && (
          <TicketDetailsModal 
              ticket={selectedTicket} 
              onClose={() => setSelectedTicket(null)} 
          />
      )}
    </div>
    </AnimatePresence>
  );
}
