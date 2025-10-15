#!/usr/bin/env python3
"""Run seed_data.sql against the database in a safe transaction."""

import os
import sys
from pathlib import Path
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tmp_seed.db")

def run_seed_sql():
    """Execute seed_data.sql in a transaction."""
    seed_file = Path(__file__).parent.parent / "seed_data.sql"
    
    if not seed_file.exists():
        print(f"Error: {seed_file} not found", file=sys.stderr)
        return 1
    
    engine = create_engine(DATABASE_URL, echo=False)
    
    try:
        with open(seed_file, 'r') as f:
            sql_content = f.read()
        
        with engine.begin() as conn:
            # Split by semicolon and execute each statement
            statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]
            
            for stmt in statements:
                try:
                    result = conn.execute(text(stmt))
                    if result.rowcount > 0:
                        print(f"Inserted {result.rowcount} row(s)")
                except Exception as e:
                    # If constraint violation (already exists), it's idempotent - continue
                    if "UNIQUE constraint" in str(e) or "duplicate" in str(e).lower():
                        print(f"Skipped (already exists): {stmt[:50]}...")
                    else:
                        raise
        
        print("Seed SQL executed successfully")
        return 0
    
    except Exception as e:
        print(f"Error executing seed SQL: {e}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(run_seed_sql())

