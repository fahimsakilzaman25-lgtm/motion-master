
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface User {
  name: string;
  email: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  score: number;
  timeLeft: number;
  status: 'idle' | 'loading' | 'active' | 'finished';
  feedback?: string;
}

export enum AppStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  ACTIVE = 'active',
  FINISHED = 'finished'
}

export enum AuthStatus {
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATED = 'authenticated'
}
