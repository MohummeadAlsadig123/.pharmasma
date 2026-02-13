
import React, { useState } from 'react';
import { Medicine, Sale, Language } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { translations } from '../translations';

interface DashboardProps {
  medicines: Medicine[];
  sales: Sale[];
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ medicines, sales, language }) => {
  const t = translations[language];
  const [analysisPeriod, setAnalysisPeriod] = useState<'day' | 'week' | 'month'>('day');

  // Core Aggregations
  const totalStock = medicines.reduce((acc, m) => acc + m.stock, 0);
  const totalSellValue = medicines.reduce((acc, m) => acc + (m.stock * m.price), 0);
  const totalBuyValue = medicines.reduce((acc, m) => acc + (m.stock * (m.buyPrice || 0)), 0);

  // Period-based Analytics
  const getFilteredSales = (period: 'day' | 'week' | 'month') => {
    const now = new Date();
    const startOfPeriod = new Date();
    if (period === 'day') startOfPeriod.setHours(0,0,0,0);
    else if (period === 'week') startOfPeriod.setDate(now.getDate() - 7);
    else if (period === 'month') startOfPeriod.setDate(now.getDate() - 30);
    
    return sales.filter(s => s.timestamp >= startOfPeriod);
  };

  const periodSales = getFilteredSales(analysisPeriod);
  const periodRevenue = periodSales.reduce((acc, s) => acc + s.total, 0);
  const periodItems = periodSales.reduce((acc, s) => acc + s.items.reduce((iAcc, item) => iAcc + item.quantity, 0), 0);
  const periodProfit = periodSales.reduce((acc, s) => {
    const saleProfit = s.items.reduce((pAcc, item) => pAcc + ((item.price - (item.buyPrice || 0)) * item.quantity), 0);
    return acc + saleProfit;
  }, 0);

  // Expiring/Low Stock
  const lowStockCount = medicines.filter(m => m.stock < 10).length;
  const expiringSoonCount = medicines.filter(m => {
    const exp = new Date(m.expiryDate);
    const today = new Date();
    const diff = exp.getTime() - today.getTime();
    return diff < 1000 * 60 * 60 * 24 * 90; // 90 days
  }).length;

  // Chart Data preparation
  const topMedicines = [...medicines]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 6)
    .map(m => ({ name: m.name, stock: m.stock }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t.pharmacyOverview}</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border shadow-sm">
          {(['day', 'week', 'month'] as const).map(p => (
            <button
              key={p}
              onClick={() => setAnalysisPeriod(p)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                analysisPeriod === p ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p === 'day' ? (language === 'ar' ? 'يوم' : 'Today') : 
               p === 'week' ? (language === 'ar' ? 'أسبوع' : 'Week') : 
               (language === 'ar' ? 'شهر' : 'Month')}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalysisCard 
          icon="💰" 
          label={language === 'ar' ? 'دخل الفترة' : 'Period Income'} 
          value={`${periodRevenue.toLocaleString()} ${t.currency}`} 
          subValue={`${periodSales.length} Transactions`}
          color="emerald"
        />
        <AnalysisCard 
          icon="📦" 
          label={language === 'ar' ? 'العناصر المباعة' : 'Items Sold'} 
          value={periodItems.toLocaleString()} 
          subValue="Quantity in Period"
          color="blue"
        />
        <AnalysisCard 
          icon="📈" 
          label={language === 'ar' ? 'صافي الربح' : 'Net Profit'} 
          value={`${periodProfit.toLocaleString()} ${t.currency}`} 
          subValue={`${((periodProfit / (periodRevenue || 1)) * 100).toFixed(1)}% Margin`}
          color="indigo"
        />
        <AnalysisCard 
          icon="⚠️" 
          label={t.lowStockAlert} 
          value={lowStockCount.toString()} 
          subValue={`${expiringSoonCount} Expiring Soon`}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col h-[400px]">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">{language === 'ar' ? 'تحليل المخزون العلوي' : 'Top Inventory Distribution'}</h2>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={topMedicines}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 800, color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="stock" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Snapshots */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 text-white flex flex-col justify-between h-[400px] border border-emerald-500/10">
           <div>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-1">Stock Asset Valuation</p>
              <h2 className="text-2xl font-black">{totalSellValue.toLocaleString()} <span className="text-xs opacity-50">{t.currency}</span></h2>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                 <span className="text-xs font-bold text-white/50">{t.buyValue}</span>
                 <span className="text-sm font-black">-{totalBuyValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                 <span className="text-xs font-bold text-white/50">Est. Profit Potential</span>
                 <span className="text-sm font-black text-emerald-400">+{ (totalSellValue - totalBuyValue).toLocaleString() }</span>
              </div>
           </div>

           <div className="bg-white/5 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-white/40 uppercase mb-2">Inventory Health</p>
              <div className="flex items-center gap-3">
                 <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                 </div>
                 <span className="text-xs font-black">85%</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const AnalysisCard: React.FC<{ icon: string, label: string, value: string, subValue: string, color: 'emerald' | 'blue' | 'indigo' | 'rose' }> = ({ icon, label, value, subValue, color }) => {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className={`p-6 bg-white border rounded-[2rem] shadow-sm flex flex-col items-center text-center transition-all hover:scale-[1.02] hover:shadow-lg`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 border ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-xl font-black text-slate-800 mb-1">{value}</h3>
      <p className="text-[10px] font-bold text-slate-500 opacity-60 uppercase">{subValue}</p>
    </div>
  );
};

export default Dashboard;
