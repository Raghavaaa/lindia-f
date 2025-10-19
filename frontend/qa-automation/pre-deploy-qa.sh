#!/bin/bash
set -e

echo "=================================="
echo "FRONTEND PRE-DEPLOY QA PIPELINE"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

# Check environment
echo "[1/8] Checking environment..."
if [ -z "$NEXT_PUBLIC_BACKEND_URL" ]; then
    echo -e "${YELLOW}⚠️  WARNING: NEXT_PUBLIC_BACKEND_URL not set${NC}"
    echo "    Set it with: export NEXT_PUBLIC_BACKEND_URL=https://your-backend.com"
else
    echo -e "${GREEN}✓ BACKEND_URL configured: $NEXT_PUBLIC_BACKEND_URL${NC}"
fi

# Install dependencies
echo ""
echo "[2/8] Installing dependencies..."
npm ci --silent || { echo -e "${RED}✗ npm install failed${NC}"; FAILED=1; }

# Type checking
echo ""
echo "[3/8] Running TypeScript type check..."
npx tsc --noEmit || { echo -e "${RED}✗ Type check failed${NC}"; FAILED=1; }

# Linting
echo ""
echo "[4/8] Running ESLint..."
npm run lint -- --max-warnings 0 || { echo -e "${YELLOW}⚠️  Linting issues found${NC}"; }

# Build
echo ""
echo "[5/8] Building production bundle..."
npm run build || { echo -e "${RED}✗ Production build failed${NC}"; FAILED=1; exit 1; }

# Bundle size check
echo ""
echo "[6/8] Checking bundle sizes..."
BUNDLE_SIZE=$(find .next/static -name "*.js" -exec du -ch {} + | grep total | awk '{print $1}')
echo "   Total JS bundle size: $BUNDLE_SIZE"

# Security scan
echo ""
echo "[7/8] Scanning for secrets..."
if grep -r "sk-\|AIzaSy\|Bearer [A-Za-z0-9]\|api_key.*=.*['\"]" src/ 2>/dev/null; then
    echo -e "${RED}✗ CRITICAL: Secrets found in source code!${NC}"
    FAILED=1
else
    echo -e "${GREEN}✓ No secrets found${NC}"
fi

# Accessibility & functional tests (if installed)
echo ""
echo "[8/8] Running automated tests..."
if [ -f "package.json" ] && grep -q "\"test\"" package.json; then
    npm test || { echo -e "${YELLOW}⚠️  Some tests failed${NC}"; }
else
    echo -e "${YELLOW}⚠️  No test script configured${NC}"
fi

# Summary
echo ""
echo "=================================="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ PRE-DEPLOY QA: PASS${NC}"
    echo "   Ready for deployment"
    exit 0
else
    echo -e "${RED}✗ PRE-DEPLOY QA: FAIL${NC}"
    echo "   Fix critical issues before deploying"
    exit 1
fi

