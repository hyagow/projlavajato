
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle2, QrCode as QrIcon } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useState, useEffect } from 'react';
import { generatePixPayload } from '../utils/pix';

export function PixPaymentModal({ isOpen, onClose, ticket, onPaymentSuccess }) {
  const [payload, setPayload] = useState('');
  const [copied, setCopied] = useState(false);
  const [pixKey, setPixKey] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && ticket) {
       const key = localStorage.getItem('lavajato_pix_key');
       setPixKey(key);
       setIsChecking(true); 
       setIsSuccess(false); // Reset success state

       if (key) {
           try {
               const generatedPayload = generatePixPayload({
                   key: key,
                   name: 'Lava Jato',
                   city: 'Brasil',
                   amount: ticket.price || 0,
                   txid: (ticket.id || '0000').substring(0, 20).replace(/[^a-zA-Z0-9]/g, '')
               });
               setPayload(generatedPayload);
           } catch (err) {
               console.error("Error generating Pix:", err);
           }
       }
    } else {
        setIsChecking(false);
        setIsSuccess(false);
    }
  }, [isOpen, ticket]);

  // Real Bank Listener Structure (Polling)
  useEffect(() => {
      let interval;
      
      const checkPayment = async () => {
          if (!isOpen || !payload || isSuccess) return;

          try {
              // TODO: Replace this URL with your real backend endpoint
              // Example: const response = await fetch(`/api/check-payment?txid=${ticket.id}`);
              // const data = await response.json();
              
              // Simulation for demonstration only: 
              // In production, REMOVE this random check and uncomment the fetch above
              // For now, we are just keeping it "checking" forever until an API is connected.
              // To test success manually, you can call confirmPayment() in console or implement a webhook.
              
              const isPaid = false; // Change this based on API response

              if (isPaid) {
                  setIsChecking(false);
                  setIsSuccess(true);
                  
                  setTimeout(() => {
                      if (onPaymentSuccess) onPaymentSuccess();
                      onClose();
                  }, 3000);
              }
          } catch (error) {
              console.error("Error checking payment:", error);
          }
      };

      if (isChecking && isOpen && !isSuccess) {
          // Poll every 5 seconds
          interval = setInterval(checkPayment, 5000);
      }

      return () => clearInterval(interval);
  }, [isChecking, isOpen, isSuccess, payload, onPaymentSuccess, onClose, ticket]);

  const handleCopy = () => {
      navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-card w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative z-10"
        >
             {isSuccess ? (
                 <div className="p-10 flex flex-col items-center justify-center text-center bg-gradient-to-br from-emerald-500/20 to-emerald-900/20">
                     <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30"
                     >
                         <CheckCircle2 size={48} className="text-white" />
                     </motion.div>
                     <motion.h2 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-white mb-2"
                     >
                         Pagamento Recebido!
                     </motion.h2>
                     <motion.p 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        className="text-emerald-200"
                     >
                         Seu pagamento foi confirmado com sucesso.
                     </motion.p>
                 </div>
             ) : (
                <>
                 <div className="bg-emerald-500 p-6 text-center relative overflow-hidden">
                     {isChecking && (
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute -right-10 -top-10 w-32 h-32 border-4 border-white/20 border-t-white rounded-full"
                        />
                     )}

                     <button onClick={onClose} className="absolute right-4 top-4 text-emerald-900/50 hover:text-emerald-900 p-2 rounded-full z-20 hover:bg-black/5 transition-colors">
                         <X size={20} />
                     </button>
                     <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md relative z-10">
                         <QrIcon size={32} className="text-white" />
                     </div>
                     <h2 className="text-2xl font-bold text-white mb-1 relative z-10">Pagamento Pix</h2>
                     <p className="text-emerald-100 text-sm relative z-10 flex items-center justify-center gap-2">
                        {isChecking ? (
                            <>
                                <span className="w-2 h-2 bg-white rounded-full animate-ping"/>
                                Aguardando confirmação...
                            </>
                        ) : 'Escaneie ou copie o código'}
                     </p>
                 </div>

                 <div className="p-8 space-y-6 bg-secondary/50">
                    {!pixKey ? (
                        <div className="text-center text-white/50 py-4">
                            <p>Nenhuma Chave Pix configurada.</p>
                            <p className="text-xs mt-2">Acesse as configurações para cadastrar.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white p-4 rounded-xl shadow-lg mx-auto w-fit">
                                {payload ? (
                                    <div className="h-48 w-48 font-mono" style={{ height: "auto", maxWidth: "100%", width: "100%" }}>
                                        <QRCode
                                            size={256}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            value={payload}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-48 h-48 flex items-center justify-center text-black/20 text-xs">Aguardando chave...</div>
                                )}
                            </div>

                            <div className="text-center">
                                <p className="text-white/50 text-xs uppercase font-bold tracking-wider mb-1">Valor a Pagar</p>
                                <p className="text-3xl font-bold text-white">R$ {ticket.price?.toFixed(2)}</p>
                            </div>

                            <div className="relative">
                                <p className="text-white/30 text-[10px] text-center mb-2">Código Copia e Cola</p>
                                <button 
                                    onClick={handleCopy}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 py-3 px-4 rounded-xl text-xs font-mono truncate transition-all flex items-center justify-between group"
                                >
                                    <span className="truncate mr-2 opacity-50">{payload}</span>
                                    {copied ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> : <Copy size={16} className="shrink-0 group-hover:text-white" />}
                                </button>
                                {copied && <p className="text-emerald-400 text-xs text-center mt-2 font-bold animate-pulse">Copiado!</p>}
                            </div>
                        </>
                    )}
                 </div>
                </>
             )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
