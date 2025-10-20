# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Backend API URL (no trailing slash)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Environment
NEXT_PUBLIC_ENV=development

# Optional: API timeout in milliseconds
NEXT_PUBLIC_API_TIMEOUT=30000
```

## Production

For production, set `NEXT_PUBLIC_BACKEND_URL` to your actual FastAPI backend URL:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_ENV=production
```

## Important Notes

- Never hardcode URLs in your components
- Always use the environment variables through the config file
- The `.env.local` file is gitignored and should never be committed

