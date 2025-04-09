/**
 * Core entity types for the flashcard system
 */

// Base Types
export type UUID = string;
export type ISO8601Date = string;

// Difficulty Level
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Categories
export type FlashcardCategory = 
  | 'language' 
  | 'science' 
  | 'math' 
  | 'history' 
  | 'literature' 
  | 'programming' 
  | 'arts' 
  | 'business' 
  | 'other';

// User defined tags
export interface Tag {
  id: UUID;
  name: string;
  color?: string;
}

// Individual Flashcard
export interface Flashcard {
  id: UUID;
  front: string;
  back: string;
  notes?: string;
  tags?: Tag[];
  imageUrl?: string;
  audioUrl?: string;
  setId: UUID;
  position: number;
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date;
}

// Flashcard creation/update DTOs
export type CreateFlashcardDTO = Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFlashcardDTO = Partial<CreateFlashcardDTO>;

// Flashcard Set (Collection of flashcards)
export interface FlashcardSet {
  id: UUID;
  title: string;
  description: string;
  category: FlashcardCategory;
  difficulty?: DifficultyLevel;
  isPublic: boolean;
  isFeatured?: boolean;
  ownerId: UUID;
  ownerName?: string;
  coverImage?: string;
  tags: Tag[];
  cardCount: number;
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date;
  lastStudiedAt?: ISO8601Date;
  cards?: Flashcard[];
}

// Flashcard set creation/update DTOs
export type CreateFlashcardSetDTO = Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt' | 'cardCount' | 'lastStudiedAt' | 'ownerId' | 'ownerName'> & {
  cards?: CreateFlashcardDTO[];
};

export type UpdateFlashcardSetDTO = Partial<Omit<CreateFlashcardSetDTO, 'cards'>>;

// Study session types
export type StudyMode = 'flashcards' | 'learn' | 'test';

export type CardResult = 'correct' | 'incorrect' | 'skipped' | 'hard';

export interface StudyCard {
  id: UUID;
  flashcardId: UUID;
  result?: CardResult;
  timeSpent?: number; // in milliseconds
  attempts?: number;
}

export interface StudySession {
  id: UUID;
  userId: UUID;
  setId: UUID;
  mode: StudyMode;
  status: 'in-progress' | 'completed' | 'abandoned';
  startedAt: ISO8601Date;
  completedAt?: ISO8601Date;
  timeSpent?: number; // in milliseconds
  cards: StudyCard[];
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  hardCount: number;
  completionRate: number; // 0-1
}

export interface StudySessionSummary {
  id: UUID;
  setId: UUID;
  setTitle: string;
  mode: StudyMode;
  status: 'in-progress' | 'completed' | 'abandoned';
  startedAt: ISO8601Date;
  completedAt?: ISO8601Date;
  timeSpent?: number;
  totalCards: number;
  correctCount: number;
  incorrectCount: number;
  completionRate: number;
}

// Flashcard Progress
export interface FlashcardProgress {
  id: UUID;
  userId: UUID;
  flashcardId: UUID;
  correctCount: number;
  incorrectCount: number;
  lastResult?: CardResult;
  lastStudiedAt?: ISO8601Date;
  confidence: number; // 0-1 scale
  dueDate?: ISO8601Date; // For spaced repetition
}

// Set Progress
export interface FlashcardSetProgress {
  id: UUID;
  userId: UUID;
  setId: UUID;
  totalCards: number;
  mastered: number;
  learning: number;
  notStarted: number;
  lastStudiedAt?: ISO8601Date;
  completionRate: number; // 0-1
  averageConfidence: number; // 0-1
}

// Pagination and Filtering
export interface FlashcardSetFilters {
  category?: FlashcardCategory;
  difficulty?: DifficultyLevel;
  tags?: string[];
  search?: string;
  ownerId?: UUID;
  isPublic?: boolean;
  isFeatured?: boolean;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'lastStudiedAt' | 'cardCount';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Study Strategies
export type StudyStrategy = 
  | 'sequential' 
  | 'random' 
  | 'spaced-repetition' 
  | 'leitner' 
  | 'difficulty-based';

export interface StudyOptions {
  strategy: StudyStrategy;
  cardLimit?: number;
  includeCards?: UUID[]; // specific cards to include
  excludeCards?: UUID[]; // specific cards to exclude
  timeLimit?: number; // in seconds
  showFrontFirst?: boolean;
  autoFlip?: boolean;
  autoFlipDelay?: number; // in seconds
} 