
import React, { useState } from 'react';
import { Medicine, Purchase, PurchaseItem, Language } from '../types';
import { translations } from '../translations';

interface WholesaleProps {
  medicines: Medicine[];
  purchases: Purchase[];
  onRecordPurchase: (purchase: Purchase) => void;
  onDeletePurchase: (id: string) => void;
  language: Language;
}

const Wholesale: React.FC<WholesaleProps> = ({ medicines, purchases, onRecordPurchase, onDeletePurchase, language }) => {
  const t = translations[language];
  const [activeSubTab, setActiveSubTab] = useState<'new' | 'history'>('new');
  const [supplierName, setSupplierName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [bankIdInput, setBankIdInput] = useState('');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.barcode.includes(searchTerm)
  );

  const addItemToPurchase = (med: Medicine) => {
    const existing = purchaseItems.find(i => i.medicineId === med.id);
    if (existing) {
      setPurchaseItems(purchaseItems.map(i => 
        i.medicineId === med.id 
          ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.buyPrice } 
          : i
      ));
    } else {
      setPurchaseItems([...purchaseItems, {
        medicineId: med.id,
        medicineName: med.name,
        quantity: 1,
        buyPrice: med.buyPrice,
        subtotal: med.buyPrice
      }]);
    }
  };

  const updateItemQty = (id: string, qty: number) => {
    setPurchaseItems(purchaseItems.map(i => 
      i.medicineId === id ? { ...i, quantity: Math.max(1, qty), subtotal: Math.max(1, qty) * i.buyPrice } : i
    ));
  };

  const updateItemPrice = (id: string, price: number) => {
    setPurchaseItems(purchaseItems.map(i => 
      i.medicineId === id ? { ...i, buyPrice: price, subtotal: i.quantity * price } : i
    ));
  };

  const removeItem = (id: string) => {
    setPurchaseItems(purchaseItems.filter(i => i.medicineId !== id));
  };

  const calculateTotal = () => purchaseItems.reduce((acc, i) => acc + i.subtotal, 0);

  const handleSavePurchase = () => {
    if (!supplierName || !invoiceNumber || purchaseItems.length === 0) {
      alert(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    const purchase: Purchase = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      supplierName,
      invoiceNumber,
      items: purchaseItems,
      total: calculateTotal(),
      timestamp: new Date(),
      bankTransactionId: bankIdInput.trim() || undefined
    };

    onRecordPurchase(purchase);
    
    setSupplierName('');
    setInvoiceNumber('');
    setBankIdInput('');
    setPurchaseItems([]);
    setActiveSubTab('history');
  };

  const handleDelete = (id: string) => {
    const msg = language === 'ar' ? 'هل أنت متأكد من حذف فاتورة الشراء هذه؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this purchase bill? This action cannot be undone.';
    if (confirm(msg)) {
      onDeletePurchase(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t.wholesale}</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.purchaseHistory} ({purchases.length})</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border shadow-sm">
          <button onClick={() => setActiveSubTab('new')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === 'new' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>{t.newPurchase}</button>
          <button onClick={() => setActiveSubTab('history')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === 'history' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>{t.purchaseHistory}</button>
        </div>
      </div>

      {activeSubTab === 'new' ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="relative"><span className="absolute inset-y-0 start-3 flex items-center text-slate-400">🔍</span><input type="text" placeholder={t.searchMedicines} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full ps-10 pe-4 py-3 bg-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredMedicines.map(med => (
                <button key={med.id} onClick={() => addItemToPurchase(med)} className="p-4 bg-white border rounded-2xl text-start hover:border-emerald-500 transition shadow-sm group">
                  <h3 className="font-bold text-slate-800">{med.name}</h3>
                  <div className="mt-4 flex items-center justify-between"><span className="text-xs font-bold text-slate-500">Buy: {med.buyPrice.toLocaleString()} {t.currency}</span><span className="opacity-0 group-hover:opacity-100 transition">📥</span></div>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-96 bg-white border rounded-[2.5rem] shadow-sm flex flex-col p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800">{t.newPurchase}</h2>
            <div className="space-y-4">
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">{t.supplier}</label><input type="text" value={supplierName} onChange={e => setSupplierName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl shadow-inner" /></div>
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">{t.invoiceNum}</label><input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl shadow-inner" /></div>
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">{t.bankTransactionId} {t.optional}</label><input type="text" value={bankIdInput} onChange={e => setBankIdInput(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-mono text-xs shadow-inner" /></div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-[200px] space-y-3">
              {purchaseItems.map(item => (
                <div key={item.medicineId} className="p-3 bg-slate-50 border rounded-2xl flex flex-col gap-2">
                  <div className="flex justify-between font-bold text-xs"><span>{item.medicineName}</span><button onClick={() => removeItem(item.medicineId)} className="text-rose-500">✕</button></div>
                  <div className="flex gap-2">
                    <input type="number" value={item.quantity} onChange={e => updateItemQty(item.medicineId, parseInt(e.target.value))} className="w-1/2 p-1 text-[10px] border rounded" />
                    <input type="number" value={item.buyPrice} onChange={e => updateItemPrice(item.medicineId, parseFloat(e.target.value))} className="w-1/2 p-1 text-[10px] border rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-black text-lg mb-4"><span>{t.total}</span><span className="text-emerald-600">{calculateTotal().toLocaleString()}</span></div>
              <button onClick={handleSavePurchase} disabled={purchaseItems.length === 0} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl disabled:bg-slate-200 shadow-lg shadow-emerald-200">{t.recordPurchase}</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-start text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.supplier}</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.invoiceNum}</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.total}</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {purchases.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-4 text-xs">{new Date(p.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold">{p.supplierName}</td>
                  <td className="px-6 py-4 font-mono text-xs">{p.invoiceNumber}</td>
                  <td className="px-6 py-4 font-black text-emerald-600">{p.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      <button 
                        onClick={() => setSelectedPurchase(p)} 
                        className="px-4 py-2 bg-emerald-600/10 text-emerald-700 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        {t.viewBill}
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
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
      )}

      {selectedPurchase && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b flex justify-between items-center bg-slate-50">
               <div><h2 className="text-2xl font-black text-slate-800">{t.wholesaleBillDetails}</h2><p className="text-[10px] font-bold text-slate-400 uppercase">Inv #{selectedPurchase.invoiceNumber}</p></div>
               <button onClick={() => setSelectedPurchase(null)} className="w-10 h-10 bg-white border rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-800 transition">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t.supplier}</p><p className="font-bold text-slate-800">{selectedPurchase.supplierName}</p></div>
                <div className="text-end"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t.date}</p><p className="font-bold text-slate-800">{new Date(selectedPurchase.timestamp).toLocaleDateString()}</p></div>
              </div>
              
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-200"><tr className="text-[10px] font-black text-slate-400 uppercase"><th className="pb-3 text-start">Medicine</th><th className="pb-3 text-center">{t.qty}</th><th className="pb-3 text-end">Buy Price</th><th className="pb-3 text-end">{t.subtotal}</th></tr></thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedPurchase.items.map((item, idx) => (<tr key={idx}><td className="py-4 font-bold text-slate-800">{item.medicineName}</td><td className="py-4 text-center font-bold text-indigo-600">x{item.quantity}</td><td className="py-4 text-end text-slate-500">{item.buyPrice.toLocaleString()}</td><td className="py-4 text-end font-black text-slate-800">{item.subtotal.toLocaleString()}</td></tr>))}
                  </tbody>
                </table>
              </div>

              {selectedPurchase.bankTransactionId && (
                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">{t.bankTransactionId}</p>
                      <p className="font-mono font-bold text-slate-800">{selectedPurchase.bankTransactionId}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-end pt-6 border-t-2 border-dashed border-slate-200">
                <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t.total}</p><p className="text-4xl font-black text-emerald-600">{selectedPurchase.total.toLocaleString()} {t.currency}</p></div>
              </div>
            </div>
            <div className="p-10 bg-slate-50 border-t"><button onClick={() => setSelectedPurchase(null)} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-700 transition-all uppercase tracking-widest text-xs">{t.done}</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wholesale;
