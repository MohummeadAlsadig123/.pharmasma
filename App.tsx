
import React, { useState, useEffect, useRef } from 'react';
import { Medicine, Sale, Purchase, AppTab, Language, Theme, FontSize, AppSettings } from './types';
import { INITIAL_MEDICINES } from './constants';
import { translations } from './translations';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import AIAssistant from './components/AIAssistant';
import Licensing from './components/Licensing';
import Sales from './components/Sales';
import SalesHistory from './components/SalesHistory';
import Wholesale from './components/Wholesale';
import SyncCenter from './components/SyncCenter';
import LockScreen from './components/LockScreen';
import Settings from './components/Settings';

const STORAGE_KEYS = {
  SETTINGS: 'pharma_settings_v4', // Incremented version for safety
  INVENTORY: 'pharma_inventory_v4',
  SALES: 'pharma_sales_history_v4',
  PURCHASES: 'pharma_purchases_v4',
  LICENSE: 'pharma_license_key'
};

const App: React.FC = () => {
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [appVersion, setAppVersion] = useState<string>('2.7.0-Stable');
  const [dbStatus, setDbStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const [lastSaveTime, setLastSaveTime] = useState<Date>(new Date());
  
  // Guard to prevent saving empty arrays over existing data before hydration is complete
  const isHydrated = useRef(false);

  // --- HYDRATION ENGINE (Load from Disk) ---
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : { pharmacyName: 'PharmaSmart AI', theme: 'light', fontSize: 'medium' };
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    // Fallback to legacy versions if v4 is empty but v3 had data
    if (!saved) {
        const legacy = localStorage.getItem('pharma_inventory_v3');
        return legacy ? JSON.parse(legacy) : INITIAL_MEDICINES;
    }
    return JSON.parse(saved);
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SALES) || localStorage.getItem('pharma_sales_history_v3');
    if (!saved) return [];
    try {
      const parsed: Sale[] = JSON.parse(saved);
      return parsed.map(s => ({ ...s, timestamp: new Date(s.timestamp) }));
    } catch (e) {
      console.error("Sales data recovery failed", e);
      return [];
    }
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PURCHASES) || localStorage.getItem('pharma_purchases_v3');
    if (!saved) return [];
    try {
      const parsed: Purchase[] = JSON.parse(saved);
      return parsed.map(p => ({ ...p, timestamp: new Date(p.timestamp) }));
    } catch (e) {
      return [];
    }
  });

  const t = translations[language];

  // --- PERSISTENCE ENGINE (Save to Disk) ---
  
  // Helper for guaranteed synchronous save
  const commitToDisk = (key: string, data: any) => {
    setDbStatus('saving');
    try {
      localStorage.setItem(key, JSON.stringify(data));
      setLastSaveTime(new Date());
      setDbStatus('synced');
    } catch (err) {
      console.error("FATAL: Disk Write Failure", err);
      setDbStatus('error');
      alert("Error saving data! Please check your disk space.");
    }
  };

  // Sync settings whenever they change
  useEffect(() => {
    commitToDisk(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  // Handle initialization lock
  useEffect(() => {
    isHydrated.current = true;
  }, []);

  // --- ACTION HANDLERS (Write-Ahead Policy) ---

  const handleRecordSale = (newSale: Sale) => {
    setSales(prevSales => {
      const updatedSales = [newSale, ...prevSales];
      commitToDisk(STORAGE_KEYS.SALES, updatedSales);
      return updatedSales;
    });

    setMedicines(prevMeds => {
      const updatedMeds = prevMeds.map(med => {
        const soldItem = newSale.items.find(item => item.medicineId === med.id);
        return soldItem ? { ...med, stock: Math.max(0, med.stock - soldItem.quantity) } : med;
      });
      commitToDisk(STORAGE_KEYS.INVENTORY, updatedMeds);
      return updatedMeds;
    });
  };

  const handleRecordPurchase = (newPurchase: Purchase) => {
    setPurchases(prevPurchases => {
      const updated = [newPurchase, ...prevPurchases];
      commitToDisk(STORAGE_KEYS.PURCHASES, updated);
      return updated;
    });
    
    // Also update inventory stock for purchases
    setMedicines(prevMeds => {
        const updatedMeds = prevMeds.map(med => {
            const purchasedItem = newPurchase.items.find(item => item.medicineId === med.id);
            return purchasedItem ? { ...med, stock: med.stock + purchasedItem.quantity, buyPrice: purchasedItem.buyPrice } : med;
        });
        commitToDisk(STORAGE_KEYS.INVENTORY, updatedMeds);
        return updatedMeds;
    });
  };

  const handleDeleteSale = (id: string) => {
    setSales(prev => {
      const updated = prev.filter(s => s.id !== id);
      commitToDisk(STORAGE_KEYS.SALES, updated);
      return updated;
    });
  };

  const handleDeletePurchase = (id: string) => {
    setPurchases(prev => {
      const updated = prev.filter(p => p.id !== id);
      commitToDisk(STORAGE_KEYS.PURCHASES, updated);
      return updated;
    });
  };

  const handleAddMedicine = (m: Omit<Medicine, 'id'>) => {
    setMedicines(prev => {
        const updated = [{...m, id: Date.now().toString()}, ...prev];
        commitToDisk(STORAGE_KEYS.INVENTORY, updated);
        return updated;
    });
  };

  const handleUpdateMedicine = (m: Medicine) => {
    setMedicines(prev => {
        const updated = prev.map(med => med.id === m.id ? m : med);
        commitToDisk(STORAGE_KEYS.INVENTORY, updated);
        return updated;
    });
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => {
        const updated = prev.filter(m => m.id !== id);
        commitToDisk(STORAGE_KEYS.INVENTORY, updated);
        return updated;
    });
  };

  useEffect(() => {
    const savedLicense = localStorage.getItem(STORAGE_KEYS.LICENSE);
    if (savedLicense) setIsLocked(false);
    
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard medicines={medicines} sales={sales} language={language} />;
      case 'inventory': return <Inventory medicines={medicines} onAddMedicine={handleAddMedicine} onUpdateMedicine={handleUpdateMedicine} onDeleteMedicine={handleDeleteMedicine} language={language} />;
      case 'wholesale': return <Wholesale medicines={medicines} purchases={purchases} onRecordPurchase={handleRecordPurchase} onDeletePurchase={handleDeletePurchase} language={language} />;
      case 'ai-assistant': return <AIAssistant language={language} medicines={medicines} />;
      case 'licensing': return <Licensing language={language} onDeactivate={() => { localStorage.removeItem(STORAGE_KEYS.LICENSE); setIsLocked(true); }} />;
      case 'sales': return <Sales medicines={medicines} language={language} onRecordSale={handleRecordSale} />;
      case 'sales-history': return <SalesHistory sales={sales} onDeleteSale={handleDeleteSale} language={language} />;
      case 'device-sync': return <SyncCenter language={language} onRemoteEntry={handleAddMedicine} printerStatus="disconnected" />;
      case 'settings': return <Settings settings={settings} setSettings={setSettings} language={language} sales={sales} purchases={purchases} />;
      default: return <Dashboard medicines={medicines} sales={sales} language={language} />;
    }
  };

  if (isLocked) {
    return <LockScreen language={language} onActivate={(key) => { localStorage.setItem(STORAGE_KEYS.LICENSE, key); setIsLocked(false); }} />;
  }

  const fontSizeClass = { small: 'text-sm', medium: 'text-base', large: 'text-lg' }[settings.fontSize];

  return (
    <div className={`flex min-h-screen font-sans overflow-hidden transition-colors duration-300 ${settings.theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} ${fontSizeClass} ${language === 'ar' ? 'font-arabic' : ''}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        language={language} 
        onLock={() => setIsLocked(true)} 
        pharmacyName={settings.pharmacyName}
        theme={settings.theme}
      />
      
      <main className="flex-1 h-screen overflow-hidden flex flex-col">
        <header className={`border-b px-8 py-4 flex items-center justify-between z-30 transition-colors ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t.currentView}:</span>
              <span className={`font-black capitalize ${settings.theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{(t as any)[activeTab] || activeTab}</span>
            </div>
            
            {/* Persistence Status Indicator */}
            <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
              dbStatus === 'synced' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
              dbStatus === 'saving' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
              'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              <span className={`w-2 h-2 rounded-full ${dbStatus === 'synced' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></span>
              <span>{dbStatus === 'synced' ? 'Local DB: Secure' : 'Saving...'}</span>
              <span className="opacity-40 ps-1">({lastSaveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <div className={`flex items-center space-x-2 rtl:space-x-reverse rounded-xl p-1 ${settings.theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <button onClick={() => setLanguage('en')} className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${language === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'}`}>EN</button>
              <button onClick={() => setLanguage('ar')} className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${language === 'ar' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'}`}>AR</button>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse border-s border-slate-700 ps-6">
              <div className="text-start">
                <p className={`text-xs font-black leading-none ${settings.theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{settings.pharmacyName}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">v{appVersion}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">PS</div>
            </div>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto p-8 ${settings.theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50/30'}`}>
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: ${settings.theme === 'dark' ? '#334155' : '#cbd5e1'}; 
          border-radius: 10px; 
          border: 2px solid ${settings.theme === 'dark' ? '#020617' : '#f8fafc'}; 
        }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .font-arabic { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
      `}</style>
    </div>
  );
};

export default App;
