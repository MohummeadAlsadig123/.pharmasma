
import React, { useState, useRef, useEffect } from 'react';
import { getAIAssistantResponse, generateSpeech, decodeBase64, decodeAudioData } from '../services/geminiService';
import { Language, Medicine } from '../types';
import { translations } from '../translations';

interface Message {
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  audioBase64?: string;
}

interface AIAssistantProps {
  language: Language;
  medicines: Medicine[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ language, medicines }) => {
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      content: language === 'ar' 
        ? "مرحباً! أنا فارما سمارت الذكي. يمكنني مساعدتك في التفاعلات الدوائية، استعلامات الجرعات، دعم القرار السريري، والبدائل العلمية. كيف يمكنني مساعدتك اليوم؟" 
        : "Hello! I'm PharmaSmart AI. I can assist you with drug interactions, dosage queries, clinical decision support, and generic alternatives. How can I help you today?", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Call service (it now handles offline logic internally)
    const aiResponseText = await getAIAssistantResponse(input, language, medicines);
    
    if (aiResponseText) {
      const aiMsg: Message = { 
        role: 'ai', 
        content: aiResponseText, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMsg]);
      
      if (autoSpeak && aiResponseText && isOnline) {
        handleSpeak(messages.length + 1, aiResponseText);
      }
    } else {
       setMessages(prev => [...prev, { 
        role: 'system', 
        content: language === 'ar' ? 'فشل الاتصال المحلي والذكاء الاصطناعي.' : 'AI and Local connection failed.', 
        timestamp: new Date() 
      }]);
    }
    
    setIsLoading(false);
  };

  const handleSpeak = async (idx: number, text: string) => {
    if (!isOnline) return;

    if (isSpeaking === idx) {
      stopAudio();
      return;
    }

    stopAudio();
    setIsSpeaking(idx);

    try {
      const base64Audio = await generateSpeech(text, language);
      if (!base64Audio) {
        setIsSpeaking(null);
        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const audioBuffer = await decodeAudioData(
        decodeBase64(base64Audio),
        audioContextRef.current,
        24000,
        1
      );

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        setIsSpeaking(null);
        activeSourceRef.current = null;
      };

      activeSourceRef.current = source;
      source.start();
    } catch (err) {
      console.error("Audio Playback Error:", err);
      setIsSpeaking(null);
    }
  };

  const stopAudio = () => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
      } catch (e) {}
      activeSourceRef.current = null;
    }
    setIsSpeaking(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t.aiTitle}</h1>
          <p className="text-sm text-slate-500">
            {isOnline ? t.aiSubtitle : (language === 'ar' ? 'وضع البحث المحلي (غير متصل)' : 'Local Search Mode (Offline)')}
          </p>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
             <input 
                type="checkbox" 
                checked={autoSpeak} 
                disabled={!isOnline}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300 disabled:opacity-50"
             />
             <span className={`text-xs font-bold text-slate-500 uppercase tracking-widest ${!isOnline ? 'opacity-50' : ''}`}>{t.autoSpeak}</span>
          </label>
          <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span>{isOnline ? t.coreAIOnline : (language === 'ar' ? 'مساعد محلي' : 'Local Assistant')}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border rounded-3xl shadow-sm flex flex-col overflow-hidden relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl shadow-sm ${
                  msg.role === 'user' ? 'bg-emerald-600 text-white' : 
                  msg.role === 'system' ? 'bg-rose-100 text-rose-600' : 
                  'bg-slate-100 text-slate-600'}`}>
                  {msg.role === 'user' ? '👤' : msg.role === 'system' ? '⚠️' : '🤖'}
                </div>
                <div className={`relative group p-4 rounded-3xl ${
                  msg.role === 'user' ? 'bg-emerald-600 text-white' : 
                  msg.role === 'system' ? 'bg-rose-50 border border-rose-100 text-rose-800' : 
                  'bg-slate-50 text-slate-700 border'}`}>
                  {msg.role === 'ai' && isOnline && (
                    <button 
                      onClick={() => handleSpeak(idx, msg.content)}
                      className={`absolute -top-3 ${language === 'ar' ? '-left-3' : '-right-3'} w-8 h-8 rounded-full flex items-center justify-center shadow-md border transition-all ${
                        isSpeaking === idx ? 'bg-rose-500 text-white border-rose-600 animate-pulse' : 'bg-white text-emerald-600 hover:scale-110 border-slate-100'
                      }`}
                      title={isSpeaking === idx ? t.stopAudio : t.listen}
                    >
                      {isSpeaking === idx ? '⏹️' : '🔊'}
                    </button>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>
                  <div className={`flex items-center mt-2 opacity-60 ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    {isSpeaking === idx && <span className="text-[9px] me-2 font-bold uppercase tracking-tighter text-rose-500 animate-pulse">{t.speaking}</span>}
                    <p className="text-[10px]">
                      {msg.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-slate-50 border px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-xs text-slate-400 font-medium italic">{isOnline ? t.analyzing : (language === 'ar' ? 'جاري البحث محلياً...' : 'Searching local database...')}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t">
          <div className="relative max-w-4xl mx-auto">
            <input 
              type="text" 
              placeholder={isOnline ? t.askAI : (language === 'ar' ? 'اسأل عن دواء في مخزونك...' : 'Search medicine in your inventory...')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full ps-6 pe-16 py-4 bg-white border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`absolute inset-y-2 end-2 w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                input.trim() ? 'bg-emerald-600 text-white shadow-lg hover:scale-105 active:scale-95' : 'bg-slate-100 text-slate-300'
              }`}
            >
              🚀
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-widest">
            {isOnline 
              ? (language === 'ar' ? 'يجب التحقق من ردود الذكاء الاصطناعي من مراجع سريرية' : 'AI responses should be verified with clinical references')
              : (language === 'ar' ? 'وضع عدم الاتصال: البحث محدود بالمخزون الحالي' : 'Offline Mode: Search limited to current inventory')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
