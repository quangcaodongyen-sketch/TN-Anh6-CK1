
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
            text: `TRANSFORM this image into a strictly professional Vietnamese student ID photo.
            
            STRICT RULES:
            1. FACE & IDENTITY: Keep the original face 100% recognizable. Do not change facial structure, eyes, nose, or mouth. Ensure the head is straight and looking directly at the camera.
            2. BEAUTIFICATION: Apply subtle, professional skin smoothing and brightening. Remove temporary blemishes (acne, dark circles) but keep natural features. Expression should be natural and polite.
            3. ATTIRE: Replace the current outfit with a crisp, formal, ironed WHITE Vietnamese student button-up shirt with a neat collar (áo sơ mi trắng có cổ).
            4. COMPOSITION: Standard ID photo layout (head and shoulders/chest up). Centered head position.
            5. BACKGROUND: Use a solid, standard light blue background (or clean white as per ID photo standards).
            6. LIGHTING: Even, professional studio lighting with no harsh shadows.
            
            The final result must look like a formal school registration photo used for official certificates. Do not add accessories or other people.
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
