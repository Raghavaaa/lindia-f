# AI Law Junior - Legal Research Assistant

A comprehensive legal research platform for Indian lawyers with AI-powered research capabilities.

## Features
- Google OAuth authentication
- Client management system
- AI-powered legal research (InLegalBERT + DeepSeek)
- Research query saving and management
- Directory and subdirectory organization
- Modern, responsive UI

## Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

## Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Railway Deployment

### Required Environment Variables:
```
# API Keys
HF_TOKEN=your_huggingface_token
DEEPSEEK_API_KEY=your_deepseek_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=your_random_secret

# Optional
ADMIN_SECRET=your_admin_password
```

### Deployment Steps:
1. Connect GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Railway will auto-deploy on git push

## API Endpoints
- `GET /api/health` - Health check
- `POST /api/research` - Legal research queries
- `GET /api/research/saved` - Saved research
- `POST /api/user/profile` - Update user profile
- `POST /api/admin/updatePrompt` - Admin prompt management

## Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- NextAuth.js
- SQLite
- Railway (deployment)
