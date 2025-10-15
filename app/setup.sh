#!/bin/bash

# Setup script for LegalIndia.ai Backend
# This script automates the setup process

echo "🏛️  LegalIndia.ai Backend Setup"
echo "================================"

# Check Python version
echo "Checking Python version..."
python_version=$(python3.12 --version 2>&1)
if [ $? -eq 0 ]; then
    echo "✓ Found: $python_version"
else
    echo "✗ Python 3.12 not found. Please install Python 3.12 or higher."
    exit 1
fi

# Create virtual environment
echo ""
echo "Creating virtual environment..."
if [ -d "venv" ]; then
    echo "! Virtual environment already exists. Skipping..."
else
    python3.12 -m venv venv
    echo "✓ Virtual environment created"
fi

# Activate virtual environment
echo ""
echo "Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated"

# Upgrade pip
echo ""
echo "Upgrading pip..."
pip install --upgrade pip --quiet
echo "✓ pip upgraded"

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt --quiet
echo "✓ Dependencies installed"

# Check if .env exists
echo ""
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found"
    echo "Please create a .env file with the following variables:"
    echo "  - DATABASE_URL"
    echo "  - AI_ENGINE_URL"
    echo "  - JWT_SECRET"
    echo "  - FRONTEND_ORIGIN"
    echo ""
    echo "You can use the template in the README.md file."
else
    echo "✓ .env file found"
fi

# Generate JWT secret if not exists
echo ""
echo "To generate a secure JWT secret, run:"
echo "  python -c \"import secrets; print(secrets.token_urlsafe(32))\""

echo ""
echo "================================"
echo "✓ Setup complete!"
echo ""
echo "To run the application:"
echo "  1. Activate virtual environment: source venv/bin/activate"
echo "  2. Run the server: uvicorn main:app --reload"
echo ""
echo "Or simply run: python main.py"
echo ""
echo "API Documentation will be available at:"
echo "  http://localhost:8000/docs"
echo ""

