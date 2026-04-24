from datetime import datetime, timezone
from typing import Dict, List
from uuid import uuid4

from app.models.schemas.review import ReviewCreate, ReviewOut
from app.repositories.firestore_client import get_firestore_client

_FALLBACK_REVIEWS: Dict[str, List[ReviewOut]] = {}


class ReviewRepository:
    @staticmethod
    def _now() -> str:
        return datetime.now(timezone.utc).isoformat()

    def create(self, property_id: str, user_uid: str, payload: ReviewCreate) -> ReviewOut:
        review = ReviewOut(
            review_id=f"review_{uuid4().hex[:10]}",
            property_id=property_id,
            user_uid=user_uid,
            rating=payload.rating,
            title=payload.title,
            comment=payload.comment,
            stay_status=payload.stay_status,
            moderation_status="visible",
            created_at=self._now(),
        )

        client = get_firestore_client()
        if client is None:
            _FALLBACK_REVIEWS.setdefault(property_id, []).append(review)
            return review

        client.collection("reviews").document(review.review_id).set(review.model_dump())
        return review

    def list_by_property(self, property_id: str) -> List[ReviewOut]:
        client = get_firestore_client()
        if client is None:
            return _FALLBACK_REVIEWS.get(property_id, [])

        docs = client.collection("reviews").where("property_id", "==", property_id).stream()
        return [ReviewOut(**doc.to_dict()) for doc in docs]


def fallback_review_count() -> int:
    return sum(len(items) for items in _FALLBACK_REVIEWS.values())
