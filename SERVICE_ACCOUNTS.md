# Service Accounts & Scopes Reference

**Version:** 1.0  
**Last Updated:** 2025-10-16

---

## Service Account Definitions

### 1. `ai-engine`

**Purpose:** AI inference engine for legal research and document processing

**Service ID:** `ai-engine`  
**Token TTL:** 1 hour  
**Rotation:** Daily (automated)

**Scopes:**
- `inference:write` - Log inference metrics
- `research:read` - Read research queries
- `research:write` - Create research responses

**Endpoints Accessed:**
- `POST /v1/inference/log`
- `GET /v1/research/{id}`
- `POST /v1/research`

**Restrictions:**
- Cannot access client/case data directly
- Cannot invoke Junior agent
- Rate limit: 300 req/min

---

### 2. `junior-agent`

**Purpose:** AI Junior assistant for lawyers

**Service ID:** `junior-agent`  
**Token TTL:** 1 hour  
**Rotation:** Daily (automated)

**Scopes:**
- `junior:invoke` - Execute Junior actions
- `research:write` - Submit research queries
- `client:read` - Read client data (filtered by authorization)
- `case:read` - Read case data (filtered by authorization)

**Endpoints Accessed:**
- `POST /v1/junior/execute`
- `POST /v1/research`
- `GET /v1/clients/{id}`
- `GET /v1/clients/{id}/cases`

**Restrictions:**
- Cannot write client/case data
- Cannot access analytics endpoints
- Rate limit: 300 req/min
- Max 5 concurrent tasks per lawyer

---

### 3. `analytics-service`

**Purpose:** Data analytics and reporting

**Service ID:** `analytics-service`  
**Token TTL:** 4 hours  
**Rotation:** Weekly

**Scopes:**
- `analytics:read` - Read analytics data
- `junior:read` - Read Junior logs (PII redacted)
- `inference:read` - Read inference logs

**Endpoints Accessed:**
- `GET /v1/analytics/junior_logs`
- `GET /v1/analytics/inference_logs`
- `GET /v1/junior/logs`

**Restrictions:**
- Read-only access
- PII automatically redacted
- Rate limit: 100 req/hour
- No access to client/case data

---

### 4. `backend-internal`

**Purpose:** Backend internal services (not exposed externally)

**Service ID:** `backend-internal`  
**Token TTL:** N/A (internal only)  
**Rotation:** N/A

**Scopes:**
- `inference:write` - Log inference internally
- `audit:write` - Write audit logs
- All scopes (internal orchestration)

**Endpoints Accessed:**
- All internal functions
- Database direct access (via backend code only)

**Restrictions:**
- Not accessible from external services
- Used only within backend application code

---

## Scope Definitions

| Scope | Description | Granted To |
|-------|-------------|-----------|
| `client:read` | Read client data | lawyer, junior-agent |
| `client:write` | Create/update clients | lawyer |
| `case:read` | Read case data | lawyer, junior-agent |
| `case:write` | Create/update cases | lawyer |
| `research:read` | Read research queries | lawyer, ai-engine |
| `research:write` | Create research queries | lawyer, ai-engine, junior-agent |
| `junior:invoke` | Execute Junior actions | junior-agent |
| `junior:read` | Read Junior logs | lawyer, analytics-service |
| `inference:write` | Log inference metrics | ai-engine, backend-internal |
| `inference:read` | Read inference logs | analytics-service |
| `analytics:read` | Read analytics data | analytics-service |
| `user:manage` | Manage users | admin |
| `audit:read` | Read audit logs | admin |
| `audit:write` | Write audit logs | backend-internal |
| `system:migrate` | Run database migrations | superadmin (human only) |

---

## Token Generation

### Format
```
{
  "service_id": "ai-engine",
  "scopes": ["research:read", "research:write", "inference:write"],
  "iat": 1697500000,
  "exp": 1697503600,
  "jti": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Signing
- Algorithm: `RS256` (RSA with SHA-256)
- Private key stored in secrets manager
- Public key available at `/.well-known/jwks.json`

### Example JWT
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJ2aWNlX2lkIjoiYWktZW5naW5lIiwic2NvcGVzIjpbInJlc2VhcmNoOnJlYWQiLCJyZXNlYXJjaDp3cml0ZSIsImluZmVyZW5jZTp3cml0ZSJdLCJpYXQiOjE2OTc1MDAwMDAsImV4cCI6MTY5NzUwMzYwMCwianRpIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIn0.signature
```

---

## Credentials Storage

### Railway Environment Variables

```bash
# Backend
DATABASE_URL=postgresql://user:pass@host:5432/legalindia
JWT_PRIVATE_KEY=<base64_encoded_rsa_private_key>
JWT_PUBLIC_KEY=<base64_encoded_rsa_public_key>

# AI Engine (NO DATABASE_URL)
BACKEND_API_URL=https://api.legalindia.ai
AI_ENGINE_SERVICE_SECRET=<secret_for_token_generation>

# Junior Agent (NO DATABASE_URL)
BACKEND_API_URL=https://api.legalindia.ai
JUNIOR_SERVICE_SECRET=<secret_for_token_generation>

# Analytics (NO DATABASE_URL)
BACKEND_API_URL=https://api.legalindia.ai
ANALYTICS_SERVICE_SECRET=<secret_for_token_generation>
```

### GitHub Secrets (CI/CD)

```
DATABASE_URL_STAGING=<staging_db_url>
DATABASE_URL_PRODUCTION=<production_db_url>
JWT_PRIVATE_KEY=<private_key>
SERVICE_SECRETS_AI_ENGINE=<secret>
SERVICE_SECRETS_JUNIOR=<secret>
SERVICE_SECRETS_ANALYTICS=<secret>
```

---

## Token Rotation Procedure

### Automated Daily Rotation

```bash
#!/bin/bash
# scripts/rotate_service_tokens.sh

# Generate new token for ai-engine
NEW_TOKEN=$(curl -X POST https://api.legalindia.ai/auth/service-token \
  -H "Content-Type: application/json" \
  -d "{\"service_id\": \"ai-engine\", \"client_secret\": \"$AI_ENGINE_SECRET\"}")

# Update Railway env var
railway env set AI_ENGINE_TOKEN="$NEW_TOKEN" --service ai-engine

# Repeat for other services...
```

### Manual Emergency Rotation

1. Generate new client secret for service
2. Update service secret in secrets manager
3. Issue new token with new secret
4. Update service environment variable
5. Verify service can authenticate
6. Revoke old tokens (add to blocklist)

---

## Service Account Audit

### Required Logs

For each service account:
- Token issued (timestamp, service_id, scopes, jti)
- Token used (timestamp, endpoint, request_id)
- Token expired (timestamp, jti)
- Token revoked (timestamp, jti, reason)

### Monitoring

Alert if:
- Service uses scope not granted
- Service attempts endpoint not in allowed list
- Token reuse after expiration
- Unusual request patterns (>2x normal rate)

---

## Service-to-Service Call Example

### AI Engine → Backend

```python
import requests
import os

BACKEND_URL = os.getenv("BACKEND_API_URL")
SERVICE_TOKEN = os.getenv("AI_ENGINE_TOKEN")

headers = {
    "Authorization": f"Bearer {SERVICE_TOKEN}",
    "Content-Type": "application/json",
    "X-Service-ID": "ai-engine",
    "X-Request-ID": str(uuid.uuid4())
}

# Log inference
response = requests.post(
    f"{BACKEND_URL}/v1/inference/log",
    headers=headers,
    json={
        "query_id": 123,
        "model_used": "gpt-4",
        "tokens": 150,
        "cost": 0.003
    }
)

if response.status_code == 403:
    print("ERROR: Insufficient scope")
elif response.status_code == 401:
    print("ERROR: Token expired or invalid")
else:
    print(f"Logged: {response.json()}")
```

---

## Database Roles (PostgreSQL)

### `legalindia_app` (Application Role)

**Granted to:** Backend service only

**Permissions:**
```sql
GRANT CONNECT ON DATABASE legalindia_db TO legalindia_app;
GRANT USAGE ON SCHEMA public TO legalindia_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO legalindia_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO legalindia_app;
```

**Restrictions:**
- Cannot CREATE, ALTER, or DROP tables
- Cannot create functions or triggers
- Cannot access `pg_catalog` or system tables

### `legalindia_admin` (Admin Role)

**Granted to:** DevOps engineers (human access only)

**Permissions:**
```sql
GRANT CONNECT ON DATABASE legalindia_db TO legalindia_admin;
GRANT CREATE ON SCHEMA public TO legalindia_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO legalindia_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO legalindia_admin;
```

**Usage:**
- Emergency fixes only
- Requires MFA authentication
- All actions logged

### `legalindia_migrate` (Migration Role)

**Granted to:** CI/CD pipeline (with approval gate)

**Permissions:**
```sql
GRANT ALL PRIVILEGES ON DATABASE legalindia_db TO legalindia_migrate;
```

**Usage:**
- Alembic migrations only
- Requires human approval in CI
- Pre-migration snapshot required

### `legalindia_readonly` (Analytics Role)

**Granted to:** Analytics services (optional)

**Permissions:**
```sql
GRANT CONNECT ON DATABASE legalindia_db TO legalindia_readonly;
GRANT USAGE ON SCHEMA public TO legalindia_readonly;
GRANT SELECT ON junior_logs, inference_logs TO legalindia_readonly;
```

**Restrictions:**
- SELECT only on whitelisted tables
- No access to users, clients, cases tables
- IP allowlist required

---

## Revocation & Incident Response

### Immediate Revocation

```bash
# Add token to blocklist
redis-cli SADD blocked_tokens "jti:550e8400-e29b-41d4-a716-446655440000"

# Or via API
curl -X POST https://api.legalindia.ai/admin/revoke-token \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"jti": "550e8400-e29b-41d4-a716-446655440000", "reason": "security_incident"}'
```

### Post-Incident

1. Revoke all tokens for compromised service
2. Rotate service client secret
3. Review audit logs for unauthorized access
4. Notify security team
5. Update incident runbook

---

## Compliance & Audit

### Quarterly Review

- [ ] Review active service accounts
- [ ] Remove unused service accounts
- [ ] Verify scope assignments
- [ ] Check token rotation logs
- [ ] Review rate limit effectiveness
- [ ] Update documentation

### Annual Security Audit

- [ ] Penetration testing of service authentication
- [ ] Review JWT signing keys
- [ ] Verify secrets manager access logs
- [ ] Test incident response procedures
- [ ] Update service account lifecycle policy

---

## Contact

**Security Team:** security@legalindia.ai  
**On-Call Engineer:** Use PagerDuty rotation  
**Incident Hotline:** [Internal Only]

