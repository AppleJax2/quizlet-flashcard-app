import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';
import Textarea from '../common/Textarea';

const flashcardSchema = z.object({
  front: z.string().min(1, 'Front side is required'),
  back: z.string().min(1, 'Back side is required'),
});

const flashcardSetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  flashcards: z.array(flashcardSchema).min(1, 'At least one flashcard is required'),
});

type FlashcardSetFormData = z.infer<typeof flashcardSetSchema>;

interface FlashcardSetFormProps {
  initialData?: FlashcardSetFormData;
  onSubmit: (data: FlashcardSetFormData) => Promise<void>;
  loading?: boolean;
}

const FlashcardSetForm: React.FC<FlashcardSetFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
}) => {
  const form = useForm<FlashcardSetFormData>({
    resolver: zodResolver(flashcardSetSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      flashcards: [{ front: '', back: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'flashcards',
  });

  const handleAddCard = () => {
    append({ front: '', back: '' });
  };

  const handleRemoveCard = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Give your flashcard set a descriptive title
          </p>
          <div className="mt-1">
            <Input
              id="title"
              {...form.register('title')}
              placeholder="e.g., Spanish Vocabulary, React Hooks"
              autoFocus
            />
            {form.formState.errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Optional: Add more details about this set
          </p>
          <div className="mt-1">
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="What will you learn from this set?"
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Flashcards
          </h3>
          <Button
            type="button"
            onClick={handleAddCard}
            variant="outline"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add Card
          </Button>
        </div>

        <AnimatePresence mode="popLayout">
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Card {index + 1}
                  </h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Front
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      The question or prompt
                    </p>
                    <div className="mt-1">
                      <Textarea
                        {...form.register(`flashcards.${index}.front`)}
                        placeholder="What's the question?"
                        rows={3}
                      />
                      {form.formState.errors.flashcards?.[index]?.front && (
                        <p className="mt-1 text-sm text-red-500">
                          {form.formState.errors.flashcards[index]?.front?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Back
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      The answer or explanation
                    </p>
                    <div className="mt-1">
                      <Textarea
                        {...form.register(`flashcards.${index}.back`)}
                        placeholder="What's the answer?"
                        rows={3}
                      />
                      {form.formState.errors.flashcards?.[index]?.back && (
                        <p className="mt-1 text-sm text-red-500">
                          {form.formState.errors.flashcards[index]?.back?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {form.formState.errors.flashcards?.message && (
          <p className="text-sm text-red-500 mt-2">
            {form.formState.errors.flashcards.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        >
          {initialData ? 'Save Changes' : 'Create Set'}
        </Button>
      </div>
    </form>
  );
};

export default FlashcardSetForm; 