import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Dialog } from '@/components/ui';
import { FlashcardSet, FlashcardSetQueryParams, FlashcardSetSearchResults, FlashcardSetSummary } from '@/types';
import { flashcardService } from '@/services';
import { useToast } from '@/hooks/useToast';
import { FlashcardSetManager } from './FlashcardSetManager';
import { cn } from '@/lib/utils';

interface FlashcardListProps {
  initialSets?: FlashcardSet[];
  onSelectSet?: (set: FlashcardSet) => void;
}

export const FlashcardList: React.FC<FlashcardListProps> = ({
  initialSets,
  onSelectSet,
}) => {
  const [sets, setSets] = useState<FlashcardSetSummary[]>(initialSets || []);
  const [isLoading, setIsLoading] = useState(!initialSets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    if (!initialSets) {
      loadFlashcardSets();
    }
  }, [initialSets]);

  const loadFlashcardSets = async (params?: FlashcardSetQueryParams) => {
    try {
      setIsLoading(true);
      const response = await flashcardService.getFlashcardSets(params);
      if (response?.data?.results) {
        setSets(response.data.results);
      }
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to load flashcard sets',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    loadFlashcardSets({ search: query, tags: selectedTags });
  };

  const handleTagSelect = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    loadFlashcardSets({ search: searchQuery, tags: newTags });
  };

  const handleCreateSet = () => {
    setEditingSet(null);
    setShowCreateDialog(true);
  };

  const handleEditSet = async (set: FlashcardSetSummary) => {
    try {
      const response = await flashcardService.getFlashcardSet(set.id);
      if (response?.data) {
        setEditingSet(response.data);
        setShowCreateDialog(true);
      }
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to load flashcard set details',
        type: 'error',
      });
    }
  };

  const handleDeleteSet = async (set: FlashcardSetSummary) => {
    if (!window.confirm('Are you sure you want to delete this flashcard set?')) {
      return;
    }

    try {
      await flashcardService.deleteFlashcardSet(set.id);
      setSets(sets.filter(s => s.id !== set.id));
      showToast({
        title: 'Success',
        description: 'Flashcard set deleted successfully',
        type: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to delete flashcard set',
        type: 'error',
      });
    }
  };

  const handleSaveSet = async (savedSet: FlashcardSet) => {
    setShowCreateDialog(false);
    await loadFlashcardSets({ search: searchQuery, tags: selectedTags });
    showToast({
      title: 'Success',
      description: `Flashcard set ${editingSet ? 'updated' : 'created'} successfully`,
      type: 'success',
    });
  };

  const handleStudySet = async (set: FlashcardSetSummary) => {
    try {
      const response = await flashcardService.getFlashcardSet(set.id);
      if (response?.data) {
        onSelectSet?.(response.data);
      }
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to load flashcard set details',
        type: 'error',
      });
    }
  };

  // Get all unique tags from all sets
  const allTags = Array.from(new Set(sets.flatMap(set => set.tags)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Flashcard Sets</h2>
        <Button onClick={handleCreateSet}>Create New Set</Button>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Search flashcard sets..."
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={cn(
                'px-3 py-1 rounded-full text-sm',
                selectedTags.includes(tag)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : sets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No flashcard sets found</p>
          <Button className="mt-4" onClick={handleCreateSet}>
            Create your first set
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sets.map(set => (
            <Card key={set.id} className="p-4">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{set.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {set.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {set.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {set.flashcardCount} cards
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSet(set)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSet(set)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStudySet(set)}
                  >
                    Study
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title={editingSet ? 'Edit Flashcard Set' : 'Create New Flashcard Set'}
      >
        <FlashcardSetManager
          initialSet={editingSet || undefined}
          onSave={handleSaveSet}
          onCancel={() => setShowCreateDialog(false)}
        />
      </Dialog>
    </div>
  );
};