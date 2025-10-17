#!/bin/bash
# Fix Client Persistence Issues
# This script diagnoses and fixes client database problems

echo "======================================================================="
echo "🔧 CLIENT PERSISTENCE FIX"
echo "======================================================================="

# 1. Check if running on Railway
if [ -n "$RAILWAY_ENVIRONMENT" ]; then
    echo "🚂 Running on Railway - checking PostgreSQL..."
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ DATABASE_URL not set! Add PostgreSQL service to Railway."
        exit 1
    fi
    echo "✅ DATABASE_URL configured"
else
    echo "💻 Running locally - using SQLite"
fi

# 2. Initialize database tables
echo ""
echo "📊 Initializing database tables..."
python3 db_init.py

# 3. Run auto-check
echo ""
echo "🔍 Running auto-check..."
python3 test_client_autocheck.py

# 4. Check if backend is running
echo ""
echo "🌐 Checking if backend is running..."
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Backend is running on port 8000"
else
    echo "⚠️  Backend not running. Start with: uvicorn main:app --reload"
fi

echo ""
echo "======================================================================="
echo "✅ FIX COMPLETE"
echo "======================================================================="
echo ""
echo "Next steps:"
echo "1. If running locally: uvicorn main:app --reload --port 8000"
echo "2. Test client creation via API"
echo "3. Check logs for any errors"
echo ""

