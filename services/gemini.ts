import { GoogleGenAI, Type } from "@google/genai";

/**
 * AI Content Moderation
 * Flags political, military, violent, or inappropriate content.
 */
export const moderateContent = async (text: string, imageUrl?: string) => {
  try {
    // Initialize inside the function to ensure the latest API key is used and avoid top-level process errors.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Analyze this marketplace content. Return JSON only.
    Strictly flag (isSafe: false) if the content is:
    1. Highly Political or relates to government/military conflicts.
    2. Violent, graphic, or promotes weapons.
    3. Hate speech or offensive.
    4. Prohibited goods (drugs, illegal services).
    
    Content to analyze: "${text}"`;

    // Updated contents to use simple string format as recommended for text-only prompts in the SDK guidelines.
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
            suggestedAction: { type: Type.STRING }
          },
          required: ["isSafe"]
        }
      }
    });
    
    // Access .text property directly (not a method) as per SDK instructions
    const jsonStr = response.text || '{"isSafe": true}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Moderation Error:", error);
    return { isSafe: true };
  }
};

export const suggestListingOptimization = async (title: string, description: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Updated call to use string contents and proper model configuration
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
        systemInstruction: "You are the AI support assistant for Nikjoo Marketplace. Keep responses brief and friendly. Always respond in Persian (Farsi). Always maintain platform safety."
      }
    });
    
    // sendMessage handles the state internally; response.text returns the assistant's reply.
    const response = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "خطا در ارتباط با هوش مصنوعی.";
  }
};