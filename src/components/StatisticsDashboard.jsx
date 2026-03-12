
import { BarChart, Bar, Tooltip, ResponsiveContainer, CartesianGrid, XAxis } from 'recharts';
import { useTickets } from '../context/TicketContext';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Car } from 'lucide-react';
import { useMemo } from 'react';

export function StatisticsDashboard({ onOpenHistory }) {
  const { tickets } = useTickets();

  // Metrics Logic
  // ... (metrics calculation stays same, omitting for brevity in diff but assuming function context)
  const metrics = useMemo(() => {
    // ... (same as before)
    const today = new Date().toLocaleDateString();
    
    // Revenue Today
    const todayTickets = tickets.filter(t => new Date(t.startTime).toLocaleDateString() === today && t.status !== 'cancelled');
    const todayRevenue = todayTickets.reduce((acc, t) => acc + (t.price || 0), 0);
    
    // Total Cars (Active + Completed, excluding cancelled) -> Or just "Washed Today"?
    // Let's assume "Active in System" or "Processed Today".
    // User asked for "Carros Lavados" (Washed). Let's count 'ready' status as washed.
    // Or maybe count all processed today regardless of current status (if they are in washing or ready).
    const carsWashedToday = todayTickets.filter(t => t.status === 'ready').length; // Strictly completed today
    const carsInProcess = todayTickets.filter(t => t.status !== 'ready').length; // Still in pipeline

    // Weekly Data Generator
    const weeklyData = [];
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString();
        const dayLabel = days[d.getDay()];
        
        // Sum revenue for this day
        const dayRevenue = tickets
            .filter(t => new Date(t.startTime).toLocaleDateString() === dateStr && t.status !== 'cancelled')
            .reduce((acc, t) => acc + (t.price || 0), 0);
            
        weeklyData.push({ name: dayLabel, revenue: dayRevenue });
    }

    return { todayRevenue, carsWashedToday, carsInProcess, weeklyData };
  }, [tickets]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"
    >
      {/* Metric Cards */}
      <div 
        onClick={onOpenHistory}
        className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group cursor-pointer hover:bg-card/60 transition-all active:scale-[0.98]"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <DollarSign size={64} />
        </div>
        <h3 className="text-sm font-medium text-white/50 mb-1 group-hover:text-primary transition-colors">Faturamento Hoje &rarr;</h3>
        <p className="text-3xl font-bold text-white tracking-tight">R$ {metrics.todayRevenue.toFixed(2)}</p>
        <div className="mt-4 flex items-center text-xs text-green-400 gap-1">
          <TrendingUp size={14} /> Atualizado agora
        </div>
      </div>

      <div className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Car size={64} />
        </div>
        <h3 className="text-sm font-medium text-white/50 mb-1">Carros Entregues (Hoje)</h3>
        <p className="text-3xl font-bold text-white tracking-tight">{metrics.carsWashedToday}</p>
        <div className="mt-4 text-xs text-white/40 gap-1">
          + {metrics.carsInProcess} em andamento
        </div>
      </div>

      {/* Chart */}
      <div className="lg:col-span-2 bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-center">
        <h3 className="text-sm font-medium text-white/50 mb-4">Desempenho Semanal (Últimos 7 dias)</h3>
        <div className="h-[100px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{fontSize: 10, fill: 'rgba(255,255,255,0.4)'}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => [`R$ ${value}`, 'Receita']}
              />
              <Bar dataKey="revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
