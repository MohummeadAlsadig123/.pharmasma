
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface LockScreenProps {
  language: Language;
  onActivate: (key: string) => void;
}

const VALID_PURCHASE_KEYS = [
  'PH-LITE-OFFLINE-2025',
  'PH-PRO-AI-SYNC-2025',
  'PH-ENT-UNLIMITED-2025'
];

const LockScreen: React.FC<LockScreenProps> = ({ language, onActivate }) => {
  const t = translations[language];
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState(false);

  const handleActivate = () => {
    if (VALID_PURCHASE_KEYS.includes(inputKey.trim())) {
      onActivate(inputKey.trim());
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-slate-900 p-6 ${language === 'ar' ? 'font-arabic' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-emerald-500/20">
            P
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{t.appName} AI</h1>
          <p className="text-slate-400 text-sm">{t.activationRequired}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ps-1">{t.enterKeyToUnlock}</label>
            <input 
              type="text" 
              placeholder="XXXX-XXXX-XXXX-XXXX" 
              value={inputKey}
              // Fix: Correctly access the 'value' property from the event target before calling toUpperCase()
              onChange={(e) => setInputKey(e.target.value.toUpperCase())}
              className={`w-full bg-white/10 border ${error ? 'border-rose-50 border-rose-500/50 text-rose-200 animate-shake' : 'border-white/10'} rounded-2xl px-6 py-4 text-white font-mono text-xl text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600`}
            />
          </div>

          {error && (
            <p className="text-rose-400 text-xs text-center font-bold animate-pulse">{t.invalidKey}</p>
          )}

          <button 
            onClick={handleActivate}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-900/40 transition-all active:scale-95 flex items-center justify-center space-x-3 rtl:space-x-reverse"
          >
            <span className="text-xl">🔑</span>
            <span>{t.activate}</span>
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <div className="mb-4">
            <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md text-[9px] font-black uppercase tracking-[0.2em] mb-1 border border-emerald-500/20">System Developer</span>
            <p className="text-white text-xs font-black uppercase tracking-widest mb-1">
               {t.designedBy}
            </p>
            <div className="flex justify-center items-center gap-3 text-emerald-400 font-bold text-[10px]">
               <a href="https://wa.me/2491119790174" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                  <span>💬 01119790174</span>
               </a>
               <span className="text-white/10">•</span>
               <a href="mailto:engmohammedalsadig@gmail.com" className="flex items-center gap-1 hover:text-white transition-colors">
                  <span>✉️ Email</span>
               </a>
            </div>
          </div>
          <p className="text-slate-500 text-[10px] mb-4 opacity-50">{t.contactDistributor}</p>
          <div className="flex justify-center space-x-4 rtl:space-x-reverse text-slate-400">
            <button className="text-[10px] uppercase font-bold hover:text-white transition">Terms</button>
            <span className="text-white/10">•</span>
            <button className="text-[10px] uppercase font-bold hover:text-white transition">Privacy</button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default LockScreen;
