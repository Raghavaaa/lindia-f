# LegalIndia Backend - Production Implementation Plan

**Started:** October 16, 2025  
**Target:** Full production-grade backend with all specifications  
**Estimated Files:** 80-100+

---

## Implementation Status

### ✅ Phase 1: Foundation (COMPLETED)
- [x] Updated requirements.txt with 40+ production dependencies
- [x] Created folder structure (api/, app/, migrations/, tests/, infra/)
- [x] Updated .env.example with all 15+ environment variables
- [x] Committed to git: d4c6194

### 🔄 Phase 2: Database Layer (IN PROGRESS)
- [ ] app/core/database.py - Async SQLAlchemy engine & session
- [ ] app/models/__init__.py
- [ ] app/models/user.py - User model with roles
- [ ] app/models/client.py - Client model
- [ ] app/models/folder.py - Folder model
- [ ] app/models/document.py - Document model with S3 refs
- [ ] app/models/job.py - Job model with provenance
- [ ] app/models/vector.py - Vector metadata model
- [ ] Alembic configuration (alembic.ini, env.py)
- [ ] Initial migration script

### ⏳ Phase 3: Schemas & Validation (PENDING)
- [ ] app/schemas/user.py - User request/response schemas
- [ ] app/schemas/client.py - Client schemas
- [ ] app/schemas/document.py - Document schemas
- [ ] app/schemas/job.py - Job schemas with provenance
- [ ] app/schemas/research.py - Research request schemas
- [ ] app/schemas/auth.py - Auth schemas (login, token, refresh)

### ⏳ Phase 4: Core Services (PENDING)
- [ ] app/services/auth_service.py - Auth business logic
- [ ] app/services/user_service.py - User management
- [ ] app/services/client_service.py - Client operations
- [ ] app/services/document_service.py - Doc upload & management
- [ ] app/services/research_service.py - Research orchestration
- [ ] app/services/job_service.py - Job lifecycle management

### ⏳ Phase 5: External Adapters (PENDING)
- [ ] app/adapters/redis_client.py - Redis caching & queue
- [ ] app/adapters/minio_client.py - S3-compatible storage
- [ ] app/adapters/qdrant_client.py - Vector DB wrapper
- [ ] app/adapters/inference_adapter.py - Worker/model interface
- [ ] app/workers_client/enqueue.py - Job enqueueing helpers
- [ ] app/workers_client/status.py - Job status utilities

### ⏳ Phase 6: API Routers (PENDING)
- [ ] api/auth.py - POST /auth/login, /auth/refresh, GET /auth/me
- [ ] api/users.py - POST /users, GET /users/{id}
- [ ] api/clients.py - POST /clients, GET /clients/{id}
- [ ] api/documents.py - POST /clients/{id}/upload, GET /documents/{id}
- [ ] api/research.py - POST /research
- [ ] api/jobs.py - GET /jobs/{job_id}
- [ ] api/admin.py - Admin endpoints
- [ ] api/health.py - GET /health, /metrics

### ⏳ Phase 7: Utilities (PENDING)
- [ ] app/utils/rate_limiter.py - Redis-backed rate limiting
- [ ] app/utils/file_helpers.py - File validation & malware scan
- [ ] app/utils/idempotency.py - Duplicate job detection
- [ ] app/utils/metrics.py - Prometheus metrics
- [ ] app/utils/logging.py - Structured JSON logging

### ⏳ Phase 8: Docker & Infrastructure (PENDING)
- [ ] Dockerfile - Multi-stage Python build
- [ ] docker-compose.yml - PostgreSQL + Redis + MinIO
- [ ] infra/docker-compose.dev.yml - Extended dev setup
- [ ] infra/k8s/ - Sample Kubernetes manifests
- [ ] .dockerignore

### ⏳ Phase 9: CI/CD Pipeline (PENDING)
- [ ] .github/workflows/ci.yml - Lint, test, build, deploy
- [ ] .github/workflows/release.yml - Tag-based releases
- [ ] .pre-commit-config.yaml - Git hooks

### ⏳ Phase 10: Testing (PENDING)
- [ ] tests/conftest.py - pytest fixtures (DB, Redis)
- [ ] tests/unit/test_auth_service.py
- [ ] tests/unit/test_user_service.py
- [ ] tests/unit/test_job_service.py
- [ ] tests/integration/test_upload_flow.py
- [ ] tests/integration/test_research_flow.py
- [ ] tests/load/k6_baseline.js - Load testing script
- [ ] tests/load/locust_file.py - Alternative load test

### ⏳ Phase 11: Documentation (PENDING)
- [ ] README.md - Complete setup guide
- [ ] docs/architecture.md - System architecture
- [ ] docs/runbook.md - Operations guide
- [ ] infra/ops-revert.md - Rollback procedures
- [ ] run_local.sh - One-command dev startup
- [ ] Makefile - Common commands

### ⏳ Phase 12: Observability (PENDING)
- [ ] Prometheus metrics integration
- [ ] Sentry error tracking
- [ ] OpenTelemetry tracing
- [ ] Health check endpoints

---

## File Count Estimate

| Category | Files | Status |
|----------|-------|--------|
| Database Models | 7 | Pending |
| Schemas | 12 | Pending |
| Services | 8 | Pending |
| Adapters | 6 | Pending |
| API Routers | 8 | Pending |
| Utilities | 6 | Pending |
| Tests | 10+ | Pending |
| Infrastructure | 8 | Pending |
| Documentation | 6 | Pending |
| CI/CD | 3 | Pending |
| **TOTAL** | **80+** | **2% Complete** |

---

## Next Steps

1. Complete Phase 2: Database layer with SQLAlchemy models
2. Configure Alembic for migrations
3. Build service layer
4. Implement API routers
5. Add Docker setup
6. Create CI/CD pipeline
7. Write tests
8. Document everything

---

## Git Strategy

- Commit after each major phase
- Create feature branches for large changes
- Tag stable releases as `stable-v1`, `stable-v2`, etc.
- Never force-push to main
- Always create backup tags before destructive operations

---

**This document will be updated as implementation progresses.**

