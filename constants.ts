
import { Question } from './types';

// Pool of Unit 1-3 (Lấy 4 câu mỗi lần)
export const POOL_U1_3: Question[] = [
  { id: 101, unit: "Unit 1: My New School", question: "Students ______ their school uniform on Mondays.", options: ["wear", "wears", "wearing"], correctAnswer: 0, explanation: "Chủ ngữ số nhiều 'Students' đi với động từ nguyên mẫu ở hiện tại đơn.", },
  { id: 102, unit: "Unit 1: My New School", question: "Look! The students ______ in the school playground.", options: ["play", "plays", "are playing"], correctAnswer: 2, explanation: "Dấu hiệu 'Look!' cho biết hành động đang xảy ra (Hiện tại tiếp diễn).", },
  { id: 103, unit: "Unit 2: My House", question: "The cat is ______ the lamp and the computer.", options: ["under", "between", "next to"], correctAnswer: 1, explanation: "Giới từ 'between' đi kèm với 'and' để chỉ vị trí ở giữa hai vật.", },
  { id: 104, unit: "Unit 2: My House", question: "There ______ a large cupboard in the kitchen.", options: ["is", "are", "be"], correctAnswer: 0, explanation: "'There is' dùng cho danh từ số ít 'a large cupboard'.", },
  { id: 105, unit: "Unit 3: My Friends", question: "Lan is very ______. She always spends a lot of time on her homework.", options: ["kind", "hard-working", "funny"], correctAnswer: 1, explanation: "Dành nhiều thời gian làm bài tập là người chăm chỉ (hard-working).", },
  { id: 106, unit: "Unit 3: My Friends", question: "My best friend has ______ hair and a round face.", options: ["short black", "long black", "curly black"], correctAnswer: 0, explanation: "Mô tả ngoại hình phổ biến trong Unit 3.", },
  { id: 107, unit: "Unit 1: My New School", question: "Do you ______ your new friends at school?", options: ["like", "likes", "liking"], correctAnswer: 0, explanation: "Trong câu hỏi với trợ động từ 'Do', động từ chính ở dạng nguyên mẫu.", },
  { id: 108, unit: "Unit 2: My House", question: "Are there ______ posters on the wall in your bedroom?", options: ["a", "some", "any"], correctAnswer: 2, explanation: "Dùng 'any' trong câu hỏi với danh từ số nhiều.", },
  { id: 109, unit: "Unit 3: My Friends", question: "Phong is ______; he likes to tell jokes and make us laugh.", options: ["clever", "funny", "creative"], correctAnswer: 1, explanation: "Kể chuyện cười và làm người khác cười là người hài hước (funny).", },
  { id: 110, unit: "Unit 1: My New School", question: "We have ______ on Tuesdays and Thursdays.", options: ["English", "history", "science"], correctAnswer: 0, explanation: "Tên môn học trong SGK thường bắt đầu bằng chữ viết hoa.", }
];

// Pool of Unit 4-6 (Lấy 16 câu mỗi lần)
export const POOL_U4_6: Question[] = [
  { id: 201, unit: "Unit 4: My Neighbourhood", question: "The air in the countryside is ______ than the air in the city.", options: ["cleaner", "more cleaner", "the cleanest"], correctAnswer: 0, explanation: "So sánh hơn của tính từ ngắn: adj-er + than.", },
  { id: 202, unit: "Unit 4: My Neighbourhood", question: "Living in a city is ______ than living in the countryside.", options: ["expensive", "more expensive", "most expensive"], correctAnswer: 1, explanation: "So sánh hơn của tính từ dài: more + adj + than.", },
  { id: 203, unit: "Unit 5: Natural Wonders", question: "Fansipan is the ______ mountain in Vietnam.", options: ["high", "higher", "highest"], correctAnswer: 2, explanation: "So sánh nhất của tính từ ngắn: the + adj-est.", },
  { id: 204, unit: "Unit 5: Natural Wonders", question: "You ______ travel alone to the desert. It's very dangerous.", options: ["must", "mustn't", "should"], correctAnswer: 1, explanation: "'mustn't' diễn tả sự cấm đoán không được làm vì nguy hiểm.", },
  { id: 205, unit: "Unit 6: Our Tet Holiday", question: "Children ______ ask for lucky money at Tet.", options: ["should", "shouldn't", "must"], correctAnswer: 1, explanation: "Theo bài học về phong tục Tết, đây là lời khuyên về phép lịch sự.", },
  { id: 206, unit: "Unit 6: Our Tet Holiday", question: "We ______ buy some peach blossoms to decorate our house.", options: ["should", "shouldn't", "mustn't"], correctAnswer: 0, explanation: "Lời khuyên nên làm (should) để chuẩn bị cho Tết.", },
  { id: 207, unit: "Unit 4: My Neighbourhood", question: "The convenience store is ______ the bakery and the pharmacy.", options: ["on", "between", "behind"], correctAnswer: 1, explanation: "Cấu trúc 'between A and B'.", },
  { id: 208, unit: "Unit 4: My Neighbourhood", question: "Go ______ then take the second turning on the left.", options: ["straight", "right", "ahead"], correctAnswer: 0, explanation: "Chỉ đường: 'Go straight' (Đi thẳng).", },
  { id: 209, unit: "Unit 5: Natural Wonders", question: "Ha Long Bay is one of the most famous ______ in the world.", options: ["natural wonders", "natural wonder", "wonder naturals"], correctAnswer: 0, explanation: "Cụm danh từ 'natural wonders' (kỳ quan thiên nhiên).", },
  { id: 210, unit: "Unit 5: Natural Wonders", question: "Don't forget to pack a ______ because it's very hot and sunny there.", options: ["sleeping bag", "sun hat", "walking boots"], correctAnswer: 1, explanation: "Trời nắng nóng cần mang theo mũ chống nắng (sun hat).", },
  { id: 211, unit: "Unit 6: Our Tet Holiday", question: "Vietnamese people usually ______ their houses before Tet.", options: ["decorate", "decorates", "decorating"], correctAnswer: 0, explanation: "Hiện tại đơn cho thói quen, chủ ngữ số nhiều.", },
  { id: 212, unit: "Unit 6: Our Tet Holiday", question: "At Tet, we ______ our grandparents and relatives.", options: ["visit", "visits", "visiting"], correctAnswer: 0, explanation: "Thói quen thăm hỏi người thân dịp Tết.", },
  { id: 213, unit: "Unit 4: My Neighbourhood", question: "The streets in my neighbourhood are very ______ during the day.", options: ["quiet", "busy", "peaceful"], correctAnswer: 1, explanation: "Đường phố ban ngày thường đông đúc, nhộn nhịp (busy).", },
  { id: 214, unit: "Unit 5: Natural Wonders", question: "Is Ba Be Lake the ______ natural lake in Vietnam?", options: ["large", "larger", "largest"], correctAnswer: 2, explanation: "So sánh nhất trong câu hỏi xác nhận kỷ lục.", },
  { id: 215, unit: "Unit 6: Our Tet Holiday", question: "We don't ______ any special food for Tet this year.", options: ["cook", "buy", "have"], correctAnswer: 0, explanation: "'Cook food' là cụm từ phổ biến trong Unit 6.", },
  { id: 216, unit: "Unit 4: My Neighbourhood", question: "My house is ______ to the supermarket.", options: ["next", "near", "opposite"], correctAnswer: 0, explanation: "Cấu trúc 'next to' (ngay cạnh).", },
  { id: 217, unit: "Unit 5: Natural Wonders", question: "A ______ is a large area of water surrounded by land.", options: ["river", "lake", "forest"], correctAnswer: 1, explanation: "Định nghĩa về 'lake' (hồ) trong bài học.", },
  { id: 218, unit: "Unit 6: Our Tet Holiday", question: "People often give ______ to children at Tet.", options: ["lucky money", "presents", "flowers"], correctAnswer: 0, explanation: "Phong tục lì xì (lucky money) của người Việt.", },
  { id: 219, unit: "Unit 4: My Neighbourhood", question: "Is the cinema ______ from your school?", options: ["near", "far", "next"], correctAnswer: 1, explanation: "Cấu trúc 'far from' (xa cách).", },
  { id: 220, unit: "Unit 5: Natural Wonders", question: "You ______ bring a compass; you might get lost in the forest.", options: ["must", "mustn't", "shouldn't"], correctAnswer: 0, explanation: "Sự cần thiết bắt buộc (must).", }
];

export const QUESTIONS = [...POOL_U1_3, ...POOL_U4_6];
