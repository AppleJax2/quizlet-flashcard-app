import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { processorService, flashcardService } from '@/services';
import { ProcessedFlashcard } from '@/types/processor';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
];

const documentProcessSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  maxCards: z.number().int().min(5).max(100),
  includeImages: z.boolean().default(false),
  includeExamples: z.boolean().default(true),
  file: z
    .any()
    .refine((file) => file?.length > 0, 'File is required')
    .refine(
      (file) => file?.[0]?.size <= MAX_FILE_SIZE,
      `File size must be less than 10MB`
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      'Only PDF, DOC, DOCX, and TXT files are accepted'
    ),
});

type DocumentProcessFormValues = z.infer<typeof documentProcessSchema>;

export default function DocumentProcessorPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCards, setProcessedCards] = useState<ProcessedFlashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<DocumentProcessFormValues>({
    resolver: zodResolver(documentProcessSchema),
    defaultValues: {
      title: '',
      maxCards: 20,
      includeImages: true,
      includeExamples: true,
    },
  });

  const watchFile = watch('file');

  // Update the file name when a file is selected
  React.useEffect(() => {
    if (watchFile?.[0]) {
      setSelectedFileName(watchFile[0].name);
      
      // Auto-generate title from filename if empty
      if (!watch('title')) {
        const fileName = watchFile[0].name.split('.')[0];
        setValue('title', fileName.charAt(0).toUpperCase() + fileName.slice(1));
      }
    }
  }, [watchFile, setValue, watch]);

  const onSubmit = async (data: DocumentProcessFormValues) => {
    setIsProcessing(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      const file = data.file[0];
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', data.title);
      formData.append('maxCards', data.maxCards.toString());
      formData.append('includeImages', data.includeImages.toString());
      formData.append('includeExamples', data.includeExamples.toString());
      
      // Process the document with progress tracking
      const result = await processorService.processDocument(formData, (progress) => {
        setUploadProgress(progress);
      });
      
      setProcessedCards(result.cards);
      setStep('review');
    } catch (err) {
      setError('Failed to process document. Please try again.');
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
      const newSetId = await flashcardService.createSet({
        title,
        description: `Generated from document processing on ${new Date().toLocaleDateString()}`,
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files.length) {
      setValue('file', e.dataTransfer.files);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Document Processor</h1>
        <p className="mt-2 text-neutral-600">
          Upload a document and convert its content into flashcards for effective studying.
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
              <div 
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${
                  errors.file ? 'border-red-300 bg-red-50' : 'border-neutral-300 bg-neutral-50'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <svg
                  className={`mb-4 h-12 w-12 ${errors.file ? 'text-red-400' : 'text-neutral-400'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                
                <div className="mb-4 text-center">
                  {selectedFileName ? (
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-neutral-700">{selectedFileName}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setValue('file', null);
                          setSelectedFileName(null);
                        }}
                        className="text-sm text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="mb-1 text-sm font-medium text-neutral-700">
                        Drag and drop your file here, or click to select
                      </p>
                      <p className="text-xs text-neutral-500">
                        PDF, DOC, DOCX, TXT up to 10MB
                      </p>
                    </>
                  )}
                </div>

                <input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  {...register('file')}
                />
                
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </button>
                
                {errors.file && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.file.message?.toString()}
                  </p>
                )}
              </div>

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
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Link to="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" isLoading={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Generate Flashcards'}
                </Button>
              </div>
              
              {isProcessing && uploadProgress > 0 && (
                <div className="mt-4">
                  <p className="mb-1 text-sm text-neutral-700">Uploading and processing...</p>
                  <div className="h-2 w-full rounded-full bg-neutral-200">
                    <div
                      className="h-2 rounded-full bg-primary-600"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">{uploadProgress}% complete</p>
                </div>
              )}
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
              {selectedFileName && (
                <p className="mt-2 text-xs text-neutral-500">
                  Source: {selectedFileName} ({watchFile?.[0]?.size && formatBytes(watchFile[0].size)})
                </p>
              )}
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