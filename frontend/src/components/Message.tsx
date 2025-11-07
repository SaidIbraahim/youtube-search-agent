import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTypingEffect } from '../hooks/useTypingEffect';
import type { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
  enableTyping?: boolean; // Enable typing effect for assistant messages
}

export function Message({ message, enableTyping = true }: MessageProps) {
  const isUser = message.role === 'user';
  const isProcessing = message.role === 'processing';
  
  // Only enable typing effect for assistant messages (not user or processing)
  const shouldType = !isUser && !isProcessing && enableTyping;
  const { displayedText, isComplete } = useTypingEffect({
    text: message.content,
    speed: 4, // Characters per interval
    enabled: shouldType,
  });
  
  // Use displayed text for typing effect, or full content if disabled
  const contentToDisplay = shouldType ? displayedText : message.content;
  const markdownContent = shouldType && !isComplete ? `${contentToDisplay} ▋` : contentToDisplay;

  if (isProcessing) {
    return (
      <div className="flex justify-start animate-fade-in">
        <div className="max-w-[85%] md:max-w-[75%] lg:max-w-[65%]">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="font-medium">{message.content || 'Processing...'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] rounded-2xl px-5 py-4 shadow-sm transition-all duration-200 ${
          isUser
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
            : 'bg-white text-gray-800 border border-gray-200 hover:shadow-md'
        }`}
      >
        <div className="prose prose-base max-w-none markdown-content relative">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Style tables to be responsive and well-formatted
              table: ({ children, ...props }) => (
                <div className="overflow-x-auto my-4 -mx-2 px-2">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg shadow-sm" {...props}>
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children, ...props }) => (
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100" {...props}>{children}</thead>
              ),
              tbody: ({ children, ...props }) => (
                <tbody className="bg-white divide-y divide-gray-200" {...props}>{children}</tbody>
              ),
              tr: ({ children, ...props }) => (
                <tr className="hover:bg-gray-50 transition-colors" {...props}>{children}</tr>
              ),
              th: ({ children, ...props }) => (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 whitespace-nowrap" {...props}>
                  {children}
                </th>
              ),
              td: ({ children, ...props }) => {
                // Check if content is a URL
                const content = String(children);
                const isUrl = /^https?:\/\//.test(content.trim());
                
                return (
                  <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100" {...props}>
                    <div className={`${isUrl ? 'font-mono text-xs' : ''} break-all break-words max-w-md`}>
                      {children}
                    </div>
                  </td>
                );
              },
              // Make links clickable with proper styling
              a: ({ href, children, ...props }) => {
                const isYouTube = href?.includes('youtube.com') || href?.includes('youtu.be');
                let displayText = href || '';
                
                if (isYouTube && href) {
                  const videoIdMatch = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                  if (videoIdMatch) {
                    displayText = `https://youtu.be/${videoIdMatch[1]}`;
                  }
                }
                
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${isUser ? 'text-primary-100 hover:text-white' : 'text-primary-600 hover:text-primary-700'} underline font-medium`}
                    {...props}
                  >
                    {children || displayText}
                  </a>
                );
              },
              // Style code blocks
              code: ({ inline, children, ...props }: any) => {
                if (inline) {
                  return (
                    <code className="bg-gray-100 text-primary-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              },
              // Style lists
              ul: ({ children, ...props }) => (
                <ul className="list-disc list-inside space-y-1 my-2" {...props}>{children}</ul>
              ),
              ol: ({ children, ...props }) => (
                <ol className="list-decimal list-inside space-y-1 my-2" {...props}>{children}</ol>
              ),
              // Style paragraphs
              p: ({ children, ...props }) => (
                <p className="mb-2 last:mb-0 leading-relaxed" {...props}>{children}</p>
              ),
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
        <p className={`text-xs mt-3 opacity-70 ${isUser ? 'text-primary-100' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

