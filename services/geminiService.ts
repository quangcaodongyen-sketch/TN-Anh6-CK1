
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
            text: `TRANSFORM this image into a professional Vietnamese student ID photo for a secondary school student (Grade 6).
            
            STRICT RULES:
            1. FACE & IDENTITY: The original face must remain 100% recognizable. Do not change facial structure or features. The person must be facing forward, head straight, looking directly at the camera.
            2. BEAUTIFICATION: Apply subtle professional skin smoothing and natural brightening. Remove temporary blemishes like acne or dark circles. Ensure a natural, clean, and polite appearance.
            3. ATTIRE: Replace current clothing with a crisp WHITE button-up student shirt (áo sơ mi trắng có cổ) AND a traditional Vietnamese RED SCARF (khăn quàng đỏ) tied neatly around the neck. This is mandatory.
            4. COMPOSITION: Standard ID photo layout (chest up). Centered. Studio lighting style with no harsh shadows.
            5. BACKGROUND: Solid light blue background (standard for VN ID cards).
            
            The goal is a formal, beautiful student portrait for an official certificate. Output ONLY the final processed image.`
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
