import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "../types";

const getAI = () => new GoogleGenerativeAI(API_KEY);

export const getWeddingAdvice = async (
  prompt: string,
  history: any[],
  imageUri?: string
) => {
  const ai = getAI();

  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: "You are Marianne's personal, expert wedding planner. Your tone is warm, elegant, and supportive. You help with logistics, design, and emotional support. If she provides an image, analyze it and give specific feedback based on her wedding style."
  });

  const parts: any[] = [{ text: prompt }];


  if (imageUri) {
    const base64Data = imageUri.split(',')[1];
    parts.push({
      inlineData: { data: base64Data, mimeType: "image/jpeg" }
    });
  }

  const result = await model.generateContent({
    contents: [...history, { role: 'user', parts }]
  });

  const response = result.response;
  return response.text();
};

/** * Nano Banana image generation is removed. 
 * Marianne can now save real inspiration photos 
 * she takes or finds directly to her phone.
 */