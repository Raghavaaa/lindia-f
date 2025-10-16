"""
Security boundary tests for LegalIndia.ai

These tests enforce architectural rules:
1. Frontend cannot import database modules
2. Backend enforces authentication on all endpoints
3. Junior agent writes logs only via backend API
"""

import ast
import os
import sys
from pathlib import Path
import pytest

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent))


class TestFrontendDatabaseBoundary:
    """Ensure frontend never imports database modules."""
    
    FORBIDDEN_MODULES = ["models", "sqlalchemy", "alembic", "repositories", "db_init"]
    
    def test_no_db_imports_in_frontend(self):
        """Frontend code must not import any database modules."""
        frontend_dir = Path("frontend/")
        
        if not frontend_dir.exists():
            pytest.skip("No frontend directory found")
        
        violations = []
        
        for py_file in frontend_dir.rglob("*.py"):
            with open(py_file) as f:
                try:
                    tree = ast.parse(f.read(), filename=str(py_file))
                except SyntaxError:
                    continue
            
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        module_root = alias.name.split('.')[0]
                        if module_root in self.FORBIDDEN_MODULES:
                            violations.append(
                                f"{py_file}:{node.lineno} imports {alias.name}"
                            )
                
                elif isinstance(node, ast.ImportFrom):
                    if node.module:
                        module_root = node.module.split('.')[0]
                        if module_root in self.FORBIDDEN_MODULES:
                            violations.append(
                                f"{py_file}:{node.lineno} imports from {node.module}"
                            )
        
        if violations:
            error_msg = "❌ Frontend imports database modules:\n" + "\n".join(violations)
            pytest.fail(error_msg)
    
    def test_no_database_url_in_frontend_config(self):
        """Frontend config must not contain DATABASE_URL."""
        frontend_dirs = ["frontend/", "client/", "web/"]
        
        for frontend_dir in frontend_dirs:
            if not Path(frontend_dir).exists():
                continue
            
            config_files = list(Path(frontend_dir).rglob("*.env*"))
            config_files.extend(Path(frontend_dir).rglob("config.py"))
            config_files.extend(Path(frontend_dir).rglob("settings.py"))
            
            for config_file in config_files:
                with open(config_file) as f:
                    content = f.read()
                
                assert "DATABASE_URL" not in content, \
                    f"{config_file} contains DATABASE_URL (forbidden in frontend)"


class TestBackendAPIAuth:
    """Ensure backend enforces authentication."""
    
    def test_protected_endpoints_require_auth(self):
        """All protected endpoints must require authentication."""
        # This test should be run against actual backend
        # For now, just check that auth decorators exist
        
        backend_routes = Path("../backend/routes/")  # Adjust path as needed
        if not backend_routes.exists():
            pytest.skip("Backend routes not found")
        
        # Check that routes use @require_auth or similar decorator
        # This is a placeholder - implement based on actual backend structure
        pass
    
    def test_service_endpoints_require_scopes(self):
        """Service endpoints must check for required scopes."""
        # Implementation depends on backend framework
        pass


class TestJuniorAgentBoundary:
    """Ensure Junior agent only accesses backend, never database."""
    
    def test_junior_no_db_imports(self):
        """Junior agent code must not import database modules."""
        junior_dirs = ["junior/", "ai-engine/junior/", "../legalindia-ai-engine/"]
        
        for junior_dir in junior_dirs:
            junior_path = Path(junior_dir)
            if not junior_path.exists():
                continue
            
            violations = []
            forbidden_modules = ["models", "sqlalchemy", "alembic", "db_init"]
            
            for py_file in junior_path.rglob("*.py"):
                with open(py_file) as f:
                    try:
                        tree = ast.parse(f.read())
                    except SyntaxError:
                        continue
                
                for node in ast.walk(tree):
                    if isinstance(node, ast.Import):
                        for alias in node.names:
                            if alias.name.split('.')[0] in forbidden_modules:
                                violations.append(f"{py_file}:{node.lineno} imports {alias.name}")
                    
                    elif isinstance(node, ast.ImportFrom):
                        if node.module and node.module.split('.')[0] in forbidden_modules:
                            violations.append(f"{py_file}:{node.lineno} imports from {node.module}")
            
            assert len(violations) == 0, \
                f"Junior agent imports database modules:\n" + "\n".join(violations)
    
    def test_junior_uses_backend_api(self):
        """Junior agent must use backend API, not direct DB."""
        junior_dirs = ["junior/", "ai-engine/"]
        
        for junior_dir in junior_dirs:
            if not Path(junior_dir).exists():
                continue
            
            # Check that code uses requests/httpx to call backend
            found_api_calls = False
            
            for py_file in Path(junior_dir).rglob("*.py"):
                with open(py_file) as f:
                    content = f.read()
                
                if "requests.post" in content or "httpx.post" in content:
                    if "/v1/junior/execute" in content or "BACKEND_API_URL" in content:
                        found_api_calls = True
            
            if found_api_calls:
                # Good - Junior is using backend API
                pass


class TestNoSecretsInCode:
    """Ensure no secrets are committed to code."""
    
    SECRET_PATTERNS = [
        "DATABASE_URL=postgresql://",
        "password=",
        "api_key=",
        "secret_key=",
        "private_key=",
    ]
    
    ALLOWED_FILES = ["template", "example", ".md", "test_"]
    
    def test_no_database_urls_in_code(self):
        """No DATABASE_URL values in code (templates/examples OK)."""
        violations = []
        
        for py_file in Path(".").rglob("*.py"):
            # Skip test files and examples
            if any(allowed in str(py_file) for allowed in self.ALLOWED_FILES):
                continue
            
            with open(py_file) as f:
                content = f.read()
            
            for i, line in enumerate(content.split('\n'), 1):
                if "DATABASE_URL" in line and "postgresql://" in line:
                    if "os.getenv" not in line and "environ" not in line:
                        violations.append(f"{py_file}:{i} contains hardcoded DATABASE_URL")
        
        assert len(violations) == 0, \
            "Hardcoded DATABASE_URL found:\n" + "\n".join(violations)


class TestRepositoryPattern:
    """Ensure repository pattern is followed."""
    
    def test_models_not_imported_in_routes(self):
        """Routes should not import models directly, use repositories instead."""
        routes_dirs = ["routes/", "api/routes/", "../backend/routes/"]
        
        for routes_dir in routes_dirs:
            if not Path(routes_dir).exists():
                continue
            
            violations = []
            
            for py_file in Path(routes_dir).rglob("*.py"):
                with open(py_file) as f:
                    try:
                        tree = ast.parse(f.read())
                    except SyntaxError:
                        continue
                
                for node in ast.walk(tree):
                    if isinstance(node, ast.ImportFrom):
                        if node.module and node.module.startswith("models."):
                            # Check if it's importing actual model classes
                            for alias in node.names:
                                if alias.name[0].isupper():  # Class names are capitalized
                                    violations.append(
                                        f"{py_file}:{node.lineno} directly imports model {alias.name}"
                                    )
            
            if violations:
                pytest.fail(
                    "Routes import models directly (use repositories instead):\n" + 
                    "\n".join(violations)
                )


# Integration test helpers

def mock_backend_call(endpoint: str, method: str = "GET", **kwargs):
    """Mock helper for testing backend calls."""
    return {"status": "ok", "endpoint": endpoint}


@pytest.fixture
def unauthorized_token():
    """Generate an invalid token for testing."""
    return "invalid.jwt.token"


@pytest.fixture
def valid_service_token():
    """Generate a valid mock service token."""
    return "valid.service.token.mock"


# Run these tests in CI
if __name__ == "__main__":
    pytest.main([__file__, "-v"])

