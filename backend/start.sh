#!/bin/bash

# LegalIndia Backend Startup Script
# This script handles environment setup and starts the server

set -e

echo "🚀 Starting LegalIndia Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo "📝 Creating .env from env.example..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ Created .env file. Please edit it with your API keys."
        exit 1
    else
        echo "❌ env.example not found. Please create .env manually."
        exit 1
    fi
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check required environment variables
REQUIRED_VARS=("DEEPSEEK_API_KEY" "HF_TOKEN" "JWT_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    printf '%s\n' "${MISSING_VARS[@]}"
    echo ""
    echo "Please set these variables in your .env file"
    exit 1
fi

# Set defaults
export PORT=${PORT:-8080}
export HOST=${HOST:-0.0.0.0}
export NODE_ENV=${NODE_ENV:-production}

echo "📦 Environment: $NODE_ENV"
echo "🌐 Host: $HOST"
echo "🔌 Port: $PORT"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm ci
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "🔨 Building TypeScript..."
    npm run build
fi

# Start the server
echo "✅ Starting server..."
npm start

