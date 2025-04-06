export interface Flashcard {
  id?: string;
  front: string;
  back: string;
  imageUrl?: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  userId: string;
  flashcards: Flashcard[];
  tags: string[];
  isPublic: boolean;
  sourceType: 'manual' | 'text' | 'pdf' | 'url' | 'docx' | 'image';
  sourceReference?: string;
  language: string;
  complexity: 'simple' | 'medium' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardSetSummary {
  id: string;
  title: string;
  description: string;
  userId: string;
  flashcardCount: number;
  tags: string[];
  isPublic: boolean;
  language: string;
  complexity: 'simple' | 'medium' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardStatistics {
  flashcardCount: number;
  difficulty: {
    easy?: number;
    medium?: number;
    hard?: number;
  };
  avgFrontLength: number;
  avgBackLength: number;
  cardsWithImages: number;
  cardsWithImagesPercentage: number;
}

export interface CreateFlashcardSetRequest {
  title: string;
  description: string;
  flashcards: Flashcard[];
  tags?: string[];
  isPublic?: boolean;
  sourceType?: 'manual' | 'text' | 'pdf' | 'url' | 'docx' | 'image';
  sourceReference?: string;
  language?: string;
  complexity?: 'simple' | 'medium' | 'advanced';
}

export interface UpdateFlashcardSetRequest {
  title?: string;
  description?: string;
  flashcards?: Flashcard[];
  tags?: string[];
  isPublic?: boolean;
  language?: string;
  complexity?: 'simple' | 'medium' | 'advanced';
}

export interface FlashcardSetQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  tags?: string[];
  language?: string;
  complexity?: 'simple' | 'medium' | 'advanced';
  search?: string;
}

export interface FlashcardSetSearchResults {
  results: FlashcardSetSummary[];
  count: number;
  page: number;
  totalPages: number;
} 