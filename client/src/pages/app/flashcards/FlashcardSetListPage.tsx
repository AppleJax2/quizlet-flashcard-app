import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { flashcardService } from '@/services';
import { FlashcardSetSummary } from '@/types/flashcard';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function FlashcardSetListPage() {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSetSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'cardCount'>('recent');

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedSets = await flashcardService.getAllSets();
        setFlashcardSets(fetchedSets);
      } catch (err) {
        setError('Failed to load flashcard sets');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcardSets();
  }, []);

  const filteredSets = flashcardSets.filter(set => 
    set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSets = [...filteredSets].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'cardCount') {
      return b.cardCount - a.cardCount;
    } else {
      // Default: sort by recent (lastModified)
      const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      return dateB - dateA;
    }
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-neutral-900">My Flashcard Sets</h1>
        <Link to="/flashcards/new">
          <Button className="whitespace-nowrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create New Set
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-neutral-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search flashcard sets..."
              className="block w-full rounded-md border-neutral-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'recent' | 'title' | 'cardCount')}
            className="block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          >
            <option value="recent">Recently Modified</option>
            <option value="title">Title (A-Z)</option>
            <option value="cardCount">Card Count</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {sortedSets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedSets.map((set) => (
            <FlashcardSetCard key={set.id} set={set} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center">
          {searchQuery ? (
            <>
              <h3 className="mb-2 text-lg font-medium text-neutral-900">No matching flashcard sets</h3>
              <p className="text-neutral-600">
                Try adjusting your search query or create a new set.
              </p>
            </>
          ) : (
            <>
              <h3 className="mb-2 text-lg font-medium text-neutral-900">No flashcard sets yet</h3>
              <p className="mb-6 text-neutral-600">
                Create your first flashcard set to start learning more effectively.
              </p>
              <Link to="/flashcards/new">
                <Button>Create Flashcard Set</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface FlashcardSetCardProps {
  set: FlashcardSetSummary;
}

function FlashcardSetCard({ set }: FlashcardSetCardProps) {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardContent className="flex h-full flex-col p-0">
        <div className="flex-grow p-6">
          <h3 className="mb-1 font-bold text-neutral-900">{set.title}</h3>
          <p className="mb-4 text-sm text-neutral-600">
            {set.description.length > 100
              ? `${set.description.substring(0, 100)}...`
              : set.description}
          </p>
          <div className="flex items-center text-sm text-neutral-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            {set.cardCount} cards
          </div>
        </div>
        <div className="flex border-t border-neutral-200">
          <Link
            to={`/flashcards/${set.id}`}
            className="flex-1 px-4 py-3 text-center text-sm font-medium text-neutral-600 hover:bg-neutral-50"
          >
            View
          </Link>
          <div className="border-l border-neutral-200"></div>
          <Link
            to={`/flashcards/${set.id}/study`}
            className="flex-1 px-4 py-3 text-center text-sm font-medium text-primary-600 hover:bg-primary-50"
          >
            Study
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
} 