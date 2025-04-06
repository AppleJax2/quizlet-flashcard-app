import React from 'react';
import { Card, Button } from '@/components/ui';
import { FlashcardSet, StudySessionStats } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useStudySession } from '@/hooks/useStudySession';

interface FlashcardStudyProps {
  flashcardSet: FlashcardSet;
  onComplete?: (stats: StudySessionStats) => void;
}

export const FlashcardStudy: React.FC<FlashcardStudyProps> = ({
  flashcardSet,
  onComplete,
}) => {
  const { user } = useAuth();

  if (!user?.id) {
    return (
      <div className="text-center p-6">
        <h3 className="text-lg font-semibold mb-4">Authentication Required</h3>
        <p className="text-muted-foreground">
          Please log in to study flashcards.
        </p>
      </div>
    );
  }

  const {
    currentCard,
    currentIndex,
    isFlipped,
    session,
    handleFlip,
    handleResponse,
    resetSession,
    isComplete,
  } = useStudySession({
    flashcards: flashcardSet.flashcards,
    userId: user.id,
    onComplete,
  });

  if (isComplete) {
    return (
      <div className="text-center p-6">
        <h3 className="text-lg font-semibold mb-4">Study Session Complete!</h3>
        <div className="space-y-2">
          <p>Correct: {session.correct}</p>
          <p>Incorrect: {session.incorrect}</p>
          <p>Skipped: {session.skipped}</p>
        </div>
        <Button
          className="mt-4"
          onClick={resetSession}
        >
          Start Over
        </Button>
      </div>
    );
  }

  const nextReviewDate = new Date(currentCard.progress.nextReviewDate);
  const isOverdue = nextReviewDate < new Date();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          Card {currentIndex + 1} of {session.remainingCards.length}
        </div>
        <div className="text-sm text-muted-foreground">
          Correct: {session.correct} | Incorrect: {session.incorrect} | Skipped: {session.skipped}
        </div>
      </div>

      <Card
        className={cn(
          'p-6 min-h-[200px] flex items-center justify-center cursor-pointer transition-transform duration-500',
          isFlipped && 'scale-[0.98]',
          isOverdue && 'border-yellow-500'
        )}
        onClick={handleFlip}
      >
        <div className="text-center">
          <div className="text-lg">
            {isFlipped ? currentCard.flashcard.back : currentCard.flashcard.front}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Click to {isFlipped ? 'hide' : 'show'} answer
          </div>
          {isOverdue && (
            <div className="mt-2 text-sm text-yellow-600">
              Review overdue by {Math.round((Date.now() - nextReviewDate.getTime()) / (1000 * 60 * 60 * 24))} days
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => handleResponse('skip')}
        >
          Skip
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleResponse('incorrect')}
        >
          Incorrect
        </Button>
        <Button
          variant="default"
          onClick={() => handleResponse('correct')}
        >
          Correct
        </Button>
      </div>
    </div>
  );
}; 