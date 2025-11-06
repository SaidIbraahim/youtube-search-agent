import type { QueryRequest, QueryResponse, CacheStats } from '../types';

// API URL: use VITE_API_URL if provided; otherwise use '/api' in production, localhost in dev
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:8000');

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

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        // If we got HTML, the backend is likely not running or wrong URL
        if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
          throw new Error(
            `Backend returned HTML instead of JSON. This usually means:\n` +
            `1. The backend server is not running on ${API_BASE_URL}\n` +
            `2. The API endpoint does not exist\n` +
            `3. The request was redirected to a wrong URL\n\n` +
            `Please ensure the backend is running: python -m youtube_agent.app.main --api`
          );
        }
        throw new Error(`Unexpected response type: ${contentType}. Expected JSON.`);
      }

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

