import { useState, useEffect, useCallback } from 'react';
import { Flashcard, CardResult, UUID } from '@/types/flashcard.types';
import * as srs from '@/utils/spacedRepetition';
import appStorage from '@/utils/storage';
import { useAuth } from '@/context/auth/AuthContext';

export interface SpacedRepetitionCard extends Flashcard {
  learningState: srs.CardLearningState;
  progress: number;
  forgettingIndex: number;
  dueInDays: number;
  isOverdue: boolean;
}

interface SpacedRepetitionStats {
  totalCards: number;
  newCards: number;
  learningCards: number;
  masteredCards: number;
  matureCards: number;
  overdueCards: number;
  averageEase: number;
  averageInterval: number;
  retention: number;
}

interface SpacedRepetitionOptions {
  setId: UUID;
  cards: Flashcard[];
  maxNewCards?: number;
  maxReviewCards?: number;
  prioritizeOverdue?: boolean;
}

/**
 * Custom hook for managing spaced repetition learning for flashcards
 * 
 * This hook handles:
 * - Tracking learning states for cards
 * - Scheduling review dates
 * - Prioritizing cards based on spaced repetition algorithm
 * - Persisting learning state between sessions
 * - Generating study statistics
 */
export function useSpacedRepetition({
  setId,
  cards,
  maxNewCards = 10,
  maxReviewCards = 50,
  prioritizeOverdue = true,
}: SpacedRepetitionOptions) {
  const { user } = useAuth();
  const [learningStates, setLearningStates] = useState<Record<string, srs.CardLearningState>>({});
  const [studyQueue, setStudyQueue] = useState<SpacedRepetitionCard[]>([]);
  const [stats, setStats] = useState<SpacedRepetitionStats>({
    totalCards: 0,
    newCards: 0,
    learningCards: 0,
    masteredCards: 0,
    matureCards: 0,
    overdueCards: 0,
    averageEase: 0,
    averageInterval: 0,
    retention: 0,
  });
  const [initialized, setInitialized] = useState(false);
  
  // Initialize learning states from storage or create new ones
  useEffect(() => {
    if (!user?.id || !setId || cards.length === 0) return;
    
    const storageKey = `srs_states_${user.id}_${setId}`;
    const storedStates = appStorage.get<Record<string, srs.CardLearningState>>(
      storageKey,
      { encrypt: true }
    );
    
    // Initialize states for all cards
    const initializedStates: Record<string, srs.CardLearningState> = {};
    
    cards.forEach(card => {
      // Use stored state if available, otherwise initialize
      initializedStates[card.id] = storedStates?.[card.id] || srs.initializeLearningState();
    });
    
    setLearningStates(initializedStates);
    setInitialized(true);
    
    // Generate stats
    const updatedStats = srs.generateStudyStats(initializedStates);
    setStats(updatedStats);
  }, [user?.id, setId, cards]);
  
  // Save learning states to storage when they change
  useEffect(() => {
    if (!user?.id || !setId || !initialized) return;
    
    const storageKey = `srs_states_${user.id}_${setId}`;
    appStorage.set(
      storageKey,
      learningStates,
      { 
        encrypt: true,
        // Learning states should not expire
      }
    );
  }, [user?.id, setId, learningStates, initialized]);
  
  // Process a review and schedule the next one
  const processReview = useCallback((
    cardId: UUID,
    result: CardResult,
    timeSpent?: number
  ) => {
    if (!learningStates[cardId]) return;
    
    // Get average time spent for similar cards
    const cardTimeSpents = Object.values(learningStates)
      .flatMap(state => state.history
        .filter(h => h.timeSpent && h.timeSpent > 0)
        .map(h => h.timeSpent!)
      );
    
    const averageTimeSpent = cardTimeSpents.length > 0 
      ? cardTimeSpents.reduce((sum, time) => sum + time, 0) / cardTimeSpents.length 
      : undefined;
    
    // Schedule next review
    const updatedState = srs.scheduleNextReview(
      learningStates[cardId],
      result,
      timeSpent,
      averageTimeSpent
    );
    
    // Update learning states
    setLearningStates(prev => ({
      ...prev,
      [cardId]: updatedState
    }));
    
    // Update study queue (remove this card)
    setStudyQueue(prev => prev.filter(card => card.id !== cardId));
    
    // Update stats
    const updatedStats = srs.generateStudyStats({
      ...learningStates,
      [cardId]: updatedState
    });
    setStats(updatedStats);
    
    // Return the updated state for external use
    return updatedState;
  }, [learningStates]);
  
  // Generate a study queue based on current learning states
  const generateStudyQueue = useCallback(() => {
    if (!initialized || cards.length === 0) return;
    
    const now = new Date();
    
    // Transform cards to include learning state and metrics
    const cardsWithState: SpacedRepetitionCard[] = cards.map(card => {
      const state = learningStates[card.id] || srs.initializeLearningState();
      const dueDate = new Date(state.dueDate);
      const dueInDays = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...card,
        learningState: state,
        progress: srs.calculateCardProgress(state),
        forgettingIndex: srs.calculateForgettingIndex(state, now),
        dueInDays,
        isOverdue: now >= dueDate,
      };
    });
    
    // Separate into new, due, and overdue cards
    const newCards = cardsWithState.filter(card => card.learningState.history.length === 0);
    const dueCards = cardsWithState.filter(card => 
      card.learningState.history.length > 0 && card.isOverdue
    );
    const notDueCards = cardsWithState.filter(card => 
      card.learningState.history.length > 0 && !card.isOverdue
    );
    
    // Sort cards by priority
    const sortedNewCards = newCards.sort((a, b) => a.position - b.position);
    
    // Sort due cards by forgetting index (highest first)
    const sortedDueCards = dueCards.sort((a, b) => 
      b.forgettingIndex - a.forgettingIndex
    );
    
    // Sort not-due cards by due date (soonest first)
    const sortedNotDueCards = notDueCards.sort((a, b) => 
      a.dueInDays - b.dueInDays
    );
    
    // Build the queue with limits
    let queue: SpacedRepetitionCard[] = [];
    
    // Add due cards first
    if (prioritizeOverdue) {
      queue = [...sortedDueCards];
    }
    
    // Add new cards (up to maxNewCards)
    if (queue.length < maxReviewCards) {
      const newCardsToAdd = sortedNewCards.slice(0, Math.min(maxNewCards, maxReviewCards - queue.length));
      queue = [...queue, ...newCardsToAdd];
    }
    
    // If still space, add overdue cards not yet added
    if (!prioritizeOverdue && queue.length < maxReviewCards) {
      const remainingOverdue = sortedDueCards.filter(card => !queue.find(c => c.id === card.id));
      const overdueToAdd = remainingOverdue.slice(0, Math.min(remainingOverdue.length, maxReviewCards - queue.length));
      queue = [...queue, ...overdueToAdd];
    }
    
    // If still space, add cards that are due soon
    if (queue.length < maxReviewCards) {
      const soonDueToAdd = sortedNotDueCards.slice(0, Math.min(sortedNotDueCards.length, maxReviewCards - queue.length));
      queue = [...queue, ...soonDueToAdd];
    }
    
    setStudyQueue(queue);
    
    return queue;
  }, [initialized, cards, learningStates, maxNewCards, maxReviewCards, prioritizeOverdue]);
  
  // Reset the study queue to start fresh
  const resetQueue = useCallback(() => {
    setStudyQueue([]);
  }, []);
  
  // Reset all learning progress for a card
  const resetCardProgress = useCallback((cardId: UUID) => {
    setLearningStates(prev => ({
      ...prev,
      [cardId]: srs.initializeLearningState()
    }));
  }, []);
  
  // Reset all learning progress for the set
  const resetAllProgress = useCallback(() => {
    const resetStates: Record<string, srs.CardLearningState> = {};
    
    cards.forEach(card => {
      resetStates[card.id] = srs.initializeLearningState();
    });
    
    setLearningStates(resetStates);
    setStudyQueue([]);
    
    // Update stats
    const updatedStats = srs.generateStudyStats(resetStates);
    setStats(updatedStats);
  }, [cards]);
  
  // Export learning data (for migration or backup)
  const exportData = useCallback(() => {
    return {
      setId,
      userId: user?.id,
      learningStates,
      stats,
      exportDate: new Date().toISOString()
    };
  }, [setId, user?.id, learningStates, stats]);
  
  // Import learning data
  const importData = useCallback((data: {
    setId: UUID;
    userId: UUID;
    learningStates: Record<string, srs.CardLearningState>;
  }) => {
    if (data.setId !== setId) {
      throw new Error('Cannot import data from a different flashcard set');
    }
    
    setLearningStates(data.learningStates);
    
    // Update stats
    const updatedStats = srs.generateStudyStats(data.learningStates);
    setStats(updatedStats);
    
    // Clear study queue
    setStudyQueue([]);
  }, [setId]);
  
  return {
    // Study queue management
    studyQueue,
    generateStudyQueue,
    resetQueue,
    isDue: (cardId: UUID) => {
      const state = learningStates[cardId];
      return state && srs.isCardDueForReview(state);
    },
    
    // Card learning state
    learningStates,
    processReview,
    resetCardProgress,
    resetAllProgress,
    
    // Statistics
    stats,
    getCardProgress: (cardId: UUID) => {
      const state = learningStates[cardId];
      return state ? srs.calculateCardProgress(state) : 0;
    },
    
    // Data management
    exportData,
    importData,
    
    // Status
    initialized,
  };
}

export default useSpacedRepetition; 