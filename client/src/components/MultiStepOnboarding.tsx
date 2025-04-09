import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

// Step interface for defining each onboarding step
export interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  isOptional?: boolean;
}

// Component props for the MultiStepOnboarding component
export interface MultiStepOnboardingProps {
  /**
   * Array of onboarding steps to display
   */
  steps: OnboardingStep[];
  
  /**
   * Initial step index to show (defaults to 0)
   */
  initialStep?: number;
  
  /**
   * Callback when the onboarding process is completed
   */
  onComplete?: () => void;
  
  /**
   * Callback when the onboarding process is skipped
   */
  onSkip?: () => void;
  
  /**
   * Whether to show progress indicators
   */
  showProgress?: boolean;
  
  /**
   * Whether to show step titles in progress indicators
   */
  showStepTitles?: boolean;
  
  /**
   * Whether to allow keyboard navigation
   */
  enableKeyboardNavigation?: boolean;
  
  /**
   * Whether to loop back to the first step when reaching the end
   */
  loop?: boolean;
  
  /**
   * Whether to show a skip button for the entire onboarding
   */
  allowSkip?: boolean;
  
  /**
   * Custom class for the container element
   */
  className?: string;
  
  /**
   * Custom class for the card component
   */
  cardClassName?: string;
  
  /**
   * Custom class for the progress indicators
   */
  progressClassName?: string;
  
  /**
   * Animation direction for transitions
   */
  animationDirection?: 'horizontal' | 'vertical' | 'fade';
  
  /**
   * Whether the onboarding is being shown in a dialog
   */
  isDialog?: boolean;
}

/**
 * Multi-step onboarding component that implements Progressive Disclosure.
 * Breaks down complex onboarding into manageable steps with progress tracking.
 */
const MultiStepOnboarding: React.FC<MultiStepOnboardingProps> = ({
  steps,
  initialStep = 0,
  onComplete,
  onSkip,
  showProgress = true,
  showStepTitles = false,
  enableKeyboardNavigation = true,
  loop = false,
  allowSkip = false,
  className,
  cardClassName,
  progressClassName,
  animationDirection = 'horizontal',
  isDialog = false,
}) => {
  // State for tracking current step and animation
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  
  // References for keyboard navigation
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get current step from index
  const currentStep = steps[currentStepIndex];
  
  // Handle navigation to next step
  const goToNextStep = () => {
    if (isAnimating) return;
    
    // Add current step to completed steps
    setCompletedSteps(prev => {
      const updated = new Set(prev);
      updated.add(currentStep.id);
      return updated;
    });
    
    setDirection('forward');
    setIsAnimating(true);
    
    // If we're on the last step, either complete or loop
    if (currentStepIndex === steps.length - 1) {
      if (loop) {
        setTimeout(() => {
          setCurrentStepIndex(0);
          setIsAnimating(false);
        }, 300);
      } else if (onComplete) {
        onComplete();
      }
    } else {
      // Go to next step
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };
  
  // Handle navigation to previous step
  const goToPrevStep = () => {
    if (isAnimating || currentStepIndex === 0) return;
    
    setDirection('backward');
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentStepIndex(prev => prev - 1);
      setIsAnimating(false);
    }, 300);
  };
  
  // Handle skipping the onboarding
  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNavigation) return;
    
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Only handle keyboard navigation if the container is focused
      if (!containerRef.current?.contains(document.activeElement)) return;
      
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        goToNextStep();
      } else if (e.key === 'ArrowLeft') {
        goToPrevStep();
      } else if (e.key === 'Escape' && allowSkip) {
        handleSkip();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableKeyboardNavigation, currentStepIndex, goToNextStep, goToPrevStep, handleSkip, allowSkip]);
  
  // Animation classes based on direction and state
  const getAnimationClasses = () => {
    if (animationDirection === 'horizontal') {
      return {
        enter: direction === 'forward' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0',
        active: 'translate-x-0 opacity-100',
        exit: direction === 'forward' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0',
      };
    } else if (animationDirection === 'vertical') {
      return {
        enter: direction === 'forward' ? 'translate-y-full opacity-0' : '-translate-y-full opacity-0',
        active: 'translate-y-0 opacity-100',
        exit: direction === 'forward' ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0',
      };
    } else {
      // Fade animation
      return {
        enter: 'opacity-0',
        active: 'opacity-100',
        exit: 'opacity-0',
      };
    }
  };
  
  const animationClasses = getAnimationClasses();
  
  return (
    <div 
      ref={containerRef}
      className={cn('relative', className)}
      tabIndex={0} // Make container focusable for keyboard navigation
    >
      <Card className={cn('overflow-hidden', cardClassName)}>
        {/* Step content with animation */}
        <div className="relative">
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              isAnimating ? animationClasses.exit : animationClasses.active
            )}
          >
            <CardHeader>
              <CardTitle>{currentStep.title}</CardTitle>
              {currentStep.description && (
                <p className="text-sm text-neutral-500">{currentStep.description}</p>
              )}
            </CardHeader>
            
            <CardContent>
              {currentStep.content}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <div>
                {currentStepIndex > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={goToPrevStep}
                    disabled={isAnimating}
                  >
                    Back
                  </Button>
                )}
                
                {allowSkip && currentStepIndex < steps.length - 1 && (
                  <Button 
                    variant="link" 
                    onClick={handleSkip}
                    className="ml-2"
                  >
                    Skip All
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {currentStep.isOptional && (
                  <Button 
                    variant="ghost" 
                    onClick={goToNextStep}
                    disabled={isAnimating}
                  >
                    Skip
                  </Button>
                )}
                
                <Button 
                  onClick={goToNextStep} 
                  disabled={isAnimating}
                >
                  {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
      
      {/* Progress indicators */}
      {showProgress && (
        <div 
          className={cn(
            'mt-4 flex justify-center space-x-2',
            progressClassName
          )}
          aria-hidden="true" // Hide from screen readers as it's decorative
        >
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <button
                className={cn(
                  'h-2.5 w-2.5 rounded-full transition-all',
                  index < currentStepIndex || completedSteps.has(step.id)
                    ? 'bg-primary-600'
                    : index === currentStepIndex
                    ? 'bg-primary-400 ring-4 ring-primary-100'
                    : 'bg-neutral-200',
                  'relative'
                )}
                onClick={() => {
                  if (index < currentStepIndex || completedSteps.has(step.id)) {
                    setDirection(index < currentStepIndex ? 'backward' : 'forward');
                    setIsAnimating(true);
                    setTimeout(() => {
                      setCurrentStepIndex(index);
                      setIsAnimating(false);
                    }, 300);
                  }
                }}
                disabled={!(index < currentStepIndex || completedSteps.has(step.id))}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
              />
              
              {showStepTitles && (
                <span 
                  className={cn(
                    'mt-1 text-xs',
                    index === currentStepIndex ? 'text-primary-600 font-medium' : 'text-neutral-500'
                  )}
                >
                  {step.title}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiStepOnboarding; 