from pathlib import Path

import firebase_admin
from firebase_admin import credentials

from app.core.config import get_settings


def initialize_firebase() -> None:
    if firebase_admin._apps:
        return

    settings = get_settings()
    cred_path = settings.google_application_credentials.strip()

    if cred_path and Path(cred_path).exists():
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {"projectId": settings.firebase_project_id or None})
        return

    firebase_admin.initialize_app(options={"projectId": settings.firebase_project_id or None})
