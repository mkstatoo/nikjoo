
import { GoogleGenAI, Type } from "@google/genai";

// Cache Keys
const MODERATION_CACHE_KEY = 'nikjoo_ai_mod_cache';
const OPTIMIZATION_CACHE_KEY = 'nikjoo_ai_opt_cache';

/**
 * Local Knowledge Base for Support (Offline Responses)
 * Reduces API calls for common platform questions.
 */
const LOCAL_FAQ: Record<string, string> = {
  "سلام": "سلام! خوش آمدید. چطور می‌توانم به شما کمک کنم؟",
  "چطور آگهی ثبت کنم": "برای ثبت آگهی، کافیست از منوی پایین روی دکمه + (ثبت آگهی) کلیک کنید و مراحل را دنبال کنید.",
  "امنیت": "نیکجو از سیستم‌های هوشمند برای شناسایی کلاهبرداران استفاده می‌کند، اما همیشه توصیه می‌شود معامله را حضوری و در جای شلوغ انجام دهید.",
  "هزینه": "ثبت آگهی در نیکجو کاملاً رایگان است و همیشه رایگان خواهد ماند.",
  "قوانین": "قوانین نیکجو بر اساس تجارت الکترونیک کشور تنظیم شده است. می‌توانید در بخش حقوقی پروفایل آن‌ها را مطالعه کنید.",
  "اینماد": "نیکجو دارای نماد اعتماد الکترونیک است و تمامی فعالیت‌های آن قانونی می‌باشد."
};

/**
 * Basic Local Keyword Moderation
 * Catches obvious violations without using API credits.
 */
const basicLocalCheck = (text: string): { isSafe: boolean; reason?: string } | null => {
  const forbiddenKeywords = ['سیاسی', 'نظامی', 'اسلحه', 'مواد مخدر', 'قمار', 'شرط بندی'];
  const spamPattern = /(.)\1{7,}/; // Matches 8+ identical consecutive characters
  
  for (const word of forbiddenKeywords) {
    if (text.includes(word)) return { isSafe: false, reason: "محتوای غیرمجاز (فیلتر محلی)" };
  }
  
  if (spamPattern.test(text)) return { isSafe: false, reason: "اسپم شناسایی شد (تکرار نویسه)" };
  
  return null;
};

const getCache = (key: string) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : {};
};

const setCache = (key: string, input: string, output: any) => {
  const cache = getCache(key);
  cache[input.substring(0, 100)] = output; // Store first 100 chars as key
  localStorage.setItem(key, JSON.stringify(cache));
};

/**
 * AI Content Moderation with Caching & Local Pre-check
 */
export const moderateContent = async (text: string) => {
  // 1. Local Pre-check (No Cost)
  const localCheck = basicLocalCheck(text);
  if (localCheck) return { ...localCheck, isBotLikely: false };

  // 2. Check Cache
  const cache = getCache(MODERATION_CACHE_KEY);
  if (cache[text.substring(0, 100)]) return cache[text.substring(0, 100)];

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze this marketplace content for safety. Return JSON only. Content: "${text}"`;

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
            isBotLikely: { type: Type.BOOLEAN }
          },
          required: ["isSafe", "isBotLikely"]
        }
      }
    });
    
    const result = JSON.parse(response.text || '{"isSafe": true, "isBotLikely": false}');
    setCache(MODERATION_CACHE_KEY, text, result);
    return result;
  } catch (error) {
    console.error("AI Moderation Error:", error);
    return { isSafe: true, isBotLikely: false };
  }
};

/**
 * AI Listing Optimization with Caching
 */
export const suggestListingOptimization = async (title: string, description: string) => {
  const cacheInput = `${title}|${description}`;
  const cache = getCache(OPTIMIZATION_CACHE_KEY);
  if (cache[cacheInput.substring(0, 100)]) return cache[cacheInput.substring(0, 100)];

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest improvements for: Title: ${title}, Description: ${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTitle: { type: Type.STRING },
            suggestedDescription: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["suggestedTitle", "suggestedDescription", "keywords"]
        }
      }
    });
    const result = JSON.parse(response.text || '{}');
    setCache(OPTIMIZATION_CACHE_KEY, cacheInput, result);
    return result;
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    return null;
  }
};

/**
 * Smart Chat Support with Local FAQ Interception
 */
export const chatWithSupport = async (userMessage: string, chatHistory: {role: string, content: string}[]) => {
  // 1. Check Offline Knowledge Base
  const normalizedMsg = userMessage.trim();
  for (const [key, value] of Object.entries(LOCAL_FAQ)) {
    if (normalizedMsg.includes(key)) return value;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are the AI support for Nikjoo Market. Be brief. Respond in Persian."
      }
    });
    
    const response = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error) {
    return "متاسفم، در حال حاضر ارتباط من با سرور قطع شده است.";
  }
};