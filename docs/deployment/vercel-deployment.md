# Track A: Production Deployment (Vercel + Render + Supabase)

**Recommended for: Quick production deployment with zero infrastructure management**

**Stack:**
- Frontend: Vercel
- Backend: Render or Railway  
- Database: Supabase
- Cost: Free tier available
- Time: 15-20 minutes

---

## Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free) or Railway account (free)
- Supabase account (free)
- OpenAI API key

---

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Sign in and click "New Project"
3. Fill in details:
   - **Name**: `agent-m-production`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait ~2 minutes for project creation

### 1.2 Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Copy entire contents of `/database/schema_phase1.sql`
4. Paste and click "Run"
5. Verify: Should see "Success. No rows returned"

### 1.3 Create Storage Bucket

1. Go to **Storage** section
2. Click "New Bucket"
3. Settings:
   - **Name**: `resumes`
   - **Public**: Yes (for authenticated users)
   - **File size limit**: 10MB
4. Click "Create bucket"

### 1.4 Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (enabled by default)
3. Optional: Enable **Google OAuth**
   - Follow guide: `docs/setup/oauth_google_setup.md`
   - Add authorized redirect: `https://your-project.supabase.co/auth/v1/callback`

### 1.5 Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values (you'll need them later):
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGc...
   service_role secret key: eyJhbGc... (keep this secret!)
   ```

3. Go to **Settings** → **API** → **JWT Settings**
4. Copy **JWT Secret**

---

## Step 2: Backend Deployment (Render)

### 2.1 Prepare Repository

1. Push code to GitHub if not already done:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### 2.2 Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 2.3 Deploy Backend Service

1. Click "New +" → "Web Service"
2. Connect your `AgentM` repository
3. Configure:
   - **Name**: `agentm-backend`
   - **Region**: Same as Supabase
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

4. Click "Advanced" and add environment variables:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   SUPABASE_JWT_SECRET=your-jwt-secret
   OPENAI_API_KEY=sk-your-openai-key
   SECRET_KEY=<generate-random-string-64-chars>
   ENCRYPTION_KEY=<run: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())">
   BACKEND_CORS_ORIGINS=https://your-frontend-domain.vercel.app
   ```

5. Click "Create Web Service"
6. Wait 5-10 minutes for deployment
7. Copy your backend URL: `https://agentm-backend.onrender.com`

### 2.4 Test Backend

1. Visit: `https://agentm-backend.onrender.com/health`
2. Should see: `{"status":"healthy"}`
3. Visit: `https://agentm-backend.onrender.com/docs`
4. Should see Swagger UI

---

## Step 3: Frontend Deployment (Vercel)

### 3.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your `AgentM` repository

### 3.2 Configure Project

1. Click "Import" on your repository
2. Configure:
   - **Project Name**: `agentm`
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 3.3 Add Environment Variables

Click "Environment Variables" and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_API_URL=https://agentm-backend.onrender.com
```

### 3.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL: `https://agentm.vercel.app`

### 3.5 Update CORS

Go back to Render and update `BACKEND_CORS_ORIGINS`:
```
BACKEND_CORS_ORIGINS=https://agentm.vercel.app,https://agentm-git-main.vercel.app
```

---

## Step 4: Configure Custom Domain (Optional)

### 4.1 Frontend Domain

1. In Vercel, go to **Settings** → **Domains**
2. Add your domain: `app.yourcompany.com`
3. Follow DNS instructions
4. Enable HTTPS (automatic)

### 4.2 Backend Domain

1. In Render, go to **Settings** → **Custom Domains**
2. Add your domain: `api.yourcompany.com`
3. Follow DNS instructions
4. Enable HTTPS (automatic)

### 4.3 Update Environment Variables

Update these after adding custom domains:
- Vercel: `NEXT_PUBLIC_API_URL=https://api.yourcompany.com`
- Render: `BACKEND_CORS_ORIGINS=https://app.yourcompany.com`

---

## Step 5: Enable Worker Services (Phase 2)

When you add web scrapers and background jobs:

### 5.1 Create Background Worker

1. In Render, click "New +" → "Background Worker"
2. Connect same repository
3. Configure:
   - **Name**: `agentm-worker`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m app.workers.crawler`
   - Same environment variables as backend

### 5.2 Add Redis (For Job Queue)

1. In Render, click "New +" → "Redis"
2. Name: `agentm-redis`
3. Copy Redis URL
4. Add to both backend and worker:
   ```
   REDIS_URL=redis://...
   ```

---

## Step 6: Monitoring & Logging

### 6.1 Render Logs

- View logs: Dashboard → Your Service → "Logs" tab
- Real-time monitoring
- Download logs for debugging

### 6.2 Vercel Logs

- View logs: Dashboard → Your Project → "Logs"
- Real-time function logs
- Analytics tab for performance

### 6.3 Supabase Logs

- Database logs: Dashboard → "Logs Explorer"
- Auth logs: "Authentication" → "Logs"
- Storage logs: "Storage" → "Logs"

### 6.4 Add Uptime Monitoring (Optional)

1. Sign up for https://uptimerobot.com (free)
2. Add monitors:
   - `https://agentm.vercel.app` (every 5 min)
   - `https://agentm-backend.onrender.com/health` (every 5 min)
3. Get email alerts for downtime

---

## Step 7: Production Checklist

Before launching:

### Security
- [ ] CORS configured correctly
- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Database RLS policies tested
- [ ] SMTP passwords encrypted

### Performance
- [ ] Backend responds in <500ms
- [ ] Frontend loads in <2s
- [ ] Database queries optimized
- [ ] Static assets cached

### Monitoring
- [ ] Uptime monitoring configured
- [ ] Error logs reviewed
- [ ] Analytics set up (optional)

### Testing
- [ ] Sign up flow works
- [ ] Resume upload works
- [ ] Email sending works
- [ ] All API endpoints tested

---

## Costs

### Free Tier Limits

**Vercel (Free):**
- 100 GB bandwidth/month
- Unlimited personal projects
- Analytics not included

**Render (Free):**
- 750 hours/month
- Services sleep after 15 min inactivity
- 0.1 CPU, 512 MB RAM

**Supabase (Free):**
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users
- 2 GB bandwidth

### When to Upgrade

Upgrade when you hit:
- **Vercel**: >100 GB bandwidth (upgrade to Pro: $20/month)
- **Render**: Need 24/7 uptime (upgrade to Starter: $7/month)
- **Supabase**: >500 MB data (upgrade to Pro: $25/month)

**Estimated costs for 1000 users:**
- Vercel: $20/month
- Render: $7-15/month (backend + worker)
- Supabase: $25/month
- OpenAI: $50-100/month
- **Total: $102-160/month**

---

## Troubleshooting

### Backend won't start on Render

**Error: "Module not found"**
```bash
# Check requirements.txt is complete
# Make sure Root Directory is "backend"
# Verify Build Command: pip install -r requirements.txt
```

**Error: "Port binding failed"**
```bash
# Make sure Start Command uses $PORT:
# uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend build fails on Vercel

**Error: "Module not found"**
```bash
# Make sure Root Directory is "frontend"
# Check package.json has all dependencies
# Try: npm install && npm run build locally first
```

**Error: "Environment variable missing"**
```bash
# All NEXT_PUBLIC_ variables must be set in Vercel
# Redeploy after adding variables
```

### CORS errors

**Error: "CORS policy blocked"**
```bash
# In Render, update BACKEND_CORS_ORIGINS to include:
# https://your-app.vercel.app
# https://your-app-git-main.vercel.app
# Include both production and preview URLs
```

### Database connection issues

**Error: "Could not connect to database"**
```bash
# Verify SUPABASE_URL is correct
# Check SUPABASE_SERVICE_ROLE_KEY (not anon key)
# Test connection from Render logs
```

---

## Continuous Deployment

Once set up, deployment is automatic:

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Vercel auto-deploys** (frontend in ~2 min)
3. **Render auto-deploys** (backend in ~5 min)
4. **Zero downtime** - Vercel & Render handle it

### Preview Deployments

Every pull request gets preview URLs:
- Frontend: `https://agentm-git-branch.vercel.app`
- Backend: Create preview service in Render

---

## Next Steps

1. ✅ **Test everything** - Sign up, upload resume, send email
2. 📊 **Set up analytics** - PostHog, Mixpanel, or Google Analytics
3. 🐛 **Add error tracking** - Sentry for error monitoring
4. 📧 **Configure transactional emails** - SendGrid for system emails
5. 🚀 **Launch!** - Share with users

---

## Alternative: Railway (Instead of Render)

Railway is similar to Render with better DX:

1. Go to https://railway.app
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select `AgentM` → `backend` directory
5. Add environment variables (same as Render)
6. Deploy!

**Railway Pricing:**
- $5 credit free/month
- $0.000231/GB-sec RAM
- ~$5-10/month for hobby project

---

**Deployment Complete! 🎉**

Your Agent M platform is now live and accessible to the world!
