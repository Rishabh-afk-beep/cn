# Backend (FastAPI)

## Stack
- FastAPI
- Firebase Auth (token verification)
- Firestore
- Cloudinary (media integration-ready)

## Run locally
1. Create a virtual environment and install dependencies.
2. Copy `.env.example` to `.env` and fill required values.
3. Start server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API base path: `/api/v1`
