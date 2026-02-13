
import React, { useState } from 'react';
import { MOCK_LICENSES } from '../constants';
import { LicenseKey, Language } from '../types';
import { translations } from '../translations';

interface LicensingProps {
  language: Language;
  onDeactivate: () => void;
}

const Licensing: React.FC<LicensingProps> = ({ language, onDeactivate }) => {
  const t = translations[language];
  const [keys, setKeys] = useState<LicenseKey[]>(MOCK_LICENSES);
  const [inputKey, setInputKey] = useState('');

  const activeLicenseFromStorage = localStorage.getItem('pharma_license_key');

  const activateKey = () => {
    if (!inputKey.trim()) return;
    const newKey: LicenseKey = {
      key: inputKey,
      status: 'active',
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().split('T')[0],
      tier: 'Pro'
    };
    setKeys([newKey, ...keys]);
    setInputKey('');
  };

  const handleDeactivate = () => {
    if (confirm(t.confirmDeactivate)) {
      onDeactivate();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2 py-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
          🔑
        </div>
        <h1 className="text-3xl font-bold text-slate-800">{t.licenseKeysTitle}</h1>
        <p className="text-slate-500">{t.licenseKeysSubtitle}</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{t.activateNewKey}</label>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <input 
              type="text" 
              placeholder="XXXX-XXXX-XXXX-XXXX" 
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="flex-1 px-5 py-4 bg-slate-50 border rounded-2xl font-mono text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button 
              onClick={activateKey}
              className="px-8 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition"
            >
              {t.activate}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3 italic">
            {language === 'ar' ? '* يتم توفير مفاتيح الشراء من قبل الموزعين المعتمدين.' : '* Purchase keys are provided by authorized distributors for PharmaSmart AI.'}
          </p>
        </div>

        <div className="pt-8 border-t">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{t.linkedLicenses}</h3>
          <div className="space-y-4">
            {/* Display the actual active key from local storage first */}
            {activeLicenseFromStorage && (
              <div className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="text-start">
                    <p className="font-mono font-bold text-emerald-700">{activeLicenseFromStorage} (ACTIVE)</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                      {language === 'ar' ? 'الجهاز الحالي مفعل' : 'This device is currently activated'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleDeactivate}
                  className="mt-4 md:mt-0 px-4 py-2 bg-rose-100 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-200 transition"
                >
                  {t.deactivateLicense}
                </button>
              </div>
            )}

            {keys.map((k, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-50 border rounded-2xl">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className={`w-3 h-3 rounded-full ${k.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                  <div className="text-start">
                    <p className="font-mono font-bold text-slate-700">{k.key}</p>
                    <p className="text-xs text-slate-500 flex items-center mt-1">
                      <span className="font-semibold uppercase me-2 bg-slate-200 px-1.5 py-0.5 rounded text-[10px]">{k.tier} Edition</span>
                      {language === 'ar' ? 'تنتهي في' : 'Expires'}: {new Date(k.expiryDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-3 rtl:space-x-reverse">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    k.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {language === 'ar' ? (k.status === 'active' ? 'نشط' : 'قيد الانتظار') : k.status.toUpperCase()}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600">⋮</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <FeatureTier tier="Lite" price={language === 'ar' ? 'مجاني' : 'Free'} icon="🌱" features={language === 'ar' ? ['مخزون أساسي', 'قاعدة بيانات محلية', 'بدون مساعد ذكي'] : ['Basic Inventory', 'Local Database', 'No AI Assistant']} language={language} />
        <FeatureTier tier="Pro" price={language === 'ar' ? '$49/شهرياً' : '$49/mo'} icon="🚀" features={language === 'ar' ? ['مخزون كامل', 'وصول للمساعد الذكي', '5 مستخدمين', 'مزامنة التطبيق'] : ['Full Inventory', 'Basic AI Access', '5 Users', 'Mobile App Sync']} highlighted language={language} />
        <FeatureTier tier="Enterprise" price={language === 'ar' ? '$199/شهرياً' : '$199/mo'} icon="🏢" features={language === 'ar' ? ['كل شيء غير محدود', 'ذكاء اصطناعي متقدم', 'دعم أولوية', 'وصول واجهة برمجة'] : ['Unlimited Everything', 'Advanced AI Diagnostics', 'Priority Support', 'API Access']} language={language} />
      </div>
    </div>
  );
};

const FeatureTier: React.FC<{ tier: string; price: string; icon: string; features: string[]; highlighted?: boolean; language: Language }> = ({ tier, price, icon, features, highlighted, language }) => (
  <div className={`p-6 rounded-3xl border transition-all hover:shadow-xl ${highlighted ? 'bg-emerald-600 text-white shadow-lg border-emerald-500 scale-105' : 'bg-white text-slate-700 shadow-sm hover:border-emerald-200'}`}>
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-1">{tier}</h3>
    <p className={`text-2xl font-black mb-6 ${highlighted ? 'text-white' : 'text-emerald-600'}`}>{price}</p>
    <ul className="space-y-3">
      {features.map((f, i) => (
        <li key={i} className="flex items-center space-x-2 text-sm text-start">
          <span className={highlighted ? 'text-emerald-200' : 'text-emerald-500'}>✓</span>
          <span className={highlighted ? 'text-emerald-50' : 'text-slate-600'}>{f}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full mt-8 py-3 rounded-xl font-bold transition ${highlighted ? 'bg-white text-emerald-600 hover:bg-emerald-50' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
      {language === 'ar' ? 'ترقية' : 'Upgrade'}
    </button>
  </div>
);

export default Licensing;
