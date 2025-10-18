import { Database } from 'sqlite';

export async function runMigrations(db: Database) {
  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON;');
  
  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      phone TEXT,
      address TEXT,
      image TEXT,
      provider TEXT,
      role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'lawyer')),
      is_active BOOLEAN DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Create clients table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      address TEXT,
      reference_id TEXT,
      user_id TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create directories table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS directories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      client_id TEXT NOT NULL,
      description TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    );
  `);

  // Create subdirectories table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS subdirectories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      directory_id TEXT NOT NULL,
      description TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (directory_id) REFERENCES directories(id) ON DELETE CASCADE
    );
  `);

  // Create research_queries table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS research_queries (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      client_id TEXT,
      query_text TEXT NOT NULL,
      response_text TEXT NOT NULL,
      status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
      model TEXT DEFAULT 'deepseek' CHECK (model IN ('deepseek', 'inlegalbert', 'manual')),
      confidence REAL,
      tags TEXT, -- JSON array of tags
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
    );
  `);

  // Create documents table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('pdf', 'doc', 'docx', 'txt', 'image')),
      size INTEGER NOT NULL,
      path TEXT NOT NULL,
      client_id TEXT,
      directory_id TEXT,
      subdirectory_id TEXT,
      uploaded_by TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
      FOREIGN KEY (directory_id) REFERENCES directories(id) ON DELETE SET NULL,
      FOREIGN KEY (subdirectory_id) REFERENCES subdirectories(id) ON DELETE SET NULL,
      FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create cases table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      case_number TEXT,
      court TEXT,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'pending')),
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
      client_id TEXT NOT NULL,
      assigned_to TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      tags TEXT, -- JSON array of tags
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create settings table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'system' CHECK (category IN ('system', 'user', 'ai', 'legal')),
      is_public BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Create activities table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('research', 'document', 'case', 'client', 'system')),
      action TEXT NOT NULL,
      description TEXT NOT NULL,
      user_id TEXT NOT NULL,
      client_id TEXT,
      case_id TEXT,
      metadata TEXT, -- JSON object
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL
    );
  `);

  // Create indexes for better performance
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
    CREATE INDEX IF NOT EXISTS idx_directories_client_id ON directories(client_id);
    CREATE INDEX IF NOT EXISTS idx_subdirectories_directory_id ON subdirectories(directory_id);
    CREATE INDEX IF NOT EXISTS idx_research_queries_user_id ON research_queries(user_id);
    CREATE INDEX IF NOT EXISTS idx_research_queries_client_id ON research_queries(client_id);
    CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
    CREATE INDEX IF NOT EXISTS idx_cases_client_id ON cases(client_id);
    CREATE INDEX IF NOT EXISTS idx_cases_assigned_to ON cases(assigned_to);
    CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
    CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);
  `);

  // Insert default settings
  await db.exec(`
    INSERT OR IGNORE INTO settings (key, value, description, category, is_public) VALUES
    ('PROMPT_BASE', 'You are an expert Indian legal research assistant. Provide comprehensive, accurate, and practical legal guidance for Indian law.', 'Base prompt for AI research', 'ai', 0),
    ('DEEPSEEK_API_KEY', '', 'DeepSeek API key for legal research', 'ai', 0),
    ('HF_TOKEN', '', 'Hugging Face token for InLegalBERT', 'ai', 0),
    ('MAX_RESEARCH_LENGTH', '5000', 'Maximum length for research responses', 'ai', 0),
    ('DEFAULT_PAGE_SIZE', '20', 'Default pagination size', 'system', 1),
    ('MAX_FILE_SIZE', '10485760', 'Maximum file upload size in bytes (10MB)', 'system', 1),
    ('ALLOWED_FILE_TYPES', 'pdf,doc,docx,txt,jpg,jpeg,png', 'Allowed file types for upload', 'system', 1);
  `);
}
