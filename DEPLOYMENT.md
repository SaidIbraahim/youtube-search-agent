# Deployment Guide

This guide explains how to deploy the YouTube Agent to Vercel.

## Prerequisites

1. GitHub account
2. Vercel account (free tier available)
3. API keys:
   - Groq API key (free tier available at https://console.groq.com/)
   - Or OpenAI API key
   - Or Ollama (for local deployment)

## Project Structure for Vercel

- **Frontend**: Deployed as a Vite/React application
- **Backend API**: Deployed as Vercel serverless functions (in `/api` directory)

## Step 1: Prepare for GitHub

1. **Ensure sensitive files are excluded**:
   - `.env` files are already in `.gitignore`
   - Cache files are excluded
   - `node_modules` are excluded

2. **Initialize Git** (if not already):
   ```bash
   git init
   git branch -M main
   ```

3. **Add and commit files**:
   ```bash
   git add .
   git commit -m "Initial commit: YouTube Agent with Vite frontend and FastAPI backend"
   ```

4. **Add remote and push**:
   ```bash
   git remote add origin https://github.com/SaidIbraahim/youtube-search-agent.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

## Step 3: Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

### Required Variables:
- `GROQ_API_KEY`: Your Groq API key
- `LLM_PROVIDER`: `groq` (or `openai`, `ollama`)

### Optional Variables (for CORS):
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins
- `FRONTEND_URL`: Your Vercel frontend URL
- `ALLOW_ALL_ORIGINS`: Set to `true` for flexible deployment (default: `false`)

### Example:
```
GROQ_API_KEY=your_groq_api_key_here
LLM_PROVIDER=groq
FRONTEND_URL=https://your-app.vercel.app
ALLOW_ALL_ORIGINS=true
```

## Step 4: Deploy Backend API (Serverless Functions)

The backend API is configured in `/api/index.py` and will be automatically deployed as a serverless function.

**Note**: Vercel serverless functions have execution time limits. For heavy operations, consider:
- Using a separate backend service (Railway, Render, etc.)
- Optimizing API calls and caching
- Using streaming responses

## Step 5: Update Frontend API URL

The frontend automatically detects the production environment. If you need to override:

1. In Vercel Dashboard → Environment Variables:
   - Add `VITE_API_URL` with your API endpoint (e.g., `https://your-api.vercel.app/api`)

2. Or update `frontend/src/services/api.ts` to use the correct API endpoint.

## CORS Configuration

CORS is automatically configured to:
- Allow localhost origins in development
- Allow Vercel URLs (production/preview)
- Support custom origins via `ALLOWED_ORIGINS` environment variable

For maximum flexibility in production, set:
```
ALLOW_ALL_ORIGINS=true
```

## Troubleshooting

### Frontend not loading
- Check build logs in Vercel Dashboard
- Verify `outputDirectory` is set to `frontend/dist`
- Check browser console for errors

### API not responding
- Check serverless function logs in Vercel Dashboard
- Verify environment variables are set correctly
- Check CORS configuration matches your frontend URL

### Rate limit errors
- Check your Groq API quota
- Upgrade to a higher tier if needed
- Consider implementing request queuing

## Production Checklist

- [ ] All `.env` files excluded from Git
- [ ] Environment variables configured in Vercel
- [ ] CORS properly configured
- [ ] Frontend builds successfully
- [ ] API endpoints responding correctly
- [ ] Error handling working
- [ ] Cache working properly

## Support

For issues or questions, please open an issue on GitHub.
