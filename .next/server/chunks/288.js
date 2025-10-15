exports.id=288,exports.ids=[288],exports.modules={2179:(a,b,c)=>{"use strict";c.d(b,{Lf:()=>k,PL:()=>l});var d=c(3873),e=c.n(d),f=c(6689),g=c.n(f),h=c(73);async function i(a){await a.exec("PRAGMA foreign_keys = ON;"),await a.exec(`
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
  `),await a.exec(`
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
  `),await a.exec(`
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
  `),await a.exec(`
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
  `),await a.exec(`
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
  `),await a.exec(`
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
  `),await a.exec(`
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
  `),await a.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'system' CHECK (category IN ('system', 'user', 'ai', 'legal')),
      is_public BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `),await a.exec(`
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
  `),await a.exec(`
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
  `),await a.exec(`
    INSERT OR IGNORE INTO settings (key, value, description, category, is_public) VALUES
    ('PROMPT_BASE', 'You are an expert Indian legal research assistant. Provide comprehensive, accurate, and practical legal guidance for Indian law.', 'Base prompt for AI research', 'ai', 0),
    ('DEEPSEEK_API_KEY', '', 'DeepSeek API key for legal research', 'ai', 0),
    ('HF_TOKEN', '', 'Hugging Face token for InLegalBERT', 'ai', 0),
    ('MAX_RESEARCH_LENGTH', '5000', 'Maximum length for research responses', 'ai', 0),
    ('DEFAULT_PAGE_SIZE', '20', 'Default pagination size', 'system', 1),
    ('MAX_FILE_SIZE', '10485760', 'Maximum file upload size in bytes (10MB)', 'system', 1),
    ('ALLOWED_FILE_TYPES', 'pdf,doc,docx,txt,jpg,jpeg,png', 'Allowed file types for upload', 'system', 1);
  `)}let j=null;async function k(){if(!j){let a=e().join(process.cwd(),"data.sqlite");j=(0,h.ho)({filename:a,driver:g().Database});let b=await j;await b.exec("PRAGMA journal_mode = WAL;"),await i(b)}return j}async function l(a){let b=await k(),c=await b.get("SELECT value FROM settings WHERE key = ?",a);return c?.value}},3746:(a,b,c)=>{"use strict";c.d(b,{ru:()=>g});var d=c(641),e=c(7025),f=c(4135);async function g(a,b){try{let c=await (0,e.getToken)({req:a});if(!c||!c.email)return d.NextResponse.json({success:!1,error:"Authentication required"},{status:401});let g=await (0,f.ht)(c.email);if(!g)return d.NextResponse.json({success:!1,error:"User not found"},{status:401});return a.user={id:g.id,email:g.email,name:g.name,role:g.role},b(a)}catch(a){return console.error("Auth middleware error:",a),d.NextResponse.json({success:!1,error:"Authentication failed"},{status:500})}}},4135:(a,b,c)=>{"use strict";c.d(b,{E1:()=>p,EZ:()=>i,TK:()=>g,UU:()=>h,a:()=>m,bx:()=>n,ht:()=>f,kl:()=>e,n:()=>o,w_:()=>j,zO:()=>k,zZ:()=>l});var d=c(2179);async function e(a){let b=await (0,d.Lf)();return await b.get("SELECT * FROM users WHERE id = ? AND is_active = 1",a)||null}async function f(a){let b=await (0,d.Lf)();return await b.get("SELECT * FROM users WHERE email = ? AND is_active = 1",a)||null}async function g(a,b){let c=await (0,d.Lf)(),f=Object.keys(b).filter(a=>"id"!==a&&"createdAt"!==a).map(a=>`${a} = ?`).join(", ");if(!f)return null;let g=Object.entries(b).filter(([a])=>"id"!==a&&"createdAt"!==a).map(([,a])=>a);return await c.run(`UPDATE users SET ${f}, updated_at = ? WHERE id = ?`,...g,new Date().toISOString(),a),e(a)}async function h(a){let b=await (0,d.Lf)(),c=`client_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,e=new Date().toISOString();return await b.run(`INSERT INTO clients (id, name, email, phone, address, reference_id, user_id, is_active, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,c,a.name,a.email,a.phone,a.address,a.referenceId,a.userId,a.isActive,e,e),{...a,id:c,createdAt:e,updatedAt:e}}async function i(a){let b=await (0,d.Lf)();return await b.get("SELECT * FROM clients WHERE id = ? AND is_active = 1",a)||null}async function j(a,b){let c=await (0,d.Lf)(),e=b?.page||1,f=b?.limit||20,g=await c.all(`SELECT * FROM clients WHERE user_id = ? AND is_active = 1 
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,a,f,(e-1)*f),h=await c.get("SELECT COUNT(*) as count FROM clients WHERE user_id = ? AND is_active = 1",a);return{clients:g,total:h?.count||0}}async function k(a,b){let c=await (0,d.Lf)(),e=Object.keys(b).filter(a=>"id"!==a&&"createdAt"!==a).map(a=>`${a} = ?`).join(", ");if(!e)return null;let f=Object.entries(b).filter(([a])=>"id"!==a&&"createdAt"!==a).map(([,a])=>a);return await c.run(`UPDATE clients SET ${e}, updated_at = ? WHERE id = ?`,...f,new Date().toISOString(),a),i(a)}async function l(a){let b=await (0,d.Lf)();return(await b.run("UPDATE clients SET is_active = 0 WHERE id = ?",a)).changes>0}async function m(a){let b=await (0,d.Lf)(),c=`rq_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,e=new Date().toISOString();return await b.run(`INSERT INTO research_queries (id, user_id, client_id, query_text, response_text, status, model, confidence, tags, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,c,a.userId,a.clientId,a.queryText,a.responseText,a.status,a.model,a.confidence,a.tags?JSON.stringify(a.tags):null,e,e),{...a,id:c,createdAt:e,updatedAt:e}}async function n(a){let b=await (0,d.Lf)(),c=`case_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,e=new Date().toISOString();return await b.run(`INSERT INTO cases (id, title, description, case_number, court, status, priority, client_id, assigned_to, start_date, end_date, tags, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,c,a.title,a.description,a.caseNumber,a.court,a.status,a.priority,a.clientId,a.assignedTo,a.startDate,a.endDate,a.tags?JSON.stringify(a.tags):null,e,e),{...a,id:c,createdAt:e,updatedAt:e}}async function o(a,b){let c=await (0,d.Lf)(),e=b?.page||1,f=b?.limit||20,g=await c.all(`SELECT * FROM cases WHERE assigned_to = ? 
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,a,f,(e-1)*f),h=await c.get("SELECT COUNT(*) as count FROM cases WHERE assigned_to = ?",a);return{cases:g,total:h?.count||0}}async function p(a){let b=await (0,d.Lf)(),c=`act_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,e=new Date().toISOString();return await b.run(`INSERT INTO activities (id, type, action, description, user_id, client_id, case_id, metadata, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,c,a.type,a.action,a.description,a.userId,a.clientId,a.caseId,a.metadata?JSON.stringify(a.metadata):null,e),{...a,id:c,createdAt:e}}},4143:(a,b,c)=>{"use strict";c.d(b,{Ao:()=>k,Kb:()=>n,OT:()=>m,gC:()=>l,i0:()=>o,ig:()=>p,n:()=>j,q8:()=>g,ue:()=>i,xc:()=>h});var d=c(641),e=c(2995),f=c(5559);e.Ik({name:e.Yj().min(1,"Name is required").max(100,"Name too long"),email:e.Yj().email("Invalid email format"),password:e.Yj().min(6,"Password must be at least 6 characters"),phone:e.Yj().optional(),address:e.Yj().optional(),role:e.k5(["user","admin","lawyer"]).optional().default("user")});let g=e.Ik({name:e.Yj().min(1,"Name is required").max(100,"Name too long").optional(),phone:e.Yj().optional(),address:e.Yj().optional(),image:e.Yj().url("Invalid image URL").optional()}),h=e.Ik({name:e.Yj().min(1,"Name is required").max(100,"Name too long"),email:e.Yj().email("Invalid email format").optional(),phone:e.Yj().min(10,"Phone number is required"),address:e.Yj().optional(),referenceId:e.Yj().optional()}),i=e.Ik({name:e.Yj().min(1,"Name is required").max(100,"Name too long").optional(),email:e.Yj().email("Invalid email format").optional(),phone:e.Yj().min(10,"Phone number is required").optional(),address:e.Yj().optional(),referenceId:e.Yj().optional()}),j=e.Ik({query:e.Yj().min(1,"Query is required").max(5e3,"Query too long"),clientId:e.Yj().optional(),save:e.zM().optional().default(!1),model:e.k5(["deepseek","inlegalbert","manual"]).optional().default("deepseek")}),k=e.Ik({title:e.Yj().min(1,"Title is required").max(200,"Title too long"),description:e.Yj().optional(),caseNumber:e.Yj().optional(),court:e.Yj().optional(),priority:e.k5(["low","medium","high","urgent"]).optional().default("medium"),clientId:e.Yj().min(1,"Client ID is required"),startDate:e.Yj().datetime("Invalid date format"),tags:e.YO(e.Yj()).optional()});e.Ik({title:e.Yj().min(1,"Title is required").max(200,"Title too long").optional(),description:e.Yj().optional(),caseNumber:e.Yj().optional(),court:e.Yj().optional(),status:e.k5(["active","closed","pending"]).optional(),priority:e.k5(["low","medium","high","urgent"]).optional(),endDate:e.Yj().datetime("Invalid date format").optional(),tags:e.YO(e.Yj()).optional()});let l=e.Ik({page:e.au.number().min(1).optional().default(1),limit:e.au.number().min(1).max(100).optional().default(20),sortBy:e.Yj().optional(),sortOrder:e.k5(["asc","desc"]).optional().default("desc"),search:e.Yj().optional()}),m=e.Ik({id:e.Yj().min(1,"ID is required")});function n(a){return function(b,c){return async b=>{try{let d;if("GET"===b.method){let c=new URL(b.url),e=Object.fromEntries(c.searchParams.entries());d=a.parse(e)}else{let c=await b.json();d=a.parse(c)}return c(b,d)}catch(a){if(a instanceof f.G)return d.NextResponse.json({success:!1,error:"Validation failed",details:a.errors.map(a=>({field:a.path.join("."),message:a.message}))},{status:400});return console.error("Validation middleware error:",a),d.NextResponse.json({success:!1,error:"Invalid request format"},{status:400})}}}}function o(a){return d.NextResponse.json({success:!1,error:`${a} not found`},{status:404})}function p(a="Internal server error"){return d.NextResponse.json({success:!1,error:a},{status:500})}},6487:()=>{},8335:()=>{}};