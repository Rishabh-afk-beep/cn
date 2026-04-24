from typing import Optional

from pydantic import BaseModel


class CollegeOut(BaseModel):
    college_id: str
    name: str
    short_name: Optional[str] = None
    address: Optional[str] = None
    city: str
    state: str
    latitude: float
    longitude: float
    status: str = "active"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class CollegeCreate(BaseModel):
    name: str
    short_name: Optional[str] = None
    address: Optional[str] = None
    city: str
    state: str
    latitude: float
    longitude: float


class CollegeUpdate(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = None
