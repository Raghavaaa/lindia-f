# Alembic Migration Record - Initial Schema

**Date:** 2025-10-16  
**Engineer:** Raghavan Karthik  
**Repository:** [https://github.com/Raghavaaa/lindia-db](https://github.com/Raghavaaa/lindia-db)

---

## Migration Details

| Attribute | Value |
|-----------|-------|
| **Revision ID** | `04bd3fd5e6c2` |
| **Migration File** | `migrations/versions/2025_10_16_1324-04bd3fd5e6c2_initial_schema.py` |
| **Down Revision** | `None` (initial migration) |
| **Created** | 2025-10-16 13:24:55 |
| **Git Commit** | `f2dc718` |
| **Git Tag** | `migration-04bd3fd5e6c2` |

---

## Tables Created (7)

1. **users** - User authentication and profiles
   - Columns: id, name, email (unique), password_hash, role, created_at
   - Indexed: email

2. **clients** - Client records linked to lawyers
   - Columns: id, lawyer_id (FK→users.id), name, contact, address, created_at
   
3. **cases** - Legal case management
   - Columns: id, client_id (FK→clients.id), title, status, description, created_at, updated_at
   - Indexed: status

4. **property_opinions** - Property document reviews
   - Columns: id, client_id (FK→clients.id), document_url, status, notes, created_at

5. **research_queries** - Legal research queries
   - Columns: id, lawyer_id (FK→users.id), query_text, response_text, timestamp

6. **junior_logs** - AI junior assistant activity logs
   - Columns: id, lawyer_id (FK→users.id), action, context, response, timestamp
   - Indexed: timestamp

7. **inference_logs** - AI model inference tracking
   - Columns: id, query_id (FK→research_queries.id), model_used, tokens, cost, response_hash, timestamp

---

## Indexes Created (3)

1. `ix_users_email` on `users.email` - Fast user lookup
2. `ix_cases_status` on `cases.status` - Case filtering by status
3. `ix_junior_logs_timestamp` on `junior_logs.timestamp` - Chronological log queries

**Note:** Full-text search index on `research_queries.query_text` will be added in a PostgreSQL-specific migration using GIN + tsvector.

---

## Testing Completed

✅ **Local Development (SQLite)**
- Autogenerate against `sqlite:///./tmp_alembic.db`: SUCCESS
- Upgrade to head (04bd3fd5e6c2): SUCCESS
- Downgrade to base: SUCCESS
- Re-upgrade to head: SUCCESS (idempotency confirmed)
- Python syntax check: PASSED
- Temporary database cleanup: COMPLETE

**Test Environment:** Local SQLite only  
**No external databases accessed during development**

---

## Configuration Changes

### `alembic.ini`
- Added `file_template` with timestamp pattern: `YYYY_MM_DD_HHMM-<revision>_<slug>`
- Added documentation for DATABASE_URL environment variable usage
- Removed hardcoded database URLs

### `migrations/env.py`
- Added `get_url()` function to read DATABASE_URL from environment
- Added `compare_type=True` for detecting column type changes
- Added `compare_server_default=True` for detecting default value changes
- Enhanced documentation

### `migrations/script.py.mako`
- Created migration template for consistent migration file generation

---

## Rollback Procedures

### Option A: Alembic Downgrade
```bash
export DATABASE_URL=<your_database_url>
python3 -m alembic downgrade base
# Or step back one revision:
python3 -m alembic downgrade -1
```

### Option B: Database Snapshot Restore
1. Identify snapshot ID created before migration
2. Use Railway/host provider snapshot restore feature
3. Restore from snapshot ID

**⚠️ NEVER manually drop tables in staging/production!**

---

## Staging Deployment Checklist

### Pre-Deployment
- [ ] Create staging database snapshot/backup
- [ ] Record snapshot ID: `_________________`
- [ ] Verify Railway/PostgreSQL staging DB is provisioned
- [ ] Set DATABASE_URL environment variable
- [ ] Test connectivity: `python3 -c "from db_init import test_connection; print(test_connection())"`

### Deployment
- [ ] Run migration: `export DATABASE_URL=<staging_url> && python3 -m alembic upgrade head`
- [ ] Verify all 7 tables created
- [ ] Verify all 3 indexes created
- [ ] Run seed script: `python3 scripts/seed_via_models.py`
- [ ] Verify seed counts:
  - [ ] 2 users
  - [ ] 2+ clients
  - [ ] 1+ case
  - [ ] 1+ property_opinion
- [ ] Test idempotency: Re-run seed script, confirm no duplicates

### Post-Deployment
- [ ] Run health check: `python3 -c "from db_init import test_connection; print(test_connection())"`
- [ ] Record latency: `_______ ms`
- [ ] Create post-deployment snapshot
- [ ] Record snapshot ID: `_________________`
- [ ] Update runbook with revision ID and deployment timestamp

### Rollback (if needed)
- [ ] Execute rollback procedure (Option A or B above)
- [ ] Record rollback reason and timestamp
- [ ] Create incident report

---

## Production Deployment Notes

**DO NOT deploy to production until:**
1. ✅ Staging deployment successful
2. ✅ Staging verification tests passed
3. ✅ Seed data loads correctly
4. ✅ Health checks return acceptable latency
5. ✅ Rollback procedure tested on staging
6. ✅ Pre-production snapshot created
7. ✅ Database roles configured (app role, admin role)
8. ✅ Network access restricted to internal services only
9. ✅ SSL enforcement enabled
10. ✅ Automated backups configured (daily, 7-day retention minimum)

---

## Future Migrations

### PostgreSQL-Specific Optimizations (Future)
1. Add GIN index on `research_queries.query_text` with tsvector for full-text search
2. Add composite indexes based on query patterns
3. Consider partitioning for `junior_logs` and `inference_logs` if volume grows
4. Add database-level constraints and triggers as needed

### Best Practices for Future Migrations
- Always create migrations against local SQLite first
- Review autogenerated migrations before applying
- Manually add indexes in upgrade() and mirror in downgrade()
- Test both upgrade and downgrade
- Require human review for all migrations
- Keep migrations small and focused
- Name migrations clearly
- Always create pre-migration snapshots

---

## References

- **Repository:** https://github.com/Raghavaaa/lindia-db
- **Alembic Documentation:** https://alembic.sqlalchemy.org/
- **SQLAlchemy Documentation:** https://docs.sqlalchemy.org/

---

## Sign-off

**Migration Created By:** Database Engineer  
**Reviewed By:** ___________________________  
**Approved for Staging:** ___________________  
**Staging Deployment Date:** _______________  
**Approved for Production:** _______________  
**Production Deployment Date:** ____________

---

*This migration record should be kept with the project documentation and updated after each deployment.*

