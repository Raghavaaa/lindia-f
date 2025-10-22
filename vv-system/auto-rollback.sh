#!/bin/bash

###############################################################################
# Auto-Rollback Script
# Automatically rollback to last verified commit if deployment fails
###############################################################################

set -e

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
echo "║  Auto-Rollback Script                                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if last good commit file exists
if [ ! -f ".vv-system-last-good-commit" ]; then
    log_error "No last good commit found!"
    log_error "Cannot perform automatic rollback."
    echo ""
    log_info "Manual rollback required:"
    echo "  1. Find last working commit: git log --oneline"
    echo "  2. Create rollback branch: git checkout -b rollback-branch"
    echo "  3. Reset to working commit: git reset --hard <commit-hash>"
    echo "  4. Force push (with caution): git push --force"
    echo ""
    exit 1
fi

LAST_GOOD_COMMIT=$(cat .vv-system-last-good-commit)
CURRENT_COMMIT=$(git rev-parse --short HEAD)

log_info "Current commit: ${CURRENT_COMMIT}"
log_info "Last verified commit: ${LAST_GOOD_COMMIT}"
echo ""

if [ "${CURRENT_COMMIT}" == "${LAST_GOOD_COMMIT}" ]; then
    log_success "Already at last good commit. No rollback needed."
    exit 0
fi

# Ask for confirmation
read -p "$(echo -e ${YELLOW}Rollback to last verified commit? [y/N]:${NC} )" -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_warning "Rollback cancelled."
    exit 1
fi

# Create rollback log
ROLLBACK_LOG="vv-system/reports/rollback_$(date +%Y%m%d_%H%M%S).md"
mkdir -p vv-system/reports

cat > "${ROLLBACK_LOG}" << EOF
# Rollback Log

**Date:** $(date '+%Y-%m-%d %H:%M:%S')
**From Commit:** ${CURRENT_COMMIT}
**To Commit:** ${LAST_GOOD_COMMIT}
**Reason:** Post-deployment validation failure

## Action Taken
- Rolled back to last verified commit
- Failed commit flagged for review

## Failed Commit Details
\`\`\`
$(git log -1 --pretty=format:"%h - %s (%an, %ar)" ${CURRENT_COMMIT})
\`\`\`

## Changes Reverted
\`\`\`
$(git diff --stat ${LAST_GOOD_COMMIT} ${CURRENT_COMMIT})
\`\`\`

---
**Status:** Rollback completed - Review failed commit before re-attempting.
EOF

log_info "Creating rollback branch..."
git checkout -b "rollback-from-${CURRENT_COMMIT}" || true

log_info "Resetting to last good commit..."
git reset --hard "${LAST_GOOD_COMMIT}"

log_info "Rollback log created: ${ROLLBACK_LOG}"
echo ""

log_warning "ROLLBACK COMPLETE"
log_warning "Next steps:"
echo "  1. Review rollback log: ${ROLLBACK_LOG}"
echo "  2. Investigate failed commit: ${CURRENT_COMMIT}"
echo "  3. Fix issues before re-deploying"
echo "  4. To push rollback: git push --force origin main"
echo ""

# Mark failed commit
echo "${CURRENT_COMMIT}" >> .vv-system-failed-commits

log_info "Failed commit marked for review."

