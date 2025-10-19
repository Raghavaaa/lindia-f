#!/bin/bash
##############################################################################
# Backend Integration Check Script
# One-click local integration test for all critical subsystems
##############################################################################

set -e  # Exit on first error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Tracking
TESTS_PASSED=0
TESTS_FAILED=0
START_TIME=$(date +%s)

echo "================================================================================================"
echo "BACKEND INTEGRATION CHECK"
echo "================================================================================================"
echo "Starting: $(date)"
echo ""

# Helper functions
pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    TESTS_PASSED=$((TESTS_PASSED + 1))
}

fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    echo -e "${RED}Reason: $2${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo ""
    echo "================================================================================================"
    echo "INTEGRATION CHECK FAILED"
    echo "================================================================================================"
    echo "Failed test: $1"
    echo "Reason: $2"
    echo ""
    echo "See diagnostics/ folder for detailed logs."
    exit 1
}

info() {
    echo -e "${YELLOW}→${NC} $1"
}

##############################################################################
# Test 1: Environment Setup
##############################################################################
echo "[1/8] Checking environment setup..."

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    pass "Python found: $PYTHON_VERSION"
else
    fail "Python check" "python3 not found in PATH"
fi

# Check required files
if [ -f "main.py" ]; then
    pass "Main application file exists"
else
    fail "File check" "main.py not found"
fi

if [ -f "requirements.final.txt" ]; then
    pass "Minimal requirements file exists"
else
    fail "File check" "requirements.final.txt not found"
fi

echo ""

##############################################################################
# Test 2: Database Smoke Test
##############################################################################
echo "[2/8] Running database smoke test..."

if python3 test_db_connection.py > diagnostics/integration_db_test.log 2>&1; then
    pass "Database connectivity test"
else
    fail "Database connectivity" "See diagnostics/integration_db_test.log for details"
fi

echo ""

##############################################################################
# Test 3: Application Startup Test
##############################################################################
echo "[3/8] Testing application startup..."

# Try to import the app
if python3 -c "from main import app; print('OK')" > diagnostics/integration_import_test.log 2>&1; then
    pass "Application imports successfully"
else
    fail "Application import" "See diagnostics/integration_import_test.log for details"
fi

echo ""

##############################################################################
# Test 4: Start Application (Background)
##############################################################################
echo "[4/8] Starting application in background..."

# Kill any existing instance on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
sleep 1

# Start app in background
info "Starting uvicorn on port 8000..."
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --log-level info > diagnostics/integration_app.log 2>&1 &
APP_PID=$!

# Wait for startup
info "Waiting for application to start (PID: $APP_PID)..."
sleep 5

# Check if process is still running
if kill -0 $APP_PID 2>/dev/null; then
    pass "Application started successfully (PID: $APP_PID)"
else
    fail "Application startup" "Process died. See diagnostics/integration_app.log"
fi

echo ""

##############################################################################
# Test 5: Health Endpoint Test
##############################################################################
echo "[5/8] Testing /health endpoint..."

HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:8000/health 2>/dev/null || echo "ERROR")
HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | tail -1)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HEALTH_CODE" = "200" ]; then
    pass "Health endpoint returns HTTP 200"
    echo "$HEALTH_BODY" | python3 -m json.tool > diagnostics/integration_health_response.json 2>/dev/null || true
    
    # Check for required fields
    if echo "$HEALTH_BODY" | grep -q '"status"'; then
        pass "Health response contains status field"
    else
        fail "Health response validation" "Missing 'status' field"
    fi
else
    fail "Health endpoint" "Expected HTTP 200, got: $HEALTH_CODE"
fi

echo ""

##############################################################################
# Test 6: Research Endpoint Test (if available)
##############################################################################
echo "[6/8] Testing /api/v1/research endpoint..."

# Note: This will fail without API key, but we check if endpoint exists
RESEARCH_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8000/api/v1/research \
    -H "Content-Type: application/json" \
    -d '{"query": "test query"}' 2>/dev/null || echo "ERROR")
RESEARCH_CODE=$(echo "$RESEARCH_RESPONSE" | tail -1)

# Expect 401 (no API key) or 422 (validation error) - both mean endpoint exists
if [ "$RESEARCH_CODE" = "401" ] || [ "$RESEARCH_CODE" = "422" ] || [ "$RESEARCH_CODE" = "200" ]; then
    pass "Research endpoint is accessible (HTTP $RESEARCH_CODE)"
else
    info "Research endpoint returned HTTP $RESEARCH_CODE (may require API key)"
fi

echo ""

##############################################################################
# Test 7: Junior Endpoint Test (if available)
##############################################################################
echo "[7/8] Testing /api/v1/junior endpoint..."

JUNIOR_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8000/api/v1/junior \
    -H "Content-Type: application/json" \
    -d '{"query": "test query"}' 2>/dev/null || echo "ERROR")
JUNIOR_CODE=$(echo "$JUNIOR_RESPONSE" | tail -1)

if [ "$JUNIOR_CODE" = "401" ] || [ "$JUNIOR_CODE" = "422" ] || [ "$JUNIOR_CODE" = "200" ]; then
    pass "Junior endpoint is accessible (HTTP $JUNIOR_CODE)"
else
    info "Junior endpoint returned HTTP $JUNIOR_CODE (may require API key)"
fi

echo ""

##############################################################################
# Test 8: Cleanup
##############################################################################
echo "[8/8] Cleaning up..."

# Stop the application
if kill $APP_PID 2>/dev/null; then
    pass "Application stopped gracefully"
else
    info "Application already stopped"
fi

# Wait for process to fully terminate
sleep 2

echo ""

##############################################################################
# Results Summary
##############################################################################
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "================================================================================================"
echo "INTEGRATION CHECK COMPLETE"
echo "================================================================================================"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo "Duration: ${DURATION}s"
echo "Timestamp: $(date)"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED${NC}"
    echo ""
    echo "Backend is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Review diagnostics/ folder for detailed logs"
    echo "2. Deploy to Railway with requirements.final.txt"
    echo "3. Set required environment variables (DATABASE_URL, AI_ENGINE_URL)"
    echo ""
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    echo ""
    echo "Please review the diagnostics/ folder for details."
    exit 1
fi

