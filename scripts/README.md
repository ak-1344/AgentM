# Agent M Scripts

Management and utility scripts for Agent M platform.

---

## 📋 Overview

This directory contains shell scripts for:
- Backend management (start/stop/restart)
- Setup automation
- Deployment helpers
- Utility tasks

---

## 🗂️ Available Scripts

### 1. `backend.sh`

Backend server management script with start/stop/restart/status/logs commands.

**Usage:**
```bash
# Start backend
./scripts/backend.sh start

# Stop backend
./scripts/backend.sh stop

# Restart backend
./scripts/backend.sh restart

# Check status
./scripts/backend.sh status

# View logs
./scripts/backend.sh logs
```

**Features:**
- ✅ Start backend in background (nohup)
- ✅ Health check verification
- ✅ PID file management
- ✅ Graceful shutdown
- ✅ Log tailing
- ✅ Status with JSON health response

**Configuration:**
- Virtual environment: `/tmp/agentm-venv`
- PID file: `/tmp/backend.pid`
- Log file: `/tmp/backend.log`
- Working directory: `backend/`

---

### 2. `setup.sh`

Automated setup script for initial project setup (if implemented).

**Usage:**
```bash
./scripts/setup.sh
```

**What it does:**
- Sets up virtual environment
- Installs dependencies
- Configures environment files
- Initializes database
- Starts services

---

## 🚀 Quick Examples

### Start Backend Quickly
```bash
./scripts/backend.sh start
```

### Check if Backend is Running
```bash
./scripts/backend.sh status
```

### View Backend Logs in Real-time
```bash
./scripts/backend.sh logs
```

### Restart After Code Changes
```bash
./scripts/backend.sh restart
```

---

## 🔧 Script Details

### backend.sh

**Commands:**

#### `start`
Starts the backend server in background:
- Checks if already running (via PID file)
- Activates virtual environment
- Starts Uvicorn with nohup
- Saves PID to file
- Verifies health check
- Shows success message with PID and URL

#### `stop`
Stops the backend server:
- Reads PID from file
- Sends SIGTERM signal
- Waits for graceful shutdown
- Removes PID file
- Shows success message

#### `restart`
Restarts the backend server:
- Calls `stop` command
- Waits 2 seconds
- Calls `start` command

#### `status`
Shows backend status:
- Checks if PID file exists
- Verifies process is running
- Makes health check request
- Shows PID, URL, and health response

#### `logs`
Tails backend logs:
- Opens `/tmp/backend.log` with `tail -f`
- Shows real-time log output
- Ctrl+C to exit

**Environment:**
- `VENV_PATH`: `/tmp/agentm-venv`
- `BACKEND_DIR`: `backend`
- `PID_FILE`: `/tmp/backend.pid`
- `LOG_FILE`: `/tmp/backend.log`

---

## 💡 Tips

### 1. Run from Anywhere
You can run scripts from any directory:
```bash
# From project root
./scripts/backend.sh start

# From backend directory
../scripts/backend.sh start

# Using absolute path
/workspaces/AgentM/scripts/backend.sh start
```

### 2. Check Logs for Errors
If backend won't start:
```bash
./scripts/backend.sh logs
```

### 3. Multiple Backends
To run multiple backends (testing):
- Edit `backend.sh` to use different ports
- Change `BACKEND_PORT` environment variable
- Use different PID and log files

### 4. Production Use
For production, consider:
- Using systemd service instead
- Proper log rotation
- Environment-specific configs
- Monitoring tools

---

## 🐛 Troubleshooting

### Script Won't Execute
```bash
# Make executable
chmod +x scripts/backend.sh

# Run it
./scripts/backend.sh start
```

### Backend Won't Start
```bash
# Check logs
./scripts/backend.sh logs

# Check if port is in use
lsof -i :8000

# Verify venv exists
ls /tmp/agentm-venv/
```

### PID File Issues
```bash
# Remove stale PID file
rm /tmp/backend.pid

# Try starting again
./scripts/backend.sh start
```

### Permission Denied
```bash
# Check file permissions
ls -la scripts/

# Fix permissions
chmod +x scripts/*.sh
```

---

## 🔗 Related

- **[Backend README](../backend/README.md)** - Backend documentation
- **[Setup Guide](../docs/setup/BACKEND.md)** - Backend setup
- **[Troubleshooting](../docs/guides/TROUBLESHOOTING.md)** - Common issues

---

## 📝 Adding New Scripts

### Template
```bash
#!/bin/bash

# Script description
# Usage: ./scripts/my-script.sh [args]

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Your script logic here
echo -e "${GREEN}✅ Success${NC}"
```

### Best Practices
- Use `#!/bin/bash` shebang
- Set `set -e` to exit on errors
- Add usage/help message
- Use color output for readability
- Handle errors gracefully
- Document what script does

---

**Version:** 1.0.0 | **Shell:** Bash
