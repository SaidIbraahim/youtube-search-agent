import { useState, useCallback, useRef } from 'react';
import type { Message } from '../types';
import { apiService } from '../services/api';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);

  const sendMessage = useCallback(async (query: string) => {
    // Prevent double submission
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Safety timeout - force reset after max time
    const safetyTimeout = setTimeout(() => {
      isLoadingRef.current = false;
      setIsLoading(false);
    }, 120000); // 2 minutes max

    try {
      const response = await apiService.query({ query, use_cache: true });
      
      // Clear safety timeout
      clearTimeout(safetyTimeout);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      isLoadingRef.current = false;
      setIsLoading(false);
    } catch (err) {
      // Clear safety timeout
      clearTimeout(safetyTimeout);
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Add error message with helpful context
      let errorContent = `❌ **Error**: ${errorMessage}`;
      
      // Add specific suggestions based on error type
      if (errorMessage.includes('Rate Limit') || errorMessage.includes('429')) {
        errorContent += `\n\n**What happened?**\n` +
          `You've reached your daily API usage limit. This is a free tier limitation.\n\n` +
          `**Solutions:**\n` +
          `1. Wait for the rate limit to reset (usually 24 hours)\n` +
          `2. Upgrade to a higher tier at https://console.groq.com/settings/billing\n` +
          `3. Switch to a different LLM provider (OpenAI, Ollama) in your .env file`;
      } else if (errorMessage.includes('Cannot connect')) {
        errorContent += `\n\n**Troubleshooting:**\n` +
          `1. Check your internet connection\n` +
          `2. Verify the API server is running and accessible\n` +
          `3. Try refreshing the page`;
      }
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}

