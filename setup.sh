#!/bin/bash

# Agent M - Setup Script
# This script helps you set up the project for the first time

set -e  # Exit on error

echo "================================================"
echo "  Agent M - Automated Outreach Platform Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js ${NODE_VERSION} found"
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    echo "Please install Python 3.11+ from https://python.org/"
    exit 1
else
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} ${PYTHON_VERSION} found"
fi

echo ""
echo "================================================"
echo "  Step 1: Backend Setup"
echo "================================================"

cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    echo -e "${GREEN}✓${NC} Virtual environment created"
else
    echo -e "${YELLOW}⚠${NC} Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install backend dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✓${NC} Backend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠${NC} Please edit backend/.env and add your credentials"
    
    # Generate encryption key
    echo ""
    echo "Generating encryption key..."
    ENCRYPTION_KEY=$(python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
    echo "ENCRYPTION_KEY=${ENCRYPTION_KEY}"
    echo ""
    echo -e "${YELLOW}⚠${NC} Copy the above ENCRYPTION_KEY to backend/.env"
else
    echo -e "${YELLOW}⚠${NC} backend/.env already exists"
fi

cd ..

echo ""
echo "================================================"
echo "  Step 2: Frontend Setup"
echo "================================================"

cd frontend

# Install frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} node_modules already exists"
fi

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating frontend .env.local file..."
    cp .env.example .env.local
    echo -e "${YELLOW}⚠${NC} Please edit frontend/.env.local and add your Supabase credentials"
else
    echo -e "${YELLOW}⚠${NC} frontend/.env.local already exists"
fi

cd ..

echo ""
echo "================================================"
echo "  Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Set up Supabase:"
echo "   - Create a Supabase project at https://supabase.com"
echo "   - Run the SQL in database/schema_phase1.sql"
echo "   - Create a storage bucket named 'resumes'"
echo "   - See docs/setup/supabase_config.md for details"
echo ""
echo "2. Configure environment variables:"
echo "   - Edit backend/.env with your Supabase and OpenAI credentials"
echo "   - Edit frontend/.env.local with your Supabase credentials"
echo "   - See docs/setup/ directory for detailed guides"
echo ""
echo "3. Set up Google OAuth (optional):"
echo "   - Follow docs/setup/oauth_google_setup.md"
echo ""
echo "4. Start the development servers:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation: docs/index.md"
echo "🚀 Quick Start: docs/setup/QUICKSTART.md"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
