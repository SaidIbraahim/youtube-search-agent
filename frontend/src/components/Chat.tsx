import { useState, useRef, useEffect } from 'react';
import { Message } from './Message';
import { ExampleQueries } from './ExampleQueries';
import type { Message as MessageType } from '../types';

interface ChatProps {
  messages: MessageType[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClear: () => void;
}

export function Chat({ messages, isLoading, onSendMessage, onClear }: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput && !isLoading) {
      setInput(''); // Clear input immediately
      onSendMessage(trimmedInput);
    }
  };

  const handleExampleSelect = (example: string) => {
    setInput(example);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-16 space-y-4">
            <div className="text-6xl mb-4">👋</div>
            <p className="text-2xl font-semibold text-gray-700">Welcome to YouTube Agent!</p>
            <p className="text-base text-gray-500 max-w-md mx-auto">
              Start a conversation or try an example below. I can help you search, summarize, and analyze YouTube videos.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <div key={message.id} className="py-1.5">
                <Message message={message} />
              </div>
            ))}
          </div>
        )}
        
        {isLoading && (
          <div className="max-w-4xl mx-auto py-2">
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="font-medium">💭 Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-6">
        {messages.length === 0 && (
          <div className="mb-6">
            <ExampleQueries onSelect={handleExampleSelect} disabled={isLoading} />
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about YouTube videos..."
            disabled={isLoading}
            className="input-field flex-1 disabled:opacity-50 text-base py-4 px-5"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap px-6 py-4 text-base min-w-[100px]"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              disabled={isLoading}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap px-6 py-4 text-base"
            >
              Clear
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

