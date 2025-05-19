import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const defaultGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "application/json",
};

/**
 * Dynamically creates a chat session with a given model name.
 * @param {string} modelName - The Gemini model name, e.g., "gemini-2.0-flash" or "gemini-pro"
 * @returns {Promise<ChatSession>}
 */
export const createChatSession = async (modelName) => {
  const model = genAI.getGenerativeModel({ model: modelName });
  return model.startChat({
    generationConfig: defaultGenerationConfig,
    history: [],
  });
};
