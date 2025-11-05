import type { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const isProcessing = message.role === 'processing';
  
  // Extract and format YouTube URLs
  const formatContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s\)]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, idx) => {
      if (part.match(urlRegex)) {
        const isYouTube = part.includes('youtube.com') || part.includes('youtu.be');
        let displayText = part;
        
        if (isYouTube) {
          // Extract video ID and show short URL
          const videoIdMatch = part.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          if (videoIdMatch) {
            displayText = `https://youtu.be/${videoIdMatch[1]}`;
          }
        }
        
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`${isUser ? 'text-primary-100 hover:text-white' : 'text-primary-600 hover:text-primary-700'} underline font-medium`}
          >
            {displayText}
          </a>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

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
        className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] rounded-2xl px-5 py-4 shadow-sm ${
          isUser
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
            : 'bg-white text-gray-800 border border-gray-200'
        }`}
      >
        <div className="prose prose-base max-w-none">
          <p className="whitespace-pre-wrap break-words m-0 leading-relaxed">
            {formatContent(message.content)}
          </p>
        </div>
        <p className={`text-xs mt-3 opacity-70 ${isUser ? 'text-primary-100' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

