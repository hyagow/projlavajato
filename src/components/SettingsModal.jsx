
import { X, Save, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function SettingsModal({ onClose }) {
  // In a real app, these would come from a Context or Store
  const [prices, setPrices] = useState({
    simples: 40,
    completa: 70,
    cera: 90,
    polimento: 300,
    higienizacao: 150
  });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [pixKey, setPixKey] = useState(() => localStorage.getItem('lavajato_pix_key') || '');

  const handlePriceChange = (key, value) => {
    setPrices(prev => ({ ...prev, [key]: Number(value) }));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('lavajato_prices', JSON.stringify(prices));
    localStorage.setItem('lavajato_pix_key', pixKey);
    onClose();
  };

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
            <h2 className="text-xl font-bold text-white">Configurações</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Tabela de Preços */}
            <div>
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Tabela de Preços Base</h3>
              <div className="space-y-3">
                {Object.entries(prices).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between group">
                    <label className="text-white/70 capitalize">{key.replace('_', ' ')}</label>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">R$</span>
                       <input 
                         type="number"
                         value={value}
                         onChange={(e) => handlePriceChange(key, e.target.value)}
                         className="w-24 pl-8 pr-3 py-1.5 rounded-lg bg-secondary border border-white/5 text-white text-right focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                       />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aparência */}
            <div className="pt-6 border-t border-white/10">
               <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Aparência</h3>
               <div className="flex items-center justify-between">
                 <span className="text-white/70">Modo Escuro (Dark Neon)</span>
                 <button 
                   onClick={() => setIsDarkMode(!isDarkMode)}
                   className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-primary' : 'bg-slate-600'}`}
                 >
                   <motion.div 
                     layout
                     className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center p-1"
                     animate={{ x: isDarkMode ? 24 : 0 }}
                   >
                     {isDarkMode ? <Moon size={12} className="text-primary" /> : <Sun size={12} className="text-slate-600" />}
                   </motion.div>
                 </button>
               </div>
            </div>

            {/* Pagamento Pix */}
            <div className="pt-6 border-t border-white/10">
               <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Pagamento Pix</h3>
               <div>
                  <label className="text-white/70 block mb-2">Sua Chave Pix (CPF, CNPJ, Celular ou Email)</label>
                  <input 
                      type="text"
                      placeholder="Ex: 123.456.789-00 ou email@loja.com"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-secondary border border-white/5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder-white/20"
                  />
                  <p className="text-xs text-white/30 mt-2">Usado para gerar QR Codes automáticos para seus clientes.</p>
               </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/10 bg-white/5 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl hover:bg-white/5 text-white/70 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Salvar Alterações
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
