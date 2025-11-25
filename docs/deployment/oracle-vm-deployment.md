# Track B: Self-Hosted Deployment (Oracle VM)

**Recommended for: Learning infrastructure, full control, and production-grade self-hosting**

**Stack:**
- Server: Oracle Cloud Free Tier VM
- Reverse Proxy: Caddy (auto HTTPS)
- Backend: Docker containers
- Database: PostgreSQL (self-hosted or Supabase)
- Queue: Redis
- Cost: $0 (Free tier forever)
- Time: 1-2 hours

---

## Prerequisites

- Oracle Cloud account (free tier)
- Domain name (optional, but recommended)
- SSH key pair
- Basic Linux knowledge

---

## Part 1: Oracle Cloud Setup

### 1.1 Create Oracle Cloud Account

1. Go to https://www.oracle.com/cloud/free/
2. Sign up for free tier
3. Verify email and phone
4. Add payment method (won't be charged on free tier)

### 1.2 Create Compute Instance

1. Go to **Compute** → **Instances**
2. Click "Create Instance"

**Configuration:**
```
Name: agentm-production
Image: Ubuntu 22.04 (Minimal)
Shape: VM.Standard.A1.Flex (ARM)
  - OCPUs: 2 (adjustable)
  - Memory: 12 GB (adjustable)
  - Always Free eligible ✓

Network:
  - Create new VCN: agentm-vcn
  - Create new subnet: Public subnet
  - Assign public IPv4: Yes

SSH Keys:
  - Upload your public key OR generate new pair
  - Download private key (keep safe!)
```

3. Click "Create"
4. Wait 2-3 minutes for provisioning
5. Note your **Public IP address**

### 1.3 Configure Firewall (Security List)

1. Go to **Networking** → **Virtual Cloud Networks**
2. Click your VCN → **Security Lists** → **Default Security List**
3. Click "Add Ingress Rules"

**Add these rules:**

```
SSH:
  Source: 0.0.0.0/0
  Destination Port: 22
  Description: SSH access

HTTP:
  Source: 0.0.0.0/0
  Destination Port: 80
  Description: HTTP traffic

HTTPS:
  Source: 0.0.0.0/0
  Destination Port: 443
  Description: HTTPS traffic
```

---

## Part 2: Server Initial Setup

### 2.1 Connect to Server

```bash
# Make your private key secure
chmod 600 ~/your-oracle-key.pem

# Connect to server
ssh -i ~/your-oracle-key.pem ubuntu@YOUR_PUBLIC_IP
```

### 2.2 Update System

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y \
  git \
  curl \
  wget \
  vim \
  htop \
  ufw \
  fail2ban
```

### 2.3 Configure UFW Firewall

```bash
# Allow SSH (important: do this first!)
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 2.4 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Re-login for group changes to take effect
exit
# SSH back in
ssh -i ~/your-oracle-key.pem ubuntu@YOUR_PUBLIC_IP
```

---

## Part 3: Clone and Configure Application

### 3.1 Clone Repository

```bash
# Create app directory
mkdir -p /home/ubuntu/apps
cd /home/ubuntu/apps

# Clone repo
git clone https://github.com/ak-1344/AgentM.git
cd AgentM
```

### 3.2 Configure Environment Variables

**Backend Environment:**

```bash
# Create backend .env
cd backend
cp .env.example .env
vim .env
```

Add your credentials:
```env
# Supabase (if using hosted) OR local PostgreSQL
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key
SUPABASE_JWT_SECRET=your-jwt-secret

# OR for self-hosted PostgreSQL
# DATABASE_URL=postgresql://agentm:password@localhost:5432/agentm

# OpenAI
OPENAI_API_KEY=sk-your-key

# Security
SECRET_KEY=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")

# CORS
BACKEND_CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Frontend Environment:**

```bash
cd ../frontend
cp .env.example .env.local
vim .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## Part 4: Database Setup (Choose One)

### Option A: Use Supabase (Recommended for Simplicity)

1. Follow steps from `vercel-deployment.md` Step 1
2. Use Supabase credentials in your `.env`
3. Skip to Part 5

### Option B: Self-Hosted PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE agentm;
CREATE USER agentm WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE agentm TO agentm;
\c agentm
GRANT ALL ON SCHEMA public TO agentm;
EOF

# Run schema
sudo -u postgres psql -d agentm < /home/ubuntu/apps/AgentM/database/schema_phase1.sql

# Update backend .env with local connection:
# DATABASE_URL=postgresql://agentm:your-secure-password@localhost:5432/agentm
```

---

## Part 5: Install Caddy (Reverse Proxy)

### 5.1 Install Caddy

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### 5.2 Configure Caddy

```bash
# Create Caddyfile
sudo vim /etc/caddy/Caddyfile
```

**Caddyfile content:**

```caddy
# Frontend
yourdomain.com, www.yourdomain.com {
    reverse_proxy localhost:3000
    
    # Enable GZIP
    encode gzip
    
    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "no-referrer-when-downgrade"
    }
}

# Backend API
api.yourdomain.com {
    reverse_proxy localhost:8000
    
    encode gzip
    
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
    }
}
```

**Or for testing without domain (HTTP only):**

```caddy
:80 {
    # Frontend
    handle /api/* {
        reverse_proxy localhost:8000
    }
    
    # Backend
    handle {
        reverse_proxy localhost:3000
    }
}
```

```bash
# Reload Caddy
sudo systemctl reload caddy

# Enable on boot
sudo systemctl enable caddy
```

---

## Part 6: Deploy Application with Docker

### 6.1 Create Production Docker Compose

```bash
cd /home/ubuntu/apps/AgentM
vim docker-compose.prod.yml
```

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: agentm-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    networks:
      - agentm-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: agentm-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.local
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - agentm-network

  # Optional: Redis for job queues (Phase 2)
  redis:
    image: redis:7-alpine
    container_name: agentm-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - agentm-network

networks:
  agentm-network:
    driver: bridge

volumes:
  redis-data:
```

### 6.2 Build and Start

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 6.3 Verify Services

```bash
# Check backend
curl http://localhost:8000/health
# Should return: {"status":"healthy"}

# Check frontend
curl http://localhost:3000
# Should return HTML

# Check via domain (if configured)
curl https://yourdomain.com
curl https://api.yourdomain.com/health
```

---

## Part 7: Set Up Systemd Service (Alternative to Docker Compose)

If you prefer systemd over Docker Compose:

### 7.1 Backend Service

```bash
sudo vim /etc/systemd/system/agentm-backend.service
```

```ini
[Unit]
Description=Agent M Backend API
After=network.target postgresql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/apps/AgentM/backend
Environment="PATH=/home/ubuntu/apps/AgentM/backend/venv/bin"
EnvironmentFile=/home/ubuntu/apps/AgentM/backend/.env
ExecStart=/home/ubuntu/apps/AgentM/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 7.2 Frontend Service

```bash
sudo vim /etc/systemd/system/agentm-frontend.service
```

```ini
[Unit]
Description=Agent M Frontend
After=network.target agentm-backend.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/apps/AgentM/frontend
Environment="PATH=/usr/bin:/usr/local/bin"
Environment="NODE_ENV=production"
EnvironmentFile=/home/ubuntu/apps/AgentM/frontend/.env.local
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 7.3 Enable and Start

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable services
sudo systemctl enable agentm-backend
sudo systemctl enable agentm-frontend

# Start services
sudo systemctl start agentm-backend
sudo systemctl start agentm-frontend

# Check status
sudo systemctl status agentm-backend
sudo systemctl status agentm-frontend

# View logs
sudo journalctl -u agentm-backend -f
sudo journalctl -u agentm-frontend -f
```

---

## Part 8: Set Up CI/CD with GitHub Actions

### 8.1 Generate SSH Deploy Key

On your server:
```bash
# Generate deploy key
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy  # Copy this private key
```

### 8.2 Add to GitHub Secrets

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add secrets:
   - `DEPLOY_HOST`: Your server IP
   - `DEPLOY_USER`: `ubuntu`
   - `DEPLOY_KEY`: The private key you copied
   - `DEPLOY_PATH`: `/home/ubuntu/apps/AgentM`

### 8.3 Create GitHub Action

```bash
mkdir -p .github/workflows
vim .github/workflows/deploy.yml
```

```yaml
name: Deploy to Oracle VM

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_KEY }}
        script: |
          cd ${{ secrets.DEPLOY_PATH }}
          git pull origin main
          docker-compose -f docker-compose.prod.yml build
          docker-compose -f docker-compose.prod.yml up -d
          docker-compose -f docker-compose.prod.yml ps
```

Now every push to `main` auto-deploys!

---

## Part 9: Monitoring & Maintenance

### 9.1 Install Monitoring Tools

```bash
# Install htop for resource monitoring
sudo apt install htop

# Check resources
htop

# Check disk usage
df -h

# Check Docker resource usage
docker stats
```

### 9.2 Set Up Log Rotation

```bash
# Configure Docker log rotation
sudo vim /etc/docker/daemon.json
```

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

```bash
# Restart Docker
sudo systemctl restart docker
```

### 9.3 Automated Backups

**Database backup script:**

```bash
vim ~/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/home/ubuntu/backups
mkdir -p $BACKUP_DIR

# Backup PostgreSQL (if self-hosted)
sudo -u postgres pg_dump agentm > $BACKUP_DIR/agentm_$DATE.sql

# Compress
gzip $BACKUP_DIR/agentm_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "agentm_*.sql.gz" -mtime +7 -delete

echo "Backup completed: agentm_$DATE.sql.gz"
```

```bash
chmod +x ~/backup-db.sh

# Add to cron (daily at 2 AM)
crontab -e
```

Add line:
```
0 2 * * * /home/ubuntu/backup-db.sh >> /home/ubuntu/backup.log 2>&1
```

### 9.4 Health Check Script

```bash
vim ~/health-check.sh
```

```bash
#!/bin/bash

# Check backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✓ Backend healthy"
else
    echo "✗ Backend down - restarting"
    docker-compose -f /home/ubuntu/apps/AgentM/docker-compose.prod.yml restart backend
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✓ Frontend healthy"
else
    echo "✗ Frontend down - restarting"
    docker-compose -f /home/ubuntu/apps/AgentM/docker-compose.prod.yml restart frontend
fi
```

```bash
chmod +x ~/health-check.sh

# Run every 5 minutes
crontab -e
```

Add:
```
*/5 * * * * /home/ubuntu/health-check.sh >> /home/ubuntu/health-check.log 2>&1
```

---

## Part 10: Security Hardening

### 10.1 Disable Root Login

```bash
sudo vim /etc/ssh/sshd_config
```

Set:
```
PermitRootLogin no
PasswordAuthentication no
```

```bash
sudo systemctl restart sshd
```

### 10.2 Configure Fail2Ban

```bash
sudo apt install fail2ban

# Configure SSH jail
sudo vim /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
```

```bash
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

### 10.3 Auto Security Updates

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## Troubleshooting

### Docker containers won't start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check resources
free -h
df -h

# Restart Docker daemon
sudo systemctl restart docker
```

### Out of memory

```bash
# Add swap space
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Caddy not getting HTTPS

```bash
# Check DNS is pointing to your server
nslookup yourdomain.com

# Check Caddy logs
sudo journalctl -u caddy -f

# Test Caddy config
sudo caddy validate --config /etc/caddy/Caddyfile
```

### Can't connect from outside

```bash
# Check Oracle Security List (port 80/443 open)
# Check UFW
sudo ufw status

# Check if service is listening
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

---

## Costs

**Oracle Free Tier (Forever Free):**
- 2 AMD VM instances or 4 ARM VM instances
- 200 GB block storage
- 10 GB object storage
- 10 TB outbound data transfer/month

**This deployment uses:**
- 1 ARM VM (2 OCPU, 12 GB RAM) - FREE
- ~10-20 GB storage - FREE
- Bandwidth: <1 TB/month - FREE

**Total cost: $0/month** 🎉

Additional costs:
- Domain name: $10-15/year (optional)
- OpenAI API: $20-100/month (usage-based)
- Supabase: $0-25/month (if using hosted)

---

## Performance Tips

### Optimize Docker Images

```dockerfile
# Use multi-stage builds
# Use slim/alpine images
# Minimize layers
# Use .dockerignore
```

### Enable Caching

Install Redis and configure caching:
```python
# In backend, add Redis caching
import redis
cache = redis.Redis(host='localhost', port=6379)
```

### Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_contexts_user_id ON context_profiles(user_id);

-- Analyze queries
EXPLAIN ANALYZE SELECT * FROM resumes WHERE user_id = 'xxx';
```

---

## Next Steps

1. ✅ **SSL working** - Caddy auto-manages certificates
2. 📊 **Set up monitoring** - Prometheus + Grafana (optional)
3. 🔐 **Backup strategy** - Automated daily backups
4. 📧 **Email alerts** - Get notified of issues
5. 📈 **Scale** - Add more containers as needed

---

**Self-Hosting Complete! 🎉**

You now have a production-grade self-hosted deployment with full control!
