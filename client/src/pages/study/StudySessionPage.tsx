import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlashcards, useFlashcardSet, useStudySession } from '@/hooks/useFlashcardData';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/context/auth/AuthContext';
import { useAppContext } from '@/context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { StudySession, StudyCard, FlashcardSet, CardResult, Flashcard } from '@/types/flashcard.types';
import { formatDuration, formatPercentage, pluralize } from '@/utils/helpers';
import flashcardService from '@/api/flashcardService';
import appStorage from '@/utils/storage';

interface StudyStats {
  correct: number;
  incorrect: number;
  skipped: number;
  hard: number;
  total: number;
  currentIndex: number;
  timeSpent: number;
}

const StudySessionPage: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification, setIsLoading } = useAppContext();
  const { success, error } = useNotifications();
  
  // State
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyCards, setStudyCards] = useState<StudyCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stats, setStats] = useState<StudyStats>({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    hard: 0,
    total: 0,
    currentIndex: 0,
    timeSpent: 0,
  });
  const [showSummary, setShowSummary] = useState(false);
  const [cardStartTime, setCardStartTime] = useState<number>(0);
  
  // Refs for timers
  const timerRef = useRef<number>(0);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get flashcard set data
  const { data: flashcardSet, isLoading: isLoadingSet } = useFlashcardSet(
    setId,
    true,
    { 
      onError: (err) => error(err.message) 
    }
  );
  
  // Start or resume session when the page loads
  useEffect(() => {
    if (flashcardSet && user) {
      // Check if there's a saved in-progress session for this set
      const savedSession = appStorage.get<{
        sessionId: string;
        cards: StudyCard[];
        stats: StudyStats;
      }>(`study_session_${user.id}_${setId}`, { encrypt: true });
      
      if (savedSession) {
        // Resume existing session
        setSessionId(savedSession.sessionId);
        setStudyCards(savedSession.cards);
        setStats(savedSession.stats);
        setCurrentCardIndex(savedSession.stats.currentIndex);
        timerRef.current = savedSession.stats.timeSpent;
        setIsStarted(true);
      } else {
        // Start new session if no saved session
        startNewSession();
      }
    }
    
    // Cleanup timer on unmount
    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [flashcardSet, user, setId]);
  
  // Start a new study session
  const startNewSession = async () => {
    if (!flashcardSet || !setId) return;
    
    setIsLoading(true);
    
    try {
      // Create a new study session
      const response = await flashcardService.startStudySession(setId, {
        strategy: 'sequential',
        showFrontFirst: true,
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const session = response.data;
      
      // Initialize state with new session data
      setSessionId(session.id);
      setStudyCards(session.cards);
      setStats({
        correct: 0,
        incorrect: 0,
        skipped: 0,
        hard: 0,
        total: session.cards.length,
        currentIndex: 0,
        timeSpent: 0,
      });
      setIsStarted(true);
      
      // Start the timer
      startTimer();
      
      // Start card timer
      setCardStartTime(Date.now());
      
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to start study session');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save session progress for resuming later
  const saveSessionProgress = useCallback(() => {
    if (user && sessionId && studyCards.length > 0 && setId) {
      appStorage.set(
        `study_session_${user.id}_${setId}`,
        {
          sessionId,
          cards: studyCards,
          stats: {
            ...stats,
            timeSpent: timerRef.current,
          },
        },
        { 
          encrypt: true,
          // Expire after 3 days
          expires: 3 * 24 * 60 * 60 * 1000,
        }
      );
    }
  }, [user, sessionId, studyCards, stats, setId]);
  
  // Start the session timer
  const startTimer = useCallback(() => {
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
    
    sessionTimerRef.current = setInterval(() => {
      timerRef.current += 1;
      // Save progress every 30 seconds
      if (timerRef.current % 30 === 0) {
        saveSessionProgress();
      }
    }, 1000);
  }, [saveSessionProgress]);
  
  // Get the current card
  const getCurrentCard = useCallback(() => {
    if (!flashcardSet?.cards || studyCards.length === 0) return null;
    
    const studyCard = studyCards[currentCardIndex];
    return flashcardSet.cards.find(c => c.id === studyCard.flashcardId);
  }, [flashcardSet, studyCards, currentCardIndex]);
  
  // Flip the current card
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Record the result for the current card
  const recordResult = async (result: CardResult) => {
    if (!sessionId || currentCardIndex >= studyCards.length) return;
    
    // Calculate time spent on this card
    const timeSpent = Date.now() - cardStartTime;
    
    // Update the study card with the result
    const updatedCards = [...studyCards];
    updatedCards[currentCardIndex] = {
      ...updatedCards[currentCardIndex],
      result,
      timeSpent,
    };
    
    setStudyCards(updatedCards);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      [result]: prev[result] + 1,
      currentIndex: currentCardIndex + 1,
    }));
    
    try {
      // Send the result to the server
      await flashcardService.updateStudySession(sessionId, {
        cardResults: [
          {
            flashcardId: studyCards[currentCardIndex].flashcardId,
            result,
            timeSpent,
          },
        ],
        completed: false,
      });
      
      // Move to next card or complete the session
      if (currentCardIndex < studyCards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setIsFlipped(false);
        setCardStartTime(Date.now());
        saveSessionProgress();
      } else {
        completeSession();
      }
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to record result');
    }
  };
  
  // Complete the study session
  const completeSession = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    
    try {
      // Complete the session on the server
      const response = await flashcardService.completeStudySession(sessionId);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Stop the timer
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
      
      setIsCompleted(true);
      setShowSummary(true);
      
      // Clear the saved session
      if (user && setId) {
        appStorage.remove(`study_session_${user.id}_${setId}`, { encrypt: true });
      }
      
      success('Study session completed successfully!');
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to complete study session');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Restart the study session
  const restartSession = () => {
    setShowSummary(false);
    setIsCompleted(false);
    setIsStarted(false);
    setIsFlipped(false);
    setSessionId(null);
    setCurrentCardIndex(0);
    setStats({
      correct: 0,
      incorrect: 0,
      skipped: 0,
      hard: 0,
      total: 0,
      currentIndex: 0,
      timeSpent: 0,
    });
    
    // Clear timer
    timerRef.current = 0;
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
    
    // Start a new session
    startNewSession();
  };
  
  // Navigate back to the flashcard set
  const backToSet = () => {
    navigate(`/app/flashcards/set/${setId}`);
  };
  
  // Get the current card and progress
  const currentCard = getCurrentCard();
  const progress = stats.total > 0 ? (currentCardIndex / stats.total) * 100 : 0;
  
  // Calculate the accuracy
  const accuracy = stats.correct + stats.incorrect > 0
    ? (stats.correct / (stats.correct + stats.incorrect)) * 100
    : 0;
  
  // If the set is still loading, show loading state
  if (isLoadingSet) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If the set was not found, show error
  if (!flashcardSet) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4">Flashcard Set Not Found</h2>
          <p className="text-red-600 dark:text-red-300 mb-6">
            The flashcard set you're looking for doesn't exist or you don't have permission to access it.
          </p>
          <Button onClick={() => navigate('/app/flashcards')}>
            Back to Flashcards
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Study session header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{flashcardSet.title}</h1>
        <p className="text-muted-foreground mb-4">{flashcardSet.description}</p>
        
        {isStarted && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {currentCardIndex + 1} of {stats.total} {pluralize(stats.total, 'card', 'cards')}
              </span>
              <span className="text-sm font-medium">
                Time: {formatDuration(timerRef.current)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>
      
      {/* Study card */}
      {isStarted && !isCompleted && currentCard && (
        <div className="mb-8">
          <Card className={`p-0 overflow-hidden transition-all duration-500 h-80 ${isFlipped ? 'bg-blue-50 dark:bg-blue-950/30' : 'bg-white dark:bg-gray-800'}`}>
            <div 
              className={`h-full w-full relative cursor-pointer transition-all duration-500 transform ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={flipCard}
            >
              {/* Front of card */}
              <div className={`absolute inset-0 backface-hidden p-6 flex flex-col justify-center items-center ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                <div className="absolute top-2 right-2 text-xs text-muted-foreground">
                  Front
                </div>
                {currentCard.imageUrl && (
                  <div className="mb-4 max-h-40 overflow-hidden rounded">
                    <img 
                      src={currentCard.imageUrl} 
                      alt="Card visual" 
                      className="max-w-full max-h-40 object-contain"
                    />
                  </div>
                )}
                <div className="text-xl font-medium text-center">
                  {currentCard.front}
                </div>
              </div>
              
              {/* Back of card */}
              <div className={`absolute inset-0 backface-hidden p-6 rotate-y-180 flex flex-col justify-center items-center ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-2 right-2 text-xs text-muted-foreground">
                  Back
                </div>
                <div className="text-xl text-center">
                  {currentCard.back}
                </div>
                {currentCard.notes && (
                  <div className="mt-4 text-sm text-muted-foreground border-t border-border pt-4">
                    <p className="font-medium mb-1">Notes:</p>
                    <p>{currentCard.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          {/* Card controls */}
          <div className="grid grid-cols-2 gap-4 mt-6 sm:grid-cols-4">
            <Button 
              variant="outline" 
              onClick={() => recordResult('skipped')}
              className="border-yellow-300 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
            >
              Skip
            </Button>
            <Button 
              variant="outline" 
              onClick={() => recordResult('hard')}
              className="border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30"
            >
              Hard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => recordResult('incorrect')}
              className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              Incorrect
            </Button>
            <Button 
              variant="outline" 
              onClick={() => recordResult('correct')}
              className="border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
            >
              Correct
            </Button>
          </div>
        </div>
      )}
      
      {/* Start study session button */}
      {!isStarted && (
        <div className="text-center py-12">
          <div className="bg-primary/5 rounded-lg border border-primary/20 p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Ready to Study?</h2>
            <p className="mb-8 text-muted-foreground">
              You'll go through {flashcardSet.cardCount} {pluralize(flashcardSet.cardCount, 'card', 'cards')} in this set.
              Click each card to flip it and mark your progress.
            </p>
            <Button size="lg" onClick={startNewSession}>
              Start Study Session
            </Button>
          </div>
        </div>
      )}
      
      {/* Session summary dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Study Session Summary</DialogTitle>
            <DialogDescription>
              Here's how you did in this study session.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-100 dark:border-green-800 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.correct}
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">Correct</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded border border-red-100 dark:border-red-800 text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {stats.incorrect}
                </div>
                <div className="text-sm text-red-800 dark:text-red-300">Incorrect</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded border border-orange-100 dark:border-orange-800 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.hard}
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">Hard</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded border border-yellow-100 dark:border-yellow-800 text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.skipped}
                </div>
                <div className="text-sm text-yellow-800 dark:text-yellow-300">Skipped</div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Accuracy</span>
                <span className="text-sm font-medium">{formatPercentage(accuracy)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mb-6">
              <div className="flex justify-between mb-1">
                <span>Total time:</span>
                <span className="font-medium">{formatDuration(timerRef.current)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cards studied:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={backToSet}>
              Back to Set
            </Button>
            <Button onClick={restartSession}>
              Study Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudySessionPage; 