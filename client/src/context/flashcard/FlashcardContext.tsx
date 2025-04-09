import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  FlashcardSet,
  Flashcard,
  PaginationParams,
  FlashcardSetFilters,
  PaginatedResponse,
  CreateFlashcardSetDTO,
  UpdateFlashcardSetDTO,
  CreateFlashcardDTO,
  UpdateFlashcardDTO,
  StudySession,
  StudyOptions,
  UUID,
} from '@/types/flashcard.types';
import flashcardService from '@/api/flashcardService';

// State types
export interface FlashcardState {
  flashcardSets: FlashcardSet[];
  currentSet: FlashcardSet | null;
  currentCard: Flashcard | null;
  currentSession: StudySession | null;
  featuredSets: FlashcardSet[];
  total: number;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Action types
export type FlashcardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FLASHCARD_SETS'; payload: { sets: FlashcardSet[]; total: number } }
  | { type: 'SET_FEATURED_SETS'; payload: FlashcardSet[] }
  | { type: 'SET_CURRENT_SET'; payload: FlashcardSet | null }
  | { type: 'SET_CURRENT_CARD'; payload: Flashcard | null }
  | { type: 'SET_CURRENT_SESSION'; payload: StudySession | null }
  | { type: 'ADD_FLASHCARD_SET'; payload: FlashcardSet }
  | { type: 'UPDATE_FLASHCARD_SET'; payload: FlashcardSet }
  | { type: 'REMOVE_FLASHCARD_SET'; payload: UUID }
  | { type: 'ADD_FLASHCARD'; payload: { setId: UUID; flashcard: Flashcard } }
  | { type: 'UPDATE_FLASHCARD'; payload: Flashcard }
  | { type: 'REMOVE_FLASHCARD'; payload: { setId: UUID; cardId: UUID } }
  | { type: 'SET_PAGINATION'; payload: { page: number; limit: number; totalPages: number } };

// Reducer function
const flashcardReducer = (state: FlashcardState, action: FlashcardAction): FlashcardState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
      
    case 'SET_FLASHCARD_SETS':
      return {
        ...state,
        flashcardSets: action.payload.sets,
        total: action.payload.total,
        isLoading: false,
      };
      
    case 'SET_FEATURED_SETS':
      return { ...state, featuredSets: action.payload, isLoading: false };
      
    case 'SET_CURRENT_SET':
      return { ...state, currentSet: action.payload, isLoading: false };
      
    case 'SET_CURRENT_CARD':
      return { ...state, currentCard: action.payload, isLoading: false };
      
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload, isLoading: false };
      
    case 'ADD_FLASHCARD_SET':
      return {
        ...state,
        flashcardSets: [action.payload, ...state.flashcardSets],
        total: state.total + 1,
        isLoading: false,
      };
      
    case 'UPDATE_FLASHCARD_SET':
      return {
        ...state,
        flashcardSets: state.flashcardSets.map(set => 
          set.id === action.payload.id ? action.payload : set
        ),
        currentSet: state.currentSet?.id === action.payload.id 
          ? action.payload 
          : state.currentSet,
        isLoading: false,
      };
      
    case 'REMOVE_FLASHCARD_SET':
      return {
        ...state,
        flashcardSets: state.flashcardSets.filter(set => set.id !== action.payload),
        total: state.total - 1,
        currentSet: state.currentSet?.id === action.payload ? null : state.currentSet,
        isLoading: false,
      };
      
    case 'ADD_FLASHCARD':
      return {
        ...state,
        currentSet: state.currentSet?.id === action.payload.setId
          ? {
              ...state.currentSet,
              flashcards: state.currentSet.flashcards
                ? [...state.currentSet.flashcards, action.payload.flashcard]
                : [action.payload.flashcard],
              cardCount: (state.currentSet.cardCount || 0) + 1,
            }
          : state.currentSet,
        isLoading: false,
      };
      
    case 'UPDATE_FLASHCARD':
      return {
        ...state,
        currentSet: state.currentSet
          ? {
              ...state.currentSet,
              flashcards: state.currentSet.flashcards
                ? state.currentSet.flashcards.map(card =>
                    card.id === action.payload.id ? action.payload : card
                  )
                : [],
            }
          : null,
        currentCard: state.currentCard?.id === action.payload.id
          ? action.payload
          : state.currentCard,
        isLoading: false,
      };
      
    case 'REMOVE_FLASHCARD':
      return {
        ...state,
        currentSet: state.currentSet?.id === action.payload.setId
          ? {
              ...state.currentSet,
              flashcards: state.currentSet.flashcards
                ? state.currentSet.flashcards.filter(
                    card => card.id !== action.payload.cardId
                  )
                : [],
              cardCount: Math.max(0, (state.currentSet.cardCount || 0) - 1),
            }
          : state.currentSet,
        currentCard: state.currentCard?.id === action.payload.cardId
          ? null
          : state.currentCard,
        isLoading: false,
      };
      
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: action.payload,
        isLoading: false,
      };
      
    default:
      return state;
  }
};

// Initial state
const initialState: FlashcardState = {
  flashcardSets: [],
  currentSet: null,
  currentCard: null,
  currentSession: null,
  featuredSets: [],
  total: 0,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

// Context type
export interface FlashcardContextType {
  state: FlashcardState;
  getFlashcardSets: (pagination: PaginationParams, filters?: FlashcardSetFilters) => Promise<void>;
  getUserFlashcardSets: (pagination: PaginationParams, filters?: Omit<FlashcardSetFilters, 'ownerId'>) => Promise<void>;
  getFeaturedFlashcardSets: (limit?: number) => Promise<void>;
  getFlashcardSet: (id: UUID, includeCards?: boolean) => Promise<void>;
  createFlashcardSet: (data: CreateFlashcardSetDTO) => Promise<FlashcardSet | null>;
  updateFlashcardSet: (id: UUID, data: UpdateFlashcardSetDTO) => Promise<FlashcardSet | null>;
  deleteFlashcardSet: (id: UUID) => Promise<boolean>;
  getFlashcards: (setId: UUID) => Promise<void>;
  getFlashcard: (id: UUID) => Promise<void>;
  createFlashcard: (setId: UUID, data: CreateFlashcardDTO) => Promise<Flashcard | null>;
  updateFlashcard: (id: UUID, data: UpdateFlashcardDTO) => Promise<Flashcard | null>;
  deleteFlashcard: (id: UUID, setId: UUID) => Promise<boolean>;
  startStudySession: (setId: UUID, options: StudyOptions) => Promise<StudySession | null>;
  completeStudySession: (id: UUID) => Promise<StudySession | null>;
  clearError: () => void;
  setCurrentSet: (set: FlashcardSet | null) => void;
  setCurrentCard: (card: Flashcard | null) => void;
}

// Create context
const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

// Custom hook to use the flashcard context
export const useFlashcards = (): FlashcardContextType => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};

// Provider component
interface FlashcardProviderProps {
  children: React.ReactNode;
}

export const FlashcardProvider: React.FC<FlashcardProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(flashcardReducer, initialState);

  // Get flashcard sets with pagination and filtering
  const getFlashcardSets = useCallback(
    async (pagination: PaginationParams, filters?: FlashcardSetFilters): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const response = await flashcardService.getFlashcardSets(pagination, filters);

        if (response.error !== null) {
          dispatch({ type: 'SET_ERROR', payload: response.error.message });
          return;
        }

        const { data, page, limit, total, totalPages } = response.data;

        dispatch({
          type: 'SET_FLASHCARD_SETS',
          payload: { sets: data, total },
        });

        dispatch({
          type: 'SET_PAGINATION',
          payload: { page, limit, totalPages },
        });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to fetch flashcard sets. Please try again.',
        });
      }
    },
    []
  );

  // Get user's flashcard sets
  const getUserFlashcardSets = useCallback(
    async (
      pagination: PaginationParams,
      filters?: Omit<FlashcardSetFilters, 'ownerId'>
    ): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const response = await flashcardService.getUserFlashcardSets(pagination, filters);

        if (response.error !== null) {
          dispatch({ type: 'SET_ERROR', payload: response.error.message });
          return;
        }

        const { data, page, limit, total, totalPages } = response.data;

        dispatch({
          type: 'SET_FLASHCARD_SETS',
          payload: { sets: data, total },
        });

        dispatch({
          type: 'SET_PAGINATION',
          payload: { page, limit, totalPages },
        });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to fetch your flashcard sets. Please try again.',
        });
      }
    },
    []
  );

  // Get featured flashcard sets
  const getFeaturedFlashcardSets = useCallback(async (limit?: number): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await flashcardService.getFeaturedFlashcardSets(limit);

      if (response.error !== null) {
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return;
      }

      dispatch({ type: 'SET_FEATURED_SETS', payload: response.data });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to fetch featured flashcard sets. Please try again.',
      });
    }
  }, []);

  // Get a specific flashcard set
  const getFlashcardSet = useCallback(
    async (id: UUID, includeCards: boolean = false): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const response = await flashcardService.getFlashcardSet(id, includeCards);

        if (response.error !== null) {
          dispatch({ type: 'SET_ERROR', payload: response.error.message });
          return;
        }

        dispatch({ type: 'SET_CURRENT_SET', payload: response.data });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to fetch the flashcard set. Please try again.',
        });
      }
    },
    []
  );

  // Create a new flashcard set
  const createFlashcardSet = useCallback(
    async (data: CreateFlashcardSetDTO): Promise<FlashcardSet | null> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const response = await flashcardService.createFlashcardSet(data);

        if (response.error !== null) {
          dispatch({ type: 'SET_ERROR', payload: response.error.message });
          return null;
        }

        const newSet = response.data;
        dispatch({ type: 'ADD_FLASHCARD_SET', payload: newSet });
        return newSet;
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to create the flashcard set. Please try again.',
        });
        return null;
      }
    },
    []
  );

  // Update an existing flashcard set
  const updateFlashcardSet = useCallback(
    async (id: UUID, data: UpdateFlashcardSetDTO): Promise<FlashcardSet | null> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const response = await flashcardService.updateFlashcardSet(id, data);

        if (response.error !== null) {
          dispatch({ type: 'SET_ERROR', payload: response.error.message });
          return null;
        }

        const updatedSet = response.data;
        dispatch({ type: 'UPDATE_FLASHCARD_SET', payload: updatedSet });
        return updatedSet;
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to update the flashcard set. Please try again.',
        });
        return null;
      }
    },
    []
  );

  // Delete a flashcard set
  const deleteFlashcardSet = useCallback(async (id: UUID): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await flashcardService.deleteFlashcardSet(id);

      if (response.error !== null) {
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return false;
      }

      dispatch({ type: 'REMOVE_FLASHCARD_SET', payload: id });
      return true;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to delete the flashcard set. Please try again.',
      });
      return false;
    }
  }, []);

  // Get all flashcards in a set
  const getFlashcards = useCallback(async (setId: UUID): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await flashcardService.getFlashcards(setId);

      if (response.error !== null) {
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return;
      }

      // First get the current set
      const setResponse = await flashcardService.getFlashcardSet(setId);
      
      if (setResponse.error !== null) {
        dispatch({ type: 'SET_ERROR', payload: setResponse.error.message });
        return;
      }

      // Merge the flashcards with the set
      const setWithCards = {
        ...setResponse.data,
        flashcards: response.data,
      };

      dispatch({ type: 'SET_CURRENT_SET', payload: setWithCards });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to fetch flashcards. Please try again.',
      });
    }
  }, []);

  // Get a specific flashcard
  const getFlashcard = useCallback(async (id: UUID): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await flashcardService.getFlashcard(id);

      if (response.error !== null) {
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return;
      }

      dispatch({ type: 'SET_CURRENT_CARD', payload: response.data });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to fetch the flashcard. Please try again.',
      });
    }
  }, []);

  // Create a new flashcard
  const createFlashcard = useCallback(
    async (setId: UUID, data: CreateFlashcardDTO): Promise<Flashcard | null> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const response = await flashcardService.createFlashcard(setId, data);

        if (response.error !== null) {
          dispatch({ type: 'SET_ERROR', payload: response.error.message });
          return null;
        }

        const newCard = response.data;
        dispatch({
          type: 'ADD_FLASHCARD',
          payload: { setId, flashcard: newCard },
        });
        return newCard;
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to create the flashcard. Please try again.',
        });
        return null;
      }
    },
    []
  );

  // Update an existing flashcard
  const updateFlashcard = useCallback(
    async (id: UUID, data: UpdateFlashcardDTO): Promise<Flashcard | null> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const response = await flashcardService.updateFlashcard(id, data);

        if (response.error !== null) {
          dispatch({ type: 'SET_ERROR', payload: response.error.message });
          return null;
        }

        const updatedCard = response.data;
        dispatch({ type: 'UPDATE_FLASHCARD', payload: updatedCard });
        return updatedCard;
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to update the flashcard. Please try again.',
        });
        return null;
      }
    },
    []
  );

  // Delete a flashcard
  const deleteFlashcard = useCallback(async (id: UUID, setId: UUID): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await flashcardService.deleteFlashcard(id);

      if (response.error !== null) {
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return false;
      }

      dispatch({
        type: 'REMOVE_FLASHCARD',
        payload: { setId, cardId: id },
      });
      return true;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to delete the flashcard. Please try again.',
      });
      return false;
    }
  }, []);

  // Start a study session
  const startStudySession = useCallback(
    async (setId: UUID, options: StudyOptions): Promise<StudySession | null> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const response = await flashcardService.startStudySession(setId, options);

        if (response.error !== null) {
          dispatch({ type: 'SET_ERROR', payload: response.error.message });
          return null;
        }

        const session = response.data;
        dispatch({ type: 'SET_CURRENT_SESSION', payload: session });
        return session;
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to start the study session. Please try again.',
        });
        return null;
      }
    },
    []
  );

  // Complete a study session
  const completeStudySession = useCallback(async (id: UUID): Promise<StudySession | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await flashcardService.completeStudySession(id);

      if (response.error !== null) {
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return null;
      }

      const session = response.data;
      dispatch({ type: 'SET_CURRENT_SESSION', payload: session });
      return session;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to complete the study session. Please try again.',
      });
      return null;
    }
  }, []);

  // Clear error message
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Set current flashcard set
  const setCurrentSet = useCallback((set: FlashcardSet | null) => {
    dispatch({ type: 'SET_CURRENT_SET', payload: set });
  }, []);

  // Set current flashcard
  const setCurrentCard = useCallback((card: Flashcard | null) => {
    dispatch({ type: 'SET_CURRENT_CARD', payload: card });
  }, []);

  const value: FlashcardContextType = {
    state,
    getFlashcardSets,
    getUserFlashcardSets,
    getFeaturedFlashcardSets,
    getFlashcardSet,
    createFlashcardSet,
    updateFlashcardSet,
    deleteFlashcardSet,
    getFlashcards,
    getFlashcard,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    startStudySession,
    completeStudySession,
    clearError,
    setCurrentSet,
    setCurrentCard,
  };

  return <FlashcardContext.Provider value={value}>{children}</FlashcardContext.Provider>;
};

export default FlashcardContext; 