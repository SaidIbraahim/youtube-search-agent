interface ExampleQueriesProps {
  onSelect: (query: string) => void;
  disabled?: boolean;
}

const EXAMPLES = [
  "Summarize this video: https://www.youtube.com/watch?v=T-D1OfcDW1M",
  "Search for Python tutorials",
  "Find popular AI videos",
  "Get metadata for https://www.youtube.com/watch?v=dQw4w9WgXcQ",
];

export function ExampleQueries({ onSelect, disabled }: ExampleQueriesProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <p className="text-base text-gray-700 mb-4 font-semibold">✨ Try these examples:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {EXAMPLES.map((example, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(example)}
            disabled={disabled}
            className="text-left px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:from-primary-50 hover:to-primary-100 hover:border-primary-300 hover:text-primary-700 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}

