import { ApiClient, ApiResponse } from '../client';
import { Flashcard } from './flashcard.service';

// Types
export interface TextProcessingData {
  content: string;
  language?: string;
  complexity?: 'simple' | 'medium' | 'advanced';
  maxFlashcards?: number;
}

export interface UrlProcessingData {
  url: string;
  language?: string;
  complexity?: 'simple' | 'medium' | 'advanced';
  maxFlashcards?: number;
}

export interface GenerationParams {
  content: string;
  contentType: 'text' | 'url' | 'file';
  language?: string;
  complexity?: 'simple' | 'medium' | 'advanced';
  maxFlashcards?: number;
  style?: 'concise' | 'detailed' | 'quiz';
  includeHints?: boolean;
  includeTags?: boolean;
}

export interface ProcessingTask {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: Flashcard[];
  error?: string;
}

// Processor Service class
export class ProcessorService {
  private static instance: ProcessorService;
  private api: ApiClient;

  private constructor() {
    this.api = ApiClient.getInstance();
  }

  public static getInstance(): ProcessorService {
    if (!ProcessorService.instance) {
      ProcessorService.instance = new ProcessorService();
    }
    return ProcessorService.instance;
  }

  /**
   * Process text content
   */
  public async processText(data: TextProcessingData): Promise<ApiResponse<ProcessingTask>> {
    return this.api.post<ProcessingTask>('/processor/text', data);
  }

  /**
   * Process URL content
   */
  public async processUrl(data: UrlProcessingData): Promise<ApiResponse<ProcessingTask>> {
    return this.api.post<ProcessingTask>('/processor/url', data);
  }

  /**
   * Process file content
   */
  public async processFile(file: File, params?: Omit<GenerationParams, 'content' | 'contentType'>): Promise<ApiResponse<ProcessingTask>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, JSON.stringify(value));
        }
      });
    }

    return this.api.post<ProcessingTask>('/processor/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Generate flashcards from content
   */
  public async generateFlashcards(params: GenerationParams): Promise<ApiResponse<ProcessingTask>> {
    return this.api.post<ProcessingTask>('/processor/generate', params);
  }

  /**
   * Get task status
   */
  public async getTaskStatus(taskId: string): Promise<ApiResponse<ProcessingTask>> {
    return this.api.get<ProcessingTask>(`/processor/task/${taskId}`);
  }

  /**
   * Cancel task
   */
  public async cancelTask(taskId: string): Promise<ApiResponse> {
    return this.api.delete(`/processor/task/${taskId}`);
  }

  /**
   * Poll task status until completion
   */
  public async pollTaskStatus(taskId: string, onProgress?: (task: ProcessingTask) => void): Promise<ProcessingTask> {
    const poll = async (): Promise<ProcessingTask> => {
      const response = await this.getTaskStatus(taskId);
      
      if (!response.success || !response.data) {
        throw new Error('Failed to get task status');
      }

      const task = response.data;
      
      if (onProgress) {
        onProgress(task);
      }

      if (task.status === 'completed' || task.status === 'failed') {
        return task;
      }

      // Wait 1 second before next poll
      await new Promise(resolve => setTimeout(resolve, 1000));
      return poll();
    };

    return poll();
  }
} 