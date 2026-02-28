
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Clock, CheckCircle2, Search, Plus, User, Phone, QrCode } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { PixPaymentModal } from './PixPaymentModal';

// Helper to get price
const getPrice = (serviceName) => {
    // In a real app we would read this from the same context as SettingsModal
    // For now we will read from localStorage as a simple bridge
    try {
        const savedPrices = localStorage.getItem('lavajato_prices');
        if (savedPrices) {
            const prices = JSON.parse(savedPrices);
            // key mapping: 'Lavagem Simples' -> 'simples'
            const key = serviceName.toLowerCase().includes('simples') ? 'simples' :
                        serviceName.toLowerCase().includes('completa') ? 'completa' :
                        serviceName.toLowerCase().includes('polimento') ? 'polimento' :
                        serviceName.toLowerCase().includes('cera') ? 'cera' : 'simples';
            return prices[key] || 0;
        }
    } catch (e) {
        console.error("Error reading prices", e);
    }
    
    // Fallback defaults if no settings saved
    if (serviceName === 'Lavagem Simples') return 40;
    if (serviceName === 'Lavagem Completa') return 70;
    if (serviceName === 'Polimento') return 300;
    return 50;
};

export function ClientPortal({ onBack }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { tickets, addTicket, toggleTicketPayment } = useTickets();
  const [activeTab, setActiveTab] = useState('status'); // 'status' or 'new'
  const [pixTicket, setPixTicket] = useState(null); // Ticket selected for Pix payment

  // Form State for new request
  const [newRequest, setNewRequest] = useState({ plate: '', model: '', service: 'Lavagem Simples', customerName: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Normalize phone: remove non-digits
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // Validation 1: Check format (at least 10 digits - DDD + Number)
    if (cleanPhone.length < 10) {
        alert("Por favor, digite um número de celular válido com DDD (Ex: 11999999999).");
        return;
    }

    // Validation 2: Check existence (Optional, but requested)
    const hasHistory = tickets.some(t => t.phone && t.phone.replace(/\D/g, '') === cleanPhone);

    if (!hasHistory) {
        // User not found flow
        if (confirm("Não encontramos atendimentos anteriores para este número. Deseja realizar um novo pedido?")) {
             setIsLoggedIn(true);
             setActiveTab('new'); // Force to new request tab
        }
    } else {
        // User found
        setIsLoggedIn(true);
        setActiveTab('status'); // Default to status
    }
  };

  const handleNewRequest = (e) => {
    e.preventDefault();
    if (!newRequest.customerName) {
        alert("Por favor, informe seu nome.");
        return;
    }

    const price = getPrice(newRequest.service);

    addTicket({
        plate: newRequest.plate.toUpperCase(),
        model: newRequest.model,
        customer: newRequest.customerName, // Name for display
        phone: phoneNumber, // Unique ID from Login
        service: newRequest.service,
        price: price, // Now using real price
        status: 'pending'
    });
    setNewRequest({ plate: '', model: '', service: 'Lavagem Simples', customerName: '' });
    setActiveTab('status');
  };

  // Filter ONLY by phone number (Unique ID logic)
  const myTickets = tickets.filter(t => t.phone && t.phone.replace(/\D/g, '') === phoneNumber.replace(/\D/g, ''));

  if (!isLoggedIn) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
             
             {/* Background Blob */}
             <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />

             <div className="w-full max-w-sm space-y-8 relative z-10">
                <div className="text-center">
                    <img src="/logo.png" alt="Logo" className="w-40 h-40 object-cover rounded-full mx-auto mb-6 drop-shadow-2xl border-4 border-white/10" />
                    <h2 className="text-3xl font-bold text-white tracking-tight">Área do Cliente</h2>
                    <p className="text-white/50 mt-2">Acesse com seu celular para ver seus veículos.</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div>
                        <label className="text-sm font-medium text-white/70 mb-1 block">Seu WhatsApp / Celular</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-white/30 w-5 h-5" />
                            <input 
                                type="tel" 
                                placeholder="(DD) 99999-9999"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-white/10 text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder-white/20"
                                value={phoneNumber}
                                onChange={(e) => {
                                    // Simple mask (DD) 9XXXX-XXXX
                                    let v = e.target.value.replace(/\D/g, '');
                                    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
                                    v = v.replace(/(\d)(\d{4})$/, '$1-$2');
                                    setPhoneNumber(v);
                                }}
                                maxLength={15}
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                        Entrar
                    </button>
                    <button type="button" onClick={onBack} className="w-full text-sm text-white/40 hover:text-white transition-colors pt-2">Voltar ao Início</button>
                </form>
             </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="p-6 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center">
             <div>
                <h1 className="text-xl font-bold text-white">Meus Veículos</h1>
                <p className="text-xs text-white/40 font-mono">{phoneNumber}</p>
             </div>
             <button onClick={() => setIsLoggedIn(false)} className="text-xs text-white/40 hover:text-white border border-white/10 px-3 py-1.5 rounded-full transition-colors">Sair</button>
        </header>

        <main className="p-6 space-y-6">
             {/* Tabs */}
             <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                 <button 
                    onClick={() => setActiveTab('status')}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'status' ? 'bg-primary text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                 >
                    Acompanhar
                 </button>
                 <button 
                    onClick={() => setActiveTab('new')}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'new' ? 'bg-primary text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                 >
                    Novo Pedido
                 </button>
             </div>

             {activeTab === 'status' ? (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                 >
                     {myTickets.length === 0 ? (
                         <div className="text-center py-12 text-white/30 flex flex-col items-center">
                             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Car size={32} className="opacity-50" />
                             </div>
                             <p>Nenhum veículo encontrado para este número.</p>
                             <button onClick={() => setActiveTab('new')} className="text-primary text-sm font-bold mt-2">Fazer pedido agora</button>
                         </div>
                     ) : (
                         myTickets.map(ticket => (
                             <div key={ticket.id} className="bg-card border border-white/10 p-5 rounded-2xl relative overflow-hidden group">
                                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                      ticket.status === 'pending' ? 'bg-amber-500' : 
                                      ticket.status === 'washing' ? 'bg-cyan-500' : 'bg-emerald-500' // green
                                  }`} />
                                  
                                  <div className="flex justify-between items-start mb-2 pl-3">
                                     <div>
                                        <span className="text-xl font-bold text-white tracking-tight">{ticket.plate}</span>
                                        <p className="text-white/50 text-xs uppercase font-medium mt-0.5">{ticket.model}</p>
                                     </div>
                                     <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${
                                          ticket.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                          ticket.status === 'washing' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                     }`}>
                                         {ticket.status === 'pending' ? 'Na Fila' : ticket.status === 'washing' ? 'Lavando' : 'Pronto'}
                                     </span>
                                  </div>
                                  
                                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center pl-3">
                                     <span className="text-sm text-white/60 bg-white/5 px-2 py-1 rounded">{ticket.service}</span>
                                     <div className="flex gap-2 items-center">
                                         {ticket.price > 0 && <span className="text-white/40 text-xs">R$ {ticket.price.toFixed(2)}</span>}
                                         {ticket.paid ? (
                                             <span className="flex items-center gap-1 text-green-400 text-[10px] font-bold bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                                 PAGO <CheckCircle2 size={10} />
                                             </span>
                                         ) : (
                                             <button 
                                                 onClick={() => setPixTicket(ticket)}
                                                 className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/20 transition-colors"
                                             >
                                                 PAGAR COM PIX <QrCode size={10} />
                                             </button>
                                         )}
                                         {ticket.status === 'ready' && (
                                             <span className="flex items-center gap-1 text-emerald-400 text-sm font-bold animate-pulse">
                                                 <CheckCircle2 size={16} /> Pode retirar
                                             </span>
                                         )}
                                     </div>
                                  </div>
                             </div>
                         ))
                     )}
                 </motion.div>
             ) : (
                <motion.form 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleNewRequest} 
                    className="space-y-5"
                >
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6">
                        <p className="text-sm text-blue-200">
                            Olá! Vamos agendar sua lavagem. Preencha os dados abaixo e seu veículo entrará na fila imediatamente.
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-white/70 block mb-1.5">Seu Nome</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-white/30 w-5 h-5" />
                            <input 
                                required 
                                placeholder="Como prefere ser chamado?"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-white/10 text-white focus:ring-2 focus:ring-primary outline-none"
                                value={newRequest.customerName}
                                onChange={e => setNewRequest({...newRequest, customerName: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-white/70 block mb-1.5">Placa</label>
                            <input 
                                required 
                                maxLength={8}
                                placeholder="ABC-1234"
                                className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white uppercase focus:ring-2 focus:ring-primary outline-none"
                                value={newRequest.plate}
                                onChange={e => setNewRequest({...newRequest, plate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/70 block mb-1.5">Modelo</label>
                            <input 
                                required 
                                placeholder="Ex: Onix"
                                className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white focus:ring-2 focus:ring-primary outline-none"
                                value={newRequest.model}
                                onChange={e => setNewRequest({...newRequest, model: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-white/70 block mb-1.5">Serviço</label>
                        <select 
                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white focus:ring-2 focus:ring-primary outline-none appearance-none"
                            value={newRequest.service}
                            onChange={e => setNewRequest({...newRequest, service: e.target.value})}
                        >
                            <option className="bg-slate-800" value="Lavagem Simples">Lavagem Simples - R$ {getPrice('Lavagem Simples')}</option>
                            <option className="bg-slate-800" value="Lavagem Completa">Lavagem Completa - R$ {getPrice('Lavagem Completa')}</option>
                            <option className="bg-slate-800" value="Lavagem + Cera">Lavagem + Cera - R$ {getPrice('Lavagem Cera')}</option>
                            <option className="bg-slate-800" value="Polimento">Polimento - R$ {getPrice('Polimento')}</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                        <Plus size={20} />
                        Confirmar Solicitação
                    </button>
                </motion.form>
             )}

             {/* Pix Modal for Client */}
             <PixPaymentModal 
                isOpen={!!pixTicket} 
                onClose={() => setPixTicket(null)} 
                ticket={pixTicket} 
                onPaymentSuccess={() => {
                   if (pixTicket && !pixTicket.paid) {
                       toggleTicketPayment(pixTicket.id);
                   }
                }}
             />
        </main>
    </div>
  );
}
