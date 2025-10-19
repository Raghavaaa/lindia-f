#!/bin/bash

# Vercel Deployment Script
echo "🚀 Starting Vercel deployment preparation..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Ready for Vercel deployment"
    echo ""
    echo "Next steps:"
    echo "1. Push to GitHub: git push lindia-f main"
    echo "2. Vercel will automatically deploy from the main branch"
    echo "3. Check Vercel dashboard for deployment status"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
