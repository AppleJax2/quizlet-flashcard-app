import { useState, useEffect, useCallback } from 'react';

export type FeatureId = 
  | 'advancedFilters'
  | 'studyModes'
  | 'srsCustomization'
  | 'aiGeneration'
  | 'exportOptions'
  | 'teamSharing'
  | 'testMode'
  | 'learnMode'
  | 'statistics'
  | 'spellCheck'
  | 'imageUpload';

export type ProgressMilestone = 
  | 'firstLogin'
  | 'studySessionCompleted'
  | 'createdSet'
  | 'createdMultipleSets'
  | 'multipleStudySessions'
  | 'accountDaysOld'
  | 'cardsReviewed'
  | 'correctAnswers'
  | 'subscription';

type MilestoneConfig = {
  required: ProgressMilestone[];
  count?: number;
};

/**
 * Hook for managing progressive disclosure of features based on user progress.
 * Implements the Progressive Disclosure design principle by revealing features
 * gradually as users reach certain milestones to prevent cognitive overload.
 * 
 * @param userId - The user's ID for tracking progress
 * @returns An object with methods to check feature availability and track progress
 */
export function useProgressiveFeatures(userId?: string) {
  const [unlockedFeatures, setUnlockedFeatures] = useState<FeatureId[]>([]);
  const [userMilestones, setUserMilestones] = useState<{
    [key in ProgressMilestone]?: number;
  }>({});
  
  // Feature unlock configuration - which milestones unlock which features
  const featureConfig: Record<FeatureId, MilestoneConfig> = {
    // Basic features available immediately
    advancedFilters: { required: ['studySessionCompleted'] },
    studyModes: { required: ['createdSet'] },
    
    // Intermediate features that unlock after some experience
    srsCustomization: { required: ['multipleStudySessions'], count: 5 },
    exportOptions: { required: ['createdMultipleSets'], count: 3 },
    statistics: { required: ['studySessionCompleted'], count: 3 },
    
    // Advanced features that unlock after significant usage
    aiGeneration: { required: ['subscription', 'multipleStudySessions'], count: 10 },
    teamSharing: { required: ['subscription', 'createdMultipleSets'], count: 5 },
    testMode: { required: ['cardsReviewed'], count: 50 },
    learnMode: { required: ['correctAnswers'], count: 25 },
    
    // Special features with specific requirements
    spellCheck: { required: ['accountDaysOld'], count: 7 },
    imageUpload: { required: ['subscription'] },
  };
  
  // Initialize from localStorage on first load
  useEffect(() => {
    if (!userId) return;
    
    // Load unlocked features from localStorage
    const savedFeatures = localStorage.getItem(`unlocked_features_${userId}`);
    if (savedFeatures) {
      try {
        const parsedFeatures = JSON.parse(savedFeatures) as FeatureId[];
        setUnlockedFeatures(parsedFeatures);
      } catch (e) {
        console.error('Error parsing unlocked features from localStorage', e);
      }
    }
    
    // Load user milestones from localStorage
    const savedMilestones = localStorage.getItem(`user_milestones_${userId}`);
    if (savedMilestones) {
      try {
        const parsedMilestones = JSON.parse(savedMilestones) as {
          [key in ProgressMilestone]?: number;
        };
        setUserMilestones(parsedMilestones);
      } catch (e) {
        console.error('Error parsing user milestones from localStorage', e);
      }
    }
  }, [userId]);
  
  // Save to localStorage when state changes
  useEffect(() => {
    if (!userId) return;
    
    localStorage.setItem(`unlocked_features_${userId}`, JSON.stringify(unlockedFeatures));
    localStorage.setItem(`user_milestones_${userId}`, JSON.stringify(userMilestones));
  }, [userId, unlockedFeatures, userMilestones]);
  
  // Check if a feature is available based on the user's progress
  const isFeatureAvailable = useCallback((featureId: FeatureId): boolean => {
    // If the feature is already unlocked, return true
    if (unlockedFeatures.includes(featureId)) {
      return true;
    }
    
    // Get the milestone requirements for this feature
    const config = featureConfig[featureId];
    if (!config) return false;
    
    // Check each required milestone
    const allMilestonesReached = config.required.every(milestone => {
      const userValue = userMilestones[milestone] || 0;
      const requiredValue = config.count || 1;
      return userValue >= requiredValue;
    });
    
    // If all requirements are met, unlock the feature
    if (allMilestonesReached) {
      setUnlockedFeatures(prev => [...prev, featureId]);
      return true;
    }
    
    return false;
  }, [unlockedFeatures, userMilestones, featureConfig]);
  
  // Track progress for a milestone
  const trackMilestone = useCallback((milestone: ProgressMilestone, value: number = 1) => {
    setUserMilestones(prev => {
      const currentValue = prev[milestone] || 0;
      return {
        ...prev,
        [milestone]: currentValue + value
      };
    });
    
    // Check if any features should be unlocked with this update
    Object.keys(featureConfig).forEach(featureId => {
      isFeatureAvailable(featureId as FeatureId);
    });
  }, [isFeatureAvailable, featureConfig]);
  
  // Get the next features that will unlock and their requirements
  const getNextFeatures = useCallback((): Array<{
    featureId: FeatureId;
    requiredMilestones: Array<{
      milestone: ProgressMilestone;
      current: number;
      required: number;
    }>;
  }> => {
    return Object.entries(featureConfig)
      .filter(([featureId]) => !unlockedFeatures.includes(featureId as FeatureId))
      .map(([featureId, config]) => {
        const requiredMilestones = config.required.map(milestone => ({
          milestone,
          current: userMilestones[milestone] || 0,
          required: config.count || 1
        }));
        
        return {
          featureId: featureId as FeatureId,
          requiredMilestones
        };
      })
      .filter(feature => {
        // Only include features that are close to being unlocked
        // (user has achieved at least one milestone)
        return feature.requiredMilestones.some(
          m => m.current > 0 && m.current < m.required
        );
      })
      .sort((a, b) => {
        // Sort by the closest to being unlocked
        const aProgress = a.requiredMilestones.reduce(
          (sum, m) => sum + (m.current / m.required), 0
        ) / a.requiredMilestones.length;
        
        const bProgress = b.requiredMilestones.reduce(
          (sum, m) => sum + (m.current / m.required), 0
        ) / b.requiredMilestones.length;
        
        return bProgress - aProgress;
      });
  }, [unlockedFeatures, userMilestones, featureConfig]);
  
  // Reset progress (for testing or user account reset)
  const resetProgress = useCallback(() => {
    if (!userId) return;
    
    setUnlockedFeatures([]);
    setUserMilestones({});
    localStorage.removeItem(`unlocked_features_${userId}`);
    localStorage.removeItem(`user_milestones_${userId}`);
  }, [userId]);
  
  return {
    isFeatureAvailable,
    trackMilestone,
    getNextFeatures,
    resetProgress,
    unlockedFeatures,
    userMilestones
  };
}

export default useProgressiveFeatures; 