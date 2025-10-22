#!/bin/bash

###############################################################################
# Install Git Hooks for V&V System
# Enforces pre-push V&V checks automatically
###############################################################################

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Installing V&V Git Hooks                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Make scripts executable
chmod +x vv-system/pre-deploy-check.sh
chmod +x vv-system/safe-push.sh
chmod +x vv-system/auto-rollback.sh

log_success "Made V&V scripts executable"

# Create pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

# Pre-push hook - Run V&V checks before push
# To bypass (NOT RECOMMENDED): git push --no-verify

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Pre-Push V&V Check                                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ -f "./vv-system/pre-deploy-check.sh" ]; then
    if ./vv-system/pre-deploy-check.sh; then
        echo ""
        echo "✅ V&V checks passed - Push allowed"
        echo ""
        exit 0
    else
        echo ""
        echo "❌ V&V checks FAILED - Push BLOCKED"
        echo ""
        echo "To fix:"
        echo "  1. Review V&V report in vv-system/reports/"
        echo "  2. Fix all issues"
        echo "  3. Try push again"
        echo ""
        echo "To bypass (NOT RECOMMENDED): git push --no-verify"
        echo ""
        exit 1
    fi
else
    echo "⚠️  V&V system not found - Push allowed (Install V&V system!)"
    exit 0
fi
EOF

chmod +x .git/hooks/pre-push

log_success "Installed pre-push hook"

# Create commit-msg hook for versioning
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/bash

# Commit message validation
COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Check if commit message follows conventional commits
if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?:.+"; then
    echo ""
    echo "❌ Invalid commit message format!"
    echo ""
    echo "Commit messages must follow Conventional Commits:"
    echo "  feat: add new feature"
    echo "  fix: bug fix"
    echo "  docs: documentation changes"
    echo "  style: formatting changes"
    echo "  refactor: code refactoring"
    echo "  test: add tests"
    echo "  chore: maintenance tasks"
    echo ""
    echo "Your message: $COMMIT_MSG"
    echo ""
    exit 1
fi

exit 0
EOF

chmod +x .git/hooks/commit-msg

log_success "Installed commit-msg hook"

echo ""
log_success "Git hooks installed successfully!"
echo ""
log_info "Hooks installed:"
echo "  - pre-push: Runs V&V checks before every push"
echo "  - commit-msg: Validates commit message format"
echo ""
log_info "Usage:"
echo "  - Normal push: git push (V&V will run automatically)"
echo "  - Safe push: ./vv-system/safe-push.sh"
echo "  - Rollback: ./vv-system/auto-rollback.sh"
echo ""

