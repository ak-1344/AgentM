# 🚀 Quick Deployment Guide

**Agent M - Production Deployment**

Choose your deployment strategy and follow the steps below.

---

## 📋 Prerequisites

Before deployment, ensure you have:

- ✅ GitHub account with repository
- ✅ OpenAI API key
- ✅ Supabase account (or PostgreSQL database)
- ✅ SMTP credentials (Gmail/Outlook/etc.)

---

## 🎯 Deployment Options

### Option 1: Cloud Deployment (Recommended)
**Time:** ~30 minutes | **Cost:** Free tier available

- **Frontend:** Vercel (or Netlify)
- **Backend:** Render.com (or Fly.io/Railway)
- **Database:** Supabase (managed PostgreSQL)

**Best for:** Quick deployment, minimal maintenance, auto-scaling

### Option 2: Self-Hosted (Oracle VM)
**Time:** ~45 minutes | **Cost:** Free (Oracle Cloud)

- **Server:** Oracle Cloud VM (Always Free tier)
- **Container:** Docker + Docker Compose
- **Reverse Proxy:** Caddy (auto HTTPS)

**Best for:** Full control, cost optimization, learning

### Option 3: Local Development
**Time:** ~10 minutes | **Cost:** Free

- **Environment:** Docker Compose
- **Database:** Local PostgreSQL or Supabase

**Best for:** Testing, development, local use

---

## ☁️ Option 1: Cloud Deployment

### Step 1: Setup Supabase (5 min)

1. **Create Project:**
   ```
   Go to supabase.com → New Project
   Save: Project URL, anon key, service_role key
   ```

2. **Run Database Schema:**
   ```sql
   -- In Supabase SQL Editor
   Copy contents from: database/schema_phase1.sql
   Execute
   ```

3. **Configure Storage:**
   ```
   Dashboard → Storage → Create bucket: "resumes"
   Set public: false
   ```

### Step 2: Deploy Backend to Render (10 min)

1. **Connect Repository:**
   ```
   Go to render.com → New → Web Service
   Connect GitHub repository
   ```

2. **Configure Service:**
   ```
   Name: agentm-backend
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

3. **Set Environment Variables:**
   ```bash
   ENVIRONMENT=production
   SECRET_KEY=<generate-with-openssl-rand-hex-32>
   ENCRYPTION_KEY=<generate-32-char-key>
   SUPABASE_URL=<from-supabase>
   SUPABASE_SERVICE_ROLE_KEY=<from-supabase>
   SUPABASE_JWT_SECRET=<from-supabase-settings>
   OPENAI_API_KEY=<your-openai-key>
   BACKEND_CORS_ORIGINS=https://your-frontend-domain.vercel.app
   ```

4. **Deploy:** Click "Create Web Service"

### Step 3: Deploy Frontend to Vercel (10 min)

1. **Import Project:**
   ```
   Go to vercel.com → New Project
   Import from GitHub
   Select AgentM repository
   ```

2. **Configure Build:**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   ```

3. **Set Environment Variables:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=<from-supabase>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-supabase>
   NEXT_PUBLIC_API_URL=<backend-url-from-render>
   ```

4. **Deploy:** Click "Deploy"

### Step 4: Test Deployment (5 min)

1. Open frontend URL
2. Sign up for account
3. Upload resume
4. Configure context
5. Set SMTP credentials
6. Send test email

**✅ Done! Your app is live.**

---

## 🖥️ Option 2: Self-Hosted (Oracle VM)

### Step 1: Create Oracle VM (10 min)

1. **Sign up:** cloud.oracle.com (Always Free)
2. **Create Instance:**
   ```
   Shape: VM.Standard.E2.1.Micro (Always Free)
   OS: Ubuntu 22.04
   Storage: 50GB
   ```
3. **Note:** Public IP address
4. **Open Ports:** 80, 443, 22

### Step 2: Setup Server (15 min)

```bash
# SSH into server
ssh ubuntu@<your-ip>

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt-get install docker-compose

# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Clone repository
git clone https://github.com/your-username/AgentM.git
cd AgentM
```

### Step 3: Configure Environment (10 min)

```bash
# Backend config
cp backend/.env.example backend/.env
nano backend/.env
# Fill in all values

# Frontend config  
cp frontend/.env.example frontend/.env.local
nano frontend/.env.local
# Fill in all values

# Update Caddyfile with your domain
nano Caddyfile
# Replace your-domain.com with actual domain
```

### Step 4: Deploy with Docker (10 min)

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Setup Caddy
sudo systemctl enable caddy
sudo systemctl start caddy
```

**✅ Done! Access at https://your-domain.com**

---

## 💻 Option 3: Local Development

### Quick Start (10 min)

```bash
# Clone repository
git clone https://github.com/your-username/AgentM.git
cd AgentM

# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Configure environment
# Edit backend/.env and frontend/.env.local

# Start services
docker-compose up -d

# Access
open http://localhost:3000
```

**✅ Done! App running locally.**

---

## 🔐 Security Checklist

Before going live:

- [ ] Change all default secrets and keys
- [ ] Enable Supabase RLS policies
- [ ] Use strong encryption keys
- [ ] Set up firewall rules
- [ ] Enable HTTPS (auto with Caddy/Vercel)
- [ ] Restrict CORS origins
- [ ] Use environment variables (no hardcoding)
- [ ] Enable rate limiting (Phase 2+)
- [ ] Regular security updates
- [ ] Monitor logs

---

## 🔧 Environment Variables Reference

### Backend Required:
```bash
SECRET_KEY=          # 32+ char random string
ENCRYPTION_KEY=      # 32 char for Fernet
SUPABASE_URL=        # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=  # Service role key
SUPABASE_JWT_SECRET= # JWT secret from Supabase
OPENAI_API_KEY=      # OpenAI API key
BACKEND_CORS_ORIGINS=  # Frontend URL(s)
```

### Frontend Required:
```bash
NEXT_PUBLIC_SUPABASE_URL=      # Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Anon/public key
NEXT_PUBLIC_API_URL=           # Backend URL
```

---

## 🧪 Post-Deployment Testing

Test these workflows:

1. **Authentication:** Sign up → Login → Logout
2. **Resume:** Upload PDF/DOCX → Parse → View
3. **Context:** Fill form → Save → Edit
4. **SMTP:** Add credentials → Test connection
5. **Email:** Compose → Send test email

---

## 📊 Monitoring

### Logs
```bash
# Render: Dashboard → Logs
# Vercel: Dashboard → Deployments → View Logs
# Docker: docker-compose logs -f
```

### Health Check
```bash
# Backend health
curl https://api.your-domain.com/health

# Expected response:
{
  "status": "healthy",
  "service": "agent-m-backend",
  "version": "0.1.0"
}
```

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Common issues:
- Missing environment variables
- Database connection failed
- Port already in use
```

### Frontend can't connect to backend
```bash
# Check CORS settings in backend
# Verify NEXT_PUBLIC_API_URL is correct
# Check network connectivity
```

### Database errors
```bash
# Verify Supabase credentials
# Check RLS policies are enabled
# Run schema migration again
```

### Email sending fails
```bash
# Verify SMTP credentials
# Use app password for Gmail
# Check TLS/port settings
```

---

## 📚 Detailed Documentation

For comprehensive guides:

- **Cloud:** `docs/deployment/vercel-deployment.md`
- **Self-Hosted:** `docs/deployment/oracle-vm-deployment.md`
- **Docker:** `docs/deployment/docker-deployment.md`
- **Complete Guide:** `docs/deployment/Deployment_plan.md`

---

## 🎉 Success!

Once deployed, you should have:

✅ Working authentication  
✅ Resume upload and parsing  
✅ Context configuration  
✅ Email sending capability  
✅ Secure, scalable infrastructure

**Next Steps:**
- Configure your SMTP settings
- Upload your resume
- Set your targeting context
- Start sending outreach emails!

---

## 💡 Tips

- **Free Tiers:** Vercel + Render + Supabase = $0/month
- **Custom Domain:** Add via Vercel/Render dashboards
- **SSL:** Auto-configured on cloud platforms
- **Backups:** Supabase auto-backups daily
- **Scaling:** Both platforms auto-scale

---

## 📞 Need Help?

- 📖 **Full Docs:** `docs/index.md`
- 🐛 **Issues:** GitHub Issues
- 💬 **Discussions:** GitHub Discussions
- 📧 **SMTP Setup:** `docs/setup/smtp_setup.md`
- 🗄️ **Database:** `docs/setup/supabase_config.md`

---

**Deployment Status Tracking:**

Track your deployment progress in `docs/setup/SETUP_CHECKLIST.md`

**Version:** 0.1.0  
**Last Updated:** December 2024  
**Status:** Production Ready
