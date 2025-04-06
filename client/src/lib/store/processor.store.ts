import { create } from 'zustand';
import {
  ProcessorService,
  type ProcessingTask,
  type TextProcessingData,
  type UrlProcessingData,
  type GenerationParams,
} from '@/lib/api/services';

interface ProcessorState {
  currentTask: ProcessingTask | null;
  isProcessing: boolean;
  error: string | null;
  
  // Actions
  processText: (data: TextProcessingData) => Promise<ProcessingTask>;
  processUrl: (data: UrlProcessingData) => Promise<ProcessingTask>;
  processFile: (file: File, params?: Omit<GenerationParams, 'content' | 'contentType'>) => Promise<ProcessingTask>;
  generateFlashcards: (params: GenerationParams) => Promise<ProcessingTask>;
  pollTaskStatus: (taskId: string, onProgress?: (task: ProcessingTask) => void) => Promise<ProcessingTask>;
  cancelTask: (taskId: string) => Promise<void>;
  clearError: () => void;
}

export const useProcessorStore = create<ProcessorState>()((set, get) => ({
  currentTask: null,
  isProcessing: false,
  error: null,

  processText: async (data: TextProcessingData) => {
    try {
      set({ isProcessing: true, error: null });
      const processorService = ProcessorService.getInstance();
      const response = await processorService.processText(data);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to process text');
      }
      
      const task = response.data;
      set({
        currentTask: task,
        isProcessing: false,
      });
      
      return task;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isProcessing: false,
      });
      throw error;
    }
  },

  processUrl: async (data: UrlProcessingData) => {
    try {
      set({ isProcessing: true, error: null });
      const processorService = ProcessorService.getInstance();
      const response = await processorService.processUrl(data);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to process URL');
      }
      
      const task = response.data;
      set({
        currentTask: task,
        isProcessing: false,
      });
      
      return task;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isProcessing: false,
      });
      throw error;
    }
  },

  processFile: async (file: File, params?: Omit<GenerationParams, 'content' | 'contentType'>) => {
    try {
      set({ isProcessing: true, error: null });
      const processorService = ProcessorService.getInstance();
      const response = await processorService.processFile(file, params);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to process file');
      }
      
      const task = response.data;
      set({
        currentTask: task,
        isProcessing: false,
      });
      
      return task;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isProcessing: false,
      });
      throw error;
    }
  },

  generateFlashcards: async (params: GenerationParams) => {
    try {
      set({ isProcessing: true, error: null });
      const processorService = ProcessorService.getInstance();
      const response = await processorService.generateFlashcards(params);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to generate flashcards');
      }
      
      const task = response.data;
      set({
        currentTask: task,
        isProcessing: false,
      });
      
      return task;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isProcessing: false,
      });
      throw error;
    }
  },

  pollTaskStatus: async (taskId: string, onProgress?: (task: ProcessingTask) => void) => {
    try {
      const processorService = ProcessorService.getInstance();
      const task = await processorService.pollTaskStatus(taskId, (task) => {
        set({ currentTask: task });
        onProgress?.(task);
      });
      
      return task;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
      throw error;
    }
  },

  cancelTask: async (taskId: string) => {
    try {
      set({ isProcessing: true, error: null });
      const processorService = ProcessorService.getInstance();
      const response = await processorService.cancelTask(taskId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel task');
      }
      
      set({
        currentTask: null,
        isProcessing: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isProcessing: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
})); 