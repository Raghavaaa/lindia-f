# LegalIndia Backend API Documentation

Complete API reference for the LegalIndia backend service.

## Base URL

```
Production: https://your-app.railway.app
Development: http://localhost:8080
```

## Response Format

All API responses follow a consistent structure:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ]  // Optional validation errors
}
```

## Authentication

Optional JWT authentication is supported via Bearer token:

```http
Authorization: Bearer <jwt_token>
```

All endpoints work without authentication but can track user context if provided.

---

## Endpoints

### Health & Status

#### `GET /`
Get API information

**Response:**
```json
{
  "success": true,
  "message": "LegalIndia Backend API",
  "version": "1.0.0",
  "status": "healthy",
  "timestamp": "2025-10-15T10:00:00.000Z"
}
```

#### `GET /health`
Health check endpoint for monitoring

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "uptime": 12345.67,
  "timestamp": "2025-10-15T10:00:00.000Z"
}
```

---

## Property Opinion API

Generate AI-powered legal opinions for property matters.

### `POST /property-opinion`

Generate legal opinion for property issues.

**Request Body:**
```json
{
  "propertyType": "Residential",
  "location": "Mumbai, Maharashtra",
  "issue": "Boundary dispute with neighbor",
  "details": "Additional context about the issue",
  "documents": ["sale_deed.pdf", "survey_map.pdf"]
}
```

**Parameters:**
- `propertyType` (required): Type of property (Residential, Commercial, Agricultural, Land)
- `location` (required): Property location
- `issue` (required): Description of the legal issue
- `details` (optional): Additional details
- `documents` (optional): Array of document names

**Response:**
```json
{
  "success": true,
  "data": {
    "opinion": "Comprehensive legal opinion with:\n1. Legal Analysis\n2. Case Precedents\n3. Risk Assessment\n4. Recommendations\n5. Documentation Requirements\n6. Timeline",
    "confidence": 0.85,
    "propertyType": "Residential",
    "location": "Mumbai, Maharashtra",
    "timestamp": "2025-10-15T10:00:00.000Z"
  }
}
```

**Example cURL:**
```bash
curl -X POST https://your-api.com/property-opinion \
  -H "Content-Type: application/json" \
  -d '{
    "propertyType": "Residential",
    "location": "Mumbai",
    "issue": "Boundary dispute"
  }'
```

### `GET /property-opinion/templates`

Get available property opinion templates.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sale-deed",
      "name": "Sale Deed Review",
      "description": "Legal review of property sale deed",
      "propertyType": "Residential"
    },
    {
      "id": "title-verification",
      "name": "Title Verification",
      "description": "Verify property title and ownership",
      "propertyType": "Any"
    },
    {
      "id": "boundary-dispute",
      "name": "Boundary Dispute",
      "description": "Legal opinion on property boundary disputes",
      "propertyType": "Land"
    },
    {
      "id": "lease-agreement",
      "name": "Lease Agreement",
      "description": "Review and draft lease agreements",
      "propertyType": "Commercial/Residential"
    }
  ]
}
```

---

## Research API

AI-powered legal research using DeepSeek and InLegalBERT models.

### `POST /research`

Perform legal research on Indian law topics.

**Request Body:**
```json
{
  "query": "What are the legal requirements for property registration in India?",
  "model": "deepseek",
  "clientId": "client_123",
  "caseId": "case_456",
  "save": true
}
```

**Parameters:**
- `query` (required): Research question (min 3 characters)
- `model` (optional): AI model to use (`deepseek` or `inlegalbert`, default: `deepseek`)
- `clientId` (optional): Client ID for tracking
- `caseId` (optional): Case ID for tracking
- `save` (optional): Save query to history (default: false)

**Response:**
```json
{
  "success": true,
  "data": {
    "result": "Based on Indian law, property registration is governed by:\n\n1. The Registration Act, 1908\n2. The Transfer of Property Act, 1882\n\nKey Requirements:\n- Execution of sale deed\n- Payment of stamp duty\n- Registration within 4 months\n- Original documents required\n\nDetailed Analysis:\n...",
    "confidence": 0.85,
    "model": "deepseek",
    "query": "What are the legal requirements for property registration in India?",
    "timestamp": "2025-10-15T10:00:00.000Z"
  }
}
```

**Example cURL:**
```bash
curl -X POST https://your-api.com/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is Section 498A IPC?",
    "model": "deepseek"
  }'
```

### `GET /research/history`

Get research history (coming soon).

**Response:**
```json
{
  "success": true,
  "data": [],
  "message": "Research history feature coming soon"
}
```

---

## Case Management API

Analyze cases and generate legal documents.

### `POST /case/analyze`

Analyze legal cases and provide comprehensive insights.

**Request Body:**
```json
{
  "caseTitle": "Property Dispute - Smith vs Jones",
  "caseType": "Civil - Property",
  "description": "Boundary dispute between neighbors",
  "parties": {
    "plaintiff": "John Smith",
    "defendant": "Robert Jones"
  },
  "facts": "Mr. Smith claims that Mr. Jones has encroached on his property by constructing a wall 5 feet into his land...",
  "legalIssues": ["Property boundary", "Adverse possession", "Trespass"]
}
```

**Parameters:**
- `caseTitle` (required): Title of the case
- `caseType` (required): Type of case (Civil, Criminal, Property, etc.)
- `description` (required): Brief description (min 10 chars)
- `parties` (optional): Plaintiff and defendant information
- `facts` (optional): Detailed case facts
- `legalIssues` (optional): Array of legal issues

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": "Comprehensive Case Analysis:\n\n1. Legal Framework:\n- Transfer of Property Act, 1882\n- Specific Relief Act, 1963\n- Limitation Act, 1963\n\n2. Case Precedents:\n- Karnataka Board vs Dharmasthala (2001)\n- Secretary of State vs Debendra (1917)\n\n3. Strengths & Weaknesses:\nStrengths:\n- Clear survey records\n- Witness statements\nWeaknesses:\n- Delay in filing\n\n4. Strategy:\n...",
    "confidence": 0.85,
    "caseTitle": "Property Dispute - Smith vs Jones",
    "caseType": "Civil - Property",
    "timestamp": "2025-10-15T10:00:00.000Z"
  }
}
```

### `POST /case/draft`

Generate legal documents for cases.

**Request Body:**
```json
{
  "documentType": "Plaint",
  "caseTitle": "Property Dispute",
  "parties": {
    "plaintiff": "John Smith",
    "defendant": "Robert Jones"
  },
  "facts": "The plaintiff is the owner of property bearing No. 123...",
  "relief": "Recovery of property and damages"
}
```

**Parameters:**
- `documentType` (required): Type of document (Plaint, Written Statement, Petition, etc.)
- `caseTitle` (required): Case title
- `parties` (required): Plaintiff and defendant
- `facts` (required): Case facts (min 10 chars)
- `relief` (optional): Relief sought

**Response:**
```json
{
  "success": true,
  "data": {
    "document": "IN THE COURT OF...\n\nPLAINT\n\nBetween:\nJohn Smith ... Plaintiff\nVs.\nRobert Jones ... Defendant\n\nThe humble plaintiff most respectfully showeth:\n\n1. That the plaintiff is the lawful owner...\n\n2. That the defendant has...",
    "documentType": "Plaint",
    "timestamp": "2025-10-15T10:00:00.000Z"
  }
}
```

### `GET /case/templates`

Get available case document templates.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "plaint",
      "name": "Plaint (Civil)",
      "description": "Draft a plaint for civil cases"
    },
    {
      "id": "written-statement",
      "name": "Written Statement",
      "description": "Draft a written statement (defense)"
    },
    {
      "id": "petition",
      "name": "Writ Petition",
      "description": "Draft a writ petition"
    },
    {
      "id": "bail-application",
      "name": "Bail Application",
      "description": "Draft a bail application"
    },
    {
      "id": "affidavit",
      "name": "Affidavit",
      "description": "Draft an affidavit"
    }
  ]
}
```

---

## Junior Assistant API

AI-powered legal assistant for various tasks.

### `POST /junior`

Get general legal assistance.

**Request Body:**
```json
{
  "task": "Review this contract and highlight key clauses",
  "context": "Commercial lease agreement for 5 years",
  "priority": "high"
}
```

**Parameters:**
- `task` (required): Task description (min 3 chars)
- `context` (optional): Additional context
- `priority` (optional): Priority level (`low`, `medium`, `high`, `urgent`, default: `medium`)

**Response:**
```json
{
  "success": true,
  "data": {
    "assistance": "Legal Assistance for Contract Review:\n\n1. Quick Analysis:\nThis is a commercial lease agreement requiring thorough review...\n\n2. Relevant Laws:\n- Transfer of Property Act, 1882\n- Indian Contract Act, 1872\n\n3. Action Items:\n- Review rent escalation clause\n- Check lock-in period\n- Verify maintenance terms\n- Review termination clause\n\n4. Resources:\n...",
    "confidence": 0.85,
    "task": "Review this contract and highlight key clauses",
    "priority": "high",
    "timestamp": "2025-10-15T10:00:00.000Z"
  }
}
```

### `POST /junior/review`

Review legal documents.

**Request Body:**
```json
{
  "documentType": "Contract",
  "content": "THIS AGREEMENT made on... [full document content]",
  "focusAreas": ["Termination clauses", "Payment terms", "Liability"]
}
```

**Parameters:**
- `documentType` (required): Type of document
- `content` (required): Full document content (min 10 chars)
- `focusAreas` (optional): Specific areas to focus on

**Response:**
```json
{
  "success": true,
  "data": {
    "review": "Document Review Report:\n\n1. Completeness: ✓ Complete\nThe document contains all essential sections...\n\n2. Legal Accuracy: ⚠️ Issues Found\n- Section 5.2 incorrectly cites Indian Contract Act\n- Clause 8 needs revision\n\n3. Formatting: ✓ Good\nFollows standard legal formatting...\n\n4. Language: ✓ Appropriate\n\n5. Risks:\n- Termination clause is one-sided\n- Force majeure clause is too broad\n\n6. Suggestions:\n...",
    "documentType": "Contract",
    "timestamp": "2025-10-15T10:00:00.000Z"
  }
}
```

### `POST /junior/explain`

Explain legal concepts in simple terms.

**Request Body:**
```json
{
  "concept": "Force Majeure",
  "detail": "simple"
}
```

**Parameters:**
- `concept` (required): Legal concept to explain
- `detail` (optional): Detail level (`simple` or `detailed`, default: `simple`)

**Response:**
```json
{
  "success": true,
  "data": {
    "explanation": "Force Majeure - Simple Explanation:\n\n1. Definition:\nForce Majeure means 'superior force' - events beyond anyone's control that prevent fulfilling a contract.\n\n2. Legal Basis:\n- Indian Contract Act, 1872 - Section 56\n- Contract terms\n\n3. Practical Example:\nIf you rent a hall for a wedding and an earthquake destroys it, that's force majeure - neither party is liable.\n\n4. Common Misconceptions:\n- It doesn't cover every difficulty\n- Must be truly unforeseeable\n- Contract must include force majeure clause\n\n5. Related Concepts:\n- Act of God\n- Frustration of contract\n\n6. Key Takeaways:\n- Excuses non-performance\n- Must be in contract\n- Examples: earthquakes, wars, pandemics",
    "concept": "Force Majeure",
    "detailLevel": "simple",
    "timestamp": "2025-10-15T10:00:00.000Z"
  }
}
```

### `GET /junior/tasks`

Get list of common legal tasks.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "legal-research",
      "name": "Legal Research",
      "description": "Research case law and legal provisions",
      "category": "Research"
    },
    {
      "id": "document-review",
      "name": "Document Review",
      "description": "Review legal documents for accuracy",
      "category": "Documentation"
    },
    {
      "id": "case-summary",
      "name": "Case Summary",
      "description": "Summarize case facts and judgments",
      "category": "Analysis"
    },
    {
      "id": "legal-drafting",
      "name": "Legal Drafting",
      "description": "Draft legal notices and documents",
      "category": "Drafting"
    },
    {
      "id": "compliance-check",
      "name": "Compliance Check",
      "description": "Check compliance with legal requirements",
      "category": "Compliance"
    }
  ]
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input/validation error |
| 401 | Unauthorized - Invalid or missing JWT token |
| 404 | Not Found - Endpoint doesn't exist |
| 500 | Internal Server Error - Server-side error |

## Rate Limiting

Rate limiting is currently not enforced but will be added in future versions.

Recommended limits:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_URL = 'https://your-api.railway.app';

async function research(query) {
  const response = await axios.post(`${API_URL}/research`, {
    query: query,
    model: 'deepseek'
  });
  return response.data;
}

async function propertyOpinion(propertyType, location, issue) {
  const response = await axios.post(`${API_URL}/property-opinion`, {
    propertyType,
    location,
    issue
  });
  return response.data;
}

// Usage
research('What is Indian Contract Act?')
  .then(data => console.log(data.data.result))
  .catch(error => console.error(error));
```

### Python

```python
import requests

API_URL = 'https://your-api.railway.app'

def research(query, model='deepseek'):
    response = requests.post(
        f'{API_URL}/research',
        json={'query': query, 'model': model}
    )
    return response.json()

def property_opinion(property_type, location, issue):
    response = requests.post(
        f'{API_URL}/property-opinion',
        json={
            'propertyType': property_type,
            'location': location,
            'issue': issue
        }
    )
    return response.json()

# Usage
result = research('What is Section 498A IPC?')
print(result['data']['result'])
```

### cURL

```bash
# Health check
curl https://your-api.railway.app/health

# Research
curl -X POST https://your-api.railway.app/research \
  -H "Content-Type: application/json" \
  -d '{"query":"What is Indian Contract Act?","model":"deepseek"}'

# Property opinion
curl -X POST https://your-api.railway.app/property-opinion \
  -H "Content-Type: application/json" \
  -d '{
    "propertyType":"Residential",
    "location":"Mumbai",
    "issue":"Boundary dispute"
  }'

# Case analysis
curl -X POST https://your-api.railway.app/case/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "caseTitle":"Property Dispute",
    "caseType":"Civil",
    "description":"Boundary dispute case"
  }'

# Junior assistant
curl -X POST https://your-api.railway.app/junior \
  -H "Content-Type: application/json" \
  -d '{
    "task":"Explain adverse possession",
    "priority":"high"
  }'
```

## Support

For API support:
- Check the [README](./README.md) for setup instructions
- Review [DEPLOYMENT](./DEPLOYMENT.md) for deployment guides
- Check application logs for errors
- Verify environment variables are correctly set

