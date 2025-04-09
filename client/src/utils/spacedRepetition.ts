/**
 * Advanced Spaced Repetition System
 * 
 * This module implements a sophisticated spaced repetition algorithm 
 * based on the SuperMemo SM-2 algorithm with custom extensions for 
 * more granular difficulty adjustment and better handling of various
 * learning scenarios.
 */

import { CardResult, ISO8601Date } from '@/types/flashcard.types';

// Default parameters
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const DEFAULT_INTERVAL_STEP_1 = 1; // 1 day
const DEFAULT_INTERVAL_STEP_2 = 6; // 6 days
const EASE_BONUS_FOR_STREAK = 0.15; // Bonus for consistent correct answers
const EASE_PENALTY_FOR_WRONG = 0.2; // Penalty for wrong answers
const TIME_MULTIPLIER_THRESHOLD = 1.5; // Threshold for slow responses
const TIME_PENALTY = 0.1; // Penalty for slow responses

export interface CardReviewHistory {
  date: ISO8601Date;
  result: CardResult;
  timeSpent?: number; // in milliseconds
}

export interface CardLearningState {
  interval: number; // Current interval in days
  ease: number; // Ease factor (2.5 is default in SM-2)
  streak: number; // Consecutive correct answers
  lapses: number; // Number of times card has been forgotten
  dueDate: ISO8601Date; // Next review date
  lastReview: ISO8601Date; // Last review date
  history: CardReviewHistory[]; // Review history
}

/**
 * Initialize a learning state for a new card
 */
export function initializeLearningState(): CardLearningState {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return {
    interval: 0,
    ease: DEFAULT_EASE_FACTOR,
    streak: 0,
    lapses: 0,
    dueDate: tomorrow.toISOString(),
    lastReview: now.toISOString(),
    history: [],
  };
}

/**
 * Calculate the next review date based on card performance
 * 
 * @param state Current learning state
 * @param result Review result (correct, hard, incorrect, etc.)
 * @param timeSpent Time spent reviewing the card (ms)
 * @param averageTimeSpent Average time spent on similar cards (ms)
 * @returns Updated learning state
 */
export function scheduleNextReview(
  state: CardLearningState,
  result: CardResult,
  timeSpent?: number,
  averageTimeSpent?: number
): CardLearningState {
  const now = new Date();
  const reviewDate = now.toISOString();
  
  // Make a copy of the state to avoid mutation
  const newState: CardLearningState = {
    ...state,
    lastReview: reviewDate,
    history: [
      ...state.history,
      { date: reviewDate, result, timeSpent }
    ],
  };
  
  // Calculate time penalty if applicable
  let timePenalty = 0;
  if (timeSpent && averageTimeSpent && timeSpent > averageTimeSpent * TIME_MULTIPLIER_THRESHOLD) {
    timePenalty = TIME_PENALTY;
  }
  
  // Update state based on result
  switch (result) {
    case 'correct':
      // Increase streak and calculate next interval
      newState.streak += 1;
      
      // Calculate ease factor
      let easeBonus = 0;
      if (newState.streak > 2) {
        // Give a small bonus for consistent correct answers
        easeBonus = EASE_BONUS_FOR_STREAK;
      }
      
      // Adjust ease factor (add bonus, subtract time penalty)
      newState.ease = Math.max(
        MIN_EASE_FACTOR,
        newState.ease + easeBonus - timePenalty
      );
      
      // Calculate next interval using SM-2 algorithm
      if (newState.interval === 0) {
        // First successful review
        newState.interval = DEFAULT_INTERVAL_STEP_1;
      } else if (newState.interval === DEFAULT_INTERVAL_STEP_1) {
        // Second successful review
        newState.interval = DEFAULT_INTERVAL_STEP_2;
      } else {
        // Subsequent reviews use ease factor
        newState.interval = Math.round(newState.interval * newState.ease);
      }
      break;
      
    case 'hard':
      // Reset streak, reduce ease factor, reduce interval
      newState.streak = Math.max(0, newState.streak - 1);
      newState.ease = Math.max(MIN_EASE_FACTOR, newState.ease - 0.15 - timePenalty);
      
      // Hard reduces the next interval
      if (newState.interval === 0) {
        newState.interval = 1; // First review
      } else {
        // Increase interval but less aggressively
        newState.interval = Math.max(
          DEFAULT_INTERVAL_STEP_1,
          Math.round(newState.interval * 1.2)
        );
      }
      break;
      
    case 'incorrect':
      // Reset streak, reduce ease factor, reset interval
      newState.streak = 0;
      newState.lapses += 1;
      newState.ease = Math.max(
        MIN_EASE_FACTOR, 
        newState.ease - EASE_PENALTY_FOR_WRONG - timePenalty
      );
      
      // Incorrect answers restart the scheduling process
      // But we use an adaptive approach based on number of lapses
      if (newState.lapses <= 1) {
        // First failure, review tomorrow
        newState.interval = 1;
      } else if (newState.lapses <= 3) {
        // 2-3 failures, review sooner
        newState.interval = 1;
      } else {
        // Frequent failures, review same day
        newState.interval = 0; // Review later today
      }
      break;
      
    case 'skipped':
      // Skipped doesn't affect the learning state, but we do reschedule
      // Keep the same interval, but reset the due date
      break;
      
    default:
      // Unknown result, maintain current state
      break;
  }
  
  // Calculate next review date
  const nextReviewDate = new Date(now);
  if (result === 'incorrect' && newState.lapses > 3) {
    // For frequently failed cards, review again later today
    nextReviewDate.setHours(nextReviewDate.getHours() + 4);
  } else if (result === 'skipped') {
    // For skipped cards, try again soon
    nextReviewDate.setHours(nextReviewDate.getHours() + 1);
  } else {
    // Add the interval in days
    nextReviewDate.setDate(nextReviewDate.getDate() + newState.interval);
  }
  
  newState.dueDate = nextReviewDate.toISOString();
  
  return newState;
}

/**
 * Check if a card is due for review
 */
export function isCardDueForReview(state: CardLearningState): boolean {
  const now = new Date();
  const dueDate = new Date(state.dueDate);
  return now >= dueDate;
}

/**
 * Calculate forgetting index - probability of forgetting a card
 * Useful for prioritizing which cards to review
 * 
 * @param state Current learning state
 * @param now Current date
 * @returns Probability of forgetting (0-1)
 */
export function calculateForgettingIndex(
  state: CardLearningState,
  now: Date = new Date()
): number {
  const dueDate = new Date(state.dueDate);
  const lastReviewDate = new Date(state.lastReview);
  
  // If card is not yet due, forgetting index is low
  if (now < dueDate) {
    return 0.1;
  }
  
  // Calculate how overdue the card is
  const optimalInterval = state.interval;
  const daysSinceLastReview = Math.floor(
    (now.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Calculate forgetting index using exponential forgetting curve
  // P(forgetting) = 1 - e^(-days / (interval * factor))
  const forgettingIndex = 1 - Math.exp(
    -daysSinceLastReview / (optimalInterval * state.ease)
  );
  
  return Math.min(1, Math.max(0, forgettingIndex));
}

/**
 * Sort cards by priority for review session
 */
export function sortCardsByPriority(cards: { id: string; state: CardLearningState }[]): string[] {
  const now = new Date();
  
  // Calculate priority for each card
  const cardsWithPriority = cards.map(card => {
    const dueDate = new Date(card.state.dueDate);
    const daysPastDue = Math.max(0, 
      (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Calculate forgetting index
    const forgettingIndex = calculateForgettingIndex(card.state, now);
    
    // Priority formula combines days past due and forgetting index
    // Overdue cards get higher priority
    const priority = daysPastDue * 10 + forgettingIndex * 5 + card.state.lapses;
    
    return {
      id: card.id,
      priority
    };
  });
  
  // Sort by priority (highest first)
  cardsWithPriority.sort((a, b) => b.priority - a.priority);
  
  // Return sorted card IDs
  return cardsWithPriority.map(card => card.id);
}

/**
 * Calculate learning progress for a card
 * @returns Progress value between 0-1
 */
export function calculateCardProgress(state: CardLearningState): number {
  // Factors that contribute to progress:
  // 1. Ease factor - higher means better learning
  // 2. Interval - longer means better retention
  // 3. Streak - consecutive correct answers
  // 4. Lapses - more lapses means less progress
  
  // Normalize ease (1.3 to 3.0 range)
  const normalizedEase = Math.min(1, (state.ease - MIN_EASE_FACTOR) / 1.7);
  
  // Normalize interval (capped at 180 days)
  const normalizedInterval = Math.min(1, state.interval / 180);
  
  // Normalize streak (capped at 5)
  const normalizedStreak = Math.min(1, state.streak / 5);
  
  // Normalize lapses (reverse scale - more lapses = lower score)
  const lapsePenalty = Math.min(0.5, state.lapses * 0.1);
  
  // Calculate weighted progress
  const progress = (
    (normalizedEase * 0.3) + 
    (normalizedInterval * 0.4) + 
    (normalizedStreak * 0.2)
  ) * (1 - lapsePenalty);
  
  return Math.min(1, Math.max(0, progress));
}

/**
 * Generate study statistics from learning states
 */
export function generateStudyStats(
  learningStates: Record<string, CardLearningState>
): {
  totalCards: number;
  newCards: number;
  learningCards: number;
  masteredCards: number;
  matureCards: number;
  overdueCards: number;
  averageEase: number;
  averageInterval: number;
  retention: number;
} {
  const now = new Date();
  const states = Object.values(learningStates);
  
  if (states.length === 0) {
    return {
      totalCards: 0,
      newCards: 0,
      learningCards: 0,
      masteredCards: 0,
      matureCards: 0,
      overdueCards: 0,
      averageEase: 0,
      averageInterval: 0,
      retention: 0,
    };
  }
  
  // Count cards in different states
  let newCards = 0;
  let learningCards = 0;
  let masteredCards = 0;
  let matureCards = 0;
  let overdueCards = 0;
  
  // Accumulate stats
  let totalEase = 0;
  let totalInterval = 0;
  let correctAnswers = 0;
  let totalAnswers = 0;
  
  // Analyze each card
  states.forEach(state => {
    // Categorize card
    if (state.history.length === 0) {
      newCards++;
    } else if (state.interval < 7) {
      learningCards++;
    } else if (state.interval < 30) {
      masteredCards++;
    } else {
      matureCards++;
    }
    
    // Check if overdue
    const dueDate = new Date(state.dueDate);
    if (now > dueDate) {
      overdueCards++;
    }
    
    // Accumulate stats
    totalEase += state.ease;
    totalInterval += state.interval;
    
    // Calculate retention (correct answers / total answers, excluding skipped)
    state.history.forEach(review => {
      if (review.result !== 'skipped') {
        totalAnswers++;
        if (review.result === 'correct') {
          correctAnswers++;
        }
      }
    });
  });
  
  // Calculate averages
  const averageEase = totalEase / states.length;
  const averageInterval = totalInterval / states.length;
  const retention = totalAnswers > 0 ? correctAnswers / totalAnswers : 0;
  
  return {
    totalCards: states.length,
    newCards,
    learningCards,
    masteredCards,
    matureCards,
    overdueCards,
    averageEase,
    averageInterval,
    retention: retention * 100, // As percentage
  };
}

export default {
  initializeLearningState,
  scheduleNextReview,
  isCardDueForReview,
  calculateForgettingIndex,
  sortCardsByPriority,
  calculateCardProgress,
  generateStudyStats,
}; 