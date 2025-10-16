# CI Enforcement Rules

**Purpose:** Prevent security violations through automated CI checks

---

## Rule 1: Forbid DB Imports in Frontend

**File:** `.github/workflows/security-frontend.yml`

```yaml
name: Frontend Security Check

on: [pull_request]

jobs:
  check-db-imports:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Block DB imports in frontend
        run: |
          if grep -r "from models import\|import sqlalchemy\|create_engine\|from repositories import" frontend/; then
            echo "❌ FAIL: Frontend cannot import database modules"
            echo "Frontend must use backend API only"
            exit 1
          fi
          echo "✓ PASS: No DB imports in frontend"
```

---

## Rule 2: Secret Scanning

**File:** `.github/workflows/security-secrets.yml`

```yaml
name: Secret Scanning

on: [pull_request, push]

jobs:
  scan-secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: TruffleHog Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
```

---

## Rule 3: API Contract Tests

**File:** `.github/workflows/api-tests.yml`

```yaml
name: API Contract Tests

on: [pull_request]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install -r requirements.txt pytest httpx
      
      - name: Run API contract tests
        run: pytest tests/test_api_contracts.py -v
```

---

## Rule 4: OpenAPI Validation

```yaml
- name: Validate OpenAPI Spec
  run: |
    npx @redocly/cli lint BACKEND_API_SPEC.yaml
```

---

## Local Pre-commit Hook

**File:** `.git/hooks/pre-commit`

```bash
#!/bin/bash

# Check for DB imports in frontend
if git diff --cached --name-only | grep "^frontend/" | xargs grep -l "from models import\|import sqlalchemy" 2>/dev/null; then
  echo "❌ Cannot commit: Frontend imports database modules"
  exit 1
fi

# Check for secrets
if git diff --cached | grep -iE "(password|api_key|secret|DATABASE_URL)" | grep -v "template\|example"; then
  echo "⚠️  WARNING: Potential secret detected"
  read -p "Continue? (y/N): " response
  if [[ "$response" != "y" ]]; then
    exit 1
  fi
fi

echo "✓ Pre-commit checks passed"
```

---

## Python Static Analysis

**File:** `scripts/check_security.py`

```python
#!/usr/bin/env python3
import ast
import sys
from pathlib import Path

FORBIDDEN_MODULES = ["models", "sqlalchemy", "alembic", "repositories", "db_init"]

def check_imports(file_path):
    with open(file_path) as f:
        tree = ast.parse(f.read(), filename=str(file_path))
    
    violations = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name.split('.')[0] in FORBIDDEN_MODULES:
                    violations.append(f"{file_path}:{node.lineno} imports {alias.name}")
        elif isinstance(node, ast.ImportFrom):
            if node.module and node.module.split('.')[0] in FORBIDDEN_MODULES:
                violations.append(f"{file_path}:{node.lineno} imports from {node.module}")
    
    return violations

def main():
    frontend_dir = Path("frontend/")
    if not frontend_dir.exists():
        print("✓ No frontend directory found")
        return 0
    
    violations = []
    for py_file in frontend_dir.rglob("*.py"):
        violations.extend(check_imports(py_file))
    
    if violations:
        print("❌ SECURITY VIOLATIONS FOUND:")
        for v in violations:
            print(f"  {v}")
        return 1
    else:
        print("✓ No security violations found")
        return 0

if __name__ == "__main__":
    sys.exit(main())
```

Run with: `python3 scripts/check_security.py`

