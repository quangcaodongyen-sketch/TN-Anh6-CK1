
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getAIExtraExplanation = async (question: string, answer: string, unit: string) => {
  if (!API_KEY) return "AI explanation is unavailable (API Key missing).";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bạn là một giáo viên tiếng Anh nhiệt huyết. Hãy giải thích ngắn gọn (tối đa 3 câu) bằng tiếng Việt cho học sinh lớp 6 về ngữ pháp hoặc từ vựng của câu hỏi sau: "${question}". Đáp án đúng là: "${answer}". Câu hỏi thuộc chương trình English 6 Global Success, ${unit}.`,
    });
    return response.text || "Xin lỗi, mình không thể tìm thấy giải thích lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hệ thống AI đang bận, bạn hãy xem phần giải thích có sẵn nhé!";
  }
};
