import { useState, useCallback, useMemo } from 'react';
import useFetch, { FetchOptions } from './useFetch';
import flashcardService from '@/api/flashcardService';
import {
  FlashcardSet,
  Flashcard,
  PaginationParams,
  FlashcardSetFilters,
  StudySession,
  StudyOptions,
  UUID,
} from '@/types/flashcard.types';
import { ApiResponse } from '@/api/apiClient';

/**
 * Hook for fetching flashcard sets with pagination and filtering
 */
export function useFlashcardSets(
  pagination: PaginationParams = { page: 1, limit: 10 },
  filters?: FlashcardSetFilters,
  options?: FetchOptions
) {
  return useFetch(
    flashcardService.getFlashcardSets.bind(flashcardService),
    [pagination, filters],
    {
      cacheKey: `flashcardSets-${JSON.stringify(pagination)}-${JSON.stringify(filters)}`,
      ...options,
    }
  );
}

/**
 * Hook for fetching user's flashcard sets with pagination and filtering
 */
export function useUserFlashcardSets(
  pagination: PaginationParams = { page: 1, limit: 10 },
  filters?: Omit<FlashcardSetFilters, 'ownerId'>,
  options?: FetchOptions
) {
  return useFetch(
    flashcardService.getUserFlashcardSets.bind(flashcardService),
    [pagination, filters],
    {
      cacheKey: `userFlashcardSets-${JSON.stringify(pagination)}-${JSON.stringify(filters)}`,
      ...options,
    }
  );
}

/**
 * Hook for fetching featured flashcard sets
 */
export function useFeaturedFlashcardSets(limit: number = 6, options?: FetchOptions) {
  return useFetch(
    flashcardService.getFeaturedFlashcardSets.bind(flashcardService),
    [limit],
    {
      cacheKey: `featuredSets-${limit}`,
      ...options,
    }
  );
}

/**
 * Hook for fetching a specific flashcard set
 */
export function useFlashcardSet(
  id: UUID | undefined,
  includeCards: boolean = false,
  options?: FetchOptions
) {
  return useFetch(
    flashcardService.getFlashcardSet.bind(flashcardService),
    [id, includeCards],
    {
      cacheKey: `flashcardSet-${id}-${includeCards}`,
      enabled: !!id,
      ...options,
    }
  );
}

/**
 * Hook for fetching flashcards from a set
 */
export function useFlashcards(
  setId: UUID | undefined,
  options?: FetchOptions
) {
  return useFetch(
    flashcardService.getFlashcards.bind(flashcardService),
    [setId],
    {
      cacheKey: `flashcards-${setId}`,
      enabled: !!setId,
      ...options,
    }
  );
}

/**
 * Hook for fetching a specific flashcard
 */
export function useFlashcard(
  id: UUID | undefined,
  options?: FetchOptions
) {
  return useFetch(
    flashcardService.getFlashcard.bind(flashcardService),
    [id],
    {
      cacheKey: `flashcard-${id}`,
      enabled: !!id,
      ...options,
    }
  );
}

/**
 * Hook for creating a flashcard set
 */
export function useCreateFlashcardSet() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSet = useCallback(
    async (data: { title: string; description?: string; isPublic?: boolean }) => {
      setIsCreating(true);
      setError(null);
      
      try {
        const response = await flashcardService.createFlashcardSet(data);
        
        if (response.error) {
          setError(response.error.message);
          return null;
        }
        
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create flashcard set');
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  return {
    createSet,
    isCreating,
    error,
  };
}

/**
 * Hook for creating flashcards in a set
 */
export function useCreateFlashcards() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCards = useCallback(
    async (setId: UUID, cards: { front: string; back: string; hint?: string }[]) => {
      setIsCreating(true);
      setError(null);
      
      try {
        const response = await flashcardService.createFlashcards(setId, cards);
        
        if (response.error) {
          setError(response.error.message);
          return null;
        }
        
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create flashcards');
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  return {
    createCards,
    isCreating,
    error,
  };
}

/**
 * Hook for managing study sessions
 */
export function useStudySession(
  setId: UUID | undefined,
  options?: FetchOptions
) {
  const [session, setSession] = useState<StudySession | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start a new study session
  const startSession = useCallback(
    async (studyOptions: StudyOptions) => {
      if (!setId) return null;
      
      setIsStarting(true);
      setError(null);
      
      try {
        const response = await flashcardService.startStudySession(setId, studyOptions);
        
        if (response.error) {
          setError(response.error.message);
          return null;
        }
        
        setSession(response.data);
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start study session');
        return null;
      } finally {
        setIsStarting(false);
      }
    },
    [setId]
  );

  // Update a study session with card results
  const updateSession = useCallback(
    async (
      sessionId: UUID,
      results: {
        flashcardId: UUID;
        result: 'correct' | 'incorrect' | 'skipped' | 'hard';
        timeSpent?: number;
      }[]
    ) => {
      setIsUpdating(true);
      setError(null);
      
      try {
        const response = await flashcardService.updateStudySession(sessionId, {
          cardResults: results,
        });
        
        if (response.error) {
          setError(response.error.message);
          return null;
        }
        
        setSession(response.data);
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update study session');
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  // Complete a study session
  const completeSession = useCallback(
    async (sessionId: UUID) => {
      setIsCompleting(true);
      setError(null);
      
      try {
        const response = await flashcardService.completeStudySession(sessionId);
        
        if (response.error) {
          setError(response.error.message);
          return null;
        }
        
        setSession(response.data);
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to complete study session');
        return null;
      } finally {
        setIsCompleting(false);
      }
    },
    []
  );

  return {
    session,
    startSession,
    updateSession,
    completeSession,
    isStarting,
    isUpdating,
    isCompleting,
    error,
  };
}

/**
 * Hook for fetching user's study session history
 */
export function useStudyHistory(
  pagination: PaginationParams = { page: 1, limit: 10 },
  options?: FetchOptions
) {
  return useFetch(
    flashcardService.getStudySessionHistory.bind(flashcardService),
    [pagination],
    {
      cacheKey: `studyHistory-${JSON.stringify(pagination)}`,
      ...options,
    }
  );
}

/**
 * Hook for searching flashcard sets
 */
export function useSearchFlashcardSets(
  query: string,
  pagination: PaginationParams = { page: 1, limit: 10 },
  options?: FetchOptions
) {
  // Create a search filter based on the query
  const filters = useMemo<FlashcardSetFilters>(
    () => ({
      search: query,
    }),
    [query]
  );

  return useFetch(
    flashcardService.getFlashcardSets.bind(flashcardService),
    [pagination, filters],
    {
      cacheKey: `searchFlashcardSets-${query}-${JSON.stringify(pagination)}`,
      enabled: query.length > 0,
      ...options,
    }
  );
}

/**
 * Hook for generating flashcards from text
 */
export function useGenerateFlashcards() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFromText = useCallback(
    async (
      text: string,
      options?: {
        count?: number;
        difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
        format?: 'simple' | 'detailed';
        language?: string;
      }
    ) => {
      setIsGenerating(true);
      setError(null);
      
      try {
        const response = await flashcardService.generateFlashcardsFromText(text, options);
        
        if (response.error) {
          setError(response.error.message);
          return null;
        }
        
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate flashcards');
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const generateFromUrl = useCallback(
    async (
      url: string,
      options?: {
        count?: number;
        difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
        format?: 'simple' | 'detailed';
      }
    ) => {
      setIsGenerating(true);
      setError(null);
      
      try {
        const response = await flashcardService.generateFlashcardsFromUrl(url, options);
        
        if (response.error) {
          setError(response.error.message);
          return null;
        }
        
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate flashcards from URL');
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    generateFromText,
    generateFromUrl,
    isGenerating,
    error,
  };
}

/**
 * Hook for importing flashcards
 */
export function useImportFlashcards() {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const importFlashcards = useCallback(
    async (file: File, format: 'csv' | 'json' | 'anki' | 'quizlet') => {
      setIsImporting(true);
      setProgress(0);
      setError(null);
      
      try {
        const response = await flashcardService.importFlashcards(
          file,
          format,
          (progressPercentage) => {
            setProgress(progressPercentage);
          }
        );
        
        if (response.error) {
          setError(response.error.message);
          return null;
        }
        
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to import flashcards');
        return null;
      } finally {
        setIsImporting(false);
      }
    },
    []
  );

  return {
    importFlashcards,
    isImporting,
    progress,
    error,
  };
}

/**
 * Hook for exporting flashcards
 */
export function useExportFlashcards() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportFlashcardSet = useCallback(
    async (setId: UUID, format: 'csv' | 'json' | 'anki' | 'pdf') => {
      setIsExporting(true);
      setError(null);
      
      try {
        const blob = await flashcardService.exportFlashcardSet(setId, format);
        
        // Create a download link and trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flashcards-${setId}.${format}`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 0);
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to export flashcards');
        return false;
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return {
    exportFlashcardSet,
    isExporting,
    error,
  };
}

/**
 * Hook for fetching user's progress on a flashcard set
 */
export function useFlashcardSetProgress(
  setId: UUID | undefined,
  options?: FetchOptions
) {
  return useFetch(
    flashcardService.getSetProgress.bind(flashcardService),
    [setId],
    {
      cacheKey: `setProgress-${setId}`,
      enabled: !!setId,
      ...options,
    }
  );
}

/**
 * Hook for fetching all of a user's set progress data
 */
export function useAllSetsProgress(
  pagination: PaginationParams = { page: 1, limit: 20 },
  options?: FetchOptions
) {
  return useFetch(
    flashcardService.getAllSetsProgress.bind(flashcardService),
    [pagination],
    {
      cacheKey: `allSetsProgress-${JSON.stringify(pagination)}`,
      ...options,
    }
  );
}

/**
 * Hook for fetching a user's card progress within a set
 */
export function useCardsProgress(
  setId: UUID | undefined,
  options?: FetchOptions
) {
  return useFetch(
    flashcardService.getCardsProgress.bind(flashcardService),
    [setId],
    {
      cacheKey: `cardsProgress-${setId}`,
      enabled: !!setId,
      ...options,
    }
  );
}

/**
 * Hook for resetting a user's progress on a flashcard set
 */
export function useResetSetProgress() {
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetProgress = useCallback(
    async (setId: UUID) => {
      setIsResetting(true);
      setError(null);
      
      try {
        const response = await flashcardService.resetSetProgress(setId);
        
        if (response.error) {
          setError(response.error.message);
          return false;
        }
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reset progress');
        return false;
      } finally {
        setIsResetting(false);
      }
    },
    []
  );

  return {
    resetProgress,
    isResetting,
    error,
  };
} 