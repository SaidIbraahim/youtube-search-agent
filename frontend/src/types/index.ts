export interface QueryRequest {
  query: string;
  use_cache?: boolean;
}

export interface QueryResponse {
  query: string;
  response: string;
  success: boolean;
  error?: string | null;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'processing';
  content: string;
  timestamp: Date;
  processingStatus?: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
}

