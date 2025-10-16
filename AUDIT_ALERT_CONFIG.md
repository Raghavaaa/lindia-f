# Audit & Alert Configuration

**Purpose:** Monitor system security and detect anomalies

---

## Audit Logging

### What to Log

All database mutations must capture:
- `user_id` or `service_id`
- `endpoint` (e.g., `/v1/clients`)
- `method` (GET, POST, PUT, DELETE)
- `payload_summary` (redacted PII)
- `timestamp` (ISO 8601)
- `origin_ip` or `service_hostname`
- `request_id` (UUID)
- `response_status` (200, 401, 403, etc.)
- `execution_time_ms`

### Storage Options

**Option A: Database Table (Recommended for Start)**
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  service_id VARCHAR(50),
  endpoint VARCHAR(255),
  method VARCHAR(10),
  payload_summary TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  origin_ip INET,
  request_id UUID,
  response_status INTEGER,
  execution_time_ms INTEGER
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_service_id ON audit_logs(service_id);
```

**Option B: External Service (Production Scale)**
- Google Cloud Logging
- Datadog
- Splunk
- ELK Stack

---

## Alert Configuration

### Critical Alerts

**1. Unauthorized DB Access**
```yaml
alert: unauthorized_db_access
condition: non_backend_ip connects to database
severity: CRITICAL
action:
  - Block IP immediately
  - Rotate database credentials
  - Page on-call engineer
  - Create incident ticket
```

**2. Schema Change Attempt**
```yaml
alert: unauthorized_schema_change
condition: DDL command by non-admin role
severity: HIGH
action:
  - Block command
  - Revoke role privileges
  - Alert security team
```

**3. Failed Auth Spike**
```yaml
alert: failed_auth_spike
condition: >10 failed authentications in 1 minute
severity: MEDIUM
action:
  - Rate limit actor
  - Alert security team
  - Log for review
```

**4. PII Exposure**
```yaml
alert: pii_exposure
condition: Unredacted PII in analytics logs
severity: CRITICAL
action:
  - Immediate incident response
  - Notify DPO
  - Review redaction logic
```

### Warning Alerts

**5. Rate Limit Exceeded**
```yaml
alert: rate_limit_exceeded
condition: Actor hits rate limit
severity: LOW
action:
  - Throttle requests
  - Log for pattern analysis
```

**6. Slow Query**
```yaml
alert: slow_query_detected
condition: Query execution >5 seconds
severity: MEDIUM
action:
  - Log query details
  - Review for optimization
  - Alert backend team
```

---

## Monitoring Dashboards

### 1. API Health Dashboard

**Metrics:**
- Request latency (p50, p95, p99)
- Error rate by endpoint
- Requests per minute
- Rate limit hits

**Grafana Example:**
```json
{
  "dashboard": "API Health",
  "panels": [
    {
      "title": "Request Latency",
      "metric": "api_request_duration_seconds",
      "aggregation": "percentile"
    },
    {
      "title": "Error Rate",
      "metric": "api_errors_total",
      "aggregation": "rate"
    }
  ]
}
```

### 2. Database Dashboard

**Metrics:**
- Connection pool usage
- Query execution time
- Active connections
- Slow query log
- Table sizes

### 3. Security Dashboard

**Metrics:**
- Failed authentication attempts
- Token issuance/revocation
- Audit log highlights
- Service-to-service calls

---

## Implementation

### Python Audit Middleware

```python
# backend/middleware/audit.py
import time
import uuid
from fastapi import Request

async def audit_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start_time = time.time()
    
    response = await call_next(request)
    
    execution_time = (time.time() - start_time) * 1000
    
    # Log to audit table
    audit_log = {
        "user_id": request.state.user_id if hasattr(request.state, "user_id") else None,
        "service_id": request.headers.get("X-Service-ID"),
        "endpoint": request.url.path,
        "method": request.method,
        "timestamp": datetime.utcnow(),
        "origin_ip": request.client.host,
        "request_id": request_id,
        "response_status": response.status_code,
        "execution_time_ms": int(execution_time)
    }
    
    # Async write to DB or queue
    await write_audit_log(audit_log)
    
    return response
```

### Alert Rules (Prometheus)

```yaml
# alerts/security.yml
groups:
  - name: security
    rules:
      - alert: UnauthorizedDBAccess
        expr: rate(db_connections_from_unknown_ip[1m]) > 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Unauthorized database access detected"
          
      - alert: FailedAuthSpike
        expr: rate(auth_failures[1m]) > 10
        for: 1m
        labels:
          severity: medium
        annotations:
          summary: "High rate of failed authentications"
```

---

## Incident Response Playbook

### P0: Critical Security Incident

1. **Detect:** Alert fires (unauthorized access, credential leak)
2. **Contain:** Block IP, revoke tokens, rotate credentials
3. **Investigate:** Review audit logs, determine scope
4. **Notify:** Page on-call, alert security team, notify stakeholders
5. **Remediate:** Fix vulnerability, update security controls
6. **Document:** Create incident report, update runbook

### P1: High Priority Issue

1. **Detect:** Schema change attempt, slow query alert
2. **Investigate:** Review logs, identify root cause
3. **Mitigate:** Rollback change, optimize query
4. **Document:** Add to incident log

---

## Railway Configuration

```bash
# Enable audit logging
railway env set AUDIT_LOGGING_ENABLED=true

# Set alert webhook
railway env set ALERT_WEBHOOK_URL=https://hooks.slack.com/services/...

# Configure log retention
railway env set AUDIT_LOG_RETENTION_DAYS=90
```

---

## Testing Alerts

```bash
# Test unauthorized access alert
curl -X POST https://api.legalindia.ai/v1/clients \
  -H "Authorization: Bearer invalid_token"

# Expect: Alert fires within 1 minute

# Test rate limit alert
for i in {1..100}; do
  curl https://api.legalindia.ai/v1/clients
done

# Expect: Rate limit alert after 60 requests
```

---

## Compliance Requirements

- [ ] Audit logs retained for 90 days minimum
- [ ] Critical alerts configured and tested
- [ ] Incident response playbook reviewed quarterly
- [ ] Security dashboard accessible to security team
- [ ] Audit logs reviewed weekly
- [ ] Alert fatigue minimized (tune thresholds)

