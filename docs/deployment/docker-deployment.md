# Docker Compose Local Deployment

**Recommended for: Local development and testing**

**Time:** 5 minutes  
**Cost:** Free  
**Requirements:** Docker and Docker Compose

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/ak-1344/AgentM.git
cd AgentM
```

### 2. Configure Environment

```bash
# Backend environment
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=sk-your-openai-key
SECRET_KEY=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
BACKEND_CORS_ORIGINS=http://localhost:3000
```

```bash
# Frontend environment
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start Services

```bash
cd ..
docker-compose up -d
```

### 4. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Docker Compose Services

The `docker-compose.yml` includes:

```yaml
services:
  backend:     # FastAPI backend on port 8000
  frontend:    # Next.js frontend on port 3000
```

For Phase 2+, add:
```yaml
  redis:       # Job queue
  worker:      # Background worker (scrapers)
```

---

## Common Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild After Code Changes
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### Restart Single Service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Check Service Status
```bash
docker-compose ps
```

### Execute Commands in Container
```bash
# Backend container
docker-compose exec backend bash

# Frontend container
docker-compose exec frontend sh
```

---

## Troubleshooting

### Port Already in Use

**Error:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Map to different host port
```

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Missing .env files
# 2. Invalid environment variables
# 3. Port conflicts
```

### Frontend Can't Connect to Backend

```bash
# Make sure NEXT_PUBLIC_API_URL is correct
# For Docker network, use: http://backend:8000
# For host access, use: http://localhost:8000
```

### Build Fails

```bash
# Clear Docker cache
docker-compose down -v
docker system prune -af
docker-compose build --no-cache
docker-compose up -d
```

---

## Development Workflow

### Hot Reload Development

For development with hot reload, don't use Docker:

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

### Hybrid Approach

Run backend in Docker, frontend locally:

```bash
# Start backend only
docker-compose up -d backend

# Run frontend locally with hot reload
cd frontend
npm run dev
```

---

## Database Options

### Option 1: Use Supabase (Recommended)

Set up Supabase project and use credentials in `.env`

### Option 2: Local PostgreSQL

Add to `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: agentm-postgres
    environment:
      POSTGRES_DB: agentm
      POSTGRES_USER: agentm
      POSTGRES_PASSWORD: agentm_password
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/schema_phase1.sql:/docker-entrypoint-initdb.d/schema.sql
    networks:
      - agentm-network

volumes:
  postgres-data:
```

Update `backend/.env`:
```env
DATABASE_URL=postgresql://agentm:agentm_password@postgres:5432/agentm
```

---

## Production Mode

To run in production mode locally:

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production
    container_name: agentm-backend-prod
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
    container_name: agentm-frontend-prod
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

networks:
  agentm-network:
    driver: bridge
```

---

## Monitoring

### Resource Usage

```bash
# Real-time stats
docker stats

# Disk usage
docker system df
```

### Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Frontend
curl http://localhost:3000
```

---

## Cleanup

### Remove Everything

```bash
# Stop and remove containers, networks
docker-compose down

# Also remove volumes (data will be lost!)
docker-compose down -v

# Remove images
docker rmi agentm_backend agentm_frontend
```

### Free Up Space

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -af --volumes
```

---

## Next Steps

1. ✅ **Test locally** - Make sure everything works
2. 🚀 **Deploy to cloud** - Choose Track A or Track B
3. 📊 **Add monitoring** - Set up logging
4. 🧪 **Write tests** - Add integration tests

---

**Local Development Ready! 🎉**

Perfect for testing before deploying to production.
