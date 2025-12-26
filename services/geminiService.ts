
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
  if (!API_KEY) return base64Image; // Trả về ảnh gốc nếu không có key
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { text: "Hãy chỉnh sửa ảnh này thành ảnh thẻ học sinh chuyên nghiệp. YÊU CẦU NGHIÊM NGẶT: 1. Giữ nguyên khuôn mặt gốc, giới tính, các đặc điểm nhận dạng và biểu cảm của người trong ảnh. 2. Làm mịn da nhẹ nhàng (retouch) để giữ được nét tự nhiên. 3. Điều chỉnh ánh sáng sao cho mặt sáng đều, phông nền phía sau sạch sẽ (màu xanh hoặc trắng). 4. Thay trang phục thành đồng phục học sinh Việt Nam (áo sơ mi trắng có cổ) chỉnh tề, ngay ngắn. Tuyệt đối không thay đổi cấu trúc khuôn mặt." }
        ]
      },
    });
    
    // Thêm kiểm tra an toàn cho response.candidates
    const candidate = response.candidates?.[0];
    const parts = candidate?.content?.parts;
    
    if (parts) {
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
