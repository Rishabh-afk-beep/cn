from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import require_admin
from app.models.schemas.college import CollegeCreate, CollegeOut, CollegeUpdate
from app.models.schemas.user import UserProfile
from app.repositories.college_repository import CollegeRepository

router = APIRouter()
repo = CollegeRepository()


@router.get("")
def list_colleges() -> list[CollegeOut]:
    return repo.list_active()


@router.get("/{college_id}")
def get_college(college_id: str) -> CollegeOut:
    item = repo.get_by_id(college_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "COLLEGE_NOT_FOUND", "message": "College not found"},
        )
    return item
