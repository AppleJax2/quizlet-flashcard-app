export type TaskType = 'fileUpload' | 'urlProcessing' | 'textProcessing' | 'flashcardGeneration' | 'export';
export type TaskStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface ProcessingTask {
  id: string;
  taskId: string;
  userId: string;
  taskType: TaskType;
  status: TaskStatus;
  progress: number;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
  result?: any;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface TextProcessingRequest {
  content: string;
  language?: string;
  title?: string;
}

export interface UrlProcessingRequest {
  url: string;
  language?: string;
}

export interface FileProcessingResponse {
  success: boolean;
  message: string;
  taskId: string;
}

export interface ProcessedContent {
  title: string;
  content: string;
  metadata: {
    language: string;
    wordCount: number;
    characterCount: number;
    processedAt: string;
    url?: string;
    fileType?: string;
    fileName?: string;
  };
}

export interface GenerationParams {
  content: string;
  language?: string;
  complexity?: 'simple' | 'medium' | 'advanced';
  cardCount?: number;
  includeImages?: boolean;
  frontLengthMax?: number;
  backLengthMax?: number;
  title?: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface GenerationResponse {
  success: boolean;
  message: string;
  taskId: string;
} 