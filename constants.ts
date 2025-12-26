
import { Question } from './types';

// Pool of Unit 1-3 (20% of quiz = 4 questions)
// Cần ít nhất 8 câu để mỗi lần chọn 4 câu có thể thay đổi được 50%
export const POOL_U1_3: Question[] = [
  { id: 101, unit: "Unit 1", question: "We usually ______ football in the school playground at break time.", options: ["play", "plays", "playing"], correctAnswer: 0, explanation: "Hiện tại đơn với 'We' dùng V nguyên mẫu.", },
  { id: 102, unit: "Unit 1", question: "Listen! Someone ______ at the door.", options: ["knock", "knocks", "is knocking"], correctAnswer: 2, explanation: "Hành động đang xảy ra (Listen!).", },
  { id: 103, unit: "Unit 2", question: "There ______ a big table and some chairs in the kitchen.", options: ["is", "are", "be"], correctAnswer: 0, explanation: "'a big table' là số ít.", },
  { id: 104, unit: "Unit 2", question: "The cat is ______ the chair and the table.", options: ["on", "between", "under"], correctAnswer: 1, explanation: "Between... and...", },
  { id: 105, unit: "Unit 3", question: "My friend has a ______ face and short black hair.", options: ["round", "fat", "long"], correctAnswer: 0, explanation: "Mặt tròn (round face).", },
  { id: 106, unit: "Unit 3", question: "Mai is very ______. She always helps her friends.", options: ["hard-working", "kind", "creative"], correctAnswer: 1, explanation: "Tốt bụng giúp đỡ người khác.", },
  { id: 107, unit: "Unit 1", question: "I ______ my homework after school every day.", options: ["do", "does", "doing"], correctAnswer: 0, explanation: "Hiện tại đơn với 'I'.", },
  { id: 108, unit: "Unit 2", question: "Are there ______ posters on the wall?", options: ["any", "some", "a"], correctAnswer: 0, explanation: "Câu hỏi dùng 'any'.", },
  { id: 109, unit: "Unit 1", question: "My school ______ in the center of the village.", options: ["is", "are", "am"], correctAnswer: 0, explanation: "Số ít đi với 'is'.", },
  { id: 110, unit: "Unit 3", question: "She is ______ because she likes making new things.", options: ["creative", "patient", "shy"], correctAnswer: 0, explanation: "Thích tạo ra cái mới là sáng tạo.", },
];

// Pool of Unit 4-6 (80% of quiz = 16 questions)
// Cần ít nhất 32 câu để mỗi lần chọn 16 câu có thể thay đổi 50%
export const POOL_U4_6: Question[] = [
  { id: 201, unit: "Unit 4", question: "The air in the city is ______ than the air in the countryside.", options: ["polluted", "more polluted", "polluteder"], correctAnswer: 1, explanation: "So sánh hơn tính từ dài.", },
  { id: 202, unit: "Unit 4", question: "Living in a city is ______ than living in the countryside.", options: ["noisy", "noisier", "most noisy"], correctAnswer: 1, explanation: "So sánh hơn 'y' -> 'ier'.", },
  { id: 203, unit: "Unit 5", question: "Fansipan is the ______ mountain in Vietnam.", options: ["high", "higher", "highest"], correctAnswer: 2, explanation: "So sánh nhất tính từ ngắn.", },
  { id: 204, unit: "Unit 5", question: "You ______ take a waterproof coat because it often rains.", options: ["must", "mustn't", "shouldn't"], correctAnswer: 0, explanation: "Sự cần thiết (must).", },
  { id: 205, unit: "Unit 6", question: "Students ______ behave well during Tet holiday.", options: ["should", "shouldn't", "can"], correctAnswer: 0, explanation: "Lời khuyên nên làm.", },
  { id: 206, unit: "Unit 6", question: "We don't have ______ milk left. Let's go and buy some.", options: ["any", "some", "a"], correctAnswer: 0, explanation: "Câu phủ định dùng 'any'.", },
  { id: 207, unit: "Unit 4", question: "Go straight, then ______ the second turning on the left.", options: ["take", "get", "pass"], correctAnswer: 0, explanation: "Cụm từ: take the turning.", },
  { id: 208, unit: "Unit 4", question: "The bookstore is ______ to the pharmacy.", options: ["next", "opposite", "behind"], correctAnswer: 0, explanation: "Next to (kế bên).", },
  { id: 209, unit: "Unit 5", question: "Ha Long Bay is one of the most ______ in the world.", options: ["natural wonders", "natural wonder", "wonder natural"], correctAnswer: 0, explanation: "Số nhiều sau 'one of the'.", },
  { id: 210, unit: "Unit 5", question: "You ______ travel alone to the desert.", options: ["must", "mustn't", "should"], correctAnswer: 1, explanation: "Điều cấm kỵ/nguy hiểm.", },
  { id: 211, unit: "Unit 6", question: "Children ______ eat too many sweets.", options: ["should", "shouldn't", "can"], correctAnswer: 1, explanation: "Lời khuyên không nên.", },
  { id: 212, unit: "Unit 6", question: "______ do you help your parents decorate your house?", options: ["When", "What", "Who"], correctAnswer: 0, explanation: "Hỏi về thời gian.", },
  { id: 213, unit: "Unit 4", question: "Everything is ______ in this shop.", options: ["expensive", "more expensive", "expensiver"], correctAnswer: 0, explanation: "Dạng nguyên của tính từ.", },
  { id: 214, unit: "Unit 5", question: "Is there a ______ near here?", options: ["forest", "river", "mountain"], correctAnswer: 1, explanation: "Kiểm tra từ vựng thiên nhiên.", },
  { id: 215, unit: "Unit 6", question: "People often ______ their houses at Tet.", options: ["clean", "cleans", "cleaning"], correctAnswer: 0, explanation: "Hành động thường xuyên.", },
  { id: 216, unit: "Unit 4", question: "The temple is ______ than the museum.", options: ["older", "old", "more old"], correctAnswer: 0, explanation: "So sánh hơn tính từ ngắn.", },
  { id: 217, unit: "Unit 5", question: "We ______ go to the beach if it's sunny.", options: ["can", "mustn't", "shouldn't"], correctAnswer: 0, explanation: "Khả năng xảy ra.", },
  { id: 218, unit: "Unit 6", question: "Happy ______! Have a great year!", options: ["Tet", "Birthday", "Party"], correctAnswer: 0, explanation: "Chúc mừng năm mới/Tết.", },
  { id: 219, unit: "Unit 4", question: "Is the post office ______ from here?", options: ["far", "near", "next"], correctAnswer: 0, explanation: "Far from (xa khỏi đây).", },
  { id: 220, unit: "Unit 5", question: "Mount Everest is ______ than Mount Fansipan.", options: ["higher", "the highest", "high"], correctAnswer: 0, explanation: "So sánh hơn giữa 2 vật.", },
  { id: 221, unit: "Unit 6", question: "Vietnamese people celebrate Tet at the ______ of the year.", options: ["beginning", "end", "middle"], correctAnswer: 0, explanation: "Bắt đầu năm mới.", },
  { id: 222, unit: "Unit 4", question: "Wait! You ______ go when the light is red.", options: ["mustn't", "must", "should"], correctAnswer: 0, explanation: "Cấm đi đèn đỏ.", },
  { id: 223, unit: "Unit 5", question: "Take your ______ with you. It's very hot.", options: ["sun hat", "coat", "umbrella"], correctAnswer: 0, explanation: "Trời nóng mang mũ.", },
  { id: 224, unit: "Unit 6", question: "We ______ fireworks at midnight.", options: ["watch", "see", "look"], correctAnswer: 0, explanation: "Watch fireworks.", },
  { id: 225, unit: "Unit 4", question: "Da Nang is ______ than Hue.", options: ["modern", "more modern", "most modern"], correctAnswer: 1, explanation: "So sánh hơn tính từ dài.", },
  { id: 226, unit: "Unit 5", question: "Don't forget to take a ______ with you. You might get lost.", options: ["compass", "sleeping bag", "scissors"], correctAnswer: 0, explanation: "Dùng la bàn để không bị lạc.", },
  { id: 227, unit: "Unit 6", question: "What ______ should I do at Tet?", options: ["else", "other", "another"], correctAnswer: 0, explanation: "What else: Cái gì nữa.", },
  { id: 228, unit: "Unit 4", question: "The library is ______ the back of the building.", options: ["at", "in", "on"], correctAnswer: 0, explanation: "At the back of: Ở phía sau.", },
  { id: 229, unit: "Unit 5", question: "The Gobi is a very large ______.", options: ["desert", "forest", "island"], correctAnswer: 0, explanation: "Gobi là sa mạc.", },
  { id: 230, unit: "Unit 6", question: "I ______ will travel to Da Lat this Tet.", options: ["probably", "maybe", "possible"], correctAnswer: 0, explanation: "Probably dùng trong câu khẳng định.", },
  { id: 231, unit: "Unit 4", question: "This street is very ______ with many cars.", options: ["busy", "quiet", "peaceful"], correctAnswer: 0, explanation: "Nhiều xe là bận rộn/đông đúc.", },
  { id: 232, unit: "Unit 5", question: "You ______ swim here. It's dangerous.", options: ["mustn't", "should", "must"], correctAnswer: 0, explanation: "Cấm bơi vì nguy hiểm.", },
];

export const QUESTIONS = [...POOL_U1_3, ...POOL_U4_6];
