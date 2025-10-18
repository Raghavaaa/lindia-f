# LegalIndia.ai Backend (lindia-b)

Backend API for LegalIndia.ai - Your AI-powered legal assistant for Indian law.

## Project Structure

```
app/
├── app/
│   ├── routes/              # API routes/endpoints
│   │   ├── property_opinion.py
│   │   ├── research.py
│   │   ├── case.py
│   │   ├── junior.py
│   │   └── auth.py
│   ├── controllers/         # Business logic
│   │   ├── property_opinion_controller.py
│   │   ├── research_controller.py
│   │   ├── case_controller.py
│   │   └── junior_controller.py
│   ├── models/             # Database models
│   │   ├── user_model.py
│   │   └── client_model.py
│   ├── schemas/            # Request/Response schemas
│   │   ├── user_schema.py
│   │   └── query_schema.py
│   └── core/               # Core utilities
│       ├── config.py
│       ├── security.py
│       └── logger.py
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (template)
├── .gitignore             # Git ignore rules
└── Procfile               # Deployment configuration
```

## Setup Instructions

### Prerequisites

- Python 3.12 or higher
- pip (Python package manager)

### Installation

1. **Create a virtual environment:**

```bash
python3.12 -m venv venv
```

2. **Activate the virtual environment:**

On macOS/Linux:
```bash
source venv/bin/activate
```

On Windows:
```bash
venv\Scripts\activate
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

4. **Configure environment variables:**

Edit the `.env` file with your configuration:

```env
DATABASE_URL=postgresql://user:pass@host:port/dbname
AI_ENGINE_URL=https://ai.legalindia.ai
JWT_SECRET=your_secure_jwt_secret_here
FRONTEND_ORIGIN=https://legalindia.ai
```

**Important:** Generate a secure JWT secret using:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Running the Application

### Development Mode

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or simply:
```bash
python main.py
```

### Production Mode

Using Gunicorn (as configured in Procfile):
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## API Documentation

Once the application is running, visit:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/me` - Get current user profile
- `POST /api/v1/auth/refresh` - Refresh access token

### Property Opinion
- `POST /api/v1/property-opinion/` - Create property opinion request
- `GET /api/v1/property-opinion/{request_id}` - Get opinion status

### Legal Research
- `POST /api/v1/research/` - Perform legal research
- `GET /api/v1/research/history` - Get research history

### Case Search
- `POST /api/v1/cases/search` - Search cases (POST)
- `GET /api/v1/cases/search` - Search cases (GET)
- `GET /api/v1/cases/{case_id}` - Get case details

### Legal Junior Assistant
- `POST /api/v1/junior/chat` - Chat with AI assistant
- `GET /api/v1/junior/conversation/{conversation_id}` - Get conversation history

## Authentication

All API endpoints (except `/health`, `/`, `/auth/register`, and `/auth/login`) require JWT authentication.

Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Technology Stack

- **Framework:** FastAPI
- **Server:** Uvicorn + Gunicorn
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt (passlib)
- **Data Validation:** Pydantic
- **Database ORM:** SQLModel
- **HTTP Client:** httpx
- **Logging:** Loguru
- **Monitoring:** Sentry SDK

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| AI_ENGINE_URL | URL of the AI inference engine | Yes |
| JWT_SECRET | Secret key for JWT signing | Yes |
| FRONTEND_ORIGIN | Frontend URL for CORS | Yes |
| DEBUG | Enable debug mode (default: False) | No |

## Development

### Code Structure

- **Routes:** Define API endpoints and handle HTTP requests
- **Controllers:** Contain business logic and orchestrate operations
- **Models:** Define database schema using SQLModel
- **Schemas:** Define request/response validation using Pydantic
- **Core:** Shared utilities (config, security, logging)

### Adding New Endpoints

1. Create schema in `app/schemas/`
2. Implement business logic in `app/controllers/`
3. Create route in `app/routes/`
4. Include router in `main.py`

## Deployment

The application is configured for deployment on platforms like Heroku, Railway, or any platform supporting Python applications.

The `Procfile` is already configured for production deployment:
```
web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## Security Considerations

- JWT tokens expire after 30 minutes (configurable)
- Passwords are hashed using bcrypt
- CORS is restricted to the configured frontend origin
- All API endpoints (except auth) require authentication

## License

Proprietary - LegalIndia.ai

## Support

For support and questions, contact the development team.

