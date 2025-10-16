# Security Architecture - LegalIndia.ai

**Version:** 1.0  
**Date:** 2025-10-16  
**Status:** MANDATORY - All engineers must follow these rules

---

## 🔒 Core Security Principle

**The database is a protected backend service — no direct connections from frontend or AI engine; all reads/writes go through the backend API only.**

---

## Authentication & Network Security

### Backend-Only Access
- ✅ **ONLY backend service accounts** (app role) hold DB credentials
- ✅ Store credentials in secrets manager:
  - Railway environment variables (production)
  - GitHub Secrets (CI/CD)
  - HashiCorp Vault (optional, enterprise)
- ❌ **NEVER** store credentials in:
  - Code repositories
  - Frontend environment variables
  - AI Engine configuration
  - Docker images
  - Log files

### No Frontend/AI DB Credentials
- ❌ Frontend **MUST NEVER** receive `DATABASE_URL` or any DB credentials
- ❌ AI Engine **MUST NEVER** receive `DATABASE_URL` or any DB credentials
- ✅ Enforce with CI secret-permission rules (see CI Enforcement section)
- ✅ Static analysis must fail builds that attempt to import DB modules in frontend

### Service-to-Service Authentication
- ✅ AI Engine and internal services call backend via **authenticated channels**:
  - **mTLS** (mutual TLS) for service-to-service, OR
  - **Bearer JWTs** issued to service accounts
- ✅ Backend validates all tokens and enforces scopes
- ✅ Short TTL (< 1 hour) for service tokens
- ✅ Regular rotation (weekly minimum)

### Network Restrictions
- ✅ Database accepts connections **ONLY from**:
  - Backend instances (Railway internal network)
  - Designated admin IPs (for migrations only)
- ✅ Use private networking / VPC peering when available
- ❌ **DO NOT** expose database publicly (no 0.0.0.0 bindings)
- ✅ Enforce `sslmode=require` for all database connections
- ✅ Configure Railway CIDR allowlists for additional protection

---

## Backend API Contracts

### Minimum Required Endpoints

All endpoints documented in OpenAPI spec (see `BACKEND_API_SPEC.yaml`)

#### 1. Authentication (Service-to-Service)

```
POST /auth/service-token
```
- **Purpose:** Issues scoped JWT for machine-to-machine auth
- **Request:** `{ "service_id": "ai-engine", "client_secret": "..." }`
- **Response:** `{ "access_token": "...", "expires_in": 3600, "scopes": [...] }`
- **TTL:** < 1 hour
- **Scopes:** Issued based on service identity

#### 2. Client & Case Data

```
GET /v1/clients/{client_id}
```
- **Scope:** `client:read`
- **Auth:** Required
- **Returns:** Client details (sanitized)

```
POST /v1/clients
```
- **Scope:** `client:write`
- **Auth:** Required
- **Body:** `{ "name": "...", "contact": "...", "address": "..." }`
- **Returns:** `{ "id": "...", "request_id": "..." }`

```
GET /v1/clients/{id}/cases
```
- **Scope:** `case:read`
- **Auth:** Required
- **Returns:** Array of cases for client

```
POST /v1/cases
```
- **Scope:** `case:write`
- **Auth:** Required
- **Body:** `{ "client_id": "...", "title": "...", "status": "...", ... }`
- **Returns:** `{ "id": "...", "request_id": "..." }`

#### 3. Research & Inference

```
POST /v1/research
```
- **Scope:** `research:write`
- **Auth:** Required
- **Body:** `{ "query_text": "...", "lawyer_id": "..." }`
- **Returns:** `{ "id": "...", "request_id": "..." }`

```
GET /v1/research/{id}
```
- **Scope:** `research:read`
- **Auth:** Required
- **Returns:** Research query and response

#### 4. Junior Agent

```
POST /v1/junior/execute
```
- **Scope:** `junior:invoke`
- **Auth:** Required (service account only)
- **Body:** 
  ```json
  {
    "action": "draft_contract",
    "context": "...",
    "lawyer_id": "...",
    "references": ["client_id:123", "case_id:456"]
  }
  ```
- **Returns:** 
  ```json
  {
    "log_id": "...",
    "response": "...",
    "request_id": "..."
  }
  ```
- **Behavior:** Backend orchestrates, logs to `junior_logs`, triggers inference

```
GET /v1/junior/logs?lawyer_id={id}&limit={n}
```
- **Scope:** `junior:read`
- **Auth:** Required (authorized users/analytics only)
- **Returns:** Paginated junior logs (PII redacted)

#### 5. Inference Logging (Internal Only)

```
POST /v1/inference/log
```
- **Scope:** `inference:write` (internal backend function only)
- **Auth:** Service account (backend-internal)
- **Body:**
  ```json
  {
    "query_id": "...",
    "model_used": "gpt-4",
    "tokens": 150,
    "cost": 0.003,
    "response_hash": "..."
  }
  ```
- **Returns:** `{ "log_id": "...", "request_id": "..." }`

### API Design Requirements

1. ✅ All endpoints validate caller identity & scopes
2. ✅ All write endpoints return `request_id` (UUID) for traceability
3. ✅ All responses include rate limit headers
4. ✅ Errors follow standard format with `error_code`, `message`, `request_id`
5. ✅ Pagination for list endpoints (max 100 items per page)
6. ✅ Input validation using Pydantic schemas

---

## Junior Agent Access Pattern

### How Junior Works

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │────────>│   Backend    │────────>│   Database   │
│   (Browser)  │  HTTPS  │   (FastAPI)  │  Local  │ (PostgreSQL) │
└──────────────┘         └──────────────┘         └──────────────┘
                                 │
                                 │ Authenticated
                                 │ Bearer JWT
                                 ▼
                         ┌──────────────┐
                         │  AI Engine   │
                         │  (Junior)    │
                         └──────────────┘
```

### Rules for Junior

1. ❌ Junior **NEVER** connects to database directly
2. ✅ Junior interacts **ONLY** via backend endpoints:
   - `POST /v1/junior/execute` - Execute action
   - `POST /v1/research` - Query research
   - `GET /v1/clients/{id}` - Get client data (via backend)
3. ✅ For background tasks:
   - Backend enqueues work in Redis/RQ or Railway task service
   - Backend processes with controlled worker tokens
   - Junior executes tasks and returns results to backend
4. ✅ Data flow:
   - Backend fetches data from DB
   - Backend filters by authorization
   - Backend passes filtered data to Junior
   - Junior returns outputs to backend
   - Backend persists logs to DB

### Junior Authentication

```python
# Junior calls backend with service token
headers = {
    "Authorization": f"Bearer {SERVICE_TOKEN}",
    "X-Service-ID": "junior-agent",
    "X-Request-ID": str(uuid.uuid4())
}

response = requests.post(
    "https://api.legalindia.ai/v1/junior/execute",
    headers=headers,
    json={"action": "...", "context": "..."}
)
```

---

## Logs, Audit & Data Surface

### Audit Logging (Required)

All database mutations must log:
- **Who:** user_id or service_id
- **What:** endpoint, HTTP method, payload summary (redacted)
- **When:** ISO 8601 timestamp
- **Where:** origin IP / service hostname
- **request_id:** UUID for traceability

**Storage:**
- Append-only table `audit_logs` in database, OR
- External immutable log (Google Cloud Logging, Datadog)

### Junior & Inference Logs

- ✅ `junior_logs` table: write/read **ONLY via backend endpoints**
- ✅ `inference_logs` table: write/read **ONLY via backend endpoints**
- ✅ Backend enforces **PII redaction** before exposing to analytics
- ✅ Sensitive fields masked:
  - Client names → `[REDACTED]` or initials
  - Phone numbers → last 4 digits only
  - Emails → domain only
  - National IDs → fully masked

### Analytics Access

**Option A: Backend API (Recommended)**
```
GET /v1/analytics/junior_logs?start_date=...&end_date=...&limit=100
GET /v1/analytics/inference_logs?model=...&limit=100
```
- ✅ Read-only endpoints
- ✅ PII automatically redacted
- ✅ Rate limits: 100 req/hour per analytics account
- ✅ Filtering and aggregation in backend

**Option B: Read Replica (Advanced)**
- ✅ Expose PostgreSQL read replica
- ✅ Dedicated `analytics_read` role with SELECT-only permissions
- ✅ Restrict to analytics IPs via CIDR allowlist
- ❌ **NEVER** give analytics write access to production DB

---

## RBAC & Scopes

### Role Definitions

| Role | Description | Scopes |
|------|-------------|--------|
| **lawyer** | Practicing lawyer | `client:read`, `client:write`, `case:read`, `case:write`, `research:read`, `research:write` |
| **admin** | System administrator | All `lawyer` scopes + `user:manage`, `audit:read` |
| **superadmin** | Platform owner | All scopes including `system:migrate`, `user:delete` |
| **analytics** | Data analyst | `analytics:read`, `junior:read`, `inference:read` (read-only, PII redacted) |
| **service-junior** | Junior AI agent | `junior:invoke`, `research:write`, `client:read`, `case:read` |
| **service-ai** | AI Engine | `inference:write`, `research:read`, `research:write` |

### Scope-to-Endpoint Mapping

| Endpoint | Required Scope(s) |
|----------|-------------------|
| `POST /v1/clients` | `client:write` |
| `GET /v1/clients/{id}` | `client:read` |
| `POST /v1/cases` | `case:write` |
| `GET /v1/clients/{id}/cases` | `case:read` |
| `POST /v1/research` | `research:write` |
| `GET /v1/research/{id}` | `research:read` |
| `POST /v1/junior/execute` | `junior:invoke` |
| `GET /v1/junior/logs` | `junior:read` OR `analytics:read` |
| `POST /v1/inference/log` | `inference:write` (internal only) |
| `GET /v1/analytics/*` | `analytics:read` |

### Principle of Least Privilege

- ✅ Services receive **ONLY** the scopes they need
- ✅ Rotate service tokens regularly (weekly minimum, daily recommended)
- ✅ Revoke tokens immediately upon incident or service decommission
- ✅ Audit scope usage: alert on unused scopes or scope creep

---

## Data Protection & PII

### PII Schema Mapping

| Table | PII Fields | Handling |
|-------|------------|----------|
| `users` | `email`, `name` | Hash email for logs; redact name in analytics |
| `clients` | `name`, `contact`, `address` | Redact fully in logs; return initials in analytics |
| `cases` | `description` | Redact sensitive details; return summary only |
| `property_opinions` | `notes` | Redact addresses, financial details |
| `research_queries` | `query_text` | Log only query hash, not full text |

### Encryption

- ✅ **In Transit:** TLS 1.3 for all connections
- ✅ **At Rest:** Database provider encryption (Railway/Postgres default)
- ✅ **Application-Level:** Encrypt `password_hash` with bcrypt (work factor 12+)
- ✅ **Secrets:** Store in secrets manager, never in code

### Redaction Rules

```python
# Example: Backend redaction function
def redact_pii(data: dict, level: str = "analytics") -> dict:
    if level == "analytics":
        data["client_name"] = data["client_name"][:2] + "***"
        data["email"] = data["email"].split("@")[1]  # domain only
        data["phone"] = "***" + data["phone"][-4:]
    return data
```

---

## Performance & Rate Limits

### Rate Limits (Per Actor)

| Actor Type | Limit | Window |
|------------|-------|--------|
| Lawyer | 60 requests | 1 minute |
| Service (Junior/AI) | 300 requests | 1 minute |
| Analytics | 100 requests | 1 hour |
| Public API (future) | 10 requests | 1 minute |

### Concurrency Caps

- ✅ Max 5 concurrent Junior agent tasks per lawyer
- ✅ Max 10 concurrent AI inference requests
- ✅ Queue excess requests with Redis/RQ

### Query Optimization

- ✅ For expensive queries (search, full-text, vector lookup):
  - Backend calls AI Engine / vector store
  - **DO NOT** run heavy SQL on production DB
- ✅ Return paginated results only (max 100 per page)
- ✅ Use database indexes (see migration 04bd3fd5e6c2)
- ✅ Cache frequent queries with Redis (TTL 5 minutes)

---

## Deployment & CI Enforcement

### Static Scan Rules

#### Rule 1: Forbid DB Imports in Frontend
```bash
# CI check (add to .github/workflows/ci.yml)
grep -r "from models import\|import sqlalchemy\|create_engine" frontend/
if [ $? -eq 0 ]; then
  echo "❌ FAIL: Frontend code imports database modules"
  exit 1
fi
```

#### Rule 2: Secret Exposure Scan
```bash
# Use truffleHog, git-secrets, or GitHub secret scanning
trufflehog --regex --entropy=False .
```

#### Rule 3: API Contract Tests
```python
# tests/test_api_contracts.py
def test_backend_requires_auth():
    response = requests.get("https://api.legalindia.ai/v1/clients/123")
    assert response.status_code == 401

def test_junior_endpoint_requires_scope():
    response = requests.post(
        "https://api.legalindia.ai/v1/junior/execute",
        headers={"Authorization": f"Bearer {INVALID_TOKEN}"}
    )
    assert response.status_code == 403
```

### Migration Policy

- ✅ Migrations run by `legalindia_migrate` role ONLY
- ✅ CI must require **human approval** before applying to staging/production
- ✅ Automated tests must pass before migration approval
- ✅ Pre-migration snapshot required (see `MIGRATION_RECORD.md`)

### CI Pipeline Requirements

```yaml
# .github/workflows/security-checks.yml
name: Security Checks

on: [pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check for DB imports in frontend
        run: |
          if grep -r "from models import\|import sqlalchemy" frontend/; then
            echo "❌ Frontend cannot import database modules"
            exit 1
          fi
      
      - name: Scan for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          
      - name: Run API contract tests
        run: pytest tests/test_api_contracts.py
      
      - name: Validate OpenAPI spec
        run: npx @redocly/cli lint BACKEND_API_SPEC.yaml
```

---

## Monitoring & Alerts

### Required Alerts

| Alert | Trigger | Severity | Action |
|-------|---------|----------|--------|
| Unauthorized DB Access | Non-backend IP connects to DB | CRITICAL | Block IP, rotate credentials, investigate |
| Schema Change Attempt | DDL by non-admin role | HIGH | Revoke access, investigate |
| Failed Auth Spike | >10 failed auths in 1 min | MEDIUM | Check for brute force |
| Rate Limit Exceeded | Actor hits limit | LOW | Throttle, log for review |
| Slow Query | Query >5 seconds | MEDIUM | Investigate, optimize |
| PII Exposure | Unredacted PII in logs | CRITICAL | Incident response, notify DPO |

### Dashboards (Recommended)

1. **API Health Dashboard**
   - Request latency (p50, p95, p99)
   - Error rates by endpoint
   - Rate limit hits

2. **Database Dashboard**
   - Connection pool usage
   - Query execution time
   - Slow query log

3. **Security Dashboard**
   - Failed authentication attempts
   - Token issuance/revocation
   - Audit log highlights

### Instrumentation

```python
# Backend: Instrument all endpoints
from prometheus_client import Counter, Histogram

request_count = Counter('api_requests_total', 'Total API requests', ['endpoint', 'method', 'status'])
request_duration = Histogram('api_request_duration_seconds', 'API request duration')

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    request_duration.observe(duration)
    request_count.labels(
        endpoint=request.url.path,
        method=request.method,
        status=response.status_code
    ).inc()
    
    return response
```

---

## Tests & Verifications

### Required Tests

#### 1. Frontend Cannot Import DB Modules
```python
# tests/test_security_boundaries.py
import ast
import os
from pathlib import Path

def test_frontend_no_db_imports():
    """Assert frontend code cannot import database modules."""
    frontend_dir = Path("frontend/")
    forbidden_imports = ["models", "sqlalchemy", "alembic", "repositories"]
    
    for py_file in frontend_dir.rglob("*.py"):
        with open(py_file) as f:
            tree = ast.parse(f.read())
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    assert alias.name.split('.')[0] not in forbidden_imports, \
                        f"{py_file} imports forbidden module {alias.name}"
            
            elif isinstance(node, ast.ImportFrom):
                assert node.module.split('.')[0] not in forbidden_imports, \
                    f"{py_file} imports from forbidden module {node.module}"
```

#### 2. Backend Auth & Scopes
```python
# tests/test_backend_auth.py
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_endpoint_requires_authentication():
    """All protected endpoints require valid auth."""
    endpoints = [
        "/v1/clients",
        "/v1/cases",
        "/v1/research",
        "/v1/junior/execute"
    ]
    
    for endpoint in endpoints:
        response = client.get(endpoint)
        assert response.status_code in [401, 405], \
            f"{endpoint} should require authentication"

def test_endpoint_requires_correct_scope():
    """Endpoints enforce scope requirements."""
    token_without_scope = generate_token(scopes=["client:read"])
    
    response = client.post(
        "/v1/clients",
        headers={"Authorization": f"Bearer {token_without_scope}"},
        json={"name": "Test"}
    )
    
    assert response.status_code == 403
    assert "insufficient_scope" in response.json()["error_code"]
```

#### 3. Junior Flow Integration
```python
# tests/test_junior_flow.py
def test_junior_writes_logs_via_backend():
    """Junior agent writes logs only through backend API."""
    # Execute Junior action
    response = client.post(
        "/v1/junior/execute",
        headers={"Authorization": f"Bearer {JUNIOR_SERVICE_TOKEN}"},
        json={
            "action": "test_action",
            "context": "test context",
            "lawyer_id": "lawyer_123"
        }
    )
    
    assert response.status_code == 200
    log_id = response.json()["log_id"]
    
    # Verify log was written to DB (via backend)
    from db_init import SessionLocal
    from models.junior_log import JuniorLog
    
    session = SessionLocal()
    log = session.query(JuniorLog).filter_by(id=log_id).first()
    assert log is not None
    assert log.action == "test_action"
    session.close()
```

#### 4. No Secrets in Code
```bash
# CI job
- name: Check for secrets
  run: |
    # Fail if any of these patterns found
    if git grep -E "(DATABASE_URL|password|api_key|secret)" -- '*.py' '*.js' '*.ts' | grep -v "test\|example\|template"; then
      echo "❌ Potential secrets found in code"
      exit 1
    fi
```

---

## Runtime Operations Checklist

### Pre-Go-Live Requirements

- [ ] No `DATABASE_URL` in frontend environment variables
- [ ] No `DATABASE_URL` in AI Engine environment variables
- [ ] Service-to-service tokens configured for AI Engine → Backend
- [ ] AI Engine token has minimal scopes: `junior:invoke`, `research:write`
- [ ] Backend endpoints for Junior exist and documented in OpenAPI
- [ ] Audit logging configured and tested
- [ ] Rate limits configured and tested
- [ ] Alerts configured (unauthorized access, schema changes, slow queries)
- [ ] CI checks enabled (no DB imports, no secrets, API tests)
- [ ] OpenAPI spec published and version-tagged
- [ ] Service account credentials stored in secrets manager
- [ ] Database network restricted to backend IPs only
- [ ] SSL enforcement enabled (`sslmode=require`)
- [ ] Monitoring dashboards created (API health, DB health, security)
- [ ] Incident response runbook prepared
- [ ] All engineers trained on security architecture

---

## Failure / Incident Response

### Incident: Non-Backend Service Attempts DB Access

**Immediate Actions:**
1. ⚠️ **BLOCK** - Revoke service token immediately
2. ⚠️ **ROTATE** - Rotate database credentials
3. ⚠️ **INVESTIGATE** - Check audit logs for:
   - What data was accessed?
   - When did access occur?
   - Which service attempted access?
4. ⚠️ **NOTIFY** - Alert security team and system owner
5. ⚠️ **DOCUMENT** - Create incident report with timeline

### Incident: Junior/AI Outputs Sensitive PII

**Immediate Actions:**
1. ⚠️ **MARK** - Tag incident in incident tracking system
2. ⚠️ **ROTATE** - Rotate all service tokens
3. ⚠️ **SEARCH** - Run log search to find similar exposures
4. ⚠️ **REDACT** - Implement additional PII redaction rules
5. ⚠️ **NOTIFY** - Notify stakeholders per data protection runbook
6. ⚠️ **UPDATE** - Update PII schema mapping and redaction logic

### Incident: Database Credentials Leaked

**Immediate Actions:**
1. 🚨 **CRITICAL** - Rotate credentials immediately
2. 🚨 **BLOCK** - Change database network rules to block all connections
3. 🚨 **AUDIT** - Review all database queries since leak time
4. 🚨 **INVESTIGATE** - Determine leak source and scope
5. 🚨 **NOTIFY** - Notify legal/compliance team
6. 🚨 **RESTORE** - If data compromised, restore from pre-leak backup
7. 🚨 **HARDEN** - Implement additional security controls

---

## Reference Documents

- `MIGRATION_RECORD.md` - Database migration procedures
- `BACKEND_API_SPEC.yaml` - OpenAPI specification
- `SERVICE_ACCOUNTS.md` - Service account definitions and scopes
- `CI_ENFORCEMENT_RULES.md` - CI pipeline security checks
- `AUDIT_ALERT_CONFIG.md` - Monitoring and alerting configuration

---

## Sign-off

**Security Architect:** ______________________  
**Engineering Lead:** ______________________  
**Date:** __________  

**All engineers must acknowledge reading and understanding this document before receiving production access.**

