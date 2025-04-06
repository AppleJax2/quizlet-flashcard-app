import { CardProgress, StudySessionStats } from '@/types';

export enum PerformanceRatings {
  FORGOT = 0,
  HARD = 3,
  GOOD = 4,
  EASY = 5,
  SKIP = -1,
}

export class SRSService {
  private readonly MIN_INTERVAL = 1; // 1 day
  private readonly MAX_INTERVAL = 365; // 1 year
  private readonly MIN_EASE_FACTOR = 1.3;
  private readonly INITIAL_EASE_FACTOR = 2.5;

  initializeCardProgress(flashcardId: string, userId: string): CardProgress {
    return {
      id: crypto.randomUUID(),
      userId,
      flashcardId,
      interval: this.MIN_INTERVAL,
      easeFactor: this.INITIAL_EASE_FACTOR,
      nextReviewDate: new Date(),
      performanceHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  updateCardProgress(
    currentProgress: CardProgress,
    performance: PerformanceRatings
  ): Partial<CardProgress> {
    if (performance === PerformanceRatings.SKIP) {
      // For skipped cards, only update the next review date to tomorrow
      return {
        nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        performanceHistory: [...currentProgress.performanceHistory, performance],
        updatedAt: new Date(),
      };
    }

    let { interval, easeFactor } = currentProgress;

    // Update ease factor based on performance
    const easeDelta = 0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02);
    easeFactor = Math.max(
      this.MIN_EASE_FACTOR,
      currentProgress.easeFactor + easeDelta
    );

    // Calculate new interval
    if (performance === PerformanceRatings.FORGOT) {
      interval = this.MIN_INTERVAL;
    } else {
      if (interval === this.MIN_INTERVAL) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }

    // Cap interval at maximum value
    interval = Math.min(interval, this.MAX_INTERVAL);

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return {
      interval,
      easeFactor,
      nextReviewDate,
      performanceHistory: [...currentProgress.performanceHistory, performance],
      updatedAt: new Date(),
    };
  }

  calculateSessionStats(performanceHistory: number[]): StudySessionStats {
    const stats: StudySessionStats = {
      correct: 0,
      incorrect: 0,
      skipped: 0,
      averagePerformance: 0,
      totalTime: 0,
    };

    let validPerformances = 0;
    let totalPerformance = 0;

    performanceHistory.forEach(performance => {
      if (performance === PerformanceRatings.FORGOT) {
        stats.incorrect++;
      } else if (performance === PerformanceRatings.SKIP) {
        stats.skipped++;
      } else {
        stats.correct++;
      }

      if (performance >= 0) {
        totalPerformance += performance;
        validPerformances++;
      }
    });

    if (validPerformances > 0) {
      stats.averagePerformance = totalPerformance / validPerformances;
    }

    return stats;
  }
} 