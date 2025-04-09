import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Form';
import { Select } from '@/components/ui/Form';
import { Checkbox } from '@/components/ui/Form';

// Types for the flashcard set
interface Flashcard {
  id: string;
  front: string;
  back: string;
  notes?: string;
  tags?: string[];
  imageUrl?: string;
  lastReviewed?: Date;
  reviewCount?: number;
  confidence?: number; // 0-1 scale
}

interface FlashcardSet {
  id?: string;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  cards: Flashcard[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
  cardCount?: number;
  owner?: string;
  coverImage?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Default empty flashcard
const createEmptyCard = (): Flashcard => ({
  id: crypto.randomUUID(),
  front: '',
  back: '',
  notes: '',
  tags: [],
});

// Categories for flashcard sets
const CATEGORIES = [
  { value: 'language', label: 'Language Learning' },
  { value: 'science', label: 'Science' },
  { value: 'math', label: 'Mathematics' },
  { value: 'history', label: 'History' },
  { value: 'literature', label: 'Literature' },
  { value: 'programming', label: 'Programming' },
  { value: 'arts', label: 'Arts' },
  { value: 'business', label: 'Business' },
  { value: 'other', label: 'Other' },
];

// Difficulty levels
const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

/**
 * CreateFlashcardSetPage component for creating new flashcard sets
 * Includes form validation, preview functionality, and keyboard shortcuts
 */
const CreateFlashcardSetPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State for the flashcard set
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet>({
    title: '',
    description: '',
    category: '',
    isPublic: false,
    cards: [createEmptyCard()],
    tags: [],
  });
  
  // Form validation state
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
    cards?: { id: string; front?: string; back?: string }[];
  }>({});
  
  // State for tag input
  const [tagInput, setTagInput] = useState('');
  
  // UI state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmDiscardOpen, setIsConfirmDiscardOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle change for text inputs in flashcard set details
  const handleSetDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFlashcardSet((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for the field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  
  // Handle change for checkbox inputs
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFlashcardSet((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  // Handle change for card fields
  const handleCardChange = (cardId: string, field: keyof Flashcard, value: string) => {
    setFlashcardSet((prev) => ({
      ...prev,
      cards: prev.cards.map((card) =>
        card.id === cardId ? { ...card, [field]: value } : card
      ),
    }));
    
    // Clear error for the card field
    if (errors.cards) {
      setErrors((prev) => ({
        ...prev,
        cards: prev.cards?.map((cardError) =>
          cardError.id === cardId ? { ...cardError, [field]: undefined } : cardError
        ),
      }));
    }
  };
  
  // Add a new card
  const addCard = () => {
    setFlashcardSet((prev) => ({
      ...prev,
      cards: [...prev.cards, createEmptyCard()],
    }));
    
    // Focus the new card after render
    setTimeout(() => {
      setCurrentCardIndex(flashcardSet.cards.length);
      document.getElementById(`card-front-${flashcardSet.cards.length}`)?.focus();
    }, 0);
  };
  
  // Remove a card
  const removeCard = (cardId: string) => {
    // Prevent removing the last card
    if (flashcardSet.cards.length <= 1) {
      return;
    }
    
    const cardIndex = flashcardSet.cards.findIndex((card) => card.id === cardId);
    
    setFlashcardSet((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== cardId),
    }));
    
    // Update current card index
    if (cardIndex <= currentCardIndex && currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };
  
  // Add a tag
  const addTag = () => {
    if (!tagInput.trim() || flashcardSet.tags.includes(tagInput.trim())) {
      return;
    }
    
    setFlashcardSet((prev) => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()],
    }));
    
    setTagInput('');
  };
  
  // Remove a tag
  const removeTag = (tag: string) => {
    setFlashcardSet((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };
  
  // Handle tag input key press
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };
  
  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    // Validate title
    if (!flashcardSet.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (flashcardSet.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }
    
    // Validate description
    if (flashcardSet.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }
    
    // Validate category
    if (!flashcardSet.category) {
      newErrors.category = 'Category is required';
    }
    
    // Validate cards
    const cardErrors = flashcardSet.cards.map((card) => {
      const cardError: { id: string; front?: string; back?: string } = { id: card.id };
      
      if (!card.front.trim()) {
        cardError.front = 'Front is required';
      }
      
      if (!card.back.trim()) {
        cardError.back = 'Back is required';
      }
      
      return cardError;
    });
    
    if (cardErrors.some((card) => card.front || card.back)) {
      newErrors.cards = cardErrors;
    }
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };
  
  // Save the flashcard set
  const saveFlashcardSet = async () => {
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorElement = document.querySelector('.text-red-600')?.closest('.space-y-2');
      firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock success response
      const savedSet = {
        ...flashcardSet,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Navigate to the flashcard set view page
      navigate(`/app/flashcards/${savedSet.id}`);
    } catch (error) {
      console.error('Error saving flashcard set:', error);
      // Handle error appropriately
    } finally {
      setIsSaving(false);
    }
  };
  
  // Discard changes and navigate back
  const discardChanges = () => {
    setIsConfirmDiscardOpen(false);
    navigate(-1);
  };
  
  // Handle preview toggle
  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };
  
  // Filter cards by search term
  const filteredCards = useCallback(() => {
    if (!searchTerm) return flashcardSet.cards;
    
    return flashcardSet.cards.filter(
      (card) =>
        card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.notes && card.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [flashcardSet.cards, searchTerm]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveFlashcardSet();
      }
      
      // Ctrl/Cmd + N to add new card
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        addCard();
      }
      
      // Ctrl/Cmd + P to toggle preview
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        togglePreview();
      }
      
      // Escape to close preview
      if (e.key === 'Escape' && isPreviewOpen) {
        setIsPreviewOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPreviewOpen, saveFlashcardSet]);
  
  // Render card editor
  const renderCardEditor = (card: Flashcard, index: number) => {
    const cardErrors = errors.cards?.find((c) => c.id === card.id);
    
    return (
      <Card
        key={card.id}
        className={`mt-4 ${currentCardIndex === index ? 'border-primary-500 ring-1 ring-primary-500' : ''}`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md">Card {index + 1}</CardTitle>
          <div className="flex space-x-2">
            {flashcardSet.cards.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCard(card.id)}
                aria-label={`Remove card ${index + 1}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Textarea
                id={`card-front-${index}`}
                label="Front (Question)"
                value={card.front}
                onChange={(e) => handleCardChange(card.id, 'front', e.target.value)}
                rows={3}
                placeholder="Enter the question or term"
                error={cardErrors?.front}
                required
                onFocus={() => setCurrentCardIndex(index)}
              />
            </div>
            
            <div>
              <Textarea
                id={`card-back-${index}`}
                label="Back (Answer)"
                value={card.back}
                onChange={(e) => handleCardChange(card.id, 'back', e.target.value)}
                rows={3}
                placeholder="Enter the answer or definition"
                error={cardErrors?.back}
                required
                onFocus={() => setCurrentCardIndex(index)}
              />
            </div>
          </div>
          
          <Textarea
            id={`card-notes-${index}`}
            label="Notes (Optional)"
            value={card.notes || ''}
            onChange={(e) => handleCardChange(card.id, 'notes', e.target.value)}
            rows={2}
            placeholder="Add any additional notes or context"
            onFocus={() => setCurrentCardIndex(index)}
          />
        </CardContent>
      </Card>
    );
  };
  
  // Render preview card
  const renderPreviewCard = (card: Flashcard, index: number) => (
    <div key={card.id} className="perspective-1000">
      <div className="relative h-64 w-full transform-style-3d transition-transform duration-500 hover:rotate-y-180">
        <div className="absolute inset-0 backface-hidden rounded-lg border border-neutral-200 bg-white p-6 shadow">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="mb-2 text-sm font-medium text-neutral-500">Question</h3>
              <p className="text-lg">{card.front}</p>
            </div>
            <div className="text-right text-sm text-neutral-400">
              Card {index + 1} of {flashcardSet.cards.length}
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg border border-neutral-200 bg-white p-6 shadow">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="mb-2 text-sm font-medium text-neutral-500">Answer</h3>
              <p className="text-lg">{card.back}</p>
              
              {card.notes && (
                <div className="mt-4 rounded-md bg-neutral-50 p-3">
                  <h4 className="text-xs font-medium text-neutral-500">Notes</h4>
                  <p className="text-sm text-neutral-700">{card.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="container mx-auto max-w-4xl px-4 pb-16 pt-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Create New Flashcard Set</h1>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsConfirmDiscardOpen(true)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          
          <Button
            onClick={saveFlashcardSet}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Set'}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Set Details</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={flashcardSet.title}
            onChange={handleSetDetailsChange}
            placeholder="e.g., Spanish Vocabulary, Biology Terms"
            error={errors.title}
            required
          />
          
          <Textarea
            label="Description"
            name="description"
            value={flashcardSet.description}
            onChange={handleSetDetailsChange}
            placeholder="Provide a brief description of this flashcard set"
            error={errors.description}
            rows={3}
          />
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Category"
              name="category"
              value={flashcardSet.category}
              onChange={handleSetDetailsChange}
              options={CATEGORIES}
              placeholder="Select a category"
              error={errors.category}
              required
            />
            
            <Select
              label="Difficulty"
              name="difficulty"
              value={flashcardSet.difficulty}
              onChange={handleSetDetailsChange}
              options={DIFFICULTY_LEVELS}
              placeholder="Select difficulty level"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Tags
            </label>
            
            <div className="flex flex-wrap items-center gap-2">
              {flashcardSet.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 text-primary-600 hover:text-primary-800"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <div className="flex">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyPress}
                  placeholder="Add a tag"
                  className="max-w-[200px]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                  className="ml-2"
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Press Enter or comma to add a tag
            </p>
          </div>
          
          <Checkbox
            name="isPublic"
            label="Make this set public"
            checked={flashcardSet.isPublic}
            onChange={handleCheckboxChange}
            helpText="Public sets can be discovered and used by other users"
          />
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Cards</h2>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={togglePreview}
              disabled={flashcardSet.cards.length === 0}
            >
              {isPreviewOpen ? 'Edit Cards' : 'Preview Cards'}
            </Button>
            
            {!isPreviewOpen && (
              <Button
                onClick={addCard}
                variant="outline"
              >
                Add Card
              </Button>
            )}
          </div>
        </div>
        
        {flashcardSet.cards.length > 3 && !isPreviewOpen && (
          <div className="mb-4">
            <Input
              placeholder="Search cards"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              }
            />
          </div>
        )}
        
        {isPreviewOpen ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {flashcardSet.cards.map(renderPreviewCard)}
          </div>
        ) : (
          <div>
            {filteredCards().map(renderCardEditor)}
            
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={addCard}
                className="w-full max-w-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Another Card
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Confirm discard dialog */}
      <Dialog
        open={isConfirmDiscardOpen}
        onClose={() => setIsConfirmDiscardOpen(false)}
        role="alertdialog"
        ariaLabelledby="discard-dialog-title"
      >
        <DialogHeader>
          <DialogTitle id="discard-dialog-title">Discard changes?</DialogTitle>
        </DialogHeader>
        
        <DialogContent>
          <p>
            Are you sure you want to discard your changes? This action cannot be undone.
          </p>
        </DialogContent>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsConfirmDiscardOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={discardChanges}>
            Discard
          </Button>
        </DialogFooter>
      </Dialog>
      
      {/* Keyboard shortcuts help */}
      <div className="fixed bottom-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Show keyboard shortcuts modal
            alert('Keyboard Shortcuts:\n\nCtrl/Cmd + S: Save set\nCtrl/Cmd + N: Add new card\nCtrl/Cmd + P: Toggle preview');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Shortcuts
        </Button>
      </div>
    </div>
  );
};

export default CreateFlashcardSetPage; 