from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.schemas.review import ReviewCreate, ReviewOut
from app.models.schemas.user import UserProfile
from app.repositories.review_repository import ReviewRepository

router = APIRouter()
repo = ReviewRepository()


@router.post("/{property_id}/reviews")
def create_review(
    property_id: str,
    payload: ReviewCreate,
    user: Annotated[UserProfile, Depends(get_current_user)],
) -> ReviewOut:
    return repo.create(property_id=property_id, user_uid=user.uid, payload=payload)


@router.get("/{property_id}/reviews")
def list_reviews(property_id: str) -> list[ReviewOut]:
    return repo.list_by_property(property_id)
