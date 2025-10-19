# 🚀 LegalIndia.ai - Production Deployment Guide

## 📋 Overview

This guide covers production deployment strategies for the LegalIndia.ai backend system, including Docker, cloud platforms, and monitoring setup.

## 🐳 Docker Deployment

### 1. Build Production Image

```bash
# Build optimized multi-stage image
docker build -f Dockerfile.optimized -t lindia-ai:latest .

# Build with specific tag
docker build -f Dockerfile.optimized -t lindia-ai:v2.0.0 .
```

### 2. Run Container

```bash
# Basic run
docker run -d \
  --name lindia-ai \
  -p 8000:8000 \
  -e RUNTIME_MODE=PROD \
  lindia-ai:latest

# With environment file
docker run -d \
  --name lindia-ai \
  -p 8000:8000 \
  --env-file .env.production \
  lindia-ai:latest
```

### 3. Docker Compose (Recommended)

```yaml
# docker-compose.yml
version: '3.8'

services:
  lindia-ai:
    build:
      context: .
      dockerfile: Dockerfile.optimized
    ports:
      - "8000:8000"
    environment:
      - RUNTIME_MODE=PROD
      - AI_ENGINE_URL=${AI_ENGINE_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - REDIS_URL=redis://redis:6379
      - SENTRY_DSN=${SENTRY_DSN}
    volumes:
      - ./logs:/app/logs
      - ./config:/app/config
    depends_on:
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/v2/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - lindia-ai
    restart: unless-stopped

volumes:
  redis_data:
```

### 4. Production Environment File

```bash
# .env.production
RUNTIME_MODE=PROD
HOST=0.0.0.0
PORT=8000
WORKERS=4

# AI Providers
AI_ENGINE_URL=https://your-ai-engine.com/api
OPENAI_API_KEY=sk-proj-your_openai_key
DEEPSEEK_API_KEY=your_deepseek_key
GROQ_API_KEY=your_groq_key

# Cache & Performance
CACHE_BACKEND=redis
REDIS_URL=redis://redis:6379
CACHE_TTL_SECONDS=600

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=1000
RATE_LIMIT_WINDOW_SECONDS=60

# Security
API_SECRET_KEY=your_super_secure_secret_key
JWT_SECRET=your_jwt_secret_key

# Monitoring
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
LOG_LEVEL=INFO

# Database (if using)
DATABASE_URL=postgresql://user:pass@db:5432/lindia_ai
```

## ☁️ Cloud Platform Deployments

### Railway Deployment

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and link project
railway login
railway link

# 3. Set environment variables
railway variables set RUNTIME_MODE=PROD
railway variables set OPENAI_API_KEY=your_key
railway variables set AI_ENGINE_URL=your_url

# 4. Deploy
railway up
```

**railway.json configuration:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python main.py",
    "healthcheckPath": "/api/v2/health",
    "healthcheckTimeout": 300
  }
}
```

### Heroku Deployment

```bash
# 1. Create Heroku app
heroku create lindia-ai-prod

# 2. Set environment variables
heroku config:set RUNTIME_MODE=PROD
heroku config:set OPENAI_API_KEY=your_key
heroku config:set AI_ENGINE_URL=your_url

# 3. Deploy
git push heroku main
```

**Procfile:**
```
web: python main.py
worker: python -m celery worker --app=celery_app
```

### AWS ECS Deployment

```yaml
# task-definition.json
{
  "family": "lindia-ai",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "lindia-ai",
      "image": "your-account.dkr.ecr.region.amazonaws.com/lindia-ai:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "RUNTIME_MODE", "value": "PROD"},
        {"name": "PORT", "value": "8000"}
      ],
      "secrets": [
        {"name": "OPENAI_API_KEY", "valueFrom": "arn:aws:secretsmanager:region:account:secret:openai-key"},
        {"name": "AI_ENGINE_URL", "valueFrom": "arn:aws:secretsmanager:region:account:secret:ai-engine-url"}
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8000/api/v2/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/lindia-ai",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Google Cloud Run

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/lindia-ai:$COMMIT_SHA', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/lindia-ai:$COMMIT_SHA']
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'lindia-ai'
      - '--image'
      - 'gcr.io/$PROJECT_ID/lindia-ai:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--set-env-vars'
      - 'RUNTIME_MODE=PROD,PORT=8080'
```

## 🔧 Nginx Configuration

```nginx
# nginx.conf
upstream lindia_ai {
    server lindia-ai:8000;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # API endpoints
    location /api/v2/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://lindia_ai;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }

    # Health checks
    location /api/v2/health {
        proxy_pass http://lindia_ai;
        access_log off;
    }

    # Static files (if any)
    location /static/ {
        alias /app/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📊 Monitoring and Observability

### 1. Health Checks

```bash
# Basic health check
curl -f http://localhost:8000/api/v2/health

# Detailed status
curl http://localhost:8000/api/v2/status

# Readiness probe
curl http://localhost:8000/api/v2/ready

# Liveness probe
curl http://localhost:8000/api/v2/live
```

### 2. Prometheus Metrics

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'lindia-ai'
    static_configs:
      - targets: ['lindia-ai:8000']
    metrics_path: '/api/v2/metrics'
    scrape_interval: 30s
```

### 3. Grafana Dashboard

```json
{
  "dashboard": {
    "title": "LegalIndia.ai Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(lindia_ai_requests_total[5m])",
            "legendFormat": "Requests/sec"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(lindia_ai_response_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Cache Hit Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(lindia_ai_cache_hits_total[5m]) / rate(lindia_ai_cache_requests_total[5m])",
            "legendFormat": "Hit Rate"
          }
        ]
      }
    ]
  }
}
```

### 4. Log Aggregation

```yaml
# fluentd.conf
<source>
  @type tail
  path /app/logs/app_*.log
  pos_file /var/log/fluentd/lindia-ai.log.pos
  tag lindia-ai
  format json
</source>

<match lindia-ai>
  @type elasticsearch
  host elasticsearch
  port 9200
  index_name lindia-ai-logs
  type_name _doc
</match>
```

## 🔒 Security Configuration

### 1. Environment Variables Security

```bash
# Use secrets management
# AWS Secrets Manager
aws secretsmanager create-secret \
  --name "lindia-ai/openai-key" \
  --description "OpenAI API Key" \
  --secret-string "sk-proj-your-key-here"

# Kubernetes Secrets
kubectl create secret generic lindia-ai-secrets \
  --from-literal=openai-api-key=sk-proj-your-key \
  --from-literal=ai-engine-url=https://your-engine.com/api
```

### 2. Network Security

```yaml
# kubernetes-network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: lindia-ai-network-policy
spec:
  podSelector:
    matchLabels:
      app: lindia-ai
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: nginx-ingress
    ports:
    - protocol: TCP
      port: 8000
  egress:
  - to: []
    ports:
    - protocol: TCP
      port: 443  # HTTPS outbound
    - protocol: TCP
      port: 80   # HTTP outbound
```

### 3. SSL/TLS Configuration

```bash
# Generate SSL certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Use Let's Encrypt
certbot certonly --nginx -d your-domain.com
```

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      - name: Run tests
        run: |
          python -m pytest tests/ -v
          python run_baseline_tests.py

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: |
          docker build -f Dockerfile.optimized -t lindia-ai:${{ github.sha }} .
      - name: Push to registry
        run: |
          docker tag lindia-ai:${{ github.sha }} your-registry/lindia-ai:${{ github.sha }}
          docker push your-registry/lindia-ai:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deploy to your platform
          kubectl set image deployment/lindia-ai lindia-ai=your-registry/lindia-ai:${{ github.sha }}
```

## 📈 Performance Optimization

### 1. Horizontal Scaling

```yaml
# kubernetes-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: lindia-ai-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: lindia-ai
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### 2. Load Balancing

```yaml
# kubernetes-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: lindia-ai-service
spec:
  selector:
    app: lindia-ai
  ports:
  - port: 80
    targetPort: 8000
    protocol: TCP
  type: LoadBalancer
```

### 3. Caching Strategy

```bash
# Redis Cluster Configuration
# redis-cluster.conf
port 7000
cluster-enabled yes
cluster-config-file nodes-7000.conf
cluster-node-timeout 5000
appendonly yes
appendfsync everysec
```

## 🔧 Troubleshooting

### 1. Common Deployment Issues

**Container Won't Start:**
```bash
# Check container logs
docker logs lindia-ai

# Check environment variables
docker exec lindia-ai env | grep -E "(RUNTIME_MODE|API_KEY)"

# Verify health endpoint
docker exec lindia-ai curl http://localhost:8000/api/v2/health
```

**Provider Connection Issues:**
```bash
# Test provider connectivity
curl -X POST http://localhost:8000/api/v2/providers/test \
  -H "Content-Type: application/json" \
  -d '{"provider": "openai"}'

# Check provider health
curl http://localhost:8000/api/v2/providers/openai/health
```

**Performance Issues:**
```bash
# Check metrics
curl http://localhost:8000/api/v2/metrics

# Monitor cache performance
curl http://localhost:8000/api/v2/cache/stats

# Check rate limiting
curl http://localhost:8000/api/v2/rate-limits/status
```

### 2. Rollback Strategy

```bash
# Kubernetes rollback
kubectl rollout undo deployment/lindia-ai

# Docker rollback
docker stop lindia-ai
docker run -d --name lindia-ai lindia-ai:previous-version

# Railway rollback
railway rollback
```

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All tests pass
- [ ] Environment variables configured
- [ ] SSL certificates ready
- [ ] Database migrations completed
- [ ] Monitoring setup complete

### Deployment
- [ ] Build successful
- [ ] Health checks pass
- [ ] All providers healthy
- [ ] Cache working
- [ ] Rate limiting active
- [ ] Logs flowing

### Post-Deployment
- [ ] Smoke tests pass
- [ ] Performance metrics normal
- [ ] Error rates acceptable
- [ ] Monitoring alerts configured
- [ ] Backup strategy in place

---

## 🎯 Production Readiness

Your LegalIndia.ai deployment is production-ready when:

✅ **All health checks pass**  
✅ **Providers are healthy and responding**  
✅ **Cache hit rate > 70%**  
✅ **Response times < 2 seconds**  
✅ **Error rate < 1%**  
✅ **Monitoring and alerting active**  
✅ **Security measures in place**  
✅ **Backup and recovery tested**

**🚀 You're ready for production traffic!**
