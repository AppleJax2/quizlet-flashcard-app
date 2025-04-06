import React, { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { flashcardService } from '@/services';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FlashcardSetSummary } from '@/types/flashcard';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentSets, setRecentSets] = useState<FlashcardSetSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentSets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedSets = await flashcardService.getRecentSets();
        setRecentSets(fetchedSets);
      } catch (err) {
        setError('Failed to load recent flashcard sets');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentSets();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">
          Welcome back, {user?.username}!
        </h1>
        <p className="mt-2 text-neutral-600">
          Here's an overview of your learning progress and recent activity.
        </p>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Flashcard Sets"
          value="12"
          description="Total sets created"
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M12 18v4" />
              <path d="M9 18v2" />
              <path d="M15 18v2" />
              <path d="M12 6V2" />
              <path d="M9 6V4" />
              <path d="M15 6V4" />
            </svg>
          )}
        />
        <StatsCard
          title="Cards Studied"
          value="254"
          description="Last 30 days"
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20l9-9" />
              <path d="M16.5 15.5L22 10" />
              <path d="M8 9l9 9" />
              <path d="M2 14l6-6" />
            </svg>
          )}
        />
        <StatsCard
          title="Mastery Level"
          value="86%"
          description="Overall progress"
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20" />
              <path d="M2 5h20" />
              <path d="M5 12h14" />
              <path d="M5 19h14" />
              <path d="M2 12h3" />
              <path d="M19 12h3" />
            </svg>
          )}
        />
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">Recent Flashcard Sets</h2>
        <Link to="/flashcards">
          <Button variant="outline">View All Sets</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="mb-3 h-6 w-3/4 bg-neutral-200 rounded"></div>
                <div className="mb-4 h-4 w-1/2 bg-neutral-200 rounded"></div>
                <div className="h-8 w-full bg-neutral-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : recentSets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentSets.map((set) => (
            <Link to={`/flashcards/${set.id}`} key={set.id}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="flex h-full flex-col justify-between p-6">
                  <div>
                    <h3 className="mb-1 font-bold text-neutral-900">{set.title}</h3>
                    <p className="text-sm text-neutral-600">
                      {set.description.length > 100
                        ? `${set.description.substring(0, 100)}...`
                        : set.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-neutral-500">{set.cardCount} cards</span>
                    <span className="text-neutral-500">
                      Last studied: {formatDate(set.lastStudied)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center">
          <h3 className="mb-2 text-lg font-medium text-neutral-900">No flashcard sets yet</h3>
          <p className="mb-6 text-neutral-600">
            Create your first flashcard set to start learning more effectively.
          </p>
          <Link to="/flashcards/new">
            <Button>Create Flashcard Set</Button>
          </Link>
        </div>
      )}

      <div className="mt-12 mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">Quick Actions</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ActionCard
          title="Create New Set"
          description="Create a new flashcard set from scratch"
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          )}
          to="/flashcards/new"
        />
        <ActionCard
          title="Process Text"
          description="Generate flashcards from text"
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 7 4 4 20 4 20 7"></polyline>
              <line x1="9" y1="20" x2="15" y2="20"></line>
              <line x1="12" y1="4" x2="12" y2="20"></line>
            </svg>
          )}
          to="/processor/text"
        />
        <ActionCard
          title="Extract from URL"
          description="Create cards from webpage content"
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          )}
          to="/processor/url"
        />
        <ActionCard
          title="Process Document"
          description="Extract cards from documents"
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          )}
          to="/processor/document"
        />
      </div>
    </div>
  );
}

type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
};

const StatsCard = memo(function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            <p className="text-sm text-neutral-500">{description}</p>
            <p className="mt-2 text-3xl font-bold text-primary-600">{value}</p>
          </div>
          <div className="rounded-full bg-primary-100 p-3 text-primary-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

type ActionCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
};

const ActionCard = memo(function ActionCard({ title, description, icon, to }: ActionCardProps) {
  return (
    <Link to={to}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="flex h-full items-center p-6">
          <div className="mr-4 rounded-full bg-neutral-100 p-3 text-neutral-600">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-neutral-900">{title}</h3>
            <p className="text-sm text-neutral-500">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
} 