import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Input, Dialog, Tabs } from '@/components/ui';
import { FlashcardSet, Flashcard, CreateFlashcardSetRequest } from '@/types';
import { flashcardService } from '@/services';
import { useToast } from '@/hooks/useToast';

interface FlashcardSetManagerProps {
  initialSet?: FlashcardSet;
  onSave?: (set: FlashcardSet) => void;
  onCancel?: () => void;
}

export const FlashcardSetManager: React.FC<FlashcardSetManagerProps> = ({
  initialSet,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialSet?.title || '');
  const [description, setDescription] = useState(initialSet?.description || '');
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialSet?.flashcards || []);
  const [tags, setTags] = useState<string[]>(initialSet?.tags || []);
  const [isPublic, setIsPublic] = useState(initialSet?.isPublic || false);
  const [complexity, setComplexity] = useState(initialSet?.complexity || 'medium');
  const [language, setLanguage] = useState(initialSet?.language || 'english');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const setData: CreateFlashcardSetRequest = {
        title,
        description,
        flashcards,
        tags,
        isPublic,
        complexity: complexity as 'simple' | 'medium' | 'advanced',
        language,
      };

      let savedSet: FlashcardSet;
      if (initialSet?.id) {
        savedSet = await flashcardService.updateFlashcardSet(initialSet.id, setData);
      } else {
        savedSet = await flashcardService.createFlashcardSet(setData);
      }

      showToast({
        title: 'Success',
        description: `Flashcard set ${initialSet ? 'updated' : 'created'} successfully`,
        type: 'success',
      });

      onSave?.(savedSet);
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to save flashcard set. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFlashcard = () => {
    setFlashcards([
      ...flashcards,
      {
        front: '',
        back: '',
        difficulty: 'medium',
        tags: [],
      },
    ]);
  };

  const handleUpdateFlashcard = (index: number, updatedCard: Partial<Flashcard>) => {
    const newFlashcards = [...flashcards];
    newFlashcards[index] = { ...newFlashcards[index], ...updatedCard };
    setFlashcards(newFlashcards);
  };

  const handleRemoveFlashcard = (index: number) => {
    setFlashcards(flashcards.filter((_, i) => i !== index));
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <Tabs.List>
          <Tabs.Trigger value="details">Set Details</Tabs.Trigger>
          <Tabs.Trigger value="flashcards">Flashcards</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>
        
        <Form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <Tabs.Content value="details">
            <div className="space-y-4">
              <Input
                label="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                maxLength={200}
              />
              
              <Input
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                maxLength={1000}
                multiline
                rows={4}
              />
              
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <div
                    key={tag}
                    className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <Input
                label="Add Tag"
                placeholder="Type and press Enter"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      handleAddTag(input.value.trim());
                      input.value = '';
                    }
                  }
                }}
              />
            </div>
          </Tabs.Content>

          <Tabs.Content value="flashcards">
            <div className="space-y-6">
              {flashcards.map((card, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <Input
                      label="Front"
                      value={card.front}
                      onChange={e => handleUpdateFlashcard(index, { front: e.target.value })}
                      required
                      maxLength={2000}
                      multiline
                      rows={3}
                    />
                    
                    <Input
                      label="Back"
                      value={card.back}
                      onChange={e => handleUpdateFlashcard(index, { back: e.target.value })}
                      required
                      maxLength={2000}
                      multiline
                      rows={3}
                    />
                    
                    <div className="flex items-center gap-4">
                      <select
                        value={card.difficulty}
                        onChange={e => handleUpdateFlashcard(index, { difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                        className="form-select"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                      
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveFlashcard(index)}
                      >
                        Remove Card
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              <Button
                type="button"
                onClick={handleAddFlashcard}
                className="w-full"
              >
                Add Flashcard
              </Button>
            </div>
          </Tabs.Content>

          <Tabs.Content value="settings">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={e => setIsPublic(e.target.checked)}
                  className="form-checkbox"
                />
                <label htmlFor="isPublic">Make this set public</label>
              </div>
              
              <select
                value={complexity}
                onChange={e => setComplexity(e.target.value)}
                className="form-select w-full"
              >
                <option value="simple">Simple</option>
                <option value="medium">Medium</option>
                <option value="advanced">Advanced</option>
              </select>
              
              <Input
                label="Language"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                required
              />
            </div>
          </Tabs.Content>

          <div className="flex justify-end gap-4 mt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialSet ? 'Update Set' : 'Create Set'}
            </Button>
          </div>
        </Form>
      </Tabs>
    </Card>
  );
}; 