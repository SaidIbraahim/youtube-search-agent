interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg sticky top-0 z-30">
      <div className="container mx-auto px-6 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg">
              🎥 YouTube Agent
            </h1>
            <p className="text-primary-100 text-xs md:text-sm font-light mt-1">
              Your intelligent AI agent for YouTube analysis, summaries, and insights
            </p>
          </div>
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

