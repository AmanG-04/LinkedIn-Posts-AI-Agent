# Backend — LinkedIn Posts AI Agent

This is the FastAPI backend for the LinkedIn Posts AI Agent. It provides AI-driven content generation, topic management, scheduling, and analytics endpoints and integrates with MongoDB and the LinkedIn API.

## Quick overview
- Framework: FastAPI (Python)
- Main entry: `backend/main.py`
- Runs on Uvicorn (ASGI)
- Stores secrets in a `backend/.env` file (use `backend/.env.example` as template)

## Prerequisites
- Python 3.10+ (or matching your project venv)
- MongoDB (if using persistence)
- API keys: Gemini/OpenAI, LinkedIn OAuth credentials

## Setup (local)

1. Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Create `backend/.env` by copying the example and filling values:

```powershell
copy .env.example .env
# then edit .env and set values like MONGODB_URI, GEMINI_API_KEY, LINKEDIN_CLIENT_ID, etc.
```

4. Start the server for development:

```powershell
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000/` to verify the backend is running. API docs are available at `/docs` (Swagger UI) and `/redoc`.

## Important environment variables (examples)
- `MONGODB_URI` — MongoDB connection string
- `GEMINI_API_KEY` — API key for Google Gemini (or other AI provider)
- `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` — LinkedIn OAuth credentials
- `LINKEDIN_REDIRECT_URI` — OAuth callback URL
- `SECRET_KEY` — app secret for any server-side signing

Keep secrets out of source control. Use `backend/.env.example` to document required keys.

## Key endpoints (summary)
- `GET /` — health endpoint
- `GET /non-posted-topics` — list topics not yet posted
- `GET /used-topics` — list topics already posted
- `POST /generate-news-post` — generate a post from a news headline (body: `{ "title": "..." }`)
- `POST /generate-post` — generate a personalized post (expects JSON input)
- `POST /save-generated-post` — save generated post to DB
- `GET /get-generated-post/{topic}` — fetch saved generated post for a topic
- `POST /schedule-post` — schedule a post for future publishing
- `GET /scheduled-posts` — list scheduled posts
- `POST /api/linkedin/logout` — clear LinkedIn cookie (if used by backend)

See `backend/routes.py` for the full list and request/response shapes.

## Development notes
- Logs and exceptions are printed to the console. Use the `/test-gemini` endpoint to verify AI connectivity.
- If scheduled jobs are used, ensure the scheduler persists tasks (MongoDB) so jobs survive restarts.
- CORS is configured in `main.py` via `Config.CORS_ORIGINS` — update it when serving frontend from another origin.

## Troubleshooting
- Backend not reachable: confirm the server output shows `Uvicorn running on http://127.0.0.1:8000` and try `http://127.0.0.1:8000/` in the browser.
- Cookies and logout: if cookies are set by frontend (Next.js), logout must be handled by the same origin; otherwise backend cannot delete HTTP-only cookies set elsewhere.
- Token errors with LinkedIn: handle 401/expired tokens by re-running the OAuth flow.

## Tests & validation
- Add unit tests for critical endpoints. Use FastAPI `TestClient` for endpoint tests.

## Deployment
- Use production-ready ASGI server and process supervisor (Gunicorn + Uvicorn workers or similar). Set `DEBUG=False` in production and secure your environment variables.

## Contact / source
See the project root `README.md`, `Technical_Report.md`, and `userguide.md` for additional documentation and demo instructions.
