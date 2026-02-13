
import React, { useState } from 'react';
import { Sale, Language } from '../types';
import { translations } from '../translations';

interface SalesHistoryProps {
  sales: Sale[];
  onDeleteSale: (id: string) => void;
  language: Language;
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales, onDeleteSale, language }) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<'newest' | 'nameAZ' | 'nameZA'>('newest');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = sales.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.customerName && s.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.customerPhone && s.customerPhone.includes(searchTerm))
  ).sort((a, b) => {
    if (sortConfig === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    const nameA = a.customerName || (language === 'ar' ? 'عميل عابر' : 'Walk-in');
    const nameB = b.customerName || (language === 'ar' ? 'عميل عابر' : 'Walk-in');
    if (sortConfig === 'nameAZ') return nameA.localeCompare(nameB, language === 'ar' ? 'ar' : 'en');
    if (sortConfig === 'nameZA') return nameB.localeCompare(nameA, language === 'ar' ? 'ar' : 'en');
    return 0;
  });

  const handleDelete = (id: string) => {
    const msg = language === 'ar' ? 'هل أنت متأكد من حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this bill? This action cannot be undone.';
    if (confirm(msg)) {
      onDeleteSale(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t.salesHistory}</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.allBills} ({sales.length})</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 start-3 flex items-center text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder={t.searchBills} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-10 pe-4 py-3 bg-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64 shadow-sm"
            />
          </div>
          <div className="flex items-center bg-white border rounded-2xl px-3 py-1 shadow-sm gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase whitespace-nowrap">{t.sortBy}:</span>
            <select 
              value={sortConfig} 
              onChange={(e) => setSortConfig(e.target.value as any)}
              className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 outline-none"
            >
              <option value="newest">{t.newestFirst}</option>
              <option value="nameAZ">{t.nameAZ}</option>
              <option value="nameZA">{t.nameZA}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.billNumber}</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.customerName}</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.items}</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.total}</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50 transition group">
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">#{sale.id}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(sale.timestamp).toLocaleDateString()}
                    <br />
                    <span className="opacity-50">{new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{sale.customerName || (language === 'ar' ? 'عميل عابر' : 'Walk-in')}</div>
                    {sale.customerPhone && <div className="text-[10px] text-slate-400">{sale.customerPhone}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-xs font-bold text-slate-600">{sale.items.length} {t.items}</span>
                  </td>
                  <td className="px-6 py-4 font-black text-emerald-600 text-base">{sale.total.toLocaleString()} {t.currency}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      <button 
                        onClick={() => setSelectedSale(sale)}
                        className="px-4 py-2 bg-emerald-600/10 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        {t.viewBill}
                      </button>
                      <button 
                        onClick={() => handleDelete(sale.id)}
                        className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                        title={t.remove}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSale && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b flex justify-between items-center bg-slate-50">
               <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.receipt}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t.billNumber} #{selectedSale.id}</p>
               </div>
               <button onClick={() => setSelectedSale(null)} className="w-10 h-10 bg-white border rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-800 transition">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.customerName}</p>
                   <div>
                     <p className="font-bold text-slate-800">{selectedSale.customerName || (language === 'ar' ? 'عميل عابر' : 'Walk-in')}</p>
                     <p className="text-sm text-slate-500">{selectedSale.customerPhone || 'N/A'}</p>
                   </div>
                </div>
                <div className="text-end space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</p>
                   <div>
                     <p className="font-bold text-slate-800">{new Date(selectedSale.timestamp).toLocaleDateString()}</p>
                     <p className="text-sm text-slate-500">{new Date(selectedSale.timestamp).toLocaleTimeString()}</p>
                   </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.items}</p>
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-200">
                        <th className="pb-3 text-start">Item</th>
                        <th className="pb-3 text-center">{t.qty}</th>
                        <th className="pb-3 text-end">{t.price}</th>
                        <th className="pb-3 text-end">{t.subtotal}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedSale.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-4 font-bold text-slate-800">{item.medicineName}</td>
                          <td className="py-4 text-center font-bold text-indigo-600">x{item.quantity}</td>
                          <td className="py-4 text-end text-slate-500">{item.price.toLocaleString()}</td>
                          <td className="py-4 text-end font-black text-slate-800">{item.subtotal.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedSale.bankTransactionId && (
                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">{t.bankTransactionId}</p>
                      <p className="font-mono font-bold text-slate-800">{selectedSale.bankTransactionId}</p>
                    </div>
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full border border-blue-100 shadow-sm">
                    <span className="text-[9px] font-black text-blue-600 uppercase">Electronic Reference</span>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t-2 border-dashed border-slate-200 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.total}</p>
                  <p className="text-4xl font-black text-emerald-600 tracking-tighter">{selectedSale.total.toLocaleString()} <span className="text-xs uppercase ml-1 opacity-50">{t.currency}</span></p>
                </div>
              </div>
            </div>
            
            <div className="p-10 bg-slate-50 border-t flex space-x-4 rtl:space-x-reverse">
              <button onClick={() => window.print()} className="flex-1 py-4 bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 uppercase tracking-widest text-xs">🖨️ {t.printBill}</button>
              <button onClick={() => setSelectedSale(null)} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 uppercase tracking-widest text-xs">{t.done}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
