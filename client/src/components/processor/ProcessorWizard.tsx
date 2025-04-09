import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

type ProcessorStep = 'input' | 'processing' | 'review' | 'save';
type ProcessorType = 'text' | 'url' | 'document';
type OutputType = 'flashcards' | 'study-guide' | 'both';

interface ProcessingOptions {
  // Content generation options
  format?: 'simple' | 'detailed';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  includeExamples?: boolean;
  includeImages?: boolean;
  language?: string;
  // Study options
  cardCount?: number;
  questionStyle?: 'open-ended' | 'multiple-choice' | 'true-false' | 'mixed';
}

interface ProcessorWizardProps {
  /**
   * Type of processor to use
   */
  processorType: ProcessorType;
  
  /**
   * Default output type
   */
  defaultOutputType?: OutputType;
  
  /**
   * Default processing options
   */
  defaultOptions?: ProcessingOptions;
  
  /**
   * On complete callback with generated content
   */
  onComplete?: (result: any) => void;
  
  /**
   * On cancel callback
   */
  onCancel?: () => void;
  
  /**
   * CSS class name for custom styling
   */
  className?: string;
  
  /**
   * Processor service for API interactions
   */
  processorService?: any;
}

/**
 * ProcessorWizard component that implements Progressive Disclosure.
 * Guides users through the content processing flow in manageable steps.
 */
export const ProcessorWizard: React.FC<ProcessorWizardProps> = ({
  processorType,
  defaultOutputType = 'flashcards',
  defaultOptions = {},
  onComplete,
  onCancel,
  className,
  processorService,
}) => {
  // Content and output config state
  const [content, setContent] = useState('');
  const [outputType, setOutputType] = useState<OutputType>(defaultOutputType);
  const [options, setOptions] = useState<ProcessingOptions>(defaultOptions);
  
  // Processing state
  const [currentStep, setCurrentStep] = useState<ProcessorStep>('input');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('Preparing to process...');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Results state
  const [results, setResults] = useState<any>(null);
  const [editedResults, setEditedResults] = useState<any>(null);
  
  // Error handling
  const [error, setError] = useState<string | null>(null);
  
  // Step management
  const goToNextStep = () => {
    const steps: ProcessorStep[] = ['input', 'processing', 'review', 'save'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1] as ProcessorStep);
    }
  };
  
  const goToPrevStep = () => {
    const steps: ProcessorStep[] = ['input', 'processing', 'review', 'save'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1] as ProcessorStep);
    }
  };
  
  // Content processing
  const startProcessing = async () => {
    if (!content.trim()) {
      setError('Please enter content to process');
      return;
    }
    
    setError(null);
    setCurrentStep('processing');
    setIsProcessing(true);
    
    try {
      // Simulate or implement actual processing with progress updates
      setProcessingMessage('Analyzing content...');
      setProcessingProgress(10);
      await new Promise(r => setTimeout(r, 1000));
      
      setProcessingMessage('Identifying key concepts...');
      setProcessingProgress(30);
      await new Promise(r => setTimeout(r, 1000));
      
      setProcessingMessage('Generating learning materials...');
      setProcessingProgress(60);
      await new Promise(r => setTimeout(r, 1000));
      
      setProcessingMessage('Formatting results...');
      setProcessingProgress(90);
      await new Promise(r => setTimeout(r, 1000));
      
      // Replace with actual service call when available
      // const result = await processorService.process({
      //   type: processorType,
      //   content,
      //   outputType,
      //   options
      // });
      
      // Mock result for now
      const mockResult = {
        id: 'mock-123',
        flashcards: [
          { front: 'What is progressive disclosure?', back: 'A design technique that sequences information and actions across several screens to reduce complexity' },
          { front: 'What is the benefit of progressive disclosure?', back: 'It reduces cognitive load and helps users focus on the immediate task' }
        ],
        studyGuide: {
          title: 'Sample Study Guide',
          sections: [
            { title: 'Introduction', content: 'This is a sample study guide introduction.' },
            { title: 'Key Concepts', content: 'These are the key concepts of the subject.' }
          ]
        }
      };
      
      setResults(mockResult);
      setEditedResults(mockResult);
      setProcessingProgress(100);
      setProcessingMessage('Processing complete!');
      
      // Move to review step after a short delay
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep('review');
      }, 1000);
      
    } catch (error) {
      console.error('Processing error:', error);
      setError('An error occurred during processing. Please try again.');
      setIsProcessing(false);
      setCurrentStep('input');
    }
  };
  
  // Save the final processed content
  const saveResults = () => {
    if (onComplete && editedResults) {
      onComplete(editedResults);
    }
    setCurrentStep('save');
  };
  
  // Update the processing options
  const updateOption = (key: keyof ProcessingOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };
  
  // Render different steps of the wizard
  const renderStepContent = () => {
    switch (currentStep) {
      case 'input':
        return renderInputStep();
      case 'processing':
        return renderProcessingStep();
      case 'review':
        return renderReviewStep();
      case 'save':
        return renderSaveStep();
      default:
        return null;
    }
  };
  
  // Input step - collect content and set options
  const renderInputStep = () => (
    <>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium text-secondary-700">
            {processorType === 'text' && 'Enter text to process'}
            {processorType === 'url' && 'Enter URL to process'}
            {processorType === 'document' && 'Upload document to process'}
          </label>
          
          {processorType === 'text' && (
            <textarea
              id="content"
              rows={8}
              className="w-full rounded-md border border-neutral-300 p-3 text-secondary-900 focus:border-primary-500 focus:ring-primary-500"
              placeholder="Paste or type text content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
          
          {processorType === 'url' && (
            <input
              type="url"
              id="content"
              className="w-full rounded-md border border-neutral-300 p-3 text-secondary-900 focus:border-primary-500 focus:ring-primary-500"
              placeholder="https://example.com/article"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
          
          {processorType === 'document' && (
            <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
              <svg className="mb-2 h-10 w-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-secondary-600">
                Drag and drop your document here, or <span className="text-primary-600 hover:underline">browse</span>
              </p>
              <p className="text-xs text-secondary-500">
                Supported formats: PDF, DOCX, TXT (max 10MB)
              </p>
              <input
                type="file"
                id="content"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    // Handle file upload logic here
                    setContent(e.target.files[0].name);
                  }
                }}
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="block text-sm font-medium text-secondary-700">Output Format</p>
          <div className="flex space-x-4">
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="radio"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                checked={outputType === 'flashcards'}
                onChange={() => setOutputType('flashcards')}
              />
              <span className="text-sm text-secondary-700">Flashcards</span>
            </label>
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="radio"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                checked={outputType === 'study-guide'}
                onChange={() => setOutputType('study-guide')}
              />
              <span className="text-sm text-secondary-700">Study Guide</span>
            </label>
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="radio"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                checked={outputType === 'both'}
                onChange={() => setOutputType('both')}
              />
              <span className="text-sm text-secondary-700">Both</span>
            </label>
          </div>
        </div>
        
        <div className="rounded-md bg-neutral-50 p-4">
          <details className="cursor-pointer">
            <summary className="font-medium text-secondary-700">Advanced Options</summary>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-secondary-700">
                    Difficulty Level
                  </label>
                  <select
                    className="w-full rounded-md border border-neutral-300 py-1.5 text-xs text-secondary-900 focus:border-primary-500 focus:ring-primary-500"
                    value={options.difficulty || 'intermediate'}
                    onChange={(e) => updateOption('difficulty', e.target.value)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-secondary-700">
                    Format
                  </label>
                  <select
                    className="w-full rounded-md border border-neutral-300 py-1.5 text-xs text-secondary-900 focus:border-primary-500 focus:ring-primary-500"
                    value={options.format || 'simple'}
                    onChange={(e) => updateOption('format', e.target.value)}
                  >
                    <option value="simple">Simple</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-medium text-secondary-700">
                  Additional Features
                </label>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                      checked={options.includeExamples || false}
                      onChange={(e) => updateOption('includeExamples', e.target.checked)}
                    />
                    <span className="text-xs text-secondary-700">Include examples</span>
                  </label>
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                      checked={options.includeImages || false}
                      onChange={(e) => updateOption('includeImages', e.target.checked)}
                    />
                    <span className="text-xs text-secondary-700">Generate relevant images</span>
                  </label>
                </div>
              </div>
              
              {outputType === 'flashcards' || outputType === 'both' ? (
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-secondary-700">
                    Question Style
                  </label>
                  <select
                    className="w-full rounded-md border border-neutral-300 py-1.5 text-xs text-secondary-900 focus:border-primary-500 focus:ring-primary-500"
                    value={options.questionStyle || 'open-ended'}
                    onChange={(e) => updateOption('questionStyle', e.target.value)}
                  >
                    <option value="open-ended">Open Ended</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              ) : null}
            </div>
          </details>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        
        <Button
          variant="primary"
          onClick={startProcessing}
          disabled={!content.trim()}
        >
          Process Content
        </Button>
      </CardFooter>
    </>
  );
  
  // Processing step - show progress
  const renderProcessingStep = () => (
    <CardContent className="flex flex-col items-center justify-center py-10">
      <div className="mb-4 text-center">
        <svg className="mx-auto mb-4 h-16 w-16 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="mb-2 text-lg font-semibold text-secondary-900">{processingMessage}</h3>
        <p className="text-sm text-secondary-600">Please wait while we process your content.</p>
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-2 flex justify-between text-xs text-secondary-600">
          <span>Progress</span>
          <span>{processingProgress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-neutral-200">
          <div
            className="h-2 rounded-full bg-primary-500 transition-all duration-300 ease-in-out"
            style={{ width: `${processingProgress}%` }}
          ></div>
        </div>
      </div>
    </CardContent>
  );
  
  // Review step - preview and edit results
  const renderReviewStep = () => (
    <>
      <CardContent className="space-y-4">
        <div className="mb-4 rounded-md bg-primary-50 p-4 text-sm text-primary-800">
          <p>Review the generated content below. You can make edits before saving.</p>
        </div>
        
        {/* Preview section - simplified for this example */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-secondary-900">Preview</h3>
          
          {(outputType === 'flashcards' || outputType === 'both') && editedResults?.flashcards && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-secondary-700">Flashcards ({editedResults.flashcards.length})</h4>
              <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border border-neutral-200 p-4">
                {editedResults.flashcards.map((card: any, index: number) => (
                  <div key={index} className="rounded-md border border-neutral-200 p-3">
                    <div className="mb-2 font-medium text-secondary-800">{card.front}</div>
                    <div className="text-sm text-secondary-600">{card.back}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(outputType === 'study-guide' || outputType === 'both') && editedResults?.studyGuide && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-secondary-700">Study Guide</h4>
              <div className="max-h-60 overflow-y-auto rounded-md border border-neutral-200 p-4">
                <h5 className="mb-2 text-base font-medium text-secondary-800">{editedResults.studyGuide.title}</h5>
                {editedResults.studyGuide.sections.map((section: any, index: number) => (
                  <div key={index} className="mb-3">
                    <h6 className="mb-1 text-sm font-medium text-secondary-700">{section.title}</h6>
                    <p className="text-sm text-secondary-600">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Editing controls would be here */}
        <div className="mt-4 rounded-md bg-neutral-50 p-4">
          <p className="text-sm text-secondary-600">
            In a full implementation, you would be able to edit the content directly.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep('input')}
        >
          Back to Input
        </Button>
        
        <Button
          variant="primary"
          onClick={saveResults}
        >
          Save & Continue
        </Button>
      </CardFooter>
    </>
  );
  
  // Save step - confirmation
  const renderSaveStep = () => (
    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-4 rounded-full bg-primary-100 p-3">
        <svg className="h-10 w-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-secondary-900">Processing Complete!</h3>
      <p className="mb-6 max-w-md text-secondary-600">
        Your content has been successfully processed and saved.
      </p>
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            setContent('');
            setResults(null);
            setEditedResults(null);
            setCurrentStep('input');
          }}
        >
          Process Another
        </Button>
        <Button
          variant="primary"
          onClick={onComplete ? () => onComplete(editedResults) : undefined}
        >
          View Results
        </Button>
      </div>
    </CardContent>
  );
  
  // Main component render
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <CardTitle>
          {processorType === 'text' && 'Text Processor'}
          {processorType === 'url' && 'URL Processor'}
          {processorType === 'document' && 'Document Processor'}
        </CardTitle>
        <CardDescription>
          {processorType === 'text' && 'Generate learning materials from text content'}
          {processorType === 'url' && 'Generate learning materials from web content'}
          {processorType === 'document' && 'Generate learning materials from uploaded documents'}
        </CardDescription>
      </CardHeader>
      
      {renderStepContent()}
    </Card>
  );
};

export default ProcessorWizard; 