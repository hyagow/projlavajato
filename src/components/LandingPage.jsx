
import { useState, useEffect } from 'react';
import { User, ShieldCheck, Lock, Smartphone, RefreshCw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as OTPAuth from 'otpauth';
import QRCode from 'react-qr-code';

export function LandingPage({ onSelectRole }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [error, setError] = useState(false);
  
  // Stealth Mode State
  const [showStaffOption, setShowStaffOption] = useState(false);
  const [titleClicks, setTitleClicks] = useState(0);

  // MFA State
  const [mfaSecret, setMfaSecret] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);

  useEffect(() => {
    const savedSecret = localStorage.getItem('lavajato_mfa_secret');
    
    if (savedSecret) {
        setMfaSecret(savedSecret);
        setIsSetupMode(false);
    } else {
        // Generate new secret
        const secret = new OTPAuth.Secret({ size: 20 });
        const secretBase32 = secret.base32;
        
        setMfaSecret(secretBase32);
        setIsSetupMode(true);
        
        // Generate TOTP object for QR
        const totp = new OTPAuth.TOTP({
            issuer: 'Lava Jato Ta Novo',
            label: 'Admin',
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: secret
        });
        
        // Store the otpauth URL directly for the react-qr-code component
        setQrCodeUrl(totp.toString());
    }
  }, []);

  const handleTitleClick = () => {
      const newClicks = titleClicks + 1;
      setTitleClicks(newClicks);
      if (newClicks >= 3) {
          setShowStaffOption(true);
          // Optional: Vibrate or visual cue could go here
      }
      // Reset clicks if user stops clicking (simple debounce concept)
      setTimeout(() => setTitleClicks(0), 1000); 
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    
    try {
        const totp = new OTPAuth.TOTP({
            issuer: 'Lava Jato Ta Novo',
            label: 'Admin',
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(mfaSecret)
        });
        
        // Validate (window of 1 means check current + previous/next 30s)
        const delta = totp.validate({ token: adminToken, window: 1 });
        
        if (delta !== null) {
            // Valid!
            if (isSetupMode) {
                localStorage.setItem('lavajato_mfa_secret', mfaSecret);
                setIsSetupMode(false);
            }
            onSelectRole('staff');
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    } catch (err) {
        console.error(err);
        setError(true);
    }
  };

  const resetMFA = () => {
     if(confirm("Tem certeza que deseja resetar o MFA? Você precisará escanear o QR Code novamente.")) {
         localStorage.removeItem('lavajato_mfa_secret');
         window.location.reload();
     }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center space-y-8 max-w-md w-full"
        >
            {!showAdminLogin ? (
                <>
                    <div className="space-y-2 select-none cursor-pointer flex flex-col items-center" onClick={handleTitleClick}>
                        <img src="/logo.png" alt="Logo Lava Jato" className="w-64 h-64 object-cover rounded-full drop-shadow-[0_0_35px_rgba(6,182,212,0.4)] mb-2 border-4 border-white/5" />
                        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2 backdrop-blur-md">
                            Versão 2.7 Premium
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight text-white active:scale-95 transition-transform">
                            Lava Jato <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Tá Novo</span>
                        </h1>
                        <p className="text-white/50">Selecione como deseja acessar</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {showStaffOption && (
                            <motion.button
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowAdminLogin(true)}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 transition-all group text-left relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                                    <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                </div>
                                <div className="p-3 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Equipe / Staff</h3>
                                    <p className="text-sm text-white/50">Área administrativa protegida.</p>
                                </div>
                            </motion.button>
                        )}


                        <motion.button
                             whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                             whileTap={{ scale: 0.98 }}
                             onClick={() => onSelectRole('client')}
                             className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 transition-all group text-left relative overflow-hidden"
                        >
                             <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">
                                <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                            </div>
                            <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                                <User size={24} />
                            </div>
                            <div>
                                 <h3 className="text-lg font-bold text-white">Sou Cliente</h3>
                                 <p className="text-sm text-white/50">Acompanhar meu veículo.</p>
                            </div>
                        </motion.button>
                    </div>
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border border-primary/30 rounded-3xl p-8 text-left relative overflow-hidden shadow-2xl shadow-primary/10"
                >
                    <button 
                        onClick={() => setShowAdminLogin(false)}
                        className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                        Cancelar
                    </button>

                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                        <Lock size={28} />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isSetupMode ? 'Configurar Acesso' : 'Autenticação'}
                    </h2>
                    
                    {isSetupMode ? (
                        <div className="mb-6 space-y-4">
                             <p className="text-white/60 text-sm leading-relaxed">
                                Escaneie este QR Code com seu app <strong>Google Authenticator</strong>.
                             </p>
                             <div className="flex justify-center bg-white p-2 rounded-xl">
                                 {qrCodeUrl && (
                                     <div style={{ height: "auto", margin: "0 auto", maxWidth: 160, width: "100%" }}>
                                        <QRCode
                                            size={256}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            value={qrCodeUrl}
                                            viewBox={`0 0 256 256`}
                                        />
                                     </div>
                                 )}
                             </div>
                             <p className="text-xs text-white/30 text-center">
                                Depois de escanear, digite o código de 6 dígitos que aparecerá no app.
                             </p>
                        </div>
                    ) : (
                        <p className="text-white/50 text-sm mb-6">
                            Abra seu Google Authenticator e digite o código temporário.
                        </p>
                    )}

                    <form onSubmit={handleAdminLogin}>
                        <div className="relative mb-2">
                            <input 
                                autoFocus
                                type="text" 
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                className={`w-full bg-white/5 border ${error ? 'border-red-500 text-red-500 shadow-red-500/20 shadow-lg' : 'border-white/10 text-white focus:border-primary focus:shadow-primary/20 focus:shadow-lg'} rounded-xl px-4 py-4 outline-none transition-all text-center tracking-[0.5em] font-mono text-2xl placeholder-white/10`}
                                placeholder="000000"
                                maxLength={6}
                                value={adminToken}
                                onChange={(e) => {
                                    // Allow only numbers
                                    const val = e.target.value.replace(/\D/g, '');
                                    setAdminToken(val);
                                    setError(false);
                                    
                                    // Auto submit if 6 digits
                                    if(val.length === 6 && !error) {
                                       // We can't easily auto submit here without causing recursion issues with state updates in render loop if we aren't careful, 
                                       // but user can press enter. Let's keep it manual or wait for next render.
                                    }
                                }}
                            />
                            {error && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -bottom-6 left-0 right-0 text-center text-red-500 text-xs font-bold"
                                >
                                    Código Inválido
                                </motion.p>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="mt-8 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {isSetupMode ? 'Confirmar Configuração' : 'Desbloquear Painel'}
                        </button>
                    </form>
                    
                    {!isSetupMode && (
                        <div className="mt-4 text-center">
                            <button onClick={resetMFA} className="text-[10px] text-white/20 hover:text-red-400 transition-colors flex items-center justify-center gap-1 mx-auto">
                                <RefreshCw size={10} /> Resetar Configuração (Debug)
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
        
        <div className="absolute bottom-6 flex gap-4 text-xs text-white/10">
            <span>&copy; 2025 Lava Jato Tá Novo</span>
            <span>•</span>
            <span>Secure MFA Enabled</span>
        </div>
    </div>
  );
}
