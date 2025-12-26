
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getAIExtraExplanation = async (question: string, answer: string, unit: string) => {
  if (!API_KEY) return "AI explanation is unavailable.";
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bạn là giáo viên tiếng Anh Đinh Văn Thành. Hãy giải thích ngắn (1-2 câu) bằng tiếng Việt cho học sinh lớp 6 về câu: "${question}". Đáp án đúng: "${answer}". Nội dung: Global Success, ${unit}.`,
    });
    return response.text || "Học tốt nhé em!";
  } catch (error) {
    return "Hãy chú ý cấu trúc này nhé!";
  }
};

export const beautifyPortrait = async (base64Image: string) => {
  if (!API_KEY) return base64Image;
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { 
            text: `TRANSFORM this image into a professional, perfect Vietnamese student ID photo. 
            CORE INSTRUCTIONS:
            1. FACE: KEEP THE ORIGINAL FACE 100% RECOGNIZABLE. Do not change facial structure, eyes, nose, or mouth shape. 
            2. BEAUTIFY: Apply professional "high-end" skin retouching. Make the skin look perfectly smooth, bright, and glowing naturally. Remove all blemishes, acne, and dark circles.
            3. ATTIRE: Replace the current outfit with a crisp, clean, formal white Vietnamese student button-up shirt (áo sơ mi trắng có cổ). It should look ironed and neat.
            4. GROOMING: Make the hair look very tidy and well-groomed. Ensure eyes are bright and looking directly at the camera.
            5. COMPOSITION: Use a solid, standard light blue background (ID photo style). Lighting must be bright, professional studio lighting that makes the student look energetic and smart.
            6. VIBE: The student should look very beautiful/handsome, neat, and ready for school to encourage their learning spirit.
            Output ONLY the final processed image data.`
          }
        ]
      },
    });
    
    const candidate = response.candidates?.[0];
    const parts = candidate?.content?.parts;
    
    if (parts && parts.length > 0) {
      for (const part of parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return base64Image;
  } catch (error) {
    console.error("Beautify Error:", error);
    return base64Image;
  }
};
