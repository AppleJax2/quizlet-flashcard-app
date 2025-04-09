import {
  CreateFlashcardSetRequest,
  FlashcardSet,
  FlashcardSetQueryParams,
  FlashcardSetSearchResults,
  FlashcardSetSummary,
  FlashcardStatistics,
  UpdateFlashcardSetRequest,
  Flashcard,
} from '@/types';
import apiService from './api';

class FlashcardService {
  // Base endpoint for flashcard sets
  private endpoint = '/flashcard-sets';

  // Get all flashcard sets for the authenticated user
  async getFlashcardSets(params?: FlashcardSetQueryParams) {
    return apiService.get<FlashcardSetSearchResults>(this.endpoint, params ? { params } : undefined);
  }

  // Get recent flashcard sets for the authenticated user
  async getRecentSets(limit = 6) {
    const result = await this.getFlashcardSets({ limit, sortBy: 'updatedAt', order: 'desc' });
    return result.results || [];
  }

  // Get public flashcard sets
  async getPublicFlashcardSets(params?: FlashcardSetQueryParams) {
    return apiService.get<FlashcardSetSearchResults>(`${this.endpoint}/public`, params ? { params } : undefined);
  }

  // Search flashcard sets
  async searchFlashcardSets(query: string, params?: Omit<FlashcardSetQueryParams, 'search'>) {
    return apiService.get<FlashcardSetSearchResults>(`${this.endpoint}/search`, {
      params: {
        search: query,
        ...(params || {})
      }
    });
  }

  // Get a specific flashcard set by ID
  async getFlashcardSet(id: string) {
    return apiService.get<FlashcardSet>(`${this.endpoint}/${id}`);
  }

  // Get statistics for a flashcard set
  async getFlashcardSetStats(id: string) {
    return apiService.get<FlashcardStatistics>(`${this.endpoint}/${id}/stats`);
  }

  // Create a new flashcard set
  async createFlashcardSet(data: CreateFlashcardSetRequest) {
    return apiService.post<FlashcardSet>(this.endpoint, data);
  }

  // Update an existing flashcard set
  async updateFlashcardSet(id: string, data: UpdateFlashcardSetRequest) {
    return apiService.put<FlashcardSet>(`${this.endpoint}/${id}`, data);
  }

  // Duplicate a flashcard set
  async duplicateFlashcardSet(id: string) {
    return apiService.post<FlashcardSet>(`${this.endpoint}/${id}/duplicate`);
  }

  // Delete a flashcard set
  async deleteFlashcardSet(id: string) {
    return apiService.delete<{ message: string }>(`${this.endpoint}/${id}`);
  }

  // Add a new flashcard to a set
  async addFlashcard(setId: string, flashcard: Flashcard) {
    return apiService.post<Flashcard>(`${this.endpoint}/${setId}/flashcards`, flashcard);
  }

  // Update an existing flashcard in a set
  async updateFlashcard(setId: string, flashcardId: string, flashcard: Flashcard) {
    return apiService.put<Flashcard>(`${this.endpoint}/${setId}/flashcards/${flashcardId}`, flashcard);
  }

  // Delete a flashcard from a set
  async deleteFlashcard(setId: string, flashcardId: string) {
    return apiService.delete<{ message: string }>(`${this.endpoint}/${setId}/flashcards/${flashcardId}`);
  }
}

// Create a singleton instance
const flashcardService = new FlashcardService();

export default flashcardService; 