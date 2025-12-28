
export type Difficulty = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  unit: string;
  difficulty: Difficulty;
}

export type QuizState = 'START' | 'QUIZ' | 'RESULT';

export interface QuizResult {
  score: number;
  total: number;
  answers: {
    questionId: number;
    userAnswer: number;
    isCorrect: boolean;
  }[];
}