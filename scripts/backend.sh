#!/bin/bash
# Backend Management Script for Agent M

VENV_PATH="/tmp/agentm-venv"
BACKEND_DIR="/workspaces/AgentM/backend"
PID_FILE="/tmp/backend.pid"
LOG_FILE="/tmp/backend.log"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

case "$1" in
  start)
    echo -e "${YELLOW}Starting Agent M Backend...${NC}"
    if [ -f "$PID_FILE" ]; then
      PID=$(cat "$PID_FILE")
      if ps -p $PID > /dev/null 2>&1; then
        echo -e "${RED}Backend already running with PID: $PID${NC}"
        exit 1
      fi
    fi
    
    source "$VENV_PATH/bin/activate"
    cd "$BACKEND_DIR"
    nohup python main.py > "$LOG_FILE" 2>&1 & 
    echo $! > "$PID_FILE"
    sleep 3
    
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
      echo -e "${GREEN}✅ Backend started successfully!${NC}"
      echo "   PID: $(cat $PID_FILE)"
      echo "   URL: http://localhost:8000"
      echo "   Docs: http://localhost:8000/docs"
      echo "   Logs: tail -f $LOG_FILE"
    else
      echo -e "${RED}❌ Backend failed to start. Check logs: tail -f $LOG_FILE${NC}"
      exit 1
    fi
    ;;
    
  stop)
    echo -e "${YELLOW}Stopping Agent M Backend...${NC}"
    if [ -f "$PID_FILE" ]; then
      PID=$(cat "$PID_FILE")
      if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        rm "$PID_FILE"
        echo -e "${GREEN}✅ Backend stopped${NC}"
      else
        echo -e "${RED}Backend not running${NC}"
        rm "$PID_FILE"
      fi
    else
      echo -e "${RED}No PID file found${NC}"
    fi
    ;;
    
  restart)
    $0 stop
    sleep 2
    $0 start
    ;;
    
  status)
    if [ -f "$PID_FILE" ]; then
      PID=$(cat "$PID_FILE")
      if ps -p $PID > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is running${NC}"
        echo "   PID: $PID"
        echo "   URL: http://localhost:8000"
        
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
          echo -e "   Health: ${GREEN}OK${NC}"
          curl -s http://localhost:8000/health | jq '.' 2>/dev/null || curl -s http://localhost:8000/health
        else
          echo -e "   Health: ${RED}FAILED${NC}"
        fi
      else
        echo -e "${RED}❌ Backend not running (stale PID file)${NC}"
        rm "$PID_FILE"
      fi
    else
      echo -e "${RED}❌ Backend not running${NC}"
    fi
    ;;
    
  logs)
    if [ -f "$LOG_FILE" ]; then
      echo -e "${YELLOW}Showing backend logs (Ctrl+C to exit)...${NC}"
      tail -f "$LOG_FILE"
    else
      echo -e "${RED}No log file found at $LOG_FILE${NC}"
    fi
    ;;
    
  *)
    echo "Agent M Backend Management"
    echo ""
    echo "Usage: $0 {start|stop|restart|status|logs}"
    echo ""
    echo "Commands:"
    echo "  start   - Start the backend server"
    echo "  stop    - Stop the backend server"
    echo "  restart - Restart the backend server"
    echo "  status  - Check backend server status"
    echo "  logs    - View backend logs (live)"
    echo ""
    echo "Quick commands:"
    echo "  ./backend.sh start   # Start backend"
    echo "  ./backend.sh status  # Check if running"
    echo "  ./backend.sh logs    # View logs"
    exit 1
    ;;
esac
