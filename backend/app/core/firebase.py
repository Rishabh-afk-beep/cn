import base64
import json
import os
import tempfile
from pathlib import Path

import firebase_admin
from firebase_admin import credentials

from app.core.config import get_settings


def initialize_firebase() -> None:
    if firebase_admin._apps:
        return

    settings = get_settings()
    cred_path = settings.google_application_credentials.strip()

    # Option 1: Service account JSON file on disk
    if cred_path and Path(cred_path).exists():
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {"projectId": settings.firebase_project_id or None})
        return

    # Option 2: Base64-encoded service account (for Render / cloud deployments)
    b64 = os.getenv("FIREBASE_SERVICE_ACCOUNT_B64", "").strip()
    if b64:
        sa_json = json.loads(base64.b64decode(b64).decode("utf-8"))
        cred = credentials.Certificate(sa_json)
        firebase_admin.initialize_app(cred, {"projectId": settings.firebase_project_id or None})
        return

    # Option 3: Fall back to Application Default Credentials
    firebase_admin.initialize_app(options={"projectId": settings.firebase_project_id or None})
