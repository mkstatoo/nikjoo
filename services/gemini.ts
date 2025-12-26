
import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  try {
    // استفاده از typeof برای جلوگیری از خطا در صورتی که process تعریف نشده باشد
    const key = typeof process !== 'undefined' ? process.env.API_KEY : null;
    if (!key || key === 'your_gemini_api_key_here') {
      console.warn("Gemini API Key is missing. Please set API_KEY in your environment variables.");
      return null;
    }
    return key;
  } catch (e) {
    return null;
  }
};

export const suggestListingOptimization = async (title: string, description: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return { suggestedTitle: title, suggestedDescription: description };

  try {
    const genAI = new GoogleGenAI({ apiKey });
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest improvements for this marketplace listing to sell faster. Title: ${title}, Description: ${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTitle: { type: Type.STRING },
            suggestedDescription: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedPriceRange: { type: Type.STRING }
          },
          required: ["suggestedTitle", "suggestedDescription", "keywords"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    return null;
  }
};

export const chatWithSupport = async (userMessage: string, chatHistory: {role: string, content: string}[]) => {
  const apiKey = getApiKey();
  if (!apiKey) return "سیستم هوش مصنوعی در حال حاضر پیکربندی نشده است. لطفاً کلید API را در تنظیمات پنل مدیریت وارد کنید.";

  try {
    const genAI = new GoogleGenAI({ apiKey });
    const chat = genAI.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are the AI support assistant for Nikjoo Marketplace. Help users with listing items, finding products, and platform rules. Keep responses brief and friendly. Always respond in Persian (Farsi)."
      },
      history: chatHistory.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })),
    });
    
    const response = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "در حال حاضر ارتباط با دستیار هوشمند با اختلال مواجه است. لطفاً دقایقی دیگر تلاش کنید.";
  }
};
