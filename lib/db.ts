import path from "path";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

export async function getDb() {
  if (!dbPromise) {
    const dbPath = path.join(process.cwd(), "data.sqlite");
    dbPromise = open({ filename: dbPath, driver: sqlite3.Database });
    const db = await dbPromise;
    await db.exec(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS research_queries (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        query_text TEXT,
        response_text TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
  }
  return dbPromise!;
}

export async function saveResearchQuery(params: { id: string; userId?: string; queryText: string; responseText: string }) {
  const db = await getDb();
  await db.run(
    `INSERT INTO research_queries (id, user_id, query_text, response_text) VALUES (?, ?, ?, ?)`,
    params.id,
    params.userId ?? null,
    params.queryText,
    params.responseText
  );
}

export async function getSetting(key: string): Promise<string | undefined> {
  const db = await getDb();
  const row = await db.get<{ value: string }>(`SELECT value FROM settings WHERE key = ?`, key);
  return row?.value;
}

export async function setSetting(key: string, value: string) {
  const db = await getDb();
  await db.run(`INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`, key, value);
}


