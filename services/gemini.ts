import { GoogleGenAI, Type } from "@google/genai";

/**
 * AI Content Moderation & Anti-Spam
 * Flags political, military, violent, inappropriate, or bot-generated content.
 */
export const moderateContent = async (text: string, imageUrl?: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Analyze this marketplace content for safety and authenticity. Return JSON only.
    Strictly flag (isSafe: false) if the content is:
    1. Political/Military/Violence: Content relating to conflicts or prohibited weapons.
    2. Bot/Spam Patterns: Repetitive characters, nonsensical strings, or typical automated marketing spam.
    3. Hate Speech/Offensive: Direct attacks or inappropriate language.
    4. Prohibited Goods: Illegal substances or services.
    
    Content to analyze: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
            confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 1" },
            isBotLikely: { type: Type.BOOLEAN, description: "True if the text looks machine-generated or spammy" }
          },
          required: ["isSafe", "isBotLikely"]
        }
      }
    });
    
    const jsonStr = response.text || '{"isSafe": true, "isBotLikely": false}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Moderation Error:", error);
    return { isSafe: true, isBotLikely: false };
  }
};

export const suggestListingOptimization = async (title: string, description: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    return null;
  }
};

export const chatWithSupport = async (userMessage: string, chatHistory: {role: string, content: string}[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are the AI support assistant for Nikjoo Market. Keep responses brief and friendly. Always respond in Persian (Farsi). Always maintain platform safety. If you detect a bot or spammer, decline further interaction politely."
      }
    });
    
    const response = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "خطا در ارتباط با هوش مصنوعی.";
  }
};