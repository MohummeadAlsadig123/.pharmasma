
import React from 'react';
import { AppSettings, Language, Sale, Purchase } from '../types';
import { translations } from '../translations';

interface SettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  language: Language;
  sales: Sale[];
  purchases: Purchase[];
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, language, sales, purchases }) => {
  const t = translations[language];

  const handleExportData = () => {
    const data = {
      sales,
      purchases,
      settings,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PharmaSmart_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isDark = settings.theme === 'dark';

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-3xl text-white shadow-xl shadow-emerald-500/20">
          ⚙️
        </div>
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.settings}</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t.appearance} & {t.dataManagement}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pharmacy Details Card */}
        <div className={`p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h2 className={`text-lg font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <span>🏥</span> {t.pharmacyDetails}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t.pharmacyNameLabel}</label>
              <input 
                type="text" 
                value={settings.pharmacyName}
                onChange={(e) => setSettings({ ...settings, pharmacyName: e.target.value })}
                className={`w-full px-5 py-4 rounded-2xl border transition-all focus:ring-2 focus:ring-emerald-500 outline-none font-bold ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              />
            </div>
          </div>
        </div>

        {/* Appearance Card */}
        <div className={`p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h2 className={`text-lg font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <span>🎨</span> {t.appearance}
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.darkMode}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Toggle Interface Theme</p>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, theme: isDark ? 'light' : 'dark' })}
                className={`w-14 h-8 rounded-full relative transition-all ${isDark ? 'bg-emerald-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${isDark ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="space-y-2">
              <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.fontSize}</p>
              <div className={`flex p-1 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                {(['small', 'medium', 'large'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setSettings({ ...settings, fontSize: size })}
                    className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${settings.fontSize === size ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
                  >
                    {t[size as keyof typeof t] as string}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Support Card */}
        <div className={`p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h2 className={`text-lg font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <span>🤝</span> {t.contactSupport}
          </h2>
          <div className="space-y-5">
             <a href="https://wa.me/2491119790174" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 transition-all border border-emerald-500/10 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">💬</div>
                <div className="flex-1">
                   <p className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{t.whatsapp}</p>
                   <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>01119790174</p>
                </div>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
             </a>
             <a href="mailto:engmohammedalsadig@gmail.com" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-500/5 hover:bg-slate-500/10 transition-all border border-slate-500/10 group">
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white shadow-lg">✉️</div>
                <div className="flex-1 overflow-hidden">
                   <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{t.email}</p>
                   <p className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>engmohammedalsadig@gmail.com</p>
                </div>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
             </a>
          </div>
        </div>

        {/* Data Security Card */}
        <div className={`p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
           <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className={`text-lg font-bold mb-2 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <span>🛡️</span> {t.dataSecurity}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {t.dataDescription}
                </p>
              </div>
              <div className="flex gap-4">
                 <div className="flex-1 px-4 py-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-[9px] font-black text-emerald-500 uppercase">{t.totalBills}</p>
                    <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{sales.length + purchases.length}</p>
                 </div>
                 <button 
                   onClick={handleExportData}
                   className="flex-1 px-4 py-4 bg-slate-800 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[9px] shadow-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                 >
                   <span>💾</span> {t.exportData}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
