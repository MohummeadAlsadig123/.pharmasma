
import React from 'react';
import { AppTab, Language, Theme } from '../types';
import { translations } from '../translations';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  language: Language;
  onLock: () => void;
  pharmacyName: string;
  theme: Theme;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language, onLock, pharmacyName, theme }) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  
  const menuItems: { id: AppTab; icon: string; label: string }[] = [
    { id: 'dashboard', icon: '📊', label: t.dashboard },
    { id: 'inventory', icon: '💊', label: t.inventory },
    { id: 'wholesale', icon: '🚛', label: t.wholesale },
    { id: 'sales', icon: '🛒', label: t.sales },
    { id: 'sales-history', icon: '📑', label: t.salesHistory },
    { id: 'device-sync', icon: '🔌', label: language === 'ar' ? 'إدارة الأجهزة' : 'Hardware Manager' },
    { id: 'ai-assistant', icon: '🤖', label: t.aiAssistant },
    { id: 'licensing', icon: '🔑', label: t.licensing },
    { id: 'settings', icon: '⚙️', label: t.settings },
  ];

  return (
    <div className={`w-64 border-e h-screen flex flex-col shadow-sm select-none transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className={`p-6 border-b flex items-center space-x-3 rtl:space-x-reverse ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md">
          {pharmacyName.charAt(0)}
        </div>
        <div>
          <span className={`text-sm font-black tracking-tight leading-none block line-clamp-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{pharmacyName}</span>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Desktop OS</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-900/20' 
                : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}

        <div className={`pt-4 mt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <button
            onClick={onLock}
            className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-200 text-rose-500 hover:bg-rose-500/10 font-bold"
          >
            <span className="text-xl">🔒</span>
            <span className="text-xs font-black uppercase tracking-widest">{t.lockSystem}</span>
          </button>
        </div>
      </nav>

      <div className={`p-4 border-t space-y-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
        <div className={`rounded-xl p-4 shadow-lg ${isDark ? 'bg-slate-800' : 'bg-slate-900 text-white'}`}>
          <p className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1 text-emerald-400">{t.currentPlan}</p>
          <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-emerald-400'}`}>ENTERPRISE PRO</p>
          <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 w-full"></div>
          </div>
        </div>
        
        <div className="text-center pt-2 space-y-2">
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter leading-tight">
             {t.designedBy}
           </p>
           <div className="flex justify-center items-center gap-4">
             <a 
               href="https://wa.me/2491119790174" 
               target="_blank" 
               rel="noopener noreferrer"
               className="group flex flex-col items-center gap-1"
               title={t.whatsapp}
             >
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.484 2.247 2.247 3.484 5.232 3.484 8.404 0 6.556-5.332 11.888-11.888 11.888-2.016 0-3.999-.512-5.762-1.484l-6.125 1.705zm6.757-4.103c1.442.855 3.012 1.304 4.623 1.305 5.068 0 9.191-4.123 9.191-9.192 0-2.451-.955-4.755-2.688-6.488-1.733-1.732-4.037-2.688-6.488-2.688-5.068 0-9.192 4.123-9.192 9.191 0 1.696.468 3.35 1.354 4.805l-.995 3.636 3.73-.974zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </div>
                <span className="text-[8px] font-bold text-slate-500 group-hover:text-emerald-500 transition-colors uppercase">WhatsApp</span>
             </a>
             <a 
               href="mailto:engmohammedalsadig@gmail.com" 
               className="group flex flex-col items-center gap-1"
               title={t.email}
             >
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <span className="text-[8px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors uppercase">Email</span>
             </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
