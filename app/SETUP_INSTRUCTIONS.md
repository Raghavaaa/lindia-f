# 🚀 LegalIndia.ai - Complete Setup Instructions

## 📋 Overview

This repository contains a production-ready AI backend with:
- **Multi-Provider Abstraction Layer** (AI Engine, OpenAI, DeepSeek, Groq, Mock)
- **Structured Response Pipeline** (5-stage processing)
- **Comprehensive Testing Framework** 
- **Advanced Observability** (logging, metrics, health checks)
- **Enterprise-Grade Security** (prompt injection detection, rate limiting)

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client API    │───▶│  Provider Manager│───▶│   AI Providers  │
│                 │    │                  │    │                 │
│ /api/v2/infer   │    │ • Dynamic Switch │    │ • AI Engine     │
│ /api/v2/health  │    │ • Failover Logic │    │ • OpenAI        │
│ /api/v2/manage  │    │ • Health Checks  │    │ • DeepSeek      │
└─────────────────┘    └──────────────────┘    │ • Groq          │
                                               │ • Mock (local)  │
                                               └─────────────────┘
```

## 🔧 Prerequisites

- **Python 3.8+**
- **pip** package manager
- **Git** for version control
- **Environment Variables** (API keys, configuration)

## 📦 Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/Raghavaaa/lindia-ai.git
cd lindia-ai
```

### Step 2: Install Dependencies
```bash
# Install core dependencies
pip install -r requirements.txt

# For development/testing
pip install -r requirements-dev.txt
```

### Step 3: Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

### Step 4: Required Environment Variables

```bash
# Runtime Configuration
RUNTIME_MODE=LOCAL                    # LOCAL or PROD
API_SECRET_KEY=your_secret_key_here
JWT_SECRET=your_jwt_secret_here

# AI Engine (Primary Provider)
AI_ENGINE_URL=https://your-ai-engine.com/api

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_key_here
OPENAI_MODEL=gpt-4

# DeepSeek Configuration  
DEEPSEEK_API_KEY=your_deepseek_key_here
DEEPSEEK_MODEL=deepseek-chat

# Groq Configuration
GROQ_API_KEY=your_groq_key_here
GROQ_MODEL=llama3-70b-8192

# Cache & Performance
CACHE_BACKEND=memory                  # memory or redis
CACHE_TTL_SECONDS=300
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60

# Observability
LOG_LEVEL=INFO
SENTRY_DSN=your_sentry_dsn_here
```

## 🚀 Quick Start

### Development Mode (Local)
```bash
# Start with mock providers (no API keys needed)
RUNTIME_MODE=LOCAL python main.py

# Server will start on http://localhost:8000
```

### Production Mode
```bash
# Start with real providers
RUNTIME_MODE=PROD python main.py

# Server will start on configured host/port
```

## 🧪 Testing

### Run Test Suite
```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test categories
python -m pytest tests/test_providers.py -v
python -m pytest tests/test_pipeline.py -v
python -m pytest tests/test_cache.py -v
python -m pytest tests/test_rate_limiter.py -v
```

### Manual Testing
```bash
# Run baseline health checks
python run_baseline_tests.py

# Test specific endpoints
curl http://localhost:8000/api/v2/health
curl http://localhost:8000/api/v2/status
curl http://localhost:8000/api/v2/metrics
```

## 📊 API Endpoints

### Core Inference
```bash
POST /api/v2/inference
Content-Type: application/json

{
  "query": "What are the legal requirements for property registration?",
  "tenant_id": "client_123",
  "provider_override": "openai",
  "max_tokens": 1000
}
```

### Health & Monitoring
```bash
GET /api/v2/health          # Basic health check
GET /api/v2/status          # Detailed system status  
GET /api/v2/metrics         # Performance metrics
GET /api/v2/ready           # Readiness probe
GET /api/v2/live            # Liveness probe
```

### Provider Management
```bash
GET /api/v2/providers                    # List all providers
POST /api/v2/providers/switch            # Switch active provider
GET /api/v2/providers/{provider}/health  # Provider health check
```

### Cache Management
```bash
GET /api/v2/cache/stats     # Cache statistics
DELETE /api/v2/cache/clear  # Clear cache
```

## 🔒 Security Features

### Prompt Injection Detection
- Automatic detection of malicious prompts
- Neutralization of injection attempts
- Audit logging of suspicious inputs

### Rate Limiting
- Per-tenant rate limiting
- Configurable request limits
- Automatic blocking of abusive clients

### Input Validation
- Strict schema validation
- Length and format checks
- Sanitization of user inputs

## 📈 Performance Features

### Caching
- In-memory caching for identical requests
- Redis integration for distributed caching
- Configurable TTL settings

### Circuit Breakers
- Automatic provider failover
- Health-based provider selection
- Graceful degradation

### Monitoring
- Request/response logging
- Performance metrics collection
- Error tracking and alerting

## 🐳 Docker Deployment

### Build Image
```bash
# Build optimized production image
docker build -f Dockerfile.optimized -t lindia-ai:latest .
```

### Run Container
```bash
# Run with environment variables
docker run -d \
  --name lindia-ai \
  -p 8000:8000 \
  -e RUNTIME_MODE=PROD \
  -e OPENAI_API_KEY=your_key \
  lindia-ai:latest
```

### Docker Compose
```yaml
version: '3.8'
services:
  lindia-ai:
    build: .
    ports:
      - "8000:8000"
    environment:
      - RUNTIME_MODE=PROD
      - AI_ENGINE_URL=${AI_ENGINE_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./logs:/app/logs
```

## 🔧 Configuration Options

### Provider Configuration
```python
# providers/config.py
PROVIDER_CONFIGS = [
    {
        "name": "ai_engine",
        "type": "ai_engine",
        "priority": 1,
        "enabled": True,
        "config": {
            "base_url": "https://your-ai-engine.com/api",
            "timeout": 30,
            "retry_attempts": 3
        }
    },
    {
        "name": "openai",
        "type": "openai", 
        "priority": 2,
        "enabled": True,
        "config": {
            "model": "gpt-4",
            "max_tokens": 2000,
            "temperature": 0.7
        }
    }
]
```

### Pipeline Configuration
```python
# pipeline/config.py
PIPELINE_CONFIG = {
    "sanitization": {
        "enabled": True,
        "max_length": 10000,
        "injection_detection": True
    },
    "retrieval": {
        "enabled": False,
        "vector_store": "memory",
        "top_k": 5
    },
    "post_processing": {
        "extract_citations": True,
        "generate_summary": True,
        "quality_scoring": True
    }
}
```

## 🚨 Troubleshooting

### Common Issues

**1. Provider Connection Failed**
```bash
# Check provider health
curl http://localhost:8000/api/v2/providers/ai_engine/health

# Verify API keys
echo $OPENAI_API_KEY
echo $DEEPSEEK_API_KEY
```

**2. Cache Issues**
```bash
# Clear cache
curl -X DELETE http://localhost:8000/api/v2/cache/clear

# Check cache stats
curl http://localhost:8000/api/v2/cache/stats
```

**3. Rate Limiting**
```bash
# Check rate limit status
curl http://localhost:8000/api/v2/metrics | grep rate_limit

# Adjust limits in .env
RATE_LIMIT_REQUESTS=200
```

### Logs and Debugging

**View Logs**
```bash
# Application logs
tail -f logs/app_$(date +%Y-%m-%d).log

# Docker logs
docker logs -f lindia-ai
```

**Debug Mode**
```bash
# Enable debug logging
LOG_LEVEL=DEBUG python main.py

# Verbose test output
python -m pytest tests/ -v -s
```

## 📚 Additional Resources

- **API Documentation**: `/docs` (Swagger UI when server running)
- **Test Reports**: `reports/ai_testing_report_20251019.md`
- **Architecture Guide**: `docs/architecture.md`
- **Deployment Guide**: `docs/deployment.md`
- **Security Guide**: `docs/security.md`

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review logs for error details
3. Run health checks to identify problems
4. Check GitHub issues for known problems

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Server starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] At least one provider is healthy
- [ ] Test inference request succeeds
- [ ] Cache is working (check stats)
- [ ] Rate limiting is active
- [ ] Logs are being generated
- [ ] Metrics endpoint returns data

**🎉 You're ready to use LegalIndia.ai!**
