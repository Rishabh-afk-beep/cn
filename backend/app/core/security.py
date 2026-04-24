from typing import Any, Dict

import jwt
from fastapi import HTTPException, status
from firebase_admin import auth

from app.core.config import get_settings


def verify_firebase_token(token: str) -> Dict[str, Any]:
    settings = get_settings()
    try:
        return auth.verify_id_token(token)
    except Exception:
        if settings.dev_auth_enabled:
            try:
                payload = jwt.decode(token, settings.dev_auth_secret, algorithms=["HS256"])
                if not payload.get("uid"):
                    raise ValueError("missing uid")
                if not payload.get("role"):
                    raise ValueError("missing role")
                return payload
            except Exception as exc:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail={"code": "AUTH_INVALID_TOKEN", "message": "Invalid or expired token"},
                ) from exc

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTH_INVALID_TOKEN", "message": "Invalid or expired token"},
        )
