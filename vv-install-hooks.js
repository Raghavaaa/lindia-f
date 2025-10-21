#!/usr/bin/env node

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                         GIT HOOKS INSTALLER                              ║
 * ║              Automatic V&V gate enforcement for commits/push             ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

const preCommitHook = `#!/bin/sh
#
# Pre-commit hook: Run V&V gate before allowing commit
# This ensures no broken code is committed
#

echo ""
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                     PRE-COMMIT V&V GATE ACTIVATED                         ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

cd frontend

# Run V&V gate
node vv-gate.js

if [ $? -ne 0 ]; then
    echo ""
    echo "╔═══════════════════════════════════════════════════════════════════════════╗"
    echo "║                        ✗ COMMIT BLOCKED                                   ║"
    echo "║              V&V checks failed - fix issues before committing             ║"
    echo "╚═══════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "To bypass this check (NOT RECOMMENDED):"
    echo "  git commit --no-verify"
    echo ""
    exit 1
fi

echo ""
echo "✓ V&V checks passed - proceeding with commit"
echo ""

exit 0
`;

const prePushHook = `#!/bin/sh
#
# Pre-push hook: Final V&V gate before push
# This is the last line of defense before code reaches the repository
#

echo ""
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                      PRE-PUSH V&V GATE ACTIVATED                          ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

cd frontend

# Run comprehensive V&V gate
node vv-gate.js

if [ $? -ne 0 ]; then
    echo ""
    echo "╔═══════════════════════════════════════════════════════════════════════════╗"
    echo "║                          ✗ PUSH BLOCKED                                   ║"
    echo "║           Critical V&V failures - deployment not authorized              ║"
    echo "╚═══════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "To bypass this check (NOT RECOMMENDED - will fail in production):"
    echo "  git push --no-verify"
    echo ""
    exit 1
fi

echo ""
echo "✓ V&V gate passed - safe to push"
echo ""
echo "Creating verified release tag..."
node vv-tag.js

exit 0
`;

function installHooks() {
  console.log(`\n${colors.bright}${colors.cyan}╔═══════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║                    INSTALLING V&V GIT HOOKS                               ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚═══════════════════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  // Find git root
  let gitRoot;
  try {
    gitRoot = execSync('git rev-parse --git-dir', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`${colors.yellow}⚠${colors.reset}  Not a git repository - hooks not installed`);
    return 1;
  }
  
  const hooksDir = path.join(gitRoot, 'hooks');
  
  // Ensure hooks directory exists
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }
  
  // Install pre-commit hook
  const preCommitPath = path.join(hooksDir, 'pre-commit');
  fs.writeFileSync(preCommitPath, preCommitHook, { mode: 0o755 });
  console.log(`${colors.green}✓${colors.reset} Installed: ${colors.bright}pre-commit${colors.reset} hook`);
  console.log(`  Path: ${preCommitPath}\n`);
  
  // Install pre-push hook
  const prePushPath = path.join(hooksDir, 'pre-push');
  fs.writeFileSync(prePushPath, prePushHook, { mode: 0o755 });
  console.log(`${colors.green}✓${colors.reset} Installed: ${colors.bright}pre-push${colors.reset} hook`);
  console.log(`  Path: ${prePushPath}\n`);
  
  console.log(`${colors.cyan}ℹ${colors.reset} ${colors.bright}Git hooks successfully installed!${colors.reset}\n`);
  console.log(`${colors.yellow}⚠${colors.reset}  IMPORTANT: V&V gate will now run automatically before:`);
  console.log(`   • Every commit (pre-commit)`);
  console.log(`   • Every push (pre-push)\n`);
  console.log(`${colors.cyan}ℹ${colors.reset}  To bypass (not recommended): use --no-verify flag\n`);
  
  return 0;
}

if (require.main === module) {
  const exitCode = installHooks();
  process.exit(exitCode);
}

module.exports = { installHooks };

