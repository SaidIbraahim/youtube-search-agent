import type { QueryRequest, QueryResponse, CacheStats } from '../types';

// API URL from environment or default to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:8000');

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: options.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: `HTTP ${response.status}: ${response.statusText}` }));
        
        // Handle rate limit errors specially
        if (response.status === 429) {
          const errorMsg = error.detail || error.message || 'Rate limit exceeded';
          const suggestion = error.suggestion || '';
          throw new Error(`⚠️ Rate Limit Exceeded\n\n${errorMsg}${suggestion ? '\n\n' + suggestion : ''}`);
        }
        
        throw new Error(error.detail || error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // Handle abort errors (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - the server took too long to respond');
      }
      
      // Handle network errors (backend not running, CORS, etc.)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(
          `Cannot connect to backend API. Please check your connection and ensure the server is running.`
        );
      }
      // Re-throw other errors
      throw error;
    }
  }

  async query(request: QueryRequest): Promise<QueryResponse> {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes
    
    try {
      const response = await this.request<QueryResponse>('/query', {
        method: 'POST',
        body: JSON.stringify(request),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - the server took too long to respond');
      }
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request<{ status: string; service: string }>('/health');
  }

  async getCacheStats(): Promise<CacheStats> {
    return this.request<CacheStats>('/cache/stats');
  }

  async clearCache(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/cache/clear', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();

