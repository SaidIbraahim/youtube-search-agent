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

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI**: LangChain with Groq/OpenAI/Ollama
- **Deployment**: Vercel-ready configuration

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- API keys (Groq, OpenAI, or Ollama)

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

### LLM Provider

Set `LLM_PROVIDER` in `.env`:
- `groq` (default, free tier available)
- `openai`
- `ollama` (local)

### API Keys

Required environment variables:
- `GROQ_API_KEY`: Your Groq API key
- `OPENAI_API_KEY`: (if using OpenAI)
- `OLLAMA_BASE_URL`: (if using Ollama)

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
├── frontend/          # React + TypeScript frontend
├── youtube_agent/     # Python backend
│   ├── app/
│   │   ├── agent.py   # LangChain agent
│   │   ├── api.py     # FastAPI endpoints
│   │   └── tools/     # YouTube tools
│   └── requirements.txt
├── api/               # Vercel serverless functions
├── vercel.json        # Vercel configuration
└── .gitignore         # Git exclusions

```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Developed by **Said Ibrahim** — AI & Software Solutions Developer

- LinkedIn: [https://www.linkedin.com/in/sa-ibrahim](https://www.linkedin.com/in/sa-ibrahim)

## 🙏 Acknowledgments

- LangChain for the amazing agent framework
- Groq for providing free LLM API access
- Vercel for hosting infrastructure

---

Made with ❤️ using LangChain, FastAPI, React, and Tailwind CSS

