import { useState, useCallback } from 'react';
import { Flashcard, CardProgress, StudySessionStats } from '@/types';
import { flashcardService } from '@/services';
import { SRSService, PerformanceRatings } from '@/services/srsService';
import { useToast } from './useToast';

interface UseStudySessionProps {
  flashcards: Flashcard[];
  userId: string;
  onComplete?: (stats: StudySessionStats) => void;
}

interface StudySession {
  correct: number;
  incorrect: number;
  skipped: number;
  remainingCards: Array<{
    flashcard: Flashcard;
    progress: CardProgress;
  }>;
}

type ResponseType = 'correct' | 'incorrect' | 'skip';

export function useStudySession({
  flashcards,
  userId,
  onComplete,
}: UseStudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [session, setSession] = useState<StudySession>(() => {
    const srsService = new SRSService();
    return {
      correct: 0,
      incorrect: 0,
      skipped: 0,
      remainingCards: flashcards.map(flashcard => ({
        flashcard,
        progress: srsService.initializeCardProgress(flashcard.id, userId),
      })),
    };
  });

  const { showToast } = useToast();
  const srsService = new SRSService();

  const currentCard = session.remainingCards[currentIndex];
  const isComplete = !currentCard;

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handleResponse = useCallback(async (response: ResponseType) => {
    if (!currentCard) return;

    const newSession = { ...session };

    try {
      // Map response to performance rating
      let performance: PerformanceRatings;
      switch (response) {
        case 'correct':
          performance = PerformanceRatings.GOOD;
          newSession.correct++;
          break;
        case 'incorrect':
          performance = PerformanceRatings.FORGOT;
          newSession.incorrect++;
          // Move card to the back of the deck for review
          const [incorrectCard] = newSession.remainingCards.splice(currentIndex, 1);
          incorrectCard.progress = {
            ...incorrectCard.progress,
            ...srsService.updateCardProgress(incorrectCard.progress, performance),
          };
          newSession.remainingCards.push(incorrectCard);
          break;
        case 'skip':
          performance = PerformanceRatings.SKIP;
          newSession.skipped++;
          // Move skipped card to the back of the deck
          const [skippedCard] = newSession.remainingCards.splice(currentIndex, 1);
          skippedCard.progress = {
            ...skippedCard.progress,
            ...srsService.updateCardProgress(skippedCard.progress, performance),
          };
          newSession.remainingCards.push(skippedCard);
          break;
      }

      // Update card progress in the backend
      const updatedProgress = srsService.updateCardProgress(currentCard.progress, performance);
      const { data } = await flashcardService.updateCardProgress(currentCard.flashcard.id, updatedProgress);

      // Update the card's progress with the response from the server
      if (response === 'correct') {
        const [card] = newSession.remainingCards.splice(currentIndex, 1);
        card.progress = data;
      }

      setSession(newSession);
      setIsFlipped(false);

      // Check if we've completed all cards
      if (currentIndex >= newSession.remainingCards.length - 1) {
        const stats = srsService.calculateSessionStats(
          newSession.remainingCards.flatMap(card => card.progress.performanceHistory)
        );
        showToast({
          title: 'Study Session Complete',
          description: `Correct: ${stats.correct}, Incorrect: ${stats.incorrect}, Skipped: ${stats.skipped}`,
          type: 'success',
        });
        onComplete?.(stats);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      console.error('Failed to update study progress:', error);
      showToast({
        title: 'Error',
        description: 'Failed to update study progress',
        type: 'error',
      });
    }
  }, [currentCard, currentIndex, onComplete, session, srsService, showToast]);

  const resetSession = useCallback(() => {
    const srsService = new SRSService();
    setCurrentIndex(0);
    setIsFlipped(false);
    setSession({
      correct: 0,
      incorrect: 0,
      skipped: 0,
      remainingCards: flashcards.map(flashcard => ({
        flashcard,
        progress: srsService.initializeCardProgress(flashcard.id, userId),
      })),
    });
  }, [flashcards, userId]);

  return {
    currentCard,
    currentIndex,
    isFlipped,
    session,
    handleFlip,
    handleResponse,
    resetSession,
    isComplete,
  };
} 