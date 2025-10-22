#!/bin/bash

###############################################################################
# Safe Push - Automated Gatekeeping Script
# Prevents pushing broken code to repository
# Enforces V&V checks before every push
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Safe Push - Automated Gatekeeping                        ║"
echo "║  Running Pre-Deployment V&V Checks                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    log_error "You have uncommitted changes. Please commit them first."
    exit 1
fi

# Run V&V checks
log_info "Running comprehensive V&V checks..."
echo ""

if ./vv-system/pre-deploy-check.sh; then
    echo ""
    log_success "All V&V checks passed!"
    echo ""
    
    # Ask for confirmation
    read -p "$(echo -e ${GREEN}V&V checks passed. Proceed with push? [y/N]:${NC} )" -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Get current branch
        BRANCH=$(git rev-parse --abbrev-ref HEAD)
        COMMIT_HASH=$(git rev-parse --short HEAD)
        BUILD_NO=$(git rev-list --count HEAD)
        TAG_NAME="release_verified_$(date +%Y%m%d)_${BUILD_NO}"
        
        log_info "Tagging commit as: ${TAG_NAME}"
        git tag -a "${TAG_NAME}" -m "Verified build - all V&V checks passed"
        
        log_info "Pushing to origin/${BRANCH}..."
        git push origin "${BRANCH}"
        
        log_info "Pushing tags..."
        git push origin "${TAG_NAME}"
        
        echo ""
        log_success "Push completed successfully!"
        log_success "Tagged as: ${TAG_NAME}"
        echo ""
        
        # Save last good commit
        echo "${COMMIT_HASH}" > .vv-system-last-good-commit
        
        exit 0
    else
        log_warning "Push cancelled by user."
        exit 1
    fi
else
    echo ""
    log_error "V&V checks FAILED!"
    log_error "Push BLOCKED to prevent broken build."
    echo ""
    log_info "Required actions:"
    echo "  1. Review the V&V report in vv-system/reports/"
    echo "  2. Fix all failed checks"
    echo "  3. Run ./vv-system/safe-push.sh again"
    echo ""
    exit 1
fi

