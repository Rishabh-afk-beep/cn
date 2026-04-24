import os
from functools import lru_cache
from typing import Optional

from google.cloud import firestore
from google.oauth2 import service_account

from app.core.config import get_settings


@lru_cache
def get_firestore_client() -> Optional[firestore.Client]:
    settings = get_settings()
    if not settings.firebase_project_id:
        return None

    # Use service account credentials if available
    creds_path = settings.google_application_credentials
    if creds_path and os.path.exists(creds_path):
        credentials = service_account.Credentials.from_service_account_file(creds_path)
        return firestore.Client(project=settings.firebase_project_id, credentials=credentials)

    # Fall back to Application Default Credentials
    try:
        return firestore.Client(project=settings.firebase_project_id)
    except Exception:
        return None
