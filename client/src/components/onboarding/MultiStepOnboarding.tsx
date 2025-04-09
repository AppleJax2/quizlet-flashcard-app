import React, { useState, createContext, useContext } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';

type StepStatus = 'upcoming' | 'current' | 'completed';

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  stepStatus: (stepIndex: number) => StepStatus;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within a MultiStepOnboarding component');
  }
  return context;
};

interface MultiStepOnboardingProps {
  /**
   * Children containing the step components
   */
  children: React.ReactNode;
  
  /**
   * Optional custom header component
   */
  header?: React.ReactNode;
  
  /**
   * Optional custom footer component
   */
  footer?: React.ReactNode;
  
  /**
   * Optional callback when all steps are completed
   */
  onComplete?: () => void;
  
  /**
   * CSS class name for custom styling
   */
  className?: string;
  
  /**
   * Initial step to show (0-based index)
   */
  initialStep?: number;
}

/**
 * MultiStepOnboarding component that implements Progressive Disclosure.
 * Breaks down complex processes into manageable steps, revealing information
 * progressively to prevent cognitive overload.
 */
export const MultiStepOnboarding: React.FC<MultiStepOnboardingProps> = ({
  children,
  header,
  footer,
  onComplete,
  className,
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const childrenArray = React.Children.toArray(children);
  const totalSteps = childrenArray.length;
  
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  
  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStep(step => step + 1);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  const goToPrevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(step => step - 1);
    }
  };
  
  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };
  
  const stepStatus = (stepIndex: number): StepStatus => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };
  
  const contextValue: OnboardingContextType = {
    currentStep,
    totalSteps,
    goToNextStep,
    goToPrevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    stepStatus,
  };
  
  return (
    <OnboardingContext.Provider value={contextValue}>
      <div className={cn('flex w-full flex-col rounded-xl bg-white shadow-sm', className)}>
        {/* Custom header or default progress indicator */}
        {header || (
          <div className="mb-6 px-6 pt-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-secondary-900">
                Step {currentStep + 1} of {totalSteps}
              </h2>
              <span className="text-sm text-secondary-600">
                {Math.round((currentStep / (totalSteps - 1)) * 100)}% Complete
              </span>
            </div>
            
            <div className="flex w-full space-x-1">
              {childrenArray.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1.5 flex-1 rounded-full transition-all duration-200',
                    stepStatus(index) === 'completed' && 'bg-primary-500',
                    stepStatus(index) === 'current' && 'bg-primary-300',
                    stepStatus(index) === 'upcoming' && 'bg-neutral-200'
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Step content */}
        <div className="px-6 py-4">
          {childrenArray[currentStep]}
        </div>
        
        {/* Custom footer or default navigation buttons */}
        {footer || (
          <div className="flex items-center justify-between space-x-4 border-t border-neutral-200 p-6">
            <Button
              variant="outline"
              onClick={goToPrevStep}
              disabled={isFirstStep}
            >
              Back
            </Button>
            
            <Button
              variant="primary"
              onClick={goToNextStep}
            >
              {isLastStep ? 'Complete' : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    </OnboardingContext.Provider>
  );
};

interface OnboardingStepProps {
  /**
   * Step title
   */
  title?: string;
  
  /**
   * Step description
   */
  description?: string;
  
  /**
   * Step content
   */
  children: React.ReactNode;
  
  /**
   * CSS class name for custom styling
   */
  className?: string;
}

/**
 * OnboardingStep component for use within MultiStepOnboarding
 */
export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && <h3 className="text-xl font-semibold text-secondary-900">{title}</h3>}
          {description && <p className="text-secondary-600">{description}</p>}
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default MultiStepOnboarding; 