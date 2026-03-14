
import { X, MessageCircle, Trash2, ArrowRightCircle, Clock, CheckCircle2, DollarSign, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTickets } from '../context/TicketContext';
import { PixPaymentModal } from './PixPaymentModal';
import { useState } from 'react';

export function TicketDetailsModal({ ticket, onClose }) {
  const { updateTicketStatus, removeTicket, toggleTicketPayment } = useTickets();
  const [showPixModal, setShowPixModal] = useState(false);

  const handleStatusChange = (newStatus) => {
    updateTicketStatus(ticket.id, newStatus);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja remover este veículo?')) {
        removeTicket(ticket.id);
        onClose();
    }
  };

  const handleWhatsApp = () => {
    const text = `Olá ${ticket.customer}, seu ${ticket.model} (${ticket.plate}) está pronto!`;
    window.open(`https://wa.me/${ticket.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/50 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-card/95 backdrop-blur-xl border-l border-white/10 h-full w-full max-w-md shadow-2xl relative z-10 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{ticket.plate}</h2>
                <p className="text-white/50 text-sm mt-1">{ticket.model}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Status Indicator */}
            <div className="flex flex-col gap-2">
                <span className="text-sm text-white/50 font-medium uppercase tracking-wider">Status Atual</span>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
                        ticket.status === 'pending' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        ticket.status === 'washing' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                        {ticket.status === 'pending' ? 'Aguardando' : ticket.status === 'washing' ? 'Em Lavagem' : 'Pronto'}
                    </span>
                    <span className="text-white/30 text-xs flex items-center gap-1">
                        <Clock size={12} /> 
                        Chegou às {ticket.startTime ? new Date(ticket.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                    </span>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs text-white/40 block mb-1">Cliente</span>
                    <span className="text-white font-medium block">{ticket.customer}</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs text-white/40 block mb-1">Telefone</span>
                    <span className="text-white font-medium block">{ticket.phone || '-'}</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 col-span-2">
                    <div className="flex justify-between items-center mb-1">
                         <span className="text-xs text-white/40">Serviço & Pagamento</span>
                         {ticket.paid ? (
                             <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20 flex items-center gap-1">
                                 PAGO <CheckCircle2 size={10} />
                             </span>
                         ) : (
                             <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">
                                 PENDENTE
                             </span>
                         )}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{ticket.service}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-primary font-bold text-lg">R$ {ticket.price ? ticket.price.toFixed(2) : '0.00'}</span>
                            <button 
                                onClick={() => toggleTicketPayment(ticket.id)}
                                className={`p-2 rounded-lg transition-colors ${ticket.paid ? 'bg-white/5 text-white/30 hover:bg-red-500/20 hover:text-red-400' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                                title={ticket.paid ? "Marcar como Pendente" : "Marcar como Pago"}
                            >
                                <DollarSign size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                <span className="text-sm text-white/50 font-medium uppercase tracking-wider">Ações Rápidas</span>
                
            {ticket.status !== 'ready' && (
                     <button 
                        onClick={() => handleStatusChange(ticket.status === 'pending' ? 'washing' : 'ready')}
                        className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center gap-3 transition-colors group"
                     >
                        <ArrowRightCircle className="text-primary group-hover:scale-110 transition-transform" />
                        Mover para {ticket.status === 'pending' ? 'Em Lavagem' : 'Pronto'}
                    </button>
            )}

            <button 
                onClick={() => setShowPixModal(true)}
                className="w-full py-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 flex items-center justify-center gap-3 transition-colors"
            >
                <QrCode size={20} />
                Gerar Cobrança Pix
            </button>

            {ticket.phone && (
                <button 
                    onClick={handleWhatsApp}
                    className="w-full py-4 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 flex items-center justify-center gap-3 transition-colors"
                >
                    <MessageCircle size={20} />
                    Chamar no WhatsApp
                </button>
            )}
            </div>
          </div>

          <div className="p-6 border-t border-white/10 bg-white/5">
             <button 
                onClick={handleDelete}
                className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center gap-2 transition-colors text-sm font-medium"
             >
                <Trash2 size={16} />
                Cancelar/Excluir Atendimento
             </button>
          </div>
        </motion.div>
      </div>
      
      <PixPaymentModal 
        isOpen={showPixModal} 
        onClose={() => setShowPixModal(false)} 
        ticket={ticket} 
        onPaymentSuccess={() => {
            if (!ticket.paid) {
                toggleTicketPayment(ticket.id);
            }
        }}
      />
    </AnimatePresence>
  );
}
