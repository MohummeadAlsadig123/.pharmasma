
import { GoogleGenAI, Modality } from "@google/genai";
import { Language, Medicine } from "../types";

/**
 * Local Fallback logic for offline mode
 */
const getOfflineResponse = (prompt: string, language: Language, inventory: Medicine[]) => {
  const query = prompt.toLowerCase();
  const t = {
    en: {
      intro: "I am running in Offline Mode. I can only search your current inventory.",
      noMatch: "I couldn't find specific clinical info for that offline, but I can check your stock.",
      found: "I found this in your stock:",
      stock: "Stock",
      price: "Price"
    },
    ar: {
      intro: "أعمل في وضع عدم الاتصال. يمكنني فقط البحث في مخزونك الحالي.",
      noMatch: "لم أتمكن من العثور على معلومات سريرية محددة دون اتصال، ولكن يمكنني التحقق من توفر الدواء.",
      found: "وجدت هذا في مخزونك:",
      stock: "المخزون",
      price: "السعر"
    }
  }[language];

  // Simple keyword matching for inventory
  const matches = inventory.filter(m => 
    query.includes(m.name.toLowerCase()) || 
    query.includes(m.genericName.toLowerCase()) ||
    m.name.toLowerCase().includes(query)
  );

  if (matches.length > 0) {
    let response = `**${t.intro}**\n\n${t.found}\n\n`;
    matches.slice(0, 3).forEach(m => {
      response += `- **${m.name}** (${m.genericName})\n  ${t.stock}: ${m.stock} | ${t.price}: ${m.price}\n\n`;
    });
    return response;
  }

  return `**${t.intro}**\n\n${t.noMatch}`;
};

export const getAIAssistantResponse = async (prompt: string, language: Language = 'en', inventory: Medicine[] = []) => {
  // If offline, use local heuristics instead of failing
  if (!navigator.onLine) {
    return getOfflineResponse(prompt, language, inventory);
  }

  try {
    // Correctly initialize GoogleGenAI inside the function as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const inventoryContext = inventory.slice(0, 30).map(m => `${m.name} (${m.genericName}) - Stock: ${m.stock}`).join(', ');

    // Upgrade: Using gemini-3-pro-preview for specialized clinical advice
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { 
            text: `You are PharmaSmart AI, a highly specialized clinical pharmacist assistant. 
                   User's Local Inventory Context: ${inventoryContext}.
                   User Language Preference: ${language === 'ar' ? 'Arabic' : 'English'}.
                   
                   User Question: ${prompt}
                   
                   Guidelines:
                   1. Respond in ${language === 'ar' ? 'Arabic' : 'English'}.
                   2. Use the local inventory context if the user asks about what is in stock.
                   3. Provide professional clinical advice, dosages, and interactions.
                   4. Remind the user that clinical judgment is their responsibility.
                   5. Format with clear headings.`
          }
        ]
      },
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Assistant Error:", error);
    // Graceful fallback to offline logic if API fails for any reason
    return getOfflineResponse(prompt, language, inventory);
  }
};

export const generateSpeech = async (text: string, language: Language = 'en') => {
  if (!navigator.onLine) return null;

  try {
    // Correctly initialize GoogleGenAI inside the function as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = language === 'ar' 
      ? `تحدث بوضوح وبنبرة مهنية كصيدلي خبير: ${text}`
      : `Speak clearly and professionally as an expert pharmacist: ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("Speech Generation Error:", error);
    return null;
  }
};

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
