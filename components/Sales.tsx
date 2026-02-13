
import React, { useState, useEffect, useRef } from 'react';
import { Medicine, Sale, SaleItem, Language, PrinterConfig } from '../types';
import { translations } from '../translations';

interface SalesProps {
  medicines: Medicine[];
  language: Language;
  onRecordSale: (sale: Sale) => void;
}

const Sales: React.FC<SalesProps> = ({ medicines, language, onRecordSale }) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [bankIdInput, setBankIdInput] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [billItems, setBillItems] = useState<SaleItem[]>([]);
  const [showReceipt, setShowReceipt] = useState<Sale | null>(null);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);

  const getPrinterConfig = (): PrinterConfig | null => {
    const saved = localStorage.getItem('pharma_printer_config');
    return saved ? JSON.parse(saved) : null;
  };

  useEffect(() => {
    const focusScanner = () => {
      if (barcodeRef.current && document.activeElement?.tagName !== 'INPUT' && !showReceipt) {
        barcodeRef.current.focus();
      }
    };
    const interval = setInterval(focusScanner, 500);
    window.addEventListener('click', focusScanner);
    return () => {
      clearInterval(interval);
      window.removeEventListener('click', focusScanner);
    };
  }, [showReceipt]);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;

    const med = medicines.find(m => m.barcode === code || m.id === code);
    if (med) {
      if (med.stock > 0) {
        addItemToBill(med);
        setLastAdded(med.name);
        setTimeout(() => setLastAdded(null), 2000);
      } else {
        alert(language === 'ar' ? 'هذا الدواء نفد من المخزون!' : 'This medicine is out of stock!');
      }
    }
    setBarcodeInput('');
  };

  const addItemToBill = (medicine: Medicine) => {
    setBillItems(prev => {
      const existing = prev.find(item => item.medicineId === medicine.id);
      if (existing) {
        if (existing.quantity >= medicine.stock) return prev;
        return prev.map(item => 
          item.medicineId === medicine.id 
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price } 
            : item
        );
      }
      return [...prev, {
        medicineId: medicine.id,
        medicineName: medicine.name,
        quantity: 1,
        buyPrice: medicine.buyPrice,
        price: medicine.price,
        subtotal: medicine.price
      }];
    });
  };

  const removeItemFromBill = (id: string) => {
    setBillItems(prev => prev.filter(item => item.medicineId !== id));
  };

  const calculateTotal = () => billItems.reduce((acc, item) => acc + item.subtotal, 0);

  const handleCheckout = () => {
    if (billItems.length === 0) return;
    
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: [...billItems],
      total: calculateTotal(),
      timestamp: new Date(),
      bankTransactionId: bankIdInput.trim() || undefined,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined
    };
    
    onRecordSale(newSale);
    setShowReceipt(newSale);
    
    const printerConfig = getPrinterConfig();
    if (printerConfig?.autoPrint) {
      setTimeout(() => {
        try {
          window.print();
        } catch (e) {
          console.error("Auto-print failed:", e);
        }
      }, 500); 
    }

    setBillItems([]);
    setBankIdInput('');
    setCustomerName('');
    setCustomerPhone('');
  };

  const triggerRealPrint = () => {
    window.print();
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.barcode.includes(searchTerm)
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      <div className="flex-1 flex flex-col space-y-4 overflow-hidden relative no-print">
        {lastAdded && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 rtl:space-x-reverse">
              <span className="text-xl">✅</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Added</p>
                <p className="font-bold">{lastAdded}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800">{t.pointOfSale}</h1>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <form onSubmit={handleBarcodeSubmit} className="relative group">
              <span className="absolute inset-y-0 start-3 flex items-center text-slate-400">🏷️</span>
              <input 
                ref={barcodeRef}
                type="text" 
                placeholder={t.scanBarcode}
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="w-48 ps-10 pe-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm transition-all focus:w-64"
              />
            </form>
            <div className="relative w-64">
              <span className="absolute inset-y-0 start-3 flex items-center text-slate-400">🔍</span>
              <input 
                type="text" 
                placeholder={t.searchMedicines} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full ps-10 pe-4 py-2 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 px-1">
          {filteredMedicines.map(med => (
            <button
              key={med.id}
              disabled={med.stock <= 0}
              onClick={() => addItemToBill(med)}
              className={`group text-start p-4 bg-white border rounded-2xl transition shadow-sm hover:shadow-md hover:border-emerald-500 flex flex-col justify-between ${med.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase w-fit">{med.category}</span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg uppercase w-fit">{t.forms[med.formType]}</span>
                  </div>
                  <div className="text-end text-[10px] font-bold px-1.5 py-0.5 rounded border text-slate-500">Stock: {med.stock}</div>
                </div>
                <h3 className="font-bold text-slate-800">{med.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{med.genericName}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-black text-slate-900">{med.price.toLocaleString()} {t.currency}</span>
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition">+</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-96 bg-white border rounded-3xl shadow-sm flex flex-col overflow-hidden no-print">
        <div className="p-5 border-b bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center"><span className="me-2">🧾</span> {t.currentBill}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {billItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60"><span className="text-4xl">🛒</span><p className="font-medium">{t.emptyBill}</p></div>
          ) : (
            billItems.map(item => (
              <div key={item.medicineId} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border">
                <div className="flex-1"><p className="text-sm font-bold text-slate-800">{item.medicineName}</p><p className="text-xs text-slate-500">{item.price.toLocaleString()} x {item.quantity}</p></div>
                <div className="text-end flex items-center space-x-3 rtl:space-x-reverse"><span className="text-sm font-bold text-slate-900">{item.subtotal.toLocaleString()}</span><button onClick={() => removeItemFromBill(item.medicineId)} className="w-6 h-6 bg-rose-50 text-rose-500 rounded-full text-xs">✕</button></div>
              </div>
            ))
          )}
        </div>
        <div className="p-5 border-t bg-slate-50 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">{t.customerName}</label><input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">{t.customerPhone}</label><input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs" /></div>
          </div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">{t.bankTransactionId}</label><input type="text" value={bankIdInput} onChange={e => setBankIdInput(e.target.value)} className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs font-mono shadow-inner" /></div>
          <div className="flex items-center justify-between text-lg font-black text-slate-800 border-t pt-2"><span>{t.total}</span><span className="text-2xl text-emerald-600">{calculateTotal().toLocaleString()} {t.currency}</span></div>
          <button onClick={handleCheckout} disabled={billItems.length === 0} className={`w-full py-4 rounded-2xl font-bold shadow-lg ${billItems.length > 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'}`}><span>{t.checkout}</span></button>
        </div>
      </div>

      {showReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in">
            <div className="p-8 text-center bg-emerald-600 text-white"><div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div><h2 className="text-2xl font-bold">{t.paymentSuccess}</h2></div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between text-sm text-slate-500 border-b pb-4">
                <div><p className="font-bold text-slate-800">{t.receipt}</p><p>#{showReceipt.id}</p></div>
                <div className="text-end"><p>{showReceipt.customerName || 'Walk-in'}</p></div>
              </div>
              <div className="space-y-3">{showReceipt.items.map((item, idx) => (<div key={idx} className="flex justify-between text-sm"><span>{item.medicineName} (x{item.quantity})</span><span className="font-bold">{item.subtotal.toLocaleString()}</span></div>))}</div>
              
              {showReceipt.bankTransactionId && (
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">{t.bankTransactionId}</p>
                  <p className="font-mono font-bold text-slate-800">{showReceipt.bankTransactionId}</p>
                </div>
              )}

              <div className="pt-4 border-t border-dashed flex justify-between items-center text-lg font-black text-slate-900">
                <span>{t.total}</span>
                <span>{showReceipt.total.toLocaleString()} {t.currency}</span>
              </div>

              <div className="flex gap-3 no-print">
                <button 
                  onClick={triggerRealPrint}
                  className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-900 transition"
                >
                  🖨️ {t.printBill}
                </button>
                <button 
                  onClick={() => setShowReceipt(null)}
                  className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-700 transition"
                >
                  {t.done}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
