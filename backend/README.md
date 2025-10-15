# LegalIndia Backend API

Express.js backend service for LegalIndia - AI-powered legal research and assistance platform for Indian law.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)

## Overview

The LegalIndia backend is built with Express.js and TypeScript, providing AI-powered legal assistance endpoints:

- **Property Opinion**: Legal opinions for property matters
- **Legal Research**: AI-powered legal research using DeepSeek and InLegalBERT
- **Case Analysis**: Comprehensive case analysis and document drafting
- **Junior Assistant**: General legal assistance and document review

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Edit .env with your API keys

# Run development server
npm run dev
```

Server runs on `http://0.0.0.0:8080`

### Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t legalindia-backend .

# Run container
docker run -p 8080:8080 --env-file .env legalindia-backend
```

## API Endpoints

### Health Check

#### GET /
API information and health status

**Response:**
```json
{
  "success": true,
  "message": "LegalIndia Backend API",
  "version": "1.0.0",
  "status": "healthy",
  "timestamp": "2025-10-15T10:00:00.000Z"
}
```

#### GET /health
Detailed health check

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "uptime": 12345.67,
  "timestamp": "2025-10-15T10:00:00.000Z"
}
```

---

### Property Opinion

#### POST /property-opinion
Generate legal opinion for property matters

**Request Body:**
```json
{
  "propertyType": "Residential",
  "location": "Mumbai, Maharashtra",
  "issue": "Boundary dispute with neighbor",
  "details": "Neighbor constructed wall on my property",
  "documents": ["sale_deed.pdf", "survey_map.pdf"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "opinion": "Legal analysis and recommendations...",
    "confidence": 0.85,
    "propertyType": "Residential",
    "location": "Mumbai, Maharashtra",
    "timestamp": "2025-10-15T10:00:00.000Z"
  }
}
```

#### GET /property-opinion/templates
Get property opinion templates

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sale-deed",
      "name": "Sale Deed Review",
      "description": "Legal review of property sale deed",
      "propertyType": "Residential"
    }
  ]
}
```

---

### Research

#### POST /research
Perform AI-powered legal research

**Request Body:**
```json
{
  "query": "What are the legal requirements for property registration in India?",
  "model": "deepseek",
  "clientId": "client_123",
  "caseId": "case_456",
  "save": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "result": "Detailed legal research results...",
    "confidence": 0.85,
    "model": "deepseek",
    "query": "What are the legal requirements...",
    "timestamp": "2025-10-15T10:00:00.000Z"
  }
}
```

#### GET /research/history
Get research history (coming soon)

---

### Case Management

#### POST /case/analyze
Analyze legal case and provide insights

**Request Body:**
```json
{
  "caseTitle": "Property Dispute - Smith vs Jones",
  "caseType": "Civil - Property",
  "description": "Boundary dispute between neighbors",
  "parties": {
    "plaintiff": "John Smith",
    "defendant": "Robert Jones"
  },
  "facts": "Detailed case facts...",
  "legalIssues": ["Property boundary", "Adverse possession"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": "Comprehensive case analysis...",
    "confidence": 0.85,
    "caseTitle": "Property Dispute - Smith vs Jones",
    "caseType": "Civil - Property",
    "timestamp": "2025-10-15T10:00:00.000Z"
  }
}
```

#### POST /case/draft
Generate legal documents

**Request Body:**
```json
{
  "documentType": "Plaint",
  "caseTitle": "Property Dispute",
  "parties": {
    "plaintiff": "John Smith",
    "defendant": "Robert Jones"
  },
  "facts": "Detailed facts of the case...",
  "relief": "Recovery of property"
}
```

#### GET /case/templates
Get case document templates

---

### Junior Assistant

#### POST /junior
General legal assistance

**Request Body:**
```json
{
  "task": "Review this contract and highlight key clauses",
  "context": "Commercial lease agreement",
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assistance": "Detailed assistance and action items...",
    "confidence": 0.85,
    "task": "Review this contract...",
    "priority": "high",
    "timestamp": "2025-10-15T10:00:00.000Z"
  }
}
```

#### POST /junior/review
Review legal documents

**Request Body:**
```json
{
  "documentType": "Contract",
  "content": "Full document content...",
  "focusAreas": ["Termination clauses", "Payment terms"]
}
```

#### POST /junior/explain
Explain legal concepts

**Request Body:**
```json
{
  "concept": "Force Majeure",
  "detail": "simple"
}
```

#### GET /junior/tasks
Get common legal tasks

## Deployment

### Railway Deployment

1. **Create Railway Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   ```

2. **Set Environment Variables in Railway Dashboard**
   - `PORT` (automatically set by Railway)
   - `DEEPSEEK_API_KEY`
   - `HF_TOKEN`
   - `JWT_SECRET`
   - `PROMPT_BASE` (optional)
   - `NODE_ENV=production`

3. **Deploy**
   ```bash
   railway up
   ```

The service will automatically:
- Install dependencies
- Build TypeScript
- Start the server on `0.0.0.0:$PORT`

### Vercel Deployment

Not recommended for this backend. Use Railway or Docker instead.

### Docker Deployment

```bash
# Build image
docker build -t legalindia-backend .

# Run container
docker run -d \
  -p 8080:8080 \
  -e PORT=8080 \
  -e DEEPSEEK_API_KEY=your_key \
  -e HF_TOKEN=your_token \
  --name legalindia-backend \
  legalindia-backend
```

## Environment Variables

All environment variables are provided by Railway. Required variables:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 8080 |
| `NODE_ENV` | Environment | No | production |
| `HOST` | Server host | No | 0.0.0.0 |
| `CORS_ORIGIN` | CORS origin | No | * |
| `DEEPSEEK_API_KEY` | DeepSeek API key | Yes | - |
| `HF_TOKEN` | Hugging Face token | Yes | - |
| `JWT_SECRET` | JWT secret key | Yes | - |
| `PROMPT_BASE` | Base AI prompt | No | Default prompt |

### Setting Variables on Railway

1. Go to Railway Dashboard
2. Select your project
3. Go to Variables tab
4. Add environment variables
5. Redeploy

## Architecture

### Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main Express server
│   ├── middleware/
│   │   ├── auth.ts           # JWT authentication
│   │   ├── error-handler.ts  # Error handling
│   │   └── logger.ts         # Request logging
│   ├── routes/
│   │   ├── property-opinion.ts
│   │   ├── research.ts
│   │   ├── case.ts
│   │   └── junior.ts
│   └── services/
│       └── ai-service.ts     # AI model integration
├── dist/                      # Compiled JavaScript
├── package.json
├── tsconfig.json
├── Dockerfile
├── railway.json
└── README.md
```

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Language**: TypeScript 5+
- **Validation**: Zod
- **AI Models**: DeepSeek, InLegalBERT
- **Security**: Helmet, CORS
- **Compression**: gzip

### Error Handling

All responses follow consistent format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ]
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=sqlite:./data.sqlite

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI Services
DEEPSEEK_API_KEY=your-deepseek-api-key
HF_TOKEN=your-huggingface-token

# System Settings
PROMPT_BASE=Your base prompt for AI research
```

## Development

### Development Workflow

```bash
# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Build TypeScript
npm run build

# Run production build locally
npm start

# Lint code
npm run lint
```

### Testing Endpoints

```bash
# Health check
curl http://localhost:8080/health

# Property opinion
curl -X POST http://localhost:8080/property-opinion \
  -H "Content-Type: application/json" \
  -d '{
    "propertyType": "Residential",
    "location": "Mumbai",
    "issue": "Boundary dispute"
  }'

# Legal research
curl -X POST http://localhost:8080/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are property laws in India?",
    "model": "deepseek"
  }'
```

## Security

- **Helmet.js**: Security headers
- **CORS**: Configurable origin
- **Input Validation**: Zod schema validation
- **Error Handling**: No sensitive data in errors
- **JWT Authentication**: Optional auth middleware
- **Rate Limiting**: Coming soon

## Monitoring

- Request logging with timestamps
- Error logging with stack traces
- Performance metrics (request duration)
- Health check endpoint for uptime monitoring

## Support

For issues or questions:
1. Check logs in Railway dashboard
2. Verify environment variables are set
3. Check API key validity
4. Review request/response format

## License

Proprietary - LegalIndia 2025
