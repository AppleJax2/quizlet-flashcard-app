import {
  CreateFlashcardSetRequest,
  FlashcardSet,
  FlashcardSetQueryParams,
  FlashcardSetSearchResults,
  FlashcardSetSummary,
  FlashcardStatistics,
  UpdateFlashcardSetRequest,
} from '@/types';
import apiService from './api';

class FlashcardService {
  // Base endpoint for flashcard sets
  private endpoint = '/flashcard-sets';

  // Get all flashcard sets for the authenticated user
  async getFlashcardSets(params?: FlashcardSetQueryParams) {
    return apiService.get<FlashcardSetSearchResults>(this.endpoint, params);
  }

  // Get public flashcard sets
  async getPublicFlashcardSets(params?: FlashcardSetQueryParams) {
    return apiService.get<FlashcardSetSearchResults>(`${this.endpoint}/public`, params);
  }

  // Search flashcard sets
  async searchFlashcardSets(query: string, params?: Omit<FlashcardSetQueryParams, 'search'>) {
    return apiService.get<FlashcardSetSearchResults>(`${this.endpoint}/search`, {
      search: query,
      ...params,
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
}

// Create a singleton instance
const flashcardService = new FlashcardService();

export default flashcardService; 