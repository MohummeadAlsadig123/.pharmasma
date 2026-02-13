
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface DesktopClientProps {
  language: Language;
}

const DesktopClient: React.FC<DesktopClientProps> = ({ language }) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  const buildCommand = "npm run build:windows";
  
  const packageJson = {
    "name": "pharmasmart-ai",
    "productName": "PharmaSmart AI",
    "version": "2.1.0",
    "description": "Professional Pharmacy Management System",
    "main": "electron-main.js",
    "scripts": {
      "start": "electron .",
      "dist": "electron-builder",
      "build:windows": "electron-builder --win portable"
    },
    "build": {
      "appId": "com.pharmasmart.app",
      "win": {
        "target": "portable",
        "icon": "icon.png"
      },
      "directories": {
        "output": "dist/windows"
      }
    },
    "dependencies": {
      "electron": "^30.0.0"
    },
    "devDependencies": {
      "electron-builder": "^24.0.0"
    }
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(buildCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Section */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl shadow-emerald-500/20 animate-pulse">
            💻
          </div>
          <div className="text-center md:text-start space-y-2">
            <h1 className="text-4xl font-black tracking-tight">
              {language === 'ar' ? 'بوابة تطبيقات ويندوز' : 'Windows Desktop Portal'}
            </h1>
            <p className="text-slate-400 font-medium max-w-xl">
              {language === 'ar' 
                ? 'حول نظامك إلى تطبيق ويندوز مستقل يعمل بكفاءة عالية ويدعم الطباعة المباشرة دون الحاجة لمتصفح.' 
                : 'Convert your system into a standalone Windows application that runs with high performance and supports silent printing.'}
            </p>
          </div>
          <div className="ms-auto flex flex-col items-center md:items-end gap-2">
             <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Version 2.1.0-Native</span>
             <div className="flex -space-x-2 rtl:space-x-reverse">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/user${i}/32/32`} className="w-8 h-8 rounded-full border-2 border-slate-900" alt="user" />
                ))}
             </div>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Build Status Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="me-3">🛠️</span>
              {language === 'ar' ? 'تجهيز ملف الـ EXE' : 'Prepare .EXE Bundle'}
            </h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  {language === 'ar' 
                    ? 'لاستخدام التطبيق كبرنامج مثبت على ويندوز، قم بتنفيذ الأمر التالي في مجلد المشروع:' 
                    : 'To use the application as a standalone Windows program, execute this command in your project folder:'}
                </p>
                <div className="flex items-center gap-3">
                   <code className="flex-1 bg-slate-900 text-emerald-400 px-5 py-4 rounded-xl font-mono text-sm shadow-inner overflow-x-auto whitespace-nowrap">
                     {buildCommand}
                   </code>
                   <button 
                     onClick={copyCommand}
                     className={`p-4 rounded-xl font-bold transition-all shadow-md ${copied ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                   >
                     {copied ? '✅' : '📋'}
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                   <h3 className="text-indigo-800 font-bold text-sm mb-1">{language === 'ar' ? 'دعم الطابعات' : 'Printer Bridge'}</h3>
                   <p className="text-[11px] text-indigo-600/80 leading-relaxed">
                     {language === 'ar' 
                      ? 'نسخة سطح المكتب تتصل مباشرة بمنفذ USB لتوفير طباعة أسرع بكثير.' 
                      : 'The desktop version connects directly to the USB port for much faster printing results.'}
                   </p>
                </div>
                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                   <h3 className="text-amber-800 font-bold text-sm mb-1">{language === 'ar' ? 'وضع الأوفلاين' : 'Offline Engine'}</h3>
                   <p className="text-[11px] text-amber-600/80 leading-relaxed">
                     {language === 'ar' 
                      ? 'حفظ البيانات محلياً على القرص الصلب يضمن بقاء سجلاتك آمنة حتى بدون إنترنت.' 
                      : 'Saving data locally on the hard drive ensures your records stay safe even without internet.'}
                   </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="me-3">📦</span>
                {language === 'ar' ? 'متطلبات النظام' : 'System Requirements'}
             </h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'OS', val: 'Win 10/11' },
                  { label: 'RAM', val: '4GB Min' },
                  { label: 'Storage', val: '200MB' },
                  { label: 'Architecture', val: 'x64 / ARM' }
                ].map((req, i) => (
                  <div key={i} className="text-center p-4 bg-slate-50 rounded-2xl border">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{req.label}</p>
                    <p className="font-bold text-slate-700">{req.val}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Config Sidebar */}
        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">package.json</h2>
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6 font-mono text-[11px] leading-relaxed text-indigo-300 overflow-x-auto">
              <pre>{JSON.stringify(packageJson, null, 2)}</pre>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
               <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-4">Ready for build</p>
               <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition shadow-lg shadow-emerald-900/40">
                 {language === 'ar' ? 'بدء التحويل الآن' : 'Start Build Process'}
               </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
         <p className="text-slate-400 text-xs font-medium">
           {language === 'ar' 
             ? 'ملاحظة: نسخة الحاسوب توفر ثباتاً أكبر للصيدليات المزدحمة.' 
             : 'Note: The desktop version provides greater stability for busy pharmacies.'}
         </p>
      </div>
    </div>
  );
};

export default DesktopClient;
