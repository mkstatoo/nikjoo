
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize with named parameter and use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestListingOptimization = async (title: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
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
    // response.text is a property, not a method
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const chatWithSupport = async (userMessage: string, chatHistory: {role: string, content: string}[]) => {
  try {
    const chat = ai.chats.create({
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
    // response.text is a property
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "متأسفانه در اتصال به پشتیبانی مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.";
  }
};
