
import { Question } from './types';

// Pool of Unit 1-3 (Lấy 4 câu mỗi lần)
export const POOL_U1_3: Question[] = [
  { id: 101, unit: "Unit 1", question: "We usually ______ football in the school playground at break time.", options: ["play", "plays", "playing"], correctAnswer: 0, explanation: "Hiện tại đơn với 'We' dùng động từ nguyên mẫu.", },
  { id: 102, unit: "Unit 1", question: "Listen! Someone ______ at the door.", options: ["knock", "knocks", "is knocking"], correctAnswer: 2, explanation: "Dấu hiệu 'Listen!' cho biết hành động đang xảy ra (Hiện tại tiếp diễn).", },
  { id: 103, unit: "Unit 2", question: "There ______ a big table and some chairs in the kitchen.", options: ["is", "are", "be"], correctAnswer: 0, explanation: "Cấu trúc 'There is' đi với danh từ số ít đầu tiên 'a big table'.", },
  { id: 104, unit: "Unit 2", question: "The cat is ______ the chair and the table.", options: ["on", "between", "under"], correctAnswer: 1, explanation: "Giới từ 'between' đi kèm với 'and'.", },
  { id: 105, unit: "Unit 3", question: "My friend has a ______ face and short black hair.", options: ["round", "fat", "long"], correctAnswer: 0, explanation: "Mô tả khuôn mặt thường dùng 'round' (tròn).", },
  { id: 106, unit: "Unit 3", question: "Mai is very ______. She always helps her friends.", options: ["hard-working", "kind", "creative"], correctAnswer: 1, explanation: "Hay giúp đỡ người khác là người tốt bụng (kind).", },
  { id: 107, unit: "Unit 1", question: "I ______ my homework after school every day.", options: ["do", "does", "doing"], correctAnswer: 0, explanation: "Chủ ngữ 'I' đi với động từ nguyên mẫu 'do' ở hiện tại đơn.", },
  { id: 108, unit: "Unit 2", question: "Are there ______ posters on the wall?", options: ["any", "some", "a"], correctAnswer: 0, explanation: "Trong câu nghi vấn ta dùng 'any'.", },
  { id: 109, unit: "Unit 1", question: "My school ______ in the center of the village.", options: ["is", "are", "am"], correctAnswer: 0, explanation: "Chủ ngữ số ít 'My school' dùng to-be 'is'.", },
  { id: 110, unit: "Unit 3", question: "She is ______ because she likes making new things.", options: ["creative", "patient", "shy"], correctAnswer: 0, explanation: "Thích tạo ra cái mới là người sáng tạo (creative).", },
  { id: 111, unit: "Unit 2", question: "The clock is ______ the wall.", options: ["on", "at", "in"], correctAnswer: 0, explanation: "Đồng hồ treo 'trên' tường dùng 'on'.", },
  { id: 112, unit: "Unit 3", question: "Phong is ______; he likes to tell jokes.", options: ["funny", "clever", "boring"], correctAnswer: 0, explanation: "Người hay kể chuyện cười là người hài hước (funny).", },
  { id: 113, unit: "Unit 1", question: "They ______ to school by bus every morning.", options: ["go", "goes", "going"], correctAnswer: 0, explanation: "Chủ ngữ số nhiều 'They' đi với động từ nguyên mẫu 'go'.", },
  { id: 114, unit: "Unit 2", question: "The bathroom is ______ to the bedroom.", options: ["next", "near", "opposite"], correctAnswer: 0, explanation: "Cấu trúc 'next to' nghĩa là kế bên.", },
  { id: 115, unit: "Unit 3", question: "Minh is ______; he learns things very quickly.", options: ["clever", "kind", "shy"], correctAnswer: 0, explanation: "Người thông minh (clever) học mọi thứ rất nhanh.", }
];

// Pool of Unit 4-6 (Lấy 16 câu mỗi lần)
export const POOL_U4_6: Question[] = [
  { id: 201, unit: "Unit 4", question: "The air in the city is ______ than the air in the countryside.", options: ["polluted", "more polluted", "polluteder"], correctAnswer: 1, explanation: "So sánh hơn của tính từ dài: more + adj + than.", },
  { id: 202, unit: "Unit 4", question: "Living in a city is ______ than living in the countryside.", options: ["noisy", "noisier", "most noisy"], correctAnswer: 1, explanation: "Tính từ ngắn kết thúc bằng 'y' đổi thành 'ier' trong so sánh hơn.", },
  { id: 203, unit: "Unit 5", question: "Fansipan is the ______ mountain in Vietnam.", options: ["high", "higher", "highest"], correctAnswer: 2, explanation: "So sánh nhất của tính từ ngắn: the + adj-est.", },
  { id: 204, unit: "Unit 5", question: "You ______ take a waterproof coat because it often rains.", options: ["must", "mustn't", "shouldn't"], correctAnswer: 0, explanation: "Diễn tả sự cần thiết hoặc bắt buộc phải làm.", },
  { id: 205, unit: "Unit 6", question: "Students ______ behave well during Tet holiday.", options: ["should", "shouldn't", "can"], correctAnswer: 0, explanation: "Lời khuyên về việc nên làm (should).", },
  { id: 206, unit: "Unit 6", question: "We don't have ______ milk left. Let's go and buy some.", options: ["any", "some", "a"], correctAnswer: 0, explanation: "Câu phủ định dùng 'any' cho danh từ không đếm được.", },
  { id: 207, unit: "Unit 4", question: "Go straight, then ______ the second turning on the left.", options: ["take", "get", "pass"], correctAnswer: 0, explanation: "Cụm từ chỉ đường: 'take the turning'.", },
  { id: 208, unit: "Unit 4", question: "The bookstore is ______ to the pharmacy.", options: ["next", "opposite", "behind"], correctAnswer: 0, explanation: "Giới từ chỉ vị trí: 'next to' (kế bên).", },
  { id: 209, unit: "Unit 5", question: "Ha Long Bay is one of the most ______ in the world.", options: ["natural wonders", "natural wonder", "wonder natural"], correctAnswer: 0, explanation: "Sau 'one of the' dùng danh từ số nhiều.", },
  { id: 210, unit: "Unit 5", question: "You ______ travel alone to the desert.", options: ["must", "mustn't", "should"], correctAnswer: 1, explanation: "Cấm đoán hoặc cảnh báo không được làm vì nguy hiểm.", },
  { id: 211, unit: "Unit 6", question: "Children ______ eat too many sweets.", options: ["should", "shouldn't", "can"], correctAnswer: 1, explanation: "Lời khuyên không nên làm (shouldn't).", },
  { id: 212, unit: "Unit 6", question: "______ do you help your parents decorate your house?", options: ["When", "What", "Who"], correctAnswer: 0, explanation: "Hỏi về thời điểm thực hiện hành động.", },
  { id: 213, unit: "Unit 4", question: "Everything is ______ in this shop.", options: ["expensive", "more expensive", "expensiver"], correctAnswer: 0, explanation: "Tính từ nguyên mẫu bổ nghĩa cho danh từ.", },
  { id: 214, unit: "Unit 5", question: "Is there a ______ near here?", options: ["forest", "river", "mountain"], correctAnswer: 1, explanation: "Từ vựng về thiên nhiên (con sông).", },
  { id: 215, unit: "Unit 6", question: "People often ______ their houses at Tet.", options: ["clean", "cleans", "cleaning"], correctAnswer: 0, explanation: "Thói quen ở hiện tại với chủ ngữ số nhiều.", },
  { id: 216, unit: "Unit 4", question: "The temple is ______ than the museum.", options: ["older", "old", "more old"], correctAnswer: 0, explanation: "So sánh hơn tính từ ngắn 'old' -> 'older'.", },
  { id: 217, unit: "Unit 5", question: "We ______ go to the beach if it's sunny.", options: ["can", "mustn't", "shouldn't"], correctAnswer: 0, explanation: "Diễn tả khả năng (can).", },
  { id: 218, unit: "Unit 6", question: "Happy ______! Have a great year!", options: ["Tet", "Birthday", "Party"], correctAnswer: 0, explanation: "Lời chúc mừng năm mới truyền thống.", },
  { id: 219, unit: "Unit 4", question: "Is the post office ______ from here?", options: ["far", "near", "next"], correctAnswer: 0, explanation: "Cấu trúc 'far from' (xa nơi nào).", },
  { id: 220, unit: "Unit 5", question: "Mount Everest is ______ than Mount Fansipan.", options: ["higher", "the highest", "high"], correctAnswer: 0, explanation: "So sánh hơn giữa 2 ngọn núi.", },
  { id: 221, unit: "Unit 6", question: "Vietnamese people celebrate Tet at the ______ of the year.", options: ["beginning", "end", "middle"], correctAnswer: 0, explanation: "Tet là dịp đầu năm mới.", },
  { id: 222, unit: "Unit 4", question: "Wait! You ______ go when the light is red.", options: ["mustn't", "must", "should"], correctAnswer: 0, explanation: "Luật giao thông bắt buộc không được đi (mustn't).", },
  { id: 223, unit: "Unit 5", question: "Take your ______ with you. It's very hot.", options: ["sun hat", "coat", "umbrella"], correctAnswer: 0, explanation: "Đồ vật dùng khi trời nắng nóng.", },
  { id: 224, unit: "Unit 6", question: "We ______ fireworks at midnight.", options: ["watch", "see", "look"], correctAnswer: 0, explanation: "Dùng 'watch' cho hành động theo dõi sự kiện.", },
  { id: 225, unit: "Unit 4", question: "Da Nang is ______ than Hue.", options: ["modern", "more modern", "most modern"], correctAnswer: 1, explanation: "So sánh hơn tính từ dài 'modern'.", },
  { id: 226, unit: "Unit 5", question: "Don't forget to take a ______ with you. You might get lost.", options: ["compass", "sleeping bag", "scissors"], correctAnswer: 0, explanation: "Dùng la bàn (compass) để định hướng.", },
  { id: 227, unit: "Unit 6", question: "What ______ should I do at Tet?", options: ["else", "other", "another"], correctAnswer: 0, explanation: "What else: Còn gì khác nữa không.", },
  { id: 228, unit: "Unit 4", question: "The library is ______ the back of the building.", options: ["at", "in", "on"], correctAnswer: 0, explanation: "At the back of: Ở phía sau của.", },
  { id: 229, unit: "Unit 5", question: "The Gobi is a very large ______.", options: ["desert", "forest", "island"], correctAnswer: 0, explanation: "Sa mạc Gobi.", },
  { id: 230, unit: "Unit 6", question: "I ______ will travel to Da Lat this Tet.", options: ["probably", "maybe", "possible"], correctAnswer: 0, explanation: "Trạng từ chỉ khả năng đứng sau chủ ngữ.", },
  { id: 231, unit: "Unit 4", question: "This street is very ______ with many cars.", options: ["busy", "quiet", "peaceful"], correctAnswer: 0, explanation: "Nhiều xe cộ là đường phố đông đúc/bận rộn.", },
  { id: 232, unit: "Unit 5", question: "You ______ swim here. It's dangerous.", options: ["mustn't", "should", "must"], correctAnswer: 0, explanation: "Cảnh báo nguy hiểm (mustn't).", },
  { id: 233, unit: "Unit 4", question: "Can you ______ me the way to the park?", options: ["tell", "say", "speak"], correctAnswer: 0, explanation: "Tell someone the way: Chỉ đường cho ai.", },
  { id: 234, unit: "Unit 5", question: "You should pack your ______ to clean your teeth.", options: ["toothbrush", "torch", "plaster"], correctAnswer: 0, explanation: "Dùng bàn chải để đánh răng.", },
  { id: 235, unit: "Unit 6", question: "We should ______ our ancestors at Tet.", options: ["remember", "forget", "miss"], correctAnswer: 0, explanation: "Tưởng nhớ tổ tiên dịp Tết.", },
  { id: 236, unit: "Unit 4", question: "The neighborhood is ______ and quiet.", options: ["peaceful", "noisy", "crowded"], correctAnswer: 0, explanation: "Yên tĩnh và thanh bình.", },
  { id: 237, unit: "Unit 5", question: "A ______ is a large area of water surrounded by land.", options: ["lake", "mountain", "valley"], correctAnswer: 0, explanation: "Định nghĩa về hồ nước.", },
  { id: 238, unit: "Unit 6", question: "They ______ luck at Tet.", options: ["bring", "take", "get"], correctAnswer: 0, explanation: "Mang lại sự may mắn.", },
  { id: 239, unit: "Unit 4", question: "I like living here because the people are ______.", options: ["friendly", "friend", "friendship"], correctAnswer: 0, explanation: "Dùng tính từ mô tả tính cách con người.", },
  { id: 240, unit: "Unit 5", question: "Don't ______ any litter in the park.", options: ["leave", "take", "pick"], correctAnswer: 0, explanation: "Cấm xả rác (leave litter).", },
  { id: 241, unit: "Unit 6", question: "People often ______ a lot of special food at Tet.", options: ["cook", "buy", "eat"], correctAnswer: 0, explanation: "Tết thường nấu rất nhiều món ăn đặc biệt.", },
  { id: 242, unit: "Unit 4", question: "Is your neighborhood ______ than mine?", options: ["cheaper", "cheap", "more cheap"], correctAnswer: 0, explanation: "So sánh hơn của tính từ ngắn 'cheap'.", },
  { id: 243, unit: "Unit 5", question: "A ______ is a mountain with a hole in the top where lava comes out.", options: ["volcano", "valley", "forest"], correctAnswer: 0, explanation: "Định nghĩa về núi lửa.", },
  { id: 244, unit: "Unit 6", question: "We ______ plant trees at the beginning of spring.", options: ["should", "shouldn't", "mustn't"], correctAnswer: 0, explanation: "Lời khuyên bảo vệ môi trường dịp Tết.", },
  { id: 245, unit: "Unit 4", question: "My house is ______ the pharmacy and the bakery.", options: ["between", "near", "opposite"], correctAnswer: 0, explanation: "Between... and... (ở giữa 2 vật).", }
];

export const QUESTIONS = [...POOL_U1_3, ...POOL_U4_6];
