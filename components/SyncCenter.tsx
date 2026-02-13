
import React, { useState, useEffect } from 'react';
import { Medicine, Language, ConnectedDevice, PrinterConfig } from '../types';
import { translations } from '../translations';

interface SyncCenterProps {
  language: Language;
  onRemoteEntry: (med: Omit<Medicine, 'id'>) => void;
  printerStatus: 'connected' | 'disconnected';
}

const SyncCenter: React.FC<SyncCenterProps> = ({ language, onRemoteEntry, printerStatus }) => {
  const t = translations[language];
  const [devices, setDevices] = useState<ConnectedDevice[]>([
    { id: 'D1', name: 'Pharmacist-Mobile-01', type: 'mobile', lastSeen: new Date(), status: 'online' },
    { id: 'D2', name: 'Stock-Tablet-North', type: 'tablet', lastSeen: new Date(Date.now() - 1000 * 60 * 5), status: 'offline' }
  ]);
  
  const [printer, setPrinter] = useState<PrinterConfig>(() => {
    const saved = localStorage.getItem('pharma_printer_config');
    return saved ? JSON.parse(saved) : {
      ip: '',
      port: 9100,
      type: '80mm',
      status: 'disconnected',
      autoPrint: false
    };
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [isTestingPrinter, setIsTestingPrinter] = useState(false);

  useEffect(() => {
    localStorage.setItem('pharma_printer_config', JSON.stringify({ ...printer, status: printerStatus }));
  }, [printer, printerStatus]);

  const pairUSBPrinter = async () => {
    if (!('usb' in navigator)) {
      alert(language === 'ar' ? 'متصفحك لا يدعم توصيل USB المباشر' : 'Your browser does not support direct USB connection');
      return;
    }

    try {
      const device = await (navigator as any).usb.requestDevice({ filters: [] });
      if (device) {
        setPrinter(prev => ({ ...prev, status: 'connected' }));
        alert(language === 'ar' ? `تم ربط الطابعة: ${device.productName}` : `Printer paired: ${device.productName}`);
      }
    } catch (err) {
      console.error("USB Pairing Failed", err);
      alert(language === 'ar' ? 'فشل الاقتران. تأكد من توصيل الطابعة بشكل صحيح.' : 'Pairing failed. Ensure the printer is connected correctly.');
    }
  };

  const simulateRemoteAdd = () => {
    setIsSimulating(true);
    setTimeout(() => {
      onRemoteEntry({
        name: 'Simulated Med ' + Math.floor(Math.random() * 100),
        genericName: 'Remote Entry Simulation',
        barcode: 'REM' + Math.floor(Math.random() * 10000),
        category: 'Other',
        formType: 'Tablet',
        stock: 50,
        expiryDate: '2026-01-01',
        buyPrice: 10,
        price: 15,
        dosage: '10mg',
        location: 'Inbound Dock'
      });
      setIsSimulating(false);
    }, 1500);
  };

  const handleTestPrint = () => {
    // User gesture context is important. Trigger immediately.
    console.log("Manual test print triggered");
    setIsTestingPrinter(true);
    try {
      window.print();
    } catch (e) {
      console.error("Test print failed:", e);
    }
    setTimeout(() => setIsTestingPrinter(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t.syncTitle}</h1>
          <p className="text-sm text-slate-500">{t.syncSubtitle}</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 flex items-center space-x-2 rtl:space-x-reverse">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-bold uppercase tracking-wider">{language === 'ar' ? 'الخادم المحلي نشط' : 'Local Server Active'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-800 mb-2">{t.pairDevice}</h2>
            <p className="text-sm text-slate-500 mb-6">{t.scanQR}</p>
            <div className="w-48 h-48 bg-slate-100 rounded-3xl mx-auto mb-6 flex items-center justify-center border-4 border-slate-50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent"></div>
              <div className="grid grid-cols-5 gap-1 opacity-80">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className={`w-6 h-6 rounded-sm ${Math.random() > 0.5 ? 'bg-slate-800' : 'bg-transparent'}`}></div>
                ))}
              </div>
            </div>
          </div>
          <button onClick={simulateRemoteAdd} disabled={isSimulating} className="w-full py-4 rounded-2xl font-bold shadow-lg transition flex items-center justify-center space-x-2 bg-indigo-600 text-white hover:bg-indigo-700">
            <span>{isSimulating ? '⏳' : '📥'}</span>
            <span>{t.simulateRemote}</span>
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <span className="me-2">🖨️</span> {t.printerSettings}
            </div>
            <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-lg text-[10px] font-black uppercase ${printerStatus === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${printerStatus === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              <span>{printerStatus === 'connected' ? t.connected : t.disconnected}</span>
            </div>
          </h2>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'ar' 
                ? 'انقر لربط طابعة USB الحرارية مباشرة بجهازك. سيطلب نظام أندرويد الإذن للوصول إلى الجهاز.' 
                : 'Click to pair your USB Thermal Printer directly. Android will request permission to access the hardware.'}
            </p>
            <button 
              onClick={pairUSBPrinter}
              className="px-6 py-3 bg-white border border-slate-200 text-emerald-600 rounded-xl font-bold shadow-sm hover:shadow-md transition flex items-center justify-center space-x-2 mx-auto"
            >
              <span>🔌</span>
              <span>{language === 'ar' ? 'ربط طابعة USB' : 'Pair USB Printer'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.paperSize}</label>
              <select 
                value={printer.type} 
                onChange={e => setPrinter({...printer, type: e.target.value as any})} 
                className="w-full px-4 py-2 bg-slate-50 border rounded-xl font-bold text-sm"
              >
                <option value="80mm">80mm</option>
                <option value="58mm">58mm</option>
              </select>
            </div>
            <div className="pt-5">
              <label className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer bg-slate-50 p-3 rounded-xl border border-dashed hover:border-emerald-300 transition-colors">
                <input type="checkbox" checked={printer.autoPrint} onChange={e => setPrinter({...printer, autoPrint: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded" />
                <span className="text-[10px] font-bold text-slate-700 uppercase">{t.autoPrintReceipt}</span>
              </label>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button onClick={handleTestPrint} disabled={isTestingPrinter} className={`w-full py-4 rounded-2xl font-bold shadow-lg transition flex items-center justify-center space-x-2 ${isTestingPrinter ? 'bg-slate-100' : 'bg-slate-800 text-white'}`}>
              <span>{isTestingPrinter ? '⏳' : '📜'}</span>
              <span>{t.testPrint}</span>
            </button>
          </div>
        </div>
      </div>

      {/* DUMMY PRINT TEMPLATE FOR TESTING */}
      <div id="printable-receipt" className="print-only">
          <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px' }}>
            <h1 style={{ fontSize: '18pt', margin: '0', letterSpacing: '1px' }}>{t.appName}</h1>
            <p style={{ fontSize: '10pt', margin: '2px 0' }}>*** TEST PRINT ***</p>
            <div style={{ borderTop: '2px solid black', margin: '8px 0' }}></div>
          </div>
          
          <div style={{ fontSize: '10pt', margin: '10px 0' }}>
            <p>PRINTER TEST SUCCESSFUL</p>
            <p>DATE: {new Date().toLocaleDateString()}</p>
            <p>TIME: {new Date().toLocaleTimeString()}</p>
          </div>

          <div style={{ borderTop: '1px dashed black', margin: '8px 0' }}></div>

          <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '9pt' }}>
            <p style={{ margin: '0', fontStyle: 'italic' }}>Your printer is configured correctly.</p>
            <p style={{ margin: '5px 0 0' }}>Ready for business!</p>
          </div>
          
          <div style={{ height: '40mm' }}></div>
      </div>
    </div>
  );
};

export default SyncCenter;
