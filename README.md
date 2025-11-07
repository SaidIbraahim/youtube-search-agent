# YouTube Agent 🎥

An intelligent AI agent for YouTube interaction that can search videos, extract transcripts, fetch trending content, and generate summaries using recursive tool-calling with LangChain.

## ✨ Features

- 🔍 **Video Search**: Search YouTube videos with metadata
- 📝 **Transcript Extraction**: Get full transcripts from YouTube videos
- 📊 **Trending Content**: Fetch trending videos by region
- 🤖 **AI Summarization**: Generate intelligent summaries using LLM
- 💾 **Caching**: Smart caching for faster responses
- 🎨 **Modern UI**: Beautiful, responsive interface built with React, TypeScript, and Tailwind CSS
- 🔄 **Recursive Tool Calling**: Advanced LangChain agent with recursive processing

## 🏗️ Architecture

### Frontend Stack
- **Framework**: React 18.2+ with TypeScript
- **Build Tool**: Vite 5.0+
- **Styling**: Tailwind CSS 3.3+
- **Markdown Rendering**: react-markdown with remark-gfm (for tables, lists, etc.)
- **UI Features**: 
  - Custom SVG logo with animations
  - Typing effect for responses
  - Responsive markdown table rendering
  - Real-time processing indicators

### Backend Stack
- **Framework**: FastAPI 0.104+
- **Server**: Uvicorn (ASGI server)
- **AI Framework**: LangChain 1.0+
- **Caching**: DiskCache for API responses
- **API**: RESTful API with OpenAPI documentation

### LLM Providers Supported
- **Groq** (default) - Free tier available, fast inference
- **OpenAI** - GPT models (gpt-4o-mini, gpt-4, etc.)
- **Cerebras** - Free 14,000+ requests/day (gpt-oss-120b, llama-3.3-70b)
- **Bytez** - OpenAI-compatible gateway (gpt-4o-mini)
- **Ollama** - Local LLM deployment

### YouTube Tools
- **pytube** - YouTube video metadata and data extraction
- **youtube-transcript-api** - Transcript fetching
- **yt-dlp** - Enhanced YouTube data extraction

### Deployment
- **Frontend**: Vercel (automatic deployments)
- **Backend API**: Vercel serverless functions (Python runtime)
- **Configuration**: Vercel-ready with CORS and routing

## 🚀 Quick Start

### Prerequisites

- **Python**: 3.9 or higher
- **Node.js**: 18 or higher
- **API Key**: Choose one LLM provider:
  - Groq (recommended for free tier)
  - Cerebras (free 14,000+ requests/day)
  - OpenAI
  - Bytez
  - Ollama (for local deployment)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SaidIbraahim/youtube-search-agent.git
   cd youtube-search-agent
   ```

2. **Set up Python backend**:
   ```bash
   # Create virtual environment
   python -m venv .venv
   
   # Activate virtual environment
   # Windows:
   .venv\Scripts\activate
   # Linux/Mac:
   source .venv/bin/activate
   
   # Install dependencies
   pip install -r youtube_agent/requirements.txt
   ```

3. **Set up frontend**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure environment variables**:
   ```bash
   # Copy example file
   cp youtube_agent/.env.example youtube_agent/.env
   
   # Edit youtube_agent/.env and add your API keys
   ```

5. **Start the backend**:
   ```bash
   python -m youtube_agent.app.main --api
   ```

6. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Open your browser**:
   - Frontend: http://localhost:5173
   - API Docs: http://localhost:8000/docs

## 📚 Usage

### CLI Mode

```bash
python -m youtube_agent.app.main "Summarize this video: https://youtu.be/..."
```

### Web Interface

1. Open http://localhost:5173
2. Enter your query in the chat interface
3. Get AI-powered responses with source links

### Example Queries

- "Search for videos about Python programming"
- "Get trending videos in US"
- "Summarize this video: https://youtu.be/..."
- "Extract transcript from https://youtu.be/..."

## 🌐 Deployment

### Deploy to Vercel

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### GitHub Setup

See [GITHUB_DEPLOY.md](GITHUB_DEPLOY.md) for GitHub deployment steps.

## 🛠️ Configuration

### LLM Provider Selection

Set `LLM_PROVIDER` in `.env` to one of the following:

#### Option 1: Groq (Default - Recommended)
```bash
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
LLM_MODEL=llama-3.3-70b-versatile
```
- **Free tier**: Available
- **Get API key**: https://console.groq.com/

#### Option 2: Cerebras (Free 14,000+ requests/day)
```bash
LLM_PROVIDER=cerebras
CEREBRAS_API_KEY=your_cerebras_api_key_here
CEREBRAS_BASE_URL=https://api.cerebras.ai/v1
LLM_MODEL=gpt-oss-120b
```
- **Free tier**: 14,000+ requests/day
- **Get API key**: https://cloud.cerebras.ai/

#### Option 3: OpenAI
```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4o-mini
```
- **Get API key**: https://platform.openai.com/api-keys

#### Option 4: Bytez
```bash
LLM_PROVIDER=bytez
BYTEZ_API_KEY=your_bytez_api_key_here
BYTEZ_BASE_URL=https://api.bytez.com/openai/v1
LLM_MODEL=gpt-4o-mini
```

#### Option 5: Ollama (Local)
```bash
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```
- **Setup**: Install Ollama locally from https://ollama.ai/

### Environment Variables

Create a `.env` file in `youtube_agent/` directory:

```bash
# Required: Choose one LLM provider
LLM_PROVIDER=groq

# Provider-specific keys (set based on LLM_PROVIDER)
GROQ_API_KEY=your_key_here
# OR
CEREBRAS_API_KEY=your_key_here
# OR
OPENAI_API_KEY=your_key_here
# OR
BYTEZ_API_KEY=your_key_here

# Optional: Custom model name
LLM_MODEL=llama-3.3-70b-versatile
```

## 📖 API Documentation

Once the backend is running, visit:
- API Docs: http://localhost:8000/docs
- OpenAPI Schema: http://localhost:8000/openapi.json

## 🔒 Security

- All `.env` files are excluded from Git
- Sensitive data is never committed
- CORS configured for production deployment

## 📝 Project Structure

```
.
├── frontend/                    # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Chat.tsx        # Main chat interface
│   │   │   ├── Message.tsx     # Message rendering with markdown
│   │   │   ├── Header.tsx      # App header with logo
│   │   │   ├── Logo.tsx        # Custom SVG logo
│   │   │   ├── Sidebar.tsx     # Settings sidebar
│   │   │   └── ...
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useChat.ts      # Chat state management
│   │   │   └── useTypingEffect.ts  # Typing animation hook
│   │   ├── services/           # API service layer
│   │   │   └── api.ts          # FastAPI client
│   │   └── types/              # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── youtube_agent/               # Python backend
│   ├── app/
│   │   ├── agent.py            # LangChain agent with recursive tool calling
│   │   ├── api.py              # FastAPI REST API endpoints
│   │   ├── config.py           # Configuration & LLM provider setup
│   │   ├── prompts.py          # System prompts for AI agent
│   │   ├── cache.py            # Caching utilities
│   │   ├── main.py             # CLI & server entry point
│   │   └── tools/              # YouTube interaction tools
│   │       ├── search_videos.py
│   │       ├── fetch_transcript.py
│   │       ├── extract_metadata.py
│   │       └── summarize.py
│   └── requirements.txt
├── api/                         # Vercel serverless functions
│   ├── index.py                # FastAPI app for Vercel
│   └── requirements.txt
├── vercel.json                  # Vercel deployment config
├── .gitignore                  # Git exclusions
├── PRODUCTION_ENV.md           # Production environment guide
└── README.md                   # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Developed by **Said Ibrahim** — AI & Software Solutions Developer

- LinkedIn: [https://www.linkedin.com/in/sa-ibrahim](https://www.linkedin.com/in/sa-ibrahim)

## 🎨 UI Features

- **Sophisticated Logo**: Custom SVG logo with gradient and sparkle animations
- **Typing Effect**: Dynamic text animation for assistant responses
- **Markdown Rendering**: Full markdown support including tables, lists, links, and code blocks
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Processing Indicators**: Real-time feedback during AI processing
- **ChatGPT-like Interface**: Clean, modern chat interface with smooth animations

## 📦 Key Dependencies

### Backend (Python)
- `langchain` - AI agent framework
- `langchain-groq` - Groq integration
- `langchain-openai` - OpenAI integration
- `fastapi` - Web framework
- `pytube` - YouTube data extraction
- `youtube-transcript-api` - Transcript fetching
- `yt-dlp` - Enhanced YouTube tools
- `diskcache` - Response caching

### Frontend (Node.js)
- `react` & `react-dom` - UI framework
- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown (tables, etc.)
- `tailwindcss` - Utility-first CSS
- `typescript` - Type safety
- `vite` - Build tool and dev server

## 🙏 Acknowledgments

- **LangChain** - Amazing agent framework for LLM applications
- **Groq** - Free tier LLM API access
- **Cerebras** - Free 14,000+ requests/day for AI inference
- **Vercel** - Hosting infrastructure and serverless functions
- **FastAPI** - Modern Python web framework
- **React & Vite** - Frontend development stack

---

Made with ❤️ using LangChain, FastAPI, React, TypeScript, Tailwind CSS, and multiple LLM providers

