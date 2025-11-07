# Production Environment Variables Guide

This document outlines the environment variables needed for deploying the YouTube Agent to Vercel.

## Required Environment Variables

### LLM Provider Configuration

#### Option 1: Cerebras (Recommended - Free 14,000+ requests/day)
```bash
LLM_PROVIDER=cerebras
CEREBRAS_API_KEY=your_cerebras_api_key_here
CEREBRAS_BASE_URL=https://api.cerebras.ai/v1
LLM_MODEL=gpt-oss-120b
```

#### Option 2: Groq (Free tier available)
```bash
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
LLM_MODEL=llama-3.3-70b-versatile
```

#### Option 3: OpenAI
```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4o-mini
```

#### Option 4: Bytez
```bash
LLM_PROVIDER=bytez
BYTEZ_API_KEY=your_bytez_api_key_here
BYTEZ_BASE_URL=https://api.bytez.com/openai/v1
LLM_MODEL=gpt-4o-mini
```

## Optional Environment Variables

### CORS Configuration
Vercel automatically sets `VERCEL_URL` and `VERCEL_ENV` - you don't need to set these manually.

If you need to allow additional origins:
```bash
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://another-domain.com
```

### Frontend URL (Optional)
```bash
FRONTEND_URL=https://your-app.vercel.app
```

### Allow All Origins (Development Only)
```bash
ALLOW_ALL_ORIGINS=false
```
**⚠️ Warning:** Set to `false` in production for security.

## Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with the appropriate value
4. Select the environment (Production, Preview, Development)
5. Click **Save**

## Vercel Automatic Variables

Vercel automatically provides these variables (no need to set manually):
- `VERCEL_URL` - Your deployment URL (e.g., `your-app.vercel.app`)
- `VERCEL_ENV` - Environment type (`production`, `preview`, `development`)

## Production Checklist

- [ ] Set `LLM_PROVIDER` to your chosen provider
- [ ] Set the corresponding API key for your provider
- [ ] Set `LLM_MODEL` (optional, defaults are provided)
- [ ] Verify `ALLOW_ALL_ORIGINS=false` for security
- [ ] Test the deployment after setting variables
- [ ] Verify API endpoints are accessible

## Example: Cerebras Production Setup

```bash
# Required
LLM_PROVIDER=cerebras
CEREBRAS_API_KEY=cb_xxxxxxxxxxxxx
CEREBRAS_BASE_URL=https://api.cerebras.ai/v1

# Optional (with defaults)
LLM_MODEL=gpt-oss-120b
ALLOW_ALL_ORIGINS=false
```

## Security Notes

1. **Never commit `.env` files** - They are automatically excluded via `.gitignore`
2. **Use Vercel's environment variables** - They are encrypted and secure
3. **Rotate API keys regularly** - Update them in Vercel dashboard
4. **Use different keys for production and preview** - Set different values per environment

## Troubleshooting

### API returns HTML instead of JSON
- Check that your API key is correct
- Verify the API endpoint URL is correct
- Ensure the LLM provider is properly configured

### CORS errors in production
- Verify `VERCEL_URL` is automatically set by Vercel
- Check `ALLOWED_ORIGINS` if you set it manually
- Ensure `ALLOW_ALL_ORIGINS=false` for security

### Rate limit errors
- Check your API provider's rate limits
- Consider upgrading to a higher tier
- Implement request caching (already enabled)

