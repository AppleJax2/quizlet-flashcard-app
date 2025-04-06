import { ApiClient, ApiResponse } from '../client';

// Types
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hints?: string[];
  tags?: string[];
  complexity?: 'simple' | 'medium' | 'advanced';
}

export interface FlashcardSet {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  language?: string;
  tags?: string[];
  complexity?: 'simple' | 'medium' | 'advanced';
  flashcards: Flashcard[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFlashcardSetData {
  title: string;
  description?: string;
  isPublic?: boolean;
  language?: string;
  tags?: string[];
  complexity?: 'simple' | 'medium' | 'advanced';
  flashcards: Omit<Flashcard, 'id'>[];
}

export interface UpdateFlashcardSetData extends Partial<CreateFlashcardSetData> {
  id: string;
}

export interface FlashcardSetQueryParams {
  page?: number;
  limit?: number;
  sort?: 'createdAt' | 'updatedAt' | 'title';
  order?: 'asc' | 'desc';
  isPublic?: boolean;
  tags?: string[];
  language?: string;
  complexity?: 'simple' | 'medium' | 'advanced';
}

export interface FlashcardSetResponse {
  flashcardSets: FlashcardSet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Flashcard Service class
export class FlashcardService {
  private static instance: FlashcardService;
  private api: ApiClient;

  private constructor() {
    this.api = ApiClient.getInstance();
  }

  public static getInstance(): FlashcardService {
    if (!FlashcardService.instance) {
      FlashcardService.instance = new FlashcardService();
    }
    return FlashcardService.instance;
  }

  /**
   * Create a new flashcard set
   */
  public async createFlashcardSet(data: CreateFlashcardSetData): Promise<ApiResponse<FlashcardSet>> {
    return this.api.post<FlashcardSet>('/flashcard-sets', data);
  }

  /**
   * Get user's flashcard sets
   */
  public async getFlashcardSets(params?: FlashcardSetQueryParams): Promise<ApiResponse<FlashcardSetResponse>> {
    return this.api.get<FlashcardSetResponse>('/flashcard-sets', { params });
  }

  /**
   * Get public flashcard sets
   */
  public async getPublicFlashcardSets(params?: FlashcardSetQueryParams): Promise<ApiResponse<FlashcardSetResponse>> {
    return this.api.get<FlashcardSetResponse>('/flashcard-sets/public', { params });
  }

  /**
   * Get a single flashcard set
   */
  public async getFlashcardSet(id: string): Promise<ApiResponse<FlashcardSet>> {
    return this.api.get<FlashcardSet>(`/flashcard-sets/${id}`);
  }

  /**
   * Update a flashcard set
   */
  public async updateFlashcardSet(data: UpdateFlashcardSetData): Promise<ApiResponse<FlashcardSet>> {
    const { id, ...updateData } = data;
    return this.api.put<FlashcardSet>(`/flashcard-sets/${id}`, updateData);
  }

  /**
   * Delete a flashcard set
   */
  public async deleteFlashcardSet(id: string): Promise<ApiResponse> {
    return this.api.delete(`/flashcard-sets/${id}`);
  }

  /**
   * Duplicate a flashcard set
   */
  public async duplicateFlashcardSet(id: string): Promise<ApiResponse<FlashcardSet>> {
    return this.api.post<FlashcardSet>(`/flashcard-sets/${id}/duplicate`);
  }

  /**
   * Get flashcard set statistics
   */
  public async getFlashcardSetStats(id: string): Promise<ApiResponse<any>> {
    return this.api.get(`/flashcard-sets/${id}/stats`);
  }
} 