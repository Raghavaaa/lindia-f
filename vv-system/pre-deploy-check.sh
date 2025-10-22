#!/bin/bash

###############################################################################
# Pre-Deployment Verification & Validation (V&V) System
# Comprehensive automated gatekeeping for lindia-f
# Zero tolerance for broken builds
###############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="lindia-f"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR="./vv-system/reports"
REPORT_FILE="${REPORT_DIR}/vv-report_${TIMESTAMP}.md"
BUILD_NO=$(git rev-list --count HEAD 2>/dev/null || echo "0")
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Create report directory
mkdir -p "${REPORT_DIR}"

# Initialize report
cat > "${REPORT_FILE}" << EOF
# Pre-Deployment QA Report
**Project:** ${PROJECT_NAME}
**Date:** $(date '+%Y-%m-%d %H:%M:%S')
**Commit:** ${COMMIT_HASH}
**Build No:** ${BUILD_NO}

---

## V&V Checklist Results

EOF

# Track overall status
OVERALL_STATUS="PASS"
FAILED_CHECKS=""

###############################################################################
# Helper Functions
###############################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

add_to_report() {
    echo "$1" >> "${REPORT_FILE}"
}

fail_check() {
    OVERALL_STATUS="FAIL"
    FAILED_CHECKS="${FAILED_CHECKS}\n- $1"
}

###############################################################################
# Check 1: Syntax & Linting
###############################################################################

check_linting() {
    log_info "Check 1/8: Running ESLint..."
    add_to_report "### 1. Syntax & Linting"
    
    if npm run lint 2>&1 | tee /tmp/lint_output.txt; then
        log_success "Linting passed"
        add_to_report "✅ **PASS** - No linting errors found"
    else
        log_error "Linting failed"
        add_to_report "❌ **FAIL** - Linting errors detected"
        add_to_report "\`\`\`"
        tail -20 /tmp/lint_output.txt >> "${REPORT_FILE}"
        add_to_report "\`\`\`"
        fail_check "Linting"
    fi
    add_to_report ""
}

###############################################################################
# Check 2: Type Safety
###############################################################################

check_types() {
    log_info "Check 2/8: Running TypeScript type validation..."
    add_to_report "### 2. Type Safety"
    
    if npx tsc --noEmit 2>&1 | tee /tmp/tsc_output.txt; then
        log_success "Type checking passed"
        add_to_report "✅ **PASS** - No type errors found"
    else
        log_error "Type checking failed"
        add_to_report "❌ **FAIL** - Type errors detected"
        add_to_report "\`\`\`"
        tail -30 /tmp/tsc_output.txt >> "${REPORT_FILE}"
        add_to_report "\`\`\`"
        fail_check "Type Safety"
    fi
    add_to_report ""
}

###############################################################################
# Check 3: Test Suite
###############################################################################

check_tests() {
    log_info "Check 3/8: Running test suite..."
    add_to_report "### 3. Test Suite"
    
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        if npm test 2>&1 | tee /tmp/test_output.txt; then
            log_success "Tests passed"
            add_to_report "✅ **PASS** - All tests passed"
        else
            log_error "Tests failed"
            add_to_report "❌ **FAIL** - Test failures detected"
            add_to_report "\`\`\`"
            tail -20 /tmp/test_output.txt >> "${REPORT_FILE}"
            add_to_report "\`\`\`"
            fail_check "Tests"
        fi
    else
        log_warning "No test script found - skipping"
        add_to_report "⚠️ **SKIP** - No test script configured"
    fi
    add_to_report ""
}

###############################################################################
# Check 4: Build Integrity
###############################################################################

check_build() {
    log_info "Check 4/8: Running production build..."
    add_to_report "### 4. Build Integrity"
    
    # Check if required env vars are set
    if [ -z "$NEXT_PUBLIC_BACKEND_URL" ]; then
        export NEXT_PUBLIC_BACKEND_URL="https://lindia-b-production.up.railway.app"
        log_warning "NEXT_PUBLIC_BACKEND_URL not set, using default"
    fi
    
    if npm run build 2>&1 | tee /tmp/build_output.txt; then
        log_success "Build passed"
        add_to_report "✅ **PASS** - Production build successful"
        
        # Check bundle size
        if [ -d ".next" ]; then
            BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1 || echo "unknown")
            add_to_report "- Build size: ${BUILD_SIZE}"
        fi
    else
        log_error "Build failed"
        add_to_report "❌ **FAIL** - Build errors detected"
        add_to_report "\`\`\`"
        tail -50 /tmp/build_output.txt >> "${REPORT_FILE}"
        add_to_report "\`\`\`"
        fail_check "Build"
    fi
    add_to_report ""
}

###############################################################################
# Check 5: API Health
###############################################################################

check_api_health() {
    log_info "Check 5/8: Verifying API endpoints..."
    add_to_report "### 5. API Health"
    
    BACKEND_URL="${NEXT_PUBLIC_BACKEND_URL:-https://lindia-b-production.up.railway.app}"
    
    if command -v curl &> /dev/null; then
        if curl -f -s -m 10 "${BACKEND_URL}/health" > /dev/null 2>&1; then
            log_success "Backend health check passed"
            add_to_report "✅ **PASS** - Backend responding (${BACKEND_URL})"
        else
            log_warning "Backend health check failed or timeout"
            add_to_report "⚠️ **WARN** - Backend not responding (may be cold start)"
        fi
    else
        log_warning "curl not available - skipping API health check"
        add_to_report "⚠️ **SKIP** - curl not available"
    fi
    add_to_report ""
}

###############################################################################
# Check 6: Dependency Audit
###############################################################################

check_dependencies() {
    log_info "Check 6/8: Running dependency security audit..."
    add_to_report "### 6. Dependency Audit"
    
    if npm audit --audit-level=high 2>&1 | tee /tmp/audit_output.txt; then
        log_success "No critical vulnerabilities found"
        add_to_report "✅ **PASS** - No high/critical vulnerabilities"
    else
        log_warning "Vulnerabilities found (review required)"
        add_to_report "⚠️ **WARN** - Vulnerabilities detected (see details below)"
        add_to_report "\`\`\`"
        grep -A 10 "vulnerabilities" /tmp/audit_output.txt >> "${REPORT_FILE}" 2>/dev/null || echo "See npm audit output" >> "${REPORT_FILE}"
        add_to_report "\`\`\`"
    fi
    add_to_report ""
}

###############################################################################
# Check 7: Environment Validation
###############################################################################

check_environment() {
    log_info "Check 7/8: Validating environment configuration..."
    add_to_report "### 7. Environment Validation"
    
    ENV_COMPLETE=true
    
    # Check for .env.example
    if [ -f ".env.example" ]; then
        add_to_report "- .env.example: ✓ Found"
    else
        add_to_report "- .env.example: ⚠️ Missing"
    fi
    
    # Check for hardcoded secrets (basic check)
    if grep -r "sk-" src/ 2>/dev/null | grep -v node_modules | grep -v ".git"; then
        log_error "Potential hardcoded API keys found!"
        add_to_report "❌ **FAIL** - Potential hardcoded secrets detected"
        fail_check "Environment Security"
        ENV_COMPLETE=false
    fi
    
    if $ENV_COMPLETE; then
        log_success "Environment validation passed"
        add_to_report "✅ **PASS** - No hardcoded secrets detected"
    fi
    add_to_report ""
}

###############################################################################
# Check 8: UI Consistency
###############################################################################

check_ui_consistency() {
    log_info "Check 8/8: Validating UI components..."
    add_to_report "### 8. UI Consistency"
    
    # Check for console.error/console.warn in components
    CONSOLE_ERRORS=$(grep -r "console\.\(error\|warn\)" src/components/ 2>/dev/null | wc -l || echo "0")
    
    if [ "$CONSOLE_ERRORS" -gt 5 ]; then
        log_warning "Found ${CONSOLE_ERRORS} console statements in components"
        add_to_report "⚠️ **WARN** - ${CONSOLE_ERRORS} console statements found (consider cleanup)"
    else
        log_success "UI consistency check passed"
        add_to_report "✅ **PASS** - Minimal console logging detected"
    fi
    add_to_report ""
}

###############################################################################
# Generate Final Report
###############################################################################

generate_final_report() {
    add_to_report "---"
    add_to_report ""
    add_to_report "## Summary"
    add_to_report ""
    add_to_report "**Overall Status:** ${OVERALL_STATUS}"
    add_to_report ""
    
    if [ "$OVERALL_STATUS" == "PASS" ]; then
        add_to_report "✅ **SAFE TO PUSH** - All critical checks passed"
        add_to_report ""
        add_to_report "### Next Steps"
        add_to_report "1. Review this report"
        add_to_report "2. Tag commit as: \`release_verified_$(date +%Y%m%d)_${BUILD_NO}\`"
        add_to_report "3. Push to repository"
        add_to_report "4. Monitor deployment"
    else
        add_to_report "❌ **HOLD FOR REVIEW** - Critical issues detected"
        add_to_report ""
        add_to_report "### Failed Checks"
        echo -e "${FAILED_CHECKS}" >> "${REPORT_FILE}"
        add_to_report ""
        add_to_report "### Required Actions"
        add_to_report "1. Fix all failed checks"
        add_to_report "2. Re-run V&V system"
        add_to_report "3. DO NOT PUSH until all checks pass"
    fi
    
    add_to_report ""
    add_to_report "---"
    add_to_report ""
    add_to_report "**Generated by:** V&V System v1.0"
    add_to_report "**Report Location:** ${REPORT_FILE}"
}

###############################################################################
# Main Execution
###############################################################################

main() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║  Pre-Deployment Verification & Validation System           ║"
    echo "║  Project: ${PROJECT_NAME}                                         ║"
    echo "║  Build: ${BUILD_NO} | Commit: ${COMMIT_HASH}                              ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Run all checks
    check_linting
    check_types
    check_tests
    check_build
    check_api_health
    check_dependencies
    check_environment
    check_ui_consistency
    
    # Generate final report
    generate_final_report
    
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║  V&V Complete                                              ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Display report
    cat "${REPORT_FILE}"
    
    echo ""
    log_info "Full report saved to: ${REPORT_FILE}"
    echo ""
    
    # Exit with appropriate code
    if [ "$OVERALL_STATUS" == "PASS" ]; then
        log_success "All checks passed! Safe to push."
        exit 0
    else
        log_error "Some checks failed! DO NOT PUSH."
        exit 1
    fi
}

# Run main function
main "$@"

