import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StudySessionStats, Flashcard } from '@/types';
import { Flashcard as FlashcardType } from '@/types/flashcards';
import { FlashcardSet } from '@/types/flashcards';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { useStudySession } from '@/hooks/useStudySession';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  imageUrl?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  dueDate?: Date;
}

interface FlashcardStudyProps {
  /**
   * Array of flashcards to study
   */
  flashcards: FlashcardData[];
  
  /**
   * Callback when a flashcard is rated
   */
  onRate?: (cardId: string, rating: 'correct' | 'incorrect' | 'skip') => void;
  
  /**
   * Callback when the study session is completed
   */
  onComplete?: (results: { 
    correct: number; 
    incorrect: number; 
    skipped: number; 
    totalTime: number;
  }) => void;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Initial card index to show
   */
  initialCardIndex?: number;
  
  /**
   * Enable keyboard shortcuts
   */
  enableKeyboardShortcuts?: boolean;
  
  /**
   * Study interface variant
   */
  variant?: 'standard' | 'compact' | 'focused';
}

/**
 * FlashcardStudy component with enhanced visual hierarchy.
 * Implements hierarchy through font size, weight, contrast, and layout
 * to guide users through the learning process.
 */
export const FlashcardStudy: React.FC<FlashcardStudyProps> = ({
  flashcards,
  onRate,
  onComplete,
  className,
  initialCardIndex = 0,
  enableKeyboardShortcuts = true,
  variant = 'standard',
}) => {
  const { user } = useAuth();
  const [currentCardIndex, setCurrentCardIndex] = useState(initialCardIndex);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState({ correct: 0, incorrect: 0, skipped: 0 });
  const [sessionStartTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  const currentCard = flashcards[currentCardIndex];
  const progress = Math.round(((currentCardIndex) / flashcards.length) * 100);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;
      
      switch (e.key) {
        case ' ':
          // Spacebar - flip card
          e.preventDefault();
          setIsFlipped(prev => !prev);
          break;
        case 'ArrowRight':
          // Right arrow - next card if flipped, otherwise flip
          e.preventDefault();
          if (isFlipped) {
            handleRate('correct');
          } else {
            setIsFlipped(true);
          }
          break;
        case 'ArrowLeft':
          // Left arrow - incorrect if flipped, otherwise flip
          e.preventDefault();
          if (isFlipped) {
            handleRate('incorrect');
          } else {
            setIsFlipped(true);
          }
          break;
        case 'ArrowDown':
          // Down arrow - skip
          e.preventDefault();
          handleRate('skip');
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentCardIndex, isCompleted, enableKeyboardShortcuts]);
  
  // Function to handle rating and moving to next card
  const handleRate = useCallback((rating: 'correct' | 'incorrect' | 'skip') => {
    if (onRate && currentCard) {
      onRate(currentCard.id, rating);
    }
    
    // Update results
    setResults(prev => ({
      ...prev,
      [rating]: prev[rating] + 1,
    }));
    
    // Check if session is complete
    if (currentCardIndex >= flashcards.length - 1) {
      completeSession();
    } else {
      // Move to next card
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  }, [currentCardIndex, currentCard, onRate, flashcards.length]);
  
  // Complete the study session
  const completeSession = useCallback(() => {
    const totalTime = Math.round((Date.now() - sessionStartTime) / 1000);
    setIsCompleted(true);
    
    if (onComplete) {
      onComplete({
        ...results,
        totalTime,
      });
    }
  }, [results, sessionStartTime, onComplete]);
  
  // Card content size classes based on variant
  const contentSizeClasses = {
    standard: 'min-h-[300px] p-8',
    compact: 'min-h-[200px] p-4',
    focused: 'min-h-[400px] p-10',
  };
  
  // Width classes based on variant
  const widthClasses = {
    standard: 'max-w-xl',
    compact: 'max-w-md',
    focused: 'max-w-2xl',
  };
  
  // Render completion view
  if (isCompleted) {
    return (
      <Card className={cn('overflow-hidden', widthClasses[variant], className)}>
        <CardContent className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
          <div className="mb-2 rounded-full bg-primary-100 p-3">
            <svg className="h-10 w-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-secondary-900">Study Session Complete!</h2>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-600">{results.correct}</div>
              <div className="text-sm text-green-700">Correct</div>
            </div>
            
            <div className="rounded-lg bg-red-50 p-4">
              <div className="text-2xl font-bold text-red-600">{results.incorrect}</div>
              <div className="text-sm text-red-700">Incorrect</div>
            </div>
            
            <div className="rounded-lg bg-neutral-50 p-4">
              <div className="text-2xl font-bold text-neutral-600">{results.skipped}</div>
              <div className="text-sm text-neutral-700">Skipped</div>
            </div>
          </div>
          
          <div className="text-sm text-secondary-600">
            You studied {flashcards.length} flashcards
          </div>
          
          <div className="flex space-x-4">
            <Button 
              variant="outline"
              onClick={() => {
                setCurrentCardIndex(0);
                setIsFlipped(false);
                setResults({ correct: 0, incorrect: 0, skipped: 0 });
                setIsCompleted(false);
              }}
            >
              Study Again
            </Button>
            
            <Button 
              variant="primary"
              onClick={() => window.history.back()}
            >
              Back to Set
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Progress bar */}
      <div className="mb-6 w-full max-w-xl">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-secondary-600">
            Card {currentCardIndex + 1} of {flashcards.length}
          </span>
          <span className="text-secondary-500">
            {progress}% Complete
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          <div 
            className="h-2 rounded-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
      
      {/* Flashcard */}
      <Card 
        className={cn('w-full overflow-hidden', widthClasses[variant])}
        ref={cardRef}
      >
        <div 
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center text-center transition-all duration-300',
            contentSizeClasses[variant],
            isFlipped ? 'bg-secondary-50' : 'bg-white'
          )}
          onClick={() => setIsFlipped(prev => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsFlipped(prev => !prev);
            }
          }}
          tabIndex={0}
          role="button"
          aria-pressed={isFlipped}
          aria-label={isFlipped ? 'Show question' : 'Show answer'}
        >
          {currentCard && (
            <>
              {/* Card label for screen readers */}
              <span className="sr-only">
                {isFlipped ? 'Answer' : 'Question'} - Card {currentCardIndex + 1} of {flashcards.length}
              </span>
              
              {/* Side indicator */}
              <div className="mb-4 rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium text-secondary-500">
                {isFlipped ? 'ANSWER' : 'QUESTION'}
              </div>
              
              {/* Card content */}
              <div className={cn(
                'max-w-full transition-all duration-300',
                isFlipped ? 'text-xl font-normal text-secondary-800' : 'text-2xl font-semibold text-secondary-900'
              )}>
                {isFlipped ? currentCard.back : currentCard.front}
              </div>
              
              {/* Tap to reveal hint */}
              {!isFlipped && (
                <div className="mt-8 flex items-center text-xs text-secondary-400">
                  <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Tap to reveal answer
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Action buttons with clear visual hierarchy */}
        <CardFooter 
          className={cn(
            'flex items-center justify-between space-x-2 border-t border-neutral-200 bg-white p-4',
            isFlipped ? 'opacity-100' : 'opacity-70'
          )}
        >
          <Button
            variant="outline"
            onClick={() => handleRate('skip')}
            disabled={!isFlipped}
            className="flex-1"
            aria-label="Skip this card"
          >
            Skip
          </Button>
          
          <Button
            variant="destructive"
            onClick={() => handleRate('incorrect')}
            disabled={!isFlipped}
            className="flex-1"
            aria-label="Mark as incorrect"
          >
            Incorrect
          </Button>
          
          <Button
            variant="primary"
            onClick={() => handleRate('correct')}
            disabled={!isFlipped}
            className="flex-1"
            aria-label="Mark as correct"
          >
            Correct
          </Button>
        </CardFooter>
      </Card>
      
      {/* Keyboard shortcuts legend */}
      {enableKeyboardShortcuts && (
        <div className="mt-6 grid grid-cols-2 gap-4 text-center text-xs text-secondary-500 sm:grid-cols-4">
          <div>
            <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-secondary-700">Space</kbd>
            <span className="ml-1">Flip Card</span>
          </div>
          <div>
            <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-secondary-700">→</kbd>
            <span className="ml-1">Correct</span>
          </div>
          <div>
            <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-secondary-700">←</kbd>
            <span className="ml-1">Incorrect</span>
          </div>
          <div>
            <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-secondary-700">↓</kbd>
            <span className="ml-1">Skip</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardStudy; 