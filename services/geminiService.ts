
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
            text: `TRANSFORM this person into a professional Vietnamese student ID photo. 
            STRICT CONSTRAINTS:
            1. FACE PRESERVATION: KEEP THE ORIGINAL FACE 100% EXACTLY AS IS. Do not change the shape of eyes, nose, mouth, or bone structure. The person must be perfectly recognizable.
            2. BEAUTIFICATION: Apply professional high-end retouching. Smooth skin naturally, remove blemishes/acne, even out skin tone, and subtly brighten the eyes for a fresh, energetic look.
            3. ATTIRE: Replace current clothing with a clean, crisp, formal white Vietnamese student button-up shirt with a neat collar (áo sơ mi trắng học sinh có cổ).
            4. GROOMING: Make the hair look neat and tidy, ensuring ears are visible if possible, and eyes are looking directly at the camera.
            5. COMPOSITION: Solid light blue background (standard for VN ID photos). Lighting should be bright, balanced studio lighting.
            6. AESTHETICS: Make the student look at their absolute best—neat, smart, and handsome/beautiful to encourage their learning spirit.
            Output ONLY the final image data.`
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
