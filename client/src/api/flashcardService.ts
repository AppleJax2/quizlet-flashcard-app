import apiClient, { ApiResponse } from './apiClient';
import {
  Flashcard,
  FlashcardSet,
  CreateFlashcardSetDTO,
  UpdateFlashcardSetDTO,
  CreateFlashcardDTO,
  UpdateFlashcardDTO,
  FlashcardSetFilters,
  PaginationParams,
  PaginatedResponse,
  StudySession,
  StudySessionSummary,
  FlashcardProgress,
  FlashcardSetProgress,
  StudyOptions,
  UUID,
} from '@/types/flashcard.types';

/**
 * Service for managing flashcard sets and cards
 */
class FlashcardService {
  private baseUrl = '/flashcards';
  private sessionsUrl = '/study-sessions';
  private progressUrl = '/progress';

  /**
   * Get all flashcard sets with pagination and filtering
   */
  public async getFlashcardSets(
    pagination: PaginationParams,
    filters?: FlashcardSetFilters
  ): Promise<ApiResponse<PaginatedResponse<FlashcardSet>>> {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('page', pagination.page.toString());
    queryParams.append('limit', pagination.limit.toString());
    
    // Add filter params if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(`${key}[]`, v));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    
    return apiClient.get<PaginatedResponse<FlashcardSet>>(
      `${this.baseUrl}/sets?${queryParams.toString()}`
    );
  }

  /**
   * Get user's flashcard sets
   */
  public async getUserFlashcardSets(
    pagination: PaginationParams,
    filters?: Omit<FlashcardSetFilters, 'ownerId'>
  ): Promise<ApiResponse<PaginatedResponse<FlashcardSet>>> {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('page', pagination.page.toString());
    queryParams.append('limit', pagination.limit.toString());
    
    // Add filter params if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(`${key}[]`, v));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    
    return apiClient.get<PaginatedResponse<FlashcardSet>>(
      `${this.baseUrl}/sets/me?${queryParams.toString()}`
    );
  }

  /**
   * Get featured flashcard sets
   */
  public async getFeaturedFlashcardSets(
    limit: number = 6
  ): Promise<ApiResponse<FlashcardSet[]>> {
    return apiClient.get<FlashcardSet[]>(
      `${this.baseUrl}/sets/featured?limit=${limit}`
    );
  }

  /**
   * Get a specific flashcard set by ID, optionally including cards
   */
  public async getFlashcardSet(
    id: UUID,
    includeCards: boolean = false
  ): Promise<ApiResponse<FlashcardSet>> {
    return apiClient.get<FlashcardSet>(
      `${this.baseUrl}/sets/${id}${includeCards ? '?includeCards=true' : ''}`
    );
  }

  /**
   * Create a new flashcard set
   */
  public async createFlashcardSet(
    data: CreateFlashcardSetDTO
  ): Promise<ApiResponse<FlashcardSet>> {
    return apiClient.post<FlashcardSet>(
      `${this.baseUrl}/sets`,
      data
    );
  }

  /**
   * Update an existing flashcard set
   */
  public async updateFlashcardSet(
    id: UUID,
    data: UpdateFlashcardSetDTO
  ): Promise<ApiResponse<FlashcardSet>> {
    return apiClient.put<FlashcardSet>(
      `${this.baseUrl}/sets/${id}`,
      data
    );
  }

  /**
   * Delete a flashcard set
   */
  public async deleteFlashcardSet(
    id: UUID
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(
      `${this.baseUrl}/sets/${id}`
    );
  }

  /**
   * Upload a cover image for a flashcard set
   */
  public async uploadCoverImage(
    setId: UUID,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ imageUrl: string }>> {
    return apiClient.uploadFile<{ imageUrl: string }>(
      `${this.baseUrl}/sets/${setId}/cover`,
      file,
      onProgress
    );
  }

  /**
   * Get all cards in a flashcard set
   */
  public async getFlashcards(
    setId: UUID
  ): Promise<ApiResponse<Flashcard[]>> {
    return apiClient.get<Flashcard[]>(
      `${this.baseUrl}/sets/${setId}/cards`
    );
  }

  /**
   * Get a specific flashcard by ID
   */
  public async getFlashcard(
    id: UUID
  ): Promise<ApiResponse<Flashcard>> {
    return apiClient.get<Flashcard>(
      `${this.baseUrl}/cards/${id}`
    );
  }

  /**
   * Create a new flashcard within a set
   */
  public async createFlashcard(
    setId: UUID,
    data: CreateFlashcardDTO
  ): Promise<ApiResponse<Flashcard>> {
    return apiClient.post<Flashcard>(
      `${this.baseUrl}/sets/${setId}/cards`,
      data
    );
  }

  /**
   * Create multiple flashcards within a set
   */
  public async createFlashcards(
    setId: UUID,
    data: CreateFlashcardDTO[]
  ): Promise<ApiResponse<Flashcard[]>> {
    return apiClient.post<Flashcard[]>(
      `${this.baseUrl}/sets/${setId}/cards/batch`,
      data
    );
  }

  /**
   * Update an existing flashcard
   */
  public async updateFlashcard(
    id: UUID,
    data: UpdateFlashcardDTO
  ): Promise<ApiResponse<Flashcard>> {
    return apiClient.put<Flashcard>(
      `${this.baseUrl}/cards/${id}`,
      data
    );
  }

  /**
   * Delete a flashcard
   */
  public async deleteFlashcard(
    id: UUID
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(
      `${this.baseUrl}/cards/${id}`
    );
  }

  /**
   * Upload an image for a flashcard
   */
  public async uploadFlashcardImage(
    cardId: UUID,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ imageUrl: string }>> {
    return apiClient.uploadFile<{ imageUrl: string }>(
      `${this.baseUrl}/cards/${cardId}/image`,
      file,
      onProgress
    );
  }

  /**
   * Upload audio for a flashcard
   */
  public async uploadFlashcardAudio(
    cardId: UUID,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ audioUrl: string }>> {
    return apiClient.uploadFile<{ audioUrl: string }>(
      `${this.baseUrl}/cards/${cardId}/audio`,
      file,
      onProgress
    );
  }

  /**
   * Reorder flashcards within a set
   */
  public async reorderFlashcards(
    setId: UUID,
    cardIds: UUID[]
  ): Promise<ApiResponse<void>> {
    return apiClient.put<void>(
      `${this.baseUrl}/sets/${setId}/reorder`,
      { cardIds }
    );
  }

  // Study Session Methods

  /**
   * Start a new study session
   */
  public async startStudySession(
    setId: UUID,
    options: StudyOptions
  ): Promise<ApiResponse<StudySession>> {
    return apiClient.post<StudySession>(
      `${this.sessionsUrl}`,
      {
        setId,
        ...options
      }
    );
  }

  /**
   * Get a specific study session
   */
  public async getStudySession(
    id: UUID
  ): Promise<ApiResponse<StudySession>> {
    return apiClient.get<StudySession>(
      `${this.sessionsUrl}/${id}`
    );
  }

  /**
   * Update a study session with card results
   */
  public async updateStudySession(
    id: UUID,
    data: {
      cardResults: {
        flashcardId: UUID;
        result: 'correct' | 'incorrect' | 'skipped' | 'hard';
        timeSpent?: number;
      }[];
      completed?: boolean;
    }
  ): Promise<ApiResponse<StudySession>> {
    return apiClient.patch<StudySession>(
      `${this.sessionsUrl}/${id}`,
      data
    );
  }

  /**
   * Complete a study session
   */
  public async completeStudySession(
    id: UUID
  ): Promise<ApiResponse<StudySession>> {
    return apiClient.patch<StudySession>(
      `${this.sessionsUrl}/${id}/complete`,
      {}
    );
  }

  /**
   * Abandon a study session
   */
  public async abandonStudySession(
    id: UUID
  ): Promise<ApiResponse<void>> {
    return apiClient.patch<void>(
      `${this.sessionsUrl}/${id}/abandon`,
      {}
    );
  }

  /**
   * Get user's study session history
   */
  public async getStudySessionHistory(
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<StudySessionSummary>>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', pagination.page.toString());
    queryParams.append('limit', pagination.limit.toString());
    
    return apiClient.get<PaginatedResponse<StudySessionSummary>>(
      `${this.sessionsUrl}/history?${queryParams.toString()}`
    );
  }

  /**
   * Get study session history for a specific set
   */
  public async getSetStudySessionHistory(
    setId: UUID,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<StudySessionSummary>>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', pagination.page.toString());
    queryParams.append('limit', pagination.limit.toString());
    
    return apiClient.get<PaginatedResponse<StudySessionSummary>>(
      `${this.sessionsUrl}/history/${setId}?${queryParams.toString()}`
    );
  }

  // Progress Tracking Methods

  /**
   * Get user's progress for a specific flashcard set
   */
  public async getSetProgress(
    setId: UUID
  ): Promise<ApiResponse<FlashcardSetProgress>> {
    return apiClient.get<FlashcardSetProgress>(
      `${this.progressUrl}/sets/${setId}`
    );
  }

  /**
   * Get user's progress for all flashcard sets
   */
  public async getAllSetsProgress(
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<FlashcardSetProgress>>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', pagination.page.toString());
    queryParams.append('limit', pagination.limit.toString());
    
    return apiClient.get<PaginatedResponse<FlashcardSetProgress>>(
      `${this.progressUrl}/sets?${queryParams.toString()}`
    );
  }

  /**
   * Get user's progress for all cards in a set
   */
  public async getCardsProgress(
    setId: UUID
  ): Promise<ApiResponse<FlashcardProgress[]>> {
    return apiClient.get<FlashcardProgress[]>(
      `${this.progressUrl}/sets/${setId}/cards`
    );
  }

  /**
   * Reset user's progress for a specific set
   */
  public async resetSetProgress(
    setId: UUID
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(
      `${this.progressUrl}/sets/${setId}`
    );
  }

  // AI Content Generation Methods

  /**
   * Generate flashcards from text content
   */
  public async generateFlashcardsFromText(
    text: string, 
    options?: {
      count?: number;
      difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
      format?: 'simple' | 'detailed';
      language?: string;
    }
  ): Promise<ApiResponse<Flashcard[]>> {
    return apiClient.post<Flashcard[]>(
      `${this.baseUrl}/generate/text`,
      {
        content: text,
        ...options
      }
    );
  }

  /**
   * Generate flashcards from a URL
   */
  public async generateFlashcardsFromUrl(
    url: string, 
    options?: {
      count?: number;
      difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
      format?: 'simple' | 'detailed';
    }
  ): Promise<ApiResponse<Flashcard[]>> {
    return apiClient.post<Flashcard[]>(
      `${this.baseUrl}/generate/url`,
      {
        url,
        ...options
      }
    );
  }

  /**
   * Import flashcards from various formats
   */
  public async importFlashcards(
    file: File,
    format: 'csv' | 'json' | 'anki' | 'quizlet',
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<Flashcard[]>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);
    
    return apiClient.uploadFile<Flashcard[]>(
      `${this.baseUrl}/import`,
      file,
      onProgress,
      {
        params: { format }
      }
    );
  }

  /**
   * Export flashcard set to various formats
   */
  public async exportFlashcardSet(
    setId: UUID,
    format: 'csv' | 'json' | 'anki' | 'pdf'
  ): Promise<Blob> {
    const url = `${this.baseUrl}/sets/${setId}/export`;
    const params = { format };
    
    return await apiClient.downloadFile(url, params) as Promise<Blob>;
  }
}

// Create and export the flashcard service instance
const flashcardService = new FlashcardService();
export default flashcardService; 