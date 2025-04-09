export * from './auth';
export * from './flashcards';
export * from './processor';
export * from './api';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
  success?: boolean;
  token?: string;
  user?: any;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  page: number;
  totalPages: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySessionStats {
  correct: number;
  incorrect: number;
  skipped: number;
  averagePerformance?: number;
  totalTime?: number;
}

export interface CardProgress {
  id: string;
  userId: string;
  flashcardId: string;
  interval: number;
  easeFactor: number;
  nextReviewDate: Date;
  performanceHistory: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  correct: number;
  incorrect: number;
  skipped: number;
  remainingCards: Array<{
    flashcard: Flashcard;
    progress: CardProgress;
  }>;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tags: string[];
  setId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  tags: string[];
  userId: string;
  flashcards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
}