# Backend Scope

This repo is strictly backend API scaffolding only.

No frontend, no database migrations, and no AI model code in this repo.

Any attempt to add non-backend artifacts must trigger a warning to the owner before proceeding.

## Temporary Admin Auth

The current authentication implementation uses a static, environment-based admin credential system for local testing and initial deployment. This temporary flow requires two environment variables: `ADMIN_USERNAME` (plain text admin username) and `ADMIN_PASSWORD_HASH` (bcrypt hash of the admin password). The `app/utils/auth.py` module provides JWT token creation/validation, bcrypt password utilities, and a `verify_token` FastAPI dependency for endpoint protection. This static admin authentication must be replaced with a database-backed user management system in the next development phase, including proper user models, persistent token storage, and token blacklist for logout functionality.

## AI Service

The `app/services/ai_service.py` module provides a thin HTTP client layer for communicating with the external AI inference engine. The core function `call_ai_engine(query_text, context)` makes asynchronous POST requests to the endpoint specified by the `AI_ENGINE_URL` environment variable (required). The function implements automatic retry logic with exponential backoff (3 attempts: 0.5s, 1.0s, 2.0s delays) for transient network failures and 5xx server errors, while failing immediately on 4xx client errors. Request timeout is set to 10 seconds. The AI engine response is parsed and mapped to the `InferenceResponse` Pydantic model with fields: `answer` (str), `sources` (List[str]), and `confidence` (Optional[float]). This service handles multiple response formats gracefully and raises descriptive `RuntimeError` exceptions on configuration errors, network failures, or invalid JSON responses. Note: This module does not host or train models—it is purely an HTTP client for external AI engine communication.

## Research Controller

Research controller (`app/controllers/research_controller.py`) performs ephemeral request→AI flow only; persistence, caching, and RBAC are implemented in DB+AI phase. The `handle_research_query` function accepts a `QueryInput` Pydantic model and performs input sanitization (trimming, whitespace collapsing, length validation up to 5000 chars), applies the "Legal research context:" template prefix to queries, calls `call_ai_engine` from the AI service layer, and maps responses to `InferenceResponse` format. Error handling includes HTTPException(400) for invalid input, HTTPException(413) for oversized queries, HTTPException(502) for upstream AI failures, and HTTPException(500) for internal errors. The controller logs observability metrics (module, user_id, elapsed_ms) but does not persist queries, results, or history to any database. Role information from `request.state.user` is logged for observability but not enforced (RBAC enforcement deferred to database-backed phase). Future integrations marked with TODO comments include query history persistence, provenance tagging, rate-limiting, caching, and role-based access control.

