
import { useState } from 'react';
import { X, User, Car as CarIcon, MessageCircle } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICES = [
  { id: 'simples', name: 'Lavagem Simples', price: 40 },
  { id: 'completa', name: 'Lavagem Completa', price: 70 },
  { id: 'cera', name: 'Lavagem + Cera', price: 90 },
  { id: 'polimento', name: 'Polimento Técnico', price: 300 },
  { id: 'higienizacao', name: 'Higienização Interna', price: 150 },
];

export function NewTicketModal({ onClose }) {
  const { addTicket } = useTickets();
  const [formData, setFormData] = useState({
    plate: '',
    model: '',
    customer: '',
    phone: '',
    serviceId: 'simples'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSmartFill = () => {
    // Mock functionality for "Smart Read"
    setFormData(prev => ({
        ...prev,
        plate: 'OVR-9988',
        model: 'Toyota Hilux'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const service = SERVICES.find(s => s.id === formData.serviceId);
    
    addTicket({
      plate: formData.plate.toUpperCase(),
      model: formData.model,
      customer: formData.customer,
      phone: formData.phone,
      service: service.name,
      price: service.price,
      status: 'pending'
    });
    
    // Send Customer Notification
    if (formData.phone) {
        // Mock sending WhatsApp (in real app, would call API/Link)
        console.log(`Sending WhatsApp to ${formData.phone}: Hello ${formData.customer}, we started!`);
    }

    onClose();
  };

  const selectedService = SERVICES.find(s => s.id === formData.serviceId);

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
        className="bg-card border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white">Nova Entrada</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Placa</label>
              <div className="relative">
                <input
                    name="plate"
                    required
                    maxLength={8}
                    placeholder="ABC-1234"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-secondary border border-white/5 text-white placeholder-white/20 focus:ring-2 focus:ring-primary/50 outline-none uppercase transition-all"
                    value={formData.plate}
                    onChange={handleChange}
                />
                <button type="button" onClick={handleSmartFill} className="absolute right-2 top-2 text-primary hover:text-primary/80" title="Auto Preenchimento (Teste)">
                    <CarIcon size={18} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Modelo</label>
              <input
                name="model"
                required
                placeholder="Ex: Fiat Uno"
                className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-white/5 text-white placeholder-white/20 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                value={formData.model}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Cliente</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 text-white/30 w-4 h-4" />
                    <input
                        name="customer"
                        required
                        placeholder="Nome"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-white/5 text-white placeholder-white/20 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        value={formData.customer}
                        onChange={handleChange}
                    />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-white/70 mb-1">WhatsApp</label>
                <div className="relative">
                    <MessageCircle className="absolute left-3 top-3 text-white/30 w-4 h-4" />
                    <input
                        name="phone"
                        placeholder="(11) 9..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-white/5 text-white placeholder-white/20 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Serviço</label>
            <select
              name="serviceId"
              className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-white/5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none"
              value={formData.serviceId}
              onChange={handleChange}
            >
              {SERVICES.map(s => (
                <option key={s.id} value={s.id} className="bg-secondary text-white">{s.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-white/10">
            <div className="text-sm text-white/50">
              Valor estimado:
            </div>
            <div className="text-2xl font-bold text-primary">
              R$ {selectedService?.price.toFixed(2)}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            Confirmar Entrada
          </motion.button>
        </form>
      </motion.div>
    </div>
    </AnimatePresence>
  );
}
