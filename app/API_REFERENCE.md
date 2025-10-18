# LegalIndia.ai Backend API Reference

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

All endpoints (except auth endpoints) require a JWT bearer token:

```http
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User

```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "lawyer@example.com",
  "username": "lawyer_john",
  "password": "SecurePassword123!",
  "full_name": "John Doe",
  "profession": "lawyer",
  "bar_council_number": "BC123456",
  "organization": "Law Firm XYZ"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "lawyer@example.com",
  "username": "lawyer_john",
  "full_name": "John Doe",
  "profession": "lawyer",
  "bar_council_number": "BC123456",
  "organization": "Law Firm XYZ",
  "is_active": true,
  "is_verified": false,
  "created_at": "2025-10-15T00:00:00",
  "last_login": null
}
```

### Login

```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "username": "lawyer_john",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Get Current User

```http
GET /api/v1/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "lawyer@example.com",
  "username": "lawyer_john",
  "full_name": "John Doe",
  "profession": "lawyer",
  "is_active": true,
  "is_verified": true,
  "created_at": "2025-10-15T00:00:00",
  "last_login": "2025-10-15T00:00:00"
}
```

---

## Property Opinion Endpoints

### Create Property Opinion Request

```http
POST /api/v1/property-opinion/
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "property_address": "Plot 123, Sector 45",
  "property_type": "residential",
  "survey_number": "S-123/45",
  "plot_number": "P-456",
  "city": "Bangalore",
  "state": "Karnataka",
  "documents": [],
  "specific_concerns": "Check for encumbrances and title clearance"
}
```

**Response:**
```json
{
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "opinion_summary": null,
  "detailed_analysis": null,
  "recommendations": null,
  "created_at": "2025-10-15T00:00:00"
}
```

### Get Opinion Status

```http
GET /api/v1/property-opinion/{request_id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "opinion_summary": "Property title appears clear...",
  "detailed_analysis": {},
  "recommendations": ["Verify documents", "Check encumbrances"],
  "created_at": "2025-10-15T00:00:00"
}
```

---

## Legal Research Endpoints

### Perform Research

```http
POST /api/v1/research/
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "query": "What are the legal requirements for property transfer in India?",
  "jurisdiction": "india",
  "practice_area": "property",
  "include_cases": true,
  "include_statutes": true,
  "max_results": 10
}
```

**Response:**
```json
{
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "query": "What are the legal requirements for property transfer in India?",
  "results": [
    {
      "title": "Sample Case Law Result",
      "citation": "2023 SCC 123",
      "court": "Supreme Court of India",
      "relevance_score": 0.95,
      "snippet": "This is a placeholder result..."
    }
  ],
  "total_results": 1,
  "summary": "Research completed successfully.",
  "created_at": "2025-10-15T00:00:00"
}
```

### Get Research History

```http
GET /api/v1/research/history?limit=10
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Maximum number of records (default: 10)

**Response:**
```json
[]
```

---

## Case Search Endpoints

### Search Cases (POST)

```http
POST /api/v1/cases/search
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "query": "contract breach",
  "court": "Supreme Court of India",
  "year": 2023,
  "page": 1,
  "page_size": 10
}
```

**Response:**
```json
{
  "cases": [
    {
      "case_number": "Civil Appeal No. 1234 of 2023",
      "title": "ABC Corporation vs. XYZ Ltd.",
      "court": "Supreme Court of India",
      "year": 2023,
      "judge": "Justice ABC",
      "date": "2023-05-15",
      "summary": "This is a placeholder case summary...",
      "citation": "2023 SCC 456"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 10
}
```

### Search Cases (GET)

```http
GET /api/v1/cases/search?query=contract&court=Supreme%20Court&year=2023
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `query` (optional): Search query
- `case_number` (optional): Case number
- `court` (optional): Court name
- `year` (optional): Year of the case
- `judge` (optional): Judge name
- `party_name` (optional): Party name
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Page size (default: 10, max: 100)

### Get Case Details

```http
GET /api/v1/cases/{case_id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "case_id": "123",
  "case_number": "Civil Appeal No. 1234 of 2023",
  "title": "ABC Corporation vs. XYZ Ltd.",
  "court": "Supreme Court of India",
  "year": 2023,
  "details": "Full case details would be here..."
}
```

---

## Legal Junior Assistant Endpoints

### Chat with Junior

```http
POST /api/v1/junior/chat
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "question": "Draft a notice for property encroachment",
  "context": "The encroachment is on a residential property in Delhi",
  "conversation_id": null
}
```

**Response:**
```json
{
  "answer": "I understand you're asking about: Draft a notice for property encroachment...",
  "sources": [
    "Indian Contract Act, 1872",
    "Relevant case law citations would appear here"
  ],
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2025-10-15T00:00:00"
}
```

### Get Conversation History

```http
GET /api/v1/junior/conversation/{conversation_id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "messages": [],
  "created_at": "2025-10-15T00:00:00"
}
```

---

## Health Check

### Health Status

```http
GET /health
```

**No authentication required**

**Response:**
```json
{
  "status": "ok"
}
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "detail": "Could not validate credentials"
}
```

### 404 Not Found

```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

Currently not implemented. Will be added in future versions.

## Versioning

The API uses URL versioning. Current version: `v1`

All endpoints are prefixed with `/api/v1`

