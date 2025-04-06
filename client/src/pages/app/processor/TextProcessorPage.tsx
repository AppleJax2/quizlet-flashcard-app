import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FormFeedback from '@/components/ui/FormFeedback';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { processorService, flashcardService } from '@/services';
import { ProcessedFlashcard } from '@/types/processor';

const textProcessSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Text must be at least 10 characters long'),
  maxCards: z.number().int().min(5, 'Minimum 5 cards required').max(100, 'Maximum 100 cards allowed'),
  includeImages: z.boolean().default(false),
  includeExamples: z.boolean().default(true),
});

type TextProcessFormValues = z.infer<typeof textProcessSchema>;

// Memoized flashcard item component
const FlashcardItem = React.memo(({ 
  card, 
  index, 
  onEdit, 
  onRemove 
}: { 
  card: ProcessedFlashcard; 
  index: number; 
  onEdit: (index: number, field: 'question' | 'answer', value: string) => void;
  onRemove: (index: number) => void;
}) => {
  return (
    <Card key={index} className="mb-4">
      <CardContent className="p-6">
        <div className="mb-4">
          <label htmlFor={`question-${index}`} className="mb-1 block text-sm font-medium text-neutral-700">
            Question
          </label>
          <textarea
            id={`question-${index}`}
            rows={2}
            className="block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            value={card.question}
            onChange={(e) => onEdit(index, 'question', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor={`answer-${index}`} className="mb-1 block text-sm font-medium text-neutral-700">
            Answer
          </label>
          <textarea
            id={`answer-${index}`}
            rows={3}
            className="block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            value={card.answer}
            onChange={(e) => onEdit(index, 'answer', e.target.value)}
          />
        </div>

        {card.imageUrl && (
          <div className="mb-4">
            <p className="mb-1 block text-sm font-medium text-neutral-700">Image</p>
            <img 
              src={card.imageUrl} 
              alt="Flashcard visual aid" 
              className="max-h-40 rounded-md border border-neutral-300"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex justify-end">
          <Button
            variant="danger"
            size="sm"
            onClick={() => onRemove(index)}
          >
            Remove Card
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

FlashcardItem.displayName = 'FlashcardItem';

export default function TextProcessorPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCards, setProcessedCards] = useState<ProcessedFlashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<TextProcessFormValues>({
    resolver: zodResolver(textProcessSchema),
    defaultValues: {
      title: '',
      content: '',
      maxCards: 20,
      includeImages: false,
      includeExamples: true,
    },
    mode: 'onChange',
  });

  const watchContent = watch('content');
  const watchTitle = watch('title');
  
  // Memoize expensive computations
  const wordCount = useMemo(() => {
    return watchContent ? watchContent.trim().split(/\s+/).filter(Boolean).length : 0;
  }, [watchContent]);

  const onSubmit = async (data: TextProcessFormValues) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await processorService.processText({
        title: data.title,
        content: data.content,
        maxCards: data.maxCards,
        includeImages: data.includeImages,
        includeExamples: data.includeExamples,
      });
      
      setProcessedCards(result.cards);
      setStep('review');
    } catch (err) {
      setError('Failed to process text. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveFlashcards = async () => {
    if (processedCards.length === 0) {
      setError('No flashcards to save.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const title = watchTitle;
      const newSetId = await flashcardService.createSet({
        title,
        description: `Generated from text processing on ${new Date().toLocaleDateString()}`,
        cards: processedCards.map(card => ({
          front: card.question,
          back: card.answer,
          imageUrl: card.imageUrl || null,
        })),
      });
      
      setSaveSuccess(true);
      
      // Navigate after a brief delay to show success message
      setTimeout(() => {
        navigate(`/flashcards/${newSetId}`);
      }, 1500);
    } catch (err) {
      setError('Failed to save flashcards. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Memoize handlers to prevent unnecessary re-renders
  const handleEditCard = useCallback((index: number, field: 'question' | 'answer', value: string) => {
    setProcessedCards(prevCards => {
      const updatedCards = [...prevCards];
      updatedCards[index] = {
        ...updatedCards[index],
        [field]: value,
      };
      return updatedCards;
    });
  }, []);

  const handleRemoveCard = useCallback((index: number) => {
    setProcessedCards(prevCards => prevCards.filter((_, i) => i !== index));
  }, []);

  const handleBackToInput = () => {
    setStep('input');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Text Processor</h1>
          <p className="mt-2 text-neutral-600">
            Transform your text content into flashcards for more effective learning.
          </p>
        </div>
        {step === 'review' && (
          <div className="mt-4 sm:mt-0">
            <Button
              variant="outline"
              onClick={handleBackToInput}
              className="mr-2"
            >
              Back to Input
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
          {error}
        </div>
      )}
      
      {saveSuccess && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700" role="status">
          Flashcards saved successfully! Redirecting...
        </div>
      )}

      {step === 'input' ? (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700">
                  Set Title
                </label>
                <input
                  id="title"
                  type="text"
                  className={`mt-1 block w-full rounded-md border ${
                    errors.title ? 'border-red-300' : 'border-neutral-300'
                  } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
                  placeholder="Enter a title for your flashcard set"
                  aria-invalid={errors.title ? 'true' : 'false'}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                  {...register('title')}
                />
                {errors.title && (
                  <FormFeedback 
                    id="title-error" 
                    message={errors.title.message || 'Title is required'} 
                    type="error" 
                  />
                )}
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-neutral-700">
                  Text Content
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <textarea
                    id="content"
                    rows={12}
                    className={`block w-full rounded-md border ${
                      errors.content ? 'border-red-300' : 'border-neutral-300'
                    } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
                    placeholder="Paste or type your text content here"
                    aria-invalid={errors.content ? 'true' : 'false'}
                    aria-describedby={errors.content ? 'content-error' : 'content-help'}
                    {...register('content')}
                  ></textarea>
                </div>
                <div className="mt-1 flex flex-col sm:flex-row sm:justify-between">
                  <p id="content-help" className="text-xs text-neutral-500">
                    Word count: {wordCount}
                  </p>
                  {errors.content && (
                    <FormFeedback 
                      id="content-error" 
                      message={errors.content.message || 'Content is required'} 
                      type="error" 
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="maxCards" className="block text-sm font-medium text-neutral-700">
                    Maximum Cards
                  </label>
                  <input
                    id="maxCards"
                    type="number"
                    min="5"
                    max="100"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.maxCards ? 'border-red-300' : 'border-neutral-300'
                    } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
                    aria-invalid={errors.maxCards ? 'true' : 'false'}
                    aria-describedby={errors.maxCards ? 'maxCards-error' : undefined}
                    {...register('maxCards', { valueAsNumber: true })}
                  />
                  {errors.maxCards && (
                    <FormFeedback 
                      id="maxCards-error" 
                      message={errors.maxCards.message || 'Invalid value'} 
                      type="error" 
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="includeImages"
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      {...register('includeImages')}
                    />
                    <label htmlFor="includeImages" className="ml-2 block text-sm text-neutral-700">
                      Include relevant images (when available)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="includeExamples"
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      {...register('includeExamples')}
                    />
                    <label htmlFor="includeExamples" className="ml-2 block text-sm text-neutral-700">
                      Include examples in answers
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={isProcessing}
                  disabled={isProcessing || !isDirty || !isValid}
                >
                  Generate Flashcards
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">Review Generated Flashcards</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBackToInput}
              >
                Back to Input
              </Button>
              <Button
                onClick={handleSaveFlashcards}
                isLoading={isProcessing}
                disabled={isProcessing || processedCards.length === 0}
              >
                Save Flashcards
              </Button>
            </div>
          </div>

          {isProcessing ? (
            // Loading skeleton for cards
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border border-neutral-200 bg-white p-6">
                  <div className="mb-4">
                    <Skeleton height={16} width={100} className="mb-2" />
                    <Skeleton height={48} />
                  </div>
                  <div className="mb-4">
                    <Skeleton height={16} width={80} className="mb-2" />
                    <Skeleton height={72} />
                  </div>
                  <div className="flex justify-end">
                    <Skeleton height={32} width={120} />
                  </div>
                </div>
              ))}
            </div>
          ) : processedCards.length > 0 ? (
            <div>
              <p className="mb-4 text-neutral-600">
                {processedCards.length} flashcards were generated. You can edit them before saving.
              </p>
              
              {processedCards.map((card, index) => (
                <FlashcardItem
                  key={index}
                  card={card}
                  index={index}
                  onEdit={handleEditCard}
                  onRemove={handleRemoveCard}
                />
              ))}
              
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSaveFlashcards}
                  isLoading={isProcessing}
                  disabled={isProcessing || processedCards.length === 0}
                >
                  Save Flashcards
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center">
              <h3 className="mb-2 text-lg font-medium text-neutral-900">No flashcards generated</h3>
              <p className="mb-6 text-neutral-600">
                Try adjusting your text content and settings to generate flashcards.
              </p>
              <Button onClick={handleBackToInput}>Back to Input</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 