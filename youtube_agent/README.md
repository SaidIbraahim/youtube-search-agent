# YouTube Agent (Recursive Tool-Calling) - FREE Cloud by default (Groq)

Project structure follows `project-structure.md`. This agent searches YouTube, fetches transcripts, gets trending content and metadata, and generates summaries using a recursive chain flow (runs in cloud by default - no local heavy models required).

## 🏗️ Architecture

- **Backend**: Python + FastAPI (REST API)
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **AI**: LangChain with recursive tool-calling
- **LLM**: Groq (free cloud) by default

## 📦 Setup

### Backend Setup (Groq - Free cloud)

1. Get a free Groq API key
   - Create an account at: https://console.groq.com/
   - Create an API key and copy it

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file (next to this README):
   ```
   LLM_PROVIDER=groq
   GROQ_API_KEY=your_groq_api_key_here
   LLM_MODEL=llama-3.3-70b-versatile
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Usage

### Web Interface (Recommended)

**Start Backend:**
```bash
python -m youtube_agent.app.main --api
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

Then open your browser to `http://localhost:5173`

**Features:**
- ✨ Beautiful, modern UI with Tailwind CSS
- 📱 Fully responsive (mobile, tablet, desktop)
- 💬 Real-time chat interface
- 📝 Example queries
- 🔗 Clickable YouTube links
- ⚡ Fast and responsive

### CLI Mode (Single Query)
```bash
python -m youtube_agent.app.main "Summarize this video: https://www.youtube.com/watch?v=T-D1OfcDW1M in English"
```

### REST API (FastAPI)

Launch the FastAPI server:
```bash
python -m youtube_agent.app.main --api
```

Then access:
- **Frontend**: `http://localhost:5173` (if running)
- **API docs**: `http://localhost:8000/docs`
- **Health check**: `http://localhost:8000/health`

**API Endpoints:**
- `POST /query` - Process single query
- `POST /batch` - Process multiple queries
- `GET /cache/stats` - Get cache statistics
- `POST /cache/clear` - Clear cache

See `LAUNCH.md` for detailed launch instructions.

Optional: Local (Ollama) fallback
- If you want to run locally later, install Ollama and set:
  ```
  LLM_PROVIDER=ollama
  OLLAMA_MODEL=llama3.2
  ```

Notes
- Default provider is Groq (free cloud). No heavy local models required.
- No debug prints/logs are emitted; external library logs are suppressed.


