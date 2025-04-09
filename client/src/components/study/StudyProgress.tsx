import React, { useMemo } from 'react';
import { FlashcardSetProgress, StudySessionSummary, UUID } from '@/types/flashcard.types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { useCardsProgress, useSetProgress, useStudyHistory } from '@/hooks/useFlashcardData';
import { formatDate, formatDuration, formatPercentage, pluralize } from '@/utils/helpers';

interface StudyProgressProps {
  setId: UUID;
  className?: string;
}

/**
 * Comprehensive study progress component that visualizes learning progress
 * with charts, completion rates, and stats for a specific flashcard set
 */
const StudyProgress: React.FC<StudyProgressProps> = ({ setId, className = '' }) => {
  // Fetch progress data
  const { data: setProgress, isLoading: isLoadingProgress } = useSetProgress(setId);
  const { data: cardsProgress, isLoading: isLoadingCards } = useCardsProgress(setId);
  const { data: studyHistory, isLoading: isLoadingHistory } = useStudyHistory({ page: 1, limit: 5 });
  
  // Filter study history for this set
  const filteredHistory = useMemo(() => {
    if (!studyHistory?.items) return [];
    return studyHistory.items.filter(session => session.setId === setId);
  }, [studyHistory, setId]);
  
  // Calculate progress metrics
  const metrics = useMemo(() => {
    if (!setProgress) {
      return { 
        completionRate: 0, 
        mastered: 0, 
        learning: 0, 
        notStarted: 0,
        totalCards: 0,
        avgConfidence: 0,
      };
    }
    
    return {
      completionRate: setProgress.completionRate * 100,
      mastered: setProgress.mastered,
      learning: setProgress.learning,
      notStarted: setProgress.notStarted,
      totalCards: setProgress.totalCards,
      avgConfidence: setProgress.averageConfidence * 100,
    };
  }, [setProgress]);
  
  // Group cards by confidence level
  const confidenceLevels = useMemo(() => {
    if (!cardsProgress || cardsProgress.length === 0) {
      return { low: 0, medium: 0, high: 0 };
    }
    
    return cardsProgress.reduce((acc, card) => {
      if (card.confidence < 0.33) acc.low++;
      else if (card.confidence < 0.66) acc.medium++;
      else acc.high++;
      return acc;
    }, { low: 0, medium: 0, high: 0 });
  }, [cardsProgress]);
  
  // Calculate recent performance
  const recentPerformance = useMemo(() => {
    if (!filteredHistory || filteredHistory.length === 0) {
      return {
        averageAccuracy: 0,
        totalTimeSpent: 0,
        lastStudied: null,
        sessionsCount: 0,
      };
    }
    
    const totalCorrect = filteredHistory.reduce((sum, session) => sum + session.correctCount, 0);
    const totalCards = filteredHistory.reduce((sum, session) => sum + session.totalCards, 0);
    const totalTime = filteredHistory.reduce((sum, session) => sum + (session.timeSpent || 0), 0);
    
    return {
      averageAccuracy: totalCards > 0 ? (totalCorrect / totalCards) * 100 : 0,
      totalTimeSpent: totalTime,
      lastStudied: filteredHistory[0]?.completedAt || filteredHistory[0]?.startedAt,
      sessionsCount: filteredHistory.length,
    };
  }, [filteredHistory]);
  
  // If data is still loading, show loading skeleton
  if (isLoadingProgress || isLoadingCards || isLoadingHistory) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-2/3 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-muted h-4 w-1/2 rounded mt-2"></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="animate-pulse bg-muted h-4 w-1/4 rounded"></div>
            <div className="animate-pulse bg-muted h-2 w-full rounded"></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted h-24 rounded"></div>
            ))}
          </div>
          <div className="animate-pulse bg-muted h-48 w-full rounded"></div>
        </CardContent>
      </Card>
    );
  }
  
  // If no progress data exists yet
  if (!setProgress) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Study Progress</CardTitle>
          <CardDescription>
            You haven't studied this set yet. Start a study session to track your progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto mb-4 opacity-20"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
              />
            </svg>
            <p>No study data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Study Progress</CardTitle>
        <CardDescription>
          Your learning journey and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Completion Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Completion</span>
            <span className="text-sm font-medium">{formatPercentage(metrics.completionRate)}%</span>
          </div>
          <Progress value={metrics.completionRate} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {metrics.mastered} {pluralize(metrics.mastered, 'card', 'cards')} mastered
            </span>
            <span>
              {metrics.notStarted} remaining
            </span>
          </div>
        </div>
        
        {/* Mastery Breakdown */}
        <div>
          <h3 className="text-sm font-medium mb-3">Mastery Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {metrics.mastered}
              </div>
              <div className="text-xs text-green-800 dark:text-green-200">
                Mastered
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-100 dark:border-yellow-800">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {metrics.learning}
              </div>
              <div className="text-xs text-yellow-800 dark:text-yellow-200">
                Learning
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-100 dark:border-red-800">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {metrics.notStarted}
              </div>
              <div className="text-xs text-red-800 dark:text-red-200">
                Not Started
              </div>
            </div>
          </div>
        </div>
        
        {/* Confidence Distribution */}
        <div>
          <h3 className="text-sm font-medium mb-3">Confidence Distribution</h3>
          <div className="h-4 flex rounded-full overflow-hidden">
            <div 
              className="bg-red-500" 
              style={{ width: `${(confidenceLevels.low / metrics.totalCards) * 100}%` }}
              title={`Low confidence: ${confidenceLevels.low} cards`}
            ></div>
            <div 
              className="bg-yellow-500" 
              style={{ width: `${(confidenceLevels.medium / metrics.totalCards) * 100}%` }}
              title={`Medium confidence: ${confidenceLevels.medium} cards`}
            ></div>
            <div 
              className="bg-green-500" 
              style={{ width: `${(confidenceLevels.high / metrics.totalCards) * 100}%` }}
              title={`High confidence: ${confidenceLevels.high} cards`}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              <span>Low: {confidenceLevels.low}</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
              <span>Medium: {confidenceLevels.medium}</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              <span>High: {confidenceLevels.high}</span>
            </div>
          </div>
        </div>
        
        {/* Recent Performance Stats */}
        <div>
          <h3 className="text-sm font-medium mb-3">Recent Performance</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">
                {formatPercentage(recentPerformance.averageAccuracy)}%
              </span>
              <span className="text-xs text-muted-foreground">Average Accuracy</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">
                {recentPerformance.sessionsCount}
              </span>
              <span className="text-xs text-muted-foreground">Study Sessions</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">
                {formatDuration(recentPerformance.totalTimeSpent)}
              </span>
              <span className="text-xs text-muted-foreground">Total Study Time</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">
                {recentPerformance.lastStudied ? formatDate(recentPerformance.lastStudied, { day: 'numeric', month: 'short' }) : '-'}
              </span>
              <span className="text-xs text-muted-foreground">Last Studied</span>
            </div>
          </div>
        </div>
        
        {/* Recent Sessions */}
        {filteredHistory.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Recent Sessions</h3>
            <div className="space-y-3">
              {filteredHistory.slice(0, 3).map((session) => (
                <div 
                  key={session.id}
                  className="flex justify-between items-center p-3 rounded-lg border border-border bg-card"
                >
                  <div>
                    <div className="font-medium text-sm">
                      {formatDate(session.startedAt, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {session.mode === 'flashcards' ? 'Standard Review' : 
                       session.mode === 'test' ? 'Test Mode' : 'Learning Mode'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {session.correctCount}/{session.totalCards} correct
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatPercentage(session.completionRate * 100)}% completion
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyProgress; 