import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { processorService, flashcardService } from '@/services';
import { ProcessedFlashcard } from '@/types/processor';

const urlProcessSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Please enter a valid URL'),
  maxCards: z.number().int().min(5).max(100),
  includeImages: z.boolean().default(false),
  includeExamples: z.boolean().default(true),
  focusOnMainContent: z.boolean().default(true),
});

type UrlProcessFormValues = z.infer<typeof urlProcessSchema>;

export default function UrlProcessorPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCards, setProcessedCards] = useState<ProcessedFlashcard[]>([]);
  const [urlPreview, setUrlPreview] = useState<{ title: string; description: string; image: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'review'>('input');
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<UrlProcessFormValues>({
    resolver: zodResolver(urlProcessSchema),
    defaultValues: {
      title: '',
      url: '',
      maxCards: 20,
      includeImages: true,
      includeExamples: true,
      focusOnMainContent: true,
    },
  });

  const watchUrl = watch('url');

  const fetchUrlPreview = async () => {
    if (!watchUrl || !watchUrl.startsWith('http')) return;
    
    try {
      setIsProcessing(true);
      const preview = await processorService.getUrlPreview(watchUrl);
      setUrlPreview(preview);
      
      // Auto-fill the title if empty
      if (preview.title && !watch('title')) {
        setValue('title', preview.title);
      }
    } catch (err) {
      console.error('Failed to fetch URL preview:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = async (data: UrlProcessFormValues) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await processorService.processUrl({
        title: data.title,
        url: data.url,
        maxCards: data.maxCards,
        includeImages: data.includeImages,
        includeExamples: data.includeExamples,
        focusOnMainContent: data.focusOnMainContent,
      });
      
      setProcessedCards(result.cards);
      setStep('review');
    } catch (err) {
      setError('Failed to process URL content. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveFlashcards = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const title = watch('title');
      const url = watch('url');
      const newSetId = await flashcardService.createSet({
        title,
        description: `Generated from URL: ${url}`,
        cards: processedCards.map(card => ({
          front: card.question,
          back: card.answer,
          imageUrl: card.imageUrl || null,
        })),
      });
      
      navigate(`/flashcards/${newSetId}`);
    } catch (err) {
      setError('Failed to save flashcards. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditCard = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedCards = [...processedCards];
    updatedCards[index] = {
      ...updatedCards[index],
      [field]: value,
    };
    setProcessedCards(updatedCards);
  };

  const handleRemoveCard = (index: number) => {
    setProcessedCards(processedCards.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">URL Content Processor</h1>
        <p className="mt-2 text-neutral-600">
          Create flashcards from online articles, blog posts, and other web content.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {step === 'input' ? (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-neutral-700">
                  URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    id="url"
                    type="url"
                    className={`block w-full rounded-md border ${
                      errors.url ? 'border-red-300' : 'border-neutral-300'
                    } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
                    placeholder="https://example.com/article"
                    {...register('url')}
                    onBlur={fetchUrlPreview}
                  />
                  <button
                    type="button"
                    onClick={fetchUrlPreview}
                    className="ml-3 inline-flex items-center rounded-md border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Preview
                  </button>
                </div>
                {errors.url && (
                  <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
                )}
              </div>

              {urlPreview && (
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex">
                    {urlPreview.image && (
                      <div className="mr-4 flex-shrink-0">
                        <img
                          src={urlPreview.image}
                          alt="URL Preview"
                          className="h-20 w-20 rounded-md object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-neutral-900">
                        {urlPreview.title}
                      </h3>
                      {urlPreview.description && (
                        <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                          {urlPreview.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-neutral-400">
                        {watchUrl}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                  {...register('title')}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
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
                    {...register('maxCards', { valueAsNumber: true })}
                  />
                  {errors.maxCards && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxCards.message}</p>
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
                  <div className="flex items-center">
                    <input
                      id="focusOnMainContent"
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      {...register('focusOnMainContent')}
                    />
                    <label htmlFor="focusOnMainContent" className="ml-2 block text-sm text-neutral-700">
                      Focus on main content (ignore menus, footers, etc.)
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Link to="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" isLoading={isProcessing}>
                  Generate Flashcards
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex justify-between">
                <h2 className="text-xl font-bold text-neutral-900">Review Generated Cards</h2>
                <p className="text-sm text-neutral-600">{processedCards.length} cards generated</p>
              </div>
              <p className="text-neutral-600">
                Review and edit your cards before saving them to your flashcard set.
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                Source: <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{watchUrl}</a>
              </p>
            </CardContent>
          </Card>

          {processedCards.map((card, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="mb-4 grid grid-cols-12 gap-4">
                  <div className="col-span-12 sm:col-span-6">
                    <label className="block text-sm font-medium text-neutral-700">
                      Question
                    </label>
                    <textarea
                      rows={3}
                      value={card.question}
                      onChange={(e) => handleEditCard(index, 'question', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <label className="block text-sm font-medium text-neutral-700">
                      Answer
                    </label>
                    <textarea
                      rows={3}
                      value={card.answer}
                      onChange={(e) => handleEditCard(index, 'answer', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                    ></textarea>
                  </div>
                </div>
                {card.imageUrl && (
                  <div className="mb-4">
                    <p className="mb-2 text-sm font-medium text-neutral-700">Image</p>
                    <img
                      src={card.imageUrl}
                      alt="Card illustration"
                      className="h-32 w-auto rounded-md border border-neutral-200 object-cover"
                    />
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveCard(index)}
                    className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Remove Card
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between space-x-3">
            <Button type="button" variant="outline" onClick={() => setStep('input')}>
              Back to Editor
            </Button>
            <Button 
              type="button" 
              isLoading={isProcessing} 
              onClick={handleSaveFlashcards}
              disabled={processedCards.length === 0}
            >
              Save Flashcard Set
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 