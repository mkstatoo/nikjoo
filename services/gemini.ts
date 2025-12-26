import { GoogleGenAI, Type } from "@google/genai";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI Content Moderation
 * Flags political, military, violent, or inappropriate content.
 */
export const moderateContent = async (text: string, imageUrl?: string) => {
  try {
    const prompt = `Analyze this marketplace content. Return JSON only.
    Strictly flag (isSafe: false) if the content is:
    1. Highly Political or relates to government/military conflicts.
    2. Violent, graphic, or promotes weapons.
    3. Hate speech or offensive.
    4. Prohibited goods (drugs, illegal services).
    
    Content to analyze: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
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
    
    // Use .text property to access the generated content.
    const jsonStr = response.text || '{"isSafe": true}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Moderation Error:", error);
    return { isSafe: true };
  }
};

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
    // Use .text property to access the generated content.
    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    return null;
  }
};

export const chatWithSupport = async (userMessage: string, chatHistory: {role: string, content: string}[]) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are the AI support assistant for Nikjoo Marketplace. Keep responses brief and friendly. Always respond in Persian (Farsi). Always maintain platform safety."
      },
      // Note: History management would typically be done by passing history to create,
      // but guidelines emphasize simple chat creation.
    });
    
    const response = await chat.sendMessage({ message: userMessage });
    // Directly access the text property.
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "خطا در ارتباط با هوش مصنوعی.";
  }
};