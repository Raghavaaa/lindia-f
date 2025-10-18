import { getDb } from '../db';
import { 
  User, Client, Directory, Subdirectory, ResearchQuery, 
  Document, Case, Setting, Activity, PaginationParams 
} from '../models';

// User Services
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const db = await getDb();
  const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  
  await db.run(
    `INSERT INTO users (id, name, email, password, phone, address, image, provider, role, is_active, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id, userData.name, userData.email, userData.password, userData.phone, userData.address,
    userData.image, userData.provider, userData.role, userData.isActive, now, now
  );
  
  return { ...userData, id, createdAt: now, updatedAt: now };
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.get<User>(
    `SELECT * FROM users WHERE id = ? AND is_active = 1`, id
  );
  return user || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.get<User>(
    `SELECT * FROM users WHERE email = ? AND is_active = 1`, email
  );
  return user || null;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const db = await getDb();
  const setClause = Object.keys(updates)
    .filter(key => key !== 'id' && key !== 'createdAt')
    .map(key => `${key} = ?`)
    .join(', ');
  
  if (!setClause) return null;
  
  const values = Object.entries(updates)
    .filter(([key]) => key !== 'id' && key !== 'createdAt')
    .map(([, value]) => value);
  
  await db.run(
    `UPDATE users SET ${setClause}, updated_at = ? WHERE id = ?`,
    ...values, new Date().toISOString(), id
  );
  
  return getUserById(id);
}

export async function deleteUser(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.run(`UPDATE users SET is_active = 0 WHERE id = ?`, id);
  return result.changes > 0;
}

// Client Services
export async function createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
  const db = await getDb();
  const id = `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  
  await db.run(
    `INSERT INTO clients (id, name, email, phone, address, reference_id, user_id, is_active, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id, clientData.name, clientData.email, clientData.phone, clientData.address,
    clientData.referenceId, clientData.userId, clientData.isActive, now, now
  );
  
  return { ...clientData, id, createdAt: now, updatedAt: now };
}

export async function getClientById(id: string): Promise<Client | null> {
  const db = await getDb();
  const client = await db.get<Client>(
    `SELECT * FROM clients WHERE id = ? AND is_active = 1`, id
  );
  return client || null;
}

export async function getClientsByUserId(userId: string, pagination?: PaginationParams): Promise<{ clients: Client[]; total: number }> {
  const db = await getDb();
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 20;
  const offset = (page - 1) * limit;
  
  const clients = await db.all<Client[]>(
    `SELECT * FROM clients WHERE user_id = ? AND is_active = 1 
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    userId, limit, offset
  );
  
  const totalResult = await db.get<{ count: number }>(
    `SELECT COUNT(*) as count FROM clients WHERE user_id = ? AND is_active = 1`,
    userId
  );
  
  return { clients, total: totalResult?.count || 0 };
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
  const db = await getDb();
  const setClause = Object.keys(updates)
    .filter(key => key !== 'id' && key !== 'createdAt')
    .map(key => `${key} = ?`)
    .join(', ');
  
  if (!setClause) return null;
  
  const values = Object.entries(updates)
    .filter(([key]) => key !== 'id' && key !== 'createdAt')
    .map(([, value]) => value);
  
  await db.run(
    `UPDATE clients SET ${setClause}, updated_at = ? WHERE id = ?`,
    ...values, new Date().toISOString(), id
  );
  
  return getClientById(id);
}

export async function deleteClient(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.run(`UPDATE clients SET is_active = 0 WHERE id = ?`, id);
  return result.changes > 0;
}

// Research Query Services
export async function createResearchQuery(queryData: Omit<ResearchQuery, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResearchQuery> {
  const db = await getDb();
  const id = `rq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  
  await db.run(
    `INSERT INTO research_queries (id, user_id, client_id, query_text, response_text, status, model, confidence, tags, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id, queryData.userId, queryData.clientId, queryData.queryText, queryData.responseText,
    queryData.status, queryData.model, queryData.confidence, 
    queryData.tags ? JSON.stringify(queryData.tags) : null, now, now
  );
  
  return { ...queryData, id, createdAt: now, updatedAt: now };
}

export async function getResearchQueriesByUserId(userId: string, pagination?: PaginationParams): Promise<{ queries: ResearchQuery[]; total: number }> {
  const db = await getDb();
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 20;
  const offset = (page - 1) * limit;
  
  const queries = await db.all<ResearchQuery[]>(
    `SELECT * FROM research_queries WHERE user_id = ? 
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    userId, limit, offset
  );
  
  const totalResult = await db.get<{ count: number }>(
    `SELECT COUNT(*) as count FROM research_queries WHERE user_id = ?`,
    userId
  );
  
  return { queries, total: totalResult?.count || 0 };
}

export async function getResearchQueriesByClientId(clientId: string, pagination?: PaginationParams): Promise<{ queries: ResearchQuery[]; total: number }> {
  const db = await getDb();
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 20;
  const offset = (page - 1) * limit;
  
  const queries = await db.all<ResearchQuery[]>(
    `SELECT * FROM research_queries WHERE client_id = ? 
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    clientId, limit, offset
  );
  
  const totalResult = await db.get<{ count: number }>(
    `SELECT COUNT(*) as count FROM research_queries WHERE client_id = ?`,
    clientId
  );
  
  return { queries, total: totalResult?.count || 0 };
}

// Case Services
export async function createCase(caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<Case> {
  const db = await getDb();
  const id = `case_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  
  await db.run(
    `INSERT INTO cases (id, title, description, case_number, court, status, priority, client_id, assigned_to, start_date, end_date, tags, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id, caseData.title, caseData.description, caseData.caseNumber, caseData.court,
    caseData.status, caseData.priority, caseData.clientId, caseData.assignedTo,
    caseData.startDate, caseData.endDate, caseData.tags ? JSON.stringify(caseData.tags) : null, now, now
  );
  
  return { ...caseData, id, createdAt: now, updatedAt: now };
}

export async function getCasesByUserId(userId: string, pagination?: PaginationParams): Promise<{ cases: Case[]; total: number }> {
  const db = await getDb();
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 20;
  const offset = (page - 1) * limit;
  
  const cases = await db.all<Case[]>(
    `SELECT * FROM cases WHERE assigned_to = ? 
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    userId, limit, offset
  );
  
  const totalResult = await db.get<{ count: number }>(
    `SELECT COUNT(*) as count FROM cases WHERE assigned_to = ?`,
    userId
  );
  
  return { cases, total: totalResult?.count || 0 };
}

// Activity Services
export async function createActivity(activityData: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> {
  const db = await getDb();
  const id = `act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  
  await db.run(
    `INSERT INTO activities (id, type, action, description, user_id, client_id, case_id, metadata, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id, activityData.type, activityData.action, activityData.description, activityData.userId,
    activityData.clientId, activityData.caseId, 
    activityData.metadata ? JSON.stringify(activityData.metadata) : null, now
  );
  
  return { ...activityData, id, createdAt: now };
}

export async function getActivitiesByUserId(userId: string, pagination?: PaginationParams): Promise<{ activities: Activity[]; total: number }> {
  const db = await getDb();
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 20;
  const offset = (page - 1) * limit;
  
  const activities = await db.all<Activity[]>(
    `SELECT * FROM activities WHERE user_id = ? 
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    userId, limit, offset
  );
  
  const totalResult = await db.get<{ count: number }>(
    `SELECT COUNT(*) as count FROM activities WHERE user_id = ?`,
    userId
  );
  
  return { activities, total: totalResult?.count || 0 };
}

// Settings Services
export async function getSetting(key: string): Promise<string | undefined> {
  const db = await getDb();
  const row = await db.get<{ value: string }>(`SELECT value FROM settings WHERE key = ?`, key);
  return row?.value;
}

export async function setSetting(key: string, value: string, description?: string, category: string = 'system', isPublic: boolean = false): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.run(
    `INSERT INTO settings (key, value, description, category, is_public, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?) 
     ON CONFLICT(key) DO UPDATE SET value=excluded.value, description=excluded.description, category=excluded.category, is_public=excluded.is_public, updated_at=excluded.updated_at`,
    key, value, description, category, isPublic, now, now
  );
}

export async function getAllSettings(): Promise<Setting[]> {
  const db = await getDb();
  const settings = await db.all<Setting[]>(`SELECT * FROM settings ORDER BY category, key`);
  return settings;
}

// Directory Services
export async function createDirectory(directoryData: Omit<Directory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Directory> {
  const db = await getDb();
  const id = `dir_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  
  await db.run(
    `INSERT INTO directories (id, name, client_id, description, is_active, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id, directoryData.name, directoryData.clientId, directoryData.description, directoryData.isActive, now, now
  );
  
  return { ...directoryData, id, createdAt: now, updatedAt: now };
}

export async function getDirectoriesByClientId(clientId: string): Promise<Directory[]> {
  const db = await getDb();
  const directories = await db.all<Directory[]>(
    `SELECT * FROM directories WHERE client_id = ? AND is_active = 1 ORDER BY created_at DESC`,
    clientId
  );
  return directories;
}

// Subdirectory Services
export async function createSubdirectory(subdirectoryData: Omit<Subdirectory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subdirectory> {
  const db = await getDb();
  const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  
  await db.run(
    `INSERT INTO subdirectories (id, name, directory_id, description, is_active, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id, subdirectoryData.name, subdirectoryData.directoryId, subdirectoryData.description, subdirectoryData.isActive, now, now
  );
  
  return { ...subdirectoryData, id, createdAt: now, updatedAt: now };
}

export async function getSubdirectoriesByDirectoryId(directoryId: string): Promise<Subdirectory[]> {
  const db = await getDb();
  const subdirectories = await db.all<Subdirectory[]>(
    `SELECT * FROM subdirectories WHERE directory_id = ? AND is_active = 1 ORDER BY created_at DESC`,
    directoryId
  );
  return subdirectories;
}

