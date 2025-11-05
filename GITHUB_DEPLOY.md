# GitHub Deployment Instructions

## ✅ Files Prepared for GitHub

All sensitive files and unnecessary dependencies have been excluded via `.gitignore`:

- ✅ `.env` files (excluded)
- ✅ `node_modules` (excluded)
- ✅ `.cache/` (excluded)
- ✅ `__pycache__/` (excluded)
- ✅ `.venv/` (excluded)
- ✅ Build artifacts (excluded)

## 📋 Pre-Deployment Checklist

- [x] `.gitignore` configured
- [x] `vercel.json` configured for frontend + API
- [x] CORS configured for Vercel deployment
- [x] `.env.example` created (template for environment variables)
- [x] API serverless function configured (`api/index.py` with Mangum)
- [x] Frontend API service configured for production

## 🚀 Deployment Steps

### Step 1: Initialize Git Repository

```bash
git init
git branch -M main
```

### Step 2: Add All Files (excluding sensitive ones)

```bash
git add .
```

This will automatically exclude:
- `.env` files
- `node_modules/`
- `.cache/`
- `__pycache__/`
- `.venv/`
- Build artifacts

### Step 3: Commit Files

```bash
git commit -m "Initial commit: YouTube Agent with Vite frontend and FastAPI backend"
```

### Step 4: Add Remote and Push

```bash
git remote add origin https://github.com/SaidIbraahim/youtube-search-agent.git
git push -u origin main
```

## 🔒 Security Notes

**IMPORTANT**: Before pushing, verify these files are NOT in the repository:

```bash
# Check what will be committed
git status

# Verify .env is excluded
git check-ignore .env
git check-ignore youtube_agent/.env
```

## 📝 Environment Variables Setup

After deploying to Vercel, configure these environment variables in the Vercel Dashboard:

### Required:
- `GROQ_API_KEY`: Your Groq API key
- `LLM_PROVIDER`: `groq`

### Optional (for CORS):
- `FRONTEND_URL`: Your Vercel frontend URL
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins
- `ALLOW_ALL_ORIGINS`: `true` for flexible deployment

## 🌐 Vercel Configuration

The `vercel.json` file is already configured with:
- Frontend build settings
- API serverless function routing
- CORS headers
- Security headers

## 📚 Next Steps After GitHub Push

1. **Connect to Vercel**:
   - Go to https://vercel.com/dashboard
   - Import your GitHub repository
   - Configure environment variables

2. **Deploy**:
   - Vercel will auto-deploy on push to `main`
   - Or manually trigger deployment from dashboard

3. **Verify**:
   - Check frontend loads correctly
   - Test API endpoints
   - Verify CORS is working

## 🐛 Troubleshooting

If you see files that shouldn't be committed:
```bash
# Remove from git cache (but keep locally)
git rm --cached <file>
git commit -m "Remove sensitive file"
```

If `.env` is accidentally committed:
```bash
# Remove from history (if not pushed yet)
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all
```

## 📖 Additional Resources

- See `DEPLOYMENT.md` for detailed Vercel deployment guide
- See `youtube_agent/.env.example` for environment variable template

