"""
Verification script to check if all dependencies are installed correctly.
Run this after setup to ensure everything is working.
"""
import sys

def check_imports():
    """Check if all required packages can be imported."""
    print("🔍 Verifying LegalIndia.ai Backend Setup\n")
    print("=" * 50)
    
    packages = [
        ("fastapi", "FastAPI"),
        ("uvicorn", "Uvicorn"),
        ("pydantic", "Pydantic"),
        ("pydantic_settings", "Pydantic Settings"),
        ("dotenv", "python-dotenv"),
        ("sqlmodel", "SQLModel"),
        ("httpx", "HTTPX"),
        ("passlib", "Passlib"),
        ("jose", "python-jose"),
        ("loguru", "Loguru"),
        ("sentry_sdk", "Sentry SDK"),
    ]
    
    all_ok = True
    
    for module_name, display_name in packages:
        try:
            __import__(module_name)
            print(f"✓ {display_name:20} - OK")
        except ImportError as e:
            print(f"✗ {display_name:20} - MISSING")
            all_ok = False
    
    print("=" * 50)
    
    if all_ok:
        print("\n✓ All dependencies are installed correctly!")
        print("\nYou can now run the application:")
        print("  python main.py")
        print("\nOr:")
        print("  uvicorn main:app --reload")
        return 0
    else:
        print("\n✗ Some dependencies are missing.")
        print("Please run: pip install -r requirements.txt")
        return 1


def check_structure():
    """Check if all required directories exist."""
    import os
    
    print("\n🔍 Checking project structure...\n")
    
    required_dirs = [
        "app/routes",
        "app/controllers",
        "app/models",
        "app/schemas",
        "app/core",
    ]
    
    all_ok = True
    
    for directory in required_dirs:
        if os.path.exists(directory):
            print(f"✓ {directory:30} - OK")
        else:
            print(f"✗ {directory:30} - MISSING")
            all_ok = False
    
    return all_ok


def check_env():
    """Check if .env file exists."""
    import os
    
    print("\n🔍 Checking configuration...\n")
    
    if os.path.exists(".env"):
        print("✓ .env file found")
        print("\nMake sure to configure:")
        print("  - DATABASE_URL")
        print("  - AI_ENGINE_URL")
        print("  - JWT_SECRET")
        print("  - FRONTEND_ORIGIN")
    else:
        print("⚠️  .env file not found")
        print("Please create a .env file with required variables.")
        print("See README.md for template.")


if __name__ == "__main__":
    exit_code = check_imports()
    check_structure()
    check_env()
    
    print("\n" + "=" * 50)
    print("Verification complete!")
    print("=" * 50 + "\n")
    
    sys.exit(exit_code)

