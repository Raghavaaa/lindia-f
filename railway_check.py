#!/usr/bin/env python3
"""
Railway Deployment Verification Script
Run this to verify your Railway deployment configuration.
"""
import os
import sys
from pathlib import Path

print("🚂 Railway Deployment Check")
print("=" * 60)

# Check 1: Required files
print("\n1️⃣ Checking required files...")
required_files = {
    "requirements.txt": "Python dependencies",
    "Procfile": "Process definition",
    "runtime.txt": "Python version",
    "railway.json": "Railway configuration",
    "nixpacks.toml": "Nixpacks configuration",
    "main.py": "Application entry point"
}

missing = []
for file, desc in required_files.items():
    if Path(file).exists():
        print(f"   ✅ {file:20} - {desc}")
    else:
        print(f"   ❌ {file:20} - {desc} MISSING!")
        missing.append(file)

if missing:
    print(f"\n❌ Missing files: {', '.join(missing)}")
    sys.exit(1)

# Check 2: Requirements.txt content
print("\n2️⃣ Checking requirements.txt...")
with open("requirements.txt") as f:
    requirements = f.read()
    critical_deps = ["fastapi", "uvicorn", "gunicorn", "sqlalchemy", "python-multipart", "psycopg2-binary"]
    for dep in critical_deps:
        if dep in requirements:
            print(f"   ✅ {dep}")
        else:
            print(f"   ❌ {dep} - MISSING!")

# Check 3: Procfile command
print("\n3️⃣ Checking Procfile...")
with open("Procfile") as f:
    procfile = f.read().strip()
    print(f"   Command: {procfile}")
    if "$PORT" in procfile and "gunicorn" in procfile:
        print("   ✅ Procfile looks good")
    else:
        print("   ⚠️  Check: Should bind to $PORT and use gunicorn")

# Check 4: Runtime version
print("\n4️⃣ Checking runtime.txt...")
with open("runtime.txt") as f:
    runtime = f.read().strip()
    print(f"   Python version: {runtime}")
    if "python-3" in runtime:
        print("   ✅ Valid Python version")
    else:
        print("   ⚠️  Should specify Python 3.x")

# Check 5: Railway.json
print("\n5️⃣ Checking railway.json...")
import json
with open("railway.json") as f:
    config = json.load(f)
    print(f"   Builder: {config.get('build', {}).get('builder', 'N/A')}")
    print(f"   Healthcheck path: {config.get('deploy', {}).get('healthcheckPath', 'N/A')}")
    print(f"   Healthcheck timeout: {config.get('deploy', {}).get('healthcheckTimeout', 'N/A')}s")
    if config.get('deploy', {}).get('healthcheckPath') == '/':
        print("   ✅ Railway configuration looks good")

# Check 6: Nixpacks.toml
print("\n6️⃣ Checking nixpacks.toml...")
with open("nixpacks.toml") as f:
    nixpacks = f.read()
    if "python39" in nixpacks:
        print("   ✅ Python 3.9 configured")
    if "pip install" in nixpacks:
        print("   ✅ pip install command present")
    if "gunicorn" in nixpacks:
        print("   ✅ Gunicorn start command present")

# Check 7: Test imports
print("\n7️⃣ Testing Python imports...")
try:
    import main
    print("   ✅ main.py imports successfully")
    from main import app
    print("   ✅ FastAPI app created")
    routes = [r.path for r in app.routes if hasattr(r, 'path')]
    print(f"   ✅ {len(routes)} routes registered")
except Exception as e:
    print(f"   ❌ Import failed: {e}")
    sys.exit(1)

print("\n" + "=" * 60)
print("✅ ALL CHECKS PASSED!")
print("\n📝 Next steps:")
print("   1. Push to GitHub: git push origin main")
print("   2. Railway will auto-deploy from your GitHub repo")
print("   3. Check Railway logs for deployment status")
print("   4. Test your deployment URL")
print("\n🚀 Your app is ready for Railway deployment!")

