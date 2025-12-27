
import { GoogleGenAI } from "@google/genai";

/**
 * Hàm giải thích câu hỏi sử dụng Gemini 3 Flash
 */
export const getAIExtraExplanation = async (question: string, answer: string, unit: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "AI explanation is unavailable.";
  
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bạn là giáo viên tiếng Anh Đinh Văn Thành. Hãy giải thích ngắn (1-2 câu) bằng tiếng Việt cho học sinh lớp 6 về câu: "${question}". Đáp án đúng: "${answer}". Nội dung: Global Success, ${unit}.`,
    });
    return response.text || "Học tốt nhé em!";
  } catch (error) {
    console.error("Explanation Error:", error);
    return "Hãy chú ý cấu trúc này nhé!";
  }
};

/**
 * Hàm tạo ảnh thẻ AI sử dụng Gemini 3 Pro Image (hoặc Flash Image làm fallback)
 */
export const beautifyPortrait = async (base64Image: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing for AI Image generation");
    return base64Image;
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  // Xử lý chuỗi base64 để lấy phần data sạch
  const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // Sử dụng model Pro để xử lý trang phục và khăn quàng chính xác hơn
      contents: {
        parts: [
          { 
            inlineData: { 
              data: cleanBase64, 
              mimeType: 'image/jpeg' 
            } 
          },
          { 
            text: `TRANSFORM this image into a professional Vietnamese student ID photo.
            
            STRICT REQUIREMENTS:
            1. IDENTITY: Keep the child's face 100% recognizable. DO NOT change their natural facial structure, eyes, or mouth.
            2. POSE: Ensure the person is facing directly forward, head level.
            3. CLOTHING: Replace current clothes with a formal WHITE Vietnamese student shirt (áo sơ mi trắng có cổ) and a neat RED SCARF (khăn quàng đỏ) around the neck.
            4. SKIN: Apply very subtle, natural skin smoothing. Keep it looking like a real photo, not a cartoon.
            5. BACKGROUND: Use a solid, clear light blue background.
            6. LIGHTING: Ensure even studio-quality lighting on the face.
            
            Output ONLY the modified image. No text response needed.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });
    
    // Kiểm tra và trích xuất phần dữ liệu ảnh từ response
    const candidate = response.candidates?.[0];
    if (candidate && candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in AI response");
  } catch (error: any) {
    console.error("Beautify Error:", error);
    
    // Nếu lỗi "Requested entity was not found" hoặc lỗi model Pro, thử lại với model Flash
    if (error.message?.includes("not found") || error.message?.includes("model")) {
      try {
        const aiFlash = new GoogleGenAI({ apiKey });
        const retryResponse = await aiFlash.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              { inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } },
              { text: "Make this a formal student ID photo with white shirt, red scarf, and blue background. Keep original face." }
            ]
          }
        });
        
        const part = retryResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (part?.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      } catch (retryError) {
        console.error("Retry Error:", retryError);
      }
    }
    
    return base64Image;
  }
};
