import type { QueryRequest, QueryResponse, CacheStats } from '../types';

// API URL: use VITE_API_URL if provided; otherwise use '/api' in production, '/api' in dev (via Vite proxy)
// In dev, Vite proxy rewrites /api/* to http://localhost:8000/*
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

      // Check content type first
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      
      // Clone response for reading (in case we need to read as text)
      const responseClone = response.clone();
      
      if (!isJson) {
        // Not JSON - read as text to see what we got
        const text = await responseClone.text();
        // If we got HTML, the backend is likely not running or wrong URL
        if (text.includes('<!DOCTYPE html>') || text.includes('<html') || text.includes('__next_f')) {
          throw new Error(
            `❌ Backend returned HTML instead of JSON!\n\n` +
            `This usually means:\n` +
            `1. The backend server is not running on ${API_BASE_URL}\n` +
            `2. The request was redirected to a wrong URL\n` +
            `3. CORS is blocking the request\n\n` +
            `**Solution:**\n` +
            `1. Start the backend: python -m youtube_agent.app.main --api\n` +
            `2. Verify it's running: curl http://localhost:8000/health\n` +
            `3. Check browser console for CORS errors`
          );
        }
        throw new Error(`Unexpected response type: ${contentType}\n\nResponse: ${text.substring(0, 200)}`);
      }

      if (!response.ok) {
        const error = await response.json().catch(async () => {
          // If JSON parsing fails, try to get text
          const text = await responseClone.text();
          return { detail: `HTTP ${response.status}: ${response.statusText}\n\nResponse: ${text.substring(0, 200)}` };
        });
        
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

