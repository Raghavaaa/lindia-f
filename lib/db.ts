import path from "path";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { runMigrations } from "./database/migrations";

let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

export async function getDb() {
  if (!dbPromise) {
    const dbPath = path.join(process.cwd(), "data.sqlite");
    dbPromise = open({ filename: dbPath, driver: sqlite3.Database });
    const db = await dbPromise;
    
    // Enable WAL mode for better performance
    await db.exec('PRAGMA journal_mode = WAL;');
    
    // Run migrations
    await runMigrations(db);
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

export async function saveUser(user: { id: string; name: string; email: string; image?: string; provider?: string; phone?: string; address?: string }) {
  const db = await getDb();
  await db.run(
    `INSERT INTO users (id, name, email, image, provider, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?) 
     ON CONFLICT(id) DO UPDATE SET name=excluded.name, email=excluded.email, image=excluded.image, provider=excluded.provider, phone=excluded.phone, address=excluded.address`,
    user.id, user.name, user.email, user.image || null, user.provider || null, user.phone || null, user.address || null
  );
}

export async function getUser(email: string) {
  const db = await getDb();
  const row = await db.get<{ id: string; name: string; email: string; phone?: string; address?: string; image?: string }>(
    `SELECT id, name, email, phone, address, image FROM users WHERE email = ?`, 
    email
  );
  return row;
}

export async function updateUserProfile(id: string, updates: { phone?: string; address?: string }) {
  const db = await getDb();
  const setClause = Object.keys(updates).map(key => `${key} = ?`).join(", ");
  const values = Object.values(updates).filter(v => v !== undefined);
  if (values.length > 0) {
    await db.run(`UPDATE users SET ${setClause} WHERE id = ?`, ...values, id);
  }
}


