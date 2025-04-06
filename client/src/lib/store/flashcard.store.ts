import { create } from 'zustand';
import { FlashcardService, type FlashcardSet, type FlashcardSetQueryParams } from '@/lib/api/services';

interface FlashcardState {
  flashcardSets: FlashcardSet[];
  currentSet: FlashcardSet | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchFlashcardSets: (params?: FlashcardSetQueryParams) => Promise<void>;
  fetchPublicFlashcardSets: (params?: FlashcardSetQueryParams) => Promise<void>;
  fetchFlashcardSet: (id: string) => Promise<void>;
  createFlashcardSet: (data: Omit<FlashcardSet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFlashcardSet: (id: string, data: Partial<FlashcardSet>) => Promise<void>;
  deleteFlashcardSet: (id: string) => Promise<void>;
  duplicateFlashcardSet: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useFlashcardStore = create<FlashcardState>()((set, get) => ({
  flashcardSets: [],
  currentSet: null,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  isLoading: false,
  error: null,

  fetchFlashcardSets: async (params?: FlashcardSetQueryParams) => {
    try {
      set({ isLoading: true, error: null });
      const flashcardService = FlashcardService.getInstance();
      const response = await flashcardService.getFlashcardSets(params);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch flashcard sets');
      }
      
      set({
        flashcardSets: response.data.flashcardSets,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchPublicFlashcardSets: async (params?: FlashcardSetQueryParams) => {
    try {
      set({ isLoading: true, error: null });
      const flashcardService = FlashcardService.getInstance();
      const response = await flashcardService.getPublicFlashcardSets(params);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch public flashcard sets');
      }
      
      set({
        flashcardSets: response.data.flashcardSets,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchFlashcardSet: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const flashcardService = FlashcardService.getInstance();
      const response = await flashcardService.getFlashcardSet(id);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch flashcard set');
      }
      
      set({
        currentSet: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  createFlashcardSet: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const flashcardService = FlashcardService.getInstance();
      const response = await flashcardService.createFlashcardSet(data);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create flashcard set');
      }
      
      set((state) => ({
        flashcardSets: [response.data, ...state.flashcardSets],
        currentSet: response.data,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  updateFlashcardSet: async (id: string, data: Partial<FlashcardSet>) => {
    try {
      set({ isLoading: true, error: null });
      const flashcardService = FlashcardService.getInstance();
      const response = await flashcardService.updateFlashcardSet({ id, ...data });
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update flashcard set');
      }
      
      set((state) => ({
        flashcardSets: state.flashcardSets.map((set) =>
          set.id === id ? response.data : set
        ),
        currentSet: state.currentSet?.id === id ? response.data : state.currentSet,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteFlashcardSet: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const flashcardService = FlashcardService.getInstance();
      const response = await flashcardService.deleteFlashcardSet(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete flashcard set');
      }
      
      set((state) => ({
        flashcardSets: state.flashcardSets.filter((set) => set.id !== id),
        currentSet: state.currentSet?.id === id ? null : state.currentSet,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  duplicateFlashcardSet: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const flashcardService = FlashcardService.getInstance();
      const response = await flashcardService.duplicateFlashcardSet(id);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to duplicate flashcard set');
      }
      
      set((state) => ({
        flashcardSets: [response.data, ...state.flashcardSets],
        currentSet: response.data,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
})); 