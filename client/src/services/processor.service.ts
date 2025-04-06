import {
  FileProcessingResponse,
  GenerationParams,
  GenerationResponse,
  ProcessedContent,
  ProcessingTask,
  TextProcessingRequest,
  UrlProcessingRequest,
} from '@/types';
import apiService from './api';

class ProcessorService {
  // Base endpoint for processor
  private endpoint = '/processor';

  // Process text content
  async processText(data: TextProcessingRequest) {
    return apiService.post<FileProcessingResponse>(`${this.endpoint}/text`, data);
  }

  // Process URL content
  async processUrl(data: UrlProcessingRequest) {
    return apiService.post<FileProcessingResponse>(`${this.endpoint}/url`, data);
  }

  // Process file upload
  async processFile(file: File, language?: string) {
    const additionalData = language ? { language } : undefined;
    return apiService.uploadFile<FileProcessingResponse>(
      `${this.endpoint}/file`,
      file,
      additionalData
    );
  }

  // Generate flashcards from processed content
  async generateFlashcards(params: GenerationParams) {
    return apiService.post<GenerationResponse>(`${this.endpoint}/generate`, params);
  }

  // Get task status
  async getTaskStatus(taskId: string) {
    return apiService.get<ProcessingTask>(`${this.endpoint}/task/${taskId}`);
  }

  // Cancel a running task
  async cancelTask(taskId: string) {
    return apiService.delete<{ message: string }>(`${this.endpoint}/task/${taskId}`);
  }

  // Poll task status until completion or failure
  async pollTaskUntilCompletion(taskId: string, options?: {
    intervalMs?: number;
    maxAttempts?: number;
    onProgress?: (task: ProcessingTask) => void;
  }): Promise<ProcessingTask> {
    const intervalMs = options?.intervalMs || 2000;
    const maxAttempts = options?.maxAttempts || 60; // Default 2 minutes max
    
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          attempts++;
          
          const response = await this.getTaskStatus(taskId);
          
          if (!response.success || !response.data) {
            clearInterval(interval);
            reject(new Error(response.message || 'Failed to get task status'));
            return;
          }
          
          const task = response.data;
          
          // Call progress callback if provided
          if (options?.onProgress) {
            options.onProgress(task);
          }
          
          // Check task status
          if (task.status === 'completed') {
            clearInterval(interval);
            resolve(task);
          } else if (task.status === 'failed' || task.status === 'cancelled') {
            clearInterval(interval);
            reject(new Error(task.error?.message || `Task ${task.status}`));
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error('Polling timeout exceeded'));
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      };
      
      // Start polling
      const interval = setInterval(checkStatus, intervalMs);
      checkStatus(); // Immediate first check
    });
  }
}

// Create a singleton instance
const processorService = new ProcessorService();

export default processorService; 