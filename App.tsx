
import React, { useState, useCallback, useEffect } from 'react';
import { QuizState, Question } from './types';
import { QUESTIONS } from './constants';
import { getAIExtraExplanation } from './services/geminiService';

// Utility function to shuffle an array (Fisher-Yates)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<QuizState>('START');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const startQuiz = () => {
    const shuffled = shuffleArray(QUESTIONS);
    setCurrentQuestions(shuffled);
    setGameState('QUIZ');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowExplanation(false);
    setAiExplanation(null);
  };

  const handleAnswer = (optionIndex: number) => {
    if (showExplanation) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
    setShowExplanation(true);
  };

  const askAI = async () => {
    if (isAiLoading || currentQuestions.length === 0) return;
    setIsAiLoading(true);
    const q = currentQuestions[currentQuestionIndex];
    const explanation = await getAIExtraExplanation(
      q.question, 
      q.options[q.correctAnswer],
      q.unit
    );
    setAiExplanation(explanation);
    setIsAiLoading(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
      setAiExplanation(null);
    } else {
      setGameState('RESULT');
    }
  };

  const restart = () => {
    setGameState('START');
  };

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === currentQuestions[idx].correctAnswer) score++;
    });
    return score;
  };

  const activeQuestion = currentQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-700 mb-2 font-['Quicksand']">English 6 Quiz 📝</h1>
        <p className="text-sky-600 font-medium italic">Global Success - Semester 1 Review</p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-sky-200 transition-all duration-300">
        
        {/* START SCREEN */}
        {gameState === 'START' && (
          <div className="p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="mb-6">
              <img 
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600&h=300" 
                alt="English Study" 
                className="rounded-xl w-full object-cover h-48 shadow-inner"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sẵn sàng ôn thi cuối kỳ?</h2>
            <p className="text-gray-600 mb-8">
              Cùng luyện tập 20 câu hỏi trắc nghiệm bám sát nội dung sách Global Success (Unit 1 - Unit 6). Mỗi lần chơi câu hỏi sẽ được trộn ngẫu nhiên!
            </p>
            <button 
              onClick={startQuiz}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Bắt đầu ngay 🚀
            </button>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {gameState === 'QUIZ' && activeQuestion && (
          <div className="p-6 md:p-8 animate-in slide-in-from-right duration-300">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-sky-600">
                  Câu {currentQuestionIndex + 1} / {currentQuestions.length}
                </span>
                <span className="text-sm font-semibold text-sky-600">
                  {Math.round(((currentQuestionIndex + 1) / currentQuestions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-sky-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-sky-500 h-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-2">
              <span className="inline-block bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider mb-2">
                {activeQuestion.unit}
              </span>
              <h3 className="text-xl font-bold text-gray-800 leading-tight">
                {activeQuestion.question}
              </h3>
            </div>

            <div className="space-y-3 mt-6">
              {activeQuestion.options.map((option, idx) => {
                const isSelected = userAnswers[currentQuestionIndex] === idx;
                const isCorrect = activeQuestion.correctAnswer === idx;
                
                let buttonStyle = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ";
                
                if (!showExplanation) {
                  buttonStyle += "border-sky-100 hover:border-sky-400 hover:bg-sky-50 text-gray-700 hover:shadow-md";
                } else {
                  if (isCorrect) {
                    buttonStyle += "bg-emerald-100 border-emerald-500 text-emerald-800 shadow-sm scale-[1.02]";
                  } else if (isSelected && !isCorrect) {
                    buttonStyle += "bg-rose-100 border-rose-500 text-rose-800";
                  } else {
                    buttonStyle += "border-gray-100 text-gray-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showExplanation}
                    className={buttonStyle}
                  >
                    <div className="flex items-center">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold transition-colors ${
                        showExplanation && isCorrect ? 'bg-emerald-500 text-white' : 
                        showExplanation && isSelected && !isCorrect ? 'bg-rose-500 text-white' : 
                        'bg-sky-200 text-sky-700'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl mb-4">
                  <p className="text-sm font-bold text-yellow-800 mb-1 flex items-center gap-1">
                    <span role="img" aria-label="light-bulb">💡</span> Giải thích:
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {activeQuestion.explanation}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={askAI}
                    disabled={isAiLoading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center shadow-md hover:opacity-90 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    ) : (
                      <span className="mr-2">✨</span>
                    )}
                    Hỏi AI Teacher
                  </button>

                  <button 
                    onClick={nextQuestion}
                    className="flex-1 bg-sky-600 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center shadow-md hover:bg-sky-700 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {currentQuestionIndex === currentQuestions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'} 
                    <span className="ml-2">→</span>
                  </button>
                </div>

                {aiExplanation && (
                  <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl relative animate-in slide-in-from-bottom-2 duration-300">
                    <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">AI Teacher Says</div>
                    <p className="text-gray-700 text-sm italic leading-relaxed">
                      "{aiExplanation}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* RESULT SCREEN */}
        {gameState === 'RESULT' && (
          <div className="p-8 text-center animate-in zoom-in duration-500">
            <div className="mb-6 relative inline-block">
              <svg className="w-48 h-48 drop-shadow-lg">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="transparent"
                  stroke="#e0f2fe"
                  strokeWidth="12"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="transparent"
                  stroke="#0284c7"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - calculateScore() / currentQuestions.length)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-sky-800">{calculateScore()}/{currentQuestions.length}</span>
                <span className="text-sm font-medium text-sky-600">Đúng</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {calculateScore() >= 15 ? 'Tuyệt vời quá! 🎉' : calculateScore() >= 10 ? 'Khá tốt rồi! 👍' : 'Cố gắng thêm nhé! 💪'}
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Bạn đã hoàn thành bài ôn tập cuối kỳ 1. <br/> 
              Tổng kết: <span className="font-bold text-sky-700 text-lg">{Math.round((calculateScore() / currentQuestions.length) * 10)} điểm</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={restart}
                className="bg-white border-2 border-sky-600 text-sky-600 py-3 px-8 rounded-full font-bold hover:bg-sky-50 transition-all hover:scale-105"
              >
                Quay lại đầu trang
              </button>
              <button 
                onClick={startQuiz}
                className="bg-sky-600 text-white py-3 px-8 rounded-full font-bold hover:bg-sky-700 shadow-lg transition-all hover:scale-105"
              >
                Làm lại (Trộn câu hỏi) 🔄
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer Info */}
      <footer className="mt-8 text-sky-400 text-sm font-medium flex items-center gap-2">
        <span>© 2024 English Grade 6 Learning Companion</span>
        <span className="w-1 h-1 bg-sky-300 rounded-full"></span>
        <span>Global Success Edition</span>
      </footer>
    </div>
  );
};

export default App;
