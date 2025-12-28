
import { Question, Difficulty } from './types';

const generateSGKQuestions = (difficulty: Difficulty): Question[] => {
  const data: Partial<Question>[] = [
    // Unit 1
    { unit: "Unit 1", question: "At my school, we often ______ judo in the afternoon.", options: ["do", "play", "have", "go"], correctAnswer: 0, explanation: "Cụm từ: do judo." },
    { unit: "Unit 1", question: "They ______ their school uniform every Monday.", options: ["wear", "wears", "wearing", "to wear"], correctAnswer: 0, explanation: "Hiện tại đơn với They." },
    { unit: "Unit 1", question: "I like my school. The ______ are very friendly.", options: ["classmates", "homework", "subjects", "calculators"], correctAnswer: 0, explanation: "Bạn cùng lớp (classmates) thân thiện." },
    
    // Unit 2
    { unit: "Unit 2", question: "The cat is ______ the desk and the chair.", options: ["between", "next to", "in front", "under"], correctAnswer: 0, explanation: "Between ... and ... (ở giữa)." },
    { unit: "Unit 2", question: "We often have dinner in the ______.", options: ["dining room", "bathroom", "attic", "hall"], correctAnswer: 0, explanation: "Dining room: phòng ăn." },
    { unit: "Unit 2", question: "There ______ a large cupboard in my bedroom.", options: ["is", "are", "be", "am"], correctAnswer: 0, explanation: "There is + danh từ số ít." },
    
    // Unit 3
    { unit: "Unit 3", question: "Phong ______ telling jokes. He is very funny.", options: ["likes", "is liking", "like", "to like"], correctAnswer: 0, explanation: "Hiện tại đơn diễn tả sở thích." },
    { unit: "Unit 3", question: "She has ______ hair and blue eyes.", options: ["long black", "black long", "short fat", "blue"], correctAnswer: 0, explanation: "Trật tự tính từ: Length -> Color." },
    { unit: "Unit 3", question: "Look! Mai ______ a book in the library.", options: ["is reading", "reads", "read", "reading"], correctAnswer: 0, explanation: "Hiện tại tiếp diễn với Look!." },
    
    // Unit 4
    { unit: "Unit 4", question: "Is the air in your city ______ than in the countryside?", options: ["more polluted", "polluteder", "most polluted", "polluted"], correctAnswer: 0, explanation: "So sánh hơn của tính từ dài." },
    { unit: "Unit 4", question: "Go ______ ahead, then turn right.", options: ["straight", "past", "next", "left"], correctAnswer: 0, explanation: "Go straight ahead: đi thẳng." },
    { unit: "Unit 4", question: "The building is ______ than that one.", options: ["taller", "more tall", "tallest", "the tallest"], correctAnswer: 0, explanation: "So sánh hơn tính từ ngắn." },

    // Unit 5
    { unit: "Unit 5", question: "You ______ take a waterproof coat. It's raining.", options: ["must", "mustn't", "needn't", "can"], correctAnswer: 0, explanation: "Sự bắt buộc/cần thiết." },
    { unit: "Unit 5", question: "Ha Long Bay is one of the most famous ______ in Vietnam.", options: ["natural wonders", "deserts", "islands", "caves"], correctAnswer: 0, explanation: "Kỳ quan thiên nhiên." },
    { unit: "Unit 5", question: "Mount Everest is the ______ mountain in the world.", options: ["highest", "higher", "high", "the highest"], correctAnswer: 0, explanation: "So sánh nhất." },

    // Unit 6
    { unit: "Unit 6", question: "At Tet, children ______ ask for lucky money.", options: ["shouldn't", "should", "must", "can"], correctAnswer: 0, explanation: "Lời khuyên phong tục." },
    { unit: "Unit 6", question: "We often ______ our house before Tet holiday.", options: ["decorate", "clean", "sweep", "break"], correctAnswer: 0, explanation: "Decorate: trang trí." },
    { unit: "Unit 6", question: "Tet is a time for family ______.", options: ["gatherings", "homework", "schooling", "working"], correctAnswer: 0, explanation: "Family gatherings: sum họp gia đình." }
  ];

  const vocabs: Partial<Question>[] = [
    { unit: "Vocabulary", question: "What is this? 📏", options: ["Ruler", "Compass", "Pencil", "Rubber"], correctAnswer: 0, explanation: "Ruler: thước kẻ." },
    { unit: "Vocabulary", question: "Where do we study? 🏫", options: ["School", "Hospital", "Cinema", "Museum"], correctAnswer: 0, explanation: "School: trường học." },
    { unit: "Vocabulary", question: "What sport is this? ⚽", options: ["Football", "Volleyball", "Judo", "Tennis"], correctAnswer: 0, explanation: "Football: bóng đá." },
    { unit: "Vocabulary", question: "Guess the room: 🛋️", options: ["Living room", "Kitchen", "Bedroom", "Bathroom"], correctAnswer: 0, explanation: "Living room: phòng khách." }
  ];

  const pool = [...data, ...vocabs];
  
  return pool.map((q, i) => ({
    id: (difficulty === 'BASIC' ? 100 : difficulty === 'INTERMEDIATE' ? 300 : 500) + i,
    question: q.question!,
    options: q.options!,
    correctAnswer: q.correctAnswer!,
    explanation: q.explanation!,
    unit: q.unit!,
    difficulty
  }));
};

export const QUESTIONS = [
  ...generateSGKQuestions('BASIC'),
  ...generateSGKQuestions('INTERMEDIATE'),
  ...generateSGKQuestions('ADVANCED')
];
