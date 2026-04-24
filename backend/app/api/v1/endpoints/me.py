from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.models.schemas.user import ProfileComplete, UserProfile, UserUpdate
from app.repositories.user_repository import UserRepository

router = APIRouter()
user_repo = UserRepository()


@router.get("")
def get_me(user: Annotated[UserProfile, Depends(get_current_user)]) -> UserProfile:
    stored = user_repo.get_by_uid(user.uid)
    if stored:
        return stored
    return user


@router.patch("")
def update_me(
    payload: UserUpdate,
    user: Annotated[UserProfile, Depends(get_current_user)],
) -> UserProfile:
    patch = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not patch:
        return user

    updated = user_repo.update_fields(user.uid, patch)
    if updated is None:
        # User might not exist in DB yet — create them
        merged = user.model_dump()
        merged.update(patch)
        return user_repo.upsert(UserProfile(**merged))
    return updated


@router.post("/complete-profile")
def complete_profile(
    payload: ProfileComplete,
    user: Annotated[UserProfile, Depends(get_current_user)],
) -> UserProfile:
    data = user.model_dump()
    data.update(payload.model_dump(exclude_none=True))
    data["verification_state"] = "pending"
    profile = UserProfile(**data)
    return user_repo.upsert(profile)
