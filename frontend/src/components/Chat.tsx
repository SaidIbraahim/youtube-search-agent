import { useState, useRef, useEffect } from 'react';
import { Message } from './Message';
import { ExampleQueries } from './ExampleQueries';
import { Logo } from './Logo';
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
          <div className="text-center text-gray-500 mt-16 space-y-6">
            <div className="flex justify-center mb-6">
              <Logo size="lg" className="opacity-80" />
            </div>
            <div className="space-y-3">
              <p className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Welcome to YouTube Agent
              </p>
              <p className="text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
                Start a conversation or try an example below. I can help you search, summarize, and analyze YouTube videos.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <div key={message.id} className="py-2">
                <Message message={message} enableTyping={true} />
              </div>
            ))}
          </div>
        )}
        
        {isLoading && (
          <div className="max-w-4xl mx-auto py-2">
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="font-medium">Processing...</span>
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
            Send
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

