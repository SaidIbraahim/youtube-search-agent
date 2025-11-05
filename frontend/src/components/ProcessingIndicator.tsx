interface ProcessingIndicatorProps {
  status: string;
}

const statusMessages: Record<string, string> = {
  'search_youtube': '🔍 Searching YouTube...',
  'fetch_transcript': '📝 Fetching transcript...',
  'get_full_metadata': '📊 Extracting metadata...',
  'get_trending_videos': '📈 Getting trending videos...',
  'get_thumbnails': '🖼️ Loading thumbnails...',
  'extract_video_id': '🔗 Extracting video ID...',
  'truncate_text': '✂️ Processing text...',
  'thinking': '💭 Thinking...',
  'processing': '⚙️ Processing...',
};

export function ProcessingIndicator({ status }: ProcessingIndicatorProps) {
  const message = statusMessages[status] || `⚙️ ${status}...`;
  
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 animate-pulse">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="font-medium">{message}</span>
    </div>
  );
}

