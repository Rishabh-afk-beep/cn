from fastapi import HTTPException, status


def require_roles(current_role: str, allowed_roles: set[str]) -> None:
    if current_role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "AUTH_FORBIDDEN", "message": "Insufficient permissions"},
        )
