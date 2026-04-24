from datetime import datetime, timezone
from typing import List, Optional
from uuid import uuid4

from app.models.schemas.college import CollegeCreate, CollegeOut, CollegeUpdate
from app.repositories.firestore_client import get_firestore_client


_FALLBACK_COLLEGES = {
    "sample-college-1": {
        "college_id": "sample-college-1",
        "name": "Sample Engineering College",
        "short_name": "SEC",
        "address": "Gachibowli, Hyderabad",
        "city": "Hyderabad",
        "state": "Telangana",
        "latitude": 17.385,
        "longitude": 78.4867,
        "status": "active",
        "created_at": "2026-01-01T00:00:00+00:00",
        "updated_at": "2026-01-01T00:00:00+00:00",
    },
    "sample-college-2": {
        "college_id": "sample-college-2",
        "name": "National Institute of Technology",
        "short_name": "NIT",
        "address": "Warangal, Telangana",
        "city": "Warangal",
        "state": "Telangana",
        "latitude": 17.9784,
        "longitude": 79.5302,
        "status": "active",
        "created_at": "2026-01-01T00:00:00+00:00",
        "updated_at": "2026-01-01T00:00:00+00:00",
    },
}


class CollegeRepository:
    @staticmethod
    def _now() -> str:
        return datetime.now(timezone.utc).isoformat()

    def list_active(self) -> List[CollegeOut]:
        client = get_firestore_client()
        if client is None:
            return [CollegeOut(**c) for c in _FALLBACK_COLLEGES.values() if c.get("status") == "active"]

        docs = client.collection("colleges").where("status", "==", "active").stream()
        return [CollegeOut(**doc.to_dict()) for doc in docs]

    def list_all(self) -> List[CollegeOut]:
        client = get_firestore_client()
        if client is None:
            return [CollegeOut(**c) for c in _FALLBACK_COLLEGES.values()]

        docs = client.collection("colleges").stream()
        return [CollegeOut(**doc.to_dict()) for doc in docs]

    def get_by_id(self, college_id: str) -> Optional[CollegeOut]:
        client = get_firestore_client()
        if client is None:
            data = _FALLBACK_COLLEGES.get(college_id)
            return CollegeOut(**data) if data else None

        doc = client.collection("colleges").document(college_id).get()
        if not doc.exists:
            return None
        return CollegeOut(**doc.to_dict())

    def create(self, payload: CollegeCreate) -> CollegeOut:
        now = self._now()
        college_id = f"college_{uuid4().hex[:10]}"
        data = {
            "college_id": college_id,
            **payload.model_dump(),
            "status": "active",
            "created_at": now,
            "updated_at": now,
        }

        client = get_firestore_client()
        if client is not None:
            client.collection("colleges").document(college_id).set(data)
        else:
            _FALLBACK_COLLEGES[college_id] = data

        return CollegeOut(**data)

    def update(self, college_id: str, payload: CollegeUpdate) -> Optional[CollegeOut]:
        patch = {k: v for k, v in payload.model_dump().items() if v is not None}
        patch["updated_at"] = self._now()

        client = get_firestore_client()
        if client is None:
            current = _FALLBACK_COLLEGES.get(college_id)
            if current is None:
                return None
            current.update(patch)
            _FALLBACK_COLLEGES[college_id] = current
            return CollegeOut(**current)

        ref = client.collection("colleges").document(college_id)
        doc = ref.get()
        if not doc.exists:
            return None
        ref.update(patch)
        current = doc.to_dict()
        current.update(patch)
        return CollegeOut(**current)

    def delete(self, college_id: str) -> bool:
        client = get_firestore_client()
        if client is None:
            return _FALLBACK_COLLEGES.pop(college_id, None) is not None

        ref = client.collection("colleges").document(college_id)
        doc = ref.get()
        if not doc.exists:
            return False
        ref.delete()
        return True
