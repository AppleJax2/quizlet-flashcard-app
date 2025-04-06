import { api } from './api';
import { ApiResponse, FlashcardSet, CardProgress, PaginatedResponse } from '@/types';

export class FlashcardService {
  private readonly BASE_PATH = '/api/flashcards';

  async getFlashcardSets(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
  }): Promise<ApiResponse<PaginatedResponse<FlashcardSet>>> {
    return api.get(`${this.BASE_PATH}/sets`, { params });
  }

  async getFlashcardSet(id: string): Promise<ApiResponse<FlashcardSet>> {
    return api.get(`${this.BASE_PATH}/sets/${id}`);
  }

  async createFlashcardSet(data: Partial<FlashcardSet>): Promise<ApiResponse<FlashcardSet>> {
    return api.post(`${this.BASE_PATH}/sets`, data);
  }

  async updateFlashcardSet(id: string, data: Partial<FlashcardSet>): Promise<ApiResponse<FlashcardSet>> {
    return api.patch(`${this.BASE_PATH}/sets/${id}`, data);
  }

  async deleteFlashcardSet(id: string): Promise<ApiResponse<void>> {
    return api.delete(`${this.BASE_PATH}/sets/${id}`);
  }

  async getCardProgress(flashcardId: string): Promise<ApiResponse<CardProgress>> {
    return api.get(`${this.BASE_PATH}/progress/${flashcardId}`);
  }

  async updateCardProgress(flashcardId: string, progress: Partial<CardProgress>): Promise<ApiResponse<CardProgress>> {
    return api.patch(`${this.BASE_PATH}/progress/${flashcardId}`, progress);
  }

  async getStudyStats(userId: string): Promise<ApiResponse<{
    totalCards: number;
    cardsToReview: number;
    averagePerformance: number;
    studyStreak: number;
  }>> {
    return api.get(`${this.BASE_PATH}/stats/${userId}`);
  }
}

export const flashcardService = new FlashcardService(); 