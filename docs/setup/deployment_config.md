# Deployment Configuration Guide

## Overview
Complete deployment setup for Agent M across all services.

---

## 1. FRONTEND DEPLOYMENT (Vercel)

### Prerequisites:
- GitHub repository connected
- Vercel account created

### Steps:

#### 1.1 Install Vercel CLI
```bash
npm install -g vercel
```

#### 1.2 Configure Vercel Project
```bash
cd frontend
vercel login
vercel
```

Follow prompts:
- Link to existing project or create new
- Set root directory: `frontend/`
- Build command: `npm run build`
- Output directory: `.next`

#### 1.3 Environment Variables

In Vercel Dashboard > Settings > Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_API_URL=https://your-backend-url.fly.dev
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1234567890-abc123.apps.googleusercontent.com
```

#### 1.4 Production Deployment
```bash
vercel --prod
```

### Custom Domain Setup:
1. In Vercel Dashboard > Domains
2. Add your domain
3. Configure DNS records as instructed
4. Update OAuth redirect URLs in Google Console

---

## 2. BACKEND DEPLOYMENT (Fly.io)

### Prerequisites:
- Fly.io account created
- Fly CLI installed

### Steps:

#### 2.1 Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

#### 2.2 Login and Initialize
```bash
fly auth login
cd backend
fly launch
```

#### 2.3 Create `fly.toml` Configuration
```toml
# backend/fly.toml
app = "agent-m-backend"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8000"
  PYTHON_VERSION = "3.11"

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 1024

[checks]
  [checks.alive]
    grace_period = "30s"
    interval = "15s"
    method = "GET"
    path = "/health"
    port = 8000
    timeout = "10s"
    type = "http"
```

#### 2.4 Create Dockerfile
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 2.5 Set Environment Secrets
```bash
fly secrets set \
  SUPABASE_URL="https://your-project-id.supabase.co" \
  SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..." \
  SUPABASE_JWT_SECRET="your-jwt-secret" \
  ENCRYPTION_KEY="your-encryption-key" \
  OPENAI_API_KEY="sk-..." \
  DATABASE_URL="postgresql://..."
```

#### 2.6 Deploy
```bash
fly deploy
```

#### 2.7 Check Status
```bash
fly status
fly logs
```

---

## 3. ALTERNATIVE: BACKEND ON RENDER

### Steps:

#### 3.1 Create Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository

#### 3.2 Configure Service
```
Name: agent-m-backend
Environment: Python 3
Region: Oregon (US West)
Branch: main
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Instance Type: Free
```

#### 3.3 Environment Variables
Add in Render Dashboard:
```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_JWT_SECRET=...
ENCRYPTION_KEY=...
OPENAI_API_KEY=...
DATABASE_URL=...
PYTHON_VERSION=3.11.0
```

#### 3.4 Deploy
- Click "Create Web Service"
- Render will auto-deploy on git push

---

## 4. SCRAPER DEPLOYMENT (Railway Cron Jobs)

### Prerequisites:
- Railway account created

### Steps:

#### 4.1 Create Railway Project
```bash
npm install -g @railway/cli
railway login
cd scraper
railway init
```

#### 4.2 Create `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "python cron_job.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

#### 4.3 Configure Cron Job
```python
# scraper/cron_job.py
import schedule
import time
from crawler import run_daily_crawl

def job():
    print("Starting daily crawl job...")
    run_daily_crawl()
    print("Crawl completed.")

# Run every day at 2 AM
schedule.every().day.at("02:00").do(job)

if __name__ == "__main__":
    print("Cron scheduler started...")
    while True:
        schedule.run_pending()
        time.sleep(60)
```

#### 4.4 Deploy
```bash
railway up
```

#### 4.5 Environment Variables
In Railway Dashboard:
```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
GOOGLE_SEARCH_API_KEY=...
GOOGLE_SEARCH_ENGINE_ID=...
```

---

## 5. DATABASE (Supabase - Already Deployed)

Supabase handles:
- PostgreSQL database
- Authentication
- Storage
- Real-time subscriptions

No additional deployment needed.

---

## 6. REDIS (Upstash for Celery)

### For Background Job Queue:

#### 6.1 Create Upstash Redis
1. Go to https://upstash.com
2. Create new Redis database
3. Copy connection URL

#### 6.2 Configure Celery
```python
# backend/celery_app.py
from celery import Celery
import os

REDIS_URL = os.getenv("REDIS_URL")

celery_app = Celery(
    "agent_m",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)
```

#### 6.3 Add to Fly.io Secrets
```bash
fly secrets set REDIS_URL="redis://..."
```

---

## 7. MONITORING & LOGGING

### 7.1 Sentry (Error Tracking)
```bash
pip install sentry-sdk[fastapi]
```

```python
# backend/main.py
import sentry_sdk
sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=1.0,
)
```

### 7.2 Logging Configuration
```python
# backend/logging_config.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

---

## 8. CI/CD PIPELINE

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy Agent M

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - name: Deploy to Fly.io
        run: |
          cd backend
          flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

---

## 9. ENVIRONMENT MANAGEMENT CHECKLIST

### Local Development:
- [ ] Frontend `.env.local` configured
- [ ] Backend `.env` configured
- [ ] All services running locally

### Production:
- [ ] Vercel environment variables set
- [ ] Fly.io secrets configured
- [ ] Railway environment variables set
- [ ] Supabase production settings verified
- [ ] OAuth redirect URLs updated
- [ ] Custom domain configured
- [ ] SSL certificates active

---

## 10. POST-DEPLOYMENT VERIFICATION

```bash
# Test frontend
curl https://your-domain.com

# Test backend health
curl https://your-backend-url.fly.dev/health

# Test API endpoint
curl https://your-backend-url.fly.dev/api/v1/health

# Check logs
fly logs
railway logs
vercel logs
```

---

## 11. SCALING STRATEGY

### When to Scale:

#### Frontend (Vercel):
- Auto-scales by default
- Monitor Vercel Analytics

#### Backend (Fly.io):
```bash
# Scale to 2 instances
fly scale count 2

# Scale memory
fly scale memory 2048
```

#### Database (Supabase):
- Upgrade to Pro plan when:
  - > 500MB database size
  - > 2GB bandwidth/month
  - Need dedicated compute

---

## 12. BACKUP STRATEGY

### Database Backups:
```bash
# Automated via Supabase (daily backups on paid plans)
# Manual backup:
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Configuration Backups:
- Store all `.env` files securely in password manager
- Version control all configs (except secrets)

---

## Next Steps
After deployment:
1. Verify all services are running
2. Test complete user flow end-to-end
3. Set up monitoring alerts
4. Configure backup automation
5. Document production URLs for team
