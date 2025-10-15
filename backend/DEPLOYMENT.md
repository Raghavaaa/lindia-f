# LegalIndia Backend - Deployment Guide

Complete deployment guide for Railway, Docker, and other platforms.

## Quick Deploy to Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository with your code
- API keys (DeepSeek, Hugging Face)

### Steps

1. **Connect to Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `/backend` folder as root (if needed)

2. **Configure Environment Variables**
   
   Go to your project → Variables tab and add:
   
   ```
   PORT=8080
   NODE_ENV=production
   DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
   HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx
   JWT_SECRET=your-secure-random-string-here
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

3. **Configure Build Settings**
   
   Railway will auto-detect the Node.js project. The `railway.json` file configures:
   - Build command: `npm ci && npm run build`
   - Start command: `npm start`
   - Health check: `/health`

4. **Deploy**
   
   - Click "Deploy"
   - Railway will automatically build and deploy
   - Wait for deployment to complete
   - Your API will be available at: `https://your-app.railway.app`

5. **Verify Deployment**
   
   ```bash
   # Check health
   curl https://your-app.railway.app/health
   
   # Test an endpoint
   curl -X POST https://your-app.railway.app/research \
     -H "Content-Type: application/json" \
     -d '{"query": "What is Indian Contract Act?", "model": "deepseek"}'
   ```

## Docker Deployment

### Build and Run Locally

```bash
# Build the image
docker build -t legalindia-backend .

# Run container
docker run -d \
  -p 8080:8080 \
  -e PORT=8080 \
  -e NODE_ENV=production \
  -e DEEPSEEK_API_KEY=your_key \
  -e HF_TOKEN=your_token \
  -e JWT_SECRET=your_secret \
  --name legalindia-backend \
  legalindia-backend

# Check logs
docker logs -f legalindia-backend

# Stop container
docker stop legalindia-backend

# Remove container
docker rm legalindia-backend
```

### Using Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - NODE_ENV=production
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - HF_TOKEN=${HF_TOKEN}
      - JWT_SECRET=${JWT_SECRET}
      - CORS_ORIGIN=${CORS_ORIGIN:-*}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Run with:

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Deploy to VPS (Ubuntu/Debian)

### 1. Install Node.js

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Clone and Setup

```bash
# Clone repository
git clone https://github.com/your-repo/legalindia.git
cd legalindia/backend

# Install dependencies
npm ci

# Create .env file
nano .env
# Add your environment variables

# Build
npm run build

# Test run
npm start
```

### 3. Setup PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start npm --name "legalindia-backend" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown

# Monitor
pm2 monit

# View logs
pm2 logs legalindia-backend
```

### 4. Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt-get install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/legalindia-backend
```

Add configuration:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and start:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/legalindia-backend /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 5. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DEEPSEEK_API_KEY` | DeepSeek AI API key | `sk-abc123...` |
| `HF_TOKEN` | Hugging Face API token | `hf_xyz789...` |
| `JWT_SECRET` | Secret for JWT signing | `your-secret-key-min-32-chars` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment | `production` |
| `HOST` | Server host | `0.0.0.0` |
| `CORS_ORIGIN` | Allowed CORS origin | `*` |
| `PROMPT_BASE` | Base AI prompt | Default prompt |

## Monitoring and Logging

### Railway Logs

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs

# View logs in real-time
railway logs --follow
```

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs legalindia-backend

# View specific log lines
pm2 logs legalindia-backend --lines 100

# Clear logs
pm2 flush
```

### Docker Logs

```bash
# View logs
docker logs legalindia-backend

# Follow logs
docker logs -f legalindia-backend

# Last 100 lines
docker logs --tail 100 legalindia-backend
```

## Health Checks

The API provides health check endpoints:

```bash
# Basic health check
curl https://your-api.com/health

# API info
curl https://your-api.com/
```

Expected response:

```json
{
  "success": true,
  "status": "healthy",
  "uptime": 12345.67,
  "timestamp": "2025-10-15T10:00:00.000Z"
}
```

## Troubleshooting

### Issue: API returns 500 errors

**Solution:**
1. Check environment variables are set correctly
2. Verify API keys are valid
3. Check logs for specific error messages

```bash
# Railway
railway logs

# PM2
pm2 logs legalindia-backend

# Docker
docker logs legalindia-backend
```

### Issue: Cannot connect to API

**Solution:**
1. Verify service is running
2. Check firewall settings
3. Ensure correct PORT is exposed

```bash
# Check if port is listening
sudo netstat -tulpn | grep 8080

# Check process
ps aux | grep node
```

### Issue: Out of memory

**Solution:**
1. Increase memory limit in Railway/Docker
2. Monitor memory usage
3. Restart service

```bash
# PM2 - Set memory limit
pm2 start npm --name "legalindia-backend" --max-memory-restart 500M -- start

# Docker - Set memory limit
docker run -d --memory="512m" ...
```

### Issue: API keys not working

**Solution:**
1. Verify keys are correct
2. Check API key quotas/limits
3. Test keys directly

```bash
# Test DeepSeek API
curl https://api.deepseek.com/chat/completions \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"test"}]}'

# Test Hugging Face API
curl https://api-inference.huggingface.co/models/law-ai/InLegalBERT \
  -H "Authorization: Bearer $HF_TOKEN" \
  -d '{"inputs":"test"}'
```

## Scaling

### Railway

Railway automatically scales based on traffic. To configure:

1. Go to Settings → Resources
2. Adjust memory and CPU limits
3. Enable autoscaling if needed

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Create service
docker service create \
  --name legalindia-backend \
  --replicas 3 \
  --publish 8080:8080 \
  legalindia-backend

# Scale up
docker service scale legalindia-backend=5

# Scale down
docker service scale legalindia-backend=2
```

### Kubernetes

Basic deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: legalindia-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: legalindia-backend
  template:
    metadata:
      labels:
        app: legalindia-backend
    spec:
      containers:
      - name: backend
        image: legalindia-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: PORT
          value: "8080"
        - name: DEEPSEEK_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: deepseek
        - name: HF_TOKEN
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: huggingface
```

## Backup and Recovery

### Configuration Backup

```bash
# Backup environment variables
cp .env .env.backup

# Backup Railway config
railway variables > railway-vars-backup.txt
```

### Database Backup (if applicable)

Not currently used, but if you add a database:

```bash
# PostgreSQL
pg_dump database_name > backup.sql

# SQLite
cp database.sqlite database.sqlite.backup
```

## Security Best Practices

1. **API Keys**: Never commit API keys to version control
2. **CORS**: Set specific origins in production (not `*`)
3. **Rate Limiting**: Implement rate limiting for production
4. **HTTPS**: Always use HTTPS in production
5. **Monitoring**: Set up error tracking (Sentry, etc.)
6. **Updates**: Keep dependencies updated

## Performance Optimization

1. **Caching**: Implement response caching for repeated queries
2. **Compression**: Already enabled (gzip)
3. **CDN**: Use CDN for static assets
4. **Database**: Add database connection pooling if needed
5. **Monitoring**: Use APM tools (New Relic, DataDog)

## Support

For deployment issues:
- Check Railway documentation: https://docs.railway.app
- Review Docker documentation: https://docs.docker.com
- Check application logs first
- Verify environment variables
- Test API endpoints manually

