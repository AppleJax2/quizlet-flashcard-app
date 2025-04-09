import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  lastReviewed?: Date;
  confidence?: number;
}

interface FlashcardSetProps {
  title: string;
  description?: string;
  flashcards: Flashcard[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onConfidenceUpdate?: (id: string, confidence: number) => void;
}

const FlashcardSet: React.FC<FlashcardSetProps> = ({
  title,
  description,
  flashcards,
  onEdit,
  onDelete,
  onConfidenceUpdate
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);

  // Early return if no flashcards
  if (!flashcards.length) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No flashcards available.
        </div>
      </div>
    );
  }

  // Since we check for empty array above, this is guaranteed to exist
  const currentCard = flashcards[currentIndex]!;

  const handleNext = () => {
    setIsFlipped(false);
    setShowConfidence(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setShowConfidence(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    if (!isFlipped) {
      setShowConfidence(true);
    }
  };

  const handleConfidence = (level: number) => {
    if (onConfidenceUpdate) {
      onConfidenceUpdate(currentCard.id, level);
    }
    handleNext();
  };

  const cardVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.4 }
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.4 }
    }
  };

  const confidenceColors = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-green-500',
    5: 'bg-emerald-500'
  } as const;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        )}
        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{currentIndex + 1} of {flashcards.length}</span>
        </div>
      </div>

      <div className="relative perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full"
          >
            <Card
              variant="elevated"
              interactive
              onClick={handleFlip}
              className="w-full aspect-[3/2] flex items-center justify-center p-8 cursor-pointer"
            >
              <motion.div
                className="w-full h-full flex items-center justify-center"
                animate={isFlipped ? 'back' : 'front'}
                variants={cardVariants}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-center">
                  <p className="text-xl font-medium">
                    {isFlipped ? currentCard.back : currentCard.front}
                  </p>
                  {showConfidence && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4"
                    >
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        How well did you know this?
                      </p>
                      <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            className={`w-8 h-8 rounded-full ${confidenceColors[level as keyof typeof confidenceColors]} text-white font-medium transition-transform hover:scale-110`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfidence(level);
                            }}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          onClick={handlePrevious}
          variant="outline"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
        >
          Previous
        </Button>
        <div className="flex space-x-2">
          {onEdit && (
            <Button
              onClick={() => onEdit(currentCard.id)}
              variant="ghost"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={() => onDelete(currentCard.id)}
              variant="ghost"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              Delete
            </Button>
          )}
        </div>
        <Button
          onClick={handleNext}
          variant="outline"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default FlashcardSet; 