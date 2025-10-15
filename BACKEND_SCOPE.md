# Backend Scope

This repo is strictly backend API scaffolding only.

No frontend, no database migrations, and no AI model code in this repo.

Any attempt to add non-backend artifacts must trigger a warning to the owner before proceeding.

## Temporary Admin Auth

The current authentication implementation uses a static, environment-based admin credential system for local testing and initial deployment. This temporary flow requires two environment variables: `ADMIN_USERNAME` (plain text admin username) and `ADMIN_PASSWORD_HASH` (bcrypt hash of the admin password). The `app/utils/auth.py` module provides JWT token creation/validation, bcrypt password utilities, and a `verify_token` FastAPI dependency for endpoint protection. This static admin authentication must be replaced with a database-backed user management system in the next development phase, including proper user models, persistent token storage, and token blacklist for logout functionality.

